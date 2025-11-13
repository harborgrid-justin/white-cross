/**
 * @fileoverview Session Key Manager Service
 * @module infrastructure/encryption/services
 * @description Service for managing session keys, caching, and rotation
 */

import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import * as crypto from 'crypto';
import { CacheService } from '../../cache/cache.service';
import { SessionKey, EncryptionOptions } from '../types/encryption.types';
import { KeyManagementService } from '../key-management.service';

@Injectable()
export class SessionKeyManagerService extends BaseService {
  private readonly DEFAULT_SESSION_KEY_TTL = 24 * 60 * 60; // 24 hours

  constructor(
    @Inject(LoggerService) logger: LoggerService,
    private readonly cacheService: CacheService,
    private readonly keyManagementService: KeyManagementService,
  ) {
    super({
      serviceName: 'SessionKeyManagerService',
      logger,
      enableAuditLogging: true,
    });
  }

  /**
   * Get or create session key for a conversation
   */
  async getSessionKey(conversationId: string, options: EncryptionOptions = {}): Promise<SessionKey> {
    try {
      // Try to get from cache
      if (!options.skipCache) {
        const cached = await this.getCachedSessionKey(conversationId);
        if (cached) {
          this.logDebug('Session key retrieved from cache', {
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

      this.logInfo('New session key generated', {
        conversationId,
        keyId: sessionKey.id,
        ttl: options.keyTTL || this.DEFAULT_SESSION_KEY_TTL,
      });

      return sessionKey;
    } catch (error) {
      this.logError('Failed to get/create session key', {
        error: error instanceof Error ? error.message : 'Unknown error',
        conversationId,
      });
      throw error;
    }
  }

  /**
   * Rotate session key for a conversation
   */
  async rotateSessionKey(conversationId: string): Promise<SessionKey> {
    this.logInfo('Rotating session key', { conversationId });

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

      this.logInfo('Session key rotated successfully', {
        conversationId,
        oldKeyId: currentKey?.id,
        newKeyId: newKey.id,
      });

      return newKey;
    } catch (error) {
      this.logError('Session key rotation failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        conversationId,
      });
      throw error;
    }
  }

  /**
   * Get decryption key from metadata
   */
  async getDecryptionKey(metadata: any, options: EncryptionOptions): Promise<Buffer | null> {
    try {
      // Try to get session key from cache
      if (options.conversationId) {
        const sessionKey = await this.getCachedSessionKey(options.conversationId);
        if (sessionKey) {
          return Buffer.from(sessionKey.key, 'base64');
        }
      }

      // If keyId is 'ephemeral', we can't decrypt
      if (metadata.keyId === 'ephemeral') {
        this.logWarning('Cannot decrypt message with ephemeral key');
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
      this.logError('Failed to get decryption key', {
        error: error instanceof Error ? error.message : 'Unknown error',
        keyId: metadata.keyId,
      });
      return null;
    }
  }

  /**
   * Generate new session key
   */
  private generateSessionKey(conversationId: string, options: EncryptionOptions): SessionKey {
    const keyMaterial = this.keyManagementService.generateRandomKey(32); // 256 bits
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
   */
  private async cacheSessionKey(sessionKey: SessionKey, options: EncryptionOptions): Promise<void> {
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
   */
  private async getCachedSessionKey(conversationId: string): Promise<SessionKey | null> {
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
   */
  private generateSessionKeyId(conversationId: string): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    return `session_${conversationId}_${timestamp}_${random}`;
  }

  /**
   * Sanitize ID for logging
   */
  sanitizeId(id: string): string {
    if (id.length <= 8) return id;
    return `${id.substring(0, 8)}...`;
  }
}
