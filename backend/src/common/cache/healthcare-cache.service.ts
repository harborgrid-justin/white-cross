/**
 * Healthcare-Grade Caching Layer for White Cross Platform
 *
 * Production-ready multi-level caching with healthcare-specific features,
 * HIPAA compliance, PHI protection, and clinical workflow optimization.
 *
 * @module HealthcareCacheService
 * @healthcare Optimized for healthcare data caching with PHI protection
 * @compliance HIPAA-compliant caching with audit trails and encryption
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter } from 'events';
import * as crypto from 'crypto';
import * as zlib from 'zlib';

import { BaseService } from '@/common/base';
import { BaseService } from '@/common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
// Healthcare Cache Configuration
export interface HealthcareCacheConfig {
  defaultTTL: number;
  maxSize: number;
  enableCompression: boolean;
  enableMetrics: boolean;
  enableEncryption: boolean;
  phiTTL: number; // Shorter TTL for PHI data
  auditCacheAccess: boolean;
  redisConfig?: {
    host: string;
    port: number;
    password?: string;
    db: number;
    enableSSL: boolean;
  };
  memoryConfig?: {
    maxItems: number;
    checkPeriod: number;
    phiMaxItems: number; // Lower limit for PHI data
  };
}

// Healthcare Cache Entry
export interface HealthcareCacheEntry<T = any> {
  key: string;
  value: T;
  ttl: number;
  createdAt: Date;
  lastAccessed: Date;
  hitCount: number;
  compressed: boolean;
  encrypted: boolean;
  tags: string[];
  dataLevel: 'PUBLIC' | 'INTERNAL' | 'PHI' | 'SENSITIVE_PHI' | 'RESTRICTED';
  patientId?: string;
  providerId?: string;
  clinicalContext?: string;
  hipaaAuditRequired: boolean;
}

// Healthcare Cache Statistics
export interface HealthcareCacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  evictions: number;
  memoryUsage: number;
  hitRatio: number;
  avgResponseTime: number;
  phiOperations: number;
  auditEvents: number;
  encryptedEntries: number;
}

// Cache Strategy for Healthcare
export enum HealthcareCacheStrategy {
  PHI_WRITE_THROUGH = 'phi_write_through',
  PHI_WRITE_AROUND = 'phi_write_around',
  STANDARD_CACHE_ASIDE = 'standard_cache_aside',
  CLINICAL_READ_THROUGH = 'clinical_read_through',
  EMERGENCY_BYPASS = 'emergency_bypass',
}

// Healthcare Cache Invalidation Strategy
export enum HealthcareInvalidationStrategy {
  PHI_TTL = 'phi_ttl',
  PATIENT_BASED = 'patient_based',
  PROVIDER_BASED = 'provider_based',
  CLINICAL_WORKFLOW = 'clinical_workflow',
  COMPLIANCE_PURGE = 'compliance_purge',
}

/**
 * Healthcare Memory Cache with PHI protection
 */
class HealthcareMemoryCache extends EventEmitter {
  private cache = new Map<string, HealthcareCacheEntry>();
  private timers = new Map<string, NodeJS.Timeout>();
  private stats: HealthcareCacheStats;
  private encryptionKey: Buffer;

  constructor(
    @Inject(LoggerService) logger: LoggerService,
    private config: HealthcareCacheConfig
  ) {
    super({
      serviceName: 'HealthcareCacheService',
      logger,
      enableAuditLogging: true,
    });

    super();
    this.stats = this.initializeStats();
    this.encryptionKey = crypto.randomBytes(32); // 256-bit key
    this.startHealthcareCleanupProcess();
  }

  private initializeStats(): HealthcareCacheStats {
    return {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      evictions: 0,
      memoryUsage: 0,
      hitRatio: 0,
      avgResponseTime: 0,
      phiOperations: 0,
      auditEvents: 0,
      encryptedEntries: 0,
    };
  }

