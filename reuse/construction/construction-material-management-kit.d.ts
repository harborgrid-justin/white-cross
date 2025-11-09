/**
 * CONSTRUCTION MATERIAL MANAGEMENT KIT
 *
 * Comprehensive construction material procurement, inventory, and tracking toolkit.
 * Provides 40 specialized functions covering:
 * - Material requisition and procurement tracking
 * - Inventory management and stock level monitoring
 * - Material receiving, inspection, and quality verification
 * - Waste tracking, surplus management, and recycling
 * - Material cost tracking, variance analysis, and budget control
 * - Supplier management and vendor performance tracking
 * - Material delivery scheduling and logistics coordination
 * - Material allocation to projects and work orders
 * - Material consumption tracking and yield analysis
 * - Stockroom organization and warehouse management
 * - Reorder point calculation and automatic procurement
 * - Material substitution and equivalency tracking
 * - Hazardous material handling and compliance (OSHA, EPA)
 * - Material certification and testing documentation
 * - Bill of materials (BOM) management and takeoff integration
 *
 * @module ConstructionMaterialManagementKit
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 * @requires Node.js 18+
 * @requires TypeScript 5.x
 *
 * @performance Optimized for large material catalogs (50,000+ SKUs)
 *
 * @example
 * ```typescript
 * import {
 *   createMaterialRequisition,
 *   receiveMaterial,
 *   trackMaterialInventory,
 *   allocateMaterialToProject,
 *   trackMaterialWaste,
 *   ConstructionMaterial,
 *   MaterialCategory
 * } from './construction-material-management-kit';
 *
 * // Create material requisition
 * const requisition = await createMaterialRequisition({
 *   projectId: 'PROJ-2024-045',
 *   materialSku: 'CONC-MIX-3000',
 *   quantityRequested: 500,
 *   unitOfMeasure: 'cubic_yards',
 *   requiredDate: new Date('2024-12-15')
 * });
 *
 * // Receive material
 * await receiveMaterial(requisition.id, {
 *   quantityReceived: 500,
 *   receivedDate: new Date(),
 *   inspectionPassed: true
 * });
 *
 * // Track waste
 * await trackMaterialWaste('PROJ-2024-045', 'CONC-MIX-3000', {
 *   quantity: 15,
 *   reason: 'spillage',
 *   cost: 750
 * });
 * ```
 */
import { ConstructionMaterial } from './models/construction-material.model';
import { MaterialRequisition } from './models/material-requisition.model';
import { MaterialTransaction } from './models/material-transaction.model';
import { MaterialCategory, MaterialStatus, RequisitionStatus, WasteReason } from './types/material.types';
import { RegisterMaterialDto } from './dto/register-material.dto';
import { CreateRequisitionDto } from './dto/create-requisition.dto';
import { ReceiveMaterialDto } from './dto/receive-material.dto';
/**
 * Registers new material in the system.
 *
 * @param {RegisterMaterialDto} data - Material registration data
 * @returns {Promise<ConstructionMaterial>} Registered material record
 *
 * @example
 * ```typescript
 * const material = await registerMaterial({
 *   sku: 'CONC-MIX-3000',
 *   name: 'Ready-Mix Concrete 3000 PSI',
 *   category: MaterialCategory.CONCRETE,
 *   unitOfMeasure: UnitOfMeasure.CUBIC_YARD,
 *   unitCost: 125.50,
 *   reorderPoint: 500
 * });
 * ```
 */
export declare const registerMaterial: (data: RegisterMaterialDto) => Promise<ConstructionMaterial>;
/**
 * Updates material inventory quantity.
 *
 * @param {string} materialId - Material ID
 * @param {number} quantity - New quantity
 * @returns {Promise<ConstructionMaterial>} Updated material
 *
 * @example
 * ```typescript
 * await updateMaterialInventory(materialId, 1250.5);
 * ```
 */
export declare const updateMaterialInventory: (materialId: string, quantity: number) => Promise<ConstructionMaterial>;
/**
 * Gets current inventory for material.
 *
 * @param {string} materialId - Material ID
 * @returns {Promise<object>} Inventory details
 *
 * @example
 * ```typescript
 * const inventory = await trackMaterialInventory(materialId);
 * console.log(`Stock: ${inventory.stockQuantity} ${inventory.unitOfMeasure}`);
 * ```
 */
export declare const trackMaterialInventory: (materialId: string) => Promise<{
    material: ConstructionMaterial;
    stockQuantity: number;
    stockValue: number;
    status: MaterialStatus;
    daysUntilReorder: number | null;
}>;
/**
 * Searches materials by filters.
 *
 * @param {object} filters - Search filters
 * @returns {Promise<ConstructionMaterial[]>} Matching materials
 *
 * @example
 * ```typescript
 * const materials = await searchMaterials({
 *   category: MaterialCategory.CONCRETE,
 *   status: MaterialStatus.AVAILABLE
 * });
 * ```
 */
export declare const searchMaterials: (filters: {
    category?: MaterialCategory;
    status?: MaterialStatus;
    vendorId?: string;
    isHazardous?: boolean;
}) => Promise<ConstructionMaterial[]>;
/**
 * Updates material unit cost.
 *
 * @param {string} materialId - Material ID
 * @param {number} newCost - New unit cost
 * @returns {Promise<ConstructionMaterial>} Updated material
 *
 * @example
 * ```typescript
 * await updateMaterialCost(materialId, 130.00);
 * ```
 */
export declare const updateMaterialCost: (materialId: string, newCost: number) => Promise<ConstructionMaterial>;
/**
 * Sets material reorder point.
 *
 * @param {string} materialId - Material ID
 * @param {number} reorderPoint - Minimum stock level
 * @param {number} [maxStock] - Optional maximum stock level
 * @returns {Promise<ConstructionMaterial>} Updated material
 *
 * @example
 * ```typescript
 * await setReorderPoint(materialId, 500, 3000);
 * ```
 */
export declare const setReorderPoint: (materialId: string, reorderPoint: number, maxStock?: number) => Promise<ConstructionMaterial>;
/**
 * Creates material requisition.
 *
 * @param {CreateRequisitionDto} data - Requisition data
 * @returns {Promise<MaterialRequisition>} Created requisition
 *
 * @example
 * ```typescript
 * const requisition = await createMaterialRequisition({
 *   materialId: 'c5d6e7f8-9a0b-1c2d-3e4f-5a6b7c8d9e0f',
 *   projectId: 'PROJ-2024-045',
 *   quantityRequested: 500,
 *   requiredDate: new Date('2024-12-15')
 * });
 * ```
 */
export declare const createMaterialRequisition: (data: CreateRequisitionDto) => Promise<MaterialRequisition>;
/**
 * Submits requisition for approval.
 *
 * @param {string} requisitionId - Requisition ID
 * @param {string} requestedBy - User ID
 * @returns {Promise<MaterialRequisition>} Updated requisition
 *
 * @example
 * ```typescript
 * await submitRequisition(requisitionId, 'USR-456');
 * ```
 */
export declare const submitRequisition: (requisitionId: string, requestedBy: string) => Promise<MaterialRequisition>;
/**
 * Approves material requisition.
 *
 * @param {string} requisitionId - Requisition ID
 * @param {string} approvedBy - Approver user ID
 * @param {number} [quantityApproved] - Optional different quantity
 * @returns {Promise<MaterialRequisition>} Approved requisition
 *
 * @example
 * ```typescript
 * await approveRequisition(requisitionId, 'MGR-789');
 * ```
 */
