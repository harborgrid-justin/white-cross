/**
 * @fileoverview Inventory Dashboard Content - Server Component
 *
 * Comprehensive inventory management dashboard that aggregates and displays
 * critical inventory metrics, alerts, and operational statistics for healthcare
 * supply tracking. Implements server-side data fetching with parallel queries
 * for optimal performance.
 *
 * **Key Metrics Displayed:**
 * - Total inventory items across all locations
 * - Current inventory valuation (cost basis)
 * - Low stock alerts with priority levels (critical, high, normal)
 * - Expiring items within 30-day window
 * - Category-based inventory breakdown
 *
 * **Alert Prioritization Logic:**
 * - **Critical Low Stock**: Current quantity ≤ 25% of reorder point
 * - **High Low Stock**: Current quantity ≤ 50% of reorder point
 * - **Critical Expiring**: Items expiring within 7 days
 * - **High Expiring**: Items expiring within 14 days
 *
 * **Data Fetching Strategy:**
 * - Parallel async queries using Promise.all for optimal performance
 * - Graceful error handling with fallback to empty arrays
 * - Server-side rendering for fresh data on each request
 *
 * **Healthcare Integration:**
 * - Medical supply tracking with expiration monitoring
 * - Multi-location inventory visibility for school health offices
 * - Quick access to common stock operations (receive, issue, adjust, transfer)
 *
 * @module app/(dashboard)/inventory/InventoryDashboardContent
 * @requires actions/alerts.actions - Server actions for inventory data
 * @see {@link module:app/(dashboard)/inventory/low-stock} Low stock management
 * @see {@link module:app/(dashboard)/inventory/expiring} Expiration tracking
 */

import React from 'react';
import { getInventoryDashboardStats } from '@/actions/alerts.actions';
import { getLowStockAlerts, getExpirationAlerts } from '@/actions/alerts.actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle, Package, TrendingDown, TrendingUp, Calendar } from 'lucide-react';
import Link from 'next/link';

/**
 * Inventory Dashboard Content Component
 *
 * Server component that fetches and renders the complete inventory dashboard.
 * Executes parallel data fetching for optimal performance and implements
 * comprehensive error handling for each data source.
 *
 * **Data Sources:**
 * 1. Dashboard Statistics - Total items, valuation, location count, category breakdown
 * 2. Low Stock Alerts - Items below reorder point with priority levels
 * 3. Expiration Alerts - Items expiring within 30 days
 *
 * **Error Handling:**
 * - Individual result checking for each data source
 * - Graceful degradation with empty arrays on failure
 * - User-visible error message for critical dashboard stats failure
 *
 * **Performance Optimization:**
 * - Promise.all() executes all queries in parallel
 * - Reduces total data fetching time by ~66% vs sequential queries
 * - Server-side rendering ensures no client-side loading delay
 *
 * @returns {Promise<JSX.Element>} Server-rendered dashboard with inventory metrics
 *
 * @example
 * ```tsx
 * // Used in page.tsx
 * <InventoryDashboardContent />
 * // Automatically fetches and renders all dashboard data
 * ```
 */
