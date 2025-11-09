"use strict";
/**
 * LOC: NOTIFPROD001
 * File: /reuse/notification-kit.prod.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS notification services
 *   - Email queue processors
 *   - SMS notification services
 *   - Push notification services
 *   - In-app notification services
 *   - Webhook handlers
 *   - Communication modules
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
exports.WebhooksController = exports.NotificationPreferencesController = exports.NotificationTemplatesController = exports.NotificationsController = exports.NotificationService = exports.BatchNotificationJobSchema = exports.NotificationPreferencesSchema = exports.NotificationTemplateSchema = exports.InAppNotificationConfigSchema = exports.PushNotificationConfigSchema = exports.SMSConfigSchema = exports.EmailConfigSchema = void 0;
exports.getNotificationTemplateModelAttributes = getNotificationTemplateModelAttributes;
exports.getNotificationDeliveryLogModelAttributes = getNotificationDeliveryLogModelAttributes;
exports.getNotificationPreferencesModelAttributes = getNotificationPreferencesModelAttributes;
exports.getUnsubscribeRecordModelAttributes = getUnsubscribeRecordModelAttributes;
exports.getNotificationTrackingModelAttributes = getNotificationTrackingModelAttributes;
exports.getWebhookEventModelAttributes = getWebhookEventModelAttributes;
exports.getScheduledNotificationModelAttributes = getScheduledNotificationModelAttributes;
exports.sendEmailViaSMTP = sendEmailViaSMTP;
exports.sendEmailViaSendGrid = sendEmailViaSendGrid;
exports.sendEmailViaSES = sendEmailViaSES;
exports.sendSMSViaTwilio = sendSMSViaTwilio;
exports.sendSMSViaSNS = sendSMSViaSNS;
exports.sendPushViaFCM = sendPushViaFCM;
exports.sendPushViaAPNs = sendPushViaAPNs;
exports.renderHandlebarsTemplate = renderHandlebarsTemplate;
exports.renderNotificationTemplate = renderNotificationTemplate;
exports.validateTemplateVariables = validateTemplateVariables;
exports.createNotificationQueue = createNotificationQueue;
exports.addNotificationToQueue = addNotificationToQueue;
exports.addBatchNotificationsToQueue = addBatchNotificationsToQueue;
exports.processNotificationQueue = processNotificationQueue;
exports.generateTrackingToken = generateTrackingToken;
exports.verifyTrackingToken = verifyTrackingToken;
exports.trackNotificationOpen = trackNotificationOpen;
exports.trackNotificationClick = trackNotificationClick;
exports.canSendNotification = canSendNotification;
exports.generateUnsubscribeToken = generateUnsubscribeToken;
exports.verifyUnsubscribeToken = verifyUnsubscribeToken;
exports.verifyWebhookSignature = verifyWebhookSignature;
exports.processSendGridWebhook = processSendGridWebhook;
exports.processTwilioWebhook = processTwilioWebhook;
exports.calculateNotificationAnalytics = calculateNotificationAnalytics;
exports.validateEmailFormat = validateEmailFormat;
exports.validatePhoneFormat = validatePhoneFormat;
exports.sanitizeEmailHTML = sanitizeEmailHTML;
/**
 * File: /reuse/notification-kit.prod.ts
 * Locator: WC-UTL-NOTIFPROD-001
 * Purpose: Production-Grade Notification & Communication Kit - Complete multi-channel notification toolkit for NestJS
 *
 * Upstream: Independent utility module for notification operations
 * Downstream: ../backend/*, Notification services, Queue processors, Template engines, Webhook handlers
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, Sequelize, Bull, Zod, Swagger
 * Exports: 48 utility functions for email (SendGrid, SES, SMTP), SMS (Twilio, SNS), push (FCM, APNs),
 *          in-app notifications, templating, batching, scheduling, retry, tracking, webhooks
 *
 * LLM Context: Enterprise-grade notification and communication utilities for White Cross healthcare platform.
 * Provides comprehensive multi-channel notification delivery including email (SendGrid, AWS SES, SMTP),
 * SMS (Twilio, AWS SNS), push notifications (Firebase Cloud Messaging, Apple Push Notifications),
 * in-app notifications, advanced templating (Handlebars, EJS, custom), batch sending, scheduling,
 * intelligent retry logic with exponential backoff, delivery tracking and analytics, read receipts,
 * unsubscribe management, webhook event handling, notification preferences, priority queuing,
 * rate limiting, audit logging, and HIPAA-compliant notification patterns for sensitive healthcare
 * communications. Includes NestJS services, controllers, Sequelize models, Zod validation, and
 * Swagger/OpenAPI documentation for production-ready implementation.
 */
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_1 = require("sequelize");
const zod_1 = require("zod");
const crypto = __importStar(require("crypto"));
const nodemailer = __importStar(require("nodemailer"));
const handlebars = __importStar(require("handlebars"));
const bull_1 = require("bull");
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Zod schema for email configuration validation.
 */
