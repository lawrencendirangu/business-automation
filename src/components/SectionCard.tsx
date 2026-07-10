import type { ReactNode } from 'react'

interface SectionCardProps {
  title: string
  subtitle?: string
  children: ReactNode
}

function SectionCard({ title, subtitle, children }: SectionCardProps) {
  return (
    <section className="rounded-xl2 border border-slate-200/80 bg-white p-5 shadow-soft sm:p-6">
      <header className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
      </header>
      {children}
    </section>
  )
}

export default SectionCard