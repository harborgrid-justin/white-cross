import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

/**
 * EncryptionService
 *
 * Provides AES-256-GCM encryption for PHI (Protected Health Information) data.
 * Implements HIPAA Security Rule §164.312(a)(2)(iv) - Encryption and Decryption.
 *
 * Features:
 * - AES-256-GCM authenticated encryption
 * - Unique IV (initialization vector) for each encryption
 * - Authentication tag for integrity verification
 * - Key derivation from master key using scrypt
 *
 * Security Notes:
 * - Never reuse IVs with the same key
 * - Verify authentication tag on decryption
 * - Store encryption key securely (environment variable, secrets manager)
 * - Implement key rotation strategy
 *
 * @class EncryptionService
 * @Injectable
 */
@Injectable()
export class EncryptionService {
  private readonly logger = new Logger(EncryptionService.name);
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32; // 256 bits
  private readonly ivLength = 16; // 128 bits
  private readonly saltLength = 32;
  private readonly tagLength = 16; // 128 bits
  private encryptionKey: Buffer | null = null;

  constructor(private readonly configService: ConfigService) {
    this.initializeEncryptionKey();
  }

  /**
   * Initialize encryption key from environment variable
   * @private
   */
  private async initializeEncryptionKey(): Promise<void> {
    try {
      const masterKey = this.configService.get<string>('ENCRYPTION_MASTER_KEY');

      if (!masterKey) {
        this.logger.warn(
          'ENCRYPTION_MASTER_KEY not set. Using default key (NOT FOR PRODUCTION!)'
        );
        // Default key for development only - MUST be changed in production
        this.encryptionKey = Buffer.from(
          'dev-encryption-key-change-this-in-production-32bytes'.padEnd(32, '0')
        );
        return;
      }

      // Derive key from master key using scrypt
      const salt = Buffer.from(
        this.configService.get<string>('ENCRYPTION_SALT') ||
        'white-cross-encryption-salt-32b'.padEnd(32, '0')
      );

      const scryptAsync = promisify(scrypt);
      this.encryptionKey = (await scryptAsync(
        masterKey,
        salt,
        this.keyLength
      )) as Buffer;

      this.logger.log('Encryption service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize encryption key:', error);
      throw new Error('Encryption service initialization failed');
    }
  }

