/**
 * LOC: ORDER_DELIVERY_SCHEDULING_001
 * File: /reuse/order/delivery-scheduling-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *   - class-transformer
 *   - zod
 *   - date-fns
 *
 * DOWNSTREAM (imported by):
 *   - Delivery services
 *   - Route optimization services
 *   - Driver management services
 *   - Order fulfillment services
 *   - Logistics controllers
 */
/**
 * Delivery status enum
 */
export declare enum DeliveryStatus {
    PENDING = "pending",
    SCHEDULED = "scheduled",
    ASSIGNED = "assigned",
    IN_TRANSIT = "in_transit",
    OUT_FOR_DELIVERY = "out_for_delivery",
    DELIVERED = "delivered",
    FAILED = "failed",
    CANCELLED = "cancelled",
    RETURNED = "returned",
    RESCHEDULED = "rescheduled"
}
/**
 * Delivery priority enum
 */
export declare enum DeliveryPriority {
    LOW = "low",
    NORMAL = "normal",
    HIGH = "high",
    URGENT = "urgent",
    SAME_DAY = "same_day",
    EXPRESS = "express"
}
/**
 * Delivery window type enum
 */
export declare enum DeliveryWindowType {
    MORNING = "morning",
    AFTERNOON = "afternoon",
    EVENING = "evening",
    ANYTIME = "anytime",
    CUSTOM = "custom"
}
/**
 * Driver status enum
 */
export declare enum DriverStatus {
    AVAILABLE = "available",
    ON_BREAK = "on_break",
    BUSY = "busy",
    OFFLINE = "offline",
    EN_ROUTE = "en_route"
}
/**
 * Vehicle type enum
 */
export declare enum VehicleType {
    BIKE = "bike",
    MOTORCYCLE = "motorcycle",
    CAR = "car",
    VAN = "van",
    TRUCK = "truck",
    REFRIGERATED = "refrigerated"
}
/**
 * Route optimization strategy enum
 */
export declare enum RouteOptimizationStrategy {
    SHORTEST_DISTANCE = "shortest_distance",
    FASTEST_TIME = "fastest_time",
    BALANCED = "balanced",
    COST_OPTIMIZED = "cost_optimized",
    PRIORITY_FIRST = "priority_first"
}
/**
 * Delivery exception type enum
 */
export declare enum DeliveryExceptionType {
    ADDRESS_NOT_FOUND = "address_not_found",
    CUSTOMER_UNAVAILABLE = "customer_unavailable",
    WEATHER_DELAY = "weather_delay",
    VEHICLE_BREAKDOWN = "vehicle_breakdown",
    TRAFFIC_DELAY = "traffic_delay",
    INCORRECT_ADDRESS = "incorrect_address",
    ACCESS_DENIED = "access_denied",
    DAMAGED_GOODS = "damaged_goods",
    REFUSED_BY_CUSTOMER = "refused_by_customer",
    OTHER = "other"
}
/**
 * POD (Proof of Delivery) type enum
 */
export declare enum PODType {
    SIGNATURE = "signature",
    PHOTO = "photo",
    OTP = "otp",
    BARCODE_SCAN = "barcode_scan",
    CONTACTLESS = "contactless"
}
/**
 * Geographic coordinate
 */
export interface GeoCoordinate {
    latitude: number;
    longitude: number;
    altitude?: number;
}
/**
 * Geographic zone/polygon
 */
export interface GeoZone {
    id: string;
    name: string;
    type: 'polygon' | 'circle' | 'rectangle';
    coordinates: GeoCoordinate[];
    centerPoint?: GeoCoordinate;
    radius?: number;
    metadata?: Record<string, unknown>;
}
/**
 * Delivery address
 */
export interface DeliveryAddress {
    id?: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: GeoCoordinate;
    instructions?: string;
    contactName: string;
    contactPhone: string;
    contactEmail?: string;
    accessCode?: string;
}
/**
 * Delivery window
 */
