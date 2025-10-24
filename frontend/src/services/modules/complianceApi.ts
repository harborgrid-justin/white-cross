/**
 * WF-COMP-274 | complianceApi.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../config/apiConfig, ../utils/apiUtils | Dependencies: ../config/apiConfig, ../utils/apiUtils
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, types | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import type { IComplianceApi } from '../types'
import type {
  ComplianceReport,
  ChecklistItem,
  ConsentForm,
  PolicyDocument
} from '../types'
import type {
  ComplianceChecklistItem,
  ConsentSignature,
  PolicyAcknowledgment,
  AuditLog,
  ComplianceStatistics,
  ComplianceReportFilters,
  ConsentFormFilters,
  PolicyDocumentFilters,
  AuditLogFilters,
  CreateComplianceReportData,
  UpdateComplianceReportData,
  CreateChecklistItemData,
  UpdateChecklistItemData,
  CreateConsentFormData,
  SignConsentFormData,
  CreatePolicyData,
  UpdatePolicyData,
  ComplianceReportsResponse,
  ComplianceReportResponse,
  ConsentFormsResponse,
  ConsentSignatureResponse,
  StudentConsentsResponse,
  PolicyDocumentsResponse,
  PolicyDocumentResponse,
  PolicyAcknowledgmentResponse,
  AuditLogsResponse,
  ChecklistItemResponse,
  ConsentFormResponse,
  SuccessResponse,
} from '../../types/compliance'
import type { ApiClient } from '../core/ApiClient'
import { extractApiData, handleApiError } from '../utils/apiUtils'

/**
 * Compliance API implementation
 * Handles compliance reports, checklists, consent forms, and policies
 * Supports HIPAA/FERPA compliance tracking with comprehensive audit logging
 */
class ComplianceApiImpl implements IComplianceApi {
  constructor(private readonly client: ApiClient) {}
  // ============================================================================
  // Compliance Reports
  // ============================================================================

  /**
   * Get compliance reports with pagination and filters
   */
  async getReports(params?: ComplianceReportFilters): Promise<ComplianceReportsResponse> {
    try {
      const response = await this.client.get('/compliance', { params })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get compliance report by ID with checklist items
   */
  async getReportById(id: string): Promise<ComplianceReportResponse> {
    try {
      const response = await this.client.get(`/compliance/${id}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Create a new compliance report
   */
  async createReport(data: CreateComplianceReportData): Promise<ComplianceReportResponse> {
    try {
      const response = await this.client.post('/compliance', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update a compliance report (status, findings, recommendations)
   */
  async updateReport(id: string, data: UpdateComplianceReportData): Promise<ComplianceReportResponse> {
    try {
      const response = await this.client.put(`/compliance/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Delete a compliance report
   */
  async deleteReport(id: string): Promise<SuccessResponse> {
    try {
      const response = await this.client.delete(`/compliance/${id}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Generate a compliance report with automatic checklist items
   */
  async generateReport(reportType: string, period: string): Promise<ComplianceReportResponse> {
    try {
      const response = await this.client.post('/compliance/generate', { reportType, period })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // ============================================================================
  // Checklist Items
  // ============================================================================

  /**
   * Add a checklist item to a report
   */
  async addChecklistItem(data: CreateChecklistItemData): Promise<ChecklistItemResponse> {
    try {
      const response = await this.client.post('/compliance/checklist-items', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update a checklist item (status, evidence, notes)
   */
  async updateChecklistItem(id: string, data: UpdateChecklistItemData): Promise<ChecklistItemResponse> {
    try {
      const response = await this.client.put(`/compliance/checklist-items/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // ============================================================================
  // Consent Forms
  // ============================================================================

  /**
   * Get consent forms with optional active status filter
   */
  async getConsentForms(filters?: ConsentFormFilters): Promise<ConsentFormsResponse> {
    try {
      const response = await this.client.get('/compliance/consent/forms', {
        params: filters
      })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Create a consent form template
   */
  async createConsentForm(data: CreateConsentFormData): Promise<ConsentFormResponse> {
    try {
      const response = await this.client.post('/compliance/consent/forms', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Sign a consent form for a student
   * Maps frontend field names to backend expected names
   */
  async signConsentForm(data: SignConsentFormData): Promise<ConsentSignatureResponse> {
    try {
      // Map frontend field names to backend expected names
      const requestData = {
        consentFormId: data.consentFormId,
        studentId: data.studentId,
        signedBy: data.signedBy,
        relationship: data.relationship,
        signatureData: data.signatureData,
      }
      const response = await this.client.post('/compliance/consent/sign', requestData)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get all consent signatures for a student
   */
  async getStudentConsents(studentId: string): Promise<StudentConsentsResponse> {
    try {
      const response = await this.client.get(`/compliance/consent/student/${studentId}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Withdraw a consent signature
   */
  async withdrawConsent(signatureId: string): Promise<ConsentSignatureResponse> {
    try {
      const response = await this.client.put(`/compliance/consent/${signatureId}/withdraw`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // ============================================================================
  // Policy Documents
  // ============================================================================

  /**
   * Get policy documents with filters
   */
  async getPolicies(filters?: PolicyDocumentFilters): Promise<PolicyDocumentsResponse> {
    try {
      const response = await this.client.get('/compliance/policies', { params: filters })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Create a new policy document
   */
  async createPolicy(data: CreatePolicyData): Promise<PolicyDocumentResponse> {
    try {
      const response = await this.client.post('/compliance/policies', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update a policy document (status, approval, review date)
   */
  async updatePolicy(id: string, data: UpdatePolicyData): Promise<PolicyDocumentResponse> {
    try {
      const response = await this.client.put(`/compliance/policies/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Acknowledge a policy document (tracks user acceptance)
   */
  async acknowledgePolicy(policyId: string): Promise<PolicyAcknowledgmentResponse> {
    try {
      const response = await this.client.post(`/compliance/policies/${policyId}/acknowledge`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // ============================================================================
  // Statistics and Audit Logs
  // ============================================================================

  /**
   * Get compliance statistics overview
   */
  async getStatistics(period?: string): Promise<ComplianceStatistics> {
    try {
      const response = await this.client.get('/compliance/statistics/overview', {
        params: { period }
      })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get audit logs with pagination and filters for HIPAA compliance
   */
  async getAuditLogs(filters?: AuditLogFilters): Promise<AuditLogsResponse> {
    try {
      const response = await this.client.get('/compliance/audit-logs', { params: filters })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }
}

export type { IComplianceApi }
export function createComplianceApi(client: ApiClient): IComplianceApi {
  return new ComplianceApiImpl(client);
}

// Export singleton instance
import { apiClient } from '../core/ApiClient'
export const complianceApi = createComplianceApi(apiClient)
