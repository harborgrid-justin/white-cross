/**
 * LOC: ENCMGMT001
 * File: /reuse/document/composites/downstream/encryption-management-modules.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - crypto (Node.js built-in)
 *   - ../document-security-encryption-composite
 *
 * DOWNSTREAM (imported by):
 *   - Document security services
 *   - Key management controllers
 *   - Encryption operations
 */

import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * Key rotation policies
 */
export enum KeyRotationPolicy {
  QUARTERLY = 'QUARTERLY',
  SEMI_ANNUAL = 'SEMI_ANNUAL',
  ANNUAL = 'ANNUAL',
  ON_DEMAND = 'ON_DEMAND',
  COMPROMISE_DETECTED = 'COMPROMISE_DETECTED',
}

/**
 * Encryption algorithm types
 */
export enum EncryptionAlgorithmType {
  AES_256_GCM = 'aes-256-gcm',
  AES_192_GCM = 'aes-192-gcm',
  AES_128_GCM = 'aes-128-gcm',
  AES_256_CBC = 'aes-256-cbc',
  CHACHA20 = 'chacha20-poly1305',
}

/**
 * Key metadata
 */
export interface KeyMetadata {
  keyId: string;
  algorithm: EncryptionAlgorithmType;
  keySize: number;
  createdAt: Date;
  rotatedAt?: Date;
  expiresAt?: Date;
  status: 'ACTIVE' | 'ROTATED' | 'EXPIRED' | 'COMPROMISED';
  purpose: 'DOCUMENT_ENCRYPTION' | 'KEY_ENCRYPTION' | 'SIGNING';
  usageCount: number;
  lastUsedAt?: Date;
}

/**
 * Encryption key pair
 */
export interface EncryptionKeyPair {
  publicKey: string;
  privateKey: string;
  keyId: string;
  algorithm: string;
  createdAt: Date;
}

/**
 * Key rotation record
 */
export interface KeyRotationRecord {
  rotationId: string;
  oldKeyId: string;
  newKeyId: string;
  policy: KeyRotationPolicy;
  reason: string;
  rotatedAt: Date;
  completedAt?: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
}

/**
 * Encryption key manager service
 * Manages encryption keys, rotation, storage, and lifecycle
 */
@Injectable()
export class EncryptionManagementModule {
  private readonly logger = new Logger(EncryptionManagementModule.name);
  private keys: Map<string, { material: Buffer; metadata: KeyMetadata }> = new Map();
  private rotationRecords: KeyRotationRecord[] = [];
  private keyHistory: KeyMetadata[] = [];

  /**
   * Generates new encryption key with specified parameters
   * @param algorithm - Encryption algorithm
   * @param keySize - Key size in bits
   * @param purpose - Key purpose
   * @returns Generated key with metadata
   */
  async generateEncryptionKey(
    algorithm: EncryptionAlgorithmType,
    keySize: number,
    purpose: 'DOCUMENT_ENCRYPTION' | 'KEY_ENCRYPTION' | 'SIGNING'
  ): Promise<KeyMetadata> {
    try {
      const keyId = crypto.randomUUID();
      const keyMaterial = crypto.randomBytes(keySize / 8);

      const metadata: KeyMetadata = {
        keyId,
        algorithm,
        keySize,
        createdAt: new Date(),
        status: 'ACTIVE',
        purpose,
        usageCount: 0
      };

      this.keys.set(keyId, { material: keyMaterial, metadata });
      this.keyHistory.push(metadata);

      this.logger.log(`Encryption key generated: ${keyId}`);
      return metadata;
    } catch (error) {
      this.logger.error(`Key generation failed: ${error.message}`);
      throw new BadRequestException('Failed to generate encryption key');
    }
  }

  /**
   * Generates RSA key pair for asymmetric encryption
   * @param keySize - Key size in bits (2048 or 4096)
   * @param purpose - Key purpose
   * @returns Generated RSA key pair
   */
  async generateRSAKeyPair(
    keySize: number = 4096,
    purpose: 'KEY_ENCRYPTION' | 'SIGNING' = 'KEY_ENCRYPTION'
  ): Promise<EncryptionKeyPair> {
    try {
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: keySize,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
      });

      const keyId = crypto.randomUUID();
      const keyPair: EncryptionKeyPair = {
        publicKey: publicKey.toString(),
        privateKey: privateKey.toString(),
        keyId,
        algorithm: `RSA-${keySize}`,
        createdAt: new Date()
      };

      // Store public key metadata
      const metadata: KeyMetadata = {
        keyId,
        algorithm: EncryptionAlgorithmType.AES_256_GCM,
        keySize,
        createdAt: new Date(),
        status: 'ACTIVE',
        purpose,
        usageCount: 0
      };

      this.keyHistory.push(metadata);
      this.logger.log(`RSA key pair generated: ${keyId}`);

