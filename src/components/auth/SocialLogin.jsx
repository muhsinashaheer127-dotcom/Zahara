import { motion } from 'framer-motion'
import { FcGoogle } from 'react-icons/fc'
import { FaApple } from 'react-icons/fa6'

const SocialLogin = ({ onGoogle, onApple }) => {
  return (
    <div className="mt-6">
      {/* Luxury Divider */}
      <div className="relative flex items-center justify-center mb-5">
        <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <span className="relative bg-[#161616] px-4 text-[11px] font-semibold tracking-[0.25em] text-white/40 uppercase">
          OR
        </span>
      </div>

      {/* 2 Social Buttons: Google & Apple */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Google Button */}
        <motion.button
          id="social-google-btn"
          whileHover={{ scale: 1.02, borderColor: 'rgba(212,175,55,0.5)', backgroundColor: 'rgba(255,255,255,0.06)' }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onGoogle}
          className="flex items-center justify-center gap-2.5 py-3 px-4 bg-white/[0.03] border border-white/15 rounded-xl text-white/80 text-xs font-medium hover:text-[#D4AF37] transition-all duration-300 shadow-sm"
          aria-label="Continue with Google"
        >
          <FcGoogle size={18} />
          <span>Continue with Google</span>
        </motion.button>

        {/* Apple Button */}
        <motion.button
          id="social-apple-btn"
          whileHover={{ scale: 1.02, borderColor: 'rgba(212,175,55,0.5)', backgroundColor: 'rgba(255,255,255,0.06)' }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onApple}
          className="flex items-center justify-center gap-2.5 py-3 px-4 bg-white/[0.03] border border-white/15 rounded-xl text-white/80 text-xs font-medium hover:text-[#D4AF37] transition-all duration-300 shadow-sm"
          aria-label="Continue with Apple"
        >
          <FaApple size={18} className="text-white" />
          <span>Continue with Apple</span>
        </motion.button>
      </div>
    </div>
  )
}

export default SocialLogin
