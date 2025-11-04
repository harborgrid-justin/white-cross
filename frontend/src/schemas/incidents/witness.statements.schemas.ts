/**
 * @fileoverview Witness statement validation schemas
 * @module schemas/incidents/witness.statements
 *
 * Schemas for witness statement collection, verification, and management.
 */

import { z } from 'zod';
import { StatementStatus, VerificationMethod } from './witness.base.schemas';

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
// CREATE/UPDATE SCHEMAS
// ==========================================

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
