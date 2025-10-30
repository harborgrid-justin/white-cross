'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  UserGroupIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  BellIcon,
  ComputerDesktopIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  CalendarDaysIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

/**
 * Communication analytics data point
 */
interface AnalyticsDataPoint {
  label: string;
  value: number;
  percentage?: number;
  trend?: 'up' | 'down' | 'stable';
  change?: number;
}

/**
 * Communication metrics
 */
interface CommunicationMetrics {
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
interface TimeSeriesData {
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
interface CommunicationAnalyticsProps {
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
 * CommunicationAnalytics component for analyzing communication performance and trends
 * 
 * Features:
 * - Communication volume and delivery metrics
 * - Channel performance comparison
 * - Response rate and engagement analysis
 * - Time-based trend analysis
 * - Category and priority breakdowns
 * - Export and reporting capabilities
 * - Real-time dashboard updates
 * - Customizable date ranges and filters
 * 
 * @component
 * @example
 * ```tsx
 * <CommunicationAnalytics
 *   dateRange={{ start: '2024-03-01', end: '2024-03-31' }}
 *   category="emergency"
 *   onDateRangeChange={(range) => handleDateChange(range)}
 *   onFiltersChange={(filters) => handleFiltersChange(filters)}
 * />
 * ```
 */
export const CommunicationAnalytics: React.FC<CommunicationAnalyticsProps> = ({
  className = '',
  isLoading = false,
  error,
  dateRange = {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  },
  studentId,
  staffId,
  category,
  onDateRangeChange,
  onFiltersChange
}): React.ReactElement => {
  // State management
  const [metrics, setMetrics] = useState<CommunicationMetrics | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<'sent' | 'delivered' | 'read' | 'responded'>('sent');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | 'custom'>('30d');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    channels: true,
    categories: true,
    trends: true
  });

  // Mock data - replace with actual API calls
  const mockMetrics: CommunicationMetrics = {
    total_sent: {
      label: 'Total Sent',
      value: 1247,
      trend: 'up',
      change: 12.5
    },
    delivery_rate: {
      label: 'Delivery Rate',
      value: 96.8,
      percentage: 96.8,
      trend: 'up',
      change: 2.1
    },
    response_rate: {
      label: 'Response Rate',
      value: 73.4,
      percentage: 73.4,
      trend: 'down',
      change: -1.8
    },
    avg_response_time: {
      label: 'Avg Response Time',
      value: 2.4,
      trend: 'stable',
      change: 0.1
    },
    channels: {
      email: {
        label: 'Email',
        value: 487,
        percentage: 39.1,
        trend: 'up',
        change: 8.2
      },
      sms: {
        label: 'SMS',
        value: 312,
        percentage: 25.0,
        trend: 'down',
        change: -3.1
      },
      push: {
        label: 'Push',
        value: 298,
        percentage: 23.9,
        trend: 'up',
        change: 15.7
      },
      in_app: {
        label: 'In-App',
        value: 150,
        percentage: 12.0,
        trend: 'up',
        change: 22.4
      }
    },
    categories: {
      emergency: {
        label: 'Emergency',
        value: 23,
        percentage: 1.8,
        trend: 'down',
        change: -12.5
      },
      appointment: {
        label: 'Appointment',
        value: 324,
        percentage: 26.0,
        trend: 'up',
        change: 5.2
      },
      medication: {
        label: 'Medication',
        value: 445,
        percentage: 35.7,
        trend: 'up',
        change: 18.9
      },
      general: {
        label: 'General',
        value: 378,
        percentage: 30.3,
        trend: 'stable',
        change: 1.1
      },
      system: {
        label: 'System',
        value: 77,
        percentage: 6.2,
        trend: 'up',
        change: 9.8
      }
    },
    status: {
      delivered: {
        label: 'Delivered',
        value: 1207,
        percentage: 96.8,
        trend: 'up',
        change: 2.1
      },
      pending: {
        label: 'Pending',
        value: 15,
        percentage: 1.2,
        trend: 'down',
        change: -45.2
      },
      failed: {
        label: 'Failed',
        value: 25,
        percentage: 2.0,
        trend: 'down',
        change: -18.7
      },
      read: {
        label: 'Read',
        value: 886,
        percentage: 71.0,
        trend: 'up',
        change: 4.3
      }
    }
  };

