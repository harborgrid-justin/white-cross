/**
 * DocumentListCard Component
 * List view card for displaying document information
 */

import React from 'react';
import { Star, Lock, AlertTriangle, User, Tag, Eye, Download, Edit, Share2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getStatusBadge,
  getAccessLevelBadge,
  getFileIcon,
  formatFileSize,
  formatDate,
  isExpiringSoon,
} from '../utils/document.utils';
import type { Document } from '../types/document.types';

interface DocumentListCardProps {
  document: Document;
  isSelected: boolean;
  onSelectToggle: (documentId: string) => void;
  onView?: (document: Document) => void;
  onDownload?: (document: Document) => void;
  onEdit?: (document: Document) => void;
  onShare?: (document: Document) => void;
  onMore?: (document: Document) => void;
}

export const DocumentListCard: React.FC<DocumentListCardProps> = ({
  document,
  isSelected,
  onSelectToggle,
  onView,
  onDownload,
  onEdit,
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
      <div className="flex items-start justify-between">
        {/* Left section: Checkbox, Icon, and Details */}
        <div className="flex items-start space-x-3 flex-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelectToggle(document.id)}
            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            aria-label={`Select document: ${document.title}`}
          />

          <FileIcon className="h-8 w-8 text-blue-500 mt-1" aria-hidden="true" />

          <div className="flex-1 min-w-0">
            {/* Title and indicators */}
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-medium text-gray-900 truncate">{document.title}</h3>
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

            {/* Filename */}
            <p className="text-sm text-gray-600 mb-1">{document.fileName}</p>

            {/* Student name */}
            {document.studentName && (
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <User className="h-4 w-4 mr-1" aria-hidden="true" />
                {document.studentName}
              </div>
            )}

            {/* Metadata */}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>{formatFileSize(document.fileSize)}</span>
              <span>v{document.version}</span>
              <span>Modified {formatDate(document.lastModified)}</span>
              <span>By {document.uploadedBy}</span>
            </div>

            {/* Badges and tags */}
            <div className="flex items-center space-x-2 mt-2">
              {getStatusBadge(document.status)}
              {getAccessLevelBadge(document.accessLevel)}

              {document.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} className="bg-gray-100 text-gray-700 text-xs">
                  <Tag className="h-3 w-3 mr-1" aria-hidden="true" />
                  {tag}
                </Badge>
              ))}

              {document.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{document.tags.length - 3} more</span>
              )}
            </div>
          </div>
        </div>

        {/* Right section: Action buttons */}
        <div className="flex items-center space-x-2 ml-4">
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(document)}
              title="View document"
              aria-label={`View ${document.title}`}
            >
              <Eye className="h-4 w-4" />
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
              <Download className="h-4 w-4" />
            </Button>
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(document)}
              title="Edit"
              aria-label={`Edit ${document.title}`}
            >
              <Edit className="h-4 w-4" />
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
              <Share2 className="h-4 w-4" />
            </Button>
          )}
          {onMore && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMore(document)}
              title="More options"
              aria-label={`More options for ${document.title}`}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
