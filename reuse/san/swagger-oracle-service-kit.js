"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMetricCardinality = exports.generateMetricsEndpointSpec = exports.createCustomMetric = exports.generatePrometheusMetricDoc = exports.createServiceMetric = exports.aggregateDependencyHealth = exports.createReadinessProbeSpec = exports.createLivenessProbeSpec = exports.generateHealthEndpointSpec = exports.createHealthCheckSpec = exports.generateSLAAlertThresholds = exports.calculateSLAUptime = exports.generateSLADocumentation = exports.validateSLACompliance = exports.createServiceSLA = exports.generateDependencyDocumentation = exports.validateDependencyVersions = exports.detectCircularDependencies = exports.generateDependencyGraph = exports.createServiceDependency = exports.generateMetadataDocumentation = exports.mergeServiceMetadata = exports.buildCustomMetadata = exports.validateServiceAnnotations = exports.parseServiceAnnotations = exports.extractMetadataFromOpenAPI = exports.createServiceMetadata = exports.generateVersionChangelog = exports.determineVersionUpgradePath = exports.generateVersionCompatibilityMatrix = exports.createVersionDeprecationPolicy = exports.compareServiceVersions = exports.validateSemanticVersion = exports.exportToServiceRegistry = exports.generateServiceCatalogIndex = exports.validateServiceCatalogEntry = exports.discoverServicesByCategory = exports.deregisterService = exports.registerService = exports.queryServicesByTags = exports.createServiceCatalogEntry = void 0;
// ============================================================================
// SERVICE CATALOG MANAGEMENT
// ============================================================================
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
const createServiceCatalogEntry = (metadata, endpoints, dependencies, sla) => {
    return {
        id: `${metadata.serviceName}-${metadata.version}`,
        metadata,
        endpoints,
        dependencies,
        sla,
        documentation: `/docs/${metadata.serviceName}/${metadata.version}`,
        openApiSpec: `/openapi/${metadata.serviceName}/${metadata.version}.yaml`,
    };
};
exports.createServiceCatalogEntry = createServiceCatalogEntry;
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
const queryServicesByTags = (catalog, tags, status) => {
    return catalog.filter((entry) => {
        const hasAllTags = tags.every((tag) => entry.metadata.tags.includes(tag));
        const matchesStatus = status ? entry.metadata.status === status : true;
        return hasAllTags && matchesStatus;
    });
};
exports.queryServicesByTags = queryServicesByTags;
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
const registerService = (entry, existingCatalog) => {
    const exists = existingCatalog.some((e) => e.id === entry.id);
    if (exists) {
        return {
            success: false,
            message: `Service ${entry.id} already exists in catalog`,
        };
    }
    if (!entry.metadata.serviceName || !entry.metadata.version) {
        return {
            success: false,
            message: 'Service name and version are required',
        };
    }
    return {
        success: true,
        message: `Service ${entry.id} registered successfully`,
        entry,
    };
};
exports.registerService = registerService;
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
const deregisterService = (serviceId, catalog, force = false) => {
    const service = catalog.find((e) => e.id === serviceId);
    if (!service) {
        return {
            success: false,
            message: `Service ${serviceId} not found in catalog`,
        };
    }
    const dependents = catalog.filter((entry) => entry.dependencies.some((dep) => dep.serviceName === service.metadata.serviceName));
    if (dependents.length > 0 && !force) {
        return {
            success: false,
            message: 'Service has dependent services',
            dependencies: dependents.map((d) => d.id),
        };
    }
    return {
        success: true,
        message: `Service ${serviceId} deregistered successfully`,
    };
};
exports.deregisterService = deregisterService;
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
const discoverServicesByCategory = (catalog, category) => {
    const filtered = catalog.filter((entry) => entry.metadata.category === category);
    return filtered.reduce((acc, entry) => {
        const serviceName = entry.metadata.serviceName;
        if (!acc[serviceName]) {
            acc[serviceName] = [];
        }
        acc[serviceName].push(entry);
        return acc;
    }, {});
};
exports.discoverServicesByCategory = discoverServicesByCategory;
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
const validateServiceCatalogEntry = (entry, requireHIPAACompliance = false) => {
    const errors = [];
    if (!entry.metadata.serviceName)
        errors.push('Service name is required');
    if (!entry.metadata.version)
        errors.push('Version is required');
    if (!entry.metadata.owner)
        errors.push('Owner is required');
    if (entry.endpoints.length === 0)
        errors.push('At least one endpoint required');
    if (!entry.sla)
        errors.push('SLA specification is required');
    if (requireHIPAACompliance) {
        if (!entry.metadata.tags.includes('hipaa')) {
            errors.push('HIPAA compliance tag required for healthcare services');
        }
        if (!entry.endpoints.every((ep) => ep.security.length > 0)) {
            errors.push('All endpoints must have security requirements for HIPAA compliance');
        }
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateServiceCatalogEntry = validateServiceCatalogEntry;
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
const generateServiceCatalogIndex = (catalog) => {
    const index = {
        byName: {},
        byCategory: {},
        byTag: {},
        byVersion: {},
        byKeyword: {},
    };
    catalog.forEach((entry) => {
        // Index by name
        const name = entry.metadata.serviceName;
        if (!index.byName[name])
            index.byName[name] = [];
        index.byName[name].push(entry);
        // Index by category
        const category = entry.metadata.category;
        if (!index.byCategory[category])
            index.byCategory[category] = [];
        index.byCategory[category].push(entry);
        // Index by tags
        entry.metadata.tags.forEach((tag) => {
            if (!index.byTag[tag])
                index.byTag[tag] = [];
            index.byTag[tag].push(entry);
        });
        // Index by version
        const version = entry.metadata.version.split('.')[0];
        if (!index.byVersion[version])
            index.byVersion[version] = [];
        index.byVersion[version].push(entry);
        // Index by keywords
        const keywords = [
            ...entry.metadata.tags,
            entry.metadata.serviceName,
            entry.metadata.category,
        ];
        keywords.forEach((keyword) => {
            if (!index.byKeyword[keyword])
                index.byKeyword[keyword] = [];
            index.byKeyword[keyword].push(entry);
        });
    });
    return index;
};
exports.generateServiceCatalogIndex = generateServiceCatalogIndex;
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
const exportToServiceRegistry = (entry) => {
    return {
        name: entry.metadata.serviceName,
        version: entry.metadata.version,
        description: entry.metadata.description,
        owner: entry.metadata.owner,
        metadata: {
            team: entry.metadata.team,
            tags: entry.metadata.tags,
            category: entry.metadata.category,
            environment: entry.metadata.environment,
            status: entry.metadata.status,
        },
        endpoints: entry.endpoints.map((ep) => ({
            path: ep.path,
            method: ep.method,
            operationId: ep.operationId,
            summary: ep.summary,
            tags: ep.tags,
            security: ep.security,
        })),
        dependencies: entry.dependencies,
        sla: entry.sla,
        openApiSpecUrl: entry.openApiSpec,
        documentationUrl: entry.documentation,
    };
};
exports.exportToServiceRegistry = exportToServiceRegistry;
// ============================================================================
// SERVICE VERSIONING STRATEGIES
// ============================================================================
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
const validateSemanticVersion = (version) => {
    const semverRegex = /^v?(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.-]+))?$/;
    const match = version.match(semverRegex);
    if (!match) {
        return {
            valid: false,
            major: 0,
            minor: 0,
            patch: 0,
            error: 'Invalid semantic version format. Expected: v{major}.{minor}.{patch}',
        };
    }
    return {
        valid: true,
        major: parseInt(match[1]),
        minor: parseInt(match[2]),
        patch: parseInt(match[3]),
    };
};
exports.validateSemanticVersion = validateSemanticVersion;
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
const compareServiceVersions = (version1, version2) => {
    const v1 = (0, exports.validateSemanticVersion)(version1);
    const v2 = (0, exports.validateSemanticVersion)(version2);
    if (!v1.valid || !v2.valid) {
        throw new Error('Invalid version format');
    }
    const breaking = v1.major !== v2.major;
    const compatible = v1.major === v2.major;
    let relationship;
    if (v1.major !== v2.major) {
        relationship = v1.major > v2.major ? 'greater' : 'less';
    }
    else if (v1.minor !== v2.minor) {
        relationship = v1.minor > v2.minor ? 'greater' : 'less';
    }
    else if (v1.patch !== v2.patch) {
        relationship = v1.patch > v2.patch ? 'greater' : 'less';
    }
    else {
        relationship = 'equal';
    }
    return { compatible, relationship, breaking };
};
exports.compareServiceVersions = compareServiceVersions;
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
const createVersionDeprecationPolicy = (version, deprecationPeriodDays, migrationGuide) => {
    const now = new Date();
    const deprecationDate = new Date(now);
    const retirementDate = new Date(now);
    retirementDate.setDate(retirementDate.getDate() + deprecationPeriodDays);
    return {
        version,
        releaseDate: now,
        status: 'deprecated',
        breakingChanges: false,
        changelog: [
            `Version ${version} is deprecated`,
            `Migration period: ${deprecationPeriodDays} days`,
            `Migration guide: ${migrationGuide}`,
            `Retirement date: ${retirementDate.toISOString().split('T')[0]}`,
        ],
        compatibility: {
            backward: true,
            forward: false,
        },
        deprecationDate: now,
        retirementDate,
    };
};
exports.createVersionDeprecationPolicy = createVersionDeprecationPolicy;
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
const generateVersionCompatibilityMatrix = (versions) => {
    const matrix = {};
    versions.forEach((v1) => {
        matrix[v1.version] = {};
        versions.forEach((v2) => {
            const comparison = (0, exports.compareServiceVersions)(v1.version, v2.version);
            matrix[v1.version][v2.version] = comparison.compatible;
        });
    });
    return matrix;
};
exports.generateVersionCompatibilityMatrix = generateVersionCompatibilityMatrix;
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
const determineVersionUpgradePath = (currentVersion, targetVersion, availableVersions) => {
    const current = (0, exports.validateSemanticVersion)(currentVersion);
    const target = (0, exports.validateSemanticVersion)(targetVersion);
    const warnings = [];
    if (!current.valid || !target.valid) {
        return {
            valid: false,
            path: [],
            warnings: ['Invalid version format'],
        };
    }
    const path = [currentVersion];
    let currentMajor = current.major;
    while (currentMajor < target.major) {
        currentMajor++;
        const nextVersion = availableVersions.find((v) => (0, exports.validateSemanticVersion)(v.version).major === currentMajor);
        if (nextVersion) {
            path.push(nextVersion.version);
            if (nextVersion.breakingChanges) {
                warnings.push(`Breaking changes in ${nextVersion.version}`);
            }
        }
    }
    if (path[path.length - 1] !== targetVersion) {
        path.push(targetVersion);
    }
    return {
        valid: true,
        path,
        warnings,
    };
};
exports.determineVersionUpgradePath = determineVersionUpgradePath;
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
const generateVersionChangelog = (version, previousVersion) => {
    let changelog = `# Version ${version.version}\n\n`;
    changelog += `**Release Date:** ${version.releaseDate.toISOString().split('T')[0]}\n`;
    changelog += `**Status:** ${version.status}\n\n`;
    if (version.breakingChanges) {
        changelog += `## ⚠️ BREAKING CHANGES\n\n`;
    }
    if (previousVersion) {
        changelog += `## Changes from ${previousVersion.version}\n\n`;
    }
    changelog += `## Changelog\n\n`;
    version.changelog.forEach((change) => {
        changelog += `- ${change}\n`;
    });
    if (version.compatibility) {
        changelog += `\n## Compatibility\n\n`;
        changelog += `- Backward Compatible: ${version.compatibility.backward ? '✅' : '❌'}\n`;
        changelog += `- Forward Compatible: ${version.compatibility.forward ? '✅' : '❌'}\n`;
        if (version.compatibility.minimumClientVersion) {
            changelog += `- Minimum Client Version: ${version.compatibility.minimumClientVersion}\n`;
        }
    }
    if (version.deprecationDate) {
        changelog += `\n## Deprecation Notice\n\n`;
        changelog += `This version is deprecated as of ${version.deprecationDate.toISOString().split('T')[0]}\n`;
        if (version.retirementDate) {
            changelog += `Retirement date: ${version.retirementDate.toISOString().split('T')[0]}\n`;
        }
    }
    return changelog;
};
exports.generateVersionChangelog = generateVersionChangelog;
// ============================================================================
// SERVICE METADATA AND ANNOTATIONS
// ============================================================================
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
const createServiceMetadata = (metadata, hipaaCompliant = false) => {
    const defaultTags = hipaaCompliant ? ['hipaa', 'healthcare', 'phi'] : [];
    return {
        serviceName: metadata.serviceName || '',
        version: metadata.version || 'v1.0.0',
        description: metadata.description || '',
        owner: metadata.owner || '',
        team: metadata.team || '',
        tags: [...defaultTags, ...(metadata.tags || [])],
        category: metadata.category || 'general',
        environment: metadata.environment || 'development',
        status: metadata.status || 'active',
        createdAt: metadata.createdAt || new Date(),
        updatedAt: metadata.updatedAt || new Date(),
    };
};
exports.createServiceMetadata = createServiceMetadata;
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
const extractMetadataFromOpenAPI = (openApiSpec) => {
    const info = openApiSpec.info || {};
    const servers = openApiSpec.servers || [];
    return {
        serviceName: info.title?.toLowerCase().replace(/\s+/g, '-') || '',
        version: info.version || 'v1.0.0',
        description: info.description || '',
        tags: (openApiSpec.tags || []).map((tag) => tag.name),
    };
};
exports.extractMetadataFromOpenAPI = extractMetadataFromOpenAPI;
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
const parseServiceAnnotations = (annotations) => {
    return Object.entries(annotations).map(([key, value]) => ({
        key,
        value,
        scope: key.startsWith('x-service-') ? 'service' :
            key.startsWith('x-endpoint-') ? 'endpoint' :
                key.startsWith('x-schema-') ? 'schema' : 'service',
        description: `Custom annotation: ${key}`,
        required: false,
    }));
};
exports.parseServiceAnnotations = parseServiceAnnotations;
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
const validateServiceAnnotations = (annotations, schema) => {
    const errors = [];
    if (schema) {
        annotations.forEach((annotation) => {
            const schemaRule = schema[annotation.key];
            if (schemaRule) {
                if (schemaRule.required && !annotation.value) {
                    errors.push(`Annotation ${annotation.key} is required`);
                }
                if (schemaRule.type && typeof annotation.value !== schemaRule.type) {
                    errors.push(`Annotation ${annotation.key} must be of type ${schemaRule.type}`);
                }
            }
        });
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateServiceAnnotations = validateServiceAnnotations;
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
const buildCustomMetadata = (annotations, scope) => {
    return annotations
        .filter((annotation) => annotation.scope === scope)
        .reduce((acc, annotation) => {
        acc[annotation.key] = annotation.value;
        return acc;
    }, {});
};
exports.buildCustomMetadata = buildCustomMetadata;
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
const mergeServiceMetadata = (metadataSources) => {
    const merged = metadataSources.reduce((acc, source) => ({ ...acc, ...source }), {});
    return (0, exports.createServiceMetadata)(merged);
};
exports.mergeServiceMetadata = mergeServiceMetadata;
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
const generateMetadataDocumentation = (metadata) => {
    let docs = `# ${metadata.serviceName}\n\n`;
    docs += `**Version:** ${metadata.version}\n`;
    docs += `**Status:** ${metadata.status}\n`;
    docs += `**Category:** ${metadata.category}\n`;
    docs += `**Owner:** ${metadata.owner}\n`;
    docs += `**Team:** ${metadata.team}\n`;
    docs += `**Environment:** ${metadata.environment}\n\n`;
    if (metadata.description) {
        docs += `## Description\n\n${metadata.description}\n\n`;
    }
    if (metadata.tags.length > 0) {
        docs += `## Tags\n\n${metadata.tags.map((tag) => `- ${tag}`).join('\n')}\n\n`;
    }
    docs += `## Metadata\n\n`;
    docs += `- **Created:** ${metadata.createdAt.toISOString()}\n`;
    docs += `- **Updated:** ${metadata.updatedAt.toISOString()}\n`;
    if (metadata.tags.includes('hipaa')) {
        docs += `\n## Compliance\n\n`;
        docs += `⚕️ This service is HIPAA compliant and handles Protected Health Information (PHI).\n`;
    }
    return docs;
};
exports.generateMetadataDocumentation = generateMetadataDocumentation;
// ============================================================================
// SERVICE DEPENDENCY DOCUMENTATION
// ============================================================================
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
const createServiceDependency = (serviceName, version, type, relationship) => {
    return {
        serviceName,
        version,
        type,
        relationship,
        protocol: 'REST',
    };
};
exports.createServiceDependency = createServiceDependency;
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
const generateDependencyGraph = (catalog) => {
    const services = catalog.map((entry, index) => ({
        id: entry.id,
        name: entry.metadata.serviceName,
        version: entry.metadata.version,
        level: 0,
    }));
    const edges = [];
    catalog.forEach((entry) => {
        entry.dependencies.forEach((dep) => {
            const depEntry = catalog.find((e) => e.metadata.serviceName === dep.serviceName);
            if (depEntry) {
                edges.push({
                    from: entry.id,
                    to: depEntry.id,
                    type: dep.type,
                    protocol: dep.protocol,
                });
            }
        });
    });
    const cycles = (0, exports.detectCircularDependencies)(services, edges);
    return { services, edges, cycles };
};
exports.generateDependencyGraph = generateDependencyGraph;
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
const detectCircularDependencies = (services, edges) => {
    const cycles = [];
    const visited = new Set();
    const recursionStack = new Set();
    const dfs = (nodeId, path) => {
        visited.add(nodeId);
        recursionStack.add(nodeId);
        const node = services.find((s) => s.id === nodeId);
        if (node) {
            path.push(node);
        }
        const outgoingEdges = edges.filter((e) => e.from === nodeId);
        outgoingEdges.forEach((edge) => {
            if (!visited.has(edge.to)) {
                dfs(edge.to, [...path]);
            }
            else if (recursionStack.has(edge.to)) {
                const cycleStartIndex = path.findIndex((n) => n.id === edge.to);
                if (cycleStartIndex !== -1) {
                    cycles.push(path.slice(cycleStartIndex));
                }
            }
        });
        recursionStack.delete(nodeId);
    };
    services.forEach((service) => {
        if (!visited.has(service.id)) {
            dfs(service.id, []);
        }
    });
    return cycles;
};
exports.detectCircularDependencies = detectCircularDependencies;
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
const validateDependencyVersions = (dependencies, catalog) => {
    const incompatible = [];
    dependencies.forEach((dep) => {
        const service = catalog.find((e) => e.metadata.serviceName === dep.serviceName);
        if (service) {
            const comparison = (0, exports.compareServiceVersions)(dep.version, service.metadata.version);
            if (!comparison.compatible) {
                incompatible.push(`${dep.serviceName}: required ${dep.version}, available ${service.metadata.version}`);
            }
        }
        else if (dep.type === 'required') {
            incompatible.push(`${dep.serviceName} ${dep.version} not found in catalog`);
        }
    });
    return {
        valid: incompatible.length === 0,
        incompatible,
    };
};
exports.validateDependencyVersions = validateDependencyVersions;
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
const generateDependencyDocumentation = (dependencies) => {
    let docs = `## Service Dependencies\n\n`;
    docs += `| Service | Version | Type | Relationship | Protocol |\n`;
    docs += `|---------|---------|------|--------------|----------|\n`;
    dependencies.forEach((dep) => {
        docs += `| ${dep.serviceName} | ${dep.version} | ${dep.type} | ${dep.relationship} | ${dep.protocol} |\n`;
    });
    const required = dependencies.filter((d) => d.type === 'required');
    const optional = dependencies.filter((d) => d.type === 'optional');
    docs += `\n**Required Dependencies:** ${required.length}\n`;
    docs += `**Optional Dependencies:** ${optional.length}\n`;
    return docs;
};
exports.generateDependencyDocumentation = generateDependencyDocumentation;
// ============================================================================
// SERVICE SLA SPECIFICATIONS
// ============================================================================
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
const createServiceSLA = (sla) => {
    return {
        availability: sla.availability || {
            percentage: 99.0,
            description: 'Standard availability',
            measurement: 'monthly',
        },
        performance: sla.performance || {
            averageResponseTime: 1000,
            p95ResponseTime: 2000,
            p99ResponseTime: 5000,
            unit: 'ms',
        },
        throughput: sla.throughput || {
            requestsPerSecond: 100,
            peakCapacity: 500,
        },
        errorRate: sla.errorRate || {
            maxPercentage: 1.0,
            measurement: 'per 1000 requests',
        },
        support: sla.support || {
            level: 'standard',
            responseTime: '24 hours',
            coverage: 'business hours',
        },
    };
};
exports.createServiceSLA = createServiceSLA;
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
const validateSLACompliance = (sla, actualMetrics) => {
    const violations = [];
    if (actualMetrics.availability !== undefined) {
        if (actualMetrics.availability < sla.availability.percentage) {
            violations.push(`Availability ${actualMetrics.availability}% below SLA ${sla.availability.percentage}%`);
        }
    }
    if (actualMetrics.averageResponseTime !== undefined) {
        if (actualMetrics.averageResponseTime > sla.performance.averageResponseTime) {
            violations.push(`Average response time ${actualMetrics.averageResponseTime}${sla.performance.unit} exceeds SLA ${sla.performance.averageResponseTime}${sla.performance.unit}`);
        }
    }
    if (actualMetrics.errorRate !== undefined) {
        if (actualMetrics.errorRate > sla.errorRate.maxPercentage) {
            violations.push(`Error rate ${actualMetrics.errorRate}% exceeds SLA ${sla.errorRate.maxPercentage}%`);
        }
    }
    return {
        compliant: violations.length === 0,
        violations,
    };
};
exports.validateSLACompliance = validateSLACompliance;
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
const generateSLADocumentation = (sla) => {
    let docs = `## Service Level Agreement (SLA)\n\n`;
    docs += `### Availability\n`;
    docs += `- **Target:** ${sla.availability.percentage}% (${sla.availability.description})\n`;
    docs += `- **Measurement:** ${sla.availability.measurement}\n\n`;
    docs += `### Performance\n`;
    docs += `- **Average Response Time:** ${sla.performance.averageResponseTime}${sla.performance.unit}\n`;
    docs += `- **95th Percentile:** ${sla.performance.p95ResponseTime}${sla.performance.unit}\n`;
    docs += `- **99th Percentile:** ${sla.performance.p99ResponseTime}${sla.performance.unit}\n\n`;
    docs += `### Throughput\n`;
    docs += `- **Requests/Second:** ${sla.throughput.requestsPerSecond}\n`;
    docs += `- **Peak Capacity:** ${sla.throughput.peakCapacity} req/s\n\n`;
    docs += `### Error Rate\n`;
    docs += `- **Maximum:** ${sla.errorRate.maxPercentage}%\n`;
    docs += `- **Measurement:** ${sla.errorRate.measurement}\n\n`;
    docs += `### Support\n`;
    docs += `- **Level:** ${sla.support.level}\n`;
    docs += `- **Response Time:** ${sla.support.responseTime}\n`;
    docs += `- **Coverage:** ${sla.support.coverage}\n`;
    return docs;
};
exports.generateSLADocumentation = generateSLADocumentation;
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
const calculateSLAUptime = (totalMinutes, downtimeMinutes) => {
    return ((totalMinutes - downtimeMinutes) / totalMinutes) * 100;
};
exports.calculateSLAUptime = calculateSLAUptime;
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
const generateSLAAlertThresholds = (sla, warningMargin = 10) => {
    return {
        availability: {
            warning: sla.availability.percentage - (sla.availability.percentage * warningMargin / 100),
            critical: sla.availability.percentage,
        },
        averageResponseTime: {
            warning: sla.performance.averageResponseTime * (1 + warningMargin / 100),
            critical: sla.performance.averageResponseTime,
        },
        errorRate: {
            warning: sla.errorRate.maxPercentage * (1 - warningMargin / 100),
            critical: sla.errorRate.maxPercentage,
        },
    };
};
exports.generateSLAAlertThresholds = generateSLAAlertThresholds;
// ============================================================================
// SERVICE HEALTH ENDPOINT DOCUMENTATION
// ============================================================================
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
const createHealthCheckSpec = (endpoint, config = {}) => {
    return {
        endpoint,
        method: config.method || 'GET',
        expectedStatus: config.expectedStatus || 200,
        timeout: config.timeout || 5000,
        interval: config.interval || 30000,
        retries: config.retries || 3,
        headers: config.headers,
        dependencies: config.dependencies || [],
        successCriteria: config.successCriteria || {
            statusCode: 200,
            responseTime: 5000,
            requiredFields: ['status'],
        },
    };
};
exports.createHealthCheckSpec = createHealthCheckSpec;
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
const generateHealthEndpointSpec = (healthCheck) => {
    return {
        [healthCheck.endpoint]: {
            [healthCheck.method.toLowerCase()]: {
                summary: 'Health check endpoint',
                description: 'Returns service health status and dependency checks',
                operationId: 'healthCheck',
                tags: ['health', 'monitoring'],
                responses: {
                    [healthCheck.expectedStatus]: {
                        description: 'Service is healthy',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string', enum: ['healthy', 'degraded', 'unhealthy'] },
                                        timestamp: { type: 'string', format: 'date-time' },
                                        dependencies: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    name: { type: 'string' },
                                                    status: { type: 'string' },
                                                    responseTime: { type: 'number' },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    503: {
                        description: 'Service is unhealthy',
                    },
                },
            },
        },
    };
};
exports.generateHealthEndpointSpec = generateHealthEndpointSpec;
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
const createLivenessProbeSpec = (endpoint, initialDelaySeconds = 30, periodSeconds = 10) => {
    return {
        httpGet: {
            path: endpoint,
            port: 3000,
            scheme: 'HTTP',
        },
        initialDelaySeconds,
        periodSeconds,
        timeoutSeconds: 5,
        successThreshold: 1,
        failureThreshold: 3,
    };
};
exports.createLivenessProbeSpec = createLivenessProbeSpec;
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
const createReadinessProbeSpec = (endpoint, initialDelaySeconds = 10, periodSeconds = 5) => {
    return {
        httpGet: {
            path: endpoint,
            port: 3000,
            scheme: 'HTTP',
        },
        initialDelaySeconds,
        periodSeconds,
        timeoutSeconds: 3,
        successThreshold: 1,
        failureThreshold: 3,
    };
};
exports.createReadinessProbeSpec = createReadinessProbeSpec;
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
const aggregateDependencyHealth = (dependencyStatuses) => {
    const details = {};
    let overall = 'healthy';
    dependencyStatuses.forEach((dep) => {
        details[dep.name] = dep.status;
        if (dep.status === 'unhealthy') {
            overall = 'unhealthy';
        }
        else if (dep.status === 'degraded' && overall !== 'unhealthy') {
            overall = 'degraded';
        }
    });
    return { overall, details };
};
exports.aggregateDependencyHealth = aggregateDependencyHealth;
// ============================================================================
// SERVICE METRICS DOCUMENTATION
// ============================================================================
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
const createServiceMetric = (name, type, description, labels) => {
    return {
        name,
        type,
        description,
        labels,
        aggregation: type === 'counter' ? 'sum' : 'avg',
        retention: '30d',
    };
};
exports.createServiceMetric = createServiceMetric;
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
const generatePrometheusMetricDoc = (metric) => {
    let doc = `# HELP ${metric.name} ${metric.description}\n`;
    doc += `# TYPE ${metric.name} ${metric.type}\n`;
    if (metric.labels.length > 0) {
        doc += `# Labels: ${metric.labels.map((l) => l.name).join(', ')}\n`;
    }
    return doc;
};
exports.generatePrometheusMetricDoc = generatePrometheusMetricDoc;
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
const createCustomMetric = (name, description, unit) => {
    return {
        name,
        type: 'counter',
        description,
        unit,
        labels: [],
        aggregation: 'sum',
        retention: '90d',
    };
};
exports.createCustomMetric = createCustomMetric;
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
const generateMetricsEndpointSpec = (metrics) => {
    return {
        '/metrics': {
            get: {
                summary: 'Prometheus metrics endpoint',
                description: 'Returns service metrics in Prometheus format',
                operationId: 'getMetrics',
                tags: ['metrics', 'monitoring'],
                responses: {
                    200: {
                        description: 'Metrics in Prometheus text format',
                        content: {
                            'text/plain': {
                                schema: {
                                    type: 'string',
                                },
                                example: metrics.map((m) => (0, exports.generatePrometheusMetricDoc)(m)).join('\n'),
                            },
                        },
                    },
                },
            },
        },
    };
};
exports.generateMetricsEndpointSpec = generateMetricsEndpointSpec;
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
const validateMetricCardinality = (metric, maxHighCardinalityLabels = 2) => {
    const warnings = [];
    const highCardinalityLabels = metric.labels.filter((l) => l.cardinality === 'high');
    if (highCardinalityLabels.length > maxHighCardinalityLabels) {
        warnings.push(`Metric ${metric.name} has ${highCardinalityLabels.length} high cardinality labels (max: ${maxHighCardinalityLabels})`);
    }
    const totalLabels = metric.labels.length;
    if (totalLabels > 10) {
        warnings.push(`Metric ${metric.name} has ${totalLabels} labels, consider reducing for performance`);
    }
    return {
        valid: warnings.length === 0,
        warnings,
    };
};
exports.validateMetricCardinality = validateMetricCardinality;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Service Catalog Management
    createServiceCatalogEntry: exports.createServiceCatalogEntry,
    queryServicesByTags: exports.queryServicesByTags,
    registerService: exports.registerService,
    deregisterService: exports.deregisterService,
    discoverServicesByCategory: exports.discoverServicesByCategory,
    validateServiceCatalogEntry: exports.validateServiceCatalogEntry,
    generateServiceCatalogIndex: exports.generateServiceCatalogIndex,
    exportToServiceRegistry: exports.exportToServiceRegistry,
    // Service Versioning Strategies
    validateSemanticVersion: exports.validateSemanticVersion,
    compareServiceVersions: exports.compareServiceVersions,
    createVersionDeprecationPolicy: exports.createVersionDeprecationPolicy,
    generateVersionCompatibilityMatrix: exports.generateVersionCompatibilityMatrix,
    determineVersionUpgradePath: exports.determineVersionUpgradePath,
    generateVersionChangelog: exports.generateVersionChangelog,
    // Service Metadata and Annotations
    createServiceMetadata: exports.createServiceMetadata,
    extractMetadataFromOpenAPI: exports.extractMetadataFromOpenAPI,
    parseServiceAnnotations: exports.parseServiceAnnotations,
    validateServiceAnnotations: exports.validateServiceAnnotations,
    buildCustomMetadata: exports.buildCustomMetadata,
    mergeServiceMetadata: exports.mergeServiceMetadata,
    generateMetadataDocumentation: exports.generateMetadataDocumentation,
    // Service Dependency Documentation
    createServiceDependency: exports.createServiceDependency,
    generateDependencyGraph: exports.generateDependencyGraph,
    detectCircularDependencies: exports.detectCircularDependencies,
    validateDependencyVersions: exports.validateDependencyVersions,
    generateDependencyDocumentation: exports.generateDependencyDocumentation,
    // Service SLA Specifications
    createServiceSLA: exports.createServiceSLA,
    validateSLACompliance: exports.validateSLACompliance,
    generateSLADocumentation: exports.generateSLADocumentation,
    calculateSLAUptime: exports.calculateSLAUptime,
    generateSLAAlertThresholds: exports.generateSLAAlertThresholds,
    // Service Health Endpoint Documentation
    createHealthCheckSpec: exports.createHealthCheckSpec,
    generateHealthEndpointSpec: exports.generateHealthEndpointSpec,
    createLivenessProbeSpec: exports.createLivenessProbeSpec,
    createReadinessProbeSpec: exports.createReadinessProbeSpec,
    aggregateDependencyHealth: exports.aggregateDependencyHealth,
    // Service Metrics Documentation
    createServiceMetric: exports.createServiceMetric,
    generatePrometheusMetricDoc: exports.generatePrometheusMetricDoc,
    createCustomMetric: exports.createCustomMetric,
    generateMetricsEndpointSpec: exports.generateMetricsEndpointSpec,
    validateMetricCardinality: exports.validateMetricCardinality,
};
//# sourceMappingURL=swagger-oracle-service-kit.js.map