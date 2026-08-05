import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowUp } from 'react-icons/fi'
import { useScrollPosition } from '../../hooks/useLocalStorage'
import { scrollToTop } from '../../utils/helpers'

const BackToTop = () => {
  const visible = useScrollPosition(400)

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 p-3 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full gold-gradient text-black shadow-xl hover:scale-110 transition-transform"
          aria-label="Back to top"
        >
          <FiArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default BackToTop
