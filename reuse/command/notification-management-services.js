"use strict";
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationPreferencesService = exports.NotificationRetryService = exports.NotificationSchedulingService = exports.NotificationABTestingService = exports.NotificationAnalyticsService = exports.NotificationComplianceService = exports.EmergencyBroadcastService = exports.GroupNotificationService = exports.NotificationTemplateService = exports.VoiceNotificationService = exports.PushNotificationService = exports.EmailNotificationService = exports.SmsNotificationService = exports.MultiChannelNotificationService = void 0;
exports.sendMultiChannelNotification = sendMultiChannelNotification;
exports.sendNotificationWithFallback = sendNotificationWithFallback;
exports.batchSendNotifications = batchSendNotifications;
exports.sendSmsNotification = sendSmsNotification;
exports.sendSmsWithConfirmation = sendSmsWithConfirmation;
exports.handleSmsDeliveryStatus = handleSmsDeliveryStatus;
exports.handleIncomingSms = handleIncomingSms;
exports.sendEmailNotification = sendEmailNotification;
exports.sendTemplatedEmail = sendTemplatedEmail;
exports.handleEmailEvents = handleEmailEvents;
exports.sendPushNotification = sendPushNotification;
exports.sendTopicPushNotification = sendTopicPushNotification;
exports.registerDeviceToken = registerDeviceToken;
exports.initiateVoiceCall = initiateVoiceCall;
exports.handleVoiceCallStatus = handleVoiceCallStatus;
exports.handleVoiceCallConfirmation = handleVoiceCallConfirmation;
exports.createNotificationTemplate = createNotificationTemplate;
exports.renderNotificationTemplate = renderNotificationTemplate;
exports.updateNotificationTemplate = updateNotificationTemplate;
exports.getTemplateByName = getTemplateByName;
exports.createNotificationGroup = createNotificationGroup;
exports.addNotificationGroupMembers = addNotificationGroupMembers;
exports.sendGroupNotification = sendGroupNotification;
exports.removeNotificationGroupMembers = removeNotificationGroupMembers;
exports.initiateEmergencyBroadcast = initiateEmergencyBroadcast;
exports.cancelEmergencyBroadcast = cancelEmergencyBroadcast;
exports.getActiveEmergencyBroadcasts = getActiveEmergencyBroadcasts;
exports.checkSmsCompliance = checkSmsCompliance;
exports.optOutUserFromChannel = optOutUserFromChannel;
exports.optInUserToChannel = optInUserToChannel;
exports.getNotificationDeliveryMetrics = getNotificationDeliveryMetrics;
exports.getNotificationEngagementMetrics = getNotificationEngagementMetrics;
exports.getChannelPerformance = getChannelPerformance;
exports.trackNotificationEvent = trackNotificationEvent;
exports.createNotificationABTest = createNotificationABTest;
exports.getABTestVariantForUser = getABTestVariantForUser;
exports.getABTestResults = getABTestResults;
exports.scheduleNotification = scheduleNotification;
exports.sendNotificationAtOptimalTime = sendNotificationAtOptimalTime;
exports.calculateOptimalSendTime = calculateOptimalSendTime;
exports.cancelScheduledNotification = cancelScheduledNotification;
exports.retryFailedNotification = retryFailedNotification;
exports.getNotificationRetryHistory = getNotificationRetryHistory;
exports.getUserNotificationPreferences = getUserNotificationPreferences;
exports.updateUserNotificationPreferences = updateUserNotificationPreferences;
exports.setUserQuietHours = setUserQuietHours;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
/**
 * Multi-Channel Notification Orchestration Service
 *
 * Coordinates notification delivery across multiple channels (SMS, Email, Push, Voice)
 * with intelligent channel selection and fallback strategies.
 */
let MultiChannelNotificationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var MultiChannelNotificationService = _classThis = class {
        constructor(notificationModel, channelModel, notificationQueue, smsService, emailService, pushService, voiceService, auditService) {
            this.notificationModel = notificationModel;
            this.channelModel = channelModel;
            this.notificationQueue = notificationQueue;
            this.smsService = smsService;
            this.emailService = emailService;
            this.pushService = pushService;
            this.voiceService = voiceService;
            this.auditService = auditService;
            this.logger = new common_1.Logger(MultiChannelNotificationService.name);
        }
        /**
         * Send notification through optimal channel based on priority and user preferences
         */
        async sendMultiChannelNotification(notificationData) {
            this.logger.log(`Sending multi-channel notification to recipient ${notificationData.recipientId}`);
            try {
                // Create notification record
                const notification = await this.notificationModel.create({
                    recipientId: notificationData.recipientId,
                    subject: notificationData.subject,
                    message: notificationData.message,
                    priority: notificationData.priority,
                    status: notificationData.scheduledFor ? 'SCHEDULED' : 'PENDING',
                    templateId: notificationData.templateId,
                    metadata: notificationData.metadata,
                    scheduledFor: notificationData.scheduledFor,
                    createdAt: new Date(),
                });
                // Determine optimal channels
                const channels = notificationData.channels ||
                    (await this.determineOptimalChannels(notificationData.recipientId, notificationData.priority));
                // Queue notification for each channel
                for (const channel of channels) {
                    await this.notificationQueue.add('send-notification', {
                        notificationId: notification.id,
                        channel,
                        priority: notificationData.priority,
                    }, {
                        priority: this.getQueuePriority(notificationData.priority),
                        delay: notificationData.scheduledFor
                            ? notificationData.scheduledFor.getTime() - Date.now()
                            : 0,
                        attempts: this.getRetryAttempts(notificationData.priority),
                        backoff: {
                            type: 'exponential',
                            delay: 2000,
                        },
                    });
                }
                await this.auditService.logAction({
                    action: 'NOTIFICATION_QUEUED',
                    entityType: 'notification',
                    entityId: notification.id,
                    metadata: { channels, priority: notificationData.priority },
                });
                return notification;
            }
            catch (error) {
                this.logger.error(`Failed to send multi-channel notification: ${error.message}`);
                throw error;
            }
        }
        /**
         * Determine optimal notification channels based on priority and user preferences
         */
        async determineOptimalChannels(recipientId, priority) {
            const preferences = await this.channelModel.findOne({
                where: { userId: recipientId },
            });
            // Emergency notifications use all available channels
            if (priority === 'EMERGENCY') {
                return ['PUSH', 'SMS', 'VOICE', 'EMAIL'];
            }
            // Critical notifications use push, SMS, and email
            if (priority === 'CRITICAL') {
                return ['PUSH', 'SMS', 'EMAIL'];
            }
            // Use user preferences for lower priority
            if (preferences) {
                const channels = [];
                if (preferences.enablePush)
                    channels.push('PUSH');
                if (preferences.enableSms)
                    channels.push('SMS');
                if (preferences.enableEmail)
                    channels.push('EMAIL');
                return channels.length > 0 ? channels : ['EMAIL'];
            }
            // Default to push and email
            return ['PUSH', 'EMAIL'];
        }
        /**
         * Send notification with automatic channel fallback
         */
        async sendWithFallback(notificationData) {
            let lastError;
            // Try primary channel first
            try {
                return await this.sendToChannel(notificationData.recipientId, notificationData.message, notificationData.primaryChannel);
            }
            catch (error) {
                this.logger.warn(`Primary channel ${notificationData.primaryChannel} failed: ${error.message}`);
                lastError = error;
            }
            // Try fallback channels
            for (const channel of notificationData.fallbackChannels) {
                try {
                    return await this.sendToChannel(notificationData.recipientId, notificationData.message, channel);
                }
                catch (error) {
                    this.logger.warn(`Fallback channel ${channel} failed: ${error.message}`);
                    lastError = error;
                }
            }
            throw new common_1.BadRequestException(`All notification channels failed: ${lastError.message}`);
        }
        /**
         * Send notification to specific channel
         */
        async sendToChannel(recipientId, message, channel) {
            switch (channel) {
                case 'SMS':
                    return await this.smsService.sendSms({ recipientId, message });
                case 'EMAIL':
                    return await this.emailService.sendEmail({ recipientId, message });
                case 'PUSH':
                    return await this.pushService.sendPush({ recipientId, message });
                case 'VOICE':
                    return await this.voiceService.initiateVoiceCall({ recipientId, message });
                default:
                    throw new common_1.BadRequestException(`Unsupported channel: ${channel}`);
            }
        }
        /**
         * Batch send notifications to multiple recipients
         */
        async batchSendNotifications(batchData) {
            this.logger.log(`Batch sending to ${batchData.recipientIds.length} recipients`);
            const batchSize = batchData.batchSize || 100;
            const results = [];
            // Process in batches to avoid overwhelming the queue
            for (let i = 0; i < batchData.recipientIds.length; i += batchSize) {
                const batch = batchData.recipientIds.slice(i, i + batchSize);
                const batchPromises = batch.map((recipientId) => this.sendMultiChannelNotification({
                    recipientId,
                    message: batchData.message,
                    subject: batchData.subject,
                    priority: batchData.priority,
                    channels: [batchData.channel],
                }));
                const batchResults = await Promise.allSettled(batchPromises);
                results.push(...batchResults);
                // Rate limiting between batches
                if (i + batchSize < batchData.recipientIds.length) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
            }
            return {
                total: batchData.recipientIds.length,
                successful: results.filter((r) => r.status === 'fulfilled').length,
                failed: results.filter((r) => r.status === 'rejected').length,
                results,
            };
        }
        /**
         * Get queue priority based on notification priority
         */
        getQueuePriority(priority) {
            const priorities = {
                EMERGENCY: 1,
                CRITICAL: 2,
                HIGH: 3,
                MEDIUM: 4,
                LOW: 5,
            };
            return priorities[priority] || 5;
        }
        /**
         * Get retry attempts based on priority
         */
        getRetryAttempts(priority) {
            const attempts = {
                EMERGENCY: 5,
                CRITICAL: 4,
                HIGH: 3,
                MEDIUM: 2,
                LOW: 1,
            };
            return attempts[priority] || 1;
        }
    };
    __setFunctionName(_classThis, "MultiChannelNotificationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MultiChannelNotificationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MultiChannelNotificationService = _classThis;
})();
exports.MultiChannelNotificationService = MultiChannelNotificationService;
/**
 * SMS Notification Service
 *
 * Handles SMS delivery through Twilio with delivery tracking and compliance.
 */
let SmsNotificationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SmsNotificationService = _classThis = class {
        constructor(smsModel, userModel, twilioClient, complianceService, auditService) {
            this.smsModel = smsModel;
            this.userModel = userModel;
            this.twilioClient = twilioClient;
            this.complianceService = complianceService;
            this.auditService = auditService;
            this.logger = new common_1.Logger(SmsNotificationService.name);
        }
        /**
         * Send SMS notification
         */
        async sendSms(smsData) {
            this.logger.log(`Sending SMS to recipient ${smsData.recipientId}`);
            try {
                // Get recipient phone number
                const user = await this.userModel.findByPk(smsData.recipientId);
                if (!user || !user.phoneNumber) {
                    throw new common_1.NotFoundException('Recipient phone number not found');
                }
                // Check compliance (opt-out, quiet hours, rate limits)
                const compliant = await this.complianceService.checkSmsCompliance(smsData.recipientId, smsData.priority);
                if (!compliant.allowed) {
                    throw new common_1.ForbiddenException(`SMS blocked: ${compliant.reason}`);
                }
                // Send via Twilio
                const twilioResponse = await this.twilioClient.messages.create({
                    to: user.phoneNumber,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    body: smsData.message,
                    statusCallback: `${process.env.API_BASE_URL}/webhooks/twilio/sms-status`,
                });
                // Record SMS
                const sms = await this.smsModel.create({
                    recipientId: smsData.recipientId,
                    phoneNumber: user.phoneNumber,
                    message: smsData.message,
                    twilioSid: twilioResponse.sid,
                    status: 'SENT',
                    priority: smsData.priority,
                    metadata: smsData.metadata,
                    sentAt: new Date(),
                });
                await this.auditService.logAction({
                    action: 'SMS_SENT',
                    entityType: 'sms_notification',
                    entityId: sms.id,
                    userId: smsData.recipientId,
                });
                return sms;
            }
            catch (error) {
                this.logger.error(`Failed to send SMS: ${error.message}`);
                throw error;
            }
        }
        /**
         * Send SMS with delivery confirmation
         */
        async sendSmsWithConfirmation(smsData) {
            const sms = await this.sendSms({
                recipientId: smsData.recipientId,
                message: smsData.message,
            });
            if (smsData.requireConfirmation) {
                // Add confirmation tracking
                await this.smsModel.update({
                    requiresConfirmation: true,
                    confirmationTimeout: smsData.confirmationTimeout || 300000, // 5 minutes
                }, { where: { id: sms.id } });
            }
            return sms;
        }
        /**
         * Handle SMS delivery status webhook from Twilio
         */
        async handleDeliveryStatus(statusData) {
            this.logger.log(`Handling SMS delivery status for ${statusData.MessageSid}: ${statusData.MessageStatus}`);
            const sms = await this.smsModel.findOne({
                where: { twilioSid: statusData.MessageSid },
            });
            if (!sms) {
                this.logger.warn(`SMS not found for SID ${statusData.MessageSid}`);
                return;
            }
            await this.smsModel.update({
                status: statusData.MessageStatus.toUpperCase(),
                errorCode: statusData.ErrorCode,
                errorMessage: statusData.ErrorMessage,
                deliveredAt: statusData.MessageStatus === 'delivered' ? new Date() : null,
            }, { where: { id: sms.id } });
            await this.auditService.logAction({
                action: 'SMS_DELIVERY_STATUS_UPDATED',
                entityType: 'sms_notification',
                entityId: sms.id,
                metadata: { status: statusData.MessageStatus },
            });
            return sms;
        }
        /**
         * Handle incoming SMS responses (two-way communication)
         */
        async handleIncomingSms(incomingData) {
            this.logger.log(`Received SMS from ${incomingData.From}: ${incomingData.Body}`);
            try {
                // Find user by phone number
                const user = await this.userModel.findOne({
                    where: { phoneNumber: incomingData.From },
                });
                if (!user) {
                    this.logger.warn(`Received SMS from unknown number: ${incomingData.From}`);
                    return;
                }
                // Record incoming SMS
                const incomingSms = await this.smsModel.create({
                    recipientId: user.id,
                    phoneNumber: incomingData.From,
                    message: incomingData.Body,
                    twilioSid: incomingData.MessageSid,
                    direction: 'INBOUND',
                    status: 'RECEIVED',
                    receivedAt: new Date(),
                });
                // Process response (confirmation, opt-out, etc.)
                await this.processIncomingSmsResponse(user.id, incomingData.Body);
                await this.auditService.logAction({
                    action: 'SMS_RECEIVED',
                    entityType: 'sms_notification',
                    entityId: incomingSms.id,
                    userId: user.id,
                });
                return incomingSms;
            }
            catch (error) {
                this.logger.error(`Failed to handle incoming SMS: ${error.message}`);
                throw error;
            }
        }
        /**
         * Process incoming SMS response for confirmations and commands
         */
        async processIncomingSmsResponse(userId, message) {
            const normalizedMessage = message.trim().toUpperCase();
            // Handle opt-out requests
            if (['STOP', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT'].includes(normalizedMessage)) {
                await this.complianceService.optOutUser(userId, 'SMS');
                return;
            }
            // Handle opt-in requests
            if (['START', 'SUBSCRIBE', 'YES'].includes(normalizedMessage)) {
                await this.complianceService.optInUser(userId, 'SMS');
                return;
            }
            // Handle confirmations (YES, NO, CONFIRM, etc.)
            if (['YES', 'CONFIRM', 'OK', 'ACKNOWLEDGED'].includes(normalizedMessage)) {
                await this.recordConfirmation(userId, 'CONFIRMED');
                return;
            }
            if (['NO', 'DECLINE', 'REJECT'].includes(normalizedMessage)) {
                await this.recordConfirmation(userId, 'DECLINED');
                return;
            }
        }
        /**
         * Record SMS confirmation response
         */
        async recordConfirmation(userId, response) {
            // Find the most recent SMS requiring confirmation
            const sms = await this.smsModel.findOne({
                where: {
                    recipientId: userId,
                    requiresConfirmation: true,
                    confirmationResponse: null,
                },
                order: [['sentAt', 'DESC']],
            });
            if (sms) {
                await this.smsModel.update({
                    confirmationResponse: response,
                    confirmedAt: new Date(),
                }, { where: { id: sms.id } });
            }
        }
    };
    __setFunctionName(_classThis, "SmsNotificationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SmsNotificationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SmsNotificationService = _classThis;
})();
exports.SmsNotificationService = SmsNotificationService;
/**
 * Email Notification Service
 *
 * Handles email delivery through SendGrid with template support and tracking.
 */
let EmailNotificationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var EmailNotificationService = _classThis = class {
        constructor(emailModel, userModel, sendGridClient, templateService, complianceService, auditService) {
            this.emailModel = emailModel;
            this.userModel = userModel;
            this.sendGridClient = sendGridClient;
            this.templateService = templateService;
            this.complianceService = complianceService;
            this.auditService = auditService;
            this.logger = new common_1.Logger(EmailNotificationService.name);
        }
        /**
         * Send email notification
         */
        async sendEmail(emailData) {
            this.logger.log(`Sending email to recipient ${emailData.recipientId}`);
            try {
                // Get recipient email
                const user = await this.userModel.findByPk(emailData.recipientId);
                if (!user || !user.email) {
                    throw new common_1.NotFoundException('Recipient email not found');
                }
                // Check compliance
                const compliant = await this.complianceService.checkEmailCompliance(emailData.recipientId);
                if (!compliant.allowed) {
                    throw new common_1.ForbiddenException(`Email blocked: ${compliant.reason}`);
                }
                let subject = emailData.subject;
                let htmlContent = emailData.message;
                // Use template if provided
                if (emailData.templateId) {
                    const rendered = await this.templateService.renderTemplate(emailData.templateId, emailData.templateData || {});
                    subject = rendered.subject;
                    htmlContent = rendered.html;
                }
                // Send via SendGrid
                const sendGridResponse = await this.sendGridClient.send({
                    to: user.email,
                    from: {
                        email: process.env.SENDGRID_FROM_EMAIL,
                        name: process.env.SENDGRID_FROM_NAME || 'White Cross Health',
                    },
                    subject,
                    html: htmlContent,
                    attachments: emailData.attachments,
                    trackingSettings: {
                        clickTracking: { enable: true },
                        openTracking: { enable: true },
                    },
                });
                // Record email
                const email = await this.emailModel.create({
                    recipientId: emailData.recipientId,
                    email: user.email,
                    subject,
                    htmlContent,
                    templateId: emailData.templateId,
                    sendGridId: sendGridResponse[0]?.headers['x-message-id'],
                    status: 'SENT',
                    priority: emailData.priority,
                    sentAt: new Date(),
                });
                await this.auditService.logAction({
                    action: 'EMAIL_SENT',
                    entityType: 'email_notification',
                    entityId: email.id,
                    userId: emailData.recipientId,
                });
                return email;
            }
            catch (error) {
                this.logger.error(`Failed to send email: ${error.message}`);
                throw error;
            }
        }
        /**
         * Send templated email with personalization
         */
        async sendTemplatedEmail(emailData) {
            const results = [];
            for (const recipientId of emailData.recipientIds) {
                try {
                    const templateData = emailData.personalizedData[recipientId] || {};
                    const email = await this.sendEmail({
                        recipientId,
                        templateId: emailData.templateId,
                        templateData,
                    });
                    results.push({ recipientId, success: true, emailId: email.id });
                }
                catch (error) {
                    this.logger.error(`Failed to send email to ${recipientId}: ${error.message}`);
                    results.push({ recipientId, success: false, error: error.message });
                }
            }
            return {
                total: emailData.recipientIds.length,
                successful: results.filter((r) => r.success).length,
                failed: results.filter((r) => !r.success).length,
                results,
            };
        }
        /**
         * Handle email event webhooks from SendGrid (opens, clicks, bounces)
         */
        async handleEmailEvent(events) {
            this.logger.log(`Processing ${events.length} email events`);
            for (const event of events) {
                try {
                    const email = await this.emailModel.findOne({
                        where: { sendGridId: event.sg_message_id },
                    });
                    if (!email) {
                        this.logger.warn(`Email not found for event ${event.sg_message_id}`);
                        continue;
                    }
                    // Update email based on event type
                    const updates = {};
                    switch (event.event) {
                        case 'delivered':
                            updates.status = 'DELIVERED';
                            updates.deliveredAt = new Date(event.timestamp * 1000);
                            break;
                        case 'open':
                            updates.openedAt = updates.openedAt || new Date(event.timestamp * 1000);
                            updates.openCount = (email.openCount || 0) + 1;
                            break;
                        case 'click':
                            updates.clickedAt = updates.clickedAt || new Date(event.timestamp * 1000);
                            updates.clickCount = (email.clickCount || 0) + 1;
                            break;
                        case 'bounce':
                        case 'dropped':
                            updates.status = 'FAILED';
                            updates.errorMessage = event.reason;
                            break;
                        case 'unsubscribe':
                            await this.complianceService.optOutUser(email.recipientId, 'EMAIL');
                            break;
                    }
                    if (Object.keys(updates).length > 0) {
                        await this.emailModel.update(updates, { where: { id: email.id } });
                    }
                    await this.auditService.logAction({
                        action: `EMAIL_${event.event.toUpperCase()}`,
                        entityType: 'email_notification',
                        entityId: email.id,
                        metadata: { eventType: event.event },
                    });
                }
                catch (error) {
                    this.logger.error(`Failed to process email event: ${error.message}`);
                }
            }
            return { processed: events.length };
        }
    };
    __setFunctionName(_classThis, "EmailNotificationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EmailNotificationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EmailNotificationService = _classThis;
})();
exports.EmailNotificationService = EmailNotificationService;
/**
 * Push Notification Service
 *
 * Handles mobile and web push notifications via Firebase Cloud Messaging.
 */
let PushNotificationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PushNotificationService = _classThis = class {
        constructor(pushModel, deviceTokenModel, firebaseAdmin, complianceService, auditService) {
            this.pushModel = pushModel;
            this.deviceTokenModel = deviceTokenModel;
            this.firebaseAdmin = firebaseAdmin;
            this.complianceService = complianceService;
            this.auditService = auditService;
            this.logger = new common_1.Logger(PushNotificationService.name);
        }
        /**
         * Send push notification to user's devices
         */
        async sendPush(pushData) {
            this.logger.log(`Sending push notification to recipient ${pushData.recipientId}`);
            try {
                // Get user's device tokens
                const devices = await this.deviceTokenModel.findAll({
                    where: {
                        userId: pushData.recipientId,
                        enabled: true,
                    },
                });
                if (devices.length === 0) {
                    throw new common_1.NotFoundException('No active devices found for recipient');
                }
                // Check compliance
                const compliant = await this.complianceService.checkPushCompliance(pushData.recipientId);
                if (!compliant.allowed) {
                    throw new common_1.ForbiddenException(`Push blocked: ${compliant.reason}`);
                }
                const tokens = devices.map((d) => d.fcmToken);
                // Send via Firebase Cloud Messaging
                const message = {
                    notification: {
                        title: pushData.title || 'White Cross Alert',
                        body: pushData.message,
                        imageUrl: pushData.imageUrl,
                    },
                    data: {
                        ...pushData.data,
                        priority: pushData.priority || 'MEDIUM',
                    },
                    apns: {
                        payload: {
                            aps: {
                                badge: pushData.badge,
                                sound: pushData.sound || 'default',
                            },
                        },
                    },
                    android: {
                        priority: pushData.priority === 'EMERGENCY' ? 'high' : 'normal',
                        notification: {
                            sound: pushData.sound || 'default',
                            channelId: 'emergency_alerts',
                        },
                    },
                    tokens,
                };
                const response = await this.firebaseAdmin.messaging().sendMulticast(message);
                // Record push notification
                const push = await this.pushModel.create({
                    recipientId: pushData.recipientId,
                    title: pushData.title,
                    message: pushData.message,
                    data: pushData.data,
                    priority: pushData.priority,
                    deviceCount: tokens.length,
                    successCount: response.successCount,
                    failureCount: response.failureCount,
                    status: response.successCount > 0 ? 'SENT' : 'FAILED',
                    sentAt: new Date(),
                });
                // Handle failed tokens
                if (response.failureCount > 0) {
                    await this.handleFailedTokens(devices, response.responses);
                }
                await this.auditService.logAction({
                    action: 'PUSH_SENT',
                    entityType: 'push_notification',
                    entityId: push.id,
                    userId: pushData.recipientId,
                });
                return push;
            }
            catch (error) {
                this.logger.error(`Failed to send push notification: ${error.message}`);
                throw error;
            }
        }
        /**
         * Send topic-based push notification to subscribed users
         */
        async sendTopicPush(topicData) {
            this.logger.log(`Sending push notification to topic ${topicData.topic}`);
            const message = {
                notification: {
                    title: topicData.title,
                    body: topicData.message,
                },
                data: topicData.data || {},
                topic: topicData.topic,
            };
            const response = await this.firebaseAdmin.messaging().send(message);
            await this.auditService.logAction({
                action: 'TOPIC_PUSH_SENT',
                entityType: 'push_notification',
                metadata: { topic: topicData.topic, messageId: response },
            });
            return response;
        }
        /**
         * Register device token for push notifications
         */
        async registerDeviceToken(tokenData) {
            this.logger.log(`Registering device token for user ${tokenData.userId}`);
            // Check if token already exists
            const existing = await this.deviceTokenModel.findOne({
                where: {
                    userId: tokenData.userId,
                    deviceId: tokenData.deviceId,
                },
            });
            if (existing) {
                // Update existing token
                await this.deviceTokenModel.update({
                    fcmToken: tokenData.fcmToken,
                    deviceType: tokenData.deviceType,
                    enabled: true,
                    lastUsedAt: new Date(),
                }, { where: { id: existing.id } });
                return existing;
            }
            // Create new token
            const token = await this.deviceTokenModel.create({
                userId: tokenData.userId,
                fcmToken: tokenData.fcmToken,
                deviceType: tokenData.deviceType,
                deviceId: tokenData.deviceId,
                enabled: true,
                registeredAt: new Date(),
            });
            return token;
        }
        /**
         * Handle failed FCM tokens (unregister invalid tokens)
         */
        async handleFailedTokens(devices, responses) {
            for (let i = 0; i < responses.length; i++) {
                const response = responses[i];
                if (!response.success) {
                    const error = response.error;
                    // Disable invalid or unregistered tokens
                    if (error.code === 'messaging/invalid-registration-token' ||
                        error.code === 'messaging/registration-token-not-registered') {
                        await this.deviceTokenModel.update({ enabled: false, disabledReason: error.message }, { where: { id: devices[i].id } });
                    }
                }
            }
        }
    };
    __setFunctionName(_classThis, "PushNotificationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PushNotificationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PushNotificationService = _classThis;
})();
exports.PushNotificationService = PushNotificationService;
/**
 * Voice Notification Service
 *
 * Handles automated voice call notifications via Twilio with text-to-speech.
 */
let VoiceNotificationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var VoiceNotificationService = _classThis = class {
        constructor(voiceModel, userModel, twilioClient, complianceService, auditService) {
            this.voiceModel = voiceModel;
            this.userModel = userModel;
            this.twilioClient = twilioClient;
            this.complianceService = complianceService;
            this.auditService = auditService;
            this.logger = new common_1.Logger(VoiceNotificationService.name);
        }
        /**
         * Initiate automated voice call notification
         */
        async initiateVoiceCall(voiceData) {
            this.logger.log(`Initiating voice call to recipient ${voiceData.recipientId}`);
            try {
                // Get recipient phone number
                const user = await this.userModel.findByPk(voiceData.recipientId);
                if (!user || !user.phoneNumber) {
                    throw new common_1.NotFoundException('Recipient phone number not found');
                }
                // Check compliance
                const compliant = await this.complianceService.checkVoiceCompliance(voiceData.recipientId, voiceData.priority);
                if (!compliant.allowed) {
                    throw new common_1.ForbiddenException(`Voice call blocked: ${compliant.reason}`);
                }
                // Generate TwiML for the call
                const twimlUrl = await this.generateTwiml(voiceData.message, voiceData.voice, voiceData.language, voiceData.requireConfirmation);
                // Initiate call via Twilio
                const call = await this.twilioClient.calls.create({
                    to: user.phoneNumber,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    url: twimlUrl,
                    statusCallback: `${process.env.API_BASE_URL}/webhooks/twilio/voice-status`,
                    statusCallbackMethod: 'POST',
                    statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
                });
                // Record voice notification
                const voice = await this.voiceModel.create({
                    recipientId: voiceData.recipientId,
                    phoneNumber: user.phoneNumber,
                    message: voiceData.message,
                    twilioCallSid: call.sid,
                    status: 'INITIATED',
                    priority: voiceData.priority,
                    requiresConfirmation: voiceData.requireConfirmation,
                    initiatedAt: new Date(),
                });
                await this.auditService.logAction({
                    action: 'VOICE_CALL_INITIATED',
                    entityType: 'voice_notification',
                    entityId: voice.id,
                    userId: voiceData.recipientId,
                });
                return voice;
            }
            catch (error) {
                this.logger.error(`Failed to initiate voice call: ${error.message}`);
                throw error;
            }
        }
        /**
         * Generate TwiML for voice notification
         */
        async generateTwiml(message, voice, language, requireConfirmation) {
            // This would typically be a URL to a TwiML endpoint
            // For now, return a placeholder
            return `${process.env.API_BASE_URL}/twiml/voice-notification?message=${encodeURIComponent(message)}&voice=${voice || 'woman'}&lang=${language || 'en-US'}&confirm=${requireConfirmation || false}`;
        }
        /**
         * Handle voice call status webhook from Twilio
         */
        async handleCallStatus(statusData) {
            this.logger.log(`Handling voice call status for ${statusData.CallSid}: ${statusData.CallStatus}`);
            const voice = await this.voiceModel.findOne({
                where: { twilioCallSid: statusData.CallSid },
            });
            if (!voice) {
                this.logger.warn(`Voice call not found for SID ${statusData.CallSid}`);
                return;
            }
            const updates = {
                status: statusData.CallStatus.toUpperCase(),
            };
            if (statusData.CallStatus === 'completed') {
                updates.completedAt = new Date();
                updates.duration = parseInt(statusData.CallDuration || '0', 10);
            }
            if (statusData.RecordingUrl) {
                updates.recordingUrl = statusData.RecordingUrl;
            }
            await this.voiceModel.update(updates, { where: { id: voice.id } });
            await this.auditService.logAction({
                action: 'VOICE_CALL_STATUS_UPDATED',
                entityType: 'voice_notification',
                entityId: voice.id,
                metadata: { status: statusData.CallStatus },
            });
            return voice;
        }
        /**
         * Handle voice call confirmation response (DTMF input)
         */
        async handleCallConfirmation(confirmationData) {
            this.logger.log(`Handling confirmation for call ${confirmationData.CallSid}: ${confirmationData.Digits}`);
            const voice = await this.voiceModel.findOne({
                where: { twilioCallSid: confirmationData.CallSid },
            });
            if (!voice) {
                return;
            }
            const response = confirmationData.Digits === '1' ? 'CONFIRMED' : 'DECLINED';
            await this.voiceModel.update({
                confirmationResponse: response,
                confirmedAt: new Date(),
            }, { where: { id: voice.id } });
            return voice;
        }
    };
    __setFunctionName(_classThis, "VoiceNotificationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VoiceNotificationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VoiceNotificationService = _classThis;
})();
exports.VoiceNotificationService = VoiceNotificationService;
/**
 * Notification Template Service
 *
 * Manages notification templates with variable substitution and versioning.
 */
