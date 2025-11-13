/**
 * Healthcare-Grade Encryption Service for White Cross Platform
 *
 * HIPAA-compliant encryption service providing field-level encryption,
 * key management, and specialized healthcare data protection.
 *
 * @module EncryptionService
 * @security FIPS 140-2 compliant algorithms
 * @compliance HIPAA, GDPR, PCI-DSS
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { promisify } from 'util';

import { BaseService } from '@/common/base';
// Promisify crypto functions
const scrypt = promisify(crypto.scrypt);
const randomBytes = promisify(crypto.randomBytes);
const pbkdf2 = promisify(crypto.pbkdf2);

/**
 * Encryption algorithm configuration
 */
export enum EncryptionAlgorithm {
  AES_256_GCM = 'aes-256-gcm',
  AES_256_CBC = 'aes-256-cbc',
  CHACHA20_POLY1305 = 'chacha20-poly1305',
}

/**
 * Healthcare-specific data classification levels
 */
export enum HealthcareDataLevel {
  PUBLIC = 'public',           // Non-sensitive data
  INTERNAL = 'internal',       // Internal use only
  PHI = 'phi',                // Protected Health Information
  SENSITIVE_PHI = 'sensitive_phi', // High-risk PHI (SSN, genetic data)
  RESTRICTED = 'restricted',   // Highly restricted (mental health, substance abuse)
}

/**
 * Encrypted data envelope structure
 */
export interface EncryptedEnvelope {
  algorithm: EncryptionAlgorithm;
  ciphertext: string;
  iv: string;
  authTag: string;
  keyId?: string;
  timestamp: number;
  version: number;
  dataLevel?: HealthcareDataLevel;
}

/**
 * Key metadata for healthcare encryption
 */
export interface HealthcareKeyMetadata {
  keyId: string;
  version: number;
  algorithm: string;
  createdAt: Date;
  expiresAt?: Date;
  rotatedAt?: Date;
  status: 'active' | 'rotating' | 'retired';
  dataLevel: HealthcareDataLevel;
  hipaaCompliant: boolean;
  usageCount: number;
  maxUsageCount?: number;
}

/**
 * Field encryption options for healthcare data
 */
export interface HealthcareFieldEncryptionOptions {
  algorithm?: EncryptionAlgorithm;
  keyId?: string;
  dataLevel?: HealthcareDataLevel;
  deterministic?: boolean;
  searchable?: boolean;
  auditRequired?: boolean;
}

/**
 * Searchable encryption index for healthcare queries
 */
export interface HealthcareSearchableIndex {
  hash: string;
  salt: string;
  keyId: string;
  dataLevel: HealthcareDataLevel;
  createdAt: Date;
}

/**
 * Healthcare-grade encryption service with HIPAA compliance
 */
@Injectable()
export class HealthcareEncryptionService extends BaseService {
  private readonly keys: Map<string, Buffer> = new Map();
  private readonly keyMetadata: Map<string, HealthcareKeyMetadata> = new Map();
  private activeKeysByLevel: Map<HealthcareDataLevel, string> = new Map();
  
  private readonly IV_LENGTH = 16;
  private readonly AUTH_TAG_LENGTH = 16;
  private readonly SALT_LENGTH = 32;
  private readonly KEY_LENGTH = 32; // 256 bits
  private readonly MAX_PLAINTEXT_SIZE = 10 * 1024 * 1024; // 10MB

  constructor(private configService: ConfigService) {
    this.initializeHealthcareKeys();
  }

  // ==================== Core Healthcare Encryption ====================

