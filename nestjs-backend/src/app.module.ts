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
import { CoreMiddlewareModule } from './middleware/core/core-middleware.module';
import { WorkersModule } from './workers/workers.module';
import { RoutesModule } from './routes/routes.module';

@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Database connection (Sequelize)
    DatabaseModule,

    // Core middleware (RBAC, validation, session management)
    CoreMiddlewareModule,

    // API Routes (v1, v2, etc.)
    RoutesModule,

    // Authentication module
    AuthModule,

    // Security module (IP restrictions, threat detection, incidents)
    SecurityModule,

    // Infrastructure modules
    MonitoringModule,
    EmailModule,
    SmsModule,
    JobsModule,
    WorkersModule,

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

    // Configuration module (comprehensive configuration management)
    ConfigurationModule,

    AuditModule,

    AccessControlModule,

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

    GradeTransitionModule,

    EnterpriseFeaturesModule,

    HealthMetricsModule,

    MedicationInteractionModule,

    HealthRiskAssessmentModule,

    EmergencyContactModule,

    // Feature modules will be added here
    // MedicationModule will be imported here
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
