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
import { Model } from 'sequelize-typescript';
/**
 * Notification types for order-related communications
 */
export declare enum NotificationType {
    ORDER_CONFIRMATION = "ORDER_CONFIRMATION",
    ORDER_RECEIVED = "ORDER_RECEIVED",
    PAYMENT_CONFIRMATION = "PAYMENT_CONFIRMATION",
    SHIPPING_CONFIRMATION = "SHIPPING_CONFIRMATION",
    SHIPPED = "SHIPPED",
    IN_TRANSIT = "IN_TRANSIT",
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
    DELIVERED = "DELIVERED",
    DELIVERY_ATTEMPTED = "DELIVERY_ATTEMPTED",
    DELIVERY_FAILED = "DELIVERY_FAILED",
    DELAY_NOTIFICATION = "DELAY_NOTIFICATION",
    BACKORDER_NOTIFICATION = "BACKORDER_NOTIFICATION",
    CANCELLATION = "CANCELLATION",
    PARTIAL_CANCELLATION = "PARTIAL_CANCELLATION",
    RETURN_REQUESTED = "RETURN_REQUESTED",
    RETURN_APPROVED = "RETURN_APPROVED",
    RETURN_RECEIVED = "RETURN_RECEIVED",
    REFUND_PROCESSED = "REFUND_PROCESSED",
    ORDER_UPDATE = "ORDER_UPDATE",
    TRACKING_UPDATE = "TRACKING_UPDATE",
    CUSTOMER_SERVICE = "CUSTOMER_SERVICE"
}
/**
 * Communication channels for multi-channel delivery
 */
export declare enum NotificationChannel {
    EMAIL = "EMAIL",
    SMS = "SMS",
    PUSH = "PUSH",
    WEBHOOK = "WEBHOOK",
    IN_APP = "IN_APP",
    VOICE = "VOICE",
    WHATSAPP = "WHATSAPP",
    SLACK = "SLACK"
}
/**
 * Notification delivery status
 */
export declare enum DeliveryStatus {
    PENDING = "PENDING",
    QUEUED = "QUEUED",
    SENDING = "SENDING",
    SENT = "SENT",
    DELIVERED = "DELIVERED",
    FAILED = "FAILED",
    BOUNCED = "BOUNCED",
    REJECTED = "REJECTED",
    OPENED = "OPENED",
    CLICKED = "CLICKED",
    UNSUBSCRIBED = "UNSUBSCRIBED"
}
/**
 * Notification priority levels
 */
export declare enum NotificationPriority {
    LOW = "LOW",
    NORMAL = "NORMAL",
    HIGH = "HIGH",
    URGENT = "URGENT",
    CRITICAL = "CRITICAL"
}
/**
 * Template types for notification rendering
 */
export declare enum TemplateType {
    HTML = "HTML",
    TEXT = "TEXT",
    JSON = "JSON",
    HANDLEBARS = "HANDLEBARS",
    MUSTACHE = "MUSTACHE",
    EJS = "EJS"
}
/**
 * Notification frequency preferences
 */
export declare enum NotificationFrequency {
    IMMEDIATE = "IMMEDIATE",
    HOURLY = "HOURLY",
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    NEVER = "NEVER"
}
/**
 * Order notification configuration
 */
