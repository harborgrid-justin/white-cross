/**
 * @fileoverview Edit Medication Page - Modify Existing Medication with Change Tracking
 * @module app/(dashboard)/medications/[id]/edit
 *
 * @description
 * Medication editing form with comprehensive audit trail, change detection,
 * and re-verification of safety requirements when critical fields change.
 *
 * **Edit Capabilities:**
 * - Update dosage, route, frequency (with safety re-verification)
 * - Modify administration schedule
 * - Update prescriber information
 * - Change medication status (active/inactive/discontinued)
 * - Add special instructions or notes
 * - Update storage requirements
 * - Modify expiration dates
 *
 * **Change Tracking & Audit:**
 * - All changes logged with timestamp, user, and reason
 * - Before/after values recorded for audit compliance
 * - Critical changes require additional verification:
 *   * Dosage changes: Re-calculate and verify safe ranges
 *   * Medication name changes: Re-check allergies and interactions
 *   * Route changes: Verify appropriateness and parent consent
 *   * Status changes to discontinued: Document reason and notify parent
 *
 * **Safety Re-verification:**
 * - **Dosage Changes**: Verify new dose within safe pediatric ranges
 * - **Med Change**: Re-run allergy and interaction checks
 * - **Route Change**: Confirm administration method feasibility
 * - **Frequency Change**: Validate schedule during school hours
 * - **Parent Re-consent**: Required for significant changes
 *
 * **Controlled Substance Edits:**
 * - DEA schedule changes require enhanced authorization
 * - Dosage changes require witness verification
 * - All edits logged in controlled substance accountability record
 * - Inventory reconciliation triggered on quantity changes
 *
 * **Status Change Workflows:**
 * - **Active → Inactive**: Requires reason, parent notification optional
 * - **Active → Discontinued**: Requires reason, parent notification required
 * - **Inactive → Active**: Re-verify all safety checks and consents
 * - **Any → Expired**: Automatic on prescription expiration date
 *
 * **Form Pre-population:**
 * - All current medication data loaded
 * - Read-only fields shown for reference (e.g., creation date, NDC)
 * - Change detection highlights modified fields
 * - Unsaved changes warning on navigation
 *
 * **Validation:**
 * - Same validation rules as new medication entry
 * - Additional validation for logical consistency of changes
 * - Prevents changes that would create unsafe conditions
 * - Enforces prescription expiration constraints
 *
 * **HIPAA Compliance:**
 * - All edits are PHI modifications requiring audit logging
 * - Before/after values encrypted in audit trail
 * - Role-based access (EDIT_MEDICATIONS permission)
 * - Enhanced permissions for controlled substance edits
 * - Automatic session timeout protection
 *
 * **Regulatory Compliance:**
 * - FDA 21 CFR Part 11 - Electronic Records change control
 * - DEA regulations for controlled substance modifications
 * - Joint Commission medication management standards
 * - State pharmacy board requirements
 *
 * **Workflow:**
 * 1. System fetches current medication data
 * 2. Form pre-populated with existing values
 * 3. Nurse modifies fields as needed
 * 4. System detects changes and highlights modifications
 * 5. Critical changes trigger re-verification workflows
 * 6. System validates all changes
 * 7. Nurse provides reason for significant changes
 * 8. Parent re-consent obtained if required
 * 9. Changes saved with complete audit trail
 * 10. Notifications sent as appropriate
 *
 * @requires Authentication - JWT with nurse/admin role
 * @requires Permissions - EDIT_MEDICATIONS, VIEW_MEDICATIONS
 *
 * @param {string} params.id - Medication UUID to edit
 *
 * @example
 * ```tsx
 * // URL: /medications/abc-123-def-456/edit
 * // Displays edit form pre-populated with current medication data
 * // On submit, updates medication with audit trail
 * // Redirects to medication detail page on success
 * ```
 *
 * @since 1.0.0
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MedicationForm from '@/components/medications/forms/MedicationForm';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Edit Medication | White Cross',
  description: 'Update medication details and prescription information'
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

interface EditMedicationPageProps {
  params: {
    id: string;
  };
}

/**
 * Fetch medication data server-side
 */
async function getMedication(id: string) {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.MEDICATIONS.BY_ID(id), {
      next: { tags: [`medication-${id}`] }
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch medication');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching medication:', error);
    return null;
  }
}

/**
 * Edit Medication Page
 *
 * Server Component that fetches medication data and renders edit form.
 */
export default async function EditMedicationPage({ params }: EditMedicationPageProps) {
  const medication = await getMedication(params.id);

  if (!medication) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit ${medication.name}`}
        description="Update medication details and prescription information"
        backLink={`/medications/${params.id}`}
        backLabel="Back to Medication"
      />

      <Suspense fallback={<FormLoadingSkeleton />}>
        <div className="mx-auto max-w-4xl">
          <MedicationForm
            mode="edit"
            medicationId={params.id}
            initialData={medication}
          />
        </div>
      </Suspense>
    </div>
  );
}

/**
 * Loading skeleton
 */
function FormLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="animate-pulse space-y-6 rounded-lg border border-gray-200 bg-white p-6">
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i}>
              <div className="mb-2 h-4 w-32 rounded bg-gray-200"></div>
              <div className="h-10 w-full rounded bg-gray-100"></div>
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-3">
          <div className="h-10 w-24 rounded bg-gray-200"></div>
          <div className="h-10 w-32 rounded bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
}
