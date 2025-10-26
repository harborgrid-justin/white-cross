/**
 * AuditLogDetails Component
 * Display detailed view of audit log entry
 */

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AuditLogDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/compliance/audit')} className="btn btn-ghost">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Log Details</h1>
          <p className="text-gray-600 mt-1">Detailed audit log entry {id}</p>
        </div>
      </div>

      <div className="card p-6">
        <div className="text-center text-gray-500 py-8">
          <p>Audit log details would be displayed here.</p>
        </div>
      </div>
    </div>
  );
};

export default AuditLogDetails;