export interface OrderNotificationConfig {
    orderId: string;
    customerId: string;
    notificationType: NotificationType;
    channels: NotificationChannel[];
    priority?: NotificationPriority;
    scheduledAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Multi-channel notification data
 */
export interface MultiChannelNotification {
    email?: EmailNotificationData;
    sms?: SmsNotificationData;
    push?: PushNotificationData;
    webhook?: WebhookNotificationData;
    inApp?: InAppNotificationData;
}
/**
 * Email notification data structure
 */
export interface EmailNotificationData {
    to: string | string[];
    cc?: string[];
    bcc?: string[];
    from?: string;
    subject: string;
    body: string;
    htmlBody?: string;
    attachments?: EmailAttachment[];
    replyTo?: string;
    headers?: Record<string, string>;
}
/**
 * SMS notification data structure
 */
export interface SmsNotificationData {
    to: string | string[];
    message: string;
    from?: string;
    mediaUrls?: string[];
    statusCallback?: string;
}
/**
 * Push notification data structure
 */
export interface PushNotificationData {
    deviceTokens: string[];
    title: string;
    body: string;
    data?: Record<string, any>;
    badge?: number;
    sound?: string;
    icon?: string;
    imageUrl?: string;
    clickAction?: string;
}
/**
 * Webhook notification data structure
 */
export interface WebhookNotificationData {
    url: string;
    method: 'POST' | 'PUT' | 'PATCH';
    headers?: Record<string, string>;
    payload: Record<string, any>;
    retryPolicy?: RetryPolicy;
    authentication?: WebhookAuth;
}
/**
 * In-app notification data structure
 */
export interface InAppNotificationData {
    userId: string;
    title: string;
    message: string;
    actionUrl?: string;
    iconUrl?: string;
    metadata?: Record<string, any>;
}
/**
 * Email attachment structure
 */
export interface EmailAttachment {
    filename: string;
    content?: Buffer | string;
    path?: string;
    contentType?: string;
    encoding?: string;
}
/**
 * Webhook authentication configuration
 */
export interface WebhookAuth {
    type: 'BASIC' | 'BEARER' | 'API_KEY' | 'OAUTH2';
    credentials: Record<string, string>;
}
/**
 * Retry policy for failed notifications
 */
export interface RetryPolicy {
    maxAttempts: number;
    initialDelay: number;
    maxDelay: number;
    backoffMultiplier: number;
}
/**
 * Notification template structure
 */
export interface NotificationTemplate {
    id: string;
    name: string;
    notificationType: NotificationType;
    channel: NotificationChannel;
    templateType: TemplateType;
    subject?: string;
    body: string;
    variables: string[];
    defaultValues?: Record<string, any>;
    active: boolean;
}
/**
 * Customer notification preferences
 */
export interface CustomerNotificationPreferences {
    customerId: string;
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    webhookEnabled: boolean;
    inAppEnabled: boolean;
    frequency: NotificationFrequency;
    quietHoursStart?: string;
    quietHoursEnd?: string;
    timezone?: string;
    preferredLanguage?: string;
    enabledTypes: NotificationType[];
    disabledTypes: NotificationType[];
}
/**
 * Notification delivery result
 */
export interface NotificationDeliveryResult {
    notificationId: string;
    channel: NotificationChannel;
    status: DeliveryStatus;
    deliveredAt?: Date;
    failureReason?: string;
    externalId?: string;
    metadata?: Record<string, any>;
}
/**
 * Notification history entry
 */
export interface NotificationHistoryEntry {
    id: string;
    orderId: string;
    customerId: string;
    notificationType: NotificationType;
    channel: NotificationChannel;
    status: DeliveryStatus;
    sentAt?: Date;
    deliveredAt?: Date;
    openedAt?: Date;
    clickedAt?: Date;
    failureReason?: string;
    retryCount: number;
    metadata: Record<string, any>;
}
/**
 * Tracking update data
 */
export interface TrackingUpdateData {
    trackingNumber: string;
    carrier: string;
    status: string;
    location?: string;
    timestamp: Date;
    estimatedDelivery?: Date;
    events: TrackingEvent[];
}
/**
 * Tracking event
 */
export interface TrackingEvent {
    timestamp: Date;
    status: string;
    location: string;
    description: string;
}
/**
 * Delivery schedule information
 */
export interface DeliverySchedule {
    orderId: string;
    estimatedDeliveryDate: Date;
    deliveryWindow?: {
        start: string;
        end: string;
    };
    carrier: string;
    trackingNumber?: string;
    specialInstructions?: string;
}
/**
 * Delay notification details
 */
export interface DelayNotificationDetails {
    orderId: string;
    originalDeliveryDate: Date;
    newDeliveryDate: Date;
    delayReason: string;
    affectedItems?: string[];
    compensationOffered?: string;
}
/**
 * Cancellation details
 */
export interface CancellationDetails {
    orderId: string;
    cancelledBy: string;
    cancellationReason: string;
    refundAmount: number;
    refundMethod: string;
    processingTime: string;
    affectedItems?: string[];
}
/**
 * Return notification details
 */
export interface ReturnNotificationDetails {
    orderId: string;
    returnId: string;
    returnReason: string;
    items: ReturnItem[];
    refundAmount: number;
    returnShippingLabel?: string;
    returnInstructions: string;
}
/**
 * Return item
 */
export interface ReturnItem {
    itemId: string;
    productName: string;
    quantity: number;
    reason: string;
    condition?: string;
}
/**
 * Notification log model for tracking all notifications
 */
export declare class OrderNotification extends Model {
    id: string;
    orderId: string;
    customerId: string;
    notificationType: NotificationType;
    channel: NotificationChannel;
    status: DeliveryStatus;
    priority: NotificationPriority;
    recipient: string;
    subject: string;
    body: string;
    payload: Record<string, any>;
    scheduledAt: Date;
    sentAt: Date;
    deliveredAt: Date;
    openedAt: Date;
    clickedAt: Date;
    retryCount: number;
    failureReason: string;
    externalId: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Notification template model
 */
export declare class NotificationTemplateModel extends Model {
    id: string;
    name: string;
    notificationType: NotificationType;
    channel: NotificationChannel;
    templateType: TemplateType;
    subject: string;
    body: string;
    variables: string[];
    defaultValues: Record<string, any>;
    active: boolean;
    locale: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Customer notification preferences model
 */
export declare class CustomerNotificationPreferencesModel extends Model {
    id: string;
    customerId: string;
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    webhookEnabled: boolean;
    inAppEnabled: boolean;
    frequency: NotificationFrequency;
    quietHoursStart: string;
    quietHoursEnd: string;
    timezone: string;
    preferredLanguage: string;
    enabledTypes: NotificationType[];
    disabledTypes: NotificationType[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * DTO for sending order confirmation
 */
export declare class SendOrderConfirmationDto {
    orderId: string;
    customerId: string;
    metadata?: Record<string, any>;
}
/**
 * DTO for sending shipping notification
 */
export declare class SendShippingNotificationDto {
    orderId: string;
    trackingNumber: string;
    carrier: string;
    estimatedDelivery?: Date;
}
/**
 * DTO for sending delivery notification
 */
export declare class SendDeliveryNotificationDto {
    orderId: string;
    deliveredAt: Date;
    location?: string;
    proofOfDelivery?: string;
}
/**
 * DTO for sending delay notification
 */
export declare class SendDelayNotificationDto {
    orderId: string;
    originalDeliveryDate: Date;
    newDeliveryDate: Date;
    delayReason: string;
}
/**
 * DTO for customer notification preferences
 */
export declare class UpdateNotificationPreferencesDto {
    emailEnabled?: boolean;
    smsEnabled?: boolean;
    pushEnabled?: boolean;
    frequency?: NotificationFrequency;
    disabledTypes?: NotificationType[];
}
/**
 * 1. Send order confirmation notification
 * Sends multi-channel confirmation when order is placed
 */
export declare function sendOrderConfirmation(config: OrderNotificationConfig, orderData: Record<string, any>, customerPreferences: CustomerNotificationPreferences): Promise<NotificationDeliveryResult[]>;
/**
 * 2. Send payment confirmation notification
 * Notifies customer when payment is successfully processed
 */
export declare function sendPaymentConfirmation(orderId: string, paymentData: Record<string, any>, channels?: NotificationChannel[]): Promise<NotificationDeliveryResult[]>;
/**
 * 3. Send shipping confirmation notification
 * Notifies when order has been shipped with tracking info
 */
export declare function sendShippingConfirmation(orderId: string, shippingData: {
    trackingNumber: string;
    carrier: string;
    estimatedDelivery?: Date;
    shippingMethod: string;
}, customerEmail: string): Promise<NotificationDeliveryResult[]>;
/**
 * 4. Send in-transit notification
 * Updates customer on shipment progress
 */
export declare function sendInTransitNotification(orderId: string, trackingUpdate: TrackingUpdateData): Promise<NotificationDeliveryResult>;
/**
 * 5. Send out-for-delivery notification
 * Notifies when package is out for delivery
 */
export declare function sendOutForDeliveryNotification(orderId: string, deliveryWindow: {
    start: string;
    end: string;
}, customerContact: string): Promise<NotificationDeliveryResult[]>;
/**
 * 6. Send delivered notification
 * Confirms successful delivery to customer
 */
export declare function sendDeliveredNotification(orderId: string, deliveryDetails: {
    deliveredAt: Date;
    location: string;
    signature?: string;
    photoUrl?: string;
}): Promise<NotificationDeliveryResult[]>;
/**
 * 7. Send delivery attempted notification
 * Notifies when delivery was attempted but failed
 */
export declare function sendDeliveryAttemptedNotification(orderId: string, attemptDetails: {
    attemptedAt: Date;
    reason: string;
    nextAttempt?: Date;
    pickupLocation?: string;
}): Promise<NotificationDeliveryResult[]>;
/**
 * 8. Send delay notification
 * Alerts customer about delivery delays
 */
export declare function sendDelayNotification(delayDetails: DelayNotificationDetails): Promise<NotificationDeliveryResult[]>;
/**
 * 9. Send backorder notification
 * Notifies customer about backordered items
 */
export declare function sendBackorderNotification(orderId: string, backorderInfo: {
    items: Array<{
        productId: string;
        name: string;
        quantity: number;
    }>;
    expectedRestockDate?: Date;
}): Promise<NotificationDeliveryResult>;
/**
 * 10. Send cancellation notification
 * Notifies customer when order is cancelled
 */
export declare function sendCancellationNotification(cancellationDetails: CancellationDetails): Promise<NotificationDeliveryResult[]>;
/**
 * 11. Send partial cancellation notification
 * Notifies when some items in order are cancelled
 */
export declare function sendPartialCancellationNotification(orderId: string, cancelledItems: Array<{
    productId: string;
    name: string;
    quantity: number;
    reason: string;
}>, partialRefund: number): Promise<NotificationDeliveryResult>;
/**
 * 12. Send return requested notification
 * Confirms return request received
 */
export declare function sendReturnRequestedNotification(returnDetails: ReturnNotificationDetails): Promise<NotificationDeliveryResult[]>;
/**
 * 13. Send return approved notification
 * Notifies customer return is approved with label
 */
export declare function sendReturnApprovedNotification(orderId: string, returnId: string, shippingLabel: string, instructions: string): Promise<NotificationDeliveryResult>;
/**
 * 14. Send return received notification
 * Confirms return package received
 */
export declare function sendReturnReceivedNotification(orderId: string, returnId: string, receivedAt: Date, processingTime: string): Promise<NotificationDeliveryResult>;
/**
 * 15. Send refund processed notification
 * Confirms refund has been issued
 */
export declare function sendRefundProcessedNotification(orderId: string, refundAmount: number, refundMethod: string, transactionId: string): Promise<NotificationDeliveryResult[]>;
/**
 * 16. Send order update notification
 * Generic update notification for order changes
 */
export declare function sendOrderUpdateNotification(orderId: string, updateType: string, updateDetails: Record<string, any>, channels?: NotificationChannel[]): Promise<NotificationDeliveryResult[]>;
/**
 * 17. Send tracking update notification
 * Sends real-time tracking updates
 */
export declare function sendTrackingUpdateNotification(orderId: string, trackingUpdate: TrackingUpdateData): Promise<NotificationDeliveryResult>;
/**
 * 18. Send email notification
 * Low-level email delivery function
 */
export declare function sendEmailNotification(emailData: EmailNotificationData, metadata?: Record<string, any>): Promise<NotificationDeliveryResult>;
/**
 * 19. Send SMS notification
 * Low-level SMS delivery function
 */
export declare function sendSmsNotification(smsData: SmsNotificationData, metadata?: Record<string, any>): Promise<NotificationDeliveryResult>;
/**
 * 20. Send push notification
 * Low-level push notification delivery via FCM/APNs
 */
export declare function sendPushNotification(pushData: PushNotificationData, metadata?: Record<string, any>): Promise<NotificationDeliveryResult>;
/**
 * 21. Send webhook notification
 * Sends notification via HTTP webhook
 */
export declare function sendWebhookNotification(webhookData: WebhookNotificationData, metadata?: Record<string, any>): Promise<NotificationDeliveryResult>;
/**
 * 22. Send in-app notification
 * Creates notification within the application
 */
export declare function sendInAppNotification(inAppData: InAppNotificationData): Promise<NotificationDeliveryResult>;
/**
 * 23. Get notification template
 * Retrieves and validates notification template
 */
export declare function getNotificationTemplate(notificationType: NotificationType, channel: NotificationChannel, locale?: string): Promise<NotificationTemplate>;
/**
 * 24. Create notification template
 * Creates new notification template
 */
export declare function createNotificationTemplate(templateData: Omit<NotificationTemplate, 'id'>): Promise<NotificationTemplate>;
/**
 * 25. Render notification template
 * Renders template with provided data
 */
export declare function renderTemplate(template: NotificationTemplate, data: Record<string, any>): string;
/**
 * 26. Get customer notification preferences
 * Retrieves customer's notification preferences
 */
export declare function getCustomerNotificationPreferences(customerId: string): Promise<CustomerNotificationPreferences>;
/**
 * 27. Update customer notification preferences
 * Updates customer's notification settings
 */
export declare function updateCustomerNotificationPreferences(customerId: string, updates: Partial<CustomerNotificationPreferences>): Promise<CustomerNotificationPreferences>;
/**
 * 28. Schedule notification
 * Schedules notification for future delivery
 */
export declare function scheduleNotification(config: OrderNotificationConfig, scheduledAt: Date, notificationData: Record<string, any>): Promise<OrderNotification>;
/**
 * 29. Cancel scheduled notification
 * Cancels a scheduled notification
 */
export declare function cancelScheduledNotification(notificationId: string): Promise<boolean>;
/**
 * 30. Get notification history
 * Retrieves notification history for an order
 */
export declare function getNotificationHistory(orderId: string, filters?: {
    channel?: NotificationChannel;
    status?: DeliveryStatus;
    type?: NotificationType;
    startDate?: Date;
    endDate?: Date;
}): Promise<NotificationHistoryEntry[]>;
/**
 * 31. Track notification delivery
 * Updates notification tracking information
 */
export declare function trackNotificationDelivery(notificationId: string, event: 'sent' | 'delivered' | 'opened' | 'clicked' | 'failed', metadata?: Record<string, any>): Promise<void>;
/**
 * 32. Retry failed notification
 * Retries a failed notification delivery
 */
export declare function retryFailedNotification(notificationId: string, maxRetries?: number): Promise<NotificationDeliveryResult>;
/**
 * 33. Batch send notifications
 * Sends notifications to multiple recipients
 */
export declare function batchSendNotifications(notificationType: NotificationType, recipients: Array<{
    customerId: string;
    email: string;
    data: Record<string, any>;
}>, channel?: NotificationChannel): Promise<NotificationDeliveryResult[]>;
/**
 * 34. Get notification analytics
 * Retrieves analytics for notification performance
 */
export declare function getNotificationAnalytics(filters: {
    orderId?: string;
    customerId?: string;
    notificationType?: NotificationType;
    channel?: NotificationChannel;
    startDate?: Date;
    endDate?: Date;
}): Promise<{
    total: number;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    failed: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    byChannel: Record<NotificationChannel, number>;
    byType: Record<NotificationType, number>;
}>;
/**
 * 35. Validate notification configuration
 * Validates notification configuration before sending
 */
export declare function validateNotificationConfiguration(config: OrderNotificationConfig, customerPreferences: CustomerNotificationPreferences): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
//# sourceMappingURL=order-notifications-communication-kit.d.ts.map