/**
 * @fileoverview Follow-Up Action Validation Schemas
 * @module schemas/incidents/follow-up
 *
 * Zod schemas for follow-up action tracking, resolution management, and accountability.
 */

import { z } from 'zod';

// ==========================================
// ENUMS & CONSTANTS
// ==========================================

/**
 * Follow-Up Action Type
 */
export const FollowUpActionType = z.enum([
  'MEDICAL_FOLLOW_UP',          // Medical appointment or check-up
  'PARENT_MEETING',             // Meeting with parent/guardian
  'SAFETY_INSPECTION',          // Safety inspection or audit
  'EQUIPMENT_REPAIR',           // Equipment repair or replacement
  'POLICY_REVIEW',              // Policy review or update
  'TRAINING',                   // Staff training or education
  'INVESTIGATION',              // Further investigation
  'DOCUMENTATION',              // Additional documentation needed
  'NOTIFICATION',               // Notification to authorities
  'PREVENTIVE_MEASURE',         // Preventive measure implementation
  'MONITORING',                 // Ongoing monitoring
  'COUNSELING',                 // Student or staff counseling
  'DISCIPLINARY',               // Disciplinary action
  'LEGAL_CONSULTATION',         // Legal review or consultation
  'FACILITY_MODIFICATION',      // Physical facility changes
  'OTHER',                      // Other action type
]);

export type FollowUpActionTypeEnum = z.infer<typeof FollowUpActionType>;

/**
 * Follow-Up Status
 */
export const FollowUpStatus = z.enum([
  'PENDING',            // Not started
  'IN_PROGRESS',        // Work in progress
  'COMPLETED',          // Action completed
  'VERIFIED',           // Completion verified
  'OVERDUE',            // Past due date
  'CANCELLED',          // Action cancelled
  'DEFERRED',           // Action deferred to later
  'BLOCKED',            // Blocked by dependency
]);

export type FollowUpStatusEnum = z.infer<typeof FollowUpStatus>;

/**
 * Follow-Up Priority
 */
export const FollowUpPriority = z.enum([
  'CRITICAL',           // Immediate action required
  'HIGH',               // High priority
  'MEDIUM',             // Medium priority
  'LOW',                // Low priority
]);

export type FollowUpPriorityEnum = z.infer<typeof FollowUpPriority>;

/**
 * Completion Verification Method
 */
export const VerificationMethod = z.enum([
  'SUPERVISOR_REVIEW',      // Supervisor verified
  'DOCUMENTATION_REVIEW',   // Documentation reviewed
  'PHYSICAL_INSPECTION',    // Physical inspection completed
  'THIRD_PARTY_AUDIT',      // External audit
  'STAKEHOLDER_CONFIRMATION', // Stakeholder confirmed
  'AUTOMATED_VERIFICATION', // System verification
  'SELF_REPORTED',          // Self-reported (lowest confidence)
]);

export type VerificationMethodEnum = z.infer<typeof VerificationMethod>;

// ==========================================
// FOLLOW-UP ACTION SCHEMA
// ==========================================

/**
 * Follow-Up Action Schema
 */
