/**
 * @fileoverview Document Management Hooks
 * @module hooks/documents
 *
 * Provides React Query hooks for document management operations including
 * fetching, creating, updating, and deleting documents. These hooks integrate
 * with TanStack Query for caching, automatic refetching, and optimistic updates.
 *
 * @example
 * ```typescript
 * import { useDocuments, useCreateDocument } from '@/hooks/documents';
 *
 * function DocumentList() {
 *   const { data: documents, isLoading } = useDocuments({ status: 'active' });
 *   const createMutation = useCreateDocument();
 *
 *   return (
 *     <div>
 *       {documents?.map(doc => <DocumentItem key={doc.id} doc={doc} />)}
 *     </div>
 *   );
 * }
 * ```
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Document, DocumentFilters, CreateDocumentRequest } from '@/types/documents';

/**
 * Hook for fetching a list of documents with optional filtering.
 *
 * Uses TanStack Query to fetch and cache documents from the API. Supports
 * filtering by various document properties and automatically refetches when
 * filters change.
 *
 * @param {DocumentFilters} [filters] - Optional filters to apply to document query
 * @returns {UseQueryResult<Document[]>} TanStack Query result object containing documents data, loading state, and error
 *
 * @example
 * ```typescript
 * // Fetch all documents
 * const { data: allDocs } = useDocuments();
 *
 * // Fetch with filters
 * const { data: activeDocs, isLoading, error } = useDocuments({
 *   status: 'active',
 *   category: 'medical',
 *   studentId: '123'
 * });
 *
 * // Handle loading and error states
 * if (isLoading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 * ```
 *
 * @remarks
 * - Query is automatically cached by TanStack Query
 * - Refetches when filters change
 * - Supports background refetching for fresh data
 * - Integrates with document mutations for cache invalidation
 *
 * @see {@link useDocument} for fetching a single document
 * @see {@link DocumentFilters} for available filter options
 */
export function useDocuments(filters?: DocumentFilters) {
  return useQuery({
    queryKey: ['documents', filters],
    queryFn: async () => {
      const response = await fetch('/api/documents?' + new URLSearchParams(filters as any));
      if (!response.ok) throw new Error('Failed to fetch documents');
      return response.json();
    },
  });
}

/**
 * Hook for fetching a single document by ID.
 *
 * Uses TanStack Query to fetch and cache a specific document from the API.
 * The query is automatically disabled if no ID is provided.
 *
 * @param {string} id - Document ID to fetch
 * @returns {UseQueryResult<Document>} TanStack Query result object containing document data, loading state, and error
 *
 * @example
 * ```typescript
 * function DocumentDetail({ documentId }: { documentId: string }) {
 *   const { data: document, isLoading, error } = useDocument(documentId);
 *
 *   if (isLoading) return <Spinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *   if (!document) return <NotFound />;
 *
 *   return (
 *     <div>
 *       <h1>{document.title}</h1>
 *       <p>{document.description}</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * - Query is disabled when ID is empty or undefined
 * - Document data is cached for efficient reuse
 * - Automatically refetches on mount and window focus
 * - Cache is invalidated by document mutations
 *
 * @see {@link useDocuments} for fetching multiple documents
 * @see {@link useUpdateDocument} for updating this document
 */
export function useDocument(id: string) {
  return useQuery({
    queryKey: ['documents', id],
    queryFn: async () => {
      const response = await fetch(`/api/documents/${id}`);
      if (!response.ok) throw new Error('Failed to fetch document');
      return response.json();
    },
    enabled: !!id,
  });
}

