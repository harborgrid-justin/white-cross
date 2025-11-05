# Accessibility Testing Guide
**Module**: Identity & Access Management
**Date**: 2025-11-04
**Target**: WCAG 2.1 Level AA

---

## Table of Contents

1. [Quick Start Checklist](#quick-start-checklist)
2. [Automated Testing](#automated-testing)
3. [Keyboard Navigation Testing](#keyboard-navigation-testing)
4. [Screen Reader Testing](#screen-reader-testing)
5. [Visual Accessibility Testing](#visual-accessibility-testing)
6. [Component-Specific Testing](#component-specific-testing)
7. [Tools and Resources](#tools-and-resources)

---

## Quick Start Checklist

Use this checklist for every new feature or component:

- [ ] **Keyboard Navigation**: Can you complete all tasks using only the keyboard?
- [ ] **Focus Indicators**: Are all interactive elements visibly focused?
- [ ] **Screen Reader**: Does NVDA/VoiceOver announce all content correctly?
- [ ] **Color Contrast**: Do all colors meet 4.5:1 (text) or 3:1 (UI) ratio?
- [ ] **Text Resize**: Does content remain usable at 200% zoom?
- [ ] **Automated Tests**: Does axe-core report 0 violations?
- [ ] **Labels**: Do all form fields have labels?
- [ ] **ARIA**: Are all dynamic updates announced?
- [ ] **Errors**: Are all errors identified and explained?
- [ ] **Mobile**: Does it work on touch screens?

---

## Automated Testing

### 1. axe-core Integration

**Setup** (if not already installed):
```bash
npm install --save-dev @axe-core/react jest-axe
```

**Usage in Tests**:
```typescript
import { render } from '@testing-utils/test-utils';
import { axe, toHaveNoViolations } from 'jest-axe';
import { SessionWarningModal } from './SessionWarningModal';

expect.extend(toHaveNoViolations);

test('SessionWarningModal should have no accessibility violations', async () => {
  const { container } = render(
    <SessionWarningModal
      isOpen={true}
      timeRemainingSeconds={120}
      onExtendSession={() => {}}
      onLogout={() => {}}
    />
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

**Run Tests**:
```bash
npm test
```

---

### 2. Lighthouse CI

**Run Lighthouse Audit**:
```bash
npm run build
npx lighthouse http://localhost:3000/login --view
```

**Target Scores**:
- Accessibility: **100**
- Best Practices: **95+**
- Performance: **90+**

**Check**:
- [ ] Accessibility score is 100
- [ ] No accessibility violations reported
- [ ] Color contrast passes
- [ ] ARIA attributes are valid

---

### 3. Pa11y

**Install**:
```bash
npm install --save-dev pa11y
```

**Run**:
```bash
npx pa11y http://localhost:3000/login
```

**Expected Output**:
```
No issues found!
```

---

## Keyboard Navigation Testing

### General Keyboard Testing

**Unplug your mouse** and test using only the keyboard.

#### Basic Navigation

| Key | Expected Behavior |
|-----|-------------------|
| `Tab` | Move focus to next interactive element |
| `Shift+Tab` | Move focus to previous interactive element |
| `Enter` | Activate buttons, submit forms |
| `Space` | Activate buttons, toggle checkboxes |
| `Escape` | Close modals/dialogs |
| `Arrow Keys` | Navigate within menus/lists (where applicable) |

#### Test Procedure

1. **Start at the top of the page**
   ```
   Press Tab repeatedly and verify:
   - [ ] Focus moves in logical order (top to bottom, left to right)
   - [ ] Every interactive element can receive focus
   - [ ] Focus is VISIBLE on every element
   - [ ] No elements are skipped
   - [ ] No keyboard trap (you can tab out of every element)
   ```

2. **Test reverse navigation**
   ```
   Press Shift+Tab and verify:
   - [ ] Focus moves in reverse order
   - [ ] All elements can be reached in reverse
   - [ ] Focus indicators remain visible
   ```

3. **Test activation**
   ```
   Press Enter or Space on each interactive element and verify:
   - [ ] Buttons activate
   - [ ] Links navigate
   - [ ] Forms submit (on submit button)
   - [ ] Checkboxes toggle
   - [ ] Modals open
   ```

4. **Test escape key**
   ```
   Open a modal and press Escape:
   - [ ] Modal closes
   - [ ] Focus returns to trigger element
   - [ ] No JavaScript errors
   ```

---

### Component-Specific Keyboard Testing

#### SessionWarningModal

**Test Scenario**: Session timeout warning appears

**Expected Keyboard Behavior**:

1. **Modal Opens**
   - [ ] Focus automatically moves to "Stay Logged In" button (primary action)
   - [ ] Screen reader announces modal title and description
   - [ ] Countdown is announced periodically

2. **Tab Navigation**
   ```
   Starting from "Stay Logged In" button:
   Tab → "Logout Now" button → "Stay Logged In" button (loops)
   ```
   - [ ] Focus loops between the two buttons
   - [ ] Cannot tab outside the modal
   - [ ] Shift+Tab also works in reverse

3. **Escape Key**
   ```
   Press Escape
   ```
   - [ ] Extends session (same as clicking "Stay Logged In")
   - [ ] Modal closes
   - [ ] Focus returns to document
   - [ ] Countdown stops

4. **Enter Key**
   ```
   Press Enter on focused button
   ```
   - [ ] "Stay Logged In": Extends session and closes modal
   - [ ] "Logout Now": Logs out user

**Test Script**:
```typescript
// Open developer tools, run:
// 1. Trigger warning modal (wait 13 minutes or simulate)
// 2. Don't touch mouse, only use keyboard
// 3. Tab through buttons
// 4. Press Escape - should extend session
// 5. Reopen modal
// 6. Tab to "Logout Now", press Enter - should logout
```

---

#### AuthGuard

**Test Scenario**: Unauthenticated user accesses protected page

**Expected Keyboard Behavior**:

1. **Loading State**
   - [ ] Loading message is announced to screen readers
   - [ ] "Verifying authentication..." is visible
   - [ ] Cannot interact with background content

2. **Redirect State**
   - [ ] "Redirecting to login..." is announced
   - [ ] Redirect happens after short delay
   - [ ] Focus moves appropriately after redirect

**Test Script**:
```typescript
// 1. Logout from application
// 2. Navigate to protected page (e.g., /dashboard)
// 3. Verify loading message appears
// 4. Verify redirect to login page happens
// 5. Check that redirect URL includes ?redirect= parameter
```

---

#### Login Form

**Test Scenario**: User logs in with keyboard

**Expected Keyboard Behavior**:

1. **Focus Order**
   ```
   Email field → Password field → "Remember Me" checkbox → Submit button
   ```

2. **Form Interaction**
   - [ ] Tab moves between fields in logical order
   - [ ] Email field has autocomplete="email"
   - [ ] Password field has autocomplete="current-password"
   - [ ] Can toggle "Remember Me" with Space bar
   - [ ] Enter on any field submits form
   - [ ] Enter on submit button submits form

3. **Error Handling**
   - [ ] Validation errors are announced
   - [ ] Focus moves to first error field
   - [ ] Can navigate to error messages
   - [ ] Error messages are associated with fields

**Test Script**:
```typescript
// 1. Tab to email field
// 2. Type invalid email: "test" (no @)
// 3. Tab to password field
// 4. Type short password: "123" (< 8 chars)
// 5. Tab to submit button
// 6. Press Enter
// 7. Verify:
//    - Error messages appear
//    - Errors are announced
//    - Can tab to error messages
//    - Focus returns to first error field
```

---

## Screen Reader Testing

### Screen Reader Setup

**Windows - NVDA (Free)**:
1. Download: https://www.nvaccess.org/download/
2. Install and launch NVDA
3. Press `Insert+Q` to quit NVDA

**Mac - VoiceOver (Built-in)**:
1. Press `Cmd+F5` to start VoiceOver
2. Press `Cmd+F5` again to stop

**NVDA Keyboard Shortcuts**:
- `Insert+Down Arrow`: Read from current position
- `Insert+Space`: Toggle browse/focus mode
- `Tab`: Navigate to next interactive element
- `H`: Next heading
- `D`: Next landmark
- `F`: Next form field
- `B`: Next button

---

### Screen Reader Test Procedure

#### 1. Page Load Test

**Action**: Navigate to login page

**Expected Announcements**:
```
[NVDA] Heading level 1: White Cross - Login
[NVDA] Edit: Email Address, required
```

**Verify**:
- [ ] Page title is announced
- [ ] Main heading is announced
- [ ] Landmarks are identified (main, navigation)
- [ ] Language is identified as English

---

#### 2. Form Field Test

**Action**: Tab to email field

**Expected Announcements**:
```
[NVDA] Edit: Email Address, required, blank
```

**Verify**:
- [ ] Field label is announced ("Email Address")
- [ ] Field type is announced ("Edit" for text input)
- [ ] Required state is announced
- [ ] Current value is announced ("blank" if empty)

**Action**: Type "test@example.com"

**Expected Announcements**:
```
[NVDA] t, e, s, t, @, e, x, a, m, p, l, e, ., c, o, m
```

**Verify**:
- [ ] Each character is announced as you type

---

#### 3. Error Message Test

**Action**: Submit form with invalid email

**Expected Announcements**:
```
[NVDA] Alert: Authentication Error
[NVDA] Invalid email or password. Please try again.
```

**Verify**:
- [ ] Error is announced immediately (role="alert")
- [ ] Error type is identified ("Authentication Error")
- [ ] Error message is descriptive
- [ ] Error is associated with field (aria-describedby)

---

#### 4. Modal Dialog Test

**Action**: Wait for session warning modal or simulate

**Expected Announcements**:
```
[NVDA] Alert dialog
[NVDA] Session Expiring Soon
[NVDA] Your session will expire in 2 minutes due to inactivity. For security and HIPAA compliance, you will be automatically logged out.
[NVDA] Button: Stay Logged In
```

**Verify**:
- [ ] Dialog type is announced ("Alert dialog")
- [ ] Dialog title is announced
- [ ] Dialog description is announced
- [ ] Focus moves to primary button
- [ ] Countdown updates are announced periodically
- [ ] Can navigate to both buttons
- [ ] Can close with Escape key

---

#### 5. Loading State Test

**Action**: Navigate to protected page while logged out

**Expected Announcements**:
```
[NVDA] Status: Verifying authentication...
[NVDA] Status: Redirecting to login page...
```

**Verify**:
- [ ] Loading state is announced
- [ ] Redirect intent is announced
- [ ] Status updates are polite, not interruptive

---

### Screen Reader Checklist

For every component, verify:

- [ ] All text content is announced
- [ ] All images have alt text or are marked decorative
- [ ] All form fields have labels
- [ ] All buttons have descriptive text
- [ ] All links have descriptive text
- [ ] All headings are properly nested
- [ ] All landmarks are identified
- [ ] All live regions announce updates
- [ ] All modals announce title and description
- [ ] All errors are announced immediately
- [ ] All status messages are announced
- [ ] Navigation is clear and logical

---

## Visual Accessibility Testing

### 1. Color Contrast Testing

**Tool**: WebAIM Color Contrast Checker
**URL**: https://webaim.org/resources/contrastchecker/

**Test Each Color Combination**:

| Element | Foreground | Background | Ratio | Required | Status |
|---------|------------|------------|-------|----------|--------|
| Body text | #1F2937 | #FFFFFF | 16.1:1 | 4.5:1 | ✅ PASS |
| Link text | #2563EB | #FFFFFF | 8.6:1 | 4.5:1 | ✅ PASS |
| Error text | #DC2626 | #FFFFFF | 5.9:1 | 4.5:1 | ✅ PASS |
| Success text | #059669 | #FFFFFF | 4.5:1 | 4.5:1 | ✅ PASS |
| Button border | #2563EB | #FFFFFF | 8.6:1 | 3:1 | ✅ PASS |
| Focus indicator | #2563EB | #FFFFFF | 8.6:1 | 3:1 | ✅ PASS |
| Input border | #D1D5DB | #FFFFFF | 2.1:1 | 3:1 | ⚠️ Check |

**Verification Procedure**:
1. Open Color Contrast Checker
2. Enter foreground color (e.g., #1F2937)
3. Enter background color (e.g., #FFFFFF)
4. Verify ratio meets requirement
5. Document any failures

---

### 2. Focus Indicator Testing

**Procedure**:
1. Tab to each interactive element
2. Verify focus indicator is visible
3. Measure focus indicator contrast

**Checklist**:
- [ ] Focus indicator is at least 2px thick
- [ ] Focus indicator has 3:1 contrast with adjacent colors
- [ ] Focus indicator is visible on all backgrounds
- [ ] Focus indicator does not obscure content
- [ ] Focus indicator animates smoothly (if animated)

**Browser DevTools Test**:
```javascript
// Run in console to highlight all focusable elements
document.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])').forEach(el => {
  el.style.outline = '2px solid red';
});
```

---

### 3. Text Resize Testing

**Procedure**:
1. Set browser zoom to 100%
2. Increase zoom to 200% (Ctrl/Cmd + Plus)
3. Verify content remains usable

**Checklist**:
- [ ] All text remains readable
- [ ] No content is cut off
- [ ] No overlapping text
- [ ] All interactive elements remain clickable
- [ ] Layout doesn't break
- [ ] No horizontal scrolling on main content

**Test at Multiple Zoom Levels**:
- [ ] 100% (baseline)
- [ ] 150% (intermediate)
- [ ] 200% (WCAG requirement)
- [ ] 400% (reflow check)

---

### 4. Responsive Design Testing

**Procedure**:
1. Resize browser window to 320px width
2. Verify content reflows without horizontal scrolling

**Viewport Sizes to Test**:
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone X)
- [ ] 768px (iPad portrait)
- [ ] 1024px (iPad landscape)
- [ ] 1920px (Desktop)

**Checklist**:
- [ ] No horizontal scrolling required
- [ ] All content is accessible
- [ ] Touch targets are at least 44x44px
- [ ] Form fields are usable
- [ ] Buttons are tappable

---

### 5. Reduced Motion Testing

**Procedure**:
1. Enable reduced motion in OS settings
2. Reload page
3. Verify animations are disabled or simplified

**Windows**:
```
Settings → Ease of Access → Display → Show animations in Windows
Toggle OFF
```

**Mac**:
```
System Preferences → Accessibility → Display → Reduce Motion
Check ON
```

**Checklist**:
- [ ] Loading spinners don't rotate (or rotate minimally)
- [ ] Transitions are instant or very short
- [ ] No parallax scrolling
- [ ] No auto-playing videos
- [ ] Page remains fully functional

**CSS Test**:
```css
/* Verify this CSS rule exists */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Component-Specific Testing

### SessionWarningModal

**Full Test Script**:

```typescript
/**
 * SessionWarningModal Accessibility Test
 *
 * This comprehensive test covers all accessibility aspects of the session warning modal.
 */

// 1. AUTOMATED TEST
test('SessionWarningModal has no axe violations', async () => {
  const { container } = render(
    <SessionWarningModal
      isOpen={true}
      timeRemainingSeconds={120}
      onExtendSession={jest.fn()}
      onLogout={jest.fn()}
    />
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// 2. ARIA ATTRIBUTES TEST
test('SessionWarningModal has correct ARIA attributes', () => {
  const { getByRole } = render(<SessionWarningModal isOpen={true} {...props} />);

  const dialog = getByRole('alertdialog');
  expect(dialog).toHaveAttribute('aria-modal', 'true');
  expect(dialog).toHaveAttribute('aria-labelledby');
  expect(dialog).toHaveAttribute('aria-describedby');
});

// 3. FOCUS MANAGEMENT TEST
test('SessionWarningModal traps focus', () => {
  const { getByTestId } = render(<SessionWarningModal isOpen={true} {...props} />);

  const extendButton = getByTestId('extend-session-button');
  const logoutButton = getByTestId('logout-button');

  // Primary button should receive initial focus
  expect(document.activeElement).toBe(extendButton);

  // Tab should move to next button
  userEvent.tab();
  expect(document.activeElement).toBe(logoutButton);

  // Tab should cycle back to first button
  userEvent.tab();
  expect(document.activeElement).toBe(extendButton);
});

// 4. KEYBOARD TEST
test('SessionWarningModal responds to Escape key', () => {
  const onExtend = jest.fn();
  const { getByRole } = render(
    <SessionWarningModal isOpen={true} onExtendSession={onExtend} {...props} />
  );

  const dialog = getByRole('alertdialog');
  fireEvent.keyDown(dialog, { key: 'Escape' });

  expect(onExtend).toHaveBeenCalled();
});

// 5. SCREEN READER TEST (manual)
// Use NVDA or VoiceOver to verify:
// - Modal title is announced
// - Modal description is announced
// - Countdown is announced periodically
// - Button labels are announced
// - "Stay Logged In" button receives initial focus
```

**Manual Checklist**:
- [ ] Keyboard navigation works (Tab, Shift+Tab, Escape)
- [ ] Focus trap is active
- [ ] Focus returns after close
- [ ] Screen reader announces title and description
- [ ] Countdown is announced every 30 seconds
- [ ] All buttons are announced with full text
- [ ] Color contrast meets requirements
- [ ] Works at 200% zoom
- [ ] Works on mobile devices

---

### AuthErrorAlert

**Full Test Script**:

```typescript
test('AuthErrorAlert announces errors assertively', async () => {
  const { container, getByRole } = render(
    <AuthErrorAlert error="Invalid credentials" onDismiss={jest.fn()} />
  );

  // Check for role="alert" (assertive)
  const alert = getByRole('alert');
  expect(alert).toHaveAttribute('aria-live', 'assertive');

  // Check for error message
  expect(alert).toHaveTextContent('Invalid credentials');

  // Check for no axe violations
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

**Manual Checklist**:
- [ ] Error announced immediately on appearance
- [ ] Error message is clear and actionable
- [ ] Dismiss button is keyboard accessible
- [ ] Dismiss button has aria-label
- [ ] Icon is marked aria-hidden="true"
- [ ] Color contrast meets requirements
- [ ] Error is not conveyed by color alone (has icon + text)

---

## Tools and Resources

### Browser Extensions

**Chrome/Edge**:
- [axe DevTools](https://chrome.google.com/webstore/detail/axe-devtools/lhdoppojpmngadmnindnejefpokejbdd)
- [WAVE](https://chrome.google.com/webstore/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

**Firefox**:
- [axe DevTools](https://addons.mozilla.org/en-US/firefox/addon/axe-devtools/)
- [WAVE](https://addons.mozilla.org/en-US/firefox/addon/wave-accessibility-tool/)

### Color Tools

- [WebAIM Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser (CCA)](https://www.tpgi.com/color-contrast-checker/)
- [Stark](https://www.getstark.co/) - Figma/Sketch plugin

### Screen Readers

- [NVDA](https://www.nvaccess.org/) - Windows (Free)
- [JAWS](https://www.freedomscientific.com/products/software/jaws/) - Windows (Paid)
- VoiceOver - Mac/iOS (Built-in)
- TalkBack - Android (Built-in)

### Testing Tools

- [axe-core](https://github.com/dequelabs/axe-core) - Automated testing
- [jest-axe](https://github.com/nickcolley/jest-axe) - Jest integration
- [Pa11y](https://pa11y.org/) - Automated testing
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) - CI/CD integration

### Documentation

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Articles](https://webaim.org/articles/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

---

## Continuous Integration

### GitHub Actions Example

```yaml
name: Accessibility Tests

on: [push, pull_request]

jobs:
  a11y-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run accessibility tests
        run: npm test -- --coverage

      - name: Build application
        run: npm run build

      - name: Start server
        run: npm start &
        env:
          NODE_ENV: production

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun --config=./lighthouserc.json

      - name: Run Pa11y
        run: |
          npm install -g pa11y-ci
          pa11y-ci --config .pa11yci.json
```

---

## Conclusion

This testing guide ensures comprehensive accessibility testing for the identity-access module. Follow these procedures for all new features and components to maintain WCAG 2.1 AA compliance.

**Questions or Issues?**
- Review `wcag-compliance.md` for specific success criteria
- Review `screen-reader-announcements.md` for expected screen reader behavior
- Review `keyboard-navigation.md` for keyboard interaction patterns
