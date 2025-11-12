'use client';

import React from 'react';
import type { ReportParameter } from '../types';

interface ParameterPanelProps {
  isOpen: boolean;
  parameters: ReportParameter[];
  parameterValues: Record<string, unknown>;
  onParameterChange: (parameterId: string, value: unknown) => void;
  onExecute: () => void;
  onClose: () => void;
}

/**
 * ParameterPanel Component
 *
 * Modal panel for configuring parameters before running a report.
 */
const ParameterPanel: React.FC<ParameterPanelProps> = ({
  isOpen,
  parameters,
  parameterValues,
  onParameterChange,
  onExecute,
  onClose
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Configure Parameters</h3>
          <p className="text-sm text-gray-600 mt-1">Set parameter values before running the report</p>
        </div>

        <div className="p-6 space-y-4">
          {parameters.map((param) => (
            <div key={param.id} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {param.label}
                {param.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {param.type === 'string' && (
                <input
                  type="text"
                  value={(parameterValues[param.id] as string) || (param.defaultValue as string) || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onParameterChange(param.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md
                           focus:ring-blue-500 focus:border-blue-500"
                  placeholder={param.description}
                />
              )}

              {param.type === 'number' && (
                <input
                  type="number"
                  value={(parameterValues[param.id] as number) || (param.defaultValue as number) || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onParameterChange(param.id, parseFloat(e.target.value))}
                  min={param.validation?.min}
                  max={param.validation?.max}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md
                           focus:ring-blue-500 focus:border-blue-500"
                  placeholder={param.description}
                  title={param.description || param.label}
                  aria-label={param.label}
                />
              )}

              {param.type === 'date' && (
                <input
                  type="date"
                  value={(parameterValues[param.id] as string) || (param.defaultValue as string) || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onParameterChange(param.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md
                           focus:ring-blue-500 focus:border-blue-500"
                  title={param.description || param.label}
                  aria-label={param.label}
                />
              )}

              {param.type === 'boolean' && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(parameterValues[param.id] as boolean) || (param.defaultValue as boolean) || false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onParameterChange(param.id, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">{param.description}</span>
                </label>
              )}

              {param.type === 'select' && param.options && (
                <select
                  value={(parameterValues[param.id] as string) || (param.defaultValue as string) || ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onParameterChange(param.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md
                           focus:ring-blue-500 focus:border-blue-500"
                  title={param.description || param.label}
                  aria-label={param.label}
                >
                  <option value="">Select an option</option>
                  {param.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {param.description && (
                <p className="text-xs text-gray-500">{param.description}</p>
              )}
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300
                     rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onExecute}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent
                     rounded-md hover:bg-blue-700"
          >
            Run Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParameterPanel;
