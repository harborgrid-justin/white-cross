/**
 * Inventory Statistics Component
 *
 * Displays statistics cards for inventory metrics
 *
 * @module components/InventoryStatistics
 */

import React from 'react';
import { Package, AlertCircle, TrendingDown, ShoppingCart } from 'lucide-react';
import type { InventoryItem, InventoryAlert, Vendor, PurchaseOrder } from '../types';

interface InventoryStatisticsProps {
  inventoryItems: InventoryItem[];
  alerts: InventoryAlert[];
  vendors: Vendor[];
  purchaseOrders: PurchaseOrder[];
}

/**
 * Statistics cards component
 */
export default function InventoryStatistics({
  inventoryItems,
  alerts,
  vendors,
  purchaseOrders,
}: InventoryStatisticsProps) {
  const pendingOrders = purchaseOrders.filter((po) => po.status === 'PENDING').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Items</p>
            <p className="text-2xl font-bold text-gray-900">{inventoryItems.length}</p>
          </div>
          <Package className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Active Alerts</p>
            <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
          </div>
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Active Vendors</p>
            <p className="text-2xl font-bold text-gray-900">{vendors.length}</p>
          </div>
          <TrendingDown className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Pending Orders</p>
            <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
          </div>
          <ShoppingCart className="h-8 w-8 text-purple-600" />
        </div>
      </div>
    </div>
  );
}
