/**
 * @fileoverview Encryption Service Interfaces
 * @module infrastructure/encryption/interfaces
 * @description Type-safe interfaces for end-to-end message encryption using hybrid cryptography
 *
 * Security Architecture:
 * - AES-256-GCM for message content (symmetric, authenticated encryption)
 * - RSA-4096 for key exchange (asymmetric encryption)
 * - Unique session keys per conversation
 * - Redis-based key caching with TTL
 */

/**
 * Supported encryption algorithms
 */
export enum EncryptionAlgorithm {
  AES_256_GCM = 'aes-256-gcm',
  RSA_OAEP = 'rsa-oaep',
}

/**
 * Encryption status for tracking operation outcomes
 */
export enum EncryptionStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  KEY_NOT_FOUND = 'key_not_found',
  INVALID_DATA = 'invalid_data',
  DECRYPTION_ERROR = 'decryption_error',
}

/**
 * Metadata attached to encrypted content
 * Provides information needed for decryption without exposing sensitive data
 */
export interface EncryptionMetadata {
  /** Algorithm used for encryption */
  algorithm: EncryptionAlgorithm;

  /** Initialization vector (IV) for AES-GCM - must be unique per message */
  iv: string;

  /** Authentication tag for AES-GCM - ensures message integrity */
  authTag: string;

  /** Key identifier for retrieving decryption key */
  keyId: string;

  /** Timestamp when encryption occurred */
  timestamp: number;

  /** Version of encryption implementation for future compatibility */
  version: string;
}

/**
 * Result of encryption operation
 * Uses discriminated union for type-safe error handling
 */
export type EncryptionResult =
  | {
      success: true;
      /** Base64-encoded encrypted data */
      data: string;
      /** Encryption metadata needed for decryption */
      metadata: EncryptionMetadata;
    }
  | {
      success: false;
      /** Error code for categorizing failures */
      error: EncryptionStatus;
      /** Human-readable error message (non-sensitive) */
      message: string;
    };

/**
 * Result of decryption operation
 * Uses discriminated union for type-safe error handling
 */
export type DecryptionResult<T = string> =
  | {
      success: true;
      /** Decrypted data */
      data: T;
      /** Metadata from original encryption */
      metadata: EncryptionMetadata;
    }
  | {
      success: false;
      /** Error code for categorizing failures */
      error: EncryptionStatus;
      /** Human-readable error message (non-sensitive) */
      message: string;
    };

/**
 * Configuration for encryption operations
 */
export interface EncryptionOptions {
  /** Key identifier for encryption/decryption */
  keyId?: string;

  /** Conversation or context identifier */
  conversationId?: string;

  /** Additional authenticated data (not encrypted but authenticated) */
  aad?: string;

  /** Whether to skip caching for this operation */
  skipCache?: boolean;

  /** Custom TTL for session key (seconds) */
  keyTTL?: number;
}

/**
 * Encrypted message envelope
 * Contains encrypted data and all metadata needed for decryption
 */
export interface EncryptedMessage {
  /** Base64-encoded encrypted content */
  encryptedContent: string;

  /** Encryption metadata */
  metadata: EncryptionMetadata;

  /** ID of sender (for key lookup) */
  senderId: string;

  /** IDs of recipients (for key lookup) */
  recipientIds: string[];

  /** Conversation identifier */
  conversationId: string;

  /** Whether this message is encrypted */
  isEncrypted: boolean;
}

/**
 * Session key for message encryption
 * Ephemeral key used for encrypting messages in a conversation
 */
export interface SessionKey {
  /** Unique identifier for this session key */
  id: string;

  /** Base64-encoded key material */
  key: string;

  /** Conversation this key is associated with */
  conversationId: string;

  /** When this key was created */
  createdAt: number;

  /** When this key expires (Unix timestamp) */
  expiresAt: number;

  /** Version for key rotation tracking */
  version: number;
}

/**
 * Configuration for the encryption service
 */
export interface EncryptionConfig {
  /** Algorithm for symmetric encryption */
  algorithm: EncryptionAlgorithm.AES_256_GCM;

  /** Key size for RSA (bits) */
  rsaKeySize: 2048 | 4096;

  /** Default TTL for session keys (seconds) */
  sessionKeyTTL: number;

  /** Enable automatic key rotation */
  enableKeyRotation: boolean;

  /** Interval for key rotation (seconds) */
  keyRotationInterval: number;

  /** Current version of encryption implementation */
  version: string;

  /** Whether to enable encryption (feature flag) */
  enabled: boolean;
}

/**
 * Service interface for encryption operations
 * Defines the contract for encryption/decryption services
 */
export interface IEncryptionService {
  /**
   * Encrypt data using AES-256-GCM
   *
   * @param data - Plain text data to encrypt
   * @param options - Encryption options
   * @returns Encryption result with encrypted data and metadata
   *
   * @example
   * ```typescript
   * const result = await encryptionService.encrypt(
   *   'Sensitive message',
   *   { conversationId: 'conv-123' }
   * );
   *
   * if (result.success) {
   *   console.log('Encrypted:', result.data);
   *   console.log('Key ID:', result.metadata.keyId);
   * }
   * ```
   */
  encrypt(data: string, options: EncryptionOptions): Promise<EncryptionResult>;

  /**
   * Decrypt data using AES-256-GCM
   *
   * @param encryptedData - Base64-encoded encrypted data
   * @param metadata - Encryption metadata
   * @param options - Decryption options
   * @returns Decryption result with decrypted data
   *
   * @throws Never throws - returns error in result object
   *
   * @example
   * ```typescript
   * const result = await encryptionService.decrypt(
   *   encryptedData,
   *   metadata,
   *   { keyId: 'key-123' }
   * );
   *
   * if (result.success) {
   *   console.log('Decrypted:', result.data);
   * } else {
   *   console.error('Decryption failed:', result.message);
   * }
   * ```
   */
  decrypt(
    encryptedData: string,
    metadata: EncryptionMetadata,
    options: EncryptionOptions,
  ): Promise<DecryptionResult>;

  /**
   * Encrypt a complete message
   *
   * @param message - Message content to encrypt
   * @param senderId - ID of message sender
   * @param recipientIds - IDs of message recipients
   * @param conversationId - Conversation identifier
   * @returns Encrypted message envelope
   */
  encryptMessage(
    message: string,
    senderId: string,
    recipientIds: string[],
    conversationId: string,
  ): Promise<EncryptedMessage>;

  /**
   * Decrypt a complete message
   *
   * @param encryptedMessage - Encrypted message envelope
   * @param recipientId - ID of recipient requesting decryption
   * @returns Decrypted message content
   */
  decryptMessage(
    encryptedMessage: EncryptedMessage,
    recipientId: string,
  ): Promise<DecryptionResult>;

  /**
   * Get or create session key for a conversation
   *
   * @param conversationId - Conversation identifier
   * @param options - Key options
   * @returns Session key
   */
  getSessionKey(
    conversationId: string,
    options?: EncryptionOptions,
  ): Promise<SessionKey>;

  /**
   * Rotate session key for a conversation
   *
   * @param conversationId - Conversation identifier
   * @returns New session key
   */
  rotateSessionKey(conversationId: string): Promise<SessionKey>;

  /**
   * Check if encryption is enabled
   *
   * @returns True if encryption is enabled
   */
  isEncryptionEnabled(): boolean;
}
