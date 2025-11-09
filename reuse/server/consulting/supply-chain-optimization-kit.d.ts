/**
 * LOC: CONS-SCO-001
 * File: /reuse/server/consulting/supply-chain-optimization-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - @nestjs/common (Injectable)
 *   - @nestjs/swagger (ApiProperty, ApiResponse)
 *   - class-validator (decorators)
 *   - class-transformer (Type, Transform)
 *
 * DOWNSTREAM (imported by):
 *   - backend/consulting/supply-chain.service.ts
 *   - backend/consulting/operations.controller.ts
 *   - backend/consulting/logistics.service.ts
 */
/**
 * File: /reuse/server/consulting/supply-chain-optimization-kit.ts
 * Locator: WC-CONS-SCO-001
 * Purpose: Enterprise-grade Supply Chain Optimization Kit - network design, inventory optimization, demand forecasting, logistics
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, class-validator 0.14.x, class-transformer 0.5.x
 * Downstream: Supply chain services, operations controllers, logistics processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 43 production-ready functions for supply chain optimization competing with McKinsey, BCG operations consulting
 *
 * LLM Context: Comprehensive supply chain utilities for production-ready operations consulting applications.
 * Provides network optimization, inventory management (EOQ, safety stock, reorder points), demand forecasting,
 * supplier performance scoring, logistics optimization, route planning, bullwhip effect analysis,
 * supply chain resilience assessment, warehouse optimization, and total cost of ownership analysis.
 */
import { Model, Sequelize } from 'sequelize';
/**
 * Supply chain network node types
 */
export declare enum NodeType {
    SUPPLIER = "supplier",
    MANUFACTURING_PLANT = "manufacturing_plant",
    DISTRIBUTION_CENTER = "distribution_center",
    WAREHOUSE = "warehouse",
    RETAIL_LOCATION = "retail_location",
    CUSTOMER = "customer",
    CROSS_DOCK = "cross_dock"
}
/**
 * Transportation modes
 */
export declare enum TransportMode {
    AIR = "air",
    OCEAN = "ocean",
    RAIL = "rail",
    TRUCK = "truck",
    INTERMODAL = "intermodal",
    PARCEL = "parcel",
    COURIER = "courier"
}
/**
 * Inventory policy types
 */
export declare enum InventoryPolicy {
    CONTINUOUS_REVIEW = "continuous_review",
    PERIODIC_REVIEW = "periodic_review",
    MIN_MAX = "min_max",
    JUST_IN_TIME = "just_in_time",
    VENDOR_MANAGED = "vendor_managed",
    CONSIGNMENT = "consignment"
}
/**
 * Demand forecasting methods
 */
export declare enum ForecastMethod {
    MOVING_AVERAGE = "moving_average",
    EXPONENTIAL_SMOOTHING = "exponential_smoothing",
    HOLT_WINTERS = "holt_winters",
    ARIMA = "arima",
    REGRESSION = "regression",
    MACHINE_LEARNING = "machine_learning",
    JUDGMENTAL = "judgmental"
}
/**
 * Supplier performance categories
 */
export declare enum SupplierPerformanceCategory {
    STRATEGIC = "strategic",
    PREFERRED = "preferred",
    APPROVED = "approved",
    CONDITIONAL = "conditional",
    PROBATION = "probation",
    DISQUALIFIED = "disqualified"
}
/**
 * Risk severity levels
 */
export declare enum RiskSeverity {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    NEGLIGIBLE = "negligible"
}
/**
 * Warehouse layout strategies
 */
export declare enum WarehouseLayoutStrategy {
    RANDOM = "random",
    DEDICATED = "dedicated",
    CLASS_BASED = "class_based",
    SHARED = "shared",
    ZONE_BASED = "zone_based"
}
/**
 * Service level types
 */
export declare enum ServiceLevelType {
    FILL_RATE = "fill_rate",
    ORDER_FILL_RATE = "order_fill_rate",
    CYCLE_SERVICE_LEVEL = "cycle_service_level",
    READY_RATE = "ready_rate"
}
/**
 * Supply chain resilience dimensions
 */
