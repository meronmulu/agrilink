import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // 1. Get auth details from cookies
  const token = request.cookies.get('token')?.value
  const role = request.cookies.get('user-role')?.value
  
  const { pathname } = request.nextUrl

  // 2. EXCLUDE STATIC FILES (This fixes the hero_title1 issue)
  // If the request is for an image, a script, or a translation file, let it pass.
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.startsWith('/static') ||
    pathname.includes('.') // matches files like .json, .png, .jpg
  ) {
    return NextResponse.next()
  }

  // 3. Define Public Routes
  // Add any path that should be visible without logging in
  const isPublicRoute = 
   pathname === '/' ||
  pathname === '/login' ||
  pathname === '/register' ||
  pathname === '/signup' ||
  pathname === '/forgotPassword' ||
  pathname === '/verify-otp' ||
  pathname === '/resetPassword' 


  // 4. Redirect Logic: No token = Go to Home/Login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 5. Role-Based Access
  if (token && role) {
    if (pathname.startsWith('/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    if (pathname.startsWith('/buyer') && role !== 'BUYER') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    if (pathname.startsWith('/agent') && role !== 'AGENT') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    if (pathname.startsWith('/farmer') && role !== 'FARMER') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    // Prevent logged-in users from going to login page
    if (pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

// 6. The Matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}