export async function InventoryDashboardContent() {
  /**
   * Parallel data fetching for dashboard metrics and alerts.
   * All queries execute simultaneously for optimal performance.
   *
   * Query 1: Overall inventory statistics (items, value, locations, categories)
   * Query 2: Low stock alerts (items below reorder point)
   * Query 3: Expiration alerts (items expiring within 30 days)
   */
  const [statsResult, lowStockResult, expirationResult] = await Promise.all([
    getInventoryDashboardStats(),
    getLowStockAlerts(),
    getExpirationAlerts(30), // 30-day expiration window
  ]);

  if (!statsResult.success) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load inventory dashboard data: {statsResult.error}
        </AlertDescription>
      </Alert>
    );
  }

  const stats = statsResult.data;
  // Graceful fallback to empty arrays if alerts fail to load
  const lowStockAlerts = lowStockResult.success ? lowStockResult.data || [] : [];
  const expiringItems = expirationResult.success ? expirationResult.data || [] : [];

  /**
   * Calculate critical alert counts for banner display.
   *
   * Critical Low Stock: Items at ≤25% of reorder point (immediate action required)
   * Critical Expiring: Items expiring within 7 days (urgent use or disposal needed)
   *
   * These counts drive the critical alert banner display logic.
   */
  const criticalLowStock = lowStockAlerts.filter((a: { priority: string }) => a.priority === 'critical').length;
  const criticalExpiring = expiringItems.filter((a: { priority: string }) => a.priority === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventory Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of inventory levels, alerts, and key metrics
        </p>
      </div>

      {/* Critical Alerts Banner */}
      {(criticalLowStock > 0 || criticalExpiring > 0) && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {criticalLowStock > 0 && (
              <span className="font-semibold">{criticalLowStock} critical low stock alert(s)</span>
            )}
            {criticalLowStock > 0 && criticalExpiring > 0 && <span> and </span>}
            {criticalExpiring > 0 && (
              <span className="font-semibold">{criticalExpiring} critical expiration alert(s)</span>
            )}
            . Immediate action required.
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalItems || 0}</div>
            <p className="text-xs text-muted-foreground">
              Across {stats?.totalLocations || 0} locations
            </p>
          </CardContent>
        </Card>

        {/* Total Value */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(stats?.totalValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Current inventory valuation
            </p>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {criticalLowStock} critical alerts
            </p>
            <Link
              href="/inventory/low-stock"
              className="text-xs text-primary hover:underline mt-2 inline-block"
            >
              View all alerts →
            </Link>
          </CardContent>
        </Card>

        {/* Expiring Soon */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring (30 days)</CardTitle>
            <Calendar className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringItems.length}</div>
            <p className="text-xs text-muted-foreground">
              {criticalExpiring} expiring within 7 days
            </p>
            <Link
              href="/inventory/expiring"
              className="text-xs text-primary hover:underline mt-2 inline-block"
            >
              View expiring items →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Low Stock Alerts</CardTitle>
            <CardDescription>Items below reorder point</CardDescription>
          </CardHeader>
          <CardContent>
            {lowStockAlerts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No low stock alerts
              </p>
            ) : (
              <div className="space-y-3">
                {lowStockAlerts.slice(0, 5).map((alert: {
                  id: string;
                  itemName: string;
                  locationName: string;
                  currentQuantity: number;
                  reorderPoint: number;
                  priority: string;
                }) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {alert.itemName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {alert.locationName} • Current: {alert.currentQuantity} •
                        Reorder: {alert.reorderPoint}
                      </p>
                    </div>
                    <Badge variant={
                      alert.priority === 'critical' ? 'destructive' :
                      alert.priority === 'high' ? 'default' :
                      'secondary'
                    }>
                      {alert.priority}
                    </Badge>
                  </div>
                ))}
                {lowStockAlerts.length > 5 && (
                  <Link
                    href="/inventory/low-stock"
                    className="text-sm text-primary hover:underline block text-center pt-2"
                  >
                    View {lowStockAlerts.length - 5} more alerts
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expiring Items */}
        <Card>
          <CardHeader>
            <CardTitle>Items Expiring Soon</CardTitle>
            <CardDescription>Expiring within 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {expiringItems.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No expiring items in the next 30 days
              </p>
            ) : (
              <div className="space-y-3">
                {expiringItems.slice(0, 5).map((alert: {
                  id: string;
                  itemName: string;
                  batchNumber: string;
                  expirationDate: string;
                  daysUntilExpiration: number;
                }) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {alert.itemName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Batch: {alert.batchNumber} • Expires: {
                          new Date(alert.expirationDate).toLocaleDateString()
                        }
                      </p>
                    </div>
                    <Badge variant={
                      alert.daysUntilExpiration <= 7 ? 'destructive' :
                      alert.daysUntilExpiration <= 14 ? 'default' :
                      'secondary'
                    }>
                      {alert.daysUntilExpiration}d
                    </Badge>
                  </div>
                ))}
                {expiringItems.length > 5 && (
                  <Link
                    href="/inventory/expiring"
                    className="text-sm text-primary hover:underline block text-center pt-2"
                  >
                    View {expiringItems.length - 5} more items
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common inventory operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
            <Link
              href="/inventory/stock/receive"
              className="flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Receive Stock
            </Link>
            <Link
              href="/inventory/stock/issue"
              className="flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Issue Stock
            </Link>
            <Link
              href="/inventory/stock/adjust"
              className="flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Adjust Stock
            </Link>
            <Link
              href="/inventory/stock/transfer"
              className="flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Transfer Stock
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown (if available) */}
      {stats?.categoryBreakdown && stats.categoryBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
            <CardDescription>Stock levels across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.categoryBreakdown.map((category: {
                category: string;
                itemCount: number;
                totalValue: number;
              }) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium capitalize">
                      {category.category.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {category.itemCount} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ${category.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
