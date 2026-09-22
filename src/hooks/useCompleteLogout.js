import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useAdminAuth } from './useAdminAuth'
import { beginIntentionalLogout } from '../utils/authSession'

/**
 * Clears admin + customer session state and navigates without redirect flicker.
 */
export const useCompleteLogout = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { adminLogout } = useAdminAuth()

  return useCallback(
    (redirectTo = '/login', { message = 'Logged out successfully' } = {}) => {
      beginIntentionalLogout()
      adminLogout({ silent: true })
      logout({ silent: true })
      if (message) {
        toast.success(message)
      }
      navigate(redirectTo, { replace: true })
    },
    [adminLogout, logout, navigate]
  )
}

export default useCompleteLogout
