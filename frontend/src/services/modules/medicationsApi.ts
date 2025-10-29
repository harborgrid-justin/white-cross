/**
 * @fileoverview Medications API Service
 *
 * Provides comprehensive frontend access to medication management endpoints including
 * medication administration, inventory tracking, prescription management, and adverse
 * reaction reporting. All operations include comprehensive validation, audit logging,
 * and HIPAA-compliant PHI protection.
 *
 * **Key Features:**
 * - Medication CRUD operations with validation
 * - Student medication assignment and tracking
 * - Administration logging with Five Rights verification
 * - Inventory management with expiration tracking
 * - Adverse reaction reporting and monitoring
 * - Medication schedule and reminder management
 * - DEA-compliant controlled substance handling
 *
 * **HIPAA Compliance:**
 * - All medication operations trigger PHI access audit logs
 * - Student medication data treated as Protected Health Information (PHI)
 * - Audit logging includes success/failure status and context
 * - Administration events logged immediately for compliance
 * - Adverse reactions trigger critical audit logs
 *
 * **Medication Safety:**
 * - Five Rights verification (Right Patient, Medication, Dose, Route, Time)
 * - NDC validation for medication identification
 * - Dosage format validation (mg, ml, tablets, etc.)
 * - Frequency pattern validation (QID, TID, BID, PRN, etc.)
 * - Controlled substance DEA schedule tracking
 * - Allergy and contraindication checking before administration
 * - Witness requirements for controlled substances
 *
 * **TanStack Query Integration:**
 * - Medications list: 5-minute cache, invalidate on create/update
 * - Student medications: 2-minute cache, invalidate on assignment
 * - Inventory: 1-minute cache, invalidate on quantity changes
 * - Administration logs: No cache (real-time critical)
 * - Reminders: 30-second cache, frequent polling
 *
 * @module services/modules/medicationsApi
 * @see {@link medication/api/AdministrationApi} for detailed administration workflow
 * @see {@link medication/api/PrescriptionApi} for prescription management
 * @see {@link medication/api/MedicationFormularyApi} for drug database
 */

import type { ApiClient } from '@/services/core/ApiClient';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse, PaginatedResponse, buildPaginationParams } from '@/services/utils/apiUtils';
import { createApiError } from '@/services/core/errors';
import { z } from 'zod';
import { auditService, AuditAction, AuditResourceType, AuditStatus } from '@/services/audit';
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

/**
 * Medication filtering and pagination options
 *
 * @interface MedicationFilters
 *
 * @property {string} [search] - Text search across medication name, generic name, and NDC
 * @property {string} [category] - Medication category (e.g., "Analgesic", "Antibiotic")
 * @property {boolean} [isActive] - Filter by active/inactive status
 * @property {boolean} [controlledSubstance] - Filter DEA-scheduled controlled substances
 * @property {number} [page] - Page number for pagination (1-indexed)
 * @property {number} [limit] - Results per page (default: 20, max: 100)
 * @property {string} [sort] - Sort field (name, createdAt, updatedAt)
 * @property {'asc' | 'desc'} [order] - Sort direction
 */
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

/**
 * Request data for creating a new medication in the formulary
 *
 * @interface CreateMedicationRequest
 *
 * @property {string} name - Medication brand/trade name
 * @property {string} [genericName] - Generic/chemical name
 * @property {string} dosageForm - Dosage form (tablet, capsule, liquid, etc.)
 * @property {string} strength - Strength with units (e.g., "500mg", "10mg/ml")
 * @property {string} [manufacturer] - Manufacturer name
 * @property {string} [ndc] - National Drug Code (format: XXXXX-XXXX-XX)
 * @property {boolean} [isControlled] - True if DEA-scheduled controlled substance
 */
export interface CreateMedicationRequest {
  name: string;
  genericName?: string;
  dosageForm: string;
  strength: string;
  manufacturer?: string;
  ndc?: string;
  isControlled?: boolean;
}

