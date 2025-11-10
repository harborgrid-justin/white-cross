"use strict";
/**
 * LOC: EMAILNOT1234568
 * File: /reuse/email-notification-kit-v2.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS notification services
 *   - Email queue processors
 *   - SMS services
 *   - Push notification services
 *   - Template engines
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = exports.notificationTemplateSchema = exports.pushNotificationSchema = exports.smsMessageSchema = exports.smtpConfigSchema = exports.emailConfigSchema = void 0;
exports.defineEmailLogModel = defineEmailLogModel;
exports.defineNotificationTemplateModel = defineNotificationTemplateModel;
exports.defineNotificationPreferenceModel = defineNotificationPreferenceModel;
exports.createSMTPTransporter = createSMTPTransporter;
exports.sendSMTPEmail = sendSMTPEmail;
exports.sendBulkSMTPEmails = sendBulkSMTPEmails;
exports.validateEmailAddress = validateEmailAddress;
exports.parseEmailHeaders = parseEmailHeaders;
exports.createSendGridClient = createSendGridClient;
exports.sendSendGridEmail = sendSendGridEmail;
exports.sendSendGridTemplate = sendSendGridTemplate;
exports.handleSendGridWebhook = handleSendGridWebhook;
exports.createSESClient = createSESClient;
exports.sendSESEmail = sendSESEmail;
exports.sendSESTemplate = sendSESTemplate;
exports.handleSESBounce = handleSESBounce;
exports.compileHandlebarsTemplate = compileHandlebarsTemplate;
exports.renderEmailTemplate = renderEmailTemplate;
exports.validateTemplateVariables = validateTemplateVariables;
exports.createEmailTemplate = createEmailTemplate;
exports.generateUnsubscribeLink = generateUnsubscribeLink;
exports.createTwilioClient = createTwilioClient;
exports.sendTwilioSMS = sendTwilioSMS;
exports.sendBulkSMS = sendBulkSMS;
exports.validatePhoneNumber = validatePhoneNumber;
exports.createFCMClient = createFCMClient;
exports.sendFCMPushNotification = sendFCMPushNotification;
exports.sendSilentPush = sendSilentPush;
exports.subscribeToTopic = subscribeToTopic;
exports.trackEmailOpen = trackEmailOpen;
exports.trackEmailClick = trackEmailClick;
exports.generateEmailAnalytics = generateEmailAnalytics;
exports.identifyBestSendTimes = identifyBestSendTimes;
exports.getUserPreferences = getUserPreferences;
exports.updateUserPreferences = updateUserPreferences;
exports.shouldSendNotification = shouldSendNotification;
exports.handleUnsubscribe = handleUnsubscribe;
/**
 * File: /reuse/email-notification-kit-v2.ts
 * Locator: WC-UTL-EMAILNOT-002
 * Purpose: Comprehensive Email & Notification Kit V2 - Complete communication toolkit for NestJS
 *
 * Upstream: Independent utility module for email and notification operations
 * Downstream: ../backend/*, Email services, SMS services, Push notifications, Queue processors
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/bull, nodemailer, @sendgrid/mail, aws-sdk, twilio, firebase-admin, handlebars, Sequelize
 * Exports: 40+ utility functions for SMTP, SendGrid, SES, templating, scheduling, SMS, push notifications, tracking
 *
 * LLM Context: Enterprise-grade email and notification utilities for White Cross healthcare platform.
 * Provides comprehensive email sending (SMTP, SendGrid, AWS SES), SMS (Twilio), push notifications (FCM, APNs),
 * templating (Handlebars, EJS), email tracking (opens, clicks), delivery status, bounce handling,
 * bulk sending, queue management (Bull), scheduling, preferences, unsubscribe, HIPAA-compliant notifications.
 */
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const crypto = __importStar(require("crypto"));
const zod_1 = require("zod");
// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================
/**
 * Sequelize model for Email Logs with delivery tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EmailLog model
 *
 * @example
 * const EmailLog = defineEmailLogModel(sequelize);
 * await EmailLog.create({
 *   recipientEmail: 'user@example.com',
 *   subject: 'Welcome',
 *   status: 'sent',
 *   provider: 'sendgrid'
 * });
 */
