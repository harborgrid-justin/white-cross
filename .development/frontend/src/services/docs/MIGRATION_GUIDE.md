# Migration Guide: ServiceManager Integration

## Table of Contents
- [Overview](#overview)
- [What Changed](#what-changed)
- [Migration Timeline](#migration-timeline)
- [Old Pattern vs New Pattern](#old-pattern-vs-new-pattern)
- [Step-by-Step Migration](#step-by-step-migration)
- [Code Examples](#code-examples)
- [Backward Compatibility](#backward-compatibility)
- [Testing Strategy](#testing-strategy)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)

## Overview

We've integrated ServiceManager to provide centralized lifecycle management for all application services. This improves:
- **Initialization Order**: Services initialize in correct dependency order
- **Memory Management**: Proper cleanup prevents memory leaks
- **Type Safety**: Better TypeScript support with dependency injection
- **Testing**: Easier to mock services in tests
- **Maintainability**: Clear service dependencies and lifecycle

## What Changed

### Before (Old Pattern)
- Services were imported as singletons
- No centralized initialization
- Manual cleanup required
- Circular dependency risks
- Hard to test

### After (New Pattern)
- Services accessed via `apiServiceRegistry` or `ServiceManager`
- Centralized initialization in `main.tsx`
- Automatic cleanup on logout/unload
- Clear dependency injection
- Easy to mock for testing

## Migration Timeline

| Phase | Timeline | Status | Description |
|-------|----------|--------|-------------|
| **Phase 1** | Complete | ✅ Done | Infrastructure ready (ServiceManager, ApiClient) |
| **Phase 2** | Current | 🔄 In Progress | Service registry and initialization |
| **Phase 3** | 2-4 weeks | 📋 Planned | Gradual code migration |
| **Phase 4** | 4-8 weeks | 📋 Planned | Remove deprecated exports |

**Current Phase**: All old exports still work. No breaking changes.

## Old Pattern vs New Pattern

### 1. Service Import and Usage

#### OLD (Deprecated but still works)
```typescript
import { authApi, studentsApi } from '@/services';

async function login(email: string, password: string) {
  const result = await authApi.login({ email, password });
  return result;
}

async function loadStudents() {
  const students = await studentsApi.getAll({ page: 1, limit: 10 });
  return students;
}
```

#### NEW Option 1 (Recommended - Simple Migration)
```typescript
import { apiServiceRegistry } from '@/services';

async function login(email: string, password: string) {
  const result = await apiServiceRegistry.authApi.login({ email, password });
  return result;
}

async function loadStudents() {
  const students = await apiServiceRegistry.studentsApi.getAll({ page: 1, limit: 10 });
  return students;
}
```

#### NEW Option 2 (Best Practice - Advanced)
```typescript
import { ServiceManager } from '@/services';

async function login(email: string, password: string) {
  const sm = ServiceManager.getInstance();
  const apiClient = sm.get('apiClient');
  // Use apiClient for custom requests
  return result;
}
```

### 2. Application Initialization

#### OLD (No initialization)
```typescript
// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### NEW (Required initialization)
```typescript
// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeServices } from '@/services';

async function bootstrap() {
  try {
    // Initialize all services before rendering
    await initializeServices({
      debug: import.meta.env.DEV
    });

    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to initialize application:', error);
    // Show error UI
    document.getElementById('root')!.innerHTML = `
      <div style="padding: 2rem; text-align: center;">
        <h1>Application Failed to Start</h1>
        <p>Please refresh or contact support.</p>
      </div>
    `;
  }
}

bootstrap();
```

### 3. Cleanup on Logout

#### OLD (Manual cleanup)
```typescript
function handleLogout() {
  // Clear user data
  localStorage.removeItem('auth_token');

  // Redirect
  window.location.href = '/login';
}
```

#### NEW (Automatic service cleanup)
```typescript
import { cleanupServices } from '@/services';

async function handleLogout() {
  // Clear user data
  localStorage.removeItem('auth_token');

  // Cleanup all services (cache, tokens, etc.)
  await cleanupServices();

  // Redirect
  window.location.href = '/login';
}
```

### 4. React Hooks Usage

#### OLD
```typescript
import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '@/services';

function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: () => studentsApi.getAll({ page: 1, limit: 10 })
  });
}
```

#### NEW (No change required - backward compatible)
```typescript
import { useQuery } from '@tanstack/react-query';
import { apiServiceRegistry } from '@/services';

function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: () => apiServiceRegistry.studentsApi.getAll({ page: 1, limit: 10 })
  });
}
```

## Step-by-Step Migration

### Step 1: Add Initialization to main.tsx (REQUIRED)

This is the only required change. Update your `main.tsx`:

```typescript
import { initializeServices } from '@/services';

async function bootstrap() {
  await initializeServices();
  // ... render React
}

bootstrap();
```

See [Application Initialization](#2-application-initialization) for complete example.

### Step 2: Add Cleanup to Logout (RECOMMENDED)

Update your logout handler:

```typescript
import { cleanupServices } from '@/services';

async function logout() {
  await cleanupServices();
  window.location.href = '/login';
}
```

### Step 3: Gradually Migrate Imports (OPTIONAL)

When you touch a file, update imports:

```typescript
// Change this:
import { authApi } from '@/services';

// To this:
import { apiServiceRegistry } from '@/services';
const { authApi } = apiServiceRegistry;

// Or inline:
import { apiServiceRegistry } from '@/services';
await apiServiceRegistry.authApi.login(...);
```

### Step 4: Update Tests (AS NEEDED)

When writing new tests:

```typescript
import { ServiceManager } from '@/services';

describe('MyComponent', () => {
  afterEach(async () => {
    // Reset services after each test
    await ServiceManager.getInstance().reset();
  });

  it('should work', async () => {
    await initializeServices({ skipServices: ['auditService'] });
    // ... test code
  });
});
```

## Code Examples

### Example 1: React Component Migration

#### Before
```typescript
import React, { useEffect, useState } from 'react';
import { studentsApi } from '@/services';
import type { Student } from '@/services/types';

export function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudents() {
      try {
        const result = await studentsApi.getAll({ page: 1, limit: 10 });
        setStudents(result.data);
      } catch (error) {
        console.error('Failed to load students:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {students.map(student => (
        <div key={student.id}>{student.firstName} {student.lastName}</div>
      ))}
    </div>
  );
}
```

#### After
```typescript
import React, { useEffect, useState } from 'react';
import { apiServiceRegistry } from '@/services';
import type { Student } from '@/services/types';

