'use client';

import React from 'react';
import { Eye, Download, Share2, Tag } from 'lucide-react';
import type { Report } from '../../ReportCard';

interface OverviewTabProps {
  report: Report;
}

/**
 * OverviewTab Component
 *
 * Displays report overview including metrics, details, and tags.
 */
const OverviewTab: React.FC<OverviewTabProps> = ({ report }) => {
  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center">
            <Eye className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-600">Views</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{report.metrics.views.toLocaleString()}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center">
            <Download className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-600">Downloads</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{report.metrics.downloads.toLocaleString()}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center">
            <Share2 className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-600">Shares</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{report.metrics.shares.toLocaleString()}</p>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Details</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Frequency</dt>
              <dd className="text-sm text-gray-900">{report.frequency.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="text-sm text-gray-900">{report.createdDate.toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Last Generated</dt>
              <dd className="text-sm text-gray-900">
                {report.lastGenerated ? report.lastGenerated.toLocaleDateString() : 'Never'}
              </dd>
            </div>
            {report.nextScheduled && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Next Scheduled</dt>
                <dd className="text-sm text-gray-900">{report.nextScheduled.toLocaleDateString()}</dd>
              </div>
            )}
            {report.recordCount && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Record Count</dt>
                <dd className="text-sm text-gray-900">{report.recordCount.toLocaleString()}</dd>
              </div>
            )}
            {report.estimatedRunTime && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Estimated Run Time</dt>
                <dd className="text-sm text-gray-900">{report.estimatedRunTime} seconds</dd>
              </div>
            )}
          </dl>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
          {report.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {report.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium
                           text-gray-700 bg-gray-100 rounded-full"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No tags assigned</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
