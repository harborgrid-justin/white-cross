/**
 * OpenAPI Document Builders
 *
 * Utilities for building comprehensive OpenAPI documents with all standard sections.
 * These builders provide a fluent interface for creating well-structured API documentation.
 *
 * @module swagger/builders/document-builders
 * @version 1.0.0
 */

import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import {
  OpenApiInfo,
  OpenApiServer,
  OpenApiTag,
  SchemaObject,
  ResponseObject,
  ParameterObject,
} from '../types';

/**
 * Creates a comprehensive OpenAPI document with all standard sections.
 *
 * @param app - NestJS application instance
 * @param info - API information object
 * @param servers - Array of server configurations
 * @param tags - Array of API tags
 * @returns Complete OpenAPI document
 *
 * @example
 * ```typescript
 * const document = createOpenApiDocument(app, {
 *   title: 'My API',
 *   description: 'API description',
 *   version: '1.0.0'
 * }, [{ url: 'https://api.example.com' }], [{ name: 'users' }]);
 * ```
 */
export function createOpenApiDocument(
  app: INestApplication,
  info: OpenApiInfo,
  servers: OpenApiServer[] = [],
  tags: OpenApiTag[] = [],
): OpenAPIObject {
  let builder = new DocumentBuilder()
    .setTitle(info.title)
    .setDescription(info.description)
    .setVersion(info.version);

  // Add terms of service if provided
  if (info.termsOfService) {
    builder = builder.setTermsOfService(info.termsOfService);
  }

  // Add contact information
  if (info.contact) {
    builder = builder.setContact(
      info.contact.name || '',
      info.contact.url || '',
      info.contact.email || '',
    );
  }

  // Add license information
  if (info.license) {
    builder = builder.setLicense(info.license.name, info.license.url || '');
  }

  // Add servers
  servers.forEach((server) => {
    builder = builder.addServer(server.url, server.description);
  });

  // Add tags
  tags.forEach((tag) => {
    builder = builder.addTag(tag.name, tag.description, tag.externalDocs);
  });

  const config = builder.build();
  return SwaggerModule.createDocument(app, config);
}

/**
 * Builds the info section of an OpenAPI document.
 *
 * @param title - API title
 * @param description - API description
 * @param version - API version
 * @param additionalInfo - Additional info properties
 * @returns DocumentBuilder instance with info configured
 *
 * @example
 * ```typescript
 * const builder = buildOpenApiInfo('My API', 'API for...', '1.0.0', {
 *   contact: { name: 'Support', email: 'support@example.com' }
 * });
 * ```
 */
export function buildOpenApiInfo(
  title: string,
  description: string,
  version: string,
  additionalInfo?: {
    termsOfService?: string;
    contact?: { name?: string; url?: string; email?: string };
    license?: { name: string; url?: string };
  },
): DocumentBuilder {
  let builder = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version);

  if (additionalInfo?.termsOfService) {
    builder = builder.setTermsOfService(additionalInfo.termsOfService);
  }

  if (additionalInfo?.contact) {
    const { name = '', url = '', email = '' } = additionalInfo.contact;
    builder = builder.setContact(name, url, email);
  }

  if (additionalInfo?.license) {
    builder = builder.setLicense(additionalInfo.license.name, additionalInfo.license.url || '');
  }

  return builder;
}

/**
 * Builds the servers section of an OpenAPI document.
 *
 * @param builder - DocumentBuilder instance
 * @param servers - Array of server configurations
 * @returns DocumentBuilder instance with servers configured
 *
 * @example
 * ```typescript
 * const builder = buildOpenApiServers(baseBuilder, [
 *   { url: 'https://api.example.com', description: 'Production' },
 *   { url: 'https://staging-api.example.com', description: 'Staging' }
 * ]);
 * ```
 */
