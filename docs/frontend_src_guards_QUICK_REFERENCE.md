# Navigation Guards - Quick Reference Card

## Import

```tsx
import {
  withAuthGuard,
  withRoleGuard,
  withPermissionGuard,
  withDataGuard,
  withFeatureGuard,
  composeGuards,
  checkPermission,
  useUnsavedChanges,
  UnsavedChangesPrompt
} from '@/guards/navigationGuards';
```

## Common Patterns

### 1. Auth Only
```tsx
export default withAuthGuard(MyComponent);
```

### 2. Auth + Role
```tsx
export default composeGuards([
  withAuthGuard,
  withRoleGuard(['ADMIN', 'NURSE'])
])(MyComponent);
```

### 3. Auth + Role + Permission
```tsx
export default composeGuards([
  withAuthGuard,
  withRoleGuard(['NURSE']),
  withPermissionGuard([{ resource: 'students', action: 'update' }])
])(MyComponent);
```

### 4. With Data Loading
```tsx
export default composeGuards([
  withAuthGuard,
  withDataGuard(async (ctx) => {
    const id = ctx.location.pathname.split('/').pop();
    const data = await api.getById(id);
    return { data };
  })
])(({ guardData }) => <div>{guardData.data.name}</div>);
```

### 5. Form with Unsaved Changes
```tsx
function MyForm() {
  const [dirty, setDirty] = useState(false);
  const { setHasUnsavedChanges, showPrompt, confirmNavigation, cancelNavigation } = useUnsavedChanges();

  useEffect(() => setHasUnsavedChanges(dirty), [dirty]);

  return (
    <>
      <form>...</form>
      <UnsavedChangesPrompt
        isOpen={showPrompt}
        onDiscard={confirmNavigation}
        onCancel={cancelNavigation}
      />
    </>
  );
}
```

### 6. Conditional UI by Permission
```tsx
function Actions() {
  const { user } = useAuthContext();
  const canEdit = checkPermission(user, { resource: 'students', action: 'update' });

  return canEdit ? <button>Edit</button> : null;
}
```

## Permission Format

```tsx
{
  resource: 'students' | 'medications' | 'health_records' | 'incident_reports' | 'system',
  action: 'read' | 'create' | 'update' | 'delete' | 'manage' | 'configure'
}
```

## Roles

- `ADMIN` - Full access
- `DISTRICT_ADMIN` - Full access
- `SCHOOL_ADMIN` - School-level access
- `NURSE` - Healthcare provider access
- `COUNSELOR` - Limited health access
- `READ_ONLY` - View only

## Guard Order (Important!)

Always compose guards in this order:
1. `withAuthGuard` (first!)
2. `withRoleGuard`
3. `withPermissionGuard`
4. `withFeatureGuard`
5. `withDataGuard` (last!)

## Common Mistakes

❌ **Wrong order**
```tsx
composeGuards([withRoleGuard([...]), withAuthGuard])(C);
```

✅ **Correct order**
```tsx
composeGuards([withAuthGuard, withRoleGuard([...])])(C);
```

❌ **Inline composition**
```tsx
<Route element={composeGuards([...])(C)} />
```

✅ **Module-level composition**
```tsx
const Protected = composeGuards([...])(C);
<Route element={<Protected />} />
```

## Permission Matrix (Quick)

| Resource | ADMIN | NURSE | COUNSELOR | READ_ONLY |
|----------|-------|-------|-----------|-----------|
| students.* | ✅ | ✅ | read only | read only |
| medications.* | ✅ | ✅ | ❌ | read only |
| health_records.* | ✅ | ✅ | read only | read only |
| incident_reports.* | ✅ | ✅ | read+create | read only |
| system.* | ✅ | ❌ | ❌ | ❌ |

## Useful Functions

```tsx
// Check single permission
checkPermission(user, { resource: 'students', action: 'read' })

// Check any permission (OR)
checkAnyPermission(user, [perm1, perm2])

// Check all permissions (AND)
checkAllPermissions(user, [perm1, perm2])

// Check if role has permission
checkRolePermission('NURSE', { resource: 'medications', action: 'create' })

// Check route access
hasAccessToRoute(user, { roles: ['ADMIN'], permissions: [...] })
```

## Data Loader Context

```tsx
withDataGuard(async (context) => {
  // context.user - Current user
  // context.location - Route location
  // context.navigate - Navigation function
  // context.params - Route params (if available)

  const data = await loadData();
  return { data }; // Passed as guardData prop
})
```

## Testing

```tsx
import { render, screen } from '@testing-library/react';
import { withAuthGuard } from '@/guards/navigationGuards';

// Mock auth context
vi.mock('@/contexts/AuthContext', () => ({
  useAuthContext: () => ({ user: mockUser, loading: false })
}));

test('renders when authenticated', () => {
  const Protected = withAuthGuard(TestComponent);
  render(<Protected />);
  expect(screen.getByText('Test Component')).toBeInTheDocument();
});
```

## Files

- `navigationGuards.tsx` - Main implementation
- `index.ts` - Exports
- `README.md` - Full documentation
- `SUMMARY.md` - Implementation summary
- `navigationGuards.examples.tsx` - 17 examples
- `integration.example.tsx` - Integration guide
- `navigationGuards.test.tsx` - Tests
- `QUICK_REFERENCE.md` - This file

## Help

Need help? Check:
1. README.md for detailed docs
2. examples files for patterns
3. test file for usage
4. integration.example.tsx for migration
