/**
 * Database Module
 * Central module providing all database infrastructure services
 *
 * Provides:
 * - Sequelize ORM configuration
 * - Cache management (in-memory and Redis support)
 * - Audit logging (HIPAA-compliant)
 * - Repository pattern with enterprise features
 * - Unit of Work for transaction management
 * - Database types and utilities
 */

import { Module, Global } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDatabaseConfig } from './config/database.config';

// Services
import { CacheService } from './services/cache.service';
import { AuditService } from './services/audit.service';
import { SequelizeUnitOfWorkService } from './uow/sequelize-unit-of-work.service';

// Models
import { AuditLog } from './models/audit-log.model';
import { EmergencyBroadcast } from './models/emergency-broadcast.model';
import { Student } from './models/student.model';
import { User } from './models/user.model';
import { Appointment } from './models/appointment.model';
import { AppointmentReminder } from './models/appointment-reminder.model';
import { AppointmentWaitlist } from './models/appointment-waitlist.model';
import { GrowthTracking } from './models/growth-tracking.model';
import { HealthRecord } from './models/health-record.model';
import { HealthScreening } from './models/health-screening.model';
import { Immunization } from './models/immunization.model';
import { LabResults } from './models/lab-results.model';
import { MedicalHistory } from './models/medical-history.model';
import { MessageDelivery } from './models/message-delivery.model';
import { MessageTemplate } from './models/message-template.model';
import { Message } from './models/message.model';
import { Supplier } from './models/supplier.model';
import { SyncState } from './models/sync-state.model';
import { SystemConfig } from './models/system-config.model';
import { ThreatDetection } from './models/threat-detection.model';
import { TreatmentPlan } from './models/treatment-plan.model';
import { VitalSigns } from './models/vital-signs.model';
import { Webhook } from './models/webhook.model';

// Health Risk Assessment Models
import { Allergy } from './models/allergy.model';
import { ChronicCondition } from './models/chronic-condition.model';
import { StudentMedication } from './models/student-medication.model';
import { IncidentReport } from './models/incident-report.model';

// Medication Models
import { Medication } from './models/medication.model';

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

// Compliance & Policy Models
import { ComplianceChecklistItem } from './models/compliance-checklist-item.model';
import { ComplianceReport } from './models/compliance-report.model';
import { ComplianceViolation } from './models/compliance-violation.model';
import { ConsentForm } from './models/consent-form.model';
import { ConsentSignature } from './models/consent-signature.model';
import { DataRetentionPolicy } from './models/data-retention-policy.model';
import { PolicyAcknowledgment } from './models/policy-acknowledgment.model';
import { PolicyDocument } from './models/policy-document.model';
import { PhiDisclosure } from './models/phi-disclosure.model';
import { PhiDisclosureAudit } from './models/phi-disclosure-audit.model';

// Additional Clinical Models
import { ClinicVisit } from './models/clinic-visit.model';
import { ClinicalNote } from './models/clinical-note.model';
import { ClinicalProtocol } from './models/clinical-protocol.model';
import { FollowUpAction } from './models/follow-up-action.model';
import { FollowUpAppointment } from './models/follow-up-appointment.model';
import { MedicationLog } from './models/medication-log.model';
import { Prescription } from './models/prescription.model';
import { Vaccination } from './models/vaccination.model';
import { WitnessStatement } from './models/witness-statement.model';
import { MentalHealthRecord } from './models/mental-health-record.model';

// Administration Models
import { AcademicTranscript } from './models/academic-transcript.model';
import { BackupLog } from './models/backup-log.model';
import { ConfigurationHistory } from './models/configuration-history.model';
import { District } from './models/district.model';
import { License } from './models/license.model';
import { PerformanceMetric } from './models/performance-metric.model';
import { School } from './models/school.model';
import { TrainingModule } from './models/training-module.model';
import { AlertRule } from './models/alert-rule.model';
import { EmergencyContact } from './models/emergency-contact.model';

// Reporting Models
import { ReportExecution } from './models/report-execution.model';
import { ReportSchedule } from './models/report-schedule.model';
import { ReportTemplate } from './models/report-template.model';

// Communication & Mobile Models
import { DeviceToken } from './models/device-token.model';
import { PushNotification } from './models/push-notification.model';

// Integration & Sync Models
import { IntegrationConfig } from './models/integration-config.model';
import { IntegrationLog } from './models/integration-log.model';
import { SISSyncConflict } from './models/sis-sync-conflict.model';
import { SyncConflict } from './models/sync-conflict.model';
import { SyncQueueItem } from './models/sync-queue-item.model';
import { SyncSession } from './models/sync-session.model';

