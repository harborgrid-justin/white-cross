/**
 * @fileoverview Documents Type Definitions
 * @module types/documents
 *
 * @description
 * TypeScript type definitions for document management.
 * Provides type safety for document data structures.
 *
 * @since 1.0.0
 */

export interface Document {
  id: string | number
  name: string
  fileName: string
  fileType: string
  fileSize: number
  category?: string
  description?: string
  url?: string
  thumbnailUrl?: string
  uploadedBy: string
  uploadedAt: string | Date
  tags?: string[]
  status: 'active' | 'archived' | 'deleted'
  accessLevel?: 'public' | 'private' | 'restricted'
  relatedTo?: {
    type: 'student' | 'staff' | 'incident' | 'medication' | 'other'
    id: string | number
  }
  metadata?: Record<string, unknown>
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface DocumentCategory {
  id: string | number
  name: string
  description?: string
  icon?: string
  documentCount?: number
}

export interface DocumentUploadProgress {
  fileName: string
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
}

export interface DocumentFilter {
  search?: string
  category?: string
  fileType?: string
  uploadedBy?: string
  dateFrom?: string | Date
  dateTo?: string | Date
  tags?: string[]
}

export interface DocumentMetadata {
  title?: string
  description?: string
  author?: string
  keywords?: string[]
  customFields?: Record<string, unknown>
}
