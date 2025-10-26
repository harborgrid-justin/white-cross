/**
 * Documents Store - Export Module
 *
 * Centralized re-export point for all document management Redux state.
 * Provides comprehensive document storage, versioning, signature workflows,
 * and compliance tracking for healthcare documentation.
 *
 * @module pages/documents/store
 *
 * @remarks
 * This module exports document state management for:
 * - **Document Library**: Upload, organize, and search documents
 * - **Version Control**: Track document versions and changes
 * - **Signatures**: Electronic signature workflows
 * - **Sharing**: Permission-based document sharing
 * - **Archives**: Retention policy and archiving
 * - **Templates**: Document templates and generation
 *
 * Document Management Features:
 * - Drag-and-drop upload with progress tracking
 * - Folder/category organization
 * - Full-text search with metadata filtering
 * - Document preview (PDF, images, Office docs)
 * - Version comparison and rollback
 * - Bulk operations (upload, download, archive)
 * - Access control lists per document
 *
 * Signature Workflows:
 * - Electronic signature requests
 * - Multi-party signature coordination
 * - Signature verification and timestamps
 * - Consent form signing
 * - Legal document workflows
 * - Signature audit trail
 *
 * Compliance & Security:
 * - Document retention policies
 * - Automatic archiving by retention rules
 * - HIPAA-compliant storage encryption
 * - Access audit logging
 * - Version history preservation
 * - Compliance report generation
 *
 * Healthcare Document Types:
 * - Medical records and attachments
 * - Medication authorization forms
 * - Immunization records
 * - Emergency contact forms
 * - Parent consent documents
 * - Treatment plans and protocols
 * - IEP/504 plan documents
 * - Insurance cards and authorizations
 *
 * @example
 * ```typescript
 * // Import documents store
 * import {
 *   documentsSlice,
 *   documentsThunks,
 *   documentsSelectors,
 *   documentsActions,
 *   selectDocumentsByStudent
 * } from '@/pages/documents/store';
 *
 * // Upload medical document
 * dispatch(documentsThunks.create({
 *   name: 'Medication Authorization Form',
 *   type: 'MEDICAL_FORM',
 *   studentId: 'student-123',
 *   file: uploadedFile,
 *   tags: ['medication', 'parent-signed', 'epipen'],
 *   retentionYears: 7,
 *   requiresSignature: false
 * }));
 *
 * // Request signature on consent form
 * dispatch(requestSignature({
 *   documentId: 'doc-456',
 *   signers: [
 *     { email: 'parent@example.com', role: 'PARENT', name: 'Jane Doe' }
 *   ],
 *   deadline: '2025-02-15',
 *   message: 'Please review and sign the field trip consent form'
 * }));
 *
 * // Get student documents
 * const studentDocs = useSelector(state =>
 *   selectDocumentsByStudent(state, 'student-123')
 * );
 *
 * // Search documents
 * dispatch(documentsThunks.fetchAll({
 *   search: 'immunization',
 *   type: 'MEDICAL_RECORD',
 *   tags: ['2024-2025'],
 *   studentId: 'student-123'
 * }));
 * ```
 *
 * @see {@link module:pages/documents/store/documentsSlice} for implementation
 * @see {@link module:services/modules/documentsApi} for API integration
 * @see {@link module:types/documents} for type definitions
 */

// Documents store exports
export * from './documentsSlice';
