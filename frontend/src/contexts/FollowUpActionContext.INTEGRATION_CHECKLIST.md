# Follow-Up Action Context - Integration Checklist

A step-by-step guide for integrating the FollowUpActionContext into your application.

## Pre-Integration Checklist

### Dependencies Verification

- [ ] Verify `@tanstack/react-query` is installed (v5.x or higher)
- [ ] Verify `react` is installed (v18.x or higher)
- [ ] Verify `typescript` is configured (v5.x or higher)
- [ ] Confirm `incidentReportsApi` service exists in `@/services`
- [ ] Confirm `AuthContext` is set up and working

```bash
# Check dependencies
npm list @tanstack/react-query react typescript
```

### Type Definitions Verification

- [ ] Verify `ActionStatus` enum exists in `@/types/incidents`
- [ ] Verify `ActionPriority` enum exists in `@/types/incidents`
- [ ] Verify `FollowUpAction` interface exists
- [ ] Verify `CreateFollowUpActionRequest` interface exists
- [ ] Verify `UpdateFollowUpActionRequest` interface exists

### Backend API Verification

- [ ] Confirm backend endpoints are available:
  - `GET /incident-reports/:id/follow-up-actions`
  - `POST /incident-reports/:id/follow-up-actions`
  - `PUT /incident-reports/follow-up-actions/:id`
  - `DELETE /incident-reports/follow-up-actions/:id`

## Integration Steps

### Step 1: Setup Context Provider

#### 1.1 Import Provider

```tsx
// In your main app file or incident details page
import { FollowUpActionProvider } from '@/contexts/FollowUpActionContext';
```

**File to modify**:
- [ ] `src/App.tsx` OR
- [ ] `src/pages/IncidentDetailsPage.tsx`

#### 1.2 Wrap Component Tree

```tsx
<QueryClientProvider client={queryClient}>
  <AuthProvider>
    <FollowUpActionProvider
      initialIncidentId="incident-123"  // Optional: load specific incident
      refreshInterval={60000}           // Optional: auto-refresh every 60s
      autoNotifyOverdue={true}          // Optional: enable overdue alerts
    >
      {/* Your components */}
    </FollowUpActionProvider>
  </AuthProvider>
</QueryClientProvider>
```

**Configuration options**:
- [ ] Decide on `initialIncidentId` (recommended for incident-specific pages)
- [ ] Set `refreshInterval` (30000-60000ms recommended, or omit for no auto-refresh)
- [ ] Enable/disable `autoNotifyOverdue` based on requirements

### Step 2: Create UI Components

#### 2.1 Create Action List Component

**File to create**: `src/components/incidents/FollowUpActionsList.tsx`

```tsx
import { useFollowUpActions } from '@/contexts/FollowUpActionContext';

export function FollowUpActionsList() {
  const { actions, isLoading, error } = useFollowUpActions();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error.message} />;

  return (
    <div className="actions-list">
      {actions.map(action => (
        <ActionItem key={action.id} action={action} />
      ))}
    </div>
  );
}
```

**Tasks**:
- [ ] Create the component file
- [ ] Add loading state UI
- [ ] Add error state UI
- [ ] Add empty state UI (no actions)
- [ ] Style according to design system

#### 2.2 Create Action Item Component

**File to create**: `src/components/incidents/ActionItem.tsx`

```tsx
import { useFollowUpActions } from '@/contexts/FollowUpActionContext';
import { ActionStatus } from '@/types/incidents';

export function ActionItem({ action }: { action: FollowUpAction }) {
  const {
    updateActionStatus,
    completeAction,
    isActionOverdue,
    canEditAction
  } = useFollowUpActions();

  const overdue = isActionOverdue(action);
  const canEdit = canEditAction(action);

  // Implementation...
}
```

**Tasks**:
- [ ] Create the component file
- [ ] Add status badge display
- [ ] Add priority indicator
- [ ] Add due date display
- [ ] Add overdue warning (conditional)
- [ ] Add action buttons (edit, complete, delete)
- [ ] Add permission checks
- [ ] Style according to design system

#### 2.3 Create Action Form Component

**File to create**: `src/components/incidents/CreateActionForm.tsx`

```tsx
import { useFollowUpActions } from '@/contexts/FollowUpActionContext';
import { ActionPriority } from '@/types/incidents';

export function CreateActionForm({ incidentId }: { incidentId: string }) {
  const { createFollowUpAction, isCreating } = useFollowUpActions();

  const handleSubmit = async (data) => {
    await createFollowUpAction({
      incidentReportId: incidentId,
      ...data
    });
  };

  // Implementation...
}
```

