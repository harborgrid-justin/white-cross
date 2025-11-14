'use client';

import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import type { ReportSchedule, ScheduleFrequency } from '../types';

/**
 * Props for the CreateScheduleModal component
 */
interface CreateScheduleModalProps {
  /** Whether the modal is visible */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Callback when schedule is created */
  onCreate: (schedule: Omit<ReportSchedule, 'id' | 'createdAt' | 'updatedAt' | 'executionCount' | 'successCount' | 'failureCount'>) => void;
}

/**
 * CreateScheduleModal Component
 *
 * Modal dialog for creating a new report schedule. Provides form inputs
 * for schedule name, description, frequency, time, and timezone.
 *
 * @param props - CreateScheduleModal component props
 * @returns JSX element representing the create schedule modal
 */
export const CreateScheduleModal: React.FC<CreateScheduleModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  // Form state
  const [formData, setFormData] = useState<Partial<ReportSchedule>>({
    name: '',
    description: '',
    status: 'pending',
    config: {
      frequency: 'daily',
      time: '09:00',
      timezone: 'America/New_York'
    },
    recipients: [],
    format: 'pdf',
    includeCharts: true,
    tags: [],
    reportId: '',
    reportName: '',
    reportCategory: '',
    createdBy: ''
  });

  /**
   * Handles form submission
   */
  const handleSubmit = () => {
    if (formData.name && formData.config && onCreate) {
      onCreate(formData as Omit<ReportSchedule, 'id' | 'createdAt' | 'updatedAt' | 'executionCount' | 'successCount' | 'failureCount'>);

      // Reset form
      setFormData({
        name: '',
        description: '',
        status: 'pending',
        config: {
          frequency: 'daily',
          time: '09:00',
          timezone: 'America/New_York'
        },
        recipients: [],
        format: 'pdf',
        includeCharts: true,
        tags: [],
        reportId: '',
        reportName: '',
        reportCategory: '',
        createdBy: ''
      });

      onClose();
    }
  };

  /**
   * Updates a specific field in the form data
   */
  const updateField = (field: keyof ReportSchedule, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Updates a specific config field
   */
  const updateConfigField = (field: keyof ReportSchedule['config'], value: string | ScheduleFrequency) => {
    setFormData(prev => ({
      ...prev,
      config: { ...prev.config!, [field]: value }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Create New Schedule</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Schedule Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule Name *
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md
                       focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter schedule name"
              aria-label="Schedule name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md
                       focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe this schedule"
              aria-label="Schedule description"
            />
          </div>

          {/* Frequency and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency
              </label>
              <select
                value={formData.config?.frequency || 'daily'}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  updateConfigField('frequency', e.target.value as ScheduleFrequency)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md
                         focus:ring-blue-500 focus:border-blue-500"
                aria-label="Schedule frequency"
              >
                <option value="once">One Time</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="time"
                value={formData.config?.time || '09:00'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateConfigField('time', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md
                         focus:ring-blue-500 focus:border-blue-500"
                aria-label="Schedule time"
              />
            </div>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              value={formData.config?.timezone || 'America/New_York'}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                updateConfigField('timezone', e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md
                       focus:ring-blue-500 focus:border-blue-500"
              aria-label="Timezone"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>

          {/* Report Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Format
            </label>
            <select
              value={formData.format || 'pdf'}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                updateField('format', e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md
                       focus:ring-blue-500 focus:border-blue-500"
              aria-label="Report format"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>

          {/* Include Charts */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeCharts"
              checked={formData.includeCharts || false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData(prev => ({ ...prev, includeCharts: e.target.checked }))
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="includeCharts" className="ml-2 block text-sm text-gray-900">
              Include charts in report
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border
                     border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.name}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600
                     border border-transparent rounded-md hover:bg-blue-700
                     disabled:opacity-50 disabled:cursor-not-allowed
                     inline-flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Create Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateScheduleModal;
