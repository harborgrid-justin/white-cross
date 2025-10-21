# Follow-Up Action Context - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         React Application Layer                              │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    UI Components Layer                               │   │
│  │                                                                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │   │
│  │  │ Action List  │  │ Action Form  │  │ Overdue      │             │   │
│  │  │ Component    │  │ Component    │  │ Alert Banner │             │   │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘             │   │
│  │         │                  │                  │                      │   │
│  │         └──────────────────┼──────────────────┘                      │   │
│  │                            │                                         │   │
│  └────────────────────────────┼─────────────────────────────────────────┘   │
│                               │                                              │
│                               ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    useFollowUpActions Hook                           │   │
│  │                                                                       │   │
│  │  Returns: { actions, stats, methods, filters, ... }                 │   │
│  └────────────────────────────┬─────────────────────────────────────────┘   │
│                               │                                              │
│                               ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │              FollowUpActionContext (React Context)                   │   │
│  │                                                                       │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │                      State Management                        │   │   │
│  │  │                                                               │   │   │
│  │  │  • actions: FollowUpAction[]                                │   │   │
│  │  │  • selectedAction: FollowUpAction | null                    │   │   │
│  │  │  • filters: ActionFilters                                   │   │   │
│  │  │  • sortBy: 'dueDate' | 'priority' | 'createdAt'            │   │   │
│  │  │  • sortOrder: 'asc' | 'desc'                               │   │   │
│  │  │                                                               │   │   │
│  │  └───────────────────────┬───────────────────────────────────────┘   │   │
│  │                          │                                           │   │
│  │  ┌───────────────────────▼───────────────────────────────────────┐   │   │
│  │  │              Computed State (useMemo)                         │   │   │
│  │  │                                                               │   │   │
│  │  │  • filteredAndSortedActions                                  │   │   │
│  │  │  • overdueActions: OverdueAlert[]                           │   │   │
│  │  │  • stats: { total, pending, inProgress, ... }              │   │   │
│  │  │                                                               │   │   │
│  │  └───────────────────────┬───────────────────────────────────────┘   │   │
│  │                          │                                           │   │
│  │  ┌───────────────────────▼───────────────────────────────────────┐   │   │
│  │  │                  Context Methods                              │   │   │
│  │  │                                                               │   │   │
│  │  │  Data Loading:                                               │   │   │
│  │  │    • loadFollowUpActions()                                   │   │   │
│  │  │    • refreshActions()                                        │   │   │
│  │  │                                                               │   │   │
│  │  │  CRUD Operations:                                            │   │   │
│  │  │    • createFollowUpAction()                                  │   │   │
│  │  │    • updateFollowUpAction()                                  │   │   │
│  │  │    • deleteFollowUpAction()                                  │   │   │
│  │  │                                                               │   │   │
│  │  │  Status Management:                                          │   │   │
│  │  │    • updateActionStatus()                                    │   │   │
│  │  │    • completeAction()                                        │   │   │
│  │  │    • cancelAction()                                          │   │   │
│  │  │                                                               │   │   │
│  │  │  Assignment:                                                 │   │   │
│  │  │    • assignAction()                                          │   │   │
│  │  │    • unassignAction()                                        │   │   │
│  │  │                                                               │   │   │
│  │  │  Utilities:                                                  │   │   │
│  │  │    • getOverdueActions()                                     │   │   │
│  │  │    • canAssignAction()                                       │   │   │
│  │  │    • canEditAction()                                         │   │   │
│  │  │                                                               │   │   │
│  │  └───────────────────────┬───────────────────────────────────────┘   │   │
│  │                          │                                           │   │
│  └──────────────────────────┼───────────────────────────────────────────┘   │
│                             │                                              │
└─────────────────────────────┼──────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TanStack Query Layer                                   │
│                                                                               │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │                       Query Client                                  │     │
│  │                                                                      │     │
│  │  ┌────────────────────┐  ┌────────────────────┐                   │     │
│  │  │  Query Cache       │  │  Mutation Cache    │                   │     │
│  │  │                    │  │                    │                   │     │
│  │  │  • followUpActions │  │  • createMutation  │                   │     │
│  │  │  • staleTime: 30s  │  │  • updateMutation  │                   │     │
│  │  │  • refetchInterval │  │  • deleteMutation  │                   │     │
│  │  │                    │  │                    │                   │     │
│  │  └────────────────────┘  └────────────────────┘                   │     │
│  │                                                                      │     │
│  └──────────────────────────┬───────────────────────────────────────────┘     │
│                             │                                              │
└─────────────────────────────┼──────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          API Service Layer                                   │
│                                                                               │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │                    incidentReportsApi                               │     │
│  │                                                                      │     │
│  │  • getFollowUpActions(incidentId)                                  │     │
│  │  • addFollowUpAction(data)                                         │     │
│  │  • updateFollowUpAction(id, data)                                  │     │
│  │  • deleteFollowUpAction(id)                                        │     │
│  │                                                                      │     │
│  └──────────────────────────┬───────────────────────────────────────────┘     │
│                             │                                              │
└─────────────────────────────┼──────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Backend API Server                                   │
│                                                                               │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │                    REST API Endpoints                               │     │
│  │                                                                      │     │
│  │  GET    /incident-reports/:id/follow-up-actions                    │     │
│  │  POST   /incident-reports/:id/follow-up-actions                    │     │
│  │  PUT    /incident-reports/follow-up-actions/:id                    │     │
│  │  DELETE /incident-reports/follow-up-actions/:id                    │     │
│  │                                                                      │     │
│  └──────────────────────────┬───────────────────────────────────────────┘     │
│                             │                                              │
└─────────────────────────────┼──────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Database Layer                                      │
│                                                                               │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │                    PostgreSQL Database                              │     │
│  │                                                                      │     │
│  │  Tables:                                                            │     │
│  │    • incident_reports                                              │     │
│  │    • follow_up_actions                                             │     │
│  │    • users                                                          │     │
│  │                                                                      │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Loading Actions Flow

