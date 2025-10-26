/**
 * Compliance Store - Export Module
 *
 * Centralized re-export point for all compliance-related Redux state management.
 * Provides comprehensive HIPAA/FERPA compliance tracking, audit logging, policy
 * management, and consent form workflows.
 *
 * @module pages/compliance/store
 *
 * @remarks
 * This module exports compliance state management for:
 * - **Compliance Reports**: HIPAA/FERPA compliance reporting
 * - **Consent Forms**: Patient consent and authorization tracking
 * - **Policy Management**: Policy documents and acknowledgments
 * - **Audit Logs**: Comprehensive audit trail for PHI access
 * - **Checklists**: Compliance verification checklists
 * - **Statistics**: Compliance metrics and analytics
 *
 * Regulatory Features:
 * - HIPAA compliance tracking and reporting
 * - FERPA student records compliance
 * - Breach notification workflows
 * - Risk assessment and mitigation
 * - Policy acknowledgment tracking
 * - Consent form management
 * - Audit trail with tamper detection
 *
 * Report Types:
 * - HIPAA compliance reports
 * - FERPA compliance reports
 * - Security incident reports
 * - Access violation reports
 * - Consent compliance reports
 * - Policy acknowledgment reports
 *
 * Audit Trail Features:
 * - PHI access logging
 * - User action tracking
 * - System event logging
 * - Change history with diff tracking
 * - Retention policy enforcement
 * - Tamper-evident audit logs
 *
 * Healthcare Compliance Context:
 * - All PHI access is logged and auditable
 * - Consent forms track parental authorization
 * - Policy management ensures staff compliance
 * - Breach detection and notification workflows
 * - Risk assessments for compliance gaps
 * - Regular compliance report generation
 *
 * @example
 * ```typescript
 * // Import compliance store
 * import {
 *   complianceReducer,
 *   fetchComplianceReports,
 *   createConsentForm,
 *   acknowledgePolicy,
 *   fetchAuditLogs,
 *   selectActiveConsentForms,
 *   selectRecentAuditLogs
 * } from '@/pages/compliance/store';
 *
 * // Generate HIPAA compliance report
 * dispatch(generateComplianceReport('HIPAA', '2025-Q1'));
 *
 * // Track consent form signing
 * dispatch(signConsentForm({
 *   formId: 'consent-123',
 *   studentId: 'student-456',
 *   parentSignature: signatureData,
 *   signedAt: new Date().toISOString()
 * }));
 *
 * // View audit trail
 * const auditLogs = useSelector(selectRecentAuditLogs);
 * dispatch(fetchAuditLogs({
 *   entityType: 'STUDENT',
 *   entityId: 'student-789',
 *   startDate: '2025-01-01',
 *   actions: ['VIEW', 'UPDATE']
 * }));
 * ```
 *
 * @see {@link module:pages/compliance/store/complianceSlice} for implementation
 * @see {@link module:services/modules/complianceApi} for API integration
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
