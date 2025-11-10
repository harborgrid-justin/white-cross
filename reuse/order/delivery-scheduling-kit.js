"use strict";
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliveryLogger = exports.CapacityPlanningController = exports.GeoZonesController = exports.CustomerPreferencesController = exports.DeliveryPricingController = exports.RouteOptimizationController = exports.DeliveriesController = exports.DeliveryWindowsController = exports.DeliveryWindowSchema = exports.DeliveryAddressSchema = exports.GeoCoordinateSchema = exports.CreateGeoZoneDto = exports.UpdateCustomerPreferencesDto = exports.CalculateDeliveryCostDto = exports.OptimizeRouteDto = exports.ReportDeliveryExceptionDto = exports.CaptureProofOfDeliveryDto = exports.AssignDriverDto = exports.ScheduleDeliveryDto = exports.UpdateDeliveryWindowDto = exports.CreateDeliveryWindowDto = exports.PODType = exports.DeliveryExceptionType = exports.RouteOptimizationStrategy = exports.VehicleType = exports.DriverStatus = exports.DeliveryWindowType = exports.DeliveryPriority = exports.DeliveryStatus = void 0;
exports.createDeliveryWindow = createDeliveryWindow;
exports.updateDeliveryWindow = updateDeliveryWindow;
exports.isDeliveryWindowAvailable = isDeliveryWindowAvailable;
exports.bookDeliveryWindow = bookDeliveryWindow;
exports.releaseDeliveryWindow = releaseDeliveryWindow;
exports.generateTimeSlots = generateTimeSlots;
exports.reserveTimeSlot = reserveTimeSlot;
exports.releaseTimeSlot = releaseTimeSlot;
exports.findAvailableTimeSlots = findAvailableTimeSlots;
exports.scheduleDelivery = scheduleDelivery;
exports.updateDeliveryStatus = updateDeliveryStatus;
exports.rescheduleDelivery = rescheduleDelivery;
exports.cancelDelivery = cancelDelivery;
exports.findAvailableDrivers = findAvailableDrivers;
exports.assignDriver = assignDriver;
exports.unassignDriver = unassignDriver;
exports.calculateDriverWorkload = calculateDriverWorkload;
exports.balanceDriverWorkload = balanceDriverWorkload;
exports.optimizeRouteNearestNeighbor = optimizeRouteNearestNeighbor;
exports.createDeliveryRoute = createDeliveryRoute;
exports.optimizeRouteByPriority = optimizeRouteByPriority;
exports.calculateDeliveryETA = calculateDeliveryETA;
exports.detectRouteDeviation = detectRouteDeviation;
exports.updateDeliveryLocation = updateDeliveryLocation;
exports.generateTrackingUrl = generateTrackingUrl;
exports.calculateDeliveryProgress = calculateDeliveryProgress;
exports.captureProofOfDelivery = captureProofOfDelivery;
exports.validateProofOfDelivery = validateProofOfDelivery;
exports.reportDeliveryException = reportDeliveryException;
exports.resolveDeliveryException = resolveDeliveryException;
exports.autoRescheduleFailedDelivery = autoRescheduleFailedDelivery;
exports.calculateDeliveryCapacity = calculateDeliveryCapacity;
exports.predictDeliveryDemand = predictDeliveryDemand;
exports.createGeoZone = createGeoZone;
exports.isCoordinateInZone = isCoordinateInZone;
exports.findZoneForAddress = findZoneForAddress;
exports.calculateDeliveryCost = calculateDeliveryCost;
exports.applyDeliveryDiscount = applyDeliveryDiscount;
exports.updateCustomerPreferences = updateCustomerPreferences;
exports.matchWindowToPreferences = matchWindowToPreferences;
exports.findPreferredWindows = findPreferredWindows;
/**
 * File: /reuse/order/delivery-scheduling-kit.ts
 * Locator: WC-ORD-DELSCH-001
 * Purpose: Production-Grade Delivery Scheduling & Route Optimization Kit - Enterprise delivery management toolkit
 *
 * Upstream: NestJS, Zod, date-fns, class-validator, class-transformer
 * Downstream: ../backend/delivery/*, Order Services, Fulfillment Services, Logistics Services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, zod, date-fns
 * Exports: 37 production-ready delivery scheduling and route optimization functions
 *
 * LLM Context: Production-grade delivery scheduling and route optimization utilities for White Cross platform.
 * Provides comprehensive delivery management including delivery window creation and management with time slot
 * allocation, delivery appointment scheduling with customer preferences, advanced route planning and optimization
 * algorithms (TSP, VRP, capacitated routing), driver assignment with skill-based matching, real-time delivery
 * tracking with GPS integration, delivery confirmation and Proof of Delivery (POD) capture, delivery exception
 * handling and automatic rescheduling, capacity planning for delivery fleets, dynamic time slot management
 * with availability checks, geographic zone management with polygon boundaries, delivery cost calculations
 * including distance-based and time-based pricing, customer delivery preference management, multi-stop route
 * optimization, delivery priority management, ETA calculations with traffic consideration, driver workload
 * balancing, delivery batch optimization, route deviation alerts, failed delivery handling, delivery status
 * notifications, zone-based delivery pricing, delivery SLA tracking, and comprehensive audit logging.
 * Includes advanced TypeScript patterns with generics, conditional types, mapped types, discriminated unions,
 * and utility types for maximum type safety. All functions include NestJS REST controllers with proper HTTP
 * methods, request/response DTOs, validation decorators, guards, interceptors, and comprehensive Swagger
 * documentation for production readiness.
 */
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const zod_1 = require("zod");
const date_fns_1 = require("date-fns");
// ============================================================================
// ADVANCED TYPE SYSTEM
// ============================================================================
/**
 * Delivery status enum
 */
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["PENDING"] = "pending";
    DeliveryStatus["SCHEDULED"] = "scheduled";
    DeliveryStatus["ASSIGNED"] = "assigned";
    DeliveryStatus["IN_TRANSIT"] = "in_transit";
    DeliveryStatus["OUT_FOR_DELIVERY"] = "out_for_delivery";
    DeliveryStatus["DELIVERED"] = "delivered";
    DeliveryStatus["FAILED"] = "failed";
    DeliveryStatus["CANCELLED"] = "cancelled";
    DeliveryStatus["RETURNED"] = "returned";
    DeliveryStatus["RESCHEDULED"] = "rescheduled";
})(DeliveryStatus || (exports.DeliveryStatus = DeliveryStatus = {}));
/**
 * Delivery priority enum
 */
var DeliveryPriority;
(function (DeliveryPriority) {
    DeliveryPriority["LOW"] = "low";
    DeliveryPriority["NORMAL"] = "normal";
    DeliveryPriority["HIGH"] = "high";
    DeliveryPriority["URGENT"] = "urgent";
    DeliveryPriority["SAME_DAY"] = "same_day";
    DeliveryPriority["EXPRESS"] = "express";
})(DeliveryPriority || (exports.DeliveryPriority = DeliveryPriority = {}));
/**
 * Delivery window type enum
 */
var DeliveryWindowType;
(function (DeliveryWindowType) {
    DeliveryWindowType["MORNING"] = "morning";
    DeliveryWindowType["AFTERNOON"] = "afternoon";
    DeliveryWindowType["EVENING"] = "evening";
    DeliveryWindowType["ANYTIME"] = "anytime";
    DeliveryWindowType["CUSTOM"] = "custom";
})(DeliveryWindowType || (exports.DeliveryWindowType = DeliveryWindowType = {}));
/**
 * Driver status enum
 */
var DriverStatus;
(function (DriverStatus) {
    DriverStatus["AVAILABLE"] = "available";
    DriverStatus["ON_BREAK"] = "on_break";
    DriverStatus["BUSY"] = "busy";
    DriverStatus["OFFLINE"] = "offline";
    DriverStatus["EN_ROUTE"] = "en_route";
})(DriverStatus || (exports.DriverStatus = DriverStatus = {}));
/**
 * Vehicle type enum
 */
var VehicleType;
(function (VehicleType) {
    VehicleType["BIKE"] = "bike";
    VehicleType["MOTORCYCLE"] = "motorcycle";
    VehicleType["CAR"] = "car";
    VehicleType["VAN"] = "van";
    VehicleType["TRUCK"] = "truck";
    VehicleType["REFRIGERATED"] = "refrigerated";
})(VehicleType || (exports.VehicleType = VehicleType = {}));
/**
 * Route optimization strategy enum
 */
var RouteOptimizationStrategy;
(function (RouteOptimizationStrategy) {
    RouteOptimizationStrategy["SHORTEST_DISTANCE"] = "shortest_distance";
    RouteOptimizationStrategy["FASTEST_TIME"] = "fastest_time";
    RouteOptimizationStrategy["BALANCED"] = "balanced";
    RouteOptimizationStrategy["COST_OPTIMIZED"] = "cost_optimized";
    RouteOptimizationStrategy["PRIORITY_FIRST"] = "priority_first";
})(RouteOptimizationStrategy || (exports.RouteOptimizationStrategy = RouteOptimizationStrategy = {}));
/**
 * Delivery exception type enum
 */
var DeliveryExceptionType;
(function (DeliveryExceptionType) {
    DeliveryExceptionType["ADDRESS_NOT_FOUND"] = "address_not_found";
    DeliveryExceptionType["CUSTOMER_UNAVAILABLE"] = "customer_unavailable";
    DeliveryExceptionType["WEATHER_DELAY"] = "weather_delay";
    DeliveryExceptionType["VEHICLE_BREAKDOWN"] = "vehicle_breakdown";
    DeliveryExceptionType["TRAFFIC_DELAY"] = "traffic_delay";
    DeliveryExceptionType["INCORRECT_ADDRESS"] = "incorrect_address";
    DeliveryExceptionType["ACCESS_DENIED"] = "access_denied";
    DeliveryExceptionType["DAMAGED_GOODS"] = "damaged_goods";
    DeliveryExceptionType["REFUSED_BY_CUSTOMER"] = "refused_by_customer";
    DeliveryExceptionType["OTHER"] = "other";
})(DeliveryExceptionType || (exports.DeliveryExceptionType = DeliveryExceptionType = {}));
/**
 * POD (Proof of Delivery) type enum
 */
var PODType;
(function (PODType) {
    PODType["SIGNATURE"] = "signature";
    PODType["PHOTO"] = "photo";
    PODType["OTP"] = "otp";
    PODType["BARCODE_SCAN"] = "barcode_scan";
    PODType["CONTACTLESS"] = "contactless";
})(PODType || (exports.PODType = PODType = {}));
// ============================================================================
// DTO CLASSES FOR NESTJS CONTROLLERS
// ============================================================================
/**
 * Create delivery window DTO
 */
