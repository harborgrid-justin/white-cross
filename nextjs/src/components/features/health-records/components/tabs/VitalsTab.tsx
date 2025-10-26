/**
 * WF-COMP-036 | VitalsTab.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: lucide-react, @/hooks/useHealthRecords
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: useState, useMemo, functional component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * VitalsTab Component
 *
 * Enterprise-grade vitals tracking component with:
 * - Vital signs history table
 * - Latest vitals display
 * - Trend visualization
 * - Quick vital entry form
 * - Normal range indicators
 * - Alert for abnormal values
 * - HIPAA-compliant data display
 * - Accessibility features
 */

import React, { useState, useMemo } from 'react'
import { Plus, Activity, Heart, Thermometer, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { useRecentVitals, useRecordVitals } from '../../../../../hooks/domains/health'
import type { User } from '../../../../../types'

interface VitalsTabProps {
  studentId: string
  user?: User | null
}

interface VitalEntry {
  timestamp: string
  temperature?: number
  bloodPressureSystolic?: number
  bloodPressureDiastolic?: number
  heartRate?: number
  respiratoryRate?: number
  oxygenSaturation?: number
  weight?: number
  height?: number
  notes?: string
}

// Normal ranges for vitals (school-age children)
const NORMAL_RANGES = {
  temperature: { min: 97.0, max: 99.5, unit: '°F' },
  heartRate: { min: 70, max: 120, unit: 'bpm' },
  bloodPressureSystolic: { min: 90, max: 120, unit: 'mmHg' },
  bloodPressureDiastolic: { min: 60, max: 80, unit: 'mmHg' },
  respiratoryRate: { min: 12, max: 20, unit: 'breaths/min' },
  oxygenSaturation: { min: 95, max: 100, unit: '%' },
}

export const VitalsTab: React.FC<VitalsTabProps> = ({ studentId, user }) => {
  const canModify = user?.role !== 'READ_ONLY'

  // API hooks
  const { data: vitalsData, isLoading, refetch } = useRecentVitals(studentId, { limit: 20 })
  const recordVitalsMutation = useRecordVitals()

  // State
  const [showEntryForm, setShowEntryForm] = useState(false)
  const [formData, setFormData] = useState<VitalEntry>({
    timestamp: new Date().toISOString().slice(0, 16),
  })

  // Latest vitals
  const latestVitals = useMemo(() => {
    if (!vitalsData || vitalsData.length === 0) return null
    return vitalsData[0]
  }, [vitalsData])

  // Check if vital is within normal range
  const isNormal = (value: number | undefined, type: keyof typeof NORMAL_RANGES): boolean => {
    if (!value) return true
    const range = NORMAL_RANGES[type]
    return value >= range.min && value <= range.max
  }

  // Get status indicator
  const getStatusColor = (value: number | undefined, type: keyof typeof NORMAL_RANGES): string => {
    if (!value) return 'text-gray-400'
    return isNormal(value, type) ? 'text-green-600' : 'text-red-600'
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await recordVitalsMutation.mutateAsync({
        studentId,
        vitals: {
          measurementDate: formData.timestamp,
          temperature: formData.temperature,
          bloodPressureSystolic: formData.bloodPressureSystolic,
          bloodPressureDiastolic: formData.bloodPressureDiastolic,
          heartRate: formData.heartRate,
          respiratoryRate: formData.respiratoryRate,
          oxygenSaturation: formData.oxygenSaturation,
          notes: formData.notes,
        },
      })

      // Reset form
      setFormData({ timestamp: new Date().toISOString().slice(0, 16) })
      setShowEntryForm(false)
      refetch()
    } catch (error) {
      console.error('Failed to record vitals:', error)
    }
  }

  return (
    <div className="space-y-6" data-testid="vitals-content">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Vital Signs</h3>
        <button
          className="btn-primary flex items-center"
          data-testid="record-vitals-button"
          onClick={() => setShowEntryForm(!showEntryForm)}
          disabled={!canModify}
        >
          <Plus className="h-4 w-4 mr-2" />
          {showEntryForm ? 'Cancel' : 'Record Vitals'}
        </button>
      </div>

      {/* Quick Entry Form */}
      {showEntryForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6" data-testid="vitals-entry-form">
          <h4 className="text-lg font-semibold mb-4">Record New Vital Signs</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.timestamp}
                  onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature (°F)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.temperature || ''}
                  onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="98.6"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  value={formData.heartRate || ''}
                  onChange={(e) => setFormData({ ...formData, heartRate: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="80"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  BP Systolic (mmHg)
                </label>
                <input
                  type="number"
                  value={formData.bloodPressureSystolic || ''}
                  onChange={(e) => setFormData({ ...formData, bloodPressureSystolic: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="110"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  BP Diastolic (mmHg)
                </label>
                <input
                  type="number"
                  value={formData.bloodPressureDiastolic || ''}
                  onChange={(e) => setFormData({ ...formData, bloodPressureDiastolic: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="70"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Respiratory Rate (breaths/min)
                </label>
                <input
                  type="number"
                  value={formData.respiratoryRate || ''}
                  onChange={(e) => setFormData({ ...formData, respiratoryRate: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="16"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  O2 Saturation (%)
                </label>
                <input
                  type="number"
                  value={formData.oxygenSaturation || ''}
                  onChange={(e) => setFormData({ ...formData, oxygenSaturation: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="98"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight || ''}
                  onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="100.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (inches)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.height || ''}
                  onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="60.0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Additional observations or notes..."
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="btn-primary"
                disabled={recordVitalsMutation.isPending}
              >
                {recordVitalsMutation.isPending ? 'Saving...' : 'Save Vitals'}
              </button>
              <button
                type="button"
                onClick={() => setShowEntryForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Latest Vitals Display */}
      {latestVitals && (
        <div className="bg-white border border-gray-200 rounded-lg p-6" data-testid="latest-vitals">
          <h4 className="text-lg font-semibold mb-4">Latest Vital Signs</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {latestVitals.temperature && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Thermometer className={`h-5 w-5 ${getStatusColor(latestVitals.temperature, 'temperature')}`} />
                  {!isNormal(latestVitals.temperature, 'temperature') && (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="text-2xl font-bold">{latestVitals.temperature}°F</div>
                <div className="text-sm text-gray-600">Temperature</div>
                <div className="text-xs text-gray-500 mt-1">
                  Normal: {NORMAL_RANGES.temperature.min}-{NORMAL_RANGES.temperature.max}°F
                </div>
              </div>
            )}

            {latestVitals.heartRate && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Heart className={`h-5 w-5 ${getStatusColor(latestVitals.heartRate, 'heartRate')}`} />
                  {!isNormal(latestVitals.heartRate, 'heartRate') && (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="text-2xl font-bold">{latestVitals.heartRate}</div>
                <div className="text-sm text-gray-600">Heart Rate (bpm)</div>
                <div className="text-xs text-gray-500 mt-1">
                  Normal: {NORMAL_RANGES.heartRate.min}-{NORMAL_RANGES.heartRate.max} bpm
                </div>
              </div>
            )}

            {(latestVitals.bloodPressureSystolic || latestVitals.bloodPressureDiastolic) && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold">
                  {latestVitals.bloodPressureSystolic}/{latestVitals.bloodPressureDiastolic}
                </div>
                <div className="text-sm text-gray-600">Blood Pressure</div>
                <div className="text-xs text-gray-500 mt-1">
                  Normal: {NORMAL_RANGES.bloodPressureSystolic.min}/{NORMAL_RANGES.bloodPressureDiastolic.min} -
                  {NORMAL_RANGES.bloodPressureSystolic.max}/{NORMAL_RANGES.bloodPressureDiastolic.max}
                </div>
              </div>
            )}

            {latestVitals.oxygenSaturation && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Activity className={`h-5 w-5 ${getStatusColor(latestVitals.oxygenSaturation, 'oxygenSaturation')}`} />
                  {!isNormal(latestVitals.oxygenSaturation, 'oxygenSaturation') && (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="text-2xl font-bold">{latestVitals.oxygenSaturation}%</div>
                <div className="text-sm text-gray-600">O2 Saturation</div>
                <div className="text-xs text-gray-500 mt-1">
                  Normal: {NORMAL_RANGES.oxygenSaturation.min}-{NORMAL_RANGES.oxygenSaturation.max}%
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Recorded: {new Date(latestVitals.recordDate).toLocaleString()}
          </div>
        </div>
      )}

      {/* Vitals History Table */}
      <div data-testid="vitals-history">
        <h4 className="text-lg font-semibold mb-4">Vital Signs History</h4>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : !vitalsData || vitalsData.length === 0 ? (
          <div className="text-center py-8 text-gray-600" data-testid="no-vitals-message">
            <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p>No vital signs recorded for this student.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg" data-testid="vitals-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date & Time</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Temp (°F)</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">BP</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">HR (bpm)</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">RR</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">O2 (%)</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Weight (lbs)</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Height (in)</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Notes</th>
                </tr>
              </thead>
              <tbody>
                {vitalsData.map((vital, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50" data-testid="vital-row">
                    <td className="px-4 py-2 text-sm">
                      {new Date(vital.measurementDate).toLocaleString()}
                    </td>
                    <td className={`px-4 py-2 text-sm ${vital.temperature ? getStatusColor(vital.temperature, 'temperature') : ''}`}>
                      {vital.temperature || '-'}
                      {vital.temperature && !isNormal(vital.temperature, 'temperature') && (
                        <AlertTriangle className="inline h-3 w-3 ml-1" />
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {vital.bloodPressureSystolic && vital.bloodPressureDiastolic 
                        ? `${vital.bloodPressureSystolic}/${vital.bloodPressureDiastolic}` 
                        : '-'}
                    </td>
                    <td className={`px-4 py-2 text-sm ${vital.heartRate ? getStatusColor(vital.heartRate, 'heartRate') : ''}`}>
                      {vital.heartRate || '-'}
                      {vital.heartRate && !isNormal(vital.heartRate, 'heartRate') && (
                        <AlertTriangle className="inline h-3 w-3 ml-1" />
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm">{vital.respiratoryRate || '-'}</td>
                    <td className={`px-4 py-2 text-sm ${vital.oxygenSaturation ? getStatusColor(vital.oxygenSaturation, 'oxygenSaturation') : ''}`}>
                      {vital.oxygenSaturation || '-'}
                      {vital.oxygenSaturation && !isNormal(vital.oxygenSaturation, 'oxygenSaturation') && (
                        <AlertTriangle className="inline h-3 w-3 ml-1" />
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm">{vital.weight || '-'}</td>
                    <td className="px-4 py-2 text-sm">{vital.height || '-'}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{vital.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Trend Indicators */}
      {vitalsData && vitalsData.length >= 2 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" data-testid="vital-trends">
          <h4 className="font-semibold mb-2">Recent Trends</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vitalsData[0].temperature && vitalsData[1].temperature && (
              <div className="flex items-center gap-2">
                <span className="text-sm">Temperature:</span>
                {vitalsData[0].temperature > vitalsData[1].temperature ? (
                  <TrendingUp className="h-4 w-4 text-red-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-600" />
                )}
              </div>
            )}
            {vitalsData[0].heartRate && vitalsData[1].heartRate && (
              <div className="flex items-center gap-2">
                <span className="text-sm">Heart Rate:</span>
                {vitalsData[0].heartRate > vitalsData[1].heartRate ? (
                  <TrendingUp className="h-4 w-4 text-red-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-600" />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
