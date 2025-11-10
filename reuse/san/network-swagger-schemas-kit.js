"use strict";
/**
 * LOC: NETSCHEMA001
 * File: /reuse/san/network-swagger-schemas-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - SAN API DTOs
 *   - Network service validation
 *   - API documentation schemas
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendSchema = exports.mergeSchemas = exports.composeSchemaWithAllOf = exports.generateNestedSecurityConfigSchema = exports.generateNestedMonitoringConfigSchema = exports.generateNestedFirewallPolicySchema = exports.generateNestedNetworkConfigSchema = exports.generatePolymorphicSchema = exports.generateNestedSchemaWithReferences = exports.generateArrayOfReferences = exports.createSchemaReference = exports.generateAvailabilityZoneEnumSchema = exports.generateRegionEnumSchema = exports.generateFirewallActionEnumSchema = exports.generateProtocolTypeEnumSchema = exports.generateNetworkStatusEnumSchema = exports.generateTagValidationSchema = exports.generateResourceNameValidationSchema = exports.generatePortValidationSchema = exports.generateIpAddressValidationSchema = exports.generateCidrValidationSchema = exports.generateBulkOperationResponseSchema = exports.generateAsyncOperationResponseSchema = exports.generateErrorResponseSchema = exports.generatePaginatedResponseSchema = exports.generateNetworkResponseSchema = exports.generateLoadBalancerCreateRequestSchema = exports.generateVpnCreateRequestSchema = exports.generateFirewallRuleCreateRequestSchema = exports.generateRouteCreateRequestSchema = exports.generateSubnetCreateRequestSchema = exports.generateNetworkUpdateRequestSchema = exports.generateNetworkCreateRequestSchema = exports.generateIpAddressEntitySchema = exports.generateFirewallRuleEntitySchema = exports.generateRouteEntitySchema = exports.generateSubnetEntitySchema = exports.generateNetworkEntitySchema = exports.LoadBalancerType = exports.VpnType = exports.ProtocolType = exports.FirewallRuleDirection = exports.FirewallRuleAction = exports.RouteType = exports.SubnetType = exports.NetworkType = exports.NetworkStatus = void 0;
// ============================================================================
// TYPE DEFINITIONS & ENUMS
// ============================================================================
var NetworkStatus;
(function (NetworkStatus) {
    NetworkStatus["PENDING"] = "pending";
    NetworkStatus["CREATING"] = "creating";
    NetworkStatus["ACTIVE"] = "active";
    NetworkStatus["UPDATING"] = "updating";
    NetworkStatus["DELETING"] = "deleting";
    NetworkStatus["DELETED"] = "deleted";
    NetworkStatus["ERROR"] = "error";
})(NetworkStatus || (exports.NetworkStatus = NetworkStatus = {}));
var NetworkType;
(function (NetworkType) {
    NetworkType["PRIVATE"] = "private";
    NetworkType["PUBLIC"] = "public";
    NetworkType["HYBRID"] = "hybrid";
})(NetworkType || (exports.NetworkType = NetworkType = {}));
var SubnetType;
(function (SubnetType) {
    SubnetType["PUBLIC"] = "public";
    SubnetType["PRIVATE"] = "private";
    SubnetType["ISOLATED"] = "isolated";
})(SubnetType || (exports.SubnetType = SubnetType = {}));
var RouteType;
(function (RouteType) {
    RouteType["STATIC"] = "static";
    RouteType["DYNAMIC"] = "dynamic";
    RouteType["PROPAGATED"] = "propagated";
})(RouteType || (exports.RouteType = RouteType = {}));
var FirewallRuleAction;
(function (FirewallRuleAction) {
    FirewallRuleAction["ALLOW"] = "allow";
    FirewallRuleAction["DENY"] = "deny";
})(FirewallRuleAction || (exports.FirewallRuleAction = FirewallRuleAction = {}));
var FirewallRuleDirection;
(function (FirewallRuleDirection) {
    FirewallRuleDirection["INGRESS"] = "ingress";
    FirewallRuleDirection["EGRESS"] = "egress";
})(FirewallRuleDirection || (exports.FirewallRuleDirection = FirewallRuleDirection = {}));
var ProtocolType;
(function (ProtocolType) {
    ProtocolType["TCP"] = "tcp";
    ProtocolType["UDP"] = "udp";
    ProtocolType["ICMP"] = "icmp";
    ProtocolType["ALL"] = "all";
})(ProtocolType || (exports.ProtocolType = ProtocolType = {}));
var VpnType;
(function (VpnType) {
    VpnType["SITE_TO_SITE"] = "site-to-site";
    VpnType["CLIENT_VPN"] = "client-vpn";
})(VpnType || (exports.VpnType = VpnType = {}));
var LoadBalancerType;
(function (LoadBalancerType) {
    LoadBalancerType["APPLICATION"] = "application";
    LoadBalancerType["NETWORK"] = "network";
    LoadBalancerType["GATEWAY"] = "gateway";
})(LoadBalancerType || (exports.LoadBalancerType = LoadBalancerType = {}));
// ============================================================================
// NETWORK ENTITY SCHEMAS (1-5)
// ============================================================================
/**
 * Generates base network entity schema with common properties.
 *
 * @returns {any} Network entity schema
 *
 * @example
 * ```typescript
 * const networkSchema = generateNetworkEntitySchema();
 * // Returns schema with: id, name, cidr, status, region, etc.
 * ```
 */
