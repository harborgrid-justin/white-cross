/**
 * Student Repository Interface
 * @description Repository interface for student entity operations
 * Extends base repository with student-specific methods
 */

import { IRepository } from './IRepository';

/**
 * Student entity type (matches database model)
 */
export interface Student {
  id: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  preferredName?: string;
  dateOfBirth: Date;
  grade: string;
  gender?: string;
  bloodType?: string;
  assignedNurseId?: string;
  schoolId?: string;
  enrollmentStatus: 'ACTIVE' | 'INACTIVE' | 'TRANSFERRED' | 'GRADUATED';
  enrollmentDate?: Date;
  photoUrl?: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Student repository interface
 */
export interface IStudentRepository extends IRepository<Student> {
  /**
   * Find student by student number (unique identifier)
   * @param studentNumber - Student number
   * @returns Promise resolving to student or null
   */
  findByStudentNumber(studentNumber: string): Promise<Student | null>;

  /**
   * Find all students assigned to a nurse
   * @param nurseId - Nurse user ID
   * @param options - Query options
   * @returns Promise resolving to students assigned to nurse
   */
  findByNurse(nurseId: string, options?: StudentQueryOptions): Promise<Student[]>;

  /**
   * Find students by grade level
   * @param grade - Grade level
   * @param options - Query options
   * @returns Promise resolving to students in grade
   */
  findByGrade(grade: string, options?: StudentQueryOptions): Promise<Student[]>;

  /**
   * Search students by name (first, last, or full name)
   * @param query - Search query
   * @param limit - Maximum results
   * @returns Promise resolving to matching students
   */
  searchByName(query: string, limit?: number): Promise<Student[]>;

  /**
   * Find students by enrollment status
   * @param status - Enrollment status
   * @param options - Query options
   * @returns Promise resolving to students with status
   */
  findByEnrollmentStatus(status: Student['enrollmentStatus'], options?: StudentQueryOptions): Promise<Student[]>;

  /**
   * Find students by school
   * @param schoolId - School ID
   * @param options - Query options
   * @returns Promise resolving to students at school
   */
  findBySchool(schoolId: string, options?: StudentQueryOptions): Promise<Student[]>;

  /**
   * Check if student number already exists
   * @param studentNumber - Student number
   * @param excludeId - ID to exclude from check (for updates)
   * @returns Promise resolving to true if exists
   */
  studentNumberExists(studentNumber: string, excludeId?: string): Promise<boolean>;

  /**
   * Get student with full health information
   * @param id - Student ID
   * @returns Promise resolving to student with health data
   */
  findWithHealthInfo(id: string): Promise<Student | null>;

  /**
   * Get student with emergency contacts
   * @param id - Student ID
   * @returns Promise resolving to student with emergency contacts
   */
  findWithEmergencyContacts(id: string): Promise<Student | null>;

  /**
   * Get student with medication information
   * @param id - Student ID
   * @returns Promise resolving to student with medications
   */
  findWithMedications(id: string): Promise<Student | null>;

  /**
   * Find students with upcoming birthdays
   * @param daysAhead - Number of days to look ahead
   * @returns Promise resolving to students with birthdays
   */
  findUpcomingBirthdays(daysAhead: number): Promise<Student[]>;

  /**
   * Get student statistics by grade
   * @returns Promise resolving to statistics by grade
   */
  getStatisticsByGrade(): Promise<GradeStatistics[]>;

  /**
   * Get student count by nurse
   * @returns Promise resolving to count by nurse
   */
  getCountByNurse(): Promise<Record<string, number>>;

  /**
   * Find students requiring medication administration
   * @param date - Date to check (default: today)
   * @returns Promise resolving to students with medications due
   */
  findRequiringMedication(date?: Date): Promise<Student[]>;
}

/**
 * Filters for student queries
 */
export interface StudentFilters {
  grade?: string | string[];
  enrollmentStatus?: Student['enrollmentStatus'] | Student['enrollmentStatus'][];
  assignedNurseId?: string;
  schoolId?: string;
  isActive?: boolean;
  gender?: string;
  bloodType?: string;
}

/**
 * Query options for students
 */
export interface StudentQueryOptions {
  page?: number;
  limit?: number;
  includeHealthRecords?: boolean;
  includeEmergencyContacts?: boolean;
  includeMedications?: boolean;
  includeNurse?: boolean;
  orderBy?: 'lastName' | 'firstName' | 'studentNumber' | 'grade' | 'createdAt';
  orderDirection?: 'ASC' | 'DESC';
}

/**
 * Grade statistics
 */
export interface GradeStatistics {
  grade: string;
  totalStudents: number;
  activeStudents: number;
  averageAge: number;
}

/**
 * Data for creating a new student
 */
export interface CreateStudentData {
  studentNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  preferredName?: string;
  dateOfBirth: Date;
  grade: string;
  gender?: string;
  bloodType?: string;
  assignedNurseId?: string;
  schoolId?: string;
  enrollmentStatus?: Student['enrollmentStatus'];
  enrollmentDate?: Date;
  photoUrl?: string;
  notes?: string;
}

/**
 * Data for updating a student
 */
export interface UpdateStudentData extends Partial<CreateStudentData> {
  isActive?: boolean;
}
