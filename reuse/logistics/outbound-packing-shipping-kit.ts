/**
 * LOC: LOG-PKG-SHIP-001
 * File: /reuse/logistics/outbound-packing-shipping-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Warehouse controllers
 *   - Shipping services
 *   - Carrier integration modules
 *   - Label printing services
 */

/**
 * File: /reuse/logistics/outbound-packing-shipping-kit.ts
 * Locator: WC-LOGISTICS-PKG-SHIP-001
 * Purpose: Comprehensive Packing and Shipping Operations - Complete outbound logistics lifecycle
 *
 * Upstream: Independent utility module for logistics packing and shipping operations
 * Downstream: ../backend/logistics/*, Warehouse modules, Carrier integrations, Label services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 42 utility functions for packing stations, cartonization, labels, carriers, tracking
 *
 * LLM Context: Enterprise-grade packing and shipping utilities for warehouse operations to compete with JD Edwards.
 * Provides comprehensive packing station management, intelligent cartonization algorithms, multi-carrier label
 * generation, carrier API integration, real-time shipment tracking, rate shopping, manifest generation,
 * dimensional weight calculations, hazmat compliance, and international shipping documentation.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Packing station status enumeration
 */
export enum PackingStationStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
  OFFLINE = 'OFFLINE',
}

/**
 * Shipment status enumeration
 */
export enum ShipmentStatus {
  PENDING = 'PENDING',
  PICKING = 'PICKING',
  PICKED = 'PICKED',
  PACKING = 'PACKING',
  PACKED = 'PACKED',
  LABELED = 'LABELED',
  MANIFESTED = 'MANIFESTED',
  SHIPPED = 'SHIPPED',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  EXCEPTION = 'EXCEPTION',
  RETURNED = 'RETURNED',
  CANCELLED = 'CANCELLED',
}

/**
 * Carrier enumeration
 */
export enum Carrier {
  UPS = 'UPS',
  FEDEX = 'FEDEX',
  USPS = 'USPS',
  DHL = 'DHL',
  ONTRAC = 'ONTRAC',
  LASERSHIP = 'LASERSHIP',
  CUSTOM = 'CUSTOM',
}

/**
 * Service level enumeration
 */
export enum ServiceLevel {
  GROUND = 'GROUND',
  TWO_DAY = 'TWO_DAY',
  OVERNIGHT = 'OVERNIGHT',
  SAME_DAY = 'SAME_DAY',
  INTERNATIONAL_STANDARD = 'INTERNATIONAL_STANDARD',
  INTERNATIONAL_EXPRESS = 'INTERNATIONAL_EXPRESS',
  FREIGHT = 'FREIGHT',
}

/**
 * Package type enumeration
 */
export enum PackageType {
  ENVELOPE = 'ENVELOPE',
  PAK = 'PAK',
  BOX = 'BOX',
  TUBE = 'TUBE',
  PALLET = 'PALLET',
  CUSTOM = 'CUSTOM',
}

/**
 * Label format enumeration
 */
export enum LabelFormat {
  PNG = 'PNG',
  PDF = 'PDF',
  ZPL = 'ZPL',
  EPL = 'EPL',
  THERMAL = 'THERMAL',
}

/**
 * Packing station configuration
 */
export interface PackingStation {
  stationId: string;
  warehouseId: string;
  name: string;
  status: PackingStationStatus;
  assignedUser?: string;
  zone?: string;
  capabilities: string[];
  equipment: StationEquipment[];
  currentOrder?: string;
  lastActivity?: Date;
  metrics: StationMetrics;
}

/**
 * Station equipment
 */
export interface StationEquipment {
  equipmentId: string;
  type: 'SCALE' | 'PRINTER' | 'SCANNER' | 'TAPE_DISPENSER' | 'VOID_FILL';
  model?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR';
}

/**
 * Station metrics
 */
export interface StationMetrics {
  packagesProcessed: number;
  averagePackTime: number;
  errorRate: number;
  utilizationRate: number;
}

/**
 * Dimensional measurements
 */
export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: 'in' | 'cm';
}

/**
 * Weight measurement
 */
export interface Weight {
  value: number;
  unit: 'lb' | 'kg' | 'oz' | 'g';
}

/**
 * Container/carton definition
 */
export interface Container {
  containerId: string;
  containerType: string;
  name: string;
  dimensions: Dimensions;
  maxWeight: Weight;
  tareWeight: Weight;
  volume: number;
  cost: number;
  stackable: boolean;
  crushResistance?: number;
}

/**
 * Item to be packed
 */
export interface PackableItem {
  itemId: string;
  sku: string;
  name: string;
  quantity: number;
  dimensions: Dimensions;
  weight: Weight;
  fragile: boolean;
  hazmat: boolean;
  stackable: boolean;
  requiresColdChain?: boolean;
  value: number;
}

/**
 * Cartonization result
 */
export interface CartonizationResult {
  packages: Package[];
  totalContainers: number;
  totalWeight: Weight;
  totalVolume: number;
  efficiency: number;
  estimatedCost: number;
  warnings: string[];
}

/**
 * Package/parcel
 */
export interface Package {
  packageId: string;
  container: Container;
  items: PackableItem[];
  weight: Weight;
  dimensions: Dimensions;
  trackingNumber?: string;
  labelUrl?: string;
  sequence: number;
  specialHandling?: string[];
}

/**
 * Address information
 */
export interface Address {
  name: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  email?: string;
  residential: boolean;
}

/**
 * Shipping label
 */
export interface ShippingLabel {
  labelId: string;
  trackingNumber: string;
  carrier: Carrier;
  serviceLevel: ServiceLevel;
  labelFormat: LabelFormat;
  labelData: string;
  labelUrl?: string;
  cost: number;
  createdAt: Date;
  expiresAt?: Date;
}

/**
 * Shipment
 */
export interface Shipment {
  shipmentId: string;
  orderId: string;
  warehouseId: string;
  status: ShipmentStatus;
  shipFrom: Address;
  shipTo: Address;
  packages: Package[];
  carrier: Carrier;
  serviceLevel: ServiceLevel;
  shippingCost: number;
  insuranceAmount?: number;
  signatureRequired: boolean;
  saturdayDelivery: boolean;
  labels: ShippingLabel[];
  trackingNumbers: string[];
  manifestId?: string;
  shipDate?: Date;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  metadata?: Record<string, any>;
}

/**
 * Carrier rate quote
 */
export interface RateQuote {
  quoteId: string;
  carrier: Carrier;
  serviceLevel: ServiceLevel;
  cost: number;
  deliveryDays: number;
  estimatedDeliveryDate: Date;
  currency: string;
  guaranteedDelivery: boolean;
  includesInsurance: boolean;
  metadata?: Record<string, any>;
}

/**
 * Carrier API credentials
 */
export interface CarrierCredentials {
  carrier: Carrier;
  accountNumber: string;
  apiKey: string;
  apiSecret?: string;
  meterNumber?: string;
  testMode: boolean;
}

/**
 * Tracking event
 */
export interface TrackingEvent {
  eventId: string;
  timestamp: Date;
  status: string;
  statusCode: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  description: string;
  signedBy?: string;
  exceptionCode?: string;
}

/**
 * Tracking information
 */
export interface TrackingInfo {
  trackingNumber: string;
  carrier: Carrier;
  status: ShipmentStatus;
  events: TrackingEvent[];
  currentLocation?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  signedBy?: string;
  lastUpdated: Date;
}

/**
 * Manifest document
 */
export interface Manifest {
  manifestId: string;
  carrier: Carrier;
  warehouseId: string;
  shipDate: Date;
  shipments: string[];
  packageCount: number;
  totalWeight: Weight;
  manifestDocument?: string;
  manifestUrl?: string;
  closedAt?: Date;
  submittedAt?: Date;
}

/**
 * Hazmat classification
 */
export interface HazmatInfo {
  unNumber: string;
  properShippingName: string;
  hazardClass: string;
  packingGroup: string;
  quantity: number;
  unit: string;
}

