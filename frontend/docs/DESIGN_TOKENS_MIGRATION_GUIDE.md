# Design Tokens & Styling Migration Guide

**Version:** 2.0.0
**Date:** 2025-11-04
**Status:** Active

## Table of Contents

1. [Overview](#overview)
2. [What Changed](#what-changed)
3. [Design Token System](#design-token-system)
4. [Migration Patterns](#migration-patterns)
5. [Dark Mode Support](#dark-mode-support)
6. [Component Examples](#component-examples)
7. [Common Patterns](#common-patterns)
8. [Troubleshooting](#troubleshooting)

---

## Overview

We have consolidated three conflicting token systems into a single, unified design system using HSL-based CSS variables. This migration provides:

- **Single Source of Truth**: All design tokens in `/src/styles/tokens.css`
- **Semantic Color System**: Use meaningful names instead of hardcoded colors
- **Dark Mode Foundation**: Automatic dark mode support through semantic tokens
- **Better Maintainability**: Update colors globally from one location
- **Type Safety**: Tailwind config references CSS variables

---

## What Changed

### Before (Problems)

```tsx
// ❌ Three conflicting token systems
- tailwind.config.ts (hardcoded hex colors)
- tokens.css (hex values)
- colors.ts (TypeScript object with hex)

// ❌ Hardcoded colors
<div className="bg-blue-600 text-gray-700" />

// ❌ Inline styles
<div style={{ backgroundColor: '#3b82f6' }} />

// ❌ Conflicting secondary colors
- tokens.css: Teal (#14b8a6)
- colors.ts: Slate (#64748b)

// ❌ Duplicate error/danger definitions
```

### After (Solution)

```tsx
// ✅ Single source of truth
- tokens.css (HSL-based CSS variables)
- tailwind.config.ts (references CSS variables)
- globals.css (semantic utility classes)

// ✅ Semantic colors
<div className="bg-primary text-foreground dark:text-foreground" />

// ✅ No inline styles
<div className="bg-primary hover:bg-primary/90" />

// ✅ Resolved conflicts
- Secondary: Teal (standardized)
- error === danger (aliased for compatibility)

// ✅ Dark mode ready
<div className="bg-card dark:bg-card border dark:border-border/50" />
```

---

## Design Token System

### Token Hierarchy

```
tokens.css (Source of Truth)
    ↓
tailwind.config.ts (References CSS variables)
    ↓
globals.css (Semantic utility classes)
    ↓
Components (Use semantic classes)
```

### Semantic Tokens (Use These)

```css
/* Primary tokens - use in components */
--primary              /* Brand primary color */
--secondary            /* Brand secondary color */
--success              /* Success states */
--warning              /* Warning states */
--error                /* Error states (same as danger) */
--info                 /* Informational states */

/* Surface tokens */
--background           /* Page background */
--foreground           /* Primary text color */
--surface              /* Card/container background */
--card                 /* Card background */
--muted                /* Muted background */

/* Text tokens */
--text-primary         /* Primary text */
--text-secondary       /* Secondary text */
--text-tertiary        /* Tertiary text */
--text-muted           /* Muted text */

/* Status tokens */
--status-active        /* Active status */
--status-inactive      /* Inactive status */
--status-pending       /* Pending status */
--status-completed     /* Completed status */
--status-cancelled     /* Cancelled status */
--status-scheduled     /* Scheduled status */

/* Borders & Inputs */
--border               /* Default border */
--input                /* Input borders */
--ring                 /* Focus ring */
```

### Primitive Tokens (Use Sparingly)

```css
/* Only use when semantic tokens don't fit */
--blue-50 through --blue-950
--teal-50 through --teal-950
--green-50 through --green-950
--orange-50 through --orange-950
--red-50 through --red-950
--gray-50 through --gray-950
```

---

## Migration Patterns

### Pattern 1: Hardcoded Colors → Semantic Tokens

#### Before
```tsx
<div className="bg-blue-600 text-white hover:bg-blue-700">
  Button
</div>
```

#### After
```tsx
<div className="bg-primary text-primary-foreground hover:bg-primary/90">
  Button
</div>
```

### Pattern 2: Gray Colors → Semantic Text Colors

#### Before
```tsx
<p className="text-gray-700">Primary text</p>
<p className="text-gray-500">Secondary text</p>
<p className="text-gray-400">Muted text</p>
```

#### After
```tsx
<p className="text-foreground dark:text-foreground">Primary text</p>
<p className="text-secondary dark:text-muted-foreground">Secondary text</p>
<p className="text-muted dark:text-muted-foreground">Muted text</p>
```

### Pattern 3: Inline Styles → Tailwind Classes

#### Before
```tsx
<div style={{
  backgroundColor: '#3b82f6',
  color: 'white',
  padding: '16px',
  borderRadius: '8px'
}}>
  Content
</div>
```

#### After
```tsx
<div className="bg-primary text-primary-foreground p-4 rounded-lg">
  Content
</div>
```

### Pattern 4: Backgrounds → Surface Tokens

#### Before
```tsx
<div className="bg-white">
  <div className="bg-gray-50">
    <div className="bg-gray-100">
```

#### After
```tsx
<div className="bg-background dark:bg-background">
  <div className="bg-surface-secondary dark:bg-surface-secondary">
    <div className="bg-surface-tertiary dark:bg-surface-tertiary">
```

### Pattern 5: Borders → Border Tokens

#### Before
```tsx
<div className="border border-gray-200">
  <div className="border-t border-gray-300">
```

#### After
```tsx
<div className="border border-border dark:border-border/50">
  <div className="border-t border-border-secondary dark:border-border">
```

---

## Dark Mode Support

### Adding Dark Mode to Components

#### 1. Update Background Colors

```tsx
// Before
className="bg-white"

// After
className="bg-card dark:bg-card"
```

#### 2. Update Text Colors

```tsx
// Before
className="text-gray-900"

// After
className="text-foreground dark:text-foreground"
```

#### 3. Update Borders

```tsx
// Before
className="border border-gray-200"

// After
className="border border-border dark:border-border/50"
```

#### 4. Update Shadows

```tsx
// Before
className="shadow"

// After
className="shadow-card dark:shadow-none"
```

#### 5. Update Interactive States

```tsx
// Before
className="hover:bg-gray-50"

// After
className="hover:bg-muted dark:hover:bg-muted/50"
```

### Complete Dark Mode Pattern

```tsx
// Before
<div className="bg-white border border-gray-200 shadow p-6">
  <h2 className="text-gray-900 text-xl font-bold">Title</h2>
  <p className="text-gray-600">Description</p>
  <button className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded">
    Action
  </button>
</div>

// After
<div className="bg-card dark:bg-card border border-border dark:border-border/50 shadow-card dark:shadow-none p-6">
  <h2 className="text-foreground dark:text-foreground text-xl font-bold">Title</h2>
  <p className="text-secondary dark:text-muted-foreground">Description</p>
  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded">
    Action
  </button>
</div>
```

---

## Component Examples

### StatusBadge Component

Use the new unified `StatusBadge` component instead of creating custom badges:

```tsx
// Before
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
  Active
</span>

// After
import { StatusBadge } from '@/components/common/StatusBadge';

<StatusBadge variant="success">Active</StatusBadge>
<StatusBadge variant="warning">Pending</StatusBadge>
<StatusBadge variant="error">Failed</StatusBadge>
<StatusBadge variant="info">Scheduled</StatusBadge>

// With pulse animation for live status
<StatusBadge variant="success" pulse>
  Live
</StatusBadge>

// Auto-detect variant from status string
import { getStatusVariant } from '@/components/common/StatusBadge';

const variant = getStatusVariant(appointment.status);
<StatusBadge variant={variant}>{appointment.status}</StatusBadge>
```

### Card Components

```tsx
// Before
<div className="bg-white rounded-lg shadow p-6">
  {/* content */}
</div>

// After - Option 1: Tailwind classes
<div className="bg-card dark:bg-card text-card-foreground rounded-lg shadow-card dark:shadow-none border border-border dark:border-border/50 p-6">
  {/* content */}
</div>

// After - Option 2: Semantic utility class
<div className="card-primary p-6">
  {/* content */}
</div>
```

### Button Components

```tsx
// Before
<button className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md">
  Action
</button>

// After - Option 1: Tailwind classes
<button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors">
  Action
</button>

// After - Option 2: Semantic utility class
<button className="btn-primary">
  Action
</button>
```

### Form Inputs

```tsx
// Before
<input
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
  type="text"
/>

// After - Option 1: Tailwind classes
<input
  className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:ring-2 focus:ring-ring focus-visible:outline-none transition-colors dark:bg-background dark:text-foreground dark:border-input"
  type="text"
/>

// After - Option 2: Semantic utility class
<input
  className="input-primary"
  type="text"
/>
```

---

## Common Patterns

### Color Mapping Reference

| Before (Hardcoded) | After (Semantic) | Use Case |
|-------------------|------------------|----------|
| `bg-blue-600` | `bg-primary` | Primary actions, branding |
| `bg-teal-500` | `bg-secondary` | Secondary actions |
| `bg-green-500` | `bg-success` | Success states |
| `bg-orange-500` | `bg-warning` | Warning states |
| `bg-red-500` | `bg-error` | Error states |
| `bg-sky-500` | `bg-info` | Info states |
| `bg-white` | `bg-card` or `bg-background` | Card/page backgrounds |
| `bg-gray-50` | `bg-surface-secondary` | Secondary surfaces |
| `bg-gray-100` | `bg-surface-tertiary` | Tertiary surfaces |
| `text-gray-900` | `text-foreground` | Primary text |
| `text-gray-600` | `text-secondary` | Secondary text |
| `text-gray-500` | `text-tertiary` | Tertiary text |
| `text-gray-400` | `text-muted` | Muted text |
| `border-gray-200` | `border-border` | Default borders |
| `border-gray-300` | `border-border-secondary` | Secondary borders |

### Status Colors

```tsx
// Status badge color mapping
Active/Success → variant="success"
Pending/Warning → variant="warning"
Error/Failed → variant="error"
Info/Scheduled → variant="info"
Inactive/Disabled → variant="inactive"
```

### Opacity Modifiers

Use Tailwind's opacity modifier syntax with semantic tokens:

```tsx
// Background with opacity
<div className="bg-primary/10">          {/* 10% opacity */}
<div className="bg-primary/20">          {/* 20% opacity */}
<div className="bg-success/10">          {/* Success with 10% */}

// Hover states with opacity
<button className="bg-primary hover:bg-primary/90">
  Button
</button>
```

---

## Semantic Utility Classes

We've added these utility classes in `globals.css`:

### Background Utilities
- `.bg-surface` - Primary surface
- `.bg-surface-secondary` - Secondary surface
- `.bg-surface-tertiary` - Tertiary surface
- `.bg-success-subtle` - Success background (10% opacity)
- `.bg-warning-subtle` - Warning background (10% opacity)
- `.bg-error-subtle` - Error background (10% opacity)
- `.bg-info-subtle` - Info background (10% opacity)

### Text Utilities
- `.text-primary` - Primary text
- `.text-secondary` - Secondary text
- `.text-tertiary` - Tertiary text
- `.text-muted` - Muted text
- `.text-inverse` - Inverse text
- `.text-link` - Link text
- `.text-status-active` - Active status text
- `.text-status-inactive` - Inactive status text
- `.text-status-pending` - Pending status text

### Component Utilities
- `.card-primary` - Primary card style
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.btn-outline` - Outline button style
- `.btn-ghost` - Ghost button style
- `.btn-destructive` - Destructive button style
- `.input-primary` - Primary input style

### Badge Utilities
- `.badge-success` - Success badge
- `.badge-warning` - Warning badge
- `.badge-error` - Error badge
- `.badge-info` - Info badge
- `.badge-inactive` - Inactive badge

---

## Troubleshooting

### Issue: Colors not working after migration

**Solution:** Make sure `globals.css` imports `tokens.css`:

```css
@import '../styles/tokens.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Issue: Dark mode not working

**Solution:** Add `.dark` class to root element (usually in layout.tsx):

```tsx
<html className="dark">  {/* or conditionally based on theme */}
  <body>{children}</body>
</html>
```

### Issue: TypeScript errors with color imports

**Solution:** Use Tailwind classes instead of importing from `colors.ts`:

```tsx
// ❌ Don't do this
import { colors } from '@/styles/colors';

// ✅ Do this instead
<div className="bg-primary" />
```

### Issue: Need a specific color shade not available in semantic tokens

**Solution:** Use primitive color scales with HSL modifier:

```tsx
// Use primitive tokens as fallback
<div className="bg-blue-500 dark:bg-blue-600" />

// Or reference CSS variable directly
<div style={{ backgroundColor: 'hsl(var(--blue-500))' }} />
```

### Issue: Custom component library (e.g., shadcn) not using new tokens

**Solution:** The tokens are designed to be compatible. Most shadcn components use the same CSS variable names. If issues persist, check if the component uses hardcoded colors and update them.

---

## Migration Checklist

Use this checklist when migrating components:

- [ ] Replace `bg-white` with `bg-card dark:bg-card`
- [ ] Replace `bg-gray-*` with semantic surface tokens
- [ ] Replace `text-gray-*` with semantic text tokens
- [ ] Replace `border-gray-*` with `border-border dark:border-border`
- [ ] Replace hardcoded blue/green/red with semantic state colors
- [ ] Remove all inline `style={{}}` attributes
- [ ] Add dark mode variants (e.g., `dark:bg-card`)
- [ ] Replace custom badges with `<StatusBadge>`
- [ ] Update hover/focus states to use semantic tokens
- [ ] Test in both light and dark mode
- [ ] Verify color contrast meets WCAG AA standards

---

## Best Practices

1. **Always prefer semantic tokens over primitive colors**
   ```tsx
   ✅ bg-primary
   ❌ bg-blue-600
   ```

2. **Use the cn() utility for conditional classes**
   ```tsx
   import { cn } from '@/lib/utils';

   <div className={cn(
     'bg-card',
     isActive && 'border-primary',
     className
   )} />
   ```

3. **Always include dark mode variants**
   ```tsx
   ✅ bg-card dark:bg-card
   ❌ bg-card
   ```

4. **Use StatusBadge for all status indicators**
   ```tsx
   ✅ <StatusBadge variant="success">Active</StatusBadge>
   ❌ <span className="bg-green-100 text-green-800">Active</span>
   ```

5. **Group related classes logically**
   ```tsx
   <div className={cn(
     // Layout
     'flex items-center gap-4',
     // Appearance
     'bg-card text-foreground border border-border',
     // Dark mode
     'dark:bg-card dark:text-foreground dark:border-border/50',
     // Interactive
     'hover:shadow-md transition-shadow'
   )} />
   ```

---

## Resources

- **Design Tokens:** `/src/styles/tokens.css`
- **Global Styles:** `/src/app/globals.css`
- **Tailwind Config:** `/tailwind.config.ts`
- **StatusBadge Component:** `/src/components/common/StatusBadge.tsx`
- **Updated Components:**
  - `/src/components/admin/AdminMetricCard.tsx`
  - `/src/components/admin/AdminDataTable.tsx`

---

## Questions?

If you have questions about the design token system or need help migrating a component, please:

1. Review this guide
2. Check the updated example components
3. Refer to the tokens.css file for available tokens
4. Ask the frontend team for assistance

---

**Last Updated:** 2025-11-04
**Version:** 2.0.0
