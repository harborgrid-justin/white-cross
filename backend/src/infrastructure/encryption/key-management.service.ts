/**
 * @fileoverview Key Management Service
 * @module infrastructure/encryption/key-management
 * @description Secure RSA key pair generation and management with encrypted storage
 *
 * Features:
 * - RSA-4096 key pair generation
 * - Secure private key encryption at rest
 * - Public key distribution
 * - Key rotation with grace periods
 * - Key revocation
 * - Redis-based key caching
 * - PBKDF2 key derivation
 *
 * Security:
 * - Private keys encrypted with AES-256-GCM before storage
 * - Key material never logged
 * - Constant-time operations where applicable
 * - Secure random generation
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { CacheService } from '../cache/cache.service';
import {
  IKeyManagementService,
  KeyPair,
  KeyGenerationOptions,
  KeyGenerationResult,
  KeyMetadata,
  KeyType,
  KeyStatus,
  KeyRotationOptions,
  EncryptedKeyStorage,
} from './interfaces';

/**
 * Key Management Service
 * Handles RSA key pair generation, storage, and lifecycle management
 */
@Injectable()
export class KeyManagementService implements IKeyManagementService {
  private readonly logger = new Logger(KeyManagementService.name);
  private readonly DEFAULT_KEY_SIZE = 4096;
  private readonly DEFAULT_EXPIRATION = 365 * 24 * 60 * 60; // 1 year
  private readonly PBKDF2_ITERATIONS = 100000;
  private readonly KEY_DERIVATION_LENGTH = 32; // 256 bits

  constructor(
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generate a new RSA key pair for a user
   *
   * @param options - Key generation options
   * @returns Key generation result with key pair and metadata
   */
  async generateKeyPair(
    options: KeyGenerationOptions,
  ): Promise<KeyGenerationResult> {
    const startTime = Date.now();

    try {
      const keySize = options.keySize || this.DEFAULT_KEY_SIZE;
      const keyId = options.keyId || this.generateKeyId(options.userId);

      this.logger.log(
        `Generating RSA-${keySize} key pair for user: ${this.sanitizeUserId(options.userId)}`,
      );

      // Generate RSA key pair
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: keySize,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
        },
      });

      const keyPair: KeyPair = {
        publicKey,
        privateKey,
        keySize,
        createdAt: new Date(),
        expiresAt: options.expirationTime
          ? new Date(Date.now() + options.expirationTime * 1000)
          : new Date(Date.now() + this.DEFAULT_EXPIRATION * 1000),
      };

      const metadata: KeyMetadata = {
        keyId,
        userId: options.userId,
        keyType: KeyType.PRIVATE,
        status: KeyStatus.ACTIVE,
        version: 1,
        createdAt: Date.now(),
        expiresAt: keyPair.expiresAt?.getTime(),
        algorithm: 'RSA-OAEP',
      };

      // Cache public key for quick access
      if (options.cache !== false) {
        await this.cachePublicKey(options.userId, publicKey, keyId);
      }

      const duration = Date.now() - startTime;
      this.logger.log(
        `Key pair generated successfully in ${duration}ms for user: ${this.sanitizeUserId(options.userId)}`,
      );

