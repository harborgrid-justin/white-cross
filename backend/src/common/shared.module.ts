/**
 * Shared Module
 *
 * Main module that aggregates all common/shared functionality for the White Cross healthcare platform.
 * This module provides global services and utilities used across the application.
 */

import { Global, Module } from '@nestjs/common';
import { LoggingModule } from './logging/logging.module';
import { ContextModule } from './context/context.module';
import { CqrsModule } from './cqrs/cqrs.module';
import { EnterpriseModule } from './enterprise/enterprise.module';

@Global()
@Module({
  imports: [
    LoggingModule,
    ContextModule,
    CqrsModule,
    EnterpriseModule,
  ],
  exports: [
    LoggingModule,
    ContextModule,
    CqrsModule,
    EnterpriseModule,
  ],
})
export class SharedModule {}