import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart, FiEye, FiStar } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/helpers'
import LazyImage from '../LazyImage'

const ProductCard = ({ product, showBadge = null, onQuickView }) => {
  const { toggleWishlist, isInWishlist, addToCart } = useCart()
  const inWishlist = isInWishlist(product.id)

  const isUnavailable =
    product.availability === 'out_of_stock' ||
    product.availability === 'unavailable' ||
    product.availableQuantity === 0

  const badge = isUnavailable
    ? 'Currently Unavailable'
    : showBadge || (product.isBestSeller ? 'Trending' : product.isNew ? 'New' : null)

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className={`group glass-card rounded-2xl overflow-hidden border transition-all duration-500 luxury-shadow ${
        isUnavailable ? 'border-red-500/20 opacity-90' : 'border-white/5 hover:border-gold/30'
      }`}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Link to={`/product/${product.slug}`}>
          <LazyImage
            src={product.images[0]}
            alt={product.name}
            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${
              isUnavailable ? 'grayscale-[30%]' : ''
            }`}
          />
        </Link>

        {badge && (
          <span
            className={`absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 py-1 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wider ${
              isUnavailable
                ? 'bg-red-500/90 text-white shadow-lg'
                : 'gold-gradient text-black'
            }`}
          >
            {badge}
          </span>
        )}

        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            className={`p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full backdrop-blur-md transition-colors ${
              inWishlist ? 'bg-gold text-black' : 'bg-black/60 text-white hover:bg-gold hover:text-black'
            }`}
            aria-label="Add to wishlist"
          >
            <FiHeart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>
          {onQuickView && (
            <button
              type="button"
              onClick={() => onQuickView(product)}
              className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-gold hover:text-black backdrop-blur-md transition-colors"
              aria-label="Quick view"
            >
              <FiEye size={16} />
            </button>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-0 sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-300">
          <button
            type="button"
            onClick={() => !isUnavailable && addToCart(product)}
            disabled={isUnavailable}
            className={`w-full py-2.5 sm:py-3 min-h-[44px] text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center shadow-lg ${
              isUnavailable
                ? 'bg-red-950/80 border border-red-500/30 text-red-300 cursor-not-allowed opacity-90'
                : 'gold-gradient text-black hover:opacity-90'
            }`}
          >
            {isUnavailable ? 'Currently Unavailable' : 'Rent Now'}
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1 mb-2">
          <FiStar className="text-gold fill-gold" size={14} />
          <span className="text-sm text-white/70">{product.rating}</span>
          <span className="text-xs text-white/40">({product.reviews})</span>
        </div>

        <Link to={`/product/${product.slug}`}>
          <h3 className="font-[family-name:var(--font-heading)] text-lg font-medium mb-2 hover:text-gold transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-1">
          <span className="text-gold font-semibold text-lg">{formatPrice(product.price)}</span>
          <span className="text-white/50 text-sm">/ {product.duration} Days</span>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard
