/**
 * Broadcast Validation Schemas
 *
 * Zod schemas for broadcast announcements with targeting and scheduling
 */

import { z } from 'zod';
import { AttachmentSchema } from './message.schemas';

/**
 * Broadcast priority levels
 */
export const BroadcastPrioritySchema = z.enum(['low', 'normal', 'high', 'urgent', 'emergency']);
export type BroadcastPriority = z.infer<typeof BroadcastPrioritySchema>;

/**
 * Broadcast status
 */
export const BroadcastStatusSchema = z.enum([
  'draft',
  'scheduled',
  'sending',
  'sent',
  'cancelled',
  'failed'
]);
export type BroadcastStatus = z.infer<typeof BroadcastStatusSchema>;

/**
 * Broadcast category
 */
export const BroadcastCategorySchema = z.enum([
  'announcement',
  'alert',
  'emergency',
  'health',
  'policy',
  'event',
  'reminder',
  'other'
]);
export type BroadcastCategory = z.infer<typeof BroadcastCategorySchema>;

/**
 * Audience targeting types
 */
export const AudienceTypeSchema = z.enum([
  'all',
  'roles',
  'schools',
  'grades',
  'students',
  'guardians',
  'staff',
  'custom'
]);
export type AudienceType = z.infer<typeof AudienceTypeSchema>;

/**
 * Audience filter schema
 */
export const AudienceFilterSchema = z.object({
  type: AudienceTypeSchema,
  roleIds: z.array(z.string().uuid()).optional(),
  schoolIds: z.array(z.string().uuid()).optional(),
  gradeIds: z.array(z.string().uuid()).optional(),
  studentIds: z.array(z.string().uuid()).optional(),
  guardianIds: z.array(z.string().uuid()).optional(),
  staffIds: z.array(z.string().uuid()).optional(),
  customUserIds: z.array(z.string().uuid()).optional(),
  includeInactive: z.boolean().default(false),
  estimatedRecipients: z.number().int().nonnegative().optional()
}).refine(
  (data) => {
    // Validate that appropriate IDs are provided based on type
    if (data.type === 'roles' && (!data.roleIds || data.roleIds.length === 0)) {
      return false;
    }
    if (data.type === 'schools' && (!data.schoolIds || data.schoolIds.length === 0)) {
      return false;
    }
    if (data.type === 'grades' && (!data.gradeIds || data.gradeIds.length === 0)) {
      return false;
    }
    if (data.type === 'students' && (!data.studentIds || data.studentIds.length === 0)) {
      return false;
    }
    if (data.type === 'guardians' && (!data.guardianIds || data.guardianIds.length === 0)) {
      return false;
    }
    if (data.type === 'staff' && (!data.staffIds || data.staffIds.length === 0)) {
      return false;
    }
    if (data.type === 'custom' && (!data.customUserIds || data.customUserIds.length === 0)) {
      return false;
    }
    return true;
  },
  {
    message: 'Appropriate IDs must be provided for the selected audience type'
  }
);
export type AudienceFilter = z.infer<typeof AudienceFilterSchema>;

/**
 * Delivery channel schema
 */
export const DeliveryChannelSchema = z.object({
  inApp: z.boolean().default(true),
  email: z.boolean().default(false),
  sms: z.boolean().default(false),
  push: z.boolean().default(false)
}).refine(
  (data) => data.inApp || data.email || data.sms || data.push,
  {
    message: 'At least one delivery channel must be selected'
  }
);
export type DeliveryChannel = z.infer<typeof DeliveryChannelSchema>;

/**
 * Create broadcast schema
 */
export const CreateBroadcastSchema = z.object({
  title: z.string().min(1).max(255),
  message: z.string().min(1).max(10000),
  category: BroadcastCategorySchema,
  priority: BroadcastPrioritySchema.default('normal'),
  audience: AudienceFilterSchema,
  channels: DeliveryChannelSchema,
  attachments: z.array(AttachmentSchema).max(3).default([]),
  scheduled: z.boolean().default(false),
  sendAt: z.date().optional(),
  expiresAt: z.date().optional(),
  requireAcknowledgment: z.boolean().default(false),
  allowReplies: z.boolean().default(false),
  containsPhi: z.boolean().default(false),
  templateId: z.string().uuid().optional()
}).refine(
  (data) => {
    // If scheduled, sendAt must be provided and in the future
    if (data.scheduled) {
      return data.sendAt && data.sendAt > new Date();
    }
    return true;
  },
  {
    message: 'Scheduled broadcasts must have a future sendAt date',
    path: ['sendAt']
  }
).refine(
  (data) => {
    // Emergency broadcasts cannot be scheduled
    if (data.priority === 'emergency') {
      return !data.scheduled;
    }
    return true;
  },
  {
    message: 'Emergency broadcasts cannot be scheduled',
    path: ['scheduled']
  }
).refine(
  (data) => {
    // If expiresAt is provided, it must be after sendAt or now
    if (data.expiresAt) {
      const compareDate = data.sendAt || new Date();
      return data.expiresAt > compareDate;
    }
    return true;
  },
  {
    message: 'Expiration date must be after send date',
    path: ['expiresAt']
  }
);
export type CreateBroadcastInput = z.infer<typeof CreateBroadcastSchema>;

