/**
 * Server-side Document Encryption Utilities
 *
 * Provides AES-256-GCM encryption for document storage with HIPAA compliance.
 * Uses Node.js crypto module for server-side encryption.
 *
 * @module lib/documents/encryption
 * @security HIPAA-compliant encryption at rest
 */

import crypto from 'crypto';

/**
 * Encryption algorithm configuration
 */
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // 128 bits
const AUTH_TAG_LENGTH = 16; // 128 bits
const SALT_LENGTH = 32; // 256 bits for key derivation

/**
 * Encrypted document structure
 */
export interface EncryptedDocument {
  /** Encrypted data buffer */
  data: Buffer;
  /** Initialization vector */
  iv: Buffer;
  /** Authentication tag for GCM mode */
  authTag: Buffer;
  /** Salt used for key derivation (if applicable) */
  salt?: Buffer;
  /** Encryption algorithm used */
  algorithm: string;
  /** Timestamp when encrypted */
  encryptedAt: Date;
}

/**
 * Encryption key configuration
 */
interface EncryptionKeyConfig {
  /** Master encryption key from environment */
  masterKey: string;
  /** Optional key derivation */
  deriveKey?: boolean;
}

/**
 * Get encryption key from environment
 * @throws Error if encryption key is not configured
 */
function getEncryptionKey(): string {
  const key = process.env.DOCUMENT_ENCRYPTION_KEY || process.env.ENCRYPTION_KEY;

  if (!key) {
    throw new Error('Document encryption key not configured. Set DOCUMENT_ENCRYPTION_KEY or ENCRYPTION_KEY environment variable.');
  }

  // Validate key length (should be 32 bytes / 256 bits when hex-encoded = 64 chars)
  if (key.length < 32) {
    throw new Error('Encryption key must be at least 32 characters (256 bits)');
  }

  return key;
}

/**
 * Derive a 256-bit encryption key from master key using PBKDF2
 *
 * @param masterKey - Master encryption key
 * @param salt - Salt for key derivation
 * @param iterations - Number of PBKDF2 iterations (default: 100000)
 * @returns Derived 256-bit key
 */
function deriveKey(masterKey: string, salt: Buffer, iterations: number = 100000): Buffer {
  return crypto.pbkdf2Sync(masterKey, salt, iterations, 32, 'sha256');
}

/**
 * Encrypt a document buffer using AES-256-GCM
 *
 * Security features:
 * - AES-256-GCM authenticated encryption
 * - Random IV generation for each encryption
 * - Authentication tag for integrity verification
 * - Optional key derivation with salt
 *
 * @param buffer - Document buffer to encrypt
 * @param options - Encryption options
 * @returns Encrypted document with metadata
 *
 * @example
 * ```typescript
 * const fileBuffer = await file.arrayBuffer();
 * const encrypted = await encryptDocument(Buffer.from(fileBuffer));
 * // Store encrypted.data, encrypted.iv, encrypted.authTag
 * ```
 */
