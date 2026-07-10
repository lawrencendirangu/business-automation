import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_DIR = path.join(__dirname, 'data')
const STORE_FILE = path.join(DATA_DIR, 'messages.json')

const initialStore = {
  messages: [],
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
    return parsed
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

  for (const message of incomingMessages) {
    if (!message.id || existingIds.has(message.id)) {
      continue
    }

    store.messages.push(message)
    existingIds.add(message.id)
  }

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
      const initials = message.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()

      return {
        id: message.id,
        customerName: message.name,
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
