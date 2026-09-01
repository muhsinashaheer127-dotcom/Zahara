import { useState, useEffect } from 'react'
import { FiCreditCard, FiSearch, FiFilter, FiDollarSign } from 'react-icons/fi'
import toast from 'react-hot-toast'
import AdminTable from '../../components/admin/AdminTable'
import SEO from '../../components/SEO'
import adminService from '../../services/adminService'

const AdminPayments = () => {
  const [payments, setPayments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadPayments()
    const handleUpdate = () => loadPayments()
    window.addEventListener('zh_admin_data_updated', handleUpdate)
    return () => window.removeEventListener('zh_admin_data_updated', handleUpdate)
  }, [])

  const loadPayments = () => {
    setPayments(adminService.getPayments())
  }

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.bookingId?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || p.paymentStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleUpdateStatus = (payId, status) => {
    adminService.updatePaymentStatus(payId, status)
    toast.success(`Payment ${payId} marked as ${status}`)
    loadPayments()
  }

  const columns = [
    { header: 'Payment ID', render: (p) => <span className="font-mono font-bold text-gold">{p.id}</span> },
    { header: 'Booking Ref', render: (p) => <span className="text-xs text-white/70">{p.bookingId}</span> },
    { header: 'Customer', accessorKey: 'customer' },
    { header: 'Amount', render: (p) => <span className="text-gold font-bold">₹{p.amount?.toLocaleString('en-IN')}</span> },
    { header: 'Date', accessorKey: 'paymentDate' },
    { header: 'Method', accessorKey: 'paymentMethod' },
    {
      header: 'Status',
      render: (p) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
            p.paymentStatus === 'Paid'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : p.paymentStatus === 'Refunded'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              : p.paymentStatus === 'Failed'
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}
        >
          {p.paymentStatus}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (p) => (
        <select
          value={p.paymentStatus}
          onChange={(e) => handleUpdateStatus(p.id, e.target.value)}
          className="bg-black/60 border border-white/20 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-gold"
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
        </select>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <SEO title="Payment Management | Zahara Admin" />

      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
          <FiCreditCard className="text-gold" /> Payment Statements
        </h1>
        <p className="text-xs sm:text-sm text-white/50 mt-1">
          Monitor incoming payments, security deposits, UPI transactions and refunds.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-4 border border-gold/15 flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0e0e0e]/80">
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold/60" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search payment ID or customer..."
            className="w-full bg-black/60 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-gold/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <FiFilter className="text-gold/80" size={14} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold/50"
          >
            <option value="all">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      <AdminTable columns={columns} data={filteredPayments} emptyMessage="No payment records found." />
    </div>
  )
}

export default AdminPayments
