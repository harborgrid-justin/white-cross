/**
 * @fileoverview System Health Monitoring Page
 *
 * Real-time system health dashboard displaying comprehensive operational metrics
 * including service availability, resource utilization (CPU, memory, disk, network),
 * and active system alerts. Critical for proactive system monitoring and incident
 * response in a healthcare platform environment.
 *
 * @module app/admin/monitoring/health/page
 * @requires react
 * @requires @/app/admin/_actions/monitoring
 * @requires @/components/admin
 * @requires lucide-react
 *
 * @security RBAC - Requires 'admin' or 'system_administrator' role
 * @audit System health access logged for compliance
 * @compliance HIPAA - System monitoring required for operational oversight
 *
 * @architecture Server Component with Suspense boundary for async data loading
 * @rendering Server-side data fetching with client-side hydration
 *
 * @since 2025-10-26
 */

import { Suspense } from 'react'
import { getSystemHealth } from '@/app/admin/_actions/monitoring'
import { AdminStatusIndicator } from '@/components/admin'
import {
  AlertCircle,
} from 'lucide-react'
import { SystemHealthDisplay } from './_components/SystemHealthDisplay'

/**
 * Formats byte values into human-readable gigabyte representation.
 *
 * @param {number} bytes - Raw byte count
 * @returns {string} Formatted string with 1 decimal place (e.g., "12.5 GB")
 *
 * @example
 * ```tsx
 * formatBytes(12884901888) // "12.0 GB"
 * formatBytes(5368709120)  // "5.0 GB"
 * ```
 */
function formatBytes(bytes: number): string {
  const gb = bytes / 1073741824
  return `${gb.toFixed(1)} GB`
}

/**
 * Formats uptime seconds into human-readable days and hours format.
 *
 * @param {number} seconds - Uptime in seconds
 * @returns {string} Formatted uptime string (e.g., "30d 5h")
 *
 * @example
 * ```tsx
 * formatUptime(2592000)  // "30d 0h"
 * formatUptime(2635200)  // "30d 12h"
 * ```
 */
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  return `${days}d ${hours}h`
}

/**
 * System health content component that fetches and displays real-time health metrics.
 *
 * Server component that retrieves system health data and passes it to client component.
 *
 * @async
 * @returns {Promise<JSX.Element>} Rendered system health dashboard
 *
 * @throws {Error} If system health data cannot be fetched
 *
 * @security Admin-only component - RBAC enforced at route level
 * @audit Component render logs health data access
 */
async function SystemHealthContent() {
  const health = await getSystemHealth()
  
  return <SystemHealthDisplay health={health} />
}

/**
 * System health monitoring page component.
 *
 * Main page component that wraps the async health content in a Suspense boundary,
 * providing loading state while system health data is fetched. Essential for
 * real-time operational visibility and proactive incident management.
 *
 * @returns {JSX.Element} System health page with loading boundary
 *
 * @security Requires admin role - enforced by parent routes and middleware
 * @audit Page access logged for HIPAA compliance
 * @compliance HIPAA - System monitoring required for operational oversight
 *
 * @architecture Server Component with Suspense for async data
 * @rendering Server-side data fetch with progressive loading
 *
 * @example
 * ```tsx
 * // Accessed via: /admin/monitoring/health
 * // Shows loading spinner while fetching system health data
 * // Then displays complete health dashboard
 * ```
 */
export default function SystemHealthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <SystemHealthContent />
    </Suspense>
  )
}
