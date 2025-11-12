'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  RefreshCw,
  Download,
  Settings,
  ChevronDown,
  TrendingUp,
  Target,
  Users,
} from 'lucide-react';
import { DATE_RANGE_OPTIONS } from './BillingAnalytics.constants';
import { formatDateRangeLabel } from './BillingAnalytics.utils';
import type { AnalyticsTab } from './BillingAnalytics.types';

interface BillingAnalyticsHeaderProps {
  dateRange: string;
  loading: boolean;
  activeTab: AnalyticsTab;
  onDateRangeChange?: (range: string) => void;
  onRefresh?: () => void;
  onExportData?: () => void;
  onSettings?: () => void;
  onTabChange: (tab: AnalyticsTab) => void;
}

/**
 * BillingAnalyticsHeader Component
 *
 * Header section for the analytics dashboard with date picker,
 * action buttons, and tab navigation.
 */
const BillingAnalyticsHeader: React.FC<BillingAnalyticsHeaderProps> = ({
  dateRange,
  loading,
  activeTab,
  onDateRangeChange,
  onRefresh,
  onExportData,
  onSettings,
  onTabChange,
}) => {
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'trends' as const, label: 'Trends', icon: TrendingUp },
    { id: 'collections' as const, label: 'Collections', icon: Target },
    { id: 'patients' as const, label: 'Top Patients', icon: Users }
  ];

  return (
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
                {formatDateRangeLabel(dateRange)}
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>

              {showDateRangePicker && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    {DATE_RANGE_OPTIONS.map((option) => (
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
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
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
  );
};

export default BillingAnalyticsHeader;
