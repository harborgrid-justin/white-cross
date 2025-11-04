// This file has been split into smaller, more manageable modules.
// All exports are maintained for backward compatibility.
//
// File breakdown:
// - types.ts: All input type definitions
// - api/: Mock API functions split by domain
//   - emergencyPlanApi.ts
//   - emergencyIncidentApi.ts
//   - emergencyContactApi.ts
//   - emergencyProcedureApi.ts
//   - emergencyResourceApi.ts
//   - emergencyTrainingApi.ts
//   - bulkOperationApi.ts
// - useEmergencyPlanMutations.ts: Plan-related mutation hooks
// - useEmergencyIncidentMutations.ts: Incident-related mutation hooks
// - useEmergencyContactMutations.ts: Contact-related mutation hooks
// - useEmergencyProcedureMutations.ts: Procedure-related mutation hooks
// - useEmergencyResourceMutations.ts: Resource-related mutation hooks
// - useEmergencyTrainingMutations.ts: Training-related mutation hooks
// - useBulkOperationMutations.ts: Bulk operation mutation hooks
// - index.ts: Central re-export file
//
// For new code, prefer importing from the specific module files or from the index.
// This file exists only for backward compatibility.

export * from './index';
