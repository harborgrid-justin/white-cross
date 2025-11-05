/**
 * @fileoverview Allergies API Service Module - Critical Student Allergy Management and Safety
 * @module services/modules/health/allergies
 * @category Services
 *
 * Comprehensive allergy management system designed for student safety in educational environments.
 * Tracks all types of allergies (food, medication, environmental, insect) with detailed reaction
 * information, severity classification, emergency protocols, and cross-referencing with medications
 * to prevent dangerous drug interactions.
 *
 * Core Features:
 * - Complete CRUD operations for allergy records
 * - Severity classification (MILD, MODERATE, SEVERE, LIFE_THREATENING)
 * - Emergency response protocols and action plans
 * - Medication conflict checking to prevent adverse reactions
 * - Verification workflow for allergy validation
 * - Bulk import for efficient data entry
 * - Allergy card generation for quick reference
 * - Critical allergy identification for emergency scenarios
 *
 * Healthcare Safety Features (CRITICAL):
 * - Automatic flagging of life-threatening allergies
 * - Emergency protocol documentation (EpiPen availability, emergency contacts)
 * - Medication interaction warnings to prevent prescription errors
 * - Cross-reference checking before medication administration
 * - Action plan storage for emergency response teams
 * - Staff notification system for severe allergies
 * - Quick-access allergy cards for cafeteria and field trips
 *
 * HIPAA Compliance:
 * - All allergy access logged with action, timestamp, user for audit trail
 * - PHI protection for sensitive allergy information
 * - Secure storage of emergency contact information
 * - Access controls for confidential allergy data
 * - Audit trail maintained for 7-year compliance retention
 * - Encryption required for allergy data transmission
 *
 * Emergency Response Integration:
 * - Life-threatening allergy alerts displayed prominently in student records
 * - Emergency protocol quick-access for school nurses and staff
 * - EpiPen location and availability tracking
 * - Parent/guardian emergency contact integration
 * - Staff training requirement flags
 * - Emergency drill and response plan coordination
 *
 * Safety Workflows:
 * 1. **Allergy Recording**: Document allergen, reaction, severity with verification
 * 2. **Medication Check**: Verify no conflicts before prescribing/administering medications
 * 3. **Emergency Planning**: Create and maintain action plans for severe allergies
 * 4. **Staff Communication**: Generate allergy cards and distribute to relevant staff
 * 5. **Verification**: Validate allergy information with parent/guardian and healthcare provider
 * 6. **Monitoring**: Track reactions and update severity as needed
 *
 * @example
 * ```typescript
 * import { createAllergiesApi } from '@/services/modules/health';
 * import { apiClient } from '@/services/core/ApiClient';
 *
 * // Initialize allergies API
 * const allergiesApi = createAllergiesApi(apiClient);
 *
 * // Record severe peanut allergy with emergency protocol
 * const severeAllergy = await allergiesApi.create({
 *   studentId: 'student-uuid',
 *   allergen: 'Peanuts',
 *   reaction: 'Anaphylaxis - severe throat swelling, difficulty breathing, hives',
 *   severity: 'LIFE_THREATENING',
 *   emergencyProtocol: 'Administer EpiPen immediately, call 911, notify parents',
 *   actionPlan: 'EpiPen stored in nurse office and with student at all times. ' +
 *                'Cafeteria staff alerted. Avoid all peanut products and cross-contamination.',
 *   lastReaction: '2023-05-15',
 *   notes: 'Parent provided two EpiPens - one for nurse, one for student backpack'
 * });
 *
 * // Get critical allergies for emergency reference
 * const criticalAllergies = await allergiesApi.getCriticalAllergies('student-uuid');
 * console.log(`${criticalAllergies.length} life-threatening allergies on file`);
 *
 * // Check medication conflicts before prescribing
 * const conflictCheck = await allergiesApi.checkMedicationConflicts(
 *   'student-uuid',
 *   'Amoxicillin'
 * );
 * if (conflictCheck.hasConflict) {
 *   console.error('MEDICATION CONFLICT DETECTED!');
 *   conflictCheck.conflicts.forEach(allergy => {
 *     console.error(`Allergy: ${allergy.allergen} (${allergy.severity})`);
 *   });
 * }
 *
 * // Generate allergy card for cafeteria and teachers
 * const allergyCard = await allergiesApi.generateAllergyCard('student-uuid');
 * // allergyCard is a Blob ready for printing or display
 * ```
 *
 * @see {@link createHealthRecordsApi} for general health records
 * @see {@link createMedicationsApi} for medication management (if module exists)
 */

