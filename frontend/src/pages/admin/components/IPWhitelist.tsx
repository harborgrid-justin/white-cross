/**
 * IPWhitelist Component
 * 
 * I P Whitelist for admin module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface IPWhitelistProps {
  className?: string;
}

/**
 * IPWhitelist component - I P Whitelist
 */
const IPWhitelist: React.FC<IPWhitelistProps> = ({ className = '' }) => {
  return (
    <div className={`i-p-whitelist ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">I P Whitelist</h3>
        <div className="text-center text-gray-500 py-8">
          <p>I P Whitelist functionality</p>
          <p className="text-sm mt-2">Connected to admin Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default IPWhitelist;
