import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DynamicResourcePoolService } from '../services/dynamic-resource-pool.service';

interface ThrottleConfig {
  maxConcurrent: number;
  queueSize: number;
  timeoutMs: number;
  priority: number;
  resourceType: string;
}

interface RequestMetrics {
  startTime: number;
  endTime?: number;
  resourcesUsed: string[];
  success: boolean;
  executionTime?: number;
}

/**
 * Resource Throttle Interceptor
 *
 * Manages resource allocation and throttling for requests
 * using Discovery Service patterns
 */
@Injectable()
export class ResourceThrottleInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResourceThrottleInterceptor.name);
  private readonly activeRequests = new Map<string, RequestMetrics>();
  private readonly requestQueue = new Map<
    string,
    Array<{ resolve: Function; reject: Function; config: ThrottleConfig }>
  >();
  private readonly resourceCounters = new Map<string, number>();

  constructor(
    private readonly reflector: Reflector,
    private readonly resourcePoolService: DynamicResourcePoolService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const handler = context.getHandler();
    const controllerClass = context.getClass();

    // Get throttle configuration from metadata
    const methodThrottleConfig = this.reflector.get<ThrottleConfig>(
      'resource-throttle',
      handler,
    );
    const classThrottleConfig = this.reflector.get<ThrottleConfig>(
      'resource-throttle',
      controllerClass,
    );

    const throttleConfig = methodThrottleConfig || classThrottleConfig;

    if (!throttleConfig) {
      // No throttling configured, proceed normally
      return next.handle();
    }

    const requestId = this.generateRequestId(context);
    const resourceType = throttleConfig.resourceType || 'default';

    this.logger.debug(
      `Throttling request ${requestId} for resource type: ${resourceType}`,
    );

    try {
      // Check if we can acquire resources
      const canProceed = await this.tryAcquireResources(
        requestId,
        throttleConfig,
      );

      if (!canProceed) {
        // Add to queue if queue size allows
        if (this.getQueueSize(resourceType) < throttleConfig.queueSize) {
          return new Observable((subscriber) => {
            this.addToQueue(requestId, throttleConfig, subscriber);
          });
        } else {
          // Queue is full, reject request
          this.logger.warn(
            `Resource throttle queue full for ${resourceType}, rejecting request ${requestId}`,
          );
          return throwError(
            () => new Error(`Resource limit exceeded for ${resourceType}`),
          );
        }
      }

      // Record request start
      this.recordRequestStart(requestId, resourceType);

      // Execute the request with resource monitoring
      return next.handle().pipe(
        tap(() => {
          this.recordRequestSuccess(requestId);
        }),
        catchError((error) => {
          this.recordRequestError(requestId, error);
          return throwError(() => error);
        }),
        tap(() => {
          // Release resources and process queue
          this.releaseResources(requestId, throttleConfig);
          this.processQueue(resourceType);
        }),
      );
    } catch (error) {
      this.logger.error(
        `Error in resource throttle interceptor for request ${requestId}:`,
        error,
      );
      return throwError(() => error);
    }
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);

    return `${request.method || 'unknown'}_${timestamp}_${random}`;
  }

  /**
   * Try to acquire resources for the request
   */
  private async tryAcquireResources(
    requestId: string,
    config: ThrottleConfig,
  ): Promise<boolean> {
    const resourceType = config.resourceType || 'default';
    const currentCount = this.resourceCounters.get(resourceType) || 0;

    if (currentCount >= config.maxConcurrent) {
      this.logger.debug(
        `Max concurrent limit reached for ${resourceType}: ${currentCount}/${config.maxConcurrent}`,
      );
      return false;
    }

    // Try to acquire from resource pool
    try {
      const resource = await this.resourcePoolService.getResource(
        resourceType,
        config.timeoutMs,
      );

      if (resource) {
        this.resourceCounters.set(resourceType, currentCount + 1);
        this.logger.debug(
          `Acquired resource for ${requestId}, count: ${currentCount + 1}/${config.maxConcurrent}`,
        );
        return true;
      }
    } catch (error) {
      this.logger.warn(
        `Failed to acquire resource from pool for ${requestId}:`,
        error,
      );
    }

    return false;
  }

  /**
   * Add request to queue
   */
  private addToQueue(
    requestId: string,
    config: ThrottleConfig,
    subscriber: any,
  ): void {
    const resourceType = config.resourceType || 'default';

    if (!this.requestQueue.has(resourceType)) {
      this.requestQueue.set(resourceType, []);
    }

    const queue = this.requestQueue.get(resourceType)!;

    const queueItem = {
      resolve: (result: any) => {
        subscriber.next(result);
        subscriber.complete();
      },
      reject: (error: any) => {
        subscriber.error(error);
      },
      config,
    };

    // Insert based on priority (higher priority first)
    let insertIndex = queue.length;
    for (let i = 0; i < queue.length; i++) {
      if (config.priority > queue[i].config.priority) {
        insertIndex = i;
        break;
      }
    }

    queue.splice(insertIndex, 0, queueItem);

    this.logger.debug(
      `Added request ${requestId} to queue at position ${insertIndex}, queue size: ${queue.length}`,
    );

    // Set timeout for queued request
    setTimeout(() => {
      const index = queue.indexOf(queueItem);
      if (index !== -1) {
        queue.splice(index, 1);
        queueItem.reject(new Error(`Request ${requestId} timed out in queue`));
        this.logger.warn(
          `Request ${requestId} timed out in queue after ${config.timeoutMs}ms`,
        );
      }
    }, config.timeoutMs);
  }

  /**
   * Process queued requests
   */
  private async processQueue(resourceType: string): Promise<void> {
    const queue = this.requestQueue.get(resourceType);
    if (!queue || queue.length === 0) {
      return;
    }

    const currentCount = this.resourceCounters.get(resourceType) || 0;
    const nextRequest = queue.shift();

    if (nextRequest && currentCount < nextRequest.config.maxConcurrent) {
      try {
        const resource = await this.resourcePoolService.getResource(
          resourceType,
          nextRequest.config.timeoutMs,
        );

        if (resource) {
          this.resourceCounters.set(resourceType, currentCount + 1);
          this.logger.debug(
            `Processing queued request for ${resourceType}, count: ${currentCount + 1}`,
          );

          // The queued request will be processed through the normal flow
          // This is a simplified approach - in a real implementation,
          // you'd need to properly handle the queued execution
          nextRequest.resolve(resource);
        } else {
          nextRequest.reject(new Error('Failed to acquire resource from pool'));
        }
      } catch (error) {
        nextRequest.reject(error);
      }
    } else if (nextRequest) {
      // Put it back in the queue if we can't process it yet
      queue.unshift(nextRequest);
    }
  }

  /**
   * Release resources after request completion
   */
  private async releaseResources(
    requestId: string,
    config: ThrottleConfig,
  ): Promise<void> {
    const resourceType = config.resourceType || 'default';
    const currentCount = this.resourceCounters.get(resourceType) || 0;

    if (currentCount > 0) {
      this.resourceCounters.set(resourceType, currentCount - 1);
      this.logger.debug(
        `Released resource for ${requestId}, count: ${currentCount - 1}`,
      );
    }

    try {
      // Release resource back to pool
      // Note: In a real implementation, you'd need to track the actual resource instance
      // For now, we'll just handle the counter logic
      this.logger.debug(`Resource released for ${resourceType}`);
    } catch (error) {
      this.logger.warn(
        `Error releasing resource to pool for ${requestId}:`,
        error,
      );
    }

    // Remove request tracking
    this.activeRequests.delete(requestId);
  }

  /**
   * Record request start
   */
  private recordRequestStart(requestId: string, resourceType: string): void {
    this.activeRequests.set(requestId, {
      startTime: Date.now(),
      resourcesUsed: [resourceType],
      success: false,
    });
  }

  /**
   * Record successful request completion
   */
  private recordRequestSuccess(requestId: string): void {
    const metrics = this.activeRequests.get(requestId);
    if (metrics) {
      metrics.endTime = Date.now();
      metrics.executionTime = metrics.endTime - metrics.startTime;
      metrics.success = true;

      this.logger.debug(
        `Request ${requestId} completed successfully in ${metrics.executionTime}ms`,
      );
    }
  }

  /**
   * Record request error
   */
  private recordRequestError(requestId: string, error: any): void {
    const metrics = this.activeRequests.get(requestId);
    if (metrics) {
      metrics.endTime = Date.now();
      metrics.executionTime = metrics.endTime - metrics.startTime;
      metrics.success = false;

      this.logger.warn(
        `Request ${requestId} failed after ${metrics.executionTime}ms:`,
        error.message,
      );
    }
  }

  /**
   * Get current queue size for resource type
   */
  private getQueueSize(resourceType: string): number {
    const queue = this.requestQueue.get(resourceType);
    return queue ? queue.length : 0;
  }

  /**
   * Get current resource usage statistics
   */
  getResourceStats(): {
    resourceType: string;
    activeRequests: number;
    queuedRequests: number;
    totalProcessed: number;
    averageExecutionTime: number;
  }[] {
    const stats: any[] = [];

    for (const [resourceType, count] of this.resourceCounters.entries()) {
      const queueSize = this.getQueueSize(resourceType);

      // Calculate average execution time for completed requests
      const completedRequests = Array.from(this.activeRequests.values()).filter(
        (m) => m.resourcesUsed.includes(resourceType) && m.executionTime,
      );

      const averageExecutionTime =
        completedRequests.length > 0
          ? completedRequests.reduce(
              (sum, m) => sum + (m.executionTime || 0),
              0,
            ) / completedRequests.length
          : 0;

      stats.push({
        resourceType,
        activeRequests: count,
        queuedRequests: queueSize,
        totalProcessed: completedRequests.length,
        averageExecutionTime,
      });
    }

    return stats;
  }

  /**
   * Clear all queues and reset counters (for testing/cleanup)
   */
  reset(): void {
    this.requestQueue.clear();
    this.resourceCounters.clear();
    this.activeRequests.clear();
    this.logger.log('Resource throttle interceptor reset');
  }
}
