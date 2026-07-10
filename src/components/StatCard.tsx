import type { Stat, TrendColor } from '../types/dashboard'

interface StatCardProps {
  stat: Stat
}

const trendStyles: Record<TrendColor, { stroke: string; badge: string }> = {
  purple: { stroke: '#7C3AED', badge: 'bg-violet-100 text-violet-700' },
  green: { stroke: '#16A34A', badge: 'bg-emerald-100 text-emerald-700' },
  blue: { stroke: '#2563EB', badge: 'bg-blue-100 text-blue-700' },
  orange: { stroke: '#EA580C', badge: 'bg-orange-100 text-orange-700' },
}

function StatCard({ stat }: StatCardProps) {
  const colors = trendStyles[stat.trendColor]

  return (
    <article className="group rounded-xl2 border border-slate-200/80 bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{stat.title}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{stat.value}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${colors.badge}`}>
          {stat.change}
        </span>
      </div>

      <svg viewBox="0 0 88 36" className="h-10 w-full">
        <path d={stat.trendPath} fill="none" stroke={colors.stroke} strokeWidth="2.7" />
      </svg>
    </article>
  )
}

export default StatCard