/**
 * DocumentBrowser Component
 * Renders documents in grid or list view with empty state
 */

import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DocumentGridCard, DocumentListCard } from './DocumentCard';
import type { Document, ViewMode } from './types/document.types';

interface DocumentBrowserProps {
  documents: Document[];
  viewMode: ViewMode;
  sortBy: 'name' | 'date' | 'size' | 'type';
  sortOrder: 'asc' | 'desc';
  selectedDocuments: Set<string>;
  onDocumentSelect: (documentId: string) => void;
  onSortOrderToggle: () => void;
  onDocumentView?: (document: Document) => void;
  onDocumentDownload?: (document: Document) => void;
  onDocumentEdit?: (document: Document) => void;
  onDocumentShare?: (document: Document) => void;
  onDocumentMore?: (document: Document) => void;
  onUploadClick?: () => void;
}

export const DocumentBrowser: React.FC<DocumentBrowserProps> = ({
  documents,
  viewMode,
  sortBy,
  sortOrder,
  selectedDocuments,
  onDocumentSelect,
  onSortOrderToggle,
  onDocumentView,
  onDocumentDownload,
  onDocumentEdit,
  onDocumentShare,
  onDocumentMore,
  onUploadClick,
}) => {
  // Empty state
  if (documents.length === 0) {
    return (
      <Card>
        <div className="p-6">
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-500 font-medium mb-2">No documents found</p>
            <p className="text-sm text-gray-400 mb-4">
              Try adjusting your filters or upload a new document.
            </p>
            {onUploadClick && (
              <Button variant="default" onClick={onUploadClick}>
                <Plus className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6">
        {/* Header with count and sort order toggle */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Documents ({documents.length})
          </h2>

          <button
            onClick={onSortOrderToggle}
            className="text-sm text-gray-500 hover:text-gray-700"
            title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
            aria-label={`Toggle sort order, currently ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'} {sortBy}
          </button>
        </div>

        {/* Document Grid or List */}
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'space-y-4'
          }
        >
          {documents.map((document) =>
            viewMode === 'grid' ? (
              <DocumentGridCard
                key={document.id}
                document={document}
                isSelected={selectedDocuments.has(document.id)}
                onSelectToggle={onDocumentSelect}
                onView={onDocumentView}
                onDownload={onDocumentDownload}
                onShare={onDocumentShare}
                onMore={onDocumentMore}
              />
            ) : (
              <DocumentListCard
                key={document.id}
                document={document}
                isSelected={selectedDocuments.has(document.id)}
                onSelectToggle={onDocumentSelect}
                onView={onDocumentView}
                onDownload={onDocumentDownload}
                onEdit={onDocumentEdit}
                onShare={onDocumentShare}
                onMore={onDocumentMore}
              />
            )
          )}
        </div>
      </div>
    </Card>
  );
};
