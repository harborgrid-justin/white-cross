/**
 * Analytics Module Barrel Export
 * Provides centralized exports for the analytics module
 */

// Module
export { AnalyticsModule } from './analytics.module';

// Service
export { AnalyticsService } from './analytics.service';

// Controller
export { AnalyticsController } from './analytics.controller';

// DTOs
export * from './dto';

// Entities
export { HealthMetricSnapshot, AnalyticsReport } from '@/database/models';

// Enums
export * from './enums';

// Interfaces
export * from './interfaces';
