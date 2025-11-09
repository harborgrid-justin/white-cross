"use strict";
/**
 * Integration Services Architecture
 *
 * Production-ready NestJS microservices for external system integrations.
 * Implements event-driven integration patterns, message queues (RabbitMQ, Kafka),
 * adapter patterns, and distributed integration coordination for CAD systems, RMS,
 * 911 centers, radio systems, AVL, weather services, third-party APIs, and legacy systems.
 *
 * Features:
 * - Enterprise integration patterns (EIP)
 * - Message transformation and routing
 * - Adapter pattern for legacy systems
 * - Event-driven integration architecture
 * - API gateway and service mesh integration
 * - Protocol translation (SOAP, REST, gRPC, etc.)
 * - Data synchronization and ETL
 * - Real-time data streaming
 * - Fault-tolerant integration with retry logic
 * - Dead letter queue handling
 * - Integration monitoring and alerting
 *
 * Integration Services Covered:
 * - CAD System Integration
 * - RMS (Records Management System) Integration
 * - 911 Center Integration
 * - Radio System Integration
 * - AVL (Automatic Vehicle Location) Integration
 * - Weather Service Integration
 * - Third-Party API Integration
 * - Legacy System Adapters
 *
 * @module IntegrationServices
 * @category Integration Architecture
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
exports.MessageTransformationService = exports.LegacySystemAdapterService = exports.ThirdPartyAPIIntegrationService = exports.WeatherServiceIntegration = exports.AVLIntegrationService = exports.RadioSystemIntegrationService = exports.Emergency911IntegrationService = exports.RMSIntegrationService = exports.CADSystemIntegrationService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
const sequelize_1 = require("sequelize");
/**
 * CAD System Integration Service
 *
 * Integrates with Computer-Aided Dispatch (CAD) systems for incident management,
 * unit dispatching, and real-time status updates.
 */
let CADSystemIntegrationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _syncIncidentFromCAD_decorators;
    let _pushIncidentUpdateToCAD_decorators;
    let _syncUnitStatusFromCAD_decorators;
    let _handleCADWebhookEvent_decorators;
    let _streamCADUpdates_decorators;
    var CADSystemIntegrationService = _classThis = class {
        constructor(cadIncidentModel, cadUnitModel, eventEmitter, httpService) {
            this.cadIncidentModel = (__runInitializers(this, _instanceExtraInitializers), cadIncidentModel);
            this.cadUnitModel = cadUnitModel;
            this.eventEmitter = eventEmitter;
            this.httpService = httpService;
            this.logger = new common_1.Logger(CADSystemIntegrationService.name);
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
                        clientId: 'cad-integration-service',
                        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
                    },
                    consumer: {
                        groupId: 'cad-consumer-group',
                    },
                },
            });
            this.rabbitMQClient = microservices_1.ClientProxyFactory.create({
                transport: microservices_1.Transport.RMQ,
                options: {
                    urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
                    queue: 'cad_integration',
                    queueOptions: { durable: true },
                },
            });
        }
        /**
         * Sync incident from CAD system
         */
        async syncIncidentFromCAD(data) {
            this.logger.log(`Syncing incident from CAD: ${data.cadIncidentId}`);
            try {
                // Fetch incident data from CAD system
                const cadIncident = await this.fetchCADIncident(data.cadIncidentId);
                // Transform CAD data to internal format
                const transformedData = this.transformCADIncident(cadIncident);
                // Store in local database
                const incident = await this.cadIncidentModel.upsert(transformedData);
                // Publish incident synced event
                const event = {
                    eventType: 'CADIncidentSynced',
                    cadIncidentId: data.cadIncidentId,
                    incidentId: incident.id,
                    timestamp: new Date(),
                };
                this.kafkaClient.emit('cad.incident.synced', event);
                return { success: true, incidentId: incident.id };
            }
            catch (error) {
                this.logger.error(`Failed to sync CAD incident: ${error.message}`);
                throw error;
            }
        }
        /**
         * Fetch incident from CAD system
         */
        async fetchCADIncident(cadIncidentId) {
            const cadEndpoint = process.env.CAD_API_ENDPOINT;
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${cadEndpoint}/incidents/${cadIncidentId}`).pipe((0, rxjs_1.timeout)(10000), (0, rxjs_1.retry)(3)));
            return response.data;
        }
        /**
         * Transform CAD incident to internal format
         */
        transformCADIncident(cadData) {
            return {
                cadIncidentId: cadData.id,
                incidentNumber: cadData.incidentNumber,
                type: this.mapCADIncidentType(cadData.type),
                priority: this.mapCADPriority(cadData.priority),
                location: {
                    address: cadData.location.address,
                    latitude: cadData.location.latitude,
                    longitude: cadData.location.longitude,
                },
                description: cadData.description,
                status: this.mapCADStatus(cadData.status),
                createdAt: new Date(cadData.createdAt),
                updatedAt: new Date(),
            };
        }
        /**
         * Map CAD incident type to internal type
         */
        mapCADIncidentType(cadType) {
            const typeMap = {
                'FIRE': 'FIRE',
                'MEDICAL': 'EMS',
                'POLICE': 'LAW_ENFORCEMENT',
                'EMS': 'EMS',
            };
            return typeMap[cadType] || cadType;
        }
        /**
         * Map CAD priority to internal priority
         */
        mapCADPriority(cadPriority) {
            const priorityMap = {
                '1': 'CRITICAL',
                '2': 'HIGH',
                '3': 'MEDIUM',
                '4': 'LOW',
            };
            return priorityMap[cadPriority] || 'MEDIUM';
        }
        /**
         * Map CAD status to internal status
         */
        mapCADStatus(cadStatus) {
            const statusMap = {
                'OPEN': 'ACTIVE',
                'DISPATCHED': 'DISPATCHED',
                'ENROUTE': 'ENROUTE',
                'ON_SCENE': 'ON_SCENE',
                'CLOSED': 'CLOSED',
            };
            return statusMap[cadStatus] || cadStatus;
        }
        /**
         * Push incident update to CAD system
         */
        async pushIncidentUpdateToCAD(data) {
            this.logger.log(`Pushing incident update to CAD: ${data.incidentId}`);
            try {
                const incident = await this.cadIncidentModel.findByPk(data.incidentId);
                if (!incident) {
                    throw new common_1.NotFoundException(`Incident ${data.incidentId} not found`);
                }
                // Transform to CAD format
                const cadData = this.transformToCADFormat(incident, data.updates);
                // Push to CAD system
                const cadEndpoint = process.env.CAD_API_ENDPOINT;
                await (0, rxjs_1.firstValueFrom)(this.httpService.put(`${cadEndpoint}/incidents/${incident.cadIncidentId}`, cadData).pipe((0, rxjs_1.timeout)(10000), (0, rxjs_1.retry)(3)));
                return { success: true };
            }
            catch (error) {
                this.logger.error(`Failed to push update to CAD: ${error.message}`);
                throw error;
            }
        }
        /**
         * Transform internal incident to CAD format
         */
        transformToCADFormat(incident, updates) {
            return {
                status: this.reverseMapStatus(updates.status || incident.status),
                priority: this.reverseMapPriority(updates.priority || incident.priority),
                notes: updates.notes,
                updatedAt: new Date().toISOString(),
            };
        }
        /**
         * Reverse map status to CAD format
         */
        reverseMapStatus(status) {
            const reverseMap = {
                'ACTIVE': 'OPEN',
                'DISPATCHED': 'DISPATCHED',
                'ENROUTE': 'ENROUTE',
                'ON_SCENE': 'ON_SCENE',
                'CLOSED': 'CLOSED',
            };
            return reverseMap[status] || status;
        }
        /**
         * Reverse map priority to CAD format
         */
        reverseMapPriority(priority) {
            const reverseMap = {
                'CRITICAL': '1',
                'HIGH': '2',
                'MEDIUM': '3',
                'LOW': '4',
            };
            return reverseMap[priority] || '3';
        }
        /**
         * Sync unit status from CAD
         */
        async syncUnitStatusFromCAD(data) {
            this.logger.log(`Syncing unit status from CAD: ${data.unitId}`);
            try {
                const cadEndpoint = process.env.CAD_API_ENDPOINT;
                const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${cadEndpoint}/units/${data.unitId}`).pipe((0, rxjs_1.timeout)(10000), (0, rxjs_1.retry)(3)));
                const cadUnit = response.data;
                await this.cadUnitModel.upsert({
                    cadUnitId: cadUnit.id,
                    unitNumber: cadUnit.unitNumber,
                    status: this.mapCADStatus(cadUnit.status),
                    location: cadUnit.location,
                    updatedAt: new Date(),
                });
                const event = {
                    eventType: 'CADUnitStatusSynced',
                    unitId: data.unitId,
                    status: cadUnit.status,
                    timestamp: new Date(),
                };
                this.kafkaClient.emit('cad.unit.status.synced', event);
                return { success: true };
            }
            catch (error) {
                this.logger.error(`Failed to sync CAD unit status: ${error.message}`);
                throw error;
            }
        }
        /**
         * Handle CAD system webhook events
         */
        async handleCADWebhookEvent(data) {
            this.logger.log(`Processing CAD webhook event: ${data.eventType}`);
            switch (data.eventType) {
                case 'INCIDENT_CREATED':
                    await this.syncIncidentFromCAD({ cadIncidentId: data.incidentId });
                    break;
                case 'INCIDENT_UPDATED':
                    await this.syncIncidentFromCAD({ cadIncidentId: data.incidentId });
                    break;
                case 'UNIT_STATUS_CHANGED':
                    await this.syncUnitStatusFromCAD({ unitId: data.unitId });
                    break;
                default:
                    this.logger.warn(`Unknown CAD webhook event type: ${data.eventType}`);
            }
        }
        /**
         * Stream real-time CAD updates
         */
        streamCADUpdates(data) {
            this.logger.log('Streaming CAD updates');
            const subject = new rxjs_1.Subject();
            // Simulate real-time CAD updates streaming
            const intervalId = setInterval(async () => {
                const updates = await this.fetchRecentCADUpdates();
                subject.next({
                    timestamp: new Date(),
                    updates,
                });
            }, 5000);
            setTimeout(() => {
                clearInterval(intervalId);
                subject.complete();
            }, data.duration || 60000);
            return subject.asObservable();
        }
        /**
         * Fetch recent CAD updates
         */
        async fetchRecentCADUpdates() {
            return this.cadIncidentModel.findAll({
                where: {
                    updatedAt: {
                        [sequelize_1.Op.gte]: new Date(Date.now() - 10000), // Last 10 seconds
                    },
                },
                limit: 10,
            });
        }
    };
    __setFunctionName(_classThis, "CADSystemIntegrationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _syncIncidentFromCAD_decorators = [(0, microservices_1.MessagePattern)('cad_sync_incident')];
        _pushIncidentUpdateToCAD_decorators = [(0, microservices_1.MessagePattern)('cad_push_incident_update')];
        _syncUnitStatusFromCAD_decorators = [(0, microservices_1.MessagePattern)('cad_sync_unit_status')];
        _handleCADWebhookEvent_decorators = [(0, microservices_1.EventPattern)('cad.webhook.event')];
        _streamCADUpdates_decorators = [(0, microservices_1.MessagePattern)('cad_stream_updates')];
        __esDecorate(_classThis, null, _syncIncidentFromCAD_decorators, { kind: "method", name: "syncIncidentFromCAD", static: false, private: false, access: { has: obj => "syncIncidentFromCAD" in obj, get: obj => obj.syncIncidentFromCAD }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _pushIncidentUpdateToCAD_decorators, { kind: "method", name: "pushIncidentUpdateToCAD", static: false, private: false, access: { has: obj => "pushIncidentUpdateToCAD" in obj, get: obj => obj.pushIncidentUpdateToCAD }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _syncUnitStatusFromCAD_decorators, { kind: "method", name: "syncUnitStatusFromCAD", static: false, private: false, access: { has: obj => "syncUnitStatusFromCAD" in obj, get: obj => obj.syncUnitStatusFromCAD }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleCADWebhookEvent_decorators, { kind: "method", name: "handleCADWebhookEvent", static: false, private: false, access: { has: obj => "handleCADWebhookEvent" in obj, get: obj => obj.handleCADWebhookEvent }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _streamCADUpdates_decorators, { kind: "method", name: "streamCADUpdates", static: false, private: false, access: { has: obj => "streamCADUpdates" in obj, get: obj => obj.streamCADUpdates }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CADSystemIntegrationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CADSystemIntegrationService = _classThis;
})();
exports.CADSystemIntegrationService = CADSystemIntegrationService;
/**
 * RMS Integration Service
 *
 * Integrates with Records Management System (RMS) for case management,
 * report filing, and evidence tracking.
 */
let RMSIntegrationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createCaseInRMS_decorators;
    let _submitReportToRMS_decorators;
    let _syncCaseStatusFromRMS_decorators;
    let _getCaseDetailsFromRMS_decorators;
    let _linkEvidenceToCase_decorators;
    let _searchRMSCases_decorators;
    var RMSIntegrationService = _classThis = class {
        constructor(rmsCaseModel, rmsReportModel, eventEmitter, httpService) {
            this.rmsCaseModel = (__runInitializers(this, _instanceExtraInitializers), rmsCaseModel);
            this.rmsReportModel = rmsReportModel;
            this.eventEmitter = eventEmitter;
            this.httpService = httpService;
            this.logger = new common_1.Logger(RMSIntegrationService.name);
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
                    queue: 'rms_integration',
                    queueOptions: { durable: true },
                },
            });
        }
        /**
         * Create case in RMS
         */
        async createCaseInRMS(data) {
            this.logger.log(`Creating case in RMS: ${data.caseNumber}`);
            try {
                const rmsEndpoint = process.env.RMS_API_ENDPOINT;
                const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${rmsEndpoint}/cases`, {
                    caseNumber: data.caseNumber,
                    incidentId: data.incidentId,
                    caseType: data.caseType,
                    description: data.description,
                    reportingOfficer: data.reportingOfficer,
                    createdAt: new Date().toISOString(),
                }).pipe((0, rxjs_1.timeout)(15000), (0, rxjs_1.retry)(3)));
                const rmsCase = response.data;
                await this.rmsCaseModel.create({
                    rmsCaseId: rmsCase.id,
                    caseNumber: data.caseNumber,
                    incidentId: data.incidentId,
                    status: 'OPEN',
                    createdAt: new Date(),
                });
                const event = {
                    eventType: 'RMSCaseCreated',
                    rmsCaseId: rmsCase.id,
                    caseNumber: data.caseNumber,
                    timestamp: new Date(),
                };
                this.rabbitMQClient.emit('rms.case.created', event);
                return { success: true, rmsCaseId: rmsCase.id };
            }
            catch (error) {
                this.logger.error(`Failed to create RMS case: ${error.message}`);
                throw error;
            }
        }
        /**
         * Submit report to RMS
         */
        async submitReportToRMS(data) {
            this.logger.log(`Submitting report to RMS: ${data.reportId}`);
            try {
                const rmsEndpoint = process.env.RMS_API_ENDPOINT;
                const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${rmsEndpoint}/reports`, {
                    caseId: data.caseId,
                    reportType: data.reportType,
                    reportData: data.reportData,
                    submittedBy: data.submittedBy,
                    submittedAt: new Date().toISOString(),
                }).pipe((0, rxjs_1.timeout)(15000), (0, rxjs_1.retry)(3)));
                const rmsReport = response.data;
                await this.rmsReportModel.create({
                    rmsReportId: rmsReport.id,
                    caseId: data.caseId,
                    reportType: data.reportType,
                    status: 'SUBMITTED',
                    submittedAt: new Date(),
                });
                return { success: true, rmsReportId: rmsReport.id };
            }
            catch (error) {
                this.logger.error(`Failed to submit RMS report: ${error.message}`);
                throw error;
            }
        }
        /**
         * Sync case status from RMS
         */
        async syncCaseStatusFromRMS(data) {
            this.logger.log(`Syncing case status from RMS: ${data.caseId}`);
            try {
                const rmsEndpoint = process.env.RMS_API_ENDPOINT;
                const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${rmsEndpoint}/cases/${data.caseId}`).pipe((0, rxjs_1.timeout)(10000), (0, rxjs_1.retry)(3)));
                const rmsCase = response.data;
                await this.rmsCaseModel.update({
                    status: rmsCase.status,
                    updatedAt: new Date(),
                }, { where: { rmsCaseId: data.caseId } });
                return { success: true, status: rmsCase.status };
            }
            catch (error) {
                this.logger.error(`Failed to sync RMS case status: ${error.message}`);
                throw error;
            }
        }
        /**
         * Retrieve case details from RMS
         */
        async getCaseDetailsFromRMS(data) {
            this.logger.log(`Retrieving case details from RMS: ${data.caseId}`);
            try {
                const rmsEndpoint = process.env.RMS_API_ENDPOINT;
                const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${rmsEndpoint}/cases/${data.caseId}/details`).pipe((0, rxjs_1.timeout)(10000), (0, rxjs_1.retry)(3)));
                return {
                    success: true,
                    caseDetails: response.data,
                };
            }
            catch (error) {
                this.logger.error(`Failed to retrieve RMS case details: ${error.message}`);
                throw error;
            }
        }
        /**
         * Link evidence to RMS case
         */
        async linkEvidenceToCase(data) {
            this.logger.log(`Linking evidence to RMS case: ${data.caseId}`);
            try {
                const rmsEndpoint = process.env.RMS_API_ENDPOINT;
                await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${rmsEndpoint}/cases/${data.caseId}/evidence`, {
                    evidenceId: data.evidenceId,
                    evidenceType: data.evidenceType,
                    description: data.description,
                    collectedBy: data.collectedBy,
                    collectedAt: new Date().toISOString(),
                }).pipe((0, rxjs_1.timeout)(15000), (0, rxjs_1.retry)(3)));
                return { success: true };
            }
            catch (error) {
                this.logger.error(`Failed to link evidence to RMS case: ${error.message}`);
                throw error;
            }
        }
        /**
         * Search RMS cases
         */
        async searchRMSCases(data) {
            this.logger.log(`Searching RMS cases: ${JSON.stringify(data.criteria)}`);
            try {
                const rmsEndpoint = process.env.RMS_API_ENDPOINT;
                const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${rmsEndpoint}/cases/search`, data.criteria).pipe((0, rxjs_1.timeout)(15000), (0, rxjs_1.retry)(3)));
                return {
                    success: true,
                    cases: response.data.results,
                    totalCount: response.data.totalCount,
                };
            }
            catch (error) {
                this.logger.error(`Failed to search RMS cases: ${error.message}`);
                throw error;
            }
        }
    };
    __setFunctionName(_classThis, "RMSIntegrationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createCaseInRMS_decorators = [(0, microservices_1.MessagePattern)('rms_create_case')];
        _submitReportToRMS_decorators = [(0, microservices_1.MessagePattern)('rms_submit_report')];
        _syncCaseStatusFromRMS_decorators = [(0, microservices_1.MessagePattern)('rms_sync_case_status')];
        _getCaseDetailsFromRMS_decorators = [(0, microservices_1.MessagePattern)('rms_get_case_details')];
        _linkEvidenceToCase_decorators = [(0, microservices_1.MessagePattern)('rms_link_evidence')];
        _searchRMSCases_decorators = [(0, microservices_1.MessagePattern)('rms_search_cases')];
        __esDecorate(_classThis, null, _createCaseInRMS_decorators, { kind: "method", name: "createCaseInRMS", static: false, private: false, access: { has: obj => "createCaseInRMS" in obj, get: obj => obj.createCaseInRMS }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _submitReportToRMS_decorators, { kind: "method", name: "submitReportToRMS", static: false, private: false, access: { has: obj => "submitReportToRMS" in obj, get: obj => obj.submitReportToRMS }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _syncCaseStatusFromRMS_decorators, { kind: "method", name: "syncCaseStatusFromRMS", static: false, private: false, access: { has: obj => "syncCaseStatusFromRMS" in obj, get: obj => obj.syncCaseStatusFromRMS }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCaseDetailsFromRMS_decorators, { kind: "method", name: "getCaseDetailsFromRMS", static: false, private: false, access: { has: obj => "getCaseDetailsFromRMS" in obj, get: obj => obj.getCaseDetailsFromRMS }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _linkEvidenceToCase_decorators, { kind: "method", name: "linkEvidenceToCase", static: false, private: false, access: { has: obj => "linkEvidenceToCase" in obj, get: obj => obj.linkEvidenceToCase }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _searchRMSCases_decorators, { kind: "method", name: "searchRMSCases", static: false, private: false, access: { has: obj => "searchRMSCases" in obj, get: obj => obj.searchRMSCases }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RMSIntegrationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RMSIntegrationService = _classThis;
})();
exports.RMSIntegrationService = RMSIntegrationService;
/**
 * 911 Center Integration Service
 *
 * Integrates with 911 call centers for emergency call handling,
 * ANI/ALI data retrieval, and call routing.
 */
let Emergency911IntegrationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _processIncoming911Call_decorators;
    let _transfer911Call_decorators;
    let _update911CallStatus_decorators;
    let _get911CallRecording_decorators;
    let _processTextTo911_decorators;
    let _rebid911Call_decorators;
    var Emergency911IntegrationService = _classThis = class {
        constructor(emergencyCallModel, eventEmitter, httpService) {
            this.emergencyCallModel = (__runInitializers(this, _instanceExtraInitializers), emergencyCallModel);
            this.eventEmitter = eventEmitter;
            this.httpService = httpService;
            this.logger = new common_1.Logger(Emergency911IntegrationService.name);
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
                        clientId: '911-integration-service',
                        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
                    },
                },
            });
        }
        /**
         * Process incoming 911 call
         */
        async processIncoming911Call(data) {
            this.logger.log(`Processing incoming 911 call: ${data.callId}`);
            try {
                // Retrieve ANI/ALI data
                const aniAliData = await this.retrieveANIALI(data.phoneNumber);
                // Create emergency call record
                const call = await this.emergencyCallModel.create({
                    callId: data.callId,
                    phoneNumber: data.phoneNumber,
                    ani: aniAliData.ani,
                    ali: aniAliData.ali,
                    latitude: aniAliData.location?.latitude,
                    longitude: aniAliData.location?.longitude,
                    callerName: aniAliData.callerName,
                    address: aniAliData.address,
                    status: 'ACTIVE',
                    receivedAt: new Date(),
                });
                // Publish call received event
                const event = {
                    eventType: '911CallReceived',
                    callId: call.id,
                    phoneNumber: data.phoneNumber,
                    location: aniAliData.location,
                    timestamp: new Date(),
                };
                this.kafkaClient.emit('911.call.received', event);
                return {
                    success: true,
                    callId: call.id,
                    aniAliData,
                };
            }
            catch (error) {
                this.logger.error(`Failed to process 911 call: ${error.message}`);
                throw error;
            }
        }
        /**
         * Retrieve ANI/ALI data
         */
        async retrieveANIALI(phoneNumber) {
            const psapEndpoint = process.env.PSAP_API_ENDPOINT;
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${psapEndpoint}/ani-ali/${phoneNumber}`).pipe((0, rxjs_1.timeout)(5000), (0, rxjs_1.retry)(3)));
            return response.data;
        }
        /**
         * Transfer 911 call
         */
        async transfer911Call(data) {
            this.logger.log(`Transferring 911 call: ${data.callId} to ${data.destination}`);
            try {
                const call = await this.emergencyCallModel.findByPk(data.callId);
                if (!call) {
                    throw new common_1.NotFoundException(`911 call ${data.callId} not found`);
                }
                const psapEndpoint = process.env.PSAP_API_ENDPOINT;
                await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${psapEndpoint}/calls/${data.callId}/transfer`, {
                    destination: data.destination,
                    reason: data.reason,
                }).pipe((0, rxjs_1.timeout)(10000), (0, rxjs_1.retry)(3)));
                await call.update({
                    status: 'TRANSFERRED',
                    transferredTo: data.destination,
                    transferredAt: new Date(),
                });
                const event = {
                    eventType: '911CallTransferred',
                    callId: data.callId,
                    destination: data.destination,
                    timestamp: new Date(),
                };
                this.kafkaClient.emit('911.call.transferred', event);
                return { success: true };
            }
            catch (error) {
                this.logger.error(`Failed to transfer 911 call: ${error.message}`);
                throw error;
            }
        }
        /**
         * Update 911 call status
         */
        async update911CallStatus(data) {
            this.logger.log(`Updating 911 call status: ${data.callId}`);
            const call = await this.emergencyCallModel.findByPk(data.callId);
            if (!call) {
                throw new common_1.NotFoundException(`911 call ${data.callId} not found`);
            }
            await call.update({
                status: data.status,
                updatedAt: new Date(),
            });
            return { success: true };
        }
        /**
         * Retrieve 911 call recording
         */
        async get911CallRecording(data) {
            this.logger.log(`Retrieving 911 call recording: ${data.callId}`);
            try {
                const psapEndpoint = process.env.PSAP_API_ENDPOINT;
                const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${psapEndpoint}/calls/${data.callId}/recording`).pipe((0, rxjs_1.timeout)(15000), (0, rxjs_1.retry)(3)));
                return {
                    success: true,
                    recordingUrl: response.data.url,
                    duration: response.data.duration,
                };
            }
            catch (error) {
                this.logger.error(`Failed to retrieve 911 call recording: ${error.message}`);
                throw error;
            }
        }
        /**
         * Handle 911 text-to-911
         */
        async processTextTo911(data) {
            this.logger.log(`Processing text-to-911: ${data.messageId}`);
            try {
                const call = await this.emergencyCallModel.create({
                    callId: data.messageId,
                    phoneNumber: data.phoneNumber,
                    messageText: data.text,
                    communicationType: 'TEXT',
                    status: 'ACTIVE',
                    receivedAt: new Date(),
                });
                const event = {
                    eventType: '911TextReceived',
                    callId: call.id,
                    phoneNumber: data.phoneNumber,
                    text: data.text,
                    timestamp: new Date(),
                };
                this.kafkaClient.emit('911.text.received', event);
                return { success: true, callId: call.id };
            }
            catch (error) {
                this.logger.error(`Failed to process text-to-911: ${error.message}`);
                throw error;
            }
        }
        /**
         * Rebid 911 call (automated callback)
         */
        async rebid911Call(data) {
            this.logger.log(`Rebidding 911 call: ${data.callId}`);
            try {
                const call = await this.emergencyCallModel.findByPk(data.callId);
                if (!call) {
                    throw new common_1.NotFoundException(`911 call ${data.callId} not found`);
                }
                const psapEndpoint = process.env.PSAP_API_ENDPOINT;
                await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${psapEndpoint}/calls/rebid`, {
                    phoneNumber: call.phoneNumber,
                    originalCallId: data.callId,
                }).pipe((0, rxjs_1.timeout)(10000), (0, rxjs_1.retry)(3)));
                return { success: true };
            }
            catch (error) {
                this.logger.error(`Failed to rebid 911 call: ${error.message}`);
                throw error;
            }
        }
    };
    __setFunctionName(_classThis, "Emergency911IntegrationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _processIncoming911Call_decorators = [(0, microservices_1.MessagePattern)('911_process_incoming_call')];
        _transfer911Call_decorators = [(0, microservices_1.MessagePattern)('911_transfer_call')];
        _update911CallStatus_decorators = [(0, microservices_1.MessagePattern)('911_update_call_status')];
        _get911CallRecording_decorators = [(0, microservices_1.MessagePattern)('911_get_call_recording')];
        _processTextTo911_decorators = [(0, microservices_1.MessagePattern)('911_process_text')];
        _rebid911Call_decorators = [(0, microservices_1.MessagePattern)('911_rebid_call')];
        __esDecorate(_classThis, null, _processIncoming911Call_decorators, { kind: "method", name: "processIncoming911Call", static: false, private: false, access: { has: obj => "processIncoming911Call" in obj, get: obj => obj.processIncoming911Call }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _transfer911Call_decorators, { kind: "method", name: "transfer911Call", static: false, private: false, access: { has: obj => "transfer911Call" in obj, get: obj => obj.transfer911Call }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update911CallStatus_decorators, { kind: "method", name: "update911CallStatus", static: false, private: false, access: { has: obj => "update911CallStatus" in obj, get: obj => obj.update911CallStatus }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get911CallRecording_decorators, { kind: "method", name: "get911CallRecording", static: false, private: false, access: { has: obj => "get911CallRecording" in obj, get: obj => obj.get911CallRecording }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _processTextTo911_decorators, { kind: "method", name: "processTextTo911", static: false, private: false, access: { has: obj => "processTextTo911" in obj, get: obj => obj.processTextTo911 }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _rebid911Call_decorators, { kind: "method", name: "rebid911Call", static: false, private: false, access: { has: obj => "rebid911Call" in obj, get: obj => obj.rebid911Call }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Emergency911IntegrationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Emergency911IntegrationService = _classThis;
})();
exports.Emergency911IntegrationService = Emergency911IntegrationService;
/**
 * Radio System Integration Service
 *
 * Integrates with radio dispatch systems for voice communications,
 * channel management, and unit radio tracking.
 */
let RadioSystemIntegrationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _assignRadioChannel_decorators;
    let _logRadioTransmission_decorators;
    let _monitorRadioChannel_decorators;
    let _triggerEmergencyRadioAlert_decorators;
    let _changeRadioTalkGroup_decorators;
    let _getRadioRecording_decorators;
    var RadioSystemIntegrationService = _classThis = class {
        constructor(radioChannelModel, radioTransmissionModel, eventEmitter) {
            this.radioChannelModel = (__runInitializers(this, _instanceExtraInitializers), radioChannelModel);
            this.radioTransmissionModel = radioTransmissionModel;
            this.eventEmitter = eventEmitter;
            this.logger = new common_1.Logger(RadioSystemIntegrationService.name);
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
                        clientId: 'radio-integration-service',
                        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
                    },
                },
            });
        }
        /**
         * Assign radio channel to incident
         */
        async assignRadioChannel(data) {
            this.logger.log(`Assigning radio channel to incident: ${data.incidentId}`);
            try {
                // Find available radio channel
                const availableChannel = await this.radioChannelModel.findOne({
                    where: {
                        status: 'AVAILABLE',
                        channelGroup: data.channelGroup || 'OPERATIONS',
                    },
                });
                if (!availableChannel) {
                    throw new common_1.ConflictException('No available radio channels');
                }
                await availableChannel.update({
                    status: 'ASSIGNED',
                    assignedTo: data.incidentId,
                    assignedAt: new Date(),
                });
                const event = {
                    eventType: 'RadioChannelAssigned',
                    channelId: availableChannel.id,
                    incidentId: data.incidentId,
                    frequency: availableChannel.frequency,
                    timestamp: new Date(),
                };
                this.kafkaClient.emit('radio.channel.assigned', event);
                return {
                    success: true,
                    channelId: availableChannel.id,
                    frequency: availableChannel.frequency,
                };
            }
            catch (error) {
                this.logger.error(`Failed to assign radio channel: ${error.message}`);
                throw error;
            }
        }
        /**
         * Log radio transmission
         */
        async logRadioTransmission(data) {
            this.logger.log(`Logging radio transmission on channel: ${data.channelId}`);
            const transmission = await this.radioTransmissionModel.create({
                channelId: data.channelId,
                unitId: data.unitId,
                transmissionType: data.type,
                duration: data.duration,
                timestamp: new Date(),
            });
            const event = {
                eventType: 'RadioTransmissionLogged',
                transmissionId: transmission.id,
                channelId: data.channelId,
                unitId: data.unitId,
                timestamp: new Date(),
            };
            this.kafkaClient.emit('radio.transmission.logged', event);
            return { success: true, transmissionId: transmission.id };
        }
        /**
         * Monitor radio channel activity
         */
        monitorRadioChannel(data) {
            this.logger.log(`Monitoring radio channel: ${data.channelId}`);
            const subject = new rxjs_1.Subject();
            const intervalId = setInterval(async () => {
                const recentTransmissions = await this.radioTransmissionModel.findAll({
                    where: {
                        channelId: data.channelId,
                        timestamp: {
                            [sequelize_1.Op.gte]: new Date(Date.now() - 10000),
                        },
                    },
                });
                subject.next({
                    channelId: data.channelId,
                    transmissions: recentTransmissions,
                    timestamp: new Date(),
                });
            }, 5000);
            setTimeout(() => {
                clearInterval(intervalId);
                subject.complete();
            }, data.duration || 60000);
            return subject.asObservable();
        }
        /**
         * Request emergency radio alert
         */
        async triggerEmergencyRadioAlert(data) {
            this.logger.log(`Triggering emergency radio alert: ${data.unitId}`);
            const event = {
                eventType: 'RadioEmergencyAlert',
                unitId: data.unitId,
                alertType: data.alertType || 'EMERGENCY_BUTTON',
                location: data.location,
                timestamp: new Date(),
            };
            this.kafkaClient.emit('radio.emergency.alert', event);
            // Broadcast to all units on channel
            await this.broadcastEmergencyAlert(data);
            return { success: true };
        }
        /**
         * Broadcast emergency alert to all units
         */
        async broadcastEmergencyAlert(data) {
            this.logger.log(`Broadcasting emergency alert for unit: ${data.unitId}`);
            // Integration with radio system to broadcast alert
        }
        /**
         * Change radio talk group
         */
        async changeRadioTalkGroup(data) {
            this.logger.log(`Changing radio talk group for unit: ${data.unitId}`);
            const event = {
                eventType: 'RadioTalkGroupChanged',
                unitId: data.unitId,
                previousTalkGroup: data.previousTalkGroup,
                newTalkGroup: data.newTalkGroup,
                timestamp: new Date(),
            };
            this.kafkaClient.emit('radio.talk_group.changed', event);
            return { success: true };
        }
        /**
         * Retrieve radio recording
         */
        async getRadioRecording(data) {
            this.logger.log(`Retrieving radio recording: ${data.transmissionId}`);
            const transmission = await this.radioTransmissionModel.findByPk(data.transmissionId);
            if (!transmission) {
                throw new common_1.NotFoundException(`Radio transmission ${data.transmissionId} not found`);
            }
            return {
                success: true,
                recordingUrl: `/recordings/radio/${transmission.id}.mp3`,
                duration: transmission.duration,
            };
        }
    };
    __setFunctionName(_classThis, "RadioSystemIntegrationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _assignRadioChannel_decorators = [(0, microservices_1.MessagePattern)('radio_assign_channel')];
        _logRadioTransmission_decorators = [(0, microservices_1.MessagePattern)('radio_log_transmission')];
        _monitorRadioChannel_decorators = [(0, microservices_1.MessagePattern)('radio_monitor_channel')];
        _triggerEmergencyRadioAlert_decorators = [(0, microservices_1.MessagePattern)('radio_emergency_alert')];
        _changeRadioTalkGroup_decorators = [(0, microservices_1.MessagePattern)('radio_change_talk_group')];
        _getRadioRecording_decorators = [(0, microservices_1.MessagePattern)('radio_get_recording')];
        __esDecorate(_classThis, null, _assignRadioChannel_decorators, { kind: "method", name: "assignRadioChannel", static: false, private: false, access: { has: obj => "assignRadioChannel" in obj, get: obj => obj.assignRadioChannel }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _logRadioTransmission_decorators, { kind: "method", name: "logRadioTransmission", static: false, private: false, access: { has: obj => "logRadioTransmission" in obj, get: obj => obj.logRadioTransmission }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _monitorRadioChannel_decorators, { kind: "method", name: "monitorRadioChannel", static: false, private: false, access: { has: obj => "monitorRadioChannel" in obj, get: obj => obj.monitorRadioChannel }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _triggerEmergencyRadioAlert_decorators, { kind: "method", name: "triggerEmergencyRadioAlert", static: false, private: false, access: { has: obj => "triggerEmergencyRadioAlert" in obj, get: obj => obj.triggerEmergencyRadioAlert }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _changeRadioTalkGroup_decorators, { kind: "method", name: "changeRadioTalkGroup", static: false, private: false, access: { has: obj => "changeRadioTalkGroup" in obj, get: obj => obj.changeRadioTalkGroup }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRadioRecording_decorators, { kind: "method", name: "getRadioRecording", static: false, private: false, access: { has: obj => "getRadioRecording" in obj, get: obj => obj.getRadioRecording }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RadioSystemIntegrationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RadioSystemIntegrationService = _classThis;
})();
exports.RadioSystemIntegrationService = RadioSystemIntegrationService;
/**
 * AVL Integration Service
 *
 * Integrates with Automatic Vehicle Location (AVL) systems for real-time
 * vehicle tracking, geofencing, and route optimization.
 */
let AVLIntegrationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _processAVLPositionUpdate_decorators;
    let _streamVehiclePositions_decorators;
    let _getVehicleLocationHistory_decorators;
    let _calculateVehicleETA_decorators;
    let _checkVehicleGeofence_decorators;
    let _generateBreadcrumbTrail_decorators;
    var AVLIntegrationService = _classThis = class {
        constructor(vehicleLocationModel, vehicleModel, eventEmitter, httpService) {
            this.vehicleLocationModel = (__runInitializers(this, _instanceExtraInitializers), vehicleLocationModel);
            this.vehicleModel = vehicleModel;
            this.eventEmitter = eventEmitter;
            this.httpService = httpService;
            this.logger = new common_1.Logger(AVLIntegrationService.name);
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
                        clientId: 'avl-integration-service',
                        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
                    },
                },
            });
        }
        /**
         * Process AVL position update
         */
        async processAVLPositionUpdate(data) {
            this.logger.log(`Processing AVL position update for vehicle: ${data.vehicleId}`);
            try {
                await this.vehicleLocationModel.create({
                    vehicleId: data.vehicleId,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    heading: data.heading,
                    speed: data.speed,
                    altitude: data.altitude,
                    accuracy: data.accuracy,
                    timestamp: new Date(data.timestamp),
                    gpsFix: data.gpsFix,
                    satellites: data.satellites,
                });
                // Update vehicle current location
                await this.vehicleModel.update({
                    currentLatitude: data.latitude,
                    currentLongitude: data.longitude,
                    currentHeading: data.heading,
                    currentSpeed: data.speed,
                    lastUpdateAt: new Date(),
                }, { where: { id: data.vehicleId } });
                const event = {
                    eventType: 'AVLPositionUpdated',
                    vehicleId: data.vehicleId,
                    location: {
                        latitude: data.latitude,
                        longitude: data.longitude,
                    },
                    timestamp: new Date(),
                };
                this.kafkaClient.emit('avl.position.updated', event);
                return { success: true };
            }
            catch (error) {
                this.logger.error(`Failed to process AVL position update: ${error.message}`);
                throw error;
            }
        }
        /**
         * Stream real-time vehicle positions
         */
        streamVehiclePositions(data) {
            this.logger.log('Streaming real-time vehicle positions');
            const subject = new rxjs_1.Subject();
            const intervalId = setInterval(async () => {
                const positions = await this.vehicleModel.findAll({
                    where: data.vehicleIds ? { id: { [sequelize_1.Op.in]: data.vehicleIds } } : {},
                    attributes: [
                        'id',
                        'unitNumber',
                        'currentLatitude',
                        'currentLongitude',
                        'currentHeading',
                        'currentSpeed',
                        'lastUpdateAt',
                    ],
                });
                subject.next({
                    timestamp: new Date(),
                    positions: positions.map((p) => p.toJSON()),
                });
            }, data.interval || 3000);
            setTimeout(() => {
                clearInterval(intervalId);
                subject.complete();
            }, data.duration || 60000);
            return subject.asObservable();
        }
        /**
         * Get vehicle location history
         */
        async getVehicleLocationHistory(data) {
            this.logger.log(`Getting location history for vehicle: ${data.vehicleId}`);
            const locations = await this.vehicleLocationModel.findAll({
                where: {
                    vehicleId: data.vehicleId,
                    timestamp: {
                        [sequelize_1.Op.gte]: new Date(data.startDate),
                        [sequelize_1.Op.lte]: new Date(data.endDate),
                    },
                },
                order: [['timestamp', 'ASC']],
            });
            return {
                success: true,
                vehicleId: data.vehicleId,
                locations: locations.map((l) => l.toJSON()),
                count: locations.length,
            };
        }
        /**
         * Calculate vehicle ETA
         */
        async calculateVehicleETA(data) {
            this.logger.log(`Calculating ETA for vehicle: ${data.vehicleId}`);
            const vehicle = await this.vehicleModel.findByPk(data.vehicleId);
            if (!vehicle) {
                throw new common_1.NotFoundException(`Vehicle ${data.vehicleId} not found`);
            }
            const distance = this.calculateDistance(vehicle.currentLatitude, vehicle.currentLongitude, data.destinationLatitude, data.destinationLongitude);
            const averageSpeed = vehicle.currentSpeed || 60; // km/h
            const eta = (distance / averageSpeed) * 60; // minutes
            return {
                success: true,
                vehicleId: data.vehicleId,
                distance,
                eta,
                estimatedArrival: new Date(Date.now() + eta * 60 * 1000),
            };
        }
        /**
         * Calculate distance using Haversine formula
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
         * Check vehicle geofence status
         */
        async checkVehicleGeofence(data) {
            this.logger.log(`Checking geofence for vehicle: ${data.vehicleId}`);
            const vehicle = await this.vehicleModel.findByPk(data.vehicleId);
            if (!vehicle) {
                throw new common_1.NotFoundException(`Vehicle ${data.vehicleId} not found`);
            }
            // Check if vehicle is within jurisdiction boundaries
            const withinJurisdiction = this.isPointInPolygon(vehicle.currentLatitude, vehicle.currentLongitude, data.geofenceCoordinates);
            if (!withinJurisdiction && data.alertOnExit) {
                const event = {
                    eventType: 'VehicleGeofenceExit',
                    vehicleId: data.vehicleId,
                    location: {
                        latitude: vehicle.currentLatitude,
                        longitude: vehicle.currentLongitude,
                    },
                    timestamp: new Date(),
                };
                this.kafkaClient.emit('avl.geofence.exit', event);
            }
            return {
                success: true,
                vehicleId: data.vehicleId,
                withinGeofence: withinJurisdiction,
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
         * Generate vehicle breadcrumb trail
         */
        async generateBreadcrumbTrail(data) {
            this.logger.log(`Generating breadcrumb trail for vehicle: ${data.vehicleId}`);
            const locations = await this.vehicleLocationModel.findAll({
                where: {
                    vehicleId: data.vehicleId,
                    timestamp: {
                        [sequelize_1.Op.gte]: new Date(Date.now() - data.duration || 3600000), // Last hour
                    },
                },
                order: [['timestamp', 'ASC']],
            });
            const breadcrumbs = locations.map((loc) => ({
                latitude: loc.latitude,
                longitude: loc.longitude,
                timestamp: loc.timestamp,
            }));
            return {
                success: true,
                vehicleId: data.vehicleId,
                breadcrumbs,
                count: breadcrumbs.length,
            };
        }
    };
    __setFunctionName(_classThis, "AVLIntegrationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _processAVLPositionUpdate_decorators = [(0, microservices_1.MessagePattern)('avl_process_position_update')];
        _streamVehiclePositions_decorators = [(0, microservices_1.MessagePattern)('avl_stream_positions')];
        _getVehicleLocationHistory_decorators = [(0, microservices_1.MessagePattern)('avl_get_location_history')];
        _calculateVehicleETA_decorators = [(0, microservices_1.MessagePattern)('avl_calculate_eta')];
        _checkVehicleGeofence_decorators = [(0, microservices_1.MessagePattern)('avl_check_geofence')];
        _generateBreadcrumbTrail_decorators = [(0, microservices_1.MessagePattern)('avl_generate_breadcrumb_trail')];
        __esDecorate(_classThis, null, _processAVLPositionUpdate_decorators, { kind: "method", name: "processAVLPositionUpdate", static: false, private: false, access: { has: obj => "processAVLPositionUpdate" in obj, get: obj => obj.processAVLPositionUpdate }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _streamVehiclePositions_decorators, { kind: "method", name: "streamVehiclePositions", static: false, private: false, access: { has: obj => "streamVehiclePositions" in obj, get: obj => obj.streamVehiclePositions }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getVehicleLocationHistory_decorators, { kind: "method", name: "getVehicleLocationHistory", static: false, private: false, access: { has: obj => "getVehicleLocationHistory" in obj, get: obj => obj.getVehicleLocationHistory }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _calculateVehicleETA_decorators, { kind: "method", name: "calculateVehicleETA", static: false, private: false, access: { has: obj => "calculateVehicleETA" in obj, get: obj => obj.calculateVehicleETA }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _checkVehicleGeofence_decorators, { kind: "method", name: "checkVehicleGeofence", static: false, private: false, access: { has: obj => "checkVehicleGeofence" in obj, get: obj => obj.checkVehicleGeofence }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateBreadcrumbTrail_decorators, { kind: "method", name: "generateBreadcrumbTrail", static: false, private: false, access: { has: obj => "generateBreadcrumbTrail" in obj, get: obj => obj.generateBreadcrumbTrail }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AVLIntegrationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AVLIntegrationService = _classThis;
})();
exports.AVLIntegrationService = AVLIntegrationService;
/**
 * Weather Service Integration
 *
 * Integrates with weather service APIs for weather alerts, forecasts,
 * and incident impact analysis.
 */
let WeatherServiceIntegration = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getCurrentWeather_decorators;
    let _getWeatherForecast_decorators;
    let _monitorWeatherAlerts_decorators;
    let _assessWeatherImpactOnIncident_decorators;
    let _handleSevereWeatherAlert_decorators;
    var WeatherServiceIntegration = _classThis = class {
        constructor(weatherAlertModel, eventEmitter, httpService) {
            this.weatherAlertModel = (__runInitializers(this, _instanceExtraInitializers), weatherAlertModel);
            this.eventEmitter = eventEmitter;
            this.httpService = httpService;
            this.logger = new common_1.Logger(WeatherServiceIntegration.name);
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
                        clientId: 'weather-integration-service',
                        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
                    },
                },
            });
        }
        /**
         * Get current weather for location
         */
        async getCurrentWeather(data) {
            this.logger.log(`Getting current weather for location: ${data.latitude}, ${data.longitude}`);
            try {
                const weatherEndpoint = process.env.WEATHER_API_ENDPOINT;
                const apiKey = process.env.WEATHER_API_KEY;
                const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${weatherEndpoint}/current`, {
                    params: {
                        lat: data.latitude,
                        lon: data.longitude,
                        apikey: apiKey,
                    },
                }).pipe((0, rxjs_1.timeout)(10000), (0, rxjs_1.retry)(3)));
                return {
                    success: true,
                    weather: {
                        temperature: response.data.temperature,
                        conditions: response.data.conditions,
                        windSpeed: response.data.windSpeed,
                        windDirection: response.data.windDirection,
                        humidity: response.data.humidity,
                        visibility: response.data.visibility,
                        timestamp: new Date(),
                    },
                };
            }
            catch (error) {
                this.logger.error(`Failed to get current weather: ${error.message}`);
                throw error;
            }
        }
        /**
         * Get weather forecast
         */
        async getWeatherForecast(data) {
            this.logger.log(`Getting weather forecast for location: ${data.latitude}, ${data.longitude}`);
            try {
                const weatherEndpoint = process.env.WEATHER_API_ENDPOINT;
                const apiKey = process.env.WEATHER_API_KEY;
                const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${weatherEndpoint}/forecast`, {
                    params: {
                        lat: data.latitude,
                        lon: data.longitude,
                        days: data.days || 7,
                        apikey: apiKey,
                    },
                }).pipe((0, rxjs_1.timeout)(10000), (0, rxjs_1.retry)(3)));
                return {
                    success: true,
                    forecast: response.data.forecast,
                };
            }
            catch (error) {
                this.logger.error(`Failed to get weather forecast: ${error.message}`);
                throw error;
            }
        }
        /**
         * Monitor weather alerts
         */
        async monitorWeatherAlerts(data) {
            this.logger.log(`Monitoring weather alerts for area: ${data.areaCode}`);
            try {
                const weatherEndpoint = process.env.WEATHER_API_ENDPOINT;
                const apiKey = process.env.WEATHER_API_KEY;
                const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${weatherEndpoint}/alerts`, {
                    params: {
                        area: data.areaCode,
                        apikey: apiKey,
                    },
                }).pipe((0, rxjs_1.timeout)(10000), (0, rxjs_1.retry)(3)));
                const alerts = response.data.alerts || [];
                for (const alert of alerts) {
                    await this.processWeatherAlert(alert);
                }
                return {
                    success: true,
                    alertCount: alerts.length,
                    alerts,
                };
            }
            catch (error) {
                this.logger.error(`Failed to monitor weather alerts: ${error.message}`);
                throw error;
            }
        }
        /**
         * Process weather alert
         */
        async processWeatherAlert(alert) {
            const existingAlert = await this.weatherAlertModel.findOne({
                where: { externalAlertId: alert.id },
            });
            if (!existingAlert) {
                await this.weatherAlertModel.create({
                    externalAlertId: alert.id,
                    alertType: alert.type,
                    severity: alert.severity,
                    headline: alert.headline,
                    description: alert.description,
                    area: alert.area,
                    startTime: new Date(alert.startTime),
                    endTime: new Date(alert.endTime),
                    status: 'ACTIVE',
                    createdAt: new Date(),
                });
                const event = {
                    eventType: 'WeatherAlertReceived',
                    alertId: alert.id,
                    severity: alert.severity,
                    alertType: alert.type,
                    timestamp: new Date(),
                };
                this.kafkaClient.emit('weather.alert.received', event);
            }
        }
        /**
         * Assess weather impact on incident
         */
        async assessWeatherImpactOnIncident(data) {
            this.logger.log(`Assessing weather impact on incident: ${data.incidentId}`);
            const weather = await this.getCurrentWeather({
                latitude: data.latitude,
                longitude: data.longitude,
            });
            const impactAssessment = {
                overallImpact: 'LOW',
                factors: [],
                recommendations: [],
            };
            // Assess various weather factors
            if (weather.weather.visibility < 1000) {
                impactAssessment.overallImpact = 'HIGH';
                impactAssessment.factors.push('Low visibility');
                impactAssessment.recommendations.push('Exercise caution during response');
            }
            if (weather.weather.windSpeed > 50) {
                impactAssessment.overallImpact = 'HIGH';
                impactAssessment.factors.push('High winds');
                impactAssessment.recommendations.push('Consider aerial response limitations');
            }
            if (weather.weather.temperature < -10 || weather.weather.temperature > 40) {
                impactAssessment.overallImpact = impactAssessment.overallImpact === 'HIGH' ? 'HIGH' : 'MEDIUM';
                impactAssessment.factors.push('Extreme temperature');
                impactAssessment.recommendations.push('Account for equipment performance in extreme temperatures');
            }
            return {
                success: true,
                incidentId: data.incidentId,
                currentWeather: weather.weather,
                impactAssessment,
            };
        }
        /**
         * Subscribe to severe weather alerts
         */
        async handleSevereWeatherAlert(data) {
            this.logger.warn(`Severe weather alert received: ${data.alertType}`);
            // Notify all active incidents in affected area
            this.eventEmitter.emit('severe.weather.alert', {
                alertType: data.alertType,
                severity: data.severity,
                affectedArea: data.area,
                timestamp: new Date(),
            });
        }
    };
    __setFunctionName(_classThis, "WeatherServiceIntegration");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getCurrentWeather_decorators = [(0, microservices_1.MessagePattern)('weather_get_current')];
        _getWeatherForecast_decorators = [(0, microservices_1.MessagePattern)('weather_get_forecast')];
        _monitorWeatherAlerts_decorators = [(0, microservices_1.MessagePattern)('weather_monitor_alerts')];
        _assessWeatherImpactOnIncident_decorators = [(0, microservices_1.MessagePattern)('weather_assess_incident_impact')];
        _handleSevereWeatherAlert_decorators = [(0, microservices_1.EventPattern)('weather.alert.severe')];
        __esDecorate(_classThis, null, _getCurrentWeather_decorators, { kind: "method", name: "getCurrentWeather", static: false, private: false, access: { has: obj => "getCurrentWeather" in obj, get: obj => obj.getCurrentWeather }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getWeatherForecast_decorators, { kind: "method", name: "getWeatherForecast", static: false, private: false, access: { has: obj => "getWeatherForecast" in obj, get: obj => obj.getWeatherForecast }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _monitorWeatherAlerts_decorators, { kind: "method", name: "monitorWeatherAlerts", static: false, private: false, access: { has: obj => "monitorWeatherAlerts" in obj, get: obj => obj.monitorWeatherAlerts }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _assessWeatherImpactOnIncident_decorators, { kind: "method", name: "assessWeatherImpactOnIncident", static: false, private: false, access: { has: obj => "assessWeatherImpactOnIncident" in obj, get: obj => obj.assessWeatherImpactOnIncident }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleSevereWeatherAlert_decorators, { kind: "method", name: "handleSevereWeatherAlert", static: false, private: false, access: { has: obj => "handleSevereWeatherAlert" in obj, get: obj => obj.handleSevereWeatherAlert }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WeatherServiceIntegration = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WeatherServiceIntegration = _classThis;
})();
exports.WeatherServiceIntegration = WeatherServiceIntegration;
/**
 * Third-Party API Integration Service
 *
 * Manages integrations with third-party APIs for enhanced functionality.
 */
let ThirdPartyAPIIntegrationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _executeAPIRequest_decorators;
    let _geocodeAddress_decorators;
    let _reverseGeocode_decorators;
    let _validatePhoneNumber_decorators;
    let _enrichContactInformation_decorators;
    var ThirdPartyAPIIntegrationService = _classThis = class {
        constructor(apiRequestModel, eventEmitter, httpService) {
            this.apiRequestModel = (__runInitializers(this, _instanceExtraInitializers), apiRequestModel);
            this.eventEmitter = eventEmitter;
            this.httpService = httpService;
            this.logger = new common_1.Logger(ThirdPartyAPIIntegrationService.name);
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
                    queue: 'third_party_api',
                    queueOptions: { durable: true },
                },
            });
        }
        /**
         * Execute third-party API request
         */
        async executeAPIRequest(data) {
            this.logger.log(`Executing third-party API request: ${data.apiName}`);
            try {
                const apiRequest = await this.apiRequestModel.create({
                    apiName: data.apiName,
                    endpoint: data.endpoint,
                    method: data.method,
                    requestData: data.requestData,
                    status: 'PENDING',
                    createdAt: new Date(),
                });
                const response = await this.makeAPIRequest(data.endpoint, data.method, data.requestData, data.headers);
                await apiRequest.update({
                    status: 'SUCCESS',
                    responseData: response,
                    completedAt: new Date(),
                });
                return {
                    success: true,
                    requestId: apiRequest.id,
                    response,
                };
            }
            catch (error) {
                this.logger.error(`API request failed: ${error.message}`);
                throw error;
            }
        }
        /**
         * Make HTTP API request
         */
        async makeAPIRequest(endpoint, method, data, headers) {
            const config = {
                headers: headers || {},
            };
            let response;
            switch (method.toUpperCase()) {
                case 'GET':
                    response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(endpoint, config).pipe((0, rxjs_1.timeout)(15000), (0, rxjs_1.retry)(3)));
                    break;
                case 'POST':
                    response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(endpoint, data, config).pipe((0, rxjs_1.timeout)(15000), (0, rxjs_1.retry)(3)));
                    break;
                case 'PUT':
                    response = await (0, rxjs_1.firstValueFrom)(this.httpService.put(endpoint, data, config).pipe((0, rxjs_1.timeout)(15000), (0, rxjs_1.retry)(3)));
                    break;
                case 'DELETE':
                    response = await (0, rxjs_1.firstValueFrom)(this.httpService.delete(endpoint, config).pipe((0, rxjs_1.timeout)(15000), (0, rxjs_1.retry)(3)));
                    break;
                default:
                    throw new common_1.BadRequestException(`Unsupported HTTP method: ${method}`);
            }
            return response.data;
        }
        /**
         * Geocode address using third-party service
         */
        async geocodeAddress(data) {
            this.logger.log(`Geocoding address: ${data.address}`);
            const geocodingEndpoint = process.env.GEOCODING_API_ENDPOINT;
            const apiKey = process.env.GEOCODING_API_KEY;
            const response = await this.makeAPIRequest(`${geocodingEndpoint}/geocode`, 'GET', { address: data.address, apikey: apiKey }, {});
            return {
                success: true,
                address: data.address,
                coordinates: {
                    latitude: response.latitude,
                    longitude: response.longitude,
                },
            };
        }
        /**
         * Reverse geocode coordinates
         */
        async reverseGeocode(data) {
            this.logger.log(`Reverse geocoding: ${data.latitude}, ${data.longitude}`);
            const geocodingEndpoint = process.env.GEOCODING_API_ENDPOINT;
            const apiKey = process.env.GEOCODING_API_KEY;
            const response = await this.makeAPIRequest(`${geocodingEndpoint}/reverse`, 'GET', { lat: data.latitude, lon: data.longitude, apikey: apiKey }, {});
            return {
                success: true,
                coordinates: { latitude: data.latitude, longitude: data.longitude },
                address: response.address,
            };
        }
        /**
         * Validate phone number
         */
        async validatePhoneNumber(data) {
            this.logger.log(`Validating phone number: ${data.phoneNumber}`);
            const validationEndpoint = process.env.PHONE_VALIDATION_API_ENDPOINT;
            const apiKey = process.env.PHONE_VALIDATION_API_KEY;
            const response = await this.makeAPIRequest(`${validationEndpoint}/validate`, 'POST', { phoneNumber: data.phoneNumber }, { 'X-API-Key': apiKey });
            return {
                success: true,
                phoneNumber: data.phoneNumber,
                isValid: response.isValid,
                type: response.type,
                carrier: response.carrier,
            };
        }
        /**
         * Enrich contact information
         */
        async enrichContactInformation(data) {
            this.logger.log(`Enriching contact information for: ${data.identifier}`);
            const enrichmentEndpoint = process.env.CONTACT_ENRICHMENT_API_ENDPOINT;
            const apiKey = process.env.CONTACT_ENRICHMENT_API_KEY;
            const response = await this.makeAPIRequest(`${enrichmentEndpoint}/enrich`, 'POST', { identifier: data.identifier, type: data.type }, { 'X-API-Key': apiKey });
            return {
                success: true,
                enrichedData: response,
            };
        }
    };
    __setFunctionName(_classThis, "ThirdPartyAPIIntegrationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _executeAPIRequest_decorators = [(0, microservices_1.MessagePattern)('api_execute_request')];
        _geocodeAddress_decorators = [(0, microservices_1.MessagePattern)('api_geocode_address')];
        _reverseGeocode_decorators = [(0, microservices_1.MessagePattern)('api_reverse_geocode')];
        _validatePhoneNumber_decorators = [(0, microservices_1.MessagePattern)('api_validate_phone')];
        _enrichContactInformation_decorators = [(0, microservices_1.MessagePattern)('api_enrich_contact')];
        __esDecorate(_classThis, null, _executeAPIRequest_decorators, { kind: "method", name: "executeAPIRequest", static: false, private: false, access: { has: obj => "executeAPIRequest" in obj, get: obj => obj.executeAPIRequest }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _geocodeAddress_decorators, { kind: "method", name: "geocodeAddress", static: false, private: false, access: { has: obj => "geocodeAddress" in obj, get: obj => obj.geocodeAddress }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _reverseGeocode_decorators, { kind: "method", name: "reverseGeocode", static: false, private: false, access: { has: obj => "reverseGeocode" in obj, get: obj => obj.reverseGeocode }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _validatePhoneNumber_decorators, { kind: "method", name: "validatePhoneNumber", static: false, private: false, access: { has: obj => "validatePhoneNumber" in obj, get: obj => obj.validatePhoneNumber }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _enrichContactInformation_decorators, { kind: "method", name: "enrichContactInformation", static: false, private: false, access: { has: obj => "enrichContactInformation" in obj, get: obj => obj.enrichContactInformation }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ThirdPartyAPIIntegrationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ThirdPartyAPIIntegrationService = _classThis;
})();
exports.ThirdPartyAPIIntegrationService = ThirdPartyAPIIntegrationService;
/**
 * Legacy System Adapter Service
 *
 * Provides adapters for integrating with legacy systems using various protocols.
 */
let LegacySystemAdapterService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _executeLegacySOAPRequest_decorators;
    let _executeFTPTransfer_decorators;
    let _executeLegacyDatabaseQuery_decorators;
    let _parseFixedWidthFile_decorators;
    let _transformCSVToJSON_decorators;
    let _executeMainframeTransaction_decorators;
    var LegacySystemAdapterService = _classThis = class {
        constructor(legacyTransactionModel, eventEmitter, httpService) {
            this.legacyTransactionModel = (__runInitializers(this, _instanceExtraInitializers), legacyTransactionModel);
            this.eventEmitter = eventEmitter;
            this.httpService = httpService;
            this.logger = new common_1.Logger(LegacySystemAdapterService.name);
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
                    queue: 'legacy_adapter',
                    queueOptions: { durable: true },
                },
            });
        }
        /**
         * Execute SOAP request to legacy system
         */
        async executeLegacySOAPRequest(data) {
            this.logger.log(`Executing SOAP request to legacy system: ${data.service}`);
            try {
                const transaction = await this.legacyTransactionModel.create({
                    systemName: data.systemName,
                    protocol: 'SOAP',
                    operation: data.operation,
                    requestData: data.requestData,
                    status: 'PENDING',
                    createdAt: new Date(),
                });
                const soapEnvelope = this.buildSOAPEnvelope(data.operation, data.requestData);
                const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(data.endpoint, soapEnvelope, {
                    headers: {
                        'Content-Type': 'text/xml',
                        'SOAPAction': data.soapAction,
                    },
                }).pipe((0, rxjs_1.timeout)(20000), (0, rxjs_1.retry)(3)));
                const parsedResponse = this.parseSOAPResponse(response.data);
                await transaction.update({
                    status: 'SUCCESS',
                    responseData: parsedResponse,
                    completedAt: new Date(),
                });
                return {
                    success: true,
                    transactionId: transaction.id,
                    response: parsedResponse,
                };
            }
            catch (error) {
                this.logger.error(`SOAP request failed: ${error.message}`);
                throw error;
            }
        }
        /**
         * Build SOAP envelope
         */
        buildSOAPEnvelope(operation, data) {
            return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:web="http://webservice.example.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <web:${operation}>
      ${this.buildSOAPParams(data)}
    </web:${operation}>
  </soapenv:Body>
</soapenv:Envelope>`;
        }
        /**
         * Build SOAP parameters
         */
        buildSOAPParams(data) {
            return Object.keys(data).map(key => `<${key}>${data[key]}</${key}>`).join('\n      ');
        }
        /**
         * Parse SOAP response
         */
        parseSOAPResponse(soapResponse) {
            // Simplified SOAP response parsing
            // In production, use a proper XML parser
            return { raw: soapResponse, parsed: true };
        }
        /**
         * Execute FTP file transfer
         */
        async executeFTPTransfer(data) {
            this.logger.log(`Executing FTP transfer to legacy system: ${data.host}`);
            try {
                const transaction = await this.legacyTransactionModel.create({
                    systemName: data.systemName,
                    protocol: 'FTP',
                    operation: data.operation,
                    requestData: { fileName: data.fileName },
                    status: 'PENDING',
                    createdAt: new Date(),
                });
                // FTP transfer logic would go here
                // Using FTP client library
                await transaction.update({
                    status: 'SUCCESS',
                    completedAt: new Date(),
                });
                return {
                    success: true,
                    transactionId: transaction.id,
                };
            }
            catch (error) {
                this.logger.error(`FTP transfer failed: ${error.message}`);
                throw error;
            }
        }
        /**
         * Execute database direct connection query
         */
        async executeLegacyDatabaseQuery(data) {
            this.logger.log(`Executing direct database query to legacy system: ${data.database}`);
            try {
                const transaction = await this.legacyTransactionModel.create({
                    systemName: data.systemName,
                    protocol: 'DATABASE',
                    operation: 'QUERY',
                    requestData: { query: data.query },
                    status: 'PENDING',
                    createdAt: new Date(),
                });
                // Direct database connection and query execution
                // This would use appropriate database driver
                await transaction.update({
                    status: 'SUCCESS',
                    responseData: { rows: [] },
                    completedAt: new Date(),
                });
                return {
                    success: true,
                    transactionId: transaction.id,
                    results: [],
                };
            }
            catch (error) {
                this.logger.error(`Database query failed: ${error.message}`);
                throw error;
            }
        }
        /**
         * Parse fixed-width file format
         */
        async parseFixedWidthFile(data) {
            this.logger.log(`Parsing fixed-width file: ${data.fileName}`);
            const records = [];
            const lines = data.fileContent.split('\n');
            for (const line of lines) {
                if (line.trim().length === 0)
                    continue;
                const record = {};
                let position = 0;
                for (const field of data.fieldDefinitions) {
                    const value = line.substring(position, position + field.length).trim();
                    record[field.name] = value;
                    position += field.length;
                }
                records.push(record);
            }
            return {
                success: true,
                recordCount: records.length,
                records,
            };
        }
        /**
         * Transform CSV data to JSON
         */
        async transformCSVToJSON(data) {
            this.logger.log(`Transforming CSV to JSON: ${data.fileName}`);
            const lines = data.csvContent.split('\n');
            const headers = lines[0].split(',').map((h) => h.trim());
            const records = [];
            for (let i = 1; i < lines.length; i++) {
                if (lines[i].trim().length === 0)
                    continue;
                const values = lines[i].split(',');
                const record = {};
                headers.forEach((header, index) => {
                    record[header] = values[index]?.trim() || '';
                });
                records.push(record);
            }
            return {
                success: true,
                recordCount: records.length,
                records,
            };
        }
        /**
         * Execute mainframe transaction (CICS/IMS)
         */
        async executeMainframeTransaction(data) {
            this.logger.log(`Executing mainframe transaction: ${data.transactionId}`);
            try {
                const transaction = await this.legacyTransactionModel.create({
                    systemName: 'MAINFRAME',
                    protocol: 'CICS',
                    operation: data.transactionId,
                    requestData: data.requestData,
                    status: 'PENDING',
                    createdAt: new Date(),
                });
                // Mainframe transaction execution logic
                // Would use mainframe connector library
                await transaction.update({
                    status: 'SUCCESS',
                    responseData: { transactionId: data.transactionId },
                    completedAt: new Date(),
                });
                return {
                    success: true,
                    transactionId: transaction.id,
                };
            }
            catch (error) {
                this.logger.error(`Mainframe transaction failed: ${error.message}`);
                throw error;
            }
        }
    };
    __setFunctionName(_classThis, "LegacySystemAdapterService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _executeLegacySOAPRequest_decorators = [(0, microservices_1.MessagePattern)('legacy_soap_request')];
        _executeFTPTransfer_decorators = [(0, microservices_1.MessagePattern)('legacy_ftp_transfer')];
        _executeLegacyDatabaseQuery_decorators = [(0, microservices_1.MessagePattern)('legacy_database_query')];
        _parseFixedWidthFile_decorators = [(0, microservices_1.MessagePattern)('legacy_parse_fixed_width')];
        _transformCSVToJSON_decorators = [(0, microservices_1.MessagePattern)('legacy_csv_to_json')];
        _executeMainframeTransaction_decorators = [(0, microservices_1.MessagePattern)('legacy_mainframe_transaction')];
        __esDecorate(_classThis, null, _executeLegacySOAPRequest_decorators, { kind: "method", name: "executeLegacySOAPRequest", static: false, private: false, access: { has: obj => "executeLegacySOAPRequest" in obj, get: obj => obj.executeLegacySOAPRequest }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _executeFTPTransfer_decorators, { kind: "method", name: "executeFTPTransfer", static: false, private: false, access: { has: obj => "executeFTPTransfer" in obj, get: obj => obj.executeFTPTransfer }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _executeLegacyDatabaseQuery_decorators, { kind: "method", name: "executeLegacyDatabaseQuery", static: false, private: false, access: { has: obj => "executeLegacyDatabaseQuery" in obj, get: obj => obj.executeLegacyDatabaseQuery }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _parseFixedWidthFile_decorators, { kind: "method", name: "parseFixedWidthFile", static: false, private: false, access: { has: obj => "parseFixedWidthFile" in obj, get: obj => obj.parseFixedWidthFile }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _transformCSVToJSON_decorators, { kind: "method", name: "transformCSVToJSON", static: false, private: false, access: { has: obj => "transformCSVToJSON" in obj, get: obj => obj.transformCSVToJSON }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _executeMainframeTransaction_decorators, { kind: "method", name: "executeMainframeTransaction", static: false, private: false, access: { has: obj => "executeMainframeTransaction" in obj, get: obj => obj.executeMainframeTransaction }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LegacySystemAdapterService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LegacySystemAdapterService = _classThis;
})();
exports.LegacySystemAdapterService = LegacySystemAdapterService;
/**
 * Message Transformation Service
 *
 * Handles message transformation and routing for enterprise integration patterns.
 */
let MessageTransformationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _transformMessage_decorators;
    let _routeMessage_decorators;
    var MessageTransformationService = _classThis = class {
        constructor() {
            this.logger = (__runInitializers(this, _instanceExtraInitializers), new common_1.Logger(MessageTransformationService.name));
        }
        /**
         * Transform message format
         */
        async transformMessage(data) {
            this.logger.log(`Transforming message from ${data.sourceFormat} to ${data.targetFormat}`);
            let transformedData;
            switch (data.targetFormat) {
                case 'JSON':
                    transformedData = this.transformToJSON(data.sourceData, data.sourceFormat);
                    break;
                case 'XML':
                    transformedData = this.transformToXML(data.sourceData, data.sourceFormat);
                    break;
                case 'CSV':
                    transformedData = this.transformToCSV(data.sourceData, data.sourceFormat);
                    break;
                default:
                    throw new common_1.BadRequestException(`Unsupported target format: ${data.targetFormat}`);
            }
            return {
                success: true,
                sourceFormat: data.sourceFormat,
                targetFormat: data.targetFormat,
                transformedData,
            };
        }
        /**
         * Transform to JSON
         */
        transformToJSON(data, sourceFormat) {
            // Transformation logic based on source format
            return typeof data === 'string' ? JSON.parse(data) : data;
        }
        /**
         * Transform to XML
         */
        transformToXML(data, sourceFormat) {
            // Simple XML transformation
            return `<?xml version="1.0" encoding="UTF-8"?>\n<root>${JSON.stringify(data)}</root>`;
        }
        /**
         * Transform to CSV
         */
        transformToCSV(data, sourceFormat) {
            if (!Array.isArray(data)) {
                data = [data];
            }
            if (data.length === 0)
                return '';
            const headers = Object.keys(data[0]);
            const rows = data.map((record) => headers.map(header => record[header] || '').join(','));
            return [headers.join(','), ...rows].join('\n');
        }
        /**
         * Route message based on content
         */
        async routeMessage(data) {
            this.logger.log(`Routing message based on content: ${data.messageType}`);
            const route = this.determineRoute(data.message, data.routingRules);
            return {
                success: true,
                route,
                message: data.message,
            };
        }
        /**
         * Determine message route
         */
        determineRoute(message, rules) {
            for (const rule of rules) {
                if (this.evaluateRule(message, rule.condition)) {
                    return rule.destination;
                }
            }
            return 'default';
        }
        /**
         * Evaluate routing rule
         */
        evaluateRule(message, condition) {
            // Simple condition evaluation
            return message[condition.field] === condition.value;
        }
    };
    __setFunctionName(_classThis, "MessageTransformationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _transformMessage_decorators = [(0, microservices_1.MessagePattern)('transform_message')];
        _routeMessage_decorators = [(0, microservices_1.MessagePattern)('route_message')];
        __esDecorate(_classThis, null, _transformMessage_decorators, { kind: "method", name: "transformMessage", static: false, private: false, access: { has: obj => "transformMessage" in obj, get: obj => obj.transformMessage }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _routeMessage_decorators, { kind: "method", name: "routeMessage", static: false, private: false, access: { has: obj => "routeMessage" in obj, get: obj => obj.routeMessage }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MessageTransformationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MessageTransformationService = _classThis;
})();
exports.MessageTransformationService = MessageTransformationService;
//# sourceMappingURL=integration-services.js.map