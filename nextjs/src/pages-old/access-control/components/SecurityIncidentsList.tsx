/**
 * WF-AC-COMP-006 | SecurityIncidentsList.tsx - Security Incidents List
 * Purpose: Display and manage security incidents
 * Dependencies: react, redux, lucide-react
 * Exports: SecurityIncidentsList component
 * Last Updated: 2025-10-24
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/shared/store-hooks-index';
import { fetchSecurityIncidents, selectFilteredIncidents, selectLoading } from '../store';
import { AlertTriangle, Eye, Plus } from 'lucide-react';

const SecurityIncidentsList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const incidents = useAppSelector(selectFilteredIncidents);
  const loading = useAppSelector(selectLoading);

  useEffect(() => {
    dispatch(fetchSecurityIncidents());
  }, [dispatch]);

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      CRITICAL: 'bg-red-100 text-red-800',
      HIGH: 'bg-orange-100 text-orange-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      LOW: 'bg-blue-100 text-blue-800'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-8 w-8 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">Security Incidents</h1>
        </div>
        <button
          onClick={() => navigate('/access-control/incidents/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Report Incident</span>
        </button>
      </div>

      {loading.incidents ? (
        <div className="bg-white shadow-sm rounded-lg p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading incidents...</p>
        </div>
      ) : incidents.length > 0 ? (
        <div className="space-y-4">
          {incidents.map((incident: any) => (
            <div key={incident.id} className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                    <span className="text-sm text-gray-600">{incident.type}</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{incident.title || 'Untitled Incident'}</h3>
                  <p className="text-sm text-gray-600">{incident.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Reported: {new Date(incident.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/access-control/incidents/${incident.id}`)}
                  className="ml-4 px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 flex items-center space-x-1"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg p-12 text-center">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No security incidents found</p>
        </div>
      )}
    </div>
  );
};

export default SecurityIncidentsList;
