/**
 * @fileoverview Encryption Service
 * @module infrastructure/encryption/service
 * @description AES-256-GCM message encryption with secure key management
 *
 * Features:
 * - AES-256-GCM authenticated encryption
 * - Unique IV per message
 * - Session key management
 * - Integration with key management service
 * - Redis-based key caching
 * - Graceful error handling
 *
 * Security:
 * - Never log decrypted content or keys
 * - Constant-time operations where possible
 * - Secure random IV generation
 * - Authentication tag verification
 * - Key isolation per conversation
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { CacheService } from '../cache/cache.service';
import { KeyManagementService } from './key-management.service';
import {
  DecryptionResult,
  EncryptedMessage,
  EncryptionAlgorithm,
  EncryptionConfig,
  EncryptionMetadata,
  EncryptionOptions,
  EncryptionResult,
  EncryptionStatus,
  IEncryptionService,
  SessionKey,
} from './interfaces';

/**
 * Encryption Service
 * Handles AES-256-GCM encryption/decryption for messages
 */
@Injectable()
export class EncryptionService implements IEncryptionService {
  private readonly logger = new Logger(EncryptionService.name);
  private readonly ALGORITHM = 'aes-256-gcm';
  private readonly KEY_LENGTH = 32; // 256 bits
  private readonly IV_LENGTH = 16; // 128 bits
  private readonly AUTH_TAG_LENGTH = 16; // 128 bits
  private readonly VERSION = '1.0.0';
  private readonly DEFAULT_SESSION_KEY_TTL = 24 * 60 * 60; // 24 hours

  private config: EncryptionConfig;

  constructor(
    private readonly cacheService: CacheService,
    private readonly keyManagementService: KeyManagementService,
    private readonly configService: ConfigService,
  ) {
    this.config = {
      algorithm: EncryptionAlgorithm.AES_256_GCM,
      rsaKeySize: 4096,
      sessionKeyTTL: this.DEFAULT_SESSION_KEY_TTL,
      enableKeyRotation: true,
      keyRotationInterval: 7 * 24 * 60 * 60, // 7 days
      version: this.VERSION,
      enabled: this.configService.get<boolean>('ENCRYPTION_ENABLED', true),
    };

    this.logger.log('Encryption service initialized', {
      enabled: this.config.enabled,
      version: this.config.version,
      algorithm: this.config.algorithm,
    });
  }

  /**
   * Encrypt data using AES-256-GCM
   *
   * @param data - Plain text data to encrypt
   * @param options - Encryption options
   * @returns Encryption result with encrypted data and metadata
   */
  async encrypt(
    data: string,
    options: EncryptionOptions = {},
  ): Promise<EncryptionResult> {
    const startTime = Date.now();

    try {
      // Validate input
      if (!data) {
        return {
          success: false,
          error: EncryptionStatus.INVALID_DATA,
          message: 'Invalid data for encryption',
        };
      }

      // Check if encryption is enabled
      if (!this.isEncryptionEnabled()) {
        this.logger.warn('Encryption is disabled, returning unencrypted data');
        return {
          success: false,
          error: EncryptionStatus.FAILED,
          message: 'Encryption is disabled',
        };
      }

      // Get or create session key
      const sessionKey = options.conversationId
        ? await this.getSessionKey(options.conversationId, options)
        : null;

      const encryptionKey = sessionKey
        ? Buffer.from(sessionKey.key, 'base64')
        : this.keyManagementService.generateRandomKey(this.KEY_LENGTH);

      // Generate unique IV for this message
      const iv = this.keyManagementService.generateRandomKey(this.IV_LENGTH);

      // Create cipher
      const cipher = crypto.createCipheriv(this.ALGORITHM, encryptionKey, iv);

      // Add additional authenticated data if provided
      if (options.aad) {
        cipher.setAAD(Buffer.from(options.aad, 'utf8'));
      }

      // Encrypt data
      let encrypted = cipher.update(data, 'utf8', 'base64');
      encrypted += cipher.final('base64');

      // Get authentication tag
      const authTag = cipher.getAuthTag();

      // Create metadata
      const metadata: EncryptionMetadata = {
        algorithm: EncryptionAlgorithm.AES_256_GCM,
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64'),
        keyId: sessionKey?.id || options.keyId || 'ephemeral',
        timestamp: Date.now(),
        version: this.VERSION,
      };

      const duration = Date.now() - startTime;
      this.logger.debug(`Encryption completed in ${duration}ms`, {
        keyId: metadata.keyId,
        dataLength: data.length,
      });

      return {
        success: true,
        data: encrypted,
        metadata,
      };
    } catch (error) {
      this.logger.error('Encryption failed', {
        error: error.message,
        conversationId: options.conversationId,
      });

      return {
        success: false,
        error: EncryptionStatus.FAILED,
        message: 'Encryption operation failed',
      };
    }
  }

