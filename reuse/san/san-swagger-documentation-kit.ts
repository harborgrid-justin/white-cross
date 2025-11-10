/**
 * LOC: SAN-SWG-DOC-001
 * File: /reuse/san/san-swagger-documentation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - SAN API controllers and documentation
 *   - Storage management endpoints
 *   - Volume, LUN, snapshot, replication controllers
 *   - OpenAPI specification generation
 */

/**
 * File: /reuse/san/san-swagger-documentation-kit.ts
 * Locator: WC-SAN-SWG-DOC-001
 * Purpose: SAN Swagger/OpenAPI Documentation Kit - Comprehensive API documentation for Storage Area Network operations
 *
 * Upstream: Independent utility module for SAN API documentation
 * Downstream: ../backend/*, SAN controllers, Storage services, API documentation generation
 * Dependencies: TypeScript 5.x, Node 18+, OpenAPI 3.0+ compatible, @nestjs/swagger
 * Exports: 38 utility functions for SAN-specific Swagger/OpenAPI documentation
 *
 * LLM Context: Enterprise-grade SAN documentation utilities for OpenAPI/Swagger specifications.
 * Provides schema builders for Volumes, LUNs, Snapshots, Replication, Fibre Channel, iSCSI,
 * storage pools, performance metrics, QoS policies, and healthcare-specific storage operations.
 * Essential for maintaining consistent, production-ready API documentation for storage area
 * network management in the White Cross healthcare platform with HIPAA compliance.
 *
 * Key Features:
 * - Volume, LUN, snapshot, and replication schema definitions
 * - Healthcare-specific examples (DICOM, PACS, medical imaging)
 * - Storage performance and capacity documentation
 * - Security scheme definitions (iSCSI CHAP, Fibre Channel zoning)
 * - Error response schemas with detailed troubleshooting
 * - Pagination, filtering, and sorting for large datasets
 * - HIPAA-compliant audit trail documentation
 * - Multi-tenancy and isolation schemas
 * - Real-time monitoring and metrics endpoints
 * - Storage pool and capacity planning documentation
 */

// ============================================================================
// TYPE DEFINITIONS - OPENAPI CORE TYPES
// ============================================================================

interface OpenAPISpec {
  openapi: string;
  info: InfoObject;
  servers?: ServerObject[];
  paths: PathsObject;
  components?: ComponentsObject;
  security?: SecurityRequirementObject[];
  tags?: TagObject[];
  externalDocs?: ExternalDocumentationObject;
}

interface InfoObject {
  title: string;
  description?: string;
  version: string;
  contact?: ContactObject;
  license?: LicenseObject;
}

interface ContactObject {
  name?: string;
  url?: string;
  email?: string;
}

interface LicenseObject {
  name: string;
  url?: string;
}

interface ServerObject {
  url: string;
  description?: string;
  variables?: Record<string, ServerVariableObject>;
}

interface ServerVariableObject {
  enum?: string[];
  default: string;
  description?: string;
}

interface ComponentsObject {
  schemas?: Record<string, SchemaObject>;
  responses?: Record<string, ResponseObject>;
  parameters?: Record<string, ParameterObject>;
  examples?: Record<string, ExampleObject>;
  requestBodies?: Record<string, RequestBodyObject>;
  headers?: Record<string, HeaderObject>;
  securitySchemes?: Record<string, SecuritySchemeObject>;
  links?: Record<string, LinkObject>;
  callbacks?: Record<string, CallbackObject>;
}

interface SchemaObject {
  type?: string;
  format?: string;
  title?: string;
  description?: string;
  default?: any;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  enum?: any[];
  properties?: Record<string, SchemaObject>;
  items?: SchemaObject;
  allOf?: SchemaObject[];
  oneOf?: SchemaObject[];
  anyOf?: SchemaObject[];
  not?: SchemaObject;
  discriminator?: DiscriminatorObject;
  nullable?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  example?: any;
  examples?: any[];
  deprecated?: boolean;
  $ref?: string;
}

interface DiscriminatorObject {
  propertyName: string;
  mapping?: Record<string, string>;
}

interface ResponseObject {
  description: string;
  headers?: Record<string, HeaderObject>;
  content?: Record<string, MediaTypeObject>;
  links?: Record<string, LinkObject>;
}

interface MediaTypeObject {
  schema?: SchemaObject;
  example?: any;
  examples?: Record<string, ExampleObject>;
  encoding?: Record<string, EncodingObject>;
}

interface EncodingObject {
  contentType?: string;
  headers?: Record<string, HeaderObject>;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
}

interface ParameterObject {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  schema?: SchemaObject;
  example?: any;
  examples?: Record<string, ExampleObject>;
}

interface HeaderObject {
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  schema?: SchemaObject;
  example?: any;
}

interface ExampleObject {
  summary?: string;
  description?: string;
  value?: any;
  externalValue?: string;
}

interface RequestBodyObject {
  description?: string;
  content: Record<string, MediaTypeObject>;
  required?: boolean;
}

interface SecuritySchemeObject {
  type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';
  description?: string;
  name?: string;
  in?: 'query' | 'header' | 'cookie';
  scheme?: string;
  bearerFormat?: string;
  flows?: OAuthFlowsObject;
  openIdConnectUrl?: string;
}

interface OAuthFlowsObject {
  implicit?: OAuthFlowObject;
  password?: OAuthFlowObject;
  clientCredentials?: OAuthFlowObject;
  authorizationCode?: OAuthFlowObject;
}

interface OAuthFlowObject {
  authorizationUrl?: string;
  tokenUrl?: string;
  refreshUrl?: string;
  scopes: Record<string, string>;
}

interface LinkObject {
  operationRef?: string;
  operationId?: string;
  parameters?: Record<string, any>;
  requestBody?: any;
  description?: string;
  server?: ServerObject;
}

interface CallbackObject {
  [expression: string]: PathItemObject;
}

interface PathItemObject {
  summary?: string;
  description?: string;
  get?: OperationObject;
  put?: OperationObject;
  post?: OperationObject;
  delete?: OperationObject;
  options?: OperationObject;
  head?: OperationObject;
  patch?: OperationObject;
  trace?: OperationObject;
  servers?: ServerObject[];
  parameters?: ParameterObject[];
}

interface OperationObject {
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: ExternalDocumentationObject;
  operationId?: string;
  parameters?: ParameterObject[];
  requestBody?: RequestBodyObject;
  responses: Record<string, ResponseObject>;
  callbacks?: Record<string, CallbackObject>;
  deprecated?: boolean;
  security?: SecurityRequirementObject[];
  servers?: ServerObject[];
}

interface ExternalDocumentationObject {
  description?: string;
  url: string;
}

interface TagObject {
  name: string;
  description?: string;
  externalDocs?: ExternalDocumentationObject;
}

interface SecurityRequirementObject {
  [name: string]: string[];
}

interface PathsObject {
  [path: string]: PathItemObject;
}

// ============================================================================
// TYPE DEFINITIONS - SAN DOMAIN MODELS
// ============================================================================

/**
 * Volume schema type definition
 */
