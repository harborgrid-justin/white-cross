/**
 * WF-COMP-285 | PrescriptionApi.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./MedicationFormularyApi | Dependencies: @/services/config/apiConfig, @/constants/api, zod
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, interfaces, types, classes | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Prescription API Client
 *
 * Purpose: Manages student medication prescriptions
 *
 * Responsibilities:
 * - Prescription CRUD operations
 * - Student prescription queries
 * - Prescription verification
 * - Allergy checking
 * - Prescription history
 *
 * Caching Strategy:
 * - Active prescriptions: 5 minutes
 * - Invalidate on prescription changes
 * - Student-specific cache keys
 */

import { apiInstance } from '@/services/config/apiConfig';
import { API_ENDPOINTS } from '@/constants/api';
import { z } from 'zod';
import { Medication, AdministrationRoute } from './MedicationFormularyApi';

// Types
export interface Prescription {
  id: string;
  studentId: string;
  medicationId: string;
  dosage: string;
  frequency: PrescriptionFrequency;
  route: AdministrationRoute;
  startDate: string;
  endDate?: string;
  instructions: string;
  prescribedBy: string;
  prescribedDate: string;
  prescriptionNumber?: string;
  refillsRemaining?: number;
  isPRN: boolean;
  prnInstructions?: string;
  requiresWitness: boolean;
  isActive: boolean;
  discontinuedAt?: string;
  discontinuedBy?: string;
  discontinuationReason?: string;
  medication?: Medication;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    allergies?: Allergy[];
  };
  createdAt: string;
  updatedAt: string;
}

export type PrescriptionFrequency =
  | 'ONCE_DAILY'
  | 'TWICE_DAILY'
  | 'THREE_TIMES_DAILY'
  | 'FOUR_TIMES_DAILY'
  | 'EVERY_4_HOURS'
  | 'EVERY_6_HOURS'
  | 'EVERY_8_HOURS'
  | 'EVERY_12_HOURS'
  | 'WEEKLY'
  | 'BIWEEKLY'
  | 'MONTHLY'
  | 'PRN'
  | 'CUSTOM';

export interface Allergy {
  id: string;
  studentId: string;
  allergen: string;
  allergyType: 'medication' | 'food' | 'environmental' | 'other';
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  reactions: string[];
  onsetDate?: string;
  notes?: string;
  isActive: boolean;
}

export interface AllergyWarning {
  allergyId: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  reactions: string[];
  crossReactivity?: string[];
  recommendation: string;
}

export interface PrescriptionFilters {
  studentId?: string;
  medicationId?: string;
  isActive?: boolean;
  isPRN?: boolean;
  requiresWitness?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface CreatePrescriptionRequest {
  studentId: string;
  medicationId: string;
  dosage: string;
  frequency: PrescriptionFrequency;
  route: AdministrationRoute;
  startDate: string;
  endDate?: string;
  instructions: string;
  prescribedBy: string;
  prescribedDate: string;
  prescriptionNumber?: string;
  refillsRemaining?: number;
  isPRN?: boolean;
  prnInstructions?: string;
  requiresWitness?: boolean;
}

export interface UpdatePrescriptionRequest {
  dosage?: string;
  frequency?: PrescriptionFrequency;
  route?: AdministrationRoute;
  endDate?: string;
  instructions?: string;
  refillsRemaining?: number;
  prnInstructions?: string;
  requiresWitness?: boolean;
}

export interface VerificationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  prescription?: Prescription;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    barcode: string;
    photo?: string;
  };
  allergies?: AllergyWarning[];
  interactions?: any[];
}

export interface PrescriptionHistory {
  id: string;
  prescriptionId: string;
  action: 'created' | 'updated' | 'discontinued' | 'renewed';
  changes: Record<string, { old: any; new: any }>;
  performedBy: string;
  performedAt: string;
  reason?: string;
}

