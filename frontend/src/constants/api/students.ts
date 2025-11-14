/**
 * @fileoverview Students API Endpoints
 * @module constants/api/students
 * @category API - Students
 * 
 * Student management, health records, and related endpoint definitions.
 */

// ==========================================
// STUDENTS
// ==========================================
export const STUDENTS_ENDPOINTS = {
  BASE: `/api/v1/students`,
  BY_ID: (id: string) => `/api/v1/students/${id}`,
  DEACTIVATE: (id: string) => `/api/v1/students/${id}/deactivate`,
  REACTIVATE: (id: string) => `/api/v1/students/${id}/reactivate`,
  TRANSFER: (id: string) => `/api/v1/students/${id}/transfer`,
  ASSIGN: (id: string) => `/api/v1/students/${id}/assign`,
  ASSIGN_BULK: `/api/v1/students/assign-bulk`,
  PHOTO: (id: string) => `/api/v1/students/${id}/photo`,
  EXPORT: (id: string) => `/api/v1/students/${id}/export`,
  REPORT_CARD: (id: string) => `/api/v1/students/${id}/report-card`,
  VERIFY_ELIGIBILITY: (id: string) => `/api/v1/students/${id}/verify-eligibility`,
  SEARCH: `/api/v1/students/search`,
  SEARCH_BY_QUERY: (query: string) => `/api/v1/students/search/${encodeURIComponent(query)}`,
  BY_GRADE: (grade: string) => `/api/v1/students/grade/${grade}`,
  BY_NURSE: (nurseId: string) => `/api/v1/students/nurse/${nurseId}`,
  ASSIGNED: `/api/v1/students/assigned`,
  STATISTICS: (id: string) => `/api/v1/students/${id}/statistics`,
  BULK_UPDATE: `/api/v1/students/bulk-update`,
  PERMANENT_DELETE: (id: string) => `/api/v1/students/${id}/permanent`,
  GRADES: `/api/v1/students/grades`,
  HEALTH_RECORDS: (id: string) => `/api/v1/students/${id}/health-records`,
  MENTAL_HEALTH_RECORDS: (id: string) => `/api/v1/students/${id}/mental-health-records`,
  MEDICATIONS: (id: string) => `/api/v1/students/${id}/medications`,
  IMMUNIZATIONS: (id: string) => `/api/v1/students/${id}/immunizations`,
  ALLERGIES: (id: string) => `/api/v1/students/${id}/allergies`,
  APPOINTMENTS: (id: string) => `/api/v1/students/${id}/appointments`,
  INCIDENTS: (id: string) => `/api/v1/students/${id}/incidents`,
  EMERGENCY_CONTACTS: (id: string) => `/api/v1/students/${id}/emergency-contacts`,
} as const;

// ==========================================
// APPOINTMENTS
// ==========================================
export const APPOINTMENTS_ENDPOINTS = {
  BASE: `/api/v1/appointments`,
  BY_ID: (id: string) => `/api/v1/appointments/${id}`,
  RESCHEDULE: (id: string) => `/api/v1/appointments/${id}/reschedule`,
  CANCEL: (id: string) => `/api/v1/appointments/${id}/cancel`,
  COMPLETE: (id: string) => `/api/v1/appointments/${id}/complete`,
  NO_SHOW: (id: string) => `/api/v1/appointments/${id}/no-show`,
  CONFIRM: (id: string) => `/api/v1/appointments/${id}/confirm`,
  START: (id: string) => `/api/v1/appointments/${id}/start`,
  SEND_REMINDER: (id: string) => `/api/v1/appointments/${id}/send-reminder`,
  AVAILABILITY: `/api/v1/appointments/availability`,
  CONFLICTS: `/api/v1/appointments/conflicts`,
  CHECK_CONFLICTS: `/api/v1/appointments/check-conflicts`,
  REMINDERS: `/api/v1/appointments/reminders`,
  PROCESS_REMINDERS: `/api/v1/appointments/process-reminders`,
  BY_STUDENT: (studentId: string) => `/api/v1/appointments/student/${studentId}`,
  BY_NURSE: (nurseId: string) => `/api/v1/appointments/nurse/${nurseId}`,
  BY_DATE: `/api/v1/appointments/by-date`,
  UPCOMING: `/api/v1/appointments/upcoming`,
  STATISTICS: `/api/v1/appointments/statistics`,
  RECURRING: `/api/v1/appointments/recurring`,
  CREATE_RECURRING: `/api/v1/appointments/recurring/create`,
  EXPORT_CALENDAR: `/api/v1/appointments/export/calendar`,
  REPORTS: `/api/v1/appointments/reports`,
} as const;

// ==========================================
// APPOINTMENT WAITLIST
// ==========================================
export const WAITLIST_ENDPOINTS = {
  BASE: `/api/v1/waitlist`,
  BY_ID: (id: string) => `/api/v1/waitlist/${id}`,
  ADD: `/api/v1/waitlist/add`,
  REMOVE: (id: string) => `/api/v1/waitlist/${id}/remove`,
  POSITION: (id: string) => `/api/v1/waitlist/${id}/position`,
  NOTIFY: (id: string) => `/api/v1/waitlist/${id}/notify`,
  UPDATE_PRIORITY: (id: string) => `/api/v1/waitlist/${id}/priority`,
  BY_STUDENT: (studentId: string) => `/api/v1/waitlist/student/${studentId}`,
  BY_NURSE: (nurseId: string) => `/api/v1/waitlist/nurse/${nurseId}`,
} as const;

// ==========================================
// NURSE AVAILABILITY & SCHEDULING
// ==========================================
export const NURSE_AVAILABILITY_ENDPOINTS = {
  BASE: `/api/v1/nurse-availability`,
  BY_ID: (id: string) => `/api/v1/nurse-availability/${id}`,
  BY_NURSE: (nurseId: string) => `/api/v1/nurse-availability/nurse/${nurseId}`,
  SLOTS: `/api/v1/nurse-availability/slots`,
  SET: `/api/v1/nurse-availability/set`,
  UPDATE: (id: string) => `/api/v1/nurse-availability/${id}`,
  DELETE: (id: string) => `/api/v1/nurse-availability/${id}`,
  BY_DATE: (date: string) => `/api/v1/nurse-availability/date/${date}`,
  CHECK_CONFLICTS: `/api/v1/nurse-availability/check-conflicts`,
} as const;

// ==========================================
// EMERGENCY CONTACTS
// ==========================================
export const EMERGENCY_CONTACTS_ENDPOINTS = {
  BASE: `/api/v1/emergency-contacts`,
  BY_ID: (id: string) => `/api/v1/emergency-contacts/${id}`,
  BY_STUDENT: (studentId: string) => `/api/v1/students/${studentId}/emergency-contacts`,
  PRIMARY: (studentId: string) => `/api/v1/students/${studentId}/emergency-contacts/primary`,
  VERIFY: (id: string) => `/api/v1/emergency-contacts/${id}/verify`,
  NOTIFY: (id: string) => `/api/v1/emergency-contacts/${id}/notify`,
} as const;
