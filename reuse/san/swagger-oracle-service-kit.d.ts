/**
 * LOC: SWOS1234567
 * File: /reuse/san/swagger-oracle-service-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Service registry implementations
 *   - API gateway services
 *   - Service mesh orchestration
 *   - Enterprise service bus (ESB) integrations
 */
/**
 * File: /reuse/san/swagger-oracle-service-kit.ts
 * Locator: WC-UTL-SWOS-001
 * Purpose: Enterprise Service Documentation Utilities - Service catalog, versioning, SLA, health checks, metrics
 *
 * Upstream: Independent utility module for enterprise service governance and documentation
 * Downstream: ../backend/*, Service registries, API gateways, ESB integrations, Service mesh
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Swagger/OpenAPI 3.x
 * Exports: 43 utility functions for service catalog management, versioning, SLA documentation, health endpoints, metrics
 *
 * LLM Context: Comprehensive enterprise service documentation utilities for implementing production-ready service governance
 * in White Cross healthcare system. Provides service catalog management, semantic versioning, dependency tracking, SLA
 * specifications, health check documentation, and metrics endpoints. Essential for Oracle Service Bus-style enterprise
 * service governance with HIPAA compliance and healthcare regulatory requirements.
 */
interface ServiceMetadata {
    serviceName: string;
    version: string;
    description: string;
    owner: string;
    team: string;
    tags: string[];
    category: string;
    environment: 'development' | 'staging' | 'production';
    status: 'active' | 'deprecated' | 'retired';
    createdAt: Date;
    updatedAt: Date;
}
interface ServiceCatalogEntry {
    id: string;
    metadata: ServiceMetadata;
    endpoints: ServiceEndpoint[];
    dependencies: ServiceDependency[];
    sla: ServiceSLA;
    documentation: string;
    openApiSpec: string;
}
interface ServiceEndpoint {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    summary: string;
    description: string;
    operationId: string;
    tags: string[];
    security: SecurityRequirement[];
    deprecated?: boolean;
}
interface ServiceDependency {
    serviceName: string;
    version: string;
    type: 'required' | 'optional';
    relationship: 'upstream' | 'downstream';
    protocol: 'REST' | 'SOAP' | 'gRPC' | 'GraphQL' | 'WebSocket';
    endpoint?: string;
}
interface ServiceSLA {
    availability: {
        percentage: number;
        description: string;
        measurement: string;
    };
    performance: {
        averageResponseTime: number;
        p95ResponseTime: number;
        p99ResponseTime: number;
        unit: 'ms' | 's';
    };
    throughput: {
        requestsPerSecond: number;
        peakCapacity: number;
    };
    errorRate: {
        maxPercentage: number;
        measurement: string;
    };
    support: {
        level: 'basic' | 'standard' | 'premium' | 'critical';
        responseTime: string;
        coverage: string;
    };
}
interface ServiceVersion {
    version: string;
    releaseDate: Date;
    status: 'development' | 'beta' | 'stable' | 'deprecated' | 'retired';
    breakingChanges: boolean;
    changelog: string[];
    compatibility: {
        backward: boolean;
        forward: boolean;
        minimumClientVersion?: string;
    };
    deprecationDate?: Date;
    retirementDate?: Date;
}
interface ServiceAnnotation {
    key: string;
    value: string | number | boolean;
    scope: 'service' | 'endpoint' | 'schema';
    description?: string;
    required?: boolean;
}
interface HealthCheckSpec {
    endpoint: string;
    method: 'GET' | 'POST';
    expectedStatus: number;
    timeout: number;
    interval: number;
    retries: number;
    headers?: Record<string, string>;
    dependencies?: string[];
    successCriteria: HealthCriteria;
}
interface HealthCriteria {
    statusCode: number;
    responseTime: number;
    requiredFields: string[];
    customValidation?: (response: any) => boolean;
}
interface ServiceMetricSpec {
    name: string;
    type: 'counter' | 'gauge' | 'histogram' | 'summary';
    description: string;
    unit?: string;
    labels: MetricLabel[];
    aggregation: 'sum' | 'avg' | 'min' | 'max' | 'count';
    retention: string;
}
interface MetricLabel {
    name: string;
    description: string;
    cardinality: 'low' | 'medium' | 'high';
    required: boolean;
}
interface SecurityRequirement {
    type: 'apiKey' | 'oauth2' | 'openIdConnect' | 'http' | 'mutualTLS';
    name: string;
    scopes?: string[];
    in?: 'header' | 'query' | 'cookie';
}
interface DependencyGraph {
    services: ServiceNode[];
    edges: DependencyEdge[];
    cycles: ServiceNode[][];
}
interface ServiceNode {
    id: string;
    name: string;
    version: string;
    level: number;
}
interface DependencyEdge {
    from: string;
    to: string;
    type: 'required' | 'optional';
    protocol: string;
}
/**
 * Creates a comprehensive service catalog entry with metadata and specifications.
 *
 * @param {ServiceMetadata} metadata - Service metadata
 * @param {ServiceEndpoint[]} endpoints - Service endpoints
 * @param {ServiceDependency[]} dependencies - Service dependencies
 * @param {ServiceSLA} sla - Service level agreement
 * @returns {ServiceCatalogEntry} Complete service catalog entry
 *
 * @example
 * ```typescript
 * const catalogEntry = createServiceCatalogEntry(
 *   {
 *     serviceName: 'patient-records-api',
 *     version: 'v2.1.0',
 *     description: 'HIPAA-compliant patient records management',
 *     owner: 'healthcare-platform-team',
 *     team: 'Platform Engineering',
 *     tags: ['healthcare', 'hipaa', 'patient-data'],
 *     category: 'healthcare-services',
 *     environment: 'production',
 *     status: 'active',
 *     createdAt: new Date('2024-01-01'),
 *     updatedAt: new Date()
 *   },
 *   endpoints,
 *   dependencies,
 *   slaSpec
 * );
 * ```
 */
