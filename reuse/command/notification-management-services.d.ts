/**
 * Notification Management Services
 *
 * Production-ready NestJS service providers for comprehensive multi-channel notification
 * management in healthcare emergency response systems. Handles SMS, email, push notifications,
 * voice calls, delivery tracking, retry logic, priority routing, templates, and compliance.
 *
 * Features:
 * - Multi-channel delivery (SMS, Email, Push, Voice, In-App)
 * - Dynamic template management with personalization
 * - Real-time delivery tracking and confirmation
 * - Intelligent retry logic with exponential backoff
 * - Priority-based routing and queuing
 * - Group notification management and broadcasting
 * - User preferences and opt-out management
 * - Delivery time optimization (quiet hours, timezone awareness)
 * - Batch processing and queue management
 * - A/B testing for message effectiveness
 * - Comprehensive analytics and reporting
 * - Compliance enforcement (HIPAA, TCPA, quiet hours, rate limiting)
 * - Emergency broadcast systems with override capabilities
 * - Two-way communication handling and response tracking
 * - Integration with Twilio, SendGrid, Firebase Cloud Messaging
 *
 * @module NotificationManagementServices
 * @category Communication Systems
 * @version 1.0.0
 */
import { Queue } from 'bull';
/**
 * Multi-Channel Notification Orchestration Service
 *
 * Coordinates notification delivery across multiple channels (SMS, Email, Push, Voice)
 * with intelligent channel selection and fallback strategies.
 */
export declare class MultiChannelNotificationService {
    private readonly notificationModel;
    private readonly channelModel;
    private readonly notificationQueue;
    private readonly smsService;
    private readonly emailService;
    private readonly pushService;
    private readonly voiceService;
    private readonly auditService;
    private readonly logger;
    constructor(notificationModel: any, channelModel: any, notificationQueue: Queue, smsService: SmsNotificationService, emailService: EmailNotificationService, pushService: PushNotificationService, voiceService: VoiceNotificationService, auditService: any);
    /**
     * Send notification through optimal channel based on priority and user preferences
     */
    sendMultiChannelNotification(notificationData: {
        recipientId: string;
        subject: string;
        message: string;
        priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'EMERGENCY';
        channels?: ('SMS' | 'EMAIL' | 'PUSH' | 'VOICE')[];
        metadata?: Record<string, any>;
        templateId?: string;
        scheduledFor?: Date;
    }): Promise<any>;
    /**
     * Determine optimal notification channels based on priority and user preferences
     */
    determineOptimalChannels(recipientId: string, priority: string): Promise<string[]>;
    /**
     * Send notification with automatic channel fallback
     */
    sendWithFallback(notificationData: {
        recipientId: string;
        message: string;
        primaryChannel: string;
        fallbackChannels: string[];
        maxRetries?: number;
    }): Promise<any>;
    /**
     * Send notification to specific channel
     */
    private sendToChannel;
    /**
     * Batch send notifications to multiple recipients
     */
    batchSendNotifications(batchData: {
        recipientIds: string[];
        message: string;
        subject: string;
        priority: string;
        channel: string;
        batchSize?: number;
    }): Promise<any>;
    /**
     * Get queue priority based on notification priority
     */
    private getQueuePriority;
    /**
     * Get retry attempts based on priority
     */
    private getRetryAttempts;
}
/**
 * SMS Notification Service
 *
 * Handles SMS delivery through Twilio with delivery tracking and compliance.
 */
