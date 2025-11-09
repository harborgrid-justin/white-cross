/**
 * File: /reuse/domain-shared/types/base-entity.ts
 * Purpose: Base entity type definitions shared across all domain kits
 *
 * This module provides foundational type definitions and interfaces used across
 * construction, consulting, and engineer domains. These types ensure consistency
 * in entity structure, audit metadata, and common patterns.
 *
 * @module DomainShared/BaseEntity
 * @version 1.0.0
 */
/**
 * Base audit metadata for all entities
 * Provides comprehensive tracking of entity lifecycle
 */
export interface AuditMetadata {
    /** Timestamp when the entity was created */
    createdAt: Date;
    /** Timestamp when the entity was last updated */
    updatedAt: Date;
    /** Timestamp when the entity was soft-deleted (if applicable) */
    deletedAt?: Date | null;
    /** UUID of the user who created the entity */
    createdBy?: string;
    /** UUID of the user who last updated the entity */
    updatedBy?: string;
    /** UUID of the user who deleted the entity */
    deletedBy?: string;
}
/**
 * Base entity interface with common fields
 * Extended by all domain-specific entities
 */
export interface BaseEntity extends AuditMetadata {
    /** Primary key - UUID v4 */
    id: string;
    /** Indicates if the entity is active/enabled */
    isActive?: boolean;
    /** Optional metadata as JSON object */
    metadata?: Record<string, unknown>;
    /** Optional notes or comments */
    notes?: string;
}
/**
 * Common status enum values used across domains
 * Domains can extend this with domain-specific statuses
 */
export declare enum CommonStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    ON_HOLD = "on_hold",
    CANCELLED = "cancelled",
    ARCHIVED = "archived"
}
/**
 * Priority levels used across domains
 */
export declare enum Priority {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
/**
 * Approval status used in workflow-based entities
 */
export declare enum ApprovalStatus {
    PENDING_APPROVAL = "pending_approval",
    APPROVED = "approved",
    REJECTED = "rejected",
    NEEDS_REVISION = "needs_revision",
    WITHDRAWN = "withdrawn"
}
/**
 * Base interface for entities with approval workflow
 */
export interface ApprovableEntity extends BaseEntity {
    approvalStatus: ApprovalStatus;
    approvedBy?: string;
    approvedAt?: Date;
    rejectedBy?: string;
    rejectedAt?: Date;
    rejectionReason?: string;
}
/**
 * Base interface for entities with versioning
 */
export interface VersionedEntity extends BaseEntity {
    version: number;
    versionNotes?: string;
    previousVersionId?: string;
}
/**
 * Base interface for entities with file attachments
 */
export interface EntityWithAttachments extends BaseEntity {
    attachments?: Attachment[];
}
/**
 * File attachment metadata
 */
export interface Attachment {
    id: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    storageKey: string;
    uploadedBy: string;
    uploadedAt: Date;
    description?: string;
}
/**
 * Address information used across domains
 */
export interface Address {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
}
/**
 * Contact information used across domains
 */
export interface ContactInfo {
    email?: string;
    phone?: string;
    mobile?: string;
    fax?: string;
    website?: string;
}
/**
 * Money/currency representation
 */
export interface MoneyAmount {
    amount: number;
    currency: string;
}
/**
 * Date range commonly used in filters and reporting
 */
export interface DateRange {
    startDate: Date;
    endDate: Date;
}
/**
 * Pagination parameters for list queries
 */
export interface PaginationParams {
    page: number;
    limit: number;
    offset?: number;
}
/**
 * Pagination metadata for responses
 */
export interface PaginationMeta {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}
/**
 * Sort parameters for list queries
 */
export interface SortParams {
    field: string;
    order: 'ASC' | 'DESC';
}
/**
 * Filter operators for advanced queries
 */
export declare enum FilterOperator {
    EQUALS = "eq",
    NOT_EQUALS = "ne",
    GREATER_THAN = "gt",
    GREATER_THAN_OR_EQUAL = "gte",
    LESS_THAN = "lt",
    LESS_THAN_OR_EQUAL = "lte",
    IN = "in",
    NOT_IN = "not_in",
    LIKE = "like",
    BETWEEN = "between",
    IS_NULL = "is_null",
    IS_NOT_NULL = "is_not_null"
}
/**
 * Generic filter condition
 */
export interface FilterCondition {
    field: string;
    operator: FilterOperator;
    value: unknown;
}
/**
 * List query parameters combining pagination, sorting, and filtering
 */
export interface ListQueryParams {
    pagination?: PaginationParams;
    sort?: SortParams[];
    filters?: FilterCondition[];
    search?: string;
}
//# sourceMappingURL=base-entity.d.ts.map