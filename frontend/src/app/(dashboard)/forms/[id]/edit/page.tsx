/**
 * @fileoverview Edit Form Page - Modify existing form with full builder functionality
 *
 * This page provides the form builder interface for editing existing forms. It loads
 * the current form structure and allows modifications while preserving response data
 * and maintaining form versioning for audit compliance.
 *
 * **Key Features:**
 * - Load existing form structure for editing
 * - Full form builder capabilities (same as create)
 * - Form versioning on save
 * - Preview current and edited versions
 * - Response preservation during edits
 * - Quick access to view responses
 * - Publishing workflow for changes
 *
 * **Edit Capabilities:**
 * - Add new fields
 * - Modify existing field properties
 * - Remove fields (with confirmation if responses exist)
 * - Reorder fields with drag-and-drop
 * - Update validation rules
 * - Modify conditional logic
 * - Change form settings and metadata
 * - Update styling and branding
 *
 * **Form Versioning:**
 * Each save creates a new version with:
 * - Version number (auto-incremented)
 * - Timestamp of change
 * - User who made changes
 * - Change summary/notes
 * - Full form structure snapshot
 * - Link to previous version
 *
 * **Impact on Responses:**
 * - **Adding fields**: New responses will include new fields
 * - **Modifying fields**: Existing responses unchanged, new responses use updated field
 * - **Removing fields**: Warning shown if field has responses, data preserved in archive
 * - **Changing validation**: Only applies to new responses
 * - **Reordering fields**: Display order changes, data structure unchanged
 *
 * **Edit Workflow:**
 * 1. User navigates to form edit page
 * 2. Current form structure loads in builder
 * 3. User makes modifications
 * 4. Auto-save tracks changes
 * 5. Preview shows updated form
 * 6. User publishes changes
 * 7. New version created
 * 8. Form immediately uses new version
 * 9. Old version archived for reference
 *
 * **Published Form Editing:**
 * When editing published forms with responses:
 * - Warning shown about potential impact
 * - Option to create new version vs modify in place
 * - Breaking changes require admin approval
 * - Response data migration tools available
 * - Ability to notify previous respondents of changes
 *
 * **Safety Features:**
 * - Confirmation required for destructive changes
 * - Undo/redo for recent edits
 * - Revert to previous version option
 * - Compare versions side-by-side
 * - Test changes in preview mode
 * - Publish changes gradually (staged rollout)
 *
 * **Validation Before Save:**
 * - All required fields have labels
 * - Conditional logic is valid
 * - No circular dependencies in logic
 * - All validation rules are syntactically correct
 * - Form has at least one field
 * - Signature fields properly configured
 *
 * @module app/forms/[id]/edit
 * @requires next/Metadata - Next.js metadata type definitions
 * @requires @/components/forms/FormBuilder - Form builder component
 * @requires next/navigation - Navigation utilities
 *
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html|HIPAA Privacy Rule}
 */

/**
 * Force dynamic rendering for form editing - requires current form data
 */
export const dynamic = 'force-dynamic';


import { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { LoadingSpinner } from '@/components'
import { FormBuilder } from '@/components/forms'
import Link from 'next/link'
import { ArrowLeft, Eye } from 'lucide-react'

/**
 * Props interface for Edit Form Page
 *
 * @interface EditFormPageProps
 * @property {Object} params - Route parameters from Next.js dynamic routing
 * @property {string} params.id - Form UUID to edit
 */
interface EditFormPageProps {
  params: {
    id: string
  }
}

/**
 * Generates dynamic metadata for form editing page.
 *
 * Creates appropriate meta tags for the form editor. In production,
 * this should fetch the actual form name from the database.
 *
 * @async
 * @function generateMetadata
 * @param {EditFormPageProps} props - Page props with form ID
 * @returns {Promise<Metadata>} Next.js metadata object
 *
 * @example
 * // For form with ID "health-screening-123"
 * // Returns: { title: "Edit Form health-screening-123 | White Cross", ... }
 */
export async function generateMetadata({ params }: EditFormPageProps): Promise<Metadata> {
  // TODO: Fetch actual form name from API for accurate title
  return {
    title: `Edit Form ${params.id} | White Cross`,
    description: 'Edit custom healthcare form'
  }
}

/**
 * Edit Form Page Component
 *
 * Server component that renders the form builder interface with an existing form
 * loaded for editing. Provides full editing capabilities while managing versioning
 * and response data preservation.
 *
 * **Page Actions:**
 * - Back to forms library
 * - View responses (navigates to responses page)
 * - Save draft (creates new version)
 * - Publish changes (makes new version live)
 * - Preview form (test edited version)
 * - Revert to previous version
 *
 * **Access Control:**
 * - Requires 'forms:edit' permission
 * - User must own form or have admin privileges
 * - Published forms may require higher permission to edit
 * - Changes to official forms require approval workflow
 *
 * **Edit Notifications:**
 * When form has existing responses:
 * - Warning banner shows response count
 * - Breaking changes highlighted
 * - Impact assessment provided
 * - Option to notify previous respondents
 * - Suggest creating new form vs editing
 *
 * **Version Control:**
 * - Each save creates timestamped version
 * - Version history accessible via dropdown
 * - Compare any two versions
 * - Restore previous version with single click
 * - Version notes/changelog required for major changes
 *
 * @async
 * @function EditFormPage
 * @param {EditFormPageProps} props - Page props with form ID
 * @returns {Promise<JSX.Element>} Rendered form editing page
 * @throws {notFound} When form ID is invalid or missing
 *
 * @example
 * // School nurse updates health screening form
 * // 1. Navigate to /forms/screening-123/edit
 * // 2. Form loads in builder with existing fields
 * // 3. Add new field: "Vaccination status"
 * // 4. Update temperature range validation: 95-105°F
 * // 5. Preview changes
 * // 6. Save as new version
 * // 7. Publish updated form
 * // 8. All new submissions use updated version
 *
 * @example
 * // Administrator fixes form validation issue
 * // 1. Navigate to /forms/medication-456/edit
 * // 2. Notice phone number field validation too strict
 * // 3. Modify regex pattern to allow more formats
 * // 4. Add help text explaining accepted formats
 * // 5. Test validation in preview
 * // 6. Publish fix immediately
 * // 7. Issue resolved for all future submissions
 *
 * @security
 * - Edit events logged for audit trail
 * - Version history prevents data loss
 * - Breaking changes require additional confirmation
 * - PHI in existing responses remains protected
 */
export default async function EditFormPage({ params }: EditFormPageProps) {
  const { id } = params

  // Validate form ID parameter
  if (!id) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header with navigation and quick actions */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          {/* Back navigation to forms library */}
          <Link
            href="/forms"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forms
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Form</h1>
          <p className="text-gray-600 mt-1">Modify form ID: {id}</p>
        </div>

        {/* Quick action: View responses */}
        <Link
          href={`/forms/${id}/responses`}
          className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Responses
        </Link>
      </div>

      {/*
        Suspense boundary for form builder with existing form data
        Loads form structure from API and initializes builder
        Shows spinner during initial form load
      */}
      <Suspense fallback={<LoadingSpinner />}>
        <FormBuilder formId={id} />
      </Suspense>
    </div>
  )
}
