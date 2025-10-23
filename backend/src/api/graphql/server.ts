/**
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
 */

import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { Server, Request, ResponseToolkit } from '@hapi/hapi';
import typeDefs from './schema';
import resolvers from './resolvers';

/**
 * GraphQL context from Hapi request
 */
interface GraphQLContext {
  user?: any;
  request: Request;
  h: ResponseToolkit;
}

/**
 * Create Apollo Server instance
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
 * Register GraphQL endpoint with Hapi server
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
