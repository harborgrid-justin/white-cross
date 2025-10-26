/**
 * TestConsole Component
 * 
 * Test Console for integration module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface TestConsoleProps {
  className?: string;
}

/**
 * TestConsole component - Test Console
 */
const TestConsole: React.FC<TestConsoleProps> = ({ className = '' }) => {
  return (
    <div className={`test-console ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Console</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Test Console functionality</p>
          <p className="text-sm mt-2">Connected to integration Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default TestConsole;
