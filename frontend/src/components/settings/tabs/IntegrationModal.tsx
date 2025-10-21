/**
 * WF-COMP-072 | IntegrationModal.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../../../services/api | Dependencies: ../../../services/api, react-hot-toast
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: useState, component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React, { useState } from 'react'
import { integrationApi } from '../../../services/api'
import toast from 'react-hot-toast'

export default function IntegrationModal({ integration, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    name: integration?.name || '',
    type: integration?.type || 'SIS',
    endpoint: integration?.endpoint || '',
    apiKey: integration?.apiKey || '',
    username: integration?.username || '',
    password: integration?.password || '',
    syncFrequency: integration?.syncFrequency || 60,
    isActive: integration?.isActive !== undefined ? integration.isActive : true
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)
      if (integration) {
        await integrationApi.update(integration.id, formData)
        toast.success('Integration updated successfully')
      } else {
        await integrationApi.create(formData)
        toast.success('Integration created successfully')
      }
      onSave()
    } catch (error) {
      toast.error(`Failed to ${integration ? 'update' : 'create'} integration`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {integration ? 'Edit Integration' : 'Add Integration'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              disabled={!!integration}
            >
              <option value="SIS">Student Information System</option>
              <option value="EHR">Electronic Health Record</option>
              <option value="PHARMACY">Pharmacy Management</option>
              <option value="LABORATORY">Laboratory Information System</option>
              <option value="INSURANCE">Insurance Verification</option>
              <option value="PARENT_PORTAL">Parent Portal</option>
              <option value="HEALTH_APP">Health Application</option>
              <option value="GOVERNMENT_REPORTING">Government Reporting</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint URL</label>
            <input
              type="url"
              value={formData.endpoint}
              onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="https://api.example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
            <input
              type="password"
              value={formData.apiKey}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter API key"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sync Frequency (minutes, leave empty for manual)
            </label>
            <input
              type="number"
              value={formData.syncFrequency || ''}
              onChange={(e) => setFormData({ ...formData, syncFrequency: parseInt(e.target.value) || undefined as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="1"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Active
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Saving...' : integration ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
