import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { CartProvider } from './context/CartContext'
import { ProductProvider } from './context/ProductContext'
import Layout from './components/Layout/Layout'
import ScrollToTop from './components/ScrollToTop'

// Customer Pages
import Home from './pages/Home/Home'
import Collections from './pages/Collections/Collections'
import ProductDetails from './pages/ProductDetails/ProductDetails'
import Wishlist from './pages/Wishlist/Wishlist'
import Cart from './pages/Cart/Cart'
import Checkout from './pages/Checkout/Checkout'
import BookingSuccess from './pages/Checkout/BookingSuccess'
import Bookings from './pages/Bookings/Bookings'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import ForgotPassword from './pages/ForgotPassword'
import OTPVerification from './pages/OTPVerification'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile/Profile'
import About from './pages/About/About'
import Contact from './pages/Contact/Contact'
import FAQPage from './pages/FAQ/FAQPage'
import Terms from './pages/Terms/Terms'
import Privacy from './pages/Privacy/Privacy'

// Admin Components & Pages
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminUsers from './pages/admin/AdminUsers'
import AdminBookings from './pages/admin/AdminBookings'
import AdminOrders from './pages/admin/AdminOrders'
import AdminPayments from './pages/admin/AdminPayments'
import AdminCategories from './pages/admin/AdminCategories'
import AdminReviews from './pages/admin/AdminReviews'
import AdminSettings from './pages/admin/AdminSettings'

import ProtectedRoute from './components/ProtectedRoute'

const AnimatedRoutes = () => {
  const location = useLocation()

  const isAdminPath = location.pathname.startsWith('/admin')
  const isAdminLoginPath = location.pathname === '/zahara-admin-login'

  const isAuthPage = [
    '/login',
    '/register',
    '/forgot-password',
    '/otp-verification',
    '/reset-password',
  ].includes(location.pathname)

  // Redirect legacy /zahara-admin-login to unified /login
  if (isAdminLoginPath) {
    return <Navigate to="/login?redirect=/admin/dashboard" replace />
  }

  // 2. Protected Admin Portal Routes
  if (isAdminPath) {
    return (
      <Routes location={location}>
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
      </Routes>
    )
  }

  // 3. Customer Authentication Pages (No customer Layout)
  if (isAuthPage) {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </AnimatePresence>
    )
  }

  // 4. Customer Main Website Pages
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}

const App = () => (
  <AdminAuthProvider>
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <AnimatedRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#111111',
                  color: '#fff',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  borderRadius: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '13px',
                },
                success: { iconTheme: { primary: '#D4AF37', secondary: '#000' } },
              }}
            />
          </BrowserRouter>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  </AdminAuthProvider>
)

export default App