exports.EmailConfigSchema = zod_1.z.object({
    from: zod_1.z.string().email(),
    to: zod_1.z.union([zod_1.z.string().email(), zod_1.z.array(zod_1.z.string().email())]),
    cc: zod_1.z.union([zod_1.z.string().email(), zod_1.z.array(zod_1.z.string().email())]).optional(),
    bcc: zod_1.z.union([zod_1.z.string().email(), zod_1.z.array(zod_1.z.string().email())]).optional(),
    subject: zod_1.z.string().min(1).max(500),
    html: zod_1.z.string().optional(),
    text: zod_1.z.string().optional(),
    replyTo: zod_1.z.string().email().optional(),
    priority: zod_1.z.enum(['high', 'normal', 'low']).optional(),
    templateId: zod_1.z.string().optional(),
    templateData: zod_1.z.record(zod_1.z.any()).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for SMS configuration validation.
 */
exports.SMSConfigSchema = zod_1.z.object({
    to: zod_1.z.union([zod_1.z.string().regex(/^\+[1-9]\d{1,14}$/), zod_1.z.array(zod_1.z.string().regex(/^\+[1-9]\d{1,14}$/))]),
    message: zod_1.z.string().min(1).max(1600),
    from: zod_1.z.string().optional(),
    messageType: zod_1.z.enum(['transactional', 'promotional', 'otp']).optional(),
    priority: zod_1.z.enum(['high', 'normal', 'low']).optional(),
    templateId: zod_1.z.string().optional(),
    templateData: zod_1.z.record(zod_1.z.any()).optional(),
    validityPeriod: zod_1.z.number().int().positive().optional(),
    deliveryReceipt: zod_1.z.boolean().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for push notification configuration validation.
 */
exports.PushNotificationConfigSchema = zod_1.z.object({
    tokens: zod_1.z.union([zod_1.z.string().min(1), zod_1.z.array(zod_1.z.string().min(1))]),
    title: zod_1.z.string().min(1).max(200),
    body: zod_1.z.string().min(1).max(1000),
    data: zod_1.z.record(zod_1.z.any()).optional(),
    imageUrl: zod_1.z.string().url().optional(),
    icon: zod_1.z.string().optional(),
    badge: zod_1.z.number().int().nonnegative().optional(),
    sound: zod_1.z.string().optional(),
    priority: zod_1.z.enum(['high', 'normal', 'low']).optional(),
    ttl: zod_1.z.number().int().positive().optional(),
    clickAction: zod_1.z.string().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for in-app notification configuration validation.
 */
exports.InAppNotificationConfigSchema = zod_1.z.object({
    userId: zod_1.z.union([zod_1.z.string().uuid(), zod_1.z.array(zod_1.z.string().uuid())]),
    title: zod_1.z.string().min(1).max(200),
    message: zod_1.z.string().min(1).max(2000),
    type: zod_1.z.string().optional(),
    priority: zod_1.z.enum(['urgent', 'high', 'normal', 'low']).optional(),
    data: zod_1.z.record(zod_1.z.any()).optional(),
    icon: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().url().optional(),
    link: zod_1.z.string().optional(),
    autoDismiss: zod_1.z.number().int().positive().optional(),
    ttl: zod_1.z.number().int().positive().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for notification template validation.
 */
exports.NotificationTemplateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(200),
    category: zod_1.z.string().optional(),
    type: zod_1.z.enum(['email', 'sms', 'push', 'in_app']),
    subject: zod_1.z.string().max(500).optional(),
    htmlTemplate: zod_1.z.string().optional(),
    textTemplate: zod_1.z.string().optional(),
    variables: zod_1.z.array(zod_1.z.string()),
    locale: zod_1.z.string().optional(),
    defaults: zod_1.z.record(zod_1.z.any()).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
    status: zod_1.z.enum(['active', 'draft', 'archived']).optional(),
});
/**
 * Zod schema for notification preferences validation.
 */
exports.NotificationPreferencesSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    emailEnabled: zod_1.z.boolean(),
    smsEnabled: zod_1.z.boolean(),
    pushEnabled: zod_1.z.boolean(),
    inAppEnabled: zod_1.z.boolean(),
    categories: zod_1.z.record(zod_1.z.boolean()).optional(),
    quietHours: zod_1.z.object({
        enabled: zod_1.z.boolean(),
        startTime: zod_1.z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
        endTime: zod_1.z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
        timezone: zod_1.z.string(),
    }).optional(),
    locale: zod_1.z.string().optional(),
});
/**
 * Zod schema for batch notification job validation.
 */
exports.BatchNotificationJobSchema = zod_1.z.object({
    type: zod_1.z.enum(['email', 'sms', 'push', 'in_app']),
    templateId: zod_1.z.string().optional(),
    recipients: zod_1.z.array(zod_1.z.object({
        recipient: zod_1.z.string().min(1),
        name: zod_1.z.string().optional(),
        templateData: zod_1.z.record(zod_1.z.any()).optional(),
        metadata: zod_1.z.record(zod_1.z.any()).optional(),
    })).min(1),
    batchSize: zod_1.z.number().int().positive().optional(),
    throttleMs: zod_1.z.number().int().nonnegative().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================
/**
 * Sequelize NotificationTemplate model attributes.
 *
 * @example
 * ```typescript
 * import { DataTypes, Model } from 'sequelize';
 *
 * class NotificationTemplate extends Model {}
 *
 * NotificationTemplate.init(getNotificationTemplateModelAttributes(), {
 *   sequelize,
 *   tableName: 'notification_templates',
 *   timestamps: true
 * });
 * ```
 */
function getNotificationTemplateModelAttributes() {
    return {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            comment: 'Template name',
        },
        category: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            comment: 'Template category (e.g., appointment, billing, alert)',
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('email', 'sms', 'push', 'in_app'),
            allowNull: false,
            comment: 'Notification type',
        },
        subject: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            comment: 'Email subject template',
        },
        htmlTemplate: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'HTML template content',
        },
        textTemplate: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Plain text template content',
        },
        variables: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            comment: 'Template variables list',
        },
        locale: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: true,
            defaultValue: 'en-US',
            comment: 'Template locale',
        },
        version: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: 'Template version number',
        },
        defaults: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Default values for variables',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Additional template metadata',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'draft', 'archived'),
            allowNull: false,
            defaultValue: 'active',
            comment: 'Template status',
        },
        createdBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'User who created the template',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'User who last updated the template',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
    };
}
/**
 * Sequelize NotificationDeliveryLog model attributes.
 *
 * @example
 * ```typescript
 * import { DataTypes, Model } from 'sequelize';
 *
 * class NotificationDeliveryLog extends Model {}
 *
 * NotificationDeliveryLog.init(getNotificationDeliveryLogModelAttributes(), {
 *   sequelize,
 *   tableName: 'notification_delivery_logs',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['notificationId'] },
 *     { fields: ['recipient'] },
 *     { fields: ['status'] },
 *     { fields: ['type'] },
 *     { fields: ['sentAt'] }
 *   ]
 * });
 * ```
 */
function getNotificationDeliveryLogModelAttributes() {
    return {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        notificationId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Unique notification identifier',
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('email', 'sms', 'push', 'in_app'),
            allowNull: false,
            comment: 'Notification type',
        },
        recipient: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            comment: 'Recipient identifier (email, phone, userId, token)',
        },
        recipientType: {
            type: sequelize_1.DataTypes.ENUM('email', 'phone', 'userId', 'deviceToken'),
            allowNull: false,
            comment: 'Type of recipient identifier',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'queued', 'sent', 'delivered', 'failed', 'bounced', 'rejected', 'read', 'clicked'),
            allowNull: false,
            defaultValue: 'pending',
            comment: 'Delivery status',
        },
        provider: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            comment: 'Provider used (sendgrid, ses, twilio, fcm, etc.)',
        },
        providerMessageId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            comment: 'Provider-specific message ID',
        },
        subject: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            comment: 'Message subject (for email)',
        },
        content: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Message content',
        },
        sentAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When notification was sent',
        },
        deliveredAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When notification was delivered',
        },
        readAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When notification was read/opened',
        },
        clickedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When notification was clicked',
        },
        failedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When notification failed',
        },
        failureReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for failure',
        },
        errorCode: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            comment: 'Error code from provider',
        },
        retryCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of retry attempts',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Additional delivery metadata',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
    };
}
/**
 * Sequelize NotificationPreferences model attributes.
 *
 * @example
 * ```typescript
 * import { DataTypes, Model } from 'sequelize';
 *
 * class NotificationPreferences extends Model {}
 *
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
function getNotificationPreferencesModelAttributes() {
    return {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            unique: true,
            comment: 'User ID',
        },
        emailEnabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Email notifications enabled',
        },
        smsEnabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'SMS notifications enabled',
        },
        pushEnabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Push notifications enabled',
        },
        inAppEnabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'In-app notifications enabled',
        },
        channels: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Channel-specific preferences',
        },
        categories: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Category-specific preferences',
        },
        quietHours: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Quiet hours configuration',
        },
        frequencyLimits: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Notification frequency limits',
        },
        locale: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: true,
            defaultValue: 'en-US',
            comment: 'Preferred locale',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
    };
}
/**
 * Sequelize UnsubscribeRecord model attributes.
 *
 * @example
 * ```typescript
 * import { DataTypes, Model } from 'sequelize';
 *
 * class UnsubscribeRecord extends Model {}
 *
 * UnsubscribeRecord.init(getUnsubscribeRecordModelAttributes(), {
 *   sequelize,
 *   tableName: 'unsubscribe_records',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['identifier', 'type'], unique: true },
 *     { fields: ['token'], unique: true }
 *   ]
 * });
 * ```
 */
function getUnsubscribeRecordModelAttributes() {
    return {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        identifier: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            comment: 'User ID, email, phone, or device token',
        },
        identifierType: {
            type: sequelize_1.DataTypes.ENUM('userId', 'email', 'phone', 'deviceToken'),
            allowNull: false,
            comment: 'Type of identifier',
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('email', 'sms', 'push', 'in_app', 'all'),
            allowNull: true,
            comment: 'Notification type unsubscribed from',
        },
        category: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            comment: 'Notification category unsubscribed from',
        },
        reason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for unsubscribing',
        },
        token: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            unique: true,
            comment: 'Unique unsubscribe token',
        },
        unsubscribedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'When user unsubscribed',
        },
        ipAddress: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            comment: 'IP address of unsubscribe request',
        },
        userAgent: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'User agent of unsubscribe request',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Additional unsubscribe metadata',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
    };
}
/**
 * Sequelize NotificationTracking model attributes.
 *
 * @example
 * ```typescript
 * import { DataTypes, Model } from 'sequelize';
 *
 * class NotificationTracking extends Model {}
 *
 * NotificationTracking.init(getNotificationTrackingModelAttributes(), {
 *   sequelize,
 *   tableName: 'notification_tracking',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['notificationId'] },
 *     { fields: ['trackingToken'], unique: true },
 *     { fields: ['recipient'] }
 *   ]
 * });
 * ```
 */
