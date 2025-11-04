import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  DOCUMENTS_QUERY_KEYS,
  invalidateDocumentQueries,
  Document,
} from '../config';
import { mockDocumentMutationAPI } from './api';
import type { CreateDocumentInput, UpdateDocumentInput } from './types';

/**
 * Hook for creating a new document
 */
export const useCreateDocument = (
  options?: UseMutationOptions<Document, Error, CreateDocumentInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.createDocument,
    onSuccess: (newDocument) => {
      invalidateDocumentQueries(queryClient);
      toast.success(`Document "${newDocument.title}" uploaded successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload document: ${error.message}`);
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

  return useMutation({
    mutationFn: mockDocumentMutationAPI.updateDocument,
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

  return useMutation({
    mutationFn: mockDocumentMutationAPI.deleteDocument,
    onSuccess: (_, docId) => {
      invalidateDocumentQueries(queryClient);
      toast.success('Document deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete document: ${error.message}`);
    },
    ...options,
  });
};

/**
 * Hook for duplicating a document
 */
export const useDuplicateDocument = (
  options?: UseMutationOptions<Document, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.duplicateDocument,
    onSuccess: (duplicatedDoc) => {
      invalidateDocumentQueries(queryClient);
      toast.success('Document duplicated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to duplicate document: ${error.message}`);
    },
    ...options,
  });
};

/**
 * Hook for moving a document to a different category
 */
export const useMoveDocument = (
  options?: UseMutationOptions<Document, Error, { docId: string; categoryId: string }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ docId, categoryId }) => mockDocumentMutationAPI.moveDocument(docId, categoryId),
    onSuccess: (_, { docId }) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.documentDetails(docId) });
      invalidateDocumentQueries(queryClient);
      toast.success('Document moved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to move document: ${error.message}`);
    },
    ...options,
  });
};

/**
 * Hook for adding a document to favorites
 */
export const useFavoriteDocument = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.favoriteDocument,
    onSuccess: (_, docId) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.documentDetails(docId) });
      queryClient.invalidateQueries({ queryKey: ['documents', 'favorites'] });
      toast.success('Document added to favorites');
    },
    onError: (error: Error) => {
      toast.error(`Failed to favorite document: ${error.message}`);
    },
    ...options,
  });
};

/**
 * Hook for removing a document from favorites
 */
export const useUnfavoriteDocument = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.unfavoriteDocument,
    onSuccess: (_, docId) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.documentDetails(docId) });
      queryClient.invalidateQueries({ queryKey: ['documents', 'favorites'] });
      toast.success('Document removed from favorites');
    },
    onError: (error: Error) => {
      toast.error(`Failed to unfavorite document: ${error.message}`);
    },
    ...options,
  });
};
