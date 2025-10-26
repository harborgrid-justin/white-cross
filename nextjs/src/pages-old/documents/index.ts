/**
 * Documents Domain - Module Exports
 *
 * Centralized export module for the document management domain, providing
 * comprehensive document storage, versioning, signature workflows, and
 * compliance tracking for healthcare documentation.
 *
 * @module pages/documents
 *
 * @remarks
 * Domain Architecture:
 * - **Pages**: Document library and management dashboard
 * - **Components**: 60+ components for document workflows
 * - **Store**: Redux state with document metadata and versioning
 * - **Routes**: Document routing with granular permissions
 *
 * Document Management Features:
 * - Upload with drag-and-drop support
 * - Folder/category organization
 * - Version control and comparison
 * - Document preview (PDF, images, office docs)
 * - Full-text search with metadata filtering
 * - Bulk operations (upload, download, archive)
 * - Document sharing with permission controls
 * - Retention policy enforcement
 *
 * Signature Workflows:
 * - Electronic signature requests
 * - Multi-party signature support
 * - Signature verification and audit trail
 * - Consent form signing
 * - Legal document workflows
 *
 * Compliance Features:
 * - Document retention policies
 * - Automatic archiving based on retention rules
 * - Compliance report generation
 * - Audit trail for all document access
 * - HIPAA-compliant document storage
 * - Access control lists (ACL) per document
 *
 * Healthcare Context:
 * - Medical record attachments
 * - Medication authorization forms
 * - Immunization records
 * - Emergency contact forms
 * - Parent consent documents
 * - Treatment plans
 * - IEP/504 plan documents
 *
 * @example
 * ```typescript
 * // Import documents functionality
 * import {
 *   Documents,
 *   documentsRoutes,
 *   DocumentUpload,
 *   DocumentSigning,
 *   documentsThunks,
 *   selectDocumentsByStudent
 * } from '@/pages/documents';
 *
 * // Use in routing
 * <Route path="/documents/*" element={documentsRoutes} />
 *
 * // Upload document
 * dispatch(documentsThunks.create({
 *   name: 'Medication Authorization',
 *   type: 'MEDICAL_FORM',
 *   studentId: 'student-123',
 *   file: uploadedFile,
 *   tags: ['medication', 'parent-signed'],
 *   retentionYears: 7
 * }));
 *
 * // Request signature
 * dispatch(requestSignature({
 *   documentId: 'doc-456',
 *   signers: [{ email: 'parent@example.com', role: 'PARENT' }],
 *   deadline: '2025-02-01'
 * }));
 * ```
 *
 * @see {@link module:pages/documents/store} for state management
 * @see {@link module:pages/documents/components} for UI components
 * @see {@link module:types/documents} for type definitions
 */

// Documents domain exports
export { default as Documents } from './Documents';

// Components
export * from './components';

// Store
export * from './store';

// Routes
export { documentsRoutes } from './routes';
