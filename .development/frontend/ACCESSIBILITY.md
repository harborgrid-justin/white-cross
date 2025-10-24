# Accessibility Documentation

## WCAG 2.1 AA Compliance

This document outlines the accessibility features and WCAG 2.1 AA compliance measures implemented across the White Cross healthcare application frontend.

## Overview

The White Cross application is designed to be fully accessible to users with disabilities, complying with WCAG 2.1 Level AA standards. This ensures the application works seamlessly with assistive technologies including screen readers, keyboard navigation, and other adaptive tools.

## Key Accessibility Features

### 1. Keyboard Navigation

All interactive elements are fully keyboard accessible:

- **Tab Navigation**: Natural tab order through all interactive elements
- **Skip Links**: Skip to main content link (visible on focus)
- **Modal Dialogs**: Full focus trap implementation with Escape key support
- **Tabs Component**: Arrow key navigation, Home/End key support
- **Tables**: Sortable columns accessible via keyboard (Enter/Space)
- **Menus**: Arrow key navigation in dropdown menus

### 2. Screen Reader Support

All components include proper ARIA attributes and semantic HTML:

- **Form Fields**: Proper label associations, aria-required, aria-invalid, aria-describedby
- **Buttons**: Descriptive aria-label for icon-only buttons
- **Modals**: aria-modal, aria-labelledby, aria-describedby
- **Tabs**: role="tablist", "tab", "tabpanel" with aria-selected and aria-controls
- **Tables**: scope="col", aria-sort for sortable columns
- **Alerts**: role="alert", aria-live regions for dynamic content
- **Live Regions**: aria-live="polite" or "assertive" for status updates

### 3. Visual Accessibility

#### Color Contrast
- Normal text: 4.5:1 minimum contrast ratio (WCAG AA)
- Large text (18pt+): 3:1 minimum contrast ratio
- UI components: 3:1 minimum contrast ratio
- Focus indicators: High contrast, minimum 2px width

#### Focus Indicators
All focusable elements have visible focus indicators:
- Primary color ring (2px width)
- Offset for clear visibility
- Consistent across all components
- Works in light and dark modes

#### Text Scaling
- Supports text scaling up to 200%
- Responsive design maintains usability at all zoom levels
- No horizontal scrolling at 320px width (reflow)

### 4. Motion and Animations

Respects user preferences:
- `prefers-reduced-motion` media query support
- Animations reduced to minimal duration (0.01ms)
- Transitions disabled for users who prefer reduced motion
- Scroll behavior set to auto

## Component-Specific Accessibility

### Form Components

#### Input Component
```tsx
<Input
  label="Email Address"
  type="email"
  required
  error="Please enter a valid email"
  helperText="We'll never share your email"
/>
```
- ✅ Label association (htmlFor/id)
- ✅ aria-required for required fields
- ✅ aria-invalid for error states
- ✅ aria-describedby for hints and errors
- ✅ Loading state with aria-busy
- ✅ Visible required indicator (*)

#### Checkbox Component
```tsx
<Checkbox
  id="terms"
  label="I agree to the terms"
  description="By checking this box, you agree to our terms of service"
  required
  error="You must agree to continue"
/>
```
- ✅ Label association
- ✅ aria-required
- ✅ aria-invalid
- ✅ aria-describedby for descriptions/errors
- ✅ Indeterminate state support
- ✅ Error announcements via role="alert"

#### Radio Component
```tsx
<RadioGroup label="Notification Preference" error="Please select an option">
  <Radio id="email" name="pref" label="Email" value="email" required />
  <Radio id="sms" name="pref" label="SMS" value="sms" required />
</RadioGroup>
```
- ✅ Fieldset/legend for groups
- ✅ role="radiogroup"
- ✅ aria-required
- ✅ aria-invalid
- ✅ Proper label associations

#### Select Component
```tsx
<Select
  label="Country"
  options={countries}
  required
  searchable
  error="Please select a country"
/>
```
- ⚠️ Custom select (not native)
- ✅ Label association
- ✅ Keyboard navigation (Enter/Space to open, Escape to close)
- ✅ Search functionality
- 🔧 Needs: Full ARIA combobox implementation (aria-expanded, aria-activedescendant, role="combobox")

#### Switch Component
```tsx
<Switch
  id="notifications"
  label="Enable notifications"
  description="Receive updates via email"
  checked={enabled}
  onChange={setEnabled}
/>
```
- ✅ role="switch"
- ✅ aria-checked
- ✅ aria-required
- ✅ aria-describedby
- ✅ Visual state indicator

