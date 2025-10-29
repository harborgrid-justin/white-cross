/**
 * Document services index
 *
 * @module services/documents
 * @description Central export for all document services
 */

export * from './uploadService';

/**
 * Document service utilities
 */

import type { Document, DocumentMetadata, FileMetadata } from '@/types/documents';

/**
 * Calculate MD5 checksum for file
 */
export async function calculateFileChecksum(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Extract file metadata from File object
 */
export async function extractFileMetadata(file: File): Promise<Partial<FileMetadata>> {
  const extension = file.name.split('.').pop() || '';
  const checksum = await calculateFileChecksum(file);

  return {
    originalName: file.name,
    size: file.size,
    mimeType: file.type,
    extension,
    checksum,
    virusScanStatus: 'pending'
  };
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Get file icon based on MIME type
 */
export function getFileIcon(mimeType: string): string {
  const iconMap: Record<string, string> = {
    'application/pdf': '📄',
    'image/jpeg': '🖼️',
    'image/png': '🖼️',
    'image/gif': '🖼️',
    'application/msword': '📝',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
    'application/vnd.ms-excel': '📊',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
    'text/plain': '📃',
    'text/csv': '📊'
  };

  return iconMap[mimeType] || '📎';
}

/**
 * Validate file type against allowed types
 */
export function isFileTypeAllowed(
  file: File,
  allowedTypes: string[]
): boolean {
  if (allowedTypes.length === 0) return true;

  const fileType = file.type;
  const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;

  return (
    allowedTypes.includes(fileType) ||
    allowedTypes.includes(fileExtension)
  );
}

/**
 * Check if file is an image
 */
export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

/**
 * Check if file is a PDF
 */
export function isPDFFile(mimeType: string): boolean {
  return mimeType === 'application/pdf';
}

/**
 * Check if file can be previewed
 */
export function canPreviewFile(mimeType: string): boolean {
  return isImageFile(mimeType) || isPDFFile(mimeType);
}

/**
 * Generate thumbnail data URL for image
 */
export async function generateThumbnail(
  file: File,
  maxWidth = 200,
  maxHeight = 200
): Promise<string | null> {
  if (!isImageFile(file.type)) {
    return null;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL(file.type));
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Sanitize filename (remove special characters)
 */
export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

/**
 * Parse content disposition header
 */
export function parseContentDisposition(header: string): {
  filename?: string;
  type?: string;
} {
  const parts = header.split(';').map((part) => part.trim());
  const result: { filename?: string; type?: string } = {};

  parts.forEach((part) => {
    if (part.startsWith('filename=')) {
      result.filename = part.substring(9).replace(/"/g, '');
    } else if (!part.includes('=')) {
      result.type = part;
    }
  });

  return result;
}

/**
 * Download document file
 */
export async function downloadDocument(
  document: Document,
  token?: string
): Promise<void> {
  try {
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(document.downloadUrl || document.publicUrl || '', {
      headers
    });

    if (!response.ok) {
      throw new Error('Failed to download document');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = document.file.originalName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
}

/**
 * Print document
 */
export async function printDocument(
  document: Document,
  token?: string
): Promise<void> {
  if (!canPreviewFile(document.file.mimeType)) {
    throw new Error('Document cannot be previewed for printing');
  }

  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(document.downloadUrl || document.publicUrl || '', {
    headers
  });

  if (!response.ok) {
    throw new Error('Failed to load document for printing');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = url;

  document.body.appendChild(iframe);

  iframe.onload = () => {
    iframe.contentWindow?.print();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(iframe);
    }, 100);
  };
}