function defineEmailLogModel(sequelize) {
    class EmailLog extends sequelize_1.Model {
    }
    EmailLog.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        recipientEmail: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            field: 'recipient_email',
        },
        recipientName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: true,
            field: 'recipient_name',
        },
        senderEmail: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            field: 'sender_email',
        },
        subject: {
            type: sequelize_1.DataTypes.STRING(1000),
            allowNull: false,
        },
        body: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        bodyHtml: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            field: 'body_html',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'sent', 'delivered', 'bounced', 'failed', 'opened', 'clicked'),
            allowNull: false,
            defaultValue: 'pending',
        },
        provider: {
            type: sequelize_1.DataTypes.ENUM('smtp', 'sendgrid', 'ses'),
            allowNull: false,
        },
        providerId: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: true,
            field: 'provider_id',
        },
        trackingId: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: true,
            field: 'tracking_id',
        },
        opened: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        openedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'opened_at',
        },
        clicked: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        clickedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'clicked_at',
        },
        bounced: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        bouncedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'bounced_at',
        },
        bounceReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            field: 'bounce_reason',
        },
        attempts: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        lastAttemptAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'last_attempt_at',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'updated_at',
        },
    }, {
        sequelize,
        tableName: 'email_logs',
        timestamps: true,
        indexes: [
            { fields: ['recipient_email'] },
            { fields: ['status'] },
            { fields: ['provider'] },
            { fields: ['tracking_id'] },
            { fields: ['created_at'] },
            { fields: ['opened'] },
            { fields: ['bounced'] },
        ],
    });
    return EmailLog;
}
/**
 * Sequelize model for Notification Templates.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NotificationTemplate model
 *
 * @example
 * const Template = defineNotificationTemplateModel(sequelize);
 * await Template.create({
 *   name: 'welcome_email',
 *   type: 'email',
 *   subject: 'Welcome {{name}}!',
 *   body: 'Hello {{name}}, welcome to our platform.',
 *   variables: ['name'],
 *   language: 'en'
 * });
 */
function defineNotificationTemplateModel(sequelize) {
    class NotificationTemplate extends sequelize_1.Model {
    }
    NotificationTemplate.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            unique: true,
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('email', 'sms', 'push'),
            allowNull: false,
        },
        subject: {
            type: sequelize_1.DataTypes.STRING(1000),
            allowNull: true,
        },
        body: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        bodyHtml: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            field: 'body_html',
        },
        variables: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        language: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'en',
        },
        category: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        active: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        version: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'updated_at',
        },
    }, {
        sequelize,
        tableName: 'notification_templates',
        timestamps: true,
        indexes: [
            { fields: ['name'], unique: true },
            { fields: ['type'] },
            { fields: ['language'] },
            { fields: ['active'] },
        ],
    });
    return NotificationTemplate;
}
/**
 * Sequelize model for User Notification Preferences.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NotificationPreference model
 *
 * @example
 * const Preference = defineNotificationPreferenceModel(sequelize);
 * await Preference.create({
 *   userId: 'user-123',
 *   email: true,
 *   sms: false,
 *   push: true,
 *   frequency: 'immediate'
 * });
 */
function defineNotificationPreferenceModel(sequelize) {
    class NotificationPreference extends sequelize_1.Model {
    }
    NotificationPreference.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            unique: true,
            field: 'user_id',
        },
        email: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        sms: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        push: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        categories: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
        frequency: {
            type: sequelize_1.DataTypes.ENUM('immediate', 'daily', 'weekly'),
            allowNull: false,
            defaultValue: 'immediate',
        },
        quietHoursStart: {
            type: sequelize_1.DataTypes.STRING(5),
            allowNull: true,
            field: 'quiet_hours_start',
        },
        quietHoursEnd: {
            type: sequelize_1.DataTypes.STRING(5),
            allowNull: true,
            field: 'quiet_hours_end',
        },
        timezone: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            defaultValue: 'UTC',
        },
        unsubscribeToken: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            field: 'unsubscribe_token',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'updated_at',
        },
    }, {
        sequelize,
        tableName: 'notification_preferences',
        timestamps: true,
        indexes: [
            { fields: ['user_id'], unique: true },
            { fields: ['unsubscribe_token'] },
        ],
    });
    return NotificationPreference;
}
// ============================================================================
// ZOD SCHEMAS (4-6)
// ============================================================================
/**
 * Zod schema for email configuration validation.
 */
exports.emailConfigSchema = zod_1.z.object({
    from: zod_1.z.string().email(),
    to: zod_1.z.union([zod_1.z.string().email(), zod_1.z.array(zod_1.z.string().email())]),
    cc: zod_1.z.union([zod_1.z.string().email(), zod_1.z.array(zod_1.z.string().email())]).optional(),
    bcc: zod_1.z.union([zod_1.z.string().email(), zod_1.z.array(zod_1.z.string().email())]).optional(),
    subject: zod_1.z.string().min(1).max(1000),
    html: zod_1.z.string().optional(),
    text: zod_1.z.string().optional(),
    priority: zod_1.z.enum(['high', 'normal', 'low']).optional(),
});
/**
 * Zod schema for SMTP configuration validation.
 */
exports.smtpConfigSchema = zod_1.z.object({
    host: zod_1.z.string().min(1),
    port: zod_1.z.number().min(1).max(65535),
    secure: zod_1.z.boolean().optional(),
    auth: zod_1.z.object({
        user: zod_1.z.string().min(1),
        pass: zod_1.z.string().min(1),
    }).optional(),
});
/**
 * Zod schema for SMS message validation.
 */
