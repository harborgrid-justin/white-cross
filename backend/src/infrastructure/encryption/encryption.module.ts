/**
 * @fileoverview Encryption Module
 * @module infrastructure/encryption
 * @description NestJS module for end-to-end encryption functionality
 *
 * Provides:
 * - Message encryption/decryption services
 * - RSA key pair management
 * - Session key management
 * - Integration with Redis cache
 *
 * Usage:
 * ```typescript
 * import { EncryptionModule } from './infrastructure/encryption';
 *
 * @Module({
 *   imports: [EncryptionModule],
 * })
 * export class AppModule {}
 * ```
 */

import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '../cache/cache.module';
import { EncryptionService } from './encryption.service';
import { KeyManagementService } from './key-management.service';

/**
 * Encryption Module
 * Provides encryption services throughout the application
 */
@Global()
@Module({
  imports: [
    ConfigModule,
    CacheModule, // For Redis integration
  ],
  providers: [EncryptionService, KeyManagementService],
  exports: [EncryptionService, KeyManagementService],
})
export class EncryptionModule {}
