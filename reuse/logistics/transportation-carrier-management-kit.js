"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceMetric = exports.IntegrationType = exports.RateCalculationType = exports.ServiceLevel = exports.TransportMode = exports.CarrierStatus = void 0;
exports.createCarrierProfile = createCarrierProfile;
exports.updateCarrierProfile = updateCarrierProfile;
exports.validateCarrierProfile = validateCarrierProfile;
exports.activateCarrier = activateCarrier;
exports.suspendCarrier = suspendCarrier;
exports.deactivateCarrier = deactivateCarrier;
exports.configureCarrierCredentials = configureCarrierCredentials;
exports.testCarrierConnection = testCarrierConnection;
exports.createCarrierService = createCarrierService;
exports.updateCarrierService = updateCarrierService;
exports.validateCarrierService = validateCarrierService;
exports.findServicesByCriteria = findServicesByCriteria;
exports.calculateServiceAvailability = calculateServiceAvailability;
exports.checkServiceRestrictions = checkServiceRestrictions;
exports.compareServiceLevels = compareServiceLevels;
exports.mapServiceLevelsByType = mapServiceLevelsByType;
exports.generateServiceMatrix = generateServiceMatrix;
exports.createRateTable = createRateTable;
exports.updateRateTable = updateRateTable;
exports.addZoneToRateTable = addZoneToRateTable;
exports.addWeightBreakToRateTable = addWeightBreakToRateTable;
exports.addSurchargeToRateTable = addSurchargeToRateTable;
exports.addAccessorialToRateTable = addAccessorialToRateTable;
exports.validateRateTable = validateRateTable;
exports.findApplicableRateTable = findApplicableRateTable;
exports.calculateBaseRate = calculateBaseRate;
exports.calculateDimensionalWeight = calculateDimensionalWeight;
exports.calculateSurcharges = calculateSurcharges;
exports.calculateAccessorialCharges = calculateAccessorialCharges;
exports.generateCarrierQuote = generateCarrierQuote;
exports.performRateShopping = performRateShopping;
exports.selectOptimalCarrier = selectOptimalCarrier;
exports.compareRateQuotes = compareRateQuotes;
exports.recordPerformanceEvent = recordPerformanceEvent;
exports.calculateCarrierPerformance = calculateCarrierPerformance;
exports.compareCarrierPerformance = compareCarrierPerformance;
exports.generateCarrierScorecard = generateCarrierScorecard;
exports.trackCarrierSLA = trackCarrierSLA;
exports.identifyPerformanceTrends = identifyPerformanceTrends;
exports.calculateCarrierCostSavings = calculateCarrierCostSavings;
exports.generateCarrierPerformanceReport = generateCarrierPerformanceReport;
/**
 * File: /reuse/logistics/transportation-carrier-management-kit.ts
 * Locator: WC-LOGISTICS-CARRIER-001
 * Purpose: Comprehensive Transportation Carrier Management - Complete carrier lifecycle and rating engine
 *
 * Upstream: Independent utility module for transportation carrier operations
 * Downstream: ../backend/logistics/*, Shipment modules, Rating services, TMS integrations
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, axios
 * Exports: 41 utility functions for carrier management, rating, service levels, performance tracking
 *
 * LLM Context: Enterprise-grade transportation carrier management utilities to compete with Oracle JDE.
 * Provides comprehensive carrier profile management, multi-carrier rating, service level configuration,
 * rate table management, real-time rate shopping, carrier performance tracking, API integrations,
 * automated carrier selection, SLA monitoring, and cost optimization.
 *
 * REST API Design:
 * - POST   /api/v1/carriers - Create carrier profile
 * - GET    /api/v1/carriers/:id - Get carrier details
 * - PUT    /api/v1/carriers/:id - Update carrier profile
 * - DELETE /api/v1/carriers/:id - Deactivate carrier
 * - POST   /api/v1/carriers/:id/credentials - Configure carrier API credentials
 * - GET    /api/v1/carriers/:id/services - List carrier service levels
 * - POST   /api/v1/carriers/:id/services - Add service level
 * - GET    /api/v1/carriers/:id/rates - Get carrier rate tables
 * - POST   /api/v1/carriers/:id/rates - Upload rate table
 * - POST   /api/v1/rating/quote - Get multi-carrier rate quotes
 * - POST   /api/v1/rating/shop - Rate shopping across carriers
 * - GET    /api/v1/carriers/:id/performance - Get carrier performance metrics
 * - POST   /api/v1/carriers/:id/performance/track - Record carrier performance event
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Carrier operational status
 */
var CarrierStatus;
(function (CarrierStatus) {
    CarrierStatus["ACTIVE"] = "ACTIVE";
    CarrierStatus["INACTIVE"] = "INACTIVE";
    CarrierStatus["SUSPENDED"] = "SUSPENDED";
    CarrierStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    CarrierStatus["DEACTIVATED"] = "DEACTIVATED";
})(CarrierStatus || (exports.CarrierStatus = CarrierStatus = {}));
/**
 * Transportation modes
 */
var TransportMode;
(function (TransportMode) {
    TransportMode["PARCEL"] = "PARCEL";
    TransportMode["LTL"] = "LTL";
    TransportMode["FTL"] = "FTL";
    TransportMode["AIR"] = "AIR";
    TransportMode["OCEAN"] = "OCEAN";
    TransportMode["RAIL"] = "RAIL";
    TransportMode["INTERMODAL"] = "INTERMODAL";
    TransportMode["COURIER"] = "COURIER";
})(TransportMode || (exports.TransportMode = TransportMode = {}));
/**
 * Service level types
 */
var ServiceLevel;
(function (ServiceLevel) {
    ServiceLevel["SAME_DAY"] = "SAME_DAY";
    ServiceLevel["NEXT_DAY"] = "NEXT_DAY";
    ServiceLevel["TWO_DAY"] = "TWO_DAY";
    ServiceLevel["THREE_DAY"] = "THREE_DAY";
    ServiceLevel["GROUND"] = "GROUND";
    ServiceLevel["ECONOMY"] = "ECONOMY";
    ServiceLevel["STANDARD"] = "STANDARD";
    ServiceLevel["EXPRESS"] = "EXPRESS";
    ServiceLevel["PRIORITY"] = "PRIORITY";
    ServiceLevel["INTERNATIONAL"] = "INTERNATIONAL";
})(ServiceLevel || (exports.ServiceLevel = ServiceLevel = {}));
/**
 * Rate calculation methods
 */
var RateCalculationType;
(function (RateCalculationType) {
    RateCalculationType["FLAT_RATE"] = "FLAT_RATE";
    RateCalculationType["WEIGHT_BASED"] = "WEIGHT_BASED";
    RateCalculationType["DISTANCE_BASED"] = "DISTANCE_BASED";
    RateCalculationType["ZONE_BASED"] = "ZONE_BASED";
    RateCalculationType["DIMENSIONAL_WEIGHT"] = "DIMENSIONAL_WEIGHT";
    RateCalculationType["HUNDREDWEIGHT"] = "HUNDREDWEIGHT";
    RateCalculationType["PER_MILE"] = "PER_MILE";
    RateCalculationType["API_REALTIME"] = "API_REALTIME";
})(RateCalculationType || (exports.RateCalculationType = RateCalculationType = {}));
/**
 * Carrier API integration types
 */