export interface DeliveryWindow {
    id: string;
    type: DeliveryWindowType;
    startTime: Date;
    endTime: Date;
    capacity: number;
    bookedCount: number;
    available: boolean;
    zoneId?: string;
    pricing?: DeliveryPricing;
    metadata?: Record<string, unknown>;
}
/**
 * Delivery time slot
 */
export interface DeliveryTimeSlot {
    id: string;
    windowId: string;
    startTime: Date;
    endTime: Date;
    available: boolean;
    reserved: boolean;
    deliveryId?: string;
    zoneId?: string;
}
/**
 * Delivery pricing
 */
export interface DeliveryPricing {
    basePrice: number;
    distancePrice: number;
    timePrice: number;
    priorityPrice: number;
    zonePrice: number;
    totalPrice: number;
    currency: string;
    discounts?: DeliveryDiscount[];
}
/**
 * Delivery discount
 */
export interface DeliveryDiscount {
    id: string;
    type: 'percentage' | 'fixed' | 'free';
    value: number;
    reason: string;
    appliedAt: Date;
}
/**
 * Customer delivery preferences
 */
export interface CustomerDeliveryPreferences {
    customerId: string;
    preferredTimeWindows: DeliveryWindowType[];
    preferredDays: number[];
    specialInstructions?: string;
    requiresSignature: boolean;
    allowContactless: boolean;
    preferredContactMethod: 'phone' | 'email' | 'sms';
    gateCode?: string;
    parkingInstructions?: string;
    metadata?: Record<string, unknown>;
}
/**
 * Driver information
 */
export interface Driver {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: DriverStatus;
    vehicleType: VehicleType;
    vehicleId: string;
    vehicleCapacity: number;
    currentLocation?: GeoCoordinate;
    assignedZones: string[];
    skills: string[];
    rating: number;
    completedDeliveries: number;
    activeDeliveries: number;
    maxDeliveries: number;
    workingHours: {
        startTime: string;
        endTime: string;
    };
    metadata?: Record<string, unknown>;
}
/**
 * Delivery item
 */
export interface DeliveryItem {
    id: string;
    orderId: string;
    productId: string;
    productName: string;
    quantity: number;
    weight?: number;
    volume?: number;
    requiresRefrigeration: boolean;
    fragile: boolean;
    value: number;
    metadata?: Record<string, unknown>;
}
/**
 * Main delivery entity
 */
export interface Delivery {
    id: string;
    orderId: string;
    customerId: string;
    status: DeliveryStatus;
    priority: DeliveryPriority;
    scheduledDate: Date;
    scheduledWindow?: DeliveryWindow;
    timeSlot?: DeliveryTimeSlot;
    pickupAddress: DeliveryAddress;
    deliveryAddress: DeliveryAddress;
    items: DeliveryItem[];
    driverId?: string;
    routeId?: string;
    estimatedDeliveryTime?: Date;
    actualDeliveryTime?: Date;
    distance?: number;
    duration?: number;
    pricing?: DeliveryPricing;
    proofOfDelivery?: ProofOfDelivery;
    exceptions?: DeliveryException[];
    customerPreferences?: CustomerDeliveryPreferences;
    trackingUrl?: string;
    specialInstructions?: string;
    requiresSignature: boolean;
    allowContactless: boolean;
    createdAt: Date;
    updatedAt: Date;
    metadata?: Record<string, unknown>;
}
/**
 * Proof of Delivery (POD)
 */
export interface ProofOfDelivery {
    id: string;
    deliveryId: string;
    type: PODType;
    signatureUrl?: string;
    photoUrls?: string[];
    otp?: string;
    barcode?: string;
    recipientName: string;
    recipientPhone?: string;
    notes?: string;
    capturedAt: Date;
    capturedBy: string;
    location?: GeoCoordinate;
    metadata?: Record<string, unknown>;
}
/**
 * Delivery exception
 */
