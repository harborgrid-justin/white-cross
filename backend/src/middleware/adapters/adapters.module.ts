/**
 * @fileoverview Middleware Adapters Module for Healthcare System
 * @module middleware/adapters
 * @description NestJS module that provides framework adapters for middleware components.
 * Supports Express and Hapi adapters with healthcare-specific enhancements and utilities.
 *
 * Key Features:
 * - Express and Hapi framework adapters
 * - Healthcare middleware utilities
 * - Response and request validation utilities
 * - Base adapter functionality
 * - Dependency injection ready
 *
 * @requires @nestjs/common - NestJS core module
 * @version 1.0.0
 * @author Healthcare Platform Team
 * @since 2025-10-28
 */

import { Module } from '@nestjs/common';
import {
  ExpressMiddlewareAdapter,
  ExpressMiddlewareUtils,
} from './express/express.adapter';
import {
  HapiMiddlewareAdapter,
  HapiMiddlewareUtils,
} from './hapi/hapi.adapter';
import {
  HealthcareMiddlewareUtils,
  ResponseUtils,
  RequestValidationUtils,
} from './shared/base.adapter';

/**
 * Middleware Adapters Module
 *
 * @description Provides all adapter services for dependency injection throughout the application.
 * This module exports adapters for different frameworks (Express, Hapi) and common utilities
 * for healthcare middleware operations.
 *
 * @example
 * // Import in your feature module
 * import { Module } from '@nestjs/common';
 * import { AdaptersModule } from './middleware/adapters/adapters.module';
 *
 * @Module({
 *   imports: [AdaptersModule],
 *   // ... your module configuration
 * })
 * export class FeatureModule {}
 *
 * @example
 * // Use in a service or controller
 * import { Injectable } from '@nestjs/common';
 * import { ExpressMiddlewareAdapter } from './middleware/adapters/express/express.adapter';
 *
 * @Injectable()
 * export class MyService {
 *   constructor(
 *     private readonly expressAdapter: ExpressMiddlewareAdapter
 *   ) {}
 *
 *   setupMiddleware() {
 *     const middleware = this.expressAdapter.adapt(myMiddleware);
 *     // Use the adapted middleware
 *   }
 * }
 */
@Module({
  providers: [
    // Express Adapter Services
    ExpressMiddlewareAdapter,
    ExpressMiddlewareUtils,

    // Hapi Adapter Services
    HapiMiddlewareAdapter,
    HapiMiddlewareUtils,

    // Shared Utilities
    HealthcareMiddlewareUtils,
    ResponseUtils,
    RequestValidationUtils,
  ],
  exports: [
    // Export all providers for use in other modules
    ExpressMiddlewareAdapter,
    ExpressMiddlewareUtils,
    HapiMiddlewareAdapter,
    HapiMiddlewareUtils,
    HealthcareMiddlewareUtils,
    ResponseUtils,
    RequestValidationUtils,
  ],
})
export class AdaptersModule {}
