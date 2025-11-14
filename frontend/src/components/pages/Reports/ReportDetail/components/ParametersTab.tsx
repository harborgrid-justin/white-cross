'use client';

import React from 'react';
import type { ReportParameter } from '../types';

interface ParametersTabProps {
  parameters: ReportParameter[];
  parameterValues: Record<string, unknown>;
  onParameterChange: (parameterId: string, value: unknown) => void;
}

/**
 * ParametersTab Component
 *
 * Displays and manages report parameters with various input types.
 */
const ParametersTab: React.FC<ParametersTabProps> = ({
  parameters,
  parameterValues,
  onParameterChange
}) => {
  if (parameters.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Report Parameters</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  );
};

export default ParametersTab;
