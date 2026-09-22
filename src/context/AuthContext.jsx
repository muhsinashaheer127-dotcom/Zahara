import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { STORAGE_KEYS } from '../utils/helpers'

const DEFAULT_DEMO_USER = {
  id: 'usr_demo_101',
  name: 'Princess Diana',
  email: 'demo@zahara.com',
  password: 'password123',
  phone: '+91 98765 43210',
  address: '10 Royal Avenue, Jubilee Hills, Hyderabad',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  memberSince: 'January 2025',
  totalRentals: 4,
  activeRentals: 1,
  role: 'user',
}

const DEFAULT_ADMIN_USER = {
  id: 'admin_root',
  name: 'Zahara Administrator',
  email: 'zahararental@gmail.com',
  password: '1234567890',
  phone: '+91 98765 43210',
  address: '10 Royal Avenue, Jubilee Hills, Hyderabad',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  memberSince: 'January 2025',
  totalRentals: 0,
  activeRentals: 0,
  role: 'admin',
}

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize users database & session from localStorage
  useEffect(() => {
    try {
      // Pre-seed mock users DB if missing
      const existingUsersStr = localStorage.getItem(STORAGE_KEYS.USERS)
      let usersDB = existingUsersStr ? JSON.parse(existingUsersStr) : []
      if (!usersDB.some((u) => u.email === DEFAULT_DEMO_USER.email)) {
        usersDB.push(DEFAULT_DEMO_USER)
      }
      if (!usersDB.some((u) => u.email.toLowerCase() === DEFAULT_ADMIN_USER.email.toLowerCase())) {
        usersDB.push(DEFAULT_ADMIN_USER)
      }
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usersDB))

      // Check stored session token & user
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN)
      const storedUserStr = localStorage.getItem(STORAGE_KEYS.USER)

      if (storedToken && storedUserStr) {
        setToken(storedToken)
        setUser(JSON.parse(storedUserStr))
      }
    } catch (err) {
      console.error('Failed to initialize AuthContext session:', err)
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
    } finally {
      setLoading(false)
    }
  }, [])

  // Synchronize helper for user object updates in mock DB
  const saveUserToDBAndState = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser))

    try {
      const existingUsersStr = localStorage.getItem(STORAGE_KEYS.USERS)
      let usersDB = existingUsersStr ? JSON.parse(existingUsersStr) : []
      const index = usersDB.findIndex((u) => u.email.toLowerCase() === updatedUser.email.toLowerCase())
      if (index !== -1) {
        usersDB[index] = { ...usersDB[index], ...updatedUser }
      } else {
        usersDB.push(updatedUser)
      }
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usersDB))
    } catch (err) {
      console.error('Failed to update users DB:', err)
    }
  }

  // LOGIN
  const login = useCallback(async (email, password) => {
    setLoading(true)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const usersStr = localStorage.getItem(STORAGE_KEYS.USERS)
          const usersDB = usersStr ? JSON.parse(usersStr) : [DEFAULT_DEMO_USER]
          const foundUser = usersDB.find(
            (u) => u.email.toLowerCase() === email.trim().toLowerCase()
          )

          if (!foundUser) {
            setLoading(false)
            reject(new Error('No account found with this email address.'))
            return
          }

          if (foundUser.password && foundUser.password !== password) {
            setLoading(false)
            reject(new Error('Incorrect password. Please try again.'))
            return
          }

          const mockToken = `zh_jwt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          localStorage.setItem(STORAGE_KEYS.TOKEN, mockToken)
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(foundUser))

          setToken(mockToken)
          setUser(foundUser)
          setLoading(false)
          resolve(foundUser)
        } catch (error) {
          setLoading(false)
          reject(error)
        }
      }, 600)
    })
  }, [])

  // REGISTER
  const register = useCallback(async (userData) => {
    setLoading(true)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const usersStr = localStorage.getItem(STORAGE_KEYS.USERS)
          const usersDB = usersStr ? JSON.parse(usersStr) : [DEFAULT_DEMO_USER]

          const exists = usersDB.some(
            (u) => u.email.toLowerCase() === userData.email.trim().toLowerCase()
          )

          if (exists) {
            setLoading(false)
            reject(new Error('An account with this email address already exists.'))
            return
          }

          const newUser = {
            id: `usr_${Date.now()}`,
            name: userData.name,
            email: userData.email.trim(),
            password: userData.password,
            phone: userData.phone || '',
            address: userData.address || '',
            avatar: userData.avatar || '',
            memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            totalRentals: 0,
            activeRentals: 0,
            role: 'user',
          }

          usersDB.push(newUser)
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usersDB))

          const mockToken = `zh_jwt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          localStorage.setItem(STORAGE_KEYS.TOKEN, mockToken)
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser))

          setToken(mockToken)
          setUser(newUser)
          setLoading(false)
          resolve(newUser)
        } catch (error) {
          setLoading(false)
          reject(error)
        }
      }, 600)
    })
  }, [])

  // LOGOUT
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
  }, [])

  // UPDATE PROFILE
  const updateProfile = useCallback((updates) => {
    setUser((prevUser) => {
      if (!prevUser) return null
      const updated = { ...prevUser, ...updates }
      saveUserToDBAndState(updated)
      return updated
    })
    toast.success('Profile updated successfully!')
  }, [])

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

