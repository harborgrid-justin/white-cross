import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { DOCUMENTS_QUERY_KEYS, Document } from '../config';
import { serverPost } from '@/lib/api/client';
import { DOCUMENTS_ENDPOINTS } from '@/constants/api/communications';
import { useApiError } from '@/hooks/shared/useApiError';

/**
 * Hook for uploading a new version of a document
 * TODO: Backend endpoint needed - /api/v1/documents/:id/versions
 */
export const useUploadNewVersion = (
  options?: UseMutationOptions<Document, Error, { docId: string; file: File; changes: string }>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async ({ docId, file, changes }) => {
      try {
        // TODO: Replace with actual endpoint when implemented
        const formData = new FormData();
        formData.append('file', file);
        formData.append('changes', changes);
        return await serverPost(`${DOCUMENTS_ENDPOINTS.BASE}/${docId}/versions`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (_, { docId }) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.documentDetails(docId) });
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.documentVersions(docId) });
      toast.success('New version uploaded successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload new version: ${error.message}`);
    },
    meta: {
      errorMessage: 'Failed to upload new document version'
    },
    ...options,
  });
};
