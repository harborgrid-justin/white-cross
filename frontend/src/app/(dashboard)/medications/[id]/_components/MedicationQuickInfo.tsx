/**
 * @fileoverview Medication Quick Info Component
 * @module app/(dashboard)/medications/[id]/_components/MedicationQuickInfo
 *
 * @description
 * Sidebar card displaying essential medication information at a glance including
 * status, dosage, route, frequency, and next scheduled administration.
 *
 * **Features:**
 * - Color-coded status badges
 * - Clear information hierarchy
 * - Next due time display with formatting
 * - Responsive layout
 *
 * **Healthcare Context:**
 * - Displays Five Rights data (Medication, Dose, Route, Time)
 * - Shows current medication status
 * - Helps nurses verify administration details quickly
 *
 * @since 1.0.0
 */

import type { MedicationQuickInfoData } from './types';

/**
 * MedicationQuickInfo component props
 *
 * @interface MedicationQuickInfoProps
 * @property {MedicationQuickInfoData} medication - Quick info data to display
 *
 * @example
 * ```tsx
 * <MedicationQuickInfo
 *   medication={{
 *     status: 'active',
 *     dosage: '90 mcg',
 *     route: 'Inhalation',
 *     frequency: 'As needed',
 *     nextDue: '2025-11-05T09:00:00Z'
 *   }}
 * />
 * ```
 */
export interface MedicationQuickInfoProps {
  medication: MedicationQuickInfoData;
}

/**
 * Get status badge color classes based on medication status
 *
 * @function getStatusColor
 * @param {MedicationQuickInfoData['status']} status - Medication status
 * @returns {string} Tailwind CSS classes for status badge
 *
 * @example
 * ```typescript
 * getStatusColor('active') // Returns: 'bg-green-100 text-green-800'
 * getStatusColor('inactive') // Returns: 'bg-gray-100 text-gray-800'
 * ```
 */
function getStatusColor(status: MedicationQuickInfoData['status']): string {
  const statusColors: Record<MedicationQuickInfoData['status'], string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    discontinued: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  };

  return statusColors[status] || statusColors.inactive;
}

/**
 * MedicationQuickInfo Component
 *
 * Displays essential medication information in a sidebar card for quick reference.
 * Information includes status, dosage, route, frequency, and next scheduled dose.
 *
 * **Information Displayed:**
 * - **Status**: Current medication status with color-coded badge
 * - **Dosage**: Prescribed dosage (e.g., "90 mcg", "500 mg")
 * - **Route**: Administration route (e.g., "Inhalation", "Oral")
 * - **Frequency**: Dosing schedule (e.g., "Twice daily", "As needed")
 * - **Next Due**: Next scheduled administration time (if applicable)
 *
 * **Visual Hierarchy:**
 * - Card with border and padding
 * - Section heading
 * - Definition list (dl/dt/dd) for structured data
 * - Status badge for quick visual identification
 *
 * **Accessibility:**
 * - Semantic HTML (dl/dt/dd) for screen readers
 * - Clear labels for each field
 * - Status badge with appropriate color contrast
 *
 * @component
 * @param {MedicationQuickInfoProps} props - Component props
 * @returns {JSX.Element} Rendered quick info card
 *
 * @example
 * ```tsx
 * <MedicationQuickInfo
 *   medication={{
 *     status: 'active',
 *     dosage: '500 mg',
 *     route: 'Oral',
 *     frequency: 'Twice daily with meals',
 *     nextDue: '2025-11-05T08:00:00Z'
 *   }}
 * />
 * ```
 */
export function MedicationQuickInfo({
  medication
}: MedicationQuickInfoProps): JSX.Element {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 font-semibold text-gray-900">Quick Info</h3>
      <dl className="space-y-3">
        {/* Status */}
        <div>
          <dt className="text-sm font-medium text-gray-500">Status</dt>
          <dd className="mt-1">
            <span
              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                medication.status
              )}`}
            >
              {medication.status}
            </span>
          </dd>
        </div>

        {/* Dosage */}
        <div>
          <dt className="text-sm font-medium text-gray-500">Dosage</dt>
          <dd className="mt-1 text-sm text-gray-900">{medication.dosage}</dd>
        </div>

        {/* Route */}
        <div>
          <dt className="text-sm font-medium text-gray-500">Route</dt>
          <dd className="mt-1 text-sm text-gray-900">{medication.route}</dd>
        </div>

        {/* Frequency */}
        <div>
          <dt className="text-sm font-medium text-gray-500">Frequency</dt>
          <dd className="mt-1 text-sm text-gray-900">{medication.frequency}</dd>
        </div>

        {/* Next Due (conditional) */}
        {medication.nextDue && (
          <div>
            <dt className="text-sm font-medium text-gray-500">Next Due</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {new Date(medication.nextDue).toLocaleString()}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}

MedicationQuickInfo.displayName = 'MedicationQuickInfo';
