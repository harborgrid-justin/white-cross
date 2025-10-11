# Optimistic Updates System - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         APPLICATION LAYER                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │
│  │  React          │  │  TanStack       │  │  API Layer      │        │
│  │  Components     │  │  Query Hooks    │  │  (Axios)        │        │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘        │
│           │                     │                     │                  │
└───────────┼─────────────────────┼─────────────────────┼──────────────────┘
            │                     │                     │
            │                     ▼                     │
            │      ┌──────────────────────────────┐    │
            │      │   Custom Mutation Hooks      │    │
            │      │  useOptimisticIncidentXXX    │    │
            │      └──────────────┬───────────────┘    │
            │                     │                     │
            ▼                     ▼                     ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                    OPTIMISTIC UPDATE SYSTEM                                │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │              OptimisticUpdateManager (Singleton)                  │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │   │
│  │  │   Update     │  │   Conflict   │  │    Queue     │          │   │
│  │  │   Tracking   │  │   Detection  │  │  Management  │          │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │   │
│  │  │   Rollback   │  │    Audit     │  │  Statistics  │          │   │
│  │  │    Logic     │  │   Logging    │  │   & Metrics  │          │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                            │
│  ┌─────────────────────────────┐  ┌──────────────────────────────┐     │
│  │   Helper Functions          │  │   UI Components              │     │
│  │  • optimisticCreate()       │  │  • OptimisticUpdateIndicator │     │
│  │  • optimisticUpdate()       │  │  • UpdateToast               │     │
│  │  • optimisticDelete()       │  │  • RollbackButton            │     │
│  │  • confirmUpdate()          │  │  • ConflictResolutionModal   │     │
│  │  • rollbackUpdate()         │  │                              │     │
│  │  • Transaction Support      │  │                              │     │
│  └─────────────────────────────┘  └──────────────────────────────┘     │
└───────────────────────────────────────────────────────────────────────────┘
            │                                                │
            ▼                                                ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                        TanStack Query Cache                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                   │
│  │  Query Data  │  │  Invalidation│  │  Refetch     │                   │
│  │  Management  │  │  Control     │  │  Strategies  │                   │
│  └──────────────┘  └──────────────┘  └──────────────┘                   │
└───────────────────────────────────────────────────────────────────────────┘
```

## Update Flow Diagram

```
┌─────────────┐
│  User       │
│  Action     │
└──────┬──────┘
       │
       ▼
┌────────────────────────────────────────────────────────┐
│  1. CREATE OPTIMISTIC UPDATE                           │
│     • Generate temp ID (for creates)                   │
│     • Snapshot previous data                           │
│     • Apply optimistic data to cache                   │
│     • Set status: PENDING → APPLIED                    │
└────────────────────┬───────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│  2. USER SEES INSTANT UPDATE                           │
│     • UI updates immediately                           │
│     • OptimisticUpdateIndicator shows pending          │
│     • No waiting for server                            │
└────────────────────┬───────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│  3. SEND API REQUEST                                   │
│     • Make HTTP request to server                      │
│     • Include update metadata                          │
└────────────────────┬───────────────────────────────────┘
                     │
           ┌─────────┴──────────┐
           │                    │
           ▼                    ▼
┌──────────────────┐   ┌──────────────────┐
│  4a. SUCCESS     │   │  4b. FAILURE     │
└────────┬─────────┘   └────────┬─────────┘
         │                      │
         ▼                      ▼
┌──────────────────┐   ┌──────────────────────────────┐
│ Check for        │   │ ROLLBACK                     │
│ Conflicts        │   │  • Restore previous data     │
│                  │   │  • Remove temp entities      │
│                  │   │  • Set status: ROLLED_BACK   │
│                  │   │  • Show error toast          │
│                  │   │  • Offer retry option        │
└────────┬─────────┘   └──────────────────────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌──────────────┐
│ No      │ │ Conflict     │
│ Conflict│ │ Detected     │
└────┬────┘ └──────┬───────┘
     │             │
     ▼             ▼
