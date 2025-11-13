import { Injectable, Logger } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';
import { ConfigService } from '@nestjs/config';

import { BaseService } from '@/common/base';
@Injectable()
export class IntegrationEncryptionService extends BaseService {
  private readonly ALGORITHM = 'aes-256-gcm';
  private readonly KEY_LENGTH = 32; // 256 bits
  private readonly IV_LENGTH = 16; // 128 bits
  private readonly SALT_LENGTH = 32;

  constructor(private configService: ConfigService) {}

  /**
   * Get encryption key from environment variables
   */
  private getEncryptionKey(): Buffer {
    const secret = this.configService.get<string>('ENCRYPTION_SECRET');
    const salt = this.configService.get<string>('ENCRYPTION_SALT');

    if (!secret || !salt) {
      this.logError(
        'CRITICAL: ENCRYPTION_SECRET and ENCRYPTION_SALT must be set',
      );
      throw new Error(
        'Encryption configuration missing - ENCRYPTION_SECRET and ENCRYPTION_SALT are required',
      );
    }

    if (secret.length < 32) {
      this.logWarning(
        'SECURITY WARNING: ENCRYPTION_SECRET should be at least 32 characters',
      );
    }

    if (salt.length < 16) {
      this.logWarning(
        'SECURITY WARNING: ENCRYPTION_SALT should be at least 16 characters',
      );
    }

    return scryptSync(secret, salt, this.KEY_LENGTH);
  }

  /**
   * Encrypt sensitive data before storage
   */
  encryptSensitiveData(data: { apiKey?: string; password?: string }): {
    apiKey?: string;
    password?: string;
  } {
    return {
      apiKey: data.apiKey ? this.encryptCredential(data.apiKey) : undefined,
      password: data.password
        ? this.encryptCredential(data.password)
        : undefined,
    };
  }

  /**
   * Encrypt a single credential using AES-256-GCM
   */
  encryptCredential(credential: string): string {
    try {
      const iv = randomBytes(this.IV_LENGTH);
      const salt = randomBytes(this.SALT_LENGTH);
      const key = this.getEncryptionKey();
      const cipher = createCipheriv(this.ALGORITHM, key, iv);

      let encrypted = cipher.update(credential, 'utf8', 'base64');
      encrypted += cipher.final('base64');

      const authTag = cipher.getAuthTag();
      const combined = `${iv.toString('base64')}:${salt.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;

      this.logDebug('Credential encrypted successfully');
      return combined;
    } catch (error) {
      this.logError('Failed to encrypt credential', error);
      throw new Error('Encryption failed');
    }
  }

  /**
   * Decrypt a credential for use
   */
  decryptCredential(encryptedCredential: string): string {
    try {
      const parts = encryptedCredential.split(':');

      if (parts.length !== 4 || !parts[0] || !parts[2] || !parts[3]) {
        throw new Error('Invalid encrypted credential format');
      }

      const iv = Buffer.from(parts[0], 'base64');
      const authTag = Buffer.from(parts[2], 'base64');
      const encrypted = parts[3];
      const key = this.getEncryptionKey();

      const decipher = createDecipheriv(this.ALGORITHM, key, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encrypted, 'base64', 'utf8');
      decrypted += decipher.final('utf8');

      this.logDebug('Credential decrypted successfully');
      return decrypted;
    } catch (error) {
      this.logError('Failed to decrypt credential', error);
      throw new Error('Decryption failed');
    }
  }

  /**
   * Validate that a credential is properly encrypted
   */
  isEncrypted(credential: string): boolean {
    const parts = credential.split(':');
    return parts.length === 4;
  }
}
