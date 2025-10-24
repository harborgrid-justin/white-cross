/**
 * WF-AC-COMP-005 | SessionManagement.tsx - Session Management Component
 * Purpose: Comprehensive session management interface
 * Upstream: React, Redux | Dependencies: react, redux, lucide-react
 * Downstream: Access control routes | Called by: Route component
 * Related: Session control, security
 * Exports: SessionManagement component | Key Features: Session CRUD, bulk operations
 * Last Updated: 2025-10-24 | File Type: .tsx
 * Critical Path: Session view → Actions → Redux operations
 * LLM Context: Session management component for security control
 */

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/shared/store-hooks-index';
import { fetchUserSessions, deleteAllUserSessions, selectFilteredSessions, selectSessionFilters, setSessionFilters } from '../store';
import { Monitor, Power, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * SessionManagement Component
 *
 * Provides comprehensive session management:
 * - View all sessions with filtering
 * - Bulk session termination
 * - Session activity monitoring
 * - Security controls
 *
 * @returns React component
 */
const SessionManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const sessions = useAppSelector(selectFilteredSessions);
  const filters = useAppSelector(selectSessionFilters);

  const handleTerminateAllSessions = async (userId: string) => {
    if (!window.confirm('Terminate all sessions for this user?')) {
      return;
    }

    try {
      await dispatch(deleteAllUserSessions(userId)).unwrap();
      toast.success('All sessions terminated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to terminate sessions');
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setSessionFilters({ [key]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <Monitor className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Session Management</h1>
        </div>
        <p className="mt-2 text-gray-600">Manage user sessions and enforce security policies</p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <h2 className="font-medium text-gray-900">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User ID
            </label>
            <input
              type="text"
              value={filters.userId || ''}
              onChange={(e) => handleFilterChange('userId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Filter by user ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.isActive !== undefined ? (filters.isActive ? 'active' : 'inactive') : ''}
              onChange={(e) => handleFilterChange('isActive', e.target.value === 'active' ? true : e.target.value === 'inactive' ? false : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sessions</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Session List */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="font-medium text-gray-900 mb-4">Sessions ({sessions.length})</h2>
        {sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.map((session: any) => (
              <div key={session.id} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">User: {session.userId}</p>
                    <p className="text-sm text-gray-600">IP: {session.ipAddress}</p>
                    <p className="text-sm text-gray-600">Device: {session.deviceInfo}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${session.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {session.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No sessions found</p>
        )}
      </div>
    </div>
  );
};

export default SessionManagement;
