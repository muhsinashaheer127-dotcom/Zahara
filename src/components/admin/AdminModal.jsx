import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'

const AdminModal = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-xl' }) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.3, bounce: 0.1 }}
          className={`relative w-full ${maxWidth} bg-[#111111] border border-gold/30 rounded-3xl p-6 sm:p-8 luxury-shadow text-white z-10 my-auto`}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-white/50 hover:text-gold hover:bg-white/5 rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>

          {/* Header */}
          {(title || subtitle) && (
            <div className="mb-6 pr-8">
              {title && (
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-gold tracking-wide">
                  {title}
                </h3>
              )}
              {subtitle && <p className="text-xs text-white/60 mt-1">{subtitle}</p>}
            </div>
          )}

          {/* Content Body */}
          <div className="max-h-[75vh] overflow-y-auto pr-1">{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default AdminModal
