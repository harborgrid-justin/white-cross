/**
 * Document Search and Filter Types Module
 * Types for searching and filtering documents
 * Dependencies: enums.ts, core.ts, utilities.ts
 */

import { DocumentCategory, DocumentStatus, DocumentAccessLevel } from './enums';
import { Document, DocumentVersion } from './core';
import { DocumentSortField, DocumentSortOrder } from './utilities';

/**
 * Document Filters
 * All available filters for document queries
 */
export interface DocumentFilters {
  page?: number;
  limit?: number;
  pageSize?: number; // Alternative pagination size parameter
  folderId?: string; // Filter by folder/directory
  isPHI?: boolean; // Filter by PHI status
  category?: DocumentCategory;
  status?: DocumentStatus;
  studentId?: string;
  uploadedBy?: string;
  searchTerm?: string;
  tags?: string[];
  accessLevel?: DocumentAccessLevel;
  dateFrom?: string;
  dateTo?: string;
  retentionDateFrom?: string;
  retentionDateTo?: string;
  isTemplate?: boolean;
  hasSignatures?: boolean;
}

/**
 * Document Search Parameters
 * Extended search parameters with sorting and advanced filters
 */
export interface DocumentSearchParams extends DocumentFilters {
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'category' | 'status' | 'fileSize';
  sortOrder?: 'ASC' | 'DESC';
  includeArchived?: boolean;
  includeExpired?: boolean;
}

/**
 * Advanced Search Filters
 * Extended filtering options for document search
 */
export interface AdvancedSearchFilters extends DocumentFilters {
  fullTextSearch?: string;
  tags?: string[];
  metadataFilters?: Record<string, unknown>;
  uploadedByIds?: string[];
  sharedWithIds?: string[];
  signedStatus?: 'SIGNED' | 'UNSIGNED' | 'PENDING';
  hasAttachments?: boolean;
  minVersion?: number;
  maxVersion?: number;
  retentionStatus?: 'ACTIVE' | 'ARCHIVED' | 'EXPIRED';
}

/**
 * Search Sort Options
 * Configuration for sorting search results
 */
export interface SearchSortOptions {
  field: DocumentSortField;
  order: DocumentSortOrder;
}

/**
 * Search Documents Request
 * Full request payload for advanced document search
 */
export interface SearchDocumentsRequest {
  query?: string;
  filters?: AdvancedSearchFilters;
  sortOptions?: SearchSortOptions;
  page?: number;
  pageSize?: number;
  includeArchived?: boolean;
}

/**
 * Search Results
 * Response containing search results with metadata
 */
export interface SearchResults {
  documents: Document[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  facets?: {
    categories?: Record<DocumentCategory, number>;
    statuses?: Record<DocumentStatus, number>;
    years?: Record<string, number>;
  };
  suggestions?: string[];
}

/**
 * Version Comparison Request
 * Request to compare two document versions
 */
export interface VersionComparisonRequest {
  documentId: string;
  version1Id: string;
  version2Id: string;
  compareOptions?: {
    ignoreWhitespace?: boolean;
    showDiff?: boolean;
  };
}

/**
 * Version Comparison
 * Result of comparing two document versions
 */
export interface VersionComparison {
  documentId: string;
  version1: DocumentVersion;
  version2: DocumentVersion;
  differences: {
    field: string;
    oldValue: unknown;
    newValue: unknown;
    type: 'ADDED' | 'REMOVED' | 'MODIFIED';
  }[];
  similarity: number; // 0-100 percentage
  hasDifferences: boolean;
}
