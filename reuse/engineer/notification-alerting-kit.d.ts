/**
 * LOC: NOTIFICATION_ALERTING_KIT_001
 * File: /reuse/engineer/notification-alerting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - crypto (Node.js built-in)
 *   - express
 *   - nodemailer (email)
 *   - twilio (SMS)
 *   - WebSocket (real-time)
 *
 * DOWNSTREAM (imported by):
 *   - Notification services
 *   - Alert management systems
 *   - Event handlers
 *   - Monitoring services
 *   - User preference controllers
 *   - Emergency broadcast systems
 */
/**
 * Notification channel types
 */
export declare enum NotificationChannel {
    EMAIL = "email",
    SMS = "sms",
    PUSH = "push",
    WEBHOOK = "webhook",
    IN_APP = "in_app",
    SLACK = "slack",
    TEAMS = "teams"
}
/**
 * Notification priority levels
 */
export declare enum NotificationPriority {
    LOW = "low",
    NORMAL = "normal",
    HIGH = "high",
    URGENT = "urgent",
    EMERGENCY = "emergency"
}
/**
 * Notification status
 */
export declare enum NotificationStatus {
    PENDING = "pending",
    QUEUED = "queued",
    SENDING = "sending",
    SENT = "sent",
    DELIVERED = "delivered",
    FAILED = "failed",
    BOUNCED = "bounced",
    READ = "read"
}
/**
 * Alert severity levels
 */
export declare enum AlertSeverity {
    INFO = "info",
    WARNING = "warning",
    ERROR = "error",
    CRITICAL = "critical"
}
/**
 * Notification record
 */
export interface Notification {
    id: string;
    userId: string;
    channel: NotificationChannel;
    priority: NotificationPriority;
    status: NotificationStatus;
    subject?: string;
    message: string;
    templateId?: string;
    templateData?: Record<string, any>;
    metadata?: Record<string, any>;
    scheduledFor?: number;
    sentAt?: number;
    deliveredAt?: number;
    readAt?: number;
    createdAt: number;
    retryCount: number;
    lastError?: string;
}
/**
 * Notification template
 */
export interface NotificationTemplate {
    id: string;
    name: string;
    channel: NotificationChannel;
    subject?: string;
    bodyTemplate: string;
    variables: string[];
    locale?: string;
    version: number;
    active: boolean;
    createdAt: number;
    updatedAt: number;
}
/**
 * User notification preferences
 */
export interface NotificationPreferences {
    userId: string;
    channels: {
        [key in NotificationChannel]?: {
            enabled: boolean;
            quietHours?: {
                start: string;
                end: string;
            };
            frequency?: 'realtime' | 'digest_hourly' | 'digest_daily';
        };
    };
    categoryPreferences?: Record<string, boolean>;
    doNotDisturb?: boolean;
    updatedAt: number;
}
/**
 * Alert threshold configuration
 */
export interface AlertThreshold {
    id: string;
    metricName: string;
    condition: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'neq';
    threshold: number;
    severity: AlertSeverity;
    windowSeconds: number;
    cooldownSeconds: number;
    enabled: boolean;
    recipients: string[];
}
/**
 * Alert record
 */
export interface Alert {
    id: string;
    thresholdId: string;
    metricName: string;
    currentValue: number;
    threshold: number;
    severity: AlertSeverity;
    message: string;
    triggeredAt: number;
    resolvedAt?: number;
    acknowledged?: boolean;
    acknowledgedBy?: string;
    acknowledgedAt?: number;
    escalated?: boolean;
    escalationLevel?: number;
}
/**
 * Escalation policy
 */
export interface EscalationPolicy {
    id: string;
    name: string;
    steps: Array<{
        level: number;
        delayMinutes: number;
        recipients: string[];
        channels: NotificationChannel[];
    }>;
    repeatInterval?: number;
    maxEscalations?: number;
}
/**
 * Batch notification job
 */
export interface NotificationBatch {
    id: string;
    notifications: Notification[];
    scheduledFor: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    processedCount: number;
    failedCount: number;
    createdAt: number;
    processedAt?: number;
}
/**
 * Notification delivery report
 */
export interface DeliveryReport {
    notificationId: string;
    channel: NotificationChannel;
    status: NotificationStatus;
    attemptCount: number;
    lastAttemptAt: number;
    deliveredAt?: number;
    failureReason?: string;
    providerResponse?: any;
}
/**
 * Emergency broadcast
 */
