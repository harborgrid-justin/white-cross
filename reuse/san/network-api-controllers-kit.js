"use strict";
/**
 * LOC: NETCTRL1234567
 * File: /reuse/san/network-api-controllers-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Network controller implementations
 *   - SAN (Storage Area Network) controllers
 *   - Virtual network management services
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
exports.isValidSubnet = exports.isValidIpAddress = exports.generateNetworkResetHandler = exports.generateNetworkRestartHandler = exports.generateNetworkDiagnosticsHandler = exports.generateNetworkPortScanHandler = exports.generateNetworkDnsLookupHandler = exports.generateNetworkTracerouteHandler = exports.generateNetworkPingHandler = exports.generateNetworkTroubleshootHandler = exports.generateNetworkQoSHandler = exports.generateCapacityPlanningHandler = exports.generatePerformanceAnalyticsHandler = exports.generateNetworkConnectionsHandler = exports.generateNetworkTopologyHandler = exports.generateNetworkEventsHandler = exports.generateNetworkAlertsHandler = exports.generateMonitoringDashboardHandler = exports.generateAddFirewallRuleHandler = exports.generateNetworkFirewallHandler = exports.generateRemoveNetworkRouteHandler = exports.generateAddNetworkRouteHandler = exports.generateNetworkRoutesHandler = exports.generateApplyNetworkConfigHandler = exports.generateUpdateNetworkConfigHandler = exports.generateNetworkConfigHandler = exports.generateNetworkPacketStatsHandler = exports.generateNetworkLatencyHandler = exports.generateNetworkBandwidthHandler = exports.generateNetworkUptimeHandler = exports.generateTriggerHealthCheckHandler = exports.generateNetworkMetricsHandler = exports.generateNetworkHealthCheckHandler = exports.generateNetworkStatusHandler = exports.generateNetworkBulkCreateHandler = exports.generateNetworkDeleteHandler = exports.generateNetworkPatchHandler = exports.generateNetworkUpdateHandler = exports.generateNetworkCreateHandler = exports.generateNetworkGetHandler = exports.generateNetworkListHandler = exports.createNetworkCrudController = void 0;
/**
 * File: /reuse/san/network-api-controllers-kit.ts
 * Locator: WC-UTL-NETCTRL-001
 * Purpose: Comprehensive Network API Controller Utilities - NestJS controllers, endpoint handlers, network CRUD, monitoring, health checks
 *
 * Upstream: Independent utility module for network controller implementation
 * Downstream: ../backend/*, Network controllers, virtual network services, SAN management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, @nestjs/swagger 7.x, class-validator 0.14.x
 * Exports: 40+ utility functions for network API controllers, CRUD operations, status monitoring, configuration management
 *
 * LLM Context: Comprehensive network API controller utilities for implementing production-ready NestJS controllers
 * for software-based enterprise virtual networks (SAN). Provides CRUD endpoint handlers, network status monitoring,
 * health checks, configuration management, troubleshooting endpoints, request validation, and response transformation.
 * Essential for scalable enterprise network infrastructure management.
 */
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// NETWORK CRUD CONTROLLERS (1-8)
// ============================================================================
/**
 * Creates a NestJS controller class for network CRUD operations.
 *
 * @param {string} basePath - Base path for the controller
 * @param {string} tag - Swagger tag for grouping
 * @returns {any} NestJS controller class
 *
 * @example
 * ```typescript
 * const NetworkController = createNetworkCrudController('/networks', 'Networks');
 * ```
 */
const createNetworkCrudController = (basePath, tag) => {
    let NetworkCrudController = (() => {
        let _classDecorators = [(0, swagger_1.ApiTags)(tag), (0, common_1.Controller)(basePath), (0, swagger_1.ApiBearerAuth)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _instanceExtraInitializers = [];
        let _findAll_decorators;
        let _findOne_decorators;
        let _create_decorators;
        let _update_decorators;
        let _patch_decorators;
        let _remove_decorators;
        var NetworkCrudController = _classThis = class {
            async findAll(page = 1, limit = 10, type) {
                return { page, limit, type, data: [] };
            }
            async findOne(id) {
                return { networkId: id };
            }
            async create(createNetworkDto) {
                return createNetworkDto;
            }
            async update(id, updateNetworkDto) {
                return { networkId: id, ...updateNetworkDto };
            }
            async patch(id, patchNetworkDto) {
                return { networkId: id, ...patchNetworkDto };
            }
            async remove(id) {
                return;
            }
            constructor() {
                __runInitializers(this, _instanceExtraInitializers);
            }
        };
        __setFunctionName(_classThis, "NetworkCrudController");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _findAll_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Get all networks with pagination' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Networks retrieved successfully' }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }), (0, swagger_1.ApiQuery)({ name: 'type', required: false, enum: ['vlan', 'vxlan', 'overlay', 'underlay'] })];
            _findOne_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get network by ID' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Network ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Network found' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Network not found' })];
            _create_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create new network' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Network created successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' })];
            _update_decorators = [(0, common_1.Put)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Update network completely' }), (0, swagger_1.ApiParam)({ name: 'id', type: String }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Network updated' })];
            _patch_decorators = [(0, common_1.Patch)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Partially update network' }), (0, swagger_1.ApiParam)({ name: 'id', type: String }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Network patched' })];
            _remove_decorators = [(0, common_1.Delete)(':id'), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT), (0, swagger_1.ApiOperation)({ summary: 'Delete network' }), (0, swagger_1.ApiParam)({ name: 'id', type: String }), (0, swagger_1.ApiResponse)({ status: 204, description: 'Network deleted' })];
            __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: obj => "findAll" in obj, get: obj => obj.findAll }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: obj => "findOne" in obj, get: obj => obj.findOne }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: obj => "update" in obj, get: obj => obj.update }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_classThis, null, _patch_decorators, { kind: "method", name: "patch", static: false, private: false, access: { has: obj => "patch" in obj, get: obj => obj.patch }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: obj => "remove" in obj, get: obj => obj.remove }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            NetworkCrudController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return NetworkCrudController = _classThis;
    })();
    return NetworkCrudController;
};
exports.createNetworkCrudController = createNetworkCrudController;
/**
 * Generates a GET endpoint handler for listing networks with filtering.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Get()
 * async findAll(...args) {
 *   return generateNetworkListHandler(this.networkService)(...args);
 * }
 * ```
 */
