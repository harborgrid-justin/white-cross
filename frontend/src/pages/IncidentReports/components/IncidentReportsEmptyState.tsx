/**
 * WF-COMP-194 | IncidentReportsEmptyState.tsx - React component or utility module
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
 * Incident Reports Empty State Component
 *
 * Displays empty state with feature showcase when no reports exist
 *
 * @module components/IncidentReportsEmptyState
 */

import React from 'react';
import { AlertTriangle, FileText, Camera, Bell, Shield, Plus, Search } from 'lucide-react';

interface IncidentReportsEmptyStateProps {
  hasActiveFilters: boolean;
  onCreateIncident: () => void;
  onClearFilters: () => void;
}

/**
 * Empty state component for incident reports
 */
export default function IncidentReportsEmptyState({
  hasActiveFilters,
  onCreateIncident,
  onClearFilters,
}: IncidentReportsEmptyStateProps) {
  // If filters are active, show "no results" state
  if (hasActiveFilters) {
    return (
      <div className="card p-12 text-center">
        <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Incidents Found
        </h3>
        <p className="text-gray-600 mb-4">
          Try adjusting your filters or search query
        </p>
        <button
          onClick={onClearFilters}
          className="btn-secondary"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  // Show full empty state with features
  return (
    <div className="space-y-6">
      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <FileText className="h-8 w-8 text-red-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Documentation</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>Incident documentation</li>
            <li>Automated injury reports</li>
            <li>Witness statements</li>
            <li>Timeline tracking</li>
          </ul>
        </div>

        <div className="card p-6">
          <Camera className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Evidence Collection</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>Photo/video upload</li>
            <li>Document management</li>
            <li>Evidence timestamping</li>
            <li>Secure storage</li>
          </ul>
        </div>

        <div className="card p-6">
          <Bell className="h-8 w-8 text-green-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Notifications</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>Parent notification automation</li>
            <li>Staff alerts</li>
            <li>Follow-up reminders</li>
            <li>Multi-channel delivery</li>
          </ul>
        </div>

        <div className="card p-6">
          <Shield className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Compliance</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>Legal compliance tracking</li>
            <li>Insurance claim integration</li>
            <li>Regulatory reporting</li>
            <li>Complete audit trail</li>
          </ul>
        </div>
      </div>

      {/* Empty State Call to Action */}
      <div className="card p-12 text-center">
        <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Incident Reports Yet
        </h3>
        <p className="text-gray-600 mb-6">
          Get started by creating your first incident report
        </p>
        <button
          onClick={onCreateIncident}
          className="btn-primary inline-flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create First Report
        </button>
      </div>
    </div>
  );
}
