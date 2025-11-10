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
export declare enum NetworkStatus {
    PENDING = "pending",
    CREATING = "creating",
    ACTIVE = "active",
    UPDATING = "updating",
    DELETING = "deleting",
    DELETED = "deleted",
    ERROR = "error"
}
export declare enum NetworkType {
    PRIVATE = "private",
    PUBLIC = "public",
    HYBRID = "hybrid"
}
export declare enum SubnetType {
    PUBLIC = "public",
    PRIVATE = "private",
    ISOLATED = "isolated"
}
export declare enum RouteType {
    STATIC = "static",
    DYNAMIC = "dynamic",
    PROPAGATED = "propagated"
}
export declare enum FirewallRuleAction {
    ALLOW = "allow",
    DENY = "deny"
}
export declare enum FirewallRuleDirection {
    INGRESS = "ingress",
    EGRESS = "egress"
}
export declare enum ProtocolType {
    TCP = "tcp",
    UDP = "udp",
    ICMP = "icmp",
    ALL = "all"
}
export declare enum VpnType {
    SITE_TO_SITE = "site-to-site",
    CLIENT_VPN = "client-vpn"
}
export declare enum LoadBalancerType {
    APPLICATION = "application",
    NETWORK = "network",
    GATEWAY = "gateway"
}
interface SchemaPropertyConfig {
    type: string;
    description: string;
    example?: any;
    required?: boolean;
    format?: string;
    enum?: any[];
    items?: any;
    properties?: Record<string, any>;
    minLength?: number;
    maxLength?: number;
    minimum?: number;
    maximum?: number;
    pattern?: string;
    default?: any;
}
interface ReferenceSchemaConfig {
    ref: string;
    description?: string;
}
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
export declare const generateNetworkEntitySchema: () => any;
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
export declare const generateSubnetEntitySchema: () => any;
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
export declare const generateRouteEntitySchema: () => any;
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
export declare const generateFirewallRuleEntitySchema: () => any;
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
export declare const generateIpAddressEntitySchema: () => any;
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
export declare const generateNetworkCreateRequestSchema: () => any;
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
export declare const generateNetworkUpdateRequestSchema: () => any;
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
export declare const generateSubnetCreateRequestSchema: () => any;
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
export declare const generateRouteCreateRequestSchema: () => any;
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
export declare const generateFirewallRuleCreateRequestSchema: () => any;
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
export declare const generateVpnCreateRequestSchema: () => any;
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
export declare const generateLoadBalancerCreateRequestSchema: () => any;
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
export declare const generateNetworkResponseSchema: () => any;
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
export declare const generatePaginatedResponseSchema: (itemSchema: any, resourceName: string) => any;
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
export declare const generateErrorResponseSchema: () => any;
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
export declare const generateAsyncOperationResponseSchema: () => any;
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
export declare const generateBulkOperationResponseSchema: (operation: string) => any;
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
export declare const generateCidrValidationSchema: () => SchemaPropertyConfig;
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
export declare const generateIpAddressValidationSchema: (version: string) => SchemaPropertyConfig;
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
export declare const generatePortValidationSchema: (allowRange: boolean) => SchemaPropertyConfig;
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
export declare const generateResourceNameValidationSchema: () => SchemaPropertyConfig;
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
export declare const generateTagValidationSchema: () => SchemaPropertyConfig;
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
export declare const generateNetworkStatusEnumSchema: () => SchemaPropertyConfig;
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
export declare const generateProtocolTypeEnumSchema: () => SchemaPropertyConfig;
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
export declare const generateFirewallActionEnumSchema: () => SchemaPropertyConfig;
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
export declare const generateRegionEnumSchema: (regions: string[]) => SchemaPropertyConfig;
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
export declare const generateAvailabilityZoneEnumSchema: (region: string, zones: string[]) => SchemaPropertyConfig;
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
export declare const createSchemaReference: (schemaName: string, description?: string) => ReferenceSchemaConfig;
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
export declare const generateArrayOfReferences: (schemaName: string, description?: string) => any;
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
export declare const generateNestedSchemaWithReferences: (properties: Record<string, string>) => any;
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
export declare const generatePolymorphicSchema: (schemaNames: string[], discriminator: string) => any;
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
export declare const generateNestedNetworkConfigSchema: () => any;
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
export declare const generateNestedFirewallPolicySchema: () => any;
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
export declare const generateNestedMonitoringConfigSchema: () => any;
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
export declare const generateNestedSecurityConfigSchema: () => any;
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
export declare const composeSchemaWithAllOf: (baseSchemas: string[], additionalProperties?: any) => any;
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
export declare const mergeSchemas: (schemas: any[]) => any;
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
export declare const extendSchema: (baseSchema: any, additionalProperties: Record<string, SchemaPropertyConfig>, additionalRequired?: string[]) => any;
declare const _default: {
    NetworkStatus: typeof NetworkStatus;
    NetworkType: typeof NetworkType;
    SubnetType: typeof SubnetType;
    RouteType: typeof RouteType;
    FirewallRuleAction: typeof FirewallRuleAction;
    FirewallRuleDirection: typeof FirewallRuleDirection;
    ProtocolType: typeof ProtocolType;
    VpnType: typeof VpnType;
    LoadBalancerType: typeof LoadBalancerType;
    generateNetworkEntitySchema: () => any;
    generateSubnetEntitySchema: () => any;
    generateRouteEntitySchema: () => any;
    generateFirewallRuleEntitySchema: () => any;
    generateIpAddressEntitySchema: () => any;
    generateNetworkCreateRequestSchema: () => any;
    generateNetworkUpdateRequestSchema: () => any;
    generateSubnetCreateRequestSchema: () => any;
    generateRouteCreateRequestSchema: () => any;
    generateFirewallRuleCreateRequestSchema: () => any;
    generateVpnCreateRequestSchema: () => any;
    generateLoadBalancerCreateRequestSchema: () => any;
    generateNetworkResponseSchema: () => any;
    generatePaginatedResponseSchema: (itemSchema: any, resourceName: string) => any;
    generateErrorResponseSchema: () => any;
    generateAsyncOperationResponseSchema: () => any;
    generateBulkOperationResponseSchema: (operation: string) => any;
    generateCidrValidationSchema: () => SchemaPropertyConfig;
    generateIpAddressValidationSchema: (version: string) => SchemaPropertyConfig;
    generatePortValidationSchema: (allowRange: boolean) => SchemaPropertyConfig;
    generateResourceNameValidationSchema: () => SchemaPropertyConfig;
    generateTagValidationSchema: () => SchemaPropertyConfig;
    generateNetworkStatusEnumSchema: () => SchemaPropertyConfig;
    generateProtocolTypeEnumSchema: () => SchemaPropertyConfig;
    generateFirewallActionEnumSchema: () => SchemaPropertyConfig;
    generateRegionEnumSchema: (regions: string[]) => SchemaPropertyConfig;
    generateAvailabilityZoneEnumSchema: (region: string, zones: string[]) => SchemaPropertyConfig;
    createSchemaReference: (schemaName: string, description?: string) => ReferenceSchemaConfig;
    generateArrayOfReferences: (schemaName: string, description?: string) => any;
    generateNestedSchemaWithReferences: (properties: Record<string, string>) => any;
    generatePolymorphicSchema: (schemaNames: string[], discriminator: string) => any;
    generateNestedNetworkConfigSchema: () => any;
    generateNestedFirewallPolicySchema: () => any;
    generateNestedMonitoringConfigSchema: () => any;
    generateNestedSecurityConfigSchema: () => any;
    composeSchemaWithAllOf: (baseSchemas: string[], additionalProperties?: any) => any;
    mergeSchemas: (schemas: any[]) => any;
    extendSchema: (baseSchema: any, additionalProperties: Record<string, SchemaPropertyConfig>, additionalRequired?: string[]) => any;
};
export default _default;
//# sourceMappingURL=network-swagger-schemas-kit.d.ts.map