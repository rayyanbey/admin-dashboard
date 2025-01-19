import '@/app/globals.css'
import { SessionContext, SessionProvider } from 'next-auth/react'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Professional admin dashboard with Google login',
}

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
    </SessionProvider>
  )
}