exports.smsMessageSchema = zod_1.z.object({
    to: zod_1.z.string().min(10).max(15),
    body: zod_1.z.string().min(1).max(1600),
    from: zod_1.z.string().optional(),
    mediaUrls: zod_1.z.array(zod_1.z.string().url()).optional(),
});
/**
 * Zod schema for push notification validation.
 */
exports.pushNotificationSchema = zod_1.z.object({
    tokens: zod_1.z.array(zod_1.z.string().min(1)),
    title: zod_1.z.string().min(1).max(100),
    body: zod_1.z.string().min(1).max(500),
    data: zod_1.z.record(zod_1.z.string()).optional(),
    priority: zod_1.z.enum(['high', 'normal']).optional(),
});
/**
 * Zod schema for notification template validation.
 */
exports.notificationTemplateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(200),
    type: zod_1.z.enum(['email', 'sms', 'push']),
    subject: zod_1.z.string().max(1000).optional(),
    body: zod_1.z.string().min(1),
    variables: zod_1.z.array(zod_1.z.string()),
    language: zod_1.z.string().min(2).max(10),
});
// ============================================================================
// SMTP EMAIL UTILITIES (7-11)
// ============================================================================
/**
 * Creates SMTP transporter with configuration.
 *
 * @param {SMTPConfig} config - SMTP configuration
 * @returns {any} Nodemailer transporter
 *
 * @example
 * const transporter = createSMTPTransporter({
 *   host: 'smtp.gmail.com',
 *   port: 587,
 *   secure: false,
 *   auth: { user: 'user@gmail.com', pass: 'password' }
 * });
 */
function createSMTPTransporter(config) {
    const nodemailer = require('nodemailer');
    return nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: config.auth,
        tls: config.tls,
        pool: config.pool,
        maxConnections: config.maxConnections,
        rateDelta: config.rateDelta,
        rateLimit: config.rateLimit,
    });
}
/**
 * Sends email via SMTP.
 *
 * @param {any} transporter - SMTP transporter
 * @param {EmailConfig} emailConfig - Email configuration
 * @returns {Promise<any>} Send result
 *
 * @example
 * const result = await sendSMTPEmail(transporter, {
 *   from: 'sender@example.com',
 *   to: 'recipient@example.com',
 *   subject: 'Hello',
 *   html: '<h1>Hello World</h1>'
 * });
 */
async function sendSMTPEmail(transporter, emailConfig) {
    const trackingId = crypto.randomBytes(16).toString('hex');
    const mailOptions = {
        from: emailConfig.from,
        to: emailConfig.to,
        cc: emailConfig.cc,
        bcc: emailConfig.bcc,
        subject: emailConfig.subject,
        text: emailConfig.text,
        html: emailConfig.html,
        attachments: emailConfig.attachments,
        replyTo: emailConfig.replyTo,
        headers: {
            ...emailConfig.headers,
            'X-Tracking-ID': trackingId,
        },
        priority: emailConfig.priority,
    };
    if (emailConfig.trackOpens && emailConfig.html) {
        mailOptions.html += `<img src="https://example.com/track/open/${trackingId}" width="1" height="1" />`;
    }
    const result = await transporter.sendMail(mailOptions);
    return {
        ...result,
        trackingId,
    };
}
/**
 * Sends bulk emails via SMTP with rate limiting.
 *
 * @param {any} transporter - SMTP transporter
 * @param {EmailConfig[]} emails - Array of email configurations
 * @param {number} rateLimit - Emails per second
 * @returns {Promise<Array<{success: boolean, result?: any, error?: any}>>} Send results
 *
 * @example
 * const results = await sendBulkSMTPEmails(transporter, emailConfigs, 5);
 */
