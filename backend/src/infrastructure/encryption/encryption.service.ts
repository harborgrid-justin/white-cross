/**
 * @fileoverview Encryption Service
 * @module infrastructure/encryption
 * @description Main service orchestrating all encryption functionality
 */

import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { ConfigService } from '@nestjs/config';
import {
  EncryptionResult,
  DecryptionResult,
  EncryptedMessage,
  SessionKey,
  EncryptionOptions,
  EncryptionConfig,
  IEncryptionService,
} from './types/encryption.types';
import { CryptoService } from './services/crypto.service';
import { SessionKeyManagerService } from './services/session-key-manager.service';
import { MessageEncryptionService } from './services/message-encryption.service';

import { BaseService } from '@/common/base';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
@Injectable()
export class EncryptionService implements IEncryptionService {
  private readonly config: EncryptionConfig;

  constructor(
    @Inject(LoggerService) logger: LoggerService,
    private readonly configService: ConfigService,
    private readonly cryptoService: CryptoService,
    private readonly sessionKeyManager: SessionKeyManagerService,
    private readonly messageEncryption: MessageEncryptionService,
  ) {
    super({
      serviceName: 'EncryptionService',
      logger,
      enableAuditLogging: true,
    });

    this.config = {
      algorithm: 'aes-256-gcm' as any,
      rsaKeySize: 4096,
      sessionKeyTTL: 24 * 60 * 60,
      enableKeyRotation: true,
      keyRotationInterval: 7 * 24 * 60 * 60,
      version: '1.0.0',
      enabled: this.configService.get<boolean>('ENCRYPTION_ENABLED', true),
  };

    this.logInfo('Encryption service initialized', {
      enabled: this.config.enabled,
      version: this.config.version,
      algorithm: this.config.algorithm,
    });
  }

  /**
   * Encrypt data using AES-256-GCM
   */
  async encrypt(data: string, options: EncryptionOptions = {}): Promise<EncryptionResult> {
    try {
      // Check if encryption is enabled
      if (!this.isEncryptionEnabled()) {
        this.logWarning('Encryption is disabled, returning unencrypted data');
        return {
          success: false,
          error: 'failed' as any,
          message: 'Encryption is disabled',
        };
      }

      // Get or create session key
      const sessionKey = options.conversationId
        ? await this.sessionKeyManager.getSessionKey(options.conversationId, options)
        : null;

      const encryptionKey = sessionKey
        ? Buffer.from(sessionKey.key, 'base64')
        : this.cryptoService.generateEncryptionKey();

      return this.cryptoService.encrypt(data, encryptionKey, options);
    } catch (error) {
      this.logError('Encryption failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        conversationId: options.conversationId,
      });

      return {
        success: false,
        error: 'failed' as any,
        message: 'Encryption operation failed',
      };
    }
  }

  /**
   * Decrypt data using AES-256-GCM
   */
  async decrypt(
    encryptedData: string,
    metadata: any,
    options: EncryptionOptions = {},
  ): Promise<DecryptionResult> {
    try {
      // Get decryption key
      const decryptionKey = await this.sessionKeyManager.getDecryptionKey(metadata, options);
      if (!decryptionKey) {
        return {
          success: false,
          error: 'key_not_found' as any,
          message: 'Decryption key not found',
        };
      }

      return this.cryptoService.decrypt(encryptedData, metadata, decryptionKey, options);
    } catch (error) {
      this.logError('Decryption failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        keyId: metadata?.keyId,
      });

      return {
        success: false,
        error: 'decryption_error' as any,
        message: 'Decryption operation failed',
      };
    }
  }

  /**
   * Encrypt a complete message
   */
  async encryptMessage(
    message: string,
    senderId: string,
    recipientIds: string[],
    conversationId: string,
  ): Promise<EncryptedMessage> {
    return this.messageEncryption.encryptMessage(message, senderId, recipientIds, conversationId);
  }

  /**
   * Decrypt a complete message
   */
  async decryptMessage(
    encryptedMessage: EncryptedMessage,
    recipientId: string,
  ): Promise<DecryptionResult> {
    return this.messageEncryption.decryptMessage(encryptedMessage, recipientId);
  }

  /**
   * Get or create session key for a conversation
   */
  async getSessionKey(conversationId: string, options: EncryptionOptions = {}): Promise<SessionKey> {
    return this.sessionKeyManager.getSessionKey(conversationId, options);
  }

  /**
   * Rotate session key for a conversation
   */
  async rotateSessionKey(conversationId: string): Promise<SessionKey> {
    return this.sessionKeyManager.rotateSessionKey(conversationId);
  }

  /**
   * Check if encryption is enabled
   */
  isEncryptionEnabled(): boolean {
    return this.config.enabled;
  }
}