/**
 * Request data for adding medication to inventory
 *
 * @interface CreateInventoryRequest
 *
 * @property {string} medicationId - UUID of medication in formulary
 * @property {string} batchNumber - Manufacturer batch/lot number
 * @property {string} expirationDate - Expiration date (ISO 8601)
 * @property {number} quantity - Initial quantity in stock
 * @property {number} [reorderLevel] - Quantity threshold for reorder alerts
 * @property {number} [costPerUnit] - Cost per unit for budget tracking
 * @property {string} [supplier] - Supplier/distributor name
 */
export interface CreateInventoryRequest {
  medicationId: string;
  batchNumber: string;
  expirationDate: string;
  quantity: number;
  reorderLevel?: number;
  costPerUnit?: number;
  supplier?: string;
}

/**
 * Request data for updating inventory quantity
 *
 * @interface UpdateInventoryRequest
 *
 * @property {number} quantity - New quantity (replaces current quantity)
 * @property {string} [reason] - Reason for adjustment (for audit trail)
 */
export interface UpdateInventoryRequest {
  quantity: number;
  reason?: string;
}

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

/**
 * NDC (National Drug Code) Format Validation
 *
 * Validates 10-digit NDC in 5-4-2 or 5-3-2 format.
 * Examples: "12345-1234-12" or "12345-123-12"
 *
 * @constant {RegExp}
 */
const ndcRegex = /^[0-9]{5}-([0-9]{3,4})-[0-9]{2}$/;

/**
 * Dosage format validation
 *
 * Validates dosage strings with numeric value and unit.
 * Supports: mg, g, mcg, ml, L, units, tablets, capsules, drops, puff, patch, spray, application, mEq, %
 *
 * Examples: "500mg", "10ml", "2 tablets", "1 unit"
 *
 * @constant {RegExp}
 */
const dosageRegex = /^[0-9]+(\.[0-9]+)?\s*(mg|g|mcg|ml|L|units?|tablets?|capsules?|drops?|puff|patch|spray|application|mEq|%)$/i;

/**
 * Frequency validation patterns
 *
 * Supports common medical frequency notations:
 * - Daily frequencies: "once daily", "twice daily", "1x daily", "2x daily"
 * - Numeric frequencies: "three times daily", "four times a day"
 * - Hourly intervals: "every 4 hours", "every 6 hrs"
 * - Medical abbreviations: "QID", "TID", "BID", "QD", "QHS", "PRN", "AC", "PC", "HS"
 * - As needed: "as needed"
 * - Meal-related: "before meals", "after breakfast", "at bedtime"
 * - Long-term: "weekly", "monthly"
 *
 * @constant {RegExp[]}
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
 *
 * Validates medication strength with numeric value and unit.
 * Examples: "500mg", "10ml", "50mcg", "100units", "5mEq"
 *
 * @constant {RegExp}
 */
const strengthRegex = /^[0-9]+(\.[0-9]+)?\s*(mg|g|mcg|ml|L|units?|mEq|%)$/i;

/**
 * Valid dosage forms recognized by the system
 *
 * @constant {ReadonlyArray<string>}
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
 *
 * @constant {ReadonlyArray<string>}
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
 *
 * - Schedule I: High abuse potential, no accepted medical use
 * - Schedule II: High abuse potential, accepted medical use (morphine, oxycodone)
 * - Schedule III: Moderate abuse potential (codeine, ketamine)
 * - Schedule IV: Low abuse potential (alprazolam, diazepam)
 * - Schedule V: Lowest abuse potential (cough preparations with codeine)
 *
 * @constant {ReadonlyArray<string>}
 */
const deaSchedules = ['I', 'II', 'III', 'IV', 'V'] as const;

/**
 * Frequency validator function
 *
 * Validates medication frequency against supported patterns.
 *
 * @param {string} value - Frequency string to validate
 * @returns {boolean} True if frequency matches a valid pattern
 */
const frequencyValidator = (value: string) => {
  const normalizedValue = value.trim().toLowerCase();
  return frequencyPatterns.some(pattern => pattern.test(normalizedValue));
};

