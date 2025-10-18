/**
 * WF-COMP-176 | EmergencyContactsHeader.tsx - React component or utility module
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
 * Emergency Contacts Header Component
 *
 * Displays the page header with title and action button
 *
 * @module components/EmergencyContactsHeader
 */

import React from 'react';
import { Plus } from 'lucide-react';

interface EmergencyContactsHeaderProps {
  onAddContact: () => void;
}

/**
 * Header component for emergency contacts page
 */
export default function EmergencyContactsHeader({
  onAddContact,
}: EmergencyContactsHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Emergency Contact System</h1>
        <p className="text-gray-600">Manage emergency contacts and multi-channel communication</p>
      </div>
      <button onClick={onAddContact} className="btn-primary flex items-center">
        <Plus className="h-4 w-4 mr-2" />
        Add Contact
      </button>
    </div>
  );
}
