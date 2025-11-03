# NestJS DiscoveryService Implementation

This module demonstrates how to implement and use NestJS DiscoveryService for runtime introspection and metadata discovery in your NestJS application.

## Overview

The DiscoveryService is a powerful utility that allows developers to dynamically inspect and retrieve providers, controllers, and other metadata within a NestJS application. This is particularly useful when building plugins, decorators, or advanced features that rely on runtime introspection.

## Features

- **Dynamic Provider Discovery**: Find and filter providers based on metadata
- **Controller Introspection**: Discover controllers and their metadata
- **Custom Decorators**: Create and use custom metadata decorators
- **Filtering and Querying**: Filter providers/controllers by various criteria
- **REST API**: Access discovery functionality via HTTP endpoints

## Files Structure

```
src/discovery/
├── decorators/
│   └── metadata.decorator.ts      # Custom metadata decorators
├── examples/
│   └── example-services.ts        # Example services with decorators
├── discovery.controller.ts        # REST API endpoints
├── discovery-example.service.ts   # Main discovery service
├── discovery.module.ts            # Module configuration
└── README.md                      # This documentation
```

## Custom Decorators

### Available Decorators

```typescript
// Feature flag decorator
@FeatureFlag('experimental')

// Experimental feature decorator (using DiscoveryService.createDecorator)
@ExperimentalFeature('ai-diagnosis')

// Analytics tracking
@Analytics(true)

// Domain classification
@Domain('health-records')

// Caching configuration
@Cacheable(300) // TTL in seconds

// Rate limiting
@RateLimit(100, 60000) // 100 requests per minute

// Monitoring level
@Monitored('detailed') // 'basic' or 'detailed'
```

### Usage Example

```typescript
import { Injectable } from '@nestjs/common';
import { FeatureFlag, Analytics, Domain, Cacheable } from '../decorators/metadata.decorator';

@Injectable()
@FeatureFlag('experimental')
@Analytics(true)
@Domain('health-records')
@Cacheable(300)
export class MyService {
  doSomething() {
    return 'Hello World';
  }
}
```

## Service Methods

### Provider Discovery

```typescript
// Get all providers
getAllProviders(): InstanceWrapper[]

// Get providers with specific feature flag
getProvidersWithFeatureFlag(flag: string): ProviderInfo[]

// Get experimental providers
getExperimentalProviders(feature: string): ProviderInfo[]

// Get analytics-enabled providers
getAnalyticsProviders(): ProviderInfo[]

// Get providers by domain
getProvidersByDomain(domain: string): ProviderInfo[]

// Get cacheable providers
getCacheableProviders(): ProviderInfo[]

// Get rate-limited providers
getRateLimitedProviders(): ProviderInfo[]

// Get monitored providers
getMonitoredProviders(level?: 'basic' | 'detailed'): ProviderInfo[]
```

### Controller Discovery

```typescript
// Get all controllers
getAllControllers(): InstanceWrapper[]

// Get controllers with specific metadata
getControllersWithMetadata(metadataKey: string, metadataValue?: any): ControllerInfo[]
```

## REST API Endpoints

The discovery functionality is exposed via REST API endpoints:

### Provider Endpoints

- `GET /discovery/providers` - Get all providers
- `GET /discovery/providers/feature-flag/:flag` - Get providers with feature flag
- `GET /discovery/providers/experimental/:feature` - Get experimental providers
- `GET /discovery/providers/analytics` - Get analytics-enabled providers
- `GET /discovery/providers/domain/:domain` - Get providers by domain
- `GET /discovery/providers/cacheable` - Get cacheable providers
- `GET /discovery/providers/rate-limited` - Get rate-limited providers
- `GET /discovery/providers/monitored?level=basic|detailed` - Get monitored providers

### Controller Endpoints

- `GET /discovery/controllers` - Get all controllers
- `GET /discovery/controllers/metadata?key=metadataKey&value=metadataValue` - Get controllers with metadata

### Summary Endpoint

- `GET /discovery/summary` - Get comprehensive discovery summary

## Testing the Implementation

