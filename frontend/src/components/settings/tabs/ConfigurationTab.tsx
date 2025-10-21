/**
 * WF-COMP-070 | ConfigurationTab.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../../../services/configurationApi | Dependencies: lucide-react, react-hot-toast, @tanstack/react-query
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: useState, useEffect, component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React, { useState, useEffect } from 'react'
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
  Save,
  Settings as SettingsIcon,
  Bell,
  Pill,
  History,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { configurationApi } from '../../../services/configurationApi'
import type { SystemConfiguration } from '../../../services/configurationApi'

type CategoryView = 'ALL' | 'GENERAL' | 'SECURITY' | 'NOTIFICATION' | 'HEALTHCARE' | 'UI' | 'PERFORMANCE'

export default function ConfigurationTab() {
  const [categoryView, setCategoryView] = useState<CategoryView>('ALL')
  const [showHistory, setShowHistory] = useState(false)
  const [selectedConfigKey, setSelectedConfigKey] = useState<string | null>(null)
  const [changedConfigs, setChangedConfigs] = useState<Map<string, string>>(new Map())
  const queryClient = useQueryClient()

  // Fetch all configurations
  const { data: configurationsResponse, isLoading, refetch } = useQuery({
    queryKey: ['configurations'],
    queryFn: () => configurationApi.getAll()
  })

  const configurations = (configurationsResponse?.data || []) as SystemConfiguration[]

  // Fetch history for selected config
  const { data: historyResponse } = useQuery({
    queryKey: ['configuration-history', selectedConfigKey],
    queryFn: () => selectedConfigKey ? configurationApi.getHistory(selectedConfigKey, 20) : null,
    enabled: !!selectedConfigKey && showHistory
  })

  const configHistory = historyResponse?.data || []

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ key, value, reason }: { key: string; value: string; reason?: string }) =>
      configurationApi.update(key, { value, changeReason: reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configurations'] })
      toast.success('Configuration updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to update configuration')
    }
  })

  // Bulk update mutation
  const bulkUpdateMutation = useMutation({
    mutationFn: ({ updates, reason }: { updates: Array<{ key: string; value: string }>; reason?: string }) =>
      configurationApi.bulkUpdate({ updates, changeReason: reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configurations'] })
      setChangedConfigs(new Map())
      toast.success('All changes saved successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to save changes')
    }
  })

  // Reset mutation
  const resetMutation = useMutation({
    mutationFn: (key: string) => configurationApi.resetToDefault(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configurations'] })
      toast.success('Configuration reset to default')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to reset configuration')
    }
  })

  // Handle value change
  const handleValueChange = (key: string, value: string) => {
    setChangedConfigs(prev => new Map(prev).set(key, value))
  }

  // Get current value (from changes or original)
  const getCurrentValue = (config: SystemConfiguration): string => {
    return changedConfigs.get(config.key) ?? config.value
  }

  // Check if config has unsaved changes
  const hasUnsavedChanges = (config: SystemConfiguration): boolean => {
    const changedValue = changedConfigs.get(config.key)
    return changedValue !== undefined && changedValue !== config.value
  }

  // Save all changes
  const handleSaveAll = () => {
    if (changedConfigs.size === 0) {
      toast('No changes to save', { icon: 'ℹ️' })
      return
    }

    const updates = Array.from(changedConfigs.entries()).map(([key, value]) => ({
      key,
      value
    }))

    bulkUpdateMutation.mutate({
      updates,
      reason: 'Bulk update from configuration panel'
    })
  }

  // Reset all changes
  const handleResetAll = () => {
    if (window.confirm('Are you sure you want to discard all unsaved changes?')) {
      setChangedConfigs(new Map())
      toast.success('All changes discarded')
    }
  }

  // Reset single config to default
  const handleResetToDefault = (config: SystemConfiguration) => {
    if (window.confirm(`Reset "${config.key}" to default value?`)) {
      resetMutation.mutate(config.key)
      setChangedConfigs(prev => {
        const newMap = new Map(prev)
        newMap.delete(config.key)
        return newMap
      })
    }
  }

  // Filter configurations by category
  const filteredConfigs = configurations.filter(config => {
    if (categoryView === 'ALL') return true
    if (categoryView === 'PERFORMANCE') {
      return config.category === 'QUERY' || config.category === 'PERFORMANCE'
    }
    return config.category === categoryView
  })

  // Group configurations by category
  const groupedConfigs = filteredConfigs.reduce((acc, config) => {
    const category = config.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(config)
    return acc
  }, {} as Record<string, SystemConfiguration[]>)

  // Render input based on value type
  const renderInput = (config: SystemConfiguration) => {
    const value = getCurrentValue(config)
    const isChanged = hasUnsavedChanges(config)
    const isDisabled = !config.isEditable

    const baseClassName = `w-full px-3 py-2 border rounded-md ${
      isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''
    } ${isChanged ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300'}`

    switch (config.valueType) {
      case 'BOOLEAN':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value === 'true' || value === '1'}
              onChange={(e) => handleValueChange(config.key, e.target.checked ? 'true' : 'false')}
              disabled={isDisabled}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-700">
              {config.description || config.key}
            </span>
            {isChanged && <span className="text-xs text-yellow-600 font-semibold">*</span>}
          </label>
        )

      case 'NUMBER':
        return (
          <div>
            <input
              type="number"
              value={value}
              onChange={(e) => handleValueChange(config.key, e.target.value)}
              disabled={isDisabled}
              min={config.minValue ?? undefined}
              max={config.maxValue ?? undefined}
              className={baseClassName}
            />
            {(config.minValue !== null || config.maxValue !== null) && (
              <p className="text-xs text-gray-500 mt-1">
                Range: {config.minValue ?? '∞'} - {config.maxValue ?? '∞'}
              </p>
            )}
          </div>
        )

      case 'ENUM':
        return (
          <select
            value={value}
            onChange={(e) => handleValueChange(config.key, e.target.value)}
            disabled={isDisabled}
            className={baseClassName}
          >
            {config.validValues?.map(val => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        )

      case 'COLOR':
        return (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value}
              onChange={(e) => handleValueChange(config.key, e.target.value)}
              disabled={isDisabled}
              className="h-10 w-20 rounded cursor-pointer"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => handleValueChange(config.key, e.target.value)}
              disabled={isDisabled}
              placeholder="#3b82f6"
              className={baseClassName}
            />
          </div>
        )

      case 'EMAIL':
        return (
          <input
            type="email"
            value={value}
            onChange={(e) => handleValueChange(config.key, e.target.value)}
            disabled={isDisabled}
            className={baseClassName}
          />
        )

      case 'URL':
        return (
          <input
            type="url"
            value={value}
            onChange={(e) => handleValueChange(config.key, e.target.value)}
            disabled={isDisabled}
            className={baseClassName}
          />
        )

      case 'JSON':
      case 'ARRAY':
        return (
          <textarea
            value={value}
            onChange={(e) => handleValueChange(config.key, e.target.value)}
            disabled={isDisabled}
            rows={3}
            className={baseClassName}
          />
        )

      default: // STRING
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleValueChange(config.key, e.target.value)}
            disabled={isDisabled}
            className={baseClassName}
          />
        )
    }
  }

  // Category icons
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'GENERAL': return SettingsIcon
      case 'SECURITY': return Shield
      case 'NOTIFICATION': return Bell
      case 'HEALTHCARE': case 'MEDICATION': case 'APPOINTMENTS': return Pill
      case 'UI': return Globe
      case 'QUERY': case 'PERFORMANCE': return Server
      case 'FILE_UPLOAD': return Upload
      case 'RATE_LIMITING': return Clock
      case 'SESSION': return Lock
      default: return FileText
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading configurations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">System Configuration</h2>
          <p className="text-sm text-gray-600">
            {changedConfigs.size > 0 && (
              <span className="text-yellow-600 font-semibold">
                {changedConfigs.size} unsaved change{changedConfigs.size !== 1 ? 's' : ''}
              </span>
            )}
            {changedConfigs.size === 0 && 'Database-driven configuration management'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          {changedConfigs.size > 0 && (
            <button
              onClick={handleResetAll}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Discard Changes
            </button>
          )}
          <button
            onClick={handleSaveAll}
            disabled={changedConfigs.size === 0 || bulkUpdateMutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {bulkUpdateMutation.isPending ? 'Saving...' : `Save All (${changedConfigs.size})`}
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['ALL', 'GENERAL', 'SECURITY', 'HEALTHCARE', 'NOTIFICATION', 'UI', 'PERFORMANCE'] as CategoryView[]).map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryView(cat)}
            className={`px-4 py-2 rounded-md whitespace-nowrap ${
              categoryView === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Quick Configuration Overview */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Configuration Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="text-gray-700">Authentication / Auth / OAuth Settings</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-green-600" />
            <span className="text-gray-700">Password Policy / Password Requirements</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-600" />
            <span className="text-gray-700">Session Timeout / Session Management</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-orange-600" />
            <span className="text-gray-700">Timezone / Time Zone Settings</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-indigo-600" />
            <span className="text-gray-700">Date Format / DateTime Format</span>
          </div>
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-cyan-600" />
            <span className="text-gray-700">Language / Locale / i18n</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-red-600" />
            <span className="text-gray-700">HIPAA Compliance / Regulatory</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-600" />
            <span className="text-gray-700">Audit Logging / Log Retention</span>
          </div>
          <div className="flex items-center gap-2">
            <Archive className="h-4 w-4 text-yellow-600" />
            <span className="text-gray-700">Data Retention / Archive Policy</span>
          </div>
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4 text-pink-600" />
            <span className="text-gray-700">File Upload / Storage Limits</span>
          </div>
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-teal-600" />
            <span className="text-gray-700">API / Backend / Server Settings</span>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-rose-600" />
            <span className="text-gray-700">Email / Notification Settings</span>
          </div>
        </div>
      </div>

      {/* Configuration groups */}
      <div className="space-y-6">
        {Object.entries(groupedConfigs).map(([category, configs]) => {
          const Icon = getCategoryIcon(category)

          return (
            <div key={category} className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Icon className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">{category.replace(/_/g, ' ')}</h3>
                <span className="text-sm text-gray-500">({configs.length})</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {configs.map(config => (
                  <div key={config.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        {config.description || config.key.replace(/_/g, ' ')}
                        {!config.isEditable && (
                          <span className="ml-2 text-xs text-gray-500">(read-only)</span>
                        )}
                        {config.requiresRestart && (
                          <span className="ml-2 text-xs text-orange-600">(requires restart)</span>
                        )}
                      </label>
                      <div className="flex gap-1">
                        {config.defaultValue && (
                          <button
                            onClick={() => handleResetToDefault(config)}
                            disabled={!config.isEditable}
                            className="text-xs text-gray-500 hover:text-blue-600"
                            title="Reset to default"
                          >
                            <RotateCcw className="h-3 w-3" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedConfigKey(config.key)
                            setShowHistory(true)
                          }}
                          className="text-xs text-gray-500 hover:text-blue-600"
                          title="View history"
                        >
                          <History className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    {renderInput(config)}
                    {config.defaultValue && (
                      <p className="text-xs text-gray-500">Default: {config.defaultValue}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* History modal */}
      {showHistory && selectedConfigKey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Configuration History: {selectedConfigKey}</h3>
              <button
                onClick={() => {
                  setShowHistory(false)
                  setSelectedConfigKey(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              {configHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No history available</p>
              ) : (
                configHistory.map((entry: any) => (
                  <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900">
                          Changed by: {entry.changedByName || entry.changedBy}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(entry.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {entry.changeReason && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {entry.changeReason}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Old Value:</p>
                        <p className="font-mono bg-gray-100 px-2 py-1 rounded">
                          {entry.oldValue || '(null)'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">New Value:</p>
                        <p className="font-mono bg-green-100 px-2 py-1 rounded">
                          {entry.newValue}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setShowHistory(false)
                  setSelectedConfigKey(null)
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom action buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        {changedConfigs.size > 0 && (
          <button
            onClick={handleResetAll}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Discard All
          </button>
        )}
        <button
          onClick={handleSaveAll}
          disabled={changedConfigs.size === 0 || bulkUpdateMutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {bulkUpdateMutation.isPending ? 'Saving...' : `Save Changes (${changedConfigs.size})`}
        </button>
      </div>
    </div>
  )
}