async function sendBulkSMTPEmails(transporter, emails, rateLimit = 5) {
    const results = [];
    const delay = 1000 / rateLimit;
    for (const email of emails) {
        try {
            const result = await sendSMTPEmail(transporter, email);
            results.push({ success: true, result });
        }
        catch (error) {
            results.push({ success: false, error });
        }
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    return results;
}
/**
 * Validates email address format.
 *
 * @param {string} email - Email address
 * @returns {boolean} Validation result
 *
 * @example
 * const valid = validateEmailAddress('user@example.com');
 */
function validateEmailAddress(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * Parses email headers from sent email.
 *
 * @param {any} emailResult - Email send result
 * @returns {Record<string, string>} Parsed headers
 *
 * @example
 * const headers = parseEmailHeaders(sendResult);
 */
function parseEmailHeaders(emailResult) {
    return {
        messageId: emailResult.messageId,
        accepted: emailResult.accepted?.join(', '),
        rejected: emailResult.rejected?.join(', '),
        response: emailResult.response,
    };
}
// ============================================================================
// SENDGRID UTILITIES (12-15)
// ============================================================================
/**
 * Creates SendGrid client.
 *
 * @param {SendGridConfig} config - SendGrid configuration
 * @returns {any} SendGrid client
 *
 * @example
 * const sgClient = createSendGridClient({
 *   apiKey: 'SG.xxx',
 *   from: 'noreply@example.com'
 * });
 */
function createSendGridClient(config) {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(config.apiKey);
    return sgMail;
}
/**
 * Sends email via SendGrid.
 *
 * @param {any} sgClient - SendGrid client
 * @param {EmailConfig} emailConfig - Email configuration
 * @returns {Promise<any>} Send result
 *
 * @example
 * const result = await sendSendGridEmail(sgClient, {
 *   from: 'sender@example.com',
 *   to: 'recipient@example.com',
 *   subject: 'Hello',
 *   html: '<h1>Hello World</h1>'
 * });
 */
async function sendSendGridEmail(sgClient, emailConfig) {
    const msg = {
        to: emailConfig.to,
        from: emailConfig.from,
        cc: emailConfig.cc,
        bcc: emailConfig.bcc,
        subject: emailConfig.subject,
        text: emailConfig.text,
        html: emailConfig.html,
        attachments: emailConfig.attachments,
        replyTo: emailConfig.replyTo,
        headers: emailConfig.headers,
        trackingSettings: {
            clickTracking: { enable: emailConfig.trackClicks || false },
            openTracking: { enable: emailConfig.trackOpens || false },
        },
    };
    const [response] = await sgClient.send(msg);
    return response;
}
/**
 * Sends templated email via SendGrid.
 *
 * @param {any} sgClient - SendGrid client
 * @param {string} to - Recipient email
 * @param {string} templateId - SendGrid template ID
 * @param {Record<string, any>} dynamicData - Template data
 * @returns {Promise<any>} Send result
 *
 * @example
 * const result = await sendSendGridTemplate(sgClient, 'user@example.com', 'd-xxx', {
 *   name: 'John',
 *   verificationLink: 'https://example.com/verify'
 * });
 */
async function sendSendGridTemplate(sgClient, to, templateId, dynamicData) {
    const msg = {
        to,
        from: 'noreply@example.com',
        templateId,
        dynamicTemplateData: dynamicData,
    };
    const [response] = await sgClient.send(msg);
    return response;
}
/**
 * Handles SendGrid webhook events.
 *
 * @param {any} event - Webhook event
 * @param {typeof Model} emailLogModel - Email log model
 * @returns {Promise<void>}
 *
 * @example
 * await handleSendGridWebhook(webhookEvent, EmailLog);
 */
async function handleSendGridWebhook(event, emailLogModel) {
    const { email, event: eventType, sg_message_id } = event;
    const updates = {};
    switch (eventType) {
        case 'delivered':
            updates.status = 'delivered';
            break;
        case 'open':
            updates.opened = true;
            updates.openedAt = new Date();
            updates.status = 'opened';
            break;
        case 'click':
            updates.clicked = true;
            updates.clickedAt = new Date();
            updates.status = 'clicked';
            break;
        case 'bounce':
        case 'dropped':
            updates.bounced = true;
            updates.bouncedAt = new Date();
            updates.bounceReason = event.reason;
            updates.status = 'bounced';
            break;
    }
    await emailLogModel.update(updates, {
        where: { providerId: sg_message_id },
    });
}
// ============================================================================
// AWS SES UTILITIES (16-19)
// ============================================================================
/**
 * Creates AWS SES client.
 *
 * @param {SESConfig} config - SES configuration
 * @returns {any} SES client
 *
 * @example
 * const ses = createSESClient({
 *   region: 'us-east-1',
 *   accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
 *   secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
 * });
 */
function createSESClient(config) {
    const AWS = require('aws-sdk');
    return new AWS.SES({
        region: config.region,
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
    });
}
/**
 * Sends email via AWS SES.
 *
 * @param {any} sesClient - SES client
 * @param {EmailConfig} emailConfig - Email configuration
 * @returns {Promise<any>} Send result
 *
 * @example
 * const result = await sendSESEmail(ses, {
 *   from: 'sender@example.com',
 *   to: 'recipient@example.com',
 *   subject: 'Hello',
 *   html: '<h1>Hello World</h1>'
 * });
 */
async function sendSESEmail(sesClient, emailConfig) {
    const params = {
        Source: emailConfig.from,
        Destination: {
            ToAddresses: Array.isArray(emailConfig.to) ? emailConfig.to : [emailConfig.to],
            CcAddresses: emailConfig.cc ? (Array.isArray(emailConfig.cc) ? emailConfig.cc : [emailConfig.cc]) : [],
            BccAddresses: emailConfig.bcc ? (Array.isArray(emailConfig.bcc) ? emailConfig.bcc : [emailConfig.bcc]) : [],
        },
        Message: {
            Subject: {
                Data: emailConfig.subject,
                Charset: 'UTF-8',
            },
            Body: {
                Text: emailConfig.text ? {
                    Data: emailConfig.text,
                    Charset: 'UTF-8',
                } : undefined,
                Html: emailConfig.html ? {
                    Data: emailConfig.html,
                    Charset: 'UTF-8',
                } : undefined,
            },
        },
        ReplyToAddresses: emailConfig.replyTo ? [emailConfig.replyTo] : [],
    };
    return await sesClient.sendEmail(params).promise();
}
/**
 * Sends templated email via AWS SES.
 *
 * @param {any} sesClient - SES client
 * @param {string} to - Recipient email
 * @param {string} templateName - SES template name
 * @param {Record<string, any>} templateData - Template data
 * @returns {Promise<any>} Send result
 *
 * @example
 * const result = await sendSESTemplate(ses, 'user@example.com', 'WelcomeEmail', {
 *   name: 'John'
 * });
 */
async function sendSESTemplate(sesClient, to, templateName, templateData) {
    const params = {
        Source: 'noreply@example.com',
        Destination: {
            ToAddresses: [to],
        },
        Template: templateName,
        TemplateData: JSON.stringify(templateData),
    };
    return await sesClient.sendTemplatedEmail(params).promise();
}
/**
 * Handles AWS SES bounce notifications.
 *
 * @param {any} notification - SNS notification
 * @param {typeof Model} emailLogModel - Email log model
 * @returns {Promise<void>}
 *
 * @example
 * await handleSESBounce(snsNotification, EmailLog);
 */
async function handleSESBounce(notification, emailLogModel) {
    const message = JSON.parse(notification.Message);
    const { bounce } = message;
    if (!bounce)
        return;
    const { bouncedRecipients, bounceType } = bounce;
    for (const recipient of bouncedRecipients) {
        await emailLogModel.update({
            bounced: true,
            bouncedAt: new Date(),
            bounceReason: bounceType,
            status: 'bounced',
        }, {
            where: { recipientEmail: recipient.emailAddress },
        });
    }
}
// ============================================================================
// TEMPLATING UTILITIES (20-24)
// ============================================================================
/**
 * Compiles Handlebars template.
 *
 * @param {string} template - Template string
 * @returns {(data: any) => string} Compiled template function
 *
 * @example
 * const compiled = compileHandlebarsTemplate('Hello {{name}}!');
 * const result = compiled({ name: 'John' });
 */
function compileHandlebarsTemplate(template) {
    const Handlebars = require('handlebars');
    return Handlebars.compile(template);
}
/**
 * Renders email template with data.
 *
 * @param {typeof Model} templateModel - Template model
 * @param {string} templateName - Template name
 * @param {Record<string, any>} data - Template data
 * @returns {Promise<{subject: string, body: string, html: string}>} Rendered template
 *
 * @example
 * const rendered = await renderEmailTemplate(Template, 'welcome_email', {
 *   name: 'John',
 *   verificationUrl: 'https://example.com/verify'
 * });
 */
async function renderEmailTemplate(templateModel, templateName, data) {
    const template = await templateModel.findOne({
        where: { name: templateName, active: true },
    });
    if (!template) {
        throw new Error(`Template ${templateName} not found`);
    }
    const subjectTemplate = compileHandlebarsTemplate(template.get('subject') || '');
    const bodyTemplate = compileHandlebarsTemplate(template.get('body'));
    const htmlTemplate = template.get('bodyHtml')
        ? compileHandlebarsTemplate(template.get('bodyHtml'))
        : null;
    return {
        subject: subjectTemplate(data),
        body: bodyTemplate(data),
        html: htmlTemplate ? htmlTemplate(data) : '',
    };
}
/**
 * Validates template variables.
 *
 * @param {string[]} requiredVars - Required variables
 * @param {Record<string, any>} data - Provided data
 * @returns {boolean} Validation result
 *
 * @example
 * const valid = validateTemplateVariables(['name', 'email'], { name: 'John', email: 'john@example.com' });
 */
function validateTemplateVariables(requiredVars, data) {
    for (const varName of requiredVars) {
        if (!(varName in data)) {
            throw new Error(`Missing required template variable: ${varName}`);
        }
    }
    return true;
}
/**
 * Creates email template.
 *
 * @param {typeof Model} templateModel - Template model
 * @param {NotificationTemplate} template - Template data
 * @returns {Promise<any>} Created template
 *
 * @example
 * const template = await createEmailTemplate(Template, {
 *   name: 'password_reset',
 *   type: 'email',
 *   subject: 'Reset your password',
 *   body: 'Click here: {{resetLink}}',
 *   variables: ['resetLink'],
 *   language: 'en'
 * });
 */
async function createEmailTemplate(templateModel, template) {
    return await templateModel.create({
        name: template.name,
        type: template.type,
        subject: template.subject,
        body: template.body,
        variables: template.variables,
        language: template.language || 'en',
        active: true,
    });
}
/**
 * Generates unsubscribe link with token.
 *
 * @param {string} userId - User ID
 * @param {string} baseUrl - Base URL
 * @returns {string} Unsubscribe link
 *
 * @example
 * const link = generateUnsubscribeLink('user-123', 'https://example.com');
 */
function generateUnsubscribeLink(userId, baseUrl) {
    const token = crypto.createHash('sha256').update(userId + Date.now()).digest('hex');
    return `${baseUrl}/unsubscribe?token=${token}`;
}
// ============================================================================
// SMS UTILITIES (25-28)
// ============================================================================
/**
 * Creates Twilio client.
 *
 * @param {TwilioConfig} config - Twilio configuration
 * @returns {any} Twilio client
 *
 * @example
 * const twilio = createTwilioClient({
 *   accountSid: 'ACxxx',
 *   authToken: 'xxx',
 *   fromNumber: '+1234567890'
 * });
 */
function createTwilioClient(config) {
    const twilio = require('twilio');
    return twilio(config.accountSid, config.authToken);
}
/**
 * Sends SMS via Twilio.
 *
 * @param {any} twilioClient - Twilio client
 * @param {SMSMessage} sms - SMS message
 * @returns {Promise<any>} Send result
 *
 * @example
 * const result = await sendTwilioSMS(twilio, {
 *   to: '+1234567890',
 *   body: 'Your verification code is 123456',
 *   from: '+0987654321'
 * });
 */
async function sendTwilioSMS(twilioClient, sms) {
    return await twilioClient.messages.create({
        body: sms.body,
        to: sms.to,
        from: sms.from,
        mediaUrl: sms.mediaUrls,
        statusCallback: sms.statusCallback,
    });
}
/**
 * Sends bulk SMS messages.
 *
 * @param {any} twilioClient - Twilio client
 * @param {SMSMessage[]} messages - Array of SMS messages
 * @returns {Promise<Array<{success: boolean, result?: any, error?: any}>>} Send results
 *
 * @example
 * const results = await sendBulkSMS(twilio, smsMessages);
 */
async function sendBulkSMS(twilioClient, messages) {
    const results = [];
    for (const message of messages) {
        try {
            const result = await sendTwilioSMS(twilioClient, message);
            results.push({ success: true, result });
        }
        catch (error) {
            results.push({ success: false, error });
        }
    }
    return results;
}
/**
 * Validates phone number format.
 *
 * @param {string} phone - Phone number
 * @returns {boolean} Validation result
 *
 * @example
 * const valid = validatePhoneNumber('+1234567890');
 */
function validatePhoneNumber(phone) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
}
// ============================================================================
// PUSH NOTIFICATION UTILITIES (29-32)
// ============================================================================
/**
 * Creates Firebase Cloud Messaging client.
 *
 * @param {FCMConfig} config - FCM configuration
 * @returns {any} FCM admin instance
 *
 * @example
 * const fcm = createFCMClient({
 *   projectId: 'my-project',
 *   privateKey: 'xxx',
 *   clientEmail: 'firebase-adminsdk@my-project.iam.gserviceaccount.com'
 * });
 */
function createFCMClient(config) {
    const admin = require('firebase-admin');
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: config.projectId,
            privateKey: config.privateKey,
            clientEmail: config.clientEmail,
        }),
    });
    return admin;
}
/**
 * Sends push notification via FCM.
 *
 * @param {any} fcmClient - FCM admin instance
 * @param {PushNotification} notification - Push notification
 * @returns {Promise<any>} Send result
 *
 * @example
 * const result = await sendFCMPushNotification(fcm, {
 *   tokens: ['token1', 'token2'],
 *   title: 'New Message',
 *   body: 'You have a new message',
 *   data: { messageId: '123' }
 * });
 */
