import axios from 'axios'
import { isIntentionalLogout } from '../utils/authSession'
import {
  supabaseProductService,
  supabaseCategoryService,
  supabaseUserService,
  supabaseBookingService,
  supabaseOrderService,
  supabasePaymentService,
  supabaseReviewService,
  supabaseSettingsService,
  supabaseHealth,
} from './supabaseApi'

/** Vercel has no Express process — talk to Supabase directly in production. */
export const USE_SUPABASE =
  import.meta.env.VITE_USE_SUPABASE === 'true' || Boolean(import.meta.env.PROD)

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

const getStoredToken = () => {
  const clientToken = localStorage.getItem('zahara_token')
  const adminToken = localStorage.getItem('zh_admin_token')
  const onAdminRoute =
    typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')

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

api.interceptors.request.use((config) => {
  try {
    const token = getStoredToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch {
    /* ignore */
  }
  return config
})

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
      const sessionInvalid = /token|session|log in|authentication/i.test(String(message))
      if (sessionInvalid) {
        clearStoredAuth()
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
          window.location.replace('/login?redirect=/admin/dashboard')
        }
      }
    }

    return Promise.reject(new Error(message))
  }
)

export const checkBackendHealth = async () => {
  if (USE_SUPABASE) return supabaseHealth()
  try {
    const res = await api.get('/health')
    return res.data
  } catch (err) {
    return { status: 'offline', error: err.message, database: { isConnected: false } }
  }
}

export const productService = USE_SUPABASE
  ? supabaseProductService
  : {
      getAll:    async (params = {}) => (await api.get('/products', { params })).data,
      getById:   async (id)         => (await api.get(`/products/${id}`)).data,
      create:    async (data)       => (await api.post('/products', data)).data,
      update:    async (id, data)   => (await api.put(`/products/${id}`, data)).data,
      remove:    async (id)         => (await api.delete(`/products/${id}`)).data,
    }

export const categoryService = USE_SUPABASE
  ? supabaseCategoryService
  : {
      getAll:  async ()         => (await api.get('/categories')).data,
      create:  async (data)     => (await api.post('/categories', data)).data,
      update:  async (id, data) => (await api.put(`/categories/${id}`, data)).data,
      remove:  async (id)       => (await api.delete(`/categories/${id}`)).data,
    }

export const userService = USE_SUPABASE
  ? supabaseUserService
  : {
      getAll:        async ()           => (await api.get('/users')).data,
      getById:       async (id)         => (await api.get(`/users/${id}`)).data,
      updateProfile: async (id, data)   => (await api.put(`/users/${id}`, data)).data,
      updateStatus:  async (id, status) => (await api.put(`/users/${id}/status`, { status })).data,
      remove:        async (id)         => (await api.delete(`/users/${id}`)).data,
    }

export const bookingService = USE_SUPABASE
  ? supabaseBookingService
  : {
      getAll:        async (params = {})               => (await api.get('/bookings', { params })).data,
      getById:       async (id)                        => (await api.get(`/bookings/${id}`)).data,
      create:        async (data)                      => (await api.post('/bookings', data)).data,
      updateStatus:  async (id, status, paymentStatus) => (await api.put(`/bookings/${id}/status`, { status, paymentStatus })).data,
    }

export const orderService = USE_SUPABASE
  ? supabaseOrderService
  : {
      getAll:       async ()           => (await api.get('/orders')).data,
      updateStatus: async (id, status) => (await api.put(`/orders/${id}/status`, { status })).data,
    }

export const paymentService = USE_SUPABASE
  ? supabasePaymentService
  : {
      getAll:       async ()           => (await api.get('/payments')).data,
      updateStatus: async (id, status) => (await api.put(`/payments/${id}/status`, { paymentStatus: status })).data,
    }

export const reviewService = USE_SUPABASE
  ? supabaseReviewService
  : {
      getAll:       async ()           => (await api.get('/reviews')).data,
      create:       async (data)       => (await api.post('/reviews', data)).data,
      updateStatus: async (id, status) => (await api.put(`/reviews/${id}/status`, { status })).data,
      remove:       async (id)         => (await api.delete(`/reviews/${id}`)).data,
    }

export const settingsService = USE_SUPABASE
  ? supabaseSettingsService
  : {
      get:  async ()     => (await api.get('/settings')).data,
      save: async (data) => (await api.put('/settings', data)).data,
    }

/** Login/register always hit /api/auth so Vercel serverless + local Express both work. */
export const authService = {
  login:    async (email, password) => (await api.post('/auth/login', { email, password })).data,
  register: async (data)            => (await api.post('/auth/register', data)).data,
}

export const newsletterService = {
  subscribe: async (email) => {
    await new Promise((r) => setTimeout(r, 400))
    if (!email) throw new Error('Email is required.')
    return { success: true }
  },
}

export default api
