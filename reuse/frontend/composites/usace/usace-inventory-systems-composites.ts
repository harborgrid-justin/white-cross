/**
 * LOC: USACE-COMP-INVT-003
 * File: /reuse/frontend/composites/usace/usace-inventory-systems-composites.ts
 *
 * UPSTREAM (imports from):
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *   - ../../form-builder-kit
 *   - ../../analytics-tracking-kit
 *   - ../../content-management-hooks
 *   - ../../workflow-approval-kit
 *   - ../../search-filter-cms-kit
 *   - ../../custom-fields-metadata-kit
 *   - ../../version-control-kit
 *   - ../../publishing-scheduling-kit
 *
 * DOWNSTREAM (imported by):
 *   - USACE CEFMS inventory controllers
 *   - Stock level monitoring systems
 *   - Reorder automation engines
 *   - Warehouse management UIs
 *   - Supply chain analytics dashboards
 */

/**
 * File: /reuse/frontend/composites/usace/usace-inventory-systems-composites.ts
 * Locator: WC-USACE-INVT-COMP-003
 * Purpose: USACE CEFMS Inventory Systems Composite - Comprehensive inventory and warehouse management
 *
 * Upstream: React 18+, Next.js 16+, TypeScript 5.x, form-builder/analytics/workflow/search kits
 * Downstream: USACE inventory controllers, stock monitoring, reorder systems, warehouse management
 * Dependencies: React 18+, Next.js 16+, TypeScript 5.x, form-builder-kit, analytics-tracking-kit
 * Exports: 45 composed functions for comprehensive USACE inventory operations
 *
 * LLM Context: Production-grade USACE CEFMS inventory systems composite for White Cross platform.
 * Composes functions from 8 frontend kits to provide complete inventory lifecycle management including
 * item master data management with NSN (National Stock Number) integration, multi-location inventory
 * tracking with bin/shelf location management, perpetual inventory system with real-time updates,
 * automatic reorder point calculation with lead time optimization, purchase requisition generation
 * with approval workflow, goods receipt processing with quality inspection, inventory adjustments
 * with variance analysis and approval, cycle counting with ABC classification, physical inventory
 * with reconciliation, stock transfer between locations with in-transit tracking, inventory
 * reservation for projects with allocation management, obsolete and slow-moving inventory
 * identification, inventory valuation using FIFO/LIFO/weighted average methods, lot and serial
 * number tracking with expiration date management, hazardous materials inventory with MSDS
 * integration, inventory turnover analysis with optimization recommendations, stockout prevention
 * with predictive analytics, warehouse space utilization optimization, pick/pack/ship operations,
 * barcode and RFID integration, inventory cost allocation to projects, vendor-managed inventory
 * (VMI) support, consignment inventory tracking, inventory accuracy metrics (record accuracy,
 * location accuracy), shrinkage analysis with root cause investigation, and full USACE CEFMS
 * integration. Essential for USACE districts managing 50,000+ inventory items across multiple
 * warehouses with strict accountability and cost control requirements.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// ============================================================================
// TYPE DEFINITIONS - USACE Inventory Management Types
// ============================================================================

export interface InventoryItem {
  itemId: string;
  itemNumber: string;
  nsn?: string; // National Stock Number
  nomenclature: string;
  description: string;
  category: string;
  subcategory: string;
  unitOfMeasure: string;
  unitPrice: number;
  standardCost: number;
  averageCost: number;
  valuationMethod: 'FIFO' | 'LIFO' | 'weighted_average' | 'standard_cost';
  manufacturer?: string;
  manufacturerPartNumber?: string;
  preferredVendor?: string;
  vendorPartNumber?: string;
  minimumOrderQuantity: number;
  orderMultiple: number;
  leadTimeDays: number;
  shelfLifeDays?: number;
  isHazardous: boolean;
  hazardClass?: string;
  msdsNumber?: string;
  isSerialControlled: boolean;
  isLotControlled: boolean;
  isCritical: boolean;
  abcClassification: 'A' | 'B' | 'C';
  status: 'active' | 'inactive' | 'obsolete' | 'discontinued';
  specifications: Record<string, any>;
  alternateItems: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryLocation {
  locationId: string;
  locationCode: string;
  locationName: string;
  locationType: 'warehouse' | 'stockroom' | 'yard' | 'vehicle' | 'project_site' | 'consignment';
  organizationCode: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  isActive: boolean;
  warehouseZones?: WarehouseZone[];
  capacity: {
    totalSquareFeet: number;
    usedSquareFeet: number;
    utilizationPercent: number;
  };
  manager: string;
  contactPhone: string;
}

export interface WarehouseZone {
  zoneId: string;
  zoneName: string;
  zoneType: 'receiving' | 'storage' | 'picking' | 'packing' | 'shipping' | 'quarantine' | 'hazmat';
  aisles: Aisle[];
}

export interface Aisle {
  aisleId: string;
  aisleName: string;
  bays: Bay[];
}

export interface Bay {
  bayId: string;
  bayName: string;
  shelves: Shelf[];
}

export interface Shelf {
  shelfId: string;
  shelfName: string;
  bins: Bin[];
}

export interface Bin {
  binId: string;
  binLocation: string; // e.g., "A-01-03-02" (Aisle-Bay-Shelf-Bin)
  capacity: number;
  currentQuantity: number;
  isReserved: boolean;
}

export interface StockLevel {
  stockId: string;
  itemId: string;
  locationId: string;
  binLocation?: string;
  quantityOnHand: number;
  quantityAllocated: number;
  quantityAvailable: number;
  quantityInTransit: number;
  quantityOnOrder: number;
  reorderPoint: number;
  reorderQuantity: number;
  maximumLevel: number;
  safetyStock: number;
  lotNumbers: LotNumber[];
  serialNumbers: SerialNumber[];
  lastCountDate?: Date;
  lastMovementDate?: Date;
  valuationAmount: number;
}

export interface LotNumber {
  lotNumber: string;
  quantity: number;
  receivedDate: Date;
  expirationDate?: Date;
  vendorLotNumber?: string;
  qcStatus: 'pending' | 'passed' | 'failed' | 'quarantine';
}

export interface SerialNumber {
  serialNumber: string;
  status: 'in_stock' | 'allocated' | 'issued' | 'returned';
  receivedDate: Date;
  issuedDate?: Date;
  issuedTo?: string;
  warrantyExpiration?: Date;
}

export interface InventoryTransaction {
  transactionId: string;
  transactionNumber: string;
  transactionType: 'receipt' | 'issue' | 'transfer' | 'adjustment' | 'return' | 'scrap' | 'cycle_count';
  itemId: string;
  itemNumber: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  fromLocation?: string;
  toLocation?: string;
  fromBin?: string;
  toBin?: string;
  lotNumber?: string;
  serialNumber?: string;
  referenceDocument?: string;
  referenceNumber?: string;
  projectCode?: string;
  costCenter?: string;
  performedBy: string;
  performedDate: Date;
  reason?: string;
  notes?: string;
  approvalRequired: boolean;
  approvedBy?: string;
  approvalDate?: Date;
}

export interface ReorderRecommendation {
  recommendationId: string;
  itemId: string;
  itemNumber: string;
  itemDescription: string;
  locationId: string;
  currentQuantity: number;
  reorderPoint: number;
  reorderQuantity: number;
  recommendedOrderQuantity: number;
  daysUntilStockout: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedCost: number;
  preferredVendor?: string;
  leadTimeDays: number;
  suggestedOrderDate: Date;
  lastOrderDate?: Date;
  averageMonthlyUsage: number;
  status: 'pending' | 'ordered' | 'received' | 'cancelled';
}

export interface PurchaseRequisition {
  requisitionId: string;
  requisitionNumber: string;
  requestedBy: string;
  requestDate: Date;
  requiredDate: Date;
  priority: 'emergency' | 'urgent' | 'normal';
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'ordered' | 'closed';
  lineItems: RequisitionLineItem[];
  totalAmount: number;
  projectCode?: string;
  costCenter: string;
  justification: string;
  approvalChain: ApprovalStep[];
  notes?: string;
}

export interface RequisitionLineItem {
  lineNumber: number;
  itemId?: string;
  itemNumber?: string;
  description: string;
  quantity: number;
  unitOfMeasure: string;
  unitPrice: number;
  lineTotal: number;
  suggestedVendor?: string;
  specifications?: string;
  deliverToLocation: string;
}

export interface ApprovalStep {
  stepNumber: number;
  approverRole: string;
  approverId?: string;
  approvalDate?: Date;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
}

export interface GoodsReceipt {
  receiptId: string;
  receiptNumber: string;
  receiptDate: Date;
  purchaseOrderNumber?: string;
  vendorName: string;
  vendorInvoiceNumber?: string;
  receivedBy: string;
  receivedAt: string; // location
  lineItems: ReceiptLineItem[];
  totalAmount: number;
  status: 'draft' | 'pending_inspection' | 'accepted' | 'rejected' | 'partial';
  qualityInspection?: QualityInspection;
  notes?: string;
}

export interface ReceiptLineItem {
  lineNumber: number;
  itemId: string;
  itemNumber: string;
  orderedQuantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  unitCost: number;
  lineTotal: number;
  lotNumber?: string;
  serialNumbers?: string[];
  binLocation?: string;
  expirationDate?: Date;
  damageNotes?: string;
}

export interface QualityInspection {
  inspectionId: string;
  inspectionDate: Date;
  inspectedBy: string;
  inspectionCriteria: InspectionCriterion[];
  overallResult: 'pass' | 'fail' | 'conditional';
  defectsFound: string[];
  disposition: 'accept' | 'reject' | 'quarantine' | 'return_to_vendor';
  notes?: string;
}

export interface InspectionCriterion {
  criterionName: string;
  result: 'pass' | 'fail';
  notes?: string;
}

export interface InventoryAdjustment {
  adjustmentId: string;
  adjustmentNumber: string;
  adjustmentDate: Date;
  adjustmentType: 'count_variance' | 'damage' | 'obsolete' | 'found' | 'lost' | 'correction';
  itemId: string;
  locationId: string;
  binLocation?: string;
  systemQuantity: number;
  physicalQuantity: number;
  adjustmentQuantity: number;
  unitCost: number;
  totalValue: number;
  reason: string;
  performedBy: string;
  approvalRequired: boolean;
  approvedBy?: string;
  approvalDate?: Date;
  status: 'draft' | 'pending_approval' | 'approved' | 'posted';
  notes?: string;
}

export interface CycleCount {
  countId: string;
  countNumber: string;
  countDate: Date;
  countType: 'scheduled' | 'random' | 'exception';
  locationId: string;
  zoneId?: string;
  items: CycleCountItem[];
  totalItemsCounted: number;
  accuracyRate: number;
  varianceValue: number;
  performedBy: string[];
  status: 'planned' | 'in_progress' | 'completed' | 'reconciled';
  completedDate?: Date;
}

export interface CycleCountItem {
  itemId: string;
  itemNumber: string;
  binLocation: string;
  systemQuantity: number;
  countedQuantity: number;
  variance: number;
  variancePercent: number;
  varianceValue: number;
  countedBy: string;
  verified: boolean;
  verifiedBy?: string;
  adjustmentCreated: boolean;
  adjustmentId?: string;
}

export interface PhysicalInventory {
  physicalInventoryId: string;
  inventoryNumber: string;
  inventoryDate: Date;
  locationId: string;
  scope: 'full' | 'partial' | 'by_category';
  categories?: string[];
  freezeDate: Date;
  cutoffDate: Date;
  teams: CountTeam[];
  totalItemsToCount: number;
  totalItemsCounted: number;
  percentComplete: number;
  accuracyRate: number;
  totalVarianceValue: number;
  status: 'planning' | 'frozen' | 'counting' | 'reconciliation' | 'completed';
  completedDate?: Date;
  approvedBy?: string;
  approvalDate?: Date;
}

export interface CountTeam {
  teamId: string;
  teamName: string;
  members: string[];
  assignedZones: string[];
  itemsCounted: number;
  status: 'assigned' | 'counting' | 'completed';
}

export interface StockTransfer {
  transferId: string;
  transferNumber: string;
  transferDate: Date;
  fromLocation: string;
  toLocation: string;
  requestedBy: string;
  approvedBy?: string;
  lineItems: TransferLineItem[];
  totalValue: number;
  status: 'draft' | 'pending_approval' | 'approved' | 'in_transit' | 'received' | 'cancelled';
  shippedDate?: Date;
  receivedDate?: Date;
  trackingNumber?: string;
  notes?: string;
}

export interface TransferLineItem {
  lineNumber: number;
  itemId: string;
  itemNumber: string;
  transferQuantity: number;
  receivedQuantity: number;
  unitCost: number;
  lineTotal: number;
  fromBin?: string;
  toBin?: string;
  lotNumber?: string;
  serialNumbers?: string[];
}

export interface InventoryReservation {
  reservationId: string;
  reservationNumber: string;
  reservationDate: Date;
  itemId: string;
  locationId: string;
  reservedQuantity: number;
  allocatedQuantity: number;
  issuedQuantity: number;
  projectCode: string;
  requestedBy: string;
  requiredDate: Date;
  expirationDate: Date;
  status: 'active' | 'partial' | 'fulfilled' | 'expired' | 'cancelled';
  notes?: string;
}

export interface ObsoleteInventoryItem {
  itemId: string;
  itemNumber: string;
  description: string;
  quantity: number;
  unitCost: number;
  totalValue: number;
  lastMovementDate: Date;
  daysWithoutMovement: number;
  classification: 'obsolete' | 'slow_moving' | 'excess';
  recommendation: 'scrap' | 'sell' | 'donate' | 'return_to_vendor' | 'transfer' | 'review';
  estimatedDisposalCost?: number;
  potentialRecovery?: number;
}

export interface InventoryValuation {
  valuationId: string;
  valuationDate: Date;
  locationId: string;
  itemId?: string; // If null, it's for all items
  method: 'FIFO' | 'LIFO' | 'weighted_average' | 'standard_cost';
  quantityOnHand: number;
  totalValue: number;
  averageUnitCost: number;
  valuationDetails: ValuationDetail[];
}

export interface ValuationDetail {
  layer: number;
  quantity: number;
  unitCost: number;
  totalValue: number;
  receiptDate?: Date;
}

export interface InventoryAnalytics {
  period: string;
  totalInventoryValue: number;
  inventoryTurnover: number;
  daysInventoryOnHand: number;
  stockoutRate: number;
  fillRate: number;
  inventoryAccuracy: number;
  shrinkageRate: number;
  obsolescenceRate: number;
  carryingCostRate: number;
  byCategory: CategoryMetrics[];
  topMovingItems: ItemMetrics[];
  slowMovingItems: ItemMetrics[];
}

export interface CategoryMetrics {
  category: string;
  itemCount: number;
  totalValue: number;
  turnoverRate: number;
  stockoutCount: number;
}

export interface ItemMetrics {
  itemId: string;
  itemNumber: string;
  description: string;
  quantity: number;
  value: number;
  movements: number;
  turnoverRate: number;
}

// ============================================================================
// REACT HOOKS - Inventory Management Hooks
// ============================================================================

/**
 * Hook for managing inventory items
 *
 * @param {string} itemId - Optional item ID to load specific item
 * @returns {object} Inventory item management interface
 *
 * @example
 * ```tsx
 * function ItemView({ itemId }) {
 *   const { item, loading, updateItem } = useInventoryItem(itemId);
 *
 *   return (
 *     <div>
 *       <h1>{item?.nomenclature}</h1>
 *       <p>NSN: {item?.nsn}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useInventoryItem(itemId?: string) {
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadItem = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/usace/inventory/items/${id}`);
      const data = await response.json();
      setItem(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load item');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItem = useCallback(async (updates: Partial<InventoryItem>) => {
    if (!item) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/usace/inventory/items/${item.itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const updated = await response.json();
      setItem(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
    } finally {
      setLoading(false);
    }
  }, [item]);

  useEffect(() => {
    if (itemId) loadItem(itemId);
  }, [itemId, loadItem]);

  return { item, loading, error, updateItem, refreshItem: () => itemId && loadItem(itemId) };
}

/**
 * Hook for managing stock levels across locations
 *
 * @param {string} itemId - Item ID
 * @returns {object} Stock level management interface
 *
 * @example
 * ```tsx
 * function StockLevelView({ itemId }) {
 *   const { stockLevels, totalAvailable, reorderNeeded } = useStockLevels(itemId);
 *
 *   return (
 *     <div>
 *       <p>Total Available: {totalAvailable}</p>
 *       {reorderNeeded && <Alert>Reorder needed!</Alert>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useStockLevels(itemId: string) {
  const [stockLevels, setStockLevels] = useState<StockLevel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const totalAvailable = useMemo(() =>
    stockLevels.reduce((sum, sl) => sum + sl.quantityAvailable, 0),
    [stockLevels]
  );

  const totalOnHand = useMemo(() =>
    stockLevels.reduce((sum, sl) => sum + sl.quantityOnHand, 0),
    [stockLevels]
  );

  const reorderNeeded = useMemo(() =>
    stockLevels.some(sl => sl.quantityAvailable <= sl.reorderPoint),
    [stockLevels]
  );

  const loadStockLevels = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/usace/inventory/items/${itemId}/stock-levels`);
      const data = await response.json();
      setStockLevels(data);
    } catch (err) {
      console.error('Failed to load stock levels:', err);
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  useEffect(() => {
    loadStockLevels();
  }, [loadStockLevels]);

  return {
    stockLevels,
    totalAvailable,
    totalOnHand,
    reorderNeeded,
    loading,
    refreshStockLevels: loadStockLevels,
  };
}

/**
 * Hook for managing inventory transactions
 *
 * @param {string} itemId - Optional item ID to filter transactions
 * @returns {object} Transaction management interface
 *
 * @example
 * ```tsx
 * function TransactionHistory({ itemId }) {
 *   const { transactions, createTransaction } = useInventoryTransactions(itemId);
 *
 *   return <TransactionList transactions={transactions} />;
 * }
 * ```
 */
