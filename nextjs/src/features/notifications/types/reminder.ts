import { z } from 'zod';
import { NotificationPriority, DeliveryChannel } from './notification';

/**
 * Reminder Frequency Options
 */
export enum ReminderFrequency {
  ONCE = 'once',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom',
}

/**
 * Reminder Status
 */
export enum ReminderStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

/**
 * Reminder Type
 */
export enum ReminderType {
  MEDICATION = 'medication',
  APPOINTMENT = 'appointment',
  IMMUNIZATION = 'immunization',
  FOLLOW_UP = 'follow_up',
  DOCUMENT = 'document',
  CUSTOM = 'custom',
}

/**
 * Days of the Week
 */
export enum DayOfWeek {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

/**
 * Recurrence Pattern for Custom Frequency
 */
export interface RecurrencePattern {
  frequency: ReminderFrequency;
  interval: number; // e.g., every 2 days, every 3 weeks
  daysOfWeek?: DayOfWeek[]; // For weekly recurrence
  dayOfMonth?: number; // For monthly recurrence (1-31)
  endDate?: Date;
  occurrences?: number; // Maximum number of occurrences
}

/**
 * Reminder Escalation Rule
 */
export interface EscalationRule {
  enabled: boolean;
  delayMinutes: number; // Time after initial reminder to escalate
  maxLevel: number; // Maximum escalation level (1-5)
  channels: DeliveryChannel[]; // Additional channels to use
  notifyUsers?: string[]; // Additional users to notify
}

/**
 * Core Reminder Interface
 */
export interface Reminder {
  id: string;
  type: ReminderType;
  status: ReminderStatus;
  priority: NotificationPriority;

  // Content
  title: string;
  message: string;

  // User
  userId: string;
  createdBy: string;

  // Timing
  scheduledAt: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;

  // Recurrence
  recurrence?: RecurrencePattern;
  nextOccurrence?: Date;
  lastTriggeredAt?: Date;

  // Delivery
  channels: DeliveryChannel[];

  // Related entity
  relatedEntityType?: string;
  relatedEntityId?: string;

  // Escalation
  escalation?: EscalationRule;
  escalationLevel?: number;

  // Snooze
  snoozedUntil?: Date;

  // Metadata
  metadata?: Record<string, any>;
}

/**
 * Reminder Instance (generated from recurring reminder)
 */
export interface ReminderInstance {
  id: string;
  reminderId: string;
  reminder: Reminder;
  scheduledAt: Date;
  triggeredAt?: Date;
  acknowledgedAt?: Date;
  snoozedUntil?: Date;
  notificationId?: string;
}

/**
 * Reminder Filters
 */
export interface ReminderFilters {
  types?: ReminderType[];
  statuses?: ReminderStatus[];
  priorities?: NotificationPriority[];
  startDate?: Date;
  endDate?: Date;
  relatedEntityType?: string;
  relatedEntityId?: string;
  userId?: string;
  search?: string;
}

/**
 * Reminder Statistics
 */
export interface ReminderStats {
  total: number;
  active: number;
  completed: number;
  upcoming: number;
  overdue: number;
  byType: Record<ReminderType, number>;
  byPriority: Record<NotificationPriority, number>;
}

/**
 * Zod Schemas for Validation
 */

export const RecurrencePatternSchema = z.object({
  frequency: z.nativeEnum(ReminderFrequency),
  interval: z.number().min(1).max(365),
  daysOfWeek: z.array(z.nativeEnum(DayOfWeek)).optional(),
  dayOfMonth: z.number().min(1).max(31).optional(),
  endDate: z.date().optional(),
  occurrences: z.number().min(1).max(1000).optional(),
});

export const EscalationRuleSchema = z.object({
  enabled: z.boolean(),
  delayMinutes: z.number().min(1).max(1440),
  maxLevel: z.number().min(1).max(5),
  channels: z.array(z.nativeEnum(DeliveryChannel)),
  notifyUsers: z.array(z.string()).optional(),
});

export const ReminderSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(ReminderType),
  status: z.nativeEnum(ReminderStatus),
  priority: z.nativeEnum(NotificationPriority),

  title: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),

  userId: z.string(),
  createdBy: z.string(),

  scheduledAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  completedAt: z.date().optional(),

  recurrence: RecurrencePatternSchema.optional(),
  nextOccurrence: z.date().optional(),
  lastTriggeredAt: z.date().optional(),

  channels: z.array(z.nativeEnum(DeliveryChannel)),

  relatedEntityType: z.string().optional(),
  relatedEntityId: z.string().optional(),

  escalation: EscalationRuleSchema.optional(),
  escalationLevel: z.number().min(0).max(5).optional(),

  snoozedUntil: z.date().optional(),

  metadata: z.record(z.any()).optional(),
});

export const CreateReminderSchema = z.object({
  type: z.nativeEnum(ReminderType),
  priority: z.nativeEnum(NotificationPriority),
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),
  userId: z.string(),
  scheduledAt: z.date(),
  recurrence: RecurrencePatternSchema.optional(),
  channels: z.array(z.nativeEnum(DeliveryChannel)),
  relatedEntityType: z.string().optional(),
  relatedEntityId: z.string().optional(),
  escalation: EscalationRuleSchema.optional(),
  metadata: z.record(z.any()).optional(),
});

export const UpdateReminderSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  message: z.string().min(1).max(1000).optional(),
  priority: z.nativeEnum(NotificationPriority).optional(),
  scheduledAt: z.date().optional(),
  recurrence: RecurrencePatternSchema.optional(),
  channels: z.array(z.nativeEnum(DeliveryChannel)).optional(),
  status: z.nativeEnum(ReminderStatus).optional(),
  escalation: EscalationRuleSchema.optional(),
  snoozedUntil: z.date().optional(),
  metadata: z.record(z.any()).optional(),
});

export const ReminderFiltersSchema = z.object({
  types: z.array(z.nativeEnum(ReminderType)).optional(),
  statuses: z.array(z.nativeEnum(ReminderStatus)).optional(),
  priorities: z.array(z.nativeEnum(NotificationPriority)).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  relatedEntityType: z.string().optional(),
  relatedEntityId: z.string().optional(),
  userId: z.string().optional(),
  search: z.string().optional(),
});

export type CreateReminderInput = z.infer<typeof CreateReminderSchema>;
export type UpdateReminderInput = z.infer<typeof UpdateReminderSchema>;