      return keyPair;
    } catch (error) {
      this.logger.error(`RSA key generation failed: ${error.message}`);
      throw new BadRequestException('Failed to generate RSA key pair');
    }
  }

  /**
   * Rotates encryption key according to policy
   * @param oldKeyId - Key to rotate
   * @param policy - Rotation policy
   * @param reason - Rotation reason
   * @returns Rotation record
   */
  async rotateEncryptionKey(
    oldKeyId: string,
    policy: KeyRotationPolicy,
    reason: string
  ): Promise<KeyRotationRecord> {
    try {
      const oldKey = this.keys.get(oldKeyId);
      if (!oldKey) {
        throw new BadRequestException('Key not found');
      }

      // Generate new key
      const newKeyMetadata = await this.generateEncryptionKey(
        oldKey.metadata.algorithm,
        oldKey.metadata.keySize,
        oldKey.metadata.purpose
      );

      // Mark old key as rotated
      oldKey.metadata.status = 'ROTATED';
      oldKey.metadata.rotatedAt = new Date();

      const rotationRecord: KeyRotationRecord = {
        rotationId: crypto.randomUUID(),
        oldKeyId,
        newKeyId: newKeyMetadata.keyId,
        policy,
        reason,
        rotatedAt: new Date(),
        status: 'COMPLETED'
      };

      this.rotationRecords.push(rotationRecord);
      this.logger.log(`Key rotated: ${oldKeyId} -> ${newKeyMetadata.keyId}`);

      return rotationRecord;
    } catch (error) {
      this.logger.error(`Key rotation failed: ${error.message}`);
      throw new BadRequestException('Failed to rotate encryption key');
    }
  }

  /**
   * Derives encryption key from password using PBKDF2
   * @param password - Password to derive from
   * @param saltHex - Salt in hex format
   * @param iterations - PBKDF2 iterations
   * @param keyLength - Desired key length in bytes
   * @returns Derived key in hex format
   */
  async deriveKeyFromPassword(
    password: string,
    saltHex: string,
    iterations: number = 100000,
    keyLength: number = 32
  ): Promise<string> {
    try {
      const salt = Buffer.from(saltHex, 'hex');
      const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, keyLength, 'sha512');
      return derivedKey.toString('hex');
    } catch (error) {
      this.logger.error(`Key derivation failed: ${error.message}`);
      throw new BadRequestException('Failed to derive encryption key from password');
    }
  }

  /**
   * Encrypts key material for storage
   * @param keyMaterial - Key material to encrypt
   * @param masterKey - Master key for encryption
   * @returns Encrypted key with metadata
   */
  async encryptKeyMaterial(
    keyMaterial: Buffer,
    masterKey: Buffer
  ): Promise<{ encrypted: Buffer; iv: string; authTag: string }> {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-gcm', masterKey, iv);

      const encrypted = Buffer.concat([cipher.update(keyMaterial), cipher.final()]);
      const authTag = cipher.getAuthTag();

      return {
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
      };
    } catch (error) {
      this.logger.error(`Key encryption failed: ${error.message}`);
      throw new BadRequestException('Failed to encrypt key material');
    }
  }

  /**
   * Decrypts encrypted key material
   * @param encryptedKey - Encrypted key material
   * @param masterKey - Master key for decryption
   * @param ivHex - Initialization vector
   * @param authTagHex - Authentication tag
   * @returns Decrypted key material
   */
  async decryptKeyMaterial(
    encryptedKey: Buffer,
    masterKey: Buffer,
    ivHex: string,
    authTagHex: string
  ): Promise<Buffer> {
    try {
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');

      const decipher = crypto.createDecipheriv('aes-256-gcm', masterKey, iv);
      decipher.setAuthTag(authTag);

      return Buffer.concat([decipher.update(encryptedKey), decipher.final()]);
    } catch (error) {
      this.logger.error(`Key decryption failed: ${error.message}`);
      throw new BadRequestException('Failed to decrypt key material');
    }
  }

  /**
   * Gets active key for algorithm
   * @param algorithm - Encryption algorithm
   * @param purpose - Key purpose
   * @returns Active key metadata
   */
  async getActiveKey(
    algorithm: EncryptionAlgorithmType,
    purpose: 'DOCUMENT_ENCRYPTION' | 'KEY_ENCRYPTION' | 'SIGNING'
  ): Promise<KeyMetadata | null> {
    const activeKeys = Array.from(this.keys.values())
      .filter(k => k.metadata.algorithm === algorithm &&
                   k.metadata.purpose === purpose &&
                   k.metadata.status === 'ACTIVE')
      .sort((a, b) => b.metadata.createdAt.getTime() - a.metadata.createdAt.getTime());

    return activeKeys.length > 0 ? activeKeys[0].metadata : null;
  }

  /**
   * Retrieves key metadata
   * @param keyId - Key identifier
   * @returns Key metadata
   */
  async getKeyMetadata(keyId: string): Promise<KeyMetadata | null> {
    const key = this.keys.get(keyId);
    return key ? key.metadata : null;
  }

  /**
   * Records key usage for audit tracking
   * @param keyId - Key identifier
   * @param operation - Operation performed
   */
  async recordKeyUsage(keyId: string, operation: string): Promise<void> {
    const key = this.keys.get(keyId);
    if (key) {
      key.metadata.usageCount++;
      key.metadata.lastUsedAt = new Date();
      this.logger.debug(`Key usage recorded: ${keyId} - ${operation}`);
    }
  }

  /**
   * Marks key as compromised
   * @param keyId - Key identifier
   * @param reason - Compromise reason
   */
  async markKeyCompromised(keyId: string, reason: string): Promise<void> {
    const key = this.keys.get(keyId);
    if (key) {
      key.metadata.status = 'COMPROMISED';
      this.logger.warn(`Key marked as compromised: ${keyId} - ${reason}`);

      // Trigger emergency key rotation
      await this.rotateEncryptionKey(keyId, KeyRotationPolicy.COMPROMISE_DETECTED, reason);
    }
  }

  /**
   * Gets all rotation records
   * @param filters - Filter criteria
   * @returns Rotation records
   */
  async getRotationRecords(filters?: {
    keyId?: string;
    policy?: KeyRotationPolicy;
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  }): Promise<KeyRotationRecord[]> {
    let records = [...this.rotationRecords];

    if (filters?.keyId) {
      records = records.filter(r => r.oldKeyId === filters.keyId || r.newKeyId === filters.keyId);
    }
    if (filters?.policy) {
      records = records.filter(r => r.policy === filters.policy);
    }
    if (filters?.status) {
      records = records.filter(r => r.status === filters.status);
    }

    return records;
  }

  /**
   * Exports key material securely
   * @param keyId - Key identifier
   * @param exportKey - Master key for wrapping export
   * @returns Encrypted key export
   */
  async exportKeyMaterial(keyId: string, exportKey: Buffer): Promise<{
    keyId: string;
    encrypted: string;
    iv: string;
    authTag: string;
    algorithm: string;
  }> {
    const key = this.keys.get(keyId);
    if (!key) {
      throw new BadRequestException('Key not found');
    }

    const { encrypted, iv, authTag } = await this.encryptKeyMaterial(key.material, exportKey);

    return {
      keyId,
      encrypted: encrypted.toString('hex'),
      iv,
      authTag,
      algorithm: key.metadata.algorithm
    };
  }

  /**
   * Validates key strength and compliance
   * @param keyId - Key identifier
   * @returns Validation result
   */
  async validateKeyStrength(keyId: string): Promise<{
    valid: boolean;
    keySize: number;
    algorithm: string;
    issues: string[];
  }> {
    const key = this.keys.get(keyId);
    if (!key) {
      throw new BadRequestException('Key not found');
    }

    const issues: string[] = [];

    // Check key size compliance
    if (key.metadata.keySize < 256) {
      issues.push('Key size below recommended 256 bits');
    }

    // Check age
    const keyAge = Date.now() - key.metadata.createdAt.getTime();
    const oneYearMs = 365 * 24 * 60 * 60 * 1000;
    if (keyAge > oneYearMs) {
      issues.push('Key has not been rotated in over one year');
    }

    return {
      valid: issues.length === 0,
      keySize: key.metadata.keySize,
      algorithm: key.metadata.algorithm,
      issues
    };
  }

  /**
   * Clears key material from memory (secure deletion)
   * @param keyId - Key identifier
   */
  async secureDeleteKey(keyId: string): Promise<void> {
    const key = this.keys.get(keyId);
    if (key) {
      // Overwrite with zeros
      key.material.fill(0);
      this.keys.delete(keyId);
      this.logger.log(`Key securely deleted: ${keyId}`);
    }
  }

  /**
   * Gets key usage statistics
   * @returns Key usage statistics
   */
  async getKeyUsageStatistics(): Promise<{
    totalKeys: number;
    activeKeys: number;
    rotatedKeys: number;
    totalUsage: number;
    averageKeyAge: number;
  }> {
    const allKeys = Array.from(this.keys.values());
    const activeKeys = allKeys.filter(k => k.metadata.status === 'ACTIVE');
    const rotatedKeys = allKeys.filter(k => k.metadata.status === 'ROTATED');
    const totalUsage = allKeys.reduce((sum, k) => sum + k.metadata.usageCount, 0);

    const avgAge = allKeys.length > 0
      ? allKeys.reduce((sum, k) => sum + (Date.now() - k.metadata.createdAt.getTime()), 0) / allKeys.length
      : 0;

    return {
      totalKeys: allKeys.length,
      activeKeys: activeKeys.length,
      rotatedKeys: rotatedKeys.length,
      totalUsage,
      averageKeyAge: Math.floor(avgAge / (24 * 60 * 60 * 1000))
    };
  }
}

export default EncryptionManagementModule;
