# Navigation System Documentation

## Overview

The White Cross Healthcare Platform implements an enterprise-grade navigation system with comprehensive permission checking, role-based access control, state restoration, and accessibility features.

## Architecture

### Core Components

1. **Layout.tsx** - Main application layout with sidebar and top navigation
2. **Breadcrumbs.tsx** - Hierarchical breadcrumb navigation
3. **BackButton.tsx** - Navigation button with state restoration

### Supporting Modules

1. **navigationUtils.ts** - Permission checking and filtering utilities
2. **routeUtils.ts** - Route metadata and breadcrumb generation
3. **navigationGuards.tsx** - HOCs and guards for route protection
4. **useRouteState.ts** - Hooks for navigation state management

## Key Features

### 1. Permission-Based Navigation Filtering

Navigation items are automatically filtered based on:
- User roles (`ADMIN`, `NURSE`, `SCHOOL_ADMIN`, `DISTRICT_ADMIN`, `READ_ONLY`, `COUNSELOR`)
- Specific permissions (e.g., `students.read`, `medications.create`)
- Feature flags

```tsx
// Example navigation item with permissions
{
  id: 'students',
  name: 'Students',
  path: '/students',
  icon: 'Users',
  roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN'],
  permissions: [{ resource: 'students', action: 'read' }],
}
```

### 2. Visual Indicators

#### Active Route Highlighting
- Active navigation items are highlighted with primary colors
- Parent items show active state when children are active

#### User Role Badge
- Color-coded role badges in top navigation:
  - **ADMIN**: Purple
  - **NURSE**: Blue
  - **SCHOOL_ADMIN**: Green
  - **DISTRICT_ADMIN**: Indigo
  - **COUNSELOR**: Yellow
  - **READ_ONLY**: Gray

#### Disabled Item Tooltips
- Items without access show:
  - Reduced opacity (50%)
  - Cursor not-allowed
  - Tooltip explaining why access is denied
  - Reasons: role, permission, feature, or disabled

### 3. Breadcrumb Navigation

Automatic breadcrumb generation from route metadata:

```tsx
<Breadcrumbs />
```

Features:
- Auto-generated from route hierarchy
- Clickable navigation trail
- Home icon for root
- Truncation for long paths
- Mobile responsive
- Accessible keyboard navigation

Custom breadcrumbs:
```tsx
<Breadcrumbs
  items={[
    { label: 'Home', path: '/', isActive: false },
    { label: 'Students', path: '/students', isActive: false },
    { label: 'John Doe', isActive: true },
  ]}
/>
```

### 4. Back Button with State Restoration

Intelligent back navigation with:
- Previous route state restoration
- Scroll position recovery
- Fallback path support
- Multiple visual variants

```tsx
// Basic usage
<BackButton />

// With custom fallback
<BackButton fallbackPath="/students" label="Back to Students" />

// Ghost variant
<BackButton variant="ghost" iconVariant="chevron" />

// Icon only
<IconBackButton title="Go back" />

// With confirmation for unsaved changes
<BackButtonWithConfirmation
  requireConfirmation={hasUnsavedChanges}
  confirmMessage="You have unsaved changes. Are you sure?"
/>
```

### 5. Accessibility Features

#### ARIA Labels
- Descriptive labels for all navigation items
- Current page indicators (`aria-current="page"`)
- Disabled state indicators (`aria-disabled`)
- Screen reader friendly

#### Keyboard Navigation
- Full keyboard support (Tab, Enter, Space)
- Skip to main content link
- Focus management
- Focus indicators (ring-2 ring-primary-500)

#### Semantic HTML
- Proper `<nav>` elements
- Role attributes (`role="navigation"`, `role="banner"`, `role="main"`)
- Ordered lists for navigation (`<ol>`, `<li>`)

### 6. Mobile Responsive Design

- Collapsible sidebar for mobile devices
- Touch-friendly tap targets
- Overlay with backdrop blur
- Smooth transitions
- Bottom navigation support (configurable)

### 7. Navigation State Management

Using `useNavigationState` hook:

```tsx
const {
  previousPath,
  previousState,
  navigateBack,
  navigateWithState,
  canGoBack
} = useNavigationState();

// Navigate with state
navigateWithState('/students/123', { from: 'list' });

// Navigate back with state restoration
navigateBack('/students');
```

## Usage Examples

### Adding New Navigation Item

1. Add to `navigationConfig` in `Layout.tsx`:

```tsx
{
  id: 'new-feature',
  name: 'New Feature',
  path: PROTECTED_ROUTES.NEW_FEATURE,
  icon: 'Star',
  roles: ['ADMIN', 'NURSE'],
  permissions: [{ resource: 'new_feature', action: 'read' }],
  order: 12,
}
```

2. Add route metadata in `routeUtils.ts`:

```tsx
[PROTECTED_ROUTES.NEW_FEATURE]: {
  path: PROTECTED_ROUTES.NEW_FEATURE,
  title: 'New Feature',
  icon: 'Star',
  roles: ['ADMIN', 'NURSE'],
  permissions: ['new_feature.read'],
}
```

3. Import icon in `Layout.tsx`:

```tsx
import { Star } from 'lucide-react'

const iconMap: Record<string, any> = {
  // ... existing icons
  Star,
}
```

### Checking Access Programmatically

```tsx
import { canAccessNavigationItem } from '../utils/navigationUtils';

const item = { id: 'students', name: 'Students', path: '/students', ... };
const { hasAccess, reason } = canAccessNavigationItem(item, user);

if (!hasAccess) {
  console.log(`Access denied: ${reason}`);
}
```

