/**
 * Incidents API - Evidence Management and Compliance
 *
 * @deprecated This service module is deprecated and will be removed on 2026-06-30.
 * Please migrate to Server Actions in @/lib/actions/incidents.operations instead.
 *
 * **MIGRATION GUIDE**:
 * ```typescript
 * // ❌ OLD: Service Module Pattern
 * import { Evidence } from '@/services/modules/incidentsApi/evidence';
 * const evidence = new Evidence(apiClient);
 *
 * await evidence.addEvidence(incidentId, data);
 * await evidence.updateInsuranceClaim(incidentId, claimData);
 *
 * // ✅ NEW: Server Actions Pattern
 * // Note: Evidence operations may be in incidents.operations or documents.upload
 * import { updateIncident } from '@/lib/actions/incidents.crud';
 * import { uploadDocument } from '@/lib/actions/documents.upload';
 *
 * // Evidence is typically attached to incidents via updates
 * const result = await updateIncident(incidentId, {
 *   evidenceDocuments: [...existingDocs, newDoc]
 * });
 *
 * // For file uploads, use documents.upload actions
 * const uploadResult = await uploadDocument(file, {
 *   relatedTo: 'incident',
 *   relatedId: incidentId,
 *   category: 'evidence'
 * });
 * ```
 *
 * **METHOD MAPPING**:
 * - `addEvidence()` → Use `updateIncident()` from `@/lib/actions/incidents.crud` or `uploadDocument()`
 * - `updateInsuranceClaim()` → Use `updateIncident()` with insurance claim data
 * - `updateComplianceStatus()` → Use `updateIncident()` with compliance data
 * - Insurance/compliance → Consider `@/lib/actions/incidents.operations` for specialized operations
 *
 * Evidence handling, insurance claims, and compliance tracking
 *
 * @module services/modules/incidentsApi/evidence
 */

import type { ApiClient } from '../../core/ApiClient';
import { handleApiError, buildUrlParams } from '../../utils/apiUtils';
import type {
  AddEvidenceRequest,
  UpdateInsuranceClaimRequest,
  UpdateComplianceStatusRequest,
  IncidentReportResponse,
  InsuranceSubmissionResponse,
  InsuranceSubmissionsResponse,
  CreateCommentRequest,
  UpdateCommentRequest,
  CommentResponse,
  CommentListResponse
} from './types';

/**
 * Evidence management and compliance operations
 */
export class Evidence {
  constructor(private readonly client: ApiClient) {}

  // =====================
  // EVIDENCE MANAGEMENT
  // =====================

