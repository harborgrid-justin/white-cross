'use client';

/**
 * MedicationSettings Component
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select } from '@/components/ui/select';

export interface MedicationSettingsData {
  enableNotifications: boolean;
  notificationLeadTime: number;
  enableInventoryTracking: boolean;
  lowStockThreshold: number;
  requireWitnessForControlled: boolean;
  enableAdherenceTracking: boolean;
  defaultTimezone: string;
}

export interface MedicationSettingsProps {
  settings: MedicationSettingsData;
  onSave: (settings: MedicationSettingsData) => Promise<void> | void;
  isLoading?: boolean;
}

export const MedicationSettings: React.FC<MedicationSettingsProps> = ({
  settings: initialSettings,
  onSave,
  isLoading = false,
}) => {
  const [settings, setSettings] = useState(initialSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = <K extends keyof MedicationSettingsData>(
    key: K,
    value: MedicationSettingsData[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    await onSave(settings);
    setHasChanges(false);
  };

  const handleReset = () => {
    setSettings(initialSettings);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Medication Settings</h2>
        <p className="text-sm text-gray-600 mt-1">Configure medication management preferences</p>
      </div>

      {/* Notifications */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={settings.enableNotifications}
              onChange={(e) => updateSetting('enableNotifications', e.target.checked)}
            />
            <label className="text-sm font-medium text-gray-700">
              Enable medication administration notifications
            </label>
          </div>

          {settings.enableNotifications && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notification Lead Time (minutes)
              </label>
              <Input
                type="number"
                min="0"
                value={settings.notificationLeadTime}
                onChange={(e) => updateSetting('notificationLeadTime', parseInt(e.target.value) || 0)}
                className="max-w-xs"
              />
              <p className="text-xs text-gray-500 mt-1">
                Send notifications this many minutes before scheduled administration
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Inventory */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Management</h3>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={settings.enableInventoryTracking}
              onChange={(e) => updateSetting('enableInventoryTracking', e.target.checked)}
            />
            <label className="text-sm font-medium text-gray-700">Enable inventory tracking</label>
          </div>

          {settings.enableInventoryTracking && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Low Stock Alert Threshold
              </label>
              <Input
                type="number"
                min="0"
                value={settings.lowStockThreshold}
                onChange={(e) => updateSetting('lowStockThreshold', parseInt(e.target.value) || 0)}
                className="max-w-xs"
              />
              <p className="text-xs text-gray-500 mt-1">Alert when stock falls below this number</p>
            </div>
          )}
        </div>
      </div>

      {/* Compliance */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance & Safety</h3>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={settings.requireWitnessForControlled}
              onChange={(e) => updateSetting('requireWitnessForControlled', e.target.checked)}
            />
            <label className="text-sm font-medium text-gray-700">
              Require witness for controlled substance administration
            </label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={settings.enableAdherenceTracking}
              onChange={(e) => updateSetting('enableAdherenceTracking', e.target.checked)}
            />
            <label className="text-sm font-medium text-gray-700">Enable adherence tracking</label>
          </div>
        </div>
      </div>

      {/* General */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">General</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Default Timezone</label>
          <Select
            value={settings.defaultTimezone}
            onChange={(e) => updateSetting('defaultTimezone', e.target.value)}
            className="max-w-xs"
          >
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
          </Select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <Button variant="outline" onClick={handleReset} disabled={!hasChanges || isLoading}>
          Reset
        </Button>
        <Button variant="default" onClick={handleSave} loading={isLoading} disabled={!hasChanges}>
          Save Settings
        </Button>
      </div>
    </div>
  );
};

MedicationSettings.displayName = 'MedicationSettings';

export default MedicationSettings;



