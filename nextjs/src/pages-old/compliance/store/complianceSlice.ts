/**
 * WF-SLI-013 | complianceSlice.ts - Compliance Redux Slice
 * Purpose: Redux slice for compliance management with service adapter
 * Dependencies: @reduxjs/toolkit, complianceApi
 * Features: Compliance tracking, reports, consent forms, policies
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../stores/reduxStore';
import { complianceApi } from '../../../services';

// API Service Adapter
class ComplianceApiService {
  // Reports Management
  async getComplianceReports(params?: any) {
    return complianceApi.getReports(params);
  }

  async getComplianceReport(id: string) {
    return complianceApi.getReportById(id);
  }

  async createComplianceReport(data: any) {
    return complianceApi.createReport(data);
  }

  async updateComplianceReport(id: string, data: any) {
    return complianceApi.updateReport(id, data);
  }

  async deleteComplianceReport(id: string) {
    return complianceApi.deleteReport(id);
  }

  async generateComplianceReport(reportType: string, period: string) {
    return complianceApi.generateReport(reportType, period);
  }

  // Checklist Items
  async addChecklistItem(data: any) {
    return complianceApi.addChecklistItem(data);
  }

  async updateChecklistItem(id: string, data: any) {
    return complianceApi.updateChecklistItem(id, data);
  }

  // Consent Forms
  async getConsentForms(filters?: any) {
    return complianceApi.getConsentForms(filters);
  }

  async createConsentForm(data: any) {
    return complianceApi.createConsentForm(data);
  }

  async signConsentForm(data: any) {
    return complianceApi.signConsentForm(data);
  }

  async getStudentConsents(studentId: string) {
    return complianceApi.getStudentConsents(studentId);
  }

  async withdrawConsent(signatureId: string) {
    return complianceApi.withdrawConsent(signatureId);
  }

  // Policy Documents
  async getPolicies(filters?: any) {
    return complianceApi.getPolicies(filters);
  }

  async createPolicy(data: any) {
    return complianceApi.createPolicy(data);
  }

  async updatePolicy(id: string, data: any) {
    return complianceApi.updatePolicy(id, data);
  }

  async acknowledgePolicy(policyId: string) {
    return complianceApi.acknowledgePolicy(policyId);
  }

  // Statistics and Audit Logs
  async getStatistics(period?: string) {
    return complianceApi.getStatistics(period);
  }

  async getAuditLogs(filters?: any) {
    return complianceApi.getAuditLogs(filters);
  }
}

const apiService = new ComplianceApiService();

// Interface definitions
interface ComplianceState {
  reports: any[];
  checklistItems: any[];
  consentForms: any[];
  policies: any[];
  auditLogs: any[];
  statistics: any;
  selectedReport: any | null;
  selectedConsentForm: any | null;
  selectedPolicy: any | null;
  filters: {
    reports: {
      reportType?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
    };
    consentForms: {
      active?: boolean;
      formType?: string;
    };
    policies: {
      status?: string;
      category?: string;
    };
    auditLogs: {
      action?: string;
      userId?: string;
      startDate?: string;
      endDate?: string;
    };
  };
  pagination: {
    reports: { page: number; limit: number; total: number };
    consentForms: { page: number; limit: number; total: number };
    policies: { page: number; limit: number; total: number };
    auditLogs: { page: number; limit: number; total: number };
  };
  loading: {
    reports: boolean;
    consentForms: boolean;
    policies: boolean;
    auditLogs: boolean;
    statistics: boolean;
    operations: boolean;
  };
  error: string | null;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: string;
  }>;
}

const initialState: ComplianceState = {
  reports: [],
  checklistItems: [],
  consentForms: [],
  policies: [],
  auditLogs: [],
  statistics: null,
  selectedReport: null,
  selectedConsentForm: null,
  selectedPolicy: null,
  filters: {
    reports: {},
    consentForms: {},
    policies: {},
    auditLogs: {}
  },
  pagination: {
    reports: { page: 1, limit: 20, total: 0 },
    consentForms: { page: 1, limit: 20, total: 0 },
    policies: { page: 1, limit: 20, total: 0 },
    auditLogs: { page: 1, limit: 20, total: 0 }
  },
  loading: {
    reports: false,
    consentForms: false,
    policies: false,
    auditLogs: false,
    statistics: false,
    operations: false
  },
  error: null,
  notifications: []
};

// Async Thunks
export const fetchComplianceReports = createAsyncThunk(
  'compliance/fetchReports',
  async (params?: any) => {
    const response = await apiService.getComplianceReports(params);
    return response;
  }
);

export const fetchComplianceReport = createAsyncThunk(
  'compliance/fetchReport',
  async (id: string) => {
    const response = await apiService.getComplianceReport(id);
    return response;
  }
);

export const createComplianceReport = createAsyncThunk(
  'compliance/createReport',
  async (reportData: any) => {
    const response = await apiService.createComplianceReport(reportData);
    return response;
  }
);

export const updateComplianceReport = createAsyncThunk(
  'compliance/updateReport',
  async ({ id, updates }: { id: string; updates: any }) => {
    const response = await apiService.updateComplianceReport(id, updates);
    return response;
  }
);

export const deleteComplianceReport = createAsyncThunk(
  'compliance/deleteReport',
  async (id: string) => {
    await apiService.deleteComplianceReport(id);
    return id;
  }
);

export const generateComplianceReport = createAsyncThunk(
  'compliance/generateReport',
  async ({ reportType, period }: { reportType: string; period: string }) => {
    const response = await apiService.generateComplianceReport(reportType, period);
    return response;
  }
);

export const fetchConsentForms = createAsyncThunk(
  'compliance/fetchConsentForms',
  async (filters?: any) => {
    const response = await apiService.getConsentForms(filters);
    return response;
  }
);

export const createConsentForm = createAsyncThunk(
  'compliance/createConsentForm',
  async (formData: any) => {
    const response = await apiService.createConsentForm(formData);
    return response;
  }
);

export const signConsentForm = createAsyncThunk(
  'compliance/signConsentForm',
  async (signData: any) => {
    const response = await apiService.signConsentForm(signData);
    return response;
  }
);

export const fetchStudentConsents = createAsyncThunk(
  'compliance/fetchStudentConsents',
  async (studentId: string) => {
    const response = await apiService.getStudentConsents(studentId);
    return response;
  }
);

export const withdrawConsent = createAsyncThunk(
  'compliance/withdrawConsent',
  async (signatureId: string) => {
    const response = await apiService.withdrawConsent(signatureId);
    return response;
  }
);

export const fetchPolicies = createAsyncThunk(
  'compliance/fetchPolicies',
  async (filters?: any) => {
    const response = await apiService.getPolicies(filters);
    return response;
  }
);

export const createPolicy = createAsyncThunk(
  'compliance/createPolicy',
  async (policyData: any) => {
    const response = await apiService.createPolicy(policyData);
    return response;
  }
);

export const updatePolicy = createAsyncThunk(
  'compliance/updatePolicy',
  async ({ id, updates }: { id: string; updates: any }) => {
    const response = await apiService.updatePolicy(id, updates);
    return response;
  }
);

export const acknowledgePolicy = createAsyncThunk(
  'compliance/acknowledgePolicy',
  async (policyId: string) => {
    const response = await apiService.acknowledgePolicy(policyId);
    return response;
  }
);

export const fetchStatistics = createAsyncThunk(
  'compliance/fetchStatistics',
  async (period?: string) => {
    const response = await apiService.getStatistics(period);
    return response;
  }
);

export const fetchAuditLogs = createAsyncThunk(
  'compliance/fetchAuditLogs',
  async (filters?: any) => {
    const response = await apiService.getAuditLogs(filters);
    return response;
  }
);

export const addChecklistItem = createAsyncThunk(
  'compliance/addChecklistItem',
  async (itemData: any) => {
    const response = await apiService.addChecklistItem(itemData);
    return response;
  }
);

export const updateChecklistItem = createAsyncThunk(
  'compliance/updateChecklistItem',
  async ({ id, updates }: { id: string; updates: any }) => {
    const response = await apiService.updateChecklistItem(id, updates);
    return response;
  }
);

// Slice
const complianceSlice = createSlice({
  name: 'compliance',
  initialState,
  reducers: {
    setSelectedReport: (state, action: PayloadAction<any | null>) => {
      state.selectedReport = action.payload;
    },
    setSelectedConsentForm: (state, action: PayloadAction<any | null>) => {
      state.selectedConsentForm = action.payload;
    },
    setSelectedPolicy: (state, action: PayloadAction<any | null>) => {
      state.selectedPolicy = action.payload;
    },
    setReportFilters: (state, action: PayloadAction<Partial<ComplianceState['filters']['reports']>>) => {
      state.filters.reports = { ...state.filters.reports, ...action.payload };
    },
    setConsentFormFilters: (state, action: PayloadAction<Partial<ComplianceState['filters']['consentForms']>>) => {
      state.filters.consentForms = { ...state.filters.consentForms, ...action.payload };
    },
    setPolicyFilters: (state, action: PayloadAction<Partial<ComplianceState['filters']['policies']>>) => {
      state.filters.policies = { ...state.filters.policies, ...action.payload };
    },
    setAuditLogFilters: (state, action: PayloadAction<Partial<ComplianceState['filters']['auditLogs']>>) => {
      state.filters.auditLogs = { ...state.filters.auditLogs, ...action.payload };
    },
    setReportsPagination: (state, action: PayloadAction<Partial<ComplianceState['pagination']['reports']>>) => {
      state.pagination.reports = { ...state.pagination.reports, ...action.payload };
    },
    setConsentFormsPagination: (state, action: PayloadAction<Partial<ComplianceState['pagination']['consentForms']>>) => {
      state.pagination.consentForms = { ...state.pagination.consentForms, ...action.payload };
    },
    setPoliciesPagination: (state, action: PayloadAction<Partial<ComplianceState['pagination']['policies']>>) => {
      state.pagination.policies = { ...state.pagination.policies, ...action.payload };
    },
    setAuditLogsPagination: (state, action: PayloadAction<Partial<ComplianceState['pagination']['auditLogs']>>) => {
      state.pagination.auditLogs = { ...state.pagination.auditLogs, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Omit<ComplianceState['notifications'][0], 'id' | 'timestamp'>>) => {
      const notification = {
        ...action.payload,
        id: `notification_${Date.now()}_${Math.random()}`,
        timestamp: new Date().toISOString()
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    clearFilters: (state) => {
      state.filters = {
        reports: {},
        consentForms: {},
        policies: {},
        auditLogs: {}
      };
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // Reports
    builder
      .addCase(fetchComplianceReports.pending, (state) => {
        state.loading.reports = true;
        state.error = null;
      })
      .addCase(fetchComplianceReports.fulfilled, (state, action) => {
        state.loading.reports = false;
        state.reports = action.payload.data || action.payload.reports || action.payload || [];
        if (action.payload.pagination) {
          state.pagination.reports = { ...state.pagination.reports, ...action.payload.pagination };
        }
      })
      .addCase(fetchComplianceReports.rejected, (state, action) => {
        state.loading.reports = false;
        state.error = action.error.message || 'Failed to fetch compliance reports';
      });

    // Report by ID
    builder
      .addCase(fetchComplianceReport.pending, (state) => {
        state.loading.operations = true;
      })
      .addCase(fetchComplianceReport.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.selectedReport = action.payload.data || action.payload;
      })
      .addCase(fetchComplianceReport.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to fetch compliance report';
      });

    // Create report
    builder
      .addCase(createComplianceReport.pending, (state) => {
        state.loading.operations = true;
      })
      .addCase(createComplianceReport.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.reports.push(action.payload.data || action.payload);
      })
      .addCase(createComplianceReport.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to create compliance report';
      });

    // Update report
    builder
      .addCase(updateComplianceReport.pending, (state) => {
        state.loading.operations = true;
      })
      .addCase(updateComplianceReport.fulfilled, (state, action) => {
        state.loading.operations = false;
        const reportData = action.payload.data || action.payload;
        const index = state.reports.findIndex(r => r.id === reportData.id);
        if (index !== -1) {
          state.reports[index] = reportData;
        }
        if (state.selectedReport?.id === reportData.id) {
          state.selectedReport = reportData;
        }
      })
      .addCase(updateComplianceReport.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to update compliance report';
      });

    // Delete report
    builder
      .addCase(deleteComplianceReport.pending, (state) => {
        state.loading.operations = true;
      })
      .addCase(deleteComplianceReport.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.reports = state.reports.filter(r => r.id !== action.payload);
        if (state.selectedReport?.id === action.payload) {
          state.selectedReport = null;
        }
      })
      .addCase(deleteComplianceReport.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to delete compliance report';
      });

    // Generate report
    builder
      .addCase(generateComplianceReport.pending, (state) => {
        state.loading.operations = true;
      })
      .addCase(generateComplianceReport.fulfilled, (state, action) => {
        state.loading.operations = false;
        state.reports.push(action.payload.data || action.payload);
      })
      .addCase(generateComplianceReport.rejected, (state, action) => {
        state.loading.operations = false;
        state.error = action.error.message || 'Failed to generate compliance report';
      });

    // Consent Forms
    builder
      .addCase(fetchConsentForms.pending, (state) => {
        state.loading.consentForms = true;
      })
      .addCase(fetchConsentForms.fulfilled, (state, action) => {
        state.loading.consentForms = false;
        state.consentForms = action.payload.data || action.payload.forms || action.payload || [];
        if (action.payload.pagination) {
          state.pagination.consentForms = { ...state.pagination.consentForms, ...action.payload.pagination };
        }
      })
      .addCase(fetchConsentForms.rejected, (state, action) => {
        state.loading.consentForms = false;
        state.error = action.error.message || 'Failed to fetch consent forms';
      });

    // Create consent form
    builder
      .addCase(createConsentForm.fulfilled, (state, action) => {
        state.consentForms.push(action.payload.data || action.payload);
      });

    // Policies
    builder
      .addCase(fetchPolicies.pending, (state) => {
        state.loading.policies = true;
      })
      .addCase(fetchPolicies.fulfilled, (state, action) => {
        state.loading.policies = false;
        state.policies = action.payload.data || action.payload.policies || action.payload || [];
        if (action.payload.pagination) {
          state.pagination.policies = { ...state.pagination.policies, ...action.payload.pagination };
        }
      })
      .addCase(fetchPolicies.rejected, (state, action) => {
        state.loading.policies = false;
        state.error = action.error.message || 'Failed to fetch policies';
      });

    // Create policy
    builder
      .addCase(createPolicy.fulfilled, (state, action) => {
        state.policies.push(action.payload.data || action.payload);
      });

    // Update policy
    builder
      .addCase(updatePolicy.fulfilled, (state, action) => {
        const policyData = action.payload.data || action.payload;
        const index = state.policies.findIndex(p => p.id === policyData.id);
        if (index !== -1) {
          state.policies[index] = policyData;
        }
        if (state.selectedPolicy?.id === policyData.id) {
          state.selectedPolicy = policyData;
        }
      });

    // Statistics
    builder
      .addCase(fetchStatistics.pending, (state) => {
        state.loading.statistics = true;
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.loading.statistics = false;
        state.statistics = action.payload.data || action.payload;
      })
      .addCase(fetchStatistics.rejected, (state, action) => {
        state.loading.statistics = false;
        state.error = action.error.message || 'Failed to fetch statistics';
      });

    // Audit Logs
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading.auditLogs = true;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading.auditLogs = false;
        state.auditLogs = action.payload.data || action.payload.logs || action.payload || [];
        if (action.payload.pagination) {
          state.pagination.auditLogs = { ...state.pagination.auditLogs, ...action.payload.pagination };
        }
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading.auditLogs = false;
        state.error = action.error.message || 'Failed to fetch audit logs';
      });

    // Checklist Items
    builder
      .addCase(addChecklistItem.fulfilled, (state, action) => {
        state.checklistItems.push(action.payload.data || action.payload);
      })
      .addCase(updateChecklistItem.fulfilled, (state, action) => {
        const itemData = action.payload.data || action.payload;
        const index = state.checklistItems.findIndex(item => item.id === itemData.id);
        if (index !== -1) {
          state.checklistItems[index] = itemData;
        }
      });
  }
});

// Actions
export const {
  setSelectedReport,
  setSelectedConsentForm,
  setSelectedPolicy,
  setReportFilters,
  setConsentFormFilters,
  setPolicyFilters,
  setAuditLogFilters,
  setReportsPagination,
  setConsentFormsPagination,
  setPoliciesPagination,
  setAuditLogsPagination,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  clearFilters,
  resetState
} = complianceSlice.actions;

// Selectors
export const selectComplianceState = (state: RootState) => state.compliance;
export const selectReports = (state: RootState) => state.compliance.reports;
export const selectChecklistItems = (state: RootState) => state.compliance.checklistItems;
export const selectConsentForms = (state: RootState) => state.compliance.consentForms;
export const selectPolicies = (state: RootState) => state.compliance.policies;
export const selectAuditLogs = (state: RootState) => state.compliance.auditLogs;
export const selectStatistics = (state: RootState) => state.compliance.statistics;
export const selectSelectedReport = (state: RootState) => state.compliance.selectedReport;
export const selectSelectedConsentForm = (state: RootState) => state.compliance.selectedConsentForm;
export const selectSelectedPolicy = (state: RootState) => state.compliance.selectedPolicy;
export const selectReportFilters = (state: RootState) => state.compliance.filters.reports;
export const selectConsentFormFilters = (state: RootState) => state.compliance.filters.consentForms;
export const selectPolicyFilters = (state: RootState) => state.compliance.filters.policies;
export const selectAuditLogFilters = (state: RootState) => state.compliance.filters.auditLogs;
export const selectReportsPagination = (state: RootState) => state.compliance.pagination.reports;
export const selectConsentFormsPagination = (state: RootState) => state.compliance.pagination.consentForms;
export const selectPoliciesPagination = (state: RootState) => state.compliance.pagination.policies;
export const selectAuditLogsPagination = (state: RootState) => state.compliance.pagination.auditLogs;
export const selectLoading = (state: RootState) => state.compliance.loading;
export const selectError = (state: RootState) => state.compliance.error;
export const selectNotifications = (state: RootState) => state.compliance.notifications;

// Derived selectors
export const selectActiveConsentForms = (state: RootState) =>
  state.compliance.consentForms.filter(form => form.active);

export const selectActivePolicies = (state: RootState) =>
  state.compliance.policies.filter(policy => policy.status === 'ACTIVE' || policy.status === 'APPROVED');

export const selectRecentAuditLogs = (state: RootState) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return state.compliance.auditLogs.filter(log => 
    new Date(log.createdAt) >= thirtyDaysAgo
  );
};

export const selectFilteredReports = (state: RootState) => {
  const { reports, filters } = state.compliance;
  let filtered = reports;

  if (filters.reports.reportType) {
    filtered = filtered.filter(report => report.reportType === filters.reports.reportType);
  }

  if (filters.reports.status) {
    filtered = filtered.filter(report => report.status === filters.reports.status);
  }

  if (filters.reports.startDate && filters.reports.endDate) {
    const startDate = new Date(filters.reports.startDate);
    const endDate = new Date(filters.reports.endDate);
    filtered = filtered.filter(report => {
      const reportDate = new Date(report.createdAt);
      return reportDate >= startDate && reportDate <= endDate;
    });
  }

  return filtered;
};

export const selectFilteredConsentForms = (state: RootState) => {
  const { consentForms, filters } = state.compliance;
  let filtered = consentForms;

  if (filters.consentForms.active !== undefined) {
    filtered = filtered.filter(form => form.active === filters.consentForms.active);
  }

  if (filters.consentForms.formType) {
    filtered = filtered.filter(form => form.formType === filters.consentForms.formType);
  }

  return filtered;
};

export const selectFilteredPolicies = (state: RootState) => {
  const { policies, filters } = state.compliance;
  let filtered = policies;

  if (filters.policies.status) {
    filtered = filtered.filter(policy => policy.status === filters.policies.status);
  }

  if (filters.policies.category) {
    filtered = filtered.filter(policy => policy.category === filters.policies.category);
  }

  return filtered;
};

export const selectComplianceOverview = (state: RootState) => {
  const { reports, consentForms, policies, auditLogs } = state.compliance;
  
  const totalReports = reports.length;
  const completedReports = reports.filter(r => r.status === 'COMPLETED').length;
  const pendingReports = reports.filter(r => r.status === 'PENDING' || r.status === 'IN_PROGRESS').length;
  
  const totalConsentForms = consentForms.length;
  const activeConsentForms = selectActiveConsentForms(state).length;
  
  const totalPolicies = policies.length;
  const activePolicies = selectActivePolicies(state).length;
  
  const recentAuditLogs = selectRecentAuditLogs(state).length;

  return {
    totalReports,
    completedReports,
    pendingReports,
    totalConsentForms,
    activeConsentForms,
    totalPolicies,
    activePolicies,
    recentAuditLogs
  };
};

export default complianceSlice.reducer;
