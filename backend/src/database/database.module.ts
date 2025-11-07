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

import { Module, Global } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';

// Services
import { CacheService } from '@/database/services';
import { AuditService } from '@/database/services';
import { ModelAuditHelper } from '@/database/services';
import { SequelizeUnitOfWorkService } from '@/database/uow';
import { ConnectionMonitorService } from '@/database/services';
import { QueryLoggerService } from '@/database/services';
import { QueryCacheService } from '@/database/services';
import { CacheMonitoringService } from '@/database/services';
import { MaterializedViewService } from '@/database/services';

// Core Models
import { AuditLog } from '@/database/models';
import { Student } from '@/database/models';
import { User } from '@/database/models';
import { Contact } from '@/database/models';
import { District } from '@/database/models';
import { School } from '@/database/models';
import { EmergencyContact } from '@/database/models';

// Academic Models
import { AcademicTranscript } from '@/database/models';

// Healthcare Models
import { Appointment } from '@/database/models';
import { AppointmentReminder } from '@/database/models';
import { AppointmentWaitlist } from '@/database/models';
import { GrowthTracking } from '@/database/models';
import { HealthRecord } from '@/database/models';
import { HealthScreening } from '@/database/models';
import { Immunization } from '@/database/models';
import { LabResults } from '@/database/models';
import { MedicalHistory } from '@/database/models';
import { MentalHealthRecord } from '@/database/models';
import { TreatmentPlan } from '@/database/models';
import { VitalSigns } from '@/database/models';
import { Prescription } from '@/database/models';
import { ClinicVisit } from '@/database/models';
import { ClinicalNote } from '@/database/models';
import { ClinicalProtocol } from '@/database/models';
import { FollowUpAction } from '@/database/models';
import { FollowUpAppointment } from '@/database/models';

// Communication Models
import { EmergencyBroadcast } from '@/database/models';
import { Message } from '@/database/models';
import { MessageDelivery } from '@/database/models';
import { MessageTemplate } from '@/database/models';
import { PushNotification } from '@/database/models';
import { DeviceToken } from '@/database/models';

// System Models
import { Supplier } from '@/database/models';
import { SyncState } from '@/database/models';
import { SystemConfig } from '@/database/models';
import { ThreatDetection } from '@/database/models';
import { Webhook } from '@/database/models';
import { License } from '@/database/models';
import { ConfigurationHistory } from '@/database/models';
import { BackupLog } from '@/database/models';
import { PerformanceMetric } from '@/database/models';

// Health Risk Assessment Models
import { Allergy } from '@/database/models';
import { ChronicCondition } from '@/database/models';
import { StudentMedication } from '@/database/models';
import { IncidentReport } from '@/database/models';
import { MedicationLog } from '@/database/models';
import { WitnessStatement } from '@/database/models';

// Medication Models
import { Medication } from '@/database/models';
import { Vaccination } from '@/database/models';

// Clinical Models
import { DrugCatalog } from '@/database/models';
import { DrugInteraction } from '@/database/models';
import { StudentDrugAllergy } from '@/database/models';

// Analytics Models
import { AnalyticsReport } from '@/database/models';
import { HealthMetricSnapshot } from '@/database/models';

// Inventory Models
import { InventoryItem } from '@/database/models';
import { InventoryTransaction } from '@/database/models';
import { MaintenanceLog } from '@/database/models';
import { PurchaseOrder } from '@/database/models';
import { PurchaseOrderItem } from '@/database/models';
import { Vendor } from '@/database/models';

// Compliance Models
import { ConsentForm } from '@/database/models';
import { ConsentSignature } from '@/database/models';
import { ComplianceReport } from '@/database/models';
import { ComplianceChecklistItem } from '@/database/models';
import { ComplianceViolation } from '@/database/models';
import { PolicyDocument } from '@/database/models';
import { PolicyAcknowledgment } from '@/database/models';
import { DataRetentionPolicy } from '@/database/models';
import { PhiDisclosure } from '@/database/models';
import { PhiDisclosureAudit } from '@/database/models';
import { RemediationAction } from '@/database/models';

// Alert Models
import { Alert } from '@/database/models';
import { AlertRule } from '@/database/models';
import { AlertPreferences } from '@/database/models';
import { DeliveryLog } from '@/database/models';

// Integration & Sync Models
import { IntegrationConfig } from '@/database/models';
import { IntegrationLog } from '@/database/models';
import { SyncSession } from '@/database/models';
import { SyncConflict } from '@/database/models';
import { SyncQueueItem } from '@/database/models';
import { SISSyncConflict } from '@/database/models';

// Budget Models
import { BudgetCategory } from '@/database/models';
import { BudgetTransaction } from '@/database/models';

// Report Models
import { ReportTemplate } from '@/database/models';
import { ReportExecution } from '@/database/models';
import { ReportSchedule } from '@/database/models';

// Training Models
import { TrainingModule } from '@/database/models';

// Sample Repositories (add more as they are migrated)
import { StudentRepository } from '@/database/repositories/impl';
import { AcademicTranscriptRepository } from '@/database/repositories/impl';
import { ConsentFormRepository } from '@/database/repositories/impl';
import { ConsentSignatureRepository } from '@/database/repositories/impl';
import { ComplianceChecklistItemRepository } from '@/database/repositories/impl';
import { PolicyDocumentRepository } from '@/database/repositories/impl';
import { DataRetentionPolicyRepository } from '@/database/repositories/impl';
import { ComplianceViolationRepository } from '@/database/repositories/impl';
import { EmergencyBroadcastRepository } from '@/database/repositories/impl';
import { ComplianceReportRepository } from '@/database/repositories/impl';
import { AppointmentRepository } from '@/database/repositories/impl';
import { HealthRecordRepository } from '@/database/repositories/impl';
import { MedicationLogRepository } from '@/database/repositories/impl';
import { IncidentReportRepository } from '@/database/repositories/impl';
import { AllergyRepository } from '@/database/repositories/impl';
import { ChronicConditionRepository } from '@/database/repositories/impl';
import { AppointmentReminderRepository } from '@/database/repositories/impl';
import { AppointmentWaitlistRepository } from '@/database/repositories/impl';

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
