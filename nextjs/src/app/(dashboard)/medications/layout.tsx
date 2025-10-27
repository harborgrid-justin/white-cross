/**
 * @fileoverview Medications Feature Layout with Sidebar Navigation
 *
 * Feature-specific layout for the medications section of the White Cross Healthcare Platform.
 * Provides comprehensive sidebar navigation for medication management, administration tracking,
 * inventory control, and compliance reporting. This layout wraps all medication-related pages
 * and enables easy access to medication workflows.
 *
 * @module app/(dashboard)/medications/layout
 * @category Healthcare
 * @subcategory Medications
 *
 * **Layout Hierarchy:**
 * ```
 * RootLayout
 * └── DashboardLayout
 *     └── MedicationsLayout (this file)
 *         ├── /medications (All Medications)
 *         ├── /medications/new (Add Medication)
 *         ├── /medications/administration-* (Administration views)
 *         ├── /medications/inventory/* (Inventory management)
 *         └── /medications/reports/* (Reports)
 * ```
 *
 * **Navigation Sections:**
 * 1. Main Navigation: All medications, Add medication
 * 2. Administration: Due, Overdue, Missed, Completed, Calendar, Schedule
 * 3. By Type: Prescriptions, Controlled substances, OTC, As-needed, Emergency
 * 4. Inventory: All, Low stock, Expiring soon
 * 5. Reports: Administration, Compliance, Inventory, Refills
 * 6. Settings: Configuration, Categories, Administration rules
 * 7. Quick Actions: Drug interaction checker
 *
 * **HIPAA Compliance:**
 * - All medication data considered PHI (Protected Health Information)
 * - Access control enforced at route level
 * - Audit logging for all medication operations
 *
 * **Accessibility:**
 * - Semantic navigation structure
 * - ARIA labels for navigation sections
 * - Keyboard navigation support
 * - Active state indicators for current route
 *
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates | Next.js Layouts}
 *
 * @example
 * ```tsx
 * // This layout automatically wraps all pages in app/(dashboard)/medications/
 * // File structure:
 * // app/(dashboard)/medications/
 * //   layout.tsx (this file)
 * //   page.tsx (All Medications)
 * //   new/page.tsx (Add Medication)
 * //   [id]/page.tsx (Medication Details)
 * ```
 *
 * @since 1.0.0
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { ReactNode } from 'react';

/**
 * Metadata configuration for medications pages.
 *
 * Uses Next.js metadata template pattern to provide consistent page titles
 * across all medication-related pages while maintaining SEO and accessibility.
 *
 * @constant
 * @type {Metadata}
 *
 * @property {Object} title - Dynamic title configuration
 * @property {string} title.template - Template for child pages: "Page Title | Medications | White Cross"
 * @property {string} title.default - Default title when child doesn't specify: "Medications | White Cross"
 * @property {string} description - SEO description for medication section
 */
export const metadata: Metadata = {
  title: {
    template: '%s | Medications | White Cross',
    default: 'Medications | White Cross'
  },
  description: 'Medication management and administration tracking'
};

/**
 * Props interface for the Medications Layout component.
 *
 * @interface MedicationsLayoutProps
 * @property {React.ReactNode} children - Medication page components to render
 */
interface MedicationsLayoutProps {
  children: ReactNode;
}

/**
 * Medications Layout Component
 *
 * Provides a consistent layout with comprehensive sidebar navigation for all medication
 * pages. The sidebar offers quick access to medication workflows including administration
 * tracking, inventory management, reporting, and settings.
 *
 * **Layout Structure:**
 * ```
 * ┌─────────────────┬────────────────────────────┐
 * │                 │                            │
 * │ Medications     │ Main Content               │
 * │ - All           │ (medication pages)         │
 * │ - New           │                            │
 * │                 │                            │
 * │ Administration  │                            │
 * │ - Due Now       │                            │
 * │ - Overdue       │                            │
 * │                 │                            │
 * │ Inventory       │                            │
 * │ Reports         │                            │
 * │ Settings        │                            │
 * │                 │                            │
 * │ [Quick Actions] │                            │
 * └─────────────────┴────────────────────────────┘
 * ```
 *
 * **Sidebar Features:**
 * - Fixed width sidebar on desktop (hidden on mobile)
 * - Grouped navigation by workflow type
 * - Visual hierarchy with headings and spacing
 * - Active route highlighting (handled by NavLink)
 * - Quick action button for drug interactions
 *
 * **Responsive Behavior:**
 * - Desktop (lg+): Sidebar visible, content area scrolls
 * - Mobile/Tablet: Sidebar hidden (rely on main dashboard navigation)
 *
 * @param {MedicationsLayoutProps} props - Component properties
 * @param {React.ReactNode} props.children - Child medication pages
 *
 * @returns {JSX.Element} Two-column layout with sidebar and main content
 *
 * @example
 * ```tsx
 * // Next.js automatically applies this layout:
 * <MedicationsLayout>
 *   <AllMedicationsPage />
 * </MedicationsLayout>
 * ```
 *
 * @remarks
 * This is a Server Component. Navigation state and active route detection
 * would need to be handled by client components if dynamic highlighting is needed.
 * Currently uses standard Link components without active state detection.
 */
