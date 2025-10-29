import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SecurityController } from './security.controller';
import { IpRestrictionService } from './services/ip-restriction.service';
import { SecurityIncidentService } from './services/security-incident.service';
import { ThreatDetectionService } from './services/threat-detection.service';
import { SessionManagementService } from './services/session-management.service';
import { IpRestrictionGuard } from './guards/ip-restriction.guard';
import { SecurityPolicyGuard } from './guards/security-policy.guard';
import { SecurityLoggingInterceptor } from './interceptors/security-logging.interceptor';
import {
  IpRestrictionEntity,
  SecurityIncidentEntity,
  LoginAttemptEntity,
  SessionEntity,
} from './entities';

/**
 * Security Module
 * Provides comprehensive security features including IP restrictions,
 * threat detection, incident management, and session tracking
 */
@Module({
  imports: [
    SequelizeModule.forFeature([
      IpRestrictionEntity,
      SecurityIncidentEntity,
      LoginAttemptEntity,
      SessionEntity,
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
