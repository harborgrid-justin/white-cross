import { 
  FileImage,
  FileVideo,
  FileText,
  File,
  Shield
} from 'lucide-react';
import { DocumentType, DocumentStatus, AccessLevel } from './types';

// Utility functions
export const getStatusBadgeClass = (status: DocumentStatus): string => {
  const variants = {
    active: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
    pending_review: 'bg-yellow-100 text-yellow-800',
    expired: 'bg-red-100 text-red-800',
    requires_update: 'bg-orange-100 text-orange-800',
    confidential: 'bg-purple-100 text-purple-800'
  };
  return variants[status];
};

export const getAccessLevelBadgeClass = (accessLevel: AccessLevel): string => {
  const variants = {
    public: 'bg-blue-100 text-blue-800',
    staff_only: 'bg-yellow-100 text-yellow-800',
    nurse_only: 'bg-orange-100 text-orange-800',
    admin_only: 'bg-red-100 text-red-800',
    restricted: 'bg-purple-100 text-purple-800'
  };
  return variants[accessLevel];
};

export const getFileIcon = (mimeType: string, documentType: DocumentType) => {
  if (mimeType.startsWith('image/')) return FileImage;
  if (mimeType.startsWith('video/')) return FileVideo;
  if (mimeType.includes('pdf')) return FileText;
  if (documentType === 'medical_record') return Shield;
  return File;
};

export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const isExpiringSoon = (expirationDate?: string): boolean => {
  if (!expirationDate) return false;
  const now = new Date();
  const expiry = new Date(expirationDate);
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return expiry <= sevenDaysFromNow && expiry > now;
};