export function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudents() {
      try {
        // Simple change: use apiServiceRegistry
        const result = await apiServiceRegistry.studentsApi.getAll({ page: 1, limit: 10 });
        setStudents(result.data);
      } catch (error) {
        console.error('Failed to load students:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {students.map(student => (
        <div key={student.id}>{student.firstName} {student.lastName}</div>
      ))}
    </div>
  );
}
```

### Example 2: Service Layer Migration

#### Before
```typescript
// services/studentService.ts
import { studentsApi, healthRecordsApi } from '@/services';

export class StudentService {
  async getStudentWithHealth(studentId: string) {
    const student = await studentsApi.getById(studentId);
    const healthRecords = await healthRecordsApi.getRecords(studentId);

    return {
      ...student,
      healthRecords
    };
  }
}
```

#### After
```typescript
// services/studentService.ts
import { apiServiceRegistry } from '@/services';

export class StudentService {
  async getStudentWithHealth(studentId: string) {
    const { studentsApi, healthRecordsApi } = apiServiceRegistry;

    const student = await studentsApi.getById(studentId);
    const healthRecords = await healthRecordsApi.getRecords(studentId);

    return {
      ...student,
      healthRecords
    };
  }
}
```

### Example 3: Test Migration

#### Before
```typescript
import { studentsApi } from '@/services';
import { renderHook } from '@testing-library/react';

describe('useStudents', () => {
  it('should load students', async () => {
    // Had to mock the entire module
    jest.mock('@/services', () => ({
      studentsApi: {
        getAll: jest.fn().mockResolvedValue({ data: [] })
      }
    }));

    // ... test code
  });
});
```

#### After
```typescript
import { ServiceManager } from '@/services';
import { renderHook } from '@testing-library/react';

