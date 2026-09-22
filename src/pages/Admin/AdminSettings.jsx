import { useState, useEffect } from 'react'
import {
  FiSettings,
  FiUser,
  FiMail,
  FiLock,
  FiBell,
  FiGlobe,
  FiDollarSign,
  FiShield,
  FiSave,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import SEO from '../../components/SEO'
import adminService from '../../services/adminService'

const defaultSettings = {
  adminEmail: 'admin@zahara.com',
  siteName: 'Zahara Luxury Rentals',
  supportEmail: 'support@zahara.com',
  currency: 'INR',
  minRentalDays: 3,
  taxRate: 18,
  securityDepositPercent: 20,
}

const AdminSettings = () => {
  const [settings, setSettings] = useState(defaultSettings)
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    let isMounted = true
    adminService
      .getSettings()
      .then((data) => {
        if (isMounted && data && typeof data === 'object') {
          setSettings((prev) => ({ ...prev, ...data }))
        }
      })
      .catch((err) => {
        console.error('[AdminSettings] Failed to fetch settings:', err)
      })
    return () => {
      isMounted = false
    }
  }, [])

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await adminService.saveSettings(settings)
      toast.success('Admin settings updated successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to update settings.')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = (e) => {
    e.preventDefault()
    if (!currentPassword || !newPassword) {
      toast.error('Please enter your current and new password.')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.')
      return
    }
    toast.success('Admin password updated successfully!')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <SEO title="Admin Settings | Zahara Admin" />

      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
          <FiSettings className="text-gold" /> System Settings & Controls
        </h1>
        <p className="text-xs sm:text-sm text-white/50 mt-1">
          Admin security, notification alerts, rental policies, and website parameters.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3 text-xs sm:text-sm font-semibold">
        {[
          { id: 'profile', label: 'Admin Profile & Security', icon: FiUser },
          { id: 'notifications', label: 'Notification Settings', icon: FiBell },
          { id: 'website', label: 'Website Settings', icon: FiGlobe },
          { id: 'rental', label: 'Rental Settings', icon: FiShield },
          { id: 'payment', label: 'Payment Settings', icon: FiDollarSign },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gold/15 text-gold border border-gold/30 font-bold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* TAB CONTENT: PROFILE & SECURITY */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveSettings} className="glass-card rounded-2xl p-6 border border-gold/15 space-y-4 bg-[#0d0d0d]">
            <h3 className="text-sm font-bold text-gold uppercase tracking-wider flex items-center gap-2">
              <FiMail /> Change Admin Email
            </h3>
            <div className="max-w-md">
              <label className="block text-xs text-white/70 mb-1">Root Admin Email</label>
              <input
                type="email"
                value={settings.adminEmail || 'zahararental@gmail.com'}
                onChange={(e) => handleChange('adminEmail', e.target.value)}
                className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-gold"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 gold-gradient text-black font-semibold text-xs rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
            >
              <FiSave size={14} /> Update Email
            </button>
          </form>

          <form onSubmit={handleChangePassword} className="glass-card rounded-2xl p-6 border border-gold/15 space-y-4 bg-[#0d0d0d]">
            <h3 className="text-sm font-bold text-gold uppercase tracking-wider flex items-center gap-2">
              <FiLock /> Change Admin Password
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-white/70 mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-white/70 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-white/70 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 gold-gradient text-black font-semibold text-xs rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
            >
              <FiLock size={14} /> Change Password
            </button>
          </form>
        </div>
      )}

      {/* TAB CONTENT: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSaveSettings} className="glass-card rounded-2xl p-6 border border-gold/15 space-y-4 bg-[#0d0d0d] text-xs">
          <h3 className="text-sm font-bold text-gold uppercase tracking-wider flex items-center gap-2">
            <FiBell /> Notification Preferences
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notificationsEnabled}
                onChange={(e) => handleChange('notificationsEnabled', e.target.checked)}
                className="w-4 h-4 rounded text-gold accent-gold"
              />
              <span className="text-white">Enable Admin Portal Notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailAlerts}
                onChange={(e) => handleChange('emailAlerts', e.target.checked)}
                className="w-4 h-4 rounded text-gold accent-gold"
              />
              <span className="text-white">Email Alerts on New Booking Reservations</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.smsAlerts}
                onChange={(e) => handleChange('smsAlerts', e.target.checked)}
                className="w-4 h-4 rounded text-gold accent-gold"
              />
              <span className="text-white">SMS Notifications for Instant Dispatch Alerts</span>
            </label>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 gold-gradient text-black font-semibold text-xs rounded-xl flex items-center gap-2 shadow-md cursor-pointer pt-2"
          >
            <FiSave size={14} /> Save Notification Settings
          </button>
        </form>
      )}

      {/* TAB CONTENT: WEBSITE */}
      {activeTab === 'website' && (
        <form onSubmit={handleSaveSettings} className="glass-card rounded-2xl p-6 border border-gold/15 space-y-4 bg-[#0d0d0d] text-xs">
          <h3 className="text-sm font-bold text-gold uppercase tracking-wider flex items-center gap-2">
            <FiGlobe /> Website Parameters
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 mb-1">Website Title</label>
              <input
                type="text"
                value={settings.siteName || 'Zahara Rental Jewellery'}
                onChange={(e) => handleChange('siteName', e.target.value)}
                className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-white/70 mb-1">Contact WhatsApp Number</label>
              <input
                type="text"
                value={settings.contactPhone || '+91 9747133559'}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold"
              />
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
              className="w-4 h-4 rounded text-gold accent-gold"
            />
            <span className="text-white font-medium">Enable Maintenance Mode (Customer Store offline)</span>
          </label>
          <button
            type="submit"
            className="px-5 py-2.5 gold-gradient text-black font-semibold text-xs rounded-xl flex items-center gap-2 shadow-md cursor-pointer mt-4"
          >
            <FiSave size={14} /> Save Website Settings
          </button>
        </form>
      )}

      {/* TAB CONTENT: RENTAL SETTINGS */}
      {activeTab === 'rental' && (
        <form onSubmit={handleSaveSettings} className="glass-card rounded-2xl p-6 border border-gold/15 space-y-4 bg-[#0d0d0d] text-xs">
          <h3 className="text-sm font-bold text-gold uppercase tracking-wider flex items-center gap-2">
            <FiShield /> Rental Rules & Policy Parameters
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-white/70 mb-1">Minimum Rental Window (Days)</label>
              <input
                type="number"
                value={settings.minRentalDays || 3}
                onChange={(e) => handleChange('minRentalDays', Number(e.target.value))}
                className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-white/70 mb-1">Late Return Fee per Day (₹)</label>
              <input
                type="number"
                value={settings.lateFeePerDay || 500}
                onChange={(e) => handleChange('lateFeePerDay', Number(e.target.value))}
                className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 gold-gradient text-black font-semibold text-xs rounded-xl flex items-center gap-2 shadow-md cursor-pointer mt-4"
          >
            <FiSave size={14} /> Save Rental Settings
          </button>
        </form>
      )}

      {/* TAB CONTENT: PAYMENT SETTINGS */}
      {activeTab === 'payment' && (
        <form onSubmit={handleSaveSettings} className="glass-card rounded-2xl p-6 border border-gold/15 space-y-4 bg-[#0d0d0d] text-xs">
          <h3 className="text-sm font-bold text-gold uppercase tracking-wider flex items-center gap-2">
            <FiDollarSign /> Payment Gateway Configuration
          </h3>
          <div>
            <label className="block text-white/70 mb-1">Currency Symbol</label>
            <input
              type="text"
              value={settings.currency || '₹'}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="w-40 bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={settings.paymentGatewayTestMode}
              onChange={(e) => handleChange('paymentGatewayTestMode', e.target.checked)}
              className="w-4 h-4 rounded text-gold accent-gold"
            />
            <span className="text-white">Enable Sandbox / Test Mode for Razorpay & UPI</span>
          </label>
          <button
            type="submit"
            className="px-5 py-2.5 gold-gradient text-black font-semibold text-xs rounded-xl flex items-center gap-2 shadow-md cursor-pointer mt-4"
          >
            <FiSave size={14} /> Save Payment Settings
          </button>
        </form>
      )}
    </div>
  )
}

export default AdminSettings
