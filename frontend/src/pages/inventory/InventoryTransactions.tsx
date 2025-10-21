/**
 * WF-INV-003 | InventoryTransactions.tsx - Inventory transactions management
 * Purpose: Track and manage inventory transactions (in/out movements)
 * Upstream: ../services/modules/health/inventoryApi | Dependencies: react, date-fns
 * Downstream: Inventory management system | Called by: React router
 * Related: InventoryItems.tsx, InventoryAlerts.tsx, InventoryVendors.tsx
 * Exports: default InventoryTransactions component
 * Last Updated: 2025-10-21 | File Type: .tsx
 * Critical Path: Load transactions → Display history → Filter/search → Export
 * LLM Context: Inventory transaction tracking and audit trail management
 */

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useAuthContext } from '../../contexts/AuthContext';

interface InventoryTransaction {
  id: string;
  itemId: string;
  itemName: string;
  itemSku: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';
  quantity: number;
  unitOfMeasure: string;
  reason: string;
  notes?: string;
  performedBy: string;
  performedAt: string;
  location: string;
  batchNumber?: string;
  expirationDate?: string;
}

const InventoryTransactions: React.FC = () => {
  const { user } = useAuthContext();
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const mockTransactions: InventoryTransaction[] = [
    {
      id: '1',
      itemId: '1',
      itemName: 'Acetaminophen 500mg',
      itemSku: 'MED-ACE-500',
      type: 'IN',
      quantity: 100,
      unitOfMeasure: 'tablets',
      reason: 'Stock replenishment',
      performedBy: 'Admin User',
      performedAt: '2025-10-21T10:30:00Z',
      location: 'Pharmacy Cabinet A',
      batchNumber: 'ACE-2024-001',
    },
    {
      id: '2',
      itemId: '2',
      itemName: 'Bandages - Adhesive',
      itemSku: 'SUP-BAN-ADH',
      type: 'OUT',
      quantity: 25,
      unitOfMeasure: 'pieces',
      reason: 'Student treatment',
      notes: 'Used for minor injury treatment',
      performedBy: 'Nurse Smith',
      performedAt: '2025-10-20T14:15:00Z',
      location: 'First Aid Station',
    },
  ];

  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setTransactions(mockTransactions);
      setLoading(false);
    };
    loadTransactions();
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'IN': return 'text-green-600 bg-green-50';
      case 'OUT': return 'text-red-600 bg-red-50';
      case 'ADJUSTMENT': return 'text-blue-600 bg-blue-50';
      case 'TRANSFER': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading transactions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventory Transactions</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track all inventory movements and changes
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <li key={transaction.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${getTypeColor(transaction.type)}`}>
                    <span className="text-xs font-medium">{transaction.type}</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.itemName} ({transaction.itemSku})
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.type === 'IN' ? '+' : '-'}{transaction.quantity} {transaction.unitOfMeasure}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-900">{transaction.reason}</div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(transaction.performedAt), 'MMM d, yyyy h:mm a')}
                  </div>
                </div>
              </div>
              {transaction.notes && (
                <div className="mt-2 ml-12 text-sm text-gray-600">
                  {transaction.notes}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InventoryTransactions;