      return {
        success: true,
        keyPair,
        keyId,
        metadata,
      };
    } catch (error) {
      this.logger.error(
        `Key generation failed for user: ${this.sanitizeUserId(options.userId)}`,
        {
          error: error.message,
          userId: this.sanitizeUserId(options.userId),
        },
      );

      return {
        success: false,
        error: 'KEY_GENERATION_FAILED',
        message: 'Failed to generate encryption keys',
      };
    }
  }

  /**
   * Get user's public key from cache or storage
   *
   * @param userId - User identifier
   * @returns Public key in PEM format or null
   */
  async getPublicKey(userId: string): Promise<string | null> {
    try {
      const cacheKey = this.buildCacheKey('public', userId);
      const cached = await this.cacheService.get<string>(cacheKey);

      if (cached) {
        this.logger.debug(
          `Public key retrieved from cache for user: ${this.sanitizeUserId(userId)}`,
        );
        return cached;
      }

      // In a real implementation, fetch from database here
      this.logger.debug(
        `Public key not found for user: ${this.sanitizeUserId(userId)}`,
      );
      return null;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve public key for user: ${this.sanitizeUserId(userId)}`,
        {
          error: error.message,
        },
      );
      return null;
    }
  }

  /**
   * Get user's private key (decrypted)
   * SECURITY: Only call when absolutely necessary
   *
   * @param userId - User identifier
   * @param passphrase - Passphrase for decryption
   * @returns Decrypted private key or null
   */
  async getPrivateKey(
    userId: string,
    passphrase: string,
  ): Promise<string | null> {
    try {
      const cacheKey = this.buildCacheKey('private', userId);
      const encryptedStorage =
        await this.cacheService.get<EncryptedKeyStorage>(cacheKey);

      if (!encryptedStorage) {
        this.logger.debug(
          `Private key not found for user: ${this.sanitizeUserId(userId)}`,
        );
        return null;
      }

      // Decrypt the private key
      const privateKey = await this.decryptPrivateKey(
        encryptedStorage,
        passphrase,
      );

      this.logger.debug(
        `Private key decrypted for user: ${this.sanitizeUserId(userId)}`,
      );
      return privateKey;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve/decrypt private key for user: ${this.sanitizeUserId(userId)}`,
        {
          error: error.message,
        },
      );
      return null;
    }
  }

  /**
   * Store user keys with encrypted private key
   *
   * @param userId - User identifier
   * @param keyPair - Key pair to store
   * @param passphrase - Passphrase for encrypting private key
   * @returns Key ID
   */
  async storeUserKeys(
    userId: string,
    keyPair: KeyPair,
    passphrase: string,
  ): Promise<string> {
    const keyId = this.generateKeyId(userId);

    try {
      // Encrypt private key before storage
      const encryptedStorage = await this.encryptPrivateKey(
        keyPair.privateKey,
        passphrase,
      );

      // Store encrypted private key
      const privateKeyCache = this.buildCacheKey('private', userId);
      await this.cacheService.set(privateKeyCache, encryptedStorage, {
        ttl: 24 * 60 * 60, // 24 hours
        namespace: 'encryption',
      });

      // Store public key (not encrypted)
      await this.cachePublicKey(userId, keyPair.publicKey, keyId);

      this.logger.log(
        `User keys stored successfully for user: ${this.sanitizeUserId(userId)}`,
      );

      return keyId;
    } catch (error) {
      this.logger.error(
        `Failed to store user keys for user: ${this.sanitizeUserId(userId)}`,
        {
          error: error.message,
        },
      );
      throw new Error('Failed to store encryption keys');
    }
  }

  /**
   * Rotate user's encryption keys
   *
   * @param userId - User identifier
   * @param options - Rotation options
   * @returns New key generation result
   */
  async rotateUserKeys(
    userId: string,
    options?: KeyRotationOptions,
  ): Promise<KeyGenerationResult> {
    this.logger.log(`Rotating keys for user: ${this.sanitizeUserId(userId)}`, {
      reason: options?.reason || 'scheduled_rotation',
    });

    try {
      // Get current key ID
      const currentKeyId = await this.getCurrentKeyId(userId);

      // Generate new key pair
      const result = await this.generateKeyPair({
        userId,
        keySize: 4096,
      });

      if (!result.success) {
        return result;
      }

      // Mark old key as rotated if it exists
      if (currentKeyId && !options?.revokeOldKey) {
        await this.markKeyAsRotated(currentKeyId, result.keyId);
      } else if (currentKeyId && options?.revokeOldKey) {
        await this.revokeKey(currentKeyId, 'rotated');
      }

      this.logger.log(
        `Key rotation completed for user: ${this.sanitizeUserId(userId)}`,
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Key rotation failed for user: ${this.sanitizeUserId(userId)}`,
        {
          error: error.message,
        },
      );

      return {
        success: false,
        error: 'KEY_ROTATION_FAILED',
        message: 'Failed to rotate encryption keys',
      };
    }
  }

  /**
   * Revoke user's encryption keys
   *
   * @param userId - User identifier
   * @param reason - Reason for revocation
   * @returns True if revoked successfully
   */
  async revokeUserKeys(userId: string, reason: string): Promise<boolean> {
    try {
      this.logger.warn(
        `Revoking keys for user: ${this.sanitizeUserId(userId)}`,
        { reason },
      );

      const keyId = await this.getCurrentKeyId(userId);
      if (keyId) {
        await this.revokeKey(keyId, reason);
      }

      // Remove from cache
      await this.cacheService.delete(this.buildCacheKey('public', userId));
      await this.cacheService.delete(this.buildCacheKey('private', userId));
      await this.cacheService.delete(this.buildCacheKey('metadata', userId));

      this.logger.log(
        `Keys revoked successfully for user: ${this.sanitizeUserId(userId)}`,
      );

      return true;
    } catch (error) {
      this.logger.error(
        `Key revocation failed for user: ${this.sanitizeUserId(userId)}`,
        {
          error: error.message,
        },
      );
      return false;
    }
  }

  /**
   * Get key metadata
   *
   * @param keyId - Key identifier
   * @returns Key metadata or null
   */
  async getKeyMetadata(keyId: string): Promise<KeyMetadata | null> {
    try {
      const cacheKey = `encryption:metadata:${keyId}`;
      return await this.cacheService.get<KeyMetadata>(cacheKey);
    } catch (error) {
      this.logger.error(`Failed to retrieve key metadata for key: ${keyId}`, {
        error: error.message,
      });
      return null;
    }
  }

  /**
   * Check if user has valid keys
   *
   * @param userId - User identifier
   * @returns True if user has active keys
   */
  async hasValidKeys(userId: string): Promise<boolean> {
    const publicKey = await this.getPublicKey(userId);
    return publicKey !== null;
  }

  /**
   * Encrypt data with public key using RSA-OAEP
   *
   * @param data - Data to encrypt
   * @param publicKey - Public key in PEM format
   * @returns Encrypted data in base64
   */
  async encryptWithPublicKey(data: string, publicKey: string): Promise<string> {
    try {
      const buffer = Buffer.from(data, 'utf8');
      const encrypted = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        buffer,
      );

      return encrypted.toString('base64');
    } catch (error) {
      this.logger.error('Public key encryption failed', {
        error: error.message,
      });
      throw new Error('Failed to encrypt with public key');
    }
  }

  /**
   * Decrypt data with private key using RSA-OAEP
   *
   * @param encryptedData - Encrypted data in base64
   * @param privateKey - Private key in PEM format
   * @returns Decrypted data
   */
  async decryptWithPrivateKey(
    encryptedData: string,
    privateKey: string,
  ): Promise<string> {
    try {
      const buffer = Buffer.from(encryptedData, 'base64');
      const decrypted = crypto.privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        buffer,
      );

      return decrypted.toString('utf8');
    } catch (error) {
      this.logger.error('Private key decryption failed', {
        error: error.message,
      });
      throw new Error('Failed to decrypt with private key');
    }
  }

  /**
   * Derive key from passphrase using PBKDF2
   *
   * @param passphrase - Input passphrase
   * @param salt - Salt for derivation
   * @param iterations - Number of iterations
   * @returns Derived key
   */
  async deriveKey(
    passphrase: string,
    salt: Buffer,
    iterations: number = this.PBKDF2_ITERATIONS,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        passphrase,
        salt,
        iterations,
        this.KEY_DERIVATION_LENGTH,
        'sha256',
        (err, derivedKey) => {
          if (err) {
            reject(err);
          } else {
            resolve(derivedKey);
          }
        },
      );
    });
  }

  /**
   * Generate secure random key
   *
   * @param length - Key length in bytes
   * @returns Random key as buffer
   */
  generateRandomKey(length: number): Buffer {
    return crypto.randomBytes(length);
  }

  // Private helper methods

  /**
   * Encrypt private key for storage
   * @private
   */
  private async encryptPrivateKey(
    privateKey: string,
    passphrase: string,
  ): Promise<EncryptedKeyStorage> {
    const salt = this.generateRandomKey(32);
    const derivedKey = await this.deriveKey(passphrase, salt);
    const iv = this.generateRandomKey(16);

    const cipher = crypto.createCipheriv('aes-256-gcm', derivedKey, iv);

    let encrypted = cipher.update(privateKey, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const authTag = cipher.getAuthTag();

    return {
      encryptedKey: encrypted,
      algorithm: 'aes-256-gcm',
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64'),
      kdf: 'pbkdf2',
      salt: salt.toString('base64'),
    };
  }

  /**
   * Decrypt private key from storage
   * @private
   */
  private async decryptPrivateKey(
    storage: EncryptedKeyStorage,
    passphrase: string,
  ): Promise<string> {
    const salt = Buffer.from(storage.salt, 'base64');
    const derivedKey = await this.deriveKey(passphrase, salt);
    const iv = Buffer.from(storage.iv, 'base64');
    const authTag = Buffer.from(storage.authTag, 'base64');

    const decipher = crypto.createDecipheriv('aes-256-gcm', derivedKey, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(storage.encryptedKey, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Cache public key
   * @private
   */
  private async cachePublicKey(
    userId: string,
    publicKey: string,
    keyId: string,
  ): Promise<void> {
    const cacheKey = this.buildCacheKey('public', userId);
    await this.cacheService.set(cacheKey, publicKey, {
      ttl: 24 * 60 * 60, // 24 hours
      namespace: 'encryption',
    });

    // Store key ID mapping
    const keyIdCache = this.buildCacheKey('key-id', userId);
    await this.cacheService.set(keyIdCache, keyId, {
      ttl: 24 * 60 * 60,
      namespace: 'encryption',
    });
  }

  /**
   * Generate unique key ID
   * @private
   */
  private generateKeyId(userId: string): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    return `key_${userId}_${timestamp}_${random}`;
  }

  /**
   * Build cache key
   * @private
   */
  private buildCacheKey(type: string, userId: string): string {
    return `encryption:${type}:${userId}`;
  }

  /**
   * Get current key ID for user
   * @private
   */
  private async getCurrentKeyId(userId: string): Promise<string | null> {
    const cacheKey = this.buildCacheKey('key-id', userId);
    return await this.cacheService.get<string>(cacheKey);
  }

  /**
   * Mark key as rotated
   * @private
   */
  private async markKeyAsRotated(
    oldKeyId: string,
    newKeyId: string,
  ): Promise<void> {
    const metadata = await this.getKeyMetadata(oldKeyId);
    if (metadata) {
      metadata.status = KeyStatus.ROTATED;
      const cacheKey = `encryption:metadata:${oldKeyId}`;
      await this.cacheService.set(cacheKey, metadata, {
        ttl: 30 * 24 * 60 * 60, // Keep for 30 days
        namespace: 'encryption',
      });
    }
  }

  /**
   * Revoke a specific key
   * @private
   */
  private async revokeKey(keyId: string, reason: string): Promise<void> {
    const metadata = await this.getKeyMetadata(keyId);
    if (metadata) {
      metadata.status = KeyStatus.REVOKED;
      const cacheKey = `encryption:metadata:${keyId}`;
      await this.cacheService.set(cacheKey, metadata, {
        ttl: 90 * 24 * 60 * 60, // Keep revocation record for 90 days
        namespace: 'encryption',
      });

      this.logger.warn(`Key revoked: ${keyId}`, { reason });
    }
  }

  /**
   * Sanitize user ID for logging (show only first 8 chars)
   * @private
   */
  private sanitizeUserId(userId: string): string {
    if (userId.length <= 8) return userId;
    return `${userId.substring(0, 8)}...`;
  }
}
