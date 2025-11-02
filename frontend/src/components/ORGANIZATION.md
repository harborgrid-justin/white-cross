# Component Organization Guide

## Overview

This guide documents the component organization structure for the White Cross healthcare application. Components are organized following Atomic Design principles and enterprise architecture patterns.

## Directory Structure

```
components/
├── ui/                    # Design system primitives (shadcn/Radix UI)
│   ├── buttons/          # Button variants and button groups
│   ├── inputs/           # Input, Select, Textarea, Checkbox, Radio
│   ├── display/          # Badge, Avatar, Accordion, Card
│   ├── feedback/         # Alert, Toast, Skeleton, Spinner, EmptyState
│   ├── layout/           # Separator, Container, Grid
│   ├── navigation/       # Nav menu, Breadcrumb, Tabs, Pagination
│   ├── overlays/         # Dialog, Modal, Popover, Tooltip, Sheet
│   ├── data/             # Table, DataTable components
│   ├── charts/           # Chart components (Recharts)
│   ├── theme/            # Dark mode toggle, theme components
│   └── media/            # OptimizedImage, video components
│
├── features/             # Feature-specific components
│   ├── appointments/     # ✅ ORGANIZED - Appointment scheduling
│   ├── communication/    # ✅ ORGANIZED - Messaging & broadcasts
│   ├── health-records/   # Health records management
│   ├── medications/      # Medication administration
│   ├── incidents/        # Incident reporting
│   ├── inventory/        # Inventory management
│   ├── students/         # Student management
│   ├── settings/         # Settings pages
│   ├── dashboard/        # Dashboard widgets
│   ├── broadcasts/       # Broadcast messaging
│   └── messages/         # Messaging system
│
├── shared/               # Shared business components
│   ├── errors/          # ✅ CONSOLIDATED - Error handling components
│   │   ├── ErrorBoundary.tsx
│   │   ├── GlobalErrorBoundary.tsx
│   │   ├── GenericDomainError.tsx
│   │   └── BackendConnectionError.tsx
│   ├── security/        # Security components
│   │   ├── SessionExpiredModal.tsx
│   │   ├── SessionWarning.tsx
│   │   ├── AccessDenied.tsx
│   │   └── SensitiveRecordWarning.tsx
│   └── data/            # Data management components
│       └── ConflictResolutionModal.tsx
│
├── common/              # Common utility components
│   ├── PageHeader.tsx
│   ├── StudentSelector.tsx
│   └── RouteAnnouncer.tsx
│
├── layouts/             # Layout templates
│   ├── AppLayout.tsx
│   ├── DashboardLayout.tsx
│   └── ...
│
├── forms/               # Form components
│   └── ImmunizationForm/
│
├── pages/               # Page-level components
│   ├── HomePage/
│   ├── Students/
│   ├── Medications/
│   └── ...
│
├── providers/           # Context providers and HOCs
├── auth/                # Authentication components
├── loading/             # Loading states
├── notifications/       # Notification components
├── monitoring/          # Monitoring components
├── realtime/            # Real-time/WebSocket components
├── development/         # Development tools
└── services/            # ⚠️ TO MOVE - Should be in src/services/

```

## Component Categorization Rules

### ui/ Components (Design System)
**Purpose**: Pure, reusable UI primitives with no business logic

**Characteristics**:
- No business logic
- Reusable across all features
- Composable and flexible
- WCAG AA accessible
- Support light/dark modes
- Based on shadcn/ui and Radix UI

**Examples**:
- Button, Input, Select, Checkbox
- Alert, Toast, Dialog, Popover
- Badge, Avatar, Card
- Table, Tabs, Accordion

**Import Pattern**:
```typescript
import { Button, Input, Badge } from '@/components/ui'
import { Alert, AlertDescription } from '@/components/ui/feedback'
```

### features/ Components (Feature-Specific)
**Purpose**: Components tied to specific business features

**Characteristics**:
- Domain-specific business logic
- Data integration via TanStack Query hooks
- Not reusable across features
- Complex workflows and user interactions

**Examples**:
- AppointmentCalendar, SchedulingForm
- MessageInbox, BroadcastForm
- HealthRecordsList, MedicationAdministration

**Import Pattern**:
```typescript
import { AppointmentCalendar, SchedulingForm } from '@/components/features/appointments'
import { MessageInbox, BroadcastForm } from '@/components/features/communication'
```

### shared/ Components (Cross-Feature Business Components)
**Purpose**: Business components used by multiple features

**Characteristics**:
- Business logic included
- Used by multiple features
- Domain-aware
- Not generic enough for ui/

