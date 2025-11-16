import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { invalidateTemplateQueries, invalidateDocumentQueries, DocumentTemplate, Document } from '../config';
import { serverPost } from '@/lib/api/client';
import { TEMPLATES_ENDPOINTS, DOCUMENTS_ENDPOINTS } from '@/constants/api/communications';
import { useApiError } from '@/hooks/shared/useApiError';
import type { CreateTemplateInput } from './types';

/**
 * Hook for creating a new document template
 */
export const useCreateTemplate = (
  options?: UseMutationOptions<DocumentTemplate, Error, CreateTemplateInput>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (data: CreateTemplateInput) => {
      try {
        return await serverPost(TEMPLATES_ENDPOINTS.BASE, data);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (newTemplate) => {
      invalidateTemplateQueries(queryClient);
      toast.success(`Template "${newTemplate.name}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create template: ${error.message}`);
    },
    meta: {
      errorMessage: 'Failed to create template'
    },
    ...options,
  });
};

/**
 * Hook for creating a document from a template
 */
export const useCreateFromTemplate = (
  options?: UseMutationOptions<Document, Error, { templateId: string; data: any }>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async ({ templateId, data }) => {
      try {
        return await serverPost(DOCUMENTS_ENDPOINTS.TEMPLATES, { templateId, ...data });
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (newDocument) => {
      invalidateDocumentQueries(queryClient);
      toast.success('Document created from template successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create document from template: ${error.message}`);
    },
    meta: {
      errorMessage: 'Failed to create document from template'
    },
    ...options,
  });
};
