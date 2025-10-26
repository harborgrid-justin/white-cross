import { z } from 'zod';
import { DeliveryChannel, NotificationType, NotificationPriority } from './notification';

/**
 * Quiet Hours Configuration
 */
export interface QuietHours {
  enabled: boolean;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
  allowEmergency: boolean; // Allow emergency notifications during quiet hours
}

/**
 * Channel Preferences for a specific notification type
 */
export interface ChannelPreferences {
  enabled: boolean;
  channels: DeliveryChannel[];
  minPriority?: NotificationPriority; // Minimum priority to send via this channel
}

/**
 * Notification Type Preferences
 */
export interface NotificationTypePreferences {
  type: NotificationType;
  enabled: boolean;
  channels: ChannelPreferences;
  groupingEnabled: boolean;
  soundEnabled: boolean;
  customSound?: string;
}

/**
 * Global Notification Preferences
 */
export interface NotificationPreferences {
  id: string;
  userId: string;

  // Global settings
  enabled: boolean;
  quietHours: QuietHours;
  defaultChannels: DeliveryChannel[];

  // Grouping
  groupingEnabled: boolean;
  groupingDelayMinutes: number; // Delay before grouping notifications

  // Sound settings
  soundEnabled: boolean;
  soundVolume: number; // 0-100
  defaultSound: string;

  // Type-specific preferences
  typePreferences: Record<NotificationType, NotificationTypePreferences>;

  // Digest settings
  emailDigest: {
    enabled: boolean;
    frequency: 'daily' | 'weekly';
    time: string; // HH:mm format
    dayOfWeek?: number; // For weekly digest
  };

  // Desktop notifications
  desktopNotifications: {
    enabled: boolean;
    showPreview: boolean;
    requireInteraction: boolean;
  };

  // Mobile push notifications
  pushNotifications: {
    enabled: boolean;
    showPreview: boolean;
    badge: boolean;
  };

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Default Preferences Factory
 */
export const createDefaultPreferences = (userId: string): NotificationPreferences => {
  const defaultTypePreferences: Record<NotificationType, NotificationTypePreferences> = {} as any;

  // Set defaults for each notification type
  Object.values(NotificationType).forEach((type) => {
    const isEmergency = type === NotificationType.EMERGENCY_ALERT ||
                        type === NotificationType.EMERGENCY_BROADCAST;

    defaultTypePreferences[type] = {
      type,
      enabled: true,
      channels: {
        enabled: true,
        channels: isEmergency
          ? [DeliveryChannel.IN_APP, DeliveryChannel.EMAIL, DeliveryChannel.SMS, DeliveryChannel.PUSH]
          : [DeliveryChannel.IN_APP, DeliveryChannel.EMAIL],
        minPriority: isEmergency ? NotificationPriority.URGENT : NotificationPriority.MEDIUM,
      },
      groupingEnabled: !isEmergency,
      soundEnabled: isEmergency,
      customSound: undefined,
    };
  });

  return {
    id: `pref-${userId}`,
    userId,
    enabled: true,
    quietHours: {
      enabled: false,
      startTime: '22:00',
      endTime: '07:00',
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      allowEmergency: true,
    },
    defaultChannels: [DeliveryChannel.IN_APP, DeliveryChannel.EMAIL],
    groupingEnabled: true,
    groupingDelayMinutes: 5,
    soundEnabled: true,
    soundVolume: 70,
    defaultSound: 'default',
    typePreferences: defaultTypePreferences,
    emailDigest: {
      enabled: false,
      frequency: 'daily',
      time: '08:00',
    },
    desktopNotifications: {
      enabled: true,
      showPreview: true,
      requireInteraction: false,
    },
    pushNotifications: {
      enabled: true,
      showPreview: true,
      badge: true,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Zod Schemas for Validation
 */

export const QuietHoursSchema = z.object({
  enabled: z.boolean(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  daysOfWeek: z.array(z.number().min(0).max(6)),
  allowEmergency: z.boolean(),
});

export const ChannelPreferencesSchema = z.object({
  enabled: z.boolean(),
  channels: z.array(z.nativeEnum(DeliveryChannel)),
  minPriority: z.nativeEnum(NotificationPriority).optional(),
});

export const NotificationTypePreferencesSchema = z.object({
  type: z.nativeEnum(NotificationType),
  enabled: z.boolean(),
  channels: ChannelPreferencesSchema,
  groupingEnabled: z.boolean(),
  soundEnabled: z.boolean(),
  customSound: z.string().optional(),
});

export const NotificationPreferencesSchema = z.object({
  id: z.string(),
  userId: z.string(),

  enabled: z.boolean(),
  quietHours: QuietHoursSchema,
  defaultChannels: z.array(z.nativeEnum(DeliveryChannel)),

  groupingEnabled: z.boolean(),
  groupingDelayMinutes: z.number().min(0).max(60),

  soundEnabled: z.boolean(),
  soundVolume: z.number().min(0).max(100),
  defaultSound: z.string(),

  typePreferences: z.record(z.nativeEnum(NotificationType), NotificationTypePreferencesSchema),

  emailDigest: z.object({
    enabled: z.boolean(),
    frequency: z.enum(['daily', 'weekly']),
    time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
    dayOfWeek: z.number().min(0).max(6).optional(),
  }),

  desktopNotifications: z.object({
    enabled: z.boolean(),
    showPreview: z.boolean(),
    requireInteraction: z.boolean(),
  }),

  pushNotifications: z.object({
    enabled: z.boolean(),
    showPreview: z.boolean(),
    badge: z.boolean(),
  }),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UpdatePreferencesSchema = z.object({
  enabled: z.boolean().optional(),
  quietHours: QuietHoursSchema.optional(),
  defaultChannels: z.array(z.nativeEnum(DeliveryChannel)).optional(),
  groupingEnabled: z.boolean().optional(),
  groupingDelayMinutes: z.number().min(0).max(60).optional(),
  soundEnabled: z.boolean().optional(),
  soundVolume: z.number().min(0).max(100).optional(),
  defaultSound: z.string().optional(),
  typePreferences: z.record(z.nativeEnum(NotificationType), NotificationTypePreferencesSchema).optional(),
  emailDigest: z.object({
    enabled: z.boolean(),
    frequency: z.enum(['daily', 'weekly']),
    time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
    dayOfWeek: z.number().min(0).max(6).optional(),
  }).optional(),
  desktopNotifications: z.object({
    enabled: z.boolean(),
    showPreview: z.boolean(),
    requireInteraction: z.boolean(),
  }).optional(),
  pushNotifications: z.object({
    enabled: z.boolean(),
    showPreview: z.boolean(),
    badge: z.boolean(),
  }).optional(),
});

export type UpdatePreferencesInput = z.infer<typeof UpdatePreferencesSchema>;
