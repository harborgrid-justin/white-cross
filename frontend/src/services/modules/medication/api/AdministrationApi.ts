/**
 * WF-COMP-282 | AdministrationApi.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./PrescriptionApi, ./MedicationFormularyApi | Dependencies: @/services/config/apiConfig, @/constants/api, zod
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, interfaces, classes | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Administration API Client
 *
 * Purpose: Medication administration and logging
 *
 * CRITICAL SAFETY REQUIREMENTS:
 * - NO caching for administration records
 * - NO optimistic updates (too risky)
 * - Requires online connection or queue for offline
 * - Mandatory Five Rights verification
 * - All operations audited
 *
 * Responsibilities:
 * - Administration workflow management
 * - Five Rights verification
 * - Administration logging
 * - Refusal/missed dose tracking
 * - Witness signature capture
 * - Administration history
 */

import { apiInstance } from '@/services/config/apiConfig';
import { API_ENDPOINTS } from '@/constants/api';
import { z } from 'zod';
import { Prescription, AdministrationRoute } from './PrescriptionApi';
import { Medication } from './MedicationFormularyApi';

// Types
export interface AdministrationSession {
  sessionId: string;
  prescriptionId: string;
  studentId: string;
  medicationId: string;
  scheduledTime: string;
  prescription: Prescription;
  medication: Medication;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    barcode: string;
    photo?: string;
    weight?: number;
    allergies?: any[];
  };
  prescriptionNDC: string;
  studentBarcode: string;
  prescribedDose: string;
  prescribedRoute: AdministrationRoute;
  administrationWindow: {
    start: string;
    end: string;
  };
  safetyChecks: {
    allergiesChecked: boolean;
    interactionsChecked: boolean;
    contraindicationsChecked: boolean;
  };
  createdAt: string;
  expiresAt: string;
}

export interface FiveRightsData {
  // Right Patient
  studentBarcode: string;
  patientPhotoConfirmed: boolean;

  // Right Medication
  medicationNDC: string;
  medicationBarcode: string;
  lasaConfirmed: boolean;

  // Right Dose
  scannedDose: string;
  calculatedDose?: string;
  doseCalculatorUsed: boolean;

  // Right Route
  route: AdministrationRoute;

  // Right Time
  administrationTime: string;
  withinWindow: boolean;
  timeOverrideReason?: string;

  // Additional safety
  allergyAcknowledged: boolean;
  allergyWarnings?: string[];
}

export interface FiveRightsVerificationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  criticalWarnings: string[];
  canProceed: boolean;
  requiresOverride: boolean;
  overrideRequirements?: {
    supervisorApproval: boolean;
    documentation: string[];
  };
}

export interface AdministrationRecord {
  sessionId: string;
  prescriptionId: string;
  studentId: string;
  medicationId: string;
  dosageAdministered: string;
  route: AdministrationRoute;
  administeredAt: string;
  administeredBy: string;
  fiveRightsData: FiveRightsData;
  witnessId?: string;
  witnessSignature?: string;
  notes?: string;
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    respiratoryRate?: number;
  };
  studentResponse?: 'normal' | 'unusual' | 'adverse';
  followUpRequired?: boolean;
  followUpNotes?: string;
}

export interface AdministrationLog {
  id: string;
  prescriptionId: string;
  studentId: string;
  medicationId: string;
  dosageAdministered: string;
  route: AdministrationRoute;
  scheduledTime: string;
  administeredAt: string;
  administeredBy: string;
  administeredByName: string;
  witnessId?: string;
  witnessName?: string;
  witnessSignature?: string;
  status: 'administered' | 'refused' | 'missed' | 'held' | 'error';
  refusalReason?: string;
  missedReason?: string;
  notes?: string;
  vitalSigns?: any;
  studentResponse?: 'normal' | 'unusual' | 'adverse';
  followUpRequired?: boolean;
  followUpNotes?: string;
  medication?: Medication;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  prescription?: Prescription;
  createdAt: string;
  updatedAt: string;
}

export interface WitnessSignature {
  id: string;
  administrationLogId: string;
  witnessId: string;
  witnessName: string;
  signature: string;
  signedAt: string;
}

export interface AdministrationHistoryFilters {
  studentId?: string;
  medicationId?: string;
  prescriptionId?: string;
  administeredBy?: string;
  status?: 'administered' | 'refused' | 'missed' | 'held' | 'error';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface MedicationReminder {
  id: string;
  prescriptionId: string;
  studentId: string;
  medicationId: string;
  scheduledTime: string;
  status: 'pending' | 'completed' | 'missed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  isOverdue: boolean;
  prescription: Prescription;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    barcode: string;
    photo?: string;
  };
  medication: Medication;
}

