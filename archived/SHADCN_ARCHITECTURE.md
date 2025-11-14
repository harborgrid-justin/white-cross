# Shadcn UI Architecture Documentation

## Overview

This document describes the UI component architecture for the White Cross healthcare platform, which uses a hybrid approach combining standard **shadcn/ui** components with custom enhanced components.

## Component Structure

### Root-Level Shadcn Components (`/src/components/ui/*.tsx`)

**Location:** `/src/components/ui/`
**Naming Convention:** kebab-case (e.g., `button.tsx`, `alert-dialog.tsx`, `input.tsx`)
**Purpose:** Standard shadcn/ui components following official patterns

These are **pure shadcn/ui components** that:
- Use Radix UI primitives where applicable
- Follow class-variance-authority (cva) patterns for variants
- Use the `cn` utility from `@/lib/utils` for className merging
- Follow shadcn/ui naming conventions (kebab-case)
- Are Server Components by default (unless marked with `"use client"`)

**Total Count:** 57 shadcn components

**Key shadcn Components:**
- `accordion.tsx` - Collapsible content panels (Radix UI)
- `alert-dialog.tsx` - Modal dialogs for important actions (Radix UI)
- `alert.tsx` - Notification alerts with variants (cva)
- `aspect-ratio.tsx` - Container for maintaining aspect ratios (Radix UI)
- `avatar.tsx` - User profile images with fallbacks (Radix UI)
- `badge.tsx` - Status indicators and labels (cva)
- `breadcrumb.tsx` - Navigation breadcrumbs
- `button.tsx` - Primary action buttons (Radix UI Slot, cva)
- `calendar.tsx` - Date picker calendar (Radix UI, date-fns)
- `card.tsx` - Container component with composable parts
- `carousel.tsx` - Image/content carousel with navigation
- `chart.tsx` - Recharts integration for data visualization
- `checkbox.tsx` - Form checkbox input (Radix UI)
- `collapsible.tsx` - Expandable content sections (Radix UI)
- `command.tsx` - Command palette/search interface (cmdk)
- `context-menu.tsx` - Right-click context menus (Radix UI)
- `dialog.tsx` - Modal dialogs (Radix UI)
- `drawer.tsx` - Side drawer overlays (vaul)
- `dropdown-menu.tsx` - Dropdown menus (Radix UI)
- `form.tsx` - Form components (React Hook Form)
- `hover-card.tsx` - Hoverable cards with content (Radix UI)
- `input.tsx` - Text input field
- `input-group.tsx` - Input with addons/icons
- `input-otp.tsx` - OTP input fields
- `label.tsx` - Form field labels (Radix UI)
- `menubar.tsx` - Menu bar navigation (Radix UI)
- `navigation-menu.tsx` - Navigation menus (Radix UI)
- `pagination.tsx` - Page navigation controls
- `popover.tsx` - Floating content popovers (Radix UI)
- `progress.tsx` - Progress bars (Radix UI)
- `radio-group.tsx` - Radio button groups (Radix UI)
- `scroll-area.tsx` - Custom scrollable areas (Radix UI)
- `select.tsx` - Select dropdowns (Radix UI)
- `separator.tsx` - Visual dividers (Radix UI)
- `sheet.tsx` - Side sheets/panels (Radix UI Dialog)
- `sidebar.tsx` - Application sidebar navigation
- `skeleton.tsx` - Loading placeholder skeletons
- `slider.tsx` - Range slider inputs (Radix UI)
- `switch.tsx` - Toggle switches (Radix UI)
- `table.tsx` - Data tables with semantic HTML
- `tabs.tsx` - Tabbed interfaces (Radix UI)
- `textarea.tsx` - Multi-line text input
- `toggle.tsx` - Toggle buttons (Radix UI)
- `toggle-group.tsx` - Toggle button groups (Radix UI)
- `tooltip.tsx` - Hover tooltips (Radix UI)

### Custom Component Subdirectories

**Location:** `/src/components/ui/*/`
**Purpose:** Enhanced custom components with additional features beyond shadcn defaults

These directories contain **custom implementations** with extended functionality:

#### `/buttons/` - Button Variants
- `Button.tsx` - Enhanced button with loading states, icons, variants
- `BackButton.tsx` - Navigation back button with history management
- `RollbackButton.tsx` - Optimistic update rollback functionality
- `Button.test.tsx` & `Button.stories.tsx` - Tests and Storybook stories

