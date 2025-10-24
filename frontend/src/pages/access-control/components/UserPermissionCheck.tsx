/**
 * WF-AC-COMP-003 | UserPermissionCheck.tsx - User Permission Check Component
 * Purpose: Component to check and display user permissions
 * Upstream: React, Redux | Dependencies: react, redux, lucide-react
 * Downstream: Access control routes | Called by: Route component
 * Related: Permission verification, access control
 * Exports: UserPermissionCheck component | Key Features: Permission lookup, validation
 * Last Updated: 2025-10-24 | File Type: .tsx
 * Critical Path: User input → Permission check → Display results
 * LLM Context: Permission checker component for RBAC system
 */

import React, { useState } from 'react';
import { useAppDispatch } from '../../../hooks/shared/store-hooks-index';
import { checkUserPermission } from '../store';
import { Shield, Search, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * UserPermissionCheck Component
 *
 * Provides interface for:
 * - Checking if a user has specific permissions
 * - Displaying permission check results
 * - Validating access for specific resources and actions
 *
 * @returns React component
 */
const UserPermissionCheck: React.FC = () => {
  const dispatch = useAppDispatch();

  const [userId, setUserId] = useState('');
  const [resource, setResource] = useState('');
  const [action, setAction] = useState('');
  const [checkResult, setCheckResult] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckPermission = async () => {
    if (!userId || !resource || !action) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsChecking(true);
    setCheckResult(null);

    try {
      const result = await dispatch(checkUserPermission({ userId, resource, action })).unwrap();
      setCheckResult(result.hasPermission);
    } catch (error: any) {
      toast.error(error.message || 'Failed to check permission');
      setCheckResult(false);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Check User Permissions</h1>
          </div>
          <p className="mt-2 text-gray-600">Verify user access permissions for resources</p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User ID
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter user ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resource
            </label>
            <input
              type="text"
              value={resource}
              onChange={(e) => setResource(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., student, medication"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action
            </label>
            <input
              type="text"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., read, create, update, delete"
            />
          </div>

          <button
            onClick={handleCheckPermission}
            disabled={isChecking}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Search className="h-5 w-5" />
            <span>{isChecking ? 'Checking...' : 'Check Permission'}</span>
          </button>

          {checkResult !== null && (
            <div className={`mt-4 p-4 rounded-md ${checkResult ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center space-x-3">
                {checkResult ? (
                  <>
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Permission Granted</p>
                      <p className="text-sm text-green-700">User has permission to {action} {resource}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6 text-red-600" />
                    <div>
                      <p className="font-medium text-red-900">Permission Denied</p>
                      <p className="text-sm text-red-700">User does not have permission to {action} {resource}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPermissionCheck;
