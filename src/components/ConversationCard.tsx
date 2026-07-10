import { MessageCircle } from 'lucide-react'
import type { Conversation } from '../types/dashboard'

interface ConversationCardProps {
  conversation: Conversation
}

function ConversationCard({ conversation }: ConversationCardProps) {
  return (
    <article className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md sm:p-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 text-xs font-semibold text-violet-700">
        {conversation.avatar}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-900">{conversation.customerName}</p>
          <p className="text-xs text-slate-400">{conversation.timeAgo}</p>
        </div>

        <p className="mt-1 truncate text-sm text-slate-500">{conversation.lastMessage}</p>

        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          <MessageCircle className="h-3.5 w-3.5" />
          {conversation.channel}
        </div>
      </div>
    </article>
  )
}

export default ConversationCard