#### Textarea Component
```tsx
<Textarea
  label="Comments"
  maxLength={500}
  showCharCount
  required
  helperText="Please provide detailed feedback"
/>
```
- ✅ Label association
- ✅ aria-required
- ✅ aria-invalid
- ✅ aria-describedby
- ✅ Character count visible and updated
- ✅ Auto-resize support

#### SearchInput Component
```tsx
<SearchInput
  value={query}
  onChange={setQuery}
  placeholder="Search patients..."
/>
```
- ✅ role="search" on container
- ✅ type="search" on input
- ✅ aria-label for screen readers
- ✅ Icon hidden with aria-hidden
- ✅ Clear button with aria-label

### Navigation Components

#### Tabs Component
```tsx
<Tabs value={tab} onValueChange={setTab}>
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="details">Details</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Content</TabsContent>
</Tabs>
```
- ✅ role="tablist", "tab", "tabpanel"
- ✅ aria-selected state
- ✅ aria-controls association
- ✅ aria-labelledby for panels
- ✅ Arrow key navigation (Left/Right or Up/Down)
- ✅ Home/End key support
- ✅ Tab/Shift+Tab to panel
- ✅ Proper tabindex management (-1 for inactive tabs)

#### Breadcrumbs Component
```tsx
<Breadcrumbs items={breadcrumbItems} />
```
- ✅ nav element with aria-label="Breadcrumb"
- ✅ role="list" on ol
- ✅ aria-current="page" for current page
- ✅ Links have descriptive aria-label
- ✅ Icons hidden with aria-hidden
- ✅ Keyboard navigable

### Feedback Components

#### Modal Component
```tsx
<Modal open={isOpen} onClose={handleClose}>
  <ModalHeader>
    <ModalTitle>Confirm Action</ModalTitle>
  </ModalHeader>
  <ModalBody>Content</ModalBody>
  <ModalFooter>Buttons</ModalFooter>
</Modal>
```
- ✅ role="dialog"
- ✅ aria-modal="true"
- ✅ aria-labelledby for title
- ✅ Focus trap (Tab/Shift+Tab cycles within modal)
- ✅ Escape key closes modal
- ✅ Focus returned to trigger on close
- ✅ First focusable element focused on open
- ✅ Close button has aria-label
- ✅ Body scroll prevented when open

#### Alert Component
```tsx
<Alert variant="error" dismissible onDismiss={handleDismiss}>
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong</AlertDescription>
</Alert>
```
- ✅ role="alert"
- ✅ aria-live="assertive" for errors/warnings
- ✅ aria-live="polite" for info/success
- ✅ aria-atomic="true"
- ✅ Dismissible with keyboard
- ✅ Dismiss button has aria-label
- ✅ Icons hidden from screen readers

#### Table Component
```tsx
<Table>
  <TableCaption>List of patients</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead sortable sortDirection="asc" onSort={handleSort}>
        Name
      </TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow selected clickable>
      <TableCell>John Doe</TableCell>
    </TableRow>
  </TableBody>
</Table>
```
- ✅ caption element for description
- ✅ scope="col" on headers
- ✅ aria-sort for sortable columns
- ✅ Sortable columns keyboard accessible (Enter/Space)
- ✅ Sortable columns have tabindex="0"
- ✅ aria-selected for selectable rows
- ✅ Sort icons hidden with aria-hidden

### Layout Components

#### AppLayout
```tsx
<AppLayout>
  {/* Page content */}
</AppLayout>
```
- ✅ Skip to main content link (visible on focus)
- ✅ Landmark regions (header, nav, main)
- ✅ role="navigation" with aria-label
- ✅ role="banner" on header
- ✅ role="main" on main content
- ✅ aria-current="page" for active navigation
- ✅ aria-disabled for inaccessible items
- ✅ Tooltips for disabled items

## CSS Accessibility Utilities

### Screen Reader Only Class
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Show when focused (for skip links) */
.sr-only:focus,
.sr-only:active {
  position: static;
  width: auto;
  height: auto;
  /* ... restored properties */
}
```

### Focus Utilities
```css
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
}

