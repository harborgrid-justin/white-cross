/**
 * GraphQL Module
 *
 * Provides GraphQL API infrastructure for the White Cross platform.
 * Configures Apollo Server with NestJS integration, authentication,
 * and code-first schema generation.
 *
 * Features:
 * - Code-first schema with TypeScript decorators
 * - JWT authentication integration
 * - GraphQL Playground for development
 * - CORS configuration
 * - Error formatting and handling
 *
 * @module GraphQLModule
 */
import { Module } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import type { Request, Response } from 'express';
import { ContactResolver } from './resolvers/contact.resolver';
import { StudentResolver } from './resolvers/student.resolver';
import { ContactModule } from '../../contact/contact.module';
import { StudentModule } from '../../student/student.module';
import { GraphQLJSON } from 'graphql-scalars';

/**
 * GraphQL Module
 * Configures and provides GraphQL API endpoint
 */
@Module({
  imports: [
    // Import GraphQL with Apollo Server
    NestGraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // Auto-generate schema from TypeScript classes
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),

        // Sort schema alphabetically for consistency
        sortSchema: true,

        // Enable GraphQL Playground in development
        playground: configService.get('NODE_ENV') !== 'production',

        // Enable introspection (needed for Playground)
        introspection: true,

        // CORS configuration
        cors: {
          origin: configService.get('CORS_ORIGIN') || 'http://localhost:5173',
          credentials: true,
        },

        // Context builder - extracts request for authentication
        context: ({ req, res }: { req: Request; res: Response }) => ({ req, res }),

        // Custom scalars
        resolvers: {
          JSON: GraphQLJSON,
        },

        // Error formatting
        formatError: (error) => {
          // Log errors server-side
          console.error('GraphQL Error:', error);

          // Return sanitized error to client
          return {
            message: error.message,
            extensions: {
              code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
              ...(configService.get('NODE_ENV') !== 'production' && {
                stacktrace: error.extensions?.stacktrace,
              }),
            },
          };
        },

        // Include directives in schema
        includeDirectives: true,

        // Build schema options
        buildSchemaOptions: {
          dateScalarMode: 'timestamp', // Use timestamps for Date scalars
        },
      }),
      inject: [ConfigService],
    }),

    // Import feature modules that provide services
    ContactModule,
    StudentModule,
  ],
  providers: [
    // Register resolvers
    ContactResolver,
    StudentResolver,
  ],
  exports: [],
})
export class GraphQLModule {}
