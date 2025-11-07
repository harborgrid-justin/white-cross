/**
 * Operations Domain Hooks
 *
 * Specialized hooks for inventory, reports, and settings management.
 */

import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../reduxStore';
import { useAppSelector } from './store-hooks-index';

import {
  inventoryActions,
  inventoryThunks,
  inventorySelectors,
  selectLowStockItems,
  selectExpiredItems,
} from '../slices/inventorySlice';

import {
  reportsActions,
  reportsThunks,
  reportsSelectors,
  selectReportsByType,
  selectRecentReports,
} from '../slices/reportsSlice';

import {
  settingsActions,
  settingsThunks,
  settingsSelectors,
} from '../slices/settingsSlice';

// =====================
// INVENTORY HOOKS
// =====================

/**
 * Hook that provides all inventory actions
 */
export const useInventoryActions = () => {
  const dispatch = useDispatch<AppDispatch>();

  return {
    fetchAll: (params?: any) => dispatch(inventoryThunks.fetchAll(params)),
    fetchById: (id: string) => dispatch(inventoryThunks.fetchById(id)),
    create: (data: any) => dispatch(inventoryThunks.create(data)),
    update: (params: { id: string; data: any }) => dispatch(inventoryThunks.update(params)),
    delete: (id: string) => dispatch(inventoryThunks.delete(id)),
  };
};

/**
 * Hook to get all inventory items
 */
export const useInventoryItems = () => useAppSelector((state) => inventorySelectors.selectAll(state));

/**
 * Hook to get low stock items
 */
export const useLowStockItems = () => useAppSelector((state) => selectLowStockItems(state));

/**
 * Hook to get expired items
 */
export const useExpiredItems = () => useAppSelector((state) => selectExpiredItems(state));

// =====================
// REPORTS HOOKS
// =====================

/**
 * Hook that provides all reports actions
 */
export const useReportsActions = () => {
  const dispatch = useDispatch<AppDispatch>();

  return {
    fetchAll: (params?: any) => dispatch(reportsThunks.fetchAll(params)),
    fetchById: (id: string) => dispatch(reportsThunks.fetchById(id)),
    create: (data: any) => dispatch(reportsThunks.create(data)),
  };
};

/**
 * Hook to get all reports
 */
export const useReports = () => useAppSelector((state) => reportsSelectors.selectAll(state));

// =====================
// SETTINGS HOOKS
// =====================

/**
 * Hook that provides all settings actions
 */
export const useSettingsActions = () => {
  const dispatch = useDispatch<AppDispatch>();

  return {
    fetchAll: (params?: any) => dispatch(settingsThunks.fetchAll(params)),
    update: (params: { id: string; data: any }) => dispatch(settingsThunks.update(params)),
  };
};

/**
 * Hook to get all settings
 */
export const useSettings = () => useAppSelector((state) => settingsSelectors.selectAll(state));
