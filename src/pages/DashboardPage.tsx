import { useMemo, useState } from 'react'
import AgentCard from '../components/AgentCard'
import AutomationCard from '../components/AutomationCard'
import InboxPanel from '../components/InboxPanel'
import Navbar from '../components/Navbar'
import ProfileCard from '../components/ProfileCard'
import SectionCard from '../components/SectionCard'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import { useDashboardData } from '../hooks/useDashboardData'
import { useInboxData } from '../hooks/useInboxData'

function DashboardPage() {
  const { navigationItems, stats, activeAutomations, agents } = useDashboardData()
  const {
    conversations,
    notifications,
    selectedConversationId,
    selectedConversation,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    isActionPending,
    error,
    setSelectedConversationId,
    sendReply,
    takeover,
    resumeAi,
  } = useInboxData()
  const [activeSection, setActiveSection] = useState('Dashboard')
  const [searchValue, setSearchValue] = useState('')

  const normalizedSearch = searchValue.trim().toLowerCase()

  const filteredConversations = useMemo(() => {
    if (!normalizedSearch) {
      return conversations
    }

    return conversations.filter((conversation) => {
      const haystack = `${conversation.customerName} ${conversation.customerPhone} ${conversation.lastMessagePreview} ${conversation.aiMode}`.toLowerCase()
      return haystack.includes(normalizedSearch)
    })
  }, [conversations, normalizedSearch])

  const filteredAutomations = useMemo(() => {
    if (!normalizedSearch) {
      return activeAutomations
    }

    return activeAutomations.filter((automation) =>
      automation.title.toLowerCase().includes(normalizedSearch),
    )
  }, [activeAutomations, normalizedSearch])

  const filteredAgents = useMemo(() => {
    if (!normalizedSearch) {
      return agents
    }

    return agents.filter((agent) => {
      const haystack = `${agent.name} ${agent.status}`.toLowerCase()
      return haystack.includes(normalizedSearch)
    })
  }, [agents, normalizedSearch])

  const showOverview = activeSection === 'Dashboard' || activeSection === 'Analytics'
  const showConversations =
    activeSection === 'Dashboard' || activeSection === 'Conversations' || activeSection === 'Customers'
  const showAutomations = activeSection === 'Dashboard' || activeSection === 'Automations'
  const showAgents = activeSection === 'Dashboard' || activeSection === 'AI Agents'
  const showProfile = activeSection === 'Profile'

  return (
    <main className="mobile-force-stack mx-auto flex w-full max-w-[1700px] flex-col gap-4 overflow-x-hidden p-4 sm:gap-5 sm:p-5 xl:flex-row xl:gap-6 xl:p-6">
      <Sidebar
        items={navigationItems}
        activeItem={activeSection}
        onSelect={setActiveSection}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-5 lg:gap-6">
        <Navbar searchValue={searchValue} onSearchChange={setSearchValue} />

        {showOverview ? (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.title} stat={stat} />
            ))}
          </section>
        ) : null}

        {showProfile ? (
          <section className="max-w-md">
            <ProfileCard />
          </section>
        ) : null}

        {!showProfile ? (
          <section className="grid grid-cols-1 gap-4 xl:grid-cols-10">
          {showConversations ? (
            <div className={showAutomations || showAgents ? 'xl:col-span-7' : 'xl:col-span-10'}>
              <InboxPanel
                conversations={filteredConversations}
                notifications={notifications}
                selectedConversationId={selectedConversationId}
                selectedConversation={selectedConversation}
                messages={messages}
                isLoadingConversations={isLoadingConversations}
                isLoadingMessages={isLoadingMessages}
                isActionPending={isActionPending}
                error={error}
                onSelectConversation={setSelectedConversationId}
                onSendReply={sendReply}
                onTakeover={takeover}
                onResumeAi={resumeAi}
              />
            </div>
          ) : null}

          {showAutomations || showAgents ? (
            <div
              className={`space-y-4 ${showConversations ? 'xl:col-span-3' : 'xl:col-span-10'}`}
            >
              {showAutomations ? (
                <SectionCard
                  title="Active Automations"
                  subtitle="Business flows currently running"
                >
                  <div className="space-y-3">
                    {filteredAutomations.map((automation) => (
                      <AutomationCard key={automation.id} automation={automation} />
                    ))}
                    {filteredAutomations.length === 0 ? (
                      <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">
                        No automations match your search.
                      </p>
                    ) : null}
                  </div>
                </SectionCard>
              ) : null}

              {showAgents ? (
                <SectionCard
                  title="AI Agents"
                  subtitle="Current execution status across assistants"
                >
                  <div className="space-y-3">
                    {filteredAgents.map((agent) => (
                      <AgentCard key={agent.id} agent={agent} />
                    ))}
                    {filteredAgents.length === 0 ? (
                      <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">
                        No agents match your search.
                      </p>
                    ) : null}
                  </div>
                </SectionCard>
              ) : null}
            </div>
          ) : null}
        </section>
        ) : null}
      </div>
    </main>
  )
}

export default DashboardPage