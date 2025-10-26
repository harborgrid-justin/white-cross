'use client';

/**
 * Analytics Dashboard Component
 * Main dashboard with customizable widgets
 */

'use client';

import { useState } from 'react';
import { Plus, Settings, Download, RefreshCw } from 'lucide-react';
import type { DashboardWidget, DashboardConfig } from '@/lib/validations/report.schemas';

interface AnalyticsDashboardProps {
  config?: DashboardConfig;
  onConfigChange?: (config: DashboardConfig) => void;
  widgets: DashboardWidget[];
}

export function AnalyticsDashboard({
  config,
  onConfigChange,
  widgets,
}: AnalyticsDashboardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>(
    widgets.map((w) => w.id)
  );

  const handleToggleWidget = (widgetId: string) => {
    setSelectedWidgets((prev) =>
      prev.includes(widgetId)
        ? prev.filter((id) => id !== widgetId)
        : [...prev, widgetId]
    );
  };

  const handleRefresh = () => {
    // Trigger refresh of all widgets
    window.location.reload();
  };

  const handleExport = () => {
    // Export dashboard configuration
    if (config) {
      const json = JSON.stringify(config, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dashboard-${config.name}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {config?.name || 'Analytics Dashboard'}
          </h1>
          {config?.description && (
            <p className="mt-1 text-sm text-gray-500">{config.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>

          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Settings className="h-4 w-4" />
            {isEditing ? 'Done' : 'Customize'}
          </button>

          <button className="inline-flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Add Widget
          </button>
        </div>
      </div>

      {/* Widget Selector (when editing) */}
      {isEditing && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Select Widgets</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {widgets.map((widget) => (
              <label
                key={widget.id}
                className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selectedWidgets.includes(widget.id)}
                  onChange={() => handleToggleWidget(widget.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">{widget.title}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Widget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets
          .filter((widget) => selectedWidgets.includes(widget.id))
          .map((widget) => (
            <div
              key={widget.id}
              className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
              style={{
                gridColumn: `span ${Math.min(widget.position.w, 3)}`,
                minHeight: `${widget.position.h * 100}px`,
              }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{widget.title}</h3>
              {/* Widget content will be rendered here based on type */}
              <div className="text-sm text-gray-500">
                Widget type: {widget.type}
              </div>
            </div>
          ))}
      </div>

      {/* Empty State */}
      {selectedWidgets.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-gray-400 mb-4">
            <Settings className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No widgets selected</h3>
          <p className="text-sm text-gray-500 mb-4">
            Click "Customize" to select widgets to display on your dashboard
          </p>
        </div>
      )}
    </div>
  );
}
