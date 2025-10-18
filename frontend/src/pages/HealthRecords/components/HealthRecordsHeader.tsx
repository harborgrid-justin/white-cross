/**
 * WF-COMP-187 | HealthRecordsHeader.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react, lucide-react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Health Records Header Component
 *
 * Displays page header with title and action buttons
 *
 * @module components/HealthRecordsHeader
 */

import React from 'react';
import { FileText, Download, Settings, BarChart3 } from 'lucide-react';

interface User {
  role?: string;
  email?: string;
}

interface HealthRecordsHeaderProps {
  user: User | null;
  selectedStudentId: string;
  isExporting: boolean;
  onNewRecord: () => void;
  onImport: () => void;
  onExport: (format: 'pdf' | 'json') => void;
  onSettings: () => void;
  onReports: () => void;
}

/**
 * Header component for health records page
 */
export default function HealthRecordsHeader({
  user,
  selectedStudentId,
  isExporting,
  onNewRecord,
  onImport,
  onExport,
  onSettings,
  onReports,
}: HealthRecordsHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Health Records Management</h1>
        <p className="text-gray-600">Comprehensive electronic health records system</p>
      </div>
      <div className="flex space-x-2">
        {user?.role !== 'READ_ONLY' && (
          <>
            <button
              className="btn-primary flex items-center"
              onClick={onNewRecord}
              aria-label="Create new health record"
            >
              <FileText className="h-4 w-4 mr-2" aria-hidden="true" />
              New Record
            </button>
            <button
              className="btn-secondary flex items-center"
              onClick={onImport}
              aria-label="Import health records"
            >
              Import
            </button>
          </>
        )}
        <div className="relative group">
          <button
            className="btn-secondary flex items-center"
            aria-label="Export health records"
            disabled={!selectedStudentId || isExporting}
          >
            <Download className="h-4 w-4 mr-2" aria-hidden="true" />
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
            <div className="py-1">
              <button
                onClick={() => onExport('pdf')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                disabled={isExporting}
              >
                Export as PDF
              </button>
              <button
                onClick={() => onExport('json')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                disabled={isExporting}
              >
                Export as JSON
              </button>
            </div>
          </div>
        </div>
        {user?.role === 'ADMIN' && (
          <>
            <button
              className="btn-secondary flex items-center"
              onClick={onSettings}
              aria-label="Admin settings"
            >
              <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
              Admin Settings
            </button>
            <button
              className="btn-secondary flex items-center"
              onClick={onReports}
              aria-label="View reports"
            >
              <BarChart3 className="h-4 w-4 mr-2" aria-hidden="true" />
              Reports
            </button>
          </>
        )}
      </div>
    </div>
  );
}
