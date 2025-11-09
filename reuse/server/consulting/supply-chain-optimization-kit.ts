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

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDate,
  IsArray,
  IsBoolean,
  IsUUID,
  Min,
  Max,
  ValidateNested,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsObject,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Supply chain network node types
 */
export enum NodeType {
  SUPPLIER = 'supplier',
  MANUFACTURING_PLANT = 'manufacturing_plant',
  DISTRIBUTION_CENTER = 'distribution_center',
  WAREHOUSE = 'warehouse',
  RETAIL_LOCATION = 'retail_location',
  CUSTOMER = 'customer',
  CROSS_DOCK = 'cross_dock',
}

/**
 * Transportation modes
 */
export enum TransportMode {
  AIR = 'air',
  OCEAN = 'ocean',
  RAIL = 'rail',
  TRUCK = 'truck',
  INTERMODAL = 'intermodal',
  PARCEL = 'parcel',
  COURIER = 'courier',
}

/**
 * Inventory policy types
 */
export enum InventoryPolicy {
  CONTINUOUS_REVIEW = 'continuous_review',
  PERIODIC_REVIEW = 'periodic_review',
  MIN_MAX = 'min_max',
  JUST_IN_TIME = 'just_in_time',
  VENDOR_MANAGED = 'vendor_managed',
  CONSIGNMENT = 'consignment',
}

/**
 * Demand forecasting methods
 */
export enum ForecastMethod {
  MOVING_AVERAGE = 'moving_average',
  EXPONENTIAL_SMOOTHING = 'exponential_smoothing',
  HOLT_WINTERS = 'holt_winters',
  ARIMA = 'arima',
  REGRESSION = 'regression',
  MACHINE_LEARNING = 'machine_learning',
  JUDGMENTAL = 'judgmental',
}

/**
 * Supplier performance categories
 */
export enum SupplierPerformanceCategory {
  STRATEGIC = 'strategic',
  PREFERRED = 'preferred',
  APPROVED = 'approved',
  CONDITIONAL = 'conditional',
  PROBATION = 'probation',
  DISQUALIFIED = 'disqualified',
}

/**
 * Risk severity levels
 */
export enum RiskSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  NEGLIGIBLE = 'negligible',
}

/**
 * Warehouse layout strategies
 */
export enum WarehouseLayoutStrategy {
  RANDOM = 'random',
  DEDICATED = 'dedicated',
  CLASS_BASED = 'class_based',
  SHARED = 'shared',
  ZONE_BASED = 'zone_based',
}

/**
 * Service level types
 */
export enum ServiceLevelType {
  FILL_RATE = 'fill_rate',
  ORDER_FILL_RATE = 'order_fill_rate',
  CYCLE_SERVICE_LEVEL = 'cycle_service_level',
  READY_RATE = 'ready_rate',
}

/**
 * Supply chain resilience dimensions
 */
export enum ResilienceDimension {
  FLEXIBILITY = 'flexibility',
  REDUNDANCY = 'redundancy',
  VISIBILITY = 'visibility',
  COLLABORATION = 'collaboration',
  AGILITY = 'agility',
  ROBUSTNESS = 'robustness',
}

// ============================================================================
// INTERFACE DEFINITIONS
// ============================================================================

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
  confidenceIntervals: Array<{ lower: number; upper: number }>;
  accuracy: ForecastAccuracy;
  parameters: Record<string, any>;
  generatedDate: Date;
}

