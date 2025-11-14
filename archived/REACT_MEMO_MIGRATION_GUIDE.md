# React.memo Migration Guide
**Generated**: October 27, 2025
**Author**: React Component Architect (RC4A7T)

## Overview

This guide documents the implementation of React.memo for list rendering components to prevent unnecessary re-renders and improve performance.

## Completed Implementations

### MedicationCard.tsx
✅ **Status**: Migrated to React.memo with useCallback
**Location**: `/src/pages-old/medications/components/MedicationCard.tsx`
**Changes**:
- Added `memo` and `useCallback` imports
- Wrapped component with `memo()`
- Memoized `handleStatusToggle` callback
- Added `displayName` for debugging

**Before**:
```typescript
export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  showStudent = false,
  onStatusChange
}) => {
  const dispatch = useDispatch();

  const handleStatusToggle = () => {
    dispatch(medicationsThunks.update({
      id: medication.id,
      data: { isActive: !medication.isActive }
    }));
    onStatusChange?.();
  };

  return <div>...</div>;
};
```

**After**:
```typescript
export const MedicationCard: React.FC<MedicationCardProps> = memo(({
  medication,
  showStudent = false,
  onStatusChange
}) => {
  const dispatch = useDispatch();

  const handleStatusToggle = useCallback(() => {
    dispatch(medicationsThunks.update({
      id: medication.id,
      data: { isActive: !medication.isActive }
    }));
    onStatusChange?.();
  }, [dispatch, medication.id, medication.isActive, onStatusChange]);

  return <div>...</div>;
});

MedicationCard.displayName = 'MedicationCard';
```

**Performance Impact**: Prevents re-renders when parent updates but medication data unchanged

## When to Use React.memo

### ✅ Good Candidates:
1. **List Item Components** (cards, rows, tiles)
   - StudentCard, MedicationCard, AppointmentCard
   - Rendered multiple times in lists
   - Props change infrequently

2. **Pure Presentational Components**
   - Display data without side effects
   - Props determine rendering
   - No internal state changes

3. **Expensive Render Components**
   - Complex calculations
   - Many child components
   - Large DOM trees

### ❌ Poor Candidates:
1. **Components with Frequent Prop Changes**
   - Real-time data displays
   - Animation components
   - Form inputs with onChange

2. **Small/Simple Components** (<20 lines)
   - Memoization overhead > benefit
   - Simple div/span wrappers

3. **Components Always Receiving New Props**
   - Inline object/array props
   - New callback functions every render

## Migration Pattern

### Step 1: Add Imports
```typescript
// Before
import React from 'react';

// After
import React, { memo, useCallback } from 'react';
```

### Step 2: Wrap Component with memo()
```typescript
// Before
export const MyComponent: React.FC<Props> = ({ data, onClick }) => {
  return <div>...</div>;
};

// After
export const MyComponent: React.FC<Props> = memo(({ data, onClick }) => {
  return <div>...</div>;
});
```

### Step 3: Memoize Callbacks
```typescript
// Before
const handleClick = () => {
  doSomething(data.id);
};

// After
const handleClick = useCallback(() => {
  doSomething(data.id);
}, [data.id]); // Only recreate when data.id changes
```

### Step 4: Add displayName
```typescript
MyComponent.displayName = 'MyComponent';
```

## Priority Migration List

### High Priority - List Rendering Components

#### Card Components (15 components):
1. ✅ **MedicationCard.tsx** - COMPLETED
2. ☐ **AppointmentCard.tsx** (140 lines)
3. ☐ **PrescriptionCard.tsx** (165 lines)
4. ☐ **InventoryCard.tsx** (155 lines)
5. ☐ **ItemCard.tsx** (130 lines)
6. ☐ **LocationCard.tsx** (145 lines)
7. ☐ **StockCard.tsx** (135 lines)
8. ☐ **TransactionCard.tsx** (148 lines)
9. ☐ **CategoryCard.tsx** (125 lines)
10. ☐ **VendorCard.tsx** (142 lines)
11. ☐ **WebhookCard.tsx** (138 lines)
12. ☐ **APICard.tsx** (151 lines)
13. ☐ **StudentCard** (if exists in features)
14. ☐ **IncidentCard** (if exists in features)
15. ☐ **HealthRecordCard** (if exists in features)

#### List Item Components (5 components):
1. ☐ **ActivityItem.tsx** (90 lines)
2. ☐ **NotificationItem.tsx** (85 lines)
3. ☐ **MessageListItem** (if exists)
4. ☐ **SearchResultItem** (if exists)
5. ☐ **AuditLogItem** (if exists)

#### Table Row Components (if not in Table.tsx):
1. ☐ Check for custom table row components
2. ☐ StudentTableRow (if separate from Table.tsx)
3. ☐ MedicationTableRow (if separate from Table.tsx)

### Medium Priority - Presentational Components

#### Badge/Status Components:
1. ☐ **StatusBadge** components
2. ☐ **PriorityIndicator** components
3. ☐ **SeverityBadge** components
4. ☐ **TypeBadge** components

#### Stats/Metric Components:
1. ☐ **StatCard** components
2. ☐ **MetricCard** components
3. ☐ **DashboardWidget** components

## Advanced: Custom Comparison Function

For components with complex props, provide custom comparison:

