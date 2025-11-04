/**
 * Document Composite Hooks - Index
 *
 * Central export point for all document composite hooks. This file provides
 * backward compatibility by re-exporting all hooks from the modularized files.
 * Import from this index to access any document composite hook.
 *
 * @module hooks/domains/documents/composites
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 *
 * @remarks
 * **Module Organization:**
 * - Document Management: Core document management composites
 * - Category & Template: Category and template management composites
 * - Sharing & Search: Sharing and search functionality composites
 * - Dashboard & Analytics: Dashboard and analytics composites
 * - Bulk Operations: Bulk operation composites
 * - Signature Workflow: E-signature workflow composites
 *
 * **Usage:**
 * ```typescript
 * // Import individual hooks
 * import { useDocumentManagement, useDocumentDetailsComposite } from '@/hooks/domains/documents/composites';
 *
 * // Import all hooks
 * import * as documentComposites from '@/hooks/domains/documents/composites';
 * ```
 *
 * @see {@link useDocumentManagementComposites} for document management hooks
 * @see {@link useCategoryTemplateComposites} for category and template hooks
 * @see {@link useSharingSearchComposites} for sharing and search hooks
 * @see {@link useDashboardAnalyticsComposites} for dashboard and analytics hooks
 * @see {@link useBulkOperationsComposites} for bulk operation hooks
 * @see {@link useSignatureWorkflow} for signature workflow hooks
 */

// Document Management composites
export {
  useDocumentManagement,
  useDocumentDetailsComposite,
} from './useDocumentManagementComposites';

// Category and Template composites
export {
  useCategoryManagement,
  useTemplateManagement,
} from './useCategoryTemplateComposites';

// Sharing and Search composites
export {
  useDocumentSharing,
  useDocumentSearch,
} from './useSharingSearchComposites';

// Dashboard and Analytics composites
export {
  useRecentDocumentsComposite,
  useDocumentAnalyticsComposite,
} from './useDashboardAnalyticsComposites';

// Bulk Operations composites
export {
  useBulkDocumentOperations,
  useMultipleDocuments,
} from './useBulkOperationsComposites';

// Signature Workflow composites
export {
  useSignatureWorkflow,
  useCreateSignatureWorkflow,
  usePendingSignatures,
} from './useSignatureWorkflow';

// Signature API exports
export {
  signatureKeys,
  fetchWorkflow,
  createWorkflow,
  signDocument,
  declineSignature,
  cancelWorkflow,
  sendReminder,
  fetchPendingSignatures,
} from './signatureApi';

// Combined composites object for easy import
import { useDocumentManagement, useDocumentDetailsComposite } from './useDocumentManagementComposites';
import { useCategoryManagement, useTemplateManagement } from './useCategoryTemplateComposites';
import { useDocumentSharing, useDocumentSearch } from './useSharingSearchComposites';
import { useRecentDocumentsComposite, useDocumentAnalyticsComposite } from './useDashboardAnalyticsComposites';
import { useBulkDocumentOperations, useMultipleDocuments } from './useBulkOperationsComposites';
import { useSignatureWorkflow, useCreateSignatureWorkflow, usePendingSignatures } from './useSignatureWorkflow';

/**
 * Combined object containing all document composite hooks
 *
 * @remarks
 * This object provides a convenient way to access all composite hooks in one place.
 * It's useful for dependency injection or when you need to pass all composites to
 * a component or utility function.
 *
 * @example
 * ```typescript
 * import { documentComposites } from '@/hooks/domains/documents/composites';
 *
 * // Access individual hooks
 * const managementHook = documentComposites.useDocumentManagement;
 * const sharingHook = documentComposites.useDocumentSharing;
 * ```
 */
export const documentComposites = {
  useDocumentManagement,
  useDocumentDetailsComposite,
  useCategoryManagement,
  useTemplateManagement,
  useDocumentSharing,
  useDocumentSearch,
  useRecentDocumentsComposite,
  useDocumentAnalyticsComposite,
  useBulkDocumentOperations,
  useMultipleDocuments,
  useSignatureWorkflow,
  useCreateSignatureWorkflow,
  usePendingSignatures,
};
