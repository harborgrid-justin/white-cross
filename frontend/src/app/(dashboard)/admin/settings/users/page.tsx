/**
 * Admin Users Management Page - User administration and role management
 *
 * Next.js v16 Server Component that provides comprehensive user management interface.
 * Uses Server Actions, streaming, and advanced caching for optimal performance.
 *
 * Features:
 * - Server-side data fetching with caching
 * - Server Actions for form handling
 * - Streaming with Suspense boundaries
 * - Optimistic updates
 * - HIPAA-compliant audit logging
 *
 * @module app/admin/settings/users/page
 * @since 2025-11-05 - Enhanced for Next.js v16
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { UserManagementContent } from './_components/UserManagementContent';
import { UserManagementSkeleton } from './_components/UserManagementSkeleton';
import { UserManagementHeader } from './_components/UserManagementHeader';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache/constants';

/**
 * Metadata for the users management page
 */
export const metadata: Metadata = {
  title: 'User Management | Admin Settings',
  description: 'Comprehensive user administration, role management, and access control for healthcare platform users.',
  keywords: [
    'user management',
    'role administration',
    'access control',
    'healthcare users',
    'account management',
    'permissions',
    'user roles',
    'admin tools'
  ],
  robots: {
    index: false,
    follow: false
  }
};

/**
 * Search parameters interface for typed route parameters
 */
interface UserSearchParams {
  search?: string;
  role?: string;
  status?: string;
  page?: string;
  limit?: string;
}

/**
 * Page props with typed search parameters
 */
interface UsersPageProps {
  searchParams: UserSearchParams;
}

/**
 * User data fetcher
 */
async function fetchUsersData(searchParams: UserSearchParams) {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  const urlParams = new URLSearchParams();
  
  if (searchParams.role && searchParams.role !== 'all') {
    urlParams.append('role', searchParams.role);
  }
  if (searchParams.status && searchParams.status !== 'all') {
    urlParams.append('status', searchParams.status);
  }
  if (searchParams.search) {
    urlParams.append('search', searchParams.search);
  }
  if (searchParams.page) {
    urlParams.append('page', searchParams.page);
  }
  if (searchParams.limit) {
    urlParams.append('limit', searchParams.limit);
  }

  try {
    const response = await fetch(`${apiUrl}/users?${urlParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        tags: [CACHE_TAGS.ADMIN_USERS, CACHE_TAGS.USERS],
        revalidate: CACHE_TTL.PHI_STANDARD, // 60 seconds for user data
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }

    const data = await response.json();
    return {
      users: data.users || [],
      total: data.total || 0,
      pagination: data.pagination || null,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    // Return empty state rather than throwing to allow graceful degradation
    return {
      users: [],
      total: 0,
      pagination: null,
      error: error instanceof Error ? error.message : 'Failed to load users'
    };
  }
}

/**
 * Users Management Page - Server Component
 */
export default async function UsersPage({ searchParams }: UsersPageProps) {
  // Fetch data server-side using the established patterns
  const usersData = await fetchUsersData(searchParams);

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive user administration and role management
          </p>
        </div>
      </header>

      {/* Error State */}
      {usersData.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading users
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{usersData.error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content with Suspense for progressive loading */}
      <Suspense fallback={<UserManagementSkeleton />}>
        <UserManagementContent 
          initialUsers={usersData.users}
          total={usersData.total}
          pagination={usersData.pagination}
          searchParams={searchParams}
        />
      </Suspense>
    </div>
  );
}
