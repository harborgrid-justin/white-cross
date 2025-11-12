/**
 * @fileoverview Alert Preferences Service
 * @module alerts/services
 * @description Manages user alert preferences and quiet hours
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AlertPreferences, DeliveryChannel } from '@/database';

@Injectable()
export class AlertPreferencesService {
  private readonly logger = new Logger(AlertPreferencesService.name);

  constructor(
    @InjectModel(AlertPreferences)
    private readonly alertPreferencesModel: typeof AlertPreferences,
  ) {}

  /**
   * Get user alert preferences
   */
  async getUserAlertPreferences(userId: string): Promise<AlertPreferences> {
    let prefs = await this.alertPreferencesModel.findOne({
      where: { userId },
    });

    if (!prefs) {
      // Create default preferences
      prefs = await this.alertPreferencesModel.create({
        userId,
        channels: [DeliveryChannel.WEBSOCKET, DeliveryChannel.EMAIL],
        severityFilter: ['INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'EMERGENCY'],
        categoryFilter: ['SYSTEM', 'HEALTH', 'ACADEMIC', 'SECURITY', 'MAINTENANCE'],
        isActive: true,
      });
    }

    return prefs;
  }

  /**
   * Update user alert preferences
   */
  async updateUserAlertPreferences(
    userId: string,
    preferences: Partial<AlertPreferences>,
  ): Promise<AlertPreferences> {
    const existing = await this.getUserAlertPreferences(userId);

    // Update the existing preferences
    await existing.update(preferences);

    this.logger.log(`Updated alert preferences for user ${userId}`);

    return existing;
  }

  /**
   * Get user preferences (alias for getUserAlertPreferences)
   */
  async getPreferences(userId: string): Promise<AlertPreferences> {
    return this.getUserAlertPreferences(userId);
  }

  /**
   * Update user preferences (alias for updateUserAlertPreferences)
   */
  async updatePreferences(
    userId: string,
    updateDto: any,
  ): Promise<AlertPreferences> {
    return this.updateUserAlertPreferences(userId, updateDto);
  }

  /**
   * Get subscribers for an alert based on preferences
   */
  async getSubscribersForAlert(
    alertSeverity: string,
    alertCategory: string,
  ): Promise<AlertPreferences[]> {
    // Get all active preferences that match the alert filters
    const allPrefs = await this.alertPreferencesModel.findAll({
      where: {
        isActive: true,
      },
    });

    // Filter preferences that match severity and category
    const matchingPrefs = allPrefs.filter((prefs) => {
      const severityMatch = prefs.severityFilter.includes(alertSeverity);
      const categoryMatch = prefs.categoryFilter.includes(alertCategory);
      return severityMatch && categoryMatch;
    });

    // Filter out those in quiet hours
    return matchingPrefs.filter((prefs) => !prefs.isQuietHours());
  }

  /**
   * Check if user has notifications enabled for a specific channel
   */
  async hasChannelEnabled(userId: string, channel: DeliveryChannel): Promise<boolean> {
    const prefs = await this.getUserAlertPreferences(userId);
    return prefs.channels.includes(channel);
  }

  /**
   * Enable/disable a specific channel for user
   */
  async toggleChannel(
    userId: string,
    channel: DeliveryChannel,
    enabled: boolean,
  ): Promise<AlertPreferences> {
    const prefs = await this.getUserAlertPreferences(userId);
    
    if (enabled) {
      if (!prefs.channels.includes(channel)) {
        prefs.channels = [...prefs.channels, channel];
      }
    } else {
      prefs.channels = prefs.channels.filter((c) => c !== channel);
    }

    await prefs.save();
    this.logger.log(`${enabled ? 'Enabled' : 'Disabled'} ${channel} for user ${userId}`);
    
    return prefs;
  }

  /**
   * Set quiet hours for user
   */
  async setQuietHours(
    userId: string,
    startTime: string,
    endTime: string,
    timezone?: string,
  ): Promise<AlertPreferences> {
    const prefs = await this.getUserAlertPreferences(userId);
    
    prefs.quietHours = {
      enabled: true,
      startTime,
      endTime,
      timezone: timezone || 'UTC',
    };

    await prefs.save();
    this.logger.log(`Set quiet hours for user ${userId}: ${startTime} - ${endTime}`);
    
    return prefs;
  }

  /**
   * Disable quiet hours for user
   */
  async disableQuietHours(userId: string): Promise<AlertPreferences> {
    const prefs = await this.getUserAlertPreferences(userId);
    
    prefs.quietHours = {
      ...prefs.quietHours,
      enabled: false,
    };

    await prefs.save();
    this.logger.log(`Disabled quiet hours for user ${userId}`);
    
    return prefs;
  }
}