  const mockTimeSeriesData: TimeSeriesData[] = [
    { date: '2024-03-01', sent: 42, delivered: 41, failed: 1, read: 30, responded: 22 },
    { date: '2024-03-02', sent: 38, delivered: 37, failed: 1, read: 28, responded: 19 },
    { date: '2024-03-03', sent: 45, delivered: 44, failed: 1, read: 33, responded: 24 },
    { date: '2024-03-04', sent: 52, delivered: 50, failed: 2, read: 38, responded: 27 },
    { date: '2024-03-05', sent: 48, delivered: 47, failed: 1, read: 35, responded: 25 },
    { date: '2024-03-06', sent: 41, delivered: 40, failed: 1, read: 29, responded: 21 },
    { date: '2024-03-07', sent: 39, delivered: 38, failed: 1, read: 28, responded: 20 },
    { date: '2024-03-08', sent: 43, delivered: 42, failed: 1, read: 31, responded: 23 },
    { date: '2024-03-09', sent: 46, delivered: 45, failed: 1, read: 34, responded: 26 },
    { date: '2024-03-10', sent: 44, delivered: 43, failed: 1, read: 32, responded: 24 }
  ];

  // Load data
  useEffect(() => {
    const loadData = () => {
      // In a real app, this would make API calls with filters
      setMetrics(mockMetrics);
      setTimeSeriesData(mockTimeSeriesData);
    };
    
    loadData();
  }, [dateRange, studentId, staffId, category]);

  // Handle timeframe changes
  const handleTimeframeChange = (timeframe: '7d' | '30d' | '90d' | 'custom'): void => {
    setSelectedTimeframe(timeframe);
    
    if (timeframe !== 'custom') {
      const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
      const end = new Date();
      const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      
      const newRange = {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
      };
      
      onDateRangeChange?.(newRange);
    }
  };

  // Toggle section expansion
  const toggleSection = (section: string): void => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Get trend icon
  const getTrendIcon = (trend: 'up' | 'down' | 'stable' | undefined) => {
    switch (trend) {
      case 'up':
        return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />;
      case 'down':
        return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />;
      case 'stable':
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
    }
  };

