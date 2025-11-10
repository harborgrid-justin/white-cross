'use client';

/**
 * PhysicalCountsContent Component
 *
 * Manage physical inventory counts and audits.
 * Track discrepancies and update stock levels based on actual counts.
 *
 * @module PhysicalCountsContent
 */

import React, { useState, useEffect } from 'react';
import EmptyState from '@/components/ui/feedback/EmptyState';

export interface PhysicalCount {
  id: string;
  countDate: string;
  countedBy: string;
  status: 'in-progress' | 'completed' | 'reviewed';
  location?: string;
  totalItems: number;
  itemsCounted: number;
  discrepanciesFound: number;
  notes?: string;
  createdAt: string;
}

export interface CountItem {
  itemId: string;
  itemName: string;
  sku: string;
  expectedStock: number;
  actualCount?: number;
  discrepancy: number;
  counted: boolean;
}

/**
 * Physical counts management component
 *
 * @returns Rendered physical counts view
 */
export default function PhysicalCountsContent() {
  const [counts, setCounts] = useState<PhysicalCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [selectedCount, setSelectedCount] = useState<PhysicalCount | null>(null);
  const [countItems, setCountItems] = useState<CountItem[]>([]);

  useEffect(() => {
    const loadCounts = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockCounts: PhysicalCount[] = [
          {
            id: '1',
            countDate: '2024-01-20',
            countedBy: 'Jane Doe',
            status: 'completed',
            location: 'Cabinet A',
            totalItems: 25,
            itemsCounted: 25,
            discrepanciesFound: 3,
            notes: 'Monthly inventory count',
            createdAt: '2024-01-20T10:00:00Z',
          },
          {
            id: '2',
            countDate: '2024-01-15',
            countedBy: 'John Smith',
            status: 'reviewed',
            totalItems: 15,
            itemsCounted: 15,
            discrepanciesFound: 1,
            createdAt: '2024-01-15T14:30:00Z',
          },
        ];

        setCounts(mockCounts);
      } catch (error) {
        console.error('Error loading physical counts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCounts();
  }, []);

  const startNewCount = () => {
    // TODO: Load items for counting
    const mockItems: CountItem[] = [
      {
        itemId: '1',
        itemName: 'Acetaminophen 500mg',
        sku: 'MED-001',
        expectedStock: 100,
        discrepancy: 0,
        counted: false,
      },
      {
        itemId: '2',
        itemName: 'Bandages (Adhesive)',
        sku: 'SUP-101',
        expectedStock: 15,
        discrepancy: 0,
        counted: false,
      },
    ];

    setCountItems(mockItems);
    setIsCreatingNew(true);
  };

  const handleCountInput = (itemId: string, count: number) => {
    setCountItems(items =>
      items.map(item =>
        item.itemId === itemId
          ? {
              ...item,
              actualCount: count,
              discrepancy: count - item.expectedStock,
              counted: true,
            }
          : item
      )
    );
  };

  const savePhysicalCount = () => {
    // TODO: Save count to API
    console.log('Saving physical count:', countItems);
    setIsCreatingNew(false);
    setCountItems([]);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'reviewed': 'bg-blue-100 text-blue-800',
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading physical counts...</p>
        </div>
      </div>
    );
  }

  if (isCreatingNew) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">New Physical Count</h1>
          <p className="text-gray-600 mt-2">Count actual inventory and record discrepancies</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Progress: <strong>{countItems.filter(i => i.counted).length} of {countItems.length}</strong> items counted
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(countItems.filter(i => i.counted).length / countItems.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-4">
            {countItems.map(item => (
              <div
                key={item.itemId}
                className={`p-4 rounded-lg border-2 ${
                  item.counted
                    ? item.discrepancy !== 0
                      ? 'border-orange-300 bg-orange-50'
                      : 'border-green-300 bg-green-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.itemName}</h3>
                    <p className="text-sm text-gray-600">{item.sku}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Expected: <strong>{item.expectedStock}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Actual Count
                      </label>
                      <input
                        type="number"
                        value={item.actualCount || ''}
                        onChange={(e) => handleCountInput(item.itemId, parseInt(e.target.value) || 0)}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>

                    {item.counted && item.discrepancy !== 0 && (
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Discrepancy</p>
                        <p className={`text-lg font-bold ${
                          item.discrepancy > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.discrepancy > 0 ? '+' : ''}{item.discrepancy}
                        </p>
                      </div>
                    )}

                    {item.counted && item.discrepancy === 0 && (
                      <span className="text-green-600 text-2xl">✓</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => {
                setIsCreatingNew(false);
                setCountItems([]);
              }}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={savePhysicalCount}
              disabled={countItems.some(item => !item.counted)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              Complete Count
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Physical Inventory Counts</h1>
          <p className="text-gray-600 mt-2">Track and manage physical inventory audits</p>
        </div>
        <button
          onClick={startNewCount}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Start New Count
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total Counts</p>
          <p className="text-3xl font-bold text-gray-900">{counts.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700 mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-900">
            {counts.filter(c => c.status === 'completed' || c.status === 'reviewed').length}
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-700 mb-1">Total Discrepancies</p>
          <p className="text-3xl font-bold text-orange-900">
            {counts.reduce((sum, c) => sum + c.discrepanciesFound, 0)}
          </p>
        </div>
      </div>

      {counts.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No physical counts"
          description="Start your first physical inventory count to audit stock levels"
          action={{ label: "Start New Count", onClick: startNewCount }}
        />
      ) : (
        <div className="space-y-4">
          {counts.map(count => (
            <div
              key={count.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Count #{count.id}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(count.status)}`}>
                      {count.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-gray-600">Count Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(count.countDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Counted By</p>
                      <p className="font-medium text-gray-900">{count.countedBy}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Items</p>
                      <p className="font-medium text-gray-900">
                        {count.itemsCounted} / {count.totalItems}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Discrepancies</p>
                      <p className={`font-bold ${count.discrepanciesFound > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                        {count.discrepanciesFound}
                      </p>
                    </div>
                  </div>

                  {count.location && (
                    <p className="text-sm text-gray-600">📍 {count.location}</p>
                  )}

                  {count.notes && (
                    <p className="text-sm text-gray-600 mt-2 italic">{count.notes}</p>
                  )}
                </div>

                <button
                  onClick={() => setSelectedCount(count)}
                  className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm transition-colors ml-4"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Export both named and default for flexibility
export { PhysicalCountsContent }
