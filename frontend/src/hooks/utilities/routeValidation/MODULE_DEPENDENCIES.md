# Route Validation Module Dependencies

## Dependency Graph

```
External Dependencies
├── zod (validation library)
├── next/navigation (Next.js routing)
└── react (hooks: useState, useEffect, useCallback)

Internal Type System
└── types/domain/incidents (IncidentType, IncidentSeverity, etc.)

┌─────────────────────────────────────────────────────────────┐
│                    routeValidationTypes.ts                  │
│  (145 lines - Foundation types and custom error class)     │
│                                                             │
│  Exports:                                                   │
│  • ParamValidator<T>                                        │
│  • ValidationResult<T>                                      │
│  • ParamSchema                                              │
│  • ValidationError                                          │
│  • ValidationHookOptions                                    │
│  • RouteValidationError (class)                             │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        │                     │                     │
┌───────┴─────────┐  ┌────────┴────────┐  ┌────────┴────────┐
│  Schemas (253)  │  │  Security (142) │  │ Transformers    │
│                 │  │                 │  │  (155 lines)    │
│  • UUIDParam    │  │  • detectXSS    │  │                 │
│  • DateParam    │  │  • detectSQL    │  │  • parseDate    │
│  • EnumParam    │  │  • detectPath   │  │  • parseBoolean │
│  • Pagination   │  │  • sanitize     │  │  • parseArray   │
│  • Predefined   │  │                 │  │  • parseJSON    │
│  schemas        │  │                 │  │  • parseParams  │
└─────────────────┘  └─────────────────┘  └─────────────────┘
        │                     │                     │
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │      routeValidationUtils.ts            │
        │       (236 lines - Core utilities)      │
        │                                         │
        │  • sanitizeParams()                     │
        │  • validateRouteParams()                │
        │  • validateQueryParams()                │
        │  • handleValidationError()              │
        │  • redirectOnInvalidParams()            │
        └─────────────────────────────────────────┘
                              │
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │      routeValidationHooks.ts            │
        │       (288 lines - React hooks)         │
        │                                         │
        │  • useValidatedParams()                 │
        │  • useValidatedQueryParams()            │
        │  • useParamValidator()                  │
        └─────────────────────────────────────────┘
                              │
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │            index.ts                     │
        │     (221 lines - Export hub)            │
        │                                         │
        │  Re-exports all public APIs             │
        │  Maintains backward compatibility       │
        └─────────────────────────────────────────┘
                              │
                              │
                              ▼
                    Application Components
                    (No changes required)
```

## Import Flow

### Top-Level Import (Recommended)
```typescript
import {
  useValidatedParams,
  IncidentIdParamSchema,
  RouteValidationError
} from '@/hooks/utilities/routeValidation';
```

Resolves to:
1. `index.ts` - Main export hub
2. Imports from respective modules:
   - `useValidatedParams` from `routeValidationHooks.ts`
   - `IncidentIdParamSchema` from `routeValidationSchemas.ts`
   - `RouteValidationError` from `routeValidationTypes.ts`

### Module-Specific Import (Alternative)
```typescript
import { useValidatedParams } from '@/hooks/utilities/routeValidation/routeValidationHooks';
```

Direct import from specific module (useful for tree-shaking).

## Dependency Layers

### Layer 1: Foundation (No internal dependencies)
- **routeValidationTypes.ts** - Core types and error classes
  - Depends on: `zod` (external)

### Layer 2: Specialized Utilities (Depend on Layer 1)
- **routeValidationSchemas.ts** - Validation schemas
  - Depends on: `zod`, `types/domain/incidents`

- **routeValidationSecurity.ts** - Security checks
  - Depends on: `routeValidationTypes`

- **routeValidationTransformers.ts** - Type transformers
  - Depends on: `routeValidationSchemas`, `routeValidationSecurity`

### Layer 3: Core Validation (Depends on Layers 1-2)
- **routeValidationUtils.ts** - Main validation functions
  - Depends on: `zod`, `next/navigation`, `routeValidationTypes`, `routeValidationSecurity`

