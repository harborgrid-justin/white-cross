/**
 * @fileoverview Middleware Adapters Barrel Export
 * @module middleware/adapters
 * @description Provides convenient exports for all adapter services and utilities
 */

// Module
export { AdaptersModule } from './adapters.module';

// Express Adapters
export {
  ExpressMiddlewareAdapter,
  ExpressMiddlewareUtils,
  ExpressRequestWrapper,
  ExpressResponseWrapper,
  ExpressNextWrapper,
} from './express/express.adapter';

// Hapi Adapters
export {
  HapiMiddlewareAdapter,
  HapiMiddlewareUtils,
  HapiRequestWrapper,
  HapiResponseWrapper,
  HapiNextWrapper,
} from './hapi/hapi.adapter';

// Shared Utilities
export {
  BaseFrameworkAdapter,
  HealthcareMiddlewareUtils,
  ResponseUtils,
  RequestValidationUtils,
} from './shared/base.adapter';

// Re-export types for convenience
export * from '../utils/types/middleware.types';
