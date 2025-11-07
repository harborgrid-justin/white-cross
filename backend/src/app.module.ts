/**
 * Root Application Module
 * White Cross School Health Platform - NestJS Backend
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { Redis } from 'ioredis';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { IpRestrictionGuard } from './access-control/guards/ip-restriction.guard';
import { CsrfGuard } from './middleware/security/csrf.guard';
import { HealthRecordModule } from './health-record/health-record.module';
import { UserModule } from './user/user.module';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import {
  appConfig,
  databaseConfig,
  authConfig,
  securityConfig,
  redisConfig,
  awsConfig,
  cacheConfig,
  queueConfig,
  validationSchema,
  AppConfigService,
  loadConditionalModules,
  FeatureFlags,
} from './config';

import { AnalyticsModule } from './analytics/analytics.module';
import { ChronicConditionModule } from './chronic-condition/chronic-condition.module';
// import { AllergyModule } from './allergy/allergy.module'; // Already converted to Sequelize
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
import { CoreModule } from './core/core.module';
import { SentryModule } from './infrastructure/monitoring/sentry.module';

@Module({
  imports: [
    // Core module (CRITICAL - provides global exception filters, interceptors, and pipes)
    // MUST be imported first to ensure proper error handling and logging
    CoreModule,

    // Sentry module for error tracking and monitoring (global)
    SentryModule,

    // Configuration module with validation and type-safe namespaces
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      envFilePath: ((): string[] => {
        const env = process.env.NODE_ENV || 'development';
        return [`.env.${env}.local`, `.env.${env}`, '.env.local', '.env'];
      })(),
      load: [
        appConfig,
        databaseConfig,
        authConfig,
        securityConfig,
        redisConfig,
        awsConfig,
        cacheConfig,
        queueConfig,
      ],
      validationSchema,
      validationOptions: {
        abortEarly: false, // Show all validation errors
        allowUnknown: true, // Allow extra env vars
      },
    }),

    // Rate limiting module (CRITICAL SECURITY)
    // Redis-backed distributed rate limiting for horizontal scaling
    // Uses ConfigService for environment-aware throttle limits
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Get configuration values directly from ConfigService
        const redisConfig = configService.get('redis.cache');
        const throttleConfig = configService.get('app.throttle');

        // Create Redis client for throttler storage
        const redisClient = new Redis({
          host: redisConfig.host,
          port: redisConfig.port,
          password: redisConfig.password,
          username: redisConfig.username,
          db: 0, // Use default database for throttler
          keyPrefix: 'throttler:',
          retryStrategy: (times: number) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
          maxRetriesPerRequest: 3,
        });

        return {
          throttlers: [
            {
              name: 'short',
              ttl: throttleConfig.short.ttl,
              limit: throttleConfig.short.limit,
            },
            {
              name: 'medium',
              ttl: throttleConfig.medium.ttl,
              limit: throttleConfig.medium.limit,
            },
            {
              name: 'long',
              ttl: throttleConfig.long.ttl,
              limit: throttleConfig.long.limit,
            },
          ],
          storage: new ThrottlerStorageRedisService(redisClient),
        };
      },
    }),

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

    ChronicConditionModule,

    // AllergyModule, // Already converted to Sequelize

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

    MobileModule,

    PdfModule,

    AcademicTranscriptModule,

    AiSearchModule,

    AlertsModule,

    FeaturesModule,

    HealthDomainModule,

    InterfacesModule,

    SharedModule,

    EmergencyBroadcastModule,

    HealthRiskAssessmentModule,

    GradeTransitionModule,

    HealthMetricsModule,

    MedicationInteractionModule,

    HealthRiskAssessmentModule,

    EmergencyContactModule,

    // Feature modules
    MedicationModule,
    StudentModule,
    AppointmentModule,

    // Conditionally loaded modules based on feature flags
    // Uses centralized FeatureFlags helper to avoid direct process.env access
    ...loadConditionalModules([
      {
        module: AnalyticsModule,
        condition: FeatureFlags.isAnalyticsEnabled,
        description: 'Analytics Module',
      },
      {
        module: ReportModule,
        condition: FeatureFlags.isReportingEnabled,
        description: 'Report Module',
      },
      {
        module: DashboardModule,
        condition: FeatureFlags.isDashboardEnabled,
        description: 'Dashboard Module',
      },
      {
        module: AdvancedFeaturesModule,
        condition: FeatureFlags.isAdvancedFeaturesEnabled,
        description: 'Advanced Features Module',
      },
      {
        module: EnterpriseFeaturesModule,
        condition: FeatureFlags.isEnterpriseEnabled,
        description: 'Enterprise Features Module',
      },
      {
        module: DiscoveryExampleModule,
        condition: FeatureFlags.isDiscoveryEnabled,
        description: 'Discovery Module (development only)',
      },
      {
        module: CommandsModule,
        condition: FeatureFlags.isCliModeEnabled,
        description: 'Commands Module (CLI mode)',
      },
    ]),
  ],
  controllers: [],
  providers: [
    // Global configuration service (type-safe configuration access)
    AppConfigService,

    /**
     * GLOBAL INTERCEPTORS
     *
     * Response Transform Interceptor - Wraps all responses in standard envelope format
     * Ensures consistent API response structure across all endpoints
     */
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },

    /**
     * CRITICAL FIX: Corrected Global Guard Ordering + CSRF Protection
     *
     * Guards are executed in the order they are registered.
     * Proper security layering requires:
     *
     * 1. ThrottlerGuard (FIRST) - Rate limiting to prevent brute force attacks
     *    - Runs before expensive JWT validation
     *    - Prevents authentication endpoint abuse
     *    - Redis-backed for distributed rate limiting across multiple servers
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
     * 4. CsrfGuard (FOURTH) - CSRF token validation
     *    - Protects against Cross-Site Request Forgery attacks
     *    - Validates CSRF tokens on state-changing requests (POST, PUT, DELETE, PATCH)
     *    - Runs after authentication so user context is available
     *    - Skips for API-only endpoints and public routes
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
     * - ThrottlerGuard → IpRestrictionGuard → JwtAuthGuard → CsrfGuard
     */

    // 1. RATE LIMITING - Prevent brute force attacks (RUNS FIRST)
    // Redis-backed distributed rate limiting for horizontal scaling
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

    // 4. CSRF PROTECTION - Prevent Cross-Site Request Forgery (RUNS FOURTH)
    {
      provide: APP_GUARD,
      useClass: CsrfGuard,
    },
  ],
  exports: [
    // Export AppConfigService for use in other modules
    AppConfigService,
  ],
})
export class AppModule {}
