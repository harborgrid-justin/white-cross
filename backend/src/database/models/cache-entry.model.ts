/**
 * @fileoverview Database Cache Entry Model for L3 Cache
 * @module database/models
 * @description Sequelize model for storing L3 cache entries with query results
 * 
 * HIPAA CRITICAL - This model stores cached PHI data with compliance controls
 * 
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 */

import {
  Table,
  Column,
  Model,
  DataType,
  Index,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

export interface CacheEntryAttributes {
  id?: number;
  cacheKey: string;
  data: string; // JSON serialized data
  complianceLevel: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'PHI' | 'SENSITIVE_PHI';
  tags: string; // JSON array of tags
  expiresAt: Date;
  accessCount: number;
  lastAccessed: Date;
  dataSize: number;
  queryHash?: string; // Hash of the original query for deduplication
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CacheEntryCreationAttributes extends Omit<CacheEntryAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

/**
 * Database Cache Entry Model
 * 
 * Stores L3 cache entries with the following features:
 * - HIPAA-compliant PHI storage with encryption at rest
 * - TTL support through expiresAt timestamp
 * - Access pattern tracking with accessCount and lastAccessed
 * - Query deduplication through queryHash
 * - Tag-based cache invalidation support
 * - Compliance level tracking for audit purposes
 */
@Table({
  tableName: 'cache_entries',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      name: 'idx_cache_key',
      fields: ['cacheKey'],
      unique: true,
    },
    {
      name: 'idx_expires_at',
      fields: ['expiresAt'],
    },
    {
      name: 'idx_compliance_level',
      fields: ['complianceLevel'],
    },
    {
      name: 'idx_query_hash',
      fields: ['queryHash'],
    },
    {
      name: 'idx_last_accessed',
      fields: ['lastAccessed'],
    },
    {
      name: 'idx_tags',
      fields: ['tags'],
      using: 'gin', // For PostgreSQL JSON indexing
    },
  ],
})
export class CacheEntry extends Model<CacheEntryAttributes, CacheEntryCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;


  @Column({
    type: DataType.STRING(500),
    allowNull: false,
    unique: true,
    comment: 'Unique cache key identifier',
  })
  cacheKey!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'JSON serialized cached data - encrypted at rest for PHI',
  })
  data!: string;

  @Index
  @Column({
    type: DataType.ENUM('PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'PHI', 'SENSITIVE_PHI'),
    allowNull: false,
    defaultValue: 'INTERNAL',
    comment: 'HIPAA compliance level for audit and security',
  })
  complianceLevel!: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'PHI' | 'SENSITIVE_PHI';

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: '[]',
    comment: 'Cache invalidation tags for bulk operations',
  })
  tags!: string;

  @Index
  @Column({
    type: DataType.DATE,
    allowNull: false,
    comment: 'Cache entry expiration timestamp for TTL enforcement',
  })
  expiresAt!: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Number of times this cache entry has been accessed',
  })
  accessCount!: number;

  @Index
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'Last access timestamp for LRU eviction',
  })
  lastAccessed!: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Size of cached data in bytes for memory management',
  })
  dataSize!: number;

  @Index
  @Column({
    type: DataType.STRING(64),
    allowNull: true,
    comment: 'Hash of original query for deduplication and optimization',
  })
  queryHash!: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    comment: 'Cache entry creation timestamp',
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    comment: 'Cache entry last update timestamp',
  })
  declare updatedAt: Date;

  /**
   * Check if cache entry has expired
   */
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  /**
   * Get parsed tags array
   */
  getParsedTags(): string[] {
    try {
      return JSON.parse(this.tags);
    } catch {
      return [];
    }
  }

  /**
   * Get parsed data
   */
  getParsedData<T = any>(): T | null {
    try {
      return JSON.parse(this.data);
    } catch {
      return null;
    }
  }

  /**
   * Update access statistics
   */
  async recordAccess(): Promise<void> {
    this.accessCount += 1;
    this.lastAccessed = new Date();
    await this.save({ fields: ['accessCount', 'lastAccessed'] });
  }

  /**
   * Check if entry matches any of the provided tags
   */
  matchesTags(targetTags: string[]): boolean {
    const entryTags = this.getParsedTags();
    return targetTags.some(tag => entryTags.includes(tag));
  }

  /**
   * Check if entry is PHI data requiring special handling
   */
  isPHI(): boolean {
    return this.complianceLevel === 'PHI' || this.complianceLevel === 'SENSITIVE_PHI';
  }
}