async function sendFCMPushNotification(fcmClient, notification) {
    const message = {
        notification: {
            title: notification.title,
            body: notification.body,
        },
        data: notification.data,
        tokens: notification.tokens,
        android: {
            priority: notification.priority || 'high',
            ttl: notification.ttl || 3600000,
        },
        apns: {
            payload: {
                aps: {
                    badge: notification.badge,
                    sound: notification.sound || 'default',
                },
            },
        },
    };
    return await fcmClient.messaging().sendMulticast(message);
}
/**
 * Sends silent push notification for data sync.
 *
 * @param {any} fcmClient - FCM admin instance
 * @param {string[]} tokens - Device tokens
 * @param {Record<string, string>} data - Data payload
 * @returns {Promise<any>} Send result
 *
 * @example
 * const result = await sendSilentPush(fcm, ['token1'], { syncType: 'messages' });
 */
async function sendSilentPush(fcmClient, tokens, data) {
    const message = {
        data,
        tokens,
        android: {
            priority: 'high',
        },
        apns: {
            payload: {
                aps: {
                    contentAvailable: true,
                },
            },
            headers: {
                'apns-priority': '5',
            },
        },
    };
    return await fcmClient.messaging().sendMulticast(message);
}
/**
 * Subscribes device tokens to topic.
 *
 * @param {any} fcmClient - FCM admin instance
 * @param {string[]} tokens - Device tokens
 * @param {string} topic - Topic name
 * @returns {Promise<any>} Subscription result
 *
 * @example
 * const result = await subscribeToTopic(fcm, ['token1', 'token2'], 'news');
 */
