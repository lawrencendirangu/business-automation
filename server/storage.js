import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_DIR = path.join(__dirname, 'data')
const STORE_FILE = path.join(DATA_DIR, 'messages.json')
const RETENTION_DAYS = {
  seen: 7,
  unread: 14,
}

const initialStore = {
  messages: [],
}

function nowSeconds() {
  return Math.floor(Date.now() / 1000)
}

function normalizeMessage(message, fallbackTimestamp = nowSeconds()) {
  const timestamp = Number(message.timestamp || message.createdAt || fallbackTimestamp)
  const conversationId = message.conversationId || message.from || message.id || `conversation-${timestamp}`

  return {
    ...message,
    id: message.id || `${conversationId}-${timestamp}`,
    conversationId,
    from: message.from || conversationId,
    name: message.name || 'Unknown contact',
    body: message.body || '',
    timestamp,
    createdAt: message.createdAt || timestamp,
    readAt: message.readAt || null,
    needsHuman: Boolean(message.needsHuman),
    sender: message.sender || (message.direction === 'outbound' ? 'ai' : 'customer'),
  }
}

function pruneExpiredMessages(messages) {
  const cutoff = nowSeconds()

  return messages
    .map((message) => normalizeMessage(message, cutoff))
    .filter((message) => {
      const timestamp = Number(message.timestamp || message.createdAt || cutoff)
      const retentionDays = message.readAt ? RETENTION_DAYS.seen : RETENTION_DAYS.unread
      const retentionSeconds = retentionDays * 24 * 60 * 60
      return cutoff <= timestamp + retentionSeconds
    })
}

async function ensureStore() {
  await mkdir(DATA_DIR, { recursive: true })

  try {
    await readFile(STORE_FILE, 'utf-8')
  } catch {
    await writeFile(STORE_FILE, JSON.stringify(initialStore, null, 2), 'utf-8')
  }
}

export async function readStore() {
  await ensureStore()
  const raw = await readFile(STORE_FILE, 'utf-8')

  try {
    const parsed = JSON.parse(raw)
    if (!parsed.messages || !Array.isArray(parsed.messages)) {
      return initialStore
    }

    return {
      messages: parsed.messages.map((message) => normalizeMessage(message)),
    }
  } catch {
    return initialStore
  }
}

export async function writeStore(nextStore) {
  await ensureStore()
  await writeFile(STORE_FILE, JSON.stringify(nextStore, null, 2), 'utf-8')
}

export async function upsertMessages(incomingMessages) {
  if (!Array.isArray(incomingMessages) || incomingMessages.length === 0) {
    return
  }

  const store = await readStore()
  const existingIds = new Set(store.messages.map((message) => message.id))

  for (const incoming of incomingMessages) {
    const normalized = normalizeMessage({
      ...incoming,
      sender: incoming.sender || 'customer',
      conversationId: incoming.conversationId || incoming.from || incoming.id,
    })

    if (!normalized.id || existingIds.has(normalized.id)) {
      continue
    }

    store.messages.push(normalized)
    existingIds.add(normalized.id)
  }

  store.messages = pruneExpiredMessages(store.messages)
  await writeStore(store)
}

function buildConversationSummary(conversationId, messages) {
  const sortedMessages = [...messages].sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
  const latestMessage = sortedMessages[0] || null
  const unreadCount = sortedMessages.filter((message) => !message.readAt).length
  const needsHuman = sortedMessages.some((message) => Boolean(message.needsHuman))

  let lastHumanRequestAt = null
  for (const message of sortedMessages) {
    if (message.needsHuman && message.timestamp) {
      lastHumanRequestAt = Number(message.timestamp)
    }
  }

  return {
    id: conversationId,
    customerName: latestMessage?.name || conversationId,
    customerPhone: conversationId,
    unreadCount,
    needsHuman,
    lastHumanRequestAt: lastHumanRequestAt ? new Date(lastHumanRequestAt * 1000).toISOString() : null,
    lastMessagePreview: latestMessage?.body || '',
    lastMessageAt: latestMessage?.timestamp
      ? new Date(Number(latestMessage.timestamp) * 1000).toISOString()
      : null,
    messageCount: sortedMessages.length,
    aiMode: latestMessage?.sender === 'ai' ? 'assistant' : 'assistant',
  }
}

