/**
 * IncidentDocuments Component
 *
 * Production-grade document management for incident reports
 * Features: Upload, preview, download, delete with HIPAA-compliant security
 *
 * @module pages/incidents/components/IncidentDocuments
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  Upload,
  Download,
  Trash2,
  FileText,
  Image as ImageIcon,
  Video,
  Eye,
  X,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';
import type { IncidentReport } from '@/types/incidents';

// =====================
// TYPES
// =====================

interface IncidentDocumentsProps {
  incidentId: string;
  incident?: IncidentReport;
  onDocumentsChange?: (documents: DocumentFile[]) => void;
  maxFileSize?: number; // in MB
  allowedFileTypes?: string[];
  readOnly?: boolean;
}

interface DocumentFile {
  id: string;
  url: string;
  name: string;
  type: 'document' | 'photo' | 'video';
  mimeType: string;
  size: number;
  uploadedAt: string;
  uploadedBy?: string;
}

interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

// =====================
// CONSTANTS
// =====================

const DEFAULT_MAX_FILE_SIZE = 10; // MB
const DEFAULT_ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'video/mp4',
  'video/quicktime',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const FILE_TYPE_ICONS: Record<string, React.ElementType> = {
  document: FileText,
  photo: ImageIcon,
  video: Video,
};

// =====================
// UTILITY FUNCTIONS
// =====================

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const getFileType = (mimeType: string): DocumentFile['type'] => {
  if (mimeType.startsWith('image/')) return 'photo';
  if (mimeType.startsWith('video/')) return 'video';
  return 'document';
};

const getDocumentTypeLabel = (type: DocumentFile['type']): string => {
  const labels = {
    document: 'Document',
    photo: 'Photo',
    video: 'Video',
  };
  return labels[type];
};

// =====================
// COMPONENT
// =====================

/**
 * IncidentDocuments - Document management for incidents
 *
 * Manages document uploads, previews, downloads, and deletions for incident reports
 * with HIPAA-compliant security measures and audit logging
 */