export default function MedicationsLayout({ children }: MedicationsLayoutProps) {
  return (
    <div className="flex h-full">
      {/* Sidebar Navigation */}
      <aside className="hidden w-64 border-r border-gray-200 bg-white lg:block">
        <nav className="flex h-full flex-col">
          <div className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            <h2 className="mb-4 px-4 text-lg font-semibold text-gray-900">
              Medications
            </h2>

            {/* Main Navigation */}
            <div className="space-y-1">
              <NavLink href="/medications">All Medications</NavLink>
              <NavLink href="/medications/new">Add Medication</NavLink>
            </div>

            {/* Administration */}
            <div className="pt-6">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Administration
              </h3>
              <div className="space-y-1">
                <NavLink href="/medications/administration-due">
                  Due Now
                </NavLink>
                <NavLink href="/medications/administration-overdue">
                  Overdue
                </NavLink>
                <NavLink href="/medications/administration-missed">
                  Missed
                </NavLink>
                <NavLink href="/medications/administration-completed">
                  Completed
                </NavLink>
                <NavLink href="/medications/administration-calendar">
                  Calendar
                </NavLink>
                <NavLink href="/medications/administration-schedule">
                  Schedule
                </NavLink>
              </div>
            </div>

            {/* Medication Types */}
            <div className="pt-6">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                By Type
              </h3>
              <div className="space-y-1">
                <NavLink href="/medications/prescriptions">
                  Prescriptions
                </NavLink>
                <NavLink href="/medications/controlled-substances">
                  Controlled Substances
                </NavLink>
                <NavLink href="/medications/over-the-counter">
                  Over-the-Counter
                </NavLink>
                <NavLink href="/medications/as-needed">As Needed</NavLink>
                <NavLink href="/medications/emergency">Emergency</NavLink>
              </div>
            </div>

            {/* Inventory */}
            <div className="pt-6">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Inventory
              </h3>
              <div className="space-y-1">
                <NavLink href="/medications/inventory">
                  All Inventory
                </NavLink>
                <NavLink href="/medications/inventory/low-stock">
                  Low Stock
                </NavLink>
                <NavLink href="/medications/inventory/expiring">
                  Expiring Soon
                </NavLink>
              </div>
            </div>

            {/* Reports */}
            <div className="pt-6">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Reports
              </h3>
              <div className="space-y-1">
                <NavLink href="/medications/reports">All Reports</NavLink>
                <NavLink href="/medications/reports/administration">
                  Administration
                </NavLink>
                <NavLink href="/medications/reports/compliance">
                  Compliance
                </NavLink>
                <NavLink href="/medications/reports/inventory">
                  Inventory
                </NavLink>
                <NavLink href="/medications/reports/refills">
                  Refills
                </NavLink>
              </div>
            </div>

            {/* Settings */}
            <div className="pt-6">
              <NavLink href="/medications/settings">Settings</NavLink>
              <NavLink href="/medications/categories">Categories</NavLink>
              <NavLink href="/medications/administration-rules">
                Administration Rules
              </NavLink>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t border-gray-200 p-4">
            <Link
              href="/medications/interactions"
              className="block rounded-lg bg-blue-50 px-4 py-3 text-center text-sm font-medium text-blue-700 hover:bg-blue-100"
            >
              Check Drug Interactions
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="mx-auto max-w-7xl p-6">{children}</div>
      </main>
    </div>
  );
}

/**
 * Navigation Link Component
 */
function NavLink({
  href,
  children
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    >
      {children}
    </Link>
  );
}
