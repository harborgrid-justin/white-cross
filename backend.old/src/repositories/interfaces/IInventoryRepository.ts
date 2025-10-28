/**
 * Inventory Repository Interface
 * @description Repository interface for medication inventory entity operations
 * Extends base repository with inventory-specific methods
 */

import { IRepository } from './IRepository';

/**
 * Medication inventory entity type (matches database model)
 */
export interface MedicationInventory {
  id: string;
  medicationId: string;
  quantity: number;
  unit: string;
  batchNumber: string;
  lotNumber?: string;
  expirationDate: Date;
  receivedDate: Date;
  location: string;
  reorderLevel: number;
  reorderQuantity: number;
  vendorId?: string;
  cost?: number;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Inventory repository interface
 */
export interface IInventoryRepository extends IRepository<MedicationInventory> {
  /**
   * Find all inventory items for a medication
   * @param medicationId - Medication ID
   * @returns Promise resolving to inventory items
   */
  findByMedication(medicationId: string): Promise<MedicationInventory[]>;

  /**
   * Find inventory items below reorder level
   * @param threshold - Optional custom threshold multiplier (default: 1.0)
   * @returns Promise resolving to low stock items
   */
  findLowStock(threshold?: number): Promise<MedicationInventory[]>;

  /**
   * Find inventory items expiring within specified days
   * @param days - Number of days from now
   * @returns Promise resolving to expiring items
   */
  findExpiring(days: number): Promise<MedicationInventory[]>;

  /**
   * Find inventory by batch number
   * @param batchNumber - Batch number
   * @returns Promise resolving to inventory items with batch number
   */
  findByBatchNumber(batchNumber: string): Promise<MedicationInventory[]>;

  /**
   * Find inventory by lot number
   * @param lotNumber - Lot number
   * @returns Promise resolving to inventory items with lot number
   */
  findByLotNumber(lotNumber: string): Promise<MedicationInventory[]>;

  /**
   * Find inventory by location
   * @param location - Storage location
   * @returns Promise resolving to inventory at location
   */
  findByLocation(location: string): Promise<MedicationInventory[]>;

  /**
   * Find inventory by vendor
   * @param vendorId - Vendor ID
   * @returns Promise resolving to inventory from vendor
   */
  findByVendor(vendorId: string): Promise<MedicationInventory[]>;

  /**
   * Get total quantity for a medication
   * @param medicationId - Medication ID
   * @returns Promise resolving to total quantity
   */
  getTotalQuantityByMedication(medicationId: string): Promise<number>;

  /**
   * Get inventory alerts (low stock + expiring)
   * @param expiringDays - Days ahead for expiration check (default: 30)
   * @returns Promise resolving to inventory alerts
   */
  getInventoryAlerts(expiringDays?: number): Promise<InventoryAlert[]>;

  /**
   * Check if batch number exists
   * @param batchNumber - Batch number
   * @param excludeId - ID to exclude from check (for updates)
   * @returns Promise resolving to true if exists
   */
  batchNumberExists(batchNumber: string, excludeId?: string): Promise<boolean>;

  /**
   * Update inventory quantity
   * @param id - Inventory ID
   * @param quantityChange - Amount to add (positive) or subtract (negative)
   * @returns Promise resolving to updated inventory
   */
  updateQuantity(id: string, quantityChange: number): Promise<MedicationInventory>;

  /**
   * Get inventory value by medication
   * @param medicationId - Optional medication ID (null for all)
   * @returns Promise resolving to inventory value
   */
  getInventoryValue(medicationId?: string): Promise<number>;

  /**
   * Get inventory statistics
   * @returns Promise resolving to inventory statistics
   */
  getInventoryStatistics(): Promise<InventoryStatistics>;

  /**
   * Find expired inventory items
   * @returns Promise resolving to expired items
   */
  findExpired(): Promise<MedicationInventory[]>;

  /**
   * Find inventory items received within date range
   * @param startDate - Range start date
   * @param endDate - Range end date
   * @returns Promise resolving to inventory items
   */
  findReceivedBetween(startDate: Date, endDate: Date): Promise<MedicationInventory[]>;
}

/**
 * Filters for inventory queries
 */
export interface InventoryFilters {
  medicationId?: string;
  location?: string;
  vendorId?: string;
  isActive?: boolean;
  lowStock?: boolean;
  expiringSoon?: number; // days
}

/**
 * Inventory alert
 */
export interface InventoryAlert {
  type: 'LOW_STOCK' | 'EXPIRING_SOON' | 'EXPIRED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  inventory: MedicationInventory;
  medication?: any;
  message: string;
  daysUntilExpiration?: number;
  quantityBelow?: number;
}

/**
 * Inventory statistics
 */
export interface InventoryStatistics {
  totalItems: number;
  totalValue: number;
  lowStockCount: number;
  expiringCount: number;
  expiredCount: number;
  totalQuantity: number;
  uniqueMedications: number;
}

/**
 * Data for creating a new inventory item
 */
export interface CreateInventoryData {
  medicationId: string;
  quantity: number;
  unit: string;
  batchNumber: string;
  lotNumber?: string;
  expirationDate: Date;
  receivedDate: Date;
  location: string;
  reorderLevel: number;
  reorderQuantity: number;
  vendorId?: string;
  cost?: number;
  notes?: string;
}

/**
 * Data for updating an inventory item
 */
export interface UpdateInventoryData extends Partial<CreateInventoryData> {
  isActive?: boolean;
}
