/**
 * Document Utility Functions
 * Pure utility functions for document formatting, badges, and icons
 */

import React from 'react';
import {
  FileText,
  FileImage,
  FileVideo,
  File,
  Shield,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { DocumentType, DocumentStatus, AccessLevel } from '../types/document.types';

/**
 * Get status badge component with appropriate styling
 */
export const getStatusBadge = (status: DocumentStatus): React.ReactElement => {
  const variants: Record<DocumentStatus, string> = {
    active: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
    pending_review: 'bg-yellow-100 text-yellow-800',
    expired: 'bg-red-100 text-red-800',
    requires_update: 'bg-orange-100 text-orange-800',
    confidential: 'bg-purple-100 text-purple-800',
  };

  return (
    <Badge className={variants[status]}>
      {status.replace('_', ' ')}
    </Badge>
  );
};

/**
 * Get access level badge component with appropriate styling
 */
export const getAccessLevelBadge = (accessLevel: AccessLevel): React.ReactElement => {
  const variants: Record<AccessLevel, string> = {
    public: 'bg-blue-100 text-blue-800',
    staff_only: 'bg-yellow-100 text-yellow-800',
    nurse_only: 'bg-orange-100 text-orange-800',
    admin_only: 'bg-red-100 text-red-800',
    restricted: 'bg-purple-100 text-purple-800',
  };

  return (
    <Badge className={variants[accessLevel]}>
      {accessLevel.replace('_', ' ')}
    </Badge>
  );
};

/**
 * Get appropriate file icon based on mime type and document type
 */
export const getFileIcon = (
  mimeType: string,
  documentType: DocumentType
): React.ComponentType<{ className?: string }> => {
  if (mimeType.startsWith('image/')) return FileImage;
  if (mimeType.startsWith('video/')) return FileVideo;
  if (mimeType.includes('pdf')) return FileText;
  if (documentType === 'medical_record') return Shield;
  return File;
};

/**
 * Format file size in bytes to human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format date string to localized date/time format
 */
export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Check if a document is expiring soon (within 7 days)
 */
export const isExpiringSoon = (expirationDate?: string): boolean => {
  if (!expirationDate) return false;
  const now = new Date();
  const expiry = new Date(expirationDate);
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return expiry <= sevenDaysFromNow && expiry > now;
};