interface VolumeSchema {
  id: string;
  name: string;
  description?: string;
  sizeGb: number;
  usedGb: number;
  status: 'creating' | 'available' | 'in-use' | 'deleting' | 'error' | 'migrating';
  volumeType: 'standard' | 'high-performance' | 'archive' | 'medical-imaging';
  storagePoolId: string;
  tenantId: string;
  encryptionEnabled: boolean;
  encryptionKeyId?: string;
  compressionEnabled: boolean;
  deduplicationEnabled: boolean;
  replicationEnabled: boolean;
  snapshotCount: number;
  lunMappings: LUNMappingSchema[];
  qosPolicy?: QoSPolicySchema;
  tags: Record<string, string>;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

/**
 * LUN schema type definition
 */
interface LUNSchema {
  id: string;
  volumeId: string;
  lunNumber: number;
  sizeGb: number;
  protocol: 'iscsi' | 'fc' | 'fcoe';
  targetId: string;
  initiatorGroups: string[];
  status: 'online' | 'offline' | 'degraded';
  multipath: boolean;
  readOnly: boolean;
  bootable: boolean;
  hostMappings: HostMappingSchema[];
  performanceMetrics?: PerformanceMetricsSchema;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Snapshot schema type definition
 */
interface SnapshotSchema {
  id: string;
  volumeId: string;
  name: string;
  description?: string;
  sizeGb: number;
  status: 'creating' | 'available' | 'deleting' | 'error';
  snapshotType: 'manual' | 'scheduled' | 'backup' | 'replication';
  retentionDays: number;
  expiresAt: Date;
  parentSnapshotId?: string;
  childSnapshotIds: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  createdBy: string;
}

/**
 * Replication schema type definition
 */
interface ReplicationSchema {
  id: string;
  sourceVolumeId: string;
  targetVolumeId: string;
  replicationType: 'synchronous' | 'asynchronous' | 'snapshot-based';
  status: 'initializing' | 'replicating' | 'paused' | 'failed' | 'complete';
  direction: 'unidirectional' | 'bidirectional';
  scheduleType: 'continuous' | 'scheduled' | 'manual';
  schedule?: string;
  lag: number;
  lastSyncAt?: Date;
  dataCopiedGb: number;
  failoverReady: boolean;
  priority: number;
  bandwidth?: number;
  compression: boolean;
  encryption: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * LUN mapping schema
 */
interface LUNMappingSchema {
  lunId: string;
  lunNumber: number;
  targetId: string;
  protocol: string;
}

/**
 * QoS policy schema
 */
interface QoSPolicySchema {
  id: string;
  name: string;
  maxIops?: number;
  minIops?: number;
  maxThroughputMbps?: number;
  minThroughputMbps?: number;
  burstIops?: number;
  priority: number;
}

/**
 * Host mapping schema
 */
interface HostMappingSchema {
  hostId: string;
  hostName: string;
  wwpn?: string;
  iqn?: string;
  accessMode: 'read-write' | 'read-only';
}

/**
 * Performance metrics schema
 */
interface PerformanceMetricsSchema {
  iops: number;
  throughputMbps: number;
  latencyMs: number;
  queueDepth: number;
  readIops: number;
  writeIops: number;
  readThroughputMbps: number;
  writeThroughputMbps: number;
  timestamp: Date;
}

/**
 * Storage pool schema
 */
interface StoragePoolSchema {
  id: string;
  name: string;
  totalCapacityGb: number;
  usedCapacityGb: number;
  availableCapacityGb: number;
  oversubscriptionRatio: number;
  tierType: 'ssd' | 'sas' | 'sata' | 'nvme' | 'hybrid';
  redundancyLevel: 'raid0' | 'raid1' | 'raid5' | 'raid6' | 'raid10';
  compressionRatio: number;
  deduplicationRatio: number;
  volumeCount: number;
  status: 'healthy' | 'degraded' | 'offline';
}

// ============================================================================
// VOLUME SCHEMA DOCUMENTATION FUNCTIONS
// ============================================================================

/**
 * 1. Creates OpenAPI schema for SAN Volume object.
 *
 * @param {boolean} [includeMetrics] - Whether to include performance metrics
 * @returns {SchemaObject} OpenAPI Volume schema
 *
 * @example
 * ```typescript
 * const volumeSchema = createVolumeSchema(true);
 * // Complete volume schema with performance metrics
 * ```
 */
export const createVolumeSchema = (includeMetrics: boolean = false): SchemaObject => {
  const properties: Record<string, SchemaObject> = {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique volume identifier',
      readOnly: true,
      example: 'vol-550e8400-e29b-41d4-a716-446655440000',
    },
    name: {
      type: 'string',
      minLength: 3,
      maxLength: 128,
      pattern: '^[a-zA-Z0-9][a-zA-Z0-9-_]*$',
      description: 'Volume name (alphanumeric, hyphens, underscores)',
      example: 'dicom-pacs-storage-vol-001',
    },
    description: {
      type: 'string',
      maxLength: 512,
      description: 'Optional volume description',
      example: 'Primary DICOM PACS storage for radiology department',
      nullable: true,
    },
    sizeGb: {
      type: 'integer',
      minimum: 1,
      maximum: 1048576,
      description: 'Volume size in gigabytes (1GB - 1PB)',
      example: 5120,
    },
    usedGb: {
      type: 'number',
      format: 'double',
      minimum: 0,
      description: 'Used capacity in gigabytes',
      readOnly: true,
      example: 3847.25,
    },
    status: {
      type: 'string',
      enum: ['creating', 'available', 'in-use', 'deleting', 'error', 'migrating'],
      description: 'Current volume status',
      example: 'available',
    },
    volumeType: {
      type: 'string',
      enum: ['standard', 'high-performance', 'archive', 'medical-imaging'],
      description: 'Volume type optimized for specific workloads',
      example: 'medical-imaging',
    },
    storagePoolId: {
      type: 'string',
      format: 'uuid',
      description: 'Parent storage pool identifier',
      example: 'pool-a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    },
    tenantId: {
      type: 'string',
      format: 'uuid',
      description: 'Tenant/organization identifier for multi-tenancy',
      example: 'tenant-hospital-central',
    },
    encryptionEnabled: {
      type: 'boolean',
      description: 'Whether volume encryption is enabled (HIPAA compliance)',
      example: true,
    },
    encryptionKeyId: {
      type: 'string',
      format: 'uuid',
      description: 'KMS encryption key identifier',
      example: 'key-9f8e7d6c-5b4a-3210-fedc-ba9876543210',
      nullable: true,
    },
    compressionEnabled: {
      type: 'boolean',
      description: 'Whether inline compression is enabled',
      example: true,
    },
    deduplicationEnabled: {
      type: 'boolean',
      description: 'Whether inline deduplication is enabled',
      example: true,
    },
    replicationEnabled: {
      type: 'boolean',
      description: 'Whether volume replication is enabled',
      example: true,
    },
    snapshotCount: {
      type: 'integer',
      minimum: 0,
      description: 'Number of snapshots for this volume',
      readOnly: true,
      example: 24,
    },
    lunMappings: {
      type: 'array',
      description: 'LUN mappings for this volume',
      items: { $ref: '#/components/schemas/LUNMapping' },
    },
    qosPolicy: {
      $ref: '#/components/schemas/QoSPolicy',
      description: 'Quality of Service policy for performance management',
      nullable: true,
    },
    tags: {
      type: 'object',
      description: 'User-defined tags for organization and filtering',
      additionalProperties: { type: 'string' },
      example: { department: 'radiology', criticality: 'high', compliance: 'hipaa' },
    },
    metadata: {
      type: 'object',
      description: 'Additional metadata for volume',
      additionalProperties: true,
      example: { dicomAETitle: 'PACS_CENTRAL', modalitySupport: ['CT', 'MRI', 'XR'] },
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Volume creation timestamp',
      readOnly: true,
      example: '2025-11-08T10:30:00.000Z',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Volume last update timestamp',
      readOnly: true,
      example: '2025-11-08T14:45:00.000Z',
    },
    createdBy: {
      type: 'string',
      format: 'uuid',
      description: 'User ID who created the volume',
      readOnly: true,
      example: 'user-admin-1234',
    },
  };

  if (includeMetrics) {
    properties.performanceMetrics = {
      $ref: '#/components/schemas/PerformanceMetrics',
      description: 'Real-time performance metrics',
    };
  }

  return {
    type: 'object',
    required: ['name', 'sizeGb', 'volumeType', 'storagePoolId', 'tenantId'],
    properties,
    description: 'SAN Volume - Primary storage entity for healthcare data and medical imaging',
  };
};

/**
 * 2. Creates OpenAPI schema for LUN (Logical Unit Number) object.
 *
 * @param {boolean} [includeHostDetails] - Whether to include detailed host mapping information
 * @returns {SchemaObject} OpenAPI LUN schema
 *
 * @example
 * ```typescript
 * const lunSchema = createLUNSchema(true);
 * ```
 */
export const createLUNSchema = (includeHostDetails: boolean = false): SchemaObject => {
  const properties: Record<string, SchemaObject> = {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique LUN identifier',
      readOnly: true,
      example: 'lun-1234abcd-5678-90ef-ghij-klmnopqrstuv',
    },
    volumeId: {
      type: 'string',
      format: 'uuid',
      description: 'Parent volume identifier',
      example: 'vol-550e8400-e29b-41d4-a716-446655440000',
    },
    lunNumber: {
      type: 'integer',
      minimum: 0,
      maximum: 255,
      description: 'LUN number (0-255) for SCSI addressing',
      example: 5,
    },
    sizeGb: {
      type: 'integer',
      minimum: 1,
      description: 'LUN size in gigabytes',
      example: 512,
    },
    protocol: {
      type: 'string',
      enum: ['iscsi', 'fc', 'fcoe'],
      description: 'Storage protocol (iSCSI, Fibre Channel, FCoE)',
      example: 'iscsi',
    },
    targetId: {
      type: 'string',
      description: 'Target identifier (IQN for iSCSI, WWPN for FC)',
      example: 'iqn.2025-11.com.whitecross:storage.target01',
    },
    initiatorGroups: {
      type: 'array',
      description: 'List of initiator groups with access to this LUN',
      items: { type: 'string' },
      example: ['ig-radiology-workstations', 'ig-pacs-servers'],
    },
    status: {
      type: 'string',
      enum: ['online', 'offline', 'degraded'],
      description: 'Current LUN status',
      example: 'online',
    },
    multipath: {
      type: 'boolean',
      description: 'Whether multipath I/O is enabled for high availability',
      example: true,
    },
    readOnly: {
      type: 'boolean',
      description: 'Whether LUN is mounted as read-only',
      example: false,
    },
    bootable: {
      type: 'boolean',
      description: 'Whether LUN is configured as bootable device',
      example: false,
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'LUN creation timestamp',
      readOnly: true,
      example: '2025-11-08T10:30:00.000Z',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'LUN last update timestamp',
      readOnly: true,
      example: '2025-11-08T14:45:00.000Z',
    },
  };

  if (includeHostDetails) {
    properties.hostMappings = {
      type: 'array',
      description: 'Detailed host mapping information',
      items: { $ref: '#/components/schemas/HostMapping' },
    };
    properties.performanceMetrics = {
      $ref: '#/components/schemas/PerformanceMetrics',
      description: 'Real-time LUN performance metrics',
    };
  }