```
User Component
    │
    │ useFollowUpActions()
    ▼
Context Hook
    │
    │ loadFollowUpActions(incidentId)
    ▼
TanStack Query
    │
    │ queryFn: getFollowUpActions()
    ▼
API Service
    │
    │ GET /incident-reports/:id/follow-up-actions
    ▼
Backend API
    │
    │ Fetch from database
    ▼
Database
    │
    │ Return actions
    ▼
Backend API
    │
    │ FollowUpActionListResponse
    ▼
API Service
    │
    │ Extract data
    ▼
TanStack Query
    │
    │ Cache result (staleTime: 30s)
    │ Update query state
    ▼
Context Hook
    │
    │ Compute filtered/sorted actions
    │ Calculate statistics
    │ Detect overdue actions
    ▼
User Component
    │
    │ Re-render with new data
    ▼
UI Update
```

### 2. Create Action Flow (with Optimistic Update)

```
User Action (Form Submit)
    │
    │ createFollowUpAction(data)
    ▼
Context Method
    │
    │ createMutation.mutateAsync()
    ▼
TanStack Mutation
    │
    │ mutationFn: addFollowUpAction()
    ▼
API Service
    │
    │ POST /incident-reports/:id/follow-up-actions
    ▼
Backend API
    │
    │ Validate & create in database
    ▼
Database
    │
    │ Insert new action
    │ Return created action
    ▼
Backend API
    │
    │ FollowUpActionResponse
    ▼
API Service
    │
    │ Extract data
    ▼
TanStack Mutation
    │
    │ onSuccess:
    │   - Invalidate query cache
    │   - Trigger refetch
    ▼
TanStack Query
    │
    │ Refetch actions automatically
    ▼
Context Hook
    │
    │ Updated actions list
    ▼
User Component
    │
    │ Re-render with new action
    ▼
UI Update
```

### 3. Update Action Flow (with Optimistic UI)

