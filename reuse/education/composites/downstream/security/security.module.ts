/**
 * Security Module
 * Provides authentication, authorization, and security services
 */

import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

// Authentication
import { JwtAuthenticationService } from './auth/jwt-authentication.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

// Guards
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { ApiKeyGuard } from './guards/api-key.guard';

// Services
import { EncryptionService } from './services/encryption.service';
import { AuditService } from './services/audit.service';

// Interceptors
import { AuditInterceptor } from './interceptors/audit.interceptor';

/**
 * Security Module
 *
 * This module provides comprehensive security features:
 * - JWT Authentication
 * - Role-Based Access Control (RBAC)
 * - Permission-Based Authorization
 * - API Key Authentication
 * - Encryption Services
 * - Audit Logging
 *
 * Import this module in your AppModule to enable security features.
 */
@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'development-secret-key',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION') || '1h',
          issuer: 'white-cross-platform',
          audience: 'white-cross-api',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    // Authentication
    JwtAuthenticationService,
    JwtStrategy,
    LocalStrategy,

    // Services
    EncryptionService,
    AuditService,

    // Global Guards (Applied to all routes by default)
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },

    // Global Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
  exports: [
    JwtAuthenticationService,
    EncryptionService,
    AuditService,
    JwtModule,
    PassportModule,
  ],
})
export class SecurityModule {}

export default SecurityModule;
