/**
 * FileDropzone Component
 *
 * Drag-and-drop file upload component with validation and preview.
 */

'use client';

import React, { useCallback, useState } from 'react';
import type { ImportFormat } from '../types';

// ============================================================================
// Types
// ============================================================================

export interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  acceptedFormats?: ImportFormat[];
  maxSize?: number; // in bytes
  disabled?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function FileDropzone({
  onFileSelect,
  acceptedFormats = ['csv', 'excel', 'json'],
  maxSize = 100 * 1024 * 1024, // 100MB default
  disabled = false,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Validates file format and size
   */
  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file size
      if (file.size > maxSize) {
        return `File size exceeds maximum allowed size (${Math.round(maxSize / 1024 / 1024)}MB)`;
      }

      // Check file format
      const extension = file.name.split('.').pop()?.toLowerCase();
      const formatMap: Record<string, ImportFormat> = {
        csv: 'csv',
        xlsx: 'excel',
        xls: 'excel',
        json: 'json',
      };

      const format = extension ? formatMap[extension] : null;
      if (!format || !acceptedFormats.includes(format)) {
        return `Invalid file format. Accepted formats: ${acceptedFormats.join(', ')}`;
      }

      return null;
    },
    [maxSize, acceptedFormats]
  );

  /**
   * Handles file selection
   */
  const handleFileSelect = useCallback(
    (file: File) => {
      const validationError = validateFile(file);

      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);
      onFileSelect(file);
    },
    [validateFile, onFileSelect]
  );

  /**
   * Handles drag over event
   */
  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  /**
   * Handles drag leave event
   */
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  /**
   * Handles drop event
   */
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) {
        return;
      }

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [disabled, handleFileSelect]
  );

  /**
   * Handles file input change
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  /**
   * Formats file size for display
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center
          transition-colors duration-200
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (!disabled) {
            document.getElementById('file-input')?.click();
          }
        }}
      >
        <input
          id="file-input"
          type="file"
          className="hidden"
          accept={acceptedFormats.map((f) => `.${f === 'excel' ? 'xlsx,xls' : f}`).join(',')}
          onChange={handleInputChange}
          disabled={disabled}
        />

        <div className="space-y-4">
          {/* Icon */}
          <div className="flex justify-center">
            <svg
              className="w-16 h-16 text-gray-400"
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
          </div>

          {/* Text */}
          <div>
            <p className="text-lg font-medium text-gray-700">
              Drop your file here or click to browse
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Accepted formats: {acceptedFormats.join(', ').toUpperCase()}
            </p>
            <p className="text-sm text-gray-500">
              Maximum size: {formatFileSize(maxSize)}
            </p>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
