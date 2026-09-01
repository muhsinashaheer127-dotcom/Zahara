import { PRODUCTS, CATEGORIES } from '../data/products'

const STORAGE_KEYS = {
  PRODUCTS: 'zh_admin_products',
  USERS: 'zh_admin_users',
  BOOKINGS: 'zh_admin_bookings',
  ORDERS: 'zh_admin_orders',
  PAYMENTS: 'zh_admin_payments',
  CATEGORIES: 'zh_admin_categories',
  REVIEWS: 'zh_admin_reviews',
  SETTINGS: 'zh_admin_settings',
}

// Initial Mock Seed Data
const MOCK_USERS = [
  {
    id: 'usr_101',
    name: 'Princess Diana',
    email: 'demo@zahara.com',
    phone: '+91 98765 43210',
    registrationDate: '2025-01-15',
    totalBookings: 4,
    accountStatus: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'usr_102',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98112 34567',
    registrationDate: '2025-02-01',
    totalBookings: 2,
    accountStatus: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'usr_103',
    name: 'Ananya Reddy',
    email: 'ananya.r@example.com',
    phone: '+91 97223 45678',
    registrationDate: '2025-02-10',
    totalBookings: 1,
    accountStatus: 'Active',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'usr_104',
    name: 'Sneha Patel',
    email: 'sneha.patel@example.com',
    phone: '+91 96334 56789',
    registrationDate: '2025-02-14',
    totalBookings: 3,
    accountStatus: 'Blocked',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  },
]

const MOCK_BOOKINGS = [
  {
    id: 'ZH-BK-1001',
    customer: 'Princess Diana',
    email: 'demo@zahara.com',
    productId: '1',
    product: 'Royal Emerald Bridal Set',
    startDate: '2026-09-05',
    endDate: '2026-09-08',
    price: 2499,
    deposit: 5000,
    paymentStatus: 'Paid',
    bookingStatus: 'Confirmed',
  },
  {
    id: 'ZH-BK-1002',
    customer: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    productId: '2',
    product: 'Pearl Cascade Necklace',
    startDate: '2026-09-10',
    endDate: '2026-09-13',
    price: 1299,
    deposit: 2500,
    paymentStatus: 'Paid',
    bookingStatus: 'Active',
  },
  {
    id: 'ZH-BK-1003',
    customer: 'Ananya Reddy',
    email: 'ananya.r@example.com',
    productId: '9',
    product: 'Heritage Polki Set',
    startDate: '2026-09-01',
    endDate: '2026-09-04',
    price: 3499,
    deposit: 7000,
    paymentStatus: 'Pending',
    bookingStatus: 'Pending',
  },
  {
    id: 'ZH-BK-1004',
    customer: 'Sneha Patel',
    email: 'sneha.patel@example.com',
    productId: '4',
    product: 'Temple Gold Choker',
    startDate: '2026-08-20',
    endDate: '2026-08-23',
    price: 1799,
    deposit: 3500,
    paymentStatus: 'Paid',
    bookingStatus: 'Returned',
  },
]

const MOCK_ORDERS = [
  {
    id: 'ORD-7001',
    bookingId: 'ZH-BK-1001',
    customer: 'Princess Diana',
    product: 'Royal Emerald Bridal Set',
    deliveryDate: '2026-09-04',
    returnDate: '2026-09-09',
    status: 'Ready for Dispatch',
    isOverdue: false,
    trackingCode: 'ZHR-TRK-9821',
  },
  {
    id: 'ORD-7002',
    bookingId: 'ZH-BK-1002',
    customer: 'Priya Sharma',
    product: 'Pearl Cascade Necklace',
    deliveryDate: '2026-09-09',
    returnDate: '2026-09-14',
    status: 'In Transit',
    isOverdue: false,
    trackingCode: 'ZHR-TRK-9822',
  },
  {
    id: 'ORD-7003',
    bookingId: 'ZH-BK-1004',
    customer: 'Sneha Patel',
    product: 'Temple Gold Choker',
    deliveryDate: '2026-08-19',
    returnDate: '2026-08-24',
    status: 'Returned',
    isOverdue: false,
    trackingCode: 'ZHR-TRK-9710',
  },
]

