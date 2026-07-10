import type { Automation } from '../types/dashboard'

interface AutomationCardProps {
  automation: Automation
}

function AutomationCard({ automation }: AutomationCardProps) {
  return (
    <article className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition-all duration-200 hover:border-emerald-200 hover:bg-emerald-50/40 sm:p-4">
      <p className="text-sm font-medium text-slate-700">{automation.title}</p>
      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        {automation.isActive ? 'Active' : 'Inactive'}
      </span>
    </article>
  )
}

export default AutomationCard