// Validation Schemas
const createPrescriptionSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  medicationId: z.string().min(1, 'Medication ID is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.enum([
    'ONCE_DAILY', 'TWICE_DAILY', 'THREE_TIMES_DAILY', 'FOUR_TIMES_DAILY',
    'EVERY_4_HOURS', 'EVERY_6_HOURS', 'EVERY_8_HOURS', 'EVERY_12_HOURS',
    'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'PRN', 'CUSTOM'
  ]),
  route: z.enum([
    'oral', 'sublingual', 'buccal', 'intravenous', 'intramuscular',
    'subcutaneous', 'topical', 'inhalation', 'rectal', 'ophthalmic', 'otic', 'nasal'
  ]),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  instructions: z.string().min(1, 'Instructions are required'),
  prescribedBy: z.string().min(1, 'Prescriber is required'),
  prescribedDate: z.string().min(1, 'Prescription date is required'),
  prescriptionNumber: z.string().optional(),
  refillsRemaining: z.number().int().min(0).optional(),
  isPRN: z.boolean().optional(),
  prnInstructions: z.string().optional(),
  requiresWitness: z.boolean().optional(),
});

// API Client
export class PrescriptionApi {
  /**
   * Create new prescription
   */
  async createPrescription(data: CreatePrescriptionRequest): Promise<Prescription> {
    try {
      // Validate data
      createPrescriptionSchema.parse(data);

      // Check for allergies before creating
      const allergyWarnings = await this.checkPrescriptionAllergies(data.studentId, data.medicationId);
      if (allergyWarnings.some(a => a.severity === 'life-threatening')) {
        throw new Error(
          `Cannot create prescription: Life-threatening allergy to ${allergyWarnings[0].allergen}`
        );
      }

      const response = await apiInstance.post(
        API_ENDPOINTS.MEDICATIONS.PRESCRIPTIONS,
        data
      );

      return response.data.data;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw new Error(error.response?.data?.message || 'Failed to create prescription');
    }
  }

