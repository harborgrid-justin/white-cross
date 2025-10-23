/**
 * Allergies API Service Module
 *
 * Purpose: Manages student allergy records with comprehensive safety checks
 *
 * Features:
 * - CRUD operations for allergy records
 * - Severity tracking and risk assessment
 * - Emergency protocols and action plans
 * - Cross-reference with medications
 * - PHI access logging
 *
 * @module services/modules/health/allergies
 */

import { API_ENDPOINTS } from '../../config/apiConfig';
import { z } from 'zod';
import { BaseApiService } from '../../core/BaseApiService';
import type { ApiClient } from '../../core/ApiClient';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '../../types';

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
   * Get critical allergies (severe and life-threatening)
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
   * Check for medication conflicts with allergies
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
      await this.client.post('/api/audit/phi-access', {
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