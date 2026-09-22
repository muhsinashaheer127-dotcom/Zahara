import { Navigate, Outlet } from 'react-router-dom'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import { isIntentionalLogout } from '../../utils/authSession'

const ProtectedAdminRoute = ({ children }) => {
  const { isAdminAuthenticated, loading } = useAdminAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-gold">
        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase tracking-[0.2em] font-medium text-gold/80">
          Authenticating Zahara Admin...
        </p>
      </div>
    )
  }

  if (!isAdminAuthenticated) {
    const loginPath = isIntentionalLogout()
      ? '/login'
      : '/login?redirect=/admin/dashboard'
    return <Navigate to={loginPath} replace />
  }

  return children ? children : <Outlet />
}

export default ProtectedAdminRoute