// Validation Schema
const administrationRecordSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  prescriptionId: z.string().min(1, 'Prescription ID is required'),
  studentId: z.string().min(1, 'Student ID is required'),
  medicationId: z.string().min(1, 'Medication ID is required'),
  dosageAdministered: z.string().min(1, 'Dosage is required'),
  route: z.enum([
    'oral', 'sublingual', 'buccal', 'intravenous', 'intramuscular',
    'subcutaneous', 'topical', 'inhalation', 'rectal', 'ophthalmic', 'otic', 'nasal'
  ]),
  administeredAt: z.string().min(1, 'Administration time is required'),
  administeredBy: z.string().min(1, 'Administrator ID is required'),
  fiveRightsData: z.object({
    studentBarcode: z.string().min(1),
    patientPhotoConfirmed: z.boolean(),
    medicationNDC: z.string().min(1),
    medicationBarcode: z.string().min(1),
    lasaConfirmed: z.boolean(),
    scannedDose: z.string().min(1),
    doseCalculatorUsed: z.boolean(),
    route: z.string().min(1),
    administrationTime: z.string().min(1),
    withinWindow: z.boolean(),
    allergyAcknowledged: z.boolean(),
  }),
  witnessId: z.string().optional(),
  witnessSignature: z.string().optional(),
  notes: z.string().optional(),
  studentResponse: z.enum(['normal', 'unusual', 'adverse']).optional(),
  followUpRequired: z.boolean().optional(),
  followUpNotes: z.string().optional(),
});

