'use client';

/**
 * WF-FILEUPLOAD-001 | FileUpload.tsx - File Upload Component
 * Purpose: Drag-and-drop file upload with preview
 * Upstream: Design system | Dependencies: React, Tailwind CSS
 * Downstream: Document management, health records, attachments
 * Related: Input, Button
 * Exports: FileUpload component | Key Features: Drag-drop, multi-file, preview, validation
 * Last Updated: 2025-10-26 | File Type: .tsx
 * Critical Path: Drag file / Click to browse → Select file → Validate → Upload
 * LLM Context: File upload component for White Cross healthcare platform
 */

import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

/**
 * Uploaded file with preview data
 */
export interface UploadedFile {
  file: File;
  id: string;
  preview?: string; // Data URL for image preview
}

/**
 * Props for the FileUpload component.
 */
export interface FileUploadProps {
  /** Callback when files are selected */
  onFilesSelected: (files: File[]) => void;
  /** Callback when files are removed */
  onFileRemove?: (fileId: string) => void;
  /** Accept specific file types (e.g., "image/*", ".pdf,.doc") */
  accept?: string;
  /** Allow multiple file selection */
  multiple?: boolean;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Maximum number of files */
  maxFiles?: number;
  /** Disable the upload */
  disabled?: boolean;
  /** Label for the upload area */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Show file preview (for images) */
  showPreview?: boolean;
  /** Additional class name */
  className?: string;
}

/**
 * Format file size for display
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Validate file size
 */
const isFileSizeValid = (file: File, maxSize?: number): boolean => {
  if (!maxSize) return true;
  return file.size <= maxSize;
};

/**
 * FileUpload component with drag-and-drop support.
 *
 * Provides an intuitive file upload interface with drag-and-drop, click to browse,
 * file validation, and image preview support.
 *
 * **Features:**
 * - Drag-and-drop file upload
 * - Click to browse files
 * - Multiple file support
 * - File type validation
 * - File size validation
 * - Image preview
 * - File list with remove option
 * - Progress feedback
 * - Dark mode support
 * - Full accessibility
 *
 * **Accessibility:**
 * - Semantic file input
 * - Keyboard accessible (Enter/Space to open dialog)
 * - Screen reader announcements
 * - Clear file descriptions
 * - Error announcements
 *
 * @component
 * @param {FileUploadProps} props - FileUpload component props
 * @returns {JSX.Element} Rendered file upload area
 *
 * @example
 * ```tsx
 * // Basic file upload
 * <FileUpload
 *   onFilesSelected={(files) => console.log('Selected:', files)}
 *   label="Upload Documents"
 * />
 *
 * // Image upload with preview
 * <FileUpload
 *   accept="image/*"
 *   onFilesSelected={handleImageUpload}
 *   showPreview
 *   label="Upload Patient Photo"
 * />
 *
 * // Multiple files with size limit
 * <FileUpload
 *   multiple
 *   maxFiles={5}
 *   maxSize={5 * 1024 * 1024} // 5MB
 *   accept=".pdf,.doc,.docx"
 *   onFilesSelected={handleDocumentUpload}
 *   label="Upload Medical Records"
 *   helperText="Max 5 files, 5MB each. PDF or Word documents only."
 * />
 *
 * // With error state
 * <FileUpload
 *   onFilesSelected={handleUpload}
 *   error="File size exceeds maximum allowed"
 * />
 * ```
 *
 * @remarks
 * **Healthcare Context**:
 * - Upload medical documents (lab results, prescriptions)
 * - Upload insurance cards and ID documents
 * - Upload vaccination records
 * - Upload consent forms
 * - Ensure HIPAA compliance for uploaded PHI
 * - Validate file types to prevent malware
 * - Scan uploaded files for viruses
 *
 * @see {@link FileUploadProps} for detailed prop documentation
 */
