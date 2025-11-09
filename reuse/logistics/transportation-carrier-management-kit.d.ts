/**
 * LOC: LOG-CARRIER-001
 * File: /reuse/logistics/transportation-carrier-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *   - axios (for carrier API integrations)
 *
 * DOWNSTREAM (imported by):
 *   - Logistics controllers
 *   - Shipment services
 *   - Rating engines
 *   - Carrier integration services
 */
/**
 * Carrier operational status
 */
export declare enum CarrierStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    DEACTIVATED = "DEACTIVATED"
}
/**
 * Transportation modes
 */
export declare enum TransportMode {
    PARCEL = "PARCEL",
    LTL = "LTL",// Less than Truckload
    FTL = "FTL",// Full Truckload
    AIR = "AIR",
    OCEAN = "OCEAN",
    RAIL = "RAIL",
    INTERMODAL = "INTERMODAL",
    COURIER = "COURIER"
}
/**
 * Service level types
 */
export declare enum ServiceLevel {
    SAME_DAY = "SAME_DAY",
    NEXT_DAY = "NEXT_DAY",
    TWO_DAY = "TWO_DAY",
    THREE_DAY = "THREE_DAY",
    GROUND = "GROUND",
    ECONOMY = "ECONOMY",
    STANDARD = "STANDARD",
    EXPRESS = "EXPRESS",
    PRIORITY = "PRIORITY",
    INTERNATIONAL = "INTERNATIONAL"
}
/**
 * Rate calculation methods
 */
export declare enum RateCalculationType {
    FLAT_RATE = "FLAT_RATE",
    WEIGHT_BASED = "WEIGHT_BASED",
    DISTANCE_BASED = "DISTANCE_BASED",
    ZONE_BASED = "ZONE_BASED",
    DIMENSIONAL_WEIGHT = "DIMENSIONAL_WEIGHT",
    HUNDREDWEIGHT = "HUNDREDWEIGHT",
    PER_MILE = "PER_MILE",
    API_REALTIME = "API_REALTIME"
}
/**
 * Carrier API integration types
 */
export declare enum IntegrationType {
    REST_API = "REST_API",
    SOAP_API = "SOAP_API",
    EDI = "EDI",
    FTP = "FTP",
    WEBHOOK = "WEBHOOK",
    MANUAL = "MANUAL"
}
/**
 * Performance metric types
 */
export declare enum PerformanceMetric {
    ON_TIME_DELIVERY = "ON_TIME_DELIVERY",
    DELIVERY_EXCEPTION = "DELIVERY_EXCEPTION",
    DAMAGE_RATE = "DAMAGE_RATE",
    LOST_SHIPMENT = "LOST_SHIPMENT",
    COST_VARIANCE = "COST_VARIANCE",
    TRANSIT_TIME = "TRANSIT_TIME",
    CUSTOMER_SATISFACTION = "CUSTOMER_SATISFACTION"
}
/**
 * Carrier profile with credentials and capabilities
 */