/**
 * Update broadcast schema (draft only)
 */
export const UpdateBroadcastSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(255).optional(),
  message: z.string().min(1).max(10000).optional(),
  category: BroadcastCategorySchema.optional(),
  priority: BroadcastPrioritySchema.optional(),
  audience: AudienceFilterSchema.optional(),
  channels: DeliveryChannelSchema.optional(),
  attachments: z.array(AttachmentSchema).max(3).optional(),
  sendAt: z.date().optional(),
  expiresAt: z.date().optional(),
  requireAcknowledgment: z.boolean().optional(),
  allowReplies: z.boolean().optional(),
  containsPhi: z.boolean().optional()
});
export type UpdateBroadcastInput = z.infer<typeof UpdateBroadcastSchema>;

/**
 * Delivery statistics schema
 */
export const DeliveryStatsSchema = z.object({
  totalRecipients: z.number().int().nonnegative(),
  delivered: z.number().int().nonnegative(),
  failed: z.number().int().nonnegative(),
  pending: z.number().int().nonnegative(),
  read: z.number().int().nonnegative(),
  acknowledged: z.number().int().nonnegative(),
  deliveryRate: z.number().min(0).max(100),
  readRate: z.number().min(0).max(100),
  acknowledgmentRate: z.number().min(0).max(100),
  channelBreakdown: z.object({
    inApp: z.number().int().nonnegative().optional(),
    email: z.number().int().nonnegative().optional(),
    sms: z.number().int().nonnegative().optional(),
    push: z.number().int().nonnegative().optional()
  })
});
export type DeliveryStats = z.infer<typeof DeliveryStatsSchema>;

/**
 * Broadcast response schema
 */
export const BroadcastSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  message: z.string(),
  category: BroadcastCategorySchema,
  priority: BroadcastPrioritySchema,
  status: BroadcastStatusSchema,
  audience: AudienceFilterSchema,
  channels: DeliveryChannelSchema,
  attachments: z.array(AttachmentSchema),
  senderId: z.string().uuid(),
  senderName: z.string(),
  senderEmail: z.string().email(),
  requireAcknowledgment: z.boolean(),
  allowReplies: z.boolean(),
  containsPhi: z.boolean(),
  isEncrypted: z.boolean(),
  sentAt: z.date().optional(),
  scheduledFor: z.date().optional(),
  expiresAt: z.date().optional(),
  cancelledAt: z.date().optional(),
  stats: DeliveryStatsSchema.optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});
export type Broadcast = z.infer<typeof BroadcastSchema>;

/**
 * Broadcast filter schema
 */
export const BroadcastFilterSchema = z.object({
  status: BroadcastStatusSchema.optional(),
  category: BroadcastCategorySchema.optional(),
  priority: BroadcastPrioritySchema.optional(),
  senderId: z.string().uuid().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  search: z.string().max(255).optional(),
  limit: z.number().int().positive().max(100).default(50),
  offset: z.number().int().nonnegative().default(0),
  sortBy: z.enum(['createdAt', 'sentAt', 'priority', 'title']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});
export type BroadcastFilter = z.infer<typeof BroadcastFilterSchema>;

/**
 * Cancel broadcast schema
 */
export const CancelBroadcastSchema = z.object({
  id: z.string().uuid(),
  reason: z.string().min(1).max(500).optional()
});
export type CancelBroadcastInput = z.infer<typeof CancelBroadcastSchema>;

/**
 * Acknowledge broadcast schema
 */
export const AcknowledgeBroadcastSchema = z.object({
  broadcastId: z.string().uuid(),
  acknowledgedAt: z.date().default(() => new Date())
});
export type AcknowledgeBroadcastInput = z.infer<typeof AcknowledgeBroadcastSchema>;

/**
 * Broadcast recipient schema
 */
export const BroadcastRecipientSchema = z.object({
  id: z.string().uuid(),
  broadcastId: z.string().uuid(),
  userId: z.string().uuid(),
  userName: z.string(),
  userEmail: z.string().email(),
  deliveryStatus: z.enum(['pending', 'delivered', 'failed', 'bounced']),
  deliveredAt: z.date().optional(),
  readAt: z.date().optional(),
  acknowledgedAt: z.date().optional(),
  failureReason: z.string().optional(),
  channels: z.object({
    inApp: z.boolean().optional(),
    email: z.boolean().optional(),
    sms: z.boolean().optional(),
    push: z.boolean().optional()
  })
});
export type BroadcastRecipient = z.infer<typeof BroadcastRecipientSchema>;
