import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SecurityController } from './security.controller';
import {
  IpRestrictionService,
  SecurityIncidentService,
  SessionManagementService,
  ThreatDetectionService,
} from '@/security/services';
import { IpRestrictionGuard, SecurityPolicyGuard } from '@/security/guards';
import { SecurityLoggingInterceptor } from '@/security/interceptors';
import { IpRestrictionEntity } from './entities/ip-restriction.entity';
import { LoginAttemptEntity } from './entities/login-attempt.entity';
import { SecurityIncidentEntity } from './entities/security-incident.entity';
import { SessionEntity } from './entities/session.entity';

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
