/**
 * IntegrationsList Component
 * Display list of all integrations
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../hooks/shared/store-hooks-index';
import { fetchIntegrations, selectIntegrations, selectLoading } from '../store';

const IntegrationsList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const integrations = useAppSelector(selectIntegrations);
  const loading = useAppSelector(state => selectLoading(state).integrations);

  useEffect(() => {
    dispatch(fetchIntegrations());
  }, [dispatch]);

  if (loading && integrations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading integrations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-600 mt-1">Manage external system integrations</p>
        </div>
        <button
          onClick={() => navigate('/integration/create')}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Integration
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Last Sync</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {integrations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    No integrations configured.
                  </td>
                </tr>
              ) : (
                integrations.map((integration) => (
                  <tr key={integration.id} className="hover:bg-gray-50">
                    <td className="font-medium">{integration.name}</td>
                    <td>{integration.type}</td>
                    <td>
                      <span className={`badge ${integration.isActive ? 'badge-success' : 'badge-secondary'}`}>
                        {integration.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{integration.lastSyncAt ? new Date(integration.lastSyncAt).toLocaleString() : 'Never'}</td>
                    <td className="text-right">
                      <button
                        onClick={() => navigate(`/integration/${integration.id}`)}
                        className="btn btn-sm btn-ghost"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsList;
