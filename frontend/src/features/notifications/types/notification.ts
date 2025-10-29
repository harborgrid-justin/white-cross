import { z } from 'zod';

/**
 * Notification Priority Levels
 */
export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
  EMERGENCY = 'emergency',
}

/**
 * Notification Types for Healthcare
 */
export enum NotificationType {
  // Medication notifications
  MEDICATION_REMINDER = 'medication_reminder',
  MEDICATION_DUE = 'medication_due',
  MEDICATION_OVERDUE = 'medication_overdue',
  MEDICATION_INTERACTION = 'medication_interaction',

  // Appointment notifications
  APPOINTMENT_REMINDER = 'appointment_reminder',
  APPOINTMENT_CONFIRMED = 'appointment_confirmed',
  APPOINTMENT_CANCELLED = 'appointment_cancelled',
  APPOINTMENT_RESCHEDULED = 'appointment_rescheduled',

  // Immunization notifications
  IMMUNIZATION_DUE = 'immunization_due',
  IMMUNIZATION_OVERDUE = 'immunization_overdue',
  IMMUNIZATION_COMPLETED = 'immunization_completed',

  // Incident notifications
  INCIDENT_CREATED = 'incident_created',
  INCIDENT_FOLLOW_UP = 'incident_follow_up',
  INCIDENT_RESOLVED = 'incident_resolved',

  // Document notifications
  DOCUMENT_EXPIRING = 'document_expiring',
  DOCUMENT_EXPIRED = 'document_expired',
  DOCUMENT_UPLOADED = 'document_uploaded',
  DOCUMENT_SIGNED = 'document_signed',

  // Compliance notifications
  COMPLIANCE_ALERT = 'compliance_alert',
  COMPLIANCE_DEADLINE = 'compliance_deadline',
  AUDIT_REQUIRED = 'audit_required',

  // System notifications
  SYSTEM_UPDATE = 'system_update',
  SYSTEM_MAINTENANCE = 'system_maintenance',
  SYSTEM_ERROR = 'system_error',

  // Emergency notifications
  EMERGENCY_ALERT = 'emergency_alert',
  EMERGENCY_BROADCAST = 'emergency_broadcast',

  // General notifications
  GENERAL_INFO = 'general_info',
  TASK_ASSIGNED = 'task_assigned',
  MESSAGE_RECEIVED = 'message_received',
}

/**
 * Notification Status
 */
export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
  SNOOZED = 'snoozed',
  ARCHIVED = 'archived',
}

/**
 * Delivery Channel Types
 */
export enum DeliveryChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  VOICE = 'voice',
}

/**
 * Notification Action Type
 */
export interface NotificationAction {
  id: string;
  label: string;
  action: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

/**
 * Core Notification Interface
 */
export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;

  // Content
  title: string;
  message: string;
  summary?: string;

  // Metadata
  userId: string;
  createdAt: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  snoozedUntil?: Date;

  // Related entities
  relatedEntityType?: string;
  relatedEntityId?: string;

  // Actions
  actions?: NotificationAction[];

  // Delivery
  channels: DeliveryChannel[];
  deliveryStatus: Record<DeliveryChannel, NotificationStatus>;

  // Grouping
  groupKey?: string;

  // Metadata
  metadata?: Record<string, any>;

  // Escalation
  escalationLevel?: number;
  escalatedAt?: Date;
}

/**
 * Notification Group for organizing related notifications
 */
export interface NotificationGroup {
  key: string;
  type: NotificationType;
  count: number;
  notifications: Notification[];
  latestTimestamp: Date;
  summary: string;
}

/**
 * Notification Filters
 */
export interface NotificationFilters {
  types?: NotificationType[];
  priorities?: NotificationPriority[];
  statuses?: NotificationStatus[];
  channels?: DeliveryChannel[];
  startDate?: Date;
  endDate?: Date;
  relatedEntityType?: string;
  relatedEntityId?: string;
  search?: string;
}

/**
 * Notification Statistics
 */
export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
  byStatus: Record<NotificationStatus, number>;
  byChannel: Record<DeliveryChannel, number>;
}

/**
 * Zod Schemas for Validation
 */

export const NotificationActionSchema = z.object({
  id: z.string(),
  label: z.string(),
  action: z.string(),
  icon: z.string().optional(),
  variant: z.enum(['primary', 'secondary', 'danger']).optional(),
});

export const NotificationSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(NotificationType),
  priority: z.nativeEnum(NotificationPriority),
  status: z.nativeEnum(NotificationStatus),

  title: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),
  summary: z.string().max(500).optional(),

  userId: z.string(),
  createdAt: z.date(),
  sentAt: z.date().optional(),
  deliveredAt: z.date().optional(),
  readAt: z.date().optional(),
  snoozedUntil: z.date().optional(),

  relatedEntityType: z.string().optional(),
  relatedEntityId: z.string().optional(),

  actions: z.array(NotificationActionSchema).optional(),

  channels: z.array(z.nativeEnum(DeliveryChannel)),
  deliveryStatus: z.record(z.nativeEnum(DeliveryChannel), z.nativeEnum(NotificationStatus)),

  groupKey: z.string().optional(),

  metadata: z.record(z.any()).optional(),

  escalationLevel: z.number().min(0).max(5).optional(),
  escalatedAt: z.date().optional(),
});

export const NotificationFiltersSchema = z.object({
  types: z.array(z.nativeEnum(NotificationType)).optional(),
  priorities: z.array(z.nativeEnum(NotificationPriority)).optional(),
  statuses: z.array(z.nativeEnum(NotificationStatus)).optional(),
  channels: z.array(z.nativeEnum(DeliveryChannel)).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  relatedEntityType: z.string().optional(),
  relatedEntityId: z.string().optional(),
  search: z.string().optional(),
});

export const CreateNotificationSchema = z.object({
  type: z.nativeEnum(NotificationType),
  priority: z.nativeEnum(NotificationPriority),
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),
  summary: z.string().max(500).optional(),
  userId: z.string(),
  relatedEntityType: z.string().optional(),
  relatedEntityId: z.string().optional(),
  actions: z.array(NotificationActionSchema).optional(),
  channels: z.array(z.nativeEnum(DeliveryChannel)),
  groupKey: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type CreateNotificationInput = z.infer<typeof CreateNotificationSchema>;