export const FollowUpActionSchema = z.object({
  // Identification
  id: z.string().uuid().optional(),
  incidentId: z.string().uuid({
    required_error: 'Incident ID is required',
  }),
  actionNumber: z.string().optional(), // Auto-generated: FA-INC-0001-01

  // Classification
  actionType: FollowUpActionType,
  status: FollowUpStatus.default('PENDING'),
  priority: FollowUpPriority,

  // Action Details
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title cannot exceed 200 characters'),

  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(5000, 'Description cannot exceed 5000 characters'),

  // Responsibility
  assignedTo: z.string().uuid({
    required_error: 'Action must be assigned to someone',
  }),
  assignedToName: z.string().optional(),
  assignedToRole: z.string().optional(),
  assignedBy: z.string().uuid().optional(),
  assignedByName: z.string().optional(),
  assignedAt: z.string().datetime().optional(),

  // Timeline
  dueDate: z.string().datetime({
    required_error: 'Due date is required',
  }),
  estimatedDuration: z.string().optional(), // e.g., "2 hours", "3 days"
  startDate: z.string().datetime().optional(),
  completionDate: z.string().datetime().optional(),

  // Dependencies
  dependsOn: z.array(z.string().uuid()).optional(), // Other action IDs
  blockedBy: z.string().uuid().optional(),
  blockedReason: z.string().max(500).optional(),

  // Progress tracking
  percentComplete: z.number().int().min(0).max(100).default(0),
  progressNotes: z.array(z.object({
    id: z.string().uuid(),
    note: z.string().max(2000),
    createdAt: z.string().datetime(),
    createdBy: z.string().uuid(),
    createdByName: z.string(),
    percentComplete: z.number().int().min(0).max(100),
  })).optional(),

  // Completion details
  completionNotes: z.string().max(2000).optional(),
  completedBy: z.string().uuid().optional(),
  completedByName: z.string().optional(),

  // Verification
  requiresVerification: z.boolean().default(false),
  verificationMethod: VerificationMethod.optional(),
  verifiedBy: z.string().uuid().optional(),
  verifiedByName: z.string().optional(),
  verifiedAt: z.string().datetime().optional(),
  verificationNotes: z.string().max(1000).optional(),

  // Evidence of completion
  evidence: z.array(z.object({
    id: z.string().uuid(),
    type: z.enum(['DOCUMENT', 'PHOTO', 'VIDEO', 'REPORT', 'CERTIFICATE', 'OTHER']),
    filename: z.string(),
    url: z.string().url(),
    description: z.string().max(500).optional(),
    uploadedAt: z.string().datetime(),
    uploadedBy: z.string().uuid(),
  })).optional(),

  // Cost tracking (if applicable)
  estimatedCost: z.number().optional(),
  actualCost: z.number().optional(),
  costNotes: z.string().max(500).optional(),

  // Recurrence
  isRecurring: z.boolean().default(false),
  recurrencePattern: z.object({
    frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY']),
    interval: z.number().int().positive(),
    endDate: z.string().datetime().optional(),
  }).optional(),

  // Notifications
  notifyOnCompletion: z.array(z.string().uuid()).optional(), // User IDs to notify
  notifyBeforeDue: z.number().optional(), // Days before due date
  escalationRules: z.array(z.object({
    daysOverdue: z.number().int().positive(),
    escalateTo: z.string().uuid(),
    escalateToName: z.string(),
  })).optional(),

  // Audit trail
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  createdBy: z.string().uuid().optional(),

  // Tags for categorization
  tags: z.array(z.string()).optional(),

  // Privacy
  isConfidential: z.boolean().default(false),
  restrictedAccess: z.boolean().default(false),
});

export type FollowUpAction = z.infer<typeof FollowUpActionSchema>;

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
 * Action Escalation Record
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
  reason: z.enum([
    'OVERDUE',
    'BLOCKED',
    'RESOURCE_NEEDED',
    'PRIORITY_INCREASE',
    'COMPLEXITY_INCREASE',
    'STAKEHOLDER_REQUEST',
    'OTHER',
  ]),
  reasonDetails: z.string().max(1000),

  // Resolution
  resolved: z.boolean().default(false),
  resolvedAt: z.string().datetime().optional(),
  resolution: z.string().max(1000).optional(),

  // Notification
  notificationSent: z.boolean(),
  notificationMethod: z.enum(['EMAIL', 'SMS', 'IN_APP', 'PHONE']).optional(),
});

export type ActionEscalation = z.infer<typeof ActionEscalationSchema>;

// ==========================================
// COMPLETION REPORT SCHEMA
// ==========================================

/**
 * Follow-Up Completion Report
 */
