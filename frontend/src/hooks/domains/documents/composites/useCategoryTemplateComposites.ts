import { UseQueryOptions } from '@tanstack/react-query';
import {
  useCategories,
  useCategoryDetails,
  useCategoryDocuments,
  useTemplates,
  useTemplateDetails,
} from '../queries/useDocumentQueries';
import {
  useCreateCategory,
  useUpdateCategory,
  useCreateTemplate,
} from '../mutations/useDocumentMutations';

// Category management with documents
export const useCategoryManagement = (
  categoryId?: string,
  options?: UseQueryOptions<any, Error>
) => {
  const categoriesQuery = useCategories(undefined, options);
  const categoryQuery = useCategoryDetails(categoryId || '', {
    ...options,
    enabled: !!categoryId
  });
  const categoryDocumentsQuery = useCategoryDocuments(categoryId || '', {
    ...options,
    enabled: !!categoryId
  });

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  return {
    // Data
    categories: categoriesQuery.data || [],
    category: categoryQuery.data,
    categoryDocuments: categoryDocumentsQuery.data || [],

    // Loading states
    isLoadingCategories: categoriesQuery.isLoading,
    isLoadingCategory: categoryQuery.isLoading,
    isLoadingCategoryDocuments: categoryDocumentsQuery.isLoading,
    isLoading: categoriesQuery.isLoading || categoryQuery.isLoading || categoryDocumentsQuery.isLoading,

    // Error states
    categoriesError: categoriesQuery.error,
    categoryError: categoryQuery.error,
    categoryDocumentsError: categoryDocumentsQuery.error,

    // Mutations
    createCategory: createCategory.mutate,
    updateCategory: updateCategory.mutate,

    // Mutation states
    isCreating: createCategory.isPending,
    isUpdating: updateCategory.isPending,

    // Utility functions
    refetch: () => {
      categoriesQuery.refetch();
      categoryQuery.refetch();
      categoryDocumentsQuery.refetch();
    },
  };
};

// Template management with usage
export const useTemplateManagement = (
  templateId?: string,
  options?: UseQueryOptions<any, Error>
) => {
  const templatesQuery = useTemplates(undefined, options);
  const templateQuery = useTemplateDetails(templateId || '', {
    ...options,
    enabled: !!templateId
  });

  const createTemplate = useCreateTemplate();

  return {
    // Data
    templates: templatesQuery.data || [],
    template: templateQuery.data,

    // Loading states
    isLoadingTemplates: templatesQuery.isLoading,
    isLoadingTemplate: templateQuery.isLoading,
    isLoading: templatesQuery.isLoading || templateQuery.isLoading,

    // Error states
    templatesError: templatesQuery.error,
    templateError: templateQuery.error,

    // Mutations
    createTemplate: createTemplate.mutate,

    // Mutation states
    isCreating: createTemplate.isPending,

    // Utility functions
    refetch: () => {
      templatesQuery.refetch();
      templateQuery.refetch();
    },
  };
};
