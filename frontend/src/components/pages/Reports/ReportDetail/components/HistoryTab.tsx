'use client';

import React from 'react';
import { Download } from 'lucide-react';
import type { ExecutionResult } from '../types';
import { getExecutionStatusInfo } from '../helpers';

interface HistoryTabProps {
  recentExecutions: ExecutionResult[];
  onDownloadResult?: (resultId: string, format: 'pdf' | 'excel' | 'csv') => void;
}

/**
 * HistoryTab Component
 *
 * Displays execution history with download options for completed runs.
 */
const HistoryTab: React.FC<HistoryTabProps> = ({
  recentExecutions,
  onDownloadResult
}) => {
  if (recentExecutions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Execution History</h3>
      <div className="space-y-3">
        {recentExecutions.map((execution) => {
          const statusInfo = getExecutionStatusInfo(execution.status);
          const StatusIcon = statusInfo.icon;

          return (
            <div key={execution.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${statusInfo.color}`}>
                    <StatusIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {statusInfo.label} • {execution.startTime.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {execution.executionTime && `Duration: ${execution.executionTime}s`}
                      {execution.recordCount && ` • ${execution.recordCount.toLocaleString()} records`}
                    </p>
                    {execution.error && (
                      <p className="text-sm text-red-600 mt-1">{execution.error}</p>
                    )}
                  </div>
                </div>

                {execution.status === 'completed' && execution.downloadUrl && onDownloadResult && (
                  <button
                    onClick={() => onDownloadResult(execution.id, 'pdf')}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700
                             bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryTab;
