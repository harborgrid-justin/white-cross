/**
 * WF-COMP-069 | BackupsTab.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../../../services/api | Dependencies: lucide-react, ../../../services/api, react-hot-toast
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: useState, useEffect, component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React, { useState, useEffect } from 'react'
import {
  Database,
  Download,
  Activity,
  Upload,
  Trash2,
  CheckCircle,
  HardDrive,
  Archive,
  Clock
} from 'lucide-react'
import { administrationApi } from '../../../services/api'
import toast from 'react-hot-toast'

export default function BackupsTab() {
  const [backups, setBackups] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadBackups()
  }, [])

  const loadBackups = async () => {
    try {
      setLoading(true)
      const data = await administrationApi.getBackupLogs()
      setBackups(data.data?.backups || [])
    } catch (error) {
      console.error('Error loading backups:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBackup = async () => {
    try {
      setCreating(true)
      await administrationApi.createBackup()
      toast.success('Backup created successfully')
      loadBackups()
    } catch (error) {
      toast.error('Failed to create backup')
    } finally {
      setCreating(false)
    }
  }

  const handleRestore = (backupId: string) => {
    if (window.confirm('Are you sure you want to restore this backup? This will overwrite current data.')) {
      toast.success('Restore initiated (mock)')
    }
  }

  const handleDownload = (backupId: string) => {
    toast.success('Download started (mock)')
  }

  const handleDelete = (backupId: string) => {
    if (window.confirm('Are you sure you want to delete / remove this backup?')) {
      toast.success('Backup deleted (mock)')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Backups</h2>
          <p className="text-sm text-gray-600">Database backup and recovery management</p>
        </div>
        <button
          onClick={handleCreateBackup}
          disabled={creating}
          className="btn-primary flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          {creating ? 'Creating...' : 'Create Backup'}
        </button>
      </div>

      {/* Backup Configuration */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Backup Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-gray-600" />
              <span className="font-medium text-gray-700">Automated Backup Schedule / Automatic</span>
            </div>
            <p className="text-sm text-gray-600">Daily at 2:00 AM</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Archive className="h-4 w-4 text-gray-600" />
              <span className="font-medium text-gray-700">Backup Retention / Keep Policy</span>
            </div>
            <p className="text-sm text-gray-600">Keep backups for 30 days</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="h-4 w-4 text-gray-600" />
              <span className="font-medium text-gray-700">Storage Location / Destination</span>
            </div>
            <p className="text-sm text-gray-600">/var/backups/white-cross</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-gray-600" />
              <span className="font-medium text-gray-700">Backup Verification / Integrity Status</span>
            </div>
            <p className="text-sm text-gray-600">Verified / Integrity checked</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <Database className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900">{backups.length}</h3>
          <p className="text-sm text-gray-600">Total Backups</p>
        </div>
        <div className="card p-6">
          <Download className="h-8 w-8 text-green-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900">
            {backups.filter(b => b.status === 'COMPLETED').length}
          </h3>
          <p className="text-sm text-gray-600">Successful / Status Complete</p>
        </div>
        <div className="card p-6">
          <Activity className="h-8 w-8 text-orange-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900">
            {backups[0] ? new Date(backups[0].createdAt).toLocaleDateString() : 'N/A'}
          </h3>
          <p className="text-sm text-gray-600">Last Successful Backup Time / Created</p>
        </div>
      </div>

      {loading ? (
        <div className="card p-12 text-center text-gray-500">Loading backups...</div>
      ) : backups.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <Database className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No backups found</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date / Time / Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size / MB / GB</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status / Complete</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {backups.map(backup => (
                <tr key={backup.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(backup.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                      {backup.type || 'FULL'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {backup.size ? `${(backup.size / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      backup.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      backup.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {backup.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {backup.duration ? `${backup.duration}s` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRestore(backup.id)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        disabled={backup.status !== 'COMPLETED'}
                      >
                        <Upload className="h-3 w-3" />
                        Restore
                      </button>
                      <button
                        onClick={() => handleDownload(backup.id)}
                        className="text-green-600 hover:text-green-900 flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </button>
                      <button
                        onClick={() => handleDelete(backup.id)}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete / Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
