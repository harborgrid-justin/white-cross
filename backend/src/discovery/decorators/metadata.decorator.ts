import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

// Feature Flag decorator for tagging providers with experimental features
export const FeatureFlag = (flag: string): CustomDecorator<string> =>
  SetMetadata('feature-flag', flag);

// Alternative approach using DiscoveryService.createDecorator (as shown in the documentation)
export const ExperimentalFeature = DiscoveryService.createDecorator<string>();

// Custom decorator for marking services as analytics-enabled
export const Analytics = (enabled: boolean = true): CustomDecorator<string> =>
  SetMetadata('analytics-enabled', enabled);

// Custom decorator for tagging services with their domain
export const Domain = (domain: string): CustomDecorator<string> =>
  SetMetadata('domain', domain);

// Custom decorator for marking services as cached
export const Cacheable = (ttl?: number): CustomDecorator<string> =>
  SetMetadata('cacheable', { enabled: true, ttl });

// Note: RateLimit decorator exported from rate-limit.decorator.ts

// Custom decorator for monitoring
export const Monitored = (
  level: 'basic' | 'detailed' = 'basic',
): CustomDecorator<string> => SetMetadata('monitoring-level', level);
