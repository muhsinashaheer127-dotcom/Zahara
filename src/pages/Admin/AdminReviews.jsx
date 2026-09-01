import { useState, useEffect } from 'react'
import { FiStar, FiCheckCircle, FiEyeOff, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'
import AdminTable from '../../components/admin/AdminTable'
import SEO from '../../components/SEO'
import adminService from '../../services/adminService'

const AdminReviews = () => {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    loadReviews()
    const handleUpdate = () => loadReviews()
    window.addEventListener('zh_admin_data_updated', handleUpdate)
    return () => window.removeEventListener('zh_admin_data_updated', handleUpdate)
  }, [])

  const loadReviews = () => {
    setReviews(adminService.getReviews())
  }

  const handleUpdateStatus = (revId, status) => {
    adminService.updateReviewStatus(revId, status)
    toast.success(`Review ${status.toLowerCase()} successfully`)
    loadReviews()
  }

  const handleDelete = (revId) => {
    adminService.deleteReview(revId)
    toast.success('Review deleted')
    loadReviews()
  }

  const columns = [
    { header: 'Customer', accessorKey: 'customer', render: (r) => <span className="font-bold text-white">{r.customer}</span> },
    { header: 'Jewellery Piece', accessorKey: 'product', render: (r) => <span className="text-gold font-medium">{r.product}</span> },
    {
      header: 'Rating',
      render: (r) => (
        <div className="flex items-center gap-1 text-gold">
          {Array.from({ length: r.rating }).map((_, i) => (
            <FiStar key={i} className="fill-gold" size={14} />
          ))}
        </div>
      ),
    },
    { header: 'Review Comment', accessorKey: 'comment', render: (r) => <p className="text-xs text-white/70 italic max-w-xs">{r.comment}</p> },
    { header: 'Date', accessorKey: 'date' },
    {
      header: 'Status',
      render: (r) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
            r.status === 'Approved'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : r.status === 'Hidden'
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}
        >
          {r.status}
        </span>
      ),
    },
    {
      header: 'Moderation Actions',
      render: (r) => (
        <div className="flex items-center gap-2">
          {r.status !== 'Approved' && (
            <button
              type="button"
              onClick={() => handleUpdateStatus(r.id, 'Approved')}
              className="p-2 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
              title="Approve Review"
            >
              <FiCheckCircle size={16} />
            </button>
          )}
          {r.status !== 'Hidden' && (
            <button
              type="button"
              onClick={() => handleUpdateStatus(r.id, 'Hidden')}
              className="p-2 rounded-lg border border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
              title="Hide Review"
            >
              <FiEyeOff size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={() => handleDelete(r.id)}
            className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10"
            title="Delete Review"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <SEO title="Review Moderation | Zahara Admin" />

      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
          <FiStar className="text-gold" /> Customer Review Moderation
        </h1>
        <p className="text-xs sm:text-sm text-white/50 mt-1">
          Approve, hide or moderate testimonials and product reviews.
        </p>
      </div>

      <AdminTable columns={columns} data={reviews} emptyMessage="No reviews found." />
    </div>
  )
}

export default AdminReviews
