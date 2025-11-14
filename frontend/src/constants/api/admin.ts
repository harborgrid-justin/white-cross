/**
 * @fileoverview Admin & Analytics API Endpoints
 * @module constants/api/admin
 * @category API - Administration
 * 
 * System administration, analytics, reporting, billing, and compliance endpoint definitions.
 */

// ==========================================
// DASHBOARD
// ==========================================
export const DASHBOARD_ENDPOINTS = {
  STATS: `/api/v1/dashboard/stats`,
  RECENT_ACTIVITIES: `/api/v1/dashboard/recent-activities`,
  UPCOMING_APPOINTMENTS: `/api/v1/dashboard/upcoming-appointments`,
  CHART_DATA: `/api/v1/dashboard/chart-data`,
  WIDGETS: (dashboardId: string) => `/api/v1/dashboard/${dashboardId}/widgets`,
  REFRESH: `/api/v1/dashboard/refresh-cache`,
} as const;

// ==========================================
// ANALYTICS & REPORTING
// ==========================================
export const ANALYTICS_ENDPOINTS = {
  METRICS: `/api/v1/analytics/metrics`,
  DASHBOARD: `/api/v1/analytics/dashboard`,
  DASHBOARD_WIDGETS: (dashboardId: string) => `/api/v1/analytics/dashboard/${dashboardId}/widgets`,
  REPORTS: `/api/v1/analytics/reports`,
  CHART_DATA: `/api/v1/analytics/chart-data`,
  HEALTH_METRICS: `/api/v1/analytics/health-metrics`,
  MEDICATION_COMPLIANCE: `/api/v1/analytics/medication-compliance`,
  APPOINTMENT_METRICS: `/api/v1/analytics/appointment-metrics`,
  INCIDENT_ANALYTICS: `/api/v1/analytics/incident-analytics`,
  CUSTOM_REPORT: `/api/v1/analytics/custom-report`,
} as const;

export const REPORTS_ENDPOINTS = {
  // Base Reports
  BASE: `/api/v1/reports`,
  CUSTOM: `/api/v1/reports/custom`,
  TEMPLATES: `/api/v1/reports/templates`,
  SCHEDULED: `/api/v1/reports/scheduled`,
  SCHEDULE: `/api/v1/reports/schedule`,
  EXPORT: `/api/v1/reports/export`,
  HISTORY: `/api/v1/reports/history`,
  SHARE: (reportId: string) => `/api/v1/reports/${reportId}/share`,

  // Health Trend Analysis
  HEALTH_TRENDS: `/api/v1/reports/health-trends`,
  HEALTH_TRENDS_BY_CATEGORY: (category: string) => `/api/v1/reports/health-trends/${category}`,

  // Medication Reports
  MEDICATIONS: {
    ADMINISTRATION: `/api/v1/reports/medications/administration`,
    COMPLIANCE: `/api/v1/reports/medications/compliance`,
    EXPIRATION: `/api/v1/reports/medications/expiration`,
    INVENTORY: `/api/v1/reports/medications/inventory`,
    REFILLS: `/api/v1/reports/medications/refills`,
    USAGE: `/api/v1/reports/medication-usage`,
    EFFECTIVENESS: `/api/v1/reports/medication-effectiveness`,
  },

  // Immunization Reports
  IMMUNIZATIONS: {
    COMPLIANCE: `/api/v1/reports/immunizations/compliance`,
    DUE: `/api/v1/reports/immunizations/due`,
    OVERDUE: `/api/v1/reports/immunizations/overdue`,
    EXEMPTIONS: `/api/v1/reports/immunizations/exemptions`,
  },

  // Appointment Reports
  APPOINTMENTS: {
    ATTENDANCE: `/api/v1/reports/appointments/attendance`,
    NO_SHOWS: `/api/v1/reports/appointments/no-shows`,
    CANCELLATIONS: `/api/v1/reports/appointments/cancellations`,
  },

  // Incident Reports
  INCIDENTS: {
    SUMMARY: `/api/v1/reports/incidents/summary`,
    BY_TYPE: `/api/v1/reports/incidents/by-type`,
    TRENDS: `/api/v1/reports/incidents/trends`,
    STATISTICS: `/api/v1/reports/incident-statistics`,
    BY_LOCATION: `/api/v1/reports/incidents-by-location`,
  },

  // Student Reports
  STUDENTS: {
    ENROLLMENT: `/api/v1/reports/students/enrollment`,
    HEALTH_SUMMARY: `/api/v1/reports/students/health-summary`,
    DEMOGRAPHICS: `/api/v1/reports/students/demographics`,
  },

  // Attendance & Performance
  ATTENDANCE_CORRELATION: `/api/v1/reports/attendance-correlation`,
  ABSENTEEISM_PATTERNS: `/api/v1/reports/absenteeism-patterns`,
  PERFORMANCE_METRICS: `/api/v1/reports/performance-metrics`,
  NURSE_PERFORMANCE: `/api/v1/reports/nurse-performance`,
  SYSTEM_USAGE: `/api/v1/reports/system-usage`,
  USAGE_ANALYTICS: `/api/v1/reports/analytics/usage`,
  POPULARITY: `/api/v1/reports/analytics/popularity`,
  INSIGHTS: `/api/v1/reports/analytics/insights`,

  // Compliance Reports
  COMPLIANCE: `/api/v1/reports/compliance`,
  COMPLIANCE_HISTORY: `/api/v1/reports/compliance/history`,
  COMPLIANCE_AUDIT: `/api/v1/reports/compliance/audit`,
} as const;

