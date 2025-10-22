/**
 * WF-COMP-057 | MedicationsOverviewTab.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react, lucide-react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React from 'react'
import { Pill, Package, AlertTriangle, Bell } from 'lucide-react'

interface MedicationsOverviewTabProps {
  onTabChange: (tab: string) => void
}

export default function MedicationsOverviewTab({ onTabChange }: MedicationsOverviewTabProps) {
  return (
    <div className="space-y-6">
      <div data-testid="overview-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div data-testid="prescription-card" className="card p-6 hover:shadow-lg" role="article">
          <Pill className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Prescription Management</h3>
          <ul data-testid="prescription-features" className="text-sm text-gray-600 space-y-1">
            <li>• Digital prescription tracking</li>
            <li>• Dosage scheduling</li>
            <li>• Administration logging</li>
            <li>• Compliance monitoring</li>
          </ul>
        </div>

        <div data-testid="inventory-card" className="card p-6 hover:shadow-lg" role="article">
          <Package className="h-8 w-8 text-green-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Inventory Tracking</h3>
          <ul data-testid="inventory-features" className="text-sm text-gray-600 space-y-1">
            <li>• Stock level monitoring</li>
            <li>• Expiration date alerts</li>
            <li>• Automated reorder points</li>
            <li>• Supplier management</li>
          </ul>
        </div>

        <div data-testid="safety-card" className="card p-6 hover:shadow-lg" role="article">
          <AlertTriangle className="h-8 w-8 text-red-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Safety & Compliance</h3>
          <ul data-testid="safety-features" className="text-sm text-gray-600 space-y-1">
            <li>• Controlled substance tracking</li>
            <li>• Side effect monitoring</li>
            <li>• Drug interaction alerts</li>
            <li>• Regulatory compliance</li>
          </ul>
        </div>

        <div data-testid="reminders-card" className="card p-6 hover:shadow-lg" role="article">
          <Bell className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Automated Reminders</h3>
          <ul data-testid="reminder-features" className="text-sm text-gray-600 space-y-1">
            <li>• Time-stamped records</li>
            <li>• Nurse verification</li>
            <li>• Student response tracking</li>
            <li>• Dosage reminders</li>
          </ul>
        </div>
      </div>

      <div data-testid="quick-actions" className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            data-testid="view-medications-action"
            onClick={() => onTabChange('medications')}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
          >
            <Pill className="h-6 w-6 text-blue-600 mb-2" />
            <h4 className="font-semibold">View Medications</h4>
            <p className="text-sm text-gray-600">Browse medication database</p>
          </button>
          <button
            data-testid="todays-reminders-action"
            onClick={() => onTabChange('reminders')}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
          >
            <Bell className="h-6 w-6 text-blue-600 mb-2" />
            <h4 className="font-semibold">Today's Reminders</h4>
            <p className="text-sm text-gray-600">View scheduled medications</p>
          </button>
          <button
            data-testid="check-inventory-action"
            onClick={() => onTabChange('inventory')}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
          >
            <Package className="h-6 w-6 text-blue-600 mb-2" />
            <h4 className="font-semibold">Check Inventory</h4>
            <p className="text-sm text-gray-600">Monitor stock levels</p>
          </button>
        </div>
      </div>
    </div>
  )
}

