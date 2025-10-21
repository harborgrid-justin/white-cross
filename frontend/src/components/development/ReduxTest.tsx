/**
 * WF-COMP-064 | ReduxTest.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../stores/hooks/reduxHooks | Dependencies: react, ../stores/hooks/reduxHooks
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: functional component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React from 'react';
import { useCurrentUser, useIsAuthenticated, useAuthLoading, useAuthError, useAuthActions } from '../../stores';

const ReduxTest: React.FC = () => {
  const user = useCurrentUser();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();
  const error = useAuthError();
  const { login, logout, clearError } = useAuthActions();

  const handleTestLogin = () => {
    // Test login with dummy credentials (will fail but shows Redux working)
    login({ email: 'test@example.com', password: 'password' });
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Redux Test Component</h2>

      <div className="space-y-2">
        <div>
          <strong>Loading:</strong> {isLoading ? 'true' : 'false'}
        </div>
        <div>
          <strong>Authenticated:</strong> {isAuthenticated ? 'true' : 'false'}
        </div>
        <div>
          <strong>User:</strong> {user ? `${user.firstName} ${user.lastName}` : 'null'}
        </div>
        <div>
          <strong>Error:</strong> {error || 'null'}
        </div>
      </div>

      <div className="mt-4 space-x-2">
        <button
          onClick={handleTestLogin}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Login
        </button>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Test Logout
        </button>
        <button
          onClick={clearError}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Clear Error
        </button>
      </div>
    </div>
  );
};

export default ReduxTest;
