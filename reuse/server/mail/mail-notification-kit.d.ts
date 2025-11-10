/**
 * LOC: MAILNTF1234567
 * File: /reuse/server/mail/mail-notification-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS mail services
 *   - Notification controllers
 *   - WebSocket gateways
 *   - Push notification services
 *   - SMS integration services
 *   - Sequelize models
 */
interface NotificationEvent {
    id: string;
    userId: string;
    eventType: NotificationEventType;
    entityType: 'message' | 'meeting' | 'calendar' | 'contact' | 'task' | 'alert';
    entityId: string;
    title: string;
    message: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    category: string;
    actionUrl?: string;
    actionData?: Record<string, any>;
    imageUrl?: string;
    iconUrl?: string;
    sound?: string;
    badge?: number;
    metadata?: Record<string, any>;
    expiresAt?: Date;
    createdAt: Date;
}
type NotificationEventType = 'new_mail' | 'meeting_request' | 'meeting_reminder' | 'meeting_cancelled' | 'meeting_updated' | 'calendar_reminder' | 'task_assigned' | 'task_reminder' | 'contact_shared' | 'mail_replied' | 'mail_forwarded' | 'read_receipt' | 'delivery_receipt' | 'out_of_office_reply' | 'mailbox_full' | 'system_alert' | 'security_alert';
interface NotificationDelivery {
    id: string;
    notificationId: string;
    userId: string;
    deliveryChannel: NotificationChannel;
    deliveryStatus: 'pending' | 'sent' | 'delivered' | 'failed' | 'read' | 'dismissed';
    deliveryAttempts: number;
    lastAttemptAt?: Date;
    deliveredAt?: Date;
    readAt?: Date;
    dismissedAt?: Date;
    failureReason?: string;
    errorCode?: string;
    externalId?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
type NotificationChannel = 'email' | 'desktop_push' | 'mobile_push' | 'sms' | 'websocket' | 'in_app';
interface NotificationPreferences {
    id: string;
    userId: string;
    enabled: boolean;
    channels: NotificationChannelPreferences;
    eventTypeSettings: Record<NotificationEventType, EventTypePreference>;
    quietHours?: QuietHoursSettings;
    doNotDisturb: boolean;
    doNotDisturbUntil?: Date;
    groupingEnabled: boolean;
    groupingInterval: number;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    badgeCountEnabled: boolean;
    previewInLockScreen: boolean;
    createdAt: Date;
    updatedAt: Date;
}
interface NotificationChannelPreferences {
    email: ChannelSettings;
    desktop_push: ChannelSettings;
    mobile_push: ChannelSettings;
    sms: ChannelSettings;
    websocket: ChannelSettings;
    in_app: ChannelSettings;
}
interface ChannelSettings {
    enabled: boolean;
    priority: number;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    customSound?: string;
    deliveryDelay?: number;
}
interface EventTypePreference {
    enabled: boolean;
    channels: NotificationChannel[];
    priority: 'low' | 'normal' | 'high' | 'urgent';
    soundOverride?: string;
    groupingEnabled: boolean;
}
interface QuietHoursSettings {
    enabled: boolean;
    startTime: string;
    endTime: string;
    daysOfWeek: number[];
    timezone: string;
    allowUrgent: boolean;
    allowedEventTypes: NotificationEventType[];
}
interface SMSNotification {
    id: string;
    userId: string;
    phoneNumber: string;
    message: string;
    status: 'pending' | 'sent' | 'delivered' | 'failed';
    provider: 'twilio' | 'sns' | 'nexmo';
    externalId?: string;
    sentAt?: Date;
    deliveredAt?: Date;
    failureReason?: string;
    cost?: number;
    metadata?: Record<string, any>;
    createdAt: Date;
}
interface WebSocketNotification {
    id: string;
    userId: string;
    eventType: NotificationEventType;
    payload: any;
    sentAt: Date;
    acknowledged: boolean;
    acknowledgedAt?: Date;
}
interface EmailNotificationTemplate {
    id: string;
    name: string;
    eventType: NotificationEventType;
    subject: string;
    bodyHtml: string;
    bodyText: string;
    variables: string[];
    locale: string;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
interface ReadReceipt {
    id: string;
    messageId: string;
    userId: string;
    recipientAddress: string;
    readAt: Date;
    ipAddress?: string;
    userAgent?: string;
    location?: string;
    deviceType?: 'desktop' | 'mobile' | 'tablet';
    notificationSent: boolean;
    createdAt: Date;
}
interface DeliveryReceipt {
    id: string;
    messageId: string;
    userId: string;
    recipientAddress: string;
    deliveryStatus: 'sent' | 'delivered' | 'failed' | 'bounced' | 'deferred';
    deliveredAt?: Date;
    remoteServer?: string;
    smtpStatus?: string;
    smtpMessage?: string;
    attempts: number;
    lastAttemptAt: Date;
    notificationSent: boolean;
    createdAt: Date;
    updatedAt: Date;
}
interface NotificationGroup {
    id: string;
    userId: string;
    groupKey: string;
    eventType: NotificationEventType;
    notificationIds: string[];
    count: number;
    firstNotificationAt: Date;
    lastNotificationAt: Date;
    summary: string;
    isCollapsed: boolean;
    createdAt: Date;
}
interface NotificationFilter {
    userId: string;
    eventTypes?: NotificationEventType[];
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    channels?: NotificationChannel[];
    startDate?: Date;
    endDate?: Date;
    readStatus?: 'read' | 'unread' | 'all';
    limit?: number;
    offset?: number;
}
interface DeviceRegistration {
    id: string;
    userId: string;
    deviceType: 'ios' | 'android' | 'web' | 'desktop';
    deviceToken: string;
    deviceName?: string;
    deviceModel?: string;
    osVersion?: string;
    appVersion?: string;
    isActive: boolean;
    lastActiveAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
interface NotificationStats {
    userId: string;
    period: 'hour' | 'day' | 'week' | 'month';
    totalSent: number;
    totalDelivered: number;
    totalRead: number;
    totalFailed: number;
    byChannel: Record<NotificationChannel, number>;
    byEventType: Record<NotificationEventType, number>;
    averageDeliveryTime: number;
    readRate: number;
}
interface ExchangeNotification {
    subscriptionId: string;
    userId: string;
    eventType: 'NewMail' | 'Deleted' | 'Modified' | 'Moved' | 'Copied' | 'Created';
    itemId: string;
    parentFolderId: string;
    timestamp: Date;
    watermark: string;
}
interface SwaggerNotificationSchema {
    name: string;
    type: string;
    description: string;
    example: any;
    required?: boolean;
    properties?: Record<string, any>;
}
/**
 * Sequelize NotificationEvent model attributes for notification_events table.
 *
 * @example
 * ```typescript
 * class NotificationEvent extends Model {}
 * NotificationEvent.init(getNotificationEventModelAttributes(), {
 *   sequelize,
 *   tableName: 'notification_events',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['userId', 'createdAt'] },
 *     { fields: ['eventType'] },
 *     { fields: ['entityType', 'entityId'] }
 *   ]
 * });
 * ```
 */
export declare const getNotificationEventModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    eventType: {
        type: string;
        values: string[];
        allowNull: boolean;
    };
    entityType: {
        type: string;
        values: string[];
        allowNull: boolean;
    };
    entityId: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    title: {
        type: string;
        allowNull: boolean;
    };
    message: {
        type: string;
        allowNull: boolean;
    };
    priority: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    category: {
        type: string;
        allowNull: boolean;
    };
    actionUrl: {
        type: string;
        allowNull: boolean;
    };
    actionData: {
        type: string;
        allowNull: boolean;
    };
    imageUrl: {
        type: string;
        allowNull: boolean;
    };
    iconUrl: {
        type: string;
        allowNull: boolean;
    };
    sound: {
        type: string;
        allowNull: boolean;
    };
    badge: {
        type: string;
        allowNull: boolean;
    };
    metadata: {
        type: string;
        allowNull: boolean;
        defaultValue: {};
    };
    expiresAt: {
        type: string;
        allowNull: boolean;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize NotificationDelivery model attributes for notification_deliveries table.
 *
 * @example
 * ```typescript
 * class NotificationDelivery extends Model {}
 * NotificationDelivery.init(getNotificationDeliveryModelAttributes(), {
 *   sequelize,
 *   tableName: 'notification_deliveries',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['notificationId'] },
 *     { fields: ['userId', 'deliveryChannel'] },
 *     { fields: ['deliveryStatus'] }
 *   ]
 * });
 * ```
 */
export declare const getNotificationDeliveryModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    notificationId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    deliveryChannel: {
        type: string;
        values: string[];
        allowNull: boolean;
    };
    deliveryStatus: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    deliveryAttempts: {
        type: string;
        defaultValue: number;
    };
    lastAttemptAt: {
        type: string;
        allowNull: boolean;
    };
    deliveredAt: {
        type: string;
        allowNull: boolean;
    };
    readAt: {
        type: string;
        allowNull: boolean;
    };
    dismissedAt: {
        type: string;
        allowNull: boolean;
    };
    failureReason: {
        type: string;
        allowNull: boolean;
    };
    errorCode: {
        type: string;
        allowNull: boolean;
    };
    externalId: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    metadata: {
        type: string;
        allowNull: boolean;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize NotificationPreferences model attributes for notification_preferences table.
 *
 * @example
 * ```typescript
 * class NotificationPreferences extends Model {}
 * NotificationPreferences.init(getNotificationPreferencesModelAttributes(), {
 *   sequelize,
 *   tableName: 'notification_preferences',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['userId'], unique: true }
 *   ]
 * });
 * ```
 */
export declare const getNotificationPreferencesModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    userId: {
        type: string;
        allowNull: boolean;
        unique: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    enabled: {
        type: string;
        defaultValue: boolean;
    };
    channels: {
        type: string;
        allowNull: boolean;
        defaultValue: {
            email: {
                enabled: boolean;
                priority: number;
                soundEnabled: boolean;
                vibrationEnabled: boolean;
            };
            desktop_push: {
                enabled: boolean;
                priority: number;
                soundEnabled: boolean;
                vibrationEnabled: boolean;
            };
            mobile_push: {
                enabled: boolean;
                priority: number;
                soundEnabled: boolean;
                vibrationEnabled: boolean;
            };
            sms: {
                enabled: boolean;
                priority: number;
                soundEnabled: boolean;
                vibrationEnabled: boolean;
            };
            websocket: {
                enabled: boolean;
                priority: number;
                soundEnabled: boolean;
                vibrationEnabled: boolean;
            };
            in_app: {
                enabled: boolean;
                priority: number;
                soundEnabled: boolean;
                vibrationEnabled: boolean;
            };
        };
    };
    eventTypeSettings: {
        type: string;
        allowNull: boolean;
        defaultValue: {};
    };
    quietHours: {
        type: string;
        allowNull: boolean;
    };
    doNotDisturb: {
        type: string;
        defaultValue: boolean;
    };
    doNotDisturbUntil: {
        type: string;
        allowNull: boolean;
    };
    groupingEnabled: {
        type: string;
        defaultValue: boolean;
    };
    groupingInterval: {
        type: string;
        defaultValue: number;
        comment: string;
    };
    soundEnabled: {
        type: string;
        defaultValue: boolean;
    };
    vibrationEnabled: {
        type: string;
        defaultValue: boolean;
    };
    badgeCountEnabled: {
        type: string;
        defaultValue: boolean;
    };
    previewInLockScreen: {
        type: string;
        defaultValue: boolean;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize DeviceRegistration model attributes for device_registrations table.
 *
 * @example
 * ```typescript
 * class DeviceRegistration extends Model {}
 * DeviceRegistration.init(getDeviceRegistrationModelAttributes(), {
 *   sequelize,
 *   tableName: 'device_registrations',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['userId'] },
 *     { fields: ['deviceToken'], unique: true },
 *     { fields: ['isActive'] }
 *   ]
 * });
 * ```
 */
export declare const getDeviceRegistrationModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    deviceType: {
        type: string;
        values: string[];
        allowNull: boolean;
    };
    deviceToken: {
        type: string;
        allowNull: boolean;
        unique: boolean;
    };
    deviceName: {
        type: string;
        allowNull: boolean;
    };
    deviceModel: {
        type: string;
        allowNull: boolean;
    };
    osVersion: {
        type: string;
        allowNull: boolean;
    };
    appVersion: {
        type: string;
        allowNull: boolean;
    };
    isActive: {
        type: string;
        defaultValue: boolean;
    };
    lastActiveAt: {
        type: string;
        allowNull: boolean;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize EmailNotificationTemplate model attributes for email_notification_templates table.
 *
 * @example
 * ```typescript
 * class EmailNotificationTemplate extends Model {}
 * EmailNotificationTemplate.init(getEmailNotificationTemplateModelAttributes(), {
 *   sequelize,
 *   tableName: 'email_notification_templates',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['eventType', 'locale'] },
 *     { fields: ['isActive'] }
 *   ]
 * });
 * ```
 */
export declare const getEmailNotificationTemplateModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    name: {
        type: string;
        allowNull: boolean;
    };
    eventType: {
        type: string;
        values: string[];
        allowNull: boolean;
    };
    subject: {
        type: string;
        allowNull: boolean;
    };
    bodyHtml: {
        type: string;
        allowNull: boolean;
    };
    bodyText: {
        type: string;
        allowNull: boolean;
    };
    variables: {
        type: string;
        allowNull: boolean;
        defaultValue: never[];
    };
    locale: {
        type: string;
        defaultValue: string;
    };
    isActive: {
        type: string;
        defaultValue: boolean;
    };
    createdBy: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize ReadReceipt model attributes for read_receipts table.
 *
 * @example
 * ```typescript
 * class ReadReceipt extends Model {}
 * ReadReceipt.init(getReadReceiptModelAttributes(), {
 *   sequelize,
 *   tableName: 'read_receipts',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['messageId'] },
 *     { fields: ['userId'] },
 *     { fields: ['recipientAddress'] }
 *   ]
 * });
 * ```
 */
export declare const getReadReceiptModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    messageId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    recipientAddress: {
        type: string;
        allowNull: boolean;
    };
    readAt: {
        type: string;
        allowNull: boolean;
    };
    ipAddress: {
        type: string;
        allowNull: boolean;
    };
    userAgent: {
        type: string;
        allowNull: boolean;
    };
    location: {
        type: string;
        allowNull: boolean;
    };
    deviceType: {
        type: string;
        values: string[];
        allowNull: boolean;
    };
    notificationSent: {
        type: string;
        defaultValue: boolean;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize DeliveryReceipt model attributes for delivery_receipts table.
 *
 * @example
 * ```typescript
 * class DeliveryReceipt extends Model {}
 * DeliveryReceipt.init(getDeliveryReceiptModelAttributes(), {
 *   sequelize,
 *   tableName: 'delivery_receipts',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['messageId'] },
 *     { fields: ['userId'] },
 *     { fields: ['deliveryStatus'] }
 *   ]
 * });
 * ```
 */
export declare const getDeliveryReceiptModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    messageId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    recipientAddress: {
        type: string;
        allowNull: boolean;
    };
    deliveryStatus: {
        type: string;
        values: string[];
        allowNull: boolean;
    };
    deliveredAt: {
        type: string;
        allowNull: boolean;
    };
    remoteServer: {
        type: string;
        allowNull: boolean;
    };
    smtpStatus: {
        type: string;
        allowNull: boolean;
    };
    smtpMessage: {
        type: string;
        allowNull: boolean;
    };
    attempts: {
        type: string;
        defaultValue: number;
    };
    lastAttemptAt: {
        type: string;
        allowNull: boolean;
    };
    notificationSent: {
        type: string;
        defaultValue: boolean;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Creates a new notification event for processing and delivery.
 *
 * @param {Partial<NotificationEvent>} eventData - Notification event data
 * @returns {NotificationEvent} Created notification event
 *
 * @example
 * ```typescript
 * const notification = createNotificationEvent({
 *   userId: 'user-123',
 *   eventType: 'new_mail',
 *   entityType: 'message',
 *   entityId: 'msg-456',
 *   title: 'New Message from Dr. Smith',
 *   message: 'You have received a new message regarding patient care',
 *   priority: 'high',
 *   category: 'mail',
 *   actionUrl: '/mail/inbox/msg-456'
 * });
 * ```
 */
export declare const createNotificationEvent: (eventData: Partial<NotificationEvent>) => NotificationEvent;
/**
 * Creates a new mail notification event for incoming messages.
 *
 * @param {string} userId - User ID
 * @param {any} mailMessage - Mail message object
 * @returns {NotificationEvent} New mail notification
 *
 * @example
 * ```typescript
 * const notification = createNewMailNotification('user-123', {
 *   id: 'msg-456',
 *   from: { name: 'Dr. Smith', address: 'smith@whitecross.com' },
 *   subject: 'Patient Update',
 *   bodyPreview: 'The patient has been discharged...'
 * });
 * ```
 */
export declare const createNewMailNotification: (userId: string, mailMessage: any) => NotificationEvent;
/**
 * Creates a meeting request notification event.
 *
 * @param {string} userId - User ID
 * @param {any} meetingRequest - Meeting request object
 * @returns {NotificationEvent} Meeting request notification
 *
 * @example
 * ```typescript
 * const notification = createMeetingRequestNotification('user-123', {
 *   id: 'mtg-789',
 *   organizer: { name: 'Dr. Johnson', email: 'johnson@whitecross.com' },
 *   subject: 'Weekly Team Meeting',
 *   startTime: new Date('2025-01-15T10:00:00Z'),
 *   endTime: new Date('2025-01-15T11:00:00Z')
 * });
 * ```
 */
export declare const createMeetingRequestNotification: (userId: string, meetingRequest: any) => NotificationEvent;
/**
 * Creates a calendar reminder notification event.
 *
 * @param {string} userId - User ID
 * @param {any} calendarEvent - Calendar event object
 * @param {number} minutesBefore - Minutes before event
 * @returns {NotificationEvent} Calendar reminder notification
 *
 * @example
 * ```typescript
 * const notification = createCalendarReminderNotification('user-123', {
 *   id: 'evt-101',
 *   subject: 'Patient Consultation',
 *   startTime: new Date('2025-01-15T14:00:00Z')
 * }, 15);
 * ```
 */
export declare const createCalendarReminderNotification: (userId: string, calendarEvent: any, minutesBefore: number) => NotificationEvent;
/**
 * Creates a read receipt notification when someone reads your message.
 *
 * @param {string} userId - User ID
 * @param {ReadReceipt} readReceipt - Read receipt data
 * @returns {NotificationEvent} Read receipt notification
 *
 * @example
 * ```typescript
 * const notification = createReadReceiptNotification('user-123', {
 *   messageId: 'msg-456',
 *   recipientAddress: 'johnson@whitecross.com',
 *   readAt: new Date()
 * });
 * ```
 */
export declare const createReadReceiptNotification: (userId: string, readReceipt: any) => NotificationEvent;
/**
 * Creates a delivery receipt notification for message delivery status.
 *
 * @param {string} userId - User ID
 * @param {DeliveryReceipt} deliveryReceipt - Delivery receipt data
 * @returns {NotificationEvent} Delivery receipt notification
 *
 * @example
 * ```typescript
 * const notification = createDeliveryReceiptNotification('user-123', {
 *   messageId: 'msg-456',
 *   recipientAddress: 'johnson@whitecross.com',
 *   deliveryStatus: 'delivered',
 *   deliveredAt: new Date()
 * });
 * ```
 */
export declare const createDeliveryReceiptNotification: (userId: string, deliveryReceipt: any) => NotificationEvent;
/**
 * Retrieves notification preferences for a user.
 *
 * @param {string} userId - User ID
 * @returns {NotificationPreferences} User notification preferences
 *
 * @example
 * ```typescript
 * const prefs = getUserNotificationPreferences('user-123');
 * console.log('Notifications enabled:', prefs.enabled);
 * console.log('Email notifications:', prefs.channels.email.enabled);
 * ```
 */
export declare const getUserNotificationPreferences: (userId: string) => NotificationPreferences;
/**
 * Updates notification preferences for a user.
 *
 * @param {string} userId - User ID
 * @param {Partial<NotificationPreferences>} updates - Preference updates
 * @returns {NotificationPreferences} Updated preferences
 *
 * @example
 * ```typescript
 * const updated = updateNotificationPreferences('user-123', {
 *   doNotDisturb: true,
 *   doNotDisturbUntil: new Date('2025-01-15T18:00:00Z'),
 *   channels: {
 *     ...existingChannels,
 *     sms: { enabled: true, priority: 9, soundEnabled: true, vibrationEnabled: true }
 *   }
 * });
 * ```
 */
export declare const updateNotificationPreferences: (userId: string, updates: Partial<NotificationPreferences>) => NotificationPreferences;
/**
 * Configures quiet hours for a user to suppress non-urgent notifications.
 *
 * @param {string} userId - User ID
 * @param {QuietHoursSettings} quietHours - Quiet hours configuration
 * @returns {NotificationPreferences} Updated preferences
 *
 * @example
 * ```typescript
 * const prefs = setQuietHours('user-123', {
 *   enabled: true,
 *   startTime: '22:00',
 *   endTime: '07:00',
 *   daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
 *   timezone: 'America/New_York',
 *   allowUrgent: true,
 *   allowedEventTypes: ['security_alert', 'system_alert']
 * });
 * ```
 */
export declare const setQuietHours: (userId: string, quietHours: QuietHoursSettings) => NotificationPreferences;
/**
 * Enables or disables do-not-disturb mode for a user.
 *
 * @param {string} userId - User ID
 * @param {boolean} enabled - Enable or disable DND
 * @param {Date} until - Optional expiry time for DND
 * @returns {NotificationPreferences} Updated preferences
 *
 * @example
 * ```typescript
 * // Enable DND for next 2 hours
 * const prefs = setDoNotDisturb('user-123', true, new Date(Date.now() + 2 * 60 * 60 * 1000));
 * ```
 */
export declare const setDoNotDisturb: (userId: string, enabled: boolean, until?: Date) => NotificationPreferences;
/**
 * Checks if notifications should be suppressed based on preferences.
 *
 * @param {NotificationPreferences} preferences - User preferences
 * @param {NotificationEvent} event - Notification event
 * @returns {boolean} True if notification should be suppressed
 *
 * @example
 * ```typescript
 * const shouldSuppress = shouldSuppressNotification(userPrefs, notificationEvent);
 * if (!shouldSuppress) {
 *   await deliverNotification(event);
 * }
 * ```
 */
export declare const shouldSuppressNotification: (preferences: NotificationPreferences, event: NotificationEvent) => boolean;
/**
 * Determines which channels to use for delivering a notification.
 *
 * @param {NotificationPreferences} preferences - User preferences
 * @param {NotificationEvent} event - Notification event
 * @returns {NotificationChannel[]} Channels to use for delivery
 *
 * @example
 * ```typescript
 * const channels = getDeliveryChannels(userPrefs, notificationEvent);
 * // ['mobile_push', 'websocket', 'email']
 * ```
 */
export declare const getDeliveryChannels: (preferences: NotificationPreferences, event: NotificationEvent) => NotificationChannel[];
/**
 * Sends an email notification based on a notification event.
 *
 * @param {NotificationEvent} event - Notification event
 * @param {string} userEmail - User email address
 * @returns {Promise<NotificationDelivery>} Delivery record
 *
 * @example
 * ```typescript
 * const delivery = await sendEmailNotification(event, 'user@whitecross.com');
 * console.log('Email sent:', delivery.deliveryStatus);
 * ```
 */
export declare const sendEmailNotification: (event: NotificationEvent, userEmail: string) => Promise<NotificationDelivery>;
/**
 * Retrieves a notification template by event type and locale.
 *
 * @param {NotificationEventType} eventType - Event type
 * @param {string} locale - Locale code
 * @returns {Promise<EmailNotificationTemplate>} Template
 *
 * @example
 * ```typescript
 * const template = await getNotificationTemplate('new_mail', 'en-US');
 * console.log('Template:', template.subject);
 * ```
 */
export declare const getNotificationTemplate: (eventType: NotificationEventType, locale: string) => Promise<EmailNotificationTemplate>;
/**
 * Renders a notification template with event data.
 *
 * @param {EmailNotificationTemplate} template - Template to render
 * @param {NotificationEvent} event - Event data
 * @returns {object} Rendered template
 *
 * @example
 * ```typescript
 * const rendered = renderNotificationTemplate(template, event);
 * console.log('Subject:', rendered.subject);
 * console.log('Body:', rendered.bodyHtml);
 * ```
 */
export declare const renderNotificationTemplate: (template: EmailNotificationTemplate, event: NotificationEvent) => {
    subject: string;
    bodyHtml: string;
    bodyText: string;
};
/**
 * Sends a desktop push notification via Web Push API.
 *
 * @param {NotificationEvent} event - Notification event
 * @param {DeviceRegistration} device - Device registration
 * @returns {Promise<NotificationDelivery>} Delivery record
 *
 * @example
 * ```typescript
 * const delivery = await sendDesktopPushNotification(event, deviceRegistration);
 * console.log('Push sent:', delivery.deliveryStatus);
 * ```
 */
export declare const sendDesktopPushNotification: (event: NotificationEvent, device: DeviceRegistration) => Promise<NotificationDelivery>;
/**
 * Sends a mobile push notification via APNS (iOS) or FCM (Android).
 *
 * @param {NotificationEvent} event - Notification event
 * @param {DeviceRegistration} device - Device registration
 * @returns {Promise<NotificationDelivery>} Delivery record
 *
 * @example
 * ```typescript
 * const delivery = await sendMobilePushNotification(event, deviceRegistration);
 * console.log('Mobile push sent:', delivery.deliveryStatus);
 * ```
 */
export declare const sendMobilePushNotification: (event: NotificationEvent, device: DeviceRegistration) => Promise<NotificationDelivery>;
/**
 * Sends an APNS notification to iOS devices.
 *
 * @param {NotificationEvent} event - Notification event
 * @param {DeviceRegistration} device - iOS device registration
 * @returns {Promise<NotificationDelivery>} Delivery record
 *
 * @example
 * ```typescript
 * const delivery = await sendAPNSNotification(event, iosDevice);
 * console.log('APNS notification sent:', delivery.externalId);
 * ```
 */
export declare const sendAPNSNotification: (event: NotificationEvent, device: DeviceRegistration) => Promise<NotificationDelivery>;
/**
 * Sends an FCM notification to Android devices.
 *
 * @param {NotificationEvent} event - Notification event
 * @param {DeviceRegistration} device - Android device registration
 * @returns {Promise<NotificationDelivery>} Delivery record
 *
 * @example
 * ```typescript
 * const delivery = await sendFCMNotification(event, androidDevice);
 * console.log('FCM notification sent:', delivery.externalId);
 * ```
 */
export declare const sendFCMNotification: (event: NotificationEvent, device: DeviceRegistration) => Promise<NotificationDelivery>;
/**
 * Registers a device for push notifications.
 *
 * @param {string} userId - User ID
 * @param {Partial<DeviceRegistration>} deviceData - Device registration data
 * @returns {DeviceRegistration} Created device registration
 *
 * @example
 * ```typescript
 * const registration = registerDevice('user-123', {
 *   deviceType: 'ios',
 *   deviceToken: 'apns-token-xyz',
 *   deviceName: 'iPhone 13 Pro',
 *   deviceModel: 'iPhone14,3',
 *   osVersion: '15.5',
 *   appVersion: '2.1.0'
 * });
 * ```
 */
export declare const registerDevice: (userId: string, deviceData: Partial<DeviceRegistration>) => DeviceRegistration;
/**
 * Unregisters a device from push notifications.
 *
 * @param {string} deviceId - Device ID
 * @returns {boolean} Success status
 *
 * @example
 * ```typescript
 * const success = unregisterDevice('device-456');
 * console.log('Device unregistered:', success);
 * ```
 */
export declare const unregisterDevice: (deviceId: string) => boolean;
/**
 * Sends an SMS notification via configured provider (Twilio, SNS, etc.).
 *
 * @param {NotificationEvent} event - Notification event
 * @param {string} phoneNumber - Phone number
 * @returns {Promise<SMSNotification>} SMS notification record
 *
 * @example
 * ```typescript
 * const sms = await sendSMSNotification(event, '+1234567890');
 * console.log('SMS sent:', sms.status);
 * ```
 */
export declare const sendSMSNotification: (event: NotificationEvent, phoneNumber: string) => Promise<SMSNotification>;
/**
 * Formats notification message for SMS (character limits, etc.).
 *
 * @param {NotificationEvent} event - Notification event
 * @param {number} maxLength - Maximum message length
 * @returns {string} Formatted SMS message
 *
 * @example
 * ```typescript
 * const message = formatSMSMessage(event, 160);
 * console.log('SMS message:', message);
 * ```
 */
export declare const formatSMSMessage: (event: NotificationEvent, maxLength?: number) => string;
/**
 * Sends a real-time notification via WebSocket to connected clients.
 *
 * @param {NotificationEvent} event - Notification event
 * @param {any} wsConnection - WebSocket connection
 * @returns {Promise<WebSocketNotification>} WebSocket notification record
 *
 * @example
 * ```typescript
 * const wsNotif = await sendWebSocketNotification(event, userWebSocket);
 * console.log('Real-time notification sent:', wsNotif.id);
 * ```
 */
export declare const sendWebSocketNotification: (event: NotificationEvent, wsConnection: any) => Promise<WebSocketNotification>;
/**
 * Broadcasts a notification to all connected WebSocket clients for a user.
 *
 * @param {NotificationEvent} event - Notification event
 * @param {any[]} wsConnections - Array of WebSocket connections
 * @returns {Promise<WebSocketNotification[]>} WebSocket notification records
 *
 * @example
 * ```typescript
 * const notifications = await broadcastWebSocketNotification(event, userWebSockets);
 * console.log(`Broadcast to ${notifications.length} connections`);
 * ```
 */
export declare const broadcastWebSocketNotification: (event: NotificationEvent, wsConnections: any[]) => Promise<WebSocketNotification[]>;
/**
 * Acknowledges receipt of a WebSocket notification.
 *
 * @param {string} notificationId - WebSocket notification ID
 * @returns {boolean} Success status
 *
 * @example
 * ```typescript
 * const success = acknowledgeWebSocketNotification('wsnotif-123');
 * console.log('Notification acknowledged:', success);
 * ```
 */
export declare const acknowledgeWebSocketNotification: (notificationId: string) => boolean;
/**
 * Delivers a notification event through all configured channels.
 *
 * @param {NotificationEvent} event - Notification event
 * @param {NotificationPreferences} preferences - User preferences
 * @returns {Promise<NotificationDelivery[]>} Delivery records
 *
 * @example
 * ```typescript
 * const deliveries = await deliverNotification(event, userPreferences);
 * console.log(`Delivered via ${deliveries.length} channels`);
 * ```
 */
export declare const deliverNotification: (event: NotificationEvent, preferences: NotificationPreferences) => Promise<NotificationDelivery[]>;
/**
 * Retries failed notification deliveries.
 *
 * @param {NotificationDelivery} delivery - Failed delivery record
 * @returns {Promise<NotificationDelivery>} Updated delivery record
 *
 * @example
 * ```typescript
 * const retried = await retryNotificationDelivery(failedDelivery);
 * console.log('Retry status:', retried.deliveryStatus);
 * ```
 */
export declare const retryNotificationDelivery: (delivery: NotificationDelivery) => Promise<NotificationDelivery>;
/**
 * Groups similar notifications together based on event type and time window.
 *
 * @param {NotificationEvent[]} events - Notification events
 * @param {number} intervalMinutes - Grouping interval in minutes
 * @returns {NotificationGroup[]} Grouped notifications
 *
 * @example
 * ```typescript
 * const groups = groupNotifications(notifications, 5);
 * console.log(`Grouped ${notifications.length} into ${groups.length} groups`);
 * ```
 */
export declare const groupNotifications: (events: NotificationEvent[], intervalMinutes: number) => NotificationGroup[];
/**
 * Filters notifications based on criteria.
 *
 * @param {NotificationFilter} filter - Filter criteria
 * @returns {Promise<NotificationEvent[]>} Filtered notifications
 *
 * @example
 * ```typescript
 * const filtered = await filterNotifications({
 *   userId: 'user-123',
 *   eventTypes: ['new_mail', 'meeting_request'],
 *   priority: 'high',
 *   readStatus: 'unread',
 *   limit: 50
 * });
 * ```
 */
export declare const filterNotifications: (filter: NotificationFilter) => Promise<NotificationEvent[]>;
/**
 * Records a read receipt for a message.
 *
 * @param {string} messageId - Message ID
 * @param {string} userId - User ID
 * @param {string} recipientAddress - Recipient email address
 * @param {object} metadata - Additional metadata (IP, user agent, etc.)
 * @returns {ReadReceipt} Created read receipt
 *
 * @example
 * ```typescript
 * const receipt = recordReadReceipt('msg-123', 'user-456', 'recipient@example.com', {
 *   ipAddress: '192.168.1.1',
 *   userAgent: 'Mozilla/5.0...',
 *   deviceType: 'desktop'
 * });
 * ```
 */
export declare const recordReadReceipt: (messageId: string, userId: string, recipientAddress: string, metadata?: any) => ReadReceipt;
/**
 * Records a delivery receipt for a message.
 *
 * @param {string} messageId - Message ID
 * @param {string} userId - User ID
 * @param {string} recipientAddress - Recipient email address
 * @param {string} deliveryStatus - Delivery status
 * @param {object} metadata - Additional metadata
 * @returns {DeliveryReceipt} Created delivery receipt
 *
 * @example
 * ```typescript
 * const receipt = recordDeliveryReceipt('msg-123', 'user-456', 'recipient@example.com', 'delivered', {
 *   remoteServer: 'mail.example.com',
 *   smtpStatus: '250',
 *   smtpMessage: 'OK'
 * });
 * ```
 */
export declare const recordDeliveryReceipt: (messageId: string, userId: string, recipientAddress: string, deliveryStatus: "sent" | "delivered" | "failed" | "bounced" | "deferred", metadata?: any) => DeliveryReceipt;
/**
 * Processes read receipts and sends notifications to message sender.
 *
 * @param {ReadReceipt} receipt - Read receipt
 * @returns {Promise<NotificationEvent>} Notification event
 *
 * @example
 * ```typescript
 * const notification = await processReadReceipt(readReceipt);
 * console.log('Sender notified:', notification.id);
 * ```
 */
export declare const processReadReceipt: (receipt: ReadReceipt) => Promise<NotificationEvent>;
/**
 * Processes delivery receipts and sends notifications to message sender.
 *
 * @param {DeliveryReceipt} receipt - Delivery receipt
 * @returns {Promise<NotificationEvent>} Notification event
 *
 * @example
 * ```typescript
 * const notification = await processDeliveryReceipt(deliveryReceipt);
 * console.log('Sender notified:', notification.id);
 * ```
 */
export declare const processDeliveryReceipt: (receipt: DeliveryReceipt) => Promise<NotificationEvent>;
/**
 * Creates an Exchange Server notification subscription for push notifications.
 *
 * @param {string} userId - User ID
 * @param {string[]} folderIds - Folder IDs to monitor
 * @param {string} callbackUrl - Webhook URL for notifications
 * @returns {object} Subscription details
 *
 * @example
 * ```typescript
 * const subscription = createExchangeNotificationSubscription(
 *   'user-123',
 *   ['inbox-folder-id', 'sent-folder-id'],
 *   'https://app.whitecross.com/webhooks/exchange-notifications'
 * );
 * ```
 */
export declare const createExchangeNotificationSubscription: (userId: string, folderIds: string[], callbackUrl: string) => any;
/**
 * Processes an Exchange Server notification event.
 *
 * @param {ExchangeNotification} exchangeNotif - Exchange notification
 * @returns {Promise<NotificationEvent>} Processed notification event
 *
 * @example
 * ```typescript
 * const event = await processExchangeNotification({
 *   subscriptionId: 'sub-123',
 *   userId: 'user-456',
 *   eventType: 'NewMail',
 *   itemId: 'msg-789',
 *   parentFolderId: 'inbox-folder',
 *   timestamp: new Date(),
 *   watermark: 'AQAAAA=='
 * });
 * ```
 */
export declare const processExchangeNotification: (exchangeNotif: ExchangeNotification) => Promise<NotificationEvent>;
/**
 * Renews an Exchange Server notification subscription.
 *
 * @param {string} subscriptionId - Subscription ID
 * @returns {object} Updated subscription
 *
 * @example
 * ```typescript
 * const renewed = renewExchangeNotificationSubscription('sub-123');
 * console.log('Subscription expires at:', renewed.expiresAt);
 * ```
 */
export declare const renewExchangeNotificationSubscription: (subscriptionId: string) => any;
/**
 * Calculates notification statistics for a user.
 *
 * @param {string} userId - User ID
 * @param {string} period - Time period
 * @returns {Promise<NotificationStats>} Notification statistics
 *
 * @example
 * ```typescript
 * const stats = await getNotificationStats('user-123', 'day');
 * console.log('Total sent:', stats.totalSent);
 * console.log('Read rate:', stats.readRate);
 * ```
 */
export declare const getNotificationStats: (userId: string, period: "hour" | "day" | "week" | "month") => Promise<NotificationStats>;
/**
 * Generates Swagger schema for NotificationEvent.
 *
 * @returns {SwaggerNotificationSchema} Swagger schema
 *
 * @example
 * ```typescript
 * const schema = getNotificationEventSwaggerSchema();
 * // Use in NestJS @ApiProperty decorators
 * ```
 */
export declare const getNotificationEventSwaggerSchema: () => SwaggerNotificationSchema;
/**
 * Generates Swagger schema for NotificationPreferences.
 *
 * @returns {SwaggerNotificationSchema} Swagger schema
 *
 * @example
 * ```typescript
 * const schema = getNotificationPreferencesSwaggerSchema();
 * ```
 */
export declare const getNotificationPreferencesSwaggerSchema: () => SwaggerNotificationSchema;
declare const _default: {
    getNotificationEventModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        userId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        eventType: {
            type: string;
            values: string[];
            allowNull: boolean;
        };
        entityType: {
            type: string;
            values: string[];
            allowNull: boolean;
        };
        entityId: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        title: {
            type: string;
            allowNull: boolean;
        };
        message: {
            type: string;
            allowNull: boolean;
        };
        priority: {
            type: string;
            values: string[];
            defaultValue: string;
        };
        category: {
            type: string;
            allowNull: boolean;
        };
        actionUrl: {
            type: string;
            allowNull: boolean;
        };
        actionData: {
            type: string;
            allowNull: boolean;
        };
        imageUrl: {
            type: string;
            allowNull: boolean;
        };
        iconUrl: {
            type: string;
            allowNull: boolean;
        };
        sound: {
            type: string;
            allowNull: boolean;
        };
        badge: {
            type: string;
            allowNull: boolean;
        };
        metadata: {
            type: string;
            allowNull: boolean;
            defaultValue: {};
        };
        expiresAt: {
            type: string;
            allowNull: boolean;
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
    };
    getNotificationDeliveryModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        notificationId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        userId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        deliveryChannel: {
            type: string;
            values: string[];
            allowNull: boolean;
        };
        deliveryStatus: {
            type: string;
            values: string[];
            defaultValue: string;
        };
        deliveryAttempts: {
            type: string;
            defaultValue: number;
        };
        lastAttemptAt: {
            type: string;
            allowNull: boolean;
        };
        deliveredAt: {
            type: string;
            allowNull: boolean;
        };
        readAt: {
            type: string;
            allowNull: boolean;
        };
        dismissedAt: {
            type: string;
            allowNull: boolean;
        };
        failureReason: {
            type: string;
            allowNull: boolean;
        };
        errorCode: {
            type: string;
            allowNull: boolean;
        };
        externalId: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        metadata: {
            type: string;
            allowNull: boolean;
            defaultValue: {};
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
        };
    };
    getNotificationPreferencesModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        userId: {
            type: string;
            allowNull: boolean;
            unique: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        enabled: {
            type: string;
            defaultValue: boolean;
        };
        channels: {
            type: string;
            allowNull: boolean;
            defaultValue: {
                email: {
                    enabled: boolean;
                    priority: number;
                    soundEnabled: boolean;
                    vibrationEnabled: boolean;
                };
                desktop_push: {
                    enabled: boolean;
                    priority: number;
                    soundEnabled: boolean;
                    vibrationEnabled: boolean;
                };
                mobile_push: {
                    enabled: boolean;
                    priority: number;
                    soundEnabled: boolean;
                    vibrationEnabled: boolean;
                };
                sms: {
                    enabled: boolean;
                    priority: number;
                    soundEnabled: boolean;
                    vibrationEnabled: boolean;
                };
                websocket: {
                    enabled: boolean;
                    priority: number;
                    soundEnabled: boolean;
                    vibrationEnabled: boolean;
                };
                in_app: {
                    enabled: boolean;
                    priority: number;
                    soundEnabled: boolean;
                    vibrationEnabled: boolean;
                };
            };
        };
        eventTypeSettings: {
            type: string;
            allowNull: boolean;
            defaultValue: {};
        };
        quietHours: {
            type: string;
            allowNull: boolean;
        };
        doNotDisturb: {
            type: string;
            defaultValue: boolean;
        };
        doNotDisturbUntil: {
            type: string;
            allowNull: boolean;
        };
        groupingEnabled: {
            type: string;
            defaultValue: boolean;
        };
        groupingInterval: {
            type: string;
            defaultValue: number;
            comment: string;
        };
        soundEnabled: {
            type: string;
            defaultValue: boolean;
        };
        vibrationEnabled: {
            type: string;
            defaultValue: boolean;
        };
        badgeCountEnabled: {
            type: string;
            defaultValue: boolean;
        };
        previewInLockScreen: {
            type: string;
            defaultValue: boolean;
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
        };
    };
    getDeviceRegistrationModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        userId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        deviceType: {
            type: string;
            values: string[];
            allowNull: boolean;
        };
        deviceToken: {
            type: string;
            allowNull: boolean;
            unique: boolean;
        };
        deviceName: {
            type: string;
            allowNull: boolean;
        };
        deviceModel: {
            type: string;
            allowNull: boolean;
        };
        osVersion: {
            type: string;
            allowNull: boolean;
        };
        appVersion: {
            type: string;
            allowNull: boolean;
        };
        isActive: {
            type: string;
            defaultValue: boolean;
        };
        lastActiveAt: {
            type: string;
            allowNull: boolean;
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
        };
    };
    getEmailNotificationTemplateModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        name: {
            type: string;
            allowNull: boolean;
        };
        eventType: {
            type: string;
            values: string[];
            allowNull: boolean;
        };
        subject: {
            type: string;
            allowNull: boolean;
        };
        bodyHtml: {
            type: string;
            allowNull: boolean;
        };
        bodyText: {
            type: string;
            allowNull: boolean;
        };
        variables: {
            type: string;
            allowNull: boolean;
            defaultValue: never[];
        };
        locale: {
            type: string;
            defaultValue: string;
        };
        isActive: {
            type: string;
            defaultValue: boolean;
        };
        createdBy: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
        };
    };
    getReadReceiptModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        messageId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        userId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        recipientAddress: {
            type: string;
            allowNull: boolean;
        };
        readAt: {
            type: string;
            allowNull: boolean;
        };
        ipAddress: {
            type: string;
            allowNull: boolean;
        };
        userAgent: {
            type: string;
            allowNull: boolean;
        };
        location: {
            type: string;
            allowNull: boolean;
        };
        deviceType: {
            type: string;
            values: string[];
            allowNull: boolean;
        };
        notificationSent: {
            type: string;
            defaultValue: boolean;
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
    };
    getDeliveryReceiptModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        messageId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        userId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        recipientAddress: {
            type: string;
            allowNull: boolean;
        };
        deliveryStatus: {
            type: string;
            values: string[];
            allowNull: boolean;
        };
        deliveredAt: {
            type: string;
            allowNull: boolean;
        };
        remoteServer: {
            type: string;
            allowNull: boolean;
        };
        smtpStatus: {
            type: string;
            allowNull: boolean;
        };
        smtpMessage: {
            type: string;
            allowNull: boolean;
        };
        attempts: {
            type: string;
            defaultValue: number;
        };
        lastAttemptAt: {
            type: string;
            allowNull: boolean;
        };
        notificationSent: {
            type: string;
            defaultValue: boolean;
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
        };
    };
    createNotificationEvent: (eventData: Partial<NotificationEvent>) => NotificationEvent;
    createNewMailNotification: (userId: string, mailMessage: any) => NotificationEvent;
    createMeetingRequestNotification: (userId: string, meetingRequest: any) => NotificationEvent;
    createCalendarReminderNotification: (userId: string, calendarEvent: any, minutesBefore: number) => NotificationEvent;
    createReadReceiptNotification: (userId: string, readReceipt: any) => NotificationEvent;
    createDeliveryReceiptNotification: (userId: string, deliveryReceipt: any) => NotificationEvent;
    getUserNotificationPreferences: (userId: string) => NotificationPreferences;
    updateNotificationPreferences: (userId: string, updates: Partial<NotificationPreferences>) => NotificationPreferences;
    setQuietHours: (userId: string, quietHours: QuietHoursSettings) => NotificationPreferences;
    setDoNotDisturb: (userId: string, enabled: boolean, until?: Date) => NotificationPreferences;
    shouldSuppressNotification: (preferences: NotificationPreferences, event: NotificationEvent) => boolean;
    getDeliveryChannels: (preferences: NotificationPreferences, event: NotificationEvent) => NotificationChannel[];
    sendEmailNotification: (event: NotificationEvent, userEmail: string) => Promise<NotificationDelivery>;
    getNotificationTemplate: (eventType: NotificationEventType, locale: string) => Promise<EmailNotificationTemplate>;
    renderNotificationTemplate: (template: EmailNotificationTemplate, event: NotificationEvent) => {
        subject: string;
        bodyHtml: string;
        bodyText: string;
    };
    sendDesktopPushNotification: (event: NotificationEvent, device: DeviceRegistration) => Promise<NotificationDelivery>;
    sendMobilePushNotification: (event: NotificationEvent, device: DeviceRegistration) => Promise<NotificationDelivery>;
    sendAPNSNotification: (event: NotificationEvent, device: DeviceRegistration) => Promise<NotificationDelivery>;
    sendFCMNotification: (event: NotificationEvent, device: DeviceRegistration) => Promise<NotificationDelivery>;
    registerDevice: (userId: string, deviceData: Partial<DeviceRegistration>) => DeviceRegistration;
    unregisterDevice: (deviceId: string) => boolean;
    sendSMSNotification: (event: NotificationEvent, phoneNumber: string) => Promise<SMSNotification>;
    formatSMSMessage: (event: NotificationEvent, maxLength?: number) => string;
    sendWebSocketNotification: (event: NotificationEvent, wsConnection: any) => Promise<WebSocketNotification>;
    broadcastWebSocketNotification: (event: NotificationEvent, wsConnections: any[]) => Promise<WebSocketNotification[]>;
    acknowledgeWebSocketNotification: (notificationId: string) => boolean;
    deliverNotification: (event: NotificationEvent, preferences: NotificationPreferences) => Promise<NotificationDelivery[]>;
    retryNotificationDelivery: (delivery: NotificationDelivery) => Promise<NotificationDelivery>;
    groupNotifications: (events: NotificationEvent[], intervalMinutes: number) => NotificationGroup[];
    filterNotifications: (filter: NotificationFilter) => Promise<NotificationEvent[]>;
    recordReadReceipt: (messageId: string, userId: string, recipientAddress: string, metadata?: any) => ReadReceipt;
    recordDeliveryReceipt: (messageId: string, userId: string, recipientAddress: string, deliveryStatus: "sent" | "delivered" | "failed" | "bounced" | "deferred", metadata?: any) => DeliveryReceipt;
    processReadReceipt: (receipt: ReadReceipt) => Promise<NotificationEvent>;
    processDeliveryReceipt: (receipt: DeliveryReceipt) => Promise<NotificationEvent>;
    createExchangeNotificationSubscription: (userId: string, folderIds: string[], callbackUrl: string) => any;
    processExchangeNotification: (exchangeNotif: ExchangeNotification) => Promise<NotificationEvent>;
    renewExchangeNotificationSubscription: (subscriptionId: string) => any;
    getNotificationStats: (userId: string, period: "hour" | "day" | "week" | "month") => Promise<NotificationStats>;
    getNotificationEventSwaggerSchema: () => SwaggerNotificationSchema;
    getNotificationPreferencesSwaggerSchema: () => SwaggerNotificationSchema;
};
export default _default;
//# sourceMappingURL=mail-notification-kit.d.ts.map