/**
 * LOC: USACE-DOWNSTREAM-CIS-001
 * File: /reuse/frontend/composites/usace/downstream/cad-integration-systems.ts
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  useCADDrawingManagement,
  type CADDrawing,
  type DesignDiscipline,
} from '../usace-engineering-design-composites';

export function CADDrawingLibrary({
  projectId,
  onDrawingSelect,
}: {
  projectId: string;
  onDrawingSelect?: (drawing: CADDrawing) => void;
}) {
  const {
    drawings,
    uploadDrawing,
    reviseDrawing,
    getDrawingsByDiscipline,
    getLatestRevision,
  } = useCADDrawingManagement(projectId);

  const [filterDiscipline, setFilterDiscipline] = useState<DesignDiscipline | 'all'>('all');

  const filteredDrawings = useMemo(() => {
    return filterDiscipline === 'all' ? drawings : getDrawingsByDiscipline(filterDiscipline);
  }, [drawings, filterDiscipline, getDrawingsByDiscipline]);

  return (
    <div className="cad-drawing-library p-6">
      <h2 className="text-2xl font-bold mb-4">CAD Drawing Library</h2>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Drawings</div>
          <div className="text-3xl font-bold">{drawings.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Approved</div>
          <div className="text-3xl font-bold text-green-600">
            {drawings.filter(d => d.status === 'approved').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">In Review</div>
          <div className="text-3xl font-bold text-orange-600">
            {drawings.filter(d => d.status === 'review').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Issued</div>
          <div className="text-3xl font-bold text-blue-600">
            {drawings.filter(d => d.status === 'issued').length}
          </div>
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
          <option value="architectural">Architectural</option>
          <option value="structural">Structural</option>
          <option value="mechanical">Mechanical</option>
          <option value="electrical">Electrical</option>
          <option value="civil">Civil</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-xl font-bold">Drawings ({filteredDrawings.length})</h3>
        </div>
        <div className="divide-y">
          {filteredDrawings.map(drawing => (
            <div
              key={drawing.id}
              onClick={() => onDrawingSelect && onDrawingSelect(drawing)}
              className="p-4 hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold">{drawing.drawingNumber}</div>
                  <div className="text-gray-700">{drawing.title}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">Rev {drawing.revision}</div>
                  <div className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                    {drawing.status.toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Discipline:</span>
                  <div className="font-medium">{drawing.discipline}</div>
                </div>
                <div>
                  <span className="text-gray-600">Sheet:</span>
                  <div className="font-medium">{drawing.sheetNumber}</div>
                </div>
                <div>
                  <span className="text-gray-600">Format:</span>
                  <div className="font-medium">{drawing.fileFormat.toUpperCase()}</div>
                </div>
                <div>
                  <span className="text-gray-600">Size:</span>
                  <div className="font-medium">{(drawing.fileSize / 1024 / 1024).toFixed(2)} MB</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default { CADDrawingLibrary };
