# Architecture Notes - React Component Architect
**Task ID:** RE789X - ReportExport.tsx Refactoring
**Started:** 2025-11-04

## References to Other Agent Work
- **BDM701**: Component refactoring patterns and best practices
- **CM734R**: Re-export strategies and barrel export patterns
- **Previous Report refactorings**: Consistent approach across Report components

## High-level Design Decisions

### 1. Subdirectory Organization
**Decision**: Create `ReportExport/` subdirectory for all related files
**Rationale**:
- 15 files total (types, utils, hooks, 11 components, index)
- Keeps related code together
- Easier to maintain and navigate
- Follows established patterns from other refactorings

### 2. Extract Shared Code First
**Decision**: Extract types.ts → utils.ts → hooks.ts before components
**Rationale**:
- Types are foundation for all components
- Utils provide helper functions used across components
- Hooks manage reusable state logic
- Proper dependency ordering prevents circular imports

### 3. Component Composition Strategy
**Decision**: Main ReportExport.tsx becomes composition layer (~150 lines)
**Rationale**:
- Delegates implementation to focused sub-components
- Manages high-level state (activeTab, showCreateModal)
- Coordinates component interactions
- Easier to test and maintain

### 4. Modal Extraction Pattern
**Decision**: Extract CreateExportModal as standalone component (~280 lines)
**Rationale**:
- Modal is complex (271 lines in original)
- Can be reused in other contexts
- Easier to test in isolation
- Clearer separation of concerns

### 5. Tab-Based Component Split
**Decision**: Create display components for each tab (ConfigCard, JobTable, TemplateCard)
**Rationale**:
- Each tab has distinct data and interactions
- ConfigCard: Display export configurations
- JobTable: Display jobs with filtering
- TemplateCard: Display reusable templates
- Better component reusability

## Integration Patterns

### Parent-Child Communication
```typescript
// Main component manages state, passes to children
<ExportJobTable
  jobs={jobs}
  filters={filters}
  onFilterChange={setFilters}
  onDownload={onDownloadFile}
  onCancel={onCancelJob}
/>
```

### Sibling Component Communication
- Siblings communicate via shared parent state
- CreateExportModal updates config state, reflected in ExportConfigCard
- No direct sibling-to-sibling communication

### Global State Integration
- Component receives data via props (configs, jobs, templates)
- Callbacks bubble up events to parent (onCreateExport, onStartJob, etc.)
- No internal global state management (Context/Redux)
- Parent component orchestrates state

### Form State Management
- CreateExportModal manages own form state
- ExportSettings manages settings form state
- Parent only receives final values via onSubmit

## React Patterns Used

### 1. Custom Hooks
```typescript
// hooks.ts
export const useExportFilters = () => {
  const [filters, setFilters] = useState({
    status: 'all',
    format: 'all',
    priority: 'all'
  });

  const setStatusFilter = (status: string) =>
    setFilters(prev => ({ ...prev, status }));

  return { filters, setFilters, setStatusFilter };
};
```

### 2. Controlled Components
- All form inputs are controlled (value + onChange)
- FormatSelector: controlled dropdown
- EmailDelivery: controlled recipient list
- ExportScheduler: controlled schedule fields

### 3. Compound Components (Not Used)
- Not applicable for this refactoring
- Components are independent, not nested API

### 4. Render Props (Not Used)
- Modern hooks approach preferred
- No legacy render prop patterns

### 5. Component Composition
```typescript
// Main component composes sub-components
<div>
  {activeTab === 'configs' && (
    <div className="grid">
      {configs.map(config => (
        <ExportConfigCard
          key={config.id}
          config={config}
          onStart={onStartJob}
          onEdit={setSelectedConfig}
          onDelete={onDeleteConfig}
        />
      ))}
    </div>
  )}
</div>
```

## Performance Considerations

### Memoization Strategy
1. **ExportConfigCard**: React.memo (pure rendering of config data)
2. **ExportTemplateCard**: React.memo (pure rendering of template data)
3. **ExportProgress**: React.memo (pure rendering of progress state)
4. **FormatSelector**: React.memo (pure controlled component)

### Code Splitting
- Not required for this refactoring
- All components loaded together
- Could add lazy loading for modal if needed in future

### Re-render Optimization
```typescript
// Parent uses useCallback for event handlers
const handleStartJob = useCallback((configId: string) => {
  onStartJob?.(configId);
}, [onStartJob]);

// Passed to memoized child components
<ExportConfigCard onStart={handleStartJob} />
```

### Lazy Loading
- CreateExportModal could be lazy loaded (modal only shown on demand)
- Would reduce initial bundle size
- Not critical for current implementation

## Type Safety

### TypeScript Interface Design
```typescript
// types.ts - Clear, explicit interfaces
export interface ExportConfig {
  id: string;
  name: string;
  reportId: string;
  reportName: string;
  format: ExportFormat;
  destination: ExportDestination;
  settings: ExportSettings;
  filters: Record<string, unknown>;
  schedule?: ExportSchedule;
  recipients?: string[];
  cloudPath?: string;
  createdAt: string;
  createdBy: string;
}

// Nested interfaces for clarity
export interface ExportSettings {
  includeCharts: boolean;
  includeData: boolean;
  includeHeaders: boolean;
  includeFooters: boolean;
  pageOrientation?: 'portrait' | 'landscape';
  pageSize?: 'A4' | 'A3' | 'Letter' | 'Legal';
  quality?: 'low' | 'medium' | 'high';
  compression?: boolean;
}
```

### Generic Component Patterns
- Not used in this refactoring (no generic data structures)
- All components work with specific export types

### Props Type Definitions
```typescript
// Clear, focused props interfaces
interface ExportConfigCardProps {
  config: ExportConfig;
  onStart: (configId: string) => void;
  onEdit: (config: ExportConfig) => void;
  onDelete: (configId: string) => void;
  className?: string;
}
```

### Event Handler Typing
```typescript
// Properly typed event handlers
const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  onChange(e.target.value as ExportFormat);
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  onSubmit(formData);
};
```

## Component Hierarchy

```
ReportExport (Main Container)
├── Header
│   └── Create Export Button
├── Tabs Navigation
└── Tab Content
    ├── Configs Tab
    │   └── ExportConfigCard (multiple)
    │       ├── FormatSelector
    │       ├── Config Actions
    │       └── Config Details
    ├── Jobs Tab
    │   └── ExportJobTable
    │       ├── Filter Controls
    │       ├── Job Rows
    │       │   └── ExportProgress
    │       └── Job Actions
    └── Templates Tab
        └── ExportTemplateCard (multiple)
            ├── Template Details
            └── Use Template Button

CreateExportModal (Overlay)
├── Modal Header
├── Basic Information Form
│   ├── Export Name Input
│   ├── Report Select
│   ├── FormatSelector
│   └── Destination Select
├── ExportSettings (Collapsible)
│   ├── Include Options (checkboxes)
│   └── PDF Options (conditional)
├── ExportScheduler (Collapsible)
│   ├── Enable Toggle
│   ├── Frequency Select
│   └── Time/Timezone Inputs
├── EmailDelivery (Conditional)
│   └── Recipients Input
├── CloudStorage (Conditional)
│   └── Path Input
└── Modal Footer (Actions)
```

## File Dependencies

```
types.ts (No dependencies)
  ↓
utils.ts (depends on types.ts)
  ↓
hooks.ts (depends on types.ts)
  ↓
Components (depend on types.ts, utils.ts, hooks.ts)
  ↓
index.ts (re-exports all)
  ↓
ReportExport.tsx (imports from index.ts)
```

## Accessibility Considerations

### Maintained Features
- All ARIA labels preserved from original component
- Semantic HTML elements (table, form, button, etc.)
- Form field associations (label htmlFor)
- Keyboard navigation support
- Focus management in modal

### Enhanced Features
- ExportProgress: Add aria-valuenow, aria-valuemin, aria-valuemax for screen readers
- CreateExportModal: Trap focus within modal when open
- ExportJobTable: Add aria-sort for sortable columns

## Error Handling

### Component-Level Error Boundaries
- Could add error boundary around ExportJobTable (data-heavy)
- Could add error boundary around CreateExportModal (form validation)
- Not critical for initial refactoring

### Validation
- CreateExportModal: Form validation before submission
- EmailDelivery: Email format validation
- ExportScheduler: Time/date validation

## Testing Strategy

### Unit Testing Approach
- Test each component in isolation
- Mock props and callbacks
- Test user interactions (clicks, input changes)
- Test conditional rendering

### Example Test (ExportConfigCard)
```typescript
describe('ExportConfigCard', () => {
  it('renders config details correctly', () => {
    render(<ExportConfigCard config={mockConfig} />);
    expect(screen.getByText(mockConfig.name)).toBeInTheDocument();
  });

  it('calls onStart when start button clicked', () => {
    const onStart = jest.fn();
    render(<ExportConfigCard config={mockConfig} onStart={onStart} />);
    fireEvent.click(screen.getByLabelText('Start export'));
    expect(onStart).toHaveBeenCalledWith(mockConfig.id);
  });
});
```

### Integration Testing
- Test main ReportExport component with sub-components
- Test tab switching
- Test create export flow
- Test filter interactions

## Migration Strategy

### Backwards Compatibility
- Main ReportExport.tsx maintains same props interface
- Existing consumers of ReportExport don't need changes
- Internal refactoring only

### Gradual Migration (Not Required)
- All changes in single PR
- No gradual migration needed (internal refactoring)

## Future Enhancements

### Potential Improvements
1. **Lazy Loading**: Lazy load CreateExportModal
2. **Virtualization**: Virtual scrolling for large job lists
3. **Real-time Updates**: WebSocket integration for job progress
4. **Drag and Drop**: Reorder export configs
5. **Advanced Filtering**: More filter options in ExportJobTable
6. **Export History**: Separate component for historical exports

### Extensibility Points
- ExportDestination: Easy to add new destinations (Slack, webhook, etc.)
- ExportFormat: Easy to add new formats (DOCX, etc.)
- Custom hooks: Easy to add more state management hooks