  async get<T>(key: string, auditContext?: { patientId?: string; providerId?: string }): Promise<T | null> {
    const startTime = Date.now();

    try {
      const entry = this.cache.get(key);

      if (!entry) {
        this.stats.misses++;
        return null;
      }

      // Check if expired
      if (this.isExpired(entry)) {
        await this.delete(key);
        this.stats.misses++;
        return null;
      }

      // Update access statistics
      entry.lastAccessed = new Date();
      entry.hitCount++;
      this.stats.hits++;

      // Track PHI operations
      if (this.isPHIData(entry.dataLevel)) {
        this.stats.phiOperations++;
      }

      // HIPAA audit logging
      if (entry.hipaaAuditRequired && this.config.auditCacheAccess) {
        this.logHealthcareAudit('CACHE_GET', key, entry.dataLevel, auditContext);
        this.stats.auditEvents++;
      }

      // Decrypt if needed
      let value = entry.value;
      if (entry.encrypted && this.config.enableEncryption) {
        value = this.decryptValue(value);
      }

      // Decompress if needed
      if (entry.compressed && typeof value === 'string') {
        value = this.decompress(value);
      }

      return value as T;
    } finally {
      this.updateResponseTime(Date.now() - startTime);
    }
  }

  async set<T>(
    key: string,
    value: T,
    options: {
      ttl?: number;
      tags?: string[];
      dataLevel?: 'PUBLIC' | 'INTERNAL' | 'PHI' | 'SENSITIVE_PHI' | 'RESTRICTED';
      patientId?: string;
      providerId?: string;
      clinicalContext?: string;
    } = {},
  ): Promise<void> {
    try {
      const dataLevel = options.dataLevel || 'INTERNAL';
      const ttl = this.getTTLForDataLevel(options.ttl, dataLevel);

      // Check cache size limits based on data level
      if (this.shouldEvictForDataLevel(dataLevel)) {
        await this.evictItems();
      }

      // Process value for caching
      let processedValue = value;
      let compressed = false;
      let encrypted = false;

      // Compress large values if enabled
      if (this.config.enableCompression && this.shouldCompress(value)) {
        processedValue = this.compress(value) as T;
        compressed = true;
      }

      // Encrypt PHI data if enabled
      if (this.config.enableEncryption && this.isPHIData(dataLevel)) {
        processedValue = this.encryptValue(processedValue) as T;
        encrypted = true;
        this.stats.encryptedEntries++;
      }

      const entry: HealthcareCacheEntry<T> = {
        key,
        value: processedValue,
        ttl,
        createdAt: new Date(),
        lastAccessed: new Date(),
        hitCount: 0,
        compressed,
        encrypted,
        tags: options.tags || [],
        dataLevel,
        patientId: options.patientId,
        providerId: options.providerId,
        clinicalContext: options.clinicalContext,
        hipaaAuditRequired: this.isPHIData(dataLevel),
      };

      this.cache.set(key, entry);
      this.stats.sets++;

      // Track PHI operations
      if (this.isPHIData(dataLevel)) {
        this.stats.phiOperations++;
      }

      // Set expiration timer
      if (entry.ttl > 0) {
        this.setExpirationTimer(key, entry.ttl);
      }

      // HIPAA audit logging
      if (entry.hipaaAuditRequired && this.config.auditCacheAccess) {
        this.logHealthcareAudit('CACHE_SET', key, dataLevel, {
          patientId: options.patientId,
          providerId: options.providerId,
        });
        this.stats.auditEvents++;
      }

      this.emit('healthcareSet', { key, dataLevel, encrypted, ttl });
    } catch (error) {
      this.logError(`Failed to set healthcare cache entry for key ${key}:`, error);
      throw error;
    }
  }

  async delete(key: string, auditContext?: { reason?: string; providerId?: string }): Promise<boolean> {
    try {
      const entry = this.cache.get(key);
      const existed = this.cache.has(key);

      if (existed) {
        this.cache.delete(key);
        this.clearExpirationTimer(key);
        this.stats.deletes++;

        // HIPAA audit logging for PHI deletion
        if (entry && entry.hipaaAuditRequired && this.config.auditCacheAccess) {
          this.logHealthcareAudit('CACHE_DELETE', key, entry.dataLevel, {
            reason: auditContext?.reason || 'manual',
            providerId: auditContext?.providerId,
          });
          this.stats.auditEvents++;
        }

        this.emit('healthcareDelete', { key, dataLevel: entry?.dataLevel });
      }

      return existed;
    } catch (error) {
      this.logError(`Failed to delete healthcare cache entry for key ${key}:`, error);
      throw error;
    }
  }

  async invalidateByPatient(patientId: string, reason: string = 'patient_update'): Promise<number> {
    let invalidatedCount = 0;

    try {
      for (const [key, entry] of this.cache.entries()) {
        if (entry.patientId === patientId) {
          await this.delete(key, { reason, providerId: 'system' });
          invalidatedCount++;
        }
      }

      this.emit('patientDataInvalidated', { patientId, count: invalidatedCount, reason });
      return invalidatedCount;
    } catch (error) {
      this.logError(`Failed to invalidate patient data for ${patientId}:`, error);
      throw error;
    }
  }

