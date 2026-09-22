import { useState, useEffect } from 'react'
import { FiStar, FiCheckCircle, FiEyeOff, FiTrash2, FiRefreshCw } from 'react-icons/fi'
import toast from 'react-hot-toast'
import AdminTable from '../../components/admin/AdminTable'
import SEO from '../../components/SEO'
import adminService from '../../services/adminService'

const AdminReviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const loadReviews = async () => {
    setLoading(true)
    try {
      setReviews(await adminService.getReviews())
    } catch (err) {
      toast.error('Failed to load reviews: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadReviews() }, [])

  const handleUpdateStatus = async (revId, status) => {
    try {
      await adminService.updateReviewStatus(revId, status)
      toast.success(`Review ${status.toLowerCase()} successfully`)
      await loadReviews()
    } catch (err) {
      toast.error('Failed to update: ' + err.message)
    }
  }

  const handleDelete = async (revId) => {
    try {
      await adminService.deleteReview(revId)
      toast.success('Review deleted')
      await loadReviews()
    } catch (err) {
      toast.error('Failed to delete: ' + err.message)
    }
  }

  const columns = [
    { header: 'Customer',        render: (r) => <span className="font-bold text-white">{r.customer}</span> },
    { header: 'Jewellery Piece', render: (r) => <span className="text-gold font-medium text-xs">{r.product}</span> },
    {
      header: 'Rating',
      render: (r) => (
        <div className="flex items-center gap-1 text-gold">
          {Array.from({ length: r.rating }).map((_, i) => <FiStar key={i} className="fill-gold" size={14} />)}
        </div>
      ),
    },
    { header: 'Review Comment', render: (r) => <p className="text-xs text-white/70 italic max-w-xs">{r.comment}</p> },
    { header: 'Date',           render: (r) => <span className="text-white/60 text-xs">{r.date}</span> },
    {
      header: 'Status',
      render: (r) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
          r.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          : r.status === 'Hidden' ? 'bg-red-500/20 text-red-400 border border-red-500/30'
          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
        }`}>
          {r.status}
        </span>
      ),
    },
    {
      header: 'Moderation',
      render: (r) => (
        <div className="flex items-center gap-2">
          {r.status !== 'Approved' && (
            <button type="button" onClick={() => handleUpdateStatus(r.id, 'Approved')} className="p-2 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10" title="Approve"><FiCheckCircle size={16} /></button>
          )}
          {r.status !== 'Hidden' && (
            <button type="button" onClick={() => handleUpdateStatus(r.id, 'Hidden')} className="p-2 rounded-lg border border-amber-500/30 text-amber-400 hover:bg-amber-500/10" title="Hide"><FiEyeOff size={16} /></button>
          )}
          <button type="button" onClick={() => handleDelete(r.id)} className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10" title="Delete"><FiTrash2 size={16} /></button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <SEO title="Review Moderation | Zahara Admin" />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
            <FiStar className="text-gold" /> Customer Review Moderation
          </h1>
          <p className="text-xs sm:text-sm text-white/50 mt-1">Approve, hide or delete customer testimonials and product reviews.</p>
        </div>
        <button type="button" onClick={loadReviews} className="p-2.5 rounded-xl border border-white/20 text-white/70 hover:text-gold transition-colors" title="Refresh">
          <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gold/60 gap-3"><FiRefreshCw className="animate-spin" size={20} /> Loading reviews...</div>
      ) : (
        <AdminTable columns={columns} data={reviews} emptyMessage="No reviews found." />
      )}
    </div>
  )
}

export default AdminReviews