export interface DeliveryException {
    id: string;
    deliveryId: string;
    type: DeliveryExceptionType;
    description: string;
    occurredAt: Date;
    resolvedAt?: Date;
    resolved: boolean;
    resolution?: string;
    reportedBy: string;
    photos?: string[];
    location?: GeoCoordinate;
    metadata?: Record<string, unknown>;
}
/**
 * Delivery route
 */
export interface DeliveryRoute {
    id: string;
    name: string;
    driverId: string;
    vehicleId: string;
    date: Date;
    status: 'planned' | 'active' | 'completed' | 'cancelled';
    stops: RouteStop[];
    totalDistance: number;
    totalDuration: number;
    optimizationStrategy: RouteOptimizationStrategy;
    startLocation: GeoCoordinate;
    endLocation: GeoCoordinate;
    startTime: Date;
    estimatedEndTime: Date;
    actualEndTime?: Date;
    capacityUsed: number;
    capacityTotal: number;
    metadata?: Record<string, unknown>;
}
/**
 * Route stop
 */
export interface RouteStop {
    id: string;
    routeId: string;
    deliveryId: string;
    sequence: number;
    address: DeliveryAddress;
    estimatedArrival: Date;
    actualArrival?: Date;
    estimatedDeparture: Date;
    actualDeparture?: Date;
    duration: number;
    distance: number;
    status: 'pending' | 'completed' | 'skipped' | 'failed';
    notes?: string;
    metadata?: Record<string, unknown>;
}
/**
 * Capacity planning result
 */
export interface CapacityPlanningResult {
    date: Date;
    totalCapacity: number;
    usedCapacity: number;
    availableCapacity: number;
    utilizationPercentage: number;
    recommendedDrivers: number;
    predictedDemand: number;
    zones: {
        zoneId: string;
        capacity: number;
        demand: number;
        utilization: number;
    }[];
}
/**
 * Route optimization result
 */
export interface RouteOptimizationResult {
    routes: DeliveryRoute[];
    totalDistance: number;
    totalDuration: number;
    totalCost: number;
    unassignedDeliveries: Delivery[];
    optimizationScore: number;
    computationTime: number;
    strategy: RouteOptimizationStrategy;
}
/**
 * Create delivery window DTO
 */
export declare class CreateDeliveryWindowDto {
    type: DeliveryWindowType;
    startTime: Date;
    endTime: Date;
    capacity: number;
    zoneId?: string;
    metadata?: Record<string, unknown>;
}
/**
 * Update delivery window DTO
 */
export declare class UpdateDeliveryWindowDto {
    type?: DeliveryWindowType;
    capacity?: number;
    available?: boolean;
}
/**
 * Schedule delivery DTO
 */
export declare class ScheduleDeliveryDto {
    orderId: string;
    customerId: string;
    priority: DeliveryPriority;
    scheduledDate: Date;
    windowId?: string;
    timeSlotId?: string;
    pickupAddress: DeliveryAddress;
    deliveryAddress: DeliveryAddress;
    items: DeliveryItem[];
    specialInstructions?: string;
    requiresSignature?: boolean;
    allowContactless?: boolean;
}
/**
 * Assign driver DTO
 */
export declare class AssignDriverDto {
    driverId: string;
    estimatedDeliveryTime?: Date;
}
/**
 * Capture POD DTO
 */
export declare class CaptureProofOfDeliveryDto {
    type: PODType;
    recipientName: string;
    recipientPhone?: string;
    signatureUrl?: string;
    photoUrls?: string[];
    otp?: string;
    notes?: string;
    location?: GeoCoordinate;
}
/**
 * Report exception DTO
 */
export declare class ReportDeliveryExceptionDto {
    type: DeliveryExceptionType;
    description: string;
    photos?: string[];
    location?: GeoCoordinate;
}
/**
 * Optimize route DTO
 */
