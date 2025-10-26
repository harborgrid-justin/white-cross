/**
 * DocumentsList component
 *
 * @module components/documents/DocumentsList
 * @description Displays list of documents in grid or list view
 */

'use client';

import React from 'react';
import type { Document } from '@/types/documents';
import { formatFileSize, getFileIcon } from '@/services/documents';

interface DocumentsListProps {
  /** Documents to display */
  documents: Document[];

  /** View mode */
  viewMode?: 'grid' | 'list';

  /** Loading state */
  isLoading?: boolean;

  /** On document click */
  onDocumentClick?: (document: Document) => void;

  /** On document select */
  onDocumentSelect?: (document: Document) => void;

  /** Selected document IDs */
  selectedIds?: string[];

  /** Enable selection */
  enableSelection?: boolean;

  /** Empty state message */
  emptyMessage?: string;
}

export function DocumentsList({
  documents,
  viewMode = 'grid',
  isLoading = false,
  onDocumentClick,
  onDocumentSelect,
  selectedIds = [],
  enableSelection = false,
  emptyMessage = 'No documents found'
}: DocumentsListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {documents.map((document) => (
          <DocumentCard
            key={document.id}
            document={document}
            onClick={() => onDocumentClick?.(document)}
            onSelect={enableSelection ? () => onDocumentSelect?.(document) : undefined}
            isSelected={selectedIds.includes(document.id)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((document) => (
        <DocumentListItem
          key={document.id}
          document={document}
          onClick={() => onDocumentClick?.(document)}
          onSelect={enableSelection ? () => onDocumentSelect?.(document) : undefined}
          isSelected={selectedIds.includes(document.id)}
        />
      ))}
    </div>
  );
}

/**
 * Document card for grid view
 */
interface DocumentCardProps {
  document: Document;
  onClick?: () => void;
  onSelect?: () => void;
  isSelected?: boolean;
}

function DocumentCard({ document, onClick, onSelect, isSelected }: DocumentCardProps) {
  const icon = getFileIcon(document.file.mimeType);

  return (
    <div
      className={`
        relative bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer
        ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}
      `}
      onClick={onClick}
    >
      {onSelect && (
        <div className="absolute top-2 right-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
          />
        </div>
      )}

      <div className="flex flex-col items-center">
        <div className="text-4xl mb-3">{icon}</div>

        <h3 className="text-sm font-medium text-gray-900 text-center line-clamp-2 mb-1">
          {document.metadata.title}
        </h3>

        <p className="text-xs text-gray-500">{formatFileSize(document.file.size)}</p>

        {document.metadata.category && (
          <span className="mt-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
            {document.metadata.category.replace('_', ' ')}
          </span>
        )}

        {document.metadata.isPHI && (
          <span className="mt-1 px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
            PHI
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Document list item for list view
 */
function DocumentListItem({ document, onClick, onSelect, isSelected }: DocumentCardProps) {
  const icon = getFileIcon(document.file.mimeType);

  return (
    <div
      className={`
        flex items-center p-4 bg-white border rounded-lg hover:shadow-sm transition-shadow cursor-pointer
        ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}
      `}
      onClick={onClick}
    >
      {onSelect && (
        <div className="mr-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
          />
        </div>
      )}

      <div className="text-2xl mr-4">{icon}</div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {document.metadata.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {formatFileSize(document.file.size)} • {new Date(document.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex items-center gap-2 ml-4">
        {document.metadata.isPHI && (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
            PHI
          </span>
        )}
        {document.metadata.category && (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
            {document.metadata.category.replace('_', ' ')}
          </span>
        )}
        {document.status === 'pending_review' && (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
            Pending Review
          </span>
        )}
      </div>
    </div>
  );
}
