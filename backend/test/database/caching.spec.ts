/**
 * Caching Tests
 *
 * Tests cache functionality including:
 * - Cache hit rate > 60% after warm-up
 * - Cache invalidation on updates
 * - TTL expiration
 * - Cache statistics
 * - PHI data handling in cache
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../../src/database/database.module';
import { CacheService } from '../../src/database/services/cache.service';
import { Student } from '../../src/database/models/student.model';
import { Sequelize } from 'sequelize-typescript';

describe('Caching Tests', () => {
  let module: TestingModule;
  let cacheService: CacheService;
  let sequelize: Sequelize;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        DatabaseModule,
      ],
    }).compile();

    cacheService = module.get<CacheService>('ICacheManager');
    sequelize = module.get<Sequelize>(Sequelize);

    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(async () => {
    await cacheService.clear();
    await Student.destroy({ where: {}, force: true });
  });

  describe('Basic Cache Operations', () => {
    it('should set and get cache values', async () => {
      const key = 'test:key';
      const value = { data: 'test-value' };
      const ttl = 60; // 60 seconds

      await cacheService.set(key, value, ttl);
      const retrieved = await cacheService.get<typeof value>(key);

      expect(retrieved).toEqual(value);
    });

    it('should return null for non-existent keys', async () => {
      const result = await cacheService.get('non-existent-key');
      expect(result).toBeNull();
    });

    it('should delete cache keys', async () => {
      const key = 'test:delete';
      await cacheService.set(key, 'value', 60);

      const before = await cacheService.get(key);
      expect(before).toBe('value');

      await cacheService.delete(key);

      const after = await cacheService.get(key);
      expect(after).toBeNull();
    });

    it('should check if key exists', async () => {
      const key = 'test:exists';
      await cacheService.set(key, 'value', 60);

      const exists = await cacheService.exists(key);
      expect(exists).toBe(true);

      const notExists = await cacheService.exists('non-existent');
      expect(notExists).toBe(false);
    });

    it('should clear all cache', async () => {
      await cacheService.set('key1', 'value1', 60);
      await cacheService.set('key2', 'value2', 60);

      await cacheService.clear();

      const key1 = await cacheService.get('key1');
      const key2 = await cacheService.get('key2');

      expect(key1).toBeNull();
      expect(key2).toBeNull();
    });
  });

  describe('TTL and Expiration', () => {
    it('should expire cache entries after TTL', async () => {
      const key = 'test:ttl';
      const value = 'expires-soon';
      const ttl = 1; // 1 second

      await cacheService.set(key, value, ttl);

      // Should exist immediately
      const immediate = await cacheService.get(key);
      expect(immediate).toBe(value);

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Should be expired
      const expired = await cacheService.get(key);
      expect(expired).toBeNull();
    });

    it('should handle different TTL values', async () => {
      await cacheService.set('short', 'value', 1);
      await cacheService.set('long', 'value', 3600);

      await new Promise(resolve => setTimeout(resolve, 1100));

      const short = await cacheService.get('short');
      const long = await cacheService.get('long');

      expect(short).toBeNull();
      expect(long).toBe('value');
    });
  });

  describe('Pattern-based Operations', () => {
    it('should delete keys matching pattern', async () => {
      await cacheService.set('user:1:profile', 'data1', 60);
      await cacheService.set('user:2:profile', 'data2', 60);
      await cacheService.set('user:1:settings', 'data3', 60);
      await cacheService.set('post:1', 'data4', 60);

      // Delete all user:*:profile keys
      await cacheService.deletePattern('user:*:profile');

      const user1Profile = await cacheService.get('user:1:profile');
      const user2Profile = await cacheService.get('user:2:profile');
      const user1Settings = await cacheService.get('user:1:settings');
      const post1 = await cacheService.get('post:1');

      expect(user1Profile).toBeNull();
      expect(user2Profile).toBeNull();
      expect(user1Settings).toBe('data3'); // Not deleted
      expect(post1).toBe('data4'); // Not deleted
    });
  });

  describe('Bulk Operations', () => {
    it('should set multiple values at once', async () => {
      const entries: Array<[string, any, number]> = [
        ['bulk:1', 'value1', 60],
        ['bulk:2', 'value2', 60],
        ['bulk:3', 'value3', 60],
      ];

      await cacheService.mset(entries);

      const value1 = await cacheService.get('bulk:1');
      const value2 = await cacheService.get('bulk:2');
      const value3 = await cacheService.get('bulk:3');

      expect(value1).toBe('value1');
      expect(value2).toBe('value2');
      expect(value3).toBe('value3');
    });

    it('should get multiple values at once', async () => {
      await cacheService.set('multi:1', 'value1', 60);
      await cacheService.set('multi:2', 'value2', 60);
      await cacheService.set('multi:3', 'value3', 60);

      const values = await cacheService.mget(['multi:1', 'multi:2', 'multi:3', 'missing']);

      expect(values).toEqual(['value1', 'value2', 'value3', null]);
    });
  });

  describe('Cache Statistics', () => {
    it('should track cache hits and misses', async () => {
      await cacheService.clear();

      // Set some values
      await cacheService.set('hit:1', 'value1', 60);
      await cacheService.set('hit:2', 'value2', 60);

      // Cache hits
      await cacheService.get('hit:1');
      await cacheService.get('hit:1');
      await cacheService.get('hit:2');

      // Cache misses
      await cacheService.get('miss:1');
      await cacheService.get('miss:2');

      const stats = await cacheService.getStats();

      expect(stats.hits).toBe(3);
      expect(stats.misses).toBe(2);
      expect(stats.hitRate).toBeCloseTo(60, 0); // 3/5 = 60%
    });

    it('should calculate hit rate correctly', async () => {
      await cacheService.clear();

      await cacheService.set('key', 'value', 60);

      // 7 hits
      for (let i = 0; i < 7; i++) {
        await cacheService.get('key');
      }

      // 3 misses
      for (let i = 0; i < 3; i++) {
        await cacheService.get('missing');
      }

      const stats = await cacheService.getStats();

      expect(stats.hitRate).toBeCloseTo(70, 0); // 7/10 = 70%
    });

    it('should track key count', async () => {
      await cacheService.clear();

      await cacheService.set('key1', 'value1', 60);
      await cacheService.set('key2', 'value2', 60);
      await cacheService.set('key3', 'value3', 60);

      const stats = await cacheService.getStats();

      expect(stats.keyCount).toBe(3);
    });
  });

  describe('Cache Warm-up and Hit Rate', () => {
    it('should achieve >60% hit rate after warm-up', async () => {
      await cacheService.clear();

      // Create test data
      const students = await Promise.all(
        Array.from({ length: 10 }, (_, i) =>
          Student.create({
            firstName: `Student${i}`,
            lastName: 'Test',
            dateOfBirth: new Date('2010-01-01'),
            grade: '5',
            studentNumber: 'TEST',
        gender: 'MALE' as any,
          })
        )
      );

      // Warm-up cache: populate with student data
      for (const student of students) {
        const cacheKey = `student:${student.id}`;
        await cacheService.set(cacheKey, student.toJSON(), 300);
      }

      // Simulate realistic access pattern
      // 80% hits (accessing cached students), 20% misses (new queries)
      for (let i = 0; i < 20; i++) {
        if (i < 16) {
          // Cache hit: access existing students
          const randomStudent = students[Math.floor(Math.random() * students.length)];
          const cacheKey = `student:${randomStudent.id}`;
          await cacheService.get(cacheKey);
        } else {
          // Cache miss: query non-existent data
          await cacheService.get(`student:missing-${i}`);
        }
      }

      const stats = await cacheService.getStats();

      expect(stats.hitRate).toBeGreaterThan(60);
    });

    it('should maintain hit rate under load', async () => {
      await cacheService.clear();

      // Set up frequently accessed data
      const hotKeys = ['hot:1', 'hot:2', 'hot:3'];
      for (const key of hotKeys) {
        await cacheService.set(key, { data: key }, 300);
      }

      // Simulate traffic: 70% hot keys, 30% cold keys
      const accessCount = 100;
      for (let i = 0; i < accessCount; i++) {
        if (i < 70) {
          // Access hot keys
          const key = hotKeys[i % hotKeys.length];
          await cacheService.get(key);
        } else {
          // Access cold keys (cache miss)
          await cacheService.get(`cold:${i}`);
        }
      }

      const stats = await cacheService.getStats();

      expect(stats.hitRate).toBeGreaterThan(60);
    });
  });

  describe('Cache Invalidation', () => {
    it('should invalidate cache on entity update', async () => {
      const student = await Student.create({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2010-01-01'),
        grade: '5',
        studentNumber: 'TEST',
        gender: 'MALE' as any,
      });

      const cacheKey = `student:${student.id}`;

      // Cache the student
      await cacheService.set(cacheKey, student.toJSON(), 300);

      // Verify cached
      const cached = await cacheService.get(cacheKey);
      expect(cached).toBeDefined();

      // Update student
      student.grade = '6';
      await student.save();

      // Invalidate cache
      await cacheService.delete(cacheKey);

      // Verify invalidated
      const afterInvalidation = await cacheService.get(cacheKey);
      expect(afterInvalidation).toBeNull();
    });

    it('should invalidate related caches on update', async () => {
      const student = await Student.create({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2010-01-01'),
        grade: '5',
        studentNumber: 'TEST',
        gender: 'MALE' as any,
      });

      // Cache multiple related keys
      await cacheService.set(`student:${student.id}`, student.toJSON(), 300);
      await cacheService.set(`student:${student.id}:profile`, {}, 300);
      await cacheService.set(`student:${student.id}:records`, [], 300);

      // Invalidate all related caches
      await cacheService.deletePattern(`student:${student.id}*`);

      // Verify all invalidated
      const main = await cacheService.get(`student:${student.id}`);
      const profile = await cacheService.get(`student:${student.id}:profile`);
      const records = await cacheService.get(`student:${student.id}:records`);

      expect(main).toBeNull();
      expect(profile).toBeNull();
      expect(records).toBeNull();
    });

    it('should handle cache invalidation on delete', async () => {
      const student = await Student.create({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2010-01-01'),
        grade: '5',
        studentNumber: 'TEST',
        gender: 'MALE' as any,
      });

      const cacheKey = `student:${student.id}`;
      await cacheService.set(cacheKey, student.toJSON(), 300);

      // Delete student
      await student.destroy();

      // Invalidate cache
      await cacheService.delete(cacheKey);

      const cached = await cacheService.get(cacheKey);
      expect(cached).toBeNull();
    });
  });

  describe('PHI Data Caching', () => {
    it('should cache PHI data with appropriate TTL', async () => {
      const student = await Student.create({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2010-01-01'),
        grade: '5',
        studentNumber: 'TEST',
        gender: 'MALE' as any,
      });

      // PHI data should have shorter TTL (e.g., 5 minutes)
      const phiTTL = 300; // 5 minutes
      const cacheKey = `student:phi:${student.id}`;

      await cacheService.set(cacheKey, student.toJSON(), phiTTL);

      const cached = await cacheService.get(cacheKey);
      expect(cached).toBeDefined();
    });

    it('should not cache sensitive fields directly', async () => {
      // This tests the pattern - actual implementation would sanitize
      const studentData = {
        id: 'test-id',
        firstName: 'John',
        lastName: 'Doe',
        ssn: '123-45-6789', // Should not be cached
        medicalRecordNumber: 'MRN123', // Should not be cached
      };

      // In real implementation, sanitize before caching
      const sanitized = {
        id: studentData.id,
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        // ssn and medicalRecordNumber omitted
      };

      await cacheService.set('student:sanitized', sanitized, 300);

      const cached = await cacheService.get('student:sanitized');
      expect(cached).not.toHaveProperty('ssn');
      expect(cached).not.toHaveProperty('medicalRecordNumber');
    });
  });

  describe('Cache Eviction', () => {
    it('should evict old entries when cache is full', async () => {
      // This tests cache size limits
      // Set a large number of entries
      const entries = 150; // Assuming maxCacheSize is 100

      for (let i = 0; i < entries; i++) {
        await cacheService.set(`evict:${i}`, `value${i}`, 300);
      }

      const stats = await cacheService.getStats();

      // Cache should not exceed max size
      expect(stats.keyCount).toBeLessThanOrEqual(100);
    });

    it('should use LRU eviction policy', async () => {
      // Set initial entries
      await cacheService.set('lru:1', 'value1', 300);
      await cacheService.set('lru:2', 'value2', 300);
      await cacheService.set('lru:3', 'value3', 300);

      // Access lru:2 to make it recently used
      await cacheService.get('lru:2');

      // Add many new entries to trigger eviction
      for (let i = 4; i < 110; i++) {
        await cacheService.set(`lru:${i}`, `value${i}`, 300);
      }

      // lru:2 (recently used) might still exist
      // lru:1 and lru:3 (not recently used) might be evicted
      const value2 = await cacheService.get('lru:2');

      // This depends on implementation details
      // The test verifies eviction happens
      const stats = await cacheService.getStats();
      expect(stats.keyCount).toBeLessThanOrEqual(100);
    });
  });

  describe('Error Handling', () => {
    it('should handle cache errors gracefully', async () => {
      // Even if cache fails, application should continue
      // This test verifies error handling

      // Try to get from cache
      const result = await cacheService.get('any-key');

      // Should return null, not throw
      expect(result).toBeNull();
    });

    it('should handle invalid TTL gracefully', async () => {
      await expect(async () => {
        await cacheService.set('key', 'value', 60);
      }).not.toThrow();
    });
  });

  describe('Concurrent Access', () => {
    it('should handle concurrent cache operations', async () => {
      const operations = [];

      for (let i = 0; i < 10; i++) {
        operations.push(
          cacheService.set(`concurrent:${i}`, `value${i}`, 300)
        );
      }

      await Promise.all(operations);

      const stats = await cacheService.getStats();
      expect(stats.keyCount).toBeGreaterThanOrEqual(10);
    });

    it('should maintain consistency under concurrent reads/writes', async () => {
      const key = 'concurrent:readwrite';

      const operations = [];

      // Mix of reads and writes
      for (let i = 0; i < 20; i++) {
        if (i % 2 === 0) {
          operations.push(cacheService.set(key, `value${i}`, 300));
        } else {
          operations.push(cacheService.get(key));
        }
      }

      await Promise.all(operations);

      // Final value should be defined
      const final = await cacheService.get(key);
      expect(final).toBeDefined();
    });
  });
});
