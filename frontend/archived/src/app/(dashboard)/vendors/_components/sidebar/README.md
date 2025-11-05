# Vendor Sidebar Components

This directory contains the refactored vendor sidebar components, broken down from the original monolithic 772-line `VendorsSidebar.tsx` component into smaller, focused, and maintainable React components.

## Component Structure

### Main Components

#### `VendorsSidebar.refactored.tsx` (143 lines)
**Main layout wrapper component** that composes all sub-components.

**Features:**
- Layout composition
- Conditional rendering of sections
- Responsive container
- Accessibility attributes (role, aria-label)

**Props:**
- `className`: Additional CSS classes
- `showStats`: Toggle stats section visibility
- `showQuickActions`: Toggle quick actions visibility
- `showNavigation`: Toggle navigation visibility
- `showActivity`: Toggle activity feed visibility
- `showAlerts`: Toggle alerts visibility

**Usage:**
```tsx
import VendorsSidebar from './_components/VendorsSidebar.refactored'

<VendorsSidebar className="w-80 border-r" />
```

---

### Sub-Components

#### `VendorStats.tsx` (143 lines)
Displays key vendor metrics with trend indicators.

**Features:**
- Real-time metrics display
- Trend indicators (increase/decrease/neutral)
- Icon-based visual representation
- Accessible status announcements

**Props:**
- `metrics`: Array of VendorMetric objects
- `className`: Additional CSS classes

**Usage:**
```tsx
import { VendorStats } from './sidebar'

<VendorStats metrics={customMetrics} />
```

---

#### `VendorQuickActions.tsx` (169 lines)
Quick action buttons for common vendor operations.

**Features:**
- Color-coded action buttons
- Grid layout (2 columns)
- Keyboard navigation support
- Tooltips for descriptions
- Focus management

**Props:**
- `actions`: Array of QuickAction objects
- `className`: Additional CSS classes
- `onActionClick`: Optional callback for action clicks

**Usage:**
```tsx
import { VendorQuickActions } from './sidebar'

<VendorQuickActions onActionClick={(action) => console.log(action)} />
```

---

#### `VendorNavigation.tsx` (411 lines)
Expandable navigation menu with hierarchical structure.

**Features:**
- Expandable/collapsible sections
- Active route highlighting
- Badge indicators for counts
- Keyboard navigation
- ARIA labels for accessibility
- Nested navigation items
- Focus management

**Props:**
- `sections`: Array of VendorSection objects
- `defaultExpanded`: Array of section IDs to expand by default
- `className`: Additional CSS classes

**Usage:**
```tsx
import { VendorNavigation } from './sidebar'

<VendorNavigation defaultExpanded={['management', 'compliance']} />
```

---

#### `VendorActivity.tsx` (189 lines)
Recent activity feed with status indicators.

**Features:**
- Real-time activity feed
- Status-based color coding
- Type-specific icons
- Timestamp display
- Maximum items control
- "View All" action

**Props:**
- `activities`: Array of VendorActivity objects
- `className`: Additional CSS classes
- `onViewAll`: Callback for "View All" button
- `maxItems`: Maximum number of activities to display

**Usage:**
```tsx
import { VendorActivity } from './sidebar'

<VendorActivity maxItems={5} onViewAll={() => router.push('/vendors/activity')} />
```

---

#### `VendorAlerts.tsx` (197 lines)
Alert notifications with color-coded styling.

**Features:**
- Color-coded alert types (warning, success, error, info)
- Icon-based visual indicators
- Dismissible alerts (optional)
- Accessible announcements (aria-live)
- Empty state handling

**Props:**
- `alerts`: Array of VendorAlert objects
- `className`: Additional CSS classes
- `dismissible`: Enable/disable alert dismissal
- `onDismiss`: Callback when alert is dismissed

**Usage:**
```tsx
import { VendorAlerts } from './sidebar'

<VendorAlerts dismissible onDismiss={(id) => handleDismiss(id)} />
```

---

### Shared Utilities

