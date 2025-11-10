'use client';

/**
 * InventoryReportsContent Component
 *
 * Generate and view various inventory reports and analytics.
 * Includes stock usage, valuation, turnover, and trending reports.
 *
 * @module InventoryReportsContent
 */

import React, { useState } from 'react';

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'stock' | 'financial' | 'usage' | 'compliance';
  icon: string;
}

/**
 * Inventory reports and analytics component
 *
 * @returns Rendered reports view
 */
export default function InventoryReportsContent() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'stock-levels',
      name: 'Current Stock Levels',
      description: 'Overview of all current inventory stock levels',
      category: 'stock',
      icon: '📊',
    },
    {
      id: 'low-stock',
      name: 'Low Stock Report',
      description: 'Items below minimum stock levels or reorder points',
      category: 'stock',
      icon: '⚠️',
    },
    {
      id: 'expiring-items',
      name: 'Expiring Items',
      description: 'Items approaching or past expiration dates',
      category: 'compliance',
      icon: '📅',
    },
    {
      id: 'inventory-valuation',
      name: 'Inventory Valuation',
      description: 'Total value of current inventory by category',
      category: 'financial',
      icon: '💰',
    },
    {
      id: 'usage-trends',
      name: 'Usage Trends',
      description: 'Item usage patterns over time',
      category: 'usage',
      icon: '📈',
    },
    {
      id: 'stock-turnover',
      name: 'Stock Turnover',
      description: 'Inventory turnover rates by category',
      category: 'usage',
      icon: '🔄',
    },
    {
      id: 'transaction-summary',
      name: 'Transaction Summary',
      description: 'Summary of all inventory transactions',
      category: 'usage',
      icon: '📝',
    },
    {
      id: 'controlled-substances',
      name: 'Controlled Substances Log',
      description: 'Detailed log of controlled substance transactions',
      category: 'compliance',
      icon: '🔐',
    },
  ];

  const generateReport = (reportId: string) => {
    console.log(`Generating report: ${reportId} for period: ${selectedPeriod}`);
    setSelectedReport(reportId);
  };

  const getCategoryBadge = (category: string) => {
    const badges = {
      stock: 'bg-blue-100 text-blue-800',
      financial: 'bg-green-100 text-green-800',
      usage: 'bg-purple-100 text-purple-800',
      compliance: 'bg-red-100 text-red-800',
    };
    return badges[category as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Reports</h1>
        <p className="text-gray-600 mt-2">Generate comprehensive inventory analytics and reports</p>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Report Period</label>
        <div className="flex gap-2">
          {[
            { value: 'week', label: 'Last 7 Days' },
            { value: 'month', label: 'Last 30 Days' },
            { value: 'quarter', label: 'Last Quarter' },
            { value: 'year', label: 'Last Year' },
            { value: 'custom', label: 'Custom Range' },
          ].map(period => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === period.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Report Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTemplates.map(template => (
          <div
            key={template.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-4xl">{template.icon}</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryBadge(template.category)}`}>
                {template.category.toUpperCase()}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{template.description}</p>

            <button
              onClick={() => generateReport(template.id)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              Generate Report
            </button>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Items</p>
            <p className="text-2xl font-bold text-gray-900">142</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Value</p>
            <p className="text-2xl font-bold text-green-600">$12,450</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Transactions (30d)</p>
            <p className="text-2xl font-bold text-blue-600">387</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Avg Turnover</p>
            <p className="text-2xl font-bold text-purple-600">45 days</p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="mt-6 bg-gray-50 rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Export Options</h3>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm transition-colors">
            📄 Export to PDF
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm transition-colors">
            📊 Export to Excel
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm transition-colors">
            📧 Email Report
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm transition-colors">
            🖨️ Print
          </button>
        </div>
      </div>
    </div>
  );
}

// Export both named and default for flexibility
export { InventoryReportsContent }
