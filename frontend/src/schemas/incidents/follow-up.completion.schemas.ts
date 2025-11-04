/**
 * @fileoverview Follow-Up Completion Schemas - Completion Reports and Verification
 * @module schemas/incidents/follow-up/completion
 *
 * Schemas for completion reports, verification, and impact assessment.
 */

import { z } from 'zod';

// ==========================================
// COMPLETION REPORT SCHEMA
// ==========================================

/**
 * Success Metric Schema
 */
export const SuccessMetricSchema = z.object({
  metric: z.string(),
  target: z.string(),
  actual: z.string(),
  achieved: z.boolean(),
});

export type SuccessMetric = z.infer<typeof SuccessMetricSchema>;

/**
 * Resource Usage Schema
 */
export const ResourceUsageSchema = z.object({
  resource: z.string(),
  quantity: z.string(),
  cost: z.number().optional(),
});

export type ResourceUsage = z.infer<typeof ResourceUsageSchema>;

/**
 * Stakeholder Feedback Schema
 */
export const StakeholderFeedbackSchema = z.object({
  stakeholder: z.string(),
  feedback: z.string(),
  rating: z.number().int().min(1).max(5).optional(),
});

export type StakeholderFeedback = z.infer<typeof StakeholderFeedbackSchema>;

/**
 * Report Attachment Schema
 */
export const ReportAttachmentSchema = z.object({
  id: z.string().uuid(),
  filename: z.string(),
  url: z.string().url(),
  type: z.string(),
  uploadedAt: z.string().datetime(),
});

export type ReportAttachment = z.infer<typeof ReportAttachmentSchema>;

/**
 * Follow-Up Completion Report
 *
 * Comprehensive report documenting the completion of a follow-up action.
 * Includes outcomes, impact assessment, lessons learned, and stakeholder feedback.
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
  successMetrics: z.array(SuccessMetricSchema).optional(),

  // Impact assessment
  effectivenessRating: z.number().int().min(1).max(5),
  impactDescription: z.string().max(2000),

  // Lessons learned
  lessonsLearned: z.string().max(2000).optional(),
  recommendationsForFuture: z.string().max(2000).optional(),

  // Resource usage
  resourcesUsed: z.array(ResourceUsageSchema).optional(),

  // Stakeholder feedback
  stakeholderFeedback: z.array(StakeholderFeedbackSchema).optional(),

  // Supporting documentation
  attachments: z.array(ReportAttachmentSchema).optional(),
});

export type CompletionReport = z.infer<typeof CompletionReportSchema>;

// ==========================================
// COMPLETION OPERATIONS
// ==========================================

/**
 * Create Completion Report Schema
 */
export const CreateCompletionReportSchema = CompletionReportSchema.omit({
  id: true,
});

export type CreateCompletionReportInput = z.infer<typeof CreateCompletionReportSchema>;

/**
 * Update Completion Report Schema
 */
export const UpdateCompletionReportSchema = CompletionReportSchema.partial().extend({
  id: z.string().uuid(),
});

export type UpdateCompletionReportInput = z.infer<typeof UpdateCompletionReportSchema>;

// ==========================================
// VERIFICATION SCHEMAS
// ==========================================

/**
 * Verify Action Completion Schema
 *
 * Schema for verifying that a follow-up action has been properly completed.
 */
export const VerifyActionSchema = z.object({
  followUpActionId: z.string().uuid(),
  verificationMethod: z.enum([
    'SUPERVISOR_REVIEW',
    'DOCUMENTATION_REVIEW',
    'PHYSICAL_INSPECTION',
    'THIRD_PARTY_AUDIT',
    'STAKEHOLDER_CONFIRMATION',
    'AUTOMATED_VERIFICATION',
    'SELF_REPORTED',
  ]),
  verifiedBy: z.string().uuid(),
  verificationNotes: z.string().min(10).max(1000),
  verified: z.boolean(), // true = verified, false = verification failed
});

export type VerifyActionInput = z.infer<typeof VerifyActionSchema>;
