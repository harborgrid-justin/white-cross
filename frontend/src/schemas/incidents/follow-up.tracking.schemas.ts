/**
 * @fileoverview Follow-Up Tracking Schemas - Progress, Checklists, and Escalations
 * @module schemas/incidents/follow-up/tracking
 *
 * Schemas for tracking progress, managing checklists, and handling escalations.
 */

import { z } from 'zod';

// ==========================================
// ACTION CHECKLIST SCHEMA
// ==========================================

/**
 * Action Checklist Item Schema
 * For breaking down actions into sub-tasks
 */
export const ChecklistItemSchema = z.object({
  id: z.string().uuid().optional(),
  followUpActionId: z.string().uuid(),

  // Item details
  description: z.string().min(5).max(500),
  completed: z.boolean().default(false),
  completedAt: z.string().datetime().optional(),
  completedBy: z.string().uuid().optional(),
  completedByName: z.string().optional(),

  // Order
  order: z.number().int().positive(),

  // Notes
  notes: z.string().max(1000).optional(),
});

export type ChecklistItem = z.infer<typeof ChecklistItemSchema>;

// ==========================================
// ESCALATION SCHEMA
// ==========================================

/**
 * Escalation Reason Enum
 */
export const EscalationReason = z.enum([
  'OVERDUE',
  'BLOCKED',
  'RESOURCE_NEEDED',
  'PRIORITY_INCREASE',
  'COMPLEXITY_INCREASE',
  'STAKEHOLDER_REQUEST',
  'OTHER',
]);

export type EscalationReasonEnum = z.infer<typeof EscalationReason>;

/**
 * Notification Method Enum
 */
export const NotificationMethod = z.enum([
  'EMAIL',
  'SMS',
  'IN_APP',
  'PHONE',
]);

export type NotificationMethodEnum = z.infer<typeof NotificationMethod>;

/**
 * Action Escalation Record
 *
 * Tracks when and why actions are escalated to higher authorities.
 * Includes resolution tracking and notification details.
 */
export const ActionEscalationSchema = z.object({
  id: z.string().uuid().optional(),
  followUpActionId: z.string().uuid(),

  // Escalation details
  escalatedAt: z.string().datetime(),
  escalatedTo: z.string().uuid(),
  escalatedToName: z.string(),
  escalatedBy: z.string().uuid(),
  escalatedByName: z.string(),

  // Reason
  reason: EscalationReason,
  reasonDetails: z.string().max(1000),

  // Resolution
  resolved: z.boolean().default(false),
  resolvedAt: z.string().datetime().optional(),
  resolution: z.string().max(1000).optional(),

  // Notification
  notificationSent: z.boolean(),
  notificationMethod: NotificationMethod.optional(),
});

export type ActionEscalation = z.infer<typeof ActionEscalationSchema>;

// ==========================================
// PROGRESS UPDATE SCHEMA
// ==========================================

/**
 * Update Action Progress Schema
 *
 * Schema for recording progress updates on follow-up actions.
 * Used to add progress notes and update completion percentage.
 */
export const UpdateProgressSchema = z.object({
  followUpActionId: z.string().uuid(),
  percentComplete: z.number().int().min(0).max(100),
  progressNote: z.string().min(10).max(2000),
  updatedBy: z.string().uuid(),
});

export type UpdateProgressInput = z.infer<typeof UpdateProgressSchema>;

// ==========================================
// CHECKLIST OPERATIONS
// ==========================================

/**
 * Create Checklist Item Schema
 */
export const CreateChecklistItemSchema = ChecklistItemSchema.omit({
  id: true,
  completedAt: true,
});

export type CreateChecklistItemInput = z.infer<typeof CreateChecklistItemSchema>;

/**
 * Update Checklist Item Schema
 */
export const UpdateChecklistItemSchema = ChecklistItemSchema.partial().extend({
  id: z.string().uuid(),
});

export type UpdateChecklistItemInput = z.infer<typeof UpdateChecklistItemSchema>;

/**
 * Complete Checklist Item Schema
 */
export const CompleteChecklistItemSchema = z.object({
  checklistItemId: z.string().uuid(),
  completedBy: z.string().uuid(),
  notes: z.string().max(1000).optional(),
});

export type CompleteChecklistItemInput = z.infer<typeof CompleteChecklistItemSchema>;

// ==========================================
// ESCALATION OPERATIONS
// ==========================================

/**
 * Create Escalation Schema
 */
export const CreateEscalationSchema = ActionEscalationSchema.omit({
  id: true,
  resolved: true,
  resolvedAt: true,
  resolution: true,
});

export type CreateEscalationInput = z.infer<typeof CreateEscalationSchema>;

/**
 * Resolve Escalation Schema
 */
export const ResolveEscalationSchema = z.object({
  escalationId: z.string().uuid(),
  resolution: z.string().min(10).max(1000),
  resolvedBy: z.string().uuid().optional(),
});

export type ResolveEscalationInput = z.infer<typeof ResolveEscalationSchema>;
