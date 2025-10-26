/**
 * Medications Main Page Component
 * Purpose: Primary entry point for medication management
 * Features: Dashboard view with tabs, routing, and comprehensive medication oversight
 *
 * This component serves as the main container for all medication-related functionality,
 * providing role-based access control and a unified interface for healthcare staff.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../stores/reduxStore';
import { ProtectedRoute } from '../../routes';

// Tab Components
import MedicationsOverviewTab from './components/tabs/MedicationsOverviewTab';
import MedicationsListTab from './components/tabs/MedicationsListTab';
import MedicationsInventoryTab from './components/tabs/MedicationsInventoryTab';
import MedicationsRemindersTab from './components/tabs/MedicationsRemindersTab';
import MedicationsAdverseReactionsTab from './components/tabs/MedicationsAdverseReactionsTab';

/**
 * Available tabs in the medications interface
 */
type MedicationTab = 'overview' | 'list' | 'inventory' | 'reminders' | 'adverse-reactions';

interface TabConfig {
  id: MedicationTab;
  label: string;
  icon: string;
  component: React.ComponentType;
  requiredRoles: string[];
}

/**
 * Tab configuration with role-based access control
 */
const TABS: TabConfig[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: '📊',
    component: MedicationsOverviewTab,
    requiredRoles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']
  },
  {
    id: 'list',
    label: 'Medications',
    icon: '💊',
    component: MedicationsListTab,
    requiredRoles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'COUNSELOR']
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: '📦',
    component: MedicationsInventoryTab,
    requiredRoles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN']
  },
  {
    id: 'reminders',
    label: 'Reminders',
    icon: '⏰',
    component: MedicationsRemindersTab,
    requiredRoles: ['ADMIN', 'NURSE']
  },
  {
    id: 'adverse-reactions',
    label: 'Adverse Reactions',
    icon: '⚠️',
    component: MedicationsAdverseReactionsTab,
    requiredRoles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN']
  }
];

/**
 * Medications Main Component
 *
 * Provides a tabbed interface for comprehensive medication management
 * with role-based access control and real-time updates.
 *
 * @example
 * ```tsx
 * <Medications />
 * ```
 */
const Medications: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth?.user);

  // Determine initial tab from URL query params or default to overview
  const getInitialTab = (): MedicationTab => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab') as MedicationTab | null;
    return tabParam && TABS.find(t => t.id === tabParam) ? tabParam : 'overview';
  };

  const [activeTab, setActiveTab] = useState<MedicationTab>(getInitialTab());
  const [stats, setStats] = useState({
    totalActive: 0,
    dueToday: 0,
    lowStock: 0,
    alerts: 0
  });

  // Update URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set('tab', activeTab);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [activeTab, navigate, location.pathname]);

  // Sync activeTab with URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab') as MedicationTab | null;
    if (tabParam && tabParam !== activeTab && TABS.find(t => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  /**
   * Check if user has access to a specific tab
   */
  const hasTabAccess = (tab: TabConfig): boolean => {
    if (!user || !user.role) return false;
    return tab.requiredRoles.includes(user.role);
  };

  /**
   * Get accessible tabs for current user
   */
  const accessibleTabs = TABS.filter(hasTabAccess);

  /**
   * Handle tab change with access control
   */
  const handleTabChange = (tabId: MedicationTab) => {
    const tab = TABS.find(t => t.id === tabId);
    if (tab && hasTabAccess(tab)) {
      setActiveTab(tabId);
    }
  };

  /**
   * Get the component for the active tab
   */
  const getActiveComponent = (): React.ComponentType => {
    const activeTabConfig = TABS.find(t => t.id === activeTab);
    return activeTabConfig?.component || MedicationsOverviewTab;
  };

  const ActiveComponent = getActiveComponent();

  // If user has no access to any tabs, show access denied
  if (accessibleTabs.length === 0) {
    return (
      <div className="medications-page">
        <div className="access-denied">
          <div className="access-denied-icon">🔒</div>
          <h2>Access Denied</h2>
          <p>You do not have permission to access medication management.</p>
          <p className="text-muted">Please contact your administrator for access.</p>
        </div>
      </div>
    );
  }

  // If current active tab is not accessible, switch to first accessible tab
  const currentTabAccessible = accessibleTabs.some(t => t.id === activeTab);
  if (!currentTabAccessible && accessibleTabs.length > 0) {
    setTimeout(() => setActiveTab(accessibleTabs[0].id), 0);
  }

  return (
    <div className="medications-page">
      {/* Page Header */}
      <div className="medications-header">
        <div className="header-content">
          <div className="header-title">
            <h1>💊 Medication Management</h1>
            <p className="header-subtitle">
              Comprehensive medication tracking and administration
            </p>
          </div>

          {/* Quick Stats */}
          <div className="header-stats">
            <div className="stat-item">
              <div className="stat-value">{stats.totalActive}</div>
              <div className="stat-label">Active</div>
            </div>
            <div className="stat-item highlight">
              <div className="stat-value">{stats.dueToday}</div>
              <div className="stat-label">Due Today</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.lowStock}</div>
              <div className="stat-label">Low Stock</div>
            </div>
            {stats.alerts > 0 && (
              <div className="stat-item alert">
                <div className="stat-value">{stats.alerts}</div>
                <div className="stat-label">Alerts</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="medications-tabs">
        <div className="tabs-container">
          {accessibleTabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Tab Content */}
      <div className="medications-content">
        <div className="tab-panel" role="tabpanel">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};

export default Medications;
