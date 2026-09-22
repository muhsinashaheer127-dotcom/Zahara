import { Navigate } from 'react-router-dom'

const AdminLogin = () => {
  return <Navigate to="/login?redirect=/admin/dashboard" replace />
}

export default AdminLogin
