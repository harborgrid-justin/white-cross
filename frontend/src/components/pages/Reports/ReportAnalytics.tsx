'use client';

import React, { useState } from 'react';
import { 
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Users,
  FileText,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Share2,
  Settings,
  ArrowUp,
  ArrowDown,
  Minus,
  Info,
  AlertCircle,
  CheckCircle,
  X,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Zap,
  Target,
  Activity,
  Database,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react';

/**
 * Time period options
 */
type TimePeriod = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

/**
 * Metric trend types
 */
type TrendType = 'up' | 'down' | 'stable';

/**
 * Chart types for analytics
 */
type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'donut' | 'gauge';

/**
 * Analytics metric interface
 */
interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  trend: TrendType;
  trendPercentage: number;
  unit: string;
  color: string;
  icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
}

/**
 * Chart data interface
 */
interface ChartData {
  id: string;
  title: string;
  type: ChartType;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string;
      borderWidth?: number;
    }[];
  };
  insights?: string[];
}

/**
 * Report usage statistics
 */
interface ReportUsage {
  reportId: string;
  reportName: string;
  category: string;
  views: number;
  downloads: number;
  shares: number;
  avgExecutionTime: number;
  lastUsed: string;
  popularityScore: number;
}

/**
 * User engagement data
 */
interface UserEngagement {
  userId: string;
  userName: string;
  department: string;
  reportsViewed: number;
  reportsCreated: number;
  avgSessionTime: number;
  lastActive: string;
  favoriteCategory: string;
}

/**
 * System performance metrics
 */
interface SystemMetrics {
  avgResponseTime: number;
  successRate: number;
  errorRate: number;
  activeUsers: number;
  peakUsageTime: string;
  storageUsed: number;
  storageLimit: number;
}

/**
 * Props for the ReportAnalytics component
 */
interface ReportAnalyticsProps {
  /** Analytics metrics */
  metrics?: AnalyticsMetric[];
  /** Chart data */
  charts?: ChartData[];
  /** Report usage statistics */
  reportUsage?: ReportUsage[];
  /** User engagement data */
  userEngagement?: UserEngagement[];
  /** System performance metrics */
  systemMetrics?: SystemMetrics;
  /** Loading state */
  loading?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Time period change handler */
  onTimePeriodChange?: (period: TimePeriod) => void;
  /** Export data handler */
  onExportData?: (format: 'csv' | 'pdf' | 'xlsx') => void;
  /** Refresh data handler */
  onRefreshData?: () => void;
  /** Drill down handler */
  onDrillDown?: (metricId: string, filters: Record<string, unknown>) => void;
}

/**
 * ReportAnalytics Component
 * 
 * A comprehensive analytics dashboard component that provides insights into
 * report usage, user engagement, system performance, and trending metrics.
 * Features interactive charts, drill-down capabilities, and export functionality.
 * 
 * @param props - ReportAnalytics component props
 * @returns JSX element representing the analytics dashboard
 */