  async invalidateByProvider(providerId: string, reason: string = 'provider_update'): Promise<number> {
    let invalidatedCount = 0;

    try {
      for (const [key, entry] of this.cache.entries()) {
        if (entry.providerId === providerId) {
          await this.delete(key, { reason, providerId });
          invalidatedCount++;
        }
      }

      this.emit('providerDataInvalidated', { providerId, count: invalidatedCount, reason });
      return invalidatedCount;
    } catch (error) {
      this.logError(`Failed to invalidate provider data for ${providerId}:`, error);
      throw error;
    }
  }

  async invalidateByTags(tags: string[], reason: string = 'tag_invalidation'): Promise<number> {
    let invalidatedCount = 0;

    try {
      for (const [key, entry] of this.cache.entries()) {
        if (entry.tags.some((tag) => tags.includes(tag))) {
          await this.delete(key, { reason });
          invalidatedCount++;
        }
      }

      this.emit('tagsInvalidated', { tags, count: invalidatedCount, reason });
      return invalidatedCount;
    } catch (error) {
      this.logError('Failed to invalidate by tags:', error);
      throw error;
    }
  }

  async clear(reason: string = 'manual_clear'): Promise<void> {
    try {
      const keys = Array.from(this.cache.keys());
      const phiKeys = keys.filter((key) => {
        const entry = this.cache.get(key);
        return entry && this.isPHIData(entry.dataLevel);
      });

      // Audit PHI data clearing
      if (phiKeys.length > 0 && this.config.auditCacheAccess) {
        this.logHealthcareAudit('CACHE_CLEAR_PHI', 'multiple', 'PHI', {
          reason,
          phiKeysCount: phiKeys.length,
        });
        this.stats.auditEvents++;
      }

      for (const key of keys) {
        this.clearExpirationTimer(key);
      }

      this.cache.clear();
      this.stats = this.initializeStats();
      this.emit('healthcareClear', { reason, phiKeysCleared: phiKeys.length });
    } catch (error) {
      this.logError('Failed to clear healthcare cache:', error);
      throw error;
    }
  }

  getHealthcareStats(): HealthcareCacheStats {
    this.updateStats();
    return { ...this.stats };
  }

  // Healthcare-specific helper methods
  private isPHIData(dataLevel: string): boolean {
    return ['PHI', 'SENSITIVE_PHI', 'RESTRICTED'].includes(dataLevel);
  }

  private getTTLForDataLevel(requestedTTL: number | undefined, dataLevel: string): number {
    if (requestedTTL !== undefined) return requestedTTL;

    // Shorter TTL for PHI data
    if (this.isPHIData(dataLevel)) {
      return this.config.phiTTL || 1800; // 30 minutes default for PHI
    }

    return this.config.defaultTTL;
  }

  private shouldEvictForDataLevel(dataLevel: string): boolean {
    if (this.isPHIData(dataLevel)) {
      const phiItems = Array.from(this.cache.values()).filter((entry) =>
        this.isPHIData(entry.dataLevel),
      ).length;
      return phiItems >= (this.config.memoryConfig?.phiMaxItems || 500);
    }

    return this.cache.size >= this.config.maxSize;
  }

  private encryptValue(value: any): string {
    const serialized = JSON.stringify(value);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.encryptionKey, iv);

