/**
 * @fileoverview Students Controller - Business logic for student management and health records access
 *
 * Handles CRUD operations for student enrollment, demographic management, nurse assignments,
 * and access to health records. All operations are PHI-protected with comprehensive audit logging.
 *
 * Key responsibilities:
 * - Student enrollment and profile management
 * - Nurse-student assignment and transfers
 * - Health records access control (standard and mental health)
 * - Search and filtering for quick student lookup
 * - Grade-based organization and management
 *
 * @module operations/controllers/students
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

/**
 * Students Controller
 *
 * Manages student lifecycle operations including enrollment, updates, assignments,
 * and health record access. Implements role-based access control and maintains
 * comprehensive audit trails for all PHI access.
 *
 * @class StudentsController
 */
export class StudentsController {
  /**
   * List all students with pagination and advanced filtering
   *
   * Returns paginated list of students with support for multiple filter criteria.
   * Commonly used for nurse dashboards, administrative reports, and student lookup.
   * Filters include search by name/ID, grade level, assigned nurse, active status,
   * and health conditions (allergies, medications).
   *
   * @param {AuthenticatedRequest} request - Authenticated HTTP request containing:
   *   - query.page: Page number for pagination (default: 1)
   *   - query.limit: Items per page (default: 20, max: 100)
   *   - query.search: Search term for student name or student ID
   *   - query.grade: Filter by grade level (e.g., "K", "1", "2")
   *   - query.isActive: Filter by active enrollment status
   *   - query.nurseId: Filter by assigned nurse UUID
   *   - query.hasAllergies: Filter students with documented allergies
   *   - query.hasMedications: Filter students with active medications
   *   - auth.credentials: JWT credentials for access control
   * @param {ResponseToolkit} h - Hapi response toolkit for HTTP response construction
   * @returns {Promise<Response>} HTTP 200 response with:
   *   - data: Array of student objects with demographics and health summary
   *   - pagination: {page, limit, total, totalPages} metadata
   * @throws {ValidationError} When query parameters fail validation
   * @throws {AuthorizationError} When user lacks student access permissions
   *
   * @example
   * // School nurse searching for students with allergies in grade 3
   * const request = {
   *   query: {
   *     grade: '3',
   *     hasAllergies: true,
   *     page: 1,
   *     limit: 20
   *   },
   *   auth: { credentials: { userId: 'nurse-uuid', roles: ['NURSE'] } }
   * };
   * const response = await StudentsController.list(request, h);
   * // Returns: {
   * //   data: [{ id: 'uuid', firstName: 'John', grade: '3', allergies: [...] }],
   * //   pagination: { page: 1, limit: 20, total: 45, totalPages: 3 }
   * // }
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
   * Get student by ID with complete profile information
   *
   * Retrieves detailed student information including demographics, emergency contacts,
   * and health summary. This is a highly sensitive PHI endpoint with comprehensive
   * audit logging. Access is restricted to assigned nurses and administrators.
   *
   * @param {AuthenticatedRequest} request - Authenticated HTTP request containing:
   *   - params.id: Student UUID to retrieve
   *   - auth.credentials: JWT credentials with userId and roles
   * @param {ResponseToolkit} h - Hapi response toolkit for HTTP response construction
   * @returns {Promise<Response>} HTTP 200 response with:
   *   - student: Complete student object with demographics, emergency contacts, health summary
   * @throws {NotFoundError} When student ID does not exist in database
   * @throws {AuthorizationError} When user is not assigned nurse or admin
   *
   * @example
   * // Nurse accessing assigned student profile
   * const request = {
   *   params: { id: 'student-uuid-123' },
   *   auth: { credentials: { userId: 'nurse-uuid', roles: ['NURSE'] } }
   * };
   * const response = await StudentsController.getById(request, h);
   * // Returns: {
   * //   student: {
   * //     id: 'student-uuid-123',
   * //     firstName: 'Jane',
   * //     lastName: 'Doe',
   * //     emergencyContacts: [...],
   * //     healthSummary: { allergies: [...], medications: [...] }
   * //   }
   * // }
   */
  static async getById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const student = await StudentService.getStudentById(id);

