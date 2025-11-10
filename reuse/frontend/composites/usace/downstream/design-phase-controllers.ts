/**
 * LOC: USACE-DOWNSTREAM-DPC-001
 * File: /reuse/frontend/composites/usace/downstream/design-phase-controllers.ts
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  useDesignPhaseManagement,
  useDesignSubmittalTracking,
  type DesignPhase,
  type DesignSubmittalStatus,
} from '../usace-engineering-design-composites';

export function DesignPhaseController({
  projectId,
  onPhaseComplete,
}: {
  projectId: string;
  onPhaseComplete?: (phase: DesignPhase) => void;
}) {
  const {
    currentPhase,
    phaseHistory,
    advancePhase,
    getPhaseRequirements,
  } = useDesignPhaseManagement(projectId);

  const {
    submittals,
    submitDesign,
    updateSubmittalStatus,
  } = useDesignSubmittalTracking(projectId);

  const requirements = useMemo(() => getPhaseRequirements(currentPhase), [currentPhase, getPhaseRequirements]);

  const phaseProgress = useMemo(() => {
    const total = requirements.length;
    const completed = requirements.filter(req => req.includes('complete')).length;
    return total > 0 ? (completed / total) * 100 : 0;
  }, [requirements]);

  const handleAdvancePhase = useCallback(() => {
    const nextPhases: Record<DesignPhase, DesignPhase | null> = {
      '35_percent': '65_percent',
      '65_percent': '95_percent',
      '95_percent': '100_percent',
      '100_percent': 'issued_for_construction',
      'issued_for_construction': null,
    };

    const nextPhase = nextPhases[currentPhase];
    if (nextPhase) {
      advancePhase(nextPhase, 'Current User');
      if (onPhaseComplete) onPhaseComplete(currentPhase);
    }
  }, [currentPhase, advancePhase, onPhaseComplete]);

  return (
    <div className="design-phase-controller p-6">
      <h2 className="text-2xl font-bold mb-4">Design Phase Controller</h2>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-sm text-gray-600">Current Phase</div>
            <div className="text-3xl font-bold">{currentPhase.replace('_', ' ').toUpperCase()}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Progress</div>
            <div className="text-3xl font-bold text-blue-600">{phaseProgress.toFixed(0)}%</div>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
          <div
            className="bg-blue-600 h-4 rounded-full"
            style={{ width: `${phaseProgress}%` }}
          />
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-2">Phase Requirements</h3>
          <ul className="list-disc list-inside space-y-1">
            {requirements.map((req, idx) => (
              <li key={idx} className="text-gray-700">{req}</li>
            ))}
          </ul>
        </div>

        {phaseProgress === 100 && (
          <button
            onClick={handleAdvancePhase}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium w-full"
          >
            Advance to Next Phase
          </button>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Phase History</h3>
        <div className="space-y-2">
          {phaseHistory.map((entry, idx) => (
            <div key={idx} className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium">{entry.phase.replace('_', ' ').toUpperCase()}</div>
              <div className="text-sm text-gray-600">
                Completed by {entry.completedBy} on {entry.completedDate.toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default { DesignPhaseController };
