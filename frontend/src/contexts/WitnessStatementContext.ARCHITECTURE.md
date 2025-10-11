# Witness Statement Context - Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Incident Detail Page                         │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │         WitnessStatementProvider                        │    │
│  │  (Manages state & operations for witness statements)   │    │
│  │                                                          │    │
│  │  ┌────────────────────────────────────────────┐       │    │
│  │  │         TanStack Query Layer                │       │    │
│  │  │  - Automatic Caching                        │       │    │
│  │  │  - Background Refetching                    │       │    │
│  │  │  - Optimistic Updates                       │       │    │
│  │  │  - Query Invalidation                       │       │    │
│  │  └───────────────┬────────────────────────────┘       │    │
│  │                  │                                      │    │
│  │  ┌───────────────▼────────────────────────────┐       │    │
│  │  │        Context State                        │       │    │
│  │  │  - statements: WitnessStatement[]           │       │    │
│  │  │  - selectedStatement: WitnessStatement      │       │    │
│  │  │  - currentIncidentId: string                │       │    │
│  │  │  - formState: FormData                      │       │    │
│  │  │  - operationLoading: LoadingStates          │       │    │
│  │  └───────────────┬────────────────────────────┘       │    │
│  │                  │                                      │    │
│  │  ┌───────────────▼────────────────────────────┐       │    │
│  │  │        Context Methods                      │       │    │
│  │  │  - loadWitnessStatements()                 │       │    │
│  │  │  - createWitnessStatement()                │       │    │
│  │  │  - updateWitnessStatement()                │       │    │
│  │  │  - deleteWitnessStatement()                │       │    │
│  │  │  - verifyStatement()                       │       │    │
│  │  │  - unverifyStatement()                     │       │    │
│  │  └───────────────┬────────────────────────────┘       │    │
│  │                  │                                      │    │
│  └──────────────────┼──────────────────────────────────────┘    │
│                     │                                            │
│     ┌───────────────▼──────────────┐                           │
│     │  useWitnessStatements() Hook │                           │
│     └───────────────┬──────────────┘                           │
│                     │                                            │
│     ┌───────────────┴──────────────┐                           │
│     │                                │                           │
│  ┌──▼──────────────┐  ┌─────────────▼─────────────┐           │
│  │ Statement List  │  │ Create Statement Form      │           │
│  │ Component       │  │ Component                  │           │
│  └──┬──────────────┘  └─────────────┬─────────────┘           │
│     │                                 │                          │
│  ┌──▼──────────────┐  ┌─────────────▼─────────────┐           │
│  │ Statement Card  │  │ Edit Statement Modal       │           │
│  │ Component       │  │ Component                  │           │
│  └──┬──────────────┘  └─────────────┬─────────────┘           │
│     │                                 │                          │
└─────┼─────────────────────────────────┼──────────────────────────┘
      │                                 │
      └────────────┬────────────────────┘
                   │
      ┌────────────▼────────────┐
      │  Incident Reports API    │
      │  (Backend Service)       │
      │                          │
      │  - GET /witness-statements/{incidentId}                  │
      │  - POST /witness-statements                              │
      │  - PUT /witness-statements/{id}                          │
      │  - DELETE /witness-statements/{id}                       │
      │  - PUT /witness-statements/{id}/verify                   │
      └────────────┬────────────┘
                   │
      ┌────────────▼────────────┐
      │   PostgreSQL Database    │
      │   (witness_statements)   │
      └──────────────────────────┘
```

## Data Flow Diagram

### Read Operation (Load Statements)

```
Component
  │
  └─> useWitnessStatements()
        │
        └─> loadWitnessStatements(incidentId)
              │
              └─> TanStack Query
                    │
                    ├─> Check Cache
                    │     │
                    │     ├─> Cache Hit? → Return Cached Data
                    │     │
                    │     └─> Cache Miss? → Fetch from API
                    │           │
                    │           └─> incidentReportsApi.getWitnessStatements()
                    │                 │
                    │                 └─> Backend API
                    │                       │
                    │                       └─> Database
                    │                             │
                    │                             └─> Return Data
                    │                                   │
                    └───────────────────────────────────┘
                          │
                          └─> Update Cache
                                │
                                └─> Update Component State
                                      │
                                      └─> Re-render UI
```

### Write Operation (Create Statement) with Optimistic Updates

```
Component
  │
  └─> createWitnessStatement(data)
        │
        ├─> 1. Optimistic Update
        │     │
        │     ├─> Cancel Outgoing Refetches
        │     │
        │     ├─> Snapshot Current Data
        │     │
        │     └─> Update Cache with Temporary Data
        │           │
        │           └─> UI Updates INSTANTLY ⚡
        │
        ├─> 2. Send API Request
        │     │
        │     └─> incidentReportsApi.addWitnessStatement(data)
        │           │
        │           └─> Backend API
        │                 │
        │                 ├─> Success? ✓
        │                 │     │
        │                 │     ├─> Invalidate Related Queries
        │                 │     │
        │                 │     ├─> Refetch Fresh Data
        │                 │     │
        │                 │     └─> Show Success Toast
        │                 │
        │                 └─> Error? ✗
        │                       │
        │                       ├─> Rollback to Snapshot
        │                       │
        │                       ├─> Restore Previous State
        │                       │
        │                       └─> Show Error Toast
        │
        └─> 3. Complete
              │
              └─> Return Result to Component
