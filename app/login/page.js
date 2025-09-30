"use client"
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, getSession } from 'next-auth/react'
 import Galaxy from '@/ui/bg';
 
import { cn } from "@/lib/utils";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  ArrowRight,
  Loader2,
  Shield,
  Chrome,
  Smartphone,
  Check,
  RefreshCw,
  AlertCircle
} from 'lucide-react'

// Enhanced Floating Input with Aceternity-style animations
const FloatingInput = ({ type, placeholder, value, onChange, error, icon: Icon, showPassword, togglePassword }) => {
  const [focused, setFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)
  
  useEffect(() => {
    setHasValue(value.length > 0)
  }, [value])

  return (
    <div className="relative group">
      {/* Animated border glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-600/20 via-slate-500/20 to-slate-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
      
      {/* Main input container */}
      <div className="relative">
        <div className={`relative bg-black/50 backdrop-blur-xl border rounded-lg transition-all duration-300 ${
          focused ? 'border-slate-400/50 shadow-lg shadow-slate-500/10' : 'border-slate-700/50'
        } ${error ? 'border-red-500/50 animate-pulse' : ''}`}>
          
          {/* Floating label */}
          <label className={`absolute left-3 transition-all duration-300 pointer-events-none ${
            focused || hasValue 
              ? 'top-2 text-xs text-slate-400' 
              : 'top-1/2 -translate-y-1/2 text-sm text-slate-500'
          } ${Icon ? 'left-10' : ''}`}>
            {placeholder}
          </label>
          
          {/* Icon */}
          {Icon && (
            <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
              focused ? 'text-slate-300' : 'text-slate-600'
            }`} />
          )}
          
          {/* Input field */}
          <input
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`w-full h-14 bg-transparent px-3 pt-6 pb-2 text-white focus:outline-none transition-all duration-300 ${
              Icon ? 'pl-10' : ''
            } ${togglePassword ? 'pr-12' : ''}`}
          />
          
          {/* Password toggle */}
          {togglePassword && (
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors duration-200"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="flex items-center gap-1 mt-2 text-red-400 text-xs animate-fade-in">
          <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse" />
          {error}
        </div>
      )}
    </div>
  )
}

// Enhanced Gradient Button with more subtle animations
const GradientButton = ({ children, onClick, disabled, loading, variant = 'primary', type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`relative w-full h-12 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 group overflow-hidden ${
        variant === 'primary'
          ? 'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white border border-slate-600/50 hover:border-slate-500/50 hover:shadow-lg hover:shadow-slate-500/20'
          : 'bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 text-white hover:bg-slate-800/50 hover:border-slate-600/50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'} ${className}`}
    >
      {/* Subtle animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-700/20 via-slate-600/20 to-slate-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex items-center space-x-2">
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          children
        )}
      </div>
    </button>
  )
}

// Enhanced OTP Input with better animations
const OTPInput = ({ value, onChange, error }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef([])
  
  // Sync internal state with parent value
  useEffect(() => {
    if (value && value.length === 6) {
      setOtp(value.split(''))
    } else if (!value) {
      setOtp(['', '', '', '', '', ''])
    }
  }, [value])
  
  useEffect(() => {
    const otpString = otp.join('')
    if (otpString !== value) {
      onChange(otpString)
    }
  }, [otp, onChange, value])

  const handleChange = (index, val) => {
    if (val.length <= 1 && /^\d*$/.test(val)) {
      const newOtp = [...otp]
      newOtp[index] = val
      setOtp(newOtp)
      
      // Auto-focus next input
      if (val && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text')
    const digits = paste.replace(/\D/g, '').slice(0, 6).split('')
    
    const newOtp = [...otp]
    digits.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit
    })
    setOtp(newOtp)
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex(digit => digit === '')
    const focusIndex = nextEmptyIndex === -1 ? 5 : Math.min(nextEmptyIndex, digits.length)
    inputRefs.current[focusIndex]?.focus()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            type="text"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`w-12 h-12 bg-black/50 backdrop-blur-xl border rounded-lg text-center text-white text-lg font-semibold focus:outline-none transition-all duration-300 ${
              error 
                ? 'border-red-500/50 animate-pulse' 
                : digit 
                  ? 'border-slate-400/50 bg-slate-800/30' 
                  : 'border-slate-700/50 focus:border-slate-500/50 focus:shadow-lg focus:shadow-slate-500/10'
            }`}
            maxLength={1}
          />
        ))}
      </div>
      {error && (
        <div className="text-red-400 text-xs text-center flex items-center justify-center gap-1 animate-fade-in">
          <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse" />
          {error}
        </div>
      )}
    </div>
  )
}

// Main component
const EnhancedLoginForm = () => {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loginType, setLoginType] = useState('password')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [isForgotPassword, setIsForgotPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    otp: ''
  })

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession()
      if (session) {
        router.push('/')
      }
    }
    checkSession()
  }, [router])

  // OTP countdown
  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [countdown])

  // Form validation
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }

    if (!isLogin && !formData.name) {
      newErrors.name = 'Name is required'
    }

    if (loginType === 'password' && !formData.password) {
      newErrors.password = 'Password is required'
    } else if (!isLogin && formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (loginType === 'otp' && otpSent && !formData.otp) {
      newErrors.otp = 'OTP is required'
    } else if (loginType === 'otp' && otpSent && formData.otp.length !== 6) {
      newErrors.otp = 'Please enter complete 6-digit OTP'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setSuccessMessage('')
    
    try {
      if (isLogin) {
        // Handle login
        if (loginType === 'otp') {
          // OTP login
          const result = await signIn('credentials', {
            email: formData.email,
            password: formData.otp,
            loginType: 'otp',
            redirect: false
          })

          if (result?.error) {
            setErrors({ otp: 'Invalid OTP code' })
          } else if (result?.ok) {
            router.push('/')
          } else {
            // Fallback: check session to confirm authentication
            const session = await getSession()
            if (session) {
              router.push('/')
            } else {
              setErrors({ otp: 'Authentication failed. Please try again.' })
            }
          }
        } else {
          // Password login
          const result = await signIn('credentials', {
            email: formData.email,
            password: formData.password,
            redirect: false
          })

          if (result?.error) {
            setErrors({ password: 'Invalid email or password' })
          } else if (result?.ok) {
            router.push('/')
          } else {
            // Fallback: check session to confirm authentication
            const session = await getSession()
            if (session) {
              router.push('/')
            } else {
              setErrors({ password: 'Invalid email or password' })
            }
          }
        }
      } else {
        // Handle registration
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          }),
        })

        const data = await response.json()

        if (response.ok) {
          setSuccessMessage('Account created successfully! Please sign in.')
          setIsLogin(true)
          setFormData({ name: '', email: '', password: '', otp: '' })
          setErrors({})
        } else {
          setErrors({ email: data.error || 'Registration failed' })
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
      setErrors({ email: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      console.error('Google sign in error:', error)
      setErrors({ email: 'Google sign in failed. Please try again.' })
    }
  }

  const handleSendOTP = async () => {
    if (!formData.email) {
      setErrors({ email: 'Email is required' })
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      })

      const data = await response.json()

      if (response.ok) {
        setOtpSent(true)
        setCountdown(60)
        setErrors({})
      } else {
        setErrors({ email: data.error || 'Failed to send OTP' })
      }
    } catch (error) {
      console.error('OTP error:', error)
      setErrors({ email: 'Failed to send OTP. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors({ email: 'Email is required' })
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccessMessage('Password reset email sent! Check your inbox.')
        setErrors({})
      } else {
        setErrors({ email: data.error || 'Failed to send reset email' })
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      setErrors({ email: 'Failed to send reset email. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPasswordClick = () => {
    setIsForgotPassword(true)
    setFormData({ name: '', email: '', password: '', otp: '' })
    setErrors({})
    setSuccessMessage('')
  }

  const handleBackToLogin = () => {
    setIsForgotPassword(false)
    setFormData({ name: '', email: '', password: '', otp: '' })
    setErrors({})
    setSuccessMessage('')
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    if (successMessage) {
      setSuccessMessage('')
    }
  }

  const resetForm = () => {
    setIsLogin(!isLogin)
    setFormData({ name: '', email: '', password: '', otp: '' })
    setErrors({})
    setOtpSent(false)
    setCountdown(0)
    setLoginType('password')
    setSuccessMessage('')
  }

  return (
    <>
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
      <div className="min-h-screen relative w-full overflow-hidden bg-black flex flex-col items-center justify-center ">
            <div className="absolute inset-0 w-full h-full bg-black z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
             {/* Background Galaxy */}
                 <div className="absolute inset-0 w-full h-full">
                   <Galaxy 
                     density={1.25}
                     glowIntensity={0.2}
                     saturation={0.5}
                     hueShift={180}
                     twinkleIntensity={1}
                     rotationSpeed={0.1}
                     repulsionStrength={1}
                     starSpeed={0.5}
                     speed={1}
                     transparent={false}
                   />
                 </div>
      <div className="min-h-screen bg-black/50 text-white relative overflow-hidden w-full xl:w-2/5">
    

        {/* Main container */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-md animate-fade-in">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                {isForgotPassword ? 'Reset Password' : (isLogin ? 'Welcome back' : 'Create account')}
              </h1>
              <p className="text-slate-400 text-sm">
                {isForgotPassword ? 'Enter your email to receive a password reset link' : (isLogin ? 'Sign in to your account' : 'Get started with your new account')}
              </p>
            </div>

            {/* Success message */}
            {successMessage && (
              <div className="flex items-center gap-2 mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg text-green-400">
                <Check className="w-4 h-4" />
                <span className="text-sm">{successMessage}</span>
              </div>
            )}

            {/* Social login */}
            {!isForgotPassword && (
              <div className="mb-6">
                <GradientButton variant="secondary" onClick={handleGoogleSignIn}>
                  <Chrome className="w-4 h-4" />
                  <span>Continue with Google</span>
                </GradientButton>
              </div>
            )}

            {/* Divider */}
            {!isForgotPassword && (
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-black text-slate-500">or</span>
                </div>
              </div>
            )}

            {/* Login type toggle */}
            {isLogin && !isForgotPassword && (
              <div className="flex bg-slate-900/50 backdrop-blur-xl rounded-lg p-1 mb-6 border border-slate-700/50">
                {[
                  { key: 'password', label: 'Password', icon: Lock },
                  { key: 'otp', label: 'OTP Login', icon: Smartphone }
                ].map((type) => (
                  <button
                    key={type.key}
                    onClick={() => {
                      setLoginType(type.key)
                      setOtpSent(false)
                      setFormData(prev => ({ ...prev, otp: '' }))
                      setErrors({})
                    }}
                    className={`flex-1 flex items-center justify-center space-x-2 h-10 rounded-md transition-all duration-300 text-sm font-medium ${
                      loginType === type.key
                        ? 'bg-slate-700 text-white shadow-lg border border-slate-600/50'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <type.icon className="w-4 h-4" />
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Form */}
            <div className="space-y-6">
              
              {/* Name field */}
              {!isLogin && !isForgotPassword && (
                <div className="animate-fade-in">
                  <FloatingInput
                    type="text"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    error={errors.name}
                    icon={User}
                  />
                </div>
              )}

              {/* Email field */}
              <FloatingInput
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                icon={Mail}
              />

              {/* Password field */}
              {(loginType === 'password' || !isLogin) && !isForgotPassword && (
                <div className="animate-fade-in">
                  <FloatingInput
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    error={errors.password}
                    icon={Lock}
                    showPassword={showPassword}
                    togglePassword={() => setShowPassword(!showPassword)}
                  />
                </div>
              )}

              {/* OTP section */}
              {isLogin && loginType === 'otp' && !isForgotPassword && (
                <div className="space-y-6 animate-fade-in">
                  {!otpSent ? (
                    <GradientButton
                      onClick={handleSendOTP}
                      disabled={loading || !formData.email}
                      loading={loading}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Send OTP</span>
                    </GradientButton>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Check className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-sm text-slate-400 mb-4">
                          We've sent a 6-digit code to<br />
                          <span className="text-white font-medium">{formData.email}</span>
                        </p>
                      </div>
                      
                      <OTPInput
                        value={formData.otp}
                        onChange={(otp) => handleInputChange('otp', otp)}
                        error={errors.otp}
                      />
                      
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>Didn't receive the code?</span>
                        {countdown > 0 ? (
                          <span className="text-slate-300 font-medium">Resend in {countdown}s</span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendOTP}
                            className="text-slate-300 hover:text-white font-medium transition-colors flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Resend OTP
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Submit button - Only show when not in OTP mode or when OTP is sent */}
              {!isForgotPassword && !(isLogin && loginType === 'otp' && !otpSent) && (
                <GradientButton
                  onClick={handleSubmit}
                  disabled={loading}
                  loading={loading}
                >
                  <span>
                    {isLogin 
                      ? 'Sign in'
                      : 'Create account'
                    }
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </GradientButton>
              )}

              {/* Forgot password submit button */}
              {isForgotPassword && (
                <GradientButton
                  onClick={handleForgotPassword}
                  disabled={loading || !formData.email}
                  loading={loading}
                >
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </GradientButton>
              )}
            </div>

            {/* Toggle form type */}
            {!isForgotPassword && (
              <div className="text-center mt-6">
                <button
                  onClick={resetForm}
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <span className="text-slate-300 font-medium">
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </span>
                </button>
              </div>
            )}

            {/* Forgot password */}
            {isLogin && loginType === 'password' && !isForgotPassword && (
              <div className="text-center mt-4">
                <button
                  onClick={handleForgotPasswordClick}
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            {/* Back to login from forgot password */}
            {isForgotPassword && (
              <div className="text-center mt-6">
                <button
                  onClick={handleBackToLogin}
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Back to sign in
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>

    </>
  )
}

export default EnhancedLoginForm