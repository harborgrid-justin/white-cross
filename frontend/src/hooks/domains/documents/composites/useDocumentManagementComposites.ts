import { UseQueryOptions } from '@tanstack/react-query';
import {
  useDocuments,
  useDocumentDetails,
  useDocumentVersions,
  useDocumentShares,
  useDocumentActivity,
  useDocumentComments,
  useCategories,
  useTemplates,
} from '../queries/useDocumentQueries';
import {
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
  useMoveDocument,
  useBulkDeleteDocuments,
  useBulkMoveDocuments,
} from '../mutations/useDocumentMutations';

// Combined document management hook
export const useDocumentManagement = (
  filters?: any,
  options?: UseQueryOptions<any, Error>
) => {
  const documentsQuery = useDocuments(filters, options);
  const categoriesQuery = useCategories(undefined, options);
  const templatesQuery = useTemplates(undefined, options);

  const createDocument = useCreateDocument();
  const updateDocument = useUpdateDocument();
  const deleteDocument = useDeleteDocument();
  const moveDocument = useMoveDocument();
  const bulkDelete = useBulkDeleteDocuments();
  const bulkMove = useBulkMoveDocuments();

  return {
    // Queries
    documents: documentsQuery.data || [],
    categories: categoriesQuery.data || [],
    templates: templatesQuery.data || [],

    // Loading states
    isLoadingDocuments: documentsQuery.isLoading,
    isLoadingCategories: categoriesQuery.isLoading,
    isLoadingTemplates: templatesQuery.isLoading,
    isLoading: documentsQuery.isLoading || categoriesQuery.isLoading || templatesQuery.isLoading,

    // Error states
    documentsError: documentsQuery.error,
    categoriesError: categoriesQuery.error,
    templatesError: templatesQuery.error,
    hasError: !!(documentsQuery.error || categoriesQuery.error || templatesQuery.error),

    // Mutations
    createDocument: createDocument.mutate,
    updateDocument: updateDocument.mutate,
    deleteDocument: deleteDocument.mutate,
    moveDocument: moveDocument.mutate,
    bulkDelete: bulkDelete.mutate,
    bulkMove: bulkMove.mutate,

    // Mutation states
    isCreating: createDocument.isPending,
    isUpdating: updateDocument.isPending,
    isDeleting: deleteDocument.isPending,
    isMoving: moveDocument.isPending,
    isBulkDeleting: bulkDelete.isPending,
    isBulkMoving: bulkMove.isPending,

    // Utility functions
    refetch: () => {
      documentsQuery.refetch();
      categoriesQuery.refetch();
      templatesQuery.refetch();
    },
  };
};

// Document details with related data
export const useDocumentDetailsComposite = (
  documentId: string,
  options?: UseQueryOptions<any, Error>
) => {
  const documentQuery = useDocumentDetails(documentId, options);
  const versionsQuery = useDocumentVersions(documentId, options);
  const sharesQuery = useDocumentShares(documentId, options);
  const activityQuery = useDocumentActivity(documentId, options);
  const commentsQuery = useDocumentComments(documentId, options);

  return {
    // Data
    document: documentQuery.data,
    versions: versionsQuery.data || [],
    shares: sharesQuery.data || [],
    activity: activityQuery.data || [],
    comments: commentsQuery.data || [],

    // Loading states
    isLoading: documentQuery.isLoading,
    isLoadingVersions: versionsQuery.isLoading,
    isLoadingShares: sharesQuery.isLoading,
    isLoadingActivity: activityQuery.isLoading,
    isLoadingComments: commentsQuery.isLoading,

    // Error states
    error: documentQuery.error,
    versionsError: versionsQuery.error,
    sharesError: sharesQuery.error,
    activityError: activityQuery.error,
    commentsError: commentsQuery.error,

    // Utility functions
    refetch: () => {
      documentQuery.refetch();
      versionsQuery.refetch();
      sharesQuery.refetch();
      activityQuery.refetch();
      commentsQuery.refetch();
    },
  };
};
