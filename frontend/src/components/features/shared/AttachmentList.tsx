import React, { useCallback } from 'react';
import { Button } from '@/components/ui/buttons/Button';
import { Badge } from '@/components/ui/display/Badge';
import {
  File,
  FileText,
  Image,
  FileSpreadsheet,
  FileVideo,
  FileAudio,
  Download,
  Eye,
  Trash2,
  Upload,
  X
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Attachment file type
 */
export interface Attachment {
  /** Unique file ID */
  id: string;
  /** File name */
  name: string;
  /** File size in bytes */
  size: number;
  /** File type/mime type */
  type: string;
  /** File URL */
  url?: string;
  /** Upload date */
  uploadedAt?: Date | string;
  /** Uploaded by user */
  uploadedBy?: string;
  /** Upload progress (0-100) */
  uploadProgress?: number;
  /** Whether file is uploading */
  isUploading?: boolean;
  /** Whether file has error */
  hasError?: boolean;
  /** Error message */
  errorMessage?: string;
}

/**
 * AttachmentList props
 */
export interface AttachmentListProps {
  /** Array of attachments */
  attachments: Attachment[];
  /** File upload handler */
  onUpload?: (files: FileList) => void;
  /** File download handler */
  onDownload?: (attachment: Attachment) => void;
  /** File preview handler */
  onPreview?: (attachment: Attachment) => void;
  /** File delete handler */
  onDelete?: (attachment: Attachment) => void;
  /** Maximum file size in MB */
  maxFileSize?: number;
  /** Accepted file types */
  acceptedTypes?: string[];
  /** Show upload button */
  showUpload?: boolean;
  /** Upload button label */
  uploadLabel?: string;
  /** Read-only mode */
  readOnly?: boolean;
  /** Custom className */
  className?: string;
  /** Empty state message */
  emptyMessage?: string;
}

// File type to icon mapping
const getFileIcon = (type: string): React.ElementType => {
  if (type.startsWith('image/')) return Image;
  if (type.startsWith('video/')) return FileVideo;
  if (type.startsWith('audio/')) return FileAudio;
  if (type.includes('spreadsheet') || type.includes('excel')) return FileSpreadsheet;
  if (type.includes('pdf') || type.includes('document')) return FileText;
  return File;
};

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * AttachmentList - Display and manage file attachments
 *
 * @example
 * ```tsx
 * const attachments: Attachment[] = [
 *   {
 *     id: '1',
 *     name: 'medical-records.pdf',
 *     size: 1024000,
 *     type: 'application/pdf',
 *     url: '/files/medical-records.pdf',
 *     uploadedAt: new Date(),
 *     uploadedBy: 'Dr. Smith'
 *   }
 * ];
 *
 * <AttachmentList
 *   attachments={attachments}
 *   onUpload={handleUpload}
 *   onDownload={handleDownload}
 *   onDelete={handleDelete}
 *   maxFileSize={10}
 * />
 * ```
 */
export const AttachmentList: React.FC<AttachmentListProps> = ({
  attachments,
  onUpload,
  onDownload,
  onPreview,
  onDelete,
  maxFileSize = 10,
  acceptedTypes,
  showUpload = true,
  uploadLabel = 'Upload Files',
  readOnly = false,
  className,
  emptyMessage = 'No attachments'
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && onUpload) {
      onUpload(files);
      // Reset input to allow selecting the same file again
      e.target.value = '';
    }
  }, [onUpload]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Upload Button */}
      {showUpload && !readOnly && onUpload && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            accept={acceptedTypes?.join(',')}
            className="hidden"
            aria-label="File upload input"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleUploadClick}
            className="w-full sm:w-auto"
          >
            <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
            {uploadLabel}
          </Button>
          {maxFileSize && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Maximum file size: {maxFileSize}MB
            </p>
          )}
        </div>
      )}

      {/* Attachment List */}
      {attachments.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-2" role="list" aria-label="Attachments">
          {attachments.map((attachment) => {
            const Icon = getFileIcon(attachment.type);

            return (
              <div
                key={attachment.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border transition-all duration-200',
                  attachment.hasError
                    ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/10'
                    : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                )}
                role="listitem"
              >
                {/* File Icon */}
                <div className={cn(
                  'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                  attachment.hasError
                    ? 'bg-red-100 dark:bg-red-900/20'
                    : 'bg-gray-100 dark:bg-gray-700'
                )}>
                  <Icon
                    className={cn(
                      'h-5 w-5',
                      attachment.hasError
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-400'
                    )}
                    aria-hidden="true"
                  />
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {attachment.name}
                    </p>
                    {attachment.isUploading && (
                      <Badge variant="primary" size="sm">
                        Uploading...
                      </Badge>
                    )}
                    {attachment.hasError && (
                      <Badge variant="error" size="sm">
                        Error
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatFileSize(attachment.size)}</span>
                    {attachment.uploadedBy && (
                      <>
                        <span>·</span>
                        <span>{attachment.uploadedBy}</span>
                      </>
                    )}
                  </div>
                  {attachment.hasError && attachment.errorMessage && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {attachment.errorMessage}
                    </p>
                  )}
                  {attachment.isUploading && attachment.uploadProgress !== undefined && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${attachment.uploadProgress}%` }}
                          role="progressbar"
                          aria-valuenow={attachment.uploadProgress}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {!attachment.isUploading && (
                  <div className="flex items-center gap-1">
                    {onPreview && !attachment.hasError && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPreview(attachment)}
                        aria-label={`Preview ${attachment.name}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {onDownload && !attachment.hasError && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownload(attachment)}
                        aria-label={`Download ${attachment.name}`}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && !readOnly && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(attachment)}
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                        aria-label={`Delete ${attachment.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

AttachmentList.displayName = 'AttachmentList';

export default React.memo(AttachmentList);
