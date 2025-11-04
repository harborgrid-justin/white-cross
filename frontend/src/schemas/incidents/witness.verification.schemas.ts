/**
 * @fileoverview Witness statement verification schemas
 * @module schemas/incidents/witness.verification
 *
 * Schemas for statement verification, interviews, and legal validation.
 */

import { z } from 'zod';
import { VerificationMethod, StatementStatusEnum } from './witness.base.schemas';
import { WitnessStatement } from './witness.statements.schemas';

// ==========================================
// STATEMENT VERIFICATION SCHEMA
// ==========================================

/**
 * Statement Verification Record
 */
export const StatementVerificationSchema = z.object({
  id: z.string().uuid().optional(),
  statementId: z.string().uuid(),
  witnessId: z.string().uuid(),

  // Verification details
  method: VerificationMethod,
  verifiedAt: z.string().datetime(),
  verifiedBy: z.string().uuid(),
  verifierName: z.string(),
  verifierRole: z.string(),

  // Verification proof
  verificationCode: z.string().optional(), // Unique verification code
  ipAddress: z.string().regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/, 'Invalid IP address').optional(),
  deviceInfo: z.string().optional(),
  geolocation: z.string().optional(),

  // Digital signature (if applicable)
  digitalSignature: z.object({
    algorithm: z.string(),
    signature: z.string(),
    publicKey: z.string(),
    timestamp: z.string().datetime(),
    certificateId: z.string().optional(),
  }).optional(),

  // Witness confirmation
  witnessConfirmed: z.boolean(),
  confirmationMethod: z.string(),
  confirmationNotes: z.string().max(1000).optional(),

  // Legal compliance
  legalNoticeProvided: z.boolean(),
  rightsExplained: z.boolean(),
  witnessAcknowledged: z.boolean(),

  // Audit trail
  auditTrailHash: z.string(), // SHA-256 hash of verification data
});

export type StatementVerification = z.infer<typeof StatementVerificationSchema>;

// ==========================================
// WITNESS INTERVIEW SCHEMA
// ==========================================

/**
 * Witness Interview Guide Schema
 * Structured interview questions and responses
 */
export const WitnessInterviewSchema = z.object({
  id: z.string().uuid().optional(),
  witnessId: z.string().uuid(),
  incidentId: z.string().uuid(),

  // Interview metadata
  interviewedAt: z.string().datetime(),
  interviewedBy: z.string().uuid(),
  interviewerName: z.string(),
  location: z.string(),
  duration: z.string(), // e.g., "15 minutes"

  // Structured questions
  questions: z.array(z.object({
    question: z.string(),
    response: z.string(),
    followUpQuestions: z.array(z.string()).optional(),
  })),

  // Interview notes
  interviewerNotes: z.string().max(5000).optional(),
  witnessEmotionalState: z.string().max(500).optional(),
  credibilityAssessment: z.string().max(1000).optional(),

  // Recording consent
  recordingConsent: z.boolean(),
  recordingType: z.enum(['AUDIO', 'VIDEO', 'NOTES_ONLY', 'NONE']).optional(),
  recordingLocation: z.string().url().optional(),

  // Follow-up
  requiresFollowUp: z.boolean(),
  followUpReason: z.string().max(1000).optional(),
});

export type WitnessInterview = z.infer<typeof WitnessInterviewSchema>;

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Generate unique verification code
 */
export function generateVerificationCode(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `WV-${timestamp}-${random}`.toUpperCase();
}

/**
 * Validate statement status transition
 */
export const VALID_STATEMENT_TRANSITIONS: Record<StatementStatusEnum, StatementStatusEnum[]> = {
  PENDING: ['DRAFT', 'SUBMITTED'],
  DRAFT: ['SUBMITTED', 'PENDING'],
  SUBMITTED: ['VERIFIED', 'DISPUTED', 'DRAFT'],
  VERIFIED: ['AMENDED', 'DISPUTED'],
  DISPUTED: ['SUBMITTED', 'AMENDED'],
  AMENDED: ['SUBMITTED', 'VERIFIED'],
};

export function isValidStatementTransition(
  currentStatus: StatementStatusEnum,
  newStatus: StatementStatusEnum
): boolean {
  return VALID_STATEMENT_TRANSITIONS[currentStatus]?.includes(newStatus) ?? false;
}

/**
 * Create tamper-proof hash of statement content
 */
export async function createStatementHash(statement: Partial<WitnessStatement>): Promise<string> {
  const data = JSON.stringify({
    witnessId: statement.witnessId,
    incidentId: statement.incidentId,
    statement: statement.statement,
    witnessedAt: statement.witnessedAt,
    submittedAt: statement.submittedAt,
  });

  // Use Web Crypto API for SHA-256 hash
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}
