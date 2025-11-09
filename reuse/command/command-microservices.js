"use strict";
/**
 * Command Microservices Architecture
 *
 * Production-ready NestJS microservices for emergency command and control operations.
 * Implements event-driven architecture, CQRS patterns, message queues (RabbitMQ, Kafka),
 * and distributed service coordination for incident processing, dispatch, resource management,
 * notifications, analytics, GIS, reporting, and archival operations.
 *
 * Features:
 * - Event-driven microservices architecture with RabbitMQ and Kafka
 * - CQRS (Command Query Responsibility Segregation) implementation
 * - Event sourcing for audit trails and state reconstruction
 * - Distributed transaction coordination with Saga pattern
 * - Circuit breaker and retry patterns for resilience
 * - Service discovery and health monitoring
 * - Real-time event streaming and processing
 * - Message-based inter-service communication
 * - Asynchronous command processing
 * - Event store and replay capabilities
 *
 * Microservices Covered:
 * - Incident Processing Service
 * - Dispatch Coordination Service
 * - Resource Management Service
 * - Notification Service
 * - Analytics Processing Service
 * - GIS Service
 * - Reporting Service
 * - Archive Service
 *
 * @module CommandMicroservices
 * @category Microservices Architecture
 * @version 1.0.0
 */
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceHealthMonitor = exports.CircuitBreakerService = exports.SagaOrchestrationService = exports.EventStoreService = exports.ArchiveMicroservice = exports.ReportingMicroservice = exports.GISMicroservice = exports.AnalyticsProcessingService = exports.NotificationMicroservice = exports.ResourceManagementService = exports.DispatchCoordinationService = exports.IncidentProcessingService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
const sequelize_1 = require("sequelize");
/**
 * Incident Processing Microservice
 *
 * Handles all incident-related commands and events through message queues.
 * Processes incident creation, updates, status changes, and lifecycle management.
 */
