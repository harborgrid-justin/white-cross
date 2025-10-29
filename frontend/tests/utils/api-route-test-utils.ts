/**
 * API Route Testing Utilities
 * Helpers for testing Next.js API routes with authentication, HIPAA compliance, and RBAC
 */

import { NextRequest } from 'next/server';
import { createUser, createNurse, createAdmin, createApiResponse } from './test-factories';

/**
 * Create authenticated NextRequest for testing
 */
export function createAuthenticatedRequest(
  method: string,
  url: string,
  options: {
    user?: any;
    body?: any;
    headers?: Record<string, string>;
    searchParams?: Record<string, string>;
  } = {}
): NextRequest {
  const { user = createNurse(), body, headers = {}, searchParams = {} } = options;

  // Build URL with search params
  const urlWithParams = new URL(url, 'http://localhost:3000');
  Object.entries(searchParams).forEach(([key, value]) => {
    urlWithParams.searchParams.set(key, value);
  });

  // Create request
  const request = new NextRequest(urlWithParams, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer mock-token-${user.id}`,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // Mock authenticateRequest to return our user
  return request;
}

/**
 * Create unauthenticated NextRequest for testing
 */
export function createUnauthenticatedRequest(
  method: string,
  url: string,
  options: {
    body?: any;
    headers?: Record<string, string>;
  } = {}
): NextRequest {
  const { body, headers = {} } = options;

  const fullUrl = new URL(url, 'http://localhost:3000');

  return new NextRequest(fullUrl, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Mock proxyToBackend for testing
 */
export function mockProxyToBackend(responseData: any, status: number = 200) {
  return {
    json: async () => responseData,
    status,
    ok: status >= 200 && status < 300,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  };
}

/**
 * Extract response data from NextResponse
 */
export async function extractResponse(response: Response) {
  const data = await response.json();
  return {
    status: response.status,
    data,
  };
}

/**
 * Verify HIPAA audit log call
 */
export function verifyAuditLogCall(
  mockAuditLog: jest.Mock,
  expectedAction: string,
  expectedResource: string,
  userId?: string
) {
  expect(mockAuditLog).toHaveBeenCalled();

  const calls = mockAuditLog.mock.calls;
  const matchingCall = calls.find(
    (call) =>
      call[0].action === expectedAction &&
      call[0].resource === expectedResource &&
      (!userId || call[0].userId === userId)
  );

  expect(matchingCall).toBeDefined();

  if (matchingCall) {
    const auditEntry = matchingCall[0];
    expect(auditEntry.timestamp).toBeDefined();
    expect(auditEntry.ipAddress).toBeDefined();
  }

  return matchingCall;
}

/**
 * Verify cache revalidation was called
 */
export function verifyCacheRevalidation(
  mockRevalidateTag: jest.Mock,
  expectedTag: string
) {
  expect(mockRevalidateTag).toHaveBeenCalledWith(expectedTag);
}

/**
 * Test authentication scenarios
 */
export const authTestScenarios = {
  /**
   * Test that route requires authentication
   */
  async testRequiresAuth(handler: Function) {
    const request = createUnauthenticatedRequest('GET', '/api/v1/test');
    const response = await handler(request, {});
    const { status, data } = await extractResponse(response);

    expect(status).toBe(401);
    expect(data.error).toBe('Unauthorized');

    return { status, data };
  },

  /**
   * Test that route requires specific role
   */
  async testRequiresRole(handler: Function, user: any, expectedStatus: number = 403) {
    const request = createAuthenticatedRequest('GET', '/api/v1/test', { user });
    const response = await handler(request, {});
    const { status, data } = await extractResponse(response);

    expect(status).toBe(expectedStatus);

    if (expectedStatus === 403) {
      expect(data.error).toBe('Forbidden');
    }

    return { status, data };
  },

  /**
   * Test that route succeeds with proper authentication
   */
  async testAuthenticatedAccess(handler: Function, user: any) {
    const request = createAuthenticatedRequest('GET', '/api/v1/test', { user });
    const response = await handler(request, {});
    const { status, data } = await extractResponse(response);

    expect(status).toBeLessThan(400);

    return { status, data };
  },
};

/**
 * Test HIPAA compliance scenarios
 */
export const hipaaTestScenarios = {
  /**
   * Test that PHI access is logged
   */
  async testPHIAccessLogging(
    handler: Function,
    mockAuditLog: jest.Mock,
    user: any,
    resource: string
  ) {
    const request = createAuthenticatedRequest('GET', '/api/v1/test', { user });
    await handler(request, {});

    verifyAuditLogCall(mockAuditLog, 'VIEW', resource, user.id);
  },

  /**
   * Test that PHI creation is logged
   */
  async testPHICreationLogging(
    handler: Function,
    mockAuditLog: jest.Mock,
    user: any,
    resource: string,
    body: any
  ) {
    const request = createAuthenticatedRequest('POST', '/api/v1/test', { user, body });
    await handler(request, {});

    verifyAuditLogCall(mockAuditLog, 'CREATE', resource, user.id);
  },

  /**
   * Test that PHI modification is logged
   */
  async testPHIModificationLogging(
    handler: Function,
    mockAuditLog: jest.Mock,
    user: any,
    resource: string,
    resourceId: string,
    body: any
  ) {
    const request = createAuthenticatedRequest('PATCH', `/api/v1/test/${resourceId}`, {
      user,
      body,
    });
    await handler(request, {});

    verifyAuditLogCall(mockAuditLog, 'UPDATE', resource, user.id);
  },

  /**
   * Test that PHI deletion is logged
   */
  async testPHIDeletionLogging(
    handler: Function,
    mockAuditLog: jest.Mock,
    user: any,
    resource: string,
    resourceId: string
  ) {
    const request = createAuthenticatedRequest('DELETE', `/api/v1/test/${resourceId}`, {
      user,
    });
    await handler(request, {});

    verifyAuditLogCall(mockAuditLog, 'DELETE', resource, user.id);
  },
};

/**
 * Test error handling scenarios
 */
export const errorTestScenarios = {
  /**
   * Test backend error handling
   */
  async testBackendError(handler: Function, user: any) {
    const request = createAuthenticatedRequest('GET', '/api/v1/test', { user });

    // Mock proxyToBackend to throw error
    const mockProxy = jest.fn().mockRejectedValue(new Error('Backend unavailable'));

    const response = await handler(request, {});
    const { status, data } = await extractResponse(response);

    expect(status).toBe(500);
    expect(data.error).toBeDefined();

    return { status, data };
  },

  /**
   * Test validation error handling
   */
  async testValidationError(handler: Function, user: any, invalidBody: any) {
    const request = createAuthenticatedRequest('POST', '/api/v1/test', {
      user,
      body: invalidBody,
    });

    const response = await handler(request, {});
    const { status, data } = await extractResponse(response);

    expect(status).toBe(400);
    expect(data.error).toBeDefined();

    return { status, data };
  },

  /**
   * Test not found error handling
   */
  async testNotFoundError(handler: Function, user: any, resourceId: string) {
    const request = createAuthenticatedRequest('GET', `/api/v1/test/${resourceId}`, {
      user,
    });

    const response = await handler(request, {});
    const { status, data } = await extractResponse(response);

    expect(status).toBe(404);
    expect(data.error).toBeDefined();

    return { status, data };
  },
};

/**
 * Test cache scenarios
 */
export const cacheTestScenarios = {
  /**
   * Test that GET requests use caching
   */
  async testCacheUsage(handler: Function, user: any, mockRevalidateTag: jest.Mock) {
    const request = createAuthenticatedRequest('GET', '/api/v1/test', { user });
    await handler(request, {});

    // Cache should not be invalidated on GET
    expect(mockRevalidateTag).not.toHaveBeenCalled();
  },

  /**
   * Test that POST requests invalidate cache
   */
  async testCacheInvalidation(
    handler: Function,
    user: any,
    mockRevalidateTag: jest.Mock,
    expectedTag: string,
    body: any
  ) {
    const request = createAuthenticatedRequest('POST', '/api/v1/test', { user, body });
    await handler(request, {});

    verifyCacheRevalidation(mockRevalidateTag, expectedTag);
  },
};

/**
 * Complete API route test suite
 */
export function createAPIRouteTestSuite(
  routeName: string,
  getHandler: Function,
  postHandler: Function,
  options: {
    resource: string;
    cacheTag: string;
    createBody: any;
    requiredRole?: string;
  }
) {
  const { resource, cacheTag, createBody, requiredRole } = options;

  return {
    /**
     * Test GET endpoint
     */
    testGET: () => {
      describe(`GET ${routeName}`, () => {
        it('should require authentication', async () => {
          await authTestScenarios.testRequiresAuth(getHandler);
        });

        it('should return data for authenticated user', async () => {
          const user = createNurse();
          const { status, data } = await authTestScenarios.testAuthenticatedAccess(
            getHandler,
            user
          );

          expect(status).toBe(200);
          expect(data.success).toBe(true);
          expect(data.data).toBeDefined();
        });

        it('should log PHI access for HIPAA compliance', async () => {
          const mockAuditLog = jest.fn();
          const user = createNurse();

          await hipaaTestScenarios.testPHIAccessLogging(
            getHandler,
            mockAuditLog,
            user,
            resource
          );
        });

        if (requiredRole) {
          it(`should require ${requiredRole} role`, async () => {
            const user = createUser({ role: 'student', permissions: [] });
            await authTestScenarios.testRequiresRole(getHandler, user);
          });
        }
      });
    },

    /**
     * Test POST endpoint
     */
    testPOST: () => {
      describe(`POST ${routeName}`, () => {
        it('should require authentication', async () => {
          await authTestScenarios.testRequiresAuth(postHandler);
        });

        it('should create resource for authenticated user', async () => {
          const user = createNurse();
          const request = createAuthenticatedRequest('POST', routeName, {
            user,
            body: createBody,
          });

          const response = await postHandler(request, {});
          const { status, data } = await extractResponse(response);

          expect(status).toBe(201);
          expect(data.success).toBe(true);
          expect(data.data).toBeDefined();
        });

        it('should log PHI creation for HIPAA compliance', async () => {
          const mockAuditLog = jest.fn();
          const user = createNurse();

          await hipaaTestScenarios.testPHICreationLogging(
            postHandler,
            mockAuditLog,
            user,
            resource,
            createBody
          );
        });

        it('should invalidate cache after creation', async () => {
          const mockRevalidateTag = jest.fn();
          const user = createNurse();

          await cacheTestScenarios.testCacheInvalidation(
            postHandler,
            user,
            mockRevalidateTag,
            cacheTag,
            createBody
          );
        });

        if (requiredRole) {
          it(`should require ${requiredRole} role`, async () => {
            const user = createUser({ role: 'student', permissions: [] });
            await authTestScenarios.testRequiresRole(postHandler, user);
          });
        }
      });
    },
  };
}