**Tasks**:
- [ ] Create the component file
- [ ] Add form fields (action, priority, due date, assignee)
- [ ] Add form validation (client-side)
- [ ] Add submit handler with error handling
- [ ] Add loading state during creation
- [ ] Add success/error notifications
- [ ] Style according to design system

#### 2.4 Create Overdue Alert Component

**File to create**: `src/components/incidents/OverdueAlertBanner.tsx`

```tsx
import { useFollowUpActions } from '@/contexts/FollowUpActionContext';

export function OverdueAlertBanner() {
  const { overdueActions } = useFollowUpActions();

  const criticalActions = overdueActions.filter(a => a.severity === 'critical');
  const warningActions = overdueActions.filter(a => a.severity === 'warning');

  if (overdueActions.length === 0) return null;

  // Implementation...
}
```

**Tasks**:
- [ ] Create the component file
- [ ] Add critical alert section (red)
- [ ] Add warning alert section (yellow)
- [ ] Add dismiss functionality (optional)
- [ ] Link to action items
- [ ] Style according to design system

#### 2.5 Create Statistics Widget

**File to create**: `src/components/incidents/ActionStatistics.tsx`

```tsx
import { useFollowUpActions } from '@/contexts/FollowUpActionContext';

export function ActionStatistics() {
  const { stats } = useFollowUpActions();

  return (
    <div className="stats-grid">
      <StatCard label="Total" value={stats.total} />
      <StatCard label="Pending" value={stats.pending} />
      <StatCard label="In Progress" value={stats.inProgress} />
      <StatCard label="Completed" value={stats.completed} />
      <StatCard label="Overdue" value={stats.overdue} variant="danger" />
    </div>
  );
}
```

**Tasks**:
- [ ] Create the component file
- [ ] Add stat cards for each metric
- [ ] Add visual indicators (colors, icons)
- [ ] Add tooltips with explanations (optional)
- [ ] Style according to design system

### Step 3: Add Filtering & Sorting

#### 3.1 Create Filter Controls

**File to create**: `src/components/incidents/ActionFilters.tsx`

```tsx
import { useFollowUpActions } from '@/contexts/FollowUpActionContext';
import { ActionStatus, ActionPriority } from '@/types/incidents';

export function ActionFilters() {
  const { filters, setFilters, clearFilters } = useFollowUpActions();

  return (
    <div className="filter-controls">
      {/* Status filter */}
      <MultiSelect
        label="Status"
        options={Object.values(ActionStatus)}
        value={filters.status}
        onChange={(status) => setFilters({ status })}
      />

      {/* Priority filter */}
      <MultiSelect
        label="Priority"
        options={Object.values(ActionPriority)}
        value={filters.priority}
        onChange={(priority) => setFilters({ priority })}
      />

      {/* Quick filters */}
      <Checkbox
        label="Assigned to me"
        checked={filters.assignedToMe}
        onChange={(assignedToMe) => setFilters({ assignedToMe })}
      />

      <Checkbox
        label="Overdue only"
        checked={filters.overduedOnly}
        onChange={(overduedOnly) => setFilters({ overduedOnly })}
      />

      <button onClick={clearFilters}>Clear Filters</button>
    </div>
  );
}
```

**Tasks**:
- [ ] Create the component file
- [ ] Add status multi-select
- [ ] Add priority multi-select
- [ ] Add "assigned to me" checkbox
- [ ] Add "overdue only" checkbox
- [ ] Add clear filters button
- [ ] Style according to design system

#### 3.2 Create Sort Controls

**File to create**: `src/components/incidents/ActionSortControls.tsx`

```tsx
import { useFollowUpActions } from '@/contexts/FollowUpActionContext';

export function ActionSortControls() {
  const { sortBy, sortOrder, setSortBy, setSortOrder } = useFollowUpActions();

  return (
    <div className="sort-controls">
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="dueDate">Due Date</option>
        <option value="priority">Priority</option>
        <option value="createdAt">Created Date</option>
      </select>

      <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
        {sortOrder === 'asc' ? '↑' : '↓'}
      </button>
    </div>
  );
}
```

**Tasks**:
- [ ] Create the component file
- [ ] Add sort field dropdown
- [ ] Add sort order toggle button
- [ ] Add visual indicators for current sort
- [ ] Style according to design system

### Step 4: Integrate into Incident Details Page

#### 4.1 Update Page Component

**File to modify**: `src/pages/IncidentDetailsPage.tsx`