  return {
    type: 'object',
    required: ['volumeId', 'lunNumber', 'sizeGb', 'protocol', 'targetId'],
    properties,
    description: 'LUN (Logical Unit Number) - SCSI logical unit for host access to storage',
  };
};

/**
 * 3. Creates OpenAPI schema for Snapshot object.
 *
 * @param {boolean} [includeRelationships] - Whether to include parent/child snapshot relationships
 * @returns {SchemaObject} OpenAPI Snapshot schema
 *
 * @example
 * ```typescript
 * const snapshotSchema = createSnapshotSchema(true);
 * ```
 */
export const createSnapshotSchema = (includeRelationships: boolean = false): SchemaObject => {
  const properties: Record<string, SchemaObject> = {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique snapshot identifier',
      readOnly: true,
      example: 'snap-20251108-103000-vol001',
    },
    volumeId: {
      type: 'string',
      format: 'uuid',
      description: 'Parent volume identifier',
      example: 'vol-550e8400-e29b-41d4-a716-446655440000',
    },
    name: {
      type: 'string',
      minLength: 3,
      maxLength: 128,
      description: 'Snapshot name',
      example: 'pacs-daily-backup-20251108',
    },
    description: {
      type: 'string',
      maxLength: 512,
      description: 'Optional snapshot description',
      example: 'Daily automated backup before system maintenance',
      nullable: true,
    },
    sizeGb: {
      type: 'number',
      format: 'double',
      minimum: 0,
      description: 'Snapshot size in gigabytes',
      readOnly: true,
      example: 3847.25,
    },
    status: {
      type: 'string',
      enum: ['creating', 'available', 'deleting', 'error'],
      description: 'Current snapshot status',
      example: 'available',
    },
    snapshotType: {
      type: 'string',
      enum: ['manual', 'scheduled', 'backup', 'replication'],
      description: 'Type of snapshot creation trigger',
      example: 'scheduled',
    },
    retentionDays: {
      type: 'integer',
      minimum: 1,
      maximum: 3650,
      description: 'Snapshot retention period in days (1-3650)',
      example: 30,
    },
    expiresAt: {
      type: 'string',
      format: 'date-time',
      description: 'Snapshot expiration timestamp',
      example: '2025-12-08T10:30:00.000Z',
    },
    metadata: {
      type: 'object',
      description: 'Additional metadata for snapshot',
      additionalProperties: true,
      example: { backupType: 'incremental', compressionRatio: 2.4 },
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Snapshot creation timestamp',
      readOnly: true,
      example: '2025-11-08T10:30:00.000Z',
    },
    createdBy: {
      type: 'string',
      format: 'uuid',
      description: 'User ID who created the snapshot',
      readOnly: true,
      example: 'user-admin-1234',
    },
  };

  if (includeRelationships) {
    properties.parentSnapshotId = {
      type: 'string',
      format: 'uuid',
      description: 'Parent snapshot ID for incremental snapshots',
      nullable: true,
      example: 'snap-20251107-103000-vol001',
    };
    properties.childSnapshotIds = {
      type: 'array',
      description: 'Child snapshot IDs derived from this snapshot',
      items: { type: 'string', format: 'uuid' },
      example: ['snap-20251109-103000-vol001', 'snap-20251110-103000-vol001'],
    };
  }

  return {
    type: 'object',
    required: ['volumeId', 'name', 'snapshotType', 'retentionDays'],
    properties,
    description: 'Snapshot - Point-in-time copy of volume for backup and recovery',
  };
};

/**
 * 4. Creates OpenAPI schema for Replication object.
 *
 * @param {boolean} [includeDetailedMetrics] - Whether to include detailed replication metrics
 * @returns {SchemaObject} OpenAPI Replication schema
 *
 * @example
 * ```typescript
 * const replicationSchema = createReplicationSchema(true);
 * ```
 */
export const createReplicationSchema = (includeDetailedMetrics: boolean = false): SchemaObject => {
  const properties: Record<string, SchemaObject> = {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique replication relationship identifier',
      readOnly: true,
      example: 'repl-a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    },
    sourceVolumeId: {
      type: 'string',
      format: 'uuid',
      description: 'Source volume identifier',
      example: 'vol-550e8400-e29b-41d4-a716-446655440000',
    },
    targetVolumeId: {
      type: 'string',
      format: 'uuid',
      description: 'Target volume identifier (can be remote)',
      example: 'vol-660f9511-f30c-52e5-b827-557766551111',
    },
    replicationType: {
      type: 'string',
      enum: ['synchronous', 'asynchronous', 'snapshot-based'],
      description: 'Replication mode',
      example: 'asynchronous',
    },
    status: {
      type: 'string',
      enum: ['initializing', 'replicating', 'paused', 'failed', 'complete'],
      description: 'Current replication status',
      example: 'replicating',
    },
    direction: {
      type: 'string',
      enum: ['unidirectional', 'bidirectional'],
      description: 'Replication direction',
      example: 'unidirectional',
    },
    scheduleType: {
      type: 'string',
      enum: ['continuous', 'scheduled', 'manual'],
      description: 'Replication schedule type',
      example: 'continuous',
    },
    schedule: {
      type: 'string',
      description: 'Cron expression for scheduled replication',
      pattern: '^(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\\d+(ns|us|µs|ms|s|m|h))+)|((((\\d+,)+\\d+|(\\d+([/-])\\d+)|\\d+|\\*) ?){5,7})$',
      example: '0 */6 * * *',
      nullable: true,
    },
    lag: {
      type: 'integer',
      minimum: 0,
      description: 'Replication lag in seconds',
      readOnly: true,
      example: 45,
    },
    lastSyncAt: {
      type: 'string',
      format: 'date-time',
      description: 'Last successful synchronization timestamp',
      readOnly: true,
      example: '2025-11-08T14:40:00.000Z',
      nullable: true,
    },
    dataCopiedGb: {
      type: 'number',
      format: 'double',
      minimum: 0,
      description: 'Total data replicated in gigabytes',
      readOnly: true,
      example: 3847.25,
    },
    failoverReady: {
      type: 'boolean',
      description: 'Whether target volume is ready for failover',
      readOnly: true,
      example: true,
    },
    priority: {
      type: 'integer',
      minimum: 1,
      maximum: 10,
      description: 'Replication priority (1=highest, 10=lowest)',
      example: 3,
    },
    bandwidth: {
      type: 'integer',
      minimum: 1,
      description: 'Maximum bandwidth in Mbps',
      example: 1000,
      nullable: true,
    },
    compression: {
      type: 'boolean',
      description: 'Whether replication data is compressed',
      example: true,
    },
    encryption: {
      type: 'boolean',
      description: 'Whether replication traffic is encrypted',
      example: true,
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Replication relationship creation timestamp',
      readOnly: true,
      example: '2025-11-08T10:30:00.000Z',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Replication relationship last update timestamp',
      readOnly: true,
      example: '2025-11-08T14:45:00.000Z',
    },
  };

  if (includeDetailedMetrics) {
    properties.metrics = {
      type: 'object',
      description: 'Detailed replication metrics',
      properties: {
        throughputMbps: { type: 'number', example: 850.5 },
        pendingDataGb: { type: 'number', example: 12.5 },
        avgLagSeconds: { type: 'integer', example: 45 },
        errorCount: { type: 'integer', example: 0 },
        retryCount: { type: 'integer', example: 2 },
      },
    };
  }

  return {
    type: 'object',
    required: ['sourceVolumeId', 'targetVolumeId', 'replicationType', 'direction', 'scheduleType'],
    properties,
    description: 'Replication - Volume replication relationship for disaster recovery and high availability',
  };
};

/**
 * 5. Creates OpenAPI schema for Storage Pool object.
 *
 * @returns {SchemaObject} OpenAPI Storage Pool schema
 *
 * @example
 * ```typescript
 * const poolSchema = createStoragePoolSchema();
 * ```
 */
export const createStoragePoolSchema = (): SchemaObject => {
  return {
    type: 'object',
    required: ['name', 'totalCapacityGb', 'tierType', 'redundancyLevel'],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique storage pool identifier',
        readOnly: true,
        example: 'pool-a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
      },
      name: {
        type: 'string',
        minLength: 3,
        maxLength: 128,
        description: 'Storage pool name',
        example: 'medical-imaging-ssd-pool',
      },
      totalCapacityGb: {
        type: 'integer',
        minimum: 1,
        description: 'Total pool capacity in gigabytes',
        example: 102400,
      },
      usedCapacityGb: {
        type: 'number',
        format: 'double',
        minimum: 0,
        description: 'Used capacity in gigabytes',
        readOnly: true,
        example: 76800.5,
      },
      availableCapacityGb: {
        type: 'number',
        format: 'double',
        minimum: 0,
        description: 'Available capacity in gigabytes',
        readOnly: true,
        example: 25599.5,
      },
      oversubscriptionRatio: {
        type: 'number',
        format: 'double',
        minimum: 1.0,
        description: 'Pool oversubscription ratio',
        example: 1.5,
      },
      tierType: {
        type: 'string',
        enum: ['ssd', 'sas', 'sata', 'nvme', 'hybrid'],
        description: 'Storage tier type',
        example: 'nvme',
      },
      redundancyLevel: {
        type: 'string',
        enum: ['raid0', 'raid1', 'raid5', 'raid6', 'raid10'],
        description: 'RAID redundancy level',
        example: 'raid6',
      },
      compressionRatio: {
        type: 'number',
        format: 'double',
        minimum: 1.0,
        description: 'Average compression ratio across pool',
        readOnly: true,
        example: 2.3,
      },
      deduplicationRatio: {
        type: 'number',
        format: 'double',
        minimum: 1.0,
        description: 'Average deduplication ratio across pool',
        readOnly: true,
        example: 3.5,
      },
      volumeCount: {
        type: 'integer',
        minimum: 0,
        description: 'Number of volumes in this pool',
        readOnly: true,
        example: 47,
      },
      status: {
        type: 'string',
        enum: ['healthy', 'degraded', 'offline'],
        description: 'Current pool health status',
        example: 'healthy',
      },
    },
    description: 'Storage Pool - Container for volumes with shared capacity and performance characteristics',
  };
};

/**
 * 6. Creates OpenAPI schema for Performance Metrics object.
 *
 * @returns {SchemaObject} OpenAPI Performance Metrics schema
 *
 * @example
 * ```typescript
 * const metricsSchema = createPerformanceMetricsSchema();
 * ```
 */
