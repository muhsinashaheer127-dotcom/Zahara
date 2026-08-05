import { FiShield, FiLock, FiZap } from 'react-icons/fi'

const FEATURES = [
  {
    icon: FiShield,
    title: 'Secure Login',
    subtitle: 'Your data is protected',
  },
  {
    icon: FiLock,
    title: 'Encrypted Data',
    subtitle: '256-bit encryption',
  },
  {
    icon: FiZap,
    title: 'Instant Access',
    subtitle: 'Quick & easy access',
  },
]

const FeatureSection = () => {
  return (
    <div className="mt-7 pt-5 border-t border-white/10">
      <div className="grid grid-cols-3 gap-2 text-center">
        {FEATURES.map((item, idx) => {
          const Icon = item.icon
          return (
            <div key={idx} className="flex flex-col items-center gap-1 group cursor-default">
              <div className="p-1.5 rounded-lg bg-white/[0.04] border border-[#D4AF37]/25 text-[#D4AF37] group-hover:bg-[#D4AF37]/15 group-hover:border-[#D4AF37]/60 group-hover:scale-110 transition-all duration-300">
                <Icon size={14} />
              </div>
              <span className="text-[11px] font-medium text-white/90 group-hover:text-[#D4AF37] transition-colors mt-0.5">
                {item.title}
              </span>
              <span className="text-[9px] text-white/40 tracking-tight leading-tight">
                {item.subtitle}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FeatureSection