const generateNetworkListHandler = (service) => {
    return async (page, limit, filters) => {
        const skip = (page - 1) * limit;
        const networks = await service.findAll({
            skip,
            take: limit,
            where: filters,
        });
        return {
            data: networks,
            pagination: {
                page,
                limit,
                total: await service.count(filters),
            },
        };
    };
};
exports.generateNetworkListHandler = generateNetworkListHandler;
/**
 * Generates a GET endpoint handler for retrieving a single network by ID.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Get(':id')
 * async findOne(@Param('id') id: string) {
 *   return generateNetworkGetHandler(this.networkService)(id);
 * }
 * ```
 */
const generateNetworkGetHandler = (service) => {
    return async (networkId) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        return network;
    };
};
exports.generateNetworkGetHandler = generateNetworkGetHandler;
/**
 * Generates a POST endpoint handler for creating a new network.
 *
 * @param {any} service - Network service instance
 * @param {Function} [validator] - Optional validation function
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Post()
 * async create(@Body() dto: CreateNetworkDto) {
 *   return generateNetworkCreateHandler(this.networkService)(dto);
 * }
 * ```
 */
const generateNetworkCreateHandler = (service, validator) => {
    return async (createDto) => {
        if (validator) {
            const validation = await validator(createDto);
            if (!validation.valid) {
                throw new common_1.BadRequestException(validation.errors);
            }
        }
        // Check for duplicate network name
        const existing = await service.findByName(createDto.name);
        if (existing) {
            throw new common_1.ConflictException(`Network with name ${createDto.name} already exists`);
        }
        return await service.create(createDto);
    };
};
exports.generateNetworkCreateHandler = generateNetworkCreateHandler;
/**
 * Generates a PUT endpoint handler for updating a network.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Put(':id')
 * async update(@Param('id') id: string, @Body() dto: UpdateNetworkDto) {
 *   return generateNetworkUpdateHandler(this.networkService)(id, dto);
 * }
 * ```
 */
const generateNetworkUpdateHandler = (service) => {
    return async (networkId, updateDto) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        return await service.update(networkId, updateDto);
    };
};
exports.generateNetworkUpdateHandler = generateNetworkUpdateHandler;
/**
 * Generates a PATCH endpoint handler for partially updating a network.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Patch(':id')
 * async patch(@Param('id') id: string, @Body() dto: PatchNetworkDto) {
 *   return generateNetworkPatchHandler(this.networkService)(id, dto);
 * }
 * ```
 */
const generateNetworkPatchHandler = (service) => {
    return async (networkId, patchDto) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        // Merge only provided fields
        const updated = { ...network, ...patchDto };
        return await service.update(networkId, updated);
    };
};
exports.generateNetworkPatchHandler = generateNetworkPatchHandler;
/**
 * Generates a DELETE endpoint handler for removing a network.
 *
 * @param {any} service - Network service instance
 * @param {boolean} [softDelete=true] - Whether to soft delete
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Delete(':id')
 * async remove(@Param('id') id: string) {
 *   return generateNetworkDeleteHandler(this.networkService)(id);
 * }
 * ```
 */
const generateNetworkDeleteHandler = (service, softDelete = true) => {
    return async (networkId) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        // Check if network has active connections
        const activeConnections = await service.getActiveConnections(networkId);
        if (activeConnections > 0) {
            throw new common_1.BadRequestException(`Cannot delete network with ${activeConnections} active connections`);
        }
        if (softDelete) {
            return await service.softDelete(networkId);
        }
        return await service.delete(networkId);
    };
};
exports.generateNetworkDeleteHandler = generateNetworkDeleteHandler;
/**
 * Generates a POST endpoint handler for bulk network creation.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Post('bulk')
 * async createBulk(@Body() dto: CreateNetworksDto) {
 *   return generateNetworkBulkCreateHandler(this.networkService)(dto.networks);
 * }
 * ```
 */
