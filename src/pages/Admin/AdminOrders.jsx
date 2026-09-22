import { useState, useEffect } from 'react'
import { FiShoppingBag, FiSearch, FiRefreshCw } from 'react-icons/fi'
import toast from 'react-hot-toast'
import AdminTable from '../../components/admin/AdminTable'
import AdminModal from '../../components/admin/AdminModal'
import SEO from '../../components/SEO'
import adminService from '../../services/adminService'

const AdminOrders = () => {
  const [orders,      setOrders]     = useState([])
  const [loading,     setLoading]    = useState(true)
  const [searchTerm,  setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isViewOpen,    setIsViewOpen]    = useState(false)

  const loadOrders = async () => {
    setLoading(true)
    try {
      setOrders(await adminService.getOrders())
    } catch (err) {
      toast.error('Failed to load orders: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadOrders() }, [])

  const filtered = orders.filter((o) => {
    const s = searchTerm.toLowerCase()
    return o.id?.toLowerCase().includes(s) || o.customer?.toLowerCase().includes(s) || o.product?.toLowerCase().includes(s) || o.trackingCode?.toLowerCase().includes(s)
  })

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus)
      toast.success(`Order ${orderId} updated to "${newStatus}"`)
      await loadOrders()
    } catch (err) {
      toast.error('Failed to update: ' + err.message)
    }
  }

  const columns = [
    { header: 'Order ID',    render: (o) => <span className="font-mono font-bold text-gold">{o.id}</span> },
    { header: 'Booking Ref', render: (o) => <span className="text-xs text-white/70">{o.bookingId}</span> },
    { header: 'Customer',    render: (o) => <span className="text-white/80">{o.customer}</span> },
    { header: 'Jewellery',   render: (o) => <span className="text-white/70 text-xs">{o.product}</span> },
    {
      header: 'Delivery / Return',
      render: (o) => (
        <div className="text-xs text-white/70">
          <p>Delivery: {o.deliveryDate}</p>
          <p>Return: {o.returnDate}</p>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (o) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
          o.status === 'Returned'         ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
          : o.status === 'In Transit'     ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          : o.status === 'Delivered'      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          : o.status === 'Cancelled'      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
        }`}>
          {o.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (o) => (
        <div className="flex flex-wrap items-center gap-1.5">
          {o.status !== 'Delivered' && o.status !== 'Returned' && (
            <button type="button" onClick={() => handleUpdateStatus(o.id, 'Delivered')} className="px-2.5 py-1 text-[11px] bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg border border-emerald-500/30 transition-colors">Mark Delivered</button>
          )}
          {o.status !== 'Returned' && (
            <button type="button" onClick={() => handleUpdateStatus(o.id, 'Returned')} className="px-2.5 py-1 text-[11px] bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded-lg border border-purple-500/30 transition-colors">Mark Returned</button>
          )}
          <button type="button" onClick={() => { setSelectedOrder(o); setIsViewOpen(true) }} className="px-2.5 py-1 text-[11px] bg-white/5 text-white hover:bg-gold/10 hover:text-gold rounded-lg border border-white/10 transition-colors">Details</button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <SEO title="Order & Rental Management | Zahara Admin" />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
            <FiShoppingBag className="text-gold" /> Rental Order Fulfillment
          </h1>
          <p className="text-xs sm:text-sm text-white/50 mt-1">Track active logistics, doorstep deliveries, return inspections and overdue items.</p>
        </div>
        <button type="button" onClick={loadOrders} className="p-2.5 rounded-xl border border-white/20 text-white/70 hover:text-gold transition-colors" title="Refresh">
          <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="glass-card rounded-2xl p-4 border border-gold/15 bg-[#0e0e0e]/80">
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold/60" size={16} />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search order ID, customer or tracking..." className="w-full bg-black/60 border border-white/15 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-gold/50" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gold/60 gap-3"><FiRefreshCw className="animate-spin" size={20} /> Loading orders...</div>
      ) : (
        <AdminTable columns={columns} data={filtered} emptyMessage="No orders found." />
      )}

      <AdminModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Rental Order Details" subtitle={selectedOrder?.id}>
        {selectedOrder && (
          <div className="space-y-4 text-xs text-white/80">
            <div className="bg-white/5 p-4 rounded-xl space-y-2">
              <p><strong className="text-gold">Tracking Code:</strong> {selectedOrder.trackingCode || '—'}</p>
              <p><strong className="text-gold">Booking ID:</strong> {selectedOrder.bookingId}</p>
              <p><strong className="text-gold">Customer:</strong> {selectedOrder.customer}</p>
              <p><strong className="text-gold">Email:</strong> {selectedOrder.customerEmail}</p>
              <p><strong className="text-gold">Jewellery:</strong> {selectedOrder.product}</p>
              <p><strong className="text-gold">Dispatch Date:</strong> {selectedOrder.dispatchDate || '—'}</p>
              <p><strong className="text-gold">Delivery Date:</strong> {selectedOrder.deliveryDate}</p>
              <p><strong className="text-gold">Return Date:</strong> {selectedOrder.returnDate}</p>
              <p><strong className="text-gold">Status:</strong> {selectedOrder.status}</p>
              {selectedOrder.deliveryAddress?.city && (
                <p><strong className="text-gold">Address:</strong> {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.city} - {selectedOrder.deliveryAddress.pincode}</p>
              )}
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  )
}

export default AdminOrders
