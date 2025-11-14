# Architecture Notes - Accessibility Architect (A11Y6X)

## WCAG Compliance Strategy

### Target Compliance Level
- **Primary**: WCAG 2.1 Level AA
- **Stretch Goal**: WCAG 2.2 Level AA where applicable
- **Methodology**: Progressive enhancement with accessibility-first design

### Success Criteria Coverage

#### Level A (Minimum - All Required)
1. **1.1.1 Non-text Content**: All icons marked `aria-hidden="true"` with text alternatives
2. **2.1.1 Keyboard**: All functionality available via keyboard
3. **2.1.2 No Keyboard Trap**: Focus trap only in modals, escapable with Esc key
4. **3.2.1 On Focus**: No automatic context changes
5. **3.2.2 On Input**: No automatic form submission
6. **4.1.1 Parsing**: Valid semantic HTML
7. **4.1.2 Name, Role, Value**: ARIA attributes for all components

#### Level AA (Target - All Required)
1. **1.4.3 Contrast (Minimum)**: 4.5:1 for text, 3:1 for UI components
2. **1.4.5 Images of Text**: Use actual text, not images
3. **2.4.6 Headings and Labels**: Descriptive headings and labels
4. **2.4.7 Focus Visible**: Clear focus indicators on all interactive elements
5. **3.2.3 Consistent Navigation**: Consistent patterns across module
6. **3.2.4 Consistent Identification**: Consistent component behavior
7. **3.3.3 Error Suggestion**: Actionable error messages
8. **3.3.4 Error Prevention**: Confirmation for logout and critical actions
9. **4.1.3 Status Messages**: Proper announcements for dynamic content

---

## Semantic HTML Approach

### Document Structure
```html
<!-- Guard components use semantic elements -->
<main role="main">
  <!-- Content after auth check -->
</main>

<!-- Modals use proper dialog pattern -->
<div role="alertdialog" aria-modal="true" aria-labelledby="..." aria-describedby="...">
  <!-- Modal content -->
</div>

<!-- Loading states use status role -->
<div role="status" aria-live="polite">
  Loading...
</div>
```

### Form Semantics
- Explicit label associations via `for` attribute
- Fieldset/legend for grouped controls
- Required fields marked with `aria-required="true"`
- Error messages linked via `aria-describedby`

### Interactive Element Patterns
- Native `<button>` elements for all actions
- No `<div>` or `<span>` buttons
- Links (`<a>`) only for navigation
- Proper button types (`button`, `submit`, `reset`)

---

## ARIA Implementation

### ARIA Role Strategy

**Modal Dialogs**:
```tsx
<div
  role="alertdialog"  // or "dialog" for non-urgent
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
```

**Loading States**:
```tsx
<div role="status" aria-live="polite" aria-busy="true">
  Loading...
</div>
```

**Error Alerts**:
```tsx
<div role="alert" aria-live="assertive">
  Error message
</div>
```

**Success Messages**:
```tsx
<div role="status" aria-live="polite">
  Success message
</div>
```

### aria-label and aria-labelledby Usage

**Visible Label (Preferred)**:
```tsx
<button aria-labelledby="button-text">
  <span id="button-text">Close</span>
</button>
```

**Hidden Label (When Necessary)**:
```tsx
<button aria-label="Close dialog">
  <XIcon aria-hidden="true" />
</button>
```

**Input Fields**:
```tsx
<!-- Visible label -->
<label htmlFor="email">Email</label>
<input id="email" type="email" />

<!-- Screen reader only label -->
<input id="search" type="text" aria-label="Search" />
```

### Live Regions for Dynamic Content

**Countdown Timer**:
```tsx
<div aria-live="polite" aria-atomic="true">
  Session expires in {minutes}:{seconds}
</div>
```

**Form Validation**:
```tsx
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>
```

**Loading Updates**:
```tsx
<div role="status" aria-live="polite">
  {loadingMessage}
</div>
```

### State and Property Management

**Buttons**:
- `aria-pressed` for toggle buttons
- `aria-expanded` for disclosure buttons
- `aria-current` for navigation

**Forms**:
- `aria-required="true"` for required fields
- `aria-invalid="true"` for fields with errors
- `aria-describedby` linking to hints/errors
- `aria-errormessage` for error text

**Modals**:
- `aria-modal="true"` to indicate modal behavior
- `aria-hidden="true"` on background content when modal open
- `inert` attribute on background (future)

---

## Keyboard Navigation

### Focus Order and Tab Index Strategy

**Natural Tab Order (Preferred)**:
```tsx
// Use semantic HTML in logical order
<button>First</button>
<button>Second</button>
<button>Third</button>
```

**Programmatic Focus**:
```tsx
// tabindex="-1" for programmatic focus only
<div tabIndex={-1} ref={focusRef}>
  Content that can be focused programmatically
</div>
```

