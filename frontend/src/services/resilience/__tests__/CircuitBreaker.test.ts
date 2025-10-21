/**
 * CircuitBreaker Tests
 * Comprehensive test suite for circuit breaker pattern
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CircuitBreaker } from '../CircuitBreaker';
import { CircuitBreakerState } from '../types';
import { wait, silenceConsole } from '@/__tests__/utils/testHelpers';

describe('CircuitBreaker', () => {
  let circuitBreaker: CircuitBreaker;
  let consoleSpies: ReturnType<typeof silenceConsole>;

  beforeEach(() => {
    vi.useFakeTimers();
    consoleSpies = silenceConsole(['warn', 'error']);

    circuitBreaker = new CircuitBreaker('/api/test', {
      failureThreshold: 3,
      successThreshold: 2,
      timeout: 5000,
      monitoringWindow: 10000,
      isErrorRetryable: () => true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    consoleSpies.restore();
  });

  describe('State Transitions', () => {
    it('should start in CLOSED state', () => {
      const metrics = circuitBreaker.getMetrics();
      expect(metrics.state).toBe(CircuitBreakerState.CLOSED);
    });

    it('should transition to OPEN after failure threshold', async () => {
      const failingOperation = vi.fn().mockRejectedValue(new Error('API Error'));

      // Cause failures
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(failingOperation);
        } catch (error) {
          // Expected to fail
        }
      }

      const metrics = circuitBreaker.getMetrics();
      expect(metrics.state).toBe(CircuitBreakerState.OPEN);
    });

    it('should transition to HALF_OPEN after timeout', async () => {
      const failingOperation = vi.fn().mockRejectedValue(new Error('API Error'));

      // Open the circuit
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(failingOperation);
        } catch (error) {}
      }

      expect(circuitBreaker.getMetrics().state).toBe(CircuitBreakerState.OPEN);

      // Advance time past timeout
      vi.advanceTimersByTime(6000);

      // Next request should trigger HALF_OPEN
      const successOperation = vi.fn().mockResolvedValue('success');
      await circuitBreaker.execute(successOperation);

      const metrics = circuitBreaker.getMetrics();
      expect(metrics.state).toBe(CircuitBreakerState.HALF_OPEN);
    });

    it('should transition from HALF_OPEN to CLOSED after success threshold', async () => {
      // Open circuit
      const failingOp = vi.fn().mockRejectedValue(new Error('Fail'));
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(failingOp);
        } catch (error) {}
      }

      // Wait for timeout
      vi.advanceTimersByTime(6000);

      // Execute successful operations
      const successOp = vi.fn().mockResolvedValue('success');
      for (let i = 0; i < 2; i++) {
        await circuitBreaker.execute(successOp);
      }

      const metrics = circuitBreaker.getMetrics();
      expect(metrics.state).toBe(CircuitBreakerState.CLOSED);
    });

    it('should transition from HALF_OPEN back to OPEN on failure', async () => {
      // Open circuit
      const failingOp = vi.fn().mockRejectedValue(new Error('Fail'));
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(failingOp);
        } catch (error) {}
      }

      // Wait for timeout to HALF_OPEN
      vi.advanceTimersByTime(6000);

      // One success to enter HALF_OPEN
      const successOp = vi.fn().mockResolvedValue('success');
      await circuitBreaker.execute(successOp);

      expect(circuitBreaker.getMetrics().state).toBe(CircuitBreakerState.HALF_OPEN);

      // Fail again
      try {
        await circuitBreaker.execute(failingOp);
      } catch (error) {}

      const metrics = circuitBreaker.getMetrics();
      expect(metrics.state).toBe(CircuitBreakerState.OPEN);
    });
  });

  describe('Request Execution', () => {
    it('should execute successful operations', async () => {
      const operation = vi.fn().mockResolvedValue('success');

      const result = await circuitBreaker.execute(operation);

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledOnce();
    });

    it('should reject when circuit is OPEN', async () => {
      const failingOp = vi.fn().mockRejectedValue(new Error('Fail'));

      // Open the circuit
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(failingOp);
        } catch (error) {}
      }

      const operation = vi.fn().mockResolvedValue('success');

      await expect(circuitBreaker.execute(operation)).rejects.toThrow('Circuit breaker is OPEN');
      expect(operation).not.toHaveBeenCalled();
    });

    it('should propagate errors from operations', async () => {
      const error = new Error('Custom error');
      const operation = vi.fn().mockRejectedValue(error);

      await expect(circuitBreaker.execute(operation)).rejects.toThrow('Custom error');
    });

    it('should track request timings', async () => {
      const operation = vi.fn().mockResolvedValue('success');

      await circuitBreaker.execute(operation);

      const metrics = circuitBreaker.getMetrics();
      expect(metrics.averageResponseTime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Metrics', () => {
    it('should track failure count', async () => {
      const failingOp = vi.fn().mockRejectedValue(new Error('Fail'));

      try {
        await circuitBreaker.execute(failingOp);
      } catch (error) {}

      const metrics = circuitBreaker.getMetrics();
      expect(metrics.failureCount).toBe(1);
    });

    it('should track success count', async () => {
      const successOp = vi.fn().mockResolvedValue('success');

      await circuitBreaker.execute(successOp);

      const metrics = circuitBreaker.getMetrics();
      expect(metrics.successCount).toBe(1);
    });

    it('should reset failure count on success', async () => {
      const failingOp = vi.fn().mockRejectedValue(new Error('Fail'));
      const successOp = vi.fn().mockResolvedValue('success');

      try {
        await circuitBreaker.execute(failingOp);
      } catch (error) {}

      expect(circuitBreaker.getMetrics().failureCount).toBe(1);

      await circuitBreaker.execute(successOp);

      expect(circuitBreaker.getMetrics().failureCount).toBe(0);
    });

    it('should calculate average response time', async () => {
      const operation = vi.fn().mockResolvedValue('success');

      await circuitBreaker.execute(operation);
      await circuitBreaker.execute(operation);

      const metrics = circuitBreaker.getMetrics();
      expect(metrics.averageResponseTime).toBeGreaterThanOrEqual(0);
    });

    it('should track last failure and success times', async () => {
      const successOp = vi.fn().mockResolvedValue('success');
      const failingOp = vi.fn().mockRejectedValue(new Error('Fail'));

      await circuitBreaker.execute(successOp);
      expect(circuitBreaker.getMetrics().lastSuccessTime).toBeDefined();

      try {
        await circuitBreaker.execute(failingOp);
      } catch (error) {}

      expect(circuitBreaker.getMetrics().lastFailureTime).toBeDefined();
    });
  });

  describe('Event Listeners', () => {
    it('should emit state change events', async () => {
      const listener = vi.fn();
      circuitBreaker.on(listener);

      const failingOp = vi.fn().mockRejectedValue(new Error('Fail'));

      // Trigger state change to OPEN
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(failingOp);
        } catch (error) {}
      }

      expect(listener).toHaveBeenCalled();
    });

    it('should remove listeners', async () => {
      const listener = vi.fn();
      circuitBreaker.on(listener);
      circuitBreaker.off(listener);

      const failingOp = vi.fn().mockRejectedValue(new Error('Fail'));

      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(failingOp);
        } catch (error) {}
      }

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('Reset', () => {
    it('should reset circuit to CLOSED', async () => {
      const failingOp = vi.fn().mockRejectedValue(new Error('Fail'));

      // Open circuit
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(failingOp);
        } catch (error) {}
      }

      expect(circuitBreaker.getMetrics().state).toBe(CircuitBreakerState.OPEN);

      circuitBreaker.reset();

      expect(circuitBreaker.getMetrics().state).toBe(CircuitBreakerState.CLOSED);
      expect(circuitBreaker.getMetrics().failureCount).toBe(0);
      expect(circuitBreaker.getMetrics().successCount).toBe(0);
    });
  });

  describe('Configuration', () => {
    it('should respect custom failure threshold', async () => {
      const customCB = new CircuitBreaker('/api/custom', {
        failureThreshold: 5,
        successThreshold: 2,
        timeout: 5000,
        monitoringWindow: 10000,
        isErrorRetryable: () => true,
      });

      const failingOp = vi.fn().mockRejectedValue(new Error('Fail'));

      // Should need 5 failures to open
      for (let i = 0; i < 4; i++) {
        try {
          await customCB.execute(failingOp);
        } catch (error) {}
      }

      expect(customCB.getMetrics().state).toBe(CircuitBreakerState.CLOSED);

      try {
        await customCB.execute(failingOp);
      } catch (error) {}

      expect(customCB.getMetrics().state).toBe(CircuitBreakerState.OPEN);
    });

    it('should respect custom timeout', async () => {
      const customCB = new CircuitBreaker('/api/custom', {
        failureThreshold: 3,
        successThreshold: 2,
        timeout: 10000,
        monitoringWindow: 20000,
        isErrorRetryable: () => true,
      });

      const failingOp = vi.fn().mockRejectedValue(new Error('Fail'));

      // Open circuit
      for (let i = 0; i < 3; i++) {
        try {
          await customCB.execute(failingOp);
        } catch (error) {}
      }

      // Advance time less than timeout
      vi.advanceTimersByTime(5000);

      const operation = vi.fn().mockResolvedValue('success');
      await expect(customCB.execute(operation)).rejects.toThrow();

      // Advance past timeout
      vi.advanceTimersByTime(6000);

      await expect(customCB.execute(operation)).resolves.toBe('success');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid consecutive successes', async () => {
      const operation = vi.fn().mockResolvedValue('success');

      for (let i = 0; i < 100; i++) {
        await circuitBreaker.execute(operation);
      }

      const metrics = circuitBreaker.getMetrics();
      expect(metrics.state).toBe(CircuitBreakerState.CLOSED);
      expect(metrics.successCount).toBe(100);
    });

    it('should handle rapid consecutive failures', async () => {
      const operation = vi.fn().mockRejectedValue(new Error('Fail'));

      for (let i = 0; i < 10; i++) {
        try {
          await circuitBreaker.execute(operation);
        } catch (error) {}
      }

      expect(circuitBreaker.getMetrics().state).toBe(CircuitBreakerState.OPEN);
    });

    it('should handle alternating success and failure', async () => {
      const successOp = vi.fn().mockResolvedValue('success');
      const failingOp = vi.fn().mockRejectedValue(new Error('Fail'));

      for (let i = 0; i < 10; i++) {
        await circuitBreaker.execute(successOp);
        try {
          await circuitBreaker.execute(failingOp);
        } catch (error) {}
      }

      // Should remain closed because failures are reset by successes
      expect(circuitBreaker.getMetrics().state).toBe(CircuitBreakerState.CLOSED);
    });

    it('should handle errors without stack trace', async () => {
      const error: any = new Error('No stack');
      delete error.stack;

      const operation = vi.fn().mockRejectedValue(error);

      await expect(circuitBreaker.execute(operation)).rejects.toThrow('No stack');
    });
  });
});