export declare const createServiceCatalogEntry: (metadata: ServiceMetadata, endpoints: ServiceEndpoint[], dependencies: ServiceDependency[], sla: ServiceSLA) => ServiceCatalogEntry;
/**
 * Queries service catalog by tags with filtering and sorting.
 *
 * @param {ServiceCatalogEntry[]} catalog - Service catalog
 * @param {string[]} tags - Tags to filter by
 * @param {string} [status] - Service status filter
 * @returns {ServiceCatalogEntry[]} Filtered service entries
 *
 * @example
 * ```typescript
 * const hipaaServices = queryServicesByTags(
 *   catalog,
 *   ['hipaa', 'patient-data'],
 *   'active'
 * );
 * // Returns all active HIPAA-compliant patient data services
 * ```
 */
export declare const queryServicesByTags: (catalog: ServiceCatalogEntry[], tags: string[], status?: string) => ServiceCatalogEntry[];
/**
 * Registers a new service in the catalog with validation.
 *
 * @param {ServiceCatalogEntry} entry - Service catalog entry
 * @param {ServiceCatalogEntry[]} existingCatalog - Existing catalog
 * @returns {{ success: boolean; message: string; entry?: ServiceCatalogEntry }} Registration result
 *
 * @example
 * ```typescript
 * const result = registerService(newServiceEntry, catalog);
 * if (result.success) {
 *   console.log('Service registered:', result.entry.id);
 * } else {
 *   console.error('Registration failed:', result.message);
 * }
 * ```
 */
export declare const registerService: (entry: ServiceCatalogEntry, existingCatalog: ServiceCatalogEntry[]) => {
    success: boolean;
    message: string;
    entry?: ServiceCatalogEntry;
};
/**
 * Deregisters a service from the catalog with deprecation handling.
 *
 * @param {string} serviceId - Service identifier
 * @param {ServiceCatalogEntry[]} catalog - Service catalog
 * @param {boolean} [force] - Force removal even if dependencies exist
 * @returns {{ success: boolean; message: string; dependencies?: string[] }} Deregistration result
 *
 * @example
 * ```typescript
 * const result = deregisterService('patient-api-v1.0.0', catalog);
 * if (!result.success && result.dependencies) {
 *   console.warn('Cannot deregister: dependent services', result.dependencies);
 * }
 * ```
 */
export declare const deregisterService: (serviceId: string, catalog: ServiceCatalogEntry[], force?: boolean) => {
    success: boolean;
    message: string;
    dependencies?: string[];
};
/**
 * Discovers services by category with hierarchical grouping.
 *
 * @param {ServiceCatalogEntry[]} catalog - Service catalog
 * @param {string} category - Service category
 * @returns {Record<string, ServiceCatalogEntry[]>} Services grouped by version
 *
 * @example
 * ```typescript
 * const healthcareServices = discoverServicesByCategory(catalog, 'healthcare-services');
 * // Result: { 'patient-api': [v1, v2], 'appointment-api': [v1] }
 * ```
 */
