/**
 * ConsentFormDetails Component
 * Display detailed view of consent form
 */

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit2 } from 'lucide-react';

const ConsentFormDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/compliance/consent/forms')} className="btn btn-ghost">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Consent Form Details</h1>
            <p className="text-gray-600 mt-1">View consent form information</p>
          </div>
        </div>
        <button onClick={() => navigate(`/compliance/consent/forms/${id}/edit`)} className="btn btn-primary flex items-center">
          <Edit2 className="h-4 w-4 mr-2" />
          Edit
        </button>
      </div>

      <div className="card p-6">
        <div className="text-center text-gray-500 py-8">
          <p>Consent form details for ID: {id}</p>
        </div>
      </div>
    </div>
  );
};

export default ConsentFormDetails;
