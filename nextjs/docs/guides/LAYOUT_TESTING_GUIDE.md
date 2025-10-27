# Layout System Testing Guide

## Overview

This guide provides comprehensive testing instructions for the White Cross Healthcare Platform layout system.

## Testing Environment Setup

### Prerequisites:
1. Node.js 20+ installed
2. npm 8+ installed
3. Project dependencies installed: `npm install`
4. Development server running: `npm run dev`

### Access URLs:
- **Frontend**: http://localhost:3000
- **Auth Pages**: http://localhost:3000/login
- **Dashboard**: http://localhost:3000/dashboard

---

## Manual Testing Checklist

### 1. Layout Groups

#### Auth Layout Group
- [ ] Navigate to `/login`
- [ ] Verify centered authentication layout
- [ ] Check background gradient pattern renders
- [ ] Verify HIPAA compliance footer displays
- [ ] Test "Skip to content" link (Tab, Enter)
- [ ] Check responsive design on mobile (< 768px)

#### Dashboard Layout Group
- [ ] Navigate to `/dashboard`
- [ ] Verify header displays at top
- [ ] Verify sidebar displays on desktop (> 1024px)
- [ ] Verify breadcrumbs appear below header
- [ ] Verify footer appears at bottom
- [ ] Check content scrolls independently

---

### 2. Header Component

#### Desktop (> 1024px)
- [ ] Logo hidden on desktop
- [ ] Search bar visible and clickable
- [ ] Search opens on click
- [ ] Dark mode toggle present and functional
- [ ] Notifications bell present with badge
- [ ] User menu shows name, role, and avatar
- [ ] User menu dropdown opens on click

#### Mobile (< 1024px)
- [ ] Hamburger menu visible
- [ ] Logo visible
- [ ] Search icon visible (bar hidden)
- [ ] Search icon opens search modal
- [ ] Dark mode toggle visible
- [ ] Notifications bell visible
- [ ] User avatar visible (name/role hidden)

#### Search Functionality
- [ ] Search opens with mouse click
- [ ] Search opens with ⌘K (Mac) or Ctrl+K (Windows)
- [ ] Search modal has backdrop
- [ ] Search closes with ESC key
- [ ] Search closes on backdrop click
- [ ] Search input autofocuses
- [ ] Search is keyboard accessible

#### User Menu
- [ ] Menu opens on click
- [ ] Menu closes on outside click
- [ ] Menu shows user name and email
- [ ] Menu shows role badge with correct color
- [ ] Profile link navigates to `/profile`
- [ ] Settings link navigates to `/settings`
- [ ] Sign out button present
- [ ] Menu is keyboard accessible (Tab, Enter)

#### Dark Mode
- [ ] Toggle switches between light and dark
- [ ] Icon changes (Sun ↔ Moon)
- [ ] All components respond to dark mode
- [ ] Preference persists on reload (if implemented)

---

### 3. Sidebar Component

#### Desktop (> 1024px)
- [ ] Sidebar fixed at 256px width
- [ ] Sidebar always visible
- [ ] Logo and branding visible
- [ ] All navigation sections render
- [ ] HIPAA compliance footer shows

#### Navigation Structure
- [ ] **Main** section: Dashboard
- [ ] **Clinical** section: Students, Health Records, Medications, Appointments
- [ ] **Operations** section: Inventory, Budget, Purchase Orders, Vendors
- [ ] **Communications** section: Messages, Notifications, Reminders
- [ ] **Incidents & Reports** section: Incident Reports, Documents, Reports
- [ ] **Analytics** section: Analytics
- [ ] **System** section: Admin Settings, Settings

#### Active Link Highlighting
- [ ] Current page highlighted with primary color
- [ ] Active state persists on page
- [ ] Parent items highlighted for nested routes
- [ ] aria-current="page" attribute set

#### Collapsible Sections
- [ ] Section headers have chevron icons
- [ ] Click toggles section expand/collapse
- [ ] Chevron rotates on toggle
- [ ] Collapsed state hides items
- [ ] Default collapse states respected

#### Badge Indicators
- [ ] Medications shows warning badge (3)
- [ ] Incidents shows error badge (2)
- [ ] Badge colors correct (error=red, warning=yellow)
- [ ] Badge counts display correctly

#### Icons
- [ ] All navigation items have icons
- [ ] Icons render correctly
- [ ] Icons have proper size and spacing

---

### 4. Mobile Navigation Drawer

#### Mobile (< 1024px)
- [ ] Drawer hidden by default
- [ ] Hamburger menu opens drawer
- [ ] Drawer slides in from left
- [ ] Backdrop overlay appears
- [ ] Backdrop has opacity transition
- [ ] Drawer max-width 320px

