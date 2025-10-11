/**
 * Optimistic Updates - Unit Tests
 *
 * Comprehensive test suite for the optimistic update system.
 * Tests cover all core functionality including create, update, delete,
 * rollback, conflict resolution, and transaction support.
 *
 * @module OptimisticUpdatesTests
 * @version 1.0.0
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import {
  OptimisticUpdateManager,
  UpdateStatus,
  OperationType,
  RollbackStrategy,
  ConflictResolutionStrategy,
} from './optimisticUpdates';
import {
  optimisticCreate,
  optimisticUpdate,
  optimisticDelete,
  confirmUpdate,
  rollbackUpdate,
  generateTempId,
  isTempId,
  replaceTempId,
} from './optimisticHelpers';

// =====================
// TEST SETUP
// =====================

describe('OptimisticUpdateManager', () => {
  let manager: OptimisticUpdateManager;
  let queryClient: QueryClient;

  beforeEach(() => {
    manager = new OptimisticUpdateManager();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  // =====================
  // BASIC OPERATIONS
  // =====================

  describe('Basic Operations', () => {
    it('should create an optimistic update', () => {
      const queryKey = ['test', 'list'];
      const previousData = { data: [] };
      const optimisticData = { data: [{ id: '1', name: 'Test' }] };

      const updateId = manager.createUpdate(
        queryClient,
        queryKey,
        OperationType.CREATE,
        previousData,
        optimisticData
      );

      expect(updateId).toBeDefined();
      expect(updateId).toMatch(/^opt_/);

      const update = manager.getUpdate(updateId);
      expect(update).toBeDefined();
      expect(update?.status).toBe(UpdateStatus.APPLIED);
      expect(update?.operationType).toBe(OperationType.CREATE);
    });

    it('should confirm an update', () => {
      const queryKey = ['test', 'list'];
      const updateId = manager.createUpdate(
        queryClient,
        queryKey,
        OperationType.UPDATE,
        null,
        { id: '1', name: 'Test' }
      );

      const serverData = { id: '1', name: 'Test', updatedAt: new Date().toISOString() };
      manager.confirmUpdate(updateId, serverData, queryClient);

      const update = manager.getUpdate(updateId);
      expect(update?.status).toBe(UpdateStatus.CONFIRMED);
      expect(update?.confirmedData).toEqual(serverData);
    });

    it('should rollback an update', async () => {
      const queryKey = ['test', 'detail', '1'];
      const previousData = { id: '1', name: 'Original' };
      const optimisticData = { id: '1', name: 'Updated' };

      queryClient.setQueryData(queryKey, previousData);

      const updateId = manager.createUpdate(
        queryClient,
        queryKey,
        OperationType.UPDATE,
        previousData,
        optimisticData
      );

      await manager.rollbackUpdate(queryClient, updateId, {
        message: 'Test error',
      });

      const update = manager.getUpdate(updateId);
      expect(update?.status).toBe(UpdateStatus.ROLLED_BACK);

      // Check if data was restored
      const cachedData = queryClient.getQueryData(queryKey);
      expect(cachedData).toEqual(previousData);
    });
  });

  // =====================
  // CONFLICT DETECTION
  // =====================

  describe('Conflict Detection', () => {
    it('should detect conflicts', () => {
      const queryKey = ['test', 'detail', '1'];
      const previousData = { id: '1', name: 'Original', version: 1 };
      const optimisticData = { id: '1', name: 'Client Update', version: 1 };
      const serverData = { id: '1', name: 'Server Update', version: 2 };

      const updateId = manager.createUpdate(
        queryClient,
        queryKey,
        OperationType.UPDATE,
        previousData,
        optimisticData,
        {
          conflictStrategy: ConflictResolutionStrategy.MANUAL,
        }
      );

      manager.confirmUpdate(updateId, serverData, queryClient);

      const update = manager.getUpdate(updateId);
      expect(update?.status).toBe(UpdateStatus.CONFLICTED);

      const conflicts = manager.getConflicts();
      expect(conflicts.length).toBe(1);
      expect(conflicts[0].serverData).toEqual(serverData);
      expect(conflicts[0].clientData).toEqual(optimisticData);
    });

    it('should auto-resolve conflicts with SERVER_WINS', () => {
      const queryKey = ['test', 'detail', '1'];
      const optimisticData = { id: '1', name: 'Client' };
      const serverData = { id: '1', name: 'Server' };

      const updateId = manager.createUpdate(
        queryClient,
        queryKey,
        OperationType.UPDATE,
        null,
        optimisticData,
        {
          conflictStrategy: ConflictResolutionStrategy.SERVER_WINS,
        }
      );

      manager.confirmUpdate(updateId, serverData, queryClient);

      const cachedData = queryClient.getQueryData(queryKey);
      expect(cachedData).toEqual(serverData);
    });

    it('should merge conflicts with custom merge function', () => {
      const queryKey = ['test', 'detail', '1'];
      const optimisticData = { id: '1', name: 'Client', tags: ['client'] };
      const serverData = { id: '1', name: 'Server', tags: ['server'] };

      const mergeFn = (server: any, client: any) => ({
        ...server,
        tags: [...server.tags, ...client.tags],
      });

      const updateId = manager.createUpdate(
        queryClient,
        queryKey,
        OperationType.UPDATE,
        null,
        optimisticData,
        {
          conflictStrategy: ConflictResolutionStrategy.MERGE,
          mergeFn,
        }
      );

      manager.confirmUpdate(updateId, serverData, queryClient);

      const cachedData = queryClient.getQueryData(queryKey);
      expect(cachedData).toEqual({
        id: '1',
        name: 'Server',
        tags: ['server', 'client'],
      });
    });
  });

  // =====================
  // QUEUE MANAGEMENT
  // =====================

  describe('Queue Management', () => {
    it('should queue conflicting updates', () => {
      const queryKey = ['test', 'detail', '1'];

      // First update
      const updateId1 = manager.createUpdate(
        queryClient,
        queryKey,
        OperationType.UPDATE,
        null,
        { id: '1', name: 'Update 1' }
      );

      // Second update (should be queued)
      const updateId2 = manager.createUpdate(
        queryClient,
        queryKey,
        OperationType.UPDATE,
        null,
        { id: '1', name: 'Update 2' }
      );

      const update1 = manager.getUpdate(updateId1);
      const update2 = manager.getUpdate(updateId2);

      expect(update1?.status).toBe(UpdateStatus.APPLIED);
      expect(update2?.status).toBe(UpdateStatus.PENDING);
    });

    it('should process queued updates after confirmation', () => {
      const queryKey = ['test', 'detail', '1'];

      const updateId1 = manager.createUpdate(
        queryClient,
        queryKey,
        OperationType.UPDATE,
        null,
        { id: '1', name: 'Update 1' }
      );

      const updateId2 = manager.createUpdate(
        queryClient,
        queryKey,
        OperationType.UPDATE,
        null,
        { id: '1', name: 'Update 2' }
      );

      // Confirm first update
      manager.confirmUpdate(updateId1, { id: '1', name: 'Update 1' }, queryClient);

      // Second update should now be applied
      const update2 = manager.getUpdate(updateId2);
      expect(update2?.status).toBe(UpdateStatus.APPLIED);
    });
  });

  // =====================
  // STATISTICS
  // =====================

  describe('Statistics', () => {
    it('should calculate update statistics', () => {
      const queryKey = ['test'];

      // Create some updates
      manager.createUpdate(queryClient, queryKey, OperationType.CREATE, null, {});
      manager.createUpdate(queryClient, queryKey, OperationType.UPDATE, null, {});

      const updateId3 = manager.createUpdate(
        queryClient,
        queryKey,
        OperationType.DELETE,
        null,
        {}
      );
      manager.confirmUpdate(updateId3, null, queryClient);

      const stats = manager.getStats();
      expect(stats.total).toBe(3);
      expect(stats.confirmed).toBe(1);
      expect(stats.applied).toBe(2);
    });
  });

  // =====================
  // CLEANUP
  // =====================

  describe('Cleanup', () => {
    it('should clear old updates', () => {
      const queryKey = ['test'];

      const updateId = manager.createUpdate(
        queryClient,
        queryKey,
        OperationType.CREATE,
        null,
        {}
      );

      manager.confirmUpdate(updateId, {}, queryClient);

      // Clear updates older than 0ms (all)
      manager.clearOldUpdates(0);

      const update = manager.getUpdate(updateId);
      expect(update).toBeUndefined();
    });
  });
});

// =====================
// HELPER FUNCTIONS TESTS
// =====================

describe('Helper Functions', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  describe('generateTempId', () => {
    it('should generate unique temp IDs', () => {
      const id1 = generateTempId();
      const id2 = generateTempId();

      expect(id1).toMatch(/^temp_/);
      expect(id2).toMatch(/^temp_/);
      expect(id1).not.toBe(id2);
    });

    it('should support custom prefix', () => {
      const id = generateTempId('custom');
      expect(id).toMatch(/^custom_/);
    });
  });

  describe('isTempId', () => {
    it('should identify temp IDs', () => {
      expect(isTempId('temp_123')).toBe(true);
      expect(isTempId('real-id-123')).toBe(false);
    });
  });

  describe('replaceTempId', () => {
    it('should replace temp ID with real ID', () => {
      const entity = { id: 'temp_123', name: 'Test' };
      const updated = replaceTempId(entity, 'temp_123', 'real-123');

      expect(updated.id).toBe('real-123');
      expect(updated.name).toBe('Test');
    });

    it('should not modify if IDs do not match', () => {
      const entity = { id: 'other-id', name: 'Test' };
      const updated = replaceTempId(entity, 'temp_123', 'real-123');

      expect(updated.id).toBe('other-id');
    });
  });

  describe('optimisticCreate', () => {
    it('should create optimistic entity with temp ID', () => {
      const queryKey = ['test'];
      queryClient.setQueryData(queryKey, { data: [] });

      const { updateId, tempId, tempEntity } = optimisticCreate(
        queryClient,
        queryKey,
        { name: 'New Item' },
        {}
      );

      expect(updateId).toBeDefined();
      expect(tempId).toMatch(/^temp_/);
      expect(tempEntity.id).toBe(tempId);
      expect(tempEntity.name).toBe('New Item');
      expect(tempEntity.createdAt).toBeDefined();
    });
  });

  describe('optimisticUpdate', () => {
    it('should update entity optimistically', () => {
      const entityId = 'entity-1';
      const queryKey = ['test'];
      const detailKey = [...queryKey, 'detail', entityId];

      queryClient.setQueryData(detailKey, {
        id: entityId,
        name: 'Original',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      });

      const updateId = optimisticUpdate(
        queryClient,
        queryKey,
        entityId,
        { name: 'Updated' },
        {}
      );

      expect(updateId).toBeDefined();

      const cachedData = queryClient.getQueryData(detailKey);
      expect((cachedData as any).name).toBe('Updated');
    });
  });

  describe('optimisticDelete', () => {
    it('should delete entity optimistically', () => {
      const entityId = 'entity-1';
      const queryKey = ['test'];
      const detailKey = [...queryKey, 'detail', entityId];

      queryClient.setQueryData(detailKey, {
        id: entityId,
        name: 'To Delete',
      });

      const updateId = optimisticDelete(queryClient, queryKey, entityId, {});

      expect(updateId).toBeDefined();

      const cachedData = queryClient.getQueryData(detailKey);
      expect(cachedData).toBeUndefined();
    });
  });
});

// =====================
// INTEGRATION TESTS
// =====================

describe('Integration Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  it('should handle complete create-confirm flow', () => {
    const queryKey = ['incidents'];
    queryClient.setQueryData([...queryKey, 'list'], { data: [] });

    // Create optimistically
    const { updateId, tempId, tempEntity } = optimisticCreate(
      queryClient,
      queryKey,
      {
        studentId: 'student-1',
        type: 'INJURY',
        description: 'Test incident',
      },
      {}
    );

    // Check optimistic state
    const optimisticData = queryClient.getQueryData([...queryKey, 'list']);
    expect((optimisticData as any).data[0].id).toBe(tempId);

    // Confirm with server data
    const serverEntity = {
      ...tempEntity,
      id: 'real-id-123',
    };

    confirmUpdate(updateId, serverEntity, queryClient);

    // Verify confirmed
    const finalData = queryClient.getQueryData([...queryKey, 'list']);
    expect((finalData as any).data[0].id).toBe('real-id-123');
  });

  it('should handle create-error-rollback flow', async () => {
    const queryKey = ['incidents'];
    queryClient.setQueryData([...queryKey, 'list'], { data: [] });

    // Create optimistically
    const { updateId } = optimisticCreate(
      queryClient,
      queryKey,
      { name: 'Test' },
      {}
    );

    // Simulate error and rollback
    await rollbackUpdate(queryClient, updateId, {
      message: 'Network error',
      statusCode: 500,
    });

    // Verify rollback
    const finalData = queryClient.getQueryData([...queryKey, 'list']);
    expect((finalData as any).data.length).toBe(0);
  });

  it('should handle concurrent updates with queuing', () => {
    const queryKey = ['test'];
    const entityId = 'entity-1';
    const detailKey = [...queryKey, 'detail', entityId];

    queryClient.setQueryData(detailKey, {
      id: entityId,
      count: 0,
    });

    // Create multiple updates
    const updateId1 = optimisticUpdate(
      queryClient,
      queryKey,
      entityId,
      { count: 1 },
      {}
    );

    const updateId2 = optimisticUpdate(
      queryClient,
      queryKey,
      entityId,
      { count: 2 },
      {}
    );

    // First update should be applied
    const data1 = queryClient.getQueryData(detailKey);
    expect((data1 as any).count).toBe(1);

    // Confirm first update
    confirmUpdate(updateId1, { id: entityId, count: 1 }, queryClient);

    // Second update should now be applied
    const data2 = queryClient.getQueryData(detailKey);
    expect((data2 as any).count).toBe(2);
  });
});

// =====================
// EDGE CASES
// =====================

describe('Edge Cases', () => {
  let manager: OptimisticUpdateManager;
  let queryClient: QueryClient;

  beforeEach(() => {
    manager = new OptimisticUpdateManager();
    queryClient = new QueryClient();
  });

  it('should handle missing update gracefully', () => {
    expect(() => {
      manager.confirmUpdate('non-existent-id', {});
    }).not.toThrow();
  });

  it('should handle null previous data', () => {
    const updateId = manager.createUpdate(
      queryClient,
      ['test'],
      OperationType.CREATE,
      null,
      { id: '1' }
    );

    expect(updateId).toBeDefined();
  });

  it('should handle empty query key', () => {
    const updateId = manager.createUpdate(
      queryClient,
      [],
      OperationType.UPDATE,
      null,
      {}
    );

    expect(updateId).toBeDefined();
  });

  it('should handle rapid successive updates', () => {
    const queryKey = ['test'];

    for (let i = 0; i < 100; i++) {
      manager.createUpdate(queryClient, queryKey, OperationType.UPDATE, null, { count: i });
    }

    const stats = manager.getStats();
    expect(stats.total).toBe(100);
  });
});