export const createPerformanceMetricsSchema = (): SchemaObject => {
  return {
    type: 'object',
    properties: {
      iops: {
        type: 'integer',
        minimum: 0,
        description: 'Total I/O operations per second',
        example: 12500,
      },
      throughputMbps: {
        type: 'number',
        format: 'double',
        minimum: 0,
        description: 'Total throughput in megabytes per second',
        example: 1850.5,
      },
      latencyMs: {
        type: 'number',
        format: 'double',
        minimum: 0,
        description: 'Average I/O latency in milliseconds',
        example: 2.3,
      },
      queueDepth: {
        type: 'integer',
        minimum: 0,
        description: 'Current I/O queue depth',
        example: 32,
      },
      readIops: {
        type: 'integer',
        minimum: 0,
        description: 'Read I/O operations per second',
        example: 8200,
      },
      writeIops: {
        type: 'integer',
        minimum: 0,
        description: 'Write I/O operations per second',
        example: 4300,
      },
      readThroughputMbps: {
        type: 'number',
        format: 'double',
        minimum: 0,
        description: 'Read throughput in megabytes per second',
        example: 1200.3,
      },
      writeThroughputMbps: {
        type: 'number',
        format: 'double',
        minimum: 0,
        description: 'Write throughput in megabytes per second',
        example: 650.2,
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        description: 'Metrics collection timestamp',
        example: '2025-11-08T14:45:30.000Z',
      },
    },
    description: 'Performance Metrics - Real-time storage performance measurements',
  };
};

/**
 * 7. Creates OpenAPI schema for QoS Policy object.
 *
 * @returns {SchemaObject} OpenAPI QoS Policy schema
 *
 * @example
 * ```typescript
 * const qosSchema = createQoSPolicySchema();
 * ```
 */
export const createQoSPolicySchema = (): SchemaObject => {
  return {
    type: 'object',
    required: ['name', 'priority'],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique QoS policy identifier',
        readOnly: true,
        example: 'qos-high-priority-medical',
      },
      name: {
        type: 'string',
        minLength: 3,
        maxLength: 64,
        description: 'QoS policy name',
        example: 'high-priority-medical-imaging',
      },
      maxIops: {
        type: 'integer',
        minimum: 1,
        description: 'Maximum IOPS limit',
        example: 50000,
        nullable: true,
      },
      minIops: {
        type: 'integer',
        minimum: 1,
        description: 'Minimum guaranteed IOPS',
        example: 10000,
        nullable: true,
      },
      maxThroughputMbps: {
        type: 'integer',
        minimum: 1,
        description: 'Maximum throughput limit in Mbps',
        example: 5000,
        nullable: true,
      },
      minThroughputMbps: {
        type: 'integer',
        minimum: 1,
        description: 'Minimum guaranteed throughput in Mbps',
        example: 1000,
        nullable: true,
      },
      burstIops: {
        type: 'integer',
        minimum: 1,
        description: 'Burst IOPS allowance',
        example: 75000,
        nullable: true,
      },
      priority: {
        type: 'integer',
        minimum: 1,
        maximum: 10,
        description: 'QoS priority (1=highest, 10=lowest)',
        example: 1,
      },
    },
    description: 'QoS Policy - Quality of Service policy for performance management and prioritization',
  };
};

// ============================================================================
// REQUEST/RESPONSE SCHEMA FUNCTIONS
// ============================================================================

/**
 * 8. Creates volume creation request schema.
 *
 * @returns {SchemaObject} Volume creation request schema
 *
 * @example
 * ```typescript
 * const createVolumeRequest = createVolumeCreateRequestSchema();
 * ```
 */
export const createVolumeCreateRequestSchema = (): SchemaObject => {
  return {
    type: 'object',
    required: ['name', 'sizeGb', 'volumeType', 'storagePoolId', 'tenantId'],
    properties: {
      name: {
        type: 'string',
        minLength: 3,
        maxLength: 128,
        pattern: '^[a-zA-Z0-9][a-zA-Z0-9-_]*$',
        description: 'Volume name',
        example: 'dicom-pacs-storage-vol-001',
      },
      description: {
        type: 'string',
        maxLength: 512,
        description: 'Volume description',
        example: 'Primary DICOM PACS storage for radiology',
      },
      sizeGb: {
        type: 'integer',
        minimum: 1,
        maximum: 1048576,
        description: 'Volume size in gigabytes',
        example: 5120,
      },
      volumeType: {
        type: 'string',
        enum: ['standard', 'high-performance', 'archive', 'medical-imaging'],
        description: 'Volume type',
        example: 'medical-imaging',
      },
      storagePoolId: {
        type: 'string',
        format: 'uuid',
        description: 'Storage pool identifier',
        example: 'pool-a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
      },
      tenantId: {
        type: 'string',
        format: 'uuid',
        description: 'Tenant identifier',
        example: 'tenant-hospital-central',
      },
      encryptionEnabled: {
        type: 'boolean',
        description: 'Enable volume encryption (recommended for HIPAA)',
        default: true,
      },
      compressionEnabled: {
        type: 'boolean',
        description: 'Enable inline compression',
        default: true,
      },
      deduplicationEnabled: {
        type: 'boolean',
        description: 'Enable inline deduplication',
        default: true,
      },
      qosPolicyId: {
        type: 'string',
        format: 'uuid',
        description: 'QoS policy identifier',
        example: 'qos-high-priority-medical',
      },
      tags: {
        type: 'object',
        description: 'User-defined tags',
        additionalProperties: { type: 'string' },
        example: { department: 'radiology', criticality: 'high' },
      },
    },
    description: 'Request to create a new SAN volume',
  };
};

/**
 * 9. Creates volume update request schema.
 *
 * @returns {SchemaObject} Volume update request schema
 *
 * @example
 * ```typescript
 * const updateVolumeRequest = createVolumeUpdateRequestSchema();
 * ```
 */
export const createVolumeUpdateRequestSchema = (): SchemaObject => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 3,
        maxLength: 128,
        description: 'New volume name',
      },
      description: {
        type: 'string',
        maxLength: 512,
        description: 'Updated description',
      },
      sizeGb: {
        type: 'integer',
        minimum: 1,
        description: 'New size in GB (only increases allowed)',
      },
      qosPolicyId: {
        type: 'string',
        format: 'uuid',
        description: 'New QoS policy identifier',
      },
      tags: {
        type: 'object',
        description: 'Updated tags',
        additionalProperties: { type: 'string' },
      },
    },
    description: 'Request to update an existing volume',
  };
};

/**
 * 10. Creates snapshot creation request schema.
 *
 * @returns {SchemaObject} Snapshot creation request schema
 *
 * @example
 * ```typescript
 * const createSnapshotRequest = createSnapshotCreateRequestSchema();
 * ```
 */
export const createSnapshotCreateRequestSchema = (): SchemaObject => {
  return {
    type: 'object',
    required: ['volumeId', 'name', 'retentionDays'],
    properties: {
      volumeId: {
        type: 'string',
        format: 'uuid',
        description: 'Volume identifier to snapshot',
        example: 'vol-550e8400-e29b-41d4-a716-446655440000',
      },
      name: {
        type: 'string',
        minLength: 3,
        maxLength: 128,
        description: 'Snapshot name',
        example: 'pacs-daily-backup-20251108',
      },
      description: {
        type: 'string',
        maxLength: 512,
        description: 'Snapshot description',
        example: 'Daily automated backup',
      },
      snapshotType: {
        type: 'string',
        enum: ['manual', 'scheduled', 'backup', 'replication'],
        description: 'Snapshot type',
        default: 'manual',
      },
      retentionDays: {
        type: 'integer',
        minimum: 1,
        maximum: 3650,
        description: 'Retention period in days',
        example: 30,
      },
      metadata: {
        type: 'object',
        description: 'Additional metadata',
        additionalProperties: true,
      },
    },
    description: 'Request to create a volume snapshot',
  };
};

/**
 * 11. Creates replication configuration request schema.
 *
 * @returns {SchemaObject} Replication configuration request schema
 *
 * @example
 * ```typescript
 * const replicationRequest = createReplicationConfigRequestSchema();
 * ```
 */
export const createReplicationConfigRequestSchema = (): SchemaObject => {
  return {
    type: 'object',
    required: ['sourceVolumeId', 'targetVolumeId', 'replicationType', 'direction'],
    properties: {
      sourceVolumeId: {
        type: 'string',
        format: 'uuid',
        description: 'Source volume identifier',
        example: 'vol-550e8400-e29b-41d4-a716-446655440000',
      },
      targetVolumeId: {
        type: 'string',
        format: 'uuid',
        description: 'Target volume identifier',
        example: 'vol-660f9511-f30c-52e5-b827-557766551111',
      },
      replicationType: {
        type: 'string',
        enum: ['synchronous', 'asynchronous', 'snapshot-based'],
        description: 'Replication type',
        example: 'asynchronous',
      },
      direction: {
        type: 'string',
        enum: ['unidirectional', 'bidirectional'],
        description: 'Replication direction',
        example: 'unidirectional',
      },
      scheduleType: {
        type: 'string',
        enum: ['continuous', 'scheduled', 'manual'],
        description: 'Schedule type',
        default: 'continuous',
      },
      schedule: {
        type: 'string',
        description: 'Cron expression for scheduled replication',
        example: '0 */6 * * *',
      },
      priority: {
        type: 'integer',
        minimum: 1,
        maximum: 10,
        description: 'Replication priority',
        default: 5,
      },
      bandwidth: {
        type: 'integer',
        minimum: 1,
        description: 'Maximum bandwidth in Mbps',
        example: 1000,
      },
      compression: {
        type: 'boolean',
        description: 'Enable compression',
        default: true,
      },
      encryption: {
        type: 'boolean',
        description: 'Enable encryption',
        default: true,
      },
    },
    description: 'Request to configure volume replication',
  };
};

