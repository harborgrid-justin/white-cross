# Layout System - White Cross Healthcare Platform

## Overview

This directory contains the production-ready layout system for the White Cross Healthcare Platform built with Next.js 16 App Router. The system provides a comprehensive, accessible, and responsive layout infrastructure for the entire application.

## Architecture

### Layout Groups

#### 1. Auth Layout Group - `(auth)/layout.tsx`
**Purpose**: Provides a clean, centered layout for authentication pages (login, forgot password, etc.)

**Features**:
- Full-screen centered design
- Healthcare branding with background pattern
- Accessibility skip links
- HIPAA compliance footer
- Responsive on all devices
- Dark mode support

**Pages Using This Layout**:
- `/login`
- `/access-denied`
- `/session-expired`

---

#### 2. Dashboard Layout Group - `(dashboard)/layout.tsx`
**Purpose**: Main application shell for all authenticated pages

**Features**:
- Responsive sidebar (desktop) and drawer (mobile)
- Top navigation header with search, notifications, user menu
- Auto-generated breadcrumbs
- Sticky header and sidebar
- Skip to main content accessibility
- Dark mode support
- Footer with compliance information

**Pages Using This Layout**:
- `/dashboard`
- `/students`
- `/medications`
- `/appointments`
- All other authenticated application pages

---

## Components

### Header (`Header.tsx`)

Top navigation bar with comprehensive features.

**Features**:
- Mobile menu toggle (hamburger icon)
- Global search with keyboard shortcut (⌘K / Ctrl+K)
- Notifications center with badge indicator
- User menu with profile, settings, and logout
- Dark mode toggle
- Responsive design (mobile and desktop layouts)
- Keyboard accessible
- Screen reader support

**Props**:
```typescript
interface HeaderProps {
  onMenuClick: () => void;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}
```

**Usage**:
```tsx
<Header
  onMenuClick={() => setMobileMenuOpen(true)}
  user={currentUser}
/>
```

---

### Sidebar (`Sidebar.tsx`)

Main navigation sidebar with hierarchical structure.

**Features**:
- Collapsible navigation sections
- Active link highlighting
- Icon-based navigation
- Badge indicators (counts, alerts)
- Role-based access control ready
- Keyboard accessible
- Smooth animations
- Dark mode support

**Navigation Structure**:
- **Main**: Dashboard
- **Clinical**: Students, Health Records, Medications, Appointments
- **Operations**: Inventory, Budget, Purchase Orders, Vendors
- **Communications**: Messages, Notifications, Reminders
- **Incidents & Reports**: Incident Reports, Documents, Reports
- **Analytics**: Analytics
- **System**: Admin Settings, Settings

**Props**:
```typescript
interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}
```

**Usage**:
```tsx
<Sidebar className="flex-1 h-full" onNavigate={() => closeMobileMenu()} />
```

---

### MobileNav (`MobileNav.tsx`)

Mobile navigation drawer component.

**Features**:
- Slide-in animation from left
- Backdrop overlay with click-to-close
- ESC key to close
- Focus trap (keyboard accessibility)
- Prevents body scroll when open
- Smooth transitions
- Full sidebar navigation on mobile

**Props**:
```typescript
interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Usage**:
```tsx
<MobileNav
  isOpen={mobileMenuOpen}
  onClose={() => setMobileMenuOpen(false)}
/>
```

---

### Breadcrumbs (`Breadcrumbs.tsx`)

Auto-generated breadcrumb navigation from current pathname.

**Features**:
- Automatically generates breadcrumbs from URL
- Clickable breadcrumb links
- Custom label overrides
- Proper ARIA labels
- Responsive text truncation
- Screen reader support
- Home icon for root

**Props**:
```typescript
interface BreadcrumbsProps {
  customLabels?: Record<string, string>;
  className?: string;
}
```

**Default Labels**:
```typescript
const defaultLabels = {
  dashboard: 'Dashboard',
  students: 'Students',
  'health-records': 'Health Records',
  medications: 'Medications',
  // ... and more
};
```

**Usage**:
```tsx
<Breadcrumbs
  customLabels={{ 'custom-page': 'My Custom Page' }}
  className="mb-4"
/>
```

---

### Container (`Container.tsx`)

Content container with consistent padding and max-width.

**Features**:
- Responsive max-width options
- Consistent padding across breakpoints
- Optional full-width mode
- Optional no-padding mode
- Dark mode support

**Props**:
```typescript
interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  noPadding?: boolean;
}
```

**Usage**:
```tsx
<Container maxWidth="lg">
  <h1>Page Content</h1>