export declare class SmsNotificationService {
    private readonly smsModel;
    private readonly userModel;
    private readonly twilioClient;
    private readonly complianceService;
    private readonly auditService;
    private readonly logger;
    constructor(smsModel: any, userModel: any, twilioClient: any, complianceService: NotificationComplianceService, auditService: any);
    /**
     * Send SMS notification
     */
    sendSms(smsData: {
        recipientId: string;
        message: string;
        priority?: string;
        metadata?: Record<string, any>;
    }): Promise<any>;
    /**
     * Send SMS with delivery confirmation
     */
    sendSmsWithConfirmation(smsData: {
        recipientId: string;
        message: string;
        requireConfirmation: boolean;
        confirmationTimeout?: number;
    }): Promise<any>;
    /**
     * Handle SMS delivery status webhook from Twilio
     */
    handleDeliveryStatus(statusData: {
        MessageSid: string;
        MessageStatus: string;
        ErrorCode?: string;
        ErrorMessage?: string;
    }): Promise<any>;
    /**
     * Handle incoming SMS responses (two-way communication)
     */
    handleIncomingSms(incomingData: {
        From: string;
        To: string;
        Body: string;
        MessageSid: string;
    }): Promise<any>;
    /**
     * Process incoming SMS response for confirmations and commands
     */
    private processIncomingSmsResponse;
    /**
     * Record SMS confirmation response
     */
    private recordConfirmation;
}
/**
 * Email Notification Service
 *
 * Handles email delivery through SendGrid with template support and tracking.
 */
export declare class EmailNotificationService {
    private readonly emailModel;
    private readonly userModel;
    private readonly sendGridClient;
    private readonly templateService;
    private readonly complianceService;
    private readonly auditService;
    private readonly logger;
    constructor(emailModel: any, userModel: any, sendGridClient: any, templateService: NotificationTemplateService, complianceService: NotificationComplianceService, auditService: any);
    /**
     * Send email notification
     */
    sendEmail(emailData: {
        recipientId: string;
        subject?: string;
        message?: string;
        templateId?: string;
        templateData?: Record<string, any>;
        attachments?: any[];
        priority?: string;
    }): Promise<any>;
    /**
     * Send templated email with personalization
     */
    sendTemplatedEmail(emailData: {
        recipientIds: string[];
        templateId: string;
        personalizedData: Record<string, Record<string, any>>;
        scheduledFor?: Date;
    }): Promise<any>;
    /**
     * Handle email event webhooks from SendGrid (opens, clicks, bounces)
     */
    handleEmailEvent(events: any[]): Promise<any>;
}
/**
 * Push Notification Service
 *
 * Handles mobile and web push notifications via Firebase Cloud Messaging.
 */
export declare class PushNotificationService {
    private readonly pushModel;
    private readonly deviceTokenModel;
    private readonly firebaseAdmin;
    private readonly complianceService;
    private readonly auditService;
    private readonly logger;
    constructor(pushModel: any, deviceTokenModel: any, firebaseAdmin: any, complianceService: NotificationComplianceService, auditService: any);
    /**
     * Send push notification to user's devices
     */
    sendPush(pushData: {
        recipientId: string;
        title?: string;
        message: string;
        data?: Record<string, any>;
        priority?: string;
        badge?: number;
        sound?: string;
        imageUrl?: string;
    }): Promise<any>;
    /**
     * Send topic-based push notification to subscribed users
     */
    sendTopicPush(topicData: {
        topic: string;
        title: string;
        message: string;
        data?: Record<string, any>;
    }): Promise<any>;
    /**
     * Register device token for push notifications
     */
    registerDeviceToken(tokenData: {
        userId: string;
        fcmToken: string;
        deviceType: 'IOS' | 'ANDROID' | 'WEB';
        deviceId: string;
    }): Promise<any>;
    /**
     * Handle failed FCM tokens (unregister invalid tokens)
     */
    private handleFailedTokens;
}
/**
 * Voice Notification Service
 *
 * Handles automated voice call notifications via Twilio with text-to-speech.
 */
export declare class VoiceNotificationService {
    private readonly voiceModel;
    private readonly userModel;
    private readonly twilioClient;
    private readonly complianceService;
    private readonly auditService;
    private readonly logger;
    constructor(voiceModel: any, userModel: any, twilioClient: any, complianceService: NotificationComplianceService, auditService: any);
    /**
     * Initiate automated voice call notification
     */
    initiateVoiceCall(voiceData: {
        recipientId: string;
        message: string;
        priority?: string;
        voice?: 'man' | 'woman';
        language?: string;
        requireConfirmation?: boolean;
    }): Promise<any>;
    /**
     * Generate TwiML for voice notification
     */
    private generateTwiml;
    /**
     * Handle voice call status webhook from Twilio
     */
    handleCallStatus(statusData: {
        CallSid: string;
        CallStatus: string;
        CallDuration?: string;
        RecordingUrl?: string;
    }): Promise<any>;
    /**
     * Handle voice call confirmation response (DTMF input)
     */
    handleCallConfirmation(confirmationData: {
        CallSid: string;
        Digits: string;
    }): Promise<any>;
}
/**
 * Notification Template Service
 *
 * Manages notification templates with variable substitution and versioning.
 */
