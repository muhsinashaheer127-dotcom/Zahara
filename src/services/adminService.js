/**
 * adminService.js
 * All admin CRUD operations go through the real backend API.
 * No localStorage. No mock data.
 */
import {
  productService,
  categoryService,
  userService,
  bookingService,
  orderService,
  paymentService,
  reviewService,
  settingsService,
} from './api'

// Normalize DB booking doc → shape admin pages expect
const normalizeBooking = (b) => ({
  ...b,
  id:            b.customId || b._id,
  customer:      b.customerName,
  email:         b.customerEmail,
  product:       b.productName,
  price:         b.rentalAmount,
  deposit:       b.securityDeposit,
  bookingStatus: b.status,
})

// Normalize DB order doc → shape admin pages expect
const normalizeOrder = (o) => ({
  ...o,
  id:       o.customId || o._id,
  customer: o.customerName,
  product:  o.productName,
})

// Normalize DB payment doc → shape admin pages expect
const normalizePayment = (p) => ({
  ...p,
  id:       p.customId || p._id,
  customer: p.customerName,
})

// Normalize DB review doc → shape admin pages expect
const normalizeReview = (r) => ({
  ...r,
  id:       r.customId || r._id,
  customer: r.customerName,
  product:  r.productName,
  comment:  r.comment,
})

// Normalize DB user doc → shape admin pages expect
const normalizeUser = (u) => ({
  ...u,
  id: u.customId || u._id,
})

// Normalize DB product doc → shape admin pages expect
const normalizeProduct = (p) => ({
  ...p,
  id: p.customId || p._id,
})

class AdminService {
  // ── PRODUCTS ──────────────────────────────────────────────────────────────
  async getProducts() {
    const data = await productService.getAll()
    return data.map(normalizeProduct)
  }

  async addProduct(product) {
    const slug = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const payload = {
      customId:          product.id || `prod_${Date.now()}`,
      name:              product.name,
      slug,
      category:          product.category,
      occasion:          product.occasion || '',
      price:             Number(product.price),
      duration:          Number(product.duration) || 3,
      deposit:           Number(product.deposit),
      availableQuantity: Number(product.availableQuantity) || 1,
      availability:      product.availability || 'available',
      isFeatured:        product.isFeatured || false,
      images:            product.images || ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'],
      description:       product.description || '',
      specifications:    product.specifications || { material: product.material || '', insurance: 'Included' },
    }
    return normalizeProduct(await productService.create(payload))
  }

  async updateProduct(id, updates) {
    const slug = updates.slug || updates.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const payload = {
      name:              updates.name,
      slug,
      category:          updates.category,
      occasion:          updates.occasion,
      price:             Number(updates.price),
      duration:          Number(updates.duration) || 3,
      deposit:           Number(updates.deposit),
      availableQuantity: Number(updates.availableQuantity),
      availability:      updates.availability,
      isFeatured:        updates.isFeatured,
      images:            updates.images || [],
      description:       updates.description || '',
      specifications:    updates.specifications || { material: updates.material || '', insurance: 'Included' },
    }
    return normalizeProduct(await productService.update(id, payload))
  }

  async deleteProduct(id) {
    return productService.remove(id)
  }

  // ── CATEGORIES ────────────────────────────────────────────────────────────
  async getCategories() {
    return categoryService.getAll()
  }

  async addCategory(cat) {
    const slug = cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    return categoryService.create({ ...cat, customId: cat.id || slug, slug })
  }

  async updateCategory(id, updates) {
    return categoryService.update(id, updates)
  }

  async deleteCategory(id) {
    return categoryService.remove(id)
  }

  // ── USERS ─────────────────────────────────────────────────────────────────
  async getUsers() {
    const data = await userService.getAll()
    return data.map(normalizeUser)
  }

  async updateUserStatus(id, status) {
    return userService.updateStatus(id, status)
  }

  async deleteUser(id) {
    return userService.remove(id)
  }

  // ── BOOKINGS ──────────────────────────────────────────────────────────────
  async getBookings() {
    const data = await bookingService.getAll()
    return data.map(normalizeBooking)
  }

  async updateBookingStatus(id, bookingStatus, paymentStatus) {
    return bookingService.updateStatus(id, bookingStatus, paymentStatus)
  }

  // ── ORDERS ────────────────────────────────────────────────────────────────
  async getOrders() {
    const data = await orderService.getAll()
    return data.map(normalizeOrder)
  }

  async updateOrderStatus(id, status) {
    return orderService.updateStatus(id, status)
  }

  // ── PAYMENTS ──────────────────────────────────────────────────────────────
  async getPayments() {
    const data = await paymentService.getAll()
    return data.map(normalizePayment)
  }

  async updatePaymentStatus(id, status) {
    return paymentService.updateStatus(id, status)
  }

  // ── REVIEWS ───────────────────────────────────────────────────────────────
  async getReviews() {
    const data = await reviewService.getAll()
    return data.map(normalizeReview)
  }

  async updateReviewStatus(id, status) {
    return reviewService.updateStatus(id, status)
  }

  async deleteReview(id) {
    return reviewService.remove(id)
  }

  // ── SETTINGS ──────────────────────────────────────────────────────────────
  async getSettings() {
    return settingsService.get()
  }

  async saveSettings(data) {
    return settingsService.save(data)
  }

  // ── DASHBOARD STATS (computed from live DB data) ───────────────────────
  async getStats() {
    const [products, users, bookings, payments] = await Promise.all([
      productService.getAll(),
      userService.getAll(),
      bookingService.getAll(),
      paymentService.getAll(),
    ])

    const totalProducts     = products.length
    const availableProducts = products.filter((p) => p.availability === 'available' || p.availability === 'limited').length
    const totalUsers        = users.length
    const activeRentals     = bookings.filter((b) => b.status === 'Active' || b.status === 'Confirmed').length
    const pendingBookings   = bookings.filter((b) => b.status === 'Pending').length
    const completedBookings = bookings.filter((b) => b.status === 'Returned').length
    const totalRevenue      = payments.filter((p) => p.paymentStatus === 'Paid').reduce((sum, p) => sum + Number(p.amount || 0), 0)
    const pendingPayments   = payments.filter((p) => p.paymentStatus === 'Pending').reduce((sum, p) => sum + Number(p.amount || 0), 0)

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
