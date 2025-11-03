/**
 * Root Application Module - FIXED VERSION
 * White Cross School Health Platform - NestJS Backend
 *
 * FIXES APPLIED:
 * - Corrected global guard ordering (ThrottlerGuard before JwtAuthGuard)
 * - Added IpRestrictionGuard for early IP filtering
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { IpRestrictionGuard } from './access-control/guards/ip-restriction.guard';
import { HealthRecordModule } from './health-record/health-record.module';
import { UserModule } from './user/user.module';
import {
  appConfig,
  databaseConfig,
  authConfig,
  securityConfig,
  redisConfig,
  validationSchema,
  AppConfigService,
} from './config';

import { AnalyticsModule } from './analytics/analytics.module';
import { ChronicConditionModule } from './chronic-condition/chronic-condition.module';
import { BudgetModule } from './budget/budget.module';
import { AdministrationModule } from './administration/administration.module';
import { AuditModule } from './audit/audit.module';
import { AccessControlModule } from './access-control/access-control.module';
import { ContactModule } from './contact/contact.module';
import { ComplianceModule } from './compliance/compliance.module';
import { ClinicalModule } from './clinical/clinical.module';
import { IncidentReportModule } from './incident-report/incident-report.module';
import { IntegrationModule } from './integration/integration.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { SecurityModule } from './security/security.module';
import { ReportModule } from './report/report.module';
import { MobileModule } from './mobile/mobile.module';
import { PdfModule } from './pdf/pdf.module';
import { AcademicTranscriptModule } from './academic-transcript/academic-transcript.module';
import { AiSearchModule } from './ai-search/ai-search.module';
import { AlertsModule } from './alerts/alerts.module';
import { FeaturesModule } from './features/features.module';
import { HealthDomainModule } from './health-domain/health-domain.module';
import { InterfacesModule } from './interfaces/interfaces.module';
import { SharedModule } from './shared/shared.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AdvancedFeaturesModule } from './advanced-features/advanced-features.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { EmergencyBroadcastModule } from './emergency-broadcast/emergency-broadcast.module';
import { GradeTransitionModule } from './grade-transition/grade-transition.module';
import { EnterpriseFeaturesModule } from './enterprise-features/enterprise-features.module';
import { HealthMetricsModule } from './health-metrics/health-metrics.module';
import { MedicationInteractionModule } from './medication-interaction/medication-interaction.module';
import { HealthRiskAssessmentModule } from './health-risk-assessment/health-risk-assessment.module';
import { EmergencyContactModule } from './emergency-contact/emergency-contact.module';
import { EmailModule } from './infrastructure/email/email.module';
import { SmsModule } from './infrastructure/sms/sms.module';
import { MonitoringModule } from './infrastructure/monitoring/monitoring.module';
import { JobsModule } from './infrastructure/jobs/jobs.module';
import { WebSocketModule } from './infrastructure/websocket/websocket.module';
import { GraphQLModule } from './infrastructure/graphql/graphql.module';
import { CoreMiddlewareModule } from './middleware/core/core-middleware.module';
import { WorkersModule } from './workers/workers.module';
import { MedicationModule } from './medication/medication.module';
import { StudentModule } from './student/student.module';
import { AppointmentModule } from './appointment/appointment.module';
import { DiscoveryExampleModule } from './discovery/discovery.module';
import { CommandsModule } from './commands/commands.module';

@Module({
  imports: [
    // Configuration module with validation and type-safe namespaces
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV}.local`,
        `.env.${process.env.NODE_ENV}`,
        '.env.local',
        '.env',
      ],
      load: [
        appConfig,
        databaseConfig,
        authConfig,
        securityConfig,
        redisConfig,
      ],
      validationSchema,
      validationOptions: {
        abortEarly: false, // Show all validation errors
        allowUnknown: true, // Allow extra env vars
      },
    }),

    // Rate limiting module (CRITICAL SECURITY)
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 10, // 10 requests per second
      },
      {
        name: 'medium',
        ttl: 10000, // 10 seconds
        limit: 50, // 50 requests per 10 seconds
      },
      {
        name: 'long',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Database connection (Sequelize)
    DatabaseModule,

    // Core middleware (RBAC, validation, session management)
    CoreMiddlewareModule,

    // Authentication module
    AuthModule,

    // Security module (IP restrictions, threat detection, incidents)
    SecurityModule,

    // Access Control module (required for IpRestrictionGuard)
    AccessControlModule,

    // Infrastructure modules
    MonitoringModule,
    EmailModule,
    SmsModule,
    JobsModule,
    WebSocketModule,
    GraphQLModule,
    WorkersModule,

    // Core modules
    UserModule,
    HealthRecordModule,

    // Analytics module
    AnalyticsModule,

    ChronicConditionModule,

    BudgetModule,

    AdministrationModule,

    // Configuration module (comprehensive configuration management)
    ConfigurationModule,

    AuditModule,

    ContactModule,

    ComplianceModule,

    // Clinical module (Drug Interactions & Clinic Visits)
    ClinicalModule,

    IncidentReportModule,

    IntegrationModule,

    // Integration clients module (external API integrations with circuit breaker and rate limiting)
    IntegrationsModule,

    ReportModule,

    MobileModule,

    PdfModule,

    AcademicTranscriptModule,

    AiSearchModule,

    AlertsModule,

    FeaturesModule,

    HealthDomainModule,

    InterfacesModule,

    SharedModule,

    DashboardModule,

    AdvancedFeaturesModule,

    EmergencyBroadcastModule,

    HealthRiskAssessmentModule,

    GradeTransitionModule,

    EnterpriseFeaturesModule,

    HealthMetricsModule,

    MedicationInteractionModule,

    HealthRiskAssessmentModule,

    EmergencyContactModule,

    // Feature modules
    MedicationModule,
    StudentModule,
    AppointmentModule,

    // Discovery module (for runtime introspection and metadata discovery)
    DiscoveryExampleModule,

    // Commands module (for CLI commands like seeding)
    CommandsModule,
  ],
  controllers: [],
  providers: [
    // Global configuration service (type-safe configuration access)
    AppConfigService,

    /**
     * CRITICAL FIX: Corrected Global Guard Ordering
     *
     * Guards are executed in the order they are registered.
     * Proper security layering requires:
     *
     * 1. ThrottlerGuard (FIRST) - Rate limiting to prevent brute force attacks
     *    - Runs before expensive JWT validation
     *    - Prevents authentication endpoint abuse
     *    - Low overhead: O(1) in-memory lookup
     *
     * 2. IpRestrictionGuard (SECOND) - IP-based access control
     *    - Blocks known malicious IPs early
     *    - Prevents banned IPs from consuming resources
     *    - Database lookup but cached
     *
     * 3. JwtAuthGuard (THIRD) - JWT authentication
     *    - Most expensive guard (JWT verification, token blacklist check)
     *    - Only runs for requests that pass rate limiting and IP checks
     *    - Adds user context to request
     *
     * Old (WRONG) Order:
     * - JwtAuthGuard (expensive operation)
     * - ThrottlerGuard (rate limiting)
     *
     * Impact of Wrong Order:
     * - Attackers could brute force authentication before rate limiting
     * - Higher server load from JWT verification
     * - Token blacklist lookups for every attack attempt
     *
     * New (CORRECT) Order:
     * - ThrottlerGuard → IpRestrictionGuard → JwtAuthGuard
     */

    // 1. RATE LIMITING - Prevent brute force attacks (RUNS FIRST)
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },

    // 2. IP RESTRICTION - Block malicious IPs early (RUNS SECOND)
    {
      provide: APP_GUARD,
      useClass: IpRestrictionGuard,
    },

    // 3. AUTHENTICATION - Validate JWT tokens (RUNS THIRD)
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [
    // Export AppConfigService for use in other modules
    AppConfigService,
  ],
})
export class AppModule {}
