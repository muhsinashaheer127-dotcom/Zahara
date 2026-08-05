import { Link } from 'react-router-dom'
import SEO from '../../components/SEO'
import AnimateOnScroll from '../../components/AnimateOnScroll'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { STORAGE_KEYS, formatPrice } from '../../utils/helpers'
import { useAuth } from '../../context/AuthContext'

const Bookings = () => {
  const [bookings] = useLocalStorage(STORAGE_KEYS.BOOKINGS, [])
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="section-padding text-center">
        <p className="text-white/60 mb-4">Please login to view your bookings</p>
        <Link to="/login" className="text-gold hover:underline">Login</Link>
      </div>
    )
  }

  return (
    <>
      <SEO title="My Bookings" />
      <div className="section-padding">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">My Bookings</h1>
            <p className="text-white/60 text-sm md:text-base">{bookings.length} bookings</p>
          </AnimateOnScroll>

          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <AnimateOnScroll key={booking.id}>
                  <div className="glass-card rounded-2xl p-6 border border-gold/10">
                    <div className="flex flex-wrap justify-between gap-4 mb-4">
                      <div>
                        <p className="text-gold font-semibold">{booking.id}</p>
                        <p className="text-sm text-white/50">{new Date(booking.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full capitalize">{booking.status}</span>
                    </div>
                    <div className="space-y-2">
                      {booking.items?.map((item) => (
                        <p key={item.cartId} className="text-sm text-white/70">{item.name} × {item.quantity}</p>
                      ))}
                    </div>
                    <p className="text-gold font-semibold mt-4">Total: {formatPrice(booking.total)}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 glass-card rounded-2xl">
              <p className="text-white/60 mb-4">No bookings yet</p>
              <Link to="/collections" className="inline-block px-6 py-3 gold-gradient text-black font-semibold rounded-full">
                Start Renting
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Bookings
