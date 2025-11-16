/**
 * @fileoverview Health & Medical API Endpoints
 * @module constants/api/health
 * @category API - Health Records
 * 
 * Health records, medications, immunizations, and medical data endpoint definitions.
 */

// ==========================================
// HEALTH RECORDS
// ==========================================
export const HEALTH_RECORDS_ENDPOINTS = {
  BASE: `/api/v1/health-records`,
  BY_ID: (id: string) => `/api/v1/health-records/${id}`,
  BY_STUDENT: (studentId: string) => `/api/v1/students/${studentId}/health-records`,
  BY_TYPE: (type: string) => `/api/v1/health-records/type/${type}`,
  SEARCH: `/api/v1/health-records/search`,
  EXPORT: (id: string) => `/api/v1/health-records/${id}/export`,
} as const;

// ==========================================
// IMMUNIZATIONS / VACCINATIONS
// ==========================================
export const IMMUNIZATIONS_ENDPOINTS = {
  BASE: `/api/v1/vaccinations`,
  BY_ID: (id: string) => `/api/v1/vaccinations/${id}`,
  SCHEDULE: `/api/v1/vaccinations/schedule`,
  BY_STUDENT: (studentId: string) => `/api/v1/students/${studentId}/immunizations`,
  DUE: `/api/v1/vaccinations/due`,
  OVERDUE: `/api/v1/vaccinations/overdue`,
  COMPLIANCE: `/api/v1/vaccinations/compliance`,
  EXEMPTIONS: `/api/v1/vaccinations/exemptions`,
  VERIFY: (id: string) => `/api/v1/vaccinations/${id}/verify`,
  EXPORT: (studentId: string) => `/api/v1/vaccinations/export/${studentId}`,
} as const;

// ==========================================
// HEALTH SCREENINGS
// ==========================================
export const SCREENINGS_ENDPOINTS = {
  BASE: `/api/v1/screenings`,
  BY_ID: (id: string) => `/api/v1/screenings/${id}`,
  BY_STUDENT: (studentId: string) => `/api/v1/students/${studentId}/screenings`,
  BY_TYPE: (type: string) => `/api/v1/screenings/type/${type}`,
  DUE: `/api/v1/screenings/due`,
  SCHEDULE: `/api/v1/screenings/schedule`,
  RESULTS: (id: string) => `/api/v1/screenings/${id}/results`,
} as const;

// ==========================================
// GROWTH MEASUREMENTS
// ==========================================
export const GROWTH_MEASUREMENTS_ENDPOINTS = {
  BASE: `/api/v1/growth-measurements`,
  BY_ID: (id: string) => `/api/v1/growth-measurements/${id}`,
  BY_STUDENT: (studentId: string) => `/api/v1/students/${studentId}/growth-measurements`,
  TRENDS: (studentId: string) => `/api/v1/students/${studentId}/growth-measurements/trends`,
  BMI: (studentId: string) => `/api/v1/students/${studentId}/bmi`,
} as const;

// ==========================================
// ALLERGIES
// ==========================================
export const ALLERGIES_ENDPOINTS = {
  BASE: `/api/v1/allergies`,
  BY_ID: (id: string) => `/api/v1/allergies/${id}`,
  BY_STUDENT: (studentId: string) => `/api/v1/students/${studentId}/allergies`,
  CRITICAL: `/api/v1/allergies/critical`,
  ACTIVE: `/api/v1/allergies/active`,
} as const;

// ==========================================
// VITAL SIGNS
// ==========================================
export const VITAL_SIGNS_ENDPOINTS = {
  BASE: `/api/v1/vital-signs`,
  BY_ID: (id: string) => `/api/v1/vital-signs/${id}`,
  BY_STUDENT: (studentId: string) => `/api/v1/students/${studentId}/vital-signs`,
  BY_HEALTH_RECORD: (healthRecordId: string) => `/api/v1/health-records/${healthRecordId}/vital-signs`,
  LATEST: (studentId: string) => `/api/v1/students/${studentId}/vital-signs/latest`,
  TRENDS: (studentId: string) => `/api/v1/students/${studentId}/vital-signs/trends`,
} as const;

// ==========================================
// CHRONIC CONDITIONS
// ==========================================
export const CHRONIC_CONDITIONS_ENDPOINTS = {
  BASE: `/api/v1/chronic-conditions`,
  BY_ID: (id: string) => `/api/v1/chronic-conditions/${id}`,
  BY_STUDENT: (studentId: string) => `/api/v1/students/${studentId}/chronic-conditions`,
  ACTIVE: `/api/v1/chronic-conditions/active`,
  REVIEW_DUE: `/api/v1/chronic-conditions/review-due`,
} as const;

