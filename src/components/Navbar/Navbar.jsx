import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiHeart,
  FiShoppingBag,
  FiMenu,
  FiX,
  FiUser,
  FiBell,
  FiPackage,
  FiClock,
  FiSettings,
  FiLogOut,
  FiChevronDown,
} from 'react-icons/fi'
import { useState, useEffect, useRef } from 'react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Collections', path: '/collections' },

  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(2)

  const dropdownRef = useRef(null)
  const { cartItems, wishlist } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close avatar dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    setDropdownOpen(false)
    setIsOpen(false)
    logout()
    navigate('/')
  }

  const dropdownItems = [
    { label: 'My Profile', icon: FiUser, path: '/profile' },
    { label: 'My Orders', icon: FiPackage, path: '/bookings' },
    { label: 'Wishlist', icon: FiHeart, path: '/wishlist' },
    { label: 'Rental History', icon: FiClock, path: '/bookings' },
    { label: 'Settings', icon: FiSettings, path: '/profile' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-card shadow-2xl py-3 border-b border-[#D4AF37]/20 bg-[#0F0F0F]/90 backdrop-blur-xl' : 'bg-transparent py-5'
        }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="Zahara"
            className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover transition-transform group-hover:scale-105 border border-[#D4AF37]/40"
          />
          <div className="hidden sm:block">
            <span className="font-[family-name:var(--font-heading)] text-xl md:text-2xl font-bold gold-text-gradient tracking-widest">
              ZAHARA
            </span>
            <p className="text-[9px] text-[#D4AF37]/70 tracking-[0.3em] uppercase">Rent. Wear. Shine.</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <ul className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className="text-sm text-white/80 hover:text-[#D4AF37] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#D4AF37] after:transition-all hover:after:w-full"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Auth / Action Section */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {isAuthenticated ? (
            <>
              {/* Notifications Icon */}
              <button
                type="button"
                onClick={() => setUnreadNotifications(0)}
                className="relative p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-white/80 hover:text-[#D4AF37] transition-colors"
                aria-label="Notifications"
                title="Notifications"
              >
                <FiBell size={20} />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                )}
                {unreadNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D4AF37]" />
                )}
              </button>

              {/* Wishlist Icon */}
              <Link
                to="/wishlist"
                className="relative p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-white/80 hover:text-[#D4AF37] transition-colors"
                aria-label="Wishlist"
              >
                <FiHeart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 bg-[#D4AF37] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-white/80 hover:text-[#D4AF37] transition-colors"
                aria-label="Cart"
              >
                <FiShoppingBag size={20} />
                {cartItems.length > 0 && (
                  <span className="absolute top-1 right-1 bg-[#D4AF37] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* User Avatar + Dropdown Trigger */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2 pr-3 min-h-[44px] bg-white/5 hover:bg-white/10 border border-[#D4AF37]/30 rounded-full transition-all duration-300 group"
                  aria-label="User menu"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover border border-[#D4AF37]"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8941F] text-black font-bold text-xs flex items-center justify-center">
                      {user?.name?.charAt(0) || 'Z'}
                    </div>
                  )}
                  <span className="hidden sm:inline text-xs font-medium text-white/90 group-hover:text-[#D4AF37] transition-colors max-w-[100px] truncate">
                    {user?.name?.split(' ')[0] || 'Client'}
                  </span>
                  <FiChevronDown
                    size={14}
                    className={`text-[#D4AF37] transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-56 bg-[#171717] border border-[#D4AF37]/30 rounded-2xl shadow-2xl overflow-hidden z-50 p-2 backdrop-blur-2xl"
                    >
                      {/* Header Info */}
                      <div className="px-3 py-3 border-b border-white/10 mb-1">
                        <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-[11px] text-[#D4AF37] truncate">{user?.email}</p>
                      </div>

                      {/* Menu List */}
                      <div className="space-y-0.5">
                        {dropdownItems.map((item) => {
                          const IconComponent = item.icon
                          return (
                            <Link
                              key={item.label}
                              to={item.path}
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 text-xs text-white/70 hover:text-[#D4AF37] hover:bg-white/5 rounded-xl transition-colors min-h-[44px]"
                            >
                              <IconComponent size={15} className="text-[#D4AF37]" />
                              <span>{item.label}</span>
                            </Link>
                          )
                        })}
                      </div>

                      {/* Logout Option */}
                      <div className="border-t border-white/10 mt-1 pt-1">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors min-h-[44px]"
                        >
                          <FiLogOut size={15} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            /* Unauthenticated Navbar Options: Login & Register */
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2.5 min-h-[44px] flex items-center justify-center text-xs font-semibold text-[#D4AF37] border border-[#D4AF37]/40 rounded-full hover:bg-[#D4AF37]/10 transition-all duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hidden sm:flex items-center justify-center px-4 py-2.5 min-h-[44px] text-xs font-semibold text-black bg-[#D4AF37] hover:bg-[#C79A2B] rounded-full transition-all duration-300 shadow-md"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#D4AF37]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-[#0F0F0F]/95 backdrop-blur-2xl border-t border-[#D4AF37]/20"
          >
            <ul className="px-6 py-6 space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center text-base text-white/90 hover:text-[#D4AF37] transition-colors min-h-[44px]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              <div className="pt-4 border-t border-white/10">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#D4AF37] text-black font-bold flex items-center justify-center">
                        {user?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{user?.name}</p>
                        <p className="text-xs text-[#D4AF37]">{user?.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center py-2.5 px-3 bg-white/5 rounded-xl text-xs text-white min-h-[44px]"
                      >
                        Profile
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center justify-center py-2.5 px-3 bg-red-500/10 text-red-400 rounded-xl text-xs min-h-[44px]"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 pt-1">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-center py-3 min-h-[44px] border border-[#D4AF37]/40 text-[#D4AF37] rounded-xl text-sm font-semibold"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-center py-3 min-h-[44px] bg-[#D4AF37] text-black rounded-xl text-sm font-semibold"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
