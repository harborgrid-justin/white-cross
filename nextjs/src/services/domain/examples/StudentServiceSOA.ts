/**
 * @fileoverview SOA-Compliant Student Service Implementation
 * @module services/domain/examples/StudentServiceSOA
 * @category Domain Services
 * 
 * Demonstrates complete SOA implementation with:
 * - Service contracts (interface-based)
 * - HTTP adapter (decoupled from business logic)
 * - Event-driven architecture
 * - Resilience patterns
 * - Service orchestration
 * 
 * This is a reference implementation showing how to properly structure
 * services according to SOA principles.
 */

import {
  IStudentService,
  StudentEnrollment,
  StudentTransfer,
  StudentProfile,
  QueryCriteria,
  CollectionResponse
} from '../contracts/ServiceContracts';
import { HttpServiceAdapter } from '../adapters/HttpServiceAdapter';
import { eventBus, StudentEnrolledEvent, StudentTransferredEvent, StudentWithdrawnEvent } from '../events';
import { HealthcareOperationType } from '../../resilience/types';
import { ResilientApiClient } from '../../core/ResilientApiClient';

/**
 * SOA-Compliant Student Service
 * 
 * Key SOA Principles Demonstrated:
 * 1. **Service Contract**: Implements IStudentService interface
 * 2. **Loose Coupling**: Uses adapter pattern for HTTP access
 * 3. **Event-Driven**: Publishes domain events for inter-service communication
 * 4. **Business-Focused**: Methods named after business operations, not HTTP verbs
 * 5. **Resilience**: Built on resilient API client
 * 6. **Single Responsibility**: Focuses only on student domain logic
 */
export class StudentServiceSOA implements IStudentService {
  private adapter: HttpServiceAdapter;
  private client: ResilientApiClient;

  constructor(client: ResilientApiClient) {
    this.client = client;
    this.adapter = new HttpServiceAdapter(client);
  }

  /**
   * Enroll a new student
   * Business operation: Student enrollment workflow
   */
  async enrollStudent(enrollment: StudentEnrollment): Promise<StudentProfile> {
    // Call HTTP adapter
    const response = await this.client.post<StudentProfile>(
      '/api/students',
      enrollment,
      HealthcareOperationType.CREATE_RECORD
    );

    const student = response.data;

    // Publish domain event for other services to react
    await eventBus.publish(
      new StudentEnrolledEvent(
        student.id,
        student.studentNumber,
        student.firstName,
        student.lastName
      )
    );

    return student;
  }

  /**
   * Transfer student to another school
   * Business operation: Student transfer workflow
   */
  async transferStudent(transfer: StudentTransfer): Promise<StudentProfile> {
    const response = await this.client.post<StudentProfile>(
      `/api/students/${transfer.studentId}/transfer`,
      {
        toSchoolId: transfer.toSchoolId,
        effectiveDate: transfer.effectiveDate,
        reason: transfer.reason
      },
      HealthcareOperationType.UPDATE_RECORD
    );

    const student = response.data;

    // Publish transfer event
    await eventBus.publish(
      new StudentTransferredEvent(
        transfer.studentId,
        transfer.fromSchoolId,
        transfer.toSchoolId
      )
    );

    return student;
  }

  /**
   * Withdraw student from school
   * Business operation: Student withdrawal
   */
  async withdrawStudent(studentId: string, reason: string): Promise<void> {
    await this.client.post(
      `/api/students/${studentId}/withdraw`,
      { reason },
      HealthcareOperationType.UPDATE_RECORD
    );

    // Publish withdrawal event
    await eventBus.publish(
      new StudentWithdrawnEvent(studentId, reason)
    );
  }

  /**
   * Get student profile
   * Business operation: Retrieve student information
   */
  async getStudentProfile(studentId: string): Promise<StudentProfile> {
    const response = await this.client.get<StudentProfile>(
      `/api/students/${studentId}`,
      HealthcareOperationType.VIEW_STUDENT_DATA
    );

    return response.data;
  }

  /**
   * Search students
   * Business operation: Find students matching criteria
   */
  async searchStudents(criteria: QueryCriteria): Promise<CollectionResponse<StudentProfile>> {
    const params = this.buildSearchParams(criteria);
    
    const response = await this.client.get<CollectionResponse<StudentProfile>>(
      '/api/students/search',
      HealthcareOperationType.STUDENT_LOOKUP,
      { params }
    );

    return response.data;
  }

  /**
   * Update student information
   * Business operation: Modify student details
   */
  async updateStudentInfo(
    studentId: string,
    updates: Partial<StudentProfile>
  ): Promise<StudentProfile> {
    const response = await this.client.put<StudentProfile>(
      `/api/students/${studentId}`,
      updates,
      HealthcareOperationType.UPDATE_RECORD
    );

    return response.data;
  }

  /**
   * Build search parameters from query criteria
   */
  private buildSearchParams(criteria: QueryCriteria): Record<string, unknown> {
    const params: Record<string, unknown> = {};

    if (criteria.filters) {
      Object.assign(params, criteria.filters);
    }

    if (criteria.pagination) {
      params.page = criteria.pagination.page;
      params.pageSize = criteria.pagination.pageSize;
    }

    if (criteria.sorting) {
      params.sortBy = criteria.sorting.map(s => s.field).join(',');
      params.sortOrder = criteria.sorting.map(s => s.direction).join(',');
    }

    return params;
  }
}

/**
 * Factory function to create SOA-compliant student service
 */
export function createStudentServiceSOA(client: ResilientApiClient): IStudentService {
  return new StudentServiceSOA(client);
}
