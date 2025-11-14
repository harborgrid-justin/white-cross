# Layout System Quick Start Guide

## TL;DR - Get Started in 5 Minutes

### 1. Start the Dev Server
```bash
npm run dev
```

### 2. View the Layouts
- **Auth Layout**: http://localhost:3000/login
- **Dashboard Layout**: http://localhost:3000/dashboard

### 3. Create a New Page

#### Dashboard Page (Authenticated)
```tsx
// File: src/app/(dashboard)/my-page/page.tsx
import { Container } from '@/components/layouts';

export default function MyPage() {
  return (
    <Container>
      <h1 className="text-2xl font-bold mb-4">My Page</h1>
      <p>Your content here</p>
    </Container>
  );
}
```

Access at: http://localhost:3000/my-page

#### Auth Page (Public)
```tsx
// File: src/app/(auth)/my-auth-page/page.tsx
export default function MyAuthPage() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Page</h1>
      <form>{/* Your form */}</form>
    </div>
  );
}
```

Access at: http://localhost:3000/my-auth-page

---

## Layout Features at a Glance

### Dashboard Layout Includes:
✅ Header (search, notifications, user menu, dark mode)
✅ Sidebar (navigation with all healthcare domains)
✅ Breadcrumbs (auto-generated from URL)
✅ Footer (HIPAA compliance, links)
✅ Mobile drawer navigation
✅ Responsive design
✅ Keyboard accessible

### Auth Layout Includes:
✅ Centered content area
✅ Healthcare branding
✅ HIPAA footer
✅ Background gradient
✅ Responsive design

---

## Components You Can Use

### Import All Layouts
```tsx
import {
  Header,
  Sidebar,
  MobileNav,
  Breadcrumbs,
  Container,
  Footer
} from '@/components/layouts';
```

### Container - Content Wrapper
```tsx
<Container maxWidth="lg">
  {/* Your content */}
</Container>
```

**Max Width Options**: `sm | md | lg | xl | 2xl | full`

### Breadcrumbs - Navigation Trail
```tsx
<Breadcrumbs customLabels={{ 'my-page': 'My Custom Label' }} />
```

Auto-generates from URL pathname.

---

## Adding Navigation Items

Edit: `src/components/layouts/Sidebar.tsx`

```typescript
const navigationSections: NavSection[] = [
  {
    title: 'My Section',
    collapsible: true,
    items: [
      {
        id: 'my-item',
        name: 'My Item',
        href: '/my-page',
        icon: Home, // Import from lucide-react
        badge: 5,
        badgeVariant: 'warning', // error | warning | success | default
      },
    ],
  },
];
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` or `Ctrl+K` | Open search |
| `ESC` | Close modals/drawers |
| `Tab` | Navigate forward |
| `Shift+Tab` | Navigate backward |

---

## Responsive Breakpoints

- **Mobile**: < 768px (drawer navigation)
- **Tablet**: 768px - 1023px (drawer navigation)
- **Desktop**: 1024px+ (fixed sidebar)

Test by resizing browser or using DevTools device emulation.

---

## Dark Mode

Toggle in header (moon/sun icon) or programmatically:

```tsx
document.documentElement.classList.toggle('dark');
```

All components support dark mode via Tailwind's `dark:` variant.

---

## Common Patterns

### Page with Title and Actions
```tsx
<Container>
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold">Page Title</h1>
    <button className="btn-primary">Action</button>
  </div>
  {/* Content */}
</Container>
```

### Grid Layout
```tsx
<Container>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Cards */}
  </div>
</Container>
```

### Card
```tsx
<div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
  <h2 className="text-lg font-semibold mb-4">Card Title</h2>
  <p>Card content</p>
</div>
```

---

## Troubleshooting

### Sidebar Not Showing
- Check screen size (sidebar hidden on mobile < 1024px)
- Use mobile drawer (hamburger menu) on small screens

### Breadcrumbs Not Generating
- Breadcrumbs only show for routes with path segments
- Root `/` and `/dashboard` don't show breadcrumbs by default

### Dark Mode Not Working
- Ensure Tailwind config includes `darkMode: 'class'`
- Check `<html>` element has `dark` class when toggled

### Layout Breaking
- Use `<Container>` for consistent max-width and padding
- Don't apply conflicting padding/margin to page content
- Check Tailwind classes for typos

---

## File Locations

```
src/
├── app/
│   ├── (auth)/
│   │   └── layout.tsx          # Auth layout
│   └── (dashboard)/
│       └── layout.tsx          # Dashboard layout
└── components/
    └── layouts/
        ├── Header.tsx          # Top nav
        ├── Sidebar.tsx         # Main nav
        ├── MobileNav.tsx       # Mobile drawer
        ├── Breadcrumbs.tsx     # Auto breadcrumbs
        ├── Container.tsx       # Content wrapper
        ├── Footer.tsx          # App footer
        └── README.md           # Full docs
```

---

## Need More Help?

1. **Full Documentation**: `src/components/layouts/README.md`
2. **Testing Guide**: `LAYOUT_TESTING_GUIDE.md`
3. **Implementation Summary**: `LAYOUT_IMPLEMENTATION_SUMMARY.md`
4. **This Quick Start**: `LAYOUT_QUICKSTART.md`

---

## Example: Complete Dashboard Page

```tsx
// src/app/(dashboard)/students/page.tsx
import { Container } from '@/components/layouts';
import { Users, Plus } from 'lucide-react';

export default function StudentsPage() {
  return (
    <Container>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Students
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage student records and health information
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="h-4 w-4" />
          Add Student
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-primary-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">1,234</p>
            </div>
          </div>
        </div>
        {/* More stat cards */}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="p-6">
          {/* Your table, list, or content here */}
          <p className="text-gray-500 dark:text-gray-400">Student list goes here</p>
        </div>
      </div>
    </Container>
  );
}
```

---

## That's It!

You now have a fully functional, production-ready layout system.

Start building your pages and the layout will handle:
- Navigation
- Breadcrumbs
- Header/Footer
- Responsive design
- Accessibility
- Dark mode

**Happy coding! 🚀**