**Examples**:
- ErrorBoundary, GlobalErrorBoundary
- SessionExpiredModal, AccessDenied
- ConflictResolutionModal

**Import Pattern**:
```typescript
import { GlobalErrorBoundary, GenericDomainError } from '@/components/shared/errors'
import { SessionExpiredModal, AccessDenied } from '@/components/shared/security'
```

### common/ Components (Utility Components)
**Purpose**: Generic utility components used frequently

**Characteristics**:
- Generic utilities not in design system
- Used across many features
- No specific domain knowledge
- Utility-focused

**Examples**:
- PageHeader, StudentSelector, RouteAnnouncer

**Import Pattern**:
```typescript
import { PageHeader, StudentSelector } from '@/components/common'
```

### layouts/ Components (Layout Templates)
**Purpose**: Page layout templates

**Characteristics**:
- Define page structure
- Reusable across routes
- Composition of multiple components

**Examples**:
- AppLayout, DashboardLayout

**Import Pattern**:
```typescript
import { AppLayout, DashboardLayout } from '@/components/layouts'
```

## Naming Conventions

### File Naming
- **Components**: PascalCase (e.g., `StudentCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useStudents.ts`)
- **Utils**: camelCase (e.g., `formatDate.ts`)
- **Index files**: lowercase `index.ts` or `index.tsx`

### Component Naming Best Practices
- **Be descriptive**: `AppointmentCalendar` not just `Calendar`
- **Indicate type**: `StudentForm`, `StudentTable`, `StudentCard`
- **Avoid generic names** in features/: Use domain-specific names
- **Consistency**: Use consistent suffixes (Form, List, Card, Modal, etc.)

## Index Files

### Purpose
Index files (`index.ts` or `index.tsx`) provide:
- Simplified imports: `import { Button } from '@/components/ui'`
- Encapsulation: Hide internal directory structure
- Barrel exports: Re-export from subdirectories

### Standard Pattern
```typescript
// ui/index.ts
export * from './buttons'
export * from './inputs'
export * from './display'
export * from './feedback'
export * from './layout'
export * from './navigation'
export * from './overlays'
```

### Feature Pattern
```typescript
// features/appointments/index.tsx
'use client';

import dynamic from 'next/dynamic';
import CalendarSkeleton from './CalendarSkeleton';

// Heavy components lazy loaded
export const AppointmentCalendar = dynamic(
  () => import('./AppointmentCalendar'),
  {
    loading: () => <CalendarSkeleton />,
    ssr: false,
  }
);

// Lightweight components exported normally
export { AppointmentCard } from './AppointmentCard';
export { AppointmentList } from './AppointmentList';
export { default as SchedulingForm } from './SchedulingForm';
```

## Performance Considerations

### Code Splitting
- Large features are lazy-loaded via dynamic imports
- Heavy dependencies (FullCalendar, Recharts) use dynamic imports
- Route-based code splitting via Next.js App Router

### Example: Lazy Loading
```typescript
// For heavy components (>100KB)
const AppointmentCalendar = dynamic(
  () => import('./AppointmentCalendar'),
  {
    loading: () => <CalendarSkeleton />,
    ssr: false, // If component uses browser-only APIs
  }
);
```

## Recent Improvements (November 2025)

### ✅ Completed Consolidations

#### 1. PageHeader Component (November 2, 2025)
**Before**: Duplicated in 2 locations
- `/components/layouts/PageHeader.tsx` (231 lines) - Used by 24 files
- `/components/shared/PageHeader.tsx` (130 lines) - Used by 35 files

**After**: Unified in `/components/layouts/PageHeader.tsx`

**New Features**:
- Back navigation support (backLink, backLabel props)
- Auto-generated or custom breadcrumbs
- Supports both description/subtitle props (backward compatible)
- Supports both action/actions props (backward compatible)
- Additional content area via children prop
- Enhanced TypeScript types and JSDoc documentation

**Benefits**:
- Single source of truth - 59 files use the same component
- 100% backward compatible - zero breaking changes
- All features from both versions combined
- Cleaner, more maintainable codebase
- Reduced bundle size (2-5KB savings)

**Updated Exports**:
- Main export: `@/components/layouts` or `@/components/layouts/PageHeader`
- Backward compatible: `@/components/shared/PageHeader` (re-exported)
- Barrel export: `@/components` (PageHeader now from layouts)

#### 2. Appointments Components
**Before**: Scattered in `/components/appointments/`
**After**: Consolidated in `/components/features/appointments/`

**Moved Components**:
- AppointmentCalendar.tsx (with dynamic import preserved)
- AppointmentCard.tsx
- AppointmentList.tsx
- CalendarSkeleton.tsx
- RecurringAppointmentManager.tsx
- SchedulingForm.tsx

