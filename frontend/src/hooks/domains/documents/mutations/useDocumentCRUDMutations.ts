import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  DOCUMENTS_QUERY_KEYS,
  invalidateDocumentQueries,
  Document,
} from '../config';
import { serverPost, serverPut, serverDelete } from '@/lib/api/client';
import { DOCUMENTS_ENDPOINTS } from '@/constants/api/communications';
import { useApiError } from '@/hooks/shared/useApiError';
import type { CreateDocumentInput, UpdateDocumentInput } from './types';

/**
 * Hook for creating a new document
 */
export const useCreateDocument = (
  options?: UseMutationOptions<Document, Error, CreateDocumentInput>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (data: CreateDocumentInput) => {
      try {
        return await serverPost(DOCUMENTS_ENDPOINTS.BASE, data);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (newDocument) => {
      invalidateDocumentQueries(queryClient);
      toast.success(`Document "${newDocument.title}" uploaded successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload document: ${error.message}`);
    },
    meta: {
      errorMessage: 'Failed to create document'
    },
    ...options,
  });
};

/**
 * Hook for updating an existing document
 */
export const useUpdateDocument = (
  options?: UseMutationOptions<Document, Error, UpdateDocumentInput>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (data: UpdateDocumentInput) => {
      try {
        return await serverPut(DOCUMENTS_ENDPOINTS.BY_ID(data.id), data);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (updatedDocument) => {
      queryClient.setQueryData(
        DOCUMENTS_QUERY_KEYS.documentDetails(updatedDocument.id),
        updatedDocument
      );
      invalidateDocumentQueries(queryClient);
      toast.success('Document updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update document: ${error.message}`);
    },
    meta: {
      errorMessage: 'Failed to update document'
    },
    ...options,
  });
};

/**
 * Hook for deleting a document
 */
export const useDeleteDocument = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (docId: string) => {
      try {
        await serverDelete(DOCUMENTS_ENDPOINTS.BY_ID(docId));
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (_, docId) => {
      invalidateDocumentQueries(queryClient);
      toast.success('Document deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete document: ${error.message}`);
    },
    meta: {
      errorMessage: 'Failed to delete document'
    },
    ...options,
  });
};

/**
 * Hook for duplicating a document
 * TODO: Backend endpoint needed - /api/v1/documents/:id/duplicate
 */
export const useDuplicateDocument = (
  options?: UseMutationOptions<Document, Error, string>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (docId: string) => {
      try {
        // TODO: Replace with actual endpoint when implemented
        return await serverPost(`${DOCUMENTS_ENDPOINTS.BASE}/${docId}/duplicate`, {});
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (duplicatedDoc) => {
      invalidateDocumentQueries(queryClient);
      toast.success('Document duplicated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to duplicate document: ${error.message}`);
    },
    meta: {
      errorMessage: 'Failed to duplicate document'
    },
    ...options,
  });
};

/**
 * Hook for moving a document to a different category
 * TODO: Backend endpoint needed - /api/v1/documents/:id/move
 */
export const useMoveDocument = (
  options?: UseMutationOptions<Document, Error, { docId: string; categoryId: string }>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async ({ docId, categoryId }) => {
      try {
        // TODO: Replace with actual endpoint when implemented
        return await serverPost(`${DOCUMENTS_ENDPOINTS.BASE}/${docId}/move`, { categoryId });
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (_, { docId }) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.documentDetails(docId) });
      invalidateDocumentQueries(queryClient);
      toast.success('Document moved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to move document: ${error.message}`);
    },
    meta: {
      errorMessage: 'Failed to move document'
    },
    ...options,
  });
};

/**
 * Hook for adding a document to favorites
 * TODO: Backend endpoint needed - /api/v1/documents/:id/favorite
 */
export const useFavoriteDocument = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (docId: string) => {
      try {
        // TODO: Replace with actual endpoint when implemented
        await serverPost(`${DOCUMENTS_ENDPOINTS.BASE}/${docId}/favorite`, {});
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (_, docId) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.documentDetails(docId) });
      queryClient.invalidateQueries({ queryKey: ['documents', 'favorites'] });
      toast.success('Document added to favorites');
    },
    onError: (error: Error) => {
      toast.error(`Failed to favorite document: ${error.message}`);
    },
    meta: {
      errorMessage: 'Failed to favorite document'
    },
    ...options,
  });
};

/**
 * Hook for removing a document from favorites
 * TODO: Backend endpoint needed - /api/v1/documents/:id/unfavorite
 */
export const useUnfavoriteDocument = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (docId: string) => {
      try {
        // TODO: Replace with actual endpoint when implemented
        await serverDelete(`${DOCUMENTS_ENDPOINTS.BASE}/${docId}/favorite`);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (_, docId) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.documentDetails(docId) });
      queryClient.invalidateQueries({ queryKey: ['documents', 'favorites'] });
      toast.success('Document removed from favorites');
    },
    onError: (error: Error) => {
      toast.error(`Failed to unfavorite document: ${error.message}`);
    },
    meta: {
      errorMessage: 'Failed to unfavorite document'
    },
    ...options,
  });
};
