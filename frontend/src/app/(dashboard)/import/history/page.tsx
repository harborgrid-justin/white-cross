/**
 * Import History Page
 *
 * Displays past import operations with filtering and error log access.
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { ImportHistory, ImportStatus } from '@/features/data-transfer/types';

// ============================================================================
// Component
// ============================================================================

export default function ImportHistoryPage() {
  // Mock data - replace with actual API call
  const [history] = useState<ImportHistory[]>([
    {
      id: '1',
      userId: 'user-1',
      userName: 'John Doe',
      entityType: 'students',
      fileName: 'students-2024.csv',
      fileSize: 2457600,
      format: 'csv',
      status: 'completed',
      totalRows: 1500,
      successfulRows: 1485,
      failedRows: 15,
      startedAt: new Date('2024-10-26T10:00:00'),
      completedAt: new Date('2024-10-26T10:05:30'),
      duration: 330000,
      metadata: {},
    },
    {
      id: '2',
      userId: 'user-1',
      userName: 'John Doe',
      entityType: 'medications',
      fileName: 'medications.xlsx',
      fileSize: 1024000,
      format: 'excel',
      status: 'failed',
      totalRows: 500,
      successfulRows: 200,
      failedRows: 300,
      startedAt: new Date('2024-10-25T14:30:00'),
      completedAt: new Date('2024-10-25T14:32:15'),
      duration: 135000,
      metadata: {},
    },
  ]);

  const [statusFilter, setStatusFilter] = useState<ImportStatus | 'all'>('all');

  /**
   * Filters history by status
   */
  const filteredHistory = history.filter((item) =>
    statusFilter === 'all' ? true : item.status === statusFilter
  );

  /**
   * Formats duration
   */
  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);

    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  /**
   * Gets status badge color
   */
  const getStatusColor = (status: ImportStatus): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Import History</h1>
              <p className="mt-2 text-gray-600">
                View and manage past import operations
              </p>
            </div>
            <Link
              href="/import"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              New Import
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filter by status:</label>
            <div className="flex gap-2">
              {(['all', 'completed', 'failed', 'processing', 'cancelled'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`
                    px-3 py-1 text-sm rounded-lg font-medium transition-colors
                    ${
                      statusFilter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Records
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No import history found
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.fileName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {(item.fileSize / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">
                        {item.entityType.replace(/-/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.totalRows.toLocaleString()} total
                      </div>
                      <div className="text-xs text-gray-500">
                        <span className="text-green-600">
                          {item.successfulRows.toLocaleString()} success
                        </span>
                        {item.failedRows > 0 && (
                          <>
                            {' • '}
                            <span className="text-red-600">
                              {item.failedRows.toLocaleString()} failed
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.startedAt.toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.startedAt.toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.duration ? formatDuration(item.duration) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        View Details
                      </button>
                      {item.failedRows > 0 && (
                        <button className="text-red-600 hover:text-red-900">
                          Error Log
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
