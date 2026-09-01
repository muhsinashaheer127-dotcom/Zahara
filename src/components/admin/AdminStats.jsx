import { motion } from 'framer-motion'
import {
  FiPackage,
  FiCheckCircle,
  FiUsers,
  FiClock,
  FiCalendar,
  FiAward,
  FiDollarSign,
  FiAlertCircle,
} from 'react-icons/fi'

const STAT_CONFIG = [
  {
    key: 'totalProducts',
    label: 'Total Products',
    icon: FiPackage,
    color: 'from-amber-500/20 to-yellow-600/10',
    iconColor: 'text-amber-400',
    format: (v) => v,
  },
  {
    key: 'availableProducts',
    label: 'Available Products',
    icon: FiCheckCircle,
    color: 'from-emerald-500/20 to-green-600/10',
    iconColor: 'text-emerald-400',
    format: (v) => v,
  },
  {
    key: 'totalUsers',
    label: 'Total Users',
    icon: FiUsers,
    color: 'from-blue-500/20 to-indigo-600/10',
    iconColor: 'text-blue-400',
    format: (v) => v,
  },
  {
    key: 'activeRentals',
    label: 'Active Rentals',
    icon: FiClock,
    color: 'from-purple-500/20 to-violet-600/10',
    iconColor: 'text-purple-400',
    format: (v) => v,
  },
  {
    key: 'pendingBookings',
    label: 'Pending Bookings',
    icon: FiCalendar,
    color: 'from-orange-500/20 to-amber-600/10',
    iconColor: 'text-orange-400',
    format: (v) => v,
  },
  {
    key: 'completedBookings',
    label: 'Completed Bookings',
    icon: FiAward,
    color: 'from-teal-500/20 to-emerald-600/10',
    iconColor: 'text-teal-400',
    format: (v) => v,
  },
  {
    key: 'totalRevenue',
    label: 'Total Revenue',
    icon: FiDollarSign,
    color: 'from-yellow-500/25 to-amber-600/15',
    iconColor: 'text-gold',
    format: (v) => `₹${Number(v).toLocaleString('en-IN')}`,
  },
  {
    key: 'pendingPayments',
    label: 'Pending Payments',
    icon: FiAlertCircle,
    color: 'from-rose-500/20 to-red-600/10',
    iconColor: 'text-rose-400',
    format: (v) => `₹${Number(v).toLocaleString('en-IN')}`,
  },
]

const AdminStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {STAT_CONFIG.map((config, index) => {
        const Icon = config.icon
        const rawValue = stats ? stats[config.key] : 0
        const formattedValue = config.format ? config.format(rawValue) : rawValue

        return (
          <motion.div
            key={config.key}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`glass-card rounded-2xl p-5 border border-gold/15 bg-gradient-to-br ${config.color} luxury-shadow relative overflow-hidden group hover:border-gold/30 transition-all duration-300`}
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
                {config.label}
              </span>
              <div className={`p-2.5 rounded-xl bg-black/40 ${config.iconColor} border border-white/10 group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={18} />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <p className="text-2xl sm:text-3xl font-extrabold text-gold tracking-tight font-[family-name:var(--font-heading)]">
                {formattedValue}
              </p>
            </div>
            
            {/* Ambient Background Gold Glow */}
            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-gold/5 rounded-full blur-xl group-hover:bg-gold/15 transition-all duration-500 pointer-events-none" />
          </motion.div>
        )
      })}
    </div>
  )
}

export default AdminStats