</Container>
```

---

### Footer (`Footer.tsx`)

Application footer with compliance and navigation.

**Features**:
- Copyright information
- HIPAA compliance notice
- Version display
- Links (Privacy, Terms, Support)
- Responsive layout
- Dark mode support

**Usage**:
```tsx
<Footer />
```

---

## Responsive Breakpoints

The layout system uses Tailwind CSS breakpoints:

- **Mobile**: `< 768px` (default)
- **Tablet**: `768px - 1023px` (`md:`)
- **Desktop**: `1024px+` (`lg:`)
- **Large Desktop**: `1280px+` (`xl:`)

### Mobile Behavior:
- Sidebar hidden, drawer navigation via hamburger menu
- Search icon only (no search bar)
- Condensed header
- Full-width content

### Desktop Behavior:
- Fixed sidebar (256px width)
- Full search bar in header
- User info displayed in header
- Multi-column layouts

---

## Keyboard Navigation

### Global Shortcuts:
- **⌘K / Ctrl+K**: Open search
- **ESC**: Close modals, dropdowns, drawers
- **Tab**: Navigate through interactive elements
- **Enter**: Activate links and buttons

### Focus Management:
- Skip to main content link
- Focus trap in mobile drawer
- Focus trap in search modal
- Visible focus indicators
- Logical tab order

---

## Accessibility (WCAG 2.1 AA Compliant)

### Features:
- ✅ Semantic HTML structure
- ✅ ARIA labels and roles
- ✅ Skip to main content link
- ✅ Keyboard navigation support
- ✅ Focus indicators (ring-2 ring-primary-500)
- ✅ Screen reader announcements
- ✅ Color contrast compliance (4.5:1 minimum)
- ✅ Responsive text sizes (minimum 16px)
- ✅ Focus trap in modals/drawers
- ✅ aria-current for active navigation
- ✅ aria-expanded for expandable sections
- ✅ aria-label for icon-only buttons

---

## Dark Mode Support

All layout components support dark mode via Tailwind's `dark:` variant.

### Implementation:
```tsx
// Toggle dark mode
document.documentElement.classList.toggle('dark');

// Dark mode classes example
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  Content
</div>
```

### Recommended Color Palette:
- **Light Mode**:
  - Background: `bg-gray-50`
  - Cards: `bg-white`
  - Text: `text-gray-900`
  - Borders: `border-gray-200`

- **Dark Mode**:
  - Background: `dark:bg-gray-950`
  - Cards: `dark:bg-gray-800`
  - Text: `dark:text-gray-100`
  - Borders: `dark:border-gray-700`

---

## Adding New Pages

### Dashboard Pages (Authenticated):
```typescript
// File: src/app/(dashboard)/your-page/page.tsx
import { Container } from '@/components/layouts/Container';

export default function YourPage() {
  return (
    <Container>
      <h1>Your Page Title</h1>
      {/* Your content */}
    </Container>
  );
}
```

### Auth Pages (Public):
```typescript
// File: src/app/(auth)/your-auth-page/page.tsx
export default function YourAuthPage() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
      <h1>Auth Page Title</h1>
      {/* Your auth form */}
    </div>
  );
}
```

---

## Customization

### Adding Navigation Items:

Edit `Sidebar.tsx` navigation structure:

```typescript
const navigationSections: NavSection[] = [
  {
    title: 'Your Section',
    collapsible: true,
    items: [
      {
        id: 'your-page',
        name: 'Your Page',
        href: '/your-page',
        icon: YourIcon,
        badge: 5,
        badgeVariant: 'warning',
      },
    ],
  },
];
```

### Adding Breadcrumb Labels:

Edit `Breadcrumbs.tsx` default labels:

```typescript
const defaultLabels: Record<string, string> = {
  'your-route': 'Your Custom Label',
};
```

Or pass custom labels as prop:

```tsx
<Breadcrumbs customLabels={{ 'your-route': 'Custom Label' }} />
```

---

## Performance Optimizations

- Client components only where needed (`'use client'`)
- Server components by default (Next.js 16)
- Lazy loading of heavy components
- CSS transitions with `prefers-reduced-motion` support
- Optimized re-renders with React memoization
- Efficient state management

---

## Testing

### Manual Testing Checklist:

- [ ] Mobile drawer opens and closes smoothly
- [ ] Search modal opens with ⌘K shortcut
- [ ] User menu dropdown functions correctly
- [ ] Dark mode toggle works
- [ ] Breadcrumbs generate correctly from URL
- [ ] Active link highlighting works
- [ ] Keyboard navigation (Tab, Enter, ESC)
- [ ] Screen reader announces navigation
- [ ] Footer displays on all pages
- [ ] Responsive layouts at all breakpoints

### Browser Testing:
- Chrome, Firefox, Safari, Edge
- Mobile: iOS Safari, Android Chrome
- Screen readers: NVDA, JAWS, VoiceOver

---

## File Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── layout.tsx          # Auth layout group
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Dashboard layout group
│   │   └── dashboard/
│   │       └── page.tsx        # Example dashboard page
│   └── layout.tsx              # Root layout
└── components/
    └── layouts/
        ├── Header.tsx          # Top navigation header
        ├── Sidebar.tsx         # Main navigation sidebar
        ├── MobileNav.tsx       # Mobile drawer navigation
        ├── Breadcrumbs.tsx     # Auto-generated breadcrumbs
        ├── Container.tsx       # Content container
        ├── Footer.tsx          # Application footer
        ├── index.ts            # Centralized exports
        └── README.md           # This file
```

---

## Dependencies

- **Next.js 16**: App Router with layout groups
- **React 19**: Client and server components
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **TypeScript**: Type safety

---

## Support

For questions or issues with the layout system, contact the development team or refer to the main project documentation.

**Last Updated**: 2025-10-26
**Version**: 1.0.0
**Author**: UI/UX Architect Agent
