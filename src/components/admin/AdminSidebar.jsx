import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiGrid,
  FiPackage,
  FiLayers,
  FiUsers,
  FiCalendar,
  FiShoppingBag,
  FiCreditCard,
  FiStar,
  FiSettings,
  FiLogOut,
  FiX,
} from 'react-icons/fi'
import { useCompleteLogout } from '../../hooks/useCompleteLogout'

const NAV_ITEMS = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
  { path: '/admin/products', label: 'Products', icon: FiPackage },
  { path: '/admin/categories', label: 'Categories', icon: FiLayers },
  { path: '/admin/users', label: 'Users', icon: FiUsers },
  { path: '/admin/bookings', label: 'Bookings', icon: FiCalendar },
  { path: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
  { path: '/admin/payments', label: 'Payments', icon: FiCreditCard },
  { path: '/admin/reviews', label: 'Reviews', icon: FiStar },
  { path: '/admin/settings', label: 'Settings', icon: FiSettings },
]

const AdminSidebar = ({ isOpen, onClose }) => {
  const completeLogout = useCompleteLogout()

  const handleLogout = () => {
    completeLogout('/login')
  }

  const SidebarContent = (
    <div className="flex flex-col h-full bg-[#0a0a0a] border-r border-gold/15 text-white">
      {/* Brand Header */}
      <div className="p-6 border-b border-gold/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Zahara Logo"
            className="w-10 h-10 rounded-full object-cover border border-gold/40 shadow-md"
          />
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-lg font-bold text-gold tracking-widest leading-none">
              ZAHARA
            </h1>
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/50 mt-1">
              Admin Portal
            </p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-2 text-white/60 hover:text-gold transition-colors"
          >
            <FiX size={20} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-gold/15 text-gold border-l-4 border-gold shadow-[0_0_15px_rgba(212,175,55,0.15)] font-semibold'
                    : 'text-white/70 hover:text-gold hover:bg-white/5'
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-gold/10">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all duration-300 cursor-pointer"
        >
          <FiLogOut size={18} />
          <span>Logout Portal</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 z-50 lg:hidden"
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default AdminSidebar
