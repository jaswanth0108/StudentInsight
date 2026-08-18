// src/middleware.ts — Edge-compatible lightweight route protection

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/', '/about', '/privacy', '/terms', '/contact', '/how-it-works']
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow static files, api routes, and public landing pages
  if (
    PUBLIC_ROUTES.some(r => pathname === r) ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // NextAuth session cookie check (standard session token name)
  const sessionToken =
    req.cookies.get('authjs.session-token')?.value ||
    req.cookies.get('__Secure-authjs.session-token')?.value ||
    req.cookies.get('next-auth.session-token')?.value ||
    req.cookies.get('__Secure-next-auth.session-token')?.value

  // If user visits auth routes like /login
  if (AUTH_ROUTES.some(r => pathname.startsWith(r))) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
