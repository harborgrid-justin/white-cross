/**
 * Appointment Analytics Page
 */

'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DataExporter } from '@/components/analytics/DataExporter';
import { CHART_COLORS, CHART_PALETTE, CHART_TOOLTIP_STYLE } from '@/lib/analytics/charts';
import { Calendar, Download, RefreshCw, TrendingUp, Clock, XCircle, CheckCircle } from 'lucide-react';

export default function AppointmentAnalyticsPage() {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date(),
  });
  const [showExporter, setShowExporter] = useState(false);

  const appointmentData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    scheduled: Math.floor(10 + Math.random() * 10),
    completed: Math.floor(8 + Math.random() * 8),
    cancelled: Math.floor(1 + Math.random() * 3),
    noShow: Math.floor(0 + Math.random() * 2),
  }));

  const statusData = [
    { name: 'Completed', value: 842, color: CHART_COLORS.success },
    { name: 'Cancelled', value: 48, color: CHART_COLORS.warning },
    { name: 'No-Show', value: 23, color: CHART_COLORS.danger },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointment Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Analyze appointment patterns and efficiency metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExporter(!showExporter)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Appointments', value: '913', icon: Calendar, color: 'text-blue-600' },
          { label: 'Completed', value: '842', icon: CheckCircle, color: 'text-green-600' },
          { label: 'Cancelled', value: '48', icon: XCircle, color: 'text-yellow-600' },
          { label: 'No-Show Rate', value: '2.5%', icon: TrendingUp, color: 'text-red-600' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-5 w-5 ${stat.color}`} />
                <span className="text-sm font-medium text-gray-600">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {showExporter && (
        <DataExporter
          data={appointmentData}
          filename="appointment-analytics"
          title="Export Appointment Data"
        />
      )}

      {/* Appointment Trends */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Trends</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={appointmentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
            <Legend />
            <Bar dataKey="scheduled" fill={CHART_COLORS.primary} name="Scheduled" radius={[8, 8, 0, 0]} />
            <Bar dataKey="completed" fill={CHART_COLORS.success} name="Completed" radius={[8, 8, 0, 0]} />
            <Bar dataKey="cancelled" fill={CHART_COLORS.warning} name="Cancelled" radius={[8, 8, 0, 0]} />
            <Bar dataKey="noShow" fill={CHART_COLORS.danger} name="No-Show" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Rate Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={appointmentData.map((d) => ({
              ...d,
              completionRate: d.scheduled > 0 ? (d.completed / d.scheduled) * 100 : 0,
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={(value: number) => [`${value.toFixed(1)}%`, 'Completion Rate']} />
              <Line type="monotone" dataKey="completionRate" stroke={CHART_COLORS.primary} strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
