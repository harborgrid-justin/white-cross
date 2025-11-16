/**
 * Document Mutations - Main Export
 *
 * This file maintains backward compatibility by re-exporting all mutation hooks from
 * the modularized mutation files. The original file has been broken down into smaller,
 * focused modules for better maintainability.
 *
 * @module hooks/domains/documents/mutations/useDocumentMutations
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 *
 * @remarks
 * **Module Organization:**
 * - `useDocumentCRUDMutations.ts` - Core CRUD operations (create, update, delete, duplicate, move, favorite)
 * - `useDocumentVersionMutations.ts` - Version management (upload new version)
 * - `useCategoryMutations.ts` - Category operations (create, update, delete)
 * - `useTemplateMutations.ts` - Template operations (create, create from template)
 * - `useDocumentSharingMutations.ts` - Sharing operations (create, update, delete share)
 * - `useCommentMutations.ts` - Comment operations (create, update, delete, resolve)
 * - `useBulkOperations.ts` - Bulk operations (bulk delete, bulk move, export)
 *
 * @example
 * ```typescript
 * import {
 *   useCreateDocument,
 *   useUpdateDocument,
 *   useDeleteDocument
 * } from '@/hooks/domains/documents/mutations/useDocumentMutations';
 *
 * // In your component
 * const createMutation = useCreateDocument();
 * const updateMutation = useUpdateDocument();
 * const deleteMutation = useDeleteDocument();
 * ```
 */

// Re-export types
export * from './types';

// Re-export Document CRUD hooks
export {
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
  useDuplicateDocument,
  useMoveDocument,
  useFavoriteDocument,
  useUnfavoriteDocument,
} from './useDocumentCRUDMutations';

// Re-export Document versioning hooks
export {
  useUploadNewVersion,
} from './useDocumentVersionMutations';

// Re-export Category mutation hooks
export {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from './useCategoryMutations';

// Re-export Template mutation hooks
export {
  useCreateTemplate,
  useCreateFromTemplate,
} from './useTemplateMutations';

// Re-export Sharing mutation hooks
export {
  useCreateShare,
  useUpdateShare,
  useDeleteShare,
} from './useDocumentSharingMutations';

// Re-export Comment mutation hooks
export {
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
  useResolveComment,
} from './useCommentMutations';

// Re-export Bulk operation hooks
export {
  useBulkDeleteDocuments,
  useBulkMoveDocuments,
  useExportDocuments,
} from './useBulkOperations';

// Re-export Upload hooks
export type { UploadOptions, UploadState } from './useDocumentUpload.types';
export { getClientApiBaseUrl } from './useDocumentUpload.types';
export { useDocumentUpload } from './useSingleUpload';
export { useBulkDocumentUpload } from './useBulkUpload';

// Combined mutations object for easy import (backward compatibility)
// Import all hooks to create the object
import {
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
  useDuplicateDocument,
  useMoveDocument,
  useFavoriteDocument,
  useUnfavoriteDocument,
} from './useDocumentCRUDMutations';

import {
  useUploadNewVersion,
} from './useDocumentVersionMutations';

import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from './useCategoryMutations';

import {
  useCreateTemplate,
  useCreateFromTemplate,
} from './useTemplateMutations';

import {
  useCreateShare,
  useUpdateShare,
  useDeleteShare,
} from './useDocumentSharingMutations';

import {
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
  useResolveComment,
} from './useCommentMutations';

import {
  useBulkDeleteDocuments,
  useBulkMoveDocuments,
  useExportDocuments,
} from './useBulkOperations';

/**
 * Combined object containing all document mutation hooks
 *
 * @remarks
 * This object provides a convenient way to access all mutation hooks in one place.
 * It's useful for dependency injection or when you need to pass all mutations to
 * a component or utility function.
 *
 * @example
 * ```typescript
 * import { documentMutations } from '@/hooks/domains/documents/mutations/useDocumentMutations';
 *
 * // Access individual hooks
 * const createHook = documentMutations.useCreateDocument;
 * const updateHook = documentMutations.useUpdateDocument;
 * ```
 */
export const documentMutations = {
  // Document CRUD
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
  useDuplicateDocument,
  useMoveDocument,
  useFavoriteDocument,
  useUnfavoriteDocument,

  // Document versioning
  useUploadNewVersion,

  // Category operations
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,

  // Template operations
  useCreateTemplate,
  useCreateFromTemplate,

  // Sharing operations
  useCreateShare,
  useUpdateShare,
  useDeleteShare,

  // Comment operations
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
  useResolveComment,

  // Bulk operations
  useBulkDeleteDocuments,
  useBulkMoveDocuments,
  useExportDocuments,
};

/**
 * Backward Compatibility Notes:
 *
 * This file now serves as a re-export hub to maintain backward compatibility
 * with existing imports. All functionality has been preserved and moved to
 * smaller, more focused files.
 *
 * **Before (1173 LOC):**
 * - Single large file with all hooks and API functions
 * - Difficult to navigate and maintain
 * - Hard to find specific functionality
 *
 * **After (Modularized):**
 * - useDocumentCRUDMutations.ts - Core CRUD operations
 * - useDocumentVersionMutations.ts - Version management
 * - useCategoryMutations.ts - Category operations
 * - useTemplateMutations.ts - Template operations
 * - useDocumentSharingMutations.ts - Sharing operations
 * - useCommentMutations.ts - Comment operations
 * - useBulkOperations.ts - Bulk operations
 * - useDocumentMutations.ts (this file) - Re-exports for compatibility
 *
 * **Migration Path:**
 * - Existing imports continue to work without changes
 * - New code can import from specific files for clarity
 * - All hooks have identical signatures and behavior
 * - No breaking changes to API or functionality
 *
 * **Benefits:**
 * - Better code organization and maintainability
 * - Easier to locate specific hooks
 * - Reduced cognitive load when reading code
 * - Clearer separation of concerns
 * - Better tree-shaking for production builds
 */
