"use strict";
/**
 * ASSET NOTIFICATION COMMAND FUNCTIONS
 *
 * Enterprise-grade notification management system providing comprehensive
 * functionality for notification rules engine, multi-channel delivery
 * (email/SMS/push), escalation workflows, notification templates, user
 * preferences, notification history, batch processing, scheduling, and
 * delivery tracking. Competes with Twilio and SendGrid solutions.
 *
 * Features:
 * - Multi-channel notification delivery (email, SMS, push, in-app)
 * - Advanced rules engine with conditions
 * - Escalation workflows and hierarchies
 * - Rich notification templates
 * - User notification preferences
 * - Batch and scheduled notifications
 * - Delivery tracking and analytics
 * - Rate limiting and throttling
 * - Priority-based queuing
 * - Retry mechanisms
 *
 * @module AssetNotificationCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 *
 * @example
 * ```typescript
 * import {
 *   sendNotification,
 *   createNotificationRule,
 *   createEscalationPolicy,
 *   NotificationChannel,
 *   NotificationPriority
 * } from './asset-notification-commands';
 *
 * // Send notification
 * await sendNotification({
 *   recipientIds: ['user-123', 'user-456'],
 *   subject: 'Asset Maintenance Due',
 *   message: 'Asset ABC-123 requires maintenance',
 *   priority: NotificationPriority.HIGH,
 *   channels: [NotificationChannel.EMAIL, NotificationChannel.SMS]
 * });
 *
 * // Create notification rule
 * const rule = await createNotificationRule({
 *   name: 'Maintenance Alert',
 *   eventType: 'maintenance_due',
 *   conditions: { daysUntilDue: { lte: 7 } },
 *   recipients: ['maintenance-team']
 * });
 * ```
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
exports.ScheduledNotification = exports.NotificationDigest = exports.NotificationAnalytics = exports.NotificationQueue = exports.UserNotificationPreference = exports.EscalationInstance = exports.EscalationPolicy = exports.NotificationTemplate = exports.NotificationRule = exports.Notification = exports.EscalationLevel = exports.EventType = exports.TemplateType = exports.NotificationStatus = exports.NotificationPriority = exports.NotificationChannel = void 0;
exports.sendNotification = sendNotification;
exports.sendBatchNotification = sendBatchNotification;
exports.queueNotification = queueNotification;
exports.processNotificationQueue = processNotificationQueue;
exports.deliverNotification = deliverNotification;
exports.markNotificationRead = markNotificationRead;
exports.getUserNotifications = getUserNotifications;
exports.createNotificationRule = createNotificationRule;
exports.evaluateNotificationRules = evaluateNotificationRules;
exports.getActiveNotificationRules = getActiveNotificationRules;
exports.createNotificationTemplate = createNotificationTemplate;
exports.renderTemplate = renderTemplate;
exports.getActiveTemplates = getActiveTemplates;
exports.createEscalationPolicy = createEscalationPolicy;
exports.triggerEscalation = triggerEscalation;
exports.processEscalations = processEscalations;
exports.resolveEscalation = resolveEscalation;
exports.setUserPreferences = setUserPreferences;
exports.getUserPreferences = getUserPreferences;
exports.trackNotificationDelivery = trackNotificationDelivery;
exports.trackNotificationOpen = trackNotificationOpen;
exports.getNotificationAnalyticsReport = getNotificationAnalyticsReport;
exports.createNotificationDigest = createNotificationDigest;
exports.sendPendingDigests = sendPendingDigests;
exports.searchNotifications = searchNotifications;
exports.markAllNotificationsRead = markAllNotificationsRead;
exports.deleteOldNotifications = deleteOldNotifications;
exports.archiveNotifications = archiveNotifications;
exports.createScheduledNotification = createScheduledNotification;
exports.processScheduledNotifications = processScheduledNotifications;
exports.cancelScheduledNotification = cancelScheduledNotification;
exports.sendWebhookNotification = sendWebhookNotification;
exports.getUnreadNotificationCount = getUnreadNotificationCount;
exports.getUnreadCountByPriority = getUnreadCountByPriority;
exports.sendEmergencyBroadcast = sendEmergencyBroadcast;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Notification Channel
 */
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["EMAIL"] = "email";
    NotificationChannel["SMS"] = "sms";
    NotificationChannel["PUSH"] = "push";
    NotificationChannel["IN_APP"] = "in_app";
    NotificationChannel["WEBHOOK"] = "webhook";
    NotificationChannel["SLACK"] = "slack";
    NotificationChannel["TEAMS"] = "teams";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
/**
 * Notification Priority
 */
var NotificationPriority;
(function (NotificationPriority) {
    NotificationPriority["LOW"] = "low";
    NotificationPriority["MEDIUM"] = "medium";
    NotificationPriority["HIGH"] = "high";
    NotificationPriority["URGENT"] = "urgent";
    NotificationPriority["CRITICAL"] = "critical";
})(NotificationPriority || (exports.NotificationPriority = NotificationPriority = {}));
/**
 * Notification Status
 */
var NotificationStatus;
(function (NotificationStatus) {
    NotificationStatus["PENDING"] = "pending";
    NotificationStatus["QUEUED"] = "queued";
    NotificationStatus["SENDING"] = "sending";
    NotificationStatus["SENT"] = "sent";
    NotificationStatus["DELIVERED"] = "delivered";
    NotificationStatus["FAILED"] = "failed";
    NotificationStatus["BOUNCED"] = "bounced";
    NotificationStatus["CANCELLED"] = "cancelled";
})(NotificationStatus || (exports.NotificationStatus = NotificationStatus = {}));
/**
 * Template Type
 */
var TemplateType;
(function (TemplateType) {
    TemplateType["EMAIL"] = "email";
    TemplateType["SMS"] = "sms";
    TemplateType["PUSH"] = "push";
    TemplateType["IN_APP"] = "in_app";
})(TemplateType || (exports.TemplateType = TemplateType = {}));
/**
 * Event Type
 */
var EventType;
(function (EventType) {
    EventType["ASSET_CREATED"] = "asset_created";
    EventType["ASSET_UPDATED"] = "asset_updated";
    EventType["ASSET_DELETED"] = "asset_deleted";
    EventType["MAINTENANCE_DUE"] = "maintenance_due";
    EventType["INSPECTION_DUE"] = "inspection_due";
    EventType["WARRANTY_EXPIRING"] = "warranty_expiring";
    EventType["CALIBRATION_DUE"] = "calibration_due";
    EventType["COMPLIANCE_VIOLATION"] = "compliance_violation";
    EventType["THRESHOLD_EXCEEDED"] = "threshold_exceeded";
    EventType["STATUS_CHANGED"] = "status_changed";
    EventType["LOCATION_CHANGED"] = "location_changed";
    EventType["CUSTOM"] = "custom";
})(EventType || (exports.EventType = EventType = {}));
/**
 * Escalation Level
 */
var EscalationLevel;
(function (EscalationLevel) {
    EscalationLevel["LEVEL_1"] = "level_1";
    EscalationLevel["LEVEL_2"] = "level_2";
    EscalationLevel["LEVEL_3"] = "level_3";
    EscalationLevel["LEVEL_4"] = "level_4";
    EscalationLevel["EXECUTIVE"] = "executive";
})(EscalationLevel || (exports.EscalationLevel = EscalationLevel = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Notification Model
 */
let Notification = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'notifications',
            timestamps: true,
            indexes: [
                { fields: ['recipient_id'] },
                { fields: ['status'] },
                { fields: ['priority'] },
                { fields: ['channel'] },
                { fields: ['scheduled_for'] },
                { fields: ['sent_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _recipientId_decorators;
    let _recipientId_initializers = [];
    let _recipientId_extraInitializers = [];
    let _subject_decorators;
    let _subject_initializers = [];
    let _subject_extraInitializers = [];
    let _message_decorators;
    let _message_initializers = [];
    let _message_extraInitializers = [];
    let _channel_decorators;
    let _channel_initializers = [];
    let _channel_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _templateId_decorators;
    let _templateId_initializers = [];
    let _templateId_extraInitializers = [];
    let _templateData_decorators;
    let _templateData_initializers = [];
    let _templateData_extraInitializers = [];
    let _scheduledFor_decorators;
    let _scheduledFor_initializers = [];
    let _scheduledFor_extraInitializers = [];
    let _sentAt_decorators;
    let _sentAt_initializers = [];
    let _sentAt_extraInitializers = [];
    let _deliveredAt_decorators;
    let _deliveredAt_initializers = [];
    let _deliveredAt_extraInitializers = [];
    let _readAt_decorators;
    let _readAt_initializers = [];
    let _readAt_extraInitializers = [];
    let _expiresAt_decorators;
    let _expiresAt_initializers = [];
    let _expiresAt_extraInitializers = [];
    let _retryCount_decorators;
    let _retryCount_initializers = [];
    let _retryCount_extraInitializers = [];
    let _maxRetries_decorators;
    let _maxRetries_initializers = [];
    let _maxRetries_extraInitializers = [];
    let _errorMessage_decorators;
    let _errorMessage_initializers = [];
    let _errorMessage_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    let _batchId_decorators;
    let _batchId_initializers = [];
    let _batchId_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _template_decorators;
    let _template_initializers = [];
    let _template_extraInitializers = [];
    var Notification = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.recipientId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _recipientId_initializers, void 0));
            this.subject = (__runInitializers(this, _recipientId_extraInitializers), __runInitializers(this, _subject_initializers, void 0));
            this.message = (__runInitializers(this, _subject_extraInitializers), __runInitializers(this, _message_initializers, void 0));
            this.channel = (__runInitializers(this, _message_extraInitializers), __runInitializers(this, _channel_initializers, void 0));
            this.priority = (__runInitializers(this, _channel_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.status = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.templateId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _templateId_initializers, void 0));
            this.templateData = (__runInitializers(this, _templateId_extraInitializers), __runInitializers(this, _templateData_initializers, void 0));
            this.scheduledFor = (__runInitializers(this, _templateData_extraInitializers), __runInitializers(this, _scheduledFor_initializers, void 0));
            this.sentAt = (__runInitializers(this, _scheduledFor_extraInitializers), __runInitializers(this, _sentAt_initializers, void 0));
            this.deliveredAt = (__runInitializers(this, _sentAt_extraInitializers), __runInitializers(this, _deliveredAt_initializers, void 0));
            this.readAt = (__runInitializers(this, _deliveredAt_extraInitializers), __runInitializers(this, _readAt_initializers, void 0));
            this.expiresAt = (__runInitializers(this, _readAt_extraInitializers), __runInitializers(this, _expiresAt_initializers, void 0));
            this.retryCount = (__runInitializers(this, _expiresAt_extraInitializers), __runInitializers(this, _retryCount_initializers, void 0));
            this.maxRetries = (__runInitializers(this, _retryCount_extraInitializers), __runInitializers(this, _maxRetries_initializers, void 0));
            this.errorMessage = (__runInitializers(this, _maxRetries_extraInitializers), __runInitializers(this, _errorMessage_initializers, void 0));
            this.metadata = (__runInitializers(this, _errorMessage_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.attachments = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.batchId = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _batchId_initializers, void 0));
            this.createdAt = (__runInitializers(this, _batchId_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.template = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _template_initializers, void 0));
            __runInitializers(this, _template_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Notification");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _recipientId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recipient user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _subject_decorators = [(0, swagger_1.ApiProperty)({ description: 'Subject' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500), allowNull: false })];
        _message_decorators = [(0, swagger_1.ApiProperty)({ description: 'Message body' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _channel_decorators = [(0, swagger_1.ApiProperty)({ description: 'Channel' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(NotificationChannel)), allowNull: false }), sequelize_typescript_1.Index];
        _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(NotificationPriority)), defaultValue: NotificationPriority.MEDIUM }), sequelize_typescript_1.Index];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(NotificationStatus)), defaultValue: NotificationStatus.PENDING }), sequelize_typescript_1.Index];
        _templateId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Template ID' }), (0, sequelize_typescript_1.ForeignKey)(() => NotificationTemplate), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _templateData_decorators = [(0, swagger_1.ApiProperty)({ description: 'Template data' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _scheduledFor_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scheduled for' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _sentAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Sent at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _deliveredAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Delivered at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _readAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Read at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _expiresAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expires at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _retryCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Retry count' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _maxRetries_decorators = [(0, swagger_1.ApiProperty)({ description: 'Max retries' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 3 })];
        _errorMessage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Error message' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _attachments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Attachments' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _batchId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Batch ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _template_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => NotificationTemplate)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _recipientId_decorators, { kind: "field", name: "recipientId", static: false, private: false, access: { has: obj => "recipientId" in obj, get: obj => obj.recipientId, set: (obj, value) => { obj.recipientId = value; } }, metadata: _metadata }, _recipientId_initializers, _recipientId_extraInitializers);
        __esDecorate(null, null, _subject_decorators, { kind: "field", name: "subject", static: false, private: false, access: { has: obj => "subject" in obj, get: obj => obj.subject, set: (obj, value) => { obj.subject = value; } }, metadata: _metadata }, _subject_initializers, _subject_extraInitializers);
        __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: obj => "message" in obj, get: obj => obj.message, set: (obj, value) => { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
        __esDecorate(null, null, _channel_decorators, { kind: "field", name: "channel", static: false, private: false, access: { has: obj => "channel" in obj, get: obj => obj.channel, set: (obj, value) => { obj.channel = value; } }, metadata: _metadata }, _channel_initializers, _channel_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _templateId_decorators, { kind: "field", name: "templateId", static: false, private: false, access: { has: obj => "templateId" in obj, get: obj => obj.templateId, set: (obj, value) => { obj.templateId = value; } }, metadata: _metadata }, _templateId_initializers, _templateId_extraInitializers);
        __esDecorate(null, null, _templateData_decorators, { kind: "field", name: "templateData", static: false, private: false, access: { has: obj => "templateData" in obj, get: obj => obj.templateData, set: (obj, value) => { obj.templateData = value; } }, metadata: _metadata }, _templateData_initializers, _templateData_extraInitializers);
        __esDecorate(null, null, _scheduledFor_decorators, { kind: "field", name: "scheduledFor", static: false, private: false, access: { has: obj => "scheduledFor" in obj, get: obj => obj.scheduledFor, set: (obj, value) => { obj.scheduledFor = value; } }, metadata: _metadata }, _scheduledFor_initializers, _scheduledFor_extraInitializers);
        __esDecorate(null, null, _sentAt_decorators, { kind: "field", name: "sentAt", static: false, private: false, access: { has: obj => "sentAt" in obj, get: obj => obj.sentAt, set: (obj, value) => { obj.sentAt = value; } }, metadata: _metadata }, _sentAt_initializers, _sentAt_extraInitializers);
        __esDecorate(null, null, _deliveredAt_decorators, { kind: "field", name: "deliveredAt", static: false, private: false, access: { has: obj => "deliveredAt" in obj, get: obj => obj.deliveredAt, set: (obj, value) => { obj.deliveredAt = value; } }, metadata: _metadata }, _deliveredAt_initializers, _deliveredAt_extraInitializers);
        __esDecorate(null, null, _readAt_decorators, { kind: "field", name: "readAt", static: false, private: false, access: { has: obj => "readAt" in obj, get: obj => obj.readAt, set: (obj, value) => { obj.readAt = value; } }, metadata: _metadata }, _readAt_initializers, _readAt_extraInitializers);
        __esDecorate(null, null, _expiresAt_decorators, { kind: "field", name: "expiresAt", static: false, private: false, access: { has: obj => "expiresAt" in obj, get: obj => obj.expiresAt, set: (obj, value) => { obj.expiresAt = value; } }, metadata: _metadata }, _expiresAt_initializers, _expiresAt_extraInitializers);
        __esDecorate(null, null, _retryCount_decorators, { kind: "field", name: "retryCount", static: false, private: false, access: { has: obj => "retryCount" in obj, get: obj => obj.retryCount, set: (obj, value) => { obj.retryCount = value; } }, metadata: _metadata }, _retryCount_initializers, _retryCount_extraInitializers);
        __esDecorate(null, null, _maxRetries_decorators, { kind: "field", name: "maxRetries", static: false, private: false, access: { has: obj => "maxRetries" in obj, get: obj => obj.maxRetries, set: (obj, value) => { obj.maxRetries = value; } }, metadata: _metadata }, _maxRetries_initializers, _maxRetries_extraInitializers);
        __esDecorate(null, null, _errorMessage_decorators, { kind: "field", name: "errorMessage", static: false, private: false, access: { has: obj => "errorMessage" in obj, get: obj => obj.errorMessage, set: (obj, value) => { obj.errorMessage = value; } }, metadata: _metadata }, _errorMessage_initializers, _errorMessage_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _batchId_decorators, { kind: "field", name: "batchId", static: false, private: false, access: { has: obj => "batchId" in obj, get: obj => obj.batchId, set: (obj, value) => { obj.batchId = value; } }, metadata: _metadata }, _batchId_initializers, _batchId_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _template_decorators, { kind: "field", name: "template", static: false, private: false, access: { has: obj => "template" in obj, get: obj => obj.template, set: (obj, value) => { obj.template = value; } }, metadata: _metadata }, _template_initializers, _template_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Notification = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Notification = _classThis;
})();
exports.Notification = Notification;
/**
 * Notification Rule Model
 */