// ==========================================
// SYSTEM & ADMINISTRATION
// ==========================================
export const SYSTEM_ENDPOINTS = {
  HEALTH: `/api/v1/health`,
  STATUS: `/api/v1/system/status`,
  CONFIGURATION: `/api/v1/system/configuration`,
  SETTINGS: `/api/v1/system/settings`,
  BACKUP: `/api/v1/system/backup`,
  RESTORE: `/api/v1/system/restore`,
} as const;

export const ADMIN_ENDPOINTS = {
  // System Settings
  SETTINGS: `/api/v1/administration/settings`,

  // Users
  USERS: `/api/v1/users`,
  USER_BY_ID: (id: string) => `/api/v1/users/${id}`,

  // Districts
  DISTRICTS: `/api/v1/administration/districts`,
  DISTRICT_BY_ID: (id: string) => `/api/v1/administration/districts/${id}`,

  // Schools
  SCHOOLS: `/api/v1/administration/schools`,
  SCHOOL_BY_ID: (id: string) => `/api/v1/administration/schools/${id}`,

  // System Health
  SYSTEM_HEALTH: `/api/v1/admin/system/health`,

  // Backups
  BACKUPS: `/api/v1/administration/backups`,
  BACKUP_BY_ID: (id: string) => `/api/v1/administration/backups/${id}`,

  // Licenses
  LICENSES: `/api/v1/administration/licenses`,
  LICENSE_BY_ID: (id: string) => `/api/v1/administration/licenses/${id}`,
  LICENSE_DEACTIVATE: (id: string) => `/api/v1/administration/licenses/${id}/deactivate`,

  // Configurations
  CONFIGURATIONS: `/api/v1/administration/config`,
  CONFIGURATION_BY_KEY: (key: string) => `/api/v1/administration/config/${key}`,

  // Performance Metrics
  METRICS: `/api/v1/admin/metrics`,
  METRIC_BY_ID: (id: string) => `/api/v1/admin/metrics/${id}`,

  // Training
  TRAINING: `/api/v1/admin/training`,
  TRAINING_BY_ID: (id: string) => `/api/v1/admin/training/${id}`,
  TRAINING_COMPLETE: (id: string) => `/api/v1/admin/training/${id}/complete`,
  TRAINING_PROGRESS: (userId: string) => `/api/v1/admin/training/progress/${userId}`,

  // Audit Logs
  AUDIT_LOGS: `/api/v1/administration/audit-logs`,
  AUDIT_LOG_BY_ID: (id: string) => `/api/v1/administration/audit-logs/${id}`,
} as const;

