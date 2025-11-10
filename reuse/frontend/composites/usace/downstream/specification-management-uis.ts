/**
 * LOC: USACE-DOWNSTREAM-SMU-001
 * File: /reuse/frontend/composites/usace/downstream/specification-management-uis.ts
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  useSpecificationManagement,
  type DesignSpecification,
} from '../usace-engineering-design-composites';

export function SpecificationManager({
  projectId,
  onSpecificationEdit,
}: {
  projectId: string;
  onSpecificationEdit?: (spec: DesignSpecification) => void;
}) {
  const {
    specifications,
    createSpecification,
    updateSpecification,
    getSpecificationsByDivision,
    validateUFGSCompliance,
  } = useSpecificationManagement(projectId);

  const [selectedDivision, setSelectedDivision] = useState<number | 'all'>('all');

  const filteredSpecs = useMemo(() => {
    return selectedDivision === 'all' ? specifications : getSpecificationsByDivision(selectedDivision);
  }, [specifications, selectedDivision, getSpecificationsByDivision]);

  const specsByDivision = useMemo(() => {
    const groups: Record<number, number> = {};
    specifications.forEach(spec => {
      groups[spec.division] = (groups[spec.division] || 0) + 1;
    });
    return groups;
  }, [specifications]);

  return (
    <div className="specification-manager p-6">
      <h2 className="text-2xl font-bold mb-4">Specification Manager</h2>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Specifications</div>
          <div className="text-3xl font-bold">{specifications.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">UFGS Based</div>
          <div className="text-3xl font-bold text-blue-600">
            {specifications.filter(s => s.baseSpec === 'UFGS').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Custom</div>
          <div className="text-3xl font-bold text-purple-600">
            {specifications.filter(s => s.baseSpec === 'custom').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Divisions</div>
          <div className="text-3xl font-bold">{Object.keys(specsByDivision).length}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <label className="block text-sm font-medium mb-2">Filter by Division</label>
        <select
          value={selectedDivision}
          onChange={(e) => setSelectedDivision(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="w-full border rounded-lg p-2"
        >
          <option value="all">All Divisions</option>
          {Object.keys(specsByDivision).sort().map(div => (
            <option key={div} value={div}>Division {div}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-xl font-bold">Specifications ({filteredSpecs.length})</h3>
        </div>
        <div className="divide-y">
          {filteredSpecs.map(spec => {
            const isUFGSCompliant = validateUFGSCompliance(spec.id);

            return (
              <div
                key={spec.id}
                onClick={() => onSpecificationEdit && onSpecificationEdit(spec)}
                className="p-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold">{spec.section}: {spec.title}</div>
                    <div className="text-sm text-gray-600">Division {spec.division}</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                      {spec.baseSpec.toUpperCase()}
                    </div>
                    {isUFGSCompliant && (
                      <div className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                        UFGS COMPLIANT
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Products:</span>
                    <div className="font-medium">{spec.products.length}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Related Drawings:</span>
                    <div className="font-medium">{spec.relatedDrawings.length}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Modified:</span>
                    <div className="font-medium">{spec.lastModified.toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default { SpecificationManager };
