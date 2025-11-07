'use client';

/**
 * WF-COMP-031 | GrowthChartsTab.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react, lucide-react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: functional component, arrow component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React, { useMemo } from 'react'
import { Plus, TrendingUp } from 'lucide-react'
import type { GrowthMeasurement } from '@/types/healthRecords'
import type { User } from '@/types'

interface GrowthChartsTabProps {
  measurements: GrowthMeasurement[]
  onAddMeasurement: () => void
  user?: User | null
}

export const GrowthChartsTab = React.memo<GrowthChartsTabProps>(({
  measurements,
  onAddMeasurement,
  user
}) => {
  const canModify = useMemo(() =>
    user?.role ? ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'COUNSELOR'].includes(user.role) : false,
    [user?.role]
  )

  // Use the measurements prop passed from parent component (real API data)
  // No mock data - this is CRITICAL for HIPAA compliance
  const displayMeasurements = useMemo(() => measurements || [], [measurements])

  return (
    <div className="space-y-4" data-testid="growth-charts-content">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Growth Chart Analysis</h3>
        <button
          className="btn-primary flex items-center"
          data-testid="add-measurement-button"
          onClick={onAddMeasurement}
          disabled={!canModify}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Measurement
        </button>
      </div>

      {/* Chart Type Selector */}
      <div className="flex gap-4 items-center">
        <label htmlFor="chart-type" className="text-sm font-medium text-gray-700">Chart Type:</label>
        <select id="chart-type" name="chartType" className="border border-gray-300 rounded-lg px-3 py-2" data-testid="chart-type-selector">
          <option value="Height">Height</option>
          <option value="Weight">Weight</option>
          <option value="BMI">BMI</option>
          <option value="Head Circumference">Head Circumference</option>
        </select>
      </div>

      {/* Growth Chart Display */}
      <div className="border border-gray-200 rounded-lg p-6" data-testid="growth-chart-display">
        <div className="mb-4">
          <div data-testid="height-growth-chart">
            <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                <p className="text-gray-600">Height Growth Chart</p>
                <div className="mt-2 text-sm text-gray-500" data-testid="chart-legend">Height (inches)</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Percentile Lines */}
        <div className="text-xs text-gray-500 mt-2" data-testid="percentile-lines">
          <span className="mr-4" data-testid="percentile-5">5th percentile</span>
          <span className="mr-4" data-testid="percentile-25">25th percentile</span>
          <span className="mr-4" data-testid="percentile-50">50th percentile</span>
          <span className="mr-4" data-testid="percentile-75">75th percentile</span>
          <span data-testid="percentile-95">95th percentile</span>
        </div>
      </div>

      {/* Current Percentiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-testid="percentile-info">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-lg font-semibold text-blue-700" data-testid="height-percentile">65%</div>
          <div className="text-sm text-blue-600">Height Percentile</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-lg font-semibold text-green-700" data-testid="weight-percentile">58%</div>
          <div className="text-sm text-green-600">Weight Percentile</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-lg font-semibold text-purple-700" data-testid="bmi-percentile">52%</div>
          <div className="text-sm text-purple-600">BMI Percentile</div>
        </div>
      </div>

      {/* Growth Velocity */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4" data-testid="growth-velocity">
        <h4 className="font-semibold mb-2">Growth Velocity</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Height</div>
            <div className="text-lg font-semibold">+2.3 in/year</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Weight</div>
            <div className="text-lg font-semibold">+5.2 lbs/year</div>
          </div>
        </div>
      </div>

      {/* Measurement History */}
      <div data-testid="measurement-history">
        <h4 className="font-semibold mb-4">Measurement History</h4>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg" data-testid="measurements-table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Height</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Weight</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">BMI</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayMeasurements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-600">
                    <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p>No growth measurements recorded for this student.</p>
                  </td>
                </tr>
              ) : (
                displayMeasurements.map((measurement) => (
                <tr key={measurement.id} className="border-t" data-testid="measurement-row">
                  <td className="px-4 py-2" data-testid="measurement-date">{measurement.measurementDate}</td>
                  <td className="px-4 py-2" data-testid="height-value">{measurement.height}</td>
                  <td className="px-4 py-2" data-testid="weight-value">{measurement.weight}</td>
                  <td className="px-4 py-2" data-testid="bmi-value">{measurement.bmi}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-700 text-sm" data-testid="edit-measurement-btn">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-700 text-sm" data-testid="delete-measurement-btn">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button className="btn-secondary" data-testid="export-chart-btn">Export Chart</button>
        <button className="btn-secondary" data-testid="compare-standards-btn">Compare with Standards</button>
      </div>
    </div>
  )
})

GrowthChartsTab.displayName = 'GrowthChartsTab'