export interface EmergencyBroadcast {
    id: string;
    title: string;
    message: string;
    severity: AlertSeverity;
    channels: NotificationChannel[];
    targetAudience: 'all' | 'role' | 'location' | 'custom';
    targetFilter?: Record<string, any>;
    expiresAt?: number;
    createdBy: string;
    createdAt: number;
    sentCount: number;
    deliveredCount: number;
}
/**
 * 1. Create notification record
 * @param userId - User identifier
 * @param channel - Notification channel
 * @param message - Notification message
 * @param options - Additional options
 * @returns Notification object
 */
export declare const createNotification: (userId: string, channel: NotificationChannel, message: string, options?: {
    subject?: string;
    priority?: NotificationPriority;
    templateId?: string;
    templateData?: Record<string, any>;
    scheduledFor?: number;
    metadata?: Record<string, any>;
}) => Notification;
/**
 * 2. Send email notification
 * @param notification - Notification to send
 * @param emailConfig - Email configuration
 * @returns Delivery result
 */
export declare const sendEmailNotification: (notification: Notification, emailConfig: {
    from: string;
    to: string;
    smtp?: any;
}) => Promise<DeliveryReport>;
/**
 * 3. Send SMS notification
 * @param notification - Notification to send
 * @param phoneNumber - Recipient phone number
 * @returns Delivery result
 */
export declare const sendSmsNotification: (notification: Notification, phoneNumber: string) => Promise<DeliveryReport>;
/**
 * 4. Send push notification
 * @param notification - Notification to send
 * @param deviceTokens - Device push tokens
 * @returns Delivery result
 */
export declare const sendPushNotification: (notification: Notification, deviceTokens: string[]) => Promise<DeliveryReport>;
/**
 * 5. Send webhook notification
 * @param notification - Notification to send
 * @param webhookUrl - Webhook endpoint URL
 * @returns Delivery result
 */
export declare const sendWebhookNotification: (notification: Notification, webhookUrl: string) => Promise<DeliveryReport>;
/**
 * 6. Send multi-channel notification
 * @param notification - Base notification
 * @param channels - Channels to send through
 * @param recipients - Channel-specific recipients
 * @returns Delivery reports for each channel
 */
export declare const sendMultiChannelNotification: (notification: Notification, channels: NotificationChannel[], recipients: Record<NotificationChannel, any>) => Promise<DeliveryReport[]>;
/**
 * 7. Create notification template
 * @param name - Template name
 * @param channel - Target channel
 * @param bodyTemplate - Message template with placeholders
 * @param variables - Template variables
 * @returns Template object
 */
export declare const createNotificationTemplate: (name: string, channel: NotificationChannel, bodyTemplate: string, variables: string[]) => NotificationTemplate;
/**
 * 8. Render notification template with data
 * @param template - Notification template
 * @param data - Template data
 * @returns Rendered message
 */
export declare const renderNotificationTemplate: (template: NotificationTemplate, data: Record<string, any>) => {
    subject?: string;
    body: string;
};
/**
 * 9. Personalize notification content
 * @param message - Base message
 * @param userData - User data for personalization
 * @returns Personalized message
 */
export declare const personalizeNotification: (message: string, userData: Record<string, any>) => string;
/**
 * 10. Validate template variables
 * @param template - Notification template
 * @param data - Provided template data
 * @returns Validation result
 */
export declare const validateTemplateData: (template: NotificationTemplate, data: Record<string, any>) => {
    valid: boolean;
    missingVariables: string[];
};
/**
 * 11. Schedule notification for future delivery
 * @param notification - Notification to schedule
 * @param scheduledFor - Unix timestamp for delivery
 * @returns Scheduled notification
 */
export declare const scheduleNotification: (notification: Notification, scheduledFor: number) => Notification;
/**
 * 12. Create notification batch
 * @param notifications - Notifications to batch
 * @param scheduledFor - Batch delivery time
 * @returns Batch object
 */
export declare const createNotificationBatch: (notifications: Notification[], scheduledFor: number) => NotificationBatch;
/**
 * 13. Process notification batch
 * @param batch - Batch to process
 * @returns Processing result
 */
export declare const processNotificationBatch: (batch: NotificationBatch) => Promise<{
    processed: number;
    failed: number;
    reports: DeliveryReport[];
}>;
/**
 * 14. Implement notification digest (daily/weekly summary)
 * @param userId - User identifier
 * @param notifications - Notifications to include
 * @param period - Digest period
 * @returns Digest notification
 */
export declare const createNotificationDigest: (userId: string, notifications: Notification[], period: "daily" | "weekly") => Notification;
/**
 * 15. Cancel scheduled notification
 * @param notificationId - Notification identifier
 * @returns Cancellation result
 */
