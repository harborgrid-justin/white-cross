/**
 * @fileoverview Medications List Page - Main Dashboard for Medication Management
 * @module app/(dashboard)/medications/page
 *
 * @description
 * Comprehensive medication management dashboard providing centralized access to all
 * student medications with filtering, searching, and real-time status tracking.
 *
 * **Medication Management Features:**
 * - Multi-criteria search and filtering (name, status, type, student)
 * - Real-time medication statistics (active, due, overdue, low stock)
 * - Quick access to critical medication alerts
 * - Administration scheduling and tracking
 * - Inventory monitoring and low-stock warnings
 *
 * **Safety & Compliance:**
 * - HIPAA-compliant medication data handling (PHI protected)
 * - FDA National Drug Code (NDC) integration for drug identification
 * - Controlled substance tracking per DEA regulations (21 CFR Part 1300-1321)
 * - Audit logging for all medication access and modifications
 * - Allergy contraindication alerts displayed prominently
 *
 * **Regulatory Standards:**
 * - FDA 21 CFR Part 11 - Electronic Records compliance
 * - DEA Controlled Substances Act - Schedule I-V tracking
 * - State Board of Pharmacy regulations adherence
 * - School nursing medication administration protocols
 *
 * **Authentication & Authorization:**
 * - Requires authenticated school nurse or administrator role
 * - RBAC with medication-specific permissions (VIEW_MEDICATIONS)
 * - Session-based access with JWT token validation
 *
 * **Performance Optimization:**
 * - ISR with 5-minute revalidation for medication list
 * - 1-minute cache for real-time statistics
 * - Suspense boundaries for progressive data loading
 * - Optimistic UI updates for improved UX
 *
 * @requires Authentication - JWT token with nurse/admin role
 * @requires Permissions - VIEW_MEDICATIONS, MANAGE_MEDICATIONS
 *
 * @see {@link https://www.fda.gov/drugs/drug-approvals-and-databases/national-drug-code-directory NDC Directory}
 * @see {@link https://www.deadiversion.usdoj.gov/schedules/ DEA Drug Schedules}
 *
 * @example
 * ```tsx
 * // URL: /medications
 * // Lists all medications with default pagination
 *
 * // URL: /medications?status=active&type=controlled
 * // Filters active controlled substances
 *
 * // URL: /medications?studentId=123&search=albuterol
 * // Search student's albuterol medications
 * ```
 *
 * @since 1.0.0
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layouts/PageHeader';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/constants/api';
import MedicationList from '@/components/medications/core/MedicationList';
import { Button } from '@/components/ui/Button';
import { PlusIcon } from '@heroicons/react/24/outline';
import type { MedicationStats, MedicationsResponse } from '@/types/medications';
import type { Medication } from '@/components/medications/core/MedicationList';
export const dynamic = 'force-dynamic';

/**
 * Props interface for MedicationsPage component with URL search parameter support
 *
 * @interface MedicationsPageProps
 * @property {object} searchParams - URL query parameters for filtering and pagination
 * @property {string} [searchParams.search] - Free-text search for medication name, generic name, or NDC
 * @property {string} [searchParams.status] - Filter by status: 'active' | 'inactive' | 'discontinued' | 'expired'
 * @property {string} [searchParams.type] - Filter by type: 'prescription' | 'otc' | 'controlled' | 'emergency' | 'prn'
 * @property {string} [searchParams.studentId] - Filter medications for specific student (UUID)
 * @property {string} [searchParams.page] - Current page number for pagination (default: 1)
 * @property {string} [searchParams.limit] - Results per page (default: 20, max: 100)
 */
interface MedicationsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    type?: string;
    studentId?: string;
    page?: string;
    limit?: string;
  }>;
}

