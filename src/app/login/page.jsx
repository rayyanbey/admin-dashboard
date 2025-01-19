'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FaGoogle } from 'react-icons/fa'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    // Here you would typically handle email/password login
    console.log('Email login:', email, password)
  }

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your email to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleEmailLogin}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2 mt-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700" type="submit">
              Sign In with Email
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>
          <Button
            variant="outline"
            className="bg-white text-gray-900 hover:bg-gray-100"
            onClick={handleGoogleLogin}
          >
            <FaGoogle className="w-5 h-5 mr-2 text-red-600" />
            Google
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-gray-600 mt-2">
            By signing in, you agree to our{' '}
            <a href="#" className="underline text-blue-600 hover:text-blue-800">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="underline text-blue-600 hover:text-blue-800">
              Privacy Policy
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