export declare const discoverServicesByCategory: (catalog: ServiceCatalogEntry[], category: string) => Record<string, ServiceCatalogEntry[]>;
/**
 * Validates service catalog entry for completeness and compliance.
 *
 * @param {ServiceCatalogEntry} entry - Service catalog entry
 * @param {boolean} [requireHIPAACompliance] - Require HIPAA compliance tags
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateServiceCatalogEntry(entry, true);
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export declare const validateServiceCatalogEntry: (entry: ServiceCatalogEntry, requireHIPAACompliance?: boolean) => {
    valid: boolean;
    errors: string[];
};
/**
 * Generates service catalog index with search capabilities.
 *
 * @param {ServiceCatalogEntry[]} catalog - Service catalog
 * @returns {Record<string, any>} Searchable catalog index
 *
 * @example
 * ```typescript
 * const index = generateServiceCatalogIndex(catalog);
 * const patientServices = index.byKeyword['patient'];
 * const v2Services = index.byVersion['v2'];
 * ```
 */
export declare const generateServiceCatalogIndex: (catalog: ServiceCatalogEntry[]) => Record<string, any>;
/**
 * Exports service catalog to OpenAPI service registry format.
 *
 * @param {ServiceCatalogEntry} entry - Service catalog entry
 * @returns {Record<string, any>} OpenAPI service registry format
 *
 * @example
 * ```typescript
 * const registryEntry = exportToServiceRegistry(catalogEntry);
 * // Compatible with Oracle Service Bus, Kong, Apigee
 * ```
 */
export declare const exportToServiceRegistry: (entry: ServiceCatalogEntry) => Record<string, any>;
/**
 * Validates semantic version format and compliance.
 *
 * @param {string} version - Version string
 * @returns {{ valid: boolean; major: number; minor: number; patch: number; error?: string }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateSemanticVersion('v2.1.3');
 * // Result: { valid: true, major: 2, minor: 1, patch: 3 }
 * ```
 */
export declare const validateSemanticVersion: (version: string) => {
    valid: boolean;
    major: number;
    minor: number;
    patch: number;
    error?: string;
};
/**
 * Compares two service versions for compatibility.
 *
 * @param {string} version1 - First version
 * @param {string} version2 - Second version
 * @returns {{ compatible: boolean; relationship: 'greater' | 'less' | 'equal'; breaking: boolean }} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = compareServiceVersions('v2.1.0', 'v2.0.5');
 * // Result: { compatible: true, relationship: 'greater', breaking: false }
 * ```
 */
export declare const compareServiceVersions: (version1: string, version2: string) => {
    compatible: boolean;
    relationship: "greater" | "less" | "equal";
    breaking: boolean;
};
/**
 * Creates a service version deprecation policy.
 *
 * @param {string} version - Version to deprecate
 * @param {number} deprecationPeriodDays - Deprecation period in days
 * @param {string} migrationGuide - Migration guide URL
 * @returns {ServiceVersion} Service version with deprecation policy
 *
 * @example
 * ```typescript
 * const deprecatedVersion = createVersionDeprecationPolicy(
 *   'v1.0.0',
 *   180,
 *   '/docs/migration/v1-to-v2'
 * );
 * // Deprecates v1.0.0 with 180-day migration period
 * ```
 */
export declare const createVersionDeprecationPolicy: (version: string, deprecationPeriodDays: number, migrationGuide: string) => ServiceVersion;
/**
 * Generates version compatibility matrix for service versions.
 *
 * @param {ServiceVersion[]} versions - Array of service versions
 * @returns {Record<string, Record<string, boolean>>} Compatibility matrix
 *
 * @example
 * ```typescript
 * const matrix = generateVersionCompatibilityMatrix(versions);
 * const isCompatible = matrix['v2.0.0']['v1.5.0']; // true (backward compatible)
 * ```
 */
export declare const generateVersionCompatibilityMatrix: (versions: ServiceVersion[]) => Record<string, Record<string, boolean>>;
/**
 * Determines if version upgrade path is valid.
 *
 * @param {string} currentVersion - Current service version
 * @param {string} targetVersion - Target upgrade version
 * @param {ServiceVersion[]} availableVersions - Available versions
 * @returns {{ valid: boolean; path: string[]; warnings: string[] }} Upgrade path validation
 *
 * @example
 * ```typescript
 * const upgrade = determineVersionUpgradePath('v1.0.0', 'v3.0.0', versions);
 * // Result: { valid: true, path: ['v1.0.0', 'v2.0.0', 'v3.0.0'], warnings: [...] }
 * ```
 */
