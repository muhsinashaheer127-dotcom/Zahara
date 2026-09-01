import { useState, useEffect } from 'react'
import { FiCalendar, FiSearch, FiFilter, FiEdit, FiEye, FiCheckCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import AdminTable from '../../components/admin/AdminTable'
import AdminModal from '../../components/admin/AdminModal'
import SEO from '../../components/SEO'
import adminService from '../../services/adminService'

const AdminBookings = () => {
  const [bookings, setBookings] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)

  const [newBookingStatus, setNewBookingStatus] = useState('Pending')
  const [newPaymentStatus, setNewPaymentStatus] = useState('Pending')

  useEffect(() => {
    loadBookings()
    const handleUpdate = () => loadBookings()
    window.addEventListener('zh_admin_data_updated', handleUpdate)
    return () => window.removeEventListener('zh_admin_data_updated', handleUpdate)
  }, [])

  const loadBookings = () => {
    setBookings(adminService.getBookings())
  }

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.product?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || b.bookingStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleOpenEdit = (b) => {
    setSelectedBooking(b)
    setNewBookingStatus(b.bookingStatus)
    setNewPaymentStatus(b.paymentStatus)
    setIsEditOpen(true)
  }

  const handleSaveStatus = (e) => {
    e.preventDefault()
    if (selectedBooking) {
      adminService.updateBookingStatus(selectedBooking.id, newBookingStatus, newPaymentStatus)
      toast.success(`Booking ${selectedBooking.id} status updated to ${newBookingStatus}`)
      setIsEditOpen(false)
      loadBookings()
    }
  }

  const columns = [
    {
      header: 'Booking ID',
      render: (b) => <span className="font-mono font-bold text-gold">{b.id}</span>,
    },
    {
      header: 'Customer',
      render: (b) => (
        <div>
          <p className="font-semibold text-white">{b.customer}</p>
          <p className="text-[11px] text-white/50">{b.email}</p>
        </div>
      ),
    },
    { header: 'Jewellery Product', accessorKey: 'product' },
    {
      header: 'Rental Window',
      render: (b) => (
        <span className="text-xs text-white/70">
          {b.startDate} &rarr; {b.endDate}
        </span>
      ),
    },
    {
      header: 'Fee / Deposit',
      render: (b) => (
        <div>
          <span className="text-gold font-bold">₹{b.price}</span>
          <p className="text-[10px] text-white/50">Deposit: ₹{b.deposit}</p>
        </div>
      ),
    },
    {
      header: 'Payment',
      render: (b) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${
            b.paymentStatus === 'Paid'
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-amber-500/20 text-amber-400'
          }`}
        >
          {b.paymentStatus}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (b) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
            b.bookingStatus === 'Confirmed'
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : b.bookingStatus === 'Active'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : b.bookingStatus === 'Returned'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              : b.bookingStatus === 'Cancelled'
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}
        >
          {b.bookingStatus}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (b) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedBooking(b)
              setIsViewOpen(true)
            }}
            className="p-2 rounded-lg border border-white/10 text-white/70 hover:text-gold transition-colors"
          >
            <FiEye size={16} />
          </button>
          <button
            type="button"
            onClick={() => handleOpenEdit(b)}
            className="p-2 rounded-lg border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
          >
            <FiEdit size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <SEO title="Booking Management | Zahara Admin" />

      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
          <FiCalendar className="text-gold" /> Booking Management
        </h1>
        <p className="text-xs sm:text-sm text-white/50 mt-1">
          Review customer rental reservations, dates, deposits, and booking approvals.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-2xl p-4 border border-gold/15 flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0e0e0e]/80">
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold/60" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search booking ID, customer, or item..."
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
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Active">Active</option>
            <option value="Returned">Returned</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <AdminTable columns={columns} data={filteredBookings} emptyMessage="No bookings found." />

      {/* EDIT BOOKING MODAL */}
      <AdminModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Update Booking Status"
        subtitle={`Booking Ref: ${selectedBooking?.id}`}
      >
        <form onSubmit={handleSaveStatus} className="space-y-4 text-xs text-white/80">
          <div>
            <label className="block text-gold/80 font-medium mb-1">Booking Status</label>
            <select
              value={newBookingStatus}
              onChange={(e) => setNewBookingStatus(e.target.value)}
              className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold"
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Active">Active (Item with Customer)</option>
              <option value="Returned">Returned (Completed)</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-gold/80 font-medium mb-1">Payment Status</label>
            <select
              value={newPaymentStatus}
              onChange={(e) => setNewPaymentStatus(e.target.value)}
              className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 rounded-xl border border-white/20 text-white"
            >
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 gold-gradient text-black font-semibold rounded-xl">
              Save Status
            </button>
          </div>
        </form>
      </AdminModal>

      {/* VIEW BOOKING MODAL */}
      <AdminModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Booking Details"
        subtitle={selectedBooking?.id}
      >
        {selectedBooking && (
          <div className="space-y-4 text-xs text-white/80">
            <div className="bg-white/5 p-4 rounded-xl space-y-2">
              <p>
                <strong className="text-gold">Customer:</strong> {selectedBooking.customer} ({selectedBooking.email})
              </p>
              <p>
                <strong className="text-gold">Item:</strong> {selectedBooking.product}
              </p>
              <p>
                <strong className="text-gold">Rental Dates:</strong> {selectedBooking.startDate} to {selectedBooking.endDate}
              </p>
              <p>
                <strong className="text-gold">Rental Fee:</strong> ₹{selectedBooking.price}
              </p>
              <p>
                <strong className="text-gold">Refundable Deposit:</strong> ₹{selectedBooking.deposit}
              </p>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  )
}

export default AdminBookings
