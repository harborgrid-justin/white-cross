/**
 * Immunization Repository Interface
 * HIPAA-compliant data access for immunization records
 */

import { IRepository } from '../../../database/repositories/interfaces/repository.interface';
import { ExecutionContext, QueryOptions } from '../../../database/types';

export interface ImmunizationAttributes {
  id: string;
  studentId: string;
  vaccineType: string;
  vaccineName: string;
  manufacturer?: string;
  lotNumber?: string;
  administeredDate: Date;
  expirationDate?: Date;
  doseNumber?: number;
  totalDosesRequired?: number;
  administeredBy?: string;
  clinic?: string;
  siteOfAdministration?: string;
  route?: string;
  reactions?: string;
  notes?: string;
  isCompliant: boolean;
  nextDueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateImmunizationDTO {
  studentId: string;
  vaccineType: string;
  vaccineName: string;
  manufacturer?: string;
  lotNumber?: string;
  administeredDate: Date;
  expirationDate?: Date;
  doseNumber?: number;
  totalDosesRequired?: number;
  administeredBy?: string;
  clinic?: string;
  siteOfAdministration?: string;
  route?: string;
  reactions?: string;
  notes?: string;
  isCompliant?: boolean;
  nextDueDate?: Date;
}

export interface UpdateImmunizationDTO {
  vaccineType?: string;
  vaccineName?: string;
  manufacturer?: string;
  lotNumber?: string;
  administeredDate?: Date;
  expirationDate?: Date;
  doseNumber?: number;
  totalDosesRequired?: number;
  administeredBy?: string;
  clinic?: string;
  siteOfAdministration?: string;
  route?: string;
  reactions?: string;
  notes?: string;
  isCompliant?: boolean;
  nextDueDate?: Date;
}

export interface IImmunizationRepository extends IRepository<ImmunizationAttributes, CreateImmunizationDTO, UpdateImmunizationDTO> {
  findByStudent(studentId: string, options?: QueryOptions): Promise<ImmunizationAttributes[]>;
  findByVaccineType(vaccineType: string, options?: QueryOptions): Promise<ImmunizationAttributes[]>;
  findDueImmunizations(studentId: string, asOfDate?: Date): Promise<ImmunizationAttributes[]>;
  findByDateRange(startDate: Date, endDate: Date, options?: QueryOptions): Promise<ImmunizationAttributes[]>;
  checkComplianceStatus(studentId: string): Promise<{ isCompliant: boolean; missingVaccines: string[] }>;
  getVaccinationHistory(studentId: string): Promise<ImmunizationAttributes[]>;
}
