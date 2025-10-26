/**
 * API Proxy Route Tests
 * Tests for Next.js API Route that proxies requests to backend
 */

import { NextRequest } from 'next/server';
import { GET, POST, PUT, DELETE, PATCH, OPTIONS } from '../route';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('API Proxy Route', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      API_BASE_URL: 'http://localhost:3001',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('GET requests', () => {
    it('proxies GET request successfully', async () => {
      const mockResponseData = {
        success: true,
        data: {
          students: [
            { id: '1', firstName: 'John', lastName: 'Doe' },
          ],
        },
      };

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => JSON.stringify(mockResponseData),
        headers: new Headers({
          'content-type': 'application/json',
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/proxy/students');
      const params = { path: ['students'] };

      const response = await GET(request, { params });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/students',
        expect.objectContaining({
          method: 'GET',
        })
      );

      const responseData = await response.json();
      expect(responseData).toEqual(mockResponseData);
      expect(response.status).toBe(200);
    });

    it('forwards query parameters', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => JSON.stringify({ success: true }),
        headers: new Headers(),
      });

      const request = new NextRequest(
        'http://localhost:3000/api/proxy/students?page=2&limit=10&search=John'
      );
      const params = { path: ['students'] };

      await GET(request, { params });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/students?page=2&limit=10&search=John',
        expect.any(Object)
      );
    });

    it('forwards authorization header', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => JSON.stringify({ success: true }),
        headers: new Headers(),
      });

      const request = new NextRequest('http://localhost:3000/api/proxy/students', {
        headers: {
          Authorization: 'Bearer mock-token',
        },
      });
      const params = { path: ['students'] };

      await GET(request, { params });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            authorization: 'Bearer mock-token',
          }),
        })
      );
    });
  });

  describe('POST requests', () => {
    it('proxies POST request with body', async () => {
      const requestBody = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '2010-01-01',
      };

      mockFetch.mockResolvedValue({
        ok: true,
        status: 201,
        statusText: 'Created',
        text: async () => JSON.stringify({
          success: true,
          data: { id: '123', ...requestBody },
        }),
        headers: new Headers({
          'content-type': 'application/json',
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/proxy/students', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const params = { path: ['students'] };

      const response = await POST(request, { params });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/students',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestBody),
        })
      );

      expect(response.status).toBe(201);
    });

    it('handles nested paths', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => JSON.stringify({ success: true }),
        headers: new Headers(),
      });

      const request = new NextRequest(
        'http://localhost:3000/api/proxy/students/1/medications',
        {
          method: 'POST',
          body: JSON.stringify({ name: 'Ibuprofen' }),
        }
      );
      const params = { path: ['students', '1', 'medications'] };

      await POST(request, { params });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/students/1/medications',
        expect.any(Object)
      );
    });
  });

  describe('PUT requests', () => {
    it('proxies PUT request successfully', async () => {
      const updateData = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => JSON.stringify({
          success: true,
          data: { id: '1', ...updateData },
        }),
        headers: new Headers(),
      });

      const request = new NextRequest('http://localhost:3000/api/proxy/students/1', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      const params = { path: ['students', '1'] };

      const response = await PUT(request, { params });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/students/1',
        expect.objectContaining({
          method: 'PUT',
        })
      );

      expect(response.status).toBe(200);
    });
  });

  describe('DELETE requests', () => {
    it('proxies DELETE request successfully', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => JSON.stringify({ success: true }),
        headers: new Headers(),
      });

      const request = new NextRequest('http://localhost:3000/api/proxy/students/1', {
        method: 'DELETE',
      });
      const params = { path: ['students', '1'] };

      const response = await DELETE(request, { params });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/students/1',
        expect.objectContaining({
          method: 'DELETE',
        })
      );

      expect(response.status).toBe(200);
    });

    it('does not send body with DELETE request', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => JSON.stringify({ success: true }),
        headers: new Headers(),
      });

      const request = new NextRequest('http://localhost:3000/api/proxy/students/1', {
        method: 'DELETE',
      });
      const params = { path: ['students', '1'] };

      await DELETE(request, { params });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'DELETE',
          body: undefined,
        })
      );
    });
  });

  describe('PATCH requests', () => {
    it('proxies PATCH request successfully', async () => {
      const patchData = { grade: '11th' };

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => JSON.stringify({
          success: true,
          data: { id: '1', ...patchData },
        }),
        headers: new Headers(),
      });

      const request = new NextRequest('http://localhost:3000/api/proxy/students/1', {
        method: 'PATCH',
        body: JSON.stringify(patchData),
      });
      const params = { path: ['students', '1'] };

      const response = await PATCH(request, { params });

      expect(response.status).toBe(200);
    });
  });

  describe('OPTIONS requests (CORS)', () => {
    it('handles OPTIONS preflight request', async () => {
      const request = new NextRequest('http://localhost:3000/api/proxy/students', {
        method: 'OPTIONS',
      });

      const response = await OPTIONS(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('GET');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
    });
  });

  describe('Error Handling', () => {
    it('handles backend API errors', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => JSON.stringify({
          success: false,
          error: 'Student not found',
        }),
        headers: new Headers({
          'content-type': 'application/json',
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/proxy/students/999');
      const params = { path: ['students', '999'] };

      const response = await GET(request, { params });

      expect(response.status).toBe(404);

      const responseData = await response.json();
      expect(responseData.error).toBe('Student not found');
    });

    it('handles network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const request = new NextRequest('http://localhost:3000/api/proxy/students');
      const params = { path: ['students'] };

      const response = await GET(request, { params });

      expect(response.status).toBe(500);

      const responseData = await response.json();
      expect(responseData.error).toBe('Proxy error');
      expect(responseData.message).toBe('Network error');
    });

    it('handles timeout errors', async () => {
      mockFetch.mockRejectedValue(new Error('Request timeout'));

      const request = new NextRequest('http://localhost:3000/api/proxy/students');
      const params = { path: ['students'] };

      const response = await GET(request, { params });

      expect(response.status).toBe(500);
    });
  });

  describe('Header Handling', () => {
    it('excludes certain headers from forwarding', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => JSON.stringify({ success: true }),
        headers: new Headers(),
      });

      const request = new NextRequest('http://localhost:3000/api/proxy/students', {
        headers: {
          Host: 'localhost:3000',
          'Content-Length': '123',
          'X-Forwarded-For': '192.168.1.1',
          Authorization: 'Bearer token',
        },
      });
      const params = { path: ['students'] };

      await GET(request, { params });

      const fetchCall = mockFetch.mock.calls[0][1];
      expect(fetchCall.headers).not.toHaveProperty('host');
      expect(fetchCall.headers).not.toHaveProperty('content-length');
      expect(fetchCall.headers).not.toHaveProperty('x-forwarded-for');
      expect(fetchCall.headers).toHaveProperty('authorization');
    });

    it('adds CORS headers in development', async () => {
      process.env.NODE_ENV = 'development';

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => JSON.stringify({ success: true }),
        headers: new Headers(),
      });

      const request = new NextRequest('http://localhost:3000/api/proxy/students');
      const params = { path: ['students'] };

      const response = await GET(request, { params });

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });
  });

  describe('Request Logging', () => {
    it('logs proxy requests', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => JSON.stringify({ success: true }),
        headers: new Headers(),
      });

      const request = new NextRequest('http://localhost:3000/api/proxy/students');
      const params = { path: ['students'] };

      await GET(request, { params });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Proxying GET request to:'),
        expect.stringContaining('students')
      );

      consoleLogSpy.mockRestore();
    });
  });
});
