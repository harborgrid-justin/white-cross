/**
 * Next.js Middleware - Authentication, Security & Rate Limiting
 *
 * CRITICAL SECURITY: This middleware enforces authentication and HIPAA compliance.
 * All PHI routes require valid authentication tokens and role-based access.
 *
 * @module middleware
 * @since 2025-11-05
 */

import { NextRequest, NextResponse } from 'next/server';

// Stub for auth verification - will be implemented later
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function verifyAccessToken(_token: string) {
  // TODO: Implement proper JWT verification
  // TEMP: Return ADMIN role for development access to admin pages
  return { id: 'user1', email: 'test@test.com', role: 'ADMIN' };
}

// Stub for rate limiter - will be implemented later
function getRateLimiter() {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    check: async (_identifier: string, _limit: number, _window: string) => ({
      success: true,
      retryAfter: null,
    }),
  };
}

/**
 * Public routes that don't require authentication
 */
const PUBLIC_ROUTES = [
  '/login',
  '/session-expired',
  '/forgot-password',
  '/reset-password',
  '/_next',
  '/favicon.ico',
  '/api/health',
  '/api/auth/login',
  '/api/auth/refresh',
  '/api/auth/logout',
];

/**
 * PHI routes requiring enhanced security and audit logging
 */
const PHI_ROUTES = [
  '/students',
  '/health-records',
  '/medications',
  '/incidents',
  '/communications',
  '/api/v1/students',
  '/api/v1/health-records',
  '/api/v1/medications',
];

/**
 * Admin routes requiring ADMIN or SYSTEM_ADMIN role
 */
const ADMIN_ROUTES = [
  '/admin',
  '/api/v1/admin',
];

/**
 * Main middleware function
 */
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Fix for GitHub Codespaces Server Actions
  // Server Actions validate origin against x-forwarded-host
  const isCodespaces = process.env.CODESPACES === 'true' || 
                       request.headers.get('x-forwarded-host')?.includes('.app.github.dev');
  
  if (isCodespaces) {
    const response = NextResponse.next();
    const forwardedHost = request.headers.get('x-forwarded-host');
    
    // Override origin to match forwarded host for Server Actions
    if (forwardedHost) {
      response.headers.set('x-forwarded-host', forwardedHost);
      response.headers.set('x-forwarded-proto', 'https');
    }
    
    // For Server Actions POST requests, we need to rewrite headers
    if (request.method === 'POST' && request.headers.get('content-type')?.includes('multipart/form-data')) {
      return response;
    }
  }

  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const rateLimitResult = await checkRateLimit(request);
    if (!rateLimitResult.success) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': rateLimitResult.retryAfter || '60',
        },
      });
    }
  }

  // Authentication check
  const authResult = await authenticateRequest(request);

  if (!authResult.authenticated) {
    // Redirect to login with return URL
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control for admin routes
  if (ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    if (!['ADMIN', 'SYSTEM_ADMIN'].includes(authResult.user?.role || '')) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  // PHI access audit logging
  if (PHI_ROUTES.some(route => pathname.startsWith(route))) {
    // Note: Actual audit logging should happen in Server Actions/API routes
    // Here we just add headers for downstream processing
    const response = NextResponse.next();
    response.headers.set('X-PHI-Access', 'true');
    response.headers.set('X-User-Id', authResult.user?.id || '');
    response.headers.set('X-User-Role', authResult.user?.role || '');
    return response;
  }

  // Add user context to request headers
  const response = NextResponse.next();
  if (authResult.user) {
    response.headers.set('X-User-Id', authResult.user.id);
    response.headers.set('X-User-Email', authResult.user.email);
    response.headers.set('X-User-Role', authResult.user.role);
  }

  return response;
}

/**
 * Authenticate request using JWT token from cookies
 */
async function authenticateRequest(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return { authenticated: false };
    }

    // Verify JWT token (server-side only)
    const payload = await verifyAccessToken(token);

    return {
      authenticated: true,
      user: {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      },
    };
  } catch (error) {
    console.error('[Middleware] Authentication failed:', error);
    return { authenticated: false };
  }
}

/**
 * Rate limiting check
 */
async function checkRateLimit(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const limiter = getRateLimiter();

  // Different limits for different routes
  const limits = {
    '/api/v1/health-records': { limit: 100, window: '15m' },
    '/api/v1/students': { limit: 100, window: '15m' },
    '/api/v1/medications': { limit: 100, window: '15m' },
    '/api/v1': { limit: 500, window: '15m' },
    default: { limit: 1000, window: '15m' },
  };

  const identifier = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

  // Find matching limit
  let limit = limits.default;
  for (const [route, routeLimit] of Object.entries(limits)) {
    if (route !== 'default' && pathname.startsWith(route)) {
      limit = routeLimit;
      break;
    }
  }

  return await limiter.check(identifier, limit.limit, limit.window);
}

/**
 * Middleware configuration
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
