/**
 * OpenAPI Server Configuration Builders
 *
 * Utilities for building server configurations compliant with OpenAPI 3.0 specification.
 * Supports URL templating, variable substitution, and multi-environment setups.
 *
 * @module swagger/servers/server-builders
 * @version 1.0.0
 */

import { OpenApiServer, ServerVariable } from '../types';

/**
 * Builds server configuration with URL and description.
 * Compliant with OpenAPI 3.0 Server Object specification.
 *
 * @param url - Server URL (supports templating with variables)
 * @param description - Server description
 * @param variables - Server variables for URL template substitution
 * @returns Server configuration object
 *
 * @example
 * ```typescript
 * // Simple server without variables
 * const server1 = buildServerConfig('https://api.example.com', 'Production API');
 *
 * // Server with variable substitution
 * const server2 = buildServerConfig(
 *   'https://{environment}.example.com:{port}/v1',
 *   'Environment-based API Server',
 *   {
 *     environment: {
 *       default: 'api',
 *       enum: ['api', 'staging', 'dev'],
 *       description: 'Environment name'
 *     },
 *     port: {
 *       default: '443',
 *       enum: ['443', '8443'],
 *       description: 'HTTPS port'
 *     }
 *   }
 * );
 *
 * // Regional server
 * const server3 = buildServerConfig(
 *   'https://{region}.api.example.com',
 *   'Regional API Server',
 *   {
 *     region: {
 *       default: 'us-east',
 *       enum: ['us-east', 'us-west', 'eu-central', 'ap-south'],
 *       description: 'Geographic region'
 *     }
 *   }
 * );
 * ```
 */
export function buildServerConfig(
  url: string,
  description?: string,
  variables?: Record<string, ServerVariable>,
): OpenApiServer {
  // Validate URL format
  if (!url || url.trim() === '') {
    throw new Error('Server URL is required');
  }

  // Validate that all variables referenced in URL are defined
  if (variables) {
    const urlVariables = url.match(/\{([^}]+)\}/g);
    if (urlVariables) {
      urlVariables.forEach((varRef) => {
        const varName = varRef.slice(1, -1); // Remove { and }
        if (!variables[varName]) {
          throw new Error(`Variable '${varName}' used in URL but not defined in variables`);
        }
      });
    }
  }

  return {
    url,
    ...(description && { description }),
    ...(variables && { variables }),
  };
}

/**
 * Builds server variables for URL templating.
 *
 * @param variables - Map of variable names to configurations
 * @returns Server variables object compliant with OpenAPI 3.0 Server Variable Object
 *
 * @example
 * ```typescript
 * const variables = buildServerVariables({
 *   protocol: { default: 'https', enum: ['http', 'https'], description: 'Protocol' },
 *   port: { default: '443', description: 'Server port', enum: ['443', '8443'] },
 *   environment: { default: 'production', enum: ['production', 'staging', 'development'] }
 * });
 * ```
 */
export function buildServerVariables(
  variables: Record<string, ServerVariable>,
): Record<string, ServerVariable> {
  // Validate that each variable has a default value (required by OpenAPI 3.0)
  Object.entries(variables).forEach(([name, variable]) => {
    if (!variable.default) {
      throw new Error(`Server variable '${name}' must have a default value`);
    }
  });
  return variables;
}

/**
 * Environment configuration interface
 */
interface EnvironmentConfig {
  name: string;
  url: string;
  description?: string;
  variables?: Record<string, ServerVariable>;
}

/**
 * Builds multiple server configurations for different environments.
 *
 * @param environments - Array of environment configurations
 * @returns Array of server configurations
 *
 * @example
 * ```typescript
 * const servers = buildMultipleServers([
 *   { name: 'production', url: 'https://api.example.com' },
 *   { name: 'staging', url: 'https://staging.example.com' },
 *   { name: 'development', url: 'http://localhost:3000' }
 * ]);
 * ```
 */
export function buildMultipleServers(environments: EnvironmentConfig[]): OpenApiServer[] {
  return environments.map((env) => ({
    url: env.url,
    description: env.description || `${env.name} environment`,
    ...(env.variables && { variables: env.variables }),
  }));
}

