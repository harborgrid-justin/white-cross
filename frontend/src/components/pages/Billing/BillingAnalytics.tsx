'use client';

import React, { useState } from 'react';
import { 
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Users,
  CreditCard,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Filter,
  Eye,
  ChevronDown,
  Activity,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  Receipt,
  Wallet,
  Banknote,
  FileText,
  Settings
} from 'lucide-react';

/**
 * Analytics metric interface
 */
interface AnalyticsMetric {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  format: 'currency' | 'number' | 'percentage' | 'days';
  trend: 'up' | 'down' | 'neutral';
  changePercentage: number;
  icon: React.FC<{ className?: string }>;
  color: string;
}

/**
 * Chart data point interface
 */
interface ChartDataPoint {
  date: string;
  revenue: number;
  payments: number;
  invoices: number;
  collections: number;
}

/**
 * Payment method statistics interface
 */
interface PaymentMethodStats {
  method: string;
  count: number;
  amount: number;
  percentage: number;
  color: string;
  icon: React.FC<{ className?: string }>;
}

/**
 * Collection performance interface
 */
interface CollectionPerformance {
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
interface TopPatientStats {
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
 * Props for the BillingAnalytics component
 */
interface BillingAnalyticsProps {
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

/**
 * BillingAnalytics Component
 * 
 * A comprehensive analytics dashboard for billing data with revenue insights,
 * payment trends, collection performance, and detailed financial metrics.
 * Features interactive charts, KPI tracking, and performance analysis.
 * 
 * @param props - BillingAnalytics component props
 * @returns JSX element representing the billing analytics dashboard
 */
const BillingAnalytics = ({
  metrics = [
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
  ],
  chartData = [
    { date: '2024-01', revenue: 18500, payments: 16200, invoices: 54, collections: 87.6 },
    { date: '2024-02', revenue: 21200, payments: 19800, invoices: 62, collections: 93.4 },
    { date: '2024-03', revenue: 19800, payments: 17100, invoices: 58, collections: 86.4 },
    { date: '2024-04', revenue: 23400, payments: 21600, invoices: 68, collections: 92.3 },
    { date: '2024-05', revenue: 25600, payments: 22800, invoices: 72, collections: 89.1 },
    { date: '2024-06', revenue: 28100, payments: 25400, invoices: 78, collections: 90.4 }
  ],
  paymentMethods = [
    { method: 'Insurance', count: 245, amount: 156780, percentage: 63.8, color: 'bg-blue-500', icon: Building },
    { method: 'Credit Card', count: 189, amount: 45230, percentage: 18.4, color: 'bg-green-500', icon: CreditCard },
    { method: 'Cash', count: 156, amount: 28340, percentage: 11.5, color: 'bg-yellow-500', icon: Banknote },
    { method: 'Check', count: 87, amount: 12450, percentage: 5.1, color: 'bg-purple-500', icon: FileText },
    { method: 'Bank Transfer', count: 23, amount: 2880, percentage: 1.2, color: 'bg-indigo-500', icon: Wallet }
  ],
  collectionPerformance = [
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
  ],
  topPatients = [
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
  ],
  dateRange = 'last-6-months',
  loading = false,
  className = '',
  onDateRangeChange,
  onRefresh,
  onExportData,
  onViewDetailedReport,
  onSettings
}: BillingAnalyticsProps) => {
  // State
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'collections' | 'patients'>('overview');
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);

  /**
   * Formats value based on type
   */
  const formatValue = (value: number, format: AnalyticsMetric['format']) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'days':
        return `${value} days`;
      case 'number':
      default:
        return new Intl.NumberFormat('en-US').format(value);
    }
  };

  /**
   * Gets trend icon and color
   */
  const getTrendIcon = (trend: AnalyticsMetric['trend'], changePercentage: number) => {
    if (trend === 'up') {
      return <ArrowUpRight className="w-4 h-4 text-green-600" />;
    } else if (trend === 'down') {
      return <ArrowDownRight className="w-4 h-4 text-red-600" />;
    }
    return <Activity className="w-4 h-4 text-gray-600" />;
  };

