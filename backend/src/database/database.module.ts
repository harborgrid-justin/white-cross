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
import { CacheService } from './services/cache.service';
import { AuditService } from './services/audit.service';
import { SequelizeUnitOfWorkService } from './uow/sequelize-unit-of-work.service';
import { ConnectionMonitorService } from './services/connection-monitor.service';
import { QueryLoggerService } from './services/query-logger.service';
import { QueryCacheService } from './services/query-cache.service';

// Core Models
import { AuditLog } from './models/audit-log.model';
import { Student } from './models/student.model';
import { User } from './models/user.model';
import { Contact } from './models/contact.model';
import { District } from './models/district.model';
import { School } from './models/school.model';
import { EmergencyContact } from './models/emergency-contact.model';

// Academic Models
import { AcademicTranscript } from './models/academic-transcript.model';

// Healthcare Models
import { Appointment } from './models/appointment.model';
import { AppointmentReminder } from './models/appointment-reminder.model';
import { AppointmentWaitlist } from './models/appointment-waitlist.model';
import { GrowthTracking } from './models/growth-tracking.model';
import { HealthRecord } from './models/health-record.model';
import { HealthScreening } from './models/health-screening.model';
import { Immunization } from './models/immunization.model';
import { LabResults } from './models/lab-results.model';
import { MedicalHistory } from './models/medical-history.model';
import { MentalHealthRecord } from './models/mental-health-record.model';
import { TreatmentPlan } from './models/treatment-plan.model';
import { VitalSigns } from './models/vital-signs.model';
import { Prescription } from './models/prescription.model';
import { ClinicVisit } from './models/clinic-visit.model';
import { ClinicalNote } from './models/clinical-note.model';
import { ClinicalProtocol } from './models/clinical-protocol.model';
import { FollowUpAction } from './models/follow-up-action.model';
import { FollowUpAppointment } from './models/follow-up-appointment.model';

// Communication Models
import { EmergencyBroadcast } from './models/emergency-broadcast.model';
import { Message } from './models/message.model';
import { MessageDelivery } from './models/message-delivery.model';
import { MessageTemplate } from './models/message-template.model';
import { PushNotification } from './models/push-notification.model';
import { DeviceToken } from './models/device-token.model';

// System Models
import { Supplier } from './models/supplier.model';
import { SyncState } from './models/sync-state.model';
import { SystemConfig } from './models/system-config.model';
import { ThreatDetection } from './models/threat-detection.model';
import { Webhook } from './models/webhook.model';
import { License } from './models/license.model';
import { ConfigurationHistory } from './models/configuration-history.model';
import { BackupLog } from './models/backup-log.model';
import { PerformanceMetric } from './models/performance-metric.model';

// Health Risk Assessment Models
import { Allergy } from './models/allergy.model';
import { ChronicCondition } from './models/chronic-condition.model';
import { StudentMedication } from './models/student-medication.model';
import { IncidentReport } from './models/incident-report.model';
import { MedicationLog } from './models/medication-log.model';
import { WitnessStatement } from './models/witness-statement.model';

// Medication Models
import { Medication } from './models/medication.model';
import { Vaccination } from './models/vaccination.model';

// Clinical Models
import { DrugCatalog } from './models/drug-catalog.model';
import { DrugInteraction } from './models/drug-interaction.model';
import { StudentDrugAllergy } from './models/student-drug-allergy.model';

// Analytics Models
import { AnalyticsReport } from './models/analytics-report.model';
import { HealthMetricSnapshot } from './models/health-metric-snapshot.model';

// Inventory Models
import { InventoryItem } from './models/inventory-item.model';
import { InventoryTransaction } from './models/inventory-transaction.model';
import { MaintenanceLog } from './models/maintenance-log.model';
import { PurchaseOrder } from './models/purchase-order.model';
import { PurchaseOrderItem } from './models/purchase-order-item.model';
import { Vendor } from './models/vendor.model';

// Compliance Models
import { ConsentForm } from './models/consent-form.model';
import { ConsentSignature } from './models/consent-signature.model';
import { ComplianceReport } from './models/compliance-report.model';
import { ComplianceChecklistItem } from './models/compliance-checklist-item.model';
import { ComplianceViolation } from './models/compliance-violation.model';
import { PolicyDocument } from './models/policy-document.model';
import { PolicyAcknowledgment } from './models/policy-acknowledgment.model';
import { DataRetentionPolicy } from './models/data-retention-policy.model';
import { PhiDisclosure } from './models/phi-disclosure.model';
import { PhiDisclosureAudit } from './models/phi-disclosure-audit.model';
import { RemediationAction } from './models/remediation-action.model';

// Alert Models
import { Alert } from './models/alert.model';
import { AlertRule } from './models/alert-rule.model';
import { AlertPreferences } from './models/alert-preferences.model';
import { DeliveryLog } from './models/delivery-log.model';

// Integration & Sync Models
import { IntegrationConfig } from './models/integration-config.model';
import { IntegrationLog } from './models/integration-log.model';
import { SyncSession } from './models/sync-session.model';
import { SyncConflict } from './models/sync-conflict.model';
import { SyncQueueItem } from './models/sync-queue-item.model';
import { SISSyncConflict } from './models/sis-sync-conflict.model';

// Budget Models
import { BudgetCategory } from './models/budget-category.model';
import { BudgetTransaction } from './models/budget-transaction.model';

// Report Models
import { ReportTemplate } from './models/report-template.model';
import { ReportExecution } from './models/report-execution.model';
import { ReportSchedule } from './models/report-schedule.model';

// Training Models
import { TrainingModule } from './models/training-module.model';

