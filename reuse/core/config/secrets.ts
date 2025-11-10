/**
 * @fileoverview Secrets Management Utilities
 * @module core/config/secrets
 *
 * Secure secrets management including encryption, decryption,
 * secret rotation, and integration with secret management services.
 */

import * as crypto from 'crypto';

/**
 * Secret encryption algorithm
 */
export type EncryptionAlgorithm = 'aes-256-gcm' | 'aes-256-cbc';

/**
 * Secret storage interface
 */
export interface SecretStorage {
  /** Retrieves a secret by key */
  get(key: string): Promise<string | null>;
  /** Stores a secret */
  set(key: string, value: string): Promise<void>;
  /** Deletes a secret */
  delete(key: string): Promise<void>;
  /** Lists all secret keys */
  list(): Promise<string[]>;
}

/**
 * Encrypted secret structure
 */
export interface EncryptedSecret {
  /** Encrypted data */
  encrypted: string;
  /** Initialization vector */
  iv: string;
  /** Authentication tag (for GCM mode) */
  authTag?: string;
  /** Algorithm used */
  algorithm: EncryptionAlgorithm;
}

/**
 * Encrypts a secret value
 *
 * @param value - Secret value to encrypt
 * @param key - Encryption key (32 bytes for AES-256)
 * @param algorithm - Encryption algorithm
 * @returns Encrypted secret object
 *
 * @example
 * ```typescript
 * const key = crypto.randomBytes(32);
 * const encrypted = encryptSecret('my-secret-value', key);
 * ```
 */
export function encryptSecret(
  value: string,
  key: Buffer,
  algorithm: EncryptionAlgorithm = 'aes-256-gcm'
): EncryptedSecret {
  // Validate key length
  if (key.length !== 32) {
    throw new Error('Encryption key must be 32 bytes for AES-256');
  }

  // Generate random IV
  const iv = crypto.randomBytes(16);

  if (algorithm === 'aes-256-gcm') {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return {
      encrypted: encrypted.toString('base64'),
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64'),
      algorithm,
    };
  } else {
    // AES-256-CBC
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);

    return {
      encrypted: encrypted.toString('base64'),
      iv: iv.toString('base64'),
      algorithm,
    };
  }
}

/**
 * Decrypts an encrypted secret
 *
 * @param encrypted - Encrypted secret object
 * @param key - Decryption key (must match encryption key)
 * @returns Decrypted secret value
 *
 * @example
 * ```typescript
 * const decrypted = decryptSecret(encrypted, key);
 * ```
 */
export function decryptSecret(encrypted: EncryptedSecret, key: Buffer): string {
  // Validate key length
  if (key.length !== 32) {
    throw new Error('Decryption key must be 32 bytes for AES-256');
  }

  const iv = Buffer.from(encrypted.iv, 'base64');
  const encryptedData = Buffer.from(encrypted.encrypted, 'base64');

  if (encrypted.algorithm === 'aes-256-gcm') {
    if (!encrypted.authTag) {
      throw new Error('Authentication tag is required for GCM mode');
    }

    const decipher = crypto.createDecipheriv(encrypted.algorithm, key, iv);
    decipher.setAuthTag(Buffer.from(encrypted.authTag, 'base64'));

    const decrypted = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  } else {
    // AES-256-CBC
    const decipher = crypto.createDecipheriv(encrypted.algorithm, key, iv);
    const decrypted = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  }
}

/**
 * Generates a secure random encryption key
 *
 * @param length - Key length in bytes (default: 32 for AES-256)
 * @returns Random encryption key
 */
export function generateEncryptionKey(length: number = 32): Buffer {
  return crypto.randomBytes(length);
}

/**
 * Creates an in-memory secret storage
 *
 * @returns Secret storage instance
 */
export function createMemorySecretStorage(): SecretStorage {
  const secrets = new Map<string, string>();

  return {
    async get(key: string): Promise<string | null> {
      return secrets.get(key) || null;
    },

    async set(key: string, value: string): Promise<void> {
      secrets.set(key, value);
    },

    async delete(key: string): Promise<void> {
      secrets.delete(key);
    },

    async list(): Promise<string[]> {
      return Array.from(secrets.keys());
    },
  };
}

/**
 * Secret manager for handling encrypted secrets
 */
export class SecretManager {
  private storage: SecretStorage;
  private encryptionKey: Buffer;

  constructor(storage: SecretStorage, encryptionKey: Buffer) {
    this.storage = storage;
    this.encryptionKey = encryptionKey;
  }

  /**
   * Stores an encrypted secret
   *
   * @param key - Secret key
   * @param value - Secret value
   * @param algorithm - Encryption algorithm
   */
  async setSecret(
    key: string,
    value: string,
    algorithm: EncryptionAlgorithm = 'aes-256-gcm'
  ): Promise<void> {
    const encrypted = encryptSecret(value, this.encryptionKey, algorithm);
    await this.storage.set(key, JSON.stringify(encrypted));
  }

