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
export declare const createNetworkCrudController: (basePath: string, tag: string) => any;
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
export declare const generateNetworkListHandler: (service: any) => (page: number, limit: number, filters: any) => Promise<{
    data: any;
    pagination: {
        page: number;
        limit: number;
        total: any;
    };
}>;
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
export declare const generateNetworkGetHandler: (service: any) => (networkId: string) => Promise<any>;
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
export declare const generateNetworkCreateHandler: (service: any, validator?: Function) => (createDto: any) => Promise<any>;
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
export declare const generateNetworkUpdateHandler: (service: any) => (networkId: string, updateDto: any) => Promise<any>;
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
export declare const generateNetworkPatchHandler: (service: any) => (networkId: string, patchDto: any) => Promise<any>;
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
export declare const generateNetworkDeleteHandler: (service: any, softDelete?: boolean) => (networkId: string) => Promise<any>;
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
export declare const generateNetworkBulkCreateHandler: (service: any) => (networks: any[]) => Promise<{
    success: number;
    failed: number;
    results: {
        index: number;
        success: boolean;
        data: any;
        error: any;
    }[];
}>;
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
export declare const generateNetworkStatusHandler: (service: any) => (networkId: string) => Promise<NetworkStatus>;
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
export declare const generateNetworkHealthCheckHandler: (service: any) => (networkId: string) => Promise<NetworkHealthCheck>;
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
export declare const generateNetworkMetricsHandler: (service: any) => (networkId: string, timeRange?: string) => Promise<NetworkMetrics[]>;
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
export declare const generateTriggerHealthCheckHandler: (service: any) => (networkId: string) => Promise<{
    networkId: string;
    checkId: any;
    status: string;
    message: string;
}>;
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
export declare const generateNetworkUptimeHandler: (service: any) => (networkId: string) => Promise<{
    networkId: string;
    currentUptime: any;
    uptimePercentage: any;
    downtime: any;
    lastIncident: any;
    mtbf: any;
    mttr: any;
}>;
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
export declare const generateNetworkBandwidthHandler: (service: any) => (networkId: string, interval?: string) => Promise<{
    networkId: string;
    interval: string;
    data: any;
    average: {
        rx: number;
        tx: number;
    };
    peak: {
        rx: number;
        tx: number;
    };
}>;
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
export declare const generateNetworkLatencyHandler: (service: any) => (networkId: string) => Promise<{
    networkId: string;
    current: any;
    average: any;
    min: any;
    max: any;
    p50: any;
    p95: any;
    p99: any;
    unit: string;
    timestamp: Date;
}>;
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
export declare const generateNetworkPacketStatsHandler: (service: any) => (networkId: string) => Promise<{
    networkId: string;
    packets: {
        rx: any;
        tx: any;
        dropped: any;
        errors: any;
    };
    rates: {
        rxRate: any;
        txRate: any;
        dropRate: any;
        errorRate: any;
    };
    dropReasons: any;
    errorTypes: any;
    timestamp: Date;
}>;
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
export declare const generateNetworkConfigHandler: (service: any) => (networkId: string) => Promise<NetworkConfig>;
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
export declare const generateUpdateNetworkConfigHandler: (service: any) => (networkId: string, config: Partial<NetworkConfig>) => Promise<any>;
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
export declare const generateApplyNetworkConfigHandler: (service: any) => (networkId: string) => Promise<{
    networkId: string;
    applied: any;
    changes: any;
    errors: any;
    timestamp: Date;
}>;
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
export declare const generateNetworkRoutesHandler: (service: any) => (networkId: string) => Promise<NetworkRoute[]>;
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
export declare const generateAddNetworkRouteHandler: (service: any) => (networkId: string, route: Partial<NetworkRoute>) => Promise<any>;
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
export declare const generateRemoveNetworkRouteHandler: (service: any) => (networkId: string, routeId: string) => Promise<any>;
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
export declare const generateNetworkFirewallHandler: (service: any) => (networkId: string) => Promise<NetworkFirewallRule[]>;
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
export declare const generateAddFirewallRuleHandler: (service: any) => (networkId: string, rule: Partial<NetworkFirewallRule>) => Promise<any>;
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
export declare const generateMonitoringDashboardHandler: (service: any) => (networkId: string) => Promise<{
    networkId: string;
    overview: {
        status: string;
        health: string;
        uptime: any;
        connectedDevices: any;
    };
    metrics: {
        bandwidth: any;
        latency: any;
        packetLoss: any;
        throughput: any;
    };
    recentBandwidth: any;
    alerts: any;
    timestamp: Date;
}>;
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
export declare const generateNetworkAlertsHandler: (service: any) => (networkId: string, severity?: string) => Promise<any>;
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
export declare const generateNetworkEventsHandler: (service: any) => (networkId: string, query: any) => Promise<any>;
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
export declare const generateNetworkTopologyHandler: (service: any) => (networkId: string) => Promise<{
    networkId: string;
    nodes: any;
    edges: any;
    layout: any;
}>;
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
export declare const generateNetworkConnectionsHandler: (service: any) => (networkId: string) => Promise<{
    networkId: string;
    totalConnections: any;
    activeConnections: any;
    connections: any;
}>;
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
export declare const generatePerformanceAnalyticsHandler: (service: any) => (networkId: string, period?: string) => Promise<{
    networkId: string;
    period: string;
    summary: {
        avgLatency: any;
        maxLatency: any;
        minLatency: any;
        avgBandwidth: any;
        peakBandwidth: any;
        packetLossRate: any;
        errorRate: any;
    };
    trends: any;
    anomalies: any;
    recommendations: any;
}>;
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
export declare const generateCapacityPlanningHandler: (service: any) => (networkId: string) => Promise<{
    networkId: string;
    current: {
        utilization: any;
        availableCapacity: any;
        connectedDevices: any;
        maxDevices: any;
    };
    forecast: {
        nextMonth: any;
        nextQuarter: any;
        exhaustionDate: any;
    };
    recommendations: any;
}>;
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
export declare const generateNetworkQoSHandler: (service: any) => (networkId: string) => Promise<NetworkQoSPolicy[]>;
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
export declare const generateNetworkTroubleshootHandler: (service: any) => (networkId: string, issue: string) => Promise<NetworkTroubleshootResult>;
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
export declare const generateNetworkPingHandler: (service: any) => (networkId: string, targetHost: string) => Promise<{
    networkId: string;
    target: string;
    reachable: any;
    latency: any;
    packetLoss: any;
    ttl: any;
    timestamp: Date;
}>;
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
export declare const generateNetworkTracerouteHandler: (service: any) => (networkId: string, targetHost: string) => Promise<{
    networkId: string;
    target: string;
    hops: any;
    totalHops: any;
    reachable: any;
    timestamp: Date;
}>;
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
export declare const generateNetworkDnsLookupHandler: (service: any) => (networkId: string, hostname: string) => Promise<{
    networkId: string;
    hostname: string;
    resolved: any;
    addresses: any;
    ttl: any;
    timestamp: Date;
}>;
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
export declare const generateNetworkPortScanHandler: (service: any) => (networkId: string, target: {
    host: string;
    ports: number[];
}) => Promise<{
    networkId: string;
    target: string;
    ports: any;
    timestamp: Date;
}>;
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
export declare const generateNetworkDiagnosticsHandler: (service: any) => (networkId: string) => Promise<{
    networkId: string;
    overall: any;
    connectivity: any;
    routing: any;
    dns: any;
    performance: any;
    security: any;
    recommendations: any;
    timestamp: Date;
}>;
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
export declare const generateNetworkRestartHandler: (service: any) => (networkId: string) => Promise<{
    networkId: string;
    success: any;
    message: any;
    downtime: any;
    timestamp: Date;
}>;
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
export declare const generateNetworkResetHandler: (service: any) => (networkId: string, options: {
    clearConfig?: boolean;
    clearRoutes?: boolean;
}) => Promise<{
    networkId: string;
    success: any;
    clearedComponents: any;
    message: any;
    timestamp: Date;
}>;
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
export declare const isValidIpAddress: (ip: string) => boolean;
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
export declare const isValidSubnet: (subnet: string) => boolean;
declare const _default: {
    createNetworkCrudController: (basePath: string, tag: string) => any;
    generateNetworkListHandler: (service: any) => (page: number, limit: number, filters: any) => Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
        };
    }>;
    generateNetworkGetHandler: (service: any) => (networkId: string) => Promise<any>;
    generateNetworkCreateHandler: (service: any, validator?: Function) => (createDto: any) => Promise<any>;
    generateNetworkUpdateHandler: (service: any) => (networkId: string, updateDto: any) => Promise<any>;
    generateNetworkPatchHandler: (service: any) => (networkId: string, patchDto: any) => Promise<any>;
    generateNetworkDeleteHandler: (service: any, softDelete?: boolean) => (networkId: string) => Promise<any>;
    generateNetworkBulkCreateHandler: (service: any) => (networks: any[]) => Promise<{
        success: number;
        failed: number;
        results: {
            index: number;
            success: boolean;
            data: any;
            error: any;
        }[];
    }>;
    generateNetworkStatusHandler: (service: any) => (networkId: string) => Promise<NetworkStatus>;
    generateNetworkHealthCheckHandler: (service: any) => (networkId: string) => Promise<NetworkHealthCheck>;
    generateNetworkMetricsHandler: (service: any) => (networkId: string, timeRange?: string) => Promise<NetworkMetrics[]>;
    generateTriggerHealthCheckHandler: (service: any) => (networkId: string) => Promise<{
        networkId: string;
        checkId: any;
        status: string;
        message: string;
    }>;
    generateNetworkUptimeHandler: (service: any) => (networkId: string) => Promise<{
        networkId: string;
        currentUptime: any;
        uptimePercentage: any;
        downtime: any;
        lastIncident: any;
        mtbf: any;
        mttr: any;
    }>;
    generateNetworkBandwidthHandler: (service: any) => (networkId: string, interval?: string) => Promise<{
        networkId: string;
        interval: string;
        data: any;
        average: {
            rx: number;
            tx: number;
        };
        peak: {
            rx: number;
            tx: number;
        };
    }>;
    generateNetworkLatencyHandler: (service: any) => (networkId: string) => Promise<{
        networkId: string;
        current: any;
        average: any;
        min: any;
        max: any;
        p50: any;
        p95: any;
        p99: any;
        unit: string;
        timestamp: Date;
    }>;
    generateNetworkPacketStatsHandler: (service: any) => (networkId: string) => Promise<{
        networkId: string;
        packets: {
            rx: any;
            tx: any;
            dropped: any;
            errors: any;
        };
        rates: {
            rxRate: any;
            txRate: any;
            dropRate: any;
            errorRate: any;
        };
        dropReasons: any;
        errorTypes: any;
        timestamp: Date;
    }>;
    generateNetworkConfigHandler: (service: any) => (networkId: string) => Promise<NetworkConfig>;
    generateUpdateNetworkConfigHandler: (service: any) => (networkId: string, config: Partial<NetworkConfig>) => Promise<any>;
    generateApplyNetworkConfigHandler: (service: any) => (networkId: string) => Promise<{
        networkId: string;
        applied: any;
        changes: any;
        errors: any;
        timestamp: Date;
    }>;
    generateNetworkRoutesHandler: (service: any) => (networkId: string) => Promise<NetworkRoute[]>;
    generateAddNetworkRouteHandler: (service: any) => (networkId: string, route: Partial<NetworkRoute>) => Promise<any>;
    generateRemoveNetworkRouteHandler: (service: any) => (networkId: string, routeId: string) => Promise<any>;
    generateNetworkFirewallHandler: (service: any) => (networkId: string) => Promise<NetworkFirewallRule[]>;
    generateAddFirewallRuleHandler: (service: any) => (networkId: string, rule: Partial<NetworkFirewallRule>) => Promise<any>;
    generateMonitoringDashboardHandler: (service: any) => (networkId: string) => Promise<{
        networkId: string;
        overview: {
            status: string;
            health: string;
            uptime: any;
            connectedDevices: any;
        };
        metrics: {
            bandwidth: any;
            latency: any;
            packetLoss: any;
            throughput: any;
        };
        recentBandwidth: any;
        alerts: any;
        timestamp: Date;
    }>;
    generateNetworkAlertsHandler: (service: any) => (networkId: string, severity?: string) => Promise<any>;
    generateNetworkEventsHandler: (service: any) => (networkId: string, query: any) => Promise<any>;
    generateNetworkTopologyHandler: (service: any) => (networkId: string) => Promise<{
        networkId: string;
        nodes: any;
        edges: any;
        layout: any;
    }>;
    generateNetworkConnectionsHandler: (service: any) => (networkId: string) => Promise<{
        networkId: string;
        totalConnections: any;
        activeConnections: any;
        connections: any;
    }>;
    generatePerformanceAnalyticsHandler: (service: any) => (networkId: string, period?: string) => Promise<{
        networkId: string;
        period: string;
        summary: {
            avgLatency: any;
            maxLatency: any;
            minLatency: any;
            avgBandwidth: any;
            peakBandwidth: any;
            packetLossRate: any;
            errorRate: any;
        };
        trends: any;
        anomalies: any;
        recommendations: any;
    }>;
    generateCapacityPlanningHandler: (service: any) => (networkId: string) => Promise<{
        networkId: string;
        current: {
            utilization: any;
            availableCapacity: any;
            connectedDevices: any;
            maxDevices: any;
        };
        forecast: {
            nextMonth: any;
            nextQuarter: any;
            exhaustionDate: any;
        };
        recommendations: any;
    }>;
    generateNetworkQoSHandler: (service: any) => (networkId: string) => Promise<NetworkQoSPolicy[]>;
    generateNetworkTroubleshootHandler: (service: any) => (networkId: string, issue: string) => Promise<NetworkTroubleshootResult>;
    generateNetworkPingHandler: (service: any) => (networkId: string, targetHost: string) => Promise<{
        networkId: string;
        target: string;
        reachable: any;
        latency: any;
        packetLoss: any;
        ttl: any;
        timestamp: Date;
    }>;
    generateNetworkTracerouteHandler: (service: any) => (networkId: string, targetHost: string) => Promise<{
        networkId: string;
        target: string;
        hops: any;
        totalHops: any;
        reachable: any;
        timestamp: Date;
    }>;
    generateNetworkDnsLookupHandler: (service: any) => (networkId: string, hostname: string) => Promise<{
        networkId: string;
        hostname: string;
        resolved: any;
        addresses: any;
        ttl: any;
        timestamp: Date;
    }>;
    generateNetworkPortScanHandler: (service: any) => (networkId: string, target: {
        host: string;
        ports: number[];
    }) => Promise<{
        networkId: string;
        target: string;
        ports: any;
        timestamp: Date;
    }>;
    generateNetworkDiagnosticsHandler: (service: any) => (networkId: string) => Promise<{
        networkId: string;
        overall: any;
        connectivity: any;
        routing: any;
        dns: any;
        performance: any;
        security: any;
        recommendations: any;
        timestamp: Date;
    }>;
    generateNetworkRestartHandler: (service: any) => (networkId: string) => Promise<{
        networkId: string;
        success: any;
        message: any;
        downtime: any;
        timestamp: Date;
    }>;
    generateNetworkResetHandler: (service: any) => (networkId: string, options: {
        clearConfig?: boolean;
        clearRoutes?: boolean;
    }) => Promise<{
        networkId: string;
        success: any;
        clearedComponents: any;
        message: any;
        timestamp: Date;
    }>;
    isValidIpAddress: (ip: string) => boolean;
    isValidSubnet: (subnet: string) => boolean;
};
export default _default;
//# sourceMappingURL=network-api-controllers-kit.d.ts.map