    return successResponse(h, { student });
  }

  /**
   * Create new student enrollment
   *
   * Enrolls a new student in the healthcare management system. Validates all required
   * demographic information, assigns to a nurse (optional), and creates audit trail entry.
   * Business rules enforced: date of birth cannot be future date, blood type must be
   * valid format, student number must be unique within the school.
   *
   * @param {AuthenticatedRequest} request - Authenticated HTTP request containing:
   *   - payload: Student creation data with demographics and enrollment info
   *   - payload.firstName: Student first name (required, 1-100 chars)
   *   - payload.lastName: Student last name (required, 1-100 chars)
   *   - payload.dateOfBirth: ISO date, must be past date
   *   - payload.grade: Grade level (e.g., "K", "1", "2")
   *   - payload.studentNumber: Unique school-assigned ID
   *   - payload.gender: MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY
   *   - payload.nurseId: Optional assigned nurse UUID
   *   - auth.credentials: JWT credentials (requires ADMIN or NURSE role)
   * @param {ResponseToolkit} h - Hapi response toolkit for HTTP response construction
   * @returns {Promise<Response>} HTTP 201 response with:
   *   - student: Newly created student object with assigned UUID
   * @throws {ValidationError} When payload fails validation (invalid dates, formats, etc.)
   * @throws {ConflictError} When student number already exists
   * @throws {NotFoundError} When assigned nurse UUID does not exist
   * @throws {AuthorizationError} When user lacks ADMIN or NURSE role
   *
   * @example
   * // School nurse enrolling new kindergarten student
   * const request = {
   *   payload: {
   *     firstName: 'Emily',
   *     lastName: 'Smith',
   *     dateOfBirth: '2018-09-15',
   *     grade: 'K',
   *     studentNumber: 'STU-2024-0123',
   *     gender: 'FEMALE',
   *     nurseId: 'nurse-uuid-456'
   *   },
   *   auth: { credentials: { userId: 'nurse-uuid-456', roles: ['NURSE'] } }
   * };
   * const response = await StudentsController.create(request, h);
   * // Returns: { student: { id: 'new-uuid', firstName: 'Emily', ... } }
   */
  static async create(request: AuthenticatedRequest, h: ResponseToolkit) {
    // Filter out fields that don't exist in the Student model
    const { schoolId, districtId, ...studentData } = request.payload as any;

    const student = await StudentService.createStudent({
      ...studentData,
      dateOfBirth: new Date(studentData.dateOfBirth)
    });

    return createdResponse(h, { student });
  }

  /**
   * Update student demographic and enrollment information
   *
   * Updates student profile with new demographic data, emergency contacts, or
   * school assignment information. Does not modify health records (use dedicated
   * health record endpoints). All changes are logged for compliance. Business rule:
   * Assigned nurses can only update their assigned students unless they have admin role.
   *
   * @param {AuthenticatedRequest} request - Authenticated HTTP request containing:
   *   - params.id: Student UUID to update
   *   - payload: Partial student data to update (at least one field required)
   *   - payload.firstName: Updated first name (optional)
   *   - payload.lastName: Updated last name (optional)
   *   - payload.grade: Updated grade level (optional)
   *   - payload.nurseId: Change assigned nurse (optional)
   *   - payload.isActive: Change enrollment status (optional)
   *   - auth.credentials: JWT credentials with access permissions
   * @param {ResponseToolkit} h - Hapi response toolkit for HTTP response construction
   * @returns {Promise<Response>} HTTP 200 response with:
   *   - student: Updated student object with all current data
   * @throws {NotFoundError} When student ID does not exist
   * @throws {ValidationError} When update payload fails validation
   * @throws {AuthorizationError} When nurse attempts to update non-assigned student
   *
   * @example
   * // Update student grade level for new school year
   * const request = {
   *   params: { id: 'student-uuid-123' },
   *   payload: { grade: '4' },
   *   auth: { credentials: { userId: 'nurse-uuid', roles: ['NURSE'] } }
   * };
   * const response = await StudentsController.update(request, h);
   * // Returns: { student: { id: 'student-uuid-123', grade: '4', ... } }
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
   * Deactivate student enrollment (soft delete)
   *
   * Marks student as inactive due to withdrawal, transfer, or graduation. This is a
   * soft delete operation that preserves all historical health records for compliance.
   * Requires detailed reason for audit trail. Business rule: Does not delete any data,
   * only sets isActive=false. Student and health records remain in system for historical
   * reference and compliance reporting.
   *
   * @param {AuthenticatedRequest} request - Authenticated HTTP request containing:
   *   - params.id: Student UUID to deactivate
   *   - payload.reason: Required deactivation reason (5-500 characters)
   *     Examples: "Graduated", "Transferred to another school", "Withdrawn by parent"
   *   - auth.credentials: JWT credentials (requires ADMIN role)
   * @param {ResponseToolkit} h - Hapi response toolkit for HTTP response construction
   * @returns {Promise<Response>} HTTP 200 response with:
   *   - student: Deactivated student object with isActive=false
   * @throws {NotFoundError} When student ID does not exist
   * @throws {ValidationError} When reason is missing or invalid (too short/long)
   * @throws {AuthorizationError} When user lacks ADMIN role
   *
   * @example
   * // Admin deactivating student who graduated
   * const request = {
   *   params: { id: 'student-uuid-123' },
   *   payload: { reason: 'Student graduated and moved to middle school' },
   *   auth: { credentials: { userId: 'admin-uuid', roles: ['ADMIN'] } }
   * };
   * const response = await StudentsController.deactivate(request, h);
   * // Returns: { student: { id: 'student-uuid-123', isActive: false, ... } }
   */
  static async deactivate(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const { reason } = request.payload;

    const student = await StudentService.deactivateStudent(id, reason);

    return successResponse(h, { student });
  }

  /**
   * Transfer student to different nurse assignment
   *
   * Reassigns student to a different nurse, typically due to nurse schedule changes,
   * student relocation, or workload balancing. Creates audit trail entry for care
   * handoff. Business rule: Previous nurse retains read-only access to historical
   * health records for continuity of care.
   *
   * @param {AuthenticatedRequest} request - Authenticated HTTP request containing:
   *   - params.id: Student UUID to transfer
   *   - payload.nurseId: New nurse UUID to assign student to
   *   - auth.credentials: JWT credentials (requires ADMIN role)
   * @param {ResponseToolkit} h - Hapi response toolkit for HTTP response construction
   * @returns {Promise<Response>} HTTP 200 response with:
   *   - student: Updated student object with new nurse assignment
   * @throws {NotFoundError} When student ID or nurse ID does not exist
   * @throws {ValidationError} When nurse ID format is invalid
   * @throws {AuthorizationError} When user lacks ADMIN role
   *
   * @example
   * // Admin transferring student to new nurse
   * const request = {
   *   params: { id: 'student-uuid-123' },
   *   payload: { nurseId: 'new-nurse-uuid-789' },
   *   auth: { credentials: { userId: 'admin-uuid', roles: ['ADMIN'] } }
   * };
   * const response = await StudentsController.transfer(request, h);
   * // Returns: { student: { id: 'student-uuid-123', nurseId: 'new-nurse-uuid-789', ... } }
   */
  static async transfer(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const { nurseId } = request.payload;

    const student = await StudentService.transferStudent(id, nurseId);

    return successResponse(h, { student });
  }

  /**
   * Get all students in a specific grade level
   *
   * Retrieves all active students enrolled in a specific grade. Useful for grade-level
   * health screenings, immunization compliance reports, and class-based health programs.
   * Commonly used for organizing school-wide health initiatives by grade.
   *
   * @param {AuthenticatedRequest} request - Authenticated HTTP request containing:
   *   - params.grade: Grade level to filter by (e.g., "K", "1", "2", "12")
   *   - auth.credentials: JWT credentials for access control
   * @param {ResponseToolkit} h - Hapi response toolkit for HTTP response construction
   * @returns {Promise<Response>} HTTP 200 response with:
   *   - students: Array of student objects in the specified grade
   * @throws {NotFoundError} When no students found for the specified grade
   * @throws {ValidationError} When grade parameter is invalid
   *
   * @example
   * // Nurse retrieving all kindergarten students for vision screening
   * const request = {
   *   params: { grade: 'K' },
   *   auth: { credentials: { userId: 'nurse-uuid', roles: ['NURSE'] } }
   * };
   * const response = await StudentsController.getByGrade(request, h);
   * // Returns: { students: [{ id: 'uuid', firstName: 'Alice', grade: 'K' }, ...] }
   */
  static async getByGrade(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { grade } = request.params;
    const students = await StudentService.getStudentsByGrade(grade);

    return successResponse(h, { students });
  }

  /**
   * Search students by name or student ID
   *
   * Performs fuzzy search on student names (first/last) and exact match on student ID.
   * Returns partial matches to support quick student lookup in emergency situations.
   * Critical for fast student identification when time is sensitive.
   *
   * @param {AuthenticatedRequest} request - Authenticated HTTP request containing:
   *   - params.query: Search query string (minimum 1 character)
   *   - auth.credentials: JWT credentials for access control
   * @param {ResponseToolkit} h - Hapi response toolkit for HTTP response construction
   * @returns {Promise<Response>} HTTP 200 response with:
   *   - students: Array of matching student objects
   * @throws {ValidationError} When query is empty or too short
   *
   * @example
   * // Nurse searching for student during emergency
   * const request = {
   *   params: { query: 'smith' },
   *   auth: { credentials: { userId: 'nurse-uuid', roles: ['NURSE'] } }
   * };
   * const response = await StudentsController.search(request, h);
   * // Returns: {
   * //   students: [
   * //     { id: 'uuid-1', firstName: 'John', lastName: 'Smith', grade: '5' },
   * //     { id: 'uuid-2', firstName: 'Emily', lastName: 'Smithson', grade: '3' }
   * //   ]
   * // }
   */
  static async search(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { query } = request.params;
    const students = await StudentService.searchStudents(query);

    return successResponse(h, { students });
  }

  /**
   * Get all students assigned to the authenticated nurse
   *
   * Retrieves the nurse's complete student caseload. Used for nurse dashboard
   * "My Students" view and daily task organization. Automatically filters by
   * authenticated user's ID, ensuring nurses only see their assigned students.
   *
   * @param {AuthenticatedRequest} request - Authenticated HTTP request containing:
   *   - auth.credentials.userId: Extracted to filter assigned students
   *   - auth.credentials.roles: Must include NURSE role
   * @param {ResponseToolkit} h - Hapi response toolkit for HTTP response construction
   * @returns {Promise<Response>} HTTP 200 response with:
   *   - students: Array of student objects assigned to this nurse
   * @throws {AuthorizationError} When user does not have NURSE role
   *
   * @example
   * // Nurse loading their daily student roster
   * const request = {
   *   auth: { credentials: { userId: 'nurse-uuid-456', roles: ['NURSE'] } }
   * };
   * const response = await StudentsController.getAssigned(request, h);
   * // Returns: {
   * //   students: [
   * //     { id: 'uuid-1', firstName: 'Alex', nurseId: 'nurse-uuid-456' },
   * //     { id: 'uuid-2', firstName: 'Maria', nurseId: 'nurse-uuid-456' }
   * //   ]
   * // }
   */
  static async getAssigned(request: AuthenticatedRequest, h: ResponseToolkit) {
    const userId = request.auth.credentials.userId;
    const students = await StudentService.getAssignedStudents(userId);

    return successResponse(h, { students });
  }

  /**
   * Get student's health records with pagination
   *
   * Retrieves paginated list of all health records for a student including medications,
   * allergies, immunizations, and visit logs. This is a highly sensitive PHI endpoint
   * with full audit trail maintained. Access restricted to assigned nurse or admin.
   *
   * @param {AuthenticatedRequest} request - Authenticated HTTP request containing:
   *   - params.id: Student UUID to retrieve health records for
   *   - query.page: Page number for pagination (default: 1)
   *   - query.limit: Items per page (default: 20, max: 100)
   *   - auth.credentials: JWT credentials (requires assigned nurse or admin)
   * @param {ResponseToolkit} h - Hapi response toolkit for HTTP response construction
   * @returns {Promise<Response>} HTTP 200 response with:
   *   - data: Array of health record objects
   *   - pagination: {page, limit, total, totalPages} metadata
   * @throws {NotFoundError} When student ID does not exist
   * @throws {AuthorizationError} When user is not assigned nurse or admin
   *
   * @example
   * // Assigned nurse reviewing student's medical history
   * const request = {
   *   params: { id: 'student-uuid-123' },
   *   query: { page: 1, limit: 20 },
   *   auth: { credentials: { userId: 'nurse-uuid', roles: ['NURSE'] } }
   * };
   * const response = await StudentsController.getHealthRecords(request, h);
   * // Returns: {
   * //   data: [
   * //     { id: 'record-1', type: 'MEDICATION', description: 'Albuterol inhaler', ... },
   * //     { id: 'record-2', type: 'ALLERGY', description: 'Peanut allergy', ... }
   * //   ],
   * //   pagination: { page: 1, limit: 20, total: 45, totalPages: 3 }
   * // }
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
   * Get student's mental health records with pagination
   *
   * Retrieves paginated mental health records including counseling sessions, behavioral
   * assessments, and crisis interventions. EXTREMELY SENSITIVE PHI ENDPOINT with extra
   * protection due to stigma concerns. Strict access control - mental health specialist
   * or admin only. All access logged for compliance and ethical review.
   *
   * @param {AuthenticatedRequest} request - Authenticated HTTP request containing:
   *   - params.id: Student UUID to retrieve mental health records for
   *   - query.page: Page number for pagination (default: 1)
   *   - query.limit: Items per page (default: 20, max: 100)
   *   - auth.credentials: JWT credentials (requires mental health specialist or admin)
   * @param {ResponseToolkit} h - Hapi response toolkit for HTTP response construction
   * @returns {Promise<Response>} HTTP 200 response with:
   *   - data: Array of mental health record objects
   *   - pagination: {page, limit, total, totalPages} metadata
   * @throws {NotFoundError} When student ID does not exist
   * @throws {AuthorizationError} When user lacks mental health specialist or admin role
   *
   * @example
   * // Mental health specialist reviewing student counseling history
   * const request = {
   *   params: { id: 'student-uuid-123' },
   *   query: { page: 1, limit: 10 },
   *   auth: { credentials: { userId: 'specialist-uuid', roles: ['MENTAL_HEALTH_SPECIALIST'] } }
   * };
   * const response = await StudentsController.getMentalHealthRecords(request, h);
   * // Returns: {
   * //   data: [
   * //     { id: 'mh-1', type: 'COUNSELING_SESSION', date: '2024-10-20', ... },
   * //     { id: 'mh-2', type: 'BEHAVIORAL_ASSESSMENT', date: '2024-09-15', ... }
   * //   ],
   * //   pagination: { page: 1, limit: 10, total: 12, totalPages: 2 }
   * // }
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
