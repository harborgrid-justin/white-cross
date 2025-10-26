/**
 * DocumentUploader component
 *
 * @module components/documents/DocumentUploader
 * @description Drag-and-drop document uploader with progress tracking
 */

'use client';

import React, { useCallback, useState } from 'react';
import { useDocumentUpload } from '@/hooks/documents';
import type { DocumentMetadata } from '@/types/documents';

interface DocumentUploaderProps {
  /** Folder ID to upload to */
  folderId?: string;

  /** Default metadata */
  defaultMetadata?: Partial<DocumentMetadata>;

  /** On upload success */
  onUploadSuccess?: (documentId: string) => void;

  /** On upload error */
  onUploadError?: (error: string) => void;

  /** Maximum file size in MB */
  maxFileSizeMB?: number;

  /** Allowed file types */
  allowedTypes?: string[];

  /** Authentication token */
  token?: string;
}

export function DocumentUploader({
  folderId,
  defaultMetadata,
  onUploadSuccess,
  onUploadError,
  maxFileSizeMB = 100,
  allowedTypes,
  token
}: DocumentUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const { upload, progress, status, document, error, isUploading, cancel } = useDocumentUpload({
    token,
    folderId,
    maxFileSize: maxFileSizeMB * 1024 * 1024,
    allowedTypes
  });

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        const file = files[0]; // Single file upload
        try {
          const uploadedDoc = await upload(file, {
            ...defaultMetadata,
            title: defaultMetadata?.title || file.name
          });
          onUploadSuccess?.(uploadedDoc.id);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Upload failed';
          onUploadError?.(errorMessage);
        }
      }
    },
    [upload, defaultMetadata, onUploadSuccess, onUploadError]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        try {
          const uploadedDoc = await upload(file, {
            ...defaultMetadata,
            title: defaultMetadata?.title || file.name
          });
          onUploadSuccess?.(uploadedDoc.id);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Upload failed';
          onUploadError?.(errorMessage);
        }
      }
      // Reset input
      e.target.value = '';
    },
    [upload, defaultMetadata, onUploadSuccess, onUploadError]
  );

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isUploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        `}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="sr-only"
          onChange={handleFileSelect}
          accept={allowedTypes?.join(',')}
          disabled={isUploading}
        />

        {!isUploading && !document && (
          <>
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <label
              htmlFor="file-upload"
              className="mt-4 block text-sm font-medium text-gray-900 cursor-pointer"
            >
              <span className="text-blue-600 hover:text-blue-500">Upload a file</span>
              <span className="text-gray-500"> or drag and drop</span>
            </label>
            <p className="mt-1 text-xs text-gray-500">
              {allowedTypes
                ? `Allowed types: ${allowedTypes.join(', ')}`
                : 'All file types allowed'}
            </p>
            <p className="text-xs text-gray-500">
              Maximum file size: {maxFileSizeMB}MB
            </p>
          </>
        )}

        {isUploading && progress && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-900">
              Uploading: {progress.fileName}
            </p>

            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span>{progress.percentage.toFixed(1)}%</span>
              <span>{formatBytes(progress.uploadedSize)} / {formatBytes(progress.totalSize)}</span>
            </div>

            {progress.speed > 0 && (
              <p className="text-xs text-gray-500">
                {formatBytes(progress.speed)}/s • {formatTime(progress.remainingTime)} remaining
              </p>
            )}

            <button
              type="button"
              onClick={cancel}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Cancel
            </button>
          </div>
        )}

        {status === 'complete' && document && (
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="mt-4 text-sm font-medium text-gray-900">Upload complete!</p>
            <p className="mt-1 text-xs text-gray-500">{document.file.originalName}</p>
          </div>
        )}

        {status === 'error' && error && (
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <p className="mt-4 text-sm font-medium text-red-900">Upload failed</p>
            <p className="mt-1 text-xs text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Format bytes to human-readable
 */
function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Format seconds to human-readable time
 */
function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  } else if (seconds < 3600) {
    return `${Math.round(seconds / 60)}m`;
  } else {
    return `${Math.round(seconds / 3600)}h`;
  }
}
