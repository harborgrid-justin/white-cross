/**
 * @fileoverview Admin Monitoring Overview Page
 *
 * Entry point for admin monitoring section that redirects to the system health
 * dashboard as the default monitoring view. This provides a consistent entry
 * point for monitoring features while ensuring users land on the most important
 * monitoring screen (system health status).
 *
 * @module app/admin/monitoring/page
 * @requires next/navigation
 *
 * @security RBAC - Requires 'admin' or 'system_administrator' role
 * @audit Monitoring page access is logged for compliance
 * @compliance HIPAA - Admin monitoring required for operational oversight
 *
 * @architecture Server Component - Uses Next.js redirect for immediate navigation
 * @rendering Server-side redirect (no client-side rendering)
 *
 * @since 2025-10-26
 */

import { redirect } from 'next/navigation'

/**
 * Admin monitoring overview page component that redirects to system health.
 *
 * Provides a consistent entry point for the monitoring section while ensuring
 * administrators immediately see the most critical monitoring information.
 *
 * @returns {never} Never returns - performs server-side redirect
 *
 * @security Inherits RBAC from parent layout - admin role required
 *
 * @example
 * ```tsx
 * // URL: /admin/monitoring
 * // Automatically redirects to: /admin/monitoring/health
 * ```
 */
export default function MonitoringPage() {
  redirect('/admin/monitoring/health')
}
