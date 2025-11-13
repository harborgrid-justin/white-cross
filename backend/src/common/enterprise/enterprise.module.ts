import { DynamicModule, Module, Provider } from '@nestjs/common';
import { EnterpriseCacheService } from './services/enterprise-cache.service';
import { EnterpriseMetricsService } from './services/enterprise-metrics.service';

export interface EnterpriseModuleOptions {
  moduleName: string;
  enableCache?: boolean;
  enableMetrics?: boolean;
}

@Module({})
export class EnterpriseModule {
  static forModule(options: EnterpriseModuleOptions): DynamicModule {
    const providers: Provider[] = [];
    const exports: any[] = [];

    if (options.enableCache !== false) {
      providers.push({
        provide: EnterpriseCacheService,
        useFactory: () => new EnterpriseCacheService(options.moduleName),
      });
      exports.push(EnterpriseCacheService);
    }

    if (options.enableMetrics !== false) {
      providers.push({
        provide: EnterpriseMetricsService,
        useFactory: () => new EnterpriseMetricsService(options.moduleName),
      });
      exports.push(EnterpriseMetricsService);
    }

    return {
      module: EnterpriseModule,
      providers,
      exports,
      global: false,
    };
  }
}
