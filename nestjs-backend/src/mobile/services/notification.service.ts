import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceToken, PushNotification } from '../entities';
import { RegisterDeviceDto, SendNotificationDto, UpdatePreferencesDto } from '../dto';
import { NotificationPlatform, NotificationStatus, DeliveryStatus, NotificationPriority } from '../enums';

/**
 * Notification Service
 * Handles push notification delivery, device token management, and analytics
 */
@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(DeviceToken)
    private readonly deviceTokenRepository: Repository<DeviceToken>,
    @InjectRepository(PushNotification)
    private readonly notificationRepository: Repository<PushNotification>,
  ) {}

  /**
   * Register a device token for push notifications
   */
  async registerDeviceToken(userId: string, dto: RegisterDeviceDto): Promise<DeviceToken> {
    try {
      // Deactivate any existing tokens for this device
      await this.deviceTokenRepository.update(
        { deviceId: dto.deviceId, userId },
        { isActive: false }
      );

      // Create new device token
      const deviceToken = this.deviceTokenRepository.create({
        userId,
        deviceId: dto.deviceId,
        platform: dto.platform,
        token: dto.token,
        deviceName: dto.deviceName,
        deviceModel: dto.deviceModel,
        osVersion: dto.osVersion,
        appVersion: dto.appVersion,
        isActive: true,
        isValid: true,
        allowNotifications: true,
        allowSound: true,
        allowBadge: true,
      });

      const saved = await this.deviceTokenRepository.save(deviceToken);

      this.logger.log(`Device token registered: ${saved.id} for user ${userId}`);

      return saved;
    } catch (error) {
      this.logger.error('Error registering device token', error);
      throw error;
    }
  }

  /**
   * Unregister a device token
   */
  async unregisterDeviceToken(userId: string, tokenId: string): Promise<void> {
    const token = await this.deviceTokenRepository.findOne({
      where: { id: tokenId, userId }
    });

    if (!token) {
      throw new NotFoundException('Device token not found');
    }

    await this.deviceTokenRepository.update(tokenId, { isActive: false });

    this.logger.log(`Device token unregistered: ${tokenId}`);
  }

  /**
   * Get user's registered devices
   */
  async getUserDevices(userId: string): Promise<DeviceToken[]> {
    return this.deviceTokenRepository.find({
      where: { userId, isActive: true, isValid: true }
    });
  }

  /**
   * Update notification preferences for a device
   */
  async updatePreferences(
    userId: string,
    tokenId: string,
    dto: UpdatePreferencesDto
  ): Promise<DeviceToken> {
    const token = await this.deviceTokenRepository.findOne({
      where: { id: tokenId, userId }
    });

    if (!token) {
      throw new NotFoundException('Device token not found');
    }

    Object.assign(token, dto);
    const updated = await this.deviceTokenRepository.save(token);

    this.logger.log(`Preferences updated for token: ${tokenId}`);

    return updated;
  }

  /**
   * Send push notification to users
   */
  async sendNotification(userId: string, dto: SendNotificationDto): Promise<PushNotification> {
    try {
      // Get active device tokens for target users
      const deviceTokens = await this.getActiveTokensForUsers(dto.userIds);

      // Create notification record
      const notification = this.notificationRepository.create({
        userIds: dto.userIds,
        deviceTokens: deviceTokens.map(t => t.token),
        title: dto.title,
        body: dto.body,
        category: dto.category,
        priority: dto.priority || NotificationPriority.NORMAL,
        data: dto.data,
        actions: dto.actions,
        imageUrl: dto.imageUrl,
        sound: dto.sound,
        badge: dto.badge,
        scheduledFor: dto.scheduledFor,
        status: dto.scheduledFor ? NotificationStatus.SCHEDULED : NotificationStatus.PENDING,
        totalRecipients: deviceTokens.length,
        successfulDeliveries: 0,
        failedDeliveries: 0,
        deliveryResults: [],
        createdBy: userId,
      });

      const saved = await this.notificationRepository.save(notification);

      // Send immediately if not scheduled
      if (!dto.scheduledFor) {
        await this.deliverNotification(saved.id);
      }

      this.logger.log(`Notification created: ${saved.id} for ${deviceTokens.length} recipients`);

      return saved;
    } catch (error) {
      this.logger.error('Error sending notification', error);
      throw error;
    }
  }

  /**
   * Deliver notification to devices
   */
  private async deliverNotification(notificationId: string): Promise<void> {
    try {
      const notification = await this.notificationRepository.findOne({
        where: { id: notificationId }
      });

      if (!notification) {
        throw new NotFoundException('Notification not found');
      }

      notification.status = NotificationStatus.SENDING;
      notification.sentAt = new Date();
      await this.notificationRepository.save(notification);

      // Get device tokens
      const tokens = await this.deviceTokenRepository.find({
        where: notification.deviceTokens.map(token => ({ token, isActive: true, isValid: true }))
      });

      // Group by platform
      const byPlatform = new Map<NotificationPlatform, DeviceToken[]>();
      for (const token of tokens) {
        if (!byPlatform.has(token.platform)) {
          byPlatform.set(token.platform, []);
        }
        byPlatform.get(token.platform)!.push(token);
      }

      // Send to each platform
      for (const [platform, platformTokens] of byPlatform) {
        for (const token of platformTokens) {
          if (!token.allowNotifications) continue;

          try {
            const result = await this.sendToPlatform(platform, token, notification);

            notification.deliveryResults.push({
              platform,
              deviceToken: token.token,
              status: result.success ? DeliveryStatus.SUCCESS : DeliveryStatus.FAILED,
              response: result.response,
              error: result.error,
              deliveredAt: result.success ? new Date() : undefined
            });

            if (result.success) {
              notification.successfulDeliveries++;
              token.lastUsedAt = new Date();
              await this.deviceTokenRepository.save(token);
            } else {
              notification.failedDeliveries++;

              // Mark token as invalid if permanently failed
              if (result.invalidToken) {
                token.isValid = false;
                token.invalidReason = result.error || 'Unknown error';
                await this.deviceTokenRepository.save(token);
              }
            }
          } catch (error) {
            notification.deliveryResults.push({
              platform,
              deviceToken: token.token,
              status: DeliveryStatus.FAILED,
              error: String(error)
            });
            notification.failedDeliveries++;
          }
        }
      }

      // Update final status
      if (notification.successfulDeliveries > 0) {
        notification.status = NotificationStatus.DELIVERED;
        notification.deliveredAt = new Date();
      } else {
        notification.status = NotificationStatus.FAILED;
        notification.failedAt = new Date();

        // Schedule retry if under max retries
        if (notification.retryCount < notification.maxRetries) {
          notification.nextRetryAt = this.calculateRetryTime(notification.retryCount);
        }
      }

      await this.notificationRepository.save(notification);

      this.logger.log(
        `Notification delivered: ${notificationId} - ${notification.successfulDeliveries} success, ${notification.failedDeliveries} failed`
      );
    } catch (error) {
      this.logger.error('Error delivering notification', error);
      throw error;
    }
  }

  /**
   * Send to specific platform
   * TODO: Implement actual platform-specific sending with Firebase SDK, APNs, etc.
   */
  private async sendToPlatform(
    platform: NotificationPlatform,
    token: DeviceToken,
    notification: PushNotification
  ): Promise<{ success: boolean; response?: any; error?: string; invalidToken?: boolean }> {
    try {
      this.logger.log(`Sending to ${platform}: ${token.token.substring(0, 10)}...`);

      // TODO: Implement actual platform-specific sending
      // For FCM: use firebase-admin SDK
      // For APNS: use apn library
      // For Web Push: use web-push library

      // Simulate successful delivery for now
      return {
        success: true,
        response: { messageId: `msg-${Date.now()}` }
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
        invalidToken: false
      };
    }
  }

  /**
   * Track notification interaction
   */
  async trackInteraction(
    notificationId: string,
    action: 'CLICKED' | 'DISMISSED'
  ): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId }
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (action === 'CLICKED') {
      notification.clickedCount++;
    } else if (action === 'DISMISSED') {
      notification.dismissedCount++;
    }

    await this.notificationRepository.save(notification);

    this.logger.log(`Interaction tracked: ${notificationId} - ${action}`);
  }

  /**
   * Get notification analytics
   */
  async getAnalytics(period: { start: Date; end: Date }): Promise<any> {
    const notifications = await this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.createdAt >= :start', { start: period.start })
      .where('notification.createdAt <= :end', { end: period.end })
      .getMany();

    const totalSent = notifications.length;
    const totalDelivered = notifications.filter(n => n.status === NotificationStatus.DELIVERED).length;
    const totalFailed = notifications.filter(n => n.status === NotificationStatus.FAILED).length;
    const totalClicked = notifications.reduce((sum, n) => sum + n.clickedCount, 0);

    const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent * 100) : 0;
    const clickRate = totalDelivered > 0 ? (totalClicked / totalDelivered * 100) : 0;

    return {
      period,
      totalSent,
      totalDelivered,
      totalFailed,
      deliveryRate: Number(deliveryRate.toFixed(2)),
      clickRate: Number(clickRate.toFixed(2)),
    };
  }

  /**
   * Get active tokens for users
   */
  private async getActiveTokensForUsers(userIds: string[]): Promise<DeviceToken[]> {
    return this.deviceTokenRepository.find({
      where: userIds.map(userId => ({
        userId,
        isActive: true,
        isValid: true,
        allowNotifications: true
      }))
    });
  }

  /**
   * Calculate retry time based on retry count
   */
  private calculateRetryTime(retryCount: number): Date {
    const delays = [5, 15, 30]; // minutes
    const delayMinutes = delays[Math.min(retryCount, delays.length - 1)];
    const nextRetry = new Date();
    nextRetry.setMinutes(nextRetry.getMinutes() + delayMinutes);
    return nextRetry;
  }
}
