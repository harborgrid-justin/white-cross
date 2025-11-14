import React from 'react';
import { Star, Lock, AlertTriangle, User, Eye, Download, Edit, Share2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Document } from './types';
import { 
  getFileIcon, 
  formatFileSize, 
  getStatusBadgeClass, 
  getAccessLevelBadgeClass, 
  isExpiringSoon 
} from './utils';

interface DocumentGridProps {
  documents: Document[];
  selectedDocuments: Set<string>;
  onDocumentSelect: (documentId: string, selected: boolean) => void;
  onDocumentView?: (document: Document) => void;
  onDocumentDownload?: (document: Document) => void;
  onDocumentEdit?: (document: Document) => void;
  onDocumentShare?: (document: Document) => void;
  onDocumentMore?: (document: Document) => void;
}

export const DocumentGridComponent: React.FC<DocumentGridProps> = ({
  documents,
  selectedDocuments,
  onDocumentSelect,
  onDocumentView,
  onDocumentDownload,
  onDocumentEdit,
  onDocumentShare,
  onDocumentMore
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {documents.map((document) => {
        const FileIcon = getFileIcon(document.mimeType, document.documentType);
        const expiring = isExpiringSoon(document.expirationDate);
        
        return (
          <div
            key={document.id}
            className={`border rounded-lg p-4 hover:shadow-md transition-shadow bg-white ${
              expiring ? 'border-orange-200 bg-orange-50' : 'border-gray-200'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <input
                  type="checkbox"
                  checked={selectedDocuments.has(document.id)}
                  onChange={(e) => onDocumentSelect(document.id, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  aria-label={`Select document: ${document.title}`}
                />
                
                <div className="flex items-center space-x-1">
                  {document.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                  {document.isEncrypted && <Lock className="h-4 w-4 text-gray-500" />}
                  {expiring && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                </div>
              </div>

              <div className="text-center">
                <FileIcon className="h-12 w-12 mx-auto text-blue-500 mb-2" />
                <h3 className="font-medium text-gray-900 text-sm truncate" title={document.title}>
                  {document.title}
                </h3>
                <p className="text-xs text-gray-500 truncate" title={document.fileName}>
                  {document.fileName}
                </p>
              </div>

              <div className="space-y-2 text-xs">
                {document.studentName && (
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1 text-gray-400" />
                    <span className="text-gray-600 truncate">{document.studentName}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">{formatFileSize(document.fileSize)}</span>
                  <span className="text-gray-500">v{document.version}</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  <Badge className={getStatusBadgeClass(document.status)}>
                    {document.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={getAccessLevelBadgeClass(document.accessLevel)}>
                    {document.accessLevel.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    title="View document"
                    onClick={() => onDocumentView?.(document)}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    title="Download"
                    onClick={() => onDocumentDownload?.(document)}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  {document.sharingEnabled && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      title="Share"
                      onClick={() => onDocumentShare?.(document)}
                    >
                      <Share2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  title="More options"
                  onClick={() => onDocumentMore?.(document)}
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
