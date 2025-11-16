import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { DocumentComment } from '../config';
import { serverPost, serverPut, serverDelete } from '@/lib/api/client';
import { DOCUMENTS_ENDPOINTS } from '@/constants/api/communications';
import { useApiError } from '@/hooks/shared/useApiError';
import type { CreateCommentInput, UpdateCommentInput } from './types';

/**
 * Hook for creating a new comment on a document
 * TODO: Backend endpoint needed - /api/v1/documents/:id/comments
 */
export const useCreateComment = (
  options?: UseMutationOptions<DocumentComment, Error, CreateCommentInput>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (data: CreateCommentInput) => {
      try {
        // TODO: Replace with actual endpoint when implemented
        return await serverPost(`${DOCUMENTS_ENDPOINTS.BASE}/${data.documentId}/comments`, data);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (_, { documentId }) => {
      queryClient.invalidateQueries({ queryKey: ['documents', documentId, 'comments'] });
      toast.success('Comment added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add comment: ${error.message}`);
    },
    meta: {
      errorMessage: 'Failed to create comment'
    },
    ...options,
  });
};

/**
 * Hook for updating an existing comment
 * TODO: Backend endpoint needed - /api/v1/documents/comments/:id
 */
export const useUpdateComment = (
  options?: UseMutationOptions<DocumentComment, Error, UpdateCommentInput>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (data: UpdateCommentInput) => {
      try {
        // TODO: Replace with actual endpoint when implemented
        return await serverPut(`${DOCUMENTS_ENDPOINTS.BASE}/comments/${data.id}`, data);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (updatedComment) => {
      // Invalidate comments for the document
      queryClient.invalidateQueries({ queryKey: ['documents', 'comments'] });
      toast.success('Comment updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update comment: ${error.message}`);
    },
    meta: {
      errorMessage: 'Failed to update comment'
    },
    ...options,
  });
};

/**
 * Hook for deleting a comment
 * TODO: Backend endpoint needed - /api/v1/documents/comments/:id
 */
export const useDeleteComment = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (commentId: string) => {
      try {
        // TODO: Replace with actual endpoint when implemented
        await serverDelete(`${DOCUMENTS_ENDPOINTS.BASE}/comments/${commentId}`);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', 'comments'] });
      toast.success('Comment deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete comment: ${error.message}`);
    },
    meta: {
      errorMessage: 'Failed to delete comment'
    },
    ...options,
  });
};

/**
 * Hook for resolving a comment thread
 * TODO: Backend endpoint needed - /api/v1/documents/comments/:id/resolve
 */
export const useResolveComment = (
  options?: UseMutationOptions<DocumentComment, Error, string>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (commentId: string) => {
      try {
        // TODO: Replace with actual endpoint when implemented
        return await serverPost(`${DOCUMENTS_ENDPOINTS.BASE}/comments/${commentId}/resolve`, {});
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', 'comments'] });
      toast.success('Comment resolved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to resolve comment: ${error.message}`);
    },
    meta: {
      errorMessage: 'Failed to resolve comment'
    },
    ...options,
  });
};
