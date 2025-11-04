// Central export file for all document mutation hooks
// This file maintains backward compatibility with existing imports

// Types
export * from './types';

// Document CRUD operations
export {
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
  useDuplicateDocument,
  useMoveDocument,
  useFavoriteDocument,
  useUnfavoriteDocument,
} from './useDocumentCRUDMutations';

// Document versioning
export {
  useUploadNewVersion,
} from './useDocumentVersionMutations';

// Category operations
export {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from './useCategoryMutations';

// Template operations
export {
  useCreateTemplate,
  useCreateFromTemplate,
} from './useTemplateMutations';

// Sharing operations
export {
  useCreateShare,
  useUpdateShare,
  useDeleteShare,
} from './useDocumentSharingMutations';

// Comment operations
export {
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
  useResolveComment,
} from './useCommentMutations';

// Bulk operations
export {
  useBulkDeleteDocuments,
  useBulkMoveDocuments,
  useExportDocuments,
} from './useBulkOperations';

// Upload operations
export {
  useDocumentUpload,
} from './useSingleUpload';

export {
  useBulkDocumentUpload,
} from './useBulkUpload';

export type { UploadOptions, UploadState } from './useDocumentUpload.types';
export { API_BASE_URL } from './useDocumentUpload.types';

// Combined mutations object for easy import (backward compatibility)
export const documentMutations = {
  // Document CRUD
  useCreateDocument: async () => (await import('./useDocumentCRUDMutations')).useCreateDocument,
  useUpdateDocument: async () => (await import('./useDocumentCRUDMutations')).useUpdateDocument,
  useDeleteDocument: async () => (await import('./useDocumentCRUDMutations')).useDeleteDocument,
  useDuplicateDocument: async () => (await import('./useDocumentCRUDMutations')).useDuplicateDocument,
  useMoveDocument: async () => (await import('./useDocumentCRUDMutations')).useMoveDocument,
  useFavoriteDocument: async () => (await import('./useDocumentCRUDMutations')).useFavoriteDocument,
  useUnfavoriteDocument: async () => (await import('./useDocumentCRUDMutations')).useUnfavoriteDocument,

  // Document versioning
  useUploadNewVersion: async () => (await import('./useDocumentVersionMutations')).useUploadNewVersion,

  // Category operations
  useCreateCategory: async () => (await import('./useCategoryMutations')).useCreateCategory,
  useUpdateCategory: async () => (await import('./useCategoryMutations')).useUpdateCategory,
  useDeleteCategory: async () => (await import('./useCategoryMutations')).useDeleteCategory,

  // Template operations
  useCreateTemplate: async () => (await import('./useTemplateMutations')).useCreateTemplate,
  useCreateFromTemplate: async () => (await import('./useTemplateMutations')).useCreateFromTemplate,

  // Sharing operations
  useCreateShare: async () => (await import('./useDocumentSharingMutations')).useCreateShare,
  useUpdateShare: async () => (await import('./useDocumentSharingMutations')).useUpdateShare,
  useDeleteShare: async () => (await import('./useDocumentSharingMutations')).useDeleteShare,

  // Comment operations
  useCreateComment: async () => (await import('./useCommentMutations')).useCreateComment,
  useUpdateComment: async () => (await import('./useCommentMutations')).useUpdateComment,
  useDeleteComment: async () => (await import('./useCommentMutations')).useDeleteComment,
  useResolveComment: async () => (await import('./useCommentMutations')).useResolveComment,

  // Bulk operations
  useBulkDeleteDocuments: async () => (await import('./useBulkOperations')).useBulkDeleteDocuments,
  useBulkMoveDocuments: async () => (await import('./useBulkOperations')).useBulkMoveDocuments,
  useExportDocuments: async () => (await import('./useBulkOperations')).useExportDocuments,
};
