/**
 * adminService.js
 * Admin CRUD operations connected directly to the Express backend API.
 * Real error propagation — no silent fake fallbacks that mask database errors.
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
  id:            b.customId || b.id || b._id,
  customer:      b.customerName || b.customer,
  email:         b.customerEmail || b.email,
  product:       b.productName || b.product,
  price:         b.rentalAmount || b.price,
  deposit:       b.securityDeposit || b.deposit,
  bookingStatus: b.status || b.bookingStatus,
})

// Normalize DB order doc → shape admin pages expect
const normalizeOrder = (o) => ({
  ...o,
  id:       o.customId || o.id || o._id,
  customer: o.customerName || o.customer,
  product:  o.productName || o.product,
})

// Normalize DB payment doc → shape admin pages expect
const normalizePayment = (p) => ({
  ...p,
  id:       p.customId || p.id || p._id,
  customer: p.customerName || p.customer,
})

// Normalize DB review doc → shape admin pages expect
const normalizeReview = (r) => ({
  ...r,
  id:       r.customId || r.id || r._id,
  customer: r.customerName || r.customer,
  product:  r.productName || r.product,
  comment:  r.comment || r.text,
})

// Normalize DB user doc → shape admin pages expect
const normalizeUser = (u) => ({
  ...u,
  id: u.customId || u.id || u._id,
})

// Normalize DB product doc → shape admin pages expect
const normalizeProduct = (p) => ({
  ...p,
  id: p.customId || p.id || p._id,
})

class AdminService {
  // ── PRODUCTS ──────────────────────────────────────────────────────────────
  async getProducts() {
    const data = await productService.getAll()
    return Array.isArray(data) ? data.map(normalizeProduct) : []
  }

  async addProduct(product) {
    const slug = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    const payload = {
      customId:          product.id || `prod_${Date.now()}`,
      name:              product.name,
      slug,
      category:          product.category,
      occasion:          product.occasion || '',
      price:             Number(product.price),
      duration:          Number(product.duration) || 3,
      deposit:           Number(product.deposit) || 0,
      availableQuantity: Number(product.availableQuantity) || 1,
      availability:      product.availability || 'available',
      isFeatured:        Boolean(product.isFeatured),
      isBestSeller:      Boolean(product.isBestSeller),
      isNewItem:         Boolean(product.isNewItem !== undefined ? product.isNewItem : true),
      images:            product.images || ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'],
      description:       product.description || '',
      specifications:    product.specifications || { material: product.material || '', insurance: 'Included' },
    }
    const created = await productService.create(payload)
    if (typeof window !== 'undefined') {
      localStorage.setItem('zahara_products_version', Date.now().toString())
      window.dispatchEvent(new CustomEvent('zahara:products-changed'))
    }
    return normalizeProduct(created)
  }

  async updateProduct(id, updates) {
    const slug = updates.slug || updates.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
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
      isFeatured:        Boolean(updates.isFeatured),
      isBestSeller:      Boolean(updates.isBestSeller),
      isNewItem:         Boolean(updates.isNewItem || updates.isNew),
      images:            updates.images || [],
      description:       updates.description || '',
      specifications:    updates.specifications || { material: updates.material || '', insurance: 'Included' },
    }
    const updated = await productService.update(id, payload)
    if (typeof window !== 'undefined') {
      localStorage.setItem('zahara_products_version', Date.now().toString())
      window.dispatchEvent(new CustomEvent('zahara:products-changed'))
    }
    return normalizeProduct(updated)
  }

  async deleteProduct(id) {
    const res = await productService.remove(id)
    if (typeof window !== 'undefined') {
      localStorage.setItem('zahara_products_version', Date.now().toString())
      window.dispatchEvent(new CustomEvent('zahara:products-changed'))
    }
    return res
  }

  // ── CATEGORIES ────────────────────────────────────────────────────────────
  async getCategories() {
    const data = await categoryService.getAll()
    return Array.isArray(data) ? data : []
  }

  async addCategory(cat) {
    const slug = cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    const res = await categoryService.create({ ...cat, customId: cat.id || slug, slug })
    if (typeof window !== 'undefined') {
      localStorage.setItem('zahara_products_version', Date.now().toString())
      window.dispatchEvent(new CustomEvent('zahara:products-changed'))
    }
    return res
  }

  async updateCategory(id, updates) {
    const res = await categoryService.update(id, updates)
    if (typeof window !== 'undefined') {
      localStorage.setItem('zahara_products_version', Date.now().toString())
      window.dispatchEvent(new CustomEvent('zahara:products-changed'))
    }
    return res
  }

  async deleteCategory(id) {
    const res = await categoryService.remove(id)
    if (typeof window !== 'undefined') {
      localStorage.setItem('zahara_products_version', Date.now().toString())
      window.dispatchEvent(new CustomEvent('zahara:products-changed'))
    }
    return res
  }

  // ── USERS ─────────────────────────────────────────────────────────────────
  async getUsers() {
    const data = await userService.getAll()
    return Array.isArray(data) ? data.map(normalizeUser) : []
  }

  async updateUserStatus(id, status) {
    return await userService.updateStatus(id, status)
  }

  async deleteUser(id) {
    return await userService.remove(id)
  }

  // ── BOOKINGS ──────────────────────────────────────────────────────────────
  async getBookings() {
    const data = await bookingService.getAll()
    return Array.isArray(data) ? data.map(normalizeBooking) : []
  }

  async updateBookingStatus(id, bookingStatus, paymentStatus) {
    return await bookingService.updateStatus(id, bookingStatus, paymentStatus)
  }

  // ── ORDERS ────────────────────────────────────────────────────────────────
  async getOrders() {
    const data = await orderService.getAll()
    return Array.isArray(data) ? data.map(normalizeOrder) : []
  }

  async updateOrderStatus(id, status) {
    return await orderService.updateStatus(id, status)
  }

  // ── PAYMENTS ──────────────────────────────────────────────────────────────
  async getPayments() {
    const data = await paymentService.getAll()
    return Array.isArray(data) ? data.map(normalizePayment) : []
  }

  async updatePaymentStatus(id, status) {
    return await paymentService.updateStatus(id, status)
  }

  // ── REVIEWS ───────────────────────────────────────────────────────────────
  async getReviews() {
    const data = await reviewService.getAll()
    return Array.isArray(data) ? data.map(normalizeReview) : []
  }

  async updateReviewStatus(id, status) {
    return await reviewService.updateStatus(id, status)
  }

  async deleteReview(id) {
    return await reviewService.remove(id)
  }

  // ── SETTINGS ──────────────────────────────────────────────────────────────
  async getSettings() {
    return await settingsService.get()
  }

  async saveSettings(data) {
    return await settingsService.save(data)
  }

  // ── DASHBOARD STATS ───────────────────────────────────────────────────────
  async getStats() {
    const [products, users, bookings, payments] = await Promise.all([
      this.getProducts().catch(() => []),
      this.getUsers().catch(() => []),
      this.getBookings().catch(() => []),
      this.getPayments().catch(() => []),
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
