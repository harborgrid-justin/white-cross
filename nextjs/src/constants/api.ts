/**
 * @fileoverview API Endpoints Constants
 * @module constants/api
 *
 * Centralized API endpoint definitions for the application.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const API_ENDPOINTS = {
  // Medications endpoints
  MEDICATIONS: {
    BASE: `${API_BASE_URL}/medications`,
    DETAIL: (id: string) => `${API_BASE_URL}/medications/${id}`,
    ADMINISTER: (id: string) => `${API_BASE_URL}/medications/${id}/administer`,
    INTERACTIONS: (id: string) => `${API_BASE_URL}/medications/${id}/interactions`,
    CALENDAR: `${API_BASE_URL}/medications/calendar`,
    SCHEDULE: `${API_BASE_URL}/medications/schedule`,
    DUE: `${API_BASE_URL}/medications/due`,
    OVERDUE: `${API_BASE_URL}/medications/overdue`,
    MISSED: `${API_BASE_URL}/medications/missed`,
    COMPLETED: `${API_BASE_URL}/medications/completed`,
    AS_NEEDED: `${API_BASE_URL}/medications/as-needed`,
    EMERGENCY: `${API_BASE_URL}/medications/emergency`,
    CONTROLLED: `${API_BASE_URL}/medications/controlled-substances`,
    OTC: `${API_BASE_URL}/medications/over-the-counter`,
    CATEGORIES: `${API_BASE_URL}/medications/categories`,
    RULES: `${API_BASE_URL}/medications/administration-rules`,
  },

  // Prescriptions endpoints
  PRESCRIPTIONS: {
    BASE: `${API_BASE_URL}/prescriptions`,
    DETAIL: (id: string) => `${API_BASE_URL}/prescriptions/${id}`,
    REFILL: (id: string) => `${API_BASE_URL}/prescriptions/${id}/refill`,
  },

  // Inventory endpoints
  INVENTORY: {
    BASE: `${API_BASE_URL}/inventory`,
    DETAIL: (id: string) => `${API_BASE_URL}/inventory/${id}`,
    ADJUST: (id: string) => `${API_BASE_URL}/inventory/${id}/adjust`,
    LOW_STOCK: `${API_BASE_URL}/inventory/low-stock`,
    EXPIRING: `${API_BASE_URL}/inventory/expiring`,
  },

  // Immunizations endpoints
  IMMUNIZATIONS: {
    BASE: `${API_BASE_URL}/immunizations`,
    DETAIL: (id: string) => `${API_BASE_URL}/immunizations/${id}`,
    SCHEDULE: `${API_BASE_URL}/immunizations/schedule`,
    BY_STUDENT: (studentId: string) => `${API_BASE_URL}/students/${studentId}/immunizations`,
  },

  // Reports endpoints
  REPORTS: {
    MEDICATIONS: {
      ADMINISTRATION: `${API_BASE_URL}/reports/medications/administration`,
      COMPLIANCE: `${API_BASE_URL}/reports/medications/compliance`,
      EXPIRATION: `${API_BASE_URL}/reports/medications/expiration`,
      INVENTORY: `${API_BASE_URL}/reports/medications/inventory`,
      REFILLS: `${API_BASE_URL}/reports/medications/refills`,
    }
  },

  // Administration log endpoints
  ADMINISTRATION_LOG: {
    BASE: `${API_BASE_URL}/administration-log`,
    BY_MEDICATION: (medicationId: string) => `${API_BASE_URL}/medications/${medicationId}/administration-log`,
    DETAIL: (id: string) => `${API_BASE_URL}/administration-log/${id}`,
  },

  // Students endpoints (for cross-reference)
  STUDENTS: {
    BASE: `${API_BASE_URL}/students`,
    DETAIL: (id: string) => `${API_BASE_URL}/students/${id}`,
    MEDICATIONS: (id: string) => `${API_BASE_URL}/students/${id}/medications`,
  }
} as const;

export default API_ENDPOINTS;
