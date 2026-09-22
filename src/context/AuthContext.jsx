import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { STORAGE_KEYS } from '../utils/helpers'
import { authService, userService } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize session from localStorage on startup
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN)
      const storedUserStr = localStorage.getItem(STORAGE_KEYS.USER)

      if (storedToken && storedUserStr) {
        const parsedUser = JSON.parse(storedUserStr)
        setToken(storedToken)
        setUser(parsedUser)
      }
    } catch (err) {
      console.error('Failed to initialize session from storage:', err)
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
    } finally {
      setLoading(false)
    }
  }, [])

  // LOGIN (Real Backend Call)
  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const response = await authService.login(email.trim(), password)
      if (!response.success || !response.token) {
        throw new Error(response.message || 'Login failed')
      }

      const { token: receivedToken, user: receivedUser } = response

      localStorage.setItem(STORAGE_KEYS.TOKEN, receivedToken)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(receivedUser))

      // If user is admin, also sync admin token for seamless admin panel access
      if (receivedUser.role === 'admin') {
        localStorage.setItem('zh_admin_token', receivedToken)
        localStorage.setItem('zh_admin_user', JSON.stringify(receivedUser))
      }

      setToken(receivedToken)
      setUser(receivedUser)
      return receivedUser
    } catch (error) {
      console.error('[AuthContext] Login error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  // REGISTER (Real Backend Call)
  const register = useCallback(async (userData) => {
    setLoading(true)
    try {
      const response = await authService.register(userData)
      if (!response.success || !response.token) {
        throw new Error(response.message || 'Registration failed')
      }

      const { token: receivedToken, user: receivedUser } = response

      localStorage.setItem(STORAGE_KEYS.TOKEN, receivedToken)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(receivedUser))

      setToken(receivedToken)
      setUser(receivedUser)
      return receivedUser
    } catch (error) {
      console.error('[AuthContext] Register error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  // LOGOUT
  const logout = useCallback(({ silent = false } = {}) => {
    const hadSession = Boolean(
      user || token || localStorage.getItem(STORAGE_KEYS.TOKEN)
    )
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem('zh_admin_token')
    localStorage.removeItem('zh_admin_user')
    setToken(null)
    setUser(null)
    if (!silent && hadSession) {
      toast.success('Logged out successfully')
    }
  }, [user, token])

  // UPDATE PROFILE (Real Backend Call)
  const updateProfile = useCallback(async (updates) => {
    if (!user) return
    const userId = user.customId || user.id || user._id
    try {
      const response = await userService.updateProfile(userId, updates)
      const updatedUser = response?.user || { ...user, ...updates }

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser))
      setUser(updatedUser)
      toast.success('Profile updated successfully!')
      return updatedUser
    } catch (err) {
      console.error('[AuthContext] Update profile error:', err)
      toast.error(err.message || 'Failed to update profile.')
      throw err
    }
  }, [user])

  const value = {
    user,
    currentUser: user,
    token,
    isAuthenticated: Boolean(user && token),
    isAdmin: user?.role === 'admin',
    loading,
    login,
    register,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export default AuthContext
