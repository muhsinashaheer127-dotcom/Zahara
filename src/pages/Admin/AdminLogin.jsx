import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield, FiAlertTriangle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import SEO from '../../components/SEO'

const AdminLogin = () => {
  const { adminLogin, isAdminAuthenticated } = useAdminAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Redirect if already authenticated as Admin
  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [isAdminAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!email || !password) {
      setErrorMessage('Please enter both admin email and password.')
      return
    }

    setLoading(true)
    try {
      await adminLogin(email, password)
      toast.success('Admin authentication successful', { icon: '👑' })
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setErrorMessage(err.message || 'Invalid admin credentials')
      toast.error(err.message || 'Invalid admin credentials')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    toast('For security, admin password resets must be done directly via backend system config.', {
      icon: '🔒',
      duration: 5000,
    })
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-gold selection:text-black">
      <SEO title="Zahara Admin Portal" />

      {/* Atmospheric Gold Glow Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#0e0e0e]/90 border border-gold/30 rounded-3xl p-8 sm:p-10 luxury-shadow relative z-10 backdrop-blur-xl"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3.5 rounded-2xl bg-gold/10 border border-gold/30 text-gold mb-4 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <FiShield size={32} />
          </div>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-widest text-gold uppercase">
            ZAHARA
          </h1>
          <h2 className="text-sm font-semibold tracking-[0.3em] uppercase text-white/80 mt-1">
            ADMIN PORTAL
          </h2>
          <p className="text-xs text-white/50 tracking-wider mt-2 italic font-light">
            &quot;Authorized access only&quot;
          </p>
        </div>

        {/* Error Notification Banner */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3"
          >
            <FiAlertTriangle size={18} className="shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        {/* Admin Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email Field */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-gold/80 font-medium mb-2">
              Admin Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/60" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="zahararental@gmail.com"
                required
                autoComplete="off"
                className="w-full bg-black/60 border border-white/15 focus:border-gold rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-gold/80 font-medium mb-2">
              Admin Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/60" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="off"
                className="w-full bg-black/60 border border-white/15 focus:border-gold rounded-2xl pl-11 pr-11 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-gold transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs py-1">
            <label className="flex items-center gap-2 text-white/70 hover:text-white cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 text-gold focus:ring-gold/50 accent-gold cursor-pointer"
              />
              <span>Remember Me</span>
            </label>

            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-gold/80 hover:text-gold hover:underline transition-colors cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 gold-gradient text-black font-semibold tracking-wider text-sm rounded-2xl hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.3)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase mt-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Access Admin Dashboard</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-[11px] text-white/40 tracking-wider">
            Protected Environment • Unauthorized attempts logged
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin
