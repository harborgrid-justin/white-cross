import React, { useState, useEffect } from 'react'
import { 
  Settings as SettingsIcon, 
  Shield, 
  Users, 
  Building2, 
  School, 
  Database, 
  Activity, 
  Award, 
  FileKey,
  BookOpen,
  FileText,
  Plug
} from 'lucide-react'
import { administrationApi, integrationApi } from '../services/api'
import toast from 'react-hot-toast'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('overview')
  const [systemHealth, setSystemHealth] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'monitoring') {
      loadSystemHealth()
    }
  }, [activeTab])

  const loadSystemHealth = async () => {
    try {
      setLoading(true)
      const health = await administrationApi.getSystemHealth()
      setSystemHealth(health)
    } catch (error) {
      console.error('Error loading system health:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Administration Panel</h1>
        <p className="text-gray-600">System configuration, multi-school management, and enterprise tools</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: SettingsIcon },
            { id: 'districts', label: 'Districts', icon: Building2 },
            { id: 'schools', label: 'Schools', icon: School },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'config', label: 'Configuration', icon: Shield },
            { id: 'integrations', label: 'Integrations', icon: Plug },
            { id: 'backups', label: 'Backups', icon: Database },
            { id: 'monitoring', label: 'Monitoring', icon: Activity },
            { id: 'licenses', label: 'Licenses', icon: FileKey },
            { id: 'training', label: 'Training', icon: BookOpen },
            { id: 'audit', label: 'Audit Logs', icon: FileText },
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'districts' && <DistrictsTab />}
        {activeTab === 'schools' && <SchoolsTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'config' && <ConfigurationTab />}
        {activeTab === 'integrations' && <IntegrationsTab />}
        {activeTab === 'backups' && <BackupsTab />}
        {activeTab === 'monitoring' && <MonitoringTab health={systemHealth} loading={loading} />}
        {activeTab === 'licenses' && <LicensesTab />}
        {activeTab === 'training' && <TrainingTab />}
        {activeTab === 'audit' && <AuditLogsTab />}
      </div>
    </div>
  )
}

// Overview Tab
function OverviewTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="card p-6 hover:shadow-lg transition-shadow">
        <Building2 className="h-8 w-8 text-blue-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">District Management</h3>
        <p className="text-sm text-gray-600 mb-4">
          Manage multiple school districts with centralized control and reporting
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Multi-district support</li>
          <li>• Centralized administration</li>
          <li>• District-level reporting</li>
          <li>• Resource allocation</li>
        </ul>
      </div>

      <div className="card p-6 hover:shadow-lg transition-shadow">
        <School className="h-8 w-8 text-green-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">School Management</h3>
        <p className="text-sm text-gray-600 mb-4">
          Scalable multi-school deployment with individual school configurations
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• School profiles</li>
          <li>• Enrollment tracking</li>
          <li>• School-level settings</li>
          <li>• Staff assignment</li>
        </ul>
      </div>

      <div className="card p-6 hover:shadow-lg transition-shadow">
        <Users className="h-8 w-8 text-purple-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">User Management</h3>
        <p className="text-sm text-gray-600 mb-4">
          Comprehensive user administration with role-based access control
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• RBAC system</li>
          <li>• User provisioning</li>
          <li>• Permission management</li>
          <li>• Activity monitoring</li>
        </ul>
      </div>

      <div className="card p-6 hover:shadow-lg transition-shadow">
        <Shield className="h-8 w-8 text-red-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">System Configuration</h3>
        <p className="text-sm text-gray-600 mb-4">
          Central configuration management for security, notifications, and integrations
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Security settings</li>
          <li>• Email/SMS config</li>
          <li>• Integration settings</li>
          <li>• Feature toggles</li>
        </ul>
      </div>

      <div className="card p-6 hover:shadow-lg transition-shadow">
        <Database className="h-8 w-8 text-indigo-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Backup & Recovery</h3>
        <p className="text-sm text-gray-600 mb-4">
          Automated backup solutions with point-in-time recovery capabilities
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Automated backups</li>
          <li>• Manual backup triggers</li>
          <li>• Backup history</li>
          <li>• Restore capabilities</li>
        </ul>
      </div>

      <div className="card p-6 hover:shadow-lg transition-shadow">
        <Activity className="h-8 w-8 text-orange-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Performance Monitoring</h3>
        <p className="text-sm text-gray-600 mb-4">
          Real-time system health monitoring and performance analytics
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• System metrics</li>
          <li>• Performance dashboards</li>
          <li>• Alert management</li>
          <li>• Usage statistics</li>
        </ul>
      </div>

      <div className="card p-6 hover:shadow-lg transition-shadow">
        <FileKey className="h-8 w-8 text-yellow-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">License Management</h3>
        <p className="text-sm text-gray-600 mb-4">
          Track and manage software licenses and compliance requirements
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• License tracking</li>
          <li>• Expiration alerts</li>
          <li>• Feature enablement</li>
          <li>• Compliance reporting</li>
        </ul>
      </div>

      <div className="card p-6 hover:shadow-lg transition-shadow">
        <BookOpen className="h-8 w-8 text-teal-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Training Modules</h3>
        <p className="text-sm text-gray-600 mb-4">
          Comprehensive staff training with progress tracking and certification
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• HIPAA training</li>
          <li>• System tutorials</li>
          <li>• Progress tracking</li>
          <li>• Certifications</li>
        </ul>
      </div>

      <div className="card p-6 hover:shadow-lg transition-shadow">
        <FileText className="h-8 w-8 text-gray-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Audit Logs</h3>
        <p className="text-sm text-gray-600 mb-4">
          Comprehensive audit trails for all system activities and user actions
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• User activity logs</li>
          <li>• Data access tracking</li>
          <li>• Compliance reporting</li>
          <li>• Security monitoring</li>
        </ul>
      </div>
    </div>
  )
}

