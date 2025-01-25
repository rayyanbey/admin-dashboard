import '@/app/globals.css'
import { Inter } from 'next/font/google'
import ClientSessionProvider from './clientSession'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Professional admin dashboard with Google login',
}

export default function RootLayout({ children }) {
  return (
    // <ClientSessionProvider>
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
    //</ClientSessionProvider>
  )
}

