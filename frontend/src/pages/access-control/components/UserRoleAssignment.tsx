/**
 * WF-AC-COMP-002 | UserRoleAssignment.tsx - User Role Assignment Component
 * Purpose: UI for assigning and managing user roles
 * Upstream: React, Redux | Dependencies: react, redux, lucide-react
 * Downstream: Access control routes | Called by: Route component
 * Related: Role management, user management
 * Exports: UserRoleAssignment component | Key Features: Role assignment, bulk operations
 * Last Updated: 2025-10-24 | File Type: .tsx
 * Critical Path: User selection → Role selection → Assignment → Redux update
 * LLM Context: User role assignment component for RBAC system
 */

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/shared/store-hooks-index';
import { fetchRoles, assignRoleToUser, removeRoleFromUser, selectRoles } from '../store';
import { Users, UserPlus, Shield, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * UserRoleAssignment Component
 *
 * Provides interface for:
 * - Viewing user role assignments
 * - Assigning roles to users
 * - Removing roles from users
 * - Bulk role operations
 *
 * @returns React component
 */
const UserRoleAssignment: React.FC = () => {
  const dispatch = useAppDispatch();
  const roles = useAppSelector(selectRoles);

  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const handleAssignRole = async () => {
    if (!selectedUserId || !selectedRoleId) {
      toast.error('Please select both user and role');
      return;
    }

    setIsAssigning(true);
    try {
      await dispatch(assignRoleToUser({ userId: selectedUserId, roleId: selectedRoleId })).unwrap();
      toast.success('Role assigned successfully');
      setSelectedUserId('');
      setSelectedRoleId('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to assign role');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">User Role Assignment</h1>
        </div>
        <p className="mt-2 text-gray-600">Manage user role assignments</p>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User ID
            </label>
            <input
              type="text"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter user ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Role
            </label>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a role...</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAssignRole}
            disabled={isAssigning || !selectedUserId || !selectedRoleId}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <UserPlus className="h-5 w-5" />
            <span>{isAssigning ? 'Assigning...' : 'Assign Role'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserRoleAssignment;
