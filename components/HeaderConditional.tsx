"use client"
import React from 'react'
import { usePathname } from 'next/navigation'
import Header from './Header'

export default function HeaderConditional(): React.ReactElement | null {
  const pathname = usePathname()

  // this is a client component so `window` is available. Prefer the
  // real browser pathname (avoids a brief mismatch where usePathname
  // may be undefined during hydration).
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : (pathname ?? '')

  if (!currentPath) return null
  if (currentPath.startsWith('/auth')) return null
  return <Header />
}
