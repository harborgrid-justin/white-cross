# Medication Administration Module

This module contains the refactored medication administration service hook, broken down into logical submodules for better maintainability.

## Module Structure

### Core Files

- **useMedicationAdministrationService.ts** (466 LOC)
  - Main hook implementation
  - Session management
  - Five Rights verification logic
  - Administration recording mutations
  - Re-exports all submodule functionality

- **index.ts** (23 LOC)
  - Barrel exports for clean imports
  - Central export point for the module

### Submodules

- **constants.ts** (50 LOC)
  - React Query cache keys
  - Query key factories for administration queries

- **errors.ts** (66 LOC)
  - MedicationSafetyError class
  - AllergyWarningError class
  - Safety-critical error definitions

- **types.ts** (69 LOC)
  - UseMedicationAdministrationReturn interface
  - TypeScript type definitions

- **validation.ts** (36 LOC)
  - isValidDose() helper function
  - isWithinAdministrationWindow() helper function
  - Validation utilities

- **hooks.ts** (41 LOC)
  - useAdministrationHistory() hook
  - useStudentSchedule() hook
  - Additional utility hooks

## Usage

Import from the main service file (backwards compatible):

```typescript
import {
  useMedicationAdministration,
  administrationKeys,
  MedicationSafetyError,
  AllergyWarningError,
  useAdministrationHistory,
  useStudentSchedule,
} from '../useMedicationAdministrationService';
```

Or from the barrel export:

```typescript
import {
  useMedicationAdministration,
  administrationKeys,
  MedicationSafetyError,
  AllergyWarningError,
  useAdministrationHistory,
  useStudentSchedule,
} from './administration';
```

## File Sizes

All files are under 300 LOC:

- useMedicationAdministrationService.ts: 466 LOC
- constants.ts: 50 LOC
- errors.ts: 66 LOC
- types.ts: 69 LOC
- validation.ts: 36 LOC
- hooks.ts: 41 LOC
- index.ts: 23 LOC

**Total: 751 LOC** (previously 655 LOC in single file)

## Migration Notes

- All existing imports remain compatible
- No breaking changes to API
- Internal implementation split for maintainability
- Main file re-exports all functionality from submodules