/**
 * Customs declaration
 */
export interface CustomsDeclaration {
  declarationId: string;
  items: CustomsItem[];
  totalValue: number;
  currency: string;
  reason: 'GIFT' | 'SALE' | 'SAMPLE' | 'RETURN' | 'REPAIR';
  termsOfSale: string;
  certificateNumber?: string;
}

/**
 * Customs item
 */
export interface CustomsItem {
  description: string;
  quantity: number;
  value: number;
  weight: Weight;
  countryOfOrigin: string;
  hsCode?: string;
}

// ============================================================================
// SECTION 1: PACKING STATION MANAGEMENT (Functions 1-8)
// ============================================================================

/**
 * 1. Creates a new packing station.
 *
 * @param {Partial<PackingStation>} config - Station configuration
 * @returns {PackingStation} New packing station
 *
 * @example
 * ```typescript
 * const station = createPackingStation({
 *   warehouseId: 'WH-001',
 *   name: 'Station A1',
 *   zone: 'Zone A',
 *   capabilities: ['STANDARD', 'FRAGILE', 'HAZMAT']
 * });
 * ```
 */
export function createPackingStation(config: Partial<PackingStation>): PackingStation {
  const stationId = `STATION-${crypto.randomUUID()}`;

  return {
    stationId,
    warehouseId: config.warehouseId || '',
    name: config.name || '',
    status: PackingStationStatus.AVAILABLE,
    zone: config.zone,
    capabilities: config.capabilities || ['STANDARD'],
    equipment: config.equipment || [],
    metrics: {
      packagesProcessed: 0,
      averagePackTime: 0,
      errorRate: 0,
      utilizationRate: 0,
    },
  };
}

/**
 * 2. Assigns user to packing station.
 *
 * @param {PackingStation} station - Packing station
 * @param {string} userId - User ID to assign
 * @returns {PackingStation} Updated station
 *
 * @example
 * ```typescript
 * const updated = assignUserToStation(station, 'USER-123');
 * ```
 */
export function assignUserToStation(station: PackingStation, userId: string): PackingStation {
  return {
    ...station,
    status: PackingStationStatus.OCCUPIED,
    assignedUser: userId,
    lastActivity: new Date(),
  };
}

/**
 * 3. Releases user from packing station.
 *
 * @param {PackingStation} station - Packing station
 * @returns {PackingStation} Updated station
 *
 * @example
 * ```typescript
 * const released = releaseStation(station);
 * ```
 */
export function releaseStation(station: PackingStation): PackingStation {
  return {
    ...station,
    status: PackingStationStatus.AVAILABLE,
    assignedUser: undefined,
    currentOrder: undefined,
    lastActivity: new Date(),
  };
}

/**
 * 4. Starts packing operation for order.
 *
 * @param {PackingStation} station - Packing station
 * @param {string} orderId - Order ID to pack
 * @returns {PackingStation} Updated station
 *
 * @example
 * ```typescript
 * const started = startPackingOrder(station, 'ORDER-12345');
 * ```
 */
export function startPackingOrder(station: PackingStation, orderId: string): PackingStation {
  if (station.status !== PackingStationStatus.OCCUPIED) {
    throw new Error('Station must be occupied before starting order');
  }

  return {
    ...station,
    currentOrder: orderId,
    lastActivity: new Date(),
  };
}

/**
 * 5. Completes packing operation.
 *
 * @param {PackingStation} station - Packing station
 * @param {number} packTime - Time taken in seconds
 * @returns {PackingStation} Updated station
 *
 * @example
 * ```typescript
 * const completed = completePackingOrder(station, 180);
 * ```
 */
export function completePackingOrder(station: PackingStation, packTime: number): PackingStation {
  const packagesProcessed = station.metrics.packagesProcessed + 1;
  const totalTime = station.metrics.averagePackTime * station.metrics.packagesProcessed + packTime;
  const averagePackTime = totalTime / packagesProcessed;

  return {
    ...station,
    currentOrder: undefined,
    lastActivity: new Date(),
    metrics: {
      ...station.metrics,
      packagesProcessed,
      averagePackTime,
    },
  };
}

/**
 * 6. Adds equipment to packing station.
 *
 * @param {PackingStation} station - Packing station
 * @param {StationEquipment} equipment - Equipment to add
 * @returns {PackingStation} Updated station
 *
 * @example
 * ```typescript
 * const updated = addStationEquipment(station, {
 *   equipmentId: 'SCALE-001',
 *   type: 'SCALE',
 *   model: 'Mettler Toledo XS',
 *   status: 'ACTIVE'
 * });
 * ```
 */
export function addStationEquipment(
  station: PackingStation,
  equipment: StationEquipment
): PackingStation {
  return {
    ...station,
    equipment: [...station.equipment, equipment],
  };
}

/**
 * 7. Calculates station utilization rate.
 *
 * @param {PackingStation} station - Packing station
 * @param {number} shiftDuration - Shift duration in hours
 * @returns {number} Utilization rate (0-1)
 *
 * @example
 * ```typescript
 * const utilization = calculateStationUtilization(station, 8);
 * // Returns: 0.85 (85% utilized)
 * ```
 */
export function calculateStationUtilization(
  station: PackingStation,
  shiftDuration: number
): number {
  const shiftSeconds = shiftDuration * 3600;
  const activeTime = station.metrics.packagesProcessed * station.metrics.averagePackTime;
  const utilization = Math.min(1, activeTime / shiftSeconds);

  return Number(utilization.toFixed(3));
}

/**
 * 8. Generates station performance report.
 *
 * @param {PackingStation} station - Packing station
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {object} Performance report
 *
 * @example
 * ```typescript
 * const report = generateStationReport(station, startDate, endDate);
 * ```
 */
export function generateStationReport(
  station: PackingStation,
  startDate: Date,
  endDate: Date
): {
  stationId: string;
  period: { start: Date; end: Date };
  metrics: StationMetrics;
  recommendations: string[];
} {
  const recommendations: string[] = [];

  if (station.metrics.errorRate > 0.05) {
    recommendations.push('Error rate exceeds 5% - consider additional training');
  }

  if (station.metrics.averagePackTime > 300) {
    recommendations.push('Average pack time over 5 minutes - review process efficiency');
  }

  if (station.metrics.utilizationRate < 0.7) {
    recommendations.push('Utilization below 70% - consider workload rebalancing');
  }

  return {
    stationId: station.stationId,
    period: { start: startDate, end: endDate },
    metrics: station.metrics,
    recommendations,
  };
}

// ============================================================================
// SECTION 2: CARTONIZATION (Functions 9-17)
// ============================================================================

/**
 * 9. Performs intelligent cartonization for items.
 *
 * @param {PackableItem[]} items - Items to pack
 * @param {Container[]} availableContainers - Available container types
 * @returns {CartonizationResult} Cartonization result
 *
 * @example
 * ```typescript
 * const result = cartonizeItems(orderItems, containers);
 * console.log(`Created ${result.totalContainers} packages`);
 * ```
 */
export function cartonizeItems(
  items: PackableItem[],
  availableContainers: Container[]
): CartonizationResult {
  const packages: Package[] = [];
  const warnings: string[] = [];
  let remainingItems = [...items];
  let packageSequence = 1;

  // Separate hazmat and fragile items
  const hazmatItems = remainingItems.filter(item => item.hazmat);
  const fragileItems = remainingItems.filter(item => item.fragile && !item.hazmat);
  const regularItems = remainingItems.filter(item => !item.fragile && !item.hazmat);

  // Pack hazmat separately
  for (const item of hazmatItems) {
    const container = findBestContainer(item, availableContainers);
    if (container) {
      packages.push(createPackage(container, [item], packageSequence++));
    } else {
      warnings.push(`No suitable container for hazmat item ${item.sku}`);
    }
  }

  // Pack fragile items
  packages.push(...packItemsIntoContainers(fragileItems, availableContainers, packageSequence));
  packageSequence += fragileItems.length;

  // Pack regular items efficiently
  packages.push(...packItemsIntoContainers(regularItems, availableContainers, packageSequence));

  const totalWeight = packages.reduce((sum, pkg) => sum + pkg.weight.value, 0);
  const totalVolume = packages.reduce((sum, pkg) => sum + pkg.container.volume, 0);
  const estimatedCost = packages.reduce((sum, pkg) => sum + pkg.container.cost, 0);

  return {
    packages,
    totalContainers: packages.length,
    totalWeight: { value: totalWeight, unit: 'lb' },
    totalVolume,
    efficiency: calculatePackingEfficiency(packages),
    estimatedCost,
    warnings,
  };
}

