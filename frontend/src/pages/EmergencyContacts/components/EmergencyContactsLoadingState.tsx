/**
 * WF-COMP-178 | EmergencyContactsLoadingState.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Emergency Contacts Loading State Component
 *
 * Displays loading indicator
 *
 * @module components/EmergencyContactsLoadingState
 */

import React from 'react';

/**
 * Loading state component
 */
export default function EmergencyContactsLoadingState() {
  return (
    <div className="card p-12 text-center text-gray-500">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
      Loading contacts...
    </div>
  );
}
