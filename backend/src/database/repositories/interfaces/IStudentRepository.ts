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
