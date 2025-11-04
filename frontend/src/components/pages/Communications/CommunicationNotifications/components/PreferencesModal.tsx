'use client';

import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { NotificationPreference } from '../types';
import { ChannelSettings } from './ChannelSettings';

interface PreferencesModalProps {
  isOpen: boolean;
  preferences: NotificationPreference[];
  onClose: () => void;
  onPreferenceUpdate: (prefId: string, updates: Partial<NotificationPreference>) => void;
}

/**
 * PreferencesModal component - modal dialog for managing notification preferences
 */
export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  preferences,
  onClose,
  onPreferenceUpdate
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close preferences"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {preferences.map((preference) => (
              <ChannelSettings
                key={preference.id}
                preference={preference}
                onUpdate={onPreferenceUpdate}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
