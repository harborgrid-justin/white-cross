/**
 * Notification Validation Schemas
 *
 * Zod schemas for in-app notifications and preferences
 */

import { z } from 'zod';

/**
 * Notification type
 */
export const NotificationTypeSchema = z.enum([
  'message',
  'broadcast',
  'appointment',
  'medication',
  'incident',
  'health_alert',
  'system',
  'reminder',
  'mention',
  'reply'
]);
export type NotificationType = z.infer<typeof NotificationTypeSchema>;

/**
 * Notification priority
 */
export const NotificationPrioritySchema = z.enum(['low', 'normal', 'high', 'urgent']);
export type NotificationPriority = z.infer<typeof NotificationPrioritySchema>;

/**
 * Notification status
 */
export const NotificationStatusSchema = z.enum(['unread', 'read', 'archived', 'deleted']);
export type NotificationStatus = z.infer<typeof NotificationStatusSchema>;

/**
 * Notification action schema
 */
export const NotificationActionSchema = z.object({
  label: z.string().min(1).max(50),
  url: z.string().url().optional(),
  action: z.string().optional(),
  primary: z.boolean().default(false)
});
export type NotificationAction = z.infer<typeof NotificationActionSchema>;

/**
 * Notification metadata schema
 */
export const NotificationMetadataSchema = z.object({
  entityId: z.string().uuid().optional(),
  entityType: z.string().optional(),
  senderId: z.string().uuid().optional(),
  senderName: z.string().optional(),
  senderAvatarUrl: z.string().url().optional(),
  additionalData: z.record(z.string(), z.unknown()).optional()
});
export type NotificationMetadata = z.infer<typeof NotificationMetadataSchema>;

/**
 * Create notification schema
 */
export const CreateNotificationSchema = z.object({
  userId: z.string().uuid(),
  type: NotificationTypeSchema,
  priority: NotificationPrioritySchema.default('normal'),
  title: z.string().min(1).max(255),
  message: z.string().min(1).max(1000),
  icon: z.string().optional(),
  imageUrl: z.string().url().optional(),
  actions: z.array(NotificationActionSchema).max(3).default([]),
  metadata: NotificationMetadataSchema.optional(),
  expiresAt: z.date().optional(),
  groupKey: z.string().max(100).optional() // For grouping related notifications
});
export type CreateNotificationInput = z.infer<typeof CreateNotificationSchema>;

/**
 * Notification response schema
 */
export const NotificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: NotificationTypeSchema,
  priority: NotificationPrioritySchema,
  status: NotificationStatusSchema,
  title: z.string(),
  message: z.string(),
  icon: z.string().optional(),
  imageUrl: z.string().url().optional(),
  actions: z.array(NotificationActionSchema),
  metadata: NotificationMetadataSchema.optional(),
  groupKey: z.string().optional(),
  readAt: z.date().optional(),
  archivedAt: z.date().optional(),
  expiresAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});
export type Notification = z.infer<typeof NotificationSchema>;

/**
 * Grouped notification schema
 */
export const GroupedNotificationSchema = z.object({
  groupKey: z.string(),
  type: NotificationTypeSchema,
  count: z.number().int().positive(),
  latestNotification: NotificationSchema,
  notifications: z.array(NotificationSchema),
  hasUnread: z.boolean(),
  unreadCount: z.number().int().nonnegative()
});
export type GroupedNotification = z.infer<typeof GroupedNotificationSchema>;

/**
 * Notification filter schema
 */