// Budget & Finance Models
import { BudgetCategory } from './models/budget-category.model';
import { BudgetTransaction } from './models/budget-transaction.model';

// Contact Models
import { Contact } from './models/contact.model';

// Remediation Models
import { RemediationAction } from './models/remediation-action.model';

// Security Models (from security/entities)
import { LoginAttemptEntity } from '../security/entities/login-attempt.entity';
import { SessionEntity } from '../security/entities/session.entity';
import { IpRestrictionEntity } from '../security/entities/ip-restriction.entity';
import { SecurityIncidentEntity } from '../security/entities/security-incident.entity';

// Sample Repositories (add more as they are migrated)
import { StudentRepository } from './repositories/impl/student.repository';
import { EmergencyBroadcastRepository } from './repositories/impl/emergency-broadcast.repository';

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
        // Get comprehensive database configuration
        const config = getDatabaseConfig({
          DATABASE_URL: configService.get('DATABASE_URL'),
          DB_HOST: configService.get('DB_HOST'),
          DB_PORT: configService.get('DB_PORT'),
          DB_USERNAME: configService.get('DB_USERNAME'),
          DB_PASSWORD: configService.get('DB_PASSWORD'),
          DB_NAME: configService.get('DB_NAME'),
          DB_DIALECT: configService.get('DB_DIALECT'),
          DB_SSL: configService.get('DB_SSL'),
          DB_SSL_REJECT_UNAUTHORIZED: configService.get('DB_SSL_REJECT_UNAUTHORIZED'),
          DB_POOL_MIN: configService.get('DB_POOL_MIN'),
          DB_POOL_MAX: configService.get('DB_POOL_MAX'),
          DB_POOL_IDLE: configService.get('DB_POOL_IDLE'),
          DB_POOL_ACQUIRE: configService.get('DB_POOL_ACQUIRE'),
          DB_POOL_EVICT: configService.get('DB_POOL_EVICT'),
          DB_LOGGING: configService.get('DB_LOGGING'),
          DB_TIMEZONE: configService.get('DB_TIMEZONE'),
          NODE_ENV: configService.get('NODE_ENV'),
        });

        // Add NestJS-specific options
        return {
          ...config,
          autoLoadModels: true,
          synchronize: false, // Never use synchronize in production
        };
      },
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([
      // Core Models
      AuditLog,
      Student,
      User,

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
      TreatmentPlan,
      VitalSigns,

      // Health Risk Assessment Models
      Allergy,
      ChronicCondition,
      StudentMedication,
      IncidentReport,

      // Medication Models
      Medication,

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

      // System Models
      Supplier,
      SyncState,
      SystemConfig,
      ThreatDetection,
      Webhook,

      // Compliance & Policy Models
      ComplianceChecklistItem,
      ComplianceReport,
      ComplianceViolation,
      ConsentForm,
      ConsentSignature,
      DataRetentionPolicy,
      PolicyAcknowledgment,
      PolicyDocument,
      PhiDisclosure,
      PhiDisclosureAudit,

      // Additional Clinical Models
      ClinicVisit,
      ClinicalNote,
      ClinicalProtocol,
      FollowUpAction,
      FollowUpAppointment,
      MedicationLog,
      Prescription,
      Vaccination,
      WitnessStatement,
      MentalHealthRecord,

      // Administration Models
      AcademicTranscript,
      BackupLog,
      ConfigurationHistory,
      District,
      License,
      PerformanceMetric,
      School,
      TrainingModule,
      AlertRule,
      EmergencyContact,

      // Reporting Models
      ReportExecution,
      ReportSchedule,
      ReportTemplate,

      // Communication & Mobile Models
      DeviceToken,
      PushNotification,

      // Integration & Sync Models
      IntegrationConfig,
      IntegrationLog,
      SISSyncConflict,
      SyncConflict,
      SyncQueueItem,
      SyncSession,

      // Budget & Finance Models
      BudgetCategory,
      BudgetTransaction,

      // Contact Models
      Contact,

      // Remediation Models
      RemediationAction,

      // Security Models
      LoginAttemptEntity,
      SessionEntity,
      IpRestrictionEntity,
      SecurityIncidentEntity,
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

    // Repository Implementations
    // Add repositories as they are migrated following this pattern:
    StudentRepository,
    EmergencyBroadcastRepository,
    // HealthRecordRepository,
    // AllergyRepository,
    // MedicationRepository,
    // etc.
  ],
  exports: [
    // Export services for use in other modules
    'ICacheManager',
    'IAuditLogger',
    'IUnitOfWork',

    // Export repositories as they are added
    StudentRepository,
    EmergencyBroadcastRepository,
    // HealthRecordRepository,
    // etc.
  ]
})
export class DatabaseModule {}