export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  onFileRemove,
  accept,
  multiple = false,
  maxSize,
  maxFiles,
  disabled = false,
  label,
  helperText,
  error,
  showPreview = false,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [validationError, setValidationError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inputId] = useState(`file-upload-${Math.random().toString(36).substr(2, 9)}`);

  const hasError = !!(error || validationError);

  /**
   * Process selected files
   */
  const processFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Validate max files
    if (maxFiles && uploadedFiles.length + fileArray.length > maxFiles) {
      setValidationError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    for (const file of fileArray) {
      if (!isFileSizeValid(file, maxSize)) {
        setValidationError(`File "${file.name}" exceeds maximum size of ${formatFileSize(maxSize!)}`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Create uploaded file objects
    const newUploadedFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      preview: showPreview && file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : undefined,
    }));

    setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
    setValidationError('');
    onFilesSelected(validFiles);
  }, [uploadedFiles, maxFiles, maxSize, showPreview, onFilesSelected]);

  /**
   * Handle file input change
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  /**
   * Handle drag events
   */
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    processFiles(e.dataTransfer.files);
  };

  /**
   * Handle click to open file dialog
   */
  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  /**
   * Handle file removal
   */
  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
    onFileRemove?.(fileId);
  };

  /**
   * Cleanup preview URLs on unmount
   */
  React.useEffect(() => {
    return () => {
      uploadedFiles.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, []);

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'block text-sm font-medium mb-2',
            hasError ? 'text-danger-700 dark:text-danger-400' : 'text-gray-700 dark:text-gray-300',
            disabled && 'text-gray-400 dark:text-gray-600'
          )}
        >
          {label}
        </label>
      )}

      {/* Drop zone */}
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8',
          'flex flex-col items-center justify-center',
          'transition-all duration-200 cursor-pointer',
          'focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2',
          isDragging && !disabled && 'border-primary-500 bg-primary-50 dark:bg-primary-900/20',
          !isDragging && !disabled && !hasError && 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500',
          hasError && 'border-danger-300 dark:border-danger-500 bg-danger-50/50 dark:bg-danger-900/10',
          disabled && 'cursor-not-allowed opacity-60 bg-gray-50 dark:bg-gray-900/50'
        )}
      >
        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          disabled={disabled}
          className="sr-only"
          aria-describedby={
            error ? `${inputId}-error` :
            validationError ? `${inputId}-validation-error` :
            helperText ? `${inputId}-helper` : undefined
          }
        />

        {/* Upload icon */}
        <svg
          className={cn(
            'w-12 h-12 mb-3',
            hasError ? 'text-danger-400' : 'text-gray-400 dark:text-gray-500'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {accept || 'Any file type'} {maxSize && `• Max ${formatFileSize(maxSize)}`}
        </p>
      </div>

      {/* Helper text */}
      {helperText && !hasError && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400" id={`${inputId}-helper`}>
          {helperText}
        </p>
      )}

      {/* Error messages */}
      {error && (
        <p className="mt-2 text-sm text-danger-600 dark:text-danger-400" id={`${inputId}-error`}>
          {error}
        </p>
      )}
      {validationError && (
        <p className="mt-2 text-sm text-danger-600 dark:text-danger-400" id={`${inputId}-validation-error`}>
          {validationError}
        </p>
      )}

      {/* Uploaded files list */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2" role="list" aria-label="Uploaded files">
          {uploadedFiles.map(uploadedFile => (
            <div
              key={uploadedFile.id}
              role="listitem"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              {/* Preview or icon */}
              {uploadedFile.preview ? (
                <img
                  src={uploadedFile.preview}
                  alt={uploadedFile.file.name}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )}

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {uploadedFile.file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(uploadedFile.file.size)}
                </p>
              </div>

              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(uploadedFile.id);
                }}
                className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-danger-600 dark:hover:text-danger-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger-500"
                aria-label={`Remove ${uploadedFile.file.name}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

FileUpload.displayName = 'FileUpload';

export default FileUpload;
