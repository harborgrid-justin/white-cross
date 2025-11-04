'use client';

import React from 'react';
import { FileText, Search, CheckCircle, AlertTriangle } from 'lucide-react';

import type { AccessLogEntry } from './types';
import { getEntityTypeIcon } from './utils';

/**
 * Props for the AccessLogsTable component
 */
export interface AccessLogsTableProps {
  /** Access log entries to display */
  logs: AccessLogEntry[];
  /** Current search term */
  searchTerm: string;
  /** Search term change handler */
  onSearchChange: (term: string) => void;
  /** Maximum number of logs to display */
  maxLogs?: number;
}

/**
 * AccessLogsTable Component
 *
 * Displays access log entries in a table format with search functionality.
 * Shows who accessed what resources, when, and whether access was successful.
 */
export const AccessLogsTable: React.FC<AccessLogsTableProps> = ({
  logs,
  searchTerm,
  onSearchChange,
  maxLogs = 50
}) => {
  const displayLogs = logs.slice(0, maxLogs);

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search access logs..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm
                   focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Search access logs"
        />
      </div>

      {/* Access Logs Table */}
      {logs.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Access Logs</h3>
          <p className="text-gray-600">
            No access logs match your search criteria.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resource
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayLogs.map((log) => {
                    const EntityIcon = getEntityTypeIcon(log.entityType);

                    return (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <EntityIcon className="w-4 h-4 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{log.entityName}</div>
                              <div className="text-sm text-gray-500 capitalize">{log.entityType}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{log.resourceName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {log.success ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Success
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Failed
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.ipAddress}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Show count if limited */}
          {logs.length > maxLogs && (
            <p className="text-sm text-gray-500 text-center">
              Showing {maxLogs} of {logs.length} access logs
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default AccessLogsTable;
