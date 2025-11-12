# Statistics File Breakdown Plan - ST94K2

## References to Other Agent Work
- Architecture notes: `.temp/architecture-notes-BDM701.md`
- Previous task status: `.temp/task-status-BDM701.json`

## Objective
Break down `statistics.ts` (787 lines) into smaller, focused modules under 300 LOC each for better maintainability, testability, and code organization.

## File Breakdown Strategy

### 1. **types.ts** (~80 LOC)
All TypeScript interfaces and type definitions:
- ApiError
- EnrollmentStats
- HealthStats
- ActivityStats
- RiskStats
- ComplianceStats
- DashboardMetrics
- TimeRange types

### 2. **useEnrollmentStats.ts** (~90 LOC)
Enrollment statistics hook:
- useEnrollmentStats hook
- Enrollment calculation logic
- Grade breakdown
- Growth trends

### 3. **useHealthStats.ts** (~90 LOC)
Health statistics hook:
- useHealthStats hook
- Allergy tracking
- Medication tracking
- Chronic conditions

### 4. **useActivityRiskStats.ts** (~120 LOC)
Activity and risk assessment hooks:
- useActivityStats hook
- useRiskStats hook
- Risk calculation logic

### 5. **useComplianceStats.ts** (~80 LOC)
Compliance statistics hook:
- useComplianceStats hook
- Compliance calculations
- Non-compliant student tracking

### 6. **useDashboardMetrics.ts** (~140 LOC)
Dashboard composite hook:
- useDashboardMetrics hook
- Alert generation
- Combined metrics

### 7. **useAnalyticsStats.ts** (~110 LOC)
Advanced analytics hooks:
- useTrendAnalysis hook
- useComparativeStats hook

### 8. **index.ts** (~50 LOC)
Re-export all hooks and types for backward compatibility

## Timeline
- Phase 1: Create types file (5 min)
- Phase 2: Extract individual hooks (25 min)
- Phase 3: Create index file (5 min)
- Phase 4: Validation (10 min)
- Total: ~45 minutes

## Success Criteria
- All files under 300 LOC
- No functionality changes
- Full backward compatibility via index.ts
- Proper imports/exports
- TypeScript type safety maintained
