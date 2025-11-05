/**
 * Configuration Management Content Component - Client-side configuration form
 *
 * @module app/admin/settings/configuration/_components/ConfigurationManagementContent
 * @since 2025-11-05
 */

'use client'

import { useState, useTransition } from 'react'
import { Save, AlertTriangle, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import { updateSystemConfiguration, resetConfigurationToDefaults, type SystemConfiguration, type ConfigurationUpdateData } from '@/lib/actions/admin.configuration'

interface ConfigurationManagementContentProps {
  initialConfiguration: SystemConfiguration;
}

export default function ConfigurationManagementContent({ 
  initialConfiguration 
}: ConfigurationManagementContentProps) {
  const [configuration, setConfiguration] = useState(initialConfiguration)
  const [isPending, startTransition] = useTransition()

  const handleUpdate = (updates: Partial<ConfigurationUpdateData>) => {
    setConfiguration(prev => ({ ...prev, ...updates }))
  }

  const handleSave = () => {
    startTransition(async () => {
      try {
        const updateData: ConfigurationUpdateData = {
          sessionTimeout: configuration.sessionTimeout,
          passwordMinLength: configuration.passwordMinLength,
          passwordRequireSpecialChars: configuration.passwordRequireSpecialChars,
          maxLoginAttempts: configuration.maxLoginAttempts,
          backupFrequency: configuration.backupFrequency,
          enableAuditLogging: configuration.enableAuditLogging,
          enableEmailNotifications: configuration.enableEmailNotifications,
          enableSMSNotifications: configuration.enableSMSNotifications,
          maintenanceMode: configuration.maintenanceMode,
        }

        const result = await updateSystemConfiguration(updateData)
        
        if (result.success) {
          toast.success(result.message)
          if (result.configuration) {
            setConfiguration(result.configuration)
          }
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        console.error('Error saving configuration:', error)
        toast.error('Failed to save configuration')
      }
    })
  }

  const handleReset = () => {
    if (!confirm('Are you sure you want to reset all configuration to defaults? This action cannot be undone.')) {
      return
    }

    startTransition(async () => {
      try {
        const result = await resetConfigurationToDefaults()
        
        if (result.success) {
          toast.success(result.message)
          // Refresh the page to get updated configuration
          window.location.reload()
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        console.error('Error resetting configuration:', error)
        toast.error('Failed to reset configuration')
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">System Configuration</h2>
          <p className="text-sm text-gray-600 mt-1">Manage system-wide settings and parameters</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              min="5"
              max="480"
              value={configuration.sessionTimeout}
              onChange={(e) => handleUpdate({ sessionTimeout: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              How long users can remain idle before being logged out (5-480 minutes)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Minimum Length
            </label>
            <input
              type="number"
              min="6"
              max="32"
              value={configuration.passwordMinLength}
              onChange={(e) => handleUpdate({ passwordMinLength: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum number of characters required for passwords (6-32 characters)
            </p>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="requireSpecialChars"
              checked={configuration.passwordRequireSpecialChars}
              onChange={(e) => handleUpdate({ passwordRequireSpecialChars: e.target.checked })}
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <label htmlFor="requireSpecialChars" className="text-sm font-medium text-gray-700">
                Require special characters in passwords
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Passwords must contain at least one special character (!@#$%^&*)
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Login Attempts
            </label>
            <input
              type="number"
              min="3"
              max="10"
              value={configuration.maxLoginAttempts}
              onChange={(e) => handleUpdate({ maxLoginAttempts: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Number of failed login attempts before account lockout (3-10 attempts)
            </p>
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Backup Frequency
            </label>
            <select
              value={configuration.backupFrequency}
              onChange={(e) => handleUpdate({ backupFrequency: e.target.value as 'hourly' | 'daily' | 'weekly' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              How often automatic system backups are performed
            </p>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="enableAuditLogging"
              checked={configuration.enableAuditLogging}
              onChange={(e) => handleUpdate({ enableAuditLogging: e.target.checked })}
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <label htmlFor="enableAuditLogging" className="text-sm font-medium text-gray-700">
                Enable audit logging (HIPAA compliance)
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Required for HIPAA compliance - logs all system access and changes
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="enableEmailNotifications"
              checked={configuration.enableEmailNotifications}
              onChange={(e) => handleUpdate({ enableEmailNotifications: e.target.checked })}
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <label htmlFor="enableEmailNotifications" className="text-sm font-medium text-gray-700">
                Enable email notifications
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Send system notifications via email to administrators
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="enableSMSNotifications"
              checked={configuration.enableSMSNotifications}
              onChange={(e) => handleUpdate({ enableSMSNotifications: e.target.checked })}
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <label htmlFor="enableSMSNotifications" className="text-sm font-medium text-gray-700">
                Enable SMS notifications
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Send critical alerts via SMS to emergency contacts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Mode */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Mode</h3>
        <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-900">
              Warning: Enabling maintenance mode will prevent users from accessing the system
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Only system administrators will be able to access the application during maintenance
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="maintenanceMode"
            checked={configuration.maintenanceMode}
            onChange={(e) => handleUpdate({ maintenanceMode: e.target.checked })}
            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div>
            <label htmlFor="maintenanceMode" className="text-sm font-medium text-gray-700">
              Enable maintenance mode
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Temporarily disable user access for system maintenance
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
