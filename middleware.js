import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextAuthToken
    const { pathname } = req.nextUrl
    
    // If accessing /chat/[agent] without authentication, redirect to login
    if (pathname.startsWith('/chat/') && !token) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Public routes that don't need authentication
        const publicRoutes = ['/', '/login', '/api/auth', '/reset-password']
        
        // Allow public routes
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true
        }
        
        // Protected route: /chat/[agent] requires authentication
        if (pathname.startsWith('/chat/')) {
          return !!token
        }
        
        // All other routes are accessible
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ]
}