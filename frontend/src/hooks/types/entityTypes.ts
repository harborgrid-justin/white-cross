/**
 * Entity Types
 * Common entity type definitions
 *
 * Re-exports from the canonical type location
 */

// Import from canonical location
export type { BaseEntity, BaseAuditEntity as EntityWithMetadata } from '@/types/core/common';

// Local type aliases
export type EntityId = string;
export type EntityStatus = 'active' | 'inactive' | 'archived' | 'deleted';
