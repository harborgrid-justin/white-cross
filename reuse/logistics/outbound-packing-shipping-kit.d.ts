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
 * Packing station status enumeration
 */
export declare enum PackingStationStatus {
    AVAILABLE = "AVAILABLE",
    OCCUPIED = "OCCUPIED",
    MAINTENANCE = "MAINTENANCE",
    OFFLINE = "OFFLINE"
}
/**
 * Shipment status enumeration
 */
export declare enum ShipmentStatus {
    PENDING = "PENDING",
    PICKING = "PICKING",
    PICKED = "PICKED",
    PACKING = "PACKING",
    PACKED = "PACKED",
    LABELED = "LABELED",
    MANIFESTED = "MANIFESTED",
    SHIPPED = "SHIPPED",
    IN_TRANSIT = "IN_TRANSIT",
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
    DELIVERED = "DELIVERED",
    EXCEPTION = "EXCEPTION",
    RETURNED = "RETURNED",
    CANCELLED = "CANCELLED"
}
/**
 * Carrier enumeration
 */
export declare enum Carrier {
    UPS = "UPS",
    FEDEX = "FEDEX",
    USPS = "USPS",
    DHL = "DHL",
    ONTRAC = "ONTRAC",
    LASERSHIP = "LASERSHIP",
    CUSTOM = "CUSTOM"
}
/**
 * Service level enumeration
 */
export declare enum ServiceLevel {
    GROUND = "GROUND",
    TWO_DAY = "TWO_DAY",
    OVERNIGHT = "OVERNIGHT",
    SAME_DAY = "SAME_DAY",
    INTERNATIONAL_STANDARD = "INTERNATIONAL_STANDARD",
    INTERNATIONAL_EXPRESS = "INTERNATIONAL_EXPRESS",
    FREIGHT = "FREIGHT"
}
/**
 * Package type enumeration
 */
export declare enum PackageType {
    ENVELOPE = "ENVELOPE",
    PAK = "PAK",
    BOX = "BOX",
    TUBE = "TUBE",
    PALLET = "PALLET",
    CUSTOM = "CUSTOM"
}
/**
 * Label format enumeration
 */