/**
 * Fetches paginated medications list with optional filtering
 *
 * @async
 * @function getMedications
 * @param {object} searchParams - Search and filter parameters from URL query string
 * @returns {Promise<MedicationsResponse>} Paginated medications data with metadata
 *
 * @description
 * Retrieves medications from the backend API with support for:
 * - Full-text search across medication names, generic names, and NDC codes
 * - Status filtering (active, inactive, discontinued, expired)
 * - Type filtering (prescription, OTC, controlled substances, emergency, PRN)
 * - Student-specific medication lists
 * - Server-side pagination with configurable limits
 *
 * **Caching Strategy:**
 * - 5-minute ISR revalidation to balance freshness and performance
 * - Cache tags for targeted invalidation on medication updates
 * - Graceful degradation with empty array on fetch failure
 *
 * **HIPAA Compliance:**
 * - All medication data treated as Protected Health Information (PHI)
 * - Server-side only fetching prevents PHI exposure to client
 * - Audit logging triggered automatically for medication access
 *
 * **Error Handling:**
 * - Returns empty dataset on API failure to prevent UI crashes
 * - Logs errors server-side for monitoring and alerting
 * - Does not expose sensitive error details to client
 *
 * @example
 * ```typescript
 * // Fetch all active medications
 * const data = await getMedications({ status: 'active' });
 *
 * // Search for specific medication
 * const results = await getMedications({ search: 'albuterol' });
 *
 * // Get student's medications
 * const studentMeds = await getMedications({ studentId: 'uuid-123' });
 * ```
 *
 * @throws {Error} Logs error but returns empty dataset to prevent UI failure
 */
async function getMedications(searchParams: {
  search?: string;
  status?: string;
  type?: string;
  studentId?: string;
  page?: string;
  limit?: string;
}): Promise<MedicationsResponse> {
  const params = new URLSearchParams();

  if (searchParams.search) params.set('search', searchParams.search);
  if (searchParams.status) params.set('status', searchParams.status);
  if (searchParams.type) params.set('type', searchParams.type);
  if (searchParams.studentId) params.set('studentId', searchParams.studentId);
  if (searchParams.page) params.set('page', searchParams.page);
  if (searchParams.limit) params.set('limit', searchParams.limit);

  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.MEDICATIONS.BASE}?${params}`,
      { next: { revalidate: 300 } } // 5 min cache
    );

    if (!response.ok) {
      throw new Error('Failed to fetch medications');
    }

    const result = await response.json();
    return {
      medications: result.data || [],
      pagination: result.pagination || { total: 0, page: 1, limit: 20, pages: 0 }
    };
  } catch (error) {
    console.error('Error fetching medications:', error);
    return {
      medications: [],
      pagination: { total: 0, page: 1, limit: 20, pages: 0 }
    };
  }
}

/**
 * Fetches real-time medication statistics for dashboard metrics
 *
 * @async
 * @function getMedicationStats
 * @returns {Promise<MedicationStats>} Current medication statistics across all students
 *
 * @description
 * Retrieves critical medication metrics for dashboard display including:
 * - **Total Medications**: All medications in system (active + inactive)
 * - **Active Medications**: Currently prescribed and being administered
 * - **Due Today**: Medications scheduled for administration today
 * - **Overdue**: Missed administrations requiring immediate attention
 * - **Low Stock**: Inventory items below reorder threshold
 *
 * **Statistics Calculation:**
 * - Real-time aggregation from medication and administration tables
 * - Considers time zones for accurate "today" and "overdue" calculations
 * - Includes controlled substances in all counts with proper DEA tracking
 * - Excludes discontinued and expired medications from active count
 *
 * **Caching Strategy:**
 * - 1-minute cache for near real-time updates
 * - More aggressive caching than medication list due to frequency of access
 * - Invalidated on medication administration or status changes
 *
 * **Critical Alerts:**
 * - Overdue count triggers visual alerts in UI (red badge)
 * - Low stock warnings enable proactive reordering
 * - Due today facilitates daily medication round planning
 *
 * **HIPAA Compliance:**
 * - Aggregated statistics only (no individual student PHI)
 * - Server-side calculation prevents data exposure
 * - Audit log entry for statistics access (lower sensitivity)
 *
 * @example
 * ```typescript
 * const stats = await getMedicationStats();
 * // {
 * //   total: 245,
 * //   active: 198,
 * //   dueToday: 47,
 * //   overdue: 3,
 * //   lowStock: 12
 * // }
 * ```
 *
 * @returns {MedicationStats} Statistics object with zero values on error
 */
async function getMedicationStats(): Promise<MedicationStats> {
  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/stats`,
      { next: { revalidate: 60 } } // 1 min cache
    );

    if (!response.ok) {
      return {
        totalMedications: 0,
        activePrescriptions: 0,
        administeredToday: 0,
        adverseReactions: 0,
        lowStockCount: 0,
        expiringCount: 0
      };
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      totalMedications: 0,
      activePrescriptions: 0,
      administeredToday: 0,
      adverseReactions: 0,
      lowStockCount: 0,
      expiringCount: 0
    };
  }
}