#### `types.ts` (97 lines)
Centralized type definitions for all sidebar components.

**Exports:**
- `VendorSection`: Navigation section interface
- `VendorSubItem`: Navigation sub-item interface
- `VendorMetric`: Metric display interface
- `QuickAction`: Quick action button interface
- `VendorActivity`: Activity feed item interface
- `VendorAlert`: Alert notification interface
- `BadgeColor`: Badge color type
- `ActionColor`: Action button color type

---

#### `hooks.ts` (181 lines)
Custom hooks for sidebar state management.

**Exports:**

##### `useSidebarSections(defaultExpanded: string[])`
Manages expandable section state.

**Returns:**
- `expandedSections`: Set of expanded section IDs
- `toggleSection(id)`: Toggle section expansion
- `isExpanded(id)`: Check if section is expanded
- `expandSection(id)`: Expand a section
- `collapseSection(id)`: Collapse a section
- `collapseAll()`: Collapse all sections
- `expandAll(ids)`: Expand multiple sections

**Usage:**
```tsx
const { toggleSection, isExpanded } = useSidebarSections(['management'])
```

##### `useActiveNavigation()`
Checks active navigation states.

**Returns:**
- `isActive(href)`: Check if path is active (includes sub-paths)
- `isActiveStrict(href)`: Check if path is exactly active
- `isAnyActive(hrefs)`: Check if any of multiple paths are active
- `pathname`: Current pathname

**Usage:**
```tsx
const { isActive } = useActiveNavigation()
const active = isActive('/vendors')
```

##### `useBadgeStyling()`
Badge CSS class utility.

**Returns:**
- `getBadgeClasses(color)`: Get badge CSS classes for color

**Usage:**
```tsx
const getBadgeClasses = useBadgeStyling()
const classes = getBadgeClasses('blue')
```

---

#### `index.ts` (37 lines)
Centralized export point for all components, hooks, and types.

**Usage:**
```tsx
// Import everything from one location
import {
  VendorStats,
  VendorQuickActions,
  VendorNavigation,
  VendorActivity,
  VendorAlerts,
  useSidebarSections,
  useActiveNavigation,
  type VendorMetric,
  type QuickAction,
} from './sidebar'
```

---

## Component Line Counts

| Component | Lines | Purpose |
|-----------|-------|---------|
| **VendorsSidebar.refactored.tsx** | 143 | Main layout wrapper |
| **VendorStats.tsx** | 143 | Key metrics display |
| **VendorQuickActions.tsx** | 169 | Quick action buttons |
| **VendorNavigation.tsx** | 411 | Expandable navigation |
| **VendorActivity.tsx** | 189 | Recent activity feed |
| **VendorAlerts.tsx** | 197 | Alert notifications |
| **hooks.ts** | 181 | Custom hooks |
| **types.ts** | 97 | Type definitions |
| **index.ts** | 37 | Public exports |
| **Total** | **1,567** | (including wrapper) |

---

## Refactoring Benefits

### 1. **Maintainability**
- Each component has a single responsibility
- Average component size: ~170 lines (vs. original 772 lines)
- Easy to locate and modify specific features

### 2. **Testability**
- Components can be tested in isolation
- Hooks can be tested separately with `renderHook`
- Easier to mock dependencies

### 3. **Reusability**
- Components can be used independently
- Hooks can be shared across other components
- Types ensure consistency

### 4. **Performance**
- Smaller components enable better code splitting
- React.memo can be applied to individual components
- Easier to optimize re-renders

### 5. **Developer Experience**
- Easier to understand component responsibilities
- Better IDE support with smaller files
- Faster file navigation

### 6. **Accessibility**
- Focused components enable better ARIA implementation
- Easier to audit accessibility per component
- Semantic HTML structure

---

## Migration Guide

### Step 1: Import New Components
```tsx
// Old
import VendorsSidebar from './_components/VendorsSidebar'

// New
import VendorsSidebar from './_components/VendorsSidebar.refactored'
```

### Step 2: Update Usage (If Needed)
The refactored component has the same API as the original, so no changes are required:

