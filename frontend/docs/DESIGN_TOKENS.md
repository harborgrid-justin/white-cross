# Design Tokens Documentation

## Overview

The White Cross Healthcare Platform uses a comprehensive design token system to ensure consistency, maintainability, and accessibility across the entire application.

**Version:** 1.0.0
**WCAG Compliance:** AA/AAA
**Last Updated:** 2025-11-04

---

## Table of Contents

1. [Color Tokens](#color-tokens)
2. [Typography Tokens](#typography-tokens)
3. [Spacing Tokens](#spacing-tokens)
4. [Border Radius Tokens](#border-radius-tokens)
5. [Shadow Tokens](#shadow-tokens)
6. [Animation Tokens](#animation-tokens)
7. [Breakpoint Tokens](#breakpoint-tokens)
8. [Z-Index Tokens](#z-index-tokens)
9. [Usage Guidelines](#usage-guidelines)
10. [Dark Mode](#dark-mode)
11. [Accessibility](#accessibility)

---

## Color Tokens

### Primary Colors (Healthcare Blue)

Primary colors represent trust, professionalism, and medical authority.

```css
--color-primary-50: #eff6ff;
--color-primary-100: #dbeafe;
--color-primary-200: #bfdbfe;
--color-primary-300: #93c5fd;
--color-primary-400: #60a5fa;
--color-primary-500: #3b82f6;  /* Main primary */
--color-primary-600: #2563eb;
--color-primary-700: #1d4ed8;
--color-primary-800: #1e40af;
--color-primary-900: #1e3a8a;
--color-primary-950: #172554;
```

**Tailwind Usage:**
```tsx
<div className="bg-primary-500 text-white">Primary Button</div>
```

### Secondary Colors (Medical Teal)

Secondary colors represent health, wellness, and vitality.

```css
--color-secondary-500: #14b8a6;  /* Main secondary */
```

### Semantic Colors

#### Success (Green)
Used for positive actions, confirmations, and healthy states.

```css
--color-success-500: #22c55e;  /* Main success */
```

**Usage:**
- Successful form submissions
- Health metrics in normal range
- Active/approved statuses

#### Warning (Orange)
Used for caution, attention, and alerts.

```css
--color-warning-500: #f97316;  /* Main warning */
```

**Usage:**
- Pending actions
- Important notices
- Health metrics needing attention

#### Error/Danger (Red)
Used for critical issues, errors, and dangerous actions.

```css
--color-error-500: #ef4444;  /* Main error */
```

**Usage:**
- Form validation errors
- Critical health alerts
- Destructive actions

#### Info (Blue)
Used for informational content and neutral notifications.

```css
--color-info-500: #0ea5e9;  /* Main info */
```

### Healthcare-Specific Semantic Colors

```css
--color-medication: #8b5cf6;        /* Purple - Medications */
--color-allergy: #dc2626;           /* Red - Allergies/Alerts */
--color-vaccination: #059669;       /* Green - Vaccinations */
--color-condition: #f59e0b;         /* Amber - Conditions */
--color-vital-signs: #06b6d4;       /* Cyan - Vital Signs */
```

### Neutral Colors (Gray Scale)

```css
--color-neutral-50: #f9fafb;   /* Lightest */
--color-neutral-100: #f3f4f6;
--color-neutral-200: #e5e7eb;
--color-neutral-300: #d1d5db;
--color-neutral-400: #9ca3af;
--color-neutral-500: #6b7280;  /* Mid-gray */
--color-neutral-600: #4b5563;
--color-neutral-700: #374151;
--color-neutral-800: #1f2937;
--color-neutral-900: #111827;  /* Darkest */
--color-neutral-950: #030712;
```

---

## Typography Tokens

### Font Families

```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

**Tailwind Usage:**
```tsx
<p className="font-sans">Body text</p>
<code className="font-mono">Code snippet</code>
```

### Font Sizes (Type Scale)

Based on a modular scale for visual hierarchy.

| Token | Size | Tailwind | Use Case |
|-------|------|----------|----------|
| `--text-xs` | 12px (0.75rem) | `text-xs` | Small labels, captions |
| `--text-sm` | 14px (0.875rem) | `text-sm` | Secondary text |
| `--text-base` | 16px (1rem) | `text-base` | Body text (default) |
| `--text-lg` | 18px (1.125rem) | `text-lg` | Emphasized text |
| `--text-xl` | 20px (1.25rem) | `text-xl` | Small headings |
| `--text-2xl` | 24px (1.5rem) | `text-2xl` | Subheadings |
| `--text-3xl` | 30px (1.875rem) | `text-3xl` | Section headings |
| `--text-4xl` | 36px (2.25rem) | `text-4xl` | Page headings |
| `--text-5xl` | 48px (3rem) | `text-5xl` | Hero headings |
| `--text-6xl` | 60px (3.75rem) | `text-6xl` | Display headings |

### Line Heights

```css
--leading-none: 1;         /* Headings */
--leading-tight: 1.25;     /* Tight headings */
--leading-snug: 1.375;     /* Compact text */
--leading-normal: 1.5;     /* Body text (default) */
--leading-relaxed: 1.625;  /* Comfortable reading */
--leading-loose: 2;        /* Very spacious */
```

### Font Weights

```css
--font-light: 300;
--font-normal: 400;    /* Body text */
--font-medium: 500;    /* Emphasis */
--font-semibold: 600;  /* Subheadings */
--font-bold: 700;      /* Headings */
--font-extrabold: 800; /* Strong emphasis */
```

---

## Spacing Tokens

Based on a 4px grid system (0.25rem base unit).

| Token | Size | Tailwind | Pixels |
|-------|------|----------|--------|
| `--space-1` | 0.25rem | `p-1`, `m-1` | 4px |
| `--space-2` | 0.5rem | `p-2`, `m-2` | 8px |
| `--space-3` | 0.75rem | `p-3`, `m-3` | 12px |
| `--space-4` | 1rem | `p-4`, `m-4` | 16px |
| `--space-5` | 1.25rem | `p-5`, `m-5` | 20px |
| `--space-6` | 1.5rem | `p-6`, `m-6` | 24px |
| `--space-8` | 2rem | `p-8`, `m-8` | 32px |
| `--space-10` | 2.5rem | `p-10`, `m-10` | 40px |
| `--space-12` | 3rem | `p-12`, `m-12` | 48px |
| `--space-16` | 4rem | `p-16`, `m-16` | 64px |
| `--space-20` | 5rem | `p-20`, `m-20` | 80px |
| `--space-24` | 6rem | `p-24`, `m-24` | 96px |

### Spacing Guidelines

- **xs (4px):** Tight spacing within components
- **sm (8px):** Default spacing between elements
- **md (16px):** Spacing between component sections
- **lg (24px):** Spacing between major sections
- **xl (32px+):** Spacing between page sections

---

## Border Radius Tokens

```css
--radius-none: 0;
--radius-sm: 0.125rem;    /* 2px - subtle rounding */
--radius-base: 0.25rem;   /* 4px - default */
--radius-md: 0.375rem;    /* 6px - medium */
--radius-lg: 0.5rem;      /* 8px - cards, buttons */
--radius-xl: 0.75rem;     /* 12px - larger components */
--radius-2xl: 1rem;       /* 16px - modals */
--radius-3xl: 1.5rem;     /* 24px - decorative */
--radius-full: 9999px;    /* Circular/pill shapes */
```

**Tailwind Usage:**
```tsx
<button className="rounded-lg">Button</button>
<div className="rounded-full">Avatar</div>
```

---

## Shadow Tokens (Elevation)

Shadows create depth and hierarchy in the interface.

```css
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

### Custom Healthcare Shadows

```css
--shadow-card: 0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1);
--shadow-card-hover: 0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-modal: 0 10px 40px rgba(0, 0, 0, 0.15);
--shadow-dropdown: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
```

**Usage Guidelines:**
- **xs/sm:** Subtle elevation (cards, inputs)
- **md:** Raised elements (dropdowns, popovers)
- **lg/xl:** Floating elements (modals, drawers)
- **2xl:** Highest elevation (notifications)

---

## Animation Tokens

### Duration

```css
--duration-instant: 0ms;
--duration-fast: 150ms;      /* Quick interactions */
--duration-normal: 300ms;    /* Default transitions */
--duration-slow: 500ms;      /* Deliberate transitions */
--duration-slower: 700ms;
--duration-slowest: 1000ms;
```

### Easing Functions

```css
--ease-linear: linear;
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-elastic: cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

### Transition Presets

```css
--transition-all: all var(--duration-normal) var(--ease-in-out);
--transition-colors: color, background-color, border-color var(--duration-normal) var(--ease-in-out);
--transition-opacity: opacity var(--duration-normal) var(--ease-in-out);
--transition-shadow: box-shadow var(--duration-normal) var(--ease-in-out);
--transition-transform: transform var(--duration-normal) var(--ease-in-out);
```

**Tailwind Usage:**
```tsx
<button className="transition-colors duration-300 hover:bg-primary-600">
  Button
</button>
```

---

## Breakpoint Tokens (Responsive Design)

Mobile-first responsive breakpoints.

| Token | Size | Tailwind | Device |
|-------|------|----------|--------|
| `--breakpoint-xs` | 475px | `xs:` | Small phones |
| `--breakpoint-sm` | 640px | `sm:` | Phones (landscape) |
| `--breakpoint-md` | 768px | `md:` | Tablets |
| `--breakpoint-lg` | 1024px | `lg:` | Laptops |
| `--breakpoint-xl` | 1280px | `xl:` | Desktops |
| `--breakpoint-2xl` | 1536px | `2xl:` | Large desktops |
| `--breakpoint-3xl` | 1920px | `3xl:` | Extra large screens |

**Usage:**
```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
  Responsive grid
</div>
```

---

## Z-Index Tokens (Layering)

Consistent z-index system to prevent stacking conflicts.

| Token | Value | Use Case |
|-------|-------|----------|
| `--z-0` | 0 | Base layer |
| `--z-10` | 10 | Raised elements |
| `--z-20` | 20 | Dropdowns |
| `--z-30` | 30 | Overlays |
| `--z-40` | 40 | Sticky headers |
| `--z-50` | 50 | Fixed elements |
| `--z-dropdown` | 1000 | Dropdown menus |
| `--z-sticky` | 1020 | Sticky navigation |
| `--z-fixed` | 1030 | Fixed headers |
| `--z-modal-backdrop` | 1040 | Modal backgrounds |
| `--z-modal` | 1050 | Modal dialogs |
| `--z-popover` | 1060 | Popovers |
| `--z-tooltip` | 1070 | Tooltips |
| `--z-notification` | 1080 | Toast notifications |

---

## Usage Guidelines

### Using CSS Variables

```css
.custom-component {
  color: var(--color-primary-500);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
```

### Using Tailwind Classes

```tsx
<div className="bg-primary-500 text-white p-4 rounded-lg shadow-md">
  Healthcare Card
</div>
```

### Using with CVA (Class Variance Authority)

```typescript
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'rounded-lg font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 text-white hover:bg-primary-600',
        secondary: 'bg-secondary-500 text-white hover:bg-secondary-600',
        danger: 'bg-error-500 text-white hover:bg-error-600',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);
```

---

## Dark Mode

Dark mode tokens automatically adjust for better contrast and readability.

```css
.dark {
  --color-background: #0f172a;
  --color-foreground: #f1f5f9;
  --color-text-primary: #f1f5f9;
  --color-text-secondary: #cbd5e1;
  --color-border: #334155;
}
```

**Tailwind Usage:**
```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
  Adaptive content
</div>
```

---

## Accessibility

### WCAG 2.1 Compliance

All color combinations meet WCAG AA standards for contrast:
- **Normal text:** Minimum 4.5:1 contrast ratio
- **Large text:** Minimum 3:1 contrast ratio
- **UI components:** Minimum 3:1 contrast ratio

### Reduced Motion

The design system respects `prefers-reduced-motion` preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**React Hook:**
```tsx
import { useReducedMotion } from '@/hooks/useReducedMotion';

const shouldReduceMotion = useReducedMotion();
```

### Focus States

All interactive elements have visible focus indicators:

```css
--focus-ring-width: 2px;
--focus-ring-offset: 2px;
--focus-ring-color: var(--color-primary-500);
```

**Utility Classes:**
```tsx
<button className="focus-ring">Accessible Button</button>
```

### Touch Targets

Minimum touch target size (44px × 44px) for accessibility:

```tsx
<button className="touch-target">Mobile-friendly</button>
```

---

## Best Practices

1. **Use design tokens instead of hardcoded values**
   ```tsx
   // ❌ Bad
   <div style={{ color: '#3b82f6' }}>Text</div>

   // ✅ Good
   <div className="text-primary-500">Text</div>
   ```

2. **Maintain consistency across the application**
   - Use the same spacing scale everywhere
   - Follow the type scale for typography
   - Use semantic colors appropriately

3. **Respect accessibility guidelines**
   - Ensure sufficient color contrast
   - Provide focus indicators
   - Support reduced motion preferences

4. **Leverage Tailwind utilities**
   - Use Tailwind classes for rapid development
   - Create custom components with CVA for complex variants
   - Extract repeated patterns into reusable components

---

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Class Variance Authority](https://cva.style/docs)
- [Design Tokens Community Group](https://www.w3.org/community/design-tokens/)

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-04
**Maintained By:** Frontend Architecture Team
