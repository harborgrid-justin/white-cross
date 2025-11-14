import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SecurityController } from './security.controller';
import {
  IpRestrictionService,
  SecurityIncidentService,
  SessionManagementService,
  ThreatDetectionService,
} from './services';
import { IpRestrictionGuard, SecurityPolicyGuard } from './guards';
import { SecurityLoggingInterceptor } from './interceptors';
import { IpRestriction, LoginAttempt, SecurityIncident, Session } from '@/database/models';

/**
 * Security Module
 * Provides comprehensive security features including IP restrictions,
 * threat detection, incident management, and session tracking
 */
@Module({
  imports: [
    SequelizeModule.forFeature([
      IpRestriction,
      SecurityIncident,
      LoginAttempt,
      Session,
    ]),
  ],
  controllers: [SecurityController],
  providers: [
    // Services
    IpRestrictionService,
    SecurityIncidentService,
    ThreatDetectionService,
    SessionManagementService,

    // Guards
    IpRestrictionGuard,
    SecurityPolicyGuard,

    // Interceptors
    SecurityLoggingInterceptor,
  ],
  exports: [
    // Export services for use by other modules
    IpRestrictionService,
    SecurityIncidentService,
    ThreatDetectionService,
    SessionManagementService,

    // Export guards for use in other modules
    IpRestrictionGuard,
    SecurityPolicyGuard,

    // Export interceptor for use in other modules
    SecurityLoggingInterceptor,
  ],
})
export class SecurityModule {}
