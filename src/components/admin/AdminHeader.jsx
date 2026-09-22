import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FiMenu, FiSearch, FiBell, FiUser, FiCheckCircle, FiGlobe,
  FiDatabase, FiAlertTriangle, FiX, FiExternalLink, FiRefreshCw,
} from 'react-icons/fi'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import { checkBackendHealth } from '../../services/api'

const NOTIFICATIONS = [
  { id: 1, text: 'New booking request #ZH-BK-1003 received', time: '10m ago', unread: true },
  { id: 2, text: 'Product "Royal Emerald" stock low (2 left)', time: '1h ago', unread: true },
  { id: 3, text: 'Payment PAY-9002 confirmed (₹3,799)', time: '3h ago', unread: false },
]

const AdminHeader = ({ onMenuClick, searchTerm, setSearchTerm }) => {
  const { adminUser } = useAdminAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showDBModal, setShowDBModal] = useState(false)
  const [dbStatus, setDbStatus] = useState(null)
  const [isRefreshingDB, setIsRefreshingDB] = useState(false)

  const fetchDBHealth = async () => {
    setIsRefreshingDB(true)
    try {
      const data = await checkBackendHealth()
      setDbStatus(data)
    } catch {
      setDbStatus({ status: 'offline' })
    } finally {
      setIsRefreshingDB(false)
    }
  }

  useEffect(() => {
    fetchDBHealth()
    const timer = setInterval(fetchDBHealth, 25000)
    return () => clearInterval(timer)
  }, [])

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length
  const isMongoLive = dbStatus?.database?.isConnected

  return (
    <>
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

        {/* Right: DB Badge, Actions, Notifications & Profile */}
        <div className="flex items-center gap-2.5">
          {/* Database Live Status Badge */}
          <button
            type="button"
            onClick={() => setShowDBModal(true)}
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer ${
              isMongoLive
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
            }`}
            title="Click to view database connection status & IP whitelist"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isMongoLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="font-mono text-[11px]">
              {isMongoLive ? 'MongoDB Atlas' : 'Local Store'}
            </span>
          </button>

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

      {/* Database Diagnostic Modal */}
      {showDBModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-gold/30 rounded-2xl p-6 max-w-lg w-full text-white shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowDBModal(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <FiX size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-3 rounded-xl border ${
                  isMongoLive
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}
              >
                <FiDatabase size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Database Status</h3>
                <p className="text-xs text-white/60">
                  {isMongoLive ? 'Connected to MongoDB Atlas' : 'Running in Local Fallback Mode'}
                </p>
              </div>
            </div>

            <div className="space-y-3 bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-mono mb-4">
              <div className="flex justify-between">
                <span className="text-white/60">Status:</span>
                <span className={isMongoLive ? 'text-emerald-400 font-bold' : 'text-amber-300 font-bold'}>
                  {dbStatus?.database?.state?.toUpperCase() || 'OFFLINE'}
                </span>
              </div>
              {isMongoLive ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-white/60">Cluster Host:</span>
                    <span className="text-white/90">{dbStatus?.database?.host}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Database:</span>
                    <span className="text-gold">{dbStatus?.database?.name}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-white/60">Your Public IP:</span>
                    <span className="text-cyan-400 font-bold">
                      {dbStatus?.database?.publicIP || '106.76.191.171'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Store Mode:</span>
                    <span className="text-amber-300">Local In-Memory (Zero Downtime)</span>
                  </div>
                </>
              )}
            </div>

            {!isMongoLive && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-4 text-xs space-y-2 text-white/80">
                <div className="flex items-center gap-2 font-semibold text-amber-300">
                  <FiAlertTriangle size={15} />
                  <span>How to Connect MongoDB Atlas</span>
                </div>
                <p className="leading-relaxed">
                  Your IP is blocked by MongoDB Atlas Network Access. To activate live cloud database storage:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-white/70 pl-1">
                  <li>
                    Open{' '}
                    <a
                      href="https://cloud.mongodb.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-gold underline inline-flex items-center gap-1"
                    >
                      MongoDB Atlas <FiExternalLink size={11} />
                    </a>
                  </li>
                  <li>Click <strong>Network Access</strong> in the left sidebar</li>
                  <li>Click <strong>Add IP Address</strong></li>
                  <li>
                    Add <strong>0.0.0.0/0</strong> (or your current IP{' '}
                    <code className="text-cyan-300 bg-white/10 px-1 rounded">
                      {dbStatus?.database?.publicIP || '106.76.191.171'}
                    </code>
                    )
                  </li>
                  <li>Click <strong>Confirm</strong> and wait ~30 seconds</li>
                </ol>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-white/40">
                Backend API: <code>http://localhost:5000</code>
              </span>
              <button
                type="button"
                onClick={fetchDBHealth}
                disabled={isRefreshingDB}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gold/30 bg-gold/10 hover:bg-gold/20 text-gold text-xs font-medium cursor-pointer transition-all disabled:opacity-50"
              >
                <FiRefreshCw size={12} className={isRefreshingDB ? 'animate-spin' : ''} />
                <span>{isRefreshingDB ? 'Checking...' : 'Check Connection'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminHeader
