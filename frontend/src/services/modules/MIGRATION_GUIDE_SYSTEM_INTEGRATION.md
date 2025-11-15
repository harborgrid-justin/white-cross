# System and Integration API Migration Guide

**Status**: DEPRECATED - Removal Date: 2026-06-30
**Migration Target**: Server Actions in `/src/lib/actions/`

## Overview

The legacy `systemApi` and `integrationApi` services are being deprecated in favor of Next.js Server Actions. This migration provides better performance, automatic caching, type safety, and eliminates the need for API client instantiation.

## Quick Reference

### System API Migration

| Legacy Module | New Location | Notes |
|--------------|--------------|-------|
| `systemApi.getHealth()` | `@/lib/actions/admin.monitoring` | Health checks and monitoring |
| `systemApi.getConfig()` | `@/lib/actions/admin.settings` | System configuration |
| `systemApi.getStatistics()` | `@/lib/actions/dashboard.actions` | System statistics |

### Integration API Migration

| Legacy Module | New Location | Notes |
|--------------|--------------|-------|
| `integrationApi.getAll()` | `@/lib/actions/admin.integrations` | CRUD operations |
| `integrationApi.sync()` | `@/lib/actions/admin.integrations` | Sync operations |
| `integrationApi.getLogs()` | `@/lib/actions/admin.integrations` | Monitoring & logs |

---

## System API Migration Examples

### 1. Health Monitoring

#### Before (Legacy)
```typescript
import { createSystemApi } from '@/services/modules/systemApi';
import { createApiClient } from '@/services/core/ApiClient';

const client = createApiClient();
const systemApi = createSystemApi(client);

// Get system health
const health = await systemApi.getHealth();
console.log(`Status: ${health.status}`);

// Get component health
const dbHealth = await systemApi.getComponentHealth('database');
console.log(`Database: ${dbHealth.status}`);

// Generate health report
const report = await systemApi.generateHealthReport(true);
```

#### After (Server Actions)
```typescript
'use server'
import {
  getSystemHealth,
  getComponentHealth,
  generateHealthReport
} from '@/lib/actions/admin.monitoring';

// Get system health
const health = await getSystemHealth();
console.log(`Status: ${health.status}`);

// Get component health
const dbHealth = await getComponentHealth('database');
console.log(`Database: ${dbHealth.status}`);

// Generate health report
const report = await generateHealthReport({ includeMetrics: true });
```

**Benefits:**
- No client instantiation required
- Automatic server-side execution
- Built-in caching with Next.js revalidation
- Type-safe parameters

---

### 2. Configuration Management

#### Before (Legacy)
```typescript
import { createSystemApi } from '@/services/modules/systemApi';
import { createApiClient } from '@/services/core/ApiClient';

const client = createApiClient();
const systemApi = createSystemApi(client);

// Get all configurations
const allConfig = await systemApi.getConfig();

// Get by category
const securityConfig = await systemApi.getConfig('SECURITY');

// Get specific value
const emailProvider = await systemApi.getConfigValue('email.provider');

// Update configuration
await systemApi.updateConfig('email.provider', {
  value: 'sendgrid',
  description: 'Email service provider',
  category: 'COMMUNICATION'
});
```

#### After (Server Actions)
```typescript
'use server'
import {
  getSystemSettings,
  getSystemSetting,
  updateSystemSetting
} from '@/lib/actions/admin.settings';

// Get all configurations
const allConfig = await getSystemSettings();

// Get by category (filter in action)
const securityConfig = await getSystemSettings('SECURITY');

// Get specific value
const emailProvider = await getSystemSetting('email.provider');

// Update configuration
await updateSystemSetting('email.provider', 'sendgrid', {
  description: 'Email service provider',
  category: 'COMMUNICATION'
});
```

**Benefits:**
- Simpler API (no client needed)
- Server-side validation
- Automatic cache invalidation
- Better error handling

---

### 3. System Statistics

#### Before (Legacy)
```typescript
import { createSystemApi } from '@/services/modules/systemApi';
import { createApiClient } from '@/services/core/ApiClient';

const client = createApiClient();
const systemApi = createSystemApi(client);

const stats = await systemApi.getStatistics();
console.log(`Total Students: ${stats.totalStudents}`);
console.log(`Active Users: ${stats.activeUsers}`);
```