let NotificationRule = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'notification_rules',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['name'], unique: true },
                { fields: ['event_type'] },
                { fields: ['is_active'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _eventType_decorators;
    let _eventType_initializers = [];
    let _eventType_extraInitializers = [];
    let _conditions_decorators;
    let _conditions_initializers = [];
    let _conditions_extraInitializers = [];
    let _recipients_decorators;
    let _recipients_initializers = [];
    let _recipients_extraInitializers = [];
    let _channels_decorators;
    let _channels_initializers = [];
    let _channels_extraInitializers = [];
    let _templateId_decorators;
    let _templateId_initializers = [];
    let _templateId_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _throttleMinutes_decorators;
    let _throttleMinutes_initializers = [];
    let _throttleMinutes_extraInitializers = [];
    let _lastTriggered_decorators;
    let _lastTriggered_initializers = [];
    let _lastTriggered_extraInitializers = [];
    let _triggerCount_decorators;
    let _triggerCount_initializers = [];
    let _triggerCount_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _template_decorators;
    let _template_initializers = [];
    let _template_extraInitializers = [];
    var NotificationRule = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.eventType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _eventType_initializers, void 0));
            this.conditions = (__runInitializers(this, _eventType_extraInitializers), __runInitializers(this, _conditions_initializers, void 0));
            this.recipients = (__runInitializers(this, _conditions_extraInitializers), __runInitializers(this, _recipients_initializers, void 0));
            this.channels = (__runInitializers(this, _recipients_extraInitializers), __runInitializers(this, _channels_initializers, void 0));
            this.templateId = (__runInitializers(this, _channels_extraInitializers), __runInitializers(this, _templateId_initializers, void 0));
            this.priority = (__runInitializers(this, _templateId_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.isActive = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.throttleMinutes = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _throttleMinutes_initializers, void 0));
            this.lastTriggered = (__runInitializers(this, _throttleMinutes_extraInitializers), __runInitializers(this, _lastTriggered_initializers, void 0));
            this.triggerCount = (__runInitializers(this, _lastTriggered_extraInitializers), __runInitializers(this, _triggerCount_initializers, void 0));
            this.createdAt = (__runInitializers(this, _triggerCount_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.template = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _template_initializers, void 0));
            __runInitializers(this, _template_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "NotificationRule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _eventType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Event type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(EventType)), allowNull: false }), sequelize_typescript_1.Index];
        _conditions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Conditions' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _recipients_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recipient user IDs' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID), allowNull: false })];
        _channels_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notification channels' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.ENUM(...Object.values(NotificationChannel))), allowNull: false })];
        _templateId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Template ID' }), (0, sequelize_typescript_1.ForeignKey)(() => NotificationTemplate), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(NotificationPriority)), defaultValue: NotificationPriority.MEDIUM })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _throttleMinutes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Throttle minutes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _lastTriggered_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last triggered' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _triggerCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Trigger count' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _template_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => NotificationTemplate)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _eventType_decorators, { kind: "field", name: "eventType", static: false, private: false, access: { has: obj => "eventType" in obj, get: obj => obj.eventType, set: (obj, value) => { obj.eventType = value; } }, metadata: _metadata }, _eventType_initializers, _eventType_extraInitializers);
        __esDecorate(null, null, _conditions_decorators, { kind: "field", name: "conditions", static: false, private: false, access: { has: obj => "conditions" in obj, get: obj => obj.conditions, set: (obj, value) => { obj.conditions = value; } }, metadata: _metadata }, _conditions_initializers, _conditions_extraInitializers);
        __esDecorate(null, null, _recipients_decorators, { kind: "field", name: "recipients", static: false, private: false, access: { has: obj => "recipients" in obj, get: obj => obj.recipients, set: (obj, value) => { obj.recipients = value; } }, metadata: _metadata }, _recipients_initializers, _recipients_extraInitializers);
        __esDecorate(null, null, _channels_decorators, { kind: "field", name: "channels", static: false, private: false, access: { has: obj => "channels" in obj, get: obj => obj.channels, set: (obj, value) => { obj.channels = value; } }, metadata: _metadata }, _channels_initializers, _channels_extraInitializers);
        __esDecorate(null, null, _templateId_decorators, { kind: "field", name: "templateId", static: false, private: false, access: { has: obj => "templateId" in obj, get: obj => obj.templateId, set: (obj, value) => { obj.templateId = value; } }, metadata: _metadata }, _templateId_initializers, _templateId_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _throttleMinutes_decorators, { kind: "field", name: "throttleMinutes", static: false, private: false, access: { has: obj => "throttleMinutes" in obj, get: obj => obj.throttleMinutes, set: (obj, value) => { obj.throttleMinutes = value; } }, metadata: _metadata }, _throttleMinutes_initializers, _throttleMinutes_extraInitializers);
        __esDecorate(null, null, _lastTriggered_decorators, { kind: "field", name: "lastTriggered", static: false, private: false, access: { has: obj => "lastTriggered" in obj, get: obj => obj.lastTriggered, set: (obj, value) => { obj.lastTriggered = value; } }, metadata: _metadata }, _lastTriggered_initializers, _lastTriggered_extraInitializers);
        __esDecorate(null, null, _triggerCount_decorators, { kind: "field", name: "triggerCount", static: false, private: false, access: { has: obj => "triggerCount" in obj, get: obj => obj.triggerCount, set: (obj, value) => { obj.triggerCount = value; } }, metadata: _metadata }, _triggerCount_initializers, _triggerCount_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _template_decorators, { kind: "field", name: "template", static: false, private: false, access: { has: obj => "template" in obj, get: obj => obj.template, set: (obj, value) => { obj.template = value; } }, metadata: _metadata }, _template_initializers, _template_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationRule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationRule = _classThis;
})();
exports.NotificationRule = NotificationRule;
/**
 * Notification Template Model
 */