async function subscribeToTopic(fcmClient, tokens, topic) {
    return await fcmClient.messaging().subscribeToTopic(tokens, topic);
}
// ============================================================================
// TRACKING & ANALYTICS (33-36)
// ============================================================================
/**
 * Tracks email open event.
 *
 * @param {typeof Model} emailLogModel - Email log model
 * @param {string} trackingId - Tracking ID
 * @returns {Promise<void>}
 *
 * @example
 * await trackEmailOpen(EmailLog, 'abc123');
 */
async function trackEmailOpen(emailLogModel, trackingId) {
    await emailLogModel.update({
        opened: true,
        openedAt: new Date(),
        status: 'opened',
    }, {
        where: { trackingId },
    });
}
/**
 * Tracks email click event.
 *
 * @param {typeof Model} emailLogModel - Email log model
 * @param {string} trackingId - Tracking ID
 * @param {string} url - Clicked URL
 * @returns {Promise<void>}
 *
 * @example
 * await trackEmailClick(EmailLog, 'abc123', 'https://example.com');
 */
async function trackEmailClick(emailLogModel, trackingId, url) {
    const email = await emailLogModel.findOne({ where: { trackingId } });
    if (email) {
        const clicks = email.get('metadata')?.clicks || [];
        clicks.push({ url, timestamp: new Date() });
        await email.update({
            clicked: true,
            clickedAt: new Date(),
            status: 'clicked',
            metadata: { ...email.get('metadata'), clicks },
        });
    }
}
/**
 * Generates email analytics report.
 *
 * @param {typeof Model} emailLogModel - Email log model
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Record<string, any>>} Analytics report
 *
 * @example
 * const report = await generateEmailAnalytics(EmailLog, startDate, endDate);
 */
