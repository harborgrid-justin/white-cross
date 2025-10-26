/**
 * @fileoverview Witness Statement Validation Schemas
 * @module schemas/incidents/witness
 *
 * Zod schemas for witness management, statement collection, and verification.
 * Legal-grade witness tracking with tamper-proof audit trails.
 */

import { z } from 'zod';

// ==========================================
// ENUMS & CONSTANTS
// ==========================================

/**
 * Witness Type Classification
 */
export const WitnessType = z.enum([
  'STUDENT',        // Student witness
  'STAFF',          // School staff member
  'TEACHER',        // Teacher witness
  'PARENT',         // Parent or guardian
  'VISITOR',        // School visitor
  'FIRST_RESPONDER', // Emergency personnel
  'OTHER',          // Other witness type
]);

export type WitnessTypeEnum = z.infer<typeof WitnessType>;

/**
 * Statement Status
 */
export const StatementStatus = z.enum([
  'PENDING',        // Statement not yet collected
  'DRAFT',          // Statement in progress
  'SUBMITTED',      // Statement submitted for review
  'VERIFIED',       // Statement verified and locked
  'DISPUTED',       // Statement disputed
  'AMENDED',        // Statement amended (creates new version)
]);

export type StatementStatusEnum = z.infer<typeof StatementStatus>;

/**
 * Witness Verification Method
 */
export const VerificationMethod = z.enum([
  'SIGNATURE',      // Physical signature
  'DIGITAL_SIGNATURE', // Digital signature with certificate
  'EMAIL_CONFIRMATION', // Email confirmation link
  'IN_PERSON',      // In-person verification
  'PHONE',          // Phone verification
  'NONE',           // No verification (draft)
]);

export type VerificationMethodEnum = z.infer<typeof VerificationMethod>;

// ==========================================
// WITNESS SCHEMA
// ==========================================

/**
 * Witness Information Schema
 */
export const WitnessSchema = z.object({
  // Identification
  id: z.string().uuid().optional(),
  incidentId: z.string().uuid({
    required_error: 'Incident ID is required',
  }),

  // Witness Details
  witnessType: WitnessType,

  // Contact Information
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email().optional(),
  phone: z.string().optional(),

  // Student-specific
  studentId: z.string().uuid().optional(), // If witness is a student
  grade: z.string().optional(),

  // Staff-specific
  staffId: z.string().uuid().optional(), // If witness is staff
  position: z.string().optional(),
  department: z.string().optional(),

  // Role in incident
  relationshipToIncident: z.string()
    .min(10, 'Please describe the witness relationship to the incident')
    .max(500),

  // Witness location during incident
  witnessLocation: z.string().max(200),
  distanceFromIncident: z.string().max(100).optional(), // e.g., "10 feet away"

  // Metadata
  addedAt: z.string().datetime().optional(),
  addedBy: z.string().uuid().optional(),
  addedByName: z.string().optional(),

  // Statement tracking
  statementProvided: z.boolean().default(false),
  statementDate: z.string().datetime().optional(),

  // Privacy
  consentToContact: z.boolean().default(true),
  consentRecordedAt: z.string().datetime().optional(),
});

export type Witness = z.infer<typeof WitnessSchema>;

// ==========================================
// WITNESS STATEMENT SCHEMA
// ==========================================

/**
 * Witness Statement Schema
 * Legal-grade statement with versioning and verification
 */
