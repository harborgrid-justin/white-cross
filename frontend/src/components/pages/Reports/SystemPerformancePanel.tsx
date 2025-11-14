/**
 * SystemPerformancePanel Component
 *
 * Displays system performance metrics including response time, success rate,
 * active users, and storage usage
 */

import React from 'react';
import { ChevronDown, ChevronRight, Zap, Target, Users, Database } from 'lucide-react';
import { SystemMetrics } from './ReportAnalytics.types';
import {
  formatDuration,
  formatNumber,
  getPerformanceStatusStyle,
  getStorageBarColor
} from './ReportAnalytics.helpers';

interface SystemPerformancePanelProps {
  systemMetrics: SystemMetrics | undefined;
  expanded: boolean;
  onToggle: () => void;
}

const SystemPerformancePanel: React.FC<SystemPerformancePanelProps> = ({
  systemMetrics,
  expanded,
  onToggle
}) => {
  if (!systemMetrics) {
    return null;
  }

  const performanceStatus = getPerformanceStatusStyle(systemMetrics.avgResponseTime);
  const storageBarColor = getStorageBarColor(systemMetrics.storageUsed, systemMetrics.storageLimit);
  const storagePercentage = (systemMetrics.storageUsed / systemMetrics.storageLimit) * 100;

  return (
    <div className="space-y-4">
      <button
        onClick={onToggle}
        className="flex items-center w-full text-left"
        aria-label="Toggle system performance section"
      >
        {expanded ? (
          <ChevronDown className="w-5 h-5 text-gray-400 mr-2" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400 mr-2" />
        )}
        <h2 className="text-lg font-semibold text-gray-900">System Performance</h2>
      </button>

      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Avg Response Time */}
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
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${performanceStatus.className}`}>
              {performanceStatus.text}
            </div>
          </div>

          {/* Success Rate */}
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

          {/* Active Users */}
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

          {/* Storage Usage */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-orange-100 rounded-lg p-2">
                <Database className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Storage Usage</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {storagePercentage.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                <div
                  className={`h-2 rounded-full ${storageBarColor}`}
                  style={{ width: `${storagePercentage}%` }}
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
  );
};

export default SystemPerformancePanel;