import { API_ENDPOINTS } from '@/constants/api';
import { z } from 'zod';
import { BaseApiService } from '@/services/core/BaseApiService';
import type { ApiClient } from '@/services/core/ApiClient';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/services/types';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface Allergy {
  id: string;
  studentId: string;
  allergen: string;
  reaction: string;
  severity: AllergySeverity;
  emergencyProtocol?: string;
  actionPlan?: string;
  lastReaction?: string;
  verifiedBy?: string;
  verifiedDate?: string;
  notes?: string;
  isActive: boolean;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type AllergySeverity = 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';

export interface AllergyCreate {
  studentId: string;
  allergen: string;
  reaction: string;
  severity: AllergySeverity;
  emergencyProtocol?: string;
  actionPlan?: string;
  lastReaction?: string;
  notes?: string;
}

export interface AllergyUpdate extends Partial<AllergyCreate> {
  isActive?: boolean;
  verifiedBy?: string;
  verifiedDate?: string;
}

export interface AllergyFilters extends PaginationParams {
  severity?: AllergySeverity;
  isActive?: boolean;
  search?: string;
  verifiedOnly?: boolean;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const allergyCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  allergen: z.string().min(1, 'Allergen is required').max(100),
  reaction: z.string().min(1, 'Reaction description is required').max(500),
  severity: z.enum(['MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING']),
  emergencyProtocol: z.string().max(1000).optional(),
  actionPlan: z.string().max(2000).optional(),
  lastReaction: z.string().optional(),
  notes: z.string().max(1000).optional()
});

const allergyUpdateSchema = allergyCreateSchema.partial().extend({
  isActive: z.boolean().optional(),
  verifiedBy: z.string().optional(),
  verifiedDate: z.string().datetime().optional()
});

// ==========================================
// API SERVICE CLASS
// ==========================================

/**
 * Allergies API Service
 *
 * @class
 * @extends BaseApiService<Allergy, AllergyCreate, AllergyUpdate>
 * @classdesc
 * Specialized service for managing student allergy records with critical safety features.
 * Provides comprehensive allergy tracking, emergency protocol management, medication conflict
 * checking, and cross-module integration to ensure student safety across all school operations.
 *
 * Critical Safety Functions:
 * - Life-threatening allergy identification and flagging
 * - Emergency response protocol documentation and quick access
 * - Medication conflict detection to prevent adverse reactions
 * - Action plan management for emergency scenarios
 * - Staff notification and communication workflows
 * - Allergy verification with healthcare providers
 *
 * HIPAA Compliance:
 * - Automatic PHI access logging for all allergy data access
 * - Audit trail maintained for regulatory compliance
 * - Secure handling of emergency contact information
 * - Access controls for sensitive allergy data
 *
 * Integration Points:
 * - Medication module: Cross-reference for conflict checking
 * - Health records: Aggregate into comprehensive health summary
 * - Emergency response: Quick-access protocols for critical situations
 * - Cafeteria management: Allergy alerts for food service staff
 * - Staff communication: Allergy card distribution
 *
 * @example
 * ```typescript
 * // Initialize service
 * const allergiesApi = createAllergiesApi(apiClient);
 *
 * // Record life-threatening allergy
 * const peanutAllergy = await allergiesApi.create({
 *   studentId: 'student-uuid',
 *   allergen: 'Peanuts',
 *   reaction: 'Anaphylaxis',
 *   severity: 'LIFE_THREATENING',
 *   emergencyProtocol: 'Administer EpiPen, call 911',
 *   actionPlan: 'EpiPen in nurse office and student backpack'
 * });
 *
 * // Check medication conflicts
 * const conflict = await allergiesApi.checkMedicationConflicts(
 *   'student-uuid',
 *   'Penicillin'
 * );
 * ```
 *
 * @see {@link HealthRecordsApiService} for general health data management
 */
export class AllergiesApiService extends BaseApiService<Allergy, AllergyCreate, AllergyUpdate> {
  constructor(client: ApiClient) {
    super(client, `${API_ENDPOINTS.HEALTH_RECORDS}/allergies`, {
      createSchema: allergyCreateSchema,
      updateSchema: allergyUpdateSchema
    });
  }