export const CompletionReportSchema = z.object({
  id: z.string().uuid().optional(),
  followUpActionId: z.string().uuid(),

  // Report details
  reportDate: z.string().datetime(),
  reportedBy: z.string().uuid(),
  reportedByName: z.string(),

  // Outcomes
  outcomesSummary: z.string().min(50).max(5000),
  successMetrics: z.array(z.object({
    metric: z.string(),
    target: z.string(),
    actual: z.string(),
    achieved: z.boolean(),
  })).optional(),

  // Impact assessment
  effectivenessRating: z.number().int().min(1).max(5),
  impactDescription: z.string().max(2000),

  // Lessons learned
  lessonsLearned: z.string().max(2000).optional(),
  recommendationsForFuture: z.string().max(2000).optional(),

  // Resource usage
  resourcesUsed: z.array(z.object({
    resource: z.string(),
    quantity: z.string(),
    cost: z.number().optional(),
  })).optional(),

  // Stakeholder feedback
  stakeholderFeedback: z.array(z.object({
    stakeholder: z.string(),
    feedback: z.string(),
    rating: z.number().int().min(1).max(5).optional(),
  })).optional(),

  // Supporting documentation
  attachments: z.array(z.object({
    id: z.string().uuid(),
    filename: z.string(),
    url: z.string().url(),
    type: z.string(),
    uploadedAt: z.string().datetime(),
  })).optional(),
});

export type CompletionReport = z.infer<typeof CompletionReportSchema>;

// ==========================================
// CREATE/UPDATE SCHEMAS
// ==========================================

/**
 * Create Follow-Up Action Schema
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
 */
export const UpdateFollowUpActionSchema = FollowUpActionSchema.partial().extend({
  id: z.string().uuid(),
});

export type UpdateFollowUpActionInput = z.infer<typeof UpdateFollowUpActionSchema>;

/**
 * Update Action Progress Schema
 */
export const UpdateProgressSchema = z.object({
  followUpActionId: z.string().uuid(),
  percentComplete: z.number().int().min(0).max(100),
  progressNote: z.string().min(10).max(2000),
  updatedBy: z.string().uuid(),
});

export type UpdateProgressInput = z.infer<typeof UpdateProgressSchema>;

// ==========================================
// QUERY/FILTER SCHEMAS
// ==========================================

/**
 * Follow-Up Action Filter Schema
 */
export const FollowUpFilterSchema = z.object({
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
  sortBy: z.enum(['dueDate', 'priority', 'status', 'createdAt']).default('dueDate'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export type FollowUpFilter = z.infer<typeof FollowUpFilterSchema>;

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Valid status transitions
 */
export const VALID_FOLLOWUP_TRANSITIONS: Record<FollowUpStatusEnum, FollowUpStatusEnum[]> = {
  PENDING: ['IN_PROGRESS', 'CANCELLED', 'DEFERRED'],
  IN_PROGRESS: ['COMPLETED', 'BLOCKED', 'CANCELLED', 'PENDING'],
  COMPLETED: ['VERIFIED', 'IN_PROGRESS'], // Can reopen
  VERIFIED: [], // Terminal state
  OVERDUE: ['IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
  CANCELLED: ['PENDING'], // Can restore
  DEFERRED: ['PENDING', 'CANCELLED'],
  BLOCKED: ['IN_PROGRESS', 'CANCELLED'],
};

export function isValidFollowUpTransition(
  currentStatus: FollowUpStatusEnum,
  newStatus: FollowUpStatusEnum
): boolean {
  return VALID_FOLLOWUP_TRANSITIONS[currentStatus]?.includes(newStatus) ?? false;
}

/**
 * Calculate if action is overdue
 */
export function isOverdue(action: FollowUpAction): boolean {
  if (action.status === 'COMPLETED' || action.status === 'VERIFIED' || action.status === 'CANCELLED') {
    return false;
  }
  return new Date(action.dueDate) < new Date();
}

/**
 * Calculate days until due
 */
export function daysUntilDue(action: FollowUpAction): number {
  const dueDate = new Date(action.dueDate);
  const now = new Date();
  const diffTime = dueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Auto-generate action number
 */
export function generateActionNumber(incidentNumber: string, actionIndex: number): string {
  return `FA-${incidentNumber}-${String(actionIndex).padStart(2, '0')}`;
}
