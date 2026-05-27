'use client'

import { useState, Suspense, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Github, Chrome } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL
const EXPIRE_MINS: number = parseInt(process.env.ACCESS_TOKEN_EXPIRE_MINUTES || "60", 10)

function AuthPageContent() {
  const searchParams = useSearchParams()
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  const msg = searchParams.get('message')

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [exception, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (msg) {
      setMessage(msg)
    }
  }, [msg])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) {
      return
    }

    // Sign up validation
    if (mode == "signup") {
      setIsLoading(true)
      if (formData.password != formData.confirmPassword) {
        setError("Both password do not match")
        return
      }

      if (formData.password.length < 8) {
        setError("Password should be atleast 8 characters long.")
        return
      }
      try {
        const response = await fetch(`${API_URL}/api/users`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(
              {
                email: formData.email,
                username: formData.username,
                name: "John Doe",
                password: formData.password
              }
            )
          }
        );

        setIsLoading(false)
        if (!response.ok) {
          const errorResponse = await response.json()
          throw new Error(`Error: ${response.status}: ${JSON.stringify(errorResponse.detail)}`)
        }
        else {
          const msg = `Sign up successfull, kindly login.`
          window.location.href = `/auth?mode=login&message=${encodeURIComponent(msg)}`
        }
      }
      catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message)
        }
        else {
          setError(`An unexpected error occured: ${error}`)
        }
        return
      }
    }
    // Login Validation
    else {
      setIsLoading(true)

      const data = new FormData()
      data.append('username', formData.email)
      data.append('password', formData.password)

      try {
        const response = await fetch(`${API_URL}/api/users/token`,
          {
            method: 'POST',
            body: data,
          }
        );

        if (response.ok) {
          setIsLoading(false)

          const data = await response.json()
          const expiry = new Date()
          expiry.setTime(expiry.getTime() + (EXPIRE_MINS * 60 * 1000))
          
          Cookies.set(`access_token`, data.access_token, { expires : expiry, path : '/'})
          setMessage(`Login Successful.`)
          window.location.href = "/"
          return
        }
        else {
          setIsLoading(false)
          const errorResponse = await response.json()
          throw new Error(`Error: ${response.status}: ${JSON.stringify(errorResponse.detail)}`)
        }
        

      }
      catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message)
        }
        else {
          setError(`An unexpected error occured: ${error}`)
        }
        return
      }
    }


  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login')
    setFormData({ email: '', username: '', password: '', confirmPassword: '' })
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center glow-primary">
              <span className="text-primary-foreground font-bold text-xl">O</span>
            </div>
            <span className="text-3xl font-bold text-foreground">ORBIT</span>
          </Link>

          <h1 className="text-4xl xl:text-5xl font-bold text-foreground mb-6 text-balance">
            Join the conversation that matters
          </h1>
          <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
            Connect with thinkers, creators, and innovators from around the world. Share ideas, spark discussions, and explore new perspectives.
          </p>

          {/* Stats */}
          <div className="flex gap-8 mt-12">
            <div>
              <p className="text-3xl font-bold text-foreground">125K+</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">890K+</p>
              <p className="text-sm text-muted-foreground">Discussions</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent">3.4K</p>
              <p className="text-sm text-muted-foreground">Online Now</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow-primary">
              <span className="text-primary-foreground font-bold text-lg">O</span>
            </div>
            <span className="text-2xl font-bold text-foreground">ORBIT</span>
          </Link>

          {/* Mode Toggle */}
          <div className="glass rounded-xl p-1 flex mb-8">
            <button
              onClick={() => setMode('login')}
              className={cn(
                "flex-1 py-3 rounded-lg text-sm font-medium transition-all",
                mode === 'login'
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              style={{ cursor: 'pointer' }}
            >
              Login
            </button>
            <button
              onClick={() => setMode('signup')}
              className={cn(
                "flex-1 py-3 rounded-lg text-sm font-medium transition-all",
                mode === 'signup'
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              style={{ cursor: 'pointer' }}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <div className="glass rounded-xl p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="text-muted-foreground mt-1">
                {mode === 'login'
                  ? 'Enter your credentials to access your account'
                  : 'Join ORBIT and start exploring'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 bg-secondary/30 border-border/50 focus:border-primary/50"
                    required
                  />
                </div>
              </div>

              {/* Username (Signup only) */}
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-foreground">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Your Name"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="pl-10 bg-secondary/30 border-border/50 focus:border-primary/50"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10 bg-secondary/30 border-border/50 focus:border-primary/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    style={{ cursor: 'pointer' }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Signup only) */}
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="pl-10 pr-10 bg-secondary/30 border-border/50 focus:border-primary/50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      style={{ cursor: 'pointer' }}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Forgot Password (Login only) */}
              {mode === 'login' && (
                <div className="flex justify-end">
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary hover:underline"
                    style={{ cursor: 'pointer' }}
                  >
                    Forgot password?
                  </Link>
                </div>
              )}
              {/* Error label */}
              {exception && (
                <p className="text-red-500 text-sm">
                  {exception}
                </p>
              )}
              {message && (
                <p className="text-green-500 text-sm">
                  {message}
                </p>
              )}
              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 glow-primary"
                disabled={isLoading}
                style={{ cursor: 'pointer' }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="border-border/50 hover:bg-secondary/50">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
              <Button variant="outline" className="border-border/50 hover:bg-secondary/50">
                <Chrome className="w-4 h-4 mr-2" />
                Google
              </Button>
            </div>

            {/* Toggle Mode */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={toggleMode}
                className="text-primary hover:underline font-medium"
                style={{ cursor: 'pointer' }}
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  )
}