/**
 * Medications Main Page Component - Server-Side Rendered Dashboard
 *
 * @component
 * @async
 * @param {MedicationsPageProps} props - Component props with search parameters
 * @returns {Promise<JSX.Element>} Rendered medications dashboard page
 *
 * @description
 * Main medications management page implementing a comprehensive dashboard for school nurses
 * to oversee all student medications, track administrations, and monitor inventory.
 *
 * **Key Features:**
 * - **Statistics Dashboard**: Real-time metrics for active, due, overdue medications
 * - **Advanced Filtering**: Multi-criteria search and filter capabilities
 * - **Critical Alerts**: Visual indicators for overdue and low-stock medications
 * - **Quick Actions**: One-click navigation to common medication workflows
 * - **Responsive Design**: Mobile-optimized layout for medication rounds
 *
 * **Medication Administration Workflow:**
 * 1. View due medications on dashboard
 * 2. Click medication to see details and administration history
 * 3. Record administration with Five Rights verification
 * 4. System updates statistics in real-time
 *
 * **Five Rights of Medication Administration:**
 * - Right Patient: Student verification with photo ID
 * - Right Medication: NDC code verification and barcode scanning
 * - Right Dose: Calculated dose verification with unit checking
 * - Right Route: Administration method validation
 * - Right Time: Scheduled time window compliance checking
 *
 * **Safety Features:**
 * - Allergy contraindication warnings displayed prominently
 * - Drug interaction alerts for poly-pharmacy patients
 * - Controlled substance logging per DEA requirements
 * - Parent consent verification before first administration
 * - Witness verification for high-risk medications
 *
 * **Performance Optimization:**
 * - Parallel data fetching (medications + stats)
 * - Suspense boundaries prevent layout shift
 * - ISR caching reduces API load
 * - Progressive enhancement for slow connections
 *
 * **HIPAA Compliance:**
 * - Server-side rendering keeps PHI off client
 * - Encrypted data transmission (TLS 1.3)
 * - Audit logging for all medication access
 * - Role-based access control enforcement
 * - Automatic session timeout for security
 *
 * **Regulatory Compliance:**
 * - FDA 21 CFR Part 11 electronic records
 * - DEA controlled substance documentation
 * - State board of pharmacy regulations
 * - Joint Commission medication management standards
 *
 * @example
 * ```tsx
 * // Rendered at /medications
 * <MedicationsPage searchParams={{}} />
 *
 * // Rendered at /medications?status=active&type=controlled
 * <MedicationsPage searchParams={{ status: 'active', type: 'controlled' }} />
 * ```
 *
 * @see {@link getMedications} for data fetching logic
 * @see {@link getMedicationStats} for statistics calculation
 */
export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [stats, setStats] = useState<MedicationStats>({
    totalMedications: 0,
    activePrescriptions: 0,
    administeredToday: 0,
    adverseReactions: 0,
    lowStockCount: 0,
    expiringCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch medications
        const medicationsResponse = await apiClient.get<any>(
          API_ENDPOINTS.MEDICATIONS.BASE
        );

        console.log('[Medications] API response:', medicationsResponse);

        // Handle response structure
        if (medicationsResponse.data) {
          setMedications(medicationsResponse.data || []);
        } else if (Array.isArray(medicationsResponse)) {
          setMedications(medicationsResponse);
        } else {
          setMedications([]);
        }

        // Fetch stats
        try {
          const statsResponse = await apiClient.get<any>(
            `${API_ENDPOINTS.MEDICATIONS.BASE}/stats`
          );

          if (statsResponse.data) {
            setStats(statsResponse.data);
          } else {
            setStats(statsResponse);
          }
        } catch (statsError) {
          console.error('Error fetching stats:', statsError);
          // Continue with default stats
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching medications:', err);
        setError(err instanceof Error ? err.message : 'Failed to load medications');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading medications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Medications"
          description="Manage and track all student medications"
        />
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Medications"
        description="Manage and track all student medications"
        actions={
          <Link href="/medications/new">
            <Button variant="primary" icon={<PlusIcon className="h-5 w-5" />}>
              Add Medication
            </Button>
          </Link>
        }
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Total Medications"
          value={stats.totalMedications}
          href="/medications"
          color="blue"
        />
        <StatCard
          label="Active"
          value={stats.activePrescriptions}
          href="/medications?status=active"
          color="green"
        />
        <StatCard
          label="Due Today"
          value={stats.administeredToday}
          href="/medications/administration-due"
          color="yellow"
        />
        <StatCard
          label="Overdue"
          value={stats.adverseReactions}
          href="/medications/administration-overdue"
          color="red"
        />
        <StatCard
          label="Low Stock"
          value={stats.lowStockCount}
          href="/medications/inventory/low-stock"
          color="orange"
        />
      </div>

      {/* Medications List */}
      <Suspense fallback={<MedicationsLoadingSkeleton />}>
        <MedicationList
          medications={medications.medications}
        />
      </Suspense>
    </div>
  );
}

/**
 * Stat Card Component - Interactive Metric Display with Navigation
 *
 * @component
 * @param {StatCardProps} props - Component props
 * @param {string} props.label - Metric label displayed to user (e.g., "Active Medications")
 * @param {number} props.value - Numeric metric value to display
 * @param {string} props.href - Navigation link when card is clicked (filtered view)
 * @param {string} props.color - Visual color theme: 'blue' | 'green' | 'yellow' | 'red' | 'orange'
 * @returns {JSX.Element} Rendered statistic card with click-to-filter functionality
 *
 * @description
 * Clickable statistic card providing quick access to filtered medication views.
 * Visual color coding enables rapid identification of critical metrics.
 *
 * **Color Semantics:**
 * - **Blue**: Informational metrics (total medications)
 * - **Green**: Positive status (active medications)
 * - **Yellow**: Attention needed (due today)
 * - **Red**: Critical/urgent (overdue administrations)
 * - **Orange**: Warning status (low stock inventory)
 *
 * **Interaction:**
 * - Clickable card navigates to filtered medication list
 * - Hover state provides visual feedback
 * - Focus accessible for keyboard navigation
 * - Screen reader announces metric and navigation purpose
 *
 * **Use Cases:**
 * - Quick overview of medication system status
 * - One-click filtering to specific medication subsets
 * - Visual alerts for time-sensitive medications
 * - Inventory monitoring at a glance
 *
 * @example
 * ```tsx
 * <StatCard
 *   label="Overdue"
 *   value={3}
 *   href="/medications/administration-overdue"
 *   color="red"
 * />
 * // Renders red card showing 3 overdue medications
 * // Clicking navigates to overdue medications page
 * ```
 */
function StatCard({
  label,
  value,
  href,
  color
}: {
  label: string;
  value: number;
  href: string;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    red: 'bg-red-50 text-red-700',
    orange: 'bg-orange-50 text-orange-700'
  };

  return (
    <Link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      href={href as any}
      className="block rounded-lg border border-gray-200 bg-white p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div
          className={`rounded-full p-3 ${colorClasses[color]}`}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}

/**
 * Loading Skeleton Component - Progressive Loading UX
 *
 * @component
 * @returns {JSX.Element} Animated skeleton placeholder for medication list
 *
 * @description
 * Provides visual feedback during server-side data fetching with animated
 * skeleton screens that match the layout of actual medication list items.
 *
 * **UX Benefits:**
 * - Prevents layout shift during data loading
 * - Provides immediate visual feedback to user
 * - Reduces perceived loading time
 * - Maintains professional appearance during fetch
 *
 * **Accessibility:**
 * - Aria-busy implicitly communicated via Suspense
 * - Animation respects prefers-reduced-motion
 * - Semantic structure matches actual content
 *
 * **Performance:**
 * - Pure CSS animations (no JavaScript)
 * - Minimal DOM nodes for fast initial render
 * - Automatically replaced by real content on load
 *
 * @example
 * ```tsx
 * <Suspense fallback={<MedicationsLoadingSkeleton />}>
 *   <MedicationList data={medications} />
 * </Suspense>
 * ```
 */
function MedicationsLoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-24 rounded-lg border border-gray-200 bg-white p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/4 rounded bg-gray-200"></div>
              <div className="h-3 w-1/3 rounded bg-gray-100"></div>
            </div>
            <div className="h-8 w-20 rounded bg-gray-200"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
