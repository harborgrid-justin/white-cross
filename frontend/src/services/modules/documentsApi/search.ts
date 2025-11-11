/**
 * @fileoverview Documents API Search and Filtering
 * @module services/modules/documentsApi/search
 * @category Healthcare - Documents
 *
 * Advanced search and filtering operations for document discovery including
 * full-text search, metadata filtering, and expiration management.
 */

import type { ApiResponse } from '../../types';
import { API_ENDPOINTS } from '../../config/apiConfig';
import { extractApiData, buildUrlParams } from '../../utils/apiUtils';
import type {
  BaseDocumentsService,
  DocumentsApi,
  Document,
  DocumentFilters,
  SearchResults,
  SearchDocumentsRequest,
  AdvancedSearchFilters,
} from './types';
import { validateUUIDOrThrow, ERROR_MESSAGES } from './types';

// Import validation schemas
import {
  documentFiltersSchema,
  searchDocumentsRequestSchema,
  advancedSearchFiltersSchema,
  type DocumentFiltersInput,
} from '../../../schemas/documentSchemas';

/**
 * Documents Search Service
 *
 * @class
 * @classdesc Handles advanced search and filtering operations for document discovery
 * with support for full-text search, metadata filtering, and healthcare-specific searches.
 *
 * Healthcare Safety Features:
 * - PHI-aware search with audit logging
 * - HIPAA compliant search result filtering
 * - Expiration date monitoring and alerts
 * - Permission-based result filtering
 */
