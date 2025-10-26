import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Activity } from 'lucide-react';

// Types
interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface DashboardChartsProps {
  className?: string;
  timeRange?: '7d' | '30d' | '90d' | '1y';
  onTimeRangeChange?: (range: '7d' | '30d' | '90d' | '1y') => void;
}

// Mock data for charts
const generateMockData = (timeRange: string): {
  patientTrends: ChartData[];
  appointmentsByType: ChartData[];
  monthlyStats: ChartData[];
  departmentActivity: ChartData[];
} => {
  return {
    patientTrends: [
      { label: 'Jan', value: 120, color: '#3b82f6' },
      { label: 'Feb', value: 135, color: '#3b82f6' },
      { label: 'Mar', value: 148, color: '#3b82f6' },
      { label: 'Apr', value: 162, color: '#3b82f6' },
      { label: 'May', value: 155, color: '#3b82f6' },
      { label: 'Jun', value: 178, color: '#3b82f6' },
    ],
    appointmentsByType: [
      { label: 'Consultation', value: 45, color: '#10b981' },
      { label: 'Follow-up', value: 28, color: '#f59e0b' },
      { label: 'Emergency', value: 12, color: '#ef4444' },
      { label: 'Procedure', value: 15, color: '#8b5cf6' },
    ],
    monthlyStats: [
      { label: 'Week 1', value: 85, color: '#06b6d4' },
      { label: 'Week 2', value: 92, color: '#06b6d4' },
      { label: 'Week 3', value: 78, color: '#06b6d4' },
      { label: 'Week 4', value: 96, color: '#06b6d4' },
    ],
    departmentActivity: [
      { label: 'Cardiology', value: 67, color: '#f97316' },
      { label: 'Neurology', value: 45, color: '#84cc16' },
      { label: 'Orthopedics', value: 38, color: '#ec4899' },
      { label: 'Pediatrics', value: 52, color: '#6366f1' },
    ],
  };
};

const DashboardCharts: React.FC<DashboardChartsProps> = ({
  className,
  timeRange = '30d',
  onTimeRangeChange,
}) => {
  const chartData = generateMockData(timeRange);

  const timeRangeOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
  ];

  return (
    <div className={twMerge(clsx('space-y-6', className))}>
      {/* Header with time range selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Analytics Overview</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Time Range:</span>
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange?.(e.target.value as any)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timeRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Trends Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-gray-900">Patient Trends</h3>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div className="space-y-3">
            {chartData.patientTrends.map((item, index) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.label}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(item.value / Math.max(...chartData.patientTrends.map(d => d.value))) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Appointments by Type */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-gray-900">Appointments by Type</h3>
            <PieChartIcon className="h-5 w-5 text-green-600" />
          </div>
          <div className="space-y-3">
            {chartData.appointmentsByType.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Statistics */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-gray-900">Weekly Performance</h3>
            <BarChart3 className="h-5 w-5 text-cyan-600" />
          </div>
          <div className="space-y-3">
            {chartData.monthlyStats.map((item, index) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.label}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${item.value}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{item.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Activity */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-gray-900">Department Activity</h3>
            <Activity className="h-5 w-5 text-orange-600" />
          </div>
          <div className="space-y-3">
            {chartData.departmentActivity.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-base font-medium text-gray-900 mb-4">Quick Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">+12%</div>
            <div className="text-gray-600">Patient Growth</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">94%</div>
            <div className="text-gray-600">Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">2.3h</div>
            <div className="text-gray-600">Avg. Wait Time</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
