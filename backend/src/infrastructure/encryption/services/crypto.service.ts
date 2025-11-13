/**
 * @fileoverview Crypto Service
 * @module infrastructure/encryption/services
 * @description Core cryptographic operations for AES-256-GCM encryption/decryption
 */

import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from "../../common/base";
import { LoggerService } from '../../shared/logging/logger.service';
import * as crypto from 'crypto';
import { EncryptionAlgorithm, EncryptionMetadata, EncryptionOptions, EncryptionResult, DecryptionResult, EncryptionStatus } from '../types/encryption.types';
import { KeyManagementService } from '../key-management.service';

@Injectable()
export class CryptoService extends BaseService {
  private readonly ALGORITHM = 'aes-256-gcm';
  private readonly KEY_LENGTH = 32; // 256 bits
  private readonly IV_LENGTH = 16; // 128 bits
  private readonly AUTH_TAG_LENGTH = 16; // 128 bits
  private readonly VERSION = '1.0.0';

  constructor(
    @Inject(LoggerService) logger: LoggerService,
    private readonly keyManagementService: KeyManagementService
  ) {
    super({
      serviceName: 'CryptoService',
      logger,
      enableAuditLogging: true,
    });
  }

  /**
   * Encrypt data using AES-256-GCM
   */
  async encrypt(data: string, encryptionKey: Buffer, options: EncryptionOptions = {}): Promise<EncryptionResult> {
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
        keyId: options.keyId || 'ephemeral',
        timestamp: Date.now(),
        version: this.VERSION,
      };

      const duration = Date.now() - startTime;
      this.logDebug(`Encryption completed in ${duration}ms`, {
        keyId: metadata.keyId,
        dataLength: data.length,
      });

      return {
        success: true,
        data: encrypted,
        metadata,
      };
    } catch (error) {
      this.logError('Encryption failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        keyId: options.keyId,
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
   */
  async decrypt(encryptedData: string, metadata: EncryptionMetadata, decryptionKey: Buffer, options: EncryptionOptions = {}): Promise<DecryptionResult> {
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
        this.logWarning('Version mismatch detected', {
          expected: this.VERSION,
          received: metadata.version,
        });
      }

      // Parse metadata
      const iv = Buffer.from(metadata.iv, 'base64');
      const authTag = Buffer.from(metadata.authTag, 'base64');

      // Create decipher
      const decipher = crypto.createDecipheriv(this.ALGORITHM, decryptionKey, iv);

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
      this.logDebug(`Decryption completed in ${duration}ms`, {
        keyId: metadata.keyId,
      });

      return {
        success: true,
        data: decrypted,
        metadata,
      };
    } catch (error) {
      this.logError('Decryption failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
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
   * Generate a random encryption key
   */
  generateEncryptionKey(): Buffer {
    return this.keyManagementService.generateRandomKey(this.KEY_LENGTH);
  }

  /**
   * Get algorithm constants
   */
  getAlgorithmConstants() {
    return {
      algorithm: this.ALGORITHM,
      keyLength: this.KEY_LENGTH,
      ivLength: this.IV_LENGTH,
      authTagLength: this.AUTH_TAG_LENGTH,
      version: this.VERSION,
    };
  }
}
