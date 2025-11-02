# Architecture Notes - React Component Architect (R6C8V5)

## References to Other Agent Work
- **T8C4M2**: TypeScript type checking audit - focusing on component patterns, not types
- **SF7K3W**: Server function patterns and best practices
- **M7B2K9**: Frontend architecture patterns

## Component Audit Summary

### Total Components Analyzed: 462 files

**Statistics:**
- Components using `export const`: 165 files (189 occurrences)
- Components using React.memo: 42 files (49 occurrences - **9% only**)
- Components using useCallback/useMemo: 90 files (286 occurrences)
- Components with default exports: 279 files
- Index files with export pattern: 52 barrel export files

## Critical Issues Identified

### 1. React.memo Under-Utilization (CRITICAL)

**Issue**: Only 9% of components use React.memo despite most being pure presentational components.

**Impact**: Unnecessary re-renders throughout the application, especially in lists and complex component trees.

**Examples of components needing React.memo:**
- `PageHeader.tsx` - Pure presentational, no memoization
- `OverviewTab.tsx` - Pure component with static data, no optimization
- Most tab components in health-records
- Many modal components
- List item components

**Pattern to Apply:**
```typescript
// BEFORE
export const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  return <div>...</div>
}

// AFTER
export const MyComponent = React.memo<Props>(({ prop1, prop2 }) => {
  return <div>...</div>
})
MyComponent.displayName = 'MyComponent'
```

### 2. Export Pattern Inconsistency (HIGH PRIORITY)

**Issue**: Mixed use of default and named exports causes import confusion and inconsistent patterns.

**Examples of Inconsistencies:**

1. **StudentCard.tsx** (Lines 54, 246):
```typescript
export const StudentCard: React.FC<Props> = ...  // Line 54 - named export
export default React.memo(StudentCard);           // Line 246 - default export with memo
```
This creates two separate identities for the same component.

2. **Input.tsx** (Lines 151, 281):
```typescript
export const Input = React.forwardRef<...>()     // Line 151 - named export
export default Input;                             // Line 281 - also default export
```

3. **DashboardCard.tsx** (Line 129):
```typescript
export const DashboardCard = React.memo<Props>(...)  // Correct pattern!
DashboardCard.displayName = 'DashboardCard'
export default DashboardCard;  // But also exports default
```

**Recommended Pattern:**
```typescript
// Preferred: Named exports with displayName
export const MyComponent = React.memo<Props>(({ ... }) => {
  return <div>...</div>
})
MyComponent.displayName = 'MyComponent'

// Barrel exports in index.ts
export { MyComponent } from './MyComponent'
export type { MyComponentProps } from './MyComponent'
```

### 3. Hook Optimization Issues (MEDIUM)

**Issue**: Inconsistent use of useCallback and useMemo for optimization.

**Good Example - DashboardCard.tsx** (Lines 152-161):
```typescript
const handleRefresh = useCallback(async () => {
  if (onRefresh && !isRefreshing && !loading) {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  }
}, [onRefresh, isRefreshing, loading]);

const themeClasses = useMemo(() => ({
  container: darkMode ? '...' : '...',
  subtitle: darkMode ? '...' : '...',
  // ... more computed values
}), [darkMode]);
```

**Poor Example - Many Components**:
```typescript
// Missing useCallback for handler passed to child
<Button onClick={() => handleAction(item.id)} />

// Should be:
const handleClick = useCallback(() => handleAction(item.id), [item.id])
<Button onClick={handleClick} />
```

**Pattern to Apply:**
- Use `useCallback` for event handlers passed to memoized children
- Use `useMemo` for expensive computations or object/array creation
- Use `React.memo` on child components receiving callbacks

### 4. Component Composition Issues (MEDIUM)

**Issue**: Some components have prop drilling and could benefit from better composition patterns.

**Example from OverviewTab.tsx**:
- Hardcoded data mixed with component rendering
- No separation of concerns
- Missing data fetching hooks
- No loading/error states

**Recommended Pattern:**
```typescript
// Separate data fetching from presentation
const useHealthOverview = (studentId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['health-overview', studentId],
    queryFn: () => fetchHealthOverview(studentId)
  })
  return { data, isLoading, error }
}

// Pure presentational component
export const OverviewTab = React.memo<OverviewTabProps>(({ data }) => {
  // Render data
})
```

### 5. Missing JSDoc Documentation (LOW-MEDIUM)

**Issue**: Inconsistent JSDoc documentation across components.

**Good Examples:**
- `Input.tsx` - Comprehensive JSDoc with examples, accessibility notes
- `DashboardCard.tsx` - Detailed prop documentation and usage examples
- Button components have good documentation

**Missing Documentation:**
- Many tab components lack JSDoc
- Modal components need better prop documentation
- Shared components need usage examples

## Component Architecture Patterns

### Excellent Patterns (Keep These)

1. **DashboardCard.tsx** - Reference implementation:
   - ✅ Uses React.memo for optimization
   - ✅ useCallback for event handlers
   - ✅ useMemo for computed values
   - ✅ Comprehensive JSDoc
   - ✅ Proper TypeScript interfaces
   - ✅ displayName for debugging
   - ✅ Accessibility features

2. **Input.tsx** - Reference for form components:
   - ✅ React.forwardRef for DOM access
   - ✅ Comprehensive prop types
   - ✅ Accessibility (ARIA attributes)
   - ✅ Dark mode support
   - ✅ Multiple variants and sizes
   - ✅ Loading and error states

3. **Button components** - Good export patterns:
   - ✅ Clear barrel exports in index.ts
   - ✅ Type exports alongside components
   - ✅ Good JSDoc in index files

### Anti-Patterns to Fix