// ==========================================
// MEDICATIONS
// ==========================================
export const MEDICATIONS_ENDPOINTS = {
  BASE: `/api/v1/medications`,
  BY_ID: (id: string) => `/api/v1/medications/${id}`,
  DETAIL: (id: string) => `/api/v1/medications/${id}`,
  STATS: `/api/v1/medications/stats`,
  ADMINISTER: (id: string) => `/api/v1/medications/${id}/administer`,
  DISCONTINUE: (id: string) => `/api/v1/medications/${id}/discontinue`,
  REFILL: (id: string) => `/api/v1/medications/${id}/refill`,
  MISSED_DOSE: (id: string) => `/api/v1/medications/${id}/missed-dose`,
  ADVERSE_REACTION: (id: string) => `/api/v1/medications/${id}/adverse-reaction`,
  ADJUST_INVENTORY: (id: string) => `/api/v1/medications/${id}/adjust-inventory`,
  REMINDER: (id: string) => `/api/v1/medications/${id}/reminder`,
  SCHEDULE: (id: string) => `/api/v1/medications/${id}/schedule`,
  INTERACTIONS: (id: string) => `/api/v1/medications/${id}/interactions`,
  CALENDAR: `/api/v1/medications/calendar`,
  DUE: `/api/v1/medications/due`,
  OVERDUE: `/api/v1/medications/overdue`,
  MISSED: `/api/v1/medications/missed`,
  COMPLETED: `/api/v1/medications/completed`,
  AS_NEEDED: `/api/v1/medications/as-needed`,
  EMERGENCY: `/api/v1/medications/emergency`,
  CONTROLLED: `/api/v1/medications/controlled-substances`,
  OTC: `/api/v1/medications/over-the-counter`,
  CATEGORIES: `/api/v1/medications/categories`,
  RULES: `/api/v1/medications/administration-rules`,
  CHECK_INTERACTIONS: `/api/v1/medications/check-interactions`,
  FORMULARY: `/api/v1/medications/formulary`,
  BY_STUDENT: (studentId: string) => `/api/v1/students/${studentId}/medications`,
} as const;

// ==========================================
// PRESCRIPTIONS
// ==========================================
export const PRESCRIPTIONS_ENDPOINTS = {
  BASE: `/api/v1/prescriptions`,
  BY_ID: (id: string) => `/api/v1/prescriptions/${id}`,
  DETAIL: (id: string) => `/api/v1/prescriptions/${id}`,
  REFILL: (id: string) => `/api/v1/prescriptions/${id}/refill`,
  ACTIVE: `/api/v1/prescriptions/active`,
  EXPIRING: `/api/v1/prescriptions/expiring`,
} as const;

// ==========================================
// INVENTORY
// ==========================================
export const INVENTORY_ENDPOINTS = {
  BASE: `/api/v1/inventory`,
  BY_ID: (id: string) => `/api/v1/inventory/${id}`,
  DETAIL: (id: string) => `/api/v1/inventory/${id}`,
  ADJUST: (id: string) => `/api/v1/inventory/${id}/adjust`,
  LOW_STOCK: `/api/v1/inventory/low-stock`,
  EXPIRING: `/api/v1/inventory/expiring`,
  REORDER: `/api/v1/inventory/reorder`,
  AUDIT: `/api/v1/inventory/audit`,
  ITEMS: `/api/v1/inventory/items`,
  ALERTS: `/api/v1/inventory/alerts`,
  ANALYTICS: `/api/v1/inventory/analytics`,
  DASHBOARD: `/api/v1/inventory/dashboard`,
  REPORTS: `/api/v1/inventory/reports`,
} as const;

// ==========================================
// ADMINISTRATION LOG
// ==========================================
export const ADMINISTRATION_LOG_ENDPOINTS = {
  BASE: `/api/v1/administration-log`,
  BY_ID: (id: string) => `/api/v1/administration-log/${id}`,
  DETAIL: (id: string) => `/api/v1/administration-log/${id}`,
  BY_MEDICATION: (medicationId: string) => `/api/v1/medications/${medicationId}/administration-log`,
  BY_STUDENT: (studentId: string) => `/api/v1/students/${studentId}/administration-log`,
  TODAY: `/api/v1/administration-log/today`,
  MISSED: `/api/v1/administration-log/missed`,
} as const;

// ==========================================
// INCIDENTS
// ==========================================
export const INCIDENTS_ENDPOINTS = {
  BASE: `/api/v1/incident-report`,
  BY_ID: (id: string) => `/api/v1/incident-report/${id}`,
  WITNESSES: (incidentId: string) => `/api/v1/incident-report/${incidentId}/witnesses`,
  WITNESS_STATEMENT: (incidentId: string, witnessId: string) =>
    `/api/v1/incident-report/${incidentId}/witnesses/${witnessId}/statement`,
  VERIFY_STATEMENT: (statementId: string) => `/api/v1/incident-report/statements/${statementId}/verify`,
  FOLLOW_UP: (incidentId: string) => `/api/v1/incident-report/${incidentId}/follow-up`,
  FOLLOW_UP_PROGRESS: (followUpId: string) => `/api/v1/incident-report/follow-up/${followUpId}/progress`,
  FOLLOW_UP_COMPLETE: (followUpId: string) => `/api/v1/incident-report/follow-up/${followUpId}/complete`,
  ANALYTICS: `/api/v1/incident-report/analytics`,
  TRENDING: `/api/v1/incident-report/trending`,
  BY_STUDENT: (studentId: string) => `/api/v1/students/${studentId}/incidents`,
  BY_TYPE: (type: string) => `/api/v1/incident-report/type/${type}`,
  BY_SEVERITY: (severity: string) => `/api/v1/incident-report/severity/${severity}`,
} as const;
