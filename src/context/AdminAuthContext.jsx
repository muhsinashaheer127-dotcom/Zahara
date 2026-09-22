import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { authService } from '../services/api'

const ADMIN_STORAGE_KEYS = {
  TOKEN: 'zh_admin_token',
  USER: 'zh_admin_user',
}

const AdminAuthContext = createContext(null)

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null)
  const [adminToken, setAdminToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load existing admin session from localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(ADMIN_STORAGE_KEYS.TOKEN)
      const storedUserStr = localStorage.getItem(ADMIN_STORAGE_KEYS.USER)

      if (storedToken && storedUserStr) {
        const parsed = JSON.parse(storedUserStr)
        if (parsed.role === 'admin') {
          setAdminToken(storedToken)
          setAdminUser(parsed)
          // Keep customer storage in sync so API calls use a valid admin JWT
          localStorage.setItem('zahara_token', storedToken)
          localStorage.setItem('zahara_user', storedUserStr)
        } else {
          localStorage.removeItem(ADMIN_STORAGE_KEYS.TOKEN)
          localStorage.removeItem(ADMIN_STORAGE_KEYS.USER)
        }
      }
    } catch (err) {
      console.error('Failed to initialize AdminAuthContext session:', err)
      localStorage.removeItem(ADMIN_STORAGE_KEYS.TOKEN)
      localStorage.removeItem(ADMIN_STORAGE_KEYS.USER)
    } finally {
      setLoading(false)
    }
  }, [])

  // ADMIN LOGIN (Real Backend Call)
  const adminLogin = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const cleanEmail = email ? email.trim() : ''
      const response = await authService.login(cleanEmail, password)

      if (!response.success || !response.token) {
        throw new Error(response.message || 'Login failed')
      }

      const { token, user } = response

      if (user.role !== 'admin') {
        throw new Error('Access denied. Administrator privileges required.')
      }

      localStorage.setItem(ADMIN_STORAGE_KEYS.TOKEN, token)
      localStorage.setItem(ADMIN_STORAGE_KEYS.USER, JSON.stringify(user))

      // Also set client token so customer endpoints succeed when admin tests customer pages
      localStorage.setItem('zahara_token', token)
      localStorage.setItem('zahara_user', JSON.stringify(user))

      setAdminToken(token)
      setAdminUser(user)
      return user
    } catch (err) {
      console.error('[AdminAuth] Login error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ADMIN LOGOUT
  const adminLogout = useCallback(({ silent = false } = {}) => {
    localStorage.removeItem(ADMIN_STORAGE_KEYS.TOKEN)
    localStorage.removeItem(ADMIN_STORAGE_KEYS.USER)
    localStorage.removeItem('zahara_token')
    localStorage.removeItem('zahara_user')
    setAdminToken(null)
    setAdminUser(null)
    if (!silent) {
      toast.success('Admin logged out successfully')
    }
  }, [])

  const value = {
    adminUser,
    adminToken,
    isAdminAuthenticated: Boolean(adminUser && adminToken),
    loading,
    adminLogin,
    adminLogout,
  }

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export const useAdminAuthContext = () => {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuthContext must be used within an AdminAuthProvider')
  }
  return context
}

export default AdminAuthContext
