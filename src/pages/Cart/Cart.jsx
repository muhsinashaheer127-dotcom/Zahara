import { Link } from 'react-router-dom'
import { FiTrash2, FiTag } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useState } from 'react'
import toast from 'react-hot-toast'
import SEO from '../../components/SEO'
import AnimateOnScroll from '../../components/AnimateOnScroll'
import LazyImage from '../../components/LazyImage'
import { useCart } from '../../context/CartContext'
import { formatPrice, calculateRentalTotal } from '../../utils/helpers'

const Cart = () => {
  const { cartItems, removeFromCart, cartSummary } = useCart()
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(0)

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'ZAHARA10') {
      setDiscount(cartSummary.subtotal * 0.1)
      toast.success('10% discount applied!')
    } else {
      toast.error('Invalid coupon code')
    }
  }

  const finalTotal = cartSummary.subtotal - discount + cartSummary.deposit

  const handleWhatsAppEnquiry = () => {
    if (cartItems.length === 0) return
    const itemsList = cartItems
      .map((item) => `• ${item.name} (${item.size}) x${item.quantity} — ${formatPrice(calculateRentalTotal(item.price, item.duration, item.quantity))}`)
      .join('\n')
    const message =
      `Hello Zahara! I would like to enquire about renting the following items:\n\n` +
      `${itemsList}\n\n` +
      `*Order Summary*\n` +
      `Rental Total: ${formatPrice(cartSummary.subtotal)}\n` +
      `Security Deposit: ${formatPrice(cartSummary.deposit)}\n` +
      (discount > 0 ? `Discount: -${formatPrice(discount)}\n` : '') +
      `Grand Total: ${formatPrice(finalTotal)}\n\n` +
      `Please confirm availability and next steps. Thank you!`
    const url = `https://wa.me/919747133559?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <>
      <SEO title="Cart" />
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          <AnimateOnScroll className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Rental Cart</h1>
            <p className="text-white/60 text-sm md:text-base">{cartItems.length} items in cart</p>
          </AnimateOnScroll>

          {cartItems.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <AnimateOnScroll key={item.cartId}>
                    <div className="glass-card rounded-2xl p-4 md:p-6 flex gap-4 md:gap-6">
                      <Link to={`/product/${item.slug}`} className="shrink-0 w-24 h-32 md:w-32 md:h-40 rounded-xl overflow-hidden">
                        <LazyImage src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.slug}`}>
                          <h3 className="font-[family-name:var(--font-heading)] text-lg hover:text-gold transition-colors truncate">{item.name}</h3>
                        </Link>
                        <p className="text-sm text-white/50 mt-1">Size: {item.size} | Qty: {item.quantity}</p>
                        {item.startDate && <p className="text-sm text-white/50">Dates: {item.startDate} — {item.endDate || 'TBD'}</p>}
                        <p className="text-gold font-semibold mt-2">
                          {formatPrice(calculateRentalTotal(item.price, item.duration, item.quantity))}
                        </p>
                        <p className="text-xs text-white/40">Deposit: {formatPrice(item.deposit * item.quantity)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.cartId)}
                        className="self-start touch-target text-white/40 hover:text-red-400 transition-colors"
                        aria-label="Remove"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>

              <AnimateOnScroll>
                <div className="glass-card rounded-2xl p-6 border border-gold/20 sticky top-28">
                  <h2 className="text-xl font-bold mb-6 text-gold">Rental Summary</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-white/60">Subtotal</span><span>{formatPrice(cartSummary.subtotal)}</span></div>
                    <div className="flex justify-between"><span className="text-white/60">Security Deposit</span><span>{formatPrice(cartSummary.deposit)}</span></div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-400"><span>Discount</span><span>-{formatPrice(discount)}</span></div>
                    )}
                    <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-lg">
                      <span>Total</span><span className="text-gold">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-base focus:outline-none focus:border-gold/50"
                    />
                    <button type="button" onClick={applyCoupon} className="touch-target px-4 border border-gold/30 rounded-xl text-gold text-sm hover:bg-gold/10">
                      <FiTag />
                    </button>
                  </div>
                  <p className="text-xs text-white/30 mt-2">Try: ZAHARA10 for 10% off</p>

                  <button
                    type="button"
                    onClick={handleWhatsAppEnquiry}
                    className="flex w-full mt-6 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl text-center items-center justify-center gap-2 transition-colors luxury-shadow"
                  >
                    <FaWhatsapp size={20} /> Enquire on WhatsApp
                  </button>
                  <p className="text-center text-white/30 text-xs mt-3">We'll confirm your booking via WhatsApp</p>
                </div>
              </AnimateOnScroll>
            </div>
          ) : (
            <div className="text-center py-20 glass-card rounded-2xl">
              <p className="text-white/60 text-lg mb-4">Your cart is empty</p>
              <Link to="/collections" className="inline-block px-6 py-3 gold-gradient text-black font-semibold rounded-full">
                Browse Collections
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Cart
