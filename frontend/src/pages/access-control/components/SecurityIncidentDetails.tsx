/**
 * WF-AC-COMP-008 | SecurityIncidentDetails.tsx - Security Incident Details
 * Purpose: Detailed view of security incident
 * Dependencies: react, redux, react-router-dom
 * Exports: SecurityIncidentDetails component
 * Last Updated: 2025-10-24
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';
import { selectSecurityIncidents } from '../store';
import { AlertTriangle, ArrowLeft, Clock, User } from 'lucide-react';

const SecurityIncidentDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const incidents = useAppSelector(selectSecurityIncidents);
  const incident = incidents.find(i => i.id === id);

  if (!incident) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white shadow-sm rounded-lg p-12 text-center">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Incident not found</p>
          <button
            onClick={() => navigate('/access-control/incidents')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Incidents
          </button>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      CRITICAL: 'bg-red-100 text-red-800 border-red-200',
      HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
      MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      LOW: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/access-control/incidents')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Incidents</span>
        </button>
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-8 w-8 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">Incident Details</h1>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{incident.title || 'Untitled Incident'}</h2>
            <p className="text-sm text-gray-600 mt-1">ID: {incident.id}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getSeverityColor(incident.severity)}`}>
              {incident.severity}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Type</h3>
            <p className="text-gray-900">{incident.type}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
            <p className="text-gray-900">{incident.status || 'OPEN'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>User ID</span>
            </h3>
            <p className="text-gray-900">{incident.userId || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Reported At</span>
            </h3>
            <p className="text-gray-900">{new Date(incident.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
          <p className="text-gray-900 whitespace-pre-wrap">{incident.description}</p>
        </div>

        <div className="pt-4 border-t flex items-center justify-end space-x-3">
          <button
            onClick={() => navigate(`/access-control/incidents/${id}/edit`)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Edit Incident
          </button>
          <button
            onClick={() => navigate('/access-control/incidents')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityIncidentDetails;
