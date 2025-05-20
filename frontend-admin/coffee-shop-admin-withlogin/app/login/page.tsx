"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Coffee, Eye, EyeOff, Lock, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useLogin } from "@/lib/api-hooks"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { execute: login, isLoading } = useLogin()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}
    let isValid = true

    if (!email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }

    if (!password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const result = await login({ email, password })

      // Store token in localStorage or cookies if remember me is checked
      if (rememberMe && result.token) {
        localStorage.setItem("authToken", result.token)
      }

      toast({
        title: "Login successful",
        description: "Welcome back to Brew Haven!",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Coffee shop image */}
      <div className="hidden md:block md:w-1/2 relative bg-amber-900">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-800/90 to-amber-950/90 z-10" />
        <Image src="/placeholder.svg?height=1080&width=1920" alt="Coffee Shop" fill className="object-cover" priority />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-12 text-white">
          <Coffee className="h-16 w-16 mb-6 text-amber-300" />
          <h1 className="text-4xl font-bold mb-4 text-center">Brew Haven</h1>
          <p className="text-xl text-center max-w-md text-amber-100">
            Welcome to your coffee shop management dashboard. Sign in to manage orders, inventory, and more.
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-gradient-to-b from-amber-50 to-white">
        <div className="w-full max-w-md space-y-8 animate-fadeIn">
          {/* Mobile logo */}
          <div className="text-center md:hidden">
            <Coffee className="h-12 w-12 mx-auto text-amber-600" />
            <h1 className="text-3xl font-bold mt-2 text-slate-800">Brew Haven</h1>
            <p className="mt-2 text-slate-600">Sign in to your account</p>
          </div>

          {/* Desktop heading */}
          <div className="hidden md:block">
            <h2 className="text-3xl font-bold text-slate-800">Welcome back</h2>
            <p className="mt-2 text-slate-600">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className={`pl-10 h-12 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm font-medium text-amber-600 hover:text-amber-700">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`pl-10 pr-10 h-12 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-slate-600">
                Don&apos;t have an account?{" "}
                <Link href="/contact" className="font-medium text-amber-600 hover:text-amber-700">
                  Contact admin
                </Link>
              </p>
            </div>
          </form>

          <div className="pt-6 mt-6 border-t border-slate-200">
            <p className="text-center text-sm text-slate-500">
              &copy; {new Date().getFullYear()} Brew Haven. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
