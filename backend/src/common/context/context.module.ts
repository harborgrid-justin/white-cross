/**
 * Context Module
 *
 * Provides request context management for the White Cross healthcare platform.
 */

import { Module, Global, MiddlewareConsumer } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import {
  RequestContextService,
  ContextInitializerService
} from './request-context.service';
import {
  ContextInterceptor,
  ContextMiddleware,
  ContextGuard
} from './context.interceptor';

@Global()
@Module({
  providers: [
    RequestContextService,
    ContextInitializerService,
    ContextInterceptor,
    ContextMiddleware,
    ContextGuard,
    {
      provide: APP_INTERCEPTOR,
      useClass: ContextInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ContextGuard,
    },
  ],
  exports: [
    RequestContextService,
    ContextInitializerService,
    ContextInterceptor,
    ContextMiddleware,
    ContextGuard,
  ],
})
export class ContextModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextMiddleware).forRoutes('*');
  }
}