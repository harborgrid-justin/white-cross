/**
 * Swagger/OpenAPI Configuration - Main Export Module
 *
 * Centralized exports for all OpenAPI/Swagger configuration utilities.
 * This module provides a clean interface to access all swagger configuration tools.
 *
 * @module swagger
 * @version 1.0.0
 */

// Core types and constants
export * from './types';

// Document builders
export * from './builders/document-builders';

// Security configuration
export * from './security/security-configurators';

// Server configuration
export * from './servers/server-builders';

// Parameter builders
export * from './parameters/parameter-builders';

// Re-export commonly used NestJS swagger types for convenience
export {
  SwaggerModule,
  DocumentBuilder,
  OpenAPIObject,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
