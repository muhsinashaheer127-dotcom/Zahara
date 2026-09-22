import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../../components/SEO'
import AnimateOnScroll from '../../components/AnimateOnScroll'
import { formatPrice } from '../../utils/helpers'
import { useAuth } from '../../context/AuthContext'
import { bookingService } from '../../services/api'

const Bookings = () => {
  const { user, isAuthenticated } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) return

    let isMounted = true
    const fetchBookings = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await bookingService.getAll()
        if (isMounted) {
          setBookings(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        if (isMounted) {
          console.error('[Bookings] Error fetching bookings:', err)
          setError(err.message || 'Failed to load bookings.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchBookings()
    return () => {
      isMounted = false
    }
  }, [isAuthenticated, user])

  if (!isAuthenticated) {
    return (
      <div className="section-padding text-center">
        <p className="text-white/60 mb-4">Please login to view your bookings</p>
        <Link to="/login" className="text-gold hover:underline">
          Login
        </Link>
      </div>
    )
  }

  return (
    <>
      <SEO title="My Bookings | Zahara Luxury Rentals" />
      <div className="section-padding">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">My Bookings</h1>
            <p className="text-white/60 text-sm md:text-base">
              {loading ? 'Loading bookings...' : `${bookings.length} booking${bookings.length === 1 ? '' : 's'}`}
            </p>
          </AnimateOnScroll>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-16 glass-card rounded-2xl border border-red-500/20 p-6">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 rounded-full border border-gold/40 text-gold hover:bg-gold/10 text-sm font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          ) : bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const bookingId = booking.customId || booking.id || booking._id
                const bookingTotal = booking.totalAmount || booking.rentalAmount || booking.total || 0
                const bookingDate = booking.createdAt
                  ? new Date(booking.createdAt).toLocaleDateString()
                  : 'Recent'

                return (
                  <AnimateOnScroll key={bookingId}>
                    <div className="glass-card rounded-2xl p-6 border border-gold/10 hover:border-gold/30 transition-colors">
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                        <div>
                          <p className="text-gold font-semibold tracking-wide">{bookingId}</p>
                          <p className="text-sm text-white/50">{bookingDate}</p>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs rounded-full capitalize font-medium ${
                            booking.status === 'Confirmed' || booking.status === 'Active'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : booking.status === 'Pending'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-white/10 text-white/70 border border-white/10'
                          }`}
                        >
                          {booking.status || 'Pending'}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="space-y-2 border-t border-white/5 pt-3">
                        {Array.isArray(booking.items) && booking.items.length > 0 ? (
                          booking.items.map((item, idx) => (
                            <div key={item.cartId || item._id || idx} className="flex justify-between text-sm">
                              <span className="text-white/80">
                                {item.name || item.productName} × {item.quantity || 1}
                              </span>
                              <span className="text-white/60">
                                {formatPrice(item.price || item.rentalAmount || 0)}
                              </span>
                            </div>
                          ))
                        ) : booking.productName ? (
                          <div className="flex justify-between text-sm">
                            <span className="text-white/80">{booking.productName}</span>
                            <span className="text-white/60">
                              {formatPrice(booking.rentalAmount || 0)}
                            </span>
                          </div>
                        ) : (
                          <p className="text-sm text-white/60">Standard Rental Package</p>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
                        <span className="text-xs text-white/50">
                          {booking.duration ? `${booking.duration} days rental` : 'Rental order'}
                        </span>
                        <p className="text-gold font-semibold">Total: {formatPrice(bookingTotal)}</p>
                      </div>
                    </div>
                  </AnimateOnScroll>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-20 glass-card rounded-2xl border border-gold/10">
              <p className="text-white/60 mb-4">No bookings found</p>
              <Link
                to="/collections"
                className="inline-block px-6 py-3 gold-gradient text-black font-semibold rounded-full hover:shadow-lg hover:shadow-gold/20 transition-all"
              >
                Explore Collections
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Bookings
