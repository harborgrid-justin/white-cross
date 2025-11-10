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

import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
  Logger,
  Inject,
} from '@nestjs/common';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  IsEnum,
  IsArray,
  IsBoolean,
  IsEmail,
  IsObject,
  ValidateNested,
  IsDate,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

/**
 * Notification types for order-related communications
 */
export enum NotificationType {
  ORDER_CONFIRMATION = 'ORDER_CONFIRMATION',
  ORDER_RECEIVED = 'ORDER_RECEIVED',
  PAYMENT_CONFIRMATION = 'PAYMENT_CONFIRMATION',
  SHIPPING_CONFIRMATION = 'SHIPPING_CONFIRMATION',
  SHIPPED = 'SHIPPED',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  DELIVERY_ATTEMPTED = 'DELIVERY_ATTEMPTED',
  DELIVERY_FAILED = 'DELIVERY_FAILED',
  DELAY_NOTIFICATION = 'DELAY_NOTIFICATION',
  BACKORDER_NOTIFICATION = 'BACKORDER_NOTIFICATION',
  CANCELLATION = 'CANCELLATION',
  PARTIAL_CANCELLATION = 'PARTIAL_CANCELLATION',
  RETURN_REQUESTED = 'RETURN_REQUESTED',
  RETURN_APPROVED = 'RETURN_APPROVED',
  RETURN_RECEIVED = 'RETURN_RECEIVED',
  REFUND_PROCESSED = 'REFUND_PROCESSED',
  ORDER_UPDATE = 'ORDER_UPDATE',
  TRACKING_UPDATE = 'TRACKING_UPDATE',
  CUSTOMER_SERVICE = 'CUSTOMER_SERVICE',
}

/**
 * Communication channels for multi-channel delivery
 */
export enum NotificationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  WEBHOOK = 'WEBHOOK',
  IN_APP = 'IN_APP',
  VOICE = 'VOICE',
  WHATSAPP = 'WHATSAPP',
  SLACK = 'SLACK',
}

/**
 * Notification delivery status
 */
export enum DeliveryStatus {
  PENDING = 'PENDING',
  QUEUED = 'QUEUED',
  SENDING = 'SENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  BOUNCED = 'BOUNCED',
  REJECTED = 'REJECTED',
  OPENED = 'OPENED',
  CLICKED = 'CLICKED',
  UNSUBSCRIBED = 'UNSUBSCRIBED',
}

/**
 * Notification priority levels
 */
export enum NotificationPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL',
}

/**
 * Template types for notification rendering
 */
export enum TemplateType {
  HTML = 'HTML',
  TEXT = 'TEXT',
  JSON = 'JSON',
  HANDLEBARS = 'HANDLEBARS',
  MUSTACHE = 'MUSTACHE',
  EJS = 'EJS',
}

/**
 * Notification frequency preferences
 */
export enum NotificationFrequency {
  IMMEDIATE = 'IMMEDIATE',
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  NEVER = 'NEVER',
}

// ============================================================================
// TYPE DEFINITIONS & INTERFACES
// ============================================================================

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

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Notification log model for tracking all notifications
 */
@Table({ tableName: 'order_notifications', timestamps: true, paranoid: true })
export class OrderNotification extends Model {
  @Column({ type: DataType.UUID, primaryKey: true, defaultValue: DataType.UUIDV4 })
  id: string;

  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  orderId: string;

  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  customerId: string;

  @Column({ type: DataType.ENUM(...Object.values(NotificationType)), allowNull: false })
  notificationType: NotificationType;

  @Column({ type: DataType.ENUM(...Object.values(NotificationChannel)), allowNull: false })
  channel: NotificationChannel;

  @Column({ type: DataType.ENUM(...Object.values(DeliveryStatus)), defaultValue: DeliveryStatus.PENDING })
  status: DeliveryStatus;

  @Column({ type: DataType.ENUM(...Object.values(NotificationPriority)), defaultValue: NotificationPriority.NORMAL })
  priority: NotificationPriority;

  @Column({ type: DataType.STRING, allowNull: true })
  recipient: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  subject: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  body: string;

  @Column({ type: DataType.JSON, allowNull: true })
  payload: Record<string, any>;