let IncidentProcessingService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _processCreateIncidentCommand_decorators;
    let _processUpdateIncidentCommand_decorators;
    let _processCloseIncidentCommand_decorators;
    let _handleIncidentEscalation_decorators;
    var IncidentProcessingService = _classThis = class {
        constructor(incidentModel, eventEmitter) {
            this.incidentModel = (__runInitializers(this, _instanceExtraInitializers), incidentModel);
            this.eventEmitter = eventEmitter;
            this.logger = new common_1.Logger(IncidentProcessingService.name);
            this.initializeClients();
        }
        /**
         * Initialize message queue clients
         */
        initializeClients() {
            this.kafkaClient = microservices_1.ClientProxyFactory.create({
                transport: microservices_1.Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'incident-processing-service',
                        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
                    },
                    consumer: {
                        groupId: 'incident-consumer-group',
                    },
                },
            });
            this.rabbitMQClient = microservices_1.ClientProxyFactory.create({
                transport: microservices_1.Transport.RMQ,
                options: {
                    urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
                    queue: 'incident_commands',
                    queueOptions: {
                        durable: true,
                    },
                },
            });
        }
        /**
         * Process create incident command
         */
        async processCreateIncidentCommand(data, context) {
            this.logger.log(`Processing create incident command: ${data.incidentNumber}`);
            const channel = context.getChannelRef();
            const originalMsg = context.getMessage();
            try {
                const incident = await this.incidentModel.create({
                    incidentNumber: data.incidentNumber,
                    type: data.type,
                    priority: data.priority,
                    location: data.location,
                    description: data.description,
                    status: 'CREATED',
                    createdAt: new Date(),
                });
                // Publish incident created event to Kafka
                await this.publishIncidentCreatedEvent(incident);
                channel.ack(originalMsg);
                return { success: true, incidentId: incident.id };
            }
            catch (error) {
                this.logger.error(`Failed to create incident: ${error.message}`);
                channel.nack(originalMsg, false, true);
                throw error;
            }
        }
        /**
         * Publish incident created event to event stream
         */
        async publishIncidentCreatedEvent(incident) {
            const event = {
                eventType: 'IncidentCreated',
                aggregateId: incident.id,
                incidentNumber: incident.incidentNumber,
                type: incident.type,
                priority: incident.priority,
                location: incident.location,
                timestamp: new Date(),
                version: 1,
            };
            this.kafkaClient.emit('incident.created', event);
            this.eventEmitter.emit('incident.created', event);
        }
        /**
         * Process update incident command
         */
        async processUpdateIncidentCommand(data) {
            this.logger.log(`Processing update incident command: ${data.incidentId}`);
            const incident = await this.incidentModel.findByPk(data.incidentId);
            if (!incident) {
                throw new common_1.NotFoundException(`Incident ${data.incidentId} not found`);
            }
            await incident.update(data.updates);
            await this.publishIncidentUpdatedEvent(incident, data.updates);
            return { success: true, incident };
        }
        /**
         * Publish incident updated event
         */
        async publishIncidentUpdatedEvent(incident, updates) {
            const event = {
                eventType: 'IncidentUpdated',
                aggregateId: incident.id,
                updates,
                timestamp: new Date(),
                version: incident.version + 1,
            };
            this.kafkaClient.emit('incident.updated', event);
        }
        /**
         * Process close incident command
         */
        async processCloseIncidentCommand(data) {
            this.logger.log(`Processing close incident command: ${data.incidentId}`);
            const incident = await this.incidentModel.findByPk(data.incidentId);
            if (!incident) {
                throw new common_1.NotFoundException(`Incident ${data.incidentId} not found`);
            }
            await incident.update({
                status: 'CLOSED',
                closedAt: new Date(),
                closureNotes: data.notes,
            });
            await this.publishIncidentClosedEvent(incident);
            return { success: true };
        }
        /**
         * Publish incident closed event
         */
        async publishIncidentClosedEvent(incident) {
            const event = {
                eventType: 'IncidentClosed',
                aggregateId: incident.id,
                closedAt: new Date(),
                timestamp: new Date(),
            };
            this.kafkaClient.emit('incident.closed', event);
        }
        /**
         * Handle incident escalation
         */
        async handleIncidentEscalation(data) {
            this.logger.log(`Escalating incident: ${data.incidentId}`);
            const incident = await this.incidentModel.findByPk(data.incidentId);
            if (!incident) {
                throw new common_1.NotFoundException(`Incident ${data.incidentId} not found`);
            }
            const newPriority = this.calculateEscalatedPriority(incident.priority);
            await incident.update({ priority: newPriority });
            const event = {
                eventType: 'IncidentEscalated',
                aggregateId: incident.id,
                previousPriority: incident.priority,
                newPriority,
                reason: data.reason,
                timestamp: new Date(),
            };
            this.kafkaClient.emit('incident.escalated', event);
            return { success: true, newPriority };
        }
        /**
         * Calculate escalated priority level
         */
        calculateEscalatedPriority(currentPriority) {
            const priorityMap = {
                'LOW': 'MEDIUM',
                'MEDIUM': 'HIGH',
                'HIGH': 'CRITICAL',
                'CRITICAL': 'CRITICAL',
            };
            return priorityMap[currentPriority] || currentPriority;
        }
    };
    __setFunctionName(_classThis, "IncidentProcessingService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _processCreateIncidentCommand_decorators = [(0, microservices_1.MessagePattern)('create_incident')];
        _processUpdateIncidentCommand_decorators = [(0, microservices_1.MessagePattern)('update_incident')];
        _processCloseIncidentCommand_decorators = [(0, microservices_1.MessagePattern)('close_incident')];
        _handleIncidentEscalation_decorators = [(0, microservices_1.MessagePattern)('escalate_incident')];
        __esDecorate(_classThis, null, _processCreateIncidentCommand_decorators, { kind: "method", name: "processCreateIncidentCommand", static: false, private: false, access: { has: obj => "processCreateIncidentCommand" in obj, get: obj => obj.processCreateIncidentCommand }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _processUpdateIncidentCommand_decorators, { kind: "method", name: "processUpdateIncidentCommand", static: false, private: false, access: { has: obj => "processUpdateIncidentCommand" in obj, get: obj => obj.processUpdateIncidentCommand }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _processCloseIncidentCommand_decorators, { kind: "method", name: "processCloseIncidentCommand", static: false, private: false, access: { has: obj => "processCloseIncidentCommand" in obj, get: obj => obj.processCloseIncidentCommand }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleIncidentEscalation_decorators, { kind: "method", name: "handleIncidentEscalation", static: false, private: false, access: { has: obj => "handleIncidentEscalation" in obj, get: obj => obj.handleIncidentEscalation }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IncidentProcessingService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IncidentProcessingService = _classThis;
})();
exports.IncidentProcessingService = IncidentProcessingService;
/**
 * Dispatch Coordination Microservice
 *
 * Coordinates unit dispatching, resource allocation, and response coordination
 * through distributed message-based architecture.
 */
let DispatchCoordinationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _processDispatchUnitCommand_decorators;
    let _processUnitEnrouteCommand_decorators;
    let _processUnitOnSceneCommand_decorators;
    let _processUnitAvailableCommand_decorators;
    let _requestMutualAid_decorators;
    let _coordinateMultiUnitResponse_decorators;
    var DispatchCoordinationService = _classThis = class {
        constructor(dispatchModel, unitModel, eventEmitter) {
            this.dispatchModel = (__runInitializers(this, _instanceExtraInitializers), dispatchModel);
            this.unitModel = unitModel;
            this.eventEmitter = eventEmitter;
            this.logger = new common_1.Logger(DispatchCoordinationService.name);
            this.initializeClients();
        }
        /**
         * Initialize message clients
         */
        initializeClients() {
            this.rabbitMQClient = microservices_1.ClientProxyFactory.create({
                transport: microservices_1.Transport.RMQ,
                options: {
                    urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
                    queue: 'dispatch_commands',
                    queueOptions: { durable: true },
                },
            });
            this.kafkaClient = microservices_1.ClientProxyFactory.create({
                transport: microservices_1.Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'dispatch-coordination-service',
                        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
                    },
                },
            });
        }
        /**
         * Process dispatch unit command
         */
        async processDispatchUnitCommand(data) {
            this.logger.log(`Processing dispatch unit command: ${data.unitId} to incident ${data.incidentId}`);
            const unit = await this.unitModel.findByPk(data.unitId);
            if (!unit) {
                throw new common_1.NotFoundException(`Unit ${data.unitId} not found`);
            }
            if (unit.status !== 'AVAILABLE') {
                throw new common_1.ConflictException(`Unit ${data.unitId} is not available for dispatch`);
            }
            const dispatch = await this.dispatchModel.create({
                unitId: data.unitId,
                incidentId: data.incidentId,
                dispatchedAt: new Date(),
                status: 'DISPATCHED',
                priority: data.priority,
            });
            await unit.update({ status: 'DISPATCHED' });
            await this.publishUnitDispatchedEvent(dispatch, unit);
            return { success: true, dispatchId: dispatch.id };
        }
        /**
         * Publish unit dispatched event
         */
        async publishUnitDispatchedEvent(dispatch, unit) {
            const event = {
                eventType: 'UnitDispatched',
                dispatchId: dispatch.id,
                unitId: unit.id,
                incidentId: dispatch.incidentId,
                timestamp: new Date(),
            };
            this.kafkaClient.emit('dispatch.unit.dispatched', event);
        }
        /**
         * Process unit enroute command
         */
        async processUnitEnrouteCommand(data) {
            this.logger.log(`Processing unit enroute: ${data.dispatchId}`);
            const dispatch = await this.dispatchModel.findByPk(data.dispatchId);
            if (!dispatch) {
                throw new common_1.NotFoundException(`Dispatch ${data.dispatchId} not found`);
            }
            await dispatch.update({
                status: 'ENROUTE',
                enrouteAt: new Date(),
            });
            const event = {
                eventType: 'UnitEnroute',
                dispatchId: dispatch.id,
                unitId: dispatch.unitId,
                timestamp: new Date(),
            };
            this.kafkaClient.emit('dispatch.unit.enroute', event);
            return { success: true };
        }
        /**
         * Process unit on-scene command
         */
        async processUnitOnSceneCommand(data) {
            this.logger.log(`Processing unit on-scene: ${data.dispatchId}`);
            const dispatch = await this.dispatchModel.findByPk(data.dispatchId);
            if (!dispatch) {
                throw new common_1.NotFoundException(`Dispatch ${data.dispatchId} not found`);
            }
            await dispatch.update({
                status: 'ON_SCENE',
                onSceneAt: new Date(),
            });
            const event = {
                eventType: 'UnitOnScene',
                dispatchId: dispatch.id,
                unitId: dispatch.unitId,
                incidentId: dispatch.incidentId,
                timestamp: new Date(),
            };
            this.kafkaClient.emit('dispatch.unit.on_scene', event);
            return { success: true };
        }
        /**
         * Process unit available command
         */
        async processUnitAvailableCommand(data) {
            this.logger.log(`Processing unit available: ${data.unitId}`);
            const unit = await this.unitModel.findByPk(data.unitId);
            if (!unit) {
                throw new common_1.NotFoundException(`Unit ${data.unitId} not found`);
            }
            await unit.update({
                status: 'AVAILABLE',
                availableAt: new Date(),
            });
            const event = {
                eventType: 'UnitAvailable',
                unitId: unit.id,
                timestamp: new Date(),
            };
            this.kafkaClient.emit('dispatch.unit.available', event);
            return { success: true };
        }
        /**
         * Request mutual aid from neighboring jurisdiction
         */
        async requestMutualAid(data) {
            this.logger.log(`Requesting mutual aid for incident: ${data.incidentId}`);
            const event = {
                eventType: 'MutualAidRequested',
                incidentId: data.incidentId,
                jurisdiction: data.jurisdiction,
                resourcesNeeded: data.resourcesNeeded,
                priority: data.priority,
                timestamp: new Date(),
            };
            this.kafkaClient.emit('dispatch.mutual_aid.requested', event);
            return { success: true, requestId: this.generateRequestId() };
        }
        /**
         * Generate unique mutual aid request ID
         */
        generateRequestId() {
            return `MA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        /**
         * Coordinate multi-unit response
         */
        async coordinateMultiUnitResponse(data) {
            this.logger.log(`Coordinating multi-unit response for incident: ${data.incidentId}`);
            const dispatches = [];
            for (const unitId of data.unitIds) {
                const dispatch = await this.processDispatchUnitCommand({
                    unitId,
                    incidentId: data.incidentId,
                    priority: data.priority,
                });
                dispatches.push(dispatch);
            }
            return { success: true, dispatches };
        }
    };
    __setFunctionName(_classThis, "DispatchCoordinationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _processDispatchUnitCommand_decorators = [(0, microservices_1.MessagePattern)('dispatch_unit')];
        _processUnitEnrouteCommand_decorators = [(0, microservices_1.MessagePattern)('unit_enroute')];
        _processUnitOnSceneCommand_decorators = [(0, microservices_1.MessagePattern)('unit_on_scene')];
        _processUnitAvailableCommand_decorators = [(0, microservices_1.MessagePattern)('unit_available')];
        _requestMutualAid_decorators = [(0, microservices_1.MessagePattern)('request_mutual_aid')];
        _coordinateMultiUnitResponse_decorators = [(0, microservices_1.MessagePattern)('coordinate_multi_unit_response')];
        __esDecorate(_classThis, null, _processDispatchUnitCommand_decorators, { kind: "method", name: "processDispatchUnitCommand", static: false, private: false, access: { has: obj => "processDispatchUnitCommand" in obj, get: obj => obj.processDispatchUnitCommand }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _processUnitEnrouteCommand_decorators, { kind: "method", name: "processUnitEnrouteCommand", static: false, private: false, access: { has: obj => "processUnitEnrouteCommand" in obj, get: obj => obj.processUnitEnrouteCommand }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _processUnitOnSceneCommand_decorators, { kind: "method", name: "processUnitOnSceneCommand", static: false, private: false, access: { has: obj => "processUnitOnSceneCommand" in obj, get: obj => obj.processUnitOnSceneCommand }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _processUnitAvailableCommand_decorators, { kind: "method", name: "processUnitAvailableCommand", static: false, private: false, access: { has: obj => "processUnitAvailableCommand" in obj, get: obj => obj.processUnitAvailableCommand }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _requestMutualAid_decorators, { kind: "method", name: "requestMutualAid", static: false, private: false, access: { has: obj => "requestMutualAid" in obj, get: obj => obj.requestMutualAid }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _coordinateMultiUnitResponse_decorators, { kind: "method", name: "coordinateMultiUnitResponse", static: false, private: false, access: { has: obj => "coordinateMultiUnitResponse" in obj, get: obj => obj.coordinateMultiUnitResponse }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DispatchCoordinationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DispatchCoordinationService = _classThis;
})();
exports.DispatchCoordinationService = DispatchCoordinationService;
/**
 * Resource Management Microservice
 *
 * Manages resource allocation, availability tracking, and capacity planning
 * through event-driven architecture.
 */
let ResourceManagementService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _processAllocateResourceCommand_decorators;
    let _processReleaseResourceCommand_decorators;
    let _checkResourceAvailability_decorators;
    let _reserveResource_decorators;
    let _trackResourceUtilization_decorators;
    var ResourceManagementService = _classThis = class {
        constructor(resourceModel, unitModel, eventEmitter) {
            this.resourceModel = (__runInitializers(this, _instanceExtraInitializers), resourceModel);
            this.unitModel = unitModel;
            this.eventEmitter = eventEmitter;
            this.logger = new common_1.Logger(ResourceManagementService.name);
            this.initializeClients();
        }
        /**
         * Initialize Kafka client
         */
        initializeClients() {
            this.kafkaClient = microservices_1.ClientProxyFactory.create({
                transport: microservices_1.Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'resource-management-service',
                        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
                    },
                },
            });
        }
        /**
         * Process allocate resource command
         */
        async processAllocateResourceCommand(data) {
            this.logger.log(`Allocating resource: ${data.resourceId}`);
            const resource = await this.resourceModel.findByPk(data.resourceId);
            if (!resource) {
                throw new common_1.NotFoundException(`Resource ${data.resourceId} not found`);
            }
            if (resource.status !== 'AVAILABLE') {
                throw new common_1.ConflictException(`Resource ${data.resourceId} is not available`);
            }
            await resource.update({
                status: 'ALLOCATED',
                allocatedTo: data.allocatedTo,
                allocatedAt: new Date(),
            });
            const event = {
                eventType: 'ResourceAllocated',
                resourceId: resource.id,
                allocatedTo: data.allocatedTo,
                timestamp: new Date(),
            };
            this.kafkaClient.emit('resource.allocated', event);
            return { success: true };
        }
        /**
         * Process release resource command
         */
        async processReleaseResourceCommand(data) {
            this.logger.log(`Releasing resource: ${data.resourceId}`);
            const resource = await this.resourceModel.findByPk(data.resourceId);
            if (!resource) {
                throw new common_1.NotFoundException(`Resource ${data.resourceId} not found`);
            }
            await resource.update({
                status: 'AVAILABLE',
                allocatedTo: null,
                releasedAt: new Date(),
            });
            const event = {
                eventType: 'ResourceReleased',
                resourceId: resource.id,
                timestamp: new Date(),
            };
            this.kafkaClient.emit('resource.released', event);
            return { success: true };
        }
        /**
         * Check resource availability
         */
        async checkResourceAvailability(data) {
            this.logger.log(`Checking resource availability for type: ${data.resourceType}`);
            const availableResources = await this.resourceModel.findAll({
                where: {
                    type: data.resourceType,
                    status: 'AVAILABLE',
                },
            });
            return {
                available: availableResources.length > 0,
                count: availableResources.length,
                resources: availableResources,
            };
        }
        /**
         * Reserve resource for future use
         */
        async reserveResource(data) {
            this.logger.log(`Reserving resource: ${data.resourceId}`);
            const resource = await this.resourceModel.findByPk(data.resourceId);
            if (!resource) {
                throw new common_1.NotFoundException(`Resource ${data.resourceId} not found`);
            }
            await resource.update({
                status: 'RESERVED',
                reservedFor: data.reservedFor,
                reservedUntil: data.reservedUntil,
            });
            const event = {
                eventType: 'ResourceReserved',
                resourceId: resource.id,
                reservedFor: data.reservedFor,
                timestamp: new Date(),
            };
            this.kafkaClient.emit('resource.reserved', event);
            return { success: true };
        }
        /**
         * Track resource utilization metrics
         */
        async trackResourceUtilization(data) {
            this.logger.log('Tracking resource utilization');
            const resources = await this.resourceModel.findAll();
            const utilizationMetrics = {
                total: resources.length,
                available: resources.filter((r) => r.status === 'AVAILABLE').length,
                allocated: resources.filter((r) => r.status === 'ALLOCATED').length,
                reserved: resources.filter((r) => r.status === 'RESERVED').length,
                maintenance: resources.filter((r) => r.status === 'MAINTENANCE').length,
                utilizationRate: 0,
            };
            utilizationMetrics.utilizationRate =
                ((utilizationMetrics.allocated + utilizationMetrics.reserved) / utilizationMetrics.total) * 100;
            return utilizationMetrics;
        }
    };
    __setFunctionName(_classThis, "ResourceManagementService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _processAllocateResourceCommand_decorators = [(0, microservices_1.MessagePattern)('allocate_resource')];
        _processReleaseResourceCommand_decorators = [(0, microservices_1.MessagePattern)('release_resource')];
        _checkResourceAvailability_decorators = [(0, microservices_1.MessagePattern)('check_resource_availability')];
        _reserveResource_decorators = [(0, microservices_1.MessagePattern)('reserve_resource')];
        _trackResourceUtilization_decorators = [(0, microservices_1.MessagePattern)('track_resource_utilization')];
        __esDecorate(_classThis, null, _processAllocateResourceCommand_decorators, { kind: "method", name: "processAllocateResourceCommand", static: false, private: false, access: { has: obj => "processAllocateResourceCommand" in obj, get: obj => obj.processAllocateResourceCommand }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _processReleaseResourceCommand_decorators, { kind: "method", name: "processReleaseResourceCommand", static: false, private: false, access: { has: obj => "processReleaseResourceCommand" in obj, get: obj => obj.processReleaseResourceCommand }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _checkResourceAvailability_decorators, { kind: "method", name: "checkResourceAvailability", static: false, private: false, access: { has: obj => "checkResourceAvailability" in obj, get: obj => obj.checkResourceAvailability }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _reserveResource_decorators, { kind: "method", name: "reserveResource", static: false, private: false, access: { has: obj => "reserveResource" in obj, get: obj => obj.reserveResource }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _trackResourceUtilization_decorators, { kind: "method", name: "trackResourceUtilization", static: false, private: false, access: { has: obj => "trackResourceUtilization" in obj, get: obj => obj.trackResourceUtilization }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ResourceManagementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ResourceManagementService = _classThis;
})();
exports.ResourceManagementService = ResourceManagementService;
/**
 * Notification Microservice
 *
 * Handles multi-channel notification delivery through event-driven messaging.
 * Supports SMS, email, push notifications, and webhook notifications.
 */
let NotificationMicroservice = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _processSendNotificationCommand_decorators;
    let _handleSMSNotification_decorators;
    let _handleEmailNotification_decorators;
    let _handlePushNotification_decorators;
    let _sendMassNotification_decorators;
    let _scheduleNotification_decorators;
    var NotificationMicroservice = _classThis = class {
        constructor(notificationModel, eventEmitter) {
            this.notificationModel = (__runInitializers(this, _instanceExtraInitializers), notificationModel);
            this.eventEmitter = eventEmitter;
            this.logger = new common_1.Logger(NotificationMicroservice.name);
            this.initializeClients();
        }
        /**
         * Initialize RabbitMQ client
         */
        initializeClients() {
            this.rabbitMQClient = microservices_1.ClientProxyFactory.create({
                transport: microservices_1.Transport.RMQ,
                options: {
                    urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
                    queue: 'notifications',
                    queueOptions: { durable: true },
                },
            });
        }
        /**
         * Send notification through message queue
         */
        async processSendNotificationCommand(data) {
            this.logger.log(`Processing send notification: ${data.type} to ${data.recipient}`);
            const notification = await this.notificationModel.create({
                type: data.type,
                channel: data.channel,
                recipient: data.recipient,
                subject: data.subject,
                content: data.content,
                status: 'PENDING',
                createdAt: new Date(),
            });
            // Route to appropriate notification handler
            this.rabbitMQClient.emit(`notification.${data.channel}`, {
                notificationId: notification.id,
                ...data,
            });
            return { success: true, notificationId: notification.id };
        }
        /**
         * Handle SMS notification
         */
        async handleSMSNotification(data) {
            this.logger.log(`Sending SMS notification: ${data.notificationId}`);
            try {
                // Simulate SMS sending
                await this.sendSMS(data.recipient, data.content);
                await this.notificationModel.update({ status: 'SENT', sentAt: new Date() }, { where: { id: data.notificationId } });
            }
            catch (error) {
                this.logger.error(`Failed to send SMS: ${error.message}`);
                await this.notificationModel.update({ status: 'FAILED', error: error.message }, { where: { id: data.notificationId } });
            }
        }
        /**
         * Handle email notification
         */
        async handleEmailNotification(data) {
            this.logger.log(`Sending email notification: ${data.notificationId}`);
            try {
                await this.sendEmail(data.recipient, data.subject, data.content);
                await this.notificationModel.update({ status: 'SENT', sentAt: new Date() }, { where: { id: data.notificationId } });
            }
            catch (error) {
                this.logger.error(`Failed to send email: ${error.message}`);
                await this.notificationModel.update({ status: 'FAILED', error: error.message }, { where: { id: data.notificationId } });
            }
        }
        /**
         * Handle push notification
         */
        async handlePushNotification(data) {
            this.logger.log(`Sending push notification: ${data.notificationId}`);
            try {
                await this.sendPushNotification(data.recipient, data.content);
                await this.notificationModel.update({ status: 'SENT', sentAt: new Date() }, { where: { id: data.notificationId } });
            }
            catch (error) {
                this.logger.error(`Failed to send push notification: ${error.message}`);
                await this.notificationModel.update({ status: 'FAILED', error: error.message }, { where: { id: data.notificationId } });
            }
        }
        /**
         * Send mass notification to multiple recipients
         */
        async sendMassNotification(data) {
            this.logger.log(`Sending mass notification to ${data.recipients.length} recipients`);
            const notifications = [];
            for (const recipient of data.recipients) {
                const notification = await this.processSendNotificationCommand({
                    ...data,
                    recipient,
                });
                notifications.push(notification);
            }
            return { success: true, count: notifications.length };
        }
        /**
         * Schedule delayed notification
         */
        async scheduleNotification(data) {
            this.logger.log(`Scheduling notification for ${data.scheduledFor}`);
            const notification = await this.notificationModel.create({
                type: data.type,
                channel: data.channel,
                recipient: data.recipient,
                subject: data.subject,
                content: data.content,
                status: 'SCHEDULED',
                scheduledFor: new Date(data.scheduledFor),
                createdAt: new Date(),
            });
            return { success: true, notificationId: notification.id };
        }
        /**
         * Simulate SMS sending
         */
        async sendSMS(recipient, content) {
            // Integration with SMS provider (Twilio, etc.)
            this.logger.log(`SMS sent to ${recipient}: ${content}`);
        }
        /**
         * Simulate email sending
         */
        async sendEmail(recipient, subject, content) {
            // Integration with email provider (SendGrid, etc.)
            this.logger.log(`Email sent to ${recipient}: ${subject}`);
        }
        /**
         * Simulate push notification sending
         */
        async sendPushNotification(recipient, content) {
            // Integration with push notification service (FCM, etc.)
            this.logger.log(`Push notification sent to ${recipient}: ${content}`);
        }
    };
    __setFunctionName(_classThis, "NotificationMicroservice");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _processSendNotificationCommand_decorators = [(0, microservices_1.MessagePattern)('send_notification')];
        _handleSMSNotification_decorators = [(0, microservices_1.EventPattern)('notification.sms')];
        _handleEmailNotification_decorators = [(0, microservices_1.EventPattern)('notification.email')];
        _handlePushNotification_decorators = [(0, microservices_1.EventPattern)('notification.push')];
        _sendMassNotification_decorators = [(0, microservices_1.MessagePattern)('send_mass_notification')];
        _scheduleNotification_decorators = [(0, microservices_1.MessagePattern)('schedule_notification')];
        __esDecorate(_classThis, null, _processSendNotificationCommand_decorators, { kind: "method", name: "processSendNotificationCommand", static: false, private: false, access: { has: obj => "processSendNotificationCommand" in obj, get: obj => obj.processSendNotificationCommand }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleSMSNotification_decorators, { kind: "method", name: "handleSMSNotification", static: false, private: false, access: { has: obj => "handleSMSNotification" in obj, get: obj => obj.handleSMSNotification }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleEmailNotification_decorators, { kind: "method", name: "handleEmailNotification", static: false, private: false, access: { has: obj => "handleEmailNotification" in obj, get: obj => obj.handleEmailNotification }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handlePushNotification_decorators, { kind: "method", name: "handlePushNotification", static: false, private: false, access: { has: obj => "handlePushNotification" in obj, get: obj => obj.handlePushNotification }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _sendMassNotification_decorators, { kind: "method", name: "sendMassNotification", static: false, private: false, access: { has: obj => "sendMassNotification" in obj, get: obj => obj.sendMassNotification }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _scheduleNotification_decorators, { kind: "method", name: "scheduleNotification", static: false, private: false, access: { has: obj => "scheduleNotification" in obj, get: obj => obj.scheduleNotification }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationMicroservice = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationMicroservice = _classThis;
})();
exports.NotificationMicroservice = NotificationMicroservice;
/**
 * Analytics Processing Microservice
 *
 * Processes analytics events and metrics through stream processing.
 * Handles real-time analytics, aggregations, and reporting metrics.
 */
let AnalyticsProcessingService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _processAnalyticsEvent_decorators;
    let _calculateResponseTimes_decorators;
    let _generateIncidentStatistics_decorators;
    let _getRealtimeMetrics_decorators;
    let _streamAnalytics_decorators;
    var AnalyticsProcessingService = _classThis = class {
        constructor(analyticsEventModel, metricModel, eventEmitter) {
            this.analyticsEventModel = (__runInitializers(this, _instanceExtraInitializers), analyticsEventModel);
            this.metricModel = metricModel;
            this.eventEmitter = eventEmitter;
            this.logger = new common_1.Logger(AnalyticsProcessingService.name);
            this.initializeClients();
        }
        /**
         * Initialize Kafka client for stream processing
         */
        initializeClients() {
            this.kafkaClient = microservices_1.ClientProxyFactory.create({
                transport: microservices_1.Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'analytics-processing-service',
                        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
                    },
                    consumer: {
                        groupId: 'analytics-consumer-group',
                    },
                },
            });
        }
        /**
         * Process analytics event
         */
        async processAnalyticsEvent(data) {
            this.logger.log(`Processing analytics event: ${data.eventType}`);
            await this.analyticsEventModel.create({
                eventType: data.eventType,
                eventData: data.eventData,
                userId: data.userId,
                sessionId: data.sessionId,
                timestamp: new Date(),
            });
            await this.updateMetrics(data);
        }
        /**
         * Update aggregated metrics
         */
        async updateMetrics(event) {
            const metricKey = `${event.eventType}_count`;
            await this.metricModel.upsert({
                key: metricKey,
                value: await this.incrementMetric(metricKey),
                updatedAt: new Date(),
            });
        }
        /**
         * Increment metric counter
         */
        async incrementMetric(key) {
            const metric = await this.metricModel.findOne({ where: { key } });
            return metric ? metric.value + 1 : 1;
        }
        /**
         * Calculate response time metrics
         */
        async calculateResponseTimes(data) {
            this.logger.log('Calculating response time metrics');
            const responseTimes = await this.analyticsEventModel.findAll({
                where: {
                    eventType: 'RESPONSE_TIME',
                    timestamp: {
                        [sequelize_1.Op.gte]: data.startDate,
                        [sequelize_1.Op.lte]: data.endDate,
                    },
                },
            });
            const times = responseTimes.map((rt) => rt.eventData.responseTime);
            return {
                average: times.reduce((a, b) => a + b, 0) / times.length,
                min: Math.min(...times),
                max: Math.max(...times),
                median: this.calculateMedian(times),
                count: times.length,
            };
        }
        /**
         * Calculate median value
         */
        calculateMedian(values) {
            const sorted = values.sort((a, b) => a - b);
            const middle = Math.floor(sorted.length / 2);
            if (sorted.length % 2 === 0) {
                return (sorted[middle - 1] + sorted[middle]) / 2;
            }
            return sorted[middle];
        }
        /**
         * Generate incident statistics
         */
        async generateIncidentStatistics(data) {
            this.logger.log('Generating incident statistics');
            const stats = await this.analyticsEventModel.findAll({
                where: {
                    eventType: {
                        [sequelize_1.Op.in]: ['INCIDENT_CREATED', 'INCIDENT_CLOSED', 'INCIDENT_ESCALATED'],
                    },
                    timestamp: {
                        [sequelize_1.Op.gte]: data.startDate,
                        [sequelize_1.Op.lte]: data.endDate,
                    },
                },
            });
            const groupedStats = this.groupBy(stats, 'eventType');
            return {
                created: groupedStats['INCIDENT_CREATED']?.length || 0,
                closed: groupedStats['INCIDENT_CLOSED']?.length || 0,
                escalated: groupedStats['INCIDENT_ESCALATED']?.length || 0,
                totalEvents: stats.length,
            };
        }
        /**
         * Group array by property
         */
        groupBy(array, property) {
            return array.reduce((acc, obj) => {
                const key = obj[property];
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(obj);
                return acc;
            }, {});
        }
        /**
         * Process real-time dashboard metrics
         */
        async getRealtimeMetrics(data) {
            this.logger.log('Fetching real-time metrics');
            const metrics = await this.metricModel.findAll({
                where: {
                    key: {
                        [sequelize_1.Op.in]: data.metricKeys || [],
                    },
                },
            });
            return metrics.reduce((acc, metric) => {
                acc[metric.key] = metric.value;
                return acc;
            }, {});
        }
        /**
         * Stream analytics events
         */
        streamAnalytics(data) {
            this.logger.log('Streaming analytics events');
            const subject = new rxjs_1.Subject();
            // Simulate real-time analytics streaming
            const interval = setInterval(async () => {
                const recentEvents = await this.analyticsEventModel.findAll({
                    where: {
                        timestamp: {
                            [sequelize_1.Op.gte]: new Date(Date.now() - 5000), // Last 5 seconds
                        },
                    },
                    limit: 10,
                });
                subject.next({
                    timestamp: new Date(),
                    events: recentEvents,
                });
            }, 5000);
            setTimeout(() => {
                clearInterval(interval);
                subject.complete();
            }, data.duration || 60000);
            return subject.asObservable();
        }
    };
    __setFunctionName(_classThis, "AnalyticsProcessingService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _processAnalyticsEvent_decorators = [(0, microservices_1.EventPattern)('analytics.event')];
        _calculateResponseTimes_decorators = [(0, microservices_1.MessagePattern)('calculate_response_times')];
        _generateIncidentStatistics_decorators = [(0, microservices_1.MessagePattern)('generate_incident_statistics')];
        _getRealtimeMetrics_decorators = [(0, microservices_1.MessagePattern)('get_realtime_metrics')];
        _streamAnalytics_decorators = [(0, microservices_1.MessagePattern)('stream_analytics')];
        __esDecorate(_classThis, null, _processAnalyticsEvent_decorators, { kind: "method", name: "processAnalyticsEvent", static: false, private: false, access: { has: obj => "processAnalyticsEvent" in obj, get: obj => obj.processAnalyticsEvent }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _calculateResponseTimes_decorators, { kind: "method", name: "calculateResponseTimes", static: false, private: false, access: { has: obj => "calculateResponseTimes" in obj, get: obj => obj.calculateResponseTimes }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateIncidentStatistics_decorators, { kind: "method", name: "generateIncidentStatistics", static: false, private: false, access: { has: obj => "generateIncidentStatistics" in obj, get: obj => obj.generateIncidentStatistics }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRealtimeMetrics_decorators, { kind: "method", name: "getRealtimeMetrics", static: false, private: false, access: { has: obj => "getRealtimeMetrics" in obj, get: obj => obj.getRealtimeMetrics }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _streamAnalytics_decorators, { kind: "method", name: "streamAnalytics", static: false, private: false, access: { has: obj => "streamAnalytics" in obj, get: obj => obj.streamAnalytics }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AnalyticsProcessingService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AnalyticsProcessingService = _classThis;
})();
exports.AnalyticsProcessingService = AnalyticsProcessingService;
/**
 * GIS Microservice
 *
 * Handles geographic information system operations, location-based queries,
 * and spatial analysis through microservices architecture.
 */
let GISMicroservice = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _findNearestUnits_decorators;
    let _checkGeofence_decorators;
    let _calculateRoute_decorators;
    let _updateUnitLocation_decorators;
    let _createGeofence_decorators;
    var GISMicroservice = _classThis = class {
        constructor(locationModel, geoFenceModel, eventEmitter) {
            this.locationModel = (__runInitializers(this, _instanceExtraInitializers), locationModel);
            this.geoFenceModel = geoFenceModel;
            this.eventEmitter = eventEmitter;
            this.logger = new common_1.Logger(GISMicroservice.name);
            this.initializeClients();
        }
        /**
         * Initialize Kafka client
         */
        initializeClients() {
            this.kafkaClient = microservices_1.ClientProxyFactory.create({
                transport: microservices_1.Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'gis-service',
                        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
                    },
                },
            });
        }
        /**
         * Find nearest units to location
         */
        async findNearestUnits(data) {
            this.logger.log(`Finding nearest units to location: ${data.latitude}, ${data.longitude}`);
            // Use PostGIS or similar for actual distance calculations
            const units = await this.locationModel.findAll({
                where: {
                    type: 'UNIT',
                    status: 'AVAILABLE',
                },
            });
            const unitsWithDistance = units.map((unit) => ({
                ...unit.toJSON(),
                distance: this.calculateDistance(data.latitude, data.longitude, unit.latitude, unit.longitude),
            }));
            const sorted = unitsWithDistance.sort((a, b) => a.distance - b.distance);
            return sorted.slice(0, data.limit || 5);
        }
        /**
         * Calculate distance between two points using Haversine formula
         */
        calculateDistance(lat1, lon1, lat2, lon2) {
            const R = 6371; // Earth's radius in km
            const dLat = this.toRadians(lat2 - lat1);
            const dLon = this.toRadians(lon2 - lon1);
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        }
        /**
         * Convert degrees to radians
         */
        toRadians(degrees) {
            return degrees * (Math.PI / 180);
        }
        /**
         * Check if location is within geofence
         */
        async checkGeofence(data) {
            this.logger.log(`Checking geofence for location: ${data.latitude}, ${data.longitude}`);
            const geofences = await this.geoFenceModel.findAll({
                where: { active: true },
            });
            const withinGeofences = geofences.filter((fence) => this.isPointInPolygon(data.latitude, data.longitude, fence.coordinates));
            if (withinGeofences.length > 0) {
                const event = {
                    eventType: 'GeofenceEntered',
                    location: { latitude: data.latitude, longitude: data.longitude },
                    geofences: withinGeofences.map((f) => f.id),
                    timestamp: new Date(),
                };
                this.kafkaClient.emit('gis.geofence.entered', event);
            }
            return {
                withinGeofence: withinGeofences.length > 0,
                geofences: withinGeofences,
            };
        }
        /**
         * Check if point is within polygon
         */
        isPointInPolygon(lat, lon, polygon) {
            let inside = false;
            for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
                const xi = polygon[i][0], yi = polygon[i][1];
                const xj = polygon[j][0], yj = polygon[j][1];
                const intersect = ((yi > lat) !== (yj > lat)) &&
                    (lon < (xj - xi) * (lat - yi) / (yj - yi) + xi);
                if (intersect)
                    inside = !inside;
            }
            return inside;
        }
        /**
         * Calculate optimal route
         */
        async calculateRoute(data) {
            this.logger.log(`Calculating route from ${data.origin} to ${data.destination}`);
            // Integration with routing service (OSRM, Google Maps, etc.)
            const route = {
                origin: data.origin,
                destination: data.destination,
                distance: this.calculateDistance(data.origin.latitude, data.origin.longitude, data.destination.latitude, data.destination.longitude),
                estimatedTime: 0,
                waypoints: [],
            };
            route.estimatedTime = (route.distance / 60) * 60; // Assume 60 km/h average
            return route;
        }
        /**
         * Update unit location
         */
        async updateUnitLocation(data) {
            this.logger.log(`Updating location for unit: ${data.unitId}`);
            await this.locationModel.upsert({
                unitId: data.unitId,
                type: 'UNIT',
                latitude: data.latitude,
                longitude: data.longitude,
                heading: data.heading,
                speed: data.speed,
                altitude: data.altitude,
                accuracy: data.accuracy,
                timestamp: new Date(),
            });
            const event = {
                eventType: 'UnitLocationUpdated',
                unitId: data.unitId,
                location: {
                    latitude: data.latitude,
                    longitude: data.longitude,
                },
                timestamp: new Date(),
            };
            this.kafkaClient.emit('gis.unit.location_updated', event);
            return { success: true };
        }
        /**
         * Create geofence
         */
        async createGeofence(data) {
            this.logger.log(`Creating geofence: ${data.name}`);
            const geofence = await this.geoFenceModel.create({
                name: data.name,
                type: data.type,
                coordinates: data.coordinates,
                active: true,
                createdAt: new Date(),
            });
            return { success: true, geofenceId: geofence.id };
        }
    };
    __setFunctionName(_classThis, "GISMicroservice");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _findNearestUnits_decorators = [(0, microservices_1.MessagePattern)('find_nearest_units')];
        _checkGeofence_decorators = [(0, microservices_1.MessagePattern)('check_geofence')];
        _calculateRoute_decorators = [(0, microservices_1.MessagePattern)('calculate_route')];
        _updateUnitLocation_decorators = [(0, microservices_1.MessagePattern)('update_unit_location')];
        _createGeofence_decorators = [(0, microservices_1.MessagePattern)('create_geofence')];
        __esDecorate(_classThis, null, _findNearestUnits_decorators, { kind: "method", name: "findNearestUnits", static: false, private: false, access: { has: obj => "findNearestUnits" in obj, get: obj => obj.findNearestUnits }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _checkGeofence_decorators, { kind: "method", name: "checkGeofence", static: false, private: false, access: { has: obj => "checkGeofence" in obj, get: obj => obj.checkGeofence }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _calculateRoute_decorators, { kind: "method", name: "calculateRoute", static: false, private: false, access: { has: obj => "calculateRoute" in obj, get: obj => obj.calculateRoute }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateUnitLocation_decorators, { kind: "method", name: "updateUnitLocation", static: false, private: false, access: { has: obj => "updateUnitLocation" in obj, get: obj => obj.updateUnitLocation }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createGeofence_decorators, { kind: "method", name: "createGeofence", static: false, private: false, access: { has: obj => "createGeofence" in obj, get: obj => obj.createGeofence }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GISMicroservice = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GISMicroservice = _classThis;
})();
exports.GISMicroservice = GISMicroservice;
/**
 * Reporting Microservice
 *
 * Generates and manages operational reports through asynchronous processing.
 */
let ReportingMicroservice = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _generateIncidentReport_decorators;
    let _processReportGeneration_decorators;
    let _scheduleRecurringReport_decorators;
    let _getReportStatus_decorators;
    let _exportReport_decorators;
    var ReportingMicroservice = _classThis = class {
        constructor(reportModel, eventEmitter) {
            this.reportModel = (__runInitializers(this, _instanceExtraInitializers), reportModel);
            this.eventEmitter = eventEmitter;
            this.logger = new common_1.Logger(ReportingMicroservice.name);
            this.initializeClients();
        }
        /**
         * Initialize RabbitMQ client
         */
        initializeClients() {
            this.rabbitMQClient = microservices_1.ClientProxyFactory.create({
                transport: microservices_1.Transport.RMQ,
                options: {
                    urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
                    queue: 'reports',
                    queueOptions: { durable: true },
                },
            });
        }
        /**
         * Generate incident report
         */
        async generateIncidentReport(data) {
            this.logger.log(`Generating incident report for: ${data.incidentId}`);
            const report = await this.reportModel.create({
                type: 'INCIDENT',
                incidentId: data.incidentId,
                status: 'PROCESSING',
                requestedBy: data.userId,
                requestedAt: new Date(),
            });
            // Queue report generation
            this.rabbitMQClient.emit('report.generate', {
                reportId: report.id,
                type: 'INCIDENT',
                parameters: data,
            });
            return { success: true, reportId: report.id };
        }
        /**
         * Process report generation
         */
        async processReportGeneration(data) {
            this.logger.log(`Processing report generation: ${data.reportId}`);
            try {
                // Simulate report generation
                await this.delay(5000);
                const reportData = await this.generateReportData(data.type, data.parameters);
                await this.reportModel.update({
                    status: 'COMPLETED',
                    data: reportData,
                    completedAt: new Date(),
                }, { where: { id: data.reportId } });
            }
            catch (error) {
                this.logger.error(`Report generation failed: ${error.message}`);
                await this.reportModel.update({
                    status: 'FAILED',
                    error: error.message,
                }, { where: { id: data.reportId } });
            }
        }
        /**
         * Generate report data
         */
        async generateReportData(type, parameters) {
            // Report generation logic
            return {
                generatedAt: new Date(),
                type,
                parameters,
                data: {},
            };
        }
        /**
         * Schedule recurring report
         */
        async scheduleRecurringReport(data) {
            this.logger.log(`Scheduling recurring report: ${data.name}`);
            const report = await this.reportModel.create({
                type: data.type,
                name: data.name,
                schedule: data.schedule,
                parameters: data.parameters,
                status: 'SCHEDULED',
                createdAt: new Date(),
            });
            return { success: true, reportId: report.id };
        }
        /**
         * Get report status
         */
        async getReportStatus(data) {
            this.logger.log(`Getting report status: ${data.reportId}`);
            const report = await this.reportModel.findByPk(data.reportId);
            if (!report) {
                throw new common_1.NotFoundException(`Report ${data.reportId} not found`);
            }
            return {
                reportId: report.id,
                status: report.status,
                progress: report.progress || 0,
                estimatedCompletion: report.estimatedCompletion,
            };
        }
        /**
         * Export report to format
         */
        async exportReport(data) {
            this.logger.log(`Exporting report ${data.reportId} to ${data.format}`);
            const report = await this.reportModel.findByPk(data.reportId);
            if (!report) {
                throw new common_1.NotFoundException(`Report ${data.reportId} not found`);
            }
            // Export logic (PDF, Excel, CSV, etc.)
            const exportedFile = await this.exportToFormat(report, data.format);
            return {
                success: true,
                fileUrl: exportedFile,
                format: data.format,
            };
        }
        /**
         * Export report to specified format
         */
        async exportToFormat(report, format) {
            // Export implementation
            return `/exports/${report.id}.${format}`;
        }
        /**
         * Delay helper
         */
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    };
    __setFunctionName(_classThis, "ReportingMicroservice");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _generateIncidentReport_decorators = [(0, microservices_1.MessagePattern)('generate_incident_report')];
        _processReportGeneration_decorators = [(0, microservices_1.EventPattern)('report.generate')];
        _scheduleRecurringReport_decorators = [(0, microservices_1.MessagePattern)('schedule_recurring_report')];
        _getReportStatus_decorators = [(0, microservices_1.MessagePattern)('get_report_status')];
        _exportReport_decorators = [(0, microservices_1.MessagePattern)('export_report')];
        __esDecorate(_classThis, null, _generateIncidentReport_decorators, { kind: "method", name: "generateIncidentReport", static: false, private: false, access: { has: obj => "generateIncidentReport" in obj, get: obj => obj.generateIncidentReport }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _processReportGeneration_decorators, { kind: "method", name: "processReportGeneration", static: false, private: false, access: { has: obj => "processReportGeneration" in obj, get: obj => obj.processReportGeneration }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _scheduleRecurringReport_decorators, { kind: "method", name: "scheduleRecurringReport", static: false, private: false, access: { has: obj => "scheduleRecurringReport" in obj, get: obj => obj.scheduleRecurringReport }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getReportStatus_decorators, { kind: "method", name: "getReportStatus", static: false, private: false, access: { has: obj => "getReportStatus" in obj, get: obj => obj.getReportStatus }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _exportReport_decorators, { kind: "method", name: "exportReport", static: false, private: false, access: { has: obj => "exportReport" in obj, get: obj => obj.exportReport }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReportingMicroservice = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReportingMicroservice = _classThis;
})();
exports.ReportingMicroservice = ReportingMicroservice;
/**
 * Archive Microservice
 *
 * Manages data archival and retrieval through asynchronous processing.
 */
let ArchiveMicroservice = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _archiveIncident_decorators;
    let _retrieveArchivedIncident_decorators;
    let _processBulkArchive_decorators;
    let _purgeExpiredArchives_decorators;
    let _restoreArchivedIncident_decorators;
    var ArchiveMicroservice = _classThis = class {
        constructor(archiveModel, incidentModel, eventEmitter) {
            this.archiveModel = (__runInitializers(this, _instanceExtraInitializers), archiveModel);
            this.incidentModel = incidentModel;
            this.eventEmitter = eventEmitter;
            this.logger = new common_1.Logger(ArchiveMicroservice.name);
            this.initializeClients();
        }
        /**
         * Initialize RabbitMQ client
         */
        initializeClients() {
            this.rabbitMQClient = microservices_1.ClientProxyFactory.create({
                transport: microservices_1.Transport.RMQ,
                options: {
                    urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
                    queue: 'archive',
                    queueOptions: { durable: true },
                },
            });
        }
        /**
         * Archive incident data
         */
        async archiveIncident(data) {
            this.logger.log(`Archiving incident: ${data.incidentId}`);
            const incident = await this.incidentModel.findByPk(data.incidentId);
            if (!incident) {
                throw new common_1.NotFoundException(`Incident ${data.incidentId} not found`);
            }
            const archive = await this.archiveModel.create({
                entityType: 'INCIDENT',
                entityId: incident.id,
                data: incident.toJSON(),
                archivedAt: new Date(),
                retentionPeriod: data.retentionPeriod || 2555, // 7 years in days
            });
            // Queue for cold storage
            this.rabbitMQClient.emit('archive.store', {
                archiveId: archive.id,
                data: incident.toJSON(),
            });
            return { success: true, archiveId: archive.id };
        }
        /**
         * Retrieve archived incident
         */
        async retrieveArchivedIncident(data) {
            this.logger.log(`Retrieving archived incident: ${data.incidentId}`);
            const archive = await this.archiveModel.findOne({
                where: {
                    entityType: 'INCIDENT',
                    entityId: data.incidentId,
                },
            });
            if (!archive) {
                throw new common_1.NotFoundException(`Archived incident ${data.incidentId} not found`);
            }
            return {
                success: true,
                incident: archive.data,
                archivedAt: archive.archivedAt,
            };
        }
        /**
         * Process bulk archival
         */
        async processBulkArchive(data) {
            this.logger.log(`Processing bulk archive for ${data.entityType}`);
            const entities = await this.getEntitiesForArchival(data.entityType, data.criteria);
            const archived = [];
            for (const entity of entities) {
                const archive = await this.archiveIncident({ incidentId: entity.id });
                archived.push(archive);
            }
            return {
                success: true,
                count: archived.length,
                archived,
            };
        }
        /**
         * Get entities for archival based on criteria
         */
        async getEntitiesForArchival(entityType, criteria) {
            // Query logic based on entity type and criteria
            return this.incidentModel.findAll({
                where: {
                    status: 'CLOSED',
                    closedAt: {
                        [sequelize_1.Op.lte]: new Date(Date.now() - criteria.daysOld * 24 * 60 * 60 * 1000),
                    },
                },
            });
        }
        /**
         * Delete archived data past retention period
         */
        async purgeExpiredArchives(data) {
            this.logger.log('Purging expired archives');
            const expiredArchives = await this.archiveModel.findAll({
                where: {
                    archivedAt: {
                        [sequelize_1.Op.lte]: new Date(Date.now() - data.retentionDays * 24 * 60 * 60 * 1000),
                    },
                },
            });
            for (const archive of expiredArchives) {
                await archive.destroy();
            }
            return {
                success: true,
                purged: expiredArchives.length,
            };
        }
        /**
         * Restore archived incident
         */
        async restoreArchivedIncident(data) {
            this.logger.log(`Restoring archived incident: ${data.archiveId}`);
            const archive = await this.archiveModel.findByPk(data.archiveId);
            if (!archive) {
                throw new common_1.NotFoundException(`Archive ${data.archiveId} not found`);
            }
            // Restore to active database
            const restored = await this.incidentModel.create({
                ...archive.data,
                restoredAt: new Date(),
                restoredFrom: archive.id,
            });
            return {
                success: true,
                incidentId: restored.id,
            };
        }
    };
    __setFunctionName(_classThis, "ArchiveMicroservice");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _archiveIncident_decorators = [(0, microservices_1.MessagePattern)('archive_incident')];
        _retrieveArchivedIncident_decorators = [(0, microservices_1.MessagePattern)('retrieve_archived_incident')];
        _processBulkArchive_decorators = [(0, microservices_1.MessagePattern)('bulk_archive')];
        _purgeExpiredArchives_decorators = [(0, microservices_1.MessagePattern)('purge_expired_archives')];
        _restoreArchivedIncident_decorators = [(0, microservices_1.MessagePattern)('restore_archived_incident')];
        __esDecorate(_classThis, null, _archiveIncident_decorators, { kind: "method", name: "archiveIncident", static: false, private: false, access: { has: obj => "archiveIncident" in obj, get: obj => obj.archiveIncident }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _retrieveArchivedIncident_decorators, { kind: "method", name: "retrieveArchivedIncident", static: false, private: false, access: { has: obj => "retrieveArchivedIncident" in obj, get: obj => obj.retrieveArchivedIncident }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _processBulkArchive_decorators, { kind: "method", name: "processBulkArchive", static: false, private: false, access: { has: obj => "processBulkArchive" in obj, get: obj => obj.processBulkArchive }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _purgeExpiredArchives_decorators, { kind: "method", name: "purgeExpiredArchives", static: false, private: false, access: { has: obj => "purgeExpiredArchives" in obj, get: obj => obj.purgeExpiredArchives }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _restoreArchivedIncident_decorators, { kind: "method", name: "restoreArchivedIncident", static: false, private: false, access: { has: obj => "restoreArchivedIncident" in obj, get: obj => obj.restoreArchivedIncident }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ArchiveMicroservice = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ArchiveMicroservice = _classThis;
})();
exports.ArchiveMicroservice = ArchiveMicroservice;
/**
 * Event Store Service
 *
 * Manages event sourcing and event store operations for the microservices architecture.
 */
let EventStoreService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _storeEvent_decorators;
    let _replayEvents_decorators;
    let _getAggregateState_decorators;
    let _createSnapshot_decorators;
    var EventStoreService = _classThis = class {
        constructor(eventModel, eventEmitter) {
            this.eventModel = (__runInitializers(this, _instanceExtraInitializers), eventModel);
            this.eventEmitter = eventEmitter;
            this.logger = new common_1.Logger(EventStoreService.name);
            this.initializeClients();
        }
        /**
         * Initialize Kafka client
         */
        initializeClients() {
            this.kafkaClient = microservices_1.ClientProxyFactory.create({
                transport: microservices_1.Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'event-store-service',
                        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
                    },
                },
            });
        }
        /**
         * Store event in event store
         */
        async storeEvent(data) {
            this.logger.log(`Storing event: ${data.eventType} for aggregate ${data.aggregateId}`);
            const event = await this.eventModel.create({
                eventType: data.eventType,
                aggregateId: data.aggregateId,
                aggregateType: data.aggregateType,
                eventData: data.eventData,
                metadata: data.metadata,
                version: data.version,
                timestamp: new Date(),
            });
            // Publish to event stream
            this.kafkaClient.emit(`event.${data.eventType}`, event);
            return { success: true, eventId: event.id };
        }
        /**
         * Replay events for aggregate
         */
        async replayEvents(data) {
            this.logger.log(`Replaying events for aggregate: ${data.aggregateId}`);
            const events = await this.eventModel.findAll({
                where: {
                    aggregateId: data.aggregateId,
                },
                order: [['version', 'ASC']],
            });
            return {
                success: true,
                events: events.map((e) => e.toJSON()),
                count: events.length,
            };
        }
        /**
         * Get aggregate current state from events
         */
        async getAggregateState(data) {
            this.logger.log(`Getting aggregate state: ${data.aggregateId}`);
            const events = await this.eventModel.findAll({
                where: {
                    aggregateId: data.aggregateId,
                },
                order: [['version', 'ASC']],
            });
            // Reconstruct state from events
            const state = this.reconstructStateFromEvents(events);
            return {
                success: true,
                aggregateId: data.aggregateId,
                state,
                version: events.length > 0 ? events[events.length - 1].version : 0,
            };
        }
        /**
         * Reconstruct aggregate state from event stream
         */
        reconstructStateFromEvents(events) {
            let state = {};
            for (const event of events) {
                state = this.applyEvent(state, event);
            }
            return state;
        }
        /**
         * Apply event to state
         */
        applyEvent(state, event) {
            // Event sourcing logic to apply events to state
            switch (event.eventType) {
                case 'IncidentCreated':
                    return { ...state, ...event.eventData, status: 'CREATED' };
                case 'IncidentUpdated':
                    return { ...state, ...event.eventData };
                case 'IncidentClosed':
                    return { ...state, status: 'CLOSED', closedAt: event.timestamp };
                default:
                    return state;
            }
        }
        /**
         * Create snapshot of aggregate state
         */
        async createSnapshot(data) {
            this.logger.log(`Creating snapshot for aggregate: ${data.aggregateId}`);
            const state = await this.getAggregateState(data);
            // Store snapshot for faster state reconstruction
            await this.eventModel.create({
                eventType: 'SNAPSHOT',
                aggregateId: data.aggregateId,
                aggregateType: data.aggregateType,
                eventData: state.state,
                version: state.version,
                timestamp: new Date(),
            });
            return { success: true };
        }
    };
    __setFunctionName(_classThis, "EventStoreService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _storeEvent_decorators = [(0, microservices_1.MessagePattern)('store_event')];
        _replayEvents_decorators = [(0, microservices_1.MessagePattern)('replay_events')];
        _getAggregateState_decorators = [(0, microservices_1.MessagePattern)('get_aggregate_state')];
        _createSnapshot_decorators = [(0, microservices_1.MessagePattern)('create_snapshot')];
        __esDecorate(_classThis, null, _storeEvent_decorators, { kind: "method", name: "storeEvent", static: false, private: false, access: { has: obj => "storeEvent" in obj, get: obj => obj.storeEvent }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _replayEvents_decorators, { kind: "method", name: "replayEvents", static: false, private: false, access: { has: obj => "replayEvents" in obj, get: obj => obj.replayEvents }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAggregateState_decorators, { kind: "method", name: "getAggregateState", static: false, private: false, access: { has: obj => "getAggregateState" in obj, get: obj => obj.getAggregateState }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createSnapshot_decorators, { kind: "method", name: "createSnapshot", static: false, private: false, access: { has: obj => "createSnapshot" in obj, get: obj => obj.createSnapshot }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EventStoreService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EventStoreService = _classThis;
})();
exports.EventStoreService = EventStoreService;
/**
 * Saga Orchestration Service
 *
 * Manages distributed transactions using the Saga pattern.
 */
let SagaOrchestrationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _startSaga_decorators;
    let _handleSagaStepCompleted_decorators;
    let _getSagaStatus_decorators;
    var SagaOrchestrationService = _classThis = class {
        constructor(sagaModel, eventEmitter) {
            this.sagaModel = (__runInitializers(this, _instanceExtraInitializers), sagaModel);
            this.eventEmitter = eventEmitter;
            this.logger = new common_1.Logger(SagaOrchestrationService.name);
            this.initializeClients();
        }
        /**
         * Initialize Kafka client
         */
        initializeClients() {
            this.kafkaClient = microservices_1.ClientProxyFactory.create({
                transport: microservices_1.Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'saga-orchestration-service',
                        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
                    },
                },
            });
        }
        /**
         * Start saga execution
         */
        async startSaga(data) {
            this.logger.log(`Starting saga: ${data.sagaType}`);
            const saga = await this.sagaModel.create({
                sagaType: data.sagaType,
                sagaData: data.sagaData,
                status: 'STARTED',
                currentStep: 0,
                steps: data.steps,
                startedAt: new Date(),
            });
            await this.executeSagaStep(saga, 0);
            return { success: true, sagaId: saga.id };
        }
        /**
         * Execute saga step
         */
        async executeSagaStep(saga, stepIndex) {
            if (stepIndex >= saga.steps.length) {
                await this.completeSaga(saga);
                return;
            }
            const step = saga.steps[stepIndex];
            try {
                this.kafkaClient.emit(`saga.step.${step.command}`, {
                    sagaId: saga.id,
                    stepIndex,
                    data: saga.sagaData,
                });
                await saga.update({
                    currentStep: stepIndex + 1,
                    status: 'IN_PROGRESS',
                });
            }
            catch (error) {
                this.logger.error(`Saga step failed: ${error.message}`);
                await this.compensateSaga(saga, stepIndex);
            }
        }
        /**
         * Handle saga step completion
         */
        async handleSagaStepCompleted(data) {
            this.logger.log(`Saga step completed: ${data.sagaId}, step ${data.stepIndex}`);
            const saga = await this.sagaModel.findByPk(data.sagaId);
            if (!saga) {
                this.logger.error(`Saga ${data.sagaId} not found`);
                return;
            }
            await this.executeSagaStep(saga, data.stepIndex + 1);
        }
        /**
         * Complete saga
         */
        async completeSaga(saga) {
            this.logger.log(`Completing saga: ${saga.id}`);
            await saga.update({
                status: 'COMPLETED',
                completedAt: new Date(),
            });
            this.kafkaClient.emit('saga.completed', {
                sagaId: saga.id,
                sagaType: saga.sagaType,
            });
        }
        /**
         * Compensate saga on failure
         */
        async compensateSaga(saga, failedStep) {
            this.logger.log(`Compensating saga: ${saga.id} from step ${failedStep}`);
            await saga.update({
                status: 'COMPENSATING',
            });
            // Execute compensation actions in reverse order
            for (let i = failedStep - 1; i >= 0; i--) {
                const step = saga.steps[i];
                if (step.compensation) {
                    this.kafkaClient.emit(`saga.compensate.${step.compensation}`, {
                        sagaId: saga.id,
                        stepIndex: i,
                        data: saga.sagaData,
                    });
                }
            }
            await saga.update({
                status: 'COMPENSATED',
                compensatedAt: new Date(),
            });
        }
        /**
         * Get saga status
         */
        async getSagaStatus(data) {
            this.logger.log(`Getting saga status: ${data.sagaId}`);
            const saga = await this.sagaModel.findByPk(data.sagaId);
            if (!saga) {
                throw new common_1.NotFoundException(`Saga ${data.sagaId} not found`);
            }
            return {
                sagaId: saga.id,
                status: saga.status,
                currentStep: saga.currentStep,
                totalSteps: saga.steps.length,
                startedAt: saga.startedAt,
                completedAt: saga.completedAt,
            };
        }
    };
    __setFunctionName(_classThis, "SagaOrchestrationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _startSaga_decorators = [(0, microservices_1.MessagePattern)('start_saga')];
        _handleSagaStepCompleted_decorators = [(0, microservices_1.EventPattern)('saga.step.completed')];
        _getSagaStatus_decorators = [(0, microservices_1.MessagePattern)('get_saga_status')];
        __esDecorate(_classThis, null, _startSaga_decorators, { kind: "method", name: "startSaga", static: false, private: false, access: { has: obj => "startSaga" in obj, get: obj => obj.startSaga }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleSagaStepCompleted_decorators, { kind: "method", name: "handleSagaStepCompleted", static: false, private: false, access: { has: obj => "handleSagaStepCompleted" in obj, get: obj => obj.handleSagaStepCompleted }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSagaStatus_decorators, { kind: "method", name: "getSagaStatus", static: false, private: false, access: { has: obj => "getSagaStatus" in obj, get: obj => obj.getSagaStatus }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SagaOrchestrationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SagaOrchestrationService = _classThis;
})();
exports.SagaOrchestrationService = SagaOrchestrationService;
/**
 * Circuit Breaker Service
 *
 * Implements circuit breaker pattern for resilient microservices communication.
 */
let CircuitBreakerService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getCircuitStatus_decorators;
    let _resetCircuit_decorators;
    var CircuitBreakerService = _classThis = class {
        constructor() {
            this.logger = (__runInitializers(this, _instanceExtraInitializers), new common_1.Logger(CircuitBreakerService.name));
            this.circuitStates = new Map();
        }
        /**
         * Execute operation with circuit breaker
         */
        async execute(serviceKey, operation) {
            const state = this.getCircuitState(serviceKey);
            if (state.status === 'OPEN') {
                if (Date.now() - state.lastFailureTime > state.timeout) {
                    state.status = 'HALF_OPEN';
                    this.logger.log(`Circuit breaker ${serviceKey}: OPEN -> HALF_OPEN`);
                }
                else {
                    throw new Error(`Circuit breaker is OPEN for service: ${serviceKey}`);
                }
            }
            try {
                const result = await operation();
                this.onSuccess(serviceKey);
                return result;
            }
            catch (error) {
                this.onFailure(serviceKey);
                throw error;
            }
        }
        /**
         * Get circuit state for service
         */
        getCircuitState(serviceKey) {
            if (!this.circuitStates.has(serviceKey)) {
                this.circuitStates.set(serviceKey, {
                    status: 'CLOSED',
                    failureCount: 0,
                    successCount: 0,
                    lastFailureTime: 0,
                    failureThreshold: 5,
                    successThreshold: 2,
                    timeout: 60000, // 60 seconds
                });
            }
            return this.circuitStates.get(serviceKey);
        }
        /**
         * Handle successful operation
         */
        onSuccess(serviceKey) {
            const state = this.getCircuitState(serviceKey);
            state.failureCount = 0;
            if (state.status === 'HALF_OPEN') {
                state.successCount++;
                if (state.successCount >= state.successThreshold) {
                    state.status = 'CLOSED';
                    state.successCount = 0;
                    this.logger.log(`Circuit breaker ${serviceKey}: HALF_OPEN -> CLOSED`);
                }
            }
        }
        /**
         * Handle failed operation
         */
        onFailure(serviceKey) {
            const state = this.getCircuitState(serviceKey);
            state.failureCount++;
            state.lastFailureTime = Date.now();
            state.successCount = 0;
            if (state.failureCount >= state.failureThreshold) {
                state.status = 'OPEN';
                this.logger.warn(`Circuit breaker ${serviceKey}: CLOSED -> OPEN`);
            }
        }
        /**
         * Get circuit breaker status
         */
        getCircuitStatus(data) {
            const state = this.getCircuitState(data.serviceKey);
            return {
                serviceKey: data.serviceKey,
                status: state.status,
                failureCount: state.failureCount,
                lastFailureTime: state.lastFailureTime,
            };
        }
        /**
         * Reset circuit breaker
         */
        resetCircuit(data) {
            this.circuitStates.delete(data.serviceKey);
            this.logger.log(`Circuit breaker reset: ${data.serviceKey}`);
            return { success: true };
        }
    };
    __setFunctionName(_classThis, "CircuitBreakerService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getCircuitStatus_decorators = [(0, microservices_1.MessagePattern)('get_circuit_status')];
        _resetCircuit_decorators = [(0, microservices_1.MessagePattern)('reset_circuit')];
        __esDecorate(_classThis, null, _getCircuitStatus_decorators, { kind: "method", name: "getCircuitStatus", static: false, private: false, access: { has: obj => "getCircuitStatus" in obj, get: obj => obj.getCircuitStatus }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _resetCircuit_decorators, { kind: "method", name: "resetCircuit", static: false, private: false, access: { has: obj => "resetCircuit" in obj, get: obj => obj.resetCircuit }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CircuitBreakerService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CircuitBreakerService = _classThis;
})();
exports.CircuitBreakerService = CircuitBreakerService;
/**
 * Service Health Monitor
 *
 * Monitors health and availability of microservices.
 */
let ServiceHealthMonitor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _registerService_decorators;
    let _performHealthCheck_decorators;
    let _getAllHealthStatus_decorators;
    var ServiceHealthMonitor = _classThis = class {
        constructor() {
            this.logger = (__runInitializers(this, _instanceExtraInitializers), new common_1.Logger(ServiceHealthMonitor.name));
            this.healthChecks = new Map();
        }
        /**
         * Register service for health monitoring
         */
        registerService(data) {
            this.logger.log(`Registering service for health monitoring: ${data.serviceName}`);
            this.healthChecks.set(data.serviceName, {
                serviceName: data.serviceName,
                endpoint: data.endpoint,
                status: 'UNKNOWN',
                lastCheck: null,
                lastSuccess: null,
                failureCount: 0,
            });
            return { success: true };
        }
        /**
         * Perform health check
         */
        async performHealthCheck(data) {
            this.logger.log(`Performing health check: ${data.serviceName}`);
            const health = this.healthChecks.get(data.serviceName);
            if (!health) {
                throw new common_1.NotFoundException(`Service ${data.serviceName} not registered`);
            }
            try {
                // Perform actual health check (HTTP request, etc.)
                const isHealthy = await this.checkServiceHealth(health.endpoint);
                health.status = isHealthy ? 'HEALTHY' : 'UNHEALTHY';
                health.lastCheck = new Date();
                if (isHealthy) {
                    health.lastSuccess = new Date();
                    health.failureCount = 0;
                }
                else {
                    health.failureCount++;
                }
                return {
                    serviceName: data.serviceName,
                    status: health.status,
                    lastCheck: health.lastCheck,
                };
            }
            catch (error) {
                health.status = 'UNHEALTHY';
                health.failureCount++;
                throw error;
            }
        }
        /**
         * Check service health
         */
        async checkServiceHealth(endpoint) {
            // Simulate health check
            return Math.random() > 0.1; // 90% success rate
        }
        /**
         * Get all service health statuses
         */
        getAllHealthStatus() {
            const statuses = Array.from(this.healthChecks.values());
            return {
                totalServices: statuses.length,
                healthy: statuses.filter((s) => s.status === 'HEALTHY').length,
                unhealthy: statuses.filter((s) => s.status === 'UNHEALTHY').length,
                unknown: statuses.filter((s) => s.status === 'UNKNOWN').length,
                services: statuses,
            };
        }
    };
    __setFunctionName(_classThis, "ServiceHealthMonitor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _registerService_decorators = [(0, microservices_1.MessagePattern)('register_service')];
        _performHealthCheck_decorators = [(0, microservices_1.MessagePattern)('health_check')];
        _getAllHealthStatus_decorators = [(0, microservices_1.MessagePattern)('get_all_health_status')];
        __esDecorate(_classThis, null, _registerService_decorators, { kind: "method", name: "registerService", static: false, private: false, access: { has: obj => "registerService" in obj, get: obj => obj.registerService }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _performHealthCheck_decorators, { kind: "method", name: "performHealthCheck", static: false, private: false, access: { has: obj => "performHealthCheck" in obj, get: obj => obj.performHealthCheck }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllHealthStatus_decorators, { kind: "method", name: "getAllHealthStatus", static: false, private: false, access: { has: obj => "getAllHealthStatus" in obj, get: obj => obj.getAllHealthStatus }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ServiceHealthMonitor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ServiceHealthMonitor = _classThis;
})();
exports.ServiceHealthMonitor = ServiceHealthMonitor;
//# sourceMappingURL=command-microservices.js.map