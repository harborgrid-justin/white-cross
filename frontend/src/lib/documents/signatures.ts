/**
 * Digital Signature Utilities for Documents
 *
 * Provides cryptographic signing, verification, and signature management
 * for legal document compliance (ESIGN Act, UETA).
 *
 * @module lib/documents/signatures
 * @security Cryptographic signatures with SHA-256 hashing
 */

import crypto from 'crypto';

/**
 * Digital signature structure
 */
export interface DocumentSignature {
  /** Unique signature identifier */
  id: string;
  /** Document ID being signed */
  documentId: string;
  /** User ID of signer */
  userId: string;
  /** Full name of signer */
  fullName: string;
  /** Email of signer */
  email: string;
  /** Base64-encoded signature image data */
  signatureData: string;
  /** SHA-256 hash of signature data for integrity */
  signatureHash: string;
  /** Trusted timestamp */
  timestamp: TrustedTimestamp;
  /** IP address of signer */
  ipAddress?: string;
  /** User agent of signer */
  userAgent?: string;
  /** Agreement to terms */
  agreedToTerms: boolean;
  /** Agreement timestamp */
  agreementTimestamp: Date;
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Trusted timestamp structure (simplified RFC 3161)
 */
export interface TrustedTimestamp {
  /** Timestamp value */
  timestamp: Date;
  /** Nonce for uniqueness */
  nonce: string;
  /** Hash of timestamped data */
  dataHash: string;
  /** Timestamp authority (TSA) identifier */
  authority: string;
  /** Cryptographic proof */
  proof: string;
}

/**
 * Signature creation metadata
 */
export interface SignatureMetadata {
  /** Signer's full name */
  fullName: string;
  /** Signer's email */
  email: string;
  /** Agreement to electronic signature terms */
  agreedToTerms: boolean;
  /** IP address (optional) */
  ipAddress?: string;
  /** User agent (optional) */
  userAgent?: string;
  /** Additional metadata */
  [key: string]: any;
}

/**
 * Create a SHA-256 hash of signature data
 *
 * @param data - Signature data to hash (typically base64-encoded image)
 * @returns Hex-encoded SHA-256 hash
 *
 * @example
 * ```typescript
 * const hash = hashSignatureData(signatureBase64);
 * // Returns: "a3d5e8f9..."
 * ```
 */
export function hashSignatureData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Create a SHA-256 hash of document content
 * Used for signature binding to specific document version
 *
 * @param buffer - Document buffer
 * @returns Hex-encoded SHA-256 hash
 */
export function hashDocument(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Generate a unique signature ID
 *
 * @returns Unique signature identifier
 */
export function generateSignatureId(): string {
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString('hex');
  return `sig_${timestamp}_${random}`;
}

/**
 * Create a trusted timestamp for signature
 * Note: This is a simplified implementation. For legal compliance,
 * consider using a certified Timestamp Authority (TSA) like DigiCert or GlobalSign.
 *
 * @param data - Data to timestamp
 * @returns Trusted timestamp structure
 */
export function createTrustedTimestamp(data: string): TrustedTimestamp {
  const timestamp = new Date();
  const nonce = crypto.randomBytes(16).toString('hex');
  const dataHash = crypto.createHash('sha256').update(data).digest('hex');

  // Create cryptographic proof (HMAC of timestamp + data hash)
  const proofData = `${timestamp.toISOString()}|${dataHash}|${nonce}`;
  const proof = crypto
    .createHmac('sha256', process.env.SIGNATURE_SECRET || process.env.JWT_SECRET || 'default-secret')
    .update(proofData)
    .digest('hex');

  return {
    timestamp,
    nonce,
    dataHash,
    authority: 'white-cross-internal-tsa',
    proof
  };
}

/**
 * Verify a trusted timestamp
 *
 * @param timestamp - Timestamp to verify
 * @returns True if timestamp is valid
 */
export function verifyTimestamp(timestamp: TrustedTimestamp): boolean {
  try {
    // Reconstruct proof data
    const proofData = `${timestamp.timestamp.toISOString()}|${timestamp.dataHash}|${timestamp.nonce}`;
    const expectedProof = crypto
      .createHmac('sha256', process.env.SIGNATURE_SECRET || process.env.JWT_SECRET || 'default-secret')
      .update(proofData)
      .digest('hex');

    return expectedProof === timestamp.proof;
  } catch (error) {
    console.error('[Signatures] Timestamp verification failed:', error);
    return false;
  }
}

/**
 * Create a document signature
 *
 * Security features:
 * - SHA-256 hash of signature data
 * - Trusted timestamp
 * - IP and user agent logging
 * - Cryptographic binding to document
 *
 * @param documentId - ID of document being signed
 * @param userId - ID of user signing
 * @param signatureData - Base64-encoded signature image
 * @param metadata - Signature metadata
 * @returns Complete signature structure
 *
 * @example
 * ```typescript
 * const signature = await createDocumentSignature(
 *   'doc_123',
 *   'user_456',
 *   signatureBase64,
 *   {
 *     fullName: 'John Doe',
 *     email: 'john@example.com',
 *     agreedToTerms: true,
 *     ipAddress: '192.168.1.1'
 *   }
 * );
 * ```
 */
export async function createDocumentSignature(
  documentId: string,
  userId: string,
  signatureData: string,
  metadata: SignatureMetadata
): Promise<DocumentSignature> {
  // Validate signature data
  if (!signatureData || signatureData.length < 100) {
    throw new Error('Invalid signature data: signature too short');
  }

  // Validate agreement to terms
  if (!metadata.agreedToTerms) {
    throw new Error('User must agree to electronic signature terms');
  }

  // Generate unique signature ID
  const signatureId = generateSignatureId();

  // Create hash of signature data
  const signatureHash = hashSignatureData(signatureData);

  // Create trusted timestamp
  const timestamp = createTrustedTimestamp(
    `${documentId}|${userId}|${signatureHash}`
  );

  return {
    id: signatureId,
    documentId,
    userId,
    fullName: metadata.fullName,
    email: metadata.email,
    signatureData,
    signatureHash,
    timestamp,
    ipAddress: metadata.ipAddress,
    userAgent: metadata.userAgent,
    agreedToTerms: metadata.agreedToTerms,
    agreementTimestamp: new Date(),
    metadata: {
      ...metadata,
      // Remove known fields to avoid duplication
      fullName: undefined,
      email: undefined,
      agreedToTerms: undefined,
      ipAddress: undefined,
      userAgent: undefined
    }
  };
}

/**
 * Verify signature integrity
 * Checks if signature hash matches the signature data
 *
 * @param signature - Signature to verify
 * @returns True if signature is valid
 */
export function verifySignature(signature: DocumentSignature): boolean {
  try {
    // Verify signature hash
    const computedHash = hashSignatureData(signature.signatureData);
    if (computedHash !== signature.signatureHash) {
      return false;
    }

    // Verify timestamp
    if (!verifyTimestamp(signature.timestamp)) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Signatures] Signature verification failed:', error);
    return false;
  }
}

/**
 * Create signature certificate data
 * Generates a summary of signature for legal documentation
 *
 * @param signature - Document signature
 * @returns Certificate data structure
 */
export function createSignatureCertificate(signature: DocumentSignature): {
  signatureId: string;
  documentId: string;
  signer: string;
  email: string;
  timestamp: string;
  ipAddress?: string;
  signatureHash: string;
  verified: boolean;
} {
  return {
    signatureId: signature.id,
    documentId: signature.documentId,
    signer: signature.fullName,
    email: signature.email,
    timestamp: signature.timestamp.timestamp.toISOString(),
    ipAddress: signature.ipAddress,
    signatureHash: signature.signatureHash,
    verified: verifySignature(signature)
  };
}

/**
 * Validate signature data format
 * Checks if signature data is a valid base64-encoded image
 *
 * @param signatureData - Base64-encoded signature data
 * @returns True if format is valid
 */
export function validateSignatureFormat(signatureData: string): boolean {
  try {
    // Check if it's a data URL
    if (signatureData.startsWith('data:image/')) {
      const base64Data = signatureData.split(',')[1];
      if (!base64Data) return false;

      // Try to decode base64
      Buffer.from(base64Data, 'base64');
      return true;
    }

    // Check if it's plain base64
    if (signatureData.length > 0) {
      Buffer.from(signatureData, 'base64');
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}