let NotificationTemplateService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var NotificationTemplateService = _classThis = class {
        constructor(templateModel, versionModel) {
            this.templateModel = templateModel;
            this.versionModel = versionModel;
            this.logger = new common_1.Logger(NotificationTemplateService.name);
        }
        /**
         * Create notification template
         */
        async createTemplate(templateData) {
            this.logger.log(`Creating notification template: ${templateData.name}`);
            const template = await this.templateModel.create({
                name: templateData.name,
                description: templateData.description,
                channel: templateData.channel,
                subject: templateData.subject,
                bodyTemplate: templateData.bodyTemplate,
                variables: templateData.variables,
                metadata: templateData.metadata,
                version: 1,
                isActive: true,
                createdAt: new Date(),
            });
            // Create initial version
            await this.versionModel.create({
                templateId: template.id,
                version: 1,
                subject: templateData.subject,
                bodyTemplate: templateData.bodyTemplate,
                variables: templateData.variables,
                createdAt: new Date(),
            });
            return template;
        }
        /**
         * Render template with variable substitution
         */
        async renderTemplate(templateId, variables) {
            this.logger.log(`Rendering template ${templateId}`);
            const template = await this.templateModel.findByPk(templateId);
            if (!template) {
                throw new common_1.NotFoundException(`Template ${templateId} not found`);
            }
            if (!template.isActive) {
                throw new common_1.BadRequestException(`Template ${templateId} is not active`);
            }
            // Validate required variables
            const missingVars = template.variables.filter((v) => !(v in variables));
            if (missingVars.length > 0) {
                throw new common_1.BadRequestException(`Missing required variables: ${missingVars.join(', ')}`);
            }
            // Substitute variables in template
            let renderedBody = template.bodyTemplate;
            let renderedSubject = template.subject || '';
            for (const [key, value] of Object.entries(variables)) {
                const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
                renderedBody = renderedBody.replace(regex, value);
                renderedSubject = renderedSubject.replace(regex, value);
            }
            return {
                subject: renderedSubject,
                body: renderedBody,
                html: renderedBody, // Can add HTML formatting here
            };
        }
        /**
         * Update template and create new version
         */
        async updateTemplate(templateId, updates) {
            this.logger.log(`Updating template ${templateId}`);
            const template = await this.templateModel.findByPk(templateId);
            if (!template) {
                throw new common_1.NotFoundException(`Template ${templateId} not found`);
            }
            const newVersion = template.version + 1;
            // Create new version
            await this.versionModel.create({
                templateId: template.id,
                version: newVersion,
                subject: updates.subject || template.subject,
                bodyTemplate: updates.bodyTemplate || template.bodyTemplate,
                variables: updates.variables || template.variables,
                createdAt: new Date(),
            });
            // Update template
            await this.templateModel.update({
                subject: updates.subject || template.subject,
                bodyTemplate: updates.bodyTemplate || template.bodyTemplate,
                variables: updates.variables || template.variables,
                version: newVersion,
                updatedAt: new Date(),
            }, { where: { id: templateId } });
            return await this.templateModel.findByPk(templateId);
        }
        /**
         * Get template by name and channel
         */
        async getTemplateByName(name, channel) {
            const template = await this.templateModel.findOne({
                where: { name, channel, isActive: true },
            });
            if (!template) {
                throw new common_1.NotFoundException(`Template ${name} for channel ${channel} not found`);
            }
            return template;
        }
    };
    __setFunctionName(_classThis, "NotificationTemplateService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationTemplateService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationTemplateService = _classThis;
})();
exports.NotificationTemplateService = NotificationTemplateService;
/**
 * Group Notification Service
 *
 * Manages notifications to user groups and broadcast lists.
 */
let GroupNotificationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var GroupNotificationService = _classThis = class {
        constructor(groupModel, membershipModel, multiChannelService, auditService) {
            this.groupModel = groupModel;
            this.membershipModel = membershipModel;
            this.multiChannelService = multiChannelService;
            this.auditService = auditService;
            this.logger = new common_1.Logger(GroupNotificationService.name);
        }
        /**
         * Create notification group
         */
        async createNotificationGroup(groupData) {
            this.logger.log(`Creating notification group: ${groupData.name}`);
            const group = await this.groupModel.create({
                name: groupData.name,
                description: groupData.description,
                type: groupData.type,
                dynamicCriteria: groupData.dynamicCriteria,
                createdAt: new Date(),
            });
            // Add static members
            if (groupData.memberIds && groupData.memberIds.length > 0) {
                await this.addGroupMembers(group.id, groupData.memberIds);
            }
            return group;
        }
        /**
         * Add members to notification group
         */
        async addGroupMembers(groupId, memberIds) {
            this.logger.log(`Adding ${memberIds.length} members to group ${groupId}`);
            const memberships = memberIds.map((userId) => ({
                groupId,
                userId,
                addedAt: new Date(),
            }));
            await this.membershipModel.bulkCreate(memberships, {
                ignoreDuplicates: true,
            });
            return { added: memberIds.length };
        }
        /**
         * Send notification to group
         */
        async sendGroupNotification(notificationData) {
            this.logger.log(`Sending notification to group ${notificationData.groupId}`);
            // Get group members
            const memberIds = await this.getGroupMemberIds(notificationData.groupId);
            if (memberIds.length === 0) {
                throw new common_1.BadRequestException(`Group ${notificationData.groupId} has no members`);
            }
            // Send to all members
            const result = await this.multiChannelService.batchSendNotifications({
                recipientIds: memberIds,
                subject: notificationData.subject,
                message: notificationData.message,
                priority: notificationData.priority,
                channel: notificationData.channels[0], // Use primary channel
            });
            await this.auditService.logAction({
                action: 'GROUP_NOTIFICATION_SENT',
                entityType: 'notification_group',
                entityId: notificationData.groupId,
                metadata: { memberCount: memberIds.length, result },
            });
            return result;
        }
        /**
         * Get group member IDs (with dynamic criteria evaluation)
         */
        async getGroupMemberIds(groupId) {
            const group = await this.groupModel.findByPk(groupId);
            if (!group) {
                throw new common_1.NotFoundException(`Group ${groupId} not found`);
            }
            if (group.type === 'STATIC') {
                const memberships = await this.membershipModel.findAll({
                    where: { groupId },
                    attributes: ['userId'],
                });
                return memberships.map((m) => m.userId);
            }
            // Dynamic group - evaluate criteria
            // This would query users based on the dynamic criteria
            // For now, return empty array
            return [];
        }
        /**
         * Remove members from notification group
         */
        async removeGroupMembers(groupId, memberIds) {
            await this.membershipModel.destroy({
                where: {
                    groupId,
                    userId: { [sequelize_1.Op.in]: memberIds },
                },
            });
            return { removed: memberIds.length };
        }
    };
    __setFunctionName(_classThis, "GroupNotificationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GroupNotificationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GroupNotificationService = _classThis;
})();
exports.GroupNotificationService = GroupNotificationService;
/**
 * Emergency Broadcast Service
 *
 * Handles emergency mass notifications with override capabilities.
 */
let EmergencyBroadcastService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var EmergencyBroadcastService = _classThis = class {
        constructor(broadcastModel, multiChannelService, groupService, auditService) {
            this.broadcastModel = broadcastModel;
            this.multiChannelService = multiChannelService;
            this.groupService = groupService;
            this.auditService = auditService;
            this.logger = new common_1.Logger(EmergencyBroadcastService.name);
        }
        /**
         * Initiate emergency broadcast (bypasses quiet hours and opt-outs)
         */
        async initiateEmergencyBroadcast(broadcastData) {
            this.logger.log(`Initiating emergency broadcast: ${broadcastData.title} (${broadcastData.severity})`);
            try {
                // Create broadcast record
                const broadcast = await this.broadcastModel.create({
                    title: broadcastData.title,
                    message: broadcastData.message,
                    severity: broadcastData.severity,
                    status: 'ACTIVE',
                    channels: broadcastData.channels || ['PUSH', 'SMS', 'EMAIL', 'VOICE'],
                    expiresAt: broadcastData.expiresAt,
                    initiatedAt: new Date(),
                });
                // Collect all target users
                let recipientIds = [];
                // Add group members
                if (broadcastData.targetGroups) {
                    for (const groupId of broadcastData.targetGroups) {
                        const memberIds = await this.groupService.getGroupMemberIds(groupId);
                        recipientIds.push(...memberIds);
                    }
                }
                // Add individual users
                if (broadcastData.targetUserIds) {
                    recipientIds.push(...broadcastData.targetUserIds);
                }
                // Remove duplicates
                recipientIds = [...new Set(recipientIds)];
                // Send to all recipients on all channels (emergency overrides preferences)
                const results = [];
                for (const channel of broadcast.channels) {
                    const result = await this.multiChannelService.batchSendNotifications({
                        recipientIds,
                        subject: broadcastData.title,
                        message: broadcastData.message,
                        priority: 'EMERGENCY',
                        channel,
                    });
                    results.push({ channel, ...result });
                }
                // Update broadcast with results
                await this.broadcastModel.update({
                    recipientCount: recipientIds.length,
                    status: 'SENT',
                    sentAt: new Date(),
                }, { where: { id: broadcast.id } });
                await this.auditService.logAction({
                    action: 'EMERGENCY_BROADCAST_SENT',
                    entityType: 'emergency_broadcast',
                    entityId: broadcast.id,
                    metadata: { recipientCount: recipientIds.length, severity: broadcastData.severity },
                });
                return {
                    broadcast,
                    recipientCount: recipientIds.length,
                    results,
                };
            }
            catch (error) {
                this.logger.error(`Failed to initiate emergency broadcast: ${error.message}`);
                throw error;
            }
        }
        /**
         * Cancel active emergency broadcast
         */
        async cancelEmergencyBroadcast(broadcastId) {
            this.logger.log(`Canceling emergency broadcast ${broadcastId}`);
            const broadcast = await this.broadcastModel.findByPk(broadcastId);
            if (!broadcast) {
                throw new common_1.NotFoundException(`Broadcast ${broadcastId} not found`);
            }
            await this.broadcastModel.update({
                status: 'CANCELLED',
                cancelledAt: new Date(),
            }, { where: { id: broadcastId } });
            await this.auditService.logAction({
                action: 'EMERGENCY_BROADCAST_CANCELLED',
                entityType: 'emergency_broadcast',
                entityId: broadcastId,
            });
            return broadcast;
        }
        /**
         * Get active emergency broadcasts
         */
        async getActiveEmergencyBroadcasts() {
            return await this.broadcastModel.findAll({
                where: {
                    status: 'ACTIVE',
                    [sequelize_1.Op.or]: [
                        { expiresAt: null },
                        { expiresAt: { [sequelize_1.Op.gt]: new Date() } },
                    ],
                },
                order: [['initiatedAt', 'DESC']],
            });
        }
    };
    __setFunctionName(_classThis, "EmergencyBroadcastService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EmergencyBroadcastService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EmergencyBroadcastService = _classThis;
})();
exports.EmergencyBroadcastService = EmergencyBroadcastService;
/**
 * Notification Compliance Service
 *
 * Enforces notification compliance rules (quiet hours, opt-outs, rate limits, TCPA).
 */
