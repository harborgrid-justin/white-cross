/**
 * @fileoverview Saga Manager Unit Tests
 * @module services/domain/__tests__/SagaManager.test
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SagaManager, SagaState } from '../orchestration/SagaManager';

describe('SagaManager', () => {
  let sagaManager: SagaManager;

  beforeEach(() => {
    sagaManager = SagaManager.getInstance();
    sagaManager.clearHistory();
    // Clear active sagas by completing them
    const activeSagas = sagaManager.getActiveSagas();
    activeSagas.forEach(saga => sagaManager.complete(saga.getSagaId()));
  });

  describe('saga creation', () => {
    it('should create a new saga', () => {
      const saga = sagaManager.create('TestSaga');
      
      expect(saga).toBeDefined();
      expect(saga.getSagaId()).toMatch(/^saga-/);
      expect(saga.getState()).toBe(SagaState.PENDING);
    });

    it('should track active sagas', () => {
      const saga1 = sagaManager.create('TestSaga1');
      const saga2 = sagaManager.create('TestSaga2');

      const activeSagas = sagaManager.getActiveSagas();
      expect(activeSagas).toHaveLength(2);
      expect(activeSagas).toContain(saga1);
      expect(activeSagas).toContain(saga2);
    });
  });

  describe('saga execution', () => {
    it('should execute steps successfully', async () => {
      const saga = sagaManager.create('TestSaga');
      
      const step1Result = await saga.step(
        async () => 'result1',
        async () => {}
      );
      
      const step2Result = await saga.step(
        async () => 'result2',
        async () => {}
      );

      expect(step1Result).toBe('result1');
      expect(step2Result).toBe('result2');
      expect(saga.getState()).toBe(SagaState.IN_PROGRESS);
    });

    it('should commit saga', async () => {
      const saga = sagaManager.create('TestSaga');
      
      await saga.step(async () => 'result', async () => {});
      await saga.commit();

      expect(saga.getState()).toBe(SagaState.COMMITTED);
      expect(saga.getMetadata().completedAt).toBeDefined();
    });

    it('should handle step failure', async () => {
      const saga = sagaManager.create('TestSaga');
      
      await expect(
        saga.step(
          async () => { throw new Error('Step failed'); },
          async () => {}
        )
      ).rejects.toThrow('Step failed');

      expect(saga.getState()).toBe(SagaState.IN_PROGRESS);
    });
  });

  describe('saga rollback', () => {
    it('should rollback all executed steps', async () => {
      const saga = sagaManager.create('TestSaga');
      
      const compensate1 = vi.fn();
      const compensate2 = vi.fn();
      
      await saga.step(async () => 'result1', compensate1);
      await saga.step(async () => 'result2', compensate2);
      
      await saga.rollback();

      expect(compensate2).toHaveBeenCalled(); // Reverse order
      expect(compensate1).toHaveBeenCalled();
      expect(saga.getState()).toBe(SagaState.ROLLED_BACK);
    });

    it('should rollback in reverse order', async () => {
      const saga = sagaManager.create('TestSaga');
      const order: number[] = [];
      
      await saga.step(
        async () => 'result1',
        async () => { order.push(1); }
      );
      await saga.step(
        async () => 'result2',
        async () => { order.push(2); }
      );
      await saga.step(
        async () => 'result3',
        async () => { order.push(3); }
      );
      
      await saga.rollback();

      expect(order).toEqual([3, 2, 1]); // Reverse order
    });

    it('should not compensate failed steps', async () => {
      const saga = sagaManager.create('TestSaga');
      
      const compensate1 = vi.fn();
      const compensate2 = vi.fn();
      
      await saga.step(async () => 'result1', compensate1);
      
      try {
        await saga.step(
          async () => { throw new Error('Failed'); },
          compensate2
        );
      } catch {
        // Expected
      }
      
      await saga.rollback();

      expect(compensate1).toHaveBeenCalled();
      expect(compensate2).not.toHaveBeenCalled(); // Not executed, not compensated
    });
  });

  describe('saga metadata', () => {
    it('should provide saga metadata', async () => {
      const saga = sagaManager.create('TestSaga');
      
      await saga.step(async () => 'result', async () => {});
      await saga.commit();

      const metadata = saga.getMetadata();
      
      expect(metadata.sagaType).toBe('TestSaga');
      expect(metadata.state).toBe(SagaState.COMMITTED);
      expect(metadata.totalSteps).toBe(1);
      expect(metadata.completedSteps).toBe(1);
      expect(metadata.createdAt).toBeDefined();
      expect(metadata.completedAt).toBeDefined();
    });
  });

  describe('saga history', () => {
    it('should track saga history', async () => {
      // Ensure clean state for this test
      sagaManager.clearHistory();
      
      const saga1 = sagaManager.create('Saga1');
      const saga2 = sagaManager.create('Saga2');
      
      await saga1.step(async () => 'result', async () => {});
      await saga1.commit();
      sagaManager.complete(saga1.getSagaId());
      
      await saga2.step(async () => 'result', async () => {});
      await saga2.commit();
      sagaManager.complete(saga2.getSagaId());

      const history = sagaManager.getHistory();
      expect(history).toHaveLength(2);
    });

    it('should provide statistics', async () => {
      // Ensure clean state for this test
      sagaManager.clearHistory();
      

      const saga1 = sagaManager.create('Saga1');
      const saga2 = sagaManager.create('Saga2');
      const saga3 = sagaManager.create('Saga3');
      
      await saga1.step(async () => 'result', async () => {});
      await saga1.commit();
      sagaManager.complete(saga1.getSagaId());
      
      await saga2.step(async () => 'result', async () => {});
      await saga2.rollback();
      sagaManager.complete(saga2.getSagaId());
      
      await saga3.step(async () => 'result', async () => {});
      await saga3.commit();
      sagaManager.complete(saga3.getSagaId());

      const stats = sagaManager.getStatistics();
      
      expect(stats.totalSagas).toBe(3);
      expect(stats.committed).toBe(2);
      expect(stats.rolledBack).toBe(1);
    });
  });
});
