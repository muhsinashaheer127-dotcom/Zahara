import { useState, useEffect } from 'react'
import {
  FiUsers,
  FiSearch,
  FiFilter,
  FiEye,
  FiSlash,
  FiCheckCircle,
  FiTrash2,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import AdminTable from '../../components/admin/AdminTable'
import AdminModal from '../../components/admin/AdminModal'
import SEO from '../../components/SEO'
import adminService from '../../services/adminService'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [selectedUser, setSelectedUser] = useState(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  useEffect(() => {
    loadUsers()
    const handleUpdate = () => loadUsers()
    window.addEventListener('zh_admin_data_updated', handleUpdate)
    return () => window.removeEventListener('zh_admin_data_updated', handleUpdate)
  }, [])

  const loadUsers = () => {
    setUsers(adminService.getUsers())
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || u.accountStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleToggleBlock = (user) => {
    const newStatus = user.accountStatus === 'Blocked' ? 'Active' : 'Blocked'
    adminService.updateUserStatus(user.id, newStatus)
    toast.success(`User ${user.name} is now ${newStatus}`)
    loadUsers()
  }

  const handleDeleteUser = () => {
    if (selectedUser) {
      adminService.deleteUser(selectedUser.id)
      toast.success(`User account ${selectedUser.name} deleted`)
      setIsDeleteOpen(false)
      setSelectedUser(null)
      loadUsers()
    }
  }

  const columns = [
    {
      header: 'Customer Name',
      render: (u) => (
        <div className="flex items-center gap-3">
          <img
            src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
            alt={u.name}
            className="w-10 h-10 rounded-full object-cover border border-gold/30 shrink-0"
          />
          <div>
            <p className="font-semibold text-white text-sm">{u.name}</p>
            <p className="text-[11px] text-gold/70">{u.email}</p>
          </div>
        </div>
      ),
    },
    { header: 'Phone', accessorKey: 'phone' },
    { header: 'Registration Date', accessorKey: 'registrationDate' },
    {
      header: 'Bookings',
      render: (u) => <span className="font-semibold text-gold">{u.totalBookings || 0} Rentals</span>,
    },
    {
      header: 'Status',
      render: (u) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
            u.accountStatus === 'Active'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
          }`}
        >
          {u.accountStatus}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (u) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedUser(u)
              setIsViewOpen(true)
            }}
            className="p-2 rounded-lg border border-white/10 text-white/70 hover:text-gold transition-colors"
            title="View Customer Profile"
          >
            <FiEye size={16} />
          </button>
          <button
            type="button"
            onClick={() => handleToggleBlock(u)}
            className={`p-2 rounded-lg border transition-colors ${
              u.accountStatus === 'Blocked'
                ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                : 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
            }`}
            title={u.accountStatus === 'Blocked' ? 'Unblock User' : 'Block User'}
          >
            {u.accountStatus === 'Blocked' ? <FiCheckCircle size={16} /> : <FiSlash size={16} />}
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedUser(u)
              setIsDeleteOpen(true)
            }}
            className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete Account"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <SEO title="User Management | Zahara Admin" />

      {/* Header */}
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
          <FiUsers className="text-gold" /> User Management
        </h1>
        <p className="text-xs sm:text-sm text-white/50 mt-1">
          Registered customer accounts, activity logs, block/unblock controls.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="glass-card rounded-2xl p-4 border border-gold/15 flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0e0e0e]/80">
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold/60" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or phone..."
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
            <option value="Active">Active Users</option>
            <option value="Blocked">Blocked Users</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <AdminTable columns={columns} data={filteredUsers} emptyMessage="No user accounts match your search." />

      {/* VIEW USER MODAL */}
      <AdminModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="User Profile Details"
        subtitle={selectedUser?.name}
      >
        {selectedUser && (
          <div className="space-y-4 text-xs text-white/80">
            <div className="flex items-center gap-4">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-20 h-20 rounded-full object-cover border border-gold/40"
              />
              <div>
                <h4 className="font-bold text-base text-gold">{selectedUser.name}</h4>
                <p className="text-white/60">{selectedUser.email}</p>
                <p className="text-white/50">{selectedUser.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl">
              <div>
                <p className="text-white/40">Registration Date</p>
                <p className="text-white font-semibold">{selectedUser.registrationDate}</p>
              </div>
              <div>
                <p className="text-white/40">Total Bookings</p>
                <p className="text-gold font-bold text-sm">{selectedUser.totalBookings} Rentals</p>
              </div>
              <div>
                <p className="text-white/40">Account Status</p>
                <p className="text-emerald-400 font-semibold">{selectedUser.accountStatus}</p>
              </div>
            </div>
          </div>
        )}
      </AdminModal>

      {/* DELETE CONFIRMATION MODAL */}
      <AdminModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Customer Account"
        subtitle="Confirmation required"
      >
        <div className="space-y-4 text-xs">
          <p className="text-white/80">
            Are you sure you want to delete <strong className="text-gold">{selectedUser?.name}</strong>?
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2 rounded-xl border border-white/20 text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteUser}
              className="px-5 py-2 bg-red-600 text-white font-semibold rounded-xl"
            >
              Delete User
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  )
}

export default AdminUsers