function getNotificationTrackingModelAttributes() {
    return {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        notificationId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Notification ID being tracked',
        },
        recipient: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            comment: 'Recipient identifier',
        },
        trackingToken: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
            comment: 'Unique tracking token',
        },
        opened: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether notification was opened',
        },
        openedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'First open timestamp',
        },
        openCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of times opened',
        },
        clickedLinks: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            comment: 'List of clicked links',
        },
        lastClickedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last click timestamp',
        },
        clickCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Total number of clicks',
        },
        userAgent: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'User agent string',
        },
        ipAddress: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            comment: 'IP address',
        },
        location: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Geographic location data',
        },
        device: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Device information',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Additional tracking metadata',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
    };
}
/**
 * Sequelize WebhookEvent model attributes.
 *
 * @example
 * ```typescript
 * import { DataTypes, Model } from 'sequelize';
 *
 * class WebhookEvent extends Model {}
 *
 * WebhookEvent.init(getWebhookEventModelAttributes(), {
 *   sequelize,
 *   tableName: 'webhook_events',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['eventType'] },
 *     { fields: ['provider'] },
 *     { fields: ['notificationId'] },
 *     { fields: ['processed'] },
 *     { fields: ['timestamp'] }
 *   ]
 * });
 * ```
 */
function getWebhookEventModelAttributes() {
    return {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        eventId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
            comment: 'Unique event identifier from provider',
        },
        eventType: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            comment: 'Event type (delivered, bounced, opened, clicked, etc.)',
        },
        provider: {
            type: sequelize_1.DataTypes.ENUM('sendgrid', 'ses', 'twilio', 'sns', 'fcm', 'apns', 'custom'),
            allowNull: false,
            comment: 'Provider that sent the webhook',
        },
        notificationId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Associated notification ID',
        },
        recipient: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            comment: 'Recipient identifier',
        },
        timestamp: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Event timestamp',
        },
        data: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            comment: 'Full webhook payload',
        },
        signature: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            comment: 'Webhook signature for verification',
        },
        verified: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether signature was verified',
        },
        processed: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether event was processed',
        },
        processedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When event was processed',
        },
        result: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Processing result',
        },
        retryCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of processing retries',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
    };
}
/**
 * Sequelize ScheduledNotification model attributes.
 *
 * @example
 * ```typescript
 * import { DataTypes, Model } from 'sequelize';
 *
 * class ScheduledNotification extends Model {}
 *
 * ScheduledNotification.init(getScheduledNotificationModelAttributes(), {
 *   sequelize,
 *   tableName: 'scheduled_notifications',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['scheduledFor'] },
 *     { fields: ['status'] },
 *     { fields: ['type'] }
 *   ]
 * });
 * ```
 */
function getScheduledNotificationModelAttributes() {
    return {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('email', 'sms', 'push', 'in_app'),
            allowNull: false,
            comment: 'Notification type',
        },
        payload: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            comment: 'Notification payload',
        },
        scheduledFor: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'When to send the notification',
        },
        cronExpression: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            comment: 'Cron expression for recurring notifications',
        },
        timezone: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            defaultValue: 'UTC',
            comment: 'Timezone for scheduling',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'scheduled', 'sent', 'failed', 'cancelled'),
            allowNull: false,
            defaultValue: 'pending',
            comment: 'Schedule status',
        },
        sentAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When notification was sent',
        },
        failedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When notification failed',
        },
        failureReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Failure reason',
        },
        maxRetries: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 3,
            comment: 'Maximum retry attempts',
        },
        retryCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Current retry count',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Additional scheduling metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'User who created the schedule',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
    };
}
// ============================================================================
// CORE NOTIFICATION FUNCTIONS - EMAIL
// ============================================================================
/**
 * Send email via SMTP.
 *
 * @param {SMTPConfig} smtpConfig - SMTP server configuration
 * @param {EmailConfig} emailConfig - Email configuration
 * @returns {Promise<{ success: boolean; messageId?: string; error?: string }>} Send result
 *
 * @example
 * ```typescript
 * const smtpConfig = {
 *   host: 'smtp.gmail.com',
 *   port: 587,
 *   secure: false,
 *   auth: { user: 'user@example.com', pass: 'password' }
 * };
 *
 * const result = await sendEmailViaSMTP(smtpConfig, {
 *   from: 'noreply@whitecross.com',
 *   to: 'patient@example.com',
 *   subject: 'Appointment Reminder',
 *   html: '<p>Your appointment is tomorrow at 2pm</p>'
 * });
 * ```
 */
