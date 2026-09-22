import axios from 'axios'
import { isIntentionalLogout } from '../utils/authSession'

/** Axios instance — proxied to http://localhost:5000 via vite */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

const getStoredToken = () => {
  const clientToken = localStorage.getItem('zahara_token')
  const adminToken = localStorage.getItem('zh_admin_token')
  const onAdminRoute =
    typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')

  // Prefer admin token in the admin portal (stale customer tokens must not override)
  if (onAdminRoute) {
    return adminToken || clientToken
  }
  return clientToken || adminToken
}

const clearStoredAuth = () => {
  localStorage.removeItem('zahara_token')
  localStorage.removeItem('zahara_user')
  localStorage.removeItem('zh_admin_token')
  localStorage.removeItem('zh_admin_user')
}

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  try {
    const token = getStoredToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch {
    /* ignore parse error */
  }
  return config
})

// Response error handler: extract readable message; clear expired/invalid sessions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected network error occurred.'
    const url = error.config?.url || ''
    const isAuthAttempt = url.includes('/auth/login') || url.includes('/auth/register')

    if (status === 401 && !isAuthAttempt && !isIntentionalLogout()) {
      const sessionInvalid =
        /token|session|log in|authentication/i.test(String(message))
      if (sessionInvalid) {
        clearStoredAuth()
        if (
          typeof window !== 'undefined' &&
          window.location.pathname.startsWith('/admin')
        ) {
          window.location.replace('/login?redirect=/admin/dashboard')
        }
      }
    }

    return Promise.reject(new Error(message))
  }
)

/** Check health and MongoDB connection status */
export const checkBackendHealth = async () => {
  try {
    const res = await api.get('/health')
    return res.data
  } catch (err) {
    return { status: 'offline', error: err.message, database: { isConnected: false } }
  }
}

/** Products */
export const productService = {
  getAll:    async (params = {}) => (await api.get('/products', { params })).data,
  getById:   async (id)         => (await api.get(`/products/${id}`)).data,
  create:    async (data)       => (await api.post('/products', data)).data,
  update:    async (id, data)   => (await api.put(`/products/${id}`, data)).data,
  remove:    async (id)         => (await api.delete(`/products/${id}`)).data,
}

/** Categories */
export const categoryService = {
  getAll:  async ()         => (await api.get('/categories')).data,
  create:  async (data)     => (await api.post('/categories', data)).data,
  update:  async (id, data) => (await api.put(`/categories/${id}`, data)).data,
  remove:  async (id)       => (await api.delete(`/categories/${id}`)).data,
}

/** Users */
export const userService = {
  getAll:        async ()           => (await api.get('/users')).data,
  getById:       async (id)         => (await api.get(`/users/${id}`)).data,
  updateProfile: async (id, data)   => (await api.put(`/users/${id}`, data)).data,
  updateStatus:  async (id, status) => (await api.put(`/users/${id}/status`, { status })).data,
  remove:        async (id)         => (await api.delete(`/users/${id}`)).data,
}

/** Bookings */
export const bookingService = {
  getAll:        async (params = {})                => (await api.get('/bookings', { params })).data,
  getById:       async (id)                         => (await api.get(`/bookings/${id}`)).data,
  create:        async (data)                       => (await api.post('/bookings', data)).data,
  updateStatus:  async (id, status, paymentStatus)  => (await api.put(`/bookings/${id}/status`, { status, paymentStatus })).data,
}

/** Orders */
export const orderService = {
  getAll:       async ()           => (await api.get('/orders')).data,
  updateStatus: async (id, status) => (await api.put(`/orders/${id}/status`, { status })).data,
}

/** Payments */
export const paymentService = {
  getAll:       async ()           => (await api.get('/payments')).data,
  updateStatus: async (id, status) => (await api.put(`/payments/${id}/status`, { paymentStatus: status })).data,
}

/** Reviews */
export const reviewService = {
  getAll:       async ()           => (await api.get('/reviews')).data,
  create:       async (data)       => (await api.post('/reviews', data)).data,
  updateStatus: async (id, status) => (await api.put(`/reviews/${id}/status`, { status })).data,
  remove:       async (id)         => (await api.delete(`/reviews/${id}`)).data,
}

/** Settings */
export const settingsService = {
  get:  async ()       => (await api.get('/settings')).data,
  save: async (data)   => (await api.put('/settings', data)).data,
}

/** Auth */
export const authService = {
  login:    async (email, password) => (await api.post('/auth/login', { email, password })).data,
  register: async (data)            => (await api.post('/auth/register', data)).data,
}

/** Newsletter */
export const newsletterService = {
  subscribe: async (email) => {
    await new Promise((r) => setTimeout(r, 400))
    if (!email) throw new Error('Email is required.')
    return { success: true }
  },
}

export default api