export declare class OptimizeRouteDto {
    deliveryIds: string[];
    strategy: RouteOptimizationStrategy;
    driverId?: string;
    startLocation: GeoCoordinate;
}
/**
 * Calculate delivery cost DTO
 */
export declare class CalculateDeliveryCostDto {
    pickupAddress: DeliveryAddress;
    deliveryAddress: DeliveryAddress;
    priority: DeliveryPriority;
    weight?: number;
    volume?: number;
    zoneId?: string;
}
/**
 * Customer preferences DTO
 */
export declare class UpdateCustomerPreferencesDto {
    preferredTimeWindows: DeliveryWindowType[];
    preferredDays: number[];
    specialInstructions?: string;
    requiresSignature: boolean;
    allowContactless: boolean;
    preferredContactMethod?: 'phone' | 'email' | 'sms';
}
/**
 * Create geographic zone DTO
 */
export declare class CreateGeoZoneDto {
    name: string;
    type: 'polygon' | 'circle' | 'rectangle';
    coordinates: GeoCoordinate[];
    centerPoint?: GeoCoordinate;
    radius?: number;
}
export declare const GeoCoordinateSchema: any;
export declare const DeliveryAddressSchema: any;
export declare const DeliveryWindowSchema: any;
/**
 * Creates a new delivery window
 */
export declare function createDeliveryWindow(data: CreateDeliveryWindowDto): DeliveryWindow;
/**
 * Updates delivery window
 */
export declare function updateDeliveryWindow(window: DeliveryWindow, updates: UpdateDeliveryWindowDto): DeliveryWindow;
/**
 * Checks if delivery window is available
 */
export declare function isDeliveryWindowAvailable(window: DeliveryWindow): boolean;
/**
 * Books a slot in delivery window
 */
export declare function bookDeliveryWindow(window: DeliveryWindow): DeliveryWindow;
/**
 * Releases a slot in delivery window
 */
export declare function releaseDeliveryWindow(window: DeliveryWindow): DeliveryWindow;
/**
 * Generates time slots for a delivery window
 */
export declare function generateTimeSlots(window: DeliveryWindow, slotDuration?: number): DeliveryTimeSlot[];
/**
 * Reserves a time slot
 */
export declare function reserveTimeSlot(slot: DeliveryTimeSlot, deliveryId: string): DeliveryTimeSlot;
/**
 * Releases a time slot
 */
export declare function releaseTimeSlot(slot: DeliveryTimeSlot): DeliveryTimeSlot;
/**
 * Finds available time slots for date
 */
export declare function findAvailableTimeSlots(slots: DeliveryTimeSlot[], date: Date, zoneId?: string): DeliveryTimeSlot[];
/**
 * Schedules a new delivery
 */
export declare function scheduleDelivery(data: ScheduleDeliveryDto): Delivery;
/**
 * Updates delivery status
 */
export declare function updateDeliveryStatus(delivery: Delivery, status: DeliveryStatus): Delivery;
/**
 * Reschedules a delivery
 */
export declare function rescheduleDelivery(delivery: Delivery, newDate: Date, windowId?: string, timeSlotId?: string): Delivery;
/**
 * Cancels a delivery
 */
export declare function cancelDelivery(delivery: Delivery, reason: string): Delivery;
/**
 * Finds available drivers for delivery
 */
export declare function findAvailableDrivers(drivers: Driver[], delivery: Delivery, date: Date): Driver[];
/**
 * Assigns driver to delivery
 */
export declare function assignDriver(delivery: Delivery, driver: Driver): Delivery;
/**
 * Unassigns driver from delivery
 */
export declare function unassignDriver(delivery: Delivery): Delivery;
/**
 * Calculates driver workload score
 */
export declare function calculateDriverWorkload(driver: Driver, routes: DeliveryRoute[]): number;
/**
 * Balances workload across drivers
 */
