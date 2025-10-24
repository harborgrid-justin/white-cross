/**
 * WF-COMP-289 | medicationsApi.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../config/apiConfig, ../utils/apiUtils, ../../types/medications | Dependencies: ../config/apiConfig, ../utils/apiUtils, zod
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, interfaces, classes | Key Features: arrow component
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import type { ApiClient } from '../core/ApiClient';
import { API_ENDPOINTS } from '../../constants/api';
import { ApiResponse, PaginatedResponse, buildPaginationParams } from '../utils/apiUtils';
import { createApiError } from '../core/errors';
import { z } from 'zod';
import { auditService, AuditAction, AuditResourceType, AuditStatus } from '../audit';
import {
  Medication,
  StudentMedication,
  InventoryItem,
  MedicationReminder,
  AdverseReaction,
  MedicationFormData,
  StudentMedicationFormData,
  AdverseReactionFormData
} from '../../types/api';
import {
  MedicationLog,
  MedicationAdministrationData,
  AdverseReactionData,
  MedicationsResponse,
  StudentMedicationsResponse,
  InventoryResponse,
  MedicationStats,
  MedicationAlertsResponse,
  MedicationFormOptions,
  MedicationScheduleResponse
} from '../../types/medications';

export interface MedicationFilters {
  search?: string;
  category?: string;
  isActive?: boolean;
  controlledSubstance?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface CreateMedicationRequest {
  name: string;
  genericName?: string;
  dosageForm: string;
  strength: string;
  manufacturer?: string;
  ndc?: string;
  isControlled?: boolean;
}

export interface CreateInventoryRequest {
  medicationId: string;
  batchNumber: string;
  expirationDate: string;
  quantity: number;
  reorderLevel?: number;
  costPerUnit?: number;
  supplier?: string;
}

export interface UpdateInventoryRequest {
  quantity: number;
  reason?: string;
}

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

/**
 * NDC (National Drug Code) Format Validation
 * Format: XXXXX-XXXX-XX (5-4-2) or XXXXX-XXX-XX (5-3-2)
 */
const ndcRegex = /^[0-9]{5}-([0-9]{3,4})-[0-9]{2}$/;

/**
 * Dosage format validation
 * Supports: "500mg", "10ml", "2 tablets", "1 unit", etc.
 */
const dosageRegex = /^[0-9]+(\.[0-9]+)?\s*(mg|g|mcg|ml|L|units?|tablets?|capsules?|drops?|puff|patch|spray|application|mEq|%)$/i;

/**
 * Frequency validation patterns
 */
const frequencyPatterns = [
  /^(once|twice|1x|2x|3x|4x)\s*(daily|per day)$/i,
  /^(three|four|five|six)\s*times\s*(daily|per day|a day)$/i,
  /^every\s+[0-9]+\s+(hour|hours|hr|hrs)$/i,
  /^(q[0-9]+h|qid|tid|bid|qd|qhs|prn|ac|pc|hs)$/i,
  /^as\s+needed$/i,
  /^before\s+(meals|breakfast|lunch|dinner|bedtime)$/i,
  /^after\s+(meals|breakfast|lunch|dinner)$/i,
  /^at\s+bedtime$/i,
  /^weekly$/i,
  /^monthly$/i,
];

/**
 * Strength format validation
 */
const strengthRegex = /^[0-9]+(\.[0-9]+)?\s*(mg|g|mcg|ml|L|units?|mEq|%)$/i;

/**
 * Valid dosage forms
 */
const dosageForms = [
  'Tablet',
  'Capsule',
  'Liquid',
  'Injection',
  'Topical',
  'Inhaler',
  'Drops',
  'Patch',
  'Suppository',
  'Powder',
  'Cream',
  'Ointment',
  'Gel',
  'Spray',
  'Lozenge'
] as const;

/**
 * Valid administration routes
 */
const administrationRoutes = [
  'Oral',
  'Sublingual',
  'Topical',
  'Intravenous',
  'Intramuscular',
  'Subcutaneous',
  'Inhalation',
  'Ophthalmic',
  'Otic',
  'Nasal',
  'Rectal',
  'Transdermal'
] as const;

/**
 * DEA Schedules for controlled substances
 */
const deaSchedules = ['I', 'II', 'III', 'IV', 'V'] as const;

/**
 * Frequency validator
 */
const frequencyValidator = (value: string) => {
  const normalizedValue = value.trim().toLowerCase();
  return frequencyPatterns.some(pattern => pattern.test(normalizedValue));
};

/**
 * Schema for creating a new medication
 */