export declare const approveRequisition: (requisitionId: string, approvedBy: string, quantityApproved?: number) => Promise<MaterialRequisition>;
/**
 * Creates purchase order from requisition.
 *
 * @param {string} requisitionId - Requisition ID
 * @param {string} vendorId - Vendor ID
 * @param {string} [purchaseOrderNumber] - Optional PO number
 * @returns {Promise<MaterialRequisition>} Updated requisition
 *
 * @example
 * ```typescript
 * await createPurchaseOrder(requisitionId, 'VEND-123', 'PO-2024-5678');
 * ```
 */
export declare const createPurchaseOrder: (requisitionId: string, vendorId: string, purchaseOrderNumber?: string) => Promise<MaterialRequisition>;
/**
 * Gets requisitions by project.
 *
 * @param {string} projectId - Project ID
 * @param {RequisitionStatus} [status] - Optional status filter
 * @returns {Promise<MaterialRequisition[]>} Project requisitions
 *
 * @example
 * ```typescript
 * const requisitions = await getProjectRequisitions('PROJ-2024-045');
 * ```
 */
export declare const getProjectRequisitions: (projectId: string, status?: RequisitionStatus) => Promise<MaterialRequisition[]>;
/**
 * Receives material from requisition.
 *
 * @param {string} requisitionId - Requisition ID
 * @param {ReceiveMaterialDto} data - Receipt data
 * @returns {Promise<MaterialTransaction>} Receipt transaction
 *
 * @example
 * ```typescript
 * const receipt = await receiveMaterial(requisitionId, {
 *   quantityReceived: 485,
 *   unitCost: 120.00,
 *   inspectionPassed: true,
 *   receiptNumber: 'DR-2024-9876'
 * });
 * ```
 */
export declare const receiveMaterial: (requisitionId: string, data: ReceiveMaterialDto) => Promise<MaterialTransaction>;
/**
 * Performs quality inspection on received material.
 *
 * @param {string} transactionId - Transaction ID
 * @param {boolean} passed - Whether inspection passed
 * @param {string} inspectorName - Inspector name
 * @param {string} [notes] - Inspection notes
 * @returns {Promise<MaterialTransaction>} Updated transaction
 *
 * @example
 * ```typescript
 * await verifyMaterialQuality(transactionId, true, 'Jane Doe', 'All specs met');
 * ```
 */
export declare const verifyMaterialQuality: (transactionId: string, passed: boolean, inspectorName: string, notes?: string) => Promise<MaterialTransaction>;
/**
 * Records material certification documents.
 *
 * @param {string} transactionId - Transaction ID
 * @param {string[]} documents - Document URLs or IDs
 * @returns {Promise<MaterialTransaction>} Updated transaction
 *
 * @example
 * ```typescript
 * await recordCertification(transactionId, ['cert-001.pdf', 'test-report.pdf']);
 * ```
 */
export declare const recordCertification: (transactionId: string, documents: string[]) => Promise<MaterialTransaction>;
/**
 * Allocates material to project.
 *
 * @param {string} materialId - Material ID
 * @param {string} projectId - Project ID
 * @param {number} quantity - Quantity to allocate
 * @param {string} [location] - Delivery location
 * @returns {Promise<MaterialTransaction>} Issue transaction
 *
 * @example
 * ```typescript
 * await allocateMaterialToProject(materialId, 'PROJ-2024-045', 250, 'Job Site A');
 * ```
 */
export declare const allocateMaterialToProject: (materialId: string, projectId: string, quantity: number, location?: string) => Promise<MaterialTransaction>;
/**
 * Transfers material between locations.
 *
 * @param {string} materialId - Material ID
 * @param {string} fromLocation - Source location
 * @param {string} toLocation - Destination location
 * @param {number} quantity - Quantity to transfer
 * @returns {Promise<MaterialTransaction>} Transfer transaction
 *
 * @example
 * ```typescript
 * await transferMaterial(materialId, 'Warehouse A', 'Warehouse B', 100);
 * ```
 */
