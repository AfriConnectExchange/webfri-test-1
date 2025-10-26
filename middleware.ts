import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth/session'

// Define paths that don't require authentication
const publicPaths = [
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/api/auth/signin',
  '/api/auth/signup',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/verify-email',
  '/api/auth/google',
  '/api/auth/facebook',
  '/',                    // Landing page
  '/blog',               // Public blog
  '/about',              // About page
  '/contact',            // Contact page
  '/tos',                // Terms of Service
  '/privacy',            // Privacy Policy
]

// Define API paths that don't require CSRF token
const csrfExemptPaths = [
  '/api/auth/google/callback',
  '/api/auth/facebook/callback',
  '/api/auth/verify-email',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and public assets
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/public') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Get session from cookie
  const session = await getSession(request.cookies)
  
  // If no session and trying to access protected route
  if (!session && !pathname.startsWith('/api/')) {
    // Store the current URL to redirect back after login
    const searchParams = new URLSearchParams({
      callbackUrl: request.nextUrl.pathname + request.nextUrl.search
    })
    return NextResponse.redirect(
      new URL(`/auth/signin?${searchParams}`, request.url)
    )
  }

  if (!session && pathname.startsWith('/api/')) {
    // Return 401 for API routes
    return new NextResponse(
      JSON.stringify({ 
        error: 'Unauthorized',
        message: 'You must be logged in to access this resource',
        code: 'AUTH_REQUIRED'
      }),
      { 
        status: 401,
        headers: { 
          'content-type': 'application/json',
          'WWW-Authenticate': 'Bearer'
        }
      }
    )
  }

  // Session exists - check if it's for an API route
  if (session && pathname.startsWith('/api/')) {
    // Check CSRF token for state-changing API requests
    if (
      !csrfExemptPaths.includes(pathname) &&
      ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)
    ) {
      const csrfToken = request.headers.get('x-csrf-token')
      if (!csrfToken || csrfToken !== session.csrfToken) {
        return new NextResponse(
          JSON.stringify({ 
            error: 'Invalid CSRF token',
            message: 'CSRF token missing or invalid',
            code: 'INVALID_CSRF'
          }),
          { 
            status: 403,
            headers: { 'content-type': 'application/json' }
          }
        )
      }
    }

    // Add user context to API request headers
    const response = NextResponse.next()
    response.headers.set('x-user-id', session.user.id)
    response.headers.set('x-user-roles', session.user.roles.join(','))
    response.headers.set('x-user-status', session.user.status)
    response.headers.set('x-csrf-token', session.csrfToken)

    if (process.env.NODE_ENV === 'development') {
      response.headers.set('x-debug-session-expiry', session.expiresAt.toISOString())
    }

    return response
  }

  // Session exists - check authorization for protected pages
  if (session) {
    // Verify user status
    if (session.user.status !== 'ACTIVE') {
      // Redirect to appropriate page based on status
      switch (session.user.status) {
        case 'PENDING':
          return NextResponse.redirect(
            new URL('/auth/verify', request.url)
          )
        case 'SUSPENDED':
          return NextResponse.redirect(
            new URL('/account-suspended', request.url)
          )
        case 'BANNED':
          return NextResponse.redirect(
            new URL('/account-banned', request.url)
          )
        default:
          return NextResponse.redirect(
            new URL('/auth/signin', request.url)
          )
      }
    }

    // Add session context to page request
    const response = NextResponse.next()
    
    // Set secure headers
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'same-origin')
    
    if (process.env.NODE_ENV === 'production') {
      response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains'
      )
    }

    return response
  }

  // Fallback - should never reach here
  return NextResponse.redirect(new URL('/auth/signin', request.url))
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public folder
     * - Public API routes that bypass auth
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|api/public/).*)',
    '/api/:path*',
  ]
}