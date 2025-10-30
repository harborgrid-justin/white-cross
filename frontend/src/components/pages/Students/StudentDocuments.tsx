/**
 * @fileoverview Student Documents Component
 * 
 * Component for managing and displaying student documents and files.
 * 
 * @module components/pages/Students/StudentDocuments
 * @since 1.0.0
 */

'use client';

import { useState } from 'react';
import { FileText, Download, Eye, Upload, Plus, Edit, Trash2, Calendar, Lock, Shield } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'health_record' | 'enrollment' | 'academic' | 'behavior' | 'legal' | 'other';
  fileType: 'pdf' | 'doc' | 'docx' | 'jpg' | 'png' | 'other';
  size: number;
  uploadDate: string;
  uploadedBy: string;
  lastModified?: string;
  isConfidential: boolean;
  description?: string;
  tags?: string[];
  url?: string;
  expirationDate?: string;
  requiresSignature?: boolean;
  signedBy?: {
    name: string;
    role: string;
    date: string;
  }[];
}

interface StudentDocumentsProps {
  studentId: string;
  studentName: string;
  documents: Document[];
  onUploadDocument?: () => void;
  onViewDocument?: (documentId: string) => void;
  onDownloadDocument?: (documentId: string) => void;
  onEditDocument?: (documentId: string) => void;
  onDeleteDocument?: (documentId: string) => void;
  canUpload?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}

/**
 * Student Documents Component
 * 
 * Displays and manages student documents with categorization,
 * access controls, and file management capabilities.
 */
export function StudentDocuments({
  studentId,
  studentName,
  documents,
  onUploadDocument,
  onViewDocument,
  onDownloadDocument,
  onEditDocument,
  onDeleteDocument,
  canUpload = true,
  canEdit = true,
  canDelete = false
}: StudentDocumentsProps) {
  const [filterType, setFilterType] = useState<'all' | Document['type']>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocuments = documents.filter(doc => {
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesSearch = searchQuery === '' || 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesType && matchesSearch;
  });

  const getTypeColor = (type: string) => {
    const colors = {
      health_record: 'bg-red-100 text-red-800',
      enrollment: 'bg-blue-100 text-blue-800',
      academic: 'bg-green-100 text-green-800',
      behavior: 'bg-yellow-100 text-yellow-800',
      legal: 'bg-purple-100 text-purple-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      health_record: 'Health Record',
      enrollment: 'Enrollment',
      academic: 'Academic',
      behavior: 'Behavior',
      legal: 'Legal',
      other: 'Other'
    };
    return labels[type as keyof typeof labels] || 'Other';
  };

  const getFileIcon = (fileType: string) => {
    // For simplicity, using FileText for all file types
    return <FileText className="h-5 w-5 text-blue-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isExpiringSoon = (expirationDate?: string) => {
    if (!expirationDate) return false;
    const expiry = new Date(expirationDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = (expirationDate?: string) => {
    if (!expirationDate) return false;
    return new Date(expirationDate) < new Date();
  };

  const documentCounts = {
    all: documents.length,
    health_record: documents.filter(d => d.type === 'health_record').length,
    enrollment: documents.filter(d => d.type === 'enrollment').length,
    academic: documents.filter(d => d.type === 'academic').length,
    behavior: documents.filter(d => d.type === 'behavior').length,
    legal: documents.filter(d => d.type === 'legal').length,
    other: documents.filter(d => d.type === 'other').length
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Documents</h2>
            <p className="text-sm text-gray-600">{studentName}</p>
          </div>
          {canUpload && (
            <button
              onClick={onUploadDocument}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-lg">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Type Filter */}
          <div className="flex space-x-2">
            {Object.entries(documentCounts).map(([type, count]) => (
              <button
                key={type}
                onClick={() => setFilterType(type as typeof filterType)}
                className={`${
                  filterType === type
                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                    : 'bg-white text-gray-500 border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium`}
              >
                {type === 'all' ? 'All' : getTypeLabel(type)} ({count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Document List */}
      <div className="divide-y divide-gray-200">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((document) => (
            <div key={document.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {getFileIcon(document.fileType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {document.name}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(document.type)}`}>
                        {getTypeLabel(document.type)}
                      </span>
                      {document.isConfidential && (
                        <Lock className="h-4 w-4 text-red-500" title="Confidential Document" />
                      )}
                      {document.requiresSignature && (
                        <Shield className="h-4 w-4 text-blue-500" title="Requires Signature" />
                      )}
                    </div>

                    {document.description && (
                      <p className="mt-1 text-sm text-gray-600 truncate">
                        {document.description}
                      </p>
                    )}

                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>{formatFileSize(document.size)}</span>
                      <span>•</span>
                      <span>Uploaded {formatDate(document.uploadDate)}</span>
                      <span>•</span>
                      <span>by {document.uploadedBy}</span>
                      {document.lastModified && (
                        <>
                          <span>•</span>
                          <span>Modified {formatDate(document.lastModified)}</span>
                        </>
                      )}
                    </div>

                    {/* Tags */}
                    {document.tags && document.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {document.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Expiration Warning */}
                    {document.expirationDate && (
                      <div className="mt-2">
                        {isExpired(document.expirationDate) ? (
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <Calendar className="h-3 w-3 mr-1" />
                            Expired {formatDate(document.expirationDate)}
                          </div>
                        ) : isExpiringSoon(document.expirationDate) ? (
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Calendar className="h-3 w-3 mr-1" />
                            Expires {formatDate(document.expirationDate)}
                          </div>
                        ) : (
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <Calendar className="h-3 w-3 mr-1" />
                            Expires {formatDate(document.expirationDate)}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Signatures */}
                    {document.signedBy && document.signedBy.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">
                          Signed by: {document.signedBy.map(sig => `${sig.name} (${sig.role})`).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => onViewDocument?.(document.id)}
                    className="text-gray-400 hover:text-gray-600"
                    title="View document"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDownloadDocument?.(document.id)}
                    className="text-gray-400 hover:text-gray-600"
                    title="Download document"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  {canEdit && (
                    <button
                      onClick={() => onEditDocument?.(document.id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit document details"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => onDeleteDocument?.(document.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {searchQuery ? 'No documents found' : 'No documents uploaded'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery 
                ? 'Try adjusting your search criteria or document type filter.'
                : 'Upload documents to keep important student records organized and accessible.'
              }
            </p>
            {canUpload && !searchQuery && (
              <div className="mt-6">
                <button
                  onClick={onUploadDocument}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload First Document
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Document Summary */}
      {documents.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <span className="font-medium">{filteredDocuments.length}</span> of{' '}
              <span className="font-medium">{documents.length}</span> documents shown
            </div>
            <div className="flex items-center space-x-4">
              {documents.some(doc => doc.isConfidential) && (
                <div className="flex items-center">
                  <Lock className="h-4 w-4 text-red-500 mr-1" />
                  <span>Confidential documents present</span>
                </div>
              )}
              {documents.some(doc => isExpired(doc.expirationDate)) && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-red-500 mr-1" />
                  <span>Expired documents present</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
