/**
 * Audit Logging Middleware
 *
 * Logs PHI access and critical operations for HIPAA compliance.
 * Integrates with the AuditService for comprehensive audit trails.
 *
 * @module middleware/audit
 * @since 2025-10-26
 */

import { NextRequest, NextResponse, userAgent } from 'next/server';

/**
 * PHI-sensitive routes requiring audit logging
 */
const PHI_ROUTES = [
  '/students',
  '/medications',
  '/health-records',
  '/appointments',
  '/emergency-contacts',
  '/incidents',
];

/**
 * Admin routes requiring audit logging
 */
const ADMIN_ROUTES = [
  '/admin',
  '/users',
  '/settings',
  '/compliance',
  '/audit',
];

/**
 * Check if route requires PHI audit logging
 */
export function requiresPHIAudit(pathname: string): boolean {
  return PHI_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Check if route requires admin audit logging
 */
export function requiresAdminAudit(pathname: string): boolean {
  return ADMIN_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Extract resource type from pathname
 */
function extractResource(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  return parts[0] || 'unknown';
}

/**
 * Extract resource ID from pathname
 */
function extractResourceId(pathname: string): string | undefined {
  const parts = pathname.split('/').filter(Boolean);
  // Look for UUID pattern
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const idPart = parts.find((part) => uuidPattern.test(part) || /^\d+$/.test(part));
  return idPart;
}

/**
 * Get client IP address
 */
export function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    request.ip ||
    'unknown'
  );
}

/**
 * Audit middleware function
 *
 * Note: This logs to console in middleware. For production,
 * the actual audit events should be sent to the backend API
 * from the client-side AuditService after the page loads.
 */
export function auditMiddleware(request: NextRequest): void {
  const { pathname, searchParams } = request.nextUrl;
  const userId = request.headers.get('x-user-id');
  const userRole = request.headers.get('x-user-role');
  const method = request.method;
  const clientIP = getClientIP(request);

  // Parse user agent using Next.js helper for better performance and accuracy
  const { device, browser, os } = userAgent(request);

  // Log PHI access
  if (requiresPHIAudit(pathname) && userId) {
    const auditLog = {
      timestamp: new Date().toISOString(),
      userId,
      userRole,
      action: `${method}_${pathname}`,
      resource: extractResource(pathname),
      resourceId: extractResourceId(pathname),
      ipAddress: clientIP,
      userAgent: {
        browser: browser.name || 'unknown',
        browserVersion: browser.version || 'unknown',
        os: os.name || 'unknown',
        osVersion: os.version || 'unknown',
        device: device.type || 'desktop',
        deviceVendor: device.vendor || 'unknown',
        deviceModel: device.model || 'unknown',
      },
      details: `${method} request to ${pathname}`,
      isPHI: true,
      severity: 'HIGH',
    };

    console.log('[AUDIT] PHI Access:', JSON.stringify(auditLog));
  }

  // Log admin access
  if (requiresAdminAudit(pathname) && userId) {
    const auditLog = {
      timestamp: new Date().toISOString(),
      userId,
      userRole,
      action: `${method}_${pathname}`,
      resource: extractResource(pathname),
      resourceId: extractResourceId(pathname),
      ipAddress: clientIP,
      userAgent: {
        browser: browser.name || 'unknown',
        browserVersion: browser.version || 'unknown',
        os: os.name || 'unknown',
        osVersion: os.version || 'unknown',
        device: device.type || 'desktop',
        deviceVendor: device.vendor || 'unknown',
        deviceModel: device.model || 'unknown',
      },
      details: `Admin ${method} request to ${pathname}`,
      isPHI: false,
      severity: 'CRITICAL',
    };

    console.log('[AUDIT] Admin Access:', JSON.stringify(auditLog));
  }
}
