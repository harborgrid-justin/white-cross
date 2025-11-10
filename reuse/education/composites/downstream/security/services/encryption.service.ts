/**
 * Encryption Service
 * Provides data encryption and decryption for sensitive information
 *
 * SECURITY FEATURES:
 * - AES-256-GCM encryption
 * - Secure key derivation with scrypt
 * - Random IV generation
 * - Authentication tags for integrity
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptionService {
  private readonly logger = new Logger(EncryptionService.name);
  private readonly algorithm = 'aes-256-gcm';
  private readonly encryptionKey: Buffer;
  private readonly keyLength = 32; // 256 bits

  constructor(private readonly configService: ConfigService) {
    const key = this.configService.get<string>('ENCRYPTION_KEY') || 'development-encryption-key';
    this.encryptionKey = crypto.scryptSync(key, 'salt', this.keyLength);
  }

  /**
   * Encrypts text using AES-256-GCM
   * @param text Plain text to encrypt
   * @returns Encrypted text (IV:AuthTag:EncryptedData)
   */
  encrypt(text: string): string {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(this.algorithm, this.encryptionKey, iv);

      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag();

      // Return IV + AuthTag + Encrypted data
      return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    } catch (error) {
      this.logger.error(`Encryption error: ${error.message}`);
      throw new Error('Encryption failed');
    }
  }

  /**
   * Decrypts text encrypted with AES-256-GCM
   * @param encryptedText Encrypted text (IV:AuthTag:EncryptedData)
   * @returns Decrypted plain text
   */
  decrypt(encryptedText: string): string {
    try {
      const parts = encryptedText.split(':');

      if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
      }

      const [ivHex, authTagHex, encrypted] = parts;
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');

      const decipher = crypto.createDecipheriv(this.algorithm, this.encryptionKey, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      this.logger.error(`Decryption error: ${error.message}`);
      throw new Error('Decryption failed');
    }
  }

  /**
   * Hashes password using bcrypt
   * @param password Plain text password
   * @returns Hashed password
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compares password with hash
   * @param password Plain text password
   * @param hash Password hash
   * @returns true if password matches hash
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generates cryptographically secure random token
   * @param length Token length in bytes
   * @returns Hex-encoded random token
   */
  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Hashes data using SHA-256
   * @param data Data to hash
   * @returns SHA-256 hash
   */
  hashSHA256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Encrypts sensitive fields in an object
   * @param obj Object with sensitive fields
   * @param fieldsToEncrypt Array of field names to encrypt
   * @returns Object with encrypted fields
   */
  encryptFields(obj: any, fieldsToEncrypt: string[]): any {
    const encrypted = { ...obj };

    for (const field of fieldsToEncrypt) {
      if (encrypted[field]) {
        encrypted[field] = this.encrypt(String(encrypted[field]));
      }
    }

    return encrypted;
  }

  /**
   * Decrypts sensitive fields in an object
   * @param obj Object with encrypted fields
   * @param fieldsToDecrypt Array of field names to decrypt
   * @returns Object with decrypted fields
   */
  decryptFields(obj: any, fieldsToDecrypt: string[]): any {
    const decrypted = { ...obj };

    for (const field of fieldsToDecrypt) {
      if (decrypted[field]) {
        try {
          decrypted[field] = this.decrypt(String(decrypted[field]));
        } catch (error) {
          this.logger.warn(`Failed to decrypt field ${field}: ${error.message}`);
        }
      }
    }

    return decrypted;
  }

  /**
   * Masks sensitive data for logging
   * @param value Value to mask
   * @returns Masked value
   */
  maskSensitiveData(value: string): string {
    if (!value || value.length <= 4) {
      return '****';
    }
    return '*'.repeat(value.length - 4) + value.slice(-4);
  }
}

export default EncryptionService;
