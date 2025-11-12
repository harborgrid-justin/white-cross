'use client';

import React from 'react';
import { Download } from 'lucide-react';
import type { ExecutionResult } from '../types';
import { getExecutionStatusInfo } from '../helpers';

interface ExecutionStatusBarProps {
  executionResult: ExecutionResult;
  onCancelExecution?: () => void;
  onDownloadResult?: (resultId: string, format: 'pdf' | 'excel' | 'csv') => void;
}

/**
 * ExecutionStatusBar Component
 *
 * Displays the current execution status with download and cancel options.
 */
const ExecutionStatusBar: React.FC<ExecutionStatusBarProps> = ({
  executionResult,
  onCancelExecution,
  onDownloadResult
}) => {
  if (!executionResult || executionResult.status === 'idle') {
    return null;
  }

  const statusInfo = getExecutionStatusInfo(executionResult.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="border-b border-gray-200 p-6 bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${statusInfo.color}`}>
            <StatusIcon className={`w-4 h-4 ${executionResult.status === 'running' ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              Report {statusInfo.label}
            </p>
            <p className="text-sm text-gray-600">
              Started {executionResult.startTime.toLocaleString()}
              {executionResult.endTime && (
                <> • Finished {executionResult.endTime.toLocaleString()}</>
              )}
              {executionResult.executionTime && (
                <> • Duration: {executionResult.executionTime}s</>
              )}
              {executionResult.recordCount && (
                <> • {executionResult.recordCount.toLocaleString()} records</>
              )}
            </p>
            {executionResult.error && (
              <p className="text-sm text-red-600 mt-1">{executionResult.error}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {executionResult.status === 'running' && onCancelExecution && (
            <button
              onClick={onCancelExecution}
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-700
                       bg-white border border-red-300 rounded-md hover:bg-red-50"
            >
              Cancel
            </button>
          )}

          {executionResult.status === 'completed' && executionResult.downloadUrl && onDownloadResult && (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onDownloadResult(executionResult.id, 'pdf')}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-1" />
                PDF
              </button>
              <button
                onClick={() => onDownloadResult(executionResult.id, 'excel')}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-1" />
                Excel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecutionStatusBar;