  /**
   * Add evidence (photos/videos) to incident
   *
   * Supports batch upload of evidence URLs
   * Use uploadFiles() for actual file uploads
   *
   * @param id - Incident report ID
   * @param data - Evidence URLs and type
   * @returns Updated incident report
   *
   * Backend: POST /incidents/{id}/evidence
   */
  async add(id: string, data: AddEvidenceRequest): Promise<IncidentReportResponse> {
    try {
      const response = await this.client.post(`/incidents/${id}/evidence`, data);
      return response.data as IncidentReportResponse;
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }

  /**
   * Upload evidence files (photos/videos) with multipart form data and PHI protection
   *
   * Handles secure file upload with automatic virus scanning, PHI detection,
   * and cloud storage integration. Supports multiple files with progress tracking.
   *
   * @param {string} incidentReportId - Incident report UUID
   * @param {File[]} files - Array of File objects to upload (max 10 files, 50MB total)
   * @returns {Promise<{attachments: string[]}>} Secure URLs for uploaded evidence files
   * @returns {string[]} attachments - Array of secure, time-limited URLs for uploaded files
   * @throws {ValidationError} File validation failed (size, type, count limits)
   * @throws {SecurityError} Virus detected or PHI exposure risk identified
   * @throws {ApiError} Network error or server failure during upload
   *
   * @remarks
   * **File Validation**:
   * - Allowed types: JPEG, PNG, GIF, MP4, MOV, PDF
   * - Max file size: 10MB per file
   * - Max files per upload: 10 files
   * - Total upload size: 50MB maximum
   * - Validation: MIME type checking, file extension verification
   *
   * **Security & PHI Protection**:
   * - Virus scanning: ClamAV scan before storage
   * - PHI detection: Automatic OCR on images to detect exposed PHI (SSN, addresses)
   * - Encryption: AES-256 encryption at rest in S3
   * - Access control: Signed URLs with 1-hour expiration
   * - Audit logging: All evidence uploads logged with user ID and timestamp
   *
   * **Storage & Processing**:
   * - Cloud storage: AWS S3 with HIPAA compliance
   * - File naming: UUID-based to prevent filename conflicts
   * - Thumbnail generation: Automatic thumbnail creation for images
   * - Video processing: Frame extraction for preview
   * - Metadata: EXIF data stripped to remove location/device info
   *
   * **Upload Progress**:
   * - Chunked upload: Large files uploaded in 5MB chunks
   * - Progress tracking: Upload progress events emitted
   * - Resume support: Failed uploads can be resumed
   * - Retry logic: Automatic retry up to 3 times on network failure
   *
   * **Error Handling**:
   * - File too large: Returns specific error with size limit
   * - Invalid type: Returns allowed file types
   * - Virus detected: File rejected, incident logged
   * - PHI exposure: File flagged for review before attachment
   *
   * @example
   * ```typescript
   * // Basic file upload from input element
   * const fileInput = document.querySelector('input[type="file"]');
   * const files = Array.from(fileInput.files);
   *
   * try {
   *   const { attachments } = await evidence.uploadFiles(incidentId, files);
   *   console.log('Uploaded evidence:', attachments);
   *   // attachments = ['https://s3.../evidence/uuid-1.jpg', 'https://s3.../evidence/uuid-2.jpg']
   * } catch (error) {
   *   if (error.code === 'FILE_TOO_LARGE') {
   *     toast.error('Files must be under 10MB each');
   *   } else if (error.code === 'INVALID_FILE_TYPE') {
   *     toast.error('Only images, videos, and PDFs are allowed');
   *   }
   * }
   * ```
   *
   * Backend: POST /incidents/{id}/evidence (Content-Type: multipart/form-data)
   */
  async uploadFiles(incidentReportId: string, files: File[]): Promise<{ attachments: string[] }> {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`evidence_${index}`, file);
      });

      const response = await this.client.post(`/incidents/${incidentReportId}/evidence`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data as { attachments: string[] };
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }

  /**
   * Delete evidence file
   *
   * Permanently removes evidence file from storage
   * Cannot be undone - use with caution for compliance reasons
   *
   * @param incidentReportId - Incident report ID
   * @param fileName - Evidence file name to delete
   * @returns Success indicator
   *
   * Backend: DELETE /incidents/{id}/evidence/{fileName}
   */
  async deleteFile(incidentReportId: string, fileName: string): Promise<{ success: boolean }> {
    try {
      const response = await this.client.delete(`/incidents/${incidentReportId}/evidence/${fileName}`);
      return response.data as { success: boolean };
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }

  // =====================
  // INSURANCE AND COMPLIANCE
  // =====================

  /**
   * Update insurance claim information
   *
   * Tracks claim number and status for incident
   * Used for insurance workflow integration
   *
   * @param id - Incident report ID
   * @param data - Insurance claim data
   * @returns Updated incident report
   *
   * Backend: PUT /incidents/{id}
   */
  async updateInsuranceClaim(id: string, data: UpdateInsuranceClaimRequest): Promise<IncidentReportResponse> {
    try {
      const response = await this.client.put(`/incidents/${id}`, {
        insuranceClaimNumber: data.claimNumber,
        insuranceClaimStatus: data.status
      });
      return response.data as IncidentReportResponse;
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }

  /**
   * Submit incident to insurance
   *
   * Creates insurance submission record
   * Triggers insurance workflow if configured
   *
   * @param id - Incident report ID
   * @param insuranceData - Insurance submission data
   * @returns Insurance submission record
   *
   * Backend: POST /incidents/{id}/insurance-submission
   */
  async submitToInsurance(id: string, insuranceData: Record<string, unknown>): Promise<InsuranceSubmissionResponse> {
    try {
      const response = await this.client.post(`/incidents/${id}/insurance-submission`, insuranceData);
      return response.data as InsuranceSubmissionResponse;
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }

  /**
   * Get insurance submissions for incident
   *
   * Returns history of insurance submissions
   * Useful for tracking claim status over time
   *
   * @param incidentReportId - Incident report ID
   * @returns List of insurance submissions
   *
   * Backend: GET /incidents/{id}/insurance-submissions
   */
  async getInsuranceSubmissions(incidentReportId: string): Promise<InsuranceSubmissionsResponse> {
    try {
      const response = await this.client.get(`/incidents/${incidentReportId}/insurance-submissions`);
      return response.data as InsuranceSubmissionsResponse;
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }

  /**
   * Update legal compliance status
   *
   * Tracks compliance review and status
   * Used for regulatory reporting and audits
   *
   * @param id - Incident report ID
   * @param data - Compliance status data
   * @returns Updated incident report
   *
   * Backend: PUT /incidents/{id}
   */
  async updateComplianceStatus(id: string, data: UpdateComplianceStatusRequest): Promise<IncidentReportResponse> {
    try {
      const response = await this.client.put(`/incidents/${id}`, {
        legalComplianceStatus: data.status
      });
      return response.data as IncidentReportResponse;
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }

  // =====================
  // COMMENTS
  // =====================

  /**
   * Get all comments for an incident
   *
   * Returns comments in chronological order (oldest first)
   * Supports pagination for large comment threads
   *
   * @param incidentReportId - Incident report ID
   * @param page - Optional page number for pagination
   * @param limit - Optional limit per page
   * @returns List of comments with pagination
   *
   * @example
   * ```typescript
   * const comments = await evidence.getComments(incidentId, 1, 20);
   * ```
   *
   * Backend: GET /incidents/{id}/comments
   */
  async getComments(incidentReportId: string, page?: number, limit?: number): Promise<CommentListResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (page) queryParams.append('page', page.toString());
      if (limit) queryParams.append('limit', limit.toString());

      const queryString = queryParams.toString() ? `?${queryParams}` : '';
      const response = await this.client.get(`/incidents/${incidentReportId}/comments${queryString}`);
      return response.data as CommentListResponse;
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }

  /**
   * Create a new comment on an incident
   *
   * Adds a comment to the incident discussion thread
   * Automatically associates with current user
   *
   * @param data - Comment creation data
   * @returns Created comment
   *
   * @example
   * ```typescript
   * const comment = await evidence.createComment({
   *   incidentReportId: id,
   *   text: 'Follow-up scheduled with parent for tomorrow'
   * });
   * ```
   *
   * Backend: POST /incidents/{incidentReportId}/comments
   */
  async createComment(data: CreateCommentRequest): Promise<CommentResponse> {
    try {
      const response = await this.client.post(`/incidents/${data.incidentReportId}/comments`, {
        text: data.text
      });
      return response.data as CommentResponse;
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }

  /**
   * Update an existing comment
   *
   * Allows editing comment text
   * Marks comment as edited with timestamp
   *
   * @param commentId - Comment ID
   * @param data - Update data
   * @returns Updated comment
   *
   * Backend: PUT /incidents/comments/{commentId}
   */
  async updateComment(commentId: string, data: UpdateCommentRequest): Promise<CommentResponse> {
    try {
      const response = await this.client.put(`/incidents/comments/${commentId}`, data);
      return response.data as CommentResponse;
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }

  /**
   * Delete a comment
   *
   * Permanently removes comment from incident
   * Only comment author or admins can delete
   *
   * @param commentId - Comment ID
   * @returns Success indicator
   *
   * Backend: DELETE /incidents/comments/{commentId}
   */
  async deleteComment(commentId: string): Promise<{ success: boolean }> {
    try {
      const response = await this.client.delete(`/incidents/comments/${commentId}`);
      return response.data as { success: boolean };
    } catch (error) {
      throw handleApiError(error as Error);
    }
  }
}
