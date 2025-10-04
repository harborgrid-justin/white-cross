import React, { useState, useEffect } from 'react'
import {
  Plug
} from 'lucide-react'
import { integrationApi } from '../../../services/api'
import toast from 'react-hot-toast'
import IntegrationModal from './IntegrationModal'

export default function IntegrationsTab() {
  const [integrations, setIntegrations] = useState<any[]>([])
  const [statistics, setStatistics] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingIntegration, setEditingIntegration] = useState<any>(null)
  const [testingId, setTestingId] = useState<string | null>(null)
  const [syncingId, setSyncingId] = useState<string | null>(null)

  useEffect(() => {
    loadIntegrations()
    loadStatistics()
  }, [])

  const loadIntegrations = async () => {
    try {
      setLoading(true)
      const { integrations: data } = await integrationApi.getAll()
      setIntegrations(data || [])
    } catch (error) {
      console.error('Error loading integrations:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStatistics = async () => {
    try {
      const { statistics: stats } = await integrationApi.getStatistics()
      setStatistics(stats)
    } catch (error) {
      console.error('Error loading statistics:', error)
    }
  }

  const handleCreate = () => {
    setEditingIntegration(null)
    setShowModal(true)
  }

  const handleEdit = (integration: any) => {
    setEditingIntegration(integration)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this integration?')) return

    try {
      await integrationApi.delete(id)
      toast.success('Integration deleted successfully')
      loadIntegrations()
      loadStatistics()
    } catch (error) {
      toast.error('Failed to delete integration')
    }
  }

  const handleTestConnection = async (id: string) => {
    try {
      setTestingId(id)
      const { result } = await integrationApi.testConnection(id)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
      loadIntegrations()
    } catch (error) {
      toast.error('Connection test failed')
    } finally {
      setTestingId(null)
    }
  }

  const handleSync = async (id: string) => {
    try {
      setSyncingId(id)
      const { result } = await integrationApi.sync(id)
      if (result.success) {
        toast.success(`Synced ${result.recordsSucceeded} of ${result.recordsProcessed} records`)
      } else {
        toast.error(`Sync completed with errors: ${result.recordsFailed} failed`)
      }
      loadIntegrations()
      loadStatistics()
    } catch (error) {
      toast.error('Sync failed')
    } finally {
      setSyncingId(null)
    }
  }

  const getIntegrationTypeName = (type: string) => {
    const names: Record<string, string> = {
      'SIS': 'Student Information System',
      'EHR': 'Electronic Health Record',
      'PHARMACY': 'Pharmacy Management',
      'LABORATORY': 'Laboratory Information System',
      'INSURANCE': 'Insurance Verification',
      'PARENT_PORTAL': 'Parent Portal',
      'HEALTH_APP': 'Health Application',
      'GOVERNMENT_REPORTING': 'Government Reporting'
    }
    return names[type] || type
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'INACTIVE': 'bg-gray-100 text-gray-800',
      'ERROR': 'bg-red-100 text-red-800',
      'TESTING': 'bg-yellow-100 text-yellow-800',
      'SYNCING': 'bg-blue-100 text-blue-800'
    }
    return badges[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card">
            <div className="text-sm text-gray-600">Total Integrations</div>
            <div className="text-2xl font-bold text-gray-900">{statistics.totalIntegrations}</div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-600">Active</div>
            <div className="text-2xl font-bold text-green-600">{statistics.activeIntegrations}</div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-600">Total Syncs</div>
            <div className="text-2xl font-bold text-blue-600">{statistics.syncStatistics.totalSyncs}</div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-600">Success Rate</div>
            <div className="text-2xl font-bold text-gray-900">{statistics.syncStatistics.successRate}%</div>
          </div>
        </div>
      )}

      {/* Integrations List */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Integration Hub</h2>
          <button
            onClick={handleCreate}
            className="btn-primary"
          >
            Add Integration
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : integrations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No integrations configured yet. Click "Add Integration" to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-medium text-gray-900">{integration.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(integration.status)}`}>
                        {integration.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{getIntegrationTypeName(integration.type)}</p>
                    {integration.endpoint && (
                      <p className="text-sm text-gray-500 mt-1">{integration.endpoint}</p>
                    )}
                    {integration.lastSyncAt && (
                      <p className="text-xs text-gray-400 mt-2">
                        Last synced: {new Date(integration.lastSyncAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTestConnection(integration.id)}
                      disabled={testingId === integration.id}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                    >
                      {testingId === integration.id ? 'Testing...' : 'Test'}
                    </button>
                    <button
                      onClick={() => handleSync(integration.id)}
                      disabled={syncingId === integration.id || !integration.isActive}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                      {syncingId === integration.id ? 'Syncing...' : 'Sync'}
                    </button>
                    <button
                      onClick={() => handleEdit(integration)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(integration.id)}
                      className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <IntegrationModal
          integration={editingIntegration}
          onClose={() => {
            setShowModal(false)
            setEditingIntegration(null)
          }}
          onSave={() => {
            loadIntegrations()
            loadStatistics()
            setShowModal(false)
            setEditingIntegration(null)
          }}
        />
      )}
    </div>
  )
}
