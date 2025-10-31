/**
 * @fileoverview Performance utility functions
 * @module utils/performance
 */

/**
 * Debounce function to limit the rate at which a function can fire
 */
export function debounce<T extends (...args: any[]) => any>(
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
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
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
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = func(...args);
    cache.set(key, result);
    
    return result;
  }) as T;
}

/**
 * Create a function that can only be called once
 */
export function once<T extends (...args: any[]) => any>(func: T): T {
  let called = false;
  let result: ReturnType<T>;
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    if (!called) {
      called = true;
      result = func(...args);
    }
    return result;
  }) as T;
}

/**
 * Measure function execution time
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  func: T,
  label?: string
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    const startTime = performance.now();
    const result = func(...args);
    const endTime = performance.now();
    
    const executionTime = endTime - startTime;
    const functionName = label || func.name || 'anonymous';
    
    console.log(`${functionName} executed in ${executionTime.toFixed(2)}ms`);
    
    return result;
  }) as T;
}

/**
 * Async debounce for promise-returning functions
 */
export function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeout: NodeJS.Timeout | null = null;
  let resolveList: Array<(value: ReturnType<T>) => void> = [];
  let rejectList: Array<(reason: any) => void> = [];
  
  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise<ReturnType<T>>((resolve, reject) => {
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
          currentResolveList.forEach(resolve => resolve(result));
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
export function batchCalls<T extends (...args: any[]) => any>(
  func: T,
  batchSize: number = 10,
  delay: number = 100
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let batch: Array<{
    args: Parameters<T>;
    resolve: (value: ReturnType<T>) => void;
    reject: (reason: any) => void;
  }> = [];
  let timeout: NodeJS.Timeout | null = null;
  
  const executeBatch = async () => {
    const currentBatch = [...batch];
    batch = [];
    
    for (const item of currentBatch) {
      try {
        const result = await func(...item.args);
        item.resolve(result);
      } catch (error) {
        item.reject(error);
      }
    }
  };
  
  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise<ReturnType<T>>((resolve, reject) => {
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
