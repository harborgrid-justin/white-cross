import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeviceToken, PushNotification } from '../entities';
import { BaseService } from '../../common/base';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import {
  NotificationCategory,
  NotificationPlatform,
  NotificationPriority,
} from '../enums';

/**
 * Firebase Admin SDK types (to be imported when firebase-admin is installed)
 * @example
 * ```bash
 * npm install firebase-admin
 * ```
 */
interface FirebaseMessage {
  token: string;
  notification?: {
    title: string;
    body: string;
    imageUrl?: string;
  };
  data?: Record<string, string>;
  android?: {
    priority?: 'high' | 'normal';
    ttl?: number;
    collapseKey?: string;
    notification?: {
      sound?: string;
      channelId?: string;
    };
  };
  apns?: {
    payload?: {
      aps?: {
        alert?: any;
        badge?: number;
        sound?: string;
        contentAvailable?: boolean;
      };
    };
  };
}

/**
 * Platform Delivery Result Interface
 */
export interface PlatformDeliveryResult {
  success: boolean;
  response?: any;
  error?: string;
  invalidToken?: boolean;
}

/**
 * Notification Platform Service
 *
 * @description
 * Handles initialization and delivery for different notification platforms:
 * - Firebase Cloud Messaging (FCM) for Android
 * - Apple Push Notification Service (APNs) for iOS
 * - Web Push API for browsers
 *
 * This service encapsulates all platform-specific logic and configuration.
 */
@Injectable()
export class NotificationPlatformService implements OnModuleInit {
  // Platform clients (initialized when dependencies are installed)
  private firebaseMessaging: any = null;
  private apnsProvider: any = null;

  constructor(
    @Inject(LoggerService) logger: LoggerService,
    private readonly configService: ConfigService
  ) {
    super({
      serviceName: 'NotificationPlatformService',
      logger,
      enableAuditLogging: true,
    });
  }

  /**
   * Initialize platform providers on module startup
   */
  async onModuleInit(): Promise<void> {
    try {
      // Initialize Firebase Admin SDK if configured
      await this.initializeFirebase();

      // Initialize APNs if configured
      await this.initializeAPNs();

      this.logInfo('NotificationPlatformService initialized successfully');
    } catch (error) {
      this.logError('Failed to initialize NotificationPlatformService', error);
    }
  }

  /**
   * Initialize Firebase Cloud Messaging
   *
   * @description
   * Requires firebase-admin package and service account credentials.
   * Configuration should be provided via environment variables:
   * - FIREBASE_PROJECT_ID
   * - FIREBASE_CLIENT_EMAIL
   * - FIREBASE_PRIVATE_KEY
   *
   * @example
   * ```bash
   * npm install firebase-admin
   * ```
   */
  private async initializeFirebase(): Promise<void> {
    try {
      // Check if firebase-admin is available
      const admin = await import('firebase-admin').catch(() => null);

      if (!admin) {
        this.logWarning(
          'firebase-admin not installed. FCM notifications will not be available. ' +
            'Install with: npm install firebase-admin',
        );
        return;
      }

      const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
      const clientEmail = this.configService.get<string>(
        'FIREBASE_CLIENT_EMAIL',
      );
      const privateKey = this.configService
        .get<string>('FIREBASE_PRIVATE_KEY')
        ?.replace(/\\n/g, '\n');

      if (!projectId || !clientEmail || !privateKey) {
        this.logWarning('Firebase credentials not configured. FCM disabled.');
        return;
      }

      admin.default.initializeApp({
        credential: admin.default.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });

      this.firebaseMessaging = admin.default.messaging();
      this.logInfo('Firebase Cloud Messaging initialized');
    } catch (error) {
      this.logError('Failed to initialize Firebase', error);
    }
  }

  /**
   * Initialize Apple Push Notification Service
   *
   * @description
   * Requires apn package and APNs certificates/tokens.
   * Configuration should be provided via environment variables:
   * - APNS_KEY_ID
   * - APNS_TEAM_ID
   * - APNS_TOKEN (or path to .p8 file)
   * - APNS_PRODUCTION (true/false)
   *
   * @example
   * ```bash
   * npm install apn
   * ```
   */
  private async initializeAPNs(): Promise<void> {
    try {
      // Check if apn is available
      const apn = await import('apn').catch(() => null);

      if (!apn) {
        this.logWarning(
          'apn not installed. APNs notifications will not be available. ' +
            'Install with: npm install apn',
        );
        return;
      }

      const keyId = this.configService.get<string>('APNS_KEY_ID');
      const teamId = this.configService.get<string>('APNS_TEAM_ID');
      const token = this.configService.get<string>('APNS_TOKEN');
      const production = this.configService.get<boolean>(
        'APNS_PRODUCTION',
        false,
      );

      if (!keyId || !teamId || !token) {
        this.logWarning('APNs credentials not configured. APNs disabled.');
        return;
      }

      this.apnsProvider = new apn.default.Provider({
        token: {
          key: token,
          keyId: keyId,
          teamId: teamId,
        },
        production: production,
      });

      this.logInfo(
        `APNs initialized (${production ? 'production' : 'development'})`,
      );
    } catch (error) {
      this.logError('Failed to initialize APNs', error);
    }
  }