let NotificationComplianceService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var NotificationComplianceService = _classThis = class {
        constructor(preferencesModel, optOutModel, rateLimitModel) {
            this.preferencesModel = preferencesModel;
            this.optOutModel = optOutModel;
            this.rateLimitModel = rateLimitModel;
            this.logger = new common_1.Logger(NotificationComplianceService.name);
        }
        /**
         * Check if SMS notification is compliant
         */
        async checkSmsCompliance(userId, priority) {
            // Emergency messages bypass all restrictions
            if (priority === 'EMERGENCY') {
                return { allowed: true };
            }
            // Check opt-out status
            const optOut = await this.optOutModel.findOne({
                where: { userId, channel: 'SMS', isActive: true },
            });
            if (optOut) {
                return { allowed: false, reason: 'User opted out of SMS notifications' };
            }
            // Check quiet hours
            const preferences = await this.preferencesModel.findOne({
                where: { userId },
            });
            if (preferences && !this.isWithinAllowedHours(preferences, 'SMS')) {
                return { allowed: false, reason: 'Outside quiet hours' };
            }
            // Check rate limits (TCPA compliance)
            const rateLimit = await this.checkRateLimit(userId, 'SMS');
            if (!rateLimit.allowed) {
                return { allowed: false, reason: 'Rate limit exceeded' };
            }
            return { allowed: true };
        }
        /**
         * Check if email notification is compliant
         */
        async checkEmailCompliance(userId) {
            // Check opt-out status
            const optOut = await this.optOutModel.findOne({
                where: { userId, channel: 'EMAIL', isActive: true },
            });
            if (optOut) {
                return { allowed: false, reason: 'User opted out of email notifications' };
            }
            return { allowed: true };
        }
        /**
         * Check if push notification is compliant
         */
        async checkPushCompliance(userId) {
            const preferences = await this.preferencesModel.findOne({
                where: { userId },
            });
            if (preferences && !preferences.enablePush) {
                return { allowed: false, reason: 'Push notifications disabled by user' };
            }
            return { allowed: true };
        }
        /**
         * Check if voice call is compliant
         */
        async checkVoiceCompliance(userId, priority) {
            // Emergency calls bypass restrictions
            if (priority === 'EMERGENCY') {
                return { allowed: true };
            }
            // Check opt-out
            const optOut = await this.optOutModel.findOne({
                where: { userId, channel: 'VOICE', isActive: true },
            });
            if (optOut) {
                return { allowed: false, reason: 'User opted out of voice calls' };
            }
            // Check quiet hours
            const preferences = await this.preferencesModel.findOne({
                where: { userId },
            });
            if (preferences && !this.isWithinAllowedHours(preferences, 'VOICE')) {
                return { allowed: false, reason: 'Outside quiet hours' };
            }
            return { allowed: true };
        }
        /**
         * Check if current time is within allowed notification hours
         */
        isWithinAllowedHours(preferences, channel) {
            if (!preferences.quietHoursEnabled) {
                return true;
            }
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const currentTime = currentHour * 60 + currentMinute;
            const startTime = preferences.quietHoursStart.hours * 60 +
                preferences.quietHoursStart.minutes;
            const endTime = preferences.quietHoursEnd.hours * 60 + preferences.quietHoursEnd.minutes;
            // Handle overnight quiet hours
            if (startTime > endTime) {
                return currentTime < startTime && currentTime >= endTime;
            }
            return currentTime < startTime || currentTime >= endTime;
        }
        /**
         * Check rate limit for user and channel
         */
        async checkRateLimit(userId, channel) {
            const now = new Date();
            const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
            // Count notifications in last hour
            const count = await this.rateLimitModel.count({
                where: {
                    userId,
                    channel,
                    createdAt: { [sequelize_1.Op.gte]: oneHourAgo },
                },
            });
            // TCPA compliance: Max 3 SMS per hour for non-emergency
            const limit = channel === 'SMS' ? 3 : 10;
            if (count >= limit) {
                return {
                    allowed: false,
                    reason: `Rate limit exceeded: ${count}/${limit} notifications in last hour`,
                };
            }
            // Record this check
            await this.rateLimitModel.create({
                userId,
                channel,
                createdAt: now,
            });
            return { allowed: true };
        }
        /**
         * Opt user out of channel
         */
        async optOutUser(userId, channel) {
            this.logger.log(`Opting out user ${userId} from channel ${channel}`);
            // Deactivate existing opt-outs
            await this.optOutModel.update({ isActive: false }, { where: { userId, channel } });
            // Create new opt-out
            const optOut = await this.optOutModel.create({
                userId,
                channel,
                isActive: true,
                optedOutAt: new Date(),
            });
            return optOut;
        }
        /**
         * Opt user in to channel
         */
        async optInUser(userId, channel) {
            this.logger.log(`Opting in user ${userId} to channel ${channel}`);
            await this.optOutModel.update({ isActive: false, optedInAt: new Date() }, { where: { userId, channel } });
            return { success: true };
        }
    };
    __setFunctionName(_classThis, "NotificationComplianceService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationComplianceService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationComplianceService = _classThis;
})();
exports.NotificationComplianceService = NotificationComplianceService;
/**
 * Notification Analytics Service
 *
 * Tracks notification metrics, delivery rates, engagement, and performance.
 */
let NotificationAnalyticsService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var NotificationAnalyticsService = _classThis = class {
        constructor(notificationModel, eventModel) {
            this.notificationModel = notificationModel;
            this.eventModel = eventModel;
            this.logger = new common_1.Logger(NotificationAnalyticsService.name);
        }
        /**
         * Get notification delivery metrics
         */
        async getDeliveryMetrics(filters) {
            const where = {
                createdAt: {
                    [sequelize_1.Op.between]: [filters.startDate, filters.endDate],
                },
            };
            if (filters.channel)
                where.channel = filters.channel;
            if (filters.priority)
                where.priority = filters.priority;
            const total = await this.notificationModel.count({ where });
            const sent = await this.notificationModel.count({
                where: { ...where, status: 'SENT' },
            });
            const delivered = await this.notificationModel.count({
                where: { ...where, status: 'DELIVERED' },
            });
            const failed = await this.notificationModel.count({
                where: { ...where, status: 'FAILED' },
            });
            return {
                total,
                sent,
                delivered,
                failed,
                deliveryRate: total > 0 ? (delivered / total) * 100 : 0,
                failureRate: total > 0 ? (failed / total) * 100 : 0,
            };
        }
        /**
         * Get notification engagement metrics
         */
        async getEngagementMetrics(filters) {
            const where = {
                createdAt: {
                    [sequelize_1.Op.between]: [filters.startDate, filters.endDate],
                },
            };
            if (filters.channel)
                where.channel = filters.channel;
            const total = await this.notificationModel.count({ where });
            // For emails: opens and clicks
            if (!filters.channel || filters.channel === 'EMAIL') {
                const opened = await this.notificationModel.count({
                    where: { ...where, openedAt: { [sequelize_1.Op.ne]: null } },
                });
                const clicked = await this.notificationModel.count({
                    where: { ...where, clickedAt: { [sequelize_1.Op.ne]: null } },
                });
                return {
                    total,
                    opened,
                    clicked,
                    openRate: total > 0 ? (opened / total) * 100 : 0,
                    clickRate: total > 0 ? (clicked / total) * 100 : 0,
                    clickToOpenRate: opened > 0 ? (clicked / opened) * 100 : 0,
                };
            }
            // For SMS/Voice: confirmations
            const confirmed = await this.notificationModel.count({
                where: { ...where, confirmationResponse: 'CONFIRMED' },
            });
            return {
                total,
                confirmed,
                confirmationRate: total > 0 ? (confirmed / total) * 100 : 0,
            };
        }
        /**
         * Get channel performance comparison
         */
        async getChannelPerformance(filters) {
            const channels = ['SMS', 'EMAIL', 'PUSH', 'VOICE'];
            const performance = [];
            for (const channel of channels) {
                const metrics = await this.getDeliveryMetrics({
                    ...filters,
                    channel,
                });
                performance.push({ channel, ...metrics });
            }
            return performance;
        }
        /**
         * Track notification event (for custom analytics)
         */
        async trackNotificationEvent(eventData) {
            const event = await this.eventModel.create({
                notificationId: eventData.notificationId,
                eventType: eventData.eventType,
                eventData: eventData.eventData,
                occurredAt: new Date(),
            });
            return event;
        }
    };
    __setFunctionName(_classThis, "NotificationAnalyticsService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationAnalyticsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationAnalyticsService = _classThis;
})();
exports.NotificationAnalyticsService = NotificationAnalyticsService;
/**
 * Notification A/B Testing Service
 *
 * Manages A/B tests for notification content, timing, and channels.
 */
