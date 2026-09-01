import { FiShoppingBag, FiHeart, FiShare2 } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { formatPrice } from '../../utils/helpers'

const StickyBookingCard = ({ product, duration, quantity, startDate, endDate, rentalTotal, onRent, onWishlist, onShare, inWishlist }) => {
  const whatsappNumber = '9747133559'
  
  const isUnavailable =
    product.availability === 'out_of_stock' ||
    product.availability === 'unavailable' ||
    product.availableQuantity === 0

  const handleWhatsAppEnquiry = () => {
    const message = `Hello Zahara, I am interested in the ${product.name}. Please share availability, rental price, and booking details.\n\nProduct Code: ${product.id}\nRental Price: ${formatPrice(product.price)}\nRental Duration: ${duration} days\nSelected Dates: ${startDate || 'Not selected'} to ${endDate || 'Not selected'}`
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/91${whatsappNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="lg:sticky lg:top-24 glass-card rounded-3xl p-6 border border-gold/20 luxury-shadow"
    >
      {/* Price Section */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-gold">{formatPrice(product.price)}</span>
          <span className="text-white/50">/ {duration} Days</span>
        </div>
        {product.offerBadge && (
          <span className="inline-block px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full mb-2">
            {product.offerBadge}
          </span>
        )}
        <p className="text-sm text-white/50">Security Deposit: {formatPrice(product.deposit)}</p>
        <p className="text-sm text-white/50">Market Value: {formatPrice(product.marketValue)}</p>
      </div>

      {/* Availability */}
      <div className="mb-6">
        <div className={`flex items-center gap-2 mb-2 ${
          product.availability === 'available' ? 'text-green-400' :
          product.availability === 'limited' ? 'text-yellow-400' :
          'text-red-400'
        }`}>
          <span className={`w-3 h-3 rounded-full ${
            product.availability === 'available' ? 'bg-green-400' :
            product.availability === 'limited' ? 'bg-yellow-400' :
            'bg-red-400'
          }`} />
          <span className="font-semibold capitalize">
            {product.availability === 'available' ? 'Available' :
             product.availability === 'limited' ? 'Limited Stock' :
             'Currently Unavailable'}
          </span>
        </div>
        <p className="text-sm text-white/50">Available Quantity: {product.availableQuantity || 0}</p>
        <p className="text-sm text-white/50">Estimated Delivery: {product.estimatedDelivery || '2-3 days'}</p>
      </div>

      {/* Selected Dates */}
      {(startDate || endDate) && (
        <div className="mb-6 p-4 bg-white/5 rounded-xl">
          <p className="text-sm text-white/70 mb-1">Selected Dates:</p>
          <p className="text-white font-medium">{startDate || 'Not selected'} - {endDate || 'Not selected'}</p>
        </div>
      )}

      {/* Total Price */}
      <div className="mb-6 p-4 bg-gold/10 rounded-xl border border-gold/30">
        <div className="flex justify-between items-center">
          <span className="text-white/70">Total Rental:</span>
          <span className="text-2xl font-bold text-gold">{formatPrice(rentalTotal)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mb-4">
        <button
          type="button"
          onClick={onRent}
          disabled={isUnavailable}
          className={`w-full py-4 font-semibold rounded-2xl transition-all flex items-center justify-center gap-2 luxury-shadow ${
            isUnavailable
              ? 'bg-red-950/80 border border-red-500/30 text-red-300 cursor-not-allowed opacity-90'
              : 'gold-gradient text-black hover:opacity-90'
          }`}
        >
          <FiShoppingBag /> {isUnavailable ? 'Currently Unavailable' : 'Rent Now'}
        </button>
        
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onWishlist}
            className={`flex-1 py-3 rounded-2xl border transition-all flex items-center justify-center gap-2 ${
              inWishlist ? 'border-gold bg-gold/10 text-gold' : 'border-white/20 hover:border-gold'
            }`}
          >
            <FiHeart fill={inWishlist ? 'currentColor' : 'none'} /> Wishlist
          </button>
          <button
            type="button"
            onClick={onShare}
            className="flex-1 py-3 rounded-2xl border border-white/20 hover:border-gold transition-all flex items-center justify-center gap-2"
          >
            <FiShare2 /> Share
          </button>
        </div>
      </div>

      {/* WhatsApp Button */}
      <button
        type="button"
        onClick={handleWhatsAppEnquiry}
        className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Enquire on WhatsApp
      </button>
    </motion.div>
  )
}

export default StickyBookingCard