**Modal Focus Trap**:
```tsx
const focusableElements = modal.querySelectorAll(
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
);

// Trap Tab/Shift+Tab within modal
if (e.key === 'Tab') {
  if (e.shiftKey && document.activeElement === firstElement) {
    e.preventDefault();
    lastElement.focus();
  } else if (!e.shiftKey && document.activeElement === lastElement) {
    e.preventDefault();
    firstElement.focus();
  }
}
```

### Keyboard Shortcuts

**Modal Navigation**:
- `Escape`: Close modal or trigger primary action (context-dependent)
- `Tab`: Move to next focusable element
- `Shift+Tab`: Move to previous focusable element
- `Enter`: Activate focused button
- `Space`: Activate focused button

**Form Navigation**:
- `Tab`: Next field
- `Shift+Tab`: Previous field
- `Enter`: Submit form (on submit button)
- `Escape`: Cancel/reset (if applicable)

### Focus Trap Patterns (Modals, Menus)

**SessionWarningModal Focus Trap**:
1. On open: Focus "Stay Logged In" button (primary action)
2. Tab from last button: Focus first button
3. Shift+Tab from first button: Focus last button
4. Escape key: Trigger primary action (extend session)
5. On close: Return focus to document body

**Implementation**:
```tsx
const useFocusTrap = (isOpen: boolean, containerRef: RefObject<HTMLElement>) => {
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(/* ... */);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Implement focus trap logic
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, containerRef]);
};
```

### Skip Links Implementation

**Skip to Main Content**:
```tsx
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
<main id="main-content">
  <!-- Content -->
</main>
```

---

## Screen Reader Optimization

### Announcement Patterns

**Form Validation Errors (Assertive)**:
```tsx
<div role="alert" aria-live="assertive">
  Email is required
</div>
```

**Dynamic Content Updates (Polite)**:
```tsx
<div role="status" aria-live="polite" aria-atomic="true">
  {itemCount} items found
</div>
```

**Loading States (Polite)**:
```tsx
<div role="status" aria-live="polite" aria-busy={isLoading}>
  {isLoading ? 'Loading...' : 'Content loaded'}
</div>
```

**Success Messages (Polite)**:
```tsx
<div role="status" aria-live="polite">
  Login successful. Redirecting...
</div>
```

**Countdown Timer (Polite, Periodic)**:
```tsx
// Announce every 30 seconds, not every second
<div aria-live="polite" aria-atomic="true">
  {minutes > 0 ? `${minutes} minutes remaining` : `${seconds} seconds remaining`}
</div>
```

### Hidden Content Strategy

**Screen Reader Only Text**:
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

