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
        const databaseUrl = configService.get('DATABASE_URL');
        
        if (databaseUrl) {
          // Use DATABASE_URL if provided (for cloud deployments)
          return {
            dialect: 'postgres',
            uri: databaseUrl,
            autoLoadModels: true,
            synchronize: false,
            logging: configService.get('NODE_ENV') === 'development' ? console.log : false,
            dialectOptions: databaseUrl.includes('sslmode=require') ? {
              ssl: {
                require: true,
                rejectUnauthorized: false
              }
            } : {},
          };
        } else {
          // Use individual connection parameters for local development
          return {
            dialect: 'postgres',
            host: configService.get('DB_HOST', 'localhost'),
            port: configService.get<number>('DB_PORT', 5432),
            username: configService.get('DB_USERNAME', 'postgres'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_NAME', 'whitecross'),
            autoLoadModels: true,
            synchronize: false,
            logging: configService.get('NODE_ENV') === 'development' ? console.log : false,
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
