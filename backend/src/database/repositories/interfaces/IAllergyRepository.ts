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