const generateNetworkEntitySchema = () => {
    return {
        type: 'object',
        required: ['id', 'name', 'cidr', 'status', 'region'],
        properties: {
            id: {
                type: 'string',
                format: 'uuid',
                description: 'Unique network identifier',
                example: '550e8400-e29b-41d4-a716-446655440000',
            },
            name: {
                type: 'string',
                description: 'Network name',
                minLength: 3,
                maxLength: 64,
                pattern: '^[a-z0-9-]+$',
                example: 'production-network',
            },
            cidr: {
                type: 'string',
                description: 'CIDR block for the network',
                pattern: '^([0-9]{1,3}\\.){3}[0-9]{1,3}/[0-9]{1,2}$',
                example: '10.0.0.0/16',
            },
            status: {
                type: 'string',
                enum: Object.values(NetworkStatus),
                description: 'Current network status',
                example: NetworkStatus.ACTIVE,
            },
            region: {
                type: 'string',
                description: 'Geographic region',
                example: 'us-east-1',
            },
            type: {
                type: 'string',
                enum: Object.values(NetworkType),
                description: 'Network type',
                example: NetworkType.PRIVATE,
            },
            description: {
                type: 'string',
                description: 'Network description',
                maxLength: 500,
                example: 'Production virtual network for enterprise applications',
            },
            enableDnsHostnames: {
                type: 'boolean',
                description: 'Enable DNS hostnames',
                default: false,
            },
            enableDnsSupport: {
                type: 'boolean',
                description: 'Enable DNS support',
                default: true,
            },
            tags: {
                type: 'object',
                description: 'Resource tags',
                additionalProperties: { type: 'string' },
                example: { Environment: 'Production', Team: 'Infrastructure' },
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Creation timestamp',
            },
            updatedAt: {
                type: 'string',
                format: 'date-time',
                description: 'Last update timestamp',
            },
        },
    };
};
exports.generateNetworkEntitySchema = generateNetworkEntitySchema;
/**
 * Generates subnet entity schema.
 *
 * @returns {any} Subnet entity schema
 *
 * @example
 * ```typescript
 * const subnetSchema = generateSubnetEntitySchema();
 * ```
 */
const generateSubnetEntitySchema = () => {
    return {
        type: 'object',
        required: ['id', 'name', 'cidr', 'networkId', 'availabilityZone'],
        properties: {
            id: {
                type: 'string',
                format: 'uuid',
                description: 'Unique subnet identifier',
            },
            name: {
                type: 'string',
                description: 'Subnet name',
                minLength: 3,
                maxLength: 64,
            },
            cidr: {
                type: 'string',
                description: 'CIDR block for the subnet',
                pattern: '^([0-9]{1,3}\\.){3}[0-9]{1,3}/[0-9]{1,2}$',
            },
            networkId: {
                type: 'string',
                format: 'uuid',
                description: 'Parent network ID',
            },
            availabilityZone: {
                type: 'string',
                description: 'Availability zone',
                example: 'us-east-1a',
            },
            type: {
                type: 'string',
                enum: Object.values(SubnetType),
                description: 'Subnet type',
            },
            autoAssignPublicIp: {
                type: 'boolean',
                description: 'Auto-assign public IP addresses',
                default: false,
            },
            availableIpCount: {
                type: 'integer',
                description: 'Number of available IP addresses',
                minimum: 0,
            },
        },
    };
};
exports.generateSubnetEntitySchema = generateSubnetEntitySchema;
/**
 * Generates route entity schema.
 *
 * @returns {any} Route entity schema
 *
 * @example
 * ```typescript
 * const routeSchema = generateRouteEntitySchema();
 * ```
 */
const generateRouteEntitySchema = () => {
    return {
        type: 'object',
        required: ['id', 'destination', 'target', 'routeTableId'],
        properties: {
            id: {
                type: 'string',
                format: 'uuid',
                description: 'Unique route identifier',
            },
            destination: {
                type: 'string',
                description: 'Destination CIDR block',
                pattern: '^([0-9]{1,3}\\.){3}[0-9]{1,3}/[0-9]{1,2}$',
                example: '0.0.0.0/0',
            },
            target: {
                type: 'string',
                description: 'Route target (gateway, instance, etc.)',
            },
            routeTableId: {
                type: 'string',
                format: 'uuid',
                description: 'Route table ID',
            },
            type: {
                type: 'string',
                enum: Object.values(RouteType),
                description: 'Route type',
            },
            priority: {
                type: 'integer',
                description: 'Route priority',
                minimum: 0,
                maximum: 1000,
            },
            active: {
                type: 'boolean',
                description: 'Whether route is active',
                default: true,
            },
        },
    };
};
exports.generateRouteEntitySchema = generateRouteEntitySchema;
/**
 * Generates firewall rule entity schema.
 *
 * @returns {any} Firewall rule entity schema
 *
 * @example
 * ```typescript
 * const firewallSchema = generateFirewallRuleEntitySchema();
 * ```
 */
const generateFirewallRuleEntitySchema = () => {
    return {
        type: 'object',
        required: ['id', 'direction', 'action', 'protocol', 'priority'],
        properties: {
            id: {
                type: 'string',
                format: 'uuid',
                description: 'Unique firewall rule identifier',
            },
            name: {
                type: 'string',
                description: 'Rule name',
            },
            direction: {
                type: 'string',
                enum: Object.values(FirewallRuleDirection),
                description: 'Traffic direction',
            },
            action: {
                type: 'string',
                enum: Object.values(FirewallRuleAction),
                description: 'Rule action',
            },
            protocol: {
                type: 'string',
                enum: Object.values(ProtocolType),
                description: 'Network protocol',
            },
            sourceAddress: {
                type: 'string',
                description: 'Source IP address or CIDR',
                example: '0.0.0.0/0',
            },
            destinationAddress: {
                type: 'string',
                description: 'Destination IP address or CIDR',
            },
            sourcePort: {
                type: 'string',
                description: 'Source port or range',
                example: '1024-65535',
            },
            destinationPort: {
                type: 'string',
                description: 'Destination port or range',
                example: '443',
            },
            priority: {
                type: 'integer',
                description: 'Rule priority (lower = higher priority)',
                minimum: 100,
                maximum: 4096,
            },
            enabled: {
                type: 'boolean',
                description: 'Whether rule is enabled',
                default: true,
            },
        },
    };
};
exports.generateFirewallRuleEntitySchema = generateFirewallRuleEntitySchema;
/**
 * Generates IP address entity schema.
 *
 * @returns {any} IP address entity schema
 *
 * @example
 * ```typescript
 * const ipSchema = generateIpAddressEntitySchema();
 * ```
 */
