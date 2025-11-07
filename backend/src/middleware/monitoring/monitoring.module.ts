/**
 * LOC: WC-MODULE-MONITORING-001
 * Monitoring Module - Comprehensive monitoring middleware for NestJS
 *
 * Provides audit logging, distributed tracing, metrics collection, and performance monitoring
 * for healthcare applications with HIPAA compliance.
 */

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditMiddleware } from './audit.middleware';
import { TracingMiddleware } from './tracing.middleware';
import { MetricsMiddleware } from './metrics.middleware';
import { PerformanceMiddleware } from './performance.middleware';
import { PerformanceInterceptor } from './performance.interceptor';

@Module({
  providers: [
    AuditMiddleware,
    TracingMiddleware,
    MetricsMiddleware,
    PerformanceMiddleware,
    PerformanceInterceptor,
    {
      provide: APP_INTERCEPTOR,
      useExisting: PerformanceInterceptor,
    },
  ],
  exports: [AuditMiddleware, TracingMiddleware, MetricsMiddleware, PerformanceMiddleware],
})
export class MonitoringModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply middleware in order: tracing -> metrics -> performance -> audit
    consumer.apply(TracingMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });

    consumer.apply(MetricsMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });

    consumer.apply(PerformanceMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });

    consumer.apply(AuditMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
