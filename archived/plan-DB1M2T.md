# Database Models Type Safety Enhancement Plan

**Task ID:** fix-any-types-database-models
**Agent ID:** typescript-architect
**Started:** 2025-11-07

## Objective

Replace all `any` type usages in database models with proper TypeScript types to achieve full type safety and improve code maintainability.

## Scope

### Priority Models (Most `any` Usages)
1. **audit-log.model.ts** - 5 `any` usages
2. **chronic-condition.model.ts** - 4 `any` usages
3. **alert.model.ts** - 6 `any` usages
4. **incident-report.model.ts** - 4 `any` usages
5. **drug-catalog.model.ts** - 3 `any` usages

## Implementation Strategy

### Phase 1: Analysis & Type Definition (30 min)
- Analyze each `any` usage context
- Define proper interfaces/types for JSONB fields
- Create relationship type imports from related models
- Document type constraints

### Phase 2: Type Implementation (60 min)
- Replace `any` with proper types in each model
- Create shared type definitions where appropriate
- Ensure backward compatibility
- Add JSDoc comments for complex types

### Phase 3: Validation & Testing (30 min)
- Run TypeScript compiler to verify no errors
- Check for any breaking changes
- Validate all imports resolve correctly
- Document all changes

## Detailed Workstreams

### 1. audit-log.model.ts
**`any` Locations:**
- Line 50: `changes: any` → `changes: Record<string, unknown> | null`
- Line 51: `previousValues: any` → `previousValues: Record<string, unknown> | null`
- Line 52: `newValues: any` → `newValues: Record<string, unknown> | null`
- Line 62: `metadata: any` → `metadata: Record<string, unknown> | null`
- Line 312: `toExportObject(): any` → `toExportObject(): Partial<AuditLogAttributes>`

### 2. chronic-condition.model.ts
**`any` Locations:**
- Line 62: `student?: any` → `student?: import('./student.model').Student`
- Line 63: `healthRecord?: any` → `healthRecord?: import('./health-record.model').HealthRecord`
- Line 199: `validate isArrayOfStrings(value: any)` → `(value: unknown)`
- Line 316: `declare student?: any` → Proper type import
- Line 322: `declare healthRecord?: any` → Proper type import
- Line 327: `auditPHIAccess(options: any)` → `options: { transaction?: Transaction }`

### 3. alert.model.ts
**`any` Locations:**
- Line 68: `metadata?: Record<string, any>` → `metadata?: Record<string, unknown>`
- Line 241: `declare definition?: any` → Proper type import
- Line 301: `declare student?: any` → Proper type import
- Line 317: `declare user?: any` → Proper type import
- Line 333: `declare school?: any` → Proper type import
- Line 369: `declare creator?: any` → Proper type import
- Plus other relationship types

### 4. incident-report.model.ts
**`any` Locations:**
- Line 88: `followUpActions?: any[]` → Proper type array
- Line 89: `witnessStatements?: any[]` → Proper type array
- Line 390: `declare student?: any` → Proper type import
- Line 396: `declare reporter?: any` → Proper type import
- Line 402: `declare followUpActions?: any[]` → Proper type array
- Line 408: `declare witnessStatements?: any[]` → Proper type array
- Line 413: `auditPHIAccess(options: any)` → Proper options type

### 5. drug-catalog.model.ts
**`any` Locations:**
- Line 28: `commonDoses?: Record<string, any>` → `commonDoses?: Record<string, DoseInformation>`
- Line 35-37: Relationship arrays → Proper type imports
- Line 185-197: All relationship declarations → Proper types

## Type Definitions to Create

### Shared Types (create in database/types/ directory)

```typescript
// database/types/model-relationships.types.ts
export type ModelRelationship<T> = T | undefined;

// database/types/jsonb-data.types.ts
export interface DoseInformation {
  amount: string;
  unit: string;
  frequency?: string;
  route?: string;
}

export type ChangeRecord = Record<string, unknown>;
export type MetadataRecord = Record<string, unknown>;
```

## Success Criteria

- ✅ Zero `any` types in all 5 priority models
- ✅ All types compile without errors
- ✅ Type imports resolve correctly
- ✅ No breaking changes to existing functionality
- ✅ Comprehensive documentation of changes

## Rollback Plan

- All changes tracked in git
- Can revert individual model changes independently
- Type definitions in separate files for easy removal

## Timeline

- **Phase 1:** 30 minutes
- **Phase 2:** 60 minutes
- **Phase 3:** 30 minutes
- **Total:** 2 hours
