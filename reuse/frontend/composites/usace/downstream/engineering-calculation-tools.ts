/**
 * LOC: USACE-DOWNSTREAM-ECT-001
 * File: /reuse/frontend/composites/usace/downstream/engineering-calculation-tools.ts
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  useDesignCalculations,
  type DesignCalculation,
  type DesignDiscipline,
} from '../usace-engineering-design-composites';

export function EngineeringCalculationManager({
  projectId,
  onCalculationSelect,
}: {
  projectId: string;
  onCalculationSelect?: (calc: DesignCalculation) => void;
}) {
  const {
    calculations,
    createCalculation,
    checkCalculation,
    approveCalculation,
    getUncheckedCalculations,
  } = useDesignCalculations(projectId);

  const [filterDiscipline, setFilterDiscipline] = useState<DesignDiscipline | 'all'>('all');

  const uncheckedCalcs = useMemo(() => getUncheckedCalculations(), [getUncheckedCalculations]);

  const filteredCalculations = useMemo(() => {
    return filterDiscipline === 'all'
      ? calculations
      : calculations.filter(c => c.discipline === filterDiscipline);
  }, [calculations, filterDiscipline]);

  return (
    <div className="engineering-calculation-manager p-6">
      <h2 className="text-2xl font-bold mb-4">Engineering Calculations</h2>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Calculations</div>
          <div className="text-3xl font-bold">{calculations.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Approved</div>
          <div className="text-3xl font-bold text-green-600">
            {calculations.filter(c => c.status === 'approved').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Checked</div>
          <div className="text-3xl font-bold text-blue-600">
            {calculations.filter(c => c.status === 'checked').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Unchecked</div>
          <div className="text-3xl font-bold text-orange-600">{uncheckedCalcs.length}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <label className="block text-sm font-medium mb-2">Filter by Discipline</label>
        <select
          value={filterDiscipline}
          onChange={(e) => setFilterDiscipline(e.target.value as DesignDiscipline | 'all')}
          className="w-full border rounded-lg p-2"
        >
          <option value="all">All Disciplines</option>
          <option value="structural">Structural</option>
          <option value="mechanical">Mechanical</option>
          <option value="electrical">Electrical</option>
          <option value="civil">Civil</option>
          <option value="geotechnical">Geotechnical</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-xl font-bold">Calculations ({filteredCalculations.length})</h3>
        </div>
        <div className="divide-y">
          {filteredCalculations.map(calc => (
            <div
              key={calc.id}
              onClick={() => onCalculationSelect && onCalculationSelect(calc)}
              className="p-4 hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold">{calc.calculationNumber}</div>
                  <div className="text-gray-700">{calc.title}</div>
                </div>
                <div className="px-2 py-1 rounded text-sm">
                  {calc.status === 'approved' && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">APPROVED</span>
                  )}
                  {calc.status === 'checked' && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">CHECKED</span>
                  )}
                  {calc.status === 'draft' && (
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">DRAFT</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Discipline:</span>
                  <div className="font-medium">{calc.discipline}</div>
                </div>
                <div>
                  <span className="text-gray-600">Engineer:</span>
                  <div className="font-medium">{calc.engineer}</div>
                </div>
                <div>
                  <span className="text-gray-600">Checker:</span>
                  <div className="font-medium">{calc.checker || 'Not assigned'}</div>
                </div>
                <div>
                  <span className="text-gray-600">Date:</span>
                  <div className="font-medium">{calc.calculationDate.toLocaleDateString()}</div>
                </div>
              </div>

              {calc.codeReferences.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  Codes: {calc.codeReferences.join(', ')}
                </div>
              )}

              {calc.status === 'draft' && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      checkCalculation(calc.id, 'Current User');
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Mark as Checked
                  </button>
                </div>
              )}

              {calc.status === 'checked' && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      approveCalculation(calc.id, 'Current User');
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default { EngineeringCalculationManager };