const generateIpAddressEntitySchema = () => {
    return {
        type: 'object',
        required: ['id', 'address', 'version', 'type'],
        properties: {
            id: {
                type: 'string',
                format: 'uuid',
                description: 'Unique IP address identifier',
            },
            address: {
                type: 'string',
                description: 'IP address',
                example: '203.0.113.1',
            },
            version: {
                type: 'string',
                enum: ['IPv4', 'IPv6'],
                description: 'IP version',
            },
            type: {
                type: 'string',
                enum: ['public', 'private', 'elastic'],
                description: 'IP address type',
            },
            associatedResourceId: {
                type: 'string',
                format: 'uuid',
                description: 'Associated resource ID',
            },
            associatedResourceType: {
                type: 'string',
                description: 'Associated resource type',
                example: 'instance',
            },
            allocationId: {
                type: 'string',
                description: 'Allocation identifier',
            },
        },
    };
};
exports.generateIpAddressEntitySchema = generateIpAddressEntitySchema;
// ============================================================================
// REQUEST DTO SCHEMAS (6-12)
// ============================================================================
/**
 * Generates network creation request schema.
 *
 * @returns {any} Network create request schema
 *
 * @example
 * ```typescript
 * const createSchema = generateNetworkCreateRequestSchema();
 * ```
 */
const generateNetworkCreateRequestSchema = () => {
    return {
        type: 'object',
        required: ['name', 'cidr', 'region'],
        properties: {
            name: {
                type: 'string',
                description: 'Network name',
                minLength: 3,
                maxLength: 64,
                pattern: '^[a-z0-9-]+$',
                example: 'production-network',
            },
            cidr: {
                type: 'string',
                description: 'CIDR block',
                pattern: '^([0-9]{1,3}\\.){3}[0-9]{1,3}/[0-9]{1,2}$',
                example: '10.0.0.0/16',
            },
            region: {
                type: 'string',
                description: 'Deployment region',
                example: 'us-east-1',
            },
            type: {
                type: 'string',
                enum: Object.values(NetworkType),
                description: 'Network type',
                default: NetworkType.PRIVATE,
            },
            description: {
                type: 'string',
                description: 'Network description',
                maxLength: 500,
            },
            enableDnsHostnames: {
                type: 'boolean',
                description: 'Enable DNS hostnames',
                default: false,
            },
            enableDnsSupport: {
                type: 'boolean',
                description: 'Enable DNS support',
                default: true,
            },
            tags: {
                type: 'object',
                description: 'Resource tags',
                additionalProperties: { type: 'string' },
            },
        },
    };
};
exports.generateNetworkCreateRequestSchema = generateNetworkCreateRequestSchema;
/**
 * Generates network update request schema.
 *
 * @returns {any} Network update request schema
 *
 * @example
 * ```typescript
 * const updateSchema = generateNetworkUpdateRequestSchema();
 * ```
 */
const generateNetworkUpdateRequestSchema = () => {
    return {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                description: 'Network name',
                minLength: 3,
                maxLength: 64,
            },
            description: {
                type: 'string',
                description: 'Network description',
                maxLength: 500,
            },
            enableDnsHostnames: {
                type: 'boolean',
                description: 'Enable DNS hostnames',
            },
            enableDnsSupport: {
                type: 'boolean',
                description: 'Enable DNS support',
            },
            tags: {
                type: 'object',
                description: 'Resource tags',
                additionalProperties: { type: 'string' },
            },
        },
    };
};
exports.generateNetworkUpdateRequestSchema = generateNetworkUpdateRequestSchema;
/**
 * Generates subnet creation request schema.
 *
 * @returns {any} Subnet create request schema
 *
 * @example
 * ```typescript
 * const createSubnetSchema = generateSubnetCreateRequestSchema();
 * ```
 */
const generateSubnetCreateRequestSchema = () => {
    return {
        type: 'object',
        required: ['name', 'cidr', 'networkId', 'availabilityZone'],
        properties: {
            name: {
                type: 'string',
                description: 'Subnet name',
                minLength: 3,
                maxLength: 64,
            },
            cidr: {
                type: 'string',
                description: 'CIDR block',
                pattern: '^([0-9]{1,3}\\.){3}[0-9]{1,3}/[0-9]{1,2}$',
            },
            networkId: {
                type: 'string',
                format: 'uuid',
                description: 'Parent network ID',
            },
            availabilityZone: {
                type: 'string',
                description: 'Availability zone',
            },
            type: {
                type: 'string',
                enum: Object.values(SubnetType),
                description: 'Subnet type',
            },
            autoAssignPublicIp: {
                type: 'boolean',
                description: 'Auto-assign public IP',
                default: false,
            },
        },
    };
};
exports.generateSubnetCreateRequestSchema = generateSubnetCreateRequestSchema;
/**
 * Generates route creation request schema.
 *
 * @returns {any} Route create request schema
 *
 * @example
 * ```typescript
 * const createRouteSchema = generateRouteCreateRequestSchema();
 * ```
 */
const generateRouteCreateRequestSchema = () => {
    return {
        type: 'object',
        required: ['destination', 'target', 'routeTableId'],
        properties: {
            destination: {
                type: 'string',
                description: 'Destination CIDR',
                pattern: '^([0-9]{1,3}\\.){3}[0-9]{1,3}/[0-9]{1,2}$',
            },
            target: {
                type: 'string',
                description: 'Route target',
            },
            routeTableId: {
                type: 'string',
                format: 'uuid',
                description: 'Route table ID',
            },
            type: {
                type: 'string',
                enum: Object.values(RouteType),
                description: 'Route type',
            },
            priority: {
                type: 'integer',
                description: 'Route priority',
                minimum: 0,
                maximum: 1000,
            },
        },
    };
};
exports.generateRouteCreateRequestSchema = generateRouteCreateRequestSchema;
/**
 * Generates firewall rule creation request schema.
 *
 * @returns {any} Firewall rule create request schema
 *
 * @example
 * ```typescript
 * const createFirewallSchema = generateFirewallRuleCreateRequestSchema();
 * ```
 */