```
User Action (Status Change)
    │
    │ updateActionStatus(id, status)
    ▼
Context Method
    │
    │ updateMutation.mutateAsync()
    ▼
TanStack Mutation
    │
    │ onMutate:
    │   1. Cancel outgoing queries
    │   2. Snapshot current data
    │   3. Optimistically update cache
    ▼
UI Update (Immediate)
    │
    │ User sees change instantly
    ▼
TanStack Mutation (continued)
    │
    │ mutationFn: updateFollowUpAction()
    ▼
API Service
    │
    │ PUT /incident-reports/follow-up-actions/:id
    ▼
Backend API
    │
    │ Validate & update in database
    ▼
Database
    │
    │ Update action
    │ Return updated action
    ▼
Backend API
    │
    │ FollowUpActionResponse
    ▼
API Service
    │
    │ Extract data
    ▼
TanStack Mutation
    │
    │ onSuccess:
    │   - Invalidate query
    │   - Actual data matches optimistic update
    │
    │ OR onError:
    │   - Rollback to snapshot
    │   - Show error message
    ▼
Context Hook
    │
    │ Final state (confirmed or rolled back)
    ▼
User Component
    │
    │ Re-render if needed
    ▼
UI Update (Final)
```

### 4. Filter & Sort Flow (Client-Side)

```
User Action (Apply Filter)
    │
    │ setFilters({ status: [PENDING] })
    ▼
Context Method
    │
    │ Update filters state
    ▼
React State Update
    │
    │ Trigger re-computation
    ▼
useMemo (filteredAndSortedActions)
    │
    │ 1. Apply status filter
    │ 2. Apply priority filter
    │ 3. Apply assignedToMe filter
    │ 4. Apply overduedOnly filter
    │ 5. Apply sorting
    ▼
Context Hook
    │
    │ Return filtered actions
    ▼
User Component
    │
    │ Re-render with filtered list
    ▼
UI Update (Instant)
```

## Component Integration Pattern

