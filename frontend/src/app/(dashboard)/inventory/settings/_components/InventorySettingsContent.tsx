'use client';

/**
 * InventorySettingsContent Component
 *
 * Configure inventory management settings and preferences.
 * Includes notifications, automation rules, and system configurations.
 *
 * @module InventorySettingsContent
 */

import React, { useState } from 'react';

export interface InventorySettings {
  notifications: {
    lowStockAlerts: boolean;
    expirationAlerts: boolean;
    expirationDaysThreshold: number;
    emailNotifications: boolean;
  };
  automation: {
    autoReorderEnabled: boolean;
    autoReorderThreshold: string;
    autoAdjustOnCount: boolean;
  };
  display: {
    defaultView: string;
    itemsPerPage: number;
    showStockValue: boolean;
  };
  security: {
    requireApprovalForAdjustments: boolean;
    requireApprovalThreshold: number;
    auditLogging: boolean;
  };
}

/**
 * Inventory settings configuration component
 *
 * @returns Rendered settings view
 */
function InventorySettingsContent() {
  const [settings, setSettings] = useState<InventorySettings>({
    notifications: {
      lowStockAlerts: true,
      expirationAlerts: true,
      expirationDaysThreshold: 30,
      emailNotifications: true,
    },
    automation: {
      autoReorderEnabled: false,
      autoReorderThreshold: 'min-level',
      autoAdjustOnCount: true,
    },
    display: {
      defaultView: 'table',
      itemsPerPage: 50,
      showStockValue: true,
    },
    security: {
      requireApprovalForAdjustments: true,
      requireApprovalThreshold: 100,
      auditLogging: true,
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Save settings to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving settings:', settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Settings</h1>
        <p className="text-gray-600 mt-2">Configure inventory management preferences and rules</p>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">Settings saved successfully!</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Low Stock Alerts</p>
                <p className="text-xs text-gray-500">Receive alerts when items reach minimum stock levels</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.lowStockAlerts}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, lowStockAlerts: e.target.checked }
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Expiration Alerts</p>
                <p className="text-xs text-gray-500">Receive alerts for items approaching expiration</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.expirationAlerts}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, expirationAlerts: e.target.checked }
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiration Alert Threshold (days)
              </label>
              <input
                type="number"
                value={settings.notifications.expirationDaysThreshold}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, expirationDaysThreshold: parseInt(e.target.value) }
                })}
                min="1"
                className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <label className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Email Notifications</p>
                <p className="text-xs text-gray-500">Send notifications via email</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.emailNotifications}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, emailNotifications: e.target.checked }
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </label>
          </div>
        </div>

        {/* Automation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Automation</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Auto-Reorder</p>
                <p className="text-xs text-gray-500">Automatically create purchase orders for low stock items</p>
              </div>
              <input
                type="checkbox"
                checked={settings.automation.autoReorderEnabled}
                onChange={(e) => setSettings({
                  ...settings,
                  automation: { ...settings.automation, autoReorderEnabled: e.target.checked }
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Auto-Reorder Threshold
              </label>
              <select
                value={settings.automation.autoReorderThreshold}
                onChange={(e) => setSettings({
                  ...settings,
                  automation: { ...settings.automation, autoReorderThreshold: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="min-level">Minimum Stock Level</option>
                <option value="reorder-point">Reorder Point</option>
              </select>
            </div>

            <label className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Auto-Adjust on Physical Count</p>
                <p className="text-xs text-gray-500">Automatically adjust stock after physical counts</p>
              </div>
              <input
                type="checkbox"
                checked={settings.automation.autoAdjustOnCount}
                onChange={(e) => setSettings({
                  ...settings,
                  automation: { ...settings.automation, autoAdjustOnCount: e.target.checked }
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </label>
          </div>
        </div>

        {/* Display Preferences */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Display Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default View
              </label>
              <select
                value={settings.display.defaultView}
                onChange={(e) => setSettings({
                  ...settings,
                  display: { ...settings.display, defaultView: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="table">Table View</option>
                <option value="grid">Grid View</option>
                <option value="compact">Compact List</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Items Per Page
              </label>
              <select
                value={settings.display.itemsPerPage}
                onChange={(e) => setSettings({
                  ...settings,
                  display: { ...settings.display, itemsPerPage: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
            </div>

            <label className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Show Stock Value</p>
                <p className="text-xs text-gray-500">Display monetary value of inventory</p>
              </div>
              <input
                type="checkbox"
                checked={settings.display.showStockValue}
                onChange={(e) => setSettings({
                  ...settings,
                  display: { ...settings.display, showStockValue: e.target.checked }
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Security & Compliance</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Require Approval for Adjustments</p>
                <p className="text-xs text-gray-500">Large adjustments need supervisor approval</p>
              </div>
              <input
                type="checkbox"
                checked={settings.security.requireApprovalForAdjustments}
                onChange={(e) => setSettings({
                  ...settings,
                  security: { ...settings.security, requireApprovalForAdjustments: e.target.checked }
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Approval Threshold (quantity)
              </label>
              <input
                type="number"
                value={settings.security.requireApprovalThreshold}
                onChange={(e) => setSettings({
                  ...settings,
                  security: { ...settings.security, requireApprovalThreshold: parseInt(e.target.value) }
                })}
                min="1"
                className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <label className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Audit Logging</p>
                <p className="text-xs text-gray-500">Log all inventory transactions for compliance</p>
              </div>
              <input
                type="checkbox"
                checked={settings.security.auditLogging}
                onChange={(e) => setSettings({
                  ...settings,
                  security: { ...settings.security, auditLogging: e.target.checked }
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

// Export both named and default for flexibility
export { InventorySettingsContent }
export default InventorySettingsContent