export const INTEGRATIONS_ENDPOINTS = {
  BASE: `/api/v1/integrations`,
  BY_ID: (id: string) => `/api/v1/integrations/${id}`,
  CONFIGURE: (id: string) => `/api/v1/integrations/${id}/configure`,
  TEST: (id: string) => `/api/v1/integrations/${id}/test`,
  SYNC: (id: string) => `/api/v1/integrations/${id}/sync`,
  ENABLE: (id: string) => `/api/v1/integrations/${id}/enable`,
  DISABLE: (id: string) => `/api/v1/integrations/${id}/disable`,
  LOGS: (id: string) => `/api/v1/integrations/${id}/logs`,
} as const;

// ==========================================
// COMPLIANCE & AUDIT
// ==========================================
export const COMPLIANCE_ENDPOINTS = {
  REPORTS: `/api/v1/compliance/reports`,
  AUDIT_LOGS: `/api/v1/compliance/audit-logs`,
  PHI_DISCLOSURES: `/api/v1/compliance/phi-disclosures`,
  ACCESS_LOG: `/api/v1/compliance/access-log`,
  DATA_RETENTION: `/api/v1/compliance/data-retention`,
  EXPORT: `/api/v1/compliance/export`,
} as const;

export const AUDIT_ENDPOINTS = {
  LOGS: `/api/v1/audit-logs`,
  BY_ID: (id: string) => `/api/v1/audit-logs/${id}`,
  BY_USER: (userId: string) => `/api/v1/audit-logs/user/${userId}`,
  BY_RESOURCE: (resourceType: string, resourceId: string) =>
    `/api/v1/audit-logs/resource/${resourceType}/${resourceId}`,
  BY_ACTION: (action: string) => `/api/v1/audit-logs/action/${action}`,
  PHI_ACCESS: `/api/v1/audit-logs/phi-access`,
  PHI_ACCESS_LOG: `/api/v1/audit/phi-access`,
  EXPORT: `/api/v1/audit-logs/export`,
} as const;

// ==========================================
// BILLING & FINANCIAL MANAGEMENT
// ==========================================
export const BILLING_ENDPOINTS = {
  // Invoices
  INVOICES: `/api/v1/billing/invoices`,
  INVOICE_BY_ID: (id: string) => `/api/v1/billing/invoices/${id}`,
  INVOICE_PDF: (id: string) => `/api/v1/billing/invoices/${id}/pdf`,
  INVOICE_SEND: (id: string) => `/api/v1/billing/invoices/${id}/send`,
  INVOICE_VOID: (id: string) => `/api/v1/billing/invoices/${id}/void`,
  
  // Payments
  PAYMENTS: `/api/v1/billing/payments`,
  PAYMENT_BY_ID: (id: string) => `/api/v1/billing/payments/${id}`,
  PAYMENT_REFUND: (id: string) => `/api/v1/billing/payments/${id}/refund`,
  PAYMENT_VOID: (id: string) => `/api/v1/billing/payments/${id}/void`,
  
  // Analytics
  ANALYTICS: `/api/v1/billing/analytics`,
  REVENUE_TRENDS: `/api/v1/billing/analytics/revenue-trends`,
  PAYMENT_ANALYTICS: `/api/v1/billing/analytics/payments`,
  COLLECTION_METRICS: `/api/v1/billing/analytics/collections`,
  
  // Reports
  REPORTS: `/api/v1/billing/reports`,
  AGING_REPORT: `/api/v1/billing/reports/aging`,
  REVENUE_REPORT: `/api/v1/billing/reports/revenue`,
  PAYMENT_REPORT: `/api/v1/billing/reports/payments`,
  TAX_REPORT: `/api/v1/billing/reports/tax`,
  
  // Settings
  SETTINGS: `/api/v1/billing/settings`,
  
  // Notifications
  NOTIFICATIONS: `/api/v1/billing/notifications`,
  SEND_REMINDER: `/api/v1/billing/notifications/reminder`,
  SEND_STATEMENT: `/api/v1/billing/notifications/statement`,
} as const;