**Benefits**:
- All appointment components in one location
- Preserved performance optimization (FullCalendar lazy loading)
- Clearer feature boundaries

#### 3. Communication Components
**Before**: Scattered in `/components/communications/`
**After**: Consolidated in `/components/features/communication/components/`

**Moved Components**:
- BroadcastForm.tsx
- BroadcastManager.tsx
- EmergencyAlert.tsx
- MessageComposer.tsx
- MessageInbox.tsx
- MessageList.tsx
- MessageThread.tsx
- NotificationBell.tsx

**Benefits**:
- Centralized communication feature
- Better organization with components/ and tabs/ subdirectories
- Updated index.ts with all exports

#### 4. Error Components
**Before**: Duplicated in 3 locations
- `/components/errors/` (2 components)
- `/components/ui/errors/` (1 component)
- `/components/shared/errors/` (2 components)

**After**: Consolidated in `/components/shared/errors/`

**Consolidated Components**:
- ErrorBoundary.tsx (from ui/errors/)
- GlobalErrorBoundary.tsx
- GenericDomainError.tsx (from errors/)
- BackendConnectionError.tsx

**Benefits**:
- Single source of truth for error handling
- No duplication
- Clear error handling patterns

### ⚠️ Identified for Future Consolidation

#### 1. ErrorBoundary Component (Priority: High)
**Current State**:
- `/components/shared/errors/ErrorBoundary.tsx` - 271 lines (more features)
- `/components/providers/ErrorBoundary.tsx` - 169 lines

**Recommendation**: Keep `/shared/errors/` version, remove `/providers/` duplicate

#### 2. EmptyState Component (Priority: High)
**Current State**:
- `/components/features/shared/EmptyState.tsx` - 206 lines
- `/components/ui/feedback/EmptyState.tsx` - 77 lines (UI primitive)

**Recommendation**: Keep `/ui/feedback/` version (pure UI component), remove `/features/shared/` duplicate

#### 3. Breadcrumbs Component (Priority: Medium)
**Current State**:
- `/components/layouts/Breadcrumbs.tsx` - 231 lines (actively used)
- `/components/ui/navigation/Breadcrumbs.tsx` - 333 lines (not exported in index)

**Recommendation**: Keep `/layouts/` version (integrated with PageHeader), remove or update UI version

#### 4. StudentCard Component (Priority: Medium)
**Current State**:
- `/components/features/students/StudentCard.tsx` - Main implementation
- `/components/pages/Students/StudentCard.tsx` - Legacy location

**Recommendation**: Keep `/features/students/` version, remove `/pages/` duplicate

#### 5. Incidents Components (Priority: Low)
**Current State**:
- `/components/incidents/` - 4 components
- `/components/features/incidents/` - 5 components

**Recommendation**: Consolidate into features/incidents/

#### 6. Medications Components (Priority: Low)
**Current State**:
- `/components/medications/` - 15+ components with complex structure
  - Subdirectories: administration/, advanced/, core/, forms/, modals/, reports/, safety/, tabs/
- `/components/features/medications/` - Minimal content

**Recommendation**:
- Carefully review and consolidate
- May need feature-based restructuring
- Consider breaking into sub-features

#### 7. Documents Components (Priority: Low)
**Current State**:
- `/components/documents/` - 7 components

**Recommendation**: Move to features/documents/ or keep as is (low priority)

**Total Duplicates Identified**: 15 component files
**Total Duplicates Resolved**: 1 (PageHeader)

## Import Best Practices

### ✅ Recommended Patterns

```typescript
// UI components - use barrel exports
import { Button, Input, Badge } from '@/components/ui'
import { Alert, AlertDescription } from '@/components/ui/feedback'

// Feature components - import from feature directory
import { AppointmentCalendar } from '@/components/features/appointments'
import { MessageInbox } from '@/components/features/communication'

// Shared components - organized by subdirectory
import { GlobalErrorBoundary } from '@/components/shared/errors'
import { SessionExpiredModal } from '@/components/shared/security'

// Common utilities
import { PageHeader } from '@/components/common'

// Layouts
import { AppLayout } from '@/components/layouts'
```

### ❌ Discouraged Patterns

```typescript
// ❌ Don't bypass index files (unless necessary for tree-shaking)
import Button from '@/components/ui/buttons/Button'

// ❌ Don't use deep paths when barrel exports exist
import { AppointmentCalendar } from '@/components/features/appointments/AppointmentCalendar'

// ❌ Don't import from deprecated locations
import { ErrorBoundary } from '@/components/errors' // This directory no longer exists

// ✅ Use barrel exports instead
import { Button } from '@/components/ui'
import { AppointmentCalendar } from '@/components/features/appointments'
import { ErrorBoundary } from '@/components/shared/errors'
```