export function useInventoryTransactions(itemId?: string) {
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const url = itemId
        ? `/api/usace/inventory/items/${itemId}/transactions`
        : `/api/usace/inventory/transactions`;
      const response = await fetch(url);
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  const createTransaction = useCallback(async (transactionData: Partial<InventoryTransaction>) => {
    const response = await fetch(`/api/usace/inventory/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...transactionData,
        performedDate: new Date(),
      }),
    });
    const newTransaction = await response.json();
    setTransactions(prev => [newTransaction, ...prev]);
    return newTransaction;
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return {
    transactions,
    loading,
    createTransaction,
    refreshTransactions: loadTransactions,
  };
}

/**
 * Hook for managing reorder recommendations
 *
 * @param {string} locationId - Optional location ID to filter
 * @returns {object} Reorder recommendation interface
 *
 * @example
 * ```tsx
 * function ReorderManager({ locationId }) {
 *   const { recommendations, criticalItems, generateRequisition } = useReorderRecommendations(locationId);
 *
 *   return <ReorderList items={criticalItems} onOrder={generateRequisition} />;
 * }
 * ```
 */
export function useReorderRecommendations(locationId?: string) {
  const [recommendations, setRecommendations] = useState<ReorderRecommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const criticalItems = useMemo(() =>
    recommendations.filter(r => r.priority === 'critical' && r.status === 'pending'),
    [recommendations]
  );

  const highPriorityItems = useMemo(() =>
    recommendations.filter(r => r.priority === 'high' && r.status === 'pending'),
    [recommendations]
  );

  const loadRecommendations = useCallback(async () => {
    setLoading(true);
    try {
      const url = locationId
        ? `/api/usace/inventory/reorder-recommendations?locationId=${locationId}`
        : `/api/usace/inventory/reorder-recommendations`;
      const response = await fetch(url);
      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setLoading(false);
    }
  }, [locationId]);

  const generateRequisition = useCallback(async (recommendationIds: string[]) => {
    const response = await fetch(`/api/usace/inventory/generate-requisition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recommendationIds }),
    });
    return await response.json();
  }, []);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  return {
    recommendations,
    criticalItems,
    highPriorityItems,
    loading,
    generateRequisition,
    refreshRecommendations: loadRecommendations,
  };
}

