import type { IIncidentReportsApi } from '../types'
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
import { apiInstance } from '../config/apiConfig'
import { extractApiData, handleApiError, buildUrlParams } from '../utils/apiUtils'

/**
 * Incident Reports API implementation
 * Enterprise-grade incident reporting system with comprehensive type safety
 * Handles incidents, witness statements, follow-up actions, and compliance tracking
 */
class IncidentReportsApiImpl implements IIncidentReportsApi {
  // =====================
  // INCIDENT REPORT CRUD
  // =====================

  /**
   * Get all incident reports with pagination and filtering
   * Supports comprehensive filtering by student, type, severity, status, and date range
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

      const response = await apiInstance.get(`/incident-reports?${queryParams}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get incident report by ID with full associations
   * Includes student, reporter, witness statements, and follow-up actions
   */
  async getById(id: string): Promise<IncidentReportResponse> {
    try {
      const response = await apiInstance.get(`/incident-reports/${id}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Create new incident report
   * Automatically notifies parents for high/critical severity incidents
   */
  async create(data: CreateIncidentReportRequest): Promise<IncidentReportResponse> {
    try {
      const response = await apiInstance.post('/incident-reports', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update existing incident report
   * Supports partial updates with type safety
   */
  async update(id: string, data: UpdateIncidentReportRequest): Promise<IncidentReportResponse> {
    try {
      const response = await apiInstance.put(`/incident-reports/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Delete incident report
   * Note: Use with caution - consider archiving instead for compliance
   */
  async delete(id: string): Promise<{ success: boolean }> {
    try {
      const response = await apiInstance.delete(`/incident-reports/${id}`)
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
   * Searches across description, location, actions taken, and student names
   */
  async search(params: IncidentSearchParams): Promise<IncidentReportListResponse> {
    try {
      const queryParams = new URLSearchParams()
      if (params.page) queryParams.append('page', params.page.toString())
      if (params.limit) queryParams.append('limit', params.limit.toString())

      const response = await apiInstance.get(`/incident-reports/search/${params.query}?${queryParams}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get incident statistics with optional date range filtering
   * Returns analytics by type, severity, location, and notification rates
   */
  async getStatistics(params?: IncidentStatisticsFilters): Promise<IncidentStatistics> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom)
      if (params?.dateTo) queryParams.append('dateTo', params.dateTo)
      if (params?.studentId) queryParams.append('studentId', params.studentId)

      const queryString = queryParams.toString() ? `?${queryParams}` : ''
      const response = await apiInstance.get(`/incident-reports/statistics/overview${queryString}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get incidents requiring follow-up
   * Returns all open incidents with followUpRequired flag
   */
  async getFollowUpRequired(): Promise<IncidentReportListResponse> {
    try {
      const response = await apiInstance.get('/incident-reports/follow-up/pending')
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get recent incidents for a specific student
   * Useful for displaying student incident history
   */
  async getStudentRecentIncidents(studentId: string, limit: number = 5): Promise<IncidentReportListResponse> {
    try {
      const response = await apiInstance.get(`/incident-reports/student/${studentId}/recent?limit=${limit}`)
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
   * Updates notification status and records method/person
   */
  async markParentNotified(id: string, data: MarkParentNotifiedRequest): Promise<IncidentReportResponse> {
    try {
      const response = await apiInstance.put(`/incident-reports/${id}/notify-parent`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Send automated parent notification
   * Triggers notification via specified method (email, SMS, voice)
   */
  async notifyParent(id: string, data: NotifyParentRequest): Promise<IncidentReportResponse> {
    try {
      const response = await apiInstance.post(`/incident-reports/${id}/notify-parent-automated`, data)
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
   * Marks incident as completed if followUpRequired was true
   */
  async addFollowUpNotes(id: string, data: AddFollowUpNotesRequest): Promise<IncidentReportResponse> {
    try {
      const response = await apiInstance.put(`/incident-reports/${id}/follow-up`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Add structured follow-up action
   * Creates trackable action item with assignment and due date
   */
  async addFollowUpAction(data: CreateFollowUpActionRequest): Promise<FollowUpActionResponse> {
    try {
      const response = await apiInstance.post(`/incident-reports/${data.incidentReportId}/follow-up-actions`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update follow-up action status
   * Updates status, adds completion tracking, and notes
   */
  async updateFollowUpAction(id: string, data: UpdateFollowUpActionRequest): Promise<FollowUpActionResponse> {
    try {
      const response = await apiInstance.put(`/incident-reports/follow-up-actions/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Complete follow-up action
   * Shortcut method to mark action as completed with optional notes
   */
  async completeFollowUpAction(id: string, notes?: string): Promise<FollowUpActionResponse> {
    try {
      const response = await apiInstance.put(`/incident-reports/follow-up-actions/${id}`, {
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
   */
  async getFollowUpActions(incidentReportId: string): Promise<FollowUpActionListResponse> {
    try {
      const response = await apiInstance.get(`/incident-reports/${incidentReportId}/follow-up-actions`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Delete follow-up action
   */
  async deleteFollowUpAction(id: string): Promise<{ success: boolean }> {
    try {
      const response = await apiInstance.delete(`/incident-reports/follow-up-actions/${id}`)
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
   * Records statement from student, staff, parent, or other witness
   */
  async addWitnessStatement(data: CreateWitnessStatementRequest): Promise<WitnessStatementResponse> {
    try {
      const response = await apiInstance.post(`/incident-reports/${data.incidentReportId}/witness-statements`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update witness statement
   * Allows editing statement details before verification
   */
  async updateWitnessStatement(id: string, data: UpdateWitnessStatementRequest): Promise<WitnessStatementResponse> {
    try {
      const response = await apiInstance.put(`/incident-reports/witness-statements/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Verify witness statement
   * Marks statement as verified by current user with timestamp
   */
  async verifyWitnessStatement(statementId: string): Promise<WitnessStatementResponse> {
    try {
      const response = await apiInstance.put(`/incident-reports/witness-statements/${statementId}/verify`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get all witness statements for an incident
   */
  async getWitnessStatements(incidentReportId: string): Promise<WitnessStatementListResponse> {
    try {
      const response = await apiInstance.get(`/incident-reports/${incidentReportId}/witness-statements`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Delete witness statement
   */
  async deleteWitnessStatement(id: string): Promise<{ success: boolean }> {
    try {
      const response = await apiInstance.delete(`/incident-reports/witness-statements/${id}`)
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
   * Supports batch upload of evidence URLs
   */
  async addEvidence(id: string, data: AddEvidenceRequest): Promise<IncidentReportResponse> {
    try {
      const response = await apiInstance.post(`/incident-reports/${id}/evidence`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Upload evidence files with multipart form data
   * Handles file upload and returns evidence URLs
   */
  async uploadEvidence(incidentReportId: string, files: File[]): Promise<{ attachments: string[] }> {
    try {
      const formData = new FormData()
      files.forEach((file, index) => {
        formData.append(`evidence_${index}`, file)
      })
      const response = await apiInstance.post(`/incident-reports/${incidentReportId}/evidence`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Delete evidence file
   */
  async deleteEvidence(incidentReportId: string, fileName: string): Promise<{ success: boolean }> {
    try {
      const response = await apiInstance.delete(`/incident-reports/${incidentReportId}/evidence/${fileName}`)
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
   * Tracks claim number and status for incident
   */
  async updateInsuranceClaim(id: string, data: UpdateInsuranceClaimRequest): Promise<IncidentReportResponse> {
    try {
      const response = await apiInstance.put(`/incident-reports/${id}/insurance-claim`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Submit incident to insurance
   * Creates insurance submission record
   */
  async submitToInsurance(id: string, insuranceData: any): Promise<InsuranceSubmissionResponse> {
    try {
      const response = await apiInstance.post(`/incident-reports/${id}/insurance-submission`, insuranceData)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get insurance submissions for incident
   * Returns history of insurance submissions
   */
  async getInsuranceSubmissions(incidentReportId: string): Promise<InsuranceSubmissionsResponse> {
    try {
      const response = await apiInstance.get(`/incident-reports/${incidentReportId}/insurance-submissions`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update legal compliance status
   * Tracks compliance review and status
   */
  async updateComplianceStatus(id: string, data: UpdateComplianceStatusRequest): Promise<IncidentReportResponse> {
    try {
      const response = await apiInstance.put(`/incident-reports/${id}/compliance`, data)
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
   * Creates structured document for legal/insurance purposes
   */
  async generateDocument(id: string): Promise<{ document: IncidentReportDocument }> {
    try {
      const response = await apiInstance.get(`/incident-reports/${id}/document`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Generate printable report (PDF/document)
   * Returns blob for download
   */
  async generateReport(id: string): Promise<Blob> {
    try {
      const response = await apiInstance.get(`/incident-reports/${id}/generate`, { responseType: 'blob' })
      return response.data
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Export multiple reports with filters
   * Returns blob (CSV/Excel) for bulk export
   */
  async exportReports(params?: IncidentReportFilters): Promise<Blob> {
    try {
      const queryParams = params ? `?${buildUrlParams(params)}` : ''
      const response = await apiInstance.get(`/incident-reports/export${queryParams}`, { responseType: 'blob' })
      return response.data
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

}

export const incidentReportsApi = new IncidentReportsApiImpl()
export type { IIncidentReportsApi }
