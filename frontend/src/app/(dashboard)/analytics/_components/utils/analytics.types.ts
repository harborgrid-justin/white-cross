/**
 * @fileoverview Analytics Type Definitions
 * @module app/(dashboard)/analytics/_components/utils/analytics.types
 * @category Analytics - Types
 */

/**
 * Props for the main AnalyticsContent component
 */
export interface AnalyticsContentProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    dateRange?: string;
    metric?: string;
    department?: string;
    reportType?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

/**
 * Health metric categories
 */
export type MetricCategory = 'HEALTH' | 'SAFETY' | 'COMPLIANCE' | 'OPERATIONAL';

/**
 * Trend direction indicators
 */
export type TrendDirection = 'up' | 'down' | 'stable';

/**
 * Report status types
 */
export type ReportStatus = 'COMPLETED' | 'PROCESSING' | 'SCHEDULED' | 'FAILED';

/**
 * Report types
 */
export type ReportType =
  | 'HEALTH_METRICS'
  | 'COMPLIANCE'
  | 'INCIDENT_ANALYSIS'
  | 'MEDICATION_REPORT'
  | 'CUSTOM';

/**
 * Individual health metric data structure
 */
export interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: TrendDirection;
  change: number;
  description: string;
  category: MetricCategory;
  lastUpdated: string;
}

/**
 * Summary statistics for the analytics dashboard
 */
export interface AnalyticsSummary {
  totalStudents: number;
  activeIncidents: number;
  medicationCompliance: number;
  healthScreenings: number;
  emergencyResponseTime: number;
  inventoryUtilization: number;
  complianceScore: number;
  reportGenerated: number;
}

/**
 * Report activity data structure
 */
export interface ReportActivity {
  id: string;
  title: string;
  type: ReportType;
  status: ReportStatus;
  generatedAt: string;
  generatedBy: string;
  size: string;
  downloadCount: number;
}

/**
 * Date range option
 */
export interface DateRangeOption {
  value: string;
  label: string;
}

/**
 * Props for AnalyticsHeader component
 */
export interface AnalyticsHeaderProps {
  title?: string;
  description?: string;
  dateRange: string;
  dateRangeOptions: DateRangeOption[];
  onDateRangeChange: (value: string) => void;
  onExport?: () => void;
}

/**
 * Props for AnalyticsDashboardMetrics component
 */
export interface AnalyticsDashboardMetricsProps {
  summary: AnalyticsSummary;
}

/**
 * Props for AnalyticsHealthMetrics component
 */
export interface AnalyticsHealthMetricsProps {
  metrics: HealthMetric[];
  onFilter?: () => void;
  onSearch?: () => void;
}

/**
 * Props for AnalyticsReportActivity component
 */
export interface AnalyticsReportActivityProps {
  reportActivity: ReportActivity[];
  onViewAll?: () => void;
}

/**
 * Props for AnalyticsPerformanceOverview component
 */
export interface AnalyticsPerformanceOverviewProps {
  summary: AnalyticsSummary;
}

/**
 * Return type for useAnalyticsData hook
 */
export interface UseAnalyticsDataReturn {
  summary: AnalyticsSummary | null;
  metrics: HealthMetric[];
  reportActivity: ReportActivity[];
  loading: boolean;
  error: Error | null;
}

/**
 * Return type for useAnalyticsFilters hook
 */
export interface UseAnalyticsFiltersReturn {
  selectedDateRange: string;
  dateRangeOptions: DateRangeOption[];
  setDateRange: (value: string) => void;
}

/**
 * Mock data - Summary statistics
 */
export const mockSummary: AnalyticsSummary = {
  totalStudents: 2847,
  activeIncidents: 12,
  medicationCompliance: 94.2,
  healthScreenings: 1456,
  emergencyResponseTime: 3.2,
  inventoryUtilization: 78.5,
  complianceScore: 96.8,
  reportGenerated: 45
};

/**
 * Mock data - Health metrics
 */
export const mockMetrics: HealthMetric[] = [
  {
    id: '1',
    name: 'Student Health Index',
    value: 87.3,
    unit: '%',
    trend: 'up',
    change: 2.1,
    description: 'Overall health status across all enrolled students',
    category: 'HEALTH',
    lastUpdated: '2025-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Medication Adherence',
    value: 94.2,
    unit: '%',
    trend: 'up',
    change: 1.8,
    description: 'Students taking prescribed medications as scheduled',
    category: 'HEALTH',
    lastUpdated: '2025-01-15T10:00:00Z'
  },
  {
    id: '3',
    name: 'Incident Response Time',
    value: 3.2,
    unit: 'min',
    trend: 'down',
    change: -0.5,
    description: 'Average time from incident report to response',
    category: 'SAFETY',
    lastUpdated: '2025-01-15T10:00:00Z'
  },
  {
    id: '4',
    name: 'Compliance Score',
    value: 96.8,
    unit: '%',
    trend: 'stable',
    change: 0.2,
    description: 'Overall regulatory compliance rating',
    category: 'COMPLIANCE',
    lastUpdated: '2025-01-15T10:00:00Z'
  },
  {
    id: '5',
    name: 'Inventory Turnover',
    value: 78.5,
    unit: '%',
    trend: 'up',
    change: 3.4,
    description: 'Medical supplies inventory utilization rate',
    category: 'OPERATIONAL',
    lastUpdated: '2025-01-15T10:00:00Z'
  },
  {
    id: '6',
    name: 'Emergency Preparedness',
    value: 92.1,
    unit: '%',
    trend: 'up',
    change: 1.2,
    description: 'Emergency response readiness assessment',
    category: 'SAFETY',
    lastUpdated: '2025-01-15T10:00:00Z'
  }
];

/**
 * Mock data - Report activity
 */
export const mockReportActivity: ReportActivity[] = [
  {
    id: '1',
    title: 'Monthly Health Metrics Report',
    type: 'HEALTH_METRICS',
    status: 'COMPLETED',
    generatedAt: '2025-01-15T09:30:00Z',
    generatedBy: 'Sarah Johnson',
    size: '2.3 MB',
    downloadCount: 12
  },
  {
    id: '2',
    title: 'Medication Compliance Analysis',
    type: 'MEDICATION_REPORT',
    status: 'COMPLETED',
    generatedAt: '2025-01-15T08:15:00Z',
    generatedBy: 'Dr. Smith',
    size: '1.8 MB',
    downloadCount: 8
  },
  {
    id: '3',
    title: 'Incident Trend Analysis Q1',
    type: 'INCIDENT_ANALYSIS',
    status: 'PROCESSING',
    generatedAt: '2025-01-15T07:45:00Z',
    generatedBy: 'Admin User',
    size: 'Processing...',
    downloadCount: 0
  },
  {
    id: '4',
    title: 'HIPAA Compliance Audit',
    type: 'COMPLIANCE',
    status: 'COMPLETED',
    generatedAt: '2025-01-14T16:20:00Z',
    generatedBy: 'Compliance Officer',
    size: '3.7 MB',
    downloadCount: 24
  }
];