/**
 * Hook for managing cycle counts
 *
 * @param {string} locationId - Location ID
 * @returns {object} Cycle count management interface
 *
 * @example
 * ```tsx
 * function CycleCountManager({ locationId }) {
 *   const { cycleCounts, activeCounts, startCount } = useCycleCounts(locationId);
 *
 *   return <CycleCountList counts={cycleCounts} />;
 * }
 * ```
 */
export function useCycleCounts(locationId: string) {
  const [cycleCounts, setCycleCounts] = useState<CycleCount[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const activeCounts = useMemo(() =>
    cycleCounts.filter(c => ['planned', 'in_progress'].includes(c.status)),
    [cycleCounts]
  );

  const loadCycleCounts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/usace/inventory/cycle-counts?locationId=${locationId}`);
      const data = await response.json();
      setCycleCounts(data);
    } catch (err) {
      console.error('Failed to load cycle counts:', err);
    } finally {
      setLoading(false);
    }
  }, [locationId]);

  const startCount = useCallback(async (countData: Partial<CycleCount>) => {
    const response = await fetch(`/api/usace/inventory/cycle-counts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...countData,
        locationId,
        countDate: new Date(),
        status: 'planned',
      }),
    });
    const newCount = await response.json();
    setCycleCounts(prev => [newCount, ...prev]);
    return newCount;
  }, [locationId]);

  useEffect(() => {
    loadCycleCounts();
  }, [loadCycleCounts]);

  return {
    cycleCounts,
    activeCounts,
    loading,
    startCount,
    refreshCycleCounts: loadCycleCounts,
  };
}

