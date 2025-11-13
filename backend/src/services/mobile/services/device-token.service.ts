import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { DeviceToken } from '../../../database/models/device-token.model';
import { MobileUpdatePreferencesDto, RegisterDeviceDto } from '../dto';

import { BaseService } from '../../../common/base';
/**
 * Device Token Service
 *
 * @description
 * Manages device tokens for push notification delivery.
 * Handles device registration, token validation, and preference management.
 *
 * This service provides:
 * - Device token registration and deactivation
 * - Token validation and cleanup
 * - Notification preference management
 * - Active token retrieval for notification delivery
 *
 * @example
 * ```typescript
 * // Register a device
 * const token = await deviceTokenService.registerDeviceToken(userId, {
 *   deviceId: 'device-123',
 *   platform: NotificationPlatform.FCM,
 *   token: 'fcm-token-...',
 *   deviceName: 'iPhone 13'
 * });
 *
 * // Get user's devices
 * const devices = await deviceTokenService.getUserDevices(userId);
 * ```
 */
@Injectable()
export class DeviceTokenService extends BaseService {
  constructor(
    @InjectModel(DeviceToken)
    private readonly deviceTokenModel: typeof DeviceToken,
  ) {}

  /**
   * Register a device token for push notifications
   *
   * @param userId - The user ID
   * @param dto - Device registration data
   * @returns The created device token
   *
   * @description
   * Deactivates any existing tokens for the same device before creating a new one.
   * This ensures each device has only one active token at a time.
   */
  async registerDeviceToken(
    userId: string,
    dto: RegisterDeviceDto,
  ): Promise<DeviceToken> {
    try {
      // Deactivate existing tokens for the same device
      await this.deviceTokenModel.update(
        { isActive: false },
        {
          where: {
            userId,
            deviceId: dto.deviceId,
          },
        },
      );

      // Create new device token
      const deviceToken = await this.deviceTokenModel.create({
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

      this.logInfo(
        `Device token registered: ${deviceToken.id} for user ${userId}`,
      );

      return deviceToken;
    } catch (error) {
      this.logError('Error registering device token', error);
      throw error;
    }
  }

  /**
   * Unregister a device token
   *
   * @param userId - The user ID
   * @param tokenId - The token ID to unregister
   * @throws NotFoundException if token not found
   */
  async unregisterDeviceToken(userId: string, tokenId: string): Promise<void> {
    const token = await this.deviceTokenModel.findOne({
      where: { id: tokenId, userId },
    });

    if (!token) {
      throw new NotFoundException('Device token not found');
    }

    await this.deviceTokenModel.update(
      { isActive: false },
      { where: { id: tokenId } },
    );

    this.logInfo(`Device token unregistered: ${tokenId}`);
  }

  /**
   * Get user's registered devices
   *
   * @param userId - The user ID
   * @returns Array of active and valid device tokens
   */
  async getUserDevices(userId: string): Promise<DeviceToken[]> {
    return this.deviceTokenModel.findAll({
      where: {
        userId,
        isActive: true,
        isValid: true,
      },
    });
  }

  /**
   * Update notification preferences for a device
   *
   * @param userId - The user ID
   * @param tokenId - The device token ID
   * @param dto - Preference update data
   * @returns Updated device token
   * @throws NotFoundException if token not found
   */
  async updatePreferences(
    userId: string,
    tokenId: string,
    dto: MobileUpdatePreferencesDto,
  ): Promise<DeviceToken> {
    const token = await this.deviceTokenModel.findOne({
      where: { id: tokenId, userId },
    });

    if (!token) {
      throw new NotFoundException('Device token not found');
    }

    const updated = await token.update(dto);

    this.logInfo(`Preferences updated for token: ${tokenId}`);

    return updated;
  }

  /**
   * Get active tokens for users
   *
   * @param userIds - Array of user IDs to get tokens for
   * @returns Active device tokens for the specified users
   *
   * @description
   * Returns all active, valid tokens that allow notifications for the given user IDs.
   * This is used when delivering notifications to multiple users.
   */
  async getActiveTokensForUsers(userIds: string[]): Promise<DeviceToken[]> {
    return this.deviceTokenModel.findAll({
      where: {
        userId: {
          [Op.in]: userIds,
        },
        isActive: true,
        isValid: true,
        allowNotifications: true,
      },
    });
  }

  /**
   * Mark a token as invalid
   *
   * @param tokenId - The token ID
   * @param reason - Reason for invalidation
   *
   * @description
   * Marks a token as invalid when delivery fails permanently.
   * This prevents future delivery attempts to invalid tokens.
   */
  async markTokenAsInvalid(tokenId: string, reason: string): Promise<void> {
    await this.deviceTokenModel.update(
      {
        isValid: false,
        invalidReason: reason,
      },
      { where: { id: tokenId } },
    );

    this.logInfo(`Token marked as invalid: ${tokenId} - ${reason}`);
  }

  /**
   * Update token last used timestamp
   *
   * @param tokenId - The token ID
   *
   * @description
   * Updates the lastUsedAt timestamp when a notification is successfully delivered.
   * This helps track token activity and identify stale tokens.
   */
  async updateLastUsed(tokenId: string): Promise<void> {
    await this.deviceTokenModel.update(
      { lastUsedAt: new Date() },
      { where: { id: tokenId } },
    );
  }

  /**
   * Clean up inactive tokens
   *
   * @param inactiveDays - Number of days of inactivity before cleanup
   * @returns Number of tokens cleaned up
   *
   * @description
   * Removes tokens that haven't been used in the specified number of days.
   * Should be run periodically to prevent database bloat.
   */
  async cleanupInactiveTokens(inactiveDays: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - inactiveDays);

    const deletedCount = await this.deviceTokenModel.destroy({
      where: {
        [Op.or]: [
          {
            lastUsedAt: {
              [Op.lt]: cutoffDate,
            },
          },
          {
            lastUsedAt: null,
            createdAt: {
              [Op.lt]: cutoffDate,
            },
          },
        ],
        isActive: false,
      },
    });

    this.logInfo(
      `Cleaned up ${deletedCount} inactive tokens (older than ${inactiveDays} days)`,
    );

    return deletedCount;
  }
}
