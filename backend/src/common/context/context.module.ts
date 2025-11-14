/**
 * Context Module
 *
 * Provides request context management for the White Cross healthcare platform.
 */

import { Module, Global, MiddlewareConsumer } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { RequestContextService } from './request-context.service';
import { ContextInterceptor, ContextMiddleware, ContextGuard } from './context.interceptor';

@Global()
@Module({
  providers: [
    RequestContextService,
    ContextInterceptor,
    ContextMiddleware,
    ContextGuard,
    // TEMPORARILY DISABLED FOR TESTING
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ContextInterceptor,
    // },
    // TEMPORARILY DISABLED FOR TESTING
    // {
    //   provide: APP_GUARD,
    //   useClass: ContextGuard,
    // },
  ],
  exports: [RequestContextService, ContextInterceptor, ContextMiddleware, ContextGuard],
})
export class ContextModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextMiddleware).forRoutes('*');
  }
}