export declare const determineVersionUpgradePath: (currentVersion: string, targetVersion: string, availableVersions: ServiceVersion[]) => {
    valid: boolean;
    path: string[];
    warnings: string[];
};
/**
 * Generates version changelog with breaking changes highlighted.
 *
 * @param {ServiceVersion} version - Service version
 * @param {ServiceVersion} [previousVersion] - Previous version for comparison
 * @returns {string} Formatted changelog
 *
 * @example
 * ```typescript
 * const changelog = generateVersionChangelog(v2, v1);
 * // Markdown-formatted changelog with breaking changes highlighted
 * ```
 */
export declare const generateVersionChangelog: (version: ServiceVersion, previousVersion?: ServiceVersion) => string;
/**
 * Creates service metadata with healthcare compliance annotations.
 *
 * @param {Partial<ServiceMetadata>} metadata - Service metadata
 * @param {boolean} [hipaaCompliant] - Mark as HIPAA compliant
 * @returns {ServiceMetadata} Complete service metadata
 *
 * @example
 * ```typescript
 * const metadata = createServiceMetadata(
 *   { serviceName: 'patient-api', version: 'v2.0.0', owner: 'platform-team' },
 *   true
 * );
 * // Includes HIPAA compliance tags automatically
 * ```
 */
export declare const createServiceMetadata: (metadata: Partial<ServiceMetadata>, hipaaCompliant?: boolean) => ServiceMetadata;
/**
 * Extracts metadata from OpenAPI specification.
 *
 * @param {Record<string, any>} openApiSpec - OpenAPI specification object
 * @returns {Partial<ServiceMetadata>} Extracted metadata
 *
 * @example
 * ```typescript
 * const metadata = extractMetadataFromOpenAPI(openApiSpec);
 * // Extracts service name, version, description from OpenAPI info section
 * ```
 */
export declare const extractMetadataFromOpenAPI: (openApiSpec: Record<string, any>) => Partial<ServiceMetadata>;
/**
 * Parses service annotations for custom metadata.
 *
 * @param {Record<string, any>} annotations - Annotation object
 * @returns {ServiceAnnotation[]} Parsed annotations
 *
 * @example
 * ```typescript
 * const annotations = parseServiceAnnotations({
 *   'x-hipaa-compliant': true,
 *   'x-data-classification': 'phi',
 *   'x-retention-period': '7-years'
 * });
 * ```
 */
export declare const parseServiceAnnotations: (annotations: Record<string, any>) => ServiceAnnotation[];
/**
 * Validates custom service annotations against schema.
 *
 * @param {ServiceAnnotation[]} annotations - Service annotations
 * @param {Record<string, any>} [schema] - Annotation validation schema
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateServiceAnnotations(annotations, annotationSchema);
 * if (!validation.valid) {
 *   console.error('Invalid annotations:', validation.errors);
 * }
 * ```
 */
export declare const validateServiceAnnotations: (annotations: ServiceAnnotation[], schema?: Record<string, any>) => {
    valid: boolean;
    errors: string[];
};
/**
 * Builds custom metadata object from annotations.
 *
 * @param {ServiceAnnotation[]} annotations - Service annotations
 * @param {string} scope - Scope filter ('service' | 'endpoint' | 'schema')
 * @returns {Record<string, any>} Custom metadata object
 *
 * @example
 * ```typescript
 * const serviceMetadata = buildCustomMetadata(annotations, 'service');
 * // Result: { 'x-hipaa-compliant': true, 'x-data-classification': 'phi' }
 * ```
 */
export declare const buildCustomMetadata: (annotations: ServiceAnnotation[], scope: string) => Record<string, any>;
/**
 * Merges metadata from multiple sources with priority.
 *
 * @param {Partial<ServiceMetadata>[]} metadataSources - Array of metadata sources
 * @returns {ServiceMetadata} Merged metadata
 *
 * @example
 * ```typescript
 * const merged = mergeServiceMetadata([
 *   defaultMetadata,
 *   openApiMetadata,
 *   customMetadata
 * ]);
 * // Later sources override earlier ones
 * ```
 */
export declare const mergeServiceMetadata: (metadataSources: Partial<ServiceMetadata>[]) => ServiceMetadata;
/**
 * Generates metadata documentation in markdown format.
 *
 * @param {ServiceMetadata} metadata - Service metadata
 * @returns {string} Markdown documentation
 *
 * @example
 * ```typescript
 * const docs = generateMetadataDocumentation(metadata);
 * // Generates human-readable markdown documentation
 * ```
 */
export declare const generateMetadataDocumentation: (metadata: ServiceMetadata) => string;
/**
 * Creates service dependency specification.
 *
 * @param {string} serviceName - Dependency service name
 * @param {string} version - Dependency version
 * @param {string} type - Dependency type
 * @param {string} relationship - Dependency relationship
 * @returns {ServiceDependency} Service dependency
 *
 * @example
 * ```typescript
 * const dependency = createServiceDependency(
 *   'auth-service',
 *   'v2.0.0',
 *   'required',
 *   'upstream'
 * );
 * ```
 */
export declare const createServiceDependency: (serviceName: string, version: string, type: "required" | "optional", relationship: "upstream" | "downstream") => ServiceDependency;
/**
 * Generates dependency graph for service ecosystem.
 *
 * @param {ServiceCatalogEntry[]} catalog - Service catalog
 * @returns {DependencyGraph} Dependency graph
 *
 * @example
 * ```typescript
 * const graph = generateDependencyGraph(catalog);
 * // Visualize service dependencies and detect circular dependencies
 * ```
 */
export declare const generateDependencyGraph: (catalog: ServiceCatalogEntry[]) => DependencyGraph;
/**
 * Detects circular dependencies in service graph.
 *
 * @param {ServiceNode[]} services - Service nodes
 * @param {DependencyEdge[]} edges - Dependency edges
 * @returns {ServiceNode[][]} Array of circular dependency cycles
 *
 * @example
 * ```typescript
 * const cycles = detectCircularDependencies(services, edges);
 * if (cycles.length > 0) {
 *   console.error('Circular dependencies detected:', cycles);
 * }
 * ```
 */
export declare const detectCircularDependencies: (services: ServiceNode[], edges: DependencyEdge[]) => ServiceNode[][];
/**
 * Validates dependency versions for compatibility.
 *
 * @param {ServiceDependency[]} dependencies - Service dependencies
 * @param {ServiceCatalogEntry[]} catalog - Service catalog
 * @returns {{ valid: boolean; incompatible: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateDependencyVersions(dependencies, catalog);
 * if (!validation.valid) {
 *   console.warn('Incompatible dependencies:', validation.incompatible);
 * }
 * ```
 */
export declare const validateDependencyVersions: (dependencies: ServiceDependency[], catalog: ServiceCatalogEntry[]) => {
    valid: boolean;
    incompatible: string[];
};
/**
 * Generates dependency documentation with version constraints.
 *
 * @param {ServiceDependency[]} dependencies - Service dependencies
 * @returns {string} Markdown documentation
 *
 * @example
 * ```typescript
 * const docs = generateDependencyDocumentation(dependencies);
 * // Markdown table of dependencies with versions and types
 * ```
 */
export declare const generateDependencyDocumentation: (dependencies: ServiceDependency[]) => string;
/**
 * Creates comprehensive service SLA specification.
 *
 * @param {Partial<ServiceSLA>} sla - SLA configuration
 * @returns {ServiceSLA} Complete SLA specification
 *
 * @example
 * ```typescript
 * const sla = createServiceSLA({
 *   availability: { percentage: 99.9, description: '3 nines', measurement: 'monthly' },
 *   performance: { averageResponseTime: 200, p95ResponseTime: 500, p99ResponseTime: 1000, unit: 'ms' }
 * });
 * ```
 */
export declare const createServiceSLA: (sla: Partial<ServiceSLA>) => ServiceSLA;
/**
 * Validates SLA metrics against actual performance.
 *
 * @param {ServiceSLA} sla - SLA specification
 * @param {Record<string, number>} actualMetrics - Actual performance metrics
 * @returns {{ compliant: boolean; violations: string[] }} Compliance result
 *
 * @example
 * ```typescript
 * const compliance = validateSLACompliance(sla, {
 *   availability: 99.5,
 *   averageResponseTime: 250,
 *   errorRate: 0.5
 * });
 * ```
 */
export declare const validateSLACompliance: (sla: ServiceSLA, actualMetrics: Record<string, number>) => {
    compliant: boolean;
    violations: string[];
};
/**
 * Generates SLA documentation in OpenAPI format.
 *
 * @param {ServiceSLA} sla - SLA specification
 * @returns {string} Markdown SLA documentation
 *
 * @example
 * ```typescript
 * const slaDocs = generateSLADocumentation(sla);
 * // Human-readable SLA documentation for API consumers
 * ```
 */
