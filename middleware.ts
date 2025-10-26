import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth/auth'

export default async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers
  })

  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  
  // If trying to access protected route without session
  if (!session && !isAuthPage && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // If logged in and trying to access auth pages, redirect to dashboard
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/account', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}