  /**
   * Update prescription
   */
  async updatePrescription(
    id: string,
    data: UpdatePrescriptionRequest
  ): Promise<Prescription> {
    try {
      if (!id) throw new Error('Prescription ID is required');

      const response = await apiInstance.put(
        API_ENDPOINTS.MEDICATIONS.PRESCRIPTION_BY_ID(id),
        data
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update prescription');
    }
  }

  /**
   * Discontinue prescription
   * Soft delete with reason tracking
   */
  async discontinuePrescription(id: string, reason: string): Promise<void> {
    try {
      if (!id) throw new Error('Prescription ID is required');
      if (!reason) throw new Error('Discontinuation reason is required');

      await apiInstance.patch(
        API_ENDPOINTS.MEDICATIONS.PRESCRIPTION_DISCONTINUE(id),
        { reason }
      );
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to discontinue prescription');
    }
  }

  /**
   * Get prescription by ID
   */
  async getPrescriptionById(id: string): Promise<Prescription> {
    try {
      if (!id) throw new Error('Prescription ID is required');

      const response = await apiInstance.get(
        API_ENDPOINTS.MEDICATIONS.PRESCRIPTION_BY_ID(id)
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch prescription');
    }
  }

  /**
   * Get student prescriptions
   */
  async getStudentPrescriptions(
    studentId: string,
    options?: { includeInactive?: boolean }
  ): Promise<Prescription[]> {
    try {
      if (!studentId) throw new Error('Student ID is required');

      const params = new URLSearchParams();
      if (options?.includeInactive) {
        params.append('includeInactive', 'true');
      }

      const response = await apiInstance.get(
        `${API_ENDPOINTS.MEDICATIONS.STUDENT_PRESCRIPTIONS(studentId)}?${params.toString()}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch student prescriptions');
    }
  }

  /**
   * Get active prescriptions (all students or filtered)
   */
  async getActivePrescriptions(filters?: PrescriptionFilters): Promise<{
    prescriptions: Prescription[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const params = new URLSearchParams();

      if (filters?.studentId) params.append('studentId', filters.studentId);
      if (filters?.medicationId) params.append('medicationId', filters.medicationId);
      if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
      if (filters?.isPRN !== undefined) params.append('isPRN', String(filters.isPRN));
      if (filters?.requiresWitness !== undefined) params.append('requiresWitness', String(filters.requiresWitness));
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.page) params.append('page', String(filters.page));
      if (filters?.limit) params.append('limit', String(filters.limit));

      const response = await apiInstance.get(
        `${API_ENDPOINTS.MEDICATIONS.PRESCRIPTIONS}?${params.toString()}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch active prescriptions');
    }
  }

  /**
   * Get prescription history (audit trail)
   */
  async getPrescriptionHistory(prescriptionId: string): Promise<PrescriptionHistory[]> {
    try {
      if (!prescriptionId) throw new Error('Prescription ID is required');

      const response = await apiInstance.get(
        API_ENDPOINTS.MEDICATIONS.PRESCRIPTION_HISTORY(prescriptionId)
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch prescription history');
    }
  }

  /**
   * Verify prescription for administration
   * Critical safety check
   */
  async verifyPrescription(
    prescriptionId: string,
    studentId: string
  ): Promise<VerificationResult> {
    try {
      if (!prescriptionId) throw new Error('Prescription ID is required');
      if (!studentId) throw new Error('Student ID is required');

      const response = await apiInstance.post(
        API_ENDPOINTS.MEDICATIONS.PRESCRIPTION_VERIFY(prescriptionId),
        { studentId }
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to verify prescription');
    }
  }

  /**
   * Check prescription for allergies
   * Called before creating or administering
   */
  async checkPrescriptionAllergies(
    studentId: string,
    medicationId: string
  ): Promise<AllergyWarning[]> {
    try {
      if (!studentId) throw new Error('Student ID is required');
      if (!medicationId) throw new Error('Medication ID is required');

      const response = await apiInstance.post(
        API_ENDPOINTS.MEDICATIONS.PRESCRIPTIONS_CHECK_ALLERGIES,
        { studentId, medicationId }
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to check allergies');
    }
  }

  /**
   * Get student allergies
   */
  async getStudentAllergies(studentId: string): Promise<Allergy[]> {
    try {
      if (!studentId) throw new Error('Student ID is required');

      const response = await apiInstance.get(
        API_ENDPOINTS.MEDICATIONS.STUDENT_ALLERGIES(studentId)
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch student allergies');
    }
  }

  /**
   * Add student allergy
   */
  async addStudentAllergy(data: Omit<Allergy, 'id' | 'isActive'>): Promise<Allergy> {
    try {
      const response = await apiInstance.post(
        API_ENDPOINTS.MEDICATIONS.STUDENT_ALLERGIES(data.studentId),
        data
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add student allergy');
    }
  }

  /**
   * Update student allergy
   */
  async updateStudentAllergy(
    allergyId: string,
    data: Partial<Omit<Allergy, 'id' | 'studentId'>>
  ): Promise<Allergy> {
    try {
      if (!allergyId) throw new Error('Allergy ID is required');

      const response = await apiInstance.put(
        API_ENDPOINTS.MEDICATIONS.ALLERGY_BY_ID(allergyId),
        data
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update allergy');
    }
  }

  /**
   * Deactivate student allergy
   */
  async deactivateAllergy(allergyId: string, reason: string): Promise<void> {
    try {
      if (!allergyId) throw new Error('Allergy ID is required');
      if (!reason) throw new Error('Deactivation reason is required');

      await apiInstance.patch(
        API_ENDPOINTS.MEDICATIONS.ALLERGY_DEACTIVATE(allergyId),
        { reason }
      );
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to deactivate allergy');
    }
  }

  /**
   * Renew prescription
   */
  async renewPrescription(
    prescriptionId: string,
    data: {
      refillsRemaining?: number;
      endDate?: string;
      notes?: string;
    }
  ): Promise<Prescription> {
    try {
      if (!prescriptionId) throw new Error('Prescription ID is required');

      const response = await apiInstance.post(
        API_ENDPOINTS.MEDICATIONS.PRESCRIPTION_RENEW(prescriptionId),
        data
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to renew prescription');
    }
  }

  /**
   * Get expiring prescriptions
   */
  async getExpiringPrescriptions(withinDays: number = 30): Promise<Prescription[]> {
    try {
      const response = await apiInstance.get(
        `${API_ENDPOINTS.MEDICATIONS.PRESCRIPTIONS_EXPIRING}?withinDays=${withinDays}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch expiring prescriptions');
    }
  }

  /**
   * Get PRN (as needed) prescriptions for student
   */
  async getPRNPrescriptions(studentId: string): Promise<Prescription[]> {
    try {
      if (!studentId) throw new Error('Student ID is required');

      const response = await apiInstance.get(
        API_ENDPOINTS.MEDICATIONS.STUDENT_PRESCRIPTIONS_PRN(studentId)
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch PRN prescriptions');
    }
  }
}

// Export singleton instance
export const prescriptionApi = new PrescriptionApi();