.focus-ring-inset {
  @apply focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500;
}
```

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### High Contrast Support
```css
@media (prefers-contrast: high) {
  * {
    border-color: currentColor;
  }

  button,
  a {
    text-decoration: underline;
  }
}
```

## Testing Checklist

### Keyboard Navigation
- [ ] Tab through entire application
- [ ] All interactive elements reachable
- [ ] Focus indicators visible
- [ ] No keyboard traps
- [ ] Skip links work
- [ ] Modals trap focus
- [ ] Escape closes dialogs
- [ ] Arrow keys work in tabs/menus

### Screen Reader Testing
- [ ] Test with NVDA (Windows)
- [ ] Test with JAWS (Windows)
- [ ] Test with VoiceOver (Mac)
- [ ] Test with TalkBack (Android)
- [ ] All content announced
- [ ] Form labels read correctly
- [ ] Errors announced
- [ ] Status updates announced
- [ ] Headings navigable
- [ ] Landmarks navigable

### Visual Testing
- [ ] Color contrast meets AA (4.5:1 for text)
- [ ] Focus indicators visible on all backgrounds
- [ ] Text readable at 200% zoom
- [ ] No horizontal scroll at 320px width
- [ ] Content reflows properly

### Automated Testing
- [ ] axe DevTools shows no violations
- [ ] Lighthouse accessibility score 90+
- [ ] WAVE shows no errors
- [ ] Pa11y CI passes

## Best Practices

### When Creating New Components

1. **Start with Semantic HTML**
   - Use `<button>` for actions, `<a>` for navigation
   - Use proper heading hierarchy (h1-h6)
   - Use `<form>`, `<label>`, `<input>` for forms
   - Use `<nav>`, `<main>`, `<header>`, `<footer>` for landmarks

2. **Add ARIA Only When Needed**
   - Don't use ARIA if HTML semantics are sufficient
   - Test with a screen reader before adding ARIA
   - Follow WAI-ARIA Authoring Practices

3. **Ensure Keyboard Accessibility**
   - All interactive elements must be focusable
   - Provide keyboard equivalents for mouse actions
   - Maintain logical tab order
   - Show focus indicators

4. **Test Early and Often**
   - Test with keyboard only (unplug mouse)
   - Test with screen reader
   - Run automated tools (axe, Lighthouse)
   - Test on multiple devices

5. **Document Accessibility Features**
   - Add comments explaining ARIA usage
   - Document keyboard shortcuts
   - Provide usage examples

## Common Patterns

### Form Validation
```tsx
// Good: Error announced immediately
<Input
  label="Email"
  type="email"
  error={errors.email}
  aria-invalid={!!errors.email}
  aria-describedby="email-error"
/>
{errors.email && (
  <p id="email-error" role="alert">
    {errors.email}
  </p>
)}
```

### Loading States
```tsx
// Good: Loading state announced
<Button loading disabled>
  <span className="sr-only">Loading</span>
  Save Changes
</Button>
```

### Icon-Only Buttons
```tsx
// Good: Descriptive label for screen readers
<button aria-label="Close dialog">
  <X className="h-4 w-4" aria-hidden="true" />
</button>
```

### Dynamic Content Updates
```tsx
// Good: Updates announced via live region
<div role="status" aria-live="polite" aria-atomic="true">
  {count} items found
</div>
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse Accessibility Audits](https://developers.google.com/web/tools/lighthouse)

## Support

For accessibility questions or issues:
1. Check this documentation
2. Review WCAG guidelines
3. Test with screen reader
4. Consult WAI-ARIA Authoring Practices
5. Contact the accessibility team

## Changelog

### 2025-10-24 - Initial Accessibility Audit
- ✅ Added aria-required to all form components
- ✅ Added focus trap to Modal component
- ✅ Added keyboard navigation to Tabs component
- ✅ Added aria-sort and keyboard support to Table component
- ✅ Added role="search" to SearchInput component
- ✅ Added role="switch" to Switch component
- ✅ Enhanced global CSS with accessibility utilities
- ✅ Added prefers-reduced-motion support
- ✅ Added prefers-contrast support
- ✅ Improved focus indicators across all components
- ✅ Added proper ARIA live regions to Alerts
- 🔧 In Progress: Full ARIA combobox implementation for Select component

### Future Improvements
- [ ] Complete ARIA combobox pattern for Select component
- [ ] Add keyboard shortcuts documentation
- [ ] Implement accessible data visualization components
- [ ] Add accessibility statement to website
- [ ] Create accessibility testing automation
