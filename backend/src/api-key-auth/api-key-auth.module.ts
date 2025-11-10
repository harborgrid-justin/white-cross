import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { ApiKeyAuthService } from './api-key-auth.service';
import { ApiKeyAuthController } from './api-key-auth.controller';
import { ApiKeyGuard } from './guards/api-key.guard';
import { ApiKeyEntity } from './entities/api-key.entity';

/**
 * API Key Authentication Module
 *
 * Provides API key-based authentication for service-to-service communication,
 * third-party integrations, and webhook endpoints.
 *
 * Features:
 * - API key generation with secure hashing (SHA-256)
 * - Key rotation and expiration
 * - Per-key rate limiting and scopes
 * - Comprehensive audit logging
 * - HIPAA-compliant access control
 *
 * @module ApiKeyAuthModule
 */
@Module({
  imports: [SequelizeModule.forFeature([ApiKeyEntity]), ConfigModule],
  controllers: [ApiKeyAuthController],
  providers: [ApiKeyAuthService, ApiKeyGuard],
  exports: [ApiKeyAuthService, ApiKeyGuard],
})
export class ApiKeyAuthModule {}
