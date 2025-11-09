"use strict";
/**
 * LOC: STIX1234567
 * File: /reuse/threat/stix-taxii-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence services
 *   - STIX/TAXII servers and clients
 *   - Threat sharing platforms
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyStixMarking = exports.getLatestStixVersion = exports.createStixVersion = exports.filterStixByDateRange = exports.queryStixObjects = exports.convertBundleToEnvelope = exports.deserializeStixBundle = exports.serializeStixBundle = exports.createTaxiiApiSpec = exports.createTaxiiController = exports.createStixProcessingService = exports.defineTaxiiCollectionModel = exports.defineStixObjectModel = exports.parseStixPattern = exports.convertFromStixIndicator = exports.generateStixPattern = exports.convertToStixIndicator = exports.pushTaxiiObjects = exports.fetchTaxiiObjects = exports.fetchTaxiiCollections = exports.fetchTaxiiDiscovery = exports.createTaxiiEnvelope = exports.createTaxiiStatus = exports.createTaxiiManifestEntry = exports.createTaxiiCollection = exports.createTaxiiApiRoot = exports.createTaxiiDiscovery = exports.traverseStixGraph = exports.findRelatedObjects = exports.buildStixGraph = exports.mergeStixBundles = exports.extractObjectsByType = exports.validateStixBundle = exports.createStixBundle = exports.validateStixRelationship = exports.validateStixPattern = exports.validateStixObject = exports.createStixRelationship = exports.createStixObservable = exports.createStixMalware = exports.createStixThreatActor = exports.createStixIndicator = void 0;
// ============================================================================
// STIX OBJECT CREATION
// ============================================================================
/**
 * Creates a STIX 2.1 Indicator object.
 *
 * @param {Partial<StixIndicator>} data - Indicator data
 * @returns {StixIndicator} STIX Indicator object
 * @throws {Error} If required fields are missing
 *
 * @example
 * ```typescript
 * const indicator = createStixIndicator({
 *   name: 'Malicious IP',
 *   pattern: "[ipv4-addr:value = '192.0.2.0']",
 *   pattern_type: 'stix',
 *   valid_from: new Date().toISOString(),
 *   indicator_types: ['malicious-activity']
 * });
 * ```
 */
const createStixIndicator = (data) => {
    if (!data.name || !data.pattern || !data.pattern_type || !data.valid_from) {
        throw new Error('Indicator requires name, pattern, pattern_type, and valid_from');
    }
    const now = new Date().toISOString();
    const id = data.id || `indicator--${generateUuid()}`;
    return {
        type: 'indicator',
        spec_version: '2.1',
        id,
        created: data.created || now,
        modified: data.modified || now,
        name: data.name,
        pattern: data.pattern,
        pattern_type: data.pattern_type,
        valid_from: data.valid_from,
        description: data.description,
        indicator_types: data.indicator_types || [],
        valid_until: data.valid_until,
        kill_chain_phases: data.kill_chain_phases,
        created_by_ref: data.created_by_ref,
        labels: data.labels,
        confidence: data.confidence,
    };
};
exports.createStixIndicator = createStixIndicator;
/**
 * Creates a STIX 2.1 Threat Actor object.
 *
 * @param {Partial<StixThreatActor>} data - Threat actor data
 * @returns {StixThreatActor} STIX Threat Actor object
 * @throws {Error} If required fields are missing
 *
 * @example
 * ```typescript
 * const actor = createStixThreatActor({
 *   name: 'APT29',
 *   threat_actor_types: ['nation-state'],
 *   description: 'Russian APT group',
 *   aliases: ['Cozy Bear', 'The Dukes']
 * });
 * ```
 */
const createStixThreatActor = (data) => {
    if (!data.name) {
        throw new Error('Threat Actor requires name');
    }
    const now = new Date().toISOString();
    const id = data.id || `threat-actor--${generateUuid()}`;
    return {
        type: 'threat-actor',
        spec_version: '2.1',
        id,
        created: data.created || now,
        modified: data.modified || now,
        name: data.name,
        description: data.description,
        threat_actor_types: data.threat_actor_types || [],
        aliases: data.aliases,
        first_seen: data.first_seen,
        last_seen: data.last_seen,
        roles: data.roles,
        goals: data.goals,
        sophistication: data.sophistication,
        resource_level: data.resource_level,
        primary_motivation: data.primary_motivation,
    };
};
exports.createStixThreatActor = createStixThreatActor;
/**
 * Creates a STIX 2.1 Malware object.
 *
 * @param {Partial<StixMalware>} data - Malware data
 * @returns {StixMalware} STIX Malware object
 * @throws {Error} If required fields are missing
 *
 * @example
 * ```typescript
 * const malware = createStixMalware({
 *   name: 'WannaCry',
 *   is_family: true,
 *   malware_types: ['ransomware'],
 *   description: 'Ransomware that affected global systems'
 * });
 * ```
 */