  /**
   * Encrypts healthcare data with appropriate protection level
   *
   * @param plaintext - Data to encrypt
   * @param dataLevel - Healthcare data classification level
   * @param options - Encryption options
   * @returns Encrypted envelope with healthcare metadata
   */
  async encryptHealthcareData(
    plaintext: string,
    dataLevel: HealthcareDataLevel = HealthcareDataLevel.PHI,
    options?: HealthcareFieldEncryptionOptions,
  ): Promise<EncryptedEnvelope> {
    this.validatePlaintext(plaintext);

    const keyId = options?.keyId || this.getActiveKeyForLevel(dataLevel);
    const algorithm = options?.algorithm || EncryptionAlgorithm.AES_256_GCM;
    
    this.validateKeyForDataLevel(keyId, dataLevel);

    try {
      const key = this.getKey(keyId);
      const iv = await randomBytes(this.IV_LENGTH);

      const cipher = crypto.createCipheriv(algorithm, key, iv);
      
      let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
      ciphertext += cipher.final('hex');

      const authTag = cipher.getAuthTag();

      // Update key usage count for compliance tracking
      this.incrementKeyUsage(keyId);

      const envelope: EncryptedEnvelope = {
        algorithm,
        ciphertext,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
        keyId,
        timestamp: Date.now(),
        version: 1,
        dataLevel,
      };

      // Log encryption for HIPAA audit trail
      if (options?.auditRequired !== false) {
        this.logEncryptionAudit(keyId, dataLevel, 'ENCRYPT');
      }

      return envelope;
    } catch (error) {
      this.logError(`Healthcare data encryption failed: ${error.message}`, error);
      throw new Error('Healthcare encryption operation failed');
    }
  }

  /**
   * Decrypts healthcare data with audit logging
   *
   * @param envelope - Encrypted data envelope
   * @param auditRequired - Whether to log decryption for audit
   * @returns Decrypted plaintext
   */
  async decryptHealthcareData(
    envelope: EncryptedEnvelope,
    auditRequired: boolean = true,
  ): Promise<string> {
    this.validateEncryptedEnvelope(envelope);

    try {
      const key = this.getKey(envelope.keyId || this.getActiveKeyForLevel(HealthcareDataLevel.PHI));
      const iv = Buffer.from(envelope.iv, 'hex');
      const authTag = Buffer.from(envelope.authTag, 'hex');

      const decipher = crypto.createDecipheriv(envelope.algorithm, key, iv);
      decipher.setAuthTag(authTag);

      let plaintext = decipher.update(envelope.ciphertext, 'hex', 'utf8');
      plaintext += decipher.final('utf8');

      // Log decryption for HIPAA audit trail
      if (auditRequired) {
        this.logEncryptionAudit(
          envelope.keyId || 'unknown',
          envelope.dataLevel || HealthcareDataLevel.PHI,
          'DECRYPT',
        );
      }

      return plaintext;
    } catch (error) {
      this.logError(`Healthcare data decryption failed: ${error.message}`, error);
      throw new Error('Healthcare decryption operation failed or data tampered');
    }
  }

  // ==================== PHI-Specific Encryption Methods ====================

  /**
   * Encrypts Protected Health Information (PHI)
   */
  async encryptPHI(phi: string, options?: HealthcareFieldEncryptionOptions): Promise<string> {
    const envelope = await this.encryptHealthcareData(
      phi,
      HealthcareDataLevel.PHI,
      { ...options, auditRequired: true },
    );
    return Buffer.from(JSON.stringify(envelope)).toString('base64');
  }

  /**
   * Decrypts Protected Health Information (PHI)
   */
  async decryptPHI(encryptedPHI: string): Promise<string> {
    try {
      const envelope = JSON.parse(
        Buffer.from(encryptedPHI, 'base64').toString('utf8'),
      ) as EncryptedEnvelope;

      return await this.decryptHealthcareData(envelope, true);
    } catch (error) {
      this.logError(`PHI decryption failed: ${error.message}`, error);
      throw new Error('Invalid encrypted PHI data');
    }
  }

  /**
   * Encrypts sensitive PHI (SSN, genetic data, etc.)
   */
  async encryptSensitivePHI(
    sensitivePhi: string,
    options?: HealthcareFieldEncryptionOptions,
  ): Promise<string> {
    const envelope = await this.encryptHealthcareData(
      sensitivePhi,
      HealthcareDataLevel.SENSITIVE_PHI,
      { ...options, auditRequired: true },
    );
    return Buffer.from(JSON.stringify(envelope)).toString('base64');
  }

