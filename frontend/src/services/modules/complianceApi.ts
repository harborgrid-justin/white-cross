import type { IComplianceApi } from '../types'
import type { 
  ComplianceReport, 
  ChecklistItem, 
  ConsentForm, 
  PolicyDocument 
} from '../types'
import { apiInstance } from '../config/apiConfig'
import { extractApiData, handleApiError } from '../utils/apiUtils'

/**
 * Compliance API implementation
 * Handles compliance reports, checklists, consent forms, and policies
 */
class ComplianceApiImpl implements IComplianceApi {
  // Compliance Reports
  /**
   * Get compliance reports
   */
  async getReports(params?: any): Promise<{ reports: ComplianceReport[] }> {
    try {
      const response = await apiInstance.get('/compliance', { params })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get compliance report by ID
   */
  async getReportById(id: string): Promise<{ report: ComplianceReport }> {
    try {
      const response = await apiInstance.get(`/compliance/${id}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Create a new compliance report
   */
  async createReport(data: {
    reportType: string;
    title: string;
    description?: string;
    period: string;
    dueDate?: string;
  }): Promise<{ report: ComplianceReport }> {
    try {
      const response = await apiInstance.post('/compliance', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update a compliance report
   */
  async updateReport(id: string, data: Partial<ComplianceReport>): Promise<{ report: ComplianceReport }> {
    try {
      const response = await apiInstance.put(`/compliance/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Delete a compliance report
   */
  async deleteReport(id: string): Promise<{ success: boolean }> {
    try {
      const response = await apiInstance.delete(`/compliance/${id}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Generate a compliance report
   */
  async generateReport(reportType: string, period: string): Promise<{ report: ComplianceReport }> {
    try {
      const response = await apiInstance.post('/compliance/generate', { reportType, period })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Checklist Items
  /**
   * Add a checklist item
   */
  async addChecklistItem(data: {
    requirement: string;
    description?: string;
    category: string;
    dueDate?: string;
  }): Promise<{ item: ChecklistItem }> {
    try {
      const response = await apiInstance.post('/compliance/checklist-items', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update a checklist item
   */
  async updateChecklistItem(id: string, data: Partial<ChecklistItem>): Promise<{ item: ChecklistItem }> {
    try {
      const response = await apiInstance.put(`/compliance/checklist-items/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Consent Forms
  /**
   * Get consent forms
   */
  async getConsentForms(isActive?: boolean): Promise<{ forms: ConsentForm[] }> {
    try {
      const response = await apiInstance.get('/compliance/consent/forms', {
        params: { isActive }
      })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Create a consent form
   */
  async createConsentForm(data: {
    type: string;
    title: string;
    description: string;
    content: string;
    version: string;
    expiresAt?: string;
  }): Promise<{ form: ConsentForm }> {
    try {
      const response = await apiInstance.post('/compliance/consent/forms', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Sign a consent form
   */
  async signConsentForm(data: {
    formId: string;
    studentId: string;
    signatureData: string;
    signedBy: string;
    signedByRole: string;
  }): Promise<{ signature: any }> {
    try {
      const response = await apiInstance.post('/compliance/consent/sign', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get student consents
   */
  async getStudentConsents(studentId: string): Promise<{ consents: any[] }> {
    try {
      const response = await apiInstance.get(`/compliance/consent/student/${studentId}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Withdraw consent
   */
  async withdrawConsent(signatureId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiInstance.put(`/compliance/consent/${signatureId}/withdraw`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Policies
  /**
   * Get policies
   */
  async getPolicies(params?: any): Promise<{ policies: PolicyDocument[] }> {
    try {
      const response = await apiInstance.get('/compliance/policies', { params })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Create a policy
   */
  async createPolicy(data: {
    title: string;
    category: string;
    content: string;
    version: string;
    effectiveDate: string;
    reviewDate?: string;
  }): Promise<{ policy: PolicyDocument }> {
    try {
      const response = await apiInstance.post('/compliance/policies', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update a policy
   */
  async updatePolicy(id: string, data: Partial<PolicyDocument>): Promise<{ policy: PolicyDocument }> {
    try {
      const response = await apiInstance.put(`/compliance/policies/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Acknowledge a policy
   */
  async acknowledgePolicy(policyId: string): Promise<{ acknowledgment: any }> {
    try {
      const response = await apiInstance.post(`/compliance/policies/${policyId}/acknowledge`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Statistics and Audit
  /**
   * Get compliance statistics
   */
  async getStatistics(period?: string): Promise<any> {
    try {
      const response = await apiInstance.get('/compliance/statistics/overview', {
        params: { period }
      })
      return response.data
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get audit logs
   */
  async getAuditLogs(params?: any): Promise<{ logs: any[] }> {
    try {
      const response = await apiInstance.get('/compliance/audit-logs', { params })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }
}

export const complianceApi = new ComplianceApiImpl()
export type { IComplianceApi }
