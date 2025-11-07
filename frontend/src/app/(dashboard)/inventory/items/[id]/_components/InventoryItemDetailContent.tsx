'use client';

/**
 * InventoryItemDetailContent Component
 *
 * Displays detailed information about a single inventory item.
 * Shows stock levels, transaction history, and item metadata.
 *
 * @module InventoryItemDetailContent
 */

import React, { useState, useEffect } from 'react';

export interface InventoryItemDetailContentProps {
  /** ID of the inventory item to display */
  itemId?: string;
}

export interface StockTransaction {
  id: string;
  type: 'receive' | 'issue' | 'transfer' | 'adjustment';
  quantity: number;
  date: string;
  user: string;
  notes?: string;
  balanceAfter: number;
}

export interface InventoryItemDetail {
  id: string;
  name: string;
  sku: string;
  category: string;
  type: 'medication' | 'supply' | 'equipment';
  description: string;
  manufacturer: string;
  ndcCode?: string;
  lotNumber?: string;
  expirationDate?: string;
  location: string;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  reorderPoint: number;
  unitOfMeasure: string;
  unitCost: number;
  totalValue: number;
  isControlledSubstance: boolean;
  requiresPrescription: boolean;
  storageRequirements?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  recentTransactions: StockTransaction[];
}

/**
 * Inventory item detail view component
 *
 * @param props - Component props
 * @returns Rendered detail view
 */
