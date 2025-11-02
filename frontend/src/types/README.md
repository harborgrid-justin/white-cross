# Types Directory

This directory contains all TypeScript type definitions for the White Cross healthcare platform.

## Directory Structure

```
types/
├── core/               # Core/foundational types
│   ├── common.ts      # Base entities, enums, common types
│   ├── api/           # API request/response types
│   ├── state.ts       # Redux state types
│   ├── errors.ts      # Error handling types
│   ├── cache.ts       # Caching types
│   ├── navigation.ts  # Routing types
│   ├── utility.ts     # TypeScript utility types
│   ├── actions.ts     # Redux action types
│   └── graphql/       # GraphQL types
│
├── domain/            # Business domain types
│   ├── student.types.ts     # Student management
│   ├── appointments.ts      # Appointment scheduling
│   ├── medications.ts       # Medication administration
│   ├── healthRecords.ts     # Health records
│   ├── incidents.ts         # Incident reporting
│   ├── documents.ts         # Document management
│   ├── communication.ts     # Messaging
│   ├── compliance.ts        # HIPAA compliance
│   ├── administration.ts    # School/district admin
│   ├── accessControl.ts     # Permissions
│   ├── analytics.ts         # Analytics and reporting
│   ├── inventory.ts         # Medical inventory
│   └── ...
│
├── augmentations/     # Module augmentations for third-party libs
│   ├── apollo-client.d.ts
│   ├── react-router-dom.d.ts
│   ├── tanstack-react-query.d.ts
│   └── ...
│
└── index.ts           # Main export (re-exports all types)
```

## Usage

### Importing Types

```typescript
// Import from main index (recommended for most cases)
import { Student, User, ApiResponse } from '@/types';

// Import from specific modules (when you need namespace clarity)
import { Student } from '@/types/domain';
import { ApiResponse } from '@/types/core';

// Import from specific files (for tree-shaking or avoiding conflicts)
import { Student } from '@/types/domain/student.types';
```

### Type Organization Principles

1. **Core Types** (`core/`) - Foundational types that are not business-domain specific
   - Used across multiple domains
   - Infrastructure-level types (API, state, errors)
   - Should not import from `domain/`

2. **Domain Types** (`domain/`) - Business-specific entity types
   - Organized by business domain
   - Can import from `core/`
   - Should avoid circular dependencies with other domain types

3. **Module Augmentations** (`augmentations/`) - Type declarations for third-party libraries
   - Automatically loaded by TypeScript
   - No explicit imports needed

## Breaking Circular Dependencies

To prevent circular dependencies between domain types, use minimal reference types:

```typescript
// Instead of importing the full Student type
import { Student } from './student.types';

// Define a minimal reference type
type StudentReference = {
  id: string;
  firstName: string;
  lastName: string;
};
```

## Type Naming Conventions

- **Interfaces**: PascalCase (e.g., `Student`, `ApiResponse`)
- **Enums**: PascalCase (e.g., `UserRole`, `AppointmentStatus`)
- **Type Aliases**: PascalCase (e.g., `StudentId`, `DateString`)
- **Generic Types**: Single uppercase letter or descriptive name (e.g., `T`, `TData`)

## HIPAA Compliance

When working with types that contain Protected Health Information (PHI):

1. Mark types containing PHI with documentation comments
2. Use `containsPHI: true` in query metadata
3. Never persist PHI to localStorage
4. Ensure proper access controls

Example:
```typescript
/**
 * Student health record
 * ⚠️ WARNING: Contains PHI - Handle according to HIPAA requirements
 */
export interface HealthRecord extends BaseEntity {
  // ...
}
```

## Migration Notes

This directory structure was reorganized to:
- Separate core types from domain types
- Move module augmentations to dedicated directory
- Break circular dependencies
- Improve type discoverability

Old type files are backed up with `.backup` extension.
