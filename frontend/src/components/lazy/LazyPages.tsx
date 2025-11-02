/**
 * Lazy-loaded Page Components
 *
 * This module provides lazy-loaded wrappers for large page components (1000+ lines).
 * These components are route-specific and should only be loaded when the user
 * navigates to that route. This significantly reduces the initial bundle size.
 *
 * PERFORMANCE IMPACT:
 * - Each large component: 50-150KB of code
 * - Initial load improvement: Pages load only when navigated to
 * - Route-based code splitting: Automatic with Next.js App Router
 *
 * COMPONENTS LAZY-LOADED:
 * - ComplianceDetail (1105 lines)
 * - ReportPermissions (1065 lines)
 * - AppointmentScheduler (1026 lines)
 * - ReportBuilder (1021 lines)
 * - ReportTemplates (1018 lines)
 * - ReportExport (1004 lines)
 * - And other 900+ line components
 *
 * USAGE:
 * ```tsx
 * // In route page.tsx
 * import { LazyComplianceDetail } from '@/components/lazy/LazyPages'
 *
 * export default function CompliancePage() {
 *   return (
 *     <Suspense fallback={<PageSkeleton />}>
 *       <LazyComplianceDetail id={id} />
 *     </Suspense>
 *   )
 * }
 * ```
 *
 * @module components/lazy/LazyPages
 * @since 1.1.0
 */

'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/feedback';

/**
 * Generic page loading fallback
 */
const PageLoadingFallback = () => (
  <div className="space-y-6 p-6">
    <div className="space-y-2">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
    </div>
    <div className="space-y-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  </div>
);

// ============================================================================
// COMPLIANCE PAGES
// ============================================================================

export const LazyComplianceDetail = dynamic(
  () => import('@/components/pages/Compliance/ComplianceDetail'),
  {
    loading: () => <PageLoadingFallback />,
    ssr: false,
  }
);

export const LazyComplianceAudit = dynamic(
  () => import('@/components/pages/Compliance/ComplianceAudit'),
  {
    loading: () => <PageLoadingFallback />,
    ssr: false,
  }
);

export const LazyComplianceWorkflow = dynamic(
  () => import('@/components/pages/Compliance/ComplianceWorkflow'),
  {
    loading: () => <PageLoadingFallback />,
    ssr: false,
  }
);

// ============================================================================
// REPORTS PAGES
// ============================================================================

export const LazyReportPermissions = dynamic(
  () => import('@/components/pages/Reports/ReportPermissions'),
  {
    loading: () => <PageLoadingFallback />,
    ssr: false,
  }
);

export const LazyReportBuilder = dynamic(
  () => import('@/components/pages/Reports/ReportBuilder'),
  {
    loading: () => <PageLoadingFallback />,
    ssr: false,
  }
);

export const LazyReportTemplates = dynamic(
  () => import('@/components/pages/Reports/ReportTemplates'),
  {
    loading: () => <PageLoadingFallback />,
    ssr: false,
  }
);

export const LazyReportExport = dynamic(
  () => import('@/components/pages/Reports/ReportExport'),
  {
    loading: () => <PageLoadingFallback />,
    ssr: false,
  }
);

export const LazyReportScheduler = dynamic(
  () => import('@/components/pages/Reports/ReportScheduler'),
  {
    loading: () => <PageLoadingFallback />,
    ssr: false,
  }
);

export const LazyReportAnalytics = dynamic(
  () => import('@/components/pages/Reports/ReportAnalytics'),
  {
    loading: () => <PageLoadingFallback />,
    ssr: false,
  }
);

// ============================================================================
// APPOINTMENTS PAGES
// ============================================================================

export const LazyAppointmentScheduler = dynamic(
  () => import('@/components/pages/Appointments/AppointmentScheduler'),
  {
    loading: () => <PageLoadingFallback />,
    ssr: false,
  }
);

export const LazyAppointmentCalendar = dynamic(
  () => import('@/components/pages/Appointments/AppointmentCalendar'),
  {
    loading: () => <PageLoadingFallback />,
    ssr: false,
  }
);

// ============================================================================
// COMMUNICATIONS PAGES
// ============================================================================

export const LazyCommunicationNotifications = dynamic(
  () => import('@/components/pages/Communications/CommunicationNotifications'),
  {
    loading: () => <PageLoadingFallback />,
    ssr: false,
  }
);

export const LazyCommunicationHistory = dynamic(
  () => import('@/components/pages/Communications/CommunicationHistory'),
  {
    loading: () => <PageLoadingFallback />,
    ssr: false,
  }
);

export const LazyCommunicationThreads = dynamic(
  () => import('@/components/pages/Communications/CommunicationThreads'),
  {
    loading: () => <PageLoadingFallback />,
    ssr: false,
  }
);

export const LazyCommunicationComposer = dynamic(
  () => import('@/components/pages/Communications/CommunicationComposer'),
  {
    loading: () => <PageLoadingFallback />,
    ssr: false,
  }
);

export const LazyCommunicationAnalytics = dynamic(
  () => import('@/components/pages/Communications/CommunicationAnalytics'),
  {
    loading: () => <PageLoadingFallback />,
    ssr: false,
  }
);

// ============================================================================
// BILLING PAGES
// ============================================================================

export const LazyBillingDetail = dynamic(
  () => import('@/components/pages/Billing/BillingDetail'),
  {
    loading: () => <PageLoadingFallback />,
    ssr: false,
  }
);

export const LazyBillingPayment = dynamic(
  () => import('@/components/pages/Billing/BillingPayment'),
  {
    loading: () => <PageLoadingFallback />,
    ssr: false,
  }
);

export const LazyBillingAnalytics = dynamic(
  () => import('@/components/pages/Billing/BillingAnalytics'),
  {
    loading: () => <PageLoadingFallback />,
    ssr: false,
  }
);

// ============================================================================
// MEDICATIONS PAGES
// ============================================================================

export const LazyMedicationAlerts = dynamic(
  () => import('@/components/pages/Medications/MedicationAlerts'),
  {
    loading: () => <PageLoadingFallback />,
    ssr: false,
  }
);

/**
 * Page Skeleton Component
 * Export for use in other loading states
 */
export { PageLoadingFallback as PageSkeleton };