const generateNetworkBulkCreateHandler = (service) => {
    return async (networks) => {
        const results = await Promise.allSettled(networks.map(network => service.create(network)));
        return {
            success: results.filter(r => r.status === 'fulfilled').length,
            failed: results.filter(r => r.status === 'rejected').length,
            results: results.map((r, i) => ({
                index: i,
                success: r.status === 'fulfilled',
                data: r.status === 'fulfilled' ? r.value : null,
                error: r.status === 'rejected' ? r.reason.message : null,
            })),
        };
    };
};
exports.generateNetworkBulkCreateHandler = generateNetworkBulkCreateHandler;
// ============================================================================
// NETWORK STATUS & HEALTH ENDPOINTS (9-16)
// ============================================================================
/**
 * Generates a GET endpoint handler for network status.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Get(':id/status')
 * async getStatus(@Param('id') id: string) {
 *   return generateNetworkStatusHandler(this.networkService)(id);
 * }
 * ```
 */
const generateNetworkStatusHandler = (service) => {
    return async (networkId) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        const status = await service.getStatus(networkId);
        const metrics = await service.getCurrentMetrics(networkId);
        return {
            networkId,
            status: status.operational ? 'active' : 'degraded',
            uptime: status.uptime,
            lastCheck: new Date(),
            connectedDevices: await service.getConnectedDeviceCount(networkId),
            bandwidth: {
                used: metrics.bandwidth.used,
                total: metrics.bandwidth.total,
                unit: 'Mbps',
            },
            latency: metrics.latency,
            packetLoss: metrics.packetLoss,
        };
    };
};
exports.generateNetworkStatusHandler = generateNetworkStatusHandler;
/**
 * Generates a GET endpoint handler for network health checks.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Get(':id/health')
 * async getHealth(@Param('id') id: string) {
 *   return generateNetworkHealthCheckHandler(this.networkService)(id);
 * }
 * ```
 */
const generateNetworkHealthCheckHandler = (service) => {
    return async (networkId) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        const checks = await service.performHealthChecks(networkId);
        const issues = [];
        if (!checks.connectivity)
            issues.push('Connectivity issue detected');
        if (!checks.routing)
            issues.push('Routing configuration issue');
        if (!checks.dns)
            issues.push('DNS resolution failing');
        if (!checks.gateway)
            issues.push('Gateway unreachable');
        return {
            networkId,
            healthy: Object.values(checks).every(Boolean),
            checks,
            timestamp: new Date(),
            issues,
        };
    };
};
exports.generateNetworkHealthCheckHandler = generateNetworkHealthCheckHandler;
/**
 * Generates a GET endpoint handler for network metrics.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Get(':id/metrics')
 * async getMetrics(@Param('id') id: string, @Query('timeRange') timeRange: string) {
 *   return generateNetworkMetricsHandler(this.networkService)(id, timeRange);
 * }
 * ```
 */
const generateNetworkMetricsHandler = (service) => {
    return async (networkId, timeRange) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        const range = timeRange || '1h';
        return await service.getMetrics(networkId, range);
    };
};
exports.generateNetworkMetricsHandler = generateNetworkMetricsHandler;
/**
 * Generates a POST endpoint handler for triggering network health check.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Post(':id/health-check')
 * async triggerHealthCheck(@Param('id') id: string) {
 *   return generateTriggerHealthCheckHandler(this.networkService)(id);
 * }
 * ```
 */
const generateTriggerHealthCheckHandler = (service) => {
    return async (networkId) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        const checkId = await service.queueHealthCheck(networkId);
        return {
            networkId,
            checkId,
            status: 'queued',
            message: 'Health check initiated',
        };
    };
};
exports.generateTriggerHealthCheckHandler = generateTriggerHealthCheckHandler;
/**
 * Generates a GET endpoint handler for network uptime statistics.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Get(':id/uptime')
 * async getUptime(@Param('id') id: string) {
 *   return generateNetworkUptimeHandler(this.networkService)(id);
 * }
 * ```
 */
const generateNetworkUptimeHandler = (service) => {
    return async (networkId) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        const uptimeStats = await service.getUptimeStatistics(networkId);
        return {
            networkId,
            currentUptime: uptimeStats.current,
            uptimePercentage: uptimeStats.percentage,
            downtime: uptimeStats.downtime,
            lastIncident: uptimeStats.lastIncident,
            mtbf: uptimeStats.mtbf, // Mean Time Between Failures
            mttr: uptimeStats.mttr, // Mean Time To Recovery
        };
    };
};
exports.generateNetworkUptimeHandler = generateNetworkUptimeHandler;
/**
 * Generates a GET endpoint handler for network bandwidth usage.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Get(':id/bandwidth')
 * async getBandwidth(@Param('id') id: string, @Query('interval') interval: string) {
 *   return generateNetworkBandwidthHandler(this.networkService)(id, interval);
 * }
 * ```
 */
