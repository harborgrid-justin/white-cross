/**
 * useDocuments hook for document list management
 *
 * @module hooks/documents/useDocuments
 * @description Hook for fetching and managing document lists with filtering and pagination
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import type {
  Document,
  DocumentListResponse,
  DocumentFilters,
  DocumentActionResult
} from '@/types/documents';

/**
 * API base URL from environment
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Documents query key factory
 */
export const documentsKeys = {
  all: ['documents'] as const,
  lists: () => [...documentsKeys.all, 'list'] as const,
  list: (filters: DocumentFilters) => [...documentsKeys.lists(), filters] as const,
  details: () => [...documentsKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentsKeys.details(), id] as const,
  folder: (folderId: string) => [...documentsKeys.lists(), 'folder', folderId] as const
};

/**
 * Fetch documents from API
 */
async function fetchDocuments(
  filters: DocumentFilters,
  token?: string
): Promise<DocumentListResponse> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, String(v)));
      } else {
        params.set(key, String(value));
      }
    }
  });

  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/documents?${params}`, {
    headers
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch documents: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Delete document
 */
async function deleteDocument(
  documentId: string,
  token?: string
): Promise<DocumentActionResult> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
    method: 'DELETE',
    headers
  });

  if (!response.ok) {
    throw new Error(`Failed to delete document: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Move document to folder
 */
async function moveDocument(
  documentId: string,
  folderId: string | null,
  token?: string
): Promise<Document> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/documents/${documentId}/move`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ folderId })
  });

  if (!response.ok) {
    throw new Error(`Failed to move document: ${response.statusText}`);
  }

  return response.json();
}

/**
 * useDocuments hook
 */
export function useDocuments(initialFilters: Partial<DocumentFilters> = {}, token?: string) {
  const queryClient = useQueryClient();

  // Filters state
  const [filters, setFilters] = useState<DocumentFilters>({
    page: 1,
    pageSize: 20,
    sortBy: 'date',
    sortDirection: 'desc',
    ...initialFilters
  });

  // Fetch documents query
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: documentsKeys.list(filters),
    queryFn: () => fetchDocuments(filters, token),
    staleTime: 30000, // 30 seconds
    gcTime: 300000 // 5 minutes
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (documentId: string) => deleteDocument(documentId, token),
    onSuccess: () => {
      // Invalidate documents list
      queryClient.invalidateQueries({ queryKey: documentsKeys.lists() });
    }
  });

  // Move mutation
  const moveMutation = useMutation({
    mutationFn: ({ documentId, folderId }: { documentId: string; folderId: string | null }) =>
      moveDocument(documentId, folderId, token),
    onSuccess: () => {
      // Invalidate documents list
      queryClient.invalidateQueries({ queryKey: documentsKeys.lists() });
    }
  });

  // Filter update handlers
  const updateFilters = useCallback((newFilters: Partial<DocumentFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, query, page: 1 }));
  }, []);

  const setCategory = useCallback((category: string[]) => {
    setFilters((prev) => ({ ...prev, category, page: 1 }));
  }, []);

  const setFolder = useCallback((folderId?: string) => {
    setFilters((prev) => ({ ...prev, folderId, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const setSortBy = useCallback((sortBy: DocumentFilters['sortBy']) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  }, []);

  const toggleSortDirection = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      sortDirection: prev.sortDirection === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      pageSize: 20,
      sortBy: 'date',
      sortDirection: 'desc'
    });
  }, []);

  // Delete handlers
  const deleteDocumentById = useCallback(
    async (documentId: string) => {
      return deleteMutation.mutateAsync(documentId);
    },
    [deleteMutation]
  );

  // Move handlers
  const moveDocumentToFolder = useCallback(
    async (documentId: string, folderId: string | null) => {
      return moveMutation.mutateAsync({ documentId, folderId });
    },
    [moveMutation]
  );

  return {
    // Data
    documents: data?.data || [],
    pagination: data?.pagination,
    totalSize: data?.totalSize || 0,
    folder: data?.folder,

    // Loading states
    isLoading,
    isFetching,
    isError,
    error,

    // Filters
    filters,
    updateFilters,
    setSearchQuery,
    setCategory,
    setFolder,
    setPage,
    setSortBy,
    toggleSortDirection,
    resetFilters,

    // Actions
    refetch,
    deleteDocument: deleteDocumentById,
    moveDocument: moveDocumentToFolder,

    // Mutation states
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
    isMoving: moveMutation.isPending,
    moveError: moveMutation.error
  };
}

/**
 * Hook for documents in specific folder
 */
export function useDocumentsInFolder(folderId: string, token?: string) {
  return useDocuments({ folderId }, token);
}

/**
 * Hook for documents by student
 */
export function useDocumentsByStudent(studentId: string, token?: string) {
  return useDocuments({ studentId }, token);
}

/**
 * Hook for PHI documents
 */
export function usePHIDocuments(token?: string) {
  return useDocuments({ isPHI: true }, token);
}