  /**
   * Decrypt data using AES-256-GCM
   *
   * @param encryptedData - Base64-encoded encrypted data
   * @param metadata - Encryption metadata
   * @param options - Decryption options
   * @returns Decryption result with decrypted data
   */
  async decrypt(
    encryptedData: string,
    metadata: EncryptionMetadata,
    options: EncryptionOptions = {},
  ): Promise<DecryptionResult> {
    const startTime = Date.now();

    try {
      // Validate inputs
      if (!encryptedData || !metadata) {
        return {
          success: false,
          error: EncryptionStatus.INVALID_DATA,
          message: 'Invalid encrypted data or metadata',
        };
      }

      // Verify version compatibility
      if (metadata.version !== this.VERSION) {
        this.logger.warn('Version mismatch detected', {
          expected: this.VERSION,
          received: metadata.version,
        });
      }

      // Get decryption key
      const decryptionKey = await this.getDecryptionKey(metadata, options);
      if (!decryptionKey) {
        return {
          success: false,
          error: EncryptionStatus.KEY_NOT_FOUND,
          message: 'Decryption key not found',
        };
      }

      // Parse metadata
      const iv = Buffer.from(metadata.iv, 'base64');
      const authTag = Buffer.from(metadata.authTag, 'base64');

      // Create decipher
      const decipher = crypto.createDecipheriv(
        this.ALGORITHM,
        decryptionKey,
        iv,
      );

      // Set auth tag
      decipher.setAuthTag(authTag);

      // Set AAD if provided
      if (options.aad) {
        decipher.setAAD(Buffer.from(options.aad, 'utf8'));
      }

      // Decrypt data
      let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
      decrypted += decipher.final('utf8');

      const duration = Date.now() - startTime;
      this.logger.debug(`Decryption completed in ${duration}ms`, {
        keyId: metadata.keyId,
      });

      return {
        success: true,
        data: decrypted,
        metadata,
      };
    } catch (error) {
      this.logger.error('Decryption failed', {
        error: error.message,
        keyId: metadata?.keyId,
      });

      return {
        success: false,
        error: EncryptionStatus.DECRYPTION_ERROR,
        message: 'Decryption operation failed',
      };
    }
  }

  /**
   * Encrypt a complete message
   *
   * @param message - Message content to encrypt
   * @param senderId - ID of message sender
   * @param recipientIds - IDs of message recipients
   * @param conversationId - Conversation identifier
   * @returns Encrypted message envelope
   */
  async encryptMessage(
    message: string,
    senderId: string,
    recipientIds: string[],
    conversationId: string,
  ): Promise<EncryptedMessage> {
    try {
      // Encrypt the message content
      const result = await this.encrypt(message, {
        conversationId,
        aad: `${senderId}:${conversationId}`,
      });

      if (!result.success) {
        throw new Error(result.message);
      }

      const encryptedMessage: EncryptedMessage = {
        encryptedContent: result.data,
        metadata: result.metadata,
        senderId,
        recipientIds,
        conversationId,
        isEncrypted: true,
      };

      this.logger.log('Message encrypted successfully', {
        conversationId,
        recipientCount: recipientIds.length,
      });

      return encryptedMessage;
    } catch (error) {
      this.logger.error('Message encryption failed', {
        error: error.message,
        conversationId,
      });

      // Return unencrypted message on failure (graceful degradation)
      return {
        encryptedContent: message,
        metadata: {
          algorithm: EncryptionAlgorithm.AES_256_GCM,
          iv: '',
          authTag: '',
          keyId: 'failed',
          timestamp: Date.now(),
          version: this.VERSION,
        },
        senderId,
        recipientIds,
        conversationId,
        isEncrypted: false,
      };
    }
  }

