import React, { useState, useEffect } from 'react'
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
      const response = await integrationApi.getAll()
      setIntegrations(response.data?.integrations || [])
    } catch (error) {
      console.error('Error loading integrations:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStatistics = async () => {
    try {
      const response = await integrationApi.getStatistics()
      setStatistics(response.data?.statistics || null)
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
      await integrationApi.delete()
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
      const response = await integrationApi.testConnection()
      const result = response.data?.result
      if (result?.success) {
        toast.success(result.message || 'Connection test successful')
      } else {
        toast.error(result?.message || 'Connection test failed')
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
      const response = await integrationApi.sync()
      const result = response.data?.result
      if (result?.success) {
        toast.success(`Synced ${result.recordsSucceeded || 0} of ${result.recordsProcessed || 0} records`)
      } else {
        toast.error(`Sync completed with errors: ${result?.recordsFailed || 0} failed`)
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
      <div>
        <h2 className="text-lg font-semibold mb-2">Integrations</h2>
        <p className="text-sm text-gray-600">Configure external system integrations including SIS, EHR, API keys, and webhooks</p>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-4">
            <div className="text-sm text-gray-600">Total Integrations</div>
            <div className="text-2xl font-bold text-gray-900">{statistics.totalIntegrations}</div>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Active / Connected</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{statistics.activeIntegrations}</div>
          </div>
          <div className="card p-4">
            <div className="text-sm text-gray-600">Total Syncs / Synchronize</div>
            <div className="text-2xl font-bold text-blue-600">{statistics.syncStatistics.totalSyncs}</div>
            <div className="text-xs text-gray-500 mt-1">Last sync / updated: {statistics.lastSyncTime || 'N/A'}</div>
          </div>
          <div className="card p-4">
            <div className="text-sm text-gray-600">Success Rate</div>
            <div className="text-2xl font-bold text-gray-900">{statistics.syncStatistics.successRate}%</div>
          </div>
        </div>
      )}

      {/* Available Integrations / Integration Types */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Available Integrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900">SIS / Student Information System</h4>
            <p className="text-sm text-gray-600 mt-1">Connect to your school's student information system for automated data sync</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Status: Inactive</span>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900">EHR / Electronic Health Record</h4>
            <p className="text-sm text-gray-600 mt-1">Integrate with EHR systems for comprehensive health data management</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Status: Inactive</span>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900">API Key Management</h4>
            <p className="text-sm text-gray-600 mt-1">Manage API keys for third-party service integrations</p>
            <div className="mt-3">
              <a href="/docs" className="text-sm text-blue-600 hover:underline">View documentation</a>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900">Webhook Configuration</h4>
            <p className="text-sm text-gray-600 mt-1">Set up webhooks for real-time event notifications</p>
            <div className="mt-3">
              <a href="/docs/webhooks" className="text-sm text-blue-600 hover:underline">View documentation</a>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900">OAuth / SSO Configuration</h4>
            <p className="text-sm text-gray-600 mt-1">Configure OAuth and single sign-on authentication</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Status: Not Configured</span>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900">Integration Logs</h4>
            <p className="text-sm text-gray-600 mt-1">View integration activity logs and audit trail</p>
            <div className="mt-3">
              <button className="text-sm text-blue-600 hover:underline">View Logs</button>
            </div>
          </div>
        </div>
      </div>

      {/* Integrations List */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Configured Integrations</h3>
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
                      {testingId === integration.id ? 'Testing...' : 'Test / Verify'}
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
                      {integration.isActive ? 'Disconnect' : 'Connect'}
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
