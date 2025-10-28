/**
 * Medical History Repository Interface
 * HIPAA-compliant data access for medical history records
 */

import { IRepository } from '../../../database/repositories/interfaces/repository.interface';
import { ExecutionContext, QueryOptions } from '../../../database/types';

export interface MedicalHistoryAttributes {
  id: string;
  studentId: string;
  recordType: string; // condition, allergy, surgery, hospitalization, family_history
  condition: string;
  diagnosisCode?: string; // ICD-10 code
  diagnosisDate?: Date;
  resolvedDate?: Date;
  isActive: boolean;
  severity?: string; // mild, moderate, severe, critical
  category?: string; // chronic, acute, genetic, infectious, etc.
  treatment?: string;
  medication?: string;
  notes?: string;
  isFamilyHistory: boolean;
  familyRelation?: string; // if family history: mother, father, sibling, etc.
  isCritical: boolean;
  requiresMonitoring: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMedicalHistoryDTO {
  studentId: string;
  recordType: string;
  condition: string;
  diagnosisCode?: string;
  diagnosisDate?: Date;
  resolvedDate?: Date;
  isActive?: boolean;
  severity?: string;
  category?: string;
  treatment?: string;
  medication?: string;
  notes?: string;
  isFamilyHistory?: boolean;
  familyRelation?: string;
  isCritical?: boolean;
  requiresMonitoring?: boolean;
}

export interface UpdateMedicalHistoryDTO {
  recordType?: string;
  condition?: string;
  diagnosisCode?: string;
  diagnosisDate?: Date;
  resolvedDate?: Date;
  isActive?: boolean;
  severity?: string;
  category?: string;
  treatment?: string;
  medication?: string;
  notes?: string;
  isFamilyHistory?: boolean;
  familyRelation?: string;
  isCritical?: boolean;
  requiresMonitoring?: boolean;
}

export interface IMedicalHistoryRepository extends IRepository<MedicalHistoryAttributes, CreateMedicalHistoryDTO, UpdateMedicalHistoryDTO> {
  findByStudent(studentId: string, options?: QueryOptions): Promise<MedicalHistoryAttributes[]>;
  findByCondition(condition: string, options?: QueryOptions): Promise<MedicalHistoryAttributes[]>;
  findActiveConditions(studentId: string): Promise<MedicalHistoryAttributes[]>;
  findByCategory(category: string, options?: QueryOptions): Promise<MedicalHistoryAttributes[]>;
  findFamilyHistory(studentId: string): Promise<MedicalHistoryAttributes[]>;
  searchConditions(query: string, options?: QueryOptions): Promise<MedicalHistoryAttributes[]>;
  flagCriticalConditions(studentId: string): Promise<MedicalHistoryAttributes[]>;
}
