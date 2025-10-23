/**
 * WF-COMP-284 | MedicationFormularyApi.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: @/services/config/apiConfig, @/constants/api, zod
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, interfaces, types, classes | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Medication Formulary API Client
 *
 * Purpose: Manages the system medication formulary (drug database)
 *
 * Responsibilities:
 * - Formulary search and lookup
 * - NDC/barcode verification
 * - Drug interaction checking
 * - Drug monograph retrieval
 *
 * Caching Strategy:
 * - Formulary: 24 hours (rarely changes)
 * - Drug monographs: 1 week
 * - Interactions: 24 hours
 */

import { apiInstance } from '@/services/config/apiConfig';
import { API_ENDPOINTS } from '@/constants/api';
import { z } from 'zod';
import axios from 'axios';
import { createApiError, createValidationError } from '@/services/core/errors';

// Types
export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  brandName?: string;
  ndc: string;
  strength: string;
  form: MedicationForm;
  route: AdministrationRoute;
  category: string;
  isControlled: boolean;
  controlledSchedule?: 1 | 2 | 3 | 4 | 5;
  requiresPrescription: boolean;
  isActive: boolean;
  manufacturer?: string;
  description?: string;
  warnings?: string[];
  contraindications?: string[];
  createdAt: string;
  updatedAt: string;
}

export type MedicationForm =
  | 'tablet'
  | 'capsule'
  | 'liquid'
  | 'injection'
  | 'inhaler'
  | 'topical'
  | 'drops'
  | 'cream'
  | 'ointment'
  | 'patch'
  | 'suppository';

export type AdministrationRoute =
  | 'oral'
  | 'sublingual'
  | 'buccal'
  | 'intravenous'
  | 'intramuscular'
  | 'subcutaneous'
  | 'topical'
  | 'inhalation'
  | 'rectal'
  | 'ophthalmic'
  | 'otic'
  | 'nasal';

export interface FormularyFilters {
  search?: string;
  category?: string;
  form?: MedicationForm;
  route?: AdministrationRoute;
  isControlled?: boolean;
  requiresPrescription?: boolean;
  isActive?: boolean;
  manufacturer?: string;
  page?: number;
  limit?: number;
}

export interface DrugInteraction {
  id: string;
  medication1Id: string;
  medication1Name: string;
  medication2Id: string;
  medication2Name: string;
  severity: 'mild' | 'moderate' | 'severe' | 'contraindicated';
  description: string;
  clinicalEffects: string[];
  management: string;
  evidence: 'theoretical' | 'case-report' | 'study' | 'established';
  source: string;
}

export interface DrugMonograph {
  medicationId: string;
  medicationName: string;
  genericName?: string;
  brandNames: string[];
  description: string;
  indications: string[];
  contraindications: string[];
  warnings: string[];
  adverseEffects: string[];
  dosing: {
    adult?: string;
    pediatric?: string;
    geriatric?: string;
    renalAdjustment?: string;
    hepaticAdjustment?: string;
  };
  pharmacokinetics: {
    absorption?: string;
    distribution?: string;
    metabolism?: string;
    elimination?: string;
    halfLife?: string;
  };
  drugInteractions: string[];
  foodInteractions?: string[];
  labInteractions?: string[];
  pregnancy: {
    category?: string;
    description?: string;
  };
  lactation?: string;
  storage: string;
  references: string[];
  lastUpdated: string;
}

export interface BarcodeResult {
  barcode: string;
  format: 'NDC' | 'UPC' | 'GS1' | 'CODE128' | 'CODE39';
  ndc?: string;
  medication?: Medication;
}

export interface LASAMedication {
  medicationId: string;
  medicationName: string;
  similarity: 'look-alike' | 'sound-alike' | 'both';
  risk: 'high' | 'medium' | 'low';
  differentiatingCharacteristics: string[];
}

// Validation Schemas
const medicationSchema = z.object({
  id: z.string(),
  name: z.string(),
  genericName: z.string().optional(),
  brandName: z.string().optional(),
  ndc: z.string(),
  strength: z.string(),
  form: z.enum([
    'tablet', 'capsule', 'liquid', 'injection', 'inhaler',
    'topical', 'drops', 'cream', 'ointment', 'patch', 'suppository'
  ]),
  route: z.enum([
    'oral', 'sublingual', 'buccal', 'intravenous', 'intramuscular',
    'subcutaneous', 'topical', 'inhalation', 'rectal', 'ophthalmic', 'otic', 'nasal'
  ]),
  category: z.string(),
  isControlled: z.boolean(),
  controlledSchedule: z.number().int().min(1).max(5).optional(),
  requiresPrescription: z.boolean(),
  isActive: z.boolean(),
});

