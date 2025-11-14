/**
 * Mock Service Worker (MSW) Request Handlers
 *
 * Provides mock API handlers for testing without real backend calls.
 * Handlers simulate healthcare API endpoints with synthetic data.
 *
 * @module tests/mocks/handlers
 */

import { http, HttpResponse } from 'msw';
import { createTestStudent, createTestMedication } from '../utils/test-factories';

/**
 * Base API URL for mock handlers
 */
const API_URL = 'http://localhost:3001/api/v1';

/**
 * Mock API request handlers
 */
export const handlers = [
  // Students endpoints
  http.get(`${API_URL}/students`, () => {
    return HttpResponse.json({
      data: [
        createTestStudent({ id: '1', firstName: 'Alice' }),
        createTestStudent({ id: '2', firstName: 'Bob' }),
      ],
      meta: {
        total: 2,
        page: 1,
        pageSize: 10,
      },
    });
  }),

  http.get(`${API_URL}/students/:id`, ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      data: createTestStudent({ id: id as string }),
    });
  }),

  http.post(`${API_URL}/students`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      {
        data: createTestStudent(body as any),
      },
      { status: 201 }
    );
  }),

  // Medications endpoints
  http.get(`${API_URL}/medications`, () => {
    return HttpResponse.json({
      data: [
        createTestMedication({ id: '1', name: 'Medication A' }),
        createTestMedication({ id: '2', name: 'Medication B' }),
      ],
      meta: {
        total: 2,
        page: 1,
        pageSize: 10,
      },
    });
  }),

  http.get(`${API_URL}/medications/:id`, ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      data: createTestMedication({ id: id as string }),
    });
  }),

  // Auth endpoints
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      data: {
        user: {
          id: '1',
          email: (body as any).email,
          firstName: 'Test',
          lastName: 'User',
          role: 'nurse',
        },
        token: 'mock-jwt-token',
      },
    });
  }),

  http.post(`${API_URL}/auth/logout`, () => {
    return HttpResponse.json({ success: true });
  }),
];
