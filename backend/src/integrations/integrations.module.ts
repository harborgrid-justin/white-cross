/**
 * Integrations Module
 *
 * Provides integration clients for external systems with enterprise-grade features:
 * - Circuit breaker pattern for resilience
 * - Rate limiting to respect API quotas
 * - Exponential backoff retry logic
 * - Comprehensive logging and monitoring
 *
 * Currently supports:
 * - Student Information Systems (SIS) - PowerSchool, Infinite Campus, etc.
 *
 * Future integrations can follow the BaseApiClient pattern for consistent
 * implementation of reliability features.
 *
 * @module IntegrationsModule
 */

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

// Clients
import { SisApiClient } from './clients';

/**
 * Integrations Module
 *
 * Configures and exports integration clients for external API communication.
 *
 * Exports:
 * - SisApiClient: For Student Information System integrations
 *
 * @example
 * ```typescript
 * // In another module
 * @Module({
 *   imports: [IntegrationsModule],
 * })
 * export class StudentModule {}
 *
 * // In a service
 * @Injectable()
 * export class StudentService {
 *   constructor(private readonly sisApiClient: SisApiClient) {}
 *
 *   async syncFromSis(organizationId: string) {
 *     return this.sisApiClient.syncStudents(organizationId);
 *   }
 * }
 * ```
 */
@Module({
  imports: [
    // HttpModule for making HTTP requests
    HttpModule.register({
      timeout: 30000, // 30 seconds default timeout
      maxRedirects: 5,
    }),
    // ConfigModule for accessing environment variables
    ConfigModule,
  ],
  providers: [
    // Integration clients
    SisApiClient,
  ],
  exports: [
    // Export clients for use in other modules
    SisApiClient,
  ],
})
export class IntegrationsModule {}
