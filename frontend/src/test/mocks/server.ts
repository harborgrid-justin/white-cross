/**
 * Mock Server
 * Mock server for testing API requests
 */

import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/*', () => {
    return HttpResponse.json({ data: [] });
  }),
  http.post('/api/*', () => {
    return HttpResponse.json({ success: true });
  }),
];

export const server = setupServer(...handlers);
