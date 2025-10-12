/**
 * Settings Header Component
 *
 * Displays the admin panel header
 * @module pages/Settings/components
 */

import React from 'react'

export const SettingsHeader: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Administration Panel</h1>
      <p className="text-gray-600">
        System configuration, multi-school management, and enterprise tools
      </p>
    </div>
  )
}
