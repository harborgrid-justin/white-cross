import {
  DollarSign,
  Receipt,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  Building,
  CreditCard,
  Banknote,
  FileText,
  Wallet,
} from 'lucide-react';
import type {
  AnalyticsMetric,
  ChartDataPoint,
  PaymentMethodStats,
  CollectionPerformance,
  TopPatientStats,
  DateRangeOption,
} from './BillingAnalytics.types';

/**
 * Default analytics metrics
 */
export const DEFAULT_METRICS: AnalyticsMetric[] = [
  {
    id: 'total-revenue',
    label: 'Total Revenue',
    value: 245680,
    previousValue: 212450,
    format: 'currency',
    trend: 'up',
    changePercentage: 15.6,
    icon: DollarSign,
    color: 'text-green-600'
  },
  {
    id: 'avg-invoice-value',
    label: 'Avg Invoice Value',
    value: 342,
    previousValue: 318,
    format: 'currency',
    trend: 'up',
    changePercentage: 7.5,
    icon: Receipt,
    color: 'text-blue-600'
  },
  {
    id: 'payment-rate',
    label: 'Payment Rate',
    value: 87.3,
    previousValue: 82.1,
    format: 'percentage',
    trend: 'up',
    changePercentage: 6.3,
    icon: CheckCircle,
    color: 'text-purple-600'
  },
  {
    id: 'avg-collection-time',
    label: 'Avg Collection Time',
    value: 28,
    previousValue: 34,
    format: 'days',
    trend: 'down',
    changePercentage: -17.6,
    icon: Clock,
    color: 'text-orange-600'
  },
  {
    id: 'outstanding-balance',
    label: 'Outstanding Balance',
    value: 45230,
    previousValue: 52100,
    format: 'currency',
    trend: 'down',
    changePercentage: -13.2,
    icon: AlertTriangle,
    color: 'text-red-600'
  },
  {
    id: 'active-patients',
    label: 'Active Patients',
    value: 1847,
    previousValue: 1692,
    format: 'number',
    trend: 'up',
    changePercentage: 9.2,
    icon: Users,
    color: 'text-indigo-600'
  }
];

/**
 * Default chart data
 */
export const DEFAULT_CHART_DATA: ChartDataPoint[] = [
  { date: '2024-01', revenue: 18500, payments: 16200, invoices: 54, collections: 87.6 },
  { date: '2024-02', revenue: 21200, payments: 19800, invoices: 62, collections: 93.4 },
  { date: '2024-03', revenue: 19800, payments: 17100, invoices: 58, collections: 86.4 },
  { date: '2024-04', revenue: 23400, payments: 21600, invoices: 68, collections: 92.3 },
  { date: '2024-05', revenue: 25600, payments: 22800, invoices: 72, collections: 89.1 },
  { date: '2024-06', revenue: 28100, payments: 25400, invoices: 78, collections: 90.4 }
];

/**
 * Default payment methods
 */
export const DEFAULT_PAYMENT_METHODS: PaymentMethodStats[] = [
  { method: 'Insurance', count: 245, amount: 156780, percentage: 63.8, color: 'bg-blue-500', icon: Building },
  { method: 'Credit Card', count: 189, amount: 45230, percentage: 18.4, color: 'bg-green-500', icon: CreditCard },
  { method: 'Cash', count: 156, amount: 28340, percentage: 11.5, color: 'bg-yellow-500', icon: Banknote },
  { method: 'Check', count: 87, amount: 12450, percentage: 5.1, color: 'bg-purple-500', icon: FileText },
  { method: 'Bank Transfer', count: 23, amount: 2880, percentage: 1.2, color: 'bg-indigo-500', icon: Wallet }
];

/**
 * Default collection performance
 */
export const DEFAULT_COLLECTION_PERFORMANCE: CollectionPerformance[] = [
  {
    period: 'Current Month',
    totalInvoiced: 45680,
    totalCollected: 39890,
    collectionRate: 87.3,
    averageDaysToCollect: 28,
    outstandingAmount: 5790
  },
  {
    period: 'Previous Month',
    totalInvoiced: 42100,
    totalCollected: 38450,
    collectionRate: 91.3,
    averageDaysToCollect: 25,
    outstandingAmount: 3650
  },
  {
    period: 'Quarter to Date',
    totalInvoiced: 132450,
    totalCollected: 118200,
    collectionRate: 89.2,
    averageDaysToCollect: 27,
    outstandingAmount: 14250
  }
];

/**
 * Default top patients
 */
export const DEFAULT_TOP_PATIENTS: TopPatientStats[] = [
  {
    patientId: 'PAT-001',
    patientName: 'Sarah Johnson',
    totalInvoiced: 12450,
    totalPaid: 11200,
    outstandingBalance: 1250,
    invoiceCount: 8,
    averageInvoiceAmount: 1556,
    paymentRate: 90.0
  },
  {
    patientId: 'PAT-002',
    patientName: 'Michael Chen',
    totalInvoiced: 9850,
    totalPaid: 9850,
    outstandingBalance: 0,
    invoiceCount: 6,
    averageInvoiceAmount: 1642,
    paymentRate: 100.0
  },
  {
    patientId: 'PAT-003',
    patientName: 'Emily Rodriguez',
    totalInvoiced: 8760,
    totalPaid: 7320,
    outstandingBalance: 1440,
    invoiceCount: 5,
    averageInvoiceAmount: 1752,
    paymentRate: 83.6
  }
];

/**
 * Date range options
 */
export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { value: 'last-7-days', label: 'Last 7 Days' },
  { value: 'last-30-days', label: 'Last 30 Days' },
  { value: 'last-3-months', label: 'Last 3 Months' },
  { value: 'last-6-months', label: 'Last 6 Months' },
  { value: 'last-year', label: 'Last Year' },
  { value: 'year-to-date', label: 'Year to Date' }
];
