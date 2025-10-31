/**
 * @fileoverview Centralized Routing and Proxy Actions Hub
 * @module lib/routing
 * @category Routing & Navigation
 * 
 * This is the single entry point for ALL routing and proxy actions in the frontend.
 * All navigation, redirects, and proxy operations should go through this centralized hub.
 * 
 * Features:
 * - Centralized route definitions
 * - Type-safe navigation
 * - Middleware orchestration
 * - Proxy configuration
 * - Route protection
 * - Navigation logging
 * 
 * @example
 * ```typescript
 * import { routingActions, routes } from '@/lib/routing';
 * 
 * // Navigate with type safety
 * routingActions.navigate(routes.dashboard);
 * routingActions.navigateTo('students', { id: '123' });
 * 
 * // Check route permissions
 * const canAccess = routingActions.canAccessRoute('/admin');
 * 
 * // Apply middleware
 * const response = await routingActions.proxy.withAuth(request);
 * ```
 * 
 * @version 1.0.0
 * @since 2025-10-31
 */

import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

// Import middleware components
import { authMiddleware } from '@/middleware/auth';
import { rbacMiddleware } from '@/middleware/rbac';
import { securityHeadersMiddleware } from '@/middleware/security';
import { rateLimitMiddleware } from '@/middleware/rateLimit';
import { auditMiddleware } from '@/middleware/audit';
import { sanitizeMiddleware } from '@/middleware/sanitization';

/**
 * Centralized Route Definitions
 * 
 * All application routes defined in one place for consistency
 */
export const routes = {
  // Public routes
  public: {
    home: '/',
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    privacy: '/privacy',
    terms: '/terms',
  },

  // Dashboard routes
  dashboard: {
    root: '/dashboard',
    overview: '/dashboard/overview',
    analytics: '/dashboard/analytics',
  },

  // Student management
  students: {
    root: '/students',
    list: '/students',
    details: '/students/[id]',
    create: '/students/create',
    edit: '/students/[id]/edit',
    healthRecords: '/students/[id]/health-records',
    medications: '/students/[id]/medications',
    appointments: '/students/[id]/appointments',
  },

  // Health records
  health: {
    root: '/health',
    records: '/health/records',
    assessments: '/health/assessments',
    screenings: '/health/screenings',
    immunizations: '/health/immunizations',
  },

  // Appointments
  appointments: {
    root: '/appointments',
    list: '/appointments',
    calendar: '/appointments/calendar',
    create: '/appointments/create',
    details: '/appointments/[id]',
  },

  // Communication
  communication: {
    root: '/communication',
    messages: '/communication/messages',
    broadcasts: '/communication/broadcasts',
    templates: '/communication/templates',
  },

  // Reports and analytics
  reports: {
    root: '/reports',
    dashboard: '/reports/dashboard',
    student: '/reports/student',
    health: '/reports/health',
    compliance: '/reports/compliance',
  },

  // Administration
  admin: {
    root: '/admin',
    users: '/admin/users',
    roles: '/admin/roles',
    settings: '/admin/settings',
    integrations: '/admin/integrations',
    audit: '/admin/audit',
  },

  // Settings
  settings: {
    root: '/settings',
    profile: '/settings/profile',
    security: '/settings/security',
    notifications: '/settings/notifications',
    preferences: '/settings/preferences',
  },

  // API routes
  api: {
    auth: '/api/auth',
    students: '/api/students',
    health: '/api/health',
    appointments: '/api/appointments',
    communication: '/api/communication',
    reports: '/api/reports',
    admin: '/api/admin',
  },
} as const;

/**
 * Route Pattern Definitions
 */
export const routePatterns = {
  public: [
    routes.public.home,
    routes.public.login,
    routes.public.register,
    routes.public.forgotPassword,
    routes.public.resetPassword,
    routes.public.privacy,
    routes.public.terms,
  ],
  
  protected: [
    '/dashboard',
    '/students',
    '/health',
    '/appointments',
    '/communication',
    '/reports',
    '/settings',
  ],
  
  admin: [
    '/admin',
  ],
  
  api: [
    '/api',
  ],
} as const;

/**
 * Route Permission Requirements
 */