export declare class NotificationTemplateService {
    private readonly templateModel;
    private readonly versionModel;
    private readonly logger;
    constructor(templateModel: any, versionModel: any);
    /**
     * Create notification template
     */
    createTemplate(templateData: {
        name: string;
        description?: string;
        channel: string;
        subject?: string;
        bodyTemplate: string;
        variables: string[];
        metadata?: Record<string, any>;
    }): Promise<any>;
    /**
     * Render template with variable substitution
     */
    renderTemplate(templateId: string, variables: Record<string, any>): Promise<any>;
    /**
     * Update template and create new version
     */
    updateTemplate(templateId: string, updates: {
        subject?: string;
        bodyTemplate?: string;
        variables?: string[];
    }): Promise<any>;
    /**
     * Get template by name and channel
     */
    getTemplateByName(name: string, channel: string): Promise<any>;
}
/**
 * Group Notification Service
 *
 * Manages notifications to user groups and broadcast lists.
 */
export declare class GroupNotificationService {
    private readonly groupModel;
    private readonly membershipModel;
    private readonly multiChannelService;
    private readonly auditService;
    private readonly logger;
    constructor(groupModel: any, membershipModel: any, multiChannelService: MultiChannelNotificationService, auditService: any);
    /**
     * Create notification group
     */
    createNotificationGroup(groupData: {
        name: string;
        description?: string;
        type: 'STATIC' | 'DYNAMIC';
        memberIds?: string[];
        dynamicCriteria?: Record<string, any>;
    }): Promise<any>;
    /**
     * Add members to notification group
     */
    addGroupMembers(groupId: string, memberIds: string[]): Promise<any>;
    /**
     * Send notification to group
     */
    sendGroupNotification(notificationData: {
        groupId: string;
        subject: string;
        message: string;
        priority: string;
        channels: string[];
        templateId?: string;
    }): Promise<any>;
    /**
     * Get group member IDs (with dynamic criteria evaluation)
     */
    getGroupMemberIds(groupId: string): Promise<string[]>;
    /**
     * Remove members from notification group
     */
    removeGroupMembers(groupId: string, memberIds: string[]): Promise<any>;
}
/**
 * Emergency Broadcast Service
 *
 * Handles emergency mass notifications with override capabilities.
 */
export declare class EmergencyBroadcastService {
    private readonly broadcastModel;
    private readonly multiChannelService;
    private readonly groupService;
    private readonly auditService;
    private readonly logger;
    constructor(broadcastModel: any, multiChannelService: MultiChannelNotificationService, groupService: GroupNotificationService, auditService: any);
    /**
     * Initiate emergency broadcast (bypasses quiet hours and opt-outs)
     */
    initiateEmergencyBroadcast(broadcastData: {
        title: string;
        message: string;
        severity: 'WARNING' | 'ALERT' | 'CRITICAL';
        targetGroups?: string[];
        targetUserIds?: string[];
        channels?: string[];
        expiresAt?: Date;
    }): Promise<any>;
    /**
     * Cancel active emergency broadcast
     */
    cancelEmergencyBroadcast(broadcastId: string): Promise<any>;
    /**
     * Get active emergency broadcasts
     */
    getActiveEmergencyBroadcasts(): Promise<any[]>;
}
/**
 * Notification Compliance Service
 *
 * Enforces notification compliance rules (quiet hours, opt-outs, rate limits, TCPA).
 */