  /**
   * Encrypt data using AES-256-GCM
   *
   * @param plaintext - Data to encrypt (string)
   * @returns Encrypted data in format: iv:authTag:ciphertext (base64 encoded)
   * @throws Error if encryption fails or key not initialized
   *
   * @example
   * const encrypted = await encryptionService.encrypt('Patient has diabetes');
   * // Returns: "Kx7f3h2k1m9p8q4r:a2s4d6f8g9h1j3k5:Zx9c8v7b6n5m4l3k2..."
   */
  async encrypt(plaintext: string): Promise<string> {
    if (!plaintext) {
      return '';
    }

    if (!this.encryptionKey) {
      await this.initializeEncryptionKey();
      if (!this.encryptionKey) {
        throw new Error('Encryption key not initialized');
      }
    }

    try {
      // Generate random IV (must be unique for each encryption)
      const iv = randomBytes(this.ivLength);

      // Create cipher
      const cipher = createCipheriv(this.algorithm, this.encryptionKey, iv);

      // Encrypt the plaintext
      let ciphertext = cipher.update(plaintext, 'utf8', 'base64');
      ciphertext += cipher.final('base64');

      // Get authentication tag (for integrity verification)
      const authTag = cipher.getAuthTag();

      // Return format: iv:authTag:ciphertext (all base64 encoded)
      return `${iv.toString('base64')}:${authTag.toString('base64')}:${ciphertext}`;
    } catch (error) {
      this.logger.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt data using AES-256-GCM
   *
   * @param encrypted - Encrypted data in format: iv:authTag:ciphertext
   * @returns Decrypted plaintext string
   * @throws Error if decryption fails, authentication fails, or invalid format
   *
   * @example
   * const decrypted = await encryptionService.decrypt(encryptedData);
   * // Returns: "Patient has diabetes"
   */
  async decrypt(encrypted: string): Promise<string> {
    if (!encrypted) {
      return '';
    }

    if (!this.encryptionKey) {
      await this.initializeEncryptionKey();
      if (!this.encryptionKey) {
        throw new Error('Encryption key not initialized');
      }
    }

    try {
      // Parse the encrypted data format: iv:authTag:ciphertext
      const parts = encrypted.split(':');
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
      }

      const iv = Buffer.from(parts[0], 'base64');
      const authTag = Buffer.from(parts[1], 'base64');
      const ciphertext = parts[2];

      // Validate lengths
      if (iv.length !== this.ivLength) {
        throw new Error('Invalid IV length');
      }
      if (authTag.length !== this.tagLength) {
        throw new Error('Invalid auth tag length');
      }

      // Create decipher
      const decipher = createDecipheriv(this.algorithm, this.encryptionKey, iv);
      decipher.setAuthTag(authTag);

      // Decrypt the ciphertext
      let plaintext = decipher.update(ciphertext, 'base64', 'utf8');
      plaintext += decipher.final('utf8');

      return plaintext;
    } catch (error) {
      this.logger.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data - data may be corrupted or tampered');
    }
  }

  /**
   * Encrypt an object's specified fields
   *
   * @param data - Object containing data to encrypt
   * @param fields - Array of field names to encrypt
   * @returns Object with specified fields encrypted
   *
   * @example
   * const patient = { name: 'John', diagnosis: 'diabetes', age: 45 };
   * const encrypted = await encryptionService.encryptFields(patient, ['diagnosis']);
   * // Returns: { name: 'John', diagnosis: 'encrypted...', age: 45 }
   */
  async encryptFields(
    data: Record<string, any>,
    fields: string[]
  ): Promise<Record<string, any>> {
    const result = { ...data };

    for (const field of fields) {
      if (result[field] && typeof result[field] === 'string') {
        result[field] = await this.encrypt(result[field]);
      }
    }

    return result;
  }

  /**
   * Decrypt an object's specified fields
   *
   * @param data - Object containing encrypted data
   * @param fields - Array of field names to decrypt
   * @returns Object with specified fields decrypted
   *
   * @example
   * const encrypted = { name: 'John', diagnosis: 'encrypted...', age: 45 };
   * const decrypted = await encryptionService.decryptFields(encrypted, ['diagnosis']);
   * // Returns: { name: 'John', diagnosis: 'diabetes', age: 45 }
   */
  async decryptFields(
    data: Record<string, any>,
    fields: string[]
  ): Promise<Record<string, any>> {
    const result = { ...data };

    for (const field of fields) {
      if (result[field] && typeof result[field] === 'string') {
        try {
          result[field] = await this.decrypt(result[field]);
        } catch (error) {
          this.logger.warn(`Failed to decrypt field ${field}, keeping encrypted`);
          // Keep encrypted value if decryption fails
        }
      }
    }

    return result;
  }

  /**
   * Check if data appears to be encrypted
   *
   * @param data - String to check
   * @returns True if data appears to be in encrypted format
   */
  isEncrypted(data: string): boolean {
    if (!data) return false;
    const parts = data.split(':');
    return parts.length === 3 && parts.every(part => part.length > 0);
  }

  /**
   * Generate a random encryption key (for key rotation)
   *
   * @returns Base64-encoded random key of appropriate length
   *
   * @example
   * const newKey = encryptionService.generateKey();
   * console.log('New encryption key:', newKey);
   */
  generateKey(): string {
    return randomBytes(this.keyLength).toString('base64');
  }

  /**
   * Re-encrypt data with a new key (for key rotation)
   *
   * @param encrypted - Currently encrypted data
   * @param oldKey - Old encryption key
   * @param newKey - New encryption key
   * @returns Data re-encrypted with new key
   */
  async reEncrypt(
    encrypted: string,
    oldKey: string,
    newKey: string
  ): Promise<string> {
    // Temporarily use old key to decrypt
    const originalKey = this.encryptionKey;
    this.encryptionKey = Buffer.from(oldKey, 'base64');
    const plaintext = await this.decrypt(encrypted);

    // Use new key to encrypt
    this.encryptionKey = Buffer.from(newKey, 'base64');
    const reEncrypted = await this.encrypt(plaintext);

    // Restore original key
    this.encryptionKey = originalKey;

    return reEncrypted;
  }
}