  @Column({ type: DataType.DATE, allowNull: true })
  scheduledAt: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  sentAt: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  deliveredAt: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  openedAt: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  clickedAt: Date;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  retryCount: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  failureReason: string;

  @Column({ type: DataType.STRING, allowNull: true })
  externalId: string;

  @Column({ type: DataType.JSON, allowNull: true })
  metadata: Record<string, any>;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Notification template model
 */
@Table({ tableName: 'notification_templates', timestamps: true })
export class NotificationTemplateModel extends Model {
  @Column({ type: DataType.UUID, primaryKey: true, defaultValue: DataType.UUIDV4 })
  id: string;

  @Index
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @Column({ type: DataType.ENUM(...Object.values(NotificationType)), allowNull: false })
  notificationType: NotificationType;

  @Column({ type: DataType.ENUM(...Object.values(NotificationChannel)), allowNull: false })
  channel: NotificationChannel;

  @Column({ type: DataType.ENUM(...Object.values(TemplateType)), allowNull: false })
  templateType: TemplateType;

  @Column({ type: DataType.STRING, allowNull: true })
  subject: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  body: string;

  @Column({ type: DataType.JSON, allowNull: true })
  variables: string[];

  @Column({ type: DataType.JSON, allowNull: true })
  defaultValues: Record<string, any>;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  active: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  locale: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Customer notification preferences model
 */
@Table({ tableName: 'customer_notification_preferences', timestamps: true })
export class CustomerNotificationPreferencesModel extends Model {
  @Column({ type: DataType.UUID, primaryKey: true, defaultValue: DataType.UUIDV4 })
  id: string;

  @Index({ unique: true })
  @Column({ type: DataType.UUID, allowNull: false })
  customerId: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  emailEnabled: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  smsEnabled: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  pushEnabled: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  webhookEnabled: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  inAppEnabled: boolean;

  @Column({ type: DataType.ENUM(...Object.values(NotificationFrequency)), defaultValue: NotificationFrequency.IMMEDIATE })
  frequency: NotificationFrequency;

  @Column({ type: DataType.STRING, allowNull: true })
  quietHoursStart: string;

  @Column({ type: DataType.STRING, allowNull: true })
  quietHoursEnd: string;

  @Column({ type: DataType.STRING, allowNull: true })
  timezone: string;

  @Column({ type: DataType.STRING, defaultValue: 'en' })
  preferredLanguage: string;

  @Column({ type: DataType.JSON, allowNull: true })
  enabledTypes: NotificationType[];

