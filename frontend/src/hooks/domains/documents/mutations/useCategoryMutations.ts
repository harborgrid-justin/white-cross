import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { DOCUMENTS_QUERY_KEYS, invalidateCategoryQueries, DocumentCategory } from '../config';
import { serverPost, serverPut, serverDelete } from '@/lib/api/client';
import { DOCUMENTS_ENDPOINTS } from '@/constants/api/communications';
import { useApiError } from '@/hooks/shared/useApiError';
import type { CreateCategoryInput, UpdateCategoryInput } from './types';

/**
 * Hook for creating a new document category
 * TODO: Backend endpoint needed - /api/v1/documents/categories
 */
export const useCreateCategory = (
  options?: UseMutationOptions<DocumentCategory, Error, CreateCategoryInput>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (data: CreateCategoryInput) => {
      try {
        // TODO: Replace with actual endpoint when implemented
        return await serverPost(`${DOCUMENTS_ENDPOINTS.BASE}/categories`, data);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (newCategory) => {
      invalidateCategoryQueries(queryClient);
      toast.success(`Category "${newCategory.name}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create category: ${error.message}`);
    },
    meta: {
      errorMessage: 'Failed to create category'
    },
    ...options,
  });
};

/**
 * Hook for updating an existing category
 * TODO: Backend endpoint needed - /api/v1/documents/categories/:id
 */
export const useUpdateCategory = (
  options?: UseMutationOptions<DocumentCategory, Error, UpdateCategoryInput>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (data: UpdateCategoryInput) => {
      try {
        // TODO: Replace with actual endpoint when implemented
        return await serverPut(`${DOCUMENTS_ENDPOINTS.BASE}/categories/${data.id}`, data);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
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
    meta: {
      errorMessage: 'Failed to update category'
    },
    ...options,
  });
};

/**
 * Hook for deleting a category
 * TODO: Backend endpoint needed - /api/v1/documents/categories/:id
 */
export const useDeleteCategory = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      try {
        // TODO: Replace with actual endpoint when implemented
        await serverDelete(`${DOCUMENTS_ENDPOINTS.BASE}/categories/${categoryId}`);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: () => {
      invalidateCategoryQueries(queryClient);
      toast.success('Category deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete category: ${error.message}`);
    },
    meta: {
      errorMessage: 'Failed to delete category'
    },
    ...options,
  });
};
