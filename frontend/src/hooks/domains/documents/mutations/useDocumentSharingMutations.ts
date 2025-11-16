import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { DOCUMENTS_QUERY_KEYS, invalidateShareQueries, DocumentShare } from '../config';
import { serverPost, serverPut, serverDelete } from '@/lib/api/client';
import { useApiError } from '@/hooks/shared/useApiError';
import type { CreateShareInput, UpdateShareInput } from './types';

/**
 * Hook for creating a document share
 * TODO: Backend endpoint needed - /api/v1/documents/:id/shares
 */
export const useCreateShare = (
  options?: UseMutationOptions<DocumentShare, Error, CreateShareInput>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (data: CreateShareInput) => {
      try {
        // TODO: Replace with actual endpoint when implemented
        return await serverPost(`${DOCUMENTS_ENDPOINTS.BASE}/${data.documentId}/shares`, data);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (newShare) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.sharesList(newShare.documentId) });
      toast.success('Document shared successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to share document: ${error.message}`);
    },
    meta: {
      errorMessage: 'Failed to create document share'
    },
    ...options,
  });
};

/**
 * Hook for updating an existing share
 * TODO: Backend endpoint needed - /api/v1/documents/shares/:id
 */
export const useUpdateShare = (
  options?: UseMutationOptions<DocumentShare, Error, UpdateShareInput>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (data: UpdateShareInput) => {
      try {
        // TODO: Replace with actual endpoint when implemented
        return await serverPut(`${DOCUMENTS_ENDPOINTS.BASE}/shares/${data.id}`, data);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (updatedShare) => {
      queryClient.setQueryData(
        DOCUMENTS_QUERY_KEYS.shareDetails(updatedShare.id),
        updatedShare
      );
      invalidateShareQueries(queryClient);
      toast.success('Share settings updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update share: ${error.message}`);
    },
    meta: {
      errorMessage: 'Failed to update document share'
    },
    ...options,
  });
};

/**
 * Hook for deleting a share
 * TODO: Backend endpoint needed - /api/v1/documents/shares/:id
 */
export const useDeleteShare = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (shareId: string) => {
      try {
        // TODO: Replace with actual endpoint when implemented
        await serverDelete(`${DOCUMENTS_ENDPOINTS.BASE}/shares/${shareId}`);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: () => {
      invalidateShareQueries(queryClient);
      toast.success('Share removed successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove share: ${error.message}`);
    },
    meta: {
      errorMessage: 'Failed to delete document share'
    },
    ...options,
  });
};
