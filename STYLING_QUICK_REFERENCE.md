# Styling Quick Reference Guide

**White Cross Healthcare Platform**
**Last Updated**: 2025-10-23

## Table of Contents
1. [Component Classes](#component-classes)
2. [Utility Classes](#utility-classes)
3. [Color Palette](#color-palette)
4. [Dark Mode](#dark-mode)
5. [Responsive Design](#responsive-design)
6. [Best Practices](#best-practices)

---

## Component Classes

### Buttons

```tsx
// Primary button (main actions)
<button className="btn-primary">Save</button>

// Secondary button (alternative actions)
<button className="btn-secondary">Cancel</button>

// Danger button (destructive actions)
<button className="btn-danger">Delete</button>

// Success button (confirmation)
<button className="btn-success">Confirm</button>

// Warning button (caution required)
<button className="btn-warning">Archive</button>

// Outline button (less emphasis)
<button className="btn-outline">View Details</button>

// Ghost button (minimal styling)
<button className="btn-ghost">Close</button>

// Small button
<button className="btn-primary btn-sm">Quick Action</button>

// Disabled button
<button className="btn-primary" disabled>Loading...</button>
```

**Note**: `.btn-red` is deprecated. Use `.btn-danger` instead.

### Cards

```tsx
// Standard card
<div className="card">
  <p>Content here</p>
</div>

// Elevated card (more shadow)
<div className="card-elevated">
  <p>Important content</p>
</div>

// Interactive card (hover effects)
<div className="card-interactive" onClick={handleClick}>
  <p>Clickable content</p>
</div>
```

### Form Elements

```tsx
// Input field
<input type="text" className="input-field" placeholder="Enter text" />

// Textarea
<textarea className="textarea-field" placeholder="Enter description" />

// Select dropdown
<select className="select-field">
  <option>Option 1</option>
  <option>Option 2</option>
</select>

// Checkbox
<input type="checkbox" className="checkbox-field" />

// Radio button
<input type="radio" className="radio-field" />
```

---

## Utility Classes

### Animations

```tsx
// Fade in animation
<div className="animate-fadeIn">Content appears smoothly</div>

// Slide in animation
<div className="animate-slideIn">Content slides from left</div>

// Scale in animation
<div className="animate-scaleIn">Content scales up</div>
```

**Note**: Animations respect `prefers-reduced-motion` preference automatically.

### Scrolling

```tsx
// Hide scrollbar
<div className="scrollbar-hide overflow-auto">
  Scrollable content without visible scrollbar
</div>

// Smooth scrolling
<div className="smooth-scroll">
  Smooth scroll behavior
</div>
```

### Text

```tsx
// Truncate text with ellipsis
<p className="text-truncate">
  Very long text that will be truncated with ellipsis
</p>
```

### Focus

```tsx
// Keyboard-only focus ring
<button className="focus-visible-ring">
  Shows ring only on keyboard focus
</button>
```

### Theme-aware Backgrounds

```tsx
// Card background color
<div className="bg-card text-card-foreground">
  Adapts to light/dark mode
</div>

// Muted background
<div className="bg-muted text-muted-foreground">
  Subtle background for less important content
</div>
```

---

## Color Palette

### Primary Colors (Blue)

```tsx
// Light shades
bg-primary-50   // #f0f9ff
bg-primary-100  // #e0f2fe
bg-primary-200  // #bae6fd

// Main color
bg-primary-500  // #0ea5e9 (Main brand color)
text-primary-600 // #0284c7

// Dark shades
bg-primary-700  // #0369a1
bg-primary-800  // #075985
bg-primary-900  // #0c4a6e
```

### Secondary Colors (Slate)

```tsx
bg-secondary-100  // #f1f5f9
bg-secondary-500  // #64748b
bg-secondary-900  // #0f172a
```

### Medical/Semantic Colors

```tsx
// Emergency (Red)
bg-medical-emergency  // #dc2626
text-danger          // #dc2626

// Warning (Amber)
bg-medical-warning   // #f59e0b
text-warning        // #f59e0b

// Success (Green)
bg-medical-success   // #10b981
text-success        // #10b981

// Info (Blue)
bg-medical-info     // #3b82f6
text-info          // #3b82f6
```

### Usage Examples

```tsx
// Emergency alert
<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
  <p className="text-red-700 dark:text-red-400">Emergency: Student has severe allergy</p>
</div>

// Success message
<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
  <p className="text-green-700 dark:text-green-400">Record saved successfully</p>
</div>

// Warning
<div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
  <p className="text-yellow-700 dark:text-yellow-400">Please review medication dosage</p>
</div>
```

---

## Dark Mode

### Enabling Dark Mode

Dark mode is controlled by the `dark` class on the `<html>` element.

```tsx
import { DarkModeToggle } from '@/components/ui/theme/DarkModeToggle';

// In your component
<DarkModeToggle />
```

### Adding Dark Mode to Components

**Pattern**: Always pair light mode colors with `dark:` variants.

```tsx
// ✅ CORRECT: Both light and dark mode
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
  Content adapts to theme
</div>

// ❌ WRONG: Only light mode
<div className="bg-white text-gray-900">
  Looks broken in dark mode
</div>
```

### Common Dark Mode Patterns

```tsx
// Backgrounds
bg-white dark:bg-gray-800
bg-gray-50 dark:bg-gray-900
bg-gray-100 dark:bg-gray-800

// Text
text-gray-900 dark:text-gray-100
text-gray-600 dark:text-gray-400
text-gray-500 dark:text-gray-400

// Borders
border-gray-200 dark:border-gray-700
border-gray-300 dark:border-gray-600

// Hover states
hover:bg-gray-100 dark:hover:bg-gray-800
hover:text-gray-900 dark:hover:text-gray-100

// Focus rings
focus:ring-primary-500 dark:focus:ring-primary-400
focus:ring-offset-2 dark:focus:ring-offset-gray-900
```

### Colored Backgrounds in Dark Mode

For colored backgrounds (alerts, cards), use transparency in dark mode:

```tsx
// Light mode: solid color
// Dark mode: transparent overlay
<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
  <p className="text-blue-700 dark:text-blue-400">Info message</p>
</div>
```

---

## Responsive Design

### Breakpoints

```
sm:  640px   // Small tablets
md:  768px   // Tablets
lg:  1024px  // Small laptops
xl:  1280px  // Desktops
2xl: 1536px  // Large screens
```

### Mobile-First Approach

Always start with mobile styles, then add larger breakpoints:

```tsx
// ✅ CORRECT: Mobile-first
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
  {/* 1 column on mobile, 2 on tablet, 4 on desktop */}
</div>

// ❌ WRONG: Desktop-first
<div className="grid grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
  {/* Counterintuitive and harder to maintain */}
</div>
```

### Common Responsive Patterns

```tsx
// Grid layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Flexbox
<div className="flex flex-col md:flex-row gap-4">

// Spacing
<div className="p-4 md:p-6 lg:p-8">

// Text sizes
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// Hidden on mobile, visible on desktop
<div className="hidden md:block">

// Visible on mobile, hidden on desktop
<div className="block md:hidden">
```

---

## Best Practices

### 1. Always Include Dark Mode

```tsx
// ✅ DO: Include dark mode variants
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">

// ❌ DON'T: Forget dark mode
<div className="bg-white text-gray-900">
```

### 2. Use Semantic Component Classes

```tsx
// ✅ DO: Use component classes for consistency
<button className="btn-primary">Save</button>

// ❌ DON'T: Repeat utility classes
<button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg...">
  Save
</button>
```

### 3. Mobile-First Responsive Design

```tsx
// ✅ DO: Mobile-first
<div className="w-full md:w-1/2 lg:w-1/3">

// ❌ DON'T: Desktop-first
<div className="w-1/3 lg:w-1/2 md:w-full">
```

### 4. Accessible Focus States

```tsx
// ✅ DO: Include focus states
<button className="btn-primary focus:ring-2 focus:ring-primary-500">

// ❌ DON'T: Remove focus outlines
<button className="btn-primary focus:outline-none">
```

### 5. Consistent Spacing

Use Tailwind's spacing scale (4, 8, 12, 16, 24, 32px):

```tsx
// ✅ DO: Use spacing scale
<div className="p-4 space-y-6">

// ❌ DON'T: Use arbitrary values
<div className="p-[13px] space-y-[22px]">
```

### 6. Color Contrast for Accessibility

Ensure WCAG AA compliance (4.5:1 for normal text, 3:1 for large text):

```tsx
// ✅ DO: High contrast
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-900 dark:text-gray-100">Readable text</p>
</div>

// ❌ DON'T: Low contrast
<div className="bg-gray-100 dark:bg-gray-800">
  <p className="text-gray-400 dark:text-gray-600">Hard to read</p>
</div>
```

### 7. Respect Reduced Motion

Animations automatically respect `prefers-reduced-motion`, but you can add your own:

```tsx
// Animations will be disabled if user prefers reduced motion
<div className="animate-fadeIn">
  Content
</div>

// Preserve critical animations
<div className="preserve-animation transition-colors">
  Important transition
</div>
```

---

## Cheat Sheet

### Quick Component Reference

| Component | Class | Dark Mode Support | Notes |
|-----------|-------|-------------------|-------|
| Primary Button | `btn-primary` | ✅ Yes | Main actions |
| Secondary Button | `btn-secondary` | ✅ Yes | Alternative actions |
| Danger Button | `btn-danger` | ✅ Yes | Destructive actions |
| Success Button | `btn-success` | ✅ Yes | NEW - Confirmation |
| Warning Button | `btn-warning` | ✅ Yes | NEW - Caution |
| Outline Button | `btn-outline` | ✅ Yes | NEW - Less emphasis |
| Ghost Button | `btn-ghost` | ✅ Yes | NEW - Minimal |
| Standard Card | `card` | ✅ Yes | Default card |
| Elevated Card | `card-elevated` | ✅ Yes | NEW - More shadow |
| Interactive Card | `card-interactive` | ✅ Yes | NEW - Hover effect |
| Input | `input-field` | ✅ Yes | Text input |
| Textarea | `textarea-field` | ✅ Yes | NEW - Multi-line |
| Select | `select-field` | ✅ Yes | NEW - Dropdown |
| Checkbox | `checkbox-field` | ✅ Yes | NEW - Checkbox |
| Radio | `radio-field` | ✅ Yes | NEW - Radio button |

### Quick Animation Reference

| Animation | Class | Duration | Notes |
|-----------|-------|----------|-------|
| Fade In | `animate-fadeIn` | 0.2s | Fade + slide up |
| Slide In | `animate-slideIn` | 0.3s | NEW - Slide from left |
| Scale In | `animate-scaleIn` | 0.2s | NEW - Scale up |

---

## Migration Guide

### Updating from Old to New Classes

```tsx
// Old: .btn-red (deprecated)
<button className="btn-red">Delete</button>

// New: .btn-danger
<button className="btn-danger">Delete</button>
```

### Adding Dark Mode to Existing Components

1. Find all hardcoded colors
2. Add `dark:` variants
3. Test in dark mode

```tsx
// Before
<div className="bg-gray-50 text-gray-900">

// After
<div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
```

---

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [WCAG Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

---

**End of Quick Reference**