export declare const cancelScheduledNotification: (notificationId: string) => {
    cancelled: boolean;
    notificationId: string;
};
/**
 * 16. Create user notification preferences
 * @param userId - User identifier
 * @param channels - Channel preferences
 * @returns Preference object
 */
export declare const createNotificationPreferences: (userId: string, channels?: NotificationPreferences["channels"]) => NotificationPreferences;
/**
 * 17. Update user notification preferences
 * @param preferences - Current preferences
 * @param updates - Preference updates
 * @returns Updated preferences
 */
export declare const updateNotificationPreferences: (preferences: NotificationPreferences, updates: Partial<NotificationPreferences>) => NotificationPreferences;
/**
 * 18. Check if user accepts notifications on channel
 * @param preferences - User preferences
 * @param channel - Notification channel
 * @returns Whether channel is enabled
 */
export declare const isChannelEnabled: (preferences: NotificationPreferences, channel: NotificationChannel) => boolean;
/**
 * 19. Check if notification should be sent based on quiet hours
 * @param preferences - User preferences
 * @param channel - Notification channel
 * @returns Whether notification should be sent now
 */
export declare const isWithinQuietHours: (preferences: NotificationPreferences, channel: NotificationChannel) => boolean;
/**
 * 20. Filter notifications based on user preferences
 * @param notifications - Notifications to filter
 * @param preferences - User preferences
 * @returns Filtered notifications
 */
export declare const filterNotificationsByPreferences: (notifications: Notification[], preferences: NotificationPreferences) => Notification[];
/**
 * 21. Create alert threshold
 * @param metricName - Metric to monitor
 * @param condition - Threshold condition
 * @param threshold - Threshold value
 * @param severity - Alert severity
 * @returns Alert threshold object
 */
export declare const createAlertThreshold: (metricName: string, condition: "gt" | "gte" | "lt" | "lte" | "eq" | "neq", threshold: number, severity: AlertSeverity) => AlertThreshold;
/**
 * 22. Evaluate metric against threshold
 * @param value - Current metric value
 * @param threshold - Alert threshold
 * @returns Whether alert should trigger
 */
export declare const evaluateAlertThreshold: (value: number, threshold: AlertThreshold) => boolean;
/**
 * 23. Trigger alert from threshold violation
 * @param threshold - Violated threshold
 * @param currentValue - Current metric value
 * @returns Alert object
 */
export declare const triggerAlert: (threshold: AlertThreshold, currentValue: number) => Alert;
/**
 * 24. Acknowledge alert
 * @param alert - Alert to acknowledge
 * @param userId - User acknowledging
 * @returns Updated alert
 */
export declare const acknowledgeAlert: (alert: Alert, userId: string) => Alert;
/**
 * 25. Resolve alert
 * @param alert - Alert to resolve
 * @returns Updated alert
 */
export declare const resolveAlert: (alert: Alert) => Alert;
/**
 * 26. Check if alert is in cooldown period
 * @param alert - Previous alert
 * @param threshold - Alert threshold
 * @returns Whether in cooldown
 */
export declare const isAlertInCooldown: (alert: Alert, threshold: AlertThreshold) => boolean;
/**
 * 27. Create escalation policy
 * @param name - Policy name
 * @param steps - Escalation steps
 * @returns Escalation policy
 */
export declare const createEscalationPolicy: (name: string, steps: EscalationPolicy["steps"]) => EscalationPolicy;
/**
 * 28. Escalate alert to next level
 * @param alert - Alert to escalate
 * @param policy - Escalation policy
 * @returns Updated alert and notifications
 */
export declare const escalateAlert: (alert: Alert, policy: EscalationPolicy) => {
    alert: Alert;
    notifications: Notification[];
};
/**
 * 29. Check if alert should escalate
 * @param alert - Alert to check
 * @param policy - Escalation policy
 * @returns Whether escalation is needed
 */
export declare const shouldEscalateAlert: (alert: Alert, policy: EscalationPolicy) => boolean;
/**
 * 30. Record notification in history
 * @param notification - Notification to record
 * @returns History record
 */
export declare const recordNotificationHistory: (notification: Notification) => {
    id: string;
    notification: Notification;
    recordedAt: number;
};
/**
 * 31. Get notification history for user
 * @param userId - User identifier
 * @param filters - Optional filters
 * @returns User's notification history
 */
export declare const getNotificationHistory: (userId: string, filters?: {
    channel?: NotificationChannel;
    status?: NotificationStatus;
    startDate?: number;
    endDate?: number;
}) => Notification[];
/**
 * 32. Mark notification as read
 * @param notificationId - Notification identifier
 * @returns Updated notification
 */
