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

import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  ParseIntPipe,
  ParseBoolPipe,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsEnum, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface NetworkConfig {
  networkId: string;
  name: string;
  type: 'vlan' | 'vxlan' | 'overlay' | 'underlay';
  subnet: string;
  gateway: string;
  vlanId?: number;
  vni?: number;
  mtu: number;
  enabled: boolean;
}

interface NetworkStatus {
  networkId: string;
  status: 'active' | 'inactive' | 'degraded' | 'error';
  uptime: number;
  lastCheck: Date;
  connectedDevices: number;
  bandwidth: {
    used: number;
    total: number;
    unit: string;
  };
  latency: number;
  packetLoss: number;
}

interface NetworkHealthCheck {
  networkId: string;
  healthy: boolean;
  checks: {
    connectivity: boolean;
    routing: boolean;
    dns: boolean;
    gateway: boolean;
  };
  timestamp: Date;
  issues: string[];
}

interface NetworkMetrics {
  networkId: string;
  timestamp: Date;
  throughput: {
    rx: number;
    tx: number;
    unit: string;
  };
  packets: {
    rx: number;
    tx: number;
    dropped: number;
    errors: number;
  };
  connections: {
    active: number;
    total: number;
  };
}

interface NetworkTroubleshootResult {
  networkId: string;
  issue: string;
  diagnostics: {
    ping: boolean;
    traceroute: string[];
    dnsResolution: boolean;
    portScan: Record<number, boolean>;
  };
  recommendations: string[];
  timestamp: Date;
}

interface NetworkRoute {
  routeId: string;
  networkId: string;
  destination: string;
  gateway: string;
  metric: number;
  interface: string;
  type: 'static' | 'dynamic';
}

interface NetworkFirewallRule {
  ruleId: string;
  networkId: string;
  priority: number;
  action: 'allow' | 'deny';
  protocol: 'tcp' | 'udp' | 'icmp' | 'any';
  sourceIp: string;
  destinationIp: string;
  sourcePort?: number;
  destinationPort?: number;
  enabled: boolean;
}