```

## Component Hierarchy

```
IncidentDetailPage
  │
  └─> WitnessStatementProvider (Context Provider)
        │
        ├─> IncidentHeader
        │
        ├─> IncidentDetailsSection
        │
        ├─> WitnessStatementSection (Uses Context)
        │     │
        │     ├─> WitnessStatementList (Uses Context)
        │     │     │
        │     │     └─> WitnessStatementCard[] (Uses Context)
        │     │           │
        │     │           ├─> VerifyButton
        │     │           ├─> EditButton
        │     │           └─> DeleteButton
        │     │
        │     └─> CreateStatementButton (Uses Context)
        │           │
        │           └─> Opens CreateStatementForm (Uses Context)
        │
        ├─> FollowUpActionsSection
        │
        └─> EditStatementModal (Uses Context)
              │
              └─> EditStatementForm (Uses Context)
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Context State                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Local State (React.useState)                                │
│  ├─> selectedStatement: WitnessStatement | null             │
│  ├─> currentIncidentId: string | null                       │
│  └─> formState: Partial<FormData> | null                    │
│                                                               │
│  Server State (TanStack Query)                               │
│  ├─> statements: WitnessStatement[]                         │
│  ├─> isLoading: boolean                                     │
│  └─> error: Error | null                                    │
│                                                               │
│  Derived State (useMemo)                                     │
│  └─> operationLoading: {                                    │
│        create: boolean                                       │
│        update: boolean                                       │
│        delete: boolean                                       │
│        verify: boolean                                       │
│      }                                                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Mutation Flow with Error Handling

