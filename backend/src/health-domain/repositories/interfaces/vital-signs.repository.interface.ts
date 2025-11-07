/**
 * Vital Signs Repository Interface
 * HIPAA-compliant data access for vital signs records
 */

import { IRepository } from '../../../database/repositories/interfaces/repository.interface';
import { ExecutionContext, QueryOptions } from '../../../database/types';

export interface VitalSignsAttributes {
  id: string;
  studentId: string;
  measurementDate: Date;
  temperature?: number;
  temperatureUnit?: string; // F or C
  heartRate?: number;
  respiratoryRate?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  oxygenSaturation?: number;
  weight?: number;
  weightUnit?: string; // lbs or kg
  height?: number;
  heightUnit?: string; // inches or cm
  bmi?: number;
  pain?: number; // 0-10 scale
  isAbnormal: boolean;
  abnormalFlags?: string[]; // Array of abnormal vital types
  measuredBy?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVitalSignsDTO {
  studentId: string;
  measurementDate: Date;
  temperature?: number;
  temperatureUnit?: string;
  heartRate?: number;
  respiratoryRate?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  oxygenSaturation?: number;
  weight?: number;
  weightUnit?: string;
  height?: number;
  heightUnit?: string;
  bmi?: number;
  pain?: number;
  isAbnormal?: boolean;
  abnormalFlags?: string[];
  measuredBy?: string;
  notes?: string;
}

export interface UpdateVitalSignsDTO {
  measurementDate?: Date;
  temperature?: number;
  temperatureUnit?: string;
  heartRate?: number;
  respiratoryRate?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  oxygenSaturation?: number;
  weight?: number;
  weightUnit?: string;
  height?: number;
  heightUnit?: string;
  bmi?: number;
  pain?: number;
  isAbnormal?: boolean;
  abnormalFlags?: string[];
  measuredBy?: string;
  notes?: string;
}

export interface IVitalSignsRepository
  extends IRepository<
    VitalSignsAttributes,
    CreateVitalSignsDTO,
    UpdateVitalSignsDTO
  > {
  findByStudent(
    studentId: string,
    options?: QueryOptions,
  ): Promise<VitalSignsAttributes[]>;
  findLatestByStudent(studentId: string): Promise<VitalSignsAttributes | null>;
  findByDateRange(
    studentId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<VitalSignsAttributes[]>;
  findAbnormalVitals(
    studentId?: string,
    options?: QueryOptions,
  ): Promise<VitalSignsAttributes[]>;
  getVitalTrends(
    studentId: string,
    vitalType: string,
    days?: number,
  ): Promise<VitalSignsAttributes[]>;
  bulkRecordVitals(
    records: CreateVitalSignsDTO[],
    context: ExecutionContext,
  ): Promise<VitalSignsAttributes[]>;
}
