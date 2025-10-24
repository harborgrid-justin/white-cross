/**
 * ConsentFormsList Component
 * Displays list of consent forms with filtering
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../hooks/shared/store-hooks-index';
import { fetchConsentForms, selectConsentForms, selectLoading } from '../store';

const ConsentFormsList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const forms = useAppSelector(selectConsentForms);
  const loading = useAppSelector(state => selectLoading(state).consentForms);

  useEffect(() => {
    dispatch(fetchConsentForms());
  }, [dispatch]);

  if (loading && forms.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading consent forms...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consent Forms</h1>
          <p className="text-gray-600 mt-1">Manage student consent forms</p>
        </div>
        <button
          onClick={() => navigate('/compliance/consent/forms/new')}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Consent Form
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Form Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Created Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {forms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    No consent forms found.
                  </td>
                </tr>
              ) : (
                forms.map((form) => (
                  <tr key={form.id} className="hover:bg-gray-50">
                    <td className="font-medium">{form.formName || 'Untitled Form'}</td>
                    <td>{form.formType}</td>
                    <td>
                      <span className={`badge ${form.active ? 'badge-success' : 'badge-secondary'}`}>
                        {form.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(form.createdAt).toLocaleDateString()}</td>
                    <td className="text-right">
                      <button
                        onClick={() => navigate(`/compliance/consent/forms/${form.id}`)}
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

export default ConsentFormsList;
