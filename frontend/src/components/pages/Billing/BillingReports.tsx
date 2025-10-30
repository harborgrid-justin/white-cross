'use client';

import React, { useState } from 'react';
import { 
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  Search,
  Eye,
  Settings,
  FileText,
  CreditCard,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
  Building,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap
} from 'lucide-react';

/**
 * Report time period types
 */
type ReportPeriod = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

/**
 * Report chart types
 */
type ChartType = 'line' | 'bar' | 'pie' | 'area';

/**
 * Revenue metrics interface
 */
interface RevenueMetrics {
  totalRevenue: number;
  previousPeriodRevenue: number;
  revenueGrowth: number;
  averageInvoiceValue: number;
  collectionRate: number;
  outstandingBalance: number;
}

/**
 * Payment metrics interface
 */
interface PaymentMetrics {
  totalPayments: number;
  paymentVolume: number;
  averagePaymentTime: number;
  paymentMethods: { method: string; amount: number; percentage: number }[];
  refundRate: number;
  chargebackRate: number;
}

/**
 * Props for the BillingReports component
 */
interface BillingReportsProps {
  /** Revenue metrics data */
  revenueMetrics?: RevenueMetrics;
  /** Payment metrics data */
  paymentMetrics?: PaymentMetrics;
  /** Loading state */
  loading?: boolean;
  /** Selected time period */
  selectedPeriod?: ReportPeriod;
  /** Custom date range */
  dateRange?: { start: string; end: string };
  /** Active chart type */
  chartType?: ChartType;
  /** Custom CSS classes */
  className?: string;
  /** Period change handler */
  onPeriodChange?: (period: ReportPeriod) => void;
  /** Date range change handler */
  onDateRangeChange?: (range: { start: string; end: string }) => void;
  /** Chart type change handler */
  onChartTypeChange?: (type: ChartType) => void;
  /** Export report handler */
  onExportReport?: (format: string) => void;
  /** Refresh data handler */
  onRefresh?: () => void;
  /** View detailed report handler */
  onViewDetailedReport?: (reportType: string) => void;
}

/**
 * BillingReports Component
 * 
 * A comprehensive billing reports and analytics component featuring revenue
 * tracking, payment analysis, collection metrics, and visual data representation.
 * Provides insights into billing performance and financial trends.
 * 
 * @param props - BillingReports component props
 * @returns JSX element representing the billing reports dashboard
 */
