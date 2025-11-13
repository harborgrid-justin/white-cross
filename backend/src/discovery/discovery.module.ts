import { Module } from '@nestjs/common';
import { DiscoveryModule as NestDiscoveryModule } from '@nestjs/core';
import { DiscoveryExampleService } from './discovery-example.service';
import { DiscoveryController } from './discovery.controller';
import { AdminDiscoveryGuard } from './guards/admin-discovery.guard';
import { DiscoveryRateLimitGuard } from './guards/discovery-rate-limit.guard';
import { DiscoveryExceptionFilter } from './filters/discovery-exception.filter';
import { DiscoveryMetricsService } from '@/services/discovery-metrics.service';
import { DiscoveryCacheService } from '@/services/discovery-cache.service';
import { DiscoveryLoggingInterceptor } from './interceptors/discovery-logging.interceptor';
import { DiscoveryCacheInterceptor } from './interceptors/discovery-cache.interceptor';
import { DiscoveryMetricsInterceptor } from './interceptors/discovery-metrics.interceptor';
import {
  AiDiagnosisService,
  ExperimentalHealthService,
  ExternalApiService,
  RegularService,
  ReportCacheService,
  StudentHealthService,
  UserAnalyticsService,
} from './examples/example-services';

@Module({
  imports: [NestDiscoveryModule],
  controllers: [DiscoveryController],
  providers: [
    // Core discovery services
    DiscoveryExampleService,
    DiscoveryMetricsService,
    DiscoveryCacheService,

    // Guards and filters
    AdminDiscoveryGuard,
    DiscoveryRateLimitGuard,
    DiscoveryExceptionFilter,

    // Interceptors
    DiscoveryLoggingInterceptor,
    DiscoveryCacheInterceptor,
    DiscoveryMetricsInterceptor,

    // Example services to demonstrate discovery functionality
    ExperimentalHealthService,
    AiDiagnosisService,
    UserAnalyticsService,
    ReportCacheService,
    ExternalApiService,
    RegularService,
    StudentHealthService,
  ],
  exports: [
    // Core services
    DiscoveryExampleService,
    DiscoveryMetricsService,
    DiscoveryCacheService,

    // Guards and filters
    AdminDiscoveryGuard,
    DiscoveryRateLimitGuard,
    DiscoveryExceptionFilter,

    // Interceptors
    DiscoveryLoggingInterceptor,
    DiscoveryCacheInterceptor,
    DiscoveryMetricsInterceptor,

    // Example services
    ExperimentalHealthService,
    AiDiagnosisService,
    UserAnalyticsService,
    ReportCacheService,
    ExternalApiService,
    RegularService,
    StudentHealthService,
  ],
})
export class DiscoveryExampleModule {}