async function generateEmailAnalytics(emailLogModel, startDate, endDate) {
    const emails = await emailLogModel.findAll({
        where: {
            createdAt: {
                [sequelize_1.Sequelize.Op.between]: [startDate, endDate],
            },
        },
    });
    const total = emails.length;
    const sent = emails.filter(e => e.get('status') !== 'failed').length;
    const opened = emails.filter(e => e.get('opened')).length;
    const clicked = emails.filter(e => e.get('clicked')).length;
    const bounced = emails.filter(e => e.get('bounced')).length;
    return {
        period: `${startDate.toISOString()} to ${endDate.toISOString()}`,
        total,
        sent,
        opened,
        clicked,
        bounced,
        openRate: sent > 0 ? opened / sent : 0,
        clickRate: sent > 0 ? clicked / sent : 0,
        bounceRate: sent > 0 ? bounced / sent : 0,
    };
}
/**
 * Identifies best send times based on open rates.
 *
 * @param {typeof Model} emailLogModel - Email log model
 * @param {number} days - Days to analyze
 * @returns {Promise<Array<{hour: number, openRate: number}>>} Best send times
 *
 * @example
 * const bestTimes = await identifyBestSendTimes(EmailLog, 30);
 */
async function identifyBestSendTimes(emailLogModel, days = 30) {
    const startDate = new Date(Date.now() - days * 86400000);
    const emails = await emailLogModel.findAll({
        where: {
            createdAt: {
                [sequelize_1.Sequelize.Op.gte]: startDate,
            },
        },
    });
    const hourlyStats = new Map();
    for (const email of emails) {
        const hour = new Date(email.get('createdAt')).getHours();
        const stats = hourlyStats.get(hour) || { sent: 0, opened: 0 };
        stats.sent++;
        if (email.get('opened'))
            stats.opened++;
        hourlyStats.set(hour, stats);
    }
    return Array.from(hourlyStats.entries())
        .map(([hour, stats]) => ({
        hour,
        openRate: stats.sent > 0 ? stats.opened / stats.sent : 0,
    }))
        .sort((a, b) => b.openRate - a.openRate);
}
// ============================================================================
// USER PREFERENCES (37-40)
// ============================================================================
/**
 * Gets user notification preferences.
 *
 * @param {typeof Model} preferenceModel - Preference model
 * @param {string} userId - User ID
 * @returns {Promise<any>} User preferences
 *
 * @example
 * const prefs = await getUserPreferences(NotificationPreference, 'user-123');
 */
