/**
 * @fileoverview Alert Service
 * @module infrastructure/websocket/services
 * @description Service for broadcasting alerts, notifications, and reminders via WebSocket
 */

import { Injectable, Logger } from '@nestjs/common';
import { BroadcastService } from './broadcast.service';
import { AlertData, NotificationData, ReminderData } from '../types/websocket.types';

import { BaseService } from '@/common/base';
@Injectable()
export class AlertService extends BaseService {
  constructor(private readonly broadcastService: BroadcastService) {}

  /**
   * Broadcasts an emergency alert to an organization
   */
  async broadcastEmergencyAlert(organizationId: string, alert: AlertData): Promise<void> {
    try {
      const alertData = {
        ...alert,
        priority: 'CRITICAL',
        timestamp: alert.timestamp || new Date().toISOString(),
      };

      await this.broadcastService.broadcastToOrganization(organizationId, 'emergency:alert', alertData);

      this.logInfo(`Emergency alert broadcasted to organization ${organizationId}`, {
        alertId: alert.id,
        severity: alert.severity,
      });
    } catch (error) {
      this.logError(
        `Failed to broadcast emergency alert to organization ${organizationId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Broadcasts a student health alert to an organization
   */
  async broadcastStudentHealthAlert(organizationId: string, alert: AlertData): Promise<void> {
    try {
      const alertData = {
        ...alert,
        timestamp: alert.timestamp || new Date().toISOString(),
      };

      await this.broadcastService.broadcastToOrganization(organizationId, 'student:health:alert', alertData);

      this.logInfo(`Student health alert broadcasted to organization ${organizationId}`, {
        studentId: alert.studentId,
        alertType: alert.type,
      });
    } catch (error) {
      this.logError(
        `Failed to broadcast student health alert to organization ${organizationId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Broadcasts a medication reminder to an organization
   */
  async broadcastMedicationReminder(organizationId: string, reminder: ReminderData): Promise<void> {
    try {
      const reminderData = {
        ...reminder,
        timestamp: new Date().toISOString(),
      };

      await this.broadcastService.broadcastToOrganization(organizationId, 'medication:reminder', reminderData);

      this.logInfo(`Medication reminder broadcasted to organization ${organizationId}`, {
        medicationId: reminder.medicationId,
        studentId: reminder.studentId,
      });
    } catch (error) {
      this.logError(
        `Failed to broadcast medication reminder to organization ${organizationId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Sends a notification to a specific user
   */
  async sendUserNotification(userId: string, notification: NotificationData): Promise<void> {
    try {
      const notificationData = {
        ...notification,
        timestamp: new Date().toISOString(),
      };

      await this.broadcastService.broadcastToUser(userId, 'health:notification', notificationData);

      this.logInfo(`Notification sent to user ${userId}`, {
        notificationId: notification.id,
        type: notification.type,
      });
    } catch (error) {
      this.logError(`Failed to send notification to user ${userId}`, error);
      throw error;
    }
  }

  /**
   * Broadcasts a generic alert to a school
   */
  async broadcastToSchool(schoolId: string, alert: AlertData): Promise<void> {
    try {
      const alertData = {
        ...alert,
        timestamp: alert.timestamp || new Date().toISOString(),
      };

      await this.broadcastService.broadcastToSchool(schoolId, 'school:alert', alertData);

      this.logDebug(`Alert broadcasted to school ${schoolId}`, {
        alertId: alert.id,
        severity: alert.severity,
      });
    } catch (error) {
      this.logError(`Failed to broadcast alert to school ${schoolId}`, error);
      throw error;
    }
  }

  /**
   * Broadcasts a generic alert to a student
   */
  async broadcastToStudent(studentId: string, alert: AlertData): Promise<void> {
    try {
      const alertData = {
        ...alert,
        timestamp: alert.timestamp || new Date().toISOString(),
      };

      await this.broadcastService.broadcastToStudent(studentId, 'student:alert', alertData);

      this.logDebug(`Alert broadcasted to student ${studentId}`, {
        alertId: alert.id,
        severity: alert.severity,
      });
    } catch (error) {
      this.logError(`Failed to broadcast alert to student ${studentId}`, error);
      throw error;
    }
  }
}
