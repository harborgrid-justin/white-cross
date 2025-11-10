/**
 * HIPAA-Compliant Field-Level PHI Encryption Service
 *
 * Implements HIPAA Technical Safeguard: Encryption and Decryption (§164.312(a)(2)(iv))
 *
 * Features:
 * - AES-256-GCM encryption for PHI fields
 * - Transparent encryption/decryption with model hooks
 * - Key rotation support
 * - Searchable encryption (tokenization)
 * - Secure key management
 * - Audit logging for encryption operations
 * - Field-level encryption decorators
 *
 * Protected Health Information (PHI) includes:
 * - Social Security Numbers (SSN)
 * - Medical Record Numbers (MRN)
 * - Email addresses
 * - Phone numbers
 * - Physical addresses
 * - Medical history
 * - Diagnosis codes
 * - Treatment records
 *
 * @module hipaa-phi-encryption
 * @hipaa-requirement §164.312(a)(2)(iv) - Encryption and Decryption
 */

import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

// ============================================================================
// Type Definitions
// ============================================================================

export interface EncryptionConfig {
  /** Encryption algorithm (default: aes-256-gcm) */
  algorithm: string;
  /** Key derivation algorithm */
  keyDerivation: 'scrypt' | 'pbkdf2';
  /** Encryption key length in bytes */
  keyLength: number;
  /** IV length for GCM */
  ivLength: number;
  /** Auth tag length for GCM */
  authTagLength: number;
}

export interface EncryptedData {
  /** Encrypted data (base64) */
  encrypted: string;
  /** Initialization vector (base64) */
  iv: string;
  /** Authentication tag (base64) */
  authTag: string;
  /** Key ID used for encryption */
  keyId: string;
  /** Encryption algorithm */
  algorithm: string;
  /** Timestamp of encryption */
  timestamp: string;
}

export interface EncryptionKey {
  id: string;
  key: Buffer;
  algorithm: string;
  createdAt: Date;
  rotatedAt?: Date;
  status: 'active' | 'rotated' | 'revoked';
}

export interface TokenizationMap {
  token: string;
  originalValue: string;
  fieldName: string;
  entityType: string;
  createdAt: Date;
}

export interface PHIField {
  fieldName: string;
  fieldType: 'ssn' | 'mrn' | 'email' | 'phone' | 'address' | 'medical' | 'custom';
  encrypted: boolean;
  tokenized: boolean;
  searchable: boolean;
}

// ============================================================================
// PHI Encryption Service
// ============================================================================

@Injectable()
export class HIPAAPHIEncryptionService {
  private readonly logger = new Logger(HIPAAPHIEncryptionService.name);

  private readonly config: EncryptionConfig = {
    algorithm: 'aes-256-gcm',
    keyDerivation: 'scrypt',
    keyLength: 32, // 256 bits
    ivLength: 16, // 128 bits
    authTagLength: 16, // 128 bits
  };

  private encryptionKey: Buffer;
  private keyId: string;

  constructor() {
    this.initializeEncryptionKey();
  }

  /**
   * Initialize encryption key from environment
   * HIPAA: Secure key management required
   */
  private initializeEncryptionKey(): void {
    const keyString = process.env.PHI_ENCRYPTION_KEY;
    const salt = process.env.PHI_ENCRYPTION_SALT || 'white-cross-phi-salt';

    if (!keyString) {
      this.logger.warn(
        'PHI_ENCRYPTION_KEY not set. Using default key. CHANGE IN PRODUCTION!',
      );
    }

    const key = keyString || 'default-phi-key-change-in-production';

    // Derive encryption key using scrypt
    this.encryptionKey = crypto.scryptSync(key, salt, this.config.keyLength);
    this.keyId = crypto.createHash('sha256').update(key).digest('hex').substring(0, 8);

    this.logger.log(`PHI Encryption initialized with key ID: ${this.keyId}`);
  }