  /**
   * Decrypt a complete message
   *
   * @param encryptedMessage - Encrypted message envelope
   * @param recipientId - ID of recipient requesting decryption
   * @returns Decrypted message content
   */
  async decryptMessage(
    encryptedMessage: EncryptedMessage,
    recipientId: string,
  ): Promise<DecryptionResult> {
    try {
      // Check if message is actually encrypted
      if (!encryptedMessage.isEncrypted) {
        this.logger.debug('Message is not encrypted, returning as-is');
        return {
          success: true,
          data: encryptedMessage.encryptedContent,
          metadata: encryptedMessage.metadata,
        };
      }

      // Verify recipient is authorized
      if (!encryptedMessage.recipientIds.includes(recipientId)) {
        this.logger.warn('Unauthorized decryption attempt', {
          recipientId: this.sanitizeId(recipientId),
          conversationId: encryptedMessage.conversationId,
        });

        return {
          success: false,
          error: EncryptionStatus.FAILED,
          message: 'Unauthorized to decrypt this message',
        };
      }

      // Decrypt message content
      const result = await this.decrypt(
        encryptedMessage.encryptedContent,
        encryptedMessage.metadata,
        {
          conversationId: encryptedMessage.conversationId,
          aad: `${encryptedMessage.senderId}:${encryptedMessage.conversationId}`,
        },
      );

      if (result.success) {
        this.logger.debug('Message decrypted successfully', {
          conversationId: encryptedMessage.conversationId,
        });
      }

      return result;
    } catch (error) {
      this.logger.error('Message decryption failed', {
        error: error.message,
        conversationId: encryptedMessage.conversationId,
      });

      return {
        success: false,
        error: EncryptionStatus.DECRYPTION_ERROR,
        message: 'Failed to decrypt message',
      };
    }
  }

  /**
   * Get or create session key for a conversation
   *
   * @param conversationId - Conversation identifier
   * @param options - Key options
   * @returns Session key
   */
  async getSessionKey(
    conversationId: string,
    options: EncryptionOptions = {},
  ): Promise<SessionKey> {
    try {
      // Try to get from cache
      if (!options.skipCache) {
        const cached = await this.getCachedSessionKey(conversationId);
        if (cached) {
          this.logger.debug('Session key retrieved from cache', {
            conversationId,
            keyId: cached.id,
          });
          return cached;
        }
      }

      // Generate new session key
      const sessionKey = this.generateSessionKey(conversationId, options);

      // Cache the session key
      await this.cacheSessionKey(sessionKey, options);

      this.logger.log('New session key generated', {
        conversationId,
        keyId: sessionKey.id,
        ttl: options.keyTTL || this.DEFAULT_SESSION_KEY_TTL,
      });

      return sessionKey;
    } catch (error) {
      this.logger.error('Failed to get/create session key', {
        error: error.message,
        conversationId,
      });
      throw error;
    }
  }

  /**
   * Rotate session key for a conversation
   *
   * @param conversationId - Conversation identifier
   * @returns New session key
   */
  async rotateSessionKey(conversationId: string): Promise<SessionKey> {
    this.logger.log('Rotating session key', { conversationId });

    try {
      // Get current key
      const currentKey = await this.getCachedSessionKey(conversationId);

      // Generate new key
      const newKey = this.generateSessionKey(conversationId, {});

      // Mark old key as rotated
      if (currentKey) {
        await this.markKeyAsRotated(currentKey);
      }

      // Cache new key
      await this.cacheSessionKey(newKey, {});

      this.logger.log('Session key rotated successfully', {
        conversationId,
        oldKeyId: currentKey?.id,
        newKeyId: newKey.id,
      });

      return newKey;
    } catch (error) {
      this.logger.error('Session key rotation failed', {
        error: error.message,
        conversationId,
      });
      throw error;
    }
  }

