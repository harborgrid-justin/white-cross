# Architecture Notes - Component Organization (U4X9R2)

## References to Other Agent Work
- T8C4M2: TypeScript architect - fixed TypeScript errors
- SF7K3W: Server function audit
- C4D9F2: Implementation work
- Multiple agents contributed to component development

## Component Organization Philosophy

### Atomic Design Principles
Following Atomic Design methodology with enterprise patterns:
- **Atoms** (ui/): Basic building blocks (Button, Input, Badge)
- **Molecules** (ui/ composites): Component combinations (InputGroup, ButtonGroup)
- **Organisms** (features/): Feature-specific complex components
- **Templates** (layouts/): Page layout templates
- **Pages** (app/ directory): Full pages with data

### Directory Structure Strategy

```
components/
├── ui/                    # Design system primitives (shadcn/Radix)
│   ├── buttons/          # Button variants
│   ├── inputs/           # Input components
│   ├── display/          # Display components (Badge, Avatar, Card)
│   ├── feedback/         # Feedback (Alert, Toast, Skeleton)
│   ├── layout/           # Layout primitives (Separator, Container)
│   ├── navigation/       # Navigation components
│   ├── overlays/         # Modal, Dialog, Popover, Tooltip
│   ├── data/             # Table, DataTable
│   ├── charts/           # Chart components
│   └── theme/            # Theme components
├── features/             # Feature-specific components (organisms)
│   ├── appointments/     # Appointment scheduling
│   ├── communication/    # Messaging & broadcasts
│   ├── health-records/   # Health records management
│   ├── medications/      # Medication administration
│   ├── incidents/        # Incident reporting
│   ├── inventory/        # Inventory management
│   ├── students/         # Student management
│   ├── settings/         # Settings pages
│   └── dashboard/        # Dashboard widgets
├── layouts/              # Layout templates
├── shared/               # Shared business components
│   ├── errors/          # Error handling components
│   ├── security/        # Security components
│   └── data/            # Data management components
└── common/              # Common utility components
```

### Component Categorization Rules

#### ui/ Components (Design System)
- **No business logic** - Pure UI components
- **Reusable across features** - Generic and flexible
- **Composable** - Can be combined to create complex UIs
- **Accessible** - WCAG AA compliant
- **Themeable** - Support light/dark modes

#### features/ Components (Feature-Specific)
- **Domain logic** - Tied to specific features
- **Data integration** - Connected to TanStack Query hooks
- **Not reusable** - Specific to one feature area
- **Complex workflows** - Multi-step user interactions

#### shared/ Components (Cross-Feature)
- **Business logic** - Shared business rules
- **Used by multiple features** - Not generic enough for ui/
- **Domain-aware** - Understand business context
- **Examples**: SessionExpiredModal, ConflictResolutionModal

#### common/ Components (Utility)
- **Generic utilities** - Not in design system
- **Frequently used** - Across many features
- **No specific domain** - Generic purpose
- **Examples**: PageHeader, StudentSelector

#### layouts/ Components (Templates)
- **Page structure** - Define page layouts
- **Reusable templates** - AppLayout, DashboardLayout
- **Composition** - Combine multiple components

### Naming Conventions

#### File Naming
- **Components**: PascalCase (e.g., `StudentCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useStudents.ts`)
- **Utils**: camelCase (e.g., `formatDate.ts`)
- **Index files**: lowercase `index.ts`

#### Component Naming
- **Be descriptive**: `AppointmentCalendar` not `Calendar`
- **Indicate type**: `StudentForm`, `StudentTable`, `StudentCard`
- **Avoid generic names** in features/: Use domain-specific names

### Index File Strategy

#### Purpose
- **Simplified imports**: `import { Button } from '@/components/ui'`
- **Encapsulation**: Hide internal structure
- **Barrel exports**: Re-export from subdirectories

#### Pattern
```typescript
// ui/index.ts
export * from './buttons'
export * from './inputs'
export * from './display'
// ... etc
```

```typescript
// features/index.ts
export * from './appointments'
export * from './communication'
// ... etc
```

### Migration Strategy

#### Phase 1: Feature Components
1. Move root-level feature directories to features/
2. Update internal imports within moved components
3. Create index.ts files for new locations
4. Update external references (if any)

#### Phase 2: UI Components
1. Categorize root-level UI components
2. Move to appropriate subdirectories
3. Update exports in subdirectory index.ts
4. Verify ui/index.ts exports correctly

#### Phase 3: Consolidation
1. Merge duplicated components
2. Remove empty directories
3. Update all imports

#### Phase 4: Documentation
1. Document new structure
2. Create import examples
3. Update CLAUDE.md guidelines

### Import Patterns

#### Recommended Patterns
```typescript
// UI components
import { Button, Input, Badge } from '@/components/ui'

// Feature components
import { AppointmentCalendar } from '@/components/features/appointments'
import { MessageInbox } from '@/components/features/communication'

// Shared components
import { SessionExpiredModal } from '@/components/shared/security'
import { GlobalErrorBoundary } from '@/components/shared/errors'

// Common components
import { PageHeader } from '@/components/common'

// Layouts
import { AppLayout } from '@/components/layouts'
```

#### Discouraged Patterns
```typescript
// ❌ Don't import from deep paths
import { Button } from '@/components/ui/buttons/Button'

// ❌ Don't bypass index files
import { AppointmentCalendar } from '@/components/features/appointments/AppointmentCalendar'

// ✅ Use barrel exports instead
import { Button } from '@/components/ui'
import { AppointmentCalendar } from '@/components/features/appointments'
```

### Accessibility Considerations

All UI components must:
- Support keyboard navigation
- Include ARIA labels where appropriate
- Maintain proper focus management
- Support screen readers
- Meet WCAG AA contrast ratios
- Respect prefers-reduced-motion

### Performance Considerations

- **Code splitting**: Features lazy-loaded
- **Tree shaking**: Barrel exports optimized
- **Bundle size**: Monitor component dependencies
- **Lazy loading**: Use dynamic imports for large components

### Testing Strategy

- **UI components**: Storybook + visual regression
- **Feature components**: Integration tests with Mock Service Worker
- **Accessibility**: Automated axe-core testing
- **Unit tests**: Colocated with components

### Maintenance Guidelines

#### When to Create New Directories
- More than 10 components in a single category
- Logical grouping improves discoverability
- Clear separation of concerns

#### When to Consolidate
- Duplicated functionality
- Similar components in different locations
- Overcomplicated directory structure

#### Continuous Improvement
- Regular audits of component organization
- Refactor as patterns emerge
- Update documentation with learnings