const generateFirewallRuleCreateRequestSchema = () => {
    return {
        type: 'object',
        required: ['name', 'direction', 'action', 'protocol', 'priority'],
        properties: {
            name: {
                type: 'string',
                description: 'Rule name',
                minLength: 3,
                maxLength: 64,
            },
            direction: {
                type: 'string',
                enum: Object.values(FirewallRuleDirection),
                description: 'Traffic direction',
            },
            action: {
                type: 'string',
                enum: Object.values(FirewallRuleAction),
                description: 'Rule action',
            },
            protocol: {
                type: 'string',
                enum: Object.values(ProtocolType),
                description: 'Network protocol',
            },
            sourceAddress: {
                type: 'string',
                description: 'Source IP/CIDR',
            },
            destinationAddress: {
                type: 'string',
                description: 'Destination IP/CIDR',
            },
            sourcePort: {
                type: 'string',
                description: 'Source port/range',
            },
            destinationPort: {
                type: 'string',
                description: 'Destination port/range',
            },
            priority: {
                type: 'integer',
                description: 'Rule priority',
                minimum: 100,
                maximum: 4096,
            },
        },
    };
};
exports.generateFirewallRuleCreateRequestSchema = generateFirewallRuleCreateRequestSchema;
/**
 * Generates VPN configuration request schema.
 *
 * @returns {any} VPN create request schema
 *
 * @example
 * ```typescript
 * const createVpnSchema = generateVpnCreateRequestSchema();
 * ```
 */
const generateVpnCreateRequestSchema = () => {
    return {
        type: 'object',
        required: ['name', 'type', 'networkId'],
        properties: {
            name: {
                type: 'string',
                description: 'VPN gateway name',
                minLength: 3,
                maxLength: 64,
            },
            type: {
                type: 'string',
                enum: Object.values(VpnType),
                description: 'VPN type',
            },
            networkId: {
                type: 'string',
                format: 'uuid',
                description: 'Network ID',
            },
            remoteGatewayIp: {
                type: 'string',
                description: 'Remote gateway IP address',
            },
            preSharedKey: {
                type: 'string',
                description: 'Pre-shared key for authentication',
                minLength: 16,
            },
            localSubnets: {
                type: 'array',
                items: { type: 'string' },
                description: 'Local subnet CIDRs',
            },
            remoteSubnets: {
                type: 'array',
                items: { type: 'string' },
                description: 'Remote subnet CIDRs',
            },
        },
    };
};
exports.generateVpnCreateRequestSchema = generateVpnCreateRequestSchema;
/**
 * Generates load balancer creation request schema.
 *
 * @returns {any} Load balancer create request schema
 *
 * @example
 * ```typescript
 * const createLbSchema = generateLoadBalancerCreateRequestSchema();
 * ```
 */
const generateLoadBalancerCreateRequestSchema = () => {
    return {
        type: 'object',
        required: ['name', 'type', 'subnetIds'],
        properties: {
            name: {
                type: 'string',
                description: 'Load balancer name',
                minLength: 3,
                maxLength: 64,
            },
            type: {
                type: 'string',
                enum: Object.values(LoadBalancerType),
                description: 'Load balancer type',
            },
            subnetIds: {
                type: 'array',
                items: { type: 'string', format: 'uuid' },
                description: 'Subnet IDs',
                minItems: 2,
            },
            scheme: {
                type: 'string',
                enum: ['internet-facing', 'internal'],
                description: 'Load balancer scheme',
            },
            ipAddressType: {
                type: 'string',
                enum: ['ipv4', 'dualstack'],
                description: 'IP address type',
            },
        },
    };
};
exports.generateLoadBalancerCreateRequestSchema = generateLoadBalancerCreateRequestSchema;
// ============================================================================
// RESPONSE DTO SCHEMAS (13-17)
// ============================================================================
/**
 * Generates network response schema with metadata.
 *
 * @returns {any} Network response schema
 *
 * @example
 * ```typescript
 * const responseSchema = generateNetworkResponseSchema();
 * ```
 */
const generateNetworkResponseSchema = () => {
    const baseSchema = (0, exports.generateNetworkEntitySchema)();
    return {
        ...baseSchema,
        properties: {
            ...baseSchema.properties,
            metadata: {
                type: 'object',
                description: 'Additional metadata',
                properties: {
                    totalSubnets: { type: 'integer' },
                    totalRoutes: { type: 'integer' },
                    totalInstances: { type: 'integer' },
                },
            },
        },
    };
};
exports.generateNetworkResponseSchema = generateNetworkResponseSchema;
/**
 * Generates paginated response schema.
 *
 * @param {any} itemSchema - Schema for individual items
 * @param {string} resourceName - Resource name
 * @returns {any} Paginated response schema
 *
 * @example
 * ```typescript
 * const paginatedSchema = generatePaginatedResponseSchema(NetworkSchema, 'networks');
 * ```
 */
const generatePaginatedResponseSchema = (itemSchema, resourceName) => {
    return {
        type: 'object',
        required: ['data', 'pagination'],
        properties: {
            data: {
                type: 'array',
                items: itemSchema,
                description: `Array of ${resourceName}`,
            },
            pagination: {
                type: 'object',
                required: ['page', 'limit', 'total', 'totalPages'],
                properties: {
                    page: {
                        type: 'integer',
                        description: 'Current page number',
                        minimum: 1,
                    },
                    limit: {
                        type: 'integer',
                        description: 'Items per page',
                        minimum: 1,
                        maximum: 100,
                    },
                    total: {
                        type: 'integer',
                        description: 'Total number of items',
                        minimum: 0,
                    },
                    totalPages: {
                        type: 'integer',
                        description: 'Total number of pages',
                        minimum: 0,
                    },
                },
            },
        },
    };
};
exports.generatePaginatedResponseSchema = generatePaginatedResponseSchema;
/**
 * Generates error response schema.
 *
 * @returns {any} Error response schema
 *
 * @example
 * ```typescript
 * const errorSchema = generateErrorResponseSchema();
 * ```
 */