const createStixMalware = (data) => {
    if (!data.name || data.is_family === undefined) {
        throw new Error('Malware requires name and is_family');
    }
    const now = new Date().toISOString();
    const id = data.id || `malware--${generateUuid()}`;
    return {
        type: 'malware',
        spec_version: '2.1',
        id,
        created: data.created || now,
        modified: data.modified || now,
        name: data.name,
        is_family: data.is_family,
        description: data.description,
        malware_types: data.malware_types || [],
        aliases: data.aliases,
        kill_chain_phases: data.kill_chain_phases,
        first_seen: data.first_seen,
        last_seen: data.last_seen,
    };
};
exports.createStixMalware = createStixMalware;
/**
 * Creates a STIX 2.1 Observed Data object.
 *
 * @param {Partial<StixObservable>} data - Observable data
 * @returns {StixObservable} STIX Observable object
 * @throws {Error} If required fields are missing
 *
 * @example
 * ```typescript
 * const observable = createStixObservable({
 *   first_observed: new Date().toISOString(),
 *   last_observed: new Date().toISOString(),
 *   number_observed: 1,
 *   objects: {
 *     '0': { type: 'ipv4-addr', value: '192.0.2.0' }
 *   }
 * });
 * ```
 */
const createStixObservable = (data) => {
    if (!data.first_observed || !data.last_observed || !data.number_observed || !data.objects) {
        throw new Error('Observable requires first_observed, last_observed, number_observed, and objects');
    }
    const now = new Date().toISOString();
    const id = data.id || `observed-data--${generateUuid()}`;
    return {
        type: 'observed-data',
        spec_version: '2.1',
        id,
        created: data.created || now,
        modified: data.modified || now,
        first_observed: data.first_observed,
        last_observed: data.last_observed,
        number_observed: data.number_observed,
        objects: data.objects,
    };
};
exports.createStixObservable = createStixObservable;
/**
 * Creates a STIX 2.1 Relationship object.
 *
 * @param {Partial<StixRelationship>} data - Relationship data
 * @returns {StixRelationship} STIX Relationship object
 * @throws {Error} If required fields are missing
 *
 * @example
 * ```typescript
 * const relationship = createStixRelationship({
 *   relationship_type: 'uses',
 *   source_ref: 'threat-actor--123',
 *   target_ref: 'malware--456'
 * });
 * ```
 */
const createStixRelationship = (data) => {
    if (!data.relationship_type || !data.source_ref || !data.target_ref) {
        throw new Error('Relationship requires relationship_type, source_ref, and target_ref');
    }
    const now = new Date().toISOString();
    const id = data.id || `relationship--${generateUuid()}`;
    return {
        type: 'relationship',
        spec_version: '2.1',
        id,
        created: data.created || now,
        modified: data.modified || now,
        relationship_type: data.relationship_type,
        source_ref: data.source_ref,
        target_ref: data.target_ref,
        start_time: data.start_time,
        stop_time: data.stop_time,
    };
};
exports.createStixRelationship = createStixRelationship;
// ============================================================================
// STIX VALIDATION
// ============================================================================
/**
 * Validates STIX 2.1 object structure.
 *
 * @param {StixObject} obj - STIX object to validate
 * @returns {boolean} True if valid
 * @throws {Error} If validation fails
 *
 * @example
 * ```typescript
 * const isValid = validateStixObject(indicator);
 * ```
 */
const validateStixObject = (obj) => {
    if (!obj.type || !obj.spec_version || !obj.id || !obj.created || !obj.modified) {
        throw new Error('STIX object missing required fields: type, spec_version, id, created, modified');
    }
    if (obj.spec_version !== '2.1') {
        throw new Error('Only STIX 2.1 is supported');
    }
    if (!obj.id.includes('--')) {
        throw new Error('STIX ID must follow format: type--uuid');
    }
    const idType = obj.id.split('--')[0];
    if (idType !== obj.type) {
        throw new Error(`STIX ID type (${idType}) does not match object type (${obj.type})`);
    }
    return true;
};
exports.validateStixObject = validateStixObject;
/**
 * Validates STIX indicator pattern syntax.
 *
 * @param {string} pattern - STIX pattern
 * @param {string} patternType - Pattern type
 * @returns {boolean} True if pattern is valid
 * @throws {Error} If pattern is invalid
 *
 * @example
 * ```typescript
 * const isValid = validateStixPattern("[ipv4-addr:value = '192.0.2.0']", 'stix');
 * ```
 */
const validateStixPattern = (pattern, patternType) => {
    if (!pattern || typeof pattern !== 'string') {
        throw new Error('Pattern must be a non-empty string');
    }
    if (patternType === 'stix') {
        if (!pattern.startsWith('[') || !pattern.endsWith(']')) {
            throw new Error('STIX pattern must be enclosed in square brackets');
        }
        // Basic validation - in production, use a proper STIX pattern parser
        if (!pattern.includes(':')) {
            throw new Error('STIX pattern must contain object type and property');
        }
    }
    return true;
};
exports.validateStixPattern = validateStixPattern;
/**
 * Validates STIX relationship consistency.
 *
 * @param {StixRelationship} relationship - Relationship to validate
 * @param {StixObject[]} objects - Related objects
 * @returns {boolean} True if relationship is valid
 * @throws {Error} If relationship is invalid
 *
 * @example
 * ```typescript
 * const isValid = validateStixRelationship(relationship, [threatActor, malware]);
 * ```
 */
