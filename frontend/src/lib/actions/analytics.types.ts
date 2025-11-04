/**
 * Analytics Types and Interfaces
 *
 * Centralized type definitions for analytics operations
 */

export interface DateRangeFilter {
  start: Date;
  end: Date;
}

export interface HealthMetricsFilters {
  dateRange: DateRangeFilter;
  studentIds?: string[];
  metricTypes?: string[];
}

export interface MedicationComplianceFilters {
  dateRange: DateRangeFilter;
  medicationIds?: string[];
  studentIds?: string[];
}

export interface AppointmentAnalyticsFilters {
  dateRange: DateRangeFilter;
  appointmentTypes?: string[];
  statuses?: string[];
}

export interface IncidentTrendsFilters {
  dateRange: DateRangeFilter;
  incidentTypes?: string[];
  severities?: string[];
}

export interface InventoryAnalyticsFilters {
  categories?: string[];
  lowStockOnly?: boolean;
  expiringOnly?: boolean;
  daysUntilExpiration?: number;
}

export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ExportResponse extends ActionResponse {
  filename?: string;
}
