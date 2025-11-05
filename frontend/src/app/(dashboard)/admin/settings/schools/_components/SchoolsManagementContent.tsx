/**
 * @fileoverview Schools Management Content Component
 * @module app/(dashboard)/admin/settings/schools/_components/SchoolsManagementContent
 * @category Admin - Components
 */

'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { School, Plus, Download, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminDataTable } from '../../../_components/AdminDataTable';
import { exportData } from '@/lib/admin-utils';
import toast from 'react-hot-toast';
import type { School as SchoolType, SchoolSearchParams } from '@/lib/actions/admin.schools';

interface SchoolsManagementContentProps {
  initialSchools: SchoolType[];
  totalCount: number;
  searchParams: SchoolSearchParams;
  districts: { id: string; name: string }[];
}

/**
 * Client component for schools management with optimistic updates
 * Includes district filtering and enhanced table display
 */
export function SchoolsManagementContent({
  initialSchools,
  totalCount,
  searchParams,
  districts
}: SchoolsManagementContentProps) {
  const [schools] = useState(initialSchools);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Handle search with URL updates for server-side filtering
  const handleSearch = (query: string) => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (query) params.set('search', query);
      if (searchParams.status && searchParams.status !== 'all') {
        params.set('status', searchParams.status);
      }
      if (searchParams.districtId && searchParams.districtId !== 'all') {
        params.set('districtId', searchParams.districtId);
      }
      
      const url = params.toString() ? `?${params.toString()}` : '';
      router.push(`/admin/settings/schools${url}`);
    });
  };

  // Handle status filter change
  const handleStatusChange = (status: string) => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (searchParams.search) params.set('search', searchParams.search);
      if (status !== 'all') params.set('status', status);
      if (searchParams.districtId && searchParams.districtId !== 'all') {
        params.set('districtId', searchParams.districtId);
      }
      
      const url = params.toString() ? `?${params.toString()}` : '';
      router.push(`/admin/settings/schools${url}`);
    });
  };

  // Handle district filter change
  const handleDistrictChange = (districtId: string) => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (searchParams.search) params.set('search', searchParams.search);
      if (searchParams.status && searchParams.status !== 'all') {
        params.set('status', searchParams.status);
      }
      if (districtId !== 'all') params.set('districtId', districtId);
      
      const url = params.toString() ? `?${params.toString()}` : '';
      router.push(`/admin/settings/schools${url}`);
    });
  };

  // Handle export
  const handleExport = async () => {
    try {
      await exportData(schools, {
        format: 'csv',
        filename: `schools-export-${new Date().toISOString().split('T')[0]}`,
      });
      toast.success('Schools exported successfully');
    } catch (error) {
      toast.error('Failed to export schools');
    }
  };

  // Table columns configuration
  const columns = [
    {
      key: 'name',
      label: 'School',
      render: (school: SchoolType) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <School className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{school.name}</div>
            <div className="text-sm text-gray-500">Code: {school.code}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'district',
      label: 'District',
      render: (school: SchoolType) => (
        <div className="text-sm text-gray-900">{school.districtName}</div>
      ),
    },
    {
      key: 'principal',
      label: 'Principal',
      render: (school: SchoolType) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-900">{school.principalName}</span>
        </div>
      ),
    },
    {
      key: 'students',
      label: 'Students',
      render: (school: SchoolType) => (
        <span className="text-sm text-gray-900">{school.studentCount}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (school: SchoolType) => (
        <Badge variant={school.status === 'active' ? 'success' : 'secondary'}>
          {school.status}
        </Badge>
      ),
    },
  ];

  // Filter configuration
  const filters = [
    {
      key: 'status',
      label: 'Status',
      value: searchParams.status || 'all',
      onChange: handleStatusChange,
      options: [
        { value: 'all', label: 'All Statuses' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
    },
    {
      key: 'district',
      label: 'District',
      value: searchParams.districtId || 'all',
      onChange: handleDistrictChange,
      options: [
        { value: 'all', label: 'All Districts' },
        ...districts.map(district => ({
          value: district.id,
          label: district.name,
        })),
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Action buttons */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={isPending}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add School
        </Button>
      </div>

      {/* Data table with integrated search and filters */}
      <AdminDataTable
        data={schools}
        columns={columns}
        loading={isPending}
        searchPlaceholder="Search schools..."
        onSearch={handleSearch}
        onExport={handleExport}
        filters={filters}
        emptyMessage="No schools found"
        keyExtractor={(school) => school.id}
      />

      {/* Results summary */}
      {schools.length > 0 && (
        <div className="text-sm text-gray-600 text-center">
          Showing {schools.length} of {totalCount} schools
        </div>
      )}
    </div>
  );
}
