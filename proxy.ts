import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 1. Rename this to "middleware"
export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const role = request.cookies.get('user-role')?.value
  
  const { pathname } = request.nextUrl

  // 2. EXCLUDE STATIC FILES
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.startsWith('/static') ||
    pathname.includes('.') 
  ) {
    return NextResponse.next()
  }

  // 3. Define Public Routes
  const isPublicRoute = 
    pathname === '/' ||
    pathname === '/login' || 
    pathname === '/register' ||
    pathname === '/signup' ||
    pathname === '/forgotPassword' ||
    pathname === '/verify-otp' ||
    pathname === '/resetPassword' 

  // 4. Redirect Logic: No token = Only allow Public Routes
  if (!token) {
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next() // Allow access to public routes
  }

  // 5. If token exists (Logged-in users logic)
  if (token) {
    // Prevent logged-in users from going to login/signup pages
    if (pathname === '/login' || pathname === '/signup' || pathname === '/register') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Role-Based Access
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
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}