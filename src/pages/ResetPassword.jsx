import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'

import AuthLayout from '../components/auth/AuthLayout'
import AuthHeader from '../components/auth/AuthHeader'
import PasswordField from '../components/auth/PasswordField'
import Button from '../components/auth/Button'
import FeatureSection from '../components/auth/FeatureSection'
import SEO from '../components/SEO'

const schema = yup.object({
  password: yup
    .string()
    .min(4, 'Password must be at least 4 characters')
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your new password'),
}).required()

const ResetPassword = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      toast.success('Your password has been reset successfully. Please sign in.', { icon: '🔒' })
      navigate('/login')
    } catch (err) {
      toast.error('Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout badgeText="Security Update">
      <SEO title="Reset Password | Zahara Luxury Rentals" description="Create a new password for your account." />

      <AuthHeader
        title="CREATE NEW PASSWORD"
        subtitle="Secure Credentials"
        description="Choose a new password to secure your Zahara account."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <PasswordField
          label="New Password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <PasswordField
          label="Confirm New Password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" variant="black" loading={loading} className="w-full mt-4">
          Save New Password
        </Button>
      </form>

      <FeatureSection />
    </AuthLayout>
  )
}

export default ResetPassword
