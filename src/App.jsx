import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Layout from './components/Layout/Layout'
import ScrollToTop from './components/ScrollToTop'

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
import AdminLayout, { AdminDashboard, AdminProducts, AdminPlaceholder } from './pages/Admin/Admin'

import ProtectedRoute from './components/ProtectedRoute'

const AnimatedRoutes = () => {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const isAuthPage = [
    '/login',
    '/register',
    '/forgot-password',
    '/otp-verification',
    '/reset-password',
  ].includes(location.pathname)

  if (isAdmin) {
    return (
      <Routes location={location}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminPlaceholder title="Categories" />} />
          <Route path="bookings" element={<AdminPlaceholder title="Bookings" />} />
          <Route path="customers" element={<AdminPlaceholder title="Customers" />} />
          <Route path="payments" element={<AdminPlaceholder title="Payments" />} />
          <Route path="reviews" element={<AdminPlaceholder title="Reviews" />} />
          <Route path="settings" element={<AdminPlaceholder title="Settings" />} />
        </Route>
      </Routes>
    )
  }

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
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}

const App = () => (
  <AuthProvider>
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
  </AuthProvider>
)

export default App