```tsx
import { FollowUpActionProvider } from '@/contexts/FollowUpActionContext';
import { FollowUpActionsList } from '@/components/incidents/FollowUpActionsList';
import { CreateActionForm } from '@/components/incidents/CreateActionForm';
import { OverdueAlertBanner } from '@/components/incidents/OverdueAlertBanner';
import { ActionStatistics } from '@/components/incidents/ActionStatistics';
import { ActionFilters } from '@/components/incidents/ActionFilters';
import { ActionSortControls } from '@/components/incidents/ActionSortControls';

export function IncidentDetailsPage() {
  const { incidentId } = useParams();

  return (
    <FollowUpActionProvider initialIncidentId={incidentId}>
      <div className="incident-details">
        {/* Existing incident details */}

        {/* New follow-up actions section */}
        <section className="follow-up-section">
          <h2>Follow-Up Actions</h2>

          <OverdueAlertBanner />

          <ActionStatistics />

          <div className="actions-controls">
            <ActionFilters />
            <ActionSortControls />
          </div>

          <FollowUpActionsList />

          <CreateActionForm incidentId={incidentId} />
        </section>
      </div>
    </FollowUpActionProvider>
  );
}
```

**Tasks**:
- [ ] Import all required components
- [ ] Add provider wrapper
- [ ] Add overdue alert banner
- [ ] Add statistics widget
- [ ] Add filter controls
- [ ] Add sort controls
- [ ] Add actions list
- [ ] Add create form
- [ ] Test complete integration

### Step 5: Add Error Handling

#### 5.1 Create Error Boundary

**File to create**: `src/components/ErrorBoundary.tsx`

```tsx
import React from 'react';

export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Follow-Up Action Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

**Tasks**:
- [ ] Create error boundary component
- [ ] Add error logging
- [ ] Create fallback UI
- [ ] Wrap provider with error boundary

#### 5.2 Add Toast Notifications

**File to create/modify**: Configure toast notification system

```tsx
import { toast } from 'react-toastify'; // or your toast library

// In your action handlers
try {
  await createFollowUpAction(data);
  toast.success('Action created successfully!');
} catch (error) {
  toast.error(`Failed to create action: ${error.message}`);
}
```

**Tasks**:
- [ ] Install/configure toast library
- [ ] Add success notifications
- [ ] Add error notifications
- [ ] Add warning notifications for permissions

### Step 6: Add Loading States

#### 6.1 Create Loading Components

**Files to create**:
- [ ] `src/components/LoadingSpinner.tsx`
- [ ] `src/components/SkeletonLoader.tsx`

**Tasks**:
- [ ] Create spinner component
- [ ] Create skeleton loaders for list items
- [ ] Add loading states to all async operations
- [ ] Test loading states

### Step 7: Testing

#### 7.1 Unit Tests

**Tasks**:
- [ ] Run existing context tests: `npm test FollowUpActionContext.test.tsx`
- [ ] Verify all tests pass
- [ ] Add component-specific tests
- [ ] Test error scenarios

#### 7.2 Integration Tests

**File to create**: `src/components/incidents/__tests__/FollowUpActions.integration.test.tsx`

```tsx
describe('Follow-Up Actions Integration', () => {
  it('should create and complete an action', async () => {
    // Test implementation
  });

  it('should filter actions by status', async () => {
    // Test implementation
  });

  it('should show overdue alerts', async () => {
    // Test implementation
  });
});
```

**Tasks**:
- [ ] Create integration test file
- [ ] Test complete user workflows
- [ ] Test permission scenarios
- [ ] Test error handling
- [ ] Test optimistic updates

#### 7.3 Manual Testing

**Test Scenarios**:
- [ ] Create a new follow-up action
- [ ] Update action status (pending → in progress → completed)
- [ ] Assign action to another user
- [ ] Filter actions by status
- [ ] Filter actions by priority
- [ ] Sort actions by due date
- [ ] Sort actions by priority
- [ ] Delete an action
- [ ] Cancel an action with reason
- [ ] Verify overdue detection
- [ ] Test with network errors
- [ ] Test with permission errors
- [ ] Test optimistic update rollback

### Step 8: Performance Optimization

#### 8.1 Lazy Loading

**Tasks**:
- [ ] Add React.lazy for heavy components
- [ ] Add Suspense boundaries
- [ ] Test loading behavior

```tsx
const CreateActionForm = React.lazy(() =>
  import('@/components/incidents/CreateActionForm')
);

<Suspense fallback={<LoadingSpinner />}>
  <CreateActionForm incidentId={incidentId} />