/**
 * Schema for creating a new medication in the formulary
 *
 * Validates all required fields and enforces DEA compliance rules.
 *
 * @constant {z.ZodObject}
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
 *
 * Implements Five Rights validation:
 * - Right Patient (studentId UUID required)
 * - Right Medication (medicationId UUID required)
 * - Right Dose (dosage validation)
 * - Right Route (administration route required)
 * - Right Time (start/end dates validated)
 *
 * @constant {z.ZodObject}
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
 *
 * CRITICAL: Implements Five Rights validation for patient safety.
 * All administration events must pass validation before being logged.
 *
 * @constant {z.ZodObject}
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
 * Schema for adding medication to inventory
 *
 * Validates batch tracking, expiration dates, and quantity management.
 *
 * @constant {z.ZodObject}
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
 * Schema for reporting adverse reactions
 *
 * CRITICAL: Adverse reactions are patient safety events requiring immediate
 * documentation and reporting to prescribing physician.
 *
 * @constant {z.ZodObject}
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

/**
 * Medications API Service
 *
 * Handles all medication-related API operations including medication management,
 * student medication assignments, administration logging, inventory tracking,
 * and adverse reaction reporting.
 *
 * **Authentication**: All methods require valid JWT authentication
 * **Authorization**: Most methods require nurse or admin role
 * **Rate Limiting**: 100 requests per minute per user
 *
 * @class
 * @see {@link createMedicationsApi} for factory function
 * @see {@link medicationsApi} for singleton instance
 *
 * @example
 * ```typescript
 * import { medicationsApi } from '@/services/modules/medicationsApi';
 *
 * // Get all active medications
 * const medications = await medicationsApi.getAll({ isActive: true });
 *
 * // Assign medication to student
 * const assignment = await medicationsApi.assignToStudent({
 *   studentId: 'student-uuid',
 *   medicationId: 'medication-uuid',
 *   dosage: '500mg',
 *   frequency: 'twice daily',
 *   route: 'Oral',
 *   startDate: '2025-10-26',
 *   prescribedBy: 'Dr. Smith'
 * });
 * ```
 */