// API Client
export class AdministrationApi {
  /**
   * Initiate administration session
   * Creates session with pre-loaded safety data
   */
  async initiateAdministration(prescriptionId: string): Promise<AdministrationSession> {
    try {
      if (!prescriptionId) throw new Error('Prescription ID is required');

      const response = await apiInstance.post(
        API_ENDPOINTS.MEDICATIONS.ADMINISTRATION_INITIATE,
        { prescriptionId }
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to initiate administration session');
    }
  }

  /**
   * Verify Five Rights (server-side validation)
   * CRITICAL: Must pass before allowing administration
   */
  async verifyFiveRights(
    session: AdministrationSession,
    data: FiveRightsData
  ): Promise<FiveRightsVerificationResult> {
    try {
      const response = await apiInstance.post(
        API_ENDPOINTS.MEDICATIONS.ADMINISTRATION_VERIFY,
        {
          sessionId: session.sessionId,
          fiveRightsData: data,
        }
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to verify Five Rights');
    }
  }

  /**
   * Record medication administration
   * NO OPTIMISTIC UPDATE - Wait for server confirmation
   */
  async recordAdministration(data: AdministrationRecord): Promise<AdministrationLog> {
    try {
      // Validate data
      administrationRecordSchema.parse(data);

      const response = await apiInstance.post(
        API_ENDPOINTS.MEDICATIONS.ADMINISTRATION_RECORD,
        data
      );

      return response.data.data;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw new Error(error.response?.data?.message || 'Failed to record administration');
    }
  }

  /**
   * Record medication refusal
   */
  async recordRefusal(
    prescriptionId: string,
    scheduledTime: string,
    reason: string,
    notes?: string
  ): Promise<AdministrationLog> {
    try {
      if (!prescriptionId) throw new Error('Prescription ID is required');
      if (!reason) throw new Error('Refusal reason is required');

      const response = await apiInstance.post(
        API_ENDPOINTS.MEDICATIONS.ADMINISTRATION_REFUSAL,
        {
          prescriptionId,
          scheduledTime,
          reason,
          notes,
        }
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to record refusal');
    }
  }

  /**
   * Record missed dose
   */
  async recordMissedDose(
    prescriptionId: string,
    scheduledTime: string,
    reason: string,
    notes?: string
  ): Promise<AdministrationLog> {
    try {
      if (!prescriptionId) throw new Error('Prescription ID is required');
      if (!reason) throw new Error('Missed reason is required');

      const response = await apiInstance.post(
        API_ENDPOINTS.MEDICATIONS.ADMINISTRATION_MISSED,
        {
          prescriptionId,
          scheduledTime,
          reason,
          notes,
        }
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to record missed dose');
    }
  }

  /**
   * Record held medication (clinical decision not to administer)
   */
  async recordHeldMedication(
    prescriptionId: string,
    scheduledTime: string,
    reason: string,
    clinicalRationale: string
  ): Promise<AdministrationLog> {
    try {
      if (!prescriptionId) throw new Error('Prescription ID is required');
      if (!reason) throw new Error('Hold reason is required');
      if (!clinicalRationale) throw new Error('Clinical rationale is required');

      const response = await apiInstance.post(
        API_ENDPOINTS.MEDICATIONS.ADMINISTRATION_HELD,
        {
          prescriptionId,
          scheduledTime,
          reason,
          clinicalRationale,
        }
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to record held medication');
    }
  }

  /**
   * Get administration history
   */
  async getAdministrationHistory(
    filters?: AdministrationHistoryFilters
  ): Promise<{
    logs: AdministrationLog[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const params = new URLSearchParams();

      if (filters?.studentId) params.append('studentId', filters.studentId);
      if (filters?.medicationId) params.append('medicationId', filters.medicationId);
      if (filters?.prescriptionId) params.append('prescriptionId', filters.prescriptionId);
      if (filters?.administeredBy) params.append('administeredBy', filters.administeredBy);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.page) params.append('page', String(filters.page));
      if (filters?.limit) params.append('limit', String(filters.limit));

      const response = await apiInstance.get(
        `${API_ENDPOINTS.MEDICATIONS.ADMINISTRATION_HISTORY}?${params.toString()}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch administration history');
    }
  }

  /**
   * Get today's administrations for nurse
   */
  async getTodayAdministrations(nurseId?: string): Promise<AdministrationLog[]> {
    try {
      const params = new URLSearchParams();
      if (nurseId) params.append('nurseId', nurseId);

      const response = await apiInstance.get(
        `${API_ENDPOINTS.MEDICATIONS.ADMINISTRATION_TODAY}?${params.toString()}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch today\'s administrations');
    }
  }

  /**
   * Get upcoming medication reminders
   */
  async getUpcomingReminders(
    nurseId?: string,
    withinHours: number = 4
  ): Promise<MedicationReminder[]> {
    try {
      const params = new URLSearchParams();
      if (nurseId) params.append('nurseId', nurseId);
      params.append('withinHours', String(withinHours));

      const response = await apiInstance.get(
        `${API_ENDPOINTS.MEDICATIONS.REMINDERS}?${params.toString()}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch upcoming reminders');
    }
  }

  /**
   * Get overdue administrations
   */
  async getOverdueAdministrations(): Promise<MedicationReminder[]> {
    try {
      const response = await apiInstance.get(
        API_ENDPOINTS.MEDICATIONS.ADMINISTRATION_OVERDUE
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch overdue administrations');
    }
  }

  /**
   * Request witness signature
   * Required for controlled substances
   */
  async requestWitnessSignature(
    administrationLogId: string,
    witnessId: string
  ): Promise<WitnessSignature> {
    try {
      if (!administrationLogId) throw new Error('Administration log ID is required');
      if (!witnessId) throw new Error('Witness ID is required');

      const response = await apiInstance.post(
        API_ENDPOINTS.MEDICATIONS.ADMINISTRATION_WITNESS(administrationLogId),
        { witnessId }
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to request witness signature');
    }
  }

  /**
   * Submit witness signature
   */
  async submitWitnessSignature(
    administrationLogId: string,
    signature: string
  ): Promise<WitnessSignature> {
    try {
      if (!administrationLogId) throw new Error('Administration log ID is required');
      if (!signature) throw new Error('Signature is required');

      const response = await apiInstance.post(
        API_ENDPOINTS.MEDICATIONS.ADMINISTRATION_WITNESS_SIGN(administrationLogId),
        { signature }
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to submit witness signature');
    }
  }

  /**
   * Check for allergies (pre-administration)
   */
  async checkAllergies(
    studentId: string,
    medicationId: string
  ): Promise<any[]> {
    try {
      if (!studentId) throw new Error('Student ID is required');
      if (!medicationId) throw new Error('Medication ID is required');

      const response = await apiInstance.post(
        API_ENDPOINTS.MEDICATIONS.ADMINISTRATION_CHECK_ALLERGIES,
        { studentId, medicationId }
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to check allergies');
    }
  }

  /**
   * Check for drug interactions (pre-administration)
   */
  async checkInteractions(
    studentId: string,
    medicationId: string
  ): Promise<any[]> {
    try {
      if (!studentId) throw new Error('Student ID is required');
      if (!medicationId) throw new Error('Medication ID is required');

      const response = await apiInstance.post(
        API_ENDPOINTS.MEDICATIONS.ADMINISTRATION_CHECK_INTERACTIONS,
        { studentId, medicationId }
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to check interactions');
    }
  }

  /**
   * Get student administration schedule
   */
  async getStudentSchedule(
    studentId: string,
    date?: string
  ): Promise<MedicationReminder[]> {
    try {
      if (!studentId) throw new Error('Student ID is required');

      const params = new URLSearchParams();
      if (date) params.append('date', date);

      const response = await apiInstance.get(
        `${API_ENDPOINTS.MEDICATIONS.STUDENT_SCHEDULE(studentId)}?${params.toString()}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch student schedule');
    }
  }

  /**
   * Calculate dose based on patient weight/age
   */
  async calculateDose(
    prescriptionId: string,
    studentId: string
  ): Promise<{
    calculatedDose: string;
    calculation: string;
    warnings: string[];
  }> {
    try {
      if (!prescriptionId) throw new Error('Prescription ID is required');
      if (!studentId) throw new Error('Student ID is required');

      const response = await apiInstance.post(
        API_ENDPOINTS.MEDICATIONS.ADMINISTRATION_CALCULATE_DOSE,
        { prescriptionId, studentId }
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to calculate dose');
    }
  }

  /**
   * Update reminder status
   */
  async updateReminderStatus(
    reminderId: string,
    status: 'completed' | 'missed' | 'cancelled'
  ): Promise<void> {
    try {
      if (!reminderId) throw new Error('Reminder ID is required');

      await apiInstance.patch(
        `${API_ENDPOINTS.MEDICATIONS.REMINDERS}/${reminderId}/status`,
        { status }
      );
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update reminder status');
    }
  }
}

// Export singleton instance
export const administrationApi = new AdministrationApi();
