import { Mail, LogOut, Upload, Lock, Eye, EyeOff, Bell, Moon } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'

type Section = 'profile' | 'password' | 'email' | 'settings'

export default function ProfileCard() {
  const { user, signOut } = useAuth()
  const [activeSection, setActiveSection] = useState<Section>('profile')
  const [profileImage, setProfileImage] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Password form
  const [showPassword, setShowPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Email form
  const [newEmail, setNewEmail] = useState(user?.email || '')
  const [emailLoading, setEmailLoading] = useState(false)

  // Settings
  const [settings, setSettings] = useState({
    emailNotifications: true,
    darkMode: false,
  })

  // Get initials from email
  const initials = user?.email
    ?.split('@')[0]
    .split('.')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?'

  // Load profile image from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('profileImage')
    if (saved) setProfileImage(saved)
    const savedSettings = localStorage.getItem('userSettings')
    if (savedSettings) setSettings(JSON.parse(savedSettings))
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      setProfileImage(base64)
      localStorage.setItem('profileImage', base64)
      // Trigger custom event for components to listen to
      window.dispatchEvent(new Event('profileImageUpdated'))
      setMessage({ type: 'success', text: 'Profile picture updated!' })
      setTimeout(() => setMessage(null), 2000)
    }
    reader.readAsDataURL(file)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) {
      setMessage({ type: 'error', text: 'Authentication is not configured for this deployment' })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setMessage({ type: 'success', text: 'Password updated successfully!' })
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setMessage(null), 2000)
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to update password',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) {
      setMessage({ type: 'error', text: 'Authentication is not configured for this deployment' })
      return
    }

    if (!newEmail || newEmail === user?.email) {
      setMessage({ type: 'error', text: 'Please enter a new email address' })
      return
    }

    setEmailLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail })
      if (error) throw error
      setMessage({
        type: 'success',
        text: 'Confirmation email sent to new address. Please verify.',
      })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to update email',
      })
    } finally {
      setEmailLoading(false)
    }
  }

  const handleSettingToggle = (key: keyof typeof settings) => {
    const updated = { ...settings, [key]: !settings[key] }
    setSettings(updated)
    localStorage.setItem('userSettings', JSON.stringify(updated))
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-soft overflow-hidden">
      {/* Alert Message */}
      {message && (
        <div
          className={`px-6 py-3 border-b ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50">
        {(['profile', 'password', 'email', 'settings'] as Section[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSection(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
              activeSection === tab
                ? 'border-brand text-brand'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Profile Section */}
        {activeSection === 'profile' && (
          <div className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-brand to-indigo-600 flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold text-white">{initials}</span>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-white border border-slate-200 rounded-lg p-2 hover:bg-slate-50 transition-colors"
                  title="Upload profile picture"
                >
                  <Upload className="w-4 h-4 text-slate-600" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-slate-500 text-center">
                Click the upload icon to change your profile picture
              </p>
            </div>

            {/* Account Info */}
            <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="text-xs text-slate-500 font-medium">Email</p>
                <p className="text-sm text-slate-900 font-semibold break-all">{user?.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Role</p>
                <p className="text-sm text-slate-900 font-semibold">Admin</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm font-medium text-emerald-700">Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Password Section */}
        {activeSection === 'password' && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <p className="text-sm text-slate-600 mb-4">Update your password to keep your account secure</p>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-brand hover:bg-brand/90 disabled:bg-brand/50 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        {/* Email Section */}
        {activeSection === 'email' && (
          <form onSubmit={handleUpdateEmail} className="space-y-4">
            <p className="text-sm text-slate-600 mb-4">
              A verification email will be sent to your new address
            </p>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Current Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">New Email</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter new email address"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              />
            </div>

            <button
              type="submit"
              disabled={emailLoading}
              className="w-full px-4 py-2 bg-brand hover:bg-brand/90 disabled:bg-brand/50 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              {emailLoading ? 'Sending...' : 'Update Email'}
            </button>
          </form>
        )}

        {/* Settings Section */}
        {activeSection === 'settings' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 mb-4">Manage your account preferences</p>

            {/* Email Notifications */}
            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Email Notifications</p>
                  <p className="text-xs text-slate-500">Receive updates about your conversations</p>
                </div>
              </div>
              <button
                onClick={() => handleSettingToggle('emailNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailNotifications ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Dark Mode</p>
                  <p className="text-xs text-slate-500">Coming soon - easier on the eyes</p>
                </div>
              </div>
              <button
                disabled
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors opacity-50 cursor-not-allowed ${
                  settings.darkMode ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
        <button
          onClick={handleSignOut}
          className="w-full px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
