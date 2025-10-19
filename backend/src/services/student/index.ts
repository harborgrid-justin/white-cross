/**
 * LOC: C41E6D37EC-I
 * WC-SVC-STU-INDEX | Student Service Main Export
 *
 * UPSTREAM (imports from):
 *   - studentService.ts (../studentService.ts) - Temporary during migration
 *
 * DOWNSTREAM (imported by):
 *   - students.ts (routes/students.ts)
 */

/**
 * WC-SVC-STU-INDEX | Student Service Main Export
 * Purpose: Migration wrapper - delegates to monolithic studentService until full refactoring
 * Upstream: ../studentService.ts (temporary) | Dependencies: Sequelize, validators
 * Downstream: Student routes | Called by: Application routes
 * Related: Student models, types, validation modules
 * Exports: StudentService class | Key Services: Complete student management
 * Last Updated: 2025-10-19 | File Type: .ts
 * Critical Path: Route → StudentService → Database → Response
 * LLM Context: HIPAA-compliant student management - migration in progress
 *
 * NOTE: This is a temporary facade during migration. The student service modules
 * (types.ts, validation.ts, queryBuilder.ts) exist but the main service logic
 * is still in the monolithic studentService.ts file. This will be fully modularized
 * in a future refactoring pass.
 */

// Re-export types
export * from './types';

// Temporary: Import from monolithic service until full refactoring is complete
// TODO: Replace with modular implementation
import { StudentService as MonolithicStudentService } from '../studentService';

/**
 * Student Service
 * Temporary facade that delegates to the monolithic implementation
 *
 * Future refactoring will create these modules:
 * - crudOperations.ts: Create, read, update, delete operations
 * - queryOperations.ts: Search, filtering, pagination
 * - statisticsOperations.ts: Student statistics and analytics
 * - transferOperations.ts: Student transfer and grade progression
 * - bulkOperations.ts: Bulk updates and batch operations
 * - exportOperations.ts: Data export functionality
 */
export class StudentService {
  /**
   * Get all students with pagination and filters
   */
  static async getStudents(page?: number, limit?: number, filters?: any) {
    return MonolithicStudentService.getStudents(page, limit, filters);
  }

  /**
   * Get student by ID with all associations
   */
  static async getStudentById(id: string) {
    return MonolithicStudentService.getStudentById(id);
  }

  /**
   * Create new student
   */
  static async createStudent(data: any) {
    return MonolithicStudentService.createStudent(data);
  }

  /**
   * Update student information
   */
  static async updateStudent(id: string, data: any) {
    return MonolithicStudentService.updateStudent(id, data);
  }

  /**
   * Delete student (soft delete)
   */
  static async deleteStudent(id: string) {
    return MonolithicStudentService.deleteStudent(id);
  }

  /**
   * Deactivate student
   */
  static async deactivateStudent(id: string, reason?: string) {
    // MonolithicStudentService.deactivateStudent only takes id parameter
    return MonolithicStudentService.deactivateStudent(id);
  }

  /**
   * Reactivate student
   */
  static async reactivateStudent(id: string) {
    return MonolithicStudentService.reactivateStudent(id);
  }

  /**
   * Search students across all fields
   */
  static async searchStudents(query: string, page?: number, limit?: number) {
    // MonolithicStudentService.searchStudents only takes query and limit
    return MonolithicStudentService.searchStudents(query, limit || 20);
  }

  /**
   * Get students by grade
   */
  static async getStudentsByGrade(grade: string) {
    return MonolithicStudentService.getStudentsByGrade(grade);
  }

  /**
   * Get all unique grades
   */
  static async getAllGrades() {
    return MonolithicStudentService.getAllGrades();
  }

  /**
   * Get students assigned to a specific nurse
   */
  static async getAssignedStudents(nurseId: string) {
    return MonolithicStudentService.getAssignedStudents(nurseId);
  }

  /**
   * Transfer student to different nurse or grade
   */
  static async transferStudent(id: string, data: any) {
    return MonolithicStudentService.transferStudent(id, data);
  }

  /**
   * Bulk update students
   */
  static async bulkUpdateStudents(updates: any[]) {
    // MonolithicStudentService.bulkUpdateStudents expects (studentIds, updateData)
    // This signature doesn't match - would need restructuring
    throw new Error('Method signature mismatch - needs implementation');
  }

  /**
   * Get student statistics
   */
  static async getStudentStatistics() {
    // MonolithicStudentService.getStudentStatistics requires studentId parameter
    throw new Error('Method signature mismatch - requires studentId parameter');
  }

  /**
   * Export student data
   */
  static async exportStudentData(studentIds?: string[]) {
    // MonolithicStudentService.exportStudentData expects single studentId
    if (studentIds && studentIds.length === 1) {
      return MonolithicStudentService.exportStudentData(studentIds[0]);
    }
    throw new Error('Method signature mismatch - supports single studentId only');
  }
}

// Re-export as default
export default StudentService;