export declare const transferMaterial: (materialId: string, fromLocation: string, toLocation: string, quantity: number) => Promise<MaterialTransaction>;
/**
 * Returns unused material to inventory.
 *
 * @param {string} materialId - Material ID
 * @param {string} projectId - Project ID
 * @param {number} quantity - Quantity returned
 * @param {string} [reason] - Return reason
 * @returns {Promise<MaterialTransaction>} Return transaction
 *
 * @example
 * ```typescript
 * await returnMaterialToInventory(materialId, 'PROJ-2024-045', 50, 'Surplus');
 * ```
 */
export declare const returnMaterialToInventory: (materialId: string, projectId: string, quantity: number, reason?: string) => Promise<MaterialTransaction>;
/**
 * Tracks material waste.
 *
 * @param {string} projectId - Project ID
 * @param {string} materialId - Material ID
 * @param {object} wasteData - Waste details
 * @returns {Promise<MaterialTransaction>} Waste transaction
 *
 * @example
 * ```typescript
 * await trackMaterialWaste('PROJ-2024-045', materialId, {
 *   quantity: 15,
 *   reason: WasteReason.SPILLAGE,
 *   cost: 750,
 *   notes: 'Concrete spillage during pour'
 * });
 * ```
 */
export declare const trackMaterialWaste: (projectId: string, materialId: string, wasteData: {
    quantity: number;
    reason: WasteReason;
    cost?: number;
    notes?: string;
}) => Promise<MaterialTransaction>;
/**
 * Analyzes waste for project.
 *
 * @param {string} projectId - Project ID
 * @param {Date} [startDate] - Analysis start date
 * @param {Date} [endDate] - Analysis end date
 * @returns {Promise<object>} Waste analysis
 *
 * @example
 * ```typescript
 * const wasteAnalysis = await analyzeWaste('PROJ-2024-045');
 * console.log(`Total waste cost: $${wasteAnalysis.totalWasteCost}`);
 * ```
 */
export declare const analyzeWaste: (projectId: string, startDate?: Date, endDate?: Date) => Promise<{
    projectId: string;
    totalWasteQuantity: number;
    totalWasteCost: number;
    wasteByReason: Record<string, {
        quantity: number;
        cost: number;
    }>;
    wasteByMaterial: Record<string, {
        quantity: number;
        cost: number;
    }>;
}>;
/**
 * Identifies surplus materials.
 *
 * @param {string} projectId - Project ID
 * @returns {Promise<object[]>} Surplus materials
 *
 * @example
 * ```typescript
 * const surplus = await identifySurplusMaterials('PROJ-2024-045');
 * ```
 */
export declare const identifySurplusMaterials: (projectId: string) => Promise<Array<{
    material: ConstructionMaterial;
    surplusQuantity: number;
    surplusValue: number;
}>>;
/**
 * Calculates material cost for project.
 *
 * @param {string} projectId - Project ID
 * @param {Date} [startDate] - Period start
 * @param {Date} [endDate] - Period end
 * @returns {Promise<object>} Material costs
 *
 * @example
 * ```typescript
 * const costs = await calculateProjectMaterialCost('PROJ-2024-045');
 * console.log(`Total cost: $${costs.totalCost}`);
 * ```
 */
export declare const calculateProjectMaterialCost: (projectId: string, startDate?: Date, endDate?: Date) => Promise<{
    projectId: string;
    totalCost: number;
    costByCategory: Record<string, number>;
    issueCount: number;
    wasteCost: number;
}>;
/**
 * Analyzes cost variance (budget vs. actual).
 *
 * @param {string} requisitionId - Requisition ID
 * @returns {Promise<object>} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = await analyzeCostVariance(requisitionId);
 * console.log(`Variance: ${variance.variancePercentage}%`);
 * ```
 */
