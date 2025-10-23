/**
 * @fileoverview Event Bus Unit Tests
 * @module services/domain/__tests__/EventBus.test
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EventBus, DomainEvent } from '../events/EventBus';

// Test event class
class TestEvent extends DomainEvent {
  constructor(public readonly data: string, timestamp: Date = new Date()) {
    super('TestEvent', timestamp);
  }
}

describe('EventBus', () => {
  let eventBus: EventBus;

  beforeEach(() => {
    eventBus = EventBus.getInstance();
    eventBus.reset();
  });

  describe('publish and subscribe', () => {
    it('should publish and receive events', async () => {
      const handler = vi.fn();
      eventBus.subscribe('TestEvent', handler);

      const event = new TestEvent('test data');
      await eventBus.publish(event);

      expect(handler).toHaveBeenCalledWith(event);
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should support multiple subscribers', async () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      
      eventBus.subscribe('TestEvent', handler1);
      eventBus.subscribe('TestEvent', handler2);

      const event = new TestEvent('test data');
      await eventBus.publish(event);

      expect(handler1).toHaveBeenCalledWith(event);
      expect(handler2).toHaveBeenCalledWith(event);
    });

    it('should respect priority order', async () => {
      const order: number[] = [];
      
      eventBus.subscribe('TestEvent', async () => { order.push(1); }, 1);
      eventBus.subscribe('TestEvent', async () => { order.push(3); }, 3);
      eventBus.subscribe('TestEvent', async () => { order.push(2); }, 2);

      const event = new TestEvent('test data');
      await eventBus.publish(event);

      expect(order).toEqual([3, 2, 1]); // Higher priority first
    });

    it('should support once subscription', async () => {
      const handler = vi.fn();
      eventBus.once('TestEvent', handler);

      const event1 = new TestEvent('data1');
      const event2 = new TestEvent('data2');
      
      await eventBus.publish(event1);
      await eventBus.publish(event2);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(event1);
    });
  });

  describe('unsubscribe', () => {
    it('should unsubscribe handler', async () => {
      const handler = vi.fn();
      const unsubscribe = eventBus.subscribe('TestEvent', handler);

      const event1 = new TestEvent('data1');
      await eventBus.publish(event1);
      
      expect(handler).toHaveBeenCalledTimes(1);

      unsubscribe();

      const event2 = new TestEvent('data2');
      await eventBus.publish(event2);
      
      expect(handler).toHaveBeenCalledTimes(1); // Not called again
    });
  });

  describe('error handling', () => {
    it('should isolate handler errors', async () => {
      const handler1 = vi.fn(() => { throw new Error('Handler 1 failed'); });
      const handler2 = vi.fn();
      
      eventBus.subscribe('TestEvent', handler1);
      eventBus.subscribe('TestEvent', handler2);

      const event = new TestEvent('test data');
      await eventBus.publish(event);

      // Handler 2 should still be called despite handler 1 throwing
      expect(handler2).toHaveBeenCalledWith(event);
    });
  });

  describe('event history', () => {
    it('should store event history', async () => {
      const event1 = new TestEvent('data1');
      const event2 = new TestEvent('data2');
      
      await eventBus.publish(event1);
      await eventBus.publish(event2);

      const history = eventBus.getHistory();
      expect(history).toHaveLength(2);
      expect(history[0]).toBe(event1);
      expect(history[1]).toBe(event2);
    });

    it('should filter history by event type', async () => {
      class Event1 extends DomainEvent {
        constructor() { super('Event1'); }
      }
      class Event2 extends DomainEvent {
        constructor() { super('Event2'); }
      }

      await eventBus.publish(new Event1());
      await eventBus.publish(new Event2());
      await eventBus.publish(new Event1());

      const event1History = eventBus.getHistory('Event1');
      expect(event1History).toHaveLength(2);
    });

    it('should clear history', async () => {
      await eventBus.publish(new TestEvent('data'));
      expect(eventBus.getHistory()).toHaveLength(1);

      eventBus.clearHistory();
      expect(eventBus.getHistory()).toHaveLength(0);
    });
  });

  describe('metrics', () => {
    it('should track published events', async () => {
      await eventBus.publish(new TestEvent('data1'));
      await eventBus.publish(new TestEvent('data2'));

      const metrics = eventBus.getMetrics();
      expect(metrics.totalPublished).toBe(2);
      expect(metrics.eventCounts['TestEvent']).toBe(2);
    });

    it('should track failed events', async () => {
      const handler = vi.fn(() => { throw new Error('Failed'); });
      eventBus.subscribe('TestEvent', handler);

      await eventBus.publish(new TestEvent('data'));

      const metrics = eventBus.getMetrics();
      expect(metrics.failedEvents).toBe(1);
    });
  });

  describe('utility methods', () => {
    it('should check for subscribers', () => {
      expect(eventBus.hasSubscribers('TestEvent')).toBe(false);
      
      eventBus.subscribe('TestEvent', vi.fn());
      
      expect(eventBus.hasSubscribers('TestEvent')).toBe(true);
    });

    it('should get subscription count', () => {
      eventBus.subscribe('TestEvent', vi.fn());
      eventBus.subscribe('TestEvent', vi.fn());

      expect(eventBus.getSubscriptionCount('TestEvent')).toBe(2);
    });

    it('should get all event types', () => {
      eventBus.subscribe('Event1', vi.fn());
      eventBus.subscribe('Event2', vi.fn());

      const types = eventBus.getEventTypes();
      expect(types).toContain('Event1');
      expect(types).toContain('Event2');
    });
  });
});
