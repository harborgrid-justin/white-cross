# Refactoring Plan: ReportExport.tsx
**Agent:** React Component Architect
**Task ID:** RE789X
**Started:** 2025-11-04
**Related Work:** BDM701 (component refactoring patterns), CM734R (re-exports)

## Overview
Break down ReportExport.tsx (1,004 LOC) into a well-structured component architecture with:
- 1 subdirectory: `ReportExport/`
- 3 shared files: `types.ts`, `utils.ts`, `hooks.ts`
- 11 focused components
- 1 barrel export (`index.ts`)
- 1 updated main component

## Current Analysis

### Component Structure (Lines of Code)
- Total: 1,004 lines
- Imports: 35 lines (lucide-react icons)
- Types: 88 lines (ExportFormat, ExportConfig, ExportJob, ExportTemplate, etc.)
- Main Component: 836 lines
  - State management: 33 lines
  - Helper functions: 90 lines
  - Configs tab: 98 lines
  - Jobs tab: 169 lines
  - Templates tab: 75 lines
  - Create modal: 271 lines

### Identified Responsibilities
1. **Export Configuration Management** - Create/edit/delete configs
2. **Format Selection** - PDF, Excel, CSV, JSON, XML, images
3. **Export Scheduling** - Set frequency, time, timezone
4. **Destination Management** - Download, email, cloud, FTP, API
5. **Job Monitoring** - Track progress, status, priority
6. **Template Management** - Save/reuse export configurations
7. **Batch Operations** - Multiple export jobs
8. **Progress Tracking** - Real-time export progress

## Refactoring Strategy

### Phase 1: Setup and Shared Code (30 minutes)
**Deliverables:**
- Create `ReportExport/` subdirectory
- Extract `types.ts` (all interfaces and type definitions)
- Extract `utils.ts` (helper functions: formatFileSize, getFormatIcon, getStatusDisplay, getPriorityColor)
- Extract `hooks.ts` (custom hooks for state management)

### Phase 2: UI Components (60 minutes)
**Deliverables:**
- `FormatSelector.tsx` - Format selection dropdown with icons (~60 lines)
- `ExportScheduler.tsx` - Schedule configuration UI (~150 lines)
- `CloudStorage.tsx` - Cloud storage settings (~120 lines)
- `EmailDelivery.tsx` - Email recipient configuration (~100 lines)
- `BatchExport.tsx` - Batch operation controls (~130 lines)
- `ExportProgress.tsx` - Progress bar and status display (~80 lines)

### Phase 3: Display Components (45 minutes)
**Deliverables:**
- `ExportConfigCard.tsx` - Individual config card display (~100 lines)
- `ExportJobTable.tsx` - Jobs table with filtering (~180 lines)
- `ExportTemplateCard.tsx` - Template card display (~90 lines)

### Phase 4: Feature Components (40 minutes)
**Deliverables:**
- `CreateExportModal.tsx` - Export creation dialog (~280 lines)
- `ExportSettings.tsx` - Settings section (includeCharts, pageSize, etc.) (~120 lines)

### Phase 5: Integration (30 minutes)
**Deliverables:**
- Create `index.ts` barrel export
- Update main `ReportExport.tsx` to compose sub-components (~150 lines)
- Verify all imports and type safety

## Component Breakdown Details

### 1. types.ts
```typescript
// Export all type definitions
- ExportFormat
- ExportDestination
- ExportStatus
- ExportPriority
- ExportConfig
- ExportJob
- ExportTemplate
- ReportExportProps (split into focused props)
```

### 2. utils.ts
```typescript
// Export helper functions
- getFormatIcon(format: ExportFormat)
- getStatusDisplay(status: ExportStatus)
- getPriorityColor(priority: ExportPriority)
- formatFileSize(bytes: number)
```

### 3. hooks.ts
```typescript
// Custom hooks
- useExportFilters() - Filter state management
- useExportForm() - Form state for new exports
- useExportSections() - Section expansion state
```

### 4. FormatSelector.tsx
**Props:**
```typescript
interface FormatSelectorProps {
  value: ExportFormat;
  onChange: (format: ExportFormat) => void;
  disabled?: boolean;
  className?: string;
}
```
**Responsibility:** Format selection dropdown with icon display

### 5. ExportScheduler.tsx
**Props:**
```typescript
interface ExportSchedulerProps {
  schedule?: ExportConfig['schedule'];
  onChange: (schedule: ExportConfig['schedule']) => void;
  disabled?: boolean;
}
```
**Responsibility:** Schedule configuration (frequency, time, timezone)

### 6. CloudStorage.tsx
**Props:**
```typescript
interface CloudStorageProps {
  cloudPath?: string;
  onChange: (cloudPath: string) => void;
  provider?: 'aws' | 'azure' | 'gcp';
}
```
**Responsibility:** Cloud storage path and provider configuration

### 7. EmailDelivery.tsx
**Props:**
```typescript
interface EmailDeliveryProps {
  recipients: string[];
  onChange: (recipients: string[]) => void;
  onValidate?: (email: string) => boolean;
}
```
**Responsibility:** Email recipient management

### 8. BatchExport.tsx
**Props:**
```typescript
interface BatchExportProps {
  configs: ExportConfig[];
  onBatchStart: (configIds: string[]) => void;
  onBatchCancel: (jobIds: string[]) => void;
}
```
**Responsibility:** Bulk export operations

### 9. ExportProgress.tsx
**Props:**
```typescript
interface ExportProgressProps {
  progress: number;
  status: ExportStatus;
  estimatedCompletion?: string;
  showLabel?: boolean;
}
```
**Responsibility:** Progress bar and status visualization

### 10. ExportConfigCard.tsx
**Props:**
```typescript
interface ExportConfigCardProps {
  config: ExportConfig;
  onStart: (configId: string) => void;
  onEdit: (config: ExportConfig) => void;
  onDelete: (configId: string) => void;
}
```
**Responsibility:** Display individual export configuration

### 11. ExportJobTable.tsx
**Props:**
```typescript
interface ExportJobTableProps {
  jobs: ExportJob[];
  filters: { status: string; format: string; priority: string };
  onFilterChange: (filters: any) => void;
  onDownload: (jobId: string) => void;
  onCancel: (jobId: string) => void;
}
```
**Responsibility:** Jobs table with filtering and actions

### 12. ExportTemplateCard.tsx
**Props:**
```typescript
interface ExportTemplateCardProps {
  template: ExportTemplate;
  onUse: (template: ExportTemplate) => void;
  onDelete?: (templateId: string) => void;
}
```
**Responsibility:** Display export template

### 13. CreateExportModal.tsx
**Props:**
```typescript
interface CreateExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: Array<{ id: string; name: string; category: string }>;
  initialData?: Partial<ExportConfig>;
  onSubmit: (config: Partial<ExportConfig>) => void;
}
```
**Responsibility:** Modal dialog for creating/editing export configurations

### 14. ExportSettings.tsx
**Props:**
```typescript
interface ExportSettingsProps {
  settings: ExportConfig['settings'];
  format: ExportFormat;
  onChange: (settings: ExportConfig['settings']) => void;
}
```
**Responsibility:** Export settings form (charts, headers, page size, etc.)

## Updated Main Component Structure
```typescript
// ReportExport.tsx (~150 lines after refactoring)
const ReportExport = (props) => {
  // Minimal state
  const [activeTab, setActiveTab] = useState('configs');
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div>
      <Header />
      <Tabs />

      {activeTab === 'configs' && (
        <ConfigsTab
          configs={configs}
          ConfigCard={ExportConfigCard}
        />
      )}

      {activeTab === 'jobs' && (
        <ExportJobTable jobs={jobs} ... />
      )}

      {activeTab === 'templates' && (
        <TemplatesTab
          templates={templates}
          TemplateCard={ExportTemplateCard}
        />
      )}

      <CreateExportModal ... />
    </div>
  );
};
```

## File Structure After Refactoring
```
ReportExport/
├── index.ts                    # Barrel export
├── types.ts                    # Type definitions (~90 lines)
├── utils.ts                    # Helper functions (~70 lines)
├── hooks.ts                    # Custom hooks (~100 lines)
├── FormatSelector.tsx          # Format selection (~60 lines)
├── ExportScheduler.tsx         # Schedule config (~150 lines)
├── CloudStorage.tsx            # Cloud settings (~120 lines)
├── EmailDelivery.tsx           # Email config (~100 lines)
├── BatchExport.tsx             # Batch operations (~130 lines)
├── ExportProgress.tsx          # Progress display (~80 lines)
├── ExportConfigCard.tsx        # Config card (~100 lines)
├── ExportJobTable.tsx          # Jobs table (~180 lines)
├── ExportTemplateCard.tsx      # Template card (~90 lines)
├── CreateExportModal.tsx       # Creation modal (~280 lines)
└── ExportSettings.tsx          # Settings form (~120 lines)
```

## Quality Standards

### Component Design
- Single responsibility per component
- Clear prop interfaces with TypeScript
- Reusable across different contexts
- Proper event handler typing

### Performance
- React.memo for pure components
- useCallback for event handlers passed to children
- Avoid inline function definitions in render

### Accessibility
- Proper ARIA labels maintained
- Semantic HTML elements
- Keyboard navigation support
- Form validation feedback

### Type Safety
- Full TypeScript coverage
- Strict prop types
- No implicit any types
- Generic components where appropriate

## Timeline
- **Phase 1:** 30 minutes (Setup and shared code)
- **Phase 2:** 60 minutes (UI components)
- **Phase 3:** 45 minutes (Display components)
- **Phase 4:** 40 minutes (Feature components)
- **Phase 5:** 30 minutes (Integration and verification)
- **Total:** ~3 hours 25 minutes

## Success Criteria
- [ ] All 1,004 lines properly distributed across focused components
- [ ] No component exceeds 300 lines
- [ ] All types extracted and shared via types.ts
- [ ] All helper functions in utils.ts
- [ ] Custom hooks in hooks.ts for reusable logic
- [ ] Main ReportExport.tsx is composition-focused (~150 lines)
- [ ] Barrel export (index.ts) properly configured
- [ ] No TypeScript errors
- [ ] All accessibility features preserved
- [ ] All original functionality maintained