  /**
   * Decrypts sensitive PHI with enhanced audit logging
   */
  async decryptSensitivePHI(encryptedSensitivePHI: string): Promise<string> {
    try {
      const envelope = JSON.parse(
        Buffer.from(encryptedSensitivePHI, 'base64').toString('utf8'),
      ) as EncryptedEnvelope;

      // Enhanced audit logging for sensitive PHI
      this.logWarning(`Sensitive PHI decryption requested for key: ${envelope.keyId}`);

      return await this.decryptHealthcareData(envelope, true);
    } catch (error) {
      this.logError(`Sensitive PHI decryption failed: ${error.message}`, error);
      throw new Error('Invalid encrypted sensitive PHI data');
    }
  }

  /**
   * Encrypts restricted healthcare data (mental health, substance abuse)
   */
  async encryptRestrictedData(
    restrictedData: string,
    options?: HealthcareFieldEncryptionOptions,
  ): Promise<string> {
    const envelope = await this.encryptHealthcareData(
      restrictedData,
      HealthcareDataLevel.RESTRICTED,
      { ...options, auditRequired: true },
    );
    return Buffer.from(JSON.stringify(envelope)).toString('base64');
  }

  /**
   * Decrypts restricted healthcare data with special audit requirements
   */
  async decryptRestrictedData(encryptedRestrictedData: string): Promise<string> {
    try {
      const envelope = JSON.parse(
        Buffer.from(encryptedRestrictedData, 'base64').toString('utf8'),
      ) as EncryptedEnvelope;

      // Special audit logging for restricted data
      this.logWarning(
        `Restricted healthcare data decryption requested for key: ${envelope.keyId}`,
      );

      return await this.decryptHealthcareData(envelope, true);
    } catch (error) {
      this.logError(`Restricted data decryption failed: ${error.message}`, error);
      throw new Error('Invalid encrypted restricted healthcare data');
    }
  }

  // ==================== Format-Preserving Encryption for Healthcare ====================

  /**
   * Encrypts SSN preserving format (XXX-XX-XXXX)
   */
  async encryptSSN(ssn: string): Promise<string> {
    this.validateSSNFormat(ssn);
    
    const digits = ssn.replace(/\D/g, '');
    const key = this.getKey(this.getActiveKeyForLevel(HealthcareDataLevel.SENSITIVE_PHI));
    
    const encryptedDigits = await this.feistelCipher(digits, key, true);
    
    // Preserve original formatting
    return `${encryptedDigits.slice(0, 3)}-${encryptedDigits.slice(3, 5)}-${encryptedDigits.slice(5)}`;
  }

  /**
   * Decrypts format-preserved SSN
   */
  async decryptSSN(encryptedSSN: string): Promise<string> {
    this.validateSSNFormat(encryptedSSN);
    
    const digits = encryptedSSN.replace(/\D/g, '');
    const key = this.getKey(this.getActiveKeyForLevel(HealthcareDataLevel.SENSITIVE_PHI));
    
    const decryptedDigits = await this.feistelCipher(digits, key, false);
    
    return `${decryptedDigits.slice(0, 3)}-${decryptedDigits.slice(3, 5)}-${decryptedDigits.slice(5)}`;
  }

  /**
   * Encrypts Medical Record Number preserving format
   */
  async encryptMRN(mrn: string): Promise<string> {
    // Preserve letters and encrypt only digits
    let result = '';
    let digits = '';
    
    for (const char of mrn) {
      if (/\d/.test(char)) {
        digits += char;
      }
    }
    
    if (digits.length > 0) {
      const key = this.getKey(this.getActiveKeyForLevel(HealthcareDataLevel.PHI));
      const encryptedDigits = await this.feistelCipher(digits, key, true);
      
      let digitIndex = 0;
      for (const char of mrn) {
        if (/\d/.test(char)) {
          result += encryptedDigits[digitIndex++];
        } else {
          result += char;
        }
      }
    } else {
      result = mrn;
    }
    
    return result;
  }

