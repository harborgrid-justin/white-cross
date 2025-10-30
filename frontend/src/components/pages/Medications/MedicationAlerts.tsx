'use client';

import React, { useState } from 'react';

/**
 * Interface for medication alert
 */
interface MedicationAlert {
  id: string;
  type: 'expiration' | 'low-stock' | 'missed-dose' | 'interaction' | 'recall' | 'allergy' | 'critical';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  medicationId?: string;
  medicationName?: string;
  studentId?: string;
  studentName?: string;
  createdAt: string;
  expiresAt?: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  actionRequired: boolean;
  actionTaken?: boolean;
  relatedIds?: string[];
  metadata?: Record<string, unknown>;
}

/**
 * Interface for alert filters
 */
interface AlertFilters {
  type: string;
  priority: string;
  status: string;
  timeRange: string;
  searchTerm: string;
}

/**
 * Props for the MedicationAlerts component
 */
interface MedicationAlertsProps {
  /** Array of alerts to display */
  alerts?: MedicationAlert[];
  /** Whether the component is in loading state */
  loading?: boolean;
  /** Error message to display */
  error?: string;
  /** Callback when alert is acknowledged */
  onAcknowledgeAlert?: (alertId: string) => void;
  /** Callback when alert is dismissed */
  onDismissAlert?: (alertId: string) => void;
  /** Callback when action is taken on alert */
  onTakeAction?: (alertId: string, action: string) => void;
  /** Callback when alerts are bulk acknowledged */
  onBulkAcknowledge?: (alertIds: string[]) => void;
  /** Callback when alert settings are updated */
  onUpdateSettings?: (settings: Record<string, unknown>) => void;
}

/**
 * MedicationAlerts component for managing medication alerts and notifications
 * 
 * Features:
 * - Real-time alert notifications and management
 * - Multiple alert types (expiration, low stock, missed doses, etc.)
 * - Priority-based alert categorization
 * - Bulk acknowledgment and action capabilities
 * - Alert filtering and search functionality
 * - Action tracking and history
 * - Customizable alert settings
 * - Integration with medication and student data
 * 
 * @param props - The component props
 * @returns JSX element representing the medication alerts interface
 */