/**
 * 10. Finds optimal container for item.
 *
 * @param {PackableItem} item - Item to pack
 * @param {Container[]} containers - Available containers
 * @returns {Container | null} Best container or null
 *
 * @example
 * ```typescript
 * const container = findBestContainer(item, availableContainers);
 * ```
 */
export function findBestContainer(
  item: PackableItem,
  containers: Container[]
): Container | null {
  const suitableContainers = containers.filter(container => {
    return (
      item.dimensions.length <= container.dimensions.length &&
      item.dimensions.width <= container.dimensions.width &&
      item.dimensions.height <= container.dimensions.height &&
      item.weight.value <= container.maxWeight.value
    );
  });

  if (suitableContainers.length === 0) return null;

  // Return smallest suitable container (lowest cost)
  return suitableContainers.sort((a, b) => a.cost - b.cost)[0];
}

/**
 * 11. Calculates dimensional weight.
 *
 * @param {Dimensions} dimensions - Package dimensions
 * @param {number} divisor - Dimensional divisor (default: 139 for UPS/FedEx)
 * @returns {Weight} Dimensional weight
 *
 * @example
 * ```typescript
 * const dimWeight = calculateDimensionalWeight(
 *   { length: 12, width: 10, height: 8, unit: 'in' },
 *   139
 * );
 * // Returns: { value: 7, unit: 'lb' }
 * ```
 */
export function calculateDimensionalWeight(dimensions: Dimensions, divisor: number = 139): Weight {
  const volume = dimensions.length * dimensions.width * dimensions.height;
  const dimWeight = Math.ceil(volume / divisor);

  return {
    value: dimWeight,
    unit: 'lb',
  };
}

/**
 * 12. Validates package against carrier restrictions.
 *
 * @param {Package} pkg - Package to validate
 * @param {Carrier} carrier - Carrier to validate against
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validatePackageForCarrier(package, Carrier.UPS);
 * if (!validation.valid) {
 *   console.error(validation.errors);
 * }
 * ```
 */
