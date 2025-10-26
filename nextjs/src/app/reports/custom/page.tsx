/**
 * Custom Report Builder Page
 *
 * Drag-and-drop interface for building custom reports with:
 * - Data source selection
 * - Field/column picker
 * - Filter builder
 * - Chart configuration
 * - Report preview
 * - Save as template
 *
 * @module app/reports/custom/page
 */

'use client';

import React, { useState } from 'react';
import type {
  ReportDefinition,
  ReportColumn,
  ReportFilter,
  ChartConfig,
  DataSource
} from '@/types/schemas/reports.schema';

// ============================================================================
// TYPES
// ============================================================================

interface BuilderState {
  step: 'source' | 'fields' | 'filters' | 'charts' | 'preview';
  definition: Partial<ReportDefinition>;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function CustomReportBuilderPage() {
  const [builderState, setBuilderState] = useState<BuilderState>({
    step: 'source',
    definition: {
      name: 'Untitled Report',
      columns: [],
      filters: [],
      charts: []
    }
  });

  const [selectedDataSource, setSelectedDataSource] = useState<string>('');
  const [availableFields, setAvailableFields] = useState<string[]>([]);

  // Sample data sources
  const dataSources = [
    { id: 'students', name: 'Students', description: 'Student demographic and enrollment data' },
    { id: 'health', name: 'Health Records', description: 'Health visits, conditions, and screenings' },
    { id: 'medications', name: 'Medications', description: 'Medication administration records' },
    { id: 'incidents', name: 'Incidents', description: 'Incident reports and safety data' },
    { id: 'appointments', name: 'Appointments', description: 'Appointment scheduling and attendance' }
  ];

  // Handle data source selection
  const handleDataSourceSelect = (sourceId: string) => {
    setSelectedDataSource(sourceId);

    // Load available fields for this data source
    // This would come from the API in production
    const fieldsBySource: Record<string, string[]> = {
      students: ['firstName', 'lastName', 'grade', 'school', 'enrollmentDate'],
      health: ['visitDate', 'chiefComplaint', 'diagnosis', 'treatment'],
      medications: ['medicationName', 'dose', 'administeredAt', 'administeredBy'],
      incidents: ['incidentDate', 'type', 'severity', 'location', 'description'],
      appointments: ['appointmentDate', 'appointmentType', 'status', 'provider']
    };

    setAvailableFields(fieldsBySource[sourceId] || []);
  };

  // Navigation between steps
  const goToStep = (step: BuilderState['step']) => {
    setBuilderState((prev) => ({ ...prev, step }));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Steps */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Report Builder</h2>
          <p className="text-sm text-gray-600 mt-1">Create custom reports</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'source', label: 'Data Source', icon: '📊' },
            { id: 'fields', label: 'Select Fields', icon: '📋' },
            { id: 'filters', label: 'Add Filters', icon: '🔍' },
            { id: 'charts', label: 'Add Charts', icon: '📈' },
            { id: 'preview', label: 'Preview & Save', icon: '👁️' }
          ].map((step) => (
            <button
              key={step.id}
              onClick={() => goToStep(step.id as BuilderState['step'])}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                builderState.step === step.id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">{step.icon}</span>
              <span>{step.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Save Report
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Step 1: Data Source Selection */}
          {builderState.step === 'source' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Select Data Source</h1>
                <p className="text-gray-600 mt-1">
                  Choose the primary data source for your report
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {dataSources.map((source) => (
                  <button
                    key={source.id}
                    onClick={() => handleDataSourceSelect(source.id)}
                    className={`p-6 border-2 rounded-lg text-left transition-all ${
                      selectedDataSource === source.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="text-lg font-semibold text-gray-900">
                      {source.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {source.description}
                    </p>
                  </button>
                ))}
              </div>

              {selectedDataSource && (
                <div className="flex justify-end">
                  <button
                    onClick={() => goToStep('fields')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Continue to Fields →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Field Selection */}
          {builderState.step === 'fields' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Select Fields</h1>
                <p className="text-gray-600 mt-1">
                  Choose which fields to include in your report
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Available Fields */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Available Fields</h3>
                  <div className="space-y-2">
                    {availableFields.map((field) => (
                      <div
                        key={field}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <span className="text-sm text-gray-700">{field}</span>
                        <button className="text-blue-600 hover:text-blue-700">
                          Add →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Fields */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Selected Fields</h3>
                  <div className="space-y-2">
                    {builderState.definition.columns?.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-8">
                        No fields selected yet
                      </p>
                    ) : (
                      builderState.definition.columns?.map((column, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                        >
                          <span className="text-sm text-gray-900">{column.field}</span>
                          <button className="text-red-600 hover:text-red-700">
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => goToStep('source')}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  ← Back
                </button>
                <button
                  onClick={() => goToStep('filters')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Continue to Filters →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Filter Builder */}
          {builderState.step === 'filters' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Add Filters</h1>
                <p className="text-gray-600 mt-1">
                  Define criteria to filter your report data
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Field
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="">Select field...</option>
                        {availableFields.map((field) => (
                          <option key={field} value={field}>{field}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Operator
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="eq">Equals</option>
                        <option value="ne">Not Equals</option>
                        <option value="gt">Greater Than</option>
                        <option value="lt">Less Than</option>
                        <option value="contains">Contains</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Value
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Enter value..."
                      />
                    </div>
                  </div>

                  <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                    + Add Filter
                  </button>
                </div>

                {/* Active Filters */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Active Filters</h4>
                  {builderState.definition.filters?.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No filters added yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {builderState.definition.filters?.map((filter, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="text-sm text-gray-700">
                            {filter.field} {filter.operator} {filter.value}
                          </span>
                          <button className="text-red-600 hover:text-red-700">
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => goToStep('fields')}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  ← Back
                </button>
                <button
                  onClick={() => goToStep('charts')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Continue to Charts →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Chart Configuration */}
          {builderState.step === 'charts' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Add Charts</h1>
                <p className="text-gray-600 mt-1">
                  Visualize your data with charts
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { type: 'line', icon: '📈', label: 'Line Chart' },
                  { type: 'bar', icon: '📊', label: 'Bar Chart' },
                  { type: 'pie', icon: '🥧', label: 'Pie Chart' },
                  { type: 'area', icon: '📉', label: 'Area Chart' },
                  { type: 'stacked-bar', icon: '📊', label: 'Stacked Bar' },
                  { type: 'heat-map', icon: '🔥', label: 'Heat Map' }
                ].map((chart) => (
                  <button
                    key={chart.type}
                    className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <div className="text-4xl mb-2">{chart.icon}</div>
                    <div className="font-medium text-gray-900">{chart.label}</div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => goToStep('filters')}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  ← Back
                </button>
                <button
                  onClick={() => goToStep('preview')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Preview Report →
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Preview & Save */}
          {builderState.step === 'preview' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Preview & Save</h1>
                <p className="text-gray-600 mt-1">
                  Review your report configuration and save
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Report Details</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Report Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={builderState.definition.name}
                      onChange={(e) =>
                        setBuilderState((prev) => ({
                          ...prev,
                          definition: { ...prev.definition, name: e.target.value }
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows={3}
                      placeholder="Describe your report..."
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="saveTemplate" />
                    <label htmlFor="saveTemplate" className="text-sm text-gray-700">
                      Save as template for reuse
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => goToStep('charts')}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  ← Back
                </button>
                <div className="flex gap-2">
                  <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Save as Draft
                  </button>
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
