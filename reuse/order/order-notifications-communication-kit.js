"use strict";
/**
 * LOC: ORD-NOTCOM-001
 * File: /reuse/order/order-notifications-communication-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *   - nodemailer
 *   - twilio
 *
 * DOWNSTREAM (imported by):
 *   - Order controllers
 *   - Order services
 *   - Notification processors
 *   - Communication modules
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
exports.UpdateNotificationPreferencesDto = exports.SendDelayNotificationDto = exports.SendDeliveryNotificationDto = exports.SendShippingNotificationDto = exports.SendOrderConfirmationDto = exports.CustomerNotificationPreferencesModel = exports.NotificationTemplateModel = exports.OrderNotification = exports.NotificationFrequency = exports.TemplateType = exports.NotificationPriority = exports.DeliveryStatus = exports.NotificationChannel = exports.NotificationType = void 0;
exports.sendOrderConfirmation = sendOrderConfirmation;
exports.sendPaymentConfirmation = sendPaymentConfirmation;
exports.sendShippingConfirmation = sendShippingConfirmation;
exports.sendInTransitNotification = sendInTransitNotification;
exports.sendOutForDeliveryNotification = sendOutForDeliveryNotification;
exports.sendDeliveredNotification = sendDeliveredNotification;
exports.sendDeliveryAttemptedNotification = sendDeliveryAttemptedNotification;
exports.sendDelayNotification = sendDelayNotification;
exports.sendBackorderNotification = sendBackorderNotification;
exports.sendCancellationNotification = sendCancellationNotification;
exports.sendPartialCancellationNotification = sendPartialCancellationNotification;
exports.sendReturnRequestedNotification = sendReturnRequestedNotification;
exports.sendReturnApprovedNotification = sendReturnApprovedNotification;
exports.sendReturnReceivedNotification = sendReturnReceivedNotification;
exports.sendRefundProcessedNotification = sendRefundProcessedNotification;
exports.sendOrderUpdateNotification = sendOrderUpdateNotification;
exports.sendTrackingUpdateNotification = sendTrackingUpdateNotification;
exports.sendEmailNotification = sendEmailNotification;
exports.sendSmsNotification = sendSmsNotification;
exports.sendPushNotification = sendPushNotification;
exports.sendWebhookNotification = sendWebhookNotification;
exports.sendInAppNotification = sendInAppNotification;
exports.getNotificationTemplate = getNotificationTemplate;
exports.createNotificationTemplate = createNotificationTemplate;
exports.renderTemplate = renderTemplate;
exports.getCustomerNotificationPreferences = getCustomerNotificationPreferences;
exports.updateCustomerNotificationPreferences = updateCustomerNotificationPreferences;
exports.scheduleNotification = scheduleNotification;
exports.cancelScheduledNotification = cancelScheduledNotification;
exports.getNotificationHistory = getNotificationHistory;
exports.trackNotificationDelivery = trackNotificationDelivery;
exports.retryFailedNotification = retryFailedNotification;
exports.batchSendNotifications = batchSendNotifications;
exports.getNotificationAnalytics = getNotificationAnalytics;
exports.validateNotificationConfiguration = validateNotificationConfiguration;
/**
 * File: /reuse/order/order-notifications-communication-kit.ts
 * Locator: WC-ORD-NOTCOM-001
 * Purpose: Order Notifications & Communication - Multi-channel customer communications
 *
 * Upstream: Independent utility module for order notification operations
 * Downstream: ../backend/order/*, Notification modules, Communication services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript, nodemailer, twilio
 * Exports: 35 utility functions for order notifications, multi-channel delivery, templates, preferences
 *
 * LLM Context: Enterprise-grade order notification utilities to compete with Oracle MICROS and SAP Commerce.
 * Provides comprehensive order confirmation, shipping notifications, delivery updates, delay alerts,
 * cancellation notifications, return notifications, multi-channel delivery (email, SMS, push, webhook),
 * template management, customer preferences, notification scheduling, delivery tracking, and history.
 */
const common_1 = require("@nestjs/common");
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================
/**
 * Notification types for order-related communications
 */
var NotificationType;
(function (NotificationType) {
    NotificationType["ORDER_CONFIRMATION"] = "ORDER_CONFIRMATION";
    NotificationType["ORDER_RECEIVED"] = "ORDER_RECEIVED";
    NotificationType["PAYMENT_CONFIRMATION"] = "PAYMENT_CONFIRMATION";
    NotificationType["SHIPPING_CONFIRMATION"] = "SHIPPING_CONFIRMATION";
    NotificationType["SHIPPED"] = "SHIPPED";
    NotificationType["IN_TRANSIT"] = "IN_TRANSIT";
    NotificationType["OUT_FOR_DELIVERY"] = "OUT_FOR_DELIVERY";
    NotificationType["DELIVERED"] = "DELIVERED";
    NotificationType["DELIVERY_ATTEMPTED"] = "DELIVERY_ATTEMPTED";
    NotificationType["DELIVERY_FAILED"] = "DELIVERY_FAILED";
    NotificationType["DELAY_NOTIFICATION"] = "DELAY_NOTIFICATION";
    NotificationType["BACKORDER_NOTIFICATION"] = "BACKORDER_NOTIFICATION";
    NotificationType["CANCELLATION"] = "CANCELLATION";
    NotificationType["PARTIAL_CANCELLATION"] = "PARTIAL_CANCELLATION";
    NotificationType["RETURN_REQUESTED"] = "RETURN_REQUESTED";
    NotificationType["RETURN_APPROVED"] = "RETURN_APPROVED";
    NotificationType["RETURN_RECEIVED"] = "RETURN_RECEIVED";
    NotificationType["REFUND_PROCESSED"] = "REFUND_PROCESSED";
    NotificationType["ORDER_UPDATE"] = "ORDER_UPDATE";
    NotificationType["TRACKING_UPDATE"] = "TRACKING_UPDATE";
    NotificationType["CUSTOMER_SERVICE"] = "CUSTOMER_SERVICE";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
/**
 * Communication channels for multi-channel delivery
 */
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["EMAIL"] = "EMAIL";
    NotificationChannel["SMS"] = "SMS";
    NotificationChannel["PUSH"] = "PUSH";
    NotificationChannel["WEBHOOK"] = "WEBHOOK";
    NotificationChannel["IN_APP"] = "IN_APP";
    NotificationChannel["VOICE"] = "VOICE";
    NotificationChannel["WHATSAPP"] = "WHATSAPP";
    NotificationChannel["SLACK"] = "SLACK";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
/**
 * Notification delivery status
 */
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["PENDING"] = "PENDING";
    DeliveryStatus["QUEUED"] = "QUEUED";
    DeliveryStatus["SENDING"] = "SENDING";
    DeliveryStatus["SENT"] = "SENT";
    DeliveryStatus["DELIVERED"] = "DELIVERED";
    DeliveryStatus["FAILED"] = "FAILED";
    DeliveryStatus["BOUNCED"] = "BOUNCED";
    DeliveryStatus["REJECTED"] = "REJECTED";
    DeliveryStatus["OPENED"] = "OPENED";
    DeliveryStatus["CLICKED"] = "CLICKED";
    DeliveryStatus["UNSUBSCRIBED"] = "UNSUBSCRIBED";
})(DeliveryStatus || (exports.DeliveryStatus = DeliveryStatus = {}));
/**
 * Notification priority levels
 */
var NotificationPriority;
(function (NotificationPriority) {
    NotificationPriority["LOW"] = "LOW";
    NotificationPriority["NORMAL"] = "NORMAL";
    NotificationPriority["HIGH"] = "HIGH";
    NotificationPriority["URGENT"] = "URGENT";
    NotificationPriority["CRITICAL"] = "CRITICAL";
})(NotificationPriority || (exports.NotificationPriority = NotificationPriority = {}));
/**
 * Template types for notification rendering
 */
var TemplateType;
(function (TemplateType) {
    TemplateType["HTML"] = "HTML";
    TemplateType["TEXT"] = "TEXT";
    TemplateType["JSON"] = "JSON";
    TemplateType["HANDLEBARS"] = "HANDLEBARS";
    TemplateType["MUSTACHE"] = "MUSTACHE";
    TemplateType["EJS"] = "EJS";
})(TemplateType || (exports.TemplateType = TemplateType = {}));
/**
 * Notification frequency preferences
 */
