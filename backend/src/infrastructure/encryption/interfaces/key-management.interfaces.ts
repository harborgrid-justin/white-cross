/**
 * @fileoverview Key Management Service Interfaces
 * @module infrastructure/encryption/interfaces/key-management
 * @description Type-safe interfaces for RSA key pair management and secure key storage
 *
 * Key Management Architecture:
 * - RSA-4096 key pairs for each user
 * - Public keys stored in database
 * - Private keys encrypted at rest
 * - Session keys cached in Redis with TTL
 * - Support for key rotation and expiration
 */

/**
 * Key type identifier
 */
export enum KeyType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  SESSION = 'session',
}

/**
 * Key format for storage and transmission
 */
export enum KeyFormat {
  PEM = 'pem',
  DER = 'der',
  JWK = 'jwk',
}

/**
 * Key status for tracking lifecycle
 */
export enum KeyStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  ROTATED = 'rotated',
  REVOKED = 'revoked',
}

/**
 * RSA key pair
 * Contains both public and private keys for asymmetric encryption
 */
export interface KeyPair {
  /** Public key in PEM format */
  publicKey: string;

  /** Private key in PEM format */
  privateKey: string;

  /** Key size in bits */
  keySize: number;

  /** When the key pair was generated */
  createdAt: Date;

  /** When the key pair expires (optional) */
  expiresAt?: Date;
}

/**
 * User encryption keys
 * Stored keys associated with a user account
 */
export interface UserKeys {
  /** User identifier */
  userId: string;

  /** Public key (can be shared) */
  publicKey: string;

  /** Private key (encrypted at rest, never transmitted) */
  encryptedPrivateKey: string;

  /** Key identifier */
  keyId: string;

  /** Current status of keys */
  status: KeyStatus;

  /** Key version for rotation tracking */
  version: number;

  /** When keys were created */
  createdAt: Date;

  /** When keys expire */
  expiresAt?: Date;

  /** Previous key ID (for rotation) */
  previousKeyId?: string;
}

/**
 * Key metadata for indexing and lookup
 */
export interface KeyMetadata {
  /** Unique key identifier */
  keyId: string;

  /** User this key belongs to */
  userId: string;

  /** Type of key */
  keyType: KeyType;

  /** Current status */
  status: KeyStatus;

  /** Key version */
  version: number;

  /** Creation timestamp */
  createdAt: number;

  /** Expiration timestamp */
  expiresAt?: number;

  /** Algorithm this key is used for */
  algorithm: string;
}

/**
 * Result of key generation operation
 */
export type KeyGenerationResult =
  | {
      success: true;
      keyPair: KeyPair;
      keyId: string;
      metadata: KeyMetadata;
    }
  | {
      success: false;
      error: string;
      message: string;
    };

/**
 * Result of key retrieval operation
 */
export type KeyRetrievalResult =
  | {
      success: true;
      key: string;
      metadata: KeyMetadata;
    }
  | {
      success: false;
      error: string;
      message: string;
    };

/**
 * Options for key generation
 */
export interface KeyGenerationOptions {
  /** User ID to generate keys for */
  userId: string;

  /** Key size in bits */
  keySize?: 2048 | 4096;

  /** Key expiration in seconds */
  expirationTime?: number;

  /** Whether to store in cache */
  cache?: boolean;

  /** Custom key ID */
  keyId?: string;
}

/**
 * Options for key storage
 */
export interface KeyStorageOptions {
  /** Time to live in seconds */
  ttl?: number;

  /** Whether to encrypt before storage */
  encrypt?: boolean;

  /** Storage namespace */
  namespace?: string;

  /** Tags for key organization */
  tags?: string[];
}

/**
 * Options for key rotation
 */
export interface KeyRotationOptions {
  /** Grace period for old key (seconds) */
  gracePeriod?: number;

  /** Whether to revoke old key immediately */
  revokeOldKey?: boolean;

  /** Reason for rotation */
  reason?: string;
}

/**
 * Encrypted key storage format
 * Used for storing private keys securely
 */
