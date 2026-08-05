import { forwardRef, useState } from 'react'
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi'

const PasswordField = forwardRef(
  ({ label = 'Password', error, placeholder = '••••••••', className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <div className="w-full text-left mb-4">
        {label && (
          <label className="block text-[12px] font-medium text-[#D4AF37] tracking-wide mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center group">
          <div className="absolute left-3.5 text-[#D4AF37]/80 pointer-events-none z-10 transition-colors duration-300 group-focus-within:text-[#D4AF37] group-focus-within:scale-110 transform">
            <FiLock size={17} />
          </div>
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
            className={`w-full pl-11 pr-11 py-3 text-white text-sm rounded-xl border outline-none transition-all duration-300 bg-[#121212]/90 placeholder:text-white/30 ${
              error
                ? 'border-red-500/70 focus:border-red-500 focus:ring-1 focus:ring-red-500/40'
                : 'border-white/15 hover:border-white/30 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 focus:shadow-[0_0_20px_rgba(212,175,55,0.25)]'
            } ${className}`}
            style={{ fontFamily: 'Poppins, sans-serif' }}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 p-1.5 text-white/40 hover:text-[#D4AF37] transition-colors duration-300 focus:outline-none z-10 rounded-lg"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-400 font-medium flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
            {error}
          </p>
        )}
      </div>
    )
  }
)

PasswordField.displayName = 'PasswordField'

export default PasswordField