export declare enum ResilienceDimension {
    FLEXIBILITY = "flexibility",
    REDUNDANCY = "redundancy",
    VISIBILITY = "visibility",
    COLLABORATION = "collaboration",
    AGILITY = "agility",
    ROBUSTNESS = "robustness"
}
interface NetworkNode {
    nodeId: string;
    nodeName: string;
    nodeType: NodeType;
    location: GeographicLocation;
    capacity: number;
    fixedCost: number;
    variableCost: number;
    throughput: number;
    utilization: number;
    isActive: boolean;
    constraints?: Record<string, any>;
}
interface GeographicLocation {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
}
interface NetworkLink {
    linkId: string;
    sourceNodeId: string;
    destinationNodeId: string;
    transportMode: TransportMode;
    distance: number;
    transitTime: number;
    costPerUnit: number;
    capacity: number;
    currentFlow: number;
    reliability: number;
}
interface NetworkOptimization {
    optimizationId: string;
    networkName: string;
    nodes: NetworkNode[];
    links: NetworkLink[];
    totalCost: number;
    totalCapacity: number;
    utilizationRate: number;
    serviceLevel: number;
    optimizationObjective: 'minimize_cost' | 'maximize_service' | 'balanced';
    constraints: string[];
    recommendations: string[];
}
interface InventoryParameters {
    productId: string;
    productName: string;
    annualDemand: number;
    demandVariability: number;
    orderingCost: number;
    holdingCostRate: number;
    unitCost: number;
    leadTime: number;
    leadTimeVariability: number;
    serviceLevel: number;
    policy: InventoryPolicy;
}
interface EOQAnalysis {
    productId: string;
    economicOrderQuantity: number;
    optimalOrderFrequency: number;
    totalAnnualCost: number;
    orderingCost: number;
    holdingCost: number;
    numberOfOrders: number;
    cycleTime: number;
    averageInventory: number;
}
interface SafetyStockCalculation {
    productId: string;
    safetyStock: number;
    reorderPoint: number;
    serviceLevel: number;
    zScore: number;
    demandDuringLeadTime: number;
    standardDeviationDemand: number;
    leadTimeDays: number;
    policy: string;
}
interface DemandForecast {
    forecastId: string;
    productId: string;
    productName: string;
    method: ForecastMethod;
    historicalData: number[];
    forecastPeriods: number[];
    forecastValues: number[];
    confidenceIntervals: Array<{
        lower: number;
        upper: number;
    }>;
    accuracy: ForecastAccuracy;
    parameters: Record<string, any>;
    generatedDate: Date;
}
interface ForecastAccuracy {
    mape: number;
    mad: number;
    mse: number;
    rmse: number;
    trackingSignal: number;
    bias: number;
}
interface SupplierPerformance {
    supplierId: string;
    supplierName: string;
    category: SupplierPerformanceCategory;
    overallScore: number;
    qualityScore: number;
    deliveryScore: number;
    costScore: number;
    responsivenessScore: number;
    innovationScore: number;
    riskScore: number;
    spend: number;
    defectRate: number;
    onTimeDeliveryRate: number;
    leadTimePerformance: number;
    recommendations: string[];
}
interface SupplierMetric {
    metricName: string;
    category: string;
    weight: number;
    target: number;
    actual: number;
    score: number;
    variance: number;
}
interface RouteOptimization {
    routeId: string;
    origin: string;
    destination: string;
    waypoints: string[];
    totalDistance: number;
    totalTime: number;
    totalCost: number;
    transportMode: TransportMode;
    sequence: number[];
    vehicleUtilization: number;
    constraints: string[];
}
interface VehicleRoutingProblem {
    problemId: string;
    vehicles: Vehicle[];
    deliveryPoints: DeliveryPoint[];
    routes: RouteOptimization[];
    totalDistance: number;
    totalCost: number;
    totalTime: number;
    utilizationRate: number;
    unservedPoints: string[];
}
interface Vehicle {
    vehicleId: string;
    vehicleType: string;
    capacity: number;
    maxDistance: number;
    costPerKm: number;
    fixedCost: number;
    availableHours: number;
    homeBase: string;
}
interface DeliveryPoint {
    pointId: string;
    location: GeographicLocation;
    demand: number;
    timeWindow: {
        start: number;
        end: number;
    };
    serviceTime: number;
    priority: number;
}
interface BullwhipAnalysis {
    analysisId: string;
    supplyChainStages: string[];
    demandVariability: number[];
    orderVariability: number[];
    amplificationRatio: number;
    causes: BullwhipCause[];
    recommendations: string[];
    estimatedImpact: number;
}
interface BullwhipCause {
    cause: string;
    severity: RiskSeverity;
    contribution: number;
    mitigation: string;
}
interface SupplyChainResilience {
    assessmentId: string;
    networkId: string;
    overallScore: number;
    dimensions: ResilienceDimensionScore[];
    vulnerabilities: Vulnerability[];
    mitigationStrategies: string[];
    investmentRequired: number;
    expectedBenefit: number;
}
interface ResilienceDimensionScore {
    dimension: ResilienceDimension;
    score: number;
    maturityLevel: 'nascent' | 'developing' | 'defined' | 'advanced' | 'optimized';
    gaps: string[];
    initiatives: string[];
}
interface Vulnerability {
    vulnerabilityId: string;
    type: string;
    description: string;
    severity: RiskSeverity;
    likelihood: number;
    impact: number;
    riskScore: number;
    affectedNodes: string[];
    mitigation: string;
    cost: number;
}
interface WarehouseOptimization {
    warehouseId: string;
    warehouseName: string;
    totalArea: number;
    usableArea: number;
    utilizationRate: number;
    layoutStrategy: WarehouseLayoutStrategy;
    zones: WarehouseZone[];
    pickingStrategy: 'FIFO' | 'LIFO' | 'FEFO' | 'ABC';
    throughput: number;
    laborProductivity: number;
    recommendations: string[];
}
interface WarehouseZone {
    zoneId: string;
    zoneName: string;
    area: number;
    storageType: 'pallet' | 'bulk' | 'shelving' | 'flow_rack' | 'automated';
    capacity: number;
    currentOccupancy: number;
    accessFrequency: number;
    products: string[];
}
interface TotalCostOfOwnership {
    tcoId: string;
    productOrService: string;
    timeHorizon: number;
    acquisitionCost: number;
    operatingCosts: number[];
    maintenanceCosts: number[];
    disposalCost: number;
    totalCost: number;
    annualizedCost: number;
    costBreakdown: Record<string, number>;
}
interface ABCAnalysis {
    analysisId: string;
    products: ABCClassification[];
    classAThreshold: number;
    classBThreshold: number;
    classCThreshold: number;
    totalValue: number;
    recommendations: Record<string, string[]>;
}
interface ABCClassification {
    productId: string;
    productName: string;
    annualUsage: number;
    unitCost: number;
    annualValue: number;
    cumulativePercentage: number;
    classification: 'A' | 'B' | 'C';
}
interface ServiceLevelAgreement {
    slaId: string;
    partnerId: string;
    partnerName: string;
    serviceType: string;
    metrics: SLAMetric[];
    complianceRate: number;
    penaltiesIncurred: number;
    status: 'compliant' | 'at_risk' | 'breach';
}
interface SLAMetric {
    metricName: string;
    target: number;
    actual: number;
    unit: string;
    weight: number;
    isCompliant: boolean;
    penalty: number;
}
interface LoadOptimization {
    loadId: string;
    vehicleCapacity: number;
    items: LoadItem[];
    totalWeight: number;
    totalVolume: number;
    weightUtilization: number;
    volumeUtilization: number;
    loadingSequence: number[];
    unusedSpace: number;
}
interface LoadItem {
    itemId: string;
    weight: number;
    volume: number;
    quantity: number;
    stackable: boolean;
    fragile: boolean;
    priority: number;
}
/**
 * Create Network Node DTO
 */
