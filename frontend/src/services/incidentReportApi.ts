import api from './api'
import { IncidentReport, WitnessStatement, FollowUpAction, ApiResponse } from '../types'

export const incidentReportApi = {
  // Get all incident reports
  getAll: async (page = 1, limit = 20, filters?: any): Promise<{
    reports: IncidentReport[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    })
    const response = await api.get<ApiResponse<{
      reports: IncidentReport[]
      pagination: any
    }>>(`/incident-reports?${params}`)
    return response.data.data!
  },

  // Get incident report by ID
  getById: async (id: string): Promise<{ report: IncidentReport }> => {
    const response = await api.get<ApiResponse<{ report: IncidentReport }>>(`/incident-reports/${id}`)
    return response.data.data!
  },

  // Create new incident report
  create: async (data: Partial<IncidentReport>): Promise<{ report: IncidentReport }> => {
    const response = await api.post<ApiResponse<{ report: IncidentReport }>>('/incident-reports', data)
    return response.data.data!
  },

  // Update incident report
  update: async (id: string, data: Partial<IncidentReport>): Promise<{ report: IncidentReport }> => {
    const response = await api.put<ApiResponse<{ report: IncidentReport }>>(`/incident-reports/${id}`, data)
    return response.data.data!
  },

  // Generate incident report document
  generateDocument: async (id: string): Promise<{ document: any }> => {
    const response = await api.get<ApiResponse<{ document: any }>>(`/incident-reports/${id}/document`)
    return response.data.data!
  },

  // Add witness statement
  addWitnessStatement: async (incidentId: string, data: Partial<WitnessStatement>): Promise<{ statement: WitnessStatement }> => {
    const response = await api.post<ApiResponse<{ statement: WitnessStatement }>>(`/incident-reports/${incidentId}/witness-statements`, data)
    return response.data.data!
  },

  // Verify witness statement
  verifyWitnessStatement: async (statementId: string): Promise<{ statement: WitnessStatement }> => {
    const response = await api.put<ApiResponse<{ statement: WitnessStatement }>>(`/incident-reports/witness-statements/${statementId}/verify`)
    return response.data.data!
  },

  // Add follow-up action
  addFollowUpAction: async (incidentId: string, data: Partial<FollowUpAction>): Promise<{ action: FollowUpAction }> => {
    const response = await api.post<ApiResponse<{ action: FollowUpAction }>>(`/incident-reports/${incidentId}/follow-up-actions`, data)
    return response.data.data!
  },

  // Update follow-up action
  updateFollowUpAction: async (actionId: string, status: string, notes?: string): Promise<{ action: FollowUpAction }> => {
    const response = await api.put<ApiResponse<{ action: FollowUpAction }>>(`/incident-reports/follow-up-actions/${actionId}`, { status, notes })
    return response.data.data!
  },

  // Add evidence
  addEvidence: async (incidentId: string, evidenceType: 'photo' | 'video', evidenceUrls: string[]): Promise<{ report: IncidentReport }> => {
    const response = await api.post<ApiResponse<{ report: IncidentReport }>>(`/incident-reports/${incidentId}/evidence`, {
      evidenceType,
      evidenceUrls
    })
    return response.data.data!
  },

  // Update insurance claim
  updateInsuranceClaim: async (incidentId: string, claimNumber: string, status: string): Promise<{ report: IncidentReport }> => {
    const response = await api.put<ApiResponse<{ report: IncidentReport }>>(`/incident-reports/${incidentId}/insurance-claim`, {
      claimNumber,
      status
    })
    return response.data.data!
  },

  // Update compliance status
  updateComplianceStatus: async (incidentId: string, status: string): Promise<{ report: IncidentReport }> => {
    const response = await api.put<ApiResponse<{ report: IncidentReport }>>(`/incident-reports/${incidentId}/compliance`, {
      status
    })
    return response.data.data!
  },

  // Send parent notification
  notifyParent: async (incidentId: string, method: 'email' | 'sms' | 'voice'): Promise<{ report: IncidentReport }> => {
    const response = await api.post<ApiResponse<{ report: IncidentReport }>>(`/incident-reports/${incidentId}/notify-parent-automated`, {
      method
    })
    return response.data.data!
  },

  // Get statistics
  getStatistics: async (filters?: any): Promise<any> => {
    const params = new URLSearchParams(filters)
    const response = await api.get<ApiResponse<any>>(`/incident-reports/statistics/overview?${params}`)
    return response.data.data!
  },

  // Search incident reports
  search: async (query: string, page = 1, limit = 20): Promise<{
    reports: IncidentReport[]
    pagination: any
  }> => {
    const response = await api.get<ApiResponse<{
      reports: IncidentReport[]
      pagination: any
    }>>(`/incident-reports/search/${query}?page=${page}&limit=${limit}`)
    return response.data.data!
  }
}
