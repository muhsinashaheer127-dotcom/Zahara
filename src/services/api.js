import axios from 'axios'

/** Axios instance — proxied to http://localhost:5000 via vite */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  try {
    const user = localStorage.getItem('zahara_user')
    if (user) {
      const parsed = JSON.parse(user)
      if (parsed.token) config.headers.Authorization = `Bearer ${parsed.token}`
    }
  } catch { /* ignore */ }
  return config
})

/** Check health and MongoDB connection status */
export const checkBackendHealth = async () => {
  try {
    const res = await api.get('/health')
    return res.data
  } catch (err) {
    return { status: 'offline', error: err.message }
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
  getAll:       async ()           => (await api.get('/users')).data,
  updateStatus: async (id, status) => (await api.put(`/users/${id}/status`, { status })).data,
  remove:       async (id)         => (await api.delete(`/users/${id}`)).data,
}

/** Bookings */
export const bookingService = {
  getAll:        async ()                           => (await api.get('/bookings')).data,
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

/** Newsletter (no backend endpoint yet) */
export const newsletterService = {
  subscribe: async (email) => {
    await new Promise((r) => setTimeout(r, 500))
    if (!email) throw new Error('Email required')
    return { success: true }
  },
}

export default api
