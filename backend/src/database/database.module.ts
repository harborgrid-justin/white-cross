/**
 * Database Module
 * Central module providing all database infrastructure services
 *
 * Provides:
 * - Sequelize ORM configuration with optimized connection pooling
 * - Cache management (in-memory and Redis support)
 * - Audit logging (HIPAA-compliant)
 * - Repository pattern with enterprise features
 * - Unit of Work for transaction management
 * - Database types and utilities
 * - Performance monitoring and connection pool tracking
 * - Query logging and slow query detection
 * - Query result caching with automatic invalidation
 */

import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Services
import {
  AuditService,
  AuditLoggingService,
  AuditQueryService,
  AuditStatisticsService,
  AuditComplianceService,
  AuditExportService,
  AuditRetentionService,
  AuditHelperService,
  CacheMonitoringService,
  CacheService,
  ConnectionMonitorService,
  MaterializedViewService,
  ModelAuditHelper,
  QueryCacheService,
  QueryLoggerService,
} from './services';
import { SequelizeUnitOfWorkService } from './uow';

// Core Models
// Academic Models
// Healthcare Models
// Communication Models
// System Models
// Health Risk Assessment Models
// Medication Models
// Clinical Models
// Analytics Models
// Inventory Models
// Compliance Models
// Alert Models
// Integration & Sync Models
// Budget Models
// Report Models
// Training Models
import {
  AcademicTranscript,
  Alert,
  AlertPreferences,
  AlertRule,
  Allergy,
  AnalyticsReport,
  Appointment,
  AppointmentReminder,
  AppointmentWaitlist,
  AuditLog,
  BackupLog,
  BudgetCategory,
  BudgetTransaction,
  ChronicCondition,
  ClinicalNote,
  ClinicalProtocol,
  ClinicVisit,
  ComplianceChecklistItem,
  ComplianceReport,
  ComplianceViolation,
  ConfigurationHistory,
  ConsentForm,
  ConsentSignature,
  Contact,
  DataRetentionPolicy,
  DeliveryLog,
  DeviceToken,
  District,
  DrugCatalog,
  DrugInteraction,
  EmergencyBroadcast,
  EmergencyContact,
  FollowUpAction,
  FollowUpAppointment,
  GrowthTracking,
  HealthMetricSnapshot,
  HealthRecord,
  HealthScreening,
  Immunization,
  IncidentReport,
  IntegrationConfig,
  IntegrationLog,
  InventoryItem,
  InventoryTransaction,
  LabResults,
  License,
  MaintenanceLog,
  MedicalHistory,
  Medication,
  MedicationLog,
  MentalHealthRecord,
  Message,
  MessageDelivery,
  MessageTemplate,
  PerformanceMetric,
  PhiDisclosure,
  PhiDisclosureAudit,
  PolicyAcknowledgment,
  PolicyDocument,
  Prescription,
  PurchaseOrder,
  PurchaseOrderItem,
  PushNotification,
  RemediationAction,
  ReportExecution,
  ReportSchedule,
  ReportTemplate,
  School,
  SISSyncConflict,
  Student,
  StudentDrugAllergy,
  StudentMedication,
  Supplier,
  SyncConflict,
  SyncQueueItem,
  SyncSession,
  SyncState,
  SystemConfig,
  ThreatDetection,
  TrainingModule,
  TreatmentPlan,
  User,
  Vaccination,
  Vendor,
  VitalSigns,
  Webhook,
  WitnessStatement,
} from '@/database/models';

// Sample Repositories (add more as they are migrated)
import {
  AcademicTranscriptRepository,
  AllergyRepository,
  AppointmentReminderRepository,
  AppointmentRepository,
  AppointmentWaitlistRepository,
  ChronicConditionRepository,
  ComplianceChecklistItemRepository,
  ComplianceReportRepository,
  ComplianceViolationRepository,
  ConsentFormRepository,
  ConsentSignatureRepository,
  DataRetentionPolicyRepository,
  EmergencyBroadcastRepository,
  HealthRecordRepository,
  IncidentReportRepository,
  MedicationLogRepository,
  PolicyDocumentRepository,
  StudentRepository,
} from '@/database/repositories/impl';

/**
 * Database Module
 * Global module providing database infrastructure throughout the application
 */