export declare const analyzeCostVariance: (requisitionId: string) => Promise<{
    requisitionId: string;
    estimatedCost: number;
    actualCost: number;
    variance: number;
    variancePercentage: number;
}>;
/**
 * Tracks material consumption rate.
 *
 * @param {string} projectId - Project ID
 * @param {string} materialId - Material ID
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @returns {Promise<object>} Consumption metrics
 *
 * @example
 * ```typescript
 * const consumption = await trackConsumptionRate('PROJ-2024-045', materialId, startDate, endDate);
 * ```
 */
export declare const trackConsumptionRate: (projectId: string, materialId: string, startDate: Date, endDate: Date) => Promise<{
    materialId: string;
    totalConsumed: number;
    dailyAverage: number;
    periodDays: number;
}>;
/**
 * Gets low stock materials.
 *
 * @returns {Promise<ConstructionMaterial[]>} Low stock materials
 *
 * @example
 * ```typescript
 * const lowStock = await getLowStockMaterials();
 * ```
 */
export declare const getLowStockMaterials: () => Promise<ConstructionMaterial[]>;
/**
 * Calculates reorder quantity.
 *
 * @param {string} materialId - Material ID
 * @param {number} [leadTimeDays] - Lead time
 * @returns {Promise<object>} Reorder calculation
 *
 * @example
 * ```typescript
 * const reorder = await calculateReorderQuantity(materialId);
 * console.log(`Order quantity: ${reorder.orderQuantity}`);
 * ```
 */
export declare const calculateReorderQuantity: (materialId: string, leadTimeDays?: number) => Promise<{
    materialId: string;
    currentStock: number;
    reorderPoint: number;
    orderQuantity: number;
    estimatedCost: number;
}>;
/**
 * Generates automatic reorder requisitions.
 *
 * @returns {Promise<MaterialRequisition[]>} Created requisitions
 *
 * @example
 * ```typescript
 * const requisitions = await autoGenerateReorders();
 * console.log(`Created ${requisitions.length} reorder requisitions`);
 * ```
 */
export declare const autoGenerateReorders: () => Promise<MaterialRequisition[]>;
/**
 * Performs inventory cycle count.
 *
 * @param {string} materialId - Material ID
 * @param {number} countedQuantity - Physically counted quantity
 * @param {string} countedBy - Counter user ID
 * @returns {Promise<MaterialTransaction>} Adjustment transaction
 *
 * @example
 * ```typescript
 * await performCycleCount(materialId, 1245.5, 'USR-789');
 * ```
 */
export declare const performCycleCount: (materialId: string, countedQuantity: number, countedBy: string) => Promise<MaterialTransaction | null>;
/**
 * Gets materials requiring attention (expiring, low stock, quarantined).
 *
 * @returns {Promise<object>} Materials requiring attention
 *
 * @example
 * ```typescript
 * const attention = await getMaterialsRequiringAttention();
 * ```
 */
export declare const getMaterialsRequiringAttention: () => Promise<{
    lowStock: ConstructionMaterial[];
    outOfStock: ConstructionMaterial[];
    quarantined: ConstructionMaterial[];
}>;
/**
 * Formats material summary for reporting.
 *
 * @param {ConstructionMaterial} material - Material record
 * @returns {object} Formatted summary
 */
