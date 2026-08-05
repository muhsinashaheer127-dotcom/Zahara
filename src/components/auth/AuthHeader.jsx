import { motion } from 'framer-motion'

const AuthHeader = ({
  title = 'Sign In',
  subtitle = 'Welcome Back',
  description = 'Continue your luxury jewellery journey.',
}) => {
  return (
    <div className="text-center mb-6">
      {/* Glowing Z Logo Badge */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="inline-block relative mb-4 group cursor-pointer"
      >
        {/* Soft gold pulsing backlight */}
        <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B8941F] opacity-30 blur-md group-hover:opacity-60 transition duration-700 animate-pulse" />
        
        {/* Emblem circle */}
        <div className="relative h-16 w-16 mx-auto rounded-full bg-[#0A0A0A] border-2 border-[#D4AF37] flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.35)]">
          <span className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight bg-gradient-to-b from-[#FFF] via-[#F3E5AB] to-[#D4AF37] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(212,175,55,0.5)]">
            Z
          </span>
        </div>
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold tracking-normal text-white drop-shadow-md"
      >
        {title}
      </motion.h2>

      {/* Subtitle with elegant gold ornament lines */}
      {subtitle && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="flex items-center justify-center gap-3 mt-2.5"
        >
          <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
          <span className="text-[11px] font-medium tracking-[0.25em] text-[#D4AF37] uppercase">
            {subtitle}
          </span>
          <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
        </motion.div>
      )}

      {/* Short elegant tagline */}
      {description && (
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-[13px] text-white/70 tracking-wide mt-2 font-light max-w-xs mx-auto"
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}

export default AuthHeader