export const NotificationFilterSchema = z.object({
  status: NotificationStatusSchema.optional(),
  type: NotificationTypeSchema.optional(),
  priority: NotificationPrioritySchema.optional(),
  unreadOnly: z.boolean().optional(),
  groupKey: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  limit: z.number().int().positive().max(100).default(50),
  offset: z.number().int().nonnegative().default(0),
  sortBy: z.enum(['createdAt', 'priority', 'type']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  grouped: z.boolean().default(false)
});
export type NotificationFilter = z.infer<typeof NotificationFilterSchema>;

/**
 * Mark notification as read schema
 */
export const MarkNotificationAsReadSchema = z.object({
  notificationIds: z.array(z.string().uuid()).min(1).max(100)
});
export type MarkNotificationAsReadInput = z.infer<typeof MarkNotificationAsReadSchema>;

/**
 * Mark all as read schema
 */
export const MarkAllAsReadSchema = z.object({
  type: NotificationTypeSchema.optional(),
  olderThan: z.date().optional()
});
export type MarkAllAsReadInput = z.infer<typeof MarkAllAsReadSchema>;

/**
 * Archive notification schema
 */
export const ArchiveNotificationSchema = z.object({
  notificationIds: z.array(z.string().uuid()).min(1).max(100)
});
export type ArchiveNotificationInput = z.infer<typeof ArchiveNotificationSchema>;

/**
 * Delete notification schema
 */
export const DeleteNotificationSchema = z.object({
  notificationIds: z.array(z.string().uuid()).min(1).max(100)
});
export type DeleteNotificationInput = z.infer<typeof DeleteNotificationSchema>;

/**
 * Notification preferences schema
 */
export const NotificationPreferencesSchema = z.object({
  userId: z.string().uuid(),
  enabled: z.boolean().default(true),
  channels: z.object({
    inApp: z.boolean().default(true),
    email: z.boolean().default(true),
    sms: z.boolean().default(false),
    push: z.boolean().default(false)
  }),
  typePreferences: z.object({
    message: z.object({
      enabled: z.boolean().default(true),
      channels: z.object({
        inApp: z.boolean().default(true),
        email: z.boolean().default(false),
        sms: z.boolean().default(false),
        push: z.boolean().default(false)
      })
    }),
    broadcast: z.object({
      enabled: z.boolean().default(true),
      channels: z.object({
        inApp: z.boolean().default(true),
        email: z.boolean().default(true),
        sms: z.boolean().default(false),
        push: z.boolean().default(false)
      })
    }),
    appointment: z.object({
      enabled: z.boolean().default(true),
      channels: z.object({
        inApp: z.boolean().default(true),
        email: z.boolean().default(true),
        sms: z.boolean().default(false),
        push: z.boolean().default(false)
      }),
      reminderMinutes: z.number().int().positive().default(60) // 1 hour before
    }),
    medication: z.object({
      enabled: z.boolean().default(true),
      channels: z.object({
        inApp: z.boolean().default(true),
        email: z.boolean().default(false),
        sms: z.boolean().default(false),
        push: z.boolean().default(false)
      })
    }),
    incident: z.object({
      enabled: z.boolean().default(true),
      channels: z.object({
        inApp: z.boolean().default(true),
        email: z.boolean().default(true),
        sms: z.boolean().default(false),
        push: z.boolean().default(false)
      })
    }),
    health_alert: z.object({
      enabled: z.boolean().default(true),
      channels: z.object({
        inApp: z.boolean().default(true),
        email: z.boolean().default(true),
        sms: z.boolean().default(true),
        push: z.boolean().default(true)
      })
    }),
    system: z.object({
      enabled: z.boolean().default(true),
      channels: z.object({
        inApp: z.boolean().default(true),
        email: z.boolean().default(false),
        sms: z.boolean().default(false),
        push: z.boolean().default(false)
      })
    }),
    reminder: z.object({
      enabled: z.boolean().default(true),
      channels: z.object({
        inApp: z.boolean().default(true),
        email: z.boolean().default(true),
        sms: z.boolean().default(false),
        push: z.boolean().default(false)
      })
    }),
    mention: z.object({
      enabled: z.boolean().default(true),
      channels: z.object({
        inApp: z.boolean().default(true),
        email: z.boolean().default(true),
        sms: z.boolean().default(false),
        push: z.boolean().default(false)
      })
    }),
    reply: z.object({
      enabled: z.boolean().default(true),
      channels: z.object({
        inApp: z.boolean().default(true),
        email: z.boolean().default(false),
        sms: z.boolean().default(false),
        push: z.boolean().default(false)
      })
    })
  }),
  quietHours: z.object({
    enabled: z.boolean().default(false),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(), // HH:MM format
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    timezone: z.string().optional()
  }).optional(),
  digest: z.object({
    enabled: z.boolean().default(false),
    frequency: z.enum(['daily', 'weekly']).default('daily'),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).default('09:00') // HH:MM format
  }).optional()
});
export type NotificationPreferences = z.infer<typeof NotificationPreferencesSchema>;

/**
 * Update notification preferences schema
 */
export const UpdateNotificationPreferencesSchema = NotificationPreferencesSchema.partial().required({ userId: true });
export type UpdateNotificationPreferencesInput = z.infer<typeof UpdateNotificationPreferencesSchema>;

/**
 * Notification count schema
 */
export const NotificationCountSchema = z.object({
  total: z.number().int().nonnegative(),
  unread: z.number().int().nonnegative(),
  byType: z.record(NotificationTypeSchema, z.number().int().nonnegative())
});
export type NotificationCount = z.infer<typeof NotificationCountSchema>;
