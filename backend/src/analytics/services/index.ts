/**
 * Barrel file for analytics services
 * Exports all services for clean public API
 */

// Main orchestration services
export * from './health-trend-analytics.service';
export * from './compliance-report-generator.service';

// Domain-specific orchestrator services (NEW)
export * from './analytics-dashboard.service';
export * from './analytics-report.service';
export * from './analytics-health.service';
export * from './analytics-incident-orchestrator.service';
export * from './analytics-medication-orchestrator.service';
export * from './analytics-appointment-orchestrator.service';

// Supporting analytics services
export * from './date-range.service';
export * from './trend-calculation.service';
export * from './condition-analytics.service';
export * from './health-metrics-analyzer.service';
export * from './incident-analytics.service';
export * from './predictive-insights.service';
