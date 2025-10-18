/**
 * LOC: 4258B8BFD8
 * WC-GEN-113 | IStudentRepository.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - IRepository.ts (database/repositories/interfaces/IRepository.ts)
 *
 * DOWNSTREAM (imported by):
 *   - RepositoryFactory.ts (database/repositories/RepositoryFactory.ts)
 *   - IUnitOfWork.ts (database/uow/IUnitOfWork.ts)
 *   - SequelizeUnitOfWork.ts (database/uow/SequelizeUnitOfWork.ts)
 */

/**
 * WC-GEN-113 | IStudentRepository.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ./IRepository | Dependencies: ./IRepository
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: interfaces | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Student Repository Interface
 */

import { IRepository } from './IRepository';

export interface Student {
  id: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  grade: string;
  gender: string;
  photo?: string;
  medicalRecordNum?: string;
  isActive: boolean;
  enrollmentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStudentDTO {
  studentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  grade: string;
  gender: string;
  photo?: string;
  medicalRecordNum?: string;
  nurseId?: string;
}

export interface UpdateStudentDTO {
  studentNumber?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  grade?: string;
  gender?: string;
  photo?: string;
  medicalRecordNum?: string;
  nurseId?: string;
  isActive?: boolean;
}

export interface IStudentRepository
  extends IRepository<Student, CreateStudentDTO, UpdateStudentDTO> {
  findByStudentNumber(studentNumber: string): Promise<Student | null>;
  findByMedicalRecordNumber(medicalRecordNum: string): Promise<Student | null>;
  findByGrade(grade: string): Promise<Student[]>;
  search(query: string): Promise<Student[]>;
}