var NotificationFrequency;
(function (NotificationFrequency) {
    NotificationFrequency["IMMEDIATE"] = "IMMEDIATE";
    NotificationFrequency["HOURLY"] = "HOURLY";
    NotificationFrequency["DAILY"] = "DAILY";
    NotificationFrequency["WEEKLY"] = "WEEKLY";
    NotificationFrequency["NEVER"] = "NEVER";
})(NotificationFrequency || (exports.NotificationFrequency = NotificationFrequency = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Notification log model for tracking all notifications
 */
let OrderNotification = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'order_notifications', timestamps: true, paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _notificationType_decorators;
    let _notificationType_initializers = [];
    let _notificationType_extraInitializers = [];
    let _channel_decorators;
    let _channel_initializers = [];
    let _channel_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _recipient_decorators;
    let _recipient_initializers = [];
    let _recipient_extraInitializers = [];
    let _subject_decorators;
    let _subject_initializers = [];
    let _subject_extraInitializers = [];
    let _body_decorators;
    let _body_initializers = [];
    let _body_extraInitializers = [];
    let _payload_decorators;
    let _payload_initializers = [];
    let _payload_extraInitializers = [];
    let _scheduledAt_decorators;
    let _scheduledAt_initializers = [];
    let _scheduledAt_extraInitializers = [];
    let _sentAt_decorators;
    let _sentAt_initializers = [];
    let _sentAt_extraInitializers = [];
    let _deliveredAt_decorators;
    let _deliveredAt_initializers = [];
    let _deliveredAt_extraInitializers = [];
    let _openedAt_decorators;
    let _openedAt_initializers = [];
    let _openedAt_extraInitializers = [];
    let _clickedAt_decorators;
    let _clickedAt_initializers = [];
    let _clickedAt_extraInitializers = [];
    let _retryCount_decorators;
    let _retryCount_initializers = [];
    let _retryCount_extraInitializers = [];
    let _failureReason_decorators;
    let _failureReason_initializers = [];
    let _failureReason_extraInitializers = [];
    let _externalId_decorators;
    let _externalId_initializers = [];
    let _externalId_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var OrderNotification = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.orderId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _orderId_initializers, void 0));
            this.customerId = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
            this.notificationType = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _notificationType_initializers, void 0));
            this.channel = (__runInitializers(this, _notificationType_extraInitializers), __runInitializers(this, _channel_initializers, void 0));
            this.status = (__runInitializers(this, _channel_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.priority = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.recipient = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _recipient_initializers, void 0));
            this.subject = (__runInitializers(this, _recipient_extraInitializers), __runInitializers(this, _subject_initializers, void 0));
            this.body = (__runInitializers(this, _subject_extraInitializers), __runInitializers(this, _body_initializers, void 0));
            this.payload = (__runInitializers(this, _body_extraInitializers), __runInitializers(this, _payload_initializers, void 0));
            this.scheduledAt = (__runInitializers(this, _payload_extraInitializers), __runInitializers(this, _scheduledAt_initializers, void 0));
            this.sentAt = (__runInitializers(this, _scheduledAt_extraInitializers), __runInitializers(this, _sentAt_initializers, void 0));
            this.deliveredAt = (__runInitializers(this, _sentAt_extraInitializers), __runInitializers(this, _deliveredAt_initializers, void 0));
            this.openedAt = (__runInitializers(this, _deliveredAt_extraInitializers), __runInitializers(this, _openedAt_initializers, void 0));
            this.clickedAt = (__runInitializers(this, _openedAt_extraInitializers), __runInitializers(this, _clickedAt_initializers, void 0));
            this.retryCount = (__runInitializers(this, _clickedAt_extraInitializers), __runInitializers(this, _retryCount_initializers, void 0));
            this.failureReason = (__runInitializers(this, _retryCount_extraInitializers), __runInitializers(this, _failureReason_initializers, void 0));
            this.externalId = (__runInitializers(this, _failureReason_extraInitializers), __runInitializers(this, _externalId_initializers, void 0));
            this.metadata = (__runInitializers(this, _externalId_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "OrderNotification");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true, defaultValue: sequelize_typescript_1.DataType.UUIDV4 })];
        _orderId_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _customerId_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _notificationType_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(NotificationType)), allowNull: false })];
        _channel_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(NotificationChannel)), allowNull: false })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(DeliveryStatus)), defaultValue: DeliveryStatus.PENDING })];
        _priority_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(NotificationPriority)), defaultValue: NotificationPriority.NORMAL })];
        _recipient_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true })];
        _subject_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true })];
        _body_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true })];
        _payload_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON, allowNull: true })];
        _scheduledAt_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _sentAt_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _deliveredAt_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _openedAt_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _clickedAt_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _retryCount_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _failureReason_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true })];
        _externalId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON, allowNull: true })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
        __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
        __esDecorate(null, null, _notificationType_decorators, { kind: "field", name: "notificationType", static: false, private: false, access: { has: obj => "notificationType" in obj, get: obj => obj.notificationType, set: (obj, value) => { obj.notificationType = value; } }, metadata: _metadata }, _notificationType_initializers, _notificationType_extraInitializers);
        __esDecorate(null, null, _channel_decorators, { kind: "field", name: "channel", static: false, private: false, access: { has: obj => "channel" in obj, get: obj => obj.channel, set: (obj, value) => { obj.channel = value; } }, metadata: _metadata }, _channel_initializers, _channel_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _recipient_decorators, { kind: "field", name: "recipient", static: false, private: false, access: { has: obj => "recipient" in obj, get: obj => obj.recipient, set: (obj, value) => { obj.recipient = value; } }, metadata: _metadata }, _recipient_initializers, _recipient_extraInitializers);
        __esDecorate(null, null, _subject_decorators, { kind: "field", name: "subject", static: false, private: false, access: { has: obj => "subject" in obj, get: obj => obj.subject, set: (obj, value) => { obj.subject = value; } }, metadata: _metadata }, _subject_initializers, _subject_extraInitializers);
        __esDecorate(null, null, _body_decorators, { kind: "field", name: "body", static: false, private: false, access: { has: obj => "body" in obj, get: obj => obj.body, set: (obj, value) => { obj.body = value; } }, metadata: _metadata }, _body_initializers, _body_extraInitializers);
        __esDecorate(null, null, _payload_decorators, { kind: "field", name: "payload", static: false, private: false, access: { has: obj => "payload" in obj, get: obj => obj.payload, set: (obj, value) => { obj.payload = value; } }, metadata: _metadata }, _payload_initializers, _payload_extraInitializers);
        __esDecorate(null, null, _scheduledAt_decorators, { kind: "field", name: "scheduledAt", static: false, private: false, access: { has: obj => "scheduledAt" in obj, get: obj => obj.scheduledAt, set: (obj, value) => { obj.scheduledAt = value; } }, metadata: _metadata }, _scheduledAt_initializers, _scheduledAt_extraInitializers);
        __esDecorate(null, null, _sentAt_decorators, { kind: "field", name: "sentAt", static: false, private: false, access: { has: obj => "sentAt" in obj, get: obj => obj.sentAt, set: (obj, value) => { obj.sentAt = value; } }, metadata: _metadata }, _sentAt_initializers, _sentAt_extraInitializers);
        __esDecorate(null, null, _deliveredAt_decorators, { kind: "field", name: "deliveredAt", static: false, private: false, access: { has: obj => "deliveredAt" in obj, get: obj => obj.deliveredAt, set: (obj, value) => { obj.deliveredAt = value; } }, metadata: _metadata }, _deliveredAt_initializers, _deliveredAt_extraInitializers);
        __esDecorate(null, null, _openedAt_decorators, { kind: "field", name: "openedAt", static: false, private: false, access: { has: obj => "openedAt" in obj, get: obj => obj.openedAt, set: (obj, value) => { obj.openedAt = value; } }, metadata: _metadata }, _openedAt_initializers, _openedAt_extraInitializers);
        __esDecorate(null, null, _clickedAt_decorators, { kind: "field", name: "clickedAt", static: false, private: false, access: { has: obj => "clickedAt" in obj, get: obj => obj.clickedAt, set: (obj, value) => { obj.clickedAt = value; } }, metadata: _metadata }, _clickedAt_initializers, _clickedAt_extraInitializers);
        __esDecorate(null, null, _retryCount_decorators, { kind: "field", name: "retryCount", static: false, private: false, access: { has: obj => "retryCount" in obj, get: obj => obj.retryCount, set: (obj, value) => { obj.retryCount = value; } }, metadata: _metadata }, _retryCount_initializers, _retryCount_extraInitializers);
        __esDecorate(null, null, _failureReason_decorators, { kind: "field", name: "failureReason", static: false, private: false, access: { has: obj => "failureReason" in obj, get: obj => obj.failureReason, set: (obj, value) => { obj.failureReason = value; } }, metadata: _metadata }, _failureReason_initializers, _failureReason_extraInitializers);
        __esDecorate(null, null, _externalId_decorators, { kind: "field", name: "externalId", static: false, private: false, access: { has: obj => "externalId" in obj, get: obj => obj.externalId, set: (obj, value) => { obj.externalId = value; } }, metadata: _metadata }, _externalId_initializers, _externalId_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OrderNotification = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OrderNotification = _classThis;
})();
exports.OrderNotification = OrderNotification;
/**
 * Notification template model
 */
let NotificationTemplateModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'notification_templates', timestamps: true })];
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
    let _notificationType_decorators;
    let _notificationType_initializers = [];
    let _notificationType_extraInitializers = [];
    let _channel_decorators;
    let _channel_initializers = [];
    let _channel_extraInitializers = [];
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
    let _defaultValues_decorators;
    let _defaultValues_initializers = [];
    let _defaultValues_extraInitializers = [];
    let _active_decorators;
    let _active_initializers = [];
    let _active_extraInitializers = [];
    let _locale_decorators;
    let _locale_initializers = [];
    let _locale_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var NotificationTemplateModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.notificationType = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _notificationType_initializers, void 0));
            this.channel = (__runInitializers(this, _notificationType_extraInitializers), __runInitializers(this, _channel_initializers, void 0));
            this.templateType = (__runInitializers(this, _channel_extraInitializers), __runInitializers(this, _templateType_initializers, void 0));
            this.subject = (__runInitializers(this, _templateType_extraInitializers), __runInitializers(this, _subject_initializers, void 0));
            this.body = (__runInitializers(this, _subject_extraInitializers), __runInitializers(this, _body_initializers, void 0));
            this.variables = (__runInitializers(this, _body_extraInitializers), __runInitializers(this, _variables_initializers, void 0));
            this.defaultValues = (__runInitializers(this, _variables_extraInitializers), __runInitializers(this, _defaultValues_initializers, void 0));
            this.active = (__runInitializers(this, _defaultValues_extraInitializers), __runInitializers(this, _active_initializers, void 0));
            this.locale = (__runInitializers(this, _active_extraInitializers), __runInitializers(this, _locale_initializers, void 0));
            this.createdAt = (__runInitializers(this, _locale_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "NotificationTemplateModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true, defaultValue: sequelize_typescript_1.DataType.UUIDV4 })];
        _name_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, unique: true })];
        _notificationType_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(NotificationType)), allowNull: false })];
        _channel_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(NotificationChannel)), allowNull: false })];
        _templateType_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(TemplateType)), allowNull: false })];
        _subject_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true })];
        _body_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _variables_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON, allowNull: true })];
        _defaultValues_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON, allowNull: true })];
        _active_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _locale_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _notificationType_decorators, { kind: "field", name: "notificationType", static: false, private: false, access: { has: obj => "notificationType" in obj, get: obj => obj.notificationType, set: (obj, value) => { obj.notificationType = value; } }, metadata: _metadata }, _notificationType_initializers, _notificationType_extraInitializers);
        __esDecorate(null, null, _channel_decorators, { kind: "field", name: "channel", static: false, private: false, access: { has: obj => "channel" in obj, get: obj => obj.channel, set: (obj, value) => { obj.channel = value; } }, metadata: _metadata }, _channel_initializers, _channel_extraInitializers);
        __esDecorate(null, null, _templateType_decorators, { kind: "field", name: "templateType", static: false, private: false, access: { has: obj => "templateType" in obj, get: obj => obj.templateType, set: (obj, value) => { obj.templateType = value; } }, metadata: _metadata }, _templateType_initializers, _templateType_extraInitializers);
        __esDecorate(null, null, _subject_decorators, { kind: "field", name: "subject", static: false, private: false, access: { has: obj => "subject" in obj, get: obj => obj.subject, set: (obj, value) => { obj.subject = value; } }, metadata: _metadata }, _subject_initializers, _subject_extraInitializers);
        __esDecorate(null, null, _body_decorators, { kind: "field", name: "body", static: false, private: false, access: { has: obj => "body" in obj, get: obj => obj.body, set: (obj, value) => { obj.body = value; } }, metadata: _metadata }, _body_initializers, _body_extraInitializers);
        __esDecorate(null, null, _variables_decorators, { kind: "field", name: "variables", static: false, private: false, access: { has: obj => "variables" in obj, get: obj => obj.variables, set: (obj, value) => { obj.variables = value; } }, metadata: _metadata }, _variables_initializers, _variables_extraInitializers);
        __esDecorate(null, null, _defaultValues_decorators, { kind: "field", name: "defaultValues", static: false, private: false, access: { has: obj => "defaultValues" in obj, get: obj => obj.defaultValues, set: (obj, value) => { obj.defaultValues = value; } }, metadata: _metadata }, _defaultValues_initializers, _defaultValues_extraInitializers);
        __esDecorate(null, null, _active_decorators, { kind: "field", name: "active", static: false, private: false, access: { has: obj => "active" in obj, get: obj => obj.active, set: (obj, value) => { obj.active = value; } }, metadata: _metadata }, _active_initializers, _active_extraInitializers);
        __esDecorate(null, null, _locale_decorators, { kind: "field", name: "locale", static: false, private: false, access: { has: obj => "locale" in obj, get: obj => obj.locale, set: (obj, value) => { obj.locale = value; } }, metadata: _metadata }, _locale_initializers, _locale_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationTemplateModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationTemplateModel = _classThis;
})();
exports.NotificationTemplateModel = NotificationTemplateModel;
/**
 * Customer notification preferences model
 */
let CustomerNotificationPreferencesModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'customer_notification_preferences', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _emailEnabled_decorators;
    let _emailEnabled_initializers = [];
    let _emailEnabled_extraInitializers = [];
    let _smsEnabled_decorators;
    let _smsEnabled_initializers = [];
    let _smsEnabled_extraInitializers = [];
    let _pushEnabled_decorators;
    let _pushEnabled_initializers = [];
    let _pushEnabled_extraInitializers = [];
    let _webhookEnabled_decorators;
    let _webhookEnabled_initializers = [];
    let _webhookEnabled_extraInitializers = [];
    let _inAppEnabled_decorators;
    let _inAppEnabled_initializers = [];
    let _inAppEnabled_extraInitializers = [];
    let _frequency_decorators;
    let _frequency_initializers = [];
    let _frequency_extraInitializers = [];
    let _quietHoursStart_decorators;
    let _quietHoursStart_initializers = [];
    let _quietHoursStart_extraInitializers = [];
    let _quietHoursEnd_decorators;
    let _quietHoursEnd_initializers = [];
    let _quietHoursEnd_extraInitializers = [];
    let _timezone_decorators;
    let _timezone_initializers = [];
    let _timezone_extraInitializers = [];
    let _preferredLanguage_decorators;
    let _preferredLanguage_initializers = [];
    let _preferredLanguage_extraInitializers = [];
    let _enabledTypes_decorators;
    let _enabledTypes_initializers = [];
    let _enabledTypes_extraInitializers = [];
    let _disabledTypes_decorators;
    let _disabledTypes_initializers = [];
    let _disabledTypes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var CustomerNotificationPreferencesModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.customerId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
            this.emailEnabled = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _emailEnabled_initializers, void 0));
            this.smsEnabled = (__runInitializers(this, _emailEnabled_extraInitializers), __runInitializers(this, _smsEnabled_initializers, void 0));
            this.pushEnabled = (__runInitializers(this, _smsEnabled_extraInitializers), __runInitializers(this, _pushEnabled_initializers, void 0));
            this.webhookEnabled = (__runInitializers(this, _pushEnabled_extraInitializers), __runInitializers(this, _webhookEnabled_initializers, void 0));
            this.inAppEnabled = (__runInitializers(this, _webhookEnabled_extraInitializers), __runInitializers(this, _inAppEnabled_initializers, void 0));
            this.frequency = (__runInitializers(this, _inAppEnabled_extraInitializers), __runInitializers(this, _frequency_initializers, void 0));
            this.quietHoursStart = (__runInitializers(this, _frequency_extraInitializers), __runInitializers(this, _quietHoursStart_initializers, void 0));
            this.quietHoursEnd = (__runInitializers(this, _quietHoursStart_extraInitializers), __runInitializers(this, _quietHoursEnd_initializers, void 0));
            this.timezone = (__runInitializers(this, _quietHoursEnd_extraInitializers), __runInitializers(this, _timezone_initializers, void 0));
            this.preferredLanguage = (__runInitializers(this, _timezone_extraInitializers), __runInitializers(this, _preferredLanguage_initializers, void 0));
            this.enabledTypes = (__runInitializers(this, _preferredLanguage_extraInitializers), __runInitializers(this, _enabledTypes_initializers, void 0));
            this.disabledTypes = (__runInitializers(this, _enabledTypes_extraInitializers), __runInitializers(this, _disabledTypes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _disabledTypes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CustomerNotificationPreferencesModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true, defaultValue: sequelize_typescript_1.DataType.UUIDV4 })];
        _customerId_decorators = [(0, sequelize_typescript_1.Index)({ unique: true }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _emailEnabled_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _smsEnabled_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _pushEnabled_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _webhookEnabled_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _inAppEnabled_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _frequency_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(NotificationFrequency)), defaultValue: NotificationFrequency.IMMEDIATE })];
        _quietHoursStart_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true })];
        _quietHoursEnd_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true })];
        _timezone_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true })];
        _preferredLanguage_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, defaultValue: 'en' })];
        _enabledTypes_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON, allowNull: true })];
        _disabledTypes_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON, allowNull: true })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
        __esDecorate(null, null, _emailEnabled_decorators, { kind: "field", name: "emailEnabled", static: false, private: false, access: { has: obj => "emailEnabled" in obj, get: obj => obj.emailEnabled, set: (obj, value) => { obj.emailEnabled = value; } }, metadata: _metadata }, _emailEnabled_initializers, _emailEnabled_extraInitializers);
        __esDecorate(null, null, _smsEnabled_decorators, { kind: "field", name: "smsEnabled", static: false, private: false, access: { has: obj => "smsEnabled" in obj, get: obj => obj.smsEnabled, set: (obj, value) => { obj.smsEnabled = value; } }, metadata: _metadata }, _smsEnabled_initializers, _smsEnabled_extraInitializers);
        __esDecorate(null, null, _pushEnabled_decorators, { kind: "field", name: "pushEnabled", static: false, private: false, access: { has: obj => "pushEnabled" in obj, get: obj => obj.pushEnabled, set: (obj, value) => { obj.pushEnabled = value; } }, metadata: _metadata }, _pushEnabled_initializers, _pushEnabled_extraInitializers);
        __esDecorate(null, null, _webhookEnabled_decorators, { kind: "field", name: "webhookEnabled", static: false, private: false, access: { has: obj => "webhookEnabled" in obj, get: obj => obj.webhookEnabled, set: (obj, value) => { obj.webhookEnabled = value; } }, metadata: _metadata }, _webhookEnabled_initializers, _webhookEnabled_extraInitializers);
        __esDecorate(null, null, _inAppEnabled_decorators, { kind: "field", name: "inAppEnabled", static: false, private: false, access: { has: obj => "inAppEnabled" in obj, get: obj => obj.inAppEnabled, set: (obj, value) => { obj.inAppEnabled = value; } }, metadata: _metadata }, _inAppEnabled_initializers, _inAppEnabled_extraInitializers);
        __esDecorate(null, null, _frequency_decorators, { kind: "field", name: "frequency", static: false, private: false, access: { has: obj => "frequency" in obj, get: obj => obj.frequency, set: (obj, value) => { obj.frequency = value; } }, metadata: _metadata }, _frequency_initializers, _frequency_extraInitializers);
        __esDecorate(null, null, _quietHoursStart_decorators, { kind: "field", name: "quietHoursStart", static: false, private: false, access: { has: obj => "quietHoursStart" in obj, get: obj => obj.quietHoursStart, set: (obj, value) => { obj.quietHoursStart = value; } }, metadata: _metadata }, _quietHoursStart_initializers, _quietHoursStart_extraInitializers);
        __esDecorate(null, null, _quietHoursEnd_decorators, { kind: "field", name: "quietHoursEnd", static: false, private: false, access: { has: obj => "quietHoursEnd" in obj, get: obj => obj.quietHoursEnd, set: (obj, value) => { obj.quietHoursEnd = value; } }, metadata: _metadata }, _quietHoursEnd_initializers, _quietHoursEnd_extraInitializers);
        __esDecorate(null, null, _timezone_decorators, { kind: "field", name: "timezone", static: false, private: false, access: { has: obj => "timezone" in obj, get: obj => obj.timezone, set: (obj, value) => { obj.timezone = value; } }, metadata: _metadata }, _timezone_initializers, _timezone_extraInitializers);
        __esDecorate(null, null, _preferredLanguage_decorators, { kind: "field", name: "preferredLanguage", static: false, private: false, access: { has: obj => "preferredLanguage" in obj, get: obj => obj.preferredLanguage, set: (obj, value) => { obj.preferredLanguage = value; } }, metadata: _metadata }, _preferredLanguage_initializers, _preferredLanguage_extraInitializers);
        __esDecorate(null, null, _enabledTypes_decorators, { kind: "field", name: "enabledTypes", static: false, private: false, access: { has: obj => "enabledTypes" in obj, get: obj => obj.enabledTypes, set: (obj, value) => { obj.enabledTypes = value; } }, metadata: _metadata }, _enabledTypes_initializers, _enabledTypes_extraInitializers);
        __esDecorate(null, null, _disabledTypes_decorators, { kind: "field", name: "disabledTypes", static: false, private: false, access: { has: obj => "disabledTypes" in obj, get: obj => obj.disabledTypes, set: (obj, value) => { obj.disabledTypes = value; } }, metadata: _metadata }, _disabledTypes_initializers, _disabledTypes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CustomerNotificationPreferencesModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CustomerNotificationPreferencesModel = _classThis;
})();
exports.CustomerNotificationPreferencesModel = CustomerNotificationPreferencesModel;
// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================
/**
 * DTO for sending order confirmation
 */