const generateNetworkBandwidthHandler = (service) => {
    return async (networkId, interval = '5m') => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        const bandwidthData = await service.getBandwidthUsage(networkId, interval);
        return {
            networkId,
            interval,
            data: bandwidthData.map(point => ({
                timestamp: point.timestamp,
                rx: point.rx,
                tx: point.tx,
                total: point.rx + point.tx,
                unit: 'Mbps',
            })),
            average: {
                rx: bandwidthData.reduce((sum, p) => sum + p.rx, 0) / bandwidthData.length,
                tx: bandwidthData.reduce((sum, p) => sum + p.tx, 0) / bandwidthData.length,
            },
            peak: {
                rx: Math.max(...bandwidthData.map(p => p.rx)),
                tx: Math.max(...bandwidthData.map(p => p.tx)),
            },
        };
    };
};
exports.generateNetworkBandwidthHandler = generateNetworkBandwidthHandler;
/**
 * Generates a GET endpoint handler for network latency metrics.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Get(':id/latency')
 * async getLatency(@Param('id') id: string) {
 *   return generateNetworkLatencyHandler(this.networkService)(id);
 * }
 * ```
 */
const generateNetworkLatencyHandler = (service) => {
    return async (networkId) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        const latencyData = await service.getLatencyMetrics(networkId);
        return {
            networkId,
            current: latencyData.current,
            average: latencyData.average,
            min: latencyData.min,
            max: latencyData.max,
            p50: latencyData.percentiles.p50,
            p95: latencyData.percentiles.p95,
            p99: latencyData.percentiles.p99,
            unit: 'ms',
            timestamp: new Date(),
        };
    };
};
exports.generateNetworkLatencyHandler = generateNetworkLatencyHandler;
/**
 * Generates a GET endpoint handler for network packet statistics.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Get(':id/packets')
 * async getPacketStats(@Param('id') id: string) {
 *   return generateNetworkPacketStatsHandler(this.networkService)(id);
 * }
 * ```
 */
const generateNetworkPacketStatsHandler = (service) => {
    return async (networkId) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        const packetStats = await service.getPacketStatistics(networkId);
        return {
            networkId,
            packets: {
                rx: packetStats.received,
                tx: packetStats.transmitted,
                dropped: packetStats.dropped,
                errors: packetStats.errors,
            },
            rates: {
                rxRate: packetStats.receiveRate,
                txRate: packetStats.transmitRate,
                dropRate: packetStats.dropRate,
                errorRate: packetStats.errorRate,
            },
            dropReasons: packetStats.dropReasons,
            errorTypes: packetStats.errorTypes,
            timestamp: new Date(),
        };
    };
};
exports.generateNetworkPacketStatsHandler = generateNetworkPacketStatsHandler;
// ============================================================================
// NETWORK CONFIGURATION ENDPOINTS (17-24)
// ============================================================================
/**
 * Generates a GET endpoint handler for network configuration.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Get(':id/config')
 * async getConfig(@Param('id') id: string) {
 *   return generateNetworkConfigHandler(this.networkService)(id);
 * }
 * ```
 */
const generateNetworkConfigHandler = (service) => {
    return async (networkId) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        return await service.getConfiguration(networkId);
    };
};
exports.generateNetworkConfigHandler = generateNetworkConfigHandler;
/**
 * Generates a PUT endpoint handler for updating network configuration.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Put(':id/config')
 * async updateConfig(@Param('id') id: string, @Body() config: NetworkConfigDto) {
 *   return generateUpdateNetworkConfigHandler(this.networkService)(id, config);
 * }
 * ```
 */
const generateUpdateNetworkConfigHandler = (service) => {
    return async (networkId, config) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        // Validate configuration
        if (config.subnet && !(0, exports.isValidSubnet)(config.subnet)) {
            throw new common_1.BadRequestException('Invalid subnet format');
        }
        if (config.gateway && !(0, exports.isValidIpAddress)(config.gateway)) {
            throw new common_1.BadRequestException('Invalid gateway IP address');
        }
        return await service.updateConfiguration(networkId, config);
    };
};
exports.generateUpdateNetworkConfigHandler = generateUpdateNetworkConfigHandler;
/**
 * Generates a POST endpoint handler for applying network configuration.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Post(':id/config/apply')
 * async applyConfig(@Param('id') id: string) {
 *   return generateApplyNetworkConfigHandler(this.networkService)(id);
 * }
 * ```
 */
const generateApplyNetworkConfigHandler = (service) => {
    return async (networkId) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        const applyResult = await service.applyConfiguration(networkId);
        return {
            networkId,
            applied: applyResult.success,
            changes: applyResult.changes,
            errors: applyResult.errors,
            timestamp: new Date(),
        };
    };
};
exports.generateApplyNetworkConfigHandler = generateApplyNetworkConfigHandler;
/**
 * Generates a GET endpoint handler for network routing table.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Get(':id/routes')
 * async getRoutes(@Param('id') id: string) {
 *   return generateNetworkRoutesHandler(this.networkService)(id);
 * }
 * ```
 */
const generateNetworkRoutesHandler = (service) => {
    return async (networkId) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        return await service.getRoutes(networkId);
    };
};
exports.generateNetworkRoutesHandler = generateNetworkRoutesHandler;
/**
 * Generates a POST endpoint handler for adding a network route.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Post(':id/routes')
 * async addRoute(@Param('id') id: string, @Body() route: AddRouteDto) {
 *   return generateAddNetworkRouteHandler(this.networkService)(id, route);
 * }
 * ```
 */