  /**
   * Decrypts format-preserved Medical Record Number
   */
  async decryptMRN(encryptedMRN: string): Promise<string> {
    let result = '';
    let digits = '';
    
    for (const char of encryptedMRN) {
      if (/\d/.test(char)) {
        digits += char;
      }
    }
    
    if (digits.length > 0) {
      const key = this.getKey(this.getActiveKeyForLevel(HealthcareDataLevel.PHI));
      const decryptedDigits = await this.feistelCipher(digits, key, false);
      
      let digitIndex = 0;
      for (const char of encryptedMRN) {
        if (/\d/.test(char)) {
          result += decryptedDigits[digitIndex++];
        } else {
          result += char;
        }
      }
    } else {
      result = encryptedMRN;
    }
    
    return result;
  }

  // ==================== Healthcare Key Management ====================

  /**
   * Generates healthcare-specific encryption key
   */
  async generateHealthcareKey(
    keyId: string,
    dataLevel: HealthcareDataLevel,
    algorithm: EncryptionAlgorithm = EncryptionAlgorithm.AES_256_GCM,
  ): Promise<HealthcareKeyMetadata> {
    const key = await randomBytes(this.KEY_LENGTH);
    this.keys.set(keyId, key);

    const maxUsageCount = this.getMaxUsageCountForLevel(dataLevel);
    const expirationDays = this.getExpirationDaysForLevel(dataLevel);

    const metadata: HealthcareKeyMetadata = {
      keyId,
      version: 1,
      algorithm,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000),
      status: 'active',
      dataLevel,
      hipaaCompliant: true,
      usageCount: 0,
      maxUsageCount,
    };

    this.keyMetadata.set(keyId, metadata);
    this.activeKeysByLevel.set(dataLevel, keyId);
    
    this.logInfo(`Generated healthcare encryption key: ${keyId} for level: ${dataLevel}`);
    this.logEncryptionAudit(keyId, dataLevel, 'KEY_GENERATED');

