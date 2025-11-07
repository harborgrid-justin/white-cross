import {
  Injectable,
  NotFoundException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ConfigService } from '@nestjs/config';
import { DeviceToken, PushNotification } from '../entities';
import {
  RegisterDeviceDto,
  SendNotificationDto,
  MobileUpdatePreferencesDto,
} from '../dto';
import {
  NotificationPlatform,
  NotificationStatus,
  DeliveryStatus,
  NotificationPriority,
  NotificationCategory,
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
 * APNs Provider types (to be imported when apn is installed)
 * @example
 * ```bash
 * npm install apn @types/apn
 * ```
 */
interface APNsNotification {
  topic: string;
  alert: {
    title: string;
    body: string;
  };
  badge?: number;
  sound?: string;
  payload?: Record<string, any>;
  contentAvailable?: boolean;
  priority?: number;
  expiry?: number;
}

/**
 * Notification Template Interface
 */
export interface NotificationTemplate {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  variables: string[];
  platform?: NotificationPlatform;
  priority?: NotificationPriority;
  sound?: string;
  actions?: Array<{ label: string; action: string }>;
}

/**
 * Platform Delivery Result Interface
 */
interface PlatformDeliveryResult {
  success: boolean;
  response?: any;
  error?: string;
  invalidToken?: boolean;
}

/**
 * Notification Service
 * Handles push notification delivery, device token management, and analytics
 *
 * @description
 * This service provides comprehensive push notification capabilities including:
 * - Firebase Cloud Messaging (FCM) for Android
 * - Apple Push Notification Service (APNs) for iOS
 * - Web Push API for browsers
 * - Notification templates with variable substitution
 * - Scheduled notifications
 * - Delivery tracking and analytics
 * - Device token management
 *
 * @example
 * ```typescript
 * // Register a device
 * const token = await notificationService.registerDeviceToken(userId, {
 *   deviceId: 'device-123',
 *   platform: NotificationPlatform.FCM,
 *   token: 'fcm-token-...',
 *   deviceName: 'iPhone 13'
 * });
 *
 * // Send notification
 * const notification = await notificationService.sendNotification(userId, {
 *   userIds: ['user1', 'user2'],
 *   title: 'Medication Reminder',
 *   body: 'Time to take your medication',
 *   category: NotificationCategory.MEDICATION,
 *   priority: NotificationPriority.HIGH
 * });
 * ```
 */
@Injectable()
export class NotificationService implements OnModuleInit {
  private readonly logger = new Logger(NotificationService.name);
  private readonly templates: Map<string, NotificationTemplate> = new Map();

  // Platform clients (initialized when dependencies are installed)
  private firebaseMessaging: any = null;
  private apnsProvider: any = null;

  constructor(
    @InjectModel(DeviceToken)
    private readonly deviceTokenModel: typeof DeviceToken,
    @InjectModel(PushNotification)
    private readonly notificationModel: typeof PushNotification,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Initialize platform providers on module startup
   */
  async onModuleInit(): Promise<void> {
    try {
      // Initialize Firebase Admin SDK if configured
      await this.initializeFirebase();

      // Initialize APNs if configured
      await this.initializeAPNs();

      // Load notification templates
      await this.loadTemplates();

      this.logger.log('NotificationService initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize NotificationService', error);
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
        this.logger.warn(
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
        this.logger.warn('Firebase credentials not configured. FCM disabled.');
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
      this.logger.log('Firebase Cloud Messaging initialized');
    } catch (error) {
      this.logger.error('Failed to initialize Firebase', error);
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
        this.logger.warn(
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
        this.logger.warn('APNs credentials not configured. APNs disabled.');
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

      this.logger.log(
        `APNs initialized (${production ? 'production' : 'development'})`,
      );
    } catch (error) {
      this.logger.error('Failed to initialize APNs', error);
    }
  }

  /**
   * Load notification templates
   *
   * @description
   * Loads predefined notification templates for common scenarios.
   * Templates support variable substitution using {{variable}} syntax.
   */
  private async loadTemplates(): Promise<void> {
    // Define default templates
    const defaultTemplates: NotificationTemplate[] = [
      {
        id: 'medication-reminder',
        category: NotificationCategory.MEDICATION,
        title: 'Medication Reminder',
        body: 'Time to take {{medicationName}} - {{dosage}}',
        variables: ['medicationName', 'dosage'],
        priority: NotificationPriority.HIGH,
        sound: 'medication_alert.wav',
      },
      {
        id: 'appointment-reminder',
        category: NotificationCategory.APPOINTMENT,
        title: 'Appointment Reminder',
        body: 'Your appointment with {{providerName}} is at {{time}}',
        variables: ['providerName', 'time'],
        priority: NotificationPriority.NORMAL,
      },
      {
        id: 'incident-alert',
        category: NotificationCategory.INCIDENT,
        title: 'Incident Alert',
        body: 'New incident reported: {{incidentType}} - {{studentName}}',
        variables: ['incidentType', 'studentName'],
        priority: NotificationPriority.CRITICAL,
        sound: 'emergency_alert.wav',
      },
      {
        id: 'screening-due',
        category: NotificationCategory.SCREENING,
        title: 'Health Screening Due',
        body: '{{screeningType}} screening is due for {{studentName}}',
        variables: ['screeningType', 'studentName'],
        priority: NotificationPriority.NORMAL,
      },
      {
        id: 'immunization-reminder',
        category: NotificationCategory.IMMUNIZATION,
        title: 'Immunization Reminder',
        body: '{{vaccineName}} immunization due on {{dueDate}}',
        variables: ['vaccineName', 'dueDate'],
        priority: NotificationPriority.HIGH,
      },
    ];

    for (const template of defaultTemplates) {
      this.templates.set(template.id, template);
    }

    this.logger.log(`Loaded ${defaultTemplates.length} notification templates`);
  }

  /**
   * Register a device token for push notifications
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

      this.logger.log(
        `Device token registered: ${deviceToken.id} for user ${userId}`,
      );

      return deviceToken;
    } catch (error) {
      this.logger.error('Error registering device token', error);
      throw error;
    }
  }

  /**
   * Unregister a device token
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

    this.logger.log(`Device token unregistered: ${tokenId}`);
  }

  /**
   * Get user's registered devices
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

    this.logger.log(`Preferences updated for token: ${tokenId}`);

    return updated;
  }

  /**
   * Send push notification to users
   */
  async sendNotification(
    userId: string,
    dto: SendNotificationDto,
  ): Promise<PushNotification> {
    try {
      // Get active device tokens for target users
      const deviceTokens = await this.getActiveTokensForUsers(dto.userIds);

      // Create notification record
      const notification = await this.notificationModel.create({
        userIds: dto.userIds,
        deviceTokens: deviceTokens.map((t) => t.token),
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
        status: dto.scheduledFor
          ? NotificationStatus.SCHEDULED
          : NotificationStatus.PENDING,
        totalRecipients: deviceTokens.length,
        successfulDeliveries: 0,
        failedDeliveries: 0,
        deliveryResults: [],
        createdBy: userId,
        silent: false,
        requireInteraction: false,
        clickedCount: 0,
        dismissedCount: 0,
        retryCount: 0,
        maxRetries: 3,
      });

      // Send immediately if not scheduled
      if (!dto.scheduledFor && notification.id) {
        await this.deliverNotification(notification.id);
      }

      this.logger.log(
        `Notification created: ${notification.id} for ${deviceTokens.length} recipients`,
      );

      return notification;
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
      const notification = await this.notificationModel.findOne({
        where: { id: notificationId },
      });

      if (!notification) {
        throw new NotFoundException('Notification not found');
      }

      notification.status = NotificationStatus.SENDING;
      notification.sentAt = new Date();
      await notification.save();

      // Get device tokens
      const tokens = await this.deviceTokenModel.findAll({
        where: {
          token: notification.deviceTokens,
          isActive: true,
          isValid: true,
        },
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
            const result = await this.sendToPlatform(
              platform,
              token,
              notification,
            );

            notification.deliveryResults.push({
              platform,
              deviceToken: token.token,
              status: result.success
                ? DeliveryStatus.SUCCESS
                : DeliveryStatus.FAILED,
              response: result.response,
              error: result.error,
              deliveredAt: result.success ? new Date() : undefined,
            });

            if (result.success) {
              notification.successfulDeliveries++;
              token.lastUsedAt = new Date();
              await token.save();
            } else {
              notification.failedDeliveries++;

              // Mark token as invalid if permanently failed
              if (result.invalidToken) {
                token.isValid = false;
                token.invalidReason = result.error || 'Unknown error';
                await token.save();
              }
            }
          } catch (error) {
            notification.deliveryResults.push({
              platform,
              deviceToken: token.token,
              status: DeliveryStatus.FAILED,
              error: String(error),
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
          notification.nextRetryAt = this.calculateRetryTime(
            notification.retryCount,
          );
        }
      }

      await notification.save();

      this.logger.log(
        `Notification delivered: ${notificationId} - ${notification.successfulDeliveries} success, ${notification.failedDeliveries} failed`,
      );
    } catch (error) {
      this.logger.error('Error delivering notification', error);
      throw error;
    }
  }

  /**
   * Get a notification template by ID
   *
   * @param templateId - The template ID
   * @returns The notification template
   * @throws NotFoundException if template not found
   */
  getTemplate(templateId: string): NotificationTemplate {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new NotFoundException(`Template not found: ${templateId}`);
    }
    return template;
  }

  /**
   * Render a template with variables
   *
   * @param templateId - The template ID
   * @param variables - Variable values for substitution
   * @returns Rendered title and body
   *
   * @example
   * ```typescript
   * const { title, body } = notificationService.renderTemplate('medication-reminder', {
   *   medicationName: 'Aspirin',
   *   dosage: '100mg'
   * });
   * ```
   */
  renderTemplate(
    templateId: string,
    variables: Record<string, string>,
  ): { title: string; body: string } {
    const template = this.getTemplate(templateId);

    let title = template.title;
    let body = template.body;

    // Substitute variables
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      title = title.replace(new RegExp(placeholder, 'g'), value);
      body = body.replace(new RegExp(placeholder, 'g'), value);
    }

    return { title, body };
  }

  /**
   * Send notification from template
   *
   * @param userId - The user ID
   * @param templateId - The template ID
   * @param variables - Template variables
   * @param userIds - Target user IDs
   * @param options - Additional notification options
   * @returns The created notification
   *
   * @example
   * ```typescript
   * const notification = await notificationService.sendFromTemplate(
   *   'admin-123',
   *   'medication-reminder',
   *   { medicationName: 'Aspirin', dosage: '100mg' },
   *   ['user-456'],
   *   { scheduledFor: new Date('2025-10-28T09:00:00Z') }
   * );
   * ```
   */
  async sendFromTemplate(
    userId: string,
    templateId: string,
    variables: Record<string, string>,
    userIds: string[],
    options?: Partial<SendNotificationDto>,
  ): Promise<PushNotification> {
    const template = this.getTemplate(templateId);
    const { title, body } = this.renderTemplate(templateId, variables);

    return this.sendNotification(userId, {
      userIds,
      title,
      body,
      category: template.category,
      priority: template.priority || NotificationPriority.NORMAL,
      sound: template.sound,
      actions: template.actions,
      ...options,
    });
  }

  /**
   * Send to specific platform using platform-specific adapters
   *
   * @param platform - The notification platform
   * @param token - The device token
   * @param notification - The notification to send
   * @returns Delivery result
   */
  private async sendToPlatform(
    platform: NotificationPlatform,
    token: DeviceToken,
    notification: PushNotification,
  ): Promise<PlatformDeliveryResult> {
    try {
      this.logger.log(
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
          this.logger.warn(`Unsupported platform: ${platform}`);
          return {
            success: false,
            error: `Unsupported platform: ${platform}`,
          };
      }
    } catch (error) {
      this.logger.error(`Failed to send to ${platform}`, error);
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
      this.logger.warn('Firebase not initialized, skipping FCM delivery');
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

      this.logger.log(`FCM delivery successful: ${response}`);

      return {
        success: true,
        response: { messageId: response },
      };
    } catch (error: any) {
      this.logger.error('FCM delivery failed', error);

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
      this.logger.warn('APNs not initialized, skipping APNs delivery');
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

      this.logger.log('APNs delivery successful');

      return {
        success: true,
        response: result.sent,
      };
    } catch (error) {
      this.logger.error('APNs delivery failed', error);

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
        this.logger.warn('web-push not installed');
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
        this.logger.warn('VAPID keys not configured');
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

      this.logger.log('Web Push delivery successful');

      return {
        success: true,
        response,
      };
    } catch (error: any) {
      this.logger.error('Web Push delivery failed', error);

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

  /**
   * Track notification interaction
   */
  async trackInteraction(
    notificationId: string,
    action: 'CLICKED' | 'DISMISSED',
  ): Promise<void> {
    const notification = await this.notificationModel.findOne({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (action === 'CLICKED') {
      notification.clickedCount++;
    } else if (action === 'DISMISSED') {
      notification.dismissedCount++;
    }

    await notification.save();

    this.logger.log(`Interaction tracked: ${notificationId} - ${action}`);
  }

  /**
   * Get notification analytics
   */
  async getAnalytics(period: { start: Date; end: Date }): Promise<any> {
    const notifications = await this.notificationModel.findAll({
      where: {
        createdAt: {
          [Op.gte]: period.start,
          [Op.lte]: period.end,
        },
      },
    });

    const totalSent = notifications.length;
    const totalDelivered = notifications.filter(
      (n) => n.status === NotificationStatus.DELIVERED,
    ).length;
    const totalFailed = notifications.filter(
      (n) => n.status === NotificationStatus.FAILED,
    ).length;
    const totalClicked = notifications.reduce(
      (sum, n) => sum + n.clickedCount,
      0,
    );

    const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;
    const clickRate =
      totalDelivered > 0 ? (totalClicked / totalDelivered) * 100 : 0;

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
   * Process scheduled notifications
   *
   * @description
   * This method should be called periodically (e.g., every minute) by a cron job
   * or background worker to process notifications scheduled for delivery.
   *
   * @returns Number of notifications processed
   *
   * @example
   * ```typescript
   * // In a cron job or scheduled task
   * @Cron('* * * * *') // Every minute
   * async handleScheduledNotifications() {
   *   await this.notificationService.processScheduledNotifications();
   * }
   * ```
   */
  async processScheduledNotifications(): Promise<number> {
    try {
      const now = new Date();

      // Find scheduled notifications that are due for delivery
      const scheduledNotifications = await this.notificationModel.findAll({
        where: {
          status: NotificationStatus.SCHEDULED,
          scheduledFor: {
            [Op.lt]: now,
          },
        },
        order: [['scheduledFor', 'ASC']],
        limit: 100, // Process in batches
      });

      this.logger.log(
        `Processing ${scheduledNotifications.length} scheduled notifications`,
      );

      for (const notification of scheduledNotifications) {
        try {
          // Check if notification has expired
          if (notification.expiresAt && notification.expiresAt < now) {
            notification.status = NotificationStatus.EXPIRED;
            await notification.save();
            this.logger.warn(`Notification ${notification.id} expired`);
            continue;
          }

          // Deliver the notification
          if (notification.id) {
            await this.deliverNotification(notification.id);
          }
        } catch (error) {
          this.logger.error(
            `Failed to deliver scheduled notification ${notification.id}`,
            error,
          );
        }
      }

      return scheduledNotifications.length;
    } catch (error) {
      this.logger.error('Error processing scheduled notifications', error);
      return 0;
    }
  }

  /**
   * Retry failed notifications
   *
   * @description
   * Attempts to retry notifications that failed delivery but haven't exceeded
   * their maximum retry count.
   *
   * @returns Number of notifications retried
   */
  async retryFailedNotifications(): Promise<number> {
    try {
      const now = new Date();

      // Find failed notifications eligible for retry
      const failedNotifications = await this.notificationModel.findAll({
        where: {
          status: NotificationStatus.FAILED,
        },
        order: [['nextRetryAt', 'ASC']],
        limit: 50, // Process in batches
      });

      // Filter notifications that haven't exceeded max retries and are due for retry
      const eligibleNotifications = failedNotifications.filter(
        (n) =>
          n.retryCount < n.maxRetries &&
          (!n.nextRetryAt || n.nextRetryAt <= now),
      );

      this.logger.log(
        `Retrying ${eligibleNotifications.length} failed notifications`,
      );

      for (const notification of eligibleNotifications) {
        try {
          notification.retryCount++;
          notification.status = NotificationStatus.PENDING;
          notification.nextRetryAt = undefined;
          await notification.save();

          if (notification.id) {
            await this.deliverNotification(notification.id);
          }
        } catch (error) {
          this.logger.error(
            `Failed to retry notification ${notification.id}`,
            error,
          );
        }
      }

      return eligibleNotifications.length;
    } catch (error) {
      this.logger.error('Error retrying failed notifications', error);
      return 0;
    }
  }

  /**
   * Clean up old notifications
   *
   * @param retentionDays - Number of days to retain notification records
   * @returns Number of notifications deleted
   *
   * @description
   * Removes old notification records to prevent database growth.
   * Should be run periodically (e.g., daily).
   */
  async cleanupOldNotifications(retentionDays: number = 90): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      const deletedCount = await this.notificationModel.destroy({
        where: {
          createdAt: {
            [Op.lt]: cutoffDate,
          },
          status: {
            [Op.in]: [NotificationStatus.DELIVERED, NotificationStatus.EXPIRED],
          },
        },
      });

      this.logger.log(
        `Cleaned up ${deletedCount} old notifications (older than ${retentionDays} days)`,
      );

      return deletedCount;
    } catch (error) {
      this.logger.error('Error cleaning up old notifications', error);
      return 0;
    }
  }

  /**
   * Get notification history for a user
   *
   * @param userId - The user ID
   * @param options - Query options (limit, offset, status filter)
   * @returns Array of notifications
   */
  async getNotificationHistory(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      status?: NotificationStatus;
      category?: NotificationCategory;
    },
  ): Promise<PushNotification[]> {
    const where: any = {
      userIds: {
        [Op.contains]: [userId],
      },
    };

    if (options?.status) {
      where.status = options.status;
    }

    if (options?.category) {
      where.category = options.category;
    }

    return this.notificationModel.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: options?.limit,
      offset: options?.offset,
    });
  }

  /**
   * Get notification statistics for a user
   *
   * @param userId - The user ID
   * @param period - Optional time period
   * @returns Notification statistics
   */
  async getUserNotificationStats(
    userId: string,
    period?: { start: Date; end: Date },
  ): Promise<{
    total: number;
    delivered: number;
    clicked: number;
    dismissed: number;
    byCategory: Record<string, number>;
  }> {
    const where: any = {
      userIds: {
        [Op.contains]: [userId],
      },
    };

    if (period) {
      where.createdAt = {
        [Op.gte]: period.start,
        [Op.lte]: period.end,
      };
    }

    const notifications = await this.notificationModel.findAll({
      where,
    });

    const total = notifications.length;
    const delivered = notifications.filter(
      (n) => n.status === NotificationStatus.DELIVERED,
    ).length;
    const clicked = notifications.reduce((sum, n) => sum + n.clickedCount, 0);
    const dismissed = notifications.reduce(
      (sum, n) => sum + n.dismissedCount,
      0,
    );

    const byCategory: Record<string, number> = {};
    for (const notification of notifications) {
      byCategory[notification.category] =
        (byCategory[notification.category] || 0) + 1;
    }

    return {
      total,
      delivered,
      clicked,
      dismissed,
      byCategory,
    };
  }

  /**
   * Get active tokens for users
   *
   * @private
   * @param userIds - Array of user IDs to get tokens for
   * @returns Active device tokens for the specified users
   */
  private async getActiveTokensForUsers(
    userIds: string[],
  ): Promise<DeviceToken[]> {
    // For multiple users, we need to find tokens where userId is in the array
    // and the token is active, valid, and allows notifications
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