export const WitnessStatementSchema = z.object({
  // Identification
  id: z.string().uuid().optional(),
  witnessId: z.string().uuid({
    required_error: 'Witness ID is required',
  }),
  incidentId: z.string().uuid({
    required_error: 'Incident ID is required',
  }),

  // Statement metadata
  version: z.number().int().positive().default(1), // Statement version (for amendments)
  status: StatementStatus.default('DRAFT'),

  // Statement content
  statement: z.string()
    .min(50, 'Statement must be at least 50 characters')
    .max(10000, 'Statement cannot exceed 10,000 characters'),

  // Timeline information
  witnessedAt: z.string().datetime({
    required_error: 'Time of observation is required',
  }),
  duration: z.string().optional(), // How long witnessed (e.g., "2 minutes")

  // Observation details
  whatWitnessed: z.string()
    .min(20, 'Please describe what was witnessed')
    .max(5000),

  // People involved
  peoplePresent: z.array(z.string()).optional(),

  // Additional context
  beforeIncident: z.string().max(2000).optional(),
  duringIncident: z.string().max(2000).optional(),
  afterIncident: z.string().max(2000).optional(),

  // Environmental factors
  weatherConditions: z.string().max(200).optional(),
  lightingConditions: z.string().max(200).optional(),
  noiseLevel: z.string().max(200).optional(),

  // Witness state
  witnessPhysicalState: z.string().max(500).optional(), // Any factors affecting observation
  witnessEmotionalState: z.string().max(500).optional(),

  // Verification
  verificationMethod: VerificationMethod.default('NONE'),
  verifiedAt: z.string().datetime().optional(),
  verifiedBy: z.string().uuid().optional(),
  verificationNotes: z.string().max(1000).optional(),

  // Signature (if applicable)
  signatureData: z.string().optional(), // Base64 encoded signature image
  signatureHash: z.string().optional(), // SHA-256 hash for tamper detection
  signedAt: z.string().datetime().optional(),

  // Legal attestation
  attestation: z.object({
    truthfulnessAcknowledged: z.boolean(),
    consequencesUnderstood: z.boolean(),
    voluntaryStatement: z.boolean(),
    attestedAt: z.string().datetime(),
  }).optional(),

  // Amendment tracking
  amendedFromId: z.string().uuid().optional(), // Previous version ID
  amendmentReason: z.string().max(1000).optional(),

  // Dispute tracking
  disputed: z.boolean().default(false),
  disputeReason: z.string().max(2000).optional(),
  disputedAt: z.string().datetime().optional(),
  disputedBy: z.string().uuid().optional(),

  // Metadata
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  submittedAt: z.string().datetime().optional(),
  submittedBy: z.string().uuid().optional(),

  // Confidentiality
  isConfidential: z.boolean().default(false),
  redactedForRelease: z.boolean().default(false),
  redactedContent: z.string().optional(),

  // Attachments (photos, diagrams, etc.)
  attachments: z.array(z.object({
    id: z.string().uuid(),
    type: z.enum(['PHOTO', 'DIAGRAM', 'DOCUMENT', 'OTHER']),
    filename: z.string(),
    url: z.string().url(),
    description: z.string().max(500).optional(),
    uploadedAt: z.string().datetime(),
  })).optional(),
});

export type WitnessStatement = z.infer<typeof WitnessStatementSchema>;

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
  ipAddress: z.string().ip().optional(),
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
// CREATE/UPDATE SCHEMAS
// ==========================================

/**
 * Create Witness Schema
 */
export const CreateWitnessSchema = WitnessSchema.omit({
  id: true,
  addedAt: true,
  statementDate: true,
  consentRecordedAt: true,
});

export type CreateWitnessInput = z.infer<typeof CreateWitnessSchema>;

/**
 * Update Witness Schema
 */
export const UpdateWitnessSchema = WitnessSchema.partial().extend({
  id: z.string().uuid(),
});

export type UpdateWitnessInput = z.infer<typeof UpdateWitnessSchema>;

/**
 * Create Statement Schema
 */
export const CreateStatementSchema = WitnessStatementSchema.omit({
  id: true,
  version: true,
  createdAt: true,
  updatedAt: true,
  submittedAt: true,
  verifiedAt: true,
  signatureHash: true,
});

export type CreateStatementInput = z.infer<typeof CreateStatementSchema>;

/**
 * Update Statement Schema
 */
export const UpdateStatementSchema = WitnessStatementSchema.partial().extend({
  id: z.string().uuid(),
});

export type UpdateStatementInput = z.infer<typeof UpdateStatementSchema>;

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
