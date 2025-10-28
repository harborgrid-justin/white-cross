import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { HealthTrendAnalyticsService } from './services/health-trend-analytics.service';
import { ComplianceReportGeneratorService } from './services/compliance-report-generator.service';
import { HealthMetricSnapshot, AnalyticsReport } from './entities';

/**
 * Analytics Module
 * Provides health trend analytics and compliance reporting functionality
 */
@Module({
  imports: [
    // Cache configuration
    CacheModule.register({
      ttl: 300, // Default TTL: 5 minutes (300 seconds)
      max: 100, // Maximum number of items in cache
      isGlobal: false,
    }),

    // TypeORM entities
    TypeOrmModule.forFeature([HealthMetricSnapshot, AnalyticsReport]),
  ],
  controllers: [AnalyticsController],
  providers: [HealthTrendAnalyticsService, ComplianceReportGeneratorService],
  exports: [HealthTrendAnalyticsService, ComplianceReportGeneratorService],
})
export class AnalyticsModule {}
