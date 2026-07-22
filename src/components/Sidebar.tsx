import { Sparkles } from 'lucide-react'
import type { NavigationItem } from '../types/dashboard'
import { useState, useEffect } from 'react'

interface SidebarProps {
  items: NavigationItem[]
  activeItem: string
  onSelect: (itemLabel: string) => void
}

function Sidebar({ items, activeItem, onSelect }: SidebarProps) {
  const [profileImage, setProfileImage] = useState<string>('')

  useEffect(() => {
    const saved = localStorage.getItem('profileImage')
    if (saved) setProfileImage(saved)

    // Listen for profile image updates
    const handleStorageChange = () => {
      const updated = localStorage.getItem('profileImage')
      if (updated) setProfileImage(updated)
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('profileImageUpdated', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('profileImageUpdated', handleStorageChange)
    }
  }, [])
  return (
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
          {items.map((item) => {
            const Icon = item.icon
            const isActive = item.label === activeItem

            return (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => onSelect(item.label)}
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
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-semibold text-white overflow-hidden">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            'BO'
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Al-Masar AI Automation</p>
          <p className="text-xs text-slate-400">Business Owner</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar