'use client';

/**
 * Drug Interaction Checker Component
 * Check for potential drug interactions
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/input';

export interface DrugInteraction {
  id: string;
  drug1: string;
  drug2: string;
  severity: 'minor' | 'moderate' | 'major' | 'contraindicated';
  description: string;
  clinicalEffects?: string;
  management?: string;
}

export interface DrugInteractionCheckerProps {
  currentMedications: string[];
  onCheckInteractions?: (medications: string[]) => Promise<DrugInteraction[]>;
}

export const DrugInteractionChecker: React.FC<DrugInteractionCheckerProps> = ({
  currentMedications,
  onCheckInteractions,
}) => {
  const [interactions, setInteractions] = useState<DrugInteraction[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [newMedication, setNewMedication] = useState('');

  const handleCheck = async () => {
    if (!onCheckInteractions) return;

    setIsChecking(true);
    try {
      const results = await onCheckInteractions(currentMedications);
      setInteractions(results);
    } catch (error) {
      console.error('Error checking interactions:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const getSeverityColor = (severity: DrugInteraction['severity']) => {
    const colors = {
      minor: 'bg-blue-50 border-blue-200 text-blue-800',
      moderate: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      major: 'bg-orange-50 border-orange-200 text-orange-800',
      contraindicated: 'bg-red-50 border-red-200 text-red-800',
    };
    return colors[severity];
  };

  const getSeverityIcon = (severity: DrugInteraction['severity']) => {
    switch (severity) {
      case 'contraindicated':
        return '⛔';
      case 'major':
        return '⚠️';
      case 'moderate':
        return '⚡';
      case 'minor':
        return 'ℹ️';
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Medications */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Medications</h3>
        {currentMedications.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-4">
            {currentMedications.map((med, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {med}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 mb-4">No medications on file</p>
        )}

        <Button variant="default" onClick={handleCheck} loading={isChecking} disabled={currentMedications.length < 2}>
          Check for Interactions
        </Button>
      </div>

      {/* Interaction Results */}
      {interactions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Potential Interactions Found: {interactions.length}
          </h3>

          {interactions.map((interaction) => (
            <div
              key={interaction.id}
              className={`border rounded-lg p-6 ${getSeverityColor(interaction.severity)}`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{getSeverityIcon(interaction.severity)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">
                      {interaction.drug1} + {interaction.drug2}
                    </h4>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white bg-opacity-50">
                      {interaction.severity.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-sm mb-3">{interaction.description}</p>

                  {interaction.clinicalEffects && (
                    <div className="mb-3">
                      <h5 className="text-sm font-medium mb-1">Clinical Effects:</h5>
                      <p className="text-sm">{interaction.clinicalEffects}</p>
                    </div>
                  )}

                  {interaction.management && (
                    <div className="bg-white bg-opacity-50 rounded p-3">
                      <h5 className="text-sm font-medium mb-1">Management:</h5>
                      <p className="text-sm">{interaction.management}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {interactions.length === 0 && !isChecking && currentMedications.length >= 2 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-2xl mb-2">✅</div>
          <p className="text-green-800 font-medium">No known drug interactions found</p>
          <p className="text-sm text-green-700 mt-1">
            The current medications do not have any documented interactions
          </p>
        </div>
      )}
    </div>
  );
};

DrugInteractionChecker.displayName = 'DrugInteractionChecker';

export default DrugInteractionChecker;