const generateErrorResponseSchema = () => {
    return {
        type: 'object',
        required: ['error'],
        properties: {
            error: {
                type: 'object',
                required: ['code', 'message', 'statusCode', 'timestamp'],
                properties: {
                    code: {
                        type: 'string',
                        description: 'Error code',
                        example: 'NETWORK_NOT_FOUND',
                    },
                    message: {
                        type: 'string',
                        description: 'Error message',
                        example: 'The requested network was not found',
                    },
                    statusCode: {
                        type: 'integer',
                        description: 'HTTP status code',
                        example: 404,
                    },
                    timestamp: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Error timestamp',
                    },
                    traceId: {
                        type: 'string',
                        description: 'Request trace ID',
                    },
                    details: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                field: { type: 'string' },
                                message: { type: 'string' },
                                code: { type: 'string' },
                            },
                        },
                        description: 'Detailed error information',
                    },
                    path: {
                        type: 'string',
                        description: 'Request path',
                    },
                },
            },
        },
    };
};
exports.generateErrorResponseSchema = generateErrorResponseSchema;
/**
 * Generates async operation response schema.
 *
 * @returns {any} Async operation response schema
 *
 * @example
 * ```typescript
 * const asyncSchema = generateAsyncOperationResponseSchema();
 * ```
 */
const generateAsyncOperationResponseSchema = () => {
    return {
        type: 'object',
        required: ['operationId', 'status', 'statusUrl'],
        properties: {
            operationId: {
                type: 'string',
                format: 'uuid',
                description: 'Unique operation identifier',
            },
            status: {
                type: 'string',
                enum: ['pending', 'processing', 'completed', 'failed'],
                description: 'Operation status',
            },
            statusUrl: {
                type: 'string',
                format: 'uri',
                description: 'URL to check operation status',
            },
            estimatedCompletion: {
                type: 'string',
                format: 'date-time',
                description: 'Estimated completion time',
            },
            result: {
                type: 'object',
                description: 'Operation result (when completed)',
            },
            error: {
                type: 'object',
                description: 'Error information (when failed)',
            },
        },
    };
};
exports.generateAsyncOperationResponseSchema = generateAsyncOperationResponseSchema;
/**
 * Generates bulk operation response schema.
 *
 * @param {string} operation - Operation name
 * @returns {any} Bulk operation response schema
 *
 * @example
 * ```typescript
 * const bulkSchema = generateBulkOperationResponseSchema('create');
 * ```
 */
const generateBulkOperationResponseSchema = (operation) => {
    return {
        type: 'object',
        required: ['successful', 'failed', 'results'],
        properties: {
            successful: {
                type: 'integer',
                description: 'Number of successful operations',
                minimum: 0,
            },
            failed: {
                type: 'integer',
                description: 'Number of failed operations',
                minimum: 0,
            },
            results: {
                type: 'array',
                description: `Individual ${operation} results`,
                items: {
                    type: 'object',
                    required: ['id', 'status'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Item identifier',
                        },
                        status: {
                            type: 'string',
                            enum: ['success', 'failed'],
                            description: 'Operation status',
                        },
                        data: {
                            type: 'object',
                            description: 'Result data (on success)',
                        },
                        error: {
                            type: 'string',
                            description: 'Error message (on failure)',
                        },
                    },
                },
            },
        },
    };
};
exports.generateBulkOperationResponseSchema = generateBulkOperationResponseSchema;
// ============================================================================
// VALIDATION SCHEMAS (18-22)
// ============================================================================
/**
 * Generates CIDR validation schema.
 *
 * @returns {SchemaPropertyConfig} CIDR validation schema
 *
 * @example
 * ```typescript
 * const cidrSchema = generateCidrValidationSchema();
 * ```
 */
const generateCidrValidationSchema = () => {
    return {
        type: 'string',
        description: 'CIDR block notation',
        pattern: '^([0-9]{1,3}\\.){3}[0-9]{1,3}/[0-9]{1,2}$',
        example: '10.0.0.0/16',
    };
};
exports.generateCidrValidationSchema = generateCidrValidationSchema;
/**
 * Generates IP address validation schema.
 *
 * @param {string} version - IP version ('IPv4' or 'IPv6')
 * @returns {SchemaPropertyConfig} IP address validation schema
 *
 * @example
 * ```typescript
 * const ipSchema = generateIpAddressValidationSchema('IPv4');
 * ```
 */
const generateIpAddressValidationSchema = (version) => {
    const patterns = {
        IPv4: '^([0-9]{1,3}\\.){3}[0-9]{1,3}$',
        IPv6: '^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$',
    };
    return {
        type: 'string',
        description: `${version} address`,
        pattern: patterns[version] || patterns.IPv4,
        example: version === 'IPv4' ? '192.168.1.1' : '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
    };
};
exports.generateIpAddressValidationSchema = generateIpAddressValidationSchema;
/**
 * Generates port validation schema.
 *
 * @param {boolean} allowRange - Allow port ranges
 * @returns {SchemaPropertyConfig} Port validation schema
 *
 * @example
 * ```typescript
 * const portSchema = generatePortValidationSchema(true);
 * ```
 */
const generatePortValidationSchema = (allowRange) => {
    if (allowRange) {
        return {
            type: 'string',
            description: 'Port number or range',
            pattern: '^([0-9]{1,5}(-[0-9]{1,5})?)$',
            example: '80-443',
        };
    }
    return {
        type: 'integer',
        description: 'Port number',
        minimum: 1,
        maximum: 65535,
        example: 443,
    };
};
exports.generatePortValidationSchema = generatePortValidationSchema;
/**
 * Generates resource name validation schema.
 *
 * @returns {SchemaPropertyConfig} Resource name validation schema
 *
 * @example
 * ```typescript
 * const nameSchema = generateResourceNameValidationSchema();
 * ```
 */
