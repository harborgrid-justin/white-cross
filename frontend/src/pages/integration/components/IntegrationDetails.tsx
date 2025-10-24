/**
 * IntegrationDetails Component
 * Display detailed view of integration
 */

import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit2, Play, TestTube } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../hooks/shared/store-hooks-index';
import { fetchIntegrationById, selectCurrentIntegration, selectLoading } from '../store';

const IntegrationDetails: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { integrationId } = useParams<{ integrationId: string }>();
  const integration = useAppSelector(selectCurrentIntegration);
  const loading = useAppSelector(state => selectLoading(state).currentIntegration);

  useEffect(() => {
    if (integrationId) {
      dispatch(fetchIntegrationById(integrationId));
    }
  }, [integrationId, dispatch]);

  if (loading || !integration) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading integration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/integration/list')} className="btn btn-ghost">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{integration.name}</h1>
            <p className="text-gray-600 mt-1">{integration.type} Integration</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn btn-secondary flex items-center">
            <TestTube className="h-4 w-4 mr-2" />
            Test Connection
          </button>
          <button className="btn btn-secondary flex items-center">
            <Play className="h-4 w-4 mr-2" />
            Sync Now
          </button>
          <button onClick={() => navigate(`/integration/${integrationId}/edit`)} className="btn btn-primary flex items-center">
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-lg font-semibold mb-4">Configuration Details</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Integration Type</p>
              <p className="text-gray-600">{integration.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Description</p>
              <p className="text-gray-600">{integration.description || 'No description provided'}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Status</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Active</p>
              <span className={`badge ${integration.isActive ? 'badge-success' : 'badge-secondary'}`}>
                {integration.isActive ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Last Sync</p>
              <p className="text-sm text-gray-600">
                {integration.lastSyncAt ? new Date(integration.lastSyncAt).toLocaleString() : 'Never'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationDetails;