const MOCK_PAYMENTS = [
  {
    id: 'PAY-9001',
    customer: 'Princess Diana',
    bookingId: 'ZH-BK-1001',
    amount: 7499,
    paymentDate: '2026-09-01',
    paymentMethod: 'UPI / GPay',
    paymentStatus: 'Paid',
  },
  {
    id: 'PAY-9002',
    customer: 'Priya Sharma',
    bookingId: 'ZH-BK-1002',
    amount: 3799,
    paymentDate: '2026-08-30',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
  },
  {
    id: 'PAY-9003',
    customer: 'Ananya Reddy',
    bookingId: 'ZH-BK-1003',
    amount: 10499,
    paymentDate: '2026-09-01',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Pending',
  },
  {
    id: 'PAY-9004',
    customer: 'Sneha Patel',
    bookingId: 'ZH-BK-1004',
    amount: 5298,
    paymentDate: '2026-08-18',
    paymentMethod: 'Net Banking',
    paymentStatus: 'Refunded',
  },
]

const MOCK_REVIEWS = [
  {
    id: 'REV-1',
    customer: 'Priya Sharma',
    product: 'Royal Emerald Bridal Set',
    rating: 5,
    date: '2026-08-15',
    comment: 'Absolutely stunning piece! Made my wedding day so special. Excellent quality and service.',
    status: 'Approved',
  },
  {
    id: 'REV-2',
    customer: 'Ananya Reddy',
    product: 'Pearl Cascade Necklace',
    rating: 5,
    date: '2026-08-20',
    comment: 'Quality exceeded expectations. Highly recommended for function rentals!',
    status: 'Approved',
  },
  {
    id: 'REV-3',
    customer: 'Meera Kapoor',
    product: 'Temple Gold Choker',
    rating: 4,
    date: '2026-08-25',
    comment: 'Beautiful set, delivery was right on time.',
    status: 'Pending',
  },
]

const DEFAULT_SETTINGS = {
  adminEmail: 'zahararental@gmail.com',
  notificationsEnabled: true,
  emailAlerts: true,
  smsAlerts: false,
  siteName: 'Zahara Rental Jewellery',
  currency: '₹',
  minRentalDays: 3,
  depositMultiplier: 1.0,
  lateFeePerDay: 500,
  maintenanceMode: false,
  paymentGatewayTestMode: false,
  contactPhone: '+91 9747133559',
}

class AdminService {
  getStorageItem(key, defaultValue) {
    try {
      const data = localStorage.getItem(key)
      if (data) return JSON.parse(data)
      localStorage.setItem(key, JSON.stringify(defaultValue))
      return defaultValue
    } catch (e) {
      console.error(`Error reading ${key} from storage:`, e)
      return defaultValue
    }
  }

  setStorageItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      window.dispatchEvent(new Event('zh_admin_data_updated'))
    } catch (e) {
      console.error(`Error saving ${key} to storage:`, e)
    }
  }

  // --- PRODUCTS ---
  getProducts() {
    return this.getStorageItem(STORAGE_KEYS.PRODUCTS, PRODUCTS)
  }

  saveProducts(products) {
    this.setStorageItem(STORAGE_KEYS.PRODUCTS, products)
  }

  addProduct(product) {
    const products = this.getProducts()
    const newProduct = {
      ...product,
      id: product.id || String(Date.now()),
      slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: product.rating || 5.0,
      reviews: product.reviews || 0,
      availability: product.availability || 'available',
      availableQuantity: Number(product.availableQuantity) || 1,
      images: Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'],
    }
    const updated = [newProduct, ...products]
    this.saveProducts(updated)
    return newProduct
  }

  updateProduct(id, updates) {
    const products = this.getProducts()
    const updated = products.map((p) => (p.id === id ? { ...p, ...updates } : p))
    this.saveProducts(updated)
    return updated.find((p) => p.id === id)
  }

  deleteProduct(id) {
    const products = this.getProducts()
    const updated = products.filter((p) => p.id !== id)
    this.saveProducts(updated)
    return true
  }

  // --- CATEGORIES ---
  getCategories() {
    return this.getStorageItem(STORAGE_KEYS.CATEGORIES, CATEGORIES)
  }

  addCategory(category) {
    const categories = this.getCategories()
    const newCat = {
      ...category,
      id: category.id || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      slug: category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    }
    const updated = [...categories, newCat]
    this.setStorageItem(STORAGE_KEYS.CATEGORIES, updated)
    return newCat
  }

  updateCategory(id, updates) {
    const categories = this.getCategories()
    const updated = categories.map((c) => (c.id === id ? { ...c, ...updates } : c))
    this.setStorageItem(STORAGE_KEYS.CATEGORIES, updated)
    return updated.find((c) => c.id === id)
  }

  deleteCategory(id) {
    const categories = this.getCategories()
    const updated = categories.filter((c) => c.id !== id)
    this.setStorageItem(STORAGE_KEYS.CATEGORIES, updated)
    return true
  }

  // --- USERS ---
  getUsers() {
    return this.getStorageItem(STORAGE_KEYS.USERS, MOCK_USERS)
  }

  updateUserStatus(id, status) {
    const users = this.getUsers()
    const updated = users.map((u) => (u.id === id ? { ...u, accountStatus: status } : u))
    this.setStorageItem(STORAGE_KEYS.USERS, updated)
    return updated
  }

  deleteUser(id) {
    const users = this.getUsers()
    const updated = users.filter((u) => u.id !== id)
    this.setStorageItem(STORAGE_KEYS.USERS, updated)
    return true
  }

  // --- BOOKINGS ---
  getBookings() {
    return this.getStorageItem(STORAGE_KEYS.BOOKINGS, MOCK_BOOKINGS)
  }

  updateBookingStatus(id, bookingStatus, paymentStatus) {
    const bookings = this.getBookings()
    const updated = bookings.map((b) => {
      if (b.id === id) {
        return {
          ...b,
          bookingStatus: bookingStatus || b.bookingStatus,
          paymentStatus: paymentStatus || b.paymentStatus,
        }
      }
      return b
    })
    this.setStorageItem(STORAGE_KEYS.BOOKINGS, updated)
    return updated
  }

  // --- ORDERS ---
  getOrders() {
    return this.getStorageItem(STORAGE_KEYS.ORDERS, MOCK_ORDERS)
  }

  updateOrderStatus(id, status) {
    const orders = this.getOrders()
    const updated = orders.map((o) => (o.id === id ? { ...o, status } : o))
    this.setStorageItem(STORAGE_KEYS.ORDERS, updated)
    return updated
  }

  // --- PAYMENTS ---
  getPayments() {
    return this.getStorageItem(STORAGE_KEYS.PAYMENTS, MOCK_PAYMENTS)
  }

  updatePaymentStatus(id, status) {
    const payments = this.getPayments()
    const updated = payments.map((p) => (p.id === id ? { ...p, paymentStatus: status } : p))
    this.setStorageItem(STORAGE_KEYS.PAYMENTS, updated)
    return updated
  }

  // --- REVIEWS ---
  getReviews() {
    return this.getStorageItem(STORAGE_KEYS.REVIEWS, MOCK_REVIEWS)
  }

  updateReviewStatus(id, status) {
    const reviews = this.getReviews()
    const updated = reviews.map((r) => (r.id === id ? { ...r, status } : r))
    this.setStorageItem(STORAGE_KEYS.REVIEWS, updated)
    return updated
  }

  deleteReview(id) {
    const reviews = this.getReviews()
    const updated = reviews.filter((r) => r.id !== id)
    this.setStorageItem(STORAGE_KEYS.REVIEWS, updated)
    return true
  }

  // --- SETTINGS ---
  getSettings() {
    return this.getStorageItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
  }

  saveSettings(newSettings) {
    const current = this.getSettings()
    const updated = { ...current, ...newSettings }
    this.setStorageItem(STORAGE_KEYS.SETTINGS, updated)
    return updated
  }

  // --- DASHBOARD METRICS STATS ---
  getStats() {
    const products = this.getProducts()
    const users = this.getUsers()
    const bookings = this.getBookings()
    const payments = this.getPayments()

    const totalProducts = products.length
    const availableProducts = products.filter(
      (p) => p.availability === 'available' || p.availability === 'limited'
    ).length
    const totalUsers = users.length
    const activeRentals = bookings.filter(
      (b) => b.bookingStatus === 'Active' || b.bookingStatus === 'Confirmed'
    ).length
    const pendingBookings = bookings.filter((b) => b.bookingStatus === 'Pending').length
    const completedBookings = bookings.filter((b) => b.bookingStatus === 'Returned').length

    const totalRevenue = payments
      .filter((p) => p.paymentStatus === 'Paid')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0)

    const pendingPayments = payments
      .filter((p) => p.paymentStatus === 'Pending')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0)

    return {
      totalProducts,
      availableProducts,
      totalUsers,
      activeRentals,
      pendingBookings,
      completedBookings,
      totalRevenue,
      pendingPayments,
    }
  }
}

export const adminService = new AdminService()
export default adminService
