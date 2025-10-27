/**
 * @fileoverview Create New Form Page - Drag-and-drop form builder interface
 *
 * This page provides the form builder interface for creating new custom healthcare forms
 * from scratch. Users can drag and drop field types, configure validation rules, set up
 * conditional logic, and preview forms before publishing.
 *
 * **Key Features:**
 * - Drag-and-drop field placement
 * - Pre-built field type library
 * - Real-time form preview
 * - Field validation configuration
 * - Conditional logic builder
 * - Auto-save draft functionality
 * - Form settings and metadata
 * - Multi-page form support
 *
 * **Form Builder Interface:**
 * - **Left Panel**: Field type palette (text, dropdown, date, etc.)
 * - **Center Canvas**: Form design area with drag-and-drop
 * - **Right Panel**: Field properties and settings
 * - **Top Toolbar**: Save, preview, publish, undo/redo
 * - **Bottom Bar**: Form settings, logic rules, validation
 *
 * **Available Field Types:**
 * - **Text Input**: Single-line text, multiline textarea
 * - **Numeric**: Number input with min/max validation
 * - **Email**: Email address with format validation
 * - **Phone**: Phone number with international formats
 * - **Date/Time**: Date picker, time picker, datetime
 * - **Dropdown**: Single select from predefined options
 * - **Radio Buttons**: Single selection from visible options
 * - **Checkboxes**: Multiple selection
 * - **File Upload**: Document/image upload with size limits
 * - **Signature**: Digital signature capture
 * - **Section Header**: Organize form into sections
 * - **Paragraph Text**: Informational text blocks
 * - **Calculated Field**: Computed values from other fields
 *
 * **Field Configuration Options:**
 * - Label text and description
 * - Required vs optional
 * - Default values
 * - Placeholder text
 * - Validation rules (regex, min/max, custom)
 * - Conditional visibility (show/hide based on other fields)
 * - Field width (full, half, third, quarter)
 * - Help text and tooltips
 *
 * **Conditional Logic:**
 * Show/hide fields based on other field values:
 * ```
 * IF [allergies] = "Yes"
 * THEN show [allergy_details]
 *
 * IF [temperature] > 100.4
 * THEN show [fever_symptoms] AND set [requires_isolation] = true
 * ```
 *
 * **Validation Rules:**
 * - Required field validation
 * - Min/max length for text
 * - Min/max value for numbers
 * - Regex pattern matching
 * - Custom validation functions
 * - Cross-field validation (e.g., end date > start date)
 * - File type and size restrictions
 *
 * **Form Builder Workflow:**
 * 1. Enter form name and description
 * 2. Drag field types onto canvas
 * 3. Configure each field's properties
 * 4. Set up validation rules
 * 5. Add conditional logic if needed
 * 6. Organize into sections/pages
 * 7. Configure form settings (styling, notifications)
 * 8. Preview form as end-user would see it
 * 9. Test validation and logic
 * 10. Save as draft or publish immediately
 *
 * **Auto-Save Feature:**
 * - Form auto-saves every 30 seconds
 * - Draft saved to server and browser local storage
 * - Prevents data loss from browser crashes
 * - Visual indicator shows last saved time
 * - Manual save option always available
 *
 * **Form Settings:**
 * - Form title and description
 * - Submission confirmation message
 * - Email notifications on submission
 * - Allow multiple submissions per user
 * - Collect respondent email/name
 * - Anonymous submissions allowed
 * - Form expiration date
 * - Custom thank you page URL
 *
 * @module app/forms/new
 * @requires next/Metadata - Next.js metadata type definitions
 * @requires @/components/forms/FormBuilder - Drag-and-drop form builder component
 * @requires @/components/LoadingSpinner - Loading state indicator
 *
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html|HIPAA Privacy Rule}
 */

import { Metadata } from 'next'
import { Suspense } from 'react'
import { LoadingSpinner } from '@/components'
import { FormBuilder } from '@/components/forms'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