// Placeholder tabs (to be fully implemented)
function DistrictsTab() {
  return <PlaceholderTab 
    title="District Management" 
    description="Manage multiple school districts with CRUD operations, reporting, and analytics." 
  />
}

function SchoolsTab() {
  return <PlaceholderTab 
    title="School Management" 
    description="Configure and manage individual schools within districts, including enrollment and staff." 
  />
}

function UsersTab() {
  return <PlaceholderTab 
    title="User Management" 
    description="Comprehensive user administration with role-based access control and permissions." 
  />
}

function ConfigurationTab() {
  return <PlaceholderTab 
    title="System Configuration" 
    description="Centralized configuration for security, notifications, integrations, and system features." 
  />
}

function BackupsTab() {
  return <PlaceholderTab 
    title="Backup & Recovery" 
    description="Automated and manual backup management with restore capabilities." 
  />
}

function MonitoringTab({ health, loading }: { health: any; loading: boolean }) {
  if (loading) {
    return <div className="card p-6">Loading system health...</div>
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">System Health</h3>
        {health ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Total Users</div>
              <div className="text-2xl font-bold text-blue-600">{health.statistics?.totalUsers || 0}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Active Users</div>
              <div className="text-2xl font-bold text-green-600">{health.statistics?.activeUsers || 0}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Total Districts</div>
              <div className="text-2xl font-bold text-purple-600">{health.statistics?.totalDistricts || 0}</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Total Schools</div>
              <div className="text-2xl font-bold text-orange-600">{health.statistics?.totalSchools || 0}</div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No system health data available</p>
        )}
      </div>
    </div>
  )
}

function LicensesTab() {
  return <PlaceholderTab 
    title="License Management" 
    description="Track software licenses, monitor expiration dates, and manage feature access." 
  />
}

function TrainingTab() {
  return <PlaceholderTab 
    title="Training Module Management" 
    description="Create and manage training modules with progress tracking and certification." 
  />
}

function AuditLogsTab() {
  return <PlaceholderTab 
    title="Audit Logs" 
    description="Comprehensive audit trail of all system activities for compliance and security." 
  />
}

function PlaceholderTab({ title, description }: { title: string; description: string }) {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">✓ Backend API Ready:</span> Full REST API implementation is complete with all CRUD operations.
        </p>
        <p className="text-sm text-blue-800 mt-2">
          <span className="font-semibold">⚡ Next Steps:</span> Full UI implementation with data tables, forms, and interactive components.
        </p>
      </div>
    </div>
  )
}
// Integrations Tab
function IntegrationsTab() {
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

// Integration Modal Component
function IntegrationModal({ integration, onClose, onSave }: any) {
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