</Suspense>
```

#### 8.2 Query Configuration

**Tasks**:
- [ ] Review and adjust `refreshInterval` (if too frequent, increase)
- [ ] Review and adjust `staleTime` (default: 30s)
- [ ] Enable/disable `refetchOnWindowFocus` as needed

### Step 9: Documentation

#### 9.1 Component Documentation

**Tasks**:
- [ ] Add JSDoc comments to all components
- [ ] Document prop types
- [ ] Add usage examples in comments
- [ ] Create component README if needed

#### 9.2 User Documentation

**Tasks**:
- [ ] Create user guide for follow-up actions
- [ ] Document workflow for nurses
- [ ] Document workflow for administrators
- [ ] Add screenshots/videos (optional)

### Step 10: Production Readiness

#### 10.1 Security Review

**Tasks**:
- [ ] Verify permission checks are in place
- [ ] Test with different user roles
- [ ] Verify HIPAA compliance for data handling
- [ ] Review audit logging requirements
- [ ] Test with malicious inputs

#### 10.2 Accessibility Review

**Tasks**:
- [ ] Test with keyboard navigation
- [ ] Test with screen readers
- [ ] Verify ARIA labels are present
- [ ] Check color contrast ratios
- [ ] Test with browser zoom

#### 10.3 Browser Compatibility

**Tasks**:
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] Test on mobile devices

#### 10.4 Performance Audit

**Tasks**:
- [ ] Run Lighthouse audit
- [ ] Check bundle size impact
- [ ] Test with large datasets (100+ actions)
- [ ] Monitor memory usage
- [ ] Check for memory leaks

### Step 11: Deployment

#### 11.1 Staging Deployment

**Tasks**:
- [ ] Deploy to staging environment
- [ ] Run smoke tests
- [ ] Verify API connectivity
- [ ] Test with real data (anonymized)
- [ ] Get QA approval

#### 11.2 Production Deployment

**Tasks**:
- [ ] Create deployment checklist
- [ ] Schedule deployment window
- [ ] Deploy to production
- [ ] Monitor error logs
- [ ] Verify functionality
- [ ] Get stakeholder approval

#### 11.3 Post-Deployment

**Tasks**:
- [ ] Monitor performance metrics
- [ ] Monitor error rates
- [ ] Collect user feedback
- [ ] Address any issues
- [ ] Document lessons learned

## Troubleshooting Common Issues

### Issue: Context not found

**Symptom**: Error "useFollowUpActions must be used within a FollowUpActionProvider"

**Solution**:
- [ ] Verify provider is wrapping all components that use the hook
- [ ] Check component hierarchy
- [ ] Verify imports are correct

### Issue: Actions not loading

**Symptom**: Empty list despite having actions in database

**Solution**:
- [ ] Check `loadFollowUpActions()` is being called
- [ ] Verify `incidentId` is correct
- [ ] Check network tab for API errors
- [ ] Verify backend endpoint is responding

### Issue: Permission errors

**Symptom**: "Insufficient permissions" when assigning actions

**Solution**:
- [ ] Check user role in AuthContext
- [ ] Verify `canAssignAction()` before calling `assignAction()`
- [ ] Check backend permissions
- [ ] Review role requirements

### Issue: Optimistic updates not working

**Symptom**: UI doesn't update immediately on action

**Solution**:
- [ ] Check browser console for errors
- [ ] Verify mutation is configured correctly
- [ ] Check query cache invalidation
- [ ] Review TanStack Query DevTools

## Final Checklist

Before marking integration as complete:

- [ ] All components created and tested
- [ ] All unit tests passing
- [ ] Integration tests passing
- [ ] Manual testing complete
- [ ] Documentation updated
- [ ] Performance optimized
- [ ] Security reviewed
- [ ] Accessibility verified
- [ ] Browser compatibility confirmed
- [ ] Deployed to staging
- [ ] QA approved
- [ ] Deployed to production
- [ ] Post-deployment monitoring active
- [ ] User training complete (if required)
- [ ] Stakeholders notified

## Support & Resources

- **Documentation**: `FollowUpActionContext.README.md`
- **Examples**: `FollowUpActionContext.example.tsx`
- **Architecture**: `FollowUpActionContext.ARCHITECTURE.md`
- **Type Definitions**: `FollowUpActionContext.d.ts`
- **Tests**: `FollowUpActionContext.test.tsx`

## Notes Section

Use this space to track integration-specific notes, decisions, or customizations:

```
Integration Date: _______________
Integration Team: _______________
Custom Configuration: _______________
Known Issues: _______________
Future Enhancements: _______________
```

---

**Checklist Version**: 1.0.0
**Last Updated**: January 2025
**Status**: Ready for Use ✅
