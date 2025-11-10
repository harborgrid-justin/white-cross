/**
 * LOC: EDU-COMP-COMM-001
 * File: /reuse/education/composites/communication-notifications-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../student-communication-kit
 *   - ../student-records-kit
 *   - ../attendance-tracking-kit
 *   - ../grading-assessment-kit
 *   - ../course-registration-kit
 *
 * DOWNSTREAM (imported by):
 *   - Communication controllers
 *   - Notification services
 *   - Alert management modules
 *   - Parent communication systems
 *   - Emergency notification services
 */
import { Sequelize } from 'sequelize';
import { MessageType, MessagePriority, NotificationCategory, AlertSeverity, CommunicationChannel, MessageData, NotificationData, CommunicationPreferenceData, MessageTemplateData, BulkMessageData, MessageDeliveryStatus, CommunicationAnalytics } from '../student-communication-kit';
/**
 * Message template category
 */
export type TemplateCategory = 'academic' | 'administrative' | 'financial' | 'emergency' | 'marketing';
/**
 * Communication campaign type
 */
export type CampaignType = 'informational' | 'promotional' | 'transactional' | 'emergency';
/**
 * Delivery method
 */
export type DeliveryMethod = 'immediate' | 'scheduled' | 'batched' | 'throttled';
/**
 * Recipient group type
 */
export type RecipientGroup = 'students' | 'parents' | 'faculty' | 'staff' | 'alumni' | 'custom';
/**
 * Scheduled message for future delivery
 */
export interface ScheduledMessageData {
    messageId: string;
    scheduledFor: Date;
    timezone: string;
    deliveryMethod: DeliveryMethod;
    recipients: string[];
    messageType: MessageType;
    priority: MessagePriority;
    status: 'scheduled' | 'processing' | 'sent' | 'cancelled';
    createdBy: string;
    createdAt: Date;
}
/**
 * Communication campaign
 */
export interface CampaignData {
    campaignName: string;
    campaignType: CampaignType;
    description?: string;
    targetAudience: RecipientGroup;
    recipientFilters?: Record<string, any>;
    messageTemplate: string;
    channels: CommunicationChannel[];
    scheduledStart: Date;
    scheduledEnd?: Date;
    budget?: number;
    createdBy: string;
    status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
}
/**
 * Message thread for conversations
 */
export interface MessageThreadData {
    threadId?: string;
    participants: Array<{
        userId: string;
        userType: 'student' | 'parent' | 'teacher' | 'staff';
        name: string;
    }>;
    subject: string;
    category: NotificationCategory;
    messages: Array<{
        senderId: string;
        content: string;
        sentAt: Date;
        attachments?: string[];
    }>;
    status: 'active' | 'archived' | 'closed';
    createdAt: Date;
    lastMessageAt: Date;
}
/**
 * Parent-teacher conference communication
 */
export interface ConferenceCommunicationData {
    studentId: string;
    parentId: string;
    teacherId: string;
    conferenceDate: Date;
    conferenceType: 'scheduled' | 'requested' | 'emergency';
    agenda: string;
    location?: string;
    virtualMeetingUrl?: string;
    status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
    notificationsSent: Date[];
    reminders?: Date[];
}
/**
 * Emergency alert system
 */
export interface EmergencyAlertData {
    alertId?: string;
    alertType: 'weather' | 'security' | 'health' | 'operational' | 'other';
    severity: AlertSeverity;
    title: string;
    message: string;
    instructions?: string[];
    affectedLocations?: string[];
    affectedGroups: RecipientGroup[];
    channels: CommunicationChannel[];
    issuedBy: string;
    issuedAt: Date;
    expiresAt?: Date;
    status: 'active' | 'resolved' | 'expired';
    acknowledgmentRequired: boolean;
}
/**
 * Communication opt-out management
 */
export interface OptOutData {
    userId: string;
    userType: 'student' | 'parent' | 'teacher' | 'staff';
    optOutType: 'all' | 'promotional' | 'non_essential';
    channels: CommunicationChannel[];
    categories?: NotificationCategory[];
    effectiveDate: Date;
    reason?: string;
}
/**
 * Message delivery attempt tracking
 */