export declare class NotificationComplianceService {
    private readonly preferencesModel;
    private readonly optOutModel;
    private readonly rateLimitModel;
    private readonly logger;
    constructor(preferencesModel: any, optOutModel: any, rateLimitModel: any);
    /**
     * Check if SMS notification is compliant
     */
    checkSmsCompliance(userId: string, priority?: string): Promise<{
        allowed: boolean;
        reason?: string;
    }>;
    /**
     * Check if email notification is compliant
     */
    checkEmailCompliance(userId: string): Promise<{
        allowed: boolean;
        reason?: string;
    }>;
    /**
     * Check if push notification is compliant
     */
    checkPushCompliance(userId: string): Promise<{
        allowed: boolean;
        reason?: string;
    }>;
    /**
     * Check if voice call is compliant
     */
    checkVoiceCompliance(userId: string, priority?: string): Promise<{
        allowed: boolean;
        reason?: string;
    }>;
    /**
     * Check if current time is within allowed notification hours
     */
    private isWithinAllowedHours;
    /**
     * Check rate limit for user and channel
     */
    checkRateLimit(userId: string, channel: string): Promise<{
        allowed: boolean;
        reason?: string;
    }>;
    /**
     * Opt user out of channel
     */
    optOutUser(userId: string, channel: string): Promise<any>;
    /**
     * Opt user in to channel
     */
    optInUser(userId: string, channel: string): Promise<any>;
}
/**
 * Notification Analytics Service
 *
 * Tracks notification metrics, delivery rates, engagement, and performance.
 */
export declare class NotificationAnalyticsService {
    private readonly notificationModel;
    private readonly eventModel;
    private readonly logger;
    constructor(notificationModel: any, eventModel: any);
    /**
     * Get notification delivery metrics
     */
    getDeliveryMetrics(filters: {
        startDate: Date;
        endDate: Date;
        channel?: string;
        priority?: string;
    }): Promise<any>;
    /**
     * Get notification engagement metrics
     */
    getEngagementMetrics(filters: {
        startDate: Date;
        endDate: Date;
        channel?: string;
    }): Promise<any>;
    /**
     * Get channel performance comparison
     */
    getChannelPerformance(filters: {
        startDate: Date;
        endDate: Date;
    }): Promise<any>;
    /**
     * Track notification event (for custom analytics)
     */
    trackNotificationEvent(eventData: {
        notificationId: string;
        eventType: string;
        eventData?: Record<string, any>;
    }): Promise<any>;
}
/**
 * Notification A/B Testing Service
 *
 * Manages A/B tests for notification content, timing, and channels.
 */
export declare class NotificationABTestingService {
    private readonly testModel;
    private readonly variantModel;
    private readonly assignmentModel;
    private readonly analyticsService;
    private readonly logger;
    constructor(testModel: any, variantModel: any, assignmentModel: any, analyticsService: NotificationAnalyticsService);
    /**
     * Create A/B test for notifications
     */
    createABTest(testData: {
        name: string;
        description?: string;
        channel: string;
        variants: Array<{
            name: string;
            subject?: string;
            message: string;
            weight: number;
        }>;
        startDate: Date;
        endDate: Date;
    }): Promise<any>;
    /**
     * Assign user to A/B test variant
     */
    assignUserToVariant(testId: string, userId: string): Promise<any>;
    /**
     * Get variant for user (or assign if not assigned)
     */
    getVariantForUser(testId: string, userId: string): Promise<any>;
    /**
     * Get A/B test results
     */
    getTestResults(testId: string): Promise<any>;
}
/**
 * Notification Scheduling Service
 *
 * Handles scheduled and time-optimized notification delivery.
 */
export declare class NotificationSchedulingService {
    private readonly scheduledModel;
    private readonly preferencesModel;
    private readonly notificationQueue;
    private readonly multiChannelService;
    private readonly logger;
    constructor(scheduledModel: any, preferencesModel: any, notificationQueue: Queue, multiChannelService: MultiChannelNotificationService);
    /**
     * Schedule notification for future delivery
     */
    scheduleNotification(notificationData: {
        recipientId: string;
        subject: string;
        message: string;
        channel: string;
        scheduledFor: Date;
        timezone?: string;
    }): Promise<any>;
    /**
     * Calculate optimal send time based on user engagement patterns
     */
    calculateOptimalSendTime(userId: string): Promise<Date>;
    /**
     * Send notification at optimal time for user
     */
    sendAtOptimalTime(notificationData: {
        recipientId: string;
        subject: string;
        message: string;
        channel: string;
    }): Promise<any>;
    /**
     * Cancel scheduled notification
     */
    cancelScheduledNotification(scheduledId: string): Promise<any>;
}
/**
 * Notification Retry Service
 *
 * Handles intelligent retry logic for failed notifications.
 */
