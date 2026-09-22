import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

const ADMIN_STORAGE_KEYS = {
  TOKEN: 'zh_admin_token',
  USER: 'zh_admin_user',
}

const DEV_ADMIN_CREDENTIALS = {
  email: 'zahararental@gmail.com',
  password: '1234567890',
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
        setAdminToken(storedToken)
        setAdminUser(JSON.parse(storedUserStr))
      }
    } catch (err) {
      console.error('Failed to initialize AdminAuthContext session:', err)
      localStorage.removeItem(ADMIN_STORAGE_KEYS.TOKEN)
      localStorage.removeItem(ADMIN_STORAGE_KEYS.USER)
    } finally {
      setLoading(false)
    }
  }, [])

  // ADMIN LOGIN
  const adminLogin = useCallback(async (email, password) => {
    setLoading(true)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const cleanEmail = email ? email.trim().toLowerCase() : ''
        const cleanPassword = password ? String(password).trim() : ''

        if (
          cleanEmail === DEV_ADMIN_CREDENTIALS.email.toLowerCase() &&
          cleanPassword === DEV_ADMIN_CREDENTIALS.password
        ) {
          const userObj = {
            id: 'admin_root',
            name: 'Zahara Administrator',
            email: DEV_ADMIN_CREDENTIALS.email,
            role: 'admin',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          }
          const mockToken = `zh_admin_jwt_${Date.now()}_${Math.random().toString(36).substring(2)}`

          localStorage.setItem(ADMIN_STORAGE_KEYS.TOKEN, mockToken)
          localStorage.setItem(ADMIN_STORAGE_KEYS.USER, JSON.stringify(userObj))

          setAdminToken(mockToken)
          setAdminUser(userObj)
          setLoading(false)
          resolve(userObj)
        } else {
          setLoading(false)
          reject(new Error('Invalid admin credentials'))
        }
      }, 600)
    })
  }, [])

  // ADMIN LOGOUT
  const adminLogout = useCallback(() => {
    localStorage.removeItem(ADMIN_STORAGE_KEYS.TOKEN)
    localStorage.removeItem(ADMIN_STORAGE_KEYS.USER)
    setAdminToken(null)
    setAdminUser(null)
    toast.success('Admin logged out successfully')
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