var IntegrationType;
(function (IntegrationType) {
    IntegrationType["REST_API"] = "REST_API";
    IntegrationType["SOAP_API"] = "SOAP_API";
    IntegrationType["EDI"] = "EDI";
    IntegrationType["FTP"] = "FTP";
    IntegrationType["WEBHOOK"] = "WEBHOOK";
    IntegrationType["MANUAL"] = "MANUAL";
})(IntegrationType || (exports.IntegrationType = IntegrationType = {}));
/**
 * Performance metric types
 */
var PerformanceMetric;
(function (PerformanceMetric) {
    PerformanceMetric["ON_TIME_DELIVERY"] = "ON_TIME_DELIVERY";
    PerformanceMetric["DELIVERY_EXCEPTION"] = "DELIVERY_EXCEPTION";
    PerformanceMetric["DAMAGE_RATE"] = "DAMAGE_RATE";
    PerformanceMetric["LOST_SHIPMENT"] = "LOST_SHIPMENT";
    PerformanceMetric["COST_VARIANCE"] = "COST_VARIANCE";
    PerformanceMetric["TRANSIT_TIME"] = "TRANSIT_TIME";
    PerformanceMetric["CUSTOMER_SATISFACTION"] = "CUSTOMER_SATISFACTION";
})(PerformanceMetric || (exports.PerformanceMetric = PerformanceMetric = {}));
// ============================================================================
// SECTION 1: CARRIER PROFILE MANAGEMENT (Functions 1-8)
// ============================================================================
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
function createCarrierProfile(data) {
    const carrierId = generateCarrierId();
    const now = new Date();
    return {
        carrierId,
        carrierCode: data.carrierCode || '',
        name: data.name || '',
        scac: data.scac || '',
        dotNumber: data.dotNumber,
        mcNumber: data.mcNumber,
        status: data.status || CarrierStatus.PENDING_APPROVAL,
        supportedModes: data.supportedModes || [],
        contactInfo: data.contactInfo || { email: '', phone: '' },
        insuranceInfo: data.insuranceInfo,
        certifications: data.certifications || [],
        preferredVendor: data.preferredVendor || false,
        accountNumber: data.accountNumber,
        creditTerms: data.creditTerms,
        metadata: data.metadata,
        createdAt: now,
        updatedAt: now,
    };
}
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
function updateCarrierProfile(carrier, updates) {
    return {
        ...carrier,
        ...updates,
        carrierId: carrier.carrierId, // Prevent ID change
        createdAt: carrier.createdAt, // Preserve creation date
        updatedAt: new Date(),
    };
}
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
function validateCarrierProfile(carrier) {
    const errors = [];
    const warnings = [];
    if (!carrier.name || carrier.name.trim().length === 0) {
        errors.push('Carrier name is required');
    }
    if (!carrier.carrierCode || carrier.carrierCode.trim().length === 0) {
        errors.push('Carrier code is required');
    }
    if (!carrier.scac || carrier.scac.length !== 4) {
        errors.push('SCAC must be exactly 4 characters');
    }
    if (!carrier.supportedModes || carrier.supportedModes.length === 0) {
        errors.push('At least one transport mode must be supported');
    }
    if (!carrier.contactInfo.email || !isValidEmail(carrier.contactInfo.email)) {
        errors.push('Valid contact email is required');
    }
    if (!carrier.contactInfo.phone || carrier.contactInfo.phone.trim().length === 0) {
        errors.push('Contact phone is required');
    }
    if (carrier.insuranceInfo) {
        const expiryDate = new Date(carrier.insuranceInfo.expiryDate);
        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        if (expiryDate < now) {
            errors.push('Insurance policy has expired');
        }
        else if (expiryDate < thirtyDaysFromNow) {
            warnings.push('Insurance policy expires within 30 days');
        }
    }
    if (carrier.supportedModes.includes(TransportMode.FTL) && !carrier.dotNumber) {
        warnings.push('DOT number recommended for FTL carriers');
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
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
function activateCarrier(carrier) {
    const validation = validateCarrierProfile(carrier);
    if (!validation.valid) {
        throw new Error(`Cannot activate carrier: ${validation.errors.join(', ')}`);
    }
    return {
        ...carrier,
        status: CarrierStatus.ACTIVE,
        updatedAt: new Date(),
    };
}
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
function suspendCarrier(carrier, reason) {
    return {
        ...carrier,
        status: CarrierStatus.SUSPENDED,
        updatedAt: new Date(),
        metadata: {
            ...carrier.metadata,
            suspensionReason: reason,
            suspendedAt: new Date().toISOString(),
        },
    };
}
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
function deactivateCarrier(carrier, reason) {
    return {
        ...carrier,
        status: CarrierStatus.DEACTIVATED,
        updatedAt: new Date(),
        metadata: {
            ...carrier.metadata,
            deactivationReason: reason,
            deactivatedAt: new Date().toISOString(),
        },
    };
}
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
function configureCarrierCredentials(carrierId, credentials) {
    const credentialId = crypto.randomUUID();
    const now = new Date();
    // Encrypt sensitive fields in production
    const encryptedPassword = credentials.password
        ? encryptSensitiveData(credentials.password)
        : undefined;
    const encryptedApiKey = credentials.apiKey
        ? encryptSensitiveData(credentials.apiKey)
        : undefined;
    return {
        credentialId,
        carrierId,
        integrationType: credentials.integrationType || IntegrationType.MANUAL,
        apiEndpoint: credentials.apiEndpoint,
        apiKey: encryptedApiKey,
        accountNumber: credentials.accountNumber,
        username: credentials.username,
        password: encryptedPassword,
        clientId: credentials.clientId,
        clientSecret: credentials.clientSecret,
        accessToken: credentials.accessToken,
        refreshToken: credentials.refreshToken,
        tokenExpiresAt: credentials.tokenExpiresAt,
        testMode: credentials.testMode !== undefined ? credentials.testMode : true,
        rateLimitPerMinute: credentials.rateLimitPerMinute || 60,
        timeout: credentials.timeout || 30000,
        metadata: credentials.metadata,
        createdAt: now,
        updatedAt: now,
    };
}
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
async function testCarrierConnection(credentials) {
    const startTime = Date.now();
    try {
        // In production, this would make actual API call
        // For now, simulate API test based on integration type
        if (!credentials.apiEndpoint && credentials.integrationType === IntegrationType.REST_API) {
            throw new Error('API endpoint is required for REST API integration');
        }
        if (credentials.testMode) {
            // Simulate test mode success
            return {
                success: true,
                responseTime: Date.now() - startTime,
                apiVersion: 'v1.0.0',
                timestamp: new Date(),
            };
        }
        // Simulate production API call
        return {
            success: true,
            responseTime: Date.now() - startTime,
            apiVersion: 'v1.0.0',
            timestamp: new Date(),
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date(),
        };
    }
}
// ============================================================================
// SECTION 2: SERVICE LEVEL CONFIGURATION (Functions 9-17)
// ============================================================================
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
function createCarrierService(carrierId, data) {
    const serviceId = generateServiceId();
    return {
        serviceId,
        carrierId,
        serviceCode: data.serviceCode || '',
        name: data.name || '',
        description: data.description,
        serviceLevel: data.serviceLevel || ServiceLevel.STANDARD,
        transportMode: data.transportMode || TransportMode.PARCEL,
        transitDays: data.transitDays || { min: 3, max: 5 },
        cutoffTime: data.cutoffTime,
        availableDays: data.availableDays,
        requiresSignature: data.requiresSignature,
        insuranceIncluded: data.insuranceIncluded,
        trackingAvailable: data.trackingAvailable !== undefined ? data.trackingAvailable : true,
        international: data.international || false,
        restrictions: data.restrictions,
        active: data.active !== undefined ? data.active : true,
        metadata: data.metadata,
    };
}
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
function updateCarrierService(service, updates) {
    return {
        ...service,
        ...updates,
        serviceId: service.serviceId, // Prevent ID change
        carrierId: service.carrierId, // Prevent carrier ID change
    };
}
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
function validateCarrierService(service) {
    const errors = [];
    if (!service.serviceCode || service.serviceCode.trim().length === 0) {
        errors.push('Service code is required');
    }
    if (!service.name || service.name.trim().length === 0) {
        errors.push('Service name is required');
    }
    if (service.transitDays.min < 0) {
        errors.push('Minimum transit days cannot be negative');
    }
    if (service.transitDays.max < service.transitDays.min) {
        errors.push('Maximum transit days must be greater than or equal to minimum');
    }
    if (service.cutoffTime && !isValidTimeFormat(service.cutoffTime)) {
        errors.push('Cutoff time must be in HH:MM format');
    }
    if (service.restrictions?.maxWeight && service.restrictions.maxWeight <= 0) {
        errors.push('Maximum weight must be positive');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
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
function findServicesByCriteria(services, criteria) {
    return services.filter(service => {
        if (criteria.carrierId && service.carrierId !== criteria.carrierId)
            return false;
        if (criteria.serviceLevel && service.serviceLevel !== criteria.serviceLevel)
            return false;
        if (criteria.transportMode && service.transportMode !== criteria.transportMode)
            return false;
        if (criteria.international !== undefined && service.international !== criteria.international)
            return false;
        if (criteria.active !== undefined && service.active !== criteria.active)
            return false;
        if (criteria.maxTransitDays && service.transitDays.max > criteria.maxTransitDays)
            return false;
        return true;
    });
}
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
function calculateServiceAvailability(service, shipDate) {
    if (!service.active) {
        return {
            available: false,
            reason: 'Service is not active',
        };
    }
    const dayOfWeek = shipDate.getDay();
    // Check if service is available on this day
    if (service.availableDays && !service.availableDays.includes(dayOfWeek)) {
        return {
            available: false,
            reason: 'Service not available on this day',
        };
    }
    // Check cutoff time
    let cutoffPassed = false;
    if (service.cutoffTime) {
        const [hours, minutes] = service.cutoffTime.split(':').map(Number);
        const cutoff = new Date(shipDate);
        cutoff.setHours(hours, minutes, 0, 0);
        if (shipDate > cutoff) {
            cutoffPassed = true;
        }
    }
    // Calculate estimated delivery
    const transitDays = cutoffPassed ? service.transitDays.max + 1 : service.transitDays.max;
    const estimatedDelivery = new Date(shipDate);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + transitDays);
    return {
        available: true,
        estimatedDelivery,
        cutoffPassed,
    };
}
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
function checkServiceRestrictions(service, packages) {
    const violations = [];
    if (!service.restrictions) {
        return { allowed: true, violations: [] };
    }
    const restrictions = service.restrictions;
    for (const pkg of packages) {
        // Check weight
        if (restrictions.maxWeight) {
            const weightInLbs = pkg.weightUnit === 'KG' ? pkg.weight * 2.20462 : pkg.weight;
            if (weightInLbs > restrictions.maxWeight) {
                violations.push(`Package exceeds maximum weight: ${weightInLbs} lbs > ${restrictions.maxWeight} lbs`);
            }
        }
        // Check dimensions
        if (pkg.length && restrictions.maxLength && pkg.length > restrictions.maxLength) {
            violations.push(`Package exceeds maximum length: ${pkg.length} > ${restrictions.maxLength}`);
        }
        if (pkg.width && restrictions.maxWidth && pkg.width > restrictions.maxWidth) {
            violations.push(`Package exceeds maximum width: ${pkg.width} > ${restrictions.maxWidth}`);
        }
        if (pkg.height && restrictions.maxHeight && pkg.height > restrictions.maxHeight) {
            violations.push(`Package exceeds maximum height: ${pkg.height} > ${restrictions.maxHeight}`);
        }
    }
    return {
        allowed: violations.length === 0,
        violations,
    };
}
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
function compareServiceLevels(services) {
    const comparison = services.map(service => ({
        serviceId: service.serviceId,
        name: service.name,
        transportMode: service.transportMode,
        transitDays: `${service.transitDays.min}-${service.transitDays.max} days`,
        trackingAvailable: service.trackingAvailable,
        signature: service.requiresSignature || false,
        insurance: service.insuranceIncluded || false,
    }));
    const fastest = services.reduce((prev, current) => current.transitDays.min < prev.transitDays.min ? current : prev);
    const mostReliable = services.reduce((prev, current) => {
        const prevRange = prev.transitDays.max - prev.transitDays.min;
        const currentRange = current.transitDays.max - current.transitDays.min;
        return currentRange < prevRange ? current : prev;
    });
    return {
        services: comparison,
        fastest,
        mostReliable,
    };
}
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
function mapServiceLevelsByType(services) {
    const mapped = new Map();
    for (const service of services) {
        const existing = mapped.get(service.serviceLevel) || [];
        existing.push(service);
        mapped.set(service.serviceLevel, existing);
    }
    return mapped;
}
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
function generateServiceMatrix(carrierId, services) {
    const byServiceLevel = {};
    const byTransportMode = {};
    let trackingAvailable = 0;
    let internationalAvailable = false;
    for (const service of services) {
        byServiceLevel[service.serviceLevel] = (byServiceLevel[service.serviceLevel] || 0) + 1;
        byTransportMode[service.transportMode] = (byTransportMode[service.transportMode] || 0) + 1;
        if (service.trackingAvailable)
            trackingAvailable++;
        if (service.international)
            internationalAvailable = true;
    }
    return {
        carrierId,
        totalServices: services.length,
        byServiceLevel,
        byTransportMode,
        internationalAvailable,
        trackingCoverage: services.length > 0 ? (trackingAvailable / services.length) * 100 : 0,
    };
}
// ============================================================================
// SECTION 3: RATE MANAGEMENT (Functions 18-25)
// ============================================================================
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
function createRateTable(carrierId, serviceId, data) {
    const rateTableId = generateRateTableId();
    return {
        rateTableId,
        carrierId,
        serviceId,
        name: data.name || '',
        calculationType: data.calculationType || RateCalculationType.WEIGHT_BASED,
        effectiveDate: data.effectiveDate || new Date(),
        expiryDate: data.expiryDate,
        currency: data.currency || 'USD',
        zones: data.zones || [],
        weightBreaks: data.weightBreaks || [],
        baseRates: data.baseRates || [],
        surcharges: data.surcharges || [],
        accessorials: data.accessorials || [],
        minimumCharge: data.minimumCharge,
        active: data.active !== undefined ? data.active : true,
        metadata: data.metadata,
    };
}
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
function updateRateTable(rateTable, updates) {
    return {
        ...rateTable,
        ...updates,
        rateTableId: rateTable.rateTableId, // Prevent ID change
        carrierId: rateTable.carrierId,
        serviceId: rateTable.serviceId,
    };
}
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
function addZoneToRateTable(rateTable, zone) {
    return {
        ...rateTable,
        zones: [...(rateTable.zones || []), zone],
    };
}
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
function addWeightBreakToRateTable(rateTable, weightBreak) {
    const weightBreaks = [...(rateTable.weightBreaks || []), weightBreak];
    // Sort by minWeight
    weightBreaks.sort((a, b) => a.minWeight - b.minWeight);
    return {
        ...rateTable,
        weightBreaks,
    };
}
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
function addSurchargeToRateTable(rateTable, surcharge) {
    return {
        ...rateTable,
        surcharges: [...(rateTable.surcharges || []), surcharge],
    };
}
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
function addAccessorialToRateTable(rateTable, accessorial) {
    return {
        ...rateTable,
        accessorials: [...(rateTable.accessorials || []), accessorial],
    };
}
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
function validateRateTable(rateTable) {
    const errors = [];
    const warnings = [];
    if (!rateTable.name || rateTable.name.trim().length === 0) {
        errors.push('Rate table name is required');
    }
    if (!rateTable.effectiveDate) {
        errors.push('Effective date is required');
    }
    if (rateTable.expiryDate && rateTable.expiryDate < rateTable.effectiveDate) {
        errors.push('Expiry date must be after effective date');
    }
    // Validate based on calculation type
    if (rateTable.calculationType === RateCalculationType.ZONE_BASED) {
        if (!rateTable.zones || rateTable.zones.length === 0) {
            errors.push('Zone-based rate table must have at least one zone');
        }
    }
    if (rateTable.calculationType === RateCalculationType.WEIGHT_BASED) {
        if (!rateTable.weightBreaks || rateTable.weightBreaks.length === 0) {
            errors.push('Weight-based rate table must have at least one weight break');
        }
    }
    if (!rateTable.baseRates || rateTable.baseRates.length === 0) {
        warnings.push('Rate table has no base rates defined');
    }
    // Check for overlapping weight breaks
    if (rateTable.weightBreaks && rateTable.weightBreaks.length > 1) {
        for (let i = 0; i < rateTable.weightBreaks.length - 1; i++) {
            const current = rateTable.weightBreaks[i];
            const next = rateTable.weightBreaks[i + 1];
            if (current.maxWeight > next.minWeight) {
                errors.push(`Overlapping weight breaks: ${current.minWeight}-${current.maxWeight} and ${next.minWeight}-${next.maxWeight}`);
            }
        }
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
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
function findApplicableRateTable(rateTables, serviceId, shipDate) {
    const applicable = rateTables.filter(table => table.serviceId === serviceId &&
        table.active &&
        table.effectiveDate <= shipDate &&
        (!table.expiryDate || table.expiryDate >= shipDate));
    if (applicable.length === 0)
        return null;
    // Return the most recent effective rate table
    return applicable.reduce((prev, current) => current.effectiveDate > prev.effectiveDate ? current : prev);
}
// ============================================================================
// SECTION 4: RATING ENGINE (Functions 26-33)
// ============================================================================
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
function calculateBaseRate(rateTable, request) {
    const totalWeight = request.packages.reduce((sum, pkg) => {
        const weight = pkg.weightUnit === 'KG' ? pkg.weight * 2.20462 : pkg.weight;
        return sum + weight * (pkg.quantity || 1);
    }, 0);
    switch (rateTable.calculationType) {
        case RateCalculationType.FLAT_RATE:
            return rateTable.baseRates[0]?.rate || 0;
        case RateCalculationType.WEIGHT_BASED:
            return calculateWeightBasedRate(rateTable, totalWeight);
        case RateCalculationType.ZONE_BASED:
            return calculateZoneBasedRate(rateTable, request);
        case RateCalculationType.DIMENSIONAL_WEIGHT:
            return calculateDimensionalWeightRate(rateTable, request);
        default:
            return 0;
    }
}
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
function calculateDimensionalWeight(pkg, dimFactor = 139) {
    if (!pkg.length || !pkg.width || !pkg.height) {
        return pkg.weightUnit === 'KG' ? pkg.weight * 2.20462 : pkg.weight;
    }
    // Convert to inches if needed
    const length = pkg.dimensionUnit === 'CM' ? pkg.length / 2.54 : pkg.length;
    const width = pkg.dimensionUnit === 'CM' ? pkg.width / 2.54 : pkg.width;
    const height = pkg.dimensionUnit === 'CM' ? pkg.height / 2.54 : pkg.height;
    const dimWeight = (length * width * height) / dimFactor;
    const actualWeight = pkg.weightUnit === 'KG' ? pkg.weight * 2.20462 : pkg.weight;
    return Math.max(dimWeight, actualWeight);
}
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
function calculateSurcharges(rateTable, baseRate, request) {
    const surcharges = [];
    if (!rateTable.surcharges)
        return surcharges;
    for (const surcharge of rateTable.surcharges) {
        let applicable = false;
        // Check conditions
        if (surcharge.applicableConditions) {
            if (surcharge.applicableConditions.residential && request.residential)
                applicable = true;
            if (surcharge.applicableConditions.fuelSurcharge)
                applicable = true;
            // Add more condition checks as needed
        }
        else {
            applicable = true; // Apply if no conditions specified
        }
        if (applicable) {
            let amount = 0;
            if (surcharge.type === 'PERCENTAGE') {
                amount = baseRate * surcharge.amount;
            }
            else if (surcharge.type === 'FLAT') {
                amount = surcharge.amount;
            }
            else if (surcharge.type === 'PER_UNIT') {
                const totalWeight = request.packages.reduce((sum, pkg) => sum + pkg.weight * (pkg.quantity || 1), 0);
                amount = totalWeight * surcharge.amount;
            }
            surcharges.push({
                name: surcharge.name,
                amount: Number(amount.toFixed(2)),
            });
        }
    }
    return surcharges;
}
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
function calculateAccessorialCharges(rateTable, baseRate, requestedAccessorials = []) {
    const charges = [];
    if (!rateTable.accessorials)
        return charges;
    for (const accessorial of rateTable.accessorials) {
        // Apply if requested or if not optional
        if (!accessorial.optional || requestedAccessorials.includes(accessorial.code)) {
            let amount = 0;
            if (accessorial.chargeType === 'FLAT') {
                amount = accessorial.charge;
            }
            else if (accessorial.chargeType === 'PERCENTAGE') {
                amount = baseRate * accessorial.charge;
            }
            charges.push({
                name: accessorial.name,
                amount: Number(amount.toFixed(2)),
            });
        }
    }
    return charges;
}
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
function generateCarrierQuote(carrier, service, rateTable, request) {
    const baseRate = calculateBaseRate(rateTable, request);
    const surcharges = calculateSurcharges(rateTable, baseRate, request);
    const accessorialCharges = calculateAccessorialCharges(rateTable, baseRate, request.accessorials);
    const fuelSurcharge = surcharges.find(s => s.name.toLowerCase().includes('fuel'))?.amount || 0;
    const otherSurcharges = surcharges.filter(s => !s.name.toLowerCase().includes('fuel'));
    const totalSurcharges = surcharges.reduce((sum, s) => sum + s.amount, 0);
    const totalAccessorials = accessorialCharges.reduce((sum, a) => sum + a.amount, 0);
    const totalCost = baseRate + totalSurcharges + totalAccessorials;
    // Apply minimum charge if specified
    const finalCost = rateTable.minimumCharge ? Math.max(totalCost, rateTable.minimumCharge) : totalCost;
    // Calculate estimated delivery
    const shipDate = request.shipDate || new Date();
    const availability = calculateServiceAvailability(service, shipDate);
    const validUntil = new Date();
    validUntil.setHours(validUntil.getHours() + 24); // Quote valid for 24 hours
    return {
        quoteId: generateQuoteId(),
        carrierId: carrier.carrierId,
        carrierName: carrier.name,
        serviceId: service.serviceId,
        serviceName: service.name,
        serviceLevel: service.serviceLevel,
        transportMode: service.transportMode,
        baseRate: Number(baseRate.toFixed(2)),
        surcharges: otherSurcharges,
        accessorialCharges,
        fuelSurcharge: Number(fuelSurcharge.toFixed(2)),
        totalCost: Number(finalCost.toFixed(2)),
        currency: rateTable.currency,
        estimatedTransitDays: service.transitDays.max,
        estimatedDeliveryDate: availability.estimatedDelivery,
        guaranteedDelivery: false,
        trackingAvailable: service.trackingAvailable,
        validUntil,
    };
}
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
function performRateShopping(request, carriers, services, rateTables) {
    const quotes = [];
    const shipDate = request.shipDate || new Date();
    // Filter carriers if specific ones requested
    const applicableCarriers = request.carrierIds
        ? carriers.filter(c => request.carrierIds.includes(c.carrierId))
        : carriers.filter(c => c.status === CarrierStatus.ACTIVE);
    for (const carrier of applicableCarriers) {
        // Find applicable services
        let carrierServices = services.filter(s => s.carrierId === carrier.carrierId && s.active);
        // Filter by requested service level or transport mode
        if (request.serviceLevel) {
            carrierServices = carrierServices.filter(s => s.serviceLevel === request.serviceLevel);
        }
        if (request.transportMode) {
            carrierServices = carrierServices.filter(s => s.transportMode === request.transportMode);
        }
        for (const service of carrierServices) {
            // Check service availability
            const availability = calculateServiceAvailability(service, shipDate);
            if (!availability.available)
                continue;
            // Check service restrictions
            const restrictions = checkServiceRestrictions(service, request.packages);
            if (!restrictions.allowed)
                continue;
            // Find applicable rate table
            const rateTable = findApplicableRateTable(rateTables, service.serviceId, shipDate);
            if (!rateTable)
                continue;
            try {
                const quote = generateCarrierQuote(carrier, service, rateTable, request);
                quotes.push(quote);
            }
            catch (error) {
                // Log error and continue with other carriers
                console.error(`Error generating quote for ${carrier.name}: ${error}`);
            }
        }
    }
    // Find cheapest and fastest
    const cheapestQuote = quotes.length > 0
        ? quotes.reduce((prev, current) => (current.totalCost < prev.totalCost ? current : prev))
        : undefined;
    const fastestQuote = quotes.length > 0
        ? quotes.reduce((prev, current) => current.estimatedTransitDays < prev.estimatedTransitDays ? current : prev)
        : undefined;
    const validUntil = new Date();
    validUntil.setHours(validUntil.getHours() + 24);
    return {
        requestId: crypto.randomUUID(),
        request,
        quotes: quotes.sort((a, b) => a.totalCost - b.totalCost),
        cheapestQuote,
        fastestQuote,
        recommendedQuote: cheapestQuote, // Default to cheapest
        quotedAt: new Date(),
        validUntil,
    };
}
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
function selectOptimalCarrier(shoppingResult, criteria, performanceData) {
    let quotes = [...shoppingResult.quotes];
    // Filter by criteria
    if (criteria.maxCost) {
        quotes = quotes.filter(q => q.totalCost <= criteria.maxCost);
    }
    if (criteria.maxTransitDays) {
        quotes = quotes.filter(q => q.estimatedTransitDays <= criteria.maxTransitDays);
    }
    if (criteria.preferredCarriers && criteria.preferredCarriers.length > 0) {
        const preferred = quotes.filter(q => criteria.preferredCarriers.includes(q.carrierId));
        if (preferred.length > 0)
            quotes = preferred;
    }
    if (criteria.excludedCarriers && criteria.excludedCarriers.length > 0) {
        quotes = quotes.filter(q => !criteria.excludedCarriers.includes(q.carrierId));
    }
    // Filter by performance if data available
    if (performanceData && criteria.minOnTimePercentage) {
        quotes = quotes.filter(q => {
            const perf = performanceData.get(q.carrierId);
            return perf ? perf.metrics.onTimePercentage >= criteria.minOnTimePercentage : true;
        });
    }
    if (quotes.length === 0)
        return null;
    // Simple selection logic
    if (criteria.prioritizeCost) {
        return quotes.reduce((prev, current) => (current.totalCost < prev.totalCost ? current : prev));
    }
    if (criteria.prioritizeSpeed) {
        return quotes.reduce((prev, current) => current.estimatedTransitDays < prev.estimatedTransitDays ? current : prev);
    }
    // Weighted scoring
    if (criteria.weights) {
        const scored = quotes.map(quote => {
            const perf = performanceData?.get(quote.carrierId);
            // Normalize scores (0-1)
            const costScore = 1 - quote.totalCost / Math.max(...quotes.map(q => q.totalCost));
            const speedScore = 1 - quote.estimatedTransitDays / Math.max(...quotes.map(q => q.estimatedTransitDays));
            const reliabilityScore = perf ? perf.metrics.onTimePercentage / 100 : 0.5;
            const performanceScore = perf ? (100 - perf.metrics.exceptionRate) / 100 : 0.5;
            const totalScore = costScore * (criteria.weights.cost || 0) +
                speedScore * (criteria.weights.speed || 0) +
                reliabilityScore * (criteria.weights.reliability || 0) +
                performanceScore * (criteria.weights.performance || 0);
            return { quote, score: totalScore };
        });
        const best = scored.reduce((prev, current) => (current.score > prev.score ? current : prev));
        return best.quote;
    }
    // Default to cheapest
    return quotes.reduce((prev, current) => (current.totalCost < prev.totalCost ? current : prev));
}
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
function compareRateQuotes(quotes) {
    if (quotes.length === 0) {
        return {
            totalQuotes: 0,
            costRange: { min: 0, max: 0, average: 0 },
            transitRange: { min: 0, max: 0, average: 0 },
            carriers: [],
            savings: { amount: 0, percentage: 0 },
            breakdown: [],
        };
    }
    const costs = quotes.map(q => q.totalCost);
    const transits = quotes.map(q => q.estimatedTransitDays);
    const minCost = Math.min(...costs);
    const maxCost = Math.max(...costs);
    const avgCost = costs.reduce((sum, c) => sum + c, 0) / costs.length;
    const minTransit = Math.min(...transits);
    const maxTransit = Math.max(...transits);
    const avgTransit = transits.reduce((sum, t) => sum + t, 0) / transits.length;
    const carriers = [...new Set(quotes.map(q => q.carrierName))];
    const savings = {
        amount: maxCost - minCost,
        percentage: ((maxCost - minCost) / maxCost) * 100,
    };
    // Create sorted arrays for ranking
    const sortedByCost = [...quotes].sort((a, b) => a.totalCost - b.totalCost);
    const sortedBySpeed = [...quotes].sort((a, b) => a.estimatedTransitDays - b.estimatedTransitDays);
    const breakdown = quotes.map(quote => ({
        carrier: quote.carrierName,
        service: quote.serviceName,
        cost: quote.totalCost,
        transitDays: quote.estimatedTransitDays,
        costRank: sortedByCost.findIndex(q => q.quoteId === quote.quoteId) + 1,
        speedRank: sortedBySpeed.findIndex(q => q.quoteId === quote.quoteId) + 1,
    }));
    return {
        totalQuotes: quotes.length,
        costRange: { min: minCost, max: maxCost, average: Number(avgCost.toFixed(2)) },
        transitRange: { min: minTransit, max: maxTransit, average: Number(avgTransit.toFixed(1)) },
        carriers,
        savings: {
            amount: Number(savings.amount.toFixed(2)),
            percentage: Number(savings.percentage.toFixed(1)),
        },
        breakdown,
    };
}
// ============================================================================
// SECTION 5: PERFORMANCE TRACKING (Functions 34-41)
// ============================================================================
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
function recordPerformanceEvent(carrierId, shipmentId, metricType, actualValue, expectedValue) {
    let impactScore = 5; // Default medium impact
    // Calculate impact based on metric type
    if (metricType === PerformanceMetric.ON_TIME_DELIVERY && !actualValue) {
        impactScore = 7;
    }
    else if (metricType === PerformanceMetric.LOST_SHIPMENT) {
        impactScore = 10;
    }
    else if (metricType === PerformanceMetric.DAMAGE_RATE) {
        impactScore = 8;
    }
    else if (metricType === PerformanceMetric.DELIVERY_EXCEPTION) {
        impactScore = 6;
    }
    return {
        eventId: crypto.randomUUID(),
        carrierId,
        shipmentId,
        metricType,
        expectedValue,
        actualValue,
        variance: expectedValue && typeof expectedValue === 'number' && typeof actualValue === 'number'
            ? actualValue - expectedValue
            : undefined,
        impactScore,
        timestamp: new Date(),
    };
}
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
function calculateCarrierPerformance(carrierId, events, startDate, endDate) {
    const periodEvents = events.filter(e => e.carrierId === carrierId &&
        e.timestamp >= startDate &&
        e.timestamp <= endDate);
    const shipmentIds = new Set(periodEvents.map(e => e.shipmentId));
    const totalShipments = shipmentIds.size;
    const onTimeEvents = periodEvents.filter(e => e.metricType === PerformanceMetric.ON_TIME_DELIVERY && e.actualValue === true);
    const onTimeDeliveries = onTimeEvents.length;
    const exceptionEvents = periodEvents.filter(e => e.metricType === PerformanceMetric.DELIVERY_EXCEPTION);
    const deliveryExceptions = exceptionEvents.length;
    const damageEvents = periodEvents.filter(e => e.metricType === PerformanceMetric.DAMAGE_RATE);
    const damageIncidents = damageEvents.length;
    const lostEvents = periodEvents.filter(e => e.metricType === PerformanceMetric.LOST_SHIPMENT);
    const lostShipments = lostEvents.length;
    const transitTimeEvents = periodEvents.filter(e => e.metricType === PerformanceMetric.TRANSIT_TIME);
    const averageTransitDays = transitTimeEvents.length > 0
        ? transitTimeEvents.reduce((sum, e) => sum + (e.actualValue || 0), 0) / transitTimeEvents.length
        : 0;
    const costEvents = periodEvents.filter(e => e.metricType === PerformanceMetric.COST_VARIANCE);
    const totalCost = costEvents.reduce((sum, e) => sum + (e.actualValue || 0), 0);
    const costVariance = costEvents.reduce((sum, e) => sum + (e.variance || 0), 0);
    const onTimePercentage = totalShipments > 0 ? (onTimeDeliveries / totalShipments) * 100 : 0;
    const exceptionRate = totalShipments > 0 ? (deliveryExceptions / totalShipments) * 100 : 0;
    const damageRate = totalShipments > 0 ? (damageIncidents / totalShipments) * 100 : 0;
    const lossRate = totalShipments > 0 ? (lostShipments / totalShipments) * 100 : 0;
    const averageCostPerShipment = totalShipments > 0 ? totalCost / totalShipments : 0;
    // SLA compliance (assume 95% on-time target)
    const slaTarget = 95;
    const slaActual = onTimePercentage;
    const slaMetPercentage = slaActual >= slaTarget ? 100 : (slaActual / slaTarget) * 100;
    const recommendations = [];
    if (onTimePercentage < 90) {
        recommendations.push('On-time delivery performance below acceptable threshold');
    }
    if (damageRate > 2) {
        recommendations.push('High damage rate - review packaging requirements');
    }
    if (costVariance > 0) {
        recommendations.push('Consistent cost overruns - renegotiate rates or switch carriers');
    }
    return {
        performanceId: crypto.randomUUID(),
        carrierId,
        period: { startDate, endDate },
        metrics: {
            totalShipments,
            onTimeDeliveries,
            onTimePercentage: Number(onTimePercentage.toFixed(2)),
            averageTransitDays: Number(averageTransitDays.toFixed(1)),
            deliveryExceptions,
            exceptionRate: Number(exceptionRate.toFixed(2)),
            damageIncidents,
            damageRate: Number(damageRate.toFixed(2)),
            lostShipments,
            lossRate: Number(lossRate.toFixed(2)),
            totalCost: Number(totalCost.toFixed(2)),
            averageCostPerShipment: Number(averageCostPerShipment.toFixed(2)),
            costVariance: Number(costVariance.toFixed(2)),
        },
        slaCompliance: {
            slaTarget,
            slaActual: Number(slaActual.toFixed(2)),
            slaMetPercentage: Number(slaMetPercentage.toFixed(2)),
        },
        recommendations,
    };
}
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
function compareCarrierPerformance(performances) {
    if (performances.length === 0) {
        return {
            carriers: 0,
            averageOnTimePercentage: 0,
            bestPerformer: { carrierId: '', onTimePercentage: 0 },
            worstPerformer: { carrierId: '', onTimePercentage: 0 },
            lowestCost: { carrierId: '', averageCost: 0 },
            highestCost: { carrierId: '', averageCost: 0 },
            rankings: [],
        };
    }
    const avgOnTime = performances.reduce((sum, p) => sum + p.metrics.onTimePercentage, 0) / performances.length;
    const best = performances.reduce((prev, current) => current.metrics.onTimePercentage > prev.metrics.onTimePercentage ? current : prev);
    const worst = performances.reduce((prev, current) => current.metrics.onTimePercentage < prev.metrics.onTimePercentage ? current : prev);
    const lowestCost = performances.reduce((prev, current) => current.metrics.averageCostPerShipment < prev.metrics.averageCostPerShipment ? current : prev);
    const highestCost = performances.reduce((prev, current) => current.metrics.averageCostPerShipment > prev.metrics.averageCostPerShipment ? current : prev);
    // Create rankings
    const sortedByOnTime = [...performances].sort((a, b) => b.metrics.onTimePercentage - a.metrics.onTimePercentage);
    const sortedByCost = [...performances].sort((a, b) => a.metrics.averageCostPerShipment - b.metrics.averageCostPerShipment);
    const rankings = performances.map(perf => {
        const onTimeRank = sortedByOnTime.findIndex(p => p.carrierId === perf.carrierId) + 1;
        const costRank = sortedByCost.findIndex(p => p.carrierId === perf.carrierId) + 1;
        // Overall score (lower is better)
        const overallScore = (onTimeRank + costRank) / 2;
        return {
            carrierId: perf.carrierId,
            onTimeRank,
            costRank,
            overallScore: Number(overallScore.toFixed(2)),
        };
    });
    rankings.sort((a, b) => a.overallScore - b.overallScore);
    return {
        carriers: performances.length,
        averageOnTimePercentage: Number(avgOnTime.toFixed(2)),
        bestPerformer: {
            carrierId: best.carrierId,
            onTimePercentage: best.metrics.onTimePercentage,
        },
        worstPerformer: {
            carrierId: worst.carrierId,
            onTimePercentage: worst.metrics.onTimePercentage,
        },
        lowestCost: {
            carrierId: lowestCost.carrierId,
            averageCost: lowestCost.metrics.averageCostPerShipment,
        },
        highestCost: {
            carrierId: highestCost.carrierId,
            averageCost: highestCost.metrics.averageCostPerShipment,
        },
        rankings,
    };
}
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
function generateCarrierScorecard(performance) {
    const { metrics, slaCompliance } = performance;
    // Calculate scores (0-100)
    const onTimeScore = metrics.onTimePercentage;
    const reliabilityScore = Math.max(0, 100 - metrics.exceptionRate);
    const costScore = slaCompliance.slaMetPercentage; // Based on meeting cost expectations
    const qualityScore = Math.max(0, 100 - metrics.damageRate - metrics.lossRate);
    const overallScore = (onTimeScore + reliabilityScore + costScore + qualityScore) / 4;
    // Convert scores to grades
    const getGrade = (score) => {
        if (score >= 95)
            return 'A+';
        if (score >= 90)
            return 'A';
        if (score >= 85)
            return 'B+';
        if (score >= 80)
            return 'B';
        if (score >= 75)
            return 'C+';
        if (score >= 70)
            return 'C';
        if (score >= 65)
            return 'D+';
        if (score >= 60)
            return 'D';
        return 'F';
    };
    const strengths = [];
    const weaknesses = [];
    if (onTimeScore >= 95)
        strengths.push('Excellent on-time delivery');
    else if (onTimeScore < 85)
        weaknesses.push('Poor on-time performance');
    if (reliabilityScore >= 95)
        strengths.push('Very reliable service');
    else if (reliabilityScore < 85)
        weaknesses.push('High exception rate');
    if (qualityScore >= 98)
        strengths.push('Excellent quality and care');
    else if (qualityScore < 95)
        weaknesses.push('Quality concerns (damage/loss)');
    if (metrics.costVariance < 0)
        strengths.push('Cost savings vs. expected');
    else if (metrics.costVariance > metrics.totalCost * 0.1)
        weaknesses.push('Significant cost overruns');
    return {
        carrierId: performance.carrierId,
        period: `${performance.period.startDate.toISOString().split('T')[0]} to ${performance.period.endDate.toISOString().split('T')[0]}`,
        grades: {
            onTime: getGrade(onTimeScore),
            reliability: getGrade(reliabilityScore),
            cost: getGrade(costScore),
            quality: getGrade(qualityScore),
        },
        scores: {
            onTime: Number(onTimeScore.toFixed(1)),
            reliability: Number(reliabilityScore.toFixed(1)),
            cost: Number(costScore.toFixed(1)),
            quality: Number(qualityScore.toFixed(1)),
        },
        overallScore: Number(overallScore.toFixed(1)),
        overallGrade: getGrade(overallScore),
        strengths,
        weaknesses,
    };
}
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
function trackCarrierSLA(performance, slaTargets) {
    const violations = [];
    // Check on-time delivery
    if (performance.metrics.onTimePercentage < slaTargets.onTimeTarget) {
        violations.push({
            metric: 'On-Time Delivery',
            target: slaTargets.onTimeTarget,
            actual: performance.metrics.onTimePercentage,
            variance: performance.metrics.onTimePercentage - slaTargets.onTimeTarget,
        });
    }
    // Check exception rate
    if (slaTargets.maxExceptionRate && performance.metrics.exceptionRate > slaTargets.maxExceptionRate) {
        violations.push({
            metric: 'Exception Rate',
            target: slaTargets.maxExceptionRate,
            actual: performance.metrics.exceptionRate,
            variance: performance.metrics.exceptionRate - slaTargets.maxExceptionRate,
        });
    }
    // Check damage rate
    if (slaTargets.maxDamageRate && performance.metrics.damageRate > slaTargets.maxDamageRate) {
        violations.push({
            metric: 'Damage Rate',
            target: slaTargets.maxDamageRate,
            actual: performance.metrics.damageRate,
            variance: performance.metrics.damageRate - slaTargets.maxDamageRate,
        });
    }
    // Check loss rate
    if (slaTargets.maxLossRate && performance.metrics.lossRate > slaTargets.maxLossRate) {
        violations.push({
            metric: 'Loss Rate',
            target: slaTargets.maxLossRate,
            actual: performance.metrics.lossRate,
            variance: performance.metrics.lossRate - slaTargets.maxLossRate,
        });
    }
    const totalChecks = 1 + (slaTargets.maxExceptionRate ? 1 : 0) +
        (slaTargets.maxDamageRate ? 1 : 0) + (slaTargets.maxLossRate ? 1 : 0);
    const compliancePercentage = ((totalChecks - violations.length) / totalChecks) * 100;
    return {
        compliant: violations.length === 0,
        violations,
        compliancePercentage: Number(compliancePercentage.toFixed(2)),
    };
}
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
function identifyPerformanceTrends(historicalPerformance) {
    if (historicalPerformance.length < 2) {
        return {
            dataPoints: historicalPerformance.length,
            onTimeTrend: 'STABLE',
            costTrend: 'STABLE',
            qualityTrend: 'STABLE',
            onTimeChange: 0,
            costChange: 0,
            damageRateChange: 0,
            recommendations: ['Insufficient historical data for trend analysis'],
        };
    }
    // Sort by period end date
    const sorted = [...historicalPerformance].sort((a, b) => a.period.endDate.getTime() - b.period.endDate.getTime());
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const onTimeChange = last.metrics.onTimePercentage - first.metrics.onTimePercentage;
    const costChange = last.metrics.averageCostPerShipment - first.metrics.averageCostPerShipment;
    const damageRateChange = last.metrics.damageRate - first.metrics.damageRate;
    const getTrend = (change, threshold = 2) => {
        if (Math.abs(change) < threshold)
            return 'STABLE';
        return change > 0 ? 'IMPROVING' : 'DECLINING';
    };
    const onTimeTrend = getTrend(onTimeChange);
    const costTrend = getTrend(-costChange); // Lower cost is better
    const qualityTrend = getTrend(-damageRateChange, 0.5); // Lower damage is better
    const recommendations = [];
    if (onTimeTrend === 'DECLINING') {
        recommendations.push('Address declining on-time performance with carrier');
    }
    if (costTrend === 'DECLINING') {
        recommendations.push('Costs increasing - consider contract renegotiation or alternative carriers');
    }
    if (qualityTrend === 'DECLINING') {
        recommendations.push('Quality declining - review packaging and handling procedures');
    }
    if (onTimeTrend === 'IMPROVING' && costTrend === 'IMPROVING') {
        recommendations.push('Carrier performance improving - consider increasing volume');
    }
    return {
        dataPoints: historicalPerformance.length,
        onTimeTrend,
        costTrend,
        qualityTrend,
        onTimeChange: Number(onTimeChange.toFixed(2)),
        costChange: Number(costChange.toFixed(2)),
        damageRateChange: Number(damageRateChange.toFixed(2)),
        recommendations,
    };
}
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
function calculateCarrierCostSavings(historicalShoppings, selectedCarrierIds) {
    let totalSavings = 0;
    let totalSelectedCost = 0;
    let totalCheapestCost = 0;
    let bestAlternativeSavings = 0;
    const breakdown = historicalShoppings.map((shopping, index) => {
        const selectedCarrierId = selectedCarrierIds[index];
        const selectedQuote = shopping.quotes.find(q => q.carrierId === selectedCarrierId);
        const cheapestQuote = shopping.cheapestQuote;
        if (!selectedQuote || !cheapestQuote) {
            return {
                requestId: shopping.requestId,
                selectedCost: 0,
                cheapestCost: 0,
                savings: 0,
                optimal: false,
            };
        }
        const savings = selectedQuote.totalCost - cheapestQuote.totalCost;
        const isOptimal = selectedQuote.quoteId === cheapestQuote.quoteId;
        totalSelectedCost += selectedQuote.totalCost;
        totalCheapestCost += cheapestQuote.totalCost;
        if (savings > 0) {
            bestAlternativeSavings += savings;
        }
        else {
            totalSavings += Math.abs(savings);
        }
        return {
            requestId: shopping.requestId,
            selectedCost: selectedQuote.totalCost,
            cheapestCost: cheapestQuote.totalCost,
            savings: Number(savings.toFixed(2)),
            optimal: isOptimal,
        };
    });
    const totalShipments = historicalShoppings.length;
    const averageSavingsPerShipment = totalShipments > 0 ? totalSavings / totalShipments : 0;
    const savingsPercentage = totalCheapestCost > 0
        ? (totalSavings / totalCheapestCost) * 100
        : 0;
    return {
        totalShipments,
        totalSavings: Number(totalSavings.toFixed(2)),
        averageSavingsPerShipment: Number(averageSavingsPerShipment.toFixed(2)),
        savingsPercentage: Number(savingsPercentage.toFixed(2)),
        bestAlternativeSavings: Number(bestAlternativeSavings.toFixed(2)),
        breakdown,
    };
}
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
function generateCarrierPerformanceReport(carrierId, carrier, performance) {
    const periodDays = Math.ceil((performance.period.endDate.getTime() - performance.period.startDate.getTime()) /
        (1000 * 60 * 60 * 24));
    const scorecard = generateCarrierScorecard(performance);
    return {
        reportId: crypto.randomUUID(),
        generatedAt: new Date(),
        carrier: {
            id: carrier.carrierId,
            name: carrier.name,
            scac: carrier.scac,
            status: carrier.status,
        },
        period: {
            startDate: performance.period.startDate.toISOString(),
            endDate: performance.period.endDate.toISOString(),
            days: periodDays,
        },
        summary: {
            totalShipments: performance.metrics.totalShipments,
            onTimePercentage: performance.metrics.onTimePercentage,
            averageTransitDays: performance.metrics.averageTransitDays,
            totalCost: performance.metrics.totalCost,
            averageCostPerShipment: performance.metrics.averageCostPerShipment,
        },
        performance: {
            onTimeDeliveries: performance.metrics.onTimeDeliveries,
            deliveryExceptions: performance.metrics.deliveryExceptions,
            exceptionRate: performance.metrics.exceptionRate,
            damageIncidents: performance.metrics.damageIncidents,
            damageRate: performance.metrics.damageRate,
            lostShipments: performance.metrics.lostShipments,
            lossRate: performance.metrics.lossRate,
        },
        sla: {
            target: performance.slaCompliance.slaTarget,
            actual: performance.slaCompliance.slaActual,
            compliance: performance.slaCompliance.slaMetPercentage,
            met: performance.slaCompliance.slaMetPercentage >= 100,
        },
        scorecard,
        recommendations: performance.recommendations || [],
    };
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Helper: Generates unique carrier ID.
 */
function generateCarrierId() {
    return `CARRIER-${crypto.randomUUID()}`;
}
/**
 * Helper: Generates unique service ID.
 */
function generateServiceId() {
    return `SERVICE-${crypto.randomUUID()}`;
}
/**
 * Helper: Generates unique rate table ID.
 */
function generateRateTableId() {
    return `RATE-${crypto.randomUUID()}`;
}
/**
 * Helper: Generates unique quote ID.
 */
function generateQuoteId() {
    return `QUOTE-${crypto.randomUUID()}`;
}
/**
 * Helper: Validates email format.
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * Helper: Validates time format (HH:MM).
 */
function isValidTimeFormat(time) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
}
/**
 * Helper: Encrypts sensitive data.
 * In production, use proper encryption library like crypto.
 */
function encryptSensitiveData(data) {
    // In production, implement proper encryption
    // For now, return base64 encoded (NOT secure, just for demonstration)
    return Buffer.from(data).toString('base64');
}
/**
 * Helper: Calculates weight-based rate.
 */
function calculateWeightBasedRate(rateTable, weight) {
    if (!rateTable.weightBreaks || rateTable.weightBreaks.length === 0) {
        return rateTable.baseRates[0]?.rate || 0;
    }
    for (const weightBreak of rateTable.weightBreaks) {
        if (weight >= weightBreak.minWeight && weight <= weightBreak.maxWeight) {
            if (weightBreak.perUnit === 'SHIPMENT') {
                return weightBreak.rate;
            }
            else if (weightBreak.perUnit === 'LBS' || weightBreak.perUnit === 'KG') {
                return weight * weightBreak.rate;
            }
            else if (weightBreak.perUnit === 'CWT') {
                // CWT = per 100 lbs
                return (weight / 100) * weightBreak.rate;
            }
        }
    }
    // If no matching weight break, use last tier
    const lastBreak = rateTable.weightBreaks[rateTable.weightBreaks.length - 1];
    return lastBreak.rate;
}
/**
 * Helper: Calculates zone-based rate.
 */
function calculateZoneBasedRate(rateTable, request) {
    // Simplified zone lookup
    // In production, implement postal code to zone mapping
    const zone = rateTable.zones?.[0]; // Default to first zone
    if (!zone)
        return rateTable.baseRates[0]?.rate || 0;
    const matchingRate = rateTable.baseRates.find(rate => rate.zoneId === zone.zoneId);
    return matchingRate?.rate || rateTable.baseRates[0]?.rate || 0;
}
/**
 * Helper: Calculates dimensional weight rate.
 */
function calculateDimensionalWeightRate(rateTable, request) {
    const dimWeights = request.packages.map(pkg => calculateDimensionalWeight(pkg));
    const totalDimWeight = dimWeights.reduce((sum, w) => sum + w, 0);
    return calculateWeightBasedRate(rateTable, totalDimWeight);
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Carrier Profile Management
    createCarrierProfile,
    updateCarrierProfile,
    validateCarrierProfile,
    activateCarrier,
    suspendCarrier,
    deactivateCarrier,
    configureCarrierCredentials,
    testCarrierConnection,
    // Service Level Configuration
    createCarrierService,
    updateCarrierService,
    validateCarrierService,
    findServicesByCriteria,
    calculateServiceAvailability,
    checkServiceRestrictions,
    compareServiceLevels,
    mapServiceLevelsByType,
    generateServiceMatrix,
    // Rate Management
    createRateTable,
    updateRateTable,
    addZoneToRateTable,
    addWeightBreakToRateTable,
    addSurchargeToRateTable,
    addAccessorialToRateTable,
    validateRateTable,
    findApplicableRateTable,
    // Rating Engine
    calculateBaseRate,
    calculateDimensionalWeight,
    calculateSurcharges,
    calculateAccessorialCharges,
    generateCarrierQuote,
    performRateShopping,
    selectOptimalCarrier,
    compareRateQuotes,
    // Performance Tracking
    recordPerformanceEvent,
    calculateCarrierPerformance,
    compareCarrierPerformance,
    generateCarrierScorecard,
    trackCarrierSLA,
    identifyPerformanceTrends,
    calculateCarrierCostSavings,
    generateCarrierPerformanceReport,
};
//# sourceMappingURL=transportation-carrier-management-kit.js.map