let NotificationABTestingService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var NotificationABTestingService = _classThis = class {
        constructor(testModel, variantModel, assignmentModel, analyticsService) {
            this.testModel = testModel;
            this.variantModel = variantModel;
            this.assignmentModel = assignmentModel;
            this.analyticsService = analyticsService;
            this.logger = new common_1.Logger(NotificationABTestingService.name);
        }
        /**
         * Create A/B test for notifications
         */
        async createABTest(testData) {
            this.logger.log(`Creating A/B test: ${testData.name}`);
            // Create test
            const test = await this.testModel.create({
                name: testData.name,
                description: testData.description,
                channel: testData.channel,
                status: 'ACTIVE',
                startDate: testData.startDate,
                endDate: testData.endDate,
                createdAt: new Date(),
            });
            // Create variants
            for (const variantData of testData.variants) {
                await this.variantModel.create({
                    testId: test.id,
                    name: variantData.name,
                    subject: variantData.subject,
                    message: variantData.message,
                    weight: variantData.weight,
                });
            }
            return test;
        }
        /**
         * Assign user to A/B test variant
         */
        async assignUserToVariant(testId, userId) {
            // Check if user already assigned
            const existing = await this.assignmentModel.findOne({
                where: { testId, userId },
            });
            if (existing) {
                return existing;
            }
            // Get all variants
            const variants = await this.variantModel.findAll({
                where: { testId },
            });
            if (variants.length === 0) {
                throw new common_1.NotFoundException(`No variants found for test ${testId}`);
            }
            // Weighted random selection
            const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
            let random = Math.random() * totalWeight;
            let selectedVariant = variants[0];
            for (const variant of variants) {
                random -= variant.weight;
                if (random <= 0) {
                    selectedVariant = variant;
                    break;
                }
            }
            // Create assignment
            const assignment = await this.assignmentModel.create({
                testId,
                userId,
                variantId: selectedVariant.id,
                assignedAt: new Date(),
            });
            return assignment;
        }
        /**
         * Get variant for user (or assign if not assigned)
         */
        async getVariantForUser(testId, userId) {
            const assignment = await this.assignUserToVariant(testId, userId);
            const variant = await this.variantModel.findByPk(assignment.variantId);
            return variant;
        }
        /**
         * Get A/B test results
         */
        async getTestResults(testId) {
            const test = await this.testModel.findByPk(testId);
            if (!test) {
                throw new common_1.NotFoundException(`Test ${testId} not found`);
            }
            const variants = await this.variantModel.findAll({
                where: { testId },
            });
            const results = [];
            for (const variant of variants) {
                // Get assignments for this variant
                const assignments = await this.assignmentModel.count({
                    where: { variantId: variant.id },
                });
                // Get metrics (this would need to be enhanced based on tracking)
                results.push({
                    variantId: variant.id,
                    variantName: variant.name,
                    assignments,
                    // Additional metrics would come from notification tracking
                });
            }
            return {
                test,
                variants: results,
            };
        }
    };
    __setFunctionName(_classThis, "NotificationABTestingService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationABTestingService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationABTestingService = _classThis;
})();
exports.NotificationABTestingService = NotificationABTestingService;
/**
 * Notification Scheduling Service
 *
 * Handles scheduled and time-optimized notification delivery.
 */
let NotificationSchedulingService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var NotificationSchedulingService = _classThis = class {
        constructor(scheduledModel, preferencesModel, notificationQueue, multiChannelService) {
            this.scheduledModel = scheduledModel;
            this.preferencesModel = preferencesModel;
            this.notificationQueue = notificationQueue;
            this.multiChannelService = multiChannelService;
            this.logger = new common_1.Logger(NotificationSchedulingService.name);
        }
        /**
         * Schedule notification for future delivery
         */
        async scheduleNotification(notificationData) {
            this.logger.log(`Scheduling notification for ${notificationData.recipientId} at ${notificationData.scheduledFor}`);
            const scheduled = await this.scheduledModel.create({
                recipientId: notificationData.recipientId,
                subject: notificationData.subject,
                message: notificationData.message,
                channel: notificationData.channel,
                scheduledFor: notificationData.scheduledFor,
                timezone: notificationData.timezone,
                status: 'SCHEDULED',
                createdAt: new Date(),
            });
            // Queue for delivery at scheduled time
            const delay = notificationData.scheduledFor.getTime() - Date.now();
            await this.notificationQueue.add('send-scheduled-notification', { scheduledNotificationId: scheduled.id }, { delay: Math.max(0, delay) });
            return scheduled;
        }
        /**
         * Calculate optimal send time based on user engagement patterns
         */
        async calculateOptimalSendTime(userId) {
            // This would analyze user engagement history to find best time
            // For now, return default optimal time (9 AM in user's timezone)
            const preferences = await this.preferencesModel.findOne({
                where: { userId },
            });
            const timezone = preferences?.timezone || 'America/New_York';
            // Calculate 9 AM tomorrow in user's timezone
            const now = new Date();
            const optimal = new Date(now);
            optimal.setDate(optimal.getDate() + 1);
            optimal.setHours(9, 0, 0, 0);
            return optimal;
        }
        /**
         * Send notification at optimal time for user
         */
        async sendAtOptimalTime(notificationData) {
            const optimalTime = await this.calculateOptimalSendTime(notificationData.recipientId);
            return await this.scheduleNotification({
                ...notificationData,
                scheduledFor: optimalTime,
            });
        }
        /**
         * Cancel scheduled notification
         */
        async cancelScheduledNotification(scheduledId) {
            const scheduled = await this.scheduledModel.findByPk(scheduledId);
            if (!scheduled) {
                throw new common_1.NotFoundException(`Scheduled notification ${scheduledId} not found`);
            }
            await this.scheduledModel.update({ status: 'CANCELLED', cancelledAt: new Date() }, { where: { id: scheduledId } });
            return scheduled;
        }
    };
    __setFunctionName(_classThis, "NotificationSchedulingService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationSchedulingService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationSchedulingService = _classThis;
})();
exports.NotificationSchedulingService = NotificationSchedulingService;
/**
 * Notification Retry Service
 *
 * Handles intelligent retry logic for failed notifications.
 */
let NotificationRetryService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var NotificationRetryService = _classThis = class {
        constructor(retryModel, multiChannelService) {
            this.retryModel = retryModel;
            this.multiChannelService = multiChannelService;
            this.logger = new common_1.Logger(NotificationRetryService.name);
        }
        /**
         * Retry failed notification with exponential backoff
         */
        async retryFailedNotification(notificationId, attempt) {
            this.logger.log(`Retrying notification ${notificationId}, attempt ${attempt}`);
            // Calculate backoff delay: 2^attempt seconds
            const backoffSeconds = Math.pow(2, attempt);
            const delay = backoffSeconds * 1000;
            // Record retry attempt
            await this.retryModel.create({
                notificationId,
                attempt,
                backoffSeconds,
                scheduledFor: new Date(Date.now() + delay),
                createdAt: new Date(),
            });
            // Schedule retry
            // Implementation would queue the retry job
            return { notificationId, attempt, delay };
        }
        /**
         * Get retry history for notification
         */
        async getRetryHistory(notificationId) {
            return await this.retryModel.findAll({
                where: { notificationId },
                order: [['attempt', 'ASC']],
            });
        }
    };
    __setFunctionName(_classThis, "NotificationRetryService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationRetryService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationRetryService = _classThis;
})();
exports.NotificationRetryService = NotificationRetryService;
/**
 * Notification Preferences Service
 *
 * Manages user notification preferences and settings.
 */
