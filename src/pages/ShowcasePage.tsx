import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ExternalLink, Lock, Bot, Gauge, Users, MessageSquare, WandSparkles, ChartColumnBig, Settings, User } from 'lucide-react'
import InboxPanel from '../components/InboxPanel'
import StatCard from '../components/StatCard'
import { showcaseConversations, showcaseMessages, showcaseNotifications } from '../data/showcaseData'
import { stats } from '../data/mockData'
import type { NavigationItem } from '../types/dashboard'

const navItems: NavigationItem[] = [
  { label: 'Dashboard', icon: Gauge },
  { label: 'Customers', icon: Users },
  { label: 'AI Agents', icon: Bot },
  { label: 'Conversations', icon: MessageSquare },
  { label: 'Automations', icon: WandSparkles },
  { label: 'Analytics', icon: ChartColumnBig },
  { label: 'Profile', icon: User },
  { label: 'Settings', icon: Settings },
]

export default function ShowcasePage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string>('demo-1')
  const [searchValue, setSearchValue] = useState('')
  const [activeSection, setActiveSection] = useState('Dashboard')

  const selectedConversation = useMemo(
    () => showcaseConversations.find((c) => c.id === selectedConversationId) ?? null,
    [selectedConversationId],
  )

  const messages = useMemo(
    () => (selectedConversationId ? (showcaseMessages[selectedConversationId] ?? []) : []),
    [selectedConversationId],
  )

  const filteredConversations = useMemo(() => {
    const q = searchValue.trim().toLowerCase()
    if (!q) return showcaseConversations
    return showcaseConversations.filter((c) =>
      `${c.customerName} ${c.customerPhone} ${c.lastMessagePreview}`.toLowerCase().includes(q),
    )
  }, [searchValue])

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Demo Banner */}
      <div className="flex flex-wrap items-center justify-center gap-2 bg-gradient-to-r from-purple-700 to-indigo-700 px-4 py-2.5 text-center text-sm font-medium text-white sm:gap-3">
        <span className="inline-flex items-center gap-1.5 bg-white/20 px-2 py-0.5 rounded-full text-xs font-semibold">
          <Sparkles className="w-3 h-3" /> DEMO
        </span>
        <span className="max-w-3xl">This is a live showcase of the Al-Masar AI Automation Dashboard — using sample data.</span>
        <Link
          to="/login"
          className="ml-0 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-purple-700 transition-colors hover:bg-purple-50 sm:ml-2"
        >
          <Lock className="w-3 h-3" /> Admin Login
        </Link>
      </div>

      <main className="mx-auto flex w-full max-w-[1700px] flex-col gap-4 p-4 sm:gap-5 sm:p-5 lg:flex-row lg:gap-6 lg:p-6">
        {/* Sidebar */}
        <aside className="flex w-full flex-col rounded-3xl bg-slate-950 p-4 text-slate-100 shadow-soft lg:w-72 lg:p-5">
          <div className="mb-6 flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/20">
              <Sparkles className="h-5 w-5 text-brand" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Al-Masar</p>
              <p className="text-xs text-slate-400">AI Automation</p>
            </div>
          </div>

          <nav className="mb-6 overflow-x-auto lg:overflow-visible">
            <ul className="flex min-w-max gap-2 lg:min-w-0 lg:flex-col">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = item.label === activeSection
                return (
                  <li key={item.label}>
                    <button
                      onClick={() => setActiveSection(item.label)}
                      className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-brand text-white shadow-lg shadow-brand/30'
                          : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="whitespace-nowrap font-medium">{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="mt-auto flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-semibold text-white">
              AM
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Al-Masar AI Automation</p>
              <p className="text-xs text-slate-400">Business Owner</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-5 lg:gap-6">
          {/* Navbar */}
          <header className="rounded-xl2 border border-slate-200/80 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Al-Masar AI Automation — Live inbox and customer management.
                </p>
              </div>
              <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center md:w-auto">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand/50 focus:bg-white sm:min-w-[200px]"
                />
                <Link
                  to="/login"
                  className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Access Real Dashboard
                </Link>
              </div>
            </div>
          </header>

          {/* KPI Stats */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.title} stat={stat} />
            ))}
          </section>

          {/* Inbox Panel */}
          <InboxPanel
            conversations={filteredConversations}
            notifications={showcaseNotifications}
            selectedConversationId={selectedConversationId}
            selectedConversation={selectedConversation}
            messages={messages}
            isLoadingConversations={false}
            isLoadingMessages={false}
            isActionPending={false}
            error={null}
            onSelectConversation={setSelectedConversationId}
            onSendReply={async () => {}}
            onTakeover={async () => {}}
            onResumeAi={async () => {}}
          />

          {/* Footer */}
          <div className="text-center py-4 text-sm text-slate-500 border-t border-slate-200">
            Built by{' '}
            <a
              href="https://getalmasar.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline font-medium"
            >
              Al-Masar AI Automation
            </a>{' '}
            · All data shown is for demonstration purposes only.
          </div>
        </div>
      </main>
    </div>
  )
}
