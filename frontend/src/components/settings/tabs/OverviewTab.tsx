import React from 'react'
import {
  Building2,
  School,
  Users,
  Shield,
  Database,
  Activity,
  FileKey,
  BookOpen,
  FileText
} from 'lucide-react'

export default function OverviewTab() {
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