export declare class CreateNetworkNodeDto {
    nodeName: string;
    nodeType: NodeType;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    country: string;
    capacity: number;
    fixedCost: number;
    variableCost: number;
}
/**
 * Inventory Parameters DTO
 */
export declare class InventoryParametersDto {
    productId: string;
    productName: string;
    annualDemand: number;
    demandVariability: number;
    orderingCost: number;
    holdingCostRate: number;
    unitCost: number;
    leadTime: number;
    serviceLevel: number;
}
/**
 * Demand Forecast Request DTO
 */
export declare class DemandForecastRequestDto {
    productId: string;
    productName: string;
    historicalData: number[];
    method: ForecastMethod;
    periodsToForecast: number;
}
/**
 * Supplier Metric DTO
 */
export declare class SupplierMetricDto {
    metricName: string;
    category: string;
    weight: number;
    target: number;
    actual: number;
}
/**
 * Vehicle DTO
 */
export declare class VehicleDto {
    vehicleType: string;
    capacity: number;
    maxDistance: number;
    costPerKm: number;
    fixedCost: number;
    availableHours: number;
}
/**
 * Delivery Point DTO
 */
export declare class DeliveryPointDto {
    pointId: string;
    latitude: number;
    longitude: number;
    demand: number;
    serviceTime: number;
    priority: number;
}
/**
 * Warehouse Zone DTO
 */
