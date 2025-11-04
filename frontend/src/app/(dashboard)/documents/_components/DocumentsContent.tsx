'use client';

/**
 * DocumentsContent Component (Refactored)
 * Main orchestrator for document management interface
 * Composes sub-components for stats, filters, and document browsing
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { DocumentStats } from './DocumentStats';
import { DocumentFilters } from './DocumentFilters';
import { DocumentBrowser } from './DocumentBrowser';
import {
  useDocumentFilters,
  useDocumentSort,
  useDocumentStats,
  useDocumentSelection,
} from './hooks/useDocuments';
import { getDocuments, type DocumentInfo } from '@/lib/actions/documents.actions';
import type {
  DocumentsContentProps,
  ViewMode,
  Document,
  DocumentType,
  DocumentStatus,
  AccessLevel,
} from './types/document.types';

const DocumentsContent: React.FC<DocumentsContentProps> = ({ initialDocuments = [] }) => {
  // Document state
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = React.useState<ViewMode>('grid');

  // Fetch documents from server actions
  useEffect(() => {
    async function fetchDocuments() {
      try {
        setLoading(true);
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

  // Custom hooks for filtering, sorting, and selection
  const {
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
  } = useDocumentFilters();

  const { sortBy, setSortBy, sortOrder, applySorting, toggleSortOrder } = useDocumentSort();

  const { selectedDocuments, toggleSelection } = useDocumentSelection();

  // Calculate statistics
  const stats = useDocumentStats(documents);

  // Filter and sort documents
  const filteredAndSortedDocuments = useMemo(() => {
    const filtered = applyFilters(documents);
    return applySorting(filtered);
  }, [documents, applyFilters, applySorting]);

  // Combined filter clear handler
  const handleClearFilters = () => {
    clearFilters();
    setSortBy('date');
  };

  // Document action handlers (placeholder implementations)
  const handleDocumentView = (document: Document) => {
    console.log('View document:', document.id);
    // TODO: Implement document viewer
  };

  const handleDocumentDownload = (document: Document) => {
    console.log('Download document:', document.id);
    // TODO: Implement document download
  };

  const handleDocumentEdit = (document: Document) => {
    console.log('Edit document:', document.id);
    // TODO: Implement document editor
  };

  const handleDocumentShare = (document: Document) => {
    console.log('Share document:', document.id);
    // TODO: Implement document sharing
  };

  const handleDocumentMore = (document: Document) => {
    console.log('More options for document:', document.id);
    // TODO: Implement more options menu
  };

  const handleUploadClick = () => {
    console.log('Upload document clicked');
    // TODO: Implement document upload dialog
  };

  const handleBulkDownload = () => {
    console.log('Bulk download:', Array.from(selectedDocuments));
    // TODO: Implement bulk download
  };

  const handleBulkShare = () => {
    console.log('Bulk share:', Array.from(selectedDocuments));
    // TODO: Implement bulk share
  };

  const handleBulkArchive = () => {
    console.log('Bulk archive:', Array.from(selectedDocuments));
    // TODO: Implement bulk archive
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <div className="p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
        <Card>
          <div className="p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Document Statistics */}
      <DocumentStats stats={stats} />

      {/* Document Filters and Controls */}
      <DocumentFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        accessFilter={accessFilter}
        onAccessFilterChange={setAccessFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderToggle={toggleSortOrder}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onClearFilters={handleClearFilters}
        selectedCount={selectedDocuments.size}
        onBulkDownload={handleBulkDownload}
        onBulkShare={handleBulkShare}
        onBulkArchive={handleBulkArchive}
      />

      {/* Document Browser */}
      <DocumentBrowser
        documents={filteredAndSortedDocuments}
        viewMode={viewMode}
        sortBy={sortBy}
        sortOrder={sortOrder}
        selectedDocuments={selectedDocuments}
        onDocumentSelect={toggleSelection}
        onSortOrderToggle={toggleSortOrder}
        onDocumentView={handleDocumentView}
        onDocumentDownload={handleDocumentDownload}
        onDocumentEdit={handleDocumentEdit}
        onDocumentShare={handleDocumentShare}
        onDocumentMore={handleDocumentMore}
        onUploadClick={handleUploadClick}
      />
    </div>
  );
};

export default DocumentsContent;
