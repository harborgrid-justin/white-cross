import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { invalidateDocumentQueries, Document } from '../config';
import { serverDelete, serverPost } from '@/lib/api/client';
import { DOCUMENTS_ENDPOINTS } from '@/constants/api/communications';
import { useApiError } from '@/hooks/shared/useApiError';

/**
 * Hook for bulk deleting multiple documents
 * TODO: Backend endpoint needed - /api/v1/documents/bulk/delete
 */
export const useBulkDeleteDocuments = (
  options?: UseMutationOptions<void, Error, string[]>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (docIds: string[]) => {
      try {
        // TODO: Replace with actual endpoint when implemented
        await serverDelete(`${DOCUMENTS_ENDPOINTS.BASE}/bulk/delete`, { ids: docIds });
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (_, docIds) => {
      invalidateDocumentQueries(queryClient);
      toast.success(`${docIds.length} documents deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete documents: ${error.message}`);
    },
    meta: {
      errorMessage: 'Failed to bulk delete documents'
    },
    ...options,
  });
};

/**
 * Hook for bulk moving multiple documents to a category
 * TODO: Backend endpoint needed - /api/v1/documents/bulk/move
 */
export const useBulkMoveDocuments = (
  options?: UseMutationOptions<Document[], Error, { docIds: string[]; categoryId: string }>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async ({ docIds, categoryId }) => {
      try {
        // TODO: Replace with actual endpoint when implemented
        return await serverPost(`${DOCUMENTS_ENDPOINTS.BASE}/bulk/move`, { ids: docIds, categoryId });
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (_, { docIds }) => {
      invalidateDocumentQueries(queryClient);
      toast.success(`${docIds.length} documents moved successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to move documents: ${error.message}`);
    },
    meta: {
      errorMessage: 'Failed to bulk move documents'
    },
    ...options,
  });
};

/**
 * Hook for exporting multiple documents
 * TODO: Backend endpoint needed - /api/v1/documents/export
 */
export const useExportDocuments = (
  options?: UseMutationOptions<{ downloadUrl: string }, Error, { docIds: string[]; format: 'PDF' | 'ZIP' }>
) => {
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async ({ docIds, format }) => {
      try {
        // TODO: Replace with actual endpoint when implemented
        return await serverPost(`${DOCUMENTS_ENDPOINTS.BASE}/export`, { ids: docIds, format });
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (result, { docIds, format }) => {
      // Trigger download
      const link = document.createElement('a');
      link.href = result.downloadUrl;
      link.download = `documents-export.${format.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`${docIds.length} documents exported successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to export documents: ${error.message}`);
    },
    meta: {
      errorMessage: 'Failed to export documents'
    },
    ...options,
  });
};
