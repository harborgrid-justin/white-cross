/**
 * Custom Hooks for Document Management
 * Handles data fetching, filtering, sorting, statistics, and selection state
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { getDocuments, type DocumentInfo } from '@/lib/actions/documents.actions';
import type {
  Document,
  DocumentType,
  DocumentStatus,
  AccessLevel,
  DocumentStats,
} from '../types/document.types';

/**
 * Hook for fetching and managing document data
 */
export const useDocumentData = (initialDocuments: Document[] = []) => {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        setLoading(true);

        // Load documents from server actions
        const documentInfos = await getDocuments();

        // Transform DocumentInfo[] to Document[] for UI compatibility
        const transformedData: Document[] = documentInfos.map((doc: DocumentInfo) => ({
          id: doc.id,
          studentId: undefined,
          studentName: 'Unknown Student',
          fileName: doc.filename,
          title: doc.title,
          description: doc.description,
          documentType: (doc.category as DocumentType) || 'other',
          mimeType: doc.mimeType,
          fileSize: doc.size,
          status: 'active' as DocumentStatus,
          accessLevel: doc.isPHI ? 'nurse_only' : ('staff_only' as AccessLevel),
          tags: doc.category ? [doc.category] : [],
          isStarred: false,
          isEncrypted: doc.isPHI,
          uploadedBy: 'System',
          uploadedAt: doc.uploadedAt,
          lastModified: doc.uploadedAt,
          version: 1,
          downloadCount: 0,
          sharingEnabled: !doc.isPHI,
          auditLog: [],
        }));

        setDocuments(transformedData);
      } catch (error) {
        console.error('Failed to load documents:', error);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    }

    if (initialDocuments.length > 0) {
      setDocuments(initialDocuments);
      setLoading(false);
    } else {
      fetchDocuments();
    }
  }, [initialDocuments]);

  return { documents, setDocuments, loading };
};

/**
 * Hook for managing document filter and sort state
 */
export const useDocumentFilters = () => {
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all');
  const [accessFilter, setAccessFilter] = useState<AccessLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const clearFilters = useCallback(() => {
    setTypeFilter('all');
    setStatusFilter('all');
    setAccessFilter('all');
    setSearchQuery('');
    setSortBy('date');
    setSortOrder('desc');
  }, []);

  const toggleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  return {
    // Filter state
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
    // Sort state
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    // Actions
    clearFilters,
    toggleSortOrder,
  };
};

/**
 * Hook for managing document selection state
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
 * Hook for filtering and sorting documents
 */
export const useFilteredAndSortedDocuments = (
  documents: Document[],
  filters: {
    typeFilter: DocumentType | 'all';
    statusFilter: DocumentStatus | 'all';
    accessFilter: AccessLevel | 'all';
    searchQuery: string;
    sortBy: 'name' | 'date' | 'size' | 'type';
    sortOrder: 'asc' | 'desc';
  }
) => {
  return useMemo(() => {
    let filtered = [...documents];

    // Apply type filter
    if (filters.typeFilter !== 'all') {
      filtered = filtered.filter((doc) => doc.documentType === filters.typeFilter);
    }

    // Apply status filter
    if (filters.statusFilter !== 'all') {
      filtered = filtered.filter((doc) => doc.status === filters.statusFilter);
    }

    // Apply access level filter
    if (filters.accessFilter !== 'all') {
      filtered = filtered.filter((doc) => doc.accessLevel === filters.accessFilter);
    }

    // Apply search query
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.title.toLowerCase().includes(query) ||
          doc.fileName.toLowerCase().includes(query) ||
          doc.studentName?.toLowerCase().includes(query) ||
          doc.description?.toLowerCase().includes(query) ||
          doc.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Sort documents
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (filters.sortBy) {
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

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [documents, filters]);
};
