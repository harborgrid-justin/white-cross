/**
 * Root Application Module
 * White Cross School Health Platform - NestJS Backend
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
// import { HealthRecordModule } from './health-record/health-record.module'; // TODO: Convert to Sequelize
import { HealthRecordModule } from './health-record/health-record.module';
import { UserModule } from './user/user.module';

// import { AnalyticsModule } from './analytics/analytics.module'; // TODO: Convert to Sequelize
import { AnalyticsModule } from './analytics/analytics.module';
// import { ChronicConditionModule } from './chronic-condition/chronic-condition.module'; // TODO: Convert to Sequelize
import { ChronicConditionModule } from './chronic-condition/chronic-condition.module';
// import { AllergyModule } from './allergy/allergy.module'; // TODO: Convert to Sequelize
// import { BudgetModule } from './budget/budget.module'; // TODO: Convert to Sequelize
import { AdministrationModule } from './administration/administration.module';
// import { AuditModule } from './audit/audit.module'; // TODO: Convert to Sequelize
import { AccessControlModule } from './access-control/access-control.module';
// import { ContactModule } from './contact/contact.module'; // TODO: Convert to Sequelize
// import { ComplianceModule } from './compliance/compliance.module'; // TODO: Convert to Sequelize
// import { ClinicalModule } from './clinical/clinical.module'; // TODO: Convert to Sequelize
// import { IncidentReportModule } from './incident-report/incident-report.module'; // TODO: Convert to Sequelize
// import { IntegrationModule } from './integration/integration.module'; // TODO: Convert to Sequelize
// import { IntegrationsModule } from './integrations/integrations.module'; // TODO: Convert to Sequelize
// import { SecurityModule } from './security/security.module'; // TODO: Convert to Sequelize
import { SecurityModule } from './security/security.module';
// import { ReportModule } from './report/report.module'; // TODO: Convert to Sequelize
// import { MobileModule } from './mobile/mobile.module'; // TODO: Migrate to Sequelize
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
// import { ConfigurationModule } from './configuration/configuration.module'; // TODO: Convert to Sequelize
import { EmergencyBroadcastModule } from './emergency-broadcast/emergency-broadcast.module';
// import { GradeTransitionModule } from './grade-transition/grade-transition.module'; // TODO: Convert to Sequelize
// import { EnterpriseFeaturesModule } from './enterprise-features/enterprise-features.module'; // TODO: Convert to Sequelize
// import { HealthMetricsModule } from './health-metrics/health-metrics.module'; // TODO: Convert to Sequelize
// import { MedicationInteractionModule } from './medication-interaction/medication-interaction.module'; // TODO: Convert to Sequelize
// import { HealthRiskAssessmentModule } from './health-risk-assessment/health-risk-assessment.module'; // TODO: Convert to Sequelize
import { HealthRiskAssessmentModule } from './health-risk-assessment/health-risk-assessment.module';
// import { EmergencyContactModule } from './emergency-contact/emergency-contact.module'; // TODO: Convert to Sequelize
import { EmailModule } from './infrastructure/email/email.module';
import { SmsModule } from './infrastructure/sms/sms.module';
import { MonitoringModule } from './infrastructure/monitoring/monitoring.module';
import { JobsModule } from './infrastructure/jobs/jobs.module';
import { WebSocketModule } from './infrastructure/websocket/websocket.module';
import { GraphQLModule } from './infrastructure/graphql/graphql.module';
import { CoreMiddlewareModule } from './middleware/core/core-middleware.module';
import { WorkersModule } from './workers/workers.module';
import { RoutesModule } from './routes/routes.module';
import { MedicationModule } from './medication/medication.module';

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
    WebSocketModule,
    GraphQLModule,
    WorkersModule,

    // Core modules
    UserModule,
    HealthRecordModule,

    // Analytics module
    // AnalyticsModule, // TODO: Convert to Sequelize

    // ChronicConditionModule, // TODO: Convert to Sequelize

    // AllergyModule, // TODO: Convert to Sequelize

    // BudgetModule, // TODO: Convert to Sequelize

    AdministrationModule,

    // Configuration module (comprehensive configuration management)
    // ConfigurationModule, // TODO: Convert to Sequelize

    // AuditModule, // TODO: Convert to Sequelize

    AccessControlModule,

    // ContactModule, // TODO: Convert to Sequelize

    // ComplianceModule, // TODO: Convert to Sequelize

    // Clinical module (Drug Interactions & Clinic Visits)
    // ClinicalModule, // TODO: Convert to Sequelize

    // IncidentReportModule, // TODO: Convert to Sequelize

    // IntegrationModule, // TODO: Convert to Sequelize

    // Integration clients module (external API integrations with circuit breaker and rate limiting)
    // IntegrationsModule, // TODO: Convert to Sequelize

    // ReportModule, // TODO: Convert to Sequelize

    // MobileModule, // TODO: Migrate to Sequelize

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

    // GradeTransitionModule, // TODO: Convert to Sequelize

    // EnterpriseFeaturesModule, // TODO: Convert to Sequelize

    // HealthMetricsModule, // TODO: Convert to Sequelize

    // MedicationInteractionModule, // TODO: Convert to Sequelize

    // HealthRiskAssessmentModule, // TODO: Convert to Sequelize

    // EmergencyContactModule, // TODO: Convert to Sequelize

    // Feature modules
    MedicationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