.sr-only:focus,
.sr-only:active {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

**Visually Hidden, Announced to Screen Readers**:
```tsx
<span className="sr-only">Error:</span>
<span>Email is required</span>
```

**Hidden from Screen Readers**:
```tsx
<div aria-hidden="true">
  <Icon />
</div>
```

### Label Associations

**Explicit Labels**:
```tsx
<label htmlFor="email-input">Email Address</label>
<input id="email-input" type="email" name="email" />
```

**aria-label (No Visible Label)**:
```tsx
<input type="search" aria-label="Search users" />
```

**aria-labelledby (Multiple Labels)**:
```tsx
<div id="billing-heading">Billing Address</div>
<div id="street-label">Street</div>
<input id="billing-street" aria-labelledby="billing-heading street-label" />
```

### Description Patterns

**Field Hints**:
```tsx
<label htmlFor="password">Password</label>
<input
  id="password"
  type="password"
  aria-describedby="password-hint password-error"
  aria-invalid={hasError}
/>
<div id="password-hint">Must be at least 8 characters</div>
{hasError && (
  <div id="password-error" role="alert">
    Password is too short
  </div>
)}
```

**Complex Descriptions**:
```tsx
<button aria-describedby="logout-description">
  Logout
</button>
<div id="logout-description" className="sr-only">
  Logging out will end your current session and you will need to log in again to access your account
</div>
```

---

## Visual Accessibility

### Color Contrast Compliance

**Normal Text (4.5:1 minimum)**:
- Body text: #1F2937 on #FFFFFF (16.1:1) ✓
- Link text: #2563EB on #FFFFFF (8.6:1) ✓
- Error text: #DC2626 on #FFFFFF (5.9:1) ✓

**Large Text (3:1 minimum)**:
- Headings: #111827 on #FFFFFF (18.7:1) ✓
- Subheadings: #374151 on #FFFFFF (12.6:1) ✓

**UI Components (3:1 minimum)**:
- Button border: #2563EB on #FFFFFF (8.6:1) ✓
- Input border: #D1D5DB on #FFFFFF (2.1:1) ✗ - Needs improvement
- Focus indicator: #2563EB (3:1 minimum) ✓

**Action Required**:
- Increase input border contrast to meet 3:1 minimum
- Ensure disabled state maintains 3:1 contrast for visibility

### Focus Indicators

**Default Focus Style**:
```css
:focus {
  outline: 2px solid #2563EB;
  outline-offset: 2px;
}

:focus:not(:focus-visible) {
  outline: none;
}

:focus-visible {
  outline: 2px solid #2563EB;
  outline-offset: 2px;
}
```

**Button Focus**:
```css
button:focus-visible {
  outline: 2px solid #2563EB;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}
```

**Input Focus**:
```css
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid #2563EB;
  outline-offset: 0;
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
```

### Text Scaling Support

**Base Font Size**: 16px (1rem)
**Line Height**: 1.5 (body text), 1.2 (headings)
**Responsive Typography**: Uses relative units (rem, em)

**200% Zoom Test**:
- Text must be readable at 200% zoom
- No horizontal scrolling required
- No content overlap
- Maintain layout integrity

**Implementation**:
```css
body {
  font-size: 16px; /* Base size */
  line-height: 1.5;
}

h1 { font-size: 2rem; } /* 32px */
h2 { font-size: 1.5rem; } /* 24px */
p { font-size: 1rem; } /* 16px */
small { font-size: 0.875rem; } /* 14px */
```

### Reduced Motion Support

**Respect User Preferences**:
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

**Alternative to Animations**:
- Use instant state changes
- Maintain visual feedback without motion
- Preserve usability without animations

---

## Component-Specific Implementation

### SessionWarningModal

**ARIA Attributes**:
```tsx
<div
  role="alertdialog"
  aria-modal="true"
  aria-labelledby="session-warning-title"
  aria-describedby="session-warning-description"
>
  <h2 id="session-warning-title">Session Expiring Soon</h2>
  <p id="session-warning-description">
    Your session will expire in{' '}
    <span aria-live="polite" aria-atomic="true">
      {minutes}:{seconds}
    </span>
  </p>
  <button autoFocus>Stay Logged In</button>
  <button>Logout Now</button>
</div>
```

**Keyboard Behavior**:
- `Escape`: Extend session (primary action)
- `Tab`: Navigate between buttons
- `Enter`/`Space`: Activate button
- Focus trapped within modal

### AuthGuard

**Loading State**:
```tsx
<div role="status" aria-live="polite" aria-busy="true">
  <span className="sr-only">Verifying authentication...</span>
</div>
```

**Redirect Announcement**:
```tsx
<div role="status" aria-live="polite">
  <span className="sr-only">Redirecting to login...</span>
</div>
```

### AuthErrorAlert

**Error Announcement**:
```tsx
<div
  role="alert"
  aria-live="assertive"
  className="error-alert"
>
  <Icon aria-hidden="true" />
  <span>{errorMessage}</span>
  <button aria-label="Dismiss error">
    <XIcon aria-hidden="true" />
  </button>
</div>
```

---

## Testing Strategy

### Automated Testing
- **axe-core**: Integrated into component tests
- **Lighthouse**: CI/CD pipeline integration
- **jest-axe**: Unit test coverage
- **Pa11y**: Automated page scanning

### Manual Testing Checklist
- [ ] Keyboard-only navigation (unplug mouse)
- [ ] Screen reader testing (NVDA, JAWS, VoiceOver)
- [ ] Color contrast verification (Color Contrast Analyzer)
- [ ] Text resize to 200% (browser zoom)
- [ ] Zoom to 400% (responsive layout check)
- [ ] Focus indicator visibility (all interactive elements)
- [ ] Form error handling (screen reader announcements)
- [ ] Modal navigation (focus trap, escape key)
- [ ] Dynamic content updates (live region announcements)

### Screen Reader Testing Matrix

| Component | NVDA | JAWS | VoiceOver | Expected Behavior |
|-----------|------|------|-----------|-------------------|
| SessionWarningModal | ✓ | ✓ | ✓ | Announces title, description, countdown |
| AuthGuard | ✓ | ✓ | ✓ | Announces loading state, redirect |
| AuthErrorAlert | ✓ | ✓ | ✓ | Announces error immediately |
| Form fields | ✓ | ✓ | ✓ | Announces label, hint, error |
| Buttons | ✓ | ✓ | ✓ | Announces button text and state |

---

## Known Issues and Remediation

### Current Issues
1. **Input Border Contrast**: 2.1:1 (needs 3:1 minimum)
2. **No Skip Links**: Missing skip to main content
3. **Inconsistent Focus Indicators**: Some components missing focus styles

### Remediation Plan
1. Update input border color from #D1D5DB to #9CA3AF
2. Add skip link component to main layout
3. Apply consistent focus styles via accessibility.css
4. Review all interactive elements for focus visibility

---

## Maintenance and Governance

### Accessibility Review Process
1. All new components must pass axe-core tests
2. Keyboard navigation must be tested manually
3. Screen reader testing required for complex components
4. Color contrast verification for all new colors
5. Documentation updated for new patterns

### Continuous Improvement
- Monthly accessibility audits
- User feedback integration
- Stay current with WCAG updates
- Regular screen reader testing
- Monitor browser accessibility features

---

## References

- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/
- WebAIM: https://webaim.org/
- Deque University: https://dequeuniversity.com/
- A11y Project: https://www.a11yproject.com/