// ============================================================================
// ERROR RESPONSE SCHEMAS
// ============================================================================

/**
 * 12. Creates standard error response schema.
 *
 * @returns {SchemaObject} Error response schema
 *
 * @example
 * ```typescript
 * const errorSchema = createErrorResponseSchema();
 * ```
 */
export const createErrorResponseSchema = (): SchemaObject => {
  return {
    type: 'object',
    required: ['statusCode', 'error', 'message'],
    properties: {
      statusCode: {
        type: 'integer',
        description: 'HTTP status code',
        example: 400,
      },
      error: {
        type: 'string',
        description: 'Error type',
        example: 'Bad Request',
      },
      message: {
        type: 'string',
        description: 'Human-readable error message',
        example: 'Volume size cannot be decreased',
      },
      code: {
        type: 'string',
        description: 'Application-specific error code',
        example: 'SAN_VOLUME_SIZE_REDUCTION_NOT_ALLOWED',
      },
      details: {
        type: 'object',
        description: 'Additional error details',
        additionalProperties: true,
        example: { currentSizeGb: 1024, requestedSizeGb: 512 },
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        description: 'Error timestamp',
        example: '2025-11-08T14:45:30.000Z',
      },
      path: {
        type: 'string',
        description: 'Request path',
        example: '/api/v1/san/volumes/vol-123',
      },
      requestId: {
        type: 'string',
        format: 'uuid',
        description: 'Unique request identifier for troubleshooting',
        example: 'req-a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      },
    },
    description: 'Standard error response structure',
  };
};

/**
 * 13. Creates validation error response schema.
 *
 * @returns {SchemaObject} Validation error response schema
 *
 * @example
 * ```typescript
 * const validationErrorSchema = createValidationErrorResponseSchema();
 * ```
 */
export const createValidationErrorResponseSchema = (): SchemaObject => {
  return {
    type: 'object',
    required: ['statusCode', 'error', 'message', 'validationErrors'],
    properties: {
      statusCode: {
        type: 'integer',
        description: 'HTTP status code',
        example: 422,
      },
      error: {
        type: 'string',
        description: 'Error type',
        example: 'Validation Error',
      },
      message: {
        type: 'string',
        description: 'Human-readable error message',
        example: 'Request validation failed',
      },
      validationErrors: {
        type: 'array',
        description: 'List of validation errors',
        items: {
          type: 'object',
          properties: {
            field: {
              type: 'string',
              description: 'Field name that failed validation',
              example: 'sizeGb',
            },
            constraint: {
              type: 'string',
              description: 'Validation constraint that was violated',
              example: 'minimum',
            },
            message: {
              type: 'string',
              description: 'Validation error message',
              example: 'sizeGb must be at least 1',
            },
            value: {
              description: 'Invalid value provided',
              example: 0,
            },
          },
        },
        example: [
          {
            field: 'sizeGb',
            constraint: 'minimum',
            message: 'sizeGb must be at least 1',
            value: 0,
          },
        ],
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        description: 'Error timestamp',
        example: '2025-11-08T14:45:30.000Z',
      },
      path: {
        type: 'string',
        description: 'Request path',
        example: '/api/v1/san/volumes',
      },
    },
    description: 'Validation error response with detailed field errors',
  };
};

// ============================================================================
// PAGINATION AND FILTERING SCHEMAS
// ============================================================================

/**
 * 14. Creates pagination metadata schema.
 *
 * @returns {SchemaObject} Pagination metadata schema
 *
 * @example
 * ```typescript
 * const paginationSchema = createPaginationMetadataSchema();
 * ```
 */
export const createPaginationMetadataSchema = (): SchemaObject => {
  return {
    type: 'object',
    properties: {
      page: {
        type: 'integer',
        minimum: 1,
        description: 'Current page number',
        example: 2,
      },
      limit: {
        type: 'integer',
        minimum: 1,
        maximum: 1000,
        description: 'Items per page',
        example: 50,
      },
      totalPages: {
        type: 'integer',
        minimum: 0,
        description: 'Total number of pages',
        example: 10,
      },
      totalItems: {
        type: 'integer',
        minimum: 0,
        description: 'Total number of items',
        example: 487,
      },
      hasNextPage: {
        type: 'boolean',
        description: 'Whether there is a next page',
        example: true,
      },
      hasPreviousPage: {
        type: 'boolean',
        description: 'Whether there is a previous page',
        example: true,
      },
    },
    description: 'Pagination metadata for list responses',
  };
};

/**
 * 15. Creates paginated volume list response schema.
 *
 * @returns {SchemaObject} Paginated volume list response schema
 *
 * @example
 * ```typescript
 * const volumeListSchema = createPaginatedVolumeListResponseSchema();
 * ```
 */
export const createPaginatedVolumeListResponseSchema = (): SchemaObject => {
  return {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        description: 'Array of volumes',
        items: { $ref: '#/components/schemas/Volume' },
      },
      pagination: {
        $ref: '#/components/schemas/PaginationMetadata',
      },
    },
    description: 'Paginated list of volumes',
  };
};

// ============================================================================
// PARAMETER DEFINITIONS
// ============================================================================

/**
 * 16. Creates volume ID path parameter.
 *
 * @returns {ParameterObject} Volume ID parameter
 *
 * @example
 * ```typescript
 * const volumeIdParam = createVolumeIdPathParameter();
 * ```
 */
export const createVolumeIdPathParameter = (): ParameterObject => {
  return {
    name: 'volumeId',
    in: 'path',
    required: true,
    description: 'Unique volume identifier',
    schema: {
      type: 'string',
      format: 'uuid',
    },
    example: 'vol-550e8400-e29b-41d4-a716-446655440000',
  };
};

/**
 * 17. Creates pagination query parameters.
 *
 * @returns {ParameterObject[]} Array of pagination parameters
 *
 * @example
 * ```typescript
 * const paginationParams = createPaginationQueryParameters();
 * ```
 */
export const createPaginationQueryParameters = (): ParameterObject[] => {
  return [
    {
      name: 'page',
      in: 'query',
      required: false,
      description: 'Page number (starts at 1)',
      schema: {
        type: 'integer',
        minimum: 1,
        default: 1,
      },
      example: 1,
    },
    {
      name: 'limit',
      in: 'query',
      required: false,
      description: 'Items per page',
      schema: {
        type: 'integer',
        minimum: 1,
        maximum: 1000,
        default: 50,
      },
      example: 50,
    },
    {
      name: 'sortBy',
      in: 'query',
      required: false,
      description: 'Field to sort by',
      schema: {
        type: 'string',
        enum: ['name', 'createdAt', 'updatedAt', 'sizeGb', 'status'],
        default: 'createdAt',
      },
      example: 'name',
    },
    {
      name: 'sortOrder',
      in: 'query',
      required: false,
      description: 'Sort order',
      schema: {
        type: 'string',
        enum: ['asc', 'desc'],
        default: 'asc',
      },
      example: 'desc',
    },
  ];
};

/**
 * 18. Creates volume filtering query parameters.
 *
 * @returns {ParameterObject[]} Array of volume filter parameters
 *
 * @example
 * ```typescript
 * const filterParams = createVolumeFilterQueryParameters();
 * ```
 */
