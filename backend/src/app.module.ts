/**
 * Root Application Module
 * White Cross School Health Platform - NestJS Backend
 */
import { Module, Injectable, Optional } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { Redis } from 'ioredis';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule, JwtAuthGuard, TokenBlacklistService } from '@/services/auth';
import { AccessControlModule, IpRestrictionGuard } from '@/services/access-control';
import { CsrfGuard } from './middleware/security';
import { HealthRecordModule } from './health-record';
import { UserModule } from '@/services/user';

/**
 * Global Authentication Guard
 * Wraps JwtAuthGuard to ensure proper dependency injection in AppModule context
 */
@Injectable()
export class GlobalAuthGuard extends JwtAuthGuard {
  constructor(reflector: Reflector, @Optional() tokenBlacklistService?: TokenBlacklistService) {
    super(reflector, tokenBlacklistService);
  }
}
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import {
  appConfig,
  AppConfigService,
  authConfig,
  awsConfig,
  cacheConfig,
  databaseConfig,
  FeatureFlags,
  loadConditionalModules,
  queueConfig,
  redisConfig,
  securityConfig,
  validationSchema,
} from './config';

import { AnalyticsModule } from './analytics';
import { ChronicConditionModule } from '@/services/chronic-condition';
// import { AllergyModule } from './allergy/allergy.module'; // Already converted to Sequelize
import { BudgetModule } from '@/services/budget';
import { AdministrationModule } from '@/services/administration';
import { AuditModule } from '@/services/audit';
import { ContactModule } from '@/services/communication/contact';
import { ComplianceModule } from './compliance';
import { ClinicalModule } from '@/services/clinical';
import { IncidentReportModule } from './incident-report';
import { IntegrationModule } from './integration';
import { IntegrationsModule } from './integrations';
import { SecurityModule } from '@/services/security';
import { ReportModule } from './report';
import { MobileModule } from '@/services/mobile';
import { PdfModule } from './pdf';
import { AcademicTranscriptModule } from '@/services/academic-transcript';
import { AiSearchModule } from './ai-search';
import { AlertsModule } from '@/services/alerts';
import { FeaturesModule } from './features';
import { HealthDomainModule } from './health-domain';
import { InterfacesModule } from './interfaces/interfaces.module';
import { SharedModule } from './common/shared.module';
import { DashboardModule } from '@/services/dashboard';
import { AdvancedFeaturesModule } from './advanced-features';
import { ConfigurationModule } from './configuration';
import { EmergencyBroadcastModule } from '@/services/communication/emergency-broadcast';
import { GradeTransitionModule } from './grade-transition';
import { EnterpriseFeaturesModule } from './enterprise-features';
import { HealthMetricsModule } from './health-metrics';
import { MedicationInteractionModule } from './medication-interaction';
import { HealthRiskAssessmentModule } from './health-risk-assessment';
import { EmergencyContactModule } from '@/services/communication/emergency-contact';
import { EmailModule } from './infrastructure/email';
import { SmsModule } from './infrastructure/sms';
import { MonitoringModule } from './infrastructure/monitoring';
import { JobsModule } from './infrastructure/jobs';
import { WebSocketModule } from './infrastructure/websocket';
import { GraphQLModule } from './infrastructure/graphql';
import { CoreMiddlewareModule } from './middleware/core';
import { WorkersModule } from '@/services/workers';
import { MedicationModule } from '@/services/medication';
import { StudentModule } from '@/services/student';
import { AppointmentModule } from '@/services/appointment';
import { DiscoveryExampleModule } from './discovery';
import { CommandsModule } from './commands';
import { CoreModule } from './core';
import { SentryModule } from './infrastructure/monitoring/sentry.module';
import { VaccinationsModule } from '@/services/vaccinations/vaccinations.module';

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
      envFilePath: [`.env.local`, `.env`],
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
            return Math.min(times * 50, 2000);
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

    // Database connection (Sequelize) - must be first
    DatabaseModule,

    // Authentication module - must be early for global guards
    AuthModule,

    // Core middleware (RBAC, validation, session management)
    CoreMiddlewareModule,

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
    VaccinationsModule,

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

    // Core NestJS services required by guards
    Reflector,

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
     * - ThrottlerGuard → IpRestrictionGuard → GlobalAuthGuard → CsrfGuard
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
    // Uses factory to properly inject dependencies from AuthModule
    {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector, tokenBlacklistService: TokenBlacklistService) => {
        return new GlobalAuthGuard(reflector, tokenBlacklistService);
      },
      inject: [Reflector, TokenBlacklistService],
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
