/**
 * Student Information System (SIS) API Client
 *
 * Integration client for Student Information Systems (PowerSchool, Infinite Campus, etc.).
 * Provides comprehensive functionality for:
 * - Student enrollment synchronization
 * - Attendance data import
 * - Student lookup by SIS ID
 * - Enrollment status management
 *
 * This service extends BaseApiClient to inherit circuit breaker, rate limiting,
 * and retry logic for robust communication with external SIS systems.
 *
 * @module integrations/clients/SisApiClient
 * @example
 * ```typescript
 * // Inject the service
 * constructor(private readonly sisApiClient: SisApiClient) {}
 *
 * // Fetch enrolled students
 * const students = await this.sisApiClient.getEnrolledStudents('org-123');
 *
 * // Get student by SIS ID
 * const student = await this.sisApiClient.getStudentBySisId('PS-12345');
 * ```
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { BaseApiClient } from './base-api.client';
import {
  SisStudentDto,
  SisAttendanceDto,
  SisEnrollmentStatus,
} from '../dto';

/**
 * Response wrapper for student list from SIS API
 */
interface SisStudentsResponse {
  students: SisStudentDto[];
}

/**
 * Response wrapper for attendance list from SIS API
 */
interface SisAttendanceResponse {
  attendance: SisAttendanceDto[];
}

/**
 * SIS API Client Service
 *
 * Provides methods for interacting with external Student Information Systems.
 * Implements circuit breaker pattern and rate limiting for reliable communication.
 */
@Injectable()
export class SisApiClient extends BaseApiClient {
  /**
   * Constructor
   *
   * Initializes the SIS API client with configuration from environment variables.
   * Sets up appropriate circuit breaker and rate limiting for typical SIS APIs.
   *
   * @param httpService - NestJS HttpService for making HTTP requests
   * @param configService - NestJS ConfigService for accessing environment variables
   */
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const baseURL =
      configService.get<string>('SIS_API_URL') ||
      'https://sis-api.example.com';
    const apiKey = configService.get<string>('SIS_API_KEY') || '';

