import React from 'react';
import { Star, Lock, AlertTriangle, User, Tag, Eye, Download, Edit, Share2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Document } from './types';
import { 
  getFileIcon, 
  formatFileSize, 
  formatDate,
  getStatusBadgeClass, 
  getAccessLevelBadgeClass, 
  isExpiringSoon 
} from './utils';

interface DocumentListProps {
  documents: Document[];
  selectedDocuments: Set<string>;
  onDocumentSelect: (documentId: string, selected: boolean) => void;
  onDocumentView?: (document: Document) => void;
  onDocumentDownload?: (document: Document) => void;
  onDocumentEdit?: (document: Document) => void;
  onDocumentShare?: (document: Document) => void;
  onDocumentMore?: (document: Document) => void;
}

export const DocumentListComponent: React.FC<DocumentListProps> = ({
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
    <div className="space-y-4">
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
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <input
                  type="checkbox"
                  checked={selectedDocuments.has(document.id)}
                  onChange={(e) => onDocumentSelect(document.id, e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  aria-label={`Select document: ${document.title}`}
                />
                
                <FileIcon className="h-8 w-8 text-blue-500 mt-1" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-gray-900 truncate">{document.title}</h3>
                    {document.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    {document.isEncrypted && <Lock className="h-4 w-4 text-gray-500" />}
                    {expiring && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-1">{document.fileName}</p>
                  
                  {document.studentName && (
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <User className="h-4 w-4 mr-1" />
                      {document.studentName}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{formatFileSize(document.fileSize)}</span>
                    <span>v{document.version}</span>
                    <span>Modified {formatDate(document.lastModified)}</span>
                    <span>By {document.uploadedBy}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getStatusBadgeClass(document.status)}>
                      {document.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getAccessLevelBadgeClass(document.accessLevel)}>
                      {document.accessLevel.replace('_', ' ')}
                    </Badge>
                    
                    {document.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} className="bg-gray-100 text-gray-700 text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                    
                    {document.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{document.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  title="View document"
                  onClick={() => onDocumentView?.(document)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  title="Download"
                  onClick={() => onDocumentDownload?.(document)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  title="Edit"
                  onClick={() => onDocumentEdit?.(document)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                {document.sharingEnabled && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    title="Share"
                    onClick={() => onDocumentShare?.(document)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  title="More options"
                  onClick={() => onDocumentMore?.(document)}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
