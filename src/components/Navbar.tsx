import { Bell, Search, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect } from 'react'

interface NavbarProps {
  searchValue: string
  onSearchChange: (value: string) => void
}

function Navbar({ searchValue, onSearchChange }: NavbarProps) {
  const { user, signOut } = useAuth()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
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

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  // Get initials from email
  const initials = user?.email
    ?.split('@')[0]
    .split('.')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'LK'

  return (
    <header className="rounded-xl2 border border-slate-200/80 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Welcome back! Here&apos;s what&apos;s happening today.
          </p>
        </div>

        <div className="flex w-full flex-wrap items-center gap-3 md:w-auto md:justify-end">
          <label className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition-colors focus-within:border-brand/50 focus-within:bg-white sm:min-w-[220px] md:w-auto">
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

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-indigo-600 text-sm font-semibold text-white hover:shadow-lg transition-shadow overflow-hidden"
              title={user?.email || 'Profile'}
            >
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-lg z-50">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-medium text-slate-900">Signed in as</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar