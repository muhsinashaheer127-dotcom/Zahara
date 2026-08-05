import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiPackage,
  FiClock,
  FiHeart,
  FiEdit3,
  FiCheck,
  FiLogOut,
  FiShield,
  FiCamera,
} from 'react-icons/fi'
import SEO from '../../components/SEO'
import AnimateOnScroll from '../../components/AnimateOnScroll'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { STORAGE_KEYS } from '../../utils/helpers'

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
]

const Profile = () => {
  const { user, updateProfile, logout } = useAuth()
  const { wishlist } = useCart()
  const [bookings] = useLocalStorage(STORAGE_KEYS.BOOKINGS, [])
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    avatar: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        avatar: user.avatar || '',
      })
    }
  }, [user])

  const handleSave = (e) => {
    e.preventDefault()
    updateProfile({
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      avatar: formData.avatar,
    })
    setIsEditing(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <SEO title="My Profile | Zahara Luxury Rentals" />

      <div className="section-padding min-h-screen bg-[#0F0F0F] text-white pt-28">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header Banner & Title */}
          <AnimateOnScroll className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-[0.25em]">
                Client Portal
              </span>
              <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold tracking-tight mt-1">
                User Profile
              </h1>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 shadow-md min-h-[44px]"
            >
              <FiLogOut size={16} /> Logout Session
            </button>
          </AnimateOnScroll>

          {/* User Hero Card */}
          <AnimateOnScroll>
            <div className="glass-card rounded-[24px] p-6 sm:p-8 border border-[#D4AF37]/25 relative overflow-hidden bg-gradient-to-r from-[#171717] via-[#141414] to-[#171717]">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B8941F] via-[#D4AF37] to-[#E8C547]" />

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                {/* Profile Photo */}
                <div className="relative group">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-[#D4AF37] shadow-xl"
                    />
                  ) : (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#C49A3A] to-[#B8941F] text-black font-bold text-3xl flex items-center justify-center border-2 border-[#D4AF37] shadow-xl font-[family-name:var(--font-heading)]">
                      {user?.name?.charAt(0) || 'Z'}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="absolute bottom-0 right-0 p-2 bg-[#D4AF37] text-black rounded-full shadow-lg hover:scale-110 transition-transform"
                    title="Change Avatar"
                  >
                    <FiCamera size={15} />
                  </button>
                </div>

                {/* Info Overview */}
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
                      {user?.name || 'Valued Client'}
                    </h2>
                    <span className="px-3 py-1 bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-semibold tracking-wider rounded-full uppercase">
                      VIP Member
                    </span>
                  </div>

                  <p className="text-xs text-white/50 flex items-center justify-center sm:justify-start gap-2">
                    <FiMail size={14} className="text-[#D4AF37]" />
                    <span>{user?.email}</span>
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-white/60">
                    <div className="flex items-center gap-1.5">
                      <FiPhone className="text-[#D4AF37]" size={14} />
                      <span>{user?.phone || 'No phone provided'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FiCalendar className="text-[#D4AF37]" size={14} />
                      <span>Member since {user?.memberSince || '2025'}</span>
                    </div>
                  </div>
                </div>

                {/* Edit Toggle */}
                <div>
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
                  >
                    <FiEdit3 size={15} />
                    <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
                  </button>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Stats Cards */}
          <AnimateOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4 bg-[#171717]">
                <div className="p-3.5 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
                  <FiPackage size={22} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-white/50">Total Rentals</p>
                  <p className="text-2xl font-bold text-white mt-0.5">
                    {user?.totalRentals ?? bookings.length}
                  </p>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4 bg-[#171717]">
                <div className="p-3.5 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
                  <FiClock size={22} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-white/50">Active Rentals</p>
                  <p className="text-2xl font-bold text-[#D4AF37] mt-0.5">
                    {user?.activeRentals ?? 0}
                  </p>
                </div>
              </div>

              <Link
                to="/wishlist"
                className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4 bg-[#171717] hover:border-[#D4AF37]/50 transition-all group"
              >
                <div className="p-3.5 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                  <FiHeart size={22} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-white/50">Wishlist Saved</p>
                  <p className="text-2xl font-bold text-white mt-0.5">{wishlist.length}</p>
                </div>
              </Link>
            </div>
          </AnimateOnScroll>

          {/* Edit Form OR View Cards */}
          <AnimateOnScroll>
            {isEditing ? (
              <form
                onSubmit={handleSave}
                className="glass-card rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/30 bg-[#171717] space-y-6"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-white flex items-center gap-2">
                    <FiEdit3 className="text-[#D4AF37]" /> Edit Profile Information
                  </h3>
                  <span className="text-xs text-white/40">Email is read-only</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase text-white/60 tracking-wider">
                      Full Name
                    </label>
                    <div className="relative flex items-center">
                      <FiUser className="absolute left-4 text-[#D4AF37]" size={17} />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-base focus:border-[#D4AF37] outline-none"
                      />
                    </div>
                  </div>

                  {/* Email Address (Read-only) */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase text-white/40 tracking-wider">
                      Email Address (Read-Only)
                    </label>
                    <div className="relative flex items-center">
                      <FiMail className="absolute left-4 text-white/30" size={17} />
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        readOnly
                        className="w-full pl-11 pr-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white/40 text-sm cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase text-white/60 tracking-wider">
                      Phone Number
                    </label>
                    <div className="relative flex items-center">
                      <FiPhone className="absolute left-4 text-[#D4AF37]" size={17} />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-base focus:border-[#D4AF37] outline-none"
                      />
                    </div>
                  </div>

                  {/* Profile Picture URL */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase text-white/60 tracking-wider">
                      Profile Picture Image URL
                    </label>
                    <div className="relative flex items-center">
                      <FiCamera className="absolute left-4 text-[#D4AF37]" size={17} />
                      <input
                        type="url"
                        value={formData.avatar}
                        onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                        placeholder="https://..."
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-base focus:border-[#D4AF37] outline-none"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase text-white/60 tracking-wider">
                      Delivery Address
                    </label>
                    <div className="relative flex items-start">
                      <FiMapPin className="absolute left-4 top-3.5 text-[#D4AF37]" size={17} />
                      <textarea
                        rows={3}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Enter your full street address, city, and pincode..."
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-base focus:border-[#D4AF37] outline-none resize-none"
                      />
                    </div>
                  </div>

                  {/* Preset Avatars Selection */}
                  <div className="sm:col-span-2 space-y-2 pt-2">
                    <label className="text-[11px] font-semibold uppercase text-white/60 tracking-wider block">
                      Or Choose Preset Avatar
                    </label>
                    <div className="flex items-center gap-3">
                      {AVATAR_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormData({ ...formData, avatar: preset })}
                          className={`relative rounded-full overflow-hidden border-2 transition-all ${
                            formData.avatar === preset ? 'border-[#D4AF37] scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={preset} alt="Preset" className="w-12 h-12 object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 min-h-[44px] bg-white/5 border border-white/10 text-white/70 text-xs font-semibold rounded-xl hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 min-h-[44px] bg-[#D4AF37] text-black font-semibold text-xs rounded-xl hover:bg-[#C79A2B] transition-all shadow-lg"
                  >
                    <FiCheck size={16} /> Save Changes
                  </button>
                </div>
              </form>
            ) : (
              /* View Mode Cards */
              <div className="grid md:grid-cols-2 gap-6">
                {/* Personal Details */}
                <div className="glass-card rounded-2xl p-6 border border-white/10 bg-[#171717] space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="font-[family-name:var(--font-heading)] font-semibold text-lg text-[#D4AF37] flex items-center gap-2">
                      <FiUser /> Personal Details
                    </h3>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs text-[#D4AF37] hover:underline"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-[11px] text-white/40 uppercase">Full Name</p>
                      <p className="text-white font-medium">{user?.name}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-white/40 uppercase">Email Address</p>
                      <p className="text-white font-medium">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-white/40 uppercase">Phone Number</p>
                      <p className="text-white font-medium">{user?.phone || 'Not set'}</p>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="glass-card rounded-2xl p-6 border border-white/10 bg-[#171717] space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="font-[family-name:var(--font-heading)] font-semibold text-lg text-[#D4AF37] flex items-center gap-2">
                      <FiMapPin /> Delivery Address
                    </h3>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs text-[#D4AF37] hover:underline"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="space-y-3 text-sm">
                    <p className="text-white/80 leading-relaxed">
                      {user?.address || 'No address saved yet. Click edit to add your default delivery address.'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-emerald-400 pt-2">
                      <FiShield /> 100% Insured Delivery Address Verification
                    </div>
                  </div>
                </div>
              </div>
            )}
          </AnimateOnScroll>
        </div>
      </div>
    </>
  )
}

export default Profile
