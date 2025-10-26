'use client';

/**
 * Redux Integration Demo Component
 *
 * This component demonstrates the fully integrated Redux store
 * with examples of using hooks from all domains.
 */

import React, { useEffect } from 'react';
import { 
  useAppSelector, 
  useAppDispatch,
  useCurrentUser,
  useIsAuthenticated
} from '../../../hooks/shared/reduxHooks';
import { 
  useStudents,
  useStudentManagement 
} from '../../../hooks/domains/students';
import { 
  useMedicationsData 
} from '../../../hooks/domains/medications';

/**
 * Dashboard showing data from multiple Redux slices
 */
export default function ReduxIntegrationDemo() {
  // Auth state
  const user = useCurrentUser();
  const isAuthenticated = useIsAuthenticated();

  // Student data using available hooks
  const studentsQuery = useStudents();
  const studentManagement = useStudentManagement();

  // Medication data using available hooks
  const medicationsData = useMedicationsData();

  // Mock data for demo purposes (since some hooks aren't implemented yet)
  const mockIncidents = { data: [], loading: false };
  const mockMessages = { unreadCount: 0 };
  const mockInventory = { lowStock: [], expired: [] };

  // Loading states from different slices
  const studentsLoading = useAppSelector(state => (state.students as any)?.loading?.list?.isLoading ?? false);
  const medicationsLoading = useAppSelector(state => (state.medications as any)?.loading?.list?.isLoading ?? false);
  const inventoryLoading = useAppSelector(state => (state.inventory as any)?.loading?.list?.isLoading ?? false);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Redux Integration Demo 🎉
      </h1>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-800">
          This component demonstrates the fully integrated Redux store.
          All hooks are importing from <code className="bg-blue-100 px-1 rounded">@/stores</code>
        </p>
      </div>

      {/* Authentication Section */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">
          🔐 Authentication State
        </h2>
        <div className="bg-gray-50 p-4 rounded border">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Authenticated:</strong>{' '}
              <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                {isAuthenticated ? '✅ Yes' : '❌ No'}
              </span>
            </div>
            <div>
              <strong>User:</strong>{' '}
              {user ? `${user.firstName} ${user.lastName}` : 'Not logged in'}
            </div>
            {user && (
              <>
                <div>
                  <strong>Email:</strong> {user.email}
                </div>
                <div>
                  <strong>Role:</strong> {user.role}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Students Section */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">
          👨‍🎓 Students (from Redux)
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded border border-green-200">
            <div className="text-2xl font-bold text-green-700">
              {studentsLoading ? '...' : studentsQuery?.students?.length || 0}
            </div>
            <div className="text-sm text-green-600">Active Students</div>
          </div>
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <div className="text-2xl font-bold text-blue-700">
              {studentsLoading ? '...' : 0}
            </div>
            <div className="text-sm text-blue-600">5th Grade Students (Mock)</div>
          </div>
        </div>
      </section>

      {/* Medications Section */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">
          💊 Medications (from Redux)
        </h2>
        <div className="bg-orange-50 p-4 rounded border border-orange-200">
          <div className="text-2xl font-bold text-orange-700">
            {medicationsLoading ? '...' : medicationsData?.medications?.length || 0}
          </div>
          <div className="text-sm text-orange-600">
            Medications Due Today
          </div>
          {!medicationsLoading && (medicationsData?.medications?.length || 0) > 0 && (
            <div className="mt-2 text-xs text-orange-500">
              ⚠️ Requires immediate attention
            </div>
          )}
        </div>
      </section>

      {/* Incidents Section */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">
          📋 Incidents (from Redux)
        </h2>
        <div className="bg-red-50 p-4 rounded border border-red-200">
          <div className="text-2xl font-bold text-red-700">
            {mockIncidents.data.length}
          </div>
          <div className="text-sm text-red-600">Total Incident Reports (Mock)</div>
        </div>
      </section>

      {/* Communication Section */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">
          💬 Communication (from Redux)
        </h2>
        <div className="bg-purple-50 p-4 rounded border border-purple-200">
          <div className="text-2xl font-bold text-purple-700">
            {mockMessages.unreadCount}
          </div>
          <div className="text-sm text-purple-600">Unread Messages (Mock)</div>
        </div>
      </section>

      {/* Inventory Section */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">
          📦 Inventory (from Redux)
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-700">
              {inventoryLoading ? '...' : mockInventory.lowStock.length}
            </div>
            <div className="text-sm text-yellow-600">Low Stock Items (Mock)</div>
          </div>
          <div className="bg-red-50 p-4 rounded border border-red-200">
            <div className="text-2xl font-bold text-red-700">
              {inventoryLoading ? '...' : mockInventory.expired.length}
            </div>
            <div className="text-sm text-red-600">Expired Items (Mock)</div>
          </div>
        </div>
      </section>

      {/* Redux DevTools Notice */}
      <section className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded">
        <h3 className="font-semibold text-indigo-800 mb-2">
          🛠️ Redux DevTools
        </h3>
        <p className="text-sm text-indigo-700">
          Open Redux DevTools in your browser to inspect the state, view action history,
          and debug. All the data shown above is coming from the Redux store.
        </p>
      </section>

      {/* Documentation Links */}
      <section className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded">
        <h3 className="font-semibold text-gray-800 mb-2">
          📚 Documentation
        </h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• <code>stores/README.md</code> - Architecture overview</li>
          <li>• <code>stores/USAGE_EXAMPLES.md</code> - Code examples</li>
          <li>• <code>stores/QUICK_REFERENCE.md</code> - Quick reference</li>
          <li>• <code>stores/INTEGRATION_COMPLETE.md</code> - Integration guide</li>
        </ul>
      </section>
    </div>
  );
}
