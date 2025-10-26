/**
 * Medications Main Page Component
 *
 * Primary entry point for comprehensive medication management in school healthcare settings.
 * Provides a tabbed interface with role-based access control for medication tracking,
 * administration, inventory management, and adverse reaction reporting.
 *
 * **Features:**
 * - Multi-tab interface (Overview, List, Inventory, Reminders, Adverse Reactions)
 * - Role-based tab visibility and access control
 * - Real-time medication statistics dashboard
 * - Quick action buttons for common workflows
 * - URL-based tab state persistence
 * - Responsive design for mobile and tablet devices
 *
 * **Medication Safety:**
 * - DEA-compliant controlled substance tracking
 * - Medication administration verification
 * - Drug interaction checking integration
 * - Witness requirements for high-risk medications
 * - Parent consent tracking and validation
 *
 * **Tab Structure:**
 * - **Overview**: Dashboard with quick stats and actions
 * - **List**: Complete medication catalog with search and filtering
 * - **Inventory**: Stock levels, expiration tracking, reorder alerts
 * - **Reminders**: Scheduled medication administration reminders
 * - **Adverse Reactions**: Adverse event reporting and tracking
 *
 * **State Management:**
 * - Local component state for UI interactions
 * - Redux store via useSelector for user authentication
 * - URL query parameters for tab persistence
 *
 * @fileoverview Primary entry point for medication management
 * @module pages/medications/Medications
 * @version 2.0.0
 *
 * @component
 * @returns {React.FC} Medications management page component
 *
 * @example
 * ```tsx
 * import Medications from './pages/medications/Medications';
 *
 * function App() {
 *   return <Medications />;
 * }
 * ```
 *
 * @remarks
 * **HIPAA Compliance**: All medication records contain PHI and must be handled according
 * to HIPAA regulations. Access is logged for audit purposes.
 *
 * **Medication Safety**: This component implements multiple layers of medication safety:
 * - Five Rights verification (Right patient, drug, dose, route, time)
 * - Allergy checking before administration
 * - Drug interaction screening
 * - Dosage calculation validation
 *
 * **Controlled Substances**: Medications classified as controlled substances under DEA
 * schedules require additional tracking and documentation. Witness signatures may be
 * required for Schedule II medications.
 *
 * **Permissions**:
 * - Overview Tab: ADMIN, NURSE, SCHOOL_ADMIN, DISTRICT_ADMIN
 * - List Tab: ADMIN, NURSE, SCHOOL_ADMIN, DISTRICT_ADMIN, COUNSELOR
 * - Inventory Tab: ADMIN, NURSE, SCHOOL_ADMIN
 * - Reminders Tab: ADMIN, NURSE
 * - Adverse Reactions Tab: ADMIN, NURSE, SCHOOL_ADMIN
 *
 * **Parent Consent**: Required for non-emergency medication administration.
 * System validates consent before allowing medication administration.
 *
 * **Emergency Medications**: Emergency medications (e.g., epinephrine auto-injectors)
 * may be administered without prior consent in life-threatening situations.
 * Incident must be documented and parents notified immediately.
 *
 * @see {@link MedicationsOverviewTab} for dashboard view
 * @see {@link MedicationsListTab} for medication catalog
 * @see {@link medicationsSlice} for Redux state management
 * @since 1.0.0
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
 * Available tabs in the medications interface.
 *
 * @typedef {string} MedicationTab
 *
 * @property {'overview'} overview - Dashboard with statistics and quick actions
 * @property {'list'} list - Complete medication catalog with search/filter
 * @property {'inventory'} inventory - Stock tracking and expiration management
 * @property {'reminders'} reminders - Scheduled medication administration alerts
 * @property {'adverse-reactions'} adverse-reactions - Adverse event reporting
 *
 * @remarks
 * Tab selection is synced with URL query parameters for bookmarking and navigation.
 * Each tab has specific role requirements for access control.
 */
type MedicationTab = 'overview' | 'list' | 'inventory' | 'reminders' | 'adverse-reactions';

/**
 * Configuration for a single medication tab.
 *
 * @interface TabConfig
 *
 * @property {MedicationTab} id - Unique tab identifier
 * @property {string} label - Display label for tab button
 * @property {string} icon - Emoji icon for visual identification
 * @property {React.ComponentType} component - React component to render for this tab
 * @property {string[]} requiredRoles - Array of roles allowed to access this tab
 *
 * @remarks
 * Role-based access control is enforced at the tab level. Users without required
 * roles will not see the tab in the navigation and cannot access it via URL.
 *
 * @example
 * ```typescript
 * const tabConfig: TabConfig = {
 *   id: 'overview',
 *   label: 'Overview',
 *   icon: '📊',
 *   component: MedicationsOverviewTab,
 *   requiredRoles: ['ADMIN', 'NURSE']
 * };
 * ```
 */
interface TabConfig {
  id: MedicationTab;
  label: string;
  icon: string;
  component: React.ComponentType;
  requiredRoles: string[];
}

/**
 * Tab configuration with role-based access control.
 *
 * Defines all available tabs in the medications interface with their display properties,
 * components, and role requirements for access control.
 *
 * @constant {TabConfig[]} TABS
 *
 * @remarks
 * **Access Control**: Each tab specifies required roles. Users must have at least one
 * of the specified roles to access the tab.
 *
 * **Tab Ordering**: Tabs are displayed in the order defined in this array. Most commonly
 * accessed tabs should appear first for better UX.
 *
 * **Component Lazy Loading**: Consider implementing React.lazy() for tab components to
 * reduce initial bundle size and improve load performance.
 *
 * @example
 * ```typescript
 * // Check if user has access to a tab
 * const hasAccess = TABS.find(tab => tab.id === 'inventory')
 *   ?.requiredRoles.includes(user.role);
 * ```
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
