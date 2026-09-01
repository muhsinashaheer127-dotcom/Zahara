import { useAdminAuthContext } from '../context/AdminAuthContext'

export const useAdminAuth = () => {
  return useAdminAuthContext()
}

export default useAdminAuth
