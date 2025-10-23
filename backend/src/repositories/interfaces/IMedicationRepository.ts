/**
 * Medication Repository Interface
 * @description Repository interface for medication entity operations
 * Extends base repository with medication-specific methods
 */

import { IRepository } from './IRepository';

/**
 * Medication entity type (matches database model)
 */
export interface Medication {
  id: string;
  name: string;
  strength: string;
  dosageForm: string;
  unit: string;
  ndc?: string;
  manufacturer?: string;
  requiresRefrigeration: boolean;
  controlledSubstance: boolean;
  scheduleClass?: string;
  routeOfAdministration?: string;
  warnings?: string;
  sideEffects?: string;
  contraindications?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Medication repository interface
 */
export interface IMedicationRepository extends IRepository<Medication> {
  /**
   * Find medication by NDC (National Drug Code)
   * @param ndc - National Drug Code
   * @returns Promise resolving to medication or null
   */
  findByNDC(ndc: string): Promise<Medication | null>;

  /**
   * Find all active medications with inventory data
   * @returns Promise resolving to medications with inventory
   */
  findActiveWithInventory(): Promise<Medication[]>;

  /**
   * Find medications expiring within specified days
   * @param days - Number of days from now
   * @returns Promise resolving to medications with expiring inventory
   */
  findExpiringSoon(days: number): Promise<Medication[]>;

  /**
   * Find medications by controlled substance schedule
   * @param scheduleClass - Schedule class (I, II, III, IV, V)
   * @returns Promise resolving to controlled medications
   */
  findByScheduleClass(scheduleClass: string): Promise<Medication[]>;

  /**
   * Search medications by name (partial match)
   * @param query - Search query
   * @param limit - Maximum results to return
   * @returns Promise resolving to matching medications
   */
  searchByName(query: string, limit?: number): Promise<Medication[]>;

  /**
   * Find medications requiring refrigeration
   * @returns Promise resolving to medications requiring refrigeration
   */
  findRefrigerationRequired(): Promise<Medication[]>;

  /**
   * Find medications by dosage form
   * @param dosageForm - Dosage form (tablet, capsule, liquid, etc.)
   * @returns Promise resolving to medications of specified form
   */
  findByDosageForm(dosageForm: string): Promise<Medication[]>;

  /**
   * Find medications by manufacturer
   * @param manufacturer - Manufacturer name
   * @returns Promise resolving to medications from manufacturer
   */
  findByManufacturer(manufacturer: string): Promise<Medication[]>;

  /**
   * Check if medication name already exists
   * @param name - Medication name
   * @param excludeId - ID to exclude from check (for updates)
   * @returns Promise resolving to true if exists
   */
  nameExists(name: string, excludeId?: string): Promise<boolean>;

  /**
   * Check if NDC already exists
   * @param ndc - National Drug Code
   * @param excludeId - ID to exclude from check (for updates)
   * @returns Promise resolving to true if exists
   */
  ndcExists(ndc: string, excludeId?: string): Promise<boolean>;
}

/**
 * Filters for medication queries
 */
export interface MedicationFilters {
  name?: string;
  dosageForm?: string;
  manufacturer?: string;
  controlledSubstance?: boolean;
  requiresRefrigeration?: boolean;
  isActive?: boolean;
  scheduleClass?: string;
}

/**
 * Data for creating a new medication
 */
export interface CreateMedicationData {
  name: string;
  strength: string;
  dosageForm: string;
  unit: string;
  ndc?: string;
  manufacturer?: string;
  requiresRefrigeration?: boolean;
  controlledSubstance?: boolean;
  scheduleClass?: string;
  routeOfAdministration?: string;
  warnings?: string;
  sideEffects?: string;
  contraindications?: string;
}

/**
 * Data for updating a medication
 */
export interface UpdateMedicationData extends Partial<CreateMedicationData> {
  isActive?: boolean;
}