export declare enum LabelFormat {
    PNG = "PNG",
    PDF = "PDF",
    ZPL = "ZPL",
    EPL = "EPL",
    THERMAL = "THERMAL"
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
export declare function createPackingStation(config: Partial<PackingStation>): PackingStation;
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
export declare function assignUserToStation(station: PackingStation, userId: string): PackingStation;
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
export declare function releaseStation(station: PackingStation): PackingStation;
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
export declare function startPackingOrder(station: PackingStation, orderId: string): PackingStation;
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
export declare function completePackingOrder(station: PackingStation, packTime: number): PackingStation;
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
export declare function addStationEquipment(station: PackingStation, equipment: StationEquipment): PackingStation;
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
export declare function calculateStationUtilization(station: PackingStation, shiftDuration: number): number;
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
export declare function generateStationReport(station: PackingStation, startDate: Date, endDate: Date): {
    stationId: string;
    period: {
        start: Date;
        end: Date;
    };
    metrics: StationMetrics;
    recommendations: string[];
};
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
export declare function cartonizeItems(items: PackableItem[], availableContainers: Container[]): CartonizationResult;
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
export declare function findBestContainer(item: PackableItem, containers: Container[]): Container | null;
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
export declare function calculateDimensionalWeight(dimensions: Dimensions, divisor?: number): Weight;
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
export declare function validatePackageForCarrier(pkg: Package, carrier: Carrier): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
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
export declare function optimizeBoxSelection(items: PackableItem[], containers: Container[]): Container | null;
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
export declare function calculatePackingEfficiency(packages: Package[]): number;
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
export declare function groupItemsByCompatibility(items: PackableItem[]): Record<string, PackableItem[]>;
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
export declare function estimateVoidFill(pkg: Package): {
    type: string;
    volume: number;
    cost: number;
};
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
export declare function generatePackingInstructions(pkg: Package): string[];
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
export declare function generateShippingLabel(shipment: Shipment, format?: LabelFormat): ShippingLabel;
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
export declare function generateReturnLabel(originalShipment: Shipment, format?: LabelFormat): ShippingLabel;
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
export declare function generateBatchLabels(shipments: Shipment[], format?: LabelFormat): ShippingLabel[];
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
export declare function generateInternationalLabel(shipment: Shipment, customs: CustomsDeclaration, format?: LabelFormat): {
    label: ShippingLabel;
    customsForm: string;
    commercialInvoice: string;
};
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
export declare function formatLabelForThermalPrinter(label: ShippingLabel, dpi?: number): string;
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
export declare function validateLabel(label: ShippingLabel): {
    valid: boolean;
    errors: string[];
};
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
export declare function generatePackingSlip(shipment: Shipment): string;
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
export declare function generateHazmatLabels(hazmat: HazmatInfo): {
    label: string;
    declaration: string;
    msds: string;
};
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
export declare function getShippingRates(shipment: Shipment, carriers: Carrier[]): RateQuote[];
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
export declare function selectBestCarrier(quotes: RateQuote[], criteria: {
    prioritize: 'COST' | 'SPEED' | 'RELIABILITY';
    maxDeliveryDays?: number;
    maxCost?: number;
}): RateQuote;
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
export declare function validateCarrierCredentials(credentials: CarrierCredentials): Promise<boolean>;
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
export declare function createCarrierShipment(shipment: Shipment, credentials: CarrierCredentials): Promise<Shipment>;
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
export declare function voidCarrierShipment(trackingNumber: string, carrier: Carrier, credentials: CarrierCredentials): Promise<boolean>;
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
export declare function scheduleCarrierPickup(pickupRequest: {
    carrier: Carrier;
    date: Date;
    location: Address;
    packageCount: number;
    totalWeight: Weight;
    readyTime?: string;
    closeTime?: string;
}, credentials: CarrierCredentials): Promise<{
    pickupId: string;
    carrier: Carrier;
    confirmationNumber: string;
    scheduledDate: Date;
    timeWindow: string;
}>;
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
export declare function validateShippingAddress(address: Address, carrier: Carrier): Promise<{
    valid: boolean;
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    suggested?: Address;
    errors?: string[];
}>;
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
export declare function getTransitTimeEstimate(origin: Address, destination: Address, carrier: Carrier, service: ServiceLevel): Promise<{
    transitDays: number;
    estimatedDelivery: Date;
    guaranteed: boolean;
}>;
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
export declare function generateCarrierManifest(shipmentIds: string[], carrier: Carrier, warehouseId: string): Manifest;
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
export declare function trackShipment(trackingNumber: string, carrier: Carrier): Promise<TrackingInfo>;
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
export declare function trackMultipleShipments(shipments: Array<{
    trackingNumber: string;
    carrier: Carrier;
}>): Promise<TrackingInfo[]>;
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
export declare function getLatestTrackingEvent(tracking: TrackingInfo): TrackingEvent;
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
export declare function checkShipmentDelay(tracking: TrackingInfo, expectedDelivery: Date): {
    isDelayed: boolean;
    delayDays: number;
    reason?: string;
};
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
export declare function generateTrackingURL(trackingNumber: string, carrier: Carrier): string;
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
export declare function subscribeToTrackingUpdates(trackingNumber: string, carrier: Carrier, notification: {
    email?: string;
    sms?: string;
    webhook?: string;
}): Promise<{
    subscriptionId: string;
    trackingNumber: string;
    active: boolean;
}>;
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
export declare function generateProofOfDelivery(tracking: TrackingInfo): {
    trackingNumber: string;
    deliveryDate: Date;
    signedBy: string;
    location: string;
    photoUrl?: string;
    certificateUrl: string;
};
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
export declare function analyzeShipmentPerformance(trackingData: TrackingInfo[]): {
    totalShipments: number;
    delivered: number;
    inTransit: number;
    exceptions: number;
    onTimeRate: number;
    averageTransitDays: number;
    carrierPerformance: Record<Carrier, {
        delivered: number;
        onTime: number;
        exceptions: number;
    }>;
};
declare const _default: {
    createPackingStation: typeof createPackingStation;
    assignUserToStation: typeof assignUserToStation;
    releaseStation: typeof releaseStation;
    startPackingOrder: typeof startPackingOrder;
    completePackingOrder: typeof completePackingOrder;
    addStationEquipment: typeof addStationEquipment;
    calculateStationUtilization: typeof calculateStationUtilization;
    generateStationReport: typeof generateStationReport;
    cartonizeItems: typeof cartonizeItems;
    findBestContainer: typeof findBestContainer;
    calculateDimensionalWeight: typeof calculateDimensionalWeight;
    validatePackageForCarrier: typeof validatePackageForCarrier;
    optimizeBoxSelection: typeof optimizeBoxSelection;
    calculatePackingEfficiency: typeof calculatePackingEfficiency;
    groupItemsByCompatibility: typeof groupItemsByCompatibility;
    estimateVoidFill: typeof estimateVoidFill;
    generatePackingInstructions: typeof generatePackingInstructions;
    generateShippingLabel: typeof generateShippingLabel;
    generateReturnLabel: typeof generateReturnLabel;
    generateBatchLabels: typeof generateBatchLabels;
    generateInternationalLabel: typeof generateInternationalLabel;
    formatLabelForThermalPrinter: typeof formatLabelForThermalPrinter;
    validateLabel: typeof validateLabel;
    generatePackingSlip: typeof generatePackingSlip;
    generateHazmatLabels: typeof generateHazmatLabels;
    getShippingRates: typeof getShippingRates;
    selectBestCarrier: typeof selectBestCarrier;
    validateCarrierCredentials: typeof validateCarrierCredentials;
    createCarrierShipment: typeof createCarrierShipment;
    voidCarrierShipment: typeof voidCarrierShipment;
    scheduleCarrierPickup: typeof scheduleCarrierPickup;
    validateShippingAddress: typeof validateShippingAddress;
    getTransitTimeEstimate: typeof getTransitTimeEstimate;
    generateCarrierManifest: typeof generateCarrierManifest;
    trackShipment: typeof trackShipment;
    trackMultipleShipments: typeof trackMultipleShipments;
    getLatestTrackingEvent: typeof getLatestTrackingEvent;
    checkShipmentDelay: typeof checkShipmentDelay;
    generateTrackingURL: typeof generateTrackingURL;
    subscribeToTrackingUpdates: typeof subscribeToTrackingUpdates;
    generateProofOfDelivery: typeof generateProofOfDelivery;
    analyzeShipmentPerformance: typeof analyzeShipmentPerformance;
};
export default _default;
//# sourceMappingURL=outbound-packing-shipping-kit.d.ts.map