/**
 * WF-COMP-040 | InventoryBudgetTab.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../../../types | Dependencies: react, lucide-react, ../../../types
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React from 'react'
import { Plus } from 'lucide-react'
import { BudgetCategory } from '../../../../../types'

interface InventoryBudgetTabProps {
  categories: BudgetCategory[]
}

export default function InventoryBudgetTab({ categories }: InventoryBudgetTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Budget Management</h3>
        <button className="btn-primary flex items-center text-sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">{category.name}</h4>
                {category.description && (
                  <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                )}
              </div>
              <span className="text-xs text-gray-500">FY{category.fiscalYear}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Allocated:</span>
                <span className="font-medium">${category.allocatedAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Spent:</span>
                <span className="font-medium text-red-600">${category.spentAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Remaining:</span>
                <span className="font-medium text-green-600">
                  ${(category.allocatedAmount - category.spentAmount).toFixed(2)}
                </span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Utilization</span>
                  <span>{category.utilizationPercentage?.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      (category.utilizationPercentage || 0) > 90 ? 'bg-red-600' :
                      (category.utilizationPercentage || 0) > 75 ? 'bg-yellow-600' :
                      'bg-green-600'
                    }`}
                    style={{ width: `${Math.min(category.utilizationPercentage || 0, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