  /**
   * Check if encryption is enabled
   *
   * @returns True if encryption is enabled
   */
  isEncryptionEnabled(): boolean {
    return this.config.enabled;
  }

  // Private helper methods

  /**
   * Get decryption key from metadata
   * @private
   */
  private async getDecryptionKey(
    metadata: EncryptionMetadata,
    options: EncryptionOptions,
  ): Promise<Buffer | null> {
    try {
      // Try to get session key from cache
      if (options.conversationId) {
        const sessionKey = await this.getCachedSessionKey(
          options.conversationId,
        );
        if (sessionKey) {
          return Buffer.from(sessionKey.key, 'base64');
        }
      }

      // If keyId is 'ephemeral', we can't decrypt
      if (metadata.keyId === 'ephemeral') {
        this.logger.warn('Cannot decrypt message with ephemeral key');
        return null;
      }

      // Try to get key by keyId
      const cacheKey = `encryption:session-key:${metadata.keyId}`;
      const sessionKey = await this.cacheService.get<SessionKey>(cacheKey);

      if (sessionKey) {
        return Buffer.from(sessionKey.key, 'base64');
      }

      return null;
    } catch (error) {
      this.logger.error('Failed to get decryption key', {
        error: error.message,
        keyId: metadata.keyId,
      });
      return null;
    }
  }

  /**
   * Generate new session key
   * @private
   */
  private generateSessionKey(
    conversationId: string,
    options: EncryptionOptions,
  ): SessionKey {
    const keyMaterial = this.keyManagementService.generateRandomKey(
      this.KEY_LENGTH,
    );
    const keyId = this.generateSessionKeyId(conversationId);
    const now = Date.now();
    const ttl = options.keyTTL || this.DEFAULT_SESSION_KEY_TTL;

    return {
      id: keyId,
      key: keyMaterial.toString('base64'),
      conversationId,
      createdAt: now,
      expiresAt: now + ttl * 1000,
      version: 1,
    };
  }

  /**
   * Cache session key
   * @private
   */
  private async cacheSessionKey(
    sessionKey: SessionKey,
    options: EncryptionOptions,
  ): Promise<void> {
    const ttl = options.keyTTL || this.DEFAULT_SESSION_KEY_TTL;

    // Cache by conversation ID
    const conversationKey = `encryption:session-key:conversation:${sessionKey.conversationId}`;
    await this.cacheService.set(conversationKey, sessionKey, {
      ttl,
      namespace: 'encryption',
    });

    // Cache by key ID
    const keyIdKey = `encryption:session-key:${sessionKey.id}`;
    await this.cacheService.set(keyIdKey, sessionKey, {
      ttl,
      namespace: 'encryption',
    });
  }

  /**
   * Get cached session key
   * @private
   */
  private async getCachedSessionKey(
    conversationId: string,
  ): Promise<SessionKey | null> {
    const cacheKey = `encryption:session-key:conversation:${conversationId}`;
    const sessionKey = await this.cacheService.get<SessionKey>(cacheKey);

    // Check if key is expired
    if (sessionKey && sessionKey.expiresAt > Date.now()) {
      return sessionKey;
    }

    return null;
  }

  /**
   * Mark key as rotated
   * @private
   */
  private async markKeyAsRotated(sessionKey: SessionKey): Promise<void> {
    const cacheKey = `encryption:session-key:rotated:${sessionKey.id}`;
    await this.cacheService.set(cacheKey, sessionKey, {
      ttl: 7 * 24 * 60 * 60, // Keep for 7 days
      namespace: 'encryption',
    });
  }

  /**
   * Generate session key ID
   * @private
   */
  private generateSessionKeyId(conversationId: string): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    return `session_${conversationId}_${timestamp}_${random}`;
  }

  /**
   * Sanitize ID for logging
   * @private
   */
  private sanitizeId(id: string): string {
    if (id.length <= 8) return id;
    return `${id.substring(0, 8)}...`;
  }
}
