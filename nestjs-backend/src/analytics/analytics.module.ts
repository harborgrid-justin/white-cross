import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { HealthTrendAnalyticsService } from './services/health-trend-analytics.service';
import { ComplianceReportGeneratorService } from './services/compliance-report-generator.service';
import { HealthMetricSnapshot, AnalyticsReport } from './entities';

/**
 * Analytics Module
 * Provides comprehensive health trend analytics, compliance reporting, and dashboard functionality
 *
 * Features:
 * - 17 analytics endpoints covering health metrics, incidents, medications, appointments
 * - Real-time nurse and admin dashboards
 * - Custom report generation with multiple formats
 * - HIPAA-compliant data aggregation and analysis
 * - Predictive insights and trend analysis
 * - Caching for performance optimization
 */
@Module({
  imports: [
    // Cache configuration for analytics endpoints
    CacheModule.register({
      ttl: 300, // Default TTL: 5 minutes (300 seconds)
      max: 100, // Maximum number of items in cache
      isGlobal: false,
    }),

    // TypeORM entities for analytics data persistence
    TypeOrmModule.forFeature([HealthMetricSnapshot, AnalyticsReport]),
  ],
  controllers: [AnalyticsController],
  providers: [
    AnalyticsService, // Main orchestration service
    HealthTrendAnalyticsService, // Health trend analysis and population health
    ComplianceReportGeneratorService, // Report generation service
  ],
  exports: [
    AnalyticsService,
    HealthTrendAnalyticsService,
    ComplianceReportGeneratorService,
  ],
})
export class AnalyticsModule {}
