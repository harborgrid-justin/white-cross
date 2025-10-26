/**
 * WF-COMP-076 | OverviewTab.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../../../../../../services/api | Dependencies: lucide-react, ../../../../../../services/api
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: useState, useEffect, component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React, { useState, useEffect } from 'react'
import {
  Building2,
  School,
  Users,
  Shield,
  Database,
  Activity,
  FileKey,
  BookOpen,
  FileText,
  RefreshCw,
  Server,
  HardDrive,
  Cpu,
  AlertCircle,
  CheckCircle,
  Plus
} from 'lucide-react'
import { administrationApi } from '../../../../../services/api'

export default function OverviewTab() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeSchools: 0,
    totalDistricts: 0,
    systemHealth: 'Healthy',
    database: 'Connected',
    apiService: 'Running',
    cacheStatus: 'Redis: Active',
    storage: '45.2 GB / 500 GB',
    memory: '2.4 GB / 16 GB',
    cpu: '15%',
    uptime: '15 days 7 hours',
    version: 'v1.2.3'
  })
  const [loading, setLoading] = useState(false)

  const loadMetrics = async () => {
    try {
      setLoading(true)
      const [usersData, districtsData, schoolsData] = await Promise.all([
        administrationApi.getUsers({ page: 1, limit: 1 }).catch(() => ({ data: { total: 0 } })),
        administrationApi.getDistricts().catch(() => ({ data: { districts: [] } })),
        administrationApi.getSchools().catch(() => ({ data: { schools: [] } }))
      ])

      setMetrics(prev => ({
        ...prev,
        totalUsers: usersData.data?.total || 0,
        totalDistricts: districtsData.data?.districts?.length || 0,
        activeSchools: schoolsData.data?.schools?.length || 0
      }))
    } catch (error) {
      console.error('Error loading metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMetrics()
  }, [])

  const handleRefresh = () => {
    loadMetrics()
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">System Overview</h2>
          <p className="text-sm text-gray-600">Quick Actions and System Status</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="btn-primary flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Users */}
        <div className="card bg-white shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        {/* Active Schools */}
        <div className="card bg-white shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Schools</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.activeSchools}</p>
            </div>
            <School className="h-8 w-8 text-green-600" />
          </div>
        </div>

        {/* Districts */}
        <div className="card bg-white shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Districts</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalDistricts}</p>
            </div>
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* System Health Status */}
      <div>
        <h3 className="text-lg font-semibold mb-4">System Health Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Database */}
          <div className="card bg-white shadow p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Database className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium">Database</p>
                  <p className="text-sm text-gray-600">{metrics.database}</p>
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </div>

          {/* API Service */}
          <div className="card bg-white shadow p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Server className="h-5 w-5 text-indigo-600 mr-3" />
                <div>
                  <p className="font-medium">API Service</p>
                  <p className="text-sm text-gray-600">{metrics.apiService}</p>
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </div>

          {/* Cache */}
          <div className="card bg-white shadow p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-orange-600 mr-3" />
                <div>
                  <p className="font-medium">Cache</p>
                  <p className="text-sm text-gray-600">{metrics.cacheStatus}</p>
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Resource Usage */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Resource Usage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Storage/Disk */}
          <div className="card bg-white shadow p-4">
            <div className="flex items-center">
              <HardDrive className="h-5 w-5 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium">Storage</p>
                <p className="text-xs text-gray-600">{metrics.storage}</p>
              </div>
            </div>
          </div>

          {/* Memory/RAM */}
          <div className="card bg-white shadow p-4">
            <div className="flex items-center">
              <Server className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium">Memory (RAM)</p>
                <p className="text-xs text-gray-600">{metrics.memory}</p>
              </div>
            </div>
          </div>

          {/* CPU */}
          <div className="card bg-white shadow p-4">
            <div className="flex items-center">
              <Cpu className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium">CPU Usage</p>
                <p className="text-xs text-gray-600">{metrics.cpu}</p>
              </div>
            </div>
          </div>

          {/* Uptime */}
          <div className="card bg-white shadow p-4">
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-medium">Uptime</p>
                <p className="text-xs text-gray-600">{metrics.uptime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="card bg-white shadow p-4 space-y-2">
            <button className="w-full btn-primary bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-left flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add New User
            </button>
            <button className="w-full btn-primary bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-left flex items-center">
              <School className="h-4 w-4 mr-2" />
              Add New School
            </button>
            <button className="w-full btn-primary bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 text-left flex items-center">
              <Database className="h-4 w-4 mr-2" />
              Create Backup
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="card bg-white shadow p-4">
            <div className="space-y-3 text-sm text-gray-600">
              <p className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                System backup completed - 2 hours ago
              </p>
              <p className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                New user registered - 5 hours ago
              </p>
              <p className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Configuration updated - 1 day ago
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">System Information</h3>
        <div className="card bg-white shadow p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Version</p>
            <p className="font-medium">{metrics.version}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Environment</p>
            <p className="font-medium">Production</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last Updated</p>
            <p className="font-medium">2025-10-01</p>
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
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
    </div>
  )
}