export declare class WarehouseZoneDto {
    zoneName: string;
    area: number;
    storageType: 'pallet' | 'bulk' | 'shelving' | 'flow_rack' | 'automated';
    capacity: number;
    accessFrequency: number;
}
/**
 * ABC Product DTO
 */
export declare class ABCProductDto {
    productId: string;
    productName: string;
    annualUsage: number;
    unitCost: number;
}
/**
 * Supply Chain Network Node Sequelize model.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     NetworkNode:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         nodeId:
 *           type: string
 *         nodeName:
 *           type: string
 *         nodeType:
 *           type: string
 *           enum: [supplier, manufacturing_plant, distribution_center, warehouse, retail_location, customer, cross_dock]
 *         capacity:
 *           type: number
 *         utilization:
 *           type: number
 */
export declare class NetworkNodeModel extends Model {
    id: string;
    nodeId: string;
    nodeName: string;
    nodeType: NodeType;
    location: GeographicLocation;
    capacity: number;
    fixedCost: number;
    variableCost: number;
    throughput: number;
    utilization: number;
    isActive: boolean;
    constraints?: Record<string, any>;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export declare function initNetworkNodeModel(sequelize: Sequelize): typeof NetworkNodeModel;
/**
 * Supplier Performance Sequelize model.
 */
export declare class SupplierPerformanceModel extends Model {
    id: string;
    supplierId: string;
    supplierName: string;
    category: SupplierPerformanceCategory;
    overallScore: number;
    qualityScore: number;
    deliveryScore: number;
    costScore: number;
    spend: number;
    defectRate: number;
    onTimeDeliveryRate: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export declare function initSupplierPerformanceModel(sequelize: Sequelize): typeof SupplierPerformanceModel;
/**
 * Calculates Economic Order Quantity (EOQ).
 *
 * @swagger
 * @openapi
 * /api/supply-chain/eoq:
 *   post:
 *     tags:
 *       - Supply Chain
 *     summary: Calculate EOQ
 *     description: Calculates optimal order quantity to minimize total inventory costs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryParametersDto'
 *     responses:
 *       200:
 *         description: EOQ analysis
 *
 * @param {InventoryParameters} params - Inventory parameters
 * @returns {Promise<EOQAnalysis>} EOQ analysis result
 *
 * @example
 * ```typescript
 * const eoq = await calculateEOQ({
 *   productId: 'uuid-prod',
 *   annualDemand: 10000,
 *   orderingCost: 100,
 *   holdingCostRate: 0.25,
 *   unitCost: 50
 * });
 * console.log(`EOQ: ${eoq.economicOrderQuantity} units`);
 * ```
 */
export declare function calculateEOQ(params: Partial<InventoryParameters>): Promise<EOQAnalysis>;
/**
 * Calculates safety stock and reorder point.
 *
 * @param {InventoryParameters} params - Inventory parameters
 * @returns {Promise<SafetyStockCalculation>} Safety stock calculation
 *
 * @example
 * ```typescript
 * const safetyStock = await calculateSafetyStock({
 *   productId: 'uuid-prod',
 *   annualDemand: 10000,
 *   demandVariability: 500,
 *   leadTime: 14,
 *   serviceLevel: 0.95
 * });
 * console.log(`Safety stock: ${safetyStock.safetyStock} units`);
 * console.log(`Reorder point: ${safetyStock.reorderPoint} units`);
 * ```
 */
export declare function calculateSafetyStock(params: Partial<InventoryParameters>): Promise<SafetyStockCalculation>;
/**
 * Performs demand forecasting using specified method.
 *
 * @param {string} productId - Product ID
 * @param {string} productName - Product name
 * @param {number[]} historicalData - Historical demand data
 * @param {ForecastMethod} method - Forecasting method
 * @param {number} periods - Number of periods to forecast
 * @returns {Promise<DemandForecast>} Demand forecast
 *
 * @example
 * ```typescript
 * const forecast = await generateDemandForecast(
 *   'uuid-prod',
 *   'Widget A',
 *   [100, 110, 105, 120, 115, 125, 130, 135, 128, 140, 145, 150],
 *   ForecastMethod.MOVING_AVERAGE,
 *   6
 * );
 * console.log(`Next period forecast: ${forecast.forecastValues[0]}`);
 * ```
 */
export declare function generateDemandForecast(productId: string, productName: string, historicalData: number[], method: ForecastMethod, periods: number): Promise<DemandForecast>;
/**
 * Evaluates supplier performance across multiple dimensions.
 *
 * @param {string} supplierId - Supplier ID
 * @param {string} supplierName - Supplier name
 * @param {SupplierMetric[]} metrics - Supplier metrics
 * @returns {Promise<SupplierPerformance>} Supplier performance evaluation
 *
 * @example
 * ```typescript
 * const performance = await evaluateSupplierPerformance('SUP-001', 'ACME Corp', metrics);
 * console.log(`Overall score: ${performance.overallScore}`);
 * console.log(`Category: ${performance.category}`);
 * ```
 */
export declare function evaluateSupplierPerformance(supplierId: string, supplierName: string, metrics: SupplierMetric[]): Promise<SupplierPerformance>;
/**
 * Optimizes vehicle routing for deliveries.
 *
 * @param {Vehicle[]} vehicles - Available vehicles
 * @param {DeliveryPoint[]} deliveryPoints - Delivery points
 * @param {string} depotLocation - Depot location ID
 * @returns {Promise<VehicleRoutingProblem>} Optimized routing solution
 *
 * @example
 * ```typescript
 * const vrp = await optimizeVehicleRouting(vehicles, deliveryPoints, 'DEPOT-001');
 * console.log(`Total distance: ${vrp.totalDistance} km`);
 * console.log(`Total cost: $${vrp.totalCost.toLocaleString()}`);
 * ```
 */
export declare function optimizeVehicleRouting(vehicles: Vehicle[], deliveryPoints: DeliveryPoint[], depotLocation: string): Promise<VehicleRoutingProblem>;
/**
 * Performs bullwhip effect analysis.
 *
 * @param {string[]} stages - Supply chain stages
 * @param {number[][]} demandData - Demand data for each stage over time
 * @returns {Promise<BullwhipAnalysis>} Bullwhip analysis
 *
 * @example
 * ```typescript
 * const bullwhip = await analyzeBullwhipEffect(
 *   ['Retailer', 'Distributor', 'Manufacturer', 'Supplier'],
 *   demandDataByStage
 * );
 * console.log(`Amplification ratio: ${bullwhip.amplificationRatio.toFixed(2)}`);
 * ```
 */
export declare function analyzeBullwhipEffect(stages: string[], demandData: number[][]): Promise<BullwhipAnalysis>;
/**
 * Assesses supply chain resilience.
 *
 * @param {string} networkId - Network ID
 * @param {Record<ResilienceDimension, number>} dimensionScores - Scores for each dimension
 * @returns {Promise<SupplyChainResilience>} Resilience assessment
 *
 * @example
 * ```typescript
 * const resilience = await assessSupplyChainResilience('NET-001', dimensionScores);
 * console.log(`Overall resilience score: ${resilience.overallScore}`);
 * ```
 */
export declare function assessSupplyChainResilience(networkId: string, dimensionScores: Record<ResilienceDimension, number>): Promise<SupplyChainResilience>;
/**
 * Optimizes warehouse layout and operations.
 *
 * @param {string} warehouseId - Warehouse ID
 * @param {number} totalArea - Total warehouse area
 * @param {WarehouseZone[]} zones - Warehouse zones
 * @returns {Promise<WarehouseOptimization>} Warehouse optimization
 *
 * @example
 * ```typescript
 * const warehouseOpt = await optimizeWarehouse('WH-001', 50000, zones);
 * console.log(`Utilization rate: ${warehouseOpt.utilizationRate.toFixed(2)}%`);
 * ```
 */
export declare function optimizeWarehouse(warehouseId: string, warehouseName: string, totalArea: number, zones: WarehouseZone[]): Promise<WarehouseOptimization>;
/**
 * Performs ABC analysis for inventory classification.
 *
 * @param {Array<{ productId: string; productName: string; annualUsage: number; unitCost: number }>} products - Products
 * @returns {Promise<ABCAnalysis>} ABC analysis
 *
 * @example
 * ```typescript
 * const abcAnalysis = await performABCAnalysis(products);
 * console.log(`Class A products: ${abcAnalysis.products.filter(p => p.classification === 'A').length}`);
 * ```
 */
export declare function performABCAnalysis(products: Array<{
    productId: string;
    productName: string;
    annualUsage: number;
    unitCost: number;
}>): Promise<ABCAnalysis>;
/**
 * Calculates total cost of ownership.
 *
 * @param {string} productOrService - Product or service name
 * @param {number} acquisitionCost - Initial acquisition cost
 * @param {number[]} operatingCosts - Annual operating costs
 * @param {number[]} maintenanceCosts - Annual maintenance costs
 * @param {number} disposalCost - End-of-life disposal cost
 * @returns {Promise<TotalCostOfOwnership>} TCO analysis
 *
 * @example
 * ```typescript
 * const tco = await calculateTotalCostOfOwnership(
 *   'Forklift Fleet',
 *   500000,
 *   [80000, 85000, 90000, 95000, 100000],
 *   [10000, 12000, 15000, 18000, 20000],
 *   50000
 * );
 * console.log(`Total cost: $${tco.totalCost.toLocaleString()}`);
 * ```
 */
export declare function calculateTotalCostOfOwnership(productOrService: string, acquisitionCost: number, operatingCosts: number[], maintenanceCosts: number[], disposalCost: number): Promise<TotalCostOfOwnership>;
/**
 * Optimizes network design for supply chain.
 *
 * @param {string} networkName - Network name
 * @param {NetworkNode[]} nodes - Network nodes
 * @param {NetworkLink[]} links - Network links
 * @param {'minimize_cost' | 'maximize_service' | 'balanced'} objective - Optimization objective
 * @returns {Promise<NetworkOptimization>} Network optimization
 *
 * @example
 * ```typescript
 * const networkOpt = await optimizeSupplyChainNetwork('North America Network', nodes, links, 'balanced');
 * console.log(`Total network cost: $${networkOpt.totalCost.toLocaleString()}`);
 * ```
 */
export declare function optimizeSupplyChainNetwork(networkName: string, nodes: NetworkNode[], links: NetworkLink[], objective: 'minimize_cost' | 'maximize_service' | 'balanced'): Promise<NetworkOptimization>;
/**
 * Calculates optimal shipment consolidation.
 *
 * @param {Array<{ shipmentId: string; weight: number; volume: number; destination: string; deadline: Date }>} shipments - Shipments
 * @param {number} truckCapacity - Truck capacity
 * @returns {Promise<Array<{ consolidationId: string; shipments: string[]; savings: number }>>} Consolidation plan
 *
 * @example
 * ```typescript
 * const consolidation = await calculateShipmentConsolidation(shipments, 20000);
 * console.log(`Total savings: $${consolidation.reduce((sum, c) => sum + c.savings, 0).toLocaleString()}`);
 * ```
 */
export declare function calculateShipmentConsolidation(shipments: Array<{
    shipmentId: string;
    weight: number;
    volume: number;
    destination: string;
    deadline: Date;
}>, truckCapacity: number): Promise<Array<{
    consolidationId: string;
    shipments: string[];
    totalWeight: number;
    savings: number;
    destination: string;
}>>;
/**
 * Performs load optimization for container/truck loading.
 *
 * @param {number} vehicleCapacity - Vehicle weight capacity
 * @param {LoadItem[]} items - Items to load
 * @returns {Promise<LoadOptimization>} Load optimization
 *
 * @example
 * ```typescript
 * const loadOpt = await optimizeLoad(20000, items);
 * console.log(`Weight utilization: ${loadOpt.weightUtilization.toFixed(2)}%`);
 * ```
 */
export declare function optimizeLoad(vehicleCapacity: number, volumeCapacity: number, items: LoadItem[]): Promise<LoadOptimization>;
/**
 * Calculates carbon footprint of supply chain operations.
 *
 * @param {Array<{ mode: TransportMode; distance: number; weight: number }>} shipments - Shipments
 * @returns {Promise<{ totalEmissions: number; emissionsByMode: Record<TransportMode, number> }>} Carbon footprint
 *
 * @example
 * ```typescript
 * const carbon = await calculateCarbonFootprint(shipments);
 * console.log(`Total emissions: ${carbon.totalEmissions.toFixed(2)} kg CO2`);
 * ```
 */
export declare function calculateCarbonFootprint(shipments: Array<{
    mode: TransportMode;
    distance: number;
    weight: number;
}>): Promise<{
    totalEmissions: number;
    emissionsByMode: Record<TransportMode, number>;
    recommendations: string[];
}>;
/**
 * Performs supplier risk assessment.
 *
 * @param {string} supplierId - Supplier ID
 * @param {Record<string, number>} riskFactors - Risk factors and scores
 * @returns {Promise<{ overallRisk: RiskSeverity; riskScore: number; mitigationActions: string[] }>} Risk assessment
 *
 * @example
 * ```typescript
 * const risk = await assessSupplierRisk('SUP-001', {
 *   financial: 7,
 *   geographic: 4,
 *   operational: 5,
 *   compliance: 3
 * });
 * console.log(`Overall risk: ${risk.overallRisk}`);
 * ```
 */
export declare function assessSupplierRisk(supplierId: string, supplierName: string, riskFactors: Record<string, number>): Promise<{
    supplierId: string;
    supplierName: string;
    overallRisk: RiskSeverity;
    riskScore: number;
    mitigationActions: string[];
    riskBreakdown: Record<string, number>;
}>;
/**
 * Calculates days of inventory on hand.
 *
 * @param {number} inventoryValue - Current inventory value
 * @param {number} annualCostOfGoodsSold - Annual COGS
 * @returns {Promise<{ daysOfInventory: number; turnoverRate: number; recommendation: string }>} Inventory days
 *
 * @example
 * ```typescript
 * const inventoryDays = await calculateInventoryDays(5000000, 30000000);
 * console.log(`Days of inventory: ${inventoryDays.daysOfInventory.toFixed(1)}`);
 * ```
 */
export declare function calculateInventoryDays(inventoryValue: number, annualCostOfGoodsSold: number): Promise<{
    daysOfInventory: number;
    turnoverRate: number;
    recommendation: string;
}>;
/**
 * Performs service level agreement (SLA) compliance tracking.
 *
 * @param {string} partnerId - Partner ID
 * @param {string} partnerName - Partner name
 * @param {SLAMetric[]} metrics - SLA metrics
 * @returns {Promise<ServiceLevelAgreement>} SLA compliance
 *
 * @example
 * ```typescript
 * const sla = await trackSLACompliance('PARTNER-001', 'Acme Logistics', metrics);
 * console.log(`Compliance rate: ${sla.complianceRate.toFixed(2)}%`);
 * ```
 */
export declare function trackSLACompliance(partnerId: string, partnerName: string, serviceType: string, metrics: SLAMetric[]): Promise<ServiceLevelAgreement>;
/**
 * Calculates optimal production batch size.
 *
 * @param {number} setupCost - Setup cost per batch
 * @param {number} annualDemand - Annual demand
 * @param {number} holdingCostRate - Holding cost rate
 * @param {number} unitCost - Unit production cost
 * @param {number} productionRate - Production rate (units per day)
 * @returns {Promise<{ optimalBatchSize: number; numberOfBatches: number; totalCost: number }>} Batch size calculation
 *
 * @example
 * ```typescript
 * const batchSize = await calculateOptimalBatchSize(5000, 50000, 0.2, 100, 500);
 * console.log(`Optimal batch size: ${batchSize.optimalBatchSize} units`);
 * ```
 */
export declare function calculateOptimalBatchSize(setupCost: number, annualDemand: number, holdingCostRate: number, unitCost: number, productionRate: number, demandRate: number): Promise<{
    optimalBatchSize: number;
    numberOfBatches: number;
    totalCost: number;
    cycleTime: number;
}>;
/**
 * Analyzes supply chain cash-to-cash cycle time.
 *
 * @param {number} daysInventoryOutstanding - Days inventory outstanding
 * @param {number} daysPayableOutstanding - Days payable outstanding
 * @param {number} daysSalesOutstanding - Days sales outstanding
 * @returns {Promise<{ cashToCashCycle: number; recommendation: string; benchmark: number }>} Cash cycle analysis
 *
 * @example
 * ```typescript
 * const cashCycle = await analyzeCashToCashCycle(45, 30, 60);
 * console.log(`Cash-to-cash cycle: ${cashCycle.cashToCashCycle} days`);
 * ```
 */
export declare function analyzeCashToCashCycle(daysInventoryOutstanding: number, daysSalesOutstanding: number, daysPayableOutstanding: number): Promise<{
    cashToCashCycle: number;
    recommendation: string;
    benchmark: number;
    breakdown: Record<string, number>;
}>;
/**
 * Performs make vs buy analysis.
 *
 * @param {string} componentName - Component name
 * @param {number} annualVolume - Annual volume required
 * @param {number} makeCostPerUnit - Cost to make per unit
 * @param {number} makeFixedCost - Fixed cost to make in-house
 * @param {number} buyCostPerUnit - Cost to buy per unit
 * @returns {Promise<{ recommendation: 'make' | 'buy'; makeTotalCost: number; buyTotalCost: number; savings: number }>} Make vs buy decision
 *
 * @example
 * ```typescript
 * const decision = await performMakeVsBuyAnalysis('Widget Component', 10000, 15, 50000, 20);
 * console.log(`Recommendation: ${decision.recommendation}`);
 * console.log(`Savings: $${decision.savings.toLocaleString()}`);
 * ```
 */
export declare function performMakeVsBuyAnalysis(componentName: string, annualVolume: number, makeCostPerUnit: number, makeFixedCost: number, buyCostPerUnit: number, buyFixedCost?: number): Promise<{
    componentName: string;
    recommendation: 'make' | 'buy';
    makeTotalCost: number;
    buyTotalCost: number;
    savings: number;
    breakEvenVolume: number;
}>;
/**
 * Calculates supply chain cost-to-serve by customer segment.
 *
 * @param {Array<{ segment: string; revenue: number; costs: Record<string, number> }>} segments - Customer segments
 * @returns {Promise<Array<{ segment: string; revenue: number; totalCost: number; costToServe: number; margin: number }>>} Cost-to-serve analysis
 *
 * @example
 * ```typescript
 * const costToServe = await calculateCostToServe(customerSegments);
 * costToServe.forEach(s => {
 *   console.log(`${s.segment}: ${s.costToServe.toFixed(2)}% cost-to-serve, ${s.margin.toFixed(2)}% margin`);
 * });
 * ```
 */
export declare function calculateCostToServe(segments: Array<{
    segment: string;
    revenue: number;
    costs: Record<string, number>;
}>): Promise<Array<{
    segment: string;
    revenue: number;
    totalCost: number;
    costToServe: number;
    margin: number;
    profitability: 'high' | 'medium' | 'low';
}>>;
/**
 * Performs postponement strategy analysis.
 *
 * @param {string} productFamily - Product family
 * @param {number} forecastAccuracy - Forecast accuracy percentage
 * @param {number} customizationCost - Cost of late customization
 * @param {number} inventoryCarryingCost - Inventory carrying cost
 * @returns {Promise<{ recommendation: string; expectedSavings: number; riskLevel: RiskSeverity }>} Postponement analysis
 *
 * @example
 * ```typescript
 * const postponement = await analyzePostponementStrategy('Electronics', 70, 5, 2);
 * console.log(`Recommendation: ${postponement.recommendation}`);
 * ```
 */
export declare function analyzePostponementStrategy(productFamily: string, forecastAccuracy: number, customizationCost: number, inventoryCarryingCost: number, demandVariability: number): Promise<{
    productFamily: string;
    recommendation: string;
    expectedSavings: number;
    riskLevel: RiskSeverity;
    postponementType: string;
}>;
export {};
//# sourceMappingURL=supply-chain-optimization-kit.d.ts.map