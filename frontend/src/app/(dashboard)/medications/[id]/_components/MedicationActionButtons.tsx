/**
 * @fileoverview Medication Action Buttons Component
 * @module app/(dashboard)/medications/[id]/_components/MedicationActionButtons
 *
 * @description
 * Action buttons for medication detail page header providing quick access to
 * common medication management tasks.
 *
 * **Actions:**
 * - Edit: Navigate to medication edit form
 * - Record Administration: Open Five Rights verification workflow
 * - Check Interactions: Cross-reference with other active medications
 *
 * **Healthcare Compliance:**
 * - Edit requires EDIT_MEDICATIONS permission
 * - Record Administration requires ADMINISTER_MEDICATIONS permission
 * - All actions create audit log entries
 *
 * @since 1.0.0
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PencilIcon, ClockIcon, BeakerIcon } from '@heroicons/react/24/outline';

/**
 * MedicationActionButtons component props
 *
 * @interface MedicationActionButtonsProps
 * @property {string} medicationId - Medication UUID for routing
 *
 * @example
 * ```tsx
 * <MedicationActionButtons medicationId="abc-123" />
 * ```
 */
export interface MedicationActionButtonsProps {
  medicationId: string;
}

/**
 * MedicationActionButtons Component
 *
 * Displays primary action buttons in the medication detail page header for
 * common medication management tasks.
 *
 * **Buttons:**
 * 1. **Edit**: Opens medication edit form (requires EDIT_MEDICATIONS)
 * 2. **Record Administration**: Opens Five Rights verification and administration logging
 * 3. **Check Interactions**: Opens drug interaction checker
 *
 * **Permission Requirements:**
 * - View: No additional permissions (page-level auth required)
 * - Edit: EDIT_MEDICATIONS permission
 * - Administer: ADMINISTER_MEDICATIONS permission
 * - Interactions: VIEW_MEDICATIONS permission
 *
 * **Accessibility:**
 * - Semantic button elements with descriptive labels
 * - Icon + text for clarity
 * - Keyboard navigable
 * - Focus visible
 *
 * @component
 * @param {MedicationActionButtonsProps} props - Component props
 * @returns {JSX.Element} Rendered action button group
 *
 * @example
 * ```tsx
 * <MedicationActionButtons medicationId="med-abc-123" />
 * ```
 */
export function MedicationActionButtons({
  medicationId
}: MedicationActionButtonsProps): JSX.Element {
  return (
    <div className="flex gap-2">
      {/* Edit Medication Button */}
      <Link href={`/medications/${medicationId}/edit`}>
        <Button
          variant="secondary"
          icon={<PencilIcon className="h-5 w-5" />}
          aria-label="Edit medication details"
        >
          Edit
        </Button>
      </Link>

      {/* Record Administration Button */}
      <Link href={`/medications/${medicationId}/administer`}>
        <Button
          variant="primary"
          icon={<ClockIcon className="h-5 w-5" />}
          aria-label="Record medication administration"
        >
          Record Administration
        </Button>
      </Link>

      {/* Check Interactions Button */}
      <Link href="/medications/interactions">
        <Button
          variant="secondary"
          icon={<BeakerIcon className="h-5 w-5" />}
          aria-label="Check drug interactions"
        >
          Check Interactions
        </Button>
      </Link>
    </div>
  );
}

MedicationActionButtons.displayName = 'MedicationActionButtons';