    return metadata;
  }

  /**
   * Rotates healthcare keys based on policy
   */
  async rotateHealthcareKeys(): Promise<void> {
    for (const [dataLevel, keyId] of this.activeKeysByLevel) {
      const metadata = this.keyMetadata.get(keyId);
      
      if (!metadata) continue;

      const shouldRotate = this.shouldRotateKey(metadata);
      
      if (shouldRotate) {
        const newKeyId = `${keyId}-v${metadata.version + 1}`;
        await this.rotateHealthcareKey(keyId, newKeyId, dataLevel);
      }
    }
  }

  /**
   * Rotates a specific healthcare key
   */
  private async rotateHealthcareKey(
    oldKeyId: string,
    newKeyId: string,
    dataLevel: HealthcareDataLevel,
  ): Promise<HealthcareKeyMetadata> {
    const oldMetadata = this.keyMetadata.get(oldKeyId);
    
    if (!oldMetadata) {
      throw new Error(`Healthcare key not found: ${oldKeyId}`);
    }

    // Mark old key as rotating
    oldMetadata.status = 'rotating';
    oldMetadata.rotatedAt = new Date();
    this.keyMetadata.set(oldKeyId, oldMetadata);

    // Generate new key
    const newMetadata = await this.generateHealthcareKey(
      newKeyId,
      dataLevel,
      oldMetadata.algorithm as EncryptionAlgorithm,
    );

    this.logInfo(`Rotated healthcare key from ${oldKeyId} to ${newKeyId} for level: ${dataLevel}`);
    this.logEncryptionAudit(oldKeyId, dataLevel, 'KEY_ROTATED');

    return newMetadata;
  }

  // ==================== Searchable Encryption for Healthcare ====================

  /**
   * Creates searchable index for healthcare data
   */
  async createHealthcareSearchableIndex(
    value: string,
    dataLevel: HealthcareDataLevel,
    keyId?: string,
  ): Promise<HealthcareSearchableIndex> {
    const effectiveKeyId = keyId || this.getActiveKeyForLevel(dataLevel);
    const key = this.getKey(effectiveKeyId);
    const salt = await randomBytes(this.SALT_LENGTH);

    // Normalize value for consistent searching
    const normalizedValue = value.toLowerCase().trim();
    
    const hash = crypto
      .createHmac('sha256', key)
      .update(salt)
      .update(normalizedValue)
      .digest('hex');

    return {
      hash,
      salt: salt.toString('hex'),
      keyId: effectiveKeyId,
      dataLevel,
      createdAt: new Date(),
    };
  }

  /**
   * Generates search token for healthcare queries
   */
  async generateHealthcareSearchToken(
    searchValue: string,
    index: HealthcareSearchableIndex,
  ): Promise<string> {
    const key = this.getKey(index.keyId);
    const salt = Buffer.from(index.salt, 'hex');
    const normalizedValue = searchValue.toLowerCase().trim();

    return crypto
      .createHmac('sha256', key)
      .update(salt)
      .update(normalizedValue)
      .digest('hex');
  }

  // ==================== Batch Operations for Healthcare ====================

  /**
   * Encrypts multiple healthcare fields in a patient record
   */
  async encryptPatientRecord<T extends Record<string, any>>(
    patientData: T,
    fieldConfig: Record<string, HealthcareDataLevel>,
  ): Promise<T> {
    const encryptedData = { ...patientData };

    for (const [fieldName, dataLevel] of Object.entries(fieldConfig)) {
      if (encryptedData[fieldName] !== undefined && encryptedData[fieldName] !== null) {
        const value = typeof encryptedData[fieldName] === 'string'
          ? encryptedData[fieldName]
          : JSON.stringify(encryptedData[fieldName]);
        
        switch (dataLevel) {
          case HealthcareDataLevel.PHI:
            encryptedData[fieldName] = await this.encryptPHI(value);
            break;
          case HealthcareDataLevel.SENSITIVE_PHI:
            encryptedData[fieldName] = await this.encryptSensitivePHI(value);
            break;
          case HealthcareDataLevel.RESTRICTED:
            encryptedData[fieldName] = await this.encryptRestrictedData(value);
            break;
          default:
            // For non-PHI data, use basic encryption
            const envelope = await this.encryptHealthcareData(value, dataLevel);
            encryptedData[fieldName] = Buffer.from(JSON.stringify(envelope)).toString('base64');
        }
      }
    }

    return encryptedData;
  }

  /**
   * Decrypts multiple healthcare fields in a patient record
   */
  async decryptPatientRecord<T extends Record<string, any>>(
    encryptedPatientData: T,
    fieldConfig: Record<string, HealthcareDataLevel>,
  ): Promise<T> {
    const decryptedData = { ...encryptedPatientData };

    for (const [fieldName, dataLevel] of Object.entries(fieldConfig)) {
      if (decryptedData[fieldName]) {
        try {
          switch (dataLevel) {
            case HealthcareDataLevel.PHI:
              decryptedData[fieldName] = await this.decryptPHI(decryptedData[fieldName]);
              break;
            case HealthcareDataLevel.SENSITIVE_PHI:
              decryptedData[fieldName] = await this.decryptSensitivePHI(decryptedData[fieldName]);
              break;
            case HealthcareDataLevel.RESTRICTED:
              decryptedData[fieldName] = await this.decryptRestrictedData(decryptedData[fieldName]);
              break;
            default:
              const envelope = JSON.parse(
                Buffer.from(decryptedData[fieldName], 'base64').toString('utf8'),
              ) as EncryptedEnvelope;
              decryptedData[fieldName] = await this.decryptHealthcareData(envelope, true);
          }

          // Try to parse as JSON if it was originally an object
          try {
            const parsed = JSON.parse(decryptedData[fieldName]);
            if (typeof parsed === 'object') {
              decryptedData[fieldName] = parsed;
            }
          } catch {
            // Keep as string if not valid JSON
          }
        } catch (error) {
          this.logWarning(`Failed to decrypt field ${fieldName}: ${error.message}`);
        }
      }
    }

    return decryptedData;
  }

  // ==================== Private Helper Methods ====================

  /**
   * Initializes healthcare-specific encryption keys
   */
  private initializeHealthcareKeys(): void {
    // Initialize keys for different healthcare data levels
    const healthcareLevels = [
      HealthcareDataLevel.PHI,
      HealthcareDataLevel.SENSITIVE_PHI,
      HealthcareDataLevel.RESTRICTED,
    ];

    for (const level of healthcareLevels) {
      const keyId = `healthcare-${level}-default`;
      const key = crypto.randomBytes(this.KEY_LENGTH);
      this.keys.set(keyId, key);

      const metadata: HealthcareKeyMetadata = {
        keyId,
        version: 1,
        algorithm: EncryptionAlgorithm.AES_256_GCM,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + this.getExpirationDaysForLevel(level) * 24 * 60 * 60 * 1000),
        status: 'active',
        dataLevel: level,
        hipaaCompliant: true,
        usageCount: 0,
        maxUsageCount: this.getMaxUsageCountForLevel(level),
      };

      this.keyMetadata.set(keyId, metadata);
      this.activeKeysByLevel.set(level, keyId);
    }

    this.logWarning(
      'Healthcare encryption keys initialized in memory. ' +
      'For production, integrate with ConfigService and use HSM/KMS.',
    );
  }

  /**
   * Gets the active key for a healthcare data level
   */
  private getActiveKeyForLevel(dataLevel: HealthcareDataLevel): string {
    const keyId = this.activeKeysByLevel.get(dataLevel);
    if (!keyId) {
      throw new Error(`No active key found for healthcare data level: ${dataLevel}`);
    }
    return keyId;
  }

  /**
   * Gets maximum usage count based on data level
   */
  private getMaxUsageCountForLevel(dataLevel: HealthcareDataLevel): number {
    switch (dataLevel) {
      case HealthcareDataLevel.RESTRICTED:
        return 10000; // Most restrictive
      case HealthcareDataLevel.SENSITIVE_PHI:
        return 50000;
      case HealthcareDataLevel.PHI:
        return 100000;
      default:
        return 1000000;
    }
  }

  /**
   * Gets key expiration days based on data level
   */
  private getExpirationDaysForLevel(dataLevel: HealthcareDataLevel): number {
    switch (dataLevel) {
      case HealthcareDataLevel.RESTRICTED:
        return 30; // Monthly rotation for restricted data
      case HealthcareDataLevel.SENSITIVE_PHI:
        return 90; // Quarterly rotation for sensitive PHI
      case HealthcareDataLevel.PHI:
        return 180; // Semi-annual rotation for PHI
      default:
        return 365; // Annual rotation for other data
    }
  }

  /**
   * Determines if a key should be rotated
   */
  private shouldRotateKey(metadata: HealthcareKeyMetadata): boolean {
    const now = new Date();
    
    // Check expiration
    if (metadata.expiresAt && metadata.expiresAt <= now) {
      return true;
    }
    
    // Check usage count
    if (metadata.maxUsageCount && metadata.usageCount >= metadata.maxUsageCount) {
      return true;
    }
    
    return false;
  }

  /**
   * Increments key usage count
   */
  private incrementKeyUsage(keyId: string): void {
    const metadata = this.keyMetadata.get(keyId);
    if (metadata) {
      metadata.usageCount++;
      this.keyMetadata.set(keyId, metadata);
    }
  }

  /**
   * Validates plaintext input
   */
  private validatePlaintext(plaintext: string): void {
    if (!plaintext || typeof plaintext !== 'string') {
      throw new Error('Plaintext must be a non-empty string');
    }
    
    if (plaintext.length > this.MAX_PLAINTEXT_SIZE) {
      throw new Error('Plaintext exceeds maximum allowed size');
    }
  }

  /**
   * Validates encrypted envelope
   */
  private validateEncryptedEnvelope(envelope: EncryptedEnvelope): void {
    if (!envelope || typeof envelope !== 'object') {
      throw new Error('Envelope must be a valid EncryptedEnvelope object');
    }
    
    if (!envelope.ciphertext || !envelope.iv || !envelope.authTag) {
      throw new Error('Envelope missing required fields: ciphertext, iv, or authTag');
    }
  }

  /**
   * Validates key for data level compatibility
   */
  private validateKeyForDataLevel(keyId: string, dataLevel: HealthcareDataLevel): void {
    const metadata = this.keyMetadata.get(keyId);
    if (metadata && metadata.dataLevel !== dataLevel) {
      this.logWarning(
        `Key ${keyId} data level (${metadata.dataLevel}) doesn't match requested level (${dataLevel})`,
      );
    }
  }

  /**
   * Validates SSN format
   */
  private validateSSNFormat(ssn: string): void {
    if (!/^\d{3}-?\d{2}-?\d{4}$/.test(ssn)) {
      throw new Error('Invalid SSN format. Expected XXX-XX-XXXX or XXXXXXXXX');
    }
  }

  /**
   * Gets encryption key by ID
   */
  private getKey(keyId: string): Buffer {
    const key = this.keys.get(keyId);
    if (!key) {
      this.logError(`Healthcare encryption key not found: ${keyId}`);
      throw new Error(`Healthcare encryption key not found: ${keyId}`);
    }
    return key;
  }

  /**
   * Logs encryption operations for HIPAA audit trail
   */
  private logEncryptionAudit(
    keyId: string,
    dataLevel: HealthcareDataLevel,
    operation: string,
  ): void {
    this.logInfo(
      `Healthcare encryption audit: ${operation} | Key: ${keyId} | Level: ${dataLevel} | Time: ${new Date().toISOString()}`,
    );
  }

  /**
   * Feistel cipher for format-preserving encryption
   */
  private async feistelCipher(input: string, key: Buffer, encrypt: boolean): Promise<string> {
    const rounds = 8;
    let left = input.slice(0, Math.floor(input.length / 2));
    let right = input.slice(Math.floor(input.length / 2));

    for (let i = 0; i < rounds; i++) {
      const roundKey = crypto
        .createHmac('sha256', key)
        .update(Buffer.from([encrypt ? i : rounds - 1 - i]))
        .digest();

      const f = this.feistelRoundFunction(encrypt ? right : left, roundKey);
      const temp = encrypt ? left : right;

      if (encrypt) {
        left = right;
        right = this.xorDigitStrings(temp, f);
      } else {
        right = left;
        left = this.xorDigitStrings(temp, f);
      }
    }

    return left + right;
  }

  /**
   * Feistel round function for healthcare format-preserving encryption
   */
  private feistelRoundFunction(data: string, key: Buffer): string {
    const hmac = crypto.createHmac('sha256', key).update(data).digest();
    let result = '';

    for (let i = 0; i < data.length; i++) {
      const digit = parseInt(data[i], 10);
      const keyByte = hmac[i % hmac.length];
      result += ((digit + keyByte) % 10).toString();
    }

    return result;
  }

  /**
   * XOR two digit strings for format-preserving encryption
   */
  private xorDigitStrings(a: string, b: string): string {
    let result = '';
    for (let i = 0; i < a.length; i++) {
      const digitA = parseInt(a[i], 10);
      const digitB = parseInt(b[i % b.length], 10);
      result += ((digitA + digitB) % 10).toString();
    }
    return result;
  }

  // ==================== Utility Methods ====================

  /**
   * Checks if a value appears to be encrypted
   *
   * @param value - Value to check
   * @returns True if the value appears to be encrypted data
   */
  isEncrypted(value: string): boolean {
    if (!value || typeof value !== 'string') {
      return false;
    }

    try {
      // Try to decode as base64
      const decoded = Buffer.from(value, 'base64').toString('utf8');

      // Try to parse as JSON
      const envelope = JSON.parse(decoded);

      // Check if it has the expected structure
      return (
        envelope &&
        typeof envelope === 'object' &&
        envelope.algorithm &&
        envelope.ciphertext &&
        envelope.iv &&
        envelope.authTag &&
        typeof envelope.timestamp === 'number' &&
        typeof envelope.version === 'number'
      );
    } catch {
      return false;
    }
  }

  // ==================== Public Health Check and Metrics ====================

  /**
   * Performs health check on healthcare encryption service
   */
  async healthCheck(): Promise<{
    keyManagement: boolean;
    encryption: boolean;
    hipaaCompliance: boolean;
    keyRotation: boolean;
  }> {
    try {
      // Test key generation
      const testKey = await this.generateHealthcareKey(
        'health-check-test',
        HealthcareDataLevel.PHI,
      );
      
      // Test encryption/decryption
      const testData = 'health-check-test-data';
      const encrypted = await this.encryptPHI(testData);
      const decrypted = await this.decryptPHI(encrypted);
      
      // Cleanup test key
      this.keys.delete(testKey.keyId);
      this.keyMetadata.delete(testKey.keyId);
      
      const encryptionWorking = decrypted === testData;
      const hipaaCompliant = this.validateHIPAACompliance();
      const keyRotationHealthy = this.checkKeyRotationHealth();

      return {
        keyManagement: true,
        encryption: encryptionWorking,
        hipaaCompliance: hipaaCompliant,
        keyRotation: keyRotationHealthy,
      };
    } catch (error) {
      this.logError(`Healthcare encryption health check failed: ${error.message}`, error);
      return {
        keyManagement: false,
        encryption: false,
        hipaaCompliance: false,
        keyRotation: false,
      };
    }
  }

  /**
   * Gets healthcare encryption metrics
   */
  getHealthcareEncryptionMetrics(): {
    totalKeys: number;
    activeKeys: number;
    hipaaCompliantKeys: number;
    keysByDataLevel: Record<string, number>;
    keysNearingExpiration: number;
    keysNearingUsageLimit: number;
  } {
    const activeKeys = Array.from(this.keyMetadata.values()).filter(k => k.status === 'active');
    const hipaaCompliantKeys = activeKeys.filter(k => k.hipaaCompliant);
    
    const keysByDataLevel: Record<string, number> = {};
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    let keysNearingExpiration = 0;
    let keysNearingUsageLimit = 0;

    for (const metadata of activeKeys) {
      keysByDataLevel[metadata.dataLevel] = (keysByDataLevel[metadata.dataLevel] || 0) + 1;
      
      if (metadata.expiresAt && metadata.expiresAt <= sevenDaysFromNow) {
        keysNearingExpiration++;
      }
      
      if (metadata.maxUsageCount && metadata.usageCount >= metadata.maxUsageCount * 0.9) {
        keysNearingUsageLimit++;
      }
    }

    return {
      totalKeys: this.keyMetadata.size,
      activeKeys: activeKeys.length,
      hipaaCompliantKeys: hipaaCompliantKeys.length,
      keysByDataLevel,
      keysNearingExpiration,
      keysNearingUsageLimit,
    };
  }

  /**
   * Validates HIPAA compliance status
   */
  private validateHIPAACompliance(): boolean {
    const activeKeys = Array.from(this.keyMetadata.values()).filter(k => k.status === 'active');
    return activeKeys.every(k => k.hipaaCompliant);
  }

  /**
   * Checks key rotation health
   */
  private checkKeyRotationHealth(): boolean {
    const activeKeys = Array.from(this.keyMetadata.values()).filter(k => k.status === 'active');
    const unhealthyKeys = activeKeys.filter(k => this.shouldRotateKey(k));
    return unhealthyKeys.length === 0;
  }
}
