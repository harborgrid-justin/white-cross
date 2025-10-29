/**
 * Encryption Hooks for Sequelize Models
 *
 * Provides async-compatible field-level encryption for sensitive data using Sequelize hooks.
 * Replaces TypeORM's ValueTransformer pattern with hooks-based approach.
 *
 * HIPAA Compliance: §164.312(a)(2)(iv) - Encryption and Decryption
 *
 * @module common/database/hooks
 */

import { Model } from 'sequelize';
import { EncryptionService } from '../../encryption/encryption.service';

/**
 * Configuration for field encryption
 */
export interface EncryptionConfig {
  /**
   * Fields to encrypt/decrypt
   */
  fields: string[];

  /**
   * Encryption service instance
   */
  encryptionService: EncryptionService;
}

/**
 * Encryption Hooks Class
 *
 * Provides reusable hooks for encrypting and decrypting sensitive model fields.
 * Supports async operations unlike TypeORM's synchronous transformers.
 *
 * @example
 * ```typescript
 * // In your model class
 * @Table({ tableName: 'patients' })
 * class Patient extends Model {
 *   @BeforeCreate
 *   @BeforeUpdate
 *   static async encryptSensitiveFields(instance: Patient) {
 *     await EncryptionHooks.encryptFields(
 *       instance,
 *       ['ssn', 'medicalRecordNumber'],
 *       encryptionService
 *     );
 *   }
 *
 *   @AfterFind
 *   static async decryptSensitiveFields(instances: Patient | Patient[] | null) {
 *     await EncryptionHooks.decryptFields(
 *       instances,
 *       ['ssn', 'medicalRecordNumber'],
 *       encryptionService
 *     );
 *   }
 * }
 * ```
 */
