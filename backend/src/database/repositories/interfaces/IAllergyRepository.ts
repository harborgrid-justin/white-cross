/**
 * WC-GEN-108 | IAllergyRepository.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ./IRepository | Dependencies: ./IRepository
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: interfaces, types | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Allergy Repository Interface
 */

import { IRepository } from './IRepository';

export interface Allergy {
  id: string;
  studentId: string;
  allergen: string;
  severity: AllergySeverity;
  reaction?: string;
  treatment?: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type AllergySeverity = 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';

export interface CreateAllergyDTO {
  studentId: string;
  allergen: string;
  severity: AllergySeverity;
  reaction?: string;
  treatment?: string;
  verified?: boolean;
  verifiedBy?: string;
}

export interface UpdateAllergyDTO {
  allergen?: string;
  severity?: AllergySeverity;
  reaction?: string;
  treatment?: string;
  verified?: boolean;
  verifiedBy?: string;
}

export interface IAllergyRepository extends IRepository<Allergy, CreateAllergyDTO, UpdateAllergyDTO> {
  findByStudentId(studentId: string): Promise<Allergy[]>;
  findBySeverity(severity: AllergySeverity): Promise<Allergy[]>;
  checkDuplicateAllergen(studentId: string, allergen: string): Promise<boolean>;
}
