import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMenu, FiSearch, FiBell, FiUser, FiCheckCircle, FiGlobe } from 'react-icons/fi'
import { useAdminAuth } from '../../hooks/useAdminAuth'

const NOTIFICATIONS = [
  { id: 1, text: 'New booking request #ZH-BK-1003 received', time: '10m ago', unread: true },
  { id: 2, text: 'Product "Royal Emerald" stock low (2 left)', time: '1h ago', unread: true },
  { id: 3, text: 'Payment PAY-9002 confirmed (₹3,799)', time: '3h ago', unread: false },
]

const AdminHeader = ({ onMenuClick, searchTerm, setSearchTerm }) => {
  const { adminUser } = useAdminAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length

  return (
    <header className="sticky top-0 z-20 bg-[#0c0c0c]/90 backdrop-blur-md border-b border-gold/10 px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu & Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl border border-gold/20 text-gold hover:bg-gold/10 transition-colors"
          aria-label="Open Navigation"
        >
          <FiMenu size={20} />
        </button>
        <div>
          <h2 className="font-[family-name:var(--font-heading)] text-lg sm:text-xl font-bold text-gold tracking-wide">
            Zahara Admin Portal
          </h2>
          <p className="hidden sm:block text-xs text-white/50">
            Welcome back, {adminUser?.name || 'Administrator'}
          </p>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-md mx-2 hidden sm:block">
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold/60" size={16} />
          <input
            type="text"
            value={searchTerm || ''}
            onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
            placeholder="Search products, bookings, users..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-gold/50 transition-all"
          />
        </div>
      </div>

      {/* Right: Actions, Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Back to Main Website Button */}
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gold/30 bg-gold/10 hover:bg-gold/20 text-gold text-xs font-semibold transition-all duration-300 shadow-sm cursor-pointer"
          title="Return to customer website"
        >
          <FiGlobe size={15} />
          <span className="hidden sm:inline">Back to Site</span>
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowProfileMenu(false)
            }}
            className="relative p-2.5 rounded-xl border border-gold/20 text-white/80 hover:text-gold hover:bg-white/5 transition-all"
            aria-label="Notifications"
          >
            <FiBell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-gold rounded-full ring-2 ring-black" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-[#121212] border border-gold/20 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-3">
                <span className="text-sm font-bold text-gold">Notifications</span>
                <span className="text-[10px] text-gold/70 bg-gold/10 px-2 py-0.5 rounded-full">
                  {unreadCount} New
                </span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {NOTIFICATIONS.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl text-xs flex gap-2.5 items-start transition-colors ${
                      n.unread ? 'bg-gold/10 text-white border border-gold/20' : 'bg-white/5 text-white/70'
                    }`}
                  >
                    <FiCheckCircle className="text-gold shrink-0 mt-0.5" size={14} />
                    <div className="flex-1">
                      <p className="leading-snug">{n.text}</p>
                      <span className="text-[10px] text-white/40 mt-1 block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Pill & Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu)
              setShowNotifications(false)
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gold/20 bg-white/5 hover:border-gold/40 transition-all cursor-pointer"
          >
            <img
              src={adminUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt="Admin Avatar"
              className="w-7 h-7 rounded-full object-cover border border-gold/40"
            />
            <span className="text-xs font-semibold text-gold hidden md:block">
              {adminUser?.name || 'Admin'}
            </span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-[#121212] border border-gold/20 rounded-2xl shadow-2xl p-3 z-50">
              <div className="p-2 border-b border-white/10 mb-2">
                <p className="text-xs font-bold text-white">{adminUser?.name}</p>
                <p className="text-[11px] text-gold/70">{adminUser?.email}</p>
              </div>
              <div className="space-y-1">
                <Link
                  to="/"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/80 hover:text-gold hover:bg-white/5 transition-colors"
                >
                  <FiGlobe size={14} /> Back to Website
                </Link>
                <Link
                  to="/admin/settings"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/80 hover:text-gold hover:bg-white/5 transition-colors"
                >
                  <FiUser size={14} /> Admin Profile & Settings
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
