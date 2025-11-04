/**
 * Custom Hooks for Document Management
 * Encapsulates state management and business logic for documents
 */

import { useState, useMemo, useCallback } from 'react';
import type {
  Document,
  DocumentType,
  DocumentStatus,
  AccessLevel,
  DocumentStats,
} from '../types/document.types';

/**
 * Hook for managing document state
 * Note: Document fetching is handled by the parent component via server actions
 */
export const useDocuments = (documents: Document[], loading: boolean) => {
  return { documents, loading };
};

/**
 * Hook for document filtering logic
 */
export const useDocumentFilters = () => {
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all');
  const [accessFilter, setAccessFilter] = useState<AccessLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = useCallback(
    (documents: Document[]) => {
      let filtered = documents;

      if (typeFilter !== 'all') {
        filtered = filtered.filter((doc) => doc.documentType === typeFilter);
      }

      if (statusFilter !== 'all') {
        filtered = filtered.filter((doc) => doc.status === statusFilter);
      }

      if (accessFilter !== 'all') {
        filtered = filtered.filter((doc) => doc.accessLevel === accessFilter);
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (doc) =>
            doc.title.toLowerCase().includes(query) ||
            doc.fileName.toLowerCase().includes(query) ||
            doc.studentName?.toLowerCase().includes(query) ||
            doc.description?.toLowerCase().includes(query) ||
            doc.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      }

      return filtered;
    },
    [typeFilter, statusFilter, accessFilter, searchQuery]
  );

  const clearFilters = useCallback(() => {
    setTypeFilter('all');
    setStatusFilter('all');
    setAccessFilter('all');
    setSearchQuery('');
  }, []);

  return {
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    accessFilter,
    setAccessFilter,
    searchQuery,
    setSearchQuery,
    showFilters,
    setShowFilters,
    applyFilters,
    clearFilters,
  };
};

/**
 * Hook for document sorting logic
 */
export const useDocumentSort = () => {
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const applySorting = useCallback(
    (documents: Document[]) => {
      return [...documents].sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        switch (sortBy) {
          case 'name':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case 'date':
            aValue = new Date(a.lastModified).getTime();
            bValue = new Date(b.lastModified).getTime();
            break;
          case 'size':
            aValue = a.fileSize;
            bValue = b.fileSize;
            break;
          case 'type':
            aValue = a.documentType;
            bValue = b.documentType;
            break;
          default:
            aValue = new Date(a.lastModified).getTime();
            bValue = new Date(b.lastModified).getTime();
        }

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    },
    [sortBy, sortOrder]
  );

  const toggleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  return {
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    applySorting,
    toggleSortOrder,
  };
};

/**
 * Hook for calculating document statistics
 */
export const useDocumentStats = (documents: Document[]): DocumentStats => {
  return useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return {
      totalDocuments: documents.length,
      activeDocuments: documents.filter((doc) => doc.status === 'active').length,
      pendingReview: documents.filter((doc) => doc.status === 'pending_review').length,
      expiringSoon: documents.filter(
        (doc) =>
          doc.expirationDate &&
          new Date(doc.expirationDate) <= sevenDaysFromNow &&
          new Date(doc.expirationDate) > now
      ).length,
      confidentialDocs: documents.filter(
        (doc) =>
          doc.accessLevel === 'nurse_only' ||
          doc.accessLevel === 'admin_only' ||
          doc.accessLevel === 'restricted'
      ).length,
      storageUsed: Math.round(
        documents.reduce((total, doc) => total + doc.fileSize, 0) / (1024 * 1024)
      ),
      documentsThisMonth: documents.filter(
        (doc) => new Date(doc.uploadedAt) >= thirtyDaysAgo
      ).length,
      averageFileSize:
        documents.length > 0
          ? Math.round(
              (documents.reduce((total, doc) => total + doc.fileSize, 0) /
                documents.length /
                (1024 * 1024)) *
                10
            ) / 10
          : 0,
    };
  }, [documents]);
};

/**
 * Hook for managing document selection
 */
export const useDocumentSelection = () => {
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());

  const toggleSelection = useCallback((documentId: string) => {
    setSelectedDocuments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(documentId)) {
        newSet.delete(documentId);
      } else {
        newSet.add(documentId);
      }
      return newSet;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedDocuments(new Set());
  }, []);

  const selectAll = useCallback((documentIds: string[]) => {
    setSelectedDocuments(new Set(documentIds));
  }, []);

  return {
    selectedDocuments,
    toggleSelection,
    clearSelection,
    selectAll,
  };
};