@Global()
@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL');
        const isProduction = configService.get('NODE_ENV') === 'production';
        const isDevelopment = configService.get('NODE_ENV') === 'development';

        if (databaseUrl) {
          // Use DATABASE_URL if provided (for cloud deployments)
          return {
            dialect: 'postgres',
            uri: databaseUrl,
            autoLoadModels: true,
            synchronize: configService.get('database.synchronize', false),
            alter: configService.get('database.synchronize', false),
            // OPTIMIZATION: Enhanced logging with slow query detection
            // HIPAA COMPLIANCE: Always log in production for audit trail
            logging: isProduction
              ? (sql: string, timing?: number) => {
                  // Always log queries in production for HIPAA compliance
                  console.log(
                    `[DB] ${sql.substring(0, 200)}${sql.length > 200 ? '...' : ''}`,
                  );
                  // Also warn about slow queries
                  if (timing && timing > 1000) {
                    console.warn(
                      `SLOW QUERY (${timing}ms): ${sql.substring(0, 200)}...`,
                    );
                  }
                }
              : isDevelopment
                ? console.log
                : false,
            benchmark: true,
            // V6 recommended options
            define: {
              timestamps: true,
              underscored: false,
              freezeTableName: true,
            },
            // OPTIMIZATION: Production-ready connection pool configuration from environment
            pool: {
              max: configService.get<number>(
                'DB_POOL_MAX',
                isProduction ? 20 : 10,
              ),
              min: configService.get<number>(
                'DB_POOL_MIN',
                isProduction ? 5 : 2,
              ),
              acquire: configService.get<number>('DB_ACQUIRE_TIMEOUT', 60000),
              idle: configService.get<number>('DB_IDLE_TIMEOUT', 10000),
              evict: 1000, // Check for idle connections every 1s
              handleDisconnects: true,
              validate: (connection: any) => {
                return connection && !connection._closed;
              },
            },
            // Retry configuration for connection failures
            retry: {
              match: [
                /ETIMEDOUT/,
                /EHOSTUNREACH/,
                /ECONNRESET/,
                /ECONNREFUSED/,
                /EHOSTDOWN/,
                /ENETDOWN/,
                /ENETUNREACH/,
                /EAI_AGAIN/,
                /connection is insecure/,
                /SSL connection has been closed unexpectedly/,
              ],
              max: 5, // Increased retry attempts for cloud databases
            },
            dialectOptions: {
              ...(databaseUrl.includes('sslmode=require')
                ? {
                    ssl: {
                      require: true,
                      // SECURITY: Only validate certificates in production for security
                      rejectUnauthorized: isProduction,
                    },
                  }
                : {}),
              application_name: 'white-cross-app',
              statement_timeout: 60000, // Increased to 60s for index operations
              idle_in_transaction_session_timeout: 30000,
            },
          };
        } else {
          // Use individual connection parameters for local development
          const sslEnabled =
            configService.get<boolean>('database.ssl', false) ||
            configService.get<boolean>('DB_SSL', false);

          return {
            dialect: 'postgres',
            host: configService.get('database.host', 'localhost'),
            port: configService.get<number>('database.port', 5432),
            username: configService.get('database.username', 'postgres'),
            password: configService.get('database.password'),
            database: configService.get('database.database', 'whitecross'),
            autoLoadModels: true,
            synchronize: configService.get('database.synchronize', false),
            alter: configService.get('database.synchronize', false),
            // OPTIMIZATION: Enhanced logging with slow query detection
            // HIPAA COMPLIANCE: Always log in production for audit trail
            logging: isProduction
              ? (sql: string, timing?: number) => {
                  // Always log queries in production for HIPAA compliance
                  console.log(
                    `[DB] ${sql.substring(0, 200)}${sql.length > 200 ? '...' : ''}`,
                  );
                  // Also warn about slow queries
                  if (timing && timing > 1000) {
                    console.warn(
                      `SLOW QUERY (${timing}ms): ${sql.substring(0, 200)}...`,
                    );
                  }
                }
              : isDevelopment
                ? console.log
                : false,
            benchmark: true,
            // V6 recommended options
            define: {
              timestamps: true,
              underscored: false,
              freezeTableName: true,
            },
            // OPTIMIZATION: Production-ready connection pool configuration from environment
            pool: {
              max: configService.get<number>(
                'DB_POOL_MAX',
                isProduction ? 20 : 10,
              ),
              min: configService.get<number>(
                'DB_POOL_MIN',
                isProduction ? 5 : 2,
              ),
              acquire: configService.get<number>('DB_ACQUIRE_TIMEOUT', 60000),
              idle: configService.get<number>('DB_IDLE_TIMEOUT', 10000),
              evict: 1000, // Check for idle connections every 1s
              handleDisconnects: true,
              validate: (connection: any) => {
                return connection && !connection._closed;
              },
            },
            // Retry configuration for connection failures
            retry: {
              match: [
                /ETIMEDOUT/,
                /EHOSTUNREACH/,
                /ECONNRESET/,
                /ECONNREFUSED/,
                /EHOSTDOWN/,
                /ENETDOWN/,
                /ENETUNREACH/,
                /EAI_AGAIN/,
                /connection is insecure/,
                /SSL connection has been closed unexpectedly/,
              ],
              max: 5, // Increased retry attempts for cloud databases
            },
            dialectOptions: {
              ...(sslEnabled
                ? {
                    ssl: {
                      require: true,
                      // SECURITY: Only validate certificates in production for security
                      rejectUnauthorized: isProduction,
                    },
                  }
                : {}),
              application_name: 'white-cross-app',
              statement_timeout: 60000, // 60s query timeout for index operations
              idle_in_transaction_session_timeout: 30000, // 30s idle transaction timeout
            },
          };
        }
      },
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([
      // Core Models
      AuditLog,
      Student,
      User,
      Contact,
      District,
      School,
      EmergencyContact,

      // Academic Models
      AcademicTranscript,

      // Healthcare Models
      Appointment,
      AppointmentReminder,
      AppointmentWaitlist,
      GrowthTracking,
      HealthRecord,
      HealthScreening,
      Immunization,
      LabResults,
      MedicalHistory,
      MentalHealthRecord,
      TreatmentPlan,
      VitalSigns,
      Prescription,
      ClinicVisit,
      ClinicalNote,
      ClinicalProtocol,
      FollowUpAction,
      FollowUpAppointment,

      // Health Risk Assessment Models
      Allergy,
      ChronicCondition,
      StudentMedication,
      IncidentReport,
      MedicationLog,
      WitnessStatement,

      // Medication Models
      Medication,
      Vaccination,

      // Clinical Models
      DrugCatalog,
      DrugInteraction,
      StudentDrugAllergy,

      // Analytics Models
      AnalyticsReport,
      HealthMetricSnapshot,

      // Inventory Models
      InventoryItem,
      InventoryTransaction,
      MaintenanceLog,
      PurchaseOrder,
      PurchaseOrderItem,
      Vendor,

      // Communication Models
      EmergencyBroadcast,
      Message,
      MessageDelivery,
      MessageTemplate,
      PushNotification,
      DeviceToken,

      // System Models
      Supplier,
      SyncState,
      SystemConfig,
      ThreatDetection,
      Webhook,
      License,
      ConfigurationHistory,
      BackupLog,
      PerformanceMetric,

      // Compliance Models
      ConsentForm,
      ConsentSignature,
      ComplianceReport,
      ComplianceChecklistItem,
      ComplianceViolation,
      PolicyDocument,
      PolicyAcknowledgment,
      DataRetentionPolicy,
      PhiDisclosure,
      PhiDisclosureAudit,
      RemediationAction,

      // Alert Models
      Alert,
      AlertRule,
      AlertPreferences,
      DeliveryLog,

      // Integration & Sync Models
      IntegrationConfig,
      IntegrationLog,
      SyncSession,
      SyncConflict,
      SyncQueueItem,
      SISSyncConflict,

      // Budget Models
      BudgetCategory,
      BudgetTransaction,

      // Report Models
      ReportTemplate,
      ReportExecution,
      ReportSchedule,

      // Training Models
      TrainingModule,
    ]),
  ],
  providers: [
    // Core Services with interface tokens
    {
      provide: 'ICacheManager',
      useClass: CacheService,
    },
    {
      provide: 'IAuditLogger',
      useClass: AuditService,
    },
    {
      provide: 'IUnitOfWork',
      useClass: SequelizeUnitOfWorkService,
    },

    // Audit Services
    AuditService,
    AuditHelperService,
    AuditLoggingService,
    AuditQueryService,
    AuditStatisticsService,
    AuditComplianceService,
    AuditExportService,
    AuditRetentionService,
    ModelAuditHelper,

    // Performance Monitoring Services
    ConnectionMonitorService,
    QueryLoggerService,
    QueryCacheService,
    CacheMonitoringService,

    // Materialized View Management
    MaterializedViewService,

    // Repository Implementations
    // Add repositories as they are migrated following this pattern:
    StudentRepository,
    AcademicTranscriptRepository,
    ConsentFormRepository,
    ConsentSignatureRepository,
    ComplianceChecklistItemRepository,
    ComplianceReportRepository,
    PolicyDocumentRepository,
    DataRetentionPolicyRepository,
    ComplianceViolationRepository,
    EmergencyBroadcastRepository,
    AppointmentRepository,
    HealthRecordRepository,
    MedicationLogRepository,
    IncidentReportRepository,
    AllergyRepository,
    ChronicConditionRepository,
    AppointmentReminderRepository,
    AppointmentWaitlistRepository,
    // MedicationRepository,
    // VaccinationRepository - TODO: Create this repository
    // etc.
  ],
  exports: [
    // Export SequelizeModule to make Sequelize instance available for injection
    SequelizeModule,

    // Export services for use in other modules
    'ICacheManager',
    'IAuditLogger',
    'IUnitOfWork',

    // Export audit services
    AuditService,
    AuditHelperService,
    AuditLoggingService,
    AuditQueryService,
    AuditStatisticsService,
    AuditComplianceService,
    AuditExportService,
    AuditRetentionService,
    ModelAuditHelper,

    // Export performance monitoring services
    ConnectionMonitorService,
    QueryLoggerService,
    QueryCacheService,
    CacheMonitoringService,

    // Export materialized view management
    MaterializedViewService,

    // Export repositories as they are added
    StudentRepository,
    AcademicTranscriptRepository,
    ConsentFormRepository,
    ConsentSignatureRepository,
    ComplianceChecklistItemRepository,
    ComplianceReportRepository,
    PolicyDocumentRepository,
    DataRetentionPolicyRepository,
    ComplianceViolationRepository,
    EmergencyBroadcastRepository,
    AppointmentRepository,
    AppointmentReminderRepository,
    AppointmentWaitlistRepository,
    HealthRecordRepository,
    MedicationLogRepository,
    IncidentReportRepository,
    AllergyRepository,
    ChronicConditionRepository,
    // etc.
  ],
})
export class DatabaseModule {}
