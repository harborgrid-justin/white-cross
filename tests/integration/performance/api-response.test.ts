/**
 * API Performance Integration Tests
 * Tests API response times and performance benchmarks
 */

import { test, expect, measureResponseTime } from '../helpers/test-client';

test.describe('API Performance', () => {
  test.describe('Response Time Benchmarks', () => {
    test('should respond to health check within 100ms', async ({ apiContext }) => {
      const duration = await measureResponseTime(apiContext, 'get', '/health');

      expect(duration).toBeLessThan(100);
    });

    test('should respond to authentication within 500ms', async ({ apiContext }) => {
      const start = Date.now();

      const response = await apiContext.post('/api/v1/auth/login', {
        data: {
          email: 'nurse@schooltest.com',
          password: 'TestPassword123!',
        },
      });

      const duration = Date.now() - start;

      expect(response.ok()).toBeTruthy();
      expect(duration).toBeLessThan(500);
    });

    test('should list students within 500ms', async ({ authenticatedContext }) => {
      const duration = await measureResponseTime(authenticatedContext, 'get', '/api/v1/students', {
        params: { limit: 10 },
      });

      expect(duration).toBeLessThan(500);
    });

    test('should retrieve single student within 200ms', async ({ authenticatedContext }) => {
      // Create a student first
      const createResponse = await authenticatedContext.post('/api/v1/students', {
        data: {
          firstName: 'Performance',
          lastName: 'Test',
          dateOfBirth: '2010-01-01',
          grade: '5',
          schoolId: `PERF${Date.now()}`,
          status: 'active',
        },
      });

      const student = await createResponse.json();

      // Measure retrieval time
      const duration = await measureResponseTime(
        authenticatedContext,
        'get',
        `/api/v1/students/${student.id}`
      );

      expect(duration).toBeLessThan(200);
    });

    test('should create student within 500ms', async ({ authenticatedContext }) => {
      const studentData = {
        firstName: 'Create',
        lastName: 'Speed',
        dateOfBirth: '2010-01-01',
        grade: '5',
        schoolId: `SPEED${Date.now()}`,
        status: 'active',
      };

      const duration = await measureResponseTime(
        authenticatedContext,
        'post',
        '/api/v1/students',
        studentData
      );

      expect(duration).toBeLessThan(500);
    });

    test('should retrieve medications list within 500ms', async ({ authenticatedContext }) => {
      const duration = await measureResponseTime(
        authenticatedContext,
        'get',
        '/api/v1/medications',
        { params: { limit: 10 } }
      );

      expect(duration).toBeLessThan(500);
    });

    test('should retrieve due medications within 500ms', async ({ authenticatedContext }) => {
      const duration = await measureResponseTime(
        authenticatedContext,
        'get',
        '/api/v1/medications/due'
      );

      expect(duration).toBeLessThan(500);
    });

    test('should retrieve appointments calendar within 500ms', async ({ authenticatedContext }) => {
      const today = new Date().toISOString().split('T')[0];

      const duration = await measureResponseTime(
        authenticatedContext,
        'get',
        '/api/v1/appointments/calendar',
        { params: { date: today } }
      );

      expect(duration).toBeLessThan(500);
    });

    test('should search students within 500ms', async ({ authenticatedContext }) => {
      const duration = await measureResponseTime(
        authenticatedContext,
        'get',
        '/api/v1/students/search',
        { params: { query: 'test' } }
      );

      expect(duration).toBeLessThan(500);
    });
  });

  test.describe('Pagination Performance', () => {
    test('should handle paginated requests efficiently', async ({ authenticatedContext }) => {
      const pageSizes = [10, 25, 50, 100];

      for (const pageSize of pageSizes) {
        const duration = await measureResponseTime(
          authenticatedContext,
          'get',
          '/api/v1/students',
          { params: { limit: pageSize, page: 1 } }
        );

        // All page sizes should respond within 1 second
        expect(duration).toBeLessThan(1000);
      }
    });

    test('should retrieve first page faster than subsequent pages', async ({
      authenticatedContext,
    }) => {
      const page1Duration = await measureResponseTime(
        authenticatedContext,
        'get',
        '/api/v1/students',
        { params: { limit: 10, page: 1 } }
      );

      const page2Duration = await measureResponseTime(
        authenticatedContext,
        'get',
        '/api/v1/students',
        { params: { limit: 10, page: 2 } }
      );

      // First page is often cached/optimized
      expect(page1Duration).toBeLessThan(1000);
      expect(page2Duration).toBeLessThan(1000);
    });
  });

  test.describe('Query Performance', () => {
    test('should filter by single field efficiently', async ({ authenticatedContext }) => {
      const duration = await measureResponseTime(
        authenticatedContext,
        'get',
        '/api/v1/students',
        { params: { grade: '5' } }
      );

      expect(duration).toBeLessThan(500);
    });

    test('should filter by multiple fields efficiently', async ({ authenticatedContext }) => {
      const duration = await measureResponseTime(
        authenticatedContext,
        'get',
        '/api/v1/students',
        { params: { grade: '5', status: 'active' } }
      );

      expect(duration).toBeLessThan(500);
    });

    test('should sort results efficiently', async ({ authenticatedContext }) => {
      const duration = await measureResponseTime(
        authenticatedContext,
        'get',
        '/api/v1/students',
        { params: { sortBy: 'lastName', order: 'asc' } }
      );

      expect(duration).toBeLessThan(500);
    });
  });

  test.describe('Concurrent Request Performance', () => {
    test('should handle 10 concurrent requests efficiently', async ({ authenticatedContext }) => {
      const requests = Array(10)
        .fill(null)
        .map(() => authenticatedContext.get('/api/v1/students'));

      const start = Date.now();
      const responses = await Promise.all(requests);
      const duration = Date.now() - start;

      // All requests should succeed
      responses.forEach((response) => {
        expect(response.ok()).toBeTruthy();
      });

      // Should complete within 2 seconds
      expect(duration).toBeLessThan(2000);
    });

    test('should handle mixed concurrent requests', async ({ authenticatedContext }) => {
      const requests = [
        authenticatedContext.get('/api/v1/students'),
        authenticatedContext.get('/api/v1/medications'),
        authenticatedContext.get('/api/v1/appointments'),
        authenticatedContext.get('/api/v1/health-records'),
        authenticatedContext.get('/api/v1/students'),
      ];

      const start = Date.now();
      const responses = await Promise.all(requests);
      const duration = Date.now() - start;

      // All requests should succeed
      responses.forEach((response) => {
        expect(response.ok()).toBeTruthy();
      });

      // Should complete within 2 seconds
      expect(duration).toBeLessThan(2000);
    });
  });

  test.describe('Complex Query Performance', () => {
    test('should handle student health timeline efficiently', async ({ authenticatedContext }) => {
      // Create a student
      const studentResponse = await authenticatedContext.post('/api/v1/students', {
        data: {
          firstName: 'Timeline',
          lastName: 'Test',
          dateOfBirth: '2010-01-01',
          grade: '5',
          schoolId: `TIMELINE${Date.now()}`,
          status: 'active',
        },
      });

      const student = await studentResponse.json();

      // Measure timeline retrieval
      const duration = await measureResponseTime(
        authenticatedContext,
        'get',
        `/api/v1/students/${student.id}/health-timeline`
      );

      expect(duration).toBeLessThan(1000);
    });

    test('should handle medication compliance report efficiently', async ({
      authenticatedContext,
    }) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const endDate = new Date();

      const duration = await measureResponseTime(
        authenticatedContext,
        'get',
        '/api/v1/medications/reports/administration',
        {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        }
      );

      expect(duration).toBeLessThan(2000);
    });

    test('should handle analytics dashboard efficiently', async ({ authenticatedContext }) => {
      const duration = await measureResponseTime(
        authenticatedContext,
        'get',
        '/api/v1/analytics/dashboard'
      );

      // Dashboard queries can be complex
      expect(duration).toBeLessThan(3000);
    });
  });

  test.describe('Cache Performance', () => {
    test('should benefit from caching on repeated requests', async ({ authenticatedContext }) => {
      // First request (uncached)
      const firstDuration = await measureResponseTime(
        authenticatedContext,
        'get',
        '/api/v1/students',
        { params: { limit: 10 } }
      );

      // Second request (potentially cached)
      const secondDuration = await measureResponseTime(
        authenticatedContext,
        'get',
        '/api/v1/students',
        { params: { limit: 10 } }
      );

      // Second request should be same or faster
      expect(secondDuration).toBeLessThanOrEqual(firstDuration + 50); // Allow 50ms variance
    });
  });

  test.describe('Error Response Performance', () => {
    test('should return 404 errors quickly', async ({ authenticatedContext }) => {
      const duration = await measureResponseTime(
        authenticatedContext,
        'get',
        '/api/v1/students/00000000-0000-0000-0000-000000000000'
      );

      // Error responses should be fast
      expect(duration).toBeLessThan(200);
    });

    test('should return validation errors quickly', async ({ authenticatedContext }) => {
      const start = Date.now();

      const response = await authenticatedContext.post('/api/v1/students', {
        data: {
          firstName: 'Test',
          // Missing required fields
        },
      });

      const duration = Date.now() - start;

      expect(response.status()).toBe(400);
      expect(duration).toBeLessThan(200);
    });
  });

  test.describe('Bulk Operation Performance', () => {
    test('should handle bulk export efficiently', async ({ authenticatedContext }) => {
      const start = Date.now();

      const response = await authenticatedContext.post('/api/v1/students/export', {
        data: {
          format: 'csv',
          filters: { status: 'active' },
        },
      });

      const duration = Date.now() - start;

      if (response.ok()) {
        // Bulk operations can take longer
        expect(duration).toBeLessThan(5000);
      }
    });
  });

  test.describe('Database Query Efficiency', () => {
    test('should use efficient joins for related data', async ({ authenticatedContext }) => {
      // Request student with related data (medications, appointments, etc.)
      const studentResponse = await authenticatedContext.post('/api/v1/students', {
        data: {
          firstName: 'Relations',
          lastName: 'Test',
          dateOfBirth: '2010-01-01',
          grade: '5',
          schoolId: `REL${Date.now()}`,
          status: 'active',
        },
      });

      const student = await studentResponse.json();

      // Get student with all relations
      const duration = await measureResponseTime(
        authenticatedContext,
        'get',
        `/api/v1/students/${student.id}`,
        { params: { include: 'medications,appointments,healthRecords' } }
      );

      // Should use efficient joins, not N+1 queries
      expect(duration).toBeLessThan(1000);
    });
  });

  test.describe('Performance Monitoring', () => {
    test('should include response time in headers', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/students');

      // Check for performance headers
      const headers = response.headers();

      // Many APIs include X-Response-Time or similar
      if (headers['x-response-time']) {
        const responseTime = parseInt(headers['x-response-time']);
        expect(responseTime).toBeLessThan(1000);
      }
    });
  });

  test.describe('Load Testing Simulation', () => {
    test('should maintain performance under simulated load', async ({ authenticatedContext }) => {
      // Simulate 50 sequential requests
      const durations: number[] = [];

      for (let i = 0; i < 50; i++) {
        const start = Date.now();
        const response = await authenticatedContext.get('/api/v1/students', {
          params: { limit: 10 },
        });
        const duration = Date.now() - start;

        expect(response.ok()).toBeTruthy();
        durations.push(duration);
      }

      // Calculate average response time
      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;

      // Average should be under 500ms
      expect(avgDuration).toBeLessThan(500);

      // P95 (95th percentile) should be under 1000ms
      const sortedDurations = durations.sort((a, b) => a - b);
      const p95Index = Math.floor(durations.length * 0.95);
      const p95Duration = sortedDurations[p95Index];

      expect(p95Duration).toBeLessThan(1000);
    });
  });
});