export declare const generateSLADocumentation: (sla: ServiceSLA) => string;
/**
 * Calculates SLA uptime percentage from metrics.
 *
 * @param {number} totalMinutes - Total minutes in period
 * @param {number} downtimeMinutes - Downtime minutes
 * @returns {number} Uptime percentage
 *
 * @example
 * ```typescript
 * const uptime = calculateSLAUptime(43200, 10); // 30 days, 10 min downtime
 * // Result: 99.98%
 * ```
 */
export declare const calculateSLAUptime: (totalMinutes: number, downtimeMinutes: number) => number;
/**
 * Generates SLA alert thresholds for monitoring.
 *
 * @param {ServiceSLA} sla - SLA specification
 * @param {number} [warningMargin] - Warning margin percentage (default: 10)
 * @returns {Record<string, { warning: number; critical: number }>} Alert thresholds
 *
 * @example
 * ```typescript
 * const thresholds = generateSLAAlertThresholds(sla, 10);
 * // Result: { availability: { warning: 99.5, critical: 99.0 }, ... }
 * ```
 */
export declare const generateSLAAlertThresholds: (sla: ServiceSLA, warningMargin?: number) => Record<string, {
    warning: number;
    critical: number;
}>;
/**
 * Creates health check endpoint specification.
 *
 * @param {string} endpoint - Health check endpoint path
 * @param {Partial<HealthCheckSpec>} config - Health check configuration
 * @returns {HealthCheckSpec} Complete health check specification
 *
 * @example
 * ```typescript
 * const healthCheck = createHealthCheckSpec('/health', {
 *   timeout: 5000,
 *   interval: 30000,
 *   dependencies: ['database', 'redis', 'auth-service']
 * });
 * ```
 */
export declare const createHealthCheckSpec: (endpoint: string, config?: Partial<HealthCheckSpec>) => HealthCheckSpec;
/**
 * Generates OpenAPI specification for health endpoints.
 *
 * @param {HealthCheckSpec} healthCheck - Health check specification
 * @returns {Record<string, any>} OpenAPI path definition
 *
 * @example
 * ```typescript
 * const openApiPath = generateHealthEndpointSpec(healthCheck);
 * // Adds to OpenAPI paths section for /health endpoint
 * ```
 */
export declare const generateHealthEndpointSpec: (healthCheck: HealthCheckSpec) => Record<string, any>;
/**
 * Creates liveness probe specification for Kubernetes.
 *
 * @param {string} endpoint - Liveness probe endpoint
 * @param {number} [initialDelaySeconds] - Initial delay
 * @param {number} [periodSeconds] - Check period
 * @returns {Record<string, any>} Kubernetes liveness probe spec
 *
 * @example
 * ```typescript
 * const livenessProbe = createLivenessProbeSpec('/health/live', 30, 10);
 * // Kubernetes-compatible liveness probe configuration
 * ```
 */
export declare const createLivenessProbeSpec: (endpoint: string, initialDelaySeconds?: number, periodSeconds?: number) => Record<string, any>;
/**
 * Creates readiness probe specification for Kubernetes.
 *
 * @param {string} endpoint - Readiness probe endpoint
 * @param {number} [initialDelaySeconds] - Initial delay
 * @param {number} [periodSeconds] - Check period
 * @returns {Record<string, any>} Kubernetes readiness probe spec
 *
 * @example
 * ```typescript
 * const readinessProbe = createReadinessProbeSpec('/health/ready', 10, 5);
 * // Kubernetes-compatible readiness probe configuration
 * ```
 */
export declare const createReadinessProbeSpec: (endpoint: string, initialDelaySeconds?: number, periodSeconds?: number) => Record<string, any>;
/**
 * Aggregates health status from multiple dependencies.
 *
 * @param {Array<{ name: string; status: 'healthy' | 'degraded' | 'unhealthy' }>} dependencyStatuses - Dependency health statuses
 * @returns {{ overall: 'healthy' | 'degraded' | 'unhealthy'; details: Record<string, string> }} Aggregated health
 *
 * @example
 * ```typescript
 * const health = aggregateDependencyHealth([
 *   { name: 'database', status: 'healthy' },
 *   { name: 'redis', status: 'degraded' },
 *   { name: 'auth-service', status: 'healthy' }
 * ]);
 * // Result: { overall: 'degraded', details: {...} }
 * ```
 */