  /**
   * Encrypt PHI field
   * HIPAA: Encrypt Protected Health Information at rest
   */
  async encryptPHI(plaintext: string, metadata?: any): Promise<EncryptedData> {
    if (!plaintext || plaintext.length === 0) {
      throw new Error('Cannot encrypt empty value');
    }

    try {
      // Generate random IV
      const iv = crypto.randomBytes(this.config.ivLength);

      // Create cipher
      const cipher = crypto.createCipheriv(
        this.config.algorithm,
        this.encryptionKey,
        iv,
      );

      // Encrypt data
      let encrypted = cipher.update(plaintext, 'utf8', 'base64');
      encrypted += cipher.final('base64');

      // Get authentication tag
      const authTag = cipher.getAuthTag();

      const result: EncryptedData = {
        encrypted,
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64'),
        keyId: this.keyId,
        algorithm: this.config.algorithm,
        timestamp: new Date().toISOString(),
      };

      this.logger.debug(`Encrypted PHI field (length: ${plaintext.length})`);
      return result;
    } catch (error) {
      this.logger.error(`PHI encryption failed: ${error.message}`, error.stack);
      throw new Error('PHI encryption failed');
    }
  }

  /**
   * Decrypt PHI field
   * HIPAA: Decrypt Protected Health Information securely
   */
  async decryptPHI(encryptedData: EncryptedData): Promise<string> {
    try {
      // Decode base64 data
      const iv = Buffer.from(encryptedData.iv, 'base64');
      const authTag = Buffer.from(encryptedData.authTag, 'base64');
      const encrypted = Buffer.from(encryptedData.encrypted, 'base64');

      // Create decipher
      const decipher = crypto.createDecipheriv(
        encryptedData.algorithm,
        this.encryptionKey,
        iv,
      );

      // Set authentication tag
      decipher.setAuthTag(authTag);

      // Decrypt data
      let decrypted = decipher.update(encrypted);
      decrypted = Buffer.concat([decrypted, decipher.final()]);

      this.logger.debug('Decrypted PHI field successfully');
      return decrypted.toString('utf8');
    } catch (error) {
      this.logger.error(`PHI decryption failed: ${error.message}`, error.stack);
      throw new Error('PHI decryption failed - data may be corrupted or tampered');
    }
  }

  /**
   * Encrypt PHI field with simple string output
   * HIPAA: Convenience method for database storage
   */
  async encryptPHISimple(plaintext: string): Promise<string> {
    const encrypted = await this.encryptPHI(plaintext);
    // Format: keyId:iv:authTag:encrypted
    return `${encrypted.keyId}:${encrypted.iv}:${encrypted.authTag}:${encrypted.encrypted}`;
  }

  /**
   * Decrypt PHI field from simple string format
   * HIPAA: Convenience method for database retrieval
   */
  async decryptPHISimple(encryptedString: string): Promise<string> {
    try {
      const parts = encryptedString.split(':');
      if (parts.length !== 4) {
        throw new Error('Invalid encrypted data format');
      }

      const [keyId, iv, authTag, encrypted] = parts;

      const encryptedData: EncryptedData = {
        keyId,
        iv,
        authTag,
        encrypted,
        algorithm: this.config.algorithm,
        timestamp: new Date().toISOString(),
      };

      return await this.decryptPHI(encryptedData);
    } catch (error) {
      this.logger.error(`Simple PHI decryption failed: ${error.message}`);
      throw new Error('PHI decryption failed');
    }
  }

  /**
   * Tokenize PHI for searchable encryption
   * HIPAA: Allow searching without exposing actual values
   */
  async tokenizePHI(
    value: string,
    fieldName: string,
    entityType: string,
  ): Promise<string> {
    // Generate deterministic token (same value = same token)
    const tokenSeed = `${fieldName}:${entityType}:${value}`;
    const token = crypto
      .createHash('sha256')
      .update(tokenSeed)
      .update(this.keyId)
      .digest('hex');

    this.logger.debug(`Tokenized PHI field: ${fieldName}`);
    return token;
  }

  /**
   * Mask PHI for display purposes
   * HIPAA: Show partial data while protecting full value
   */
  maskPHI(value: string, fieldType: PHIField['fieldType']): string {
    if (!value || value.length === 0) {
      return '';
    }

    switch (fieldType) {
      case 'ssn':
        // Show last 4 digits: XXX-XX-1234
        return `XXX-XX-${value.slice(-4)}`;

      case 'mrn':
        // Show last 4 characters
        return `****${value.slice(-4)}`;

      case 'email':
        // Show first char and domain: j***@example.com
        const [localPart, domain] = value.split('@');
        return `${localPart[0]}***@${domain}`;

      case 'phone':
        // Show last 4 digits: (XXX) XXX-1234
        return `(XXX) XXX-${value.slice(-4)}`;

      case 'address':
        // Show only city/state
        return '*** (address masked)';

      case 'medical':
        // Complete masking
        return '*** (medical data masked)';

      default:
        // Generic masking
        if (value.length <= 4) {
          return '*'.repeat(value.length);
        }
        return `${'*'.repeat(value.length - 4)}${value.slice(-4)}`;
    }
  }

