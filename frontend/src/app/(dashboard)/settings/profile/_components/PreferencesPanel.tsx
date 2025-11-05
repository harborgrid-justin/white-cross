/**
 * @fileoverview User preferences panel component
 * @module app/(dashboard)/profile/_components/PreferencesPanel
 * @category Profile - Components
 */

'use client';

import { Settings, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { UserProfile } from '@/lib/actions/profile.actions';
import { ToggleSwitch } from './ui';

interface PreferencesPanelProps {
  profile: UserProfile;
  onSave: (preferences: Partial<UserProfile['preferences']>) => Promise<void>;
  disabled?: boolean;
}

/**
 * Preferences panel component
 * Manages notification settings, display preferences, and language/timezone
 *
 * @component
 * @example
 * ```tsx
 * <PreferencesPanel
 *   profile={userProfile}
 *   onSave={handleSavePreferences}
 * />
 * ```
 */
export function PreferencesPanel({ profile, onSave, disabled = false }: PreferencesPanelProps) {
  const [preferences, setPreferences] = useState(profile.preferences);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setPreferences(profile.preferences);
    setHasChanges(false);
  }, [profile]);

  const handlePreferenceChange = <K extends keyof typeof preferences>(
    key: K,
    value: typeof preferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    await onSave(preferences);
    setHasChanges(false);
  };

  const handleReset = () => {
    setPreferences(profile.preferences);
    setHasChanges(false);
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold">Preferences</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Notification Settings */}
        <div>
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notification Settings
          </h3>
          <div className="space-y-3">
            <ToggleSwitch
              checked={preferences.emailNotifications}
              onChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
              disabled={disabled}
              label="Email Notifications"
              description="Receive updates via email"
            />

            <ToggleSwitch
              checked={preferences.smsNotifications}
              onChange={(checked) => handlePreferenceChange('smsNotifications', checked)}
              disabled={disabled}
              label="SMS Notifications"
              description="Receive updates via text"
            />

            <ToggleSwitch
              checked={preferences.desktopNotifications}
              onChange={(checked) => handlePreferenceChange('desktopNotifications', checked)}
              disabled={disabled}
              label="Desktop Notifications"
              description="Show browser notifications"
            />
          </div>
        </div>

        {/* Display & Language Settings */}
        <div>
          <h3 className="font-medium mb-3">Display & Language</h3>
          <div className="space-y-3">
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                id="language"
                value={preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                disabled={disabled}
                className="w-full p-3 border rounded-lg bg-white disabled:opacity-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
                <option value="fr-FR">Français</option>
              </select>
            </div>

            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <select
                id="timezone"
                value={preferences.timezone}
                onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                disabled={disabled}
                className="w-full p-3 border rounded-lg bg-white disabled:opacity-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
              </select>
            </div>

            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                Theme
              </label>
              <select
                id="theme"
                value={preferences.theme}
                onChange={(e) => handlePreferenceChange('theme', e.target.value as 'light' | 'dark' | 'auto')}
                disabled={disabled}
                className="w-full p-3 border rounded-lg bg-white disabled:opacity-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {hasChanges && (
        <div className="mt-6 pt-6 border-t flex gap-3">
          <button
            onClick={handleSave}
            disabled={disabled}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Preferences
          </button>
          <button
            onClick={handleReset}
            disabled={disabled}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Reset Changes
          </button>
        </div>
      )}
    </div>
  );
}