```typescript
import { memo } from 'react';

const MyComponent = memo(
  ({ data, config }) => {
    return <div>...</div>;
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    // Return false if props changed (re-render)
    return (
      prevProps.data.id === nextProps.data.id &&
      prevProps.data.updatedAt === nextProps.data.updatedAt &&
      prevProps.config.mode === nextProps.config.mode
    );
  }
);
```

**Use Cases**:
- Props contain large objects
- Only specific fields matter for rendering
- Custom equality logic needed

## Common Mistakes to Avoid

### Mistake 1: Inline Object Props
```typescript
// ❌ Bad - new object every render defeats memo
<MedicationCard
  medication={data}
  style={{ padding: 10 }}  // New object!
/>

// ✅ Good - stable style object
const cardStyle = { padding: 10 };
<MedicationCard
  medication={data}
  style={cardStyle}
/>
```

### Mistake 2: Inline Callback Props
```typescript
// ❌ Bad - new function every render defeats memo
<MedicationCard
  medication={data}
  onClick={() => handleClick(data.id)}  // New function!
/>

// ✅ Good - memoized callback
const handleCardClick = useCallback(() => {
  handleClick(data.id);
}, [data.id]);

<MedicationCard
  medication={data}
  onClick={handleCardClick}
/>
```

### Mistake 3: Missing Dependencies
```typescript
// ❌ Bad - stale closure
const handleClick = useCallback(() => {
  doSomething(data.id);
}, []); // Missing data.id dependency

// ✅ Good - complete dependencies
const handleClick = useCallback(() => {
  doSomething(data.id);
}, [data.id]);
```

### Mistake 4: Over-Memoization
```typescript
// ❌ Bad - simple component, no benefit
const SimpleDiv = memo(({ text }) => <div>{text}</div>);

// ✅ Good - just use regular component
const SimpleDiv = ({ text }) => <div>{text}</div>;
```

## Testing React.memo Components

### 1. Visual Test - React DevTools Profiler
```typescript
// Enable Profiler in React DevTools
// 1. Open React DevTools
// 2. Go to Profiler tab
// 3. Click Record
// 4. Interact with your component
// 5. Stop recording
// 6. Check "Ranked" view for unnecessary renders
```

### 2. Unit Test - Verify Memoization
```typescript
import { render } from '@testing-library/react';
import { MedicationCard } from './MedicationCard';

test('does not re-render when props unchanged', () => {
  const { rerender } = render(
    <MedicationCard medication={mockData} />
  );

  // Get initial render count
  const initialRenderCount = getRenderCount();

  // Rerender with same props
  rerender(<MedicationCard medication={mockData} />);

  // Render count should not increase
  expect(getRenderCount()).toBe(initialRenderCount);
});
```

### 3. Performance Test - Benchmark
```typescript
import { performance } from 'perf_hooks';

// Before memo
const start1 = performance.now();
renderList(1000); // Render list 1000 times
const end1 = performance.now();
console.log(`Before memo: ${end1 - start1}ms`);

// After memo
const start2 = performance.now();
renderMemoizedList(1000);
const end2 = performance.now();
console.log(`After memo: ${end2 - start2}ms`);
```

## Verification Checklist

For each component migration:
- [ ] Import `memo` and `useCallback` from React
- [ ] Wrap component function with `memo()`
- [ ] Memoize all callbacks with `useCallback`
- [ ] Add complete dependency arrays
- [ ] Add `displayName` for debugging
- [ ] Test component renders correctly
- [ ] Verify no performance regression
- [ ] Check React DevTools Profiler for improvement
- [ ] Update component documentation

## Measuring Impact

### Before Migration:
```bash
# Profile rendering performance
npm run dev
# Open React DevTools Profiler
# Record interaction with list (scroll, filter, etc.)
# Note: Flamegraph showing re-renders
```

### After Migration:
```bash
# Profile again with same interaction
# Compare:
# - Number of components rendered
# - Total render time
# - Wasted renders (highlighted in yellow)

# Expected improvement:
# - 40-60% reduction in list re-renders
# - 30-50% reduction in total render time
# - Smoother scrolling in long lists
```

### Metrics to Track:
- **Re-render count**: Target 50% reduction
- **Render time**: Target 30% improvement
- **User perception**: Smoother interactions
- **FPS during scroll**: Target 60fps

## Next Steps

1. **Week 1**: Migrate all Card components (15 components)
2. **Week 2**: Migrate all List Item components (5 components)
3. **Week 3**: Migrate Table Row components (if separate)
4. **Week 4**: Profile and measure overall improvement

## Tools and Resources

### React DevTools
- Profiler tab for render analysis
- Highlight updates setting
- Component props inspection

### Performance Monitoring
- Chrome DevTools Performance tab
- Lighthouse performance audit
- React Profiler API

### Documentation
- React memo documentation: https://react.dev/reference/react/memo
- React useCallback documentation: https://react.dev/reference/react/useCallback
- Performance optimization guide: https://react.dev/learn/render-and-commit

## Support

For questions or issues with React.memo migration:
- Review this guide
- Check React DevTools Profiler
- Consult React documentation
- Contact React Component Architect (RC4A7T)

---

**Status**: 1/20 components migrated (MedicationCard)
**Next**: Migrate AppointmentCard, ActivityItem, and remaining card components
**Expected Total Impact**: 40-60% reduction in list re-renders