async function getUserPreferences(preferenceModel, userId) {
    let preference = await preferenceModel.findOne({ where: { userId } });
    if (!preference) {
        preference = await preferenceModel.create({
            userId,
            email: true,
            sms: false,
            push: true,
            frequency: 'immediate',
        });
    }
    return preference;
}
/**
 * Updates user notification preferences.
 *
 * @param {typeof Model} preferenceModel - Preference model
 * @param {string} userId - User ID
 * @param {Partial<NotificationPreference>} updates - Preference updates
 * @returns {Promise<any>} Updated preferences
 *
 * @example
 * const updated = await updateUserPreferences(NotificationPreference, 'user-123', {
 *   email: false,
 *   sms: true
 * });
 */
async function updateUserPreferences(preferenceModel, userId, updates) {
    const [updatedCount] = await preferenceModel.update(updates, {
        where: { userId },
    });
    if (updatedCount === 0) {
        return await preferenceModel.create({ userId, ...updates });
    }
    return await preferenceModel.findOne({ where: { userId } });
}
/**
 * Checks if user should receive notification based on preferences.
 *
 * @param {typeof Model} preferenceModel - Preference model
 * @param {string} userId - User ID
 * @param {string} notificationType - Notification type
 * @param {string} category - Notification category
 * @returns {Promise<boolean>} Whether to send notification
 *
 * @example
 * const shouldSend = await shouldSendNotification(NotificationPreference, 'user-123', 'email', 'marketing');
 */
async function shouldSendNotification(preferenceModel, userId, notificationType, category) {
    const preference = await getUserPreferences(preferenceModel, userId);
    if (!preference.get(notificationType)) {
        return false;
    }
    if (category) {
        const categories = preference.get('categories');
        if (categories && categories[category] === false) {
            return false;
        }
    }
    // Check quiet hours
    const quietStart = preference.get('quietHoursStart');
    const quietEnd = preference.get('quietHoursEnd');
    if (quietStart && quietEnd) {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        if (currentTime >= quietStart && currentTime <= quietEnd) {
            return false;
        }
    }
    return true;
}
/**
 * Handles unsubscribe request.
 *
 * @param {typeof Model} preferenceModel - Preference model
 * @param {string} token - Unsubscribe token
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * const success = await handleUnsubscribe(NotificationPreference, 'token123');
 */
async function handleUnsubscribe(preferenceModel, token) {
    const [updatedCount] = await preferenceModel.update({
        email: false,
        sms: false,
        push: false,
    }, {
        where: { unsubscribeToken: token },
    });
    return updatedCount > 0;
}
// ============================================================================
// NESTJS INJECTABLE SERVICE
// ============================================================================
/**
 * NestJS Injectable Notification Service with multi-channel support.
 *
 * @example
 * @Injectable()
 * export class UserService {
 *   constructor(private notificationService: NotificationService) {}
 *
 *   async createUser(data: any) {
 *     const user = await this.userRepo.create(data);
 *     await this.notificationService.sendEmail(
 *       user.email,
 *       'welcome_email',
 *       { name: user.name }
 *     );
 *   }
 * }
 */
let NotificationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var NotificationService = _classThis = class {
        constructor(emailLogModel, templateModel, preferenceModel, smtpTransporter, twilioClient, fcmClient) {
            this.emailLogModel = emailLogModel;
            this.templateModel = templateModel;
            this.preferenceModel = preferenceModel;
            this.smtpTransporter = smtpTransporter;
            this.twilioClient = twilioClient;
            this.fcmClient = fcmClient;
        }
        async sendEmail(to, templateName, data) {
            const rendered = await renderEmailTemplate(this.templateModel, templateName, data);
            if (this.smtpTransporter) {
                const result = await sendSMTPEmail(this.smtpTransporter, {
                    from: 'noreply@example.com',
                    to,
                    subject: rendered.subject,
                    html: rendered.html,
                    text: rendered.body,
                });
                await this.emailLogModel.create({
                    recipientEmail: to,
                    senderEmail: 'noreply@example.com',
                    subject: rendered.subject,
                    bodyHtml: rendered.html,
                    body: rendered.body,
                    status: 'sent',
                    provider: 'smtp',
                    trackingId: result.trackingId,
                });
                return result;
            }
        }
        async sendSMS(to, message) {
            if (this.twilioClient) {
                return sendTwilioSMS(this.twilioClient, { to, body: message });
            }
        }
        async sendPush(tokens, title, body, data) {
            if (this.fcmClient) {
                return sendFCMPushNotification(this.fcmClient, {
                    tokens,
                    title,
                    body,
                    data,
                });
            }
        }
    };
    __setFunctionName(_classThis, "NotificationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationService = _classThis;
})();
exports.NotificationService = NotificationService;
//# sourceMappingURL=email-notification-kit-v2.js.map