const generateResourceNameValidationSchema = () => {
    return {
        type: 'string',
        description: 'Resource name (lowercase alphanumeric with hyphens)',
        minLength: 3,
        maxLength: 64,
        pattern: '^[a-z0-9-]+$',
        example: 'production-network-01',
    };
};
exports.generateResourceNameValidationSchema = generateResourceNameValidationSchema;
/**
 * Generates tag validation schema.
 *
 * @returns {SchemaPropertyConfig} Tag validation schema
 *
 * @example
 * ```typescript
 * const tagSchema = generateTagValidationSchema();
 * ```
 */
const generateTagValidationSchema = () => {
    return {
        type: 'object',
        description: 'Resource tags (key-value pairs)',
        additionalProperties: {
            type: 'string',
            minLength: 1,
            maxLength: 256,
        },
        example: {
            Environment: 'Production',
            Team: 'Infrastructure',
            CostCenter: 'IT-001',
        },
    };
};
exports.generateTagValidationSchema = generateTagValidationSchema;
// ============================================================================
// ENUM SCHEMA GENERATORS (23-27)
// ============================================================================
/**
 * Generates network status enum schema.
 *
 * @returns {SchemaPropertyConfig} Network status enum schema
 *
 * @example
 * ```typescript
 * const statusSchema = generateNetworkStatusEnumSchema();
 * ```
 */
const generateNetworkStatusEnumSchema = () => {
    return {
        type: 'string',
        description: 'Network operational status',
        enum: Object.values(NetworkStatus),
        example: NetworkStatus.ACTIVE,
    };
};
exports.generateNetworkStatusEnumSchema = generateNetworkStatusEnumSchema;
/**
 * Generates protocol type enum schema.
 *
 * @returns {SchemaPropertyConfig} Protocol type enum schema
 *
 * @example
 * ```typescript
 * const protocolSchema = generateProtocolTypeEnumSchema();
 * ```
 */
const generateProtocolTypeEnumSchema = () => {
    return {
        type: 'string',
        description: 'Network protocol type',
        enum: Object.values(ProtocolType),
        example: ProtocolType.TCP,
    };
};
exports.generateProtocolTypeEnumSchema = generateProtocolTypeEnumSchema;
/**
 * Generates firewall action enum schema.
 *
 * @returns {SchemaPropertyConfig} Firewall action enum schema
 *
 * @example
 * ```typescript
 * const actionSchema = generateFirewallActionEnumSchema();
 * ```
 */
const generateFirewallActionEnumSchema = () => {
    return {
        type: 'string',
        description: 'Firewall rule action',
        enum: Object.values(FirewallRuleAction),
        example: FirewallRuleAction.ALLOW,
    };
};
exports.generateFirewallActionEnumSchema = generateFirewallActionEnumSchema;
/**
 * Generates region enum schema.
 *
 * @param {string[]} regions - Available regions
 * @returns {SchemaPropertyConfig} Region enum schema
 *
 * @example
 * ```typescript
 * const regionSchema = generateRegionEnumSchema(['us-east-1', 'us-west-2', 'eu-west-1']);
 * ```
 */
const generateRegionEnumSchema = (regions) => {
    return {
        type: 'string',
        description: 'Deployment region',
        enum: regions,
        example: regions[0] || 'us-east-1',
    };
};
exports.generateRegionEnumSchema = generateRegionEnumSchema;
/**
 * Generates availability zone enum schema.
 *
 * @param {string} region - Region for zones
 * @param {string[]} zones - Available zones
 * @returns {SchemaPropertyConfig} Availability zone enum schema
 *
 * @example
 * ```typescript
 * const azSchema = generateAvailabilityZoneEnumSchema('us-east-1', ['us-east-1a', 'us-east-1b']);
 * ```
 */
const generateAvailabilityZoneEnumSchema = (region, zones) => {
    return {
        type: 'string',
        description: `Availability zones in ${region}`,
        enum: zones,
        example: zones[0] || `${region}a`,
    };
};
exports.generateAvailabilityZoneEnumSchema = generateAvailabilityZoneEnumSchema;
// ============================================================================
// REFERENCE SCHEMAS (28-31)
// ============================================================================
/**
 * Creates schema reference using $ref.
 *
 * @param {string} schemaName - Schema name to reference
 * @param {string} [description] - Reference description
 * @returns {ReferenceSchemaConfig} Schema reference
 *
 * @example
 * ```typescript
 * const ref = createSchemaReference('Network', 'Network entity reference');
 * ```
 */
const createSchemaReference = (schemaName, description) => {
    return {
        ref: `#/components/schemas/${schemaName}`,
        description,
    };
};
exports.createSchemaReference = createSchemaReference;
/**
 * Generates array of schema references.
 *
 * @param {string} schemaName - Schema name for array items
 * @param {string} [description] - Array description
 * @returns {any} Array schema with references
 *
 * @example
 * ```typescript
 * const arraySchema = generateArrayOfReferences('Subnet', 'Array of subnets');
 * ```
 */
const generateArrayOfReferences = (schemaName, description) => {
    return {
        type: 'array',
        description: description || `Array of ${schemaName} references`,
        items: {
            $ref: `#/components/schemas/${schemaName}`,
        },
    };
};
exports.generateArrayOfReferences = generateArrayOfReferences;
/**
 * Generates nested schema with references.
 *
 * @param {Record<string, string>} properties - Property names and their schema references
 * @returns {any} Nested schema object
 *
 * @example
 * ```typescript
 * const nestedSchema = generateNestedSchemaWithReferences({
 *   network: 'Network',
 *   subnets: 'Subnet',
 *   routes: 'Route'
 * });
 * ```
 */
