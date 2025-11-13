/**
 * @fileoverview Message Encryption Service
 * @module infrastructure/encryption/services
 * @description Service for encrypting and decrypting complete messages
 */

import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '../../shared/base/BaseService';
import { LoggerService } from '../../shared/logging/logger.service';
import { EncryptedMessage, DecryptionResult, EncryptionOptions } from '../types/encryption.types';
import { CryptoService } from './crypto.service';
import { SessionKeyManagerService } from './session-key-manager.service';

@Injectable()
export class MessageEncryptionService extends BaseService {
  constructor(
    @Inject(LoggerService) logger: LoggerService,
    private readonly cryptoService: CryptoService,
    private readonly sessionKeyManager: SessionKeyManagerService,
  ) {
    super({
      serviceName: 'MessageEncryptionService',
      logger,
      enableAuditLogging: true,
    });
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
    try {
      // Get or create session key
      const sessionKey = await this.sessionKeyManager.getSessionKey(conversationId);

      // Encrypt the message content
      const result = await this.cryptoService.encrypt(
        message,
        Buffer.from(sessionKey.key, 'base64'),
        {
          conversationId,
          aad: `${senderId}:${conversationId}`,
          keyId: sessionKey.id,
        },
      );

      if (!result.success) {
        throw new Error(result.message);
      }

      const encryptedMessage: EncryptedMessage = {
        encryptedContent: result.data!,
        metadata: result.metadata!,
        senderId,
        recipientIds,
        conversationId,
        isEncrypted: true,
      };

      this.logInfo('Message encrypted successfully', {
        conversationId,
        recipientCount: recipientIds.length,
      });

      return encryptedMessage;
    } catch (error) {
      this.logError('Message encryption failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        conversationId,
      });

      // Return unencrypted message on failure (graceful degradation)
      return {
        encryptedContent: message,
        metadata: {
          algorithm: 'aes-256-gcm' as any,
          iv: '',
          authTag: '',
          keyId: 'failed',
          timestamp: Date.now(),
          version: '1.0.0',
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
   */
  async decryptMessage(
    encryptedMessage: EncryptedMessage,
    recipientId: string,
  ): Promise<DecryptionResult> {
    try {
      // Check if message is actually encrypted
      if (!encryptedMessage.isEncrypted) {
        this.logDebug('Message is not encrypted, returning as-is');
        return {
          success: true,
          data: encryptedMessage.encryptedContent,
          metadata: encryptedMessage.metadata,
        };
      }

      // Verify recipient is authorized
      if (!encryptedMessage.recipientIds.includes(recipientId)) {
        this.logWarning('Unauthorized decryption attempt', {
          recipientId: this.sessionKeyManager.sanitizeId(recipientId),
          conversationId: encryptedMessage.conversationId,
        });

        return {
          success: false,
          error: 'unauthorized' as any,
          message: 'Unauthorized to decrypt this message',
        };
      }

      // Get decryption key
      const decryptionKey = await this.sessionKeyManager.getDecryptionKey(
        encryptedMessage.metadata,
        { conversationId: encryptedMessage.conversationId },
      );

      if (!decryptionKey) {
        return {
          success: false,
          error: 'key_not_found' as any,
          message: 'Decryption key not found',
        };
      }

      // Decrypt message content
      const result = await this.cryptoService.decrypt(
        encryptedMessage.encryptedContent,
        encryptedMessage.metadata,
        decryptionKey,
        {
          conversationId: encryptedMessage.conversationId,
          aad: `${encryptedMessage.senderId}:${encryptedMessage.conversationId}`,
        },
      );

      if (result.success) {
        this.logDebug('Message decrypted successfully', {
          conversationId: encryptedMessage.conversationId,
        });
      }

      return result;
    } catch (error) {
      this.logError('Message decryption failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        conversationId: encryptedMessage.conversationId,
      });

      return {
        success: false,
        error: 'decryption_error' as any,
        message: 'Failed to decrypt message',
      };
    }
  }

  /**
   * Rotate session key for a conversation
   */
  async rotateSessionKey(conversationId: string): Promise<void> {
    await this.sessionKeyManager.rotateSessionKey(conversationId);
  }
}
