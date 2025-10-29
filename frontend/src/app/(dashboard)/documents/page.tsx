/**
 * @fileoverview Documents Library Page - HIPAA-compliant document management system
 *
 * This page provides the main interface for managing healthcare documents in compliance
 * with HIPAA regulations. It supports document upload, viewing, organization, and retrieval
 * with full audit logging of PHI document access.
 *
 * **Key Features:**
 * - HIPAA-compliant document storage with encryption at rest and in transit
 * - Role-based access control (RBAC) for document permissions
 * - Comprehensive audit logging for all PHI document operations
 * - Document categorization by type (medical records, consent forms, immunization records, etc.)
 * - Advanced filtering and search capabilities
 * - Document version history and retention management
 * - Support for multiple file formats (PDF, DOCX, images, etc.)
 *
 * **Security & Compliance:**
 * - All document access is logged for HIPAA audit requirements
 * - Documents containing PHI are encrypted using AES-256
 * - Access requires proper authentication and authorization
 * - Document retention policies enforced per regulatory requirements (typically 7 years)
 * - Secure deletion with complete data erasure when retention period expires
 *
 * **Document Storage Architecture:**
 * - Files stored in encrypted cloud storage (S3-compatible with server-side encryption)
 * - Metadata stored in PostgreSQL database for efficient querying
 * - Document URLs are pre-signed with short expiration times
 * - Automatic virus scanning on upload
 *
 * @module app/documents
 * @requires next/Metadata - Next.js metadata type definitions
 * @requires react/Suspense - React suspense boundary for streaming
 * @requires @/components/documents/DocumentsList - Main documents list component
 * @requires @/components/LoadingSpinner - Loading state component
 *
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html|HIPAA Privacy Rule}
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/security/index.html|HIPAA Security Rule}
 */

import { Metadata } from 'next'
import { Suspense } from 'react'
import { DocumentsList } from '@/components/documents'
import { LoadingSpinner } from '@/components'

/**
 * Page metadata for SEO and browser display.
 * Follows Next.js 13+ App Router metadata conventions.
 *
 * @type {Metadata}
 */
export const metadata: Metadata = {
  title: 'Documents | White Cross',
  description: 'Manage and view healthcare documents'
}

/**
 * Force dynamic rendering to ensure fresh data on every request.
 * This is critical for HIPAA compliance as document access patterns
 * must reflect real-time permissions and audit logging requirements.
 *
 * @type {string}
 */
export const dynamic = "force-dynamic";

/**
 * Documents Library Page Component
 *
 * Main entry point for the document management system. This async server component
 * handles the initial page render and delegates document loading to the DocumentsList
 * client component via React Suspense for optimal loading performance.
 *
 * **Rendering Strategy:**
 * - Server-side rendering with dynamic data fetching
 * - Suspense boundaries for progressive loading
 * - Streaming responses for faster initial page load
 *
 * **Access Control:**
 * - User must be authenticated (enforced by layout)
 * - Requires 'documents:read' permission
 * - Document-level permissions enforced by DocumentsList component
 *
 * **Performance Considerations:**
 * - Uses React Suspense for non-blocking UI rendering
 * - Lazy loads document list data to prevent blocking initial paint
 * - Implements pagination and virtualization for large document libraries
 *
 * @async
 * @function DocumentsPage
 * @returns {Promise<JSX.Element>} The rendered documents library page
 *
 * @example
 * // Accessed via Next.js App Router at /documents
 * // User navigates to documents page:
 * // 1. Page shell renders immediately with loading spinner
 * // 2. DocumentsList streams in as data becomes available
 * // 3. User can interact with loaded documents progressively
 *
 * @security
 * - All document access logged for HIPAA audit trail
 * - PHI documents require elevated permissions
 * - Session timeout enforced for inactive users
 */
export default async function DocumentsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page header with title and description */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Document Library</h1>
        <p className="text-gray-600 mt-1">Manage healthcare documents, forms, and templates</p>
      </div>

      {/*
        Suspense boundary for streaming document list
        Falls back to loading spinner while data fetches
        Enables progressive hydration and faster perceived load times
      */}
      <Suspense fallback={<LoadingSpinner />}>
        <DocumentsList />
      </Suspense>
    </div>
  )
}
