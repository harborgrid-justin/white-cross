/**
 * Health Screening Repository Interface
 * HIPAA-compliant data access for health screening records
 */

import { IRepository } from '../../../database/repositories/interfaces/repository.interface';
import { QueryOptions } from '../../../database/types';

export interface HealthScreeningAttributes {
  id: string;
  studentId: string;
  screeningType: string; // vision, hearing, dental, scoliosis, etc.
  screeningDate: Date;
  performedBy?: string;
  result: string; // pass, fail, refer, incomplete
  resultDetails?: any; // JSON field for detailed results
  notes?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
  followUpCompleted: boolean;
  isAbnormal: boolean;
  nextScheduledDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateHealthScreeningDTO {
  studentId: string;
  screeningType: string;
  screeningDate: Date;
  performedBy?: string;
  result: string;
  resultDetails?: any;
  notes?: string;
  followUpRequired?: boolean;
  followUpDate?: Date;
  followUpCompleted?: boolean;
  isAbnormal?: boolean;
  nextScheduledDate?: Date;
}

export interface UpdateHealthScreeningDTO {
  screeningType?: string;
  screeningDate?: Date;
  performedBy?: string;
  result?: string;
  resultDetails?: any;
  notes?: string;
  followUpRequired?: boolean;
  followUpDate?: Date;
  followUpCompleted?: boolean;
  isAbnormal?: boolean;
  nextScheduledDate?: Date;
}

export interface IHealthScreeningRepository
  extends IRepository<
    HealthScreeningAttributes,
    CreateHealthScreeningDTO,
    UpdateHealthScreeningDTO
  > {
  findByStudent(
    studentId: string,
    options?: QueryOptions,
  ): Promise<HealthScreeningAttributes[]>;
  findByScreeningType(
    screeningType: string,
    options?: QueryOptions,
  ): Promise<HealthScreeningAttributes[]>;
  findDueScreenings(
    date: Date,
    options?: QueryOptions,
  ): Promise<HealthScreeningAttributes[]>;
  findByDateRange(
    startDate: Date,
    endDate: Date,
    options?: QueryOptions,
  ): Promise<HealthScreeningAttributes[]>;
  findAbnormalResults(
    screeningType?: string,
    options?: QueryOptions,
  ): Promise<HealthScreeningAttributes[]>;
  getScreeningSchedule(studentId: string): Promise<HealthScreeningAttributes[]>;
}
