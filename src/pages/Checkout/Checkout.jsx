import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import SEO from '../../components/SEO'
import AnimateOnScroll from '../../components/AnimateOnScroll'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { formatPrice } from '../../utils/helpers'

import { useNavigate } from 'react-router-dom'
import { bookingService } from '../../services/api'
import toast from 'react-hot-toast'

const WHATSAPP_NUMBER = '919747133559'

const Checkout = () => {
  const { cartItems, cartSummary, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    pincode: '',
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleWhatsAppEnquiry = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    let createdBookingId = `ZH-BK-${Math.floor(1000 + Math.random() * 9000)}`

    try {
      const bookingData = {
        customerName: form.name || user?.name || 'Valued Client',
        customerEmail: form.email || user?.email || '',
        customerPhone: form.phone || '',
        deliveryAddress: `${form.address}, ${form.city} - ${form.pincode}`,
        productName: cartItems.map((i) => i.name).join(', '),
        rentalAmount: cartSummary.subtotal,
        securityDeposit: cartSummary.deposit,
        totalAmount: cartSummary.total,
        duration: cartItems[0]?.duration || 3,
        items: cartItems.map((item) => ({
          cartId: item.cartId,
          productId: item.id || item.slug,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
        })),
        status: 'Pending',
        paymentStatus: 'Pending',
      }

      const res = await bookingService.create(bookingData)
      if (res?.bookingId || res?.booking?.customId) {
        createdBookingId = res.bookingId || res.booking.customId
      }
    } catch (err) {
      console.warn('[Checkout] Could not persist booking to backend:', err.message)
    }

    const itemsList = cartItems
      .map((item) => `• ${item.name} (${item.size || 'Free Size'}) x${item.quantity} — ${formatPrice(item.price)}`)
      .join('\n')
    const message =
      `Hello Zahara! I would like to book the following items (Booking ID: ${createdBookingId}):\n\n` +
      `${itemsList}\n\n` +
      `*Order Summary*\n` +
      `Rental Total: ${formatPrice(cartSummary.subtotal)}\n` +
      `Security Deposit: ${formatPrice(cartSummary.deposit)}\n` +
      `Grand Total: ${formatPrice(cartSummary.total)}\n\n` +
      `*My Details*\n` +
      `Name: ${form.name || 'Not provided'}\n` +
      `Email: ${form.email || 'Not provided'}\n` +
      `Phone: ${form.phone || 'Not provided'}\n` +
      `City: ${form.city || 'Not provided'}\n` +
      `Address: ${form.address || 'Not provided'}\n\n` +
      `Please confirm availability and next steps. Thank you!`

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')

    clearCart()
    setSubmitting(false)
    navigate('/booking-success', { state: { bookingId: createdBookingId } })
  }

  if (cartItems.length === 0) {
    return (
      <div className="section-padding text-center">
        <p className="text-white/60 mb-4">No items to checkout</p>
        <Link to="/collections" className="text-gold hover:underline">Browse Collections</Link>
      </div>
    )
  }

  return (
    <>
      <SEO title="Checkout" />
      <div className="section-padding">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold">Checkout</h1>
          </AnimateOnScroll>

          <form onSubmit={handleWhatsAppEnquiry} className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-gold mb-6">Delivery Address</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {['name', 'email', 'phone', 'city', 'pincode'].map((field) => (
                    <input
                      key={field}
                      name={field}
                      type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={form[field]}
                      onChange={handleChange}
                      required
                      className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-gold/50 text-base"
                    />
                  ))}
                  <textarea
                    name="address"
                    placeholder="Full Address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="sm:col-span-2 px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-gold/50 resize-none text-base"
                  />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 border border-green-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <FaWhatsapp className="text-green-400" size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">WhatsApp Enquiry</h2>
                    <p className="text-sm text-white/50">We'll confirm your booking via WhatsApp</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">
                  After submitting, you'll be redirected to WhatsApp with your order details pre-filled.
                  Our team will confirm availability and guide you through the rental process.
                </p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-gold/20 h-fit sticky top-28">
              <h2 className="text-xl font-semibold text-gold mb-6">Order Summary</h2>
              {cartItems.map((item) => (
                <div key={item.cartId} className="flex justify-between text-sm mb-3 pb-3 border-b border-white/5">
                  <span className="text-white/70 truncate mr-2">{item.name}</span>
                  <span>{formatPrice(item.price)}</span>
                </div>
              ))}
              <div className="space-y-2 mt-4 text-sm">
                <div className="flex justify-between"><span className="text-white/60">Rental</span><span>{formatPrice(cartSummary.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-white/60">Deposit</span><span>{formatPrice(cartSummary.deposit)}</span></div>
                <div className="flex justify-between font-bold text-lg pt-3 border-t border-white/10">
                  <span>Total</span><span className="text-gold">{formatPrice(cartSummary.total)}</span>
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-6 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl transition-colors flex items-center justify-center gap-2 luxury-shadow"
              >
                <FaWhatsapp size={20} /> Enquire on WhatsApp
              </button>
            </div>
          </form>
          <p className="text-center text-white/30 text-xs mt-4">Your details will only be shared via WhatsApp with our team.</p>
        </div>
      </div>
    </>
  )
}

export default Checkout
