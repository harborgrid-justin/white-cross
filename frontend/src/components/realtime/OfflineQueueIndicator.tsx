'use client';

/**
 * @fileoverview Offline Queue Indicator Component
 * @module components/realtime/OfflineQueueIndicator
 *
 * Displays pending offline queue operations and sync status.
 * Allows manual sync trigger and queue management.
 */

'use client';

import React, { useState } from 'react';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';
import { Clock, RefreshCw, X, AlertCircle, CheckCircle } from 'lucide-react';

export interface OfflineQueueIndicatorProps {
  showDetails?: boolean;
  className?: string;
}

export function OfflineQueueIndicator({ showDetails = false, className = '' }: OfflineQueueIndicatorProps) {
  const {
    pendingRequests,
    queueStats,
    isSyncing,
    syncQueue,
    retryRequest,
    cancelRequest,
    clearCompleted
  } = useOfflineQueue();

  const [isExpanded, setIsExpanded] = useState(false);

  const pendingCount = pendingRequests.length;

  // Don't show if no pending operations
  if (pendingCount === 0 && !showDetails) {
    return null;
  }

  const handleSync = async () => {
    try {
      await syncQueue();
    } catch (error) {
      console.error('Failed to sync queue:', error);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Indicator Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
      >
        <Clock className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-900">
          {pendingCount} pending operation{pendingCount !== 1 ? 's' : ''}
        </span>

        {isSyncing && (
          <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
        )}
      </button>

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Offline Queue</h3>
              <p className="text-sm text-gray-500">
                {pendingCount} pending, {queueStats.completed} completed, {queueStats.failed} failed
              </p>
            </div>

            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2 p-3 border-b border-gray-200 bg-gray-50">
            <button
              onClick={handleSync}
              disabled={isSyncing || pendingCount === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </button>

            <button
              onClick={clearCompleted}
              disabled={queueStats.completed === 0}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Clear Completed
            </button>
          </div>

          {/* Request List */}
          <div className="max-h-80 overflow-y-auto">
            {pendingRequests.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p className="text-sm">All operations synced</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {pendingRequests.map(request => (
                  <div key={request.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            request.priority === 'emergency' ? 'bg-red-100 text-red-800' :
                            request.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            request.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {request.priority}
                          </span>

                          <span className="text-xs font-mono text-gray-500 truncate">
                            {request.method} {request.url}
                          </span>
                        </div>

                        {request.error && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
                            <AlertCircle className="w-3 h-3" />
                            <span>{request.error}</span>
                          </div>
                        )}

                        <div className="mt-2 text-xs text-gray-400">
                          Attempt {request.retryCount + 1}/{request.maxRetries}
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        {request.status === 'failed' && (
                          <button
                            onClick={() => retryRequest(request.id)}
                            className="p-1 text-blue-600 hover:text-blue-700"
                            title="Retry"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => cancelRequest(request.id)}
                          className="p-1 text-red-600 hover:text-red-700"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default OfflineQueueIndicator;
