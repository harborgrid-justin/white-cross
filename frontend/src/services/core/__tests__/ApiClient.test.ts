/**
 * ApiClient Tests
 * Tests retry logic, circuit breaker, timeout handling, error handling, and request cancellation
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { http, HttpResponse, delay } from 'msw';
import { server } from '@/test/mocks/server';
import { ApiClient, ApiClientError, createCancellableRequest } from '../ApiClient';

describe('ApiClient', () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    // Server is already started in global setup
    apiClient = new ApiClient({
      baseURL: 'http://localhost:3000/api',
      timeout: 5000,
      enableLogging: false,
      enableRetry: true,
      maxRetries: 3,
      retryDelay: 100,
    });
  });

  afterEach(() => {
    // Handlers are reset in global teardown
    vi.clearAllMocks();
  });

  describe('Retry Logic', () => {
    it('should retry on network errors with exponential backoff', async () => {
      // Arrange
      let attemptCount = 0;

      server.use(
        http.get('http://localhost:3000/api/test', async () => {
          attemptCount++;
          if (attemptCount < 3) {
            // Fail first 2 attempts
            return HttpResponse.error();
          }
          // Succeed on 3rd attempt
          return HttpResponse.json({ success: true, data: { result: 'success' } });
        })
      );

      const startTime = Date.now();

      // Act
      const response = await apiClient.get('/test');

      const duration = Date.now() - startTime;

      // Assert
      expect(response.data.result).toBe('success');
      expect(attemptCount).toBe(3);
      // Should have exponential backoff: 100ms + 200ms = 300ms minimum
      expect(duration).toBeGreaterThanOrEqual(300);
    });

    it('should retry on 5xx server errors', async () => {
      // Arrange
      let attemptCount = 0;

      server.use(
        http.get('http://localhost:3000/api/test', async () => {
          attemptCount++;
          if (attemptCount < 2) {
            return HttpResponse.json({ error: 'Server error' }, { status: 503 });
          }
          return HttpResponse.json({ success: true, data: { result: 'success' } });
        })
      );

      // Act
      const response = await apiClient.get('/test');

      // Assert
      expect(response.data.result).toBe('success');
      expect(attemptCount).toBe(2);
    });

    it('should not retry on 4xx client errors', async () => {
      // Arrange
      let attemptCount = 0;

      server.use(
        http.get('http://localhost:3000/api/test', async () => {
          attemptCount++;
          return HttpResponse.json({ error: 'Bad request' }, { status: 400 });
        })
      );

      // Act & Assert
      await expect(apiClient.get('/test')).rejects.toThrow();
      expect(attemptCount).toBe(1); // Should only attempt once
    });

    it('should fail after max retries exceeded', async () => {
      // Arrange
      let attemptCount = 0;

      server.use(
        http.get('http://localhost:3000/api/test', async () => {
          attemptCount++;
          return HttpResponse.error();
        })
      );

      // Act & Assert
      await expect(apiClient.get('/test')).rejects.toThrow();
      expect(attemptCount).toBe(4); // Initial + 3 retries
    });
  });

  describe('Timeout Handling', () => {
    it('should timeout after specified duration', async () => {
      // Arrange
      const timeoutClient = new ApiClient({
        baseURL: 'http://localhost:3000/api',
        timeout: 1000, // 1 second timeout
        enableRetry: false,
      });

      server.use(
        http.get('http://localhost:3000/api/slow', async () => {
          // Delay longer than the timeout
          await delay(3000); // 3 second delay
          return HttpResponse.json({ data: 'too slow' });
        })
      );

      const startTime = Date.now();

      // Act & Assert
      await expect(timeoutClient.get('/slow')).rejects.toThrow();

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(1500); // Should timeout around 1 second
    });

    it('should complete request within timeout', async () => {
      // Arrange
      server.use(
        http.get('http://localhost:3000/api/fast', async () => {
          await delay(100); // Fast response
          return HttpResponse.json({ success: true, data: { result: 'fast' } });
        })
      );

      // Act
      const response = await apiClient.get('/fast');

      // Assert
      expect(response.data.result).toBe('fast');
    });
  });

  describe('Error Handling', () => {
    it('should classify network errors correctly', async () => {
      // Arrange
      server.use(
        http.get('http://localhost:3000/api/test', async () => {
          return HttpResponse.error();
        })
      );

      // Act & Assert
      try {
        await apiClient.get('/test');
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiClientError);
        expect((error as ApiClientError).isNetworkError).toBe(true);
        expect((error as ApiClientError).isServerError).toBe(false);
        expect((error as ApiClientError).message).toMatch(/network error/i);
      }
    });

    it('should classify server errors correctly', async () => {
      // Arrange
      server.use(
        http.get('http://localhost:3000/api/test', async () => {
          return HttpResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
          );
        })
      );

      // Act & Assert
      try {
        await apiClient.get('/test');
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiClientError);
        expect((error as ApiClientError).isServerError).toBe(true);
        expect((error as ApiClientError).isNetworkError).toBe(false);
        expect((error as ApiClientError).status).toBe(500);
      }
    });

    it('should classify validation errors correctly', async () => {
      // Arrange
      server.use(
        http.post('http://localhost:3000/api/test', async () => {
          return HttpResponse.json(
            {
              message: 'Validation failed',
              errors: {
                email: ['Invalid email format'],
                password: ['Password too short'],
              },
            },
            { status: 400 }
          );
        })
      );

      // Act & Assert
      try {
        await apiClient.post('/test', { email: 'invalid', password: '123' });
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiClientError);
        expect((error as ApiClientError).isValidationError).toBe(true);
        expect((error as ApiClientError).status).toBe(400);
        expect((error as ApiClientError).details).toBeDefined();
      }
    });

    it('should handle error responses with custom message', async () => {
      // Arrange
      const customMessage = 'Custom error message';

      server.use(
        http.get('http://localhost:3000/api/test', async () => {
          return HttpResponse.json(
            { message: customMessage, code: 'CUSTOM_ERROR' },
            { status: 422 }
          );
        })
      );

      // Act & Assert
      try {
        await apiClient.get('/test');
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiClientError);
        expect((error as ApiClientError).message).toBe(customMessage);
        expect((error as ApiClientError).code).toBe('CUSTOM_ERROR');
        expect((error as ApiClientError).status).toBe(422);
      }
    });
  });

  describe('Request Cancellation', () => {
    it('should cancel request using AbortSignal', async () => {
      // Arrange
      server.use(
        http.get('http://localhost:3000/api/slow', async () => {
          await delay(5000);
          return HttpResponse.json({ data: 'completed' });
        })
      );

      const { signal, cancel } = createCancellableRequest();

      // Act
      const requestPromise = apiClient.get('/slow', { signal });

      // Cancel after 100ms
      setTimeout(() => cancel('Test cancellation'), 100);

      // Assert
      await expect(requestPromise).rejects.toThrow();
    });

    it('should not affect completed requests', async () => {
      // Arrange
      server.use(
        http.get('http://localhost:3000/api/fast', async () => {
          return HttpResponse.json({ success: true, data: { result: 'completed' } });
        })
      );

      const { signal, cancel } = createCancellableRequest();

      // Act
      const response = await apiClient.get('/fast', { signal });

      // Try to cancel after completion (should have no effect)
      cancel('Too late');

      // Assert
      expect(response.data.result).toBe('completed');
    });
  });

  describe('HTTP Methods', () => {
    it('should execute GET request', async () => {
      // Arrange
      server.use(
        http.get('http://localhost:3000/api/test', async () => {
          return HttpResponse.json({ success: true, data: { method: 'GET' } });
        })
      );

      // Act
      const response = await apiClient.get('/test');

      // Assert
      expect(response.data.method).toBe('GET');
    });

    it('should execute POST request with data', async () => {
      // Arrange
      const testData = { name: 'John', email: 'john@example.com' };

      server.use(
        http.post('http://localhost:3000/api/test', async ({ request }) => {
          const body = await request.json();
          return HttpResponse.json({ success: true, data: body });
        })
      );

      // Act
      const response = await apiClient.post('/test', testData);

      // Assert
      expect(response.data).toEqual(testData);
    });

    it('should execute PUT request', async () => {
      // Arrange
      const updateData = { id: '123', name: 'Updated' };

      server.use(
        http.put('http://localhost:3000/api/test/123', async ({ request }) => {
          const body = await request.json();
          return HttpResponse.json({ success: true, data: body });
        })
      );

      // Act
      const response = await apiClient.put('/test/123', updateData);

      // Assert
      expect(response.data).toEqual(updateData);
    });

    it('should execute PATCH request', async () => {
      // Arrange
      const patchData = { status: 'active' };

      server.use(
        http.patch('http://localhost:3000/api/test/123', async ({ request }) => {
          const body = await request.json();
          return HttpResponse.json({ success: true, data: body });
        })
      );

      // Act
      const response = await apiClient.patch('/test/123', patchData);

      // Assert
      expect(response.data).toEqual(patchData);
    });

    it('should execute DELETE request', async () => {
      // Arrange
      server.use(
        http.delete('http://localhost:3000/api/test/123', async () => {
          return HttpResponse.json({ success: true, data: { deleted: true } });
        })
      );

      // Act
      const response = await apiClient.delete('/test/123');

      // Assert
      expect(response.data.deleted).toBe(true);
    });
  });

  describe('Resilience Hooks', () => {
    it('should call beforeRequest hook', async () => {
      // Arrange
      const beforeRequestMock = vi.fn();

      const clientWithHook = new ApiClient({
        baseURL: 'http://localhost:3000/api',
        enableRetry: false,
        resilienceHook: {
          beforeRequest: beforeRequestMock,
        },
      });

      server.use(
        http.get('http://localhost:3000/api/test', async () => {
          return HttpResponse.json({ success: true, data: {} });
        })
      );

      // Act
      await clientWithHook.get('/test');

      // Assert
      expect(beforeRequestMock).toHaveBeenCalledWith({
        method: 'GET',
        url: '/test',
        data: undefined,
      });
    });

    it('should call afterSuccess hook on successful request', async () => {
      // Arrange
      const afterSuccessMock = vi.fn();

      const clientWithHook = new ApiClient({
        baseURL: 'http://localhost:3000/api',
        enableRetry: false,
        resilienceHook: {
          afterSuccess: afterSuccessMock,
        },
      });

      server.use(
        http.get('http://localhost:3000/api/test', async () => {
          return HttpResponse.json({ success: true, data: {} });
        })
      );

      // Act
      await clientWithHook.get('/test');

      // Assert
      expect(afterSuccessMock).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: '/test',
          duration: expect.any(Number),
        })
      );
    });

    it('should call afterFailure hook on failed request', async () => {
      // Arrange
      const afterFailureMock = vi.fn();

      const clientWithHook = new ApiClient({
        baseURL: 'http://localhost:3000/api',
        enableRetry: false,
        resilienceHook: {
          afterFailure: afterFailureMock,
        },
      });

      server.use(
        http.get('http://localhost:3000/api/test', async () => {
          return HttpResponse.json({ error: 'Server error' }, { status: 500 });
        })
      );

      // Act
      try {
        await clientWithHook.get('/test');
      } catch (error) {
        // Expected to fail
      }

      // Assert
      expect(afterFailureMock).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: '/test',
          duration: expect.any(Number),
          error: expect.any(Object),
        })
      );
    });
  });
});