// API Client
export class MedicationFormularyApi {
  /**
   * Search medication formulary
   * Cached for 24 hours
   */
  async searchFormulary(
    query: string,
    filters?: FormularyFilters
  ): Promise<{ medications: Medication[]; total: number; page: number; limit: number }> {
    try {
      const params = new URLSearchParams();

      if (query) params.append('search', query);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.form) params.append('form', filters.form);
      if (filters?.route) params.append('route', filters.route);
      if (filters?.isControlled !== undefined) params.append('isControlled', String(filters.isControlled));
      if (filters?.requiresPrescription !== undefined) params.append('requiresPrescription', String(filters.requiresPrescription));
      if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
      if (filters?.manufacturer) params.append('manufacturer', filters.manufacturer);
      if (filters?.page) params.append('page', String(filters.page));
      if (filters?.limit) params.append('limit', String(filters.limit));

      const response = await apiInstance.get(
        `${API_ENDPOINTS.MEDICATIONS.BASE}?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to search medication formulary');
    }
  }

  /**
   * Get medication by ID
   */
  async getMedicationById(id: string): Promise<Medication> {
    try {
      if (!id) throw new Error('Medication ID is required');

      const response = await apiInstance.get(
        API_ENDPOINTS.MEDICATIONS.BY_ID(id)
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch medication');
    }
  }

  /**
   * Get medication by NDC (National Drug Code)
   * Used for barcode verification
   */
  async getMedicationByNDC(ndc: string): Promise<Medication> {
    try {
      if (!ndc) throw new Error('NDC is required');

      // Normalize NDC format (remove dashes)
      const normalizedNDC = ndc.replace(/-/g, '');

      const response = await apiInstance.get(
        API_ENDPOINTS.MEDICATIONS.FORMULARY_NDC(normalizedNDC)
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch medication by NDC');
    }
  }

  /**
   * Scan barcode and retrieve medication
   * Supports multiple barcode formats
   */
  async getMedicationByBarcode(barcode: string): Promise<BarcodeResult> {
    try {
      if (!barcode) throw new Error('Barcode is required');

      const response = await apiInstance.post(
        API_ENDPOINTS.MEDICATIONS.FORMULARY_BARCODE,
        { barcode }
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to scan barcode');
    }
  }

  /**
   * Check for drug-drug interactions
   * Critical for patient safety
   */
  async checkDrugInteractions(medicationIds: string[]): Promise<DrugInteraction[]> {
    try {
      if (!medicationIds || medicationIds.length === 0) {
        throw new Error('At least one medication ID is required');
      }

      const response = await apiInstance.post(
        `${API_ENDPOINTS.MEDICATIONS.INTERACTIONS}`,
        { medicationIds }
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to check drug interactions');
    }
  }

  /**
   * Get comprehensive drug monograph
   * Cached for 1 week
   */
  async getDrugMonograph(medicationId: string): Promise<DrugMonograph> {
    try {
      if (!medicationId) throw new Error('Medication ID is required');

      const response = await apiInstance.get(
        API_ENDPOINTS.MEDICATIONS.FORMULARY_MONOGRAPH(medicationId)
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch drug monograph');
    }
  }

  /**
   * Get alternative medications (generic/therapeutic equivalents)
   */
  async getAlternativeMedications(medicationId: string): Promise<Medication[]> {
    try {
      if (!medicationId) throw new Error('Medication ID is required');

      const response = await apiInstance.get(
        API_ENDPOINTS.MEDICATIONS.FORMULARY_ALTERNATIVES(medicationId)
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch alternative medications');
    }
  }

  /**
   * Check for Look-Alike/Sound-Alike (LASA) medications
   * Critical safety feature
   */
  async checkLASAMedications(medicationId: string): Promise<LASAMedication[]> {
    try {
      if (!medicationId) throw new Error('Medication ID is required');

      const response = await apiInstance.get(
        API_ENDPOINTS.MEDICATIONS.FORMULARY_LASA(medicationId)
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to check LASA medications');
    }
  }

  /**
   * Get medication categories for filtering
   */
  async getCategories(): Promise<string[]> {
    try {
      const response = await apiInstance.get(
        API_ENDPOINTS.MEDICATIONS.FORMULARY_CATEGORIES
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch medication categories');
    }
  }

  /**
   * Get medication forms (tablet, capsule, etc.)
   */
  async getForms(): Promise<MedicationForm[]> {
    try {
      const response = await apiInstance.get(
        API_ENDPOINTS.MEDICATIONS.FORMULARY_FORMS
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch medication forms');
    }
  }

  /**
   * Create new medication in formulary (admin only)
   */
  async createMedication(data: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>): Promise<Medication> {
    try {
      // Validate data
      medicationSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(data);

      const response = await apiInstance.post(
        `${API_ENDPOINTS.MEDICATIONS.BASE}`,
        data
      );

      return response.data.data;
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.errors[0]?.message || 'Validation error',
          error.errors[0]?.path.join('.'),
          error.errors.reduce((acc, err) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Failed to create medication');
    }
  }

  /**
   * Update medication in formulary (admin only)
   */
  async updateMedication(
    id: string,
    data: Partial<Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Medication> {
    try {
      if (!id) throw new Error('Medication ID is required');

      const response = await apiInstance.put(
        API_ENDPOINTS.MEDICATIONS.BY_ID(id),
        data
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to update medication');
    }
  }

  /**
   * Deactivate medication in formulary (soft delete)
   */
  async deactivateMedication(id: string, reason: string): Promise<void> {
    try {
      if (!id) throw new Error('Medication ID is required');
      if (!reason) throw new Error('Deactivation reason is required');

      await apiInstance.patch(
        API_ENDPOINTS.MEDICATIONS.FORMULARY_DEACTIVATE(id),
        { reason }
      );
    } catch (error) {
      throw createApiError(error, 'Failed to deactivate medication');
    }
  }
}

// Export singleton instance
export const medicationFormularyApi = new MedicationFormularyApi();