#### `/inputs/` - Form Input Components
- `Input.tsx` - Enhanced input with labels, errors, helper text
- `Textarea.tsx` - Multi-line input with validation
- `Select.tsx` - Custom select with search and filtering
- `Checkbox.tsx` - Enhanced checkbox with descriptions
- `Radio.tsx` & `RadioGroup` - Radio button components
- `Switch.tsx` - Toggle switch with labels
- `DatePicker.tsx` - Date picker with calendar
- `TimePicker.tsx` - Time selection input
- `FileUpload.tsx` - File upload with preview and validation
- `Combobox.tsx` - Searchable select/autocomplete
- `SearchInput.tsx` - Debounced search input
- `Label.tsx` - Form field labels
- `Form.tsx` - Form wrapper with validation

#### `/layout/` - Layout Components
- `Card.tsx` - Enhanced card with more variants and features
- `Card.stories.tsx` - Storybook stories for Card
- `Separator.tsx` - Divider component

#### `/feedback/` - User Feedback Components
- `Alert.tsx` - Alert/notification component
- `AlertBanner.tsx` - Full-width alert banners
- `EmptyState.tsx` - Empty state placeholders
- `LoadingSpinner.tsx` - Loading indicators
- `Progress.tsx` & `CircularProgress` - Progress indicators
- `Skeleton.tsx` - Loading skeletons
- `Toast.tsx` - Toast notifications with provider
- `UpdateToast.tsx` - Optimistic update toasts
- `OptimisticUpdateIndicator.tsx` - Update status indicators

#### `/overlays/` - Modal & Overlay Components
- `Modal.tsx` - Enhanced modal with composable parts
- `Drawer.tsx` - Side drawer with positions and sizes
- `Sheet.tsx` - Sheet component with variants
- `Popover.tsx` - Popover with positioning
- `Tooltip.tsx` - Tooltip component
- `Modal.test.tsx` & `Modal.stories.tsx` - Tests and stories

#### `/display/` - Display Components
- `Badge.tsx` - Enhanced badge with dot mode, sizes, shapes
- `Avatar.tsx` & `AvatarGroup` - User avatars with status
- `StatsCard.tsx` - Dashboard statistics cards
- `Accordion.tsx` - Collapsible sections
- `Badge.stories.tsx` - Storybook stories

#### `/navigation/` - Navigation Components
- `Breadcrumbs.tsx` - Navigation breadcrumbs
- `Tabs.tsx` - Tabbed navigation
- `Pagination.tsx` - Page navigation
- `DropdownMenu.tsx` - Dropdown menus
- `CommandPalette.tsx` - Command/search palette

#### `/data/` - Data Display Components
- `Table.tsx` - Data table component

#### `/charts/` - Chart Components
- `AreaChart.tsx`, `BarChart.tsx`, `LineChart.tsx`
- `PieChart.tsx`, `DonutChart.tsx`
- `StackedBarChart.tsx`, `MultiSeriesLineChart.tsx`
- `HeatMapChart.tsx`, `FunnelChart.tsx`, `GaugeChart.tsx`
- `ChartSkeleton.tsx`

#### `/loading/` - Loading States
- `FormSkeleton.tsx` - Form loading placeholder
- `ModalSkeleton.tsx` - Modal loading placeholder
- `SkeletonCard.tsx` - Card loading placeholder

#### `/media/` - Media Components
- `OptimizedImage.tsx` - Next.js Image with optimizations

#### `/errors/` - Error Components
- `ErrorBoundary.tsx` - React error boundary

#### `/theme/` - Theme Components
- `DarkModeToggle.tsx` - Dark/light mode toggle

## Import Patterns

### Best Practices

**✅ RECOMMENDED:** Import from shadcn root components directly
```typescript
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
```

**✅ ALTERNATIVE:** Import custom enhanced components from subdirectories
```typescript
import { Button } from '@/components/ui/buttons';
import { Input } from '@/components/ui/inputs';
import { Modal } from '@/components/ui/overlays';
```

**⚠️ USE WITH CAUTION:** Import from barrel export (may increase bundle size)
```typescript
import { Button, Input, Card } from '@/components/ui';
```

### Current Export Strategy

The `/src/components/ui/index.ts` file exports custom components from subdirectories for convenience. This is intentional to support the legacy custom component architecture while maintaining shadcn components in the root.

## Shadcn Configuration

**Configuration File:** `components.json`

```json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

## Styling Patterns

### Class Variance Authority (CVA)

Shadcn components use `class-variance-authority` for type-safe variant management:

```typescript
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3",
        lg: "h-10 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### CN Utility