1. **Double Export Pattern**:
```typescript
// ❌ DON'T DO THIS
export const MyComponent = ...
export default MyComponent
```

2. **Un-memoized Pure Components**:
```typescript
// ❌ BAD
export const ListItem: React.FC<Props> = ({ item }) => <div>{item.name}</div>

// ✅ GOOD
export const ListItem = React.memo<Props>(({ item }) => <div>{item.name}</div>)
```

3. **Missing Callback Optimization**:
```typescript
// ❌ BAD - Creates new function every render
<Button onClick={() => handleDelete(id)} />

// ✅ GOOD - Memoized callback
const handleClick = useCallback(() => handleDelete(id), [id])
<Button onClick={handleClick} />
```

4. **Hardcoded Data in Components**:
```typescript
// ❌ BAD - OverviewTab has hardcoded timeline data
const events = [
  { id: '1', date: '2024-09-15', ... },
  // ...
]

// ✅ GOOD - Accept data as props
interface OverviewTabProps {
  events: HealthEvent[]
}
```

## Component Organization Assessment

### Well-Organized Directories

1. **ui/buttons/** - Excellent structure:
   - Clear separation of concerns
   - Good barrel exports with JSDoc
   - Type exports alongside components

2. **ui/inputs/** - Good patterns:
   - Consistent component APIs
   - Proper TypeScript interfaces
   - Clear export patterns

3. **features/dashboard/** - Good feature organization:
   - Widget components properly separated
   - Most use React.memo
   - Clear component responsibilities

### Needs Improvement

1. **features/health-records/components/tabs/** - Inconsistent:
   - Some tabs are well-structured, others aren't
   - Missing React.memo on most tabs
   - Hardcoded data in some components
   - Inconsistent prop patterns

2. **features/messages/chat/** - Good atomic design but:
   - atoms/molecules/organisms pattern is good
   - But some components lack optimization
   - Missing memo on several atoms

## Performance Optimization Strategy

### High-Impact Optimizations

1. **Add React.memo to pure components** (~120 components):
   - All tab components
   - All modal components
   - All list item components
   - All card components (except DashboardCard which has it)

2. **Optimize event handlers** (~80 components):
   - Wrap inline functions in useCallback
   - Especially in list renderers
   - Parent components passing handlers to children

3. **Memoize computed values** (~50 components):
   - Style computations
   - Filtered/sorted lists
   - Complex calculations

### Medium-Impact Optimizations

1. **Code splitting for large components**:
   - Chart components (already have React.lazy candidates)
   - Modal components (load on demand)
   - Settings tabs (lazy load)

2. **Virtualization for long lists**:
   - Student lists
   - Medication lists
   - Health record timelines

## Export/Import Standardization

### Recommended Pattern for All Components

```typescript
// Component file (e.g., MyComponent.tsx)
export interface MyComponentProps {
  // Props definition
}

export const MyComponent = React.memo<MyComponentProps>(({ ... }) => {
  // Implementation
})

MyComponent.displayName = 'MyComponent'

// NO default export unless necessary for Next.js pages
```

```typescript
// Barrel export (index.ts)
export { MyComponent } from './MyComponent'
export type { MyComponentProps } from './MyComponent'
```

### Import Pattern

```typescript
// ✅ GOOD - Clear named imports
import { Button, Input } from '@/components/ui'
import type { ButtonProps } from '@/components/ui'

// ❌ BAD - Default imports are less discoverable
import Button from '@/components/ui/Button'
```

## Component Type Safety

### Good Practices Observed

1. **Proper use of React.FC vs direct typing**:
```typescript
// Both are acceptable, forwardRef components prefer direct typing
const Input = React.forwardRef<HTMLInputElement, InputProps>(...)

// React.FC is fine for simple components
const Card: React.FC<CardProps> = ({ children }) => ...

// React.memo with explicit type is best
export const Card = React.memo<CardProps>(({ children }) => ...)
```

2. **Comprehensive prop interfaces**:
- Most components have well-defined TypeScript interfaces
- Optional props properly marked with `?`
- Default values in destructuring

3. **Proper children typing**:
```typescript
interface Props {
  children: React.ReactNode  // ✅ Correct
  // NOT: children: any      // ❌ Wrong
}
```

## Accessibility Patterns

### Excellent Accessibility (Maintain)

1. **Input.tsx**:
   - Proper label associations (htmlFor)
   - ARIA attributes (aria-invalid, aria-required, aria-describedby)
   - Loading state announcements (aria-busy, aria-live)
   - Screen reader text for icons

2. **Button components**:
   - Proper aria-label for icon-only buttons
   - Disabled state handling
   - Keyboard navigation support

3. **Card components**:
   - Proper heading hierarchy
   - Focus management
   - Keyboard interactions

### Missing Accessibility (Fix Needed)

1. **Some modal components**:
   - Need focus trap
   - Need escape key handling
   - Need aria-modal

2. **Some list components**:
   - Need proper role attributes
   - Need aria-label for actions

## Summary of Required Fixes

### Critical (Do First)
1. Add React.memo to ~120 pure components
2. Fix export pattern inconsistencies (remove double exports)
3. Add useCallback to event handlers in lists

### High Priority
1. Optimize hook usage (useCallback/useMemo)
2. Add displayName to all memoized components
3. Document complex components with JSDoc

### Medium Priority
1. Improve component composition (separate data from presentation)
2. Add loading/error states to components missing them
3. Implement code splitting for large components

### Low Priority
1. Add comprehensive JSDoc to all components
2. Create Storybook stories for components
3. Add unit tests for complex components

## References

- React.memo documentation: https://react.dev/reference/react/memo
- useCallback/useMemo: https://react.dev/reference/react/useCallback
- Component patterns: React documentation on composition
- Export patterns: TypeScript and ES module best practices
