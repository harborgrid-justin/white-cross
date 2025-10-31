/**
 * @fileoverview Inventory Sidebar Component - Sidebar navigation for inventory management
 * @module app/(dashboard)/inventory/_components/InventorySidebar
 * @category Inventory - Components
 */

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Package,
  AlertTriangle,
  Calendar,
  TrendingUp,
  TrendingDown,
  Plus,
  BarChart3,
  RefreshCw,
  Box,
  Activity,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface InventorySidebarProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    category?: string;
    status?: string;
    location?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

interface SidebarStats {
  totalItems: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  expiringCount: number;
  expiredCount: number;
  categoryBreakdown: {
    category: string;
    count: number;
    value: number;
  }[];
  locationStats: {
    location: string;
    itemCount: number;
    lowStockItems: number;
  }[];
  recentActivity: {
    id: string;
    type: 'received' | 'issued' | 'adjusted' | 'expired' | 'transferred';
    message: string;
    timestamp: string;
    itemName: string;
    quantity?: number;
  }[];
  criticalAlerts: {
    id: string;
    type: 'low_stock' | 'out_of_stock' | 'expired' | 'expiring_soon';
    title: string;
    itemName: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    daysLeft?: number;
  }[];
}

// Mock data for demonstration
const mockStats: SidebarStats = {
  totalItems: 1247,
  totalValue: 45678.90,
  lowStockCount: 23,
  outOfStockCount: 5,
  expiringCount: 12,
  expiredCount: 3,
  categoryBreakdown: [
    { category: 'Medical Supplies', count: 456, value: 18543.20 },
    { category: 'Medications', count: 234, value: 15234.15 },
    { category: 'Equipment', count: 123, value: 8901.35 },
    { category: 'General Supplies', count: 434, value: 3000.20 }
  ],
  locationStats: [
    { location: 'Main Office', itemCount: 678, lowStockItems: 12 },
    { location: 'Nurse Station A', itemCount: 234, lowStockItems: 8 },
    { location: 'Nurse Station B', itemCount: 189, lowStockItems: 3 },
    { location: 'Storage Room', itemCount: 146, lowStockItems: 0 }
  ],
  recentActivity: [
    {
      id: '1',
      type: 'received',
      message: 'Received new stock shipment',
      timestamp: '2 hours ago',
      itemName: 'Acetaminophen 500mg',
      quantity: 100
    },
    {
      id: '2',
      type: 'issued',
      message: 'Issued to student',
      timestamp: '4 hours ago',
      itemName: 'Digital Thermometer',
      quantity: 1
    },
    {
      id: '3',
      type: 'adjusted',
      message: 'Stock count adjusted',
      timestamp: '6 hours ago',
      itemName: 'Bandages - Assorted',
      quantity: -5
    },
    {
      id: '4',
      type: 'expired',
      message: 'Item marked as expired',
      timestamp: '1 day ago',
      itemName: 'Antiseptic Solution',
      quantity: 0
    }
  ],
  criticalAlerts: [
    {
      id: '1',
      type: 'out_of_stock',
      title: 'Out of Stock',
      itemName: 'EpiPen Auto-Injector',
      priority: 'HIGH'
    },
    {
      id: '2',
      type: 'expired',
      title: 'Expired Items',
      itemName: 'Cough Syrup',
      priority: 'HIGH'
    },
    {
      id: '3',
      type: 'expiring_soon',
      title: 'Expiring Soon',
      itemName: 'Albuterol Inhaler',
      priority: 'MEDIUM',
      daysLeft: 5
    },
    {
      id: '4',
      type: 'low_stock',
      title: 'Low Stock Alert',
      itemName: 'Disposable Gloves',
      priority: 'MEDIUM'
    }
  ]
};

function getActivityIcon(type: string) {
  switch (type) {
    case 'received': return TrendingUp;
    case 'issued': return TrendingDown;
    case 'adjusted': return RefreshCw;
    case 'expired': return XCircle;
    case 'transferred': return Box;
    default: return Activity;
  }
}

function getAlertIcon(type: string) {
  switch (type) {
    case 'low_stock': return AlertTriangle;
    case 'out_of_stock': return XCircle;
    case 'expired': return XCircle;
    case 'expiring_soon': return Calendar;
    default: return AlertTriangle;
  }
}

function getPriorityBadgeVariant(priority: string) {
  switch (priority) {
    case 'HIGH': return 'danger';
    case 'MEDIUM': return 'warning';
    case 'LOW': return 'info';
    default: return 'secondary';
  }
}

export function InventorySidebar({ searchParams }: InventorySidebarProps) {
  const [stats, setStats] = useState<SidebarStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <div className="p-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-8"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-4">
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-500">Unable to load statistics</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Inventory Overview */}
      <Card>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Package className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-medium text-gray-900">Inventory Overview</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Items</span>
              <span className="text-sm font-semibold text-gray-900">{stats.totalItems.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Value</span>
              <span className="text-sm font-semibold text-green-600">${stats.totalValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Low Stock</span>
              <Badge variant="warning" className="text-xs">
                {stats.lowStockCount}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Out of Stock</span>
              <Badge variant="danger" className="text-xs">
                {stats.outOfStockCount}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Expiring Soon</span>
              <Badge variant="warning" className="text-xs">
                {stats.expiringCount}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-4 w-4 text-purple-600" />
            <h3 className="text-sm font-medium text-gray-900">By Category</h3>
          </div>
          <div className="space-y-3">
            {stats.categoryBreakdown.map((category) => (
              <div key={category.category}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">{category.category}</span>
                  <span className="text-xs font-medium">{category.count}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                      data-width={`${(category.count / stats.totalItems) * 100}%`}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">${category.value.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Critical Alerts */}
      <Card>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <h3 className="text-sm font-medium text-gray-900">Critical Alerts</h3>
          </div>
          <div className="space-y-3">
            {stats.criticalAlerts.slice(0, 4).map((alert) => {
              const IconComponent = getAlertIcon(alert.type);
              return (
                <div key={alert.id} className="flex items-start gap-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <IconComponent className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-red-900 truncate">
                      {alert.title}
                    </p>
                    <p className="text-xs text-red-700 truncate">
                      {alert.itemName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {alert.daysLeft && (
                        <span className="text-xs text-red-600">{alert.daysLeft} days left</span>
                      )}
                      <Badge variant={getPriorityBadgeVariant(alert.priority)} className="text-xs">
                        {alert.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Plus className="h-4 w-4 text-green-600" />
            <h3 className="text-sm font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              Receive Stock
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <TrendingDown className="h-4 w-4 mr-2" />
              Issue Items
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <RefreshCw className="h-4 w-4 mr-2" />
              Stock Count
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {stats.recentActivity.slice(0, 4).map((activity) => {
              const IconComponent = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <IconComponent className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-600">{activity.itemName}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* System Status */}
      <Card>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <h3 className="text-sm font-medium text-gray-900">System Status</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Inventory Sync</span>
              <Badge variant="success" className="text-xs">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Last Update</span>
              <span className="text-xs text-gray-500">5 min ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Auto Alerts</span>
              <Badge variant="success" className="text-xs">Active</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}