  @Column({ type: DataType.JSON, allowNull: true })
  disabledTypes: NotificationType[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================

/**
 * DTO for sending order confirmation
 */
export class SendOrderConfirmationDto {
  @ApiProperty({ description: 'Order ID' })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Customer ID' })
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

/**
 * DTO for sending shipping notification
 */
export class SendShippingNotificationDto {
  @ApiProperty({ description: 'Order ID' })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Tracking number' })
  @IsNotEmpty()
  @IsString()
  trackingNumber: string;

  @ApiProperty({ description: 'Carrier name' })
  @IsNotEmpty()
  @IsString()
  carrier: string;

  @ApiPropertyOptional({ description: 'Estimated delivery date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  estimatedDelivery?: Date;
}

/**
 * DTO for sending delivery notification
 */
export class SendDeliveryNotificationDto {
  @ApiProperty({ description: 'Order ID' })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Delivery timestamp' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  deliveredAt: Date;

  @ApiPropertyOptional({ description: 'Delivery location' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Signature or proof of delivery' })
  @IsOptional()
  @IsString()
  proofOfDelivery?: string;
}

/**
 * DTO for sending delay notification
 */
export class SendDelayNotificationDto {
  @ApiProperty({ description: 'Order ID' })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Original delivery date' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  originalDeliveryDate: Date;

  @ApiProperty({ description: 'New delivery date' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  newDeliveryDate: Date;

  @ApiProperty({ description: 'Reason for delay' })
  @IsNotEmpty()
  @IsString()
  delayReason: string;
}

/**
 * DTO for customer notification preferences
 */
export class UpdateNotificationPreferencesDto {
  @ApiPropertyOptional({ description: 'Enable email notifications' })
  @IsOptional()
  @IsBoolean()
  emailEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Enable SMS notifications' })
  @IsOptional()
  @IsBoolean()
  smsEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Enable push notifications' })
  @IsOptional()
  @IsBoolean()
  pushEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Notification frequency' })
  @IsOptional()
  @IsEnum(NotificationFrequency)
  frequency?: NotificationFrequency;

  @ApiPropertyOptional({ description: 'Disabled notification types' })
  @IsOptional()
  @IsArray()
  @IsEnum(NotificationType, { each: true })
  disabledTypes?: NotificationType[];
}

// ============================================================================
// NOTIFICATION SERVICE FUNCTIONS
// ============================================================================

/**
 * 1. Send order confirmation notification
 * Sends multi-channel confirmation when order is placed
 */
export async function sendOrderConfirmation(
  config: OrderNotificationConfig,
  orderData: Record<string, any>,
  customerPreferences: CustomerNotificationPreferences,
): Promise<NotificationDeliveryResult[]> {
  const results: NotificationDeliveryResult[] = [];
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
export async function sendPaymentConfirmation(
  orderId: string,
  paymentData: Record<string, any>,
  channels: NotificationChannel[] = [NotificationChannel.EMAIL],
): Promise<NotificationDeliveryResult[]> {
  const results: NotificationDeliveryResult[] = [];

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
export async function sendShippingConfirmation(
  orderId: string,
  shippingData: {
    trackingNumber: string;
    carrier: string;
    estimatedDelivery?: Date;
    shippingMethod: string;
  },
  customerEmail: string,
): Promise<NotificationDeliveryResult[]> {
  const channels = [NotificationChannel.EMAIL, NotificationChannel.SMS, NotificationChannel.PUSH];
  const results: NotificationDeliveryResult[] = [];

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
export async function sendInTransitNotification(
  orderId: string,
  trackingUpdate: TrackingUpdateData,
): Promise<NotificationDeliveryResult> {
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
export async function sendOutForDeliveryNotification(
  orderId: string,
  deliveryWindow: { start: string; end: string },
  customerContact: string,
): Promise<NotificationDeliveryResult[]> {
  const channels = [NotificationChannel.SMS, NotificationChannel.PUSH];
  const results: NotificationDeliveryResult[] = [];

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
export async function sendDeliveredNotification(
  orderId: string,
  deliveryDetails: {
    deliveredAt: Date;
    location: string;
    signature?: string;
    photoUrl?: string;
  },
): Promise<NotificationDeliveryResult[]> {
  const channels = [NotificationChannel.EMAIL, NotificationChannel.PUSH];
  const results: NotificationDeliveryResult[] = [];

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
export async function sendDeliveryAttemptedNotification(
  orderId: string,
  attemptDetails: {
    attemptedAt: Date;
    reason: string;
    nextAttempt?: Date;
    pickupLocation?: string;
  },
): Promise<NotificationDeliveryResult[]> {
  const channels = [NotificationChannel.EMAIL, NotificationChannel.SMS];
  const results: NotificationDeliveryResult[] = [];

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
export async function sendDelayNotification(
  delayDetails: DelayNotificationDetails,
): Promise<NotificationDeliveryResult[]> {
  const channels = [NotificationChannel.EMAIL, NotificationChannel.SMS, NotificationChannel.PUSH];
  const results: NotificationDeliveryResult[] = [];

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
export async function sendBackorderNotification(
  orderId: string,
  backorderInfo: {
    items: Array<{ productId: string; name: string; quantity: number }>;
    expectedRestockDate?: Date;
  },
): Promise<NotificationDeliveryResult> {
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
export async function sendCancellationNotification(
  cancellationDetails: CancellationDetails,
): Promise<NotificationDeliveryResult[]> {
  const channels = [NotificationChannel.EMAIL, NotificationChannel.SMS];
  const results: NotificationDeliveryResult[] = [];

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
export async function sendPartialCancellationNotification(
  orderId: string,
  cancelledItems: Array<{ productId: string; name: string; quantity: number; reason: string }>,
  partialRefund: number,
): Promise<NotificationDeliveryResult> {
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
export async function sendReturnRequestedNotification(
  returnDetails: ReturnNotificationDetails,
): Promise<NotificationDeliveryResult[]> {
  const channels = [NotificationChannel.EMAIL];
  const results: NotificationDeliveryResult[] = [];

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
export async function sendReturnApprovedNotification(
  orderId: string,
  returnId: string,
  shippingLabel: string,
  instructions: string,
): Promise<NotificationDeliveryResult> {
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
export async function sendReturnReceivedNotification(
  orderId: string,
  returnId: string,
  receivedAt: Date,
  processingTime: string,
): Promise<NotificationDeliveryResult> {
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
export async function sendRefundProcessedNotification(
  orderId: string,
  refundAmount: number,
  refundMethod: string,
  transactionId: string,
): Promise<NotificationDeliveryResult[]> {
  const channels = [NotificationChannel.EMAIL, NotificationChannel.SMS];
  const results: NotificationDeliveryResult[] = [];

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
export async function sendOrderUpdateNotification(
  orderId: string,
  updateType: string,
  updateDetails: Record<string, any>,
  channels: NotificationChannel[] = [NotificationChannel.EMAIL],
): Promise<NotificationDeliveryResult[]> {
  const results: NotificationDeliveryResult[] = [];

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
export async function sendTrackingUpdateNotification(
  orderId: string,
  trackingUpdate: TrackingUpdateData,
): Promise<NotificationDeliveryResult> {
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
export async function sendEmailNotification(
  emailData: EmailNotificationData,
  metadata?: Record<string, any>,
): Promise<NotificationDeliveryResult> {
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
  } catch (error) {
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
export async function sendSmsNotification(
  smsData: SmsNotificationData,
  metadata?: Record<string, any>,
): Promise<NotificationDeliveryResult> {
  try {
    const twilioClient = await getTwilioClient();

    const recipients = Array.isArray(smsData.to) ? smsData.to : [smsData.to];
    const results: NotificationDeliveryResult[] = [];

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
  } catch (error) {
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
export async function sendPushNotification(
  pushData: PushNotificationData,
  metadata?: Record<string, any>,
): Promise<NotificationDeliveryResult> {
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
  } catch (error) {
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
export async function sendWebhookNotification(
  webhookData: WebhookNotificationData,
  metadata?: Record<string, any>,
): Promise<NotificationDeliveryResult> {
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
  } catch (error) {
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
export async function sendInAppNotification(
  inAppData: InAppNotificationData,
): Promise<NotificationDeliveryResult> {
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
  } catch (error) {
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
export async function getNotificationTemplate(
  notificationType: NotificationType,
  channel: NotificationChannel,
  locale: string = 'en',
): Promise<NotificationTemplate> {
  const template = await NotificationTemplateModel.findOne({
    where: {
      notificationType,
      channel,
      locale,
      active: true,
    },
  });

  if (!template) {
    throw new NotFoundException(`Template not found for ${notificationType} on ${channel}`);
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
export async function createNotificationTemplate(
  templateData: Omit<NotificationTemplate, 'id'>,
): Promise<NotificationTemplate> {
  const existing = await NotificationTemplateModel.findOne({
    where: {
      name: templateData.name,
    },
  });

  if (existing) {
    throw new ConflictException(`Template with name ${templateData.name} already exists`);
  }

  const template = await NotificationTemplateModel.create(templateData as any);

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
export function renderTemplate(
  template: NotificationTemplate,
  data: Record<string, any>,
): string {
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
export async function getCustomerNotificationPreferences(
  customerId: string,
): Promise<CustomerNotificationPreferences> {
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
    } as any);
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
export async function updateCustomerNotificationPreferences(
  customerId: string,
  updates: Partial<CustomerNotificationPreferences>,
): Promise<CustomerNotificationPreferences> {
  const [updated] = await CustomerNotificationPreferencesModel.update(updates as any, {
    where: { customerId },
  });

  if (updated === 0) {
    throw new NotFoundException(`Preferences not found for customer ${customerId}`);
  }

  return await getCustomerNotificationPreferences(customerId);
}

/**
 * 28. Schedule notification
 * Schedules notification for future delivery
 */
export async function scheduleNotification(
  config: OrderNotificationConfig,
  scheduledAt: Date,
  notificationData: Record<string, any>,
): Promise<OrderNotification> {
  if (scheduledAt <= new Date()) {
    throw new BadRequestException('Scheduled time must be in the future');
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
  } as any);

  // Queue for processing at scheduled time
  await queueScheduledNotification(notification.id, scheduledAt);

  return notification;
}

/**
 * 29. Cancel scheduled notification
 * Cancels a scheduled notification
 */
export async function cancelScheduledNotification(
  notificationId: string,
): Promise<boolean> {
  const notification = await OrderNotification.findByPk(notificationId);

  if (!notification) {
    throw new NotFoundException(`Notification ${notificationId} not found`);
  }

  if (notification.status !== DeliveryStatus.PENDING) {
    throw new BadRequestException('Only pending notifications can be cancelled');
  }

  await notification.update({ status: DeliveryStatus.FAILED, failureReason: 'Cancelled by user' });
  await removeFromNotificationQueue(notificationId);

  return true;
}

/**
 * 30. Get notification history
 * Retrieves notification history for an order
 */
export async function getNotificationHistory(
  orderId: string,
  filters?: {
    channel?: NotificationChannel;
    status?: DeliveryStatus;
    type?: NotificationType;
    startDate?: Date;
    endDate?: Date;
  },
): Promise<NotificationHistoryEntry[]> {
  const whereClause: any = { orderId };

  if (filters) {
    if (filters.channel) whereClause.channel = filters.channel;
    if (filters.status) whereClause.status = filters.status;
    if (filters.type) whereClause.notificationType = filters.type;
    if (filters.startDate || filters.endDate) {
      whereClause.createdAt = {};
      if (filters.startDate) whereClause.createdAt.$gte = filters.startDate;
      if (filters.endDate) whereClause.createdAt.$lte = filters.endDate;
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
export async function trackNotificationDelivery(
  notificationId: string,
  event: 'sent' | 'delivered' | 'opened' | 'clicked' | 'failed',
  metadata?: Record<string, any>,
): Promise<void> {
  const notification = await OrderNotification.findByPk(notificationId);

  if (!notification) {
    throw new NotFoundException(`Notification ${notificationId} not found`);
  }

  const updates: any = { metadata: { ...notification.metadata, ...metadata } };

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
export async function retryFailedNotification(
  notificationId: string,
  maxRetries: number = 3,
): Promise<NotificationDeliveryResult> {
  const notification = await OrderNotification.findByPk(notificationId);

  if (!notification) {
    throw new NotFoundException(`Notification ${notificationId} not found`);
  }

  if (notification.retryCount >= maxRetries) {
    throw new BadRequestException(`Maximum retry attempts (${maxRetries}) exceeded`);
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
export async function batchSendNotifications(
  notificationType: NotificationType,
  recipients: Array<{ customerId: string; email: string; data: Record<string, any> }>,
  channel: NotificationChannel = NotificationChannel.EMAIL,
): Promise<NotificationDeliveryResult[]> {
  const results: NotificationDeliveryResult[] = [];
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
    } as any);
  }

  return results;
}

/**
 * 34. Get notification analytics
 * Retrieves analytics for notification performance
 */
export async function getNotificationAnalytics(
  filters: {
    orderId?: string;
    customerId?: string;
    notificationType?: NotificationType;
    channel?: NotificationChannel;
    startDate?: Date;
    endDate?: Date;
  },
): Promise<{
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
}> {
  const whereClause: any = {};

  if (filters.orderId) whereClause.orderId = filters.orderId;
  if (filters.customerId) whereClause.customerId = filters.customerId;
  if (filters.notificationType) whereClause.notificationType = filters.notificationType;
  if (filters.channel) whereClause.channel = filters.channel;
  if (filters.startDate || filters.endDate) {
    whereClause.createdAt = {};
    if (filters.startDate) whereClause.createdAt.$gte = filters.startDate;
    if (filters.endDate) whereClause.createdAt.$lte = filters.endDate;
  }

  const notifications = await OrderNotification.findAll({ where: whereClause });

  const total = notifications.length;
  const sent = notifications.filter(n => n.sentAt !== null).length;
  const delivered = notifications.filter(n => n.deliveredAt !== null).length;
  const opened = notifications.filter(n => n.openedAt !== null).length;
  const clicked = notifications.filter(n => n.clickedAt !== null).length;
  const failed = notifications.filter(n => n.status === DeliveryStatus.FAILED).length;

  const byChannel: any = {};
  const byType: any = {};

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
export function validateNotificationConfiguration(
  config: OrderNotificationConfig,
  customerPreferences: CustomerNotificationPreferences,
): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if notification type is disabled
  if (customerPreferences.disabledTypes.includes(config.notificationType)) {
    errors.push(`Customer has disabled ${config.notificationType} notifications`);
  }

  // Check quiet hours
  if (customerPreferences.quietHoursStart && customerPreferences.quietHoursEnd) {
    const now = new Date();
    const isQuietHours = isWithinQuietHours(
      now,
      customerPreferences.quietHoursStart,
      customerPreferences.quietHoursEnd,
      customerPreferences.timezone,
    );

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

function filterEnabledChannels(
  requestedChannels: NotificationChannel[],
  preferences: CustomerNotificationPreferences,
): NotificationChannel[] {
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

function getRecipientForChannel(channel: NotificationChannel, customer: any): string {
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

async function deliverNotification(
  channel: NotificationChannel,
  data: any,
): Promise<NotificationDeliveryResult> {
  // Placeholder implementation - integrate with actual delivery services
  return {
    notificationId: generateNotificationId(),
    channel,
    status: DeliveryStatus.SENT,
    deliveredAt: new Date(),
  };
}

async function logNotification(
  config: OrderNotificationConfig,
  channel: NotificationChannel,
  result: NotificationDeliveryResult,
): Promise<void> {
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
  } as any);
}

function generateNotificationId(): string {
  return `not_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateTrackingUrl(carrier: string, trackingNumber: string): string {
  const carriers: Record<string, string> = {
    UPS: `https://www.ups.com/track?tracknum=${trackingNumber}`,
    FEDEX: `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNumber}`,
    USPS: `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
    DHL: `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`,
  };

  return carriers[carrier.toUpperCase()] || `#tracking-${trackingNumber}`;
}

function calculateDelayDays(originalDate: Date, newDate: Date): number {
  const diffTime = Math.abs(newDate.getTime() - originalDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function isWithinQuietHours(
  timestamp: Date,
  quietStart: string,
  quietEnd: string,
  timezone?: string,
): boolean {
  // Simplified implementation
  const hour = timestamp.getHours();
  const startHour = parseInt(quietStart.split(':')[0]);
  const endHour = parseInt(quietEnd.split(':')[0]);

  if (startHour < endHour) {
    return hour >= startHour && hour < endHour;
  } else {
    return hour >= startHour || hour < endHour;
  }
}

function renderHandlebarsTemplate(template: string, data: Record<string, any>): string {
  // Placeholder - integrate with Handlebars
  return replaceVariables(template, data);
}

function renderMustacheTemplate(template: string, data: Record<string, any>): string {
  // Placeholder - integrate with Mustache
  return replaceVariables(template, data);
}

function renderEJSTemplate(template: string, data: Record<string, any>): string {
  // Placeholder - integrate with EJS
  return replaceVariables(template, data);
}

function replaceVariables(template: string, data: Record<string, any>): string {
  let result = template;
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, String(data[key]));
  });
  return result;
}

function getAuthenticationHeaders(auth: WebhookAuth): Record<string, string> {
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

async function getEmailTransporter(): Promise<any> {
  // Placeholder - return configured email transporter
  return null;
}

async function getTwilioClient(): Promise<any> {
  // Placeholder - return configured Twilio client
  return null;
}

async function getFCMClient(): Promise<any> {
  // Placeholder - return configured FCM client
  return null;
}

async function storeInAppNotification(data: any): Promise<void> {
  // Placeholder - store in database
}

async function emitRealtimeNotification(userId: string, data: any): Promise<void> {
  // Placeholder - emit via WebSocket/Socket.io
}

async function queueScheduledNotification(notificationId: string, scheduledAt: Date): Promise<void> {
  // Placeholder - queue in job scheduler (Bull, etc.)
}

async function removeFromNotificationQueue(notificationId: string): Promise<void> {
  // Placeholder - remove from job queue
}

async function getRemainingOrderItems(orderId: string, cancelledItems: any[]): Promise<any[]> {
  // Placeholder - fetch remaining items
  return [];
}
