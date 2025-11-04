/**
 * Document Zod schemas for form validation
 *
 * @module schemas/documents
 * @description Barrel export for all document management schemas including
 * uploads, folders, signatures, and templates.
 */

// Base document schemas
export {
  fileUploadSchema,
  bulkUploadSchema,
  documentMetadataSchema,
  documentSearchSchema,
  type FileUploadFormData,
  type BulkUploadFormData,
  type DocumentMetadataFormData,
  type DocumentSearchFormData,
} from './documents.base.schemas';

// Folder management
export {
  folderCreateSchema,
  folderUpdateSchema,
  folderPermissionSchema,
  documentShareSchema,
  versionRestoreSchema,
  type FolderCreateFormData,
  type FolderUpdateFormData,
  type FolderPermissionFormData,
  type DocumentShareFormData,
  type VersionRestoreFormData,
} from './documents.folders.schemas';

// Signature workflows
export {
  signatureWorkflowSchema,
  signatureCaptureSchema,
  signatureDeclineSchema,
  witnessSignatureSchema,
  parentalConsentSchema,
  type SignatureWorkflowFormData,
  type SignatureCaptureFormData,
  type SignatureDeclineFormData,
  type WitnessSignatureFormData,
  type ParentalConsentFormData,
} from './documents.signatures.schemas';

// Document templates
export {
  documentTemplateSchema,
  templateInstanceSchema,
  type DocumentTemplateFormData,
  type TemplateInstanceFormData,
} from './documents.templates.schemas';
