/**
 * @fileoverview Request cancellation utilities for API Client
 * @module services/core/ApiClient.cancellation
 * @category Services
 *
 * Provides utilities for cancelling in-flight HTTP requests:
 * - AbortController-based cancellation
 * - Easy integration with React useEffect cleanup
 * - Graceful handling of cancelled requests
 */

// ==========================================
// REQUEST CANCELLATION
// ==========================================

/**
 * Cancellable request handle
 *
 * Provides both the AbortSignal for request configuration
 * and a cancel function for easy cancellation.
 */
export interface CancellableRequest {
  /** AbortSignal to pass to request config */
  signal: AbortSignal;
  /** Cancel function to abort the request */
  cancel: (reason?: string) => void;
}

/**
 * Create a cancellable request with AbortController
 *
 * Provides easy-to-use request cancellation for long-running operations.
 * Useful for cleanup in React useEffect hooks or when users navigate away.
 *
 * @returns Object with signal for request config and cancel function
 *
 * @example
 * ```typescript
 * // In a React component
 * useEffect(() => {
 *   const { signal, cancel } = createCancellableRequest();
 *
 *   const fetchData = async () => {
 *     try {
 *       const data = await apiClient.get('/students', { signal });
 *       setStudents(data.data);
 *     } catch (error) {
 *       if (error.name === 'AbortError') {
 *         console.log('Request was cancelled');
 *       } else {
 *         console.error('Request failed:', error);
 *       }
 *     }
 *   };
 *
 *   fetchData();
 *
 *   // Cleanup: cancel request when component unmounts
 *   return () => cancel('Component unmounted');
 * }, []);
 * ```
 *
 * @example
 * ```typescript
 * // Cancel after timeout
 * const { signal, cancel } = createCancellableRequest();
 *
 * setTimeout(() => {
 *   cancel('Request timeout');
 * }, 5000);
 *
 * try {
 *   const data = await apiClient.get('/slow-endpoint', { signal });
 * } catch (error) {
 *   if (error.name === 'AbortError') {
 *     console.log('Request was cancelled due to timeout');
 *   }
 * }
 * ```
 */
export function createCancellableRequest(): CancellableRequest {
  const controller = new AbortController();

  return {
    signal: controller.signal,
    cancel: (reason?: string) => {
      controller.abort(reason);
    },
  };
}
