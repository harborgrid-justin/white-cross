/**
 * Documents main page - Document library
 *
 * @module app/documents/page
 * @description Main document management page with folders and file listing
 */

'use client';

import React, { useState } from 'react';
import { useDocuments } from '@/hooks/documents';
import { DocumentsList } from '@/components/documents';
import type { Document, DocumentFilters } from '@/types/documents';

export default function DocumentsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  const {
    documents,
    pagination,
    isLoading,
    isError,
    error,
    filters,
    setSearchQuery,
    setCategory,
    setPage,
    setSortBy,
    toggleSortDirection,
    deleteDocument,
    isDeleting
  } = useDocuments();

  const handleDocumentClick = (document: Document) => {
    // Navigate to document detail page
    window.location.href = `/documents/${document.id}`;
  };

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocuments((prev) =>
      prev.includes(document.id)
        ? prev.filter((id) => id !== document.id)
        : [...prev, document.id]
    );
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedDocuments.length} documents?`)) {
      return;
    }

    try {
      await Promise.all(selectedDocuments.map((id) => deleteDocument(id)));
      setSelectedDocuments([]);
    } catch (err) {
      console.error('Failed to delete documents:', err);
      alert('Failed to delete some documents');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="mt-2 text-gray-600">
            Manage student health records, consent forms, and medical documents
          </p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search documents..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <a
                href="/documents/upload"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload
              </a>
              <a
                href="/documents/templates"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Templates
              </a>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedDocuments.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
              <span className="text-sm text-blue-900">
                {selectedDocuments.length} document(s) selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkDelete}
                  disabled={isDeleting}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedDocuments([])}
                  className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory([])}
              className={`px-3 py-1 text-sm rounded-full ${
                !filters.category || filters.category.length === 0
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Documents
            </button>
            <button
              onClick={() => setCategory(['consent_form'])}
              className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Consent Forms
            </button>
            <button
              onClick={() => setCategory(['medical_record'])}
              className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Medical Records
            </button>
            <button
              onClick={() => setCategory(['immunization_record'])}
              className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Immunizations
            </button>
          </div>
        </div>

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">
              Failed to load documents: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        )}

        {/* Documents List */}
        <DocumentsList
          documents={documents}
          viewMode={viewMode}
          isLoading={isLoading}
          onDocumentClick={handleDocumentClick}
          onDocumentSelect={handleDocumentSelect}
          selectedIds={selectedDocuments}
          enableSelection={true}
        />

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(pagination.page - 1)}
              disabled={!pagination.hasPrevious}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              onClick={() => setPage(pagination.page + 1)}
              disabled={!pagination.hasNext}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
