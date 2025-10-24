/**
 * WF-HOOK-277 | useInventoryData.ts - Inventory data management hook
 * Purpose: Custom hook for fetching and managing inventory data
 * Last Updated: 2025-10-24 | File Type: .ts
 */

import { useState, useEffect } from 'react';
import type {
  InventoryItem,
  InventoryAlert,
  Vendor,
  PurchaseOrder,
  BudgetCategory,
  InventoryTab
} from '../types';

/**
 * Hook parameters interface
 * @interface UseInventoryDataParams
 */
interface UseInventoryDataParams {
  /** Active tab to determine what data to fetch */
  activeTab: InventoryTab;
  /** Whether filters have been restored from storage */
  isRestored: boolean;
}

/**
 * Hook return type interface
 * @interface UseInventoryDataReturn
 */
interface UseInventoryDataReturn {
  /** Array of inventory items */
  inventoryItems: InventoryItem[];
  /** Array of inventory alerts */
  alerts: InventoryAlert[];
  /** Array of vendors */
  vendors: Vendor[];
  /** Array of purchase orders */
  purchaseOrders: PurchaseOrder[];
  /** Array of budget categories */
  budgetCategories: BudgetCategory[];
  /** Array of unique categories */
  categories: string[];
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: string | null;
  /** Function to refetch data */
  refetchData: () => void;
}

/**
 * Custom hook for managing inventory data
 * Fetches and manages all inventory-related data including items, alerts,
 * vendors, purchase orders, and budget information.
 *
 * @param {UseInventoryDataParams} params - Hook parameters
 * @returns {UseInventoryDataReturn} Inventory data and control functions
 *
 * @example
 * ```tsx
 * const {
 *   inventoryItems,
 *   alerts,
 *   vendors,
 *   loading,
 *   refetchData
 * } = useInventoryData({
 *   activeTab: 'items',
 *   isRestored: true
 * });
 * ```
 */
export const useInventoryData = ({
  activeTab,
  isRestored
}: UseInventoryDataParams): UseInventoryDataReturn => {
  // State management
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches inventory items from the API
   * @private
   */
  const fetchInventoryItems = async (): Promise<void> => {
    try {
      // TODO: Replace with actual API call
      // const response = await inventoryApi.getItems();
      // setInventoryItems(response.data);

      // Mock data for now
      setInventoryItems([
        {
          id: '1',
          name: 'Bandages',
          category: 'Medical Supplies',
          quantity: 150,
          reorderLevel: 50,
          unitPrice: 2.5,
          supplier: 'MedSupply Co',
          lastUpdated: new Date(),
          status: 'in-stock'
        },
        {
          id: '2',
          name: 'Thermometers',
          category: 'Medical Equipment',
          quantity: 25,
          reorderLevel: 30,
          unitPrice: 15.0,
          supplier: 'Healthcare Tech',
          lastUpdated: new Date(),
          status: 'low-stock'
        }
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inventory items');
    }
  };

  /**
   * Fetches inventory alerts from the API
   * @private
   */
  const fetchAlerts = async (): Promise<void> => {
    try {
      // TODO: Replace with actual API call
      // const response = await inventoryApi.getAlerts();
      // setAlerts(response.data);

      // Mock data for now
      setAlerts([
        {
          id: '1',
          itemId: '2',
          itemName: 'Thermometers',
          alertType: 'low-stock',
          severity: 'warning',
          message: 'Stock level below reorder threshold',
          createdAt: new Date()
        }
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
    }
  };

  /**
   * Fetches vendors from the API
   * @private
   */
  const fetchVendors = async (): Promise<void> => {
    try {
      // TODO: Replace with actual API call
      // const response = await inventoryApi.getVendors();
      // setVendors(response.data);

      // Mock data for now
      setVendors([
        {
          id: '1',
          name: 'MedSupply Co',
          contactPerson: 'John Doe',
          email: 'john@medsupply.com',
          phone: '555-0123',
          address: '123 Medical Way',
          productsSupplied: ['Bandages', 'Gauze', 'Tape'],
          rating: 4.5,
          status: 'active'
        }
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vendors');
    }
  };

  /**
   * Fetches purchase orders from the API
   * @private
   */
  const fetchPurchaseOrders = async (): Promise<void> => {
    try {
      // TODO: Replace with actual API call
      // const response = await inventoryApi.getPurchaseOrders();
      // setPurchaseOrders(response.data);

      // Mock data for now
      setPurchaseOrders([
        {
          id: '1',
          orderNumber: 'PO-2024-001',
          vendorId: '1',
          vendorName: 'MedSupply Co',
          items: [
            { itemId: '1', itemName: 'Bandages', quantity: 100, unitPrice: 2.5 }
          ],
          totalAmount: 250.0,
          status: 'PENDING',
          orderDate: new Date(),
          expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch purchase orders');
    }
  };

  /**
   * Fetches budget categories from the API
   * @private
   */
  const fetchBudgetCategories = async (): Promise<void> => {
    try {
      // TODO: Replace with actual API call
      // const response = await inventoryApi.getBudgetCategories();
      // setBudgetCategories(response.data);

      // Mock data for now
      setBudgetCategories([
        {
          id: '1',
          name: 'Medical Supplies',
          allocated: 10000,
          spent: 6500,
          remaining: 3500,
          percentage: 65
        },
        {
          id: '2',
          name: 'Medical Equipment',
          allocated: 5000,
          spent: 2000,
          remaining: 3000,
          percentage: 40
        }
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch budget categories');
    }
  };

  /**
   * Fetches all data based on active tab
   */
  const fetchData = async (): Promise<void> => {
    if (!isRestored) return;

    setLoading(true);
    setError(null);

    try {
      // Always fetch basic items and alerts
      await Promise.all([
        fetchInventoryItems(),
        fetchAlerts()
      ]);

      // Fetch additional data based on active tab
      switch (activeTab) {
        case 'vendors':
          await fetchVendors();
          break;
        case 'orders':
          await fetchPurchaseOrders();
          break;
        case 'budget':
          await fetchBudgetCategories();
          break;
        case 'analytics':
          // Fetch analytics data
          break;
        default:
          // Items tab - data already fetched
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Extract unique categories from inventory items
   */
  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(inventoryItems.map(item => item.category))
    ).sort();
    setCategories(uniqueCategories);
  }, [inventoryItems]);

  /**
   * Fetch data when dependencies change
   */
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isRestored]);

  /**
   * Refetch data manually
   */
  const refetchData = (): void => {
    fetchData();
  };

  return {
    inventoryItems,
    alerts,
    vendors,
    purchaseOrders,
    budgetCategories,
    categories,
    loading,
    error,
    refetchData
  };
};