describe('useStudents', () => {
  beforeEach(async () => {
    await ServiceManager.getInstance().initialize({
      skip: ['auditService']  // Skip non-essential services in tests
    });
  });

  afterEach(async () => {
    await ServiceManager.getInstance().reset();
  });

  it('should load students', async () => {
    // Services are properly initialized and cleaned up
    // ... test code
  });
});
```

## Backward Compatibility

### Guaranteed Compatibility

✅ **All existing imports continue to work**
```typescript
import { authApi, studentsApi, medicationApi } from '@/services';
// These all still work exactly as before
```

✅ **No changes required to existing code**
- Your current code will continue to function
- Only `main.tsx` needs initialization added
- Migration can happen gradually

✅ **Type safety maintained**
- All TypeScript types are unchanged
- No breaking type changes

### Deprecation Warnings

In development mode, you'll see JSDoc warnings:
```typescript
/**
 * @deprecated Use apiServiceRegistry instead
 */
export { authApi } from './modules/authApi';
```

These are **warnings only** - code still works.

### Timeline for Removal

- **Now - 2 months**: Both patterns work, deprecation warnings
- **2-4 months**: Migration encouraged, warnings increase
- **4+ months**: Consider removing deprecated exports

## Testing Strategy

### Unit Tests
```typescript
import { ServiceManager } from '@/services';

beforeEach(async () => {
  await ServiceManager.getInstance().initialize();
});

afterEach(async () => {
  await ServiceManager.getInstance().reset();
});
```

### Integration Tests
```typescript
import { initializeServices, cleanupServices } from '@/services';

beforeAll(async () => {
  await initializeServices({ debug: false });
});

afterAll(async () => {
  await cleanupServices();
});
```

### E2E Tests
```typescript
// No changes needed - services initialize in main.tsx
```

## Troubleshooting

### Problem: "ServiceManager not initialized"

**Solution**: Add `initializeServices()` to `main.tsx`
```typescript
import { initializeServices } from '@/services';
await initializeServices();
```

### Problem: "Memory leaks in tests"

**Solution**: Reset ServiceManager after each test
```typescript
afterEach(async () => {
  await ServiceManager.getInstance().reset();
});
```

### Problem: "Circular dependency errors"

**Solution**: Use `apiServiceRegistry` instead of direct imports
```typescript
// DON'T
import { authApi } from '@/services/modules/authApi';

// DO
import { apiServiceRegistry } from '@/services';
const { authApi } = apiServiceRegistry;
```

### Problem: "Services not cleaning up on logout"

**Solution**: Call `cleanupServices()` in logout handler
```typescript
import { cleanupServices } from '@/services';
await cleanupServices();
```

## FAQ

**Q: Do I need to change all my code right now?**
A: No! Only add `initializeServices()` to `main.tsx`. Everything else is optional.

**Q: Will my existing code break?**
A: No. All existing imports and usage patterns continue to work.

**Q: When should I migrate to the new pattern?**
A: Gradually, when you touch files. No rush.

**Q: Can I mix old and new patterns?**
A: Yes! Both patterns work side-by-side during migration.

**Q: How do I test with ServiceManager?**
A: Call `ServiceManager.getInstance().reset()` in `afterEach()`.

**Q: What if I don't want to migrate?**
A: That's fine for now. The old pattern will work for several months.

**Q: How do I know when to use apiServiceRegistry vs ServiceManager?**
A: Use `apiServiceRegistry` for simple cases. Use `ServiceManager` for advanced lifecycle control.

**Q: What about performance?**
A: No performance impact. Services are lazily instantiated.

**Q: Can I opt out of ServiceManager?**
A: For now, yes (via backward compatibility). Long-term, no - it's required for proper cleanup.

## Need Help?

- Check ServiceManager documentation: `frontend/src/services/core/ServiceManager.ts`
- Check initialization code: `frontend/src/services/core/initialize.ts`
- Ask in #frontend-architecture Slack channel
- Create an issue with `migration` label

## Summary

### Immediate Action Required
1. ✅ Add `initializeServices()` to `main.tsx`
2. ✅ Add `cleanupServices()` to logout handler

### Optional (Gradual Migration)
3. Update imports when touching files
4. Migrate tests to use ServiceManager
5. Use `apiServiceRegistry` for new code

### No Action Required
- Existing code continues to work
- No breaking changes
- Full backward compatibility
