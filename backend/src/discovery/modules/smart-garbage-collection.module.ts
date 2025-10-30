import { Module, DynamicModule, OnApplicationBootstrap, OnApplicationShutdown, Injectable } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService, Reflector } from '@nestjs/core';
import { SmartGarbageCollectionService } from './services/smart-garbage-collection.service';
import { MemoryLeakDetectionService } from './services/memory-leak-detection.service';
import { GCOptimizationService } from './services/gc-optimization.service';
import { MemoryPressureInterceptor } from './interceptors/memory-pressure.interceptor';
import { GCSchedulerGuard } from './guards/gc-scheduler.guard';

export interface SmartGarbageCollectionOptions {
  enableAutoGc?: boolean;
  gcThresholdMB?: number;
  aggressiveGcThresholdMB?: number;
  monitoringInterval?: number; // seconds
  leakDetectionEnabled?: boolean;
  performanceOptimization?: boolean;
  discoveryEnabled?: boolean;
}

@Injectable()
class SmartGarbageCollectionModuleService implements OnApplicationBootstrap, OnApplicationShutdown {
  private gcMonitoringInterval?: NodeJS.Timeout;
  private leakDetectionInterval?: NodeJS.Timeout;
  private optimizationInterval?: NodeJS.Timeout;

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly gcService: SmartGarbageCollectionService,
    private readonly leakDetectionService: MemoryLeakDetectionService,
    private readonly optimizationService: GCOptimizationService,
  ) {}

  async onApplicationBootstrap() {
    await this.discoverMemoryIntensiveProviders();
    this.gcService.startMonitoring();
    
    // Monitor GC and memory every 15 seconds
    this.gcMonitoringInterval = setInterval(async () => {
      await this.monitorGarbageCollection();
    }, 15000);

    // Check for memory leaks every 5 minutes
    this.leakDetectionInterval = setInterval(async () => {
      await this.leakDetectionService.detectMemoryLeaks();
    }, 300000);

    // Optimize GC strategy every 10 minutes
    this.optimizationInterval = setInterval(async () => {
      await this.optimizationService.performOptimization();
    }, 600000);
  }

  async onApplicationShutdown() {
    if (this.gcMonitoringInterval) {
      clearInterval(this.gcMonitoringInterval);
    }
    if (this.leakDetectionInterval) {
      clearInterval(this.leakDetectionInterval);
    }
    if (this.optimizationInterval) {
      clearInterval(this.optimizationInterval);
    }
    
    this.gcService.stopMonitoring();
    await this.gcService.performFinalCleanup();
  }

  private async discoverMemoryIntensiveProviders() {
    const providers = this.discoveryService.getProviders();
    
    for (const wrapper of providers) {
      if (!wrapper.metatype) continue;
      
      // Check for garbage-collection metadata
      const gcMetadata = this.reflector.get('garbage-collection', wrapper.metatype);
      if (gcMetadata?.enabled) {
        this.gcService.registerMemoryIntensiveProvider(
          wrapper.name || wrapper.token?.toString() || 'unknown',
          {
            priority: gcMetadata.priority || 'normal',
            cleanupStrategy: gcMetadata.strategy || 'standard',
            memoryThreshold: gcMetadata.threshold || 50, // MB
            customCleanup: gcMetadata.customCleanup,
          }
        );
      }

      // Check for memory-leak-prone providers
      const leakProneMetadata = this.reflector.get('leak-prone', wrapper.metatype);
      if (leakProneMetadata) {
        this.leakDetectionService.addMonitoredProvider(
          wrapper.name || 'unknown',
          leakProneMetadata
        );
      }

      // Check for heavy-computation providers
      const computationMetadata = this.reflector.get('heavy-computation', wrapper.metatype);
      if (computationMetadata) {
        this.gcService.registerComputationIntensiveProvider(
          wrapper.name || 'unknown',
          computationMetadata
        );
      }
    }
  }

  private async monitorGarbageCollection() {
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024;
    
    // Trigger GC based on thresholds
    if (heapUsedMB > 450) { // Aggressive GC threshold
      await this.gcService.performAggressiveGarbageCollection();
    } else if (heapUsedMB > 350) { // Standard GC threshold
      await this.gcService.performSmartGarbageCollection();
    }
    
    // Update GC statistics
    this.gcService.updateGcMetrics(memoryUsage);
  }
}

/**
 * Smart Garbage Collection Module
 * 
 * Uses Discovery Service to:
 * 1. Automatically discover memory-intensive providers
 * 2. Implement intelligent garbage collection strategies
 * 3. Detect and prevent memory leaks
 * 4. Optimize GC timing based on application patterns
 */
@Module({
  imports: [DiscoveryModule],
  providers: [
    SmartGarbageCollectionService,
    MemoryLeakDetectionService,
    GCOptimizationService,
    MemoryPressureInterceptor,
    GCSchedulerGuard,
    SmartGarbageCollectionModuleService,
  ],
  exports: [
    SmartGarbageCollectionService,
    MemoryLeakDetectionService,
    GCOptimizationService,
    MemoryPressureInterceptor,
    GCSchedulerGuard,
  ],
})
export class SmartGarbageCollectionModule {
  static forRoot(options: SmartGarbageCollectionOptions = {}): DynamicModule {
    return {
      module: SmartGarbageCollectionModule,
      imports: [DiscoveryModule],
      providers: [
        SmartGarbageCollectionService,
        MemoryLeakDetectionService,
        GCOptimizationService,
        MemoryPressureInterceptor,
        GCSchedulerGuard,
        SmartGarbageCollectionModuleService,
        {
          provide: 'SMART_GC_OPTIONS',
          useValue: {
            enableAutoGc: true,
            gcThresholdMB: 350,
            aggressiveGcThresholdMB: 450,
            monitoringInterval: 15,
            leakDetectionEnabled: true,
            performanceOptimization: true,
            discoveryEnabled: true,
            ...options,
          },
        },
      ],
      exports: [
        SmartGarbageCollectionService,
        MemoryLeakDetectionService,
        GCOptimizationService,
        MemoryPressureInterceptor,
        GCSchedulerGuard,
      ],
    };
  }
}