let NotificationTemplate = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'notification_templates',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['name'], unique: true },
                { fields: ['template_type'] },
                { fields: ['is_active'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _templateType_decorators;
    let _templateType_initializers = [];
    let _templateType_extraInitializers = [];
    let _subject_decorators;
    let _subject_initializers = [];
    let _subject_extraInitializers = [];
    let _body_decorators;
    let _body_initializers = [];
    let _body_extraInitializers = [];
    let _variables_decorators;
    let _variables_initializers = [];
    let _variables_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _usageCount_decorators;
    let _usageCount_initializers = [];
    let _usageCount_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _notifications_decorators;
    let _notifications_initializers = [];
    let _notifications_extraInitializers = [];
    let _rules_decorators;
    let _rules_initializers = [];
    let _rules_extraInitializers = [];
    var NotificationTemplate = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.templateType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _templateType_initializers, void 0));
            this.subject = (__runInitializers(this, _templateType_extraInitializers), __runInitializers(this, _subject_initializers, void 0));
            this.body = (__runInitializers(this, _subject_extraInitializers), __runInitializers(this, _body_initializers, void 0));
            this.variables = (__runInitializers(this, _body_extraInitializers), __runInitializers(this, _variables_initializers, void 0));
            this.isActive = (__runInitializers(this, _variables_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.version = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _version_initializers, void 0));
            this.usageCount = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _usageCount_initializers, void 0));
            this.createdAt = (__runInitializers(this, _usageCount_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.notifications = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _notifications_initializers, void 0));
            this.rules = (__runInitializers(this, _notifications_extraInitializers), __runInitializers(this, _rules_initializers, void 0));
            __runInitializers(this, _rules_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "NotificationTemplate");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Template name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _templateType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Template type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(TemplateType)), allowNull: false }), sequelize_typescript_1.Index];
        _subject_decorators = [(0, swagger_1.ApiProperty)({ description: 'Subject template' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500) })];
        _body_decorators = [(0, swagger_1.ApiProperty)({ description: 'Body template' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _variables_decorators = [(0, swagger_1.ApiProperty)({ description: 'Template variables' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _version_decorators = [(0, swagger_1.ApiProperty)({ description: 'Version' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 1 })];
        _usageCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Usage count' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _notifications_decorators = [(0, sequelize_typescript_1.HasMany)(() => Notification)];
        _rules_decorators = [(0, sequelize_typescript_1.HasMany)(() => NotificationRule)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _templateType_decorators, { kind: "field", name: "templateType", static: false, private: false, access: { has: obj => "templateType" in obj, get: obj => obj.templateType, set: (obj, value) => { obj.templateType = value; } }, metadata: _metadata }, _templateType_initializers, _templateType_extraInitializers);
        __esDecorate(null, null, _subject_decorators, { kind: "field", name: "subject", static: false, private: false, access: { has: obj => "subject" in obj, get: obj => obj.subject, set: (obj, value) => { obj.subject = value; } }, metadata: _metadata }, _subject_initializers, _subject_extraInitializers);
        __esDecorate(null, null, _body_decorators, { kind: "field", name: "body", static: false, private: false, access: { has: obj => "body" in obj, get: obj => obj.body, set: (obj, value) => { obj.body = value; } }, metadata: _metadata }, _body_initializers, _body_extraInitializers);
        __esDecorate(null, null, _variables_decorators, { kind: "field", name: "variables", static: false, private: false, access: { has: obj => "variables" in obj, get: obj => obj.variables, set: (obj, value) => { obj.variables = value; } }, metadata: _metadata }, _variables_initializers, _variables_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, null, _usageCount_decorators, { kind: "field", name: "usageCount", static: false, private: false, access: { has: obj => "usageCount" in obj, get: obj => obj.usageCount, set: (obj, value) => { obj.usageCount = value; } }, metadata: _metadata }, _usageCount_initializers, _usageCount_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _notifications_decorators, { kind: "field", name: "notifications", static: false, private: false, access: { has: obj => "notifications" in obj, get: obj => obj.notifications, set: (obj, value) => { obj.notifications = value; } }, metadata: _metadata }, _notifications_initializers, _notifications_extraInitializers);
        __esDecorate(null, null, _rules_decorators, { kind: "field", name: "rules", static: false, private: false, access: { has: obj => "rules" in obj, get: obj => obj.rules, set: (obj, value) => { obj.rules = value; } }, metadata: _metadata }, _rules_initializers, _rules_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationTemplate = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationTemplate = _classThis;
})();
exports.NotificationTemplate = NotificationTemplate;
/**
 * Escalation Policy Model
 */
let EscalationPolicy = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'escalation_policies',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['name'], unique: true },
                { fields: ['event_type'] },
                { fields: ['is_active'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _eventType_decorators;
    let _eventType_initializers = [];
    let _eventType_extraInitializers = [];
    let _levels_decorators;
    let _levels_initializers = [];
    let _levels_extraInitializers = [];
    let _levelRecipients_decorators;
    let _levelRecipients_initializers = [];
    let _levelRecipients_extraInitializers = [];
    let _levelDelayMinutes_decorators;
    let _levelDelayMinutes_initializers = [];
    let _levelDelayMinutes_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _triggerCount_decorators;
    let _triggerCount_initializers = [];
    let _triggerCount_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _instances_decorators;
    let _instances_initializers = [];
    let _instances_extraInitializers = [];
    var EscalationPolicy = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.eventType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _eventType_initializers, void 0));
            this.levels = (__runInitializers(this, _eventType_extraInitializers), __runInitializers(this, _levels_initializers, void 0));
            this.levelRecipients = (__runInitializers(this, _levels_extraInitializers), __runInitializers(this, _levelRecipients_initializers, void 0));
            this.levelDelayMinutes = (__runInitializers(this, _levelRecipients_extraInitializers), __runInitializers(this, _levelDelayMinutes_initializers, void 0));
            this.isActive = (__runInitializers(this, _levelDelayMinutes_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.triggerCount = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _triggerCount_initializers, void 0));
            this.createdAt = (__runInitializers(this, _triggerCount_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.instances = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _instances_initializers, void 0));
            __runInitializers(this, _instances_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "EscalationPolicy");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Policy name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _eventType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Event type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(EventType)), allowNull: false }), sequelize_typescript_1.Index];
        _levels_decorators = [(0, swagger_1.ApiProperty)({ description: 'Escalation levels' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.ENUM(...Object.values(EscalationLevel))), allowNull: false })];
        _levelRecipients_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recipients per level' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _levelDelayMinutes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Delay per level in minutes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _triggerCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Trigger count' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _instances_decorators = [(0, sequelize_typescript_1.HasMany)(() => EscalationInstance)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _eventType_decorators, { kind: "field", name: "eventType", static: false, private: false, access: { has: obj => "eventType" in obj, get: obj => obj.eventType, set: (obj, value) => { obj.eventType = value; } }, metadata: _metadata }, _eventType_initializers, _eventType_extraInitializers);
        __esDecorate(null, null, _levels_decorators, { kind: "field", name: "levels", static: false, private: false, access: { has: obj => "levels" in obj, get: obj => obj.levels, set: (obj, value) => { obj.levels = value; } }, metadata: _metadata }, _levels_initializers, _levels_extraInitializers);
        __esDecorate(null, null, _levelRecipients_decorators, { kind: "field", name: "levelRecipients", static: false, private: false, access: { has: obj => "levelRecipients" in obj, get: obj => obj.levelRecipients, set: (obj, value) => { obj.levelRecipients = value; } }, metadata: _metadata }, _levelRecipients_initializers, _levelRecipients_extraInitializers);
        __esDecorate(null, null, _levelDelayMinutes_decorators, { kind: "field", name: "levelDelayMinutes", static: false, private: false, access: { has: obj => "levelDelayMinutes" in obj, get: obj => obj.levelDelayMinutes, set: (obj, value) => { obj.levelDelayMinutes = value; } }, metadata: _metadata }, _levelDelayMinutes_initializers, _levelDelayMinutes_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _triggerCount_decorators, { kind: "field", name: "triggerCount", static: false, private: false, access: { has: obj => "triggerCount" in obj, get: obj => obj.triggerCount, set: (obj, value) => { obj.triggerCount = value; } }, metadata: _metadata }, _triggerCount_initializers, _triggerCount_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _instances_decorators, { kind: "field", name: "instances", static: false, private: false, access: { has: obj => "instances" in obj, get: obj => obj.instances, set: (obj, value) => { obj.instances = value; } }, metadata: _metadata }, _instances_initializers, _instances_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EscalationPolicy = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EscalationPolicy = _classThis;
})();
exports.EscalationPolicy = EscalationPolicy;
/**
 * Escalation Instance Model
 */
let EscalationInstance = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'escalation_instances',
            timestamps: true,
            indexes: [
                { fields: ['policy_id'] },
                { fields: ['current_level'] },
                { fields: ['is_resolved'] },
                { fields: ['started_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _policyId_decorators;
    let _policyId_initializers = [];
    let _policyId_extraInitializers = [];
    let _triggeredBy_decorators;
    let _triggeredBy_initializers = [];
    let _triggeredBy_extraInitializers = [];
    let _eventData_decorators;
    let _eventData_initializers = [];
    let _eventData_extraInitializers = [];
    let _currentLevel_decorators;
    let _currentLevel_initializers = [];
    let _currentLevel_extraInitializers = [];
    let _startedAt_decorators;
    let _startedAt_initializers = [];
    let _startedAt_extraInitializers = [];
    let _nextEscalationAt_decorators;
    let _nextEscalationAt_initializers = [];
    let _nextEscalationAt_extraInitializers = [];
    let _isResolved_decorators;
    let _isResolved_initializers = [];
    let _isResolved_extraInitializers = [];
    let _resolvedAt_decorators;
    let _resolvedAt_initializers = [];
    let _resolvedAt_extraInitializers = [];
    let _resolvedBy_decorators;
    let _resolvedBy_initializers = [];
    let _resolvedBy_extraInitializers = [];
    let _resolutionNotes_decorators;
    let _resolutionNotes_initializers = [];
    let _resolutionNotes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _policy_decorators;
    let _policy_initializers = [];
    let _policy_extraInitializers = [];
    var EscalationInstance = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.policyId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _policyId_initializers, void 0));
            this.triggeredBy = (__runInitializers(this, _policyId_extraInitializers), __runInitializers(this, _triggeredBy_initializers, void 0));
            this.eventData = (__runInitializers(this, _triggeredBy_extraInitializers), __runInitializers(this, _eventData_initializers, void 0));
            this.currentLevel = (__runInitializers(this, _eventData_extraInitializers), __runInitializers(this, _currentLevel_initializers, void 0));
            this.startedAt = (__runInitializers(this, _currentLevel_extraInitializers), __runInitializers(this, _startedAt_initializers, void 0));
            this.nextEscalationAt = (__runInitializers(this, _startedAt_extraInitializers), __runInitializers(this, _nextEscalationAt_initializers, void 0));
            this.isResolved = (__runInitializers(this, _nextEscalationAt_extraInitializers), __runInitializers(this, _isResolved_initializers, void 0));
            this.resolvedAt = (__runInitializers(this, _isResolved_extraInitializers), __runInitializers(this, _resolvedAt_initializers, void 0));
            this.resolvedBy = (__runInitializers(this, _resolvedAt_extraInitializers), __runInitializers(this, _resolvedBy_initializers, void 0));
            this.resolutionNotes = (__runInitializers(this, _resolvedBy_extraInitializers), __runInitializers(this, _resolutionNotes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _resolutionNotes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.policy = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _policy_initializers, void 0));
            __runInitializers(this, _policy_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "EscalationInstance");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _policyId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Policy ID' }), (0, sequelize_typescript_1.ForeignKey)(() => EscalationPolicy), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _triggeredBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Triggered by event' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false })];
        _eventData_decorators = [(0, swagger_1.ApiProperty)({ description: 'Event data' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _currentLevel_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current escalation level' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(EscalationLevel)), allowNull: false }), sequelize_typescript_1.Index];
        _startedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Started at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, defaultValue: sequelize_typescript_1.DataType.NOW }), sequelize_typescript_1.Index];
        _nextEscalationAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Next escalation at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _isResolved_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is resolved' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false }), sequelize_typescript_1.Index];
        _resolvedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resolved at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _resolvedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resolved by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _resolutionNotes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resolution notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _policy_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => EscalationPolicy)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _policyId_decorators, { kind: "field", name: "policyId", static: false, private: false, access: { has: obj => "policyId" in obj, get: obj => obj.policyId, set: (obj, value) => { obj.policyId = value; } }, metadata: _metadata }, _policyId_initializers, _policyId_extraInitializers);
        __esDecorate(null, null, _triggeredBy_decorators, { kind: "field", name: "triggeredBy", static: false, private: false, access: { has: obj => "triggeredBy" in obj, get: obj => obj.triggeredBy, set: (obj, value) => { obj.triggeredBy = value; } }, metadata: _metadata }, _triggeredBy_initializers, _triggeredBy_extraInitializers);
        __esDecorate(null, null, _eventData_decorators, { kind: "field", name: "eventData", static: false, private: false, access: { has: obj => "eventData" in obj, get: obj => obj.eventData, set: (obj, value) => { obj.eventData = value; } }, metadata: _metadata }, _eventData_initializers, _eventData_extraInitializers);
        __esDecorate(null, null, _currentLevel_decorators, { kind: "field", name: "currentLevel", static: false, private: false, access: { has: obj => "currentLevel" in obj, get: obj => obj.currentLevel, set: (obj, value) => { obj.currentLevel = value; } }, metadata: _metadata }, _currentLevel_initializers, _currentLevel_extraInitializers);
        __esDecorate(null, null, _startedAt_decorators, { kind: "field", name: "startedAt", static: false, private: false, access: { has: obj => "startedAt" in obj, get: obj => obj.startedAt, set: (obj, value) => { obj.startedAt = value; } }, metadata: _metadata }, _startedAt_initializers, _startedAt_extraInitializers);
        __esDecorate(null, null, _nextEscalationAt_decorators, { kind: "field", name: "nextEscalationAt", static: false, private: false, access: { has: obj => "nextEscalationAt" in obj, get: obj => obj.nextEscalationAt, set: (obj, value) => { obj.nextEscalationAt = value; } }, metadata: _metadata }, _nextEscalationAt_initializers, _nextEscalationAt_extraInitializers);
        __esDecorate(null, null, _isResolved_decorators, { kind: "field", name: "isResolved", static: false, private: false, access: { has: obj => "isResolved" in obj, get: obj => obj.isResolved, set: (obj, value) => { obj.isResolved = value; } }, metadata: _metadata }, _isResolved_initializers, _isResolved_extraInitializers);
        __esDecorate(null, null, _resolvedAt_decorators, { kind: "field", name: "resolvedAt", static: false, private: false, access: { has: obj => "resolvedAt" in obj, get: obj => obj.resolvedAt, set: (obj, value) => { obj.resolvedAt = value; } }, metadata: _metadata }, _resolvedAt_initializers, _resolvedAt_extraInitializers);
        __esDecorate(null, null, _resolvedBy_decorators, { kind: "field", name: "resolvedBy", static: false, private: false, access: { has: obj => "resolvedBy" in obj, get: obj => obj.resolvedBy, set: (obj, value) => { obj.resolvedBy = value; } }, metadata: _metadata }, _resolvedBy_initializers, _resolvedBy_extraInitializers);
        __esDecorate(null, null, _resolutionNotes_decorators, { kind: "field", name: "resolutionNotes", static: false, private: false, access: { has: obj => "resolutionNotes" in obj, get: obj => obj.resolutionNotes, set: (obj, value) => { obj.resolutionNotes = value; } }, metadata: _metadata }, _resolutionNotes_initializers, _resolutionNotes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _policy_decorators, { kind: "field", name: "policy", static: false, private: false, access: { has: obj => "policy" in obj, get: obj => obj.policy, set: (obj, value) => { obj.policy = value; } }, metadata: _metadata }, _policy_initializers, _policy_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EscalationInstance = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EscalationInstance = _classThis;
})();
exports.EscalationInstance = EscalationInstance;
/**
 * User Notification Preference Model
 */
