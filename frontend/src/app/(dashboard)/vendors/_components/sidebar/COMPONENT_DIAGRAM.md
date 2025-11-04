# VendorsSidebar Component Visual Structure

## Component Hierarchy

```
VendorsSidebar.refactored.tsx (Main Wrapper - 143 lines)
│
├── Header Section (Inline)
│   ├── Title: "Vendor Management"
│   └── Subtitle: "Healthcare vendor operations and compliance"
│
├── VendorStats.tsx (143 lines)
│   └── 4 Metric Cards
│       ├── Total Vendors (47, +3 this month)
│       ├── Active Orders (23, +15%)
│       ├── Total Spend ($125K, +8.2%)
│       └── Avg Delivery (5.2 days, -0.5 days)
│
├── VendorQuickActions.tsx (169 lines)
│   └── 2×2 Grid of Action Buttons
│       ├── Add New Vendor (Blue)
│       ├── Create Purchase Order (Green)
│       ├── Generate Report (Purple)
│       └── Compliance Review (Yellow)
│
├── VendorNavigation.tsx (411 lines)
│   ├── Uses: useSidebarSections()
│   ├── Uses: useActiveNavigation()
│   ├── Uses: useBadgeStyling()
│   └── 6 Navigation Sections
│       ├── Vendor Overview [47]
│       ├── Vendor Management [expandable]
│       │   ├── All Vendors [47]
│       │   ├── Add New Vendor
│       │   └── Categories [8]
│       ├── Performance Analytics [expandable]
│       │   ├── Performance Dashboard
│       │   ├── Delivery Tracking [96%]
│       │   └── Quality Metrics [4.7/5]
│       ├── Compliance Tracking [3] [expandable]
│       │   ├── Certifications [15]
│       │   ├── Expiring Soon [3]
│       │   └── Documentation [42]
│       ├── Purchase Orders [23] [expandable]
│       │   ├── Active Orders [23]
│       │   ├── Create New Order
│       │   └── Order History [156]
│       └── Reports & Analytics [expandable]
│           ├── Vendor Reports
│           ├── Spend Analysis [$125K]
│           └── Export Data
│
├── VendorActivity.tsx (189 lines)
│   └── Activity Feed (4 items)
│       ├── Order: Medical Supplies Inc. (2h ago)
│       ├── Certification: Pharma Distributors (4h ago)
│       ├── Payment: First Aid Solutions (1d ago)
│       └── Performance: Emergency Medical Supply (2d ago)
│
└── VendorAlerts.tsx (197 lines)
    └── 2 Alert Cards
        ├── Warning: 3 Certifications Expiring
        └── Success: All Orders On Track
```

## Supporting Files

```
sidebar/
│
├── types.ts (97 lines)
│   └── Type Definitions
│       ├── VendorSection
│       ├── VendorSubItem
│       ├── VendorMetric
│       ├── QuickAction
│       ├── VendorActivity
│       ├── VendorAlert
│       └── Color Types (BadgeColor, ActionColor)
│
├── hooks.ts (181 lines)
│   └── Custom Hooks
│       ├── useSidebarSections()
│       │   ├── expandedSections: Set<string>
│       │   ├── toggleSection(id): void
│       │   ├── isExpanded(id): boolean
│       │   ├── expandSection(id): void
│       │   ├── collapseSection(id): void
│       │   ├── collapseAll(): void
│       │   └── expandAll(ids): void
│       │
│       ├── useActiveNavigation()
│       │   ├── isActive(href): boolean
│       │   ├── isActiveStrict(href): boolean
│       │   ├── isAnyActive(hrefs): boolean
│       │   └── pathname: string
│       │
│       └── useBadgeStyling()
│           └── getBadgeClasses(color): string
│
└── index.ts (37 lines)
    └── Public Exports
        ├── Components (5)
        ├── Hooks (3)
        └── Types (8)
```

## Data Flow

```
Default Data (Inline Constants)
    │
    ├──> VendorStats ──> 4 Metric Objects
    ├──> VendorQuickActions ──> 4 Action Objects
    ├──> VendorNavigation ──> 6 Section Objects
    ├──> VendorActivity ──> 4 Activity Objects
    └──> VendorAlerts ──> 2 Alert Objects

Navigation State
    │
    └──> useSidebarSections Hook
         └──> Set<string> (expanded sections)
              └──> VendorNavigation Component

Route State
    │
    └──> useActiveNavigation Hook
         └──> pathname (from Next.js)
              └──> VendorNavigation Component

Badge Styling
    │
    └──> useBadgeStyling Hook
         └──> Color → CSS Classes Mapping
              └──> VendorNavigation Component
```

## Component Line Distribution

