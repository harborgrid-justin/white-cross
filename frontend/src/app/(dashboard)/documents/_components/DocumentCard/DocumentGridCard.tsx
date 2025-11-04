/**
 * DocumentGridCard Component
 * Grid view card for displaying document information
 */

import React from 'react';
import { Star, Lock, AlertTriangle, User, Eye, Download, Share2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getStatusBadge, getAccessLevelBadge, getFileIcon, formatFileSize, isExpiringSoon } from '../utils/document.utils';
import type { Document } from '../types/document.types';

interface DocumentGridCardProps {
  document: Document;
  isSelected: boolean;
  onSelectToggle: (documentId: string) => void;
  onView?: (document: Document) => void;
  onDownload?: (document: Document) => void;
  onShare?: (document: Document) => void;
  onMore?: (document: Document) => void;
}

export const DocumentGridCard: React.FC<DocumentGridCardProps> = ({
  document,
  isSelected,
  onSelectToggle,
  onView,
  onDownload,
  onShare,
  onMore,
}) => {
  const FileIcon = getFileIcon(document.mimeType, document.documentType);
  const expiringSoon = isExpiringSoon(document.expirationDate);

  return (
    <div
      className={`border rounded-lg p-4 bg-white hover:shadow-md transition-shadow ${
        expiringSoon ? 'border-orange-200 bg-orange-50' : 'border-gray-200'
      }`}
    >
      <div className="space-y-3">
        {/* Header with checkbox and indicators */}
        <div className="flex items-start justify-between">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelectToggle(document.id)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            aria-label={`Select document: ${document.title}`}
          />

          <div className="flex items-center space-x-1">
            {document.isStarred && (
              <Star className="h-4 w-4 text-yellow-500 fill-current" aria-label="Starred document" />
            )}
            {document.isEncrypted && (
              <Lock className="h-4 w-4 text-gray-500" aria-label="Encrypted document" />
            )}
            {expiringSoon && (
              <AlertTriangle className="h-4 w-4 text-orange-500" aria-label="Expiring soon" />
            )}
          </div>
        </div>

        {/* Document icon and title */}
        <div className="text-center">
          <FileIcon className="h-12 w-12 mx-auto text-blue-500 mb-2" aria-hidden="true" />
          <h3 className="font-medium text-gray-900 text-sm truncate" title={document.title}>
            {document.title}
          </h3>
          <p className="text-xs text-gray-500 truncate" title={document.fileName}>
            {document.fileName}
          </p>
        </div>

        {/* Document details */}
        <div className="space-y-2 text-xs">
          {document.studentName && (
            <div className="flex items-center">
              <User className="h-3 w-3 mr-1 text-gray-400" aria-hidden="true" />
              <span className="text-gray-600 truncate">{document.studentName}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-gray-500">{formatFileSize(document.fileSize)}</span>
            <span className="text-gray-500">v{document.version}</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {getStatusBadge(document.status)}
            {getAccessLevelBadge(document.accessLevel)}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div className="flex space-x-1">
            {onView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(document)}
                title="View document"
                aria-label={`View ${document.title}`}
              >
                <Eye className="h-3 w-3" />
              </Button>
            )}
            {onDownload && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDownload(document)}
                title="Download"
                aria-label={`Download ${document.title}`}
              >
                <Download className="h-3 w-3" />
              </Button>
            )}
            {document.sharingEnabled && onShare && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShare(document)}
                title="Share"
                aria-label={`Share ${document.title}`}
              >
                <Share2 className="h-3 w-3" />
              </Button>
            )}
          </div>

          {onMore && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMore(document)}
              title="More options"
              aria-label={`More options for ${document.title}`}
            >
              <MoreVertical className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
