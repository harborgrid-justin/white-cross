/**
 * @fileoverview Form Builder Library - Custom healthcare forms management system
 *
 * This page provides a comprehensive form builder library for creating, managing, and
 * deploying custom healthcare forms. Forms support drag-and-drop field creation, conditional
 * logic, data validation, and HIPAA-compliant data collection with full audit trails.
 *
 * **Key Features:**
 * - Drag-and-drop form builder interface
 * - Pre-built healthcare form templates
 * - Custom field types (text, dropdown, checkbox, date, signature, etc.)
 * - Conditional logic and field dependencies
 * - Real-time form validation rules
 * - Multi-page forms with progress tracking
 * - Auto-save functionality
 * - Form versioning and revision history
 * - Response collection and analytics
 * - Export responses to CSV/Excel
 *
 * **Form Builder Capabilities:**
 * - **Field Types**: Text, textarea, number, email, phone, date, time, dropdown, radio, checkbox, file upload, signature
 * - **Validation**: Required fields, min/max length, pattern matching, custom validators
 * - **Logic**: Show/hide fields based on conditions, calculated fields, dynamic dropdowns
 * - **Layout**: Single column, multi-column, sections with headers, page breaks
 * - **Styling**: Custom colors, fonts, spacing, branding options
 *
 * **Common Form Use Cases:**
 * - Patient intake forms
 * - Health screening questionnaires
 * - Medication consent forms
 * - Incident report forms
 * - Parent permission forms
 * - Health history forms
 * - Allergy documentation
 * - Emergency contact forms
 * - Immunization consent
 * - Field trip authorization
 *
 * **Form Lifecycle:**
 * 1. Create form with drag-and-drop builder
 * 2. Configure fields, validation, and logic
 * 3. Preview and test form
 * 4. Publish form (generates unique URL)
 * 5. Distribute form link to users
 * 6. Collect responses in real-time
 * 7. View and export response data
 * 8. Archive form when no longer needed
 *
 * **Data Collection & Storage:**
 * - Responses stored encrypted in PostgreSQL
 * - PHI data flagged and protected per HIPAA
 * - Each response timestamped with submission details
 * - IP address and user agent captured for audit
 * - File uploads stored in encrypted cloud storage
 * - Response data indexed for reporting and search
 *
 * **HIPAA Compliance:**
 * - All PHI responses encrypted at rest (AES-256)
 * - Audit logging for all form access and submissions
 * - Access controls limit who can view responses
 * - Automatic data retention policy enforcement
 * - Secure form URLs with optional password protection
 * - Anonymous submission option for sensitive forms
 *
 * **Form Analytics:**
 * - View count and submission rate
 * - Average completion time
 * - Drop-off analysis (which fields cause abandonment)
 * - Response trends over time
 * - Field-level completion rates
 * - Common validation errors
 *
 * @module app/forms
 * @requires next/Metadata - Next.js metadata type definitions
 * @requires @/components/forms/FormBuilderList - Form list component
 * @requires @/components/LoadingSpinner - Loading indicator
 *
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html|HIPAA Privacy Rule}
 */

import { Metadata } from 'next'
import { Suspense } from 'react'
import { LoadingSpinner } from '@/components'
import { FormBuilderList } from '@/components/forms'
import Link from 'next/link'
import { Plus } from 'lucide-react'

/**
 * Page metadata for form builder library.
 * Optimized for search engines and browser display.
 *
 * @type {Metadata}
 */
export const metadata: Metadata = {
  title: 'Form Builder | White Cross',
  description: 'Create and manage custom healthcare forms'
}

/**
 * Force dynamic rendering to ensure form list is always fresh.
 * Critical for showing latest form submissions and status updates.
 *
 * @type {string}
 */
export const dynamic = 'force-dynamic';

/**
 * Form Builder Library Page Component
 *
 * Main entry point for the custom forms system. Displays a list of all forms with
 * search, filtering, and quick actions. Users can create new forms, edit existing ones,
 * view responses, and manage form lifecycle.
 *
 * **Form Management Features:**
 * - Search forms by name or description
 * - Filter by status (draft, published, archived)
 * - Sort by name, creation date, or submission count
 * - Quick preview of form structure
 * - Duplicate forms for rapid creation
 * - Bulk operations (publish, archive, delete)
 * - Form analytics dashboard
 *
 * **Form List Display:**
 * Each form card shows:
 * - Form name and description
 * - Status badge (draft, published, archived)
 * - Response count
 * - Last modified date
 * - Quick actions (edit, view responses, share link)
 * - Form thumbnail preview
 *
 * **Access Control:**
 * - All users can view published forms
 * - Form creation requires 'forms:create' permission
 * - Form editing requires 'forms:edit' permission
 * - Response viewing requires 'forms:viewResponses' permission
 * - Form deletion requires 'forms:delete' permission
 *
 * **Form Status States:**
 * - **Draft**: Form being created/edited, not accepting responses
 * - **Published**: Live form accepting responses
 * - **Paused**: Temporarily not accepting responses (can resume)
 * - **Archived**: Completed form, no longer accepting responses
 *
 * **Performance Optimizations:**
 * - Pagination for large form libraries
 * - Lazy loading of form thumbnails
 * - Cached response counts
 * - Debounced search
 * - Virtual scrolling for 100+ forms
 *
 * @async
 * @function FormsPage
 * @returns {Promise<JSX.Element>} The rendered form builder library page
 *
 * @example
 * // School nurse creates health screening form
 * // 1. Navigate to /forms
 * // 2. Click "Create Form" button
 * // 3. Enter form name: "Daily Health Screening"
 * // 4. Add fields: temperature, symptoms, exposure questions
 * // 5. Configure validation rules
 * // 6. Preview form
 * // 7. Publish form
 * // 8. Share form link with staff
 * // 9. Monitor responses in real-time
 *
 * @example
 * // Administrator reviews all forms
 * // 1. Navigate to /forms
 * // 2. Filter by status: "Published"
 * // 3. Sort by submission count (highest first)
 * // 4. Review high-volume forms for optimization
 * // 5. Archive completed forms
 * // 6. Export response data for reporting
 */
export default async function FormsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page header with title and create action */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Form Builder</h1>
          <p className="text-gray-600 mt-1">Create and manage custom healthcare forms with drag-and-drop</p>
        </div>

        {/* Create new form action button */}
        <Link
          href="/forms/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Form
        </Link>
      </div>

      {/*
        Suspense boundary for form list
        Enables progressive loading of form data
        Shows spinner while fetching from API
      */}
      <Suspense fallback={<LoadingSpinner />}>
        <FormBuilderList />
      </Suspense>
    </div>
  )
}