┌─────────────┐ ┌──────────────────────────────┐
│ CONFIRM     │ │ RESOLVE CONFLICT             │
│  • Replace  │ │  • Apply resolution strategy │
│    temp IDs │ │  • Show modal (if MANUAL)    │
│  • Update   │ │  • Merge data (if MERGE)     │
│    cache    │ │  • Choose version            │
│  • Status:  │ │  • Status: CONFLICTED        │
│    CONFIRMED│ │                              │
│  • Show     │ └──────────────────────────────┘
│    success  │
│    toast    │
└─────────────┘
```

## Component Interaction Diagram

```
┌────────────────────────────────────────────────────────────┐
│  App.tsx (Root Component)                                  │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Global UI Components (One Time Setup)               │ │
│  │  • OptimisticUpdateIndicator (top-right)             │ │
│  │  • UpdateToast (bottom-right)                        │ │
│  │  • ConflictResolutionModal (auto-show)               │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Feature Components                                   │ │
│  │                                                        │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │  IncidentForm Component                        │  │ │
│  │  │  ┌──────────────────────────────────────────┐ │  │ │
│  │  │  │  const create = useOptimisticIncident    │ │  │ │
│  │  │  │              Create()                     │ │  │ │
│  │  │  │                                           │ │  │ │
│  │  │  │  const update = useOptimisticIncident    │ │  │ │
│  │  │  │              Update()                     │ │  │ │
│  │  │  │                                           │ │  │ │
│  │  │  │  const delete = useOptimisticIncident    │ │  │ │
│  │  │  │              Delete()                     │ │  │ │
│  │  │  └──────────────────────────────────────────┘ │  │ │
│  │  │                                                │  │ │
│  │  │  • Form submission triggers mutations         │  │ │
│  │  │  • Loading states from isPending              │  │ │
│  │  │  • Error handling with onError                │  │ │
│  │  │  • Success callbacks with onSuccess           │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  │                                                        │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │  WitnessStatements Component                   │  │ │
│  │  │  • useOptimisticWitnessCreate()                │  │ │
│  │  │  • useOptimisticWitnessUpdate()                │  │ │
│  │  │  • useOptimisticWitnessVerify()                │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  │                                                        │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │  FollowUpActions Component                     │  │ │
│  │  │  • useOptimisticFollowUpCreate()               │  │ │
│  │  │  • useOptimisticFollowUpUpdate()               │  │ │
│  │  │  • useOptimisticFollowUpComplete()             │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
                          │
                          │ All components interact with
                          ▼
            ┌─────────────────────────────┐
            │  OptimisticUpdateManager    │
            │  (Global Singleton)         │
            └─────────────────────────────┘
```

## Data Structure Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  OptimisticUpdate<T>                                        │
├─────────────────────────────────────────────────────────────┤
│  id: string                    (opt_1234567890_abc123)      │
│  queryKey: QueryKey            (['incidents', 'list'])      │
│  operationType: OperationType  (CREATE/UPDATE/DELETE)       │
│  status: UpdateStatus          (PENDING → APPLIED → ...)    │
│  previousData: T | null        (Original data snapshot)     │
│  optimisticData: T             (New data to show)           │
│  confirmedData?: T             (Server response)            │
│  timestamp: number             (When created)               │
│  completedAt?: number          (When finished)              │
│  error?: ErrorInfo             (If failed)                  │
│  rollbackStrategy             (How to rollback)            │
│  conflictStrategy             (How to resolve conflicts)   │
│  transactionId?: string        (Group related updates)      │
│  retryCount: number            (Retry attempts)             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ConflictResolution<T>                                      │
├─────────────────────────────────────────────────────────────┤
│  update: OptimisticUpdate<T>   (The conflicted update)     │
│  serverData: T                  (Server's version)          │
│  clientData: T                  (Client's version)          │
│  strategy: ConflictResolution   (How to resolve)           │
│  mergedData?: T                 (If using MERGE)            │
│  userChoice?: string            (If MANUAL resolution)      │
│  detectedAt: number             (When detected)             │
│  resolvedAt?: number            (When resolved)             │
└─────────────────────────────────────────────────────────────┘
```

## State Machine Diagram

```
                    ┌─────────────┐
                    │   PENDING   │
                    │  (Created)  │
                    └──────┬──────┘
                           │
                           │ Apply to cache
                           ▼
                    ┌─────────────┐
                    │   APPLIED   │
                    │  (In cache) │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       Server │     Server │     Server │
       Success│      Error │   Conflict │
              ▼            ▼            ▼
      ┌────────────┐ ┌──────────┐ ┌────────────┐
      │ CONFIRMED  │ │  FAILED  │ │ CONFLICTED │
      │  (Success) │ │  (Error) │ │ (Conflict) │
      └────────────┘ └─────┬────┘ └─────┬──────┘
                           │            │
                           │ Rollback   │ Resolve
                           ▼            ▼
                    ┌──────────────┐ ┌────────────┐
                    │ ROLLED_BACK  │ │ CONFIRMED  │
                    │  (Reverted)  │ │ (Resolved) │
                    └──────────────┘ └────────────┘
```

## Query Key Structure

```
Incidents:
['incidents']                          - Base key
['incidents', 'list']                  - List of incidents
['incidents', 'list', { filters }]     - Filtered list
['incidents', 'detail', id]            - Single incident
['incidents', id, 'witnesses']         - Witness statements
['incidents', id, 'followUps']         - Follow-up actions

Witness Statements:
['incidents', incidentId, 'witnesses']             - All witnesses
['incidents', incidentId, 'witnesses', 'detail', id] - Single witness

Follow-Up Actions:
['incidents', incidentId, 'followUps']             - All follow-ups
['incidents', incidentId, 'followUps', 'detail', id] - Single action
```

