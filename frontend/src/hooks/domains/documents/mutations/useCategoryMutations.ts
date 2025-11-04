import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { DOCUMENTS_QUERY_KEYS, invalidateCategoryQueries, DocumentCategory } from '../config';
import { mockDocumentMutationAPI } from './api';
import type { CreateCategoryInput, UpdateCategoryInput } from './types';

/**
 * Hook for creating a new document category
 */
export const useCreateCategory = (
  options?: UseMutationOptions<DocumentCategory, Error, CreateCategoryInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.createCategory,
    onSuccess: (newCategory) => {
      invalidateCategoryQueries(queryClient);
      toast.success(`Category "${newCategory.name}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create category: ${error.message}`);
    },
    ...options,
  });
};

/**
 * Hook for updating an existing category
 */
export const useUpdateCategory = (
  options?: UseMutationOptions<DocumentCategory, Error, UpdateCategoryInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.updateCategory,
    onSuccess: (updatedCategory) => {
      queryClient.setQueryData(
        DOCUMENTS_QUERY_KEYS.categoryDetails(updatedCategory.id),
        updatedCategory
      );
      invalidateCategoryQueries(queryClient);
      toast.success('Category updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update category: ${error.message}`);
    },
    ...options,
  });
};

/**
 * Hook for deleting a category
 */
export const useDeleteCategory = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.deleteCategory,
    onSuccess: () => {
      invalidateCategoryQueries(queryClient);
      toast.success('Category deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete category: ${error.message}`);
    },
    ...options,
  });
};