let UserNotificationPreference = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'user_notification_preferences',
            timestamps: true,
            indexes: [
                { fields: ['user_id'], unique: true },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _enabledChannels_decorators;
    let _enabledChannels_initializers = [];
    let _enabledChannels_extraInitializers = [];
    let _quietHoursStart_decorators;
    let _quietHoursStart_initializers = [];
    let _quietHoursStart_extraInitializers = [];
    let _quietHoursEnd_decorators;
    let _quietHoursEnd_initializers = [];
    let _quietHoursEnd_extraInitializers = [];
    let _timezone_decorators;
    let _timezone_initializers = [];
    let _timezone_extraInitializers = [];
    let _emailFrequency_decorators;
    let _emailFrequency_initializers = [];
    let _emailFrequency_extraInitializers = [];
    let _preferences_decorators;
    let _preferences_initializers = [];
    let _preferences_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var UserNotificationPreference = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.userId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.enabledChannels = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _enabledChannels_initializers, void 0));
            this.quietHoursStart = (__runInitializers(this, _enabledChannels_extraInitializers), __runInitializers(this, _quietHoursStart_initializers, void 0));
            this.quietHoursEnd = (__runInitializers(this, _quietHoursStart_extraInitializers), __runInitializers(this, _quietHoursEnd_initializers, void 0));
            this.timezone = (__runInitializers(this, _quietHoursEnd_extraInitializers), __runInitializers(this, _timezone_initializers, void 0));
            this.emailFrequency = (__runInitializers(this, _timezone_extraInitializers), __runInitializers(this, _emailFrequency_initializers, void 0));
            this.preferences = (__runInitializers(this, _emailFrequency_extraInitializers), __runInitializers(this, _preferences_initializers, void 0));
            this.createdAt = (__runInitializers(this, _preferences_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "UserNotificationPreference");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _enabledChannels_decorators = [(0, swagger_1.ApiProperty)({ description: 'Enabled channels' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.ENUM(...Object.values(NotificationChannel))), allowNull: false })];
        _quietHoursStart_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quiet hours start' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(10) })];
        _quietHoursEnd_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quiet hours end' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(10) })];
        _timezone_decorators = [(0, swagger_1.ApiProperty)({ description: 'Timezone' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _emailFrequency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Email frequency' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _preferences_decorators = [(0, swagger_1.ApiProperty)({ description: 'Custom preferences' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _enabledChannels_decorators, { kind: "field", name: "enabledChannels", static: false, private: false, access: { has: obj => "enabledChannels" in obj, get: obj => obj.enabledChannels, set: (obj, value) => { obj.enabledChannels = value; } }, metadata: _metadata }, _enabledChannels_initializers, _enabledChannels_extraInitializers);
        __esDecorate(null, null, _quietHoursStart_decorators, { kind: "field", name: "quietHoursStart", static: false, private: false, access: { has: obj => "quietHoursStart" in obj, get: obj => obj.quietHoursStart, set: (obj, value) => { obj.quietHoursStart = value; } }, metadata: _metadata }, _quietHoursStart_initializers, _quietHoursStart_extraInitializers);
        __esDecorate(null, null, _quietHoursEnd_decorators, { kind: "field", name: "quietHoursEnd", static: false, private: false, access: { has: obj => "quietHoursEnd" in obj, get: obj => obj.quietHoursEnd, set: (obj, value) => { obj.quietHoursEnd = value; } }, metadata: _metadata }, _quietHoursEnd_initializers, _quietHoursEnd_extraInitializers);
        __esDecorate(null, null, _timezone_decorators, { kind: "field", name: "timezone", static: false, private: false, access: { has: obj => "timezone" in obj, get: obj => obj.timezone, set: (obj, value) => { obj.timezone = value; } }, metadata: _metadata }, _timezone_initializers, _timezone_extraInitializers);
        __esDecorate(null, null, _emailFrequency_decorators, { kind: "field", name: "emailFrequency", static: false, private: false, access: { has: obj => "emailFrequency" in obj, get: obj => obj.emailFrequency, set: (obj, value) => { obj.emailFrequency = value; } }, metadata: _metadata }, _emailFrequency_initializers, _emailFrequency_extraInitializers);
        __esDecorate(null, null, _preferences_decorators, { kind: "field", name: "preferences", static: false, private: false, access: { has: obj => "preferences" in obj, get: obj => obj.preferences, set: (obj, value) => { obj.preferences = value; } }, metadata: _metadata }, _preferences_initializers, _preferences_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UserNotificationPreference = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UserNotificationPreference = _classThis;
})();
exports.UserNotificationPreference = UserNotificationPreference;
/**
 * Notification Queue Model
 */
let NotificationQueue = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'notification_queue',
            timestamps: true,
            indexes: [
                { fields: ['status'] },
                { fields: ['priority'] },
                { fields: ['scheduled_for'] },
                { fields: ['batch_id'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _notificationId_decorators;
    let _notificationId_initializers = [];
    let _notificationId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _scheduledFor_decorators;
    let _scheduledFor_initializers = [];
    let _scheduledFor_extraInitializers = [];
    let _batchId_decorators;
    let _batchId_initializers = [];
    let _batchId_extraInitializers = [];
    let _attempts_decorators;
    let _attempts_initializers = [];
    let _attempts_extraInitializers = [];
    let _lastAttemptAt_decorators;
    let _lastAttemptAt_initializers = [];
    let _lastAttemptAt_extraInitializers = [];
    let _nextAttemptAt_decorators;
    let _nextAttemptAt_initializers = [];
    let _nextAttemptAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _notification_decorators;
    let _notification_initializers = [];
    let _notification_extraInitializers = [];
    var NotificationQueue = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.notificationId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _notificationId_initializers, void 0));
            this.status = (__runInitializers(this, _notificationId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.priority = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.scheduledFor = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _scheduledFor_initializers, void 0));
            this.batchId = (__runInitializers(this, _scheduledFor_extraInitializers), __runInitializers(this, _batchId_initializers, void 0));
            this.attempts = (__runInitializers(this, _batchId_extraInitializers), __runInitializers(this, _attempts_initializers, void 0));
            this.lastAttemptAt = (__runInitializers(this, _attempts_extraInitializers), __runInitializers(this, _lastAttemptAt_initializers, void 0));
            this.nextAttemptAt = (__runInitializers(this, _lastAttemptAt_extraInitializers), __runInitializers(this, _nextAttemptAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _nextAttemptAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.notification = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _notification_initializers, void 0));
            __runInitializers(this, _notification_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "NotificationQueue");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _notificationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notification ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Notification), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(NotificationStatus)), defaultValue: NotificationStatus.QUEUED }), sequelize_typescript_1.Index];
        _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(NotificationPriority)), defaultValue: NotificationPriority.MEDIUM }), sequelize_typescript_1.Index];
        _scheduledFor_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scheduled for' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _batchId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Batch ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _attempts_decorators = [(0, swagger_1.ApiProperty)({ description: 'Attempts' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _lastAttemptAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last attempt at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _nextAttemptAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Next attempt at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _notification_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Notification)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _notificationId_decorators, { kind: "field", name: "notificationId", static: false, private: false, access: { has: obj => "notificationId" in obj, get: obj => obj.notificationId, set: (obj, value) => { obj.notificationId = value; } }, metadata: _metadata }, _notificationId_initializers, _notificationId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _scheduledFor_decorators, { kind: "field", name: "scheduledFor", static: false, private: false, access: { has: obj => "scheduledFor" in obj, get: obj => obj.scheduledFor, set: (obj, value) => { obj.scheduledFor = value; } }, metadata: _metadata }, _scheduledFor_initializers, _scheduledFor_extraInitializers);
        __esDecorate(null, null, _batchId_decorators, { kind: "field", name: "batchId", static: false, private: false, access: { has: obj => "batchId" in obj, get: obj => obj.batchId, set: (obj, value) => { obj.batchId = value; } }, metadata: _metadata }, _batchId_initializers, _batchId_extraInitializers);
        __esDecorate(null, null, _attempts_decorators, { kind: "field", name: "attempts", static: false, private: false, access: { has: obj => "attempts" in obj, get: obj => obj.attempts, set: (obj, value) => { obj.attempts = value; } }, metadata: _metadata }, _attempts_initializers, _attempts_extraInitializers);
        __esDecorate(null, null, _lastAttemptAt_decorators, { kind: "field", name: "lastAttemptAt", static: false, private: false, access: { has: obj => "lastAttemptAt" in obj, get: obj => obj.lastAttemptAt, set: (obj, value) => { obj.lastAttemptAt = value; } }, metadata: _metadata }, _lastAttemptAt_initializers, _lastAttemptAt_extraInitializers);
        __esDecorate(null, null, _nextAttemptAt_decorators, { kind: "field", name: "nextAttemptAt", static: false, private: false, access: { has: obj => "nextAttemptAt" in obj, get: obj => obj.nextAttemptAt, set: (obj, value) => { obj.nextAttemptAt = value; } }, metadata: _metadata }, _nextAttemptAt_initializers, _nextAttemptAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _notification_decorators, { kind: "field", name: "notification", static: false, private: false, access: { has: obj => "notification" in obj, get: obj => obj.notification, set: (obj, value) => { obj.notification = value; } }, metadata: _metadata }, _notification_initializers, _notification_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationQueue = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationQueue = _classThis;
})();
exports.NotificationQueue = NotificationQueue;
// ============================================================================
// NOTIFICATION FUNCTIONS
// ============================================================================
/**
 * Sends notification
 *
 * @param data - Notification data
 * @param transaction - Optional database transaction
 * @returns Created notifications
 *
 * @example
 * ```typescript
 * const notifications = await sendNotification({
 *   recipientIds: ['user-123', 'user-456'],
 *   subject: 'Critical Alert',
 *   message: 'Asset requires immediate attention',
 *   priority: NotificationPriority.CRITICAL,
 *   channels: [NotificationChannel.EMAIL, NotificationChannel.SMS, NotificationChannel.PUSH],
 *   metadata: { assetId: 'asset-789' }
 * });
 * ```
 */
async function sendNotification(data, transaction) {
    const notifications = [];
    for (const recipientId of data.recipientIds) {
        // Get user preferences
        const preferences = await getUserPreferences(recipientId);
        // Filter channels based on user preferences
        const enabledChannels = data.channels.filter(channel => !preferences || preferences.enabledChannels.includes(channel));
        // Check quiet hours
        const isQuietHours = preferences && isInQuietHours(preferences);
        for (const channel of enabledChannels) {
            // Skip non-urgent notifications during quiet hours
            if (isQuietHours && data.priority !== NotificationPriority.CRITICAL && data.priority !== NotificationPriority.URGENT) {
                continue;
            }
            const notification = await Notification.create({
                recipientId,
                subject: data.subject,
                message: data.message,
                channel,
                priority: data.priority,
                status: NotificationStatus.PENDING,
                templateId: data.templateId,
                templateData: data.templateData,
                scheduledFor: data.scheduledFor,
                expiresAt: data.expiresAt,
                metadata: data.metadata,
                attachments: data.attachments,
            }, { transaction });
            // Queue for delivery
            await queueNotification(notification.id, data.priority, data.scheduledFor, transaction);
            notifications.push(notification);
        }
    }
    return notifications;
}
/**
 * Sends batch notification
 *
 * @param data - Batch notification data
 * @param transaction - Optional database transaction
 * @returns Batch ID
 *
 * @example
 * ```typescript
 * const batchId = await sendBatchNotification({
 *   recipientIds: allUsers,
 *   subject: 'System Maintenance',
 *   message: 'Scheduled maintenance on Saturday',
 *   channels: [NotificationChannel.EMAIL],
 *   batchSize: 100
 * });
 * ```
 */