// ==========================================
// BUDGET MANAGEMENT
// ==========================================
export const BUDGET_ENDPOINTS = {
  // Budget Categories
  CATEGORIES: `/api/v1/budget/categories`,
  CATEGORY_BY_ID: (id: string) => `/api/v1/budget/categories/${id}`,

  // Budget Summary
  SUMMARY: `/api/v1/budget/summary`,

  // Budget Transactions
  TRANSACTIONS: `/api/v1/budget/transactions`,
  TRANSACTION_BY_ID: (id: string) => `/api/v1/budget/transactions/${id}`,

  // Analytics & Reporting
  TRENDS: `/api/v1/budget/trends`,
  YEAR_COMPARISON: `/api/v1/budget/year-comparison`,
  OVER_BUDGET: `/api/v1/budget/over-budget`,
  RECOMMENDATIONS: `/api/v1/budget/recommendations`,
  EXPORT: `/api/v1/budget/export`,
} as const;

// ==========================================
// PURCHASE ORDERS & PROCUREMENT
// ==========================================
export const PURCHASE_ORDERS_ENDPOINTS = {
  BASE: `/api/v1/purchase-orders`,
  BY_ID: (id: string) => `/api/v1/purchase-orders/${id}`,
  APPROVE: (id: string) => `/api/v1/purchase-orders/${id}/approve`,
  REJECT: (id: string) => `/api/v1/purchase-orders/${id}/reject`,
  RECEIVE: (id: string) => `/api/v1/purchase-orders/${id}/receive`,
  RECEIVE_ITEMS: (id: string) => `/api/v1/purchase-orders/${id}/receive-items`,
  CANCEL: (id: string) => `/api/v1/purchase-orders/${id}/cancel`,
  STATISTICS: `/api/v1/purchase-orders/statistics`,
  PENDING: `/api/v1/purchase-orders/pending`,
  APPROVED: `/api/v1/purchase-orders/approved`,
  RECEIVED: `/api/v1/purchase-orders/received`,
  BY_VENDOR: (vendorId: string) => `/api/v1/purchase-orders/vendor/${vendorId}`,
  REORDER_ITEMS: `/api/v1/purchase-orders/reorder-items`,
  VENDOR_HISTORY: (vendorId: string) => `/api/v1/purchase-orders/vendor/${vendorId}/history`,
} as const;

// ==========================================
// VENDORS
// ==========================================
export const VENDORS_ENDPOINTS = {
  BASE: `/api/v1/vendors`,
  BY_ID: (id: string) => `/api/v1/vendors/${id}`,
  SEARCH: (query: string) => `/api/v1/vendors/search/${encodeURIComponent(query)}`,
  COMPARE: (itemName: string) => `/api/v1/vendors/compare/${encodeURIComponent(itemName)}`,
  TOP: `/api/v1/vendors/top`,
  STATISTICS: `/api/v1/vendors/statistics`,
  REACTIVATE: (id: string) => `/api/v1/vendors/${id}/reactivate`,
  RATING: (id: string) => `/api/v1/vendors/${id}/rating`,
  BULK_RATINGS: `/api/v1/vendors/ratings/bulk`,
  BY_PAYMENT_TERMS: (terms: string) => `/api/v1/vendors/payment-terms/${encodeURIComponent(terms)}`,
  METRICS: (id: string) => `/api/v1/vendors/${id}/metrics`,
  PERMANENT_DELETE: (id: string) => `/api/v1/vendors/${id}/permanent`,
} as const;

// ==========================================
// FORMS & SETTINGS
// ==========================================
export const FORMS_ENDPOINTS = {
  BASE: `/api/v1/forms`,
  BY_ID: (id: string) => `/api/v1/forms/${id}`,
  TEMPLATES: `/api/v1/forms/templates`,
  SUBMIT: `/api/v1/forms/submit`,
  RESPONSES: (formId: string) => `/api/v1/forms/${formId}/responses`,
  SUBMISSIONS: (formId: string) => `/api/v1/forms/${formId}/submissions`,
  EXPORT: (formId: string) => `/api/v1/forms/${formId}/export`,
} as const;

export const SETTINGS_ENDPOINTS = {
  USER: `/api/v1/settings/user`,
  SCHOOL: `/api/v1/settings/school`,
  NOTIFICATIONS: `/api/v1/settings/notifications`,
  PREFERENCES: `/api/v1/settings/preferences`,
  PRIVACY: `/api/v1/settings/privacy`,
  SECURITY: `/api/v1/settings/security`,
} as const;
