'use client';

/**
 * Force dynamic rendering for real-time document data
 */

import React, { useEffect } from 'react';
import { DocumentStats } from './DocumentStats';
import { DocumentFilters } from './DocumentFilters';
import { DocumentBrowser } from './DocumentBrowser';
import { DocumentsLoading } from './DocumentsLoading';
import { generateMockDocuments } from './data/mockDocuments';
import {
  useDocumentData,
  useDocumentFilters,
  useDocumentSelection,
  useDocumentStats,
  useFilteredAndSortedDocuments,
} from './hooks';
import type { Document, ViewMode, DocumentsContentProps } from './types/document.types';

const DocumentsContentRefactored: React.FC<DocumentsContentProps> = ({
  initialDocuments = [],
}) => {
  // Custom hooks for state management
  const { documents, setDocuments, loading } = useDocumentData(initialDocuments);
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
    sortBy,
    setSortBy,
    sortOrder,
    clearFilters,
    toggleSortOrder,
  } = useDocumentFilters();
  const { selectedDocuments, toggleSelection } = useDocumentSelection();
  const [viewMode, setViewMode] = React.useState<ViewMode>('grid');

  // Calculate statistics
  const stats = useDocumentStats(documents);

  // Get filtered and sorted documents
  const filteredAndSortedDocuments = useFilteredAndSortedDocuments(documents, {
    typeFilter,
    statusFilter,
    accessFilter,
    searchQuery,
    sortBy,
    sortOrder,
  });

  // Load mock data as fallback if no documents are loaded
  useEffect(() => {
    if (initialDocuments.length === 0 && documents.length === 0 && !loading) {
      setDocuments(generateMockDocuments());
    }
  }, [initialDocuments, documents.length, loading, setDocuments]);

  // Event handlers
  const handleDocumentView = (document: Document) => {
    console.log('View document:', document.id);
    // Implement view logic
  };

  const handleDocumentDownload = (document: Document) => {
    console.log('Download document:', document.id);
    // Implement download logic
  };

  const handleDocumentEdit = (document: Document) => {
    console.log('Edit document:', document.id);
    // Implement edit logic
  };

  const handleDocumentShare = (document: Document) => {
    console.log('Share document:', document.id);
    // Implement share logic
  };

  const handleDocumentMore = (document: Document) => {
    console.log('More options for document:', document.id);
    // Implement more options logic
  };

  const handleBulkDownload = () => {
    console.log('Bulk download:', Array.from(selectedDocuments));
    // Implement bulk download logic
  };

  const handleBulkShare = () => {
    console.log('Bulk share:', Array.from(selectedDocuments));
    // Implement bulk share logic
  };

  const handleBulkArchive = () => {
    console.log('Bulk archive:', Array.from(selectedDocuments));
    // Implement bulk archive logic
  };

  const handleUploadClick = () => {
    console.log('Upload document clicked');
    // Implement upload logic
  };

  // Show loading state
  if (loading) {
    return <DocumentsLoading />;
  }

  return (
    <div className="space-y-6">
      {/* Document Statistics */}
      <DocumentStats stats={stats} />

      {/* Document Management Controls */}
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
        onClearFilters={clearFilters}
        selectedCount={selectedDocuments.size}
        onBulkDownload={handleBulkDownload}
        onBulkShare={handleBulkShare}
        onBulkArchive={handleBulkArchive}
      />

      {/* Documents Browser */}
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

export default DocumentsContentRefactored;
