import { CanActivate, ExecutionContext, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { MemoryMonitorService } from '../services/memory-monitor.service';

/**
 * Memory Threshold Guard
 *
 * Uses Discovery Service to protect endpoints when memory usage is too high
 * and automatically discovers memory-sensitive operations
 */
@Injectable()
export class MemoryThresholdGuard implements CanActivate {
  private readonly logger = new Logger(MemoryThresholdGuard.name);

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly memoryMonitor: MemoryMonitorService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const handler = context.getHandler();
    const controller = context.getClass();

    // Check if this endpoint is memory-sensitive
    const memorySensitive =
      this.reflector.get('memory-sensitive', controller) ||
      this.reflector.get('memory-sensitive', handler);

    if (!memorySensitive) {
      return true; // Not memory-sensitive, allow access
    }

    // Check current memory usage
    const memoryStats = this.memoryMonitor.getMemoryStats();
    const currentMemoryMB = memoryStats.current.heapUsed / 1024 / 1024;

    // Default thresholds
    const warningThreshold = memorySensitive.warningThreshold || 400;
    const blockThreshold = memorySensitive.blockThreshold || 480;

    if (currentMemoryMB > blockThreshold) {
      this.logger.error(
        `Blocking memory-sensitive operation: ${controller.name}.${handler.name} - Memory: ${currentMemoryMB.toFixed(2)}MB`,
      );
      throw new ServiceUnavailableException(
        'Service temporarily unavailable due to high memory usage',
      );
    }

    if (currentMemoryMB > warningThreshold) {
      this.logger.warn(
        `Allowing memory-sensitive operation with warning: ${controller.name}.${handler.name} - Memory: ${currentMemoryMB.toFixed(2)}MB`,
      );
    }

    return true;
  }
}
