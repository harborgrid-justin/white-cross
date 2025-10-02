import api from './api';

export interface ComplianceReport {
  id: string;
  reportType: string;
  title: string;
  description?: string;
  status: string;
  period: string;
  findings?: any;
  recommendations?: any;
  dueDate?: string;
  submittedAt?: string;
  submittedBy?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
  items?: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  requirement: string;
  description?: string;
  category: string;
  status: string;
  evidence?: string;
  notes?: string;
  dueDate?: string;
  completedAt?: string;
  completedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConsentForm {
  id: string;
  type: string;
  title: string;
  description: string;
  content: string;
  version: string;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PolicyDocument {
  id: string;
  title: string;
  category: string;
  content: string;
  version: string;
  effectiveDate: string;
  reviewDate?: string;
  status: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const complianceApi = {
  // Compliance Reports
  getReports: async (params?: any) => {
    const response = await api.get('/compliance', { params });
    return response.data.data;
  },

  getReportById: async (id: string) => {
    const response = await api.get(`/compliance/${id}`);
    return response.data.data;
  },

  createReport: async (data: any) => {
    const response = await api.post('/compliance', data);
    return response.data.data;
  },

  updateReport: async (id: string, data: any) => {
    const response = await api.put(`/compliance/${id}`, data);
    return response.data.data;
  },

  deleteReport: async (id: string) => {
    const response = await api.delete(`/compliance/${id}`);
    return response.data.data;
  },

  generateReport: async (reportType: string, period: string) => {
    const response = await api.post('/compliance/generate', { reportType, period });
    return response.data.data;
  },

  // Checklist Items
  addChecklistItem: async (data: any) => {
    const response = await api.post('/compliance/checklist-items', data);
    return response.data.data;
  },

  updateChecklistItem: async (id: string, data: any) => {
    const response = await api.put(`/compliance/checklist-items/${id}`, data);
    return response.data.data;
  },

  // Consent Forms
  getConsentForms: async (isActive?: boolean) => {
    const response = await api.get('/compliance/consent/forms', {
      params: { isActive }
    });
    return response.data.data;
  },

  createConsentForm: async (data: any) => {
    const response = await api.post('/compliance/consent/forms', data);
    return response.data.data;
  },

  signConsentForm: async (data: any) => {
    const response = await api.post('/compliance/consent/sign', data);
    return response.data.data;
  },

  getStudentConsents: async (studentId: string) => {
    const response = await api.get(`/compliance/consent/student/${studentId}`);
    return response.data.data;
  },

  withdrawConsent: async (signatureId: string) => {
    const response = await api.put(`/compliance/consent/${signatureId}/withdraw`);
    return response.data.data;
  },

  // Policies
  getPolicies: async (params?: any) => {
    const response = await api.get('/compliance/policies', { params });
    return response.data.data;
  },

  createPolicy: async (data: any) => {
    const response = await api.post('/compliance/policies', data);
    return response.data.data;
  },

  updatePolicy: async (id: string, data: any) => {
    const response = await api.put(`/compliance/policies/${id}`, data);
    return response.data.data;
  },

  acknowledgePolicy: async (policyId: string) => {
    const response = await api.post(`/compliance/policies/${policyId}/acknowledge`);
    return response.data.data;
  },

  // Statistics and Audit
  getStatistics: async (period?: string) => {
    const response = await api.get('/compliance/statistics/overview', {
      params: { period }
    });
    return response.data;
  },

  getAuditLogs: async (params?: any) => {
    const response = await api.get('/compliance/audit-logs', { params });
    return response.data.data;
  },
};