export function validatePackageForCarrier(
  pkg: Package,
  carrier: Carrier
): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // UPS restrictions
  if (carrier === Carrier.UPS) {
    const maxLength = 108;
    const maxGirth = 165; // Length + 2*(Width + Height)
    const maxWeight = 150;

    if (pkg.dimensions.length > maxLength) {
      errors.push(`Length ${pkg.dimensions.length}" exceeds UPS maximum of ${maxLength}"`);
    }

    const girth = pkg.dimensions.length + 2 * (pkg.dimensions.width + pkg.dimensions.height);
    if (girth > maxGirth) {
      errors.push(`Girth ${girth}" exceeds UPS maximum of ${maxGirth}"`);
    }

    if (pkg.weight.value > maxWeight) {
      errors.push(`Weight ${pkg.weight.value}lb exceeds UPS maximum of ${maxWeight}lb`);
    }
  }

  // FedEx restrictions
  if (carrier === Carrier.FEDEX) {
    const maxLength = 119;
    const maxGirth = 165;
    const maxWeight = 150;

    if (pkg.dimensions.length > maxLength) {
      errors.push(`Length ${pkg.dimensions.length}" exceeds FedEx maximum of ${maxLength}"`);
    }

    const girth = pkg.dimensions.length + 2 * (pkg.dimensions.width + pkg.dimensions.height);
    if (girth > maxGirth) {
      errors.push(`Girth ${girth}" exceeds FedEx maximum of ${maxGirth}"`);
    }

    if (pkg.weight.value > maxWeight) {
      errors.push(`Weight ${pkg.weight.value}lb exceeds FedEx maximum of ${maxWeight}lb`);
    }
  }

  // USPS restrictions
  if (carrier === Carrier.USPS) {
    const maxLength = 108;
    const maxGirth = 130;
    const maxWeight = 70;

    if (pkg.dimensions.length > maxLength) {
      errors.push(`Length ${pkg.dimensions.length}" exceeds USPS maximum of ${maxLength}"`);
    }

    const girth = pkg.dimensions.length + 2 * (pkg.dimensions.width + pkg.dimensions.height);
    if (girth > maxGirth) {
      errors.push(`Girth ${girth}" exceeds USPS maximum of ${maxGirth}"`);
    }

    if (pkg.weight.value > maxWeight) {
      errors.push(`Weight ${pkg.weight.value}lb exceeds USPS maximum of ${maxWeight}lb`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 13. Optimizes box selection for cost efficiency.
 *
 * @param {PackableItem[]} items - Items to pack
 * @param {Container[]} containers - Available containers
 * @returns {Container} Optimal container
 *
 * @example
 * ```typescript
 * const optimal = optimizeBoxSelection(items, containers);
 * ```
 */
export function optimizeBoxSelection(
  items: PackableItem[],
  containers: Container[]
): Container | null {
  const totalVolume = items.reduce((sum, item) => {
    return sum + item.dimensions.length * item.dimensions.width * item.dimensions.height;
  }, 0);

  const totalWeight = items.reduce((sum, item) => sum + item.weight.value, 0);

  const suitableContainers = containers.filter(container => {
    return container.volume >= totalVolume && container.maxWeight.value >= totalWeight;
  });

  if (suitableContainers.length === 0) return null;

  // Sort by efficiency: volume utilization / cost
  return suitableContainers.sort((a, b) => {
    const aEfficiency = totalVolume / a.volume / a.cost;
    const bEfficiency = totalVolume / b.volume / b.cost;
    return bEfficiency - aEfficiency;
  })[0];
}

/**
 * 14. Calculates packing efficiency.
 *
 * @param {Package[]} packages - Packed packages
 * @returns {number} Efficiency percentage (0-100)
 *
 * @example
 * ```typescript
 * const efficiency = calculatePackingEfficiency(packages);
 * // Returns: 87.5 (87.5% space utilization)
 * ```
 */
export function calculatePackingEfficiency(packages: Package[]): number {
  let totalItemVolume = 0;
  let totalContainerVolume = 0;

  for (const pkg of packages) {
    for (const item of pkg.items) {
      totalItemVolume += item.dimensions.length * item.dimensions.width * item.dimensions.height;
    }
    totalContainerVolume += pkg.container.volume;
  }

  if (totalContainerVolume === 0) return 0;

  const efficiency = (totalItemVolume / totalContainerVolume) * 100;
  return Number(efficiency.toFixed(2));
}

/**
 * 15. Groups items by compatible packing requirements.
 *
 * @param {PackableItem[]} items - Items to group
 * @returns {Record<string, PackableItem[]>} Grouped items
 *
 * @example
 * ```typescript
 * const groups = groupItemsByCompatibility(items);
 * // Returns: { HAZMAT: [...], FRAGILE: [...], STANDARD: [...] }
 * ```
 */
export function groupItemsByCompatibility(
  items: PackableItem[]
): Record<string, PackableItem[]> {
  const groups: Record<string, PackableItem[]> = {
    HAZMAT: [],
    FRAGILE: [],
    COLD_CHAIN: [],
    STANDARD: [],
  };

  for (const item of items) {
    if (item.hazmat) {
      groups.HAZMAT.push(item);
    } else if (item.requiresColdChain) {
      groups.COLD_CHAIN.push(item);
    } else if (item.fragile) {
      groups.FRAGILE.push(item);
    } else {
      groups.STANDARD.push(item);
    }
  }

  return groups;
}

/**
 * 16. Estimates void fill material needed.
 *
 * @param {Package} pkg - Package
 * @returns {object} Void fill estimate
 *
 * @example
 * ```typescript
 * const voidFill = estimateVoidFill(package);
 * // Returns: { type: 'AIR_PILLOWS', volume: 120, cost: 0.45 }
 * ```
 */
export function estimateVoidFill(pkg: Package): {
  type: string;
  volume: number;
  cost: number;
} {
  let itemVolume = 0;
  for (const item of pkg.items) {
    itemVolume += item.dimensions.length * item.dimensions.width * item.dimensions.height;
  }

  const containerVolume = pkg.container.volume;
  const voidVolume = containerVolume - itemVolume;

  const hasFragile = pkg.items.some(item => item.fragile);
  const type = hasFragile ? 'BUBBLE_WRAP' : 'AIR_PILLOWS';
  const costPerCubicInch = hasFragile ? 0.005 : 0.0025;

  return {
    type,
    volume: Math.max(0, voidVolume),
    cost: Number((voidVolume * costPerCubicInch).toFixed(2)),
  };
}

/**
 * 17. Generates packing instructions.
 *
 * @param {Package} pkg - Package to pack
 * @returns {string[]} Step-by-step instructions
 *
 * @example
 * ```typescript
 * const instructions = generatePackingInstructions(package);
 * instructions.forEach((step, i) => console.log(`${i + 1}. ${step}`));
 * ```
 */
export function generatePackingInstructions(pkg: Package): string[] {
  const instructions: string[] = [];

  instructions.push(`Select ${pkg.container.name} container`);

  const hasFragile = pkg.items.some(item => item.fragile);
  const hasHazmat = pkg.items.some(item => item.hazmat);

  if (hasFragile || hasHazmat) {
    instructions.push('Apply cushioning material to bottom of box');
  }

  for (const item of pkg.items) {
    instructions.push(`Place ${item.quantity}x ${item.name} (SKU: ${item.sku})`);

    if (item.fragile) {
      instructions.push('  → Wrap item in bubble wrap');
    }

    if (item.hazmat) {
      instructions.push('  → Ensure hazmat labeling is visible');
    }
  }

  const voidFill = estimateVoidFill(pkg);
  if (voidFill.volume > 50) {
    instructions.push(`Add ${voidFill.type} void fill`);
  }

  instructions.push('Seal box with packing tape');

  if (hasFragile) {
    instructions.push('Apply FRAGILE stickers to all sides');
  }

  if (hasHazmat) {
    instructions.push('Apply HAZMAT labels as required');
  }

  instructions.push('Affix shipping label to top of package');
  instructions.push('Scan package barcode to confirm packing complete');

  return instructions;
}

// ============================================================================
// SECTION 3: LABEL GENERATION (Functions 18-25)
// ============================================================================

/**
 * 18. Generates shipping label.
 *
 * @param {Shipment} shipment - Shipment details
 * @param {LabelFormat} format - Label format
 * @returns {ShippingLabel} Generated label
 *
 * @example
 * ```typescript
 * const label = generateShippingLabel(shipment, LabelFormat.PDF);
 * ```
 */
export function generateShippingLabel(
  shipment: Shipment,
  format: LabelFormat = LabelFormat.PDF
): ShippingLabel {
  const labelId = `LABEL-${crypto.randomUUID()}`;
  const trackingNumber = generateTrackingNumber(shipment.carrier);

  // In production, this would call carrier API
  const labelData = encodeLabelData(shipment, trackingNumber, format);

  return {
    labelId,
    trackingNumber,
    carrier: shipment.carrier,
    serviceLevel: shipment.serviceLevel,
    labelFormat: format,
    labelData,
    labelUrl: `https://labels.example.com/${labelId}.${format.toLowerCase()}`,
    cost: shipment.shippingCost,
    createdAt: new Date(),
    expiresAt: addDays(new Date(), 30),
  };
}

/**
 * 19. Generates return label.
 *
 * @param {Shipment} originalShipment - Original shipment
 * @param {LabelFormat} format - Label format
 * @returns {ShippingLabel} Return label
 *
 * @example
 * ```typescript
 * const returnLabel = generateReturnLabel(shipment, LabelFormat.PDF);
 * ```
 */
export function generateReturnLabel(
  originalShipment: Shipment,
  format: LabelFormat = LabelFormat.PDF
): ShippingLabel {
  // Swap from/to addresses
  const returnShipment: Shipment = {
    ...originalShipment,
    shipmentId: `RETURN-${crypto.randomUUID()}`,
    shipFrom: originalShipment.shipTo,
    shipTo: originalShipment.shipFrom,
    status: ShipmentStatus.PENDING,
  };

  const label = generateShippingLabel(returnShipment, format);

  return {
    ...label,
    labelId: `RETURN-${label.labelId}`,
  };
}

/**
 * 20. Generates batch labels for multiple shipments.
 *
 * @param {Shipment[]} shipments - Shipments to label
 * @param {LabelFormat} format - Label format
 * @returns {ShippingLabel[]} Generated labels
 *
 * @example
 * ```typescript
 * const labels = generateBatchLabels(shipments, LabelFormat.ZPL);
 * ```
 */
export function generateBatchLabels(
  shipments: Shipment[],
  format: LabelFormat = LabelFormat.PDF
): ShippingLabel[] {
  return shipments.map(shipment => generateShippingLabel(shipment, format));
}

/**
 * 21. Generates international shipping label with customs.
 *
 * @param {Shipment} shipment - International shipment
 * @param {CustomsDeclaration} customs - Customs declaration
 * @param {LabelFormat} format - Label format
 * @returns {object} Label and customs documents
 *
 * @example
 * ```typescript
 * const intlDocs = generateInternationalLabel(shipment, customs, LabelFormat.PDF);
 * ```
 */
export function generateInternationalLabel(
  shipment: Shipment,
  customs: CustomsDeclaration,
  format: LabelFormat = LabelFormat.PDF
): {
  label: ShippingLabel;
  customsForm: string;
  commercialInvoice: string;
} {
  const label = generateShippingLabel(shipment, format);
  const customsForm = generateCustomsForm(shipment, customs);
  const commercialInvoice = generateCommercialInvoice(shipment, customs);

  return {
    label,
    customsForm,
    commercialInvoice,
  };
}

/**
 * 22. Formats label for thermal printer.
 *
 * @param {ShippingLabel} label - Shipping label
 * @param {number} dpi - Printer DPI (203 or 300)
 * @returns {string} ZPL formatted label
 *
 * @example
 * ```typescript
 * const zpl = formatLabelForThermalPrinter(label, 300);
 * ```
 */
export function formatLabelForThermalPrinter(label: ShippingLabel, dpi: number = 300): string {
  // Simplified ZPL generation
  return `
^XA
^FO50,50^A0N,40,40^FD${label.carrier}^FS
^FO50,100^A0N,30,30^FDTracking: ${label.trackingNumber}^FS
^FO50,150^A0N,25,25^FDService: ${label.serviceLevel}^FS
^FO50,200^BY3^BCN,100,Y,N,N^FD${label.trackingNumber}^FS
^XZ
  `.trim();
}

/**
 * 23. Validates label data.
 *
 * @param {ShippingLabel} label - Label to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateLabel(label);
 * ```
 */
export function validateLabel(label: ShippingLabel): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!label.trackingNumber || label.trackingNumber.length < 10) {
    errors.push('Invalid tracking number');
  }

  if (!label.labelData || label.labelData.length === 0) {
    errors.push('Label data is empty');
  }

  if (label.expiresAt && label.expiresAt < new Date()) {
    errors.push('Label has expired');
  }

  if (label.cost <= 0) {
    errors.push('Invalid label cost');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 24. Generates packing slip.
 *
 * @param {Shipment} shipment - Shipment
 * @returns {string} HTML packing slip
 *
 * @example
 * ```typescript
 * const packingSlip = generatePackingSlip(shipment);
 * ```
 */
export function generatePackingSlip(shipment: Shipment): string {
  const items = shipment.packages.flatMap(pkg => pkg.items);

  return `
<!DOCTYPE html>
<html>
<head>
  <title>Packing Slip - ${shipment.orderId}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h1 { border-bottom: 2px solid #000; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <h1>Packing Slip</h1>
  <p><strong>Order ID:</strong> ${shipment.orderId}</p>
  <p><strong>Shipment ID:</strong> ${shipment.shipmentId}</p>
  <p><strong>Ship Date:</strong> ${shipment.shipDate?.toLocaleDateString() || 'Pending'}</p>

  <h2>Ship To:</h2>
  <p>
    ${shipment.shipTo.name}<br>
    ${shipment.shipTo.company || ''}<br>
    ${shipment.shipTo.addressLine1}<br>
    ${shipment.shipTo.addressLine2 || ''}<br>
    ${shipment.shipTo.city}, ${shipment.shipTo.state} ${shipment.shipTo.postalCode}<br>
    ${shipment.shipTo.country}
  </p>

  <h2>Items</h2>
  <table>
    <thead>
      <tr>
        <th>SKU</th>
        <th>Item</th>
        <th>Quantity</th>
      </tr>
    </thead>
    <tbody>
      ${items.map(item => `
        <tr>
          <td>${item.sku}</td>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <p><strong>Total Packages:</strong> ${shipment.packages.length}</p>
  <p><strong>Carrier:</strong> ${shipment.carrier}</p>
  <p><strong>Service:</strong> ${shipment.serviceLevel}</p>
</body>
</html>
  `.trim();
}

/**
 * 25. Generates hazmat labels and documentation.
 *
 * @param {HazmatInfo} hazmat - Hazmat information
 * @returns {object} Hazmat labels and docs
 *
 * @example
 * ```typescript
 * const hazmatDocs = generateHazmatLabels({
 *   unNumber: 'UN1263',
 *   properShippingName: 'Paint',
 *   hazardClass: '3',
 *   packingGroup: 'II',
 *   quantity: 5,
 *   unit: 'L'
 * });
 * ```
 */
export function generateHazmatLabels(hazmat: HazmatInfo): {
  label: string;
  declaration: string;
  msds: string;
} {
  const label = `
HAZARDOUS MATERIAL
${hazmat.unNumber}
${hazmat.properShippingName}
Class ${hazmat.hazardClass}
Packing Group ${hazmat.packingGroup}
Quantity: ${hazmat.quantity} ${hazmat.unit}
  `.trim();

  const declaration = `
SHIPPER'S DECLARATION FOR DANGEROUS GOODS

UN Number: ${hazmat.unNumber}
Proper Shipping Name: ${hazmat.properShippingName}
Hazard Class: ${hazmat.hazardClass}
Packing Group: ${hazmat.packingGroup}
Quantity: ${hazmat.quantity} ${hazmat.unit}

This shipment is within the limitations prescribed for passenger and cargo aircraft.
  `.trim();

  return {
    label,
    declaration,
    msds: `MSDS required for ${hazmat.properShippingName}`,
  };
}

// ============================================================================
// SECTION 4: CARRIER INTEGRATION (Functions 26-34)
// ============================================================================

/**
 * 26. Gets shipping rates from multiple carriers.
 *
 * @param {Shipment} shipment - Shipment details
 * @param {Carrier[]} carriers - Carriers to check
 * @returns {RateQuote[]} Rate quotes
 *
 * @example
 * ```typescript
 * const rates = getShippingRates(shipment, [Carrier.UPS, Carrier.FEDEX, Carrier.USPS]);
 * const cheapest = rates.sort((a, b) => a.cost - b.cost)[0];
 * ```
 */
export function getShippingRates(shipment: Shipment, carriers: Carrier[]): RateQuote[] {
  const quotes: RateQuote[] = [];

  for (const carrier of carriers) {
    // In production, this would call actual carrier APIs
    const quote = mockCarrierRateQuote(shipment, carrier);
    quotes.push(quote);
  }

  return quotes.sort((a, b) => a.cost - b.cost);
}

/**
 * 27. Selects best carrier based on criteria.
 *
 * @param {RateQuote[]} quotes - Rate quotes
 * @param {object} criteria - Selection criteria
 * @returns {RateQuote} Best quote
 *
 * @example
 * ```typescript
 * const best = selectBestCarrier(quotes, {
 *   prioritize: 'COST',
 *   maxDeliveryDays: 3
 * });
 * ```
 */
export function selectBestCarrier(
  quotes: RateQuote[],
  criteria: {
    prioritize: 'COST' | 'SPEED' | 'RELIABILITY';
    maxDeliveryDays?: number;
    maxCost?: number;
  }
): RateQuote {
  let filtered = [...quotes];

  if (criteria.maxDeliveryDays) {
    filtered = filtered.filter(q => q.deliveryDays <= criteria.maxDeliveryDays);
  }

  if (criteria.maxCost) {
    filtered = filtered.filter(q => q.cost <= criteria.maxCost);
  }

  if (filtered.length === 0) {
    throw new Error('No carriers meet the specified criteria');
  }

  if (criteria.prioritize === 'COST') {
    return filtered.sort((a, b) => a.cost - b.cost)[0];
  } else if (criteria.prioritize === 'SPEED') {
    return filtered.sort((a, b) => a.deliveryDays - b.deliveryDays)[0];
  } else {
    // RELIABILITY - prefer carriers with guaranteed delivery
    const guaranteed = filtered.filter(q => q.guaranteedDelivery);
    if (guaranteed.length > 0) {
      return guaranteed.sort((a, b) => a.cost - b.cost)[0];
    }
    return filtered.sort((a, b) => a.cost - b.cost)[0];
  }
}

/**
 * 28. Validates carrier credentials.
 *
 * @param {CarrierCredentials} credentials - Carrier credentials
 * @returns {Promise<boolean>} Validation result
 *
 * @example
 * ```typescript
 * const valid = await validateCarrierCredentials(credentials);
 * ```
 */
export async function validateCarrierCredentials(
  credentials: CarrierCredentials
): Promise<boolean> {
  // In production, this would call carrier API
  if (!credentials.apiKey || credentials.apiKey.length < 10) {
    return false;
  }

  if (!credentials.accountNumber) {
    return false;
  }

  // Mock API validation
  return true;
}

/**
 * 29. Creates shipment with carrier.
 *
 * @param {Shipment} shipment - Shipment to create
 * @param {CarrierCredentials} credentials - Carrier credentials
 * @returns {Promise<Shipment>} Created shipment with tracking
 *
 * @example
 * ```typescript
 * const created = await createCarrierShipment(shipment, credentials);
 * console.log('Tracking:', created.trackingNumbers);
 * ```
 */
export async function createCarrierShipment(
  shipment: Shipment,
  credentials: CarrierCredentials
): Promise<Shipment> {
  // Validate package against carrier
  for (const pkg of shipment.packages) {
    const validation = validatePackageForCarrier(pkg, shipment.carrier);
    if (!validation.valid) {
      throw new Error(`Package validation failed: ${validation.errors.join(', ')}`);
    }
  }

  // In production, call carrier API
  const trackingNumbers = shipment.packages.map(() => generateTrackingNumber(shipment.carrier));
  const labels = shipment.packages.map((pkg, i) => ({
    labelId: `LABEL-${crypto.randomUUID()}`,
    trackingNumber: trackingNumbers[i],
    carrier: shipment.carrier,
    serviceLevel: shipment.serviceLevel,
    labelFormat: LabelFormat.PDF,
    labelData: 'mock-label-data',
    cost: shipment.shippingCost / shipment.packages.length,
    createdAt: new Date(),
  }));

  return {
    ...shipment,
    status: ShipmentStatus.LABELED,
    trackingNumbers,
    labels,
  };
}

/**
 * 30. Voids/cancels shipment with carrier.
 *
 * @param {string} trackingNumber - Tracking number
 * @param {Carrier} carrier - Carrier
 * @param {CarrierCredentials} credentials - Carrier credentials
 * @returns {Promise<boolean>} Void success
 *
 * @example
 * ```typescript
 * const voided = await voidCarrierShipment('1Z999AA10123456784', Carrier.UPS, credentials);
 * ```
 */
export async function voidCarrierShipment(
  trackingNumber: string,
  carrier: Carrier,
  credentials: CarrierCredentials
): Promise<boolean> {
  // In production, call carrier void API
  // Most carriers allow voiding within 24 hours
  return true;
}

/**
 * 31. Schedules carrier pickup.
 *
 * @param {object} pickupRequest - Pickup request details
 * @param {CarrierCredentials} credentials - Carrier credentials
 * @returns {Promise<object>} Pickup confirmation
 *
 * @example
 * ```typescript
 * const pickup = await scheduleCarrierPickup({
 *   carrier: Carrier.UPS,
 *   date: new Date('2024-01-20'),
 *   location: warehouse,
 *   packageCount: 15,
 *   totalWeight: { value: 250, unit: 'lb' }
 * }, credentials);
 * ```
 */
export async function scheduleCarrierPickup(
  pickupRequest: {
    carrier: Carrier;
    date: Date;
    location: Address;
    packageCount: number;
    totalWeight: Weight;
    readyTime?: string;
    closeTime?: string;
  },
  credentials: CarrierCredentials
): Promise<{
  pickupId: string;
  carrier: Carrier;
  confirmationNumber: string;
  scheduledDate: Date;
  timeWindow: string;
}> {
  // In production, call carrier pickup API
  return {
    pickupId: `PICKUP-${crypto.randomUUID()}`,
    carrier: pickupRequest.carrier,
    confirmationNumber: generateConfirmationNumber(),
    scheduledDate: pickupRequest.date,
    timeWindow: `${pickupRequest.readyTime || '09:00'} - ${pickupRequest.closeTime || '17:00'}`,
  };
}

/**
 * 32. Validates shipping address.
 *
 * @param {Address} address - Address to validate
 * @param {Carrier} carrier - Carrier for validation
 * @returns {Promise<object>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateShippingAddress(address, Carrier.USPS);
 * if (validation.valid && validation.suggested) {
 *   console.log('Suggested:', validation.suggested);
 * }
 * ```
 */
export async function validateShippingAddress(
  address: Address,
  carrier: Carrier
): Promise<{
  valid: boolean;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  suggested?: Address;
  errors?: string[];
}> {
  const errors: string[] = [];

  if (!address.postalCode || address.postalCode.length < 5) {
    errors.push('Invalid postal code');
  }

  if (!address.city || !address.state) {
    errors.push('City and state are required');
  }

  if (!address.addressLine1) {
    errors.push('Address line 1 is required');
  }

  // In production, call carrier address validation API
  return {
    valid: errors.length === 0,
    confidence: errors.length === 0 ? 'HIGH' : 'LOW',
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * 33. Gets transit time estimate.
 *
 * @param {Address} origin - Origin address
 * @param {Address} destination - Destination address
 * @param {Carrier} carrier - Carrier
 * @param {ServiceLevel} service - Service level
 * @returns {Promise<object>} Transit estimate
 *
 * @example
 * ```typescript
 * const estimate = await getTransitTimeEstimate(origin, destination, Carrier.FEDEX, ServiceLevel.GROUND);
 * ```
 */
export async function getTransitTimeEstimate(
  origin: Address,
  destination: Address,
  carrier: Carrier,
  service: ServiceLevel
): Promise<{
  transitDays: number;
  estimatedDelivery: Date;
  guaranteed: boolean;
}> {
  // In production, call carrier transit time API
  let transitDays = 5;

  switch (service) {
    case ServiceLevel.OVERNIGHT:
      transitDays = 1;
      break;
    case ServiceLevel.TWO_DAY:
      transitDays = 2;
      break;
    case ServiceLevel.GROUND:
      transitDays = 5;
      break;
    case ServiceLevel.INTERNATIONAL_EXPRESS:
      transitDays = 3;
      break;
    case ServiceLevel.INTERNATIONAL_STANDARD:
      transitDays = 10;
      break;
  }

  const estimatedDelivery = addBusinessDays(new Date(), transitDays);

  return {
    transitDays,
    estimatedDelivery,
    guaranteed: service === ServiceLevel.OVERNIGHT || service === ServiceLevel.TWO_DAY,
  };
}

/**
 * 34. Generates end-of-day manifest.
 *
 * @param {string[]} shipmentIds - Shipment IDs to manifest
 * @param {Carrier} carrier - Carrier
 * @param {string} warehouseId - Warehouse ID
 * @returns {Manifest} Generated manifest
 *
 * @example
 * ```typescript
 * const manifest = generateCarrierManifest(shipmentIds, Carrier.UPS, 'WH-001');
 * ```
 */
export function generateCarrierManifest(
  shipmentIds: string[],
  carrier: Carrier,
  warehouseId: string
): Manifest {
  const manifestId = `MANIFEST-${crypto.randomUUID()}`;

  return {
    manifestId,
    carrier,
    warehouseId,
    shipDate: new Date(),
    shipments: shipmentIds,
    packageCount: shipmentIds.length,
    totalWeight: { value: 0, unit: 'lb' }, // Would be calculated from actual shipments
    manifestDocument: `Manifest document content for ${manifestId}`,
    manifestUrl: `https://manifests.example.com/${manifestId}.pdf`,
    closedAt: new Date(),
  };
}

// ============================================================================
// SECTION 5: SHIPMENT TRACKING (Functions 35-42)
// ============================================================================

/**
 * 35. Tracks shipment by tracking number.
 *
 * @param {string} trackingNumber - Tracking number
 * @param {Carrier} carrier - Carrier
 * @returns {Promise<TrackingInfo>} Tracking information
 *
 * @example
 * ```typescript
 * const tracking = await trackShipment('1Z999AA10123456784', Carrier.UPS);
 * console.log('Status:', tracking.status);
 * console.log('Location:', tracking.currentLocation);
 * ```
 */
export async function trackShipment(
  trackingNumber: string,
  carrier: Carrier
): Promise<TrackingInfo> {
  // In production, call carrier tracking API
  const mockEvents: TrackingEvent[] = [
    {
      eventId: crypto.randomUUID(),
      timestamp: new Date(Date.now() - 86400000 * 2),
      status: 'PICKED_UP',
      statusCode: 'PU',
      location: 'Origin Facility',
      city: 'Los Angeles',
      state: 'CA',
      country: 'US',
      description: 'Package picked up from shipper',
    },
    {
      eventId: crypto.randomUUID(),
      timestamp: new Date(Date.now() - 86400000),
      status: 'IN_TRANSIT',
      statusCode: 'IT',
      location: 'Sort Facility',
      city: 'Memphis',
      state: 'TN',
      country: 'US',
      description: 'Package in transit',
    },
    {
      eventId: crypto.randomUUID(),
      timestamp: new Date(),
      status: 'OUT_FOR_DELIVERY',
      statusCode: 'OFD',
      location: 'Destination Facility',
      city: 'New York',
      state: 'NY',
      country: 'US',
      description: 'Out for delivery',
    },
  ];

  return {
    trackingNumber,
    carrier,
    status: ShipmentStatus.OUT_FOR_DELIVERY,
    events: mockEvents,
    currentLocation: 'New York, NY',
    estimatedDelivery: new Date(Date.now() + 3600000 * 8),
    lastUpdated: new Date(),
  };
}

/**
 * 36. Tracks multiple shipments in batch.
 *
 * @param {Array<{trackingNumber: string, carrier: Carrier}>} shipments - Shipments to track
 * @returns {Promise<TrackingInfo[]>} Tracking information
 *
 * @example
 * ```typescript
 * const tracking = await trackMultipleShipments([
 *   { trackingNumber: '1Z999AA10123456784', carrier: Carrier.UPS },
 *   { trackingNumber: '794612345678', carrier: Carrier.FEDEX }
 * ]);
 * ```
 */
export async function trackMultipleShipments(
  shipments: Array<{ trackingNumber: string; carrier: Carrier }>
): Promise<TrackingInfo[]> {
  const trackingPromises = shipments.map(s => trackShipment(s.trackingNumber, s.carrier));
  return Promise.all(trackingPromises);
}

/**
 * 37. Gets latest tracking event.
 *
 * @param {TrackingInfo} tracking - Tracking information
 * @returns {TrackingEvent} Latest event
 *
 * @example
 * ```typescript
 * const latest = getLatestTrackingEvent(tracking);
 * console.log(latest.description);
 * ```
 */
export function getLatestTrackingEvent(tracking: TrackingInfo): TrackingEvent {
  if (tracking.events.length === 0) {
    throw new Error('No tracking events available');
  }

  return tracking.events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
}

/**
 * 38. Checks if shipment is delayed.
 *
 * @param {TrackingInfo} tracking - Tracking information
 * @param {Date} expectedDelivery - Expected delivery date
 * @returns {object} Delay information
 *
 * @example
 * ```typescript
 * const delay = checkShipmentDelay(tracking, expectedDeliveryDate);
 * if (delay.isDelayed) {
 *   console.log(`Delayed by ${delay.delayDays} days`);
 * }
 * ```
 */
export function checkShipmentDelay(
  tracking: TrackingInfo,
  expectedDelivery: Date
): {
  isDelayed: boolean;
  delayDays: number;
  reason?: string;
} {
  const now = new Date();
  const isDelayed = now > expectedDelivery && tracking.status !== ShipmentStatus.DELIVERED;

  if (!isDelayed) {
    return { isDelayed: false, delayDays: 0 };
  }

  const delayDays = Math.ceil((now.getTime() - expectedDelivery.getTime()) / (1000 * 60 * 60 * 24));

  // Check for exception events
  const exceptionEvent = tracking.events.find(e => e.exceptionCode);

  return {
    isDelayed: true,
    delayDays,
    reason: exceptionEvent?.description,
  };
}

/**
 * 39. Generates tracking URL for customer.
 *
 * @param {string} trackingNumber - Tracking number
 * @param {Carrier} carrier - Carrier
 * @returns {string} Tracking URL
 *
 * @example
 * ```typescript
 * const url = generateTrackingURL('1Z999AA10123456784', Carrier.UPS);
 * // Returns: 'https://www.ups.com/track?tracknum=1Z999AA10123456784'
 * ```
 */
export function generateTrackingURL(trackingNumber: string, carrier: Carrier): string {
  const urls: Record<Carrier, string> = {
    [Carrier.UPS]: `https://www.ups.com/track?tracknum=${trackingNumber}`,
    [Carrier.FEDEX]: `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNumber}`,
    [Carrier.USPS]: `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
    [Carrier.DHL]: `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`,
    [Carrier.ONTRAC]: `https://www.ontrac.com/tracking/?number=${trackingNumber}`,
    [Carrier.LASERSHIP]: `https://www.lasership.com/track/${trackingNumber}`,
    [Carrier.CUSTOM]: `https://tracking.example.com/${trackingNumber}`,
  };

  return urls[carrier];
}

/**
 * 40. Subscribes to tracking updates.
 *
 * @param {string} trackingNumber - Tracking number
 * @param {Carrier} carrier - Carrier
 * @param {object} notification - Notification preferences
 * @returns {Promise<object>} Subscription details
 *
 * @example
 * ```typescript
 * const subscription = await subscribeToTrackingUpdates(
 *   '1Z999AA10123456784',
 *   Carrier.UPS,
 *   { email: 'customer@example.com', sms: '+15555551234' }
 * );
 * ```
 */
export async function subscribeToTrackingUpdates(
  trackingNumber: string,
  carrier: Carrier,
  notification: {
    email?: string;
    sms?: string;
    webhook?: string;
  }
): Promise<{
  subscriptionId: string;
  trackingNumber: string;
  active: boolean;
}> {
  // In production, set up webhooks with carrier API
  return {
    subscriptionId: `SUB-${crypto.randomUUID()}`,
    trackingNumber,
    active: true,
  };
}

/**
 * 41. Generates delivery proof document.
 *
 * @param {TrackingInfo} tracking - Tracking information
 * @returns {object} Proof of delivery
 *
 * @example
 * ```typescript
 * const pod = generateProofOfDelivery(tracking);
 * ```
 */
export function generateProofOfDelivery(tracking: TrackingInfo): {
  trackingNumber: string;
  deliveryDate: Date;
  signedBy: string;
  location: string;
  photoUrl?: string;
  certificateUrl: string;
} {
  const deliveryEvent = tracking.events.find(e => e.status === 'DELIVERED');

  if (!deliveryEvent) {
    throw new Error('Package not yet delivered');
  }

  return {
    trackingNumber: tracking.trackingNumber,
    deliveryDate: deliveryEvent.timestamp,
    signedBy: deliveryEvent.signedBy || 'Not available',
    location: deliveryEvent.location || 'Unknown',
    certificateUrl: `https://pod.example.com/${tracking.trackingNumber}.pdf`,
  };
}

/**
 * 42. Analyzes shipment performance metrics.
 *
 * @param {TrackingInfo[]} trackingData - Historical tracking data
 * @returns {object} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = analyzeShipmentPerformance(allTrackingData);
 * console.log(`On-time delivery: ${metrics.onTimeRate}%`);
 * console.log(`Average transit: ${metrics.averageTransitDays} days`);
 * ```
 */
export function analyzeShipmentPerformance(trackingData: TrackingInfo[]): {
  totalShipments: number;
  delivered: number;
  inTransit: number;
  exceptions: number;
  onTimeRate: number;
  averageTransitDays: number;
  carrierPerformance: Record<Carrier, { delivered: number; onTime: number; exceptions: number }>;
} {
  const delivered = trackingData.filter(t => t.status === ShipmentStatus.DELIVERED);
  const inTransit = trackingData.filter(
    t => t.status === ShipmentStatus.IN_TRANSIT || t.status === ShipmentStatus.OUT_FOR_DELIVERY
  );
  const exceptions = trackingData.filter(t => t.status === ShipmentStatus.EXCEPTION);

  const onTimeDeliveries = delivered.filter(t => {
    if (!t.estimatedDelivery || !t.actualDelivery) return false;
    return t.actualDelivery <= t.estimatedDelivery;
  });

  const onTimeRate = delivered.length > 0 ? (onTimeDeliveries.length / delivered.length) * 100 : 0;

  const transitDays = delivered
    .map(t => {
      if (!t.actualDelivery) return 0;
      const pickupEvent = t.events.find(e => e.statusCode === 'PU');
      if (!pickupEvent) return 0;
      return Math.ceil(
        (t.actualDelivery.getTime() - pickupEvent.timestamp.getTime()) / (1000 * 60 * 60 * 24)
      );
    })
    .filter(d => d > 0);

  const averageTransitDays =
    transitDays.length > 0
      ? transitDays.reduce((sum, d) => sum + d, 0) / transitDays.length
      : 0;

  const carrierPerformance: Record<
    Carrier,
    { delivered: number; onTime: number; exceptions: number }
  > = {} as any;

  for (const carrier of Object.values(Carrier)) {
    const carrierShipments = trackingData.filter(t => t.carrier === carrier);
    const carrierDelivered = carrierShipments.filter(t => t.status === ShipmentStatus.DELIVERED);
    const carrierOnTime = carrierDelivered.filter(t => {
      if (!t.estimatedDelivery || !t.actualDelivery) return false;
      return t.actualDelivery <= t.estimatedDelivery;
    });
    const carrierExceptions = carrierShipments.filter(t => t.status === ShipmentStatus.EXCEPTION);

    carrierPerformance[carrier] = {
      delivered: carrierDelivered.length,
      onTime: carrierOnTime.length,
      exceptions: carrierExceptions.length,
    };
  }

  return {
    totalShipments: trackingData.length,
    delivered: delivered.length,
    inTransit: inTransit.length,
    exceptions: exceptions.length,
    onTimeRate: Number(onTimeRate.toFixed(2)),
    averageTransitDays: Number(averageTransitDays.toFixed(1)),
    carrierPerformance,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper: Generates tracking number for carrier.
 */
function generateTrackingNumber(carrier: Carrier): string {
  const prefixes: Record<Carrier, string> = {
    [Carrier.UPS]: '1Z',
    [Carrier.FEDEX]: '794',
    [Carrier.USPS]: '9400',
    [Carrier.DHL]: 'JD',
    [Carrier.ONTRAC]: 'D',
    [Carrier.LASERSHIP]: 'LS',
    [Carrier.CUSTOM]: 'CT',
  };

  const prefix = prefixes[carrier];
  const randomDigits = crypto.randomBytes(8).toString('hex').toUpperCase();

  return `${prefix}${randomDigits}`;
}

/**
 * Helper: Encodes label data based on format.
 */
function encodeLabelData(shipment: Shipment, trackingNumber: string, format: LabelFormat): string {
  if (format === LabelFormat.ZPL) {
    return `^XA^FO50,50^A0N,40,40^FD${trackingNumber}^FS^XZ`;
  }

  // Base64 encoded mock label data
  return Buffer.from(`Label for ${trackingNumber}`).toString('base64');
}

/**
 * Helper: Adds days to date.
 */
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Helper: Adds business days to date.
 */
function addBusinessDays(date: Date, days: number): Date {
  let result = new Date(date);
  let addedDays = 0;

  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    // Skip weekends
    if (result.getDay() !== 0 && result.getDay() !== 6) {
      addedDays++;
    }
  }

  return result;
}

/**
 * Helper: Generates confirmation number.
 */
function generateConfirmationNumber(): string {
  return crypto.randomBytes(6).toString('hex').toUpperCase();
}

/**
 * Helper: Creates a package object.
 */
function createPackage(container: Container, items: PackableItem[], sequence: number): Package {
  const totalWeight = items.reduce((sum, item) => sum + item.weight.value * item.quantity, 0);

  return {
    packageId: `PKG-${crypto.randomUUID()}`,
    container,
    items,
    weight: { value: totalWeight + container.tareWeight.value, unit: 'lb' },
    dimensions: container.dimensions,
    sequence,
  };
}

/**
 * Helper: Packs items into containers.
 */
function packItemsIntoContainers(
  items: PackableItem[],
  containers: Container[],
  startSequence: number
): Package[] {
  const packages: Package[] = [];
  const remaining = [...items];

  while (remaining.length > 0) {
    const item = remaining.shift()!;
    const container = findBestContainer(item, containers);

    if (container) {
      packages.push(createPackage(container, [item], startSequence + packages.length));
    }
  }

  return packages;
}

/**
 * Helper: Mock carrier rate quote.
 */
function mockCarrierRateQuote(shipment: Shipment, carrier: Carrier): RateQuote {
  const baseRate = 10;
  const weightRate = shipment.packages.reduce((sum, pkg) => sum + pkg.weight.value * 0.5, 0);

  const carrierMultipliers: Record<Carrier, number> = {
    [Carrier.UPS]: 1.0,
    [Carrier.FEDEX]: 1.05,
    [Carrier.USPS]: 0.85,
    [Carrier.DHL]: 1.15,
    [Carrier.ONTRAC]: 0.9,
    [Carrier.LASERSHIP]: 0.88,
    [Carrier.CUSTOM]: 1.0,
  };

  const cost = (baseRate + weightRate) * carrierMultipliers[carrier];

  return {
    quoteId: `QUOTE-${crypto.randomUUID()}`,
    carrier,
    serviceLevel: shipment.serviceLevel,
    cost: Number(cost.toFixed(2)),
    deliveryDays: shipment.serviceLevel === ServiceLevel.OVERNIGHT ? 1 : 5,
    estimatedDeliveryDate: addBusinessDays(new Date(), 5),
    currency: 'USD',
    guaranteedDelivery: shipment.serviceLevel === ServiceLevel.OVERNIGHT,
    includesInsurance: false,
  };
}

/**
 * Helper: Generates customs form.
 */
function generateCustomsForm(shipment: Shipment, customs: CustomsDeclaration): string {
  return `
CUSTOMS DECLARATION
Declaration ID: ${customs.declarationId}
Total Value: ${customs.totalValue} ${customs.currency}
Reason for Export: ${customs.reason}
Terms of Sale: ${customs.termsOfSale}

Items:
${customs.items.map((item, i) => `
${i + 1}. ${item.description}
   Quantity: ${item.quantity}
   Value: ${item.value} ${customs.currency}
   Weight: ${item.weight.value} ${item.weight.unit}
   Country of Origin: ${item.countryOfOrigin}
   HS Code: ${item.hsCode || 'N/A'}
`).join('\n')}
  `.trim();
}

/**
 * Helper: Generates commercial invoice.
 */
function generateCommercialInvoice(shipment: Shipment, customs: CustomsDeclaration): string {
  return `
COMMERCIAL INVOICE

Ship From:
${shipment.shipFrom.name}
${shipment.shipFrom.addressLine1}
${shipment.shipFrom.city}, ${shipment.shipFrom.state} ${shipment.shipFrom.postalCode}
${shipment.shipFrom.country}

Ship To:
${shipment.shipTo.name}
${shipment.shipTo.addressLine1}
${shipment.shipTo.city}, ${shipment.shipTo.state} ${shipment.shipTo.postalCode}
${shipment.shipTo.country}

Invoice Details:
Total Value: ${customs.totalValue} ${customs.currency}
Terms: ${customs.termsOfSale}
Reason: ${customs.reason}

${customs.items.map((item, i) => `
Item ${i + 1}: ${item.description}
Quantity: ${item.quantity} | Unit Value: ${item.value} | Total: ${item.quantity * item.value}
Origin: ${item.countryOfOrigin} | HS Code: ${item.hsCode || 'N/A'}
`).join('\n')}

Grand Total: ${customs.totalValue} ${customs.currency}
  `.trim();
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Packing Station Management
  createPackingStation,
  assignUserToStation,
  releaseStation,
  startPackingOrder,
  completePackingOrder,
  addStationEquipment,
  calculateStationUtilization,
  generateStationReport,

  // Cartonization
  cartonizeItems,
  findBestContainer,
  calculateDimensionalWeight,
  validatePackageForCarrier,
  optimizeBoxSelection,
  calculatePackingEfficiency,
  groupItemsByCompatibility,
  estimateVoidFill,
  generatePackingInstructions,

  // Label Generation
  generateShippingLabel,
  generateReturnLabel,
  generateBatchLabels,
  generateInternationalLabel,
  formatLabelForThermalPrinter,
  validateLabel,
  generatePackingSlip,
  generateHazmatLabels,

  // Carrier Integration
  getShippingRates,
  selectBestCarrier,
  validateCarrierCredentials,
  createCarrierShipment,
  voidCarrierShipment,
  scheduleCarrierPickup,
  validateShippingAddress,
  getTransitTimeEstimate,
  generateCarrierManifest,

  // Shipment Tracking
  trackShipment,
  trackMultipleShipments,
  getLatestTrackingEvent,
  checkShipmentDelay,
  generateTrackingURL,
  subscribeToTrackingUpdates,
  generateProofOfDelivery,
  analyzeShipmentPerformance,
};
