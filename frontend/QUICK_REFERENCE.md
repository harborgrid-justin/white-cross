# Design System Quick Reference

## Color Palette

```jsx
// Primary (Healthcare Blue)
bg-primary-600 text-primary-600

// Status Colors
bg-success-600 text-success-600  // Green
bg-warning-600 text-warning-600  // Amber
bg-danger-600 text-danger-600    // Red
bg-info-600 text-info-600        // Blue

// Always add dark mode
bg-white dark:bg-gray-800
text-gray-900 dark:text-white
border-gray-200 dark:border-gray-700
```

## Buttons

```jsx
// Utility Classes
<button className="btn-primary btn-md">Primary</button>
<button className="btn-secondary btn-md">Secondary</button>
<button className="btn-success btn-md">Success</button>
<button className="btn-danger btn-md">Delete</button>
<button className="btn-outline btn-md">Outline</button>
<button className="btn-ghost btn-sm">Ghost</button>

// Component
import { Button } from '@/components/ui/buttons/Button';
<Button variant="primary" size="md" loading={isLoading}>Save</Button>

// Sizes: xs, sm, md, lg, xl
```

## Cards

```jsx
// Utility Classes
<div className="card">
  <div className="card-header">Header</div>
  <div className="card-body">Content</div>
  <div className="card-footer">Footer</div>
</div>

// Component
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/layout/Card';
<Card variant="elevated" padding="lg">
  <CardHeader divider>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Variants: default, elevated, flat, outlined
```

## Forms

```jsx
// Input
<label className="form-label form-label-required">Name</label>
<input type="text" className="input-field input-md" />
<p className="form-help">Helper text</p>
<p className="form-error">Error message</p>

// Component
import { Input } from '@/components/ui/inputs/Input';
<Input label="Email" type="email" required error={errors.email} />

// Select
<select className="select-field">
  <option>Option 1</option>
</select>

// Textarea
<textarea className="textarea-field" rows="4"></textarea>

// Checkbox
<input type="checkbox" className="checkbox" />

// Radio
<input type="radio" className="radio" />
```

## Badges

```jsx
// Utility Classes
<span className="badge badge-success badge-md">Active</span>
<span className="badge badge-warning badge-sm">Pending</span>

// Component
import { Badge } from '@/components/ui/display/Badge';
<Badge variant="success" size="md">Active</Badge>
<Badge variant="danger" shape="pill">Critical</Badge>

// Variants: primary, secondary, success, warning, danger, info
// Sizes: sm, md, lg
```

## Alerts

```jsx
// Utility Classes
<div className="alert alert-success">Success message</div>
<div className="alert alert-warning">Warning message</div>
<div className="alert alert-danger">Error message</div>

// Component
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/feedback/Alert';
<Alert variant="success" dismissible onDismiss={handleClose}>
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>Changes saved.</AlertDescription>
</Alert>

// Variants: primary, success, warning, danger, info
```

## Layout

```jsx
// Container
<div className="container mx-auto px-4">Content</div>
<div className="max-w-7xl mx-auto">Content</div>

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// Flex
<div className="flex items-center justify-between gap-4">
  <div>Left</div>
  <div>Right</div>
</div>

// Stack
<div className="space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

## Typography

```jsx
// Headings (auto responsive)
<h1>Main Heading</h1>        // 3xl-4xl
<h2>Section</h2>             // 2xl-3xl
<h3>Subsection</h3>          // xl-2xl

// Text Sizes
text-xs text-sm text-base text-lg text-xl text-2xl

// Font Weights
font-light font-normal font-medium font-semibold font-bold

// Text Colors
text-gray-900 dark:text-white
text-gray-600 dark:text-gray-400
text-primary-600 dark:text-primary-400
```

## Spacing

```jsx
// Padding
p-4 px-6 py-8

// Margin
m-4 mx-auto mt-6 mb-8

// Gap
gap-4 gap-x-6 gap-y-8

// Space Between
space-x-4 space-y-6

// Common values: 1, 2, 3, 4, 6, 8, 12, 16, 24
```

## Animations

```jsx
// Entrance
animate-fade-in
animate-slide-up
animate-scale-up
animate-bounce-in