export declare const aggregateDependencyHealth: (dependencyStatuses: Array<{
    name: string;
    status: "healthy" | "degraded" | "unhealthy";
}>) => {
    overall: "healthy" | "degraded" | "unhealthy";
    details: Record<string, string>;
};
/**
 * Creates service metric specification for monitoring.
 *
 * @param {string} name - Metric name
 * @param {string} type - Metric type
 * @param {string} description - Metric description
 * @param {MetricLabel[]} labels - Metric labels
 * @returns {ServiceMetricSpec} Service metric specification
 *
 * @example
 * ```typescript
 * const metric = createServiceMetric(
 *   'http_requests_total',
 *   'counter',
 *   'Total HTTP requests',
 *   [{ name: 'method', description: 'HTTP method', cardinality: 'low', required: true }]
 * );
 * ```
 */
export declare const createServiceMetric: (name: string, type: "counter" | "gauge" | "histogram" | "summary", description: string, labels: MetricLabel[]) => ServiceMetricSpec;
/**
 * Generates Prometheus-compatible metric documentation.
 *
 * @param {ServiceMetricSpec} metric - Service metric specification
 * @returns {string} Prometheus metric help text
 *
 * @example
 * ```typescript
 * const promDocs = generatePrometheusMetricDoc(metric);
 * // # HELP http_requests_total Total HTTP requests
 * // # TYPE http_requests_total counter
 * ```
 */
export declare const generatePrometheusMetricDoc: (metric: ServiceMetricSpec) => string;
/**
 * Creates custom metric definition for business KPIs.
 *
 * @param {string} name - Metric name
 * @param {string} description - Metric description
 * @param {string} unit - Metric unit
 * @returns {ServiceMetricSpec} Custom metric specification
 *
 * @example
 * ```typescript
 * const kpi = createCustomMetric(
 *   'patient_appointments_scheduled',
 *   'Number of patient appointments scheduled',
 *   'appointments'
 * );
 * ```
 */
export declare const createCustomMetric: (name: string, description: string, unit: string) => ServiceMetricSpec;
/**
 * Generates OpenAPI specification for metrics endpoint.
 *
 * @param {ServiceMetricSpec[]} metrics - Service metrics
 * @returns {Record<string, any>} OpenAPI path definition for /metrics
 *
 * @example
 * ```typescript
 * const metricsEndpoint = generateMetricsEndpointSpec(metrics);
 * // Adds /metrics endpoint to OpenAPI specification
 * ```
 */
export declare const generateMetricsEndpointSpec: (metrics: ServiceMetricSpec[]) => Record<string, any>;
/**
 * Validates metric label cardinality for performance.
 *
 * @param {ServiceMetricSpec} metric - Service metric specification
 * @param {number} [maxHighCardinalityLabels] - Max high cardinality labels
 * @returns {{ valid: boolean; warnings: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateMetricCardinality(metric, 2);
 * if (!validation.valid) {
 *   console.warn('Metric cardinality issues:', validation.warnings);
 * }
 * ```
 */
