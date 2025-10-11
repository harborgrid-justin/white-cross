/**
 * Conflict Resolution Modal
 *
 * Modal for resolving conflicts between optimistic and server data.
 * Allows users to choose which version to keep or merge both.
 *
 * @module ConflictResolutionModal
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  optimisticUpdateManager,
  ConflictResolution,
  ConflictResolutionStrategy,
} from '@/utils/optimisticUpdates';

// =====================
// TYPES
// =====================

export interface ConflictResolutionModalProps {
  /** Whether modal is open */
  isOpen: boolean;

  /** Close modal callback */
  onClose: () => void;

  /** Callback after resolution */
  onResolved?: () => void;

  /** Auto-show conflicts when detected */
  autoShow?: boolean;
}

// =====================
// COMPONENT
// =====================

/**
 * ConflictResolutionModal - Resolve data conflicts
 *
 * @example
 * ```tsx
 * <ConflictResolutionModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   autoShow={true}
 * />
 * ```
 */
export const ConflictResolutionModal: React.FC<ConflictResolutionModalProps> = ({
  isOpen: controlledIsOpen,
  onClose,
  onResolved,
  autoShow = true,
}) => {
  const queryClient = useQueryClient();
  const [conflicts, setConflicts] = useState<ConflictResolution[]>([]);
  const [currentConflictIndex, setCurrentConflictIndex] = useState(0);
  const [selectedResolution, setSelectedResolution] = useState<'server' | 'client' | 'merged'>(
    'server'
  );
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  useEffect(() => {
    // Check for conflicts periodically
    const checkConflicts = () => {
      const detectedConflicts = optimisticUpdateManager.getConflicts();
      if (detectedConflicts.length > 0 && autoShow) {
        setConflicts(detectedConflicts);
        setInternalIsOpen(true);
      }
    };

    // Initial check
    checkConflicts();

    // Subscribe to update changes
    const unsubscribe = optimisticUpdateManager.subscribe(() => {
      checkConflicts();
    });

    return () => {
      unsubscribe();
    };
  }, [autoShow]);

  const currentConflict = conflicts[currentConflictIndex];

  const handleResolve = () => {
    if (!currentConflict) return;

    // Resolve the conflict
    optimisticUpdateManager.resolveConflict(
      queryClient,
      currentConflict.update.id,
      selectedResolution,
      selectedResolution === 'merged' ? currentConflict.mergedData : undefined
    );

    // Move to next conflict or close
    if (currentConflictIndex < conflicts.length - 1) {
      setCurrentConflictIndex(currentConflictIndex + 1);
      setSelectedResolution('server'); // Reset selection
    } else {
      handleClose();
    }

    onResolved?.();
  };

  const handleSkip = () => {
    if (currentConflictIndex < conflicts.length - 1) {
      setCurrentConflictIndex(currentConflictIndex + 1);
      setSelectedResolution('server');
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setInternalIsOpen(false);
    setConflicts([]);
    setCurrentConflictIndex(0);
    setSelectedResolution('server');
    onClose?.();
  };

  if (!isOpen || !currentConflict) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleClose} />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-orange-500 text-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ConflictIcon className="w-6 h-6" />
                <div>
                  <h3 className="text-lg font-semibold">Data Conflict Detected</h3>
                  <p className="text-sm text-orange-100">
                    The data has changed on the server. Choose which version to keep.
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:text-orange-100 transition-colors"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            {conflicts.length > 1 && (
              <div className="mt-3 text-sm text-orange-100">
                Conflict {currentConflictIndex + 1} of {conflicts.length}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-2 gap-6">
              {/* Server Version */}
              <div>
                <label className="flex items-center gap-2 mb-3 cursor-pointer">
                  <input
                    type="radio"
                    name="resolution"
                    value="server"
                    checked={selectedResolution === 'server'}
                    onChange={() => setSelectedResolution('server')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="font-semibold text-gray-900">Server Version (Latest)</span>
                </label>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <DataPreview data={currentConflict.serverData} />
                </div>
              </div>

              {/* Client Version */}
              <div>
                <label className="flex items-center gap-2 mb-3 cursor-pointer">
                  <input
                    type="radio"
                    name="resolution"
                    value="client"
                    checked={selectedResolution === 'client'}
                    onChange={() => setSelectedResolution('client')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="font-semibold text-gray-900">Your Version</span>
                </label>
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <DataPreview data={currentConflict.clientData} />
                </div>
              </div>
            </div>

            {/* Merged Version (if available) */}
            {currentConflict.mergedData &&
              currentConflict.strategy === ConflictResolutionStrategy.MERGE && (
                <div className="mt-6">
                  <label className="flex items-center gap-2 mb-3 cursor-pointer">
                    <input
                      type="radio"
                      name="resolution"
                      value="merged"
                      checked={selectedResolution === 'merged'}
                      onChange={() => setSelectedResolution('merged')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="font-semibold text-gray-900">Merged Version (Recommended)</span>
                  </label>
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                    <DataPreview data={currentConflict.mergedData} />
                  </div>
                </div>
              )}

            {/* Conflict Details */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Conflict Details</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>
                  <span className="font-medium">Operation:</span>{' '}
                  {currentConflict.update.operationType}
                </div>
                <div>
                  <span className="font-medium">Detected:</span>{' '}
                  {new Date(currentConflict.detectedAt).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Resource:</span>{' '}
                  {currentConflict.update.queryKey.join(' > ')}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Skip
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResolve}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {currentConflictIndex < conflicts.length - 1 ? 'Resolve & Next' : 'Resolve'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================
// DATA PREVIEW COMPONENT
// =====================

const DataPreview: React.FC<{ data: any }> = ({ data }) => {
  // Render sensitive fields carefully (HIPAA compliance)
  const renderValue = (key: string, value: any): React.ReactNode => {
    // Mask sensitive fields
    const sensitiveFields = ['ssn', 'taxId', 'password', 'token'];
    if (sensitiveFields.includes(key.toLowerCase())) {
      return '••••••••';
    }

    // Format dates
    if (key.includes('At') || key.includes('Date')) {
      try {
        return new Date(value).toLocaleString();
      } catch {
        return value;
      }
    }

    // Format booleans
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    // Format null/undefined
    if (value === null || value === undefined) {
      return <span className="text-gray-400 italic">Not set</span>;
    }

    // Format objects
    if (typeof value === 'object') {
      return <code className="text-xs">{JSON.stringify(value, null, 2)}</code>;
    }

    return String(value);
  };

  const entries = Object.entries(data).filter(
    ([key]) => !['id', 'createdAt', 'updatedAt', '__typename'].includes(key)
  );

  return (
    <div className="space-y-2 text-sm">
      {entries.map(([key, value]) => (
        <div key={key} className="flex gap-2">
          <span className="font-medium text-gray-700 min-w-[120px]">
            {key.replace(/([A-Z])/g, ' $1').trim()}:
          </span>
          <span className="text-gray-900 break-all">{renderValue(key, value)}</span>
        </div>
      ))}
    </div>
  );
};

// =====================
// ICONS
// =====================

const ConflictIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
    />
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// =====================
// HOOK FOR CONFLICT HANDLING
// =====================

/**
 * Hook for handling conflicts in components
 */
export function useConflictResolution() {
  const [hasConflicts, setHasConflicts] = useState(false);
  const [conflictCount, setConflictCount] = useState(0);

  useEffect(() => {
    const checkConflicts = () => {
      const conflicts = optimisticUpdateManager.getConflicts();
      setHasConflicts(conflicts.length > 0);
      setConflictCount(conflicts.length);
    };

    checkConflicts();

    const unsubscribe = optimisticUpdateManager.subscribe(() => {
      checkConflicts();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    hasConflicts,
    conflictCount,
    conflicts: optimisticUpdateManager.getConflicts(),
  };
}