export const routePermissions = {
  '/dashboard': ['NURSE', 'ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
  '/students': ['NURSE', 'ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
  '/health': ['NURSE', 'ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
  '/appointments': ['NURSE', 'ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
  '/communication': ['NURSE', 'ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
  '/reports': ['NURSE', 'ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
  '/admin': ['ADMIN', 'DISTRICT_ADMIN'],
  '/settings': ['NURSE', 'ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
} as const;

/**
 * Centralized Navigation Actions
 */
export const navigationActions = {
  /**
   * Navigate to a route
   */
  navigate: (path: string, options?: { replace?: boolean }) => {
    if (typeof window !== 'undefined') {
      if (options?.replace) {
        window.location.replace(path);
      } else {
        window.location.href = path;
      }
    }
  },

  /**
   * Navigate with Next.js router
   */
  push: (path: string) => {
    // This would use Next.js router in actual implementation
    console.log(`[Navigation] Pushing to: ${path}`);
  },

  /**
   * Replace current route
   */
  replace: (path: string) => {
    console.log(`[Navigation] Replacing with: ${path}`);
  },

  /**
   * Go back in history
   */
  back: () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  },

  /**
   * Go forward in history
   */
  forward: () => {
    if (typeof window !== 'undefined') {
      window.history.forward();
    }
  },

  /**
   * Check if route is accessible
   */
  canAccessRoute: (path: string, userRoles: string[] = []): boolean => {
    const requiredRoles = routePermissions[path as keyof typeof routePermissions];
    if (!requiredRoles) return true; // Public route
    
    return requiredRoles.some(role => userRoles.includes(role));
  },

  /**
   * Get route type
   */
  getRouteType: (path: string): 'public' | 'protected' | 'admin' | 'api' => {
    if (routePatterns.public.some(route => path.startsWith(route))) return 'public';
    if (routePatterns.admin.some(route => path.startsWith(route))) return 'admin';
    if (routePatterns.api.some(route => path.startsWith(route))) return 'api';
    return 'protected';
  },

  /**
   * Build route with parameters
   */
  buildRoute: (template: string, params: Record<string, string>): string => {
    let route = template;
    Object.entries(params).forEach(([key, value]) => {
      route = route.replace(`[${key}]`, value);
    });
    return route;
  },
} as const;

/**
 * Centralized Proxy Actions
 */
export const proxyActions = {
  /**
   * Apply authentication middleware
   */
  withAuth: (request: NextRequest) => {
    return authMiddleware(request);
  },

  /**
   * Apply RBAC middleware
   */
  withRBAC: (request: NextRequest) => {
    return rbacMiddleware(request);
  },

  /**
   * Apply security headers
   */
  withSecurity: (request: NextRequest, response?: NextResponse) => {
    return securityHeadersMiddleware(request, response);
  },

  /**
   * Apply rate limiting
   */
  withRateLimit: (request: NextRequest) => {
    return rateLimitMiddleware(request);
  },

  /**
   * Apply audit logging
   */
  withAudit: (request: NextRequest) => {
    return auditMiddleware(request);
  },

  /**
   * Apply request sanitization
   */
  withSanitization: (request: NextRequest) => {
    return sanitizeMiddleware(request);
  },

  /**
   * Apply complete middleware chain
   */
  withFullMiddleware: async (request: NextRequest): Promise<NextResponse | null> => {
    const { pathname } = request.nextUrl;
    
    // 1. Security headers
    const response = securityHeadersMiddleware(request);
    
    // 2. Rate limiting
    const rateLimitResponse = rateLimitMiddleware(request);
    if (rateLimitResponse) return rateLimitResponse;
    
    // 3. Authentication (for protected routes)
    const routeType = navigationActions.getRouteType(pathname);
    if (routeType !== 'public') {
      const { response: authResponse } = authMiddleware(request);
      if (authResponse) return authResponse;
    }
    
    // 4. RBAC (for protected routes)
    if (routeType === 'protected' || routeType === 'admin') {
      const rbacResponse = rbacMiddleware(request);
      if (rbacResponse) return rbacResponse;
    }
    
    // 5. Audit logging
    auditMiddleware(request);
    
    // 6. Request sanitization
    await sanitizeMiddleware(request);
    
    return null; // Continue processing
  },

  /**
   * Handle redirects
   */
  redirect: (path: string, request: NextRequest) => {
    const url = new URL(path, request.url);
    return NextResponse.redirect(url);
  },

  /**
   * Handle rewrites
   */
  rewrite: (path: string, request: NextRequest) => {
    const url = new URL(path, request.url);
    return NextResponse.rewrite(url);
  },
} as const;

/**
 * Route Validation Utilities
 */
export const routeUtils = {
  /**
   * Validate route exists
   */
  isValidRoute: (path: string): boolean => {
    // Check if route exists in our definitions
    const allRoutes = Object.values(routes).flatMap(section => 
      typeof section === 'string' ? [section] : Object.values(section)
    );
    
    return allRoutes.some(route => path.startsWith(route as string)) || path.startsWith('/api/');
  },

  /**
   * Get breadcrumb for route
   */
  getBreadcrumb: (path: string): Array<{ label: string; path: string }> => {
    const segments = path.split('/').filter(Boolean);
    const breadcrumb: Array<{ label: string; path: string }> = [];
    
    let currentPath = '';
    segments.forEach(segment => {
      currentPath += `/${segment}`;
      breadcrumb.push({
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        path: currentPath,
      });
    });
    
    return breadcrumb;
  },

  /**
   * Check if route requires PHI access
   */
  requiresPHI: (path: string): boolean => {
    return path.includes('/students/') || 
           path.includes('/health/') || 
           path.includes('/appointments/');
  },

  /**
   * Check if route requires admin access
   */
  requiresAdmin: (path: string): boolean => {
    return path.startsWith('/admin/');
  },
} as const;

/**
 * Centralized Routing Actions
 */
export const routingActions = {
  navigation: navigationActions,
  proxy: proxyActions,
  utils: routeUtils,
} as const;

/**
 * Route Types
 */
export type RouteType = 'public' | 'protected' | 'admin' | 'api';
export type RoutePath = string;
export type RouteParams = Record<string, string>;

/**
 * Default export for convenient access
 */
export default {
  routes,
  routePatterns,
  routePermissions,
  routingActions,
  navigationActions,
  proxyActions,
  routeUtils,
};
