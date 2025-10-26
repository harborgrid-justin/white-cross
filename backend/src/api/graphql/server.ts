/**
 * @fileoverview Apollo Server Setup and Integration for Hapi.js
 *
 * Configures and integrates Apollo Server with the Hapi.js framework to provide
 * a GraphQL API endpoint for the White Cross healthcare platform. Implements
 * authentication, authorization, error handling, and development tooling.
 *
 * @module api/graphql/server
 * @since 1.0.0
 *
 * @requires @apollo/server - Apollo Server for GraphQL
 * @requires @hapi/hapi - Hapi.js framework
 * @requires ./schema - GraphQL type definitions
 * @requires ./resolvers - GraphQL resolver implementations
 *
 * @security JWT authentication integrated via Hapi auth context
 * @compliance HIPAA - Implements secure PHI data access through GraphQL
 *
 * LOC: GQL-SERVER-001
 * WC-GQL-SERVER-001 | Apollo Server Setup for Hapi
 *
 * Purpose: Configure and integrate Apollo Server with Hapi.js
 * Inspired by: TwentyHQ GraphQL API implementation
 * Features: Authentication integration, error handling, playground
 *
 * UPSTREAM (imports from):
 *   - GraphQL schema and resolvers
 *   - Hapi server
 *
 * DOWNSTREAM (imported by):
 *   - Main server index
 *
 * @example
 * Import and register with Hapi server:
 * ```typescript
 * import { registerGraphQL } from './api/graphql/server';
 *
 * // In server initialization
 * await registerGraphQL(hapiServer);
 * // GraphQL endpoint now available at POST/GET /graphql
 * ```
 */

import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { Server, Request, ResponseToolkit } from '@hapi/hapi';
import typeDefs from './schema';
import resolvers from './resolvers';

/**
 * GraphQL execution context passed to all resolvers.
 *
 * Contains authenticated user information from Hapi auth credentials
 * and access to Hapi request/response objects for advanced operations.
 *
 * @interface GraphQLContext
 * @property {any} [user] - Authenticated user from Hapi JWT auth (undefined if not authenticated)
 * @property {Request} request - Hapi.js request object
 * @property {ResponseToolkit} h - Hapi.js response toolkit
 *
 * @example
 * Usage in GraphQL resolver:
 * ```typescript
 * const resolver = async (parent, args, context: GraphQLContext) => {
 *   if (!context.user) {
 *     throw new GraphQLError('Authentication required');
 *   }
 *   const userId = context.user.id;
 *   // Perform authenticated operation
 * };
 * ```
 */
interface GraphQLContext {
  user?: any;
  request: Request;
  h: ResponseToolkit;
}

/**
 * Create and configure Apollo Server instance with healthcare platform settings.
 *
 * Initializes Apollo Server with GraphQL schema, resolvers, error formatting,
 * and development tooling. Configures error handling to sanitize sensitive
 * information in production while providing detailed debugging in development.
 *
 * @function createApolloServer
 * @returns {ApolloServer<GraphQLContext>} Configured Apollo Server instance
 *
 * @example
 * ```typescript
 * const apolloServer = createApolloServer();
 * await apolloServer.start();
 * // Server ready to execute GraphQL operations
 * ```
 *
 * @example
 * Server configuration features:
 * ```typescript
 * const server = createApolloServer();
 * // - Type-safe GraphQL schema
 * // - Authenticated context with user credentials
 * // - Error sanitization for HIPAA compliance
 * // - Development playground enabled
 * // - Stacktraces in non-production only
 * ```
 */
export function createApolloServer() {
  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
    plugins: [
      // Enable GraphQL Playground in development
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    formatError: (formattedError, error) => {
      // Log errors
      console.error('GraphQL Error:', formattedError);

      // Return sanitized error to client
      return {
        message: formattedError.message,
        extensions: {
          code: formattedError.extensions?.code || 'INTERNAL_SERVER_ERROR',
          ...(process.env.NODE_ENV !== 'production' && {
            stacktrace: formattedError.extensions?.stacktrace,
          }),
        },
      };
    },
  });

  return server;
}

