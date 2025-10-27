# White Cross Component Library

**Production-Grade React Component Library**
**Version:** 1.0.0
**Last Updated:** 2025-10-26

This document provides comprehensive documentation for the White Cross healthcare platform's unified component library. All components are located in `nextjs/src/components` and follow enterprise architectural patterns with full TypeScript support, accessibility compliance (WCAG 2.1 AA), and healthcare-specific optimizations.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [UI Components (Design System)](#ui-components)
3. [Feature Components](#feature-components)
4. [Layout Components](#layout-components)
5. [Forms & Validation](#forms--validation)
6. [Import Patterns](#import-patterns)
7. [Component Standards](#component-standards)
8. [Accessibility Guidelines](#accessibility-guidelines)

---

## Architecture Overview

### Directory Structure

```
nextjs/src/components/
├── ui/                    # Design system components
│   ├── buttons/           # Button, BackButton, RollbackButton
│   ├── inputs/            # Input, Select, Checkbox, Radio, Switch, Textarea, DatePicker, FileUpload
│   ├── feedback/          # Alert, Toast, Progress, Skeleton, LoadingSpinner, EmptyState
│   ├── navigation/        # Tabs, Pagination, Breadcrumbs
│   ├── display/           # Badge, Avatar, StatsCard
│   ├── overlays/          # Modal, Tooltip
│   ├── layout/            # Card, Container, Grid
│   ├── data/              # Table with sorting, filtering, pagination
│   ├── charts/            # Line, Bar, Pie, Area, Donut, Gauge, HeatMap, Funnel
│   ├── media/             # OptimizedImage
│   ├── theme/             # DarkModeToggle
│   └── index.ts           # Unified exports
│
├── features/              # Domain-specific components
│   ├── students/          # Student management
│   ├── medications/       # Medication tracking
│   ├── health-records/    # Health record management
│   ├── appointments/      # Appointment scheduling
│   ├── incidents/         # Incident reporting
│   ├── communication/     # Messaging & notifications
│   ├── shared/            # Cross-domain components (DataTable, FilterPanel, ExportButton)
│   └── index.ts
│
├── layout/                # Application layouts
│   ├── AppLayout.tsx      # Main app shell
│   ├── PageContainer.tsx  # Page wrapper
│   ├── PageHeader.tsx     # Page title and actions
│   ├── Sidebar.tsx        # Navigation sidebar
│   ├── Footer.tsx         # App footer
│   └── index.ts
│
├── forms/                 # Form components and utilities
│   └── index.ts
│
├── shared/                # Shared business components
│   ├── security/          # AccessDenied, SessionExpiredModal, SensitiveRecordWarning
│   ├── errors/            # GlobalErrorBoundary, BackendConnectionError
│   └── data/              # ConflictResolutionModal
│
├── providers/             # Context providers and HOCs
│   └── ErrorBoundary.tsx
│
└── index.ts               # Master export index
```

### Design Philosophy

1. **Component Composition**: Small, focused, reusable components
2. **Single Responsibility**: Each component does one thing well
3. **Props Design**: Clear, intuitive APIs with full TypeScript types
4. **Performance**: Optimized re-renders, memoization, code splitting
5. **Type Safety**: Full TypeScript integration with no `any` types
6. **Accessibility**: WCAG 2.1 AA compliance, semantic HTML, ARIA attributes
7. **Healthcare-Optimized**: HIPAA-compliant, PHI-safe, audit logging support

---

## UI Components

### Buttons

#### `Button`
Primary button component with 11 variants, 5 sizes, loading states, and icon support.

```tsx
import { Button } from '@/components/ui/buttons';

// Basic usage
<Button onClick={handleSave}>Save</Button>

// With variants and states
<Button variant="danger" loading={isDeleting} onClick={handleDelete}>
  Delete
</Button>

// With icons
<Button variant="outline" icon={<PlusIcon />} iconPosition="left">
  Add Item
</Button>

// Full width
<Button variant="success" size="lg" fullWidth>
  Submit
</Button>
```

**Props:**
- `variant`: `'primary' | 'secondary' | 'outline' | 'outline-primary' | 'ghost' | 'link' | 'destructive' | 'danger' | 'success' | 'warning' | 'info'`
- `size`: `'xs' | 'sm' | 'md' | 'lg' | 'xl'`
- `loading`: `boolean` - Shows spinner
- `icon`: `React.ReactNode`
- `iconPosition`: `'left' | 'right'`
- `fullWidth`: `boolean`

#### `BackButton`
Navigation button with state restoration and history management.

```tsx
import { BackButton } from '@/components/ui/buttons';

<BackButton fallbackPath="/dashboard" />
```

#### `RollbackButton`
Undo button for optimistic update rollback.

```tsx
import { RollbackButton } from '@/components/ui/buttons';

<RollbackButton updateId="update-123" variant="danger" />
```

### Inputs

#### `Input`
Core text input with label, error states, and icon support.

```tsx
import { Input } from '@/components/ui/inputs';

<Input
  label="Email"
  type="email"
  placeholder="Enter email"
  required
  error={errors.email}
  helperText="We'll never share your email"
/>
```

**Props:**
- `label`: `string`
- `error`: `string` - Error message
- `helperText`: `string`
- `required`: `boolean`
- `variant`: `'default' | 'filled' | 'outlined'`
- `size`: `'sm' | 'md' | 'lg'`
- `icon`: `React.ReactNode`
- `loading`: `boolean`

#### `Select`
Dropdown select with search and multi-select support.

```tsx
import { Select } from '@/components/ui/inputs';

<Select
  label="Status"
  options={[
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]}
  value={status}
  onChange={setStatus}
/>
```

#### `Checkbox`
Checkbox input with label and indeterminate state.

```tsx
import { Checkbox } from '@/components/ui/inputs';

<Checkbox
  label="I agree to terms"
  checked={agreed}
  onChange={setAgreed}
/>
```

#### `Radio` & `RadioGroup`
Radio button inputs with group management.

```tsx
import { Radio, RadioGroup } from '@/components/ui/inputs';

<RadioGroup value={selected} onChange={setSelected}>
  <Radio value="option1" label="Option 1" />
  <Radio value="option2" label="Option 2" />
</RadioGroup>
```

#### `Switch`
Toggle switch for boolean values.

```tsx
import { Switch } from '@/components/ui/inputs';

<Switch
  label="Enable notifications"
  checked={enabled}
  onChange={setEnabled}
/>
```

#### `Textarea`
Multi-line text input with character count.

```tsx
import { Textarea } from '@/components/ui/inputs';

<Textarea
  label="Notes"
  rows={4}
  maxLength={500}
  showCharCount
/>
```

#### `DatePicker`
Date selection with calendar UI.

```tsx
import { DatePicker } from '@/components/ui/inputs';

<DatePicker
  label="Appointment Date"
  value={date}
  onChange={setDate}
  minDate={new Date()}
/>
```

#### `FileUpload`
File upload with drag-and-drop and previews.

```tsx
import { FileUpload } from '@/components/ui/inputs';

<FileUpload
  accept="image/*,.pdf"
  maxSize={5 * 1024 * 1024} // 5MB
  multiple
  onUpload={handleUpload}
/>
```

### Feedback

#### `Alert`
Contextual alert messages with variants.

```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/feedback';

<Alert variant="warning">
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>
    Please review the form before submitting.
  </AlertDescription>
</Alert>
```

**Variants:** `'info' | 'success' | 'warning' | 'error' | 'default'`

#### `Toast`
Temporary notification messages.

```tsx
import { toast } from '@/components/ui/feedback';

toast.success('Saved successfully');
toast.error('Failed to save');
toast.loading('Saving...');
```

#### `Progress`
Progress bar and circular progress indicators.

```tsx
import { Progress, CircularProgress } from '@/components/ui/feedback';

<Progress value={60} max={100} />
<CircularProgress value={75} size="lg" />
```

#### `Skeleton`
Loading placeholder skeletons.

```tsx
import { Skeleton } from '@/components/ui/feedback';

<Skeleton width="100%" height={20} />
<Skeleton circle width={40} height={40} />
```

#### `LoadingSpinner`
Animated loading spinner.

```tsx
import { LoadingSpinner } from '@/components/ui/feedback';

<LoadingSpinner size="lg" text="Loading..." />
```

#### `EmptyState`
Empty state placeholder with icon and actions.

```tsx
import { EmptyState } from '@/components/ui/feedback';

<EmptyState
  icon={<InboxIcon />}
  title="No items found"
  description="Get started by creating a new item"
  action={<Button onClick={handleCreate}>Create Item</Button>}
/>
```

### Navigation

#### `Tabs`
Tab navigation component.

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/navigation';

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="details">Details</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
  <TabsContent value="details">Details content</TabsContent>
</Tabs>
```

#### `Pagination`
Pagination controls for data lists.

```tsx
import { Pagination } from '@/components/ui/navigation';

<Pagination
  currentPage={page}
  totalPages={10}
  onPageChange={setPage}
/>
```

### Display

#### `Badge`
Status indicators and labels.

```tsx
import { Badge } from '@/components/ui/display';

<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Critical</Badge>
```

**Variants:** `'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'`

#### `Avatar`
User profile images with fallbacks and status indicators.

```tsx
import { Avatar, AvatarGroup } from '@/components/ui/display';

<Avatar
  src="/user.jpg"
  alt="John Doe"
  status="online"
  showStatus
/>

<AvatarGroup
  avatars={[
    { src: '/user1.jpg', alt: 'User 1' },
    { src: '/user2.jpg', alt: 'User 2' }
  ]}
  max={3}
/>
```

#### `StatsCard`
Dashboard statistics cards with trends.

```tsx
import { StatsCard } from '@/components/ui/display';

<StatsCard
  title="Total Students"
  value={1234}
  icon={<UsersIcon />}
  trend={{ value: 12, isPositive: true, label: 'vs last month' }}
/>
```

### Overlays

#### `Modal`
Modal dialog with composable parts.

```tsx
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle
} from '@/components/ui/overlays';

<Modal isOpen={isOpen} onClose={onClose}>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Confirm Action</ModalTitle>
    </ModalHeader>
    <ModalBody>
      Are you sure you want to continue?
    </ModalBody>
    <ModalFooter>
      <Button variant="ghost" onClick={onClose}>Cancel</Button>
      <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

#### `Tooltip`
Hover tooltips for additional information.

```tsx
import { Tooltip } from '@/components/ui/overlays';

<Tooltip content="Click to view details">
  <Button>Hover me</Button>
</Tooltip>
```

### Layout

#### `Card`
Container card component with composable sections.

```tsx
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription
} from '@/components/ui/layout';

<Card variant="elevated">
  <CardHeader divider>
    <CardTitle>Profile</CardTitle>
    <CardDescription>Manage your account</CardDescription>
  </CardHeader>
  <CardContent>
    <ProfileForm />
  </CardContent>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

**Variants:** `'default' | 'elevated' | 'outlined'`

### Data

#### `Table`
Full-featured table with sorting, filtering, and pagination.

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/data';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map(item => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.email}</TableCell>
        <TableCell><Badge>{item.status}</Badge></TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Charts

All charts use Recharts under the hood with consistent theming and accessibility.

```tsx
import {
  LineChart,
  BarChart,
  PieChart,
  AreaChart,
  DonutChart,
  GaugeChart,
  HeatMapChart,
  FunnelChart
} from '@/components/ui/charts';

<LineChart
  data={chartData}
  xKey="date"
  yKey="value"
  height={300}
/>
```

### Media

#### `OptimizedImage`
Image component with lazy loading and optimization.

```tsx
import { OptimizedImage } from '@/components/ui/media';

<OptimizedImage
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  lazy
/>
```

### Theme

#### `DarkModeToggle`
Toggle between light and dark modes.

```tsx
import { DarkModeToggle } from '@/components/ui/theme';

<DarkModeToggle />
```

---

## Feature Components

### Students

```tsx
import {
  StudentTable,
  StudentFilters,
  StudentFormModal,
  StudentDetailsModal,
  StudentHealthRecord
} from '@/components/features/students';
```

### Medications

```tsx
import {
  MedicationTable,
  MedicationFormModal,
  MedicationDetailsModal
} from '@/components/features/medications';
```

### Shared Feature Components

```tsx
import {
  DataTable,
  FilterPanel,
  ExportButton,
  BulkActionBar,
  StatusTimeline,
  AttachmentList,
  TagSelector,
  ConfirmationDialog
} from '@/components/features/shared';
```

---

## Import Patterns

### Recommended Patterns

```tsx
// Import from category indices (preferred)
import { Button, Input, Modal } from '@/components/ui';
import { StudentTable } from '@/components/features/students';

// Import from specific modules
import { Button } from '@/components/ui/buttons';
import { Input, Select } from '@/components/ui/inputs';

// Import types
import type { ButtonProps, InputProps } from '@/components/ui';
```

### Avoid

```tsx
// ❌ Don't import from implementation files
import Button from '@/components/ui/buttons/Button';

// ❌ Don't use default exports
import Button from '@/components/ui/buttons';

// ✅ Use named exports
import { Button } from '@/components/ui/buttons';
```

---

## Component Standards

### TypeScript Requirements

1. **No `any` types** - All props must be explicitly typed
2. **Props interfaces** - Export prop types for external use
3. **Generic components** - Use TypeScript generics where appropriate
4. **JSDoc comments** - Document all exported components and props
5. **Type guards** - Validate runtime types for user inputs

### Accessibility Requirements

1. **Semantic HTML** - Use appropriate HTML elements
2. **ARIA attributes** - aria-label, aria-describedby, aria-invalid, etc.
3. **Keyboard navigation** - Full keyboard support
4. **Focus management** - Visible focus indicators
5. **Screen reader support** - Announce dynamic content changes
6. **Color contrast** - WCAG 2.1 AA compliance (4.5:1 for text)

### Performance Requirements

1. **React.memo** - Memoize pure functional components
2. **useCallback** - Memoize callbacks passed to children
3. **useMemo** - Memoize expensive computations
4. **Code splitting** - Lazy load large components
5. **Optimistic updates** - Immediate UI feedback

### Healthcare-Specific Requirements

1. **PHI Protection** - No PHI in console logs, error messages, or analytics
2. **Audit logging** - Track access to sensitive data
3. **Input validation** - Validate medical data formats (NPI, ICD-10, etc.)
4. **Error handling** - User-friendly error messages
5. **Session management** - Auto-save and session timeout warnings

---

## Accessibility Guidelines

### Keyboard Navigation

All interactive components must support:
- **Tab** - Navigate between elements
- **Enter/Space** - Activate buttons and links
- **Arrow keys** - Navigate within components (tabs, selects, etc.)
- **Escape** - Close modals and dialogs

### Screen Reader Support

1. **Labels** - All form inputs must have associated labels
2. **Descriptions** - Use aria-describedby for helper text
3. **Live regions** - aria-live for dynamic content
4. **Landmarks** - Use semantic HTML5 elements
5. **Alt text** - Descriptive alt text for images

### Focus Management

1. **Focus indicators** - Visible focus rings on all interactive elements
2. **Focus trapping** - Trap focus in modals
3. **Focus restoration** - Restore focus after modal closes
4. **Skip links** - Allow skipping navigation

### Color and Contrast

1. **Text contrast** - 4.5:1 minimum for normal text
2. **Large text contrast** - 3:1 minimum for large text (18pt+)
3. **Non-text contrast** - 3:1 for UI components and graphics
4. **Color independence** - Don't rely solely on color to convey information

---

## Component Development Checklist

When creating a new component:

- [ ] Full TypeScript types with no `any`
- [ ] JSDoc documentation with examples
- [ ] Props interface exported
- [ ] Semantic HTML structure
- [ ] ARIA attributes for accessibility
- [ ] Keyboard navigation support
- [ ] Focus management
- [ ] Dark mode support
- [ ] Responsive design
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Storybook story
- [ ] Unit tests (React Testing Library)
- [ ] Integration tests for complex components
- [ ] Performance optimization (memo, callbacks)
- [ ] Healthcare compliance (PHI protection)

---

## Conclusion

This component library represents a production-grade, enterprise-quality design system optimized for healthcare applications. All components follow strict TypeScript, accessibility, and performance standards while maintaining healthcare-specific compliance requirements.

For questions or contributions, please refer to the component source code with inline JSDoc documentation.

**Component Count:** 80+ components
**TypeScript Coverage:** 100%
**Accessibility:** WCAG 2.1 AA
**Healthcare Compliance:** HIPAA-ready