All shadcn components use the `cn` utility for merging Tailwind classes:

```typescript
import { cn } from "@/lib/utils";

// Merges classes with proper precedence
className={cn("base-classes", variantClasses, props.className)}
```

**Implementation** (`/src/lib/utils.ts`):
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Component Composition Patterns

### Compound Components

Shadcn components follow compound component patterns for flexibility:

```typescript
// Card composition
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>

// Dialog composition
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    Content
    <DialogFooter>
      <Button>Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### asChild Pattern (Radix UI Slot)

Many shadcn components support the `asChild` prop to merge props with a child element:

```typescript
// Renders as an anchor tag with button styling
<Button asChild>
  <a href="/dashboard">Dashboard</a>
</Button>
```

## TypeScript Support

All shadcn components are fully typed with:
- TypeScript interfaces for props
- Generic type parameters where applicable
- Exported variant types from CVA
- Proper ref forwarding types

```typescript
// Example: Button component types
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Implementation
  }
);
```

## Accessibility (A11y)

Shadcn components are built on Radix UI primitives which provide:
- Proper ARIA attributes
- Keyboard navigation
- Focus management
- Screen reader support
- Role and semantic HTML

**Example accessibility features:**
- Dialogs trap focus and close on Escape
- Dropdowns support arrow key navigation
- Form inputs have associated labels
- Tooltips appear on hover and focus
- Accordions use proper ARIA expansion states

## Dark Mode Support

All shadcn components support dark mode via CSS variables defined in `globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  /* ... */
}
```

Components reference these variables via Tailwind classes:
- `bg-background`, `text-foreground`
- `bg-primary`, `text-primary-foreground`
- `bg-card`, `text-card-foreground`

## Server vs Client Components

**Default:** Shadcn components are Server Components (Next.js 13+ App Router)

**Client Components** (marked with `"use client"`):
- `accordion.tsx` - Uses state for expansion
- `alert-dialog.tsx` - Interactive dialogs
- `calendar.tsx` - Interactive date selection
- `carousel.tsx` - Interactive slides
- `checkbox.tsx` - Interactive form input
- `collapsible.tsx` - Toggleable content
- `command.tsx` - Interactive command palette
- `context-menu.tsx` - Event handlers
- `dialog.tsx` - Interactive modals
- `drawer.tsx` - Interactive drawers
- `dropdown-menu.tsx` - Interactive menus
- `hover-card.tsx` - Interactive hover states
- `menubar.tsx` - Interactive navigation
- `navigation-menu.tsx` - Interactive navigation
- `popover.tsx` - Interactive popovers
- `radio-group.tsx` - Interactive form input
- `scroll-area.tsx` - Interactive scrolling
- `select.tsx` - Interactive selection
- `slider.tsx` - Interactive range input
- `switch.tsx` - Interactive toggle
- `tabs.tsx` - Interactive tab switching
- `toggle.tsx` - Interactive toggle buttons
- `toggle-group.tsx` - Interactive toggle groups
- `tooltip.tsx` - Interactive tooltips

## Recent Changes (2025-11-02)

### Naming Standardization

All root-level shadcn components were renamed from PascalCase to kebab-case to follow official shadcn/ui conventions:

**Before:**
- `Alert.tsx`, `Avatar.tsx`, `Badge.tsx`, `Button.tsx`, `Card.tsx`, etc.

**After:**
- `alert.tsx`, `avatar.tsx`, `badge.tsx`, `button.tsx`, `card.tsx`, etc.

**Impact:**
- ✅ 18 components renamed to kebab-case
- ✅ All imports updated across the codebase
- ✅ Consistent with shadcn/ui CLI expectations
- ✅ Better compatibility with shadcn component updates

### Duplicate Directory Removed

**Removed:** `/src/components/ui/Inputs/` (uppercase)
**Kept:** `/src/components/ui/inputs/` (lowercase)
**Reason:** Duplicate directory with identical DatePicker.tsx file

### Import Updates

All imports referencing renamed components were updated:

```diff
- import { Badge } from '@/components/ui/Badge';
+ import { Badge } from '@/components/ui/badge';

- import { Card, CardHeader } from '@/components/ui/Card';
+ import { Card, CardHeader } from '@/components/ui/card';