export declare const validateMetricCardinality: (metric: ServiceMetricSpec, maxHighCardinalityLabels?: number) => {
    valid: boolean;
    warnings: string[];
};
declare const _default: {
    createServiceCatalogEntry: (metadata: ServiceMetadata, endpoints: ServiceEndpoint[], dependencies: ServiceDependency[], sla: ServiceSLA) => ServiceCatalogEntry;
    queryServicesByTags: (catalog: ServiceCatalogEntry[], tags: string[], status?: string) => ServiceCatalogEntry[];
    registerService: (entry: ServiceCatalogEntry, existingCatalog: ServiceCatalogEntry[]) => {
        success: boolean;
        message: string;
        entry?: ServiceCatalogEntry;
    };
    deregisterService: (serviceId: string, catalog: ServiceCatalogEntry[], force?: boolean) => {
        success: boolean;
        message: string;
        dependencies?: string[];
    };
    discoverServicesByCategory: (catalog: ServiceCatalogEntry[], category: string) => Record<string, ServiceCatalogEntry[]>;
    validateServiceCatalogEntry: (entry: ServiceCatalogEntry, requireHIPAACompliance?: boolean) => {
        valid: boolean;
        errors: string[];
    };
    generateServiceCatalogIndex: (catalog: ServiceCatalogEntry[]) => Record<string, any>;
    exportToServiceRegistry: (entry: ServiceCatalogEntry) => Record<string, any>;
    validateSemanticVersion: (version: string) => {
        valid: boolean;
        major: number;
        minor: number;
        patch: number;
        error?: string;
    };
    compareServiceVersions: (version1: string, version2: string) => {
        compatible: boolean;
        relationship: "greater" | "less" | "equal";
        breaking: boolean;
    };
    createVersionDeprecationPolicy: (version: string, deprecationPeriodDays: number, migrationGuide: string) => ServiceVersion;
    generateVersionCompatibilityMatrix: (versions: ServiceVersion[]) => Record<string, Record<string, boolean>>;
    determineVersionUpgradePath: (currentVersion: string, targetVersion: string, availableVersions: ServiceVersion[]) => {
        valid: boolean;
        path: string[];
        warnings: string[];
    };
    generateVersionChangelog: (version: ServiceVersion, previousVersion?: ServiceVersion) => string;
    createServiceMetadata: (metadata: Partial<ServiceMetadata>, hipaaCompliant?: boolean) => ServiceMetadata;
    extractMetadataFromOpenAPI: (openApiSpec: Record<string, any>) => Partial<ServiceMetadata>;
    parseServiceAnnotations: (annotations: Record<string, any>) => ServiceAnnotation[];
    validateServiceAnnotations: (annotations: ServiceAnnotation[], schema?: Record<string, any>) => {
        valid: boolean;
        errors: string[];
    };
    buildCustomMetadata: (annotations: ServiceAnnotation[], scope: string) => Record<string, any>;
    mergeServiceMetadata: (metadataSources: Partial<ServiceMetadata>[]) => ServiceMetadata;
    generateMetadataDocumentation: (metadata: ServiceMetadata) => string;
    createServiceDependency: (serviceName: string, version: string, type: "required" | "optional", relationship: "upstream" | "downstream") => ServiceDependency;
    generateDependencyGraph: (catalog: ServiceCatalogEntry[]) => DependencyGraph;
    detectCircularDependencies: (services: ServiceNode[], edges: DependencyEdge[]) => ServiceNode[][];
    validateDependencyVersions: (dependencies: ServiceDependency[], catalog: ServiceCatalogEntry[]) => {
        valid: boolean;
        incompatible: string[];
    };
    generateDependencyDocumentation: (dependencies: ServiceDependency[]) => string;
    createServiceSLA: (sla: Partial<ServiceSLA>) => ServiceSLA;
    validateSLACompliance: (sla: ServiceSLA, actualMetrics: Record<string, number>) => {
        compliant: boolean;
        violations: string[];
    };
    generateSLADocumentation: (sla: ServiceSLA) => string;
    calculateSLAUptime: (totalMinutes: number, downtimeMinutes: number) => number;
    generateSLAAlertThresholds: (sla: ServiceSLA, warningMargin?: number) => Record<string, {
        warning: number;
        critical: number;
    }>;
    createHealthCheckSpec: (endpoint: string, config?: Partial<HealthCheckSpec>) => HealthCheckSpec;
    generateHealthEndpointSpec: (healthCheck: HealthCheckSpec) => Record<string, any>;
    createLivenessProbeSpec: (endpoint: string, initialDelaySeconds?: number, periodSeconds?: number) => Record<string, any>;
    createReadinessProbeSpec: (endpoint: string, initialDelaySeconds?: number, periodSeconds?: number) => Record<string, any>;
    aggregateDependencyHealth: (dependencyStatuses: Array<{
        name: string;
        status: "healthy" | "degraded" | "unhealthy";
    }>) => {
        overall: "healthy" | "degraded" | "unhealthy";
        details: Record<string, string>;
    };
    createServiceMetric: (name: string, type: "counter" | "gauge" | "histogram" | "summary", description: string, labels: MetricLabel[]) => ServiceMetricSpec;
    generatePrometheusMetricDoc: (metric: ServiceMetricSpec) => string;
    createCustomMetric: (name: string, description: string, unit: string) => ServiceMetricSpec;
    generateMetricsEndpointSpec: (metrics: ServiceMetricSpec[]) => Record<string, any>;
    validateMetricCardinality: (metric: ServiceMetricSpec, maxHighCardinalityLabels?: number) => {
        valid: boolean;
        warnings: string[];
    };
};
export default _default;
//# sourceMappingURL=swagger-oracle-service-kit.d.ts.map