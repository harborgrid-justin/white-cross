/**
 * @fileoverview Follow-Up Operations Schemas - Create, Update, and Query
 * @module schemas/incidents/follow-up/operations
 *
 * Schemas for CRUD operations and filtering/querying follow-up actions.
 */

import { z } from 'zod';
import { FollowUpActionSchema } from './follow-up.base.schemas';
import { FollowUpActionType, FollowUpStatus, FollowUpPriority } from './follow-up.base.schemas';

// ==========================================
// CREATE/UPDATE SCHEMAS
// ==========================================

/**
 * Create Follow-Up Action Schema
 *
 * Schema for creating new follow-up actions.
 * Omits auto-generated and system-managed fields.
 */
export const CreateFollowUpActionSchema = FollowUpActionSchema.omit({
  id: true,
  actionNumber: true,
  createdAt: true,
  updatedAt: true,
  assignedAt: true,
  completionDate: true,
  verifiedAt: true,
});

export type CreateFollowUpActionInput = z.infer<typeof CreateFollowUpActionSchema>;

/**
 * Update Follow-Up Action Schema
 *
 * Schema for updating existing follow-up actions.
 * All fields except id are optional.
 */
export const UpdateFollowUpActionSchema = FollowUpActionSchema.partial().extend({
  id: z.string().uuid(),
});

export type UpdateFollowUpActionInput = z.infer<typeof UpdateFollowUpActionSchema>;

/**
 * Update Action Status Schema
 *
 * Simplified schema for status transitions.
 */
export const UpdateActionStatusSchema = z.object({
  followUpActionId: z.string().uuid(),
  newStatus: FollowUpStatus,
  reason: z.string().max(500).optional(),
  updatedBy: z.string().uuid(),
});

export type UpdateActionStatusInput = z.infer<typeof UpdateActionStatusSchema>;

/**
 * Assign Action Schema
 *
 * Schema for (re)assigning actions to users.
 */
export const AssignActionSchema = z.object({
  followUpActionId: z.string().uuid(),
  assignedTo: z.string().uuid(),
  assignedBy: z.string().uuid(),
  notes: z.string().max(500).optional(),
});

export type AssignActionInput = z.infer<typeof AssignActionSchema>;

// ==========================================
// QUERY/FILTER SCHEMAS
// ==========================================

/**
 * Sort Field Enum
 */
export const FollowUpSortField = z.enum([
  'dueDate',
  'priority',
  'status',
  'createdAt',
  'actionType',
]);

export type FollowUpSortFieldEnum = z.infer<typeof FollowUpSortField>;

/**
 * Sort Order Enum
 */
export const SortOrder = z.enum(['asc', 'desc']);

export type SortOrderEnum = z.infer<typeof SortOrder>;

/**
 * Follow-Up Action Filter Schema
 *
 * Comprehensive filtering options for querying follow-up actions.
 * Supports filtering by incident, type, status, assignment, dates, and more.
 */
export const FollowUpFilterSchema = z.object({
  // Entity filters
  incidentId: z.string().uuid().optional(),
  actionType: FollowUpActionType.optional(),
  status: FollowUpStatus.optional(),
  priority: FollowUpPriority.optional(),
  assignedTo: z.string().uuid().optional(),

  // Date filters
  dueDateFrom: z.string().datetime().optional(),
  dueDateTo: z.string().datetime().optional(),
  overdueOnly: z.boolean().optional(),

  // Search
  search: z.string().optional(),

  // Pagination
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),

  // Sorting
  sortBy: FollowUpSortField.default('dueDate'),
  sortOrder: SortOrder.default('asc'),
});

export type FollowUpFilter = z.infer<typeof FollowUpFilterSchema>;

/**
 * Follow-Up Action Query Response Schema
 *
 * Schema for paginated query responses.
 */
export const FollowUpQueryResponseSchema = z.object({
  data: z.array(FollowUpActionSchema),
  pagination: z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  }),
});

export type FollowUpQueryResponse = z.infer<typeof FollowUpQueryResponseSchema>;

// ==========================================
// BULK OPERATIONS
// ==========================================

/**
 * Bulk Update Actions Schema
 *
 * Schema for updating multiple actions at once.
 */
export const BulkUpdateActionsSchema = z.object({
  actionIds: z.array(z.string().uuid()).min(1).max(50),
  updates: z.object({
    status: FollowUpStatus.optional(),
    priority: FollowUpPriority.optional(),
    assignedTo: z.string().uuid().optional(),
    dueDate: z.string().datetime().optional(),
  }),
  updatedBy: z.string().uuid(),
});

export type BulkUpdateActionsInput = z.infer<typeof BulkUpdateActionsSchema>;

/**
 * Bulk Delete Actions Schema
 */
export const BulkDeleteActionsSchema = z.object({
  actionIds: z.array(z.string().uuid()).min(1).max(50),
  deletedBy: z.string().uuid(),
  reason: z.string().max(500).optional(),
});

export type BulkDeleteActionsInput = z.infer<typeof BulkDeleteActionsSchema>;