/**
 * Register GraphQL API endpoint with Hapi server.
 *
 * Integrates Apollo Server with Hapi.js by registering POST and GET routes
 * at `/graphql`. Configures authentication integration, request parsing,
 * error handling, and development tooling (GraphQL Playground).
 *
 * Features:
 * - Optional authentication (supports both authenticated and public queries)
 * - Automatic context building from Hapi auth credentials
 * - Error handling with appropriate HTTP status codes (200, 400, 401, 500)
 * - GraphQL Playground for development/testing
 * - Introspection query support
 *
 * @async
 * @function registerGraphQL
 * @param {Server} hapiServer - Hapi.js server instance to register routes on
 * @returns {Promise<ApolloServer<GraphQLContext>>} Started Apollo Server instance
 *
 * @throws {Error} When Apollo Server fails to start
 * @throws {Error} When route registration fails
 *
 * @example
 * Basic registration in server initialization:
 * ```typescript
 * import Hapi from '@hapi/hapi';
 * import { registerGraphQL } from './api/graphql/server';
 *
 * const server = Hapi.server({ port: 3001 });
 * await registerGraphQL(server);
 * await server.start();
 * console.log('GraphQL endpoint: http://localhost:3001/graphql');
 * ```
 *
 * @example
 * Making GraphQL requests:
 * ```typescript
 * // POST request with query
 * const response = await fetch('http://localhost:3001/graphql', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'Authorization': 'Bearer <jwt-token>'
 *   },
 *   body: JSON.stringify({
 *     query: `
 *       query GetStudents {
 *         students(page: 1, limit: 20) {
 *           students { id firstName lastName }
 *           pagination { total }
 *         }
 *       }
 *     `
 *   })
 * });
 * ```
 *
 * @example
 * GraphQL mutation with variables:
 * ```typescript
 * fetch('http://localhost:3001/graphql', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     query: `
 *       mutation CreateContact($input: ContactInput!) {
 *         createContact(input: $input) {
 *           id
 *           fullName
 *         }
 *       }
 *     `,
 *     variables: {
 *       input: {
 *         firstName: "John",
 *         lastName: "Doe",
 *         type: "guardian"
 *       }
 *     }
 *   })
 * });
 * ```
 */
export async function registerGraphQL(hapiServer: Server) {
  const apolloServer = createApolloServer();

  // Start Apollo Server
  await apolloServer.start();

  // Register POST endpoint for GraphQL mutations and queries
  hapiServer.route({
    method: 'POST',
    path: '/graphql',
    options: {
      auth: {
        mode: 'optional', // Allow both authenticated and unauthenticated requests
      },
      payload: {
        parse: true,
        allow: ['application/json', 'application/graphql'],
      },
      tags: ['api', 'graphql'],
      description: 'GraphQL API endpoint',
      notes: 'Flexible, type-safe API for querying and mutating data. Supports introspection in development.',
    },
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        // Build context with user from Hapi auth
        const context: GraphQLContext = {
          user: request.auth.credentials || undefined,
          request,
          h,
        };

        // Execute GraphQL operation
        const response = await apolloServer.executeOperation(
          {
            query: (request.payload as any).query,
            variables: (request.payload as any).variables,
            operationName: (request.payload as any).operationName,
          },
          { contextValue: context }
        );

        // Check for errors in response
        if (response.body.kind === 'single') {
          const body = response.body.singleResult;
          
          // Set appropriate status code based on errors
          let statusCode = 200;
          if (body.errors) {
            const hasAuthError = body.errors.some(
              (err: any) =>
                err.extensions?.code === 'UNAUTHENTICATED' ||
                err.extensions?.code === 'FORBIDDEN'
            );
            if (hasAuthError) {
              statusCode = 401;
            } else {
              statusCode = 400;
            }
          }

          return h.response(body).code(statusCode);
        }

        return h.response(response.body).code(200);
      } catch (error) {
        console.error('GraphQL handler error:', error);
        return h
          .response({
            errors: [
              {
                message: 'Internal server error',
                extensions: { code: 'INTERNAL_SERVER_ERROR' },
              },
            ],
          })
          .code(500);
      }
    },
  });

  // Register GET endpoint for GraphQL Playground and introspection queries
  hapiServer.route({
    method: 'GET',
    path: '/graphql',
    options: {
      auth: {
        mode: 'optional',
      },
      tags: ['api', 'graphql'],
      description: 'GraphQL Playground and introspection endpoint',
    },
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        // Build context with user from Hapi auth
        const context: GraphQLContext = {
          user: request.auth.credentials || undefined,
          request,
          h,
        };

        // Check if this is a GraphQL query in GET params
        const query = (request.query as any).query;
        if (query) {
          const response = await apolloServer.executeOperation(
            {
              query,
              variables: (request.query as any).variables
                ? JSON.parse((request.query as any).variables)
                : undefined,
            },
            { contextValue: context }
          );

          return h.response(response.body).code(200);
        }

        // Otherwise serve the playground HTML
        return h
          .response(
            `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>GraphQL Playground</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <div id="root">
    <style>
      body {
        margin: 0;
        overflow: hidden;
      }
      #root {
        height: 100vh;
      }
    </style>
    <h1 style="text-align: center; padding: 40px;">GraphQL Endpoint</h1>
    <p style="text-align: center;">
      POST requests to /graphql with GraphQL queries.<br>
      Use a GraphQL client like Apollo Client or GraphQL Playground.
    </p>
    <p style="text-align: center; margin-top: 20px;">
      <a href="https://studio.apollographql.com/sandbox/explorer" target="_blank">
        Open Apollo Sandbox →
      </a>
    </p>
  </div>
</body>
</html>`
          )
          .type('text/html');
      } catch (error) {
        console.error('GraphQL GET handler error:', error);
        return h
          .response({
            errors: [
              {
                message: 'Internal server error',
                extensions: { code: 'INTERNAL_SERVER_ERROR' },
              },
            ],
          })
          .code(500);
      }
    },
  });

  console.log('✅ GraphQL endpoint registered at /graphql');
  
  return apolloServer;
}

export default registerGraphQL;