```
┌─────────────────────────────────────────────────────────────┐
│                  Mutation Lifecycle                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. onMutate (Before API call)                               │
│     ├─> Cancel outgoing refetches                           │
│     ├─> Snapshot previous data                              │
│     ├─> Apply optimistic update                             │
│     └─> Return context { previousData }                     │
│                                                               │
│  2. mutationFn (API Call)                                    │
│     └─> incidentReportsApi.[operation]()                    │
│                                                               │
│  3a. onSuccess (API Success)                                 │
│      ├─> Invalidate related queries                         │
│      ├─> Update cache with server data                      │
│      ├─> Show success toast                                 │
│      └─> Clear selected/form state                          │
│                                                               │
│  3b. onError (API Failure)                                   │
│      ├─> Rollback to previous data                          │
│      ├─> Restore original state                             │
│      ├─> Show error toast                                   │
│      └─> Log error for debugging                            │
│                                                               │
│  4. onSettled (Always runs)                                  │
│     └─> Cleanup operations                                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Cache Management Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                  TanStack Query Cache                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Query Key Structure:                                        │
│  ['witness-statements', incidentId]                          │
│                                                               │
│  Cache Lifecycle:                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Fresh (0-2 min)  → Stale (2-5 min)  → Garbage       │  │
│  │                                                       │  │
│  │ Serves from cache    Background refetch   Cleared    │  │
│  │ immediately          if queries active    from cache │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  Invalidation Triggers:                                      │
│  ├─> After successful create                                │
│  ├─> After successful update                                │
│  ├─> After successful delete                                │
│  ├─> After successful verify/unverify                       │
│  └─> Manual refetch() call                                  │
│                                                               │
│  Related Query Invalidation:                                 │
│  ├─> ['witness-statements', incidentId]                     │
│  └─> ['incident-reports', incidentId]                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Error Handling Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                  Error Handling Layers                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Layer 1: API Client                                         │
│  ├─> Handles HTTP errors                                    │
│  ├─> Transforms error responses                             │
│  └─> Throws ApiClientError                                  │
│                                                               │
│  Layer 2: Context Mutations                                  │
│  ├─> Catches API errors                                     │
│  ├─> Rolls back optimistic updates                          │
│  ├─> Shows error toast                                      │
│  └─> Logs error for debugging                               │
│                                                               │
│  Layer 3: Component Try-Catch                                │
│  ├─> Optional custom error handling                         │
│  ├─> Component-specific error state                         │
│  └─> User feedback beyond toast                             │
│                                                               │
│  Layer 4: Error Boundary                                     │
│  ├─> Catches React rendering errors                         │
│  ├─> Prevents app crash                                     │
│  └─> Shows fallback UI                                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Type Safety Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    TypeScript Types                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Domain Types (types/incidents.ts)                           │
│  ├─> WitnessStatement                                       │
│  ├─> WitnessType (enum)                                     │
│  ├─> WitnessStatementFormData                               │
│  ├─> CreateWitnessStatementRequest                          │
│  └─> UpdateWitnessStatementRequest                          │
│                                                               │
│  Context Types (WitnessStatementContext.tsx)                 │
│  ├─> WitnessStatementState                                  │
│  ├─> WitnessStatementContextValue                           │
│  └─> WitnessStatementProviderProps                          │
│                                                               │
│  Response Types (types/incidents.ts)                         │
│  ├─> WitnessStatementResponse                               │
│  └─> WitnessStatementListResponse                           │
│                                                               │
│  API Types (services/modules/incidentReportsApi.ts)         │
│  └─> IIncidentReportsApi interface                          │
│                                                               │
│  Flow: Component → Context → API → Backend                  │
│        [Type]      [Type]    [Type]  [Type]                 │
│                                                               │
│  All operations are type-checked at compile time             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Performance Optimizations

```
┌─────────────────────────────────────────────────────────────┐
│              Performance Optimization Strategy               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Memoization                                              │
│     ├─> useMemo for derived state                           │
│     ├─> useCallback for stable function refs                │
│     └─> useMemo for context value                           │
│                                                               │
│  2. Smart Refetching                                         │
│     ├─> No refetch on window focus                          │
│     ├─> Background refetch when stale                       │
│     └─> Refetch on reconnect only                           │
│                                                               │
│  3. Optimistic Updates                                       │
│     ├─> Instant UI updates                                  │
│     ├─> No loading states for mutations                     │
│     └─> Rollback only on error                              │
│                                                               │
│  4. Selective Invalidation                                   │
│     ├─> Only invalidate related queries                     │
│     ├─> Preserve unrelated cache                            │
│     └─> Efficient cache management                          │
│                                                               │
│  5. Request Deduplication                                    │
│     ├─> TanStack Query dedupes identical requests           │
│     ├─> Multiple components share cache                     │
│     └─> No duplicate API calls                              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Security Considerations

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Measures                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Authentication                                              │
│  └─> All API calls use authenticated endpoints              │
│                                                               │
│  Authorization                                               │
│  ├─> Backend enforces role-based access                     │
│  └─> Context uses existing auth system                      │
│                                                               │
│  Data Validation                                             │
│  ├─> TypeScript type checking                               │
│  ├─> Backend validation                                     │
│  └─> Frontend form validation                               │
│                                                               │
│  Audit Logging                                               │
│  ├─> All mutations logged via API                           │
│  ├─> User tracking automatic                                │
│  └─> Timestamp tracking automatic                           │
│                                                               │
│  HIPAA Compliance                                            │
│  ├─> Secure data transmission                               │
│  ├─> Access logging                                         │
│  └─> Data integrity checks                                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Testing Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                   Testing Architecture                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Unit Tests (Vitest)                                         │
│  ├─> Hook usage validation                                  │
│  ├─> CRUD operations                                        │
│  ├─> State management                                       │
│  ├─> Error handling                                         │
│  └─> Optimistic updates                                     │
│                                                               │
│  Integration Tests                                           │
│  ├─> Provider + Hook integration                            │
│  ├─> TanStack Query integration                             │
│  ├─> API service integration                                │
│  └─> Toast notifications                                    │
│                                                               │
│  Component Tests (React Testing Library)                    │
│  ├─> Component rendering                                    │
│  ├─> User interactions                                      │
│  ├─> Loading states                                         │
│  └─> Error states                                           │
│                                                               │
│  E2E Tests (Cypress)                                         │
│  ├─> Full user workflows                                    │
│  ├─> Create → Edit → Delete                                │
│  ├─> Verification workflow                                  │
│  └─> Error scenarios                                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Scalability Considerations

The architecture is designed to scale:

1. **Separation of Concerns**: State management separated from UI
2. **Reusability**: Hook can be used in multiple components
3. **Cache Management**: Efficient caching reduces server load
4. **Optimistic Updates**: Reduces perceived latency
5. **Type Safety**: Prevents runtime errors
6. **Modular Design**: Easy to extend with new features
7. **Performance**: Optimized rendering and data fetching

## Integration Points

```
External Systems
  │
  ├─> Incident Reports Module
  │     └─> Invalidates incident queries on mutations
  │
  ├─> Authentication System
  │     └─> Uses existing auth for API calls
  │
  ├─> Toast Notification System
  │     └─> Shows success/error messages
  │
  ├─> TanStack Query Client
  │     └─> Shared query cache
  │
  └─> Backend API
        └─> REST endpoints for CRUD operations
```

## Summary

This architecture provides:

- **Robust State Management**: TanStack Query + React Context
- **Optimistic UI**: Instant feedback with automatic rollback
- **Type Safety**: Full TypeScript coverage
- **Performance**: Efficient caching and smart refetching
- **Scalability**: Modular and extensible design
- **Security**: HIPAA-compliant with proper auth
- **Testability**: Comprehensive test coverage
- **Maintainability**: Clean separation of concerns