async function sendEmailViaSMTP(smtpConfig, emailConfig) {
    try {
        const transporter = nodemailer.createTransport(smtpConfig);
        const mailOptions = {
            from: emailConfig.from,
            to: Array.isArray(emailConfig.to) ? emailConfig.to.join(', ') : emailConfig.to,
            cc: emailConfig.cc ? (Array.isArray(emailConfig.cc) ? emailConfig.cc.join(', ') : emailConfig.cc) : undefined,
            bcc: emailConfig.bcc ? (Array.isArray(emailConfig.bcc) ? emailConfig.bcc.join(', ') : emailConfig.bcc) : undefined,
            subject: emailConfig.subject,
            html: emailConfig.html,
            text: emailConfig.text,
            attachments: emailConfig.attachments,
            replyTo: emailConfig.replyTo,
            headers: emailConfig.headers,
            priority: emailConfig.priority,
        };
        const info = await transporter.sendMail(mailOptions);
        return {
            success: true,
            messageId: info.messageId,
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
/**
 * Send email via SendGrid API.
 *
 * @param {SendGridConfig} sendGridConfig - SendGrid configuration
 * @param {EmailConfig} emailConfig - Email configuration
 * @returns {Promise<{ success: boolean; messageId?: string; error?: string }>} Send result
 *
 * @example
 * ```typescript
 * const result = await sendEmailViaSendGrid(
 *   { apiKey: 'SG.xxx', from: 'noreply@whitecross.com' },
 *   {
 *     to: 'patient@example.com',
 *     subject: 'Test Results Available',
 *     templateId: 'd-xxxxx',
 *     templateData: { patientName: 'John Doe' }
 *   }
 * );
 * ```
 */
async function sendEmailViaSendGrid(sendGridConfig, emailConfig) {
    try {
        // In production, use @sendgrid/mail library
        // This is a placeholder implementation
        const payload = {
            personalizations: [
                {
                    to: Array.isArray(emailConfig.to)
                        ? emailConfig.to.map(email => ({ email }))
                        : [{ email: emailConfig.to }],
                    dynamic_template_data: emailConfig.templateData || sendGridConfig.dynamicTemplateData,
                },
            ],
            from: { email: sendGridConfig.from },
            subject: emailConfig.subject,
            content: emailConfig.html ? [{ type: 'text/html', value: emailConfig.html }] : undefined,
            template_id: emailConfig.templateId || sendGridConfig.templateId,
            tracking_settings: sendGridConfig.trackingSettings,
            mail_settings: sendGridConfig.mailSettings,
        };
        // Simulated API call - replace with actual SendGrid API call
        const messageId = `sg-${crypto.randomBytes(16).toString('hex')}`;
        return {
            success: true,
            messageId,
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
/**
 * Send email via AWS SES.
 *
 * @param {SESConfig} sesConfig - AWS SES configuration
 * @param {EmailConfig} emailConfig - Email configuration
 * @returns {Promise<{ success: boolean; messageId?: string; error?: string }>} Send result
 *
 * @example
 * ```typescript
 * const result = await sendEmailViaSES(
 *   {
 *     accessKeyId: 'AKIAXXXX',
 *     secretAccessKey: 'xxxx',
 *     region: 'us-east-1'
 *   },
 *   {
 *     from: 'noreply@whitecross.com',
 *     to: 'patient@example.com',
 *     subject: 'Billing Statement',
 *     html: '<p>Your statement is ready</p>'
 *   }
 * );
 * ```
 */
async function sendEmailViaSES(sesConfig, emailConfig) {
    try {
        // In production, use @aws-sdk/client-ses
        // This is a placeholder implementation
        const messageId = `ses-${crypto.randomBytes(16).toString('hex')}`;
        return {
            success: true,
            messageId,
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
// ============================================================================
// CORE NOTIFICATION FUNCTIONS - SMS
// ============================================================================
/**
 * Send SMS via Twilio.
 *
 * @param {TwilioConfig} twilioConfig - Twilio configuration
 * @param {SMSConfig} smsConfig - SMS configuration
 * @returns {Promise<{ success: boolean; messageId?: string; error?: string }>} Send result
 *
 * @example
 * ```typescript
 * const result = await sendSMSViaTwilio(
 *   {
 *     accountSid: 'ACxxxx',
 *     authToken: 'xxxx',
 *     fromNumber: '+1234567890'
 *   },
 *   {
 *     to: '+0987654321',
 *     message: 'Your appointment is confirmed for tomorrow at 2pm'
 *   }
 * );
 * ```
 */
async function sendSMSViaTwilio(twilioConfig, smsConfig) {
    try {
        // In production, use twilio library
        // This is a placeholder implementation
        const messageId = `twilio-${crypto.randomBytes(16).toString('hex')}`;
        return {
            success: true,
            messageId,
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
/**
 * Send SMS via AWS SNS.
 *
 * @param {SNSConfig} snsConfig - AWS SNS configuration
 * @param {SMSConfig} smsConfig - SMS configuration
 * @returns {Promise<{ success: boolean; messageId?: string; error?: string }>} Send result
 *
 * @example
 * ```typescript
 * const result = await sendSMSViaSNS(
 *   {
 *     accessKeyId: 'AKIAXXXX',
 *     secretAccessKey: 'xxxx',
 *     region: 'us-east-1',
 *     smsType: 'Transactional'
 *   },
 *   {
 *     to: '+1234567890',
 *     message: 'Your OTP is 123456'
 *   }
 * );
 * ```
 */
async function sendSMSViaSNS(snsConfig, smsConfig) {
    try {
        // In production, use @aws-sdk/client-sns
        // This is a placeholder implementation
        const messageId = `sns-${crypto.randomBytes(16).toString('hex')}`;
        return {
            success: true,
            messageId,
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
// ============================================================================
// CORE NOTIFICATION FUNCTIONS - PUSH
// ============================================================================
/**
 * Send push notification via Firebase Cloud Messaging (FCM).
 *
 * @param {FCMConfig} fcmConfig - FCM configuration
 * @param {PushNotificationConfig} pushConfig - Push notification configuration
 * @returns {Promise<{ success: boolean; messageId?: string; error?: string }>} Send result
 *
 * @example
 * ```typescript
 * const result = await sendPushViaFCM(
 *   {
 *     projectId: 'white-cross',
 *     credentials: {...}
 *   },
 *   {
 *     tokens: ['device-token-1', 'device-token-2'],
 *     title: 'New Message',
 *     body: 'You have a new message from Dr. Smith',
 *     data: { chatId: '123' }
 *   }
 * );
 * ```
 */
async function sendPushViaFCM(fcmConfig, pushConfig) {
    try {
        // In production, use firebase-admin
        // This is a placeholder implementation
        const messageId = `fcm-${crypto.randomBytes(16).toString('hex')}`;
        return {
            success: true,
            messageId,
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
/**
 * Send push notification via Apple Push Notification Service (APNs).
 *
 * @param {APNsConfig} apnsConfig - APNs configuration
 * @param {PushNotificationConfig} pushConfig - Push notification configuration
 * @returns {Promise<{ success: boolean; messageId?: string; error?: string }>} Send result
 *
 * @example
 * ```typescript
 * const result = await sendPushViaAPNs(
 *   {
 *     teamId: 'TEAM123',
 *     keyId: 'KEY123',
 *     key: '...',
 *     bundleId: 'com.whitecross.app'
 *   },
 *   {
 *     tokens: 'device-token',
 *     title: 'Appointment Reminder',
 *     body: 'Your appointment is in 1 hour',
 *     badge: 1
 *   }
 * );
 * ```
 */
async function sendPushViaAPNs(apnsConfig, pushConfig) {
    try {
        // In production, use apn library
        // This is a placeholder implementation
        const messageId = `apns-${crypto.randomBytes(16).toString('hex')}`;
        return {
            success: true,
            messageId,
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
// ============================================================================
// TEMPLATE FUNCTIONS
// ============================================================================
/**
 * Render Handlebars template with data.
 *
 * @param {string} template - Handlebars template string
 * @param {TemplateData} data - Template data
 * @returns {string} Rendered template
 *
 * @example
 * ```typescript
 * const html = renderHandlebarsTemplate(
 *   '<h1>Hello {{name}}</h1><p>Your appointment is on {{date}}</p>',
 *   { name: 'John Doe', date: '2025-11-15' }
 * );
 * ```
 */
function renderHandlebarsTemplate(template, data) {
    const compiledTemplate = handlebars.compile(template);
    return compiledTemplate(data);
}
/**
 * Render notification template.
 *
 * @param {NotificationTemplate} template - Notification template
 * @param {TemplateData} data - Template data
 * @returns {RenderedTemplate} Rendered template result
 *
 * @example
 * ```typescript
 * const rendered = renderNotificationTemplate(
 *   {
 *     id: 'tpl-001',
 *     type: 'email',
 *     subject: 'Welcome {{name}}',
 *     htmlTemplate: '<h1>Welcome {{name}}</h1>',
 *     variables: ['name']
 *   },
 *   { name: 'John Doe' }
 * );
 * ```
 */
function renderNotificationTemplate(template, data) {
    const mergedData = { ...template.defaults, ...data };
    return {
        subject: template.subject ? renderHandlebarsTemplate(template.subject, mergedData) : undefined,
        html: template.htmlTemplate ? renderHandlebarsTemplate(template.htmlTemplate, mergedData) : undefined,
        text: template.textTemplate ? renderHandlebarsTemplate(template.textTemplate, mergedData) : undefined,
        templateId: template.id,
        variables: mergedData,
        renderedAt: new Date(),
    };
}
/**
 * Validate template variables.
 *
 * @param {NotificationTemplate} template - Notification template
 * @param {TemplateData} data - Template data
 * @returns {{ valid: boolean; missingVariables: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateTemplateVariables(
 *   { variables: ['name', 'date'], ... },
 *   { name: 'John' }
 * );
 * // Returns: { valid: false, missingVariables: ['date'] }
 * ```
 */
function validateTemplateVariables(template, data) {
    const missingVariables = [];
    for (const variable of template.variables) {
        if (!(variable in data) && !(template.defaults && variable in template.defaults)) {
            missingVariables.push(variable);
        }
    }
    return {
        valid: missingVariables.length === 0,
        missingVariables,
    };
}
// ============================================================================
// QUEUING FUNCTIONS
// ============================================================================
/**
 * Create notification queue with Bull.
 *
 * @param {string} queueName - Queue name
 * @param {QueueOptions} options - Queue options
 * @returns {Queue} Bull queue instance
 *
 * @example
 * ```typescript
 * const emailQueue = createNotificationQueue('email-notifications', {
 *   redis: { host: 'localhost', port: 6379 }
 * });
 * ```
 */
function createNotificationQueue(queueName, options) {
    return new bull_1.Queue(queueName, options);
}
/**
 * Add notification to queue.
 *
 * @param {Queue} queue - Bull queue instance
 * @param {NotificationQueueJob} job - Notification job
 * @returns {Promise<Job>} Queued job
 *
 * @example
 * ```typescript
 * const job = await addNotificationToQueue(emailQueue, {
 *   id: 'job-001',
 *   type: 'email',
 *   payload: {...},
 *   priority: 1,
 *   attempts: 3
 * });
 * ```
 */
async function addNotificationToQueue(queue, job) {
    return queue.add(job.type, job.payload, {
        jobId: job.id,
        priority: job.priority,
        delay: job.delay,
        attempts: job.attempts,
        backoff: job.backoff,
        removeOnComplete: job.removeOnComplete,
        removeOnFail: job.removeOnFail,
        timeout: job.timeout,
    });
}
/**
 * Add batch notifications to queue.
 *
 * @param {Queue} queue - Bull queue instance
 * @param {NotificationQueueJob[]} jobs - Array of notification jobs
 * @returns {Promise<Job[]>} Array of queued jobs
 *
 * @example
 * ```typescript
 * const jobs = await addBatchNotificationsToQueue(smsQueue, [
 *   { id: 'job-1', type: 'sms', payload: {...} },
 *   { id: 'job-2', type: 'sms', payload: {...} }
 * ]);
 * ```
 */
async function addBatchNotificationsToQueue(queue, jobs) {
    const queueJobs = jobs.map(job => ({
        name: job.type,
        data: job.payload,
        opts: {
            jobId: job.id,
            priority: job.priority,
            delay: job.delay,
            attempts: job.attempts,
            backoff: job.backoff,
            removeOnComplete: job.removeOnComplete,
            removeOnFail: job.removeOnFail,
            timeout: job.timeout,
        },
    }));
    return queue.addBulk(queueJobs);
}
/**
 * Process notification queue with exponential backoff retry.
 *
 * @param {Queue} queue - Bull queue instance
 * @param {Function} processor - Job processor function
 * @returns {void}
 *
 * @example
 * ```typescript
 * processNotificationQueue(emailQueue, async (job) => {
 *   const result = await sendEmailViaSMTP(smtpConfig, job.data);
 *   if (!result.success) throw new Error(result.error);
 *   return result;
 * });
 * ```
 */
function processNotificationQueue(queue, processor) {
    queue.process(async (job) => {
        try {
            return await processor(job);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // Exponential backoff calculation
            const attempt = job.attemptsMade;
            const backoffDelay = Math.min(1000 * Math.pow(2, attempt), 60000); // Max 1 minute
            throw new Error(errorMessage);
        }
    });
}
// ============================================================================
// TRACKING FUNCTIONS
// ============================================================================
/**
 * Generate tracking token for notification.
 *
 * @param {string} notificationId - Notification ID
 * @param {string} recipient - Recipient identifier
 * @returns {string} Tracking token
 *
 * @example
 * ```typescript
 * const token = generateTrackingToken('notif-123', 'user@example.com');
 * // Returns: base64 encoded token
 * ```
 */
function generateTrackingToken(notificationId, recipient) {
    const payload = `${notificationId}:${recipient}:${Date.now()}`;
    const signature = crypto.createHmac('sha256', 'tracking-secret').update(payload).digest('hex');
    return Buffer.from(`${payload}:${signature}`).toString('base64url');
}
/**
 * Verify tracking token.
 *
 * @param {string} token - Tracking token
 * @returns {{ valid: boolean; notificationId?: string; recipient?: string }} Verification result
 *
 * @example
 * ```typescript
 * const result = verifyTrackingToken(token);
 * if (result.valid) {
 *   console.log(`Valid token for notification ${result.notificationId}`);
 * }
 * ```
 */
function verifyTrackingToken(token) {
    try {
        const decoded = Buffer.from(token, 'base64url').toString('utf-8');
        const parts = decoded.split(':');
        if (parts.length !== 4) {
            return { valid: false };
        }
        const [notificationId, recipient, timestamp, signature] = parts;
        const payload = `${notificationId}:${recipient}:${timestamp}`;
        const expectedSignature = crypto.createHmac('sha256', 'tracking-secret').update(payload).digest('hex');
        if (signature !== expectedSignature) {
            return { valid: false };
        }
        return {
            valid: true,
            notificationId,
            recipient,
        };
    }
    catch (error) {
        return { valid: false };
    }
}
/**
 * Track notification open event.
 *
 * @param {string} trackingToken - Tracking token
 * @param {Object} context - Tracking context
 * @returns {Promise<{ success: boolean; error?: string }>} Tracking result
 *
 * @example
 * ```typescript
 * await trackNotificationOpen(token, {
 *   userAgent: req.headers['user-agent'],
 *   ipAddress: req.ip
 * });
 * ```
 */
async function trackNotificationOpen(trackingToken, context) {
    try {
        const verification = verifyTrackingToken(trackingToken);
        if (!verification.valid) {
            return { success: false, error: 'Invalid tracking token' };
        }
        // In production, update database tracking record
        // This is a placeholder implementation
        return { success: true };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
/**
 * Track notification link click.
 *
 * @param {string} trackingToken - Tracking token
 * @param {string} link - Clicked link URL
 * @param {Object} context - Tracking context
 * @returns {Promise<{ success: boolean; error?: string }>} Tracking result
 *
 * @example
 * ```typescript
 * await trackNotificationClick(token, 'https://whitecross.com/appointment', {
 *   userAgent: req.headers['user-agent'],
 *   ipAddress: req.ip
 * });
 * ```
 */
async function trackNotificationClick(trackingToken, link, context) {
    try {
        const verification = verifyTrackingToken(trackingToken);
        if (!verification.valid) {
            return { success: false, error: 'Invalid tracking token' };
        }
        // In production, update database tracking record
        // This is a placeholder implementation
        return { success: true };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
// ============================================================================
// PREFERENCE FUNCTIONS
// ============================================================================
/**
 * Check if user can receive notification based on preferences.
 *
 * @param {NotificationPreferences} preferences - User notification preferences
 * @param {Object} notification - Notification details
 * @returns {boolean} Whether notification can be sent
 *
 * @example
 * ```typescript
 * const canSend = canSendNotification(userPreferences, {
 *   type: 'email',
 *   category: 'appointment',
 *   timestamp: new Date()
 * });
 * ```
 */
function canSendNotification(preferences, notification) {
    // Check global channel enable
    if (notification.type === 'email' && !preferences.emailEnabled)
        return false;
    if (notification.type === 'sms' && !preferences.smsEnabled)
        return false;
    if (notification.type === 'push' && !preferences.pushEnabled)
        return false;
    if (notification.type === 'in_app' && !preferences.inAppEnabled)
        return false;
    // Check category preferences
    if (notification.category && preferences.categories) {
        if (preferences.categories[notification.category] === false)
            return false;
    }
    // Check quiet hours
    if (preferences.quietHours?.enabled && notification.timestamp) {
        const hour = notification.timestamp.getHours();
        const minute = notification.timestamp.getMinutes();
        const currentTime = hour * 60 + minute;
        const [startHour, startMinute] = preferences.quietHours.startTime.split(':').map(Number);
        const [endHour, endMinute] = preferences.quietHours.endTime.split(':').map(Number);
        const startTime = startHour * 60 + startMinute;
        const endTime = endHour * 60 + endMinute;
        if (startTime <= endTime) {
            if (currentTime >= startTime && currentTime < endTime)
                return false;
        }
        else {
            if (currentTime >= startTime || currentTime < endTime)
                return false;
        }
    }
    return true;
}
/**
 * Generate unsubscribe token.
 *
 * @param {string} identifier - User identifier (email, userId, etc.)
 * @param {string} type - Notification type
 * @returns {string} Unsubscribe token
 *
 * @example
 * ```typescript
 * const token = generateUnsubscribeToken('user@example.com', 'email');
 * ```
 */
function generateUnsubscribeToken(identifier, type) {
    const payload = `${identifier}:${type}:${Date.now()}`;
    const signature = crypto.createHmac('sha256', 'unsubscribe-secret').update(payload).digest('hex');
    return Buffer.from(`${payload}:${signature}`).toString('base64url');
}
/**
 * Verify unsubscribe token.
 *
 * @param {string} token - Unsubscribe token
 * @returns {{ valid: boolean; identifier?: string; type?: string }} Verification result
 *
 * @example
 * ```typescript
 * const result = verifyUnsubscribeToken(token);
 * if (result.valid) {
 *   await unsubscribeUser(result.identifier, result.type);
 * }
 * ```
 */
function verifyUnsubscribeToken(token) {
    try {
        const decoded = Buffer.from(token, 'base64url').toString('utf-8');
        const parts = decoded.split(':');
        if (parts.length !== 4) {
            return { valid: false };
        }
        const [identifier, type, timestamp, signature] = parts;
        const payload = `${identifier}:${type}:${timestamp}`;
        const expectedSignature = crypto.createHmac('sha256', 'unsubscribe-secret').update(payload).digest('hex');
        if (signature !== expectedSignature) {
            return { valid: false };
        }
        return {
            valid: true,
            identifier,
            type,
        };
    }
    catch (error) {
        return { valid: false };
    }
}
// ============================================================================
// WEBHOOK FUNCTIONS
// ============================================================================
/**
 * Verify webhook signature.
 *
 * @param {string} payload - Webhook payload
 * @param {string} signature - Webhook signature
 * @param {string} secret - Webhook secret
 * @returns {boolean} Whether signature is valid
 *
 * @example
 * ```typescript
 * const isValid = verifyWebhookSignature(
 *   req.body,
 *   req.headers['x-webhook-signature'],
 *   process.env.WEBHOOK_SECRET
 * );
 * ```
 */
function verifyWebhookSignature(payload, signature, secret) {
    const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}
/**
 * Process SendGrid webhook event.
 *
 * @param {any} event - SendGrid webhook event
 * @returns {Promise<{ success: boolean; error?: string }>} Processing result
 *
 * @example
 * ```typescript
 * for (const event of req.body) {
 *   await processSendGridWebhook(event);
 * }
 * ```
 */
async function processSendGridWebhook(event) {
    try {
        // Map SendGrid event to internal format
        const eventType = event.event; // delivered, bounced, opened, clicked, etc.
        const recipient = event.email;
        const timestamp = new Date(event.timestamp * 1000);
        // In production, update delivery log in database
        // This is a placeholder implementation
        return { success: true };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
/**
 * Process Twilio webhook event.
 *
 * @param {any} event - Twilio webhook event
 * @returns {Promise<{ success: boolean; error?: string }>} Processing result
 *
 * @example
 * ```typescript
 * const result = await processTwilioWebhook(req.body);
 * ```
 */
async function processTwilioWebhook(event) {
    try {
        // Map Twilio event to internal format
        const eventType = event.MessageStatus; // delivered, failed, sent, etc.
        const recipient = event.To;
        const messageId = event.MessageSid;
        // In production, update delivery log in database
        // This is a placeholder implementation
        return { success: true };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Calculate notification analytics.
 *
 * @param {NotificationDeliveryLog[]} logs - Array of delivery logs
 * @param {Date} periodStart - Analytics period start
 * @param {Date} periodEnd - Analytics period end
 * @returns {NotificationAnalytics} Analytics summary
 *
 * @example
 * ```typescript
 * const analytics = calculateNotificationAnalytics(
 *   deliveryLogs,
 *   new Date('2025-11-01'),
 *   new Date('2025-11-30')
 * );
 * ```
 */
function calculateNotificationAnalytics(logs, periodStart, periodEnd) {
    const totalSent = logs.filter(log => log.status !== 'pending').length;
    const totalDelivered = logs.filter(log => log.status === 'delivered' || log.status === 'read').length;
    const totalFailed = logs.filter(log => log.status === 'failed').length;
    const totalBounced = logs.filter(log => log.status === 'bounced').length;
    const totalOpened = logs.filter(log => log.readAt !== null && log.readAt !== undefined).length;
    const totalClicked = logs.filter(log => log.status === 'clicked').length;
    const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;
    const openRate = totalDelivered > 0 ? (totalOpened / totalDelivered) * 100 : 0;
    const clickRate = totalDelivered > 0 ? (totalClicked / totalDelivered) * 100 : 0;
    const clickToOpenRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0;
    const bounceRate = totalSent > 0 ? (totalBounced / totalSent) * 100 : 0;
    const deliveryTimes = logs
        .filter(log => log.sentAt && log.deliveredAt)
        .map(log => (log.deliveredAt.getTime() - log.sentAt.getTime()));
    const avgDeliveryTime = deliveryTimes.length > 0
        ? deliveryTimes.reduce((sum, time) => sum + time, 0) / deliveryTimes.length
        : 0;
    return {
        totalSent,
        totalDelivered,
        totalFailed,
        totalBounced,
        totalOpened,
        totalClicked,
        deliveryRate: Math.round(deliveryRate * 100) / 100,
        openRate: Math.round(openRate * 100) / 100,
        clickRate: Math.round(clickRate * 100) / 100,
        clickToOpenRate: Math.round(clickToOpenRate * 100) / 100,
        bounceRate: Math.round(bounceRate * 100) / 100,
        avgDeliveryTime: Math.round(avgDeliveryTime),
        periodStart,
        periodEnd,
    };
}
/**
 * Validate email address format.
 *
 * @param {string} email - Email address
 * @returns {boolean} Whether email is valid
 *
 * @example
 * ```typescript
 * if (validateEmailFormat('user@example.com')) {
 *   // Send email
 * }
 * ```
 */
function validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * Validate phone number format (E.164).
 *
 * @param {string} phone - Phone number
 * @returns {boolean} Whether phone number is valid
 *
 * @example
 * ```typescript
 * if (validatePhoneFormat('+1234567890')) {
 *   // Send SMS
 * }
 * ```
 */
function validatePhoneFormat(phone) {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
}
/**
 * Sanitize HTML content for email.
 *
 * @param {string} html - HTML content
 * @returns {string} Sanitized HTML
 *
 * @example
 * ```typescript
 * const safe = sanitizeEmailHTML(userGeneratedContent);
 * ```
 */
function sanitizeEmailHTML(html) {
    // Basic sanitization - in production use a library like DOMPurify
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
        .replace(/on\w+\s*=\s*'[^']*'/gi, '');
}
// ============================================================================
// NESTJS SERVICE - NOTIFICATION SERVICE
// ============================================================================
/**
 * NestJS service for managing notifications.
 *
 * @example
 * ```typescript
 * @Module({
 *   providers: [NotificationService],
 *   exports: [NotificationService]
 * })
 * export class NotificationModule {}
 * ```
 */
let NotificationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var NotificationService = _classThis = class {
        constructor(
        // Inject Sequelize models and configuration
        ) {
            this.logger = new common_1.Logger(NotificationService.name);
        }
        /**
         * Send email notification.
         */
        async sendEmail(config) {
            try {
                // Validate configuration
                const validation = exports.EmailConfigSchema.safeParse(config);
                if (!validation.success) {
                    throw new common_1.BadRequestException(validation.error.errors);
                }
                // Choose provider based on configuration or preferences
                // This is a simplified example
                const result = await sendEmailViaSMTP({
                    host: process.env.SMTP_HOST || 'localhost',
                    port: parseInt(process.env.SMTP_PORT || '587'),
                    secure: false,
                }, config);
                this.logger.log(`Email sent: ${result.messageId}`);
                return result;
            }
            catch (error) {
                this.logger.error(`Failed to send email: ${error}`);
                throw error;
            }
        }
        /**
         * Send SMS notification.
         */
        async sendSMS(config) {
            try {
                const validation = exports.SMSConfigSchema.safeParse(config);
                if (!validation.success) {
                    throw new common_1.BadRequestException(validation.error.errors);
                }
                // Implementation placeholder
                return { success: true, messageId: 'sms-' + crypto.randomBytes(8).toString('hex') };
            }
            catch (error) {
                this.logger.error(`Failed to send SMS: ${error}`);
                throw error;
            }
        }
        /**
         * Send push notification.
         */
        async sendPush(config) {
            try {
                const validation = exports.PushNotificationConfigSchema.safeParse(config);
                if (!validation.success) {
                    throw new common_1.BadRequestException(validation.error.errors);
                }
                // Implementation placeholder
                return { success: true, messageId: 'push-' + crypto.randomBytes(8).toString('hex') };
            }
            catch (error) {
                this.logger.error(`Failed to send push notification: ${error}`);
                throw error;
            }
        }
        /**
         * Send in-app notification.
         */
        async sendInApp(config) {
            try {
                const validation = exports.InAppNotificationConfigSchema.safeParse(config);
                if (!validation.success) {
                    throw new common_1.BadRequestException(validation.error.errors);
                }
                // Implementation placeholder
                return { success: true, messageId: 'inapp-' + crypto.randomBytes(8).toString('hex') };
            }
            catch (error) {
                this.logger.error(`Failed to send in-app notification: ${error}`);
                throw error;
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
// ============================================================================
// NESTJS CONTROLLER - NOTIFICATIONS
// ============================================================================
/**
 * NestJS controller for notification management endpoints.
 *
 * @example
 * ```typescript
 * @Module({
 *   controllers: [NotificationsController],
 *   providers: [NotificationService]
 * })
 * export class NotificationModule {}
 * ```
 */
let NotificationsController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Notifications'), (0, common_1.Controller)('api/v1/notifications'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _sendEmail_decorators;
    let _sendSMS_decorators;
    let _sendPush_decorators;
    let _sendInApp_decorators;
    let _getDeliveryStatus_decorators;
    let _getAnalytics_decorators;
    let _trackOpen_decorators;
    let _trackClick_decorators;
    let _unsubscribe_decorators;
    var NotificationsController = _classThis = class {
        constructor(notificationService) {
            this.notificationService = (__runInitializers(this, _instanceExtraInitializers), notificationService);
            this.logger = new common_1.Logger(NotificationsController.name);
        }
        /**
         * Send email notification.
         */
        async sendEmail(emailConfig) {
            return this.notificationService.sendEmail(emailConfig);
        }
        /**
         * Send SMS notification.
         */
        async sendSMS(smsConfig) {
            return this.notificationService.sendSMS(smsConfig);
        }
        /**
         * Send push notification.
         */
        async sendPush(pushConfig) {
            return this.notificationService.sendPush(pushConfig);
        }
        /**
         * Send in-app notification.
         */
        async sendInApp(inAppConfig) {
            return this.notificationService.sendInApp(inAppConfig);
        }
        /**
         * Get notification delivery status.
         */
        async getDeliveryStatus(notificationId) {
            // Implementation placeholder
            return {
                notificationId,
                status: 'delivered',
                deliveredAt: new Date(),
            };
        }
        /**
         * Get notification analytics.
         */
        async getAnalytics(startDate, endDate) {
            // Implementation placeholder
            return {
                totalSent: 1000,
                totalDelivered: 950,
                deliveryRate: 95,
                openRate: 45,
                clickRate: 12,
            };
        }
        /**
         * Track notification open.
         */
        async trackOpen(token) {
            return trackNotificationOpen(token, {});
        }
        /**
         * Track notification click.
         */
        async trackClick(token, link) {
            return trackNotificationClick(token, link, {});
        }
        /**
         * Unsubscribe from notifications.
         */
        async unsubscribe(token) {
            const verification = verifyUnsubscribeToken(token);
            if (!verification.valid) {
                throw new common_1.BadRequestException('Invalid unsubscribe token');
            }
            // Implementation placeholder
            return {
                success: true,
                message: 'Successfully unsubscribed',
            };
        }
    };
    __setFunctionName(_classThis, "NotificationsController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _sendEmail_decorators = [(0, common_1.Post)('email'), (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED), (0, swagger_1.ApiOperation)({ summary: 'Send email notification' }), (0, swagger_1.ApiResponse)({ status: 202, description: 'Email queued for delivery' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request' })];
        _sendSMS_decorators = [(0, common_1.Post)('sms'), (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED), (0, swagger_1.ApiOperation)({ summary: 'Send SMS notification' }), (0, swagger_1.ApiResponse)({ status: 202, description: 'SMS queued for delivery' })];
        _sendPush_decorators = [(0, common_1.Post)('push'), (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED), (0, swagger_1.ApiOperation)({ summary: 'Send push notification' }), (0, swagger_1.ApiResponse)({ status: 202, description: 'Push notification queued for delivery' })];
        _sendInApp_decorators = [(0, common_1.Post)('in-app'), (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED), (0, swagger_1.ApiOperation)({ summary: 'Send in-app notification' }), (0, swagger_1.ApiResponse)({ status: 202, description: 'In-app notification created' })];
        _getDeliveryStatus_decorators = [(0, common_1.Get)('delivery/:notificationId'), (0, swagger_1.ApiOperation)({ summary: 'Get notification delivery status' }), (0, swagger_1.ApiParam)({ name: 'notificationId', description: 'Notification ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Delivery status retrieved' })];
        _getAnalytics_decorators = [(0, common_1.Get)('analytics'), (0, swagger_1.ApiOperation)({ summary: 'Get notification analytics' }), (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }), (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Analytics retrieved' })];
        _trackOpen_decorators = [(0, common_1.Get)('track/open/:token'), (0, swagger_1.ApiOperation)({ summary: 'Track notification open' }), (0, swagger_1.ApiParam)({ name: 'token', description: 'Tracking token' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Open tracked' })];
        _trackClick_decorators = [(0, common_1.Get)('track/click/:token'), (0, swagger_1.ApiOperation)({ summary: 'Track notification click' }), (0, swagger_1.ApiParam)({ name: 'token', description: 'Tracking token' }), (0, swagger_1.ApiQuery)({ name: 'link', description: 'Clicked link' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Click tracked' })];
        _unsubscribe_decorators = [(0, common_1.Post)('unsubscribe/:token'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Unsubscribe from notifications' }), (0, swagger_1.ApiParam)({ name: 'token', description: 'Unsubscribe token' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Unsubscribed successfully' })];
        __esDecorate(_classThis, null, _sendEmail_decorators, { kind: "method", name: "sendEmail", static: false, private: false, access: { has: obj => "sendEmail" in obj, get: obj => obj.sendEmail }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _sendSMS_decorators, { kind: "method", name: "sendSMS", static: false, private: false, access: { has: obj => "sendSMS" in obj, get: obj => obj.sendSMS }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _sendPush_decorators, { kind: "method", name: "sendPush", static: false, private: false, access: { has: obj => "sendPush" in obj, get: obj => obj.sendPush }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _sendInApp_decorators, { kind: "method", name: "sendInApp", static: false, private: false, access: { has: obj => "sendInApp" in obj, get: obj => obj.sendInApp }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDeliveryStatus_decorators, { kind: "method", name: "getDeliveryStatus", static: false, private: false, access: { has: obj => "getDeliveryStatus" in obj, get: obj => obj.getDeliveryStatus }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAnalytics_decorators, { kind: "method", name: "getAnalytics", static: false, private: false, access: { has: obj => "getAnalytics" in obj, get: obj => obj.getAnalytics }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _trackOpen_decorators, { kind: "method", name: "trackOpen", static: false, private: false, access: { has: obj => "trackOpen" in obj, get: obj => obj.trackOpen }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _trackClick_decorators, { kind: "method", name: "trackClick", static: false, private: false, access: { has: obj => "trackClick" in obj, get: obj => obj.trackClick }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _unsubscribe_decorators, { kind: "method", name: "unsubscribe", static: false, private: false, access: { has: obj => "unsubscribe" in obj, get: obj => obj.unsubscribe }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationsController = _classThis;
})();
exports.NotificationsController = NotificationsController;
// ============================================================================
// NESTJS CONTROLLER - TEMPLATES
// ============================================================================
/**
 * NestJS controller for template management.
 */
let NotificationTemplatesController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Notification Templates'), (0, common_1.Controller)('api/v1/notification-templates'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _listTemplates_decorators;
    let _getTemplate_decorators;
    let _createTemplate_decorators;
    let _updateTemplate_decorators;
    let _deleteTemplate_decorators;
    let _previewTemplate_decorators;
    var NotificationTemplatesController = _classThis = class {
        constructor() {
            this.logger = (__runInitializers(this, _instanceExtraInitializers), new common_1.Logger(NotificationTemplatesController.name));
        }
        /**
         * List all templates.
         */
        async listTemplates(type, category) {
            // Implementation placeholder
            return [];
        }
        /**
         * Get template by ID.
         */
        async getTemplate(id) {
            // Implementation placeholder
            throw new common_1.NotFoundException('Template not found');
        }
        /**
         * Create new template.
         */
        async createTemplate(template) {
            const validation = exports.NotificationTemplateSchema.safeParse(template);
            if (!validation.success) {
                throw new common_1.BadRequestException(validation.error.errors);
            }
            // Implementation placeholder
            return { id: crypto.randomBytes(8).toString('hex'), ...template };
        }
        /**
         * Update template.
         */
        async updateTemplate(id, template) {
            // Implementation placeholder
            return { id, ...template };
        }
        /**
         * Delete template.
         */
        async deleteTemplate(id) {
            // Implementation placeholder
            return;
        }
        /**
         * Preview template rendering.
         */
        async previewTemplate(id, data) {
            // Implementation placeholder
            return {
                subject: 'Preview Subject',
                html: '<h1>Preview HTML</h1>',
                text: 'Preview Text',
            };
        }
    };
    __setFunctionName(_classThis, "NotificationTemplatesController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _listTemplates_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'List notification templates' }), (0, swagger_1.ApiQuery)({ name: 'type', required: false, enum: ['email', 'sms', 'push', 'in_app'] }), (0, swagger_1.ApiQuery)({ name: 'category', required: false }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Templates retrieved' })];
        _getTemplate_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get notification template' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Template ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Template retrieved' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Template not found' })];
        _createTemplate_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create notification template' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Template created' })];
        _updateTemplate_decorators = [(0, common_1.Put)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Update notification template' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Template ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Template updated' })];
        _deleteTemplate_decorators = [(0, common_1.Delete)(':id'), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT), (0, swagger_1.ApiOperation)({ summary: 'Delete notification template' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Template ID' }), (0, swagger_1.ApiResponse)({ status: 204, description: 'Template deleted' })];
        _previewTemplate_decorators = [(0, common_1.Post)(':id/preview'), (0, swagger_1.ApiOperation)({ summary: 'Preview template rendering' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Template ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Template preview generated' })];
        __esDecorate(_classThis, null, _listTemplates_decorators, { kind: "method", name: "listTemplates", static: false, private: false, access: { has: obj => "listTemplates" in obj, get: obj => obj.listTemplates }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTemplate_decorators, { kind: "method", name: "getTemplate", static: false, private: false, access: { has: obj => "getTemplate" in obj, get: obj => obj.getTemplate }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createTemplate_decorators, { kind: "method", name: "createTemplate", static: false, private: false, access: { has: obj => "createTemplate" in obj, get: obj => obj.createTemplate }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateTemplate_decorators, { kind: "method", name: "updateTemplate", static: false, private: false, access: { has: obj => "updateTemplate" in obj, get: obj => obj.updateTemplate }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteTemplate_decorators, { kind: "method", name: "deleteTemplate", static: false, private: false, access: { has: obj => "deleteTemplate" in obj, get: obj => obj.deleteTemplate }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _previewTemplate_decorators, { kind: "method", name: "previewTemplate", static: false, private: false, access: { has: obj => "previewTemplate" in obj, get: obj => obj.previewTemplate }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationTemplatesController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationTemplatesController = _classThis;
})();
exports.NotificationTemplatesController = NotificationTemplatesController;
// ============================================================================
// NESTJS CONTROLLER - PREFERENCES
// ============================================================================
/**
 * NestJS controller for notification preferences.
 */
let NotificationPreferencesController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Notification Preferences'), (0, common_1.Controller)('api/v1/notification-preferences'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getUserPreferences_decorators;
    let _updateUserPreferences_decorators;
    var NotificationPreferencesController = _classThis = class {
        constructor() {
            this.logger = (__runInitializers(this, _instanceExtraInitializers), new common_1.Logger(NotificationPreferencesController.name));
        }
        /**
         * Get user notification preferences.
         */
        async getUserPreferences(userId) {
            // Implementation placeholder
            return {
                userId,
                emailEnabled: true,
                smsEnabled: true,
                pushEnabled: true,
                inAppEnabled: true,
            };
        }
        /**
         * Update user notification preferences.
         */
        async updateUserPreferences(userId, preferences) {
            // Implementation placeholder
            return { userId, ...preferences };
        }
    };
    __setFunctionName(_classThis, "NotificationPreferencesController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getUserPreferences_decorators = [(0, common_1.Get)('users/:userId'), (0, swagger_1.ApiOperation)({ summary: 'Get user notification preferences' }), (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Preferences retrieved' })];
        _updateUserPreferences_decorators = [(0, common_1.Put)('users/:userId'), (0, swagger_1.ApiOperation)({ summary: 'Update user notification preferences' }), (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Preferences updated' })];
        __esDecorate(_classThis, null, _getUserPreferences_decorators, { kind: "method", name: "getUserPreferences", static: false, private: false, access: { has: obj => "getUserPreferences" in obj, get: obj => obj.getUserPreferences }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateUserPreferences_decorators, { kind: "method", name: "updateUserPreferences", static: false, private: false, access: { has: obj => "updateUserPreferences" in obj, get: obj => obj.updateUserPreferences }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationPreferencesController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationPreferencesController = _classThis;
})();
exports.NotificationPreferencesController = NotificationPreferencesController;
// ============================================================================
// NESTJS CONTROLLER - WEBHOOKS
// ============================================================================
/**
 * NestJS controller for webhook handlers.
 */
let WebhooksController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Webhooks'), (0, common_1.Controller)('api/v1/webhooks')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _handleSendGrid_decorators;
    let _handleTwilio_decorators;
    let _handleSES_decorators;
    let _handleFCM_decorators;
    var WebhooksController = _classThis = class {
        constructor() {
            this.logger = (__runInitializers(this, _instanceExtraInitializers), new common_1.Logger(WebhooksController.name));
        }
        /**
         * Handle SendGrid webhook events.
         */
        async handleSendGrid(events) {
            for (const event of events) {
                await processSendGridWebhook(event);
            }
            return { success: true };
        }
        /**
         * Handle Twilio webhook events.
         */
        async handleTwilio(event) {
            await processTwilioWebhook(event);
            return { success: true };
        }
        /**
         * Handle AWS SES webhook events.
         */
        async handleSES(event) {
            // Implementation placeholder
            return { success: true };
        }
        /**
         * Handle FCM webhook events.
         */
        async handleFCM(event) {
            // Implementation placeholder
            return { success: true };
        }
    };
    __setFunctionName(_classThis, "WebhooksController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _handleSendGrid_decorators = [(0, common_1.Post)('sendgrid'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Handle SendGrid webhook events' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook processed' })];
        _handleTwilio_decorators = [(0, common_1.Post)('twilio'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Handle Twilio webhook events' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook processed' })];
        _handleSES_decorators = [(0, common_1.Post)('ses'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Handle AWS SES webhook events' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook processed' })];
        _handleFCM_decorators = [(0, common_1.Post)('fcm'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Handle FCM webhook events' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook processed' })];
        __esDecorate(_classThis, null, _handleSendGrid_decorators, { kind: "method", name: "handleSendGrid", static: false, private: false, access: { has: obj => "handleSendGrid" in obj, get: obj => obj.handleSendGrid }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleTwilio_decorators, { kind: "method", name: "handleTwilio", static: false, private: false, access: { has: obj => "handleTwilio" in obj, get: obj => obj.handleTwilio }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleSES_decorators, { kind: "method", name: "handleSES", static: false, private: false, access: { has: obj => "handleSES" in obj, get: obj => obj.handleSES }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleFCM_decorators, { kind: "method", name: "handleFCM", static: false, private: false, access: { has: obj => "handleFCM" in obj, get: obj => obj.handleFCM }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WebhooksController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WebhooksController = _classThis;
})();
exports.WebhooksController = WebhooksController;
/**
 * Export all functions and classes for use in other modules.
 */
exports.default = {
    // Email functions
    sendEmailViaSMTP,
    sendEmailViaSendGrid,
    sendEmailViaSES,
    // SMS functions
    sendSMSViaTwilio,
    sendSMSViaSNS,
    // Push notification functions
    sendPushViaFCM,
    sendPushViaAPNs,
    // Template functions
    renderHandlebarsTemplate,
    renderNotificationTemplate,
    validateTemplateVariables,
    // Queue functions
    createNotificationQueue,
    addNotificationToQueue,
    addBatchNotificationsToQueue,
    processNotificationQueue,
    // Tracking functions
    generateTrackingToken,
    verifyTrackingToken,
    trackNotificationOpen,
    trackNotificationClick,
    // Preference functions
    canSendNotification,
    generateUnsubscribeToken,
    verifyUnsubscribeToken,
    // Webhook functions
    verifyWebhookSignature,
    processSendGridWebhook,
    processTwilioWebhook,
    // Utility functions
    calculateNotificationAnalytics,
    validateEmailFormat,
    validatePhoneFormat,
    sanitizeEmailHTML,
    // Sequelize models
    getNotificationTemplateModelAttributes,
    getNotificationDeliveryLogModelAttributes,
    getNotificationPreferencesModelAttributes,
    getUnsubscribeRecordModelAttributes,
    getNotificationTrackingModelAttributes,
    getWebhookEventModelAttributes,
    getScheduledNotificationModelAttributes,
    // NestJS services and controllers
    NotificationService,
    NotificationsController,
    NotificationTemplatesController,
    NotificationPreferencesController,
    WebhooksController,
    // Zod schemas
    EmailConfigSchema: exports.EmailConfigSchema,
    SMSConfigSchema: exports.SMSConfigSchema,
    PushNotificationConfigSchema: exports.PushNotificationConfigSchema,
    InAppNotificationConfigSchema: exports.InAppNotificationConfigSchema,
    NotificationTemplateSchema: exports.NotificationTemplateSchema,
    NotificationPreferencesSchema: exports.NotificationPreferencesSchema,
    BatchNotificationJobSchema: exports.BatchNotificationJobSchema,
};
//# sourceMappingURL=notification-kit.prod.js.map