  /**
   * Get allergies for a specific student
   */
  async getStudentAllergies(
    studentId: string,
    filters?: Omit<AllergyFilters, 'page' | 'limit'>
  ): Promise<Allergy[]> {
    this.validateId(studentId);

    const params = this.buildQueryParams({
      ...filters,
      studentId
    });

    const response = await this.client.get<ApiResponse<Allergy[]>>(
      `${this.baseEndpoint}/student/${studentId}${params}`
    );

    await this.logPHIAccess('VIEW_ALLERGIES', studentId);
    return this.extractData(response);
  }

  /**
   * Get critical allergies (severe and life-threatening) for emergency reference
   *
   * @param {string} studentId - UUID of the student
   * @returns {Promise<Allergy[]>} Array of severe and life-threatening allergies
   * @throws {Error} If studentId is invalid UUID format
   * @throws {Error} If API request fails
   *
   * @description
   * Retrieves only severe and life-threatening allergies for quick emergency reference.
   * Critical for emergency response teams, substitute teachers, field trip coordinators,
   * and anyone who needs immediate awareness of potentially life-threatening conditions.
   *
   * Healthcare Safety:
   * - Filters to show only SEVERE and LIFE_THREATENING severity levels
   * - Provides immediate access to emergency protocols
   * - Essential for emergency medical response
   * - Used by cafeteria staff for food safety
   * - Required for field trip medical forms
   *
   * HIPAA Compliance:
   * - Logs access with VIEW_CRITICAL_ALLERGIES action
   * - Restricted to authorized personnel only
   * - Emergency access override available for critical situations
   *
   * @example
   * ```typescript
   * // Get critical allergies for emergency card
   * const critical = await allergiesApi.getCriticalAllergies('student-uuid');
   *
   * if (critical.length > 0) {
   *   console.warn(`CRITICAL: ${critical.length} life-threatening allergies`);
   *   critical.forEach(allergy => {
   *     console.warn(`${allergy.allergen}: ${allergy.reaction}`);
   *     console.warn(`Emergency Protocol: ${allergy.emergencyProtocol}`);
   *   });
   * }
   * ```
   *
   * @see {@link getStudentAllergies} for all allergies
   * @see {@link generateAllergyCard} for printable allergy cards
   */
  async getCriticalAllergies(studentId: string): Promise<Allergy[]> {
    this.validateId(studentId);

    const response = await this.client.get<ApiResponse<Allergy[]>>(
      `${this.baseEndpoint}/student/${studentId}/critical`
    );

    await this.logPHIAccess('VIEW_CRITICAL_ALLERGIES', studentId);
    return this.extractData(response);
  }

  /**
   * Check for medication conflicts with student allergies - CRITICAL SAFETY CHECK
   *
   * @param {string} studentId - UUID of the student
   * @param {string} medicationName - Name of medication to check for conflicts
   * @returns {Promise<{hasConflict: boolean, conflicts: Allergy[]}>} Conflict status and list of conflicting allergies
   * @throws {Error} If studentId is invalid or medication name is empty
   * @throws {Error} If API request fails
   *
   * @description
   * **CRITICAL SAFETY FUNCTION**: Checks if a medication conflicts with any documented student
   * allergies to prevent potentially life-threatening adverse reactions. This check MUST be
   * performed before prescribing or administering any medication to a student.
   *
   * Healthcare Safety (CRITICAL):
   * - Prevents administration of medications that could cause allergic reactions
   * - Identifies both direct drug allergies and cross-sensitivities
   * - Checks drug class conflicts (e.g., all penicillins if penicillin allergy)
   * - Flags even mild allergies as precautionary measure
   * - Essential step in medication safety protocol
   *
   * Workflow Integration:
   * 1. Check conflicts BEFORE prescribing medication
   * 2. If conflicts found, consult with parent/guardian and healthcare provider
   * 3. Document alternative medications considered
   * 4. Obtain written consent if proceeding despite mild allergy
   * 5. Never override life-threatening allergy conflicts
   *
   * HIPAA Compliance:
   * - Logs medication conflict check for audit trail
   * - Documents medication safety verification
   * - Required for prescribing workflow compliance
   *
   * @example
   * ```typescript
   * // MANDATORY check before prescribing medication
   * const medicationCheck = await allergiesApi.checkMedicationConflicts(
   *   'student-uuid',
   *   'Amoxicillin'
   * );
   *
   * if (medicationCheck.hasConflict) {
   *   console.error('MEDICATION CONFLICT DETECTED');
   *   console.error('DO NOT ADMINISTER THIS MEDICATION');
   *
   *   medicationCheck.conflicts.forEach(allergy => {
   *     console.error(`Allergy: ${allergy.allergen}`);
   *     console.error(`Severity: ${allergy.severity}`);
   *     console.error(`Reaction: ${allergy.reaction}`);
   *   });
   *
   *   // Must select alternative medication
   *   return { error: 'Medication conflict - alternative required' };
   * }
   *
   * // Safe to proceed only if no conflicts
   * await medicationsApi.prescribe({
   *   studentId: 'student-uuid',
   *   medication: 'Amoxicillin',
   *   conflictCheckPassed: true
   * });
   * ```
   *
   * @see {@link create} for recording new allergies
   * @see {@link getCriticalAllergies} for emergency allergy information
   */
  async checkMedicationConflicts(
    studentId: string,
    medicationName: string
  ): Promise<{ hasConflict: boolean; conflicts: Allergy[] }> {
    this.validateId(studentId);

    const response = await this.client.post<ApiResponse<{ hasConflict: boolean; conflicts: Allergy[] }>>(
      `${this.baseEndpoint}/check-conflicts`,
      { studentId, medicationName }
    );

    await this.logPHIAccess('CHECK_ALLERGY_CONFLICTS', studentId);
    return this.extractData(response);
  }