export interface CarrierProfile {
    carrierId: string;
    carrierCode: string;
    name: string;
    scac: string;
    dotNumber?: string;
    mcNumber?: string;
    status: CarrierStatus;
    supportedModes: TransportMode[];
    contactInfo: {
        email: string;
        phone: string;
        website?: string;
        address?: string;
    };
    insuranceInfo?: {
        provider: string;
        policyNumber: string;
        coverageAmount: number;
        expiryDate: Date;
    };
    certifications?: string[];
    preferredVendor: boolean;
    accountNumber?: string;
    creditTerms?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Carrier API credentials and configuration
 */
export interface CarrierCredentials {
    credentialId: string;
    carrierId: string;
    integrationType: IntegrationType;
    apiEndpoint?: string;
    apiKey?: string;
    accountNumber?: string;
    username?: string;
    password?: string;
    clientId?: string;
    clientSecret?: string;
    accessToken?: string;
    refreshToken?: string;
    tokenExpiresAt?: Date;
    testMode: boolean;
    rateLimitPerMinute?: number;
    timeout?: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Carrier service level definition
 */
export interface CarrierService {
    serviceId: string;
    carrierId: string;
    serviceCode: string;
    name: string;
    description?: string;
    serviceLevel: ServiceLevel;
    transportMode: TransportMode;
    transitDays: {
        min: number;
        max: number;
    };
    cutoffTime?: string;
    availableDays?: number[];
    requiresSignature?: boolean;
    insuranceIncluded?: boolean;
    trackingAvailable: boolean;
    international: boolean;
    restrictions?: {
        maxWeight?: number;
        maxLength?: number;
        maxWidth?: number;
        maxHeight?: number;
        prohibitedItems?: string[];
    };
    active: boolean;
    metadata?: Record<string, any>;
}
/**
 * Rate table structure
 */
export interface RateTable {
    rateTableId: string;
    carrierId: string;
    serviceId: string;
    name: string;
    calculationType: RateCalculationType;
    effectiveDate: Date;
    expiryDate?: Date;
    currency: string;
    zones?: ZoneDefinition[];
    weightBreaks?: WeightBreak[];
    baseRates?: BaseRate[];
    surcharges?: Surcharge[];
    accessorials?: Accessorial[];
    minimumCharge?: number;
    active: boolean;
    metadata?: Record<string, any>;
}
/**
 * Zone definition for zone-based rating
 */
export interface ZoneDefinition {
    zoneId: string;
    zoneName: string;
    originPostalCodes?: string[];
    destinationPostalCodes?: string[];
    originRegions?: string[];
    destinationRegions?: string[];
}
/**
 * Weight break tiers
 */
export interface WeightBreak {
    minWeight: number;
    maxWeight: number;
    unit: 'LBS' | 'KG';
    rate: number;
    perUnit?: 'LBS' | 'KG' | 'CWT' | 'SHIPMENT';
}
/**
 * Base rate structure
 */
export interface BaseRate {
    zoneId?: string;
    minWeight?: number;
    maxWeight?: number;
    minDistance?: number;
    maxDistance?: number;
    rate: number;
    perUnit?: string;
}
/**
 * Surcharge definitions
 */
export interface Surcharge {
    surchargeId: string;
    name: string;
    type: 'PERCENTAGE' | 'FLAT' | 'PER_UNIT';
    amount: number;
    applicableConditions?: {
        fuelSurcharge?: boolean;
        residential?: boolean;
        extendedArea?: boolean;
        oversize?: boolean;
        hazmat?: boolean;
    };
}
/**
 * Accessorial charges
 */
export interface Accessorial {
    accessorialId: string;
    code: string;
    name: string;
    description?: string;
    charge: number;
    chargeType: 'FLAT' | 'PERCENTAGE' | 'PER_UNIT';
    optional: boolean;
}
/**
 * Shipment rating request
 */
export interface RatingRequest {
    originPostalCode: string;
    destinationPostalCode: string;
    originCountry?: string;
    destinationCountry?: string;
    originCity?: string;
    destinationCity?: string;
    originState?: string;
    destinationState?: string;
    residential?: boolean;
    packages: PackageDetails[];
    serviceLevel?: ServiceLevel;
    transportMode?: TransportMode;
    shipDate?: Date;
    declaredValue?: number;
    insuranceRequired?: boolean;
    signatureRequired?: boolean;
    accessorials?: string[];
    carrierIds?: string[];
}
/**
 * Package details for rating
 */
export interface PackageDetails {
    weight: number;
    weightUnit: 'LBS' | 'KG';
    length?: number;
    width?: number;
    height?: number;
    dimensionUnit?: 'IN' | 'CM';
    quantity?: number;
    packageType?: 'BOX' | 'ENVELOPE' | 'PALLET' | 'TUBE' | 'CUSTOM';
    freightClass?: string;
}
/**
 * Rate quote response
 */
export interface RateQuote {
    quoteId: string;
    carrierId: string;
    carrierName: string;
    serviceId: string;
    serviceName: string;
    serviceLevel: ServiceLevel;
    transportMode: TransportMode;
    baseRate: number;
    surcharges: Array<{
        name: string;
        amount: number;
    }>;
    accessorialCharges: Array<{
        name: string;
        amount: number;
    }>;
    fuelSurcharge: number;
    totalCost: number;
    currency: string;
    estimatedTransitDays: number;
    estimatedDeliveryDate?: Date;
    guaranteedDelivery: boolean;
    trackingAvailable: boolean;
    validUntil: Date;
    metadata?: Record<string, any>;
}
/**
 * Multi-carrier rate shopping result
 */
export interface RateShoppingResult {
    requestId: string;
    request: RatingRequest;
    quotes: RateQuote[];
    cheapestQuote?: RateQuote;
    fastestQuote?: RateQuote;
    recommendedQuote?: RateQuote;
    quotedAt: Date;
    validUntil: Date;
}
/**
 * Carrier performance tracking
 */
export interface CarrierPerformance {
    performanceId: string;
    carrierId: string;
    period: {
        startDate: Date;
        endDate: Date;
    };
    metrics: {
        totalShipments: number;
        onTimeDeliveries: number;
        onTimePercentage: number;
        averageTransitDays: number;
        deliveryExceptions: number;
        exceptionRate: number;
        damageIncidents: number;
        damageRate: number;
        lostShipments: number;
        lossRate: number;
        totalCost: number;
        averageCostPerShipment: number;
        costVariance: number;
        customerSatisfactionScore?: number;
    };
    slaCompliance: {
        slaTarget: number;
        slaActual: number;
        slaMetPercentage: number;
    };
    recommendations?: string[];
}
/**
 * Performance event tracking
 */
export interface PerformanceEvent {
    eventId: string;
    carrierId: string;
    shipmentId: string;
    metricType: PerformanceMetric;
    expectedValue?: any;
    actualValue: any;
    variance?: number;
    impactScore: number;
    timestamp: Date;
    notes?: string;
}
/**
 * Carrier selection criteria
 */
export interface CarrierSelectionCriteria {
    prioritizeCost?: boolean;
    prioritizeSpeed?: boolean;
    prioritizeReliability?: boolean;
    maxCost?: number;
    maxTransitDays?: number;
    minOnTimePercentage?: number;
    requiredServices?: string[];
    preferredCarriers?: string[];
    excludedCarriers?: string[];
    weights?: {
        cost: number;
        speed: number;
        reliability: number;
        performance: number;
    };
}
/**
 * 1. Creates a new carrier profile.
 *
 * @param {Partial<CarrierProfile>} data - Carrier profile data
 * @returns {CarrierProfile} Created carrier profile
 *
 * @example
 * ```typescript
 * const carrier = createCarrierProfile({
 *   name: 'FedEx Corporation',
 *   carrierCode: 'FEDEX',
 *   scac: 'FDEG',
 *   supportedModes: [TransportMode.PARCEL, TransportMode.AIR],
 *   contactInfo: {
 *     email: 'support@fedex.com',
 *     phone: '1-800-463-3339',
 *     website: 'https://www.fedex.com'
 *   }
 * });
 * ```
 */
export declare function createCarrierProfile(data: Partial<CarrierProfile>): CarrierProfile;
/**
 * 2. Updates carrier profile information.
 *
 * @param {CarrierProfile} carrier - Existing carrier profile
 * @param {Partial<CarrierProfile>} updates - Fields to update
 * @returns {CarrierProfile} Updated carrier profile
 *
 * @example
 * ```typescript
 * const updated = updateCarrierProfile(carrier, {
 *   status: CarrierStatus.ACTIVE,
 *   preferredVendor: true
 * });
 * ```
 */
export declare function updateCarrierProfile(carrier: CarrierProfile, updates: Partial<CarrierProfile>): CarrierProfile;
/**
 * 3. Validates carrier profile completeness.
 *
 * @param {CarrierProfile} carrier - Carrier profile to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateCarrierProfile(carrier);
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export declare function validateCarrierProfile(carrier: CarrierProfile): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * 4. Activates a carrier profile.
 *
 * @param {CarrierProfile} carrier - Carrier profile to activate
 * @returns {CarrierProfile} Activated carrier profile
 *
 * @example
 * ```typescript
 * const active = activateCarrier(carrier);
 * ```
 */
export declare function activateCarrier(carrier: CarrierProfile): CarrierProfile;
/**
 * 5. Suspends a carrier profile.
 *
 * @param {CarrierProfile} carrier - Carrier profile to suspend
 * @param {string} reason - Suspension reason
 * @returns {CarrierProfile} Suspended carrier profile
 *
 * @example
 * ```typescript
 * const suspended = suspendCarrier(carrier, 'Insurance expired');
 * ```
 */
export declare function suspendCarrier(carrier: CarrierProfile, reason: string): CarrierProfile;
/**
 * 6. Deactivates a carrier profile.
 *
 * @param {CarrierProfile} carrier - Carrier profile to deactivate
 * @param {string} reason - Deactivation reason
 * @returns {CarrierProfile} Deactivated carrier profile
 *
 * @example
 * ```typescript
 * const deactivated = deactivateCarrier(carrier, 'Contract terminated');
 * ```
 */
export declare function deactivateCarrier(carrier: CarrierProfile, reason: string): CarrierProfile;
/**
 * 7. Configures carrier API credentials.
 *
 * @param {string} carrierId - Carrier ID
 * @param {Partial<CarrierCredentials>} credentials - API credentials
 * @returns {CarrierCredentials} Configured credentials
 *
 * @example
 * ```typescript
 * const creds = configureCarrierCredentials('CARRIER-001', {
 *   integrationType: IntegrationType.REST_API,
 *   apiEndpoint: 'https://api.carrier.com/v1',
 *   apiKey: 'sk_live_...',
 *   testMode: false
 * });
 * ```
 */
export declare function configureCarrierCredentials(carrierId: string, credentials: Partial<CarrierCredentials>): CarrierCredentials;
/**
 * 8. Tests carrier API connectivity.
 *
 * @param {CarrierCredentials} credentials - Carrier API credentials
 * @returns {Promise<object>} Connection test result
 *
 * @example
 * ```typescript
 * const result = await testCarrierConnection(credentials);
 * if (result.success) {
 *   console.log('Connection successful:', result.responseTime);
 * }
 * ```
 */
export declare function testCarrierConnection(credentials: CarrierCredentials): Promise<{
    success: boolean;
    responseTime?: number;
    apiVersion?: string;
    error?: string;
    timestamp: Date;
}>;
/**
 * 9. Creates a carrier service level.
 *
 * @param {string} carrierId - Carrier ID
 * @param {Partial<CarrierService>} data - Service level data
 * @returns {CarrierService} Created service level
 *
 * @example
 * ```typescript
 * const service = createCarrierService('CARRIER-001', {
 *   serviceCode: 'PRIORITY_OVERNIGHT',
 *   name: 'FedEx Priority Overnight',
 *   serviceLevel: ServiceLevel.NEXT_DAY,
 *   transportMode: TransportMode.AIR,
 *   transitDays: { min: 1, max: 1 },
 *   trackingAvailable: true
 * });
 * ```
 */
export declare function createCarrierService(carrierId: string, data: Partial<CarrierService>): CarrierService;
/**
 * 10. Updates carrier service level.
 *
 * @param {CarrierService} service - Existing service
 * @param {Partial<CarrierService>} updates - Fields to update
 * @returns {CarrierService} Updated service level
 *
 * @example
 * ```typescript
 * const updated = updateCarrierService(service, {
 *   transitDays: { min: 1, max: 2 },
 *   active: true
 * });
 * ```
 */
export declare function updateCarrierService(service: CarrierService, updates: Partial<CarrierService>): CarrierService;
/**
 * 11. Validates service level configuration.
 *
 * @param {CarrierService} service - Service to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateCarrierService(service);
 * if (!result.valid) {
 *   console.error('Errors:', result.errors);
 * }
 * ```
 */
export declare function validateCarrierService(service: CarrierService): {
    valid: boolean;
    errors: string[];
};
/**
 * 12. Finds services by criteria.
 *
 * @param {CarrierService[]} services - All services
 * @param {object} criteria - Search criteria
 * @returns {CarrierService[]} Matching services
 *
 * @example
 * ```typescript
 * const results = findServicesByCriteria(allServices, {
 *   carrierId: 'CARRIER-001',
 *   serviceLevel: ServiceLevel.NEXT_DAY,
 *   transportMode: TransportMode.AIR,
 *   active: true
 * });
 * ```
 */
export declare function findServicesByCriteria(services: CarrierService[], criteria: {
    carrierId?: string;
    serviceLevel?: ServiceLevel;
    transportMode?: TransportMode;
    international?: boolean;
    active?: boolean;
    maxTransitDays?: number;
}): CarrierService[];
/**
 * 13. Calculates service availability.
 *
 * @param {CarrierService} service - Service to check
 * @param {Date} shipDate - Proposed ship date
 * @returns {object} Availability result
 *
 * @example
 * ```typescript
 * const availability = calculateServiceAvailability(service, new Date());
 * if (availability.available) {
 *   console.log('Estimated delivery:', availability.estimatedDelivery);
 * }
 * ```
 */
export declare function calculateServiceAvailability(service: CarrierService, shipDate: Date): {
    available: boolean;
    reason?: string;
    estimatedDelivery?: Date;
    cutoffPassed?: boolean;
};
/**
 * 14. Checks service restrictions.
 *
 * @param {CarrierService} service - Service to check
 * @param {PackageDetails[]} packages - Package details
 * @returns {object} Restriction check result
 *
 * @example
 * ```typescript
 * const check = checkServiceRestrictions(service, packages);
 * if (!check.allowed) {
 *   console.error('Violations:', check.violations);
 * }
 * ```
 */
export declare function checkServiceRestrictions(service: CarrierService, packages: PackageDetails[]): {
    allowed: boolean;
    violations: string[];
};
/**
 * 15. Compares service levels.
 *
 * @param {CarrierService[]} services - Services to compare
 * @returns {object} Comparison matrix
 *
 * @example
 * ```typescript
 * const comparison = compareServiceLevels([service1, service2, service3]);
 * ```
 */
export declare function compareServiceLevels(services: CarrierService[]): {
    services: Array<{
        serviceId: string;
        name: string;
        transportMode: TransportMode;
        transitDays: string;
        trackingAvailable: boolean;
        signature: boolean;
        insurance: boolean;
    }>;
    fastest: CarrierService;
    mostReliable: CarrierService;
};
/**
 * 16. Maps service levels across carriers.
 *
 * @param {CarrierService[]} services - All services
 * @returns {Map<ServiceLevel, CarrierService[]>} Services grouped by level
 *
 * @example
 * ```typescript
 * const mapped = mapServiceLevelsByType(allServices);
 * const nextDayServices = mapped.get(ServiceLevel.NEXT_DAY);
 * ```
 */
export declare function mapServiceLevelsByType(services: CarrierService[]): Map<ServiceLevel, CarrierService[]>;
/**
 * 17. Generates service level matrix.
 *
 * @param {string} carrierId - Carrier ID
 * @param {CarrierService[]} services - Carrier services
 * @returns {object} Service matrix
 *
 * @example
 * ```typescript
 * const matrix = generateServiceMatrix('CARRIER-001', carrierServices);
 * ```
 */
export declare function generateServiceMatrix(carrierId: string, services: CarrierService[]): {
    carrierId: string;
    totalServices: number;
    byServiceLevel: Record<ServiceLevel, number>;
    byTransportMode: Record<TransportMode, number>;
    internationalAvailable: boolean;
    trackingCoverage: number;
};
/**
 * 18. Creates a rate table.
 *
 * @param {string} carrierId - Carrier ID
 * @param {string} serviceId - Service ID
 * @param {Partial<RateTable>} data - Rate table data
 * @returns {RateTable} Created rate table
 *
 * @example
 * ```typescript
 * const rateTable = createRateTable('CARRIER-001', 'SERVICE-001', {
 *   name: 'Q1 2024 Rates',
 *   calculationType: RateCalculationType.ZONE_BASED,
 *   effectiveDate: new Date('2024-01-01'),
 *   currency: 'USD',
 *   minimumCharge: 10.00
 * });
 * ```
 */
export declare function createRateTable(carrierId: string, serviceId: string, data: Partial<RateTable>): RateTable;
/**
 * 19. Updates rate table.
 *
 * @param {RateTable} rateTable - Existing rate table
 * @param {Partial<RateTable>} updates - Fields to update
 * @returns {RateTable} Updated rate table
 *
 * @example
 * ```typescript
 * const updated = updateRateTable(rateTable, {
 *   expiryDate: new Date('2024-12-31'),
 *   active: true
 * });
 * ```
 */
export declare function updateRateTable(rateTable: RateTable, updates: Partial<RateTable>): RateTable;
/**
 * 20. Adds zone definition to rate table.
 *
 * @param {RateTable} rateTable - Rate table
 * @param {ZoneDefinition} zone - Zone to add
 * @returns {RateTable} Updated rate table
 *
 * @example
 * ```typescript
 * const updated = addZoneToRateTable(rateTable, {
 *   zoneId: 'ZONE-1',
 *   zoneName: 'Zone 1',
 *   originPostalCodes: ['90001-90999'],
 *   destinationPostalCodes: ['10001-19999']
 * });
 * ```
 */
export declare function addZoneToRateTable(rateTable: RateTable, zone: ZoneDefinition): RateTable;
/**
 * 21. Adds weight break to rate table.
 *
 * @param {RateTable} rateTable - Rate table
 * @param {WeightBreak} weightBreak - Weight break to add
 * @returns {RateTable} Updated rate table
 *
 * @example
 * ```typescript
 * const updated = addWeightBreakToRateTable(rateTable, {
 *   minWeight: 0,
 *   maxWeight: 50,
 *   unit: 'LBS',
 *   rate: 15.00,
 *   perUnit: 'SHIPMENT'
 * });
 * ```
 */
export declare function addWeightBreakToRateTable(rateTable: RateTable, weightBreak: WeightBreak): RateTable;
/**
 * 22. Adds surcharge to rate table.
 *
 * @param {RateTable} rateTable - Rate table
 * @param {Surcharge} surcharge - Surcharge to add
 * @returns {RateTable} Updated rate table
 *
 * @example
 * ```typescript
 * const updated = addSurchargeToRateTable(rateTable, {
 *   surchargeId: crypto.randomUUID(),
 *   name: 'Fuel Surcharge',
 *   type: 'PERCENTAGE',
 *   amount: 0.085,
 *   applicableConditions: { fuelSurcharge: true }
 * });
 * ```
 */
export declare function addSurchargeToRateTable(rateTable: RateTable, surcharge: Surcharge): RateTable;
/**
 * 23. Adds accessorial charge to rate table.
 *
 * @param {RateTable} rateTable - Rate table
 * @param {Accessorial} accessorial - Accessorial to add
 * @returns {RateTable} Updated rate table
 *
 * @example
 * ```typescript
 * const updated = addAccessorialToRateTable(rateTable, {
 *   accessorialId: crypto.randomUUID(),
 *   code: 'RES',
 *   name: 'Residential Delivery',
 *   charge: 5.00,
 *   chargeType: 'FLAT',
 *   optional: false
 * });
 * ```
 */
export declare function addAccessorialToRateTable(rateTable: RateTable, accessorial: Accessorial): RateTable;
/**
 * 24. Validates rate table completeness.
 *
 * @param {RateTable} rateTable - Rate table to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateRateTable(rateTable);
 * if (!result.valid) {
 *   console.error('Errors:', result.errors);
 * }
 * ```
 */
export declare function validateRateTable(rateTable: RateTable): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * 25. Finds applicable rate table.
 *
 * @param {RateTable[]} rateTables - All rate tables
 * @param {string} serviceId - Service ID
 * @param {Date} shipDate - Ship date
 * @returns {RateTable | null} Applicable rate table
 *
 * @example
 * ```typescript
 * const rateTable = findApplicableRateTable(allRateTables, 'SERVICE-001', new Date());
 * if (rateTable) {
 *   console.log('Using rate table:', rateTable.name);
 * }
 * ```
 */
export declare function findApplicableRateTable(rateTables: RateTable[], serviceId: string, shipDate: Date): RateTable | null;
/**
 * 26. Calculates base rate from rate table.
 *
 * @param {RateTable} rateTable - Rate table
 * @param {RatingRequest} request - Rating request
 * @returns {number} Base rate
 *
 * @example
 * ```typescript
 * const baseRate = calculateBaseRate(rateTable, ratingRequest);
 * ```
 */
export declare function calculateBaseRate(rateTable: RateTable, request: RatingRequest): number;
/**
 * 27. Calculates dimensional weight.
 *
 * @param {PackageDetails} pkg - Package details
 * @param {number} dimFactor - Dimensional factor (default 139 for inches/lbs)
 * @returns {number} Dimensional weight in lbs
 *
 * @example
 * ```typescript
 * const dimWeight = calculateDimensionalWeight(package, 139);
 * ```
 */
export declare function calculateDimensionalWeight(pkg: PackageDetails, dimFactor?: number): number;
/**
 * 28. Calculates applicable surcharges.
 *
 * @param {RateTable} rateTable - Rate table
 * @param {number} baseRate - Base rate
 * @param {RatingRequest} request - Rating request
 * @returns {Array<{name: string, amount: number}>} Surcharges
 *
 * @example
 * ```typescript
 * const surcharges = calculateSurcharges(rateTable, 50.00, request);
 * ```
 */
export declare function calculateSurcharges(rateTable: RateTable, baseRate: number, request: RatingRequest): Array<{
    name: string;
    amount: number;
}>;
/**
 * 29. Calculates accessorial charges.
 *
 * @param {RateTable} rateTable - Rate table
 * @param {number} baseRate - Base rate
 * @param {string[]} requestedAccessorials - Requested accessorial codes
 * @returns {Array<{name: string, amount: number}>} Accessorial charges
 *
 * @example
 * ```typescript
 * const accessorials = calculateAccessorialCharges(rateTable, 50.00, ['RES', 'SIG']);
 * ```
 */
export declare function calculateAccessorialCharges(rateTable: RateTable, baseRate: number, requestedAccessorials?: string[]): Array<{
    name: string;
    amount: number;
}>;
/**
 * 30. Generates single carrier rate quote.
 *
 * @param {CarrierProfile} carrier - Carrier profile
 * @param {CarrierService} service - Service level
 * @param {RateTable} rateTable - Rate table
 * @param {RatingRequest} request - Rating request
 * @returns {RateQuote} Rate quote
 *
 * @example
 * ```typescript
 * const quote = generateCarrierQuote(carrier, service, rateTable, request);
 * console.log('Total cost:', quote.totalCost);
 * ```
 */
export declare function generateCarrierQuote(carrier: CarrierProfile, service: CarrierService, rateTable: RateTable, request: RatingRequest): RateQuote;
/**
 * 31. Performs multi-carrier rate shopping.
 *
 * @param {RatingRequest} request - Rating request
 * @param {CarrierProfile[]} carriers - Active carriers
 * @param {CarrierService[]} services - Available services
 * @param {RateTable[]} rateTables - Rate tables
 * @returns {RateShoppingResult} Rate shopping result with all quotes
 *
 * @example
 * ```typescript
 * const result = performRateShopping(request, carriers, services, rateTables);
 * console.log('Cheapest:', result.cheapestQuote);
 * console.log('Fastest:', result.fastestQuote);
 * ```
 */
export declare function performRateShopping(request: RatingRequest, carriers: CarrierProfile[], services: CarrierService[], rateTables: RateTable[]): RateShoppingResult;
/**
 * 32. Selects optimal carrier based on criteria.
 *
 * @param {RateShoppingResult} shoppingResult - Rate shopping result
 * @param {CarrierSelectionCriteria} criteria - Selection criteria
 * @param {Map<string, CarrierPerformance>} performanceData - Historical performance
 * @returns {RateQuote | null} Selected quote
 *
 * @example
 * ```typescript
 * const selected = selectOptimalCarrier(shoppingResult, {
 *   prioritizeCost: false,
 *   prioritizeSpeed: true,
 *   minOnTimePercentage: 95
 * }, performanceMap);
 * ```
 */
export declare function selectOptimalCarrier(shoppingResult: RateShoppingResult, criteria: CarrierSelectionCriteria, performanceData?: Map<string, CarrierPerformance>): RateQuote | null;
/**
 * 33. Compares rate quotes side-by-side.
 *
 * @param {RateQuote[]} quotes - Quotes to compare
 * @returns {object} Comparison analysis
 *
 * @example
 * ```typescript
 * const comparison = compareRateQuotes([quote1, quote2, quote3]);
 * console.log('Cost range:', comparison.costRange);
 * console.log('Transit range:', comparison.transitRange);
 * ```
 */
export declare function compareRateQuotes(quotes: RateQuote[]): {
    totalQuotes: number;
    costRange: {
        min: number;
        max: number;
        average: number;
    };
    transitRange: {
        min: number;
        max: number;
        average: number;
    };
    carriers: string[];
    savings: {
        amount: number;
        percentage: number;
    };
    breakdown: Array<{
        carrier: string;
        service: string;
        cost: number;
        transitDays: number;
        costRank: number;
        speedRank: number;
    }>;
};
/**
 * 34. Records carrier performance event.
 *
 * @param {string} carrierId - Carrier ID
 * @param {string} shipmentId - Shipment ID
 * @param {PerformanceMetric} metricType - Metric type
 * @param {any} actualValue - Actual value
 * @param {any} expectedValue - Expected value (optional)
 * @returns {PerformanceEvent} Performance event
 *
 * @example
 * ```typescript
 * const event = recordPerformanceEvent(
 *   'CARRIER-001',
 *   'SHIP-12345',
 *   PerformanceMetric.ON_TIME_DELIVERY,
 *   false
 * );
 * ```
 */
export declare function recordPerformanceEvent(carrierId: string, shipmentId: string, metricType: PerformanceMetric, actualValue: any, expectedValue?: any): PerformanceEvent;
/**
 * 35. Calculates carrier performance metrics for a period.
 *
 * @param {string} carrierId - Carrier ID
 * @param {PerformanceEvent[]} events - Performance events
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @returns {CarrierPerformance} Performance metrics
 *
 * @example
 * ```typescript
 * const performance = calculateCarrierPerformance(
 *   'CARRIER-001',
 *   events,
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
export declare function calculateCarrierPerformance(carrierId: string, events: PerformanceEvent[], startDate: Date, endDate: Date): CarrierPerformance;
/**
 * 36. Compares carrier performance across multiple carriers.
 *
 * @param {CarrierPerformance[]} performances - Carrier performances
 * @returns {object} Comparative analysis
 *
 * @example
 * ```typescript
 * const comparison = compareCarrierPerformance([perf1, perf2, perf3]);
 * console.log('Best performer:', comparison.bestPerformer);
 * ```
 */
export declare function compareCarrierPerformance(performances: CarrierPerformance[]): {
    carriers: number;
    averageOnTimePercentage: number;
    bestPerformer: {
        carrierId: string;
        onTimePercentage: number;
    };
    worstPerformer: {
        carrierId: string;
        onTimePercentage: number;
    };
    lowestCost: {
        carrierId: string;
        averageCost: number;
    };
    highestCost: {
        carrierId: string;
        averageCost: number;
    };
    rankings: Array<{
        carrierId: string;
        onTimeRank: number;
        costRank: number;
        overallScore: number;
    }>;
};
/**
 * 37. Generates carrier scorecard.
 *
 * @param {CarrierPerformance} performance - Carrier performance
 * @returns {object} Scorecard with grades
 *
 * @example
 * ```typescript
 * const scorecard = generateCarrierScorecard(performance);
 * console.log('Overall grade:', scorecard.overallGrade);
 * ```
 */
export declare function generateCarrierScorecard(performance: CarrierPerformance): {
    carrierId: string;
    period: string;
    grades: {
        onTime: string;
        reliability: string;
        cost: string;
        quality: string;
    };
    scores: {
        onTime: number;
        reliability: number;
        cost: number;
        quality: number;
    };
    overallScore: number;
    overallGrade: string;
    strengths: string[];
    weaknesses: string[];
};
/**
 * 38. Tracks carrier SLA compliance.
 *
 * @param {CarrierPerformance} performance - Carrier performance
 * @param {object} slaTargets - SLA targets
 * @returns {object} SLA compliance report
 *
 * @example
 * ```typescript
 * const compliance = trackCarrierSLA(performance, {
 *   onTimeTarget: 95,
 *   maxExceptionRate: 5,
 *   maxDamageRate: 1
 * });
 * ```
 */
export declare function trackCarrierSLA(performance: CarrierPerformance, slaTargets: {
    onTimeTarget: number;
    maxExceptionRate?: number;
    maxDamageRate?: number;
    maxLossRate?: number;
}): {
    compliant: boolean;
    violations: Array<{
        metric: string;
        target: number;
        actual: number;
        variance: number;
    }>;
    compliancePercentage: number;
};
/**
 * 39. Identifies carrier performance trends.
 *
 * @param {CarrierPerformance[]} historicalPerformance - Historical performance data
 * @returns {object} Trend analysis
 *
 * @example
 * ```typescript
 * const trends = identifyPerformanceTrends(historicalData);
 * console.log('On-time trend:', trends.onTimeTrend);
 * ```
 */
export declare function identifyPerformanceTrends(historicalPerformance: CarrierPerformance[]): {
    dataPoints: number;
    onTimeTrend: 'IMPROVING' | 'DECLINING' | 'STABLE';
    costTrend: 'IMPROVING' | 'DECLINING' | 'STABLE';
    qualityTrend: 'IMPROVING' | 'DECLINING' | 'STABLE';
    onTimeChange: number;
    costChange: number;
    damageRateChange: number;
    recommendations: string[];
};
/**
 * 40. Calculates cost savings from carrier optimization.
 *
 * @param {RateShoppingResult[]} historicalShoppings - Historical rate shopping results
 * @param {string[]} selectedCarrierIds - Actually selected carriers
 * @returns {object} Cost savings analysis
 *
 * @example
 * ```typescript
 * const savings = calculateCarrierCostSavings(shoppingHistory, selectedCarriers);
 * console.log('Total savings:', savings.totalSavings);
 * ```
 */
export declare function calculateCarrierCostSavings(historicalShoppings: RateShoppingResult[], selectedCarrierIds: string[]): {
    totalShipments: number;
    totalSavings: number;
    averageSavingsPerShipment: number;
    savingsPercentage: number;
    bestAlternativeSavings: number;
    breakdown: Array<{
        requestId: string;
        selectedCost: number;
        cheapestCost: number;
        savings: number;
        optimal: boolean;
    }>;
};
/**
 * 41. Generates carrier performance report.
 *
 * @param {string} carrierId - Carrier ID
 * @param {CarrierProfile} carrier - Carrier profile
 * @param {CarrierPerformance} performance - Performance data
 * @returns {object} Comprehensive performance report
 *
 * @example
 * ```typescript
 * const report = generateCarrierPerformanceReport('CARRIER-001', carrier, performance);
 * console.log(JSON.stringify(report, null, 2));
 * ```
 */
export declare function generateCarrierPerformanceReport(carrierId: string, carrier: CarrierProfile, performance: CarrierPerformance): {
    reportId: string;
    generatedAt: Date;
    carrier: {
        id: string;
        name: string;
        scac: string;
        status: CarrierStatus;
    };
    period: {
        startDate: string;
        endDate: string;
        days: number;
    };
    summary: {
        totalShipments: number;
        onTimePercentage: number;
        averageTransitDays: number;
        totalCost: number;
        averageCostPerShipment: number;
    };
    performance: {
        onTimeDeliveries: number;
        deliveryExceptions: number;
        exceptionRate: number;
        damageIncidents: number;
        damageRate: number;
        lostShipments: number;
        lossRate: number;
    };
    sla: {
        target: number;
        actual: number;
        compliance: number;
        met: boolean;
    };
    scorecard: ReturnType<typeof generateCarrierScorecard>;
    recommendations: string[];
};
declare const _default: {
    createCarrierProfile: typeof createCarrierProfile;
    updateCarrierProfile: typeof updateCarrierProfile;
    validateCarrierProfile: typeof validateCarrierProfile;
    activateCarrier: typeof activateCarrier;
    suspendCarrier: typeof suspendCarrier;
    deactivateCarrier: typeof deactivateCarrier;
    configureCarrierCredentials: typeof configureCarrierCredentials;
    testCarrierConnection: typeof testCarrierConnection;
    createCarrierService: typeof createCarrierService;
    updateCarrierService: typeof updateCarrierService;
    validateCarrierService: typeof validateCarrierService;
    findServicesByCriteria: typeof findServicesByCriteria;
    calculateServiceAvailability: typeof calculateServiceAvailability;
    checkServiceRestrictions: typeof checkServiceRestrictions;
    compareServiceLevels: typeof compareServiceLevels;
    mapServiceLevelsByType: typeof mapServiceLevelsByType;
    generateServiceMatrix: typeof generateServiceMatrix;
    createRateTable: typeof createRateTable;
    updateRateTable: typeof updateRateTable;
    addZoneToRateTable: typeof addZoneToRateTable;
    addWeightBreakToRateTable: typeof addWeightBreakToRateTable;
    addSurchargeToRateTable: typeof addSurchargeToRateTable;
    addAccessorialToRateTable: typeof addAccessorialToRateTable;
    validateRateTable: typeof validateRateTable;
    findApplicableRateTable: typeof findApplicableRateTable;
    calculateBaseRate: typeof calculateBaseRate;
    calculateDimensionalWeight: typeof calculateDimensionalWeight;
    calculateSurcharges: typeof calculateSurcharges;
    calculateAccessorialCharges: typeof calculateAccessorialCharges;
    generateCarrierQuote: typeof generateCarrierQuote;
    performRateShopping: typeof performRateShopping;
    selectOptimalCarrier: typeof selectOptimalCarrier;
    compareRateQuotes: typeof compareRateQuotes;
    recordPerformanceEvent: typeof recordPerformanceEvent;
    calculateCarrierPerformance: typeof calculateCarrierPerformance;
    compareCarrierPerformance: typeof compareCarrierPerformance;
    generateCarrierScorecard: typeof generateCarrierScorecard;
    trackCarrierSLA: typeof trackCarrierSLA;
    identifyPerformanceTrends: typeof identifyPerformanceTrends;
    calculateCarrierCostSavings: typeof calculateCarrierCostSavings;
    generateCarrierPerformanceReport: typeof generateCarrierPerformanceReport;
};
export default _default;
//# sourceMappingURL=transportation-carrier-management-kit.d.ts.map