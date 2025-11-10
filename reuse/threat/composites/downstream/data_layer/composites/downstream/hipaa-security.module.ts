/**
 * HIPAA Security Module
 *
 * Centralized module that integrates all HIPAA compliance components
 *
 * Features:
 * - Session Management
 * - PHI Encryption
 * - Multi-Factor Authentication
 * - Break-Glass Emergency Access
 * - SIEM Integration
 * - RBAC (Role-Based Access Control)
 * - Compliance Verification
 *
 * @module hipaa-security.module
 */

import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

// Services
import { HIPAASessionManagementService, HIPAASessionGuard } from './hipaa-session-management';
import { HIPAAPHIEncryptionService } from './hipaa-phi-encryption';
import { MFAService } from './services/mfa.service';
import { EmergencyAccessService } from './services/emergency-access.service';
import { SIEMIntegrationService } from './services/siem-integration.service';
import { RBACService } from './services/rbac.service';
import { HIPAAComplianceService } from './services/hipaa-compliance.service';
import { KeyManagementService } from './services/key-management.service';

// Guards
import { MFAGuard } from './filters/mfa.guard';
import { RolesGuard, PermissionsGuard } from './filters/rbac.guards';

@Global()
@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // JWT Authentication
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get('JWT_EXPIRATION', '15m'),
          issuer: 'white-cross-healthcare',
          audience: 'white-cross-api',
          algorithm: 'HS256',
        },
      }),
    }),

    // Redis for session management
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        config: {
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get('REDIS_PORT', 6379),
          password: config.get('REDIS_PASSWORD'),
          db: config.get('REDIS_AUTH_DB', 0),
          tls: config.get('NODE_ENV') === 'production' ? {} : undefined,
          keyPrefix: 'hipaa:',
        },
      }),
    }),
  ],

  providers: [
    // Core Services
    HIPAASessionManagementService,
    HIPAAPHIEncryptionService,
    MFAService,
    EmergencyAccessService,
    SIEMIntegrationService,
    RBACService,
    HIPAAComplianceService,
    KeyManagementService,

    // Global Guards (applied to all routes)
    {
      provide: APP_GUARD,
      useClass: HIPAASessionGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_GUARD,
      useClass: MFAGuard,
    },
  ],

  exports: [
    // Export services for use in other modules
    HIPAASessionManagementService,
    HIPAAPHIEncryptionService,
    MFAService,
    EmergencyAccessService,
    SIEMIntegrationService,
    RBACService,
    HIPAAComplianceService,
    KeyManagementService,
  ],
})
export class HIPAASecurityModule {}

/**
 * HIPAA Security Configuration
 */
export const HIPAASecurityConfig = {
  // Session Management
  session: {
    ttl: parseInt(process.env.SESSION_TTL || '900', 10), // 15 minutes
    idleTimeout: parseInt(process.env.IDLE_TIMEOUT || '900', 10),
    maxConcurrent: parseInt(process.env.MAX_CONCURRENT_SESSIONS || '3', 10),
  },

  // Encryption
  encryption: {
    algorithm: 'aes-256-gcm',
    keyLength: 32, // 256 bits
    ivLength: 16, // 128 bits
  },

  // MFA
  mfa: {
    enabled: process.env.MFA_ENABLED === 'true',
    requiredRoles: ['admin', 'super_admin', 'physician'],
    backupCodesCount: 10,
    trustedDeviceTTL: 30 * 24 * 60 * 60, // 30 days
  },

  // Emergency Access
  emergencyAccess: {
    defaultDuration: 2 * 60 * 60, // 2 hours
    maxConcurrent: 3,
    requiresJustification: true,
    alertSecurityTeam: true,
  },

  // SIEM
  siem: {
    enabled: process.env.SIEM_ENABLED === 'true',
    platforms: ['splunk', 'elk', 'datadog', 'sentinel'],
    batchSize: 100,
    batchInterval: 5000, // 5 seconds
  },

  // Audit
  audit: {
    hmacSecret: process.env.AUDIT_HMAC_SECRET,
    retentionDays: 6 * 365, // 6 years for HIPAA
    integrityChecks: true,
  },

  // Compliance
  compliance: {
    autoVerify: true,
    reportInterval: 24 * 60 * 60 * 1000, // 24 hours
    alertThreshold: 80, // Alert if compliance drops below 80%
  },
};

export default HIPAASecurityModule;
