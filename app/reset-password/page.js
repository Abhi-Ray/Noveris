"use client"
import React, { useState, useEffect,Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Loader2,
  Shield,
  Check,
  AlertCircle
} from 'lucide-react'
 import Galaxy from '@/ui/bg';

import { cn } from "@/lib/utils";
import {MultiStepLoaderDemo} from "@/app/loader";
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

const ResetPasswordForm = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.')
    }
  }, [token])

  const validateForm = () => {
    if (!formData.password) {
      setError('Password is required')
      return false
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return false
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    
    setError('')
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        setError(data.error || 'Failed to reset password')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-md text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Invalid Reset Link</h1>
            <p className="text-slate-400 mb-6">{error}</p>
            <GradientButton onClick={() => router.push('/login')}>
              <span>Back to Login</span>
              <ArrowRight className="w-4 h-4" />
            </GradientButton>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-md text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Password Reset Successfully</h1>
            <p className="text-slate-400 mb-6">Your password has been updated. You will be redirected to login in a few seconds.</p>
            <div className="flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span className="text-sm text-slate-400">Redirecting...</span>
            </div>
          </div>
        </div>
      </div>
    )
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
        {/* Subtle background elements */}
        <div className="absolute inset-0">
          {/* Animated gradient orbs - more subtle */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-slate-800/10 via-slate-700/10 to-slate-600/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-slate-700/10 via-slate-600/10 to-slate-800/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-slate-600/5 via-slate-500/5 to-slate-700/5 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}} />
          
          {/* Subtle grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(148, 163, 184, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(148, 163, 184, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        {/* Main container */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-md animate-fade-in">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                Reset Password
              </h1>
              <p className="text-slate-400 text-sm">
                Enter your new password below
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Password field */}
              <FloatingInput
                type={showPassword ? 'text' : 'password'}
                placeholder="New password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                error={error}
                icon={Lock}
                showPassword={showPassword}
                togglePassword={() => setShowPassword(!showPassword)}
              />

              {/* Confirm Password field */}
              <FloatingInput
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                error={error}
                icon={Lock}
                showPassword={showConfirmPassword}
                togglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
              />

              {/* Submit button */}
              <GradientButton
                type="submit"
                disabled={loading}
                loading={loading}
              >
                <span>Reset Password</span>
                <ArrowRight className="w-4 h-4" />
              </GradientButton>
            </form>

            {/* Back to login */}
            <div className="text-center mt-6">
              <button
                onClick={() => router.push('/login')}
                className="text-slate-400 hover:text-white transition-colors text-sm"
              >
                Back to login
              </button>
            </div>

            {/* Security badge */}
            <div className="flex items-center justify-center space-x-2 mt-6 text-xs text-slate-500">
              <Shield className="w-3 h-3" />
              <span>Protected by advanced encryption</span>
            </div>
          </div>
        </div>
      </div>
      </div>

    </>
  )
}

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<MultiStepLoaderDemo />}>
      <ResetPasswordForm />
    </Suspense>
  )
}

export default ResetPasswordPage
