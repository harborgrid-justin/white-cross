/**
 * WF-COMP-215 | InventoryTabs.tsx - React component or utility module
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
 * Inventory Tabs Component
 *
 * Navigation tabs for different inventory views
 *
 * @module components/InventoryTabs
 */

import React from 'react';
import { Package, TrendingDown, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import type { InventoryTab } from '../types';

interface InventoryTabsProps {
  activeTab: InventoryTab;
  onTabChange: (tab: InventoryTab) => void;
}

const TABS = [
  { id: 'items' as const, label: 'Inventory Items', icon: Package },
  { id: 'vendors' as const, label: 'Vendors', icon: TrendingDown },
  { id: 'orders' as const, label: 'Purchase Orders', icon: ShoppingCart },
  { id: 'budget' as const, label: 'Budget', icon: DollarSign },
  { id: 'analytics' as const, label: 'Analytics', icon: TrendingUp },
];

/**
 * Tabs navigation component
 */
export default function InventoryTabs({ activeTab, onTabChange }: InventoryTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Icon className="h-5 w-5 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
