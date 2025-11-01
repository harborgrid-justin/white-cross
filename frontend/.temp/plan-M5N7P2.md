# Implementation Plan: Fix Utility & Hooks TypeScript Errors
**Agent ID**: M5N7P2
**Task**: Fix 128 TypeScript errors in utility functions and React hooks
**Started**: 2025-11-01T13:53:00Z

## References to Other Agent Work
- Base error analysis: `.temp/typescript-errors-K9M3P6.txt`
- TS2305/TS2307 fixes: `.temp/task-status-K9M3P6.json`
- TS7006 parameter fixes: `.temp/task-status-F9P2X6.json`
- TS18046 undefined fixes: `.temp/task-status-K2P7W5.json`

## Error Categories (128 Total)

### 1. Missing Hook Modules (10 errors)
Top-level hooks that don't exist and need to be created:
- `@/hooks/useToast` (5 references)
- `@/hooks/usePermissions` (1 reference)
- `@/hooks/useStudentAllergies` (1 reference)
- `@/hooks/useStudentPhoto` (1 reference)
- `@/hooks/useConnectionMonitor` (1 reference)
- `@/hooks/useOfflineQueue` (1 reference)
- `@/hooks/useOptimisticStudents` (3 references)
- `@/hooks/useRouteState` (3 references)
- `@/hooks/queries/useMessages` (1 reference)
- `@/hooks/queries/useConversations` (1 reference)

### 2. Apollo Client Type Issues (12 errors)
Missing type exports from `@apollo/client`:
- `useQuery`, `useMutation`, `useSubscription`, `ApolloError`
- In: `src/graphql/hooks/useContacts.ts`, `useMedications.ts`, `useNotifications.ts`, `useStudents.ts`

### 3. React Query Type Issues (15 errors)
Missing type exports from `@tanstack/react-query`:
- `useInfiniteQuery`, `useSuspenseQuery`, `useSuspenseInfiniteQuery`
- `HydrationBoundary`, `dehydrate`, `DehydratedState`, `useIsFetching`, `InfiniteData`

### 4. Missing Type Exports (35 errors)
Types that need to be added to existing modules:
- Document types: `DocumentMetadata`, `SignatureWorkflow`, `Signature`, etc.
- Medication types: `Medication`, `MedicationInventory`, `MedicationReminder`, etc.
- Redux store types: `RootState`, `AppDispatch`, `store`, etc.

### 5. Missing Utilities (25 errors)
Utility files and service modules that don't exist:
- Service modules: Connection, offline queue, WebSocket, security
- Utility files: `cn` utility, route utils

### 6. Service Layer Issues (13 errors)
Missing service modules referenced by hooks:
- `ConnectionMonitor`, `OfflineQueueManager`, `WebSocketService`
- `SecureTokenManager`, `CsrfProtection`, `AuditService`

## Phase 1: Create Missing Hook Barrel Exports (Priority)
**Duration**: 30 minutes
**Deliverable**: 10 hook re-export files

Create barrel export files that re-export from existing implementations in subdirectories.

## Phase 2: Fix Apollo Client & React Query Types
**Duration**: 20 minutes
**Deliverable**: Install correct package versions or add type augmentations

## Phase 3: Add Missing Type Exports
**Duration**: 40 minutes
**Deliverable**: Updated type definition files with all required exports

## Phase 4: Create Missing Service Layer Modules
**Duration**: 45 minutes
**Deliverable**: Service module stubs or proper implementations

## Phase 5: Fix Utilities and Imports
**Duration**: 30 minutes
**Deliverable**: Missing utility files and corrected import paths

## Phase 6: Verification
**Duration**: 15 minutes
**Deliverable**: Clean TypeScript compilation for all hooks/utils/lib

## Total Estimated Time: 3 hours