const generateNestedSchemaWithReferences = (properties) => {
    const schemaProperties = {};
    Object.entries(properties).forEach(([propName, schemaName]) => {
        schemaProperties[propName] = {
            $ref: `#/components/schemas/${schemaName}`,
        };
    });
    return {
        type: 'object',
        properties: schemaProperties,
    };
};
exports.generateNestedSchemaWithReferences = generateNestedSchemaWithReferences;
/**
 * Generates polymorphic schema using oneOf.
 *
 * @param {string[]} schemaNames - Schema names for oneOf
 * @param {string} discriminator - Discriminator property name
 * @returns {any} Polymorphic schema
 *
 * @example
 * ```typescript
 * const polySchema = generatePolymorphicSchema(
 *   ['PublicNetwork', 'PrivateNetwork', 'HybridNetwork'],
 *   'type'
 * );
 * ```
 */
const generatePolymorphicSchema = (schemaNames, discriminator) => {
    return {
        oneOf: schemaNames.map(name => ({ $ref: `#/components/schemas/${name}` })),
        discriminator: {
            propertyName: discriminator,
        },
    };
};
exports.generatePolymorphicSchema = generatePolymorphicSchema;
// ============================================================================
// NESTED SCHEMA BUILDERS (32-35)
// ============================================================================
/**
 * Generates nested network configuration schema.
 *
 * @returns {any} Nested network configuration schema
 *
 * @example
 * ```typescript
 * const configSchema = generateNestedNetworkConfigSchema();
 * ```
 */
const generateNestedNetworkConfigSchema = () => {
    return {
        type: 'object',
        properties: {
            network: {
                type: 'object',
                properties: {
                    cidr: (0, exports.generateCidrValidationSchema)(),
                    enableDnsHostnames: { type: 'boolean' },
                    enableDnsSupport: { type: 'boolean' },
                },
            },
            subnets: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        cidr: (0, exports.generateCidrValidationSchema)(),
                        type: (0, exports.generateNetworkStatusEnumSchema)(),
                        availabilityZone: { type: 'string' },
                    },
                },
            },
            routing: {
                type: 'object',
                properties: {
                    enableInternetGateway: { type: 'boolean' },
                    enableNatGateway: { type: 'boolean' },
                    customRoutes: (0, exports.generateArrayOfReferences)('Route'),
                },
            },
        },
    };
};
exports.generateNestedNetworkConfigSchema = generateNestedNetworkConfigSchema;
/**
 * Generates nested firewall policy schema.
 *
 * @returns {any} Nested firewall policy schema
 *
 * @example
 * ```typescript
 * const policySchema = generateNestedFirewallPolicySchema();
 * ```
 */
const generateNestedFirewallPolicySchema = () => {
    return {
        type: 'object',
        properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            defaultAction: (0, exports.generateFirewallActionEnumSchema)(),
            rules: {
                type: 'array',
                items: (0, exports.generateFirewallRuleEntitySchema)(),
            },
            appliedTo: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        resourceId: { type: 'string', format: 'uuid' },
                        resourceType: { type: 'string', enum: ['network', 'subnet', 'instance'] },
                    },
                },
            },
        },
    };
};
exports.generateNestedFirewallPolicySchema = generateNestedFirewallPolicySchema;
/**
 * Generates nested monitoring configuration schema.
 *
 * @returns {any} Nested monitoring configuration schema
 *
 * @example
 * ```typescript
 * const monitoringSchema = generateNestedMonitoringConfigSchema();
 * ```
 */
const generateNestedMonitoringConfigSchema = () => {
    return {
        type: 'object',
        properties: {
            enabled: { type: 'boolean', default: true },
            metrics: {
                type: 'object',
                properties: {
                    interval: { type: 'integer', minimum: 60, maximum: 3600 },
                    retention: { type: 'integer', minimum: 1, maximum: 365 },
                    alerting: {
                        type: 'object',
                        properties: {
                            enabled: { type: 'boolean' },
                            thresholds: {
                                type: 'object',
                                properties: {
                                    networkUtilization: { type: 'number', minimum: 0, maximum: 100 },
                                    packetLoss: { type: 'number', minimum: 0, maximum: 100 },
                                    latency: { type: 'integer', minimum: 0 },
                                },
                            },
                        },
                    },
                },
            },
            logging: {
                type: 'object',
                properties: {
                    enabled: { type: 'boolean' },
                    level: { type: 'string', enum: ['debug', 'info', 'warning', 'error'] },
                    destination: { type: 'string' },
                },
            },
        },
    };
};
exports.generateNestedMonitoringConfigSchema = generateNestedMonitoringConfigSchema;
/**
 * Generates nested security configuration schema.
 *
 * @returns {any} Nested security configuration schema
 *
 * @example
 * ```typescript
 * const securitySchema = generateNestedSecurityConfigSchema();
 * ```
 */
const generateNestedSecurityConfigSchema = () => {
    return {
        type: 'object',
        properties: {
            encryption: {
                type: 'object',
                properties: {
                    enabled: { type: 'boolean' },
                    algorithm: { type: 'string', enum: ['AES-256-GCM', 'AES-128-GCM'] },
                    keyRotation: {
                        type: 'object',
                        properties: {
                            enabled: { type: 'boolean' },
                            intervalDays: { type: 'integer', minimum: 1, maximum: 365 },
                        },
                    },
                },
            },
            accessControl: {
                type: 'object',
                properties: {
                    defaultPolicy: { type: 'string', enum: ['allow', 'deny'] },
                    allowedPrincipals: { type: 'array', items: { type: 'string' } },
                    deniedPrincipals: { type: 'array', items: { type: 'string' } },
                },
            },
            compliance: {
                type: 'object',
                properties: {
                    standards: {
                        type: 'array',
                        items: { type: 'string', enum: ['PCI-DSS', 'HIPAA', 'SOC2', 'ISO27001'] },
                    },
                    auditLogging: { type: 'boolean' },
                },
            },
        },
    };
};
exports.generateNestedSecurityConfigSchema = generateNestedSecurityConfigSchema;
// ============================================================================
// SCHEMA COMPOSITION HELPERS (36-38)
// ============================================================================
/**
 * Composes schema using allOf for inheritance.
 *
 * @param {string[]} baseSchemas - Base schema names
 * @param {any} [additionalProperties] - Additional properties
 * @returns {any} Composed schema
 *
 * @example
 * ```typescript
 * const composedSchema = composeSchemaWithAllOf(
 *   ['BaseNetwork', 'NetworkTags'],
 *   { properties: { customField: { type: 'string' } } }
 * );
 * ```
 */
