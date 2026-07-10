import type {
  InboxConversation,
  InboxMessage,
  InboxNotificationSummary,
} from '../types/dashboard'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8010').replace(
  /\/$/,
  '',
)

interface InboxConversationsResponse {
  count: number
  conversations: Array<{
    id: string
    customer_name: string
    customer_phone: string
    unread_count: number
    needs_human: boolean
    last_human_request_at: string | null
    last_message_preview: string
    last_message_at: string | null
    message_count: number
    ai_mode: string
  }>
}

interface InboxNotificationsResponse {
  needs_human_count: number
  unread_total: number
}

interface InboxConversationDetailsResponse {
  conversation: InboxConversationsResponse['conversations'][number]
  messages: Array<{
    id: string
    sender: InboxMessage['sender']
    content: string
    timestamp: string
  }>
}

function mapConversation(conversation: InboxConversationsResponse['conversations'][number]): InboxConversation {
  return {
    id: conversation.id,
    customerName: conversation.customer_name,
    customerPhone: conversation.customer_phone,
    unreadCount: conversation.unread_count,
    needsHuman: conversation.needs_human,
    lastHumanRequestAt: conversation.last_human_request_at,
    lastMessagePreview: conversation.last_message_preview,
    lastMessageAt: conversation.last_message_at,
    messageCount: conversation.message_count,
    aiMode: conversation.ai_mode,
  }
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  })

  if (!response.ok) {
    throw new Error(`Inbox API request failed (${response.status})`)
  }

  if (response.status === 204) {
    return null as T
  }

  return (await response.json()) as T
}

export async function getInboxConversations(): Promise<InboxConversation[]> {
  const payload = await apiRequest<InboxConversationsResponse>('/inbox/conversations')
  return (payload.conversations || []).map(mapConversation)
}

export async function getInboxNotifications(): Promise<InboxNotificationSummary> {
  const payload = await apiRequest<InboxNotificationsResponse>('/inbox/notifications')

  return {
    needsHumanCount: payload.needs_human_count,
    unreadTotal: payload.unread_total,
  }
}

export async function getInboxConversationDetails(conversationId: string): Promise<{
  conversation: InboxConversation
  messages: InboxMessage[]
}> {
  const payload = await apiRequest<InboxConversationDetailsResponse>(
    `/inbox/conversations/${conversationId}`,
  )

  return {
    conversation: mapConversation(payload.conversation),
    messages: payload.messages || [],
  }
}

export async function replyToInboxConversation(conversationId: string, message: string): Promise<void> {
  await apiRequest(`/inbox/conversations/${conversationId}/reply`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  })
}

export async function takeoverInboxConversation(conversationId: string): Promise<void> {
  await apiRequest(`/inbox/conversations/${conversationId}/takeover`, {
    method: 'POST',
  })
}

export async function resumeInboxConversationAi(conversationId: string): Promise<void> {
  await apiRequest(`/inbox/conversations/${conversationId}/resume-ai`, {
    method: 'POST',
  })
}
