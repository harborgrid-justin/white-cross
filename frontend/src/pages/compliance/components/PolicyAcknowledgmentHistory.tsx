/**
 * PolicyAcknowledgmentHistory Component
 * Display acknowledgment history for policies
 */

import React from 'react';
import { useParams } from 'react-router-dom';

const PolicyAcknowledgmentHistory: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Policy Acknowledgment History</h1>
        <p className="text-gray-600 mt-1">View acknowledgment history for policy {id}</p>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Acknowledged Date</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No acknowledgment history available.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PolicyAcknowledgmentHistory;