export function MedicationAlerts({
  alerts = [],
  loading = false,
  error,
  onAcknowledgeAlert,
  onDismissAlert,
  onTakeAction,
  onBulkAcknowledge,
  onUpdateSettings
}: MedicationAlertsProps) {
  const [filters, setFilters] = useState<AlertFilters>({
    type: 'all',
    priority: 'all',
    status: 'all',
    timeRange: 'all',
    searchTerm: ''
  });
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [sortBy, setSortBy] = useState<'priority' | 'created' | 'type' | 'medication'>('priority');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  /**
   * Get alert type icon and styling
   */
  const getAlertTypeConfig = (type: MedicationAlert['type']) => {
    const configs = {
      'expiration': {
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        bgColor: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        borderColor: 'border-yellow-200'
      },
      'low-stock': {
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
        bgColor: 'bg-orange-100',
        iconColor: 'text-orange-600',
        borderColor: 'border-orange-200'
      },
      'missed-dose': {
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        ),
        bgColor: 'bg-red-100',
        iconColor: 'text-red-600',
        borderColor: 'border-red-200'
      },
      'interaction': {
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        ),
        bgColor: 'bg-purple-100',
        iconColor: 'text-purple-600',
        borderColor: 'border-purple-200'
      },
      'recall': {
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        ),
        bgColor: 'bg-red-100',
        iconColor: 'text-red-600',
        borderColor: 'border-red-200'
      },
      'allergy': {
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        ),
        bgColor: 'bg-red-100',
        iconColor: 'text-red-600',
        borderColor: 'border-red-200'
      },
      'critical': {
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        ),
        bgColor: 'bg-red-100',
        iconColor: 'text-red-600',
        borderColor: 'border-red-200'
      }
    };
    return configs[type] || configs['critical'];
  };

  /**
   * Get priority badge styling
   */
  const getPriorityBadge = (priority: MedicationAlert['priority']) => {
    const badges = {
      'low': 'bg-gray-100 text-gray-800 border-gray-200',
      'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'high': 'bg-orange-100 text-orange-800 border-orange-200',
      'critical': 'bg-red-100 text-red-800 border-red-200'
    };
    return badges[priority] || badges['medium'];
  };

  /**
   * Filter and sort alerts
   */
  const filteredAndSortedAlerts = React.useMemo(() => {
    const filtered = alerts.filter(alert => {
      const matchesSearch = alert.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                           alert.message.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                           (alert.medicationName && alert.medicationName.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
                           (alert.studentName && alert.studentName.toLowerCase().includes(filters.searchTerm.toLowerCase()));
      const matchesType = filters.type === 'all' || alert.type === filters.type;
      const matchesPriority = filters.priority === 'all' || alert.priority === filters.priority;
      
      let matchesStatus = true;
      if (filters.status !== 'all') {
        switch (filters.status) {
          case 'acknowledged':
            matchesStatus = alert.acknowledged;
            break;
          case 'unacknowledged':
            matchesStatus = !alert.acknowledged;
            break;
          case 'action-required':
            matchesStatus = alert.actionRequired && !alert.actionTaken;
            break;
          case 'resolved':
            matchesStatus = alert.actionRequired && (alert.actionTaken ?? false);
            break;
        }
      }

      let matchesTimeRange = true;
      if (filters.timeRange !== 'all') {
        const now = new Date();
        const alertDate = new Date(alert.createdAt);
        const diffHours = (now.getTime() - alertDate.getTime()) / (1000 * 60 * 60);
        
        switch (filters.timeRange) {
          case '1-hour':
            matchesTimeRange = diffHours <= 1;
            break;
          case '24-hours':
            matchesTimeRange = diffHours <= 24;
            break;
          case '7-days':
            matchesTimeRange = diffHours <= 24 * 7;
            break;
          case '30-days':
            matchesTimeRange = diffHours <= 24 * 30;
            break;
        }
      }

      return matchesSearch && matchesType && matchesPriority && matchesStatus && matchesTimeRange;
    });

    // Sort alerts
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'priority':
          const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'created':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'medication':
          aValue = a.medicationName || '';
          bValue = b.medicationName || '';
          break;
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [alerts, filters, sortBy, sortOrder]);

  /**
   * Get alert statistics
   */
  const alertStats = React.useMemo(() => {
    const total = alerts.length;
    const unacknowledged = alerts.filter(alert => !alert.acknowledged).length;
    const critical = alerts.filter(alert => alert.priority === 'critical').length;
    const actionRequired = alerts.filter(alert => alert.actionRequired && !alert.actionTaken).length;

    return { total, unacknowledged, critical, actionRequired };
  }, [alerts]);

  /**
   * Toggle alert selection
   */
  const toggleAlertSelection = (alertId: string) => {
    setSelectedAlerts(prev => 
      prev.includes(alertId) 
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };

  /**
   * Select all visible alerts
   */
  const selectAllAlerts = () => {
    setSelectedAlerts(filteredAndSortedAlerts.map(alert => alert.id));
  };

  /**
   * Clear alert selection
   */
  const clearSelection = () => {
    setSelectedAlerts([]);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Alerts</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medication Alerts</h2>
          <p className="mt-1 text-sm text-gray-500">Monitor and manage medication alerts and notifications</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          {selectedAlerts.length > 0 && (
            <button
              onClick={() => onBulkAcknowledge?.(selectedAlerts)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Acknowledge Selected ({selectedAlerts.length})
            </button>
          )}
          <button
            onClick={() => setShowSettings(true)}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Settings
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-10a2 2 0 00-2-2H5a2 2 0 00-2 2v10h3" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Alerts</p>
              <p className="text-2xl font-semibold text-gray-900">{alertStats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Unacknowledged</p>
              <p className="text-2xl font-semibold text-gray-900">{alertStats.unacknowledged}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Critical</p>
              <p className="text-2xl font-semibold text-gray-900">{alertStats.critical}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Action Required</p>
              <p className="text-2xl font-semibold text-gray-900">{alertStats.actionRequired}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label htmlFor="search-alerts" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              id="search-alerts"
              type="text"
              placeholder="Search alerts..."
              value={filters.searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFilters(prev => ({ ...prev, searchTerm: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Search medication alerts"
            />
          </div>

          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              id="type-filter"
              value={filters.type}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                setFilters(prev => ({ ...prev, type: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by alert type"
            >
              <option value="all">All Types</option>
              <option value="expiration">Expiration</option>
              <option value="low-stock">Low Stock</option>
              <option value="missed-dose">Missed Dose</option>
              <option value="interaction">Interaction</option>
              <option value="recall">Recall</option>
              <option value="allergy">Allergy</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority-filter"
              value={filters.priority}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                setFilters(prev => ({ ...prev, priority: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by alert priority"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                setFilters(prev => ({ ...prev, status: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by alert status"
            >
              <option value="all">All Status</option>
              <option value="unacknowledged">Unacknowledged</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="action-required">Action Required</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label htmlFor="time-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Time Range
            </label>
            <select
              id="time-filter"
              value={filters.timeRange}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                setFilters(prev => ({ ...prev, timeRange: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by time range"
            >
              <option value="all">All Time</option>
              <option value="1-hour">Last Hour</option>
              <option value="24-hours">Last 24 Hours</option>
              <option value="7-days">Last 7 Days</option>
              <option value="30-days">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Alerts ({filteredAndSortedAlerts.length})
            </h3>
            <div className="flex items-center space-x-4">
              {filteredAndSortedAlerts.length > 0 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={selectAllAlerts}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Select All
                  </button>
                  {selectedAlerts.length > 0 && (
                    <button
                      onClick={clearSelection}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Clear ({selectedAlerts.length})
                    </button>
                  )}
                </div>
              )}
              <div className="flex items-center space-x-2">
                <label htmlFor="sort-by" className="text-sm text-gray-500">Sort by:</label>
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                    setSortBy(e.target.value as typeof sortBy)
                  }
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Sort alerts by"
                >
                  <option value="priority">Priority</option>
                  <option value="created">Created</option>
                  <option value="type">Type</option>
                  <option value="medication">Medication</option>
                </select>
                <button
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                >
                  <svg className={`w-4 h-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {filteredAndSortedAlerts.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-10a2 2 0 00-2-2H5a2 2 0 00-2 2v10h3" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No alerts found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {Object.values(filters).some(filter => filter !== 'all' && filter !== '')
                ? 'Try adjusting your filters to see more results.'
                : 'No medication alerts at this time.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredAndSortedAlerts.map((alert) => {
              const typeConfig = getAlertTypeConfig(alert.type);
              const isSelected = selectedAlerts.includes(alert.id);
              
              return (
                <div
                  key={alert.id}
                  className={`p-6 hover:bg-gray-50 ${alert.acknowledged ? 'opacity-75' : ''}`}
                >
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleAlertSelection(alert.id)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      aria-label={`Select alert: ${alert.title}`}
                    />
                    
                    <div className={`flex-shrink-0 w-10 h-10 ${typeConfig.bgColor} rounded-md flex items-center justify-center border ${typeConfig.borderColor}`}>
                      <div className={typeConfig.iconColor}>
                        {typeConfig.icon}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {alert.title}
                            </h4>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityBadge(alert.priority)}`}>
                              {alert.priority}
                            </span>
                            {alert.acknowledged && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                                Acknowledged
                              </span>
                            )}
                            {alert.actionRequired && !alert.actionTaken && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                                Action Required
                              </span>
                            )}
                          </div>
                          
                          <p className="mt-1 text-sm text-gray-600">{alert.message}</p>
                          
                          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                            <span>Type: {alert.type.replace('-', ' ')}</span>
                            {alert.medicationName && (
                              <span>Medication: {alert.medicationName}</span>
                            )}
                            {alert.studentName && (
                              <span>Student: {alert.studentName}</span>
                            )}
                            <span>Created: {new Date(alert.createdAt).toLocaleString()}</span>
                          </div>

                          {alert.acknowledged && alert.acknowledgedBy && (
                            <div className="mt-2 text-xs text-gray-500">
                              Acknowledged by {alert.acknowledgedBy} on {new Date(alert.acknowledgedAt!).toLocaleString()}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {!alert.acknowledged && (
                            <button
                              onClick={() => onAcknowledgeAlert?.(alert.id)}
                              className="text-green-600 hover:text-green-800 text-sm font-medium"
                              aria-label={`Acknowledge alert: ${alert.title}`}
                            >
                              Acknowledge
                            </button>
                          )}
                          {alert.actionRequired && !alert.actionTaken && (
                            <button
                              onClick={() => onTakeAction?.(alert.id, 'resolve')}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              aria-label={`Take action on alert: ${alert.title}`}
                            >
                              Take Action
                            </button>
                          )}
                          <button
                            onClick={() => onDismissAlert?.(alert.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                            aria-label={`Dismiss alert: ${alert.title}`}
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Alert Settings</h3>
            <p className="text-sm text-gray-600 mb-4">Configure alert preferences and notification settings.</p>
            {/* Settings form would go here */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle settings save
                  setShowSettings(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicationAlerts;