/**
 * Builds server configuration with authentication information.
 *
 * @param url - Server URL
 * @param description - Server description
 * @param authSchemes - Array of supported authentication schemes
 * @returns Server configuration object with auth metadata
 *
 * @example
 * ```typescript
 * const server = buildServerWithAuth(
 *   'https://api.example.com',
 *   'Production API',
 *   ['bearer', 'apiKey']
 * );
 * ```
 */
export function buildServerWithAuth(
  url: string,
  description: string,
  authSchemes: string[],
): OpenApiServer & { 'x-auth-schemes': string[] } {
  return {
    url,
    description: `${description} | Auth: ${authSchemes.join(', ')}`,
    'x-auth-schemes': authSchemes,
  };
}

/**
 * Builds development server configuration with common local development settings.
 *
 * @param port - Local server port
 * @param protocol - Protocol (http or https)
 * @param host - Host address
 * @returns Development server configuration
 *
 * @example
 * ```typescript
 * const devServer = buildDevelopmentServer(3000, 'http', 'localhost');
 * ```
 */
export function buildDevelopmentServer(
  port = 3000,
  protocol: 'http' | 'https' = 'http',
  host = 'localhost',
): OpenApiServer {
  return buildServerConfig(`${protocol}://${host}:${port}`, 'Development server', {
    protocol: {
      default: protocol,
      enum: ['http', 'https'],
      description: 'The protocol to use',
    },
    host: {
      default: host,
      description: 'Host address',
    },
    port: {
      default: port.toString(),
      description: 'Server port',
    },
  });
}

/**
 * Builds production server configuration with standard production settings.
 *
 * @param domain - Production domain
 * @param version - API version
 * @param regions - Available regions
 * @returns Production server configuration
 *
 * @example
 * ```typescript
 * const prodServer = buildProductionServer(
 *   'api.example.com',
 *   'v1',
 *   ['us-east', 'us-west', 'eu-central']
 * );
 * ```
 */
export function buildProductionServer(
  domain: string,
  version?: string,
  regions?: string[],
): OpenApiServer {
  const basePath = version ? `/${version}` : '';

  if (regions && regions.length > 0) {
    return buildServerConfig(
      `https://{region}.${domain}${basePath}`,
      'Production API with regional endpoints',
      {
        region: {
          default: regions[0],
          enum: regions,
          description: 'Regional endpoint',
        },
      },
    );
  }

  return buildServerConfig(`https://${domain}${basePath}`, 'Production API');
}

/**
 * Builds staging server configuration.
 *
 * @param domain - Staging domain
 * @param version - API version
 * @returns Staging server configuration
 *
 * @example
 * ```typescript
 * const stagingServer = buildStagingServer('staging-api.example.com', 'v1');
 * ```
 */
export function buildStagingServer(domain: string, version?: string): OpenApiServer {
  const basePath = version ? `/${version}` : '';
  return buildServerConfig(`https://${domain}${basePath}`, 'Staging API');
}

/**
 * Common server configuration presets
 */
export const SERVER_PRESETS = {
  /**
   * Standard three-tier environment setup
   */
  STANDARD_ENVIRONMENTS: (baseDomain: string, version?: string) => [
    buildProductionServer(baseDomain, version),
    buildStagingServer(`staging.${baseDomain}`, version),
    buildDevelopmentServer(),
  ],

  /**
   * Regional production setup
   */
  REGIONAL_PRODUCTION: (baseDomain: string, regions: string[], version?: string) => [
    buildProductionServer(baseDomain, version, regions),
    buildStagingServer(`staging.${baseDomain}`, version),
    buildDevelopmentServer(),
  ],

  /**
   * Microservices setup with service discovery
   */
  MICROSERVICES: (serviceName: string, namespace = 'default') => [
    buildServerConfig(
      `https://{environment}.${serviceName}.${namespace}.svc.cluster.local`,
      'Kubernetes service endpoint',
      {
        environment: {
          default: 'prod',
          enum: ['prod', 'staging', 'dev'],
          description: 'Environment namespace',
        },
      },
    ),
    buildDevelopmentServer(),
  ],
} as const;
