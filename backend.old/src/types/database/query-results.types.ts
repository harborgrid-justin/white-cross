/**
 * Type definitions for database query results
 * Provides strongly-typed interfaces for raw SQL queries and analytics
 */

/**
 * Vendor delivery metrics from analytics queries
 */
export interface VendorDeliveryMetrics {
  vendorId: string;
  vendorName: string;
  totalDeliveries: number;
  onTimeDeliveries: number;
  lateDeliveries: number;
  averageDelay: number;
  deliveryRate?: number;
}

/**
 * Vendor comparison metrics
 */
export interface VendorComparisonMetrics {
  vendorId: string;
  vendorName: string;
  metricValue: number;
  metricType: string;
  comparisonPeriod?: string;
}

/**
 * Generic query result for aggregations
 */
export interface AggregationQueryResult {
  count: number;
  sum?: number;
  average?: number;
  min?: number;
  max?: number;
  groupBy?: string;
}

/**
 * Time series query result
 */
export interface TimeSeriesQueryResult {
  date: string | Date;
  value: number;
  category?: string;
  label?: string;
}

/**
 * Health record statistics query result
 */
export interface HealthRecordStatsQueryResult {
  studentId: string;
  totalRecords: number;
  lastUpdated: Date;
  recordType?: string;
  recordCount?: number;
}

/**
 * Inventory analytics query result
 */
export interface InventoryAnalyticsQueryResult {
  itemId: string;
  itemName: string;
  category: string;
  quantity: number;
  value: number;
  lastRestocked?: Date;
  usageRate?: number;
}

/**
 * Appointment statistics query result
 */
export interface AppointmentStatsQueryResult {
  nurseId: string;
  nurseName: string;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  completionRate: number;
}

/**
 * Medication usage analytics query result
 */
export interface MedicationUsageQueryResult {
  medicationId: string;
  medicationName: string;
  totalDispensed: number;
  totalStudents: number;
  averageDosage?: number;
  lastDispensed?: Date;
}

/**
 * Budget transaction summary query result
 */
export interface BudgetTransactionSummaryQueryResult {
  categoryId: string;
  categoryName: string;
  totalTransactions: number;
  totalAmount: number;
  averageAmount: number;
  period?: string;
}

/**
 * Compliance report query result
 */
export interface ComplianceReportQueryResult {
  reportType: string;
  totalRecords: number;
  compliantRecords: number;
  nonCompliantRecords: number;
  complianceRate: number;
  lastChecked: Date;
}

/**
 * Incident report statistics query result
 */
export interface IncidentReportStatsQueryResult {
  incidentType: string;
  totalIncidents: number;
  severity: string;
  resolvedIncidents: number;
  averageResolutionTime?: number;
}

/**
 * Generic grouped count result
 */
export interface GroupedCountResult {
  groupKey: string;
  groupLabel?: string;
  count: number;
  percentage?: number;
}

/**
 * Date range aggregation result
 */
export interface DateRangeAggregationResult {
  startDate: Date;
  endDate: Date;
  metric: string;
  value: number;
  trend?: 'up' | 'down' | 'stable';
}
