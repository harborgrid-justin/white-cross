/**
 * @fileoverview Appearance Settings Page
 * @module app/(dashboard)/settings/appearance
 * @category Settings
 *
 * Theme, layout, and visual customization settings for the healthcare platform.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Appearance Settings | White Cross',
  description: 'Customize your theme, layout, and visual preferences',
};

export default function AppearanceSettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Appearance</h1>
        <p className="mt-1 text-sm text-gray-600">
          Customize how White Cross looks and feels for you
        </p>
      </div>

      {/* Theme */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Theme</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="relative border-2 border-blue-500 rounded-lg p-4 cursor-pointer">
            <div className="absolute top-2 right-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            </div>
            <div className="bg-white h-16 rounded border mb-2"></div>
            <p className="text-sm font-medium text-center">Light</p>
          </div>
          
          <div className="relative border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-gray-300">
            <div className="bg-gray-800 h-16 rounded border mb-2"></div>
            <p className="text-sm font-medium text-center">Dark</p>
          </div>
          
          <div className="relative border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-gray-300">
            <div className="bg-gradient-to-br from-blue-400 to-purple-500 h-16 rounded border mb-2"></div>
            <p className="text-sm font-medium text-center">Auto</p>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Layout</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Sidebar Width</h3>
              <p className="text-sm text-gray-500">Choose the width of the navigation sidebar</p>
            </div>
            <select 
              aria-label="Sidebar width setting"
              className="text-sm border-gray-300 rounded-md"
            >
              <option>Compact</option>
              <option>Normal</option>
              <option>Wide</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Navigation Style</h3>
              <p className="text-sm text-gray-500">How navigation items are displayed</p>
            </div>
            <select 
              aria-label="Navigation style setting"
              className="text-sm border-gray-300 rounded-md"
            >
              <option>Icons with text</option>
              <option>Icons only</option>
              <option>Text only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Accessibility */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Accessibility</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">High Contrast Mode</h3>
              <p className="text-sm text-gray-500">Increase contrast for better visibility</p>
            </div>
            <input 
              type="checkbox" 
              aria-label="Enable high contrast mode"
              className="h-4 w-4 text-blue-600 rounded" 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Reduce Motion</h3>
              <p className="text-sm text-gray-500">Minimize animations and transitions</p>
            </div>
            <input 
              type="checkbox" 
              aria-label="Reduce motion animations"
              className="h-4 w-4 text-blue-600 rounded" 
            />
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Font Size</h3>
            <p className="text-sm text-gray-500 mb-3">Adjust text size for better readability</p>
            <select 
              aria-label="Font size setting"
              className="text-sm border-gray-300 rounded-md"
            >
              <option>Small</option>
              <option>Normal</option>
              <option>Large</option>
              <option>Extra Large</option>
            </select>
          </div>
        </div>
      </div>

      {/* Healthcare-Specific */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Healthcare Display</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Medication Alerts</h3>
              <p className="text-sm text-gray-500">Color coding for medication priorities</p>
            </div>
            <select 
              aria-label="Medication alert color scheme"
              className="text-sm border-gray-300 rounded-md"
            >
              <option>Standard</option>
              <option>High Contrast</option>
              <option>Colorblind Friendly</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Compact Data Tables</h3>
              <p className="text-sm text-gray-500">Show more information in less space</p>
            </div>
            <input 
              type="checkbox" 
              aria-label="Enable compact data tables"
              className="h-4 w-4 text-blue-600 rounded" 
              defaultChecked
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          Reset to Defaults
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </div>
  );
}