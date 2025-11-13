import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  AnalyticsReport,
  Appointment,
  AppointmentRepository,
  DatabaseModule,
  HealthMetricSnapshot,
  HealthRecord,
  IncidentReport,
  MedicationLog,
  Student,
} from '@/database';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import {
  ComplianceReportGeneratorService,
  HealthTrendAnalyticsService,
  DateRangeService,
  TrendCalculationService,
  ConditionAnalyticsService,
  HealthMetricsAnalyzerService,
  IncidentAnalyticsService,
  PredictiveInsightsService,
  AnalyticsDashboardService,
  AnalyticsReportService,
  AnalyticsHealthService,
  AnalyticsIncidentOrchestratorService,
  AnalyticsMedicationOrchestratorService,
  AnalyticsAppointmentOrchestratorService,
} from '@/analytics/services';
import {
  HealthRecordRepository,
  IncidentReportRepository,
  MedicationLogRepository,
} from '@/database/repositories/impl';
import { ComplianceDataCollectorService } from '@/services/compliance-data-collector.service';
import { ComplianceMetricsCalculatorService } from '@/services/compliance-metrics-calculator.service';
import { ComplianceReportBuilderService } from '@/services/compliance-report-builder.service';
import { ComplianceReportExporterService } from '@/services/compliance-report-exporter.service';
import { ComplianceReportPersistenceService } from '@/services/compliance-report-persistence.service';

/**
 * Analytics Module
 * Provides comprehensive health trend analytics, compliance reporting, and dashboard functionality
 *
 * Features:
 * - 17 analytics endpoints covering health metrics, incidents, medications, appointments
 * - Real-time nurse and admin dashboards
 * - Custom report generation with multiple formats (PDF, CSV, Excel, JSON)
 * - HIPAA-compliant data aggregation and analysis
 * - Predictive insights and trend analysis using statistical methods
 * - Advanced caching for performance optimization
 * - Database integration with TypeORM for real-time data
 * - Statistical calculations (SMA, EMA, trend detection, seasonality)
 */
@Module({
  imports: [
    // Cache configuration for analytics endpoints
    CacheModule.register({
      ttl: 300, // Default TTL: 5 minutes (300 seconds)
      max: 100, // Maximum number of items in cache
      isGlobal: false,
    }),

    // Import DatabaseModule for repository access
    DatabaseModule,

    // Sequelize models for analytics data persistence and queries
    SequelizeModule.forFeature([
      // Analytics models
      HealthMetricSnapshot,
      AnalyticsReport,
      // External models for data aggregation
      Student,
      HealthRecord,
      Appointment,
      MedicationLog,
      IncidentReport,
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [
    AnalyticsService, // Main orchestration service
    // Domain-specific orchestrator services
    AnalyticsDashboardService, // Dashboard operations
    AnalyticsReportService, // Report generation and retrieval
    AnalyticsHealthService, // Health metrics orchestration
    AnalyticsIncidentOrchestratorService, // Incident analytics
    AnalyticsMedicationOrchestratorService, // Medication analytics
    AnalyticsAppointmentOrchestratorService, // Appointment analytics
    // Core analytics services
    HealthTrendAnalyticsService, // Health trend analysis and population health
    ComplianceReportGeneratorService, // Report generation service with export capabilities
    // Compliance report specialized services
    ComplianceDataCollectorService, // Data collection for compliance reports
    ComplianceMetricsCalculatorService, // Metrics calculation for compliance reports
    ComplianceReportBuilderService, // Report structure building
    ComplianceReportExporterService, // Format exports (PDF, CSV, Excel, JSON)
    ComplianceReportPersistenceService, // Database and caching operations
    // Supporting analytics services
    DateRangeService, // Date and period calculations
    TrendCalculationService, // Statistical analysis and trend detection
    ConditionAnalyticsService, // Condition normalization and categorization
    HealthMetricsAnalyzerService, // Population health metrics aggregation
    IncidentAnalyticsService, // Incident analysis and reporting
    PredictiveInsightsService, // Predictive analytics and outbreak detection
    // Repository providers
    AppointmentRepository,
    HealthRecordRepository,
    MedicationLogRepository,
    IncidentReportRepository,
  ],
  exports: [
    AnalyticsService,
    // Domain-specific orchestrator services
    AnalyticsDashboardService,
    AnalyticsReportService,
    AnalyticsHealthService,
    AnalyticsIncidentOrchestratorService,
    AnalyticsMedicationOrchestratorService,
    AnalyticsAppointmentOrchestratorService,
    // Core analytics services
    HealthTrendAnalyticsService,
    ComplianceReportGeneratorService,
    // Supporting analytics services
    DateRangeService,
    TrendCalculationService,
    ConditionAnalyticsService,
    HealthMetricsAnalyzerService,
    IncidentAnalyticsService,
    PredictiveInsightsService,
    // Export repositories for dependent modules
    AppointmentRepository,
    HealthRecordRepository,
    MedicationLogRepository,
    IncidentReportRepository,
  ],
})
export class AnalyticsModule {}
