/**
 * Document Signature Types Module
 * Types related to document signatures and workflows
 * Dependencies: enums.ts, core.ts
 */

import { SignatureType } from './enums';

/**
 * Signature Workflow
 * Workflow for document signatures
 */
export interface SignatureWorkflow {
  id: string;
  documentId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  signers: Array<{
    userId: string;
    role: string;
    signed: boolean;
    signedAt?: string;
  }>;
  createdAt: string;
  completedAt?: string;
}

/**
 * Signature
 * Individual signature record
 */
export interface Signature {
  id: string;
  documentId: string;
  userId: string;
  signatureData: string;
  signedAt: string;
  ipAddress?: string;
}

/**
 * Signature Verification Result
 * Result of signature verification operation
 */
export interface SignatureVerificationResult {
  signatureId: string;
  documentId: string;
  isValid: boolean;
  signedBy: string;
  signedAt: string;
  signatureType: SignatureType;
  certificateChain?: string[];
  trustLevel: 'TRUSTED' | 'UNTRUSTED' | 'UNKNOWN';
  verificationMethod: string;
  timestamp: string;
  errors?: string[];
  warnings?: string[];
}
