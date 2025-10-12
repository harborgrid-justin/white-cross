/**
 * useInventoryData Hook
 *
 * Manages data fetching and state for inventory management
 *
 * @module hooks/useInventoryData
 */

import { useState, useEffect, useCallback } from 'react';
import { inventoryApi, vendorApi, purchaseOrderApi, budgetApi } from '../../../services/api';
import toast from 'react-hot-toast';
import type {
  InventoryTab,
  InventoryItem,
  InventoryAlert,
  Vendor,
  PurchaseOrder,
  BudgetCategory,
} from '../types';

interface UseInventoryDataParams {
  activeTab: InventoryTab;
  isRestored: boolean;
}

/**
 * Custom hook for managing inventory data
 */
export function useInventoryData({ activeTab, isRestored }: UseInventoryDataParams) {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Load data based on active tab
   */
  const loadData = useCallback(async () => {
    if (!isRestored) return;

    setLoading(true);
    try {
      switch (activeTab) {
        case 'items': {
          const [itemsData, alertsData] = await Promise.all([
            inventoryApi.getAll(),
            inventoryApi.getAlerts(),
          ]);
          setInventoryItems(itemsData.data?.items || []);
          setAlerts(alertsData.data?.alerts || []);
          break;
        }
        case 'vendors': {
          const vendorsData = await vendorApi.getAll();
          setVendors(vendorsData.data || []);
          break;
        }
        case 'orders': {
          const ordersData = await purchaseOrderApi.getAll();
          setPurchaseOrders(ordersData.data || []);
          break;
        }
        case 'budget': {
          const budgetData = await budgetApi.getBudget();
          setBudgetCategories(budgetData.data?.categories || []);
          break;
        }
        default:
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [activeTab, isRestored]);

  // Load data when tab changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Extract unique categories
  const categories = Array.from(new Set(inventoryItems.map((item) => item.category)));

  return {
    // Data
    inventoryItems,
    alerts,
    vendors,
    purchaseOrders,
    budgetCategories,
    categories,

    // Loading state
    loading,

    // Actions
    refetchData: loadData,
  };
}