const generateAddNetworkRouteHandler = (service) => {
    return async (networkId, route) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        // Validate route
        if (!(0, exports.isValidSubnet)(route.destination)) {
            throw new common_1.BadRequestException('Invalid destination subnet');
        }
        if (!(0, exports.isValidIpAddress)(route.gateway)) {
            throw new common_1.BadRequestException('Invalid gateway IP address');
        }
        return await service.addRoute(networkId, route);
    };
};
exports.generateAddNetworkRouteHandler = generateAddNetworkRouteHandler;
/**
 * Generates a DELETE endpoint handler for removing a network route.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Delete(':id/routes/:routeId')
 * async removeRoute(@Param('id') id: string, @Param('routeId') routeId: string) {
 *   return generateRemoveNetworkRouteHandler(this.networkService)(id, routeId);
 * }
 * ```
 */
const generateRemoveNetworkRouteHandler = (service) => {
    return async (networkId, routeId) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        const route = await service.findRoute(routeId);
        if (!route) {
            throw new common_1.NotFoundException(`Route with ID ${routeId} not found`);
        }
        return await service.removeRoute(networkId, routeId);
    };
};
exports.generateRemoveNetworkRouteHandler = generateRemoveNetworkRouteHandler;
/**
 * Generates a GET endpoint handler for network firewall rules.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Get(':id/firewall')
 * async getFirewallRules(@Param('id') id: string) {
 *   return generateNetworkFirewallHandler(this.networkService)(id);
 * }
 * ```
 */
const generateNetworkFirewallHandler = (service) => {
    return async (networkId) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        return await service.getFirewallRules(networkId);
    };
};
exports.generateNetworkFirewallHandler = generateNetworkFirewallHandler;
/**
 * Generates a POST endpoint handler for adding firewall rule.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Post(':id/firewall')
 * async addFirewallRule(@Param('id') id: string, @Body() rule: FirewallRuleDto) {
 *   return generateAddFirewallRuleHandler(this.networkService)(id, rule);
 * }
 * ```
 */
const generateAddFirewallRuleHandler = (service) => {
    return async (networkId, rule) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        return await service.addFirewallRule(networkId, rule);
    };
};
exports.generateAddFirewallRuleHandler = generateAddFirewallRuleHandler;
// ============================================================================
// NETWORK MONITORING ENDPOINTS (25-32)
// ============================================================================
/**
 * Generates a GET endpoint handler for network monitoring dashboard data.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Get(':id/monitoring/dashboard')
 * async getDashboard(@Param('id') id: string) {
 *   return generateMonitoringDashboardHandler(this.networkService)(id);
 * }
 * ```
 */
const generateMonitoringDashboardHandler = (service) => {
    return async (networkId) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        const [status, metrics, health, bandwidth] = await Promise.all([
            service.getStatus(networkId),
            service.getCurrentMetrics(networkId),
            service.performHealthChecks(networkId),
            service.getBandwidthUsage(networkId, '1h'),
        ]);
        return {
            networkId,
            overview: {
                status: status.operational ? 'active' : 'degraded',
                health: Object.values(health).every(Boolean) ? 'healthy' : 'unhealthy',
                uptime: status.uptime,
                connectedDevices: await service.getConnectedDeviceCount(networkId),
            },
            metrics: {
                bandwidth: metrics.bandwidth,
                latency: metrics.latency,
                packetLoss: metrics.packetLoss,
                throughput: metrics.throughput,
            },
            recentBandwidth: bandwidth.slice(-20),
            alerts: await service.getActiveAlerts(networkId),
            timestamp: new Date(),
        };
    };
};
exports.generateMonitoringDashboardHandler = generateMonitoringDashboardHandler;
/**
 * Generates a GET endpoint handler for network alerts.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Get(':id/alerts')
 * async getAlerts(@Param('id') id: string, @Query('severity') severity: string) {
 *   return generateNetworkAlertsHandler(this.networkService)(id, severity);
 * }
 * ```
 */
const generateNetworkAlertsHandler = (service) => {
    return async (networkId, severity) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        const filters = { networkId };
        if (severity) {
            filters.severity = severity;
        }
        return await service.getAlerts(filters);
    };
};
exports.generateNetworkAlertsHandler = generateNetworkAlertsHandler;
/**
 * Generates a GET endpoint handler for network events log.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Get(':id/events')
 * async getEvents(@Param('id') id: string, @Query() query: EventQueryDto) {
 *   return generateNetworkEventsHandler(this.networkService)(id, query);
 * }
 * ```
 */
const generateNetworkEventsHandler = (service) => {
    return async (networkId, query) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        const { startDate, endDate, eventType, limit = 100 } = query;
        return await service.getEvents({
            networkId,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            eventType,
            limit,
        });
    };
};
exports.generateNetworkEventsHandler = generateNetworkEventsHandler;
/**
 * Generates a GET endpoint handler for network topology visualization.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Get(':id/topology')
 * async getTopology(@Param('id') id: string) {
 *   return generateNetworkTopologyHandler(this.networkService)(id);
 * }
 * ```
 */
