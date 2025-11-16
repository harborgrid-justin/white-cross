/**
 * @fileoverview Medication Caching Functions
 * @module app/medications/cache
 *
 * HIPAA-compliant cached data fetching for medications.
 * All functions use React cache() for automatic memoization.
 */

'use server';

import { cache } from 'react';
import { serverGet } from '@/lib/api/server';
import { API_ENDPOINTS, ADMINISTRATION_LOG_ENDPOINTS } from '@/constants/api';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache/constants';
import type { ApiResponse } from '@/types/core/api';
import type { Medication } from '@/types/domain/medications';
import type {
  MedicationFilters,
  MedicationLog,
  PaginatedMedicationsResponse,
  MedicationStats
} from './medications.types';

// ==========================================
// CACHED MEDICATION READS
// ==========================================

/**
 * Get medication by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getMedication = cache(async (id: string): Promise<Medication | null> => {
  try {
    const response = await serverGet<ApiResponse<Medication>>(
      API_ENDPOINTS.MEDICATIONS.BY_ID(id), // Use proper API endpoint constant
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`medication-${id}`, CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get medication:', error);
    return null;
  }
});

/**
 * Get all medications with caching
 * Uses shorter TTL for frequently updated data
 */
export const getMedications = cache(async (filters?: MedicationFilters): Promise<Medication[]> => {
  try {
    const response = await serverGet<ApiResponse<Medication[]>>(
      API_ENDPOINTS.MEDICATIONS.BASE,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [CACHE_TAGS.MEDICATIONS, 'medication-list', CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get medications:', error);
    return [];
  }
});

/**
 * Get medications for a specific student
 */
export const getStudentMedications = cache(async (studentId: string): Promise<Medication[]> => {
  try {
    const response = await serverGet<ApiResponse<Medication[]>>(
      API_ENDPOINTS.MEDICATIONS.BY_STUDENT(studentId),
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_FREQUENT, // More frequent updates for active medications
          tags: [`student-medications-${studentId}`, CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get student medications:', error);
    return [];
  }
});

/**
 * Get due medications (requiring administration)
 */
export const getDueMedications = cache(async (): Promise<Medication[]> => {
  try {
    const response = await serverGet<ApiResponse<Medication[]>>(
      API_ENDPOINTS.MEDICATIONS.DUE,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_FREQUENT, // Short TTL for time-sensitive data
          tags: ['due-medications', CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get due medications:', error);
    return [];
  }
});

/**
 * Get paginated medications
 */
export const getPaginatedMedications = cache(async (
  page: number = 1,
  limit: number = 20,
  filters?: MedicationFilters
): Promise<PaginatedMedicationsResponse | null> => {
  try {
    const params = {
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    };

    const response = await serverGet<ApiResponse<PaginatedMedicationsResponse>>(
      API_ENDPOINTS.MEDICATIONS.BASE,
      params as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [CACHE_TAGS.MEDICATIONS, 'medication-list', CACHE_TAGS.PHI]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get paginated medications:', error);
    return null;
  }
});

/**
 * Get medication administration history
 */
export const getMedicationHistory = cache(async (medicationId: string): Promise<MedicationLog[]> => {
  try {
    const response = await serverGet<ApiResponse<MedicationLog[]>>(
      `${API_ENDPOINTS.MEDICATIONS.BY_ID(medicationId)}/history`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`medication-history-${medicationId}`, CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get medication history:', error);
    return [];
  }
});

/**
 * Get medication statistics for dashboard metrics
 */
export const getMedicationStats = cache(async (): Promise<MedicationStats> => {
  try {
    const response = await serverGet<ApiResponse<MedicationStats>>(
      API_ENDPOINTS.MEDICATIONS.STATS, // Use proper API endpoint constant
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_FREQUENT, // Frequent updates for dashboard stats
          tags: ['medication-stats', CACHE_TAGS.MEDICATIONS]
        }
      }
    );

    return response.data || {
      totalMedications: 0,
      activePrescriptions: 0,
      administeredToday: 0,
      adverseReactions: 0,
      lowStockCount: 0,
      expiringCount: 0
    };
  } catch (error) {
    console.error('Failed to get medication stats:', error);
    return {
      totalMedications: 0,
      activePrescriptions: 0,
      administeredToday: 0,
      adverseReactions: 0,
      lowStockCount: 0,
      expiringCount: 0
    };
  }
});

/**
 * Get overdue medications
 */
export const getOverdueMedications = cache(async (): Promise<Medication[]> => {
  try {
    const response = await serverGet<ApiResponse<Medication[]>>(
      API_ENDPOINTS.MEDICATIONS.OVERDUE,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_FREQUENT,
          tags: ['overdue-medications', CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get overdue medications:', error);
    return [];
  }
});

/**
 * Get OTC medications
 */
export const getOTCMedications = cache(async (filters?: MedicationFilters): Promise<PaginatedMedicationsResponse | null> => {
  try {
    const params = {
      type: 'over_the_counter',
      ...filters
    };

    const response = await serverGet<ApiResponse<PaginatedMedicationsResponse>>(
      API_ENDPOINTS.MEDICATIONS.BASE,
      params as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: ['medications-otc', CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get OTC medications:', error);
    return null;
  }
});

/**
 * Get controlled substances
 */
export const getControlledSubstances = cache(async (filters?: MedicationFilters): Promise<PaginatedMedicationsResponse | null> => {
  try {
    const params = {
      type: 'controlled_substance',
      ...filters
    };

    const response = await serverGet<ApiResponse<PaginatedMedicationsResponse>>(
      API_ENDPOINTS.MEDICATIONS.BASE,
      params as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: ['medications-controlled', CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get controlled substances:', error);
    return null;
  }
});

/**
 * Get medication categories
 */
export const getCategories = cache(async (): Promise<{ categories: any[]; stats: any }> => {
  try {
    const response = await serverGet<ApiResponse<{ categories: any[]; stats: any }>>(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/categories`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATIC, // Categories change infrequently
          tags: ['medication-categories', CACHE_TAGS.MEDICATIONS]
        }
      }
    );

    return response.data || { categories: [], stats: {} };
  } catch (error) {
    console.error('Failed to get categories:', error);
    return { categories: [], stats: {} };
  }
});

/**
 * Get completed administrations
 */
export const getCompletedAdministrations = cache(async (params?: { date?: string; page?: string; limit?: string }): Promise<{ completed: any[]; stats: any; total: number }> => {
  try {
    const queryParams = {
      date: params?.date || new Date().toISOString().split('T')[0],
      page: params?.page || '1',
      limit: params?.limit || '50'
    };

    const response = await serverGet<ApiResponse<{ completed: any[]; stats: any; total: number }>>(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/completed`,
      queryParams as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_FREQUENT, // 3 min cache for recent data
          tags: ['completed-administrations', CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || { completed: [], stats: {}, total: 0 };
  } catch (error) {
    console.error('Failed to get completed administrations:', error);
    return { completed: [], stats: {}, total: 0 };
  }
});

/**
 * Get administration rules
 */
export const getAdministrationRules = cache(async (): Promise<{ rules: any[]; defaults: any }> => {
  try {
    const response = await serverGet<ApiResponse<{ rules: any[]; defaults: any }>>(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/administration-rules`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATIC, // Rules change infrequently
          tags: ['administration-rules', CACHE_TAGS.MEDICATIONS]
        }
      }
    );

    return response.data || { rules: [], defaults: {} };
  } catch (error) {
    console.error('Failed to get administration rules:', error);
    return { rules: [], defaults: {} };
  }
});

/**
 * Get administration schedule
 */
export const getAdministrationSchedule = cache(async (params?: { startDate?: string; endDate?: string; nurseId?: string }): Promise<any[]> => {
  try {
    const response = await serverGet<ApiResponse<any[]>>(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/schedule`,
      params as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_FREQUENT, // Schedule changes frequently
          tags: ['administration-schedule', CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get administration schedule:', error);
    return [];
  }
});

/**
 * Get prescriptions
 */
export const getPrescriptions = cache(async (filters?: MedicationFilters): Promise<PaginatedMedicationsResponse | null> => {
  try {
    const params = {
      type: 'prescription',
      ...filters
    };

    const response = await serverGet<ApiResponse<PaginatedMedicationsResponse>>(
      API_ENDPOINTS.MEDICATIONS.BASE,
      params as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: ['medications-prescriptions', CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get prescriptions:', error);
    return null;
  }
});

/**
 * Get prescription by ID
 */
export const getPrescription = cache(async (id: string): Promise<any | null> => {
  try {
    const response = await serverGet<ApiResponse<any>>(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/prescriptions/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`prescription-${id}`, CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get prescription:', error);
    return null;
  }
});

/**
 * Get prescription refill info
 */
export const getPrescriptionRefill = cache(async (id: string): Promise<any | null> => {
  try {
    const response = await serverGet<ApiResponse<any>>(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/prescriptions/${id}/refill`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`prescription-refill-${id}`, CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get prescription refill:', error);
    return null;
  }
});

/**
 * Get inventory reports
 */
export const getInventoryReports = cache(async (params?: any): Promise<any> => {
  try {
    const response = await serverGet<ApiResponse<any>>(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/reports/inventory`,
      params as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: ['inventory-reports', CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || { items: [], stats: {} };
  } catch (error) {
    console.error('Failed to get inventory reports:', error);
    return { items: [], stats: {} };
  }
});

/**
 * Get expiration reports
 */
export const getExpirationReports = cache(async (params?: any): Promise<any> => {
  try {
    const response = await serverGet<ApiResponse<any>>(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/reports/expiration`,
      params as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: ['expiration-reports', CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || { expiring: [], stats: {} };
  } catch (error) {
    console.error('Failed to get expiration reports:', error);
    return { expiring: [], stats: {} };
  }
});

/**
 * Get compliance reports
 */
export const getComplianceReports = cache(async (params?: any): Promise<any> => {
  try {
    const response = await serverGet<ApiResponse<any>>(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/reports/compliance`,
      params as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: ['compliance-reports', CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || { reports: [], stats: {} };
  } catch (error) {
    console.error('Failed to get compliance reports:', error);
    return { reports: [], stats: {} };
  }
});

/**
 * Get refill reports
 */
export const getRefillReports = cache(async (params?: any): Promise<any> => {
  try {
    const response = await serverGet<ApiResponse<any>>(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/reports/refills`,
      params as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: ['refill-reports', CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || { refills: [], stats: {} };
  } catch (error) {
    console.error('Failed to get refill reports:', error);
    return { refills: [], stats: {} };
  }
});

/**
 * Get administration reports
 */
export const getAdministrationReports = cache(async (params?: any): Promise<any> => {
  try {
    const response = await serverGet<ApiResponse<any>>(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/reports/administration`,
      params as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: ['administration-reports', CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || { administrations: [], stats: {} };
  } catch (error) {
    console.error('Failed to get administration reports:', error);
    return { administrations: [], stats: {} };
  }
});

/**
 * Get low stock inventory
 */
export const getLowStockInventory = cache(async (): Promise<any> => {
  try {
    const response = await serverGet<ApiResponse<any>>(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/inventory/low-stock`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_FREQUENT, // Low stock changes frequently
          tags: ['low-stock-inventory', CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || { items: [], total: 0 };
  } catch (error) {
    console.error('Failed to get low stock inventory:', error);
    return { items: [], total: 0 };
  }
});

/**
 * Get expiring inventory
 */
export const getExpiringInventory = cache(async (params?: any): Promise<any> => {
  try {
    const response = await serverGet<ApiResponse<any>>(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/inventory/expiring`,
      params as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_FREQUENT, // Expiration dates change
          tags: ['expiring-inventory', CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || { items: [], total: 0 };
  } catch (error) {
    console.error('Failed to get expiring inventory:', error);
    return { items: [], total: 0 };
  }
});

/**
 * Get inventory item by ID
 */
export const getInventoryItem = cache(async (id: string): Promise<any | null> => {
  try {
    const response = await serverGet<ApiResponse<any>>(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/inventory/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`inventory-item-${id}`, CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get inventory item:', error);
    return null;
  }
});

/**
 * Get missed doses
 */
export const getMissedDoses = cache(async (params?: any): Promise<any> => {
  try {
    const response = await serverGet<ApiResponse<any>>(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/missed-doses`,
      params as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_FREQUENT, // Missed doses change frequently
          tags: ['missed-doses', CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || { missedDoses: [], stats: {}, total: 0 };
  } catch (error) {
    console.error('Failed to get missed doses:', error);
    return { missedDoses: [], stats: {}, total: 0 };
  }
});

/**
 * Get medication settings
 */
export const getMedicationSettings = cache(async (): Promise<any> => {
  try {
    const response = await serverGet<ApiResponse<any>>(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/settings`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: ['medication-settings', CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || { settings: {}, defaults: {} };
  } catch (error) {
    console.error('Failed to get medication settings:', error);
    return { settings: {}, defaults: {} };
  }
});

/**
 * Get emergency medications
 */
export const getEmergencyMedications = cache(async (): Promise<any> => {
  try {
    const medications = await getMedications({ type: 'emergency' });
    
    // For emergency medications, we need to check for expiration alerts
    // This is a simplified version - in a real app, this might be a separate API call
    const expirationAlerts = medications.filter((med: any) => {
      if (!med.expirationDate) return false;
      const expirationDate = new Date(med.expirationDate);
      const now = new Date();
      const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiration <= 90; // Alert for medications expiring within 90 days
    });

    return {
      medications,
      total: medications.length,
      expirationAlerts
    };
  } catch (error) {
    console.error('Failed to get emergency medications:', error);
    return { medications: [], total: 0, expirationAlerts: [] };
  }
});

/**
 * Get recent administrations for a specific medication
 */
export const getRecentAdministrations = cache(async (medicationId: string, limit: number = 10): Promise<any[]> => {
  try {
    const response = await serverGet<ApiResponse<any[]>>(
      ADMINISTRATION_LOG_ENDPOINTS.BY_MEDICATION(medicationId),
      { limit: limit.toString() },
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_FREQUENT, // 3 min cache for recent data
          tags: [`medication-administrations-${medicationId}`, CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get recent administrations:', error);
    return [];
  }
});