interface NetworkQoSPolicy {
  policyId: string;
  networkId: string;
  name: string;
  priority: number;
  bandwidth: {
    min: number;
    max: number;
    unit: string;
  };
  latency: {
    max: number;
    unit: string;
  };
  trafficClass: string;
}

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
export const createNetworkCrudController = (basePath: string, tag: string): any => {
  @ApiTags(tag)
  @Controller(basePath)
  @ApiBearerAuth()
  class NetworkCrudController {
    @Get()
    @ApiOperation({ summary: 'Get all networks with pagination' })
    @ApiResponse({ status: 200, description: 'Networks retrieved successfully' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'type', required: false, enum: ['vlan', 'vxlan', 'overlay', 'underlay'] })
    async findAll(
      @Query('page', ParseIntPipe) page = 1,
      @Query('limit', ParseIntPipe) limit = 10,
      @Query('type') type?: string,
    ) {
      return { page, limit, type, data: [] };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get network by ID' })
    @ApiParam({ name: 'id', type: String, description: 'Network ID' })
    @ApiResponse({ status: 200, description: 'Network found' })
    @ApiResponse({ status: 404, description: 'Network not found' })
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return { networkId: id };
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create new network' })
    @ApiResponse({ status: 201, description: 'Network created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    async create(@Body() createNetworkDto: any) {
      return createNetworkDto;
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update network completely' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'Network updated' })
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateNetworkDto: any) {
      return { networkId: id, ...updateNetworkDto };
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Partially update network' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'Network patched' })
    async patch(@Param('id', ParseUUIDPipe) id: string, @Body() patchNetworkDto: any) {
      return { networkId: id, ...patchNetworkDto };
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete network' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 204, description: 'Network deleted' })
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return;
    }
  }

  return NetworkCrudController;
};

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
export const generateNetworkListHandler = (service: any) => {
  return async (page: number, limit: number, filters: any) => {
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
export const generateNetworkGetHandler = (service: any) => {
  return async (networkId: string) => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
    }

    return network;
  };
};

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
export const generateNetworkCreateHandler = (service: any, validator?: Function) => {
  return async (createDto: any) => {
    if (validator) {
      const validation = await validator(createDto);
      if (!validation.valid) {
        throw new BadRequestException(validation.errors);
      }
    }

    // Check for duplicate network name
    const existing = await service.findByName(createDto.name);
    if (existing) {
      throw new ConflictException(`Network with name ${createDto.name} already exists`);
    }

    return await service.create(createDto);
  };
};

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
export const generateNetworkUpdateHandler = (service: any) => {
  return async (networkId: string, updateDto: any) => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
    }

    return await service.update(networkId, updateDto);
  };
};

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
export const generateNetworkPatchHandler = (service: any) => {
  return async (networkId: string, patchDto: any) => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
    }

    // Merge only provided fields
    const updated = { ...network, ...patchDto };
    return await service.update(networkId, updated);
  };
};

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
export const generateNetworkDeleteHandler = (service: any, softDelete = true) => {
  return async (networkId: string) => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
    }

    // Check if network has active connections
    const activeConnections = await service.getActiveConnections(networkId);
    if (activeConnections > 0) {
      throw new BadRequestException(
        `Cannot delete network with ${activeConnections} active connections`,
      );
    }

    if (softDelete) {
      return await service.softDelete(networkId);
    }

    return await service.delete(networkId);
  };
};

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
export const generateNetworkBulkCreateHandler = (service: any) => {
  return async (networks: any[]) => {
    const results = await Promise.allSettled(
      networks.map(network => service.create(network)),
    );

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
export const generateNetworkStatusHandler = (service: any) => {
  return async (networkId: string): Promise<NetworkStatus> => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
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
export const generateNetworkHealthCheckHandler = (service: any) => {
  return async (networkId: string): Promise<NetworkHealthCheck> => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
    }

    const checks = await service.performHealthChecks(networkId);
    const issues: string[] = [];

    if (!checks.connectivity) issues.push('Connectivity issue detected');
    if (!checks.routing) issues.push('Routing configuration issue');
    if (!checks.dns) issues.push('DNS resolution failing');
    if (!checks.gateway) issues.push('Gateway unreachable');

    return {
      networkId,
      healthy: Object.values(checks).every(Boolean),
      checks,
      timestamp: new Date(),
      issues,
    };
  };
};

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
export const generateNetworkMetricsHandler = (service: any) => {
  return async (networkId: string, timeRange?: string): Promise<NetworkMetrics[]> => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
    }

    const range = timeRange || '1h';
    return await service.getMetrics(networkId, range);
  };
};

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
export const generateTriggerHealthCheckHandler = (service: any) => {
  return async (networkId: string) => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
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
export const generateNetworkUptimeHandler = (service: any) => {
  return async (networkId: string) => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
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
export const generateNetworkBandwidthHandler = (service: any) => {
  return async (networkId: string, interval = '5m') => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
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
export const generateNetworkLatencyHandler = (service: any) => {
  return async (networkId: string) => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
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
export const generateNetworkPacketStatsHandler = (service: any) => {
  return async (networkId: string) => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
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
export const generateNetworkConfigHandler = (service: any) => {
  return async (networkId: string): Promise<NetworkConfig> => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
    }

    return await service.getConfiguration(networkId);
  };
};

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
export const generateUpdateNetworkConfigHandler = (service: any) => {
  return async (networkId: string, config: Partial<NetworkConfig>) => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
    }

    // Validate configuration
    if (config.subnet && !isValidSubnet(config.subnet)) {
      throw new BadRequestException('Invalid subnet format');
    }

    if (config.gateway && !isValidIpAddress(config.gateway)) {
      throw new BadRequestException('Invalid gateway IP address');
    }

    return await service.updateConfiguration(networkId, config);
  };
};

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
export const generateApplyNetworkConfigHandler = (service: any) => {
  return async (networkId: string) => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
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
export const generateNetworkRoutesHandler = (service: any) => {
  return async (networkId: string): Promise<NetworkRoute[]> => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
    }

    return await service.getRoutes(networkId);
  };
};

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
export const generateAddNetworkRouteHandler = (service: any) => {
  return async (networkId: string, route: Partial<NetworkRoute>) => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
    }

    // Validate route
    if (!isValidSubnet(route.destination)) {
      throw new BadRequestException('Invalid destination subnet');
    }

    if (!isValidIpAddress(route.gateway)) {
      throw new BadRequestException('Invalid gateway IP address');
    }

    return await service.addRoute(networkId, route);
  };
};

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
export const generateRemoveNetworkRouteHandler = (service: any) => {
  return async (networkId: string, routeId: string) => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
    }

    const route = await service.findRoute(routeId);
    if (!route) {
      throw new NotFoundException(`Route with ID ${routeId} not found`);
    }

    return await service.removeRoute(networkId, routeId);
  };
};

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
export const generateNetworkFirewallHandler = (service: any) => {
  return async (networkId: string): Promise<NetworkFirewallRule[]> => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
    }

    return await service.getFirewallRules(networkId);
  };
};

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
export const generateAddFirewallRuleHandler = (service: any) => {
  return async (networkId: string, rule: Partial<NetworkFirewallRule>) => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
    }

    return await service.addFirewallRule(networkId, rule);
  };
};

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
export const generateMonitoringDashboardHandler = (service: any) => {
  return async (networkId: string) => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
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
export const generateNetworkAlertsHandler = (service: any) => {
  return async (networkId: string, severity?: string) => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
    }

    const filters: any = { networkId };
    if (severity) {
      filters.severity = severity;
    }

    return await service.getAlerts(filters);
  };
};

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
export const generateNetworkEventsHandler = (service: any) => {
  return async (networkId: string, query: any) => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
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
export const generateNetworkTopologyHandler = (service: any) => {
  return async (networkId: string) => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
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
export const generateNetworkConnectionsHandler = (service: any) => {
  return async (networkId: string) => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
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
export const generatePerformanceAnalyticsHandler = (service: any) => {
  return async (networkId: string, period = '24h') => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
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
export const generateCapacityPlanningHandler = (service: any) => {
  return async (networkId: string) => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
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
export const generateNetworkQoSHandler = (service: any) => {
  return async (networkId: string): Promise<NetworkQoSPolicy[]> => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
    }

    return await service.getQoSPolicies(networkId);
  };
};

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
export const generateNetworkTroubleshootHandler = (service: any) => {
  return async (networkId: string, issue: string): Promise<NetworkTroubleshootResult> => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
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
export const generateNetworkPingHandler = (service: any) => {
  return async (networkId: string, targetHost: string) => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
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
export const generateNetworkTracerouteHandler = (service: any) => {
  return async (networkId: string, targetHost: string) => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
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
export const generateNetworkDnsLookupHandler = (service: any) => {
  return async (networkId: string, hostname: string) => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
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
export const generateNetworkPortScanHandler = (service: any) => {
  return async (networkId: string, target: { host: string; ports: number[] }) => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
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
export const generateNetworkDiagnosticsHandler = (service: any) => {
  return async (networkId: string) => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
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
export const generateNetworkRestartHandler = (service: any) => {
  return async (networkId: string) => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
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
export const generateNetworkResetHandler = (service: any) => {
  return async (networkId: string, options: { clearConfig?: boolean; clearRoutes?: boolean }) => {
    const network = await service.findOne(networkId);

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
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
export const isValidIpAddress = (ip: string): boolean => {
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
export const isValidSubnet = (subnet: string): boolean => {
  const parts = subnet.split('/');
  if (parts.length !== 2) return false;

  const [ip, cidr] = parts;
  const cidrNum = parseInt(cidr, 10);

  return isValidIpAddress(ip) && cidrNum >= 0 && cidrNum <= 32;
};

export default {
  // Network CRUD Controllers
  createNetworkCrudController,
  generateNetworkListHandler,
  generateNetworkGetHandler,
  generateNetworkCreateHandler,
  generateNetworkUpdateHandler,
  generateNetworkPatchHandler,
  generateNetworkDeleteHandler,
  generateNetworkBulkCreateHandler,

  // Network Status & Health Endpoints
  generateNetworkStatusHandler,
  generateNetworkHealthCheckHandler,
  generateNetworkMetricsHandler,
  generateTriggerHealthCheckHandler,
  generateNetworkUptimeHandler,
  generateNetworkBandwidthHandler,
  generateNetworkLatencyHandler,
  generateNetworkPacketStatsHandler,

  // Network Configuration Endpoints
  generateNetworkConfigHandler,
  generateUpdateNetworkConfigHandler,
  generateApplyNetworkConfigHandler,
  generateNetworkRoutesHandler,
  generateAddNetworkRouteHandler,
  generateRemoveNetworkRouteHandler,
  generateNetworkFirewallHandler,
  generateAddFirewallRuleHandler,

  // Network Monitoring Endpoints
  generateMonitoringDashboardHandler,
  generateNetworkAlertsHandler,
  generateNetworkEventsHandler,
  generateNetworkTopologyHandler,
  generateNetworkConnectionsHandler,
  generatePerformanceAnalyticsHandler,
  generateCapacityPlanningHandler,
  generateNetworkQoSHandler,

  // Network Troubleshooting Endpoints
  generateNetworkTroubleshootHandler,
  generateNetworkPingHandler,
  generateNetworkTracerouteHandler,
  generateNetworkDnsLookupHandler,
  generateNetworkPortScanHandler,
  generateNetworkDiagnosticsHandler,
  generateNetworkRestartHandler,
  generateNetworkResetHandler,

  // Helper Functions
  isValidIpAddress,
  isValidSubnet,
};