const generateNetworkTopologyHandler = (service) => {
    return async (networkId) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        const topology = await service.getTopology(networkId);
        return {
            networkId,
            nodes: topology.nodes.map(node => ({
                id: node.id,
                type: node.type,
                label: node.label,
                status: node.status,
                metadata: node.metadata,
            })),
            edges: topology.edges.map(edge => ({
                id: edge.id,
                source: edge.source,
                target: edge.target,
                bandwidth: edge.bandwidth,
                latency: edge.latency,
                status: edge.status,
            })),
            layout: topology.layout,
        };
    };
};
exports.generateNetworkTopologyHandler = generateNetworkTopologyHandler;
/**
 * Generates a GET endpoint handler for network connection details.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Get(':id/connections')
 * async getConnections(@Param('id') id: string) {
 *   return generateNetworkConnectionsHandler(this.networkService)(id);
 * }
 * ```
 */
const generateNetworkConnectionsHandler = (service) => {
    return async (networkId) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        const connections = await service.getConnections(networkId);
        return {
            networkId,
            totalConnections: connections.length,
            activeConnections: connections.filter(c => c.status === 'active').length,
            connections: connections.map(conn => ({
                connectionId: conn.id,
                sourceIp: conn.sourceIp,
                destinationIp: conn.destinationIp,
                protocol: conn.protocol,
                port: conn.port,
                status: conn.status,
                bandwidth: conn.bandwidth,
                duration: conn.duration,
                startedAt: conn.startedAt,
            })),
        };
    };
};
exports.generateNetworkConnectionsHandler = generateNetworkConnectionsHandler;
/**
 * Generates a GET endpoint handler for network performance analytics.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Get(':id/analytics/performance')
 * async getPerformanceAnalytics(@Param('id') id: string, @Query('period') period: string) {
 *   return generatePerformanceAnalyticsHandler(this.networkService)(id, period);
 * }
 * ```
 */
const generatePerformanceAnalyticsHandler = (service) => {
    return async (networkId, period = '24h') => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        const analytics = await service.getPerformanceAnalytics(networkId, period);
        return {
            networkId,
            period,
            summary: {
                avgLatency: analytics.avgLatency,
                maxLatency: analytics.maxLatency,
                minLatency: analytics.minLatency,
                avgBandwidth: analytics.avgBandwidth,
                peakBandwidth: analytics.peakBandwidth,
                packetLossRate: analytics.packetLossRate,
                errorRate: analytics.errorRate,
            },
            trends: analytics.trends,
            anomalies: analytics.anomalies,
            recommendations: analytics.recommendations,
        };
    };
};
exports.generatePerformanceAnalyticsHandler = generatePerformanceAnalyticsHandler;
/**
 * Generates a GET endpoint handler for network capacity planning.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Get(':id/analytics/capacity')
 * async getCapacityPlanning(@Param('id') id: string) {
 *   return generateCapacityPlanningHandler(this.networkService)(id);
 * }
 * ```
 */
const generateCapacityPlanningHandler = (service) => {
    return async (networkId) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        const capacity = await service.getCapacityAnalysis(networkId);
        return {
            networkId,
            current: {
                utilization: capacity.currentUtilization,
                availableCapacity: capacity.availableCapacity,
                connectedDevices: capacity.connectedDevices,
                maxDevices: capacity.maxDevices,
            },
            forecast: {
                nextMonth: capacity.forecast.nextMonth,
                nextQuarter: capacity.forecast.nextQuarter,
                exhaustionDate: capacity.forecast.exhaustionDate,
            },
            recommendations: capacity.recommendations,
        };
    };
};
exports.generateCapacityPlanningHandler = generateCapacityPlanningHandler;
/**
 * Generates a GET endpoint handler for network QoS policies.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Get(':id/qos')
 * async getQoSPolicies(@Param('id') id: string) {
 *   return generateNetworkQoSHandler(this.networkService)(id);
 * }
 * ```
 */
const generateNetworkQoSHandler = (service) => {
    return async (networkId) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        return await service.getQoSPolicies(networkId);
    };
};
exports.generateNetworkQoSHandler = generateNetworkQoSHandler;
// ============================================================================
// NETWORK TROUBLESHOOTING ENDPOINTS (33-40)
// ============================================================================
/**
 * Generates a POST endpoint handler for network troubleshooting.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Post(':id/troubleshoot')
 * async troubleshoot(@Param('id') id: string, @Body() issue: TroubleshootDto) {
 *   return generateNetworkTroubleshootHandler(this.networkService)(id, issue);
 * }
 * ```
 */
const generateNetworkTroubleshootHandler = (service) => {
    return async (networkId, issue) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        const diagnostics = await service.runDiagnostics(networkId);
        const recommendations = await service.generateRecommendations(networkId, issue);
        return {
            networkId,
            issue,
            diagnostics,
            recommendations,
            timestamp: new Date(),
        };
    };
};
exports.generateNetworkTroubleshootHandler = generateNetworkTroubleshootHandler;
/**
 * Generates a POST endpoint handler for network ping test.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Post(':id/ping')
 * async ping(@Param('id') id: string, @Body() target: PingDto) {
 *   return generateNetworkPingHandler(this.networkService)(id, target.host);
 * }
 * ```
 */
