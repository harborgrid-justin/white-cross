/**
 * @fileoverview MedicationInventory repository interface.
 * Auto-generated repository interface for MedicationInventory data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * MedicationInventory repository interface
 * Extends base repository with MedicationInventory-specific operations
 */
export interface IMedicationInventoryRepository extends IRepository<any, any, any> {
  // Add MedicationInventory-specific methods here if needed
}

/**
 * Create MedicationInventory DTO
 */
export interface CreateMedicationInventoryDTO {
  [key: string]: any;
}

/**
 * Update MedicationInventory DTO
 */
export interface UpdateMedicationInventoryDTO {
  [key: string]: any;
}
