import React, { useState, useEffect } from 'react'
import {
  Database,
  Download,
  Activity
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Backup & Recovery</h2>
        <button
          onClick={handleCreateBackup}
          disabled={creating}
          className="btn-primary flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          {creating ? 'Creating...' : 'Create Backup'}
        </button>
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
          <p className="text-sm text-gray-600">Successful</p>
        </div>
        <div className="card p-6">
          <Activity className="h-8 w-8 text-orange-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900">
            {backups[0] ? new Date(backups[0].createdAt).toLocaleDateString() : 'N/A'}
          </h3>
          <p className="text-sm text-gray-600">Last Backup</p>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
