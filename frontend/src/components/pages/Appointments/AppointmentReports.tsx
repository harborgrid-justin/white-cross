'use client';

import React, { useState, useMemo } from 'react';
import { 
  BarChart3,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  Search,
  RefreshCw,
  Eye,
  FileText,
  PieChart,
  Activity,
  Target,
  Award
} from 'lucide-react';
import type { Appointment } from './AppointmentCard';

/**
 * Report time periods
 */
type ReportPeriod = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

/**
 * Report types
 */
type ReportType = 'appointments' | 'providers' | 'revenue' | 'cancellations' | 'noShows' | 'satisfaction';

/**
 * Appointment statistics
 */
interface AppointmentStats {
  total: number;
  completed: number;
  cancelled: number;
  noShows: number;
  rescheduled: number;
  completionRate: number;
  cancellationRate: number;
  noShowRate: number;
  averageDuration: number;
  totalRevenue: number;
  averageRevenue: number;
}

/**
 * Provider performance data
 */
interface ProviderPerformance {
  providerId: string;
  providerName: string;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShows: number;
  averageRating: number;
  totalRevenue: number;
  utilizationRate: number;
  patientSatisfaction: number;
}

/**
 * Revenue data
 */
interface RevenueData {
  date: string;
  amount: number;
  appointments: number;
  averagePerAppointment: number;
}

/**
 * Report data structure
 */
interface ReportData {
  period: ReportPeriod;
  startDate: Date;
  endDate: Date;
  stats: AppointmentStats;
  providerPerformance: ProviderPerformance[];
  revenueData: RevenueData[];
  trendData: {
    appointments: number[];
    revenue: number[];
    satisfaction: number[];
    labels: string[];
  };
}

/**
 * Props for the AppointmentReports component
 */
interface AppointmentReportsProps {
  /** Appointments data for reports */
  appointments?: Appointment[];
  /** Pre-calculated report data */
  reportData?: ReportData;
  /** Available providers for filtering */
  providers?: Array<{ id: string; name: string; }>;
  /** Available locations for filtering */
  locations?: Array<{ id: string; name: string; }>;
  /** Whether user can export reports */
  canExport?: boolean;
  /** Whether user can view detailed analytics */
  canViewAnalytics?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Report data fetch handler */
  onFetchReportData?: (period: ReportPeriod, startDate?: Date, endDate?: Date, filters?: {
    providerId?: string;
    locationId?: string;
    appointmentType?: string;
  }) => void;
  /** Report export handler */
  onExportReport?: (reportType: ReportType, format: 'pdf' | 'excel' | 'csv') => void;
  /** Report refresh handler */
  onRefreshData?: () => void;
}

/**
 * AppointmentReports Component
 * 
 * A comprehensive reporting and analytics dashboard for appointments with
 * performance metrics, provider analytics, revenue tracking, and trend analysis.
 * Supports various time periods, filtering, and export capabilities.
 * 
 * @param props - AppointmentReports component props
 * @returns JSX element representing the appointment reports interface
 */