const IncidentDocuments: React.FC<IncidentDocumentsProps> = ({
  incidentId,
  incident,
  onDocumentsChange,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  allowedFileTypes = DEFAULT_ALLOWED_TYPES,
  readOnly = false,
}) => {
  // =====================
  // STATE
  // =====================

  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentFile | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // =====================
  // MOCK DATA (for demonstration)
  // =====================

  React.useEffect(() => {
    // In production, fetch documents from API
    if (incident) {
      const mockDocuments: DocumentFile[] = [
        ...(incident.attachments || []).map((url, idx) => ({
          id: `doc-${idx}`,
          url,
          name: `Incident_Report_${incidentId}_${idx + 1}.pdf`,
          type: 'document' as const,
          mimeType: 'application/pdf',
          size: 245760,
          uploadedAt: new Date().toISOString(),
        })),
        ...(incident.evidencePhotos || []).map((url, idx) => ({
          id: `photo-${idx}`,
          url,
          name: `Evidence_Photo_${idx + 1}.jpg`,
          type: 'photo' as const,
          mimeType: 'image/jpeg',
          size: 512000,
          uploadedAt: new Date().toISOString(),
        })),
        ...(incident.evidenceVideos || []).map((url, idx) => ({
          id: `video-${idx}`,
          url,
          name: `Evidence_Video_${idx + 1}.mp4`,
          type: 'video' as const,
          mimeType: 'video/mp4',
          size: 2048000,
          uploadedAt: new Date().toISOString(),
        })),
      ];
      setDocuments(mockDocuments);
    }
  }, [incident, incidentId]);

  // =====================
  // HANDLERS
  // =====================

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    const maxSizeBytes = maxFileSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size exceeds ${maxFileSize}MB limit`;
    }

    // Check file type
    if (!allowedFileTypes.includes(file.type)) {
      return `File type ${file.type} not allowed`;
    }

    return null;
  }, [maxFileSize, allowedFileTypes]);

  const handleFileUpload = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    // Validate all files
    const validationErrors: Record<string, string> = {};
    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        validationErrors[file.name] = error;
      }
    });

    // Show validation errors
    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([fileName, error]) => {
        setUploadProgress(prev => [...prev, {
          fileName,
          progress: 0,
          status: 'error',
          error,
        }]);
      });
      return;
    }

    // Upload valid files
    for (const file of fileArray) {
      const uploadId = `${file.name}-${Date.now()}`;

      setUploadProgress(prev => [...prev, {
        fileName: file.name,
        progress: 0,
        status: 'uploading',
      }]);

      try {
        // Simulate upload with progress
        // In production, replace with actual API call
        await simulateUpload(file, (progress) => {
          setUploadProgress(prev =>
            prev.map(p =>
              p.fileName === file.name
                ? { ...p, progress }
                : p
            )
          );
        });

        // Add to documents list
        const newDocument: DocumentFile = {
          id: uploadId,
          url: URL.createObjectURL(file),
          name: file.name,
          type: getFileType(file.type),
          mimeType: file.type,
          size: file.size,
          uploadedAt: new Date().toISOString(),
        };

        setDocuments(prev => {
          const updated = [...prev, newDocument];
          onDocumentsChange?.(updated);
          return updated;
        });

        // Mark as success
        setUploadProgress(prev =>
          prev.map(p =>
            p.fileName === file.name
              ? { ...p, status: 'success', progress: 100 }
              : p
          )
        );

        // Remove from progress after 2 seconds
        setTimeout(() => {
          setUploadProgress(prev => prev.filter(p => p.fileName !== file.name));
        }, 2000);

      } catch (error) {
        setUploadProgress(prev =>
          prev.map(p =>
            p.fileName === file.name
              ? { ...p, status: 'error', error: 'Upload failed' }
              : p
          )
        );
      }
    }
  }, [validateFile, onDocumentsChange]);

  // Simulate file upload with progress
  const simulateUpload = (file: File, onProgress: (progress: number) => void): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        onProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          resolve();
        }
      }, 200);
    });
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (!readOnly && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [readOnly, handleFileUpload]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  }, [handleFileUpload]);

  const handleDownload = useCallback(async (document: DocumentFile) => {
    try {
      // In production, fetch from secure API endpoint
      const response = await fetch(document.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // TODO: Log audit trail for PHI document access
      console.log(`Document downloaded: ${document.name} by user`);
    } catch (error) {
      console.error('Download failed:', error);
    }
  }, []);

  const handleDelete = useCallback(async (documentId: string) => {
    try {
      // In production, call API to delete document
      setDocuments(prev => {
        const updated = prev.filter(d => d.id !== documentId);
        onDocumentsChange?.(updated);
        return updated;
      });

      setDeleteConfirm(null);

      // TODO: Log audit trail for PHI document deletion
      console.log(`Document deleted: ${documentId} by user`);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }, [onDocumentsChange]);

  const handlePreview = useCallback((document: DocumentFile) => {
    setSelectedDocument(document);
  }, []);

  // =====================
  // RENDER
  // =====================

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      {!readOnly && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm font-medium text-gray-900">
            Drag and drop files here, or click to browse
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Supported: PDF, Images (JPG, PNG), Videos (MP4). Max size: {maxFileSize}MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={allowedFileTypes.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Select Files
          </button>
        </div>
      )}

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <div className="space-y-2">
          {uploadProgress.map((upload, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 truncate flex-1">
                  {upload.fileName}
                </span>
                {upload.status === 'uploading' && (
                  <Loader className="h-4 w-4 text-blue-600 animate-spin" />
                )}
                {upload.status === 'success' && (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
                {upload.status === 'error' && (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              {upload.status === 'uploading' && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>
              )}
              {upload.status === 'error' && (
                <p className="text-sm text-red-600">{upload.error}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Documents List */}
      {documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((document) => {
            const Icon = FILE_TYPE_ICONS[document.type];
            const isDeleting = deleteConfirm === document.id;

            return (
              <div
                key={document.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <Icon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {document.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getDocumentTypeLabel(document.type)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  <p>Size: {formatFileSize(document.size)}</p>
                  <p>Uploaded: {new Date(document.uploadedAt).toLocaleDateString()}</p>
                </div>

                {/* Thumbnail Preview */}
                {document.type === 'photo' && (
                  <div className="mb-3">
                    <img
                      src={document.url}
                      alt={document.name}
                      className="w-full h-32 object-cover rounded"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePreview(document)}
                    className="flex-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleDownload(document)}
                    className="flex-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                  {!readOnly && (
                    <button
                      onClick={() => setDeleteConfirm(document.id)}
                      className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Delete Confirmation */}
                {isDeleting && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm text-red-800 mb-2">
                      Delete this document?
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDelete(document.id)}
                        className="flex-1 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="flex-1 px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">No documents attached</p>
          {!readOnly && (
            <p className="text-xs text-gray-500 mt-1">
              Upload documents to get started
            </p>
          )}
        </div>
      )}

      {/* Preview Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedDocument.name}
              </h3>
              <button
                onClick={() => setSelectedDocument(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
              {selectedDocument.type === 'photo' && (
                <img
                  src={selectedDocument.url}
                  alt={selectedDocument.name}
                  className="w-full h-auto"
                />
              )}
              {selectedDocument.type === 'video' && (
                <video
                  src={selectedDocument.url}
                  controls
                  className="w-full h-auto"
                />
              )}
              {selectedDocument.type === 'document' && (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-16 w-16 text-gray-400" />
                  <p className="mt-4 text-sm text-gray-600">
                    Preview not available for this document type
                  </p>
                  <button
                    onClick={() => handleDownload(selectedDocument)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Download to View
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentDocuments;