#### After (Server Actions)
```typescript
'use server'
import { getSystemStats } from '@/lib/actions/dashboard.actions';

const stats = await getSystemStats();
console.log(`Total Students: ${stats.totalStudents}`);
console.log(`Active Users: ${stats.activeUsers}`);
```

**Benefits:**
- Direct import, no setup
- Cached by default
- Type-safe responses

---

## Integration API Migration Examples

### 1. CRUD Operations

#### Before (Legacy)
```typescript
import { integrationApi } from '@/services/modules/integrationApi';

// Get all integrations
const allIntegrations = await integrationApi.getAll();

// Get by type
const sisIntegrations = await integrationApi.getAll('SIS');

// Get by ID
const integration = await integrationApi.getById('uuid-123');

// Create new integration
const newIntegration = await integrationApi.create({
  name: 'PowerSchool SIS',
  type: 'SIS',
  endpoint: 'https://api.powerschool.com/v1',
  settings: {
    authMethod: 'oauth2',
    syncDirection: 'inbound',
    autoSync: true
  }
});

// Update integration
const updated = await integrationApi.update('uuid-123', {
  isActive: false,
  settings: { autoSync: false }
});

// Delete integration
await integrationApi.delete('uuid-123');
```

#### After (Server Actions)
```typescript
'use server'
import {
  getIntegrations,
  getIntegration,
  createIntegration,
  updateIntegration,
  deleteIntegration
} from '@/lib/actions/admin.integrations';

// Get all integrations
const allIntegrations = await getIntegrations();

// Get by type (filtering done in action or client-side)
const integrations = await getIntegrations();
const sisIntegrations = integrations.filter(i => i.category === 'healthcare');

// Get by ID
const integration = await getIntegration('uuid-123');

// Create new integration
const newIntegration = await createIntegration({
  name: 'PowerSchool SIS',
  description: 'Student Information System',
  category: 'healthcare',
  enabled: true,
  config: {
    endpoint: 'https://api.powerschool.com/v1',
    authMethod: 'oauth2',
    syncDirection: 'inbound'
  }
});

// Update integration (uses toggleIntegration for enable/disable)
await toggleIntegration('uuid-123', false);

// Or update config
await updateIntegrationConfig('uuid-123', {
  settings: { autoSync: false }
});

// Delete integration
await deleteIntegration('uuid-123');
```

**Key Differences:**
- Type filtering may need client-side filtering or action enhancement
- `toggleIntegration()` for enable/disable operations
- Config updates use `updateIntegrationConfig()`

---

### 2. Connection Testing & Sync

#### Before (Legacy)
```typescript
import { integrationApi } from '@/services/modules/integrationApi';

// Test connection
const { result: testResult } = await integrationApi.testConnection('uuid-123');
console.log(`Connection: ${testResult.status}`);
console.log(`Latency: ${testResult.latency}ms`);

if (testResult.status === 'error') {
  console.error(`Error: ${testResult.message}`);
}

// Trigger sync
const { result: syncResult } = await integrationApi.sync('uuid-456');
console.log(`Records processed: ${syncResult.recordsProcessed}`);
console.log(`Errors: ${syncResult.errors.length}`);

if (syncResult.errors.length > 0) {
  syncResult.errors.forEach(err => console.error(`- ${err}`));
}
```

#### After (Server Actions)
```typescript
'use server'
import {
  testIntegration,
  syncIntegration
} from '@/lib/actions/admin.integrations';

// Test connection
const testResult = await testIntegration('uuid-123');
console.log(`Connection: ${testResult.status}`);
console.log(`Latency: ${testResult.latency}ms`);

if (testResult.status === 'error') {
  console.error(`Error: ${testResult.message}`);
}

// Trigger sync
const syncResult = await syncIntegration('uuid-456');
console.log(`Records processed: ${syncResult.recordsProcessed}`);
console.log(`Errors: ${syncResult.errors.length}`);

if (syncResult.errors.length > 0) {
  syncResult.errors.forEach(err => console.error(`- ${err}`));
}
```

**Benefits:**
- Return value simplified (no nested `result` property in new actions if designed that way)
- Better error handling
- Progress tracking can be enhanced

---

