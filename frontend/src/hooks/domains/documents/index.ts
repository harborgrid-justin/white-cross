// Documents Domain - Main Export
// This file serves as the main entry point for all documents-related hooks

// Configuration and Types
export * from './config';

// Query Hooks
export {
  useDocuments,
  useDocumentDetails,
  useDocumentVersions,
  useSearchDocuments,
  useRecentDocuments,
  useFavoriteDocuments,
  useSharedWithMe,
  useCategories,
  useCategoryDetails,
  useCategoryDocuments,
  useTemplates,
  useTemplateDetails,
  usePopularTemplates,
  useDocumentShares,
  useShareDetails,
  useShareByToken,
  useDocumentActivity,
  useDocumentComments,
  useDocumentAnalytics,
  useDocumentsDashboard,
  useDocumentOverview,
} from './queries/useDocumentQueries';

// Mutation Hooks
export {
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
  useDuplicateDocument,
  useUploadNewVersion,
  useFavoriteDocument,
  useUnfavoriteDocument,
  useMoveDocument,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useCreateTemplate,
  useCreateFromTemplate,
  useCreateShare,
  useUpdateShare,
  useDeleteShare,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
  useResolveComment,
  useBulkDeleteDocuments,
  useBulkMoveDocuments,
  useExportDocuments,
  documentMutations,
} from './mutations/useDocumentMutations';

// Upload Hooks
export {
  useDocumentUpload,
  useBulkDocumentUpload,
} from './mutations/useDocumentUpload';
export type { UploadOptions, UploadState } from './mutations/useDocumentUpload.types';
export { getClientApiBaseUrl } from './mutations/useDocumentUpload.types';

// Composite Hooks
export {
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
  documentComposites,
} from './composites/useDocumentComposites';

// Signature Workflow Hooks
export {
  useSignatureWorkflow,
  useCreateSignatureWorkflow,
  usePendingSignatures,
  signatureKeys,
  fetchWorkflow,
  createWorkflow,
  signDocument,
  declineSignature,
  cancelWorkflow,
  sendReminder,
  fetchPendingSignatures,
} from './composites/useSignatureWorkflow';

// Domain-specific utilities and constants
export const DOCUMENTS_DOMAIN = 'documents';

// Quick access patterns
export const documentsHooks = {
  // Queries
  queries: {
    useDocuments,
    useDocumentDetails,
    useDocumentVersions,
    useSearchDocuments,
    useRecentDocuments,
    useFavoriteDocuments,
    useSharedWithMe,
    useCategories,
    useCategoryDetails,
    useCategoryDocuments,
    useTemplates,
    useTemplateDetails,
    usePopularTemplates,
    useDocumentShares,
    useShareDetails,
    useShareByToken,
    useDocumentActivity,
    useDocumentComments,
    useDocumentAnalytics,
    useDocumentsDashboard,
    useDocumentOverview,
  },
  
  // Mutations
  mutations: {
    useCreateDocument,
    useUpdateDocument,
    useDeleteDocument,
    useDuplicateDocument,
    useUploadNewVersion,
    useFavoriteDocument,
    useUnfavoriteDocument,
    useMoveDocument,
    useCreateCategory,
    useUpdateCategory,
    useDeleteCategory,
    useCreateTemplate,
    useCreateFromTemplate,
    useCreateShare,
    useUpdateShare,
    useDeleteShare,
    useCreateComment,
    useUpdateComment,
    useDeleteComment,
    useResolveComment,
    useBulkDeleteDocuments,
    useBulkMoveDocuments,
    useExportDocuments,
  },
  
  // Composites
  composites: {
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
  }
};

// Re-export individual imports to avoid conflicts
import {
  useDocuments,
  useDocumentDetails,
  useDocumentVersions,
  useSearchDocuments,
  useRecentDocuments,
  useFavoriteDocuments,
  useSharedWithMe,
  useCategories,
  useCategoryDetails,
  useCategoryDocuments,
  useTemplates,
  useTemplateDetails,
  usePopularTemplates,
  useDocumentShares,
  useShareDetails,
  useShareByToken,
  useDocumentActivity,
  useDocumentComments,
  useDocumentAnalytics,
  useDocumentsDashboard,
  useDocumentOverview,
} from './queries/useDocumentQueries';

import {
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
  useDuplicateDocument,
  useUploadNewVersion,
  useFavoriteDocument,
  useUnfavoriteDocument,
  useMoveDocument,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useCreateTemplate,
  useCreateFromTemplate,
  useCreateShare,
  useUpdateShare,
  useDeleteShare,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
  useResolveComment,
  useBulkDeleteDocuments,
  useBulkMoveDocuments,
  useExportDocuments,
} from './mutations/useDocumentMutations';

import {
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
} from './composites/useDocumentComposites';
