/**
 * Students List Page - ISR Implementation (Enhanced Version)
 *
 * Implements:
 * - Incremental Static Regeneration with 5-minute revalidation
 * - Server-side data fetching for initial load
 * - Client-side filtering and pagination with TanStack Query
 * - Prefetching on hover
 *
 * @module app/students/page
 * @version 2.0.0
 */

import { Suspense } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Download,
  Users,
  Eye,
  FileText,
  Calendar,
} from 'lucide-react';

// UI Components
import { Card } from '@/components/ui/layout/Card';
import { Button } from '@/components/ui/Button';
import { SkeletonTable } from '@/components/ui/loading/SkeletonCard';

// Server utilities
import { serverGet } from '@/lib/server/fetch';

// Client components
import { StudentsFilters } from './components/StudentsFilters';
import { StudentsTable } from './components/StudentsTable';

// Types
import type { PaginatedStudentsResponse } from '@/types/student.types';

// ==========================================
// CONFIGURATION
// ==========================================

// Enable ISR with 5-minute revalidation
export const revalidate = 300; // 5 minutes

export const dynamic = 'force-static';

// ==========================================
// SERVER DATA FETCHING
// ==========================================

/**
 * Fetch students on the server for initial render
 */
async function getStudents(searchParams: {
  page?: string;
  search?: string;
  grade?: string;
}) {
  const params: Record<string, string | number | boolean> = {
    page: parseInt(searchParams.page || '1'),
    limit: 20,
    isActive: true,
  };

  if (searchParams.search) {
    params.search = searchParams.search;
  }

  if (searchParams.grade && searchParams.grade !== 'all') {
    params.grade = searchParams.grade;
  }

  return serverGet<PaginatedStudentsResponse>('/students', params, {
    revalidate: 300, // 5 minutes
    tags: ['students'],
  });
}

// ==========================================
// PAGE COMPONENT
// ==========================================

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; grade?: string };
}) {
  // Fetch initial data on server
  const initialData = await getStudents(searchParams);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="mt-1 text-gray-600">Manage student records and information</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" leftIcon={<Download />}>
            Export
          </Button>
          <Link href="/students/new">
            <Button leftIcon={<Plus />}>Add Student</Button>
          </Link>
        </div>
      </div>

      {/* Filters - Client Component */}
      <Suspense fallback={<div className="h-20 bg-gray-100 animate-pulse rounded-lg" />}>
        <StudentsFilters initialParams={searchParams} />
      </Suspense>

      {/* Students Table - Client Component with Server Data */}
      <Suspense fallback={<SkeletonTable rows={10} />}>
        <StudentsTable initialData={initialData} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

// ==========================================
// METADATA
// ==========================================

export async function generateMetadata() {
  return {
    title: 'Students | White Cross Healthcare',
    description: 'Manage student records and health information',
  };
}