function InventoryItemDetailContent({ itemId }: InventoryItemDetailContentProps) {
  const [item, setItem] = useState<InventoryItemDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadItem = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock data
        const mockItem: InventoryItemDetail = {
          id: itemId || '1',
          name: 'Acetaminophen 500mg',
          sku: 'MED-001',
          category: 'Pain Relief',
          type: 'medication',
          description: 'Over-the-counter pain reliever and fever reducer',
          manufacturer: 'Generic Pharmaceuticals',
          ndcCode: '12345-678-90',
          lotNumber: 'LOT2024-001',
          expirationDate: '2025-12-31',
          location: 'Cabinet A, Shelf 2',
          currentStock: 100,
          minStockLevel: 20,
          maxStockLevel: 200,
          reorderPoint: 40,
          unitOfMeasure: 'tablet',
          unitCost: 0.15,
          totalValue: 15.0,
          isControlledSubstance: false,
          requiresPrescription: false,
          storageRequirements: 'Store at room temperature',
          notes: 'Common OTC medication',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          recentTransactions: [
            {
              id: '1',
              type: 'receive',
              quantity: 50,
              date: '2024-01-20T14:30:00Z',
              user: 'Jane Doe',
              notes: 'Restocking order #1234',
              balanceAfter: 100,
            },
            {
              id: '2',
              type: 'issue',
              quantity: -10,
              date: '2024-01-18T09:15:00Z',
              user: 'John Smith',
              notes: 'Issued to student ID: 456',
              balanceAfter: 50,
            },
            {
              id: '3',
              type: 'adjustment',
              quantity: -5,
              date: '2024-01-16T11:00:00Z',
              user: 'Admin User',
              notes: 'Physical count adjustment',
              balanceAfter: 60,
            },
          ],
        };

        setItem(mockItem);
      } catch (err) {
        console.error('Error loading inventory item:', err);
        setError('Failed to load inventory item details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadItem();
  }, [itemId]);

  /**
   * Gets stock status with color coding
   */
  const getStockStatus = () => {
    if (!item) return { label: 'Unknown', color: 'gray' };

    if (item.currentStock === 0) {
      return { label: 'Out of Stock', color: 'red' };
    } else if (item.currentStock <= item.minStockLevel) {
      return { label: 'Low Stock', color: 'orange' };
    } else if (item.currentStock <= item.reorderPoint) {
      return { label: 'Reorder Soon', color: 'yellow' };
    } else {
      return { label: 'In Stock', color: 'green' };
    }
  };

  /**
   * Gets transaction type badge styling
   */
  const getTransactionBadge = (type: string) => {
    const badges = {
      receive: 'bg-green-100 text-green-800',
      issue: 'bg-blue-100 text-blue-800',
      transfer: 'bg-purple-100 text-purple-800',
      adjustment: 'bg-orange-100 text-orange-800',
    };
    return badges[type as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error || 'Item not found'}</p>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus();

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
          <p className="text-gray-600 mt-1">SKU: {item.sku}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => window.location.href = `/inventory/${item.id}/edit`}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Edit Item
          </button>
          <button
            onClick={() => window.location.href = `/inventory/transactions/issue?itemId=${item.id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Issue Stock
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stock Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Stock Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {item.currentStock}
                  <span className="text-sm font-normal text-gray-600 ml-1">{item.unitOfMeasure}</span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-${stockStatus.color}-100 text-${stockStatus.color}-800`}>
                  {stockStatus.label}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">${item.totalValue.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Unit Cost</p>
                <p className="text-2xl font-bold text-gray-900">${item.unitCost.toFixed(2)}</p>
              </div>
            </div>

            {/* Stock Level Indicator */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Stock Level</span>
                <span>{item.currentStock} / {item.maxStockLevel} {item.unitOfMeasure}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-${stockStatus.color}-600`}
                  style={{ width: `${Math.min((item.currentStock / item.maxStockLevel) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Min: {item.minStockLevel}</span>
                <span>Reorder: {item.reorderPoint}</span>
                <span>Max: {item.maxStockLevel}</span>
              </div>
            </div>
          </div>

          {/* Item Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Item Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Category</p>
                <p className="text-gray-900">{item.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Type</p>
                <p className="text-gray-900 capitalize">{item.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Manufacturer</p>
                <p className="text-gray-900">{item.manufacturer || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Location</p>
                <p className="text-gray-900">{item.location}</p>
              </div>
              {item.ndcCode && (
                <div>
                  <p className="text-sm font-medium text-gray-700">NDC Code</p>
                  <p className="text-gray-900 font-mono">{item.ndcCode}</p>
                </div>
              )}
              {item.lotNumber && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Lot Number</p>
                  <p className="text-gray-900 font-mono">{item.lotNumber}</p>
                </div>
              )}
              {item.expirationDate && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Expiration Date</p>
                  <p className="text-gray-900">{new Date(item.expirationDate).toLocaleDateString()}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-700">Unit of Measure</p>
                <p className="text-gray-900 capitalize">{item.unitOfMeasure}</p>
              </div>
            </div>

            {item.description && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
                <p className="text-gray-900">{item.description}</p>
              </div>
            )}

            {item.storageRequirements && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Storage Requirements</p>
                <p className="text-gray-900">{item.storageRequirements}</p>
              </div>
            )}

            {item.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Notes</p>
                <p className="text-gray-900">{item.notes}</p>
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
              <button
                onClick={() => window.location.href = `/inventory/transactions?itemId=${item.id}`}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {item.recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTransactionBadge(transaction.type)}`}>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.quantity > 0 ? '+' : ''}{transaction.quantity} {item.unitOfMeasure}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(transaction.date).toLocaleString()} by {transaction.user}
                      </p>
                      {transaction.notes && (
                        <p className="text-xs text-gray-500 mt-1">{transaction.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      Balance: {transaction.balanceAfter}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Quick Info & Actions */}
        <div className="space-y-6">
          {/* Regulatory Flags */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Regulatory</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Controlled Substance</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${item.isControlledSubstance ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                  {item.isControlledSubstance ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Requires Prescription</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${item.requiresPrescription ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}`}>
                  {item.requiresPrescription ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => window.location.href = `/inventory/transactions/receive?itemId=${item.id}`}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
              >
                Receive Stock
              </button>
              <button
                onClick={() => window.location.href = `/inventory/transactions/issue?itemId=${item.id}`}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                Issue Stock
              </button>
              <button
                onClick={() => window.location.href = `/inventory/transactions/transfer?itemId=${item.id}`}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
              >
                Transfer Stock
              </button>
              <button
                onClick={() => window.location.href = `/inventory/transactions/adjustment?itemId=${item.id}`}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm"
              >
                Adjust Stock
              </button>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Created</p>
                <p className="text-gray-900">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Last Updated</p>
                <p className="text-gray-900">{new Date(item.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export both named and default for flexibility
export { InventoryItemDetailContent }
export default InventoryItemDetailContent