export const createVolumeFilterQueryParameters = (): ParameterObject[] => {
  return [
    {
      name: 'status',
      in: 'query',
      required: false,
      description: 'Filter by volume status',
      schema: {
        type: 'string',
        enum: ['creating', 'available', 'in-use', 'deleting', 'error', 'migrating'],
      },
      example: 'available',
    },
    {
      name: 'volumeType',
      in: 'query',
      required: false,
      description: 'Filter by volume type',
      schema: {
        type: 'string',
        enum: ['standard', 'high-performance', 'archive', 'medical-imaging'],
      },
      example: 'medical-imaging',
    },
    {
      name: 'storagePoolId',
      in: 'query',
      required: false,
      description: 'Filter by storage pool',
      schema: {
        type: 'string',
        format: 'uuid',
      },
      example: 'pool-a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    },
    {
      name: 'tenantId',
      in: 'query',
      required: false,
      description: 'Filter by tenant',
      schema: {
        type: 'string',
        format: 'uuid',
      },
      example: 'tenant-hospital-central',
    },
    {
      name: 'tags',
      in: 'query',
      required: false,
      description: 'Filter by tags (comma-separated key:value pairs)',
      schema: {
        type: 'string',
      },
      example: 'department:radiology,criticality:high',
    },
  ];
};

// ============================================================================
// SECURITY SCHEME DEFINITIONS
// ============================================================================

/**
 * 19. Creates Bearer JWT security scheme.
 *
 * @returns {SecuritySchemeObject} Bearer JWT security scheme
 *
 * @example
 * ```typescript
 * const bearerScheme = createBearerJWTSecurityScheme();
 * ```
 */
export const createBearerJWTSecurityScheme = (): SecuritySchemeObject => {
  return {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'JWT authentication token obtained from /auth/login endpoint',
  };
};

/**
 * 20. Creates API Key security scheme.
 *
 * @returns {SecuritySchemeObject} API Key security scheme
 *
 * @example
 * ```typescript
 * const apiKeyScheme = createAPIKeySecurityScheme();
 * ```
 */
export const createAPIKeySecurityScheme = (): SecuritySchemeObject => {
  return {
    type: 'apiKey',
    in: 'header',
    name: 'X-API-Key',
    description: 'API key for service-to-service authentication',
  };
};

/**
 * 21. Creates OAuth2 security scheme for SAN operations.
 *
 * @returns {SecuritySchemeObject} OAuth2 security scheme
 *
 * @example
 * ```typescript
 * const oauth2Scheme = createOAuth2SecurityScheme();
 * ```
 */
export const createOAuth2SecurityScheme = (): SecuritySchemeObject => {
  return {
    type: 'oauth2',
    description: 'OAuth2 authorization for SAN operations',
    flows: {
      authorizationCode: {
        authorizationUrl: 'https://auth.whitecross.com/oauth/authorize',
        tokenUrl: 'https://auth.whitecross.com/oauth/token',
        refreshUrl: 'https://auth.whitecross.com/oauth/refresh',
        scopes: {
          'san:volume:read': 'Read volume information',
          'san:volume:write': 'Create and modify volumes',
          'san:volume:delete': 'Delete volumes',
          'san:snapshot:read': 'Read snapshot information',
          'san:snapshot:write': 'Create snapshots',
          'san:snapshot:delete': 'Delete snapshots',
          'san:replication:read': 'Read replication status',
          'san:replication:write': 'Configure replication',
          'san:admin': 'Full SAN administrative access',
        },
      },
    },
  };
};

// ============================================================================
// EXAMPLE GENERATION FUNCTIONS
// ============================================================================

/**
 * 22. Creates volume example for DICOM PACS storage.
 *
 * @returns {ExampleObject} DICOM PACS volume example
 *
 * @example
 * ```typescript
 * const pacsExample = createDICOMPACSVolumeExample();
 * ```
 */
export const createDICOMPACSVolumeExample = (): ExampleObject => {
  return {
    summary: 'DICOM PACS Storage Volume',
    description: 'High-performance volume for medical imaging PACS system',
    value: {
      id: 'vol-dicom-pacs-001',
      name: 'dicom-pacs-primary',
      description: 'Primary DICOM PACS storage for radiology department',
      sizeGb: 10240,
      usedGb: 7856.5,
      status: 'in-use',
      volumeType: 'medical-imaging',
      storagePoolId: 'pool-nvme-high-perf',
      tenantId: 'tenant-hospital-central',
      encryptionEnabled: true,
      encryptionKeyId: 'key-hipaa-aes256',
      compressionEnabled: true,
      deduplicationEnabled: true,
      replicationEnabled: true,
      snapshotCount: 48,
      qosPolicy: {
        id: 'qos-critical-medical',
        name: 'critical-medical-imaging',
        minIops: 20000,
        maxIops: 100000,
        minThroughputMbps: 2000,
        maxThroughputMbps: 10000,
        priority: 1,
      },
      tags: {
        department: 'radiology',
        criticality: 'critical',
        compliance: 'hipaa',
        modality: 'ct-mri-xr',
      },
      metadata: {
        dicomAETitle: 'PACS_CENTRAL',
        modalitySupport: ['CT', 'MRI', 'XR', 'US', 'NM'],
        studyRetentionYears: 7,
      },
      createdAt: '2025-01-15T08:00:00.000Z',
      updatedAt: '2025-11-08T14:45:00.000Z',
      createdBy: 'user-radiology-admin',
    },
  };
};

/**
 * 23. Creates volume example for electronic health records.
 *
 * @returns {ExampleObject} EHR volume example
 *
 * @example
 * ```typescript
 * const ehrExample = createEHRVolumeExample();
 * ```
 */
export const createEHRVolumeExample = (): ExampleObject => {
  return {
    summary: 'Electronic Health Records Volume',
    description: 'Standard volume for patient electronic health records database',
    value: {
      id: 'vol-ehr-db-001',
      name: 'ehr-patient-records-db',
      description: 'Primary database volume for patient electronic health records',
      sizeGb: 5120,
      usedGb: 3247.8,
      status: 'available',
      volumeType: 'high-performance',
      storagePoolId: 'pool-ssd-standard',
      tenantId: 'tenant-hospital-central',
      encryptionEnabled: true,
      encryptionKeyId: 'key-hipaa-aes256',
      compressionEnabled: false,
      deduplicationEnabled: false,
      replicationEnabled: true,
      snapshotCount: 30,
      qosPolicy: {
        id: 'qos-high-availability',
        name: 'high-availability-database',
        minIops: 10000,
        maxIops: 50000,
        priority: 2,
      },
      tags: {
        application: 'ehr',
        criticality: 'high',
        compliance: 'hipaa',
        backup: 'daily',
      },
      metadata: {
        databaseType: 'postgresql',
        version: '15.4',
        replicationLag: 2,
      },
      createdAt: '2025-01-10T10:00:00.000Z',
      updatedAt: '2025-11-08T12:00:00.000Z',
      createdBy: 'user-it-admin',
    },
  };
};

/**
 * 24. Creates snapshot example for scheduled backup.
 *
 * @returns {ExampleObject} Scheduled backup snapshot example
 *
 * @example
 * ```typescript
 * const backupExample = createScheduledBackupSnapshotExample();
 * ```
 */
export const createScheduledBackupSnapshotExample = (): ExampleObject => {
  return {
    summary: 'Scheduled Daily Backup Snapshot',
    description: 'Automated daily backup snapshot with 30-day retention',
    value: {
      id: 'snap-daily-20251108-030000',
      volumeId: 'vol-dicom-pacs-001',
      name: 'pacs-daily-backup-20251108',
      description: 'Automated daily backup - DICOM PACS',
      sizeGb: 7856.5,
      status: 'available',
      snapshotType: 'scheduled',
      retentionDays: 30,
      expiresAt: '2025-12-08T03:00:00.000Z',
      parentSnapshotId: 'snap-daily-20251107-030000',
      childSnapshotIds: [],
      metadata: {
        backupType: 'incremental',
        compressionRatio: 2.4,
        studyCount: 15847,
        totalSizeUncompressedGb: 18854.6,
      },
      createdAt: '2025-11-08T03:00:00.000Z',
      createdBy: 'system-backup-scheduler',
    },
  };
};

/**
 * 25. Creates replication example for disaster recovery.
 *
 * @returns {ExampleObject} Disaster recovery replication example
 *
 * @example
 * ```typescript
 * const drExample = createDisasterRecoveryReplicationExample();
 * ```
 */
export const createDisasterRecoveryReplicationExample = (): ExampleObject => {
  return {
    summary: 'Disaster Recovery Replication',
    description: 'Asynchronous replication to DR site for critical medical data',
    value: {
      id: 'repl-dr-pacs-001',
      sourceVolumeId: 'vol-dicom-pacs-001',
      targetVolumeId: 'vol-dicom-pacs-dr-001',
      replicationType: 'asynchronous',
      status: 'replicating',
      direction: 'unidirectional',
      scheduleType: 'continuous',
      schedule: null,
      lag: 45,
      lastSyncAt: '2025-11-08T14:40:00.000Z',
      dataCopiedGb: 7856.5,
      failoverReady: true,
      priority: 1,
      bandwidth: 10000,
      compression: true,
      encryption: true,
      metrics: {
        throughputMbps: 850.5,
        pendingDataGb: 2.3,
        avgLagSeconds: 45,
        errorCount: 0,
        retryCount: 0,
      },
      createdAt: '2025-01-15T08:30:00.000Z',
      updatedAt: '2025-11-08T14:45:00.000Z',
    },
  };
};

// ============================================================================
// OPERATION DOCUMENTATION BUILDERS
// ============================================================================

/**
 * 26. Creates operation object for listing volumes.
 *
 * @returns {OperationObject} List volumes operation
 *
 * @example
 * ```typescript
 * const listOp = createListVolumesOperation();
 * ```
 */
export const createListVolumesOperation = (): OperationObject => {
  return {
    tags: ['Volumes'],
    summary: 'List all volumes',
    description: 'Retrieve a paginated list of all SAN volumes with optional filtering and sorting',
    operationId: 'listVolumes',
    parameters: [
      ...createPaginationQueryParameters(),
      ...createVolumeFilterQueryParameters(),
    ],
    responses: {
      '200': {
        description: 'Successful retrieval of volume list',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/PaginatedVolumeListResponse' },
          },
        },
      },
      '400': {
        description: 'Invalid query parameters',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      '401': {
        description: 'Unauthorized - Missing or invalid authentication',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      '403': {
        description: 'Forbidden - Insufficient permissions',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      '500': {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
    },
    security: [{ bearerAuth: ['san:volume:read'] }],
  };
};

/**
 * 27. Creates operation object for creating a volume.
 *
 * @returns {OperationObject} Create volume operation
 *
 * @example
 * ```typescript
 * const createOp = createCreateVolumeOperation();
 * ```
 */
export const createCreateVolumeOperation = (): OperationObject => {
  return {
    tags: ['Volumes'],
    summary: 'Create a new volume',
    description: 'Create a new SAN volume with specified configuration. Volume will be encrypted by default for HIPAA compliance.',
    operationId: 'createVolume',
    requestBody: {
      required: true,
      description: 'Volume creation parameters',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/VolumeCreateRequest' },
          examples: {
            dicomPacs: createDICOMPACSVolumeExample(),
            ehrDatabase: createEHRVolumeExample(),
          },
        },
      },
    },
    responses: {
      '201': {
        description: 'Volume created successfully',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Volume' },
          },
        },
        headers: {
          Location: {
            description: 'URL of the created volume',
            schema: { type: 'string' },
            example: '/api/v1/san/volumes/vol-550e8400-e29b-41d4-a716-446655440000',
          },
        },
      },
      '400': {
        description: 'Invalid request parameters',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      '401': {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      '403': {
        description: 'Forbidden - Insufficient permissions',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      '422': {
        description: 'Validation error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
          },
        },
      },
      '500': {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
    },
    security: [{ bearerAuth: ['san:volume:write'] }],
  };
};

/**
 * 28. Creates operation object for getting a volume by ID.
 *
 * @returns {OperationObject} Get volume operation
 *
 * @example
 * ```typescript
 * const getOp = createGetVolumeOperation();
 * ```
 */
export const createGetVolumeOperation = (): OperationObject => {
  return {
    tags: ['Volumes'],
    summary: 'Get volume by ID',
    description: 'Retrieve detailed information about a specific volume including LUN mappings, QoS policy, and current metrics',
    operationId: 'getVolumeById',
    parameters: [createVolumeIdPathParameter()],
    responses: {
      '200': {
        description: 'Successful retrieval of volume details',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Volume' },
            examples: {
              dicomPacs: createDICOMPACSVolumeExample(),
            },
          },
        },
      },
      '401': {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      '403': {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      '404': {
        description: 'Volume not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      '500': {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
    },
    security: [{ bearerAuth: ['san:volume:read'] }],
  };
};

/**
 * 29. Creates operation object for updating a volume.
 *
 * @returns {OperationObject} Update volume operation
 *
 * @example
 * ```typescript
 * const updateOp = createUpdateVolumeOperation();
 * ```
 */
export const createUpdateVolumeOperation = (): OperationObject => {
  return {
    tags: ['Volumes'],
    summary: 'Update volume',
    description: 'Update volume properties. Note: Volume size can only be increased, not decreased.',
    operationId: 'updateVolume',
    parameters: [createVolumeIdPathParameter()],
    requestBody: {
      required: true,
      description: 'Volume update parameters',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/VolumeUpdateRequest' },
        },
      },
    },
    responses: {
      '200': {
        description: 'Volume updated successfully',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Volume' },
          },
        },
      },
      '400': {
        description: 'Invalid request parameters',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      '401': {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      '403': {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      '404': {
        description: 'Volume not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      '422': {
        description: 'Validation error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
          },
        },
      },
      '500': {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
    },
    security: [{ bearerAuth: ['san:volume:write'] }],
  };
};

