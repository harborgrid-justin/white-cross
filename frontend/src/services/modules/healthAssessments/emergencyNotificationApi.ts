/**
 * Emergency Notification API Module
 *
 * Handles critical emergency health notifications and incident tracking.
 * Triggers automatic contact notification system for urgent situations.
 *
 * @module HealthAssessments/EmergencyNotificationApi
 * @version 2.0.0
 * @since 2025-10-24
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse, PaginatedResponse, buildPaginationParams } from '../../utils/apiUtils';
import { createApiError } from '../../core/errors';
import { auditService, AuditAction, AuditResourceType, AuditStatus } from '../../audit';
import { z } from 'zod';
import { createEmergencyNotificationSchema } from './validationSchemas';
import type {
  EmergencyNotification,
  CreateEmergencyNotificationRequest,
  EmergencySeverity,
  EmergencyType,
} from './types';

/**
 * Query parameters for emergency history
 */
export interface EmergencyHistoryQueryParams {
  startDate?: string;
  endDate?: string;
  severity?: EmergencySeverity;
  emergencyType?: EmergencyType;
  page?: number;
  limit?: number;
}

/**
 * Emergency Notification API Service
 *
 * Provides methods for:
 * - Sending critical emergency notifications
 * - Retrieving emergency incident history
 */
export class EmergencyNotificationApi {
  constructor(private readonly client: ApiClient) {}

  /**
   * Send emergency health notification
   *
   * CRITICAL: Triggers emergency notification system for urgent health
   * situations. Automatically contacts parents, emergency contacts, and
   * medical staff based on severity.
   *
   * @param notificationData - Emergency notification details
   * @returns Created emergency notification with contact confirmations
   * @throws {ValidationError} If validation fails
   * @throws {ApiError} If notification fails to send
   *
   * @example
   * ```typescript
   * const notification = await emergencyNotificationApi.sendEmergencyNotification({
   *   studentId: 'student-uuid',
   *   emergencyType: 'ALLERGIC_REACTION',
   *   severity: 'CRITICAL',
   *   description: 'Student experiencing anaphylaxis after peanut exposure',
   *   location: 'Cafeteria',
   *   actionsTaken: [
   *     'Administered EpiPen',
   *     'Called 911',
   *     'Student lying down with feet elevated'
   *   ],
   *   vitalSigns: {
   *     bloodPressure: '90/60',
   *     heartRate: 120,
   *     oxygenSaturation: 94
   *   }
   * });
   * ```
   */
  async sendEmergencyNotification(
    notificationData: CreateEmergencyNotificationRequest
  ): Promise<EmergencyNotification> {
    try {
      // Validate request data
      createEmergencyNotificationSchema.parse(notificationData);

      const response = await this.client.post<ApiResponse<EmergencyNotification>>(
        '/health-assessments/emergency/notify',
        notificationData
      );

      const notification = response.data.data!;

      // CRITICAL: Immediate audit log for emergency
      await auditService.log({
        action: AuditAction.CREATE_HEALTH_RECORD,
        resourceType: AuditResourceType.HEALTH_RECORD,
        resourceId: notification.id,
        studentId: notificationData.studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          recordType: 'emergency_notification',
          emergencyType: notificationData.emergencyType,
          severity: notificationData.severity,
          location: notificationData.location,
          contactsNotified: notification.notifiedContacts.length,
        },
      });

      return notification;
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        throw createApiError(error, `Validation error: ${error.errors[0].message}`);
      }

      // CRITICAL: Log failed emergency notification attempt
      await auditService.log({
        action: AuditAction.CREATE_HEALTH_RECORD,
        resourceType: AuditResourceType.HEALTH_RECORD,
        studentId: notificationData.studentId,
        status: AuditStatus.FAILURE,
        isPHI: true,
        context: {
          error: error instanceof Error ? error.message : 'Unknown error',
          emergencyType: notificationData.emergencyType,
          severity: notificationData.severity,
        },
      });
      throw createApiError(error, 'CRITICAL: Failed to send emergency notification');
    }
  }

  /**
   * Get emergency notification history for a student
   *
   * Retrieves history of emergency notifications including incident
   * details, response times, and outcomes.
   *
   * @param studentId - Student UUID
   * @param params - Filter and pagination parameters
   * @returns Paginated emergency notification history
   * @throws {ApiError} If query fails
   *
   * @example
   * ```typescript
   * const emergencies = await emergencyNotificationApi.getEmergencyHistory('student-uuid', {
   *   startDate: '2025-01-01',
   *   severity: 'HIGH',
   *   page: 1,
   *   limit: 20
   * });
   * ```
   */
  async getEmergencyHistory(
    studentId: string,
    params?: EmergencyHistoryQueryParams
  ): Promise<PaginatedResponse<EmergencyNotification>> {
    try {
      if (!studentId) {
        throw new Error('Student ID is required');
      }

      const paginationParams = buildPaginationParams(params?.page, params?.limit);
      const allParams = params ? { ...paginationParams, ...params } : paginationParams;

      const response = await this.client.get<PaginatedResponse<EmergencyNotification>>(
        `/health-assessments/emergency/${studentId}`,
        { params: allParams }
      );

      // Audit PHI access
      await auditService.log({
        action: AuditAction.VIEW_HEALTH_RECORDS,
        resourceType: AuditResourceType.HEALTH_RECORD,
        studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          recordType: 'emergency_notifications',
          resultCount: response.data.data.length,
          severity: params?.severity,
        },
      });

      return response.data;
    } catch (error) {
      await auditService.log({
        action: AuditAction.VIEW_HEALTH_RECORDS,
        resourceType: AuditResourceType.HEALTH_RECORD,
        studentId,
        status: AuditStatus.FAILURE,
        isPHI: true,
        context: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
      throw createApiError(error, 'Failed to fetch emergency history');
    }
  }
}