const createMedicationSchema = z.object({
  name: z.string()
    .min(2, 'Medication name must be at least 2 characters')
    .max(200, 'Medication name cannot exceed 200 characters')
    .trim(),

  genericName: z.string()
    .min(2, 'Generic name must be at least 2 characters')
    .max(200, 'Generic name cannot exceed 200 characters')
    .trim()
    .optional(),

  dosageForm: z.enum(dosageForms, {
    message: 'Please select a valid dosage form'
  }),

  strength: z.string()
    .regex(strengthRegex, 'Strength must be in valid format (e.g., "500mg", "10ml", "50mcg")')
    .trim(),

  manufacturer: z.string()
    .max(200, 'Manufacturer name cannot exceed 200 characters')
    .trim()
    .optional(),

  ndc: z.string()
    .regex(ndcRegex, 'NDC must be in format: XXXXX-XXXX-XX or XXXXX-XXX-XX')
    .trim()
    .optional()
    .or(z.literal('')),

  isControlled: z.boolean().optional().default(false),

  deaSchedule: z.enum(deaSchedules)
    .optional()
    .nullable(),
}).refine(
  (data) => {
    // Cross-field validation: DEA Schedule required for controlled substances
    if (data.isControlled && !data.deaSchedule) {
      return false;
    }
    return true;
  },
  {
    message: 'DEA Schedule is required for controlled substances',
    path: ['deaSchedule']
  }
);

/**
 * Schema for assigning medication to student (prescription)
 * Implements Five Rights validation
 */
const assignMedicationSchema = z.object({
  studentId: z.string()
    .uuid('Student ID must be a valid UUID')
    .min(1, 'Student ID is required (Right Patient)'),

  medicationId: z.string()
    .uuid('Medication ID must be a valid UUID')
    .min(1, 'Medication ID is required (Right Medication)'),

  dosage: z.string()
    .regex(dosageRegex, 'Dosage must be in valid format (e.g., "500mg", "2 tablets", "10ml")')
    .min(1, 'Dosage is required (Right Dose)')
    .trim(),

  frequency: z.string()
    .min(1, 'Frequency is required')
    .trim()
    .refine(
      frequencyValidator,
      'Frequency must be valid (e.g., "twice daily", "every 6 hours", "as needed", "BID")'
    ),

  route: z.enum(administrationRoutes, {
    message: 'Route is required (Right Route)'
  }),

  instructions: z.string()
    .max(2000, 'Instructions cannot exceed 2000 characters')
    .trim()
    .optional(),

  startDate: z.string()
    .min(1, 'Start date is required')
    .refine(
      (date) => new Date(date) <= new Date(),
      'Start date cannot be in the future'
    ),

  endDate: z.string()
    .optional(),

  prescribedBy: z.string()
    .min(3, 'Prescribing physician name must be at least 3 characters')
    .max(200, 'Prescribing physician name cannot exceed 200 characters')
    .trim(),

  prescriptionNumber: z.string()
    .regex(/^[A-Z0-9]{6,20}$/i, 'Prescription number must be 6-20 alphanumeric characters')
    .trim()
    .optional(),

  refillsRemaining: z.number()
    .int()
    .min(0, 'Refills remaining cannot be negative')
    .max(12, 'Refills remaining cannot exceed 12')
    .optional()
    .default(0),
}).refine(
  (data) => {
    // Cross-field validation: endDate must be after startDate
    if (data.endDate && data.startDate) {
      return new Date(data.endDate) >= new Date(data.startDate);
    }
    return true;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate']
  }
);

/**
 * Schema for logging medication administration
 * CRITICAL: Implements Five Rights validation
 */
const logAdministrationSchema = z.object({
  studentMedicationId: z.string()
    .uuid('Student medication ID must be a valid UUID')
    .min(1, 'Student medication ID is required'),

  dosageGiven: z.string()
    .regex(dosageRegex, 'Dosage given must be in valid format (e.g., "500mg", "2 tablets", "10ml")')
    .min(1, 'Dosage given is required (Right Dose)')
    .trim(),

  timeGiven: z.string()
    .min(1, 'Administration time is required (Right Time)')
    .refine(
      (date) => new Date(date) <= new Date(),
      'Administration time cannot be in the future'
    ),

  notes: z.string()
    .max(2000, 'Notes cannot exceed 2000 characters')
    .trim()
    .optional(),

  sideEffects: z.string()
    .max(2000, 'Side effects description cannot exceed 2000 characters')
    .trim()
    .optional(),

  deviceId: z.string()
    .max(100, 'Device ID cannot exceed 100 characters')
    .trim()
    .optional(),

  witnessId: z.string()
    .uuid('Witness ID must be a valid UUID')
    .optional(),

  witnessName: z.string()
    .max(200, 'Witness name cannot exceed 200 characters')
    .trim()
    .optional(),

  patientVerified: z.boolean().default(true),

  allergyChecked: z.boolean().default(true),
});

