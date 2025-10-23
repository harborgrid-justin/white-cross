/**
 * LOC: 56944D7E5D-ENCRYPT
 * WC-GEN-271-B | encryption.ts - Integration Credential Encryption
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - types.ts (local)
 *
 * DOWNSTREAM (imported by):
 *   - configManager.ts
 */

/**
 * WC-GEN-271-B | encryption.ts - Integration Credential Encryption
 * Purpose: Secure encryption and decryption of integration credentials
 * Upstream: ../utils/logger | Dependencies: crypto (Node.js built-in)
 * Downstream: configManager.ts | Called by: Configuration management operations
 * Related: configManager.ts, types.ts
 * Exports: EncryptionService class | Key Services: Credential encryption
 * Last Updated: 2025-10-18 | File Type: .ts
 * Critical Path: Credential storage → Encryption → Database
 * LLM Context: HIPAA-compliant credential encryption for healthcare integrations
 */

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';
import { logger } from '../../utils/logger';
import { CreateIntegrationConfigData } from './types';

/**
 * Service for encrypting and decrypting sensitive integration credentials
 * Ensures HIPAA compliance for credential storage using AES-256-GCM encryption
 */
export class EncryptionService {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly KEY_LENGTH = 32; // 256 bits
  private static readonly IV_LENGTH = 16; // 128 bits
  private static readonly SALT_LENGTH = 32;
  private static readonly TAG_LENGTH = 16;

  /**
   * Get encryption key from environment variables
   * SECURITY: No defaults - fails fast if secrets not configured
   * In production, use secure key management service (AWS KMS, Azure Key Vault, HashiCorp Vault)
   */
  private static getEncryptionKey(): Buffer {
    const secret = process.env.ENCRYPTION_SECRET;
    const salt = process.env.ENCRYPTION_SALT;

    // CRITICAL: Fail immediately if encryption secrets are not configured
    if (!secret || !salt) {
      logger.error('CRITICAL: ENCRYPTION_SECRET and ENCRYPTION_SALT must be set in environment variables');
      throw new Error('Encryption configuration missing - ENCRYPTION_SECRET and ENCRYPTION_SALT are required');
    }

    // Validate secret strength (minimum 32 characters recommended)
    if (secret.length < 32) {
      logger.error('SECURITY WARNING: ENCRYPTION_SECRET should be at least 32 characters');
    }

    if (salt.length < 16) {
      logger.error('SECURITY WARNING: ENCRYPTION_SALT should be at least 16 characters');
    }

    // Derive a key from the secret using scrypt
    return scryptSync(secret, salt, this.KEY_LENGTH);
  }

  /**
   * Encrypt sensitive data before storage
   * Uses AES-256-GCM for authenticated encryption
   *
   * @param data - Integration configuration data containing sensitive fields
   * @returns Object with encrypted credentials
   */
  static encryptSensitiveData(data: CreateIntegrationConfigData): { apiKey?: string; password?: string } {
    return {
      apiKey: data.apiKey ? this.encryptCredential(data.apiKey) : undefined,
      password: data.password ? this.encryptCredential(data.password) : undefined
    };
  }

  /**
   * Encrypt a single credential using AES-256-GCM
   * Format: iv:salt:authTag:encryptedData (all base64 encoded)
   *
   * @param credential - The credential to encrypt
   * @returns Encrypted credential string
   */
  static encryptCredential(credential: string): string {
    try {
      // Generate random IV and salt for this encryption
      const iv = randomBytes(this.IV_LENGTH);
      const salt = randomBytes(this.SALT_LENGTH);
      
      // Get encryption key
      const key = this.getEncryptionKey();
      
      // Create cipher
      const cipher = createCipheriv(this.ALGORITHM, key, iv);
      
      // Encrypt the credential
      let encrypted = cipher.update(credential, 'utf8', 'base64');
      encrypted += cipher.final('base64');
      
      // Get authentication tag
      const authTag = cipher.getAuthTag();
      
      // Combine iv:salt:authTag:encryptedData
      const combined = `${iv.toString('base64')}:${salt.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
      
      logger.debug('Credential encrypted successfully');
      return combined;
    } catch (error) {
      logger.error('Failed to encrypt credential', error);
      throw new Error('Encryption failed');
    }
  }

  /**
   * Decrypt a credential for use
   * Expects format: iv:salt:authTag:encryptedData (all base64 encoded)
   *
   * @param encryptedCredential - The encrypted credential
   * @returns Decrypted credential string
   */
  static decryptCredential(encryptedCredential: string): string {
    try {
      // Parse the encrypted credential
      const parts = encryptedCredential.split(':');
      
      if (parts.length !== 4) {
        throw new Error('Invalid encrypted credential format');
      }
      
      const iv = Buffer.from(parts[0], 'base64');
      const salt = Buffer.from(parts[1], 'base64');
      const authTag = Buffer.from(parts[2], 'base64');
      const encrypted = parts[3];
      
      // Get decryption key
      const key = this.getEncryptionKey();
      
      // Create decipher
      const decipher = createDecipheriv(this.ALGORITHM, key, iv);
      decipher.setAuthTag(authTag);
      
      // Decrypt the credential
      let decrypted = decipher.update(encrypted, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      
      logger.debug('Credential decrypted successfully');
      return decrypted;
    } catch (error) {
      logger.error('Failed to decrypt credential', error);
      throw new Error('Decryption failed');
    }
  }

  /**
   * Validate that a credential is properly encrypted
   * 
   * @param credential - The credential to validate
   * @returns True if credential appears to be encrypted
   */
  static isEncrypted(credential: string): boolean {
    const parts = credential.split(':');
    return parts.length === 4;
  }

  /**
   * Rotate encryption key for all credentials
   * This should be called periodically as part of security best practices
   * 
   * @param oldSecret - The old encryption secret
   * @param newSecret - The new encryption secret
   * @param encryptedValue - The encrypted value to re-encrypt
   * @returns Re-encrypted value with new key
   */
  static rotateKey(oldSecret: string, newSecret: string, encryptedValue: string): string {
    // Temporarily set old secret
    const originalSecret = process.env.ENCRYPTION_SECRET;
    process.env.ENCRYPTION_SECRET = oldSecret;
    
    try {
      // Decrypt with old key
      const decrypted = this.decryptCredential(encryptedValue);
      
      // Set new secret
      process.env.ENCRYPTION_SECRET = newSecret;
      
      // Encrypt with new key
      const reencrypted = this.encryptCredential(decrypted);
      
      logger.info('Key rotation completed successfully');
      return reencrypted;
    } finally {
      // Restore original secret
      process.env.ENCRYPTION_SECRET = originalSecret;
    }
  }
}
