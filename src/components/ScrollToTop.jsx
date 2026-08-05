import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop Component
 * 
 * Guarantees scroll reset to top (0, 0) on EVERY route transition, including:
 * - Home (/)
 * - FAQ (/faq)
 * - All Navbar / Footer links
 * - Product cards & buttons
 * - Re-clicking the current page link (same-path navigation via location.key)
 * 
 * Optimized for Framer Motion <AnimatePresence mode="wait"> exit animations (300ms).
 */
const ScrollToTop = () => {
  const { pathname, search, hash, key } = useLocation()

  useEffect(() => {
    // Prevent browser from trying to restore past scroll position on SPA navigation
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    // Handle in-page anchor hash links (e.g. /#features)
    if (hash) {
      const targetId = hash.replace('#', '')
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }

    const resetScroll = () => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    // 1. Immediate reset
    resetScroll()

    // 2. DOM paint frame reset
    const rafId = requestAnimationFrame(resetScroll)

    // 3. Staggered timers matching Framer Motion AnimatePresence mode="wait" transition
    const t1 = setTimeout(resetScroll, 50)
    const t2 = setTimeout(resetScroll, 150)
    const t3 = setTimeout(resetScroll, 320)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [pathname, search, hash, key])

  return null
}

export default ScrollToTop
