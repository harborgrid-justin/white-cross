import React, { useState } from 'react'
import {
  Shield,
  Lock,
  Clock,
  Globe,
  Calendar,
  Languages,
  FileText,
  Archive,
  RotateCcw,
  Upload,
  Server,
  Save
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ConfigurationTab() {
  const [formData, setFormData] = useState({
    // Authentication
    authProvider: 'local',
    mfaEnabled: false,
    ssoEnabled: false,

    // Password Policy
    minPasswordLength: '8',
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    passwordExpireDays: '90',

    // Session
    sessionTimeout: '30',
    maxConcurrentSessions: '3',

    // API
    apiRateLimit: '100',
    apiTimeout: '30',

    // Upload
    maxFileSize: '10',
    allowedFileTypes: '.pdf,.jpg,.png,.doc,.docx',

    // Timezone
    timezone: 'America/New_York',

    // Date Format
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',

    // Language
    defaultLanguage: 'en',

    // HIPAA Compliance
    hipaaLoggingEnabled: true,
    encryptionAtRest: true,

    // Audit Logging
    auditLogRetention: '365',
    logLevel: 'info',

    // Retention
    dataRetentionDays: '2555',
    archiveEnabled: true
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Configuration saved successfully')
    } catch (error) {
      toast.error('Failed to save configuration')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      setFormData({
        authProvider: 'local',
        mfaEnabled: false,
        ssoEnabled: false,
        minPasswordLength: '8',
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        passwordExpireDays: '90',
        sessionTimeout: '30',
        maxConcurrentSessions: '3',
        apiRateLimit: '100',
        apiTimeout: '30',
        maxFileSize: '10',
        allowedFileTypes: '.pdf,.jpg,.png,.doc,.docx',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        defaultLanguage: 'en',
        hipaaLoggingEnabled: true,
        encryptionAtRest: true,
        auditLogRetention: '365',
        logLevel: 'info',
        dataRetentionDays: '2555',
        archiveEnabled: true
      })
      toast.success('Settings reset to defaults')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">System Configuration</h2>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Authentication Section */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Authentication</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Auth Provider <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.authProvider}
                onChange={(e) => handleChange('authProvider', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md required"
              >
                <option value="local">Local Authentication</option>
                <option value="ldap">LDAP</option>
                <option value="oauth">OAuth 2.0</option>
                <option value="saml">SAML</option>
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.mfaEnabled}
                  onChange={(e) => handleChange('mfaEnabled', e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">Enable Multi-Factor Authentication (MFA)</span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.ssoEnabled}
                  onChange={(e) => handleChange('ssoEnabled', e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">Enable Single Sign-On (SSO)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Password Policy Section */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Password Policy</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Password Length <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="6"
                max="32"
                value={formData.minPasswordLength}
                onChange={(e) => handleChange('minPasswordLength', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md required"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password Expiration (days) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="30"
                max="365"
                value={formData.passwordExpireDays}
                onChange={(e) => handleChange('passwordExpireDays', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md required"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Password Requirements:</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requireUppercase}
                  onChange={(e) => handleChange('requireUppercase', e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Require uppercase letters</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requireNumbers}
                  onChange={(e) => handleChange('requireNumbers', e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Require numbers</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requireSpecialChars}
                  onChange={(e) => handleChange('requireSpecialChars', e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Require special characters</span>
              </label>
            </div>
          </div>
        </div>

        {/* Session Timeout Section */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Session Timeout</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session Timeout (minutes) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="5"
                max="480"
                value={formData.sessionTimeout}
                onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md required"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Concurrent Sessions
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.maxConcurrentSessions}
                onChange={(e) => handleChange('maxConcurrentSessions', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* API Configuration Section */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Server className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">API Endpoints</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Rate Limit (requests/minute) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="10"
                max="1000"
                value={formData.apiRateLimit}
                onChange={(e) => handleChange('apiRateLimit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md required"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Timeout (seconds)
              </label>
              <input
                type="number"
                min="10"
                max="300"
                value={formData.apiTimeout}
                onChange={(e) => handleChange('apiTimeout', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">File Upload Settings</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum File Size (MB) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                max="100"
                value={formData.maxFileSize}
                onChange={(e) => handleChange('maxFileSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md required"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Allowed File Types
              </label>
              <input
                type="text"
                value={formData.allowedFileTypes}
                onChange={(e) => handleChange('allowedFileTypes', e.target.value)}
                placeholder=".pdf,.jpg,.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Timezone Section */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Time Zone</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Timezone <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md required"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="America/Phoenix">Arizona (MST)</option>
                <option value="America/Anchorage">Alaska Time (AKT)</option>
                <option value="Pacific/Honolulu">Hawaii Time (HST)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
        </div>

        {/* Date Format Section */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Date Format</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Format <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.dateFormat}
                onChange={(e) => handleChange('dateFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md required"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY (UK)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                <option value="DD.MM.YYYY">DD.MM.YYYY (EU)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Format
              </label>
              <select
                value={formData.timeFormat}
                onChange={(e) => handleChange('timeFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="12h">12-hour (AM/PM)</option>
                <option value="24h">24-hour</option>
              </select>
            </div>
          </div>
        </div>

        {/* Language Section */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Languages className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Language & Locale</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Language <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.defaultLanguage}
                onChange={(e) => handleChange('defaultLanguage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md required"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
          </div>
        </div>

        {/* HIPAA Compliance Section */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">HIPAA Compliance</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hipaaLoggingEnabled}
                onChange={(e) => handleChange('hipaaLoggingEnabled', e.target.checked)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">Enable HIPAA Audit Logging</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.encryptionAtRest}
                onChange={(e) => handleChange('encryptionAtRest', e.target.checked)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">Enable Encryption at Rest</span>
            </label>
            <p className="text-sm text-gray-500 mt-2">
              HIPAA compliance settings ensure all Protected Health Information (PHI) is properly secured and audited.
            </p>
          </div>
        </div>

        {/* Audit Logging Section */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Audit Logging</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Audit Log Retention (days) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="90"
                max="3650"
                value={formData.auditLogRetention}
                onChange={(e) => handleChange('auditLogRetention', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md required"
              />
              <p className="text-xs text-gray-500 mt-1">HIPAA requires minimum 6 years (2190 days)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Log Level
              </label>
              <select
                value={formData.logLevel}
                onChange={(e) => handleChange('logLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="debug">Debug (Verbose)</option>
                <option value="info">Info (Standard)</option>
                <option value="warn">Warning (Important)</option>
                <option value="error">Error (Critical Only)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Retention Section */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Archive className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Data Retention & Archive</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Retention Period (days) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="365"
                max="7300"
                value={formData.dataRetentionDays}
                onChange={(e) => handleChange('dataRetentionDays', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md required"
              />
              <p className="text-xs text-gray-500 mt-1">Healthcare records typically retain for 7 years (2555 days)</p>
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer mt-7">
                <input
                  type="checkbox"
                  checked={formData.archiveEnabled}
                  onChange={(e) => handleChange('archiveEnabled', e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">Enable Automatic Archiving</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <button
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {loading ? 'Saving...' : 'Apply Changes'}
        </button>
      </div>
    </div>
  )
}
