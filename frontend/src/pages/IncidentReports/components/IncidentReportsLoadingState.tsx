/**
 * WF-COMP-198 | IncidentReportsLoadingState.tsx - React component or utility module
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
 * Incident Reports Loading State Component
 *
 * Displays loading state while fetching data
 *
 * @module components/IncidentReportsLoadingState
 */

import React from 'react';
import { RefreshCw } from 'lucide-react';

/**
 * Loading state component for incident reports
 */
export default function IncidentReportsLoadingState() {
  return (
    <div className="card p-12 text-center">
      <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
      <p className="text-gray-600">Loading incident reports...</p>
    </div>
  );
}