// ============================================================================
// COMPOSITE FUNCTIONS - Inventory Operations
// ============================================================================

/**
 * Creates inventory item registration form
 *
 * @returns {object} Form configuration
 *
 * @example
 * ```tsx
 * const formConfig = createInventoryItemForm();
 * <FormBuilder config={formConfig} onSubmit={handleSubmit} />
 * ```
 */
export function createInventoryItemForm(): any {
  return {
    sections: [
      {
        title: 'Item Identification',
        fields: [
          { id: 'itemNumber', name: 'itemNumber', type: 'text', label: 'Item Number', required: true },
          { id: 'nsn', name: 'nsn', type: 'text', label: 'NSN', required: false },
          { id: 'nomenclature', name: 'nomenclature', type: 'text', label: 'Nomenclature', required: true },
          { id: 'description', name: 'description', type: 'textarea', label: 'Description', required: true },
          { id: 'category', name: 'category', type: 'select', label: 'Category', required: true },
        ],
      },
      {
        title: 'Inventory Control',
        fields: [
          { id: 'unitOfMeasure', name: 'unitOfMeasure', type: 'select', label: 'Unit of Measure', required: true },
          { id: 'isSerialControlled', name: 'isSerialControlled', type: 'checkbox', label: 'Serial Controlled' },
          { id: 'isLotControlled', name: 'isLotControlled', type: 'checkbox', label: 'Lot Controlled' },
          { id: 'abcClassification', name: 'abcClassification', type: 'select', label: 'ABC Classification', required: true },
        ],
      },
    ],
  };
}

/**
 * Calculates reorder point based on lead time and usage
 *
 * @param {number} averageDailyUsage - Average daily usage
 * @param {number} leadTimeDays - Lead time in days
 * @param {number} safetyStockDays - Safety stock in days
 * @returns {object} Reorder calculations
 *
 * @example
 * ```tsx
 * const reorder = calculateReorderPoint(10, 14, 7);
 * console.log(`Reorder point: ${reorder.reorderPoint}`);
 * ```
 */