export interface DeliveryAttemptData {
    messageId: string;
    recipientId: string;
    attemptNumber: number;
    channel: CommunicationChannel;
    attemptedAt: Date;
    status: 'success' | 'failed' | 'bounced' | 'undeliverable';
    errorCode?: string;
    errorMessage?: string;
    responseTime?: number;
}
/**
 * Communication webhook for integrations
 */
export interface WebhookData {
    webhookUrl: string;
    eventTypes: string[];
    secret: string;
    isActive: boolean;
    retryPolicy: {
        maxRetries: number;
        retryDelay: number;
    };
    lastTriggered?: Date;
    failureCount: number;
}
/**
 * Automated communication rule
 */
export interface AutomationRuleData {
    ruleName: string;
    triggerEvent: string;
    conditions: Record<string, any>;
    messageTemplate: string;
    channels: CommunicationChannel[];
    delay?: number;
    isActive: boolean;
    priority: MessagePriority;
    createdBy: string;
}
/**
 * Message archive for compliance
 */
export interface MessageArchiveData {
    messageId: string;
    originalSender: string;
    recipientCount: number;
    messageContent: string;
    messageType: MessageType;
    sentDate: Date;
    archivedDate: Date;
    retentionPeriod: number;
    complianceFlags?: string[];
}
/**
 * Sequelize model for Scheduled Messages.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     ScheduledMessage:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         messageId:
 *           type: string
 *         scheduledFor:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [scheduled, processing, sent, cancelled]
 */
export declare const createScheduledMessageModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        messageId: string;
        scheduledFor: Date;
        timezone: string;
        deliveryMethod: DeliveryMethod;
        recipients: string[];
        messageType: MessageType;
        priority: MessagePriority;
        status: string;
        createdBy: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Communication Campaigns.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     Campaign:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         campaignName:
 *           type: string
 *         status:
 *           type: string
 */
export declare const createCampaignModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        campaignName: string;
        campaignType: CampaignType;
        description: string | null;
        targetAudience: RecipientGroup;
        recipientFilters: Record<string, any>;
        messageTemplate: string;
        channels: CommunicationChannel[];
        scheduledStart: Date;
        scheduledEnd: Date | null;
        budget: number | null;
        createdBy: string;
        status: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Communication & Notifications Composite Service
 *
 * Provides comprehensive multi-channel communication, notification management,
 * and alert systems for educational institutions.
 */