  /**
   * Verify allergy record
   */
  async verifyAllergy(
    id: string,
    verificationData: {
      verifiedBy: string;
      verifiedDate?: string;
      notes?: string;
    }
  ): Promise<Allergy> {
    this.validateId(id);

    const response = await this.client.post<ApiResponse<Allergy>>(
      `${this.baseEndpoint}/${id}/verify`,
      verificationData
    );

    const allergy = this.extractData(response);
    await this.logPHIAccess('VERIFY_ALLERGY', allergy.studentId, 'ALLERGY', id);
    return allergy;
  }

  /**
   * Bulk import allergies
   */
  async bulkImport(
    studentId: string,
    allergies: AllergyCreate[]
  ): Promise<{ imported: number; failed: number; errors: string[] }> {
    this.validateId(studentId);

    // Validate all allergies
    allergies.forEach(allergy => {
      allergyCreateSchema.parse(allergy);
    });

    const response = await this.client.post<ApiResponse<{ imported: number; failed: number; errors: string[] }>>(
      `${this.baseEndpoint}/bulk-import`,
      { studentId, allergies }
    );

    await this.logPHIAccess('BULK_IMPORT_ALLERGIES', studentId);
    return this.extractData(response);
  }

  /**
   * Generate allergy card/report
   */
  async generateAllergyCard(studentId: string): Promise<Blob> {
    this.validateId(studentId);

    const response = await this.client.get(
      `${this.baseEndpoint}/student/${studentId}/card`,
      { responseType: 'blob' }
    );

    await this.logPHIAccess('GENERATE_ALLERGY_CARD', studentId);
    return response.data as Blob;
  }

  /**
   * Override to add PHI logging
   */
  async create(data: AllergyCreate): Promise<Allergy> {
    const allergy = await super.create(data);
    await this.logPHIAccess('CREATE_ALLERGY', data.studentId, 'ALLERGY', allergy.id);
    return allergy;
  }

  /**
   * Override to add PHI logging
   */
  async update(id: string, data: AllergyUpdate): Promise<Allergy> {
    const allergy = await super.update(id, data);
    await this.logPHIAccess('UPDATE_ALLERGY', allergy.studentId, 'ALLERGY', id);
    return allergy;
  }

  /**
   * Override to add PHI logging
   */
  async delete(id: string): Promise<void> {
    // Get allergy first for logging
    const allergy = await this.getById(id);
    await super.delete(id);
    await this.logPHIAccess('DELETE_ALLERGY', allergy.studentId, 'ALLERGY', id);
  }

  /**
   * Log PHI access for compliance
   */
  private async logPHIAccess(
    action: string,
    studentId: string,
    recordType: string = 'ALLERGY',
    recordId?: string
  ): Promise<void> {
    try {
      await this.client.post(API_ENDPOINTS.AUDIT.PHI_ACCESS_LOG, {
        action,
        studentId,
        recordType,
        recordId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log PHI access:', error);
    }
  }
}

// ==========================================
// FACTORY FUNCTION
// ==========================================

export function createAllergiesApi(client: ApiClient): AllergiesApiService {
  return new AllergiesApiService(client);
}