/**
 * 30. Creates operation object for deleting a volume.
 *
 * @returns {OperationObject} Delete volume operation
 *
 * @example
 * ```typescript
 * const deleteOp = createDeleteVolumeOperation();
 * ```
 */
export const createDeleteVolumeOperation = (): OperationObject => {
  return {
    tags: ['Volumes'],
    summary: 'Delete volume',
    description: 'Permanently delete a volume. This operation cannot be undone. All snapshots must be deleted first.',
    operationId: 'deleteVolume',
    parameters: [
      createVolumeIdPathParameter(),
      {
        name: 'force',
        in: 'query',
        required: false,
        description: 'Force deletion even if volume has dependencies',
        schema: {
          type: 'boolean',
          default: false,
        },
      },
    ],
    responses: {
      '204': {
        description: 'Volume deleted successfully',
      },
      '400': {
        description: 'Cannot delete volume with active dependencies',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      '401': {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      '403': {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      '404': {
        description: 'Volume not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      '500': {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
    },
    security: [{ bearerAuth: ['san:volume:delete'] }],
  };
};

/**
 * 31. Creates operation object for creating a snapshot.
 *
 * @returns {OperationObject} Create snapshot operation
 *
 * @example
 * ```typescript
 * const snapshotOp = createCreateSnapshotOperation();
 * ```
 */
export const createCreateSnapshotOperation = (): OperationObject => {
  return {
    tags: ['Snapshots'],
    summary: 'Create snapshot',
    description: 'Create a point-in-time snapshot of a volume for backup or recovery purposes',
    operationId: 'createSnapshot',
    requestBody: {
      required: true,
      description: 'Snapshot creation parameters',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/SnapshotCreateRequest' },
          examples: {
            scheduledBackup: createScheduledBackupSnapshotExample(),
          },
        },
      },
    },
    responses: {
      '201': {
        description: 'Snapshot created successfully',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Snapshot' },
          },
        },
        headers: {
          Location: {
            description: 'URL of the created snapshot',
            schema: { type: 'string' },
          },
        },
      },
      '400': {
        description: 'Invalid request parameters',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      '401': {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      '403': {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      '404': {
        description: 'Volume not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      '422': {
        description: 'Validation error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
          },
        },
      },
      '500': {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
    },
    security: [{ bearerAuth: ['san:snapshot:write'] }],
  };
};

/**
 * 32. Creates operation object for configuring replication.
 *
 * @returns {OperationObject} Configure replication operation
 *
 * @example
 * ```typescript
 * const replicationOp = createConfigureReplicationOperation();
 * ```
 */
export const createConfigureReplicationOperation = (): OperationObject => {
  return {
    tags: ['Replication'],
    summary: 'Configure replication',
    description: 'Configure volume replication for disaster recovery and high availability',
    operationId: 'configureReplication',
    requestBody: {
      required: true,
      description: 'Replication configuration parameters',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ReplicationConfigRequest' },
          examples: {
            disasterRecovery: createDisasterRecoveryReplicationExample(),
          },
        },
      },
    },
    responses: {
      '201': {
        description: 'Replication configured successfully',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Replication' },
          },
        },
      },
      '400': {
        description: 'Invalid request parameters',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      '401': {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      '403': {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      '404': {
        description: 'Source or target volume not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      '422': {
        description: 'Validation error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
          },
        },
      },
      '500': {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
    },
    security: [{ bearerAuth: ['san:replication:write'] }],
  };
};

// ============================================================================
// TAG DEFINITIONS
// ============================================================================

/**
 * 33. Creates SAN API tag definitions.
 *
 * @returns {TagObject[]} Array of tag objects
 *
 * @example
 * ```typescript
 * const tags = createSANAPITags();
 * ```
 */
export const createSANAPITags = (): TagObject[] => {
  return [
    {
      name: 'Volumes',
      description: 'SAN volume management operations - create, read, update, delete, and resize volumes',
      externalDocs: {
        description: 'Volume Management Documentation',
        url: 'https://docs.whitecross.com/san/volumes',
      },
    },
    {
      name: 'LUNs',
      description: 'LUN (Logical Unit Number) management - map volumes to hosts via iSCSI or Fibre Channel',
      externalDocs: {
        description: 'LUN Management Documentation',
        url: 'https://docs.whitecross.com/san/luns',
      },
    },
    {
      name: 'Snapshots',
      description: 'Snapshot operations - create point-in-time copies for backup and recovery',
      externalDocs: {
        description: 'Snapshot Documentation',
        url: 'https://docs.whitecross.com/san/snapshots',
      },
    },
    {
      name: 'Replication',
      description: 'Volume replication for disaster recovery and high availability',
      externalDocs: {
        description: 'Replication Documentation',
        url: 'https://docs.whitecross.com/san/replication',
      },
    },
    {
      name: 'Storage Pools',
      description: 'Storage pool management and capacity monitoring',
      externalDocs: {
        description: 'Storage Pool Documentation',
        url: 'https://docs.whitecross.com/san/storage-pools',
      },
    },
    {
      name: 'Performance',
      description: 'Performance metrics, monitoring, and QoS management',
      externalDocs: {
        description: 'Performance Documentation',
        url: 'https://docs.whitecross.com/san/performance',
      },
    },
  ];
};

// ============================================================================
// COMPONENT ASSEMBLY FUNCTIONS
// ============================================================================

/**
 * 34. Creates complete SAN API components object.
 *
 * @returns {ComponentsObject} Complete components object with all schemas
 *
 * @example
 * ```typescript
 * const components = createSANAPIComponents();
 * ```
 */
export const createSANAPIComponents = (): ComponentsObject => {
  return {
    schemas: {
      Volume: createVolumeSchema(true),
      LUN: createLUNSchema(true),
      Snapshot: createSnapshotSchema(true),
      Replication: createReplicationSchema(true),
      StoragePool: createStoragePoolSchema(),
      PerformanceMetrics: createPerformanceMetricsSchema(),
      QoSPolicy: createQoSPolicySchema(),
      VolumeCreateRequest: createVolumeCreateRequestSchema(),
      VolumeUpdateRequest: createVolumeUpdateRequestSchema(),
      SnapshotCreateRequest: createSnapshotCreateRequestSchema(),
      ReplicationConfigRequest: createReplicationConfigRequestSchema(),
      ErrorResponse: createErrorResponseSchema(),
      ValidationErrorResponse: createValidationErrorResponseSchema(),
      PaginationMetadata: createPaginationMetadataSchema(),
      PaginatedVolumeListResponse: createPaginatedVolumeListResponseSchema(),
      LUNMapping: {
        type: 'object',
        properties: {
          lunId: { type: 'string', format: 'uuid' },
          lunNumber: { type: 'integer', minimum: 0, maximum: 255 },
          targetId: { type: 'string' },
          protocol: { type: 'string', enum: ['iscsi', 'fc', 'fcoe'] },
        },
      },
      HostMapping: {
        type: 'object',
        properties: {
          hostId: { type: 'string', format: 'uuid' },
          hostName: { type: 'string' },
          wwpn: { type: 'string', nullable: true },
          iqn: { type: 'string', nullable: true },
          accessMode: { type: 'string', enum: ['read-write', 'read-only'] },
        },
      },
    },
    securitySchemes: {
      bearerAuth: createBearerJWTSecurityScheme(),
      apiKey: createAPIKeySecurityScheme(),
      oauth2: createOAuth2SecurityScheme(),
    },
    parameters: {
      VolumeIdPath: createVolumeIdPathParameter(),
      PageQuery: createPaginationQueryParameters()[0],
      LimitQuery: createPaginationQueryParameters()[1],
      SortByQuery: createPaginationQueryParameters()[2],
      SortOrderQuery: createPaginationQueryParameters()[3],
    },
    examples: {
      DicomPacsVolume: createDICOMPACSVolumeExample(),
      EhrVolume: createEHRVolumeExample(),
      ScheduledBackupSnapshot: createScheduledBackupSnapshotExample(),
      DisasterRecoveryReplication: createDisasterRecoveryReplicationExample(),
    },
  };
};