/**
 * Schema for adding to inventory
 */
const addToInventorySchema = z.object({
  medicationId: z.string()
    .uuid('Medication ID must be a valid UUID')
    .min(1, 'Medication ID is required'),

  batchNumber: z.string()
    .regex(/^[A-Z0-9-]{3,50}$/i, 'Batch number must be 3-50 alphanumeric characters')
    .trim(),

  expirationDate: z.string()
    .refine(
      (date) => new Date(date) > new Date(),
      'Expiration date must be in the future - cannot add expired medication'
    ),

  quantity: z.number()
    .int()
    .min(1, 'Quantity must be at least 1')
    .max(100000, 'Quantity cannot exceed 100,000 units'),

  reorderLevel: z.number()
    .int()
    .min(0, 'Reorder level cannot be negative')
    .max(10000, 'Reorder level cannot exceed 10,000 units')
    .optional()
    .default(10),

  costPerUnit: z.number()
    .min(0, 'Cost per unit cannot be negative')
    .max(100000, 'Cost per unit cannot exceed $100,000')
    .optional(),

  supplier: z.string()
    .max(200, 'Supplier name cannot exceed 200 characters')
    .trim()
    .optional(),
});

/**
 * Schema for reporting adverse reaction
 */
const reportAdverseReactionSchema = z.object({
  studentMedicationId: z.string()
    .uuid('Student medication ID must be a valid UUID')
    .min(1, 'Student medication ID is required'),

  severity: z.enum(['MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING'], {
    message: 'Severity must be MILD, MODERATE, SEVERE, or LIFE_THREATENING'
  }),

  reaction: z.string()
    .min(10, 'Reaction description must be at least 10 characters')
    .max(2000, 'Reaction description cannot exceed 2000 characters')
    .trim(),

  actionTaken: z.string()
    .min(10, 'Action taken must be at least 10 characters')
    .max(2000, 'Action taken cannot exceed 2000 characters')
    .trim(),

  notes: z.string()
    .max(5000, 'Notes cannot exceed 5000 characters')
    .trim()
    .optional(),

  reportedAt: z.string()
    .refine(
      (date) => new Date(date) <= new Date(),
      'Reported time cannot be in the future'
    ),
});

// Medications API class
export class MedicationsApi {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * Get all medications with optional filtering
   */
  async getAll(filters: MedicationFilters = {}): Promise<MedicationsResponse> {
    try {
      const queryString = new URLSearchParams();
      if (filters.page) queryString.append('page', String(filters.page));
      if (filters.limit) queryString.append('limit', String(filters.limit));
      if (filters.search) queryString.append('search', filters.search);

      const response = await this.client.get<ApiResponse<MedicationsResponse>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}?${queryString.toString()}`
      );

      // Audit log for viewing medications list
      await auditService.log({
        action: AuditAction.VIEW_MEDICATIONS,
        resourceType: AuditResourceType.MEDICATION,
        status: AuditStatus.SUCCESS,
      });

      return response.data.data;
    } catch (error) {
      // Audit log for failed attempt
      await auditService.log({
        action: AuditAction.VIEW_MEDICATIONS,
        resourceType: AuditResourceType.MEDICATION,
        status: AuditStatus.FAILURE,
        context: { error: error.message },
      });
      throw createApiError(error, 'Failed to fetch medications');
    }
  }

  /**
   * Get medication by ID
   */
  async getById(id: string): Promise<Medication> {
    try {
      if (!id) throw new Error('Medication ID is required');

      const response = await this.client.get<ApiResponse<Medication>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/${id}`
      );

      await auditService.log({
        action: AuditAction.VIEW_MEDICATION,
        resourceType: AuditResourceType.MEDICATION,
        resourceId: id,
        status: AuditStatus.SUCCESS,
      });

