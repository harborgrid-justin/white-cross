/**
 * WF-AC-COMP-004 | ActiveSessionsList.tsx - Active Sessions List Component
 * Purpose: Display list of active user sessions
 * Upstream: React, Redux | Dependencies: react, redux, lucide-react
 * Downstream: Access control routes | Called by: Route component
 * Related: Session management, security monitoring
 * Exports: ActiveSessionsList component | Key Features: Session viewing, termination
 * Last Updated: 2025-10-24 | File Type: .tsx
 * Critical Path: Load sessions → Display → Actions (terminate)
 * LLM Context: Active sessions list component for session management
 */

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/shared/store-hooks-index';
import { fetchUserSessions, deleteSession, selectSessions, selectLoading } from '../store';
import { Monitor, X, Clock, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * ActiveSessionsList Component
 *
 * Displays and manages active user sessions:
 * - List of all active sessions
 * - Session details (device, location, time)
 * - Session termination capabilities
 *
 * @returns React component
 */
const ActiveSessionsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const sessions = useAppSelector(selectSessions);
  const loading = useAppSelector(selectLoading);
  const [userId, setUserId] = useState('');

  const handleFetchSessions = async () => {
    if (!userId) {
      toast.error('Please enter a user ID');
      return;
    }

    try {
      await dispatch(fetchUserSessions(userId)).unwrap();
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch sessions');
    }
  };

  const handleTerminateSession = async (token: string) => {
    if (!window.confirm('Are you sure you want to terminate this session?')) {
      return;
    }

    try {
      await dispatch(deleteSession(token)).unwrap();
      toast.success('Session terminated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to terminate session');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <Monitor className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Active Sessions</h1>
        </div>
        <p className="mt-2 text-gray-600">View and manage active user sessions</p>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <div className="flex space-x-3">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter user ID to view sessions"
          />
          <button
            onClick={handleFetchSessions}
            disabled={loading.sessions}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading.sessions ? 'Loading...' : 'Load Sessions'}
          </button>
        </div>
      </div>

      {sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map((session: any) => (
            <div key={session.id} className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Monitor className="h-5 w-5 text-gray-600" />
                    <h3 className="font-medium text-gray-900">{session.deviceInfo || 'Unknown Device'}</h3>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{session.ipAddress || 'Unknown Location'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Started: {new Date(session.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleTerminateSession(session.token)}
                  className="ml-4 px-3 py-1 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50 flex items-center space-x-1"
                >
                  <X className="h-4 w-4" />
                  <span>Terminate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg p-12 text-center">
          <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No active sessions found</p>
          <p className="text-sm text-gray-500 mt-1">Enter a user ID to view their active sessions</p>
        </div>
      )}
    </div>
  );
};

export default ActiveSessionsList;