const ReportAnalytics = ({
  metrics = [],
  charts = [],
  reportUsage = [],
  userEngagement = [],
  systemMetrics,
  loading = false,
  className = '',
  onTimePeriodChange,
  onExportData,
  onRefreshData,
  onDrillDown
}: ReportAnalyticsProps) => {
  // State
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('month');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    usage: true,
    engagement: false,
    performance: false
  });
  const [selectedChart, setSelectedChart] = useState<string | null>(null);

  /**
   * Gets trend icon and styling
   */
  const getTrendDisplay = (trend: TrendType, percentage: number) => {
    const config = {
      up: { icon: ArrowUp, color: 'text-green-600', bg: 'bg-green-100' },
      down: { icon: ArrowDown, color: 'text-red-600', bg: 'bg-red-100' },
      stable: { icon: Minus, color: 'text-gray-600', bg: 'bg-gray-100' }
    };

    const { icon: Icon, color, bg } = config[trend];
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color} ${bg}`}>
        <Icon className="w-3 h-3 mr-1" />
        {Math.abs(percentage).toFixed(1)}%
      </div>
    );
  };

  /**
   * Formats large numbers
   */
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  /**
   * Formats duration
   */
  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  /**
   * Gets chart icon
   */
  const getChartIcon = (type: ChartType) => {
    const icons = {
      line: LineChart,
      bar: BarChart3,
      pie: PieChart,
      area: LineChart,
      donut: PieChart,
      gauge: Activity
    };
    return icons[type] || BarChart3;
  };

  /**
   * Handles time period change
   */
  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
    onTimePeriodChange?.(period);
  };

  /**
   * Toggles section expansion
   */
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Report Analytics</h1>
            <p className="text-gray-600 mt-1">
              Monitor report performance, user engagement, and system metrics
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Time Period Selector */}
            <select
              value={selectedPeriod}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handlePeriodChange(e.target.value as TimePeriod)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm 
                       focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Select time period"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
            
            {/* Export Options */}
            <div className="relative">
              <button
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                aria-label="Export data"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={onRefreshData}
              disabled={loading}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                       bg-white border border-gray-300 rounded-md hover:bg-gray-50 
                       disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="p-6 space-y-6">
          {/* Overview Metrics */}
          <div className="space-y-4">
            <button
              onClick={() => toggleSection('overview')}
              className="flex items-center w-full text-left"
              aria-label="Toggle overview section"
            >
              {expandedSections.overview ? (
                <ChevronDown className="w-5 h-5 text-gray-400 mr-2" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400 mr-2" />
              )}
              <h2 className="text-lg font-semibold text-gray-900">Overview Metrics</h2>
            </button>
            
            {expandedSections.overview && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div
                      key={metric.id}
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => onDrillDown?.(metric.id, { period: selectedPeriod })}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 rounded-lg bg-opacity-20`} style={{ backgroundColor: metric.color }}>
                          <Icon className="w-6 h-6" style={{ color: metric.color }} />
                        </div>
                        {getTrendDisplay(metric.trend, metric.trendPercentage)}
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-gray-600">{metric.name}</h3>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {formatNumber(metric.value)}
                          </span>
                          <span className="text-sm text-gray-500">{metric.unit}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          vs {formatNumber(metric.previousValue)} last period
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Charts Section */}
          {charts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Performance Charts</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {charts.map((chart) => {
                  const ChartIcon = getChartIcon(chart.type);
                  return (
                    <div key={chart.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <ChartIcon className="w-5 h-5 text-gray-600" />
                          <h3 className="text-lg font-medium text-gray-900">{chart.title}</h3>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedChart(chart.id)}
                            className="p-2 text-gray-400 hover:text-gray-600"
                            title="View full chart"
                            aria-label="View full chart"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-gray-400 hover:text-gray-600"
                            title="More options"
                            aria-label="More options"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Chart Placeholder - In a real app, you'd render actual charts here */}
                      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                        <div className="text-center">
                          <ChartIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">{chart.title} Chart</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {chart.data.datasets.length} datasets • {chart.data.labels.length} data points
                          </p>
                        </div>
                      </div>
                      
                      {/* Chart Insights */}
                      {chart.insights && chart.insights.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Key Insights</h4>
                          <ul className="space-y-1">
                            {chart.insights.map((insight, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-start">
                                <Info className="w-3 h-3 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                                {insight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Report Usage Analytics */}
          <div className="space-y-4">
            <button
              onClick={() => toggleSection('usage')}
              className="flex items-center w-full text-left"
              aria-label="Toggle report usage section"
            >
              {expandedSections.usage ? (
                <ChevronDown className="w-5 h-5 text-gray-400 mr-2" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400 mr-2" />
              )}
              <h2 className="text-lg font-semibold text-gray-900">Report Usage Analytics</h2>
            </button>
            
            {expandedSections.usage && (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Report
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Views
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Downloads
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Avg. Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Popularity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Used
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reportUsage.slice(0, 10).map((report) => (
                        <tr key={report.reportId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FileText className="w-4 h-4 text-gray-400 mr-3" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{report.reportName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {report.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatNumber(report.views)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatNumber(report.downloads)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDuration(report.avgExecutionTime)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${Math.min(report.popularityScore, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600">{report.popularityScore}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(report.lastUsed).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* User Engagement */}
          <div className="space-y-4">
            <button
              onClick={() => toggleSection('engagement')}
              className="flex items-center w-full text-left"
              aria-label="Toggle user engagement section"
            >
              {expandedSections.engagement ? (
                <ChevronDown className="w-5 h-5 text-gray-400 mr-2" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400 mr-2" />
              )}
              <h2 className="text-lg font-semibold text-gray-900">User Engagement</h2>
            </button>
            
            {expandedSections.engagement && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Top Active Users</h3>
                  <div className="space-y-4">
                    {userEngagement.slice(0, 5).map((user) => (
                      <div key={user.userId} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 rounded-full p-2">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.userName}</div>
                            <div className="text-xs text-gray-500">{user.department}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {user.reportsViewed} views
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDuration(user.avgSessionTime * 1000)} avg
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Engagement Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Active Users</span>
                      <span className="text-sm font-medium text-gray-900">
                        {userEngagement.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Avg Reports per User</span>
                      <span className="text-sm font-medium text-gray-900">
                        {userEngagement.length > 0
                          ? (userEngagement.reduce((acc, user) => acc + user.reportsViewed, 0) / userEngagement.length).toFixed(1)
                          : '0'
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Avg Session Time</span>
                      <span className="text-sm font-medium text-gray-900">
                        {userEngagement.length > 0
                          ? formatDuration((userEngagement.reduce((acc, user) => acc + user.avgSessionTime, 0) / userEngagement.length) * 1000)
                          : '0s'
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Reports Created</span>
                      <span className="text-sm font-medium text-gray-900">
                        {userEngagement.reduce((acc, user) => acc + user.reportsCreated, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* System Performance */}
          {systemMetrics && (
            <div className="space-y-4">
              <button
                onClick={() => toggleSection('performance')}
                className="flex items-center w-full text-left"
                aria-label="Toggle system performance section"
              >
                {expandedSections.performance ? (
                  <ChevronDown className="w-5 h-5 text-gray-400 mr-2" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400 mr-2" />
                )}
                <h2 className="text-lg font-semibold text-gray-900">System Performance</h2>
              </button>
              
              {expandedSections.performance && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-green-100 rounded-lg p-2">
                        <Zap className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-600">Avg Response Time</h3>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatDuration(systemMetrics.avgResponseTime)}
                        </p>
                      </div>
                    </div>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      systemMetrics.avgResponseTime < 2000 ? 'text-green-600 bg-green-100' : 
                      systemMetrics.avgResponseTime < 5000 ? 'text-yellow-600 bg-yellow-100' : 
                      'text-red-600 bg-red-100'
                    }`}>
                      {systemMetrics.avgResponseTime < 2000 ? 'Excellent' : 
                       systemMetrics.avgResponseTime < 5000 ? 'Good' : 'Needs Attention'}
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-blue-100 rounded-lg p-2">
                        <Target className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-600">Success Rate</h3>
                        <p className="text-2xl font-bold text-gray-900">
                          {systemMetrics.successRate.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${systemMetrics.successRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-purple-100 rounded-lg p-2">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-600">Active Users</h3>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatNumber(systemMetrics.activeUsers)}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Peak: {systemMetrics.peakUsageTime}</p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-orange-100 rounded-lg p-2">
                        <Database className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-600">Storage Usage</h3>
                        <p className="text-2xl font-bold text-gray-900">
                          {((systemMetrics.storageUsed / systemMetrics.storageLimit) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${
                            (systemMetrics.storageUsed / systemMetrics.storageLimit) * 100 < 80 
                              ? 'bg-green-600' 
                              : (systemMetrics.storageUsed / systemMetrics.storageLimit) * 100 < 90 
                              ? 'bg-yellow-600' 
                              : 'bg-red-600'
                          }`}
                          style={{ width: `${(systemMetrics.storageUsed / systemMetrics.storageLimit) * 100}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatNumber(systemMetrics.storageUsed)} / {formatNumber(systemMetrics.storageLimit)} GB
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Chart Detail Modal */}
      {selectedChart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Chart Details - {charts.find(c => c.id === selectedChart)?.title}
              </h3>
              <button
                onClick={() => setSelectedChart(null)}
                className="p-2 text-gray-400 hover:text-gray-600"
                aria-label="Close chart modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Detailed Chart View</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Interactive chart would be rendered here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportAnalytics;
