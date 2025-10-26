/**
 * Custom Report Builder Component
 * Drag-and-drop interface for building custom reports
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  customReportConfigSchema,
  type CustomReportConfig,
  type ChartType,
  type TimeGranularity,
} from '@/lib/validations/report.schemas';
import { Plus, X, Save, Eye } from 'lucide-react';

interface CustomReportBuilderProps {
  initialConfig?: Partial<CustomReportConfig>;
  onSave: (config: CustomReportConfig) => Promise<void>;
  onPreview?: (config: CustomReportConfig) => void;
}

export function CustomReportBuilder({
  initialConfig,
  onSave,
  onPreview,
}: CustomReportBuilderProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CustomReportConfig>({
    resolver: zodResolver(customReportConfigSchema),
    defaultValues: initialConfig || {
      name: '',
      reportType: 'custom',
      filters: {
        dateRange: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: new Date(),
        },
      },
      metrics: [],
      chartType: 'bar',
      isPublic: false,
    },
  });

  const metrics = watch('metrics') || [];
  const chartType = watch('chartType');

  const handleAddMetric = () => {
    setValue('metrics', [
      ...metrics,
      { field: '', aggregation: 'count', label: '' },
    ]);
  };

  const handleRemoveMetric = (index: number) => {
    setValue(
      'metrics',
      metrics.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data: CustomReportConfig) => {
    setIsSubmitting(true);
    try {
      await onSave(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    const data = watch();
    if (onPreview) {
      onPreview(data as CustomReportConfig);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Name *
            </label>
            <input
              {...register('name')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="My Custom Report"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of this report..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Type *
              </label>
              <select
                {...register('reportType')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="custom">Custom</option>
                <option value="health-metrics">Health Metrics</option>
                <option value="medication-compliance">Medication Compliance</option>
                <option value="appointment-analytics">Appointment Analytics</option>
                <option value="incident-trends">Incident Trends</option>
                <option value="inventory-analytics">Inventory Analytics</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chart Type *
              </label>
              <select
                {...register('chartType')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="area">Area Chart</option>
                <option value="pie">Pie Chart</option>
                <option value="scatter">Scatter Plot</option>
                <option value="radar">Radar Chart</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Date Range */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Date Range</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <input
              {...register('filters.dateRange.start', { valueAsDate: true })}
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date *
            </label>
            <input
              {...register('filters.dateRange.end', { valueAsDate: true })}
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time Granularity
          </label>
          <select
            {...register('timeGranularity')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Auto</option>
            <option value="hour">Hourly</option>
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="quarter">Quarterly</option>
            <option value="year">Yearly</option>
          </select>
        </div>
      </div>

      {/* Metrics */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Metrics</h3>
          <button
            type="button"
            onClick={handleAddMetric}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Metric
          </button>
        </div>

        <div className="space-y-3">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Field
                  </label>
                  <input
                    {...register(`metrics.${index}.field`)}
                    type="text"
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
                    placeholder="e.g., studentCount"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Aggregation
                  </label>
                  <select
                    {...register(`metrics.${index}.aggregation`)}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
                  >
                    <option value="count">Count</option>
                    <option value="sum">Sum</option>
                    <option value="avg">Average</option>
                    <option value="min">Minimum</option>
                    <option value="max">Maximum</option>
                    <option value="median">Median</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Label
                  </label>
                  <input
                    {...register(`metrics.${index}.label`)}
                    type="text"
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
                    placeholder="Display name"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveMetric(index)}
                className="mt-6 p-1.5 text-red-600 hover:bg-red-50 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          {metrics.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              No metrics added yet. Click "Add Metric" to get started.
            </div>
          )}
        </div>
      </div>

      {/* Options */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Options</h3>

        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              {...register('isPublic')}
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              Make this report public
            </span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handlePreview}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Eye className="h-4 w-4" />
          Preview
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? 'Saving...' : 'Save Report'}
        </button>
      </div>
    </form>
  );
}
