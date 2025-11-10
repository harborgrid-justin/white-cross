/**
 * Common Module
 *
 * Shared module providing database connections, logging, and common services.
 */

import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from './providers/database.providers';
import { RequestContextService } from './services/request-context.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    ...databaseProviders,
    RequestContextService
  ],
  exports: [
    ...databaseProviders,
    RequestContextService
  ]
})
export class CommonModule {}
