/**
 * WF-AC-COMP-009 | IpRestrictionsList.tsx - IP Restrictions List
 * Purpose: Display and manage IP restrictions
 * Dependencies: react, redux, lucide-react
 * Exports: IpRestrictionsList component
 * Last Updated: 2025-10-24
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/shared/store-hooks-index';
import { fetchIpRestrictions, removeIpRestriction, selectIpRestrictions } from '../store';
import { Shield, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const IpRestrictionsList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const ipRestrictions = useAppSelector(selectIpRestrictions);

  useEffect(() => {
    dispatch(fetchIpRestrictions());
  }, [dispatch]);

  const handleRemoveRestriction = async (id: string) => {
    if (!window.confirm('Remove this IP restriction?')) {
      return;
    }

    try {
      await dispatch(removeIpRestriction(id)).unwrap();
      toast.success('IP restriction removed');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove restriction');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">IP Restrictions</h1>
        </div>
        <button
          onClick={() => navigate('/access-control/ip-restrictions/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Restriction</span>
        </button>
      </div>

      {ipRestrictions.length > 0 ? (
        <div className="bg-white shadow-sm rounded-lg divide-y">
          {ipRestrictions.map((restriction: any) => (
            <div key={restriction.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    restriction.type === 'WHITELIST' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {restriction.type}
                  </span>
                  <span className="font-mono text-gray-900">{restriction.ipAddress}</span>
                </div>
                {restriction.description && (
                  <p className="text-sm text-gray-600">{restriction.description}</p>
                )}
              </div>
              <button
                onClick={() => handleRemoveRestriction(restriction.id)}
                className="ml-4 px-3 py-1 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50 flex items-center space-x-1"
              >
                <Trash2 className="h-4 w-4" />
                <span>Remove</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg p-12 text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No IP restrictions configured</p>
        </div>
      )}
    </div>
  );
};

export default IpRestrictionsList;
