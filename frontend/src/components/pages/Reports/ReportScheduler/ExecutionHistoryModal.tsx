'use client';

import React from 'react';
import { X, FileText, CheckCircle, AlertCircle, Info } from 'lucide-react';
import type { ReportSchedule, ExecutionHistory } from '../types';
import { formatDate } from './utils';

/**
 * Props for the ExecutionHistoryModal component
 */
interface ExecutionHistoryModalProps {
  /** Whether the modal is visible */
  isOpen: boolean;
  /** The schedule to show history for */
  schedule: ReportSchedule | null;
  /** Execution history entries */
  executionHistory: ExecutionHistory[];
  /** Callback when modal should close */
  onClose: () => void;
}

/**
 * ExecutionHistoryModal Component
 *
 * Modal dialog that displays the execution history for a specific report schedule.
 * Shows timestamps, status, duration, record counts, and any error messages.
 *
 * @param props - ExecutionHistoryModal component props
 * @returns JSX element representing the execution history modal
 */
export const ExecutionHistoryModal: React.FC<ExecutionHistoryModalProps> = ({
  isOpen,
  schedule,
  executionHistory,
  onClose
}) => {
  if (!isOpen || !schedule) return null;

  // Filter history for the selected schedule
  const scheduleHistory = executionHistory.filter(
    history => history.scheduleId === schedule.id
  );

  /**
   * Gets the appropriate icon for execution status
   */
  const getStatusIcon = (status: 'success' | 'failed' | 'partial') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      case 'partial':
        return <Info className="w-4 h-4" />;
    }
  };

  /**
   * Gets the appropriate styling for execution status
   */
  const getStatusClass = (status: 'success' | 'failed' | 'partial') => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-600';
      case 'failed':
        return 'bg-red-100 text-red-600';
      case 'partial':
        return 'bg-yellow-100 text-yellow-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Execution History - {schedule.name}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
            aria-label="Close history modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {scheduleHistory.length === 0 ? (
            // Empty State
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No execution history available</p>
              <p className="text-sm text-gray-500 mt-2">
                This schedule hasn't been executed yet
              </p>
            </div>
          ) : (
            // History List
            <div className="space-y-4">
              {scheduleHistory.map((history) => (
                <div
                  key={history.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    {/* Status and Details */}
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${getStatusClass(history.status)}`}>
                        {getStatusIcon(history.status)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(history.executedAt)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Duration: {Math.round(history.duration / 1000)}s
                          {history.recordCount && ` • ${history.recordCount.toLocaleString()} records`}
                          {history.fileSize && ` • ${Math.round(history.fileSize / 1024)}KB`}
                        </div>
                      </div>
                    </div>

                    {/* Recipients Count */}
                    <div className="text-sm text-gray-500">
                      Sent to {history.recipients.length} recipient{history.recipients.length !== 1 ? 's' : ''}
                    </div>
                  </div>

                  {/* Error Message (if any) */}
                  {history.errorMessage && (
                    <div className="mt-3 p-3 bg-red-50 rounded-md border border-red-200">
                      <div className="text-sm text-red-800">
                        <strong>Error:</strong> {history.errorMessage}
                      </div>
                    </div>
                  )}

                  {/* Recipients List */}
                  {history.recipients.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">Recipients:</div>
                      <div className="flex flex-wrap gap-1">
                        {history.recipients.map((recipient, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                          >
                            {recipient}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Summary Statistics */}
        {scheduleHistory.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {scheduleHistory.length}
                </div>
                <div className="text-sm text-gray-600">Total Executions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {scheduleHistory.filter(h => h.status === 'success').length}
                </div>
                <div className="text-sm text-gray-600">Successful</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {scheduleHistory.filter(h => h.status === 'failed').length}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutionHistoryModal;