## Event Flow

```
1. User clicks "Create Incident"
   ↓
2. Component calls createMutation.mutate(data)
   ↓
3. useOptimisticIncidentCreate hook:
   - onMutate: Create optimistic update
   - Apply to cache immediately
   ↓
4. User sees new incident in UI (instant)
   OptimisticUpdateIndicator shows "1 update pending"
   ↓
5. Hook calls API: incidentReportsApi.create(data)
   ↓
6. API response:

   SUCCESS:                          FAILURE:
   - onSuccess triggered            - onError triggered
   - Confirm with server data       - Rollback to previous
   - Replace temp ID with real ID   - Show error toast
   - Show success toast             - Offer retry
   - OptimisticUpdateIndicator      - OptimisticUpdateIndicator
     clears                           clears

   CONFLICT:
   - Detect server data differs
   - ConflictResolutionModal opens
   - User chooses resolution
   - Apply chosen version
   - OptimisticUpdateIndicator clears
```

## Memory Management

```
┌─────────────────────────────────────────────────────────┐
│  Update Lifecycle in Memory                             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Create → Store in Map<updateId, OptimisticUpdate>     │
│            ↓                                             │
│  Process → Track status changes                         │
│            ↓                                             │
│  Complete → Keep for audit trail                        │
│            ↓                                             │
│  Cleanup → Remove after configurable time (5 min)      │
│            (clearOldUpdates)                            │
│                                                          │
│  Conflicts stored separately in Map<updateId, Conflict> │
│  Cleared after resolution                               │
│                                                          │
│  Queue stored as Map<queryKey, updateId[]>             │
│  Cleared as updates are processed                       │
└─────────────────────────────────────────────────────────┘
```

## Integration Points

```
┌─────────────────────────────────────────────────────────┐
│  Integration with Existing Systems                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  TanStack Query:                                        │
│  • queryClient.setQueryData() - Apply optimistic        │
│  • queryClient.invalidateQueries() - Refetch            │
│  • queryClient.getQueryData() - Read current            │
│  • useMutation hooks - Trigger operations               │
│                                                          │
│  API Layer:                                             │
│  • incidentReportsApi.create() - Create endpoint        │
│  • incidentReportsApi.update() - Update endpoint        │
│  • incidentReportsApi.delete() - Delete endpoint        │
│                                                          │
│  State Management:                                      │
│  • TanStack Query cache as single source of truth       │
│  • Optimistic updates modify cache directly             │
│  • Server is authoritative                              │
│                                                          │
│  UI Framework:                                          │
│  • React components render from cache                   │
│  • Hooks provide mutations                              │
│  • Context/providers not needed                         │
└─────────────────────────────────────────────────────────┘
```

## File Organization

```
frontend/src/
├── utils/
│   ├── optimisticUpdates.ts              (Core manager)
│   ├── optimisticHelpers.ts              (Helper functions)
│   ├── optimisticUpdates.examples.ts     (Usage examples)
│   ├── optimisticUpdates.test.ts         (Unit tests)
│   ├── OPTIMISTIC_UPDATES_README.md      (Full docs)
│   ├── OPTIMISTIC_UPDATES_QUICKSTART.md  (Quick start)
│   ├── OPTIMISTIC_UPDATES_SUMMARY.md     (Implementation summary)
│   └── OPTIMISTIC_UPDATES_ARCHITECTURE.md (This file)
│
├── hooks/
│   └── useOptimisticIncidents.ts         (Custom mutation hooks)
│
└── components/shared/
    ├── OptimisticUpdateIndicator.tsx     (UI indicator)
    ├── UpdateToast.tsx                   (Toast notifications)
    ├── RollbackButton.tsx                (Rollback UI)
    ├── ConflictResolutionModal.tsx       (Conflict resolution)
    └── index.ts                          (Exports)
```

## Best Practices Visualization

```
┌─────────────────────────────────────────────────────────┐
│  Optimistic Update Best Practices                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  DO:                                                     │
│  ✓ Always snapshot previous data                        │
│  ✓ Use temp IDs for creates                            │
│  ✓ Handle errors gracefully                             │
│  ✓ Provide rollback options                             │
│  ✓ Show update status to users                          │
│  ✓ Log operations for audit                             │
│  ✓ Test rollback scenarios                              │
│  ✓ Clean up old updates                                 │
│                                                          │
│  DON'T:                                                  │
│  ✗ Skip error handling                                  │
│  ✗ Forget to confirm updates                            │
│  ✗ Ignore conflicts                                     │
│  ✗ Leave updates pending forever                        │
│  ✗ Log sensitive PHI data                               │
│  ✗ Block UI during rollback                             │
│  ✗ Skip testing edge cases                              │
└─────────────────────────────────────────────────────────┘
```

This architecture ensures a robust, scalable, and maintainable optimistic update system suitable for enterprise healthcare applications.
