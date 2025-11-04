import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { DOCUMENTS_QUERY_KEYS, Document } from '../config';
import { mockDocumentMutationAPI } from './api';

/**
 * Hook for uploading a new version of a document
 */
export const useUploadNewVersion = (
  options?: UseMutationOptions<Document, Error, { docId: string; file: File; changes: string }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ docId, file, changes }) => mockDocumentMutationAPI.uploadNewVersion(docId, file, changes),
    onSuccess: (_, { docId }) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.documentDetails(docId) });
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.documentVersions(docId) });
      toast.success('New version uploaded successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload new version: ${error.message}`);
    },
    ...options,
  });
};
