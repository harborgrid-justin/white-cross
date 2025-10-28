/**
 * Student Information System (SIS) API Client
 *
 * Integration client for SIS systems (PowerSchool, Infinite Campus, etc.)
 * Supports student enrollment sync and attendance data import.
 *
 * @module integrations/clients/SisApiClient
 */

import { BaseApiClient } from './BaseApiClient';
import { logger } from '../../utils/logger';

/**
 * Student enrollment data from SIS
 */
export interface SisStudent {
  sisId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  grade: string;
  enrollmentStatus: 'ACTIVE' | 'INACTIVE' | 'TRANSFERRED';
  enrollmentDate?: string;
  email?: string;
  phone?: string;
}

/**
 * Attendance record from SIS
 */
export interface SisAttendance {
  studentSisId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'TARDY' | 'EXCUSED';
  notes?: string;
}

/**
 * SIS API Client class
 */
export class SisApiClient extends BaseApiClient {
  constructor() {
    const baseURL = process.env.SIS_API_URL || 'https://sis-api.example.com';
    const apiKey = process.env.SIS_API_KEY || '';

    super('SIS', baseURL, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'X-API-Version': '2.0'
      },
      circuitBreaker: {
        failureThreshold: 5,
        timeout: 90000 // 90 seconds
      },
      rateLimit: {
        maxRequests: 1000,
        windowMs: 3600000 // 1 hour (typical SIS rate limit)
      }
    });
  }

  /**
   * Fetch all enrolled students
   */
  async getEnrolledStudents(organizationId: string): Promise<SisStudent[]> {
    try {
      logger.info('Fetching enrolled students from SIS', { organizationId });

      const response = await this.get<{ students: SisStudent[] }>(
        `/organizations/${organizationId}/students`,
        {
          params: {
            status: 'ACTIVE',
            includeInactive: false
          }
        }
      );

      logger.info(`Fetched ${response.data.students.length} students from SIS`);
      return response.data.students;
    } catch (error) {
      logger.error('Error fetching students from SIS', error);
      throw error;
    }
  }

  /**
   * Fetch student by SIS ID
   */
  async getStudentBySisId(sisId: string): Promise<SisStudent | null> {
    try {
      logger.info('Fetching student from SIS', { sisId });

      const response = await this.get<SisStudent>(`/students/${sisId}`);

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        logger.warn('Student not found in SIS', { sisId });
        return null;
      }

      logger.error('Error fetching student from SIS', error);
      throw error;
    }
  }

  /**
   * Fetch attendance records for date range
   */
  async getAttendanceRecords(
    organizationId: string,
    startDate: string,
    endDate: string
  ): Promise<SisAttendance[]> {
    try {
      logger.info('Fetching attendance records from SIS', {
        organizationId,
        startDate,
        endDate
      });

      const response = await this.get<{ attendance: SisAttendance[] }>(
        `/organizations/${organizationId}/attendance`,
        {
          params: {
            startDate,
            endDate
          }
        }
      );

      logger.info(`Fetched ${response.data.attendance.length} attendance records from SIS`);
      return response.data.attendance;
    } catch (error) {
      logger.error('Error fetching attendance from SIS', error);
      throw error;
    }
  }

  /**
   * Update student enrollment status
   */
  async updateEnrollmentStatus(
    sisId: string,
    status: 'ACTIVE' | 'INACTIVE' | 'TRANSFERRED'
  ): Promise<void> {
    try {
      logger.info('Updating student enrollment status in SIS', { sisId, status });

      await this.put(`/students/${sisId}/enrollment`, {
        status
      });

      logger.info('Student enrollment status updated in SIS', { sisId, status });
    } catch (error) {
      logger.error('Error updating enrollment status in SIS', error);
      throw error;
    }
  }

  /**
   * Sync students from SIS to White Cross
   * Returns array of students that need to be created/updated
   */
  async syncStudents(organizationId: string): Promise<SisStudent[]> {
    try {
      logger.info('Starting SIS student sync', { organizationId });

      const sisStudents = await this.getEnrolledStudents(organizationId);

      logger.info(`SIS sync complete: ${sisStudents.length} students`, { organizationId });

      return sisStudents;
    } catch (error) {
      logger.error('Error syncing students from SIS', error);
      throw error;
    }
  }
}

// Singleton instance
let sisApiClient: SisApiClient | null = null;

/**
 * Get or create SIS API client instance
 */
export function getSisApiClient(): SisApiClient {
  if (!sisApiClient) {
    sisApiClient = new SisApiClient();
  }
  return sisApiClient;
}

export default getSisApiClient;