  /**
   * Detect PHI fields in data object
   * HIPAA: Identify fields that require encryption
   */
  detectPHIFields(data: any): PHIField[] {
    const phiFieldNames = [
      'ssn',
      'socialSecurityNumber',
      'mrn',
      'medicalRecordNumber',
      'email',
      'phone',
      'phoneNumber',
      'address',
      'street',
      'city',
      'zipCode',
      'diagnosis',
      'treatment',
      'medicalHistory',
      'prescription',
      'labResults',
      'insuranceNumber',
      'driverLicense',
      'passport',
      'creditCard',
      'bankAccount',
    ];

    const detected: PHIField[] = [];

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string' && phiFieldNames.includes(key.toLowerCase())) {
        detected.push({
          fieldName: key,
          fieldType: this.inferFieldType(key),
          encrypted: false,
          tokenized: false,
          searchable: false,
        });
      }
    }

    return detected;
  }

  /**
   * Infer field type from field name
   */
  private inferFieldType(fieldName: string): PHIField['fieldType'] {
    const lower = fieldName.toLowerCase();

    if (lower.includes('ssn') || lower.includes('social')) return 'ssn';
    if (lower.includes('mrn') || lower.includes('medical')) return 'mrn';
    if (lower.includes('email')) return 'email';
    if (lower.includes('phone')) return 'phone';
    if (lower.includes('address') || lower.includes('street') || lower.includes('city'))
      return 'address';
    if (
      lower.includes('diagnosis') ||
      lower.includes('treatment') ||
      lower.includes('prescription')
    )
      return 'medical';

    return 'custom';
  }

  /**
   * Encrypt multiple PHI fields in object
   * HIPAA: Batch encryption for efficiency
   */
  async encryptPHIFields(
    data: any,
    fields: string[],
  ): Promise<Record<string, string>> {
    const encrypted: Record<string, string> = {};

    for (const field of fields) {
      if (data[field] && typeof data[field] === 'string') {
        try {
          encrypted[field] = await this.encryptPHISimple(data[field]);
        } catch (error) {
          this.logger.error(`Failed to encrypt field ${field}: ${error.message}`);
          throw error;
        }
      }
    }

    return encrypted;
  }

  /**
   * Decrypt multiple PHI fields in object
   * HIPAA: Batch decryption for efficiency
   */
  async decryptPHIFields(
    data: any,
    fields: string[],
  ): Promise<Record<string, string>> {
    const decrypted: Record<string, string> = {};

    for (const field of fields) {
      if (data[field] && typeof data[field] === 'string') {
        try {
          decrypted[field] = await this.decryptPHISimple(data[field]);
        } catch (error) {
          this.logger.error(`Failed to decrypt field ${field}: ${error.message}`);
          // Continue with other fields
          decrypted[field] = '[DECRYPTION_FAILED]';
        }
      }
    }

    return decrypted;
  }

  /**
   * Validate encryption integrity
   * HIPAA: Ensure data hasn't been tampered with
   */
  async validateEncryption(encryptedData: EncryptedData): Promise<boolean> {
    try {
      // Try to decrypt - if successful, data is valid
      await this.decryptPHI(encryptedData);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Re-encrypt data with new key (key rotation)
   * HIPAA: Support key rotation for security
   */
  async reEncryptPHI(
    encryptedData: EncryptedData,
    newKey: Buffer,
  ): Promise<EncryptedData> {
    // Decrypt with old key
    const plaintext = await this.decryptPHI(encryptedData);

    // Store old key temporarily
    const oldKey = this.encryptionKey;

    // Set new key
    this.encryptionKey = newKey;

    try {
      // Encrypt with new key
      const newEncrypted = await this.encryptPHI(plaintext);
      return newEncrypted;
    } finally {
      // Restore old key
      this.encryptionKey = oldKey;
    }
  }

  /**
   * Generate audit log entry for encryption operation
   * HIPAA: Track all PHI access
   */
  createEncryptionAuditLog(operation: 'encrypt' | 'decrypt', field: string): any {
    return {
      timestamp: new Date().toISOString(),
      operation,
      field,
      keyId: this.keyId,
      algorithm: this.config.algorithm,
      success: true,
    };
  }
}

// ============================================================================
// TypeORM/Sequelize Model Hooks
// ============================================================================

/**
 * Before Create Hook - Encrypt PHI fields
 * HIPAA: Automatically encrypt PHI before database insert
 */
export async function beforeCreateEncryptPHI(
  instance: any,
  phiFields: string[],
  encryptionService: HIPAAPHIEncryptionService,
): Promise<void> {
  for (const field of phiFields) {
    if (instance[field] && typeof instance[field] === 'string') {
      const encrypted = await encryptionService.encryptPHISimple(instance[field]);
      instance[field] = encrypted;

      // Also create searchable token
      const tokenField = `${field}_token`;
      if (instance[tokenField] !== undefined) {
        instance[tokenField] = await encryptionService.tokenizePHI(
          instance[field],
          field,
          instance.constructor.name,
        );
      }
    }
  }
}

/**
 * After Find Hook - Decrypt PHI fields
 * HIPAA: Automatically decrypt PHI after database retrieval
 */
export async function afterFindDecryptPHI(
  instances: any[],
  phiFields: string[],
  encryptionService: HIPAAPHIEncryptionService,
): Promise<void> {
  for (const instance of instances) {
    for (const field of phiFields) {
      if (instance[field] && typeof instance[field] === 'string') {
        try {
          const decrypted = await encryptionService.decryptPHISimple(instance[field]);
          instance[field] = decrypted;
        } catch (error) {
          instance[field] = '[DECRYPTION_FAILED]';
        }
      }
    }
  }
}

/**
 * Before Update Hook - Encrypt modified PHI fields
 * HIPAA: Encrypt updated PHI data
 */
export async function beforeUpdateEncryptPHI(
  instance: any,
  phiFields: string[],
  encryptionService: HIPAAPHIEncryptionService,
): Promise<void> {
  await beforeCreateEncryptPHI(instance, phiFields, encryptionService);
}

// ============================================================================
// Decorators
// ============================================================================

/**
 * Decorator to mark fields for automatic encryption
 * HIPAA: Declarative PHI field protection
 *
 * @example
 * ```typescript
 * class Patient {
 *   @EncryptedPHI('ssn')
 *   @Column()
 *   socialSecurityNumber: string;
 *
 *   @EncryptedPHI('email')
 *   @Column()
 *   email: string;
 * }
 * ```
 */
export function EncryptedPHI(fieldType: PHIField['fieldType']) {
  return function (target: any, propertyKey: string) {
    if (!target.constructor._phiFields) {
      target.constructor._phiFields = [];
    }
    target.constructor._phiFields.push({
      fieldName: propertyKey,
      fieldType,
    });
  };
}

/**
 * Decorator to mark fields for tokenization (searchable encryption)
 *
 * @example
 * ```typescript
 * class Patient {
 *   @TokenizedPHI('email')
 *   @Column()
 *   email: string;
 * }
 * ```
 */
export function TokenizedPHI(fieldType: PHIField['fieldType']) {
  return function (target: any, propertyKey: string) {
    if (!target.constructor._tokenizedFields) {
      target.constructor._tokenizedFields = [];
    }
    target.constructor._tokenizedFields.push({
      fieldName: propertyKey,
      fieldType,
    });
  };
}

// ============================================================================
// Composable Functions
// ============================================================================

/**
 * Encrypt PHI value
 */
export async function encryptPHIValue(value: string): Promise<string> {
  const service = new HIPAAPHIEncryptionService();
  return service.encryptPHISimple(value);
}

/**
 * Decrypt PHI value
 */
export async function decryptPHIValue(encrypted: string): Promise<string> {
  const service = new HIPAAPHIEncryptionService();
  return service.decryptPHISimple(encrypted);
}

/**
 * Mask PHI value for display
 */
export function maskPHIValue(value: string, type: PHIField['fieldType']): string {
  const service = new HIPAAPHIEncryptionService();
  return service.maskPHI(value, type);
}

/**
 * Tokenize PHI for searching
 */
export async function tokenizePHIValue(
  value: string,
  fieldName: string,
  entityType: string,
): Promise<string> {
  const service = new HIPAAPHIEncryptionService();
  return service.tokenizePHI(value, fieldName, entityType);
}

// ============================================================================
// Export
// ============================================================================

export default {
  HIPAAPHIEncryptionService,
  encryptPHIValue,
  decryptPHIValue,
  maskPHIValue,
  tokenizePHIValue,
  EncryptedPHI,
  TokenizedPHI,
  beforeCreateEncryptPHI,
  afterFindDecryptPHI,
  beforeUpdateEncryptPHI,
};
