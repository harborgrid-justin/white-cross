/**
 * WF-IDX-299 | index.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./components/SettingsHeader, ./components/SettingsTabs, ./hooks/useSystemHealth | Dependencies: ./components/SettingsHeader, ./components/SettingsTabs, ./hooks/useSystemHealth
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: useState, component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Settings Page - Enterprise Implementation
 *
 * Administration panel with:
 * - Multi-district and multi-school management
 * - User and role management
 * - System configuration
 * - Integration management
 * - Monitoring and audit logging
 *
 * @module pages/Settings
 */

import React, { useState } from 'react'
import { SettingsHeader } from './components/SettingsHeader'
import { SettingsTabs } from './components/SettingsTabs'
import { useSystemHealth } from './hooks/useSystemHealth'
import OverviewTab from '../../components/settings/tabs/OverviewTab'
import DistrictsTab from '../../components/settings/tabs/DistrictsTab'
import SchoolsTab from '../../components/settings/tabs/SchoolsTab'
import UsersTab from '../../components/settings/tabs/UsersTab'
import ConfigurationTab from '../../components/settings/tabs/ConfigurationTab'
import IntegrationsTab from '../../components/settings/tabs/IntegrationsTab'
import BackupsTab from '../../components/settings/tabs/BackupsTab'
import MonitoringTab from '../../components/settings/tabs/MonitoringTab'
import LicensesTab from '../../components/settings/tabs/LicensesTab'
import TrainingTab from '../../components/settings/tabs/TrainingTab'
import AuditLogsTab from '../../components/settings/tabs/AuditLogsTab'
import type { SettingsTab } from './types'

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('overview')
  const { systemHealth, loading } = useSystemHealth(activeTab)

  return (
    <div className="space-y-6">
      {/* Header */}
      <SettingsHeader />

      {/* Tab Navigation */}
      <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'districts' && <DistrictsTab />}
        {activeTab === 'schools' && <SchoolsTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'config' && <ConfigurationTab />}
        {activeTab === 'integrations' && <IntegrationsTab />}
        {activeTab === 'backups' && <BackupsTab />}
        {activeTab === 'monitoring' && (
          <MonitoringTab health={systemHealth} loading={loading} />
        )}
        {activeTab === 'licenses' && <LicensesTab />}
        {activeTab === 'training' && <TrainingTab />}
        {activeTab === 'audit' && <AuditLogsTab />}
      </div>
    </div>
  )
}