    super('SIS', baseURL, httpService, new Logger(SisApiClient.name), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'X-API-Version': '2.0',
      },
      circuitBreaker: {
        failureThreshold: 5,
        successThreshold: 2,
        timeout: 90000, // 90 seconds - SIS systems can be slow
      },
      rateLimit: {
        maxRequests: 1000,
        windowMs: 3600000, // 1 hour (typical SIS rate limit)
      },
      retryAttempts: 3,
      retryDelay: 1000,
    });
  }

  /**
   * Fetch all enrolled students for an organization
   *
   * Retrieves active student enrollment records from the SIS system.
   * By default, only returns students with ACTIVE enrollment status.
   *
   * @param organizationId - Unique identifier for the organization/district
   * @returns Promise resolving to array of student DTOs
   * @throws {Error} If request fails or circuit breaker is open
   *
   * @example
   * ```typescript
   * const students = await sisApiClient.getEnrolledStudents('district-123');
   * console.log(`Found ${students.length} enrolled students`);
   * ```
   */
  async getEnrolledStudents(organizationId: string): Promise<SisStudentDto[]> {
    try {
      this.logger.log(
        `Fetching enrolled students from SIS for organization: ${organizationId}`,
      );

      const response = await this.get<SisStudentsResponse>(
        `/organizations/${organizationId}/students`,
        {
          params: {
            status: 'ACTIVE',
            includeInactive: false,
          },
        },
      );

      const students = response.data.students;
      this.logger.log(`Fetched ${students.length} students from SIS`);

      return students;
    } catch (error) {
      this.logger.error(
        `Error fetching students from SIS for organization: ${organizationId}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  /**
   * Fetch student by SIS ID
   *
   * Retrieves detailed information for a specific student using their SIS identifier.
   * Returns null if the student is not found (404 response).
   *
   * @param sisId - Unique SIS identifier for the student
   * @returns Promise resolving to student DTO or null if not found
   * @throws {Error} If request fails (except 404)
   *
   * @example
   * ```typescript
   * const student = await sisApiClient.getStudentBySisId('PS-12345');
   * if (student) {
   *   console.log(`Found student: ${student.firstName} ${student.lastName}`);
   * } else {
   *   console.log('Student not found');
   * }
   * ```
   */
  async getStudentBySisId(sisId: string): Promise<SisStudentDto | null> {
    try {
      this.logger.log(`Fetching student from SIS with ID: ${sisId}`);

      const response = await this.get<SisStudentDto>(`/students/${sisId}`);

      return response.data;
    } catch (error: any) {
      // Return null for 404 (student not found)
      if (error.response?.status === 404) {
        this.logger.warn(`Student not found in SIS with ID: ${sisId}`);
        return null;
      }

      // Re-throw other errors
      this.logger.error(
        `Error fetching student from SIS with ID: ${sisId}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  /**
   * Fetch attendance records for a date range
   *
   * Retrieves attendance data for all students in an organization within the specified
   * date range. Dates should be in ISO 8601 format (YYYY-MM-DD).
   *
   * @param organizationId - Unique identifier for the organization/district
   * @param startDate - Start date in ISO 8601 format (inclusive)
   * @param endDate - End date in ISO 8601 format (inclusive)
   * @returns Promise resolving to array of attendance DTOs
   * @throws {Error} If request fails or dates are invalid
   *
   * @example
   * ```typescript
   * const attendance = await sisApiClient.getAttendanceRecords(
   *   'district-123',
   *   '2024-01-01',
   *   '2024-01-31'
   * );
   * console.log(`Found ${attendance.length} attendance records for January`);
   * ```
   */
  async getAttendanceRecords(
    organizationId: string,
    startDate: string,
    endDate: string,
  ): Promise<SisAttendanceDto[]> {
    try {
      this.logger.log(
        `Fetching attendance records from SIS. Organization: ${organizationId}, Date range: ${startDate} to ${endDate}`,
      );

      const response = await this.get<SisAttendanceResponse>(
        `/organizations/${organizationId}/attendance`,
        {
          params: {
            startDate,
            endDate,
          },
        },
      );

      const attendance = response.data.attendance;
      this.logger.log(`Fetched ${attendance.length} attendance records from SIS`);

      return attendance;
    } catch (error) {
      this.logger.error(
        `Error fetching attendance from SIS. Organization: ${organizationId}, Date range: ${startDate} to ${endDate}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  /**
   * Update student enrollment status
   *
   * Updates the enrollment status for a student in the SIS system.
   * Common use cases include marking students as TRANSFERRED or INACTIVE.
   *
   * @param sisId - Unique SIS identifier for the student
   * @param status - New enrollment status
   * @throws {Error} If request fails or student not found
   *
   * @example
   * ```typescript
   * await sisApiClient.updateEnrollmentStatus(
   *   'PS-12345',
   *   SisEnrollmentStatus.TRANSFERRED
   * );
   * console.log('Student enrollment status updated successfully');
   * ```
   */
  async updateEnrollmentStatus(
    sisId: string,
    status: SisEnrollmentStatus,
  ): Promise<void> {
    try {
      this.logger.log(
        `Updating student enrollment status in SIS. Student: ${sisId}, New status: ${status}`,
      );

      await this.put(`/students/${sisId}/enrollment`, { status });

      this.logger.log(
        `Student enrollment status updated successfully. Student: ${sisId}, Status: ${status}`,
      );
    } catch (error) {
      this.logger.error(
        `Error updating enrollment status in SIS. Student: ${sisId}, Status: ${status}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  /**
   * Sync students from SIS to White Cross
   *
   * High-level method that fetches all enrolled students for an organization.
   * This is the primary entry point for student synchronization workflows.
   *
   * Returns an array of students that should be created or updated in the local system.
   * The calling service is responsible for comparing against existing records and
   * performing the necessary database operations.
   *
   * @param organizationId - Unique identifier for the organization/district
   * @returns Promise resolving to array of student DTOs to sync
   * @throws {Error} If request fails or circuit breaker is open
   *
   * @example
   * ```typescript
   * const studentsToSync = await sisApiClient.syncStudents('district-123');
   *
   * // Process students for sync
   * for (const sisStudent of studentsToSync) {
   *   await studentService.createOrUpdateFromSis(sisStudent);
   * }
   *
   * console.log(`Synced ${studentsToSync.length} students from SIS`);
   * ```
   */
  async syncStudents(organizationId: string): Promise<SisStudentDto[]> {
    try {
      this.logger.log(`Starting SIS student sync for organization: ${organizationId}`);

      const sisStudents = await this.getEnrolledStudents(organizationId);

      this.logger.log(
        `SIS sync complete. Retrieved ${sisStudents.length} students for organization: ${organizationId}`,
      );

      return sisStudents;
    } catch (error) {
      this.logger.error(
        `Error syncing students from SIS for organization: ${organizationId}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }
}
