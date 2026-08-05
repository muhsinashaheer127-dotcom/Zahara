/** Format price in Indian Rupees */
export const formatPrice = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)

/** Calculate rental total based on duration */
export const calculateRentalTotal = (price, duration, quantity = 1) => {
  const dailyRate = price / 3
  const days = Math.max(duration, 3)
  return Math.round(dailyRate * days * quantity)
}

/** Generate unique booking ID */
export const generateBookingId = () =>
  `ZH-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

/** Filter and sort products */
export const filterProducts = (products, filters) => {
  let result = [...products]

  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.occasion.toLowerCase().includes(q)
    )
  }

  if (filters.category && filters.category !== 'all') {
    result = result.filter((p) => p.category === filters.category)
  }

  if (filters.occasion && filters.occasion !== 'all') {
    result = result.filter((p) => p.occasion === filters.occasion)
  }

  switch (filters.priceRange) {
    case "0-500":
      result = result.filter((p) => p.price >= 0 && p.price <= 500);
      break;

    case "500-1000":
      result = result.filter((p) => p.price >= 500 && p.price <= 1000);
      break;

    case "1000-2000":
      result = result.filter((p) => p.price >= 1000 && p.price <= 2000);
      break;

    case "2000-3000":
      result = result.filter((p) => p.price >= 2000 && p.price <= 3000);
      break;

    case "3000-5000":
      result = result.filter((p) => p.price >= 3000 && p.price <= 5000);
      break;

    case "5000+":
      result = result.filter((p) => p.price >= 5000);
      break;

    default:
      break;
  }

  switch (filters.sortBy) {
    case 'price-low':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      result.sort((a, b) => b.price - a.price)
      break
    case 'popularity':
      result.sort((a, b) => b.reviews - a.reviews)
      break
    case 'newest':
    default:
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
      break
  }

  return result
}

/** Get product by slug or id */
export const getProductBySlug = (products, slug) =>
  products.find((p) => p.slug === slug || p.id === slug)

/** Scroll to top utility */
export const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

/** Validate email */
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

/** Storage keys */
export const STORAGE_KEYS = {
  CART: 'zahara_cart',
  WISHLIST: 'zahara_wishlist',
  USER: 'zahara_user',
  TOKEN: 'zahara_token',
  USERS: 'zahara_users',
  BOOKINGS: 'zahara_bookings',
  ADDRESSES: 'zahara_addresses',
}
