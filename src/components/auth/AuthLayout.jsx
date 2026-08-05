import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiCheckCircle, FiAward, FiCalendar, FiLock, FiStar } from 'react-icons/fi'
import GoldParticles from './GoldParticles'

const CHECKLIST_ITEMS = [
  { icon: FiCheckCircle, text: 'Verified Jewellery' },
  { icon: FiAward, text: 'Premium Collection' },
  { icon: FiCalendar, text: 'Easy Rental' },
  { icon: FiLock, text: 'Secure Booking' },
]

const AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
]

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-[family-name:var(--font-body)] overflow-x-hidden selection:bg-[#D4AF37] selection:text-black relative">
      
      {/* Container Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-screen">
        
        {/* ── LEFT SIDE (60%) — CINEMATIC LUXURY HERO ── */}
        <div className="lg:w-[58%] xl:w-[60%] relative flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 overflow-hidden min-h-[480px] lg:min-h-screen">
          
          {/* High-Res Cinematic Luxury Jewellery Background Image */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <motion.img
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 12, ease: 'easeOut' }}
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=2000&q=90"
              alt="Luxury Diamond Necklace"
              className="w-full h-full object-cover object-center brightness-75 filter"
            />
            {/* Very Dark Cinematic Overlays */}
            <div className="absolute inset-0 bg-[#0A0A0A]/75 backdrop-brightness-75" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-[#0A0A0A]/70" />
            <div className="absolute inset-0 bg-radial from-transparent via-[#0A0A0A]/60 to-[#0A0A0A]" />
          </div>

          {/* Floating Gold Particles Canvas */}
          <GoldParticles />

          {/* Top Left Brand Emblem */}
          <div className="relative z-20 flex items-center gap-3.5">
            <Link to="/" className="flex items-center gap-3.5 group">
              <div className="h-11 w-11 rounded-full border border-[#D4AF37]/80 flex items-center justify-center bg-black/60 shadow-[0_0_20px_rgba(212,175,55,0.3)] group-hover:scale-105 transition-transform duration-300">
                <span className="text-[#D4AF37] font-bold text-xl font-[family-name:var(--font-heading)]">Z</span>
              </div>
              <div>
                <span className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-[0.2em] text-white group-hover:text-[#D4AF37] transition-colors">
                  ZAHARA
                </span>
                <p className="text-[9px] text-[#D4AF37]/80 tracking-[0.3em] uppercase font-semibold">
                  RENT. WEAR. SHINE.
                </p>
              </div>
            </Link>
          </div>

          {/* Left Main Hero Text & Value Props */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 my-auto py-10 max-w-xl"
          >
            {/* Sub-label */}
            <p className="text-[#D4AF37] text-xs font-semibold uppercase tracking-[0.35em] mb-2">
              WELCOME TO
            </p>

            {/* Massive Luxury Heading */}
            <h1 className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-none uppercase mb-2">
              ZAHARA
            </h1>

            {/* Subheading */}
            <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl xl:text-4xl font-normal text-[#D4AF37] tracking-wide mb-4 leading-tight">
              Luxury Jewellery Rental Experience
            </h2>

            {/* Subtle Gold Line */}
            <div className="w-16 h-[2px] bg-gradient-to-r from-[#D4AF37] to-transparent mb-5" />

            {/* Subtitle */}
            <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-8 max-w-lg font-light">
              Premium handcrafted jewellery for weddings, engagements and special occasions.
            </p>

            {/* Checklist Items */}
            <div className="space-y-3.5 mb-10">
              {CHECKLIST_ITEMS.map((item, idx) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 + idx * 0.1 }}
                    className="flex items-center gap-3 text-white/85 text-sm font-medium"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                      <Icon size={13} />
                    </div>
                    <span className="tracking-wide">{item.text}</span>
                  </motion.div>
                )
              })}
            </div>

            {/* Bottom Left Avatar Stack & Trust */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              {/* Stacked Avatars */}
              <div className="flex -space-x-3.5">
                {AVATARS.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="Happy Customer"
                    className="w-9 h-9 rounded-full border-2 border-[#D4AF37]/60 object-cover shadow-md"
                  />
                ))}
              </div>

              {/* Rating Stars & Text */}
              <div>
                <div className="flex text-[#D4AF37] text-xs gap-0.5 mb-0.5">
                  <FiStar className="fill-[#D4AF37]" size={13} />
                  <FiStar className="fill-[#D4AF37]" size={13} />
                  <FiStar className="fill-[#D4AF37]" size={13} />
                  <FiStar className="fill-[#D4AF37]" size={13} />
                  <FiStar className="fill-[#D4AF37]" size={13} />
                </div>
                <p className="text-xs text-white/70 font-light">
                  Trusted by Hundreds of Happy Customers
                </p>
              </div>
            </div>

          </motion.div>

          {/* Left Footer copyright */}
          <div className="relative z-20 text-[11px] text-white/30 hidden lg:block">
            © 2026 ZAHARA Luxury Rentals. All rights reserved.
          </div>
        </div>


        {/* ── RIGHT SIDE (40%) — GLASSMORPHISM LUXURY CARD ── */}
        <div className="lg:w-[42%] xl:w-[40%] flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12 relative bg-[#0A0A0A] z-10 min-h-screen">
          
          {/* Radial gold ambient backlight behind card */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.08) 0%, rgba(10,10,10,0) 70%)',
            }}
          />

          {/* Main Card Container */}
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[460px] relative z-10"
          >
            {/* Outer Glass Card */}
            <div
              className="rounded-[32px] p-6 sm:p-9 relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.85)] border border-[#D4AF37]/35"
              style={{
                backgroundColor: 'rgba(22, 22, 22, 0.82)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
              }}
            >
              {/* Subtle gold top shimmer border */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-80" />

              {/* Children Content (AuthHeader, Form, SocialLogin, FeatureSection) */}
              {children}
            </div>
          </motion.div>

          {/* Footer links under card */}
          <div className="mt-8 text-center text-xs text-white/40 z-10">
            <Link to="/" className="hover:text-[#D4AF37] transition-colors mr-4">
              Home
            </Link>
            •
            <Link to="/privacy" className="hover:text-[#D4AF37] transition-colors mx-4">
              Privacy Policy
            </Link>
            •
            <Link to="/terms" className="hover:text-[#D4AF37] transition-colors ml-4">
              Terms of Service
            </Link>
          </div>

        </div>

      </div>

    </div>
  )
}

export default AuthLayout
