/**
 * AuditTrail Component
 * Display audit trail for specific entity
 */

import React from 'react';
import { useParams } from 'react-router-dom';

const AuditTrail: React.FC = () => {
  const { entityType, entityId } = useParams<{ entityType: string; entityId: string }>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Trail</h1>
        <p className="text-gray-600 mt-1">
          Audit trail for {entityType}: {entityId}
        </p>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>User</th>
                <th>Changes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No audit trail available for this entity.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;
