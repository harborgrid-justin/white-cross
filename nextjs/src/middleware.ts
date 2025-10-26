/**
 * Next.js Middleware - Route Protection and Authorization
 *
 * This middleware handles authentication and role-based access control for protected routes.
 * It runs on every request matching the configured paths and validates user permissions.
 *
 * @module middleware
 * @since 2025-10-26
 *
 * Protected Routes:
 * - /admin/* - Admin-only routes (ADMIN, DISTRICT_ADMIN roles)
 * - /inventory/* - Inventory management (ADMIN, NURSE roles)
 * - /reports/* - Reports and analytics (ADMIN, DISTRICT_ADMIN, SCHOOL_ADMIN roles)
 * - /settings/* - Settings pages (Authenticated users)
 *
 * Security:
 * - JWT token validation
 * - Role-based access control
 * - Audit logging for admin actions
 * - Session timeout enforcement
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Role definitions matching backend RBAC
export enum UserRole {
  ADMIN = 'ADMIN',
  DISTRICT_ADMIN = 'DISTRICT_ADMIN',
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
  NURSE = 'NURSE',
  STAFF = 'STAFF'
}

// Route permission configuration
const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  '/admin': [UserRole.ADMIN, UserRole.DISTRICT_ADMIN],
  '/inventory': [UserRole.ADMIN, UserRole.NURSE, UserRole.SCHOOL_ADMIN],
  '/reports': [UserRole.ADMIN, UserRole.DISTRICT_ADMIN, UserRole.SCHOOL_ADMIN],
}

/**
 * Decode JWT token to extract user information
 * Note: In production, use a proper JWT library with signature verification
 */
function decodeToken(token: string): { userId: string; role: UserRole; exp: number } | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Token decode error:', error)
    return null
  }
}

/**
 * Check if user has required role for the requested path
 */
function hasPermission(userRole: UserRole, pathname: string): boolean {
  // Find the matching route pattern
  for (const [route, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname.startsWith(route)) {
      return allowedRoles.includes(userRole)
    }
  }
  // Default: allow access if no specific permission defined
  return true
}

/**
 * Main middleware function
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/health') ||
    pathname.startsWith('/static') ||
    pathname === '/favicon.ico' ||
    pathname === '/login'
  ) {
    return NextResponse.next()
  }

  // Get auth token from cookie or Authorization header
  const token = request.cookies.get('auth_token')?.value ||
                request.headers.get('authorization')?.replace('Bearer ', '')

  // Redirect to login if no token
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Decode and validate token
  const payload = decodeToken(token)
  if (!payload) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    loginUrl.searchParams.set('error', 'invalid_token')
    return NextResponse.redirect(loginUrl)
  }

  // Check token expiration
  const now = Math.floor(Date.now() / 1000)
  if (payload.exp && payload.exp < now) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    loginUrl.searchParams.set('error', 'session_expired')
    return NextResponse.redirect(loginUrl)
  }

  // Check role-based permissions
  if (!hasPermission(payload.role, pathname)) {
    return NextResponse.redirect(new URL('/access-denied', request.url))
  }

  // Add user info to headers for downstream consumption
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', payload.userId)
  requestHeaders.set('x-user-role', payload.role)

  // Log admin actions for audit trail
  if (pathname.startsWith('/admin')) {
    // In production, send to audit logging service
    console.log(`[AUDIT] Admin access: ${payload.userId} (${payload.role}) -> ${pathname}`)
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

/**
 * Middleware configuration
 * Specify which routes should be protected by this middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/auth/* (auth endpoints)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)',
  ],
}