export class EncryptionHooks {
  /**
   * Encrypt specified fields before saving to database
   *
   * Use in @BeforeCreate and @BeforeUpdate hooks
   *
   * @param instance - Model instance to encrypt
   * @param fields - Array of field names to encrypt
   * @param encryptionService - Encryption service instance
   *
   * @throws Error if encryption fails for any field
   */
  static async encryptFields<T extends Model>(
    instance: T,
    fields: string[],
    encryptionService: EncryptionService
  ): Promise<void> {
    for (const field of fields) {
      const value = instance.getDataValue(field as any);

      // Skip if value is null, undefined, or already encrypted
      if (!value) {
        continue;
      }

      // Check if already encrypted to avoid double encryption
      if (encryptionService.isEncrypted(value)) {
        continue;
      }

      try {
        const encrypted = await encryptionService.encrypt(value);
        instance.setDataValue(field as any, encrypted);
      } catch (error) {
        throw new Error(
          `Failed to encrypt field '${field}': ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }
  }

  /**
   * Decrypt specified fields after loading from database
   *
   * Use in @AfterFind hook
   *
   * @param instances - Model instance(s) to decrypt
   * @param fields - Array of field names to decrypt
   * @param encryptionService - Encryption service instance
   *
   * @throws Error if decryption fails for any field
   */
  static async decryptFields<T extends Model>(
    instances: T | T[] | null,
    fields: string[],
    encryptionService: EncryptionService
  ): Promise<void> {
    // Handle null/undefined results
    if (!instances) {
      return;
    }

    // Normalize to array for consistent processing
    const items = Array.isArray(instances) ? instances : [instances];

    for (const instance of items) {
      for (const field of fields) {
        const value = instance.getDataValue(field as any);

        // Skip if value is null or undefined
        if (!value) {
          continue;
        }

        // Only decrypt if value is actually encrypted
        if (!encryptionService.isEncrypted(value)) {
          continue;
        }

        try {
          const decrypted = await encryptionService.decrypt(value);
          instance.setDataValue(field as any, decrypted);
        } catch (error) {
          throw new Error(
            `Failed to decrypt field '${field}': ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }
    }
  }

  /**
   * Create a before-save hook function for encryption
   *
   * @param config - Encryption configuration
   * @returns Hook function for @BeforeCreate and @BeforeUpdate
   *
   * @example
   * ```typescript
   * const encryptHook = EncryptionHooks.createEncryptHook({
   *   fields: ['ssn', 'medicalRecordNumber'],
   *   encryptionService
   * });
   *
   * @BeforeCreate
   * @BeforeUpdate
   * static async encryptSensitiveFields(instance: Patient) {
   *   await encryptHook(instance);
   * }
   * ```
   */
  static createEncryptHook<T extends Model>(
    config: EncryptionConfig
  ): (instance: T) => Promise<void> {
    return async (instance: T) => {
      await EncryptionHooks.encryptFields(
        instance,
        config.fields,
        config.encryptionService
      );
    };
  }

  /**
   * Create an after-find hook function for decryption
   *
   * @param config - Encryption configuration
   * @returns Hook function for @AfterFind
   *
   * @example
   * ```typescript
   * const decryptHook = EncryptionHooks.createDecryptHook({
   *   fields: ['ssn', 'medicalRecordNumber'],
   *   encryptionService
   * });
   *
   * @AfterFind
   * static async decryptSensitiveFields(instances: Patient | Patient[] | null) {
   *   await decryptHook(instances);
   * }
   * ```
   */
  static createDecryptHook<T extends Model>(
    config: EncryptionConfig
  ): (instances: T | T[] | null) => Promise<void> {
    return async (instances: T | T[] | null) => {
      await EncryptionHooks.decryptFields(
        instances,
        config.fields,
        config.encryptionService
      );
    };
  }

  /**
   * Encrypt a single field value directly
   *
   * Utility method for one-off encryption without hooks
   *
   * @param value - Value to encrypt
   * @param encryptionService - Encryption service instance
   * @returns Encrypted value
   */
  static async encryptValue(
    value: string | null | undefined,
    encryptionService: EncryptionService
  ): Promise<string | null> {
    if (!value) {
      return null;
    }

    if (encryptionService.isEncrypted(value)) {
      return value;
    }

    return await encryptionService.encrypt(value);
  }

  /**
   * Decrypt a single field value directly
   *
   * Utility method for one-off decryption without hooks
   *
   * @param value - Value to decrypt
   * @param encryptionService - Encryption service instance
   * @returns Decrypted value
   */
  static async decryptValue(
    value: string | null | undefined,
    encryptionService: EncryptionService
  ): Promise<string | null> {
    if (!value) {
      return null;
    }

    if (!encryptionService.isEncrypted(value)) {
      return value;
    }

    return await encryptionService.decrypt(value);
  }

  /**
   * Bulk encrypt multiple values
   *
   * @param values - Array of values to encrypt
   * @param encryptionService - Encryption service instance
   * @returns Array of encrypted values
   */
  static async encryptValues(
    values: (string | null | undefined)[],
    encryptionService: EncryptionService
  ): Promise<(string | null)[]> {
    return Promise.all(
      values.map(value => EncryptionHooks.encryptValue(value, encryptionService))
    );
  }

  /**
   * Bulk decrypt multiple values
   *
   * @param values - Array of values to decrypt
   * @param encryptionService - Encryption service instance
   * @returns Array of decrypted values
   */
  static async decryptValues(
    values: (string | null | undefined)[],
    encryptionService: EncryptionService
  ): Promise<(string | null)[]> {
    return Promise.all(
      values.map(value => EncryptionHooks.decryptValue(value, encryptionService))
    );
  }

  /**
   * Validate that a field is encrypted
   *
   * @param instance - Model instance
   * @param field - Field name to check
   * @param encryptionService - Encryption service instance
   * @returns True if field is encrypted
   */
  static isFieldEncrypted<T extends Model>(
    instance: T,
    field: string,
    encryptionService: EncryptionService
  ): boolean {
    const value = instance.getDataValue(field as any);

    if (!value) {
      return false;
    }

    return encryptionService.isEncrypted(value);
  }

  /**
   * Validate that all specified fields are encrypted
   *
   * @param instance - Model instance
   * @param fields - Array of field names to check
   * @param encryptionService - Encryption service instance
   * @returns Object mapping field names to encryption status
   */
  static validateEncryptedFields<T extends Model>(
    instance: T,
    fields: string[],
    encryptionService: EncryptionService
  ): Record<string, boolean> {
    const results: Record<string, boolean> = {};

    for (const field of fields) {
      results[field] = EncryptionHooks.isFieldEncrypted(
        instance,
        field,
        encryptionService
      );
    }

    return results;
  }
}

/**
 * Decorator factory for automatic field encryption
 *
 * Creates a decorator that can be applied to model classes to automatically
 * encrypt/decrypt specified fields.
 *
 * @param fields - Array of field names to encrypt
 * @param getEncryptionService - Function to retrieve encryption service instance
 * @returns Class decorator
 *
 * @example
 * ```typescript
 * @WithEncryption(['ssn', 'medicalRecordNumber'], () => container.get(EncryptionService))
 * @Table({ tableName: 'patients' })
 * class Patient extends Model {
 *   // Fields will be automatically encrypted/decrypted
 * }
 * ```
 */
export function WithEncryption(
  fields: string[],
  getEncryptionService: () => EncryptionService
) {
  return function <T extends { new (...args: any[]): Model }>(constructor: T) {
    const encryptionService = getEncryptionService();

    // Add beforeCreate hook
    (constructor as any).addHook('beforeCreate', async (instance: Model) => {
      await EncryptionHooks.encryptFields(instance, fields, encryptionService);
    });

    // Add beforeUpdate hook
    (constructor as any).addHook('beforeUpdate', async (instance: Model) => {
      await EncryptionHooks.encryptFields(instance, fields, encryptionService);
    });

    // Add afterFind hook
    (constructor as any).addHook('afterFind', async (instances: Model | Model[] | null) => {
      await EncryptionHooks.decryptFields(instances, fields, encryptionService);
    });

    return constructor;
  };
}

/**
 * Export encryption service interface for type safety
 */
export interface IEncryptionService {
  encrypt(plaintext: string): Promise<string>;
  decrypt(ciphertext: string): Promise<string>;
  isEncrypted(value: string): boolean;
}