// Interactive
animate-shake
animate-wiggle

// Continuous
animate-pulse-soft
animate-spin-slow

// Transitions
transition-all duration-200
hover:scale-105 hover:shadow-lg
```

## Responsive

```jsx
// Breakpoints
sm:  640px   md:  768px   lg:  1024px   xl:  1280px   2xl: 1536px

// Common Patterns
<div className="hidden md:block">Desktop only</div>
<div className="block md:hidden">Mobile only</div>
<div className="text-base md:text-lg lg:text-xl">Responsive text</div>
<div className="p-4 md:p-6 lg:p-8">Responsive padding</div>
```

## Dark Mode

```jsx
// Always pair colors
bg-white dark:bg-gray-800
text-gray-900 dark:text-white
border-gray-200 dark:border-gray-700

// Toggle Dark Mode
document.documentElement.classList.toggle('dark');
```

## Accessibility

```jsx
// Focus Ring
<button className="focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
<a href="#" className="focus-ring">Link</a>

// Screen Reader Only
<span className="sr-only">Loading...</span>

// ARIA Attributes
<button aria-label="Close" aria-pressed="false">×</button>
<input aria-invalid="true" aria-required="true" />
<div role="alert" aria-live="polite">Alert message</div>
```

## Common Patterns

```jsx
// Stats Card
<div className="stat-card">
  <div className="stat-label">Total Users</div>
  <div className="stat-value">1,234</div>
  <div className="stat-change-positive">+12%</div>
</div>

// Loading Button
<Button variant="primary" loading={isSubmitting}>
  Submit Form
</Button>

// Error Input
<Input
  label="Email"
  error="Invalid email address"
  className="input-error"
/>

// Modal
<div className="modal-overlay">
  <div className="modal modal-md">
    <h2>Modal Title</h2>
    <p>Content</p>
    <Button variant="primary">Confirm</Button>
  </div>
</div>

// Table
<table className="table">
  <thead className="table-header">
    <tr>
      <th className="table-th">Name</th>
    </tr>
  </thead>
  <tbody>
    <tr className="table-row">
      <td className="table-td">John Doe</td>
    </tr>
  </tbody>
</table>

// Tabs
<div className="tab-list">
  <button className="tab tab-active">Tab 1</button>
  <button className="tab">Tab 2</button>
</div>
```

## Utilities

```jsx
// Shadows
shadow-soft shadow-smooth shadow-crisp shadow-heavy
shadow-glow-primary shadow-glow-success

// Borders
rounded-md rounded-lg rounded-full
border border-2

// Text
truncate truncate-2 truncate-3
text-balance

// Backgrounds
bg-gradient-primary bg-gradient-success
glass (glass morphism)

// Scrollbars
scrollbar-hide scrollbar-thin

// Print
print-hidden print-visible
```

## Component Imports

```javascript
// Buttons
import { Button } from '@/components/ui/buttons/Button';

// Layout
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/layout/Card';

// Inputs
import { Input } from '@/components/ui/inputs/Input';

// Display
import { Badge } from '@/components/ui/display/Badge';
import { Avatar } from '@/components/ui/display/Avatar';

// Feedback
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/feedback/Alert';
import { LoadingSpinner } from '@/components/ui/feedback/LoadingSpinner';
```

## File Locations

```
/frontend/tailwind.config.js        → Tailwind configuration
/frontend/src/index.css             → Base styles & utilities
/frontend/DESIGN_SYSTEM.md          → Full documentation
/frontend/STYLING_UPDATE_SUMMARY.md → Update summary
/frontend/src/components/ui/        → UI components
```

## Quick Tips

1. **Always add dark mode** to custom elements: `bg-white dark:bg-gray-800`
2. **Use semantic colors**: `primary`, `success`, `danger` instead of `blue`, `green`, `red`
3. **Prefer utility classes** over custom CSS
4. **Use components** for complex UI elements
5. **Test in dark mode** during development
6. **Add ARIA attributes** for accessibility
7. **Use focus-ring** utility for consistent focus states
8. **Respect reduced motion** (automatic)
9. **Check contrast ratios** for readability
10. **Document custom patterns** in team docs

---

**Updated**: October 24, 2025
**Version**: 1.0.0
