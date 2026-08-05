import { useState } from 'react'
import toast from 'react-hot-toast'
import { FiSend } from 'react-icons/fi'
import { newsletterService } from '../../services/api'
import { isValidEmail } from '../../utils/helpers'
import AnimateOnScroll from '../AnimateOnScroll'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email')
      return
    }
    setLoading(true)
    try {
      await newsletterService.subscribe(email)
      toast.success('Welcome to the Zahara circle!')
      setEmail('')
    } catch {
      toast.error('Subscription failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section-padding">
      <div className="max-w-4xl mx-auto">
        <AnimateOnScroll>
          <div className="glass-card rounded-2xl p-8 md:p-12 text-center border border-gold/20 luxury-shadow">
            <p className="text-gold tracking-[0.3em] uppercase text-sm mb-3">Stay Connected</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Exclusive Circle</h2>
            <p className="text-white/60 mb-8 max-w-lg mx-auto">
              Subscribe for early access to new collections, exclusive offers, and styling tips from our experts.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-5 py-3.5 bg-black/50 border border-gold/30 rounded-full text-white text-base placeholder:text-white/40 focus:outline-none focus:border-gold transition-colors min-h-[44px]"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 gold-gradient text-black font-semibold rounded-full hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px] w-full sm:w-auto"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
                <FiSend size={16} />
              </button>
            </form>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}

export default Newsletter
