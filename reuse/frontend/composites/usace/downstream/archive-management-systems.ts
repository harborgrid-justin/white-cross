/**
 * LOC: USACE-DOWNSTREAM-AMS-001
 * File: /reuse/frontend/composites/usace/downstream/archive-management-systems.ts
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  useRetentionManagement,
  type Document,
  type ArchiveRecord,
} from '../usace-document-control-composites';

export function ArchiveManagementSystem({
  documents,
  onArchive,
}: {
  documents: Document[];
  onArchive?: (archiveRecord: ArchiveRecord) => void;
}) {
  const {
    archives,
    archiveDocument,
    checkRetentionStatus,
    getDocumentsDueForDisposition,
  } = useRetentionManagement();

  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  const dueForDisposition = useMemo(
    () => getDocumentsDueForDisposition(documents, 90),
    [documents, getDocumentsDueForDisposition]
  );

  return (
    <div className="archive-management-system p-6">
      <h2 className="text-2xl font-bold mb-4">Archive Management</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Archives</div>
          <div className="text-3xl font-bold">{archives.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Due for Disposition</div>
          <div className="text-3xl font-bold text-orange-600">{dueForDisposition.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Documents Archived</div>
          <div className="text-3xl font-bold">
            {archives.reduce((sum, a) => sum + a.documents.length, 0)}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Archive Records</h3>
        <div className="space-y-4">
          {archives.map(archive => (
            <div key={archive.id} className="border p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold">Box: {archive.archiveBox}</div>
                  <div className="text-sm text-gray-600">
                    Location: {archive.archiveLocation}
                  </div>
                </div>
                <div className="px-2 py-1 rounded text-sm bg-green-100 text-green-800">
                  {archive.retrievable ? 'Retrievable' : 'Not Retrievable'}
                </div>
              </div>
              <div className="text-sm text-gray-700">
                Documents: {archive.documents.length} | Digital Copy: {archive.digitalCopy ? 'Yes' : 'No'}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Archived by {archive.archivedBy} on {archive.archivedDate.toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default { ArchiveManagementSystem };
