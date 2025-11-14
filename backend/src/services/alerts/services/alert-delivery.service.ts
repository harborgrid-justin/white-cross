/**
 * @fileoverview Alert Delivery Service
 * @module alerts/services
 * @description Handles multi-channel alert delivery with retry logic
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { Alert, DeliveryChannel, DeliveryLog } from '@/database';
import { AlertDeliveryException } from '../exceptions/alert.exceptions';

import { BaseService } from '@/common/base';
@Injectable()
export class AlertDeliveryService extends BaseService {
  constructor(
    @InjectModel(DeliveryLog)
    private readonly deliveryLogModel: typeof DeliveryLog,
    private readonly configService: ConfigService,
  ) {
    super("AlertDeliveryService");
  }

  /**
   * Send alert via WebSocket for real-time delivery
   */
  async sendViaWebSocket(userId: string, alert: Alert): Promise<void> {
    try {
      // In a real implementation, this would use WebSocket gateway
      // For now, we'll log the broadcast

      const rooms: string[] = [];

      if (alert.schoolId) {
        rooms.push(`school:${alert.schoolId}`);
      }
      if (alert.userId) {
        rooms.push(`user:${alert.userId}`);
      }
      if (alert.studentId) {
        rooms.push(`student:${alert.studentId}`);
      }

      // Add severity-based rooms
      if (
        alert.severity === 'EMERGENCY' ||
        alert.severity === 'CRITICAL'
      ) {
        rooms.push('alerts:critical');
      }

      this.logInfo(
        `Broadcasting alert ${alert.id} to rooms: ${rooms.join(', ')}`,
      );

      // Log successful delivery
      await this.logDelivery(alert.id, DeliveryChannel.WEBSOCKET, undefined, true);
    } catch (error: any) {
      this.logError(
        `WebSocket delivery failed for alert ${alert.id}`,
        error,
      );
      await this.logDelivery(
        alert.id,
        DeliveryChannel.WEBSOCKET,
        undefined,
        false,
        error.message,
      );
    }
  }

  /**
   * Send alert via Email
   */
  async sendViaEmail(userId: string, alert: Alert): Promise<void> {
    try {
      // In a real implementation, this would use @nestjs-modules/mailer or nodemailer
      const emailConfig = {
        host: this.configService.get('SMTP_HOST'),
        port: this.configService.get('SMTP_PORT', 587),
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD'),
      };

      // For now, log the email that would be sent
      this.logInfo(`Sending email alert ${alert.id} to user ${userId}`);
      this.logDebug(`Email subject: [${alert.severity}] ${alert.title}`);
      this.logDebug(`Email body: ${alert.message}`);

      // Simulate email sending
      await this.simulateDelay(100);

      await this.logDelivery(alert.id, DeliveryChannel.EMAIL, userId, true);
    } catch (error: any) {
      this.logError(`Email delivery failed for alert ${alert.id}`, error);
      await this.logDelivery(
        alert.id,
        DeliveryChannel.EMAIL,
        userId,
        false,
        error.message,
      );
      throw new AlertDeliveryException('Email', error.message);
    }
  }

  /**
   * Send alert via SMS
   */
  async sendViaSMS(userId: string, alert: Alert): Promise<void> {
    try {
      // In a real implementation, this would use Twilio or AWS SNS
      const smsConfig = {
        accountSid: this.configService.get('TWILIO_ACCOUNT_SID'),
        authToken: this.configService.get('TWILIO_AUTH_TOKEN'),
        fromNumber: this.configService.get('TWILIO_PHONE_NUMBER'),
      };

      // Format SMS message (max 160 chars for best compatibility)
      const smsMessage = `[${alert.severity}] ${alert.title}: ${alert.message.substring(
        0,
        100,
      )}`;

      this.logInfo(`Sending SMS alert ${alert.id} to user ${userId}`);
      this.logDebug(`SMS message: ${smsMessage}`);

      // Simulate SMS sending
      await this.simulateDelay(150);

      await this.logDelivery(alert.id, DeliveryChannel.SMS, userId, true);
    } catch (error: any) {
      this.logError(`SMS delivery failed for alert ${alert.id}`, error);
      await this.logDelivery(
        alert.id,
        DeliveryChannel.SMS,
        userId,
        false,
        error.message,
      );
      throw new AlertDeliveryException('SMS', error.message);
    }
  }

  /**
   * Send alert via Push Notification
   */
  async sendViaPush(userId: string, alert: Alert): Promise<void> {
    try {
      // In a real implementation, this would use Firebase Cloud Messaging (FCM)
      const fcmConfig = {
        serverKey: this.configService.get('FCM_SERVER_KEY'),
        projectId: this.configService.get('FCM_PROJECT_ID'),
      };

      const pushPayload = {
        notification: {
          title: `[${alert.severity}] ${alert.title}`,
          body: alert.message,
          icon: this.getSeverityIcon(alert.severity),
        },
        data: {
          alertId: alert.id,
          category: alert.category,
          severity: alert.severity,
        },
      };

      this.logInfo(
        `Sending push notification for alert ${alert.id} to user ${userId}`,
      );
      this.logDebug(`Push payload: ${JSON.stringify(pushPayload)}`);

      // Simulate push notification sending
      await this.simulateDelay(120);

      await this.logDelivery(
        alert.id,
        DeliveryChannel.PUSH_NOTIFICATION,
        userId,
        true,
      );
    } catch (error: any) {
      this.logError(
        `Push notification delivery failed for alert ${alert.id}`,
        error,
      );
      await this.logDelivery(
        alert.id,
        DeliveryChannel.PUSH_NOTIFICATION,
        userId,
        false,
        error.message,
      );
      throw new AlertDeliveryException('Push Notification', error.message);
    }
  }

  /**
   * Retry a specific delivery
   */
  async retryDelivery(
    alert: Alert,
    channel: DeliveryChannel,
    recipientId?: string,
  ): Promise<void> {
    this.logInfo(`Retrying delivery for alert ${alert.id} via ${channel}`);

    switch (channel) {
      case DeliveryChannel.EMAIL:
        await this.sendViaEmail(recipientId || alert.userId || '', alert);
        break;
      case DeliveryChannel.SMS:
        await this.sendViaSMS(recipientId || alert.userId || '', alert);
        break;
      case DeliveryChannel.PUSH_NOTIFICATION:
        await this.sendViaPush(recipientId || alert.userId || '', alert);
        break;
      case DeliveryChannel.WEBSOCKET:
        await this.sendViaWebSocket(recipientId || alert.userId || '', alert);
        break;
    }
  }

  /**
   * Log delivery attempt
   */
  async logDelivery(
    alertId: string,
    channel: DeliveryChannel,
    recipientId: string | undefined,
    success: boolean,
    errorMessage?: string,
  ): Promise<void> {
    // Try to find existing log for this alert/channel/recipient combination
    const existingLog = await this.deliveryLogModel.findOne({
      where: {
        alertId,
        channel,
        ...(recipientId && { recipientId }),
      },
    });

    if (existingLog) {
      // Update existing log
      existingLog.success = success;
      existingLog.attemptCount++;
      existingLog.lastAttempt = new Date();
      if (success) {
        existingLog.deliveredAt = new Date();
      }
      if (errorMessage) {
        existingLog.errorMessage = errorMessage;
      }
      await existingLog.save();
    } else {
      // Create new log
      await this.deliveryLogModel.create({
        alertId,
        channel,
        recipientId,
        success,
        attemptCount: 1,
        lastAttempt: new Date(),
        deliveredAt: success ? new Date() : undefined,
        errorMessage,
      });
    }
  }

  /**
   * Get severity icon for push notifications
   */
  private getSeverityIcon(severity: string): string {
    const icons: Record<string, string> = {
      INFO: 'info_icon',
      LOW: 'low_icon',
      MEDIUM: 'medium_icon',
      HIGH: 'high_icon',
      CRITICAL: 'critical_icon',
      EMERGENCY: 'emergency_icon',
    };

    return icons[severity] || 'default_icon';
  }

  /**
   * Simulate network delay for testing
   */
  private simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
