# Button Usage Guide

## Overview

This guide documents the standardized button component usage across the White Cross Healthcare Platform. Always use the shadcn/ui Button component for consistency and maintainability.

## Standard Button Component

```tsx
import { Button } from '@/components/ui/button';
```

## Button Variants

The Button component supports the following variants:

### Default (Primary)
Used for primary actions like "Save", "Submit", "Create"

```tsx
<Button variant="default">Save Changes</Button>
```

### Secondary
Used for secondary actions like "Cancel", "Back"

```tsx
<Button variant="secondary">Cancel</Button>
```

### Destructive
Used for destructive actions like "Delete", "Remove"

```tsx
<Button variant="destructive">Delete Record</Button>
```

### Outline
Used for tertiary actions or alternative paths

```tsx
<Button variant="outline">View Details</Button>
```

### Ghost
Used for subtle actions, often in navigation

```tsx
<Button variant="ghost">Skip</Button>
```

### Link
Used for actions that look like links

```tsx
<Button variant="link">Learn More</Button>
```

## Button Sizes

```tsx
<Button size="sm">Small Button</Button>
<Button size="default">Default Button</Button>
<Button size="lg">Large Button</Button>
<Button size="icon">📝</Button>
```

## Accessibility Best Practices

### 1. Always Add aria-label for Icon-Only Buttons

```tsx
// ❌ BAD - No accessible label
<Button variant="ghost" size="icon">
  <Search className="h-4 w-4" />
</Button>

// ✅ GOOD - Has aria-label
<Button variant="ghost" size="icon" aria-label="Search appointments">
  <Search className="h-4 w-4" aria-hidden="true" />
</Button>
```

### 2. Add aria-hidden to Decorative Icons

When buttons have both icons and text, mark icons as decorative:

```tsx
// ✅ GOOD - Icon is marked as decorative
<Button variant="default" aria-label="Create new invoice">
  <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
  Create Invoice
</Button>
```

### 3. Use Descriptive Labels

```tsx
// ❌ BAD - Generic label
<Button>Submit</Button>

// ✅ GOOD - Descriptive label
<Button>Submit Appointment Request</Button>
```

### 4. Indicate Loading State

```tsx
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <RefreshCw className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
      Saving...
    </>
  ) : (
    'Save Changes'
  )}
</Button>
```

## Common Button Patterns

### Action Buttons with Icons

```tsx
import { Plus, Save, Trash2, Edit } from 'lucide-react';

// Create action
<Button variant="default" aria-label="Create new appointment">
  <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
  Create Appointment
</Button>

// Save action
<Button variant="default" aria-label="Save changes">
  <Save className="h-4 w-4 mr-2" aria-hidden="true" />
  Save
</Button>

// Edit action
<Button variant="secondary" aria-label="Edit record">
  <Edit className="h-4 w-4 mr-2" aria-hidden="true" />
  Edit
</Button>

// Delete action
<Button variant="destructive" aria-label="Delete record">
  <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
  Delete
</Button>
```

### Navigation Buttons

```tsx
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';

// Back button
<Button variant="ghost" aria-label="Go back to previous page">
  <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
  Back
</Button>

// Home button
<Button variant="ghost" aria-label="Go to dashboard">
  <Home className="h-4 w-4 mr-2" aria-hidden="true" />
  Dashboard
</Button>
```

### Button Groups

```tsx
<div className="flex gap-3">
  <Button variant="default">Primary Action</Button>
  <Button variant="secondary">Secondary Action</Button>
  <Button variant="ghost">Tertiary Action</Button>
</div>
```

### Responsive Button Layouts

```tsx
<div className="flex flex-col sm:flex-row gap-3 justify-center">
  <Button variant="default">Try Again</Button>
  <Button variant="secondary">Go Home</Button>
  <Button variant="ghost" size="sm">Cancel</Button>
</div>
```

## Link Buttons

When navigating to a new page, wrap Button with Next.js Link:

```tsx
import Link from 'next/link';

<Link href="/appointments">
  <Button variant="secondary">
    <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
    View Appointments
  </Button>
</Link>
```

## Form Buttons

### Submit Button

```tsx
<Button type="submit" disabled={isSubmitting}>
  {isSubmitting ? 'Saving...' : 'Save Appointment'}
</Button>
```

### Cancel Button

```tsx
<Button type="button" variant="secondary" onClick={onCancel}>
  Cancel
</Button>
```

### Reset Button

```tsx
<Button type="reset" variant="outline">
  Reset Form
</Button>
```

## Anti-Patterns to Avoid

### ❌ Don't Use Inline className Buttons

```tsx
// ❌ BAD - Inline styles, no consistency
<button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
  Submit
</button>

// ✅ GOOD - Use Button component
<Button variant="default">Submit</Button>
```

### ❌ Don't Use Custom CSS Classes

```tsx
// ❌ BAD - Custom class that may not exist
<button className="btn-primary">Submit</button>

// ✅ GOOD - Use standardized Button
<Button variant="default">Submit</Button>
```

### ❌ Don't Mix Button Styles

```tsx
// ❌ BAD - Inconsistent styling across pages
// Page A
<button className="bg-blue-600 px-4 py-2">Submit</button>

// Page B
<button className="bg-indigo-500 px-3 py-1.5">Submit</button>

// ✅ GOOD - Consistent Button component
<Button variant="default">Submit</Button>
```

## Testing Buttons

### Unit Tests

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

test('button fires onClick handler', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click Me</Button>);

  fireEvent.click(screen.getByRole('button', { name: /click me/i }));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Accessibility Tests

```tsx
test('button has accessible label', () => {
  render(
    <Button aria-label="Delete appointment">
      <Trash2 className="h-4 w-4" aria-hidden="true" />
    </Button>
  );

  expect(screen.getByLabelText('Delete appointment')).toBeInTheDocument();
});
```

## Migration from Old Patterns

If you encounter old button patterns, update them as follows:

### Inline className buttons

```tsx
// OLD
<button
  onClick={handleClick}
  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
>
  Submit
</button>

// NEW
<Button variant="default" onClick={handleClick}>
  Submit
</Button>
```

### Custom CSS classes

```tsx
// OLD
<button className="btn-primary" onClick={handleClick}>
  Submit
</button>

// NEW
<Button variant="default" onClick={handleClick}>
  Submit
</Button>
```

### Link-styled buttons

```tsx
// OLD
<a href="/appointments" className="text-blue-600 hover:underline">
  View Appointments
</a>

// NEW
<Link href="/appointments">
  <Button variant="link">View Appointments</Button>
</Link>
```

## Additional Resources

- [shadcn/ui Button Documentation](https://ui.shadcn.com/docs/components/button)
- [WCAG 2.1 Button Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html)
- [Lucide Icons](https://lucide.dev/) - Icon library used throughout the application

## Questions or Issues?

If you're unsure about button usage patterns, refer to existing implementations in:
- `/frontend/src/app/(dashboard)/admin/error.tsx`
- `/frontend/src/app/(dashboard)/billing/error.tsx`
- `/frontend/src/components/common/ErrorPage.tsx`