  /**
   * Renders metric card
   */
  const renderMetricCard = (metric: AnalyticsMetric) => {
    const Icon = metric.icon;
    const trendIcon = getTrendIcon(metric.trend, metric.changePercentage);
    const trendColor = metric.trend === 'up' ? 'text-green-600' : 
                      metric.trend === 'down' ? 'text-red-600' : 'text-gray-600';

    return (
      <div key={metric.id} className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg bg-gray-50`}>
            <Icon className={`w-6 h-6 ${metric.color}`} />
          </div>
          <div className="flex items-center space-x-1">
            {trendIcon}
            <span className={`text-sm font-medium ${trendColor}`}>
              {Math.abs(metric.changePercentage).toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{metric.label}</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatValue(metric.value, metric.format)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            vs {formatValue(metric.previousValue, metric.format)} previous period
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`bg-white min-h-screen ${className}`}>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-green-600" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 min-h-screen ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 rounded-lg p-2">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Billing Analytics</h1>
                <p className="text-gray-600">Revenue insights and performance metrics</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button
                  onClick={() => setShowDateRangePicker(!showDateRangePicker)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                           bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {dateRange.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>
                
                {showDateRangePicker && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      {[
                        { value: 'last-7-days', label: 'Last 7 Days' },
                        { value: 'last-30-days', label: 'Last 30 Days' },
                        { value: 'last-3-months', label: 'Last 3 Months' },
                        { value: 'last-6-months', label: 'Last 6 Months' },
                        { value: 'last-year', label: 'Last Year' },
                        { value: 'year-to-date', label: 'Year to Date' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            onDateRangeChange?.(option.value);
                            setShowDateRangePicker(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                            dateRange === option.value ? 'bg-green-50 text-green-700' : 'text-gray-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={onRefresh}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                aria-label="Refresh data"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              <button
                onClick={onExportData}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              
              <button
                onClick={onSettings}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'trends', label: 'Trends', icon: TrendingUp },
                { id: 'collections', label: 'Collections', icon: Target },
                { id: 'patients', label: 'Top Patients', icon: Users }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'overview' | 'trends' | 'collections' | 'patients')}
                    className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metrics.map(renderMetricCard)}
            </div>

            {/* Revenue Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
                <button
                  onClick={() => onViewDetailedReport?.('revenue')}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-600 
                           bg-green-50 border border-green-200 rounded hover:bg-green-100"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </button>
              </div>
              
              {/* Simplified chart visualization */}
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Revenue chart visualization</p>
                  <p className="text-sm text-gray-500">Integration with chart library required</p>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
                <button
                  onClick={() => onViewDetailedReport?.('payments')}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-600 
                           bg-green-50 border border-green-200 rounded hover:bg-green-100"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </button>
              </div>
              
              <div className="space-y-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div key={method.method} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${method.color.replace('bg-', 'bg-').replace('-500', '-100')}`}>
                          <Icon className={`w-4 h-4 ${method.color.replace('bg-', 'text-')}`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{method.method}</p>
                          <p className="text-sm text-gray-500">{method.count} transactions</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatValue(method.amount, 'currency')}
                        </p>
                        <p className="text-sm text-gray-500">{method.percentage}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Financial Trends Analysis</h3>
              
              {/* Trend Charts Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Revenue Trend Chart</p>
                  </div>
                </div>
                
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Payment Distribution</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collections Tab */}
        {activeTab === 'collections' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {collectionPerformance.map((performance, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">{performance.period}</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Invoiced</span>
                      <span className="font-medium">{formatValue(performance.totalInvoiced, 'currency')}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Collected</span>
                      <span className="font-medium">{formatValue(performance.totalCollected, 'currency')}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Collection Rate</span>
                      <span className="font-medium text-green-600">{performance.collectionRate}%</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg Days to Collect</span>
                      <span className="font-medium">{performance.averageDaysToCollect} days</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Outstanding</span>
                      <span className="font-medium text-orange-600">{formatValue(performance.outstandingAmount, 'currency')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Patients Tab */}
        {activeTab === 'patients' && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Top Patients by Revenue</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Invoiced
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Paid
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Outstanding
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoices
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topPatients.map((patient) => (
                    <tr key={patient.patientId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{patient.patientName}</div>
                          <div className="text-sm text-gray-500">{patient.patientId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatValue(patient.totalInvoiced, 'currency')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        {formatValue(patient.totalPaid, 'currency')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">
                        {formatValue(patient.outstandingBalance, 'currency')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.invoiceCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatValue(patient.averageInvoiceAmount, 'currency')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          patient.paymentRate >= 90 ? 'bg-green-100 text-green-800' :
                          patient.paymentRate >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {patient.paymentRate.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingAnalytics;