```tsx
// Works the same
<VendorsSidebar className="w-80 border-r" />
```

### Step 3: Customize Sections (Optional)
You can now easily customize or hide specific sections:

```tsx
<VendorsSidebar
  showStats={true}
  showQuickActions={true}
  showNavigation={true}
  showActivity={false}  // Hide activity section
  showAlerts={true}
/>
```

### Step 4: Use Individual Components (Advanced)
For more control, use individual components directly:

```tsx
import {
  VendorStats,
  VendorQuickActions,
  VendorNavigation,
} from './_components/sidebar'

<div className="sidebar">
  <VendorStats />
  <VendorQuickActions />
  <VendorNavigation />
  {/* Custom content here */}
</div>
```

---

## Testing Examples

### Testing VendorStats
```tsx
import { render, screen } from '@testing-library/react'
import VendorStats from './VendorStats'

test('displays vendor metrics', () => {
  const metrics = [
    {
      id: 'test',
      label: 'Test Metric',
      value: 100,
      change: '+10%',
      changeType: 'increase',
      icon: Building2,
    },
  ]

  render(<VendorStats metrics={metrics} />)
  expect(screen.getByText('Test Metric')).toBeInTheDocument()
  expect(screen.getByText('100')).toBeInTheDocument()
})
```

### Testing useSidebarSections Hook
```tsx
import { renderHook, act } from '@testing-library/react'
import { useSidebarSections } from './hooks'

test('toggles section expansion', () => {
  const { result } = renderHook(() => useSidebarSections([]))

  expect(result.current.isExpanded('management')).toBe(false)

  act(() => {
    result.current.toggleSection('management')
  })

  expect(result.current.isExpanded('management')).toBe(true)
})
```

---

## Best Practices

### 1. **Component Composition**
```tsx
// Good: Compose with sub-components
<VendorsSidebar>
  <VendorStats />
  <VendorQuickActions />
  <CustomSection />
</VendorsSidebar>

// Avoid: Creating monolithic components
```

### 2. **Props Design**
```tsx
// Good: Specific, typed props
interface VendorStatsProps {
  metrics?: VendorMetric[]
  className?: string
}

// Avoid: Generic, untyped props
```

### 3. **Hook Usage**
```tsx
// Good: Extract reusable logic
const { isActive } = useActiveNavigation()

// Avoid: Duplicating logic across components
```

### 4. **Type Safety**
```tsx
// Good: Use shared types
import type { VendorMetric } from './types'

// Avoid: Inline type definitions
```

---

## Performance Optimization

### Memoization
Apply React.memo to prevent unnecessary re-renders:

```tsx
import React from 'react'

const VendorStats = React.memo(function VendorStats({ metrics }) {
  // Component implementation
})
```

### Code Splitting
Lazy load components when needed:

```tsx
import { lazy, Suspense } from 'react'

const VendorActivity = lazy(() => import('./sidebar/VendorActivity'))

<Suspense fallback={<LoadingSpinner />}>
  <VendorActivity />
</Suspense>
```

### useCallback for Event Handlers
Memoize callbacks in hooks:

```tsx
const toggleSection = useCallback((sectionId: string) => {
  // Implementation
}, []) // Stable reference
```

---

## Future Enhancements

### Planned Improvements
1. **Data Fetching Integration**: Connect to real-time vendor data APIs
2. **Virtualization**: Implement virtual scrolling for large activity lists
3. **Animations**: Add smooth transitions for section expansion
4. **Customization**: Theme support and configurable layouts
5. **Offline Support**: Cache data for offline access
6. **Search**: Add search/filter functionality to navigation

### Extensibility Points
- Custom metric types
- Plugin system for custom sections
- Event system for cross-component communication
- Theming API for custom styling

---

## Support

For questions or issues with these components:
1. Check component JSDoc comments for detailed API documentation
2. Review test files for usage examples
3. Consult the main README for project-level documentation

---

**Last Updated:** 2025-11-04
**Version:** 2.0.0