const generateNetworkPingHandler = (service) => {
    return async (networkId, targetHost) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        const pingResult = await service.ping(networkId, targetHost);
        return {
            networkId,
            target: targetHost,
            reachable: pingResult.success,
            latency: pingResult.latency,
            packetLoss: pingResult.packetLoss,
            ttl: pingResult.ttl,
            timestamp: new Date(),
        };
    };
};
exports.generateNetworkPingHandler = generateNetworkPingHandler;
/**
 * Generates a POST endpoint handler for network traceroute.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Post(':id/traceroute')
 * async traceroute(@Param('id') id: string, @Body() target: TracerouteDto) {
 *   return generateNetworkTracerouteHandler(this.networkService)(id, target.host);
 * }
 * ```
 */
const generateNetworkTracerouteHandler = (service) => {
    return async (networkId, targetHost) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        const traceroute = await service.traceroute(networkId, targetHost);
        return {
            networkId,
            target: targetHost,
            hops: traceroute.hops.map((hop, index) => ({
                hop: index + 1,
                ip: hop.ip,
                hostname: hop.hostname,
                latency: hop.latency,
            })),
            totalHops: traceroute.hops.length,
            reachable: traceroute.reachable,
            timestamp: new Date(),
        };
    };
};
exports.generateNetworkTracerouteHandler = generateNetworkTracerouteHandler;
/**
 * Generates a POST endpoint handler for network DNS lookup.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Post(':id/dns-lookup')
 * async dnsLookup(@Param('id') id: string, @Body() query: DnsLookupDto) {
 *   return generateNetworkDnsLookupHandler(this.networkService)(id, query.hostname);
 * }
 * ```
 */
const generateNetworkDnsLookupHandler = (service) => {
    return async (networkId, hostname) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        const dnsResult = await service.dnsLookup(networkId, hostname);
        return {
            networkId,
            hostname,
            resolved: dnsResult.success,
            addresses: dnsResult.addresses,
            ttl: dnsResult.ttl,
            timestamp: new Date(),
        };
    };
};
exports.generateNetworkDnsLookupHandler = generateNetworkDnsLookupHandler;
/**
 * Generates a POST endpoint handler for network port scan.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Post(':id/port-scan')
 * async portScan(@Param('id') id: string, @Body() target: PortScanDto) {
 *   return generateNetworkPortScanHandler(this.networkService)(id, target);
 * }
 * ```
 */
const generateNetworkPortScanHandler = (service) => {
    return async (networkId, target) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        const scanResult = await service.portScan(networkId, target.host, target.ports);
        return {
            networkId,
            target: target.host,
            ports: scanResult.ports.map(port => ({
                port: port.number,
                open: port.open,
                service: port.service,
                protocol: port.protocol,
            })),
            timestamp: new Date(),
        };
    };
};
exports.generateNetworkPortScanHandler = generateNetworkPortScanHandler;
/**
 * Generates a GET endpoint handler for network diagnostic report.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Get(':id/diagnostics')
 * async getDiagnostics(@Param('id') id: string) {
 *   return generateNetworkDiagnosticsHandler(this.networkService)(id);
 * }
 * ```
 */
const generateNetworkDiagnosticsHandler = (service) => {
    return async (networkId) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        const diagnostics = await service.getComprehensiveDiagnostics(networkId);
        return {
            networkId,
            overall: diagnostics.overall,
            connectivity: diagnostics.connectivity,
            routing: diagnostics.routing,
            dns: diagnostics.dns,
            performance: diagnostics.performance,
            security: diagnostics.security,
            recommendations: diagnostics.recommendations,
            timestamp: new Date(),
        };
    };
};
exports.generateNetworkDiagnosticsHandler = generateNetworkDiagnosticsHandler;
/**
 * Generates a POST endpoint handler for network restart/reload.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Post(':id/restart')
 * async restart(@Param('id') id: string) {
 *   return generateNetworkRestartHandler(this.networkService)(id);
 * }
 * ```
 */
const generateNetworkRestartHandler = (service) => {
    return async (networkId) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        const restartResult = await service.restart(networkId);
        return {
            networkId,
            success: restartResult.success,
            message: restartResult.message,
            downtime: restartResult.downtime,
            timestamp: new Date(),
        };
    };
};
exports.generateNetworkRestartHandler = generateNetworkRestartHandler;
/**
 * Generates a POST endpoint handler for network reset.
 *
 * @param {any} service - Network service instance
 * @returns {Function} Endpoint handler function
 *
 * @example
 * ```typescript
 * @Post(':id/reset')
 * async reset(@Param('id') id: string, @Body() options: ResetDto) {
 *   return generateNetworkResetHandler(this.networkService)(id, options);
 * }
 * ```
 */
const generateNetworkResetHandler = (service) => {
    return async (networkId, options) => {
        const network = await service.findOne(networkId);
        if (!network) {
            throw new common_1.NotFoundException(`Network with ID ${networkId} not found`);
        }
        const resetResult = await service.reset(networkId, options);
        return {
            networkId,
            success: resetResult.success,
            clearedComponents: resetResult.clearedComponents,
            message: resetResult.message,
            timestamp: new Date(),
        };
    };
};
exports.generateNetworkResetHandler = generateNetworkResetHandler;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Validates if a string is a valid IP address.
 *
 * @param {string} ip - IP address to validate
 * @returns {boolean} Whether the IP is valid
 *
 * @example
 * ```typescript
 * const valid = isValidIpAddress('192.168.1.1'); // true
 * const invalid = isValidIpAddress('999.999.999.999'); // false
 * ```
 */
