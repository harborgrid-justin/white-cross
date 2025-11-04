/**
 * @fileoverview Document Templates Library - Reusable healthcare document templates
 *
 * This page manages document templates that streamline the creation of standardized
 * healthcare documents such as consent forms, medical release forms, treatment plans,
 * and other frequently used documents. Templates support variable substitution for
 * patient-specific information while maintaining consistent formatting and legal language.
 *
 * **Key Features:**
 * - Pre-built templates for common healthcare documents
 * - Custom template creation with rich text editing
 * - Variable placeholders for patient/provider data merge
 * - Template versioning and revision history
 * - Template categorization and tagging for easy discovery
 * - Template sharing across organization with permissions
 * - Template usage analytics and tracking
 *
 * **Template Variable System:**
 * - Merge fields: {{patient.name}}, {{patient.dob}}, {{provider.name}}
 * - Conditional sections: {{#if patient.allergies}}...{{/if}}
 * - Loops for repeating data: {{#each medications}}...{{/each}}
 * - Date formatting: {{date patient.dob format="MM/DD/YYYY"}}
 * - Computed fields: {{age patient.dob}}, {{fullAddress patient}}
 *
 * **Common Template Types:**
 * - Consent forms (treatment, photography, field trip)
 * - Medical release forms (records, emergency treatment)
 * - Treatment plans and care plans
 * - Immunization records and certificates
 * - Medication administration authorization
 * - Health screening forms
 * - Incident report templates
 * - Parent notification letters
 *
 * **Template Compliance:**
 * - Legal language reviewed by compliance team
 * - HIPAA-compliant data handling
 * - Audit logging for template modifications
 * - Version control prevents unauthorized changes
 * - Required fields validation before document generation
 *
 * **Template Lifecycle:**
 * 1. Create template with placeholders and formatting
 * 2. Define required and optional variables
 * 3. Set template metadata (category, tags, description)
 * 4. Review and approve (for official templates)
 * 5. Publish to template library
 * 6. Track usage and gather feedback
 * 7. Update and version as needed
 * 8. Archive outdated templates
 *
 * @module app/documents/templates
 * @requires next/Metadata - Next.js metadata type definitions
 * @requires @/components/documents/DocumentTemplatesList - Templates list component
 * @requires @/components/LoadingSpinner - Loading indicator
 *
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html|HIPAA Privacy Rule}
 */

import { Metadata } from 'next'
import { Suspense } from 'react'
import { Spinner } from '@/components'
import { DocumentTemplatesList } from '@/components/documents'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'

/**
 * Page metadata for document templates library.
 * Optimized for search engine indexing and browser display.
 *
 * @type {Metadata}
 */
export const metadata: Metadata = {
  title: 'Document Templates | White Cross',
  description: 'Manage reusable document templates'
}

/**
 * Force dynamic rendering for real-time template list updates.
 * Ensures users always see the latest template versions and availability.
 *
 * @type {string}
 */


/**
 * Document Templates Library Page Component
 *
 * Displays a comprehensive list of available document templates with search, filtering,
 * and categorization. Users can preview templates, create new ones, or generate documents
 * from existing templates with variable substitution.
 *
 * **Template Management Features:**
 * - Search templates by name, description, or tags
 * - Filter by category (consent, release, authorization, etc.)
 * - Sort by name, usage count, or last modified date
 * - Preview template before use
 * - Duplicate template for customization
 * - Archive unused templates
 * - Restore archived templates
 *
 * **Access Control:**
 * - All users can view approved templates
 * - Template creation requires 'templates:create' permission
 * - Template editing requires 'templates:edit' permission
 * - Template deletion requires 'templates:delete' permission
 * - Admin approval required for official templates
 *
 * **Template Categories:**
 * - **Consent Forms**: Treatment consent, photo release, field trip authorization
 * - **Medical Release**: Records release, emergency treatment authorization
 * - **Administration**: Medication forms, treatment plans, care plans
 * - **Screening**: Health assessments, immunization records
 * - **Communication**: Parent letters, notifications, reminders
 * - **Incident Reports**: Injury reports, illness documentation
 *
 * **Performance Optimizations:**
 * - Template thumbnails cached for fast preview display
 * - Lazy loading for large template libraries
 * - Pagination to limit initial data transfer
 * - Search implemented with debouncing
 *
 * @async
 * @function DocumentTemplatesPage
 * @returns {Promise<JSX.Element>} The rendered templates library page
 *
 * @example
 * // School nurse accesses template library
 * // 1. Navigate to /documents/templates
 * // 2. Search for "medication authorization"
 * // 3. Preview template to verify content
 * // 4. Click "Use Template" to generate document
 * // 5. Fill in patient-specific variables
 * // 6. Generate final document from template
 *
 * @example
 * // Administrator creates new template
 * // 1. Click "New Template" button
 * // 2. Navigate to template editor
 * // 3. Design template with rich text editor
 * // 4. Add variable placeholders for patient data
 * // 5. Set category, tags, and description
 * // 6. Save template to library
 * // 7. Submit for approval if required
 */
export default async function DocumentTemplatesPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page header with navigation and actions */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          {/* Back navigation to main documents page */}
          <Link
            href="/documents"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documents
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Document Templates</h1>
          <p className="text-gray-600 mt-1">Create and manage reusable document templates</p>
        </div>

        {/* Create new template action */}
        <Link
          href="/documents/templates/new/edit"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Link>
      </div>

      {/*
        Suspense boundary for templates list
        Enables progressive loading of template data
        Shows spinner while fetching from API
      */}
      <Suspense fallback={<Spinner />}>
        <DocumentTemplatesList />
      </Suspense>
    </div>
  )
}
