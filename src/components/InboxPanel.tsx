import { useMemo, useState } from 'react'
import { AlertCircle, Bot, MessageSquare, UserRound } from 'lucide-react'
import type {
  InboxConversation,
  InboxMessage,
  InboxNotificationSummary,
  InboxSender,
} from '../types/dashboard'

interface InboxPanelProps {
  conversations: InboxConversation[]
  notifications: InboxNotificationSummary
  selectedConversationId: string | null
  selectedConversation: InboxConversation | null
  messages: InboxMessage[]
  isLoadingConversations: boolean
  isLoadingMessages: boolean
  isActionPending: boolean
  error: string | null
  onSelectConversation: (conversationId: string) => void
  onSendReply: (message: string) => Promise<void>
  onTakeover: () => Promise<void>
  onResumeAi: () => Promise<void>
}

const senderStyles: Record<InboxSender, string> = {
  customer: 'self-start bg-slate-700 text-white',
  ai: 'self-end bg-emerald-100 text-emerald-900',
  agent: 'self-end bg-amber-100 text-amber-900',
  system: 'self-center bg-slate-200 text-slate-700',
}

function formatTimestamp(value: string | null): string {
  if (!value) {
    return '--'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString([], {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function buildModeLabel(aiMode: string): string {
  return aiMode === 'human' ? 'Human Active' : `AI ${aiMode}`
}

function InboxPanel({
  conversations,
  notifications,
  selectedConversationId,
  selectedConversation,
  messages,
  isLoadingConversations,
  isLoadingMessages,
  isActionPending,
  error,
  onSelectConversation,
  onSendReply,
  onTakeover,
  onResumeAi,
}: InboxPanelProps) {
  const [draft, setDraft] = useState('')

  const selectedConversationName = useMemo(
    () => selectedConversation?.customerName || 'No conversation selected',
    [selectedConversation],
  )

  const handleSendReply = async () => {
    const message = draft.trim()
    if (!message) {
      return
    }

    await onSendReply(message)
    setDraft('')
  }

  return (
    <div className="rounded-xl2 border border-slate-200/80 bg-white p-5 shadow-soft sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">Live Inbox</h3>
          <p className="mt-1 text-sm text-slate-500">
            Synced from your bot backend conversations and messages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            Human requests: {notifications.needsHumanCount}
          </span>
          <span className="rounded-full border border-brand/20 bg-violet-50 px-3 py-1 text-xs font-semibold text-brand">
            Unread: {notifications.unreadTotal}
          </span>
        </div>
      </div>

      {error ? (
        <div className="mb-4 flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <aside className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3 lg:col-span-4">
          <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
            {isLoadingConversations ? (
              <p className="rounded-xl bg-white p-3 text-sm text-slate-500">Loading inbox...</p>
            ) : null}

            {conversations.map((conversation) => {
              const isSelected = conversation.id === selectedConversationId

              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`w-full rounded-xl border p-3 text-left transition-all ${
                    isSelected
                      ? 'border-brand/40 bg-white shadow-sm'
                      : 'border-slate-200 bg-white hover:border-brand/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {conversation.customerName}
                    </p>
                    <span className="text-xs text-slate-400">
                      {formatTimestamp(conversation.lastMessageAt)}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-xs text-slate-500">{conversation.customerPhone}</p>
                  <p className="mt-2 truncate text-sm text-slate-600">
                    {conversation.lastMessagePreview}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                      {buildModeLabel(conversation.aiMode)}
                    </span>
                    {conversation.needsHuman ? (
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                        Needs human
                      </span>
                    ) : null}
                    {conversation.unreadCount > 0 ? (
                      <span className="rounded-full border border-brand/20 bg-violet-50 px-2 py-0.5 text-[11px] font-semibold text-brand">
                        Unread {conversation.unreadCount}
                      </span>
                    ) : null}
                  </div>
                </button>
              )
            })}

            {!isLoadingConversations && conversations.length === 0 ? (
              <p className="rounded-xl bg-white p-3 text-sm text-slate-500">
                No conversations available from the inbox backend.
              </p>
            ) : null}
          </div>
        </aside>

        <section className="flex min-h-[520px] flex-col rounded-2xl border border-slate-200 bg-slate-50/40 p-3 lg:col-span-8">
          <header className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
            <div>
              <p className="text-base font-semibold text-slate-900">{selectedConversationName}</p>
              <p className="text-xs text-slate-500">{selectedConversation?.customerPhone || '--'}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={!selectedConversation || isActionPending}
                onClick={onTakeover}
                className="rounded-full bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Take Over
              </button>
              <button
                type="button"
                disabled={!selectedConversation || isActionPending}
                onClick={onResumeAi}
                className="rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Resume AI
              </button>
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-2 overflow-y-auto rounded-xl border border-slate-200 bg-slate-950/95 p-3">
            {isLoadingMessages ? (
              <p className="text-sm text-slate-300">Refreshing messages...</p>
            ) : null}

            {messages.map((message) => (
              <article key={message.id} className="flex flex-col gap-1">
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${senderStyles[message.sender]}`}>
                  {message.content}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  {message.sender === 'customer' ? (
                    <UserRound className="h-3 w-3" />
                  ) : message.sender === 'ai' ? (
                    <Bot className="h-3 w-3" />
                  ) : (
                    <MessageSquare className="h-3 w-3" />
                  )}
                  <span>{message.sender}</span>
                  <span>·</span>
                  <span>{formatTimestamp(message.timestamp)}</span>
                </div>
              </article>
            ))}

            {!isLoadingMessages && messages.length === 0 ? (
              <p className="text-sm text-slate-300">No messages available for this conversation.</p>
            ) : null}
          </div>

          <div className="mt-3 flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row">
            <input
              type="text"
              value={draft}
              placeholder="Write a manual reply"
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  void handleSendReply()
                }
              }}
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition-colors focus:border-brand/50"
            />
            <button
              type="button"
              onClick={() => void handleSendReply()}
              disabled={!selectedConversation || isActionPending || !draft.trim()}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Send Reply
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default InboxPanel