const isValidIpAddress = (ip) => {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::)$/;
    if (ipv4Regex.test(ip)) {
        return ip.split('.').every(part => {
            const num = parseInt(part, 10);
            return num >= 0 && num <= 255;
        });
    }
    return ipv6Regex.test(ip);
};
exports.isValidIpAddress = isValidIpAddress;
/**
 * Validates if a string is a valid subnet in CIDR notation.
 *
 * @param {string} subnet - Subnet to validate
 * @returns {boolean} Whether the subnet is valid
 *
 * @example
 * ```typescript
 * const valid = isValidSubnet('192.168.1.0/24'); // true
 * const invalid = isValidSubnet('192.168.1.0/33'); // false
 * ```
 */
const isValidSubnet = (subnet) => {
    const parts = subnet.split('/');
    if (parts.length !== 2)
        return false;
    const [ip, cidr] = parts;
    const cidrNum = parseInt(cidr, 10);
    return (0, exports.isValidIpAddress)(ip) && cidrNum >= 0 && cidrNum <= 32;
};
exports.isValidSubnet = isValidSubnet;
exports.default = {
    // Network CRUD Controllers
    createNetworkCrudController: exports.createNetworkCrudController,
    generateNetworkListHandler: exports.generateNetworkListHandler,
    generateNetworkGetHandler: exports.generateNetworkGetHandler,
    generateNetworkCreateHandler: exports.generateNetworkCreateHandler,
    generateNetworkUpdateHandler: exports.generateNetworkUpdateHandler,
    generateNetworkPatchHandler: exports.generateNetworkPatchHandler,
    generateNetworkDeleteHandler: exports.generateNetworkDeleteHandler,
    generateNetworkBulkCreateHandler: exports.generateNetworkBulkCreateHandler,
    // Network Status & Health Endpoints
    generateNetworkStatusHandler: exports.generateNetworkStatusHandler,
    generateNetworkHealthCheckHandler: exports.generateNetworkHealthCheckHandler,
    generateNetworkMetricsHandler: exports.generateNetworkMetricsHandler,
    generateTriggerHealthCheckHandler: exports.generateTriggerHealthCheckHandler,
    generateNetworkUptimeHandler: exports.generateNetworkUptimeHandler,
    generateNetworkBandwidthHandler: exports.generateNetworkBandwidthHandler,
    generateNetworkLatencyHandler: exports.generateNetworkLatencyHandler,
    generateNetworkPacketStatsHandler: exports.generateNetworkPacketStatsHandler,
    // Network Configuration Endpoints
    generateNetworkConfigHandler: exports.generateNetworkConfigHandler,
    generateUpdateNetworkConfigHandler: exports.generateUpdateNetworkConfigHandler,
    generateApplyNetworkConfigHandler: exports.generateApplyNetworkConfigHandler,
    generateNetworkRoutesHandler: exports.generateNetworkRoutesHandler,
    generateAddNetworkRouteHandler: exports.generateAddNetworkRouteHandler,
    generateRemoveNetworkRouteHandler: exports.generateRemoveNetworkRouteHandler,
    generateNetworkFirewallHandler: exports.generateNetworkFirewallHandler,
    generateAddFirewallRuleHandler: exports.generateAddFirewallRuleHandler,
    // Network Monitoring Endpoints
    generateMonitoringDashboardHandler: exports.generateMonitoringDashboardHandler,
    generateNetworkAlertsHandler: exports.generateNetworkAlertsHandler,
    generateNetworkEventsHandler: exports.generateNetworkEventsHandler,
    generateNetworkTopologyHandler: exports.generateNetworkTopologyHandler,
    generateNetworkConnectionsHandler: exports.generateNetworkConnectionsHandler,
    generatePerformanceAnalyticsHandler: exports.generatePerformanceAnalyticsHandler,
    generateCapacityPlanningHandler: exports.generateCapacityPlanningHandler,
    generateNetworkQoSHandler: exports.generateNetworkQoSHandler,
    // Network Troubleshooting Endpoints
    generateNetworkTroubleshootHandler: exports.generateNetworkTroubleshootHandler,
    generateNetworkPingHandler: exports.generateNetworkPingHandler,
    generateNetworkTracerouteHandler: exports.generateNetworkTracerouteHandler,
    generateNetworkDnsLookupHandler: exports.generateNetworkDnsLookupHandler,
    generateNetworkPortScanHandler: exports.generateNetworkPortScanHandler,
    generateNetworkDiagnosticsHandler: exports.generateNetworkDiagnosticsHandler,
    generateNetworkRestartHandler: exports.generateNetworkRestartHandler,
    generateNetworkResetHandler: exports.generateNetworkResetHandler,
    // Helper Functions
    isValidIpAddress: exports.isValidIpAddress,
    isValidSubnet: exports.isValidSubnet,
};
//# sourceMappingURL=network-api-controllers-kit.js.map