// Sample Repositories (add more as they are migrated)
import { StudentRepository } from './repositories/impl/student.repository';
import { AcademicTranscriptRepository } from './repositories/impl/academic-transcript.repository';
import { ConsentFormRepository } from './repositories/impl/consent-form.repository';
import { ConsentSignatureRepository } from './repositories/impl/consent-signature.repository';
import { ComplianceChecklistItemRepository } from './repositories/impl/compliance-checklist-item.repository';
import { PolicyDocumentRepository } from './repositories/impl/policy-document.repository';
import { DataRetentionPolicyRepository } from './repositories/impl/data-retention-policy.repository';
import { ComplianceViolationRepository } from './repositories/impl/compliance-violation.repository';
import { EmergencyBroadcastRepository } from './repositories/impl/emergency-broadcast.repository';
import { ComplianceReportRepository } from './repositories/impl/compliance-report.repository';
import { AppointmentRepository } from './repositories/impl/appointment.repository';
import { HealthRecordRepository } from './repositories/impl/health-record.repository';
import { MedicationLogRepository } from './repositories/impl/medication-log.repository';
import { IncidentReportRepository } from './repositories/impl/incident-report.repository';
import { AllergyRepository } from './repositories/impl/allergy.repository';
import { ChronicConditionRepository } from './repositories/impl/chronic-condition.repository';
import { AppointmentReminderRepository } from './repositories/impl/appointment-reminder.repository';
import { AppointmentWaitlistRepository } from './repositories/impl/appointment-waitlist.repository';

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
            synchronize: false,
            alter: false,
            // OPTIMIZATION: Enhanced logging with slow query detection
            logging: isDevelopment
              ? console.log
              : (sql: string, timing?: number) => {
                  // Log slow queries in production (over 1 second)
                  if (timing && timing > 1000) {
                    console.warn(`SLOW QUERY (${timing}ms): ${sql.substring(0, 200)}...`);
                  }
                },
            benchmark: true,
            // V6 recommended options
            define: {
              timestamps: true,
              underscored: false,
              freezeTableName: true,
            },
            // OPTIMIZATION: Production-ready connection pool configuration
            // - Max 20 connections for high concurrency (adjustable based on load)
            // - Min 5 connections to handle baseline traffic
            // - 30s acquire timeout for peak traffic scenarios
            // - 10s idle timeout to free up unused connections
            // - Connection validation to prevent stale connections
            pool: {
              max: isProduction ? 20 : 10,
              min: isProduction ? 5 : 2,   // Higher min for production to handle baseline traffic
              acquire: 30000,               // 30s max time to acquire connection
              idle: 10000,                  // 10s idle time before releasing
              evict: 1000,                  // Check for idle connections every 1s
              handleDisconnects: true,
              validate: (connection: any) => {
                return connection && !connection._closed;
              }
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
                /EAI_AGAIN/
              ],
              max: 3
            },
            dialectOptions: {
              ...(databaseUrl.includes('sslmode=require') ? {
                ssl: {
                  require: true,
                  rejectUnauthorized: false
                }
              } : {}),
              application_name: 'white-cross-app',
              statement_timeout: 30000,
              idle_in_transaction_session_timeout: 30000
            },
          };
        } else {
          // Use individual connection parameters for local development
          return {
            dialect: 'postgres',
            host: configService.get('database.host', 'localhost'),
            port: configService.get<number>('database.port', 5432),
            username: configService.get('database.username', 'postgres'),
            password: configService.get('database.password'),
            database: configService.get('database.database', 'whitecross'),
            autoLoadModels: true,
            synchronize: isDevelopment,
            alter: isDevelopment,
            // OPTIMIZATION: Enhanced logging with slow query detection
            logging: isDevelopment
              ? console.log
              : (sql: string, timing?: number) => {
                  // Log slow queries in production (over 1 second)
                  if (timing && timing > 1000) {
                    console.warn(`SLOW QUERY (${timing}ms): ${sql.substring(0, 200)}...`);
                  }
                },
            benchmark: true,
            // V6 recommended options
            define: {
              timestamps: true,
              underscored: false,
              freezeTableName: true,
            },
            // OPTIMIZATION: Production-ready connection pool configuration
            // - Max 20 connections for high concurrency (adjustable based on load)
            // - Min 5 connections to handle baseline traffic
            // - 30s acquire timeout for peak traffic scenarios
            // - 10s idle timeout to free up unused connections
            // - Connection validation to prevent stale connections
            pool: {
              max: isProduction ? 20 : 10,
              min: isProduction ? 5 : 2,   // Higher min for production to handle baseline traffic
              acquire: 30000,               // 30s max time to acquire connection
              idle: 10000,                  // 10s idle time before releasing
              evict: 1000,                  // Check for idle connections every 1s
              handleDisconnects: true,
              validate: (connection: any) => {
                return connection && !connection._closed;
              }
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
                /EAI_AGAIN/
              ],
              max: 3
            },
            dialectOptions: {
              application_name: 'white-cross-app',
              statement_timeout: 30000,    // 30s query timeout
              idle_in_transaction_session_timeout: 30000  // 30s idle transaction timeout
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
    ])
  ],
  providers: [
    // Core Services with interface tokens
    {
      provide: 'ICacheManager',
      useClass: CacheService
    },
    {
      provide: 'IAuditLogger',
      useClass: AuditService
    },
    {
      provide: 'IUnitOfWork',
      useClass: SequelizeUnitOfWorkService
    },

    // Performance Monitoring Services
    ConnectionMonitorService,
    QueryLoggerService,
    QueryCacheService,

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

    // Export performance monitoring services
    ConnectionMonitorService,
    QueryLoggerService,
    QueryCacheService,

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
  ]
})
export class DatabaseModule {}