export declare function balanceDriverWorkload(drivers: Driver[], deliveries: Delivery[]): Map<string, string[]>;
/**
 * Optimizes delivery route using nearest neighbor algorithm
 */
export declare function optimizeRouteNearestNeighbor(deliveries: Delivery[], startLocation: GeoCoordinate): Delivery[];
/**
 * Creates delivery route from deliveries
 */
export declare function createDeliveryRoute(driver: Driver, deliveries: Delivery[], startLocation: GeoCoordinate, strategy: RouteOptimizationStrategy): DeliveryRoute;
/**
 * Optimizes route by priority
 */
export declare function optimizeRouteByPriority(deliveries: Delivery[]): Delivery[];
/**
 * Calculates ETA for delivery
 */
export declare function calculateDeliveryETA(currentLocation: GeoCoordinate, deliveryAddress: DeliveryAddress, trafficFactor?: number): Date;
/**
 * Detects route deviations
 */
export declare function detectRouteDeviation(plannedStop: RouteStop, actualLocation: GeoCoordinate, threshold?: number): boolean;
/**
 * Updates delivery location
 */
export declare function updateDeliveryLocation(delivery: Delivery, location: GeoCoordinate): Delivery;
/**
 * Generates tracking URL
 */
export declare function generateTrackingUrl(delivery: Delivery): string;
/**
 * Calculates delivery progress percentage
 */
export declare function calculateDeliveryProgress(route: DeliveryRoute): number;
/**
 * Captures proof of delivery
 */
export declare function captureProofOfDelivery(delivery: Delivery, data: CaptureProofOfDeliveryDto, capturedBy: string): ProofOfDelivery;
/**
 * Validates POD completeness
 */
export declare function validateProofOfDelivery(pod: ProofOfDelivery, delivery: Delivery): boolean;
/**
 * Reports delivery exception
 */
export declare function reportDeliveryException(delivery: Delivery, data: ReportDeliveryExceptionDto, reportedBy: string): DeliveryException;
/**
 * Resolves delivery exception
 */
export declare function resolveDeliveryException(exception: DeliveryException, resolution: string): DeliveryException;
/**
 * Auto-reschedules failed delivery
 */
export declare function autoRescheduleFailedDelivery(delivery: Delivery, availableWindows: DeliveryWindow[]): Delivery | null;
/**
 * Calculates delivery capacity for date
 */
export declare function calculateDeliveryCapacity(date: Date, drivers: Driver[], windows: DeliveryWindow[]): CapacityPlanningResult;
/**
 * Predicts delivery demand
 */
export declare function predictDeliveryDemand(historicalData: {
    date: Date;
    count: number;
}[], forecastDate: Date): number;
/**
 * Creates geographic zone
 */
export declare function createGeoZone(data: CreateGeoZoneDto): GeoZone;
/**
 * Checks if coordinate is within zone
 */
export declare function isCoordinateInZone(coordinate: GeoCoordinate, zone: GeoZone): boolean;
/**
 * Finds zone for delivery address
 */
export declare function findZoneForAddress(address: DeliveryAddress, zones: GeoZone[]): GeoZone | null;
/**
 * Calculates delivery cost
 */
export declare function calculateDeliveryCost(data: CalculateDeliveryCostDto, baseRates: {
    basePrice: number;
    perKmPrice: number;
    priorityMultipliers: Record<DeliveryPriority, number>;
    zoneMultipliers: Map<string, number>;
}): DeliveryPricing;
/**
 * Applies discount to delivery pricing
 */
export declare function applyDeliveryDiscount(pricing: DeliveryPricing, discount: Omit<DeliveryDiscount, 'id' | 'appliedAt'>): DeliveryPricing;
/**
 * Updates customer delivery preferences
 */
export declare function updateCustomerPreferences(customerId: string, data: UpdateCustomerPreferencesDto): CustomerDeliveryPreferences;
/**
 * Matches delivery window to customer preferences
 */
