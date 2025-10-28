/**
 * Health Record Repository Interface
 * HIPAA-compliant data access for health record management
 */

import { IRepository } from './repository.interface';
import { ExecutionContext, QueryOptions } from '../../types';

export enum HealthRecordType {
  VITAL_SIGNS = 'VITAL_SIGNS',
  PHYSICAL_EXAM = 'PHYSICAL_EXAM',
  IMMUNIZATION = 'IMMUNIZATION',
  SCREENING = 'SCREENING',
  INJURY = 'INJURY',
  ILLNESS = 'ILLNESS',
  MEDICATION_ADMIN = 'MEDICATION_ADMIN',
  ALLERGY_REACTION = 'ALLERGY_REACTION',
  MENTAL_HEALTH = 'MENTAL_HEALTH',
  DENTAL = 'DENTAL',
  VISION = 'VISION',
  HEARING = 'HEARING',
  NUTRITION = 'NUTRITION',
  SLEEP = 'SLEEP',
  DEVELOPMENT = 'DEVELOPMENT',
  OTHER = 'OTHER'
}

export enum HealthRecordStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED'
}

export interface HealthRecordAttributes {
  id: string;
  studentId: string;
  nurseId: string;
  type: HealthRecordType;
  title: string;
  description?: string;
  notes?: string;
  recordedAt: Date;
  occurredAt?: Date;
  followUpRequired?: boolean;
  followUpDate?: Date;
  followUpNotes?: string;
  attachments?: string[];
  metadata?: Record<string, any>;
  status: HealthRecordStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateHealthRecordData {
  studentId: string;
  nurseId: string;
  type: HealthRecordType;
  title: string;
  description?: string;
  notes?: string;
  recordedAt: Date;
  occurredAt?: Date;
  followUpRequired?: boolean;
  followUpDate?: Date;
  followUpNotes?: string;
  attachments?: string[];
  metadata?: Record<string, any>;
}

export interface UpdateHealthRecordData {
  title?: string;
  description?: string;
  notes?: string;
  occurredAt?: Date;
  followUpRequired?: boolean;
  followUpDate?: Date;
  followUpNotes?: string;
  attachments?: string[];
  metadata?: Record<string, any>;
  status?: HealthRecordStatus;
}

export interface HealthRecordFilters {
  studentId?: string;
  nurseId?: string;
  type?: HealthRecordType;
  status?: HealthRecordStatus;
  dateFrom?: Date;
  dateTo?: Date;
  followUpRequired?: boolean;
  followUpBefore?: Date;
}

export interface HealthSummary {
  studentId: string;
  totalRecords: number;
  recordTypes: Record<HealthRecordType, number>;
  lastPhysicalExam?: Date;
  lastImmunizationUpdate?: Date;
  activeAllergies: number;
  followUpRequired: number;
  upcomingFollowUps: number;
  recentActivity: HealthRecordAttributes[];
}

export interface HealthRecord extends HealthRecordAttributes {}

export interface IHealthRecordRepository extends IRepository<HealthRecordAttributes, CreateHealthRecordData, UpdateHealthRecordData> {
  findByStudent(studentId: string, options?: QueryOptions): Promise<HealthRecordAttributes[]>;
  findByType(type: HealthRecordType, studentId?: string, options?: QueryOptions): Promise<HealthRecordAttributes[]>;
  findRequiringFollowUp(beforeDate?: Date): Promise<HealthRecordAttributes[]>;
  findByDateRange(startDate: Date, endDate: Date, filters?: HealthRecordFilters): Promise<HealthRecordAttributes[]>;
  getStudentHealthSummary(studentId: string): Promise<HealthSummary>;
  archiveRecord(id: string, context: ExecutionContext): Promise<void>;
  getRecordsCount(filters?: HealthRecordFilters): Promise<number>;
}
