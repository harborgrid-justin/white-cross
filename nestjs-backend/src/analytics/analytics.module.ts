import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { HealthTrendAnalyticsService } from './services/health-trend-analytics.service';
import { ComplianceReportGeneratorService } from './services/compliance-report-generator.service';
import { HealthMetricSnapshot, AnalyticsReport } from './entities';
import { Student } from '../student/entities/student.entity';
import { HealthRecord } from '../health-record/entities/health-record.entity';
import { IncidentReport } from '../incident-report/entities/incident-report.entity';

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

    // TypeORM entities for analytics data persistence and queries
    TypeOrmModule.forFeature([
      // Analytics entities
      HealthMetricSnapshot,
      AnalyticsReport,
      // External entities for data aggregation
      Student,
      HealthRecord,
      IncidentReport,
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [
    AnalyticsService, // Main orchestration service
    HealthTrendAnalyticsService, // Health trend analysis and population health
    ComplianceReportGeneratorService, // Report generation service with export capabilities
  ],
  exports: [
    AnalyticsService,
    HealthTrendAnalyticsService,
    ComplianceReportGeneratorService,
  ],
})
export class AnalyticsModule {}
