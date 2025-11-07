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
 * - PHI sanitization for HIPAA compliance
 * - Input validation with class-validator
 * - Query complexity limiting
 *
 * @module GraphQLModule
 */
import { Module, ValidationPipe } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { ModuleRef } from '@nestjs/core';
import { join } from 'path';
import type { Request, Response } from 'express';
import { ContactResolver } from './resolvers/contact.resolver';
import { StudentResolver } from './resolvers/student.resolver';
import { HealthRecordResolver } from './resolvers/health-record.resolver';
import { SubscriptionResolver } from './resolvers/subscription.resolver';
import { ContactModule } from '@/contact';
import { StudentModule } from '@/student';
import { MedicationModule } from '@/medication';
import { HealthRecordModule } from '@/health-record';
import { AuthModule } from '@/auth';
import { GraphQLJSON } from 'graphql-scalars';
import { sanitizeGraphQLError, containsPHI } from './errors/phi-sanitizer';
import { DataLoaderFactory } from './dataloaders/dataloader.factory';
import { ComplexityPlugin } from './plugins/complexity.plugin';
import { PubSubModule } from './pubsub/pubsub.module';
import {
  DateTimeScalar,
  PhoneNumberScalar,
  EmailAddressScalar,
  UUIDScalar,
} from './scalars';

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
      useFactory: async (
        configService: ConfigService,
        moduleRef: ModuleRef,
      ) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        const isDocker = configService.get('DOCKER') === 'true';

        return {
          // Auto-generate schema from TypeScript classes
          // In production or Docker, generate in memory only
          autoSchemaFile:
            isProduction || isDocker
              ? true
              : join(process.cwd(), 'src/schema.gql'),

          // Sort schema alphabetically for consistency
          sortSchema: true,

          // Enable GraphQL Playground in development
          playground: !isProduction,

          // Enable introspection (needed for Playground)
          introspection: true,

          // CORS configuration
          cors: {
            origin:
              configService.get('security.cors.origin') ||
              'http://localhost:5173',
            credentials: true,
          },

          // Context builder - extracts request for authentication and creates DataLoaders
          context: ({ req, res }: { req: Request; res: Response }) => {
            // Get DataLoaderFactory from the request scope
            // Each GraphQL request gets its own DataLoaderFactory instance
            // This ensures proper caching scope and prevents data leakage between requests
            const dataLoaderFactory = moduleRef.get(DataLoaderFactory, {
              strict: false,
            });

            // Create all DataLoaders for this request
            const loaders = dataLoaderFactory.createLoaders();

            return {
              req,
              res,
              // Add DataLoaders to context so resolvers can access them
              loaders,
            };
          },

          // Custom scalars
          resolvers: {
            JSON: GraphQLJSON,
          },

          // WebSocket subscriptions configuration
          subscriptions: {
            'graphql-ws': {
              path: '/graphql',
              onConnect: (context: Record<string, unknown>) => {
                const { connectionParams, extra } = context;

                // Authenticate WebSocket connection
                const token = connectionParams?.authorization?.replace(
                  'Bearer ',
                  '',
                );
                if (!token) {
                  console.warn('WebSocket connection attempted without token');
                  throw new Error('Missing authentication token');
                }

                // Note: Token verification happens in the guard
                // We just pass the token through context here
                return { token };
              },
              onDisconnect: (context: Record<string, unknown>) => {
                console.log('Client disconnected from GraphQL subscriptions');
              },
            },
          },

          // Error formatting with PHI sanitization (HIPAA compliance)
          formatError: (error) => {
            // Check if error contains PHI for audit logging
            const hasPHI = containsPHI(error.message);
            if (hasPHI) {
              console.warn(
                'SECURITY ALERT: GraphQL error contained PHI and was sanitized',
                {
                  timestamp: new Date().toISOString(),
                  errorCode: error.extensions?.code,
                  path: error.path,
                },
              );
            }

            // Log errors server-side (before sanitization for debugging)
            console.error('GraphQL Error:', {
              message: error.message,
              code: error.extensions?.code,
              path: error.path,
            });

            // Sanitize error to remove any PHI
            const sanitizedError = sanitizeGraphQLError(error);

            // Return sanitized error to client
            return {
              message: sanitizedError.message,
              extensions: {
                code:
                  sanitizedError.extensions?.code || 'INTERNAL_SERVER_ERROR',
                ...(!isProduction && {
                  stacktrace: sanitizedError.extensions?.stacktrace,
                }),
              },
              // Include path for debugging (no PHI in paths)
              ...(error.path && { path: error.path }),
            };
          },

          // Include directives in schema
          includeDirectives: true,

          // Build schema options
          buildSchemaOptions: {
            dateScalarMode: 'timestamp', // Use timestamps for Date scalars
          },
        };
      },
      inject: [ConfigService, ModuleRef],
    }),

    // Import feature modules that provide services
    ContactModule,
    StudentModule,
    MedicationModule,
    HealthRecordModule,
    AuthModule, // Required for TokenBlacklistService in GqlAuthGuard
    PubSubModule, // Required for subscriptions
  ],
  providers: [
    // Register resolvers
    ContactResolver,
    StudentResolver,
    HealthRecordResolver,
    SubscriptionResolver, // Real-time subscriptions

    // DataLoader factory for efficient data fetching
    DataLoaderFactory,

    // Query complexity limiting plugin
    ComplexityPlugin,

    // Register custom scalars
    DateTimeScalar,
    PhoneNumberScalar,
    EmailAddressScalar,
    UUIDScalar,

    // Global validation pipe for GraphQL
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true, // Auto-transform payloads to DTO instances
          whitelist: true, // Strip non-whitelisted properties
          forbidNonWhitelisted: false, // Don't throw on extra properties (just strip them)
          forbidUnknownValues: true, // Throw on unknown values
          validationError: {
            target: false, // Don't expose target object in errors
            value: false, // Don't expose value in errors (may contain PHI)
          },
          // Custom error message formatting
          exceptionFactory: (errors) => {
            // Sanitize validation errors to avoid exposing PHI
            const sanitizedErrors = errors.map((error) => ({
              field: error.property,
              constraints: error.constraints,
              // Don't include the actual value to avoid PHI exposure
            }));

            return {
              statusCode: 400,
              message: 'Validation failed',
              errors: sanitizedErrors,
            };
          },
        }),
    },
  ],
  exports: [],
})
export class GraphQLModule {}
