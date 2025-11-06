# Architecture Notes - ReportBuilder Refactoring
**Task ID:** RB9X2Y
**Component:** ReportBuilder.tsx

## References to Other Agent Work
- Previous component refactoring patterns in `.temp/task-status-BDM701.json`
- Re-export patterns established in `.temp/completion-summary-CM734R.md`
- Similar component breakdown strategies used across the codebase

## High-level Design Decisions

### Component Hierarchy
```
ReportBuilder (Main orchestrator)
├── BuilderCanvas (Step navigation & layout)
│   ├── BasicInfoForm (Step 1)
│   ├── DataSourceSelector (Step 2)
│   ├── FieldSelector (Step 2 - conditional)
│   ├── FilterBuilder (Step 3)
│   ├── ChartConfigurator (Step 4)
│   └── ScheduleConfigurator (Step 5)
└── QueryPreview (Modal overlay)
```

### State Management Strategy
**Decision:** Use custom hook pattern (`useReportBuilder`)

**Rationale:**
- Encapsulates complex state logic
- Reduces prop drilling through component tree
- Makes state management testable in isolation
- Provides clean API for component interaction

**Hook Structure:**
```typescript
useReportBuilder(initialReport?: Report) returns {
  // State
  reportConfig: ReportConfig
  activeStep: StepId
  expandedSources: Record<DataSource, boolean>
  validationErrors: string[]
  showPreview: boolean

  // Actions
  updateBasicInfo: (field, value) => void
  toggleDataSource: (source) => void
  toggleField: (fieldId) => void
  addFilter: () => void
  updateFilter: (id, updates) => void
  removeFilter: (id) => void
  setActiveStep: (step) => void
  toggleSourceExpansion: (source) => void

  // Computed
  getAvailableFields: () => ReportField[]
  validate: () => string[]
}
```

### Component Composition Strategy

**Pattern:** Compound Components with Context (if needed)

**Rationale:**
- Each sub-component can be used independently
- Shared state managed through custom hook
- Clear component boundaries
- Easy to test individual pieces

### Props vs. Context API Decision

**Decision:** Props for component communication

**Rationale:**
- Component tree is shallow (2-3 levels max)
- Props make data flow explicit and easier to trace
- No deep nesting that would benefit from Context
- State managed in custom hook, passed via props

## Integration Patterns

### Parent-Child Communication
- **Parent → Child:** Props for data and callbacks
- **Child → Parent:** Callback functions passed as props
- **State Updates:** Flow through custom hook actions

### Sibling Communication
- **Via Parent:** Shared state in useReportBuilder hook
- **No Direct Communication:** All state flows through parent

### Example Flow:
```
User clicks "Add Filter" in FilterBuilder
  → Calls onAddFilter callback
  → Executes addFilter() from useReportBuilder hook
  → Updates reportConfig state
  → Re-renders FilterBuilder with new filters array
```

## React Patterns Used

### 1. Custom Hooks Pattern
**File:** `hooks.ts`
```typescript
export const useReportBuilder = (initialReport?: Report) => {
  // All useState hooks
  // State update functions
  // Computed values
  // Validation logic
}
```

**Benefits:**
- Separation of concerns (state logic vs. UI)
- Reusable across similar components
- Testable in isolation
- Cleaner component code

### 2. Presentational Component Pattern
**Components:** DataSourceSelector, FieldSelector, FilterBuilder, ChartConfigurator

**Characteristics:**
- Receive data via props
- Emit events via callbacks
- No internal business logic
- Focused on rendering UI
- Highly reusable

### 3. Container Component Pattern
**Component:** BuilderCanvas

**Responsibilities:**
- Manages state via custom hook
- Orchestrates child components
- Handles step navigation
- Manages validation
- Coordinates save/preview actions

## Performance Considerations

### Memoization Strategy

**Components to Memoize:**
```typescript
// Prevent re-renders when props haven't changed
export const DataSourceSelector = React.memo(...)
export const FieldSelector = React.memo(...)
export const FilterBuilder = React.memo(...)
export const ChartConfigurator = React.memo(...)
```

**Callbacks to Memoize:**
```typescript
// In useReportBuilder hook
const toggleDataSource = useCallback((source: DataSource) => {
  setReportConfig(prev => ({
    ...prev,
    dataSources: prev.dataSources.includes(source)
      ? prev.dataSources.filter(s => s !== source)
      : [...prev.dataSources, source]
  }))
}, [])
```

