/**
 * WF-COMP-280 | incidentsApi.ts - Incidents API Service Module
 * Purpose: Complete API service for incident management system
 * Upstream: ../config/apiConfig, ../utils/apiUtils | Dependencies: ../config/apiConfig, ../utils/apiUtils
 * Downstream: Components, pages, hooks, state management | Called by: React component tree
 * Related: Witness statements, follow-up actions, evidence management
 * Exports: createIncidentsApi, IIncidentsApi | Key Features: Enterprise incident reporting
 * Last Updated: 2025-10-24 | File Type: .ts
 * Critical Path: User action → API call → Backend → Response → State update → UI render
 * LLM Context: Comprehensive incident reporting system with evidence, witnesses, and compliance tracking
 *
 * RENAMED FROM: incidentReportsApi.ts
 * API PATH CORRECTED: /incident-reports/* → /api/v1/incidents/*
 *
 * Backend Alignment: /api/v1/incidents/*
 */

import type { IIncidentsApi } from '../types'
import type {
  IncidentReport,
  WitnessStatement,
  FollowUpAction,
  CreateIncidentReportRequest,
  UpdateIncidentReportRequest,
  IncidentReportFilters,
  CreateWitnessStatementRequest,
  UpdateWitnessStatementRequest,
  CreateFollowUpActionRequest,
  UpdateFollowUpActionRequest,
  MarkParentNotifiedRequest,
  AddFollowUpNotesRequest,
  NotifyParentRequest,
  AddEvidenceRequest,
  UpdateInsuranceClaimRequest,
  UpdateComplianceStatusRequest,
  IncidentStatisticsFilters,
  IncidentSearchParams,
  IncidentReportResponse,
  IncidentReportListResponse,
  WitnessStatementResponse,
  WitnessStatementListResponse,
  FollowUpActionResponse,
  FollowUpActionListResponse,
  IncidentStatistics,
  IncidentReportDocument,
  InsuranceSubmissionResponse,
  InsuranceSubmissionsResponse,
  ActionStatus
} from '../types'
import type { ApiClient } from '../core/ApiClient';
import { extractApiData, handleApiError, buildUrlParams } from '../utils/apiUtils'

/**
 * Incidents API Implementation
 *
 * Enterprise-grade incident reporting system with comprehensive type safety
 * Handles incidents, witness statements, follow-up actions, and compliance tracking
 *
 * Backend Base Path: /api/v1/incidents
 *
 * Features:
 * - Complete CRUD operations for incidents
 * - Evidence management with file uploads (multipart/form-data)
 * - Witness statement collection and verification
 * - Follow-up action tracking with assignments and due dates
 * - Parent notification (manual and automated)
 * - Insurance claim management
 * - Legal compliance tracking
 * - Document generation and export capabilities
 * - PHI/PII protection throughout
 *
 * @aligned_with backend/src/api/incidents/*
 */
class IncidentsApiImpl implements IIncidentsApi {
  constructor(private readonly client: ApiClient) {}

  // =====================
  // INCIDENT REPORT CRUD
  // =====================

