/**
 * Communication analytics data point
 */
export interface AnalyticsDataPoint {
  label: string;
  value: number;
  percentage?: number;
  trend?: 'up' | 'down' | 'stable';
  change?: number;
}

/**
 * Communication metrics
 */
export interface CommunicationMetrics {
  total_sent: AnalyticsDataPoint;
  delivery_rate: AnalyticsDataPoint;
  response_rate: AnalyticsDataPoint;
  avg_response_time: AnalyticsDataPoint;
  channels: {
    email: AnalyticsDataPoint;
    sms: AnalyticsDataPoint;
    push: AnalyticsDataPoint;
    in_app: AnalyticsDataPoint;
  };
  categories: {
    emergency: AnalyticsDataPoint;
    appointment: AnalyticsDataPoint;
    medication: AnalyticsDataPoint;
    general: AnalyticsDataPoint;
    system: AnalyticsDataPoint;
  };
  status: {
    delivered: AnalyticsDataPoint;
    pending: AnalyticsDataPoint;
    failed: AnalyticsDataPoint;
    read: AnalyticsDataPoint;
  };
}

/**
 * Time series data for charts
 */
export interface TimeSeriesData {
  date: string;
  sent: number;
  delivered: number;
  failed: number;
  read: number;
  responded: number;
}

/**
 * Props for the CommunicationAnalytics component
 */
export interface CommunicationAnalyticsProps {
  /** Additional CSS classes */
  className?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string;
  /** Date range for analytics */
  dateRange?: {
    start: string;
    end: string;
  };
  /** Student ID to filter analytics */
  studentId?: string;
  /** Staff ID to filter analytics */
  staffId?: string;
  /** Communication category to filter */
  category?: string;
  /** Callback when date range changes */
  onDateRangeChange?: (range: { start: string; end: string }) => void;
  /** Callback when filters change */
  onFiltersChange?: (filters: Record<string, unknown>) => void;
}

/**
 * Selected metric type for time series chart
 */
export type SelectedMetric = 'sent' | 'delivered' | 'read' | 'responded';

/**
 * Selected timeframe type
 */
export type SelectedTimeframe = '7d' | '30d' | '90d' | 'custom';