export declare const markNotificationAsRead: (notification: Notification) => Notification;
/**
 * 33. Get unread notification count
 * @param userId - User identifier
 * @returns Unread count
 */
export declare const getUnreadNotificationCount: (userId: string) => number;
/**
 * 34. Archive old notifications
 * @param beforeDate - Archive notifications before this date
 * @returns Archive result
 */
export declare const archiveNotifications: (beforeDate: number) => Promise<{
    archived: number;
}>;
/**
 * 35. Track notification delivery status
 * @param notificationId - Notification identifier
 * @param status - Delivery status
 * @returns Updated delivery report
 */
export declare const trackDeliveryStatus: (notificationId: string, status: NotificationStatus) => DeliveryReport;
/**
 * 36. Retry failed notification
 * @param notification - Failed notification
 * @param maxRetries - Maximum retry attempts
 * @returns Retry result
 */
export declare const retryFailedNotification: (notification: Notification, maxRetries?: number) => Promise<{
    success: boolean;
    attempts: number;
}>;
/**
 * 37. Calculate notification delivery metrics
 * @param reports - Delivery reports
 * @returns Delivery metrics
 */
export declare const calculateDeliveryMetrics: (reports: DeliveryReport[]) => {
    totalSent: number;
    totalDelivered: number;
    totalFailed: number;
    deliveryRate: number;
    averageDeliveryTime: number;
};
/**
 * 38. Create emergency broadcast
 * @param title - Broadcast title
 * @param message - Broadcast message
 * @param severity - Severity level
 * @param channels - Channels to broadcast on
 * @param createdBy - User creating broadcast
 * @returns Emergency broadcast object
 */
export declare const createEmergencyBroadcast: (title: string, message: string, severity: AlertSeverity, channels: NotificationChannel[], createdBy: string) => EmergencyBroadcast;
/**
 * 39. Send emergency broadcast to all users
 * @param broadcast - Emergency broadcast
 * @param userIds - Target user IDs
 * @returns Broadcast result
 */
export declare const sendEmergencyBroadcast: (broadcast: EmergencyBroadcast, userIds: string[]) => Promise<{
    sent: number;
    failed: number;
}>;
/**
 * 40. Filter broadcast recipients by criteria
 * @param broadcast - Emergency broadcast
 * @param allUsers - All available users
 * @returns Filtered recipient list
 */
export declare const filterBroadcastRecipients: (broadcast: EmergencyBroadcast, allUsers: Array<{
    id: string;
    role?: string;
    location?: string;
    [key: string]: any;
}>) => string[];
/**
 * REST API endpoint: POST /api/notifications
 * Creates and sends a notification
 */
export declare const apiCreateNotification: {
    method: string;
    path: string;
    description: string;
    requestBody: {
        userId: string;
        channel: string;
        message: string;
        subject: string;
        priority: string;
        scheduledFor: string;
        send: string;
    };
    responses: {
        201: string;
        400: string;
        404: string;
        500: string;
    };
};
/**
 * REST API endpoint: GET /api/notifications/:userId
 * Retrieves user's notification history
 */
export declare const apiGetNotifications: {
    method: string;
    path: string;
    description: string;
    queryParams: {
        channel: string;
        status: string;
        startDate: string;
        endDate: string;
        page: string;
        limit: string;
    };
    responses: {
        200: string;
        400: string;
        404: string;
        500: string;
    };
};
/**
 * REST API endpoint: PUT /api/notifications/:id/read
 * Marks a notification as read
 */
export declare const apiMarkNotificationRead: {
    method: string;
    path: string;
    description: string;
    responses: {
        200: string;
        404: string;
        500: string;
    };
};
/**
 * REST API endpoint: POST /api/alerts
 * Creates an alert threshold
 */
export declare const apiCreateAlert: {
    method: string;
    path: string;
    description: string;
    requestBody: {
        metricName: string;
        condition: string;
        threshold: string;
        severity: string;
        recipients: string;
    };
    responses: {
        201: string;
        400: string;
        500: string;
    };
};
/**
 * REST API endpoint: POST /api/broadcasts
 * Creates and sends an emergency broadcast
 */
export declare const apiCreateBroadcast: {
    method: string;
    path: string;
    description: string;
    requestBody: {
        title: string;
        message: string;
        severity: string;
        channels: string;
        targetAudience: string;
        targetFilter: string;
    };
    responses: {
        201: string;
        400: string;
        403: string;
        500: string;
    };
};
//# sourceMappingURL=notification-alerting-kit.d.ts.map