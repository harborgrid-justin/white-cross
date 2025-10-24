/**
 * useMedicationsData Hook
 *
 * Custom hook for fetching and managing medications data across different tabs.
 * Handles medications list, inventory, reminders, and adverse reactions.
 *
 * @module pages/health/hooks/useMedicationsData
 */

import { useState, useEffect, useCallback } from 'react';
import { medicationsApi } from '../../../services';
import type {
  MedicationFilters,
  MedicationTab,
  Medication,
  MedicationInventoryItem,
  MedicationReminder,
  AdverseReaction,
  UseMedicationsDataReturn,
} from '../types';

interface UseMedicationsDataOptions {
  activeTab: MedicationTab;
  filters: MedicationFilters;
  page: number;
  pageSize: number;
  isRestored: boolean;
}

/**
 * Fetch and manage medications data
 *
 * @param options - Hook configuration options
 * @returns Medications data, loading states, and data management functions
 *
 * @example
 * const { medications, loading, refetch } = useMedicationsData({ activeTab, filters, page, pageSize, isRestored });
 */
export function useMedicationsData(options: UseMedicationsDataOptions): UseMedicationsDataReturn {
  const { activeTab, filters, page, pageSize, isRestored } = options;

  // Medications state
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medicationsLoading, setMedicationsLoading] = useState(false);
  const [medicationsFetching, setMedicationsFetching] = useState(false);

  // Inventory state
  const [inventory, setInventory] = useState<MedicationInventoryItem[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);

  // Reminders state
  const [reminders, setReminders] = useState<MedicationReminder[]>([]);
  const [remindersLoading, setRemindersLoading] = useState(false);

  // Adverse reactions state
  const [adverseReactions, setAdverseReactions] = useState<AdverseReaction[]>([]);
  const [adverseReactionsLoading, setAdverseReactionsLoading] = useState(false);

  /**
   * Load medications list
   */
  const loadMedications = useCallback(async () => {
    try {
      setMedicationsLoading(true);
      setMedicationsFetching(true);

      const response = await medicationsApi.getAll({
        page,
        limit: pageSize,
        search: filters.searchTerm,
        dosageForm: filters.dosageForm,
        isControlled: filters.controlledStatus === 'controlled' ? true :
                      filters.controlledStatus === 'non-controlled' ? false :
                      undefined,
      });

      const medicationsData = response.data?.medications || response.medications || [];
      setMedications(medicationsData);
    } catch (error) {
      console.error('Error loading medications:', error);
      setMedications([]);
    } finally {
      setMedicationsLoading(false);
      setMedicationsFetching(false);
    }
  }, [page, pageSize, filters]);

  /**
   * Load inventory data
   */
  const loadInventory = useCallback(async () => {
    try {
      setInventoryLoading(true);

      const response = await medicationsApi.getInventory?.();
      const inventoryData = response?.data || response || [];
      setInventory(inventoryData);
    } catch (error) {
      console.error('Error loading inventory:', error);
      setInventory([]);
    } finally {
      setInventoryLoading(false);
    }
  }, []);

  /**
   * Load reminders data
   */
  const loadReminders = useCallback(async () => {
    try {
      setRemindersLoading(true);

      const response = await medicationsApi.getReminders?.();
      const remindersData = response?.data || response || [];
      setReminders(remindersData);
    } catch (error) {
      console.error('Error loading reminders:', error);
      setReminders([]);
    } finally {
      setRemindersLoading(false);
    }
  }, []);

  /**
   * Load adverse reactions data
   */
  const loadAdverseReactions = useCallback(async () => {
    try {
      setAdverseReactionsLoading(true);

      const response = await medicationsApi.getAdverseReactions?.();
      const reactionsData = response?.data || response || [];
      setAdverseReactions(reactionsData);
    } catch (error) {
      console.error('Error loading adverse reactions:', error);
      setAdverseReactions([]);
    } finally {
      setAdverseReactionsLoading(false);
    }
  }, []);

  /**
   * Refetch all data
   */
  const refetch = useCallback(async () => {
    if (activeTab === 'medications' || activeTab === 'overview') {
      await loadMedications();
    }
    if (activeTab === 'inventory' || activeTab === 'overview') {
      await loadInventory();
    }
    if (activeTab === 'reminders' || activeTab === 'overview') {
      await loadReminders();
    }
    if (activeTab === 'adverse-reactions' || activeTab === 'overview') {
      await loadAdverseReactions();
    }
  }, [activeTab, loadMedications, loadInventory, loadReminders, loadAdverseReactions]);

  // Load data based on active tab
  useEffect(() => {
    if (!isRestored) return;

    switch (activeTab) {
      case 'overview':
        // Load all data for overview
        loadMedications();
        loadInventory();
        loadReminders();
        loadAdverseReactions();
        break;
      case 'medications':
        loadMedications();
        break;
      case 'inventory':
        loadInventory();
        break;
      case 'reminders':
        loadReminders();
        break;
      case 'adverse-reactions':
        loadAdverseReactions();
        break;
    }
  }, [activeTab, isRestored, loadMedications, loadInventory, loadReminders, loadAdverseReactions]);

  return {
    medications,
    medicationsLoading,
    medicationsFetching,
    inventory,
    inventoryLoading,
    reminders,
    remindersLoading,
    adverseReactions,
    adverseReactionsLoading,
    refetch,
  };
}
