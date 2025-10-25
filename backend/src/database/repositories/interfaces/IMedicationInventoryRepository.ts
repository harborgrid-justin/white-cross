/**
 * @fileoverview MedicationInventory repository interface.
 * Repository interface for MedicationInventory data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * MedicationInventory repository interface
 * Extends base repository with MedicationInventory-specific operations
 */
export interface IMedicationInventoryRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create MedicationInventory DTO
 */
export interface CreateMedicationInventoryDTO {
  // Properties defined by MedicationInventory model
  id?: string;
}

/**
 * Update MedicationInventory DTO
 */
export interface UpdateMedicationInventoryDTO {
  // Properties defined by MedicationInventory model  
  id?: string;
}