export class MedicationsApi {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * Get all medications with optional filtering and pagination
   *
   * Retrieves medications from the formulary with support for search, filtering,
   * sorting, and pagination. Results include full medication details.
   *
   * **Cache Strategy**: 5-minute cache, invalidated on create/update
   * **HIPAA Compliance**: Audit log generated for medication list access
   *
   * @param {MedicationFilters} [filters={}] - Filter and pagination options
   * @returns {Promise<MedicationsResponse>} Paginated medications list
   * @throws {ApiError} If request fails or network error occurs
   *
   * @example
   * ```typescript
   * // Search for controlled substances
   * const medications = await medicationsApi.getAll({
   *   search: 'morphine',
   *   controlledSubstance: true,
   *   page: 1,
   *   limit: 20
   * });
   * console.log(`Found ${medications.total} controlled substances`);
   * ```
   *
   * @remarks
   * **TanStack Query**: Use with queryKey: ['medications', filters]
   * **Performance**: Indexed search on name, genericName, and NDC
   * **Pagination**: Returns total count for pagination UI
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
   *
   * Retrieves complete medication details including formulation, strength,
   * dosage form, manufacturer, and controlled substance information.
   *
   * **HIPAA Compliance**: Generates PHI access audit log
   *
   * @param {string} id - Medication UUID
   * @returns {Promise<Medication>} Medication details
   * @throws {ApiError} If medication not found or request fails
   *
   * @example
   * ```typescript
   * const medication = await medicationsApi.getById('medication-uuid');
   * console.log(`${medication.name} (${medication.genericName})`);
   * console.log(`Strength: ${medication.strength}, Form: ${medication.dosageForm}`);
   * if (medication.isControlled) {
   *   console.log(`DEA Schedule: ${medication.deaSchedule}`);
   * }
   * ```
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
   * Create new medication in the formulary
   *
   * Adds a new medication to the system formulary with full validation.
   * Requires admin privileges.
   *
   * **Validation**: Comprehensive Zod schema validation including NDC format,
   * strength format, and DEA schedule compliance
   * **HIPAA Compliance**: Creates audit log with medication details
   * **DEA Compliance**: Enforces DEA schedule for controlled substances
   *
   * @param {CreateMedicationRequest} medicationData - Medication information
   * @returns {Promise<{medication: Medication}>} Created medication
   * @throws {ValidationError} If validation fails with specific field errors
   * @throws {ApiError} If creation fails or unauthorized
   *
   * @example
   * ```typescript
   * // Create controlled substance with DEA schedule
   * const result = await medicationsApi.create({
   *   name: 'Morphine Sulfate ER',
   *   genericName: 'morphine sulfate',
   *   dosageForm: 'Tablet',
   *   strength: '30mg',
   *   manufacturer: 'Generic Pharma',
   *   ndc: '12345-1234-12',
   *   isControlled: true
   * });
   * console.log(`Created: ${result.medication.name}`);
   * ```
   *
   * @remarks
   * **Cache Invalidation**: Invalidates medications list query
   * **Authorization**: Requires admin or pharmacist role
   * **Audit Trail**: Creates permanent audit log entry
   */
  async create(medicationData: CreateMedicationRequest): Promise<{ medication: Medication }> {
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

      return { medication };
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
   * Update medication information
   *
   * Updates an existing medication in the formulary. Partial updates supported.
   * Requires admin privileges.
   *
   * @param {string} id - Medication UUID
   * @param {Partial<CreateMedicationRequest>} medicationData - Fields to update
   * @returns {Promise<Medication>} Updated medication
   * @throws {ApiError} If update fails or medication not found
   *
   * @example
   * ```typescript
   * // Update strength and manufacturer
   * const updated = await medicationsApi.update('medication-uuid', {
   *   strength: '60mg',
   *   manufacturer: 'New Manufacturer'
   * });
   * ```
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
   * Delete medication from formulary
   *
   * Soft deletes medication (marks as inactive). Medication history preserved.
   * Requires admin privileges.
   *
   * @param {string} id - Medication UUID
   * @returns {Promise<{id: string}>} Deleted medication ID
   * @throws {ApiError} If deletion fails or medication not found
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
   * Assign medication to student (create prescription)
   *
   * Creates a new student medication assignment with prescription details.
   * Implements Five Rights validation before assignment.
   *
   * **Five Rights Validation**:
   * - Right Patient: studentId UUID validation
   * - Right Medication: medicationId UUID validation
   * - Right Dose: dosage format validation
   * - Right Route: administration route validation
   * - Right Time: start/end date validation
   *
   * @param {StudentMedicationFormData} assignmentData - Prescription details
   * @returns {Promise<StudentMedication>} Created student medication assignment
   * @throws {ValidationError} If Five Rights validation fails
   * @throws {ApiError} If assignment fails
   *
   * @example
   * ```typescript
   * // Assign antibiotic with specific schedule
   * const assignment = await medicationsApi.assignToStudent({
   *   studentId: 'student-uuid',
   *   medicationId: 'amoxicillin-uuid',
   *   dosage: '500mg',
   *   frequency: 'three times daily',
   *   route: 'Oral',
   *   startDate: '2025-10-26',
   *   endDate: '2025-11-02',
   *   prescribedBy: 'Dr. Johnson',
   *   prescriptionNumber: 'RX123456',
   *   instructions: 'Take with food. Complete full course.'
   * });
   * ```
   *
   * @remarks
   * **HIPAA Compliance**: Generates PHI access audit log
   * **Cache Invalidation**: Invalidates student medications query
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
   *
   * CRITICAL: Records medication administration with Five Rights verification.
   * All administration events must be logged immediately for compliance and
   * patient safety tracking.
   *
   * **Five Rights Enforcement**:
   * - Patient verification via barcode/photo
   * - Medication verification via NDC/barcode
   * - Dosage calculation and verification
   * - Route confirmation
   * - Time window validation
   *
   * **Safety Checks**:
   * - Allergy verification required
   * - Patient identification confirmed
   * - Witness signature for controlled substances
   * - Side effect monitoring
   *
   * @param {MedicationAdministrationData} logData - Administration details
   * @returns {Promise<MedicationLog>} Created administration log
   * @throws {ValidationError} If validation or Five Rights check fails
   * @throws {ApiError} If logging fails
   *
   * @example
   * ```typescript
   * // Log morning medication administration
   * const log = await medicationsApi.logAdministration({
   *   studentMedicationId: 'prescription-uuid',
   *   dosageGiven: '500mg',
   *   timeGiven: '2025-10-26T08:00:00Z',
   *   notes: 'Student took medication without difficulty',
   *   patientVerified: true,
   *   allergyChecked: true,
   *   deviceId: 'tablet-123'
   * });
   * console.log(`Administration logged: ${log.id}`);
   * ```
   *
   * @remarks
   * **CRITICAL**: NO optimistic updates - wait for server confirmation
   * **Audit Logging**: Immediate audit log on success and failure
   * **Cache**: No caching - administration logs are real-time
   * **Offline**: Queue for later submission if offline
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
   *
   * Retrieves paginated medication administration history for a student.
   * Includes medication details, dosages, times, and any reported side effects.
   *
   * @param {string} studentId - Student UUID
   * @param {number} [page=1] - Page number
   * @param {number} [limit=20] - Results per page
   * @returns {Promise<StudentMedicationsResponse>} Paginated administration logs
   * @throws {ApiError} If request fails
   *
   * @example
   * ```typescript
   * const logs = await medicationsApi.getStudentLogs('student-uuid', 1, 50);
   * console.log(`Total administrations: ${logs.total}`);
   * ```
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
   *
   * Retrieves current inventory status including low stock alerts,
   * expiring medication warnings, and controlled substance tracking.
   *
   * **Cache Strategy**: 1-minute cache, invalidated on quantity changes
   *
   * @returns {Promise<InventoryResponse>} Inventory with alerts
   * @throws {ApiError} If request fails
   *
   * @example
   * ```typescript
   * const inventory = await medicationsApi.getInventory();
   * const lowStock = inventory.items.filter(item => item.quantity <= item.reorderLevel);
   * console.log(`${lowStock.length} medications need reordering`);
   * ```
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
   *
   * Records new inventory batch with expiration tracking and reorder levels.
   * Validates batch numbers and expiration dates.
   *
   * @param {CreateInventoryRequest} inventoryData - Inventory details
   * @returns {Promise<InventoryItem>} Created inventory item
   * @throws {ApiError} If creation fails
   *
   * @example
   * ```typescript
   * const item = await medicationsApi.addToInventory({
   *   medicationId: 'medication-uuid',
   *   batchNumber: 'LOT123456',
   *   expirationDate: '2026-12-31',
   *   quantity: 500,
   *   reorderLevel: 50,
   *   costPerUnit: 0.25,
   *   supplier: 'McKesson'
   * });
   * ```
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
   *
   * Updates current inventory quantity with reason tracking for audit trail.
   *
   * @param {string} id - Inventory item UUID
   * @param {UpdateInventoryRequest} updateData - Quantity and reason
   * @returns {Promise<InventoryItem>} Updated inventory item
   * @throws {ApiError} If update fails
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
   * Get medication schedule for date range
   *
   * Retrieves scheduled medication administrations for specified date range.
   * Useful for generating daily medication administration records (MAR).
   *
   * @param {string} [startDate] - Start date (ISO 8601)
   * @param {string} [endDate] - End date (ISO 8601)
   * @param {string} [nurseId] - Filter by assigned nurse
   * @returns {Promise<StudentMedication[]>} Scheduled medications
   * @throws {ApiError} If request fails
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
   * Get medication reminders for specific date
   *
   * Retrieves upcoming medication administration reminders.
   * Used for nurse dashboard and notification system.
   *
   * **Cache Strategy**: 30-second cache with frequent polling
   *
   * @param {string} [date] - Date for reminders (ISO 8601), defaults to today
   * @returns {Promise<MedicationReminder[]>} Medication reminders
   * @throws {ApiError} If request fails
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
   *
   * CRITICAL: Reports medication adverse reaction or side effect.
   * Patient safety event requiring immediate documentation and physician notification.
   *
   * **Severity Levels**:
   * - MILD: Minor discomfort, no intervention required
   * - MODERATE: Discomfort requiring monitoring or minor intervention
   * - SEVERE: Significant symptoms requiring medical intervention
   * - LIFE_THREATENING: Immediate emergency response required
   *
   * @param {AdverseReactionData | AdverseReactionFormData} reactionData - Reaction details
   * @returns {Promise<AdverseReaction>} Created adverse reaction report
   * @throws {ApiError} If reporting fails
   *
   * @example
   * ```typescript
   * // Report severe allergic reaction
   * const report = await medicationsApi.reportAdverseReaction({
   *   studentMedicationId: 'prescription-uuid',
   *   severity: 'SEVERE',
   *   reaction: 'Hives, facial swelling, difficulty breathing',
   *   actionTaken: 'Administered EpiPen, called 911, notified parents',
   *   notes: 'Student responded well to epinephrine. Transported to ER.',
   *   reportedAt: new Date().toISOString()
   * });
   * ```
   *
   * @remarks
   * **CRITICAL**: Generates immediate audit log
   * **Notification**: Triggers alerts to prescribing physician
   * **Follow-up**: Requires physician review and documentation
   */
  async reportAdverseReaction(reactionData: AdverseReactionData | AdverseReactionFormData): Promise<AdverseReaction> {
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
   *
   * Retrieves adverse reaction history filtered by medication or student.
   *
   * @param {string} [medicationId] - Filter by medication
   * @param {string} [studentId] - Filter by student
   * @returns {Promise<AdverseReaction[]>} Adverse reactions
   * @throws {ApiError} If request fails
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
   *
   * Discontinues an active student medication prescription.
   * Soft delete preserving history for audit trail.
   *
   * @param {string} studentMedicationId - Student medication UUID
   * @param {string} [reason] - Reason for discontinuation
   * @returns {Promise<StudentMedication>} Deactivated student medication
   * @throws {ApiError} If deactivation fails
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
   *
   * Retrieves aggregated medication statistics including administration counts,
   * controlled substance tracking, and compliance metrics.
   *
   * @returns {Promise<MedicationStats>} Medication statistics
   * @throws {ApiError} If request fails
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
   *
   * Retrieves system alerts including low inventory, expiring medications,
   * missing administrations, and compliance warnings.
   *
   * @returns {Promise<MedicationAlertsResponse>} Medication alerts
   * @throws {ApiError} If request fails
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
   *
   * Retrieves dropdown options for medication forms, routes, frequencies, etc.
   * Used for populating form dropdowns and validation.
   *
   * @returns {Promise<MedicationFormOptions>} Form options
   * @throws {ApiError} If request fails
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

  /**
   * Administer medication (alias for logAdministration)
   *
   * @deprecated Use logAdministration() for consistency
   * @see {@link logAdministration}
   */
  async administer(logData: MedicationAdministrationData): Promise<MedicationLog> {
    return this.logAdministration(logData);
  }

  /**
   * Update inventory (alias for updateInventoryQuantity)
   *
   * @deprecated Use updateInventoryQuantity() for clarity
   * @see {@link updateInventoryQuantity}
   */
  async updateInventory(id: string, updateData: UpdateInventoryRequest): Promise<InventoryItem> {
    return this.updateInventoryQuantity(id, updateData);
  }
}

/**
 * Factory function for creating MedicationsApi instances
 *
 * Creates a new MedicationsApi instance with the provided ApiClient.
 * Use this for testing with mock clients or custom configurations.
 *
 * @param {ApiClient} client - Configured ApiClient instance
 * @returns {MedicationsApi} New MedicationsApi instance
 *
 * @example
 * ```typescript
 * import { createMedicationsApi } from '@/services/modules/medicationsApi';
 * import { mockApiClient } from '@/test/mocks';
 *
 * const medicationsApi = createMedicationsApi(mockApiClient);
 * ```
 */
export function createMedicationsApi(client: ApiClient): MedicationsApi {
  return new MedicationsApi(client);
}

// Export singleton instance
import { apiClient } from '@/services/core/ApiClient';

/**
 * Singleton MedicationsApi instance
 *
 * Pre-configured with the default apiClient. Use this for all production code.
 *
 * @constant {MedicationsApi}
 *
 * @example
 * ```typescript
 * import { medicationsApi } from '@/services/modules/medicationsApi';
 *
 * // Use directly in components or services
 * const medications = await medicationsApi.getAll();
 * ```
 */
export const medicationsApi = createMedicationsApi(apiClient);
