/**
 * AlertSettingsModal Component
 *
 * Modal dialog for configuring alert preferences and notification settings.
 * Provides UI for alert configuration with cancel and save actions.
 */

import React from 'react';
import type { AlertSettingsModalProps } from './medicationAlerts.types';

/**
 * AlertSettingsModal component displays settings dialog for alerts
 *
 * @param props - Component props
 * @returns JSX element representing the settings modal
 */
export function AlertSettingsModal({
  isOpen,
  onClose,
  onSave
}: AlertSettingsModalProps) {
  if (!isOpen) {
    return null;
  }

  /**
   * Handle save button click
   */
  const handleSave = () => {
    // TODO: Implement settings collection and save logic
    onSave?.({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Alert Settings</h3>
        <p className="text-sm text-gray-600 mb-4">
          Configure alert preferences and notification settings.
        </p>
        {/* Settings form would go here */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertSettingsModal;
