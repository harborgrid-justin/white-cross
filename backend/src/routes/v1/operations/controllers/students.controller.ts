/**
 * Students Controller
 * Business logic for student management and health records access
 */

import { ResponseToolkit } from '@hapi/hapi';
import { StudentService } from '../../../../services/student';
import { AuthenticatedRequest } from '../../../shared/types/route.types';
import {
  successResponse,
  createdResponse,
  paginatedResponse
} from '../../../shared/utils';
import { parsePagination, buildPaginationMeta, buildFilters } from '../../../shared/utils';

export class StudentsController {
  /**
   * Get all students with pagination and filters
   */
  static async list(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { page, limit } = parsePagination(request.query);

    const filters = buildFilters(request.query, {
      search: { type: 'string' },
      grade: { type: 'string' },
      isActive: { type: 'boolean' },
      nurseId: { type: 'string' },
      hasAllergies: { type: 'boolean' },
      hasMedications: { type: 'boolean' }
    });

    const result = await StudentService.getStudents(page, limit, filters);

    return paginatedResponse(
      h,
      result.students || result.data,
      buildPaginationMeta(page, limit, result.total)
    );
  }

  /**
   * Get student by ID
   */
  static async getById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const student = await StudentService.getStudentById(id);

    return successResponse(h, { student });
  }

  /**
   * Create new student
   */
  static async create(request: AuthenticatedRequest, h: ResponseToolkit) {
    const student = await StudentService.createStudent({
      ...request.payload,
      dateOfBirth: new Date(request.payload.dateOfBirth)
    });

    return createdResponse(h, { student });
  }

  /**
   * Update student information
   */
  static async update(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;

    const updateData = { ...request.payload };
    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }

    const student = await StudentService.updateStudent(id, updateData);

    return successResponse(h, { student });
  }

  /**
   * Deactivate student (soft delete)
   */
  static async deactivate(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const { reason } = request.payload;

    const student = await StudentService.deactivateStudent(id, reason);

    return successResponse(h, { student });
  }

  /**
   * Transfer student to different nurse
   */
  static async transfer(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const { nurseId } = request.payload;

    const student = await StudentService.transferStudent(id, nurseId);

    return successResponse(h, { student });
  }

  /**
   * Get students by grade
   */
  static async getByGrade(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { grade } = request.params;
    const students = await StudentService.getStudentsByGrade(grade);

    return successResponse(h, { students });
  }

  /**
   * Search students by query
   */
  static async search(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { query } = request.params;
    const students = await StudentService.searchStudents(query);

    return successResponse(h, { students });
  }

  /**
   * Get students assigned to current user (nurse)
   */
  static async getAssigned(request: AuthenticatedRequest, h: ResponseToolkit) {
    const userId = request.auth.credentials.userId;
    const students = await StudentService.getAssignedStudents(userId);

    return successResponse(h, { students });
  }

  /**
   * Get student's health records
   */
  static async getHealthRecords(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;

    const result = await StudentService.getStudentHealthRecords(id, page, limit);

    return paginatedResponse(
      h,
      result.records || result.data,
      buildPaginationMeta(page, limit, result.total)
    );
  }

  /**
   * Get student's mental health records
   */
  static async getMentalHealthRecords(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;

    const result = await StudentService.getStudentMentalHealthRecords(id, page, limit);

    return paginatedResponse(
      h,
      result.records || result.data,
      buildPaginationMeta(page, limit, result.total)
    );
  }
}
