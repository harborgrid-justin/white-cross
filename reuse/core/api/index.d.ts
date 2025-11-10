/**
 * @fileoverview API Management Barrel Export
 * @module core/api
 *
 * Comprehensive API management utilities including gateway patterns, versioning,
 * documentation generation, rate limiting, and GraphQL support.
 *
 * @example API Gateway with rate limiting
 * ```typescript
 * import { createRateLimiter, apiKeyAuthMiddleware } from '@reuse/core/api';
 *
 * const limiter = createRateLimiter({
 *   windowMs: 60000,
 *   maxRequests: 100,
 *   strategy: 'sliding'
 * });
 *
 * app.use('/api/v1', limiter, apiKeyAuthMiddleware(ApiKeyModel));
 * ```
 *
 * @example API Versioning
 * ```typescript
 * import { createVersionRouter, extractApiVersion } from '@reuse/core/api';
 *
 * const router = createVersionRouter({
 *   v1: handleV1Request,
 *   v2: handleV2Request
 * });
 * ```
 */
export * from './gateway';
export * from './versioning';
export * from './documentation';
export * from './graphql';
export * from './design-kit';
export * from './gateway-kit';
export * from './http-kit';
export { default as ApiDesignKit } from './design-kit';
export { default as ApiGatewayKit } from './gateway-kit';
export { default as HttpKit } from './http-kit';
//# sourceMappingURL=index.d.ts.map