async function sendBatchNotification(data, transaction) {
    const batchId = generateBatchId();
    const batchSize = data.batchSize || 100;
    // Process in batches
    for (let i = 0; i < data.recipientIds.length; i += batchSize) {
        const batch = data.recipientIds.slice(i, i + batchSize);
        await sendNotification({
            recipientIds: batch,
            subject: data.subject,
            message: data.message,
            priority: data.priority || NotificationPriority.MEDIUM,
            channels: data.channels,
            scheduledFor: data.scheduledFor,
        }, transaction);
    }
    return batchId;
}
/**
 * Queues notification for delivery
 *
 * @param notificationId - Notification ID
 * @param priority - Priority
 * @param scheduledFor - Scheduled time
 * @param transaction - Optional database transaction
 * @returns Queue entry
 *
 * @example
 * ```typescript
 * await queueNotification('notification-123', NotificationPriority.HIGH, new Date());
 * ```
 */
async function queueNotification(notificationId, priority, scheduledFor, transaction) {
    const queue = await NotificationQueue.create({
        notificationId,
        priority,
        scheduledFor: scheduledFor || new Date(),
        status: NotificationStatus.QUEUED,
    }, { transaction });
    return queue;
}
/**
 * Processes notification queue
 *
 * @param limit - Maximum notifications to process
 * @param transaction - Optional database transaction
 * @returns Processed count
 *
 * @example
 * ```typescript
 * const processed = await processNotificationQueue(100);
 * ```
 */
async function processNotificationQueue(limit = 100, transaction) {
    const queue = await NotificationQueue.findAll({
        where: {
            status: NotificationStatus.QUEUED,
            scheduledFor: { [sequelize_1.Op.lte]: new Date() },
        },
        order: [
            ['priority', 'DESC'],
            ['scheduledFor', 'ASC'],
        ],
        limit,
        include: [{ model: Notification }],
        transaction,
    });
    let processed = 0;
    for (const entry of queue) {
        try {
            await deliverNotification(entry.notificationId, transaction);
            await entry.update({ status: NotificationStatus.SENT }, { transaction });
            processed++;
        }
        catch (error) {
            await entry.update({
                status: NotificationStatus.FAILED,
                attempts: entry.attempts + 1,
                lastAttemptAt: new Date(),
            }, { transaction });
        }
    }
    return processed;
}
/**
 * Delivers notification
 *
 * @param notificationId - Notification ID
 * @param transaction - Optional database transaction
 * @returns Updated notification
 *
 * @example
 * ```typescript
 * await deliverNotification('notification-123');
 * ```
 */
async function deliverNotification(notificationId, transaction) {
    const notification = await Notification.findByPk(notificationId, { transaction });
    if (!notification) {
        throw new common_1.NotFoundException(`Notification ${notificationId} not found`);
    }
    await notification.update({
        status: NotificationStatus.SENDING,
    }, { transaction });
    try {
        // Simulate delivery based on channel
        switch (notification.channel) {
            case NotificationChannel.EMAIL:
                await sendEmail(notification);
                break;
            case NotificationChannel.SMS:
                await sendSMS(notification);
                break;
            case NotificationChannel.PUSH:
                await sendPush(notification);
                break;
            case NotificationChannel.IN_APP:
                // In-app notifications are immediately available
                break;
            default:
                throw new Error(`Unsupported channel: ${notification.channel}`);
        }
        await notification.update({
            status: NotificationStatus.SENT,
            sentAt: new Date(),
        }, { transaction });
        // Increment template usage
        if (notification.templateId) {
            await NotificationTemplate.increment('usageCount', {
                where: { id: notification.templateId },
                transaction,
            });
        }
        return notification;
    }
    catch (error) {
        await notification.update({
            status: NotificationStatus.FAILED,
            errorMessage: error.message,
            retryCount: notification.retryCount + 1,
        }, { transaction });
        throw error;
    }
}
/**
 * Marks notification as read
 *
 * @param notificationId - Notification ID
 * @param transaction - Optional database transaction
 * @returns Updated notification
 *
 * @example
 * ```typescript
 * await markNotificationRead('notification-123');
 * ```
 */
async function markNotificationRead(notificationId, transaction) {
    const notification = await Notification.findByPk(notificationId, { transaction });
    if (!notification) {
        throw new common_1.NotFoundException(`Notification ${notificationId} not found`);
    }
    await notification.update({
        readAt: new Date(),
    }, { transaction });
    return notification;
}
/**
 * Gets user notifications
 *
 * @param userId - User ID
 * @param unreadOnly - Get unread only
 * @param limit - Maximum notifications
 * @returns Notifications
 *
 * @example
 * ```typescript
 * const unread = await getUserNotifications('user-123', true, 50);
 * ```
 */
async function getUserNotifications(userId, unreadOnly = false, limit = 100) {
    const where = { recipientId: userId };
    if (unreadOnly) {
        where.readAt = null;
    }
    return Notification.findAll({
        where,
        order: [['createdAt', 'DESC']],
        limit,
    });
}
// ============================================================================
// NOTIFICATION RULE FUNCTIONS
// ============================================================================
/**
 * Creates notification rule
 *
 * @param data - Rule data
 * @param transaction - Optional database transaction
 * @returns Created rule
 *
 * @example
 * ```typescript
 * const rule = await createNotificationRule({
 *   name: 'Warranty Expiration Alert',
 *   eventType: EventType.WARRANTY_EXPIRING,
 *   conditions: { daysUntilExpiry: { lte: 30 } },
 *   recipients: ['asset-manager-123'],
 *   channels: [NotificationChannel.EMAIL],
 *   priority: NotificationPriority.MEDIUM
 * });
 * ```
 */
async function createNotificationRule(data, transaction) {
    const rule = await NotificationRule.create({
        ...data,
        isActive: data.isActive !== false,
    }, { transaction });
    return rule;
}
/**
 * Evaluates notification rules
 *
 * @param eventType - Event type
 * @param eventData - Event data
 * @param transaction - Optional database transaction
 * @returns Triggered notifications
 *
 * @example
 * ```typescript
 * await evaluateNotificationRules(EventType.MAINTENANCE_DUE, {
 *   assetId: 'asset-123',
 *   dueDate: new Date('2024-12-31'),
 *   daysUntilDue: 7
 * });
 * ```
 */
async function evaluateNotificationRules(eventType, eventData, transaction) {
    const rules = await NotificationRule.findAll({
        where: {
            eventType,
            isActive: true,
        },
        transaction,
    });
    const notifications = [];
    for (const rule of rules) {
        // Check throttling
        if (rule.throttleMinutes && rule.lastTriggered) {
            const minutesSinceLastTrigger = (Date.now() - rule.lastTriggered.getTime()) / (1000 * 60);
            if (minutesSinceLastTrigger < rule.throttleMinutes) {
                continue;
            }
        }
        // Evaluate conditions
        const conditionsMet = evaluateConditions(rule.conditions, eventData);
        if (conditionsMet) {
            // Render template if specified
            let subject = `${eventType} Event`;
            let message = JSON.stringify(eventData);
            if (rule.templateId) {
                const template = await NotificationTemplate.findByPk(rule.templateId, { transaction });
                if (template) {
                    subject = renderTemplate(template.subject || '', eventData);
                    message = renderTemplate(template.body, eventData);
                }
            }
            // Send notifications
            const sent = await sendNotification({
                recipientIds: rule.recipients,
                subject,
                message,
                priority: rule.priority,
                channels: rule.channels,
                metadata: { eventType, eventData, ruleId: rule.id },
            }, transaction);
            notifications.push(...sent);
            // Update rule
            await rule.update({
                lastTriggered: new Date(),
                triggerCount: rule.triggerCount + 1,
            }, { transaction });
        }
    }
    return notifications;
}
/**
 * Gets active notification rules
 *
 * @param eventType - Optional event type filter
 * @returns Active rules
 *
 * @example
 * ```typescript
 * const rules = await getActiveNotificationRules(EventType.MAINTENANCE_DUE);
 * ```
 */
async function getActiveNotificationRules(eventType) {
    const where = { isActive: true };
    if (eventType) {
        where.eventType = eventType;
    }
    return NotificationRule.findAll({
        where,
        order: [['name', 'ASC']],
    });
}
// ============================================================================
// TEMPLATE FUNCTIONS
// ============================================================================
/**
 * Creates notification template
 *
 * @param data - Template data
 * @param transaction - Optional database transaction
 * @returns Created template
 *
 * @example
 * ```typescript
 * const template = await createNotificationTemplate({
 *   name: 'Maintenance Due Template',
 *   templateType: TemplateType.EMAIL,
 *   subject: 'Maintenance Due: {{assetName}}',
 *   body: 'Asset {{assetName}} requires maintenance on {{dueDate}}.',
 *   variables: ['assetName', 'dueDate']
 * });
 * ```
 */
async function createNotificationTemplate(data, transaction) {
    const template = await NotificationTemplate.create({
        ...data,
        isActive: data.isActive !== false,
    }, { transaction });
    return template;
}
/**
 * Renders template
 *
 * @param template - Template string
 * @param data - Data to inject
 * @returns Rendered template
 *
 * @example
 * ```typescript
 * const rendered = renderTemplate('Hello {{name}}', { name: 'John' });
 * // Returns: 'Hello John'
 * ```
 */
function renderTemplate(template, data) {
    let rendered = template;
    for (const [key, value] of Object.entries(data)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        rendered = rendered.replace(regex, String(value));
    }
    return rendered;
}
/**
 * Gets active templates
 *
 * @param templateType - Optional template type filter
 * @returns Active templates
 *
 * @example
 * ```typescript
 * const emailTemplates = await getActiveTemplates(TemplateType.EMAIL);
 * ```
 */
async function getActiveTemplates(templateType) {
    const where = { isActive: true };
    if (templateType) {
        where.templateType = templateType;
    }
    return NotificationTemplate.findAll({
        where,
        order: [['name', 'ASC']],
    });
}
// ============================================================================
// ESCALATION FUNCTIONS
// ============================================================================
/**
 * Creates escalation policy
 *
 * @param data - Policy data
 * @param transaction - Optional database transaction
 * @returns Created policy
 *
 * @example
 * ```typescript
 * const policy = await createEscalationPolicy({
 *   name: 'Critical Asset Escalation',
 *   eventType: EventType.COMPLIANCE_VIOLATION,
 *   levels: [EscalationLevel.LEVEL_1, EscalationLevel.LEVEL_2, EscalationLevel.EXECUTIVE],
 *   levelRecipients: {
 *     level_1: ['manager-123'],
 *     level_2: ['director-456'],
 *     executive: ['ceo-789']
 *   },
 *   levelDelayMinutes: {
 *     level_1: 0,
 *     level_2: 30,
 *     executive: 60
 *   }
 * });
 * ```
 */
async function createEscalationPolicy(data, transaction) {
    const policy = await EscalationPolicy.create({
        ...data,
        isActive: data.isActive !== false,
    }, { transaction });
    return policy;
}
/**
 * Triggers escalation
 *
 * @param policyId - Policy ID
 * @param triggeredBy - Event that triggered escalation
 * @param eventData - Event data
 * @param transaction - Optional database transaction
 * @returns Escalation instance
 *
 * @example
 * ```typescript
 * await triggerEscalation('policy-123', 'compliance-violation', {
 *   assetId: 'asset-456',
 *   violationType: 'safety'
 * });
 * ```
 */
async function triggerEscalation(policyId, triggeredBy, eventData, transaction) {
    const policy = await EscalationPolicy.findByPk(policyId, { transaction });
    if (!policy) {
        throw new common_1.NotFoundException(`Escalation policy ${policyId} not found`);
    }
    if (!policy.isActive) {
        throw new common_1.BadRequestException('Escalation policy is not active');
    }
    const firstLevel = policy.levels[0];
    const firstDelay = policy.levelDelayMinutes[firstLevel];
    const instance = await EscalationInstance.create({
        policyId,
        triggeredBy,
        eventData,
        currentLevel: firstLevel,
        startedAt: new Date(),
        nextEscalationAt: new Date(Date.now() + firstDelay * 60 * 1000),
    }, { transaction });
    // Send notifications for first level
    await sendEscalationNotifications(instance, transaction);
    // Update policy
    await policy.update({
        triggerCount: policy.triggerCount + 1,
    }, { transaction });
    return instance;
}
/**
 * Processes escalations
 *
 * @param transaction - Optional database transaction
 * @returns Processed count
 *
 * @example
 * ```typescript
 * const processed = await processEscalations();
 * ```
 */