const validateStixRelationship = (relationship, objects) => {
    const sourceExists = objects.some(obj => obj.id === relationship.source_ref);
    const targetExists = objects.some(obj => obj.id === relationship.target_ref);
    if (!sourceExists) {
        throw new Error(`Source object ${relationship.source_ref} not found`);
    }
    if (!targetExists) {
        throw new Error(`Target object ${relationship.target_ref} not found`);
    }
    return true;
};
exports.validateStixRelationship = validateStixRelationship;
// ============================================================================
// STIX BUNDLE MANAGEMENT
// ============================================================================
/**
 * Creates a STIX 2.1 Bundle.
 *
 * @param {StixObject[]} objects - STIX objects to include
 * @returns {StixBundle} STIX Bundle
 *
 * @example
 * ```typescript
 * const bundle = createStixBundle([indicator, threatActor, relationship]);
 * ```
 */
const createStixBundle = (objects) => {
    return {
        type: 'bundle',
        id: `bundle--${generateUuid()}`,
        objects,
    };
};
exports.createStixBundle = createStixBundle;
/**
 * Validates STIX bundle integrity.
 *
 * @param {StixBundle} bundle - Bundle to validate
 * @returns {boolean} True if bundle is valid
 * @throws {Error} If bundle is invalid
 *
 * @example
 * ```typescript
 * const isValid = validateStixBundle(bundle);
 * ```
 */
const validateStixBundle = (bundle) => {
    if (!bundle.type || bundle.type !== 'bundle') {
        throw new Error('Invalid bundle type');
    }
    if (!bundle.id || !bundle.id.startsWith('bundle--')) {
        throw new Error('Invalid bundle ID');
    }
    if (!Array.isArray(bundle.objects)) {
        throw new Error('Bundle objects must be an array');
    }
    bundle.objects.forEach((obj, index) => {
        try {
            (0, exports.validateStixObject)(obj);
        }
        catch (error) {
            throw new Error(`Object at index ${index} is invalid: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    });
    return true;
};
exports.validateStixBundle = validateStixBundle;
/**
 * Extracts objects of specific type from bundle.
 *
 * @param {StixBundle} bundle - STIX bundle
 * @param {string} objectType - Object type to extract
 * @returns {StixObject[]} Filtered objects
 *
 * @example
 * ```typescript
 * const indicators = extractObjectsByType(bundle, 'indicator');
 * ```
 */
const extractObjectsByType = (bundle, objectType) => {
    return bundle.objects.filter(obj => obj.type === objectType);
};
exports.extractObjectsByType = extractObjectsByType;
/**
 * Merges multiple STIX bundles.
 *
 * @param {StixBundle[]} bundles - Bundles to merge
 * @returns {StixBundle} Merged bundle
 *
 * @example
 * ```typescript
 * const merged = mergeStixBundles([bundle1, bundle2, bundle3]);
 * ```
 */
const mergeStixBundles = (bundles) => {
    const allObjects = [];
    const seenIds = new Set();
    bundles.forEach(bundle => {
        bundle.objects.forEach(obj => {
            if (!seenIds.has(obj.id)) {
                seenIds.add(obj.id);
                allObjects.push(obj);
            }
        });
    });
    return (0, exports.createStixBundle)(allObjects);
};
exports.mergeStixBundles = mergeStixBundles;
// ============================================================================
// STIX RELATIONSHIPS AND GRAPHS
// ============================================================================
/**
 * Builds relationship graph from STIX objects.
 *
 * @param {StixObject[]} objects - STIX objects
 * @returns {Map<string, string[]>} Relationship graph (adjacency list)
 *
 * @example
 * ```typescript
 * const graph = buildStixGraph([indicator, threatActor, malware, relationship1, relationship2]);
 * ```
 */
const buildStixGraph = (objects) => {
    const graph = new Map();
    // Initialize nodes
    objects.forEach(obj => {
        if (obj.type !== 'relationship') {
            graph.set(obj.id, []);
        }
    });
    // Add edges
    objects.forEach(obj => {
        if (obj.type === 'relationship') {
            const rel = obj;
            const edges = graph.get(rel.source_ref) || [];
            edges.push(rel.target_ref);
            graph.set(rel.source_ref, edges);
        }
    });
    return graph;
};
exports.buildStixGraph = buildStixGraph;
/**
 * Finds related objects in STIX bundle.
 *
 * @param {StixBundle} bundle - STIX bundle
 * @param {string} objectId - Object ID to find relationships for
 * @returns {StixObject[]} Related objects
 *
 * @example
 * ```typescript
 * const related = findRelatedObjects(bundle, 'threat-actor--123');
 * ```
 */
const findRelatedObjects = (bundle, objectId) => {
    const relationships = bundle.objects.filter(obj => obj.type === 'relationship' && obj.source_ref === objectId);
    const relatedIds = relationships.map(rel => rel.target_ref);
    return bundle.objects.filter(obj => relatedIds.includes(obj.id));
};
exports.findRelatedObjects = findRelatedObjects;
/**
 * Traverses STIX graph depth-first.
 *
 * @param {Map<string, string[]>} graph - STIX relationship graph
 * @param {string} startId - Starting object ID
 * @returns {string[]} Traversal path
 *
 * @example
 * ```typescript
 * const path = traverseStixGraph(graph, 'threat-actor--123');
 * ```
 */
const traverseStixGraph = (graph, startId) => {
    const visited = new Set();
    const path = [];
    const dfs = (nodeId) => {
        if (visited.has(nodeId))
            return;
        visited.add(nodeId);
        path.push(nodeId);
        const neighbors = graph.get(nodeId) || [];
        neighbors.forEach(neighborId => dfs(neighborId));
    };
    dfs(startId);
    return path;
};
exports.traverseStixGraph = traverseStixGraph;
// ============================================================================
// TAXII SERVER IMPLEMENTATION
// ============================================================================
/**
 * Creates TAXII 2.1 Discovery response.
 *
 * @param {TaxiiServerConfig} config - Server configuration
 * @returns {TaxiiDiscovery} TAXII Discovery object
 *
 * @example
 * ```typescript
 * const discovery = createTaxiiDiscovery({
 *   title: 'My TAXII Server',
 *   description: 'Threat intelligence sharing',
 *   contact: 'admin@example.com',
 *   apiRoots: [...]
 * });
 * ```
 */
const createTaxiiDiscovery = (config) => {
    return {
        title: config.title,
        description: config.description,
        contact: config.contact,
        api_roots: config.apiRoots.map(root => `/taxii2/${root.path}`),
    };
};
exports.createTaxiiDiscovery = createTaxiiDiscovery;
/**
 * Creates TAXII 2.1 API Root response.
 *
 * @param {TaxiiApiRootConfig} config - API Root configuration
 * @returns {TaxiiApiRoot} TAXII API Root object
 *
 * @example
 * ```typescript
 * const apiRoot = createTaxiiApiRoot({
 *   path: 'default',
 *   title: 'Default API Root',
 *   description: 'Default collection root',
 *   maxContentLength: 10485760,
 *   collections: [...]
 * });
 * ```
 */
const createTaxiiApiRoot = (config) => {
    return {
        title: config.title,
        description: config.description,
        versions: ['application/taxii+json;version=2.1'],
        max_content_length: config.maxContentLength,
    };
};
exports.createTaxiiApiRoot = createTaxiiApiRoot;
/**
 * Creates TAXII 2.1 Collection response.
 *
 * @param {TaxiiCollectionConfig} config - Collection configuration
 * @returns {TaxiiCollection} TAXII Collection object
 *
 * @example
 * ```typescript
 * const collection = createTaxiiCollection({
 *   id: 'collection-1',
 *   title: 'Indicators',
 *   description: 'Threat indicators',
 *   canRead: true,
 *   canWrite: false,
 *   mediaTypes: ['application/stix+json;version=2.1']
 * });
 * ```
 */
const createTaxiiCollection = (config) => {
    return {
        id: config.id,
        title: config.title,
        description: config.description,
        can_read: config.canRead,
        can_write: config.canWrite,
        media_types: config.mediaTypes,
    };
};
exports.createTaxiiCollection = createTaxiiCollection;
/**
 * Creates TAXII 2.1 Manifest Entry.
 *
 * @param {StixObject} obj - STIX object
 * @returns {TaxiiManifestEntry} TAXII Manifest Entry
 *
 * @example
 * ```typescript
 * const entry = createTaxiiManifestEntry(indicator);
 * ```
 */
const createTaxiiManifestEntry = (obj) => {
    return {
        id: obj.id,
        date_added: new Date().toISOString(),
        version: obj.modified,
        media_type: 'application/stix+json;version=2.1',
    };
};
exports.createTaxiiManifestEntry = createTaxiiManifestEntry;
/**
 * Creates TAXII 2.1 Status response.
 *
 * @param {string} statusId - Status ID
 * @param {Partial<TaxiiStatus>} data - Status data
 * @returns {TaxiiStatus} TAXII Status object
 *
 * @example
 * ```typescript
 * const status = createTaxiiStatus('status-123', {
 *   status: 'complete',
 *   total_count: 100,
 *   success_count: 95,
 *   failure_count: 5
 * });
 * ```
 */
const createTaxiiStatus = (statusId, data) => {
    return {
        id: statusId,
        status: data.status || 'pending',
        request_timestamp: data.request_timestamp || new Date().toISOString(),
        total_count: data.total_count || 0,
        success_count: data.success_count || 0,
        failure_count: data.failure_count || 0,
        pending_count: data.pending_count || 0,
    };
};
exports.createTaxiiStatus = createTaxiiStatus;
/**
 * Creates TAXII 2.1 Envelope for object retrieval.
 *
 * @param {StixObject[]} objects - STIX objects to include
 * @param {boolean} hasMore - Whether more objects exist
 * @param {string} [nextCursor] - Pagination cursor
 * @returns {TaxiiEnvelope} TAXII Envelope
 *
 * @example
 * ```typescript
 * const envelope = createTaxiiEnvelope(objects, true, 'cursor-123');
 * ```
 */
const createTaxiiEnvelope = (objects, hasMore, nextCursor) => {
    return {
        more: hasMore,
        next: nextCursor,
        objects,
    };
};
exports.createTaxiiEnvelope = createTaxiiEnvelope;
// ============================================================================
// TAXII CLIENT IMPLEMENTATION
// ============================================================================
/**
 * Fetches TAXII Discovery information.
 *
 * @param {string} serverUrl - TAXII server URL
 * @returns {Promise<TaxiiDiscovery>} Discovery information
 *
 * @example
 * ```typescript
 * const discovery = await fetchTaxiiDiscovery('https://taxii.example.com');
 * ```
 */
const fetchTaxiiDiscovery = async (serverUrl) => {
    // Simulated fetch - in production, use actual HTTP client
    return {
        title: 'TAXII Server',
        description: 'Threat Intelligence Sharing',
        contact: 'admin@example.com',
        api_roots: ['/taxii2/default'],
    };
};
exports.fetchTaxiiDiscovery = fetchTaxiiDiscovery;
/**
 * Fetches TAXII collections from API root.
 *
 * @param {string} apiRootUrl - API root URL
 * @returns {Promise<TaxiiCollection[]>} Collections
 *
 * @example
 * ```typescript
 * const collections = await fetchTaxiiCollections('https://taxii.example.com/taxii2/default');
 * ```
 */
const fetchTaxiiCollections = async (apiRootUrl) => {
    // Simulated fetch - in production, use actual HTTP client
    return [];
};
exports.fetchTaxiiCollections = fetchTaxiiCollections;
/**
 * Fetches objects from TAXII collection.
 *
 * @param {string} collectionUrl - Collection URL
 * @param {Record<string, string>} [filters] - Query filters
 * @returns {Promise<TaxiiEnvelope>} TAXII Envelope with objects
 *
 * @example
 * ```typescript
 * const envelope = await fetchTaxiiObjects(
 *   'https://taxii.example.com/taxii2/default/collections/indicators/objects',
 *   { added_after: '2023-01-01T00:00:00Z' }
 * );
 * ```
 */
const fetchTaxiiObjects = async (collectionUrl, filters) => {
    // Simulated fetch - in production, use actual HTTP client
    return {
        more: false,
        objects: [],
    };
};
exports.fetchTaxiiObjects = fetchTaxiiObjects;
/**
 * Pushes objects to TAXII collection.
 *
 * @param {string} collectionUrl - Collection URL
 * @param {StixBundle} bundle - STIX bundle to push
 * @returns {Promise<TaxiiStatus>} Push status
 *
 * @example
 * ```typescript
 * const status = await pushTaxiiObjects(
 *   'https://taxii.example.com/taxii2/default/collections/indicators/objects',
 *   bundle
 * );
 * ```
 */
const pushTaxiiObjects = async (collectionUrl, bundle) => {
    // Simulated push - in production, use actual HTTP client
    return (0, exports.createTaxiiStatus)(`status-${generateUuid()}`, {
        status: 'complete',
        total_count: bundle.objects.length,
        success_count: bundle.objects.length,
        failure_count: 0,
        pending_count: 0,
    });
};
exports.pushTaxiiObjects = pushTaxiiObjects;
// ============================================================================
// INDICATOR CONVERSION
// ============================================================================
/**
 * Converts threat indicator to STIX indicator.
 *
 * @param {any} indicator - Threat indicator
 * @returns {StixIndicator} STIX Indicator
 *
 * @example
 * ```typescript
 * const stixIndicator = convertToStixIndicator({
 *   type: 'ip',
 *   value: '192.0.2.0',
 *   confidence: 85,
 *   severity: 'high'
 * });
 * ```
 */
const convertToStixIndicator = (indicator) => {
    const pattern = (0, exports.generateStixPattern)(indicator.type, indicator.value);
    return (0, exports.createStixIndicator)({
        name: `${indicator.type.toUpperCase()}: ${indicator.value}`,
        pattern,
        pattern_type: 'stix',
        valid_from: new Date().toISOString(),
        indicator_types: ['malicious-activity'],
        confidence: indicator.confidence,
    });
};
exports.convertToStixIndicator = convertToStixIndicator;
/**
 * Generates STIX pattern from indicator type and value.
 *
 * @param {string} type - Indicator type
 * @param {string} value - Indicator value
 * @returns {string} STIX pattern
 *
 * @example
 * ```typescript
 * const pattern = generateStixPattern('ip', '192.0.2.0');
 * // Result: "[ipv4-addr:value = '192.0.2.0']"
 * ```
 */
const generateStixPattern = (type, value) => {
    const patterns = {
        ip: `[ipv4-addr:value = '${value}']`,
        domain: `[domain-name:value = '${value}']`,
        url: `[url:value = '${value}']`,
        hash: `[file:hashes.MD5 = '${value}']`,
        email: `[email-addr:value = '${value}']`,
    };
    return patterns[type] || `[x-custom:value = '${value}']`;
};
exports.generateStixPattern = generateStixPattern;
/**
 * Converts STIX indicator to simple threat indicator.
 *
 * @param {StixIndicator} stixIndicator - STIX indicator
 * @returns {any} Simple threat indicator
 *
 * @example
 * ```typescript
 * const indicator = convertFromStixIndicator(stixIndicator);
 * ```
 */
const convertFromStixIndicator = (stixIndicator) => {
    const { type, value } = (0, exports.parseStixPattern)(stixIndicator.pattern);
    return {
        id: stixIndicator.id,
        type,
        value,
        confidence: stixIndicator.confidence || 0,
        severity: 'medium',
        firstSeen: new Date(stixIndicator.created),
        lastSeen: new Date(stixIndicator.modified),
        source: 'stix',
        tags: stixIndicator.labels || [],
    };
};
exports.convertFromStixIndicator = convertFromStixIndicator;
/**
 * Parses STIX pattern to extract type and value.
 *
 * @param {string} pattern - STIX pattern
 * @returns {object} Parsed type and value
 *
 * @example
 * ```typescript
 * const { type, value } = parseStixPattern("[ipv4-addr:value = '192.0.2.0']");
 * // Result: { type: 'ip', value: '192.0.2.0' }
 * ```
 */
const parseStixPattern = (pattern) => {
    // Simple pattern parsing - in production, use proper STIX pattern parser
    const match = pattern.match(/\[(.+?):value\s*=\s*'(.+?)'\]/);
    if (!match) {
        return { type: 'unknown', value: '' };
    }
    const objectType = match[1];
    const value = match[2];
    const typeMap = {
        'ipv4-addr': 'ip',
        'domain-name': 'domain',
        'url': 'url',
        'file': 'hash',
        'email-addr': 'email',
    };
    return {
        type: typeMap[objectType] || 'unknown',
        value,
    };
};
exports.parseStixPattern = parseStixPattern;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Defines Sequelize model for STIX objects.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} StixObject model
 *
 * @example
 * ```typescript
 * const StixObject = defineStixObjectModel(sequelize, DataTypes);
 * const indicator = await StixObject.create({ type: 'indicator', ... });
 * ```
 */
const defineStixObjectModel = (sequelize, DataTypes) => {
    return sequelize.define('StixObject', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        spec_version: {
            type: DataTypes.STRING,
            defaultValue: '2.1',
        },
        created: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        modified: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        data: {
            type: DataTypes.JSON,
            allowNull: false,
        },
    });
};
exports.defineStixObjectModel = defineStixObjectModel;
/**
 * Defines Sequelize model for TAXII collections.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} TaxiiCollection model
 *
 * @example
 * ```typescript
 * const TaxiiCollection = defineTaxiiCollectionModel(sequelize, DataTypes);
 * const collection = await TaxiiCollection.create({ title: 'Indicators', ... });
 * ```
 */
const defineTaxiiCollectionModel = (sequelize, DataTypes) => {
    return sequelize.define('TaxiiCollection', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        can_read: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        can_write: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        media_types: {
            type: DataTypes.JSON,
            defaultValue: ['application/stix+json;version=2.1'],
        },
    });
};
exports.defineTaxiiCollectionModel = defineTaxiiCollectionModel;
// ============================================================================
// NESTJS SERVICES
// ============================================================================
/**
 * Creates NestJS service for STIX processing.
 *
 * @returns {string} NestJS service code
 *
 * @example
 * ```typescript
 * const serviceCode = createStixProcessingService();
 * ```
 */
const createStixProcessingService = () => {
    return `
import { Injectable } from '@nestjs/common';

@Injectable()
export class StixProcessingService {
  async createIndicator(data: any): Promise<any> {
    // Implementation
  }

  async validateObject(obj: any): Promise<boolean> {
    // Implementation
  }

  async createBundle(objects: any[]): Promise<any> {
    // Implementation
  }

  async buildGraph(objects: any[]): Promise<Map<string, string[]>> {
    // Implementation
  }
}
`;
};
exports.createStixProcessingService = createStixProcessingService;
/**
 * Creates NestJS controller for TAXII endpoints.
 *
 * @returns {string} NestJS controller code
 *
 * @example
 * ```typescript
 * const controllerCode = createTaxiiController();
 * ```
 */
const createTaxiiController = () => {
    return `
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('taxii2')
@ApiTags('TAXII 2.1')
export class TaxiiController {
  @Get('/')
  @ApiOperation({ summary: 'TAXII Discovery' })
  @ApiResponse({ status: 200, description: 'Discovery information' })
  async discovery() {
    // Implementation
  }

  @Get(':apiRoot/')
  @ApiOperation({ summary: 'Get API Root' })
  @ApiResponse({ status: 200, description: 'API Root information' })
  async getApiRoot(@Param('apiRoot') apiRoot: string) {
    // Implementation
  }

  @Get(':apiRoot/collections')
  @ApiOperation({ summary: 'List collections' })
  @ApiResponse({ status: 200, description: 'Collections list' })
  async listCollections(@Param('apiRoot') apiRoot: string) {
    // Implementation
  }

  @Get(':apiRoot/collections/:collectionId/objects')
  @ApiOperation({ summary: 'Get collection objects' })
  @ApiResponse({ status: 200, description: 'STIX objects' })
  async getObjects(
    @Param('apiRoot') apiRoot: string,
    @Param('collectionId') collectionId: string,
    @Query() filters: any
  ) {
    // Implementation
  }

  @Post(':apiRoot/collections/:collectionId/objects')
  @ApiOperation({ summary: 'Add objects to collection' })
  @ApiResponse({ status: 202, description: 'Objects accepted' })
  async addObjects(
    @Param('apiRoot') apiRoot: string,
    @Param('collectionId') collectionId: string,
    @Body() bundle: any
  ) {
    // Implementation
  }
}
`;
};
exports.createTaxiiController = createTaxiiController;
/**
 * Creates OpenAPI specification for TAXII API.
 *
 * @returns {object} OpenAPI specification
 *
 * @example
 * ```typescript
 * const spec = createTaxiiApiSpec();
 * ```
 */
const createTaxiiApiSpec = () => {
    return {
        openapi: '3.0.0',
        info: {
            title: 'TAXII 2.1 Server API',
            version: '1.0.0',
            description: 'TAXII 2.1 Threat Intelligence Sharing API',
        },
        paths: {
            '/taxii2/': {
                get: {
                    summary: 'TAXII Discovery',
                    tags: ['Discovery'],
                    responses: {
                        '200': {
                            description: 'Discovery information',
                            content: {
                                'application/taxii+json;version=2.1': {
                                    schema: { $ref: '#/components/schemas/Discovery' },
                                },
                            },
                        },
                    },
                },
            },
        },
        components: {
            schemas: {
                Discovery: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                        contact: { type: 'string' },
                        api_roots: { type: 'array', items: { type: 'string' } },
                    },
                },
            },
        },
    };
};
exports.createTaxiiApiSpec = createTaxiiApiSpec;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Generates UUID v4.
 *
 * @returns {string} UUID v4
 */
const generateUuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
// ============================================================================
// STIX SERIALIZATION AND DESERIALIZATION
// ============================================================================
/**
 * Serializes STIX bundle to JSON string.
 *
 * @param {StixBundle} bundle - STIX bundle to serialize
 * @returns {string} JSON string
 *
 * @example
 * ```typescript
 * const json = serializeStixBundle(bundle);
 * ```
 */
const serializeStixBundle = (bundle) => {
    return JSON.stringify(bundle, null, 2);
};
exports.serializeStixBundle = serializeStixBundle;
/**
 * Deserializes JSON string to STIX bundle.
 *
 * @param {string} json - JSON string
 * @returns {StixBundle} STIX bundle
 * @throws {Error} If JSON is invalid
 *
 * @example
 * ```typescript
 * const bundle = deserializeStixBundle(jsonString);
 * ```
 */
const deserializeStixBundle = (json) => {
    try {
        const parsed = JSON.parse(json);
        (0, exports.validateStixBundle)(parsed);
        return parsed;
    }
    catch (error) {
        throw new Error(`Failed to deserialize STIX bundle: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
exports.deserializeStixBundle = deserializeStixBundle;
/**
 * Converts STIX bundle to TAXII envelope.
 *
 * @param {StixBundle} bundle - STIX bundle
 * @param {boolean} hasMore - Whether more objects exist
 * @param {string} [nextCursor] - Pagination cursor
 * @returns {TaxiiEnvelope} TAXII envelope
 *
 * @example
 * ```typescript
 * const envelope = convertBundleToEnvelope(bundle, false);
 * ```
 */
const convertBundleToEnvelope = (bundle, hasMore, nextCursor) => {
    return (0, exports.createTaxiiEnvelope)(bundle.objects, hasMore, nextCursor);
};
exports.convertBundleToEnvelope = convertBundleToEnvelope;
// ============================================================================
// STIX QUERYING AND FILTERING
// ============================================================================
/**
 * Queries STIX objects by type and filters.
 *
 * @param {StixBundle} bundle - STIX bundle
 * @param {string} type - Object type
 * @param {Record<string, unknown>} filters - Query filters
 * @returns {StixObject[]} Filtered objects
 *
 * @example
 * ```typescript
 * const indicators = queryStixObjects(bundle, 'indicator', { 'confidence': { min: 80 } });
 * ```
 */
const queryStixObjects = (bundle, type, filters) => {
    let objects = (0, exports.extractObjectsByType)(bundle, type);
    Object.entries(filters).forEach(([key, value]) => {
        objects = objects.filter(obj => {
            const objValue = obj[key];
            if (typeof value === 'object' && value !== null && 'min' in value) {
                const range = value;
                const numValue = Number(objValue);
                if (range.min !== undefined && numValue < range.min)
                    return false;
                if (range.max !== undefined && numValue > range.max)
                    return false;
                return true;
            }
            return objValue === value;
        });
    });
    return objects;
};
exports.queryStixObjects = queryStixObjects;
/**
 * Filters STIX objects by date range.
 *
 * @param {StixObject[]} objects - STIX objects
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {StixObject[]} Filtered objects
 *
 * @example
 * ```typescript
 * const recent = filterStixByDateRange(objects, new Date('2024-01-01'), new Date());
 * ```
 */
const filterStixByDateRange = (objects, startDate, endDate) => {
    return objects.filter(obj => {
        const created = new Date(obj.created);
        return created >= startDate && created <= endDate;
    });
};
exports.filterStixByDateRange = filterStixByDateRange;
// ============================================================================
// STIX VERSIONING
// ============================================================================
/**
 * Creates new version of STIX object.
 *
 * @param {StixObject} obj - Original STIX object
 * @param {Partial<StixObject>} updates - Updates to apply
 * @returns {StixObject} New version
 *
 * @example
 * ```typescript
 * const updated = createStixVersion(indicator, { confidence: 95 });
 * ```
 */
const createStixVersion = (obj, updates) => {
    return {
        ...obj,
        ...updates,
        modified: new Date().toISOString(),
    };
};
exports.createStixVersion = createStixVersion;
/**
 * Gets latest version of STIX object from multiple versions.
 *
 * @param {StixObject[]} versions - Object versions
 * @returns {StixObject} Latest version
 *
 * @example
 * ```typescript
 * const latest = getLatestStixVersion([v1, v2, v3]);
 * ```
 */
const getLatestStixVersion = (versions) => {
    return versions.reduce((latest, current) => new Date(current.modified) > new Date(latest.modified) ? current : latest);
};
exports.getLatestStixVersion = getLatestStixVersion;
// ============================================================================
// STIX MARKING AND CLASSIFICATION
// ============================================================================
/**
 * Applies marking to STIX object.
 *
 * @param {StixObject} obj - STIX object
 * @param {string} markingRef - Marking reference
 * @returns {StixObject} Marked object
 *
 * @example
 * ```typescript
 * const marked = applyStixMarking(indicator, 'marking-definition--tlp-red');
 * ```
 */
const applyStixMarking = (obj, markingRef) => {
    return {
        ...obj,
        object_marking_refs: [...(obj.object_marking_refs || []), markingRef],
    };
};
exports.applyStixMarking = applyStixMarking;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // STIX object creation
    createStixIndicator: exports.createStixIndicator,
    createStixThreatActor: exports.createStixThreatActor,
    createStixMalware: exports.createStixMalware,
    createStixObservable: exports.createStixObservable,
    createStixRelationship: exports.createStixRelationship,
    // STIX validation
    validateStixObject: exports.validateStixObject,
    validateStixPattern: exports.validateStixPattern,
    validateStixRelationship: exports.validateStixRelationship,
    // STIX bundles
    createStixBundle: exports.createStixBundle,
    validateStixBundle: exports.validateStixBundle,
    extractObjectsByType: exports.extractObjectsByType,
    mergeStixBundles: exports.mergeStixBundles,
    // STIX graphs
    buildStixGraph: exports.buildStixGraph,
    findRelatedObjects: exports.findRelatedObjects,
    traverseStixGraph: exports.traverseStixGraph,
    // TAXII server
    createTaxiiDiscovery: exports.createTaxiiDiscovery,
    createTaxiiApiRoot: exports.createTaxiiApiRoot,
    createTaxiiCollection: exports.createTaxiiCollection,
    createTaxiiManifestEntry: exports.createTaxiiManifestEntry,
    createTaxiiStatus: exports.createTaxiiStatus,
    createTaxiiEnvelope: exports.createTaxiiEnvelope,
    // TAXII client
    fetchTaxiiDiscovery: exports.fetchTaxiiDiscovery,
    fetchTaxiiCollections: exports.fetchTaxiiCollections,
    fetchTaxiiObjects: exports.fetchTaxiiObjects,
    pushTaxiiObjects: exports.pushTaxiiObjects,
    // Indicator conversion
    convertToStixIndicator: exports.convertToStixIndicator,
    generateStixPattern: exports.generateStixPattern,
    convertFromStixIndicator: exports.convertFromStixIndicator,
    parseStixPattern: exports.parseStixPattern,
    // Serialization
    serializeStixBundle: exports.serializeStixBundle,
    deserializeStixBundle: exports.deserializeStixBundle,
    convertBundleToEnvelope: exports.convertBundleToEnvelope,
    // Querying and filtering
    queryStixObjects: exports.queryStixObjects,
    filterStixByDateRange: exports.filterStixByDateRange,
    // Versioning
    createStixVersion: exports.createStixVersion,
    getLatestStixVersion: exports.getLatestStixVersion,
    // Marking
    applyStixMarking: exports.applyStixMarking,
    // Sequelize models
    defineStixObjectModel: exports.defineStixObjectModel,
    defineTaxiiCollectionModel: exports.defineTaxiiCollectionModel,
    // NestJS
    createStixProcessingService: exports.createStixProcessingService,
    createTaxiiController: exports.createTaxiiController,
    createTaxiiApiSpec: exports.createTaxiiApiSpec,
};
//# sourceMappingURL=stix-taxii-kit.js.map