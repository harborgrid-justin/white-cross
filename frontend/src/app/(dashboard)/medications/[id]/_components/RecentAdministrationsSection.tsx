/**
 * @fileoverview Recent Administrations Section Component
 * @module app/(dashboard)/medications/[id]/_components/RecentAdministrationsSection
 *
 * @description
 * Section wrapper for displaying recent medication administration records.
 * Wraps the AdministrationLog component with a heading and "View All" link.
 *
 * **Features:**
 * - Section heading with count
 * - Link to full administration log
 * - Integration with existing AdministrationLog component
 * - Suspense boundary for progressive rendering
 *
 * **Healthcare Context:**
 * - Displays last 10 administration records
 * - Shows Five Rights compliance data
 * - Tracks student refusals and reactions
 * - Links to complete administration history
 *
 * **HIPAA Compliance:**
 * - Administration records are Protected Health Information (PHI)
 * - Only visible to authorized healthcare staff
 * - Access logged for audit trail
 *
 * @since 1.0.0
 */

'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import AdministrationLog from '@/components/medications/administration/AdministrationLog';
import type { AdministrationRecord } from './types';

/**
 * RecentAdministrationsSection component props
 *
 * @interface RecentAdministrationsSectionProps
 * @property {string} medicationId - Medication UUID for routing
 * @property {AdministrationRecord[]} initialData - Initial administration records
 * @property {number} [limit=10] - Maximum number of records to display
 *
 * @example
 * ```tsx
 * <RecentAdministrationsSection
 *   medicationId="abc-123"
 *   initialData={administrationRecords}
 *   limit={10}
 * />
 * ```
 */
export interface RecentAdministrationsSectionProps {
  medicationId: string;
  initialData: AdministrationRecord[];
  limit?: number;
}

/**
 * Log loading skeleton component
 *
 * Displays animated placeholder while administration log loads.
 * Shows 5 skeleton rows to match typical administration log display.
 *
 * @component
 * @returns {JSX.Element} Rendered loading skeleton
 */
function LogSkeleton(): JSX.Element {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between border-b border-gray-100 pb-3"
        >
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 rounded bg-gray-200"></div>
            <div className="h-3 w-1/4 rounded bg-gray-100"></div>
          </div>
          <div className="h-6 w-16 rounded bg-gray-200"></div>
        </div>
      ))}
    </div>
  );
}

/**
 * RecentAdministrationsSection Component
 *
 * Displays recent medication administration records in a card with heading
 * and link to full log. Wraps the existing AdministrationLog component.
 *
 * **Section Features:**
 * - Heading: "Recent Administrations"
 * - "View All" link to full administration log
 * - Last N records (default 10)
 * - Suspense boundary for progressive rendering
 *
 * **Administration Record Display:**
 * - Date and time of administration
 * - Administering nurse name
 * - Dosage given
 * - Administration route
 * - Status (given, refused, reaction)
 * - View details button
 *
 * **Performance:**
 * - Client component for interactivity
 * - Suspense boundary prevents blocking
 * - Progressive rendering for better UX
 * - Initial data passed from server
 *
 * **Accessibility:**
 * - Semantic heading structure
 * - Descriptive link text
 * - Table accessible to screen readers
 * - Keyboard navigable
 *
 * @component
 * @param {RecentAdministrationsSectionProps} props - Component props
 * @returns {JSX.Element} Rendered administration section
 *
 * @example
 * ```tsx
 * <RecentAdministrationsSection
 *   medicationId="med-abc-123"
 *   initialData={[
 *     {
 *       id: 'admin-1',
 *       medicationName: 'Albuterol',
 *       studentName: 'John Doe',
 *       dosageGiven: '90 mcg',
 *       route: 'Inhalation',
 *       administeredAt: '2025-11-04T09:00:00Z',
 *       administeredBy: 'Jane Smith, RN'
 *     }
 *   ]}
 *   limit={10}
 * />
 * ```
 */
export function RecentAdministrationsSection({
  medicationId,
  initialData,
  limit = 10
}: RecentAdministrationsSectionProps): JSX.Element {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      {/* Section Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Administrations
        </h2>
        <Link
          href={`/medications/${medicationId}/administration-log`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View All →
        </Link>
      </div>

      {/* Administration Log with Suspense */}
      <Suspense fallback={<LogSkeleton />}>
        <AdministrationLog
          medicationId={medicationId}
          initialData={initialData}
          limit={limit}
        />
      </Suspense>
    </div>
  );
}

RecentAdministrationsSection.displayName = 'RecentAdministrationsSection';
