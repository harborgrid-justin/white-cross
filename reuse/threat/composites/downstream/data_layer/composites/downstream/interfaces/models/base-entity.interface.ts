/**
 * @fileoverview Base Entity Interface
 * @module interfaces/models/base-entity
 * @description Base interface for all domain entities with common fields
 */

/**
 * Base entity interface with common fields
 * All domain entities should extend this interface
 */
export interface IBaseEntity {
  /** Unique identifier (UUID or numeric) */
  id: string | number;

  /** Creation timestamp */
  createdAt: Date;

  /** Last update timestamp */
  updatedAt: Date;

  /** Soft delete timestamp (null if not deleted) */
  deletedAt?: Date | null;

  /** Version number for optimistic locking */
  version?: number;

  /** User who created this entity */
  createdBy?: string;

  /** User who last updated this entity */
  updatedBy?: string;

  /** User who deleted this entity */
  deletedBy?: string;

  /** Tenant/organization ID for multi-tenancy */
  tenantId?: string;

  /** Entity metadata (flexible JSON field) */
  metadata?: Record<string, any>;
}

/**
 * Auditable entity interface
 * For entities that require comprehensive audit trails
 */
export interface IAuditableEntity extends IBaseEntity {
  /** Audit trail of all changes */
  auditTrail?: IAuditEntry[];

  /** Last audit timestamp */
  lastAuditedAt?: Date;

  /** Audit status */
  auditStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

/**
 * Audit entry for entity changes
 */
export interface IAuditEntry {
  /** Unique audit entry ID */
  id: string;

  /** Timestamp of change */
  timestamp: Date;

  /** User who made the change */
  userId: string;

  /** Action performed */
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE';

  /** Changed fields */
  changedFields: string[];

  /** Old values (before change) */
  oldValues?: Record<string, any>;

  /** New values (after change) */
  newValues?: Record<string, any>;

  /** IP address of user */
  ipAddress?: string;

  /** User agent */
  userAgent?: string;

  /** Additional context */
  context?: Record<string, any>;
}

/**
 * Entity with relationships
 */
export interface IEntityWithRelations extends IBaseEntity {
  /** Related entities (generic) */
  relations?: Record<string, any>;
}

/**
 * Versionable entity interface
 * For entities that support versioning
 */
export interface IVersionableEntity extends IBaseEntity {
  /** Current version number */
  version: number;

  /** Is this the latest version */
  isLatestVersion: boolean;

  /** Parent version ID (if this is a version) */
  parentVersionId?: string;

  /** Version history */
  versionHistory?: IVersionEntry[];
}

/**
 * Version history entry
 */
export interface IVersionEntry {
  /** Version number */
  version: number;

  /** Version timestamp */
  timestamp: Date;

  /** User who created this version */
  createdBy: string;

  /** Version notes/comments */
  notes?: string;

  /** Snapshot of data at this version */
  snapshot?: Record<string, any>;
}

/**
 * Taggable entity interface
 */
export interface ITaggableEntity extends IBaseEntity {
  /** Tags for categorization */
  tags?: string[];

  /** Categories */
  categories?: string[];

  /** Labels */
  labels?: Record<string, string>;
}

/**
 * Searchable entity interface
 */
export interface ISearchableEntity extends IBaseEntity {
  /** Full-text search vector */
  searchVector?: string;

  /** Search keywords */
  searchKeywords?: string[];

  /** Searchable content */
  searchableContent?: string;
}

/**
 * Timestamped entity (minimal)
 */
export interface ITimestampedEntity {
  /** Creation timestamp */
  createdAt: Date;

  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Soft deletable entity
 */
export interface ISoftDeletableEntity extends ITimestampedEntity {
  /** Soft delete timestamp */
  deletedAt?: Date | null;

  /** Is deleted flag */
  isDeleted?: boolean;
}