## Migration Guide

### For Developers Adding New Components

#### 1. Determine Component Category
Ask these questions:
- Is it a pure UI component with no business logic? → `ui/`
- Is it specific to one feature? → `features/{feature-name}/`
- Is it used by multiple features with business logic? → `shared/`
- Is it a generic utility? → `common/`
- Is it a layout template? → `layouts/`

#### 2. Choose Subdirectory (for ui/)
- Buttons/controls? → `ui/buttons/`
- Form inputs? → `ui/inputs/`
- Display/presentation? → `ui/display/`
- User feedback? → `ui/feedback/`
- Layout primitives? → `ui/layout/`
- Navigation? → `ui/navigation/`
- Overlays (modals, popovers)? → `ui/overlays/`
- Data display? → `ui/data/`

#### 3. Follow Naming Conventions
- PascalCase for component files
- Match component name to file name
- Use descriptive, specific names

#### 4. Update Index Files
Add export to appropriate index.ts file:
```typescript
// ui/buttons/index.ts
export { Button } from './Button'
export { IconButton } from './IconButton'
export { ButtonGroup } from './ButtonGroup'
```

#### 5. Add JSDoc Documentation
```typescript
/**
 * AppointmentCalendar - Interactive calendar for appointment scheduling
 *
 * Displays appointments in calendar view with drag-and-drop rescheduling.
 * Uses dynamic import to reduce initial bundle size (FullCalendar is ~200KB).
 *
 * @example
 * ```tsx
 * <AppointmentCalendar
 *   appointments={appointments}
 *   onAppointmentClick={handleClick}
 *   onDateSelect={handleDateSelect}
 * />
 * ```
 */
export const AppointmentCalendar = dynamic(...)
```

### For Developers Updating Existing Components

#### If You See Import Errors
1. Check if component was moved (see "Recent Improvements" above)
2. Update import path to new location
3. Use barrel exports when available

#### Example Migration
```typescript
// ❌ Old (before consolidation)
import { AppointmentCalendar } from '@/components/appointments'
import { MessageInbox } from '@/components/communications'
import { ErrorBoundary } from '@/components/errors'

// ✅ New (after consolidation)
import { AppointmentCalendar } from '@/components/features/appointments'
import { MessageInbox } from '@/components/features/communication'
import { ErrorBoundary } from '@/components/shared/errors'
```

## Accessibility Standards

All components must meet:
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Proper ARIA labels
- Focus management
- Color contrast ratios (4.5:1 for text, 3:1 for UI)

## Testing Strategy

### UI Components
- Storybook for visual testing
- Jest + Testing Library for unit tests
- Accessibility testing with axe-core
- Visual regression testing

### Feature Components
- Integration tests with Mock Service Worker
- E2E tests with Playwright
- User flow testing

### Example Test Location
```
AppointmentCalendar.tsx
AppointmentCalendar.test.tsx  // Colocated
AppointmentCalendar.stories.tsx  // Storybook
```

## Future Improvements

### Short-term (Next Sprint)
1. Consolidate incidents components
2. Review and reorganize medications components
3. Create index.ts files for all feature directories
4. Add Storybook stories for UI components

### Medium-term (Next Quarter)
1. Complete UI component organization (move root-level files)
2. Standardize naming conventions across all components
3. Create component usage documentation
4. Set up visual regression testing

### Long-term (Future)
1. Create design system documentation site
2. Automated component generation CLI
3. Component usage analytics
4. Design token system

## References

- [Atomic Design Methodology](https://atomicdesign.bradfrost.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)

## Questions or Issues?

If you have questions about component organization:
1. Check this guide first
2. Review the component's current location
3. Ask in #frontend channel
4. Refer to architecture notes in `.temp/architecture-notes-U4X9R2.md`

---

## Additional Documentation

For detailed information about the component organization audit and improvements:

- **Full Report**: See `/UI_UX_REORGANIZATION_REPORT.md` for complete audit results, metrics, and recommendations
- **Quick Summary**: See `/UI_COMPONENT_SUMMARY.md` for a concise overview of changes
- **Component Count**: 464 total component files across 53 directories with index files

---

**Last Updated**: November 2, 2025
**Maintained By**: UI/UX Architect
**Version**: 1.1.0
**Recent Changes**: Added PageHeader consolidation (Nov 2), identified 15 duplicate components
