import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { SequelizeModule } from '@nestjs/sequelize';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { HealthTrendAnalyticsService } from './services/health-trend-analytics.service';
import { ComplianceReportGeneratorService } from './services/compliance-report-generator.service';
import { HealthMetricSnapshot } from '../database/models/health-metric-snapshot.model';
import { AnalyticsReport } from '../database/models/analytics-report.model';
import { Student } from '../database/models/student.model';
import { HealthRecord } from '../database/models/health-record.model';

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

    // Sequelize models for analytics data persistence and queries
    SequelizeModule.forFeature([
      // Analytics models
      HealthMetricSnapshot,
      AnalyticsReport,
      // External models for data aggregation
      Student,
      HealthRecord,
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