### 3. Monitoring & Logs

#### Before (Legacy)
```typescript
import { integrationApi } from '@/services/modules/integrationApi';

// Get logs for specific integration
const logs = await integrationApi.getLogs('uuid-123', {
  page: 1,
  limit: 50
});
console.log(`Found ${logs.logs.length} log entries`);

// Get all logs across integrations
const allLogs = await integrationApi.getAllLogs({
  page: 1,
  limit: 100,
  type: 'SIS'
});

// Get statistics
const stats = await integrationApi.getStatistics();
console.log(`Total integrations: ${stats.total}`);
console.log(`Active: ${stats.active}`);
console.log(`Success rate: ${stats.successRate}%`);
```

#### After (Server Actions)
```typescript
'use server'
import {
  getIntegrationLogs,
  getIntegrationStats
} from '@/lib/actions/admin.integrations';

// Get logs for specific integration
const logs = await getIntegrationLogs('uuid-123');
// Pagination handled by action defaults or passed as parameter
console.log(`Found ${logs.length} log entries`);

// Get all logs (filter client-side or enhance action)
const allLogs = await getIntegrationLogs();
const sisLogs = allLogs.filter(log => log.type === 'SIS');

// Get statistics
const stats = await getIntegrationStats();
console.log(`Total integrations: ${stats.total}`);
console.log(`Active: ${stats.active}`);
console.log(`Success rate: ${stats.successRate}%`);
```

**Note:** Pagination and filtering may need to be added to the Server Actions if not present.

---

### 4. Batch Operations

#### Before (Legacy)
```typescript
import { integrationApi } from '@/services/modules/integrationApi';

// Batch enable
const enableResult = await integrationApi.batchEnable([
  'uuid-1',
  'uuid-2',
  'uuid-3'
]);
console.log(`Enabled: ${enableResult.successful}`);
console.log(`Failed: ${enableResult.failed}`);

// Batch disable
const disableResult = await integrationApi.batchDisable([
  'uuid-4',
  'uuid-5'
]);
```

#### After (Server Actions)
```typescript
'use server'
import { toggleIntegration } from '@/lib/actions/admin.integrations';

// Batch enable (loop or create dedicated batch action)
const enableIds = ['uuid-1', 'uuid-2', 'uuid-3'];
const results = await Promise.allSettled(
  enableIds.map(id => toggleIntegration(id, true))
);

const successful = results.filter(r => r.status === 'fulfilled').length;
const failed = results.filter(r => r.status === 'rejected').length;

console.log(`Enabled: ${successful}`);
console.log(`Failed: ${failed}`);

// Batch disable
const disableIds = ['uuid-4', 'uuid-5'];
await Promise.allSettled(
  disableIds.map(id => toggleIntegration(id, false))
);
```

**Alternative:** Create a dedicated `batchToggleIntegrations()` server action for better performance.

---

### 5. Health Status

#### Before (Legacy)
```typescript
import { integrationApi } from '@/services/modules/integrationApi';

const health = await integrationApi.getHealthStatus();
console.log(`Overall health: ${health.overall}`);
console.log(`Healthy: ${health.summary.healthy}`);
console.log(`Degraded: ${health.summary.degraded}`);
console.log(`Error: ${health.summary.error}`);

health.integrations.forEach(integration => {
  console.log(`${integration.name}: ${integration.healthStatus}`);
});
```

#### After (Server Actions)
```typescript
'use server'
import { getIntegrations } from '@/lib/actions/admin.integrations';

const integrations = await getIntegrations();

// Calculate health summary
const healthy = integrations.filter(i => i.status === 'active').length;
const error = integrations.filter(i => i.status === 'error').length;
const inactive = integrations.filter(i => i.status === 'inactive').length;

console.log(`Healthy: ${healthy}`);
console.log(`Error: ${error}`);
console.log(`Inactive: ${inactive}`);

integrations.forEach(integration => {
  console.log(`${integration.name}: ${integration.status}`);
});
```

**Note:** Health status is integrated into each integration object. Aggregate calculations can be done client-side or via a dedicated health action.

---

## Common Patterns

### 1. Using in Server Components