const AppointmentReports = ({
  appointments = [],
  reportData,
  providers = [],
  locations = [],
  canExport = true,
  canViewAnalytics = true,
  className = '',
  onFetchReportData,
  onExportReport,
  onRefreshData
}: AppointmentReportsProps) => {
  // State
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('month');
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('appointments');
  const [selectedProviderId, setSelectedProviderId] = useState<string>('all');
  const [selectedLocationId, setSelectedLocationId] = useState<string>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Gets period display text
   */
  const getPeriodText = (period: ReportPeriod): string => {
    const periodMap = {
      today: 'Today',
      week: 'This Week',
      month: 'This Month',
      quarter: 'This Quarter',
      year: 'This Year',
      custom: 'Custom Range'
    };
    return periodMap[period];
  };

  /**
   * Gets status color for metrics
   */
  const getStatusColor = (value: number, threshold: number, isReverse = false): string => {
    const isGood = isReverse ? value < threshold : value > threshold;
    return isGood ? 'text-green-600' : 'text-red-600';
  };

  /**
   * Gets trend icon based on value change
   */
  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Activity className="w-4 h-4 text-gray-400" />;
  };

  /**
   * Default stats when no report data available
   */
  const defaultStats: AppointmentStats = useMemo(() => {
    const total = appointments.length;
    const completed = appointments.filter(apt => apt.status === 'completed').length;
    const cancelled = appointments.filter(apt => apt.status === 'cancelled').length;
    const noShows = appointments.filter(apt => apt.status === 'no-show').length;
    
    return {
      total,
      completed,
      cancelled,
      noShows,
      rescheduled: 0,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      cancellationRate: total > 0 ? (cancelled / total) * 100 : 0,
      noShowRate: total > 0 ? (noShows / total) * 100 : 0,
      averageDuration: 30,
      totalRevenue: completed * 150,
      averageRevenue: 150
    };
  }, [appointments]);

  const stats = reportData?.stats || defaultStats;

  /**
   * Handles period change
   */
  const handlePeriodChange = (period: ReportPeriod) => {
    setSelectedPeriod(period);
    if (period !== 'custom') {
      onFetchReportData?.(period, undefined, undefined, {
        providerId: selectedProviderId !== 'all' ? selectedProviderId : undefined,
        locationId: selectedLocationId !== 'all' ? selectedLocationId : undefined
      });
    }
  };

  /**
   * Handles custom date range submission
   */
  const handleCustomDateSubmit = () => {
    if (customStartDate && customEndDate) {
      onFetchReportData?.(
        'custom',
        new Date(customStartDate),
        new Date(customEndDate),
        {
          providerId: selectedProviderId !== 'all' ? selectedProviderId : undefined,
          locationId: selectedLocationId !== 'all' ? selectedLocationId : undefined
        }
      );
    }
  };

  /**
   * Renders overview metrics
   */
  const renderOverviewMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Appointments</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <Calendar className="w-8 h-8 text-blue-400" />
        </div>
        <div className="mt-2 flex items-center">
          {getTrendIcon(stats.total, 0)}
          <span className="text-sm text-gray-600 ml-1">
            vs previous period
          </span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Completion Rate</p>
            <p className={`text-3xl font-bold ${getStatusColor(stats.completionRate, 85)}`}>
              {stats.completionRate.toFixed(1)}%
            </p>
          </div>
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <div className="mt-2">
          <span className="text-sm text-gray-600">
            {stats.completed} of {stats.total} completed
          </span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600">
              ${stats.totalRevenue.toLocaleString()}
            </p>
          </div>
          <DollarSign className="w-8 h-8 text-green-400" />
        </div>
        <div className="mt-2">
          <span className="text-sm text-gray-600">
            ${stats.averageRevenue} avg per appointment
          </span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">No-Show Rate</p>
            <p className={`text-3xl font-bold ${getStatusColor(stats.noShowRate, 10, true)}`}>
              {stats.noShowRate.toFixed(1)}%
            </p>
          </div>
          <XCircle className="w-8 h-8 text-red-400" />
        </div>
        <div className="mt-2">
          <span className="text-sm text-gray-600">
            {stats.noShows} no-shows
          </span>
        </div>
      </div>
    </div>
  );

  /**
   * Renders provider performance table
   */
  const renderProviderPerformance = () => (
    <div className="bg-white rounded-lg border border-gray-200 mb-8">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Provider Performance</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Provider
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Appointments
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Completion Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilization
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reportData?.providerPerformance?.slice(0, 10).map((provider) => (
              <tr key={provider.providerId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {provider.providerName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{provider.providerName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{provider.totalAppointments}</div>
                  <div className="text-sm text-gray-500">{provider.completedAppointments} completed</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${
                    getStatusColor((provider.completedAppointments / provider.totalAppointments) * 100, 85)
                  }`}>
                    {((provider.completedAppointments / provider.totalAppointments) * 100).toFixed(1)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${provider.totalRevenue.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Award className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-900">{provider.averageRating.toFixed(1)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${provider.utilizationRate}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{provider.utilizationRate}%</span>
                  </div>
                </td>
              </tr>
            )) || (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No provider performance data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  /**
   * Renders appointment status breakdown
   */
  const renderStatusBreakdown = () => (
    <div className="bg-white rounded-lg border border-gray-200 mb-8">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Appointment Status Breakdown</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-xs text-gray-500">{stats.completionRate.toFixed(1)}%</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
            <p className="text-sm text-gray-600">Cancelled</p>
            <p className="text-xs text-gray-500">{stats.cancellationRate.toFixed(1)}%</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-yellow-600">{stats.noShows}</p>
            <p className="text-sm text-gray-600">No-Shows</p>
            <p className="text-xs text-gray-500">{stats.noShowRate.toFixed(1)}%</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <RefreshCw className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.rescheduled}</p>
            <p className="text-sm text-gray-600">Rescheduled</p>
            <p className="text-xs text-gray-500">
              {((stats.rescheduled / stats.total) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`max-w-7xl mx-auto p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointment Reports</h1>
          <p className="text-gray-600 mt-1">Analytics and performance insights</p>
        </div>
        <div className="flex items-center space-x-3">
          {canExport && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onExportReport?.('appointments', 'pdf')}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </button>
              <button
                onClick={() => onExportReport?.('appointments', 'excel')}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export Excel
              </button>
            </div>
          )}
          <button
            onClick={onRefreshData}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                     bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 
                     disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handlePeriodChange(e.target.value as ReportPeriod)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Provider
            </label>
            <select
              value={selectedProviderId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedProviderId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Providers</option>
              {providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <select
              value={selectedLocationId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedLocationId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Locations</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          {selectedPeriod === 'custom' && (
            <div className="flex items-end">
              <button
                onClick={handleCustomDateSubmit}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 
                         border border-transparent rounded-md hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overview Metrics */}
      {renderOverviewMetrics()}

      {/* Status Breakdown */}
      {renderStatusBreakdown()}

      {/* Provider Performance */}
      {canViewAnalytics && renderProviderPerformance()}

      {/* Quick Insights */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Quick Insights</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Performance Highlights</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-700">Average appointment duration</span>
                  <span className="font-medium text-green-600">{stats.averageDuration} min</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-700">Revenue per appointment</span>
                  <span className="font-medium text-blue-600">${stats.averageRevenue}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Areas for Improvement</h4>
              <div className="space-y-2">
                {stats.noShowRate > 10 && (
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="text-sm text-gray-700">High no-show rate</span>
                    <span className="font-medium text-red-600">{stats.noShowRate.toFixed(1)}%</span>
                  </div>
                )}
                {stats.cancellationRate > 15 && (
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm text-gray-700">High cancellation rate</span>
                    <span className="font-medium text-yellow-600">{stats.cancellationRate.toFixed(1)}%</span>
                  </div>
                )}
                {stats.noShowRate <= 10 && stats.cancellationRate <= 15 && (
                  <div className="flex items-center justify-center p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm text-green-700">All metrics within target ranges</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentReports;
