# White Cross Healthcare Platform - Design System

## Overview

This design system provides a comprehensive, scalable, and accessible styling architecture for the White Cross Healthcare Platform. Built with Tailwind CSS, it ensures consistency across all 21 domain areas while supporting dark mode and responsive design.

## Table of Contents

1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Spacing](#spacing)
4. [Components](#components)
5. [Animations](#animations)
6. [Dark Mode](#dark-mode)
7. [Accessibility](#accessibility)
8. [Usage Examples](#usage-examples)

---

## Color Palette

### Primary Colors (Healthcare Blue)
Used for primary actions, links, and brand elements.

```css
primary-50:  #f0f9ff  /* Lightest background */
primary-100: #e0f2fe
primary-200: #bae6fd
primary-300: #7dd3fc
primary-400: #38bdf8
primary-500: #0ea5e9  /* Main brand color */
primary-600: #0284c7  /* Default buttons */
primary-700: #0369a1  /* Hover states */
primary-800: #075985  /* Active states */
primary-900: #0c4a6e
primary-950: #082f49  /* Darkest */
```

### Secondary Colors (Slate Gray)
Used for secondary actions, text, and subtle UI elements.

```css
secondary-50:  #f8fafc
secondary-100: #f1f5f9
secondary-200: #e2e8f0  /* Borders, dividers */
secondary-300: #cbd5e1
secondary-400: #94a3b8
secondary-500: #64748b  /* Secondary text */
secondary-600: #475569
secondary-700: #334155
secondary-800: #1e293b
secondary-900: #0f172a
secondary-950: #020617
```

### Status Colors

#### Success (Green)
```css
success-500: #22c55e  /* Main success color */
success-600: #16a34a  /* Buttons */
```

#### Warning (Amber)
```css
warning-500: #f59e0b  /* Main warning color */
warning-600: #d97706  /* Buttons */
```

#### Danger/Error (Red)
```css
danger-500: #ef4444   /* Main danger color */
danger-600: #dc2626   /* Buttons */
```

#### Info (Blue)
```css
info-500: #3b82f6     /* Main info color */
info-600: #2563eb     /* Buttons */
```

### Healthcare-Specific (Medical Purple)
```css
medical-500: #d946ef  /* Medical/health focus */
medical-600: #c026d3
```

---

## Typography

### Font Families

```css
font-sans: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
font-serif: Georgia, Cambria, 'Times New Roman', serif
font-mono: 'Fira Code', Monaco, Consolas, monospace
```

### Font Sizes with Line Heights

```css
text-2xs:  0.625rem (10px) / 0.75rem
text-xs:   0.75rem  (12px) / 1rem
text-sm:   0.875rem (14px) / 1.25rem
text-base: 1rem     (16px) / 1.5rem
text-lg:   1.125rem (18px) / 1.75rem
text-xl:   1.25rem  (20px) / 1.75rem
text-2xl:  1.5rem   (24px) / 2rem
text-3xl:  1.875rem (30px) / 2.25rem
text-4xl:  2.25rem  (36px) / 2.5rem
```

### Headings

All headings are responsive and support dark mode:

```jsx
<h1>Main Page Heading</h1>      // 3xl-4xl, bold, tight tracking
<h2>Section Heading</h2>         // 2xl-3xl, semibold
<h3>Subsection Heading</h3>      // xl-2xl, semibold
<h4>Card/Component Title</h4>    // lg-xl, semibold
<h5>Small Section Title</h5>     // base-lg, medium
<h6>Micro Heading</h6>           // sm-base, medium
```

---

## Spacing

### Spacing Scale

Standard Tailwind spacing (4px base unit) extended with larger values:

```css
px-1:   0.25rem (4px)
px-2:   0.5rem  (8px)
px-3:   0.75rem (12px)
px-4:   1rem    (16px)   /* Most common */
px-6:   1.5rem  (24px)
px-8:   2rem    (32px)
px-12:  3rem    (48px)
px-16:  4rem    (64px)
px-24:  6rem    (96px)

/* Extended spacing */
px-128: 32rem   (512px)
px-144: 36rem   (576px)
px-256: 64rem   (1024px)
```

### Common Spacing Patterns

```jsx
{/* Card padding */}
<div className="p-6">...</div>

{/* Section spacing */}
<section className="py-12 px-4">...</section>

{/* Stack spacing */}
<div className="space-y-4">...</div>
<div className="space-x-2">...</div>

{/* Gap in flex/grid */}
<div className="flex gap-4">...</div>
<div className="grid gap-6">...</div>
```

---

## Components

### Buttons

#### Variants

```jsx
{/* Primary - Main actions */}
<button className="btn-primary btn-md">Save Changes</button>

{/* Secondary - Alternative actions */}
<button className="btn-secondary btn-md">Cancel</button>

{/* Success - Positive confirmation */}
<button className="btn-success btn-md">Approve</button>

{/* Warning - Caution required */}
<button className="btn-warning btn-md">Archive</button>

{/* Danger - Destructive actions */}
<button className="btn-danger btn-md">Delete</button>

{/* Info - Informational */}
<button className="btn-info btn-md">Learn More</button>

{/* Outline - Subtle emphasis */}
<button className="btn-outline btn-md">View Details</button>

{/* Outline Primary */}
<button className="btn-outline-primary btn-md">Select</button>

{/* Ghost - Minimal style */}
<button className="btn-ghost btn-md">Dismiss</button>

{/* Link - Text-like button */}
<button className="btn-link">Read documentation</button>
```

#### Sizes

```jsx
<button className="btn-primary btn-xs">Extra Small</button>
<button className="btn-primary btn-sm">Small</button>
<button className="btn-primary btn-md">Medium (Default)</button>
<button className="btn-primary btn-lg">Large</button>
<button className="btn-primary btn-xl">Extra Large</button>
```

#### Using the Button Component

```jsx
import { Button } from '@/components/ui/buttons/Button';

{/* Basic usage */}
<Button variant="primary" size="md">Click Me</Button>

{/* With loading state */}
<Button variant="primary" loading={isLoading}>Save</Button>

{/* With icon */}
<Button variant="primary" icon={<SaveIcon />} iconPosition="left">
  Save Changes
</Button>

{/* Full width */}
<Button variant="primary" fullWidth>Submit Form</Button>

{/* Disabled */}
<Button variant="primary" disabled>Unavailable</Button>
```

### Cards

#### Variants

```jsx
{/* Default - Standard card */}
<div className="card">
  <div className="card-header">
    <h3 className="text-lg font-semibold">Card Title</h3>
  </div>
  <div className="card-body">
    <p>Card content goes here.</p>
  </div>
  <div className="card-footer">
    <button className="btn-primary btn-sm">Action</button>
  </div>
</div>

{/* Elevated - More shadow */}
<div className="card-elevated">...</div>

{/* Flat - Subtle background */}
<div className="card-flat">...</div>

{/* Hover effect */}
<div className="card card-hover">...</div>
```

#### Using the Card Component

```jsx
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/layout/Card';

<Card variant="default" padding="md" rounded="lg">
  <CardHeader divider>
    <CardTitle>Patient Record</CardTitle>
    <CardDescription>Medical history and current medications</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content here...</p>
  </CardContent>
  <CardFooter divider>
    <Button variant="primary">Edit Record</Button>
  </CardFooter>
</Card>
```

### Forms

#### Input Fields

```jsx
{/* Default input */}
<input type="text" className="input-field input-md" placeholder="Enter text" />

{/* Input sizes */}
<input type="text" className="input-field input-sm" />
<input type="text" className="input-field input-md" />
<input type="text" className="input-field input-lg" />

{/* Input states */}
<input type="text" className="input-field input-error" />
<input type="text" className="input-field input-success" />
<input type="text" className="input-field input-warning" />

{/* With label */}
<label className="form-label">Email Address</label>
<input type="email" className="input-field" />
<p className="form-help">We'll never share your email.</p>

{/* Required field */}
<label className="form-label form-label-required">Password</label>
<input type="password" className="input-field" />

{/* Error state */}
<input type="text" className="input-field input-error" />
<p className="form-error">This field is required.</p>
```

#### Using the Input Component

```jsx
import { Input } from '@/components/ui/inputs/Input';

<Input
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  helperText="Enter your email address"
  required
/>

{/* With error */}
<Input
  label="Username"
  type="text"
  error="Username already taken"
/>

{/* With icon */}
<Input
  label="Search"
  type="search"
  icon={<SearchIcon />}
  iconPosition="left"
/>

{/* Loading state */}
<Input
  label="Verifying..."
  type="text"
  loading
/>
```

#### Select Fields

```jsx
<select className="select-field">
  <option>Select an option</option>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</select>
```

#### Textarea

```jsx
<textarea className="textarea-field" rows="4" placeholder="Enter description"></textarea>
```

#### Checkbox & Radio

```jsx
{/* Checkbox */}
<div className="flex items-center">
  <input type="checkbox" id="terms" className="checkbox" />
  <label htmlFor="terms" className="ml-2 text-sm">I agree to the terms</label>
</div>

{/* Radio */}
<div className="flex items-center">
  <input type="radio" id="option1" name="options" className="radio" />
  <label htmlFor="option1" className="ml-2 text-sm">Option 1</label>
</div>
```

### Badges

```jsx
{/* Using utility classes */}
<span className="badge badge-primary badge-md">New</span>
<span className="badge badge-success badge-md">Active</span>
<span className="badge badge-warning badge-md">Pending</span>
<span className="badge badge-danger badge-md">Critical</span>
<span className="badge badge-info badge-md">Info</span>

{/* Sizes */}
<span className="badge badge-primary badge-sm">Small</span>
<span className="badge badge-primary badge-md">Medium</span>
<span className="badge badge-primary badge-lg">Large</span>
```

#### Using the Badge Component

```jsx
import { Badge } from '@/components/ui/display/Badge';

<Badge variant="success" size="md">Active</Badge>
<Badge variant="warning" size="md">Pending</Badge>
<Badge variant="danger" size="md" shape="pill">Critical</Badge>
<Badge variant="info" size="sm" dot>New Feature</Badge>
```

### Alerts

```jsx
{/* Using utility classes */}
<div className="alert alert-success">
  <p>Your changes have been saved successfully!</p>
</div>

<div className="alert alert-warning">
  <p>Please review the information before submitting.</p>
</div>

<div className="alert alert-danger">
  <p>An error occurred. Please try again.</p>
</div>

<div className="alert alert-info">
  <p>This feature is currently in beta testing.</p>
</div>
```

#### Using the Alert Component

```jsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/feedback/Alert';

<Alert variant="success" dismissible onDismiss={handleDismiss}>
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>
    Your patient record has been updated successfully.
  </AlertDescription>
</Alert>

<Alert variant="warning" showIcon>
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>
    This medication requires prior authorization.
  </AlertDescription>
</Alert>

<Alert variant="danger" size="lg">
  <AlertTitle>Critical Alert</AlertTitle>
  <AlertDescription>
    Patient has a severe allergy to penicillin.
  </AlertDescription>
</Alert>
```

### Tables

```jsx
<div className="overflow-x-auto">
  <table className="table">
    <thead className="table-header">
      <tr>
        <th className="table-th">Name</th>
        <th className="table-th">Status</th>
        <th className="table-th">Date</th>
      </tr>
    </thead>
    <tbody>
      <tr className="table-row">
        <td className="table-td">John Doe</td>
        <td className="table-td">
          <span className="badge badge-success badge-sm">Active</span>
        </td>
        <td className="table-td">2025-10-24</td>
      </tr>
      <tr className="table-row">
        <td className="table-td">Jane Smith</td>
        <td className="table-td">
          <span className="badge badge-warning badge-sm">Pending</span>
        </td>
        <td className="table-td">2025-10-23</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Tabs

```jsx
<div className="tab-list">
  <button className="tab tab-active">Overview</button>
  <button className="tab">Details</button>
  <button className="tab">History</button>
  <button className="tab">Settings</button>
</div>
```

### Modals

```jsx
{/* Modal overlay */}
<div className="modal-overlay">
  <div className="modal modal-md">
    <h2 className="text-xl font-semibold mb-4">Confirm Action</h2>
    <p className="text-gray-600 mb-6">Are you sure you want to proceed?</p>
    <div className="flex gap-2 justify-end">
      <button className="btn-outline btn-md">Cancel</button>
      <button className="btn-primary btn-md">Confirm</button>
    </div>
  </div>
</div>

{/* Modal sizes */}
<div className="modal modal-sm">Small</div>
<div className="modal modal-md">Medium</div>
<div className="modal modal-lg">Large</div>
<div className="modal modal-xl">Extra Large</div>
```

### Progress Bars

```jsx
{/* Basic progress */}
<div className="progress">
  <div className="progress-bar" style={{ width: '60%' }}></div>
</div>

{/* Success progress */}
<div className="progress">
  <div className="progress-bar progress-bar-success" style={{ width: '100%' }}></div>
</div>

{/* Warning progress */}
<div className="progress">
  <div className="progress-bar progress-bar-warning" style={{ width: '75%' }}></div>
</div>

{/* Danger progress */}
<div className="progress">
  <div className="progress-bar progress-bar-danger" style={{ width: '25%' }}></div>
</div>
```

### Stats Cards

```jsx
<div className="stat-card">
  <div className="stat-label">Total Patients</div>
  <div className="stat-value">1,234</div>
  <div className="stat-change-positive">+12% from last month</div>
</div>

<div className="stat-card">
  <div className="stat-label">Pending Appointments</div>
  <div className="stat-value">56</div>
  <div className="stat-change-negative">-8% from last month</div>
</div>
```

---

## Shadows

```css
shadow-xs:     Minimal shadow for subtle elevation
shadow-soft:   Default card shadow
shadow-smooth: Medium elevation
shadow-crisp:  High elevation
shadow-heavy:  Maximum elevation (modals, dialogs)

shadow-glow-primary:  Primary color glow effect
shadow-glow-success:  Success color glow effect
shadow-glow-danger:   Danger color glow effect
```

Usage:
```jsx
<div className="shadow-soft">Default card</div>
<div className="shadow-crisp hover:shadow-heavy">Interactive card</div>
<button className="shadow-glow-primary">Glowing button</button>
```

---

## Animations

### Built-in Animations

```jsx
{/* Fade in */}
<div className="animate-fade-in">Content</div>

{/* Slide animations */}
<div className="animate-slide-up">Slide from bottom</div>
<div className="animate-slide-down">Slide from top</div>
<div className="animate-slide-in-left">Slide from left</div>
<div className="animate-slide-in-right">Slide from right</div>

{/* Scale animations */}
<div className="animate-scale-up">Scale up</div>
<div className="animate-scale-down">Scale down</div>

{/* Interactive animations */}
<div className="animate-bounce-in">Bounce in</div>
<div className="animate-shake">Shake</div>
<div className="animate-wiggle">Wiggle</div>

{/* Continuous animations */}
<div className="animate-pulse-soft">Soft pulse</div>
<div className="animate-spin-slow">Slow spin</div>
<div className="animate-ping-slow">Slow ping</div>
```

### Transition Durations

```css
duration-50:   50ms   (Very fast)
duration-100:  100ms  (Fast)
duration-200:  200ms  (Default)
duration-300:  300ms  (Base)
duration-500:  500ms  (Slow)
duration-700:  700ms  (Slower)
duration-1000: 1000ms (Very slow)
```

### Transition Timing Functions

```css
ease-in-out:        Standard easing
ease-in-out-back:   Back easing with overshoot
bounce-in:          Bouncy easing
```

---

## Dark Mode

### Enabling Dark Mode

Add the `dark` class to the root element:

```html
<html class="dark">
  <!-- Your app -->
</html>
```

Or toggle programmatically:

```javascript
// Toggle dark mode
document.documentElement.classList.toggle('dark');

// Enable dark mode
document.documentElement.classList.add('dark');

// Disable dark mode
document.documentElement.classList.remove('dark');
```

### Dark Mode Classes

All components support dark mode with `dark:` prefix:

```jsx
{/* Background colors */}
<div className="bg-white dark:bg-gray-800">Content</div>

{/* Text colors */}
<p className="text-gray-900 dark:text-gray-100">Text</p>

{/* Borders */}
<div className="border-gray-200 dark:border-gray-700">...</div>

{/* Complete example */}
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg p-6">
  <h2 className="text-xl font-semibold">Dark Mode Support</h2>
  <p className="text-gray-600 dark:text-gray-400">This card looks great in both light and dark modes.</p>
</div>
```

### Dark Mode Best Practices

1. **Always pair background and text colors:**
   ```jsx
   <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
   ```

2. **Test in both modes:** Ensure contrast ratios meet WCAG AA standards.

3. **Use semantic colors:** Prefer `primary`, `success`, etc. over specific color values.

4. **Border visibility:** Dark mode borders should use gray-700 or darker.

---

## Accessibility

### Focus States

All interactive elements have visible focus rings:

```jsx
{/* Default focus ring */}
<button className="focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
  Button
</button>

{/* Focus ring utility */}
<a href="#" className="focus-ring">Link</a>
```

### Screen Reader Only

Hide content visually but keep it accessible:

```jsx
<span className="sr-only">Loading...</span>
```

### ARIA Attributes

Always include proper ARIA attributes:

```jsx
{/* Buttons */}
<button aria-label="Close" aria-pressed="false">×</button>

{/* Inputs */}
<input
  aria-invalid="true"
  aria-describedby="error-message"
  aria-required="true"
/>

{/* Alerts */}
<div role="alert" aria-live="polite">
  Success message
</div>
```

### Reduced Motion

Respects user's motion preferences:

```css
/* Automatically disabled for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Color Contrast

All color combinations meet WCAG AA standards:

- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- UI components: 3:1 contrast ratio

---

## Responsive Design

### Breakpoints

```css
sm:  640px   /* Small tablets */
md:  768px   /* Tablets */
lg:  1024px  /* Laptops */
xl:  1280px  /* Desktops */
2xl: 1536px  /* Large desktops */
```

### Responsive Utilities

```jsx
{/* Hide on mobile, show on desktop */}
<div className="hidden md:block">Desktop content</div>

{/* Show on mobile, hide on desktop */}
<div className="block md:hidden">Mobile content</div>

{/* Responsive padding */}
<div className="p-4 md:p-6 lg:p-8">Responsive padding</div>

{/* Responsive grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Grid items */}
</div>

{/* Responsive text size */}
<h1 className="text-2xl md:text-3xl lg:text-4xl">Heading</h1>
```

### Container

```jsx
{/* Centered container with max-width */}
<div className="container mx-auto px-4">
  {/* Content */}
</div>

{/* Custom max-width */}
<div className="max-w-7xl mx-auto px-4">
  {/* Content */}
</div>
```

---

## Utility Classes

### Text Utilities

```jsx
{/* Truncate text */}
<p className="truncate">Long text that will be truncated with ellipsis...</p>

{/* Multi-line truncate */}
<p className="truncate-2">Text truncated to 2 lines...</p>
<p className="truncate-3">Text truncated to 3 lines...</p>

{/* Text balance */}
<h1 className="text-balance">Balanced heading text</h1>
```

### Background Gradients

```jsx
<div className="bg-gradient-primary">Primary gradient</div>
<div className="bg-gradient-success">Success gradient</div>
<div className="bg-gradient-danger">Danger gradient</div>
```

### Glass Morphism

```jsx
<div className="glass">
  Semi-transparent glass effect with backdrop blur
</div>
```

### Scrollbar Utilities

```jsx
{/* Hide scrollbar */}
<div className="scrollbar-hide overflow-auto">Content</div>

{/* Thin scrollbar */}
<div className="scrollbar-thin overflow-auto">Content</div>
```

---

## Print Styles

```jsx
{/* Hide when printing */}
<div className="print-hidden">Navigation</div>

{/* Show only when printing */}
<div className="print-visible">Print-only content</div>
```

---

## Migration Guide

### From Old to New Color Names

```jsx
// Old
className="bg-blue-600"    → className="bg-primary-600"
className="bg-red-600"     → className="bg-danger-600"
className="bg-green-600"   → className="bg-success-600"
className="bg-yellow-600"  → className="bg-warning-600"

// Dark mode additions
className="bg-white"       → className="bg-white dark:bg-gray-800"
className="text-gray-900"  → className="text-gray-900 dark:text-white"
className="border-gray-200" → className="border-gray-200 dark:border-gray-700"
```

### Component Updates

```jsx
// Old Button
<button className="bg-blue-600 text-white px-4 py-2 rounded">

// New Button (utility class)
<button className="btn-primary btn-md">

// New Button (component)
<Button variant="primary" size="md">
```

---

## Best Practices

### 1. Use Semantic Colors

```jsx
// Good
<Button variant="primary">Submit</Button>
<Button variant="danger">Delete</Button>

// Avoid
<button className="bg-blue-600">Submit</button>
```

### 2. Consistent Spacing

```jsx
// Good - Uses design system spacing
<div className="p-6 space-y-4">

// Avoid - Arbitrary values
<div className="p-[23px] space-y-[17px]">
```

### 3. Component Composition

```jsx
// Good - Composable components
<Card variant="elevated" padding="lg">
  <CardHeader divider>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Avoid - Inline styles
<div style={{ padding: '24px', backgroundColor: '#fff' }}>
```

### 4. Dark Mode Support

```jsx
// Good - Includes dark mode
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">

// Incomplete - Missing dark mode
<div className="bg-white text-gray-900">
```

### 5. Accessibility

```jsx
// Good - Accessible
<Button variant="primary" aria-label="Save changes">
  Save
</Button>

// Incomplete - Missing ARIA
<button className="btn-primary">
  Save
</button>
```

---

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Web Docs - CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)

---

## Version History

- **v1.0.0** (2025-10-24) - Initial comprehensive design system
  - Complete color palette with healthcare focus
  - Dark mode support across all components
  - Enhanced animations and transitions
  - Accessibility improvements
  - Responsive design utilities
  - Component library with consistent styling

---

## Support

For questions or issues with the design system, please contact the frontend development team or create an issue in the project repository.
