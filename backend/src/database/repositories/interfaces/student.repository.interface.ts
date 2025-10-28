/**
 * Student Repository Interface
 * FERPA-compliant data access for student records
 */

import { IRepository } from './repository.interface';
import { ExecutionContext, QueryOptions } from '../../types';

export interface StudentAttributes {
  id: string;
  studentNumber: string;
  medicalRecordNum?: string;
  firstName: string;
  lastName: string;
  grade: string;
  dateOfBirth: Date;
  nurseId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStudentDTO {
  studentNumber: string;
  medicalRecordNum?: string;
  firstName: string;
  lastName: string;
  grade: string;
  dateOfBirth: Date;
  nurseId?: string;
}

export interface UpdateStudentDTO {
  studentNumber?: string;
  medicalRecordNum?: string;
  firstName?: string;
  lastName?: string;
  grade?: string;
  dateOfBirth?: Date;
  nurseId?: string;
  isActive?: boolean;
}

export interface StudentFilters {
  nurseId?: string;
  grade?: string;
  isActive?: boolean;
  search?: string;
  dateOfBirthFrom?: Date;
  dateOfBirthTo?: Date;
}

export interface GradeStatistics {
  grade: string;
  count: number;
  activeCount: number;
  inactiveCount: number;
}

export interface IStudentRepository extends IRepository<StudentAttributes, CreateStudentDTO, UpdateStudentDTO> {
  findByStudentNumber(studentNumber: string): Promise<StudentAttributes | null>;
  findByMedicalRecordNumber(medicalRecordNum: string): Promise<StudentAttributes | null>;
  findByGrade(grade: string): Promise<StudentAttributes[]>;
  findByNurse(nurseId: string, options?: QueryOptions): Promise<StudentAttributes[]>;
  search(query: string): Promise<StudentAttributes[]>;
  getActiveCount(): Promise<number>;
  bulkAssignToNurse(studentIds: string[], nurseId: string, context: ExecutionContext): Promise<void>;
}
