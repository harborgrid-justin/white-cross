import {
  promiseWithTimeout,
  promiseWithRetry,
  promiseWithFallback,
  promiseDefer,
  promiseMemoize,
  promiseReflect,
  asyncTryCatch,
  asyncMap,
  asyncForEach,
  asyncFilter,
  asyncReduce,
  raceWithTimeout,
  allWithTimeout,
  allSettledWithTimeout,
  anyWithTimeout,
  raceWithDefault,
  asyncDebounce,
  asyncThrottle,
  asyncDebounceLeading,
  asyncThrottleTrailing,
  createAsyncQueue,
  asyncQueuePush,
  asyncQueueProcess,
  asyncQueueDrain,
  asyncIteratorMap,
  asyncIteratorFilter,
  asyncIteratorTake,
  asyncIteratorToArray,
  createAsyncEventEmitter,
  asyncEmit,
  asyncOn,
  createPubSub,
  pubSubPublish,
  createMiddlewareChain,
  executeMiddleware,
  asyncWaterfall,
  asyncWaterfallWithContext,
  sequentialExecutor,
  parallelCoordinator,
  createAsyncResourcePool,
} from './async-coordination.service';

describe('Async Coordination Service', () => {
  describe('promiseWithTimeout', () => {
    it('should resolve if promise completes before timeout', async () => {
      const result = await promiseWithTimeout(Promise.resolve(42), 1000);
      expect(result).toBe(42);
    });

    it('should reject with timeout error if promise exceeds timeout', async () => {
      const slowPromise = new Promise((resolve) => setTimeout(() => resolve(42), 2000));
      await expect(promiseWithTimeout(slowPromise, 100, 'Test timeout')).rejects.toThrow('Test timeout');
    });

    it('should throw error if timeout is <= 0', async () => {
      await expect(promiseWithTimeout(Promise.resolve(42), 0)).rejects.toThrow(
        'Timeout must be greater than 0',
      );
    });
  });

  describe('promiseWithRetry', () => {
    it('should succeed on first attempt', async () => {
      const fn = jest.fn().mockResolvedValue(42);
      const result = await promiseWithRetry(fn, 3);
      expect(result).toBe(42);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and eventually succeed', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error('Fail 1'))
        .mockRejectedValueOnce(new Error('Fail 2'))
        .mockResolvedValue(42);
      const result = await promiseWithRetry(fn, 3, 10);
      expect(result).toBe(42);
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should throw after max retries', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('Always fails'));
      await expect(promiseWithRetry(fn, 2, 10)).rejects.toThrow('Failed after 3 attempts');
    });
  });

  describe('promiseWithFallback', () => {
    it('should return result on success', async () => {
      const result = await promiseWithFallback(Promise.resolve(42), 0);
      expect(result).toBe(42);
    });

    it('should return fallback on error', async () => {
      const result = await promiseWithFallback(Promise.reject(new Error('Fail')), 100);
      expect(result).toBe(100);
    });
  });

  describe('promiseDefer', () => {
    it('should create deferred promise that can be resolved externally', async () => {
      const deferred = promiseDefer<number>();
      setTimeout(() => deferred.resolve(42), 10);
      const result = await deferred.promise;
      expect(result).toBe(42);
    });

    it('should create deferred promise that can be rejected externally', async () => {
      const deferred = promiseDefer<number>();
      setTimeout(() => deferred.reject(new Error('Test error')), 10);
      await expect(deferred.promise).rejects.toThrow('Test error');
    });
  });

  describe('promiseMemoize', () => {
    it('should cache results', async () => {
      const fn = jest.fn().mockResolvedValue(42);
      const memoized = promiseMemoize(fn);

      const result1 = await memoized('key1');
      const result2 = await memoized('key1');

      expect(result1).toBe(42);
      expect(result2).toBe(42);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should respect TTL', async () => {
      const fn = jest.fn().mockResolvedValue(42);
      const memoized = promiseMemoize(fn, (x: string) => x, 50);

      await memoized('key1');
      await new Promise(resolve => setTimeout(resolve, 100));
      await memoized('key1');

      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('promiseReflect', () => {
    it('should reflect fulfilled promise', async () => {
      const result = await promiseReflect(Promise.resolve(42));
      expect(result).toEqual({ status: 'fulfilled', value: 42 });
    });

    it('should reflect rejected promise', async () => {
      const error = new Error('Test error');
      const result = await promiseReflect(Promise.reject(error));
      expect(result).toEqual({ status: 'rejected', reason: error });
    });
  });

  describe('asyncTryCatch', () => {
    it('should return result on success', async () => {
      const [error, result] = await asyncTryCatch(async () => 42);
      expect(error).toBeNull();
      expect(result).toBe(42);
    });

    it('should return error on failure', async () => {
      const testError = new Error('Test error');
      const [error, result] = await asyncTryCatch(async () => {
        throw testError;
      });
      expect(error).toBe(testError);
      expect(result).toBeNull();
    });
  });

  describe('asyncMap', () => {
    it('should map array sequentially', async () => {
      const result = await asyncMap([1, 2, 3], async (n) => n * 2);
      expect(result).toEqual([2, 4, 6]);
    });
  });

  describe('asyncForEach', () => {
    it('should iterate array sequentially', async () => {
      const results: number[] = [];
      await asyncForEach([1, 2, 3], async (n) => {
        results.push(n * 2);
      });
      expect(results).toEqual([2, 4, 6]);
    });
  });

  describe('asyncFilter', () => {
    it('should filter array based on async predicate', async () => {
      const result = await asyncFilter([1, 2, 3, 4], async (n) => n % 2 === 0);
      expect(result).toEqual([2, 4]);
    });
  });

  describe('asyncReduce', () => {
    it('should reduce array with async reducer', async () => {
      const result = await asyncReduce([1, 2, 3], async (acc, n) => acc + n, 0);
      expect(result).toBe(6);
    });
  });

  describe('raceWithTimeout', () => {
    it('should resolve with fastest promise', async () => {
      const result = await raceWithTimeout([Promise.resolve(1), Promise.resolve(2)], 1000);
      expect(result).toBe(1);
    });

    it('should throw on empty array', async () => {
      await expect(raceWithTimeout([], 1000)).rejects.toThrow('Cannot race empty array');
    });
  });

  describe('allWithTimeout', () => {
    it('should resolve all promises', async () => {
      const result = await allWithTimeout([Promise.resolve(1), Promise.resolve(2)], 1000);
      expect(result).toEqual([1, 2]);
    });
  });

  describe('asyncDebounce', () => {
    jest.useFakeTimers();

    it('should debounce async function calls', async () => {
      const fn = jest.fn().mockResolvedValue(42);
      const debounced = asyncDebounce(fn, 100);

      debounced('test');
      debounced('test');
      debounced('test');

      jest.advanceTimersByTime(100);
      await Promise.resolve();

      expect(fn).toHaveBeenCalledTimes(1);
    });

    jest.useRealTimers();
  });

  describe('createAsyncQueue', () => {
    it('should process items with concurrency limit', async () => {
      const processor = jest.fn().mockImplementation(async (n: number) => n * 2);
      const queue = createAsyncQueue(processor, 2);

      const results = await Promise.all([queue.push(1), queue.push(2), queue.push(3)]);

      expect(results).toEqual([2, 4, 6]);
      expect(queue.size()).toBe(0);
    });

    it('should drain queue', async () => {
      const processor = jest.fn().mockImplementation(async (n: number) => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return n * 2;
      });
      const queue = createAsyncQueue(processor, 1);

      queue.push(1);
      queue.push(2);

      await queue.drain();
      expect(queue.size()).toBe(0);
    });
  });

  describe('async iterators', () => {
    async function* createAsyncIterable(items: number[]) {
      for (const item of items) {
        yield item;
      }
    }

    it('should map async iterator', async () => {
      const iterable = createAsyncIterable([1, 2, 3]);
      const mapped = asyncIteratorMap(iterable, async (n) => n * 2);
      const result = await asyncIteratorToArray(mapped);
      expect(result).toEqual([2, 4, 6]);
    });

    it('should filter async iterator', async () => {
      const iterable = createAsyncIterable([1, 2, 3, 4]);
      const filtered = asyncIteratorFilter(iterable, async (n) => n % 2 === 0);
      const result = await asyncIteratorToArray(filtered);
      expect(result).toEqual([2, 4]);
    });

    it('should take from async iterator', async () => {
      const iterable = createAsyncIterable([1, 2, 3, 4, 5]);
      const taken = asyncIteratorTake(iterable, 3);
      const result = await asyncIteratorToArray(taken);
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe('createAsyncEventEmitter', () => {
    it('should emit and listen to events', async () => {
      const emitter = createAsyncEventEmitter();
      const handler = jest.fn().mockResolvedValue(undefined);

      emitter.on('test', handler);
      await emitter.emit('test', 'data');

      expect(handler).toHaveBeenCalledWith('data');
    });

    it('should support once listeners', async () => {
      const emitter = createAsyncEventEmitter();
      const handler = jest.fn().mockResolvedValue(undefined);

      emitter.once('test', handler);
      await emitter.emit('test', 'data1');
      await emitter.emit('test', 'data2');

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('createPubSub', () => {
    it('should publish and subscribe to topics', async () => {
      const pubsub = createPubSub<string>();
      const handler = jest.fn().mockResolvedValue(undefined);

      pubsub.subscribe('topic1', handler);
      await pubsub.publish('topic1', 'message');

      expect(handler).toHaveBeenCalledWith('message');
    });

    it('should unsubscribe from topics', async () => {
      const pubsub = createPubSub<string>();
      const handler = jest.fn().mockResolvedValue(undefined);

      const subscription = pubsub.subscribe('topic1', handler);
      subscription.unsubscribe();
      await pubsub.publish('topic1', 'message');

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('createMiddlewareChain', () => {
    it('should execute middleware in order', async () => {
      const order: number[] = [];
      const middleware1 = async (ctx: Record<string, unknown>, next: () => Promise<void>) => {
        order.push(1);
        await next();
        order.push(4);
      };
      const middleware2 = async (ctx: Record<string, unknown>, next: () => Promise<void>) => {
        order.push(2);
        await next();
        order.push(3);
      };

      const chain = createMiddlewareChain([middleware1, middleware2]);
      await chain({});

      expect(order).toEqual([1, 2, 3, 4]);
    });
  });

  describe('asyncWaterfall', () => {
    it('should execute tasks in waterfall pattern', async () => {
      const result = await asyncWaterfall(
        [async (val: number) => val + 1, async (val: number) => val * 2, async (val: number) => val - 3],
        10,
      );
      expect(result).toBe(19); // (10 + 1) * 2 - 3
    });
  });

  describe('sequentialExecutor', () => {
    it('should execute tasks sequentially', async () => {
      const order: number[] = [];
      const results = await sequentialExecutor([
        async () => {
          order.push(1);
          return 1;
        },
        async () => {
          order.push(2);
          return 2;
        },
      ]);

      expect(results).toEqual([1, 2]);
      expect(order).toEqual([1, 2]);
    });
  });

  describe('parallelCoordinator', () => {
    it('should coordinate parallel tasks with dependencies', async () => {
      const tasks = new Map<string, { fn: (results: Map<string, number>) => Promise<number>; deps: string[] }>();

      tasks.set('a', { fn: async () => 1, deps: [] });
      tasks.set('b', { fn: async () => 2, deps: [] });
      tasks.set('c', {
        fn: async (results) => (results.get('a') || 0) + (results.get('b') || 0),
        deps: ['a', 'b'],
      });

      const results = await parallelCoordinator(tasks);

      expect(results.get('a')).toBe(1);
      expect(results.get('b')).toBe(2);
      expect(results.get('c')).toBe(3);
    });
  });

  describe('createAsyncResourcePool', () => {
    it('should create and manage resource pool', async () => {
      let counter = 0;
      const factory = async () => ({ id: ++counter });
      const pool = createAsyncResourcePool(factory, 5);

      const resource1 = await pool.acquire();
      const resource2 = await pool.acquire();

      expect(resource1.id).toBe(1);
      expect(resource2.id).toBe(2);
      expect(pool.size()).toBe(2);

      pool.release(resource1);
      expect(pool.available()).toBe(1);

      await pool.drain();
    });
  });
});
