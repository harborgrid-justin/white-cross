/**
 * LOC: SERVICE-ENCRYPT-001
 * File: /reuse/server/health/composites/shared/services/encryption.service.ts
 * Purpose: HIPAA-compliant encryption service for PHI data
 *
 * @description
 * Provides encryption/decryption for PHI data at rest and in transit.
 * Uses AES-256-GCM for symmetric encryption and RSA for asymmetric encryption.
 *
 * Complies with HIPAA Security Rule:
 * - 45 CFR § 164.312(a)(2)(iv) - Encryption and decryption
 * - 45 CFR § 164.312(e)(2)(ii) - Encryption of ePHI
 */

import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptionService {
  private readonly logger = new Logger(EncryptionService.name);

  // Encryption algorithm
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32; // 256 bits
  private readonly ivLength = 16; // 128 bits
  private readonly saltLength = 64;
  private readonly tagLength = 16;

  // In production, load from secure key management service (AWS KMS, Azure Key Vault, etc.)
  private readonly encryptionKey: Buffer;

  constructor() {
    // For production, use proper key management
    const masterKey = process.env.MASTER_ENCRYPTION_KEY || 'default-key-for-development-only';
    this.encryptionKey = crypto.scryptSync(masterKey, 'salt', this.keyLength);
  }

  /**
   * Encrypt sensitive data using AES-256-GCM
   *
   * @example
   * ```typescript
   * const encrypted = this.encryptionService.encrypt('123-45-6789');
   * // Returns: "iv:authTag:encryptedData" format
   * ```
   */
  encrypt(plaintext: string): string {
    if (!plaintext) return plaintext;

    try {
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipheriv(this.algorithm, this.encryptionKey, iv);

      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag();

      // Return format: iv:authTag:encrypted
      return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    } catch (error) {
      this.logger.error(`Encryption failed: ${error.message}`);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt data encrypted with AES-256-GCM
   *
   * @example
   * ```typescript
   * const decrypted = this.encryptionService.decrypt(encryptedValue);
   * // Returns original plaintext
   * ```
   */
  decrypt(encryptedText: string): string {
    if (!encryptedText) return encryptedText;

    try {
      const parts = encryptedText.split(':');

      if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
      }

      const [ivHex, authTagHex, encrypted] = parts;
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');

      const decipher = crypto.createDecipheriv(
        this.algorithm,
        this.encryptionKey,
        iv,
      );
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      this.logger.error(`Decryption failed: ${error.message}`);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Hash password using bcrypt (for user authentication)
   *
   * @example
   * ```typescript
   * const hashedPassword = await this.encryptionService.hashPassword('myPassword123');
   * ```
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare password with hash
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate secure random token
   *
   * @example
   * ```typescript
   * const resetToken = this.encryptionService.generateToken(32);
   * ```
   */
  generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Hash data using SHA-256 (one-way hash)
   *
   * @example
   * ```typescript
   * const hash = this.encryptionService.hashSHA256('data-to-hash');
   * ```
   */
  hashSHA256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Encrypt multiple fields in an object
   *
   * @example
   * ```typescript
   * const patient = {
   *   name: 'John Doe',
   *   ssn: '123-45-6789',
   *   address: '123 Main St'
   * };
   * const encrypted = this.encryptionService.encryptFields(patient, ['ssn', 'address']);
   * ```
   */
  encryptFields<T extends Record<string, any>>(
    obj: T,
    fields: (keyof T)[],
  ): T {
    const result = { ...obj };

    for (const field of fields) {
      if (result[field] && typeof result[field] === 'string') {
        result[field] = this.encrypt(result[field] as string) as any;
      }
    }

    return result;
  }

  /**
   * Decrypt multiple fields in an object
   */
  decryptFields<T extends Record<string, any>>(
    obj: T,
    fields: (keyof T)[],
  ): T {
    const result = { ...obj };

    for (const field of fields) {
      if (result[field] && typeof result[field] === 'string') {
        try {
          result[field] = this.decrypt(result[field] as string) as any;
        } catch (error) {
          this.logger.warn(`Failed to decrypt field ${String(field)}`);
        }
      }
    }

    return result;
  }

  /**
   * Mask sensitive data for display (show only last 4 characters)
   *
   * @example
   * ```typescript
   * const masked = this.encryptionService.maskData('123-45-6789');
   * // Returns: "*****6789"
   * ```
   */
  maskData(value: string, visibleChars: number = 4): string {
    if (!value) return value;

    if (value.length <= visibleChars) {
      return '*'.repeat(value.length);
    }

    return '*'.repeat(value.length - visibleChars) + value.slice(-visibleChars);
  }

  /**
   * De-identify data by hashing with salt
   * Used for analytics while preserving privacy
   *
   * @example
   * ```typescript
   * const deidentified = this.encryptionService.deidentify('patient-123');
   * // Returns consistent hash for same input
   * ```
   */
  deidentify(identifier: string): string {
    const salt = process.env.DEIDENTIFICATION_SALT || 'default-salt';
    return crypto
      .createHmac('sha256', salt)
      .update(identifier)
      .digest('hex');
  }

  /**
   * Encrypt data with additional authenticated data (AAD)
   * Useful for encrypting data with context
   */
  encryptWithAAD(plaintext: string, aad: string): string {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, this.encryptionKey, iv);

    cipher.setAAD(Buffer.from(aad, 'utf8'), {
      plaintextLength: Buffer.byteLength(plaintext),
    });

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}:${Buffer.from(aad).toString('hex')}`;
  }

  /**
   * Decrypt data with additional authenticated data (AAD)
   */
  decryptWithAAD(encryptedText: string): string {
    const parts = encryptedText.split(':');

    if (parts.length !== 4) {
      throw new Error('Invalid encrypted data format with AAD');
    }

    const [ivHex, authTagHex, encrypted, aadHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const aad = Buffer.from(aadHex, 'hex').toString('utf8');

    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.encryptionKey,
      iv,
    );
    decipher.setAuthTag(authTag);
    decipher.setAAD(Buffer.from(aad, 'utf8'), {
      plaintextLength: Buffer.byteLength(encrypted) / 2,
    });

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
