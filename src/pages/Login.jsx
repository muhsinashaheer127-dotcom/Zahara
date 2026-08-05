import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { FiMail } from 'react-icons/fi'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

import AuthLayout from '../components/auth/AuthLayout'
import AuthHeader from '../components/auth/AuthHeader'
import InputField from '../components/auth/InputField'
import PasswordField from '../components/auth/PasswordField'
import Button from '../components/auth/Button'
import SocialLogin from '../components/auth/SocialLogin'
import FeatureSection from '../components/auth/FeatureSection'
import SEO from '../components/SEO'
import { useAuth } from '../context/AuthContext'

// Yup Validation Schema
const loginSchema = yup
  .object({
    email: yup
      .string()
      .email('Please enter a valid email address')
      .required('Email address is required'),
    password: yup
      .string()
      .min(4, 'Password must be at least 4 characters')
      .required('Password is required'),
    rememberMe: yup.boolean(),
  })
  .required()

const Login = () => {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTarget = searchParams.get('redirect') || '/'

  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  // If already logged in, redirect away
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTarget, { replace: true })
    }
  }, [isAuthenticated, navigate, redirectTarget])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const user = await login(data.email, data.password)
      toast.success(`Welcome back, ${user?.name || 'Valued Client'}!`, { icon: '👑' })
      const target = user?.role === 'admin' ? '/admin' : redirectTarget
      navigate(target, { replace: true })
    } catch (err) {
      toast.error(err.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFillDemo = () => {
    setValue('email', 'demo@zahara.com', { shouldValidate: true })
    setValue('password', 'password123', { shouldValidate: true })
    toast.success('Demo credentials filled!', { icon: '✨' })
  }

  const handleSocialClick = async (provider) => {
    setLoading(true)
    toast.success(`Connecting with ${provider}...`, { icon: '✨' })
    try {
      await login('demo@zahara.com', 'password123')
      navigate(redirectTarget, { replace: true })
    } catch (err) {
      toast.error(err.message || 'Social login failed.')
    } finally {
      setLoading(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  }

  return (
    <AuthLayout>
      <SEO
        title="Sign In | ZAHARA Luxury Rentals"
        description="Sign in to your Zahara account to access exclusive luxury jewellery rentals."
      />

      {/* Top Header inside card */}
      <AuthHeader
        title="Sign In"
        subtitle="Welcome Back"
        description="Continue your luxury jewellery journey."
      />

      {/* Demo credentials helper pill */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-5 text-center"
      >
        <button
          type="button"
          onClick={handleFillDemo}
          className="text-[11px] font-medium text-[#D4AF37] hover:text-[#F3E5AB] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/35 transition-all duration-300 shadow-sm cursor-pointer"
        >
          ✨ Click to fill Demo Credentials (demo@zahara.com)
        </button>
      </motion.div>

      {/* Form with Staggered Animations */}
      <motion.form
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-0"
        noValidate
      >
        {/* Email Field */}
        <motion.div variants={itemVariants}>
          <InputField
            id="login-email"
            label="Email Address"
            type="email"
            icon={FiMail}
            placeholder="Enter your email"
            error={errors.email?.message}
            autoComplete="email"
            {...register('email')}
          />
        </motion.div>

        {/* Password Field */}
        <motion.div variants={itemVariants}>
          <PasswordField
            id="login-password"
            label="Password"
            placeholder="Enter your password"
            error={errors.password?.message}
            autoComplete="current-password"
            {...register('password')}
          />
        </motion.div>

        {/* Remember Me & Forgot Password */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between py-1 mb-6 text-xs"
        >
          <label
            className="flex items-center gap-2 text-white/70 cursor-pointer select-none hover:text-white transition-colors"
            htmlFor="remember-me-checkbox"
          >
            <input
              id="remember-me-checkbox"
              type="checkbox"
              className="w-4 h-4 rounded border-white/20 text-[#D4AF37] focus:ring-[#D4AF37]/50 accent-[#D4AF37] cursor-pointer"
              {...register('rememberMe')}
            />
            <span>Remember Me</span>
          </label>

          <Link
            to="/forgot-password"
            className="font-medium text-[#D4AF37] hover:text-[#F3E5AB] hover:underline underline-offset-2 transition-colors"
          >
            Forgot Password?
          </Link>
        </motion.div>

        {/* Login Button */}
        <motion.div variants={itemVariants}>
          <Button
            id="login-submit-btn"
            type="submit"
            variant="gold"
            loading={loading}
            className="w-full"
          >
            Login
          </Button>
        </motion.div>
      </motion.form>

      {/* Social Login Buttons (Google & Apple) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
      >
        <SocialLogin
          onGoogle={() => handleSocialClick('Google')}
          onApple={() => handleSocialClick('Apple')}
        />
      </motion.div>

      {/* Create Account Link */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="text-center text-xs text-white/50 mt-5 font-light"
      >
        Don&apos;t have an account?{' '}
        <Link
          to="/register"
          className="font-semibold text-[#D4AF37] hover:text-[#F3E5AB] underline underline-offset-4 transition-colors ml-1"
        >
          Create Account
        </Link>
      </motion.p>

      {/* Extra Trust Badges (Secure Login, Encrypted Data, Instant Access) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
      >
        <FeatureSection />
      </motion.div>
    </AuthLayout>
  )
}

export default Login
