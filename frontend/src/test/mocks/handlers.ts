/**
 * MSW API Handlers
 * Mock API endpoints for testing
 */

import { http, HttpResponse } from 'msw';

export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      data: {
        token: 'mock-token',
        user: { id: '1', email: 'test@example.com', role: 'NURSE' }
      }
    });
  }),

  // Students endpoints
  http.get('/api/students', () => {
    return HttpResponse.json({
      data: {
        students: [],
        total: 0,
        page: 1,
        limit: 10
      }
    });
  }),
];
