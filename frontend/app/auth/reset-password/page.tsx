'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Lock, Eye, EyeOff, CheckCircle, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) return
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsSuccess(true)
  }

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    let strength = 0
    if (pwd.length >= 8) strength++
    if (pwd.match(/[a-z]/) && pwd.match(/[A-Z]/)) strength++
    if (pwd.match(/\d/)) strength++
    if (pwd.match(/[^a-zA-Z\d]/)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(password)
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['bg-destructive', 'bg-orange-500', 'bg-yellow-500', 'bg-success']

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow-primary">
            <span className="text-primary-foreground font-bold text-lg">O</span>
          </div>
          <span className="text-2xl font-bold text-foreground">ORBIT</span>
        </Link>

        <div className="glass rounded-xl p-6 md:p-8">
          {!isSuccess ? (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Reset your password</h1>
                <p className="text-muted-foreground mt-2">
                  Create a new password for your account
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-secondary/30 border-border/50 focus:border-primary/50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        {[0, 1, 2, 3].map((level) => (
                          <div
                            key={level}
                            className={cn(
                              "h-1 flex-1 rounded-full transition-colors",
                              level < passwordStrength 
                                ? strengthColors[passwordStrength - 1] 
                                : "bg-border"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Password strength:{' '}
                        <span className={cn(
                          passwordStrength === 1 && "text-destructive",
                          passwordStrength === 2 && "text-orange-500",
                          passwordStrength === 3 && "text-yellow-500",
                          passwordStrength === 4 && "text-success",
                        )}>
                          {strengthLabels[passwordStrength - 1] || 'Too weak'}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={cn(
                        "pl-10 pr-10 bg-secondary/30 border-border/50 focus:border-primary/50",
                        confirmPassword && password !== confirmPassword && "border-destructive focus:border-destructive"
                      )}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-destructive">Passwords do not match</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 glow-primary"
                  disabled={isLoading || password !== confirmPassword || passwordStrength < 2}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Resetting password...
                    </span>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Password reset successful</h2>
              <p className="text-muted-foreground mb-6">
                Your password has been successfully reset. You can now sign in with your new password.
              </p>
              <Button asChild className="w-full bg-primary hover:bg-primary/90 glow-primary">
                <Link href="/auth?mode=login">
                  Sign In
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
