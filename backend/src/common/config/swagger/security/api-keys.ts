/**
 * API Key Authentication Builders
 *
 * Functions for creating API key-based authentication including
 * header, query parameter, and cookie-based API keys.
 *
 * @module swagger/security/api-keys
 * @version 1.0.0
 */

import { applyDecorators } from '@nestjs/common';
import { ApiSecurity, ApiHeader, ApiQuery, ApiResponse, ApiExtension } from '@nestjs/swagger';
import { ApiKeyOptions } from './types';

/**
 * Creates API key header authentication.
 * Standard API key in custom header.
 *
 * @param options - API key options
 * @returns API key header authentication configuration
 *
 * @example
 * ```typescript
 * @createApiKeyHeader({ keyName: 'X-API-Key', format: 'uuid', rateLimit: { limit: 1000, window: '1h' } })
 * async apiKeyProtectedEndpoint() { }
 * ```
 */
export function createApiKeyHeader(options: ApiKeyOptions = {}) {
  const { keyName = 'X-API-Key', format, rateLimit } = options;

  const decorators: ReturnType<typeof applyDecorators>[] = [
    ApiSecurity('api_key'),
    ApiHeader({
      name: keyName,
      description: `API key for authentication${format ? ` (format: ${format})` : ''}`,
      required: true,
      schema: {
        type: 'string',
        ...(format && { format }),
      },
    }),
  ];

  if (rateLimit) {
    decorators.push(
      ApiExtension('x-api-key-rate-limit', {
        limit: rateLimit.limit,
        window: rateLimit.window,
        description: `Rate limit: ${rateLimit.limit} requests per ${rateLimit.window}`,
      }),
    );
  }

  decorators.push(
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing API key',
    }),
    ApiResponse({
      status: 429,
      description: 'Too Many Requests - API key rate limit exceeded',
    }),
  );

  return applyDecorators(...decorators);
}

/**
 * Creates API key query parameter authentication.
 * API key passed as query parameter (less secure, for public APIs).
 *
 * @param options - API key options
 * @returns API key query authentication configuration
 *
 * @example
 * ```typescript
 * @createApiKeyQuery({ keyName: 'apikey' })
 * async publicApiEndpoint(@Query('apikey') apiKey: string) { }
 * ```
 */
export function createApiKeyQuery(options: ApiKeyOptions = {}) {
  const { keyName = 'apikey', format } = options;

  return applyDecorators(
    ApiSecurity('api_key'),
    ApiQuery({
      name: keyName,
      description: `API key for authentication${format ? ` (format: ${format})` : ''}`,
      required: true,
      schema: {
        type: 'string',
        ...(format && { format }),
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing API key',
    }),
  );
}

/**
 * Creates API key cookie authentication.
 * API key stored in secure HTTP-only cookie.
 *
 * @param options - API key options
 * @returns API key cookie authentication configuration
 *
 * @example
 * ```typescript
 * @createApiKeyCookie({ keyName: 'api_session', format: 'uuid' })
 * async cookieAuthEndpoint() { }
 * ```
 */
export function createApiKeyCookie(options: ApiKeyOptions = {}) {
  const { keyName = 'api_session', format } = options;

  return applyDecorators(
    ApiSecurity('cookie_auth'),
    ApiExtension('x-api-key-cookie', {
      name: keyName,
      format,
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      description: 'API key stored in secure HTTP-only cookie',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing API key cookie',
    }),
  );
}
