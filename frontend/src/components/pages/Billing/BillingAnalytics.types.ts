import { LucideIcon } from 'lucide-react';

/**
 * Analytics metric interface
 */
export interface AnalyticsMetric {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  format: 'currency' | 'number' | 'percentage' | 'days';
  trend: 'up' | 'down' | 'neutral';
  changePercentage: number;
  icon: LucideIcon;
  color: string;
}

/**
 * Chart data point interface
 */
export interface ChartDataPoint {
  date: string;
  revenue: number;
  payments: number;
  invoices: number;
  collections: number;
}

/**
 * Payment method statistics interface
 */
export interface PaymentMethodStats {
  method: string;
  count: number;
  amount: number;
  percentage: number;
  color: string;
  icon: LucideIcon;
}

/**
 * Collection performance interface
 */
export interface CollectionPerformance {
  period: string;
  totalInvoiced: number;
  totalCollected: number;
  collectionRate: number;
  averageDaysToCollect: number;
  outstandingAmount: number;
}

/**
 * Top patient statistics interface
 */
export interface TopPatientStats {
  patientId: string;
  patientName: string;
  totalInvoiced: number;
  totalPaid: number;
  outstandingBalance: number;
  invoiceCount: number;
  averageInvoiceAmount: number;
  paymentRate: number;
}

/**
 * Tab types for analytics dashboard
 */
export type AnalyticsTab = 'overview' | 'trends' | 'collections' | 'patients';

/**
 * Date range option
 */
export interface DateRangeOption {
  value: string;
  label: string;
}

/**
 * Props for the BillingAnalytics component
 */
export interface BillingAnalyticsProps {
  /** Analytics metrics data */
  metrics?: AnalyticsMetric[];
  /** Chart data for revenue trends */
  chartData?: ChartDataPoint[];
  /** Payment method statistics */
  paymentMethods?: PaymentMethodStats[];
  /** Collection performance data */
  collectionPerformance?: CollectionPerformance[];
  /** Top patients by revenue */
  topPatients?: TopPatientStats[];
  /** Selected date range */
  dateRange?: string;
  /** Loading state */
  loading?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Date range change handler */
  onDateRangeChange?: (range: string) => void;
  /** Refresh data handler */
  onRefresh?: () => void;
  /** Export data handler */
  onExportData?: () => void;
  /** View detailed report handler */
  onViewDetailedReport?: (type: string) => void;
  /** Settings handler */
  onSettings?: () => void;
}
