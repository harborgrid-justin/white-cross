/**
 * @fileoverview Quick Actions Card Component
 * @module app/(dashboard)/medications/[id]/_components/QuickActionsCard
 *
 * @description
 * Sidebar card providing quick access links to common medication-related tasks
 * including viewing administration log, editing medication, and viewing schedule.
 *
 * **Features:**
 * - Quick access to administration log
 * - Link to medication edit form
 * - Link to medication schedule view
 * - Hover states for better UX
 *
 * **Healthcare Context:**
 * - Fast navigation to medication management tasks
 * - Supports nurse workflow efficiency
 * - Common actions grouped together
 *
 * @since 1.0.0
 */

import Link from 'next/link';

/**
 * QuickActionsCard component props
 *
 * @interface QuickActionsCardProps
 * @property {string} medicationId - Medication UUID for routing
 *
 * @example
 * ```tsx
 * <QuickActionsCard medicationId="abc-123" />
 * ```
 */
export interface QuickActionsCardProps {
  medicationId: string;
}

/**
 * QuickActionsCard Component
 *
 * Displays a sidebar card with quick action links for common medication
 * management tasks. Provides fast navigation to key medication functions.
 *
 * **Quick Actions:**
 * 1. **View Full Administration Log**: Complete history of all administrations
 * 2. **Edit Medication**: Modify medication details, dosage, schedule
 * 3. **View Schedule**: See upcoming scheduled administrations
 *
 * **Permission Requirements:**
 * - View Administration Log: VIEW_ADMINISTRATION_LOG permission
 * - Edit Medication: EDIT_MEDICATIONS permission
 * - View Schedule: VIEW_MEDICATIONS permission
 *
 * **Visual Design:**
 * - Card with border and padding
 * - Stacked action links
 * - Gray background with hover state
 * - Consistent spacing and typography
 *
 * **Accessibility:**
 * - Semantic link elements
 * - Descriptive link text
 * - Keyboard navigable
 * - Focus visible states
 *
 * @component
 * @param {QuickActionsCardProps} props - Component props
 * @returns {JSX.Element} Rendered quick actions card
 *
 * @example
 * ```tsx
 * <QuickActionsCard medicationId="med-abc-123" />
 * ```
 */
export function QuickActionsCard({
  medicationId
}: QuickActionsCardProps): JSX.Element {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 font-semibold text-gray-900">Quick Actions</h3>

      <div className="space-y-2">
        {/* View Full Administration Log */}
        <Link
          href={`/medications/${medicationId}/administration-log`}
          className="block rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          View Full Administration Log
        </Link>

        {/* Edit Medication */}
        <Link
          href={`/medications/${medicationId}/edit`}
          className="block rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Edit Medication
        </Link>

        {/* View Schedule */}
        <Link
          href={`/medications/schedule?medicationId=${medicationId}`}
          className="block rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          View Schedule
        </Link>
      </div>
    </div>
  );
}

QuickActionsCard.displayName = 'QuickActionsCard';