const composeSchemaWithAllOf = (baseSchemas, additionalProperties) => {
    const allOf = baseSchemas.map(schema => ({ $ref: `#/components/schemas/${schema}` }));
    if (additionalProperties) {
        allOf.push(additionalProperties);
    }
    return { allOf };
};
exports.composeSchemaWithAllOf = composeSchemaWithAllOf;
/**
 * Merges multiple schemas into a single schema.
 *
 * @param {any[]} schemas - Schemas to merge
 * @returns {any} Merged schema
 *
 * @example
 * ```typescript
 * const mergedSchema = mergeSchemas([
 *   generateNetworkEntitySchema(),
 *   { properties: { additionalField: { type: 'string' } } }
 * ]);
 * ```
 */
const mergeSchemas = (schemas) => {
    const merged = {
        type: 'object',
        properties: {},
        required: [],
    };
    schemas.forEach(schema => {
        if (schema.properties) {
            merged.properties = { ...merged.properties, ...schema.properties };
        }
        if (schema.required) {
            merged.required = [...merged.required, ...schema.required];
        }
    });
    // Remove duplicates from required array
    merged.required = [...new Set(merged.required)];
    return merged;
};
exports.mergeSchemas = mergeSchemas;
/**
 * Extends base schema with additional properties.
 *
 * @param {any} baseSchema - Base schema
 * @param {Record<string, SchemaPropertyConfig>} additionalProperties - Properties to add
 * @param {string[]} [additionalRequired] - Additional required fields
 * @returns {any} Extended schema
 *
 * @example
 * ```typescript
 * const extendedSchema = extendSchema(
 *   generateNetworkEntitySchema(),
 *   { customField: { type: 'string', description: 'Custom field' } },
 *   ['customField']
 * );
 * ```
 */
const extendSchema = (baseSchema, additionalProperties, additionalRequired) => {
    return {
        ...baseSchema,
        properties: {
            ...baseSchema.properties,
            ...additionalProperties,
        },
        required: [
            ...(baseSchema.required || []),
            ...(additionalRequired || []),
        ],
    };
};
exports.extendSchema = extendSchema;
exports.default = {
    // Enums
    NetworkStatus,
    NetworkType,
    SubnetType,
    RouteType,
    FirewallRuleAction,
    FirewallRuleDirection,
    ProtocolType,
    VpnType,
    LoadBalancerType,
    // Network Entity Schemas
    generateNetworkEntitySchema: exports.generateNetworkEntitySchema,
    generateSubnetEntitySchema: exports.generateSubnetEntitySchema,
    generateRouteEntitySchema: exports.generateRouteEntitySchema,
    generateFirewallRuleEntitySchema: exports.generateFirewallRuleEntitySchema,
    generateIpAddressEntitySchema: exports.generateIpAddressEntitySchema,
    // Request DTO Schemas
    generateNetworkCreateRequestSchema: exports.generateNetworkCreateRequestSchema,
    generateNetworkUpdateRequestSchema: exports.generateNetworkUpdateRequestSchema,
    generateSubnetCreateRequestSchema: exports.generateSubnetCreateRequestSchema,
    generateRouteCreateRequestSchema: exports.generateRouteCreateRequestSchema,
    generateFirewallRuleCreateRequestSchema: exports.generateFirewallRuleCreateRequestSchema,
    generateVpnCreateRequestSchema: exports.generateVpnCreateRequestSchema,
    generateLoadBalancerCreateRequestSchema: exports.generateLoadBalancerCreateRequestSchema,
    // Response DTO Schemas
    generateNetworkResponseSchema: exports.generateNetworkResponseSchema,
    generatePaginatedResponseSchema: exports.generatePaginatedResponseSchema,
    generateErrorResponseSchema: exports.generateErrorResponseSchema,
    generateAsyncOperationResponseSchema: exports.generateAsyncOperationResponseSchema,
    generateBulkOperationResponseSchema: exports.generateBulkOperationResponseSchema,
    // Validation Schemas
    generateCidrValidationSchema: exports.generateCidrValidationSchema,
    generateIpAddressValidationSchema: exports.generateIpAddressValidationSchema,
    generatePortValidationSchema: exports.generatePortValidationSchema,
    generateResourceNameValidationSchema: exports.generateResourceNameValidationSchema,
    generateTagValidationSchema: exports.generateTagValidationSchema,
    // Enum Schema Generators
    generateNetworkStatusEnumSchema: exports.generateNetworkStatusEnumSchema,
    generateProtocolTypeEnumSchema: exports.generateProtocolTypeEnumSchema,
    generateFirewallActionEnumSchema: exports.generateFirewallActionEnumSchema,
    generateRegionEnumSchema: exports.generateRegionEnumSchema,
    generateAvailabilityZoneEnumSchema: exports.generateAvailabilityZoneEnumSchema,
    // Reference Schemas
    createSchemaReference: exports.createSchemaReference,
    generateArrayOfReferences: exports.generateArrayOfReferences,
    generateNestedSchemaWithReferences: exports.generateNestedSchemaWithReferences,
    generatePolymorphicSchema: exports.generatePolymorphicSchema,
    // Nested Schema Builders
    generateNestedNetworkConfigSchema: exports.generateNestedNetworkConfigSchema,
    generateNestedFirewallPolicySchema: exports.generateNestedFirewallPolicySchema,
    generateNestedMonitoringConfigSchema: exports.generateNestedMonitoringConfigSchema,
    generateNestedSecurityConfigSchema: exports.generateNestedSecurityConfigSchema,
    // Schema Composition Helpers
    composeSchemaWithAllOf: exports.composeSchemaWithAllOf,
    mergeSchemas: exports.mergeSchemas,
    extendSchema: exports.extendSchema,
};
//# sourceMappingURL=network-swagger-schemas-kit.js.map