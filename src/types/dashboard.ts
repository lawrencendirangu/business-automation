import type { LucideIcon } from 'lucide-react'

export type TrendColor = 'purple' | 'green' | 'blue' | 'orange'
export type AgentStatus = 'Running' | 'Paused'

export interface NavigationItem {
  label: string
  icon: LucideIcon
}

export interface Stat {
  title: string
  value: string
  change: string
  trendColor: TrendColor
  trendPath: string
}

export interface Conversation {
  id: string
  customerName: string
  lastMessage: string
  channel: string
  timeAgo: string
  avatar: string
}

export interface Automation {
  id: string
  title: string
  isActive: boolean
}

export interface Agent {
  id: string
  name: string
  status: AgentStatus
}

export type InboxSender = 'customer' | 'ai' | 'agent' | 'system'

export interface InboxConversation {
  id: string
  customerName: string
  customerPhone: string
  unreadCount: number
  needsHuman: boolean
  lastHumanRequestAt: string | null
  lastMessagePreview: string
  lastMessageAt: string | null
  messageCount: number
  aiMode: string
}

export interface InboxNotificationSummary {
  needsHumanCount: number
  unreadTotal: number
}

export interface InboxMessage {
  id: string
  sender: InboxSender
  content: string
  timestamp: string
}