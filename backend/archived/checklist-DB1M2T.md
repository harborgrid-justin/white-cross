# Database Models Type Safety Checklist

## Phase 1: Analysis & Type Definition

- [ ] Analyze all `any` usages in audit-log.model.ts
- [ ] Analyze all `any` usages in chronic-condition.model.ts
- [ ] Analyze all `any` usages in alert.model.ts
- [ ] Analyze all `any` usages in incident-report.model.ts
- [ ] Analyze all `any` usages in drug-catalog.model.ts
- [ ] Create shared type definitions directory structure
- [ ] Define JSONB data types
- [ ] Define relationship types
- [ ] Document type constraints and validation rules

## Phase 2: Type Implementation

### audit-log.model.ts
- [ ] Replace `changes: any` with proper type
- [ ] Replace `previousValues: any` with proper type
- [ ] Replace `newValues: any` with proper type
- [ ] Replace `metadata: any` with proper type
- [ ] Fix `toExportObject()` return type
- [ ] Add JSDoc comments for complex types
- [ ] Verify TypeScript compilation

### chronic-condition.model.ts
- [ ] Replace `student?: any` with proper type import
- [ ] Replace `healthRecord?: any` with proper type import
- [ ] Fix validator parameter types (line 199, 216, 233, 250)
- [ ] Fix relationship declarations (line 316, 322)
- [ ] Fix hook options parameter (line 327)
- [ ] Add JSDoc comments
- [ ] Verify TypeScript compilation

### alert.model.ts
- [ ] Replace `metadata?: Record<string, any>` with proper type
- [ ] Replace `declare definition?: any` with proper type
- [ ] Replace `declare student?: any` with proper type
- [ ] Replace `declare user?: any` with proper type
- [ ] Replace `declare school?: any` with proper type
- [ ] Replace `declare creator?: any` with proper type
- [ ] Fix all other relationship declarations
- [ ] Add JSDoc comments
- [ ] Verify TypeScript compilation

### incident-report.model.ts
- [ ] Replace `followUpActions?: any[]` in interface
- [ ] Replace `witnessStatements?: any[]` in interface
- [ ] Fix all relationship declarations
- [ ] Fix hook options parameter
- [ ] Add JSDoc comments
- [ ] Verify TypeScript compilation

### drug-catalog.model.ts
- [ ] Create DoseInformation interface
- [ ] Replace `commonDoses?: Record<string, any>` with proper type
- [ ] Fix all relationship array declarations
- [ ] Add JSDoc comments
- [ ] Verify TypeScript compilation

## Phase 3: Validation & Testing

- [ ] Run `npm run build` to verify compilation
- [ ] Check for any TypeScript errors
- [ ] Verify all imports resolve correctly
- [ ] Run existing tests to ensure no breaking changes
- [ ] Document all changes in summary report
- [ ] Update task-status.json with completion
- [ ] Move all tracking files to .temp/completed/
