/**
 * @fileoverview Witness Statement Validation Schemas
 * @module schemas/incidents/witness
 *
 * Barrel export for witness management, statement collection, and verification schemas.
 * Legal-grade witness tracking with tamper-proof audit trails.
 */

// Base schemas and enums
export {
  WitnessType,
  StatementStatus,
  VerificationMethod,
  WitnessSchema,
  CreateWitnessSchema,
  UpdateWitnessSchema,
  type WitnessTypeEnum,
  type StatementStatusEnum,
  type VerificationMethodEnum,
  type Witness,
  type CreateWitnessInput,
  type UpdateWitnessInput,
} from './witness.base.schemas';

// Statement schemas
export {
  WitnessStatementSchema,
  CreateStatementSchema,
  UpdateStatementSchema,
  type WitnessStatement,
  type CreateStatementInput,
  type UpdateStatementInput,
} from './witness.statements.schemas';

// Verification and interview schemas
export {
  StatementVerificationSchema,
  WitnessInterviewSchema,
  generateVerificationCode,
  VALID_STATEMENT_TRANSITIONS,
  isValidStatementTransition,
  createStatementHash,
  type StatementVerification,
  type WitnessInterview,
} from './witness.verification.schemas';