### Layer 4: React Integration (Depends on Layers 1-3)
- **routeValidationHooks.ts** - React hooks
  - Depends on: `zod`, `next/navigation`, `react`, `routeValidationTypes`, `routeValidationUtils`

### Layer 5: Public API (Depends on all layers)
- **index.ts** - Central export hub
  - Re-exports all public APIs from all modules

## Circular Dependency Prevention

The module structure prevents circular dependencies through strict layering:

1. **Foundation layer** has no internal dependencies
2. **Each subsequent layer** only depends on lower layers
3. **No module** imports from a module in the same or higher layer
4. **index.ts** only exports, never consumed by other modules

## Module Coupling

### Tight Coupling (Intentional)
- `routeValidationUtils` ↔ `routeValidationSecurity` (validation needs security)
- `routeValidationHooks` → `routeValidationUtils` (hooks use utilities)

### Loose Coupling
- `routeValidationSchemas` can be used independently
- `routeValidationTransformers` can be used without hooks
- `routeValidationSecurity` can be used standalone

### No Coupling
- All modules independent of `index.ts`
- `routeValidationTypes` independent of all other modules
- External dependencies isolated to relevant modules

## Tree-Shaking Benefits

### Scenario 1: Only need schemas
```typescript
import { UUIDParamSchema } from '@/hooks/utilities/routeValidation';
```
**Bundles:** `routeValidationSchemas.ts` only (253 lines)

### Scenario 2: Only need transformers
```typescript
import { parseDate, parseBoolean } from '@/hooks/utilities/routeValidation';
```
**Bundles:** `routeValidationTransformers.ts` + `routeValidationSchemas.ts` + `routeValidationSecurity.ts` (450 lines)

### Scenario 3: Full validation with hooks
```typescript
import { useValidatedParams, IncidentIdParamSchema } from '@/hooks/utilities/routeValidation';
```
**Bundles:** All modules as needed (full functionality)

## Performance Impact

### Before Refactoring
- Single 1251-line file
- All code bundled together
- No tree-shaking possible
- Longer parse time

### After Refactoring
- 7 focused modules (avg 206 lines each)
- Selective bundling via tree-shaking
- Parallel parsing possible
- Faster incremental builds

### Build Performance
- **Smaller change impact**: Editing one module doesn't invalidate others
- **Better caching**: TypeScript can cache compiled modules independently
- **Parallel compilation**: Multiple modules compile concurrently
- **Faster rebuilds**: Only modified modules recompile

## Testing Strategy

### Unit Testing by Module
Each module can be tested in isolation:

```typescript
// Test schemas independently
import { UUIDParamSchema } from './routeValidationSchemas';

// Test security independently
import { detectXSS } from './routeValidationSecurity';

// Test transformers independently
import { parseDate } from './routeValidationTransformers';
```

### Integration Testing
Test module interactions:

```typescript
// Test validation flow
import { validateRouteParams } from './routeValidationUtils';
import { UUIDParamSchema } from './routeValidationSchemas';

// Test hooks integration
import { useValidatedParams } from './routeValidationHooks';
```

## Code Maintenance

### Adding New Functionality

1. **New schema** → Add to `routeValidationSchemas.ts`
2. **New security check** → Add to `routeValidationSecurity.ts`
3. **New transformer** → Add to `routeValidationTransformers.ts`
4. **New validation** → Add to `routeValidationUtils.ts`
5. **New hook** → Add to `routeValidationHooks.ts`
6. **Update exports** → Add to `index.ts`

### File Size Monitoring
- Keep each module under 300 lines
- If a module grows too large, consider further subdivision
- Maintain single responsibility per module

## Backward Compatibility

All imports from the original `routeValidation.ts` file continue to work without modification:

```typescript
// Old import (still works)
import { useValidatedParams } from '@/hooks/utilities/routeValidation';

// New import (also works, same result)
import { useValidatedParams } from '@/hooks/utilities/routeValidation';
```

The `index.ts` ensures 100% backward compatibility by re-exporting all public APIs.
