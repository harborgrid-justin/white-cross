/**
 * Sidebar-specific Types and Interfaces
 * Type definitions for document sidebar components
 */

import { DocumentType, DocumentStatus, AccessLevel } from '../types/document.types';

export interface RecentDocument {
  id: string;
  title: string;
  fileName: string;
  documentType: DocumentType;
  studentName?: string;
  uploadedBy: string;
  uploadedAt: string;
  fileSize: number;
  status: DocumentStatus;
  accessLevel: AccessLevel;
  isStarred: boolean;
  isEncrypted: boolean;
}

export interface DocumentActivity {
  id: string;
  type: 'uploaded' | 'downloaded' | 'shared' | 'modified' | 'reviewed' | 'expired';
  documentTitle: string;
  studentName?: string;
  user: string;
  timestamp: string;
  description: string;
}

export interface DocumentAlert {
  id: string;
  type: 'expiring_soon' | 'pending_review' | 'access_violation' | 'storage_warning';
  title: string;
  description: string;
  count?: number;
  severity: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
}

export interface QuickStats {
  recentUploads: number;
  pendingReview: number;
  encryptedDocs: number;
  starredDocs: number;
}

export interface SidebarData {
  recentDocuments: RecentDocument[];
  recentActivity: DocumentActivity[];
  documentAlerts: DocumentAlert[];
  quickStats: QuickStats;
}