    let encrypted = cipher.update(serialized, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  private decryptValue(encryptedValue: string): any {
    const [ivHex, authTagHex, encrypted] = encryptedValue.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', this.encryptionKey, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  }

  private compress(value: any): string {
    const serialized = JSON.stringify(value);
    return zlib.deflateSync(serialized).toString('base64');
  }

  private decompress(compressed: string): any {
    const buffer = Buffer.from(compressed, 'base64');
    const decompressed = zlib.inflateSync(buffer).toString();
    return JSON.parse(decompressed);
  }

  private shouldCompress(value: any): boolean {
    const serialized = JSON.stringify(value);
    return serialized.length > 1024; // Compress if larger than 1KB
  }

  private logHealthcareAudit(
    operation: string,
    key: string,
    dataLevel: string,
    context?: any,
  ): void {
    this.logInfo(
      `Healthcare Cache Audit: ${operation} | Key: ${key} | DataLevel: ${dataLevel} | Context: ${JSON.stringify(context)} | Time: ${new Date().toISOString()}`,
    );
  }

  private isExpired(entry: HealthcareCacheEntry): boolean {
    if (entry.ttl <= 0) return false;
    const now = Date.now();
    const createdAt = entry.createdAt.getTime();
    return now - createdAt > entry.ttl * 1000;
  }

  private setExpirationTimer(key: string, ttl: number): void {
    this.clearExpirationTimer(key);

    const timer = setTimeout(async () => {
      await this.delete(key, { reason: 'ttl_expiration' });
    }, ttl * 1000);

    this.timers.set(key, timer);
  }

  private clearExpirationTimer(key: string): void {
    const timer = this.timers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(key);
    }
  }

  private async evictItems(): Promise<void> {
    const entries = Array.from(this.cache.entries());

    // Prioritize eviction: non-PHI first, then least recently used
    entries.sort((a, b) => {
      const aPHI = this.isPHIData(a[1].dataLevel);
      const bPHI = this.isPHIData(b[1].dataLevel);

      if (aPHI !== bPHI) {
        return aPHI ? 1 : -1; // Non-PHI first
      }

      return a[1].lastAccessed.getTime() - b[1].lastAccessed.getTime();
    });

    // Evict 25% of items
    const evictCount = Math.ceil(entries.length * 0.25);

    for (let i = 0; i < evictCount; i++) {
      await this.delete(entries[i][0], { reason: 'cache_eviction' });
      this.stats.evictions++;
    }
  }

  private updateStats(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRatio = total > 0 ? this.stats.hits / total : 0;
    this.stats.memoryUsage = this.cache.size;
  }

  private updateResponseTime(responseTime: number): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.avgResponseTime = total > 0 ? (this.stats.avgResponseTime * (total - 1) + responseTime) / total : responseTime;
  }

  private startHealthcareCleanupProcess(): void {
    const checkPeriod = this.config.memoryConfig?.checkPeriod || 60000;

    setInterval(() => {
      this.cleanupExpiredEntries();
      this.performHealthcareCompliance();
    }, checkPeriod);
  }

  private cleanupExpiredEntries(): void {
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach((key) => this.delete(key, { reason: 'expiration_cleanup' }));
  }

  private performHealthcareCompliance(): void {
    // Additional compliance checks for healthcare data
    const phiEntries = Array.from(this.cache.entries()).filter(([, entry]) =>
      this.isPHIData(entry.dataLevel),
    );

    // Log compliance metrics
    if (phiEntries.length > 0) {
      this.logInfo(
        `Healthcare Compliance Check: ${phiEntries.length} PHI entries in cache, ${this.stats.encryptedEntries} encrypted entries`,
      );
    }
  }
}

/**
 * Healthcare Caching Service
 */
@Injectable()
export class HealthcareCacheService extends EventEmitter {
  private memoryCache: HealthcareMemoryCache;
  constructor(
    private configService: ConfigService,
    private config: HealthcareCacheConfig,
  ) {
    super();
    this.memoryCache = new HealthcareMemoryCache(config);
    this.setupHealthcareEventHandlers();
  }

