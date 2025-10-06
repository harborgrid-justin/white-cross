import React, { useState, useEffect } from 'react'
import {
  Settings as SettingsIcon,
  Shield,
  Users,
  Building2,
  School,
  Database,
  Activity,
  FileKey,
  BookOpen,
  FileText,
  Plug
} from 'lucide-react'
import { administrationApi } from '../services/api'
import OverviewTab from '../components/settings/tabs/OverviewTab'
import DistrictsTab from '../components/settings/tabs/DistrictsTab'
import SchoolsTab from '../components/settings/tabs/SchoolsTab'
import UsersTab from '../components/settings/tabs/UsersTab'
import ConfigurationTab from '../components/settings/tabs/ConfigurationTab'
import IntegrationsTab from '../components/settings/tabs/IntegrationsTab'
import BackupsTab from '../components/settings/tabs/BackupsTab'
import MonitoringTab from '../components/settings/tabs/MonitoringTab'
import LicensesTab from '../components/settings/tabs/LicensesTab'
import TrainingTab from '../components/settings/tabs/TrainingTab'
import AuditLogsTab from '../components/settings/tabs/AuditLogsTab'

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
        <nav className="-mb-px flex space-x-8 overflow-x-auto" style={{ overflow: 'visible' }}>
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
