/**
 * RecentDocumentsCard Component
 * Displays recently uploaded/modified documents in the sidebar
 */

'use client';

import React from 'react';
import { Clock, RefreshCw, Upload, Filter, Star, Lock, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RecentDocument } from './sidebar.types';
import { useSidebarFormatters } from './useSidebarFormatters';

interface RecentDocumentsCardProps {
  documents: RecentDocument[];
  maxDisplay?: number;
  onRefresh?: () => void;
  onUpload?: () => void;
  onFilter?: () => void;
  className?: string;
}

export const RecentDocumentsCard: React.FC<RecentDocumentsCardProps> = ({
  documents,
  maxDisplay = 8,
  onRefresh,
  onUpload,
  onFilter,
  className = ''
}) => {
  const { formatRelativeTime, formatFileSize, getDocumentTypeIcon } = useSidebarFormatters();

  const displayDocuments = documents.slice(0, maxDisplay);

  return (
    <Card className={className}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-600" />
            Recent Documents
          </h3>
          <Button
            variant="ghost"
            size="sm"
            title="Refresh"
            onClick={onRefresh}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {displayDocuments.map((document) => {
            const TypeIcon = getDocumentTypeIcon(document.documentType);
            return (
              <div
                key={document.id}
                className="p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center min-w-0 flex-1">
                    <TypeIcon className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h4
                        className="font-medium text-gray-900 text-sm truncate"
                        title={document.title}
                      >
                        {document.title}
                      </h4>
                      {document.studentName && (
                        <p className="text-xs text-gray-600 truncate">
                          {document.studentName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    {document.isStarred && (
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    )}
                    {document.isEncrypted && (
                      <Lock className="h-3 w-3 text-gray-500" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <User className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600 truncate">
                      {document.uploadedBy}
                    </span>
                  </div>
                  <span className="text-gray-500">
                    {formatFileSize(document.fileSize)}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <Badge
                    className={
                      document.status === 'pending_review'
                        ? 'bg-orange-100 text-orange-800'
                        : document.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                    }
                  >
                    {document.status.replace('_', ' ')}
                  </Badge>
                  <div className="text-xs text-gray-400">
                    {formatRelativeTime(document.uploadedAt)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onUpload}
          >
            <Upload className="h-4 w-4 mr-1" />
            Upload
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onFilter}
          >
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </Button>
        </div>
      </div>
    </Card>
  );
};
