# Repository `any` Type Elimination Plan

**Task ID**: A7B3C9
**Agent**: TypeScript Architect
**Started**: 2025-11-07
**Objective**: Eliminate all `any` type usages across 82 repository files

## Overview

This plan addresses systematic elimination of `any` types in the database repository layer, replacing them with proper TypeScript types to achieve end-to-end type safety.

## Affected Files

- **Base**: 1 file (base.repository.ts)
- **Interfaces**: 4 files
- **Implementations**: 77 files

## Implementation Phases

### Phase 1: Foundation Types (Base & Interfaces)
**Duration**: 30 minutes
**Priority**: CRITICAL

1. **base.repository.ts**
   - Replace `model: any` with `ModelStatic<TModel>`
   - Replace `any` in map callbacks with typed parameters
   - Replace `any` in where clauses with `WhereOptions`
   - Replace `any[]` with proper Sequelize include types
   - Fix all method parameter and return types

2. **repository.interface.ts**
   - Replace `details?: any` in RepositoryError with `Record<string, unknown>`

### Phase 2: High-Priority Repository Implementations
**Duration**: 1 hour
**Priority**: HIGH

Focus on most frequently used repositories:
- user.repository.ts
- student.repository.ts
- health-record.repository.ts
- medication.repository.ts
- appointment.repository.ts

### Phase 3: Remaining Repository Implementations
**Duration**: 2-3 hours
**Priority**: MEDIUM

Systematically fix all 72 remaining repository files.

## Type Safety Patterns

### Pattern 1: Model Type
```typescript
// Before
protected readonly model: any;

// After
protected readonly model: ModelStatic<TModel>;
```

### Pattern 2: Where Clauses
```typescript
// Before
protected buildWhereClause(where: any): WhereOptions

// After
protected buildWhereClause(where: Partial<TAttributes> | WhereOptions<TAttributes>): WhereOptions<TAttributes>
```

### Pattern 3: Order Clauses
```typescript
// Before
protected buildOrderClause(orderBy: any): any

// After
protected buildOrderClause(orderBy: Array<[keyof TAttributes, 'ASC' | 'DESC']> | Record<keyof TAttributes, 'ASC' | 'DESC'>): Order
```

### Pattern 4: Include Clauses
```typescript
// Before
protected buildIncludeClause(include: QueryOptions['include']): any[]

// After
protected buildIncludeClause(include: QueryOptions['include']): Includeable[]
```

### Pattern 5: Change Tracking
```typescript
// Before
protected calculateChanges(before: any, after: any): Record<string, { before: any; after: any }>

// After
protected calculateChanges(before: Partial<TAttributes>, after: Partial<TAttributes>): Record<string, { before: unknown; after: unknown }>
```

### Pattern 6: Audit Sanitization
```typescript
// Before
protected abstract sanitizeForAudit(data: any): any;

// After
protected abstract sanitizeForAudit(data: Partial<TAttributes>): Record<string, unknown>;
```

## Validation Strategy

After each phase:
1. Run TypeScript compiler (`npm run build`)
2. Verify no type errors introduced
3. Check that existing tests still pass
4. Update documentation if needed

## Deliverables

- [ ] All 82 repository files with `any` types replaced
- [ ] Type-safe base repository implementation
- [ ] Comprehensive summary document
- [ ] Zero TypeScript `any` usages in repository layer