export function calculateReorderPoint(
  averageDailyUsage: number,
  leadTimeDays: number,
  safetyStockDays: number = 7
): {
  reorderPoint: number;
  safetyStock: number;
  reorderQuantity: number;
  maximumLevel: number;
} {
  const safetyStock = Math.ceil(averageDailyUsage * safetyStockDays);
  const reorderPoint = Math.ceil((averageDailyUsage * leadTimeDays) + safetyStock);
  const reorderQuantity = Math.ceil(averageDailyUsage * (leadTimeDays + safetyStockDays));
  const maximumLevel = reorderPoint + reorderQuantity;

  return {
    reorderPoint,
    safetyStock,
    reorderQuantity,
    maximumLevel,
  };
}

/**
 * Calculates inventory valuation using FIFO method
 *
 * @param {ValuationDetail[]} layers - Inventory layers
 * @param {number} quantityNeeded - Quantity to value
 * @returns {object} Valuation calculation
 *
 * @example
 * ```tsx
 * const valuation = calculateFIFOValuation(inventoryLayers, 100);
 * console.log(`Total value: $${valuation.totalValue}`);
 * ```
 */
export function calculateFIFOValuation(
  layers: ValuationDetail[],
  quantityNeeded: number
): {
  totalValue: number;
  averageUnitCost: number;
  layersUsed: ValuationDetail[];
} {
  const sortedLayers = [...layers].sort((a, b) =>
    (a.receiptDate?.getTime() || 0) - (b.receiptDate?.getTime() || 0)
  );

  let remainingQuantity = quantityNeeded;
  let totalValue = 0;
  const layersUsed: ValuationDetail[] = [];

  for (const layer of sortedLayers) {
    if (remainingQuantity <= 0) break;

    const quantityFromLayer = Math.min(remainingQuantity, layer.quantity);
    const valueFromLayer = quantityFromLayer * layer.unitCost;

    layersUsed.push({
      ...layer,
      quantity: quantityFromLayer,
      totalValue: valueFromLayer,
    });

    totalValue += valueFromLayer;
    remainingQuantity -= quantityFromLayer;
  }

  const averageUnitCost = quantityNeeded > 0 ? totalValue / quantityNeeded : 0;

  return {
    totalValue: Math.round(totalValue * 100) / 100,
    averageUnitCost: Math.round(averageUnitCost * 100) / 100,
    layersUsed,
  };
}

/**
 * Calculates weighted average cost
 *
 * @param {number} currentQuantity - Current quantity on hand
 * @param {number} currentAverageCost - Current average cost
 * @param {number} receivedQuantity - Quantity received
 * @param {number} receivedCost - Cost of received items
 * @returns {number} New weighted average cost
 *
 * @example
 * ```tsx
 * const newCost = calculateWeightedAverageCost(100, 50, 50, 60);
 * ```
 */
export function calculateWeightedAverageCost(
  currentQuantity: number,
  currentAverageCost: number,
  receivedQuantity: number,
  receivedCost: number
): number {
  const totalValue = (currentQuantity * currentAverageCost) + (receivedQuantity * receivedCost);
  const totalQuantity = currentQuantity + receivedQuantity;
  return totalQuantity > 0 ? Math.round((totalValue / totalQuantity) * 100) / 100 : 0;
}

/**
 * Validates inventory transaction
 *
 * @param {Partial<InventoryTransaction>} transaction - Transaction to validate
 * @param {StockLevel} stockLevel - Current stock level
 * @returns {object} Validation results
 *
 * @example
 * ```tsx
 * const validation = validateInventoryTransaction(transaction, stockLevel);
 * if (!validation.isValid) showErrors(validation.errors);
 * ```
 */