  // Get trend color
  const getTrendColor = (trend: 'up' | 'down' | 'stable' | undefined) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'stable':
      default:
        return 'text-gray-600';
    }
  };

  // Get channel icon
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <EnvelopeIcon className="h-5 w-5 text-blue-500" />;
      case 'sms':
        return <DevicePhoneMobileIcon className="h-5 w-5 text-green-500" />;
      case 'push':
        return <BellIcon className="h-5 w-5 text-purple-500" />;
      case 'in_app':
        return <ComputerDesktopIcon className="h-5 w-5 text-orange-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'read':
        return <EyeIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    ) as React.ReactElement;
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading analytics</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    ) as React.ReactElement;
  }

  if (!metrics) {
    return <div className={className}>Loading metrics...</div> as React.ReactElement;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ChartBarIcon className="h-6 w-6 text-gray-900" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Communication Analytics</h1>
            <p className="text-sm text-gray-500">
              {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Timeframe Selector */}
          <div className="flex rounded-md shadow-sm">
            {(['7d', '30d', '90d', 'custom'] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => handleTimeframeChange(timeframe)}
                className={`px-3 py-2 text-sm font-medium border ${
                  selectedTimeframe === timeframe
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                } ${
                  timeframe === '7d' ? 'rounded-l-md' :
                  timeframe === 'custom' ? 'rounded-r-md -ml-px' :
                  '-ml-px'
                }`}
              >
                {timeframe === 'custom' ? 'Custom' : timeframe.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Export Menu */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <DocumentArrowDownIcon className="h-4 w-4 mr-2 inline" />
              Export
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Export as PDF
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Export as CSV
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Export as Excel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Date Range */}
      {selectedTimeframe === 'custom' && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  onDateRangeChange?.({ ...dateRange, start: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  onDateRangeChange?.({ ...dateRange, end: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Overview Metrics */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => toggleSection('overview')}
            className="flex items-center justify-between w-full text-left"
          >
            <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
            {expandedSections.overview ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        
        {expandedSections.overview && (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Total Sent</h3>
                  {getTrendIcon(metrics.total_sent.trend)}
                </div>
                <div className="text-2xl font-bold text-gray-900">{metrics.total_sent.value.toLocaleString()}</div>
                {metrics.total_sent.change !== undefined && (
                  <div className={`text-sm ${getTrendColor(metrics.total_sent.trend)}`}>
                    {metrics.total_sent.change > 0 ? '+' : ''}{metrics.total_sent.change}% from last period
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Delivery Rate</h3>
                  {getTrendIcon(metrics.delivery_rate.trend)}
                </div>
                <div className="text-2xl font-bold text-gray-900">{metrics.delivery_rate.percentage}%</div>
                {metrics.delivery_rate.change !== undefined && (
                  <div className={`text-sm ${getTrendColor(metrics.delivery_rate.trend)}`}>
                    {metrics.delivery_rate.change > 0 ? '+' : ''}{metrics.delivery_rate.change}% from last period
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Response Rate</h3>
                  {getTrendIcon(metrics.response_rate.trend)}
                </div>
                <div className="text-2xl font-bold text-gray-900">{metrics.response_rate.percentage}%</div>
                {metrics.response_rate.change !== undefined && (
                  <div className={`text-sm ${getTrendColor(metrics.response_rate.trend)}`}>
                    {metrics.response_rate.change > 0 ? '+' : ''}{metrics.response_rate.change}% from last period
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Avg Response Time</h3>
                  {getTrendIcon(metrics.avg_response_time.trend)}
                </div>
                <div className="text-2xl font-bold text-gray-900">{metrics.avg_response_time.value}h</div>
                {metrics.avg_response_time.change !== undefined && (
                  <div className={`text-sm ${getTrendColor(metrics.avg_response_time.trend)}`}>
                    {metrics.avg_response_time.change > 0 ? '+' : ''}{metrics.avg_response_time.change}h from last period
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Channel Performance */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => toggleSection('channels')}
            className="flex items-center justify-between w-full text-left"
          >
            <h2 className="text-lg font-semibold text-gray-900">Channel Performance</h2>
            {expandedSections.channels ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        
        {expandedSections.channels && (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(metrics.channels).map(([channel, data]) => (
                <div key={channel} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    {getChannelIcon(channel)}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{data.label}</h3>
                      <p className="text-xs text-gray-500">{data.percentage}% of total</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-gray-900">{data.value.toLocaleString()}</div>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(data.trend)}
                      {data.change !== undefined && (
                        <span className={`text-xs ${getTrendColor(data.trend)}`}>
                          {data.change > 0 ? '+' : ''}{data.change}%
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${data.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => toggleSection('categories')}
            className="flex items-center justify-between w-full text-left"
          >
            <h2 className="text-lg font-semibold text-gray-900">Category Breakdown</h2>
            {expandedSections.categories ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        
        {expandedSections.categories && (
          <div className="p-4">
            <div className="space-y-3">
              {Object.entries(metrics.categories).map(([category, data]) => (
                <div key={category} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      category === 'emergency' ? 'bg-red-500' :
                      category === 'appointment' ? 'bg-blue-500' :
                      category === 'medication' ? 'bg-green-500' :
                      category === 'general' ? 'bg-purple-500' :
                      'bg-gray-500'
                    }`}></div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 capitalize">{data.label}</h3>
                      <p className="text-xs text-gray-500">{data.percentage}% of total</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{data.value.toLocaleString()}</div>
                      {data.change !== undefined && (
                        <div className={`text-xs ${getTrendColor(data.trend)}`}>
                          {data.change > 0 ? '+' : ''}{data.change}%
                        </div>
                      )}
                    </div>
                    {getTrendIcon(data.trend)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status Overview */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Delivery Status</h2>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(metrics.status).map(([status, data]) => (
              <div key={status} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  {getStatusIcon(status)}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 capitalize">{data.label}</h3>
                    <p className="text-xs text-gray-500">{data.percentage}% of total</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-gray-900">{data.value.toLocaleString()}</div>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(data.trend)}
                    {data.change !== undefined && (
                      <span className={`text-xs ${getTrendColor(data.trend)}`}>
                        {data.change > 0 ? '+' : ''}{data.change}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time Series Chart Placeholder */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => toggleSection('trends')}
            className="flex items-center justify-between w-full text-left"
          >
            <h2 className="text-lg font-semibold text-gray-900">Communication Trends</h2>
            {expandedSections.trends ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        
        {expandedSections.trends && (
          <div className="p-4">
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Show metric:</span>
                <select
                  value={selectedMetric}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                    setSelectedMetric(e.target.value as 'sent' | 'delivered' | 'read' | 'responded')
                  }
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sent">Messages Sent</option>
                  <option value="delivered">Messages Delivered</option>
                  <option value="read">Messages Read</option>
                  <option value="responded">Responses Received</option>
                </select>
              </div>
            </div>
            
            {/* Simplified chart representation */}
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Time Series Chart</h3>
                <p className="text-gray-500">
                  Showing {selectedMetric} over time
                  <br />
                  <span className="text-sm">
                    {timeSeriesData.length} data points from {dateRange.start} to {dateRange.end}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunicationAnalytics;
