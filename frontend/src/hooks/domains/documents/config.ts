import { QueryClient } from '@tanstack/react-query';

// Query Keys for Documents Domain
export const DOCUMENTS_QUERY_KEYS = {
  // Documents
  documents: ['documents'] as const,
  documentsList: (filters?: any) => [...DOCUMENTS_QUERY_KEYS.documents, 'list', filters] as const,
  documentDetails: (id: string) => [...DOCUMENTS_QUERY_KEYS.documents, 'detail', id] as const,
  documentVersions: (docId: string) => [...DOCUMENTS_QUERY_KEYS.documents, docId, 'versions'] as const,
  
  // Categories
  categories: ['documents', 'categories'] as const,
  categoriesList: (filters?: any) => [...DOCUMENTS_QUERY_KEYS.categories, 'list', filters] as const,
  categoryDetails: (id: string) => [...DOCUMENTS_QUERY_KEYS.categories, 'detail', id] as const,
  
  // Templates
  templates: ['documents', 'templates'] as const,
  templatesList: (filters?: any) => [...DOCUMENTS_QUERY_KEYS.templates, 'list', filters] as const,
  templateDetails: (id: string) => [...DOCUMENTS_QUERY_KEYS.templates, 'detail', id] as const,
  
  // Shares
  shares: ['documents', 'shares'] as const,
  sharesList: (docId?: string) => [...DOCUMENTS_QUERY_KEYS.shares, 'list', docId] as const,
  shareDetails: (id: string) => [...DOCUMENTS_QUERY_KEYS.shares, 'detail', id] as const,
} as const;

// Cache Configuration
export const DOCUMENTS_CACHE_CONFIG = {
  DEFAULT_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  DEFAULT_CACHE_TIME: 10 * 60 * 1000, // 10 minutes
  DOCUMENTS_STALE_TIME: 10 * 60 * 1000, // 10 minutes
  CATEGORIES_STALE_TIME: 30 * 60 * 1000, // 30 minutes
  TEMPLATES_STALE_TIME: 15 * 60 * 1000, // 15 minutes
} as const;

// TypeScript Interfaces
export interface Document {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileUrl: string;
  thumbnailUrl?: string;
  category: DocumentCategory;
  tags: string[];
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED';
  visibility: 'PRIVATE' | 'INTERNAL' | 'PUBLIC';
  version: number;
  isLatestVersion: boolean;
  metadata: DocumentMetadata;
  permissions: DocumentPermission[];
  createdBy: DocumentUser;
  updatedBy?: DocumentUser;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  expiresAt?: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  color?: string;
  icon?: string;
  path: string;
  isActive: boolean;
}

export interface DocumentMetadata {
  pageCount?: number;
  wordCount?: number;
  language?: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  customFields: Record<string, any>;
}

export interface DocumentPermission {
  userId: string;
  user: DocumentUser;
  role: 'VIEWER' | 'EDITOR' | 'OWNER' | 'ADMIN';
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
  grantedAt: string;
  grantedBy: string;
}

export interface DocumentUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  changes: string;
  createdBy: DocumentUser;
  createdAt: string;
  isLatest: boolean;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  templateUrl: string;
  thumbnailUrl?: string;
  fields: TemplateField[];
  isPublic: boolean;
  usageCount: number;
  createdBy: DocumentUser;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'textarea';
  required: boolean;
  defaultValue?: any;
  options?: string[];
  validation?: FieldValidation;
}

export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
}

export interface DocumentShare {
  id: string;
  documentId: string;
  document: Document;
  shareType: 'LINK' | 'EMAIL' | 'INTERNAL';
  shareToken?: string;
  expiresAt?: string;
  password?: boolean;
  allowDownload: boolean;
  allowComments: boolean;
  accessCount: number;
  maxAccessCount?: number;
  recipients: ShareRecipient[];
  createdBy: DocumentUser;
  createdAt: string;
}

export interface ShareRecipient {
  id: string;
  email: string;
  name?: string;
  accessedAt?: string;
  accessCount: number;
}

export interface DocumentActivity {
  id: string;
  documentId: string;
  action: 'CREATED' | 'UPDATED' | 'VIEWED' | 'DOWNLOADED' | 'SHARED' | 'COMMENTED' | 'DELETED';
  userId: string;
  user: DocumentUser;
  details?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface DocumentComment {
  id: string;
  documentId: string;
  content: string;
  page?: number;
  position?: CommentPosition;
  parentId?: string;
  replies: DocumentComment[];
  author: DocumentUser;
  createdAt: string;
  updatedAt: string;
  isResolved: boolean;
}

export interface CommentPosition {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

// Utility Functions
export const invalidateDocumentsQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ['documents'] });
};

export const invalidateDocumentQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.documents });
};

export const invalidateCategoryQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.categories });
};

export const invalidateTemplateQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.templates });
};

export const invalidateShareQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.shares });
};
