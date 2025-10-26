'use client';

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
import { useSystemHealth } from '../../../../hooks/utilities/useSystemHealth'
import OverviewTab from '../../../features/settings/components/tabs/OverviewTab'
import DistrictsTab from '../../../features/settings/components/tabs/DistrictsTab'
import SchoolsTab from '../../../features/settings/components/tabs/SchoolsTab'
import UsersTab from '../../../features/settings/components/tabs/UsersTab'
import ConfigurationTab from '../../../features/settings/components/tabs/ConfigurationTab'
import IntegrationsTab from '../../../features/settings/components/tabs/IntegrationsTab'
import BackupsTab from '../../../features/settings/components/tabs/BackupsTab'
import MonitoringTab from '../../../features/settings/components/tabs/MonitoringTab'
import LicensesTab from '../../../features/settings/components/tabs/LicensesTab'
import TrainingTab from '../../../features/settings/components/tabs/TrainingTab'
import AuditLogsTab from '../../../features/settings/components/tabs/AuditLogsTab'
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