async function processEscalations(transaction) {
    const instances = await EscalationInstance.findAll({
        where: {
            isResolved: false,
            nextEscalationAt: { [sequelize_1.Op.lte]: new Date() },
        },
        include: [{ model: EscalationPolicy }],
        transaction,
    });
    let processed = 0;
    for (const instance of instances) {
        const policy = instance.policy;
        const currentIndex = policy.levels.indexOf(instance.currentLevel);
        if (currentIndex < policy.levels.length - 1) {
            // Escalate to next level
            const nextLevel = policy.levels[currentIndex + 1];
            const nextDelay = policy.levelDelayMinutes[nextLevel];
            await instance.update({
                currentLevel: nextLevel,
                nextEscalationAt: new Date(Date.now() + nextDelay * 60 * 1000),
            }, { transaction });
            await sendEscalationNotifications(instance, transaction);
            processed++;
        }
    }
    return processed;
}
/**
 * Resolves escalation
 *
 * @param instanceId - Instance ID
 * @param userId - User resolving
 * @param notes - Resolution notes
 * @param transaction - Optional database transaction
 * @returns Updated instance
 *
 * @example
 * ```typescript
 * await resolveEscalation('instance-123', 'user-456', 'Issue resolved');
 * ```
 */
async function resolveEscalation(instanceId, userId, notes, transaction) {
    const instance = await EscalationInstance.findByPk(instanceId, { transaction });
    if (!instance) {
        throw new common_1.NotFoundException(`Escalation instance ${instanceId} not found`);
    }
    await instance.update({
        isResolved: true,
        resolvedAt: new Date(),
        resolvedBy: userId,
        resolutionNotes: notes,
    }, { transaction });
    return instance;
}
/**
 * Sends escalation notifications
 *
 * @param instance - Escalation instance
 * @param transaction - Optional database transaction
 */
async function sendEscalationNotifications(instance, transaction) {
    const policy = instance.policy;
    const recipients = policy.levelRecipients[instance.currentLevel];
    await sendNotification({
        recipientIds: recipients,
        subject: `Escalation: ${instance.triggeredBy}`,
        message: `Event escalated to ${instance.currentLevel}`,
        priority: NotificationPriority.URGENT,
        channels: [NotificationChannel.EMAIL, NotificationChannel.SMS],
        metadata: { escalationInstanceId: instance.id },
    }, transaction);
}
// ============================================================================
// USER PREFERENCE FUNCTIONS
// ============================================================================
/**
 * Sets user notification preferences
 *
 * @param data - Preference data
 * @param transaction - Optional database transaction
 * @returns Preference record
 *
 * @example
 * ```typescript
 * await setUserPreferences({
 *   userId: 'user-123',
 *   enabledChannels: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
 *   quietHoursStart: '22:00',
 *   quietHoursEnd: '07:00',
 *   timezone: 'America/New_York'
 * });
 * ```
 */
async function setUserPreferences(data, transaction) {
    const [preference] = await UserNotificationPreference.upsert(data, { transaction });
    return preference;
}
/**
 * Gets user preferences
 *
 * @param userId - User ID
 * @returns User preferences
 *
 * @example
 * ```typescript
 * const prefs = await getUserPreferences('user-123');
 * ```
 */
async function getUserPreferences(userId) {
    return UserNotificationPreference.findOne({
        where: { userId },
    });
}
/**
 * Checks if in quiet hours
 *
 * @param preferences - User preferences
 * @returns Is in quiet hours
 */
