import { motion } from 'framer-motion'
import { FiLoader, FiArrowRight } from 'react-icons/fi'

const Button = ({
  children,
  type = 'submit',
  variant = 'gold',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  showArrow = true,
  ...props
}) => {
  const baseStyles =
    'w-full py-3.5 px-6 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer relative overflow-hidden select-none'

  const variants = {
    gold: `
      bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C59B27] text-[#0A0A0A]
      shadow-[0_4px_25px_rgba(212,175,55,0.35)]
      hover:shadow-[0_0_35px_rgba(212,175,55,0.55)]
      font-bold tracking-wider uppercase text-xs sm:text-sm
    `,
    black: `
      bg-[#121212] text-[#D4AF37] border border-[#D4AF37]/40
      hover:bg-[#D4AF37] hover:text-[#0A0A0A] hover:border-[#D4AF37]
      hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]
    `,
    outline: `
      bg-transparent text-white border border-white/20
      hover:border-[#D4AF37]/70 hover:text-[#D4AF37]
    `,
  }

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant] || variants.gold} ${
        disabled || loading ? 'opacity-60 cursor-not-allowed' : ''
      } ${className}`}
      {...props}
    >
      {/* Subtle shine effect line */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite]" />

      {loading ? (
        <>
          <FiLoader className="animate-spin" size={18} />
          <span>Processing...</span>
        </>
      ) : (
        <>
          <span>{children}</span>
          {showArrow && variant === 'gold' && (
            <FiArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          )}
        </>
      )}
    </motion.button>
  )
}

export default Button