export declare class NotificationRetryService {
    private readonly retryModel;
    private readonly multiChannelService;
    private readonly logger;
    constructor(retryModel: any, multiChannelService: MultiChannelNotificationService);
    /**
     * Retry failed notification with exponential backoff
     */
    retryFailedNotification(notificationId: string, attempt: number): Promise<any>;
    /**
     * Get retry history for notification
     */
    getRetryHistory(notificationId: string): Promise<any[]>;
}
/**
 * Notification Preferences Service
 *
 * Manages user notification preferences and settings.
 */
export declare class NotificationPreferencesService {
    private readonly preferencesModel;
    private readonly logger;
    constructor(preferencesModel: any);
    /**
     * Get user notification preferences
     */
    getUserPreferences(userId: string): Promise<any>;
    /**
     * Update user notification preferences
     */
    updateUserPreferences(userId: string, updates: {
        enableSms?: boolean;
        enableEmail?: boolean;
        enablePush?: boolean;
        enableVoice?: boolean;
        quietHoursEnabled?: boolean;
        quietHoursStart?: {
            hours: number;
            minutes: number;
        };
        quietHoursEnd?: {
            hours: number;
            minutes: number;
        };
        timezone?: string;
    }): Promise<any>;
    /**
     * Set quiet hours for user
     */
    setQuietHours(userId: string, quietHours: {
        enabled: boolean;
        startHour: number;
        startMinute: number;
        endHour: number;
        endMinute: number;
    }): Promise<any>;
}
/**
 * Send multi-channel notification
 */
export declare function sendMultiChannelNotification(service: MultiChannelNotificationService, data: any): Promise<any>;
/**
 * Send notification with automatic fallback
 */
export declare function sendNotificationWithFallback(service: MultiChannelNotificationService, data: any): Promise<any>;
/**
 * Batch send notifications
 */
export declare function batchSendNotifications(service: MultiChannelNotificationService, data: any): Promise<any>;
/**
 * Send SMS notification
 */
export declare function sendSmsNotification(service: SmsNotificationService, data: any): Promise<any>;
/**
 * Send SMS with delivery confirmation
 */
export declare function sendSmsWithConfirmation(service: SmsNotificationService, data: any): Promise<any>;
/**
 * Handle SMS delivery status
 */
export declare function handleSmsDeliveryStatus(service: SmsNotificationService, data: any): Promise<any>;
/**
 * Handle incoming SMS
 */
export declare function handleIncomingSms(service: SmsNotificationService, data: any): Promise<any>;
/**
 * Send email notification
 */
export declare function sendEmailNotification(service: EmailNotificationService, data: any): Promise<any>;
/**
 * Send templated email
 */
export declare function sendTemplatedEmail(service: EmailNotificationService, data: any): Promise<any>;
/**
 * Handle email events
 */
export declare function handleEmailEvents(service: EmailNotificationService, events: any[]): Promise<any>;
/**
 * Send push notification
 */
export declare function sendPushNotification(service: PushNotificationService, data: any): Promise<any>;
/**
 * Send topic-based push notification
 */
export declare function sendTopicPushNotification(service: PushNotificationService, data: any): Promise<any>;
/**
 * Register device token
 */
export declare function registerDeviceToken(service: PushNotificationService, data: any): Promise<any>;
/**
 * Initiate voice call notification
 */
export declare function initiateVoiceCall(service: VoiceNotificationService, data: any): Promise<any>;
/**
 * Handle voice call status
 */
export declare function handleVoiceCallStatus(service: VoiceNotificationService, data: any): Promise<any>;
/**
 * Handle voice call confirmation
 */
export declare function handleVoiceCallConfirmation(service: VoiceNotificationService, data: any): Promise<any>;
/**
 * Create notification template
 */
export declare function createNotificationTemplate(service: NotificationTemplateService, data: any): Promise<any>;
/**
 * Render notification template
 */
export declare function renderNotificationTemplate(service: NotificationTemplateService, templateId: string, variables: Record<string, any>): Promise<any>;
/**
 * Update notification template
 */