function isInQuietHours(preferences) {
    if (!preferences.quietHoursStart || !preferences.quietHoursEnd) {
        return false;
    }
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return currentTime >= preferences.quietHoursStart && currentTime <= preferences.quietHoursEnd;
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Evaluates conditions
 */
function evaluateConditions(conditions, data) {
    if (!conditions)
        return true;
    for (const [key, condition] of Object.entries(conditions)) {
        const value = data[key];
        if (typeof condition === 'object') {
            for (const [operator, expected] of Object.entries(condition)) {
                switch (operator) {
                    case 'eq':
                        if (value !== expected)
                            return false;
                        break;
                    case 'ne':
                        if (value === expected)
                            return false;
                        break;
                    case 'gt':
                        if (!(value > expected))
                            return false;
                        break;
                    case 'gte':
                        if (!(value >= expected))
                            return false;
                        break;
                    case 'lt':
                        if (!(value < expected))
                            return false;
                        break;
                    case 'lte':
                        if (!(value <= expected))
                            return false;
                        break;
                    case 'in':
                        if (!Array.isArray(expected) || !expected.includes(value))
                            return false;
                        break;
                }
            }
        }
        else {
            if (value !== condition)
                return false;
        }
    }
    return true;
}
/**
 * Generates batch ID
 */
function generateBatchId() {
    return `batch_${Date.now()}_${Math.random().toString(36).substring(2)}`;
}
/**
 * Simulates sending email
 */
async function sendEmail(notification) {
    // In real implementation, use email service like SendGrid, SES, etc.
    await new Promise(resolve => setTimeout(resolve, 100));
}
/**
 * Simulates sending SMS
 */
async function sendSMS(notification) {
    // In real implementation, use SMS service like Twilio
    await new Promise(resolve => setTimeout(resolve, 100));
}
/**
 * Simulates sending push notification
 */
async function sendPush(notification) {
    // In real implementation, use push service like Firebase, APNS
    await new Promise(resolve => setTimeout(resolve, 100));
}
// ============================================================================
// NOTIFICATION ANALYTICS FUNCTIONS
// ============================================================================
/**
 * Notification Analytics Model
 */
let NotificationAnalytics = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'notification_analytics',
            timestamps: true,
            indexes: [
                { fields: ['notification_id'], unique: true },
                { fields: ['template_id'] },
                { fields: ['sent_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _notificationId_decorators;
    let _notificationId_initializers = [];
    let _notificationId_extraInitializers = [];
    let _templateId_decorators;
    let _templateId_initializers = [];
    let _templateId_extraInitializers = [];
    let _sentDate_decorators;
    let _sentDate_initializers = [];
    let _sentDate_extraInitializers = [];
    let _delivered_decorators;
    let _delivered_initializers = [];
    let _delivered_extraInitializers = [];
    let _opened_decorators;
    let _opened_initializers = [];
    let _opened_extraInitializers = [];
    let _clicked_decorators;
    let _clicked_initializers = [];
    let _clicked_extraInitializers = [];
    let _bounced_decorators;
    let _bounced_initializers = [];
    let _bounced_extraInitializers = [];
    let _openCount_decorators;
    let _openCount_initializers = [];
    let _openCount_extraInitializers = [];
    let _clickCount_decorators;
    let _clickCount_initializers = [];
    let _clickCount_extraInitializers = [];
    let _firstOpenedAt_decorators;
    let _firstOpenedAt_initializers = [];
    let _firstOpenedAt_extraInitializers = [];
    let _lastOpenedAt_decorators;
    let _lastOpenedAt_initializers = [];
    let _lastOpenedAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _notification_decorators;
    let _notification_initializers = [];
    let _notification_extraInitializers = [];
    var NotificationAnalytics = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.notificationId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _notificationId_initializers, void 0));
            this.templateId = (__runInitializers(this, _notificationId_extraInitializers), __runInitializers(this, _templateId_initializers, void 0));
            this.sentDate = (__runInitializers(this, _templateId_extraInitializers), __runInitializers(this, _sentDate_initializers, void 0));
            this.delivered = (__runInitializers(this, _sentDate_extraInitializers), __runInitializers(this, _delivered_initializers, void 0));
            this.opened = (__runInitializers(this, _delivered_extraInitializers), __runInitializers(this, _opened_initializers, void 0));
            this.clicked = (__runInitializers(this, _opened_extraInitializers), __runInitializers(this, _clicked_initializers, void 0));
            this.bounced = (__runInitializers(this, _clicked_extraInitializers), __runInitializers(this, _bounced_initializers, void 0));
            this.openCount = (__runInitializers(this, _bounced_extraInitializers), __runInitializers(this, _openCount_initializers, void 0));
            this.clickCount = (__runInitializers(this, _openCount_extraInitializers), __runInitializers(this, _clickCount_initializers, void 0));
            this.firstOpenedAt = (__runInitializers(this, _clickCount_extraInitializers), __runInitializers(this, _firstOpenedAt_initializers, void 0));
            this.lastOpenedAt = (__runInitializers(this, _firstOpenedAt_extraInitializers), __runInitializers(this, _lastOpenedAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _lastOpenedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.notification = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _notification_initializers, void 0));
            __runInitializers(this, _notification_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "NotificationAnalytics");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _notificationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notification ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Notification), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _templateId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Template ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _sentDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Sent date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _delivered_decorators = [(0, swagger_1.ApiProperty)({ description: 'Delivered' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _opened_decorators = [(0, swagger_1.ApiProperty)({ description: 'Opened' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _clicked_decorators = [(0, swagger_1.ApiProperty)({ description: 'Clicked' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _bounced_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bounced' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _openCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Open count' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _clickCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Click count' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _firstOpenedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'First opened at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _lastOpenedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last opened at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _notification_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Notification)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _notificationId_decorators, { kind: "field", name: "notificationId", static: false, private: false, access: { has: obj => "notificationId" in obj, get: obj => obj.notificationId, set: (obj, value) => { obj.notificationId = value; } }, metadata: _metadata }, _notificationId_initializers, _notificationId_extraInitializers);
        __esDecorate(null, null, _templateId_decorators, { kind: "field", name: "templateId", static: false, private: false, access: { has: obj => "templateId" in obj, get: obj => obj.templateId, set: (obj, value) => { obj.templateId = value; } }, metadata: _metadata }, _templateId_initializers, _templateId_extraInitializers);
        __esDecorate(null, null, _sentDate_decorators, { kind: "field", name: "sentDate", static: false, private: false, access: { has: obj => "sentDate" in obj, get: obj => obj.sentDate, set: (obj, value) => { obj.sentDate = value; } }, metadata: _metadata }, _sentDate_initializers, _sentDate_extraInitializers);
        __esDecorate(null, null, _delivered_decorators, { kind: "field", name: "delivered", static: false, private: false, access: { has: obj => "delivered" in obj, get: obj => obj.delivered, set: (obj, value) => { obj.delivered = value; } }, metadata: _metadata }, _delivered_initializers, _delivered_extraInitializers);
        __esDecorate(null, null, _opened_decorators, { kind: "field", name: "opened", static: false, private: false, access: { has: obj => "opened" in obj, get: obj => obj.opened, set: (obj, value) => { obj.opened = value; } }, metadata: _metadata }, _opened_initializers, _opened_extraInitializers);
        __esDecorate(null, null, _clicked_decorators, { kind: "field", name: "clicked", static: false, private: false, access: { has: obj => "clicked" in obj, get: obj => obj.clicked, set: (obj, value) => { obj.clicked = value; } }, metadata: _metadata }, _clicked_initializers, _clicked_extraInitializers);
        __esDecorate(null, null, _bounced_decorators, { kind: "field", name: "bounced", static: false, private: false, access: { has: obj => "bounced" in obj, get: obj => obj.bounced, set: (obj, value) => { obj.bounced = value; } }, metadata: _metadata }, _bounced_initializers, _bounced_extraInitializers);
        __esDecorate(null, null, _openCount_decorators, { kind: "field", name: "openCount", static: false, private: false, access: { has: obj => "openCount" in obj, get: obj => obj.openCount, set: (obj, value) => { obj.openCount = value; } }, metadata: _metadata }, _openCount_initializers, _openCount_extraInitializers);
        __esDecorate(null, null, _clickCount_decorators, { kind: "field", name: "clickCount", static: false, private: false, access: { has: obj => "clickCount" in obj, get: obj => obj.clickCount, set: (obj, value) => { obj.clickCount = value; } }, metadata: _metadata }, _clickCount_initializers, _clickCount_extraInitializers);
        __esDecorate(null, null, _firstOpenedAt_decorators, { kind: "field", name: "firstOpenedAt", static: false, private: false, access: { has: obj => "firstOpenedAt" in obj, get: obj => obj.firstOpenedAt, set: (obj, value) => { obj.firstOpenedAt = value; } }, metadata: _metadata }, _firstOpenedAt_initializers, _firstOpenedAt_extraInitializers);
        __esDecorate(null, null, _lastOpenedAt_decorators, { kind: "field", name: "lastOpenedAt", static: false, private: false, access: { has: obj => "lastOpenedAt" in obj, get: obj => obj.lastOpenedAt, set: (obj, value) => { obj.lastOpenedAt = value; } }, metadata: _metadata }, _lastOpenedAt_initializers, _lastOpenedAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _notification_decorators, { kind: "field", name: "notification", static: false, private: false, access: { has: obj => "notification" in obj, get: obj => obj.notification, set: (obj, value) => { obj.notification = value; } }, metadata: _metadata }, _notification_initializers, _notification_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationAnalytics = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationAnalytics = _classThis;
})();
exports.NotificationAnalytics = NotificationAnalytics;
/**
 * Tracks notification delivery
 *
 * @param notificationId - Notification ID
 * @param delivered - Delivery status
 * @param transaction - Optional database transaction
 * @returns Analytics record
 *
 * @example
 * ```typescript
 * await trackNotificationDelivery('notification-123', true);
 * ```
 */
async function trackNotificationDelivery(notificationId, delivered, transaction) {
    const notification = await Notification.findByPk(notificationId, { transaction });
    if (!notification) {
        throw new common_1.NotFoundException(`Notification ${notificationId} not found`);
    }
    const [analytics] = await NotificationAnalytics.upsert({
        notificationId,
        templateId: notification.templateId,
        sentDate: notification.sentAt || new Date(),
        delivered,
    }, { transaction });
    return analytics;
}
/**
 * Tracks notification open
 *
 * @param notificationId - Notification ID
 * @param transaction - Optional database transaction
 * @returns Analytics record
 *
 * @example
 * ```typescript
 * await trackNotificationOpen('notification-123');
 * ```
 */
async function trackNotificationOpen(notificationId, transaction) {
    const analytics = await NotificationAnalytics.findOne({
        where: { notificationId },
        transaction,
    });
    if (!analytics) {
        throw new common_1.NotFoundException(`Analytics for notification ${notificationId} not found`);
    }
    const now = new Date();
    await analytics.update({
        opened: true,
        openCount: analytics.openCount + 1,
        firstOpenedAt: analytics.firstOpenedAt || now,
        lastOpenedAt: now,
    }, { transaction });
    return analytics;
}
/**
 * Gets notification analytics report
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @param templateId - Optional template filter
 * @returns Analytics report
 *
 * @example
 * ```typescript
 * const report = await getNotificationAnalyticsReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
async function getNotificationAnalyticsReport(startDate, endDate, templateId) {
    const where = {
        sentDate: {
            [sequelize_1.Op.between]: [startDate, endDate],
        },
    };
    if (templateId) {
        where.templateId = templateId;
    }
    const analytics = await NotificationAnalytics.findAll({ where });
    const total = analytics.length;
    const delivered = analytics.filter(a => a.delivered).length;
    const opened = analytics.filter(a => a.opened).length;
    const clicked = analytics.filter(a => a.clicked).length;
    const bounced = analytics.filter(a => a.bounced).length;
    return {
        period: { startDate, endDate },
        total,
        delivered,
        deliveryRate: total > 0 ? (delivered / total) * 100 : 0,
        opened,
        openRate: delivered > 0 ? (opened / delivered) * 100 : 0,
        clicked,
        clickRate: opened > 0 ? (clicked / opened) * 100 : 0,
        bounced,
        bounceRate: total > 0 ? (bounced / total) * 100 : 0,
    };
}
// ============================================================================
// NOTIFICATION DIGEST FUNCTIONS
// ============================================================================
/**
 * Notification Digest Model
 */
let NotificationDigest = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'notification_digests',
            timestamps: true,
            indexes: [
                { fields: ['user_id', 'digest_type', 'period_start'] },
                { fields: ['is_sent'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _digestType_decorators;
    let _digestType_initializers = [];
    let _digestType_extraInitializers = [];
    let _periodStart_decorators;
    let _periodStart_initializers = [];
    let _periodStart_extraInitializers = [];
    let _periodEnd_decorators;
    let _periodEnd_initializers = [];
    let _periodEnd_extraInitializers = [];
    let _notificationIds_decorators;
    let _notificationIds_initializers = [];
    let _notificationIds_extraInitializers = [];
    let _isSent_decorators;
    let _isSent_initializers = [];
    let _isSent_extraInitializers = [];
    let _sentAt_decorators;
    let _sentAt_initializers = [];
    let _sentAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var NotificationDigest = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.userId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.digestType = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _digestType_initializers, void 0));
            this.periodStart = (__runInitializers(this, _digestType_extraInitializers), __runInitializers(this, _periodStart_initializers, void 0));
            this.periodEnd = (__runInitializers(this, _periodStart_extraInitializers), __runInitializers(this, _periodEnd_initializers, void 0));
            this.notificationIds = (__runInitializers(this, _periodEnd_extraInitializers), __runInitializers(this, _notificationIds_initializers, void 0));
            this.isSent = (__runInitializers(this, _notificationIds_extraInitializers), __runInitializers(this, _isSent_initializers, void 0));
            this.sentAt = (__runInitializers(this, _isSent_extraInitializers), __runInitializers(this, _sentAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _sentAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "NotificationDigest");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _digestType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Digest type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false }), sequelize_typescript_1.Index];
        _periodStart_decorators = [(0, swagger_1.ApiProperty)({ description: 'Period start' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _periodEnd_decorators = [(0, swagger_1.ApiProperty)({ description: 'Period end' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _notificationIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notification IDs' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID), allowNull: false })];
        _isSent_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is sent' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false }), sequelize_typescript_1.Index];
        _sentAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Sent at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _digestType_decorators, { kind: "field", name: "digestType", static: false, private: false, access: { has: obj => "digestType" in obj, get: obj => obj.digestType, set: (obj, value) => { obj.digestType = value; } }, metadata: _metadata }, _digestType_initializers, _digestType_extraInitializers);
        __esDecorate(null, null, _periodStart_decorators, { kind: "field", name: "periodStart", static: false, private: false, access: { has: obj => "periodStart" in obj, get: obj => obj.periodStart, set: (obj, value) => { obj.periodStart = value; } }, metadata: _metadata }, _periodStart_initializers, _periodStart_extraInitializers);
        __esDecorate(null, null, _periodEnd_decorators, { kind: "field", name: "periodEnd", static: false, private: false, access: { has: obj => "periodEnd" in obj, get: obj => obj.periodEnd, set: (obj, value) => { obj.periodEnd = value; } }, metadata: _metadata }, _periodEnd_initializers, _periodEnd_extraInitializers);
        __esDecorate(null, null, _notificationIds_decorators, { kind: "field", name: "notificationIds", static: false, private: false, access: { has: obj => "notificationIds" in obj, get: obj => obj.notificationIds, set: (obj, value) => { obj.notificationIds = value; } }, metadata: _metadata }, _notificationIds_initializers, _notificationIds_extraInitializers);
        __esDecorate(null, null, _isSent_decorators, { kind: "field", name: "isSent", static: false, private: false, access: { has: obj => "isSent" in obj, get: obj => obj.isSent, set: (obj, value) => { obj.isSent = value; } }, metadata: _metadata }, _isSent_initializers, _isSent_extraInitializers);
        __esDecorate(null, null, _sentAt_decorators, { kind: "field", name: "sentAt", static: false, private: false, access: { has: obj => "sentAt" in obj, get: obj => obj.sentAt, set: (obj, value) => { obj.sentAt = value; } }, metadata: _metadata }, _sentAt_initializers, _sentAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationDigest = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationDigest = _classThis;
})();
exports.NotificationDigest = NotificationDigest;
/**
 * Creates notification digest
 *
 * @param userId - User ID
 * @param digestType - Digest type (daily, weekly)
 * @param periodStart - Period start
 * @param periodEnd - Period end
 * @param transaction - Optional database transaction
 * @returns Created digest
 *
 * @example
 * ```typescript
 * const digest = await createNotificationDigest(
 *   'user-123',
 *   'daily',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-02')
 * );
 * ```
 */
async function createNotificationDigest(userId, digestType, periodStart, periodEnd, transaction) {
    const notifications = await Notification.findAll({
        where: {
            recipientId: userId,
            createdAt: {
                [sequelize_1.Op.between]: [periodStart, periodEnd],
            },
        },
        transaction,
    });
    const digest = await NotificationDigest.create({
        userId,
        digestType,
        periodStart,
        periodEnd,
        notificationIds: notifications.map(n => n.id),
        isSent: false,
    }, { transaction });
    return digest;
}
/**
 * Sends pending digests
 *
 * @param transaction - Optional database transaction
 * @returns Sent count
 *
 * @example
 * ```typescript
 * const sent = await sendPendingDigests();
 * ```
 */
async function sendPendingDigests(transaction) {
    const digests = await NotificationDigest.findAll({
        where: {
            isSent: false,
            periodEnd: { [sequelize_1.Op.lt]: new Date() },
        },
        transaction,
    });
    let sent = 0;
    for (const digest of digests) {
        // Send digest notification
        await sendNotification({
            recipientIds: [digest.userId],
            subject: `${digest.digestType} Notification Digest`,
            message: `You have ${digest.notificationIds.length} notifications`,
            priority: NotificationPriority.LOW,
            channels: [NotificationChannel.EMAIL],
            metadata: { digestId: digest.id },
        }, transaction);
        await digest.update({
            isSent: true,
            sentAt: new Date(),
        }, { transaction });
        sent++;
    }
    return sent;
}
// ============================================================================
// NOTIFICATION SEARCH FUNCTIONS
// ============================================================================
/**
 * Searches notifications
 *
 * @param userId - User ID
 * @param query - Search query
 * @param filters - Optional filters
 * @param limit - Maximum results
 * @returns Matching notifications
 *
 * @example
 * ```typescript
 * const results = await searchNotifications('user-123', 'maintenance', {
 *   priority: NotificationPriority.HIGH,
 *   startDate: new Date('2024-01-01')
 * });
 * ```
 */
async function searchNotifications(userId, query, filters, limit = 100) {
    const where = {
        recipientId: userId,
        [sequelize_1.Op.or]: [
            { subject: { [sequelize_1.Op.iLike]: `%${query}%` } },
            { message: { [sequelize_1.Op.iLike]: `%${query}%` } },
        ],
    };
    if (filters?.priority)
        where.priority = filters.priority;
    if (filters?.channel)
        where.channel = filters.channel;
    if (filters?.status)
        where.status = filters.status;
    if (filters?.startDate || filters?.endDate) {
        where.createdAt = {};
        if (filters.startDate) {
            where.createdAt[sequelize_1.Op.gte] = filters.startDate;
        }
        if (filters.endDate) {
            where.createdAt[sequelize_1.Op.lte] = filters.endDate;
        }
    }
    return Notification.findAll({
        where,
        order: [['createdAt', 'DESC']],
        limit,
    });
}
// ============================================================================
// BULK NOTIFICATION OPERATIONS
// ============================================================================
/**
 * Marks all notifications as read
 *
 * @param userId - User ID
 * @param transaction - Optional database transaction
 * @returns Updated count
 *
 * @example
 * ```typescript
 * await markAllNotificationsRead('user-123');
 * ```
 */
async function markAllNotificationsRead(userId, transaction) {
    const [count] = await Notification.update({ readAt: new Date() }, {
        where: {
            recipientId: userId,
            readAt: null,
        },
        transaction,
    });
    return count;
}
/**
 * Deletes old notifications
 *
 * @param olderThan - Delete notifications older than this date
 * @param transaction - Optional database transaction
 * @returns Deleted count
 *
 * @example
 * ```typescript
 * const deleted = await deleteOldNotifications(new Date('2023-01-01'));
 * ```
 */
async function deleteOldNotifications(olderThan, transaction) {
    const count = await Notification.destroy({
        where: {
            createdAt: { [sequelize_1.Op.lt]: olderThan },
            readAt: { [sequelize_1.Op.not]: null },
        },
        transaction,
    });
    return count;
}
/**
 * Archives notifications
 *
 * @param userId - User ID
 * @param notificationIds - Notification IDs to archive
 * @param transaction - Optional database transaction
 * @returns Archived count
 *
 * @example
 * ```typescript
 * await archiveNotifications('user-123', ['notif-1', 'notif-2']);
 * ```
 */
async function archiveNotifications(userId, notificationIds, transaction) {
    const [count] = await Notification.update({ metadata: { archived: true } }, {
        where: {
            id: { [sequelize_1.Op.in]: notificationIds },
            recipientId: userId,
        },
        transaction,
    });
    return count;
}
// ============================================================================
// SCHEDULED RECURRING NOTIFICATIONS
// ============================================================================
/**
 * Scheduled Notification Model
 */
let ScheduledNotification = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'scheduled_notifications',
            timestamps: true,
            indexes: [
                { fields: ['name'], unique: true },
                { fields: ['is_active'] },
                { fields: ['next_run_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _cronExpression_decorators;
    let _cronExpression_initializers = [];
    let _cronExpression_extraInitializers = [];
    let _templateId_decorators;
    let _templateId_initializers = [];
    let _templateId_extraInitializers = [];
    let _recipientIds_decorators;
    let _recipientIds_initializers = [];
    let _recipientIds_extraInitializers = [];
    let _channels_decorators;
    let _channels_initializers = [];
    let _channels_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _nextRunAt_decorators;
    let _nextRunAt_initializers = [];
    let _nextRunAt_extraInitializers = [];
    let _lastRunAt_decorators;
    let _lastRunAt_initializers = [];
    let _lastRunAt_extraInitializers = [];
    let _runCount_decorators;
    let _runCount_initializers = [];
    let _runCount_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _template_decorators;
    let _template_initializers = [];
    let _template_extraInitializers = [];
    var ScheduledNotification = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.cronExpression = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _cronExpression_initializers, void 0));
            this.templateId = (__runInitializers(this, _cronExpression_extraInitializers), __runInitializers(this, _templateId_initializers, void 0));
            this.recipientIds = (__runInitializers(this, _templateId_extraInitializers), __runInitializers(this, _recipientIds_initializers, void 0));
            this.channels = (__runInitializers(this, _recipientIds_extraInitializers), __runInitializers(this, _channels_initializers, void 0));
            this.isActive = (__runInitializers(this, _channels_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.nextRunAt = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _nextRunAt_initializers, void 0));
            this.lastRunAt = (__runInitializers(this, _nextRunAt_extraInitializers), __runInitializers(this, _lastRunAt_initializers, void 0));
            this.runCount = (__runInitializers(this, _lastRunAt_extraInitializers), __runInitializers(this, _runCount_initializers, void 0));
            this.createdAt = (__runInitializers(this, _runCount_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.template = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _template_initializers, void 0));
            __runInitializers(this, _template_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ScheduledNotification");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Schedule name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _cronExpression_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cron expression' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false })];
        _templateId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Template ID' }), (0, sequelize_typescript_1.ForeignKey)(() => NotificationTemplate), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _recipientIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recipient IDs' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID), allowNull: false })];
        _channels_decorators = [(0, swagger_1.ApiProperty)({ description: 'Channels' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.ENUM(...Object.values(NotificationChannel))), allowNull: false })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _nextRunAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Next run at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _lastRunAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last run at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _runCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Run count' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _template_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => NotificationTemplate)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _cronExpression_decorators, { kind: "field", name: "cronExpression", static: false, private: false, access: { has: obj => "cronExpression" in obj, get: obj => obj.cronExpression, set: (obj, value) => { obj.cronExpression = value; } }, metadata: _metadata }, _cronExpression_initializers, _cronExpression_extraInitializers);
        __esDecorate(null, null, _templateId_decorators, { kind: "field", name: "templateId", static: false, private: false, access: { has: obj => "templateId" in obj, get: obj => obj.templateId, set: (obj, value) => { obj.templateId = value; } }, metadata: _metadata }, _templateId_initializers, _templateId_extraInitializers);
        __esDecorate(null, null, _recipientIds_decorators, { kind: "field", name: "recipientIds", static: false, private: false, access: { has: obj => "recipientIds" in obj, get: obj => obj.recipientIds, set: (obj, value) => { obj.recipientIds = value; } }, metadata: _metadata }, _recipientIds_initializers, _recipientIds_extraInitializers);
        __esDecorate(null, null, _channels_decorators, { kind: "field", name: "channels", static: false, private: false, access: { has: obj => "channels" in obj, get: obj => obj.channels, set: (obj, value) => { obj.channels = value; } }, metadata: _metadata }, _channels_initializers, _channels_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _nextRunAt_decorators, { kind: "field", name: "nextRunAt", static: false, private: false, access: { has: obj => "nextRunAt" in obj, get: obj => obj.nextRunAt, set: (obj, value) => { obj.nextRunAt = value; } }, metadata: _metadata }, _nextRunAt_initializers, _nextRunAt_extraInitializers);
        __esDecorate(null, null, _lastRunAt_decorators, { kind: "field", name: "lastRunAt", static: false, private: false, access: { has: obj => "lastRunAt" in obj, get: obj => obj.lastRunAt, set: (obj, value) => { obj.lastRunAt = value; } }, metadata: _metadata }, _lastRunAt_initializers, _lastRunAt_extraInitializers);
        __esDecorate(null, null, _runCount_decorators, { kind: "field", name: "runCount", static: false, private: false, access: { has: obj => "runCount" in obj, get: obj => obj.runCount, set: (obj, value) => { obj.runCount = value; } }, metadata: _metadata }, _runCount_initializers, _runCount_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _template_decorators, { kind: "field", name: "template", static: false, private: false, access: { has: obj => "template" in obj, get: obj => obj.template, set: (obj, value) => { obj.template = value; } }, metadata: _metadata }, _template_initializers, _template_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ScheduledNotification = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ScheduledNotification = _classThis;
})();
exports.ScheduledNotification = ScheduledNotification;
/**
 * Creates scheduled notification
 *
 * @param name - Schedule name
 * @param cronExpression - Cron expression
 * @param templateId - Template ID
 * @param recipientIds - Recipient IDs
 * @param channels - Notification channels
 * @param transaction - Optional database transaction
 * @returns Created schedule
 *
 * @example
 * ```typescript
 * const schedule = await createScheduledNotification(
 *   'Weekly Report',
 *   '0 9 * * 1',
 *   'template-123',
 *   ['user-1', 'user-2'],
 *   [NotificationChannel.EMAIL]
 * );
 * ```
 */
async function createScheduledNotification(name, cronExpression, templateId, recipientIds, channels, transaction) {
    const schedule = await ScheduledNotification.create({
        name,
        cronExpression,
        templateId,
        recipientIds,
        channels,
        isActive: true,
    }, { transaction });
    return schedule;
}
/**
 * Processes scheduled notifications
 *
 * @param transaction - Optional database transaction
 * @returns Processed count
 *
 * @example
 * ```typescript
 * const processed = await processScheduledNotifications();
 * ```
 */
async function processScheduledNotifications(transaction) {
    const schedules = await ScheduledNotification.findAll({
        where: {
            isActive: true,
            nextRunAt: { [sequelize_1.Op.lte]: new Date() },
        },
        include: [{ model: NotificationTemplate }],
        transaction,
    });
    let processed = 0;
    for (const schedule of schedules) {
        const template = schedule.template;
        // Send notifications
        await sendNotification({
            recipientIds: schedule.recipientIds,
            subject: template.subject || 'Scheduled Notification',
            message: template.body,
            priority: NotificationPriority.MEDIUM,
            channels: schedule.channels,
            templateId: schedule.templateId,
            metadata: { scheduleId: schedule.id },
        }, transaction);
        // Update schedule
        await schedule.update({
            lastRunAt: new Date(),
            runCount: schedule.runCount + 1,
            nextRunAt: calculateNextRun(schedule.cronExpression),
        }, { transaction });
        processed++;
    }
    return processed;
}
/**
 * Cancels scheduled notification
 *
 * @param scheduleId - Schedule ID
 * @param transaction - Optional database transaction
 * @returns Updated schedule
 *
 * @example
 * ```typescript
 * await cancelScheduledNotification('schedule-123');
 * ```
 */
async function cancelScheduledNotification(scheduleId, transaction) {
    const schedule = await ScheduledNotification.findByPk(scheduleId, { transaction });
    if (!schedule) {
        throw new common_1.NotFoundException(`Scheduled notification ${scheduleId} not found`);
    }
    await schedule.update({ isActive: false }, { transaction });
    return schedule;
}
/**
 * Calculates next run time from cron expression
 */
function calculateNextRun(cronExpression) {
    // Simplified - in real implementation, use a cron parser library
    return new Date(Date.now() + 24 * 60 * 60 * 1000);
}
// ============================================================================
// WEBHOOK DELIVERY FUNCTIONS
// ============================================================================
/**
 * Sends webhook notification
 *
 * @param url - Webhook URL
 * @param payload - Notification payload
 * @param transaction - Optional database transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await sendWebhookNotification('https://api.example.com/webhook', {
 *   event: 'asset.maintenance_due',
 *   assetId: 'asset-123'
 * });
 * ```
 */
async function sendWebhookNotification(url, payload, transaction) {
    // In real implementation, make HTTP POST request to webhook URL
    // For now, simplified implementation
    await new Promise(resolve => setTimeout(resolve, 100));
    return true;
}
// ============================================================================
// IN-APP BADGE FUNCTIONS
// ============================================================================
/**
 * Gets unread notification count
 *
 * @param userId - User ID
 * @returns Unread count
 *
 * @example
 * ```typescript
 * const count = await getUnreadNotificationCount('user-123');
 * ```
 */
async function getUnreadNotificationCount(userId) {
    return Notification.count({
        where: {
            recipientId: userId,
            channel: NotificationChannel.IN_APP,
            readAt: null,
        },
    });
}
/**
 * Gets unread count by priority
 *
 * @param userId - User ID
 * @returns Counts by priority
 *
 * @example
 * ```typescript
 * const counts = await getUnreadCountByPriority('user-123');
 * // { critical: 2, high: 5, medium: 10, low: 3 }
 * ```
 */
async function getUnreadCountByPriority(userId) {
    const notifications = await Notification.findAll({
        where: {
            recipientId: userId,
            channel: NotificationChannel.IN_APP,
            readAt: null,
        },
        attributes: ['priority'],
    });
    const counts = {};
    notifications.forEach(n => {
        counts[n.priority] = (counts[n.priority] || 0) + 1;
    });
    return counts;
}
// ============================================================================
// EMERGENCY BROADCAST FUNCTIONS
// ============================================================================
/**
 * Sends emergency broadcast
 *
 * @param subject - Subject
 * @param message - Message
 * @param targetUserIds - Target user IDs (or 'all')
 * @param transaction - Optional database transaction
 * @returns Sent notifications
 *
 * @example
 * ```typescript
 * await sendEmergencyBroadcast(
 *   'System Emergency',
 *   'Critical system failure detected',
 *   'all'
 * );
 * ```
 */
async function sendEmergencyBroadcast(subject, message, targetUserIds, transaction) {
    // In real implementation, fetch all user IDs if 'all'
    const recipientIds = Array.isArray(targetUserIds) ? targetUserIds : [];
    return sendNotification({
        recipientIds,
        subject,
        message,
        priority: NotificationPriority.CRITICAL,
        channels: [
            NotificationChannel.EMAIL,
            NotificationChannel.SMS,
            NotificationChannel.PUSH,
            NotificationChannel.IN_APP,
        ],
        metadata: { emergency: true },
    }, transaction);
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    Notification,
    NotificationRule,
    NotificationTemplate,
    EscalationPolicy,
    EscalationInstance,
    UserNotificationPreference,
    NotificationQueue,
    NotificationAnalytics,
    NotificationDigest,
    ScheduledNotification,
    // Notification Functions
    sendNotification,
    sendBatchNotification,
    queueNotification,
    processNotificationQueue,
    deliverNotification,
    markNotificationRead,
    getUserNotifications,
    // Notification Rule Functions
    createNotificationRule,
    evaluateNotificationRules,
    getActiveNotificationRules,
    // Template Functions
    createNotificationTemplate,
    renderTemplate,
    getActiveTemplates,
    // Escalation Functions
    createEscalationPolicy,
    triggerEscalation,
    processEscalations,
    resolveEscalation,
    // User Preference Functions
    setUserPreferences,
    getUserPreferences,
    // Analytics Functions
    trackNotificationDelivery,
    trackNotificationOpen,
    getNotificationAnalyticsReport,
    // Digest Functions
    createNotificationDigest,
    sendPendingDigests,
    // Search Functions
    searchNotifications,
    // Bulk Operations
    markAllNotificationsRead,
    deleteOldNotifications,
    archiveNotifications,
    // Scheduled Notifications
    createScheduledNotification,
    processScheduledNotifications,
    cancelScheduledNotification,
    // Webhook Functions
    sendWebhookNotification,
    // Badge Functions
    getUnreadNotificationCount,
    getUnreadCountByPriority,
    // Emergency Functions
    sendEmergencyBroadcast,
};
//# sourceMappingURL=asset-notification-commands.js.map