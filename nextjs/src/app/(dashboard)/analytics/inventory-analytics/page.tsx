/**
 * Inventory Analytics Page
 */

'use client';

import { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DataExporter } from '@/components/analytics/DataExporter';
import { CHART_COLORS, CHART_PALETTE, CHART_TOOLTIP_STYLE } from '@/lib/analytics/charts';
import { Package, AlertTriangle, Calendar, Download, TrendingDown } from 'lucide-react';

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";


export default function InventoryAnalyticsPage() {
  const [showExporter, setShowExporter] = useState(false);

  const categoryData = [
    { category: 'Pain Relief', quantity: 450, lowStock: 8, color: CHART_PALETTE[0] },
    { category: 'Antibiotics', quantity: 320, lowStock: 3, color: CHART_PALETTE[1] },
    { category: 'First Aid', quantity: 890, lowStock: 12, color: CHART_PALETTE[2] },
    { category: 'Emergency', quantity: 150, lowStock: 2, color: CHART_PALETTE[3] },
    { category: 'Chronic Care', quantity: 280, lowStock: 5, color: CHART_PALETTE[4] },
  ];

  const expirationData = [
    { name: 'Expired', value: 12, color: CHART_COLORS.danger },
    { name: 'Expiring Soon (30 days)', value: 28, color: CHART_COLORS.warning },
    { name: 'Good', value: 342, color: CHART_COLORS.success },
  ];

  const usageTrend = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      month: 'short',
    }),
    usage: Math.floor(80 + Math.random() * 40),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor medication inventory, expiration, and usage patterns
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
          { label: 'Total Items', value: '2,090', icon: Package, color: 'text-blue-600' },
          { label: 'Low Stock', value: '30', icon: TrendingDown, color: 'text-yellow-600' },
          { label: 'Expiring Soon', value: '28', icon: Calendar, color: 'text-orange-600' },
          { label: 'Expired', value: '12', icon: AlertTriangle, color: 'text-red-600' },
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
          data={categoryData}
          filename="inventory-analytics"
          title="Export Inventory Data"
        />
      )}

      {/* Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Legend />
              <Bar dataKey="quantity" fill={CHART_COLORS.primary} name="Quantity" radius={[8, 8, 0, 0]} />
              <Bar dataKey="lowStock" fill={CHART_COLORS.warning} name="Low Stock Items" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expiration Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expirationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {expirationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Usage Trend */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Usage Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={usageTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
            <Bar dataKey="usage" fill={CHART_COLORS.success} name="Items Used" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
