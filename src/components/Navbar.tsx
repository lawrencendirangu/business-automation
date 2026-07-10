import { Bell, Search } from 'lucide-react'

interface NavbarProps {
  searchValue: string
  onSearchChange: (value: string) => void
}

function Navbar({ searchValue, onSearchChange }: NavbarProps) {
  return (
    <header className="rounded-xl2 border border-slate-200/80 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Welcome back! Here&apos;s what&apos;s happening today.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <label className="flex min-w-[220px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition-colors focus-within:border-brand/50 focus-within:bg-white">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search customers or automations"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>

          <button
            type="button"
            className="relative rounded-xl border border-slate-200 bg-slate-50 p-2.5 transition-all hover:-translate-y-0.5 hover:bg-white"
          >
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand" />
          </button>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-indigo-600 text-sm font-semibold text-white">
            LK
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar