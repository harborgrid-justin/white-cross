# White Cross Component Index

**Complete Component Library Reference**
**Location:** `nextjs/src/components/`
**Total Components:** 80+

---

## Quick Navigation

- [UI Components](#ui-components) (50+ components)
  - [Buttons](#buttons)
  - [Inputs](#inputs)
  - [Feedback](#feedback)
  - [Navigation](#navigation)
  - [Display](#display)
  - [Overlays](#overlays)
  - [Layout](#layout)
  - [Data](#data)
  - [Charts](#charts)
  - [Media](#media)
  - [Theme](#theme)
- [Feature Components](#feature-components) (30+ components)
- [Layout Components](#layout-components) (6 components)
- [Shared Components](#shared-components) (8 components)

---

## UI Components

### Buttons

**Location:** `nextjs/src/components/ui/buttons/`

| Component | File | Props | Description |
|-----------|------|-------|-------------|
| `Button` | `Button.tsx` | `ButtonProps` | Primary button with 11 variants, 5 sizes, loading, icons |
| `BackButton` | `BackButton.tsx` | `BackButtonProps` | Navigation back button with state restoration |
| `RollbackButton` | `RollbackButton.tsx` | `RollbackButtonProps` | Optimistic update undo button |
| `BatchRollbackButton` | `RollbackButton.tsx` | `BatchRollbackButtonProps` | Batch optimistic update undo |

**Import:**
```tsx
import { Button, BackButton, RollbackButton } from '@/components/ui/buttons';
```

**Variants:** primary, secondary, outline, outline-primary, ghost, link, destructive, danger, success, warning, info

**Sizes:** xs, sm, md, lg, xl

---

### Inputs

**Location:** `nextjs/src/components/ui/inputs/`

| Component | File | Props | Description |
|-----------|------|-------|-------------|
| `Input` | `Input.tsx` | `InputProps` | Text input with label, error, icon, loading |
| `Textarea` | `Textarea.tsx` | `TextareaProps` | Multi-line text with character count |
| `Select` | `Select.tsx` | `SelectProps` | Dropdown select with search, multi-select |
| `Checkbox` | `Checkbox.tsx` | `CheckboxProps` | Checkbox with indeterminate state |
| `Radio` | `Radio.tsx` | `RadioProps` | Single radio button |
| `RadioGroup` | `Radio.tsx` | `RadioGroupProps` | Radio button group container |
| `Switch` | `Switch.tsx` | `SwitchProps` | Toggle switch for booleans |
| `SearchInput` | `SearchInput.tsx` | - | Search input with icon |
| `DatePicker` | `DatePicker.tsx` | `DatePickerProps` | Date picker with calendar |
| `FileUpload` | `FileUpload.tsx` | `FileUploadProps` | File upload with drag-and-drop |

**Import:**
```tsx
import { Input, Select, Checkbox, DatePicker } from '@/components/ui/inputs';
```

**Input Variants:** default, filled, outlined

**Input Sizes:** sm, md, lg

---

### Feedback

**Location:** `nextjs/src/components/ui/feedback/`

| Component | File | Props | Description |
|-----------|------|-------|-------------|
| `Alert` | `Alert.tsx` | `AlertProps` | Contextual alert messages |
| `AlertTitle` | `Alert.tsx` | `AlertTitleProps` | Alert title component |
| `AlertDescription` | `Alert.tsx` | `AlertDescriptionProps` | Alert description component |
| `AlertBanner` | `AlertBanner.tsx` | - | Page-level alert banner |
| `Toast` | `Toast.tsx` | `ToastProps` | Temporary notification toast |
| `ToastProvider` | `Toast.tsx` | - | Toast context provider |
| `Progress` | `Progress.tsx` | `ProgressProps` | Linear progress bar |
| `CircularProgress` | `Progress.tsx` | `ProgressProps` | Circular progress indicator |
| `Skeleton` | `Skeleton.tsx` | `SkeletonProps` | Loading placeholder skeleton |
| `LoadingSpinner` | `LoadingSpinner.tsx` | - | Animated loading spinner |
| `EmptyState` | `EmptyState.tsx` | `EmptyStateProps` | Empty state placeholder |
| `OptimisticUpdateIndicator` | `OptimisticUpdateIndicator.tsx` | - | Optimistic update feedback |
| `UpdateToast` | `UpdateToast.tsx` | - | Update notification toast |

**Import:**
```tsx
import { Alert, Toast, Progress, LoadingSpinner } from '@/components/ui/feedback';
```

**Alert Variants:** info, success, warning, error, default

**Toast Functions:** `toast.success()`, `toast.error()`, `toast.loading()`, `toast.info()`

---

### Navigation

**Location:** `nextjs/src/components/ui/navigation/`

| Component | File | Props | Description |
|-----------|------|-------|-------------|
| `Tabs` | `Tabs.tsx` | `TabsProps` | Tab navigation container |
| `TabsList` | `Tabs.tsx` | `TabsListProps` | Tab list wrapper |
| `TabsTrigger` | `Tabs.tsx` | `TabsTriggerProps` | Individual tab button |
| `TabsContent` | `Tabs.tsx` | `TabsContentProps` | Tab content panel |
| `TabNavigation` | `TabNavigation.tsx` | - | Legacy tab navigation |
| `Pagination` | `Pagination.tsx` | `PaginationProps` | Page navigation controls |
| `Breadcrumbs` | `Breadcrumbs.tsx` | - | Navigation breadcrumbs |

**Import:**
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent, Pagination } from '@/components/ui/navigation';
```

---

### Display

**Location:** `nextjs/src/components/ui/display/`

| Component | File | Props | Description |
|-----------|------|-------|-------------|
| `Badge` | `Badge.tsx` | `BadgeProps` | Status indicator badge |
| `Avatar` | `Avatar.tsx` | `AvatarProps` | User profile image |
| `AvatarGroup` | `Avatar.tsx` | - | Multiple overlapping avatars |
| `StatsCard` | `StatsCard.tsx` | `StatsCardProps` | Dashboard statistics card |

**Import:**
```tsx
import { Badge, Avatar, AvatarGroup, StatsCard } from '@/components/ui/display';
```

**Badge Variants:** default, primary, secondary, success, warning, danger, info

**Avatar Status:** online, offline, away, busy

---

### Overlays

**Location:** `nextjs/src/components/ui/overlays/`

| Component | File | Props | Description |
|-----------|------|-------|-------------|
| `Modal` | `Modal.tsx` | `ModalProps` | Modal dialog container |
| `ModalContent` | `Modal.tsx` | `ModalContentProps` | Modal content wrapper |
| `ModalHeader` | `Modal.tsx` | `ModalHeaderProps` | Modal header section |
| `ModalBody` | `Modal.tsx` | `ModalBodyProps` | Modal body content |
| `ModalFooter` | `Modal.tsx` | `ModalFooterProps` | Modal footer with actions |
| `ModalTitle` | `Modal.tsx` | `ModalTitleProps` | Modal title heading |
| `Tooltip` | `Tooltip.tsx` | `TooltipProps` | Hover tooltip |

**Import:**
```tsx
import { Modal, ModalContent, ModalHeader, Tooltip } from '@/components/ui/overlays';
```

**Modal Sizes:** sm, md, lg, xl, full

**Tooltip Positions:** top, bottom, left, right

---

### Layout

**Location:** `nextjs/src/components/ui/layout/`

| Component | File | Props | Description |
|-----------|------|-------|-------------|
| `Card` | `Card.tsx` | `CardProps` | Container card component |
| `CardHeader` | `Card.tsx` | `CardHeaderProps` | Card header section |
| `CardContent` | `Card.tsx` | `CardContentProps` | Card main content |
| `CardFooter` | `Card.tsx` | `CardFooterProps` | Card footer section |
| `CardTitle` | `Card.tsx` | - | Card title heading |
| `CardDescription` | `Card.tsx` | - | Card subtitle text |

**Import:**
```tsx
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/layout';
```

**Card Variants:** default, elevated, outlined

---

### Data

**Location:** `nextjs/src/components/ui/data/`

| Component | File | Props | Description |
|-----------|------|-------|-------------|
| `Table` | `Table.tsx` | `TableProps` | Table container |
| `TableHeader` | `Table.tsx` | `TableHeaderProps` | Table header |
| `TableBody` | `Table.tsx` | `TableBodyProps` | Table body |
| `TableRow` | `Table.tsx` | `TableRowProps` | Table row |
| `TableHead` | `Table.tsx` | `TableHeadProps` | Table header cell |
| `TableCell` | `Table.tsx` | `TableCellProps` | Table data cell |
| `TableCaption` | `Table.tsx` | `TableCaptionProps` | Table caption |
| `TableEmptyState` | `Table.tsx` | - | Table empty state |
| `TableLoadingState` | `Table.tsx` | - | Table loading state |

**Import:**
```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/data';
```

**Features:** Sorting, filtering, pagination, selection, expandable rows

---

### Charts

**Location:** `nextjs/src/components/ui/charts/`

| Component | File | Props | Description |
|-----------|------|-------|-------------|
| `LineChart` | `LineChart.tsx` | `LineChartProps` | Line chart visualization |
| `BarChart` | `BarChart.tsx` | `BarChartProps` | Bar chart visualization |
| `PieChart` | `PieChart.tsx` | `PieChartProps` | Pie chart visualization |
| `AreaChart` | `AreaChart.tsx` | `AreaChartProps` | Area chart visualization |
| `DonutChart` | `DonutChart.tsx` | `DonutChartProps` | Donut chart visualization |
| `GaugeChart` | `GaugeChart.tsx` | - | Gauge/meter visualization |
| `HeatMapChart` | `HeatMapChart.tsx` | - | Heat map visualization |
| `FunnelChart` | `FunnelChart.tsx` | - | Funnel chart visualization |
| `MultiSeriesLineChart` | `MultiSeriesLineChart.tsx` | - | Multi-series line chart |
| `StackedBarChart` | `StackedBarChart.tsx` | - | Stacked bar chart |

**Import:**
```tsx
import { LineChart, BarChart, PieChart } from '@/components/ui/charts';
```

**Library:** Recharts

**Features:** Responsive, tooltips, legends, animations, dark mode

---

### Media

**Location:** `nextjs/src/components/ui/media/`

| Component | File | Props | Description |
|-----------|------|-------|-------------|
| `OptimizedImage` | `OptimizedImage.tsx` | - | Lazy-loaded optimized image |

**Import:**
```tsx
import { OptimizedImage } from '@/components/ui/media';
```

**Features:** Lazy loading, responsive images, Next.js Image integration

---

### Theme

**Location:** `nextjs/src/components/ui/theme/`

| Component | File | Props | Description |
|-----------|------|-------|-------------|
| `DarkModeToggle` | `DarkModeToggle.tsx` | - | Dark mode theme toggle |

**Import:**
```tsx
import { DarkModeToggle } from '@/components/ui/theme';
```

---

## Feature Components

### Students

**Location:** `nextjs/src/components/features/students/`

| Component | Type | Description |
|-----------|------|-------------|
| `StudentTable` | Table | Student data table with sorting |
| `StudentFilters` | Filter | Student filter panel |
| `StudentPagination` | Navigation | Student pagination controls |
| `StudentFormModal` | Modal | Student creation/edit modal |
| `StudentDetailsModal` | Modal | Student details view modal |
| `EmergencyContactModal` | Modal | Emergency contact modal |
| `ExportModal` | Modal | Student data export modal |
| `PHIWarningModal` | Modal | PHI access warning modal |
| `ConfirmArchiveModal` | Modal | Archive confirmation modal |
| `StudentFormFields` | Form | Student form field components |
| `StudentHealthRecord` | Display | Student health record summary |
| `StudentSelector` | Input | Student selection component |

**Import:**
```tsx
import { StudentTable, StudentFormModal } from '@/components/features/students';
```

---

### Medications

**Location:** `nextjs/src/components/features/medications/` and `nextjs/src/components/medications/`

| Component | Type | Description |
|-----------|------|-------------|
| `MedicationsOverviewTab` | Tab | Medications overview dashboard |
| `MedicationsListTab` | Tab | Medication list view |
| `MedicationsInventoryTab` | Tab | Medication inventory tracking |
| `MedicationsRemindersTab` | Tab | Medication reminders |
| `MedicationsAdverseReactionsTab` | Tab | Adverse reaction tracking |
| `MedicationFormModal` | Modal | Medication entry/edit modal |
| `MedicationDetailsModal` | Modal | Medication details view |
| `MedicationCard` | Card | Medication summary card |

**Import:**
```tsx
import { MedicationFormModal } from '@/components/features/medications';
```

---

### Health Records

**Location:** `nextjs/src/components/features/health-records/`

| Component | Type | Description |
|-----------|------|-------------|
| `OverviewTab` | Tab | Health records overview |
| `AllergiesTab` | Tab | Allergy tracking |
| `VaccinationsTab` | Tab | Vaccination records |
| `ScreeningsTab` | Tab | Health screenings |
| `VitalsTab` | Tab | Vital signs tracking |
| `ChronicConditionsTab` | Tab | Chronic condition management |
| `GrowthChartsTab` | Tab | Growth chart visualization |
| `AnalyticsTab` | Tab | Health analytics dashboard |
| `CarePlanModal` | Modal | Care plan creation/edit |
| `DetailsModal` | Modal | Health record details |
| `ConfirmationModal` | Modal | Action confirmation |
| `TabNavigation` | Navigation | Health record tab navigation |
| `StatsCard` | Display | Health statistics card |
| `ActionButtons` | Actions | Common action buttons |

**Import:**
```tsx
import { OverviewTab, AllergiesTab } from '@/components/features/health-records';
```

---

### Shared Feature Components

**Location:** `nextjs/src/components/features/shared/`

| Component | Type | Description |
|-----------|------|-------------|
| `DataTable` | Table | Advanced data table with features |
| `FilterPanel` | Filter | Dynamic filter panel |
| `ExportButton` | Button | Data export button (CSV, PDF, Excel) |
| `BulkActionBar` | Actions | Bulk action toolbar |
| `EmptyState` | Feedback | Feature-specific empty state |
| `ErrorState` | Feedback | Feature-specific error state |
| `ConfirmationDialog` | Modal | Confirmation dialog |
| `StatusTimeline` | Display | Status change timeline |
| `AttachmentList` | List | File attachment list |
| `TagSelector` | Input | Tag selection/management |

**Import:**
```tsx
import { DataTable, FilterPanel, ExportButton } from '@/components/features/shared';
```

---

## Layout Components

**Location:** `nextjs/src/components/layout/`

| Component | File | Description |
|-----------|------|-------------|
| `AppLayout` | `AppLayout.tsx` | Main application shell with sidebar, header, footer |
| `PageContainer` | `PageContainer.tsx` | Page content wrapper with padding |
| `PageHeader` | `PageHeader.tsx` | Page title, breadcrumbs, actions |
| `Sidebar` | `Sidebar.tsx` | Navigation sidebar with menu items |
| `Footer` | `Footer.tsx` | Application footer |
| `Breadcrumbs` | `Breadcrumbs.tsx` | Navigation breadcrumbs |
| `Navigation` | `Navigation.tsx` | Main navigation component |
| `NotificationCenter` | `NotificationCenter.tsx` | Notification center panel |
| `SearchBar` | `SearchBar.tsx` | Global search bar |

**Import:**
```tsx
import { AppLayout, PageContainer, PageHeader } from '@/components/layout';
```

---

## Shared Components

### Security

**Location:** `nextjs/src/components/shared/security/`

| Component | Description |
|-----------|-------------|
| `AccessDenied` | Access denied error page |
| `SessionExpiredModal` | Session expiration modal |
| `SensitiveRecordWarning` | PHI access warning |
| `SessionWarning` | Session timeout warning |

**Import:**
```tsx
import { AccessDenied, SessionExpiredModal } from '@/components/shared/security';
```

---

### Errors

**Location:** `nextjs/src/components/shared/errors/`

| Component | Description |
|-----------|-------------|
| `GlobalErrorBoundary` | Global error boundary |
| `BackendConnectionError` | Backend connection error display |

**Import:**
```tsx
import { GlobalErrorBoundary, BackendConnectionError } from '@/components/shared/errors';
```

---

### Data

**Location:** `nextjs/src/components/shared/data/`

| Component | Description |
|-----------|-------------|
| `ConflictResolutionModal` | Data conflict resolution modal |

**Import:**
```tsx
import { ConflictResolutionModal } from '@/components/shared/data';
```

---

### Providers

**Location:** `nextjs/src/components/providers/`

| Component | Description |
|-----------|-------------|
| `ErrorBoundary` | React error boundary HOC |

**Import:**
```tsx
import { ErrorBoundary } from '@/components/providers';
```

---

## Import Quick Reference

```tsx
// UI Components (most common)
import {
  Button,
  Input,
  Select,
  Modal,
  Toast,
  LoadingSpinner
} from '@/components/ui';

// Feature Components
import { StudentTable, StudentFormModal } from '@/components/features/students';
import { DataTable, FilterPanel } from '@/components/features/shared';

// Layout
import { AppLayout, PageContainer } from '@/components/layout';

// Shared
import { AccessDenied, SessionExpiredModal } from '@/components/shared/security';
import { ErrorBoundary } from '@/components/providers';
```

---

## Component Count Summary

| Category | Count | Description |
|----------|-------|-------------|
| **UI Components** | **50+** | Design system components |
| - Buttons | 4 | Interactive buttons |
| - Inputs | 10 | Form input controls |
| - Feedback | 13 | User feedback components |
| - Navigation | 7 | Navigation components |
| - Display | 4 | Display components |
| - Overlays | 7 | Modal and tooltip components |
| - Layout | 6 | Layout containers |
| - Data | 9 | Data table components |
| - Charts | 10 | Chart visualizations |
| - Media | 1 | Image components |
| - Theme | 1 | Theme controls |
| **Feature Components** | **30+** | Domain-specific components |
| - Students | 12 | Student management |
| - Medications | 8 | Medication tracking |
| - Health Records | 14 | Health record management |
| - Shared | 10 | Cross-domain components |
| **Layout Components** | **9** | Application layouts |
| **Shared Components** | **8** | Security, errors, data |
| **TOTAL** | **80+** | Production components |

---

## File Locations

### Main Exports
- `nextjs/src/components/index.ts` - Master index
- `nextjs/src/components/ui/index.ts` - UI components index

### Documentation
- `nextjs/COMPONENT_LIBRARY.md` - Component library guide
- `nextjs/COMPONENT_MIGRATION_SUMMARY.md` - Migration summary
- `nextjs/COMPONENT_INDEX.md` - This file

---

**Last Updated:** 2025-10-26
**Component Count:** 80+
**Status:** Production Ready ✅

