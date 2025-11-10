/**
 * Medication Repository Interface
 * DEA-compliant data access for medication management
 */

import { IRepository } from './repository.interface';
import { ExecutionContext, QueryOptions } from '../../types';

export enum MedicationStatus {
  ACTIVE = 'ACTIVE',
  DISCONTINUED = 'DISCONTINUED',
  DELETED = 'DELETED',
}

export enum ControlledSubstanceSchedule {
  SCHEDULE_I = 'SCHEDULE_I',
  SCHEDULE_II = 'SCHEDULE_II',
  SCHEDULE_III = 'SCHEDULE_III',
  SCHEDULE_IV = 'SCHEDULE_IV',
  SCHEDULE_V = 'SCHEDULE_V',
}

export interface MedicationAttributes {
  id: string;
  name: string;
  genericName?: string;
  brandName?: string;
  dosageForm: string;
  strength: string;
  route: string;
  frequency?: string;
  duration?: string;
  prescribedBy?: string;
  startDate?: Date;
  endDate?: Date;
  instructions?: string;
  notes?: string;
  studentId: string;
  organizationId: string;
  status: MedicationStatus;
  isControlled: boolean;
  scheduleClass?: ControlledSubstanceSchedule;
  requiresRefrigeration: boolean;
  sideEffects?: string[];
  interactions?: string[];
  contraindications?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMedicationData {
  name: string;
  genericName?: string;
  brandName?: string;
  dosageForm: string;
  strength: string;
  route: string;
  frequency?: string;
  duration?: string;
  prescribedBy?: string;
  startDate?: Date;
  endDate?: Date;
  instructions?: string;
  notes?: string;
  studentId: string;
  organizationId: string;
  isControlled?: boolean;
  scheduleClass?: ControlledSubstanceSchedule;
  requiresRefrigeration?: boolean;
  sideEffects?: string[];
  interactions?: string[];
  contraindications?: string[];
}

export interface UpdateMedicationData {
  name?: string;
  genericName?: string;
  brandName?: string;
  dosageForm?: string;
  strength?: string;
  route?: string;
  frequency?: string;
  duration?: string;
  prescribedBy?: string;
  startDate?: Date;
  endDate?: Date;
  instructions?: string;
  notes?: string;
  status?: MedicationStatus;
  isControlled?: boolean;
  scheduleClass?: ControlledSubstanceSchedule;
  requiresRefrigeration?: boolean;
  sideEffects?: string[];
  interactions?: string[];
  contraindications?: string[];
}

export interface MedicationFilters {
  studentId?: string;
  organizationId?: string;
  status?: MedicationStatus;
  isControlled?: boolean;
  scheduleClass?: ControlledSubstanceSchedule;
  requiresRefrigeration?: boolean;
  search?: string;
}

export interface Medication extends MedicationAttributes {}

export interface IMedicationRepository
  extends IRepository<
    MedicationAttributes,
    CreateMedicationData,
    UpdateMedicationData
  > {
  findByStudent(
    studentId: string,
    options?: QueryOptions,
  ): Promise<MedicationAttributes[]>;
  findActiveByStudent(studentId: string): Promise<MedicationAttributes[]>;
  findByOrganization(
    organizationId: string,
    options?: QueryOptions,
  ): Promise<MedicationAttributes[]>;
  findControlledSubstances(
    scheduleClass?: ControlledSubstanceSchedule,
  ): Promise<MedicationAttributes[]>;
  findRequiringRefrigeration(): Promise<MedicationAttributes[]>;
  searchByName(query: string, limit?: number): Promise<MedicationAttributes[]>;
  discontinueMedication(
    id: string,
    reason: string,
    context: ExecutionContext,
  ): Promise<void>;
  getActiveCount(filters?: MedicationFilters): Promise<number>;
  bulkUpdateStatus(
    ids: string[],
    status: MedicationStatus,
    context: ExecutionContext,
  ): Promise<void>;
}
