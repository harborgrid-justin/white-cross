/**
 * Root Application Module
 * White Cross School Health Platform - NestJS Backend
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { HealthRecordModule } from './health-record/health-record.module';
import { UserModule } from './user/user.module';
import { InventoryModule } from './inventory/inventory.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ChronicConditionModule } from './chronic-condition/chronic-condition.module';
import { AllergyModule } from './allergy/allergy.module';
import { BudgetModule } from './budget/budget.module';
import { AdministrationModule } from './administration/administration.module';
import { AuditModule } from './audit/audit.module';
import { AccessControlModule } from './access-control/access-control.module';
import { ContactModule } from './contact/contact.module';
import { ComplianceModule } from './compliance/compliance.module';
import { ClinicalModule } from './clinical/clinical.module';
import { IncidentReportModule } from './incident-report/incident-report.module';
import { IntegrationModule } from './integration/integration.module';
import { SecurityModule } from './security/security.module';
import { ReportModule } from './report/report.module';
import { MobileModule } from './mobile/mobile.module';
import { PdfModule } from './pdf/pdf.module';

@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Database connection (Sequelize)
    DatabaseModule,

    // Authentication module
    AuthModule,

    // Security module (IP restrictions, threat detection, incidents)
    SecurityModule,

    // Core modules
    UserModule,
    HealthRecordModule,

    // Inventory management module
    InventoryModule,

    // Analytics module
    AnalyticsModule,

    ChronicConditionModule,

    AllergyModule,

    BudgetModule,

    AdministrationModule,

    AuditModule,

    AccessControlModule,

    ContactModule,

    ComplianceModule,

    // Clinical module (Drug Interactions & Clinic Visits)
    ClinicalModule,

    IncidentReportModule,

    IntegrationModule,

    ReportModule,

    MobileModule,

    PdfModule,

    // Feature modules will be added here
    // MedicationModule will be imported here
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
