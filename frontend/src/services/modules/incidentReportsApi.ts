import type { IIncidentReportsApi } from '../types'
import type { 
  IncidentReport, 
  WitnessStatement, 
  FollowUpAction,
  PaginatedResponse 
} from '../types'
import { apiInstance } from '../config/apiConfig'
import { extractApiData, handleApiError, buildUrlParams } from '../utils/apiUtils'

/**
 * Incident Reports API implementation
 * Handles incident reporting, witness statements, and follow-up actions
 */
class IncidentReportsApiImpl implements IIncidentReportsApi {
  /**
   * Get all incident reports with pagination and filtering
   */
  async getAll(params?: { 
    page?: number; 
    limit?: number; 
    studentId?: string; 
    type?: string; 
    severity?: string; 
    status?: string; 
    dateFrom?: string; 
    dateTo?: string 
  }): Promise<{ reports: IncidentReport[]; pagination?: any }> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.studentId) queryParams.append('studentId', params.studentId)
      if (params?.type) queryParams.append('type', params.type)
      if (params?.severity) queryParams.append('severity', params.severity)
      if (params?.status) queryParams.append('status', params.status)
      if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom)
      if (params?.dateTo) queryParams.append('dateTo', params.dateTo)
      
      const response = await apiInstance.get(`/incident-reports?${queryParams}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get incident report by ID
   */
  async getById(id: string): Promise<{ report: IncidentReport }> {
    try {
      const response = await apiInstance.get(`/incident-reports/${id}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Create new incident report
   */
  async create(data: {
    studentId?: string;
    reportedBy: string;
    type: string;
    severity: string;
    location: string;
    description: string;
    immediateAction?: string;
    followUpRequired?: boolean;
    followUpDate?: string;
    witnesses?: string[];
    attachments?: string[];
  }): Promise<{ report: IncidentReport }> {
    try {
      const response = await apiInstance.post('/incident-reports', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update incident report
   */
  async update(id: string, data: Partial<IncidentReport>): Promise<{ report: IncidentReport }> {
    try {
      const response = await apiInstance.put(`/incident-reports/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Generate incident report document
   */
  async generateDocument(id: string): Promise<{ document: any }> {
    try {
      const response = await apiInstance.get(`/incident-reports/${id}/document`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Add witness statement
   */
  async addWitnessStatement(data: {
    incidentReportId: string;
    witnessName: string;
    witnessContact?: string;
    relationship?: string;
    statement: string;
    providedAt: string;
    recordedBy: string;
  }): Promise<{ statement: WitnessStatement }> {
    try {
      const response = await apiInstance.post(`/incident-reports/${data.incidentReportId}/witness-statements`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Verify witness statement
   */
  async verifyWitnessStatement(statementId: string): Promise<{ statement: WitnessStatement }> {
    try {
      const response = await apiInstance.put(`/incident-reports/witness-statements/${statementId}/verify`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Add follow-up action
   */
  async addFollowUpAction(data: {
    incidentReportId: string;
    action: string;
    description?: string;
    assignedTo?: string;
    dueDate?: string;
    createdBy: string;
  }): Promise<{ action: FollowUpAction }> {
    try {
      const response = await apiInstance.post(`/incident-reports/${data.incidentReportId}/follow-up-actions`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Delete incident report
   */
  async delete(id: string): Promise<{ success: boolean }> {
    try {
      const response = await apiInstance.delete(`/incident-reports/${id}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update witness statement
   */
  async updateWitnessStatement(id: string, data: Partial<WitnessStatement>): Promise<{ statement: WitnessStatement }> {
    try {
      const response = await apiInstance.put(`/incident-reports/witness-statements/${id}`, data)
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

  /**
   * Update follow-up action
   */
  async updateFollowUpAction(id: string, data: Partial<FollowUpAction>): Promise<{ action: FollowUpAction }> {
    try {
      const response = await apiInstance.put(`/incident-reports/follow-up-actions/${id}`, data)
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

  /**
   * Complete follow-up action
   */
  async completeFollowUpAction(id: string, notes?: string): Promise<{ action: FollowUpAction }> {
    try {
      const response = await apiInstance.put(`/incident-reports/follow-up-actions/${id}/complete`, { notes })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get follow-up actions for incident report
   */
  async getFollowUpActions(incidentReportId: string): Promise<{ actions: FollowUpAction[] }> {
    try {
      const response = await apiInstance.get(`/incident-reports/${incidentReportId}/follow-up-actions`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get witness statements for incident report
   */
  async getWitnessStatements(incidentReportId: string): Promise<{ statements: WitnessStatement[] }> {
    try {
      const response = await apiInstance.get(`/incident-reports/${incidentReportId}/witness-statements`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Generate report document
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
   * Export reports
   */
  async exportReports(params?: any): Promise<Blob> {
    try {
      const queryParams = params ? `?${buildUrlParams(params)}` : ''
      const response = await apiInstance.get(`/incident-reports/export${queryParams}`, { responseType: 'blob' })
      return response.data
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get statistics with date range
   */
  async getStatistics(dateFrom?: string, dateTo?: string): Promise<any> {
    try {
      const params = new URLSearchParams()
      if (dateFrom) params.append('dateFrom', dateFrom)
      if (dateTo) params.append('dateTo', dateTo)
      const queryString = params.toString() ? `?${params}` : ''
      const response = await apiInstance.get(`/incident-reports/statistics${queryString}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Upload evidence files
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

  /**
   * Submit to insurance
   */
  async submitToInsurance(id: string, insuranceData: any): Promise<{ submission: any }> {
    try {
      const response = await apiInstance.post(`/incident-reports/${id}/insurance-submission`, insuranceData)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get insurance submissions
   */
  async getInsuranceSubmissions(incidentReportId: string): Promise<{ submissions: any[] }> {
    try {
      const response = await apiInstance.get(`/incident-reports/${incidentReportId}/insurance-submissions`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

}

export const incidentReportsApi = new IncidentReportsApiImpl()
export type { IIncidentReportsApi }
