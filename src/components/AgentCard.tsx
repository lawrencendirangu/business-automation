import type { Agent } from '../types/dashboard'

interface AgentCardProps {
  agent: Agent
}

function AgentCard({ agent }: AgentCardProps) {
  const isRunning = agent.status === 'Running'

  return (
    <article className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition-all duration-200 hover:border-violet-200 hover:bg-violet-50/40 sm:p-4">
      <p className="text-sm font-medium text-slate-700">{agent.name}</p>
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
          isRunning
            ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
            : 'border border-amber-200 bg-amber-50 text-amber-700'
        }`}
      >
        {agent.status}
      </span>
    </article>
  )
}

export default AgentCard