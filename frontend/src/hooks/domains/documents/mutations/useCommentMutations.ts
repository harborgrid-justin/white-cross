import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { DocumentComment } from '../config';
import { mockDocumentMutationAPI } from './api';
import type { CreateCommentInput, UpdateCommentInput } from './types';

/**
 * Hook for creating a new comment on a document
 */
export const useCreateComment = (
  options?: UseMutationOptions<DocumentComment, Error, CreateCommentInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.createComment,
    onSuccess: (_, { documentId }) => {
      queryClient.invalidateQueries({ queryKey: ['documents', documentId, 'comments'] });
      toast.success('Comment added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add comment: ${error.message}`);
    },
    ...options,
  });
};

/**
 * Hook for updating an existing comment
 */
export const useUpdateComment = (
  options?: UseMutationOptions<DocumentComment, Error, UpdateCommentInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.updateComment,
    onSuccess: (updatedComment) => {
      // Invalidate comments for the document
      queryClient.invalidateQueries({ queryKey: ['documents', 'comments'] });
      toast.success('Comment updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update comment: ${error.message}`);
    },
    ...options,
  });
};

/**
 * Hook for deleting a comment
 */
export const useDeleteComment = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', 'comments'] });
      toast.success('Comment deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete comment: ${error.message}`);
    },
    ...options,
  });
};

/**
 * Hook for resolving a comment thread
 */
export const useResolveComment = (
  options?: UseMutationOptions<DocumentComment, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.resolveComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', 'comments'] });
      toast.success('Comment resolved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to resolve comment: ${error.message}`);
    },
    ...options,
  });
};
