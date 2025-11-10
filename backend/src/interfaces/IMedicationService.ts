/**
 * Medication Service Interface
 * @description Interface for medication service defining contract for dependency injection
 * Enables testability, mocking, and future service implementations
 */

import {
  CreateMedicationData,
  Medication,
  UpdateMedicationData,
} from '../database/repositories/interfaces/medication.repository.interface';

/**
 * Medication list result with pagination
 */
export interface MedicationListResult {
  medications: Medication[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * Medication inventory item
 */
export interface MedicationInventoryItem {
  id: string;
  medicationId: string;
  quantity: number;
  unit: string;
  batchNumber: string;
  expirationDate: Date;
  reorderLevel: number;
  location: string;
}

/**
 * Medication Service Interface
 * Defines all public methods for medication management
 */
export interface IMedicationService {
  /**
   * Get paginated list of medications
   * @param page - Page number
   * @param limit - Items per page
   * @param search - Search query
   * @returns Promise resolving to medication list result
   */
  getMedications(
    page?: number,
    limit?: number,
    search?: string,
  ): Promise<MedicationListResult>;

  /**
   * Get a single medication by ID
   * @param id - Medication ID
   * @returns Promise resolving to medication or null
   */
  getMedicationById(id: string): Promise<Medication | null>;

  /**
   * Create a new medication
   * @param data - Medication data
   * @returns Promise resolving to created medication
   */
  createMedication(data: CreateMedicationData): Promise<Medication>;

  /**
   * Update an existing medication
   * @param id - Medication ID
   * @param data - Updated medication data
   * @returns Promise resolving to updated medication
   */
  updateMedication(id: string, data: UpdateMedicationData): Promise<Medication>;

  /**
   * Soft delete a medication
   * @param id - Medication ID
   * @returns Promise resolving when deletion is complete
   */
  deleteMedication(id: string): Promise<void>;

  /**
   * Search medications by name
   * @param query - Search query
   * @param limit - Maximum results
   * @returns Promise resolving to matching medications
   */
  searchMedications(query: string, limit?: number): Promise<Medication[]>;

  /**
   * Get medications requiring refrigeration
   * @returns Promise resolving to refrigerated medications
   */
  getRefrigerationRequired(): Promise<Medication[]>;

  /**
   * Get controlled substances by schedule
   * @param scheduleClass - Schedule class (I-V)
   * @returns Promise resolving to controlled substances
   */
  getControlledSubstances(scheduleClass?: string): Promise<Medication[]>;

  /**
   * Get medications with inventory below reorder level
   * @returns Promise resolving to low stock medications
   */
  getLowStockMedications(): Promise<Medication[]>;

  /**
   * Get medications expiring soon
   * @param days - Number of days ahead to check
   * @returns Promise resolving to expiring medications
   */
  getExpiringMedications(days: number): Promise<Medication[]>;
}

/**
 * Medication CRUD Service Interface
 * Segregated interface for basic CRUD operations (ISP compliance)
 */
export interface IMedicationCrudService {
  getMedications(
    page?: number,
    limit?: number,
    search?: string,
  ): Promise<MedicationListResult>;
  getMedicationById(id: string): Promise<Medication | null>;
  createMedication(data: CreateMedicationData): Promise<Medication>;
  updateMedication(id: string, data: UpdateMedicationData): Promise<Medication>;
  deleteMedication(id: string): Promise<void>;
}

/**
 * Medication Query Service Interface
 * Segregated interface for query operations (ISP compliance)
 */
export interface IMedicationQueryService {
  searchMedications(query: string, limit?: number): Promise<Medication[]>;
  getRefrigerationRequired(): Promise<Medication[]>;
  getControlledSubstances(scheduleClass?: string): Promise<Medication[]>;
  getLowStockMedications(): Promise<Medication[]>;
  getExpiringMedications(days: number): Promise<Medication[]>;
}
