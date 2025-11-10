/**
 * LOC: USACE-DOWNSTREAM-VCA-001
 * File: /reuse/frontend/composites/usace/downstream/version-control-applications.ts
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  useVersionControl,
  calculateVersionIncrement,
  type Document,
  type DocumentVersion,
} from '../usace-document-control-composites';

export function DocumentVersionHistory({
  documentId,
  onVersionSelect,
}: {
  documentId: string;
  onVersionSelect?: (version: DocumentVersion) => void;
}) {
  const {
    versions,
    createVersion,
    compareVersions,
    getLatestVersion,
    rollbackToVersion,
  } = useVersionControl(documentId);

  const [compareMode, setCompareMode] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

  const latestVersion = useMemo(() => getLatestVersion(), [getLatestVersion]);

  const handleCompare = useCallback(() => {
    if (selectedVersions.length === 2) {
      const comparison = compareVersions(selectedVersions[0], selectedVersions[1]);
      console.log('Comparison:', comparison);
    }
  }, [selectedVersions, compareVersions]);

  return (
    <div className="document-version-history p-6">
      <h2 className="text-2xl font-bold mb-4">Version History</h2>

      <div className="mb-4">
        <button
          onClick={() => setCompareMode(!compareMode)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          {compareMode ? 'Exit Compare Mode' : 'Compare Versions'}
        </button>
      </div>

      <div className="space-y-4">
        {versions.map(version => (
          <div key={version.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-bold">Version {version.versionNumber}</div>
                <div className="text-sm text-gray-600">
                  Rev {version.revisionNumber} - {version.changeType}
                </div>
              </div>
              {version.approved && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                  APPROVED
                </span>
              )}
            </div>
            <div className="text-sm text-gray-700 mb-2">{version.changeDescription}</div>
            <div className="text-xs text-gray-500">
              Created by {version.createdBy} on {version.createdDate.toLocaleString()}
            </div>
            {compareMode && (
              <input
                type="checkbox"
                checked={selectedVersions.includes(version.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    if (selectedVersions.length < 2) {
                      setSelectedVersions([...selectedVersions, version.id]);
                    }
                  } else {
                    setSelectedVersions(selectedVersions.filter(id => id !== version.id));
                  }
                }}
                className="mt-2"
              />
            )}
          </div>
        ))}
      </div>

      {compareMode && selectedVersions.length === 2 && (
        <button
          onClick={handleCompare}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg"
        >
          Compare Selected Versions
        </button>
      )}
    </div>
  );
}

export default { DocumentVersionHistory };