export class DocumentsSearchService implements Pick<DocumentsApi, 
  'searchDocuments' | 'advancedSearch' | 'getExpiringDocuments'> {
  
  constructor(private readonly client: BaseDocumentsService['client']) {}

  /**
   * Basic document search
   * @param query - Search query string
   * @param filters - Optional filters to apply to search
   * @returns Documents matching search criteria
   *
   * @description
   * Performs a basic text search across document titles, descriptions, and metadata.
   * Supports simple keyword matching and basic filters for category, status, and dates.
   *
   * PHI Protection: Search results may contain PHI - search is logged for audit trail
   *
   * Search Features:
   * - Full-text search across title and description
   * - Metadata keyword matching
   * - Category and status filtering
   * - Date range filtering
   * - Student-specific searches
   *
   * @example
   * ```typescript
   * const searchService = new DocumentsSearchService(apiClient);
   *
   * // Basic text search
   * const { documents } = await searchService.searchDocuments('physical exam', {
   *   category: 'MEDICAL_RECORD',
   *   status: 'ACTIVE'
   * });
   *
   * console.log(`Found ${documents.length} physical exam records`);
   * documents.forEach(doc => {
   *   console.log(`- ${doc.title} (${doc.studentName})`);
   * });
   * ```
   *
   * @example
   * ```typescript
   * // Search by student and type
   * const { documents: consentForms } = await searchService.searchDocuments('consent', {
   *   studentId: 'student-uuid-123',
   *   category: 'CONSENT',
   *   createdAfter: '2024-01-01T00:00:00Z'
   * });
   *
   * console.log(`Consent forms for student: ${consentForms.length}`);
   * ```
   */
  async searchDocuments(query: string, filters: DocumentFilters = {}): Promise<{ documents: Document[] }> {
    const validatedFilters = documentFiltersSchema.parse({
      ...filters,
      search: query
    });
    
    const params = buildUrlParams(validatedFilters);
    
    const response = await this.client.get<ApiResponse<{ documents: Document[] }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/search?${params.toString()}`
    );
    
    return extractApiData(response as any);
  }

  /**
   * Advanced document search
   * @param request - Advanced search request with filters and options
   * @returns Comprehensive search results with aggregations
   *
   * @description
   * Performs advanced search with complex filtering, sorting, faceted search,
   * and result aggregations. Supports healthcare-specific searches including
   * signature status, expiration monitoring, and compliance tracking.
   *
   * PHI Protection: Advanced search may access PHI - operation is logged for audit trail
   *
   * Advanced Features:
   * - Multiple search criteria combining with AND/OR logic
   * - Faceted search with category, status, and date breakdowns
   * - Signature status filtering and compliance tracking
   * - File type and size filtering
   * - Expiration date monitoring and alerts
   * - Result highlighting and relevance scoring
   * - Aggregated statistics and summaries
   *
   * @example
   * ```typescript
   * const searchService = new DocumentsSearchService(apiClient);
   *
   * // Advanced search with multiple criteria
   * const results = await searchService.advancedSearch({
   *   filters: {
   *     query: 'immunization vaccination',
   *     category: 'MEDICAL_RECORD',
   *     dateRange: {
   *       startDate: '2024-01-01T00:00:00Z',
   *       endDate: '2024-12-31T23:59:59Z'
   *     },
   *     hasSignatures: true,
   *     expiringWithinDays: 90,
   *     fileTypes: ['pdf', 'jpg', 'png']
   *   },
   *   sort: {
   *     field: 'expirationDate',
   *     order: 'asc'
   *   },
   *   page: 1,
   *   limit: 50,
   *   includeAggregations: true,
   *   includeHighlights: true
   * });
   *
   * console.log(`Search Results:`);
   * console.log(`  Total: ${results.total}`);
   * console.log(`  Pages: ${results.pagination.totalPages}`);
   * console.log(`  Documents: ${results.documents.length}`);
   *
   * // Show aggregations
   * if (results.aggregations) {
   *   console.log(`\nBreakdown by category:`);
   *   results.aggregations.categories.forEach(cat => {
   *     console.log(`  ${cat.name}: ${cat.count} documents`);
   *   });
   * }
   *
   * // Show expiring documents
   * const expiringSoon = results.documents.filter(doc => 
   *   doc.expirationDate && 
   *   new Date(doc.expirationDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
   * );
   * console.log(`\n⚠️  ${expiringSoon.length} documents expiring within 30 days`);
   * ```
   *
   * @example
   * ```typescript
   * // Search for compliance gaps
   * const complianceResults = await searchService.advancedSearch({
   *   filters: {
   *     hasSignatures: false,
   *     category: 'CONSENT',
   *     isExpired: false,
   *     createdBefore: '2024-06-01T00:00:00Z'
   *   },
   *   sort: { field: 'createdAt', order: 'desc' },
   *   includeAggregations: true
   * });
   *
   * console.log(`Unsigned consent forms: ${complianceResults.total}`);
   * console.log('Action required for compliance');
   * ```
   */
  async advancedSearch(request: SearchDocumentsRequest): Promise<SearchResults> {
    const validatedRequest = searchDocumentsRequestSchema.parse(request);
    
    const response = await this.client.post<ApiResponse<SearchResults> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/search/advanced`,
      validatedRequest
    );
    
    return extractApiData(response as any);
  }

  /**
   * Get documents expiring within specified days
   * @param days - Number of days to look ahead (defaults to 30)
   * @returns Documents expiring within the specified timeframe
   *
   * @description
   * Retrieves documents that are expiring within the specified number of days.
   * Critical for healthcare compliance where expired documents must be renewed
   * or replaced to maintain regulatory compliance.
   *
   * PHI Protection: Expiring documents may contain PHI - access is logged for audit trail
   *
   * Expiration Monitoring Features:
   * - Configurable look-ahead period
   * - Priority sorting by expiration date
   * - Category-based grouping for action planning
   * - Automatic notification triggers
   * - Compliance risk assessment
   *
   * Common Use Cases:
   * - Daily compliance monitoring
   * - Monthly renewal planning
   * - Quarterly compliance audits
   * - Parent/guardian notifications
   * - Staff action item generation
   *
   * @example
   * ```typescript
   * const searchService = new DocumentsSearchService(apiClient);
   *
   * // Get documents expiring in next 30 days
   * const { documents: expiring } = await searchService.getExpiringDocuments(30);
   *
   * console.log(`Documents expiring in 30 days: ${expiring.length}`);
   *
   * // Group by urgency
   * const urgent = expiring.filter(doc => {
   *   const daysLeft = Math.ceil(
   *     (new Date(doc.expirationDate!).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
   *   );
   *   return daysLeft <= 7;
   * });
   *
   * const warning = expiring.filter(doc => {
   *   const daysLeft = Math.ceil(
   *     (new Date(doc.expirationDate!).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
   *   );
   *   return daysLeft > 7 && daysLeft <= 14;
   * });
   *
   * console.log(`🚨 Urgent (≤7 days): ${urgent.length}`);
   * console.log(`⚠️  Warning (8-14 days): ${warning.length}`);
   * console.log(`📅 Notice (15-30 days): ${expiring.length - urgent.length - warning.length}`);
   * ```
   *
   * @example
   * ```typescript
   * // Generate weekly expiration report
   * const weeklyExpiring = await searchService.getExpiringDocuments(7);
   * 
   * const reportByCategory = weeklyExpiring.reduce((acc, doc) => {
   *   const category = doc.category || 'OTHER';
   *   if (!acc[category]) acc[category] = [];
   *   acc[category].push(doc);
   *   return acc;
   * }, {} as Record<string, Document[]>);
   *
   * console.log('Weekly Expiration Report:');
   * Object.entries(reportByCategory).forEach(([category, docs]) => {
   *   console.log(`\n${category}:`);
   *   docs.forEach(doc => {
   *     const daysLeft = Math.ceil(
   *       (new Date(doc.expirationDate!).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
   *     );
   *     console.log(`  - ${doc.title} (${doc.studentName}) - ${daysLeft} days`);
   *   });
   * });
   * ```
   *
   * @example
   * ```typescript
   * // Monitor immunization compliance
   * const immunizationExpiring = await searchService.advancedSearch({
   *   filters: {
   *     category: 'IMMUNIZATION',
   *     expiringWithinDays: 60,
   *     isArchived: false
   *   },
   *   sort: { field: 'expirationDate', order: 'asc' }
   * });
   *
   * console.log(`Immunizations needing renewal: ${immunizationExpiring.total}`);
   * ```
   */
  async getExpiringDocuments(days: number = 30): Promise<{ documents: Document[] }> {
    const params = new URLSearchParams({
      expiringWithinDays: days.toString(),
      sortBy: 'expirationDate',
      sortOrder: 'asc'
    });
    
    const response = await this.client.get<ApiResponse<{ documents: Document[] }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/expiring?${params.toString()}`
    );
    
    return extractApiData(response as any);
  }
}

/**
 * Factory function to create document search service
 */
export function createDocumentsSearchService(client: BaseDocumentsService['client']): DocumentsSearchService {
  return new DocumentsSearchService(client);
}