/**
 * 35. Creates complete SAN API OpenAPI specification.
 *
 * @param {string} version - API version
 * @param {string} baseUrl - Base server URL
 * @returns {OpenAPISpec} Complete OpenAPI specification
 *
 * @example
 * ```typescript
 * const spec = createSANAPISpecification('1.0.0', 'https://api.whitecross.com');
 * ```
 */
export const createSANAPISpecification = (version: string, baseUrl: string): OpenAPISpec => {
  return {
    openapi: '3.0.0',
    info: {
      title: 'White Cross SAN API',
      description: `
Storage Area Network (SAN) Management API for White Cross Healthcare Platform

This API provides comprehensive management of storage volumes, LUNs, snapshots, and replication
for healthcare data storage including DICOM PACS, electronic health records, and medical imaging archives.

**Key Features:**
- Volume lifecycle management (create, resize, delete)
- LUN mapping for iSCSI and Fibre Channel protocols
- Snapshot-based backup and recovery
- Volume replication for disaster recovery
- Performance monitoring and QoS management
- HIPAA-compliant encryption and audit trails
- Multi-tenancy support with tenant isolation

**Healthcare Use Cases:**
- DICOM PACS storage for medical imaging
- Electronic health record (EHR) databases
- Medical imaging archives with long-term retention
- High-availability storage for critical healthcare applications
- Disaster recovery and business continuity

**Security:**
- All volumes encrypted at rest by default (HIPAA compliance)
- OAuth2 and JWT authentication
- Role-based access control (RBAC)
- Comprehensive audit logging
- Tenant isolation for multi-hospital deployments
      `,
      version,
      contact: {
        name: 'White Cross API Support',
        email: 'api-support@whitecross.com',
        url: 'https://support.whitecross.com',
      },
      license: {
        name: 'Proprietary',
        url: 'https://whitecross.com/licenses',
      },
    },
    servers: [
      {
        url: `${baseUrl}/api/v1`,
        description: 'Production API',
      },
      {
        url: `${baseUrl.replace('api.', 'api-staging.')}/api/v1`,
        description: 'Staging API',
      },
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Local development',
      },
    ],
    tags: createSANAPITags(),
    paths: {},
    components: createSANAPIComponents(),
    security: [{ bearerAuth: [] }],
  };
};

/**
 * 36. Creates NestJS Swagger DocumentBuilder configuration for SAN API.
 *
 * @param {string} version - API version
 * @param {string} baseUrl - Base server URL
 * @returns {object} NestJS DocumentBuilder configuration
 *
 * @example
 * ```typescript
 * const config = createNestJSSANSwaggerConfig('1.0.0', 'https://api.whitecross.com');
 * ```
 */
export const createNestJSSANSwaggerConfig = (version: string, baseUrl: string): object => {
  return {
    title: 'White Cross SAN API',
    description: 'Storage Area Network Management API for Healthcare Data Storage',
    version,
    contact: {
      name: 'White Cross API Support',
      email: 'api-support@whitecross.com',
      url: 'https://support.whitecross.com',
    },
    license: {
      name: 'Proprietary',
    },
    servers: [
      { url: `${baseUrl}/api/v1`, description: 'Production' },
      { url: `${baseUrl.replace('api.', 'api-staging.')}/api/v1`, description: 'Staging' },
    ],
    tags: createSANAPITags(),
    security: ['bearerAuth'],
  };
};

/**
 * 37. Creates Swagger UI customization options for SAN API.
 *
 * @returns {object} Swagger UI options
 *
 * @example
 * ```typescript
 * const uiOptions = createSANSwaggerUIOptions();
 * ```
 */
export const createSANSwaggerUIOptions = (): object => {
  return {
    customCss: `
      .swagger-ui .topbar {
        background-color: #2c3e50;
      }
      .swagger-ui .info .title {
        color: #2c3e50;
        font-weight: bold;
      }
      .swagger-ui .opblock.opblock-post {
        border-color: #27ae60;
        background: rgba(39, 174, 96, 0.1);
      }
      .swagger-ui .opblock.opblock-get {
        border-color: #3498db;
        background: rgba(52, 152, 219, 0.1);
      }
      .swagger-ui .opblock.opblock-put {
        border-color: #f39c12;
        background: rgba(243, 156, 18, 0.1);
      }
      .swagger-ui .opblock.opblock-delete {
        border-color: #e74c3c;
        background: rgba(231, 76, 60, 0.1);
      }
      .swagger-ui .opblock.opblock-patch {
        border-color: #9b59b6;
        background: rgba(155, 89, 182, 0.1);
      }
    `,
    customSiteTitle: 'White Cross SAN API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      syntaxHighlight: {
        activate: true,
        theme: 'monokai',
      },
      tryItOutEnabled: true,
      docExpansion: 'list',
      defaultModelsExpandDepth: 3,
      defaultModelExpandDepth: 3,
      displayOperationId: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
  };
};

/**
 * 38. Creates healthcare compliance documentation notes for SAN API.
 *
 * @returns {object} Compliance documentation object
 *
 * @example
 * ```typescript
 * const compliance = createHealthcareComplianceDocumentation();
 * ```
 */
export const createHealthcareComplianceDocumentation = (): object => {
  return {
    hipaa: {
      encryption: {
        description: 'All volumes are encrypted at rest using AES-256 encryption by default',
        requirement: 'HIPAA Security Rule § 164.312(a)(2)(iv) - Encryption and Decryption',
        implementation: 'Volumes use customer-managed encryption keys stored in KMS',
        verification: 'encryptionEnabled flag must be true for all PHI-containing volumes',
      },
      auditLogging: {
        description: 'Comprehensive audit logs for all volume, snapshot, and replication operations',
        requirement: 'HIPAA Security Rule § 164.312(b) - Audit Controls',
        implementation: 'All API operations logged with user ID, timestamp, action, and result',
        retention: 'Audit logs retained for minimum 6 years as per HIPAA requirements',
      },
      accessControl: {
        description: 'Role-based access control (RBAC) with principle of least privilege',
        requirement: 'HIPAA Security Rule § 164.312(a)(1) - Access Control',
        implementation: 'OAuth2 scopes define granular permissions for SAN operations',
        verification: 'Regular access reviews and permission audits required',
      },
      dataIntegrity: {
        description: 'Data integrity verification through checksums and replication monitoring',
        requirement: 'HIPAA Security Rule § 164.312(c)(1) - Integrity Controls',
        implementation: 'Automated integrity checks on all volumes and snapshots',
        verification: 'Replication lag monitoring ensures data consistency',
      },
      disasterRecovery: {
        description: 'Volume replication and snapshot-based disaster recovery',
        requirement: 'HIPAA Security Rule § 164.308(a)(7)(ii)(B) - Data Backup Plan',
        implementation: 'Automated daily snapshots with configurable retention periods',
        verification: 'Regular disaster recovery drills and failover testing',
      },
    },
    dicom: {
      description: 'SAN storage optimized for DICOM medical imaging workloads',
      storageType: 'medical-imaging volume type with high IOPS and throughput',
      retention: 'Long-term retention support with archival storage tiers',
      performance: 'Sub-5ms latency for critical PACS workloads',
      metadata: 'Support for DICOM-specific metadata in volume tags',
    },
    gdpr: {
      rightToErasure: {
        description: 'Secure volume and snapshot deletion with data sanitization',
        implementation: 'Cryptographic erasure by destroying encryption keys',
        verification: 'Deletion audit trails maintained separately from volume data',
      },
      dataPortability: {
        description: 'Snapshot export capabilities for data portability',
        implementation: 'Snapshots can be exported to portable formats',
      },
    },
  };
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Schema creation functions
  createVolumeSchema,
  createLUNSchema,
  createSnapshotSchema,
  createReplicationSchema,
  createStoragePoolSchema,
  createPerformanceMetricsSchema,
  createQoSPolicySchema,

  // Request/Response schemas
  createVolumeCreateRequestSchema,
  createVolumeUpdateRequestSchema,
  createSnapshotCreateRequestSchema,
  createReplicationConfigRequestSchema,
  createErrorResponseSchema,
  createValidationErrorResponseSchema,

  // Pagination schemas
  createPaginationMetadataSchema,
  createPaginatedVolumeListResponseSchema,

  // Parameters
  createVolumeIdPathParameter,
  createPaginationQueryParameters,
  createVolumeFilterQueryParameters,

  // Security schemes
  createBearerJWTSecurityScheme,
  createAPIKeySecurityScheme,
  createOAuth2SecurityScheme,

  // Example generation
  createDICOMPACSVolumeExample,
  createEHRVolumeExample,
  createScheduledBackupSnapshotExample,
  createDisasterRecoveryReplicationExample,

  // Operation builders
  createListVolumesOperation,
  createCreateVolumeOperation,
  createGetVolumeOperation,
  createUpdateVolumeOperation,
  createDeleteVolumeOperation,
  createCreateSnapshotOperation,
  createConfigureReplicationOperation,

  // Tag definitions
  createSANAPITags,

  // Component assembly
  createSANAPIComponents,
  createSANAPISpecification,

  // NestJS integration
  createNestJSSANSwaggerConfig,
  createSANSwaggerUIOptions,

  // Compliance documentation
  createHealthcareComplianceDocumentation,
};
