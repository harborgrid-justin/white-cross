/**
 * WF-INV-002 | InventoryAlerts.tsx - Inventory alerts management interface
 * Purpose: Display and manage inventory alerts for low stock, expiring items, and system notifications
 * Upstream: ../services/modules/health/inventoryApi, ../types/inventory | Dependencies: react, date-fns
 * Downstream: Inventory management system | Called by: React router, inventory workflow
 * Related: InventoryItems.tsx, InventoryTransactions.tsx, InventoryVendors.tsx
 * Exports: default InventoryAlerts component | Key Features: Alert listing, filtering, actions, notifications
 * Last Updated: 2025-10-21 | File Type: .tsx
 * Critical Path: Load alerts → Display notifications → Take actions → Manage inventory
 * LLM Context: Inventory alert management with priority-based sorting and action handling
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { PROTECTED_ROUTES } from '../../constants/routes';

// ============================================================================
// INTERFACES
// ============================================================================

interface InventoryAlert {
  id: string;
  type: 'LOW_STOCK' | 'EXPIRING' | 'EXPIRED' | 'CRITICAL_LOW' | 'REORDER_POINT';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  itemId: string;
  itemName: string;
  itemSku: string;
  message: string;
  details: string;
  currentStock?: number;
  minimumStock?: number;
  expirationDate?: string;
  daysUntilExpiration?: number;
  category: string;
  location: string;
  isRead: boolean;
  isResolved: boolean;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

interface AlertFilters {
  type?: string;
  severity?: string;
  category?: string;
  isRead?: boolean;
  isResolved?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

const InventoryAlerts: React.FC = () => {
  // Navigation and auth
  const navigate = useNavigate();
  const { user } = useAuth();

  // State management
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);

  // Filters
  const [filters, setFilters] = useState<AlertFilters>({
    isResolved: false, // Show unresolved by default
  });

  // ============================================================================
  // MOCK DATA (Replace with actual API calls)
  // ============================================================================

  const mockAlerts: InventoryAlert[] = [
    {
      id: '1',
      type: 'CRITICAL_LOW',
      severity: 'CRITICAL',
      itemId: '2',
      itemName: 'Bandages - Adhesive',
      itemSku: 'SUP-BAN-ADH',
      message: 'Critical low stock alert',
      details: 'Current stock (25) is critically below minimum level (100). Immediate reorder required.',
      currentStock: 25,
      minimumStock: 100,
      category: 'SUPPLIES',
      location: 'First Aid Station',
      isRead: false,
      isResolved: false,
      createdAt: '2025-10-21T08:30:00Z',
    },
    {
      id: '2',
      type: 'EXPIRING',
      severity: 'HIGH',
      itemId: '4',
      itemName: 'Acetaminophen 500mg',
      itemSku: 'MED-ACE-500',
      message: 'Item expiring soon',
      details: 'Batch ACE-2024-001 expires in 15 days. Consider using soon or disposing safely.',
      expirationDate: '2025-11-05',
      daysUntilExpiration: 15,
      category: 'MEDICATION',
      location: 'Pharmacy Cabinet A',
      isRead: true,
      isResolved: false,
      createdAt: '2025-10-20T14:20:00Z',
    },
    {
      id: '3',
      type: 'LOW_STOCK',
      severity: 'MEDIUM',
      itemId: '5',
      itemName: 'Digital Thermometer',
      itemSku: 'EQP-THM-DIG',
      message: 'Low stock warning',
      details: 'Current stock (8) is approaching minimum level (5). Consider reordering soon.',
      currentStock: 8,
      minimumStock: 5,
      category: 'EQUIPMENT',
      location: 'Nurse Office - Drawer 1',
      isRead: false,
      isResolved: false,
      createdAt: '2025-10-19T11:45:00Z',
    },
    {
      id: '4',
      type: 'EXPIRED',
      severity: 'CRITICAL',
      itemId: '6',
      itemName: 'Antiseptic Solution',
      itemSku: 'MED-ANT-SOL',
      message: 'Item has expired',
      details: 'Batch ANT-2024-003 expired 5 days ago. Must be removed from inventory immediately.',
      expirationDate: '2025-10-16',
      daysUntilExpiration: -5,
      category: 'MEDICATION',
      location: 'Pharmacy Cabinet B',
      isRead: true,
      isResolved: false,
      createdAt: '2025-10-17T09:00:00Z',
    },
    {
      id: '5',
      type: 'REORDER_POINT',
      severity: 'LOW',
      itemId: '7',
      itemName: 'Disposable Gloves',
      itemSku: 'SUP-GLV-DIS',
      message: 'Reorder point reached',
      details: 'Current stock (150) has reached the reorder point. Consider placing order.',
      currentStock: 150,
      minimumStock: 100,
      category: 'SUPPLIES',
      location: 'Supply Closet A',
      isRead: false,
      isResolved: false,
      createdAt: '2025-10-18T16:30:00Z',
    },
  ];

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 800));

      let filteredAlerts = mockAlerts;

      // Apply filters
      if (filters.type) {
        filteredAlerts = filteredAlerts.filter(alert => alert.type === filters.type);
      }

      if (filters.severity) {
        filteredAlerts = filteredAlerts.filter(alert => alert.severity === filters.severity);
      }

      if (filters.category) {
        filteredAlerts = filteredAlerts.filter(alert => alert.category === filters.category);
      }

      if (filters.isRead !== undefined) {
        filteredAlerts = filteredAlerts.filter(alert => alert.isRead === filters.isRead);
      }

      if (filters.isResolved !== undefined) {
        filteredAlerts = filteredAlerts.filter(alert => alert.isResolved === filters.isResolved);
      }

      // Sort by severity and date
      const severityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      filteredAlerts.sort((a, b) => {
        const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
        if (severityDiff !== 0) return severityDiff;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setAlerts(filteredAlerts);
    } catch (err) {
      console.error('Failed to load inventory alerts:', err);
      setError('Failed to load inventory alerts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [filters]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleFilterChange = (newFilters: Partial<AlertFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const markAsRead = async (alertIds: string[]) => {
    try {
      // Mock API call - replace with actual implementation
      console.log('Marking alerts as read:', alertIds);
      await new Promise(resolve => setTimeout(resolve, 500));

      setAlerts(prev => prev.map(alert =>
        alertIds.includes(alert.id) ? { ...alert, isRead: true } : alert
      ));
      
      setSelectedAlerts([]);
    } catch (err) {
      console.error('Failed to mark alerts as read:', err);
      setError('Failed to update alerts. Please try again.');
    }
  };

  const resolveAlerts = async (alertIds: string[]) => {
    try {
      // Mock API call - replace with actual implementation
      console.log('Resolving alerts:', alertIds);
      await new Promise(resolve => setTimeout(resolve, 500));

      setAlerts(prev => prev.map(alert =>
        alertIds.includes(alert.id) 
          ? { 
              ...alert, 
              isResolved: true, 
              isRead: true,
              resolvedAt: new Date().toISOString(),
              resolvedBy: user?.id || 'current-user'
            } 
          : alert
      ));
      
      setSelectedAlerts([]);
    } catch (err) {
      console.error('Failed to resolve alerts:', err);
      setError('Failed to resolve alerts. Please try again.');
    }
  };

  const handleSelectAlert = (alertId: string, selected: boolean) => {
    if (selected) {
      setSelectedAlerts(prev => [...prev, alertId]);
    } else {
      setSelectedAlerts(prev => prev.filter(id => id !== alertId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedAlerts(alerts.map(alert => alert.id));
    } else {
      setSelectedAlerts([]);
    }
  };

  const navigateToItem = (itemId: string) => {
    navigate(`${PROTECTED_ROUTES.INVENTORY_ITEMS}?item=${itemId}`);
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const getSeverityBadge = (severity: string) => {
    const severityConfig = {
      CRITICAL: 'bg-red-100 text-red-800 border-red-200',
      HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
      MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      LOW: 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return severityConfig[severity as keyof typeof severityConfig] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      CRITICAL_LOW: 'bg-red-50 text-red-700',
      LOW_STOCK: 'bg-yellow-50 text-yellow-700',
      EXPIRING: 'bg-orange-50 text-orange-700',
      EXPIRED: 'bg-red-50 text-red-700',
      REORDER_POINT: 'bg-blue-50 text-blue-700',
    };
    return typeConfig[type as keyof typeof typeConfig] || 'bg-gray-50 text-gray-700';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CRITICAL_LOW':
      case 'LOW_STOCK':
        return (
          <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'EXPIRING':
        return (
          <svg className="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'EXPIRED':
        return (
          <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'REORDER_POINT':
        return (
          <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 3H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  // ============================================================================
  // LOADING & ERROR STATES
  // ============================================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading alerts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Alerts</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => loadAlerts()}
                className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const unresolvedCount = alerts.filter(alert => !alert.isResolved).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Alerts</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor and manage inventory alerts and notifications
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{unreadCount}</span> unread, 
            <span className="font-medium ml-1">{unresolvedCount}</span> unresolved
          </div>
          <button
            onClick={() => navigate(PROTECTED_ROUTES.INVENTORY_ITEMS)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m6-8v2m0 0v2m0-2h2m-2 0H8" />
            </svg>
            Manage Items
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <select
              value={filters.type || ''}
              onChange={(e) => handleFilterChange({ type: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">All Alert Types</option>
              <option value="CRITICAL_LOW">Critical Low Stock</option>
              <option value="LOW_STOCK">Low Stock</option>
              <option value="EXPIRING">Expiring Soon</option>
              <option value="EXPIRED">Expired</option>
              <option value="REORDER_POINT">Reorder Point</option>
            </select>
          </div>
          <div>
            <select
              value={filters.severity || ''}
              onChange={(e) => handleFilterChange({ severity: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
          <div>
            <select
              value={filters.category || ''}
              onChange={(e) => handleFilterChange({ category: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">All Categories</option>
              <option value="MEDICATION">Medication</option>
              <option value="SUPPLIES">Supplies</option>
              <option value="EQUIPMENT">Equipment</option>
            </select>
          </div>
          <div>
            <select
              value={filters.isRead === undefined ? '' : filters.isRead ? 'true' : 'false'}
              onChange={(e) => handleFilterChange({ 
                isRead: e.target.value === '' ? undefined : e.target.value === 'true' 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">All Alerts</option>
              <option value="false">Unread Only</option>
              <option value="true">Read Only</option>
            </select>
          </div>
          <div>
            <select
              value={filters.isResolved === undefined ? '' : filters.isResolved ? 'true' : 'false'}
              onChange={(e) => handleFilterChange({ 
                isResolved: e.target.value === '' ? undefined : e.target.value === 'true' 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">All Status</option>
              <option value="false">Unresolved</option>
              <option value="true">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedAlerts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm text-blue-800">
                {selectedAlerts.length} alert{selectedAlerts.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => markAsRead(selectedAlerts)}
                className="px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Mark as Read
              </button>
              <button
                onClick={() => resolveAlerts(selectedAlerts)}
                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Resolve Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alerts List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedAlerts.length === alerts.length && alerts.length > 0}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm font-medium text-gray-900">
              Select All ({alerts.length} alerts)
            </span>
          </div>
        </div>

        <ul className="divide-y divide-gray-200">
          {alerts.map((alert) => (
            <li key={alert.id} className={`p-4 hover:bg-gray-50 ${!alert.isRead ? 'bg-blue-50' : ''}`}>
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={selectedAlerts.includes(alert.id)}
                  onChange={(e) => handleSelectAlert(alert.id, e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                
                <div className="flex-shrink-0 mt-0.5">
                  {getTypeIcon(alert.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h3 className={`text-sm font-medium ${!alert.isRead ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                        {alert.message}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityBadge(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadge(alert.type)}`}>
                        {alert.type.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!alert.isRead && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          New
                        </span>
                      )}
                      {alert.isResolved && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Resolved
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={() => navigateToItem(alert.itemId)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {alert.itemName} ({alert.itemSku})
                    </button>
                    <span className="text-xs text-gray-500">
                      {format(new Date(alert.createdAt), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    {alert.details}
                  </p>

                  {/* Alert-specific information */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      {alert.currentStock !== undefined && (
                        <span>Current: {alert.currentStock}</span>
                      )}
                      {alert.minimumStock !== undefined && (
                        <span>Min: {alert.minimumStock}</span>
                      )}
                      {alert.expirationDate && (
                        <span>
                          Expires: {format(new Date(alert.expirationDate), 'MMM d, yyyy')}
                        </span>
                      )}
                      <span>Location: {alert.location}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      {!alert.isRead && (
                        <button
                          onClick={() => markAsRead([alert.id])}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Mark Read
                        </button>
                      )}
                      {!alert.isResolved && (
                        <button
                          onClick={() => resolveAlerts([alert.id])}
                          className="text-green-600 hover:text-green-800"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {alerts.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12.001 12l7-7L12.001 12l-7-7 7 7zm0 0l7 7-7-7zm0 0l-7 7 7-7z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No alerts found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {Object.values(filters).some(v => v !== undefined && v !== '')
                ? 'No alerts match your current filters.'
                : 'All inventory alerts are resolved!'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryAlerts;