export async function encryptDocument(
  buffer: Buffer,
  options: { deriveKey?: boolean } = {}
): Promise<EncryptedDocument> {
  try {
    const masterKey = getEncryptionKey();

    // Generate random IV
    const iv = crypto.randomBytes(IV_LENGTH);

    // Derive key if requested, otherwise use master key directly
    let encryptionKey: Buffer;
    let salt: Buffer | undefined;

    if (options.deriveKey) {
      salt = crypto.randomBytes(SALT_LENGTH);
      encryptionKey = deriveKey(masterKey, salt);
    } else {
      // Use first 32 bytes of master key
      encryptionKey = Buffer.from(masterKey.slice(0, 32));
    }

    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, encryptionKey, iv);

    // Encrypt data
    const encryptedData = Buffer.concat([
      cipher.update(buffer),
      cipher.final()
    ]);

    // Get authentication tag
    const authTag = cipher.getAuthTag();

    return {
      data: encryptedData,
      iv,
      authTag,
      salt,
      algorithm: ALGORITHM,
      encryptedAt: new Date()
    };
  } catch (error) {
    console.error('[Encryption] Failed to encrypt document:', error);
    throw new Error(`Document encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Decrypt an encrypted document using AES-256-GCM
 *
 * Security features:
 * - Authenticated decryption with GCM mode
 * - Authentication tag verification
 * - Key derivation support
 *
 * @param encrypted - Encrypted document structure
 * @returns Decrypted document buffer
 * @throws Error if decryption fails or authentication tag is invalid
 *
 * @example
 * ```typescript
 * const decrypted = await decryptDocument({
 *   data: encryptedBuffer,
 *   iv: ivBuffer,
 *   authTag: authTagBuffer,
 *   algorithm: 'aes-256-gcm',
 *   encryptedAt: new Date()
 * });
 * ```
 */
export async function decryptDocument(encrypted: EncryptedDocument): Promise<Buffer> {
  try {
    const masterKey = getEncryptionKey();

    // Derive key if salt is present, otherwise use master key
    let decryptionKey: Buffer;

    if (encrypted.salt) {
      decryptionKey = deriveKey(masterKey, encrypted.salt);
    } else {
      decryptionKey = Buffer.from(masterKey.slice(0, 32));
    }

    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, decryptionKey, encrypted.iv);

    // Set authentication tag
    decipher.setAuthTag(encrypted.authTag);

    // Decrypt data
    const decryptedData = Buffer.concat([
      decipher.update(encrypted.data),
      decipher.final()
    ]);

    return decryptedData;
  } catch (error) {
    console.error('[Encryption] Failed to decrypt document:', error);

    // Provide more specific error messages
    if (error instanceof Error && error.message.includes('Unsupported state or unable to authenticate data')) {
      throw new Error('Document decryption failed: Invalid authentication tag or corrupted data');
    }

    throw new Error(`Document decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate a secure random encryption key
 * Use this to generate a new DOCUMENT_ENCRYPTION_KEY for environment variables
 *
 * @returns Hex-encoded 256-bit encryption key
 *
 * @example
 * ```typescript
 * const newKey = generateEncryptionKey();
 * // Set as DOCUMENT_ENCRYPTION_KEY=<newKey> in .env
 * ```
 */
export function generateEncryptionKey(): string {
  const key = crypto.randomBytes(32);
  return key.toString('hex');
}

/**
 * Encrypt file buffer from FormData File object
 * Convenience wrapper for encrypting uploaded files
 *
 * @param file - File object from FormData
 * @returns Encrypted document structure
 */
export async function encryptFile(file: File): Promise<EncryptedDocument> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return encryptDocument(buffer);
}

/**
 * Create encrypted document metadata for storage
 * Combines encrypted data into a single serializable object
 *
 * @param encrypted - Encrypted document structure
 * @returns Serializable metadata object
 */
export function createEncryptedMetadata(encrypted: EncryptedDocument): {
  data: string;
  iv: string;
  authTag: string;
  salt?: string;
  algorithm: string;
  encryptedAt: string;
} {
  return {
    data: encrypted.data.toString('base64'),
    iv: encrypted.iv.toString('base64'),
    authTag: encrypted.authTag.toString('base64'),
    salt: encrypted.salt?.toString('base64'),
    algorithm: encrypted.algorithm,
    encryptedAt: encrypted.encryptedAt.toISOString()
  };
}

/**
 * Parse encrypted metadata from storage
 * Converts serialized metadata back to EncryptedDocument structure
 *
 * @param metadata - Serialized encrypted metadata
 * @returns EncryptedDocument structure
 */
export function parseEncryptedMetadata(metadata: {
  data: string;
  iv: string;
  authTag: string;
  salt?: string;
  algorithm: string;
  encryptedAt: string;
}): EncryptedDocument {
  return {
    data: Buffer.from(metadata.data, 'base64'),
    iv: Buffer.from(metadata.iv, 'base64'),
    authTag: Buffer.from(metadata.authTag, 'base64'),
    salt: metadata.salt ? Buffer.from(metadata.salt, 'base64') : undefined,
    algorithm: metadata.algorithm,
    encryptedAt: new Date(metadata.encryptedAt)
  };
}
