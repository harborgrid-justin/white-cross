/**
 * @fileoverview Compliance Route Loading Component
 *
 * Provides loading skeleton UI while compliance data is being fetched.
 * Displays placeholder elements that match the expected layout of compliance pages.
 *
 * @module compliance/loading
 *
 * @description
 * This loading component is automatically displayed by Next.js App Router during
 * Suspense boundaries and server component data fetching. It provides visual
 * feedback to users while compliance metrics, audit logs, or policy data loads.
 *
 * **Features:**
 * - Skeleton UI matching compliance dashboard layout
 * - Stat cards placeholder
 * - Filter controls placeholder
 * - List items placeholder (6 items default)
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/loading | Next.js Loading UI}
 *
 * @since 1.0.0
 */

import { GenericListLoadingSkeleton } from '@/components/loading/GenericListLoadingSkeleton';

/**
 * Compliance Loading Component
 *
 * Displays skeleton UI while compliance data is being fetched from the server.
 * Automatically shown by Next.js during Suspense boundaries.
 *
 * @returns {JSX.Element} Loading skeleton with stats, filters, and list placeholders
 *
 * @description
 * Uses GenericListLoadingSkeleton component configured for compliance pages with:
 * - Stats cards (compliance score, risk, alerts, audit count)
 * - Filter controls (action, severity, date range)
 * - 6 placeholder items for compliance entries
 *
 * @example
 * ```tsx
 * // Automatically used by Next.js App Router during loading
 * // Route: /compliance or /compliance/audits
 * <ComplianceLoading />
 * ```
 */
export default function ComplianceLoading() {
  return (
    <GenericListLoadingSkeleton
      showStats={true}
      showFilters={true}
      itemCount={6}
    />
  );
}