export declare function matchWindowToPreferences(window: DeliveryWindow, preferences: CustomerDeliveryPreferences): boolean;
/**
 * Finds preferred windows for customer
 */
export declare function findPreferredWindows(windows: DeliveryWindow[], preferences: CustomerDeliveryPreferences): DeliveryWindow[];
/**
 * Delivery Windows Controller
 */
export declare class DeliveryWindowsController {
    private readonly logger;
    createWindow(createDto: CreateDeliveryWindowDto): Promise<DeliveryWindow>;
    getWindow(id: string): Promise<DeliveryWindow>;
    updateWindow(id: string, updateDto: UpdateDeliveryWindowDto): Promise<DeliveryWindow>;
    bookWindow(id: string): Promise<DeliveryWindow>;
    getTimeSlots(id: string, slotDuration?: number): Promise<DeliveryTimeSlot[]>;
}
/**
 * Deliveries Controller
 */
export declare class DeliveriesController {
    private readonly logger;
    scheduleDelivery(scheduleDto: ScheduleDeliveryDto): Promise<Delivery>;
    getDelivery(id: string): Promise<Delivery>;
    updateStatus(id: string, status: DeliveryStatus): Promise<Delivery>;
    reschedule(id: string, body: {
        newDate: Date;
        windowId?: string;
        timeSlotId?: string;
    }): Promise<Delivery>;
    cancelDelivery(id: string, reason: string): Promise<void>;
    assignDriverToDelivery(id: string, assignDto: AssignDriverDto): Promise<Delivery>;
    getTracking(id: string): Promise<{
        url: string;
        status: DeliveryStatus;
    }>;
    captureProof(id: string, podDto: CaptureProofOfDeliveryDto): Promise<ProofOfDelivery>;
    reportException(id: string, exceptionDto: ReportDeliveryExceptionDto): Promise<DeliveryException>;
}
/**
 * Route Optimization Controller
 */
export declare class RouteOptimizationController {
    private readonly logger;
    optimizeRoute(optimizeDto: OptimizeRouteDto): Promise<DeliveryRoute>;
    getRoute(id: string): Promise<DeliveryRoute>;
    getRouteProgress(id: string): Promise<{
        progress: number;
        completedStops: number;
    }>;
    getDriverRoutes(driverId: string, date?: string): Promise<DeliveryRoute[]>;
}
/**
 * Delivery Pricing Controller
 */
export declare class DeliveryPricingController {
    private readonly logger;
    calculateCost(calculateDto: CalculateDeliveryCostDto): Promise<DeliveryPricing>;
    applyDiscount(deliveryId: string, discount: Omit<DeliveryDiscount, 'id' | 'appliedAt'>): Promise<DeliveryPricing>;
}
/**
 * Customer Preferences Controller
 */
export declare class CustomerPreferencesController {
    private readonly logger;
    getPreferences(customerId: string): Promise<CustomerDeliveryPreferences>;
    updatePreferences(customerId: string, preferencesDto: UpdateCustomerPreferencesDto): Promise<CustomerDeliveryPreferences>;
    findMatchingWindows(customerId: string): Promise<DeliveryWindow[]>;
}
/**
 * Geographic Zones Controller
 */
export declare class GeoZonesController {
    private readonly logger;
    createZone(createDto: CreateGeoZoneDto): Promise<GeoZone>;
    getZone(id: string): Promise<GeoZone>;
    checkCoordinate(coordinate: GeoCoordinate): Promise<{
        zone: GeoZone | null;
    }>;
}
/**
 * Capacity Planning Controller
 */
export declare class CapacityPlanningController {
    private readonly logger;
    calculateCapacity(dateString: string): Promise<CapacityPlanningResult>;
    predictDemand(dateString: string): Promise<{
        predictedDemand: number;
    }>;
}
/**
 * Logger instance for delivery operations
 */
export declare const deliveryLogger: any;
//# sourceMappingURL=delivery-scheduling-kit.d.ts.map