#### Close Functionality
- [ ] Close button (X) visible in drawer
- [ ] Close button closes drawer
- [ ] Backdrop click closes drawer
- [ ] ESC key closes drawer
- [ ] Navigation link click closes drawer

#### Focus Management
- [ ] First focusable element auto-focused
- [ ] Tab cycles through drawer only
- [ ] Shift+Tab reverse cycles
- [ ] Focus returns to trigger on close

#### Body Scroll Lock
- [ ] Body scroll disabled when drawer open
- [ ] Body scroll re-enabled when drawer closed
- [ ] No content shift on lock/unlock

---

### 5. Breadcrumbs Component

#### Auto-Generation
- [ ] Breadcrumbs generate from pathname
- [ ] Home icon shows for root
- [ ] Segments properly separated
- [ ] Last segment is non-clickable
- [ ] Previous segments are clickable links

#### Label Formatting
- [ ] Default labels display correctly
- [ ] Hyphens converted to spaces
- [ ] Capitalization correct
- [ ] Custom labels override defaults

#### Navigation
- [ ] Clicking breadcrumb navigates
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] aria-label="Breadcrumb" present
- [ ] aria-current="page" on last item

#### Responsive
- [ ] Breadcrumbs truncate on small screens
- [ ] max-w-xs prevents overflow
- [ ] Text ellipsis for long segments

---

### 6. Container Component

#### Max Width Options
- [ ] `maxWidth="sm"` renders max-w-screen-sm
- [ ] `maxWidth="md"` renders max-w-screen-md
- [ ] `maxWidth="lg"` renders max-w-screen-lg
- [ ] `maxWidth="xl"` renders max-w-screen-xl
- [ ] `maxWidth="2xl"` renders max-w-screen-2xl (default)
- [ ] `maxWidth="full"` renders max-w-full

#### Padding
- [ ] Default padding: px-4 sm:px-6 lg:px-8
- [ ] `noPadding={true}` removes padding
- [ ] Responsive padding at breakpoints

#### Centering
- [ ] Container centered with mx-auto
- [ ] Content stays within max-width

---

### 7. Footer Component

#### Content
- [ ] Copyright year displays current year
- [ ] "White Cross Healthcare" branding
- [ ] "HIPAA Compliant Healthcare Platform" text
- [ ] Version number displays (v1.0.0)

#### Links
- [ ] Privacy Policy link navigates
- [ ] Terms of Service link navigates
- [ ] Support link navigates
- [ ] All links keyboard accessible

#### Responsive
- [ ] Desktop: Links on right, copyright on left
- [ ] Mobile: Centered, stacked layout
- [ ] Proper spacing at all breakpoints

---

## Keyboard Navigation Testing

### Global Shortcuts
- [ ] ⌘K / Ctrl+K opens search
- [ ] ESC closes modals/dropdowns/drawer
- [ ] Tab navigates through interactive elements
- [ ] Shift+Tab navigates backward
- [ ] Enter activates links and buttons

### Focus Indicators
- [ ] Focus ring visible on all interactive elements
- [ ] Focus ring color: ring-primary-500
- [ ] Focus ring width: ring-2
- [ ] Focus ring offset: ring-offset-2
- [ ] No outline on mouse click (focus-visible)

### Skip Links
- [ ] "Skip to main content" appears on Tab
- [ ] Link positioned absolutely at top-left
- [ ] Click scrolls to main content
- [ ] Focus moves to main content

---

## Accessibility Testing (WCAG 2.1 AA)

### Screen Reader Testing
**Tools**: NVDA (Windows), JAWS (Windows), VoiceOver (Mac)

- [ ] Landmarks announced (banner, main, navigation, contentinfo)
- [ ] Navigation structure announced
- [ ] Active page announced
- [ ] Expandable sections announced (aria-expanded)
- [ ] Button labels announced
- [ ] Link destinations announced
- [ ] Form inputs have labels
- [ ] Error messages associated with inputs

### Keyboard-Only Navigation
- [ ] All interactive elements reachable
- [ ] Logical tab order (top to bottom, left to right)
- [ ] Focus trap in modals/drawers
- [ ] No keyboard traps
- [ ] Visual focus always visible

### Color Contrast
**Tool**: Browser DevTools or WebAIM Contrast Checker

- [ ] Body text: 4.5:1 minimum (text-gray-900)
- [ ] Links: 4.5:1 minimum
- [ ] Buttons: 4.5:1 minimum
- [ ] Icons: 3:1 minimum (UI components)
- [ ] Dark mode: All contrasts maintained