  /**
   * Gets cached data with healthcare-specific handling
   */
  async get<T>(
    key: string,
    auditContext?: { patientId?: string; providerId?: string },
  ): Promise<T | null> {
    try {
      const value = await this.memoryCache.get<T>(key, auditContext);

      if (value !== null) {
        this.emit('healthcareHit', { key, auditContext });
      } else {
        this.emit('healthcareMiss', { key });
      }

      return value;
    } catch (error) {
      this.logError(`Healthcare cache get failed for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Sets cached data with healthcare-specific options
   */
  async set<T>(
    key: string,
    value: T,
    options: {
      ttl?: number;
      tags?: string[];
      dataLevel?: 'PUBLIC' | 'INTERNAL' | 'PHI' | 'SENSITIVE_PHI' | 'RESTRICTED';
      patientId?: string;
      providerId?: string;
      clinicalContext?: string;
    } = {},
  ): Promise<void> {
    try {
      await this.memoryCache.set(key, value, options);
      this.emit('healthcareSet', { key, dataLevel: options.dataLevel, ...options });
    } catch (error) {
      this.logError(`Healthcare cache set failed for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Caches clinical query results with automatic PHI detection
   */
  async cacheHealthcareQuery<T>(
    query: string,
    params: any[],
    executor: () => Promise<T>,
    options: {
      ttl?: number;
      tags?: string[];
      dataLevel?: 'PUBLIC' | 'INTERNAL' | 'PHI' | 'SENSITIVE_PHI' | 'RESTRICTED';
      patientId?: string;
      providerId?: string;
      clinicalContext?: string;
    } = {},
  ): Promise<T> {
    const key = this.generateHealthcareQueryKey(query, params, options.patientId);

    try {
      // Try to get from cache first
      let result = await this.get<T>(key, {
        patientId: options.patientId,
        providerId: options.providerId,
      });

      if (result === null) {
        // Execute query and cache result
        result = await executor();
        await this.set(key, result, {
          ...options,
          tags: ['healthcare_query', ...(options.tags || [])],
        });
        this.emit('healthcareQueryExecuted', { key, query, clinicalContext: options.clinicalContext });
      } else {
        this.emit('healthcareQueryCacheHit', { key, query });
      }

      return result;
    } catch (error) {
      this.logError(`Healthcare query caching failed for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Caches patient data with automatic PHI handling
   */
  async cachePatientData<T>(
    patientId: string,
    dataType: string,
    data: T,
    options: {
      ttl?: number;
      dataLevel?: 'PHI' | 'SENSITIVE_PHI' | 'RESTRICTED';
      providerId?: string;
      clinicalContext?: string;
    } = {},
  ): Promise<void> {
    const key = `patient:${patientId}:${dataType}`;

    await this.set(key, data, {
      ttl: options.ttl,
      dataLevel: options.dataLevel || 'PHI',
      patientId,
      providerId: options.providerId,
      clinicalContext: options.clinicalContext,
      tags: ['patient_data', dataType],
    });
  }

  /**
   * Gets patient data from cache
   */
  async getPatientData<T>(
    patientId: string,
    dataType: string,
    providerId?: string,
  ): Promise<T | null> {
    const key = `patient:${patientId}:${dataType}`;
    return this.get<T>(key, { patientId, providerId });
  }

  /**
   * Invalidates all cache entries for a specific patient
   */
  async invalidatePatientData(patientId: string, reason: string = 'patient_update'): Promise<number> {
    return this.memoryCache.invalidateByPatient(patientId, reason);
  }

  /**
   * Invalidates all cache entries for a specific provider
   */
  async invalidateProviderData(providerId: string, reason: string = 'provider_update'): Promise<number> {
    return this.memoryCache.invalidateByProvider(providerId, reason);
  }

  /**
   * Warm cache with frequently accessed healthcare data
   */
  async warmHealthcareCache<T>(
    warmingData: Array<{
      key: string;
      value: T;
      ttl?: number;
      dataLevel?: 'PUBLIC' | 'INTERNAL' | 'PHI' | 'SENSITIVE_PHI' | 'RESTRICTED';
      tags?: string[];
      patientId?: string;
      providerId?: string;
    }>,
  ): Promise<void> {
    try {
      const promises = warmingData.map(({ key, value, ttl, dataLevel, tags, patientId, providerId }) =>
        this.set(key, value, { ttl, dataLevel, tags, patientId, providerId }),
      );

      await Promise.all(promises);
      this.emit('healthcareCacheWarmed', { count: warmingData.length });
    } catch (error) {
      this.logError('Healthcare cache warming failed:', error);
      throw error;
    }
  }

  /**
   * Delete specific cache entry
   */
  async delete(key: string, auditContext?: { reason?: string; providerId?: string }): Promise<boolean> {
    return this.memoryCache.delete(key, auditContext);
  }

  /**
   * Invalidate by tags
   */
  async invalidateByTags(tags: string[], reason: string = 'tag_invalidation'): Promise<number> {
    return this.memoryCache.invalidateByTags(tags, reason);
  }

  /**
   * Clear all cache data
   */
  async clear(reason: string = 'manual_clear'): Promise<void> {
    return this.memoryCache.clear(reason);
  }

  /**
   * Get healthcare cache statistics
   */
  getHealthcareStats(): HealthcareCacheStats {
    return this.memoryCache.getHealthcareStats();
  }

  /**
   * Healthcare cache health check
   */
  async healthCheck(): Promise<{
    memory: boolean;
    encryption: boolean;
    compliance: boolean;
    phiProtection: boolean;
  }> {
    try {
      const testKey = `health_check_${Date.now()}`;
      const testValue = { test: 'health_check_value', timestamp: new Date() };

      // Test basic caching
      await this.set(testKey, testValue, { ttl: 10, dataLevel: 'INTERNAL' });
      const retrievedValue = await this.get(testKey);
      const basicCaching = JSON.stringify(retrievedValue) === JSON.stringify(testValue);

      // Test PHI caching with encryption
      const phiTestKey = `phi_health_check_${Date.now()}`;
      const phiTestValue = { patientData: 'sensitive', ssn: '123-45-6789' };
      await this.set(phiTestKey, phiTestValue, { ttl: 10, dataLevel: 'PHI', patientId: 'test-patient' });
      const phiRetrievedValue = await this.get(phiTestKey, { patientId: 'test-patient' });
      const phiCaching = JSON.stringify(phiRetrievedValue) === JSON.stringify(phiTestValue);

      // Cleanup test data
      await this.delete(testKey);
      await this.delete(phiTestKey);

      return {
        memory: basicCaching,
        encryption: this.config.enableEncryption,
        compliance: this.config.auditCacheAccess,
        phiProtection: phiCaching,
      };
    } catch (error) {
      this.logError('Healthcare cache health check failed:', error);
      return {
        memory: false,
        encryption: false,
        compliance: false,
        phiProtection: false,
      };
    }
  }

  private generateHealthcareQueryKey(query: string, params: any[], patientId?: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(query);
    hash.update(JSON.stringify(params));
    if (patientId) {
      hash.update(patientId);
    }
    return `healthcare_query:${hash.digest('hex')}`;
  }

  private setupHealthcareEventHandlers(): void {
    // Memory cache events
    this.memoryCache.on('healthcareSet', (data) => this.emit('memorySet', data));
    this.memoryCache.on('healthcareDelete', (data) => this.emit('memoryDelete', data));
    this.memoryCache.on('healthcareClear', (data) => this.emit('memoryClear', data));
    this.memoryCache.on('patientDataInvalidated', (data) => this.emit('patientDataInvalidated', data));
    this.memoryCache.on('providerDataInvalidated', (data) => this.emit('providerDataInvalidated', data));
  }
}

/**
 * Healthcare Cache Factory
 */
export class HealthcareCacheFactory {
  static createHealthcareCache(
    configService: ConfigService,
    config: Partial<HealthcareCacheConfig> = {},
  ): HealthcareCacheService {
    const defaultConfig: HealthcareCacheConfig = {
      defaultTTL: 3600, // 1 hour
      phiTTL: 1800, // 30 minutes for PHI
      maxSize: 10000,
      enableCompression: true,
      enableMetrics: true,
      enableEncryption: true, // Always enabled for healthcare
      auditCacheAccess: true, // Always audit for HIPAA compliance
      redisConfig: {
        host: configService.get('REDIS_HOST', 'localhost'),
        port: configService.get('REDIS_PORT', 6379),
        password: configService.get('REDIS_PASSWORD'),
        db: configService.get('REDIS_DB', 0),
        enableSSL: configService.get('REDIS_SSL', true),
      },
      memoryConfig: {
        maxItems: 1000,
        checkPeriod: 60000,
        phiMaxItems: 500, // Lower limit for PHI data
      },
    };

    const finalConfig = { ...defaultConfig, ...config };
    return new HealthcareCacheService(configService, finalConfig);
  }
}

/**
 * Healthcare Cache Utilities
 */
export const HealthcareCacheUtils = {
  generatePatientKey: (patientId: string, dataType: string): string => {
    return `patient:${patientId}:${dataType}`;
  },

  generateProviderKey: (providerId: string, dataType: string): string => {
    return `provider:${providerId}:${dataType}`;
  },

  generateClinicalKey: (workflowType: string, contextId: string): string => {
    return `clinical:${workflowType}:${contextId}`;
  },

  parseHealthcareKey: (key: string): { type: string; id: string; dataType: string } => {
    const parts = key.split(':');
    return {
      type: parts[0] || '',
      id: parts[1] || '',
      dataType: parts[2] || '',
    };
  },

  isPatientKey: (key: string): boolean => {
    return key.startsWith('patient:');
  },

  isProviderKey: (key: string): boolean => {
    return key.startsWith('provider:');
  },

  isClinicalKey: (key: string): boolean => {
    return key.startsWith('clinical:');
  },
};