export function buildOpenApiServers(
  builder: DocumentBuilder,
  servers: OpenApiServer[],
): DocumentBuilder {
  let updatedBuilder = builder;

  servers.forEach((server) => {
    updatedBuilder = updatedBuilder.addServer(server.url, server.description || '');
  });

  return updatedBuilder;
}

/**
 * Builds the tags section of an OpenAPI document.
 *
 * @param builder - DocumentBuilder instance
 * @param tags - Array of tag configurations
 * @returns DocumentBuilder instance with tags configured
 *
 * @example
 * ```typescript
 * const builder = buildOpenApiTags(baseBuilder, [
 *   { name: 'users', description: 'User management endpoints' },
 *   { name: 'orders', description: 'Order processing endpoints' }
 * ]);
 * ```
 */
export function buildOpenApiTags(builder: DocumentBuilder, tags: OpenApiTag[]): DocumentBuilder {
  let updatedBuilder = builder;

  tags.forEach((tag) => {
    updatedBuilder = updatedBuilder.addTag(tag.name, tag.description, tag.externalDocs);
  });

  return updatedBuilder;
}

/**
 * Builds external documentation section for OpenAPI document.
 *
 * @param builder - DocumentBuilder instance
 * @param description - Documentation description
 * @param url - Documentation URL
 * @returns DocumentBuilder instance with external docs configured
 *
 * @example
 * ```typescript
 * const builder = buildOpenApiExternalDocs(
 *   baseBuilder,
 *   'API Documentation',
 *   'https://docs.example.com'
 * );
 * ```
 */
export function buildOpenApiExternalDocs(
  builder: DocumentBuilder,
  description: string,
  url: string,
): DocumentBuilder {
  return builder.setExternalDoc(description, url);
}

/**
 * Builds the components section with reusable schemas, responses, and parameters.
 * Compliant with OpenAPI 3.0 Components Object specification.
 *
 * @param document - OpenAPI document object
 * @param schemas - Map of schema names to schema definitions
 * @param responses - Map of response names to response definitions
 * @param parameters - Map of parameter names to parameter definitions
 * @returns Updated OpenAPI document with components
 *
 * @example
 * ```typescript
 * const document = buildOpenApiComponents(baseDocument, {
 *   Error: {
 *     type: 'object',
 *     required: ['code', 'message'],
 *     properties: {
 *       code: { type: 'string', example: 'VALIDATION_ERROR' },
 *       message: { type: 'string', example: 'Invalid input provided' },
 *       details: { type: 'array', items: { type: 'object' } }
 *     }
 *   },
 *   User: {
 *     type: 'object',
 *     required: ['id', 'email'],
 *     properties: {
 *       id: { type: 'string', format: 'uuid' },
 *       email: { type: 'string', format: 'email' },
 *       name: { type: 'string' }
 *     }
 *   }
 * });
 * ```
 */
export function buildOpenApiComponents(
  document: OpenAPIObject,
  schemas: Record<string, SchemaObject> = {},
  responses: Record<string, ResponseObject> = {},
  parameters: Record<string, ParameterObject> = {},
): OpenAPIObject {
  if (!document.components) {
    document.components = {};
  }

  // Merge schemas with validation
  if (Object.keys(schemas).length > 0) {
    document.components.schemas = {
      ...(document.components.schemas || {}),
      ...schemas,
    };
  }

  // Merge responses with validation
  if (Object.keys(responses).length > 0) {
    Object.entries(responses).forEach(([name, response]) => {
      if (!response.description) {
        throw new Error(`Response component '${name}' must have a description`);
      }
    });
    document.components.responses = {
      ...(document.components.responses || {}),
      ...responses,
    };
  }

  // Merge parameters with validation
  if (Object.keys(parameters).length > 0) {
    Object.entries(parameters).forEach(([name, param]) => {
      if (!param.name || !param.in) {
        throw new Error(`Parameter component '${name}' must have 'name' and 'in' properties`);
      }
    });
    document.components.parameters = {
      ...(document.components.parameters || {}),
      ...parameters,
    };
  }

  return document;
}