let SendOrderConfirmationDto = (() => {
    var _a;
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class SendOrderConfirmationDto {
            constructor() {
                this.orderId = __runInitializers(this, _orderId_initializers, void 0);
                this.customerId = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
                this.metadata = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _orderId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order ID' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SendOrderConfirmationDto = SendOrderConfirmationDto;
/**
 * DTO for sending shipping notification
 */
let SendShippingNotificationDto = (() => {
    var _a;
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _trackingNumber_decorators;
    let _trackingNumber_initializers = [];
    let _trackingNumber_extraInitializers = [];
    let _carrier_decorators;
    let _carrier_initializers = [];
    let _carrier_extraInitializers = [];
    let _estimatedDelivery_decorators;
    let _estimatedDelivery_initializers = [];
    let _estimatedDelivery_extraInitializers = [];
    return _a = class SendShippingNotificationDto {
            constructor() {
                this.orderId = __runInitializers(this, _orderId_initializers, void 0);
                this.trackingNumber = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _trackingNumber_initializers, void 0));
                this.carrier = (__runInitializers(this, _trackingNumber_extraInitializers), __runInitializers(this, _carrier_initializers, void 0));
                this.estimatedDelivery = (__runInitializers(this, _carrier_extraInitializers), __runInitializers(this, _estimatedDelivery_initializers, void 0));
                __runInitializers(this, _estimatedDelivery_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _orderId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order ID' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _trackingNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tracking number' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _carrier_decorators = [(0, swagger_1.ApiProperty)({ description: 'Carrier name' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _estimatedDelivery_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Estimated delivery date' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
            __esDecorate(null, null, _trackingNumber_decorators, { kind: "field", name: "trackingNumber", static: false, private: false, access: { has: obj => "trackingNumber" in obj, get: obj => obj.trackingNumber, set: (obj, value) => { obj.trackingNumber = value; } }, metadata: _metadata }, _trackingNumber_initializers, _trackingNumber_extraInitializers);
            __esDecorate(null, null, _carrier_decorators, { kind: "field", name: "carrier", static: false, private: false, access: { has: obj => "carrier" in obj, get: obj => obj.carrier, set: (obj, value) => { obj.carrier = value; } }, metadata: _metadata }, _carrier_initializers, _carrier_extraInitializers);
            __esDecorate(null, null, _estimatedDelivery_decorators, { kind: "field", name: "estimatedDelivery", static: false, private: false, access: { has: obj => "estimatedDelivery" in obj, get: obj => obj.estimatedDelivery, set: (obj, value) => { obj.estimatedDelivery = value; } }, metadata: _metadata }, _estimatedDelivery_initializers, _estimatedDelivery_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SendShippingNotificationDto = SendShippingNotificationDto;
/**
 * DTO for sending delivery notification
 */
let SendDeliveryNotificationDto = (() => {
    var _a;
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _deliveredAt_decorators;
    let _deliveredAt_initializers = [];
    let _deliveredAt_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _proofOfDelivery_decorators;
    let _proofOfDelivery_initializers = [];
    let _proofOfDelivery_extraInitializers = [];
    return _a = class SendDeliveryNotificationDto {
            constructor() {
                this.orderId = __runInitializers(this, _orderId_initializers, void 0);
                this.deliveredAt = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _deliveredAt_initializers, void 0));
                this.location = (__runInitializers(this, _deliveredAt_extraInitializers), __runInitializers(this, _location_initializers, void 0));
                this.proofOfDelivery = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _proofOfDelivery_initializers, void 0));
                __runInitializers(this, _proofOfDelivery_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _orderId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order ID' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _deliveredAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Delivery timestamp' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _location_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Delivery location' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _proofOfDelivery_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Signature or proof of delivery' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
            __esDecorate(null, null, _deliveredAt_decorators, { kind: "field", name: "deliveredAt", static: false, private: false, access: { has: obj => "deliveredAt" in obj, get: obj => obj.deliveredAt, set: (obj, value) => { obj.deliveredAt = value; } }, metadata: _metadata }, _deliveredAt_initializers, _deliveredAt_extraInitializers);
            __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
            __esDecorate(null, null, _proofOfDelivery_decorators, { kind: "field", name: "proofOfDelivery", static: false, private: false, access: { has: obj => "proofOfDelivery" in obj, get: obj => obj.proofOfDelivery, set: (obj, value) => { obj.proofOfDelivery = value; } }, metadata: _metadata }, _proofOfDelivery_initializers, _proofOfDelivery_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SendDeliveryNotificationDto = SendDeliveryNotificationDto;
/**
 * DTO for sending delay notification
 */
let SendDelayNotificationDto = (() => {
    var _a;
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _originalDeliveryDate_decorators;
    let _originalDeliveryDate_initializers = [];
    let _originalDeliveryDate_extraInitializers = [];
    let _newDeliveryDate_decorators;
    let _newDeliveryDate_initializers = [];
    let _newDeliveryDate_extraInitializers = [];
    let _delayReason_decorators;
    let _delayReason_initializers = [];
    let _delayReason_extraInitializers = [];
    return _a = class SendDelayNotificationDto {
            constructor() {
                this.orderId = __runInitializers(this, _orderId_initializers, void 0);
                this.originalDeliveryDate = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _originalDeliveryDate_initializers, void 0));
                this.newDeliveryDate = (__runInitializers(this, _originalDeliveryDate_extraInitializers), __runInitializers(this, _newDeliveryDate_initializers, void 0));
                this.delayReason = (__runInitializers(this, _newDeliveryDate_extraInitializers), __runInitializers(this, _delayReason_initializers, void 0));
                __runInitializers(this, _delayReason_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _orderId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order ID' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _originalDeliveryDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Original delivery date' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _newDeliveryDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'New delivery date' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _delayReason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reason for delay' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
            __esDecorate(null, null, _originalDeliveryDate_decorators, { kind: "field", name: "originalDeliveryDate", static: false, private: false, access: { has: obj => "originalDeliveryDate" in obj, get: obj => obj.originalDeliveryDate, set: (obj, value) => { obj.originalDeliveryDate = value; } }, metadata: _metadata }, _originalDeliveryDate_initializers, _originalDeliveryDate_extraInitializers);
            __esDecorate(null, null, _newDeliveryDate_decorators, { kind: "field", name: "newDeliveryDate", static: false, private: false, access: { has: obj => "newDeliveryDate" in obj, get: obj => obj.newDeliveryDate, set: (obj, value) => { obj.newDeliveryDate = value; } }, metadata: _metadata }, _newDeliveryDate_initializers, _newDeliveryDate_extraInitializers);
            __esDecorate(null, null, _delayReason_decorators, { kind: "field", name: "delayReason", static: false, private: false, access: { has: obj => "delayReason" in obj, get: obj => obj.delayReason, set: (obj, value) => { obj.delayReason = value; } }, metadata: _metadata }, _delayReason_initializers, _delayReason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SendDelayNotificationDto = SendDelayNotificationDto;
/**
 * DTO for customer notification preferences
 */
let UpdateNotificationPreferencesDto = (() => {
    var _a;
    let _emailEnabled_decorators;
    let _emailEnabled_initializers = [];
    let _emailEnabled_extraInitializers = [];
    let _smsEnabled_decorators;
    let _smsEnabled_initializers = [];
    let _smsEnabled_extraInitializers = [];
    let _pushEnabled_decorators;
    let _pushEnabled_initializers = [];
    let _pushEnabled_extraInitializers = [];
    let _frequency_decorators;
    let _frequency_initializers = [];
    let _frequency_extraInitializers = [];
    let _disabledTypes_decorators;
    let _disabledTypes_initializers = [];
    let _disabledTypes_extraInitializers = [];
    return _a = class UpdateNotificationPreferencesDto {
            constructor() {
                this.emailEnabled = __runInitializers(this, _emailEnabled_initializers, void 0);
                this.smsEnabled = (__runInitializers(this, _emailEnabled_extraInitializers), __runInitializers(this, _smsEnabled_initializers, void 0));
                this.pushEnabled = (__runInitializers(this, _smsEnabled_extraInitializers), __runInitializers(this, _pushEnabled_initializers, void 0));
                this.frequency = (__runInitializers(this, _pushEnabled_extraInitializers), __runInitializers(this, _frequency_initializers, void 0));
                this.disabledTypes = (__runInitializers(this, _frequency_extraInitializers), __runInitializers(this, _disabledTypes_initializers, void 0));
                __runInitializers(this, _disabledTypes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _emailEnabled_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Enable email notifications' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _smsEnabled_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Enable SMS notifications' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _pushEnabled_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Enable push notifications' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _frequency_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Notification frequency' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(NotificationFrequency)];
            _disabledTypes_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Disabled notification types' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsEnum)(NotificationType, { each: true })];
            __esDecorate(null, null, _emailEnabled_decorators, { kind: "field", name: "emailEnabled", static: false, private: false, access: { has: obj => "emailEnabled" in obj, get: obj => obj.emailEnabled, set: (obj, value) => { obj.emailEnabled = value; } }, metadata: _metadata }, _emailEnabled_initializers, _emailEnabled_extraInitializers);
            __esDecorate(null, null, _smsEnabled_decorators, { kind: "field", name: "smsEnabled", static: false, private: false, access: { has: obj => "smsEnabled" in obj, get: obj => obj.smsEnabled, set: (obj, value) => { obj.smsEnabled = value; } }, metadata: _metadata }, _smsEnabled_initializers, _smsEnabled_extraInitializers);
            __esDecorate(null, null, _pushEnabled_decorators, { kind: "field", name: "pushEnabled", static: false, private: false, access: { has: obj => "pushEnabled" in obj, get: obj => obj.pushEnabled, set: (obj, value) => { obj.pushEnabled = value; } }, metadata: _metadata }, _pushEnabled_initializers, _pushEnabled_extraInitializers);
            __esDecorate(null, null, _frequency_decorators, { kind: "field", name: "frequency", static: false, private: false, access: { has: obj => "frequency" in obj, get: obj => obj.frequency, set: (obj, value) => { obj.frequency = value; } }, metadata: _metadata }, _frequency_initializers, _frequency_extraInitializers);
            __esDecorate(null, null, _disabledTypes_decorators, { kind: "field", name: "disabledTypes", static: false, private: false, access: { has: obj => "disabledTypes" in obj, get: obj => obj.disabledTypes, set: (obj, value) => { obj.disabledTypes = value; } }, metadata: _metadata }, _disabledTypes_initializers, _disabledTypes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateNotificationPreferencesDto = UpdateNotificationPreferencesDto;
// ============================================================================
// NOTIFICATION SERVICE FUNCTIONS
// ============================================================================
/**
 * 1. Send order confirmation notification
 * Sends multi-channel confirmation when order is placed
 */
async function sendOrderConfirmation(config, orderData, customerPreferences) {
    const results = [];
    const enabledChannels = filterEnabledChannels(config.channels, customerPreferences);
    for (const channel of enabledChannels) {
        const template = await getNotificationTemplate(NotificationType.ORDER_CONFIRMATION, channel);
        const renderedContent = renderTemplate(template, orderData);
        const result = await deliverNotification(channel, {
            recipient: getRecipientForChannel(channel, orderData.customer),
            content: renderedContent,
            priority: config.priority || NotificationPriority.HIGH,
            metadata: config.metadata,
        });
        results.push(result);
        await logNotification(config, channel, result);
    }
    return results;
}
/**
 * 2. Send payment confirmation notification
 * Notifies customer when payment is successfully processed
 */
async function sendPaymentConfirmation(orderId, paymentData, channels = [NotificationChannel.EMAIL]) {
    const results = [];
    for (const channel of channels) {
        const template = await getNotificationTemplate(NotificationType.PAYMENT_CONFIRMATION, channel);
        const content = renderTemplate(template, {
            orderId,
            amount: paymentData.amount,
            paymentMethod: paymentData.method,
            transactionId: paymentData.transactionId,
            timestamp: new Date(),
        });
        const result = await deliverNotification(channel, {
            recipient: paymentData.customerEmail,
            content,
            priority: NotificationPriority.HIGH,
        });
        results.push(result);
    }
    return results;
}
/**
 * 3. Send shipping confirmation notification
 * Notifies when order has been shipped with tracking info
 */
async function sendShippingConfirmation(orderId, shippingData, customerEmail) {
    const channels = [NotificationChannel.EMAIL, NotificationChannel.SMS, NotificationChannel.PUSH];
    const results = [];
    for (const channel of channels) {
        const template = await getNotificationTemplate(NotificationType.SHIPPING_CONFIRMATION, channel);
        const content = renderTemplate(template, {
            orderId,
            ...shippingData,
            trackingUrl: generateTrackingUrl(shippingData.carrier, shippingData.trackingNumber),
        });
        const result = await deliverNotification(channel, {
            recipient: customerEmail,
            content,
            priority: NotificationPriority.NORMAL,
        });
        results.push(result);
    }
    return results;
}
/**
 * 4. Send in-transit notification
 * Updates customer on shipment progress
 */
async function sendInTransitNotification(orderId, trackingUpdate) {
    const template = await getNotificationTemplate(NotificationType.IN_TRANSIT, NotificationChannel.PUSH);
    const content = renderTemplate(template, {
        orderId,
        currentLocation: trackingUpdate.location,
        status: trackingUpdate.status,
        estimatedDelivery: trackingUpdate.estimatedDelivery,
    });
    return await deliverNotification(NotificationChannel.PUSH, {
        content,
        priority: NotificationPriority.LOW,
    });
}
/**
 * 5. Send out-for-delivery notification
 * Notifies when package is out for delivery
 */
async function sendOutForDeliveryNotification(orderId, deliveryWindow, customerContact) {
    const channels = [NotificationChannel.SMS, NotificationChannel.PUSH];
    const results = [];
    for (const channel of channels) {
        const template = await getNotificationTemplate(NotificationType.OUT_FOR_DELIVERY, channel);
        const content = renderTemplate(template, {
            orderId,
            deliveryWindow,
            estimatedTime: deliveryWindow.start,
        });
        const result = await deliverNotification(channel, {
            recipient: customerContact,
            content,
            priority: NotificationPriority.HIGH,
        });
        results.push(result);
    }
    return results;
}
/**
 * 6. Send delivered notification
 * Confirms successful delivery to customer
 */
async function sendDeliveredNotification(orderId, deliveryDetails) {
    const channels = [NotificationChannel.EMAIL, NotificationChannel.PUSH];
    const results = [];
    for (const channel of channels) {
        const template = await getNotificationTemplate(NotificationType.DELIVERED, channel);
        const content = renderTemplate(template, {
            orderId,
            ...deliveryDetails,
        });
        const result = await deliverNotification(channel, {
            content,
            priority: NotificationPriority.NORMAL,
        });
        results.push(result);
    }
    return results;
}
/**
 * 7. Send delivery attempted notification
 * Notifies when delivery was attempted but failed
 */
async function sendDeliveryAttemptedNotification(orderId, attemptDetails) {
    const channels = [NotificationChannel.EMAIL, NotificationChannel.SMS];
    const results = [];
    for (const channel of channels) {
        const template = await getNotificationTemplate(NotificationType.DELIVERY_ATTEMPTED, channel);
        const content = renderTemplate(template, {
            orderId,
            ...attemptDetails,
        });
        const result = await deliverNotification(channel, {
            content,
            priority: NotificationPriority.HIGH,
        });
        results.push(result);
    }
    return results;
}
/**
 * 8. Send delay notification
 * Alerts customer about delivery delays
 */
async function sendDelayNotification(delayDetails) {
    const channels = [NotificationChannel.EMAIL, NotificationChannel.SMS, NotificationChannel.PUSH];
    const results = [];
    for (const channel of channels) {
        const template = await getNotificationTemplate(NotificationType.DELAY_NOTIFICATION, channel);
        const content = renderTemplate(template, {
            ...delayDetails,
            delayDays: calculateDelayDays(delayDetails.originalDeliveryDate, delayDetails.newDeliveryDate),
        });
        const result = await deliverNotification(channel, {
            content,
            priority: NotificationPriority.URGENT,
        });
        results.push(result);
    }
    return results;
}
/**
 * 9. Send backorder notification
 * Notifies customer about backordered items
 */
async function sendBackorderNotification(orderId, backorderInfo) {
    const template = await getNotificationTemplate(NotificationType.BACKORDER_NOTIFICATION, NotificationChannel.EMAIL);
    const content = renderTemplate(template, {
        orderId,
        ...backorderInfo,
    });
    return await deliverNotification(NotificationChannel.EMAIL, {
        content,
        priority: NotificationPriority.NORMAL,
    });
}
/**
 * 10. Send cancellation notification
 * Notifies customer when order is cancelled
 */
async function sendCancellationNotification(cancellationDetails) {
    const channels = [NotificationChannel.EMAIL, NotificationChannel.SMS];
    const results = [];
    for (const channel of channels) {
        const template = await getNotificationTemplate(NotificationType.CANCELLATION, channel);
        const content = renderTemplate(template, cancellationDetails);
        const result = await deliverNotification(channel, {
            content,
            priority: NotificationPriority.HIGH,
        });
        results.push(result);
    }
    return results;
}
/**
 * 11. Send partial cancellation notification
 * Notifies when some items in order are cancelled
 */
async function sendPartialCancellationNotification(orderId, cancelledItems, partialRefund) {
    const template = await getNotificationTemplate(NotificationType.PARTIAL_CANCELLATION, NotificationChannel.EMAIL);
    const content = renderTemplate(template, {
        orderId,
        cancelledItems,
        partialRefund,
        remainingItems: await getRemainingOrderItems(orderId, cancelledItems),
    });
    return await deliverNotification(NotificationChannel.EMAIL, {
        content,
        priority: NotificationPriority.NORMAL,
    });
}
/**
 * 12. Send return requested notification
 * Confirms return request received
 */
async function sendReturnRequestedNotification(returnDetails) {
    const channels = [NotificationChannel.EMAIL];
    const results = [];
    for (const channel of channels) {
        const template = await getNotificationTemplate(NotificationType.RETURN_REQUESTED, channel);
        const content = renderTemplate(template, returnDetails);
        const result = await deliverNotification(channel, {
            content,
            priority: NotificationPriority.NORMAL,
        });
        results.push(result);
    }
    return results;
}
/**
 * 13. Send return approved notification
 * Notifies customer return is approved with label
 */
async function sendReturnApprovedNotification(orderId, returnId, shippingLabel, instructions) {
    const template = await getNotificationTemplate(NotificationType.RETURN_APPROVED, NotificationChannel.EMAIL);
    const content = renderTemplate(template, {
        orderId,
        returnId,
        shippingLabelUrl: shippingLabel,
        returnInstructions: instructions,
    });
    return await deliverNotification(NotificationChannel.EMAIL, {
        content,
        priority: NotificationPriority.NORMAL,
        attachments: [{ url: shippingLabel, filename: 'return-label.pdf' }],
    });
}
/**
 * 14. Send return received notification
 * Confirms return package received
 */
async function sendReturnReceivedNotification(orderId, returnId, receivedAt, processingTime) {
    const template = await getNotificationTemplate(NotificationType.RETURN_RECEIVED, NotificationChannel.EMAIL);
    const content = renderTemplate(template, {
        orderId,
        returnId,
        receivedAt,
        estimatedRefundTime: processingTime,
    });
    return await deliverNotification(NotificationChannel.EMAIL, {
        content,
        priority: NotificationPriority.NORMAL,
    });
}
/**
 * 15. Send refund processed notification
 * Confirms refund has been issued
 */
async function sendRefundProcessedNotification(orderId, refundAmount, refundMethod, transactionId) {
    const channels = [NotificationChannel.EMAIL, NotificationChannel.SMS];
    const results = [];
    for (const channel of channels) {
        const template = await getNotificationTemplate(NotificationType.REFUND_PROCESSED, channel);
        const content = renderTemplate(template, {
            orderId,
            refundAmount,
            refundMethod,
            transactionId,
            processingTime: '3-5 business days',
        });
        const result = await deliverNotification(channel, {
            content,
            priority: NotificationPriority.HIGH,
        });
        results.push(result);
    }
    return results;
}
/**
 * 16. Send order update notification
 * Generic update notification for order changes
 */
async function sendOrderUpdateNotification(orderId, updateType, updateDetails, channels = [NotificationChannel.EMAIL]) {
    const results = [];
    for (const channel of channels) {
        const template = await getNotificationTemplate(NotificationType.ORDER_UPDATE, channel);
        const content = renderTemplate(template, {
            orderId,
            updateType,
            ...updateDetails,
            timestamp: new Date(),
        });
        const result = await deliverNotification(channel, {
            content,
            priority: NotificationPriority.NORMAL,
        });
        results.push(result);
    }
    return results;
}
/**
 * 17. Send tracking update notification
 * Sends real-time tracking updates
 */
async function sendTrackingUpdateNotification(orderId, trackingUpdate) {
    const template = await getNotificationTemplate(NotificationType.TRACKING_UPDATE, NotificationChannel.PUSH);
    const content = renderTemplate(template, {
        orderId,
        ...trackingUpdate,
        latestEvent: trackingUpdate.events[0],
    });
    return await deliverNotification(NotificationChannel.PUSH, {
        content,
        priority: NotificationPriority.LOW,
    });
}
/**
 * 18. Send email notification
 * Low-level email delivery function
 */
async function sendEmailNotification(emailData, metadata) {
    try {
        const transporter = await getEmailTransporter();
        const mailOptions = {
            from: emailData.from || process.env.DEFAULT_FROM_EMAIL,
            to: emailData.to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: emailData.subject,
            text: emailData.body,
            html: emailData.htmlBody || emailData.body,
            attachments: emailData.attachments,
            replyTo: emailData.replyTo,
            headers: emailData.headers,
        };
        const info = await transporter.sendMail(mailOptions);
        return {
            notificationId: generateNotificationId(),
            channel: NotificationChannel.EMAIL,
            status: DeliveryStatus.SENT,
            deliveredAt: new Date(),
            externalId: info.messageId,
            metadata,
        };
    }
    catch (error) {
        return {
            notificationId: generateNotificationId(),
            channel: NotificationChannel.EMAIL,
            status: DeliveryStatus.FAILED,
            failureReason: error.message,
            metadata,
        };
    }
}
/**
 * 19. Send SMS notification
 * Low-level SMS delivery function
 */
async function sendSmsNotification(smsData, metadata) {
    try {
        const twilioClient = await getTwilioClient();
        const recipients = Array.isArray(smsData.to) ? smsData.to : [smsData.to];
        const results = [];
        for (const recipient of recipients) {
            const message = await twilioClient.messages.create({
                body: smsData.message,
                from: smsData.from || process.env.TWILIO_PHONE_NUMBER,
                to: recipient,
                mediaUrl: smsData.mediaUrls,
                statusCallback: smsData.statusCallback,
            });
            results.push({
                notificationId: generateNotificationId(),
                channel: NotificationChannel.SMS,
                status: DeliveryStatus.SENT,
                deliveredAt: new Date(),
                externalId: message.sid,
                metadata: { ...metadata, recipient },
            });
        }
        return results[0];
    }
    catch (error) {
        return {
            notificationId: generateNotificationId(),
            channel: NotificationChannel.SMS,
            status: DeliveryStatus.FAILED,
            failureReason: error.message,
            metadata,
        };
    }
}
/**
 * 20. Send push notification
 * Low-level push notification delivery via FCM/APNs
 */
async function sendPushNotification(pushData, metadata) {
    try {
        const fcmClient = await getFCMClient();
        const message = {
            notification: {
                title: pushData.title,
                body: pushData.body,
                imageUrl: pushData.imageUrl,
            },
            data: pushData.data,
            android: {
                notification: {
                    icon: pushData.icon,
                    sound: pushData.sound,
                    clickAction: pushData.clickAction,
                },
            },
            apns: {
                payload: {
                    aps: {
                        badge: pushData.badge,
                        sound: pushData.sound,
                    },
                },
            },
            tokens: pushData.deviceTokens,
        };
        const response = await fcmClient.sendMulticast(message);
        return {
            notificationId: generateNotificationId(),
            channel: NotificationChannel.PUSH,
            status: response.successCount > 0 ? DeliveryStatus.SENT : DeliveryStatus.FAILED,
            deliveredAt: new Date(),
            metadata: {
                ...metadata,
                successCount: response.successCount,
                failureCount: response.failureCount,
            },
        };
    }
    catch (error) {
        return {
            notificationId: generateNotificationId(),
            channel: NotificationChannel.PUSH,
            status: DeliveryStatus.FAILED,
            failureReason: error.message,
            metadata,
        };
    }
}
/**
 * 21. Send webhook notification
 * Sends notification via HTTP webhook
 */
async function sendWebhookNotification(webhookData, metadata) {
    try {
        const headers = {
            'Content-Type': 'application/json',
            ...webhookData.headers,
        };
        if (webhookData.authentication) {
            Object.assign(headers, getAuthenticationHeaders(webhookData.authentication));
        }
        const response = await fetch(webhookData.url, {
            method: webhookData.method,
            headers,
            body: JSON.stringify(webhookData.payload),
        });
        return {
            notificationId: generateNotificationId(),
            channel: NotificationChannel.WEBHOOK,
            status: response.ok ? DeliveryStatus.DELIVERED : DeliveryStatus.FAILED,
            deliveredAt: new Date(),
            metadata: {
                ...metadata,
                statusCode: response.status,
                responseBody: await response.text(),
            },
        };
    }
    catch (error) {
        return {
            notificationId: generateNotificationId(),
            channel: NotificationChannel.WEBHOOK,
            status: DeliveryStatus.FAILED,
            failureReason: error.message,
            metadata,
        };
    }
}
/**
 * 22. Send in-app notification
 * Creates notification within the application
 */
async function sendInAppNotification(inAppData) {
    try {
        // Store in database for user to retrieve
        await storeInAppNotification({
            userId: inAppData.userId,
            title: inAppData.title,
            message: inAppData.message,
            actionUrl: inAppData.actionUrl,
            iconUrl: inAppData.iconUrl,
            metadata: inAppData.metadata,
            read: false,
            createdAt: new Date(),
        });
        // Emit real-time event if user is connected
        await emitRealtimeNotification(inAppData.userId, {
            title: inAppData.title,
            message: inAppData.message,
            actionUrl: inAppData.actionUrl,
        });
        return {
            notificationId: generateNotificationId(),
            channel: NotificationChannel.IN_APP,
            status: DeliveryStatus.DELIVERED,
            deliveredAt: new Date(),
        };
    }
    catch (error) {
        return {
            notificationId: generateNotificationId(),
            channel: NotificationChannel.IN_APP,
            status: DeliveryStatus.FAILED,
            failureReason: error.message,
        };
    }
}
/**
 * 23. Get notification template
 * Retrieves and validates notification template
 */
async function getNotificationTemplate(notificationType, channel, locale = 'en') {
    const template = await NotificationTemplateModel.findOne({
        where: {
            notificationType,
            channel,
            locale,
            active: true,
        },
    });
    if (!template) {
        throw new common_1.NotFoundException(`Template not found for ${notificationType} on ${channel}`);
    }
    return {
        id: template.id,
        name: template.name,
        notificationType: template.notificationType,
        channel: template.channel,
        templateType: template.templateType,
        subject: template.subject,
        body: template.body,
        variables: template.variables,
        defaultValues: template.defaultValues,
        active: template.active,
    };
}
/**
 * 24. Create notification template
 * Creates new notification template
 */
async function createNotificationTemplate(templateData) {
    const existing = await NotificationTemplateModel.findOne({
        where: {
            name: templateData.name,
        },
    });
    if (existing) {
        throw new common_1.ConflictException(`Template with name ${templateData.name} already exists`);
    }
    const template = await NotificationTemplateModel.create(templateData);
    return {
        id: template.id,
        name: template.name,
        notificationType: template.notificationType,
        channel: template.channel,
        templateType: template.templateType,
        subject: template.subject,
        body: template.body,
        variables: template.variables,
        defaultValues: template.defaultValues,
        active: template.active,
    };
}
/**
 * 25. Render notification template
 * Renders template with provided data
 */
function renderTemplate(template, data) {
    const mergedData = {
        ...template.defaultValues,
        ...data,
    };
    switch (template.templateType) {
        case TemplateType.HANDLEBARS:
            return renderHandlebarsTemplate(template.body, mergedData);
        case TemplateType.MUSTACHE:
            return renderMustacheTemplate(template.body, mergedData);
        case TemplateType.EJS:
            return renderEJSTemplate(template.body, mergedData);
        case TemplateType.TEXT:
            return replaceVariables(template.body, mergedData);
        default:
            return template.body;
    }
}
/**
 * 26. Get customer notification preferences
 * Retrieves customer's notification preferences
 */
async function getCustomerNotificationPreferences(customerId) {
    let preferences = await CustomerNotificationPreferencesModel.findOne({
        where: { customerId },
    });
    if (!preferences) {
        // Create default preferences
        preferences = await CustomerNotificationPreferencesModel.create({
            customerId,
            emailEnabled: true,
            smsEnabled: true,
            pushEnabled: true,
            webhookEnabled: false,
            inAppEnabled: true,
            frequency: NotificationFrequency.IMMEDIATE,
            preferredLanguage: 'en',
            enabledTypes: Object.values(NotificationType),
            disabledTypes: [],
        });
    }
    return {
        customerId: preferences.customerId,
        emailEnabled: preferences.emailEnabled,
        smsEnabled: preferences.smsEnabled,
        pushEnabled: preferences.pushEnabled,
        webhookEnabled: preferences.webhookEnabled,
        inAppEnabled: preferences.inAppEnabled,
        frequency: preferences.frequency,
        quietHoursStart: preferences.quietHoursStart,
        quietHoursEnd: preferences.quietHoursEnd,
        timezone: preferences.timezone,
        preferredLanguage: preferences.preferredLanguage,
        enabledTypes: preferences.enabledTypes,
        disabledTypes: preferences.disabledTypes,
    };
}
/**
 * 27. Update customer notification preferences
 * Updates customer's notification settings
 */
async function updateCustomerNotificationPreferences(customerId, updates) {
    const [updated] = await CustomerNotificationPreferencesModel.update(updates, {
        where: { customerId },
    });
    if (updated === 0) {
        throw new common_1.NotFoundException(`Preferences not found for customer ${customerId}`);
    }
    return await getCustomerNotificationPreferences(customerId);
}
/**
 * 28. Schedule notification
 * Schedules notification for future delivery
 */
async function scheduleNotification(config, scheduledAt, notificationData) {
    if (scheduledAt <= new Date()) {
        throw new common_1.BadRequestException('Scheduled time must be in the future');
    }
    const notification = await OrderNotification.create({
        orderId: config.orderId,
        customerId: config.customerId,
        notificationType: config.notificationType,
        channel: config.channels[0], // Primary channel
        status: DeliveryStatus.PENDING,
        priority: config.priority || NotificationPriority.NORMAL,
        payload: notificationData,
        scheduledAt,
        metadata: config.metadata,
    });
    // Queue for processing at scheduled time
    await queueScheduledNotification(notification.id, scheduledAt);
    return notification;
}
/**
 * 29. Cancel scheduled notification
 * Cancels a scheduled notification
 */
async function cancelScheduledNotification(notificationId) {
    const notification = await OrderNotification.findByPk(notificationId);
    if (!notification) {
        throw new common_1.NotFoundException(`Notification ${notificationId} not found`);
    }
    if (notification.status !== DeliveryStatus.PENDING) {
        throw new common_1.BadRequestException('Only pending notifications can be cancelled');
    }
    await notification.update({ status: DeliveryStatus.FAILED, failureReason: 'Cancelled by user' });
    await removeFromNotificationQueue(notificationId);
    return true;
}
/**
 * 30. Get notification history
 * Retrieves notification history for an order
 */
async function getNotificationHistory(orderId, filters) {
    const whereClause = { orderId };
    if (filters) {
        if (filters.channel)
            whereClause.channel = filters.channel;
        if (filters.status)
            whereClause.status = filters.status;
        if (filters.type)
            whereClause.notificationType = filters.type;
        if (filters.startDate || filters.endDate) {
            whereClause.createdAt = {};
            if (filters.startDate)
                whereClause.createdAt.$gte = filters.startDate;
            if (filters.endDate)
                whereClause.createdAt.$lte = filters.endDate;
        }
    }
    const notifications = await OrderNotification.findAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
    });
    return notifications.map(n => ({
        id: n.id,
        orderId: n.orderId,
        customerId: n.customerId,
        notificationType: n.notificationType,
        channel: n.channel,
        status: n.status,
        sentAt: n.sentAt,
        deliveredAt: n.deliveredAt,
        openedAt: n.openedAt,
        clickedAt: n.clickedAt,
        failureReason: n.failureReason,
        retryCount: n.retryCount,
        metadata: n.metadata,
    }));
}
/**
 * 31. Track notification delivery
 * Updates notification tracking information
 */
async function trackNotificationDelivery(notificationId, event, metadata) {
    const notification = await OrderNotification.findByPk(notificationId);
    if (!notification) {
        throw new common_1.NotFoundException(`Notification ${notificationId} not found`);
    }
    const updates = { metadata: { ...notification.metadata, ...metadata } };
    switch (event) {
        case 'sent':
            updates.status = DeliveryStatus.SENT;
            updates.sentAt = new Date();
            break;
        case 'delivered':
            updates.status = DeliveryStatus.DELIVERED;
            updates.deliveredAt = new Date();
            break;
        case 'opened':
            updates.status = DeliveryStatus.OPENED;
            updates.openedAt = new Date();
            break;
        case 'clicked':
            updates.status = DeliveryStatus.CLICKED;
            updates.clickedAt = new Date();
            break;
        case 'failed':
            updates.status = DeliveryStatus.FAILED;
            break;
    }
    await notification.update(updates);
}
/**
 * 32. Retry failed notification
 * Retries a failed notification delivery
 */
async function retryFailedNotification(notificationId, maxRetries = 3) {
    const notification = await OrderNotification.findByPk(notificationId);
    if (!notification) {
        throw new common_1.NotFoundException(`Notification ${notificationId} not found`);
    }
    if (notification.retryCount >= maxRetries) {
        throw new common_1.BadRequestException(`Maximum retry attempts (${maxRetries}) exceeded`);
    }
    // Increment retry count
    await notification.update({ retryCount: notification.retryCount + 1 });
    // Attempt redelivery
    const result = await deliverNotification(notification.channel, {
        recipient: notification.recipient,
        content: notification.body,
        priority: notification.priority,
        metadata: notification.metadata,
    });
    // Update notification status
    await notification.update({
        status: result.status,
        sentAt: result.status === DeliveryStatus.SENT ? new Date() : notification.sentAt,
        deliveredAt: result.deliveredAt,
        failureReason: result.failureReason,
    });
    return result;
}
/**
 * 33. Batch send notifications
 * Sends notifications to multiple recipients
 */
async function batchSendNotifications(notificationType, recipients, channel = NotificationChannel.EMAIL) {
    const results = [];
    const template = await getNotificationTemplate(notificationType, channel);
    for (const recipient of recipients) {
        const content = renderTemplate(template, recipient.data);
        const result = await deliverNotification(channel, {
            recipient: recipient.email,
            content,
            priority: NotificationPriority.NORMAL,
        });
        results.push(result);
        // Log each notification
        await OrderNotification.create({
            orderId: recipient.data.orderId,
            customerId: recipient.customerId,
            notificationType,
            channel,
            status: result.status,
            recipient: recipient.email,
            body: content,
            sentAt: result.status === DeliveryStatus.SENT ? new Date() : null,
            deliveredAt: result.deliveredAt,
            failureReason: result.failureReason,
            metadata: recipient.data,
        });
    }
    return results;
}
/**
 * 34. Get notification analytics
 * Retrieves analytics for notification performance
 */
async function getNotificationAnalytics(filters) {
    const whereClause = {};
    if (filters.orderId)
        whereClause.orderId = filters.orderId;
    if (filters.customerId)
        whereClause.customerId = filters.customerId;
    if (filters.notificationType)
        whereClause.notificationType = filters.notificationType;
    if (filters.channel)
        whereClause.channel = filters.channel;
    if (filters.startDate || filters.endDate) {
        whereClause.createdAt = {};
        if (filters.startDate)
            whereClause.createdAt.$gte = filters.startDate;
        if (filters.endDate)
            whereClause.createdAt.$lte = filters.endDate;
    }
    const notifications = await OrderNotification.findAll({ where: whereClause });
    const total = notifications.length;
    const sent = notifications.filter(n => n.sentAt !== null).length;
    const delivered = notifications.filter(n => n.deliveredAt !== null).length;
    const opened = notifications.filter(n => n.openedAt !== null).length;
    const clicked = notifications.filter(n => n.clickedAt !== null).length;
    const failed = notifications.filter(n => n.status === DeliveryStatus.FAILED).length;
    const byChannel = {};
    const byType = {};
    notifications.forEach(n => {
        byChannel[n.channel] = (byChannel[n.channel] || 0) + 1;
        byType[n.notificationType] = (byType[n.notificationType] || 0) + 1;
    });
    return {
        total,
        sent,
        delivered,
        opened,
        clicked,
        failed,
        deliveryRate: total > 0 ? (delivered / total) * 100 : 0,
        openRate: delivered > 0 ? (opened / delivered) * 100 : 0,
        clickRate: opened > 0 ? (clicked / opened) * 100 : 0,
        byChannel,
        byType,
    };
}
/**
 * 35. Validate notification configuration
 * Validates notification configuration before sending
 */
function validateNotificationConfiguration(config, customerPreferences) {
    const errors = [];
    const warnings = [];
    // Check if notification type is disabled
    if (customerPreferences.disabledTypes.includes(config.notificationType)) {
        errors.push(`Customer has disabled ${config.notificationType} notifications`);
    }
    // Check quiet hours
    if (customerPreferences.quietHoursStart && customerPreferences.quietHoursEnd) {
        const now = new Date();
        const isQuietHours = isWithinQuietHours(now, customerPreferences.quietHoursStart, customerPreferences.quietHoursEnd, customerPreferences.timezone);
        if (isQuietHours && config.priority !== NotificationPriority.URGENT) {
            warnings.push('Current time is within customer quiet hours');
        }
    }
    // Check channel availability
    const enabledChannels = filterEnabledChannels(config.channels, customerPreferences);
    if (enabledChannels.length === 0) {
        errors.push('No enabled notification channels available');
    }
    // Check frequency limits
    if (customerPreferences.frequency !== NotificationFrequency.IMMEDIATE) {
        warnings.push(`Customer has ${customerPreferences.frequency} notification frequency preference`);
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function filterEnabledChannels(requestedChannels, preferences) {
    return requestedChannels.filter(channel => {
        switch (channel) {
            case NotificationChannel.EMAIL:
                return preferences.emailEnabled;
            case NotificationChannel.SMS:
                return preferences.smsEnabled;
            case NotificationChannel.PUSH:
                return preferences.pushEnabled;
            case NotificationChannel.WEBHOOK:
                return preferences.webhookEnabled;
            case NotificationChannel.IN_APP:
                return preferences.inAppEnabled;
            default:
                return false;
        }
    });
}
function getRecipientForChannel(channel, customer) {
    switch (channel) {
        case NotificationChannel.EMAIL:
            return customer.email;
        case NotificationChannel.SMS:
            return customer.phone;
        case NotificationChannel.PUSH:
            return customer.deviceToken;
        default:
            return customer.email;
    }
}
async function deliverNotification(channel, data) {
    // Placeholder implementation - integrate with actual delivery services
    return {
        notificationId: generateNotificationId(),
        channel,
        status: DeliveryStatus.SENT,
        deliveredAt: new Date(),
    };
}
async function logNotification(config, channel, result) {
    await OrderNotification.create({
        id: result.notificationId,
        orderId: config.orderId,
        customerId: config.customerId,
        notificationType: config.notificationType,
        channel,
        status: result.status,
        priority: config.priority || NotificationPriority.NORMAL,
        sentAt: result.status === DeliveryStatus.SENT ? new Date() : null,
        deliveredAt: result.deliveredAt,
        failureReason: result.failureReason,
        externalId: result.externalId,
        metadata: { ...config.metadata, ...result.metadata },
    });
}
function generateNotificationId() {
    return `not_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
function generateTrackingUrl(carrier, trackingNumber) {
    const carriers = {
        UPS: `https://www.ups.com/track?tracknum=${trackingNumber}`,
        FEDEX: `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNumber}`,
        USPS: `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
        DHL: `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`,
    };
    return carriers[carrier.toUpperCase()] || `#tracking-${trackingNumber}`;
}
function calculateDelayDays(originalDate, newDate) {
    const diffTime = Math.abs(newDate.getTime() - originalDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
function isWithinQuietHours(timestamp, quietStart, quietEnd, timezone) {
    // Simplified implementation
    const hour = timestamp.getHours();
    const startHour = parseInt(quietStart.split(':')[0]);
    const endHour = parseInt(quietEnd.split(':')[0]);
    if (startHour < endHour) {
        return hour >= startHour && hour < endHour;
    }
    else {
        return hour >= startHour || hour < endHour;
    }
}
function renderHandlebarsTemplate(template, data) {
    // Placeholder - integrate with Handlebars
    return replaceVariables(template, data);
}
function renderMustacheTemplate(template, data) {
    // Placeholder - integrate with Mustache
    return replaceVariables(template, data);
}
function renderEJSTemplate(template, data) {
    // Placeholder - integrate with EJS
    return replaceVariables(template, data);
}
function replaceVariables(template, data) {
    let result = template;
    Object.keys(data).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, String(data[key]));
    });
    return result;
}
function getAuthenticationHeaders(auth) {
    switch (auth.type) {
        case 'BASIC':
            return {
                Authorization: `Basic ${Buffer.from(`${auth.credentials.username}:${auth.credentials.password}`).toString('base64')}`,
            };
        case 'BEARER':
            return {
                Authorization: `Bearer ${auth.credentials.token}`,
            };
        case 'API_KEY':
            return {
                [auth.credentials.headerName || 'X-API-Key']: auth.credentials.apiKey,
            };
        default:
            return {};
    }
}
async function getEmailTransporter() {
    // Placeholder - return configured email transporter
    return null;
}
async function getTwilioClient() {
    // Placeholder - return configured Twilio client
    return null;
}
async function getFCMClient() {
    // Placeholder - return configured FCM client
    return null;
}
async function storeInAppNotification(data) {
    // Placeholder - store in database
}
async function emitRealtimeNotification(userId, data) {
    // Placeholder - emit via WebSocket/Socket.io
}
async function queueScheduledNotification(notificationId, scheduledAt) {
    // Placeholder - queue in job scheduler (Bull, etc.)
}
async function removeFromNotificationQueue(notificationId) {
    // Placeholder - remove from job queue
}
async function getRemainingOrderItems(orderId, cancelledItems) {
    // Placeholder - fetch remaining items
    return [];
}
//# sourceMappingURL=order-notifications-communication-kit.js.map