  /**
   * Send to specific platform using platform-specific adapters
   *
   * @param platform - The notification platform
   * @param token - The device token
   * @param notification - The notification to send
   * @returns Delivery result
   */
  async sendToPlatform(
    platform: NotificationPlatform,
    token: DeviceToken,
    notification: PushNotification,
  ): Promise<PlatformDeliveryResult> {
    try {
      this.logInfo(
        `Sending to ${platform}: ${token.token.substring(0, 10)}...`,
      );

      switch (platform) {
        case NotificationPlatform.FCM:
          return await this.sendToFCM(token, notification);

        case NotificationPlatform.APNS:
          return await this.sendToAPNs(token, notification);

        case NotificationPlatform.WEB_PUSH:
          return await this.sendToWebPush(token, notification);

        default:
          this.logWarning(`Unsupported platform: ${platform}`);
          return {
            success: false,
            error: `Unsupported platform: ${platform}`,
          };
      }
    } catch (error) {
      this.logError(`Failed to send to ${platform}`, error);
      return {
        success: false,
        error: String(error),
        invalidToken: false,
      };
    }
  }

  /**
   * Send notification via Firebase Cloud Messaging
   *
   * @param token - The device token
   * @param notification - The notification
   * @returns Delivery result
   */
  private async sendToFCM(
    token: DeviceToken,
    notification: PushNotification,
  ): Promise<PlatformDeliveryResult> {
    if (!this.firebaseMessaging) {
      this.logWarning('Firebase not initialized, skipping FCM delivery');
      return {
        success: false,
        error: 'Firebase not initialized',
      };
    }

    try {
      const message: FirebaseMessage = {
        token: token.token,
        notification: {
          title: notification.title,
          body: notification.body,
          imageUrl: notification.imageUrl,
        },
        data: notification.data,
        android: {
          priority: this.mapPriorityToFCM(notification.priority),
          ttl: notification.ttl ? notification.ttl * 1000 : undefined, // Convert to milliseconds
          collapseKey: notification.collapseKey,
          notification: {
            sound:
              notification.sound || (token.allowSound ? 'default' : undefined),
            channelId: this.getNotificationChannel(notification.category),
          },
        },
      };

      const response = await this.firebaseMessaging.send(message);

      this.logInfo(`FCM delivery successful: ${response}`);

      return {
        success: true,
        response: { messageId: response },
      };
    } catch (error: any) {
      this.logError('FCM delivery failed', error);

      // Check for invalid token errors
      const invalidTokenErrors = [
        'messaging/invalid-registration-token',
        'messaging/registration-token-not-registered',
      ];

      const isInvalidToken = invalidTokenErrors.some(
        (code) => error.code === code,
      );

      return {
        success: false,
        error: error.message || String(error),
        invalidToken: isInvalidToken,
      };
    }
  }

  /**
   * Send notification via Apple Push Notification Service
   *
   * @param token - The device token
   * @param notification - The notification
   * @returns Delivery result
   */
  private async sendToAPNs(
    token: DeviceToken,
    notification: PushNotification,
  ): Promise<PlatformDeliveryResult> {
    if (!this.apnsProvider) {
      this.logWarning('APNs not initialized, skipping APNs delivery');
      return {
        success: false,
        error: 'APNs not initialized',
      };
    }

    try {
      // Dynamically import apn module
      const apn = await import('apn').catch(() => null);
      if (!apn) {
        return {
          success: false,
          error: 'apn module not available',
        };
      }

      const apnsNotification = new apn.default.Notification();

      apnsNotification.topic = this.configService.get<string>(
        'APNS_BUNDLE_ID',
        'com.whitecross.app',
      );
      apnsNotification.alert = {
        title: notification.title,
        body: notification.body,
      };
      if (token.allowBadge && notification.badge !== undefined) {
        apnsNotification.badge = notification.badge;
      }
      if (token.allowSound) {
        apnsNotification.sound = notification.sound || 'default';
      }
      apnsNotification.payload = notification.data;
      if (notification.silent) {
        apnsNotification.contentAvailable = true;
      }
      apnsNotification.priority = this.mapPriorityToAPNs(notification.priority);

      if (notification.ttl) {
        apnsNotification.expiry =
          Math.floor(Date.now() / 1000) + notification.ttl;
      }

      const result = await this.apnsProvider.send(
        apnsNotification,
        token.token,
      );

      if (result.failed && result.failed.length > 0) {
        const failure = result.failed[0];
        const isInvalidToken = ['BadDeviceToken', 'Unregistered'].includes(
          failure.status,
        );

        return {
          success: false,
          error: failure.response?.reason || 'APNs delivery failed',
          invalidToken: isInvalidToken,
        };
      }

      this.logInfo('APNs delivery successful');

      return {
        success: true,
        response: result.sent,
      };
    } catch (error) {
      this.logError('APNs delivery failed', error);

      return {
        success: false,
        error: String(error),
        invalidToken: false,
      };
    }
  }

