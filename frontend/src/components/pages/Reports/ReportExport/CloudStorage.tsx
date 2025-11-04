'use client';

import React from 'react';
import { Cloud } from 'lucide-react';

/**
 * Cloud storage provider options
 */
export type CloudProvider = 'aws' | 'azure' | 'gcp' | 'custom';

/**
 * Props for the CloudStorage component
 */
export interface CloudStorageProps {
  /** Cloud storage path */
  cloudPath?: string;
  /** Callback when cloud path changes */
  onChange: (cloudPath: string) => void;
  /** Cloud provider selection */
  provider?: CloudProvider;
  /** Callback when provider changes */
  onProviderChange?: (provider: CloudProvider) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Custom CSS classes */
  className?: string;
}

/**
 * CloudStorage Component
 *
 * Configuration for cloud storage export destination.
 * Supports AWS S3, Azure Blob Storage, Google Cloud Storage, and custom endpoints.
 *
 * @param props - CloudStorage component props
 * @returns JSX element representing the cloud storage configuration
 */
export const CloudStorage: React.FC<CloudStorageProps> = ({
  cloudPath = '',
  onChange,
  provider = 'aws',
  onProviderChange,
  disabled = false,
  className = ''
}) => {
  /**
   * Gets placeholder text based on provider
   */
  const getPlaceholder = (): string => {
    switch (provider) {
      case 'aws':
        return 's3://bucket-name/path/to/exports';
      case 'azure':
        return 'https://account.blob.core.windows.net/container/path';
      case 'gcp':
        return 'gs://bucket-name/path/to/exports';
      case 'custom':
        return 'Enter custom storage endpoint';
      default:
        return 'Enter cloud storage path';
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Cloud className="w-4 h-4 inline mr-2" />
        Cloud Storage Configuration
      </label>

      {/* Provider selection (if handler provided) */}
      {onProviderChange && (
        <div className="mb-3">
          <label htmlFor="cloudProvider" className="block text-xs font-medium text-gray-600 mb-1">
            Provider
          </label>
          <select
            id="cloudProvider"
            value={provider}
            onChange={(e) => onProviderChange(e.target.value as CloudProvider)}
            disabled={disabled}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
                     focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                     disabled:bg-gray-100 disabled:cursor-not-allowed"
            aria-label="Select cloud provider"
          >
            <option value="aws">AWS S3</option>
            <option value="azure">Azure Blob Storage</option>
            <option value="gcp">Google Cloud Storage</option>
            <option value="custom">Custom Endpoint</option>
          </select>
        </div>
      )}

      {/* Cloud path input */}
      <div>
        <label htmlFor="cloudPath" className="block text-xs font-medium text-gray-600 mb-1">
          Storage Path
        </label>
        <input
          type="text"
          id="cloudPath"
          value={cloudPath}
          onChange={(e) => onChange(e.target.value)}
          placeholder={getPlaceholder()}
          disabled={disabled}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
                   focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                   disabled:bg-gray-100 disabled:cursor-not-allowed"
          aria-label="Cloud storage path"
        />
        <p className="text-xs text-gray-500 mt-1">
          Specify the destination path in your cloud storage
        </p>
      </div>

      {/* Provider-specific help text */}
      {provider === 'aws' && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs text-blue-800">
            <strong>AWS S3:</strong> Ensure your IAM credentials have PutObject permissions for the specified bucket.
          </p>
        </div>
      )}

      {provider === 'azure' && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs text-blue-800">
            <strong>Azure Blob:</strong> Use the full HTTPS URL including the container name and path.
          </p>
        </div>
      )}

      {provider === 'gcp' && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs text-blue-800">
            <strong>GCP Storage:</strong> Ensure service account has write permissions to the specified bucket.
          </p>
        </div>
      )}
    </div>
  );
};

export default CloudStorage;
