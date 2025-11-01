# TS18046 Error Resolution Plan - K2P7W5

## Task Overview
Fix all 205 TS18046 errors ("is of type 'unknown'") in the codebase by adding type guards, type assertions, and runtime type checking.

## Error Distribution Analysis
- **Analytics pages**: 2 errors (percent variable)
- **Medication pages**: 80 errors (response, medicationRes, logRes)
- **Transaction actions**: 2 errors (sort comparison)
- **FollowUpActionContext**: 5 errors (response)
- **advancedHooks.ts**: 18 errors (op, status, m, exec)
- **forms/schema.ts**: 2 errors (file)
- **ApiClient.test.ts**: 6 errors (response.data)
- **ServiceOrchestrator.ts**: 2 errors (incident)
- **dashboardApi.ts**: 17 errors (error)
- **documentsApi.ts**: 5 errors (result, response.data)
- **integrationApi.ts**: 4 errors (error)
- **Medication APIs**: 58 errors (response.data)
- **medicationsApi.ts**: 10 errors (error)
- **purchaseOrderApi.ts**: 6 errors (error)

## Implementation Strategy

### Phase 1: Type Utility Creation (15 min)
- Create type guard utilities for common patterns
- Create type predicate functions
- Set up runtime type checking helpers

### Phase 2: Analytics Pages (5 min)
- Fix 2 'percent' type errors in chart data

### Phase 3: Medication Pages (60 min)
- Fix 80 errors in medication dashboard pages
- Add type guards for API responses
- Add proper type narrowing for medicationRes/logRes

### Phase 4: Service Layer (45 min)
- Fix 17 dashboardApi.ts errors
- Fix 10 medicationsApi.ts errors
- Fix 6 purchaseOrderApi.ts errors
- Fix 4 integrationApi.ts errors
- Fix 5 documentsApi.ts errors

### Phase 5: Medication API Modules (40 min)
- Fix 15 AdministrationApi.ts errors
- Fix 13 MedicationFormularyApi.ts errors
- Fix 14 PrescriptionApi.ts errors

### Phase 6: Hooks and Context (25 min)
- Fix 18 advancedHooks.ts errors
- Fix 5 FollowUpActionContext.tsx errors

### Phase 7: Miscellaneous Files (15 min)
- Fix 2 transaction action errors
- Fix 2 form schema errors
- Fix 6 test file errors
- Fix 2 ServiceOrchestrator.ts errors

### Phase 8: Verification (10 min)
- Run type-check to verify all fixes
- Document summary of changes

## Total Estimated Time: 3.5 hours

## References to Other Agent Work
- Architecture notes: .temp/architecture-notes-A1B2C3.md
- Architecture notes: .temp/architecture-notes-X7Y3Z9.md