/**
 * Page metadata for form creation interface.
 * Emphasizes form building capabilities in description.
 *
 * @type {Metadata}
 */
export const metadata: Metadata = {
  title: 'Create Form | White Cross',
  description: 'Build a new custom healthcare form'
}

/**
 * Force dynamic rendering for authentication and permission checks.
 * Ensures user has proper permissions before accessing form builder.
 *
 * @type {string}
 */
export const dynamic = "force-dynamic";

/**
 * Create New Form Page Component
 *
 * Server component that renders the form builder interface for creating new forms.
 * Provides a blank canvas with all form building tools and features available.
 *
 * **Form Creation Process:**
 * 1. User accesses /forms/new
 * 2. Authentication and permission verified
 * 3. Form builder loads with empty canvas
 * 4. User designs form with drag-and-drop
 * 5. Auto-save keeps draft up-to-date
 * 6. User previews and tests form
 * 7. User publishes form or saves draft
 * 8. Form available in forms library
 *
 * **Builder Features:**
 * - **Drag and Drop**: Intuitive field placement
 * - **Live Preview**: See form as users will see it
 * - **Validation Testing**: Test rules before publishing
 * - **Logic Builder**: Visual conditional logic editor
 * - **Templates**: Start from pre-built templates
 * - **Undo/Redo**: Revert changes easily
 * - **Responsive Design**: Form automatically mobile-friendly
 *
 * **Access Control:**
 * - Requires 'forms:create' permission
 * - Users can only see their own drafts
 * - Admin can see all forms
 * - Published forms visible to all with link
 *
 * **Performance Optimizations:**
 * - Builder interface code-split for faster initial load
 * - Field components lazy-loaded as needed
 * - Auto-save debounced to reduce API calls
 * - Preview rendered in isolated iframe
 * - Drag operations optimized for smooth UX
 *
 * @async
 * @function NewFormPage
 * @returns {Promise<JSX.Element>} The rendered form creation page
 *
 * @example
 * // School nurse creates daily health screening form
 * // 1. Navigate to /forms/new
 * // 2. Enter form title: "Daily COVID-19 Screening"
 * // 3. Drag "Text Input" field, label it "Student Name"
 * // 4. Drag "Number" field, label it "Temperature", add validation: must be 95-105
 * // 5. Drag "Radio" field, label it "Any symptoms?", options: Yes/No
 * // 6. Add conditional: IF symptoms = Yes, SHOW "Describe symptoms" text area
 * // 7. Add "Signature" field for parent signature
 * // 8. Preview form to test logic
 * // 9. Publish form
 * // 10. Share form link with parents
 *
 * @example
 * // Administrator creates medication consent form
 * // 1. Navigate to /forms/new
 * // 2. Start from "Medication Authorization" template
 * // 3. Customize fields for school requirements
 * // 4. Add student name, medication details fields
 * // 5. Add dosage, frequency, side effects fields
 * // 6. Add parent signature and provider signature fields
 * // 7. Configure email notification to nurse on submission
 * // 8. Test form submission flow
 * // 9. Publish form
 * // 10. Integrate with student profiles
 *
 * @security
 * - Form creation logged for audit trail
 * - Draft forms not publicly accessible
 * - PHI fields automatically flagged for encryption
 * - Form URLs use secure random identifiers
 */
export default async function NewFormPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        {/* Back navigation to forms library */}
        <Link
          href="/forms"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Forms
        </Link>

        <h1 className="text-2xl font-bold text-gray-900">Create New Form</h1>
        <p className="text-gray-600 mt-1">Design a custom form with drag-and-drop field builder</p>
      </div>

      {/*
        Suspense boundary for form builder component
        Loads builder interface asynchronously
        Shows spinner while initializing builder tools
      */}
      <Suspense fallback={<LoadingSpinner />}>
        <FormBuilder />
      </Suspense>
    </div>
  )
}
