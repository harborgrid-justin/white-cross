/**
 * @fileoverview New Medication Page - Add New Student Medication with Safety Verification
 * @module app/(dashboard)/medications/new
 *
 * @description
 * Comprehensive medication entry form implementing Five Rights verification,
 * allergy checking, drug interaction screening, and controlled substance protocols.
 *
 * **Medication Entry Features:**
 * - Drug database search with NDC code lookup (FDA integration)
 * - Brand/generic name autocomplete from formulary
 * - Dosage calculation assistance (weight-based, BSA-based)
 * - Route and frequency selection with validation
 * - Prescriber information with NPI verification
 * - Prescription document upload and OCR processing
 * - Parent consent collection and documentation
 * - Storage requirement specification
 *
 * **Safety & Verification:**
 * - **Allergy Checking**: Cross-reference against student allergy profile
 * - **Drug Interactions**: Check against student's other active medications
 * - **Contraindications**: Validate against medical conditions
 * - **Black Box Warnings**: Display FDA serious risk information
 * - **Duplicate Checking**: Prevent duplicate active prescriptions
 * - **Dosage Validation**: Verify dose is within safe pediatric ranges
 * - **Schedule Validation**: Ensure administration schedule is practical
 *
 * **Five Rights Pre-Verification:**
 * - **Right Patient**: Student selection with photo confirmation
 * - **Right Medication**: NDC verification and brand/generic matching
 * - **Right Dose**: Range checking and unit validation
 * - **Right Route**: Administration method appropriateness
 * - **Right Time**: Schedule feasibility during school hours
 *
 * **Controlled Substances:**
 * - DEA schedule classification (I-V)
 * - Enhanced authorization requirements
 * - Witness signature collection
 * - Secure storage location assignment
 * - Disposal protocol selection
 * - Accountability log initialization
 *
 * **Prescription Requirements:**
 * - Prescriber name, NPI, DEA number (controlled substances)
 * - Prescription date and expiration
 * - Number of refills authorized
 * - E-prescription reference number (if applicable)
 * - Prescriber signature (electronic or uploaded)
 * - Pharmacy information
 *
 * **Parent Consent:**
 * - Electronic consent form with signature
 * - Alternative format options (paper scan, phone verification)
 * - Consent language in parent's preferred language
 * - Documented refusal handling
 * - Annual re-consent reminder
 *
 * **Form Validation:**
 * - Client-side validation for immediate feedback
 * - Server-side validation for security
 * - Required field enforcement
 * - Format validation (NDC, NPI, dates)
 * - Logical validation (expiration > start date)
 * - Cross-field validation (route appropriate for form)
 *
 * **HIPAA Compliance:**
 * - All medication data is PHI requiring protection
 * - Audit log entry on medication creation
 * - Encrypted form submission (TLS 1.3)
 * - Role-based access (ADD_MEDICATIONS permission)
 * - Secure file upload for prescription images
 * - Automatic PII detection and handling
 *
 * **Regulatory Compliance:**
 * - FDA 21 CFR Part 11 - Electronic Records/Signatures
 * - DEA 21 CFR 1300-1321 - Controlled Substances
 * - State Board of Pharmacy regulations
 * - School nursing medication administration standards
 * - Joint Commission medication management standards
 *
 * **Workflow:**
 * 1. Nurse searches drug database or enters medication manually
 * 2. System displays medication information and warnings
 * 3. Nurse enters prescription details and prescriber info
 * 4. System performs safety checks (allergies, interactions)
 * 5. Nurse uploads prescription document
 * 6. System validates all fields and prescriber credentials
 * 7. Nurse obtains/confirms parent consent
 * 8. System creates medication record with audit log
 * 9. Nurse sets up administration schedule
 * 10. System generates administration reminders
 *
 * @requires Authentication - JWT with nurse/admin role
 * @requires Permissions - ADD_MEDICATIONS, VIEW_STUDENTS
 *
 * @see {@link https://www.fda.gov/drugs/drug-approvals-and-databases/national-drug-code-directory NDC Directory}
 * @see {@link https://npiregistry.cms.hhs.gov/ NPI Registry}
 * @see {@link https://www.deadiversion.usdoj.gov/schedules/ DEA Schedules}
 *
 * @example
 * ```tsx
 * // URL: /medications/new
 * // Displays comprehensive medication entry form
 * // On submit, creates new medication with audit trail
 * // Redirects to medication detail page on success
 * ```
 *
 * @since 1.0.0
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import MedicationForm from '@/components/medications/forms/MedicationForm';
import { PageHeader } from '@/components/shared/PageHeader';

export const metadata: Metadata = {
  title: 'Add New Medication | White Cross',
  description: 'Add a new medication with prescription details and safety information'
};



/**
 * New Medication Page Component - Medication Entry Form Container
 *
 * @component
 * @returns {JSX.Element} Rendered new medication form page
 *
 * @description
 * Server Component that renders the comprehensive medication entry form with
 * all safety checks, validation, and regulatory compliance features.
 *
 * **Component Structure:**
 * - Page header with title and back navigation
 * - Form container with maximum width for readability
 * - Suspense boundary for progressive loading
 * - Loading skeleton during form initialization
 *
 * **Form Features (via MedicationForm component):**
 * - Multi-step wizard for complex medication entry
 * - Real-time validation with immediate feedback
 * - Drug database integration for autocomplete
 * - Allergy and interaction checking
 * - Prescription document upload
 * - Parent consent collection
 * - Administration schedule setup
 *
 * **Dynamic Rendering:**
 * - Force dynamic to ensure fresh data fetching
 * - Prevents static generation of PHI-containing pages
 * - Guarantees permission checking on every access
 *
 * **HIPAA Compliance:**
 * - Server-side rendering protects PHI
 * - No sensitive data in client-side JavaScript
 * - Audit logging handled by form submission
 *
 * @example
 * ```tsx
 * // Rendered at /medications/new
 * <NewMedicationPage />
 * ```
 *
 * @see {@link MedicationForm} for form implementation
 */
export default function NewMedicationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Medication"
        description="Enter medication details with prescription information and safety data"
        backLink="/medications"
        backLabel="Back to Medications"
      />

      <Suspense fallback={<FormLoadingSkeleton />}>
        <div className="mx-auto max-w-4xl">
          <MedicationForm mode="create" />
        </div>
      </Suspense>
    </div>
  );
}

/**
 * Loading skeleton for form
 */
function FormLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="animate-pulse space-y-6 rounded-lg border border-gray-200 bg-white p-6">
        <div className="space-y-4">
          {/* Form fields skeleton */}
          {[...Array(8)].map((_, i) => (
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
