/**
 * Encrypted Transformer (DEPRECATED)
 *
 * This file is deprecated in favor of Sequelize hooks-based encryption.
 * Use EncryptionHooks from '../hooks/encryption.hooks' instead.
 *
 * MIGRATION NOTE: TypeORM to Sequelize
 * =====================================
 * TypeORM's ValueTransformer interface has been replaced with Sequelize hooks
 * because Sequelize hooks properly support async operations, whereas TypeORM
 * transformers are synchronous.
 *
 * OLD PATTERN (TypeORM):
 * ```typescript
 * @Column({
 *   type: 'text',
 *   transformer: new EncryptedTransformer(encryptionService)
 * })
 * sensitiveData: string;
 * ```
 *
 * NEW PATTERN (Sequelize):
 * ```typescript
 * import { EncryptionHooks } from '../hooks/encryption.hooks';
 *
 * @Table({ tableName: 'my_table' })
 * class MyModel extends Model {
 *   @Column
 *   sensitiveData: string;
 *
 *   @BeforeCreate
 *   @BeforeUpdate
 *   static async encryptFields(instance: MyModel) {
 *     await EncryptionHooks.encryptFields(
 *       instance,
 *       ['sensitiveData'],
 *       encryptionService
 *     );
 *   }
 *
 *   @AfterFind
 *   static async decryptFields(instances: MyModel | MyModel[] | null) {
 *     await EncryptionHooks.decryptFields(
 *       instances,
 *       ['sensitiveData'],
 *       encryptionService
 *     );
 *   }
 * }
 * ```
 *
 * Benefits of the new approach:
 * - Full async/await support
 * - Better error handling
 * - More flexible hook configuration
 * - Type-safe field specification
 * - No synchronous wrapper limitations
 *
 * @deprecated Use EncryptionHooks from '../hooks/encryption.hooks' instead
 * @see {@link ../hooks/encryption.hooks}
 */

import { EncryptionService } from '../../encryption/encryption.service';

/**
 * @deprecated Use EncryptionHooks instead
 */
export class EncryptedTransformer {
  constructor(private readonly encryptionService: EncryptionService) {
    console.warn(
      'EncryptedTransformer is deprecated. Use EncryptionHooks from "../hooks/encryption.hooks" instead.'
    );
  }
}

/**
 * @deprecated Use EncryptionHooks.createEncryptHook() and EncryptionHooks.createDecryptHook() instead
 */
export function createEncryptedTransformer(
  encryptionService: EncryptionService
): EncryptedTransformer {
  console.warn(
    'createEncryptedTransformer is deprecated. Use EncryptionHooks from "../hooks/encryption.hooks" instead.'
  );
  return new EncryptedTransformer(encryptionService);
}

// Re-export EncryptionHooks for backwards compatibility
export { EncryptionHooks, WithEncryption } from '../hooks/encryption.hooks';
