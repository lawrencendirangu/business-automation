import {
  Bot,
  ChartColumnBig,
  Gauge,
  MessageSquare,
  Settings,
  Users,
  WandSparkles,
} from 'lucide-react'
import type {
  Agent,
  Automation,
  Conversation,
  NavigationItem,
  Stat,
} from '../types/dashboard'

export const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', icon: Gauge },
  { label: 'Customers', icon: Users },
  { label: 'AI Agents', icon: Bot },
  { label: 'Conversations', icon: MessageSquare },
  { label: 'Automations', icon: WandSparkles },
  { label: 'Analytics', icon: ChartColumnBig },
  { label: 'Settings', icon: Settings },
]

export const stats: Stat[] = [
  {
    title: 'Total Leads',
    value: '128',
    change: '+18%',
    trendColor: 'purple',
    trendPath: 'M4 30 C 20 22, 34 24, 48 18 C 60 13, 72 16, 84 9',
  },
  {
    title: 'Active Customers',
    value: '56',
    change: '+12%',
    trendColor: 'green',
    trendPath: 'M4 30 C 16 26, 26 22, 38 19 C 52 15, 66 14, 84 8',
  },
  {
    title: 'Messages Today',
    value: '342',
    change: '+24%',
    trendColor: 'blue',
    trendPath: 'M4 29 C 18 28, 30 23, 44 20 C 56 18, 70 13, 84 7',
  },
  {
    title: 'AI Response Rate',
    value: '92%',
    change: '+8%',
    trendColor: 'orange',
    trendPath: 'M4 28 C 16 21, 30 25, 42 18 C 56 10, 68 13, 84 6',
  },
]

export const recentConversations: Conversation[] = [
  {
    id: 'conv-1',
    customerName: 'John Doe',
    lastMessage: 'Hi, I want to book a table for 4 people.',
    channel: 'WhatsApp',
    timeAgo: '2 min ago',
    avatar: 'JD',
  },
  {
    id: 'conv-2',
    customerName: 'Aisha Kareem',
    lastMessage: 'Can someone confirm tomorrow appointment at 10 AM?',
    channel: 'WhatsApp',
    timeAgo: '8 min ago',
    avatar: 'AK',
  },
  {
    id: 'conv-3',
    customerName: 'Michael Ray',
    lastMessage: 'I missed your call, please share the project quotation.',
    channel: 'WhatsApp',
    timeAgo: '14 min ago',
    avatar: 'MR',
  },
  {
    id: 'conv-4',
    customerName: 'Sana Ibrahim',
    lastMessage: 'Is there a payment link I can use right now?',
    channel: 'WhatsApp',
    timeAgo: '24 min ago',
    avatar: 'SI',
  },
  {
    id: 'conv-5',
    customerName: 'David Omondi',
    lastMessage: 'Please add this booking to Friday evening schedule.',
    channel: 'WhatsApp',
    timeAgo: '37 min ago',
    avatar: 'DO',
  },
  {
    id: 'conv-6',
    customerName: 'Fatima Noor',
    lastMessage: 'Thanks, the automation flow is working perfectly.',
    channel: 'WhatsApp',
    timeAgo: '51 min ago',
    avatar: 'FN',
  },
]

export const activeAutomations: Automation[] = [
  {
    id: 'auto-1',
    title: 'New Lead -> Send Welcome Message',
    isActive: true,
  },
  {
    id: 'auto-2',
    title: 'Missed Call -> Send WhatsApp',
    isActive: true,
  },
  {
    id: 'auto-3',
    title: 'Website Form -> Notify Owner',
    isActive: true,
  },
  {
    id: 'auto-4',
    title: 'Booking -> Add to Calendar',
    isActive: true,
  },
]

export const agents: Agent[] = [
  { id: 'agent-1', name: 'Restaurant Bot', status: 'Running' },
  { id: 'agent-2', name: 'Clinic Assistant', status: 'Paused' },
  { id: 'agent-3', name: 'Construction Assistant', status: 'Running' },
]