  /**
   * Send notification via Web Push API
   *
   * @param token - The device token
   * @param notification - The notification
   * @returns Delivery result
   */
  private async sendToWebPush(
    token: DeviceToken,
    notification: PushNotification,
  ): Promise<PlatformDeliveryResult> {
    try {
      // Web Push implementation would require web-push library
      // npm install web-push
      const webPush = await import('web-push').catch(() => null);

      if (!webPush) {
        this.logWarning('web-push not installed');
        return {
          success: false,
          error: 'web-push not installed',
        };
      }

      const vapidPublicKey = this.configService.get<string>('VAPID_PUBLIC_KEY');
      const vapidPrivateKey =
        this.configService.get<string>('VAPID_PRIVATE_KEY');
      const vapidSubject = this.configService.get<string>(
        'VAPID_SUBJECT',
        'mailto:admin@whitecross.com',
      );

      if (!vapidPublicKey || !vapidPrivateKey) {
        this.logWarning('VAPID keys not configured');
        return {
          success: false,
          error: 'VAPID keys not configured',
        };
      }

      webPush.default.setVapidDetails(
        vapidSubject,
        vapidPublicKey,
        vapidPrivateKey,
      );

      const payload = JSON.stringify({
        title: notification.title,
        body: notification.body,
        icon: notification.iconUrl,
        image: notification.imageUrl,
        badge: notification.badge,
        data: notification.data,
        actions: notification.actions,
      });

      const response = await webPush.default.sendNotification(
        JSON.parse(token.token),
        payload,
      );

      this.logInfo('Web Push delivery successful');

      return {
        success: true,
        response,
      };
    } catch (error: any) {
      this.logError('Web Push delivery failed', error);

      const isInvalidToken = error.statusCode === 410; // Gone - subscription expired

      return {
        success: false,
        error: error.message || String(error),
        invalidToken: isInvalidToken,
      };
    }
  }

  /**
   * Map notification priority to FCM priority
   */
  private mapPriorityToFCM(priority: NotificationPriority): 'high' | 'normal' {
    return priority === NotificationPriority.CRITICAL ||
      priority === NotificationPriority.HIGH
      ? 'high'
      : 'normal';
  }

  /**
   * Map notification priority to APNs priority
   */
  private mapPriorityToAPNs(priority: NotificationPriority): number {
    switch (priority) {
      case NotificationPriority.CRITICAL:
        return 10; // Immediate delivery
      case NotificationPriority.HIGH:
        return 10;
      case NotificationPriority.NORMAL:
        return 5;
      case NotificationPriority.LOW:
        return 1;
      default:
        return 5;
    }
  }

  /**
   * Get Android notification channel ID for category
   */
  private getNotificationChannel(category: NotificationCategory): string {
    const channelMap: Record<NotificationCategory, string> = {
      [NotificationCategory.MEDICATION]: 'medication_reminders',
      [NotificationCategory.APPOINTMENT]: 'appointments',
      [NotificationCategory.INCIDENT]: 'incidents',
      [NotificationCategory.SCREENING]: 'screenings',
      [NotificationCategory.IMMUNIZATION]: 'immunizations',
      [NotificationCategory.MESSAGE]: 'messages',
      [NotificationCategory.EMERGENCY]: 'emergency_alerts',
      [NotificationCategory.REMINDER]: 'reminders',
      [NotificationCategory.ALERT]: 'alerts',
      [NotificationCategory.SYSTEM]: 'system',
    };

    return channelMap[category] || 'default';
  }
}