```
┌────────────────────────────────────────────────────────────┐
│                      App Root                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           QueryClientProvider                        │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │        AuthProvider                            │  │  │
│  │  │  ┌──────────────────────────────────────────┐  │  │  │
│  │  │  │   FollowUpActionProvider                 │  │  │  │
│  │  │  │                                           │  │  │  │
│  │  │  │  initialIncidentId="incident-123"       │  │  │  │
│  │  │  │  refreshInterval={60000}                 │  │  │  │
│  │  │  │  autoNotifyOverdue={true}                │  │  │  │
│  │  │  │                                           │  │  │  │
│  │  │  │  ┌─────────────────────────────────┐    │  │  │  │
│  │  │  │  │   IncidentDetailsPage           │    │  │  │  │
│  │  │  │  │                                  │    │  │  │  │
│  │  │  │  │  ┌────────────────────────────┐ │    │  │  │  │
│  │  │  │  │  │  OverdueAlertBanner        │ │    │  │  │  │
│  │  │  │  │  │  useFollowUpActions()      │ │    │  │  │  │
│  │  │  │  │  └────────────────────────────┘ │    │  │  │  │
│  │  │  │  │                                  │    │  │  │  │
│  │  │  │  │  ┌────────────────────────────┐ │    │  │  │  │
│  │  │  │  │  │  ActionStatistics          │ │    │  │  │  │
│  │  │  │  │  │  useFollowUpActions()      │ │    │  │  │  │
│  │  │  │  │  └────────────────────────────┘ │    │  │  │  │
│  │  │  │  │                                  │    │  │  │  │
│  │  │  │  │  ┌────────────────────────────┐ │    │  │  │  │
│  │  │  │  │  │  FollowUpActionsList       │ │    │  │  │  │
│  │  │  │  │  │  useFollowUpActions()      │ │    │  │  │  │
│  │  │  │  │  │                             │ │    │  │  │  │
│  │  │  │  │  │  ┌──────────────────────┐  │ │    │  │  │  │
│  │  │  │  │  │  │ ActionItem (x N)     │  │ │    │  │  │  │
│  │  │  │  │  │  │ useFollowUpActions() │  │ │    │  │  │  │
│  │  │  │  │  │  └──────────────────────┘  │ │    │  │  │  │
│  │  │  │  │  └────────────────────────────┘ │    │  │  │  │
│  │  │  │  │                                  │    │  │  │  │
│  │  │  │  │  ┌────────────────────────────┐ │    │  │  │  │
│  │  │  │  │  │  CreateActionForm          │ │    │  │  │  │
│  │  │  │  │  │  useFollowUpActions()      │ │    │  │  │  │
│  │  │  │  │  └────────────────────────────┘ │    │  │  │  │
│  │  │  │  │                                  │    │  │  │  │
│  │  │  │  └─────────────────────────────────┘    │  │  │  │
│  │  │  │                                           │  │  │  │
│  │  │  └──────────────────────────────────────────┘  │  │  │
│  │  │                                                 │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## State Flow & Dependencies

```
┌─────────────────────────────────────────────────────────────┐
│                    External Dependencies                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  AuthContext ────────────────┐                              │
│    │                          │                              │
│    ├─ user                    │ Permission checks           │
│    └─ user.role               │                              │
│                               │                              │
│  incidentReportsApi ──────────┤                              │
│    │                          │                              │
│    ├─ getFollowUpActions()    │ API operations              │
│    ├─ addFollowUpAction()     │                              │
│    ├─ updateFollowUpAction()  │                              │
│    └─ deleteFollowUpAction()  │                              │
│                               │                              │
│  TanStack Query ──────────────┤                              │
│    │                          │                              │
│    ├─ useQuery()              │ Data fetching               │
│    ├─ useMutation()           │                              │
│    └─ queryClient            │                              │
│                               │                              │
└───────────────────────────────┼──────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│              FollowUpActionContext State                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Local State (useState):                                     │
│    ├─ selectedAction                                         │
│    ├─ filters                                                │
│    ├─ sortBy                                                 │
│    ├─ sortOrder                                              │
│    └─ currentIncidentId                                      │
│                                                               │
│  Query State (useQuery):                                     │
│    ├─ actionsData                                            │
│    ├─ isLoading                                              │
│    ├─ error                                                  │
│    └─ refetch()                                              │
│                                                               │
│  Mutation State (useMutation):                               │
│    ├─ createMutation                                         │
│    ├─ updateMutation                                         │
│    └─ deleteMutation                                         │
│                                                               │
│  Computed State (useMemo):                                   │
│    ├─ filteredAndSortedActions                              │
│    ├─ overdueActions                                         │
│    └─ stats                                                  │
│                                                               │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Context Value                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Exposed to Consumers:                                       │
│    ├─ State (read-only)                                      │
│    └─ Methods (actions)                                      │
│                                                               │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                 Consumer Components                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  useFollowUpActions() ──────────────────────────────────────┤
│    │                                                          │
│    ├─ Read state (actions, stats, loading, error)           │
│    └─ Call methods (create, update, delete, filter, sort)   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Permission & Access Control Flow

