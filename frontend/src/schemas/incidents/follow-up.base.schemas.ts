/**
 * @fileoverview Follow-Up Base Schemas - Core Types and Enums
 * @module schemas/incidents/follow-up/base
 *
 * Core Zod schemas for follow-up actions including enums, constants, and the main schema.
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

/**
 * Evidence Type
 */
export const EvidenceType = z.enum([
  'DOCUMENT',
  'PHOTO',
  'VIDEO',
  'REPORT',
  'CERTIFICATE',
  'OTHER',
]);

export type EvidenceTypeEnum = z.infer<typeof EvidenceType>;

/**
 * Recurrence Frequency
 */
export const RecurrenceFrequency = z.enum([
  'DAILY',
  'WEEKLY',
  'MONTHLY',
  'QUARTERLY',
  'ANNUALLY',
]);

export type RecurrenceFrequencyEnum = z.infer<typeof RecurrenceFrequency>;

// ==========================================
// NESTED SCHEMAS
// ==========================================

/**
 * Progress Note Schema
 */
export const ProgressNoteSchema = z.object({
  id: z.string().uuid(),
  note: z.string().max(2000),
  createdAt: z.string().datetime(),
  createdBy: z.string().uuid(),
  createdByName: z.string(),
  percentComplete: z.number().int().min(0).max(100),
});

export type ProgressNote = z.infer<typeof ProgressNoteSchema>;

/**
 * Evidence Schema
 */
export const EvidenceSchema = z.object({
  id: z.string().uuid(),
  type: EvidenceType,
  filename: z.string(),
  url: z.string().url(),
  description: z.string().max(500).optional(),
  uploadedAt: z.string().datetime(),
  uploadedBy: z.string().uuid(),
});

export type Evidence = z.infer<typeof EvidenceSchema>;

/**
 * Recurrence Pattern Schema
 */
export const RecurrencePatternSchema = z.object({
  frequency: RecurrenceFrequency,
  interval: z.number().int().positive(),
  endDate: z.string().datetime().optional(),
});

export type RecurrencePattern = z.infer<typeof RecurrencePatternSchema>;

/**
 * Escalation Rule Schema
 */
export const EscalationRuleSchema = z.object({
  daysOverdue: z.number().int().positive(),
  escalateTo: z.string().uuid(),
  escalateToName: z.string(),
});

export type EscalationRule = z.infer<typeof EscalationRuleSchema>;

// ==========================================
// MAIN FOLLOW-UP ACTION SCHEMA
// ==========================================

/**
 * Follow-Up Action Schema
 *
 * Main schema for tracking follow-up actions after incidents.
 * Includes responsibility assignment, timeline tracking, progress monitoring,
 * verification, and comprehensive audit trail.
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
  progressNotes: z.array(ProgressNoteSchema).optional(),

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
  evidence: z.array(EvidenceSchema).optional(),

  // Cost tracking (if applicable)
  estimatedCost: z.number().optional(),
  actualCost: z.number().optional(),
  costNotes: z.string().max(500).optional(),

  // Recurrence
  isRecurring: z.boolean().default(false),
  recurrencePattern: RecurrencePatternSchema.optional(),

  // Notifications
  notifyOnCompletion: z.array(z.string().uuid()).optional(), // User IDs to notify
  notifyBeforeDue: z.number().optional(), // Days before due date
  escalationRules: z.array(EscalationRuleSchema).optional(),

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
// VALID STATUS TRANSITIONS
// ==========================================

/**
 * Valid status transitions for follow-up actions
 * Defines which status changes are permitted
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
