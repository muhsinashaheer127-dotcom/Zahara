import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiHeart, FiStar, FiMinus, FiPlus, FiShoppingBag, FiShare2 } from 'react-icons/fi'
import SEO from '../../components/SEO'
import ProductCard from '../../components/ProductCard/ProductCard'
import AnimateOnScroll from '../../components/AnimateOnScroll'
import LazyImage from '../../components/LazyImage'
import StickyBookingCard from '../../components/ProductDetails/StickyBookingCard'
import ReviewsSection from '../../components/ProductDetails/ReviewsSection'
import FeaturesCard from '../../components/ProductDetails/FeaturesCard'
import RentalDurationSelector from '../../components/ProductDetails/RentalDurationSelector'
import { PRODUCTS } from '../../data/products'
import { getProductBySlug, formatPrice, calculateRentalTotal } from '../../utils/helpers'
import { useCart } from '../../context/CartContext'

const ProductDetails = () => {
  const { slug } = useParams()
  const product = getProductBySlug(PRODUCTS, slug)
  const { addToCart, toggleWishlist, isInWishlist } = useCart()

  const [selectedImage, setSelectedImage] = useState(0)
  const [duration, setDuration] = useState(product?.duration || 3)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'Free Size')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const FEATURES_LIST = [
    'Premium Quality',
    'Certified Jewellery',
    'Secure Payment',
    'Doorstep Delivery',
    'Easy Return',
    'Sanitized Before Delivery',
  ]

  if (!product) {
    return (
      <div className="section-padding text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link to="/collections" className="text-gold hover:underline">Back to Collections</Link>
      </div>
    )
  }

  const rentalTotal = calculateRentalTotal(product.price, duration, quantity)
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
  const inWishlist = isInWishlist(product.id)

  const handleRent = () => {
    addToCart(product, { startDate, endDate, duration, quantity, size: selectedSize })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this beautiful ${product.name} from Zahara Jewellery Rental!`,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Share failed:', err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const averageRating = product.customerReviews?.length 
    ? product.customerReviews.reduce((acc, r) => acc + r.rating, 0) / product.customerReviews.length 
    : product.rating

  return (
    <>
      <SEO title={product.name} description={product.description} />
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[60%_40%] gap-8 lg:gap-12">
            {/* Image Gallery - Left (60%) */}
            <AnimateOnScroll variant="slideLeft">
              <div className="space-y-4">
                <div className="relative aspect-square rounded-3xl overflow-hidden glass-card group">
                  <LazyImage
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {product.offerBadge && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                      {product.offerBadge}
                    </span>
                  )}
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(i)}
                      className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
                        selectedImage === i ? 'border-gold' : 'border-white/10'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>

            {/* Product Info - Right (40%) */}
            <AnimateOnScroll variant="slideRight">
              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className={i < Math.round(product.rating) ? 'text-gold fill-gold' : 'text-white/20'} size={18} />
                  ))}
                </div>
                <span className="text-white font-medium">{product.rating}</span>
                <span className="text-white/40">({product.reviews} Reviews)</span>
              </div>

              {/* Product Name & Code */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white">{product.name}</h1>
              <p className="text-white/40 text-sm mb-4">Product Code: ZH-{product.id}</p>
              
              {/* Category */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-medium rounded-full uppercase tracking-wider">
                  {product.category.replace('-', ' ')}
                </span>
              </div>

              {/* Description */}
              <p className="text-white/70 leading-relaxed mb-6">{product.description}</p>

              {/* Features */}
              <FeaturesCard features={FEATURES_LIST} />

              {/* Size Selection */}
              <div className="mb-6">
                <label className="text-sm text-gold uppercase tracking-wider mb-3 block">Select Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-full border text-sm transition-all ${
                        selectedSize === size ? 'border-gold bg-gold/10 text-gold' : 'border-white/20 hover:border-gold/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm text-white/60 mb-2 block">Delivery Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 bg-charcoal border border-white/10 rounded-xl focus:outline-none focus:border-gold/50 text-white text-base"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-2 block">Return Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 bg-charcoal border border-white/10 rounded-xl focus:outline-none focus:border-gold/50 text-white text-base"
                  />
                </div>
              </div>

              {/* Rental Duration */}
              <RentalDurationSelector duration={duration} setDuration={setDuration} />

              {/* Quantity */}
              <div className="mb-6">
                <label className="text-sm text-white/60 mb-2 block">Quantity</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="touch-target border border-white/20 rounded-lg hover:border-gold text-white/80 hover:text-gold transition-all">
                    <FiMinus />
                  </button>
                  <span className="w-8 text-center text-lg font-semibold text-white">{quantity}</span>
                  <button type="button" onClick={() => setQuantity(quantity + 1)} className="touch-target border border-white/20 rounded-lg hover:border-gold text-white/80 hover:text-gold transition-all">
                    <FiPlus />
                  </button>
                </div>
              </div>

              {/* Sticky Booking Card */}
              <StickyBookingCard
                product={product}
                duration={duration}
                quantity={quantity}
                startDate={startDate}
                endDate={endDate}
                rentalTotal={rentalTotal}
                onRent={handleRent}
                onWishlist={() => toggleWishlist(product)}
                onShare={handleShare}
                inWishlist={inWishlist}
              />
            </AnimateOnScroll>
          </div>

          {/* Specifications */}
          <div className="mt-16">
            <AnimateOnScroll>
              <h2 className="text-2xl font-bold mb-6 text-gold">Product Specifications</h2>
              <div className="glass-card rounded-3xl p-6 border border-gold/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0">
                      <span className="text-white/50 capitalize font-medium">{key}</span>
                      <span className="text-white font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Customer Reviews */}
          {product.customerReviews && product.customerReviews.length > 0 && (
            <ReviewsSection
              reviews={product.customerReviews}
              averageRating={averageRating}
              totalReviews={product.reviews}
            />
          )}

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8 text-gold">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ProductDetails