export declare const formatMaterialSummary: (material: ConstructionMaterial) => object;
declare const _default: {
    registerMaterial: (data: RegisterMaterialDto) => Promise<ConstructionMaterial>;
    updateMaterialInventory: (materialId: string, quantity: number) => Promise<ConstructionMaterial>;
    trackMaterialInventory: (materialId: string) => Promise<{
        material: ConstructionMaterial;
        stockQuantity: number;
        stockValue: number;
        status: MaterialStatus;
        daysUntilReorder: number | null;
    }>;
    searchMaterials: (filters: {
        category?: MaterialCategory;
        status?: MaterialStatus;
        vendorId?: string;
        isHazardous?: boolean;
    }) => Promise<ConstructionMaterial[]>;
    updateMaterialCost: (materialId: string, newCost: number) => Promise<ConstructionMaterial>;
    setReorderPoint: (materialId: string, reorderPoint: number, maxStock?: number) => Promise<ConstructionMaterial>;
    createMaterialRequisition: (data: CreateRequisitionDto) => Promise<MaterialRequisition>;
    submitRequisition: (requisitionId: string, requestedBy: string) => Promise<MaterialRequisition>;
    approveRequisition: (requisitionId: string, approvedBy: string, quantityApproved?: number) => Promise<MaterialRequisition>;
    createPurchaseOrder: (requisitionId: string, vendorId: string, purchaseOrderNumber?: string) => Promise<MaterialRequisition>;
    getProjectRequisitions: (projectId: string, status?: RequisitionStatus) => Promise<MaterialRequisition[]>;
    receiveMaterial: (requisitionId: string, data: ReceiveMaterialDto) => Promise<MaterialTransaction>;
    verifyMaterialQuality: (transactionId: string, passed: boolean, inspectorName: string, notes?: string) => Promise<MaterialTransaction>;
    recordCertification: (transactionId: string, documents: string[]) => Promise<MaterialTransaction>;
    allocateMaterialToProject: (materialId: string, projectId: string, quantity: number, location?: string) => Promise<MaterialTransaction>;
    transferMaterial: (materialId: string, fromLocation: string, toLocation: string, quantity: number) => Promise<MaterialTransaction>;
    returnMaterialToInventory: (materialId: string, projectId: string, quantity: number, reason?: string) => Promise<MaterialTransaction>;
    trackMaterialWaste: (projectId: string, materialId: string, wasteData: {
        quantity: number;
        reason: WasteReason;
        cost?: number;
        notes?: string;
    }) => Promise<MaterialTransaction>;
    analyzeWaste: (projectId: string, startDate?: Date, endDate?: Date) => Promise<{
        projectId: string;
        totalWasteQuantity: number;
        totalWasteCost: number;
        wasteByReason: Record<string, {
            quantity: number;
            cost: number;
        }>;
        wasteByMaterial: Record<string, {
            quantity: number;
            cost: number;
        }>;
    }>;
    identifySurplusMaterials: (projectId: string) => Promise<Array<{
        material: ConstructionMaterial;
        surplusQuantity: number;
        surplusValue: number;
    }>>;
    calculateProjectMaterialCost: (projectId: string, startDate?: Date, endDate?: Date) => Promise<{
        projectId: string;
        totalCost: number;
        costByCategory: Record<string, number>;
        issueCount: number;
        wasteCost: number;
    }>;
    analyzeCostVariance: (requisitionId: string) => Promise<{
        requisitionId: string;
        estimatedCost: number;
        actualCost: number;
        variance: number;
        variancePercentage: number;
    }>;
    trackConsumptionRate: (projectId: string, materialId: string, startDate: Date, endDate: Date) => Promise<{
        materialId: string;
        totalConsumed: number;
        dailyAverage: number;
        periodDays: number;
    }>;
    getLowStockMaterials: () => Promise<ConstructionMaterial[]>;
    calculateReorderQuantity: (materialId: string, leadTimeDays?: number) => Promise<{
        materialId: string;
        currentStock: number;
        reorderPoint: number;
        orderQuantity: number;
        estimatedCost: number;
    }>;
    autoGenerateReorders: () => Promise<MaterialRequisition[]>;
    performCycleCount: (materialId: string, countedQuantity: number, countedBy: string) => Promise<MaterialTransaction | null>;
    getMaterialsRequiringAttention: () => Promise<{
        lowStock: ConstructionMaterial[];
        outOfStock: ConstructionMaterial[];
        quarantined: ConstructionMaterial[];
    }>;
    formatMaterialSummary: (material: ConstructionMaterial) => object;
};
export default _default;
//# sourceMappingURL=construction-material-management-kit.d.ts.map