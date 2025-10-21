/**
 * WF-COMP-212 | InventoryHeader.tsx - React component or utility module
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
 * Inventory Header Component
 *
 * Displays page header with title and action button
 *
 * @module components/InventoryHeader
 */

import React from 'react';
import { Plus } from 'lucide-react';

interface InventoryHeaderProps {
  onAddItem: () => void;
}

/**
 * Header component for inventory page
 */
export default function InventoryHeader({ onAddItem }: InventoryHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-600">
          Track medical supplies, equipment, and automated reordering
        </p>
      </div>
      <button className="btn-primary flex items-center" onClick={onAddItem}>
        <Plus className="h-4 w-4 mr-2" />
        Add Item
      </button>
    </div>
  );
}
