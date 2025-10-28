/**
 * Student Service Interface
 * @description Interface for student service defining contract for dependency injection
 * Enables testability, mocking, and future service implementations
 */

import { IStudentRepository } from '../../repositories/interfaces/IStudentRepository';
import {
  Student,
  CreateStudentData,
  UpdateStudentData,
  StudentFilters,
  GradeStatistics
} from '../../repositories/interfaces/IStudentRepository';

/**
 * Student list result with pagination
 */
export interface StudentListResult {
  students: Student[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * Student profile with related data
 */
export interface StudentProfile extends Student {
  healthRecords?: any[];
  medications?: any[];
  emergencyContacts?: any[];
  upcomingAppointments?: any[];
}

/**
 * Student Service Interface
 * Defines all public methods for student management
 */
export interface IStudentService {
  /**
   * Get paginated list of students
   * @param page - Page number
   * @param limit - Items per page
   * @param filters - Optional filters
   * @returns Promise resolving to student list result
   */
  getStudents(page?: number, limit?: number, filters?: StudentFilters): Promise<StudentListResult>;

  /**
   * Get a single student by ID
   * @param id - Student ID
   * @returns Promise resolving to student or null
   */
  getStudentById(id: string): Promise<Student | null>;

  /**
   * Get student by student number
   * @param studentNumber - Student number
   * @returns Promise resolving to student or null
   */
  getStudentByNumber(studentNumber: string): Promise<Student | null>;

  /**
   * Get complete student profile with all related data
   * @param id - Student ID
   * @returns Promise resolving to student profile
   */
  getStudentProfile(id: string): Promise<StudentProfile | null>;

  /**
   * Create a new student
   * @param data - Student data
   * @returns Promise resolving to created student
   */
  createStudent(data: CreateStudentData): Promise<Student>;

  /**
   * Update an existing student
   * @param id - Student ID
   * @param data - Updated student data
   * @returns Promise resolving to updated student
   */
  updateStudent(id: string, data: UpdateStudentData): Promise<Student>;

  /**
   * Soft delete a student
   * @param id - Student ID
   * @returns Promise resolving when deletion is complete
   */
  deleteStudent(id: string): Promise<void>;

  /**
   * Search students by name
   * @param query - Search query
   * @param limit - Maximum results
   * @returns Promise resolving to matching students
   */
  searchStudents(query: string, limit?: number): Promise<Student[]>;

  /**
   * Get students assigned to a nurse
   * @param nurseId - Nurse user ID
   * @returns Promise resolving to assigned students
   */
  getStudentsByNurse(nurseId: string): Promise<Student[]>;

  /**
   * Get students by grade level
   * @param grade - Grade level
   * @returns Promise resolving to students in grade
   */
  getStudentsByGrade(grade: string): Promise<Student[]>;

  /**
   * Get student statistics by grade
   * @returns Promise resolving to grade statistics
   */
  getGradeStatistics(): Promise<GradeStatistics[]>;

  /**
   * Transfer student to different nurse
   * @param studentId - Student ID
   * @param newNurseId - New nurse user ID
   * @returns Promise resolving to updated student
   */
  transferStudent(studentId: string, newNurseId: string): Promise<Student>;

  /**
   * Get students with upcoming birthdays
   * @param daysAhead - Number of days to look ahead
   * @returns Promise resolving to students with birthdays
   */
  getUpcomingBirthdays(daysAhead: number): Promise<Student[]>;

  /**
   * Get students requiring medication today
   * @returns Promise resolving to students with medications due
   */
  getStudentsRequiringMedication(): Promise<Student[]>;
}

/**
 * Student CRUD Service Interface
 * Segregated interface for basic CRUD operations (ISP compliance)
 */
export interface IStudentCrudService {
  getStudents(page?: number, limit?: number, filters?: StudentFilters): Promise<StudentListResult>;
  getStudentById(id: string): Promise<Student | null>;
  getStudentByNumber(studentNumber: string): Promise<Student | null>;
  createStudent(data: CreateStudentData): Promise<Student>;
  updateStudent(id: string, data: UpdateStudentData): Promise<Student>;
  deleteStudent(id: string): Promise<void>;
}

/**
 * Student Query Service Interface
 * Segregated interface for query operations (ISP compliance)
 */
export interface IStudentQueryService {
  searchStudents(query: string, limit?: number): Promise<Student[]>;
  getStudentsByNurse(nurseId: string): Promise<Student[]>;
  getStudentsByGrade(grade: string): Promise<Student[]>;
  getGradeStatistics(): Promise<GradeStatistics[]>;
  getUpcomingBirthdays(daysAhead: number): Promise<Student[]>;
  getStudentsRequiringMedication(): Promise<Student[]>;
}

/**
 * Student Assignment Service Interface
 * Segregated interface for student assignment operations (ISP compliance)
 */
export interface IStudentAssignmentService {
  transferStudent(studentId: string, newNurseId: string): Promise<Student>;
  getStudentsByNurse(nurseId: string): Promise<Student[]>;
}
