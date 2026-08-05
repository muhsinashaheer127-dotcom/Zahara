import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import AuthLayout from '../components/auth/AuthLayout'
import AuthHeader from '../components/auth/AuthHeader'
import Button from '../components/auth/Button'
import FeatureSection from '../components/auth/FeatureSection'
import SEO from '../components/SEO'

const OTPVerification = () => {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(60)
  const [loading, setLoading] = useState(false)
  const inputRefs = useRef([])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleChange = (index, value) => {
    if (isNaN(Number(value))) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim().slice(0, 6)
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('')
      setOtp(digits)
      inputRefs.current[5]?.focus()
    }
  }

  const handleVerify = (e) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) {
      toast.error('Please enter all 6 digits of the OTP.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success('OTP verified successfully!', { icon: '✨' })
      navigate('/reset-password')
    }, 1000)
  }

  const handleResend = () => {
    if (timer > 0) return
    setOtp(['', '', '', '', '', ''])
    setTimer(60)
    toast.success('A new 6-digit OTP code has been sent to your phone/email.')
    inputRefs.current[0]?.focus()
  }

  return (
    <AuthLayout badgeText="Two-Factor Security">
      <SEO title="OTP Verification | Zahara Luxury Rentals" description="Verify your 6-digit OTP code." />

      <AuthHeader
        title="ENTER OTP CODE"
        subtitle="Verification Required"
        description="We have sent a 6-digit verification code to your phone number and email."
      />

      <form onSubmit={handleVerify} className="space-y-6">
        {/* 6 Digit Input Grid */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-3" onPaste={handlePaste}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-11 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold text-[#111111] bg-white border border-stone-200 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 shadow-sm outline-none transition-all duration-200 text-base"
            />
          ))}
        </div>

        {/* Countdown Timer & Resend */}
        <div className="text-center text-xs text-stone-500 space-y-1">
          {timer > 0 ? (
            <p>
              Resend code available in{' '}
              <span className="font-bold text-[#C49A3A]">
                00:{timer < 10 ? `0${timer}` : timer}
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-semibold text-[#111111] hover:text-[#C49A3A] underline cursor-pointer min-h-[44px] px-2"
            >
              Didn&apos;t receive the code? Resend OTP
            </button>
          )}
        </div>

        {/* Verify Button */}
        <Button type="submit" variant="black" loading={loading} className="w-full">
          Verify & Continue
        </Button>

        <div className="text-center">
          <Link to="/login" className="text-xs font-semibold text-[#111111] hover:text-[#C49A3A]">
            &larr; Back to Login
          </Link>
        </div>
      </form>

      <FeatureSection />
    </AuthLayout>
  )
}

export default OTPVerification