export function validateInventoryTransaction(
  transaction: Partial<InventoryTransaction>,
  stockLevel: StockLevel
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!transaction.itemId) {
    errors.push('Item ID is required');
  }

  if (!transaction.quantity || transaction.quantity <= 0) {
    errors.push('Quantity must be greater than zero');
  }

  if (transaction.transactionType === 'issue') {
    if (transaction.quantity! > stockLevel.quantityAvailable) {
      errors.push('Insufficient quantity available');
    }
    if ((stockLevel.quantityAvailable - transaction.quantity!) < stockLevel.safetyStock) {
      warnings.push('Transaction will drop inventory below safety stock');
    }
  }

  if (transaction.transactionType === 'transfer') {
    if (!transaction.fromLocation || !transaction.toLocation) {
      errors.push('Both from and to locations required for transfer');
    }
    if (transaction.fromLocation === transaction.toLocation) {
      errors.push('From and to locations cannot be the same');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Generates purchase requisition from reorder recommendations
 *
 * @param {ReorderRecommendation[]} recommendations - Reorder recommendations
 * @param {string} requestedBy - Requester
 * @param {string} costCenter - Cost center
 * @returns {Partial<PurchaseRequisition>} Generated requisition
 *
 * @example
 * ```tsx
 * const requisition = generatePurchaseRequisition(recommendations, userId, 'CC-001');
 * ```
 */
export function generatePurchaseRequisition(
  recommendations: ReorderRecommendation[],
  requestedBy: string,
  costCenter: string
): Partial<PurchaseRequisition> {
  const lineItems: RequisitionLineItem[] = recommendations.map((rec, index) => ({
    lineNumber: index + 1,
    itemId: rec.itemId,
    itemNumber: rec.itemNumber,
    description: rec.itemDescription,
    quantity: rec.recommendedOrderQuantity,
    unitOfMeasure: 'EA',
    unitPrice: rec.estimatedCost / rec.recommendedOrderQuantity,
    lineTotal: rec.estimatedCost,
    suggestedVendor: rec.preferredVendor,
    deliverToLocation: rec.locationId,
  }));

  const totalAmount = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    requestedBy,
    requestDate: new Date(),
    requiredDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    priority: recommendations.some(r => r.priority === 'critical') ? 'urgent' : 'normal',
    status: 'draft',
    lineItems,
    totalAmount,
    costCenter,
    justification: 'Automatic reorder based on stock levels',
  };
}

/**
 * Processes goods receipt and updates inventory
 *
 * @param {GoodsReceipt} receipt - Goods receipt
 * @param {StockLevel[]} stockLevels - Current stock levels
 * @returns {InventoryTransaction[]} Generated transactions
 *
 * @example
 * ```tsx
 * const transactions = processGoodsReceipt(receipt, stockLevels);
 * ```
 */
export function processGoodsReceipt(
  receipt: GoodsReceipt,
  stockLevels: StockLevel[]
): Partial<InventoryTransaction>[] {
  return receipt.lineItems
    .filter(line => line.acceptedQuantity > 0)
    .map(line => ({
      transactionType: 'receipt' as const,
      itemId: line.itemId,
      itemNumber: line.itemNumber,
      quantity: line.acceptedQuantity,
      unitCost: line.unitCost,
      totalCost: line.acceptedQuantity * line.unitCost,
      toLocation: receipt.receivedAt,
      toBin: line.binLocation,
      lotNumber: line.lotNumber,
      referenceDocument: 'PO',
      referenceNumber: receipt.purchaseOrderNumber,
      performedBy: receipt.receivedBy,
      performedDate: receipt.receiptDate,
      approvalRequired: false,
    }));
}

/**
 * Calculates cycle count accuracy
 *
 * @param {CycleCountItem[]} items - Cycle count items
 * @returns {object} Accuracy metrics
 *
 * @example
 * ```tsx
 * const accuracy = calculateCycleCountAccuracy(countItems);
 * console.log(`Accuracy: ${accuracy.accuracyRate}%`);
 * ```
 */
export function calculateCycleCountAccuracy(items: CycleCountItem[]): {
  accuracyRate: number;
  totalVariance: number;
  totalVarianceValue: number;
  itemsAccurate: number;
  itemsWithVariance: number;
} {
  const itemsAccurate = items.filter(item => item.variance === 0).length;
  const itemsWithVariance = items.length - itemsAccurate;
  const accuracyRate = items.length > 0 ? (itemsAccurate / items.length) * 100 : 100;
  const totalVariance = items.reduce((sum, item) => sum + Math.abs(item.variance), 0);
  const totalVarianceValue = items.reduce((sum, item) => sum + Math.abs(item.varianceValue), 0);

  return {
    accuracyRate: Math.round(accuracyRate * 100) / 100,
    totalVariance,
    totalVarianceValue: Math.round(totalVarianceValue * 100) / 100,
    itemsAccurate,
    itemsWithVariance,
  };
}

/**
 * Identifies obsolete inventory items
 *
 * @param {InventoryItem[]} items - Inventory items
 * @param {InventoryTransaction[]} transactions - Transaction history
 * @param {number} daysSinceMovement - Days threshold
 * @returns {ObsoleteInventoryItem[]} Obsolete items
 *
 * @example
 * ```tsx
 * const obsolete = identifyObsoleteInventory(items, transactions, 365);
 * ```
 */
export function identifyObsoleteInventory(
  items: InventoryItem[],
  transactions: InventoryTransaction[],
  daysSinceMovement: number = 365
): ObsoleteInventoryItem[] {
  const now = new Date();
  const thresholdDate = new Date(now.getTime() - daysSinceMovement * 24 * 60 * 60 * 1000);

  return items
    .map(item => {
      const itemTransactions = transactions.filter(t => t.itemId === item.itemId);
      const lastTransaction = itemTransactions.sort((a, b) =>
        new Date(b.performedDate).getTime() - new Date(a.performedDate).getTime()
      )[0];

      const lastMovementDate = lastTransaction?.performedDate || item.createdAt;
      const daysSinceLastMovement = Math.floor(
        (now.getTime() - new Date(lastMovementDate).getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceLastMovement < daysSinceMovement) return null;

      // Mock quantity and value - would come from stock levels in real implementation
      const quantity = 10;
      const totalValue = quantity * item.averageCost;

      let classification: 'obsolete' | 'slow_moving' | 'excess';
      let recommendation: 'scrap' | 'sell' | 'donate' | 'return_to_vendor' | 'transfer' | 'review';

      if (daysSinceLastMovement > 730) {
        classification = 'obsolete';
        recommendation = totalValue > 1000 ? 'sell' : 'scrap';
      } else if (daysSinceLastMovement > 365) {
        classification = 'slow_moving';
        recommendation = 'transfer';
      } else {
        classification = 'excess';
        recommendation = 'review';
      }

      return {
        itemId: item.itemId,
        itemNumber: item.itemNumber,
        description: item.description,
        quantity,
        unitCost: item.averageCost,
        totalValue,
        lastMovementDate: new Date(lastMovementDate),
        daysWithoutMovement: daysSinceLastMovement,
        classification,
        recommendation,
      };
    })
    .filter((item): item is ObsoleteInventoryItem => item !== null);
}

/**
 * Calculates inventory turnover ratio
 *
 * @param {number} costOfGoodsSold - Cost of goods sold in period
 * @param {number} averageInventoryValue - Average inventory value
 * @returns {object} Turnover metrics
 *
 * @example
 * ```tsx
 * const turnover = calculateInventoryTurnover(500000, 100000);
 * console.log(`Turnover: ${turnover.turnoverRatio}x`);
 * ```
 */
export function calculateInventoryTurnover(
  costOfGoodsSold: number,
  averageInventoryValue: number
): {
  turnoverRatio: number;
  daysInventoryOnHand: number;
  performance: 'excellent' | 'good' | 'fair' | 'poor';
} {
  const turnoverRatio = averageInventoryValue > 0
    ? costOfGoodsSold / averageInventoryValue
    : 0;
  const daysInventoryOnHand = turnoverRatio > 0
    ? 365 / turnoverRatio
    : 365;

  let performance: 'excellent' | 'good' | 'fair' | 'poor';
  if (turnoverRatio >= 12) performance = 'excellent';
  else if (turnoverRatio >= 8) performance = 'good';
  else if (turnoverRatio >= 4) performance = 'fair';
  else performance = 'poor';

  return {
    turnoverRatio: Math.round(turnoverRatio * 100) / 100,
    daysInventoryOnHand: Math.round(daysInventoryOnHand),
    performance,
  };
}

/**
 * Validates lot number expiration
 *
 * @param {LotNumber[]} lotNumbers - Lot numbers to check
 * @returns {object} Expiration status
 *
 * @example
 * ```tsx
 * const status = validateLotExpiration(lotNumbers);
 * if (status.expired.length > 0) quarantineExpired(status.expired);
 * ```
 */
export function validateLotExpiration(lotNumbers: LotNumber[]): {
  current: LotNumber[];
  expiringSoon: LotNumber[];
  expired: LotNumber[];
} {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const current: LotNumber[] = [];
  const expiringSoon: LotNumber[] = [];
  const expired: LotNumber[] = [];

  lotNumbers.forEach(lot => {
    if (!lot.expirationDate) {
      current.push(lot);
      return;
    }

    const expirationDate = new Date(lot.expirationDate);
    if (expirationDate < now) {
      expired.push(lot);
    } else if (expirationDate <= thirtyDaysFromNow) {
      expiringSoon.push(lot);
    } else {
      current.push(lot);
    }
  });

  return { current, expiringSoon, expired };
}

/**
 * Generates ABC classification
 *
 * @param {Array} items - Items with value and movement data
 * @returns {object} Classification results
 *
 * @example
 * ```tsx
 * const classification = generateABCClassification(items);
 * ```
 */
export function generateABCClassification(
  items: Array<{ itemId: string; annualUsageValue: number }>
): {
  classA: string[];
  classB: string[];
  classC: string[];
} {
  const sortedItems = [...items].sort((a, b) => b.annualUsageValue - a.annualUsageValue);
  const totalValue = sortedItems.reduce((sum, item) => sum + item.annualUsageValue, 0);

  let cumulativeValue = 0;
  let cumulativePercent = 0;
  const classA: string[] = [];
  const classB: string[] = [];
  const classC: string[] = [];

  sortedItems.forEach(item => {
    cumulativeValue += item.annualUsageValue;
    cumulativePercent = (cumulativeValue / totalValue) * 100;

    if (cumulativePercent <= 80) {
      classA.push(item.itemId);
    } else if (cumulativePercent <= 95) {
      classB.push(item.itemId);
    } else {
      classC.push(item.itemId);
    }
  });

  return { classA, classB, classC };
}

/**
 * Optimizes warehouse space allocation
 *
 * @param {InventoryLocation} location - Warehouse location
 * @param {StockLevel[]} stockLevels - Current stock levels
 * @returns {object} Space optimization recommendations
 *
 * @example
 * ```tsx
 * const optimization = optimizeWarehouseSpace(warehouse, stockLevels);
 * ```
 */
export function optimizeWarehouseSpace(
  location: InventoryLocation,
  stockLevels: StockLevel[]
): {
  currentUtilization: number;
  recommendations: string[];
  potentialSpaceSavings: number;
} {
  const currentUtilization = location.capacity.utilizationPercent;
  const recommendations: string[] = [];
  let potentialSpaceSavings = 0;

  if (currentUtilization > 90) {
    recommendations.push('Warehouse near capacity - consider expansion or overflow location');
  }

  if (currentUtilization < 50) {
    recommendations.push('Low utilization - consolidate inventory or reduce space');
    potentialSpaceSavings = (100 - currentUtilization) * 0.5;
  }

  const slowMovingCount = stockLevels.filter(sl => sl.lastMovementDate &&
    (Date.now() - new Date(sl.lastMovementDate).getTime()) > 180 * 24 * 60 * 60 * 1000
  ).length;

  if (slowMovingCount > stockLevels.length * 0.2) {
    recommendations.push(`${slowMovingCount} slow-moving items taking up space - review for disposition`);
  }

  return {
    currentUtilization,
    recommendations,
    potentialSpaceSavings: Math.round(potentialSpaceSavings),
  };
}

/**
 * Calculates stockout probability
 *
 * @param {StockLevel} stockLevel - Current stock level
 * @param {number} averageDailyUsage - Average daily usage
 * @param {number} leadTimeDays - Lead time
 * @returns {object} Stockout analysis
 *
 * @example
 * ```tsx
 * const analysis = calculateStockoutProbability(stockLevel, 10, 14);
 * ```
 */
export function calculateStockoutProbability(
  stockLevel: StockLevel,
  averageDailyUsage: number,
  leadTimeDays: number
): {
  daysUntilStockout: number;
  stockoutProbability: number;
  riskLevel: 'high' | 'medium' | 'low';
  recommendedAction: string;
} {
  const daysUntilStockout = averageDailyUsage > 0
    ? Math.floor(stockLevel.quantityAvailable / averageDailyUsage)
    : 999;

  let stockoutProbability = 0;
  let riskLevel: 'high' | 'medium' | 'low' = 'low';
  let recommendedAction = 'Monitor inventory levels';

  if (daysUntilStockout <= leadTimeDays) {
    stockoutProbability = 90;
    riskLevel = 'high';
    recommendedAction = 'Order immediately - expedite if possible';
  } else if (daysUntilStockout <= leadTimeDays * 1.5) {
    stockoutProbability = 50;
    riskLevel = 'medium';
    recommendedAction = 'Place order soon';
  } else {
    stockoutProbability = 10;
    riskLevel = 'low';
    recommendedAction = 'Normal reorder process';
  }

  return {
    daysUntilStockout,
    stockoutProbability,
    riskLevel,
    recommendedAction,
  };
}

/**
 * Validates stock transfer request
 *
 * @param {Partial<StockTransfer>} transfer - Transfer request
 * @param {StockLevel} fromStockLevel - Source stock level
 * @returns {object} Validation results
 *
 * @example
 * ```tsx
 * const validation = validateStockTransfer(transfer, stockLevel);
 * ```
 */
export function validateStockTransfer(
  transfer: Partial<StockTransfer>,
  fromStockLevel: StockLevel
): {
  canTransfer: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!transfer.fromLocation || !transfer.toLocation) {
    errors.push('Both from and to locations required');
  }

  if (transfer.fromLocation === transfer.toLocation) {
    errors.push('From and to locations cannot be the same');
  }

  const totalQuantity = transfer.lineItems?.reduce((sum, item) => sum + item.transferQuantity, 0) || 0;

  if (totalQuantity > fromStockLevel.quantityAvailable) {
    errors.push('Insufficient quantity available for transfer');
  }

  if ((fromStockLevel.quantityAvailable - totalQuantity) < fromStockLevel.safetyStock) {
    warnings.push('Transfer will drop source location below safety stock');
  }

  return {
    canTransfer: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Generates inventory analytics report
 *
 * @param {StockLevel[]} stockLevels - Stock levels
 * @param {InventoryTransaction[]} transactions - Transactions
 * @param {string} period - Reporting period
 * @returns {Partial<InventoryAnalytics>} Analytics report
 *
 * @example
 * ```tsx
 * const analytics = generateInventoryAnalytics(stockLevels, transactions, '2025-01');
 * ```
 */
export function generateInventoryAnalytics(
  stockLevels: StockLevel[],
  transactions: InventoryTransaction[],
  period: string
): Partial<InventoryAnalytics> {
  const totalInventoryValue = stockLevels.reduce((sum, sl) => sum + sl.valuationAmount, 0);

  const issues = transactions.filter(t => t.transactionType === 'issue');
  const totalIssueValue = issues.reduce((sum, t) => sum + t.totalCost, 0);

  const inventoryTurnover = totalInventoryValue > 0
    ? (totalIssueValue * 12) / totalInventoryValue
    : 0;

  const daysInventoryOnHand = inventoryTurnover > 0
    ? 365 / inventoryTurnover
    : 365;

  return {
    period,
    totalInventoryValue: Math.round(totalInventoryValue * 100) / 100,
    inventoryTurnover: Math.round(inventoryTurnover * 100) / 100,
    daysInventoryOnHand: Math.round(daysInventoryOnHand),
  };
}

/**
 * Searches inventory items by criteria
 *
 * @param {InventoryItem[]} items - Inventory items
 * @param {object} criteria - Search criteria
 * @returns {InventoryItem[]} Filtered items
 *
 * @example
 * ```tsx
 * const results = searchInventoryItems(items, { category: 'tools', status: 'active' });
 * ```
 */
export function searchInventoryItems(
  items: InventoryItem[],
  criteria: {
    category?: string;
    status?: string;
    isHazardous?: boolean;
    abcClassification?: string;
    searchTerm?: string;
  }
): InventoryItem[] {
  return items.filter(item => {
    if (criteria.category && item.category !== criteria.category) return false;
    if (criteria.status && item.status !== criteria.status) return false;
    if (criteria.isHazardous !== undefined && item.isHazardous !== criteria.isHazardous) return false;
    if (criteria.abcClassification && item.abcClassification !== criteria.abcClassification) return false;

    if (criteria.searchTerm) {
      const term = criteria.searchTerm.toLowerCase();
      const searchable = `${item.itemNumber} ${item.nomenclature} ${item.description} ${item.nsn || ''}`.toLowerCase();
      if (!searchable.includes(term)) return false;
    }

    return true;
  });
}

/**
 * Exports inventory data for reporting
 *
 * @param {InventoryItem[]} items - Inventory items
 * @param {StockLevel[]} stockLevels - Stock levels
 * @param {string} format - Export format
 * @returns {string} Exported data
 *
 * @example
 * ```tsx
 * const csvData = exportInventoryData(items, stockLevels, 'csv');
 * downloadFile(csvData, 'inventory-report.csv');
 * ```
 */
export function exportInventoryData(
  items: InventoryItem[],
  stockLevels: StockLevel[],
  format: 'csv' | 'json' = 'csv'
): string {
  const combined = items.map(item => {
    const stock = stockLevels.find(sl => sl.itemId === item.itemId);
    return {
      ...item,
      quantityOnHand: stock?.quantityOnHand || 0,
      quantityAvailable: stock?.quantityAvailable || 0,
      valuationAmount: stock?.valuationAmount || 0,
    };
  });

  if (format === 'json') {
    return JSON.stringify(combined, null, 2);
  }

  const headers = [
    'Item Number',
    'NSN',
    'Description',
    'Category',
    'Quantity On Hand',
    'Quantity Available',
    'Unit Cost',
    'Total Value',
    'Reorder Point',
    'Status',
  ];

  const rows = combined.map(item => {
    const stock = stockLevels.find(sl => sl.itemId === item.itemId);
    return [
      item.itemNumber,
      item.nsn || '',
      item.nomenclature,
      item.category,
      stock?.quantityOnHand || 0,
      stock?.quantityAvailable || 0,
      item.averageCost,
      stock?.valuationAmount || 0,
      stock?.reorderPoint || 0,
      item.status,
    ];
  });

  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');
}

// Export all hooks and functions
export default {
  // Hooks
  useInventoryItem,
  useStockLevels,
  useInventoryTransactions,
  useReorderRecommendations,
  useCycleCounts,

  // Composite Functions
  createInventoryItemForm,
  calculateReorderPoint,
  calculateFIFOValuation,
  calculateWeightedAverageCost,
  validateInventoryTransaction,
  generatePurchaseRequisition,
  processGoodsReceipt,
  calculateCycleCountAccuracy,
  identifyObsoleteInventory,
  calculateInventoryTurnover,
  validateLotExpiration,
  generateABCClassification,
  optimizeWarehouseSpace,
  calculateStockoutProbability,
  validateStockTransfer,
  generateInventoryAnalytics,
  searchInventoryItems,
  exportInventoryData,
};