  /**
   * Retrieves and decrypts a secret
   *
   * @param key - Secret key
   * @returns Decrypted secret value or null if not found
   */
  async getSecret(key: string): Promise<string | null> {
    const encryptedData = await this.storage.get(key);
    if (!encryptedData) {
      return null;
    }

    try {
      const encrypted: EncryptedSecret = JSON.parse(encryptedData);
      return decryptSecret(encrypted, this.encryptionKey);
    } catch (error) {
      console.error(`Failed to decrypt secret ${key}:`, error);
      return null;
    }
  }

  /**
   * Deletes a secret
   *
   * @param key - Secret key
   */
  async deleteSecret(key: string): Promise<void> {
    await this.storage.delete(key);
  }

  /**
   * Lists all secret keys
   *
   * @returns Array of secret keys
   */
  async listSecrets(): Promise<string[]> {
    return this.storage.list();
  }

  /**
   * Rotates encryption key by re-encrypting all secrets
   *
   * @param newKey - New encryption key
   */
  async rotateKey(newKey: Buffer): Promise<void> {
    const keys = await this.listSecrets();

    for (const key of keys) {
      const value = await this.getSecret(key);
      if (value) {
        // Re-encrypt with new key
        const encrypted = encryptSecret(value, newKey);
        await this.storage.set(key, JSON.stringify(encrypted));
      }
    }

    this.encryptionKey = newKey;
  }

  /**
   * Checks if a secret exists
   *
   * @param key - Secret key
   * @returns True if secret exists
   */
  async hasSecret(key: string): Promise<boolean> {
    const value = await this.storage.get(key);
    return value !== null;
  }
}

/**
 * Creates a secret manager instance
 *
 * @param storage - Secret storage implementation
 * @param encryptionKey - Encryption key (will be generated if not provided)
 * @returns Secret manager instance
 *
 * @example
 * ```typescript
 * const manager = createSecretManager(createMemorySecretStorage());
 * await manager.setSecret('api-key', 'my-secret-api-key');
 * const apiKey = await manager.getSecret('api-key');
 * ```
 */
export function createSecretManager(
  storage: SecretStorage,
  encryptionKey?: Buffer
): SecretManager {
  const key = encryptionKey || generateEncryptionKey();
  return new SecretManager(storage, key);
}

/**
 * Hashes a secret value (one-way)
 *
 * @param value - Value to hash
 * @param algorithm - Hash algorithm
 * @returns Hashed value
 */
export function hashSecret(
  value: string,
  algorithm: 'sha256' | 'sha512' = 'sha256'
): string {
  return crypto.createHash(algorithm).update(value).digest('hex');
}

/**
 * Compares a value with a hashed secret
 *
 * @param value - Value to compare
 * @param hash - Hashed value
 * @param algorithm - Hash algorithm
 * @returns True if values match
 */
export function compareHash(
  value: string,
  hash: string,
  algorithm: 'sha256' | 'sha512' = 'sha256'
): boolean {
  const valueHash = hashSecret(value, algorithm);
  return crypto.timingSafeEqual(Buffer.from(valueHash), Buffer.from(hash));
}

/**
 * Masks a secret value for display
 *
 * @param value - Secret value
 * @param visibleChars - Number of characters to show at start and end
 * @returns Masked value
 *
 * @example
 * ```typescript
 * maskSecret('my-secret-api-key', 3);
 * // 'my-***-key'
 * ```
 */
export function maskSecret(value: string, visibleChars: number = 4): string {
  if (value.length <= visibleChars * 2) {
    return '*'.repeat(value.length);
  }

  const start = value.substring(0, visibleChars);
  const end = value.substring(value.length - visibleChars);
  const middle = '*'.repeat(Math.min(10, value.length - visibleChars * 2));

  return `${start}${middle}${end}`;
}

/**
 * Validates secret strength
 *
 * @param value - Secret value to validate
 * @param options - Validation options
 * @returns Validation result
 */
export function validateSecretStrength(
  value: string,
  options: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  } = {}
): { valid: boolean; errors: string[] } {
  const {
    minLength = 12,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
  } = options;

  const errors: string[] = [];

  if (value.length < minLength) {
    errors.push(`Secret must be at least ${minLength} characters`);
  }

  if (requireUppercase && !/[A-Z]/.test(value)) {
    errors.push('Secret must contain at least one uppercase letter');
  }

  if (requireLowercase && !/[a-z]/.test(value)) {
    errors.push('Secret must contain at least one lowercase letter');
  }

  if (requireNumbers && !/[0-9]/.test(value)) {
    errors.push('Secret must contain at least one number');
  }

  if (requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
    errors.push('Secret must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generates a random secret value
 *
 * @param length - Secret length
 * @param charset - Character set to use
 * @returns Random secret
 */
export function generateRandomSecret(
  length: number = 32,
  charset: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
): string {
  const bytes = crypto.randomBytes(length);
  let result = '';

  for (let i = 0; i < length; i++) {
    result += charset[bytes[i] % charset.length];
  }

  return result;
}