**Computed Values to Memoize:**
```typescript
const getAvailableFields = useMemo(() => {
  return reportConfig.dataSources.flatMap(
    source => availableFields[source] || []
  )
}, [reportConfig.dataSources, availableFields])
```

### Code Splitting Points
**Not Required:** Component is already lazy-loaded as part of Reports page

**Future Optimization:**
- If ChartConfigurator grows significantly, consider lazy loading chart libraries
- Preview modal could be code-split if it includes heavy visualization libraries

### Re-render Optimization

**Strategy:**
1. **Memo Components:** Prevent unnecessary re-renders of child components
2. **Callback Stability:** Use useCallback for all event handlers
3. **Computed Stability:** Use useMemo for derived data
4. **State Structure:** Flat state structure to minimize update cascades

**Anti-patterns Avoided:**
- Inline function definitions in render
- New object/array literals in props
- Unstable callback references
- Deep state nesting requiring complex updates

## Type Safety

### TypeScript Interface Design

**Exported Types:**
```typescript
// types.ts
export type DataSource = 'students' | 'medications' | 'appointments' | ...
export type FilterOperator = 'equals' | 'not_equals' | ...
export type StepId = 'basic' | 'data' | 'filters' | 'visualization' | 'schedule'

export interface ReportField {
  id: string
  name: string
  label: string
  type: 'string' | 'number' | 'date' | 'boolean' | 'array'
  source: DataSource
  category: string
  description?: string
  required?: boolean
  isGroupable?: boolean
  isSortable?: boolean
  isFilterable?: boolean
}

export interface FilterCondition {
  id: string
  fieldId: string
  operator: FilterOperator
  value: unknown
  secondValue?: unknown
}

export interface ReportConfig {
  // ... full configuration interface
}
```

**Component Props Interfaces:**
```typescript
// Each component has explicit props interface
export interface DataSourceSelectorProps {
  dataSources: DataSource[]
  selectedSources: DataSource[]
  availableFields: Record<DataSource, ReportField[]>
  onToggleSource: (source: DataSource) => void
}
```

### Generic Component Patterns
**Not applicable** - Components are specific to report building domain

### Event Handler Typing
```typescript
// Explicit React event types
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  updateBasicInfo('title', e.target.value)
}

const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  updateBasicInfo('category', e.target.value)
}
```

## Accessibility Considerations

### ARIA Attributes
- All form inputs have `aria-label` or associated `<label>`
- Error messages linked via `aria-describedby`
- Modal has `role="dialog"` and `aria-modal="true"`
- Loading states announced with `aria-live` regions
- Expandable sections use `aria-expanded`

### Keyboard Navigation
- All interactive elements keyboard accessible
- Modal traps focus
- Step navigation supports arrow keys
- Proper tab order throughout

### Semantic HTML
- `<form>` elements for form sections
- `<fieldset>` and `<legend>` for related inputs
- `<button>` for actions (not divs)
- Proper heading hierarchy

## File Structure
```
ReportBuilder/
├── index.ts                    # Re-exports
├── types.ts                    # All TypeScript types
├── utils.ts                    # Helper functions
├── hooks.ts                    # useReportBuilder hook
├── DataSourceSelector.tsx      # Data source selection
├── FieldSelector.tsx           # Field picker
├── FilterBuilder.tsx           # Filter configuration
├── ChartConfigurator.tsx       # Chart settings
├── QueryPreview.tsx            # Preview modal
└── BuilderCanvas.tsx           # Main orchestrator
```

## Testing Strategy

### Unit Testing
- **Utils:** Test helper functions in isolation
- **Hooks:** Test useReportBuilder with @testing-library/react-hooks
- **Components:** Test each component with React Testing Library

### Integration Testing
- Test complete report building flow
- Verify step navigation
- Test filter adding/removing
- Verify preview functionality

### Accessibility Testing
- Test keyboard navigation
- Verify screen reader compatibility
- Check ARIA attribute correctness

## Migration Path

### Backward Compatibility
- External API (ReportBuilderProps) unchanged
- Same props interface maintained
- Same callback signatures
- No breaking changes for parent components

### Internal Changes
- State management moved to custom hook
- UI split into smaller components
- Types extracted to separate file
- Utils extracted to separate file

### Rollback Strategy
- Original component backed up
- Can revert to original if issues arise
- Git history maintains original version
