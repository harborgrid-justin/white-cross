/**
 * LOC: USACE-DOWNSTREAM-DMS-001
 * File: /reuse/frontend/composites/usace/downstream/document-management-systems.ts
 *
 * UPSTREAM (imports from):
 *   - /reuse/frontend/composites/usace/usace-document-control-composites.ts
 *   - React 18+, Next.js 16+, TypeScript 5.x
 *
 * DOWNSTREAM (imported by):
 *   - USACE document management applications
 *   - Engineering document libraries
 *   - Project document repositories
 */

/**
 * File: /reuse/frontend/composites/usace/downstream/document-management-systems.ts
 * Locator: WC-USACE-DS-DMS-001
 * Purpose: Complete Document Management System for USACE
 *
 * LLM Context: Production-ready document management system for USACE engineering documents.
 * Comprehensive document lifecycle, metadata management, search, and organization.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  useDocumentManagement,
  useVersionControl,
  useDocumentReview,
  generateDocumentMetadataForm,
  generateDocumentNumber,
  validateDocumentMetadata,
  type Document,
  type DocumentType,
  type DocumentStatus,
} from '../usace-document-control-composites';

// ============================================================================
// DOCUMENT LIBRARY BROWSER
// ============================================================================

export function DocumentLibraryBrowser({
  projectNumber,
  onDocumentSelect,
}: {
  projectNumber: string;
  onDocumentSelect?: (document: Document) => void;
}) {
  const {
    documents,
    loading,
    searchDocuments,
    getDocumentsByType,
    getDocumentsByStatus,
  } = useDocumentManagement();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<DocumentType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<DocumentStatus | 'all'>('all');

  const filteredDocuments = useMemo(() => {
    let filtered = documents;

    if (searchQuery) {
      filtered = searchDocuments(searchQuery);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(d => d.documentType === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(d => d.status === filterStatus);
    }

    return filtered;
  }, [documents, searchQuery, filterType, filterStatus, searchDocuments]);

  const documentsByType = useMemo(() => {
    const groups: Record<string, number> = {};
    documents.forEach(doc => {
      groups[doc.documentType] = (groups[doc.documentType] || 0) + 1;
    });
    return groups;
  }, [documents]);

  if (loading) {
    return <div className="p-4">Loading documents...</div>;
  }

  return (
    <div className="document-library-browser p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Document Library</h1>
        <p className="text-gray-600">Project: {projectNumber}</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Documents</div>
          <div className="text-3xl font-bold">{documents.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Approved</div>
          <div className="text-3xl font-bold text-green-600">
            {documents.filter(d => d.status === 'approved').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">In Review</div>
          <div className="text-3xl font-bold text-orange-600">
            {documents.filter(d => d.status === 'in_review').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Draft</div>
          <div className="text-3xl font-bold text-gray-600">
            {documents.filter(d => d.status === 'draft').length}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by document number, title, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Document Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as DocumentType | 'all')}
              className="w-full border rounded-lg p-2"
            >
              <option value="all">All Types</option>
              <option value="engineering_drawing">Engineering Drawing</option>
              <option value="technical_specification">Technical Specification</option>
              <option value="contract_document">Contract Document</option>
              <option value="design_report">Design Report</option>
              <option value="submittal">Submittal</option>
              <option value="rfi">RFI</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as DocumentStatus | 'all')}
              className="w-full border rounded-lg p-2"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="in_review">In Review</option>
              <option value="approved">Approved</option>
              <option value="issued_for_construction">Issued for Construction</option>
            </select>
          </div>
        </div>
      </div>

      {/* Document List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">
            Documents ({filteredDocuments.length})
          </h2>
        </div>
        <div className="divide-y">
          {filteredDocuments.map(document => (
            <div
              key={document.id}
              onClick={() => onDocumentSelect && onDocumentSelect(document)}
              className="p-4 hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="font-bold text-lg">{document.documentNumber}</div>
                  <div className="text-gray-700">{document.title}</div>
                </div>
                <div className="text-right ml-4">
                  <div className={`px-2 py-1 rounded text-sm ${
                    document.status === 'approved' ? 'bg-green-100 text-green-800' :
                    document.status === 'in_review' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {document.status.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Type:</span>
                  <div className="font-medium">{document.documentType.replace('_', ' ')}</div>
                </div>
                <div>
                  <span className="text-gray-600">Version:</span>
                  <div className="font-medium">{document.version}</div>
                </div>
                <div>
                  <span className="text-gray-600">Author:</span>
                  <div className="font-medium">{document.author.name}</div>
                </div>
                <div>
                  <span className="text-gray-600">Modified:</span>
                  <div className="font-medium">{document.modifiedDate.toLocaleDateString()}</div>
                </div>
              </div>

              {document.keywords && document.keywords.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {document.keywords.slice(0, 5).map((keyword, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DOCUMENT METADATA EDITOR
// ============================================================================

export function DocumentMetadataEditor({
  document,
  onSave,
}: {
  document: Document;
  onSave?: (document: Document) => void;
}) {
  const [metadata, setMetadata] = useState(document.metadata);
  const [keywords, setKeywords] = useState(document.keywords || []);
  const [newKeyword, setNewKeyword] = useState('');

  const validation = useMemo(() => validateDocumentMetadata(document), [document]);

  const handleSave = useCallback(() => {
    const updatedDoc = {
      ...document,
      metadata,
      keywords,
    };
    if (onSave) {
      onSave(updatedDoc);
    }
  }, [document, metadata, keywords, onSave]);

  const addKeyword = useCallback(() => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  }, [newKeyword, keywords]);

  const removeKeyword = useCallback((keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  }, [keywords]);

  return (
    <div className="document-metadata-editor p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Document Metadata</h2>

      {/* Validation Status */}
      <div className={`p-4 rounded-lg mb-6 ${
        validation.isValid ? 'bg-green-100' : 'bg-yellow-100'
      }`}>
        <div className="font-bold mb-2">
          Metadata Completeness: {validation.completeness}%
        </div>
        {!validation.isValid && validation.missingFields.length > 0 && (
          <div className="text-sm">
            Missing: {validation.missingFields.join(', ')}
          </div>
        )}
      </div>

      {/* Basic Metadata */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Project Number</label>
            <input
              type="text"
              value={metadata.projectNumber || ''}
              onChange={(e) => setMetadata({...metadata, projectNumber: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Project Name</label>
            <input
              type="text"
              value={metadata.projectName || ''}
              onChange={(e) => setMetadata({...metadata, projectName: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Discipline</label>
            <input
              type="text"
              value={metadata.discipline || ''}
              onChange={(e) => setMetadata({...metadata, discipline: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Contract Number</label>
            <input
              type="text"
              value={metadata.contractNumber || ''}
              onChange={(e) => setMetadata({...metadata, contractNumber: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Keywords */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4">Keywords</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
            placeholder="Add keyword..."
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <button
            onClick={addKeyword}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, idx) => (
            <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-2">
              {keyword}
              <button
                onClick={() => removeKeyword(keyword)}
                className="text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="bg-green-600 text-white px-6 py-3 rounded-lg"
      >
        Save Metadata
      </button>
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  DocumentLibraryBrowser,
  DocumentMetadataEditor,
};