const BillingReports = ({
  revenueMetrics = {
    totalRevenue: 0,
    previousPeriodRevenue: 0,
    revenueGrowth: 0,
    averageInvoiceValue: 0,
    collectionRate: 0,
    outstandingBalance: 0
  },
  paymentMetrics = {
    totalPayments: 0,
    paymentVolume: 0,
    averagePaymentTime: 0,
    paymentMethods: [],
    refundRate: 0,
    chargebackRate: 0
  },
  loading = false,
  selectedPeriod = 'month',
  dateRange = { start: '', end: '' },
  chartType = 'bar',
  className = '',
  onPeriodChange,
  onDateRangeChange,
  onChartTypeChange,
  onExportReport,
  onRefresh,
  onViewDetailedReport
}: BillingReportsProps) => {
  // State
  const [showFilters, setShowFilters] = useState(false);

  /**
   * Formats currency amount
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  /**
   * Formats percentage
   */
  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  /**
   * Gets growth indicator configuration
   */
  const getGrowthConfig = (growth: number) => {
    const isPositive = growth >= 0;
    return {
      color: isPositive ? 'text-green-600' : 'text-red-600',
      bgColor: isPositive ? 'bg-green-100' : 'bg-red-100',
      icon: isPositive ? ArrowUpRight : ArrowDownRight,
      label: isPositive ? 'Growth' : 'Decline'
    };
  };

  const growthConfig = getGrowthConfig(revenueMetrics.revenueGrowth);
  const GrowthIcon = growthConfig.icon;

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-lg p-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Billing Reports & Analytics</h1>
                <p className="text-gray-600">
                  Financial insights and billing performance metrics
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
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
            
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
              
              {showFilters && (
                <div className="absolute top-full right-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Report Filters</h3>
                    
                    <div className="space-y-4">
                      {/* Time Period */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Time Period</label>
                        <select
                          value={selectedPeriod}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                            onPeriodChange?.(e.target.value as ReportPeriod)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm 
                                   focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="today">Today</option>
                          <option value="week">This Week</option>
                          <option value="month">This Month</option>
                          <option value="quarter">This Quarter</option>
                          <option value="year">This Year</option>
                          <option value="custom">Custom Range</option>
                        </select>
                      </div>
                      
                      {selectedPeriod === 'custom' && (
                        <div className="space-y-2">
                          <div>
                            <label htmlFor="startDate" className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                              id="startDate"
                              type="date"
                              value={dateRange.start}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                onDateRangeChange?.({ ...dateRange, start: e.target.value })}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm 
                                       focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label htmlFor="endDate" className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                            <input
                              id="endDate"
                              type="date"
                              value={dateRange.end}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                onDateRangeChange?.({ ...dateRange, end: e.target.value })}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm 
                                       focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Chart Type */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Chart Type</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: 'line', label: 'Line', icon: Activity },
                            { value: 'bar', label: 'Bar', icon: BarChart3 },
                            { value: 'pie', label: 'Pie', icon: PieChart },
                            { value: 'area', label: 'Area', icon: TrendingUp }
                          ].map((chart) => {
                            const Icon = chart.icon;
                            return (
                              <button
                                key={chart.value}
                                onClick={() => onChartTypeChange?.(chart.value as ChartType)}
                                className={`flex items-center justify-center px-3 py-2 text-sm font-medium border rounded-md ${
                                  chartType === chart.value
                                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <Icon className="w-4 h-4 mr-1" />
                                {chart.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={() => onExportReport?.('pdf')}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                       bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </button>
            
            <button
              onClick={() => onExportReport?.('excel')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                       bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatCurrency(revenueMetrics.totalRevenue)}
                    </p>
                    <div className={`flex items-center mt-2 ${growthConfig.color}`}>
                      <GrowthIcon className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">
                        {formatPercentage(revenueMetrics.revenueGrowth)}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">vs last period</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${growthConfig.bgColor}`}>
                    <DollarSign className={`w-6 h-6 ${growthConfig.color}`} />
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Collection Rate</p>
                    <p className="text-3xl font-bold text-green-600">
                      {revenueMetrics.collectionRate.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {formatCurrency(revenueMetrics.totalRevenue - revenueMetrics.outstandingBalance)} collected
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Invoice Value</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {formatCurrency(revenueMetrics.averageInvoiceValue)}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Per transaction
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Outstanding Balance</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {formatCurrency(revenueMetrics.outstandingBalance)}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Pending collection
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-orange-100">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trends Chart */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Revenue Trends</h3>
                  <button
                    onClick={() => onViewDetailedReport?.('revenue')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </button>
                </div>
                
                {/* Placeholder for chart */}
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Revenue trend chart would be displayed here</p>
                    <p className="text-sm text-gray-500">Chart type: {chartType}</p>
                  </div>
                </div>
              </div>

              {/* Payment Methods Distribution */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Payment Methods</h3>
                  <button
                    onClick={() => onViewDetailedReport?.('payments')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </button>
                </div>
                
                <div className="space-y-4">
                  {paymentMetrics.paymentMethods.length > 0 ? (
                    paymentMetrics.paymentMethods.map((method, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full bg-${
                            ['blue', 'green', 'purple', 'orange', 'red', 'yellow'][index % 6]
                          }-500`}></div>
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {method.method.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(method.amount)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {method.percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">No payment method data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Payment Performance</h3>
                  <Zap className="w-5 h-5 text-yellow-500" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Payments</span>
                    <span className="text-sm font-medium text-gray-900">
                      {paymentMetrics.totalPayments.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Payment Volume</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(paymentMetrics.paymentVolume)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg Payment Time</span>
                    <span className="text-sm font-medium text-gray-900">
                      {paymentMetrics.averagePaymentTime} days
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Risk Metrics</h3>
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Refund Rate</span>
                    <span className={`text-sm font-medium ${
                      paymentMetrics.refundRate > 5 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {paymentMetrics.refundRate.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Chargeback Rate</span>
                    <span className={`text-sm font-medium ${
                      paymentMetrics.chargebackRate > 1 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {paymentMetrics.chargebackRate.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Risk Score</span>
                    <span className="text-sm font-medium text-yellow-600">Medium</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                  <Settings className="w-5 h-5 text-gray-500" />
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={() => onViewDetailedReport?.('aging')}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                  >
                    <div className="flex items-center justify-between">
                      <span>Aging Report</span>
                      <Eye className="w-4 h-4" />
                    </div>
                  </button>
                  <button
                    onClick={() => onViewDetailedReport?.('collections')}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                  >
                    <div className="flex items-center justify-between">
                      <span>Collections Report</span>
                      <Eye className="w-4 h-4" />
                    </div>
                  </button>
                  <button
                    onClick={() => onViewDetailedReport?.('tax')}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                  >
                    <div className="flex items-center justify-between">
                      <span>Tax Summary</span>
                      <Eye className="w-4 h-4" />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Detailed Tables */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Top Performing Metrics</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onExportReport?.('csv')}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Export CSV
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Metric
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Previous Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Change
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trend
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Revenue
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(revenueMetrics.totalRevenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(revenueMetrics.previousPeriodRevenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={growthConfig.color}>
                          {formatPercentage(revenueMetrics.revenueGrowth)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          <GrowthIcon className={`w-4 h-4 ${growthConfig.color}`} />
                          <span className={`ml-2 ${growthConfig.color}`}>
                            {growthConfig.label}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingReports;
