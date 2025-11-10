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
/**
 * File: /reuse/threat/stix-taxii-kit.ts
 * Locator: WC-UTL-STIX-001
 * Purpose: Comprehensive STIX/TAXII Utilities - STIX 2.1 objects, TAXII 2.1 servers/clients, bundles, relationships
 *
 * Upstream: Independent utility module for STIX/TAXII implementation
 * Downstream: ../backend/threat/*, threat intelligence platforms, sharing communities
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Swagger/OpenAPI, Sequelize 6.x
 * Exports: 42 utility functions for STIX objects, TAXII servers, bundles, relationships, collections
 *
 * LLM Context: Comprehensive STIX/TAXII utilities for implementing production-ready threat intelligence sharing
 * platforms. Provides STIX 2.1 object creation and validation, TAXII 2.1 server/client implementation, bundle
 * management, relationship graphs, collection management, indicator conversion, and complete API design patterns.
 * Essential for building interoperable threat intelligence sharing systems.
 */
interface StixObject {
    type: string;
    spec_version: '2.1';
    id: string;
    created: string;
    modified: string;
    created_by_ref?: string;
    revoked?: boolean;
    labels?: string[];
    confidence?: number;
    lang?: string;
    external_references?: ExternalReference[];
    object_marking_refs?: string[];
    granular_markings?: GranularMarking[];
}
interface StixIndicator extends StixObject {
    type: 'indicator';
    name: string;
    description?: string;
    indicator_types?: string[];
    pattern: string;
    pattern_type: 'stix' | 'pcre' | 'sigma' | 'snort' | 'suricata' | 'yara';
    pattern_version?: string;
    valid_from: string;
    valid_until?: string;
    kill_chain_phases?: KillChainPhase[];
}
interface StixThreatActor extends StixObject {
    type: 'threat-actor';
    name: string;
    description?: string;
    threat_actor_types?: string[];
    aliases?: string[];
    first_seen?: string;
    last_seen?: string;
    roles?: string[];
    goals?: string[];
    sophistication?: string;
    resource_level?: string;
    primary_motivation?: string;
    secondary_motivations?: string[];
    personal_motivations?: string[];
}
interface StixMalware extends StixObject {
    type: 'malware';
    name: string;
    description?: string;
    malware_types?: string[];
    is_family: boolean;
    aliases?: string[];
    kill_chain_phases?: KillChainPhase[];
    first_seen?: string;
    last_seen?: string;
    operating_system_refs?: string[];
    architecture_execution_envs?: string[];
    implementation_languages?: string[];
    capabilities?: string[];
}
interface StixObservable extends StixObject {
    type: 'observed-data';
    first_observed: string;
    last_observed: string;
    number_observed: number;
    objects: Record<string, CyberObservableObject>;
}
interface StixRelationship extends StixObject {
    type: 'relationship';
    relationship_type: string;
    source_ref: string;
    target_ref: string;
    start_time?: string;
    stop_time?: string;
}
interface StixBundle {
    type: 'bundle';
    id: string;
    objects: StixObject[];
}
interface ExternalReference {
    source_name: string;
    description?: string;
    url?: string;
    hashes?: Record<string, string>;
    external_id?: string;
}
interface GranularMarking {
    lang?: string;
    marking_ref?: string;
    selectors: string[];
}
interface KillChainPhase {
    kill_chain_name: string;
    phase_name: string;
}
interface CyberObservableObject {
    type: string;
    [key: string]: unknown;
}
interface TaxiiDiscovery {
    title: string;
    description?: string;
    contact?: string;
    default?: string;
    api_roots: string[];
}
interface TaxiiApiRoot {
    title: string;
    description?: string;
    versions: string[];
    max_content_length: number;
}
interface TaxiiCollection {
    id: string;
    title: string;
    description?: string;
    can_read: boolean;
    can_write: boolean;
    media_types: string[];
}
interface TaxiiManifestEntry {
    id: string;
    date_added: string;
    version: string;
    media_type: string;
}
interface TaxiiStatus {
    id: string;
    status: 'pending' | 'complete' | 'error';
    request_timestamp: string;
    total_count: number;
    success_count: number;
    failure_count: number;
    pending_count: number;
}
interface TaxiiEnvelope {
    more: boolean;
    next?: string;
    objects: StixObject[];
}
interface TaxiiServerConfig {
    title: string;
    description: string;
    contact: string;
    apiRoots: TaxiiApiRootConfig[];
}
interface TaxiiApiRootConfig {
    path: string;
    title: string;
    description: string;
    maxContentLength: number;
    collections: TaxiiCollectionConfig[];
}
interface TaxiiCollectionConfig {
    id: string;
    title: string;
    description: string;
    canRead: boolean;
    canWrite: boolean;
    mediaTypes: string[];
}
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
export declare const createStixIndicator: (data: Partial<StixIndicator>) => StixIndicator;
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
export declare const createStixThreatActor: (data: Partial<StixThreatActor>) => StixThreatActor;
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
export declare const createStixMalware: (data: Partial<StixMalware>) => StixMalware;
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
export declare const createStixObservable: (data: Partial<StixObservable>) => StixObservable;
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
export declare const createStixRelationship: (data: Partial<StixRelationship>) => StixRelationship;
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
export declare const validateStixObject: (obj: StixObject) => boolean;
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
export declare const validateStixPattern: (pattern: string, patternType: string) => boolean;
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
export declare const validateStixRelationship: (relationship: StixRelationship, objects: StixObject[]) => boolean;
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
export declare const createStixBundle: (objects: StixObject[]) => StixBundle;
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
export declare const validateStixBundle: (bundle: StixBundle) => boolean;
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
export declare const extractObjectsByType: (bundle: StixBundle, objectType: string) => StixObject[];
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
export declare const mergeStixBundles: (bundles: StixBundle[]) => StixBundle;
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
export declare const buildStixGraph: (objects: StixObject[]) => Map<string, string[]>;
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
export declare const findRelatedObjects: (bundle: StixBundle, objectId: string) => StixObject[];
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
export declare const traverseStixGraph: (graph: Map<string, string[]>, startId: string) => string[];
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
export declare const createTaxiiDiscovery: (config: TaxiiServerConfig) => TaxiiDiscovery;
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
export declare const createTaxiiApiRoot: (config: TaxiiApiRootConfig) => TaxiiApiRoot;
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
export declare const createTaxiiCollection: (config: TaxiiCollectionConfig) => TaxiiCollection;
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
export declare const createTaxiiManifestEntry: (obj: StixObject) => TaxiiManifestEntry;
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
export declare const createTaxiiStatus: (statusId: string, data: Partial<TaxiiStatus>) => TaxiiStatus;
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
export declare const createTaxiiEnvelope: (objects: StixObject[], hasMore: boolean, nextCursor?: string) => TaxiiEnvelope;
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
export declare const fetchTaxiiDiscovery: (serverUrl: string) => Promise<TaxiiDiscovery>;
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
export declare const fetchTaxiiCollections: (apiRootUrl: string) => Promise<TaxiiCollection[]>;
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
export declare const fetchTaxiiObjects: (collectionUrl: string, filters?: Record<string, string>) => Promise<TaxiiEnvelope>;
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
export declare const pushTaxiiObjects: (collectionUrl: string, bundle: StixBundle) => Promise<TaxiiStatus>;
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
export declare const convertToStixIndicator: (indicator: any) => StixIndicator;
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
export declare const generateStixPattern: (type: string, value: string) => string;
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
export declare const convertFromStixIndicator: (stixIndicator: StixIndicator) => any;
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
export declare const parseStixPattern: (pattern: string) => {
    type: string;
    value: string;
};
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
export declare const defineStixObjectModel: (sequelize: any, DataTypes: any) => any;
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
export declare const defineTaxiiCollectionModel: (sequelize: any, DataTypes: any) => any;
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
export declare const createStixProcessingService: () => string;
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
export declare const createTaxiiController: () => string;
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
export declare const createTaxiiApiSpec: () => Record<string, unknown>;
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
export declare const serializeStixBundle: (bundle: StixBundle) => string;
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
export declare const deserializeStixBundle: (json: string) => StixBundle;
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
export declare const convertBundleToEnvelope: (bundle: StixBundle, hasMore: boolean, nextCursor?: string) => TaxiiEnvelope;
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
export declare const queryStixObjects: (bundle: StixBundle, type: string, filters: Record<string, unknown>) => StixObject[];
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
export declare const filterStixByDateRange: (objects: StixObject[], startDate: Date, endDate: Date) => StixObject[];
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
export declare const createStixVersion: (obj: StixObject, updates: Partial<StixObject>) => StixObject;
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
export declare const getLatestStixVersion: (versions: StixObject[]) => StixObject;
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
export declare const applyStixMarking: (obj: StixObject, markingRef: string) => StixObject;
declare const _default: {
    createStixIndicator: (data: Partial<StixIndicator>) => StixIndicator;
    createStixThreatActor: (data: Partial<StixThreatActor>) => StixThreatActor;
    createStixMalware: (data: Partial<StixMalware>) => StixMalware;
    createStixObservable: (data: Partial<StixObservable>) => StixObservable;
    createStixRelationship: (data: Partial<StixRelationship>) => StixRelationship;
    validateStixObject: (obj: StixObject) => boolean;
    validateStixPattern: (pattern: string, patternType: string) => boolean;
    validateStixRelationship: (relationship: StixRelationship, objects: StixObject[]) => boolean;
    createStixBundle: (objects: StixObject[]) => StixBundle;
    validateStixBundle: (bundle: StixBundle) => boolean;
    extractObjectsByType: (bundle: StixBundle, objectType: string) => StixObject[];
    mergeStixBundles: (bundles: StixBundle[]) => StixBundle;
    buildStixGraph: (objects: StixObject[]) => Map<string, string[]>;
    findRelatedObjects: (bundle: StixBundle, objectId: string) => StixObject[];
    traverseStixGraph: (graph: Map<string, string[]>, startId: string) => string[];
    createTaxiiDiscovery: (config: TaxiiServerConfig) => TaxiiDiscovery;
    createTaxiiApiRoot: (config: TaxiiApiRootConfig) => TaxiiApiRoot;
    createTaxiiCollection: (config: TaxiiCollectionConfig) => TaxiiCollection;
    createTaxiiManifestEntry: (obj: StixObject) => TaxiiManifestEntry;
    createTaxiiStatus: (statusId: string, data: Partial<TaxiiStatus>) => TaxiiStatus;
    createTaxiiEnvelope: (objects: StixObject[], hasMore: boolean, nextCursor?: string) => TaxiiEnvelope;
    fetchTaxiiDiscovery: (serverUrl: string) => Promise<TaxiiDiscovery>;
    fetchTaxiiCollections: (apiRootUrl: string) => Promise<TaxiiCollection[]>;
    fetchTaxiiObjects: (collectionUrl: string, filters?: Record<string, string>) => Promise<TaxiiEnvelope>;
    pushTaxiiObjects: (collectionUrl: string, bundle: StixBundle) => Promise<TaxiiStatus>;
    convertToStixIndicator: (indicator: any) => StixIndicator;
    generateStixPattern: (type: string, value: string) => string;
    convertFromStixIndicator: (stixIndicator: StixIndicator) => any;
    parseStixPattern: (pattern: string) => {
        type: string;
        value: string;
    };
    serializeStixBundle: (bundle: StixBundle) => string;
    deserializeStixBundle: (json: string) => StixBundle;
    convertBundleToEnvelope: (bundle: StixBundle, hasMore: boolean, nextCursor?: string) => TaxiiEnvelope;
    queryStixObjects: (bundle: StixBundle, type: string, filters: Record<string, unknown>) => StixObject[];
    filterStixByDateRange: (objects: StixObject[], startDate: Date, endDate: Date) => StixObject[];
    createStixVersion: (obj: StixObject, updates: Partial<StixObject>) => StixObject;
    getLatestStixVersion: (versions: StixObject[]) => StixObject;
    applyStixMarking: (obj: StixObject, markingRef: string) => StixObject;
    defineStixObjectModel: (sequelize: any, DataTypes: any) => any;
    defineTaxiiCollectionModel: (sequelize: any, DataTypes: any) => any;
    createStixProcessingService: () => string;
    createTaxiiController: () => string;
    createTaxiiApiSpec: () => Record<string, unknown>;
};
export default _default;
//# sourceMappingURL=stix-taxii-kit.d.ts.map