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
  FileText
} from 'lucide-react'
import { administrationApi } from '../services/api'
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
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: SettingsIcon },
            { id: 'districts', label: 'Districts', icon: Building2 },
            { id: 'schools', label: 'Schools', icon: School },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'config', label: 'Configuration', icon: Shield },
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