- import { Button } from '@/components/ui/Button';
+ import { Button } from '@/components/ui/button';
```

**Files updated:** 20+ files across the `app/` directory

## Migration Guide

### Adding New Shadcn Components

Use the shadcn CLI to add new components:

```bash
npx shadcn@latest add <component-name>
```

This will:
1. Download the component to `src/components/ui/<component-name>.tsx`
2. Install required dependencies
3. Follow the kebab-case naming convention
4. Use the configured aliases from `components.json`

**Example:**
```bash
npx shadcn@latest add dropdown-menu
npx shadcn@latest add data-table
npx shadcn@latest add sonner
```

### Updating Existing Shadcn Components

```bash
npx shadcn@latest add <component-name> --overwrite
```

### Using Custom Components

If you need custom functionality beyond shadcn defaults:

1. **Check subdirectories first** - A custom version may already exist
2. **Extend shadcn component** - Import the shadcn component and add features
3. **Use composition** - Wrap shadcn components with custom logic

**Example: Extending shadcn button**
```typescript
// Custom loading button extending shadcn
import { Button, ButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
}

export function LoadingButton({ loading, children, ...props }: LoadingButtonProps) {
  return (
    <Button disabled={loading} {...props}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
```

## Best Practices

1. **Use shadcn root components** when possible for standard UI needs
2. **Use custom subdirectory components** when you need enhanced features
3. **Follow kebab-case** for all new shadcn components
4. **Import directly** from component files for better tree-shaking
5. **Use TypeScript** for all component props and variants
6. **Maintain accessibility** by preserving ARIA attributes
7. **Test dark mode** when modifying components
8. **Document custom components** with JSDoc and examples
9. **Keep shadcn components vanilla** - don't modify them directly
10. **Update via CLI** to get latest shadcn improvements

## Architecture Diagram

```
src/components/ui/
├── accordion.tsx                 # ✅ Shadcn (Radix UI)
├── alert-dialog.tsx              # ✅ Shadcn (Radix UI)
├── alert.tsx                     # ✅ Shadcn (cva)
├── badge.tsx                     # ✅ Shadcn (cva)
├── button.tsx                    # ✅ Shadcn (Radix UI Slot, cva)
├── card.tsx                      # ✅ Shadcn
├── ...                           # (50+ more shadcn components)
│
├── buttons/                      # 🎨 Custom enhancements
│   ├── Button.tsx                # Enhanced button
│   ├── BackButton.tsx            # Navigation button
│   └── RollbackButton.tsx        # Undo functionality
│
├── inputs/                       # 🎨 Custom enhancements
│   ├── Input.tsx                 # Enhanced input
│   ├── Select.tsx                # Custom select
│   ├── FileUpload.tsx            # File uploader
│   └── ...
│
├── feedback/                     # 🎨 Custom enhancements
│   ├── Alert.tsx                 # Enhanced alerts
│   ├── Toast.tsx                 # Toast system
│   └── ...
│
├── layout/                       # 🎨 Custom enhancements
├── overlays/                     # 🎨 Custom enhancements
├── navigation/                   # 🎨 Custom enhancements
├── display/                      # 🎨 Custom enhancements
├── charts/                       # 🎨 Custom charts
├── data/                         # 🎨 Custom data display
├── loading/                      # 🎨 Loading states
├── media/                        # 🎨 Media components
├── errors/                       # 🎨 Error boundaries
├── theme/                        # 🎨 Theme components
│
└── index.ts                      # Barrel exports
```

**Legend:**
- ✅ = Standard shadcn/ui component (minimal, vanilla)
- 🎨 = Custom enhanced component (additional features)

## Troubleshooting

### Import not found after renaming

**Problem:** `Module not found: Can't resolve '@/components/ui/Button'`

**Solution:** Update import to kebab-case:
```typescript
import { Button } from '@/components/ui/button';
```

### Component not matching shadcn docs

**Problem:** Shadcn docs show different API than our component

**Solution:** Check if using custom subdirectory version:
```typescript
// Shadcn standard
import { Button } from '@/components/ui/button';

// Custom enhanced version
import { Button } from '@/components/ui/buttons';
```

### Type errors after update

**Problem:** TypeScript errors after updating shadcn component

**Solution:**
1. Check if custom component depends on the updated component
2. Update custom component types to match new shadcn API
3. Run `npm run type-check` to find all type issues

## Related Documentation

- [Shadcn UI Official Docs](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Class Variance Authority](https://cva.style/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Next.js App Router](https://nextjs.org/docs/app)

## Maintainers

When updating this documentation:
- Add new components to the appropriate section
- Update the total component count
- Document any breaking changes
- Include migration examples
- Keep the architecture diagram current