/**
 * Hook for creating a new document.
 *
 * Uses TanStack Query mutation to create a new document and automatically
 * invalidates the documents query cache on success to trigger refetch.
 *
 * @returns {UseMutationResult<Document, Error, CreateDocumentRequest>} TanStack Query mutation object
 *
 * @example
 * ```typescript
 * function CreateDocumentForm() {
 *   const createDocument = useCreateDocument();
 *
 *   const handleSubmit = async (formData: CreateDocumentRequest) => {
 *     try {
 *       const newDoc = await createDocument.mutateAsync(formData);
 *       toast.success(`Document "${newDoc.title}" created successfully`);
 *       router.push(`/documents/${newDoc.id}`);
 *     } catch (error) {
 *       toast.error('Failed to create document');
 *     }
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input name="title" required />
 *       <button type="submit" disabled={createDocument.isPending}>
 *         {createDocument.isPending ? 'Creating...' : 'Create'}
 *       </button>
 *     </form>
 *   );
 * }
 * ```
 *
 * @remarks
 * - Automatically invalidates 'documents' query cache on success
 * - Provides isPending state for loading indicators
 * - Throws errors that can be caught in try-catch blocks
 * - Use mutate() for fire-and-forget or mutateAsync() for promise-based flow
 *
 * @see {@link useUpdateDocument} for updating existing documents
 * @see {@link CreateDocumentRequest} for required fields
 */
export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDocumentRequest) => {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create document');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

/**
 * Hook for updating an existing document.
 *
 * Uses TanStack Query mutation to update a document and automatically
 * invalidates the documents query cache on success to trigger refetch.
 *
 * @returns {UseMutationResult<Document, Error, {id: string, data: Partial<Document>}>} TanStack Query mutation object
 *
 * @example
 * ```typescript
 * function EditDocumentForm({ document }: { document: Document }) {
 *   const updateDocument = useUpdateDocument();
 *
 *   const handleSave = async (updates: Partial<Document>) => {
 *     try {
 *       await updateDocument.mutateAsync({
 *         id: document.id,
 *         data: updates
 *       });
 *       toast.success('Document updated successfully');
 *     } catch (error) {
 *       toast.error('Failed to update document');
 *     }
 *   };
 *
 *   return (
 *     <form>
 *       <input name="title" defaultValue={document.title} />
 *       <button
 *         type="submit"
 *         disabled={updateDocument.isPending}
 *         onClick={() => handleSave({ title: formData.title })}
 *       >
 *         Save
 *       </button>
 *     </form>
 *   );
 * }
 * ```
 *
 * @remarks
 * - Supports partial updates (only modified fields need to be provided)
 * - Automatically invalidates 'documents' query cache on success
 * - Use PATCH method for partial updates
 * - Provides isPending state for loading indicators
 *
 * @see {@link useCreateDocument} for creating new documents
 * @see {@link useDeleteDocument} for deleting documents
 */
export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Document> }) => {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update document');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

/**
 * Hook for deleting a document.
 *
 * Uses TanStack Query mutation to delete a document and automatically
 * invalidates the documents query cache on success to trigger refetch.
 *
 * @returns {UseMutationResult<void, Error, string>} TanStack Query mutation object
 *
 * @example
 * ```typescript
 * function DocumentActions({ documentId }: { documentId: string }) {
 *   const deleteDocument = useDeleteDocument();
 *
 *   const handleDelete = async () => {
 *     const confirmed = window.confirm('Delete this document?');
 *     if (!confirmed) return;
 *
 *     try {
 *       await deleteDocument.mutateAsync(documentId);
 *       toast.success('Document deleted successfully');
 *       router.push('/documents');
 *     } catch (error) {
 *       toast.error('Failed to delete document');
 *     }
 *   };
 *
 *   return (
 *     <button
 *       onClick={handleDelete}
 *       disabled={deleteDocument.isPending}
 *       className="btn-danger"
 *     >
 *       {deleteDocument.isPending ? 'Deleting...' : 'Delete'}
 *     </button>
 *   );
 * }
 * ```
 *
 * @remarks
 * - Permanently deletes the document (cannot be undone)
 * - Automatically invalidates 'documents' query cache on success
 * - Always confirm with user before deletion
 * - Provides isPending state for loading indicators
 *
 * @see {@link useUpdateDocument} for non-destructive document changes
 */
export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete document');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}