1. **Start the NestJS application**:
   ```bash
   npm run start:dev
   ```

2. **Access the Swagger documentation**:
   Navigate to `http://localhost:3001/api/docs` to see the Discovery API endpoints.

3. **Test discovery endpoints**:
   ```bash
   # Get all providers
   curl http://localhost:3001/discovery/providers

   # Get experimental providers
   curl http://localhost:3001/discovery/providers/feature-flag/experimental

   # Get analytics providers
   curl http://localhost:3001/discovery/providers/analytics

   # Get providers by domain
   curl http://localhost:3001/discovery/providers/domain/health-records

   # Get discovery summary
   curl http://localhost:3001/discovery/summary
   ```

## Integration with Your Application

### Step 1: Import the Module

Add the `DiscoveryExampleModule` to your main application module:

```typescript
// app.module.ts
import { DiscoveryExampleModule } from './discovery/discovery.module';

@Module({
  imports: [
    // ... other modules
    DiscoveryExampleModule,
  ],
})
export class AppModule {}
```

### Step 2: Use Custom Decorators

Apply custom decorators to your services:

```typescript
@Injectable()
@FeatureFlag('beta')
@Analytics(true)
@Domain('user-management')
export class UserService {
  // ... your service implementation
}
```

### Step 3: Inject and Use Discovery Service

```typescript
import { DiscoveryExampleService } from './discovery/discovery-example.service';

@Injectable()
export class SomeOtherService {
  constructor(private readonly discoveryService: DiscoveryExampleService) {}

  async findBetaFeatures() {
    return this.discoveryService.getProvidersWithFeatureFlag('beta');
  }
}
```

## Use Cases

### 1. Feature Flag Management
Dynamically enable/disable features based on metadata:

```typescript
const experimentalProviders = discoveryService.getProvidersWithFeatureFlag('experimental');
// Enable experimental features conditionally
```

### 2. Analytics Integration
Find all analytics-enabled services for tracking:

```typescript
const analyticsProviders = discoveryService.getAnalyticsProviders();
// Set up analytics tracking for these services
```

### 3. Caching Strategy
Identify cacheable services and configure caching:

```typescript
const cacheableProviders = discoveryService.getCacheableProviders();
// Configure cache settings based on metadata
```

### 4. Rate Limiting
Apply rate limiting to marked services:

```typescript
const rateLimitedProviders = discoveryService.getRateLimitedProviders();
// Configure rate limiting middleware
```

### 5. Monitoring Setup
Set up monitoring based on service metadata:

```typescript
const monitoredProviders = discoveryService.getMonitoredProviders('detailed');
// Configure detailed monitoring for these services
```

## Best Practices

1. **Use Meaningful Metadata**: Choose descriptive metadata keys and values
2. **Document Decorators**: Clearly document what each custom decorator does
3. **Performance Considerations**: Discovery operations can be expensive, cache results when possible
4. **Type Safety**: Use TypeScript interfaces for metadata structures
5. **Testing**: Write tests for your discovery logic and custom decorators

## Example Output

When you call the discovery summary endpoint, you might see:

```json
{
  "totals": {
    "providers": 127,
    "controllers": 23,
    "domains": 6
  },
  "categories": {
    "experimental": 2,
    "analytics": 4,
    "cacheable": 3,
    "rateLimited": 2,
    "monitored": 5
  },
  "domains": [
    "health-records",
    "clinical",
    "user-management",
    "reporting",
    "external-api",
    "student-health"
  ],
  "examples": {
    "experimentalProviders": ["ExperimentalHealthService"],
    "analyticsProviders": ["ExperimentalHealthService", "UserAnalyticsService", "StudentHealthService"],
    "cacheableProviders": ["AiDiagnosisService", "ReportCacheService", "StudentHealthService"],
    "rateLimitedProviders": ["UserAnalyticsService", "ExternalApiService"],
    "monitoredProviders": ["ExperimentalHealthService", "UserAnalyticsService", "ExternalApiService", "StudentHealthService"]
  }
}
```

This implementation provides a solid foundation for using NestJS DiscoveryService in your application. You can extend it further based on your specific needs and use cases.
