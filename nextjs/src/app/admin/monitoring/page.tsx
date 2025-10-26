/**
 * Admin Monitoring Overview Page
 *
 * Redirect to system health page as the default monitoring view.
 *
 * @module app/admin/monitoring/page
 * @since 2025-10-26
 */

import { redirect } from 'next/navigation'

export default function MonitoringPage() {
  redirect('/admin/monitoring/health')
}