### Filtering Navigation Items

```tsx
import { filterNavigationItems } from '../utils/navigationUtils';

const filteredItems = filterNavigationItems(navigationConfig, user);
```

### Custom Navigation Guards

```tsx
import { withPermissionGuard, withRoleGuard } from '../guards/navigationGuards';

// Protect component with role
const AdminPage = withRoleGuard(['ADMIN'])(MyPage);

// Protect component with permission
const StudentEditPage = withPermissionGuard([
  { resource: 'students', action: 'update' }
])(MyPage);

// Compose multiple guards
const ProtectedPage = composeGuards([
  withAuthGuard,
  withRoleGuard(['ADMIN']),
  withPermissionGuard([{ resource: 'users', action: 'manage' }])
])(MyPage);
```

## Permission System

### Role Hierarchy

1. **ADMIN**: Full system access, all permissions
2. **DISTRICT_ADMIN**: District-wide access, all permissions
3. **SCHOOL_ADMIN**: School management, limited administrative access
4. **NURSE**: Clinical operations, student health management
5. **COUNSELOR**: Student records (limited), incident reporting
6. **READ_ONLY**: View-only access to most sections

### Permission Format

Permissions follow the format: `resource.action`

Common resources:
- `students`
- `medications`
- `health_records`
- `appointments`
- `incident_reports`
- `emergency_contacts`
- `communication`
- `inventory`
- `reports`
- `system`

Common actions:
- `read`
- `create`
- `update`
- `delete`
- `manage`
- `administer`

Wildcard permissions:
- `*.*` - All permissions (ADMIN, DISTRICT_ADMIN)
- `students.*` - All student permissions
- `medications.read` - Only read medications

## State Persistence

### Navigation History

The system tracks:
- Previous route paths
- Route state data
- Scroll positions
- Timestamps

History is limited to the last 10 entries to prevent memory issues.

### URL State Synchronization

Navigation state is synchronized with URL parameters:

```tsx
import { useRouteState } from '../hooks/useRouteState';

const [search, setSearch] = useRouteState({
  paramName: 'search',
  defaultValue: ''
});
```

### Persisted Filters

Filters persist across page reloads:

```tsx
import { usePersistedFilters } from '../hooks/useRouteState';

const { filters, setFilters, clearFilters } = usePersistedFilters({
  storageKey: 'student-filters',
  defaultFilters: {
    grade: '',
    status: 'active',
  },
  syncWithUrl: true,
});
```

## Testing

### Cypress Tests

Navigation items have data attributes for testing:

```tsx
// In component
<Link data-cy="students-nav" to="/students">Students</Link>

// In test
cy.get('[data-cy="students-nav"]').click();
```

### Role-Based Testing

Test navigation visibility for different roles:

```tsx
describe('Navigation Access', () => {
  it('shows admin panel for ADMIN role', () => {
    cy.loginAs('admin');
    cy.get('[data-cy="admin-panel-link"]').should('be.visible');
  });

  it('hides admin panel for NURSE role', () => {
    cy.loginAs('nurse');
    cy.get('[data-cy="admin-panel-link"]').should('not.exist');
  });
});
```

## Performance Considerations

### Memoization

Navigation filtering uses `useMemo` to avoid unnecessary recalculations:

```tsx
const filteredNavigation = useMemo(() => {
  const filtered = filterNavigationItems(navigationConfig, user);
  return markActiveNavigationItems(filtered, location.pathname);
}, [user, location.pathname]);
```

### Icon Loading

Icons are imported statically and mapped for efficient rendering:

```tsx
const iconMap: Record<string, any> = {
  Home, Users, Pill, // ... etc
};

const Icon = iconMap[item.icon];
```

## Security Considerations

1. **Client-side checks are not security**
   - Navigation guards prevent UI access
   - Backend must enforce all permissions
   - Never trust client-side permission checks

2. **Audit logging**
   - All navigation guard denials are logged
   - Failed access attempts tracked
   - Security incidents monitored

3. **Token validation**
   - Navigation requires valid JWT token
   - Expired tokens redirect to login
   - Session management integrated

## Troubleshooting

### Navigation item not showing

1. Check user role includes required roles
2. Verify permissions are granted to role
3. Check feature flag if specified
4. Ensure item is not hidden
5. Verify `order` property for positioning

### Breadcrumbs not appearing

1. Ensure route has metadata in `ROUTE_METADATA`
2. Check parent chain is correctly defined
3. Verify pathname matches route pattern
4. Confirm not on root/dashboard (single item)

### Back button not working

1. Check navigation history exists
2. Verify fallback path is correct
3. Ensure `useNavigationState` hook is used
4. Check for custom onClick override

### Tooltips not showing

1. Verify item has no access (`hasAccess: false`)
2. Check `disabledMessage` or reason is set
3. Ensure hover state works (CSS `group-hover`)
4. Check z-index and positioning

## Future Enhancements

- [ ] Collapsible navigation sections
- [ ] Favorite/pinned items
- [ ] Recent pages history
- [ ] Search navigation items
- [ ] Customizable navigation order per user
- [ ] Dark mode support
- [ ] Navigation analytics
- [ ] Keyboard shortcuts panel

## Related Documentation

- [Route Guards Documentation](../guards/README.md)
- [Permission System Documentation](../../docs/permissions.md)
- [Accessibility Guidelines](../../docs/accessibility.md)
- [Testing Guide](../../docs/testing.md)