### Text Sizing
- [ ] Base text: 16px minimum (text-sm = 14px for labels)
- [ ] Headings scaled appropriately
- [ ] Text doesn't break layout at 200% zoom
- [ ] Responsive text sizing

---

## Responsive Design Testing

### Breakpoints to Test:
- **Mobile**: 375px (iPhone SE), 414px (iPhone Pro Max)
- **Tablet**: 768px (iPad), 1024px (iPad Pro)
- **Desktop**: 1280px, 1440px, 1920px

### Mobile (< 768px)
- [ ] Sidebar hidden, drawer navigation
- [ ] Header condensed (icons only)
- [ ] Single column layouts
- [ ] Touch targets 44px minimum
- [ ] No horizontal scroll
- [ ] Content fits viewport

### Tablet (768px - 1023px)
- [ ] Sidebar still hidden (drawer)
- [ ] Header shows more info
- [ ] 2-column layouts where appropriate
- [ ] Proper spacing and padding

### Desktop (1024px+)
- [ ] Sidebar visible and fixed
- [ ] Header full width with search bar
- [ ] Multi-column layouts
- [ ] Optimal content width
- [ ] No wasted space

---

## Browser Compatibility Testing

### Modern Browsers
- [ ] Chrome/Edge (Chromium) - Latest
- [ ] Firefox - Latest
- [ ] Safari - Latest (Mac/iOS)
- [ ] Samsung Internet - Latest (Android)

### Features to Verify
- [ ] CSS Grid layouts
- [ ] Flexbox layouts
- [ ] CSS transitions and animations
- [ ] CSS custom properties (if used)
- [ ] JavaScript ES6+ features
- [ ] localStorage (dark mode persistence)

---

## Performance Testing

### Page Load
- [ ] Initial layout renders quickly (< 1s)
- [ ] No layout shift (CLS)
- [ ] Images load progressively
- [ ] Fonts load without FOUT/FOIT

### Interactions
- [ ] Drawer animation smooth (60fps)
- [ ] Navigation transitions smooth
- [ ] Search modal opens instantly
- [ ] No lag on hover states
- [ ] Scroll performance smooth

### Bundle Size
- [ ] Check layout component bundle size
- [ ] Verify code splitting working
- [ ] No duplicate dependencies

---

## Dark Mode Testing

### Visual Verification
- [ ] All components have dark mode styles
- [ ] No white flashes on toggle
- [ ] Contrast maintained in dark mode
- [ ] Colors inverted appropriately
- [ ] Images/logos work in dark mode

### Components to Check
- [ ] Header background and text
- [ ] Sidebar background and text
- [ ] Main content area
- [ ] Cards and containers
- [ ] Buttons and inputs
- [ ] Dropdowns and modals
- [ ] Footer
- [ ] Breadcrumbs
- [ ] Borders and dividers

---

## Integration Testing

### With Authentication
- [ ] User data displays in header
- [ ] Role badge shows correct color
- [ ] Protected routes redirect
- [ ] Logout clears session

### With Navigation
- [ ] Active states update on route change
- [ ] Breadcrumbs update on route change
- [ ] Deep links work correctly
- [ ] Back button navigation

### With Content
- [ ] Long content scrolls properly
- [ ] Tables responsive
- [ ] Forms submit correctly
- [ ] Modals don't break layout

---

## Automated Testing (Future)

### Unit Tests
```bash
# Run component tests
npm test -- src/components/layouts
```

### E2E Tests (Playwright/Cypress)
```bash
# Run E2E tests
npm run test:e2e
```

### Accessibility Tests
```bash
# Run axe accessibility tests
npm run test:a11y
```

---

## Bug Reporting Template

When reporting layout issues, include:

**Description**: Clear description of the issue

**Steps to Reproduce**:
1. Navigate to...
2. Click on...
3. Observe...

**Expected Behavior**: What should happen

**Actual Behavior**: What actually happens

**Screenshots**: Visual evidence

**Environment**:
- Browser: Chrome 120
- Device: Desktop / Mobile (specify)
- Screen Size: 1920x1080
- Dark Mode: On / Off

**Priority**: Critical / High / Medium / Low

---

## Sign-Off Checklist

Before marking layout system as production-ready:

- [ ] All manual tests passed
- [ ] Keyboard navigation verified
- [ ] Screen reader tested
- [ ] Responsive design verified at all breakpoints
- [ ] Browser compatibility confirmed
- [ ] Performance acceptable (< 1s load, 60fps animations)
- [ ] Dark mode fully functional
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Documentation complete
- [ ] Code review completed
- [ ] Stakeholder approval obtained

---

## Last Updated

**Date**: 2025-10-26
**Tested By**: [Your Name]
**Version**: 1.0.0
**Status**: Ready for Testing
