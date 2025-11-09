/**
 * LOC: VRTINF8765432
 * File: /reuse/virtual/virtual-infrastructure-api-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/swagger (v11.2.1)
 *   - class-validator (v0.14.2)
 *   - class-transformer (v0.5.1)
 *
 * DOWNSTREAM (imported by):
 *   - Infrastructure controller implementations
 *   - Datacenter/cluster/host management services
 *   - Capacity planning and resource scheduling systems
 */
/**
 * Infrastructure component types
 */
export declare enum InfrastructureType {
    DATACENTER = "datacenter",
    CLUSTER = "cluster",
    HOST = "host",
    RESOURCE_POOL = "resource_pool",
    DATASTORE = "datastore",
    NETWORK = "network"
}
/**
 * Host power states
 */
export declare enum HostPowerState {
    POWERED_ON = "powered_on",
    POWERED_OFF = "powered_off",
    STANDBY = "standby",
    MAINTENANCE = "maintenance",
    UNKNOWN = "unknown"
}
/**
 * Cluster HA (High Availability) modes
 */
export declare enum HAMode {
    DISABLED = "disabled",
    ENABLED = "enabled",
    FULLY_AUTOMATED = "fully_automated"
}
/**
 * Cluster DRS (Distributed Resource Scheduler) modes
 */
export declare enum DRSMode {
    DISABLED = "disabled",
    MANUAL = "manual",
    PARTIALLY_AUTOMATED = "partially_automated",
    FULLY_AUTOMATED = "fully_automated"
}
/**
 * Host connection states
 */
export declare enum HostConnectionState {
    CONNECTED = "connected",
    DISCONNECTED = "disconnected",
    NOT_RESPONDING = "not_responding"
}
/**
 * Alarm severity levels
 */
export declare enum AlarmSeverity {
    CRITICAL = "critical",
    WARNING = "warning",
    INFO = "info"
}
/**
 * Capacity planning threshold types
 */
export declare enum ThresholdType {
    CPU = "cpu",
    MEMORY = "memory",
    STORAGE = "storage",
    NETWORK = "network"
}
/**
 * Maintenance mode types
 */
export declare enum MaintenanceMode {
    ENTER = "enter",
    EXIT = "exit"
}
/**
 * DTO for creating datacenter
 */
export declare class CreateDatacenterDto {
    name: string;
    description?: string;
    location?: string;
    tags?: string[];
    metadata?: Record<string, any>;
    regionId?: string;
    enabled?: boolean;
}
/**
 * DTO for creating cluster
 */
export declare class CreateClusterDto {
    name: string;
    description?: string;
    datacenterId: string;
    drsMode?: DRSMode;
    haMode?: HAMode;
    haAdmissionControlFailoverLevel?: number;
    vSanEnabled?: boolean;
    evrsEnabled?: boolean;
    tags?: string[];
    metadata?: Record<string, any>;
}
/**
 * DTO for adding host to infrastructure
 */
export declare class AddHostDto {
    name: string;
    ipAddress: string;
    hostname?: string;
    clusterId?: string;
    datacenterId?: string;
    username: string;
    password: string;
    cpuCores?: number;
    memoryMB?: number;
    sslVerify?: boolean;
    tags?: string[];
    metadata?: Record<string, any>;
}
/**
 * DTO for updating cluster DRS settings
 */
export declare class UpdateClusterDRSDto {
    drsMode: DRSMode;
    migrationThreshold?: number;
    vmDistribution?: boolean;
    memoryMetricForPlacement?: boolean;
    cpuOverCommitRatio?: number;
    memoryOverCommitRatio?: number;
}
/**
 * DTO for updating cluster HA settings
 */
export declare class UpdateClusterHADto {
    haMode: HAMode;
    failoverLevel?: number;
    admissionControlEnabled?: boolean;
    admissionControlPolicy?: 'failover-hosts' | 'percentage' | 'slot';
    admissionControlPercentage?: number;
    vmMonitoring?: boolean;
    vmMonitoringSensitivity?: number;
    hostMonitoring?: boolean;
}
/**
 * DTO for resource pool configuration
 */