```typescript
// app/admin/integrations/page.tsx
import { getIntegrations } from '@/lib/actions/admin.integrations';

export default async function IntegrationsPage() {
  const integrations = await getIntegrations();

  return (
    <div>
      <h1>Integrations ({integrations.length})</h1>
      {integrations.map(integration => (
        <IntegrationCard key={integration.id} integration={integration} />
      ))}
    </div>
  );
}
```

### 2. Using in Client Components

```typescript
'use client'
import { useEffect, useState } from 'react';
import { getIntegrations } from '@/lib/actions/admin.integrations';

export function IntegrationsClient() {
  const [integrations, setIntegrations] = useState([]);

  useEffect(() => {
    async function loadIntegrations() {
      const data = await getIntegrations();
      setIntegrations(data);
    }
    loadIntegrations();
  }, []);

  return (
    <div>
      {integrations.map(integration => (
        <IntegrationCard key={integration.id} integration={integration} />
      ))}
    </div>
  );
}
```

### 3. Form Actions

```typescript
'use client'
import { createIntegration } from '@/lib/actions/admin.integrations';
import { useActionState } from 'react';

export function CreateIntegrationForm() {
  async function handleSubmit(formData: FormData) {
    const result = await createIntegration({
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as any,
      enabled: true,
    });

    if (result.success) {
      // Handle success
    }
  }

  return (
    <form action={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

---

## Migration Checklist

### Phase 1: Preparation (Before Migration)
- [ ] Audit all usages of `systemApi` and `integrationApi`
- [ ] Document custom workflows and edge cases
- [ ] Review Server Actions in `/src/lib/actions/admin.*`
- [ ] Identify missing functionality in new actions

### Phase 2: Implementation (During Migration)
- [ ] Replace `systemApi` health checks with `admin.monitoring` actions
- [ ] Replace `systemApi` config with `admin.settings` actions
- [ ] Replace `integrationApi` CRUD with `admin.integrations` actions
- [ ] Update sync operations to use new actions
- [ ] Replace monitoring/logging calls
- [ ] Update batch operations (use loops or create batch actions)
- [ ] Remove API client instantiation code

### Phase 3: Testing (After Migration)
- [ ] Test all CRUD operations
- [ ] Verify sync and connection testing
- [ ] Test monitoring and logging
- [ ] Validate health checks and statistics
- [ ] Performance test Server Actions vs old API
- [ ] Verify caching behavior

### Phase 4: Cleanup (Final)
- [ ] Remove old imports from `@/services/modules/systemApi`
- [ ] Remove old imports from `@/services/modules/integrationApi`
- [ ] Delete unused API client instances
- [ ] Update documentation and comments

---

## API Client Import Updates

The legacy modules use:
```typescript
import type { ApiClient } from '../../core/ApiClient';
import { apiClient } from '../core';
```

Server Actions use:
```typescript
import { serverGet, serverPost, serverPut, serverDelete } from '@/lib/api/server';
```

**No client instantiation needed** in Server Actions. The HTTP methods handle everything.

---

## Breaking Changes

### 1. Return Value Structure
- **Legacy**: Often wrapped in `{ result: ... }` or `{ data: ... }`
- **New**: Direct return values (depends on action implementation)

### 2. Error Handling
- **Legacy**: Try/catch with `ApiError`
- **New**: Server Actions return `{ success: boolean, message: string, ... }`

### 3. Type Filtering
- **Legacy**: `getAll(type)` parameter
- **New**: May require client-side filtering or action enhancement

### 4. Pagination
- **Legacy**: `{ page, limit }` parameters
- **New**: Built into actions or returned fully (check action implementation)

---

## Support & Questions

For migration assistance:
1. Review Server Actions in `/src/lib/actions/`
2. Check this guide for equivalent examples
3. Consult existing usages in the codebase
4. Reach out to the development team

**Deprecation Timeline:**
- **Now**: Deprecation warnings added
- **2026-03-30**: Migration should be complete
- **2026-06-30**: Legacy modules removed

---

## Additional Resources

- [Next.js Server Actions Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Server Actions in `/src/lib/actions/README.md`](../../../lib/actions/README.md) (if exists)
- [API Client Migration Guide](/src/lib/api/MIGRATION.md) (if exists)

---

**Last Updated**: 2025-11-15
**Migration Status**: In Progress
**Target Completion**: 2026-03-30