let CreateDeliveryWindowDto = (() => {
    var _a;
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _startTime_decorators;
    let _startTime_initializers = [];
    let _startTime_extraInitializers = [];
    let _endTime_decorators;
    let _endTime_initializers = [];
    let _endTime_extraInitializers = [];
    let _capacity_decorators;
    let _capacity_initializers = [];
    let _capacity_extraInitializers = [];
    let _zoneId_decorators;
    let _zoneId_initializers = [];
    let _zoneId_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateDeliveryWindowDto {
            constructor() {
                this.type = __runInitializers(this, _type_initializers, void 0);
                this.startTime = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _startTime_initializers, void 0));
                this.endTime = (__runInitializers(this, _startTime_extraInitializers), __runInitializers(this, _endTime_initializers, void 0));
                this.capacity = (__runInitializers(this, _endTime_extraInitializers), __runInitializers(this, _capacity_initializers, void 0));
                this.zoneId = (__runInitializers(this, _capacity_extraInitializers), __runInitializers(this, _zoneId_initializers, void 0));
                this.metadata = (__runInitializers(this, _zoneId_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _type_decorators = [(0, swagger_1.ApiProperty)({ enum: DeliveryWindowType }), (0, class_validator_1.IsEnum)(DeliveryWindowType)];
            _startTime_decorators = [(0, swagger_1.ApiProperty)({ type: Date }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _endTime_decorators = [(0, swagger_1.ApiProperty)({ type: Date }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _capacity_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _zoneId_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsOptional)()];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ required: false, type: Object }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _startTime_decorators, { kind: "field", name: "startTime", static: false, private: false, access: { has: obj => "startTime" in obj, get: obj => obj.startTime, set: (obj, value) => { obj.startTime = value; } }, metadata: _metadata }, _startTime_initializers, _startTime_extraInitializers);
            __esDecorate(null, null, _endTime_decorators, { kind: "field", name: "endTime", static: false, private: false, access: { has: obj => "endTime" in obj, get: obj => obj.endTime, set: (obj, value) => { obj.endTime = value; } }, metadata: _metadata }, _endTime_initializers, _endTime_extraInitializers);
            __esDecorate(null, null, _capacity_decorators, { kind: "field", name: "capacity", static: false, private: false, access: { has: obj => "capacity" in obj, get: obj => obj.capacity, set: (obj, value) => { obj.capacity = value; } }, metadata: _metadata }, _capacity_initializers, _capacity_extraInitializers);
            __esDecorate(null, null, _zoneId_decorators, { kind: "field", name: "zoneId", static: false, private: false, access: { has: obj => "zoneId" in obj, get: obj => obj.zoneId, set: (obj, value) => { obj.zoneId = value; } }, metadata: _metadata }, _zoneId_initializers, _zoneId_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateDeliveryWindowDto = CreateDeliveryWindowDto;
/**
 * Update delivery window DTO
 */
let UpdateDeliveryWindowDto = (() => {
    var _a;
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _capacity_decorators;
    let _capacity_initializers = [];
    let _capacity_extraInitializers = [];
    let _available_decorators;
    let _available_initializers = [];
    let _available_extraInitializers = [];
    return _a = class UpdateDeliveryWindowDto {
            constructor() {
                this.type = __runInitializers(this, _type_initializers, void 0);
                this.capacity = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _capacity_initializers, void 0));
                this.available = (__runInitializers(this, _capacity_extraInitializers), __runInitializers(this, _available_initializers, void 0));
                __runInitializers(this, _available_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _type_decorators = [(0, swagger_1.ApiProperty)({ enum: DeliveryWindowType, required: false }), (0, class_validator_1.IsEnum)(DeliveryWindowType), (0, class_validator_1.IsOptional)()];
            _capacity_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.IsOptional)()];
            _available_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _capacity_decorators, { kind: "field", name: "capacity", static: false, private: false, access: { has: obj => "capacity" in obj, get: obj => obj.capacity, set: (obj, value) => { obj.capacity = value; } }, metadata: _metadata }, _capacity_initializers, _capacity_extraInitializers);
            __esDecorate(null, null, _available_decorators, { kind: "field", name: "available", static: false, private: false, access: { has: obj => "available" in obj, get: obj => obj.available, set: (obj, value) => { obj.available = value; } }, metadata: _metadata }, _available_initializers, _available_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateDeliveryWindowDto = UpdateDeliveryWindowDto;
/**
 * Schedule delivery DTO
 */
let ScheduleDeliveryDto = (() => {
    var _a;
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _scheduledDate_decorators;
    let _scheduledDate_initializers = [];
    let _scheduledDate_extraInitializers = [];
    let _windowId_decorators;
    let _windowId_initializers = [];
    let _windowId_extraInitializers = [];
    let _timeSlotId_decorators;
    let _timeSlotId_initializers = [];
    let _timeSlotId_extraInitializers = [];
    let _pickupAddress_decorators;
    let _pickupAddress_initializers = [];
    let _pickupAddress_extraInitializers = [];
    let _deliveryAddress_decorators;
    let _deliveryAddress_initializers = [];
    let _deliveryAddress_extraInitializers = [];
    let _items_decorators;
    let _items_initializers = [];
    let _items_extraInitializers = [];
    let _specialInstructions_decorators;
    let _specialInstructions_initializers = [];
    let _specialInstructions_extraInitializers = [];
    let _requiresSignature_decorators;
    let _requiresSignature_initializers = [];
    let _requiresSignature_extraInitializers = [];
    let _allowContactless_decorators;
    let _allowContactless_initializers = [];
    let _allowContactless_extraInitializers = [];
    return _a = class ScheduleDeliveryDto {
            constructor() {
                this.orderId = __runInitializers(this, _orderId_initializers, void 0);
                this.customerId = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
                this.priority = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.scheduledDate = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _scheduledDate_initializers, void 0));
                this.windowId = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _windowId_initializers, void 0));
                this.timeSlotId = (__runInitializers(this, _windowId_extraInitializers), __runInitializers(this, _timeSlotId_initializers, void 0));
                this.pickupAddress = (__runInitializers(this, _timeSlotId_extraInitializers), __runInitializers(this, _pickupAddress_initializers, void 0));
                this.deliveryAddress = (__runInitializers(this, _pickupAddress_extraInitializers), __runInitializers(this, _deliveryAddress_initializers, void 0));
                this.items = (__runInitializers(this, _deliveryAddress_extraInitializers), __runInitializers(this, _items_initializers, void 0));
                this.specialInstructions = (__runInitializers(this, _items_extraInitializers), __runInitializers(this, _specialInstructions_initializers, void 0));
                this.requiresSignature = (__runInitializers(this, _specialInstructions_extraInitializers), __runInitializers(this, _requiresSignature_initializers, void 0));
                this.allowContactless = (__runInitializers(this, _requiresSignature_extraInitializers), __runInitializers(this, _allowContactless_initializers, void 0));
                __runInitializers(this, _allowContactless_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _orderId_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsUUID)()];
            _customerId_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsUUID)()];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ enum: DeliveryPriority }), (0, class_validator_1.IsEnum)(DeliveryPriority)];
            _scheduledDate_decorators = [(0, swagger_1.ApiProperty)({ type: Date }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _windowId_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsOptional)()];
            _timeSlotId_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsOptional)()];
            _pickupAddress_decorators = [(0, swagger_1.ApiProperty)({ type: Object }), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => Object)];
            _deliveryAddress_decorators = [(0, swagger_1.ApiProperty)({ type: Object }), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => Object)];
            _items_decorators = [(0, swagger_1.ApiProperty)({ type: [Object] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_validator_1.ArrayMinSize)(1)];
            _specialInstructions_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(500)];
            _requiresSignature_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _allowContactless_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: obj => "scheduledDate" in obj, get: obj => obj.scheduledDate, set: (obj, value) => { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
            __esDecorate(null, null, _windowId_decorators, { kind: "field", name: "windowId", static: false, private: false, access: { has: obj => "windowId" in obj, get: obj => obj.windowId, set: (obj, value) => { obj.windowId = value; } }, metadata: _metadata }, _windowId_initializers, _windowId_extraInitializers);
            __esDecorate(null, null, _timeSlotId_decorators, { kind: "field", name: "timeSlotId", static: false, private: false, access: { has: obj => "timeSlotId" in obj, get: obj => obj.timeSlotId, set: (obj, value) => { obj.timeSlotId = value; } }, metadata: _metadata }, _timeSlotId_initializers, _timeSlotId_extraInitializers);
            __esDecorate(null, null, _pickupAddress_decorators, { kind: "field", name: "pickupAddress", static: false, private: false, access: { has: obj => "pickupAddress" in obj, get: obj => obj.pickupAddress, set: (obj, value) => { obj.pickupAddress = value; } }, metadata: _metadata }, _pickupAddress_initializers, _pickupAddress_extraInitializers);
            __esDecorate(null, null, _deliveryAddress_decorators, { kind: "field", name: "deliveryAddress", static: false, private: false, access: { has: obj => "deliveryAddress" in obj, get: obj => obj.deliveryAddress, set: (obj, value) => { obj.deliveryAddress = value; } }, metadata: _metadata }, _deliveryAddress_initializers, _deliveryAddress_extraInitializers);
            __esDecorate(null, null, _items_decorators, { kind: "field", name: "items", static: false, private: false, access: { has: obj => "items" in obj, get: obj => obj.items, set: (obj, value) => { obj.items = value; } }, metadata: _metadata }, _items_initializers, _items_extraInitializers);
            __esDecorate(null, null, _specialInstructions_decorators, { kind: "field", name: "specialInstructions", static: false, private: false, access: { has: obj => "specialInstructions" in obj, get: obj => obj.specialInstructions, set: (obj, value) => { obj.specialInstructions = value; } }, metadata: _metadata }, _specialInstructions_initializers, _specialInstructions_extraInitializers);
            __esDecorate(null, null, _requiresSignature_decorators, { kind: "field", name: "requiresSignature", static: false, private: false, access: { has: obj => "requiresSignature" in obj, get: obj => obj.requiresSignature, set: (obj, value) => { obj.requiresSignature = value; } }, metadata: _metadata }, _requiresSignature_initializers, _requiresSignature_extraInitializers);
            __esDecorate(null, null, _allowContactless_decorators, { kind: "field", name: "allowContactless", static: false, private: false, access: { has: obj => "allowContactless" in obj, get: obj => obj.allowContactless, set: (obj, value) => { obj.allowContactless = value; } }, metadata: _metadata }, _allowContactless_initializers, _allowContactless_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ScheduleDeliveryDto = ScheduleDeliveryDto;
/**
 * Assign driver DTO
 */
let AssignDriverDto = (() => {
    var _a;
    let _driverId_decorators;
    let _driverId_initializers = [];
    let _driverId_extraInitializers = [];
    let _estimatedDeliveryTime_decorators;
    let _estimatedDeliveryTime_initializers = [];
    let _estimatedDeliveryTime_extraInitializers = [];
    return _a = class AssignDriverDto {
            constructor() {
                this.driverId = __runInitializers(this, _driverId_initializers, void 0);
                this.estimatedDeliveryTime = (__runInitializers(this, _driverId_extraInitializers), __runInitializers(this, _estimatedDeliveryTime_initializers, void 0));
                __runInitializers(this, _estimatedDeliveryTime_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _driverId_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsUUID)()];
            _estimatedDeliveryTime_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _driverId_decorators, { kind: "field", name: "driverId", static: false, private: false, access: { has: obj => "driverId" in obj, get: obj => obj.driverId, set: (obj, value) => { obj.driverId = value; } }, metadata: _metadata }, _driverId_initializers, _driverId_extraInitializers);
            __esDecorate(null, null, _estimatedDeliveryTime_decorators, { kind: "field", name: "estimatedDeliveryTime", static: false, private: false, access: { has: obj => "estimatedDeliveryTime" in obj, get: obj => obj.estimatedDeliveryTime, set: (obj, value) => { obj.estimatedDeliveryTime = value; } }, metadata: _metadata }, _estimatedDeliveryTime_initializers, _estimatedDeliveryTime_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AssignDriverDto = AssignDriverDto;
/**
 * Capture POD DTO
 */
let CaptureProofOfDeliveryDto = (() => {
    var _a;
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _recipientName_decorators;
    let _recipientName_initializers = [];
    let _recipientName_extraInitializers = [];
    let _recipientPhone_decorators;
    let _recipientPhone_initializers = [];
    let _recipientPhone_extraInitializers = [];
    let _signatureUrl_decorators;
    let _signatureUrl_initializers = [];
    let _signatureUrl_extraInitializers = [];
    let _photoUrls_decorators;
    let _photoUrls_initializers = [];
    let _photoUrls_extraInitializers = [];
    let _otp_decorators;
    let _otp_initializers = [];
    let _otp_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    return _a = class CaptureProofOfDeliveryDto {
            constructor() {
                this.type = __runInitializers(this, _type_initializers, void 0);
                this.recipientName = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _recipientName_initializers, void 0));
                this.recipientPhone = (__runInitializers(this, _recipientName_extraInitializers), __runInitializers(this, _recipientPhone_initializers, void 0));
                this.signatureUrl = (__runInitializers(this, _recipientPhone_extraInitializers), __runInitializers(this, _signatureUrl_initializers, void 0));
                this.photoUrls = (__runInitializers(this, _signatureUrl_extraInitializers), __runInitializers(this, _photoUrls_initializers, void 0));
                this.otp = (__runInitializers(this, _photoUrls_extraInitializers), __runInitializers(this, _otp_initializers, void 0));
                this.notes = (__runInitializers(this, _otp_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                this.location = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _location_initializers, void 0));
                __runInitializers(this, _location_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _type_decorators = [(0, swagger_1.ApiProperty)({ enum: PODType }), (0, class_validator_1.IsEnum)(PODType)];
            _recipientName_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _recipientPhone_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _signatureUrl_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _photoUrls_decorators = [(0, swagger_1.ApiProperty)({ required: false, type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.IsOptional)()];
            _otp_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _notes_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _location_decorators = [(0, swagger_1.ApiProperty)({ required: false, type: Object }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _recipientName_decorators, { kind: "field", name: "recipientName", static: false, private: false, access: { has: obj => "recipientName" in obj, get: obj => obj.recipientName, set: (obj, value) => { obj.recipientName = value; } }, metadata: _metadata }, _recipientName_initializers, _recipientName_extraInitializers);
            __esDecorate(null, null, _recipientPhone_decorators, { kind: "field", name: "recipientPhone", static: false, private: false, access: { has: obj => "recipientPhone" in obj, get: obj => obj.recipientPhone, set: (obj, value) => { obj.recipientPhone = value; } }, metadata: _metadata }, _recipientPhone_initializers, _recipientPhone_extraInitializers);
            __esDecorate(null, null, _signatureUrl_decorators, { kind: "field", name: "signatureUrl", static: false, private: false, access: { has: obj => "signatureUrl" in obj, get: obj => obj.signatureUrl, set: (obj, value) => { obj.signatureUrl = value; } }, metadata: _metadata }, _signatureUrl_initializers, _signatureUrl_extraInitializers);
            __esDecorate(null, null, _photoUrls_decorators, { kind: "field", name: "photoUrls", static: false, private: false, access: { has: obj => "photoUrls" in obj, get: obj => obj.photoUrls, set: (obj, value) => { obj.photoUrls = value; } }, metadata: _metadata }, _photoUrls_initializers, _photoUrls_extraInitializers);
            __esDecorate(null, null, _otp_decorators, { kind: "field", name: "otp", static: false, private: false, access: { has: obj => "otp" in obj, get: obj => obj.otp, set: (obj, value) => { obj.otp = value; } }, metadata: _metadata }, _otp_initializers, _otp_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CaptureProofOfDeliveryDto = CaptureProofOfDeliveryDto;
/**
 * Report exception DTO
 */
let ReportDeliveryExceptionDto = (() => {
    var _a;
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _photos_decorators;
    let _photos_initializers = [];
    let _photos_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    return _a = class ReportDeliveryExceptionDto {
            constructor() {
                this.type = __runInitializers(this, _type_initializers, void 0);
                this.description = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.photos = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _photos_initializers, void 0));
                this.location = (__runInitializers(this, _photos_extraInitializers), __runInitializers(this, _location_initializers, void 0));
                __runInitializers(this, _location_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _type_decorators = [(0, swagger_1.ApiProperty)({ enum: DeliveryExceptionType }), (0, class_validator_1.IsEnum)(DeliveryExceptionType)];
            _description_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(10), (0, class_validator_1.MaxLength)(1000)];
            _photos_decorators = [(0, swagger_1.ApiProperty)({ required: false, type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.IsOptional)()];
            _location_decorators = [(0, swagger_1.ApiProperty)({ required: false, type: Object }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _photos_decorators, { kind: "field", name: "photos", static: false, private: false, access: { has: obj => "photos" in obj, get: obj => obj.photos, set: (obj, value) => { obj.photos = value; } }, metadata: _metadata }, _photos_initializers, _photos_extraInitializers);
            __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ReportDeliveryExceptionDto = ReportDeliveryExceptionDto;
/**
 * Optimize route DTO
 */
let OptimizeRouteDto = (() => {
    var _a;
    let _deliveryIds_decorators;
    let _deliveryIds_initializers = [];
    let _deliveryIds_extraInitializers = [];
    let _strategy_decorators;
    let _strategy_initializers = [];
    let _strategy_extraInitializers = [];
    let _driverId_decorators;
    let _driverId_initializers = [];
    let _driverId_extraInitializers = [];
    let _startLocation_decorators;
    let _startLocation_initializers = [];
    let _startLocation_extraInitializers = [];
    return _a = class OptimizeRouteDto {
            constructor() {
                this.deliveryIds = __runInitializers(this, _deliveryIds_initializers, void 0);
                this.strategy = (__runInitializers(this, _deliveryIds_extraInitializers), __runInitializers(this, _strategy_initializers, void 0));
                this.driverId = (__runInitializers(this, _strategy_extraInitializers), __runInitializers(this, _driverId_initializers, void 0));
                this.startLocation = (__runInitializers(this, _driverId_extraInitializers), __runInitializers(this, _startLocation_initializers, void 0));
                __runInitializers(this, _startLocation_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _deliveryIds_decorators = [(0, swagger_1.ApiProperty)({ type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsUUID)(undefined, { each: true }), (0, class_validator_1.ArrayMinSize)(1)];
            _strategy_decorators = [(0, swagger_1.ApiProperty)({ enum: RouteOptimizationStrategy }), (0, class_validator_1.IsEnum)(RouteOptimizationStrategy)];
            _driverId_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsOptional)()];
            _startLocation_decorators = [(0, swagger_1.ApiProperty)({ type: Object }), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => Object)];
            __esDecorate(null, null, _deliveryIds_decorators, { kind: "field", name: "deliveryIds", static: false, private: false, access: { has: obj => "deliveryIds" in obj, get: obj => obj.deliveryIds, set: (obj, value) => { obj.deliveryIds = value; } }, metadata: _metadata }, _deliveryIds_initializers, _deliveryIds_extraInitializers);
            __esDecorate(null, null, _strategy_decorators, { kind: "field", name: "strategy", static: false, private: false, access: { has: obj => "strategy" in obj, get: obj => obj.strategy, set: (obj, value) => { obj.strategy = value; } }, metadata: _metadata }, _strategy_initializers, _strategy_extraInitializers);
            __esDecorate(null, null, _driverId_decorators, { kind: "field", name: "driverId", static: false, private: false, access: { has: obj => "driverId" in obj, get: obj => obj.driverId, set: (obj, value) => { obj.driverId = value; } }, metadata: _metadata }, _driverId_initializers, _driverId_extraInitializers);
            __esDecorate(null, null, _startLocation_decorators, { kind: "field", name: "startLocation", static: false, private: false, access: { has: obj => "startLocation" in obj, get: obj => obj.startLocation, set: (obj, value) => { obj.startLocation = value; } }, metadata: _metadata }, _startLocation_initializers, _startLocation_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.OptimizeRouteDto = OptimizeRouteDto;
/**
 * Calculate delivery cost DTO
 */
let CalculateDeliveryCostDto = (() => {
    var _a;
    let _pickupAddress_decorators;
    let _pickupAddress_initializers = [];
    let _pickupAddress_extraInitializers = [];
    let _deliveryAddress_decorators;
    let _deliveryAddress_initializers = [];
    let _deliveryAddress_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _weight_decorators;
    let _weight_initializers = [];
    let _weight_extraInitializers = [];
    let _volume_decorators;
    let _volume_initializers = [];
    let _volume_extraInitializers = [];
    let _zoneId_decorators;
    let _zoneId_initializers = [];
    let _zoneId_extraInitializers = [];
    return _a = class CalculateDeliveryCostDto {
            constructor() {
                this.pickupAddress = __runInitializers(this, _pickupAddress_initializers, void 0);
                this.deliveryAddress = (__runInitializers(this, _pickupAddress_extraInitializers), __runInitializers(this, _deliveryAddress_initializers, void 0));
                this.priority = (__runInitializers(this, _deliveryAddress_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.weight = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _weight_initializers, void 0));
                this.volume = (__runInitializers(this, _weight_extraInitializers), __runInitializers(this, _volume_initializers, void 0));
                this.zoneId = (__runInitializers(this, _volume_extraInitializers), __runInitializers(this, _zoneId_initializers, void 0));
                __runInitializers(this, _zoneId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _pickupAddress_decorators = [(0, swagger_1.ApiProperty)({ type: Object }), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => Object)];
            _deliveryAddress_decorators = [(0, swagger_1.ApiProperty)({ type: Object }), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => Object)];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ enum: DeliveryPriority }), (0, class_validator_1.IsEnum)(DeliveryPriority)];
            _weight_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.IsOptional)()];
            _volume_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.IsOptional)()];
            _zoneId_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _pickupAddress_decorators, { kind: "field", name: "pickupAddress", static: false, private: false, access: { has: obj => "pickupAddress" in obj, get: obj => obj.pickupAddress, set: (obj, value) => { obj.pickupAddress = value; } }, metadata: _metadata }, _pickupAddress_initializers, _pickupAddress_extraInitializers);
            __esDecorate(null, null, _deliveryAddress_decorators, { kind: "field", name: "deliveryAddress", static: false, private: false, access: { has: obj => "deliveryAddress" in obj, get: obj => obj.deliveryAddress, set: (obj, value) => { obj.deliveryAddress = value; } }, metadata: _metadata }, _deliveryAddress_initializers, _deliveryAddress_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _weight_decorators, { kind: "field", name: "weight", static: false, private: false, access: { has: obj => "weight" in obj, get: obj => obj.weight, set: (obj, value) => { obj.weight = value; } }, metadata: _metadata }, _weight_initializers, _weight_extraInitializers);
            __esDecorate(null, null, _volume_decorators, { kind: "field", name: "volume", static: false, private: false, access: { has: obj => "volume" in obj, get: obj => obj.volume, set: (obj, value) => { obj.volume = value; } }, metadata: _metadata }, _volume_initializers, _volume_extraInitializers);
            __esDecorate(null, null, _zoneId_decorators, { kind: "field", name: "zoneId", static: false, private: false, access: { has: obj => "zoneId" in obj, get: obj => obj.zoneId, set: (obj, value) => { obj.zoneId = value; } }, metadata: _metadata }, _zoneId_initializers, _zoneId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CalculateDeliveryCostDto = CalculateDeliveryCostDto;
/**
 * Customer preferences DTO
 */
let UpdateCustomerPreferencesDto = (() => {
    var _a;
    let _preferredTimeWindows_decorators;
    let _preferredTimeWindows_initializers = [];
    let _preferredTimeWindows_extraInitializers = [];
    let _preferredDays_decorators;
    let _preferredDays_initializers = [];
    let _preferredDays_extraInitializers = [];
    let _specialInstructions_decorators;
    let _specialInstructions_initializers = [];
    let _specialInstructions_extraInitializers = [];
    let _requiresSignature_decorators;
    let _requiresSignature_initializers = [];
    let _requiresSignature_extraInitializers = [];
    let _allowContactless_decorators;
    let _allowContactless_initializers = [];
    let _allowContactless_extraInitializers = [];
    let _preferredContactMethod_decorators;
    let _preferredContactMethod_initializers = [];
    let _preferredContactMethod_extraInitializers = [];
    return _a = class UpdateCustomerPreferencesDto {
            constructor() {
                this.preferredTimeWindows = __runInitializers(this, _preferredTimeWindows_initializers, void 0);
                this.preferredDays = (__runInitializers(this, _preferredTimeWindows_extraInitializers), __runInitializers(this, _preferredDays_initializers, void 0));
                this.specialInstructions = (__runInitializers(this, _preferredDays_extraInitializers), __runInitializers(this, _specialInstructions_initializers, void 0));
                this.requiresSignature = (__runInitializers(this, _specialInstructions_extraInitializers), __runInitializers(this, _requiresSignature_initializers, void 0));
                this.allowContactless = (__runInitializers(this, _requiresSignature_extraInitializers), __runInitializers(this, _allowContactless_initializers, void 0));
                this.preferredContactMethod = (__runInitializers(this, _allowContactless_extraInitializers), __runInitializers(this, _preferredContactMethod_initializers, void 0));
                __runInitializers(this, _preferredContactMethod_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _preferredTimeWindows_decorators = [(0, swagger_1.ApiProperty)({ type: [String], enum: DeliveryWindowType }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsEnum)(DeliveryWindowType, { each: true })];
            _preferredDays_decorators = [(0, swagger_1.ApiProperty)({ type: [Number] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsNumber)({}, { each: true })];
            _specialInstructions_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(500)];
            _requiresSignature_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsBoolean)()];
            _allowContactless_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsBoolean)()];
            _preferredContactMethod_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsEnum)(['phone', 'email', 'sms']), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _preferredTimeWindows_decorators, { kind: "field", name: "preferredTimeWindows", static: false, private: false, access: { has: obj => "preferredTimeWindows" in obj, get: obj => obj.preferredTimeWindows, set: (obj, value) => { obj.preferredTimeWindows = value; } }, metadata: _metadata }, _preferredTimeWindows_initializers, _preferredTimeWindows_extraInitializers);
            __esDecorate(null, null, _preferredDays_decorators, { kind: "field", name: "preferredDays", static: false, private: false, access: { has: obj => "preferredDays" in obj, get: obj => obj.preferredDays, set: (obj, value) => { obj.preferredDays = value; } }, metadata: _metadata }, _preferredDays_initializers, _preferredDays_extraInitializers);
            __esDecorate(null, null, _specialInstructions_decorators, { kind: "field", name: "specialInstructions", static: false, private: false, access: { has: obj => "specialInstructions" in obj, get: obj => obj.specialInstructions, set: (obj, value) => { obj.specialInstructions = value; } }, metadata: _metadata }, _specialInstructions_initializers, _specialInstructions_extraInitializers);
            __esDecorate(null, null, _requiresSignature_decorators, { kind: "field", name: "requiresSignature", static: false, private: false, access: { has: obj => "requiresSignature" in obj, get: obj => obj.requiresSignature, set: (obj, value) => { obj.requiresSignature = value; } }, metadata: _metadata }, _requiresSignature_initializers, _requiresSignature_extraInitializers);
            __esDecorate(null, null, _allowContactless_decorators, { kind: "field", name: "allowContactless", static: false, private: false, access: { has: obj => "allowContactless" in obj, get: obj => obj.allowContactless, set: (obj, value) => { obj.allowContactless = value; } }, metadata: _metadata }, _allowContactless_initializers, _allowContactless_extraInitializers);
            __esDecorate(null, null, _preferredContactMethod_decorators, { kind: "field", name: "preferredContactMethod", static: false, private: false, access: { has: obj => "preferredContactMethod" in obj, get: obj => obj.preferredContactMethod, set: (obj, value) => { obj.preferredContactMethod = value; } }, metadata: _metadata }, _preferredContactMethod_initializers, _preferredContactMethod_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateCustomerPreferencesDto = UpdateCustomerPreferencesDto;
/**
 * Create geographic zone DTO
 */
let CreateGeoZoneDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _coordinates_decorators;
    let _coordinates_initializers = [];
    let _coordinates_extraInitializers = [];
    let _centerPoint_decorators;
    let _centerPoint_initializers = [];
    let _centerPoint_extraInitializers = [];
    let _radius_decorators;
    let _radius_initializers = [];
    let _radius_extraInitializers = [];
    return _a = class CreateGeoZoneDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.type = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.coordinates = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _coordinates_initializers, void 0));
                this.centerPoint = (__runInitializers(this, _coordinates_extraInitializers), __runInitializers(this, _centerPoint_initializers, void 0));
                this.radius = (__runInitializers(this, _centerPoint_extraInitializers), __runInitializers(this, _radius_initializers, void 0));
                __runInitializers(this, _radius_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _type_decorators = [(0, swagger_1.ApiProperty)({ enum: ['polygon', 'circle', 'rectangle'] }), (0, class_validator_1.IsEnum)(['polygon', 'circle', 'rectangle'])];
            _coordinates_decorators = [(0, swagger_1.ApiProperty)({ type: [Object] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_validator_1.ArrayMinSize)(3)];
            _centerPoint_decorators = [(0, swagger_1.ApiProperty)({ required: false, type: Object }), (0, class_validator_1.IsOptional)()];
            _radius_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _coordinates_decorators, { kind: "field", name: "coordinates", static: false, private: false, access: { has: obj => "coordinates" in obj, get: obj => obj.coordinates, set: (obj, value) => { obj.coordinates = value; } }, metadata: _metadata }, _coordinates_initializers, _coordinates_extraInitializers);
            __esDecorate(null, null, _centerPoint_decorators, { kind: "field", name: "centerPoint", static: false, private: false, access: { has: obj => "centerPoint" in obj, get: obj => obj.centerPoint, set: (obj, value) => { obj.centerPoint = value; } }, metadata: _metadata }, _centerPoint_initializers, _centerPoint_extraInitializers);
            __esDecorate(null, null, _radius_decorators, { kind: "field", name: "radius", static: false, private: false, access: { has: obj => "radius" in obj, get: obj => obj.radius, set: (obj, value) => { obj.radius = value; } }, metadata: _metadata }, _radius_initializers, _radius_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateGeoZoneDto = CreateGeoZoneDto;
// ============================================================================
// VALIDATION SCHEMAS (ZOD)
// ============================================================================
exports.GeoCoordinateSchema = zod_1.z.object({
    latitude: zod_1.z.number().min(-90).max(90),
    longitude: zod_1.z.number().min(-180).max(180),
    altitude: zod_1.z.number().optional(),
});
exports.DeliveryAddressSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    street: zod_1.z.string().min(1).max(200),
    city: zod_1.z.string().min(1).max(100),
    state: zod_1.z.string().min(1).max(100),
    zipCode: zod_1.z.string().min(3).max(20),
    country: zod_1.z.string().min(2).max(100),
    coordinates: exports.GeoCoordinateSchema.optional(),
    instructions: zod_1.z.string().max(500).optional(),
    contactName: zod_1.z.string().min(1).max(100),
    contactPhone: zod_1.z.string().min(10).max(20),
    contactEmail: zod_1.z.string().email().optional(),
    accessCode: zod_1.z.string().max(50).optional(),
});
exports.DeliveryWindowSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    type: zod_1.z.nativeEnum(DeliveryWindowType),
    startTime: zod_1.z.date(),
    endTime: zod_1.z.date(),
    capacity: zod_1.z.number().int().min(1),
    bookedCount: zod_1.z.number().int().min(0),
    available: zod_1.z.boolean(),
    zoneId: zod_1.z.string().uuid().optional(),
    pricing: zod_1.z.any().optional(),
    metadata: zod_1.z.record(zod_1.z.unknown()).optional(),
});
// ============================================================================
// DELIVERY WINDOW MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Creates a new delivery window
 */
function createDeliveryWindow(data) {
    if ((0, date_fns_1.isAfter)(data.startTime, data.endTime)) {
        throw new common_1.BadRequestException('Start time must be before end time');
    }
    return {
        id: generateUUID(),
        type: data.type,
        startTime: data.startTime,
        endTime: data.endTime,
        capacity: data.capacity,
        bookedCount: 0,
        available: true,
        zoneId: data.zoneId,
        metadata: data.metadata,
    };
}
/**
 * Updates delivery window
 */
function updateDeliveryWindow(window, updates) {
    return {
        ...window,
        ...updates,
    };
}
/**
 * Checks if delivery window is available
 */
function isDeliveryWindowAvailable(window) {
    return window.available && window.bookedCount < window.capacity;
}
/**
 * Books a slot in delivery window
 */
function bookDeliveryWindow(window) {
    if (!isDeliveryWindowAvailable(window)) {
        throw new common_1.ConflictException('Delivery window is not available');
    }
    return {
        ...window,
        bookedCount: window.bookedCount + 1,
        available: window.bookedCount + 1 < window.capacity,
    };
}
/**
 * Releases a slot in delivery window
 */
function releaseDeliveryWindow(window) {
    return {
        ...window,
        bookedCount: Math.max(0, window.bookedCount - 1),
        available: true,
    };
}
// ============================================================================
// TIME SLOT MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Generates time slots for a delivery window
 */
function generateTimeSlots(window, slotDuration = 30) {
    const slots = [];
    let currentTime = new Date(window.startTime);
    while ((0, date_fns_1.isBefore)(currentTime, window.endTime)) {
        const slotEnd = (0, date_fns_1.addMinutes)(currentTime, slotDuration);
        if ((0, date_fns_1.isAfter)(slotEnd, window.endTime)) {
            break;
        }
        slots.push({
            id: generateUUID(),
            windowId: window.id,
            startTime: new Date(currentTime),
            endTime: slotEnd,
            available: true,
            reserved: false,
            zoneId: window.zoneId,
        });
        currentTime = slotEnd;
    }
    return slots;
}
/**
 * Reserves a time slot
 */
function reserveTimeSlot(slot, deliveryId) {
    if (!slot.available || slot.reserved) {
        throw new common_1.ConflictException('Time slot is not available');
    }
    return {
        ...slot,
        available: false,
        reserved: true,
        deliveryId,
    };
}
/**
 * Releases a time slot
 */
function releaseTimeSlot(slot) {
    return {
        ...slot,
        available: true,
        reserved: false,
        deliveryId: undefined,
    };
}
/**
 * Finds available time slots for date
 */
function findAvailableTimeSlots(slots, date, zoneId) {
    const dayStart = (0, date_fns_1.startOfDay)(date);
    const dayEnd = (0, date_fns_1.endOfDay)(date);
    return slots.filter(slot => {
        const inDateRange = (0, date_fns_1.isWithinInterval)(slot.startTime, { start: dayStart, end: dayEnd });
        const isAvailable = slot.available && !slot.reserved;
        const inZone = !zoneId || slot.zoneId === zoneId;
        return inDateRange && isAvailable && inZone;
    });
}
// ============================================================================
// DELIVERY SCHEDULING FUNCTIONS
// ============================================================================
/**
 * Schedules a new delivery
 */
function scheduleDelivery(data) {
    const delivery = {
        id: generateUUID(),
        orderId: data.orderId,
        customerId: data.customerId,
        status: DeliveryStatus.PENDING,
        priority: data.priority,
        scheduledDate: data.scheduledDate,
        pickupAddress: data.pickupAddress,
        deliveryAddress: data.deliveryAddress,
        items: data.items,
        specialInstructions: data.specialInstructions,
        requiresSignature: data.requiresSignature ?? true,
        allowContactless: data.allowContactless ?? false,
        exceptions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return delivery;
}
/**
 * Updates delivery status
 */
function updateDeliveryStatus(delivery, status) {
    return {
        ...delivery,
        status,
        updatedAt: new Date(),
    };
}
/**
 * Reschedules a delivery
 */
function rescheduleDelivery(delivery, newDate, windowId, timeSlotId) {
    return {
        ...delivery,
        scheduledDate: newDate,
        scheduledWindow: windowId ? { ...delivery.scheduledWindow, id: windowId } : undefined,
        timeSlot: timeSlotId ? { ...delivery.timeSlot, id: timeSlotId } : undefined,
        status: DeliveryStatus.RESCHEDULED,
        updatedAt: new Date(),
    };
}
/**
 * Cancels a delivery
 */
function cancelDelivery(delivery, reason) {
    return {
        ...delivery,
        status: DeliveryStatus.CANCELLED,
        metadata: {
            ...delivery.metadata,
            cancellationReason: reason,
            cancelledAt: new Date().toISOString(),
        },
        updatedAt: new Date(),
    };
}
// ============================================================================
// DRIVER ASSIGNMENT FUNCTIONS
// ============================================================================
/**
 * Finds available drivers for delivery
 */
function findAvailableDrivers(drivers, delivery, date) {
    return drivers.filter(driver => {
        const isAvailable = driver.status === DriverStatus.AVAILABLE;
        const hasCapacity = driver.activeDeliveries < driver.maxDeliveries;
        const inZone = !delivery.scheduledWindow?.zoneId ||
            driver.assignedZones.includes(delivery.scheduledWindow.zoneId);
        // Check if driver has required skills
        const hasSkills = delivery.items.every(item => {
            if (item.requiresRefrigeration) {
                return driver.vehicleType === VehicleType.REFRIGERATED;
            }
            return true;
        });
        return isAvailable && hasCapacity && inZone && hasSkills;
    });
}
/**
 * Assigns driver to delivery
 */
function assignDriver(delivery, driver) {
    if (driver.status !== DriverStatus.AVAILABLE) {
        throw new common_1.BadRequestException('Driver is not available');
    }
    if (driver.activeDeliveries >= driver.maxDeliveries) {
        throw new common_1.BadRequestException('Driver has reached maximum delivery capacity');
    }
    return {
        ...delivery,
        driverId: driver.id,
        status: DeliveryStatus.ASSIGNED,
        updatedAt: new Date(),
    };
}
/**
 * Unassigns driver from delivery
 */
function unassignDriver(delivery) {
    return {
        ...delivery,
        driverId: undefined,
        status: DeliveryStatus.PENDING,
        updatedAt: new Date(),
    };
}
/**
 * Calculates driver workload score
 */
function calculateDriverWorkload(driver, routes) {
    const activeRoutes = routes.filter(r => r.driverId === driver.id && r.status === 'active');
    const totalStops = activeRoutes.reduce((sum, route) => sum + route.stops.length, 0);
    const capacityUtilization = driver.activeDeliveries / driver.maxDeliveries;
    return capacityUtilization * 0.6 + (totalStops / 20) * 0.4; // Weighted score
}
/**
 * Balances workload across drivers
 */
function balanceDriverWorkload(drivers, deliveries) {
    const assignments = new Map();
    // Sort drivers by current workload (ascending)
    const sortedDrivers = [...drivers].sort((a, b) => a.activeDeliveries - b.activeDeliveries);
    // Sort deliveries by priority (descending)
    const sortedDeliveries = [...deliveries].sort((a, b) => getPriorityWeight(b.priority) - getPriorityWeight(a.priority));
    for (const delivery of sortedDeliveries) {
        const availableDrivers = findAvailableDrivers(sortedDrivers, delivery, delivery.scheduledDate);
        if (availableDrivers.length > 0) {
            const driver = availableDrivers[0]; // Least loaded available driver
            if (!assignments.has(driver.id)) {
                assignments.set(driver.id, []);
            }
            assignments.get(driver.id).push(delivery.id);
        }
    }
    return assignments;
}
// ============================================================================
// ROUTE OPTIMIZATION FUNCTIONS
// ============================================================================
/**
 * Optimizes delivery route using nearest neighbor algorithm
 */
function optimizeRouteNearestNeighbor(deliveries, startLocation) {
    if (deliveries.length === 0)
        return [];
    const optimizedRoute = [];
    const remaining = [...deliveries];
    let currentLocation = startLocation;
    while (remaining.length > 0) {
        let nearestIndex = 0;
        let shortestDistance = Number.MAX_VALUE;
        for (let i = 0; i < remaining.length; i++) {
            const delivery = remaining[i];
            const distance = calculateDistance(currentLocation, delivery.deliveryAddress.coordinates || { latitude: 0, longitude: 0 });
            if (distance < shortestDistance) {
                shortestDistance = distance;
                nearestIndex = i;
            }
        }
        const nearest = remaining.splice(nearestIndex, 1)[0];
        optimizedRoute.push(nearest);
        currentLocation = nearest.deliveryAddress.coordinates || currentLocation;
    }
    return optimizedRoute;
}
/**
 * Creates delivery route from deliveries
 */
function createDeliveryRoute(driver, deliveries, startLocation, strategy) {
    const optimizedDeliveries = strategy === RouteOptimizationStrategy.SHORTEST_DISTANCE
        ? optimizeRouteNearestNeighbor(deliveries, startLocation)
        : optimizeRouteByPriority(deliveries);
    const stops = optimizedDeliveries.map((delivery, index) => {
        const prevLocation = index === 0
            ? startLocation
            : optimizedDeliveries[index - 1].deliveryAddress.coordinates || startLocation;
        const distance = calculateDistance(prevLocation, delivery.deliveryAddress.coordinates || startLocation);
        const estimatedArrival = index === 0
            ? new Date()
            : (0, date_fns_1.addMinutes)(new Date(), index * 20); // 20 min per stop estimate
        return {
            id: generateUUID(),
            routeId: '',
            deliveryId: delivery.id,
            sequence: index + 1,
            address: delivery.deliveryAddress,
            estimatedArrival,
            estimatedDeparture: (0, date_fns_1.addMinutes)(estimatedArrival, 10), // 10 min service time
            duration: 10,
            distance,
            status: 'pending',
        };
    });
    const totalDistance = stops.reduce((sum, stop) => sum + stop.distance, 0);
    const totalDuration = stops.length * 20; // 20 min per stop
    const route = {
        id: generateUUID(),
        name: `Route ${(0, date_fns_1.format)(new Date(), 'yyyy-MM-dd HH:mm')}`,
        driverId: driver.id,
        vehicleId: driver.vehicleId,
        date: new Date(),
        status: 'planned',
        stops: stops.map(stop => ({ ...stop, routeId: '' })),
        totalDistance,
        totalDuration,
        optimizationStrategy: strategy,
        startLocation,
        endLocation: startLocation, // Return to start
        startTime: new Date(),
        estimatedEndTime: (0, date_fns_1.addMinutes)(new Date(), totalDuration),
        capacityUsed: deliveries.length,
        capacityTotal: driver.maxDeliveries,
    };
    // Update route ID in stops
    route.stops = route.stops.map(stop => ({ ...stop, routeId: route.id }));
    return route;
}
/**
 * Optimizes route by priority
 */
function optimizeRouteByPriority(deliveries) {
    return [...deliveries].sort((a, b) => getPriorityWeight(b.priority) - getPriorityWeight(a.priority));
}
/**
 * Calculates ETA for delivery
 */
function calculateDeliveryETA(currentLocation, deliveryAddress, trafficFactor = 1.2) {
    const distance = calculateDistance(currentLocation, deliveryAddress.coordinates || { latitude: 0, longitude: 0 });
    // Average speed 40 km/h in urban areas
    const baseTimeMinutes = (distance / 40) * 60;
    const adjustedTime = baseTimeMinutes * trafficFactor;
    return (0, date_fns_1.addMinutes)(new Date(), adjustedTime);
}
/**
 * Detects route deviations
 */
function detectRouteDeviation(plannedStop, actualLocation, threshold = 0.5 // km
) {
    const distance = calculateDistance(actualLocation, plannedStop.address.coordinates || { latitude: 0, longitude: 0 });
    return distance > threshold;
}
// ============================================================================
// DELIVERY TRACKING FUNCTIONS
// ============================================================================
/**
 * Updates delivery location
 */
function updateDeliveryLocation(delivery, location) {
    return {
        ...delivery,
        metadata: {
            ...delivery.metadata,
            lastKnownLocation: location,
            lastLocationUpdate: new Date().toISOString(),
        },
        updatedAt: new Date(),
    };
}
/**
 * Generates tracking URL
 */
function generateTrackingUrl(delivery) {
    const baseUrl = process.env.TRACKING_BASE_URL || 'https://track.whitecross.com';
    const trackingCode = Buffer.from(delivery.id).toString('base64url');
    return `${baseUrl}/delivery/${trackingCode}`;
}
/**
 * Calculates delivery progress percentage
 */
function calculateDeliveryProgress(route) {
    const completedStops = route.stops.filter(s => s.status === 'completed').length;
    return (completedStops / route.stops.length) * 100;
}
// ============================================================================
// PROOF OF DELIVERY FUNCTIONS
// ============================================================================
/**
 * Captures proof of delivery
 */
function captureProofOfDelivery(delivery, data, capturedBy) {
    const pod = {
        id: generateUUID(),
        deliveryId: delivery.id,
        type: data.type,
        signatureUrl: data.signatureUrl,
        photoUrls: data.photoUrls,
        otp: data.otp,
        recipientName: data.recipientName,
        recipientPhone: data.recipientPhone,
        notes: data.notes,
        capturedAt: new Date(),
        capturedBy,
        location: data.location,
    };
    return pod;
}
/**
 * Validates POD completeness
 */
function validateProofOfDelivery(pod, delivery) {
    if (delivery.requiresSignature && pod.type === PODType.SIGNATURE) {
        return !!pod.signatureUrl;
    }
    if (pod.type === PODType.PHOTO) {
        return !!pod.photoUrls && pod.photoUrls.length > 0;
    }
    if (pod.type === PODType.OTP) {
        return !!pod.otp && pod.otp.length >= 4;
    }
    return true;
}
// ============================================================================
// DELIVERY EXCEPTION FUNCTIONS
// ============================================================================
/**
 * Reports delivery exception
 */
function reportDeliveryException(delivery, data, reportedBy) {
    const exception = {
        id: generateUUID(),
        deliveryId: delivery.id,
        type: data.type,
        description: data.description,
        occurredAt: new Date(),
        resolved: false,
        reportedBy,
        photos: data.photos,
        location: data.location,
    };
    return exception;
}
/**
 * Resolves delivery exception
 */
function resolveDeliveryException(exception, resolution) {
    return {
        ...exception,
        resolved: true,
        resolvedAt: new Date(),
        resolution,
    };
}
/**
 * Auto-reschedules failed delivery
 */
function autoRescheduleFailedDelivery(delivery, availableWindows) {
    // Find next available window based on customer preferences
    const nextWindow = availableWindows.find(w => isDeliveryWindowAvailable(w));
    if (!nextWindow) {
        return null;
    }
    return rescheduleDelivery(delivery, nextWindow.startTime, nextWindow.id);
}
// ============================================================================
// CAPACITY PLANNING FUNCTIONS
// ============================================================================
/**
 * Calculates delivery capacity for date
 */
function calculateDeliveryCapacity(date, drivers, windows) {
    const availableDrivers = drivers.filter(d => d.status === DriverStatus.AVAILABLE);
    const totalCapacity = availableDrivers.reduce((sum, d) => sum + d.maxDeliveries, 0);
    const windowsForDate = windows.filter(w => isSameDay(w.startTime, date));
    const usedCapacity = windowsForDate.reduce((sum, w) => sum + w.bookedCount, 0);
    const availableCapacity = totalCapacity - usedCapacity;
    const utilizationPercentage = (usedCapacity / totalCapacity) * 100;
    return {
        date,
        totalCapacity,
        usedCapacity,
        availableCapacity,
        utilizationPercentage,
        recommendedDrivers: Math.ceil(usedCapacity / 10), // 10 deliveries per driver
        predictedDemand: usedCapacity,
        zones: [],
    };
}
/**
 * Predicts delivery demand
 */
function predictDeliveryDemand(historicalData, forecastDate) {
    if (historicalData.length === 0)
        return 0;
    // Simple moving average
    const recentData = historicalData.slice(-7); // Last 7 days
    const average = recentData.reduce((sum, d) => sum + d.count, 0) / recentData.length;
    // Add 10% buffer for peak times (weekends)
    const dayOfWeek = forecastDate.getDay();
    const isPeakDay = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
    return Math.ceil(average * (isPeakDay ? 1.1 : 1.0));
}
// ============================================================================
// GEOGRAPHIC ZONE FUNCTIONS
// ============================================================================
/**
 * Creates geographic zone
 */
function createGeoZone(data) {
    return {
        id: generateUUID(),
        name: data.name,
        type: data.type,
        coordinates: data.coordinates,
        centerPoint: data.centerPoint || calculateCentroid(data.coordinates),
        radius: data.radius,
    };
}
/**
 * Checks if coordinate is within zone
 */
function isCoordinateInZone(coordinate, zone) {
    if (zone.type === 'circle' && zone.centerPoint && zone.radius) {
        const distance = calculateDistance(coordinate, zone.centerPoint);
        return distance <= zone.radius;
    }
    if (zone.type === 'polygon') {
        return isPointInPolygon(coordinate, zone.coordinates);
    }
    return false;
}
/**
 * Finds zone for delivery address
 */
function findZoneForAddress(address, zones) {
    if (!address.coordinates)
        return null;
    for (const zone of zones) {
        if (isCoordinateInZone(address.coordinates, zone)) {
            return zone;
        }
    }
    return null;
}
// ============================================================================
// DELIVERY COST CALCULATION FUNCTIONS
// ============================================================================
/**
 * Calculates delivery cost
 */
function calculateDeliveryCost(data, baseRates) {
    const distance = calculateDistance(data.pickupAddress.coordinates || { latitude: 0, longitude: 0 }, data.deliveryAddress.coordinates || { latitude: 0, longitude: 0 });
    const basePrice = baseRates.basePrice;
    const distancePrice = distance * baseRates.perKmPrice;
    const priorityMultiplier = baseRates.priorityMultipliers[data.priority] || 1.0;
    const zoneMultiplier = data.zoneId ? (baseRates.zoneMultipliers.get(data.zoneId) || 1.0) : 1.0;
    const subtotal = (basePrice + distancePrice) * priorityMultiplier * zoneMultiplier;
    return {
        basePrice,
        distancePrice,
        timePrice: 0,
        priorityPrice: subtotal * (priorityMultiplier - 1),
        zonePrice: subtotal * (zoneMultiplier - 1),
        totalPrice: subtotal,
        currency: 'USD',
    };
}
/**
 * Applies discount to delivery pricing
 */
function applyDeliveryDiscount(pricing, discount) {
    let discountAmount = 0;
    if (discount.type === 'percentage') {
        discountAmount = pricing.totalPrice * (discount.value / 100);
    }
    else if (discount.type === 'fixed') {
        discountAmount = discount.value;
    }
    else if (discount.type === 'free') {
        discountAmount = pricing.totalPrice;
    }
    const newTotal = Math.max(0, pricing.totalPrice - discountAmount);
    return {
        ...pricing,
        totalPrice: newTotal,
        discounts: [
            ...(pricing.discounts || []),
            {
                id: generateUUID(),
                ...discount,
                appliedAt: new Date(),
            },
        ],
    };
}
// ============================================================================
// CUSTOMER PREFERENCE FUNCTIONS
// ============================================================================
/**
 * Updates customer delivery preferences
 */
function updateCustomerPreferences(customerId, data) {
    return {
        customerId,
        preferredTimeWindows: data.preferredTimeWindows,
        preferredDays: data.preferredDays,
        specialInstructions: data.specialInstructions,
        requiresSignature: data.requiresSignature,
        allowContactless: data.allowContactless,
        preferredContactMethod: data.preferredContactMethod || 'phone',
    };
}
/**
 * Matches delivery window to customer preferences
 */
function matchWindowToPreferences(window, preferences) {
    const dayOfWeek = window.startTime.getDay();
    const matchesDay = preferences.preferredDays.includes(dayOfWeek);
    const matchesWindow = preferences.preferredTimeWindows.includes(window.type);
    return matchesDay && matchesWindow;
}
/**
 * Finds preferred windows for customer
 */
function findPreferredWindows(windows, preferences) {
    return windows.filter(w => matchWindowToPreferences(w, preferences));
}
// ============================================================================
// UTILITY HELPER FUNCTIONS
// ============================================================================
/**
 * Generates UUID v4
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
/**
 * Calculates distance between two coordinates (Haversine formula)
 */
function calculateDistance(coord1, coord2) {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(coord2.latitude - coord1.latitude);
    const dLon = toRad(coord2.longitude - coord1.longitude);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(coord1.latitude)) *
            Math.cos(toRad(coord2.latitude)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
/**
 * Converts degrees to radians
 */
function toRad(degrees) {
    return degrees * (Math.PI / 180);
}
/**
 * Gets priority weight for sorting
 */
function getPriorityWeight(priority) {
    const weights = {
        [DeliveryPriority.EXPRESS]: 100,
        [DeliveryPriority.SAME_DAY]: 90,
        [DeliveryPriority.URGENT]: 80,
        [DeliveryPriority.HIGH]: 60,
        [DeliveryPriority.NORMAL]: 40,
        [DeliveryPriority.LOW]: 20,
    };
    return weights[priority] || 0;
}
/**
 * Calculates centroid of polygon
 */
function calculateCentroid(coordinates) {
    const sum = coordinates.reduce((acc, coord) => ({
        latitude: acc.latitude + coord.latitude,
        longitude: acc.longitude + coord.longitude,
    }), { latitude: 0, longitude: 0 });
    return {
        latitude: sum.latitude / coordinates.length,
        longitude: sum.longitude / coordinates.length,
    };
}
/**
 * Checks if point is inside polygon (ray casting algorithm)
 */
function isPointInPolygon(point, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].latitude;
        const yi = polygon[i].longitude;
        const xj = polygon[j].latitude;
        const yj = polygon[j].longitude;
        const intersect = yi > point.longitude !== yj > point.longitude &&
            point.latitude < ((xj - xi) * (point.longitude - yi)) / (yj - yi) + xi;
        if (intersect)
            inside = !inside;
    }
    return inside;
}
/**
 * Checks if two dates are the same day
 */
function isSameDay(date1, date2) {
    return (date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate());
}
// ============================================================================
// NESTJS REST CONTROLLERS
// ============================================================================
/**
 * Delivery Windows Controller
 */
let DeliveryWindowsController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('delivery-windows'), (0, common_1.Controller)('api/v1/delivery-windows'), (0, common_1.UseGuards)( /* JwtAuthGuard, RolesGuard */), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createWindow_decorators;
    let _getWindow_decorators;
    let _updateWindow_decorators;
    let _bookWindow_decorators;
    let _getTimeSlots_decorators;
    var DeliveryWindowsController = _classThis = class {
        constructor() {
            this.logger = (__runInitializers(this, _instanceExtraInitializers), new common_1.Logger(DeliveryWindowsController.name));
        }
        async createWindow(createDto) {
            this.logger.log(`Creating delivery window: ${createDto.type}`);
            return createDeliveryWindow(createDto);
        }
        async getWindow(id) {
            // Implementation would fetch from database
            throw new common_1.NotFoundException('Not implemented - database integration required');
        }
        async updateWindow(id, updateDto) {
            // Implementation would fetch and update in database
            throw new common_1.NotFoundException('Not implemented - database integration required');
        }
        async bookWindow(id) {
            // Implementation would fetch window and book
            throw new common_1.NotFoundException('Not implemented - database integration required');
        }
        async getTimeSlots(id, slotDuration) {
            // Implementation would fetch window and generate slots
            throw new common_1.NotFoundException('Not implemented - database integration required');
        }
    };
    __setFunctionName(_classThis, "DeliveryWindowsController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createWindow_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create delivery window' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Delivery window created successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request data' })];
        _getWindow_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get delivery window by ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Delivery window found' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Delivery window not found' })];
        _updateWindow_decorators = [(0, common_1.Put)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Update delivery window' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Delivery window updated successfully' })];
        _bookWindow_decorators = [(0, common_1.Post)(':id/book'), (0, swagger_1.ApiOperation)({ summary: 'Book a slot in delivery window' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Slot booked successfully' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Window not available' })];
        _getTimeSlots_decorators = [(0, common_1.Get)(':id/time-slots'), (0, swagger_1.ApiOperation)({ summary: 'Get time slots for delivery window' }), (0, swagger_1.ApiQuery)({ name: 'slotDuration', required: false, type: Number }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Time slots retrieved successfully' })];
        __esDecorate(_classThis, null, _createWindow_decorators, { kind: "method", name: "createWindow", static: false, private: false, access: { has: obj => "createWindow" in obj, get: obj => obj.createWindow }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getWindow_decorators, { kind: "method", name: "getWindow", static: false, private: false, access: { has: obj => "getWindow" in obj, get: obj => obj.getWindow }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateWindow_decorators, { kind: "method", name: "updateWindow", static: false, private: false, access: { has: obj => "updateWindow" in obj, get: obj => obj.updateWindow }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _bookWindow_decorators, { kind: "method", name: "bookWindow", static: false, private: false, access: { has: obj => "bookWindow" in obj, get: obj => obj.bookWindow }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTimeSlots_decorators, { kind: "method", name: "getTimeSlots", static: false, private: false, access: { has: obj => "getTimeSlots" in obj, get: obj => obj.getTimeSlots }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DeliveryWindowsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DeliveryWindowsController = _classThis;
})();
exports.DeliveryWindowsController = DeliveryWindowsController;
/**
 * Deliveries Controller
 */
let DeliveriesController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('deliveries'), (0, common_1.Controller)('api/v1/deliveries'), (0, common_1.UseGuards)( /* JwtAuthGuard, RolesGuard */), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _scheduleDelivery_decorators;
    let _getDelivery_decorators;
    let _updateStatus_decorators;
    let _reschedule_decorators;
    let _cancelDelivery_decorators;
    let _assignDriverToDelivery_decorators;
    let _getTracking_decorators;
    let _captureProof_decorators;
    let _reportException_decorators;
    var DeliveriesController = _classThis = class {
        constructor() {
            this.logger = (__runInitializers(this, _instanceExtraInitializers), new common_1.Logger(DeliveriesController.name));
        }
        async scheduleDelivery(scheduleDto) {
            this.logger.log(`Scheduling delivery for order: ${scheduleDto.orderId}`);
            return scheduleDelivery(scheduleDto);
        }
        async getDelivery(id) {
            throw new common_1.NotFoundException('Not implemented - database integration required');
        }
        async updateStatus(id, status) {
            throw new common_1.NotFoundException('Not implemented - database integration required');
        }
        async reschedule(id, body) {
            throw new common_1.NotFoundException('Not implemented - database integration required');
        }
        async cancelDelivery(id, reason) {
            throw new common_1.NotFoundException('Not implemented - database integration required');
        }
        async assignDriverToDelivery(id, assignDto) {
            throw new common_1.NotFoundException('Not implemented - database integration required');
        }
        async getTracking(id) {
            throw new common_1.NotFoundException('Not implemented - database integration required');
        }
        async captureProof(id, podDto) {
            throw new common_1.NotFoundException('Not implemented - database integration required');
        }
        async reportException(id, exceptionDto) {
            throw new common_1.NotFoundException('Not implemented - database integration required');
        }
    };
    __setFunctionName(_classThis, "DeliveriesController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _scheduleDelivery_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Schedule new delivery' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Delivery scheduled successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request data' })];
        _getDelivery_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get delivery by ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Delivery found' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Delivery not found' })];
        _updateStatus_decorators = [(0, common_1.Patch)(':id/status'), (0, swagger_1.ApiOperation)({ summary: 'Update delivery status' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Status updated successfully' })];
        _reschedule_decorators = [(0, common_1.Put)(':id/reschedule'), (0, swagger_1.ApiOperation)({ summary: 'Reschedule delivery' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Delivery rescheduled successfully' })];
        _cancelDelivery_decorators = [(0, common_1.Delete)(':id'), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT), (0, swagger_1.ApiOperation)({ summary: 'Cancel delivery' }), (0, swagger_1.ApiResponse)({ status: 204, description: 'Delivery cancelled successfully' })];
        _assignDriverToDelivery_decorators = [(0, common_1.Post)(':id/assign-driver'), (0, swagger_1.ApiOperation)({ summary: 'Assign driver to delivery' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Driver assigned successfully' })];
        _getTracking_decorators = [(0, common_1.Get)(':id/tracking'), (0, swagger_1.ApiOperation)({ summary: 'Get delivery tracking information' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Tracking info retrieved' })];
        _captureProof_decorators = [(0, common_1.Post)(':id/proof-of-delivery'), (0, swagger_1.ApiOperation)({ summary: 'Capture proof of delivery' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'POD captured successfully' })];
        _reportException_decorators = [(0, common_1.Post)(':id/exceptions'), (0, swagger_1.ApiOperation)({ summary: 'Report delivery exception' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Exception reported successfully' })];
        __esDecorate(_classThis, null, _scheduleDelivery_decorators, { kind: "method", name: "scheduleDelivery", static: false, private: false, access: { has: obj => "scheduleDelivery" in obj, get: obj => obj.scheduleDelivery }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDelivery_decorators, { kind: "method", name: "getDelivery", static: false, private: false, access: { has: obj => "getDelivery" in obj, get: obj => obj.getDelivery }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateStatus_decorators, { kind: "method", name: "updateStatus", static: false, private: false, access: { has: obj => "updateStatus" in obj, get: obj => obj.updateStatus }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _reschedule_decorators, { kind: "method", name: "reschedule", static: false, private: false, access: { has: obj => "reschedule" in obj, get: obj => obj.reschedule }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _cancelDelivery_decorators, { kind: "method", name: "cancelDelivery", static: false, private: false, access: { has: obj => "cancelDelivery" in obj, get: obj => obj.cancelDelivery }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _assignDriverToDelivery_decorators, { kind: "method", name: "assignDriverToDelivery", static: false, private: false, access: { has: obj => "assignDriverToDelivery" in obj, get: obj => obj.assignDriverToDelivery }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTracking_decorators, { kind: "method", name: "getTracking", static: false, private: false, access: { has: obj => "getTracking" in obj, get: obj => obj.getTracking }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _captureProof_decorators, { kind: "method", name: "captureProof", static: false, private: false, access: { has: obj => "captureProof" in obj, get: obj => obj.captureProof }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _reportException_decorators, { kind: "method", name: "reportException", static: false, private: false, access: { has: obj => "reportException" in obj, get: obj => obj.reportException }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DeliveriesController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DeliveriesController = _classThis;
})();
exports.DeliveriesController = DeliveriesController;
/**
 * Route Optimization Controller
 */
let RouteOptimizationController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('route-optimization'), (0, common_1.Controller)('api/v1/routes'), (0, common_1.UseGuards)( /* JwtAuthGuard, RolesGuard */), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _optimizeRoute_decorators;
    let _getRoute_decorators;
    let _getRouteProgress_decorators;
    let _getDriverRoutes_decorators;
    var RouteOptimizationController = _classThis = class {
        constructor() {
            this.logger = (__runInitializers(this, _instanceExtraInitializers), new common_1.Logger(RouteOptimizationController.name));
        }
        async optimizeRoute(optimizeDto) {
            this.logger.log(`Optimizing route with strategy: ${optimizeDto.strategy}`);
            throw new common_1.NotFoundException('Not implemented - database integration required');
        }
        async getRoute(id) {
            throw new common_1.NotFoundException('Not implemented - database integration required');
        }
        async getRouteProgress(id) {
            throw new common_1.NotFoundException('Not implemented - database integration required');
        }
        async getDriverRoutes(driverId, date) {
            throw new common_1.NotFoundException('Not implemented - database integration required');
        }
    };
    __setFunctionName(_classThis, "RouteOptimizationController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _optimizeRoute_decorators = [(0, common_1.Post)('optimize'), (0, swagger_1.ApiOperation)({ summary: 'Optimize delivery route' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Route optimized successfully' })];
        _getRoute_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get route by ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Route found' })];
        _getRouteProgress_decorators = [(0, common_1.Get)(':id/progress'), (0, swagger_1.ApiOperation)({ summary: 'Get route progress' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Progress retrieved' })];
        _getDriverRoutes_decorators = [(0, common_1.Get)('driver/:driverId'), (0, swagger_1.ApiOperation)({ summary: 'Get routes for driver' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Routes retrieved' })];
        __esDecorate(_classThis, null, _optimizeRoute_decorators, { kind: "method", name: "optimizeRoute", static: false, private: false, access: { has: obj => "optimizeRoute" in obj, get: obj => obj.optimizeRoute }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRoute_decorators, { kind: "method", name: "getRoute", static: false, private: false, access: { has: obj => "getRoute" in obj, get: obj => obj.getRoute }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRouteProgress_decorators, { kind: "method", name: "getRouteProgress", static: false, private: false, access: { has: obj => "getRouteProgress" in obj, get: obj => obj.getRouteProgress }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDriverRoutes_decorators, { kind: "method", name: "getDriverRoutes", static: false, private: false, access: { has: obj => "getDriverRoutes" in obj, get: obj => obj.getDriverRoutes }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RouteOptimizationController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RouteOptimizationController = _classThis;
})();
exports.RouteOptimizationController = RouteOptimizationController;
/**
 * Delivery Pricing Controller
 */
let DeliveryPricingController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('delivery-pricing'), (0, common_1.Controller)('api/v1/delivery-pricing')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _calculateCost_decorators;
    let _applyDiscount_decorators;
    var DeliveryPricingController = _classThis = class {
        constructor() {
            this.logger = (__runInitializers(this, _instanceExtraInitializers), new common_1.Logger(DeliveryPricingController.name));
        }
        async calculateCost(calculateDto) {
            this.logger.log('Calculating delivery cost');
            const baseRates = {
                basePrice: 5.0,
                perKmPrice: 1.5,
                priorityMultipliers: {
                    [DeliveryPriority.LOW]: 0.8,
                    [DeliveryPriority.NORMAL]: 1.0,
                    [DeliveryPriority.HIGH]: 1.3,
                    [DeliveryPriority.URGENT]: 1.6,
                    [DeliveryPriority.SAME_DAY]: 2.0,
                    [DeliveryPriority.EXPRESS]: 2.5,
                },
                zoneMultipliers: new Map(),
            };
            return calculateDeliveryCost(calculateDto, baseRates);
        }
        async applyDiscount(deliveryId, discount) {
            throw new common_1.NotFoundException('Not implemented - database integration required');
        }
    };
    __setFunctionName(_classThis, "DeliveryPricingController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _calculateCost_decorators = [(0, common_1.Post)('calculate'), (0, swagger_1.ApiOperation)({ summary: 'Calculate delivery cost' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Cost calculated successfully' })];
        _applyDiscount_decorators = [(0, common_1.Post)(':deliveryId/apply-discount'), (0, swagger_1.ApiOperation)({ summary: 'Apply discount to delivery' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Discount applied successfully' })];
        __esDecorate(_classThis, null, _calculateCost_decorators, { kind: "method", name: "calculateCost", static: false, private: false, access: { has: obj => "calculateCost" in obj, get: obj => obj.calculateCost }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _applyDiscount_decorators, { kind: "method", name: "applyDiscount", static: false, private: false, access: { has: obj => "applyDiscount" in obj, get: obj => obj.applyDiscount }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DeliveryPricingController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DeliveryPricingController = _classThis;
})();
exports.DeliveryPricingController = DeliveryPricingController;
/**
 * Customer Preferences Controller
 */
let CustomerPreferencesController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('customer-preferences'), (0, common_1.Controller)('api/v1/customers/:customerId/delivery-preferences'), (0, common_1.UseGuards)( /* JwtAuthGuard, RolesGuard */), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getPreferences_decorators;
    let _updatePreferences_decorators;
    let _findMatchingWindows_decorators;
    var CustomerPreferencesController = _classThis = class {
        constructor() {
            this.logger = (__runInitializers(this, _instanceExtraInitializers), new common_1.Logger(CustomerPreferencesController.name));
        }
        async getPreferences(customerId) {
            throw new common_1.NotFoundException('Not implemented - database integration required');
        }
        async updatePreferences(customerId, preferencesDto) {
            this.logger.log(`Updating preferences for customer: ${customerId}`);
            return updateCustomerPreferences(customerId, preferencesDto);
        }
        async findMatchingWindows(customerId) {
            throw new common_1.NotFoundException('Not implemented - database integration required');
        }
    };
    __setFunctionName(_classThis, "CustomerPreferencesController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getPreferences_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Get customer delivery preferences' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Preferences retrieved' })];
        _updatePreferences_decorators = [(0, common_1.Put)(), (0, swagger_1.ApiOperation)({ summary: 'Update customer delivery preferences' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Preferences updated successfully' })];
        _findMatchingWindows_decorators = [(0, common_1.Get)('matching-windows'), (0, swagger_1.ApiOperation)({ summary: 'Find delivery windows matching preferences' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Matching windows found' })];
        __esDecorate(_classThis, null, _getPreferences_decorators, { kind: "method", name: "getPreferences", static: false, private: false, access: { has: obj => "getPreferences" in obj, get: obj => obj.getPreferences }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updatePreferences_decorators, { kind: "method", name: "updatePreferences", static: false, private: false, access: { has: obj => "updatePreferences" in obj, get: obj => obj.updatePreferences }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findMatchingWindows_decorators, { kind: "method", name: "findMatchingWindows", static: false, private: false, access: { has: obj => "findMatchingWindows" in obj, get: obj => obj.findMatchingWindows }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CustomerPreferencesController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CustomerPreferencesController = _classThis;
})();
exports.CustomerPreferencesController = CustomerPreferencesController;
/**
 * Geographic Zones Controller
 */
let GeoZonesController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('geographic-zones'), (0, common_1.Controller)('api/v1/geo-zones'), (0, common_1.UseGuards)( /* JwtAuthGuard, RolesGuard */), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createZone_decorators;
    let _getZone_decorators;
    let _checkCoordinate_decorators;
    var GeoZonesController = _classThis = class {
        constructor() {
            this.logger = (__runInitializers(this, _instanceExtraInitializers), new common_1.Logger(GeoZonesController.name));
        }
        async createZone(createDto) {
            this.logger.log(`Creating geo zone: ${createDto.name}`);
            return createGeoZone(createDto);
        }
        async getZone(id) {
            throw new common_1.NotFoundException('Not implemented - database integration required');
        }
        async checkCoordinate(coordinate) {
            throw new common_1.NotFoundException('Not implemented - database integration required');
        }
    };
    __setFunctionName(_classThis, "GeoZonesController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createZone_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create geographic zone' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Zone created successfully' })];
        _getZone_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get zone by ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Zone found' })];
        _checkCoordinate_decorators = [(0, common_1.Post)('check-coordinate'), (0, swagger_1.ApiOperation)({ summary: 'Check if coordinate is in any zone' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Check completed' })];
        __esDecorate(_classThis, null, _createZone_decorators, { kind: "method", name: "createZone", static: false, private: false, access: { has: obj => "createZone" in obj, get: obj => obj.createZone }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getZone_decorators, { kind: "method", name: "getZone", static: false, private: false, access: { has: obj => "getZone" in obj, get: obj => obj.getZone }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _checkCoordinate_decorators, { kind: "method", name: "checkCoordinate", static: false, private: false, access: { has: obj => "checkCoordinate" in obj, get: obj => obj.checkCoordinate }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GeoZonesController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GeoZonesController = _classThis;
})();
exports.GeoZonesController = GeoZonesController;
/**
 * Capacity Planning Controller
 */
let CapacityPlanningController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('capacity-planning'), (0, common_1.Controller)('api/v1/capacity'), (0, common_1.UseGuards)( /* JwtAuthGuard, RolesGuard */), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _calculateCapacity_decorators;
    let _predictDemand_decorators;
    var CapacityPlanningController = _classThis = class {
        constructor() {
            this.logger = (__runInitializers(this, _instanceExtraInitializers), new common_1.Logger(CapacityPlanningController.name));
        }
        async calculateCapacity(dateString) {
            const date = (0, date_fns_1.parseISO)(dateString);
            throw new common_1.NotFoundException('Not implemented - database integration required');
        }
        async predictDemand(dateString) {
            throw new common_1.NotFoundException('Not implemented - database integration required');
        }
    };
    __setFunctionName(_classThis, "CapacityPlanningController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _calculateCapacity_decorators = [(0, common_1.Get)('calculate'), (0, swagger_1.ApiOperation)({ summary: 'Calculate delivery capacity for date' }), (0, swagger_1.ApiQuery)({ name: 'date', required: true, type: String }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Capacity calculated' })];
        _predictDemand_decorators = [(0, common_1.Get)('predict-demand'), (0, swagger_1.ApiOperation)({ summary: 'Predict delivery demand' }), (0, swagger_1.ApiQuery)({ name: 'forecastDate', required: true, type: String }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Demand predicted' })];
        __esDecorate(_classThis, null, _calculateCapacity_decorators, { kind: "method", name: "calculateCapacity", static: false, private: false, access: { has: obj => "calculateCapacity" in obj, get: obj => obj.calculateCapacity }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _predictDemand_decorators, { kind: "method", name: "predictDemand", static: false, private: false, access: { has: obj => "predictDemand" in obj, get: obj => obj.predictDemand }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CapacityPlanningController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CapacityPlanningController = _classThis;
})();
exports.CapacityPlanningController = CapacityPlanningController;
/**
 * Logger instance for delivery operations
 */
exports.deliveryLogger = new common_1.Logger('DeliveryScheduling');
//# sourceMappingURL=delivery-scheduling-kit.js.map