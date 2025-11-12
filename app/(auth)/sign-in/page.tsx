'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sprout, Eye, EyeOff } from 'lucide-react'

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign in logic here
    console.log('Sign in:', { email, password })
  }

  return (
    <div className="auth-container">
      {/* Logo */}
      <div className="auth-logo">
        <div className="w-12 h-12 bg-green-700 rounded-xl flex items-center justify-center">
          <Sprout className="w-7 h-7" color="white" />
        </div>
        <Link className="text-3xl font-bold text-green-800" href="/">ʻĀina Bucks</Link>
      </div>

      {/* Auth Card */}
      <div className="auth-card">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Welcome</h2>
          <p className="text-gray-600 text-md">
            Join our community of volunteers making a difference
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="auth-tabs">
          <button
            onClick={() => setActiveTab('signin')}
            className={`auth-tab ${activeTab === 'signin' ? 'auth-tab-active' : ''}`}
          >
            Sign In
          </button>
          <Link href="/sign-up" className="auth-tab">
            Sign Up
          </Link>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <Label htmlFor="email" className="auth-label">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <Label htmlFor="password" className="auth-label">
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <span className="text-sm text-gray-400 mt-1 block">
              (At least 8 characters long)
            </span>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white py-6 text-lg font-semibold rounded-xl"
          >
            Sign In
          </Button>
        </form>

        {/* Register Link */}
        <p className="text-center text-gray-600 mt-6">
          Don&apos;t have an account already?{' '}
          <Link href="/sign-up" className="text-gray-900 font-semibold hover:text-green-700">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignIn