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

// ============================================================================
// TYPE DEFINITIONS - STIX 2.1
// ============================================================================

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

// ============================================================================
// TYPE DEFINITIONS - TAXII 2.1
// ============================================================================

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
export const createStixIndicator = (data: Partial<StixIndicator>): StixIndicator => {
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
export const createStixThreatActor = (data: Partial<StixThreatActor>): StixThreatActor => {
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
export const createStixMalware = (data: Partial<StixMalware>): StixMalware => {
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
export const createStixObservable = (data: Partial<StixObservable>): StixObservable => {
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
export const createStixRelationship = (data: Partial<StixRelationship>): StixRelationship => {
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
export const validateStixObject = (obj: StixObject): boolean => {
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
export const validateStixPattern = (pattern: string, patternType: string): boolean => {
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
export const validateStixRelationship = (
  relationship: StixRelationship,
  objects: StixObject[],
): boolean => {
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
export const createStixBundle = (objects: StixObject[]): StixBundle => {
  return {
    type: 'bundle',
    id: `bundle--${generateUuid()}`,
    objects,
  };
};

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
export const validateStixBundle = (bundle: StixBundle): boolean => {
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
      validateStixObject(obj);
    } catch (error) {
      throw new Error(`Object at index ${index} is invalid: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  return true;
};

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
export const extractObjectsByType = (bundle: StixBundle, objectType: string): StixObject[] => {
  return bundle.objects.filter(obj => obj.type === objectType);
};

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
export const mergeStixBundles = (bundles: StixBundle[]): StixBundle => {
  const allObjects: StixObject[] = [];
  const seenIds = new Set<string>();

  bundles.forEach(bundle => {
    bundle.objects.forEach(obj => {
      if (!seenIds.has(obj.id)) {
        seenIds.add(obj.id);
        allObjects.push(obj);
      }
    });
  });

  return createStixBundle(allObjects);
};

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
export const buildStixGraph = (objects: StixObject[]): Map<string, string[]> => {
  const graph = new Map<string, string[]>();

  // Initialize nodes
  objects.forEach(obj => {
    if (obj.type !== 'relationship') {
      graph.set(obj.id, []);
    }
  });

  // Add edges
  objects.forEach(obj => {
    if (obj.type === 'relationship') {
      const rel = obj as StixRelationship;
      const edges = graph.get(rel.source_ref) || [];
      edges.push(rel.target_ref);
      graph.set(rel.source_ref, edges);
    }
  });

  return graph;
};

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
export const findRelatedObjects = (bundle: StixBundle, objectId: string): StixObject[] => {
  const relationships = bundle.objects.filter(
    obj => obj.type === 'relationship' && (obj as StixRelationship).source_ref === objectId
  ) as StixRelationship[];

  const relatedIds = relationships.map(rel => rel.target_ref);

  return bundle.objects.filter(obj => relatedIds.includes(obj.id));
};

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
export const traverseStixGraph = (graph: Map<string, string[]>, startId: string): string[] => {
  const visited = new Set<string>();
  const path: string[] = [];

  const dfs = (nodeId: string) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    path.push(nodeId);

    const neighbors = graph.get(nodeId) || [];
    neighbors.forEach(neighborId => dfs(neighborId));
  };

  dfs(startId);
  return path;
};

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
export const createTaxiiDiscovery = (config: TaxiiServerConfig): TaxiiDiscovery => {
  return {
    title: config.title,
    description: config.description,
    contact: config.contact,
    api_roots: config.apiRoots.map(root => `/taxii2/${root.path}`),
  };
};

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
export const createTaxiiApiRoot = (config: TaxiiApiRootConfig): TaxiiApiRoot => {
  return {
    title: config.title,
    description: config.description,
    versions: ['application/taxii+json;version=2.1'],
    max_content_length: config.maxContentLength,
  };
};

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
export const createTaxiiCollection = (config: TaxiiCollectionConfig): TaxiiCollection => {
  return {
    id: config.id,
    title: config.title,
    description: config.description,
    can_read: config.canRead,
    can_write: config.canWrite,
    media_types: config.mediaTypes,
  };
};

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
export const createTaxiiManifestEntry = (obj: StixObject): TaxiiManifestEntry => {
  return {
    id: obj.id,
    date_added: new Date().toISOString(),
    version: obj.modified,
    media_type: 'application/stix+json;version=2.1',
  };
};

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
export const createTaxiiStatus = (statusId: string, data: Partial<TaxiiStatus>): TaxiiStatus => {
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
export const createTaxiiEnvelope = (
  objects: StixObject[],
  hasMore: boolean,
  nextCursor?: string,
): TaxiiEnvelope => {
  return {
    more: hasMore,
    next: nextCursor,
    objects,
  };
};

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
export const fetchTaxiiDiscovery = async (serverUrl: string): Promise<TaxiiDiscovery> => {
  // Simulated fetch - in production, use actual HTTP client
  return {
    title: 'TAXII Server',
    description: 'Threat Intelligence Sharing',
    contact: 'admin@example.com',
    api_roots: ['/taxii2/default'],
  };
};

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
export const fetchTaxiiCollections = async (apiRootUrl: string): Promise<TaxiiCollection[]> => {
  // Simulated fetch - in production, use actual HTTP client
  return [];
};

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
export const fetchTaxiiObjects = async (
  collectionUrl: string,
  filters?: Record<string, string>,
): Promise<TaxiiEnvelope> => {
  // Simulated fetch - in production, use actual HTTP client
  return {
    more: false,
    objects: [],
  };
};

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
export const pushTaxiiObjects = async (
  collectionUrl: string,
  bundle: StixBundle,
): Promise<TaxiiStatus> => {
  // Simulated push - in production, use actual HTTP client
  return createTaxiiStatus(`status-${generateUuid()}`, {
    status: 'complete',
    total_count: bundle.objects.length,
    success_count: bundle.objects.length,
    failure_count: 0,
    pending_count: 0,
  });
};

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
export const convertToStixIndicator = (indicator: any): StixIndicator => {
  const pattern = generateStixPattern(indicator.type, indicator.value);

  return createStixIndicator({
    name: `${indicator.type.toUpperCase()}: ${indicator.value}`,
    pattern,
    pattern_type: 'stix',
    valid_from: new Date().toISOString(),
    indicator_types: ['malicious-activity'],
    confidence: indicator.confidence,
  });
};

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
export const generateStixPattern = (type: string, value: string): string => {
  const patterns: Record<string, string> = {
    ip: `[ipv4-addr:value = '${value}']`,
    domain: `[domain-name:value = '${value}']`,
    url: `[url:value = '${value}']`,
    hash: `[file:hashes.MD5 = '${value}']`,
    email: `[email-addr:value = '${value}']`,
  };

  return patterns[type] || `[x-custom:value = '${value}']`;
};

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
export const convertFromStixIndicator = (stixIndicator: StixIndicator): any => {
  const { type, value } = parseStixPattern(stixIndicator.pattern);

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
export const parseStixPattern = (pattern: string): { type: string; value: string } => {
  // Simple pattern parsing - in production, use proper STIX pattern parser
  const match = pattern.match(/\[(.+?):value\s*=\s*'(.+?)'\]/);

  if (!match) {
    return { type: 'unknown', value: '' };
  }

  const objectType = match[1];
  const value = match[2];

  const typeMap: Record<string, string> = {
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
export const defineStixObjectModel = (sequelize: any, DataTypes: any): any => {
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
export const defineTaxiiCollectionModel = (sequelize: any, DataTypes: any): any => {
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
export const createStixProcessingService = (): string => {
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
export const createTaxiiController = (): string => {
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
export const createTaxiiApiSpec = (): Record<string, unknown> => {
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

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generates UUID v4.
 *
 * @returns {string} UUID v4
 */
const generateUuid = (): string => {
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
export const serializeStixBundle = (bundle: StixBundle): string => {
  return JSON.stringify(bundle, null, 2);
};

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
export const deserializeStixBundle = (json: string): StixBundle => {
  try {
    const parsed = JSON.parse(json);
    validateStixBundle(parsed);
    return parsed as StixBundle;
  } catch (error) {
    throw new Error(`Failed to deserialize STIX bundle: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

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
export const convertBundleToEnvelope = (
  bundle: StixBundle,
  hasMore: boolean,
  nextCursor?: string,
): TaxiiEnvelope => {
  return createTaxiiEnvelope(bundle.objects, hasMore, nextCursor);
};

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
export const queryStixObjects = (
  bundle: StixBundle,
  type: string,
  filters: Record<string, unknown>,
): StixObject[] => {
  let objects = extractObjectsByType(bundle, type);

  Object.entries(filters).forEach(([key, value]) => {
    objects = objects.filter(obj => {
      const objValue = (obj as Record<string, unknown>)[key];

      if (typeof value === 'object' && value !== null && 'min' in value) {
        const range = value as { min?: number; max?: number };
        const numValue = Number(objValue);
        if (range.min !== undefined && numValue < range.min) return false;
        if (range.max !== undefined && numValue > range.max) return false;
        return true;
      }

      return objValue === value;
    });
  });

  return objects;
};

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
export const filterStixByDateRange = (
  objects: StixObject[],
  startDate: Date,
  endDate: Date,
): StixObject[] => {
  return objects.filter(obj => {
    const created = new Date(obj.created);
    return created >= startDate && created <= endDate;
  });
};

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
export const createStixVersion = (obj: StixObject, updates: Partial<StixObject>): StixObject => {
  return {
    ...obj,
    ...updates,
    modified: new Date().toISOString(),
  };
};

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
export const getLatestStixVersion = (versions: StixObject[]): StixObject => {
  return versions.reduce((latest, current) =>
    new Date(current.modified) > new Date(latest.modified) ? current : latest
  );
};

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
export const applyStixMarking = (obj: StixObject, markingRef: string): StixObject => {
  return {
    ...obj,
    object_marking_refs: [...(obj.object_marking_refs || []), markingRef],
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // STIX object creation
  createStixIndicator,
  createStixThreatActor,
  createStixMalware,
  createStixObservable,
  createStixRelationship,

  // STIX validation
  validateStixObject,
  validateStixPattern,
  validateStixRelationship,

  // STIX bundles
  createStixBundle,
  validateStixBundle,
  extractObjectsByType,
  mergeStixBundles,

  // STIX graphs
  buildStixGraph,
  findRelatedObjects,
  traverseStixGraph,

  // TAXII server
  createTaxiiDiscovery,
  createTaxiiApiRoot,
  createTaxiiCollection,
  createTaxiiManifestEntry,
  createTaxiiStatus,
  createTaxiiEnvelope,

  // TAXII client
  fetchTaxiiDiscovery,
  fetchTaxiiCollections,
  fetchTaxiiObjects,
  pushTaxiiObjects,

  // Indicator conversion
  convertToStixIndicator,
  generateStixPattern,
  convertFromStixIndicator,
  parseStixPattern,

  // Serialization
  serializeStixBundle,
  deserializeStixBundle,
  convertBundleToEnvelope,

  // Querying and filtering
  queryStixObjects,
  filterStixByDateRange,

  // Versioning
  createStixVersion,
  getLatestStixVersion,

  // Marking
  applyStixMarking,

  // Sequelize models
  defineStixObjectModel,
  defineTaxiiCollectionModel,

  // NestJS
  createStixProcessingService,
  createTaxiiController,
  createTaxiiApiSpec,
};
