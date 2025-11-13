/**
 * @fileoverview Alerts Service - Refactored Implementation
 * @module alerts/alerts.service
 * @description Main alert service that delegates to specialized services for focused responsibilities
 *
 * Responsibilities:
 * - Alert creation and lifecycle management
 * - Coordination between specialized services
 * - Public API for alert operations
 *
 * Delegates to:
 * - AlertDeliveryService: Multi-channel delivery
 * - AlertPreferencesService: User preferences
 * - AlertStatisticsService: Statistics and reporting
 * - AlertRetryService: Retry logic and scheduling
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateAlertDto } from './dto';
import { Alert, AlertStatus, AlertPreferences } from '@/database';
import { Op } from 'sequelize';
import { BaseService } from '@/common/base';
import { AlertDeliveryService } from '@/services/alert-delivery.service';
import { AlertPreferencesService } from '@/services/alert-preferences.service';
import { AlertStatisticsService, AlertStatistics } from '@/services/alert-statistics.service';
import { AlertRetryService } from '@/services/alert-retry.service';
import { AlertNotFoundException } from './exceptions/alert.exceptions';

// Re-export common interfaces and enums
export { AlertStatus } from '@/database';
export { AlertStatistics } from '@/services/alert-statistics.service';

@Injectable()
export class AlertsService extends BaseService {
  constructor(
    @InjectModel(Alert)
    private readonly alertModel: typeof Alert,
    private readonly deliveryService: AlertDeliveryService,
    private readonly preferencesService: AlertPreferencesService,
    private readonly statisticsService: AlertStatisticsService,
    private readonly retryService: AlertRetryService,
  ) {
    super('AlertsService');
  }

  /**
   * Create and broadcast a new alert
   */
  async createAlert(data: CreateAlertDto, createdBy: string): Promise<Alert> {
    this.logInfo(`Creating alert: ${data.title} [${data.severity}]`);

    // Create alert in database
    const alert = await this.alertModel.create({
      ...data,
      status: AlertStatus.ACTIVE,
      createdBy,
      requiresAcknowledgment: data.requiresAcknowledgment ?? false,
    });

    // Delegate delivery to delivery service
    await this.deliveryService.deliverAlert(alert);

    // Schedule auto-escalation if configured
    if (data.autoEscalateAfter) {
      this.retryService.scheduleAutoEscalation(alert.id, data.autoEscalateAfter);
    }

    // Schedule expiration if configured
    if (data.expiresAt) {
      this.retryService.scheduleExpiration(alert.id, data.expiresAt);
    }

    this.logInfo(`Alert created successfully: ${alert.id}`);
    return alert;
  }

  /**
   * Mark alert as read/acknowledged
   */
  async markAsRead(alertId: string, userId: string): Promise<Alert> {
    const alert = await this.alertModel.findByPk(alertId);

    if (!alert) {
      throw new AlertNotFoundException(alertId);
    }

    alert.status = AlertStatus.ACKNOWLEDGED;
    alert.acknowledgedBy = userId;
    alert.acknowledgedAt = new Date();

    await alert.save();

    this.logInfo(`Alert ${alertId} acknowledged by ${userId}`);

    // Broadcast acknowledgment via WebSocket
    await this.deliveryService.sendViaWebSocket(userId, alert);

    return alert;
  }

  /**
   * Resolve an alert
   */
  async resolveAlert(
    alertId: string,
    userId: string,
    notes?: string,
  ): Promise<Alert> {
    const alert = await this.alertModel.findByPk(alertId);

    if (!alert) {
      throw new AlertNotFoundException(alertId);
    }

    alert.status = AlertStatus.RESOLVED;
    alert.resolvedBy = userId;
    alert.resolvedAt = new Date();

    if (notes) {
      alert.metadata = {
        ...alert.metadata,
        resolutionNotes: notes,
      };
    }

    await alert.save();

    this.logInfo(`Alert ${alertId} resolved by ${userId}`);

    // Broadcast resolution via WebSocket
    await this.deliveryService.sendViaWebSocket(userId, alert);

    return alert;
  }

  /**
   * Retry failed alert deliveries - delegates to retry service
   */
  async retryFailedAlerts(): Promise<void> {
    return this.retryService.retryFailedAlerts();
  }

  /**
   * Get user alert preferences - delegates to preferences service
   */
  async getUserAlertPreferences(userId: string): Promise<AlertPreferences> {
    return this.preferencesService.getUserAlertPreferences(userId);
  }

  /**
   * Update user alert preferences - delegates to preferences service
   */
  async updateUserAlertPreferences(
    userId: string,
    preferences: Partial<AlertPreferences>,
  ): Promise<AlertPreferences> {
    return this.preferencesService.updateUserAlertPreferences(userId, preferences);
  }

  /**
   * Get user alerts with filtering
   */
  async getUserAlerts(
    userId: string,
    filterDto: {
      page?: number;
      limit?: number;
      unreadOnly?: boolean;
    },
  ): Promise<{ data: Alert[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 20, unreadOnly = false } = filterDto;

    const where: any = {
      [Op.or]: [{ userId }, { schoolId: { [Op.ne]: null } }],
    };

    if (unreadOnly) {
      where.status = AlertStatus.ACTIVE;
    }

    const { rows: data, count: total } = await this.alertModel.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset: (page - 1) * limit,
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  /**
   * Delete an alert
   */
  async deleteAlert(alertId: string): Promise<void> {
    const alert = await this.alertModel.findByPk(alertId);

    if (!alert) {
      throw new AlertNotFoundException(alertId);
    }

    await alert.destroy();
    this.logInfo(`Alert ${alertId} deleted`);
  }

  /**
   * Get user preferences - delegates to preferences service
   */
  async getPreferences(userId: string): Promise<AlertPreferences> {
    return this.preferencesService.getUserAlertPreferences(userId);
  }

  /**
   * Update user preferences - delegates to preferences service
   */
  async updatePreferences(
    userId: string,
    updateDto: Partial<AlertPreferences>,
  ): Promise<AlertPreferences> {
    return this.preferencesService.updateUserAlertPreferences(userId, updateDto);
  }

  /**
   * Get alert statistics - delegates to statistics service
   */
  async getAlertStatistics(filters?: {
    schoolId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<AlertStatistics> {
    return this.statisticsService.getAlertStatistics(filters);
  }

  /**
   * Send alert via WebSocket - delegates to delivery service
   */
  async sendViaWebSocket(userId: string, alert: Alert): Promise<void> {
    return this.deliveryService.sendViaWebSocket(userId, alert);
  }

  /**
   * Send alert via Email - delegates to delivery service
   */
  async sendViaEmail(userId: string, alert: Alert): Promise<void> {
    return this.deliveryService.sendViaEmail(userId, alert);
  }

  /**
   * Send alert via SMS - delegates to delivery service
   */
  async sendViaSMS(userId: string, alert: Alert): Promise<void> {
    return this.deliveryService.sendViaSMS(userId, alert);
  }

  /**
   * Send alert via Push Notification - delegates to delivery service
   */
  async sendViaPush(userId: string, alert: Alert): Promise<void> {
    return this.deliveryService.sendViaPush(userId, alert);
  }
}
