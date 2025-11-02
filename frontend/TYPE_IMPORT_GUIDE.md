# Type Import Quick Reference Guide

A quick reference for importing types in the White Cross frontend codebase.

## TL;DR - Most Common Patterns

```typescript
// ✅ Import from main index (90% of cases)
import { Student, User, ApiResponse, Appointment } from '@/types';

// ✅ Import from specific module (when clarity needed)
import { Student } from '@/types/domain';
import { ApiResponse } from '@/types/core';
```

---

## Common Type Imports

### Core Types

```typescript
// Base entities and common types
import {
  BaseEntity,
  BasePersonEntity,
  BaseAuditEntity,
  User,
  UserRole,
  Gender,
  Priority,
  Status
} from '@/types';

// API types
import {
  ApiResponse,
  ApiError,
  PaginatedResponse,
  PaginationParams,
  CreateRequest,
  UpdateRequest
} from '@/types';

// Type guards
import {
  isApiResponse,
  isSuccessResponse,
  isErrorResponse,
  isPaginatedResponse
} from '@/types';
```

### Domain Types

```typescript
// Students
import { Student, EmergencyContact } from '@/types';

// Appointments
import {
  Appointment,
  AppointmentType,
  AppointmentStatus,
  AppointmentReminder
} from '@/types';

// Medications
import {
  Medication,
  StudentMedication,
  MedicationLog,
  DosageForm
} from '@/types';

// Health Records
import {
  HealthRecord,
  Allergy,
  Immunization,
  VitalSigns
} from '@/types';

// Incidents
import {
  Incident,
  IncidentType,
  IncidentSeverity,
  FollowUpAction
} from '@/types';

// Communications
import {
  Message,
  MessageType,
  MessagePriority,
  Broadcast
} from '@/types';
```

---

## What Changed?

### Before (Old)
```typescript
// ❌ DON'T DO THIS ANYMORE
import { Appointment } from '@/types/appointments';
import { User } from '@/types/common';
import { Student } from '@/types/student.types';
import { ApiResponse } from '@/types/api';
```

### After (New)
```typescript
// ✅ DO THIS NOW
import { Appointment, User, Student, ApiResponse } from '@/types';
```

---

## Type Categories

### 1. Core Types (`@/types/core`)
**What**: Infrastructure-level types used across the app
**Examples**: BaseEntity, ApiResponse, User, enums, utility types

### 2. Domain Types (`@/types/domain`)
**What**: Business-specific entity types
**Examples**: Student, Appointment, Medication, HealthRecord

### 3. Module Augmentations (`@/types/augmentations`)
**What**: Type declarations for third-party libraries
**Examples**: React Router, TanStack Query, Apollo Client
**Note**: Automatically loaded by TypeScript, no imports needed

---

## Special Cases

### When to Import from Specific Modules

```typescript
// When you want to make it clear this is a domain type
import { Appointment } from '@/types/domain';

// When you want to make it clear this is a core type
import { ApiError } from '@/types/core';

// When importing many types from one domain
import {
  Medication,
  StudentMedication,
  MedicationLog,
  DosageForm,
  AdministrationRoute
} from '@/types/domain';
```

### Type Guards and Utilities

```typescript
// Import type guards from core/api
import {
  isApiResponse,
  isSuccessResponse,
  isErrorResponse,
  isPaginatedResponse,
  isMutationSuccess
} from '@/types';

// Use them in your code
if (isApiResponse(response)) {
  const data = response.data;
}
```

---

## Forbidden Patterns

### ❌ Don't Import from Specific Files
```typescript
// ❌ BAD - Don't do this
import { Student } from '@/types/domain/student.types';
import { BaseEntity } from '@/types/core/common';
```

### ❌ Don't Import from Old Paths
```typescript
// ❌ BAD - Old paths (will cause errors)
import { Appointment } from '@/types/appointments';
import { User } from '@/types/common';
import { ApiResponse } from '@/types/api';
```

### ❌ Don't Create Circular Dependencies
```typescript
// ❌ BAD - Domain types importing from other domain types
// (in domain/appointments.ts)
import { Student } from './student.types'; // Circular!

// ✅ GOOD - Use reference types instead
type StudentReference = {
  id: string;
  firstName: string;
  lastName: string;
};
```

---

## Adding New Types

### Where to Add

1. **Core Type** (infrastructure/reusable)
   - Add to: `/src/types/core/[category].ts`
   - Example: New API response format → `core/api/responses.ts`

2. **Domain Type** (business entity)
   - Add to: `/src/types/domain/[domain].ts`
   - Example: New Medication field → `domain/medications.ts`

3. **Module Augmentation** (third-party lib)
   - Add to: `/src/types/augmentations/[library].d.ts`
   - Example: New React Query hook → `augmentations/tanstack-react-query.d.ts`

### Export Your Type

```typescript
// In your type file (e.g., domain/medications.ts)
export interface NewMedicationType {
  // ... your type
}

// The main index.ts will automatically export it via:
// export * from './domain';
```

---

## Common Errors and Fixes

### Error: Cannot find module '@/types/appointments'
```typescript
// ❌ OLD (causes error)
import { Appointment } from '@/types/appointments';

// ✅ NEW (fixed)
import { Appointment } from '@/types';
```

### Error: Cannot find module '@/types/common'
```typescript
// ❌ OLD (causes error)
import { User } from '@/types/common';

// ✅ NEW (fixed)
import { User } from '@/types';
```

### Error: Circular dependency detected
```typescript
// ❌ BAD (circular dependency)
import { Student } from './student.types';

// ✅ GOOD (use reference type)
type StudentReference = {
  id: string;
  firstName: string;
  lastName: string;
};
```

---

## IDE Autocomplete Tips

### VS Code
- Type `import { } from '@/types'` and press `Ctrl+Space` inside the braces
- All exported types will appear in autocomplete
- Use `Ctrl+Click` on a type to jump to its definition

### TypeScript Intellisense
- Hover over imported types to see their documentation
- Use `Ctrl+Shift+O` to see all types in the current file
- Use `Ctrl+T` to search for types across the project

---

## Migration Checklist

When updating old code:

- [ ] Replace specific file imports with main index imports
- [ ] Update `@/types/[file]` to `@/types`
- [ ] Remove any circular dependency imports
- [ ] Verify TypeScript compilation succeeds
- [ ] Test that the component/feature still works

---

## Need Help?

1. **Check Documentation**: `/src/types/README.md`
2. **View Full Report**: `/TYPE_ORGANIZATION_REPORT.md`
3. **Ask Questions**: Create an issue or discuss with team

---

**Last Updated**: 2025-11-02
