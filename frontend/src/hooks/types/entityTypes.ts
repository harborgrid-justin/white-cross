/**
 * Entity Types
 * Common entity type definitions
 */

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface EntityWithMetadata extends BaseEntity {
  createdBy: string;
  updatedBy?: string;
  version: number;
}

export type EntityId = string;
export type EntityStatus = 'active' | 'inactive' | 'archived' | 'deleted';
