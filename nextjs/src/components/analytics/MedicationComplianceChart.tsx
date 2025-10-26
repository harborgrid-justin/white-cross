/**
 * Medication Compliance Chart Component
 */

'use client';

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS, CHART_TOOLTIP_STYLE, renderPieLabel } from '@/lib/analytics/charts';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface ComplianceData {
  administered: number;
  missed: number;
  pending: number;
  total: number;
}

interface MedicationComplianceChartProps {
  data: ComplianceData;
  trendData?: Array<{ date: string; complianceRate: number }>;
  title?: string;
}

export function MedicationComplianceChart({
  data,
  trendData,
  title = 'Medication Compliance',
}: MedicationComplianceChartProps) {
  const complianceRate = data.total > 0 ? (data.administered / data.total) * 100 : 0;

  const pieData = [
    { name: 'Administered', value: data.administered, color: CHART_COLORS.success },
    { name: 'Missed', value: data.missed, color: CHART_COLORS.danger },
    { name: 'Pending', value: data.pending, color: CHART_COLORS.warning },
  ];

  const getComplianceStatus = (rate: number) => {
    if (rate >= 95) return { label: 'Excellent', color: 'text-green-600' };
    if (rate >= 85) return { label: 'Good', color: 'text-blue-600' };
    if (rate >= 75) return { label: 'Fair', color: 'text-yellow-600' };
    return { label: 'Poor', color: 'text-red-600' };
  };

  const status = getComplianceStatus(complianceRate);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">
            {complianceRate.toFixed(1)}%
          </div>
          <div className={`text-sm font-medium ${status.color}`}>{status.label}</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Administered</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{data.administered}</div>
          <div className="text-xs text-green-700 mt-1">
            {data.total > 0 ? ((data.administered / data.total) * 100).toFixed(1) : 0}%
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-red-900">Missed</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{data.missed}</div>
          <div className="text-xs text-red-700 mt-1">
            {data.total > 0 ? ((data.missed / data.total) * 100).toFixed(1) : 0}%
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-900">Pending</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600">{data.pending}</div>
          <div className="text-xs text-yellow-700 mt-1">
            {data.total > 0 ? ((data.pending / data.total) * 100).toFixed(1) : 0}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderPieLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={CHART_TOOLTIP_STYLE}
                formatter={(value: number) => [value, '']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Trend Chart */}
        {trendData && trendData.length > 0 && (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-4">Compliance Trend</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={CHART_TOOLTIP_STYLE}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Compliance']}
                />
                <Bar
                  dataKey="complianceRate"
                  fill={CHART_COLORS.primary}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