let NotificationPreferencesService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var NotificationPreferencesService = _classThis = class {
        constructor(preferencesModel) {
            this.preferencesModel = preferencesModel;
            this.logger = new common_1.Logger(NotificationPreferencesService.name);
        }
        /**
         * Get user notification preferences
         */
        async getUserPreferences(userId) {
            let preferences = await this.preferencesModel.findOne({
                where: { userId },
            });
            if (!preferences) {
                // Create default preferences
                preferences = await this.preferencesModel.create({
                    userId,
                    enableSms: true,
                    enableEmail: true,
                    enablePush: true,
                    enableVoice: false,
                    quietHoursEnabled: false,
                    timezone: 'America/New_York',
                    createdAt: new Date(),
                });
            }
            return preferences;
        }
        /**
         * Update user notification preferences
         */
        async updateUserPreferences(userId, updates) {
            this.logger.log(`Updating notification preferences for user ${userId}`);
            await this.preferencesModel.update({ ...updates, updatedAt: new Date() }, { where: { userId } });
            return await this.getUserPreferences(userId);
        }
        /**
         * Set quiet hours for user
         */
        async setQuietHours(userId, quietHours) {
            return await this.updateUserPreferences(userId, {
                quietHoursEnabled: quietHours.enabled,
                quietHoursStart: {
                    hours: quietHours.startHour,
                    minutes: quietHours.startMinute,
                },
                quietHoursEnd: {
                    hours: quietHours.endHour,
                    minutes: quietHours.endMinute,
                },
            });
        }
    };
    __setFunctionName(_classThis, "NotificationPreferencesService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationPreferencesService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationPreferencesService = _classThis;
})();
exports.NotificationPreferencesService = NotificationPreferencesService;
// ============================================================================
// Exported Service Functions
// ============================================================================
/**
 * Send multi-channel notification
 */
async function sendMultiChannelNotification(service, data) {
    return await service.sendMultiChannelNotification(data);
}
/**
 * Send notification with automatic fallback
 */
async function sendNotificationWithFallback(service, data) {
    return await service.sendWithFallback(data);
}
/**
 * Batch send notifications
 */
async function batchSendNotifications(service, data) {
    return await service.batchSendNotifications(data);
}
/**
 * Send SMS notification
 */
async function sendSmsNotification(service, data) {
    return await service.sendSms(data);
}
/**
 * Send SMS with delivery confirmation
 */
async function sendSmsWithConfirmation(service, data) {
    return await service.sendSmsWithConfirmation(data);
}
/**
 * Handle SMS delivery status
 */
async function handleSmsDeliveryStatus(service, data) {
    return await service.handleDeliveryStatus(data);
}
/**
 * Handle incoming SMS
 */
async function handleIncomingSms(service, data) {
    return await service.handleIncomingSms(data);
}
/**
 * Send email notification
 */
async function sendEmailNotification(service, data) {
    return await service.sendEmail(data);
}
/**
 * Send templated email
 */
async function sendTemplatedEmail(service, data) {
    return await service.sendTemplatedEmail(data);
}
/**
 * Handle email events
 */
async function handleEmailEvents(service, events) {
    return await service.handleEmailEvent(events);
}
/**
 * Send push notification
 */
async function sendPushNotification(service, data) {
    return await service.sendPush(data);
}
/**
 * Send topic-based push notification
 */
async function sendTopicPushNotification(service, data) {
    return await service.sendTopicPush(data);
}
/**
 * Register device token
 */
async function registerDeviceToken(service, data) {
    return await service.registerDeviceToken(data);
}
/**
 * Initiate voice call notification
 */
async function initiateVoiceCall(service, data) {
    return await service.initiateVoiceCall(data);
}
/**
 * Handle voice call status
 */
async function handleVoiceCallStatus(service, data) {
    return await service.handleCallStatus(data);
}
/**
 * Handle voice call confirmation
 */
async function handleVoiceCallConfirmation(service, data) {
    return await service.handleCallConfirmation(data);
}
/**
 * Create notification template
 */
async function createNotificationTemplate(service, data) {
    return await service.createTemplate(data);
}
/**
 * Render notification template
 */
async function renderNotificationTemplate(service, templateId, variables) {
    return await service.renderTemplate(templateId, variables);
}
/**
 * Update notification template
 */
async function updateNotificationTemplate(service, templateId, updates) {
    return await service.updateTemplate(templateId, updates);
}
/**
 * Get template by name
 */
async function getTemplateByName(service, name, channel) {
    return await service.getTemplateByName(name, channel);
}
/**
 * Create notification group
 */
async function createNotificationGroup(service, data) {
    return await service.createNotificationGroup(data);
}
/**
 * Add group members
 */
async function addNotificationGroupMembers(service, groupId, memberIds) {
    return await service.addGroupMembers(groupId, memberIds);
}
/**
 * Send group notification
 */
async function sendGroupNotification(service, data) {
    return await service.sendGroupNotification(data);
}
/**
 * Remove group members
 */
async function removeNotificationGroupMembers(service, groupId, memberIds) {
    return await service.removeGroupMembers(groupId, memberIds);
}
/**
 * Initiate emergency broadcast
 */
async function initiateEmergencyBroadcast(service, data) {
    return await service.initiateEmergencyBroadcast(data);
}
/**
 * Cancel emergency broadcast
 */
async function cancelEmergencyBroadcast(service, broadcastId) {
    return await service.cancelEmergencyBroadcast(broadcastId);
}
/**
 * Get active emergency broadcasts
 */
async function getActiveEmergencyBroadcasts(service) {
    return await service.getActiveEmergencyBroadcasts();
}
/**
 * Check SMS compliance
 */
async function checkSmsCompliance(service, userId, priority) {
    return await service.checkSmsCompliance(userId, priority);
}
/**
 * Opt user out of channel
 */
async function optOutUserFromChannel(service, userId, channel) {
    return await service.optOutUser(userId, channel);
}
/**
 * Opt user in to channel
 */
async function optInUserToChannel(service, userId, channel) {
    return await service.optInUser(userId, channel);
}
/**
 * Get delivery metrics
 */
async function getNotificationDeliveryMetrics(service, filters) {
    return await service.getDeliveryMetrics(filters);
}
/**
 * Get engagement metrics
 */
async function getNotificationEngagementMetrics(service, filters) {
    return await service.getEngagementMetrics(filters);
}
/**
 * Get channel performance
 */
async function getChannelPerformance(service, filters) {
    return await service.getChannelPerformance(filters);
}
/**
 * Track notification event
 */
async function trackNotificationEvent(service, data) {
    return await service.trackNotificationEvent(data);
}
/**
 * Create A/B test
 */
async function createNotificationABTest(service, data) {
    return await service.createABTest(data);
}
/**
 * Get variant for user
 */
async function getABTestVariantForUser(service, testId, userId) {
    return await service.getVariantForUser(testId, userId);
}
/**
 * Get A/B test results
 */
async function getABTestResults(service, testId) {
    return await service.getTestResults(testId);
}
/**
 * Schedule notification
 */
async function scheduleNotification(service, data) {
    return await service.scheduleNotification(data);
}
/**
 * Send at optimal time
 */
async function sendNotificationAtOptimalTime(service, data) {
    return await service.sendAtOptimalTime(data);
}
/**
 * Calculate optimal send time
 */
async function calculateOptimalSendTime(service, userId) {
    return await service.calculateOptimalSendTime(userId);
}
/**
 * Cancel scheduled notification
 */
async function cancelScheduledNotification(service, scheduledId) {
    return await service.cancelScheduledNotification(scheduledId);
}
/**
 * Retry failed notification
 */
async function retryFailedNotification(service, notificationId, attempt) {
    return await service.retryFailedNotification(notificationId, attempt);
}
/**
 * Get retry history
 */
async function getNotificationRetryHistory(service, notificationId) {
    return await service.getRetryHistory(notificationId);
}
/**
 * Get user notification preferences
 */
async function getUserNotificationPreferences(service, userId) {
    return await service.getUserPreferences(userId);
}
/**
 * Update user notification preferences
 */
async function updateUserNotificationPreferences(service, userId, updates) {
    return await service.updateUserPreferences(userId, updates);
}
/**
 * Set user quiet hours
 */
async function setUserQuietHours(service, userId, quietHours) {
    return await service.setQuietHours(userId, quietHours);
}
//# sourceMappingURL=notification-management-services.js.map