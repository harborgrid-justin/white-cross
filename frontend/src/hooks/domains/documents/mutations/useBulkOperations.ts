import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { invalidateDocumentQueries, Document } from '../config';
import { mockDocumentMutationAPI } from './api';

/**
 * Hook for bulk deleting multiple documents
 */
export const useBulkDeleteDocuments = (
  options?: UseMutationOptions<void, Error, string[]>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.bulkDelete,
    onSuccess: (_, docIds) => {
      invalidateDocumentQueries(queryClient);
      toast.success(`${docIds.length} documents deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete documents: ${error.message}`);
    },
    ...options,
  });
};

/**
 * Hook for bulk moving multiple documents to a category
 */
export const useBulkMoveDocuments = (
  options?: UseMutationOptions<Document[], Error, { docIds: string[]; categoryId: string }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ docIds, categoryId }) => mockDocumentMutationAPI.bulkMove(docIds, categoryId),
    onSuccess: (_, { docIds }) => {
      invalidateDocumentQueries(queryClient);
      toast.success(`${docIds.length} documents moved successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to move documents: ${error.message}`);
    },
    ...options,
  });
};

/**
 * Hook for exporting multiple documents
 */
export const useExportDocuments = (
  options?: UseMutationOptions<{ downloadUrl: string }, Error, { docIds: string[]; format: 'PDF' | 'ZIP' }>
) => {
  return useMutation({
    mutationFn: ({ docIds, format }) => mockDocumentMutationAPI.exportDocuments(docIds, format),
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
    ...options,
  });
};