export async function getInboxSnapshot(limit = 20) {
  const store = await readStore()
  const messages = pruneExpiredMessages(store.messages)
  const byConversation = new Map()

  for (const message of messages) {
    const conversationId = message.conversationId || message.from || message.id
    if (!byConversation.has(conversationId)) {
      byConversation.set(conversationId, [])
    }

    byConversation.get(conversationId).push(message)
  }

  const conversations = [...byConversation.entries()]
    .map(([conversationId, conversationMessages]) => buildConversationSummary(conversationId, conversationMessages))
    .sort((a, b) => Number(new Date(b.lastMessageAt || 0)) - Number(new Date(a.lastMessageAt || 0)))
    .slice(0, limit)

  const notifications = {
    needsHumanCount: conversations.filter((conversation) => conversation.needsHuman).length,
    unreadTotal: conversations.reduce((total, conversation) => total + conversation.unreadCount, 0),
  }

  return {
    conversations,
    notifications,
  }
}

export async function getInboxConversationDetails(conversationId, markAsRead = true) {
  const store = await readStore()
  const messages = pruneExpiredMessages(store.messages).filter((message) => {
    const matchId = message.conversationId || message.from || message.id
    return matchId === conversationId
  })

  if (markAsRead) {
    const now = nowSeconds()
    let changed = false

    for (const message of store.messages) {
      const matchId = message.conversationId || message.from || message.id
      if (matchId === conversationId && !message.readAt) {
        message.readAt = now
        changed = true
      }
    }

    if (changed) {
      store.messages = pruneExpiredMessages(store.messages)
      await writeStore(store)
    }
  }

  const conversation = buildConversationSummary(conversationId, messages)
  return {
    conversation,
    messages: messages
      .slice()
      .sort((a, b) => Number(a.timestamp) - Number(b.timestamp))
      .map((message) => ({
        id: message.id,
        sender: message.sender || 'customer',
        content: message.body,
        timestamp: new Date(Number(message.timestamp) * 1000).toISOString(),
      })),
  }
}

export async function appendInboxReply(conversationId, messageText) {
  const store = await readStore()
  const now = nowSeconds()
  const reply = normalizeMessage({
    id: `reply-${conversationId}-${now}`,
    conversationId,
    from: conversationId,
    name: 'You',
    body: messageText,
    timestamp: now,
    createdAt: now,
    sender: 'ai',
    direction: 'outbound',
    readAt: now,
  })

  store.messages.push(reply)
  store.messages = pruneExpiredMessages(store.messages)
  await writeStore(store)
  return reply
}

export async function updateConversationState(conversationId, nextState) {
  const store = await readStore()
  const now = nowSeconds()

  for (const message of store.messages) {
    const matchId = message.conversationId || message.from || message.id
    if (matchId === conversationId) {
      message.needsHuman = Boolean(nextState.needsHuman)
      message.readAt = message.readAt || now
    }
  }

  store.messages = pruneExpiredMessages(store.messages)
  await writeStore(store)
}

export function mapMessagesToConversations(messages, limit = 6) {
  const byCustomer = new Map()

  for (const message of messages) {
    const current = byCustomer.get(message.from)

    if (!current || Number(message.timestamp) > Number(current.timestamp)) {
      byCustomer.set(message.from, message)
    }
  }

  const conversations = [...byCustomer.values()]
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    .slice(0, limit)
    .map((message) => {
      const initials = (message.name || 'WA')
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()

      return {
        id: message.id,
        customerName: message.name || 'Unknown contact',
        lastMessage: message.body,
        channel: 'WhatsApp',
        timeAgo: formatTimeAgo(message.timestamp),
        avatar: initials || 'WA',
      }
    })

  return conversations
}

function formatTimeAgo(timestamp) {
  const nowMs = Date.now()
  const tsMs = Number(timestamp) * 1000
  const diffMinutes = Math.max(1, Math.floor((nowMs - tsMs) / 60000))

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`
  }

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) {
    return `${diffHours} hr ago`
  }

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} day ago`
}
