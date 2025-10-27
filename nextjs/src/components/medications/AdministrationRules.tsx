'use client';

/**
 * AdministrationRules Component
 */

import React from 'react';

export interface MedicationRule {
  id: string;
  medicationName: string;
  ruleType: 'timing' | 'food' | 'interaction' | 'contraindication' | 'special';
  description: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface AdministrationRulesProps {
  rules: MedicationRule[];
  medicationName?: string;
}

export const AdministrationRules: React.FC<AdministrationRulesProps> = ({ rules, medicationName }) => {
  const getSeverityColor = (severity: MedicationRule['severity']) => {
    const colors = {
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      critical: 'bg-red-50 border-red-200 text-red-800',
    };
    return colors[severity];
  };

  const getSeverityIcon = (severity: MedicationRule['severity']) => {
    const icons = {
      info: 'ℹ️',
      warning: '⚠️',
      critical: '🛑',
    };
    return icons[severity];
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Administration Rules</h3>
        {medicationName && <p className="text-sm text-gray-600 mt-1">{medicationName}</p>}
      </div>

      {rules.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-600">No specific administration rules defined</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <div key={rule.id} className={`border rounded-lg p-4 ${getSeverityColor(rule.severity)}`}>
              <div className="flex items-start gap-3">
                <span className="text-xl">{getSeverityIcon(rule.severity)}</span>
                <div>
                  <div className="font-medium mb-1">{rule.ruleType.toUpperCase()}</div>
                  <p className="text-sm">{rule.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

AdministrationRules.displayName = 'AdministrationRules';

export default AdministrationRules;
