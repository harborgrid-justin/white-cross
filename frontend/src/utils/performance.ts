/**
 * @fileoverview Performance utility functions
 * @module utils/performance
 */

/**
 * Debounce function to limit the rate at which a function can fire
 */
export function debounce<T extends (...args: readonly unknown[]) => unknown>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

/**
 * Throttle function to limit the rate at which a function can fire
 */
export function throttle<T extends (...args: readonly unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Memoize function to cache function results
 */
export function memoize<TFunc extends (...args: readonly unknown[]) => unknown>(
  func: TFunc,
  getKey?: (...args: Parameters<TFunc>) => string
): TFunc {
  const cache = new Map<string, ReturnType<TFunc>>();
  
  return ((...args: Parameters<TFunc>): ReturnType<TFunc> => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = func(...args) as ReturnType<TFunc>;
    cache.set(key, result);
    
    return result;
  }) as TFunc;
}

/**
 * Create a function that can only be called once
 */
export function once<TFunc extends (...args: readonly unknown[]) => unknown>(func: TFunc): TFunc {
  let called = false;
  let result: ReturnType<TFunc>;
  
  return ((...args: Parameters<TFunc>): ReturnType<TFunc> => {
    if (!called) {
      called = true;
      result = func(...args) as ReturnType<TFunc>;
    }
    return result!;
  }) as TFunc;
}

/**
 * Measure function execution time
 */
export function measurePerformance<TFunc extends (...args: readonly unknown[]) => unknown>(
  func: TFunc,
  label?: string
): TFunc {
  return ((...args: Parameters<TFunc>): ReturnType<TFunc> => {
    const startTime = performance.now();
    const result = func(...args) as ReturnType<TFunc>;
    const endTime = performance.now();
    
    const executionTime = endTime - startTime;
    const functionName = label || func.name || 'anonymous';
    
    console.log(`${functionName} executed in ${executionTime.toFixed(2)}ms`);
    
    return result;
  }) as TFunc;
}

/**
 * Async debounce for promise-returning functions
 */
export function debounceAsync<TFunc extends (...args: readonly unknown[]) => Promise<unknown>>(
  func: TFunc,
  wait: number
): (...args: Parameters<TFunc>) => Promise<ReturnType<TFunc>> {
  let timeout: NodeJS.Timeout | null = null;
  let resolveList: Array<(value: ReturnType<TFunc>) => void> = [];
  let rejectList: Array<(reason: unknown) => void> = [];
  
  return (...args: Parameters<TFunc>): Promise<ReturnType<TFunc>> => {
    return new Promise<ReturnType<TFunc>>((resolve, reject) => {
      resolveList.push(resolve);
      rejectList.push(reject);
      
      if (timeout) {
        clearTimeout(timeout);
      }
      
      timeout = setTimeout(async () => {
        const currentResolveList = [...resolveList];
        const currentRejectList = [...rejectList];
        
        resolveList = [];
        rejectList = [];
        
        try {
          const result = await func(...args);
          currentResolveList.forEach(resolve => resolve(result as ReturnType<TFunc>));
        } catch (error) {
          currentRejectList.forEach(reject => reject(error));
        }
      }, wait);
    });
  };
}

/**
 * Batch function calls and execute them together
 */
export function batchCalls<TFunc extends (...args: readonly unknown[]) => unknown>(
  func: TFunc,
  batchSize: number = 10,
  delay: number = 100
): (...args: Parameters<TFunc>) => Promise<ReturnType<TFunc>> {
  let batch: Array<{
    args: Parameters<TFunc>;
    resolve: (value: ReturnType<TFunc>) => void;
    reject: (reason: unknown) => void;
  }> = [];
  let timeout: NodeJS.Timeout | null = null;
  
  const executeBatch = async () => {
    const currentBatch = [...batch];
    batch = [];
    
    for (const item of currentBatch) {
      try {
        const result = await func(...item.args);
        item.resolve(result as ReturnType<TFunc>);
      } catch (error) {
        item.reject(error);
      }
    }
  };
  
  return (...args: Parameters<TFunc>): Promise<ReturnType<TFunc>> => {
    return new Promise<ReturnType<TFunc>>((resolve, reject) => {
      batch.push({ args, resolve, reject });
      
      if (batch.length >= batchSize) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        executeBatch();
      } else if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          executeBatch();
        }, delay);
      }
    });
  };
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  func: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  maxDelay: number = 10000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await func();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}