```
                    User Action Request
                            │
                            ▼
            ┌───────────────────────────────┐
            │   Context Method Called       │
            │   (e.g., assignAction)        │
            └───────────────┬───────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │   Check User Authentication   │
            │   (from AuthContext)          │
            └───────────────┬───────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
            ▼ No                            ▼ Yes
    ┌──────────────┐            ┌──────────────────┐
    │ Throw Error  │            │  Check Role      │
    │ "Not Auth'd" │            │  Permission      │
    └──────────────┘            └────────┬─────────┘
                                         │
                        ┌────────────────┴────────────────┐
                        │                                  │
                        ▼                                  ▼
            ┌────────────────────┐           ┌────────────────────┐
            │ Admin/District     │           │ Nurse/School       │
            │ Admin              │           │ Admin              │
            └──────┬─────────────┘           └──────┬─────────────┘
                   │                                 │
                   ▼ Full Access                     ▼ Limited
        ┌────────────────────┐           ┌────────────────────────┐
        │ Can Assign/Edit    │           │ Can Assign/Edit        │
        │ Any Action         │           │ Assigned Actions       │
        └──────┬─────────────┘           └──────┬─────────────────┘
               │                                 │
               └─────────────┬───────────────────┘
                             │
                             ▼
            ┌─────────────────────────────────┐
            │   canAssignAction(action)       │
            │   canEditAction(action)         │
            └────────────────┬────────────────┘
                             │
            ┌────────────────┴─────────────────┐
            │                                   │
            ▼ true                              ▼ false
    ┌──────────────────┐            ┌──────────────────┐
    │ Proceed with     │            │ Throw Error      │
    │ Operation        │            │ "Insufficient    │
    │                  │            │  Permissions"    │
    └────────┬─────────┘            └──────────────────┘
             │
             ▼
    ┌──────────────────┐
    │ API Call         │
    │ Backend          │
    │ Validation       │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ Success/Error    │
    │ Response         │
    └──────────────────┘
```

## Performance Optimization Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                  Performance Optimizations                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Memoization Layer                                        │
│     ┌──────────────────────────────────────────────┐       │
│     │ useMemo                                       │       │
│     │  ├─ filteredAndSortedActions                │       │
│     │  ├─ overdueActions                          │       │
│     │  └─ stats                                    │       │
│     │                                               │       │
│     │ Dependencies: [actions, filters, sortBy]    │       │
│     │ Recalculates only when dependencies change  │       │
│     └──────────────────────────────────────────────┘       │
│                                                               │
│  2. Query Caching (TanStack Query)                          │
│     ┌──────────────────────────────────────────────┐       │
│     │ Query Cache                                   │       │
│     │  ├─ staleTime: 30000ms                       │       │
│     │  ├─ cacheTime: 5 minutes                     │       │
│     │  └─ refetchOnWindowFocus: true               │       │
│     │                                               │       │
│     │ Benefits:                                     │       │
│     │  • Reduced API calls                         │       │
│     │  • Faster navigation                         │       │
│     │  • Background updates                        │       │
│     └──────────────────────────────────────────────┘       │
│                                                               │
│  3. Optimistic Updates                                       │
│     ┌──────────────────────────────────────────────┐       │
│     │ Mutation Strategy                             │       │
│     │  ├─ onMutate: Update cache immediately       │       │
│     │  ├─ onError: Rollback to snapshot            │       │
│     │  └─ onSuccess: Invalidate & refetch          │       │
│     │                                               │       │
│     │ Benefits:                                     │       │
│     │  • Instant UI feedback                       │       │
│     │  • No loading spinners for updates           │       │
│     │  • Automatic error recovery                  │       │
│     └──────────────────────────────────────────────┘       │
│                                                               │
│  4. Selective Re-rendering                                   │
│     ┌──────────────────────────────────────────────┐       │
│     │ Context Structure                             │       │
│     │  • Single context object                     │       │
│     │  • Memoized methods (useCallback)            │       │
│     │  • Computed values cached                    │       │
│     │                                               │       │
│     │ Components only re-render when:              │       │
│     │  • Used state actually changes               │       │
│     │  • Not when unrelated state updates          │       │
│     └──────────────────────────────────────────────┘       │
│                                                               │
│  5. Lazy Computation                                         │
│     ┌──────────────────────────────────────────────┐       │
│     │ Utility Methods                               │       │
│     │  • getOverdueActions()                       │       │
│     │  • getActionsByStatus()                      │       │
│     │  • getActionsByPriority()                    │       │
│     │                                               │       │
│     │ Computed on demand, not proactively          │       │
│     └──────────────────────────────────────────────┘       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

**Document Version**: 1.0.0
**Last Updated**: January 2025
**Architecture Status**: Production Ready ✅