export declare class CommunicationNotificationsCompositeService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 1. Sends individual email message.
     *
     * @param {MessageData} messageData - Message data
     * @returns {Promise<any>} Sent message
     *
     * @example
     * ```typescript
     * const message = await service.sendEmailMessage({
     *   senderId: 'admin-123',
     *   recipientType: 'student',
     *   recipientIds: ['stu-456'],
     *   subject: 'Course Registration Reminder',
     *   body: 'Registration for Spring 2025 begins next week...',
     *   messageType: MessageType.EMAIL,
     *   priority: MessagePriority.NORMAL,
     *   category: NotificationCategory.ACADEMIC
     * });
     * ```
     */
    sendEmailMessage(messageData: MessageData): Promise<any>;
    /**
     * 2. Sends bulk email to multiple recipients.
     *
     * @param {BulkMessageData} bulkData - Bulk message data
     * @returns {Promise<any>} Bulk send result
     *
     * @example
     * ```typescript
     * const result = await service.sendBulkEmail({
     *   senderId: 'admin-123',
     *   recipientType: 'student',
     *   recipientIds: ['stu-456', 'stu-789', 'stu-012'],
     *   subject: 'Campus Event Invitation',
     *   body: 'You are invited to...',
     *   messageType: MessageType.EMAIL,
     *   priority: MessagePriority.LOW,
     *   category: NotificationCategory.EVENT,
     *   batchSize: 100
     * });
     * console.log(`Sent to ${result.successCount} recipients`);
     * ```
     */
    sendBulkEmail(bulkData: BulkMessageData): Promise<any>;
    /**
     * 3. Creates email template.
     *
     * @param {MessageTemplateData} templateData - Template data
     * @returns {Promise<any>} Created template
     *
     * @example
     * ```typescript
     * const template = await service.createEmailTemplate({
     *   name: 'Welcome Email',
     *   category: NotificationCategory.ADMINISTRATIVE,
     *   messageType: MessageType.EMAIL,
     *   subject: 'Welcome to {{institutionName}}!',
     *   bodyTemplate: 'Dear {{studentName}}, Welcome to our institution...',
     *   variables: ['institutionName', 'studentName', 'startDate'],
     *   isActive: true,
     *   createdBy: 'admin-123'
     * });
     * ```
     */
    createEmailTemplate(templateData: MessageTemplateData): Promise<any>;
    /**
     * 4. Sends email using template with variable substitution.
     *
     * @param {string} templateId - Template ID
     * @param {string[]} recipientIds - Recipient IDs
     * @param {Record<string, any>} variables - Template variables
     * @returns {Promise<any>} Send result
     *
     * @example
     * ```typescript
     * await service.sendTemplatedEmail('template-123', ['stu-456'], {
     *   institutionName: 'State University',
     *   studentName: 'John Smith',
     *   startDate: '2025-01-15'
     * });
     * ```
     */
    sendTemplatedEmail(templateId: string, recipientIds: string[], variables: Record<string, any>): Promise<any>;
    /**
     * 5. Schedules email for future delivery.
     *
     * @param {MessageData} messageData - Message data
     * @param {Date} scheduledFor - Scheduled delivery time
     * @returns {Promise<any>} Scheduled message
     *
     * @example
     * ```typescript
     * await service.scheduleEmail(messageData, new Date('2024-11-01T09:00:00'));
     * ```
     */
    scheduleEmail(messageData: MessageData, scheduledFor: Date): Promise<any>;
    /**
     * 6. Tracks email delivery status.
     *
     * @param {string} messageId - Message ID
     * @returns {Promise<MessageDeliveryStatus[]>} Delivery statuses
     *
     * @example
     * ```typescript
     * const statuses = await service.trackEmailDelivery('msg-123');
     * console.log(`Delivered: ${statuses.filter(s => s.status === 'delivered').length}`);
     * ```
     */
    trackEmailDelivery(messageId: string): Promise<MessageDeliveryStatus[]>;
    /**
     * 7. Processes email bounce notifications.
     *
     * @param {string} messageId - Message ID
     * @param {string} recipientId - Recipient ID
     * @param {string} bounceReason - Bounce reason
     * @returns {Promise<any>} Bounce record
     *
     * @example
     * ```typescript
     * await service.processEmailBounce('msg-123', 'stu-456', 'Invalid email address');
     * ```
     */
    processEmailBounce(messageId: string, recipientId: string, bounceReason: string): Promise<any>;
    /**
     * 8. Sends SMS text message.
     *
     * @param {string[]} phoneNumbers - Phone numbers
     * @param {string} message - Message text
     * @param {MessagePriority} priority - Priority
     * @returns {Promise<any>} SMS send result
     *
     * @example
     * ```typescript
     * const result = await service.sendSmsMessage(
     *   ['+1234567890', '+0987654321'],
     *   'Campus closed due to weather. All classes cancelled.',
     *   MessagePriority.URGENT
     * );
     * ```
     */
    sendSmsMessage(phoneNumbers: string[], message: string, priority: MessagePriority): Promise<any>;
    /**
     * 9. Sends push notification to mobile devices.
     *
     * @param {NotificationData} notificationData - Notification data
     * @returns {Promise<any>} Push notification result
     *
     * @example
     * ```typescript
     * await service.sendPushNotification({
     *   recipientId: 'stu-456',
     *   recipientType: 'student',
     *   title: 'New Grade Posted',
     *   message: 'Your grade for CS 101 has been posted',
     *   category: NotificationCategory.ACADEMIC,
     *   priority: MessagePriority.NORMAL,
     *   actionUrl: '/grades'
     * });
     * ```
     */
    sendPushNotification(notificationData: NotificationData): Promise<any>;
    /**
     * 10. Sends in-app notification.
     *
     * @param {NotificationData} notificationData - Notification data
     * @returns {Promise<any>} In-app notification
     *
     * @example
     * ```typescript
     * await service.sendInAppNotification({
     *   recipientId: 'stu-456',
     *   recipientType: 'student',
     *   title: 'Course Registration Reminder',
     *   message: 'Registration opens tomorrow at 8 AM',
     *   category: NotificationCategory.ACADEMIC,
     *   priority: MessagePriority.HIGH
     * });
     * ```
     */
    sendInAppNotification(notificationData: NotificationData): Promise<any>;
    /**
     * 11. Configures SMS preferences and opt-outs.
     *
     * @param {string} userId - User ID
     * @param {boolean} enabled - SMS enabled
     * @returns {Promise<any>} Updated preferences
     *
     * @example
     * ```typescript
     * await service.configureSmsPreferences('stu-456', true);
     * ```
     */
    configureSmsPreferences(userId: string, enabled: boolean): Promise<any>;
    /**
     * 12. Manages push notification device tokens.
     *
     * @param {string} userId - User ID
     * @param {string} deviceToken - Device token
     * @param {string} platform - Platform (ios/android)
     * @returns {Promise<any>} Registered device
     *
     * @example
     * ```typescript
     * await service.registerDeviceToken('stu-456', 'token-abc123', 'ios');
     * ```
     */
    registerDeviceToken(userId: string, deviceToken: string, platform: string): Promise<any>;
    /**
     * 13. Sends multi-channel notification.
     *
     * @param {NotificationData} notificationData - Notification data
     * @param {CommunicationChannel[]} channels - Delivery channels
     * @returns {Promise<any>} Multi-channel result
     *
     * @example
     * ```typescript
     * await service.sendMultiChannelNotification(notificationData, [
     *   CommunicationChannel.EMAIL,
     *   CommunicationChannel.SMS,
     *   CommunicationChannel.PUSH
     * ]);
     * ```
     */
    sendMultiChannelNotification(notificationData: NotificationData, channels: CommunicationChannel[]): Promise<any>;
    /**
     * 14. Issues emergency alert to campus.
     *
     * @param {EmergencyAlertData} alertData - Alert data
     * @returns {Promise<any>} Issued alert
     *
     * @example
     * ```typescript
     * const alert = await service.issueEmergencyAlert({
     *   alertType: 'weather',
     *   severity: AlertSeverity.CRITICAL,
     *   title: 'Severe Weather Alert',
     *   message: 'Tornado warning in effect. Seek shelter immediately.',
     *   instructions: ['Move to lowest floor', 'Stay away from windows', 'Wait for all-clear'],
     *   affectedGroups: ['students', 'faculty', 'staff'],
     *   channels: [CommunicationChannel.EMAIL, CommunicationChannel.SMS, CommunicationChannel.PUSH],
     *   issuedBy: 'security-admin',
     *   issuedAt: new Date(),
     *   acknowledgmentRequired: true
     * });
     * ```
     */
    issueEmergencyAlert(alertData: EmergencyAlertData): Promise<any>;
    /**
     * 15. Tracks emergency alert acknowledgments.
     *
     * @param {string} alertId - Alert ID
     * @param {string} userId - User ID
     * @returns {Promise<any>} Acknowledgment record
     *
     * @example
     * ```typescript
     * await service.acknowledgeEmergencyAlert('alert-123', 'stu-456');
     * ```
     */
    acknowledgeEmergencyAlert(alertId: string, userId: string): Promise<any>;
    /**
     * 16. Updates emergency alert status.
     *
     * @param {string} alertId - Alert ID
     * @param {'resolved' | 'expired'} status - New status
     * @returns {Promise<any>} Updated alert
     *
     * @example
     * ```typescript
     * await service.updateEmergencyAlertStatus('alert-123', 'resolved');
     * ```
     */
    updateEmergencyAlertStatus(alertId: string, status: 'resolved' | 'expired'): Promise<any>;
    /**
     * 17. Retrieves active emergency alerts.
     *
     * @returns {Promise<EmergencyAlertData[]>} Active alerts
     *
     * @example
     * ```typescript
     * const activeAlerts = await service.getActiveEmergencyAlerts();
     * ```
     */
    getActiveEmergencyAlerts(): Promise<EmergencyAlertData[]>;
    /**
     * 18. Generates emergency alert report.
     *
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Promise<any>} Alert report
     *
     * @example
     * ```typescript
     * const report = await service.generateEmergencyAlertReport(
     *   new Date('2024-01-01'),
     *   new Date('2024-12-31')
     * );
     * ```
     */
    generateEmergencyAlertReport(startDate: Date, endDate: Date): Promise<any>;
    /**
     * 19. Sends message to parent/guardian.
     *
     * @param {string} studentId - Student ID
     * @param {string} parentId - Parent ID
     * @param {string} message - Message content
     * @param {MessagePriority} priority - Message priority
     * @returns {Promise<any>} Sent message
     *
     * @example
     * ```typescript
     * await service.sendParentMessage(
     *   'stu-456',
     *   'parent-789',
     *   'Your student has been absent for 3 consecutive days.',
     *   MessagePriority.HIGH
     * );
     * ```
     */
    sendParentMessage(studentId: string, parentId: string, message: string, priority: MessagePriority): Promise<any>;
    /**
     * 20. Creates message thread for ongoing conversation.
     *
     * @param {MessageThreadData} threadData - Thread data
     * @returns {Promise<any>} Created thread
     *
     * @example
     * ```typescript
     * const thread = await service.createMessageThread({
     *   participants: [
     *     { userId: 'teacher-123', userType: 'teacher', name: 'Ms. Johnson' },
     *     { userId: 'parent-456', userType: 'parent', name: 'Mr. Smith' }
     *   ],
     *   subject: 'Discussion about John\'s progress',
     *   category: NotificationCategory.ACADEMIC,
     *   messages: [],
     *   status: 'active',
     *   createdAt: new Date(),
     *   lastMessageAt: new Date()
     * });
     * ```
     */
    createMessageThread(threadData: MessageThreadData): Promise<any>;
    /**
     * 21. Adds message to existing thread.
     *
     * @param {string} threadId - Thread ID
     * @param {string} senderId - Sender ID
     * @param {string} content - Message content
     * @returns {Promise<any>} Updated thread
     *
     * @example
     * ```typescript
     * await service.replyToMessageThread(
     *   'thread-123',
     *   'parent-456',
     *   'Thank you for the update on John\'s progress.'
     * );
     * ```
     */
    replyToMessageThread(threadId: string, senderId: string, content: string): Promise<any>;
    /**
     * 22. Schedules parent-teacher conference.
     *
     * @param {ConferenceCommunicationData} conferenceData - Conference data
     * @returns {Promise<any>} Scheduled conference
     *
     * @example
     * ```typescript
     * const conference = await service.scheduleParentTeacherConference({
     *   studentId: 'stu-456',
     *   parentId: 'parent-789',
     *   teacherId: 'teacher-123',
     *   conferenceDate: new Date('2024-11-15T14:00:00'),
     *   conferenceType: 'scheduled',
     *   agenda: 'Discuss academic progress and behavior',
     *   location: 'Room 205',
     *   status: 'scheduled',
     *   notificationsSent: [new Date()]
     * });
     * ```
     */
    scheduleParentTeacherConference(conferenceData: ConferenceCommunicationData): Promise<any>;
    /**
     * 23. Sends conference reminder notifications.
     *
     * @param {string} conferenceId - Conference ID
     * @param {number} hoursBefore - Hours before conference
     * @returns {Promise<any>} Reminder result
     *
     * @example
     * ```typescript
     * await service.sendConferenceReminder('conf-123', 24); // 24 hours before
     * ```
     */
    sendConferenceReminder(conferenceId: string, hoursBefore: number): Promise<any>;
    /**
     * 24. Retrieves parent communication history.
     *
     * @param {string} studentId - Student ID
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Promise<any[]>} Communication history
     *
     * @example
     * ```typescript
     * const history = await service.getParentCommunicationHistory(
     *   'stu-456',
     *   new Date('2024-09-01'),
     *   new Date('2024-12-31')
     * );
     * ```
     */
    getParentCommunicationHistory(studentId: string, startDate: Date, endDate: Date): Promise<any[]>;
    /**
     * 25. Creates communication campaign.
     *
     * @param {CampaignData} campaignData - Campaign data
     * @returns {Promise<any>} Created campaign
     *
     * @example
     * ```typescript
     * const campaign = await service.createCommunicationCampaign({
     *   campaignName: 'Spring 2025 Registration',
     *   campaignType: 'informational',
     *   targetAudience: 'students',
     *   recipientFilters: { classYear: ['sophomore', 'junior', 'senior'] },
     *   messageTemplate: 'Registration opens on {{date}}...',
     *   channels: [CommunicationChannel.EMAIL, CommunicationChannel.IN_APP],
     *   scheduledStart: new Date('2024-11-01T08:00:00'),
     *   createdBy: 'admin-123',
     *   status: 'draft'
     * });
     * ```
     */
    createCommunicationCampaign(campaignData: CampaignData): Promise<any>;
    /**
     * 26. Launches communication campaign.
     *
     * @param {string} campaignId - Campaign ID
     * @returns {Promise<any>} Launch result
     *
     * @example
     * ```typescript
     * const result = await service.launchCampaign('campaign-123');
     * console.log(`Sent to ${result.recipientCount} recipients`);
     * ```
     */
    launchCampaign(campaignId: string): Promise<any>;
    /**
     * 27. Pauses active campaign.
     *
     * @param {string} campaignId - Campaign ID
     * @returns {Promise<any>} Updated campaign
     *
     * @example
     * ```typescript
     * await service.pauseCampaign('campaign-123');
     * ```
     */
    pauseCampaign(campaignId: string): Promise<any>;
    /**
     * 28. Generates campaign analytics.
     *
     * @param {string} campaignId - Campaign ID
     * @returns {Promise<any>} Campaign analytics
     *
     * @example
     * ```typescript
     * const analytics = await service.getCampaignAnalytics('campaign-123');
     * console.log(`Open rate: ${analytics.openRate}%`);
     * ```
     */
    getCampaignAnalytics(campaignId: string): Promise<any>;
    /**
     * 29. A/B tests campaign variations.
     *
     * @param {string} campaignId - Campaign ID
     * @param {any[]} variations - Campaign variations
     * @returns {Promise<any>} Test results
     *
     * @example
     * ```typescript
     * const results = await service.abTestCampaign('campaign-123', [
     *   { subject: 'Don\'t miss registration!', body: 'Version A...' },
     *   { subject: 'Registration opens soon', body: 'Version B...' }
     * ]);
     * ```
     */
    abTestCampaign(campaignId: string, variations: any[]): Promise<any>;
    /**
     * 30. Archives completed campaigns.
     *
     * @param {string} campaignId - Campaign ID
     * @returns {Promise<any>} Archive result
     *
     * @example
     * ```typescript
     * await service.archiveCampaign('campaign-123');
     * ```
     */
    archiveCampaign(campaignId: string): Promise<any>;
    /**
     * 31. Generates communication analytics report.
     *
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Promise<CommunicationAnalytics>} Analytics report
     *
     * @example
     * ```typescript
     * const analytics = await service.generateCommunicationAnalytics(
     *   new Date('2024-10-01'),
     *   new Date('2024-10-31')
     * );
     * console.log(`Total sent: ${analytics.totalSent}`);
     * console.log(`Delivery rate: ${analytics.deliveryRate}%`);
     * ```
     */
    generateCommunicationAnalytics(startDate: Date, endDate: Date): Promise<CommunicationAnalytics>;
    /**
     * 32. Tracks message delivery metrics.
     *
     * @param {string} messageId - Message ID
     * @returns {Promise<any>} Delivery metrics
     *
     * @example
     * ```typescript
     * const metrics = await service.trackMessageMetrics('msg-123');
     * ```
     */
    trackMessageMetrics(messageId: string): Promise<any>;
    /**
     * 33. Manages communication preferences.
     *
     * @param {CommunicationPreferenceData} preferences - User preferences
     * @returns {Promise<any>} Saved preferences
     *
     * @example
     * ```typescript
     * await service.manageCommunicationPreferences({
     *   userId: 'stu-456',
     *   userType: 'student',
     *   emailEnabled: true,
     *   smsEnabled: true,
     *   pushEnabled: true,
     *   phoneEnabled: false,
     *   preferredChannel: CommunicationChannel.EMAIL,
     *   categoryPreferences: {
     *     [NotificationCategory.ACADEMIC]: [CommunicationChannel.EMAIL, CommunicationChannel.PUSH],
     *     [NotificationCategory.FINANCIAL]: [CommunicationChannel.EMAIL]
     *   },
     *   timezone: 'America/New_York'
     * });
     * ```
     */
    manageCommunicationPreferences(preferences: CommunicationPreferenceData): Promise<any>;
    /**
     * 34. Processes opt-out requests.
     *
     * @param {OptOutData} optOutData - Opt-out data
     * @returns {Promise<any>} Opt-out record
     *
     * @example
     * ```typescript
     * await service.processOptOut({
     *   userId: 'stu-456',
     *   userType: 'student',
     *   optOutType: 'promotional',
     *   channels: [CommunicationChannel.EMAIL, CommunicationChannel.SMS],
     *   effectiveDate: new Date(),
     *   reason: 'Too many messages'
     * });
     * ```
     */
    processOptOut(optOutData: OptOutData): Promise<any>;
    /**
     * 35. Archives messages for compliance.
     *
     * @param {MessageArchiveData} archiveData - Archive data
     * @returns {Promise<any>} Archive record
     *
     * @example
     * ```typescript
     * await service.archiveMessageForCompliance({
     *   messageId: 'msg-123',
     *   originalSender: 'admin-456',
     *   recipientCount: 500,
     *   messageContent: 'Archived message content...',
     *   messageType: MessageType.EMAIL,
     *   sentDate: new Date(),
     *   archivedDate: new Date(),
     *   retentionPeriod: 2555 // 7 years
     * });
     * ```
     */
    archiveMessageForCompliance(archiveData: MessageArchiveData): Promise<any>;
    /**
     * 36. Validates FERPA compliance for communications.
     *
     * @param {string} messageId - Message ID
     * @returns {Promise<any>} Compliance validation
     *
     * @example
     * ```typescript
     * const validation = await service.validateFerpaCompliance('msg-123');
     * if (!validation.compliant) {
     *   console.log('Violations:', validation.violations);
     * }
     * ```
     */
    validateFerpaCompliance(messageId: string): Promise<any>;
    /**
     * 37. Generates delivery failure report.
     *
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Promise<any>} Failure report
     *
     * @example
     * ```typescript
     * const report = await service.generateDeliveryFailureReport(
     *   new Date('2024-10-01'),
     *   new Date('2024-10-31')
     * );
     * ```
     */
    generateDeliveryFailureReport(startDate: Date, endDate: Date): Promise<any>;
    /**
     * 38. Configures delivery retry policies.
     *
     * @param {any} retryPolicy - Retry policy configuration
     * @returns {Promise<any>} Saved policy
     *
     * @example
     * ```typescript
     * await service.configureRetryPolicy({
     *   maxRetries: 3,
     *   retryDelay: 300, // seconds
     *   backoffMultiplier: 2,
     *   channels: [CommunicationChannel.EMAIL, CommunicationChannel.SMS]
     * });
     * ```
     */
    configureRetryPolicy(retryPolicy: any): Promise<any>;
    /**
     * 39. Creates automated communication rules.
     *
     * @param {AutomationRuleData} ruleData - Automation rule
     * @returns {Promise<any>} Created rule
     *
     * @example
     * ```typescript
     * const rule = await service.createAutomationRule({
     *   ruleName: 'Attendance Alert',
     *   triggerEvent: 'student.absence.chronic',
     *   conditions: { absenceCount: { $gte: 5 } },
     *   messageTemplate: 'template-chronic-absence',
     *   channels: [CommunicationChannel.EMAIL, CommunicationChannel.SMS],
     *   delay: 60, // 1 hour delay
     *   isActive: true,
     *   priority: MessagePriority.HIGH,
     *   createdBy: 'admin-123'
     * });
     * ```
     */
    createAutomationRule(ruleData: AutomationRuleData): Promise<any>;
    /**
     * 40. Generates comprehensive communication dashboard.
     *
     * @returns {Promise<any>} Dashboard data
     *
     * @example
     * ```typescript
     * const dashboard = await service.generateCommunicationDashboard();
     * console.log(`Messages sent today: ${dashboard.todayStats.totalSent}`);
     * ```
     */
    generateCommunicationDashboard(): Promise<any>;
}
export default CommunicationNotificationsCompositeService;
//# sourceMappingURL=communication-notifications-composite.d.ts.map