  /**
   * Get all incident reports with pagination and filtering
   *
   * Supports comprehensive filtering by student, type, severity, status, and date range
   *
   * @param params - Optional filters for querying incidents
   * @returns Paginated list of incident reports with metadata
   *
   * @example
   * ```typescript
   * const incidents = await incidentsApi.getAll({
   *   severity: IncidentSeverity.HIGH,
   *   dateFrom: '2025-01-01',
   *   dateTo: '2025-01-31',
   *   page: 1,
   *   limit: 20
   * });
   * ```
   *
   * Backend: GET /api/v1/incidents
   */
  async getAll(params?: IncidentReportFilters): Promise<IncidentReportListResponse> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.studentId) queryParams.append('studentId', params.studentId)
      if (params?.reportedById) queryParams.append('reportedById', params.reportedById)
      if (params?.type) queryParams.append('type', params.type)
      if (params?.severity) queryParams.append('severity', params.severity)
      if (params?.status) queryParams.append('status', params.status)
      if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom)
      if (params?.dateTo) queryParams.append('dateTo', params.dateTo)
      if (params?.parentNotified !== undefined) queryParams.append('parentNotified', params.parentNotified.toString())
      if (params?.followUpRequired !== undefined) queryParams.append('followUpRequired', params.followUpRequired.toString())
      if (params?.location) queryParams.append('location', params.location)

      const response = await this.client.get(`/api/v1/incidents?${queryParams}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get incident report by ID with full associations
   *
   * Includes student, reporter, witness statements, and follow-up actions
   *
   * @param id - Incident report ID (UUID)
   * @returns Single incident report with all related data
   * @throws ApiError if incident not found or access denied
   *
   * @example
   * ```typescript
   * const incident = await incidentsApi.getById('550e8400-e29b-41d4-a716-446655440000');
   * console.log(incident.report.student?.name);
   * ```
   *
   * Backend: GET /api/v1/incidents/{id}
   */
  async getById(id: string): Promise<IncidentReportResponse> {
    try {
      const response = await this.client.get(`/api/v1/incidents/${id}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Create new incident report
   *
   * Automatically notifies parents for high/critical severity incidents
   * Validates all required fields and PHI handling
   *
   * @param data - Incident report creation data
   * @returns Created incident report with generated ID
   * @throws ValidationError if required fields missing
   * @throws ApiError if creation fails
   *
   * @example
   * ```typescript
   * const incident = await incidentsApi.create({
   *   studentId: 'student-uuid',
   *   reportedById: 'user-uuid',
   *   type: IncidentType.INJURY,
   *   severity: IncidentSeverity.MEDIUM,
   *   description: 'Student fell during recess',
   *   location: 'Playground',
   *   occurredAt: new Date().toISOString(),
   *   actionsTaken: 'Applied ice pack, contacted nurse'
   * });
   * ```
   *
   * Backend: POST /api/v1/incidents
   */
  async create(data: CreateIncidentReportRequest): Promise<IncidentReportResponse> {
    try {
      const response = await this.client.post('/api/v1/incidents', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update existing incident report
   *
   * Supports partial updates with type safety
   * All fields are optional except id
   *
   * @param id - Incident report ID
   * @param data - Partial update data
   * @returns Updated incident report
   * @throws ApiError if update fails or incident not found
   *
   * @example
   * ```typescript
   * const updated = await incidentsApi.update(id, {
   *   severity: IncidentSeverity.HIGH,
   *   followUpRequired: true
   * });
   * ```
   *
   * Backend: PUT /api/v1/incidents/{id}
   */
  async update(id: string, data: UpdateIncidentReportRequest): Promise<IncidentReportResponse> {
    try {
      const response = await this.client.put(`/api/v1/incidents/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Delete incident report
   *
   * **WARNING**: Use with caution - consider archiving instead for compliance
   * Deletion may be restricted based on incident status and compliance requirements
   *
   * @param id - Incident report ID
   * @returns Success indicator
   * @throws ApiError if deletion not allowed or incident not found
   *
   * Backend: DELETE /api/v1/incidents/{id}
   */
  async delete(id: string): Promise<{ success: boolean }> {
    try {
      const response = await this.client.delete(`/api/v1/incidents/${id}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // =====================
  // SEARCH AND STATISTICS
  // =====================

  /**
   * Search incident reports
   *
   * Searches across description, location, actions taken, and student names
   * Supports pagination for large result sets
   *
   * @param params - Search parameters including query string
   * @returns Matching incident reports
   *
   * @example
   * ```typescript
   * const results = await incidentsApi.search({
   *   query: 'playground fall',
   *   page: 1,
   *   limit: 10
   * });
   * ```
   *
   * Backend: GET /api/v1/incidents/search
   */
  async search(params: IncidentSearchParams): Promise<IncidentReportListResponse> {
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('query', params.query)
      if (params.page) queryParams.append('page', params.page.toString())
      if (params.limit) queryParams.append('limit', params.limit.toString())

      const response = await this.client.get(`/api/v1/incidents/search?${queryParams}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get incident statistics with optional date range filtering
   *
   * Returns analytics by type, severity, location, and notification rates
   * Useful for dashboard widgets and reporting
   *
   * @param params - Optional filters (date range, student)
   * @returns Aggregated incident statistics
   *
   * @example
   * ```typescript
   * const stats = await incidentsApi.getStatistics({
   *   dateFrom: '2025-01-01',
   *   dateTo: '2025-01-31'
   * });
   * console.log(stats.byType, stats.bySeverity);
   * ```
   *
   * Backend: GET /api/v1/incidents/statistics
   */
  async getStatistics(params?: IncidentStatisticsFilters): Promise<IncidentStatistics> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom)
      if (params?.dateTo) queryParams.append('dateTo', params.dateTo)
      if (params?.studentId) queryParams.append('studentId', params.studentId)

      const queryString = queryParams.toString() ? `?${queryParams}` : ''
      const response = await this.client.get(`/api/v1/incidents/statistics${queryString}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get incidents requiring follow-up
   *
   * Returns all open incidents with followUpRequired flag set to true
   * Sorted by severity and date
   *
   * @returns List of incidents requiring follow-up
   *
   * Backend: GET /api/v1/incidents (filtered by followUpRequired=true)
   */
  async getFollowUpRequired(): Promise<IncidentReportListResponse> {
    try {
      const response = await this.client.get('/api/v1/incidents?followUpRequired=true&status=OPEN')
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get recent incidents for a specific student
   *
   * Useful for displaying student incident history
   * Returns most recent incidents first
   *
   * @param studentId - Student ID
   * @param limit - Maximum number of incidents to return (default: 5)
   * @returns Recent incidents for the student
   *
   * @example
   * ```typescript
   * const recent = await incidentsApi.getStudentRecentIncidents(studentId, 10);
   * ```
   *
   * Backend: GET /api/v1/incidents/student/{studentId}
   */
  async getStudentRecentIncidents(studentId: string, limit: number = 5): Promise<IncidentReportListResponse> {
    try {
      const response = await this.client.get(`/api/v1/incidents/student/${studentId}?limit=${limit}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // =====================
  // PARENT NOTIFICATION
  // =====================

  /**
   * Mark parent as notified manually
   *
   * Updates notification status and records method/person
   * Used when notification was done outside the system (phone call, in-person)
   *
   * @param id - Incident report ID
   * @param data - Notification method and person who notified
   * @returns Updated incident report
   *
   * Backend: PUT /api/v1/incidents/{id}/notify
   */
  async markParentNotified(id: string, data: MarkParentNotifiedRequest): Promise<IncidentReportResponse> {
    try {
      const response = await this.client.put(`/api/v1/incidents/${id}/notify`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Send automated parent notification
   *
   * Triggers notification via specified method (email, SMS, voice)
   * Automatically records notification timestamp and method
   *
   * @param id - Incident report ID
   * @param data - Notification method
   * @returns Updated incident report with notification status
   *
   * @example
   * ```typescript
   * await incidentsApi.notifyParent(id, {
   *   method: ParentNotificationMethod.EMAIL
   * });
   * ```
   *
   * Backend: POST /api/v1/incidents/{id}/notify
   */
  async notifyParent(id: string, data: NotifyParentRequest): Promise<IncidentReportResponse> {
    try {
      const response = await this.client.post(`/api/v1/incidents/${id}/notify`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // =====================
  // FOLLOW-UP NOTES AND ACTIONS
  // =====================

  /**
   * Add follow-up notes to incident
   *
   * Marks incident as completed if followUpRequired was true
   * Used for unstructured follow-up information
   *
   * @param id - Incident report ID
   * @param data - Follow-up notes
   * @returns Updated incident report
   *
   * Backend: PUT /api/v1/incidents/{id}
   */
  async addFollowUpNotes(id: string, data: AddFollowUpNotesRequest): Promise<IncidentReportResponse> {
    try {
      const response = await this.client.put(`/api/v1/incidents/${id}`, {
        followUpNotes: data.notes
      })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Add structured follow-up action
   *
   * Creates trackable action item with assignment and due date
   * Supports task delegation and priority management
   *
   * @param data - Follow-up action creation data
   * @returns Created follow-up action
   *
   * @example
   * ```typescript
   * const action = await incidentsApi.addFollowUpAction({
   *   incidentReportId: id,
   *   action: 'Schedule follow-up appointment with nurse',
   *   priority: ActionPriority.HIGH,
   *   dueDate: '2025-02-01',
   *   assignedTo: nurseUserId
   * });
   * ```
   *
   * Backend: POST /api/v1/incidents/{incidentReportId}/follow-ups
   */
  async addFollowUpAction(data: CreateFollowUpActionRequest): Promise<FollowUpActionResponse> {
    try {
      const response = await this.client.post(`/api/v1/incidents/${data.incidentReportId}/follow-ups`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update follow-up action status
   *
   * Updates status, adds completion tracking, and notes
   * Supports partial updates
   *
   * @param id - Follow-up action ID
   * @param data - Partial update data
   * @returns Updated follow-up action
   *
   * Backend: PUT /api/v1/incidents/follow-ups/{id}
   */
  async updateFollowUpAction(id: string, data: UpdateFollowUpActionRequest): Promise<FollowUpActionResponse> {
    try {
      const response = await this.client.put(`/api/v1/incidents/follow-ups/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Complete follow-up action
   *
   * Shortcut method to mark action as completed with optional notes
   * Sets status to COMPLETED and records completion timestamp
   *
   * @param id - Follow-up action ID
   * @param notes - Optional completion notes
   * @returns Updated follow-up action
   *
   * Backend: PUT /api/v1/incidents/follow-ups/{id}
   */
  async completeFollowUpAction(id: string, notes?: string): Promise<FollowUpActionResponse> {
    try {
      const response = await this.client.put(`/api/v1/incidents/follow-ups/${id}`, {
        status: ActionStatus.COMPLETED,
        notes
      })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get all follow-up actions for an incident
   *
   * @param incidentReportId - Incident report ID
   * @returns List of follow-up actions
   *
   * Backend: GET /api/v1/incidents/{id}/follow-ups
   */
  async getFollowUpActions(incidentReportId: string): Promise<FollowUpActionListResponse> {
    try {
      const response = await this.client.get(`/api/v1/incidents/${incidentReportId}/follow-ups`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Delete follow-up action
   *
   * @param id - Follow-up action ID
   * @returns Success indicator
   *
   * Backend: DELETE /api/v1/incidents/follow-ups/{id}
   */
  async deleteFollowUpAction(id: string): Promise<{ success: boolean }> {
    try {
      const response = await this.client.delete(`/api/v1/incidents/follow-ups/${id}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // =====================
  // WITNESS STATEMENTS
  // =====================

  /**
   * Add witness statement to incident
   *
   * Records statement from student, staff, parent, or other witness
   * Supports later verification workflow
   *
   * @param data - Witness statement creation data
   * @returns Created witness statement
   *
   * @example
   * ```typescript
   * const statement = await incidentsApi.addWitnessStatement({
   *   incidentReportId: id,
   *   witnessName: 'John Doe',
   *   witnessType: WitnessType.STAFF,
   *   witnessContact: 'john@school.edu',
   *   statement: 'I saw the student fall on the playground at approximately 10:30am'
   * });
   * ```
   *
   * Backend: POST /api/v1/incidents/{incidentReportId}/witnesses
   */
  async addWitnessStatement(data: CreateWitnessStatementRequest): Promise<WitnessStatementResponse> {
    try {
      const response = await this.client.post(`/api/v1/incidents/${data.incidentReportId}/witnesses`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update witness statement
   *
   * Allows editing statement details before verification
   * Cannot edit verified statements without unverifying first
   *
   * @param id - Witness statement ID
   * @param data - Partial update data
   * @returns Updated witness statement
   *
   * Backend: PUT /api/v1/incidents/witnesses/{id}
   */
  async updateWitnessStatement(id: string, data: UpdateWitnessStatementRequest): Promise<WitnessStatementResponse> {
    try {
      const response = await this.client.put(`/api/v1/incidents/witnesses/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Verify witness statement
   *
   * Marks statement as verified by current user with timestamp
   * Verified statements carry more weight in investigations
   *
   * @param statementId - Witness statement ID
   * @returns Updated witness statement with verification
   *
   * Backend: PUT /api/v1/incidents/witnesses/{id}/verify
   */
  async verifyWitnessStatement(statementId: string): Promise<WitnessStatementResponse> {
    try {
      const response = await this.client.put(`/api/v1/incidents/witnesses/${statementId}/verify`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get all witness statements for an incident
   *
   * @param incidentReportId - Incident report ID
   * @returns List of witness statements
   *
   * Backend: GET /api/v1/incidents/{id}/witnesses
   */
  async getWitnessStatements(incidentReportId: string): Promise<WitnessStatementListResponse> {
    try {
      const response = await this.client.get(`/api/v1/incidents/${incidentReportId}/witnesses`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Delete witness statement
   *
   * @param id - Witness statement ID
   * @returns Success indicator
   *
   * Backend: DELETE /api/v1/incidents/witnesses/{id}
   */
  async deleteWitnessStatement(id: string): Promise<{ success: boolean }> {
    try {
      const response = await this.client.delete(`/api/v1/incidents/witnesses/${id}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // =====================
  // EVIDENCE MANAGEMENT
  // =====================

  /**
   * Add evidence (photos/videos) to incident
   *
   * Supports batch upload of evidence URLs
   * Use uploadEvidence() for actual file uploads
   *
   * @param id - Incident report ID
   * @param data - Evidence URLs and type
   * @returns Updated incident report
   *
   * Backend: POST /api/v1/incidents/{id}/evidence
   */
  async addEvidence(id: string, data: AddEvidenceRequest): Promise<IncidentReportResponse> {
    try {
      const response = await this.client.post(`/api/v1/incidents/${id}/evidence`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Upload evidence files with multipart form data
   *
   * Handles file upload and returns evidence URLs
   * Supports multiple files in a single request
   * Files are stored securely with PHI protection
   *
   * @param incidentReportId - Incident report ID
   * @param files - Array of File objects to upload
   * @returns Evidence URLs for uploaded files
   * @throws ApiError if upload fails or file validation fails
   *
   * @example
   * ```typescript
   * const fileInput = document.querySelector('input[type="file"]');
   * const files = Array.from(fileInput.files);
   * const result = await incidentsApi.uploadEvidence(incidentId, files);
   * console.log('Uploaded files:', result.attachments);
   * ```
   *
   * Backend: POST /api/v1/incidents/{id}/evidence (Content-Type: multipart/form-data)
   */
  async uploadEvidence(incidentReportId: string, files: File[]): Promise<{ attachments: string[] }> {
    try {
      const formData = new FormData()
      files.forEach((file, index) => {
        formData.append(`evidence_${index}`, file)
      })

      const response = await this.client.post(`/api/v1/incidents/${incidentReportId}/evidence`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
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
   * Backend: DELETE /api/v1/incidents/{id}/evidence/{fileName}
   */
  async deleteEvidence(incidentReportId: string, fileName: string): Promise<{ success: boolean }> {
    try {
      const response = await this.client.delete(`/api/v1/incidents/${incidentReportId}/evidence/${fileName}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
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
   * Backend: PUT /api/v1/incidents/{id}
   */
  async updateInsuranceClaim(id: string, data: UpdateInsuranceClaimRequest): Promise<IncidentReportResponse> {
    try {
      const response = await this.client.put(`/api/v1/incidents/${id}`, {
        insuranceClaimNumber: data.claimNumber,
        insuranceClaimStatus: data.status
      })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
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
   * Backend: POST /api/v1/incidents/{id}/insurance-submission
   */
  async submitToInsurance(id: string, insuranceData: any): Promise<InsuranceSubmissionResponse> {
    try {
      const response = await this.client.post(`/api/v1/incidents/${id}/insurance-submission`, insuranceData)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
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
   * Backend: GET /api/v1/incidents/{id}/insurance-submissions
   */
  async getInsuranceSubmissions(incidentReportId: string): Promise<InsuranceSubmissionsResponse> {
    try {
      const response = await this.client.get(`/api/v1/incidents/${incidentReportId}/insurance-submissions`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
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
   * Backend: PUT /api/v1/incidents/{id}
   */
  async updateComplianceStatus(id: string, data: UpdateComplianceStatusRequest): Promise<IncidentReportResponse> {
    try {
      const response = await this.client.put(`/api/v1/incidents/${id}`, {
        legalComplianceStatus: data.status
      })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // =====================
  // DOCUMENT GENERATION AND EXPORT
  // =====================

  /**
   * Generate official incident report document
   *
   * Creates structured document for legal/insurance purposes
   * Includes all incident details, witness statements, and follow-ups
   *
   * @param id - Incident report ID
   * @returns Structured document data
   *
   * Backend: GET /api/v1/incidents/{id}/document
   */
  async generateDocument(id: string): Promise<{ document: IncidentReportDocument }> {
    try {
      const response = await this.client.get(`/api/v1/incidents/${id}/document`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Generate printable report (PDF/document)
   *
   * Returns blob for download
   * Formatted for printing and official records
   *
   * @param id - Incident report ID
   * @returns PDF blob for download
   *
   * @example
   * ```typescript
   * const blob = await incidentsApi.generateReport(id);
   * const url = URL.createObjectURL(blob);
   * const link = document.createElement('a');
   * link.href = url;
   * link.download = `incident-${id}.pdf`;
   * link.click();
   * ```
   *
   * Backend: GET /api/v1/incidents/{id}/generate
   */
  async generateReport(id: string): Promise<Blob> {
    try {
      const response = await this.client.get(`/api/v1/incidents/${id}/generate`, { responseType: 'blob' })
      return response.data
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Export multiple reports with filters
   *
   * Returns blob (CSV/Excel) for bulk export
   * Useful for analytics and reporting
   *
   * @param params - Optional filters for export
   * @returns CSV/Excel blob for download
   *
   * @example
   * ```typescript
   * const blob = await incidentsApi.exportReports({
   *   dateFrom: '2025-01-01',
   *   dateTo: '2025-01-31',
   *   severity: IncidentSeverity.HIGH
   * });
   * ```
   *
   * Backend: GET /api/v1/incidents/export
   */
  async exportReports(params?: IncidentReportFilters): Promise<Blob> {
    try {
      const queryParams = params ? `?${buildUrlParams(params)}` : ''
      const response = await this.client.get(`/api/v1/incidents/export${queryParams}`, { responseType: 'blob' })
      return response.data
    } catch (error) {
      throw handleApiError(error as any)
    }
  }
}

/**
 * Factory function to create IncidentsApi instance
 *
 * @param client - Configured API client
 * @returns IncidentsApi implementation
 *
 * @example
 * ```typescript
 * import { createApiClient } from './core/ApiClient';
 * import { createIncidentsApi } from './modules/incidentsApi';
 *
 * const apiClient = createApiClient();
 * const incidentsApi = createIncidentsApi(apiClient);
 * ```
 */
export function createIncidentsApi(client: ApiClient): IIncidentsApi {
  return new IncidentsApiImpl(client);
}

export type { IIncidentsApi }