      return response.data.data;
    } catch (error) {
      await auditService.log({
        action: AuditAction.VIEW_MEDICATION,
        resourceType: AuditResourceType.MEDICATION,
        resourceId: id,
        status: AuditStatus.FAILURE,
        context: { error: error.message },
      });
      throw createApiError(error, 'Failed to fetch medication');
    }
  }

  /**
   * Create new medication
   */
  async create(medicationData: CreateMedicationRequest): Promise<Medication> {
    try {
      createMedicationSchema.parse(medicationData);

      const response = await this.client.post<ApiResponse<{ medication: Medication }>>(
        API_ENDPOINTS.MEDICATIONS.BASE,
        medicationData
      );

      const medication = response.data.data.medication;

      await auditService.log({
        action: AuditAction.CREATE_MEDICATION,
        resourceType: AuditResourceType.MEDICATION,
        resourceId: medication.id,
        resourceIdentifier: medication.name,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          isControlled: medication.isControlled,
          dosageForm: medication.dosageForm,
        },
      });

      return medication;
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      await auditService.log({
        action: AuditAction.CREATE_MEDICATION,
        resourceType: AuditResourceType.MEDICATION,
        status: AuditStatus.FAILURE,
        context: { error: error.message },
      });
      throw createApiError(error, 'Failed to create medication');
    }
  }

  /**
   * Update medication
   */
  async update(id: string, medicationData: Partial<CreateMedicationRequest>): Promise<Medication> {
    try {
      if (!id) throw new Error('Medication ID is required');

      const response = await this.client.put<ApiResponse<Medication>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/${id}`,
        medicationData
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to update medication');
    }
  }

  /**
   * Delete medication
   */
  async delete(id: string): Promise<{ id: string }> {
    try {
      if (!id) throw new Error('Medication ID is required');

      const response = await this.client.delete<ApiResponse<{ id: string }>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/${id}`
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to delete medication');
    }
  }

  /**
   * Assign medication to student
   */
  async assignToStudent(assignmentData: StudentMedicationFormData): Promise<StudentMedication> {
    try {
      assignMedicationSchema.parse(assignmentData);

      const response = await this.client.post<ApiResponse<{ studentMedication: StudentMedication }>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/assign`,
        assignmentData
      );

      return response.data.data.studentMedication;
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw createApiError(error, 'Failed to assign medication');
    }
  }

  /**
   * Log medication administration
   * CRITICAL: This is a patient safety operation and must be audited
   */
  async logAdministration(logData: MedicationAdministrationData): Promise<MedicationLog> {
    try {
      logAdministrationSchema.parse(logData);

      const response = await this.client.post<ApiResponse<{ medicationLog: MedicationLog }>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/administration`,
        logData
      );

      const medicationLog = response.data.data.medicationLog;

      // CRITICAL: Immediate audit log for medication administration
      await auditService.log({
        action: AuditAction.ADMINISTER_MEDICATION,
        resourceType: AuditResourceType.MEDICATION_LOG,
        resourceId: medicationLog.id,
        // Note: studentId is available through medicationLog.studentMedication relation if needed
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          dosageGiven: logData.dosageGiven,
          timeGiven: logData.timeGiven,
          studentMedicationId: logData.studentMedicationId,
          hasSideEffects: !!logData.sideEffects,
        },
      });

      return medicationLog;
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      // CRITICAL: Log failed administration attempt
      await auditService.log({
        action: AuditAction.ADMINISTER_MEDICATION,
        resourceType: AuditResourceType.MEDICATION_LOG,
        status: AuditStatus.FAILURE,
        isPHI: true,
        context: {
          error: error.message,
          studentMedicationId: logData.studentMedicationId,
        },
      });
      throw createApiError(error, 'Failed to log administration');
    }
  }

  /**
   * Get administration logs for a student
   */
  async getStudentLogs(studentId: string, page: number = 1, limit: number = 20): Promise<StudentMedicationsResponse> {
    try {
      if (!studentId) throw new Error('Student ID is required');

      const response = await this.client.get<ApiResponse<StudentMedicationsResponse>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/logs/${studentId}?page=${page}&limit=${limit}`
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch administration logs');
    }
  }

  /**
   * Get medication inventory with alerts
   */
  async getInventory(): Promise<InventoryResponse> {
    try {
      const response = await this.client.get<ApiResponse<InventoryResponse>>(
        API_ENDPOINTS.MEDICATIONS.INVENTORY
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch inventory');
    }
  }

  /**
   * Add medication to inventory
   */
  async addToInventory(inventoryData: CreateInventoryRequest): Promise<InventoryItem> {
    try {
      const response = await this.client.post<ApiResponse<{ inventory: InventoryItem }>>(
        API_ENDPOINTS.MEDICATIONS.INVENTORY,
        inventoryData
      );

      return response.data.data.inventory;
    } catch (error) {
      throw createApiError(error, 'Failed to add to inventory');
    }
  }

  /**
   * Update inventory quantity
   */
  async updateInventoryQuantity(id: string, updateData: UpdateInventoryRequest): Promise<InventoryItem> {
    try {
      if (!id) throw new Error('Inventory ID is required');

      const response = await this.client.put<ApiResponse<{ inventory: InventoryItem }>>(
        `${API_ENDPOINTS.MEDICATIONS.INVENTORY}/${id}`,
        updateData
      );

      return response.data.data.inventory;
    } catch (error) {
      throw createApiError(error, 'Failed to update inventory');
    }
  }

  /**
   * Get medication schedule for a date range
   */
  async getSchedule(startDate?: string, endDate?: string, nurseId?: string): Promise<StudentMedication[]> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (nurseId) params.append('nurseId', nurseId);

      const response = await this.client.get<ApiResponse<MedicationScheduleResponse>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/schedule?${params.toString()}`
      );

      return response.data.data.schedule;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch schedule');
    }
  }

  /**
   * Get medication reminders for a specific date
   */
  async getReminders(date?: string): Promise<MedicationReminder[]> {
    try {
      const params = date ? `?date=${date}` : '';

      const response = await this.client.get<ApiResponse<{ reminders: MedicationReminder[] }>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/reminders${params}`
      );

      return response.data.data.reminders;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch reminders');
    }
  }

  /**
   * Report adverse reaction
   * CRITICAL: Patient safety event that must be immediately audited
   */
  async reportAdverseReaction(reactionData: AdverseReactionData): Promise<AdverseReaction> {
    try {
      const response = await this.client.post<ApiResponse<{ report: AdverseReaction }>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/adverse-reaction`,
        reactionData
      );

      const report = response.data.data.report;

      // CRITICAL: Immediate audit log for adverse reaction
      await auditService.log({
        action: AuditAction.REPORT_ADVERSE_REACTION,
        resourceType: AuditResourceType.ADVERSE_REACTION,
        resourceId: report.id,
        studentId: report.studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          severity: reactionData.severity,
          studentMedicationId: reactionData.studentMedicationId,
          reportedAt: reactionData.reportedAt,
        },
      });

      return report;
    } catch (error) {
      // CRITICAL: Log failed adverse reaction report
      await auditService.log({
        action: AuditAction.REPORT_ADVERSE_REACTION,
        resourceType: AuditResourceType.ADVERSE_REACTION,
        status: AuditStatus.FAILURE,
        isPHI: true,
        context: {
          error: error.message,
          severity: reactionData.severity,
          studentMedicationId: reactionData.studentMedicationId,
        },
      });
      throw createApiError(error, 'Failed to report adverse reaction');
    }
  }

  /**
   * Get adverse reactions
   */
  async getAdverseReactions(medicationId?: string, studentId?: string): Promise<AdverseReaction[]> {
    try {
      const params = new URLSearchParams();
      if (medicationId) params.append('medicationId', medicationId);
      if (studentId) params.append('studentId', studentId);

      const response = await this.client.get<ApiResponse<{ reactions: AdverseReaction[] }>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/adverse-reactions?${params.toString()}`
      );

      return response.data.data.reactions;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch adverse reactions');
    }
  }

  /**
   * Deactivate student medication
   */
  async deactivateStudentMedication(studentMedicationId: string, reason?: string): Promise<StudentMedication> {
    try {
      if (!studentMedicationId) throw new Error('Student medication ID is required');

      const response = await this.client.put<ApiResponse<{ studentMedication: StudentMedication }>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/student-medication/${studentMedicationId}/deactivate`,
        { reason }
      );

      return response.data.data.studentMedication;
    } catch (error) {
      throw createApiError(error, 'Failed to deactivate medication');
    }
  }

  /**
   * Get medication statistics
   */
  async getStats(): Promise<MedicationStats> {
    try {
      const response = await this.client.get<ApiResponse<MedicationStats>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/stats`
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch statistics');
    }
  }

  /**
   * Get medication alerts
   */
  async getAlerts(): Promise<MedicationAlertsResponse> {
    try {
      const response = await this.client.get<ApiResponse<MedicationAlertsResponse>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/alerts`
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch alerts');
    }
  }

  /**
   * Get medication form options
   */
  async getFormOptions(): Promise<MedicationFormOptions> {
    try {
      const response = await this.client.get<ApiResponse<MedicationFormOptions>>(
        `${API_ENDPOINTS.MEDICATIONS.BASE}/form-options`
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch form options');
    }
  }
}

// Factory function for creating MedicationsApi instances
export function createMedicationsApi(client: ApiClient): MedicationsApi {
  return new MedicationsApi(client);
}

// Export singleton instance
import { apiClient } from '../core/ApiClient';
export const medicationsApi = createMedicationsApi(apiClient);
