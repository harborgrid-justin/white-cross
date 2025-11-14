/**
 * @fileoverview Documents API Audit Trail Management
 * @module services/modules/documentsApi/audit
 * @category Healthcare - Documents
 *
 * Audit trail management for document access, modifications, and compliance
 * tracking with HIPAA-compliant logging and reporting capabilities.
 */

import type { ApiResponse } from '../../types';
import { API_ENDPOINTS } from '../../config/apiConfig';
import { extractApiData } from '../../utils/apiUtils';
import type {
  BaseDocumentsService,
  DocumentsApi,
  DocumentAuditTrail,
  DocumentSignature,
  DocumentStatistics,
  DocumentCategoryMetadata,
} from './types';
import { validateUUIDOrThrow, ERROR_MESSAGES } from './types';

/**
 * Documents Audit Service
 *
 * @class
 * @classdesc Handles audit trail management, compliance reporting, and document
 * statistics with full HIPAA compliance and healthcare regulatory support.
 *
 * Healthcare Safety Features:
 * - Complete audit trail logging for all document operations
 * - HIPAA-compliant access tracking and reporting
 * - Digital signature verification and validation
 * - Compliance gap analysis and reporting
 * - Automated archival and retention management
 */
export class DocumentsAuditService implements Pick<DocumentsApi, 
  'getDocumentAuditTrail' | 'getDocumentSignatures' | 'getDocumentCategories' | 
  'getStatistics' | 'archiveExpiredDocuments'> {
  
  constructor(private readonly client: BaseDocumentsService['client']) {}

  /**
   * Get document audit trail
   * @param documentId - Document UUID
   * @param limit - Maximum number of audit entries to return
   * @returns Complete audit trail for the document
   *
   * @description
   * Retrieves the complete audit trail for a document including all access,
   * modification, sharing, and signature events. Essential for HIPAA compliance
   * and regulatory reporting.
   *
   * PHI Protection: Audit trail access is itself logged for compliance
   *
   * Audit Trail Features:
   * - Complete chronological history of all document operations
   * - User identification and role tracking
   * - IP address and device information logging
   * - Action type classification and risk assessment
   * - Timestamp precision for forensic analysis
   * - Data integrity verification
   *
   * Common Audit Events:
   * - Document creation and initial upload
   * - View/access events with user context
   * - Modification and version changes
   * - Sharing and permission grants/revokes
   * - Digital signature events
   * - Download and export activities
   * - Archive and deletion events
   *
   * @example
   * ```typescript
   * const auditService = new DocumentsAuditService(apiClient);
   *
   * // Get complete audit trail
   * const { auditTrail } = await auditService.getDocumentAuditTrail('doc-uuid-123');
   *
   * console.log(`Audit trail for document (${auditTrail.length} events):`);
   * auditTrail.forEach((event, index) => {
   *   console.log(`${index + 1}. ${event.action} - ${event.performedBy}`);
   *   console.log(`   Time: ${new Date(event.timestamp).toLocaleString()}`);
   *   console.log(`   IP: ${event.ipAddress} | Device: ${event.userAgent}`);
   *   if (event.details) {
   *     console.log(`   Details: ${event.details}`);
   *   }
   *   console.log('');
   * });
   * ```
   *
   * @example
   * ```typescript
   * // Analyze audit trail for compliance
   * const { auditTrail } = await auditService.getDocumentAuditTrail('doc-uuid-456');
   * 
   * // Find all access events
   * const accessEvents = auditTrail.filter(event => 
   *   ['VIEW', 'DOWNLOAD', 'SHARE'].includes(event.action)
   * );
   * 
   * // Group by user for access frequency analysis
   * const accessByUser = accessEvents.reduce((acc, event) => {
   *   const user = event.performedBy;
   *   if (!acc[user]) acc[user] = [];
   *   acc[user].push(event);
   *   return acc;
   * }, {} as Record<string, typeof accessEvents>);
   * 
   * console.log('Document access summary:');
   * Object.entries(accessByUser).forEach(([user, events]) => {
   *   console.log(`  ${user}: ${events.length} access events`);
   *   console.log(`    Last access: ${new Date(events[0].timestamp).toLocaleString()}`);
   * });
   * ```
   */
  async getDocumentAuditTrail(
    documentId: string,
    limit: number = 100
  ): Promise<{ auditTrail: DocumentAuditTrail[] }> {
    validateUUIDOrThrow(documentId, ERROR_MESSAGES.INVALID_DOCUMENT_ID);
    
    const params = new URLSearchParams({
      limit: limit.toString()
    });
    
    const response = await this.client.get<ApiResponse<{ auditTrail: DocumentAuditTrail[] }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${documentId}/audit?${params.toString()}`
    );
    
    return extractApiData(response as any);
  }

  /**
   * Get document signatures
   * @param documentId - Document UUID
   * @returns All signatures associated with the document
   *
   * @description
   * Retrieves all digital signatures associated with a document including
   * verification status, signer information, and signature metadata.
   * Critical for legal validity and compliance verification.
   *
   * PHI Protection: Signature data may contain PHI - access is logged for audit trail
   *
   * Signature Information:
   * - Digital signature verification status
   * - Signer identity and role verification
   * - Signature timestamp and certificate details
   * - Signature method and device information
   * - Legal validity and compliance status
   * - Certificate chain and trust verification
   *
   * @example
   * ```typescript
   * const auditService = new DocumentsAuditService(apiClient);
   *
   * // Get all signatures for document
   * const { signatures } = await auditService.getDocumentSignatures('doc-uuid-123');
   *
   * console.log(`Document signatures (${signatures.length}):`);
   * signatures.forEach((signature, index) => {
   *   console.log(`${index + 1}. Signature by: ${signature.signedBy}`);
   *   console.log(`   Role: ${signature.signedByRole}`);
   *   console.log(`   Type: ${signature.signatureType}`);
   *   console.log(`   Date: ${new Date(signature.signedAt).toLocaleString()}`);
   *   console.log(`   Valid: ${signature.isValid ? '✓' : '✗'}`);
   *   
   *   if (signature.certificateDetails) {
   *     console.log(`   Certificate: ${signature.certificateDetails.issuer}`);
   *     console.log(`   Expires: ${new Date(signature.certificateDetails.expiresAt).toLocaleDateString()}`);
   *   }
   *   console.log('');
   * });
   * ```
   *
   * @example
   * ```typescript
   * // Verify signature compliance for consent form
   * const { signatures } = await auditService.getDocumentSignatures('consent-form-uuid');
   * 
   * const requiredSignatures = ['parent', 'guardian', 'student'];
   * const providedRoles = signatures
   *   .filter(sig => sig.isValid)
   *   .map(sig => sig.signedByRole?.toLowerCase());
   * 
   * const missingSignatures = requiredSignatures.filter(role => 
   *   !providedRoles.includes(role)
   * );
   * 
   * if (missingSignatures.length === 0) {
   *   console.log('✓ All required signatures present and valid');
   * } else {
   *   console.log(`⚠️ Missing required signatures: ${missingSignatures.join(', ')}`);
   * }
   * ```
   */
  async getDocumentSignatures(documentId: string): Promise<{ signatures: DocumentSignature[] }> {
    validateUUIDOrThrow(documentId, ERROR_MESSAGES.INVALID_DOCUMENT_ID);
    
    const response = await this.client.get<ApiResponse<{ signatures: DocumentSignature[] }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/${documentId}/signatures`
    );
    
    return extractApiData(response as any);
  }

  /**
   * Get document categories with metadata
   * @returns Available document categories with usage statistics
   *
   * @description
   * Retrieves all available document categories with metadata including
   * usage statistics, compliance requirements, and configuration details.
   * Useful for system administration and compliance reporting.
   *
   * Category Information:
   * - Category names and descriptions
   * - Document count and usage statistics
   * - Compliance requirements and retention policies
   * - Required signature types and approval workflows
   * - Expiration policies and renewal requirements
   *
   * @example
   * ```typescript
   * const auditService = new DocumentsAuditService(apiClient);
   *
   * // Get all categories with statistics
   * const { categories } = await auditService.getDocumentCategories();
   *
   * console.log('Document categories:');
   * categories.forEach(category => {
   *   console.log(`\n${category.name}:`);
   *   console.log(`  Description: ${category.description}`);
   *   console.log(`  Documents: ${category.documentCount}`);
   *   console.log(`  Retention: ${category.retentionPeriod} days`);
   *   
   *   if (category.requiredSignatures?.length) {
   *     console.log(`  Required signatures: ${category.requiredSignatures.join(', ')}`);
   *   }
   *   
   *   if (category.complianceNotes) {
   *     console.log(`  Compliance: ${category.complianceNotes}`);
   *   }
   * });
   * ```
   */
  async getDocumentCategories(): Promise<{ categories: DocumentCategoryMetadata[] }> {
    const response = await this.client.get<ApiResponse<{ categories: DocumentCategoryMetadata[] }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/categories`
    );
    
    return extractApiData(response as any);
  }

  /**
   * Get document statistics
   * @param dateRange - Optional date range for statistics
   * @returns Comprehensive document usage and compliance statistics
   *
   * @description
   * Retrieves comprehensive statistics about document usage, compliance status,
   * and system performance. Essential for administrative reporting and
   * compliance monitoring.
   *
   * Statistics Include:
   * - Total document counts by category and status
   * - Creation, modification, and access trends
   * - Signature completion and compliance rates
   * - Expiration and renewal statistics
   * - User activity and system usage metrics
   * - Storage and performance metrics
   * - Compliance gap analysis
   *
   * @example
   * ```typescript
   * const auditService = new DocumentsAuditService(apiClient);
   *
   * // Get current year statistics
   * const { statistics } = await auditService.getStatistics({
   *   startDate: '2024-01-01T00:00:00Z',
   *   endDate: '2024-12-31T23:59:59Z'
   * });
   *
   * console.log('Document Statistics for 2024:');
   * console.log(`Total documents: ${statistics.totalDocuments}`);
   * console.log(`Active documents: ${statistics.activeDocuments}`);
   * console.log(`Expiring soon: ${statistics.expiringDocuments}`);
   * console.log(`Pending signatures: ${statistics.pendingSignatures}`);
   * console.log('');
   *
   * // Category breakdown
   * console.log('By category:');
   * statistics.categoryBreakdown.forEach(cat => {
   *   console.log(`  ${cat.category}: ${cat.count} documents`);
   * });
   *
   * // Compliance metrics
   * console.log('\\nCompliance:');
   * console.log(`  Signature completion rate: ${statistics.signatureCompletionRate}%`);
   * console.log(`  Documents at risk: ${statistics.complianceRiskDocuments}`);
   * ```
   *
   * @example
   * ```typescript
   * // Generate monthly compliance report
   * const monthlyStats = await auditService.getStatistics({
   *   startDate: '2024-10-01T00:00:00Z',
   *   endDate: '2024-10-31T23:59:59Z'
   * });
   *
   * const complianceScore = (
   *   (monthlyStats.activeDocuments - monthlyStats.complianceRiskDocuments) /
   *   monthlyStats.activeDocuments * 100
   * ).toFixed(1);
   *
   * console.log(`Monthly Compliance Report - October 2024`);
   * console.log(`Compliance Score: ${complianceScore}%`);
   * console.log(`Action Items: ${monthlyStats.pendingSignatures + monthlyStats.expiringDocuments}`);
   * ```
   */
  async getStatistics(
    dateRange?: { startDate: string; endDate: string }
  ): Promise<{ statistics: DocumentStatistics }> {
    const params = new URLSearchParams();
    
    if (dateRange) {
      params.set('startDate', dateRange.startDate);
      params.set('endDate', dateRange.endDate);
    }
    
    const queryString = params.toString();
    const url = `${API_ENDPOINTS.DOCUMENTS.BASE}/statistics${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.client.get<ApiResponse<{ statistics: DocumentStatistics }> | undefined>(url);
    
    return extractApiData(response as any);
  }

  /**
   * Archive expired documents
   * @returns Results of archival operation including counts
   *
   * @description
   * Automatically archives documents that have exceeded their retention period
   * or expired according to healthcare compliance requirements. Maintains
   * audit trail while moving documents to secure archival storage.
   *
   * PHI Protection: Archival operation is logged for compliance and audit trail
   *
   * Archival Process:
   * - Identifies documents past retention period
   * - Verifies no active legal holds or pending requirements
   * - Moves documents to secure archival storage
   * - Maintains audit trail and access logs
   * - Updates document status and accessibility
   * - Generates archival reports for compliance
   *
   * Safety Features:
   * - Cannot archive documents with pending signatures
   * - Cannot archive documents under legal hold
   * - Cannot archive documents with recent activity
   * - Provides detailed operation results and error reporting
   *
   * @example
   * ```typescript
   * const auditService = new DocumentsAuditService(apiClient);
   *
   * // Run automated archival
   * const result = await auditService.archiveExpiredDocuments();
   *
   * console.log('Document Archival Results:');
   * console.log(`Successfully archived: ${result.archived} documents`);
   * console.log(`Failed to archive: ${result.failed} documents`);
   *
   * if (result.failed > 0) {
   *   console.log('\\nArchival failures require manual review');
   *   console.log('Check audit logs for detailed error information');
   * }
   *
   * // Calculate storage savings
   * const totalProcessed = result.archived + result.failed;
   * const successRate = ((result.archived / totalProcessed) * 100).toFixed(1);
   * console.log(`\\nArchival success rate: ${successRate}%`);
   * ```
   *
   * @example
   * ```typescript
   * // Scheduled archival with reporting
   * try {
   *   const result = await auditService.archiveExpiredDocuments();
   *   
   *   // Log results for compliance reporting
   *   console.log(`[${new Date().toISOString()}] Automated archival completed`);
   *   console.log(`Archived: ${result.archived}, Failed: ${result.failed}`);
   *   
   *   // Alert if failure rate is high
   *   const failureRate = result.failed / (result.archived + result.failed);
   *   if (failureRate > 0.1) { // More than 10% failures
   *     console.warn('⚠️ High archival failure rate - manual intervention required');
   *   }
   * } catch (error) {
   *   console.error('Archival operation failed:', error.message);
   * }
   * ```
   */
  async archiveExpiredDocuments(): Promise<{ archived: number; failed: number }> {
    const response = await this.client.post<ApiResponse<{ archived: number; failed: number }> | undefined>(
      `${API_ENDPOINTS.DOCUMENTS.BASE}/archive/expired`
    );
    
    return extractApiData(response as any);
  }
}

/**
 * Factory function to create document audit service
 */
export function createDocumentsAuditService(client: BaseDocumentsService['client']): DocumentsAuditService {
  return new DocumentsAuditService(client);
}