export declare class CreateResourcePoolDto {
    name: string;
    description?: string;
    clusterId: string;
    parentPoolId?: string;
    cpuShares?: number;
    cpuReservationMHz?: number;
    cpuLimitMHz?: number;
    memorySharesMB?: number;
    memoryReservationMB?: number;
    memoryLimitMB?: number;
    expandableReservation?: boolean;
}
/**
 * DTO for capacity planning thresholds
 */
export declare class CapacityThresholdDto {
    thresholdType: ThresholdType;
    warningThreshold: number;
    criticalThreshold: number;
    enabled?: boolean;
    notificationEmail?: string;
}
/**
 * DTO for host maintenance mode
 */
export declare class HostMaintenanceModeDto {
    mode: MaintenanceMode;
    timeoutSeconds?: number;
    evacuatePoweredOffVMs?: boolean;
    reason?: string;
}
/**
 * DTO for DRS recommendation
 */
export declare class DRSRecommendationDto {
    vmId: string;
    sourceHostId: string;
    targetHostId: string;
    reason: string;
    priority: number;
    expectedImprovement: number;
}
export interface DatacenterResponse {
    id: string;
    name: string;
    description?: string;
    location?: string;
    regionId?: string;
    enabled: boolean;
    tags: string[];
    metadata: Record<string, any>;
    statistics: {
        totalClusters: number;
        totalHosts: number;
        totalVMs: number;
        totalCpuCores: number;
        totalMemoryMB: number;
        totalStorageGB: number;
    };
    createdAt: Date;
    updatedAt: Date;
}
export interface ClusterResponse {
    id: string;
    name: string;
    description?: string;
    datacenterId: string;
    drsMode: DRSMode;
    haMode: HAMode;
    vSanEnabled: boolean;
    evrsEnabled: boolean;
    tags: string[];
    metadata: Record<string, any>;
    statistics: {
        totalHosts: number;
        totalVMs: number;
        cpuCores: number;
        memoryMB: number;
        usedCpuPercent: number;
        usedMemoryPercent: number;
    };
    health: {
        status: 'healthy' | 'warning' | 'critical';
        issues: string[];
    };
    createdAt: Date;
    updatedAt: Date;
}
export interface HostResponse {
    id: string;
    name: string;
    hostname?: string;
    ipAddress: string;
    clusterId?: string;
    datacenterId?: string;
    powerState: HostPowerState;
    connectionState: HostConnectionState;
    maintenanceMode: boolean;
    cpuCores: number;
    cpuMHz: number;
    memoryMB: number;
    tags: string[];
    metadata: Record<string, any>;
    statistics: {
        runningVMs: number;
        usedCpuPercent: number;
        usedMemoryPercent: number;
        networkThroughputMBps: number;
        uptime: number;
    };
    version: {
        productName: string;
        productVersion: string;
        buildNumber: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
export interface CapacityForecastResponse {
    resourceType: string;
    currentUsage: number;
    currentCapacity: number;
    utilizationPercent: number;
    forecast: Array<{
        date: Date;
        projectedUsage: number;
        projectedUtilization: number;
    }>;
    recommendations: string[];
    timeToExhaustion?: Date;
}
export interface InfrastructureHealthResponse {
    overallStatus: 'healthy' | 'warning' | 'critical';
    datacenters: Array<{
        id: string;
        name: string;
        status: string;
        issueCount: number;
    }>;
    clusters: Array<{
        id: string;
        name: string;
        status: string;
        issueCount: number;
    }>;
    hosts: Array<{
        id: string;
        name: string;
        status: string;
        issueCount: number;
    }>;
    activeAlarms: number;
    criticalAlarms: number;
    warningAlarms: number;
    lastChecked: Date;
}
/**
 * Custom decorator for infrastructure audit logging
 *
 * @param {string} action - Action being performed
 * @returns {MethodDecorator} Audit decorator
 *
 * @example
 * ```typescript
 * @Post('datacenters')
 * @InfrastructureAudit('CREATE_DATACENTER')
 * async createDatacenter(@Body() dto: CreateDatacenterDto) {
 *   // Automatically logged for compliance
 * }
 * ```
 */
export declare function InfrastructureAudit(action: string): MethodDecorator;
/**
 * Decorator for infrastructure admin permissions
 *
 * @returns {MethodDecorator} Admin permission decorator
 *
 * @example
 * ```typescript
 * @Delete('hosts/:id')
 * @RequireInfrastructureAdmin()
 * async deleteHost(@Param('id') id: string) {
 *   return this.service.deleteHost(id);
 * }
 * ```
 */
export declare function RequireInfrastructureAdmin(): MethodDecorator;
/**
 * Creates decorator for creating datacenter endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('datacenters')
 * @CreateDatacenterDecorators()
 * async createDatacenter(@Body() dto: CreateDatacenterDto) {
 *   return this.infraService.createDatacenter(dto);
 * }
 * ```
 */
export declare function CreateDatacenterDecorators(): MethodDecorator;
/**
 * Creates decorator for listing datacenters endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('datacenters')
 * @ListDatacentersDecorators()
 * async listDatacenters(@Query('page') page: number, @Query('limit') limit: number) {
 *   return this.infraService.listDatacenters({ page, limit });
 * }
 * ```
 */
export declare function ListDatacentersDecorators(): MethodDecorator;
/**
 * Creates decorator for getting datacenter details endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('datacenters/:id')
 * @GetDatacenterDecorators()
 * async getDatacenter(@Param('id', ParseUUIDPipe) id: string) {
 *   return this.infraService.getDatacenter(id);
 * }
 * ```
 */
export declare function GetDatacenterDecorators(): MethodDecorator;
/**
 * Creates decorator for updating datacenter endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Patch('datacenters/:id')
 * @UpdateDatacenterDecorators()
 * async updateDatacenter(@Param('id') id: string, @Body() dto: any) {
 *   return this.infraService.updateDatacenter(id, dto);
 * }
 * ```
 */
export declare function UpdateDatacenterDecorators(): MethodDecorator;
/**
 * Creates decorator for deleting datacenter endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Delete('datacenters/:id')
 * @DeleteDatacenterDecorators()
 * async deleteDatacenter(@Param('id') id: string, @Query('force') force: boolean) {
 *   return this.infraService.deleteDatacenter(id, force);
 * }
 * ```
 */
export declare function DeleteDatacenterDecorators(): MethodDecorator;
/**
 * Creates decorator for creating cluster endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('clusters')
 * @CreateClusterDecorators()
 * async createCluster(@Body() dto: CreateClusterDto) {
 *   return this.infraService.createCluster(dto);
 * }
 * ```
 */
export declare function CreateClusterDecorators(): MethodDecorator;
/**
 * Creates decorator for listing clusters endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('clusters')
 * @ListClustersDecorators()
 * async listClusters(@Query() query: any) {
 *   return this.infraService.listClusters(query);
 * }
 * ```
 */
export declare function ListClustersDecorators(): MethodDecorator;
/**
 * Creates decorator for getting cluster details endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('clusters/:id')
 * @GetClusterDecorators()
 * async getCluster(@Param('id', ParseUUIDPipe) id: string) {
 *   return this.infraService.getCluster(id);
 * }
 * ```
 */
export declare function GetClusterDecorators(): MethodDecorator;
/**
 * Creates decorator for updating cluster DRS settings endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Put('clusters/:id/drs')
 * @UpdateClusterDRSDecorators()
 * async updateDRS(@Param('id') id: string, @Body() dto: UpdateClusterDRSDto) {
 *   return this.infraService.updateClusterDRS(id, dto);
 * }
 * ```
 */
export declare function UpdateClusterDRSDecorators(): MethodDecorator;
/**
 * Creates decorator for updating cluster HA settings endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Put('clusters/:id/ha')
 * @UpdateClusterHADecorators()
 * async updateHA(@Param('id') id: string, @Body() dto: UpdateClusterHADto) {
 *   return this.infraService.updateClusterHA(id, dto);
 * }
 * ```
 */
export declare function UpdateClusterHADecorators(): MethodDecorator;
/**
 * Creates decorator for getting cluster recommendations endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('clusters/:id/recommendations')
 * @GetClusterRecommendationsDecorators()
 * async getRecommendations(@Param('id') id: string) {
 *   return this.infraService.getClusterRecommendations(id);
 * }
 * ```
 */
export declare function GetClusterRecommendationsDecorators(): MethodDecorator;
/**
 * Creates decorator for applying DRS recommendation endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('clusters/:id/recommendations/:recommendationId/apply')
 * @ApplyDRSRecommendationDecorators()
 * async applyRecommendation(@Param('id') id: string, @Param('recommendationId') recId: string) {
 *   return this.infraService.applyDRSRecommendation(id, recId);
 * }
 * ```
 */
export declare function ApplyDRSRecommendationDecorators(): MethodDecorator;
/**
 * Creates decorator for adding host endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('hosts')
 * @AddHostDecorators()
 * async addHost(@Body() dto: AddHostDto) {
 *   return this.infraService.addHost(dto);
 * }
 * ```
 */
export declare function AddHostDecorators(): MethodDecorator;
/**
 * Creates decorator for listing hosts endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('hosts')
 * @ListHostsDecorators()
 * async listHosts(@Query() query: any) {
 *   return this.infraService.listHosts(query);
 * }
 * ```
 */
export declare function ListHostsDecorators(): MethodDecorator;
/**
 * Creates decorator for getting host details endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('hosts/:id')
 * @GetHostDecorators()
 * async getHost(@Param('id', ParseUUIDPipe) id: string) {
 *   return this.infraService.getHost(id);
 * }
 * ```
 */
export declare function GetHostDecorators(): MethodDecorator;
/**
 * Creates decorator for removing host endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Delete('hosts/:id')
 * @RemoveHostDecorators()
 * async removeHost(@Param('id') id: string, @Query('force') force: boolean) {
 *   return this.infraService.removeHost(id, force);
 * }
 * ```
 */
export declare function RemoveHostDecorators(): MethodDecorator;
/**
 * Creates decorator for host maintenance mode endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('hosts/:id/maintenance')
 * @HostMaintenanceModeDecorators()
 * async setMaintenanceMode(@Param('id') id: string, @Body() dto: HostMaintenanceModeDto) {
 *   return this.infraService.setHostMaintenanceMode(id, dto);
 * }
 * ```
 */
export declare function HostMaintenanceModeDecorators(): MethodDecorator;
/**
 * Creates decorator for host power control endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('hosts/:id/power')
 * @HostPowerControlDecorators()
 * async controlHostPower(@Param('id') id: string, @Body() dto: { action: string }) {
 *   return this.infraService.controlHostPower(id, dto.action);
 * }
 * ```
 */
export declare function HostPowerControlDecorators(): MethodDecorator;
/**
 * Creates decorator for reconnecting host endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('hosts/:id/reconnect')
 * @ReconnectHostDecorators()
 * async reconnectHost(@Param('id') id: string) {
 *   return this.infraService.reconnectHost(id);
 * }
 * ```
 */
export declare function ReconnectHostDecorators(): MethodDecorator;
/**
 * Creates decorator for creating resource pool endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('resource-pools')
 * @CreateResourcePoolDecorators()
 * async createResourcePool(@Body() dto: CreateResourcePoolDto) {
 *   return this.infraService.createResourcePool(dto);
 * }
 * ```
 */
export declare function CreateResourcePoolDecorators(): MethodDecorator;
/**
 * Creates decorator for listing resource pools endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('resource-pools')
 * @ListResourcePoolsDecorators()
 * async listResourcePools(@Query() query: any) {
 *   return this.infraService.listResourcePools(query);
 * }
 * ```
 */
export declare function ListResourcePoolsDecorators(): MethodDecorator;
/**
 * Creates decorator for updating resource pool endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Patch('resource-pools/:id')
 * @UpdateResourcePoolDecorators()
 * async updateResourcePool(@Param('id') id: string, @Body() dto: any) {
 *   return this.infraService.updateResourcePool(id, dto);
 * }
 * ```
 */
export declare function UpdateResourcePoolDecorators(): MethodDecorator;
/**
 * Creates decorator for deleting resource pool endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Delete('resource-pools/:id')
 * @DeleteResourcePoolDecorators()
 * async deleteResourcePool(@Param('id') id: string) {
 *   return this.infraService.deleteResourcePool(id);
 * }
 * ```
 */
export declare function DeleteResourcePoolDecorators(): MethodDecorator;
/**
 * Creates decorator for getting capacity overview endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('capacity/overview')
 * @GetCapacityOverviewDecorators()
 * async getCapacityOverview(@Query('datacenterId') datacenterId?: string) {
 *   return this.infraService.getCapacityOverview(datacenterId);
 * }
 * ```
 */
export declare function GetCapacityOverviewDecorators(): MethodDecorator;
/**
 * Creates decorator for getting capacity forecast endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('capacity/forecast')
 * @GetCapacityForecastDecorators()
 * async getCapacityForecast(@Query() query: any) {
 *   return this.infraService.getCapacityForecast(query);
 * }
 * ```
 */
export declare function GetCapacityForecastDecorators(): MethodDecorator;
/**
 * Creates decorator for setting capacity thresholds endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('capacity/thresholds')
 * @SetCapacityThresholdsDecorators()
 * async setThresholds(@Body() dto: CapacityThresholdDto) {
 *   return this.infraService.setCapacityThresholds(dto);
 * }
 * ```
 */
export declare function SetCapacityThresholdsDecorators(): MethodDecorator;
/**
 * Creates decorator for getting capacity recommendations endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('capacity/recommendations')
 * @GetCapacityRecommendationsDecorators()
 * async getCapacityRecommendations() {
 *   return this.infraService.getCapacityRecommendations();
 * }
 * ```
 */
export declare function GetCapacityRecommendationsDecorators(): MethodDecorator;
/**
 * Creates decorator for getting infrastructure health endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('health')
 * @GetInfrastructureHealthDecorators()
 * async getHealth() {
 *   return this.infraService.getInfrastructureHealth();
 * }
 * ```
 */
export declare function GetInfrastructureHealthDecorators(): MethodDecorator;
/**
 * Creates decorator for listing alarms endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('alarms')
 * @ListAlarmsDecorators()
 * async listAlarms(@Query() query: any) {
 *   return this.infraService.listAlarms(query);
 * }
 * ```
 */
export declare function ListAlarmsDecorators(): MethodDecorator;
/**
 * Creates decorator for acknowledging alarm endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('alarms/:id/acknowledge')
 * @AcknowledgeAlarmDecorators()
 * async acknowledgeAlarm(@Param('id') id: string, @Body() dto: { comment: string }) {
 *   return this.infraService.acknowledgeAlarm(id, dto.comment);
 * }
 * ```
 */
export declare function AcknowledgeAlarmDecorators(): MethodDecorator;
/**
 * Creates decorator for getting infrastructure metrics endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('metrics')
 * @GetInfrastructureMetricsDecorators()
 * async getMetrics(@Query() query: any) {
 *   return this.infraService.getInfrastructureMetrics(query);
 * }
 * ```
 */
export declare function GetInfrastructureMetricsDecorators(): MethodDecorator;
/**
 * Creates decorator for optimizing cluster placement endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('clusters/:id/optimize')
 * @OptimizeClusterPlacementDecorators()
 * async optimizeCluster(@Param('id') id: string) {
 *   return this.infraService.optimizeClusterPlacement(id);
 * }
 * ```
 */
export declare function OptimizeClusterPlacementDecorators(): MethodDecorator;
/**
 * Creates decorator for simulating workload placement endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('capacity/simulate')
 * @SimulateWorkloadPlacementDecorators()
 * async simulatePlacement(@Body() dto: any) {
 *   return this.infraService.simulateWorkloadPlacement(dto);
 * }
 * ```
 */
export declare function SimulateWorkloadPlacementDecorators(): MethodDecorator;
/**
 * Creates decorator for getting host performance metrics endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('hosts/:id/performance')
 * @GetHostPerformanceDecorators()
 * async getHostPerformance(@Param('id') id: string, @Query() query: any) {
 *   return this.infraService.getHostPerformance(id, query);
 * }
 * ```
 */
export declare function GetHostPerformanceDecorators(): MethodDecorator;
/**
 * Creates decorator for updating host configuration endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Patch('hosts/:id/config')
 * @UpdateHostConfigDecorators()
 * async updateHostConfig(@Param('id') id: string, @Body() dto: any) {
 *   return this.infraService.updateHostConfig(id, dto);
 * }
 * ```
 */
export declare function UpdateHostConfigDecorators(): MethodDecorator;
/**
 * Creates decorator for exporting infrastructure report endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('reports/export')
 * @ExportInfrastructureReportDecorators()
 * async exportReport(@Body() dto: any) {
 *   return this.infraService.exportInfrastructureReport(dto);
 * }
 * ```
 */
export declare function ExportInfrastructureReportDecorators(): MethodDecorator;
declare const _default: {
    CreateDatacenterDecorators: typeof CreateDatacenterDecorators;
    ListDatacentersDecorators: typeof ListDatacentersDecorators;
    GetDatacenterDecorators: typeof GetDatacenterDecorators;
    UpdateDatacenterDecorators: typeof UpdateDatacenterDecorators;
    DeleteDatacenterDecorators: typeof DeleteDatacenterDecorators;
    CreateClusterDecorators: typeof CreateClusterDecorators;
    ListClustersDecorators: typeof ListClustersDecorators;
    GetClusterDecorators: typeof GetClusterDecorators;
    UpdateClusterDRSDecorators: typeof UpdateClusterDRSDecorators;
    UpdateClusterHADecorators: typeof UpdateClusterHADecorators;
    GetClusterRecommendationsDecorators: typeof GetClusterRecommendationsDecorators;
    ApplyDRSRecommendationDecorators: typeof ApplyDRSRecommendationDecorators;
    AddHostDecorators: typeof AddHostDecorators;
    ListHostsDecorators: typeof ListHostsDecorators;
    GetHostDecorators: typeof GetHostDecorators;
    RemoveHostDecorators: typeof RemoveHostDecorators;
    HostMaintenanceModeDecorators: typeof HostMaintenanceModeDecorators;
    HostPowerControlDecorators: typeof HostPowerControlDecorators;
    ReconnectHostDecorators: typeof ReconnectHostDecorators;
    CreateResourcePoolDecorators: typeof CreateResourcePoolDecorators;
    ListResourcePoolsDecorators: typeof ListResourcePoolsDecorators;
    UpdateResourcePoolDecorators: typeof UpdateResourcePoolDecorators;
    DeleteResourcePoolDecorators: typeof DeleteResourcePoolDecorators;
    GetCapacityOverviewDecorators: typeof GetCapacityOverviewDecorators;
    GetCapacityForecastDecorators: typeof GetCapacityForecastDecorators;
    SetCapacityThresholdsDecorators: typeof SetCapacityThresholdsDecorators;
    GetCapacityRecommendationsDecorators: typeof GetCapacityRecommendationsDecorators;
    GetInfrastructureHealthDecorators: typeof GetInfrastructureHealthDecorators;
    ListAlarmsDecorators: typeof ListAlarmsDecorators;
    AcknowledgeAlarmDecorators: typeof AcknowledgeAlarmDecorators;
    GetInfrastructureMetricsDecorators: typeof GetInfrastructureMetricsDecorators;
    OptimizeClusterPlacementDecorators: typeof OptimizeClusterPlacementDecorators;
    SimulateWorkloadPlacementDecorators: typeof SimulateWorkloadPlacementDecorators;
    GetHostPerformanceDecorators: typeof GetHostPerformanceDecorators;
    UpdateHostConfigDecorators: typeof UpdateHostConfigDecorators;
    ExportInfrastructureReportDecorators: typeof ExportInfrastructureReportDecorators;
    InfrastructureAudit: typeof InfrastructureAudit;
    RequireInfrastructureAdmin: typeof RequireInfrastructureAdmin;
    CreateDatacenterDto: typeof CreateDatacenterDto;
    CreateClusterDto: typeof CreateClusterDto;
    AddHostDto: typeof AddHostDto;
    UpdateClusterDRSDto: typeof UpdateClusterDRSDto;
    UpdateClusterHADto: typeof UpdateClusterHADto;
    CreateResourcePoolDto: typeof CreateResourcePoolDto;
    CapacityThresholdDto: typeof CapacityThresholdDto;
    HostMaintenanceModeDto: typeof HostMaintenanceModeDto;
    DRSRecommendationDto: typeof DRSRecommendationDto;
    InfrastructureType: typeof InfrastructureType;
    HostPowerState: typeof HostPowerState;
    HAMode: typeof HAMode;
    DRSMode: typeof DRSMode;
    HostConnectionState: typeof HostConnectionState;
    AlarmSeverity: typeof AlarmSeverity;
    ThresholdType: typeof ThresholdType;
    MaintenanceMode: typeof MaintenanceMode;
};
export default _default;
//# sourceMappingURL=virtual-infrastructure-api-kit.d.ts.map