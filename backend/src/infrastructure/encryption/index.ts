/**
 * @fileoverview Encryption Infrastructure Exports
 * @module infrastructure/encryption
 * @description Centralized exports for encryption functionality
 *
 * This module provides end-to-end encryption capabilities including:
 * - AES-256-GCM message encryption
 * - RSA key pair management
 * - Session key management
 * - Secure key storage with Redis
 *
 * @example
 * ```typescript
 * import { EncryptionModule, EncryptionService } from '@infrastructure/encryption';
 *
 * // In your module
 * @Module({
 *   imports: [EncryptionModule],
 * })
 * export class MyModule {}
 *
 * // In your service
 * constructor(private readonly encryptionService: EncryptionService) {}
 *
 * async encryptMessage(message: string, conversationId: string) {
 *   const result = await this.encryptionService.encrypt(message, {
 *     conversationId,
 *   });
 *
 *   if (result.success) {
 *     return result.data;
 *   } else {
 *     throw new Error(result.message);
 *   }
 * }
 * ```
 */

// Module
export { EncryptionModule } from './encryption.module';

// Services
export { EncryptionService } from './encryption.service';
export { KeyManagementService } from './key-management.service';

// Interfaces
export * from './interfaces';

// DTOs
export * from './dto';