interface ForecastAccuracy {
  mape: number; // Mean Absolute Percentage Error
  mad: number; // Mean Absolute Deviation
  mse: number; // Mean Squared Error
  rmse: number; // Root Mean Squared Error
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

interface SupplierScorecard {
  scorecardId: string;
  supplierId: string;
  evaluationPeriod: string;
  metrics: SupplierMetric[];
  totalScore: number;
  trend: 'improving' | 'stable' | 'declining';
  actionItems: string[];
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
  timeWindow: { start: number; end: number };
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

// ============================================================================
// DTO DEFINITIONS
// ============================================================================

/**
 * Create Network Node DTO
 */
export class CreateNetworkNodeDto {
  @ApiProperty({ description: 'Node name', example: 'Chicago Distribution Center' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  nodeName: string;

  @ApiProperty({ description: 'Node type', enum: NodeType })
  @IsEnum(NodeType)
  nodeType: NodeType;

  @ApiProperty({ description: 'Latitude', example: 41.8781, minimum: -90, maximum: 90 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ description: 'Longitude', example: -87.6298, minimum: -180, maximum: 180 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiProperty({ description: 'City', example: 'Chicago' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'State', example: 'IL' })
  @IsString()
  state: string;

  @ApiProperty({ description: 'Country', example: 'USA' })
  @IsString()
  country: string;

  @ApiProperty({ description: 'Annual capacity', example: 1000000, minimum: 0 })
  @IsNumber()
  @Min(0)
  capacity: number;

  @ApiProperty({ description: 'Fixed cost per year', example: 500000, minimum: 0 })
  @IsNumber()
  @Min(0)
  fixedCost: number;

  @ApiProperty({ description: 'Variable cost per unit', example: 2.5, minimum: 0 })
  @IsNumber()
  @Min(0)
  variableCost: number;
}

/**
 * Inventory Parameters DTO
 */
export class InventoryParametersDto {
  @ApiProperty({ description: 'Product ID', example: 'uuid-product' })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'Product name', example: 'Widget A' })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty({ description: 'Annual demand', example: 10000, minimum: 1 })
  @IsNumber()
  @Min(1)
  annualDemand: number;

  @ApiProperty({ description: 'Demand variability (std dev)', example: 500, minimum: 0 })
  @IsNumber()
  @Min(0)
  demandVariability: number;

  @ApiProperty({ description: 'Ordering cost per order', example: 100, minimum: 0 })
  @IsNumber()
  @Min(0)
  orderingCost: number;

  @ApiProperty({ description: 'Holding cost rate (annual %)', example: 0.25, minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  holdingCostRate: number;

  @ApiProperty({ description: 'Unit cost', example: 50, minimum: 0 })
  @IsNumber()
  @Min(0)
  unitCost: number;

  @ApiProperty({ description: 'Lead time in days', example: 14, minimum: 0 })
  @IsNumber()
  @Min(0)
  leadTime: number;

  @ApiProperty({ description: 'Service level (0-1)', example: 0.95, minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  serviceLevel: number;
}

/**
 * Demand Forecast Request DTO
 */
export class DemandForecastRequestDto {
  @ApiProperty({ description: 'Product ID', example: 'uuid-product' })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'Product name', example: 'Widget A' })
  @IsString()
  productName: string;

  @ApiProperty({ description: 'Historical demand data', example: [100, 110, 105, 120, 115, 125], type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  historicalData: number[];

  @ApiProperty({ description: 'Forecast method', enum: ForecastMethod })
  @IsEnum(ForecastMethod)
  method: ForecastMethod;

  @ApiProperty({ description: 'Number of periods to forecast', example: 6, minimum: 1, maximum: 24 })
  @IsNumber()
  @Min(1)
  @Max(24)
  periodsToForecast: number;
}

/**
 * Supplier Metric DTO
 */
export class SupplierMetricDto {
  @ApiProperty({ description: 'Metric name', example: 'On-Time Delivery' })
  @IsString()
  @IsNotEmpty()
  metricName: string;

  @ApiProperty({ description: 'Category', example: 'Delivery' })
  @IsString()
  category: string;

  @ApiProperty({ description: 'Weight (0-1)', example: 0.3, minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  weight: number;

  @ApiProperty({ description: 'Target value', example: 98, minimum: 0 })
  @IsNumber()
  @Min(0)
  target: number;

  @ApiProperty({ description: 'Actual value', example: 95, minimum: 0 })
  @IsNumber()
  @Min(0)
  actual: number;
}

/**
 * Vehicle DTO
 */
export class VehicleDto {
  @ApiProperty({ description: 'Vehicle type', example: 'Box Truck' })
  @IsString()
  @IsNotEmpty()
  vehicleType: string;

  @ApiProperty({ description: 'Capacity (weight or volume)', example: 5000, minimum: 0 })
  @IsNumber()
  @Min(0)
  capacity: number;

  @ApiProperty({ description: 'Max distance per day (km)', example: 400, minimum: 0 })
  @IsNumber()
  @Min(0)
  maxDistance: number;

  @ApiProperty({ description: 'Cost per km', example: 1.5, minimum: 0 })
  @IsNumber()
  @Min(0)
  costPerKm: number;

  @ApiProperty({ description: 'Fixed daily cost', example: 200, minimum: 0 })
  @IsNumber()
  @Min(0)
  fixedCost: number;

  @ApiProperty({ description: 'Available hours', example: 10, minimum: 0, maximum: 24 })
  @IsNumber()
  @Min(0)
  @Max(24)
  availableHours: number;
}

/**
 * Delivery Point DTO
 */
export class DeliveryPointDto {
  @ApiProperty({ description: 'Point ID', example: 'CUST-001' })
  @IsString()
  @IsNotEmpty()
  pointId: string;

  @ApiProperty({ description: 'Latitude', example: 41.8781, minimum: -90, maximum: 90 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ description: 'Longitude', example: -87.6298, minimum: -180, maximum: 180 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiProperty({ description: 'Demand quantity', example: 100, minimum: 0 })
  @IsNumber()
  @Min(0)
  demand: number;

  @ApiProperty({ description: 'Service time (minutes)', example: 30, minimum: 0 })
  @IsNumber()
  @Min(0)
  serviceTime: number;

  @ApiProperty({ description: 'Priority (1-10)', example: 5, minimum: 1, maximum: 10 })
  @IsNumber()
  @Min(1)
  @Max(10)
  priority: number;
}

/**
 * Warehouse Zone DTO
 */
export class WarehouseZoneDto {
  @ApiProperty({ description: 'Zone name', example: 'Fast-Moving Goods' })
  @IsString()
  @IsNotEmpty()
  zoneName: string;

  @ApiProperty({ description: 'Area in square meters', example: 5000, minimum: 0 })
  @IsNumber()
  @Min(0)
  area: number;

  @ApiProperty({ description: 'Storage type', enum: ['pallet', 'bulk', 'shelving', 'flow_rack', 'automated'] })
  @IsEnum(['pallet', 'bulk', 'shelving', 'flow_rack', 'automated'])
  storageType: 'pallet' | 'bulk' | 'shelving' | 'flow_rack' | 'automated';

  @ApiProperty({ description: 'Capacity (units)', example: 10000, minimum: 0 })
  @IsNumber()
  @Min(0)
  capacity: number;

  @ApiProperty({ description: 'Access frequency score', example: 8, minimum: 1, maximum: 10 })
  @IsNumber()
  @Min(1)
  @Max(10)
  accessFrequency: number;
}

/**
 * ABC Product DTO
 */
export class ABCProductDto {
  @ApiProperty({ description: 'Product ID', example: 'uuid-product' })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'Product name', example: 'Widget A' })
  @IsString()
  productName: string;

  @ApiProperty({ description: 'Annual usage quantity', example: 10000, minimum: 0 })
  @IsNumber()
  @Min(0)
  annualUsage: number;

  @ApiProperty({ description: 'Unit cost', example: 50, minimum: 0 })
  @IsNumber()
  @Min(0)
  unitCost: number;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

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
export class NetworkNodeModel extends Model {
  public id!: string;
  public nodeId!: string;
  public nodeName!: string;
  public nodeType!: NodeType;
  public location!: GeographicLocation;
  public capacity!: number;
  public fixedCost!: number;
  public variableCost!: number;
  public throughput!: number;
  public utilization!: number;
  public isActive!: boolean;
  public constraints?: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initNetworkNodeModel(sequelize: Sequelize): typeof NetworkNodeModel {
  NetworkNodeModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      nodeId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      nodeName: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      nodeType: {
        type: DataTypes.ENUM(...Object.values(NodeType)),
        allowNull: false,
      },
      location: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      capacity: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      fixedCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      variableCost: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
      },
      throughput: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
      },
      utilization: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      constraints: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'network_nodes',
      timestamps: true,
      indexes: [
        { fields: ['nodeType'] },
        { fields: ['isActive'] },
      ],
    }
  );

  return NetworkNodeModel;
}

/**
 * Supplier Performance Sequelize model.
 */
export class SupplierPerformanceModel extends Model {
  public id!: string;
  public supplierId!: string;
  public supplierName!: string;
  public category!: SupplierPerformanceCategory;
  public overallScore!: number;
  public qualityScore!: number;
  public deliveryScore!: number;
  public costScore!: number;
  public spend!: number;
  public defectRate!: number;
  public onTimeDeliveryRate!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initSupplierPerformanceModel(sequelize: Sequelize): typeof SupplierPerformanceModel {
  SupplierPerformanceModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      supplierId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      supplierName: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      category: {
        type: DataTypes.ENUM(...Object.values(SupplierPerformanceCategory)),
        allowNull: false,
      },
      overallScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      qualityScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      deliveryScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      costScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      spend: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      defectRate: {
        type: DataTypes.DECIMAL(5, 4),
        allowNull: false,
      },
      onTimeDeliveryRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'supplier_performance',
      timestamps: true,
      indexes: [
        { fields: ['category'] },
        { fields: ['overallScore'] },
      ],
    }
  );

  return SupplierPerformanceModel;
}

// ============================================================================
// FUNCTIONS
// ============================================================================

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
export async function calculateEOQ(
  params: Partial<InventoryParameters>
): Promise<EOQAnalysis> {
  const D = params.annualDemand || 0; // Annual demand
  const S = params.orderingCost || 0; // Ordering cost per order
  const H = (params.holdingCostRate || 0) * (params.unitCost || 0); // Holding cost per unit per year

  // EOQ formula: sqrt((2 * D * S) / H)
  const eoq = Math.sqrt((2 * D * S) / H);

  const numberOfOrders = D / eoq;
  const cycleTime = 365 / numberOfOrders; // Days
  const averageInventory = eoq / 2;

  const annualOrderingCost = numberOfOrders * S;
  const annualHoldingCost = averageInventory * H;
  const totalAnnualCost = annualOrderingCost + annualHoldingCost;

  return {
    productId: params.productId || '',
    economicOrderQuantity: Math.round(eoq),
    optimalOrderFrequency: numberOfOrders,
    totalAnnualCost,
    orderingCost: annualOrderingCost,
    holdingCost: annualHoldingCost,
    numberOfOrders,
    cycleTime,
    averageInventory,
  };
}

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
export async function calculateSafetyStock(
  params: Partial<InventoryParameters>
): Promise<SafetyStockCalculation> {
  const dailyDemand = (params.annualDemand || 0) / 365;
  const leadTimeDays = params.leadTime || 0;
  const serviceLevel = params.serviceLevel || 0.95;

  // Z-score lookup (approximation)
  const zScores: Record<string, number> = {
    '0.90': 1.28,
    '0.95': 1.645,
    '0.98': 2.05,
    '0.99': 2.33,
  };

  const zScore = zScores[serviceLevel.toFixed(2)] || 1.645;

  // Safety stock = Z * σ * sqrt(LT)
  const stdDevDemand = params.demandVariability || 0;
  const safetyStock = zScore * stdDevDemand * Math.sqrt(leadTimeDays / 365);

  // Reorder point = (Daily demand * Lead time) + Safety stock
  const demandDuringLeadTime = dailyDemand * leadTimeDays;
  const reorderPoint = demandDuringLeadTime + safetyStock;

  return {
    productId: params.productId || '',
    safetyStock: Math.round(safetyStock),
    reorderPoint: Math.round(reorderPoint),
    serviceLevel,
    zScore,
    demandDuringLeadTime,
    standardDeviationDemand: stdDevDemand,
    leadTimeDays,
    policy: 'continuous_review',
  };
}

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
export async function generateDemandForecast(
  productId: string,
  productName: string,
  historicalData: number[],
  method: ForecastMethod,
  periods: number
): Promise<DemandForecast> {
  const forecastId = `FCST-${productId}-${Date.now()}`;
  let forecastValues: number[] = [];
  let parameters: Record<string, any> = {};

  if (method === ForecastMethod.MOVING_AVERAGE) {
    const windowSize = Math.min(3, historicalData.length);
    parameters.windowSize = windowSize;

    for (let i = 0; i < periods; i++) {
      const dataToUse = i === 0 ? historicalData : [...historicalData, ...forecastValues];
      const lastN = dataToUse.slice(-windowSize);
      const average = lastN.reduce((sum, val) => sum + val, 0) / windowSize;
      forecastValues.push(average);
    }
  } else if (method === ForecastMethod.EXPONENTIAL_SMOOTHING) {
    const alpha = 0.3; // Smoothing parameter
    parameters.alpha = alpha;

    let lastSmoothed = historicalData[0];
    for (let i = 1; i < historicalData.length; i++) {
      lastSmoothed = alpha * historicalData[i] + (1 - alpha) * lastSmoothed;
    }

    for (let i = 0; i < periods; i++) {
      forecastValues.push(lastSmoothed);
    }
  } else if (method === ForecastMethod.REGRESSION) {
    // Simple linear regression
    const n = historicalData.length;
    const sumX = (n * (n + 1)) / 2;
    const sumY = historicalData.reduce((sum, val) => sum + val, 0);
    const sumXY = historicalData.reduce((sum, val, idx) => sum + val * (idx + 1), 0);
    const sumX2 = (n * (n + 1) * (2 * n + 1)) / 6;

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    parameters.slope = slope;
    parameters.intercept = intercept;

    for (let i = 1; i <= periods; i++) {
      const x = n + i;
      forecastValues.push(slope * x + intercept);
    }
  } else {
    // Default: use last value
    const lastValue = historicalData[historicalData.length - 1];
    forecastValues = Array(periods).fill(lastValue);
  }

  // Calculate forecast accuracy metrics (using last N actual values)
  const accuracy = calculateForecastAccuracy(
    historicalData.slice(-periods),
    forecastValues.slice(0, historicalData.slice(-periods).length)
  );

  // Generate confidence intervals (simplified)
  const confidenceIntervals = forecastValues.map(val => ({
    lower: val * 0.9,
    upper: val * 1.1,
  }));

  return {
    forecastId,
    productId,
    productName,
    method,
    historicalData,
    forecastPeriods: Array.from({ length: periods }, (_, i) => i + 1),
    forecastValues,
    confidenceIntervals,
    accuracy,
    parameters,
    generatedDate: new Date(),
  };
}

/**
 * Calculates forecast accuracy metrics.
 *
 * @param {number[]} actual - Actual values
 * @param {number[]} forecast - Forecast values
 * @returns {ForecastAccuracy} Accuracy metrics
 */
function calculateForecastAccuracy(actual: number[], forecast: number[]): ForecastAccuracy {
  const n = Math.min(actual.length, forecast.length);
  let sumAbsError = 0;
  let sumAbsPercentError = 0;
  let sumSquaredError = 0;
  let sumError = 0;

  for (let i = 0; i < n; i++) {
    const error = actual[i] - forecast[i];
    const absError = Math.abs(error);
    const percentError = actual[i] !== 0 ? Math.abs(error / actual[i]) : 0;

    sumError += error;
    sumAbsError += absError;
    sumAbsPercentError += percentError;
    sumSquaredError += error * error;
  }

  const mad = sumAbsError / n;
  const mape = (sumAbsPercentError / n) * 100;
  const mse = sumSquaredError / n;
  const rmse = Math.sqrt(mse);
  const bias = sumError / n;
  const trackingSignal = bias / (mad || 1);

  return {
    mape,
    mad,
    mse,
    rmse,
    trackingSignal,
    bias,
  };
}

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
export async function evaluateSupplierPerformance(
  supplierId: string,
  supplierName: string,
  metrics: SupplierMetric[]
): Promise<SupplierPerformance> {
  // Calculate weighted scores
  let overallScore = 0;
  const categoryScores: Record<string, { score: number; weight: number }> = {
    quality: { score: 0, weight: 0 },
    delivery: { score: 0, weight: 0 },
    cost: { score: 0, weight: 0 },
    responsiveness: { score: 0, weight: 0 },
    innovation: { score: 0, weight: 0 },
  };

  metrics.forEach(metric => {
    const metricScore = (metric.actual / metric.target) * 100;
    const weightedScore = metricScore * metric.weight;
    overallScore += weightedScore;

    const category = metric.category.toLowerCase();
    if (categoryScores[category]) {
      categoryScores[category].score += metricScore * metric.weight;
      categoryScores[category].weight += metric.weight;
    }
  });

  // Normalize category scores
  const qualityScore = categoryScores.quality.weight > 0
    ? categoryScores.quality.score / categoryScores.quality.weight
    : 0;
  const deliveryScore = categoryScores.delivery.weight > 0
    ? categoryScores.delivery.score / categoryScores.delivery.weight
    : 0;
  const costScore = categoryScores.cost.weight > 0
    ? categoryScores.cost.score / categoryScores.cost.weight
    : 0;
  const responsivenessScore = categoryScores.responsiveness.weight > 0
    ? categoryScores.responsiveness.score / categoryScores.responsiveness.weight
    : 0;
  const innovationScore = categoryScores.innovation.weight > 0
    ? categoryScores.innovation.score / categoryScores.innovation.weight
    : 0;

  // Categorize supplier
  let category: SupplierPerformanceCategory;
  if (overallScore >= 90) {
    category = SupplierPerformanceCategory.STRATEGIC;
  } else if (overallScore >= 80) {
    category = SupplierPerformanceCategory.PREFERRED;
  } else if (overallScore >= 70) {
    category = SupplierPerformanceCategory.APPROVED;
  } else if (overallScore >= 60) {
    category = SupplierPerformanceCategory.CONDITIONAL;
  } else if (overallScore >= 50) {
    category = SupplierPerformanceCategory.PROBATION;
  } else {
    category = SupplierPerformanceCategory.DISQUALIFIED;
  }

  const recommendations: string[] = [];
  if (qualityScore < 70) recommendations.push('Implement quality improvement plan');
  if (deliveryScore < 70) recommendations.push('Address delivery performance issues');
  if (costScore < 70) recommendations.push('Negotiate better pricing or seek alternatives');

  return {
    supplierId,
    supplierName,
    category,
    overallScore,
    qualityScore,
    deliveryScore,
    costScore,
    responsivenessScore,
    innovationScore,
    riskScore: 100 - overallScore,
    spend: 0, // To be provided
    defectRate: 0, // To be calculated from quality metrics
    onTimeDeliveryRate: deliveryScore,
    leadTimePerformance: deliveryScore,
    recommendations,
  };
}

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
export async function optimizeVehicleRouting(
  vehicles: Vehicle[],
  deliveryPoints: DeliveryPoint[],
  depotLocation: string
): Promise<VehicleRoutingProblem> {
  const problemId = `VRP-${Date.now()}`;

  // Simplified nearest neighbor heuristic
  const routes: RouteOptimization[] = [];
  const unservedPoints: string[] = [];
  let totalDistance = 0;
  let totalCost = 0;
  let totalTime = 0;

  const remainingPoints = [...deliveryPoints];
  const sortedVehicles = [...vehicles].sort((a, b) => b.capacity - a.capacity);

  sortedVehicles.forEach(vehicle => {
    if (remainingPoints.length === 0) return;

    const route: RouteOptimization = {
      routeId: `ROUTE-${vehicle.vehicleId}-${Date.now()}`,
      origin: depotLocation,
      destination: depotLocation,
      waypoints: [],
      totalDistance: 0,
      totalTime: 0,
      totalCost: vehicle.fixedCost,
      transportMode: TransportMode.TRUCK,
      sequence: [],
      vehicleUtilization: 0,
      constraints: [],
    };

    let currentCapacity = 0;
    let currentLocation = depotLocation;
    const visited: number[] = [];

    while (remainingPoints.length > 0 && currentCapacity < vehicle.capacity) {
      // Find nearest unvisited point
      let nearestIdx = -1;
      let nearestDistance = Infinity;

      remainingPoints.forEach((point, idx) => {
        if (currentCapacity + point.demand <= vehicle.capacity) {
          // Simplified distance calculation (would use actual distance matrix)
          const distance = Math.random() * 50; // Placeholder
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestIdx = idx;
          }
        }
      });

      if (nearestIdx === -1) break;

      const point = remainingPoints[nearestIdx];
      route.waypoints.push(point.pointId);
      route.totalDistance += nearestDistance;
      route.totalTime += nearestDistance / 60 + point.serviceTime; // Assume 60 km/h
      currentCapacity += point.demand;
      visited.push(nearestIdx);

      remainingPoints.splice(nearestIdx, 1);
    }

    // Return to depot
    route.totalDistance += Math.random() * 30; // Distance back to depot
    route.totalCost += route.totalDistance * vehicle.costPerKm;
    route.vehicleUtilization = (currentCapacity / vehicle.capacity) * 100;

    routes.push(route);
    totalDistance += route.totalDistance;
    totalCost += route.totalCost;
    totalTime += route.totalTime;
  });

  // Any remaining points are unserved
  remainingPoints.forEach(point => unservedPoints.push(point.pointId));

  const utilizationRate = routes.length > 0
    ? routes.reduce((sum, r) => sum + r.vehicleUtilization, 0) / routes.length
    : 0;

  return {
    problemId,
    vehicles,
    deliveryPoints,
    routes,
    totalDistance,
    totalCost,
    totalTime,
    utilizationRate,
    unservedPoints,
  };
}

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
export async function analyzeBullwhipEffect(
  stages: string[],
  demandData: number[][]
): Promise<BullwhipAnalysis> {
  const analysisId = `BULL-${Date.now()}`;

  const demandVariability: number[] = [];
  const orderVariability: number[] = [];

  // Calculate variability (coefficient of variation) for each stage
  demandData.forEach(stageData => {
    const mean = stageData.reduce((sum, val) => sum + val, 0) / stageData.length;
    const variance = stageData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / stageData.length;
    const stdDev = Math.sqrt(variance);
    const cv = mean !== 0 ? stdDev / mean : 0;

    demandVariability.push(cv);
    orderVariability.push(cv); // Simplified
  });

  // Calculate amplification ratio (upstream variability / downstream variability)
  const retailVariability = demandVariability[0] || 1;
  const supplierVariability = demandVariability[demandVariability.length - 1] || retailVariability;
  const amplificationRatio = supplierVariability / retailVariability;

  // Identify causes
  const causes: BullwhipCause[] = [
    {
      cause: 'Demand signal processing',
      severity: RiskSeverity.MEDIUM,
      contribution: 0.25,
      mitigation: 'Share POS data across supply chain',
    },
    {
      cause: 'Order batching',
      severity: RiskSeverity.MEDIUM,
      contribution: 0.30,
      mitigation: 'Implement continuous replenishment',
    },
    {
      cause: 'Price fluctuations',
      severity: RiskSeverity.LOW,
      contribution: 0.20,
      mitigation: 'Stabilize pricing and eliminate trade promotions',
    },
    {
      cause: 'Rationing and shortage gaming',
      severity: RiskSeverity.MEDIUM,
      contribution: 0.25,
      mitigation: 'Base allocation on past sales, not orders',
    },
  ];

  const recommendations = [
    'Implement demand information sharing across all stages',
    'Reduce lead times through process improvements',
    'Adopt everyday low pricing (EDLP) strategy',
    'Use VMI (Vendor Managed Inventory) programs',
    'Implement collaborative planning, forecasting, and replenishment (CPFR)',
  ];

  // Estimate impact (cost of excess inventory and stockouts)
  const estimatedImpact = amplificationRatio * 1000000; // Simplified

  return {
    analysisId,
    supplyChainStages: stages,
    demandVariability,
    orderVariability,
    amplificationRatio,
    causes,
    recommendations,
    estimatedImpact,
  };
}

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
export async function assessSupplyChainResilience(
  networkId: string,
  dimensionScores: Record<ResilienceDimension, number>
): Promise<SupplyChainResilience> {
  const assessmentId = `RES-${networkId}-${Date.now()}`;

  const dimensions: ResilienceDimensionScore[] = Object.entries(dimensionScores).map(([dim, score]) => {
    let maturityLevel: 'nascent' | 'developing' | 'defined' | 'advanced' | 'optimized';
    if (score >= 80) maturityLevel = 'optimized';
    else if (score >= 65) maturityLevel = 'advanced';
    else if (score >= 50) maturityLevel = 'defined';
    else if (score >= 35) maturityLevel = 'developing';
    else maturityLevel = 'nascent';

    const gaps: string[] = [];
    const initiatives: string[] = [];

    if (score < 65) {
      gaps.push(`${dim} capability needs improvement`);
      initiatives.push(`Develop ${dim} enhancement program`);
    }

    return {
      dimension: dim as ResilienceDimension,
      score,
      maturityLevel,
      gaps,
      initiatives,
    };
  });

  const overallScore = Object.values(dimensionScores).reduce((sum, score) => sum + score, 0) / Object.keys(dimensionScores).length;

  const vulnerabilities: Vulnerability[] = [
    {
      vulnerabilityId: 'VUL-001',
      type: 'Single source dependency',
      description: 'Critical components sourced from single supplier',
      severity: RiskSeverity.HIGH,
      likelihood: 0.3,
      impact: 8,
      riskScore: 0.3 * 8,
      affectedNodes: [],
      mitigation: 'Develop alternate suppliers',
      cost: 500000,
    },
  ];

  const mitigationStrategies = [
    'Build supplier redundancy for critical components',
    'Increase safety stock for high-risk items',
    'Implement real-time supply chain visibility',
    'Develop business continuity plans',
    'Diversify geographic sourcing',
  ];

  return {
    assessmentId,
    networkId,
    overallScore,
    dimensions,
    vulnerabilities,
    mitigationStrategies,
    investmentRequired: 2000000,
    expectedBenefit: 5000000,
  };
}

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
export async function optimizeWarehouse(
  warehouseId: string,
  warehouseName: string,
  totalArea: number,
  zones: WarehouseZone[]
): Promise<WarehouseOptimization> {
  const usableArea = totalArea * 0.85; // 85% usable (accounting for aisles, etc.)

  const totalZoneArea = zones.reduce((sum, zone) => sum + zone.area, 0);
  const utilizationRate = (totalZoneArea / usableArea) * 100;

  // Calculate throughput (simplified)
  const throughput = zones.reduce((sum, zone) => sum + zone.capacity * 0.7, 0); // 70% turnover

  // Labor productivity (units per labor hour)
  const laborProductivity = throughput / (totalArea / 100); // Simplified

  const recommendations: string[] = [];

  if (utilizationRate < 75) {
    recommendations.push('Increase storage density through better racking');
  }
  if (utilizationRate > 95) {
    recommendations.push('Consider warehouse expansion or offsite storage');
  }

  // ABC analysis for zone placement
  const highFrequencyZones = zones.filter(z => z.accessFrequency >= 7);
  if (highFrequencyZones.length > 0) {
    recommendations.push('Place high-frequency items closer to shipping dock');
  }

  recommendations.push('Implement warehouse management system (WMS) for optimization');
  recommendations.push('Use slotting optimization to minimize travel distance');

  return {
    warehouseId,
    warehouseName,
    totalArea,
    usableArea,
    utilizationRate,
    layoutStrategy: WarehouseLayoutStrategy.CLASS_BASED,
    zones,
    pickingStrategy: 'ABC',
    throughput,
    laborProductivity,
    recommendations,
  };
}

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
export async function performABCAnalysis(
  products: Array<{ productId: string; productName: string; annualUsage: number; unitCost: number }>
): Promise<ABCAnalysis> {
  const analysisId = `ABC-${Date.now()}`;

  // Calculate annual value for each product
  const productsWithValue = products.map(p => ({
    ...p,
    annualValue: p.annualUsage * p.unitCost,
  }));

  // Sort by annual value (descending)
  productsWithValue.sort((a, b) => b.annualValue - a.annualValue);

  // Calculate total value
  const totalValue = productsWithValue.reduce((sum, p) => sum + p.annualValue, 0);

  // Calculate cumulative percentage and classify
  let cumulativeValue = 0;
  const classifiedProducts: ABCClassification[] = productsWithValue.map(p => {
    cumulativeValue += p.annualValue;
    const cumulativePercentage = (cumulativeValue / totalValue) * 100;

    let classification: 'A' | 'B' | 'C';
    if (cumulativePercentage <= 80) {
      classification = 'A';
    } else if (cumulativePercentage <= 95) {
      classification = 'B';
    } else {
      classification = 'C';
    }

    return {
      productId: p.productId,
      productName: p.productName,
      annualUsage: p.annualUsage,
      unitCost: p.unitCost,
      annualValue: p.annualValue,
      cumulativePercentage,
      classification,
    };
  });

  const recommendations: Record<string, string[]> = {
    A: [
      'Tight inventory control with frequent reviews',
      'Accurate demand forecasting',
      'Close supplier relationships',
      'Consider consignment or VMI',
    ],
    B: [
      'Moderate inventory control',
      'Periodic review (monthly or quarterly)',
      'Standard ordering procedures',
    ],
    C: [
      'Simple controls',
      'Large order quantities to minimize ordering frequency',
      'Annual review',
      'Consider eliminating slow-moving SKUs',
    ],
  };

  return {
    analysisId,
    products: classifiedProducts,
    classAThreshold: 80,
    classBThreshold: 95,
    classCThreshold: 100,
    totalValue,
    recommendations,
  };
}

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
export async function calculateTotalCostOfOwnership(
  productOrService: string,
  acquisitionCost: number,
  operatingCosts: number[],
  maintenanceCosts: number[],
  disposalCost: number
): Promise<TotalCostOfOwnership> {
  const tcoId = `TCO-${Date.now()}`;
  const timeHorizon = operatingCosts.length;

  const totalOperating = operatingCosts.reduce((sum, cost) => sum + cost, 0);
  const totalMaintenance = maintenanceCosts.reduce((sum, cost) => sum + cost, 0);
  const totalCost = acquisitionCost + totalOperating + totalMaintenance + disposalCost;
  const annualizedCost = totalCost / timeHorizon;

  const costBreakdown: Record<string, number> = {
    acquisition: acquisitionCost,
    operating: totalOperating,
    maintenance: totalMaintenance,
    disposal: disposalCost,
  };

  return {
    tcoId,
    productOrService,
    timeHorizon,
    acquisitionCost,
    operatingCosts,
    maintenanceCosts,
    disposalCost,
    totalCost,
    annualizedCost,
    costBreakdown,
  };
}

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
export async function optimizeSupplyChainNetwork(
  networkName: string,
  nodes: NetworkNode[],
  links: NetworkLink[],
  objective: 'minimize_cost' | 'maximize_service' | 'balanced'
): Promise<NetworkOptimization> {
  const optimizationId = `OPT-${Date.now()}`;

  // Calculate total costs
  const totalFixedCost = nodes.reduce((sum, node) => sum + node.fixedCost, 0);
  const totalVariableCost = links.reduce((sum, link) => sum + link.costPerUnit * link.currentFlow, 0);
  const totalCost = totalFixedCost + totalVariableCost;

  // Calculate total capacity
  const totalCapacity = nodes.reduce((sum, node) => sum + node.capacity, 0);
  const totalThroughput = nodes.reduce((sum, node) => sum + node.throughput, 0);
  const utilizationRate = (totalThroughput / totalCapacity) * 100;

  // Calculate service level (based on link reliability)
  const avgReliability = links.reduce((sum, link) => sum + link.reliability, 0) / links.length;
  const serviceLevel = avgReliability * 100;

  const recommendations: string[] = [];

  if (utilizationRate < 60) {
    recommendations.push('Consider closing underutilized facilities');
  }
  if (utilizationRate > 90) {
    recommendations.push('Expand capacity at bottleneck locations');
  }
  if (serviceLevel < 95) {
    recommendations.push('Improve transportation reliability');
  }

  // Identify high-cost links
  const highCostLinks = links.filter(link => link.costPerUnit > 5);
  if (highCostLinks.length > 0) {
    recommendations.push('Negotiate better rates or find alternative routes for high-cost lanes');
  }

  return {
    optimizationId,
    networkName,
    nodes,
    links,
    totalCost,
    totalCapacity,
    utilizationRate,
    serviceLevel,
    optimizationObjective: objective,
    constraints: [],
    recommendations,
  };
}

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
export async function calculateShipmentConsolidation(
  shipments: Array<{ shipmentId: string; weight: number; volume: number; destination: string; deadline: Date }>,
  truckCapacity: number
): Promise<Array<{ consolidationId: string; shipments: string[]; totalWeight: number; savings: number; destination: string }>> {
  const consolidations: Array<{ consolidationId: string; shipments: string[]; totalWeight: number; savings: number; destination: string }> = [];

  // Group by destination
  const byDestination: Record<string, typeof shipments> = {};
  shipments.forEach(shipment => {
    if (!byDestination[shipment.destination]) {
      byDestination[shipment.destination] = [];
    }
    byDestination[shipment.destination].push(shipment);
  });

  // Consolidate shipments for each destination
  Object.entries(byDestination).forEach(([destination, destShipments]) => {
    let currentLoad: typeof shipments = [];
    let currentWeight = 0;

    destShipments.forEach(shipment => {
      if (currentWeight + shipment.weight <= truckCapacity) {
        currentLoad.push(shipment);
        currentWeight += shipment.weight;
      } else {
        // Create consolidation
        if (currentLoad.length > 1) {
          const savings = currentLoad.length * 50 - 100; // Simplified savings calculation
          consolidations.push({
            consolidationId: `CONS-${Date.now()}-${consolidations.length}`,
            shipments: currentLoad.map(s => s.shipmentId),
            totalWeight: currentWeight,
            savings,
            destination,
          });
        }
        currentLoad = [shipment];
        currentWeight = shipment.weight;
      }
    });

    // Final consolidation
    if (currentLoad.length > 1) {
      const savings = currentLoad.length * 50 - 100;
      consolidations.push({
        consolidationId: `CONS-${Date.now()}-${consolidations.length}`,
        shipments: currentLoad.map(s => s.shipmentId),
        totalWeight: currentWeight,
        savings,
        destination,
      });
    }
  });

  return consolidations;
}

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
export async function optimizeLoad(
  vehicleCapacity: number,
  volumeCapacity: number,
  items: LoadItem[]
): Promise<LoadOptimization> {
  const loadId = `LOAD-${Date.now()}`;

  // Sort items by priority (descending) and then by weight (descending)
  const sortedItems = [...items].sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return b.weight - a.weight;
  });

  let totalWeight = 0;
  let totalVolume = 0;
  const loadingSequence: number[] = [];

  sortedItems.forEach((item, idx) => {
    const itemTotalWeight = item.weight * item.quantity;
    const itemTotalVolume = item.volume * item.quantity;

    if (totalWeight + itemTotalWeight <= vehicleCapacity &&
        totalVolume + itemTotalVolume <= volumeCapacity) {
      totalWeight += itemTotalWeight;
      totalVolume += itemTotalVolume;
      loadingSequence.push(idx);
    }
  });

  const weightUtilization = (totalWeight / vehicleCapacity) * 100;
  const volumeUtilization = (totalVolume / volumeCapacity) * 100;
  const unusedSpace = vehicleCapacity - totalWeight;

  return {
    loadId,
    vehicleCapacity,
    items: sortedItems,
    totalWeight,
    totalVolume,
    weightUtilization,
    volumeUtilization,
    loadingSequence,
    unusedSpace,
  };
}

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
export async function calculateCarbonFootprint(
  shipments: Array<{ mode: TransportMode; distance: number; weight: number }>
): Promise<{ totalEmissions: number; emissionsByMode: Record<TransportMode, number>; recommendations: string[] }> {
  // Emission factors (kg CO2 per ton-km)
  const emissionFactors: Record<TransportMode, number> = {
    [TransportMode.AIR]: 0.602,
    [TransportMode.OCEAN]: 0.016,
    [TransportMode.RAIL]: 0.028,
    [TransportMode.TRUCK]: 0.062,
    [TransportMode.INTERMODAL]: 0.040,
    [TransportMode.PARCEL]: 0.100,
    [TransportMode.COURIER]: 0.120,
  };

  const emissionsByMode: Record<TransportMode, number> = {} as any;
  let totalEmissions = 0;

  shipments.forEach(shipment => {
    const weightInTons = shipment.weight / 1000;
    const emissions = weightInTons * shipment.distance * emissionFactors[shipment.mode];

    if (!emissionsByMode[shipment.mode]) {
      emissionsByMode[shipment.mode] = 0;
    }
    emissionsByMode[shipment.mode] += emissions;
    totalEmissions += emissions;
  });

  const recommendations: string[] = [];
  if (emissionsByMode[TransportMode.AIR] > totalEmissions * 0.3) {
    recommendations.push('Reduce air freight usage, shift to ocean or rail where possible');
  }
  if (emissionsByMode[TransportMode.TRUCK] > totalEmissions * 0.5) {
    recommendations.push('Consolidate shipments to reduce truck miles');
    recommendations.push('Consider intermodal transportation');
  }
  recommendations.push('Implement carbon offset programs');
  recommendations.push('Optimize route planning to minimize distance');

  return {
    totalEmissions,
    emissionsByMode,
    recommendations,
  };
}

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
export async function assessSupplierRisk(
  supplierId: string,
  supplierName: string,
  riskFactors: Record<string, number>
): Promise<{ supplierId: string; supplierName: string; overallRisk: RiskSeverity; riskScore: number; mitigationActions: string[]; riskBreakdown: Record<string, number> }> {
  const riskScore = Object.values(riskFactors).reduce((sum, score) => sum + score, 0) / Object.keys(riskFactors).length;

  let overallRisk: RiskSeverity;
  if (riskScore >= 8) {
    overallRisk = RiskSeverity.CRITICAL;
  } else if (riskScore >= 6) {
    overallRisk = RiskSeverity.HIGH;
  } else if (riskScore >= 4) {
    overallRisk = RiskSeverity.MEDIUM;
  } else if (riskScore >= 2) {
    overallRisk = RiskSeverity.LOW;
  } else {
    overallRisk = RiskSeverity.NEGLIGIBLE;
  }

  const mitigationActions: string[] = [];

  if (riskFactors.financial && riskFactors.financial >= 6) {
    mitigationActions.push('Conduct detailed financial due diligence');
    mitigationActions.push('Require financial guarantees or bonds');
  }
  if (riskFactors.geographic && riskFactors.geographic >= 6) {
    mitigationActions.push('Develop alternate suppliers in different regions');
    mitigationActions.push('Increase safety stock for this supplier');
  }
  if (riskFactors.operational && riskFactors.operational >= 6) {
    mitigationActions.push('Implement supplier development program');
    mitigationActions.push('Increase monitoring and audits');
  }
  if (riskFactors.compliance && riskFactors.compliance >= 6) {
    mitigationActions.push('Require compliance certifications');
    mitigationActions.push('Conduct regular compliance audits');
  }

  if (overallRisk === RiskSeverity.CRITICAL || overallRisk === RiskSeverity.HIGH) {
    mitigationActions.push('Develop exit strategy and backup suppliers');
  }

  return {
    supplierId,
    supplierName,
    overallRisk,
    riskScore,
    mitigationActions,
    riskBreakdown: riskFactors,
  };
}

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
export async function calculateInventoryDays(
  inventoryValue: number,
  annualCostOfGoodsSold: number
): Promise<{ daysOfInventory: number; turnoverRate: number; recommendation: string }> {
  const turnoverRate = annualCostOfGoodsSold / inventoryValue;
  const daysOfInventory = 365 / turnoverRate;

  let recommendation = '';
  if (daysOfInventory > 90) {
    recommendation = 'High inventory levels - consider reducing stock or improving turnover';
  } else if (daysOfInventory > 60) {
    recommendation = 'Moderate inventory levels - monitor for optimization opportunities';
  } else if (daysOfInventory > 30) {
    recommendation = 'Healthy inventory levels - maintain current practices';
  } else {
    recommendation = 'Low inventory levels - assess stockout risk';
  }

  return {
    daysOfInventory,
    turnoverRate,
    recommendation,
  };
}

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
export async function trackSLACompliance(
  partnerId: string,
  partnerName: string,
  serviceType: string,
  metrics: SLAMetric[]
): Promise<ServiceLevelAgreement> {
  const slaId = `SLA-${partnerId}-${Date.now()}`;

  let totalWeight = 0;
  let weightedCompliance = 0;
  let totalPenalties = 0;

  metrics.forEach(metric => {
    const compliance = metric.actual >= metric.target;
    metric.isCompliant = compliance;

    totalWeight += metric.weight;
    if (compliance) {
      weightedCompliance += metric.weight;
    } else {
      totalPenalties += metric.penalty;
    }
  });

  const complianceRate = totalWeight > 0 ? (weightedCompliance / totalWeight) * 100 : 0;

  let status: 'compliant' | 'at_risk' | 'breach';
  if (complianceRate >= 95) {
    status = 'compliant';
  } else if (complianceRate >= 85) {
    status = 'at_risk';
  } else {
    status = 'breach';
  }

  return {
    slaId,
    partnerId,
    partnerName,
    serviceType,
    metrics,
    complianceRate,
    penaltiesIncurred: totalPenalties,
    status,
  };
}

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
export async function calculateOptimalBatchSize(
  setupCost: number,
  annualDemand: number,
  holdingCostRate: number,
  unitCost: number,
  productionRate: number,
  demandRate: number
): Promise<{ optimalBatchSize: number; numberOfBatches: number; totalCost: number; cycleTime: number }> {
  const H = holdingCostRate * unitCost;

  // EPQ formula (Economic Production Quantity)
  // EPQ = sqrt((2 * D * S) / (H * (1 - d/p)))
  // where d = demand rate, p = production rate
  const utilizationFactor = 1 - (demandRate / productionRate);
  const epq = Math.sqrt((2 * annualDemand * setupCost) / (H * utilizationFactor));

  const numberOfBatches = annualDemand / epq;
  const cycleTime = 365 / numberOfBatches;

  const setupCostTotal = numberOfBatches * setupCost;
  const holdingCostTotal = (epq / 2) * utilizationFactor * H;
  const totalCost = setupCostTotal + holdingCostTotal;

  return {
    optimalBatchSize: Math.round(epq),
    numberOfBatches,
    totalCost,
    cycleTime,
  };
}

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
export async function analyzeCashToCashCycle(
  daysInventoryOutstanding: number,
  daysSalesOutstanding: number,
  daysPayableOutstanding: number
): Promise<{ cashToCashCycle: number; recommendation: string; benchmark: number; breakdown: Record<string, number> }> {
  const cashToCashCycle = daysInventoryOutstanding + daysSalesOutstanding - daysPayableOutstanding;

  const benchmark = 40; // Industry benchmark (varies by industry)

  let recommendation = '';
  if (cashToCashCycle > benchmark + 20) {
    recommendation = 'Critical: Significantly exceeds benchmark. Focus on reducing inventory and improving collections.';
  } else if (cashToCashCycle > benchmark) {
    recommendation = 'Opportunity to improve working capital efficiency. Consider inventory reduction and faster collections.';
  } else if (cashToCashCycle < benchmark - 20) {
    recommendation = 'Excellent working capital management. Ensure not compromising customer or supplier relationships.';
  } else {
    recommendation = 'Healthy cash-to-cash cycle. Continue monitoring and look for incremental improvements.';
  }

  return {
    cashToCashCycle,
    recommendation,
    benchmark,
    breakdown: {
      daysInventoryOutstanding,
      daysSalesOutstanding,
      daysPayableOutstanding,
    },
  };
}

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
export async function performMakeVsBuyAnalysis(
  componentName: string,
  annualVolume: number,
  makeCostPerUnit: number,
  makeFixedCost: number,
  buyCostPerUnit: number,
  buyFixedCost: number = 0
): Promise<{ componentName: string; recommendation: 'make' | 'buy'; makeTotalCost: number; buyTotalCost: number; savings: number; breakEvenVolume: number }> {
  const makeTotalCost = makeFixedCost + (makeCostPerUnit * annualVolume);
  const buyTotalCost = buyFixedCost + (buyCostPerUnit * annualVolume);

  const recommendation: 'make' | 'buy' = makeTotalCost < buyTotalCost ? 'make' : 'buy';
  const savings = Math.abs(makeTotalCost - buyTotalCost);

  // Calculate break-even volume
  const breakEvenVolume = (makeFixedCost - buyFixedCost) / (buyCostPerUnit - makeCostPerUnit);

  return {
    componentName,
    recommendation,
    makeTotalCost,
    buyTotalCost,
    savings,
    breakEvenVolume: Math.max(0, breakEvenVolume),
  };
}

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
export async function calculateCostToServe(
  segments: Array<{ segment: string; revenue: number; costs: Record<string, number> }>
): Promise<Array<{ segment: string; revenue: number; totalCost: number; costToServe: number; margin: number; profitability: 'high' | 'medium' | 'low' }>> {
  return segments.map(seg => {
    const totalCost = Object.values(seg.costs).reduce((sum, cost) => sum + cost, 0);
    const costToServe = (totalCost / seg.revenue) * 100;
    const margin = ((seg.revenue - totalCost) / seg.revenue) * 100;

    let profitability: 'high' | 'medium' | 'low';
    if (margin >= 20) {
      profitability = 'high';
    } else if (margin >= 10) {
      profitability = 'medium';
    } else {
      profitability = 'low';
    }

    return {
      segment: seg.segment,
      revenue: seg.revenue,
      totalCost,
      costToServe,
      margin,
      profitability,
    };
  });
}

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
export async function analyzePostponementStrategy(
  productFamily: string,
  forecastAccuracy: number,
  customizationCost: number,
  inventoryCarryingCost: number,
  demandVariability: number
): Promise<{ productFamily: string; recommendation: string; expectedSavings: number; riskLevel: RiskSeverity; postponementType: string }> {
  let recommendation = '';
  let postponementType = '';
  let expectedSavings = 0;
  let riskLevel: RiskSeverity = RiskSeverity.MEDIUM;

  if (forecastAccuracy < 70 && demandVariability > 30) {
    recommendation = 'Implement postponement strategy - delay final assembly/configuration until customer order';
    postponementType = 'Manufacturing postponement';
    expectedSavings = inventoryCarryingCost * 10000 * 0.3; // 30% reduction in safety stock
    riskLevel = RiskSeverity.LOW;
  } else if (forecastAccuracy < 80) {
    recommendation = 'Consider partial postponement - modular design for late customization';
    postponementType = 'Form postponement';
    expectedSavings = inventoryCarryingCost * 10000 * 0.15;
    riskLevel = RiskSeverity.LOW;
  } else if (customizationCost > inventoryCarryingCost * 2) {
    recommendation = 'Postponement may not be cost-effective - high customization costs';
    postponementType = 'Not recommended';
    expectedSavings = 0;
    riskLevel = RiskSeverity.MEDIUM;
  } else {
    recommendation = 'Good forecast accuracy - traditional make-to-stock may be optimal';
    postponementType = 'Not needed';
    expectedSavings = 0;
    riskLevel = RiskSeverity.LOW;
  }

  return {
    productFamily,
    recommendation,
    expectedSavings,
    riskLevel,
    postponementType,
  };
}