export interface EncryptedKeyStorage {
  /** Encrypted key material */
  encryptedKey: string;

  /** Encryption algorithm used */
  algorithm: string;

  /** IV for decryption */
  iv: string;

  /** Auth tag for verification */
  authTag: string;

  /** Key derivation method */
  kdf: string;

  /** Salt for key derivation */
  salt: string;
}

/**
 * Service interface for key management operations
 */
export interface IKeyManagementService {
  /**
   * Generate a new RSA key pair for a user
   *
   * @param options - Key generation options
   * @returns Key generation result with key pair and metadata
   *
   * @example
   * ```typescript
   * const result = await keyManager.generateKeyPair({
   *   userId: 'user-123',
   *   keySize: 4096
   * });
   *
   * if (result.success) {
   *   console.log('Public key:', result.keyPair.publicKey);
   *   console.log('Key ID:', result.keyId);
   * }
   * ```
   */
  generateKeyPair(options: KeyGenerationOptions): Promise<KeyGenerationResult>;

  /**
   * Get user's public key
   *
   * @param userId - User identifier
   * @returns Public key or null if not found
   */
  getPublicKey(userId: string): Promise<string | null>;

  /**
   * Get user's private key (decrypted)
   * SECURITY: Only call when absolutely necessary, never log result
   *
   * @param userId - User identifier
   * @param passphrase - Passphrase for decryption
   * @returns Private key or null if not found
   */
  getPrivateKey(userId: string, passphrase: string): Promise<string | null>;

  /**
   * Store user keys
   * Private key is encrypted before storage
   *
   * @param userId - User identifier
   * @param keyPair - Key pair to store
   * @param passphrase - Passphrase for encrypting private key
   * @returns Key ID
   */
  storeUserKeys(
    userId: string,
    keyPair: KeyPair,
    passphrase: string,
  ): Promise<string>;

  /**
   * Rotate user's encryption keys
   * Generates new key pair and marks old keys as rotated
   *
   * @param userId - User identifier
   * @param options - Rotation options
   * @returns New key generation result
   */
  rotateUserKeys(
    userId: string,
    options?: KeyRotationOptions,
  ): Promise<KeyGenerationResult>;

  /**
   * Revoke user's encryption keys
   * Marks keys as revoked and removes from cache
   *
   * @param userId - User identifier
   * @param reason - Reason for revocation
   * @returns True if revoked successfully
   */
  revokeUserKeys(userId: string, reason: string): Promise<boolean>;

  /**
   * Get key metadata
   *
   * @param keyId - Key identifier
   * @returns Key metadata or null if not found
   */
  getKeyMetadata(keyId: string): Promise<KeyMetadata | null>;

  /**
   * Check if user has valid keys
   *
   * @param userId - User identifier
   * @returns True if user has active keys
   */
  hasValidKeys(userId: string): Promise<boolean>;

  /**
   * Encrypt data with public key
   * Uses RSA-OAEP for secure encryption
   *
   * @param data - Data to encrypt
   * @param publicKey - Public key in PEM format
   * @returns Encrypted data in base64
   */
  encryptWithPublicKey(data: string, publicKey: string): Promise<string>;

  /**
   * Decrypt data with private key
   * Uses RSA-OAEP for secure decryption
   *
   * @param encryptedData - Encrypted data in base64
   * @param privateKey - Private key in PEM format
   * @returns Decrypted data
   */
  decryptWithPrivateKey(
    encryptedData: string,
    privateKey: string,
  ): Promise<string>;

  /**
   * Derive key from passphrase
   * Uses PBKDF2 for secure key derivation
   *
   * @param passphrase - Input passphrase
   * @param salt - Salt for derivation
   * @param iterations - Number of iterations
   * @returns Derived key
   */
  deriveKey(
    passphrase: string,
    salt: Buffer,
    iterations: number,
  ): Promise<Buffer>;

  /**
   * Generate secure random key
   *
   * @param length - Key length in bytes
   * @returns Random key as buffer
   */
  generateRandomKey(length: number): Buffer;
}
