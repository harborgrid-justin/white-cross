import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { invalidateTemplateQueries, invalidateDocumentQueries, DocumentTemplate, Document } from '../config';
import { mockDocumentMutationAPI } from './api';
import type { CreateTemplateInput } from './types';

/**
 * Hook for creating a new document template
 */
export const useCreateTemplate = (
  options?: UseMutationOptions<DocumentTemplate, Error, CreateTemplateInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDocumentMutationAPI.createTemplate,
    onSuccess: (newTemplate) => {
      invalidateTemplateQueries(queryClient);
      toast.success(`Template "${newTemplate.name}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create template: ${error.message}`);
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

  return useMutation({
    mutationFn: ({ templateId, data }) => mockDocumentMutationAPI.createFromTemplate(templateId, data),
    onSuccess: (newDocument) => {
      invalidateDocumentQueries(queryClient);
      toast.success('Document created from template successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create document from template: ${error.message}`);
    },
    ...options,
  });
};