```
┌────────────────────────────────────────────────┐
│ Component Name                  │ Lines │ %    │
├────────────────────────────────────────────────┤
│ VendorNavigation.tsx            │  411  │ 29%  │
│ VendorAlerts.tsx                │  197  │ 14%  │
│ VendorActivity.tsx              │  189  │ 13%  │
│ hooks.ts                        │  181  │ 13%  │
│ VendorQuickActions.tsx          │  169  │ 12%  │
│ VendorsSidebar.refactored.tsx   │  143  │ 10%  │
│ VendorStats.tsx                 │  143  │ 10%  │
│ types.ts                        │   97  │  7%  │
│ index.ts                        │   37  │  2%  │
├────────────────────────────────────────────────┤
│ Total                           │ 1,567 │ 100% │
└────────────────────────────────────────────────┘

Original: 772 lines (1 file)
Refactored: 1,567 lines (9 files, including wrapper)
Main wrapper: 143 lines (81% reduction)
```

## Import Graph

```
VendorsSidebar.refactored.tsx
    ├── import { VendorStats } from './sidebar'
    ├── import { VendorQuickActions } from './sidebar'
    ├── import { VendorNavigation } from './sidebar'
    ├── import { VendorActivity } from './sidebar'
    └── import { VendorAlerts } from './sidebar'

sidebar/index.ts
    ├── export { default as VendorStats } from './VendorStats'
    ├── export { default as VendorQuickActions } from './VendorQuickActions'
    ├── export { default as VendorNavigation } from './VendorNavigation'
    ├── export { default as VendorActivity } from './VendorActivity'
    ├── export { default as VendorAlerts } from './VendorAlerts'
    ├── export { useSidebarSections, ... } from './hooks'
    └── export type { VendorSection, ... } from './types'

VendorStats.tsx
    └── import type { VendorMetric } from './types'

VendorQuickActions.tsx
    ├── import { useRouter } from 'next/navigation'
    └── import type { QuickAction } from './types'

VendorNavigation.tsx
    ├── import Link from 'next/link'
    ├── import { useActiveNavigation, useSidebarSections, useBadgeStyling } from './hooks'
    └── import type { VendorSection } from './types'

VendorActivity.tsx
    └── import type { VendorActivity as VendorActivityType } from './types'

VendorAlerts.tsx
    └── import type { VendorAlert } from './types'

hooks.ts
    ├── import { useState, useCallback } from 'react'
    └── import { usePathname } from 'next/navigation'

types.ts
    └── import { ComponentType } from 'react'
```

## Key Metrics

| Metric | Value |
|--------|-------|
| Total Components | 5 main + 1 wrapper = 6 |
| Total Hooks | 3 custom hooks |
| Total Type Definitions | 8 interfaces/types |
| Average Component Size | ~170 lines |
| Original Component Size | 772 lines |
| Largest Component | VendorNavigation (411 lines) |
| Smallest Component | VendorStats (143 lines) |
| Total Files | 9 files |
| Lines Saved in Main | 629 lines (81% reduction) |

## Testing Isolation

```
Component Tests (React Testing Library)
    ├── VendorStats.test.tsx
    │   └── Test metric rendering, change indicators
    ├── VendorQuickActions.test.tsx
    │   └── Test button clicks, navigation, callbacks
    ├── VendorNavigation.test.tsx
    │   └── Test section expansion, active states, navigation
    ├── VendorActivity.test.tsx
    │   └── Test activity rendering, status colors, timestamps
    └── VendorAlerts.test.tsx
        └── Test alert types, dismissal, accessibility

Hook Tests (renderHook)
    ├── hooks.test.tsx
    │   ├── useSidebarSections: expansion, toggling, collapse
    │   ├── useActiveNavigation: route matching, active states
    │   └── useBadgeStyling: color class mapping

Integration Tests
    └── VendorsSidebar.test.tsx
        └── Test full sidebar rendering, all sections visible

Type Tests
    └── types.test.ts
        └── TypeScript type checking
```

## Accessibility Features

```
ARIA Attributes:
├── VendorsSidebar.refactored.tsx
│   ├── role="complementary"
│   └── aria-label="Vendor management sidebar"
│
├── VendorStats.tsx
│   ├── role="status" (each metric)
│   └── aria-label with metric details
│
├── VendorQuickActions.tsx
│   ├── role="group"
│   ├── aria-label for each button
│   └── focus:ring for keyboard nav
│
├── VendorNavigation.tsx
│   ├── role="navigation"
│   ├── aria-expanded (expandable sections)
│   ├── aria-controls (section relationships)
│   ├── aria-current="page" (active items)
│   └── focus:ring for keyboard nav
│
├── VendorActivity.tsx
│   ├── role="feed"
│   ├── role="article" (each item)
│   └── aria-label for activity details
│
└── VendorAlerts.tsx
    ├── role="alert" (error/warning)
    ├── role="status" (success/info)
    ├── aria-live="assertive" (urgent)
    └── aria-live="polite" (informational)
```

---

**Created:** 2025-11-04
**Version:** 1.0.0
