import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiPackage,
  FiUsers,
  FiCalendar,
  FiShoppingBag,
  FiCreditCard,
  FiTrendingUp,
  FiArrowRight,
  FiClock,
} from 'react-icons/fi'
import AdminStats from '../../components/admin/AdminStats'
import AdminTable from '../../components/admin/AdminTable'
import SEO from '../../components/SEO'
import adminService from '../../services/adminService'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentBookings, setRecentBookings] = useState([])
  const [recentProducts, setRecentProducts] = useState([])

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('zh_admin_data_updated', handleUpdate)
    return () => window.removeEventListener('zh_admin_data_updated', handleUpdate)
  }, [])

  const loadData = () => {
    setStats(adminService.getStats())
    setRecentBookings(adminService.getBookings().slice(0, 5))
    setRecentProducts(adminService.getProducts().slice(0, 5))
  }

  const bookingColumns = [
    { header: 'Booking ID', accessorKey: 'id', render: (row) => <span className="font-semibold text-gold">{row.id}</span> },
    { header: 'Customer', accessorKey: 'customer' },
    { header: 'Product', accessorKey: 'product' },
    { header: 'Dates', render: (row) => <span className="text-xs text-white/70">{row.startDate} to {row.endDate}</span> },
    { header: 'Amount', render: (row) => <span className="text-gold font-bold">₹{row.price + row.deposit}</span> },
    {
      header: 'Status',
      render: (row) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
            row.bookingStatus === 'Confirmed'
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : row.bookingStatus === 'Active'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : row.bookingStatus === 'Returned'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}
        >
          {row.bookingStatus}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-8">
      <SEO title="Dashboard | Zahara Admin" />

      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-white tracking-wide">
            Overview Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-white/50 mt-1">
            Real-time analytics and jewellery rental management statistics.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2.5 gold-gradient text-black font-semibold text-xs rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-lg"
          >
            <FiPackage /> Manage Products
          </Link>
        </div>
      </div>

      {/* Dashboard Statistics Grid */}
      <AdminStats stats={stats} />

      {/* Quick Action Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/bookings"
          className="glass-card rounded-2xl p-6 border border-gold/20 hover:border-gold/50 transition-all duration-300 group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-gold/10 text-gold group-hover:scale-110 transition-transform">
              <FiCalendar size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-gold transition-colors">
                Pending Bookings
              </h3>
              <p className="text-xs text-white/50 mt-0.5">Review customer dates & deposits</p>
            </div>
          </div>
          <FiArrowRight className="text-gold/60 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/admin/orders"
          className="glass-card rounded-2xl p-6 border border-gold/20 hover:border-gold/50 transition-all duration-300 group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <FiShoppingBag size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-gold transition-colors">
                Rental Orders
              </h3>
              <p className="text-xs text-white/50 mt-0.5">Dispatch & return tracking</p>
            </div>
          </div>
          <FiArrowRight className="text-gold/60 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/admin/payments"
          className="glass-card rounded-2xl p-6 border border-gold/20 hover:border-gold/50 transition-all duration-300 group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-yellow-500/10 text-gold group-hover:scale-110 transition-transform">
              <FiCreditCard size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-gold transition-colors">
                Payment Statements
              </h3>
              <p className="text-xs text-white/50 mt-0.5">UPI, Cards & refunds</p>
            </div>
          </div>
          <FiArrowRight className="text-gold/60 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Main Content Layout: Recent Bookings & System Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings Table (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-gold flex items-center gap-2">
              <FiClock /> Recent Bookings
            </h3>
            <Link to="/admin/bookings" className="text-xs text-gold/80 hover:text-gold hover:underline">
              View All Bookings &rarr;
            </Link>
          </div>
          <AdminTable columns={bookingColumns} data={recentBookings} />
        </div>

        {/* Inventory Quick Overview (1 col) */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-gold flex items-center gap-2">
              <FiTrendingUp /> Top Jewellery
            </h3>
            <Link to="/admin/products" className="text-xs text-gold/80 hover:text-gold hover:underline">
              Manage Products &rarr;
            </Link>
          </div>
          <div className="glass-card rounded-2xl p-5 border border-gold/15 space-y-4 bg-[#0d0d0d]">
            {recentProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-3.5 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                <img
                  src={p.images?.[0]}
                  alt={p.name}
                  className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                  <p className="text-[11px] text-white/50 capitalize mt-0.5">{p.category.replace('-', ' ')}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-gold">₹{p.price}</span>
                  <span
                    className={`block text-[10px] uppercase font-bold mt-0.5 ${
                      p.availability === 'available'
                        ? 'text-emerald-400'
                        : p.availability === 'limited'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}
                  >
                    {p.availability}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
