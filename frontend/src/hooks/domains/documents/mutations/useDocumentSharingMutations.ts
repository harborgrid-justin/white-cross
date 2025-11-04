import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { DOCUMENTS_QUERY_KEYS, invalidateShareQueries, DocumentShare } from '../config';
import { mockDocumentMutationAPI } from './api';
import type { CreateShareInput, UpdateShareInput } from './types';

/**
 * Hook for creating a document share
 */
export const useCreateShare = (
  options?: UseMutationOptions<DocumentShare, Error, CreateShareInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.createShare,
    onSuccess: (newShare) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.sharesList(newShare.documentId) });
      toast.success('Document shared successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to share document: ${error.message}`);
    },
    ...options,
  });
};

/**
 * Hook for updating an existing share
 */
export const useUpdateShare = (
  options?: UseMutationOptions<DocumentShare, Error, UpdateShareInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.updateShare,
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
    ...options,
  });
};

/**
 * Hook for deleting a share
 */
export const useDeleteShare = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.deleteShare,
    onSuccess: () => {
      invalidateShareQueries(queryClient);
      toast.success('Share removed successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove share: ${error.message}`);
    },
    ...options,
  });
};
