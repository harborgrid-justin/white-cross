/**
 * @fileoverview Preferences Component - User preferences and settings management
 * @module app/(dashboard)/profile/_components/Preferences
 * @category Profile - Components
 */

'use client';

import { useState } from 'react';
import { Settings, Bell, Monitor, Globe, Save, RotateCcw } from 'lucide-react';

interface UserPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  desktopNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'auto';
  dateFormat: string;
  timeFormat: '12h' | '24h';
  currency: string;
  autoSave: boolean;
  defaultView: string;
  itemsPerPage: number;
}

interface PreferencesProps {
  preferences: UserPreferences;
  onUpdatePreferences: (preferences: UserPreferences) => Promise<void>;
  isUpdating?: boolean;
}

export function Preferences({
  preferences,
  onUpdatePreferences,
  isUpdating = false
}: PreferencesProps) {
  const [formData, setFormData] = useState<UserPreferences>({ ...preferences });
  const [hasChanges, setHasChanges] = useState(false);

  // Handle input changes
  const handleToggle = (field: keyof UserPreferences) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
    setHasChanges(true);
  };

  const handleSelectChange = (field: keyof UserPreferences, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  // Save preferences
  const handleSave = async () => {
    try {
      await onUpdatePreferences(formData);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      // Error handling is managed by parent component
    }
  };

  // Reset to original preferences
  const handleReset = () => {
    setFormData({ ...preferences });
    setHasChanges(false);
  };

  // Timezone options
  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'America/Phoenix', label: 'Arizona Time (MST)' },
    { value: 'America/Anchorage', label: 'Alaska Time (AKST)' },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time (HST)' },
    { value: 'UTC', label: 'UTC' }
  ];

  // Language options
  const languages = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'es-ES', label: 'Español (Spain)' },
    { value: 'es-MX', label: 'Español (Mexico)' },
    { value: 'fr-FR', label: 'Français' },
    { value: 'de-DE', label: 'Deutsch' },
    { value: 'it-IT', label: 'Italiano' },
    { value: 'pt-BR', label: 'Português (Brasil)' },
    { value: 'zh-CN', label: '中文 (简体)' },
    { value: 'ja-JP', label: '日本語' }
  ];

  // Currency options
  const currencies = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'JPY', label: 'Japanese Yen (¥)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' },
    { value: 'AUD', label: 'Australian Dollar (A$)' },
    { value: 'CHF', label: 'Swiss Franc (CHF)' },
    { value: 'CNY', label: 'Chinese Yuan (¥)' }
  ];

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold">Preferences</h2>
      </div>

      <div className="space-y-8">
        {/* Notification Settings */}
        <div>
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Bell className="h-4 w-4 text-gray-600" />
            Notification Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-gray-600">Receive updates and alerts via email</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                  className="sr-only peer"
                  aria-label="Toggle email notifications"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">SMS Notifications</div>
                <div className="text-sm text-gray-600">Receive important alerts via text message</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.smsNotifications}
                  onChange={() => handleToggle('smsNotifications')}
                  className="sr-only peer"
                  aria-label="Toggle SMS notifications"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Desktop Notifications</div>
                <div className="text-sm text-gray-600">Show browser push notifications</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.desktopNotifications}
                  onChange={() => handleToggle('desktopNotifications')}
                  className="sr-only peer"
                  aria-label="Toggle desktop notifications"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Marketing Emails</div>
                <div className="text-sm text-gray-600">Receive product updates and newsletters</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.marketingEmails}
                  onChange={() => handleToggle('marketingEmails')}
                  className="sr-only peer"
                  aria-label="Toggle marketing emails"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Security Alerts</div>
                <div className="text-sm text-gray-600">Important security notifications (recommended)</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.securityAlerts}
                  onChange={() => handleToggle('securityAlerts')}
                  className="sr-only peer"
                  aria-label="Toggle security alerts"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Display & Localization */}
        <div>
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-600" />
            Display & Localization
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                id="language-select"
                value={formData.language}
                onChange={(e) => handleSelectChange('language', e.target.value)}
                className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="timezone-select" className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <select
                id="timezone-select"
                value={formData.timezone}
                onChange={(e) => handleSelectChange('timezone', e.target.value)}
                className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {timezones.map(tz => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="theme-select" className="block text-sm font-medium text-gray-700 mb-1">
                Theme
              </label>
              <select
                id="theme-select"
                value={formData.theme}
                onChange={(e) => handleSelectChange('theme', e.target.value)}
                className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>

            <div>
              <label htmlFor="currency-select" className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                id="currency-select"
                value={formData.currency}
                onChange={(e) => handleSelectChange('currency', e.target.value)}
                className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {currencies.map(curr => (
                  <option key={curr.value} value={curr.value}>{curr.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="date-format-select" className="block text-sm font-medium text-gray-700 mb-1">
                Date Format
              </label>
              <select
                id="date-format-select"
                value={formData.dateFormat}
                onChange={(e) => handleSelectChange('dateFormat', e.target.value)}
                className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="DD MMM YYYY">DD MMM YYYY</option>
              </select>
            </div>

            <div>
              <label htmlFor="time-format-select" className="block text-sm font-medium text-gray-700 mb-1">
                Time Format
              </label>
              <select
                id="time-format-select"
                value={formData.timeFormat}
                onChange={(e) => handleSelectChange('timeFormat', e.target.value)}
                className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="12h">12 Hour (AM/PM)</option>
                <option value="24h">24 Hour</option>
              </select>
            </div>
          </div>
        </div>

        {/* Application Settings */}
        <div>
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Monitor className="h-4 w-4 text-gray-600" />
            Application Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Auto-save</div>
                <div className="text-sm text-gray-600">Automatically save changes as you work</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.autoSave}
                  onChange={() => handleToggle('autoSave')}
                  className="sr-only peer"
                  aria-label="Toggle auto-save"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="default-view-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Default View
                </label>
                <select
                  id="default-view-select"
                  value={formData.defaultView}
                  onChange={(e) => handleSelectChange('defaultView', e.target.value)}
                  className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="dashboard">Dashboard</option>
                  <option value="documents">Documents</option>
                  <option value="reports">Reports</option>
                  <option value="settings">Settings</option>
                </select>
              </div>

              <div>
                <label htmlFor="items-per-page-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Items Per Page
                </label>
                <select
                  id="items-per-page-select"
                  value={formData.itemsPerPage}
                  onChange={(e) => handleSelectChange('itemsPerPage', parseInt(e.target.value))}
                  className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {hasChanges && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between">
            <button
              onClick={handleReset}
              disabled={isUpdating}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Changes
            </button>
            
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUpdating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isUpdating ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      )}

      {!hasChanges && (
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          Your preferences are up to date
        </div>
      )}
    </div>
  );
}