export declare function updateNotificationTemplate(service: NotificationTemplateService, templateId: string, updates: any): Promise<any>;
/**
 * Get template by name
 */
export declare function getTemplateByName(service: NotificationTemplateService, name: string, channel: string): Promise<any>;
/**
 * Create notification group
 */
export declare function createNotificationGroup(service: GroupNotificationService, data: any): Promise<any>;
/**
 * Add group members
 */
export declare function addNotificationGroupMembers(service: GroupNotificationService, groupId: string, memberIds: string[]): Promise<any>;
/**
 * Send group notification
 */
export declare function sendGroupNotification(service: GroupNotificationService, data: any): Promise<any>;
/**
 * Remove group members
 */
export declare function removeNotificationGroupMembers(service: GroupNotificationService, groupId: string, memberIds: string[]): Promise<any>;
/**
 * Initiate emergency broadcast
 */
export declare function initiateEmergencyBroadcast(service: EmergencyBroadcastService, data: any): Promise<any>;
/**
 * Cancel emergency broadcast
 */
export declare function cancelEmergencyBroadcast(service: EmergencyBroadcastService, broadcastId: string): Promise<any>;
/**
 * Get active emergency broadcasts
 */
export declare function getActiveEmergencyBroadcasts(service: EmergencyBroadcastService): Promise<any[]>;
/**
 * Check SMS compliance
 */
export declare function checkSmsCompliance(service: NotificationComplianceService, userId: string, priority?: string): Promise<any>;
/**
 * Opt user out of channel
 */
export declare function optOutUserFromChannel(service: NotificationComplianceService, userId: string, channel: string): Promise<any>;
/**
 * Opt user in to channel
 */
export declare function optInUserToChannel(service: NotificationComplianceService, userId: string, channel: string): Promise<any>;
/**
 * Get delivery metrics
 */
export declare function getNotificationDeliveryMetrics(service: NotificationAnalyticsService, filters: any): Promise<any>;
/**
 * Get engagement metrics
 */
export declare function getNotificationEngagementMetrics(service: NotificationAnalyticsService, filters: any): Promise<any>;
/**
 * Get channel performance
 */
export declare function getChannelPerformance(service: NotificationAnalyticsService, filters: any): Promise<any>;
/**
 * Track notification event
 */
export declare function trackNotificationEvent(service: NotificationAnalyticsService, data: any): Promise<any>;
/**
 * Create A/B test
 */
export declare function createNotificationABTest(service: NotificationABTestingService, data: any): Promise<any>;
/**
 * Get variant for user
 */
export declare function getABTestVariantForUser(service: NotificationABTestingService, testId: string, userId: string): Promise<any>;
/**
 * Get A/B test results
 */
export declare function getABTestResults(service: NotificationABTestingService, testId: string): Promise<any>;
/**
 * Schedule notification
 */
export declare function scheduleNotification(service: NotificationSchedulingService, data: any): Promise<any>;
/**
 * Send at optimal time
 */
export declare function sendNotificationAtOptimalTime(service: NotificationSchedulingService, data: any): Promise<any>;
/**
 * Calculate optimal send time
 */
export declare function calculateOptimalSendTime(service: NotificationSchedulingService, userId: string): Promise<Date>;
/**
 * Cancel scheduled notification
 */
export declare function cancelScheduledNotification(service: NotificationSchedulingService, scheduledId: string): Promise<any>;
/**
 * Retry failed notification
 */
export declare function retryFailedNotification(service: NotificationRetryService, notificationId: string, attempt: number): Promise<any>;
/**
 * Get retry history
 */
export declare function getNotificationRetryHistory(service: NotificationRetryService, notificationId: string): Promise<any[]>;
/**
 * Get user notification preferences
 */
export declare function getUserNotificationPreferences(service: NotificationPreferencesService, userId: string): Promise<any>;
/**
 * Update user notification preferences
 */
export declare function updateUserNotificationPreferences(service: NotificationPreferencesService, userId: string, updates: any): Promise<any>;
/**
 * Set user quiet hours
 */
export declare function setUserQuietHours(service: NotificationPreferencesService, userId: string, quietHours: any): Promise<any>;
//# sourceMappingURL=notification-management-services.d.ts.map