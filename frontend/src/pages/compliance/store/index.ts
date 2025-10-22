/**
 * WF-STO-014 | store/index.ts - Compliance Store Module Exports
 * Purpose: Central exports for compliance store module
 * Dependencies: complianceSlice
 * Features: Store actions, selectors, and thunks exports
 */

// Export all store components
export { default as complianceReducer } from './complianceSlice';

// Export actions
export {
  // Report Actions
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
  resetState,
} from './complianceSlice';

// Export async thunks
export {
  // Report Thunks
  fetchComplianceReports,
  fetchComplianceReport,
  createComplianceReport,
  updateComplianceReport,
  deleteComplianceReport,
  generateComplianceReport,
  
  // Consent Form Thunks
  fetchConsentForms,
  createConsentForm,
  signConsentForm,
  fetchStudentConsents,
  withdrawConsent,
  
  // Policy Thunks
  fetchPolicies,
  createPolicy,
  updatePolicy,
  acknowledgePolicy,
  
  // Statistics and Audit Thunks
  fetchStatistics,
  fetchAuditLogs,
  
  // Checklist Item Thunks
  addChecklistItem,
  updateChecklistItem,
} from './complianceSlice';

// Export selectors
export {
  // Basic Selectors
  selectComplianceState,
  selectReports,
  selectChecklistItems,
  selectConsentForms,
  selectPolicies,
  selectAuditLogs,
  selectStatistics,
  selectSelectedReport,
  selectSelectedConsentForm,
  selectSelectedPolicy,
  selectReportFilters,
  selectConsentFormFilters,
  selectPolicyFilters,
  selectAuditLogFilters,
  selectReportsPagination,
  selectConsentFormsPagination,
  selectPoliciesPagination,
  selectAuditLogsPagination,
  selectLoading,
  selectError,
  selectNotifications,
  
  // Derived Selectors
  selectActiveConsentForms,
  selectActivePolicies,
  selectRecentAuditLogs,
  selectFilteredReports,
  selectFilteredConsentForms,
  selectFilteredPolicies,
  selectComplianceOverview,
} from './complianceSlice';
